---
title: Case Study — Rate Limiter
part: Case Studies
summary: Token bucket, leaky bucket, fixed and sliding windows compared, where the limiter sits, making it work across many servers with Redis, and what to do when the limiter itself fails.
---

## Why this question

A rate limiter is a small system with a precise specification, so it tests whether you can compare algorithms on their actual behaviour and then make a single-machine idea work across a fleet. It also appears inside almost every other design as a component, so knowing it well pays twice.

## Phase 1: Requirements

**Functional**

- Limit the number of requests a client (user, API key, or IP) can make in a time window, for example 100 requests per minute.
- Rules configurable per endpoint and per client tier.
- Return 429 with headers saying when to retry.

**Non-functional**

- Very low latency: the check happens on every request, so it must add a millisecond or less.
- Accurate enough: a small overshoot under contention is acceptable; a large one is not.
- Highly available and fault tolerant: if the limiter has a problem, the API should still work (fail open) unless the product demands strictness (fail closed).
- Works across many API servers: the limit is per client, not per server.

## Phase 2: Where it lives

```
client ──> API gateway / load balancer ──[ rate limiter middleware ]──> API servers
                                              │
                                        Redis (counters)
```

Options: in the client (unreliable; clients can be modified), in each API server (only works if the state is shared), or in the gateway as middleware backed by a shared store. The gateway is the standard answer: one place to enforce, before the request costs any backend work.

## The algorithms

Compare them on three things: memory per client, accuracy at window boundaries, and whether they allow bursts.

### Token bucket

A bucket holds up to `capacity` tokens and refills at `rate` tokens per second. Each request takes one token; if the bucket is empty, the request is rejected. Bursts up to `capacity` are allowed, then the steady rate applies.

```python
import time

class TokenBucket:
    def __init__(self, capacity: int, refill_per_sec: float):
        self.capacity = capacity
        self.refill = refill_per_sec
        self.tokens = float(capacity)
        self.last = time.monotonic()

    def allow(self) -> bool:
        now = time.monotonic()
        self.tokens = min(self.capacity, self.tokens + (now - self.last) * self.refill)
        self.last = now
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
```

Memory: two numbers per client. Behaviour: smooth average rate with controlled bursts. This is what most APIs use (and what cloud providers describe in their docs).

### Leaky bucket

Requests enter a queue of fixed size and leave at a constant rate. Output is perfectly smooth; excess requests are dropped when the queue is full. Good for shaping traffic to a downstream that needs a steady rate (a payment processor). Less suitable for user-facing APIs because bursts are queued and delayed rather than served.

### Fixed window counter

Count requests per client per window (`user:123:minute:2026-09-24T10:31`). Increment; reject when the count exceeds the limit. One integer per client per window, trivially implemented as `INCR` with an expiry.

The flaw: a client can send the full limit at the end of one window and again at the start of the next, so twice the limit passes within a few seconds across the boundary.

### Sliding window log

Keep the timestamps of each request in the window (a sorted set). On each request, drop timestamps older than the window, count the rest, allow if below the limit. Exact, but memory is proportional to the limit per client, which is expensive at 1,000 requests per minute across millions of clients.

### Sliding window counter

The practical compromise. Keep counts for the current and previous fixed windows, and estimate the count in the sliding window by weighting the previous window by how much of it still overlaps:

```
estimate = current_count + previous_count × (fraction of the previous window inside the sliding window)

limit 100/min, now is 15 s into the current minute:
previous minute had 80, current has 30
estimate = 30 + 80 × (45/60) = 30 + 60 = 90  → allowed
```

Two integers per client, no boundary burst problem, and an error that is small in practice. This or the token bucket is what to recommend.

| Algorithm | Memory per client | Bursts | Boundary problem | Verdict |
|---|---|---|---|---|
| Token bucket | 2 numbers | Allowed up to capacity | No | Default for APIs |
| Leaky bucket | Queue | Smoothed, delayed | No | Traffic shaping |
| Fixed window | 1 counter | Up to 2× at boundary | Yes | Simple but leaky |
| Sliding log | One entry per request | No | No | Exact, expensive |
| Sliding counter | 2 counters | Slight overshoot | No | Best general choice |

## Deep dive 1: Making it distributed

The gateway has many instances. If each keeps its own counters, a client gets N times the limit. The state must be shared, and the natural store is **Redis**: in-memory, single-digit-millisecond operations, atomic increments, key expiry.

**Race condition.** Two gateway instances read the count (99), both see it below 100, both increment, and 101 requests pass. Fix by making the check-and-increment atomic:

- For a fixed or sliding window counter: `INCR` returns the new value atomically; check it after incrementing. If it exceeds the limit, reject (and optionally decrement, or just let the window expire).
- For a token bucket or anything with two steps: run the logic as a **Lua script** in Redis, which executes atomically on the server. This is the standard production answer.

```lua
-- KEYS[1] = bucket key, ARGV = capacity, refill_per_ms, now_ms
local tokens = tonumber(redis.call('HGET', KEYS[1], 'tokens') or ARGV[1])
local last   = tonumber(redis.call('HGET', KEYS[1], 'last') or ARGV[3])
tokens = math.min(tonumber(ARGV[1]), tokens + (ARGV[3] - last) * ARGV[2])
local allowed = 0
if tokens >= 1 then tokens = tokens - 1; allowed = 1 end
redis.call('HSET', KEYS[1], 'tokens', tokens, 'last', ARGV[3])
redis.call('PEXPIRE', KEYS[1], 60000)
return allowed
```

**Scaling Redis.** Partition clients across Redis nodes by consistent hashing on the client id; each client's counters live on one node, so atomicity is preserved. A single node handles roughly 100,000 operations per second, so ten nodes cover a million requests per second of checks.

**Latency.** One Redis round trip per request (under a millisecond inside the data centre). To avoid it entirely on the hot path, gateways can keep a local approximation and sync in batches, accepting slight over-admission; mention as an optimisation, not the default.

## Deep dive 2: Rules and configuration

Rules live in a configuration store (a database or a config service) and are cached in memory in each gateway, refreshed every few seconds or on a change notification. A rule is `(scope, key, limit, window, algorithm)`: for example `("endpoint", "POST /v1/urls", 10, "1m")` or `("tier", "free", 1000, "1h")`. A request may match several rules (per user and per endpoint); all must pass.

## Deep dive 3: Response and headers

On rejection return `429 Too Many Requests` with:

```
Retry-After: 12
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1727172720
```

Well-behaved clients back off using these. Some products prefer to **queue** or **throttle** (slow down) rather than reject; say which fits the product.

## Deep dive 4: Failure modes

- **Redis unavailable.** Decide fail-open (allow all; the API is protected only by its own capacity) or fail-closed (reject all). Most user-facing APIs fail open with an alert, because an outage of a protective component should not become an outage of the product. A limiter guarding a costly or abusable operation (password attempts, SMS sending) fails closed.
- **Clock differences** between gateway instances shift windows slightly. Use Redis's time (`TIME` command inside the script) as the single clock.
- **Hot client.** One client hammering the limiter concentrates load on one Redis node's key. That is the limiter doing its job; the key's operations are O(1), and a single hot key handles tens of thousands of operations per second.
- **Gateway restarts** lose the local rule cache until it reloads; keep a default rule.

## Deep dive 5: Beyond per-client limits

- **Global limits** protect a downstream dependency: total calls per second to the payment provider, regardless of client. Same mechanism, one shared key.
- **Concurrency limits** cap in-flight requests rather than rate; implemented with a counter incremented on entry and decremented on completion.
- **Adaptive limits** lower the allowance when backend latency or error rate rises; this is load shedding wearing a rate limiter's clothes.

## Phase 5: Wrap up

Recommend the sliding window counter (or token bucket if burst allowance is a product feature) implemented as an atomic Redis script, partitioned by client id, configured by rules cached in the gateway, failing open with alerting. Weak points: one Redis round trip per request; approximate counts under contention; the configuration service is a dependency.

## Follow-up questions to expect

- "Why not a fixed window?" The boundary burst allows twice the limit.
- "How do you avoid the race between two gateways?" Atomic increment or a Lua script.
- "What if Redis dies?" Fail open or closed; explain the choice.
- "How would you limit by IP behind a NAT where many users share an address?" Use authenticated identity where possible; make IP limits generous and use them only against clear abuse.
- "Can you do this without a central store?" Approximately: each gateway gets `limit / N` locally, or gateways gossip counts. Less accurate; mention the trade-off.

## The two-minute version

"The limiter runs as middleware in the API gateway. Counters live in Redis, partitioned by client id, updated with an atomic script implementing a sliding window counter: two integers per client, no boundary burst, sub-millisecond check. Rules are cached in the gateway from a config store. Rejections return 429 with Retry-After. If Redis is unreachable the limiter fails open and alerts, because protecting the API should not take the API down."
