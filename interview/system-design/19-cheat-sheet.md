---
title: Design Cheat Sheet
part: Wrap-up
summary: Requirement to component in one lookup, the trade-off pairs interviewers probe, the numbers, the phrases, and a checklist to run over any diagram before you say "done".
---

## From requirement to component

| The requirement says... | Reach for | Say the cost |
|---|---|---|
| Reads far exceed writes | Cache-aside in front of the database; read replicas | Staleness bounded by TTL and invalidation; replication lag |
| Static or media content, global users | Object storage + CDN, versioned URLs | Invalidation delay; egress cost |
| Writes exceed one primary, or data grows without bound | Partition (shard) by the key in the dominant query | Cross-shard queries and transactions become hard; hot spots |
| Slow work inside a request (email, thumbnails, fan-out) | Queue + workers, respond 202 | Eventual completion; idempotent consumers; dead-letter queue |
| Many consumers of the same events, replay, audit | Distributed log (Kafka-style) partitioned by entity | Per-partition order only; consumer lag to monitor |
| Real-time push to clients | WebSocket connection tier + session registry + pub/sub | Stateful servers; reconnect and sync-by-last-id |
| Exactly one node must be in charge, or agreed metadata | Consensus store (etcd, ZooKeeper) | Latency; small data only |
| Money, inventory, uniqueness | Single transactional store for those records; linearizable | Lower availability under partition |
| Cross-service transactions | Saga with compensations, outbox for events | Intermediate states visible; every step idempotent |
| Full-text search | Search index fed from the database's change stream | Eventually consistent; not a source of truth |
| Unique, sortable ids at scale | Snowflake-style ids generated locally | Clock skew handling; machine id assignment |
| Nearby / spatial queries | Geohash or quadtree index; Redis GEO | Edge cells; region sharding |
| Prefix suggestions | Precomputed trie with top-k per node, hot-swapped snapshots | Freshness lag; memory per node |
| Protect from abuse or overload | Rate limiter at the gateway (sliding window in Redis); load shedding | Approximate counts; fail-open decision |
| Very popular key or entity | Cache it; split it with suffixes; special-case it (celebrity hybrid) | Read-time merge cost |
| Survive a region loss | Second region, active-passive first; replicated storage; tested failover | RPO of replication lag; cost |
| Fewest steps / shortest path style queries on data | Precompute (materialised views) on write | Write amplification |
| Counters that are hot | Redis counters, sharded, flushed asynchronously | Approximate in real time |

## Trade-off pairs to say out loud

- **Consistency vs availability** under partition, per operation.
- **Latency vs consistency** in normal operation (sync vs async replication, quorum sizes).
- **Fan-out on write vs on read**: pay at post time or at read time; hybrid for hot sources.
- **Push vs pull**: server pushes (real-time, stateful) or client polls (simple, delayed).
- **Normalised vs denormalised**: joins vs duplicated data kept in sync.
- **Strong ids vs random ids**: sequential (guessable, index-friendly) vs random (private, scattered).
- **Fail open vs fail closed** when a protective component is down.
- **Precompute vs compute on demand**: storage and staleness vs latency.
- **Monolith vs services**: simplicity vs independent scaling and deployment; split along team and data boundaries, not for fashion.
- **Exactly-once**: does not exist across systems; at-least-once plus idempotency does.

## Numbers to have ready

| Fact | Value |
|---|---|
| 1 million per day | ~12 per second |
| 1 day | ~10⁵ seconds |
| Memory vs SSD vs disk read of 1 MB | 10 µs / 1 ms / 20 ms |
| Round trip in a data centre / across a continent / across an ocean | 0.5 ms / 50–100 ms / 150 ms |
| Relational database, simple queries | thousands to low tens of thousands QPS per primary |
| Redis node | ~100k ops/s, tens of GB |
| Stateless API server | a few thousand requests/s |
| WebSocket connections per server | tens of thousands to ~100k |
| 99.9% / 99.99% availability | ~9 hours / ~1 hour of downtime per year |
| 7-character base62 | ~3.5 trillion codes |
| Snowflake id | 41 bits ms timestamp, 10 bits machine, 12 bits sequence |

## The checklist to run over any diagram

Before you say the design is done, walk it once with these questions. Each "no" is a sentence to add.

1. **Requirements**: is every functional requirement served by a visible path? Is every non-functional requirement (latency, availability, consistency) explicitly addressed?
2. **Numbers**: did I state QPS, storage, and the read/write ratio, and did the design follow from them?
3. **API**: are the main calls defined, paginated, idempotent where retried?
4. **Read path and write path**: can I narrate each end to end, naming every hop?
5. **Single points of failure**: for every box, what happens when it dies?
6. **State**: where does every piece of state live, and is the stateless tier really stateless?
7. **Consistency**: for each store, what staleness is possible and is it acceptable? Read-your-writes for the acting user?
8. **Hot spots**: which key, user, or partition could be hot, and what absorbs it?
9. **Async work**: is delivery at-least-once, are consumers idempotent, is there a dead-letter queue?
10. **Failure handling**: timeouts, retries with backoff, circuit breakers, fallbacks?
11. **Growth**: which component fills up first, and how does it scale out?
12. **Operations**: metrics with percentiles, request ids, alerts, deploy and rollback?
13. **Security**: authentication at the edge, encryption, rate limits on sensitive endpoints?
14. **Cost**: which component dominates cost, and is that acceptable?
15. **Next steps**: what would I do with another month?

## Phrases that show experience

- "Let me confirm the scope and the scale before I draw anything."
- "Reads are two orders of magnitude above writes, so the read path is what we optimise."
- "This is the source of truth; everything else is derived and can be rebuilt."
- "This call has a deadline, retries with jittered backoff, and is idempotent by key."
- "During a partition this operation favours availability because..."
- "The hot spot here is X; the mitigation is Y."
- "Delivery is at-least-once, so the consumer deduplicates on message id."
- "If I had more time I would add..."

## Phrases to avoid

- "We'll just use NoSQL / Kafka / microservices" without a requirement that demands it.
- "It scales horizontally" for a stateful component without saying how state is partitioned.
- "Exactly once."
- "The cache will handle it" without saying what is cached, how it is filled, and how it is invalidated.
- "That won't fail."

## Typical interviewer probes, and the one-line answers

| Probe | Answer shape |
|---|---|
| "What if the database goes down?" | Replica with automatic failover; synchronous replica for zero loss; the cache serves reads meanwhile |
| "What if the cache goes down?" | Cache-aside degrades to the database; single-flight and warm-up prevent a stampede; replicas make it rare |
| "What if this queue backs up?" | Lag is monitored; scale consumers to the partition count; shed low-value work; producers see backpressure |
| "Two users do this at the same time?" | Atomic operation in one store (conditional write, transaction) or a per-key lock with fencing; idempotency for retries |
| "How does this scale 10×?" | Stateless tier autoscaled; cache and database partitioned by the key in the main query; async pipelines scaled by partitions |
| "How would you know it's broken?" | Error rate and p99 latency per endpoint; queue lag; replication lag; alerts on user-impacting symptoms |
| "Why this database?" | The dominant access pattern, the write rate, the consistency need; and what I'd move to when that changes |
| "How do you deploy a schema change?" | Expand, migrate, contract; backwards-compatible code; canary |

Read this page before every mock. When you no longer need it, you are ready.
