---
title: Case Study — Chat System & Notifications
part: Case Studies
summary: WhatsApp-style messaging. The connection tier, message flow and storage, ordering and delivery receipts, group chats, presence, offline delivery, and the notification pipeline that sits beside it.
---

## Why this question

Chat is the standard question for real-time systems. It forces a stateful connection tier, which is unlike everything else in the framework, and it has clean sub-problems (ordering, delivery guarantees, presence, groups) that interviewers can pull on one at a time. The notification system is a natural companion and is sometimes asked alone.

## Phase 1: Requirements

**Functional**

- One-to-one chat and small group chat (up to a few hundred members).
- Messages delivered in real time when the recipient is online; stored for delivery when they are not.
- Message history, ordered, on any of the user's devices.
- Delivery and read receipts; presence (online/last seen); typing indicators (optional, ask).
- Text first; media as a follow-up.

**Non-functional**

- Low latency delivery: well under a second.
- Messages must never be lost once the server acknowledges them.
- Ordering within a conversation must be consistent for all participants.
- Very high write volume; the message store grows forever.

## Phase 2: Estimation

```
Daily active users:     50 million
Messages:               40 per user per day → 20,000 per second average, 100,000 peak
Concurrent connections: ~10% of daily users → 5 million persistent connections
Storage:                20,000 × 86,400 × 200 B ≈ 350 GB per day → 640 TB over 5 years
Per connection server:  ~100,000 connections (memory bound) → 50+ servers, plan for 100
```

Conclusion: the message store is partitioned from day one (append-only, keyed by conversation). The connection tier is a fleet, so routing a message to the right server is a first-class problem. Storage is large but cheap; the interesting work is delivery.

## Phase 3: API and protocol

Two kinds of API. An HTTP API for everything that is not real time:

```
GET  /v1/conversations                          list with last message and unread counts
GET  /v1/conversations/{id}/messages?before=&limit=50
POST /v1/conversations                          create (members[])
POST /v1/media/upload-url                       pre-signed upload
```

And a persistent **WebSocket** connection for messages and events, with a small message protocol:

```
client → server:  { type: "send",  client_msg_id, conversation_id, body }
server → client:  { type: "ack",   client_msg_id, message_id, ts }
server → client:  { type: "message", message_id, conversation_id, sender_id, body, ts }
client → server:  { type: "received", message_id }         (delivery receipt)
client → server:  { type: "read", conversation_id, up_to_message_id }
server ↔ client:  { type: "presence" | "typing" ... }
```

`client_msg_id` is the idempotency key: the client retries a send until it gets an ack, and the server deduplicates.

## Phase 3: High-level design

```
   phone A                                              phone B
      │ WebSocket                                          │ WebSocket
      ▼                                                    ▼
+-------------+       +---------------+            +-------------+
| Connection  | ────> |  Chat service | ─────────> | Connection  |
| server 1    |       |  (stateless)  |  route to  | server 7    |
+-------------+       +-------+-------+  B's server+-------------+
                              │
          +-------------------+--------------------+
          ▼                   ▼                    ▼
   +--------------+   +----------------+   +----------------+
   | Message store|   | Session/       |   | Push           |
   | (wide-column,|   | presence store |   | notification   |
   | by convo id) |   | (Redis)        |   | service        |
   +--------------+   +----------------+   +----------------+
```

**Data model (wide-column store, Cassandra-style)**

```
messages_by_conversation
  partition key:  conversation_id
  clustering key: message_id DESC      (time-ordered Snowflake id)
  columns:        sender_id, body, media_key, sent_at

conversations_by_user
  partition key:  user_id
  clustering key: last_message_at DESC
  columns:        conversation_id, last_message_preview, unread_count

conversation_members (conversation_id → member ids), small, cached
```

**Session store (Redis):** `user:{id}:connections → {server_id, device_id, connected_at}` for each active device. **Presence:** `user:{id}:last_seen`, refreshed by heartbeats.

## Deep dive 1: The connection tier

A connection server holds tens of thousands of open WebSockets in memory. When a user connects (after authenticating over the initial HTTP handshake), the server registers `user → server` in the session store and starts heartbeats. On disconnect or missed heartbeats, it removes the entry.

Sending to user B means: look up B's server(s) in the session store, then forward the message to that server, which writes it to B's socket. Two ways to forward:

- **Direct RPC** to the server: precise, one hop, requires every server to be addressable and the registry to be accurate.
- **Pub/sub**: each connection server subscribes to a channel per connected user (or per server); the chat service publishes to B's channel. Simpler routing; a broker in the middle.

Either is acceptable. Say the registry must be treated as a hint: if the forward fails (B moved servers), fall back to store-and-notify.

Scaling: connection servers are added behind an L4 balancer; clients reconnect with backoff and jitter after a server restart, and on reconnect they ask for messages since the last id they saw, so nothing is lost across the reconnect.

## Deep dive 2: The message flow, end to end

1. A sends `{send, client_msg_id, convo, body}` over the socket to connection server 1.
2. Server 1 forwards to the chat service (stateless, horizontally scaled).
3. The chat service assigns a `message_id` (Snowflake: time-ordered, unique), writes the message to the message store (this is the durability point), and updates `conversations_by_user` for each member (or enqueues that update).
4. The chat service acks A: `{ack, client_msg_id, message_id}`. A shows one tick.
5. For each other member: look up their connections. If online, forward to their connection server, which delivers. If offline (or delivery fails), enqueue a push notification and rely on sync-on-reconnect.
6. B's device sends `{received, message_id}`; the chat service records it and forwards to A: two ticks. `read` works the same: blue ticks.

The write to the store happens before the ack, so an acknowledged message is never lost. Delivery to B is at-least-once (B deduplicates by `message_id`); order is by `message_id`.

## Deep dive 3: Ordering

Two users send at the same moment. Whose message comes first? The answer is: whichever the chat service assigned the smaller `message_id`, and every participant renders by `message_id`. Because ids are generated by the server, not the client, all devices agree. Client-side timestamps are shown but never used for ordering.

Within one conversation, if strict ordering across the chat service instances matters (two instances handling the same conversation concurrently could interleave ids by a millisecond), route each conversation to one instance by hashing `conversation_id`, or accept millisecond-level reordering as invisible to users. State the choice.

## Deep dive 4: Offline users and multi-device sync

A user's devices each keep the last `message_id` they have per conversation. On connect, the device requests `messages after X` for its open conversations (or the conversation list with last-ids and pulls on open). Because the store is ordered by `message_id` per conversation, this is a cheap range read. Messages are never "delivered once and forgotten" on the server; they are stored, and devices sync. This makes multi-device trivial: every device is just another syncing client.

Push notifications are the wake-up for offline devices (below), not the delivery mechanism.

## Deep dive 5: Group chat

For a group of 300, the chat service fans out to 300 members: look up each member's connections and forward. The message is stored once (by conversation). The per-user conversation list update is 300 writes, done asynchronously. For very large groups (channels with a million subscribers) this becomes the news-feed fan-out problem; switch to pull (members fetch on open) and push only "new messages available" hints.

Membership changes must be ordered relative to messages (a user removed at time T must not receive messages after T); handle by writing membership changes into the same per-conversation log.

## Deep dive 6: Presence and typing

**Presence** is high-volume and low-value: heartbeats every 30 seconds from 5 million connections is 170,000 writes per second to the presence store, all of them fire-and-forget. Store `last_seen` with a TTL; "online" means a heartbeat within the last minute. Distribute presence changes only to users who care (open conversation with the person), via pub/sub, and debounce flapping. **Typing indicators** are ephemeral: forward to the conversation's online members via the connection tier; never stored.

## Deep dive 7: Media

Same pattern as everywhere: the client uploads to object storage via a pre-signed URL, gets a key, and sends a message referencing it. Recipients download through a CDN with signed URLs. End-to-end encryption, if in scope, means the server stores ciphertext and keys are exchanged between devices; say the server design is unchanged except it cannot read or index content.

## Deep dive 8: The notification pipeline

A notification system delivers events to users through push (APNs, FCM), SMS, and email. It is asked standalone often enough to have its own shape:

```
event producers ──> notification service ──> queue per channel ──> workers ──> providers
(chat, feed, ...)   (preferences, dedupe,     (push, sms, email)    (retry,     (APNs, FCM,
                     templating, rate limits)                        backoff)    Twilio, SES)
```

Points to make: user preferences and do-not-disturb are checked before enqueueing; each notification has an id for idempotent delivery; device tokens are stored per device and pruned when providers report them invalid; per-channel queues isolate a slow provider; a dead-letter queue catches permanent failures; delivery events are logged for analytics and for the "did the user see it" loop. For chat, push carries a small payload ("New message from A") and the device syncs the real content on wake.

## Phase 5: Wrap up

Weak points: the session registry can be briefly stale (mitigated by fallback to store-and-notify); presence is approximate; very large groups need the feed-style hybrid; the message store partition for an extremely active group is a hot partition (bucket by time to split it).

## Follow-up questions to expect

- "How do you guarantee no message loss?" Persist before ack; devices sync by last id; at-least-once forwarding with client dedupe.
- "What happens when a connection server dies?" Clients reconnect to another with backoff; the registry entries expire; missed messages arrive via sync.
- "How do you scale the message store?" Partition by conversation id; time-bucket hot conversations; the store is append-only so LSM-based wide-column databases fit.
- "How would you add search over messages?" Index per user in a search cluster from the message stream; for end-to-end encrypted chats, search is client-side.
- "Unread counts?" Maintained in the per-user conversation list, incremented on message, reset on read; eventually consistent.

## The two-minute version

"Clients hold WebSockets to a connection tier; a Redis registry maps users to servers. A message is written to a wide-column store partitioned by conversation and ordered by a server-assigned time-ordered id, then acknowledged, then forwarded to recipients' connection servers or, if offline, queued for push. Devices sync by last-seen id on reconnect, which also gives multi-device support. Groups fan out through the same path; very large groups switch to pull. Presence is heartbeats with TTLs; typing is ephemeral pub/sub. Notifications run through a separate service with per-channel queues and retries."
