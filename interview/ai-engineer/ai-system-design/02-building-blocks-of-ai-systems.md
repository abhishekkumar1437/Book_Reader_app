---
title: Building Blocks of AI Systems
part: Framework
summary: The components you combine in almost every AI design — LLM gateway and router, prompt store, vector database, caches, queues, feature store, guardrails, and evaluation and monitoring — with what each solves and the trade-offs interviewers probe.
---

Almost every AI system design uses the same ten or so boxes. A document chatbot, a support agent and a code assistant look different to users, but inside they share a gateway, a vector database, caches, guardrails and monitoring. Learn the boxes once and each case study becomes a matter of choosing and connecting them.

> **In simple words:** A building block is a standard component with one job. For each one, know three things: what problem it solves, where it sits in the request path, and what it costs you (latency, money, complexity).

Normal infrastructure parts (load balancers, databases, caches, queues) are explained in the System Design book. This chapter only covers what is different when they serve AI workloads, and links back for the basics.

## The reference architecture

<figure>
<svg viewBox="0 0 440 260" width="440" height="260" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="6" y="95" width="60" height="36" rx="8" />
<text x="36" y="117" text-anchor="middle" fill="currentColor" stroke="none">Client</text>
<line x1="66" y1="113" x2="84" y2="113" />
<polygon points="85,113 79,109 79,117" fill="currentColor" />
<rect x="86" y="85" width="92" height="56" rx="8" />
<text x="132" y="109" text-anchor="middle" fill="currentColor" stroke="none">App server /</text>
<text x="132" y="125" text-anchor="middle" fill="currentColor" stroke="none">orchestrator</text>
<rect x="200" y="8" width="96" height="26" rx="6" />
<text x="248" y="25" text-anchor="middle" fill="currentColor" stroke="none">Guardrails</text>
<rect x="200" y="42" width="96" height="26" rx="6" />
<text x="248" y="59" text-anchor="middle" fill="currentColor" stroke="none">Cache</text>
<rect x="200" y="76" width="96" height="26" rx="6" />
<text x="248" y="93" text-anchor="middle" fill="currentColor" stroke="none">Prompt store</text>
<rect x="200" y="110" width="96" height="26" rx="6" stroke="var(--accent)" />
<text x="248" y="127" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">LLM gateway</text>
<rect x="200" y="144" width="96" height="26" rx="6" />
<text x="248" y="161" text-anchor="middle" fill="currentColor" stroke="none">Vector DB</text>
<rect x="200" y="178" width="96" height="26" rx="6" />
<text x="248" y="195" text-anchor="middle" fill="currentColor" stroke="none">Feature store</text>
<line x1="178" y1="113" x2="200" y2="21" />
<line x1="178" y1="113" x2="200" y2="55" />
<line x1="178" y1="113" x2="200" y2="89" />
<line x1="178" y1="113" x2="200" y2="123" />
<line x1="178" y1="113" x2="200" y2="157" />
<line x1="178" y1="113" x2="200" y2="191" />
<line x1="296" y1="123" x2="318" y2="123" />
<polygon points="319,123 313,119 313,127" fill="currentColor" />
<rect x="320" y="100" width="112" height="46" rx="8" />
<text x="376" y="119" text-anchor="middle" fill="currentColor" stroke="none">Models: large,</text>
<text x="376" y="135" text-anchor="middle" fill="currentColor" stroke="none">small, self-hosted</text>
<rect x="86" y="220" width="150" height="30" rx="6" />
<text x="161" y="240" text-anchor="middle" fill="currentColor" stroke="none">Queue + async workers</text>
<line x1="132" y1="141" x2="132" y2="220" stroke-dasharray="4 3" />
<rect x="250" y="220" width="182" height="30" rx="6" />
<text x="341" y="240" text-anchor="middle" fill="currentColor" stroke="none">Eval and monitoring</text>
<line x1="376" y1="146" x2="376" y2="220" stroke-dasharray="4 3" />
</svg>
<figcaption>The app server orchestrates one request using the blocks in the middle column. Every model call goes through the gateway. Dashed lines are asynchronous: background jobs and logs.</figcaption>
</figure>

Read the picture like this. The client sends a request to the **app server** (sometimes called the **orchestrator**, because it decides the order of steps). The app server checks guardrails, looks in the cache, loads a prompt template, retrieves context from the vector database or features from the feature store, and calls the model through the gateway. Slow work goes to a queue. Every step writes logs and traces for evaluation and monitoring.

You will rarely need all of these boxes in one design. Pick only what the requirements justify.

## LLM gateway and router

**The problem.** Imagine 20 teams in a company each calling an LLM API directly. Each team stores its own API key, writes its own retry code, and nobody knows the total bill. When the provider has an outage, 20 features break in 20 different ways.

**The block.** An **LLM gateway** is one internal service that every model call goes through. Your app calls the gateway; the gateway calls the provider. It is the same idea as an API gateway in front of microservices, specialised for models.

What a gateway does:

| Job | Why it matters |
|---|---|
| Hold the provider API keys | Keys live in one safe place, not in every service |
| Retries with backoff | Providers return rate-limit (429) and overload errors; retry them with growing waits |
| Fallback | If model A fails or is too slow, try model B (another size or provider) |
| Rate limits and quotas per team/user | One runaway feature cannot eat the whole budget. See [the rate limiter case](/interview/system-design/case-rate-limiter) |
| Logging and cost tracking | Record model, tokens in/out, latency, cost for every call |
| PII redaction | Mask phone numbers, emails, Aadhaar numbers before text leaves the company |
| Routing | Choose a model per request (below) |
| Response cache | Answer repeated identical requests without calling the model |

A **model router** is the routing part of the gateway. It decides which model handles a request. Simple routers use rules ("requests from the autocomplete feature go to the small model"). Smarter routers use a small classifier that predicts difficulty, or try the small model first and **escalate** to the big one when the small model's answer fails a check. Routing is often the biggest single cost saving; see [Latency, Cost and Scale](/interview/ai-engineer/ai-system-design/latency-cost-and-scale).

Here is a minimal gateway function with retries, fallback and cost logging, using the `anthropic` SDK.

```python
import time
import anthropic

client = anthropic.Anthropic(max_retries=0)   # we do our own retries below

# Example prices in US$ per 1M tokens (not real prices; check your provider)
PRICES = {"claude-sonnet-5-5": (3.00, 15.00), "claude-haiku-5-5": (1.00, 5.00)}

def call_llm(messages, system, models=("claude-sonnet-5-5", "claude-haiku-5-5"),
             max_tokens=500, attempts_per_model=3):
    for model in models:                                  # fallback order
        for attempt in range(attempts_per_model):
            try:
                start = time.time()
                resp = client.messages.create(
                    model=model, max_tokens=max_tokens,
                    system=system, messages=messages,
                )
                p_in, p_out = PRICES[model]
                cost = (resp.usage.input_tokens * p_in
                        + resp.usage.output_tokens * p_out) / 1_000_000
                print(f"model={model} in={resp.usage.input_tokens} "
                      f"out={resp.usage.output_tokens} cost=${cost:.5f} "
                      f"latency={time.time() - start:.2f}s")    # send to your logs
                return resp.content[0].text
            except (anthropic.RateLimitError, anthropic.InternalServerError,
                    anthropic.APIConnectionError):
                time.sleep(2 ** attempt)                  # 1 s, 2 s, 4 s backoff
    raise RuntimeError("All models failed")              # caller shows a friendly message

answer = call_llm([{"role": "user", "content": "What is a UPI PIN?"}],
                  system="You are a helpful banking assistant. Answer in 2 sentences.")
```

In production you would use an existing gateway product or open-source proxy instead of writing your own, but you must be able to explain what it does inside.

> **Interview tip:** Draw the gateway as one box and list its jobs out loud: "keys, retries, fallback, quotas, logging, redaction, routing." That one sentence covers five follow-up questions before they are asked.

> **Common mistake:** Retrying every error. Retry only temporary errors (rate limits, overload, timeouts). A "bad request" error will fail the same way every time, and retrying it just wastes money and time.

## Prompt store

**The problem.** Prompts are code. A one-word change in a prompt can change quality a lot. If prompts are strings scattered inside application code, you cannot see which prompt version produced a bad answer, cannot roll back quickly, and cannot A/B test two versions.

**The block.** A **prompt store** (also called a **prompt registry**) keeps prompt templates with names and versions, like a small database or a folder in Git. The app asks for `support_agent@v7` and fills in the variables.

```yaml
name: support_agent
version: 7
model: claude-sonnet-5-5
max_tokens: 400
template: |
  You are a support assistant for an online store.
  Follow the policy inside <policy> tags. Never promise a refund above the policy limit.
  <policy>{policy_text}</policy>
  Customer order data: <order>{order_json}</order>
eval_score: 0.91        # score on the golden set when this version was approved
```

Good practice:

- Every log line stores the prompt name and version, so you can trace a bad answer back.
- A new version is promoted only after it passes the evaluation set in CI. See [CI/CD and Testing for AI](/interview/ai-engineer/mlops-deployment/ci-cd-and-testing-for-ai).
- Rolling out a new version to 5% of traffic first is a **canary release**.
- Keep the stable part of the prompt (instructions, policy) at the start and the changing part (user question) at the end. This makes **prompt caching** work (see caches below).

## Vector database

**The problem.** You want to find the document chunks whose meaning is closest to a user's question, out of millions, in a few milliseconds.

**The block.** An **embedding** is a list of numbers (a vector) that represents the meaning of a text; similar meanings give nearby vectors. A **vector database** stores millions of embeddings and finds the nearest ones to a query vector. Exact search over millions is too slow, so it uses **ANN** (approximate nearest neighbour) indexes such as **HNSW** (a layered graph you walk towards the query) that are very fast and miss a small % of true neighbours. Full explanation: [Embeddings and Semantic Search](/interview/ai-engineer/llms-genai/embeddings-and-semantic-search) and [Vector Databases](/interview/ai-engineer/llms-genai/vector-databases).

What matters in design:

| Question | Typical answer |
|---|---|
| How big is the index? | vectors × dimensions × 4 bytes. 10M chunks × 1,024 dims × 4 B ≈ 41 GB, plus index overhead |
| Does it fit in RAM? | HNSW wants RAM. Use int8 quantization (1 byte per number, 4× smaller) or disk-based indexes if not |
| Do we need filters? | Almost always: by user permissions, language, date, tenant. Choose a DB with fast **metadata filtering** |
| Keyword search too? | Product codes, error codes and names need keyword search (BM25). Use **hybrid search**. See [Advanced RAG](/interview/ai-engineer/llms-genai/advanced-rag) |
| How fresh? | Upserts through an ingestion queue; new documents searchable in minutes |
| Which product? | pgvector if you already run Postgres and have under tens of millions of vectors; a dedicated vector DB (Qdrant, Pinecone, Milvus, etc.) for larger scale or heavy filtering |

> **Common mistake:** Forgetting permissions. If the vector DB returns a chunk from the HR salary sheet to an intern, the LLM will happily summarise it. Filter by access rights inside the search, not after the answer is written.

## Caches

Caching in AI systems happens at several layers. The general ideas (cache-aside, TTL, eviction, invalidation) are in [Caching](/interview/system-design/caching). Here are the AI-specific layers.

| Cache | Key | What it saves | Risk |
|---|---|---|---|
| Exact response cache | Hash of (prompt version + full input) | Whole model call | Low; only helps with exact repeats |
| Semantic cache | Embedding of the question; hit if similarity ≥ threshold | Whole model call | Wrong answer for a similar-looking but different question |
| Provider prompt caching | Same long prefix (system prompt, documents) | Input token cost and prefill time | Only works if the prefix is byte-for-byte the same |
| KV cache (inside a model server) | Tokens already processed | Recomputing attention for earlier tokens | Uses GPU memory |
| Embedding cache | Hash of text chunk | Re-embedding unchanged documents | Low |
| Retrieval cache | Normalised query | Vector search + reranking | Stale when documents change |

**Provider prompt caching** deserves a sentence of its own. If many requests begin with the same 2,000-token system prompt, the provider can store the processed prefix. Later requests that start with exactly that prefix are charged a lower price for those tokens (for example around 10% of the normal input price, depending on provider) and their first token arrives sooner. Keep stable content first and variable content last to get this benefit.

A **semantic cache** compares meanings, not exact strings. Here is a tiny version with a toy embedding, so you can see both the benefit and the danger.

```python
import numpy as np

VOCAB = ["leave", "policy", "how", "many", "days", "casual", "sick", "laptop", "reset", "password"]

def embed(text):
    # Toy embedding: word counts over a tiny vocabulary, then normalise.
    words = text.lower().replace("?", "").split()
    v = np.array([words.count(w) for w in VOCAB], dtype=float)
    return v / (np.linalg.norm(v) or 1.0)

class SemanticCache:
    def __init__(self, threshold=0.9):
        self.threshold = threshold
        self.vectors, self.answers = [], []

    def get(self, question):
        if not self.vectors:
            return None
        q = embed(question)
        sims = np.array(self.vectors) @ q          # cosine, since all are unit length
        best = int(np.argmax(sims))
        print(f"best similarity = {sims[best]:.2f}")
        return self.answers[best] if sims[best] >= self.threshold else None

    def put(self, question, answer):
        self.vectors.append(embed(question))
        self.answers.append(answer)

cache = SemanticCache(threshold=0.9)
cache.put("How many casual leave days?", "12 casual leave days per year.")
print(cache.get("how many days of casual leave"))   # same meaning, other words
print(cache.get("how many sick leave days"))        # different meaning
```

```text
best similarity = 1.00
12 casual leave days per year.
best similarity = 0.80
None
```

The second question shares 4 of its 5 words with the cached one and scores 0.80, yet asks about a different kind of leave. With a threshold of 0.75 the user would get the casual-leave answer for a sick-leave question. Real embeddings behave better than this toy, but the danger is the same. So semantic caches need a high threshold, should be scoped per user or per tenant when answers are personal, and must be cleared when the source documents change.

> **Interview tip:** When you add a semantic cache, say the risk in the same breath: "semantic cache with a strict threshold, only for non-personal questions, invalidated on document updates." Interviewers often ask "what can go wrong with it?"

## Queues and async workers

Some AI work is too slow or too bursty for the request path: embedding 10,000 uploaded pages, transcribing a one-hour meeting, generating a weekly report. Put a job on a **queue**, let **workers** process it, and tell the user when it is done (polling, webhook or notification). The basics (at-least-once delivery, idempotency, dead-letter queues) are in [Queues and Streams](/interview/system-design/queues-and-streams).

AI-specific reasons to use a queue:

- **Smoothing bursts against rate limits.** Providers limit requests and tokens per minute. A queue lets workers pull at the allowed speed instead of failing at a spike.
- **Batch APIs.** Many providers offer a batch mode that is much cheaper (often about half price) and returns results within hours. Perfect for offline jobs.
- **GPU utilisation.** Self-hosted models are most efficient when requests arrive in steady batches.
- **Retries without user impact.** A failed job is retried by the worker; the user never sees it.

## Feature store

This block appears in classical ML systems (recommendations, fraud, ranking) more than in LLM apps.

**The problem.** A model needs inputs like "number of orders by this user in the last 7 days". At training time you compute it from historical data in a data warehouse. At serving time you need the same value in under 10 ms. If the two computations differ even slightly, the model sees different inputs in production than in training. This is called **training-serving skew**, and it silently ruins accuracy.

**The block.** A **feature store** defines each feature once and serves it two ways:

- an **offline store** (warehouse tables) for training, with **point-in-time correct** values — the value as it was at the moment of each past event, so no future data leaks into training;
- an **online store** (a key-value store like Redis) for low-latency lookups at serving time.

| | Offline store | Online store |
|---|---|---|
| Used for | Training, batch scoring | Real-time predictions |
| Storage | Data warehouse, files | Key-value store, in memory |
| Latency | Seconds to minutes | 1–10 ms |
| Data | Full history | Only the latest value per key |

## Guardrails

**Guardrails** are checks around the model. They exist because the model can be tricked, can be wrong, and can produce text that breaks your rules. Put them in three places.

| Where | Checks | Example |
|---|---|---|
| Input | Moderation (abuse, self-harm), prompt-injection detection, PII redaction, topic limits | Block "write malware"; mask a card number before logging |
| Output | Schema validation (valid JSON?), grounding check (is every claim in the sources?), toxicity, PII leak, policy rules | Reject an answer that promises a ₹10,000 refund when policy limit is ₹2,000 |
| Actions (agents) | Allow-list of tools, argument limits, human approval for risky actions | Refunds above ₹2,000 need a human click |

Guardrails cost latency. A small classifier adds tens of milliseconds; an extra LLM call adds hundreds. Run cheap checks always, expensive checks only when needed, and run independent checks **in parallel** with the main call when possible. Details: [Safety, Guardrails and Prompt Injection](/interview/ai-engineer/llms-genai/safety-guardrails-and-prompt-injection).

> **Remember:** Guardrails reduce risk; they do not remove it. The strongest protection for actions is **least privilege**: give the model only the tools and permissions it truly needs, so even a tricked model cannot do much harm.

## Evaluation and monitoring

You cannot improve what you cannot see. For every request, store a **trace**: the user input, the prompt version, retrieved chunks, every model call with tokens and latency, tool calls, guardrail results, the final answer, and user feedback. Tools like Langfuse, LangSmith or OpenTelemetry-based tracing do this. See [Monitoring, Cost and Caching](/interview/ai-engineer/mlops-deployment/monitoring-cost-and-caching).

Watch four groups of metrics:

| Group | Metrics |
|---|---|
| Quality | Thumbs up rate, escalation rate, LLM-judge score on sampled traffic, task success |
| Latency | Time to first token p50/p95, total time p95, per-step latency |
| Cost | Tokens per request, cost per request, cost per user, cache hit rate |
| Safety | Guardrail block rate, injection attempts, PII detections |

Offline, the **golden dataset** is run on every change to prompts, models or retrieval, and the change is blocked if scores drop. Online, compare versions with A/B tests. Monthly, refresh the golden set with real failures found in traces. Evaluation methods are in [Evaluating LLM Apps](/interview/ai-engineer/llms-genai/evaluating-llm-apps).

## Model serving (when you self-host)

If you run open models yourself, you need a **model server** such as vLLM or TGI. It loads the model onto GPUs, uses **continuous batching** (adds new requests to the running batch at every step, so the GPU stays busy) and manages the KV cache. You autoscale the number of GPU replicas with traffic. GPU memory math and serving options are in [Serving Models](/interview/ai-engineer/mlops-deployment/serving-models). In an interview, say why you self-host (privacy, cost at high volume, latency control, custom fine-tuned model) because it adds a lot of operations work.

## Orchestration and agent runtime

For multi-step flows (retrieve, then call a tool, then answer), the app server needs **orchestration** logic: the order of steps, state between steps, timeouts, and limits on loops. For simple flows, plain code is best. For agents with branches and human approval steps, a framework like LangGraph can help. Always set a **maximum number of steps** and a **token budget** per request so an agent cannot loop forever. See [AI Agents](/interview/ai-engineer/llms-genai/ai-agents) and [Tool Calling](/interview/ai-engineer/llms-genai/tool-calling).

## Which blocks each case study uses

| Block | Doc chatbot (04) | Support agent (05) | Recommendations (06) | Code assistant (07) | Moderation (08) |
|---|---|---|---|---|---|
| LLM gateway / router | Yes | Yes | Optional | Yes | Yes |
| Prompt store | Yes | Yes | No | Yes | Yes (policy prompts) |
| Vector DB | Yes (core) | Yes (help articles) | Yes (candidate retrieval) | Yes (code index) | Optional (similar past cases) |
| Semantic / response cache | Yes | Limited (personal data) | Precomputed results | Prefix/KV cache | Hash match cache |
| Queue + workers | Ingestion | Ticket handoff | Training, logging | Repo indexing | Review queue |
| Feature store | No | No | Yes (core) | No | Yes (user signals) |
| Guardrails | Permissions, grounding | Action limits | Business rules | Secret filter, sandbox | It is the guardrail |
| Eval & monitoring | Yes | Yes | Yes | Yes | Yes |

## Key terms

| Term | Simple meaning |
|---|---|
| Orchestrator | The app logic that runs the steps of a request in order |
| LLM gateway | One internal service that all model calls pass through |
| Model router | Part of the gateway that chooses which model serves a request |
| Fallback | Using another model when the first one fails |
| Escalation | Sending a request to a bigger model or a human when a check fails |
| Backoff | Waiting longer after each failed retry |
| Prompt store / registry | Versioned storage of prompt templates |
| Canary release | Rolling a new version to a small % of traffic first |
| Embedding | A vector of numbers that represents meaning |
| Vector database | Stores embeddings and finds nearest neighbours fast |
| ANN | Approximate nearest neighbour search; fast, rarely misses |
| HNSW | A graph-based ANN index |
| Metadata filtering | Restricting vector search by fields like permissions or date |
| Hybrid search | Combining keyword (BM25) and vector search |
| Semantic cache | Cache that matches questions by meaning |
| Prompt caching | Provider stores a repeated prompt prefix to cut cost and time |
| KV cache | Stored attention values for earlier tokens inside a model server |
| Batch API | Cheaper, slower provider mode for offline jobs |
| Feature store | System serving the same features to training and serving |
| Training-serving skew | Features computed differently in training and production |
| Point-in-time correct | Using feature values as they were at each past event |
| Guardrails | Checks on inputs, outputs and actions of a model |
| Least privilege | Give a component only the permissions it needs |
| Trace | Full record of every step of one request |
| Continuous batching | Model server adds requests to the running batch each step |

## Interview questions

**Why put an LLM gateway in front of model providers?**
It centralises everything every team would otherwise rebuild: API keys, retries, fallback across models or providers, quotas per team, PII redaction, logging and cost tracking, and routing. It also lets you switch providers or models in one place without changing every service. The cost is one more network hop of a few milliseconds and a service you must keep highly available.

**How would you design a fallback strategy for an LLM call?**
Retry temporary errors (429, 5xx, timeouts) with exponential backoff and a small number of attempts, then fall back to another model, possibly from another provider. Set a total time budget so the user is not waiting forever, and if everything fails return a clear message or a degraded answer (for example, search results without an AI summary). Fallback models should be evaluated on the golden set too, so quality does not silently drop.

**What is a semantic cache and when is it dangerous?**
It stores past answers keyed by question embeddings and returns a stored answer when a new question is similar enough. It saves full model calls for FAQ-style traffic. It is dangerous when two questions look similar but differ in an important detail (casual vs sick leave), when answers are personal (my order, my salary), or when the source data changes. Use a strict threshold, scope it per tenant or user, and invalidate on updates.

**What is the difference between prompt caching and a response cache?**
A response cache skips the model call entirely and returns a saved answer. Prompt caching still calls the model and generates a fresh answer, but the provider reuses the processed long prefix, so those input tokens are cheaper and the first token comes sooner. Prompt caching is safe for personal questions; response caching is not.

**What is training-serving skew and how does a feature store prevent it?**
It happens when a feature is computed one way for training (for example in SQL over the warehouse) and another way in production code, so the model sees different inputs live. A feature store defines each feature once and serves the same logic to the offline store for training and the online store for serving, with point-in-time correctness for historical values.

**Where do you put guardrails and what do they cost?**
On inputs (moderation, injection detection, PII redaction), on outputs (schema checks, grounding, toxicity, policy rules) and on actions (tool allow-lists, limits, human approval). Each check adds latency: classifiers tens of milliseconds, LLM-based checks hundreds. I run cheap checks always, run independent checks in parallel with generation, and save expensive checks for risky cases.

**Why version prompts?**
Prompts change model behaviour as much as code changes do. Versioning lets me tie every logged answer to the exact prompt, run new versions through the evaluation set before release, canary them on a small % of traffic, and roll back in seconds if something goes wrong.

**How do you choose between pgvector and a dedicated vector database?**
If the team already runs Postgres and the index is up to a few million or tens of millions of vectors, pgvector keeps operations simple and lets me join with normal tables for permissions. For larger indexes, very high QPS, heavy metadata filtering or features like built-in hybrid search and sharding, a dedicated vector database is easier to scale. I would decide based on vector count, filter needs and team skills.

**What would you log for every LLM request?**
A request id, user or tenant id, prompt name and version, model, input and output token counts, cost, latency per step, retrieved document ids, tool calls, guardrail decisions, the final answer and later user feedback. Sensitive text may be redacted or stored with limited access. This trace is what lets me debug a bad answer and build new evaluation examples.

**When would you add a queue to an AI system?**
When work is slow, bursty or not needed immediately: document ingestion, long transcriptions, batch summarisation, sending jobs to a cheaper batch API, or smoothing traffic under provider rate limits. The user gets a job id and a notification instead of waiting on an open request.

## Try it yourself

1. **Size an index.** You have 3 million chunks with 768-dimension float32 embeddings. How much memory do the raw vectors need? What if you store them as int8? *Hint: vectors × dims × bytes per number.*
2. **Add a TTL and invalidation.** Extend the `SemanticCache` class so each entry stores the time it was added and the source document id, and add a method `invalidate(doc_id)`. *Hint: store tuples or small dicts instead of bare answers.*
3. **Pick the blocks.** For "an AI that writes product descriptions for new sellers' listings on an e-commerce site", list which building blocks you need and which you skip, with one reason each. *Hint: is a user waiting?*
4. **Sort the errors.** Which of these should the gateway retry: 400 bad request, 401 unauthorised, 429 rate limited, 500 server error, 529/503 overloaded, timeout? *Hint: will the same request work a second later?*

### Answers

1. 3,000,000 × 768 × 4 bytes = 9,216,000,000 bytes ≈ 9.2 GB in float32. In int8: 3,000,000 × 768 × 1 = 2,304,000,000 bytes ≈ 2.3 GB. The HNSW graph adds more on top.
2. One way:

```python
import time

class SemanticCacheWithTTL(SemanticCache):
    def __init__(self, threshold=0.9, ttl_seconds=86_400):
        super().__init__(threshold)
        self.ttl = ttl_seconds
        self.meta = []                                   # (added_at, doc_id) per entry

    def put(self, question, answer, doc_id):
        super().put(question, answer)
        self.meta.append((time.time(), doc_id))

    def get(self, question):
        now = time.time()
        keep = [i for i, (t, _) in enumerate(self.meta) if now - t < self.ttl]
        self._keep(keep)                                 # drop expired entries
        return super().get(question)

    def invalidate(self, doc_id):
        keep = [i for i, (_, d) in enumerate(self.meta) if d != doc_id]
        self._keep(keep)

    def _keep(self, idx):
        self.vectors = [self.vectors[i] for i in idx]
        self.answers = [self.answers[i] for i in idx]
        self.meta = [self.meta[i] for i in idx]
```

3. Needed: queue + async workers (the seller does not wait; use a batch API to save cost), LLM gateway (keys, cost tracking), prompt store (versioned description prompt), output guardrails (no false claims, no banned words, length limits), evaluation (sample of descriptions reviewed by humans, seller edit rate). Skip: vector DB (no retrieval needed unless you add "similar products" examples), semantic cache (each product is different), feature store (no trained model).
4. Retry 429, 500, 503/529 and timeouts (temporary). Do not retry 400 (the request itself is wrong) or 401 (the key is wrong); fix them instead.

**Next:** [Latency, Cost and Scale](/interview/ai-engineer/ai-system-design/latency-cost-and-scale)
