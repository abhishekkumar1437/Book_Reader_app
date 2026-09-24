---
title: Consistency, Availability & Distributed Fundamentals
part: Building Blocks
summary: CAP and PACELC without the folklore, consistency models you can name, quorums, leader election and consensus, clocks, distributed locks, and transactions across services with sagas.
---

## Why this chapter matters

Every design in this book spreads data over many machines. The moment you do that, three things become true: machines fail independently, messages between them can be delayed or lost, and there is no shared clock. Every interview follow-up of the form "what happens if..." comes from one of those three facts. This chapter gives you the vocabulary to answer.

## CAP, said correctly

A distributed system that stores data can be **consistent** (every read sees the latest write) and **available** (every request gets a non-error response) as long as the network is fine. When a **partition** happens (some nodes cannot talk to others), you must choose: refuse some requests to stay consistent (CP), or answer from whatever data a node has and risk staleness (AP).

Partitions are not optional; they happen. So the real choice is what to do during one, and it is made per operation, not per system. A bank transfer is CP. A "like" counter is AP.

**PACELC** adds the everyday case: when there is no partition (Else), you still trade **latency** against **consistency**. Waiting for every replica to confirm a write is consistent and slow; acknowledging after one replica is fast and eventually consistent. Most systems let you tune this.

Say it like this: "During a partition this operation should favour availability because stale data is acceptable here; in normal operation I'll accept slightly higher write latency for a synchronous replica so we never lose an acknowledged write."

## Consistency models you should be able to name

From strongest to weakest:

| Model | Guarantee | Cost |
|---|---|---|
| **Linearizable** (strong) | Every operation appears to happen instantly at one point in time; a read always returns the most recent write | Coordination on every operation; highest latency; lowest availability under partition |
| **Sequential** | All nodes see operations in the same order, though not necessarily in real time | Slightly cheaper |
| **Causal** | Operations that are related (a reply after a post) are seen in order; unrelated ones may differ | Practical for social products |
| **Read-your-writes** | A client always sees its own updates | Route a client's reads to where its writes went |
| **Monotonic reads** | A client never sees data go backwards in time | Sticky routing to one replica |
| **Eventual** | If writes stop, all replicas converge | Cheapest; readers may see stale or out-of-order data |

Most product features need **eventual consistency plus read-your-writes**. Money, inventory, and uniqueness need linearizability on the specific records involved. Say which records need which, rather than picking one model for the whole system.

## Quorums

With N replicas, require W acknowledgements for a write and read from R replicas, taking the newest value. If `W + R > N`, every read set overlaps every write set, so a read sees the latest acknowledged write.

```
N = 3
W = 2, R = 2  → consistent reads, tolerates one node down for both reads and writes
W = 3, R = 1  → fast reads, writes stall if any node is down
W = 1, R = 1  → fastest, eventual consistency
```

This is the mechanism behind "tunable consistency" in Dynamo-style stores and is a clean answer to "how do you make this store consistent".

## Leader election and consensus

Many designs need exactly one node to be in charge: the database primary, the scheduler, the node that assigns ids. Choosing it, and making sure everyone agrees who it is even when messages are lost, is **consensus**.

**Raft** (and Paxos, and ZooKeeper's Zab) solve this: a majority of nodes must agree on each decision, so two conflicting leaders cannot both have a majority. Properties to know:

- Requires a **majority** (quorum) to make progress: with 5 nodes, 2 can fail. Use odd numbers.
- The leader replicates a log of decisions; a decision is committed when a majority has it.
- Leader failure is detected by missed heartbeats; a new election takes roughly the heartbeat timeout.
- It is slow relative to a normal write (a round trip to a majority) and is used for **small, critical state**: configuration, locks, membership, shard maps. Not for bulk data.

In practice you do not implement it. You use **etcd, ZooKeeper, or Consul** and say so: "the shard map lives in etcd, which is a Raft cluster, so all routers see the same assignment and a router failure does not lose it."

**Split brain** is what happens without consensus: two nodes each think they are the leader and both accept writes. **Fencing tokens** (a monotonically increasing number issued with each leadership grant, checked by storage before accepting a write) stop a stale leader from doing damage.

## Clocks and time

Machines' clocks drift and are corrected in jumps, so wall-clock timestamps cannot order events across machines reliably. Consequences and tools:

- **Do not use timestamps to decide which write wins** unless you accept arbitrary losses (last-writer-wins is a real choice, with real data loss).
- **Logical clocks** (Lamport timestamps) give an ordering consistent with causality. **Vector clocks** detect concurrent writes so they can be merged rather than silently overwritten.
- **Hybrid logical clocks** combine wall time with a counter and are what modern distributed databases use internally.
- **Monotonic clocks** on a single machine are fine for measuring durations (timeouts); wall clocks are not.

For the interview: use the database's own ordering (auto-increment, log offsets) or a time-ordered id generator with coordination-free uniqueness rather than raw timestamps for ordering.

## Distributed locks

Sometimes one worker at a time must handle a task. A lock in a shared store (Redis `SET key value NX PX ttl`) works with two caveats you must state:

- The lock has a **TTL** so a crashed holder does not block forever, which means a slow holder can lose the lock while still working. Pair it with a **fencing token** or make the work idempotent.
- A single Redis node is a single point of failure; a consensus store (etcd, ZooKeeper) gives a safe lock at the cost of latency.

Prefer designs that do not need a global lock: partition the work so each worker owns a key range, or use a queue so each message is delivered to one consumer at a time.

## Transactions across services

A monolith with one database gets ACID for free. Once an order touches the inventory service, the payment service, and the shipping service, there is no single transaction.

**Two-phase commit** (a coordinator asks everyone to prepare, then tells everyone to commit) gives atomicity but blocks all participants while the coordinator is down and is slow. It is rarely used across services in modern designs; mention it as the thing you are avoiding.

**Sagas** are the practical answer. Break the transaction into a sequence of local transactions, each publishing an event that triggers the next. If a step fails, run **compensating transactions** to undo the earlier ones (refund the payment, release the inventory).

```
Order placed → reserve inventory → charge payment → schedule shipping
                     │                    │ fails
                     └── release inventory ◄──┘  (compensation)
```

Two coordination styles: **choreography** (each service reacts to events; simple, hard to follow at scale) and **orchestration** (a saga coordinator drives the steps; easier to observe and retry). Either way, the system is eventually consistent, the order has intermediate states ("payment pending"), and every step must be idempotent because events are delivered at least once.

Combine sagas with the **outbox pattern** from the queues chapter so that a service's state change and its event are published atomically.

## Failure detection and timeouts

You cannot distinguish a slow node from a dead one. Everything is a timeout plus a policy. Points worth making when the interviewer asks "what if this node dies":

- Heartbeats with a timeout mark it suspect; a quorum of observers, not one, decides it is dead.
- Work assigned to it is reassigned; the work must be idempotent because it may have partially run.
- If it comes back, it must rejoin as a follower and discard uncommitted state.

## Idempotency, again

It appears in this chapter for the third time in this book, because it is the universal tool: retries, at-least-once delivery, saga steps, lock expiry, and failover all produce duplicates. A design where every state change is safe to apply twice is a design that survives all of them. Say it explicitly for each write path in your design.

## Common mistakes

- "This system is AP" as a blanket statement. Choose per operation and say why.
- Relying on timestamps for ordering or conflict resolution without acknowledging the loss.
- Using a single Redis lock for something that must never run twice, without fencing.
- Proposing two-phase commit across microservices.
- Forgetting that eventual consistency means the UI must show intermediate states.

## What to say in the interview

"Balance updates must be linearizable, so they stay in one transactional database, partitioned by account. Everything else, timelines and counters, is eventually consistent with read-your-writes for the acting user. Cross-service flows like checkout run as an orchestrated saga with compensations and idempotent steps, with events published through an outbox. Cluster membership and the shard map live in etcd so there is a single agreed view even during a partition."
