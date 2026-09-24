---
title: Case Study — URL Shortener
part: Case Studies
summary: The classic opener. Requirements, estimation, the API, key generation strategies, the redirect path with caching, 301 versus 302, analytics, and the follow-ups interviewers use to go deeper.
---

## Why this question

It is small enough to finish in 45 minutes and rich enough to touch every part of the framework: an API, a key-generation decision, a read-heavy path with caching, a storage growth question, and an analytics pipeline. Interviewers use it to see whether you run the process well, not to see whether you can scale to Google.

## Phase 1: Requirements

**Functional**

- Given a long URL, return a short one (`https://sho.rt/Ab3dE9x`).
- Visiting the short URL redirects to the long one.
- Optional: custom aliases, expiry, and click analytics. Ask which are in scope; assume expiry and basic analytics, no custom aliases, unless told otherwise.

**Non-functional**

- Redirects must be fast: this is the whole product. Target under 50 ms at the server.
- Highly available for redirects; a short outage of link *creation* is tolerable.
- Short codes must not be guessable in sequence if the interviewer cares about privacy (ask).
- Links live for years by default.

## Phase 2: Estimation

Assume 100 million new links per month and a 10:1 read-to-write ratio.

```
Writes:  100M / 2.5M s      ≈ 40 per second
Reads:   400 per second average, plan for 4,000 at peak
Storage: 500 bytes per record × 100M per month = 50 GB per month → ~6 TB in 10 years
Cache:   20% of daily reads' distinct URLs ≈ 400 × 86,400 × 0.2 × 500 B ≈ 3.5 GB
```

Conclusion: writes are trivial; reads are modest and highly cacheable; storage is a few TB over the product's life. One relational primary with replicas plus a cache is plenty. The design decisions that matter are key generation and the redirect path.

## Phase 3: API

```
POST /v1/urls
  body:    { "long_url": "https://...", "expires_at": "2027-01-01T00:00:00Z" }   (expiry optional)
  returns: 201 { "short_url": "https://sho.rt/Ab3dE9x", "code": "Ab3dE9x" }

GET /{code}
  returns: 302 Found, Location: <long_url>      (or 404 / 410 if missing / expired)

GET /v1/urls/{code}/stats
  returns: { "clicks": 1234, "by_day": [...] }
```

Authentication with an API key for creation if this is a developer product; redirects are public.

## Phase 3: High-level design

```
                       +-------------+        +-------------+
   browser ──GET /Ab3──>| Load        |──────> | Redirect    |──cache hit──> 302
                       | balancer    |        | service     |
                       +-------------+        +------+------+
                                                     │ miss
                                             +-------▼-------+     +-----------+
                                             |  Redis cache  |     |  Analytics|
                                             +-------+-------+     |  queue    |
                                                     │ miss        +-----▲-----+
                                             +-------▼-------+           │ async click event
                                             |  Database     |───────────┘
                                             |  urls table   |
                                             +---------------+

   client ──POST /v1/urls──> API ──> key generation ──> database insert ──> response
```

**Data model**

```
urls
  code        VARCHAR(8)  PRIMARY KEY
  long_url    TEXT
  owner_id    BIGINT NULL
  created_at  TIMESTAMP
  expires_at  TIMESTAMP NULL
  index (owner_id, created_at)      -- "my links" listing
```

**The redirect path, narrated**

1. Request for `/Ab3dE9x` reaches a redirect server.
2. Look up `Ab3dE9x` in Redis. On a hit, respond immediately.
3. On a miss, read from a database replica, write the result into Redis with a TTL, respond.
4. Emit a click event to a queue (asynchronously; never on the response path).
5. If the code is unknown, cache a "not found" marker for a minute so a flood of bad codes does not hit the database.

**The create path**

1. Validate the URL (scheme, length, not pointing at ourselves).
2. Generate a code (below).
3. Insert into the primary database. On a duplicate-key error, regenerate and retry.
4. Return the short URL.

## Deep dive 1: Key generation

This is the decision interviewers most want to hear reasoned through. Three viable options.

**Option A: Hash the long URL.** Compute `SHA-256(long_url)`, base62-encode, take the first 7 characters. Same URL gives the same code (natural deduplication). Collisions between different URLs are possible in 7 characters, so check the database and, on collision, hash with a salt (`long_url + counter`). Cost: one database read per creation to check, and the code is not sequential (good for privacy).

**Option B: Encode a unique id.** Get a Snowflake-style 64-bit id (or a database sequence) and base62-encode it. No collisions, no check needed, one write per creation. Codes are sequential-ish, so anyone can enumerate links, which may be unacceptable for private content. Fix by mixing in a small random component or by encrypting the id with a lightweight block cipher before encoding.

**Option C: Pre-generated key pool.** A background job generates random 7-character codes, checks uniqueness, and stores them in an "unused keys" table. Creation takes one from the pool (moving it to "used" atomically). No collision handling on the request path and codes are random. Needs the pool service to be available and refilled; a batch of keys can be handed to each API server in memory to reduce contention.

**Recommendation.** Option C if random codes are required, otherwise Option B for simplicity. Say the trade-off in one line: "hashing dedupes but needs a collision check; ids are collision-free but predictable; a pool is random and fast at the cost of one more service."

**Capacity check.** 62⁷ ≈ 3.5 × 10¹² codes. At 100 million per month that is about 3,000 years. Seven characters is enough; six (56 billion) is fine for a smaller product.

## Deep dive 2: 301 versus 302

A **301** (permanent) tells the browser to cache the redirect; future visits skip your server entirely. Fastest for users, cheapest for you, and you lose the click analytics because you never see the request again. A **302** (temporary) is followed every time, so you count every click and can change the target. Most products use 302 (or 307) because analytics is the business. Say both and pick 302 with the reason.

## Deep dive 3: Scaling reads and the cache

Reads dominate, and the distribution is skewed: a few links get most of the clicks. Cache-aside in Redis with a TTL of a day or more (links rarely change) gives a hit rate above 90%. The working set of a few GB fits one node; replicate it so a node restart does not send every read to the database. For a viral link, one key is very hot: a local in-process cache on each redirect server for the top few hundred codes takes it off Redis entirely.

Read replicas of the database absorb the misses. Replication lag is harmless here: a link created a second ago that is not yet on a replica returns a miss; the create endpoint can write the new link into the cache directly so the first redirect never misses.

## Deep dive 4: Analytics

Never do analytics work on the redirect path. Emit `{code, timestamp, user_agent, referrer, country}` to a log (Kafka-style). Consumers aggregate per link per day into a counts table or a time-series store; a stream job can maintain the totals in Redis for the stats endpoint. Raw events go to a warehouse for anything more complex. The click count shown to users is eventually consistent by a few seconds, and that is fine.

## Deep dive 5: Expiry and cleanup

Store `expires_at`; the redirect path checks it and returns 410 Gone after expiry (and caches that). A background job deletes or archives expired rows in batches during quiet hours, so the table does not grow forever. Freed codes are not reused for a long time to avoid old links pointing at new targets.

## Deep dive 6: Abuse

Shorteners are used to hide malicious links. Mention: rate limiting per API key and per IP on creation, checking long URLs against a safe-browsing list at creation and periodically after, blocking redirects to known-bad targets, and a preview page for suspicious links.

## Phase 5: Wrap up

Weak points to volunteer: the key pool (or id generator) is a small critical service that needs redundancy; a single region means a regional outage takes redirects down, so the redirect tier and cache should exist in a second region reading from a replicated database; analytics counts are approximate by design.

## Follow-up questions to expect

- "How would you support custom aliases?" Same table, code chosen by the user, uniqueness by the primary key; reserve a character set or prefix so custom and generated codes cannot collide.
- "How would you handle 100× the traffic?" Redirect servers scale horizontally; the cache is partitioned by consistent hashing; the database is sharded by code (hash) when writes or storage demand it, and the redirect path only ever looks up by code, so every read is single-shard.
- "What if the same long URL is submitted twice?" Hashing dedupes naturally; with ids, keep a secondary index on a hash of the long URL and return the existing code (per user, if links are owned).
- "How do you make sure a link is not guessable?" Random codes from the pool, or encrypt the id before encoding.
- "Where would you put rate limiting?" At the gateway, per API key; the rate limiter case study has the algorithm.

## The two-minute version

"Links are stored by a 7-character base62 code taken from a pre-generated pool. The redirect path checks Redis, then a database replica, and answers with a 302 so we keep analytics; clicks are emitted asynchronously to a log and aggregated. Writes are 40 per second and storage is a few TB over ten years, so one primary with replicas is enough; the design scales reads by adding redirect servers and cache nodes, and shards by code if it ever has to."
