---
title: Case Study — Distributed Key-Value Store
part: Case Studies
summary: Design a Dynamo-style store from parts you already know: partitioning by consistent hashing, replication with quorums, versioning and conflict handling, failure detection, and the LSM storage engine underneath.
---

## Why this question

It is the "infrastructure" design question. Instead of composing products from a database and a cache, you are asked to build the database. Every answer is a concept from the building-block chapters, assembled: consistent hashing, quorums, replication, gossip, log-structured storage. Interviewers use it at senior levels to check that you understand what the boxes you usually draw are made of.

## Phase 1: Requirements

**Functional**

- `put(key, value)` and `get(key)`; values are small blobs (up to a few hundred KB).
- Optional: delete, TTL, range scans (assume no range scans unless asked).

**Non-functional**

- Highly available: reads and writes succeed even when some nodes are down or partitioned.
- Horizontally scalable: add nodes to add capacity, with minimal data movement.
- Tunable consistency: callers choose between strong reads and fast eventual reads.
- Low latency: single-digit milliseconds for a local read.
- Durable: an acknowledged write survives node failures.

## Phase 2: Estimation and framing

Say the scale you are designing for: for example, 10 TB of data, 100,000 operations per second, across tens of nodes in one region, with the ability to grow tenfold. Then frame the design as five decisions: how keys are placed, how they are replicated, how reads and writes are made consistent, how failures are detected and handled, and how each node stores its data.

## Phase 3: High-level design

```
 client ──> coordinator (any node, or a thin proxy) ──> ring lookup ──> N replica nodes
                                                                          │
                                       +----------------------------------+
                                       │  each node: memtable + WAL + SSTables (LSM)
                                       │  gossip for membership and failure detection
                                       +----------------------------------------------
```

## Deep dive 1: Partitioning

Keys are placed on a **consistent hash ring** with virtual nodes (sharding chapter). `hash(key)` gives a position; the first node clockwise owns it. Each physical node has many virtual positions so load is even and a node's departure spreads its keys across everyone. Adding a node moves roughly `1/N` of the data, streamed in the background while the old owners keep serving.

The ring (membership and token assignment) is the one piece of shared metadata. Options: a coordination service (etcd, ZooKeeper) holds it, or nodes gossip it (below). Clients either ask any node (which forwards) or cache the ring and go direct.

## Deep dive 2: Replication

Each key is stored on **N nodes**: its owner and the next `N − 1` distinct physical nodes clockwise (skipping virtual nodes that belong to the same machine, and preferably spanning racks or availability zones). N = 3 is the standard.

The node that receives a request is the **coordinator** for it: it forwards the write to all N replicas and waits for W acknowledgements; for a read it asks R replicas and returns the freshest value.

## Deep dive 3: Consistency with quorums

Configure `W + R > N` for strong reads (every read set overlaps every write set): with N = 3, `W = 2, R = 2` is the usual choice, tolerating one replica down for both operations. `W = 1` gives fast, less durable writes; `R = 1` gives fast, possibly stale reads. Let callers choose per request, which is the "tunable" in tunable consistency.

**Versioning.** Replicas can hold different versions of a key after a partition or concurrent writes. Each write carries a version. Two choices:

- **Last-writer-wins** with a timestamp: simple, and concurrent writes silently lose one of them. Acceptable for many caches and profiles; say the loss out loud.
- **Vector clocks**: each version records `[(node, counter), ...]`. On read, the coordinator can tell whether one version descends from another (keep the newer) or they are concurrent (return both, let the client merge, or apply an application rule). More correct, more complex; the original Dynamo did this, most successors chose timestamps plus application-level design.

**Read repair.** When a read finds replicas disagreeing, the coordinator sends the newest version to the stale ones after responding. **Anti-entropy** in the background compares replicas using **Merkle trees** (hash trees over key ranges) so only differing ranges are transferred.

## Deep dive 4: Handling failures

**Temporary failure: hinted handoff.** If a replica is unreachable during a write, the coordinator writes the value to another node with a "hint" that it belongs to the down replica. When the replica returns, the hint is delivered. The write still reaches W nodes, so availability is preserved (a **sloppy quorum**: the W nodes may not all be the "home" replicas).

**Permanent failure.** When a node is declared dead (by the membership protocol, not one peer's opinion), its token ranges are reassigned and the remaining replicas stream copies to new owners until every key has N replicas again.

**Failure detection: gossip.** Each node periodically exchanges its view of the membership (node, heartbeat counter, last seen) with a few random peers. Information spreads in O(log N) rounds. A node is suspected when its heartbeat has not advanced for a while and marked down after a longer timeout, ideally using a phi-accrual detector that adapts to network conditions. No single point of failure for membership; this is how Cassandra works. Alternative: a small consensus cluster (etcd) holds membership; simpler to reason about, one more thing to run.

**Coordinator failure mid-request.** The client times out and retries (writes must be idempotent: same key, same version wins). 

## Deep dive 5: The storage engine on each node

Each node stores its share of keys. The usual choice for write-heavy, key-value workloads is a **log-structured merge tree (LSM)**:

```
write ──> append to write-ahead log (durability) ──> insert into memtable (sorted, in memory)
                                                          │ when full
                                                          ▼
                                             flush to an immutable SSTable on disk (sorted)
                                             compaction merges SSTables in the background

read ──> memtable ──> newest SSTable ──> older SSTables  (Bloom filter per SSTable skips files that cannot contain the key)
```

Properties to state: writes are sequential appends (fast); reads may check several files, mitigated by Bloom filters and an index per SSTable; compaction reclaims space and removes overwritten values and tombstones (deletes are written as markers and physically removed at compaction, which is why deletes are not free). B-trees are the alternative when reads dominate and in-place updates are preferred.

**Durability**: the write-ahead log is fsynced before the write is acknowledged (or in small batches, trading a millisecond of latency for throughput). Combined with W ≥ 2, an acknowledged write survives a node loss.

## Deep dive 6: The request paths, end to end

**put(key, value)**

1. Client sends to any node (coordinator).
2. Coordinator hashes the key, finds the N replicas on the ring.
3. Sends the write with a version to all N; each appends to its WAL and memtable and acks.
4. When W acks arrive, coordinator responds success. Missing replicas get hints.

**get(key)**

1. Coordinator finds the N replicas.
2. Sends reads to R of them (or all N, using the first R responses for latency).
3. Returns the newest version by version comparison; triggers read repair for stale replicas.

Latency: one network hop to the coordinator plus one parallel hop to replicas; a few milliseconds in one data centre.

## Deep dive 7: Extras interviewers may ask for

- **TTL**: store an expiry with the value; reads treat expired values as missing; compaction drops them.
- **Range scans**: require ordered partitioning (range-partitioned tokens) instead of hashing, or a secondary structure; say that hashing gives up ordering deliberately.
- **Multi-region**: replicate across regions with local quorums per region and asynchronous cross-region replication; a write is acknowledged by the local region and converges elsewhere.
- **Hot keys**: caching in front, or splitting a hot key with suffixes at the application level; the store itself can only spread distinct keys.
- **Large values**: chunk them or store in object storage with a pointer.

## Phase 5: Wrap up

Trade-offs to volunteer: availability is favoured over consistency by default (a sloppy quorum can serve during partitions), so strong consistency needs `W + R > N` and the acceptance of unavailability when too many replicas are down; last-writer-wins loses concurrent writes; compaction consumes disk and I/O in the background and must be tuned; gossip-based membership can briefly disagree.

## Follow-up questions to expect

- "How do you add a node without downtime?" Assign tokens, stream its ranges from current owners, serve from both until the transfer completes, then switch the ring.
- "What guarantees does W = 2, R = 2, N = 3 give?" A read sees the latest acknowledged write if at most one replica is down; two replicas down makes the key unavailable for strong operations.
- "Why not a leader per partition instead of leaderless?" Leader-based (Raft per shard) gives linearizable operations and simpler conflict handling at the cost of a leader election on failure and a leader bottleneck; leaderless gives availability and latency. Both exist; name an example of each.
- "How does a client find the right node?" Ask any node, or cache the ring and go direct (fewer hops, must refresh on ring changes).
- "How do you delete?" Tombstones, removed at compaction after a grace period longer than the hint delivery window, so a delete is not resurrected by a late hint.

## The two-minute version

"Keys are partitioned on a consistent hash ring with virtual nodes and replicated to N = 3 nodes clockwise. Any node coordinates a request, writing to all replicas and acknowledging after W, reading from R and returning the newest version; W + R > N gives strong reads, lower values give speed. Versions are timestamps (or vector clocks if concurrent writes must be preserved), with read repair and Merkle-tree anti-entropy. Temporary failures use hinted handoff, membership and failure detection use gossip, and each node stores data in an LSM engine with a write-ahead log, memtable, SSTables, Bloom filters, and background compaction."
