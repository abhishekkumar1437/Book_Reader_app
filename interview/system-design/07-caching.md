---
title: Caching
part: Building Blocks
summary: Where caches live, the read and write strategies with their consistency costs, eviction and expiry, and the failure modes interviewers ask about: stampedes, hot keys, and stale data.
---

## Why caches are the first optimisation

Memory is a thousand times faster than disk, and most workloads read the same small fraction of data over and over. A cache holds that fraction in memory close to the reader. It cuts latency, and more importantly it removes load from the database, which is the component that is hardest to scale.

Whenever your estimate shows reads far outnumber writes, the sentence to say is: "the read path goes through a cache; the database sees only misses and writes."

## Where caches live

```
browser cache → CDN → API gateway cache → application-local cache → distributed cache (Redis) → database cache
```

Each layer catches what the previous one missed. In a design interview you usually draw two: the CDN for static content, and a **distributed cache** (Redis or Memcached) shared by all application servers for data.

**Local (in-process) caches** are the fastest, but each server has its own copy, they are not consistent with each other, and they are lost on restart. Use them for tiny, slow-changing data (configuration, feature flags) or as a first tier in front of the distributed cache for extremely hot keys.

**Distributed caches** are shared, survive application restarts, and scale horizontally by partitioning keys across nodes (consistent hashing). Redis adds data structures (lists, sets, sorted sets, hashes) that many designs lean on: sorted sets for leaderboards and timelines, lists for queues, hashes for objects, atomic counters for rate limiting.

## Read strategies

**Cache-aside (lazy loading).** The application checks the cache; on a miss it reads the database and writes the result into the cache. The most common pattern and the default answer.

```
read(key):
    value = cache.get(key)
    if value is None:
        value = db.read(key)
        cache.set(key, value, ttl)
    return value
```

Strengths: only requested data is cached; cache failure degrades to the database, not to an outage. Weaknesses: the first read of each key is slow, and data can be stale until it expires or is invalidated.

**Read-through.** The cache itself loads from the database on a miss; the application only talks to the cache. Same behaviour as cache-aside with the logic moved into the cache layer.

## Write strategies

**Write-around.** Writes go to the database only; the cache entry is deleted (or left to expire). The next read repopulates it. Simple, and the standard partner of cache-aside.

**Write-through.** Writes go to the cache and the database synchronously. The cache is always fresh; writes are slower; data that is never read is cached anyway.

**Write-back (write-behind).** Writes go to the cache and are flushed to the database later, in batches. Very fast writes, absorbs bursts; risks data loss if the cache dies before flushing. Used for counters and metrics where losing a few seconds is acceptable, rarely for anything that must be durable.

The safe interview default: **cache-aside for reads, invalidate on write, with a TTL as a safety net.** Say why: it keeps the database as the source of truth and bounds staleness.

## Keeping cache and database consistent

There is no perfect answer without transactions across two systems, so the goal is to make inconsistency rare and short.

**Invalidate, do not update.** On a write, delete the cache key rather than writing the new value into it. Two concurrent writes that both update the cache can leave it holding the older value; two deletes cannot.

**Order: database first, then delete cache.** If you delete the cache first, a concurrent reader can miss, read the old database value, and repopulate the cache with stale data that lives until the TTL. Database-first has a narrower race (a reader that read the old value before the write and writes it into the cache after the delete). Adding a short delay and a second delete, or a short TTL, covers it.

**Change data capture.** Have a process tail the database's change log and invalidate cache entries from there. Decouples invalidation from application code and catches writes made by any path.

**Always set a TTL.** It bounds the damage from any missed invalidation.

## Eviction and expiry

The cache is smaller than the data. When it is full, something has to go.

| Policy | Evicts | Good for |
|---|---|---|
| **LRU** (least recently used) | The key not touched for the longest | General purpose; the default |
| **LFU** (least frequently used) | The key with the fewest hits | Stable popularity, protects hot keys from a scan |
| **FIFO** | The oldest key | Rarely the right choice |
| **TTL** | Keys past their expiry | Bounding staleness; used alongside LRU |

Redis implements approximate LRU and LFU by sampling, which is cheap and close enough. The LRU cache from the DSA book is what this looks like inside.

## Failure modes interviewers ask about

**Cache stampede (thundering herd).** A hot key expires, and thousands of requests miss at once and all hit the database. Fixes:

- **Lock or single-flight**: the first miss acquires a short lock and loads; others wait or serve the stale value.
- **Stale-while-revalidate**: serve the expired value and refresh in the background.
- **Jittered TTLs**: add a random offset so keys do not expire together.
- **Warm-up**: preload known hot keys before traffic arrives (after a deploy or a cache restart).

**Hot keys.** One key gets a large share of requests and one cache node becomes the bottleneck. Fixes: replicate the key across several nodes with a suffix and read from a random copy, or add a local in-process cache in front for that key.

**Cache node failure.** With consistent hashing, a dead node's keys are re-hashed to neighbours and cold-loaded; the database sees a burst of misses. Replicate cache nodes (Redis primary-replica) if the miss burst would be dangerous.

**Cache penetration.** Requests for keys that do not exist bypass the cache every time (the cache has nothing to store). Cache a "not found" marker with a short TTL, or use a Bloom filter to reject impossible keys before the lookup.

**Large values.** A multi-megabyte value evicts many small ones and is slow to serialise. Cache the pieces or the identifiers, not giant blobs.

## What to cache

- **Rendered results** that are expensive to compute and read often: a user's timeline, a product page, a search result page for a common query.
- **Database rows and objects** by primary key.
- **Aggregates** (counts, sums) that would otherwise need a scan; update them incrementally.
- **Sessions and tokens.**
- **Rate-limit counters, locks, and short-lived coordination state.**

What not to cache: data that changes every read, data where any staleness is unacceptable (an account balance at the moment of a transfer), and anything larger than a few hundred kilobytes per key.

## Sizing

Estimate the working set: hot keys × value size. The 80/20 rule is a fine starting point ("20% of the data serves 80% of the reads"). A single Redis node handles a few tens of GB comfortably and around 100,000 operations per second; beyond that, partition. State the estimate in the interview so the cache is a sized component, not a magic box.

## Common mistakes

- Drawing a cache without saying what is in it, how it is filled, or how it is invalidated.
- Updating the cache on write instead of deleting.
- No TTL.
- Caching per-user data in a shared cache without the user id in the key.
- Assuming the cache is durable.
- Not mentioning stampedes when a key is obviously hot (a home page, a viral post).

## What to say in the interview

"Reads are two orders of magnitude above writes and the working set is a few GB, so I'll put a Redis cluster in front of the database using cache-aside with a 10-minute TTL. Writes go to the database and delete the affected keys; a change-data-capture consumer catches anything the application misses. For the home timeline, which is a very hot key per user, misses are served with a single-flight lock so a cache restart does not stampede the database."
