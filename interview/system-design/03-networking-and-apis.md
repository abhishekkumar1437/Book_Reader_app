---
title: Networking & API Design
part: Building Blocks
summary: The request path from DNS to your server, REST versus gRPC versus GraphQL, real-time options, and the API details interviewers check: idempotency, pagination, versioning, rate limits.
---

## The path of a request

When a client calls your system, this is roughly what happens. You should be able to narrate it in a few sentences.

```
Client ──DNS──> IP of edge ──TLS──> CDN / edge ──> Load balancer ──> API server ──> services / data
```

1. **DNS** resolves the hostname to an IP. DNS can also do coarse routing: send European users to a European IP (geo-DNS), or rotate among several IPs (round robin). DNS results are cached, so it is not a precise or fast failover mechanism.
2. **TCP and TLS** set up a connection. Each new connection costs round trips, which is why clients keep connections open (keep-alive) and why the edge terminates TLS close to the user.
3. **The edge** (CDN or reverse proxy) serves static content from cache and forwards the rest.
4. **The load balancer** spreads requests over healthy API servers.
5. **The API server** authenticates, validates, and calls services or databases.

In an interview, you draw steps 4 and 5 and mention 1 to 3 only when latency, geography, or static content is part of the question.

## Choosing the API style

| Style | Best for | Watch out for |
|---|---|---|
| **REST over HTTP/JSON** | Public APIs, CRUD on resources, broad client compatibility | Over-fetching and under-fetching; many round trips for nested data |
| **gRPC** (HTTP/2, protobuf) | Internal service-to-service calls, low latency, streaming | Not browser-friendly without a proxy; binary payloads harder to debug |
| **GraphQL** | Clients that need flexible, nested reads (mobile apps with many screens) | Complex queries can be expensive; caching is harder; needs query cost limits |
| **WebSocket** | Bidirectional real-time: chat, live updates, collaborative editing | Stateful connections complicate load balancing and scaling |
| **Server-Sent Events** | One-way server push over plain HTTP: notifications, feeds | One direction only; limited browser connection count |
| **Long polling** | Fallback when WebSockets are unavailable | Wasteful; adds latency up to the poll interval |

The safe interview default: REST for the public API, gRPC between internal services, WebSockets when the requirements say "real time". Say the default and the reason, and move on unless asked.

## Designing the REST API

Resources are nouns, methods are verbs. A small example for a photo-sharing service:

```
POST   /v1/photos                      create (multipart or a pre-signed upload URL)
GET    /v1/photos/{id}                 read
PATCH  /v1/photos/{id}                 partial update
DELETE /v1/photos/{id}                 delete
GET    /v1/users/{id}/photos?cursor=&limit=   list, paginated
POST   /v1/photos/{id}/likes           action on a sub-resource
```

Details interviewers notice:

**Status codes carry meaning.** 200 OK, 201 Created, 202 Accepted (async work started), 400 bad input, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict (version mismatch, duplicate), 429 rate limited, 5xx server fault. Returning 200 with an error body is a red flag.

**Versioning.** Put the version in the path (`/v1/`) or a header. Never break existing clients; add fields, do not rename them.

**Large uploads never go through your API servers.** The client asks the API for a pre-signed URL and uploads directly to blob storage. The API only records metadata. This keeps the API tier stateless and cheap.

## Pagination

Never return unbounded lists. Two options:

**Offset pagination** (`?page=3&limit=20`) is simple but breaks when items are inserted or deleted between pages, and `OFFSET 100000` is slow in most databases because the engine still scans the skipped rows.

**Cursor pagination** (`?cursor=eyJpZCI6MTIzfQ&limit=20`) returns an opaque token pointing at the last item seen, typically an encoded `(sort_key, id)`. The next query is `WHERE (created_at, id) < (cursor.created_at, cursor.id) ORDER BY created_at DESC, id DESC LIMIT 20`, which uses an index and is stable under inserts. This is the answer for feeds, message history, and anything large.

## Idempotency

A network can drop the response to a request that did succeed. The client retries. If the request was "charge the card", the customer is charged twice. **Idempotency** means a retry has no additional effect.

- `GET`, `PUT`, `DELETE` are naturally idempotent if implemented properly.
- `POST` is not. Fix it with an **idempotency key**: the client generates a unique key per logical operation and sends it in a header. The server stores `key → result` (with a TTL) and returns the stored result on a repeat.

```
POST /v1/payments
Idempotency-Key: 7f3c9e...
{ amount: 500, currency: "INR" }

server: if key seen → return stored response (same status, same body)
        else process, store (key, response) atomically, return
```

Mention this whenever money, orders, or messages are involved. It is one of the most reliable ways to show production experience.

## Rate limiting at the API

Protects the system from abuse and from a single client consuming everything. Limits are usually per user or API key, sometimes per IP, expressed as "N requests per window". Return 429 with a `Retry-After` header.

The algorithms (token bucket, sliding window) and the distributed implementation are the subject of their own case study. At the API design level, say where it lives: at the gateway or load balancer, before requests reach application servers.

## Authentication and authorisation, briefly

- **Sessions**: server stores session state, client holds a cookie. Simple; needs a shared session store when there are many servers.
- **Tokens (JWT)**: the server signs a token containing claims; any server can verify it without shared state. Stateless and scalable; revocation is awkward (short expiry plus a refresh token is the usual answer).
- **API keys** for service-to-service or third-party access; **OAuth 2** when a user delegates access to a third party.

Authentication happens at the edge or API gateway once, and the user identity is passed to internal services in a header. Internal services trust the gateway and do not re-verify passwords.

## Real-time delivery in more detail

When the requirements say "users must see updates immediately" you need a persistent connection.

**WebSocket** is a full-duplex TCP connection upgraded from HTTP. The server can push at any time. Implications you must handle:

- **Stateful servers.** A user's connection lives on one specific server. To send a message to user B, you must find which server holds B's connection (a connection registry, often in a cache) and route to it, or broadcast through a pub/sub channel that every connection server subscribes to.
- **Load balancing** uses layer-4 or connection-aware routing, and scaling down must drain connections gracefully.
- **Heartbeats** detect dead connections; clients reconnect with backoff and ask for missed messages since a sequence number.

**Server-Sent Events** are simpler when only the server pushes (live scores, notification badges): plain HTTP, auto-reconnect built in, works through most proxies.

## Protocol choices inside the system

Between your own services, gRPC with protobuf is the common answer: strongly typed contracts, efficient binary encoding, HTTP/2 multiplexing, built-in streaming and deadlines. Mention **deadlines** (a timeout that propagates along the call chain) and **retries with backoff**; they are how cascading failures are avoided, and the reliability chapter expands on them.

## Common mistakes

- Designing the API after the architecture. Do it before; it exposes the data you actually need.
- Returning lists without pagination.
- POST endpoints that are not idempotent for operations that will be retried.
- Uploading files through application servers.
- Choosing GraphQL or WebSockets because they sound modern rather than because a requirement demands them.
- Forgetting that DNS and CDN caching mean changes take time to propagate.

## What to say in the interview

"The public API is REST over HTTPS; here are the three main endpoints. Lists are cursor-paginated. Writes that may be retried take an idempotency key. Uploads go straight to object storage via pre-signed URLs. Internally the services talk gRPC with deadlines. Real-time updates use WebSockets through a dedicated connection tier." That paragraph, adapted to the question, covers everything an interviewer expects at this layer.
