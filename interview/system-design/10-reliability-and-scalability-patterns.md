---
title: Reliability & Scalability Patterns
part: Building Blocks
summary: Stateless services and autoscaling, timeouts, retries and circuit breakers, bulkheads and load shedding, graceful degradation, multi-region, and the observability every design must mention.
---

## The mindset

Any component can fail at any time. A reliable system is not one where nothing fails; it is one where failures are contained, detected, and recovered from without users noticing more than a brief blip. Interviewers probe this with "what happens when X goes down". This chapter is the list of answers.

## Scaling the stateless tier

Application servers should hold no per-user state between requests. Sessions, carts, and progress live in a shared store. Then:

- Any server can handle any request, so a load balancer can spread traffic freely.
- Servers can be added and removed at will: **horizontal autoscaling** on CPU, request rate, or queue depth.
- A crashed server loses nothing.

Vertical scaling (a bigger machine) is fine as a first step and has a ceiling; say you would use it until it runs out, then go horizontal. Stateful components (databases, caches, connection servers) are where scaling gets hard and where the interesting design work is.

## Redundancy and single points of failure

Walk your diagram and ask "what if this one dies" for every box. The answer must be "there is another one" or "the system degrades acceptably". Standard replacements:

| Single point | Replacement |
|---|---|
| One load balancer | Active-passive pair or managed balancer |
| One database primary | Replica with automatic failover |
| One cache node | Replicated cache, or accept a miss storm and protect the database with single-flight |
| One queue broker | Replicated brokers with acknowledged writes |
| One data centre | A second region (below) |
| One region's DNS | Global DNS with health-based routing |

## Timeouts, retries, and backoff

Every call to another service must have a **timeout**. Without one, a slow dependency exhausts your threads or connections and the failure spreads upward. The timeout should be shorter than what the caller's caller is willing to wait, so budgets shrink down the call chain (deadline propagation).

**Retries** recover from transient errors, but naive retries turn a small outage into a large one: a struggling service receives three times its normal load from retries and never recovers (a **retry storm**). Rules:

- Retry only on errors that are likely transient (timeouts, 503), not on 4xx.
- Use **exponential backoff with jitter**: wait 100 ms, 200, 400, ... plus a random offset so clients do not retry in lockstep.
- Cap the number of attempts and the total time.
- Retry only idempotent operations, or use idempotency keys.
- Limit retries to a fraction of normal traffic (a **retry budget**), so retries cannot exceed, say, 10% of requests.

## Circuit breakers

When a dependency is failing, keep calling it and you waste resources and add latency to every request. A **circuit breaker** watches the error rate; past a threshold it "opens" and fails fast without calling, then after a cooling period it lets a few trial requests through ("half-open") and closes again if they succeed.

```
closed ──(errors > threshold)──> open ──(after timeout)──> half-open ──(trial ok)──> closed
                                                              └──(trial fails)──> open
```

Pair it with a **fallback**: a cached value, a default, a reduced feature. "If the recommendation service is down, the breaker opens and we show the popular-items list from cache."

## Bulkheads and isolation

A ship has watertight compartments so one breach does not sink it. In software: separate thread pools, connection pools, or even server pools per dependency or per customer tier, so one slow dependency cannot starve everything else. Multi-tenant systems isolate large tenants so one customer's spike does not degrade the rest.

## Rate limiting and load shedding

Protect the system from more work than it can do.

- **Rate limiting** at the edge, per client, keeps any one caller within a fair share (the algorithms are a case study).
- **Load shedding** drops low-priority work when the system is near capacity: return 503 quickly for optional requests, sample analytics events, skip the recommendation call. Doing less work gracefully beats doing all the work slowly and then falling over.
- **Admission control** caps in-flight requests; excess wait in a bounded queue or are rejected immediately with a `Retry-After`.

## Graceful degradation

Design the failure modes of the product, not just the system. If the search index is down, can the site still show the home page? If the feed cache is empty, can you show a chronological fallback? If the payment provider is slow, can the order be accepted as "pending" and charged later? Each of these is a sentence in the interview that shows product-level thinking.

## Health, deployment, and rollback

- Health endpoints for balancers; readiness (can take traffic) separate from liveness (process is alive).
- **Rolling deployments** replace servers a few at a time behind the balancer; **canary** releases send a small percentage of traffic to the new version and watch error rates before proceeding.
- Every deployment has a fast rollback; every schema change is backwards compatible with the previous code version (expand, migrate, contract).
- **Feature flags** decouple release from deploy and give an instant kill switch.

## Multi-region

One region is one failure domain (power, network, a bad deploy of a regional dependency). For high availability or for global latency, run in several regions.

**Active-passive.** One region serves; the other has replicated data and warm infrastructure. Failover takes minutes and loses in-flight replication lag. Simpler; the common first step.

**Active-active.** All regions serve. Reads are local. Writes are the hard part: either route each user's writes to a home region (simple, one round trip for cross-region users), or accept multi-primary replication with conflict resolution (complex). Data that must be globally unique or strongly consistent typically has one home.

Say what is replicated (database, object storage, cache warm-up), how users are routed (geo-DNS, anycast), what the recovery time and data loss objectives are (RTO and RPO), and that failover is tested regularly, not just designed.

## Observability

A design without monitoring is a design you will not be able to operate. Always draw or mention:

- **Metrics**: request rate, error rate, latency percentiles (p50, p95, p99) per endpoint and per dependency; queue depths and consumer lag; cache hit rate; database connections and replication lag. Alerts on the ones that predict user impact.
- **Logs**: structured, with a **request id** that is generated at the edge and passed through every service so one request can be followed end to end.
- **Traces**: distributed tracing shows which hop in a slow request took the time.
- **Dashboards and runbooks** for the on-call engineer.

Percentiles, not averages. A p99 of two seconds with a 50 ms average means one in a hundred users has a bad time, and at scale that is a lot of users.

## Security in one paragraph

Encrypt in transit (TLS everywhere, including inside the data centre) and at rest. Authenticate at the edge, authorise in each service. Keep secrets in a secrets manager, not configuration files. Validate all input, limit request sizes, and rate limit authentication endpoints. Audit sensitive actions. Least privilege for every service account. This paragraph, said once, covers what most design interviews expect on security.

## Capacity planning and cost

Mention that the design is sized for peak plus headroom (say 2×), that the stateless tier scales automatically while the stateful tier is provisioned ahead of demand, and which component dominates cost (usually storage egress for media, database instances for transactional systems). Interviewers at senior levels appreciate a sentence on cost.

## Common mistakes

- Calls with no timeouts.
- Retries without backoff, jitter, or a budget.
- No circuit breaker or fallback for a non-critical dependency.
- A diagram with a single database, cache, or broker and no answer for its failure.
- No metrics or request ids.
- Claiming multi-region active-active without addressing write conflicts.

## What to say in the interview

"The API tier is stateless and autoscaled. Every dependency call has a deadline; retries use exponential backoff with jitter and are limited to idempotent calls with a retry budget. Non-critical dependencies sit behind circuit breakers with cached fallbacks, so a recommendation outage degrades the page rather than failing it. The primary database fails over automatically to a synchronous replica. We run active-passive in a second region with a tested failover and an RPO of under a minute. Everything emits metrics with percentiles, structured logs with a request id, and traces."
