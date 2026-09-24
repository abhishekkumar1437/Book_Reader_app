---
title: Object Storage, Search & Unique IDs
part: Building Blocks
summary: Three components that appear in most designs and are rarely explained: blob storage for media, search indexes for text, and how to generate unique, sortable ids without a central counter.
---

## Object storage

Files (images, videos, documents, backups) do not belong in a database. They go in **object storage** (S3, GCS, Azure Blob, or a self-hosted equivalent): a flat namespace of buckets and keys, each object a blob with metadata, accessed over HTTP.

Properties you rely on:

- **Durability** far beyond a single disk (multiple copies across facilities; "eleven nines" is the usual claim).
- **Effectively unlimited capacity** and pay-per-byte pricing.
- **Direct client access** via pre-signed URLs, so uploads and downloads never pass through your servers.
- **Integration with a CDN** for reads, and lifecycle rules for moving cold objects to cheaper tiers or deleting them.

What it is not: fast for small random reads, or a place for data you query by attribute. The database holds the metadata (owner, size, content type, object key, created time); the object store holds the bytes.

**The upload flow, which you will draw often:**

```
1. client → API: "I want to upload a 4 MB photo"
2. API → client: pre-signed PUT URL for key photos/{user}/{uuid}, valid 10 minutes
3. client → object store: PUT bytes directly
4. object store → (event) → queue: "object created"
5. worker: validate, generate thumbnails, write metadata row, mark as ready
```

Large files use **multipart upload** (parallel chunks, resumable). Content that must be private is served through short-lived signed URLs; public content goes through the CDN.

## Search

Databases find rows by exact or range match on indexed columns. They do not rank "running shoes" against a product catalogue or tolerate typos. That is a **search index**: an inverted index from each term to the documents containing it, with scoring (BM25 is the standard) and support for fuzzy matching, filters, facets, and aggregations. Elasticsearch and OpenSearch are the usual names.

```
document 17: "lightweight running shoes"
document 42: "trail running jacket"

inverted index:
  running  → [17, 42]
  shoes    → [17]
  trail    → [42]
```

Design rules:

- **The search index is not the source of truth.** The database is. The index is rebuilt or updated from it, usually via change-data-capture or events, and is eventually consistent (a new listing appears in search seconds after creation; say so).
- **Index only what is searched or filtered**, with the fields needed to render a result; fetch full details from the database or cache by id.
- **Partition by a natural key** when tenants or catalogues are independent (per marketplace, per language), and replicate shards for read throughput.
- **Relevance is product work**: boosting recent items, personalisation, synonyms. Mention it exists; do not design it in a system round unless asked.

**Autocomplete / typeahead** is a related but different problem: prefix matching on a small, hot set of terms with very low latency. The standard answer is a trie (or a sorted term list with binary search) built offline from popular queries, held in memory on the query servers, with the top results per prefix precomputed. The proximity case study touches this.

## Unique id generation

Almost every design needs ids that are unique across many servers and, ideally, roughly ordered by time so that indexes stay compact and "newest first" is a simple sort. Options, and why the last one is the usual answer:

**Database auto-increment.** Unique and ordered, but one database is a bottleneck and a single point of failure, and it does not work across shards. Variant: each of K databases hands out ids with a different offset and step (1, 1+K, 1+2K, ...). Works, but adding a database is awkward and ordering is only approximate.

**UUID v4.** 128 random bits generated anywhere; collision probability is negligible. Unordered, so inserts scatter across B-tree indexes, and 36 characters is long for URLs and storage. Fine when ordering does not matter.

**Ticket server.** One service hands out ranges of ids (a batch of 1,000 at a time) to each application server, which uses them locally. Reduces contention; the ticket server needs redundancy.

**Snowflake-style ids.** A 64-bit integer composed of a timestamp, a machine id, and a per-machine sequence:

```
 1 bit   41 bits                 10 bits        12 bits
[unused][ milliseconds since epoch ][ machine id ][ sequence ]

41 bits of ms  → ~69 years
10 bits        → 1,024 machines
12 bits        → 4,096 ids per ms per machine (over 4 million per second per machine)
```

Ids are unique without coordination (each machine has its own id and its own sequence), sortable by creation time to the millisecond, and fit in a `BIGINT`. This is what most large systems use for posts, messages, orders. Requirements to mention: machine ids must be unique (assigned by a coordination service at startup), clocks must not go backwards (if they do, refuse to issue ids until they catch up), and 69 years is a fine lifetime with a custom epoch.

**ULID and KSUID** are string-friendly variants of the same idea (timestamp plus randomness) for when you want a 128-bit, lexicographically sortable id without a machine-id assignment step.

A minimal Snowflake generator, for the interviewer who asks you to sketch it:

```python
import threading, time

class Snowflake:
    EPOCH_MS = 1_700_000_000_000          # custom epoch: 2023-11-14

    def __init__(self, machine_id: int):
        assert 0 <= machine_id < 1024
        self.machine_id = machine_id
        self.sequence = 0
        self.last_ms = -1
        self.lock = threading.Lock()

    def next_id(self) -> int:
        with self.lock:
            now = int(time.time() * 1000) - self.EPOCH_MS
            if now < self.last_ms:
                raise RuntimeError("clock moved backwards")      # or wait until it catches up
            if now == self.last_ms:
                self.sequence = (self.sequence + 1) & 0xFFF
                if self.sequence == 0:                            # 4096 issued this ms: wait for next ms
                    while now <= self.last_ms:
                        now = int(time.time() * 1000) - self.EPOCH_MS
            else:
                self.sequence = 0
            self.last_ms = now
            return (now << 22) | (self.machine_id << 12) | self.sequence
```

## Short codes for URLs and invites

A related question: generate short, human-typeable keys (six to eight characters) that are unique. Options:

- **Base62-encode a Snowflake or auto-increment id.** Deterministic, unique, no collision check; sequential codes are guessable, which may or may not matter.
- **Hash the input** (MD5 or SHA-256 of the long URL), take the first six or seven base62 characters, and check the database for collision; on collision, append a salt and rehash. Same input gives the same code, which deduplicates.
- **Pre-generate a pool** of random unique keys offline into a key store; servers take a batch each. No collision handling at request time; needs the pool service to be highly available.

Base62 (`0-9a-zA-Z`) with 7 characters gives 62⁷ ≈ 3.5 trillion codes, enough for any realistic shortener. The URL shortener case study walks through the choice.

## Common mistakes

- Files in the database, or uploads through application servers.
- Treating the search index as the database, then losing data or wondering why writes are slow.
- Autoincrement ids across shards.
- Random UUIDs as the clustered primary key on a write-heavy table.
- Forgetting the clock-skew failure mode of time-based ids.

## What to say in the interview

"Media goes to object storage via pre-signed URLs, with a CDN in front for reads and an event-driven worker for thumbnails; the database holds only metadata. Search is an Elasticsearch index kept in sync from the database's change stream, so listings are searchable within seconds. Ids are Snowflake-style 64-bit integers: time-ordered, generated locally on each server, no coordination on the hot path."
