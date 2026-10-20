---
title: Case Study — Recommendation System
part: Case Studies
summary: Design the "Recommended for you" feed of a large e-commerce app — candidate generation, ranking, re-ranking, feature store, cold start, feedback loops and A/B testing — at 17,000 requests per second within 200 ms.
---

"Design a recommendation system" is the classic **ML system design** question. There is no chatbot here. The core is a set of trained models that pick, out of 50 million products, the 20 this user is most likely to want, in under 200 milliseconds. LLMs can help around the edges, but the interviewer wants to hear about the **multi-stage funnel**, features, labels, training and online experiments.

> **In simple words:** You cannot score 50 million items for every request. So first quickly fetch about 500 promising candidates, then score those 500 carefully with a ranking model, then adjust the top results for variety and business rules. Learn from what users click and buy, and prove improvements with A/B tests.

Prerequisites: [Evaluation Metrics](/interview/ai-engineer/machine-learning/evaluation-metrics), [Ensembles, Random Forest and Boosting](/interview/ai-engineer/machine-learning/ensembles-random-forest-and-boosting), [Embeddings and Semantic Search](/interview/ai-engineer/llms-genai/embeddings-and-semantic-search) and [Vector Databases](/interview/ai-engineer/llms-genai/vector-databases).

## Why interviewers ask this

Recommendations drive a large share of sales on e-commerce, video and music platforms, so many companies have this problem. The question tests whether you can frame a business goal as an ML problem (what exactly do we predict?), design for strict latency at high QPS, handle data pipelines and feedback loops, and evaluate with both offline metrics and online experiments.

## Minutes 0–5: Clarifying questions

**You:** Which surface are we designing? Home page feed, "similar items" on a product page, or emails?
**Interviewer:** The "Recommended for you" section on the app home page.

**You:** What is the business goal? Clicks, purchases, revenue?
**Interviewer:** Purchases, and long-term customer engagement. Clicks alone have been gamed by clickbait-like listings before.

**You:** Scale?
**Interviewer:** 100 million registered users, 50 million daily active, 50 million products.

**You:** How often is the home feed loaded?
**Interviewer:** About 10 times per active user per day.

**You:** What data do we have?
**Interviewer:** Impressions (what was shown), clicks, add-to-cart, orders, returns, searches, product catalog with text and images, user location.

**You:** Latency?
**Interviewer:** The home page should not wait for recommendations more than 200 ms at p99.

**You:** Any business rules?
**Interviewer:** No out-of-stock items, no items that cannot ship to the user's pincode, some sponsored slots, and new sellers should get some exposure.

**You:** Should recommendations react to what the user did in this session?
**Interviewer:** Yes. If I just looked at running shoes, I expect to see related items soon.

### Requirements on the board

**Functional**

- Return 20 ranked products for a user's home feed.
- Use long-term history and current-session activity.
- Respect stock, deliverability, sponsored slots and seller-fairness rules.
- Handle new users and new products (cold start).

**Non-functional**

- 50M DAU × 10 loads; p99 latency under 200 ms.
- Highly available: if the system fails, show a fallback (popular items in the user's region), never an empty section.
- Session signals reflected within about a minute.

**Quality**

- Online: more orders per session and better long-term retention than the current system, measured by A/B test.
- Guard metrics: return rate, diversity, latency must not get worse.

## Minutes 5–10: Estimates

```text
requests per day   = 50,000,000 users × 10 loads = 500,000,000
average QPS        = 500,000,000 ÷ 86,400 ≈ 5,800
peak QPS (3×)      ≈ 17,000
```

**Scoring work**

```text
candidates per request = 500
scorings per second    = 17,000 × 500 = 8,500,000 at peak
```

8.5 million model scorings per second rules out an LLM call per item (or even per request). This must be fast models: dot products, gradient-boosted trees or small neural networks.

**Memory**

```text
item embeddings   = 50,000,000 items × 128 dims × 4 bytes = 25,600,000,000 bytes ≈ 25.6 GB
user features     = 100,000,000 users × about 1 KB        ≈ 100 GB (online feature store)
```

25.6 GB of item vectors fits in memory on one large machine; we keep several replicas for QPS.

**Logs**

```text
impressions per day = 500,000,000 requests × 20 items = 10,000,000,000 (10 billion)
log size            = 10 billion × about 100 bytes      ≈ 1 TB per day
```

1 TB per day of impression logs is the training data. Keep about 90 days in detail (about 90 TB) in a data lake.

**Latency budget (target 200 ms p99)**

| Step | Time |
|---|---|
| Parse request, load user features | 15 ms |
| Candidate generation (sources in parallel) | 30 ms |
| Fetch features for 500 candidates (batched) | 40 ms |
| Rank 500 candidates | 50 ms |
| Re-rank and business rules | 10 ms |
| Network and serialisation | 25 ms |
| **Total** | **170 ms** (30 ms headroom) |

## Minutes 10–22: High-level architecture

### The funnel

<figure>
<svg viewBox="0 0 440 196" width="440" height="196" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="20" y="10" width="400" height="34" rx="6" />
<text x="220" y="32" text-anchor="middle" fill="currentColor" stroke="none">Catalog: 50,000,000 products</text>
<line x1="220" y1="44" x2="220" y2="54" />
<polygon points="220,56 216,50 224,50" fill="currentColor" />
<rect x="70" y="56" width="300" height="34" rx="6" />
<text x="220" y="78" text-anchor="middle" fill="currentColor" stroke="none">Candidate generation: 500 (cheap, recall)</text>
<line x1="220" y1="90" x2="220" y2="100" />
<polygon points="220,102 216,96 224,96" fill="currentColor" />
<rect x="110" y="102" width="220" height="34" rx="6" stroke="var(--accent)" />
<text x="220" y="124" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Ranking: top 100 (precise)</text>
<line x1="220" y1="136" x2="220" y2="146" />
<polygon points="220,148 216,142 224,142" fill="currentColor" />
<rect x="140" y="148" width="160" height="34" rx="6" />
<text x="220" y="170" text-anchor="middle" fill="currentColor" stroke="none">Re-ranking: 20 shown</text>
</svg>
<figcaption>Each stage sees fewer items and can afford a more expensive model per item. Early stages optimise recall; later stages optimise precision and business goals.</figcaption>
</figure>

Why a funnel? Scoring 50 million items with the best model would take seconds. Candidate generation uses cheap methods that look at many items; ranking uses an expensive model on few items. This is the standard pattern in every large recommender, search engine and ads system.

### The system

<figure>
<svg viewBox="0 0 440 232" width="440" height="232" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="11">
<text x="6" y="12" fill="currentColor" stroke="none" font-weight="bold">Online (under 200 ms)</text>
<rect x="6" y="20" width="56" height="40" rx="6" />
<text x="34" y="44" text-anchor="middle" fill="currentColor" stroke="none">App</text>
<rect x="78" y="20" width="80" height="40" rx="6" />
<text x="118" y="44" text-anchor="middle" fill="currentColor" stroke="none">Rec service</text>
<rect x="174" y="20" width="96" height="40" rx="6" />
<text x="222" y="37" text-anchor="middle" fill="currentColor" stroke="none">Candidate</text>
<text x="222" y="51" text-anchor="middle" fill="currentColor" stroke="none">generation</text>
<rect x="286" y="20" width="66" height="40" rx="6" stroke="var(--accent)" />
<text x="319" y="44" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Ranker</text>
<rect x="366" y="20" width="68" height="40" rx="6" />
<text x="400" y="44" text-anchor="middle" fill="currentColor" stroke="none">Re-rank</text>
<line x1="62" y1="40" x2="76" y2="40" />
<polygon points="77,40 71,36 71,44" fill="currentColor" />
<line x1="158" y1="40" x2="172" y2="40" />
<polygon points="173,40 167,36 167,44" fill="currentColor" />
<line x1="270" y1="40" x2="284" y2="40" />
<polygon points="285,40 279,36 279,44" fill="currentColor" />
<line x1="352" y1="40" x2="364" y2="40" />
<polygon points="365,40 359,36 359,44" fill="currentColor" />
<rect x="174" y="100" width="126" height="34" rx="6" />
<text x="237" y="121" text-anchor="middle" fill="currentColor" stroke="none">Online feature store</text>
<line x1="222" y1="100" x2="222" y2="60" />
<line x1="290" y1="100" x2="305" y2="60" />
<text x="6" y="172" fill="currentColor" stroke="none" font-weight="bold">Offline and near-real-time</text>
<rect x="6" y="180" width="80" height="40" rx="6" />
<text x="46" y="204" text-anchor="middle" fill="currentColor" stroke="none">Event logs</text>
<rect x="102" y="180" width="70" height="40" rx="6" />
<text x="137" y="204" text-anchor="middle" fill="currentColor" stroke="none">Stream</text>
<rect x="188" y="180" width="80" height="40" rx="6" />
<text x="228" y="204" text-anchor="middle" fill="currentColor" stroke="none">Warehouse</text>
<rect x="284" y="180" width="66" height="40" rx="6" />
<text x="317" y="204" text-anchor="middle" fill="currentColor" stroke="none">Training</text>
<rect x="366" y="180" width="68" height="40" rx="6" />
<text x="400" y="197" text-anchor="middle" fill="currentColor" stroke="none">Model</text>
<text x="400" y="211" text-anchor="middle" fill="currentColor" stroke="none">registry</text>
<line x1="34" y1="60" x2="34" y2="178" stroke-dasharray="4 3" />
<polygon points="34,180 30,174 38,174" fill="currentColor" />
<line x1="86" y1="200" x2="100" y2="200" />
<polygon points="101,200 95,196 95,204" fill="currentColor" />
<line x1="172" y1="200" x2="186" y2="200" />
<polygon points="187,200 181,196 181,204" fill="currentColor" />
<line x1="268" y1="200" x2="282" y2="200" />
<polygon points="283,200 277,196 277,204" fill="currentColor" />
<line x1="350" y1="200" x2="364" y2="200" />
<polygon points="365,200 359,196 359,204" fill="currentColor" />
<path d="M137 180 L137 117 L172 117" />
<polygon points="173,117 167,113 167,121" fill="currentColor" />
<path d="M400 180 L400 150 L330 150 L330 62" />
<polygon points="330,61 326,67 334,67" fill="currentColor" />
</svg>
<figcaption>Top: the request path. Bottom: events flow into a stream that updates real-time features within seconds, and into a warehouse for daily training; new models are deployed from the registry to the ranker.</figcaption>
</figure>

### The request path, narrated

1. The app asks the **rec service** for the home feed of user 42, with context (device, time, pincode).
2. The rec service loads user features from the **online feature store**: long-term preferences, recent views in this session, location.
3. **Candidate generation** runs several sources in parallel and merges about 500 unique items:
   - two-tower **embedding retrieval** (ANN search with the user's vector), about 300 items;
   - **co-visitation** ("people who viewed what you viewed also viewed"), about 100;
   - session-based: items related to the last 5 viewed items, about 50;
   - popular and trending in the user's city, about 50.
4. Business filters drop out-of-stock and non-deliverable items early (cheap lookups).
5. The **ranker** fetches item and cross features for the candidates and predicts, for each item, the probability of click and of purchase. It combines them into one score and keeps the top 100.
6. The **re-ranker** applies diversity, removes near-duplicates, inserts sponsored items in their slots, gives a small boost to new sellers, and returns 20.
7. The app shows them. Impressions and later clicks, carts and orders are logged with a **request id** that links them to the exact features and model version used.

If any stage times out, the rec service returns what it has; if the whole service fails, the app shows a cached "popular near you" list. The feed must never be empty.

## Minutes 22–38: Deep dives

### Deep dive 1: Candidate generation with a two-tower model

A **two-tower model** has two small neural networks. The **user tower** turns user features (history, location, age bucket) into a vector. The **item tower** turns item features (category, brand, price, text) into a vector of the same size. The model is trained so that the dot product of a user vector and an item vector is high when the user engaged with the item.

Why two separate towers? Item vectors do not depend on the user, so you compute all 50 million of them offline and store them in an **ANN index**. At request time you compute only one user vector and search for its nearest items. That is how you search 50 million items in a few milliseconds.

Worked example with 3-dimensional vectors (real ones have 64–256 dimensions):

```text
user u = [0.5, 0.2, 0.9]
item A = [0.4, 0.1, 0.8]   u·A = 0.5×0.4 + 0.2×0.1 + 0.9×0.8 = 0.20 + 0.02 + 0.72 = 0.94
item B = [0.9, 0.7, 0.0]   u·B = 0.5×0.9 + 0.2×0.7 + 0.9×0.0 = 0.45 + 0.14 + 0.00 = 0.59
item C = [0.1, 0.9, 0.3]   u·C = 0.5×0.1 + 0.2×0.9 + 0.9×0.3 = 0.05 + 0.18 + 0.27 = 0.50
order: A, B, C
```

**Training data**: pairs of (user, item they engaged with) as positives. Negatives are usually **in-batch negatives**: the other items in the same training batch are treated as things this user did not choose. Popular items appear as negatives more often, so a correction for popularity is common.

**Freshness**: retrain the towers daily or weekly; re-embed new items as they arrive so they can be retrieved within minutes.

| Source | Strength | Weakness |
|---|---|---|
| Two-tower ANN | Personal, finds non-obvious items | Needs training; weak for brand-new users |
| Co-visitation | Simple, strong for "related" items | Popularity bias; nothing for new items |
| Session-based | Reacts to current intent | Narrow; can over-focus on one item |
| Trending / popular by region | Works for everyone, including new users | Not personal |

### Deep dive 2: Ranking

**What exactly do we predict?** This is the ML framing question. Clicks alone reward clickbait, so predict several outcomes with one **multi-task model**: P(click), P(add to cart), P(purchase), maybe P(return). Then combine them with business weights:

```text
score = 1 × P(click) + 10 × P(purchase)

item X: P(click) = 0.10, P(purchase) = 0.01 → 0.10 + 0.10 = 0.20
item Y: P(click) = 0.05, P(purchase) = 0.02 → 0.05 + 0.20 = 0.25
Y ranks above X, even though X gets more clicks.
```

The weights are a product decision, tuned with A/B tests.

**Features**

| Group | Examples |
|---|---|
| User | Past categories, average order value, price sensitivity, city tier, device |
| Item | Category, brand, price, discount, rating, return rate, stock, age of listing |
| User × item (cross) | Has the user viewed this brand? Price relative to the user's usual spend? Similarity of item embedding to user embedding |
| Context | Time of day, day of week, festival season, session length so far |
| Real-time | Items viewed in the last 10 minutes, added to cart but not bought |

**Model choice**

| Model | Pros | Cons |
|---|---|---|
| Gradient-boosted trees (LightGBM/XGBoost) | Strong on tabular features, fast on CPU, easy to debug | Weaker with raw sequences and embeddings |
| Deep neural network (multi-task, with embeddings) | Learns from sequences and IDs, multi-task heads | Needs more data, GPUs for training, harder to debug |
| Start | GBDT first as a strong baseline, then a DNN if A/B tests show gains | |

**Labels**: an impression followed by a click within the session is a positive for P(click); an order within 24 hours is a positive for P(purchase). Define these windows carefully and use the same definitions in training and evaluation.

**Position bias**: items shown at the top get more clicks just because they are at the top. If you train naively, the model learns "items we already ranked high are good". Fixes: include the position as a feature during training and set it to a fixed value when serving, or weight examples to correct for position, and keep a small amount of randomised traffic to measure the bias.

**Serving cost**: suppose a load test shows one 16-core server ranks 500 candidates for 200 requests per second (example figure). Peak needs 17,000 ÷ 200 = 85 servers; with 30% headroom, about 110. At an example $0.80 per server-hour that is 110 × $0.80 × 24 ≈ $2,112 per day for ranking.

### Deep dive 3: Re-ranking and business rules

The ranker scores items one by one. A good page also needs to look right as a whole.

- **Diversity**: do not show 10 phone covers. A simple rule: at most 3 items per category in the top 20; or a greedy algorithm that lowers an item's score if it is very similar to items already chosen (maximal marginal relevance).
- **Deduplication**: the same product from 5 sellers should appear once.
- **Sponsored slots**: fixed positions (for example 3 and 8) filled by the ads system.
- **Fairness and exploration**: a small boost for new sellers and new items so they can collect data.
- **Hard filters**: stock, delivery to pincode, age-restricted items.

Keep rules in configuration, not code, so the business team can change them, and log which rules changed each result.

### Deep dive 4: Features, freshness and training-serving skew

Features come from two pipelines:

- **Batch features** (long-term preferences, item return rates) computed daily in the warehouse and loaded into the online feature store.
- **Streaming features** (items viewed in this session) computed from the event stream in seconds and written to the online store. This is how the feed reacts to "I just looked at running shoes". See [Queues and Streams](/interview/system-design/queues-and-streams).

**Training-serving skew** is the classic bug here: the training pipeline computes "views in last 7 days" one way in SQL and the serving path another way, and accuracy silently drops. Two defences:

1. A **feature store** that defines each feature once for both paths (see [Building Blocks of AI Systems](/interview/ai-engineer/ai-system-design/building-blocks-of-ai-systems)).
2. **Log the features at serving time** together with the request id. Train the next model on these logged features joined with outcomes, so training uses exactly what the model saw. This also gives **point-in-time correctness** for free: no future information leaks into training.

**Retraining cadence**: ranker daily (preferences and stock change quickly, especially around sales); towers weekly; real-time features continuously. Every new model is checked offline, then deployed as a canary and A/B tested before full rollout.

### Deep dive 5: Cold start

**New users** (no history):

- popular and trending items for their city and device;
- quick onboarding choices ("what are you interested in?");
- session-based recommendations from the very first clicks;
- context features (location, the link or ad they came from).

**New items** (no clicks yet):

- **content-based embeddings** from title, description and images, so the item tower can place a new item near similar items on day one;
- an **exploration** budget: show new items to a small share of suitable users to collect data, then let the ranker take over.

This is a good place for an LLM. When a seller uploads a product with a poor title, an LLM can generate clean attributes (category, colour, material, use-case) from the text and images. This is an **offline batch** job, not on the request path:

```text
new items per day = 100,000
tokens per item   = 1,000 in, 200 out on the small model (example $1 / $5 per 1M)
daily cost        = 100,000 × (1,000 × $1 + 200 × $5) ÷ 1,000,000 = 100,000 × $0.002 = $200
```

Compare with putting an LLM on the request path: 17,000 requests per second, each needing hundreds of items scored, would be far too slow and expensive. Interviewers like hearing exactly where LLMs fit and where they do not.

### Deep dive 6: Feedback loops and exploration

Recommendations create their own training data: users can only click what you showed them. Over time the system can narrow into showing the same popular items (a **feedback loop** or **filter bubble**), and new items never get a chance.

- Keep a small share of traffic (for example 1–5%) with **exploration**: some slots filled with items the model is unsure about.
- **Multi-armed bandit** methods choose how much to explore automatically: try options with uncertain value more often, then shift toward the best ones.
- Measure catalog coverage: what share of products got any impressions this week?

### Deep dive 7: Evaluation plan

**Offline**

| Stage | Metric | Meaning |
|---|---|---|
| Candidate generation | Recall@500 | Of items the user later bought, what share were in the 500 candidates? |
| Ranking | AUC, log loss | How well predicted probabilities separate positives from negatives |
| Final list | NDCG@20 | Are the most relevant items near the top? |

**NDCG** (normalised discounted cumulative gain) rewards putting relevant items high. Worked example for a list of 5 items with relevance scores 3 (bought), 2 (added to cart), 0, 1 (clicked), 0:

```text
DCG  = Σ relevance ÷ log₂(position + 1)
     = 3/log₂2 + 2/log₂3 + 0/log₂4 + 1/log₂5 + 0/log₂6
     = 3/1 + 2/1.585 + 0 + 1/2.322 + 0
     = 3 + 1.262 + 0 + 0.431 + 0 = 4.693

ideal order = 3, 2, 1, 0, 0
IDCG = 3/1 + 2/1.585 + 1/2 + 0 + 0 = 3 + 1.262 + 0.5 = 4.762

NDCG = DCG ÷ IDCG = 4.693 ÷ 4.762 ≈ 0.985
```

The list is nearly ideal; it only lost a little by putting the "clicked" item at position 4 instead of 3. (Some teams use 2^relevance − 1 as the gain instead of the raw relevance; the idea is the same.)

**Offline metrics are not enough.** A model can improve NDCG on logged data and still lose online, because logged data only contains items the old model chose to show. So:

**Online**

- **A/B test**: 50/50 or 90/10 split by user id for 1–2 weeks. Primary metric: orders per user (or GMV, gross merchandise value, per user). Secondary: CTR, add-to-cart rate. Guard metrics: return rate, p99 latency, diversity, complaints.
- Compute the needed sample size before starting, so you can detect the effect size you care about (see [Distributions and Statistics](/interview/ai-engineer/math-for-ml/distributions-and-statistics) for A/B test basics).
- **Long-term effects**: keep a small long-running holdout group to check that gains do not fade (for example, clickbait wins in week 1 and loses customers by month 3).

> **Interview tip:** Always say both: "Offline I'd track recall@500 for retrieval and NDCG@20 for ranking; online, the decision is made by an A/B test on orders per user with return rate and latency as guard metrics."

## Minutes 38–45: Failure modes, scale and cost

### Failure modes

| Failure | Mitigation |
|---|---|
| Rec service slow or down | Timeouts per stage; cached "popular near you" fallback list per city |
| Feature store lookup fails | Use default values for missing features (the model was trained with some missing values) |
| Training-serving skew | Train on logged serving features; feature store; alerts comparing feature distributions |
| Bad model deployed | Offline gate, canary at 1%, automatic rollback on guard-metric drops |
| Data pipeline delay | Monitor freshness; serve yesterday's model and features if today's are late |
| Popularity / feedback loop | Exploration traffic; coverage monitoring |
| Sale-day spike | Precompute candidate lists for top users; scale ranker servers ahead of time; shrink candidates from 500 to 300 under load |
| Fake engagement (bots, sellers gaming clicks) | Filter bot traffic from training data; weight purchases above clicks |

### Scaling

- Rec service and ranker are stateless: scale horizontally behind a load balancer ([Load Balancing, Proxies and CDN](/interview/system-design/load-balancing-proxies-and-cdn)).
- ANN index: 25.6 GB fits in one machine; replicate it (about 10 replicas if each handles about 2,000 QPS). At billions of items, shard the index by item id hash and query shards in parallel.
- Online feature store: a sharded key-value store with about 100 GB of user features, replicated for reads ([Sharding and Consistent Hashing](/interview/system-design/sharding-and-consistent-hashing)).
- **Precompute** for inactive users: compute their feed in a nightly batch job and store it, so the online system only does full work for active sessions.

### Cost summary (example figures)

| Item | Daily cost (example) |
|---|---|
| Ranking servers (110 × $0.80/hour) | ≈ $2,112 |
| ANN index replicas, feature store, rec service | Similar order of magnitude to ranking |
| Training (daily GPU jobs) | Depends on model; a few GPU-hours to tens of GPU-hours per day |
| LLM item enrichment (batch, small model) | ≈ $200 |
| Log storage (90 days × 1 TB) | Cheap object storage |

The important point: at 500 million requests a day, per-request cost must be a tiny fraction of a cent. That is why the request path uses trees, small networks and dot products, and LLMs only appear offline.

## The two-minute summary

"The home feed is a three-stage funnel. Candidate generation merges about 500 items from a two-tower ANN retrieval, co-visitation, session-based and regional trending sources in about 30 ms. A multi-task ranker, starting with gradient-boosted trees, predicts click and purchase probabilities using user, item, cross, context and real-time features from an online feature store, and we combine them with business weights. A re-ranker adds diversity, sponsored slots, seller fairness and hard filters, and returns 20 items within a 200 ms budget at 17,000 QPS peak. Events flow through a stream to update session features in seconds and into a warehouse for daily retraining on logged serving features, which avoids training-serving skew. Offline we track recall@500 and NDCG; launches are decided by A/B tests on orders per user with return rate and latency as guard metrics. Cold start uses content embeddings, regional popularity and an exploration budget; LLMs enrich new item data offline."

## Follow-up questions

**Why not use one model to score all 50 million items?**
At 17,000 requests per second that is 850 billion scorings per second, which is impossible within 200 ms at any reasonable cost. The funnel uses a cheap retrieval method to find a few hundred likely items, then spends the expensive model only on them. It is the same reason search engines use an index before ranking.

**How do you handle a user who just logged in for the first time?**
I use context (city, device, how they arrived), regional popular and trending items, and a short onboarding choice. From the first few clicks, session-based candidates and real-time features personalise the feed within the same session. As history grows, the two-tower user vector becomes meaningful.

**How do you make sure a new product gets shown at all?**
The item tower uses content features (text, image, category), so a new item gets a sensible embedding immediately and can be retrieved. I also reserve a small exploration share of slots for new items with suitable users, and give new sellers a small boost in re-ranking. After it collects enough impressions, the normal ranker takes over.

**Your offline NDCG improved by 3% but the A/B test shows no change. Why?**
Offline data only includes items the old model showed, so the evaluation is biased toward the old system's choices. The new model may be better at ordering those items but not at finding new ones users want. Other reasons: the metric does not match the business goal, novelty effects, or the change is too small to detect with the sample size. I trust the A/B test and investigate the gap.

**What is position bias and how do you correct it?**
Items at the top get more clicks because of their position, not only their quality. If you train on raw clicks, the model learns to repeat its own past ranking. I add position as a training feature and set it to a constant at serving, or reweight examples by estimated position effects, and keep a small randomised traffic slice to measure the bias.

**How would you include the user's current search query or cart in recommendations?**
Treat them as real-time features and as candidate sources: items similar to the last searched query (via text embeddings), and complementary items for the cart (phone → cover, screen guard), from co-purchase statistics. The stream pipeline writes them to the online feature store within seconds.

**How would you use an LLM in this system?**
Offline: clean and enrich product attributes, generate text embeddings for cold-start items, and create short explanations ("Because you bought running shoes"). Possibly an LLM re-ranker for a small, low-traffic surface. Not on the main request path, because the volume and latency budget require millisecond models.

**How do you choose the weights in score = P(click) + 10 × P(purchase)?**
They express business value, so I start from estimates (a purchase is worth roughly as much as N clicks in future revenue) and tune them with A/B tests, watching orders, revenue and return rate. Some teams learn them by optimising a long-term value metric directly.

**How would you detect that the model has degraded in production?**
Monitor input feature distributions (drift), prediction distributions (average predicted CTR versus actual CTR, called **calibration**), online CTR and conversion by segment, and data pipeline freshness. Alerts on sudden changes trigger investigation or rollback. Details in [Monitoring, Cost and Caching](/interview/ai-engineer/mlops-deployment/monitoring-cost-and-caching).

**What changes if the interviewer says "design YouTube-style video recommendations"?**
The funnel is the same, but the objective changes: watch time and satisfaction instead of purchases, and the content catalog changes quickly with new uploads, so freshness and cold start matter more. Signals like watch percentage, skips and likes replace cart and orders, and the system must avoid optimising only watch time in ways that hurt long-term satisfaction.

## Key terms

| Term | Simple meaning |
|---|---|
| ML system design | Designing a system whose core is a trained model |
| Multi-stage funnel | Candidate generation → ranking → re-ranking, each on fewer items |
| Candidate generation | Cheap retrieval of a few hundred likely items |
| Two-tower model | Separate user and item networks whose vectors are compared by dot product |
| ANN index | Fast approximate nearest neighbour search over item vectors |
| In-batch negatives | Using other items in the same training batch as negative examples |
| Co-visitation | Items often viewed together in the same sessions |
| Ranker | Model that scores each candidate precisely |
| Multi-task model | One model predicting several outcomes (click, purchase) |
| Re-ranking | Adjusting the final list for diversity and business rules |
| Position bias | Higher positions get more clicks regardless of quality |
| Training-serving skew | Features differ between training and serving |
| Logged features | Saving the exact features used at serving time for training |
| Cold start | No history for a new user or item |
| Exploration | Showing uncertain items to learn about them |
| Multi-armed bandit | Method that balances trying options and using the best one |
| Feedback loop | The model's outputs shape its own future training data |
| Recall@k | Share of relevant items found in the top k |
| NDCG | Ranking metric that rewards relevant items near the top |
| AUC / log loss | Classification metrics for predicted probabilities |
| GMV | Gross merchandise value: total value of orders |
| Holdout group | Users kept on the old system to measure long-term effects |
| Calibration | Whether predicted probabilities match real frequencies |

**Next:** [Case Study — AI Code Assistant](/interview/ai-engineer/ai-system-design/case-ai-code-assistant)
