---
title: Case Study — Video Streaming
part: Case Studies
summary: YouTube or Netflix. The upload and transcoding pipeline, adaptive bitrate streaming, CDN strategy and cost, metadata and view counts, and what breaks at scale.
---

## Why this question

Video is where bandwidth and storage dominate everything. The interviewer wants to see that you keep bytes off your servers, design an asynchronous processing pipeline with clear states, and understand why the CDN is the system. It also tests whether you can separate the small, hot metadata problem from the huge, cold bytes problem.

## Phase 1: Requirements

**Functional**

- Upload a video; it becomes watchable after processing.
- Watch a video with smooth playback on any device and network.
- Basic metadata: title, description, thumbnail, uploader, view count.
- Search and recommendations exist; ask whether in scope (usually not for this round).

**Non-functional**

- Playback must start quickly (under two seconds) and not stall.
- Upload can take minutes to process; the user is told the status.
- Very large storage that grows forever; cost matters.
- High availability for playback; global audience.

## Phase 2: Estimation

```
Daily active users:  50 million, watching 5 videos each → 250M views per day ≈ 3,000 per second
Uploads:             1% of users upload one video per day → 500,000 per day ≈ 6 per second
Upload size:         average 500 MB raw → 250 TB per day ingested
Encoded outputs:     ~1 GB per video across all resolutions → 500 TB per day stored, ~180 PB per year
Bandwidth:           3,000 concurrent starts; say 5M concurrent viewers at 3 Mbps ≈ 15 Tbps served by the CDN
```

Conclusion: storage and egress are enormous and are the cost. All video bytes go through object storage and CDN; application servers only ever handle metadata. Transcoding is a large batch-compute pipeline. The metadata database is comparatively tiny and can be a normal replicated relational database.

## Phase 3: API

```
POST /v1/videos                       { title, description, size, content_type } → { video_id, upload_url (pre-signed, multipart) }
POST /v1/videos/{id}/complete         client signals the upload finished
GET  /v1/videos/{id}                  metadata + status (processing | ready | failed) + manifest URL when ready
GET  /v1/videos/{id}/manifest.m3u8    served via CDN
GET  /v1/videos/{id}/{rendition}/{segment}.ts   served via CDN
POST /v1/videos/{id}/view             view event (batched, async)
```

## Phase 3: High-level design

```
 UPLOAD                                            PLAYBACK
 client ──1. create──> API ──> metadata DB          client ──> CDN ──miss──> object storage
   │                                                     ▲        (manifest + segments)
   │ 2. multipart PUT (pre-signed)                       │
   ▼                                              signed URLs from API
 object storage (raw bucket) ──3. event──> queue
                                            │
                                            ▼
                                   transcoding workers ──4. write renditions──> object storage (encoded bucket)
                                            │
                                            └──5. status = ready──> metadata DB
```

**Metadata model (relational)**

```
videos       (video_id PK, uploader_id, title, description, duration, status, raw_key, created_at)
renditions   (video_id, resolution, bitrate, manifest_key)
thumbnails   (video_id, key)
view_counts  in Redis, flushed to DB periodically
```

## Deep dive 1: Upload

Large files, unreliable networks. The client requests a pre-signed **multipart** upload, splits the file into chunks (say 10 MB), uploads them in parallel, and can resume any failed chunk. Object storage assembles the parts. The API never sees the bytes. On completion, the client calls `/complete`, or the object store emits an event; either way, a message lands in the processing queue with the raw object key.

Deduplication (the same file uploaded twice) is optional: hash chunks client-side or compare a checksum after upload.

## Deep dive 2: Transcoding pipeline

One raw file becomes many outputs: several resolutions and bitrates (240p to 4K), possibly several codecs (H.264, VP9, AV1), audio tracks, thumbnails, and captions. Each output is CPU-heavy, so the pipeline is a **directed graph of tasks** run by a worker fleet:

```
raw file ──> probe (duration, codec) ──> split into chunks (by keyframe)
          ──> for each chunk × each rendition: encode  (massively parallel)
          ──> merge chunks per rendition ──> package into segments + manifest
          ──> thumbnails, captions (parallel side tasks)
          ──> mark ready
```

Points to make:

- **Chunked, parallel encoding** turns an hour-long encode into minutes across many workers, and lets a failed chunk retry alone.
- **A workflow orchestrator** (a task scheduler with a DAG per video) tracks state; workers are stateless and pull tasks from queues by type. Queues are separated by priority so a popular creator's upload is not stuck behind a backlog.
- **Idempotent tasks**: the output key is deterministic (`{video_id}/{rendition}/{chunk}`), so a retried task overwrites the same object.
- **Encode the low resolution first** so playback can begin while higher ones are still processing.
- **Cost**: encoding is the biggest compute cost; use spot or preemptible instances with checkpointing for the bulk, and a small reserved pool for priority.

## Deep dive 3: Adaptive bitrate streaming

Playback is not a file download. Each rendition is cut into short segments (2 to 6 seconds), and a **manifest** (HLS `.m3u8` or DASH `.mpd`) lists the renditions and their segments. The player downloads the manifest, measures its throughput, and picks the highest rendition it can sustain, switching between renditions at segment boundaries as network conditions change. That is why playback rarely stalls and why it starts fast (the first segment of a low rendition is small).

Consequences for the design: every segment is a small, immutable, independently cacheable object, which is perfect for a CDN; and the player, not the server, does the adaptation, so servers are dumb file servers.

## Deep dive 4: CDN strategy and cost

Egress is the dominant cost and the CDN is where nearly all bytes are served. Decisions to state:

- **Cache everything immutable** with long TTLs: segments and manifests for ready videos never change (a re-encode gets a new key).
- **Popularity is skewed**: a small fraction of videos gets most views. Those are hot in every edge; the long tail is served from a mid-tier cache or the origin. Pre-warm edges for predictable hits (a new release from a major creator).
- **Multi-CDN** for resilience and price negotiation, with the client or DNS choosing.
- **Regional origins**: replicate the encoded bucket to a few regions so CDN misses are short trips.
- **Storage tiering**: keep hot and recent videos on standard storage; move cold tail renditions to infrequent-access tiers; consider dropping rarely used high renditions for very cold content.

Say the number: at 15 Tbps, a cent per GB of egress difference is millions per month, which is why the encoding ladder and caching are business decisions.

## Deep dive 5: Playback start

1. The client fetches metadata from the API (small, cached).
2. It receives a signed manifest URL (short-lived, if content is protected) and fetches the manifest from the CDN.
3. It fetches the first segments of a conservative rendition and starts playing, then ramps up.

To hit a two-second start: manifests and first segments cached at the edge, small first segments, and a player that starts with a low rendition. DRM, if required, adds a license request to a key server before the first decrypted segment.

## Deep dive 6: View counts and analytics

A view is a high-volume event (thousands per second) that nobody needs to be exact to the last unit in real time. Clients send playback events (start, progress, completion) to a collection endpoint; events go to a log; a stream processor aggregates views per video per minute and updates a counter in Redis (sharded for hot videos) for display, and a warehouse for analytics and creator dashboards. Counting rules (a view requires N seconds of playback; deduplicate rapid replays) are applied in the stream job, not on the client.

## Deep dive 7: Metadata and search

The metadata service is an ordinary read-heavy service: relational database with replicas, cache in front, video pages cached at the CDN for a short TTL. Search is a search index fed by metadata changes. Recommendations are a separate offline-plus-online system fed by view events; mention it as out of scope.

## Deep dive 8: Live streaming (if asked)

The same pipeline in real time: the broadcaster sends a stream (RTMP or WebRTC ingest) to an ingest server; transcoders produce renditions continuously; segments are published to the CDN as they are produced with a rolling manifest; viewers are a few segments behind. Latency (seconds to tens of seconds) is set by segment length; lower-latency variants use shorter chunks. The hard parts are ingest redundancy and the CDN handling a huge simultaneous audience for one stream (the hottest possible key).

## Phase 5: Wrap up

Weak points: processing latency for long uploads (mitigated by chunking and low-res-first); CDN misses for the long tail; the metadata database is a single logical primary (fine at this scale, shard by video id if needed); cost is dominated by egress and encoding and needs continuous tuning.

## Follow-up questions to expect

- "How do you make sure a half-uploaded file does not become watchable?" Status transitions: `uploading → processing → ready`, and only `ready` videos get manifests.
- "How do you resume an upload?" Multipart with per-part completion; the client re-uploads missing parts.
- "Why not stream directly from your servers?" Bandwidth and cost; servers would need to be at every edge; the CDN already is.
- "How would you protect content?" Signed URLs with short expiry, DRM for premium content, geo-restrictions at the CDN.
- "What about copyright detection?" A fingerprinting step in the pipeline compares audio/video fingerprints against a reference index; flagged videos are held.

## The two-minute version

"Uploads go straight to object storage via multipart pre-signed URLs; an event starts a transcoding DAG that encodes chunks in parallel into several renditions, packages them as short segments with HLS manifests, and marks the video ready. Playback is adaptive bitrate: the player fetches the manifest and segments from a CDN, which serves nearly all bytes; origins are replicated regionally and storage is tiered by popularity. Metadata lives in a small replicated relational database with a cache. View events stream into an aggregation job that keeps counters in Redis and feeds analytics. The cost centres are egress and encoding, and the design treats both as first-class."
