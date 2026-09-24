---
title: Databases & Data Modelling
part: Building Blocks
summary: Relational versus the NoSQL families, how to choose in one minute, indexing that interviewers check, replication and failover, and modelling the data for the access pattern.
---

## Start from the access pattern

The right database is determined by how the data will be read and written, not by fashion. Before choosing, write down the two or three queries that matter most and their volumes. Then pick a store that answers them cheaply, and model the data to match.

Questions to ask yourself:

- Is the data relational with many joins, or mostly self-contained records?
- Do reads look up by primary key, by a secondary attribute, by range, or by free text?
- How big does it get, and does it grow forever?
- Does it need transactions across several records?
- Is it read-heavy, write-heavy, or append-only?

## The families

| Family | Examples | Strengths | Weaknesses | Typical use |
|---|---|---|---|---|
| **Relational** | PostgreSQL, MySQL | ACID transactions, joins, secondary indexes, mature tooling, flexible queries | Horizontal write scaling is manual (sharding); rigid schema | Users, orders, payments, anything with relationships and invariants |
| **Key-value** | Redis, DynamoDB, Riak | Very fast point reads and writes, trivially partitioned | No joins, limited query flexibility | Sessions, caches, user profiles, counters, feature flags |
| **Wide-column** | Cassandra, HBase, ScyllaDB | Massive write throughput, linear scaling, tunable consistency, time-ordered rows per key | Query patterns must be designed up front; no ad hoc queries; no joins | Messages, events, time series, activity logs |
| **Document** | MongoDB, Couchbase | Flexible nested records, developer-friendly, secondary indexes | Joins are awkward; large documents are expensive to update | Product catalogues, content, user-generated objects with varying shape |
| **Search** | Elasticsearch, OpenSearch | Full-text search, relevance ranking, aggregations | Not a source of truth; eventual consistency; operationally heavy | Search boxes, log analytics |
| **Graph** | Neo4j | Traversals across relationships | Scaling is hard; niche | Social graphs, fraud rings, recommendations |
| **Time series** | InfluxDB, TimescaleDB | Compression and range queries over time | Narrow purpose | Metrics, sensor data |

**The one-minute choice.** Default to a relational database. Move to a key-value or wide-column store when you have one of: write throughput beyond what one primary can take, data that is naturally partitioned by a key with no cross-key queries, or a need for very low latency at very high scale. Add a search index when you need full-text search. Add a cache in front of whatever you chose. Say the default, then say the specific reason you are deviating.

> **Interview tip:** "NoSQL scales better" is not a reason. "The messages table receives 20,000 writes per second, is only ever read by conversation id in time order, and grows forever, so a wide-column store partitioned by conversation id fits and a single relational primary would not" is a reason.

## Indexing

An index is a sorted copy of one or more columns with pointers to the rows, usually a B-tree. It turns a full scan into a logarithmic lookup. Every design with a query on a non-primary-key column needs an index on it, and you should say so.

Things interviewers listen for:

- **Composite indexes** follow the order of the columns. An index on `(user_id, created_at)` serves "all posts by user, newest first" in one range scan. It does not help "all posts on a date" because `user_id` comes first.
- **Indexes cost writes.** Each index is updated on every insert and update. A write-heavy table with ten indexes will be slow. Index what you query; nothing else.
- **Covering indexes** include every column the query needs, so the engine never touches the table.
- **Cardinality matters.** An index on a boolean column with half the rows true is nearly useless.
- **Log-structured storage** (LSM trees, used by Cassandra, RocksDB, and friends) favours writes: appends go to memory and are flushed sequentially; reads may check several files. B-trees favour reads. This is the underlying reason wide-column stores handle write floods.

## Replication

Copies of the data on several machines, for availability and for read scaling.

```
             writes
   client ──────────> Primary ──async/sync──> Replica 1
                          │                     (reads)
                          └────────────────────> Replica 2
                                                (reads)
```

**Primary-replica (leader-follower).** All writes go to the primary; replicas apply the change stream. Reads can go to replicas. This is the default and answers "how do you scale reads".

**Synchronous versus asynchronous.** Synchronous replication waits for a replica to confirm before acknowledging the write: no data loss on primary failure, higher write latency, and a stuck replica can block writes. Asynchronous is faster and more available but the replica lags, and a failover can lose the last few writes. The common compromise is one synchronous replica and the rest asynchronous.

**Replication lag** is the practical consequence. A user writes, then reads from a replica that has not caught up, and their change is missing. Fixes: read your own writes from the primary for a short window after writing, route a user's reads to the same replica, or use version numbers so the client can detect stale data. Mention this the moment you draw read replicas.

**Failover.** When the primary dies, a replica is promoted. Automatic failover needs a way to agree that the primary is really dead (a timeout, a quorum of observers) and to choose a new one, and it must prevent the old primary from coming back and accepting writes (split brain). Managed databases handle this; if you run your own, a coordination service (etcd, ZooKeeper) does the election.

**Multi-primary (multi-leader).** Several nodes accept writes, typically one per region. Lower write latency for global users, but concurrent writes to the same record conflict and must be resolved (last-writer-wins, merge rules, or application logic). Avoid unless the question is explicitly about multi-region writes.

**Leaderless (Dynamo-style).** Any node accepts writes; a write goes to N replicas and succeeds when W acknowledge; a read queries R and returns the newest version. With `W + R > N` a read sees the latest write. Cassandra and DynamoDB work this way. Tunable consistency per operation is the selling point.

## Transactions and consistency inside one database

ACID (atomic, consistent, isolated, durable) is what relational databases give you and what you lose when you spread data across many stores. When a design needs an invariant across records ("the account balance never goes negative", "seats are not double-booked"), keep those records in one transactional store and say so.

Isolation levels are a favourite follow-up. Know two: **read committed** (no dirty reads; the default in most systems) and **serializable** (transactions behave as if run one at a time; safest, slowest). **Optimistic concurrency** (a version column, `UPDATE ... WHERE version = 7`) is the practical way to handle concurrent updates without long locks, and is worth mentioning for "two users edit the same thing".

## Data modelling for the access pattern

**Relational example: a simple social app**

```
users      (id PK, handle UNIQUE, name, created_at)
posts      (id PK, user_id FK, body, created_at)          index (user_id, created_at DESC)
follows    (follower_id, followee_id, created_at)         PK (follower_id, followee_id), index (followee_id)
likes      (user_id, post_id, created_at)                 PK (post_id, user_id)
```

The indexes match the queries: a user's posts newest first, who follows whom in both directions, like counts per post.

**Wide-column example: chat messages**

```
messages
  partition key: conversation_id
  clustering key: message_id (time-ordered, descending)
  columns: sender_id, body, sent_at
```

Everything for one conversation lives together and is stored in time order, so "last 50 messages in this conversation" is one sequential read on one node. There is no query for "all messages by a user" and that is deliberate; if that query is needed, a second table keyed by user is written alongside (denormalisation is the norm here).

**Denormalisation.** In distributed stores, joins are replaced by storing the data twice, shaped for each query. The cost is keeping copies in sync, usually via the write path or an asynchronous pipeline. Say the cost when you propose it.

## Choosing the primary key

- Auto-increment integers are simple but reveal counts, and are awkward to generate across shards.
- UUIDs are globally unique but random, which scatters inserts across the index and hurts write locality.
- Time-ordered ids (Snowflake-style, ULID) are unique, sortable, and generated without coordination. They are the usual answer at scale and are covered in the unique-id case study.

## Common mistakes

- Choosing NoSQL by reflex, then needing joins and transactions.
- Drawing read replicas and never mentioning replication lag.
- Forgetting indexes, or indexing everything.
- Putting large blobs (images, videos) in the database.
- Claiming ACID across two different databases. Cross-store consistency needs sagas, outbox patterns, or reconciliation, which the distributed systems chapter covers.
- Not stating the shard key when you say "shard it" (next chapter).

## What to say in the interview

"The core entities are users, posts, and follows; I'll keep them in a relational database because the relationships and constraints matter, with indexes on `(user_id, created_at)` for the profile timeline. Reads go to replicas; I'll serve a user's own recent writes from the primary to hide replication lag. The message history is a different shape: append-only, partitioned by conversation, so that goes in a wide-column store keyed by conversation id." Then draw it.
