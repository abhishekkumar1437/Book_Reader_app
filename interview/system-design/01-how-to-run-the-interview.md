---
title: How to Run the Design Interview
part: Getting Started
summary: What the interviewer is grading, a five-phase framework with a minute-by-minute budget, and the habits that separate a strong round from a rambling one.
---

## What this round actually tests

A system design interview is not a quiz on how Twitter works. It is a 45-minute simulation of a design discussion with a senior colleague. The interviewer wants to know whether you can take a vague product goal, turn it into requirements and numbers, propose a sensible architecture, and then defend and evolve it under questioning.

Four things are being graded, in roughly this order of importance:

| What they watch | What "strong" looks like |
|---|---|
| **Scoping** | You ask what matters, pick a small set of core features, and state what you are leaving out. |
| **Structure** | You drive the conversation through a clear sequence instead of waiting to be led. |
| **Trade-offs** | Every choice comes with a reason and an alternative: "I'd use a queue here because..., the cost is...". |
| **Depth on demand** | When the interviewer pokes at one box, you can open it up: data model, failure modes, scaling limits. |

The most common failure is not lack of knowledge. It is spending fifteen minutes on a beautiful diagram of the wrong system, or drawing twelve boxes without being able to explain why any of them exists.

## The five phases

Use the same sequence every time, and say the phase names out loud as you move between them. The interviewer relaxes when they can see the plan.

```
 0        5            10                 25                    40      45
 |--------|------------|------------------|---------------------|-------|
  Clarify   Estimate     High-level design    Deep dives            Wrap up
  & scope   & APIs       (boxes and arrows)   (2-3 components)      & risks
```

### Phase 1: Clarify and scope (about 5 minutes)

Ask questions until you can write down a short list of functional requirements and a short list of non-functional ones. Do not draw anything yet.

**Functional:** what does the system do? Pick the three to five features that define the product and say which you are deliberately skipping.

> "For a URL shortener the core is: create a short link, redirect on visit, and basic analytics. I'll skip custom aliases and expiry unless you want them."

**Non-functional:** how well must it do it? These decide the architecture far more than the feature list.

- Scale: users, requests per second, data size. (Ask; do not guess silently.)
- Latency: what is acceptable for the main operation? Read-heavy or write-heavy?
- Availability versus consistency: is it acceptable to show slightly stale data? Is any operation "must not be lost"?
- Durability, security, compliance if relevant.

Write the requirements in a corner of the board. You will point at them repeatedly to justify decisions.

### Phase 2: Estimate and define APIs (about 5 minutes)

Do a quick back-of-the-envelope calculation (next chapter) for QPS, storage, and bandwidth. The purpose is not precision. It is to discover whether you need one database or a hundred, whether everything fits in a cache, and whether the write path is the hard part.

Then define the two or three main API calls with their inputs and outputs. This forces you to be concrete about the data.

```
POST /v1/urls        { long_url }              -> { short_url }
GET  /{short_code}                              -> 302 redirect
```

### Phase 3: High-level design (about 15 minutes)

Draw the simplest architecture that satisfies the requirements: clients, an API layer, a data store, and whatever the numbers demand (a cache, a queue, a CDN). Walk through the main read path and the main write path end to end, naming each hop.

Resist adding components you cannot justify from the requirements. Every box you draw is a box the interviewer can ask about.

### Phase 4: Deep dives (about 15 minutes)

The interviewer will pick a part of the design and push: "what happens when this database fills up?", "how do you keep the cache consistent?", "what if two users do this at the same time?". If they do not pick, you should: "The hardest part of this system is X, let me go deeper there."

Typical deep dives: data model and indexing, how a component scales horizontally, what fails and how the system behaves when it does, consistency between two stores, hot spots and how to spread them.

### Phase 5: Wrap up (about 5 minutes)

Summarise the design in a few sentences, list the known weak points, and say what you would do next with more time: monitoring, a second region, an abuse mitigation, a migration plan. Ending with your own critique is a strong signal.

> **Interview tip:** Keep a visible time budget. If you are still in phase 3 at minute 30, say "let me stop here and go deep on the storage layer" rather than finishing every arrow. Depth beats completeness.

## Habits that make the round go well

**Talk before you draw.** State what you are about to add and why. "The read traffic is a hundred times the write traffic and the data is small, so I'll put a cache in front of the database." Then draw the cache.

**Anchor decisions to requirements.** Point at the requirement each time: "because we said 99.99% availability, a single database is not acceptable, so...".

**Name the alternative.** For each significant choice, mention what you did not pick and why. It shows the decision was a decision.

**Prefer boring technology.** A relational database, a well-known cache, a standard queue. Exotic choices invite questions you may not be able to answer. Mention a specific product only if you can explain how it works inside.

**Be honest about uncertainty.** "I'm not sure of the exact consistency guarantees of that product; what I need from it is X, and if it cannot do that I'd use Y instead." That is a better answer than confident wrongness.

**Drive.** Silence and waiting for prompts is a weak signal. If you finish a phase, announce the next.

## What to draw and how

Whiteboard or virtual, the diagram should be readable from across the room. A few conventions:

```
+---------+      +-------------+      +-----------+
| Clients | ---> | Load        | ---> | API       |
| (web,   |      | balancer    |      | servers   |
|  mobile)|      +-------------+      +-----+-----+
+---------+                                 |
                                 +----------+----------+
                                 |                     |
                            +----+----+          +-----+-----+
                            |  Cache  |          | Database  |
                            | (Redis) |          | (primary  |
                            +---------+          |  + reads) |
                                                 +-----------+
```

- Boxes are components; arrows are requests and point in the direction of the call.
- Label arrows with the important detail: "read", "write", "async", "fan-out".
- Group by tier: clients on the left, edge and API in the middle, storage and async processing on the right.
- Number the steps of the main flow so you can narrate it: "1, the client posts; 2, the API validates; 3, ...".

Do not draw the load balancer, DNS, and CDN unless they matter to the question. Everyone knows they exist.

## The phrases interviewers listen for

Hearing these tells the interviewer you have done this before:

- "Let me confirm the scope before designing."
- "Read-to-write ratio is roughly..., so the read path is what we optimise."
- "This is the single point of failure; here is how I remove it."
- "This decision trades consistency for availability; for this product that is acceptable because..."
- "The hot spot here is..., and the mitigation is..."
- "If I had more time, I would..."

## How this book is organised

The next chapter gives you the numbers and the estimation method. The Building Blocks chapters cover the components you compose, each with the trade-offs an interviewer will probe. The Case Studies apply the framework end to end to the classic questions, in the order they are usually asked. Read the building blocks first; the case studies assume them.
