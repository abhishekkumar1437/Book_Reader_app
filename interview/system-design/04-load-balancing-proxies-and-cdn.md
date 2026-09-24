---
title: Load Balancers, Proxies & CDNs
part: Building Blocks
summary: How traffic is spread, where TLS ends, layer 4 versus layer 7, health checks and sticky sessions, and what a CDN can and cannot cache.
---

## Why these exist

A single server is a single point of failure and a hard capacity ceiling. Horizontal scaling means running many identical, stateless servers and spreading traffic across them. The load balancer is the component that does the spreading, hides individual server failures, and gives clients one address to talk to.

Proxies and CDNs sit on the same path and take work away from your servers: TLS termination, compression, caching of static and semi-static content, and absorbing abusive traffic before it reaches you.

## Load balancing

```
                       +----------------+
   clients ─────────>  | Load balancer  | ──┬──> API server 1
                       | (VIP)          |   ├──> API server 2
                       +----------------+   └──> API server 3
                              │
                       health checks every few seconds
```

### Layer 4 versus layer 7

| | Layer 4 (transport) | Layer 7 (application) |
|---|---|---|
| Sees | IP addresses and ports | HTTP: URL, headers, cookies |
| Routing | By connection | By request content: path-based routing, header rules |
| TLS | Passed through | Usually terminated here |
| Cost | Very fast, simple | More CPU per request, more features |
| Use | Databases, WebSockets, raw TCP, front of an L7 tier | Web and API traffic |

The standard answer: an L7 balancer in front of the API tier, because you want path routing (`/api/v1/photos` to the photo service), TLS termination, and per-request metrics. Use L4 for long-lived connections and non-HTTP protocols.

### Algorithms

- **Round robin**: each server in turn. Fine when servers and requests are uniform.
- **Weighted round robin**: bigger servers get more.
- **Least connections**: send to the server with the fewest open connections. Better when request durations vary.
- **Least response time**: adaptive; uses recent latency.
- **Hashing** (by client IP or a header): the same client always reaches the same server. Gives stickiness without server-side session state, at the cost of uneven load and reshuffling when servers change. Consistent hashing (sharding chapter) reduces the reshuffling.

In an interview, "least connections for the API tier, consistent hashing when a request must reach a particular server" is enough. Do not spend minutes on algorithms.

### Health checks and failure

The balancer probes each server (an HTTP `GET /health` or a TCP connect) every few seconds and stops sending traffic to servers that fail. Two details that show maturity:

- **Shallow versus deep checks.** A deep check that queries the database can mark every server unhealthy at once when the database blips, taking the whole site down. Keep the check about the server itself, and let the application handle dependency failures.
- **Graceful drain.** When a server is removed for deployment, stop sending new requests but let in-flight ones finish.

### Removing the balancer as a single point of failure

Run two balancers in an active-passive pair sharing a virtual IP, or use DNS to spread across several active balancers, or use the cloud provider's managed balancer, which is already redundant. Say one of these when asked "what if the load balancer dies?".

### Sticky sessions

If a server keeps per-user state in memory (a shopping cart, a WebSocket connection), every request from that user must hit the same server. Balancers support this via cookies or hashing. The better answer, whenever possible, is to make the servers stateless: put the session in a shared store (Redis) and let any server handle any request. Stickiness is a compromise, not a design goal. WebSockets are the case where it is unavoidable.

## Reverse proxies and API gateways

A **reverse proxy** sits in front of servers and handles cross-cutting work: TLS, compression, request buffering, static files, basic caching, and protection against slow clients. Nginx, HAProxy, Envoy are the familiar names.

An **API gateway** is a reverse proxy with API-specific features: authentication, rate limiting, request validation, routing to many backend services, response aggregation, and metrics. In a microservice design it is the one public entry point, so internal services can stay private.

```
clients ──> API gateway ──┬──> user service
                          ├──> photo service
                          └──> feed service
    (auth, rate limits, routing, TLS)
```

A **forward proxy** is the mirror image: it sits in front of *clients* (corporate egress, anonymity, caching outbound). Rarely relevant in design interviews; know the distinction if asked.

## Content delivery networks

A CDN is a globally distributed set of caching servers. Clients are routed (by DNS) to the nearest one. If the CDN has the content, it serves it from the edge with a short round trip; otherwise it fetches from your **origin** and caches the result.

```
user (Mumbai) ──> CDN edge (Mumbai) ──miss──> origin (Virginia)
                        └── hit: served in ~20 ms instead of ~250 ms
```

**What belongs on a CDN:** images, video segments, JavaScript and CSS bundles, fonts, downloadable files, and any API response that is the same for everyone for at least a few seconds (a public leaderboard, a product page). Static assets get a content-hashed file name and a very long cache time; when the content changes, the name changes.

**What does not:** per-user responses, anything that must be fresh to the second, and writes. Personalised content is served from the origin, ideally with the CDN still terminating TLS and absorbing connections.

**Push versus pull.** Pull CDNs fetch from the origin on the first miss (simple, self-managing; first request in each region is slow). Push CDNs have you upload content ahead of time (good for large files with predictable demand, like a video release).

**Invalidation.** The hard part. Options: short TTLs (simple, more origin load), versioned URLs (best for assets), explicit purge API calls (works, but propagation takes seconds to minutes). For the interview, prefer versioned URLs and say why invalidation is avoided rather than solved.

**Cost.** CDNs bill by egress. For video-scale bandwidth the CDN bill is the dominant cost, which is why video systems use adaptive bitrate and aggressive caching.

## Putting it together: a standard front door

```
                                  +-----------+
        DNS (geo)  ──>  CDN edge  |  static   |  cache hit → done
                           │      +-----------+
                           │ miss / dynamic
                           ▼
                    +-------------+        +-------------+
                    | L7 balancer | ─────> | API gateway | ──> services
                    | TLS ends    |        | auth, rate  |
                    +-------------+        | limits      |
                                           +-------------+
```

Draw this once, early, and then stop talking about it unless the question is about global latency or static delivery. The interviewer wants the interesting parts behind the gateway.

## Common mistakes

- Making the load balancer do deep health checks that fail together.
- Relying on sticky sessions instead of removing server-side state.
- Putting user-specific responses on the CDN, or forgetting that the CDN caches error responses too unless told not to.
- Ignoring that DNS changes propagate slowly, so DNS is not a fast failover tool.
- Saying "add a load balancer" as the answer to a database bottleneck. Balancers spread stateless work; they do not fix a single primary database.

## What to say in the interview

"Traffic enters through a geo-routed CDN for static assets, then an L7 load balancer that terminates TLS and spreads requests over a stateless, autoscaled API tier using least-connections. The balancer is redundant. Health checks are shallow so a database incident does not remove every server at once. Behind it an API gateway does authentication and rate limiting and routes to services." Then move on to the data.
