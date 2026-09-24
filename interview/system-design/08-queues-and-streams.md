---
title: Message Queues & Stream Processing
part: Building Blocks
summary: Decoupling producers from consumers, queues versus logs, delivery guarantees and idempotent consumers, ordering, backpressure, dead-letter queues, and where stream processing fits.
---

## Why asynchronous

Not every part of a request needs to finish before the user gets a response. Sending the confirmation email, resizing the uploaded photo, updating followers' feeds, recording analytics: these can happen a moment later, on a different machine, at a pace the system chooses. A message queue is the component that makes that possible.

Putting a queue between two components buys you:

- **Decoupling.** The producer does not know or care who consumes, or whether the consumer is up right now.
- **Buffering.** A burst of a million events is absorbed by the queue and drained at the consumer's rate, instead of crashing the consumer.
- **Retry and durability.** A failed piece of work is retried without the user retrying the request.
- **Fan-out.** One event can be delivered to several independent consumers.

The cost: the work is now eventually done rather than immediately done, and you must handle duplicates, ordering, and failures explicitly.

## Queue versus log

Two different models with different tools. Know which you are drawing.

```
Message queue (SQS, RabbitMQ)             Distributed log (Kafka, Pulsar, Kinesis)

producer ──> [ m1 m2 m3 ] ──> consumer     producer ──> partition 0: [0][1][2][3][4] ...
                              (message      consumer group A reads at offset 2
                               deleted      consumer group B reads at offset 4
                               after ack)   messages are retained for days
```

| | Queue | Log |
|---|---|---|
| After consumption | Message is deleted | Message stays; consumers track an offset |
| Multiple consumers | Compete for messages (work distribution) | Each consumer group reads everything independently |
| Replay | No | Yes, rewind the offset |
| Ordering | Usually best-effort | Strict within a partition |
| Throughput | Moderate | Very high (sequential disk writes) |
| Use | Background jobs, task distribution | Event streams, change feeds, analytics pipelines, anything with many consumers |

Rule of thumb: **a queue for "do this work once"**, **a log for "this happened; anyone interested may react"**.

## Delivery guarantees

Networks and processes fail between "consumer received the message" and "consumer finished and acknowledged". The guarantee you get depends on when the ack is sent.

- **At-most-once**: ack before processing. Nothing is retried; work can be lost. Acceptable for metrics and logs where a gap is tolerable.
- **At-least-once**: ack after processing. If the consumer crashes after doing the work but before the ack, the message is redelivered and the work is done twice. This is the practical default of every broker.
- **Exactly-once**: the ideal, achievable only within narrow boundaries (a single log with transactional producers, or a stream processor that owns both input offsets and output state). Across arbitrary systems it does not exist.

The consequence, and the sentence interviewers wait for: **consumers must be idempotent.** Doing the same message twice must have the same effect as doing it once. Techniques:

- Include a unique message id and keep a table of processed ids (with a TTL).
- Make the operation naturally idempotent: `SET status = 'shipped'` rather than `INCREMENT shipped_count`.
- Use conditional writes: `UPDATE ... WHERE version = expected`.

## Ordering

A single queue with one consumer preserves order. Many consumers do not, because they process in parallel. Logs give strict order **within a partition**; choose the partition key so that everything that must be ordered shares a key. All events for one user go to the partition for that user, so they are consumed in order, while different users are processed in parallel.

If global order is needed there can be only one partition and one consumer, which caps throughput. That is almost never a real requirement; per-entity order almost always is. Say so when asked.

## Backpressure and lag

Consumers can fall behind. A log makes this visible as **consumer lag** (the gap between the newest offset and the consumer's offset). Handle it by:

- Scaling consumers horizontally, up to the number of partitions (one consumer per partition maximum per group). Choose the partition count with headroom.
- Batching: consume and write in batches to reduce per-message overhead.
- Shedding load: drop or sample low-value events when lag exceeds a threshold.
- Applying **backpressure** upstream: if a queue is bounded, producers block or are rejected, which is often better than unbounded growth.

Monitor lag. It is the single most useful metric for an asynchronous pipeline.

## Failure handling

**Retries with backoff.** A failed message is retried after an increasing delay. Bound the number of attempts.

**Dead-letter queue.** After the retry budget is exhausted, move the message to a separate queue for inspection instead of blocking the main one. A poison message (malformed, or one that always crashes the consumer) would otherwise stop everything behind it.

**Visibility timeout.** In queue systems, a message being processed is hidden from other consumers for a period; if not acked in time, it reappears. Set it longer than the work takes.

**Producer-side durability.** The producer must not consider a message sent until the broker has acknowledged it, with the broker writing to replicated storage. Otherwise a broker crash loses messages.

## The transactional outbox

A common trap: the application writes to its database and then publishes an event. If the process dies between the two, the database changed but no event was sent, and downstream systems never learn. Publishing first has the mirror problem.

The fix is the **outbox pattern**: write the business row and an "event to publish" row in the same database transaction. A separate relay process reads the outbox table and publishes to the broker, marking rows as sent. Now the event is published if and only if the transaction committed, at least once. Change-data-capture (tailing the database log) is the same idea without a table.

Mention this whenever a design has "write to database, then notify something".

## Stream processing

When the reaction to events is more than a single consumer's action, you have a stream-processing job: windowed aggregations (views per minute), joins between streams (clicks joined with impressions), enrichment, or feeding materialised views. Tools: Kafka Streams, Flink, Spark Streaming.

Concepts to name if the question goes there: **windows** (tumbling, sliding, session), **event time versus processing time** (events arrive late; watermarks decide when a window closes), **state** (kept locally, checkpointed to durable storage), and **exactly-once inside the processor** via checkpointed offsets.

In most interviews a sentence is enough: "the events land in a log; a stream job aggregates them per minute into the metrics store."

## Common uses in designs

| Situation | Pattern |
|---|---|
| Slow side effects of a request (email, thumbnails, indexing) | Queue + worker pool; respond 202 Accepted |
| Fan-out to followers' feeds | Log partitioned by author; feed workers consume |
| Notification delivery | Queue per channel (push, SMS, email), each with retries and a dead-letter queue |
| Keeping search index or cache in sync with the database | Change-data-capture into a log; index and cache consumers |
| Order processing across services | Events on a log; each service reacts; sagas for compensation |
| Analytics and metrics | Log → stream processor → warehouse and dashboards |
| Absorbing write bursts | Ingest to a log first, persist to the database at a steady rate |

## Common mistakes

- Using a queue and claiming exactly-once delivery.
- Non-idempotent consumers.
- Global ordering requirements that do not exist, or partition keys that do not match the ordering that does.
- No dead-letter queue, so one bad message halts the pipeline.
- Publishing an event outside the database transaction.
- Forgetting that "asynchronous" means the user cannot be told the result synchronously; design the status endpoint or the notification.

## What to say in the interview

"When a user posts, the API writes the post and an outbox row in one transaction and returns immediately. A relay publishes the event to a log partitioned by author id. Feed workers consume it and write into followers' timeline caches; they are idempotent on post id because delivery is at-least-once. Lag is monitored; if a celebrity post creates a spike, more workers are added up to the partition count. Failed deliveries retry with backoff and then go to a dead-letter queue."
