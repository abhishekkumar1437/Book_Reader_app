---
title: Study Plan & Mock Interviews
part: Wrap-up
summary: A three-week schedule through this book, how to practise design problems alone and with a partner, a list of extra questions with the chapters that answer them, and the last-day routine.
---

## The plan in one paragraph

Three weeks, about an hour a day. Week one is the framework and the building blocks: read a chapter, then explain it aloud from memory. Week two is the case studies: read one, then redo it on a blank page under a timer before reading the next. Week three is practice: new questions from the list below, mocks, and revisiting weak areas. If you have more time, repeat week three; the returns from mocks do not diminish quickly.

## Week 1: Framework and building blocks

| Day | Read | Do |
|---|---|---|
| 1 | How to Run the Design Interview; Estimation | Estimate three systems you use daily (a messaging app, a photo app, a ride app): QPS, storage, bandwidth, in under three minutes each |
| 2 | Networking & API Design; Load Balancers, Proxies & CDNs | Write the API and draw the front door for an e-commerce site from memory |
| 3 | Databases & Data Modelling | For the same site, model orders, products, and users; choose stores and justify; list the indexes |
| 4 | Sharding & Consistent Hashing; Caching | Explain the consistent hash ring aloud with a drawing; describe cache-aside with invalidation and a stampede fix |
| 5 | Message Queues & Stream Processing | Draw the outbox pattern and a fan-out pipeline; state the delivery guarantee and why consumers are idempotent |
| 6 | Consistency & Distributed Fundamentals; Reliability Patterns | Explain quorums, sagas, and circuit breakers to an imaginary junior engineer, in plain words |
| 7 | Object Storage, Search & Unique IDs | Draw the upload flow and the Snowflake layout from memory; then rest |

## Week 2: Case studies

For each: read the chapter once. The next day, before reading the next chapter, redo the same question on a blank page in 40 minutes with a timer, phases in order, speaking aloud. Then compare with the chapter and write down what you missed.

| Day | Read | Redo from the previous day |
|---|---|---|
| 8 | URL Shortener | |
| 9 | Rate Limiter | URL Shortener |
| 10 | News Feed | Rate Limiter |
| 11 | Chat & Notifications | News Feed |
| 12 | Video Streaming | Chat |
| 13 | Proximity & Typeahead | Video Streaming |
| 14 | Key-Value Store; Cheat Sheet | Proximity |

## Week 3: Practice

| Day | Do |
|---|---|
| 15 | Two new questions from the list below, 40 minutes each, aloud, recorded |
| 16 | Listen to the recordings; note every phase you skipped and every claim you made without a reason |
| 17 | Mock with a partner (or one question aloud with the cheat sheet closed) |
| 18 | Re-read the two building-block chapters you were weakest on; redo one case study |
| 19 | Two new questions |
| 20 | Mock with a partner |
| 21 | Cheat sheet, checklist, rest |

## More questions, and where the answers are

Every one of these is a recombination of the chapters. Before starting, write which chapters you will draw on.

| Question | Chapters to draw on |
|---|---|
| Design a distributed cache | Caching; Sharding & Consistent Hashing; Key-Value Store |
| Design a web crawler | Queues (frontier), Storage (pages), Reliability (politeness, retries), Distributed Fundamentals (dedupe) |
| Design a payment system | Distributed Fundamentals (idempotency, sagas), Databases (transactions), Reliability, Queues (outbox) |
| Design a ticket booking system | Databases (transactions, optimistic locking), Caching (seat maps), Rate Limiter (queueing under load) |
| Design an online collaborative editor | Networking (WebSockets), Chat (connection tier), Distributed Fundamentals (ordering, conflict resolution) |
| Design a metrics and monitoring system | Queues & Streams, Storage (time series), Reliability (observability) |
| Design a distributed job scheduler | Distributed Fundamentals (leader election, locks), Queues, Reliability |
| Design an e-commerce search | Storage & Search, Caching, Typeahead |
| Design a leaderboard | Caching (sorted sets), Sharding, Estimation |
| Design a file sync service (Dropbox) | Object Storage (chunks, dedupe), Databases (metadata), Notifications, Networking |
| Design a recommendation pipeline | Queues & Streams, Storage, Caching (serving precomputed results) |
| Design an ad click aggregator | Queues & Streams (exactly-once inside the processor, windows), Storage |
| Design a hotel or Airbnb reservation | Databases (transactions, ranges), Caching, Proximity (search by location) |
| Design Google Docs comments / a notification system | Chat & Notifications |
| Design a distributed unique-id service | Storage & IDs, Distributed Fundamentals |
| Design a stock exchange order book | Databases (single-writer, in-memory), Distributed Fundamentals (ordering, durability), Reliability |

## How to practise alone

1. **Timer on, phases visible.** Write the five phase names down the side of the page with their minute budgets before you start. Move on when the budget is up, even if incomplete.
2. **Speak.** Record on your phone. The interview is a conversation; silent diagramming trains the wrong skill.
3. **Write the numbers.** Every design starts with the estimate on the page.
4. **Ask yourself the probes** from the cheat sheet at the end: "what if this dies", "what is hot", "how does this scale 10×". Answer each in one sentence.
5. **Compare against the checklist**, not against a perfect answer. Note the items you skipped. Those are your study list.

## How to practise with a partner

Alternate roles. As the interviewer: state a vague prompt ("design a photo sharing app"), answer scoping questions, then pick one component and push on it for ten minutes with "what if" questions. Do not help. As the candidate: run the framework. Afterwards, the interviewer gives three specific notes: one thing done well, one phase that was weak, one claim made without a reason.

Interviewing is as instructive as being interviewed; you will hear the difference between reasoned and recited answers immediately.

## The mistakes log

Keep it, as with coding practice. One line per session. Examples:

```
2026-09-24  Drew the whole diagram before estimating. Shard decision was wrong because of it.
2026-09-25  Said "use Kafka" with no reason. Should have said: many consumers + replay needed.
2026-09-26  Never mentioned what happens when Redis dies. Add the SPOF walk every time.
2026-09-27  Ran out of time in high-level design; no deep dive. Cut the diagram at minute 25.
```

After ten sessions the same three items will dominate. Fix those three and your rounds change.

## The last day

- Re-read the Cheat Sheet and your mistakes log.
- Redraw from memory, ten minutes each: the front door (CDN, balancer, gateway), the feed fan-out pipeline, the chat connection tier, the upload-and-transcode pipeline, the key-value store's ring and quorum. These five diagrams cover most of what any question needs.
- Say the five phases and their minute budgets aloud once.
- Prepare two questions about how the team designs and operates systems; they make a better ending than "no questions".
- Sleep. Design interviews reward calm more than knowledge.

## After the interview

Write down the question and every probe you were asked, immediately. Redo the design the next day with the book open and note what you would change. Add one line to the mistakes log. Questions and probes repeat across companies far more than you would expect.

That is the end of this book. The building blocks are few; the practice is what makes them yours.
