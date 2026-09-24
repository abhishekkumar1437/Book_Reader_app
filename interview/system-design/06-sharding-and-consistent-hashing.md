---
title: Sharding, Partitioning & Consistent Hashing
part: Building Blocks
summary: When one database is not enough. Choosing a shard key, hash versus range partitioning, hot spots, rebalancing, cross-shard queries, and the consistent hashing ring.
---

## When to shard

Replication scales reads. When the **writes** or the **data size** exceed one primary, you split the data across several databases, each holding a subset. Each subset is a **shard** (or partition), and each shard is its own primary with its own replicas.

Say this only when the numbers demand it. Sharding makes every cross-shard operation harder: joins, transactions, unique constraints, and analytics. A design that shards a 50 GB table is over-engineered; a design that keeps a 20,000-writes-per-second table on one primary is under-engineered.

## Choosing the shard key

The shard key decides which shard a row lives on. A good key:

1. **Is present in the dominant queries**, so a query touches one shard. If you shard users by `user_id` and then query "all users in Paris", you must ask every shard (scatter-gather).
2. **Spreads load evenly** over time, not just over rows. A key based on creation timestamp puts all of today's writes on one shard.
3. **Keeps related data together** when transactions span it. Orders and their line items sharded by `order_id` stay on one shard.

Typical choices: `user_id` for user-centric data, `conversation_id` for messages, `tenant_id` for multi-tenant products, a short URL's code for a URL shortener.

## Hash versus range partitioning

```
Hash:   shard = hash(key) mod N            Range:  shard 1: keys A–F
        even spread, no ordering                    shard 2: keys G–M
        range scans hit every shard                 shard 3: keys N–Z
                                                    range scans are local
                                                    risk of hot ranges
```

- **Hash partitioning** spreads keys uniformly and is the default for point lookups. Range queries across keys need every shard.
- **Range partitioning** keeps adjacent keys together, so "messages between two timestamps" or "users with names starting with S" are local. The risk is a hot range: a time-based key sends all new writes to the last shard.

A common combination is to hash a coarse key and range-partition within it: partition by `hash(user_id)` and store each user's events sorted by time. Wide-column databases model exactly this with partition keys and clustering keys.

## Hot spots

A few keys receive most of the traffic: a celebrity's profile, a viral post, a popular product during a sale. Even a perfect hash puts that whole key on one shard.

Mitigations, in order of preference:

- **Cache the hot key** in front of the database; most hot keys are read-heavy.
- **Split the hot key** by appending a small random suffix (`post_123_0` to `post_123_9`), spreading writes over ten rows or shards, and aggregate on read. Works for counters and append-only data.
- **Dedicated handling** for known hot entities (a separate tier for accounts above a follower threshold). The feed case study uses this.
- **Rate limit** the write side if it is abusive rather than organic.

Say "hot spot" whenever you say "shard". Interviewers look for it.

## Rebalancing

Adding a shard must move data. With `hash(key) mod N`, changing `N` remaps almost every key, which means moving almost all data. Two standard fixes:

**Fixed number of virtual partitions.** Create many more partitions than machines (say 1,024) and assign partitions to machines. Adding a machine moves whole partitions, not individual keys; the hash never changes. This is how most distributed databases work internally.

**Consistent hashing.** Described below. Adding or removing a node moves only the keys adjacent to it on the ring, about `1/N` of the data.

Either way, rebalancing is done gradually in the background while the old location keeps serving, and a **routing layer** (a lookup service, or metadata replicated to every client) knows where each partition currently lives.

## Consistent hashing

Place both nodes and keys on a ring of hash values from 0 to 2³² − 1. A key belongs to the first node found walking clockwise from the key's position.

```
                    0
            n3  ─────────  k1
          ╱                     ╲
        k4                       n1
        │         ring            │
        k3                       k2
          ╲                     ╱
            n2  ─────────  k5
```

- `k1` and `k2` walk clockwise to `n1`; `k3` and `k5` to `n2`; `k4` to `n3`.
- **Add a node** between `n1` and `n2`: only the keys between them that now stop at the new node move. Everything else stays.
- **Remove `n1`**: its keys move to `n2`, the next node clockwise. Nothing else changes.

**Virtual nodes.** With a handful of physical nodes the ring is uneven and a failure dumps a whole node's load on one neighbour. Fix: each physical node claims many points on the ring (150 or so), so load spreads and a failure is absorbed by everyone. This is what production implementations do.

**Where it is used.** Distributed caches (which cache node holds key K), Dynamo-style databases, load balancers that need stickiness, and any place a request must reach "the node responsible for K" without a central lookup table. Say it whenever a design has a cluster of stateful nodes that grows and shrinks.

**Replication on the ring.** Store each key on the node it maps to plus the next `N − 1` nodes clockwise. A node failure leaves the copies intact.

A minimal implementation, for when an interviewer asks you to sketch it:

```python
import bisect, hashlib

class ConsistentHashRing:
    def __init__(self, nodes: list[str], replicas: int = 150):
        self.replicas = replicas
        self.ring: list[int] = []            # sorted hash positions
        self.owner: dict[int, str] = {}      # position -> node
        for node in nodes:
            self.add(node)

    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add(self, node: str) -> None:
        for i in range(self.replicas):
            pos = self._hash(f"{node}#{i}")
            bisect.insort(self.ring, pos)
            self.owner[pos] = node

    def remove(self, node: str) -> None:
        for i in range(self.replicas):
            pos = self._hash(f"{node}#{i}")
            self.ring.remove(pos)
            del self.owner[pos]

    def get(self, key: str) -> str:
        if not self.ring:
            raise LookupError("no nodes")
        idx = bisect.bisect(self.ring, self._hash(key)) % len(self.ring)
        return self.owner[self.ring[idx]]
```

## Cross-shard operations

Everything that touches more than one shard is the price of sharding. Be ready to say how each is handled:

- **Queries by a non-shard key**: scatter-gather to all shards and merge (expensive; fine for rare admin queries), or maintain a secondary index or a denormalised copy keyed the other way.
- **Joins**: avoid by denormalising, or join in the application after two lookups.
- **Unique constraints** (a unique username across shards): a separate small table or service that owns uniqueness, or make the unique value the shard key.
- **Transactions across shards**: two-phase commit is possible but slow and fragile; prefer designs where a transaction stays on one shard (choose the shard key for it) or use sagas (distributed systems chapter).
- **Aggregations and analytics**: stream changes to a warehouse; do not run them on the shards.

## Sharding in practice

The application talks to a routing layer that maps a key to a shard: a library with the shard map, a proxy, or the database's own coordinator. Operational concerns worth one sentence each: schema migrations must run on every shard, backups are per shard, and monitoring must show per-shard load so hot shards are visible.

Directory-based sharding (a lookup table from key to shard) is the most flexible, allows moving individual tenants, and adds one lookup per request that must be cached and highly available.

## Common mistakes

- Sharding before the numbers need it.
- Announcing "shard by user id" without checking the main queries against it.
- Using `hash mod N` and then wondering how to add a node.
- Ignoring hot keys.
- Assuming cross-shard transactions are free.

## What to say in the interview

"The messages table takes 20,000 writes per second and grows without bound, so it is partitioned by `conversation_id`, which is in every query. Hashing spreads conversations evenly; within a partition rows are ordered by time so history reads are sequential. Group chats with thousands of participants are the hot-spot risk; those get a cache in front and, if needed, the partition is split by time bucket. Adding capacity uses consistent hashing with virtual nodes so only a fraction of data moves."
