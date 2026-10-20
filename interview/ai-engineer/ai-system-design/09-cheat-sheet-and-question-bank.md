---
title: Cheat Sheet and Question Bank
part: Wrap-up
summary: A one-page cheat sheet of the framework, formulas, rules of thumb and checklists, followed by 50 AI system design interview questions with model answers. The most frequently asked are marked with a star.
---

Use this chapter in the last days before an interview. Read the cheat sheet once a day, and practise saying the answers to the starred questions out loud in under two minutes each. Every answer links back to the idea it comes from, so you can revise anything that feels weak.

> **In simple words:** Requirements and numbers first, then the simplest architecture, then evaluation, cost and safety. If you can do the token math and name the evaluation metric for each case, you are ahead of most candidates.

## One-page cheat sheet

### The framework

<div class="formula">

| Step | Minutes | Say out loud |
|---|---|---|
| 1 Requirements | 0–5 | Users, scale, latency, privacy, "what does a wrong answer cost?" |
| 2 Data | 0–5 | What data exists, how fresh, do we have labels? |
| 3 Model choice | 5–10 | Prompt → RAG → tools → fine-tune → self-host; climb only when forced |
| 4 Architecture | 10–22 | Online path and offline path; number the steps |
| 5 Evaluation | 22–38 | Golden set offline, A/B and feedback online, human review |
| 6 Scale and cost | 5–10, 38–45 | Token math, latency budget, caching, routing, batching |
| 7 Safety | 38–45 | Hallucination, injection, leaks, outages, cost blow-ups |

</div>

Full framework: [The AI System Design Framework](/interview/ai-engineer/ai-system-design/the-ai-system-design-framework).

### Formulas

<div class="formula">

| Formula | Use |
|---|---|
| cost per request = (in tokens × in price + out tokens × out price) ÷ 1,000,000 | Prices per million tokens |
| daily cost = requests per day × cost per request | × 30 for a month |
| agent cost = calls per task × cost per call | Count every model call |
| cached cost = cached tokens × in price × discount (example 0.1) | Stable prefix first |
| blended cost = share small × small cost + share large × large cost | Routing |
| cascade cost = small cost + escalation share × large cost | Small model first |
| total latency ≈ TTFT + out tokens ÷ tokens per second | Decode dominates long answers |
| concurrency = arrival rate × latency (Little's law) | Open streams, GPU sequences |
| QPS = requests per day ÷ 86,400 (or ÷ 28,800 for 8 working hours) | Then × 2–3 for peak |
| vector memory = vectors × dimensions × bytes (4 for float32, 1 for int8) | Index sizing |
| GPUs = peak QPS ÷ QPS per GPU (from load test) × headroom | Self-hosting |
| precision = TP ÷ (TP + FP); recall = TP ÷ (TP + FN) | Classifiers, moderation |
| recall@k = questions with a correct item in top k ÷ all questions | Retrieval |
| NDCG = DCG ÷ ideal DCG, DCG = Σ rel ÷ log₂(position + 1) | Ranking |
| pass@k = 1 − C(n−c, k) ÷ C(n, k) | Code generation |

</div>

Worked examples: [Latency, Cost and Scale](/interview/ai-engineer/ai-system-design/latency-cost-and-scale).

### Rules of thumb

<div class="formula">

| Fact | Value |
|---|---|
| 1 token (English) | ≈ 4 characters ≈ 0.75 words |
| 1 page | ≈ 500 tokens |
| Hindi and other Indian scripts | Often several times more tokens than English |
| Output vs input price | Output usually several times more expensive |
| Example prices in this book (not real) | Large $3 / $15, small $1 / $5, embeddings $0.10 per 1M tokens, cached input 10% |
| Batch APIs | Often about half price; results within hours |
| Chat TTFT target | Under 1–2 s, with streaming |
| Autocomplete target | Under about 300 ms end to end |
| Recommendation / ranking target | Under about 200 ms; no LLM per request |
| Typical RAG | Retrieve 20–50, rerank, send 4–8 chunks of 300–600 tokens |
| Golden set size to start | 200–500 reviewed examples |

</div>

### Checklists

**Clarifying questions**

- [ ] Who are the users and how many? Requests per day?
- [ ] What data exists, how fresh must it be, are there labels?
- [ ] Latency expectation: autocomplete, chat, or batch?
- [ ] What does a wrong answer cost? Which errors are unacceptable?
- [ ] Can data go to an external API? PII? Region rules?
- [ ] Which actions can the system take on its own?
- [ ] Languages and channels?
- [ ] Budget per request or per month?

**Architecture**

- [ ] Online path with numbered steps and a latency per step
- [ ] Offline path: ingestion, training, batch jobs, evaluation
- [ ] LLM gateway: keys, retries, fallback, quotas, logging, routing
- [ ] Retrieval with permission filtering, if private data
- [ ] Caches named with their risks
- [ ] Queue for slow or bursty work
- [ ] Fallback when the model or provider fails

**Evaluation**

- [ ] Golden set with real examples, run in CI on every prompt/model change
- [ ] Retrieval metric (recall@k) separate from answer metric (faithfulness)
- [ ] LLM judge checked against human labels
- [ ] Online metric tied to the business goal, plus guard metrics
- [ ] A/B test or canary for rollout
- [ ] Weekly human review of sampled traffic; failures become new test cases

**Safety and reliability**

- [ ] Rules enforced in code, not only in the prompt
- [ ] Least-privilege tools, approvals for risky actions, idempotency keys
- [ ] Untrusted text (documents, tool results, user posts) treated as data
- [ ] Input and output guardrails; PII redaction in logs
- [ ] Step limits, token budgets and per-user quotas
- [ ] Graceful degradation (search results when the LLM is down)

**Cost cutting, in order of safety**

- [ ] Prompt caching for stable prefixes
- [ ] Shorter context: fewer chunks, summarised history, compact tool results
- [ ] Shorter outputs
- [ ] Route easy requests to a small model (prove with evaluation)
- [ ] Response or semantic cache for non-personal repeated questions
- [ ] Batch APIs for anything offline
- [ ] Self-host or fine-tune a small model at very high, steady volume

### The five cases in one table

| Case | Core idea | Hardest deep dive | Key metric |
|---|---|---|---|
| [Document chatbot](/interview/ai-engineer/ai-system-design/case-enterprise-document-chatbot) | RAG with hybrid search and reranking | Permissions and freshness | Recall@k, faithfulness, permission tests |
| [Support agent](/interview/ai-engineer/ai-system-design/case-customer-support-agent) | Bounded tool-calling loop | Action safety in code; handoff | True resolution rate, CSAT |
| [Recommendations](/interview/ai-engineer/ai-system-design/case-recommendation-system) | Candidate generation → ranking → re-ranking | Features, skew, cold start | NDCG offline; orders per user in A/B |
| [Code assistant](/interview/ai-engineer/ai-system-design/case-ai-code-assistant) | Self-hosted small model for completions; large model + code index for chat | Latency and context assembly | Acceptance and retention, pass@k |
| [Content moderation](/interview/ai-engineer/ai-system-design/case-content-moderation) | Cascade: hash → classifier → LLM → human | Thresholds per category | Precision/recall per category, prevalence |

## Question bank

Answers are short on purpose: say them in under two minutes, then expand when the interviewer asks. ⭐ marks the most frequently asked questions.

### Framework and approach

**⭐ 1. How is an AI system design round different from a normal one?**
The core component is probabilistic, so quality must be measured, not assumed. Cost is per token or per GPU hour and is often the biggest bill. Latency is seconds, not milliseconds, so streaming and caching matter. New failure modes appear: hallucination, prompt injection, data leaks through retrieval, and drift. I still use normal building blocks (APIs, caches, queues, databases) for everything around the model.
*Follow-up the interviewer may ask:* "What do you do differently in the first five minutes?" — I ask what a wrong answer costs and whether data can go to an external API, because those two answers shape the whole design.

**⭐ 2. Walk me through your framework.**
Requirements, data, model choice, architecture, evaluation, scale and cost, safety. I spend about 5 minutes on requirements and data, 5 on numbers and a first model choice, 12 on the architecture with online and offline paths, 15 on deep dives including evaluation, and the rest on failure modes and next steps. I announce each step so the interviewer can follow.

**3. When is a question really a classical ML question?**
When it is a prediction on structured data at high volume with millisecond latency: ranking, recommendations, fraud, delivery-time estimation. Then I design around labels, features, a feature store, training pipelines and A/B tests, and use LLMs only offline or at the edges.

**⭐ 4. How do you choose between prompting, RAG, fine-tuning and training your own model?**
Start with prompting a hosted model. Add RAG when the model needs private or fresh knowledge. Add tools when it needs live data or actions. Fine-tune when evaluation shows a consistent gap in format, style or a narrow task that prompting cannot fix, or to make a small model cheap and fast. Train from scratch almost never. See [Fine-tuning, LoRA and QLoRA](/interview/ai-engineer/llms-genai/fine-tuning-lora-and-qlora).
*Follow-up:* "Why not fine-tune on the company documents?" — it cannot respect per-user permissions, goes stale, and cannot cite sources.

**5. How do you decide whether a feature should be online or offline?**
Ask whether a user is waiting. If not, run it as a batch job (summaries, tagging, embeddings), which is cheaper (batch APIs), more reliable (retries) and removes the model from the request path. Precomputing is one of the best cost and latency tools.

**6. What do you write on the board after the clarifying questions?**
Three short lists: functional requirements, non-functional requirements (scale, latency, availability, privacy), and quality requirements (what good means, what errors are unacceptable). I point at them later to justify each decision.

### Building blocks

**⭐ 7. What is an LLM gateway and why use one?**
A single internal service that all model calls go through. It holds keys, retries temporary errors with backoff, falls back to other models or providers, enforces quotas per team, redacts PII, logs tokens and cost, and routes requests to the right model. It lets you change providers in one place. See [Building Blocks of AI Systems](/interview/ai-engineer/ai-system-design/building-blocks-of-ai-systems).

**8. What does a prompt store give you?**
Versioned prompt templates, so every logged answer can be traced to its prompt, new versions are tested on the golden set before release, rolled out as canaries, and rolled back quickly. Prompts are code and need the same discipline.

**⭐ 9. Semantic cache: what is it and what can go wrong?**
It returns a stored answer when a new question's embedding is very similar to a past one. It saves full model calls for FAQ-style traffic. Risks: similar-looking questions with different meanings, personal answers shown to other users, and stale answers after documents change. Use a strict threshold, scope by tenant or permission set, and invalidate on updates.

**10. Prompt caching versus response caching?**
Response caching skips the model and returns a saved answer. Prompt caching still generates a fresh answer, but the provider reuses the processed prefix, so it is cheaper and faster. Prompt caching is safe for personal requests; response caching usually is not.

**11. When do you need a feature store?**
In classical ML systems that need the same features for training and low-latency serving, like recommendations or fraud. It prevents training-serving skew by defining features once, serving them from an online store in milliseconds and from an offline store with point-in-time correctness for training.

**12. How do you size a vector index?**
Vectors × dimensions × bytes per number. 10 million chunks × 1,024 dimensions × 4 bytes ≈ 41 GB, plus index overhead. int8 quantization cuts it to about 10 GB. If it does not fit in memory, quantize, shard, or use a disk-based index. See [Vector Databases](/interview/ai-engineer/llms-genai/vector-databases).

**13. Where do you use a queue in an AI system?**
For slow or bursty work: document ingestion, long transcriptions, batch summarisation, agent tasks, sending jobs to batch APIs, and smoothing traffic under provider rate limits. Workers process jobs with retries; the user gets a job id and a notification. See [Queues and Streams](/interview/system-design/queues-and-streams).

### Cost, latency and scale

**⭐ 14. Estimate the cost of a chatbot with 200,000 questions a day.**
I list input parts: 500-token system prompt, 5 chunks of 400 tokens, 1,000 tokens of history, a 50-token question, so 3,550 input and 300 output tokens. Daily: 710 million input × $3 = $2,130 and 60 million output × $15 = $900, so $3,030 per day or about $90,900 per month at the example large-model prices. Then I show caching, routing and a semantic cache bringing it to about $1,250 per day.
*Follow-up:* "Which number would you check first in production?" — real tokens per request from traces, because history and retrieved context are usually larger than planned.

**⭐ 15. How do you reduce LLM cost without hurting quality?**
Measure where tokens go first. Then: prompt caching, fewer and better chunks, summarised history, shorter answers, routing easy requests to a small model, caching non-personal repeated questions, batch APIs offline, and eventually a fine-tuned small model. Every change must keep the golden-set score.

**⭐ 16. What makes up the latency of an LLM request?**
My own steps (guardrails, embedding, retrieval, reranking), queueing and prefill at the model (grows with input length), which together give time to first token, then decode time: output tokens ÷ tokens per second. For long answers decode dominates, so streaming and shorter answers matter most.

**17. How does streaming help, and what does it complicate?**
Users start reading at the first token, so the product feels fast, and they can stop early. It does not reduce cost or total time. It complicates output guardrails, because text is shown before the full answer is checked; I check in buffered chunks or skip streaming for high-risk features.

**⭐ 18. What is model routing? How do you know it works?**
Sending each request to the cheapest model that handles it well: static rules per feature, a classifier that predicts difficulty, or a cascade that escalates when a check fails. I prove it by labelling a few hundred real requests by difficulty and confirming the small model matches the large one on the routed groups, then A/B testing.

**19. Cascade or classifier router?**
A classifier router decides before generating, so it is fast but can misroute hard requests. A cascade always tries the small model and escalates on a failed check, which protects quality but costs two calls and more latency for escalated requests. If a cheap, reliable answer check exists, a cascade is attractive.

**20. API or self-hosted model?**
API by default: best quality, no operations, zero cost at zero traffic. Self-host when volume is high and steady, data must stay in our network, latency must be tightly controlled, or a fine-tuned small open model is good enough on our evaluation. I show a break-even with GPU cost per hour, measured throughput per GPU and operations effort. See [Serving Models](/interview/ai-engineer/mlops-deployment/serving-models).

**21. What breaks first when traffic grows 10×?**
Usually provider rate limits and cost, not servers. I raise limits early, spread load across regions and providers through the gateway, queue non-urgent work, add routing and caching, and add per-user quotas. For self-hosting, GPU capacity and start-up time; for RAG, vector DB replicas and shards.

**22. How do you use Little's law here?**
Concurrency = arrival rate × latency. LLM requests last seconds, so even 21 requests per second at 5.7 seconds each means about 120 open streams. It sizes connection pools, async workers and, for self-hosting, the number of sequences GPUs must serve together.

### RAG systems

**⭐ 23. Design a chatbot over company documents (short version).**
Connectors push changes to a queue; workers parse, chunk by structure into about 500 tokens with titles, embed and upsert into a hybrid vector-plus-keyword index with ACL groups per chunk. At question time: authenticate, rewrite the question, hybrid search filtered by the user's groups, rerank to about 6 chunks, recheck permissions, and stream a cited answer from a large model. Evaluate recall@k, faithfulness, citations and permission tests in CI. Full case: [Enterprise Document Chatbot](/interview/ai-engineer/ai-system-design/case-enterprise-document-chatbot).
*Follow-up:* "What is the one thing that must never happen?" — showing a user content they are not allowed to see.

**⭐ 24. How do you enforce document permissions in RAG?**
Store allowed group ids on each chunk and filter inside the search (pre-filtering), so forbidden text is never retrieved. Then recheck the final few chunks against the source system's live permissions. Sync permission changes on a fast, separate queue. Never rely on the prompt to enforce access.

**25. Your RAG answers are often wrong. How do you debug?**
Split the problem: check retrieval (is the right chunk in the top k for failing questions?) and generation (given the right chunk, is the answer faithful?). Most failures are retrieval: bad parsing, bad chunking, missing keyword search, no reranker, stale versions. I fix the measured weak stage and add the failing questions to the golden set. See [Advanced RAG](/interview/ai-engineer/llms-genai/advanced-rag).

**26. How do you keep a RAG index fresh?**
Change events from webhooks or frequent polling go to a queue; workers re-index only changed documents with idempotent upserts keyed by document id and chunk number; deletes and permission changes have priority. I track index freshness as a metric.

**27. Why not just use a very long context window?**
Large corpora are far bigger than any context window, and sending huge prompts per question is slow and expensive. Long context also cannot enforce per-user permissions. It is useful for one long document the user picks, as an extra mode.

### Agents

**⭐ 28. Design a customer support agent (short version).**
A conversation service keeps session state and decides whether the AI or a human owns the chat. An orchestrator runs a bounded tool-calling loop: order lookup, tracking, returns, refunds, help search, handoff. Every tool call passes an action guard that takes the customer id from the session, checks ownership and policy in code, limits refund amounts, and uses idempotency keys. Hand off with a summary when asked, when the customer is upset, or for risky actions. Full case: [Customer Support Agent](/interview/ai-engineer/ai-system-design/case-customer-support-agent).

**⭐ 29. How do you make an agent's actions safe?**
The prompt describes policy; code enforces it. Least-privilege, narrow tools; identity from the session, never from the model; ownership and limit checks in each tool; approvals for high-value actions; idempotency keys; per-user rate limits; audit logs; step and token budgets. A tricked model then has little it can do. See [Safety, Guardrails and Prompt Injection](/interview/ai-engineer/llms-genai/safety-guardrails-and-prompt-injection).

**30. When should you not use an agent?**
When the steps are known in advance. A fixed workflow (retrieve, then answer; or classify, then route) is cheaper, faster, easier to test and more predictable. Use agents when the path truly depends on what the model discovers, and even then keep the tool set small. See [AI Agents](/interview/ai-engineer/llms-genai/ai-agents).

**31. How do you evaluate an agent?**
Scripted scenarios from real cases with expected tool calls and outcomes, played by simulated users; tool-call accuracy; a safety suite of injections and edge cases that must pass 100%; and online, task success that accounts for recontacts, plus satisfaction and handoff rates.

**32. Single agent or multi-agent?**
Start with one agent and a clear tool set; it is easier to debug and evaluate. Split into specialists behind a router only when the tool set or instructions grow too large for one prompt, accepting more latency and more failure points. See [Multi-Agent Systems](/interview/ai-engineer/llms-genai/multi-agent-systems).

### Recommendations and classical ML

**⭐ 33. Design a recommendation system (short version).**
A funnel: candidate generation of about 500 items from two-tower ANN retrieval, co-visitation, session and trending sources; a multi-task ranker predicting click and purchase from user, item, cross, context and real-time features; a re-ranker for diversity, business rules and exploration. Events update session features via a stream and train daily models on logged features. Offline recall and NDCG, online A/B tests. Full case: [Recommendation System](/interview/ai-engineer/ai-system-design/case-recommendation-system).

**34. Why a two-tower model for retrieval?**
Item vectors do not depend on the user, so all of them can be computed offline and stored in an ANN index. At request time only the user vector is computed, and nearest-neighbour search finds candidates among millions in milliseconds.

**35. How do you handle cold start?**
New users: regional popularity, onboarding choices, context, and session-based recommendations from the first clicks. New items: content embeddings from text and images so they can be retrieved on day one, plus an exploration budget to collect data.

**36. What is training-serving skew and how do you avoid it?**
Features computed differently in training and production, so the model sees different inputs live. Avoid it with a feature store that defines features once and by logging the exact features at serving time and training on them.

**37. Offline metrics improved but the A/B test did not. Why?**
Logged data only contains items the old system showed, so offline evaluation favours the old system's choices. The metric may also not match the business goal, the effect may be too small for the sample size, or novelty effects may hide it. The A/B test decides.

### Evaluation

**⭐ 38. How do you evaluate an LLM application before launch?**
A golden set of 200–500 real inputs with reviewed answers, covering common cases, edge cases, refusals and safety tests. Score with exact checks where possible and an LLM judge with a rubric otherwise, validated against human labels. Separate retrieval metrics from answer metrics. Run it in CI on every prompt, model or retrieval change. See [Evaluating LLM Apps](/interview/ai-engineer/llms-genai/evaluating-llm-apps).
*Follow-up:* "How do you trust the LLM judge?" — compare its grades with human grades on a sample (for example 100 items) and only use it for trends if agreement is high; humans sign off risky categories.

**⭐ 39. What do you monitor after launch?**
Quality (feedback, escalations, judge scores on sampled traffic), latency (TTFT and total p50/p95 per step), cost (tokens and cost per request and per user, cache hit rate), safety (guardrail blocks, injection attempts), and drift. Every request has a full trace. See [Monitoring, Cost and Caching](/interview/ai-engineer/mlops-deployment/monitoring-cost-and-caching).

**40. How do you roll out a new prompt or model safely?**
Pass the golden set in CI, run in shadow mode or on a small canary share, compare online metrics with the current version, and roll out gradually with automatic rollback on guard-metric drops. See [CI/CD and Testing for AI](/interview/ai-engineer/mlops-deployment/ci-cd-and-testing-for-ai).

**41. Which metric for which case?**
RAG: recall@k, faithfulness, citation accuracy. Agents: task success without recontact, tool accuracy. Recommendations: recall@k, NDCG, then orders or watch time in A/B tests. Code completion: acceptance, retention, pass@k. Moderation: precision and recall per category and language, prevalence, appeal overturn rate.

### Safety and reliability

**⭐ 42. How do you defend against prompt injection in a system design?**
Treat all untrusted text (documents, web pages, tool results, user posts) as data inside clear delimiters; give the model only the tools it needs; enforce rules in code; require approval for risky actions; filter outputs; and monitor. The goal is that even a fully tricked model cannot cause serious harm.

**43. How do you reduce hallucination in a product?**
Ground answers in retrieved sources with citations, instruct and allow the model to say "I don't know", validate citations, add grounding checks for risky topics, use tools for live facts instead of model memory, and measure faithfulness continuously.

**⭐ 44. What happens when the LLM provider goes down?**
The gateway retries temporary errors, then falls back to another model or provider that is also evaluated. If all fail, degrade gracefully: show search results instead of an answer, hand chats to humans, or skip non-essential features like autocomplete. Queue offline work until recovery.

**45. Fail open or fail closed?**
Depends on the harm. Content checks for illegal material fail closed; ordinary posts fail open with later review; autocomplete fails silently; refunds fail closed. Decide per feature before an incident.

**46. How do you stop a runaway agent or script from burning the budget?**
Step limits and token budgets per task, per-user daily quotas and rate limits at the gateway, alerts on cost per user and per hour, and kill switches per feature.

### Short design prompts

**47. Design an AI that summarises customer reviews on product pages.**
Offline batch, not online: a nightly job re-summarises only products with new reviews through a batch API and stores the result; the page just reads it. Prompt asks for claims supported by multiple reviews; evaluate with human-written summaries and an LLM judge for support; filter abuse and personal details. The key insight is that no model runs on the request path.

**⭐ 48. Design a voice assistant for train ticket booking.**
Speech-to-text → LLM agent with tools (search trains, check seats, book, pay) → text-to-speech, streaming at every stage because voice needs the first audio in under a second. Use a fast model for conversation, confirm every booking detail aloud before payment, and enforce payment and booking rules in code. Evaluate with recorded scenarios in several languages and accents; handle noisy audio by asking the user to repeat or confirm.

**49. Design a resume screening assistant for a recruiting team.**
Extract structured fields from resumes with an LLM, match against job requirements with explainable scores, and present ranked shortlists to recruiters who make decisions. The big risks are bias and unfair rejection, so remove protected attributes, audit outcomes across groups, never auto-reject, and keep explanations for each score. Evaluate against past recruiter decisions carefully, since those may contain bias too.

**50. Design semantic search for an e-commerce catalogue.**
Hybrid retrieval (BM25 for brand names, sizes and model numbers; embeddings for meaning and Hinglish queries), filters for price, stock and delivery, and a learning-to-rank model using clicks and orders. Use an LLM offline to enrich product attributes and to rewrite rare queries; keep the online path millisecond-fast. Evaluate with NDCG on labelled queries and A/B tests on search conversion. The typeahead part connects to [Proximity and Typeahead](/interview/system-design/case-proximity-and-typeahead).

## How to practise

1. Pick one case per day in the last week. Set a 45-minute timer and design it on paper without looking, out loud.
2. Do the token math by hand every time, then check it with the formulas above.
3. Compare your design with the case chapter. Write down what you forgot; most people forget evaluation and failure modes.
4. Practise the two-minute summaries of all five cases until they are smooth.
5. Pair this book with the classic [System Design](/interview/system-design) book: AI interviewers often ask one classic deep dive (caching, sharding, queues) inside an AI question.

**Next:** [Explaining Your Projects in Interviews](/interview/ai-engineer/ai-projects/explaining-your-projects-in-interviews)
