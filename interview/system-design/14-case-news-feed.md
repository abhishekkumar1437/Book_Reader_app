---
title: Case Study — News Feed
part: Case Studies
summary: Twitter, Instagram, LinkedIn: the same question. Fan-out on write versus fan-out on read, the hybrid for celebrities, the timeline cache, ranking, and keeping the feed fresh without melting the database.
---

## Why this question

It is the archetypal read-heavy, fan-out-heavy system. The key decision, when to do the expensive work, has a clear trade-off and a well-known hybrid answer, and the interviewer can push in several directions: hot users, ranking, media, consistency of counters. It is also a question where estimation genuinely changes the design.

## Phase 1: Requirements

**Functional**

- Users follow other users.
- A user posts text with optional media.
- A user's home feed shows recent posts from people they follow, newest first (assume chronological; ranking is a follow-up).
- Likes and comments exist but are secondary; ask whether to include.

**Non-functional**

- Feed load must be fast: under 200 ms end to end, ideally served from memory.
- Posting must feel instant to the author; appearing in followers' feeds within a few seconds is acceptable (eventual consistency).
- Read-heavy: feed reads far outnumber posts.
- Highly available; losing a post is unacceptable.

## Phase 2: Estimation

```
Daily active users:  150 million
Posts:               2 per user per day  → 3,000 per second average, ~10,000 peak
Feed reads:          20 per user per day → 30,000 per second average, ~100,000 peak
Average followers:   200  → fan-out writes: 3,000 × 200 = 600,000 timeline inserts per second
Post text storage:   3,000 × 86,400 × 300 B ≈ 80 GB per day (small); media dominates and goes to object storage
Timeline cache:      150M users × 500 post ids × 8 B ≈ 600 GB across the cache cluster
```

Conclusion: feed reads cannot be computed with a database query at 100,000 per second across 200 followees each. They must be served from a precomputed, in-memory timeline. Fan-out at 600,000 inserts per second is heavy but feasible for a cache cluster if asynchronous.

## Phase 3: API

```
POST /v1/posts                     { text, media_ids[] }        → 201 { post_id }
GET  /v1/feed?cursor=&limit=20     → { posts: [...], next_cursor }
POST /v1/users/{id}/follow         → 204
GET  /v1/users/{id}/posts?cursor=  → the profile timeline
```

## Phase 3: High-level design

```
   POST /posts                                       GET /feed
       │                                                 │
       ▼                                                 ▼
 +-----------+   1. write post    +------------+   +-----------+  4. read ids   +-----------------+
 |  Post     | ─────────────────> |  Posts DB  |   |  Feed     | ─────────────> | Timeline cache  |
 |  service  |   2. outbox event  | (sharded)  |   |  service  |                | user → post ids |
 +-----+-----+                    +------------+   +-----+-----+                +-----------------+
       │                                                 │ 5. hydrate
       ▼                                                 ▼
 +-----------+   3. for each follower,           +-----------------+     +------------+
 |  Fan-out  | ─── push post id into ──────────> |  Post cache     | ──> |  Posts DB  |
 |  workers  |     their timeline cache          | id → post body  |     | (on miss)  |
 +-----------+                                   +-----------------+     +------------+
       ▲
 +-----+-----+
 | Follow    |  followers of author (graph service, cached)
 | graph     |
 +-----------+
```

**Data model**

```
posts      (post_id PK [snowflake], author_id, text, media_keys[], created_at)     sharded by post_id or author_id
follows    (follower_id, followee_id, created_at)   PK (follower_id, followee_id); index (followee_id) for "who follows X"
timelines  in Redis: key user:{id}:timeline → sorted set of post_id scored by time, trimmed to ~800 entries
```

## Deep dive 1: Fan-out on write versus fan-out on read

**Fan-out on write (push).** When a user posts, push the post id into every follower's timeline cache. Feed reads are a single cache lookup: fast, cheap, and the cost is paid once at write time. The cost grows with follower count: a user with 20 million followers means 20 million cache writes per post, which takes minutes and hammers the cluster. Inactive users' timelines are filled with posts they never read (wasted work).

**Fan-out on read (pull).** Store nothing at post time. When a user opens the feed, fetch the recent posts of each followee and merge. Writes are cheap; reads are expensive (200 lookups and a merge) and slow, and the load lands on the read path at peak.

**The hybrid, which is the expected answer.** Push for normal users. For accounts above a follower threshold (say 100,000 or so), do not fan out; instead, at read time, fetch those few celebrities' recent posts and merge them into the pre-built timeline. Each user follows only a handful of celebrities, so the read-time merge is small. Additionally, skip fan-out to users inactive for more than some period; build their timeline on demand when they return.

State it crisply: "push for the many, pull for the few, skip the dormant."

## Deep dive 2: The write path in detail

1. The post service validates and writes the post row (and media metadata) to the posts database, plus an outbox row, in one transaction. It writes the post body into the post cache. Responds to the author immediately with the post id; the author's own profile timeline shows it at once (read-your-writes from the primary or cache).
2. The outbox relay publishes `post_created(post_id, author_id)` to a log partitioned by author id.
3. Fan-out workers consume. For each event: fetch the author's follower list (from the follow graph service, which caches follower lists in Redis; 200 ids on average, up to millions), and for each follower in batches, `ZADD` the post id into `user:{follower}:timeline` with the timestamp as score, then `ZREMRANGEBYRANK` to keep the newest 800.
4. If the author is a celebrity, the worker skips fan-out; the post is only in the post cache and the author's profile timeline.

Fan-out workers scale horizontally up to the number of partitions. A celebrity post does not block others because it is skipped; an ordinary popular user (say 500,000 followers) is handled by batching the writes and by the worker pool absorbing the spike. Fan-out is idempotent: adding the same post id to a sorted set twice is a no-op, which makes at-least-once delivery safe.

## Deep dive 3: The read path in detail

1. The feed service reads the top N post ids from `user:{id}:timeline` (one `ZREVRANGE`).
2. It fetches the ids of celebrities the user follows (cached), reads each one's recent post ids (from their profile timeline cache), and merges by time into the list. A few extra cache reads.
3. It hydrates: fetch post bodies from the post cache by id (`MGET`), falling back to the database for misses, plus author names and avatars from a user cache.
4. It applies filters (blocked users, deleted posts) and returns a page with a cursor (the score of the last item).

Everything on this path is a cache read. A cache miss for a whole timeline (a user inactive so long their timeline was evicted) triggers a rebuild on demand: fan-out on read for that one user, then cache it.

## Deep dive 4: Timeline cache sizing and eviction

Store ids, not bodies: 800 ids × 8 bytes is a few kilobytes per user. 150 million active users is roughly 600 GB, spread across a Redis cluster by consistent hashing on user id. Timelines of users inactive for 30 days are allowed to expire; their next visit rebuilds them. The post cache holds the bodies of recent posts (a few days' worth), and older posts are read from the database on the rare occasions they are needed.

## Deep dive 5: Media

Uploads go straight to object storage via pre-signed URLs before the post is created; the post references the media keys. A worker generates sizes and thumbnails. Reads come through the CDN. The feed response contains CDN URLs, so the feed service never touches media bytes.

## Deep dive 6: Ranking (the follow-up)

Chronological timelines are simple; most products rank. The structure stays the same: the candidate set is still the pre-built timeline plus celebrity posts, now fetched a few hundred deep instead of twenty. A ranking service scores candidates with features (author affinity, engagement so far, recency, content type) using a model, and returns the top page. Ranking is a read-time step over cached candidates; it does not change the write path. Mention that ranking makes cursor pagination harder (the order changes), so the feed service pins a ranked session for a few minutes.

## Deep dive 7: Counters and interactions

Likes and comment counts are hot, write-heavy, and tolerant of slight staleness. Keep them as counters in Redis (`INCR`), flushed to the database periodically, and rendered from the cache. A viral post's counter is a hot key; sharding the counter into a few sub-keys and summing on read handles it. Whether the current user has liked a post is a set membership check per post, batched.

## Deep dive 8: Deletes and edits

A deleted post must vanish from feeds. Removing it from every follower's timeline is a reverse fan-out (expensive but rare), or simpler: mark it deleted in the post cache and database, and filter at read time in the hydration step. Most systems filter at read and clean up lazily. Edits only touch the post body, so they are visible immediately through the post cache.

## Phase 5: Wrap up

Weak points to volunteer: a very popular non-celebrity post creates a fan-out spike (mitigated by batching and the threshold); timelines are eventually consistent by seconds; the follow-graph cache must be invalidated on follow/unfollow (a new follow does not backfill old posts, which is acceptable); the Redis cluster is the critical path and needs replicas per shard.

## Follow-up questions to expect

- "What if a user follows 10,000 people?" Their timeline receives many writes, which is fine (writes are to one key); the read path is unchanged.
- "How do you handle a user unfollowing someone?" Stop future fan-out; optionally remove that author's ids from the timeline lazily (filter on read).
- "How would you make the feed consistent across devices?" It already is: one timeline per user in the shared cache.
- "What if Redis loses a shard?" Timelines on that shard rebuild on demand from the database (fan-out on read for affected users); the post cache misses hit database replicas. Use Redis replicas to make this rare.
- "How do you show 'new posts available' without polling?" WebSocket or SSE push from the fan-out worker to online followers; the chat case study covers the connection tier.

## The two-minute version

"Posts are written to a sharded database with an outbox event. Fan-out workers push the post id into each follower's Redis timeline, except for celebrity authors, whose posts are merged at read time, and except for dormant users, whose timelines are rebuilt on demand. The feed read is one sorted-set range plus hydration from a post cache, so it is entirely in memory. Media is on object storage behind a CDN. Counters live in Redis and are flushed asynchronously. Ranking, if needed, is a read-time step over the cached candidates."
