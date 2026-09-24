---
title: Back-of-the-Envelope Estimation
part: Getting Started
summary: The numbers to memorise, a four-line method for QPS, storage, and bandwidth, and how to turn the result into an architectural decision.
---

## Why estimate at all

Estimation is not about the number. It is about which of three regimes you are in:

- **Small.** Everything fits on one well-provisioned machine. A single database with a replica, maybe a cache. Do not over-build.
- **Medium.** Reads or storage exceed one machine. You need a cache, read replicas, maybe a CDN, and to think about which table grows.
- **Large.** Writes or data exceed one machine. You need partitioning, asynchronous pipelines, and to design for partial failure.

A two-minute calculation tells you which regime the interviewer's numbers put you in, and that decides the whole design. Say the numbers out loud, round aggressively, and move on.

## Numbers to memorise

**Powers of two and data sizes**

| Power | Approximate | Name |
|---|---|---|
| 2¹⁰ | 1 thousand | KB |
| 2²⁰ | 1 million | MB |
| 2³⁰ | 1 billion | GB |
| 2⁴⁰ | 1 trillion | TB |
| 2⁵⁰ | 1 quadrillion | PB |

**Time**

| Unit | Seconds |
|---|---|
| 1 day | 86,400, round to 10⁵ |
| 1 month | 2.6 million, round to 2.5 × 10⁶ |
| 1 year | 31.5 million, round to 3 × 10⁷ |

The most useful shortcut: **1 million requests per day is about 12 per second.** So 100 million per day is about 1,200 per second, and a billion per day is about 12,000 per second.

**Latency, roughly (for reasoning, not precision)**

| Operation | Time |
|---|---|
| L1 cache reference | 1 ns |
| Main memory reference | 100 ns |
| Read 1 MB sequentially from memory | 10 µs |
| SSD random read | 100 µs |
| Read 1 MB from SSD | 1 ms |
| Round trip inside a data centre | 0.5 ms |
| Read 1 MB from spinning disk | 20 ms |
| Round trip across a continent | 50 to 100 ms |
| Round trip across the Atlantic | 150 ms |

The lessons: memory is a thousand times faster than disk, a data-centre round trip is cheap but a cross-region one is not, and a request that touches disk many times will be slow.

**Typical single-machine capacity, order of magnitude**

| Component | Rough limit |
|---|---|
| A relational database (well-indexed, simple queries) | thousands to low tens of thousands of QPS |
| An in-memory cache node (Redis-like) | around 100,000 simple operations per second |
| A stateless API server | a few thousand requests per second |
| A message broker partition | tens of thousands of messages per second |
| Disk on one server | tens of TB |

These are for intuition. If your calculated load is within a factor of ten of a limit, plan to scale that component out.

**Availability**

| Nines | Downtime per year | Per day |
|---|---|---|
| 99% | 3.65 days | 14 minutes |
| 99.9% | 8.7 hours | 1.4 minutes |
| 99.99% | 52 minutes | 8.6 seconds |
| 99.999% | 5 minutes | under 1 second |

Every additional nine roughly costs a redundant copy of something: a second server, a second data centre, a second region.

## The four-line method

Do these in order and write each result on the board.

**1. Traffic.** Daily active users × actions per user per day = requests per day. Divide by 10⁵ for average QPS. Multiply by 2 to 5 for peak.

**2. Read/write ratio.** Which operations dominate? A feed is read 100 times for every post. A logging system is almost all writes. This decides where the cache and the queue go.

**3. Storage.** Writes per day × size per record × retention. Add media separately; it is usually a thousand times larger than metadata.

**4. Bandwidth.** QPS × average payload. Only matters when payloads are large (video, images) or QPS is very high.

Then say what the numbers imply: "That is 1,000 write QPS and 100,000 read QPS on 5 TB of data. The reads need a cache and replicas; the writes fit one primary; the data needs to be partitioned within two years."

## Worked example 1: URL shortener

Assume 100 million new URLs per month, and a 10:1 read-to-write ratio.

```
Writes:   100M / month  ≈ 100M / 2.5M s  ≈ 40 per second
Reads:    10 × 40       = 400 per second, peak maybe 2,000
Storage:  each record ≈ 500 bytes (short code, long URL, owner, timestamps)
          100M × 500 B  = 50 GB per month → 600 GB per year → 6 TB over 10 years
Cache:    if 20% of URLs get 80% of reads, cache 20% of a day's reads:
          400 × 86,400 × 0.2 × 500 B ≈ 3.5 GB   → one cache node
```

Conclusion: the write load is trivial, the read load is modest and cache-friendly, and storage is a few TB over the product's life. One primary database with replicas and a cache is enough; the interesting problems are key generation and redirect latency, not scale.

## Worked example 2: Twitter-like feed

Assume 300 million monthly users, half active daily, each posting 2 tweets per day and reading their timeline 20 times.

```
Posts:    150M × 2 / 10⁵ s        ≈ 3,000 per second
Timeline reads: 150M × 20 / 10⁵  ≈ 30,000 per second, peak ~100,000
Text storage: 3,000/s × 86,400 × ~300 B ≈ 80 GB per day of tweet text
Media: if 10% include a 1 MB image → 3,000 × 0.1 × 1 MB × 86,400 ≈ 26 TB per day
Fan-out: average 200 followers → 3,000 posts/s × 200 = 600,000 timeline inserts per second
```

Conclusion: timeline reads must come from a precomputed cache, not a query. Fan-out on write generates hundreds of thousands of cache writes per second, which is fine for a cache cluster but must be asynchronous. Media is the storage problem and goes to blob storage plus CDN, never in the database.

## Worked example 3: Chat service

50 million daily users, 40 messages sent each per day, messages kept for 5 years.

```
Messages: 50M × 40 / 10⁵ ≈ 20,000 per second, peak 100,000
Storage: 20,000/s × 86,400 × ~200 B ≈ 350 GB per day → 640 TB over 5 years
Connections: 50M daily users, maybe 5M concurrent persistent connections
```

Conclusion: writes dominate and never stop, so the message store must be partitioned from day one (a wide-column store keyed by conversation). Five million open connections means a fleet of connection servers, and the interesting part is delivery and ordering, not storage of any single message.

## Turning numbers into decisions

| The estimate says | Design consequence |
|---|---|
| Reads ≫ writes, working set fits in memory | Cache in front of the database; read replicas |
| Write QPS beyond ~10k | Partition the primary store; consider a log-structured store; buffer through a queue |
| Storage beyond one machine (tens of TB) or fast growth | Shard from the start; pick the shard key now |
| Large payloads | Blob storage plus CDN; store only metadata in the database |
| Millions of concurrent connections | Dedicated connection tier with sticky routing and a pub/sub layer behind it |
| Bursty traffic (10× peaks) | Queue between ingestion and processing; autoscaling stateless tier; rate limiting |
| Fan-out multiplies writes | Asynchronous fan-out workers; hybrid strategy for very popular sources |
| Strict latency (tens of ms) | Everything in memory on the read path; precompute; keep data close to users |

## Common mistakes

- **Precision theatre.** Computing 1,157.4 QPS wastes time. Say "about a thousand".
- **Forgetting peak.** Average QPS is fine for storage; capacity is planned for peak, so multiply by 2 to 5.
- **Mixing units.** Bytes versus bits (bandwidth is usually in bits), per day versus per second. Write the unit on every line.
- **Estimating media in the database.** Media is separate and dominates storage.
- **Not concluding.** The numbers are only useful if you end with "therefore the design needs...".

Say the method, do the arithmetic, state the consequence, and move on. Two minutes.
