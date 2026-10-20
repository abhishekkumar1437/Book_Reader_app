---
title: Monitoring, Cost and Caching
part: Operations
summary: What to watch in production ML and LLM systems, logging and tracing LLM calls (Langfuse, LangSmith, OpenTelemetry), data and concept drift with a PSI example, p50/p95/p99 worked from sample latencies, token cost tracking, prompt caching, semantic caching code, and fallbacks.
---

Deploying is the start, not the end. Once real users arrive, you need to know: is it up, is it fast, is it still accurate, and how much is it costing? An LLM app can quietly start hallucinating after a document update, or a single heavy user can burn a month's budget in a day. This chapter covers the dashboards and alerts that catch these problems, and the two most effective tools for cutting cost and latency: caching and smart fallbacks.

> **In simple words:** Log every request with its latency, tokens, cost and result. Watch percentiles (p95, p99), not averages. Watch inputs for drift. Track cost per request and per user. Cache repeated work (prompt caching, exact cache, semantic cache). Have a fallback when the model provider fails.

## What to monitor

Monitoring an AI system has more layers than monitoring a normal web service.

| Layer | Questions | Example signals |
|---|---|---|
| Infrastructure | Are machines healthy? | CPU, memory, GPU memory and utilisation, disk |
| Service | Is the API working and fast? | Request rate, error rate (4xx/5xx), latency p50/p95/p99 |
| Model / data | Is the model still seeing what it was trained on? | Input feature distributions, prediction distribution, drift scores |
| Quality | Are answers still good? | Accuracy on labelled samples, user thumbs up/down, LLM-judge scores on sampled traffic |
| LLM-specific | What is the LLM doing? | Tokens in/out, cost per request, time to first token, cache hit rate, guardrail triggers, tool-call failures |
| Business | Is it helping? | Tickets resolved without a human, conversion, user retention |

**Logs**, **metrics** and **traces** are the three pillars of **observability** (being able to understand what a system is doing from the outside):

- A **log** is one event record: "request 81f2 took 840 ms, 1,203 tokens, status 200".
- A **metric** is a number aggregated over time: "p95 latency over the last 5 minutes = 1.2 s". Stored in systems like Prometheus, CloudWatch or Datadog; graphed in Grafana.
- A **trace** follows one request through every step (retrieval, rerank, LLM call, tool call), with timing for each step. Each step is a **span**.

## Logging and tracing LLM calls

For each LLM call, log enough to debug and to compute cost, but be careful with private data.

```json
{
  "ts": "2026-10-12T10:15:02Z",
  "request_id": "81f2c0",
  "user_id": "u_1932",
  "route": "/chat",
  "prompt_version": "support-v7",
  "model": "claude-sonnet-5-5",
  "input_tokens": 1820,
  "output_tokens": 240,
  "cache_read_tokens": 1500,
  "latency_ms": 2140,
  "ttft_ms": 610,
  "status": "ok",
  "retrieved_doc_ids": ["policy-12", "faq-3"],
  "cost_inr": 0.71,
  "user_feedback": null
}
```

This is **structured logging**: each log line is JSON with fixed field names, so you can search and aggregate ("average cost per `prompt_version`").

> **Common mistake:** Logging full prompts and answers with phone numbers, Aadhaar numbers or addresses in plain text, and keeping them forever. Redact **PII** (personally identifiable information) before logging, restrict who can read logs, and set a retention period. Data protection law (India's DPDP Act) applies to logs too.

### Tracing tools

| Tool | What it is | Notes |
|---|---|---|
| **Langfuse** | Open-source LLM observability: traces, prompt management, evals, cost | Self-host or cloud |
| **LangSmith** | LangChain's tracing and eval platform | Works with or without LangChain |
| **OpenTelemetry (OTel)** | Vendor-neutral standard for traces, metrics, logs | Has "GenAI semantic conventions" (standard attribute names like `gen_ai.usage.input_tokens`); send to any backend |
| MLflow Tracing, Arize Phoenix, Helicone, W&B Weave | Other LLM tracing options | Similar ideas |

Langfuse with its decorator (Langfuse Python SDK v3; older v2 imported it from `langfuse.decorators`):

```python
from langfuse import observe        # reads LANGFUSE_PUBLIC_KEY / SECRET_KEY / HOST from env

@observe()                          # each call becomes a span in the trace
def retrieve(question: str) -> list[str]:
    return vector_search(question, k=5)

@observe()
def answer(question: str) -> str:
    docs = retrieve(question)       # nested span under "answer"
    return call_llm(question, docs) # LLM calls can be captured via Langfuse integrations
```

Plain OpenTelemetry, if you want no vendor lock-in:

```python
from opentelemetry import trace

tracer = trace.get_tracer("ai-service")

async def chat(question: str) -> str:
    with tracer.start_as_current_span("llm.chat") as span:          # one span per LLM call
        span.set_attribute("gen_ai.request.model", LLM_MODEL)
        msg = await llm.messages.create(model=LLM_MODEL, max_tokens=500,
                                        messages=[{"role": "user", "content": question}])
        span.set_attribute("gen_ai.usage.input_tokens", msg.usage.input_tokens)
        span.set_attribute("gen_ai.usage.output_tokens", msg.usage.output_tokens)
        return "".join(b.text for b in msg.content if b.type == "text")
```

A trace for one RAG request might show: embed query 40 ms → vector search 25 ms → rerank 120 ms → LLM 1,900 ms. Now you know where to optimise.

> **Interview tip:** When asked "how do you debug a bad LLM answer in production?", say: "Find the trace by request id. Check what was retrieved, the exact prompt sent with its version, the model and settings, and the raw output. Then add the case to the eval set so it never regresses."

## Data drift and concept drift

A reminder: **data drift** = the input distribution changes; **concept drift** = the correct answer for the same input changes (see [What Is MLOps](/interview/ai-engineer/mlops-deployment/what-is-mlops)).

You usually do not have labels in real time (you learn whether a loan defaulted months later). So you watch the **inputs** and the **predictions** for drift, and check quality on labels as they arrive.

### Measuring drift: PSI by hand

The **Population Stability Index (PSI)** compares the distribution of a feature in training ("expected") with production ("actual"). Split values into bins, take the fraction in each bin, then:

<div class="formula">

| Formula | Meaning |
|---|---|
| PSI = Σ (aᵢ − eᵢ) × ln(aᵢ ÷ eᵢ) | Sum over bins; aᵢ = actual fraction, eᵢ = expected fraction |
| PSI < 0.1 | No significant change |
| 0.1 ≤ PSI < 0.25 | Moderate change: investigate |
| PSI ≥ 0.25 | Major change: likely retrain |

</div>

Example: order value on an e-commerce site, three bins.

| Bin | Training (eᵢ) | This week (aᵢ) | aᵢ − eᵢ | ln(aᵢ ÷ eᵢ) | Product |
|---|---|---|---|---|---|
| < ₹500 | 0.25 | 0.10 | −0.15 | ln(0.4) = −0.916 | 0.137 |
| ₹500–2,000 | 0.50 | 0.50 | 0.00 | ln(1) = 0 | 0.000 |
| > ₹2,000 | 0.25 | 0.40 | +0.15 | ln(1.6) = 0.470 | 0.071 |

PSI = 0.137 + 0 + 0.071 = **0.208**. That is in the moderate band. During a sale this is expected; at a normal time, investigate.

Other drift tests: the **Kolmogorov–Smirnov (KS) test** for numeric features, **chi-square** for categories, and comparing the **prediction distribution** (e.g. the fraction predicted "fraud" jumping from 1% to 6%). Tools like **Evidently** compute these and produce reports.

### Drift in LLM apps

- **Query drift**: users start asking about new topics (a new product launch). Cluster query embeddings weekly and watch for new clusters or rising "I don't know" answers.
- **Knowledge drift**: documents become stale; answers cite an old policy. Track document freshness and re-index.
- **Model drift**: the provider updates a model version and behaviour changes. Pin model versions where possible and re-run evals when you change them.

> **Common mistake:** Alerting on drift for every feature. With 200 features, some will always look "drifted". Monitor the most important features and the prediction distribution, and alert on quality when labels arrive.

## Latency percentiles: p50, p95, p99

An average hides the users who suffer. **Percentiles** describe the distribution. The **p95** latency is the value that 95% of requests are faster than (or equal to). **p50** is the **median**. **p99** shows the **tail**: the slowest 1%.

### Worked example from 10 latencies

Ten requests took these times (ms):

```text
120, 900, 150, 135, 400, 180, 160, 220, 250, 200
```

**Step 1: sort.**

| Rank | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| ms | 120 | 135 | 150 | 160 | 180 | 200 | 220 | 250 | 400 | 900 |

**Step 2: mean** = (120 + 135 + 150 + 160 + 180 + 200 + 220 + 250 + 400 + 900) ÷ 10 = 2,715 ÷ 10 = **271.5 ms**.

**Step 3: percentiles with the nearest-rank method.** Rank = ⌈p × n⌉ (round up), n = 10.

- p50: ⌈0.50 × 10⌉ = 5 → 5th value = **180 ms**
- p95: ⌈0.95 × 10⌉ = ⌈9.5⌉ = 10 → **900 ms**
- p99: ⌈0.99 × 10⌉ = ⌈9.9⌉ = 10 → **900 ms**

**Step 4: what `numpy.percentile` gives** (it interpolates between ranks by default). Position = p × (n − 1), counting from 0.

- p50: 0.50 × 9 = 4.5 → halfway between index 4 (180) and 5 (200) = **190 ms**
- p95: 0.95 × 9 = 8.55 → 400 + 0.55 × (900 − 400) = 400 + 275 = **675 ms**
- p99: 0.99 × 9 = 8.91 → 400 + 0.91 × 500 = 400 + 455 = **855 ms**

```python
import numpy as np
lat = [120, 900, 150, 135, 400, 180, 160, 220, 250, 200]
print(np.mean(lat), np.percentile(lat, [50, 95, 99]))
# Output: 271.5 [190. 675. 855.]
```

What to notice:
- The **mean (271.5)** is higher than **8 of the 10** requests. One slow request (900 ms) pulled it up. It describes nobody.
- The **median (180–190)** describes the typical user.
- **p95/p99** show that some users wait 4–5× longer. With only 10 samples, p95 and p99 are basically "the slowest one", so they are unreliable; real dashboards compute them over thousands of requests per window.

Why the tail matters: if one page makes 10 backend calls, the chance that *at least one* of them is slower than the p99 is 1 − 0.99¹⁰ ≈ 1 − 0.904 = **9.6%**. Tail latency of parts becomes common latency of the whole.

> **Interview tip:** Always say "p95 latency" or "p99 latency" in design answers, never "average latency". For LLM apps, give both **time to first token** and **total time**, because streaming makes TTFT what users feel.

### The monitoring metrics table

| Metric | What it measures | Why it matters | Example alert |
|---|---|---|---|
| Request rate (RPS) | Requests per second | Capacity planning; sudden drops signal outages | RPS drops 50% vs same hour last week |
| Error rate | % of 5xx (and provider errors) | Reliability | > 1% for 5 minutes |
| Latency p50 / p95 / p99 | Typical and tail response time | User experience; SLOs | p95 > 2 s for 10 minutes |
| TTFT p95 | Time until first streamed token | Perceived speed of LLM apps | p95 > 1.5 s |
| Tokens in / out per request | Prompt and answer size | Cost and latency drivers | Average input tokens up 40% (prompt bloat) |
| Cost per request / per user / per day | Money spent | Budget control | Daily cost > ₹5,000; a user > ₹500/day |
| Cache hit rate | % of requests served from cache | Cost and latency savings | Drops below 20% after a deploy |
| Drift score (PSI) | Input distribution change | Early warning of quality loss | PSI ≥ 0.25 on a key feature |
| Prediction distribution | Share of each predicted class | Model behaviour change | "Fraud" share 3× normal |
| Quality score | Accuracy on labels, judge score, thumbs-up rate | Real usefulness | Thumbs-down rate doubles |
| Guardrail triggers | Blocked inputs/outputs | Attacks, unsafe output | Injection attempts spike |
| GPU memory / KV cache usage | Server saturation | Need to scale | KV cache > 90% for 5 minutes |

### SLOs and error budgets

An **SLO** (service level objective) is a target like "99.5% of requests succeed each month" or "p95 latency < 2 s". The **error budget** is how much failure the SLO allows.

For 99.5% availability in a 30-day month: total minutes = 30 × 24 × 60 = 43,200. Allowed downtime = 43,200 × 0.005 = **216 minutes** (3.6 hours). If you have used 200 minutes by day 20, you slow down risky releases. (More in [Reliability and Scalability Patterns](/interview/system-design/reliability-and-scalability-patterns).)

## Token cost tracking

LLM providers charge per **token**, usually with different prices for input and output tokens, quoted per million tokens. (Tokens: see [Tokenization](/interview/ai-engineer/nlp-transformers/tokenization).)

<div class="formula">

| Formula |
|---|
| cost = input_tokens × input_price ÷ 1,000,000 + output_tokens × output_price ÷ 1,000,000 |

</div>

### Worked example

These are made-up example prices to show the method (real prices change; check the provider's page): **₹250 per million input tokens** and **₹1,250 per million output tokens**.

A RAG request sends 2,000 input tokens (system prompt + 5 chunks + question) and gets 300 output tokens.

1. Input cost = 2,000 × 250 ÷ 1,000,000 = 5,00,000 ÷ 10,00,000 = **₹0.50**
2. Output cost = 300 × 1,250 ÷ 1,000,000 = 3,75,000 ÷ 10,00,000 = **₹0.375**
3. Per request = 0.50 + 0.375 = **₹0.875**
4. 10,000 requests/day → 10,000 × 0.875 = **₹8,750/day** → × 30 = **₹2,62,500/month**

Where to cut: input tokens are 57% of cost here (0.50 ÷ 0.875). Retrieving 3 chunks instead of 5, shortening the system prompt, or prompt caching attacks the biggest part. Output is limited by `max_tokens` and by asking for concise answers.

### Tracking cost in code

```python
# cost.py — keep prices in config, not hard-coded across the codebase
import time
from fastapi import HTTPException

PRICES_INR_PER_M = {                        # example numbers; load real ones from config
    "claude-sonnet-5-5": {"input": 250.0, "output": 1250.0},
    "claude-haiku-5-5":  {"input": 80.0,  "output": 400.0},
}

def request_cost_inr(model: str, input_tokens: int, output_tokens: int) -> float:
    p = PRICES_INR_PER_M[model]
    return (input_tokens * p["input"] + output_tokens * p["output"]) / 1_000_000

async def charge_user(redis, user_id: str, cost: float, daily_limit_inr: float = 50.0) -> None:
    key = f"cost:{user_id}:{time.strftime('%Y-%m-%d')}"
    total = await redis.incrbyfloat(key, cost)          # atomic add in Redis
    await redis.expire(key, 2 * 24 * 3600)              # auto-clean after 2 days
    if total > daily_limit_inr:
        raise HTTPException(status_code=429, detail="Daily usage limit reached")

# after each call:
# cost = request_cost_inr(model, msg.usage.input_tokens, msg.usage.output_tokens)
# await charge_user(cache, user_id, cost); log cost with the request
```

Track cost by **user**, **feature** (`/chat` vs `/summarize`), **prompt version** and **model**. Then you can answer "which feature is expensive?" and "did prompt v8 increase cost?". (Bigger-picture cost design: [Latency, Cost and Scale](/interview/ai-engineer/ai-system-design/latency-cost-and-scale).)

## Caching for LLM apps

Caching means storing a result so you can reuse it instead of recomputing. For LLM apps there are three different caches. (General caching ideas: [Caching](/interview/system-design/caching).)

| Cache | What is reused | Saves | Risk |
|---|---|---|---|
| **Prompt caching** (provider side) | The processed **prefix** of a prompt (system prompt, long documents) | Input token cost and TTFT; answer still generated fresh | Almost none; only helps if the prefix is identical |
| **Exact response cache** (your Redis) | The full answer for the exact same request | The whole LLM call | Stale answers; only hits on identical text |
| **Semantic cache** (embeddings) | The answer for a **similar** earlier question | The whole LLM call | Wrong answer if "similar" is not "same meaning" |

### Prompt caching

Many requests share a long, identical start: the same 5,000-token system prompt and policy document, with only the user's question different. The provider can store its internal state (the KV cache) for that prefix and reuse it. You pay much less for cached input tokens and the first token arrives sooner.

With the Anthropic API you mark where the cacheable prefix ends with `cache_control`:

```python
import anthropic

client = anthropic.Anthropic()
POLICY_DOC = open("refund_policy.md").read()            # long, same for every user

def ask(question: str):
    resp = client.messages.create(
        model="claude-sonnet-5-5",
        max_tokens=400,
        system=[
            {"type": "text", "text": "You are a support assistant. Answer only from the policy."},
            {"type": "text", "text": POLICY_DOC,
             "cache_control": {"type": "ephemeral"}},      # cache everything up to here
        ],
        messages=[{"role": "user", "content": question}],  # changes per request, after the prefix
    )
    u = resp.usage
    print(u.cache_creation_input_tokens, u.cache_read_input_tokens, u.input_tokens)
    return resp

ask("Can I return a phone after 10 days?")   # Output (example): 5200 0 18   → cache written
ask("Is shipping refunded?")                 # Output (example): 0 5200 12   → cache read
```

Rules that make prompt caching work:

- Put **static content first** (instructions, documents, tool definitions), **variable content last**.
- The prefix must be **byte-for-byte identical**; a timestamp at the top of the system prompt breaks every cache hit.
- There is a minimum prefix length and a short lifetime (minutes by default, refreshed on each hit). Details and prices differ by provider and change over time; at the time of writing, Anthropic bills cache reads at a small fraction of the normal input price and cache writes slightly above it. OpenAI caches long prefixes automatically.

**Worked example (using Anthropic's current multipliers: write = 1.25×, read = 0.1× of the normal input price).** A 10,000-token prefix is used by 100 requests within the cache lifetime.

- Without caching: 100 × 10,000 = 1,000,000 input tokens at full price.
- With caching: 1 write = 10,000 × 1.25 = 12,500 token-equivalents; 99 reads = 99 × 10,000 × 0.1 = 99,000. Total = 111,500.
- Saving = 1 − 111,500 ÷ 1,000,000 = 1 − 0.1115 = **88.85%** on the prefix tokens.

### Exact response cache with Redis

```python
import hashlib, json

def cache_key(model: str, prompt_version: str, messages: list[dict], temperature: float) -> str:
    raw = json.dumps({"m": model, "v": prompt_version, "msgs": messages, "t": temperature},
                     sort_keys=True)
    return "llm:" + hashlib.sha256(raw.encode()).hexdigest()   # same input → same key

async def cached_llm(redis, model, prompt_version, messages, temperature=0.0):
    key = cache_key(model, prompt_version, messages, temperature)
    if (hit := await redis.get(key)) is not None:
        return hit                                             # ~1 ms, ₹0
    answer = await call_llm(model, messages, temperature)
    await redis.set(key, answer, ex=24 * 3600)                 # expire after a day
    return answer
```

Include the model and **prompt version** in the key, so a new prompt does not return old answers. Only cache when `temperature` is 0 or low, and never cache answers that contain one user's private data for other users.

### Semantic caching

Users ask the same thing in different words: "What is the refund period?" and "How many days do I get to return stuff?". An exact cache misses. A **semantic cache** embeds each question into a vector (see [Embeddings and Semantic Search](/interview/ai-engineer/llms-genai/embeddings-and-semantic-search)) and returns the stored answer of the most similar earlier question if the **cosine similarity** is above a threshold.

<figure>
<svg viewBox="0 0 440 200" width="440" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="5" y="80" width="60" height="36" rx="6" />
<text x="35" y="102" text-anchor="middle" fill="currentColor" stroke="none">Query</text>
<line x1="65" y1="98" x2="85" y2="98" />
<polygon points="85,98 77,94 77,102" fill="currentColor" />
<rect x="85" y="80" width="65" height="36" rx="6" />
<text x="117" y="102" text-anchor="middle" fill="currentColor" stroke="none">Embed</text>
<line x1="150" y1="98" x2="170" y2="98" />
<polygon points="170,98 162,94 162,102" fill="currentColor" />
<rect x="170" y="80" width="90" height="36" rx="6" />
<text x="215" y="102" text-anchor="middle" fill="currentColor" stroke="none">Cache search</text>
<polyline points="215,80 215,40 290,40" />
<polygon points="290,40 282,36 282,44" fill="currentColor" />
<text x="222" y="62" fill="var(--accent)" stroke="none" font-size="11" font-weight="bold">sim ≥ 0.92</text>
<rect x="290" y="22" width="140" height="36" rx="6" />
<text x="360" y="44" text-anchor="middle" fill="var(--accent)" stroke="none">Return cached answer</text>
<polyline points="215,116 215,160 290,160" />
<polygon points="290,160 282,156 282,164" fill="currentColor" />
<text x="222" y="146" fill="currentColor" stroke="none" font-size="11">else</text>
<rect x="290" y="142" width="140" height="36" rx="6" />
<text x="360" y="164" text-anchor="middle" fill="currentColor" stroke="none">Call LLM, then store</text>
</svg>
<figcaption>A semantic cache skips the LLM when a new question is close enough in meaning to one already answered.</figcaption>
</figure>

**Worked similarity.** Tiny 3-number embeddings (real ones have hundreds of numbers):
- q1 "What is the refund period?" → a = [0.2, 0.5, 0.1]
- q2 "How many days to return stuff?" → b = [0.25, 0.45, 0.05]

1. Dot product = 0.2 × 0.25 + 0.5 × 0.45 + 0.1 × 0.05 = 0.05 + 0.225 + 0.005 = 0.28
2. |a| = √(0.04 + 0.25 + 0.01) = √0.30 ≈ 0.5477
3. |b| = √(0.0625 + 0.2025 + 0.0025) = √0.2675 ≈ 0.5172
4. Cosine = 0.28 ÷ (0.5477 × 0.5172) = 0.28 ÷ 0.2833 ≈ **0.988**

0.988 ≥ 0.92 → cache hit; return q1's stored answer.

A code sketch (in-memory, for learning; production uses a vector DB or Redis vector search):

```python
# semantic_cache.py
import time
import numpy as np
from sentence_transformers import SentenceTransformer

class SemanticCache:
    def __init__(self, threshold: float = 0.92, ttl_s: int = 3600):
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")   # small, fast embedding model
        self.threshold, self.ttl_s = threshold, ttl_s
        self.vecs: list[np.ndarray] = []
        self.items: list[dict] = []          # {"answer", "namespace", "created", "question"}

    def _embed(self, text: str) -> np.ndarray:
        return self.embedder.encode(text, normalize_embeddings=True)  # unit length → dot = cosine

    def get(self, question: str, namespace: str):
        if not self.vecs:
            return None
        q = self._embed(question)
        sims = np.stack(self.vecs) @ q                         # cosine with every cached question
        now = time.time()
        for i, it in enumerate(self.items):                    # ignore other namespaces / expired
            if it["namespace"] != namespace or now - it["created"] > self.ttl_s:
                sims[i] = -1.0
        best = int(np.argmax(sims))
        if sims[best] >= self.threshold:
            return self.items[best]["answer"], float(sims[best])
        return None

    def put(self, question: str, answer: str, namespace: str) -> None:
        self.vecs.append(self._embed(question))
        self.items.append({"answer": answer, "namespace": namespace,
                           "created": time.time(), "question": question})

cache = SemanticCache()

async def answer(question: str, lang: str) -> str:
    ns = f"support-v7:{lang}"                    # prompt version + language: never mix them
    if (hit := cache.get(question, ns)):
        return hit[0]                            # log the similarity for threshold tuning
    ans = await call_llm(question)
    cache.put(question, ans, ns)
    return ans
```

The danger is a **false hit**: "Can I return a **phone** after 10 days?" and "Can I return a **laptop** after 10 days?" may have similarity above 0.92 but different answers if policies differ. Ways to stay safe:

- Tune the **threshold** on real query pairs labelled "same/different"; start strict (0.95) and lower carefully.
- Use **namespaces/filters**: prompt version, language, product category, user tier.
- **Never** semantic-cache personal answers ("What is *my* order status?").
- Set a **TTL** and clear the cache when source documents change.
- Log hits with their similarity, and sample them for review.

> **Interview tip:** Mention the trade-off: "Semantic caching cuts cost and latency for FAQ-style traffic, but risks returning a wrong answer for a slightly different question. I'd use a strict threshold, metadata filters, no caching of personalised queries, and monitor hit quality."

## Fallbacks and resilience

LLM providers sometimes return errors (rate limits **429**, overloaded/server errors **5xx**) or become slow. Your app should degrade gracefully instead of failing.

| Technique | What it does |
|---|---|
| **Timeout** | Never wait forever; e.g. 20 s for a full answer |
| **Retry with exponential backoff + jitter** | Retry transient errors after 1 s, 2 s, 4 s..., plus a small random delay so all clients do not retry at once |
| **Model fallback** | If model A fails, try model B (a smaller one, another provider, or your self-hosted vLLM) |
| **Circuit breaker** | After many failures, stop calling the provider for a short time and use the fallback directly |
| **Graceful degradation** | Return cached/simple answers, or a friendly "try again" with the request queued |

```python
import asyncio
import random
import anthropic

client = anthropic.AsyncAnthropic(max_retries=0, timeout=20.0)   # we handle retries ourselves
MODELS = ["claude-sonnet-5-5", "claude-haiku-5-5"]               # primary, then fallback
RETRYABLE = (anthropic.RateLimitError, anthropic.InternalServerError, anthropic.APIConnectionError)

async def call_with_fallback(messages: list[dict]):
    for model in MODELS:
        for attempt in range(3):
            try:
                return await client.messages.create(model=model, max_tokens=500, messages=messages)
            except RETRYABLE:
                delay = 2 ** attempt + random.uniform(0, 0.5)    # 1, 2, 4 s + jitter
                await asyncio.sleep(delay)
            # other errors (e.g. 400 bad request) are not retried: they would fail again
    raise RuntimeError("All models failed")
```

(The official SDKs already retry some errors by default; here we turn that off to show the logic.) Worst case for one request with this code: 3 attempts per model with sleeps of about 1 + 2 + 4 = 7 s each, so about 14 s of waiting plus call time. Make sure that fits your timeout budget, or use fewer retries for interactive requests.

> **Common mistake:** Retrying non-retryable errors (400 bad request, 401 auth) or retrying instantly in a tight loop. That wastes time and can make an overloaded provider worse.

## Key terms

| Term | Simple meaning |
|---|---|
| Observability | Understanding a system's behaviour from logs, metrics and traces |
| Log / metric / trace | One event / an aggregated number over time / one request's full path |
| Span | One timed step inside a trace |
| Structured logging | Logs as JSON with fixed fields |
| PII | Personal data that identifies someone |
| Langfuse / LangSmith | LLM tracing and evaluation platforms |
| OpenTelemetry | Open standard for traces, metrics and logs |
| PSI | Population Stability Index: a drift score between distributions |
| KS test | Statistical test comparing two numeric distributions |
| Percentile (p50/p95/p99) | Value below which that % of samples fall |
| Tail latency | Latency of the slowest requests (p99 and above) |
| SLO / error budget | A reliability target / allowed failure under it |
| Token cost | Price per input and output token |
| Prompt caching | Provider reuses a processed identical prompt prefix |
| Exact cache | Reuse an answer for an identical request |
| Semantic cache | Reuse an answer for a similar question by embedding similarity |
| Cosine similarity | Similarity of two vectors' directions, from −1 to 1 |
| False hit | Cache returns an answer meant for a different question |
| TTL | Time to live: how long a cache entry is kept |
| Exponential backoff + jitter | Retry with growing delays plus randomness |
| Circuit breaker | Stop calling a failing dependency for a while |
| Fallback | Alternative model or path used when the primary fails |

## Interview questions

**What would you monitor for an LLM-powered chatbot?**
Service metrics: request rate, error rate, p95 latency and time to first token. LLM metrics: tokens and cost per request, per user and per feature, cache hit rate, guardrail triggers. Quality: user feedback, LLM-judge scores on sampled traffic, rate of "I don't know" answers. Plus drift in query topics and freshness of the indexed documents.

**Why use p95/p99 instead of average latency?**
Averages are pulled by outliers and hide the slow experiences. With latencies like 120 to 250 ms plus one 900 ms request, the mean is 271.5 ms, higher than most requests. Percentiles show the typical user (p50) and the slow tail (p95, p99), which is what SLOs are written in.

**What is data drift and how do you detect it?**
A change in the input distribution compared with training data. Detect it by comparing feature distributions with PSI, the KS test or chi-square, and by watching the prediction distribution. Confirm the impact with quality metrics when labels arrive, then retrain if needed.

**How do you track and control LLM costs?**
Log input and output tokens for every call and convert them to cost with a price table in config. Aggregate by user, feature, model and prompt version. Control cost with per-user budgets and rate limits, `max_tokens`, shorter prompts and fewer retrieved chunks, prompt caching, response caching, and routing easy queries to cheaper models.

**Explain prompt caching. How do you get high hit rates?**
The provider stores the processed state of an identical prompt prefix and reuses it on later requests, which cuts input cost and time to first token. Put static content like instructions, documents and tool definitions first and the variable user question last, and keep the prefix byte-identical; no timestamps or random ids at the top.
*Follow-up the interviewer may ask:* "How is it different from response caching?" Prompt caching still generates a fresh answer; response caching skips the call completely.

**What is semantic caching and what are its risks?**
It stores answers keyed by question embeddings and returns a stored answer when a new question's cosine similarity is above a threshold. It saves the whole LLM call for paraphrased questions. The risk is false hits for questions that are similar but differ in an important detail, plus stale or personal answers; use strict thresholds, metadata filters, TTLs and no caching of personalised queries.

**How would you handle the LLM provider going down?**
Timeouts and retries with exponential backoff and jitter for transient errors, then a fallback model or provider, possibly a self-hosted model behind an OpenAI-compatible API. A circuit breaker stops hammering a failing provider. For non-urgent work, queue the request; for users, show a clear message instead of hanging.

**How do you debug a user complaint about a wrong answer?**
Look up the trace by request id: the retrieved documents, the prompt version and full prompt, model and settings, and the output. Decide if the failure was retrieval, prompting or the model. Fix it, then add the case to the golden eval set to prevent regressions.

**What should and should not go in LLM logs?**
Should: request id, user id or hash, model, prompt version, token counts, latency, cost, retrieved document ids, status, feedback. Should not: raw PII, secrets or full sensitive conversations without redaction and access control. Set a retention period to comply with data protection rules.

**What is an error budget?**
The amount of failure an SLO allows. For 99.5% availability over 30 days, that is 0.5% of 43,200 minutes, or 216 minutes. If the budget is nearly used, the team slows down risky deploys and focuses on reliability.

## Try it yourself

1. **Percentiles.** Latencies (ms): 300, 280, 310, 1200, 290, 305, 295, 2500, 285, 315. Compute the mean and the nearest-rank p50 and p90. What story does each tell?
2. **PSI.** Training bins: 0.30, 0.40, 0.30. Production: 0.20, 0.40, 0.40. Compute PSI and classify it.
   *Hint:* ln(0.667) ≈ −0.405, ln(1.333) ≈ 0.288.
3. **Cost.** With the example prices (₹250/M input, ₹1,250/M output), a summarizer sends 6,000 input and 500 output tokens. What does one request cost? If prompt caching makes 5,000 of the input tokens cost 10% of normal, what is the new cost?
4. **Semantic cache test.** Using the `SemanticCache` sketch, add 5 FAQ answers and try 10 paraphrases and 5 "near but different" questions. Find a threshold that gets most paraphrases and none of the near-misses.

### Answers

1. Sorted: 280, 285, 290, 295, 300, 305, 310, 315, 1200, 2500. Sum = 280 + 285 + 290 + 295 + 300 + 305 + 310 + 315 + 1200 + 2500 = 6,080; mean = **608 ms**. p50: ⌈0.5 × 10⌉ = 5 → **300 ms**. p90: ⌈0.9 × 10⌉ = 9 → **1,200 ms**. The typical user waits about 300 ms, but 2 in 10 wait over a second; the mean (608 ms) matches nobody.
2. Bin 1: (0.20 − 0.30) × ln(0.20 ÷ 0.30) = (−0.10) × (−0.405) = 0.0405. Bin 2: 0. Bin 3: (0.40 − 0.30) × ln(1.333) = 0.10 × 0.288 = 0.0288. PSI = 0.0405 + 0.0288 = **0.069** → below 0.1, no significant drift.
3. Normal: input 6,000 × 250 ÷ 10⁶ = ₹1.50; output 500 × 1,250 ÷ 10⁶ = ₹0.625; total **₹2.125**. With caching: cached 5,000 × 250 × 0.1 ÷ 10⁶ = ₹0.125; uncached 1,000 × 250 ÷ 10⁶ = ₹0.25; output ₹0.625; total = 0.125 + 0.25 + 0.625 = **₹1.00** (ignoring the one-time cache write).
4. Typical finding: paraphrases score around 0.80–0.95 with a small model like MiniLM, and near-misses (different product, different number) can score just as high. That is why namespaces and filters matter more than the threshold alone. Record the scores and choose the threshold that gives zero false hits on your near-miss set.

**Next:** [MLOps Interview Question Bank](/interview/ai-engineer/mlops-deployment/mlops-interview-question-bank)
