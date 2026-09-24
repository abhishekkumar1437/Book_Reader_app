---
title: Case Study — Proximity Service & Typeahead
part: Case Studies
summary: Two "find things fast from a huge set" problems. Nearby search with geohash and quadtrees (Yelp, Uber), then search autocomplete with a precomputed trie and a data pipeline for popularity.
---

## Part A: Proximity service

### Why this question

"Find restaurants within 2 km" or "match a rider with nearby drivers" needs an index over two-dimensional coordinates, which ordinary database indexes do not handle well. The interviewer wants to see you turn 2D into something indexable, and then handle the difference between static places (Yelp) and moving objects (Uber).

### Phase 1: Requirements

**Functional**

- Given a latitude, longitude, and radius, return nearby businesses (or drivers).
- Businesses can be added, updated, and removed by owners; reads vastly outnumber writes.
- For the ride-hailing variant: drivers update their location every few seconds; riders query for nearby available drivers.

**Non-functional**

- Query latency under 100 ms.
- Highly available; eventual consistency for business updates is fine (a new listing appearing in a minute is acceptable).
- Scale: hundreds of millions of businesses; for Uber, millions of active drivers updating constantly.

### Phase 2: Estimation

```
Businesses: 200 million, ~1 KB metadata each → 200 GB metadata; the geo index is far smaller (id + cell)
Search QPS: 100 million daily users × 5 searches / 10⁵ ≈ 5,000 per second
Business updates: negligible (thousands per day)

Uber variant: 2 million drivers × one update per 4 seconds = 500,000 location writes per second
```

Conclusion: the static case is read-heavy with a small index that fits in memory. The moving case is a write-heavy in-memory problem where durability of each location update does not matter (the next one replaces it).

### Phase 3: API

```
GET /v1/search/nearby?lat=&lng=&radius=&limit=   → [{ business_id, name, distance_m, rating }]
GET /v1/businesses/{id}
POST/PUT/DELETE /v1/businesses                   owner operations
```

### The core problem: indexing 2D space

A B-tree index on `(lat, lng)` cannot answer "within a radius" efficiently; it would scan a latitude band and filter. You need to turn location into a single key that groups nearby points together. Three standard options.

**Geohash.** Interleave the bits of latitude and longitude and encode in base32. The result is a string where **points that share a prefix are in the same cell**, and longer prefixes mean smaller cells:

```
precision 4 → cell ≈ 39 km × 20 km
precision 5 → cell ≈ 5 km × 5 km
precision 6 → cell ≈ 1.2 km × 0.6 km
precision 7 → cell ≈ 150 m × 150 m

point (37.7749, -122.4194) → "9q8yyk..."
```

To search a 2 km radius: pick the precision whose cell is about that size (5 or 6), compute the geohash of the query point, and fetch all businesses whose geohash starts with that prefix **plus the eight neighbouring cells** (a query near a cell edge would otherwise miss things just across the boundary). Then compute exact distances and filter. The database index is a normal string index on `geohash`, so this works in any database, and Redis has it built in (`GEOADD`, `GEOSEARCH`).

The known weakness: two points can be very close but in different cells with different prefixes (the edge problem), which the neighbour lookup solves.

**Quadtree.** Recursively divide the map into four quadrants until each leaf holds at most K points (say 100). Dense cities get deep subdivisions, empty oceans stay as one big leaf. A nearby query descends to the leaf containing the point and walks outward to neighbouring leaves until enough results are found. The tree for 200 million points is a few GB and lives in memory on each search server, rebuilt periodically (nightly plus incremental updates). Adapts to density better than fixed-size geohash cells; harder to keep updated live.

**S2 / H3 cells.** Hierarchical cell systems (Google S2, Uber H3) that avoid geohash's distortion and edge problems; conceptually the same as geohash for the interview. Mention as what production systems use.

Recommendation for the interview: geohash for simplicity and because it maps onto ordinary indexes and Redis; quadtree if the interviewer wants the in-memory, density-adaptive version.

### Phase 3: High-level design (static businesses)

```
client ──> load balancer ──> location service ──> geo index (Redis GEO or a geohash-indexed table, read replicas)
                                   │                              ▲
                                   ▼                              │ async update on change
                          business metadata DB (cache) ◄── business service ◄── owner writes
```

**Flow:** compute the geohash prefix and neighbours; query the index for ids in those nine cells; compute exact distance; sort; take the top N; hydrate metadata from the cache; return. The index is read-only from the search path and updated asynchronously from business changes (eventual consistency is fine).

Scaling reads: the index is small; replicate it to every search server or across Redis replicas; shard by geohash prefix (which is also sharding by region) if it outgrows one node. Hot regions (a city centre at lunch) are handled by more replicas for those shards.

### Deep dive: the moving case (Uber)

Drivers send `(driver_id, lat, lng, status)` every few seconds: 500,000 writes per second. Requirements change:

- **In-memory only.** Each update replaces the last; durability is pointless. Keep the current location per driver in Redis (or a geo-sharded in-memory service), with a TTL so silent drivers disappear.
- **Shard by region.** Partition by geohash prefix so a city's drivers live in one shard; queries are local. Dense cities can be split into finer prefixes.
- **Write path**: the driver's app posts to a location service that updates the geo index (`GEOADD` with the driver id). Reads (`GEOSEARCH` within a radius, filtered by available status) come from the same shard.
- **Matching**: rider requests → find K nearest available drivers → a dispatch service offers the ride to the closest, with a short hold on that driver to avoid double-offering (an atomic status change).
- **Location history** for trips goes to a separate append-only store via a log; the live index never holds history.
- **Efficiency**: drivers moving slowly or stationary send updates less often; the client batches.

### Follow-ups to expect

- "How do you handle the geohash edge problem?" Query the eight neighbours.
- "Why not a SQL `WHERE` with a bounding box?" A band scan; fine for tiny datasets, not at scale, and no radius ordering.
- "How do you rank results?" Distance first, then rating and open-now filters; a ranking model if the product wants it.
- "How do you keep the index consistent with business edits?" Change events update the index within seconds; the search path never writes.
- "Global scale?" Shard the index by region, deploy search servers in each region, and route users to the nearest.

## Part B: Search autocomplete (typeahead)

### Why this question

It looks small and hides a data pipeline. The interviewer wants a fast in-memory serving structure, a sensible way to compute popularity, and an update strategy that does not require rebuilding everything on every keystroke.

### Requirements

- As the user types, return the top 5 to 10 most popular queries that start with the typed prefix.
- Latency under 100 ms per keystroke, so the whole thing must be in memory and precomputed.
- Popularity reflects recent usage; updates within hours are fine (real-time is a follow-up).
- Only the top few results matter; exactness of the ranking is not critical.

### Estimation

```
Users: 10 million daily, ~10 searches each, ~4 keystrokes per search that hit the service → 4 × 10⁸ per day ≈ 5,000 QPS, peak 25,000
Distinct queries worth suggesting: tens of millions; each with a count → a few GB in memory
```

### Serving design

**A trie with precomputed top-k at each node.** Each node stores the k most popular complete queries in its subtree. A lookup walks the prefix (one step per character) and returns the node's list: O(prefix length), with no subtree traversal at query time.

```
root
 └─ b
    └─ e  top: [best pizza, berlin weather, ...]
       └─ s
          └─ t  top: [best pizza, best laptops 2026, ...]
```

Building the trie: insert every query with its count, then compute top-k bottom-up (each node merges its children's lists with its own terminal count). Memory: tens of millions of nodes with small lists, a few GB; fits one server, replicated to many.

Alternatives worth naming: a sorted array of queries with binary search on the prefix and a scan of the range (simpler, slower for popular prefixes), or a search engine's completion suggester (the same trie idea inside Elasticsearch).

**Serving path**: client sends the prefix after a short debounce (say 100 ms) to avoid a request per keystroke; a CDN or gateway cache answers the most common short prefixes (the top thousand one- and two-letter prefixes cover a large share of requests); otherwise a serving node walks its in-memory trie. Serving nodes are identical replicas behind a balancer; if the trie outgrows one node, shard by first character (with weighting so "s" and "t" do not dominate one shard).

### The data pipeline

```
search logs ──> log/stream ──> aggregator (counts per query per hour/day) ──> trie builder ──> trie snapshot in object storage ──> serving nodes reload
```

- **Aggregation** happens in batch (hourly or daily): sum counts with time decay so last week's fad fades. Filter out abusive or offensive queries with a block list.
- **Build** the trie offline, serialise it, store the snapshot. Serving nodes load the new snapshot into memory alongside the old one and swap atomically; no downtime, no partial state.
- **Freshness**: hourly rebuilds are fine for most products. For trending queries within minutes, keep a small separate "recent" trie updated from a short window and merge its results into the response with a boost.

### Personalisation and filtering

Personalised suggestions (the user's own recent searches) come from a per-user list in a cache, merged client-side or at the gateway ahead of the global results. Language and region are handled by separate tries per locale, chosen by the request.

### Follow-ups to expect

- "How do you update in real time?" A small recent-window trie merged at serve time; full rebuild periodically.
- "What if the trie does not fit in memory?" Shard by prefix; or store nodes in a key-value store keyed by prefix with the top-k list as the value (each keystroke is one lookup, which is essentially a flattened trie).
- "How do you handle typos?" Fuzzy matching is a different structure (edit-distance automata or n-gram indexes); mention, do not design.
- "How do you prevent bad suggestions?" Block lists in the pipeline; manual overrides; a quality classifier.

## The two-minute versions

**Proximity:** "Locations are indexed by geohash so nearby points share a prefix; a search fetches the query cell and its eight neighbours from a Redis geo index sharded by region, filters by exact distance, and hydrates metadata from a cache. Business edits update the index asynchronously. For moving drivers the index is in-memory only with TTLs, written 500,000 times a second, sharded by city."

**Typeahead:** "Search logs are aggregated with time decay into query counts; an offline job builds a trie with the top 10 suggestions precomputed at every node and publishes a snapshot that serving nodes hot-swap into memory. A request is a debounced prefix lookup, O(prefix length), cached at the edge for short prefixes. A small recent-window trie adds trending queries."
