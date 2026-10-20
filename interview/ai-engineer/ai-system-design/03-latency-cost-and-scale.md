---
title: Latency, Cost and Scale
part: Framework
summary: Token math, a full cost and latency estimate worked step by step, latency budgets, streaming, batching, model routing, and how to decide between an API and self-hosting.
---

In an AI design round, the interviewer will ask "how much will this cost?" and "how fast is it?" A backend engineer answers with servers and milliseconds. An AI engineer answers with **tokens**: how many go in, how many come out, what each costs, and how long each takes to generate. This chapter teaches you to do that math quickly and correctly on a whiteboard.

> **In simple words:** Cost = requests × tokens × price per token. Latency = time to first token + output tokens × time per token. Almost every optimisation (caching, smaller models, shorter prompts, batching) works by changing one number in these two formulas.

For general estimation habits (powers of ten, seconds per day, storage), read [Estimation](/interview/system-design/estimation) first. This chapter adds the AI parts.

## Tokens: the unit of everything

A **token** is a piece of text the model reads or writes: a word, part of a word, or a punctuation mark. Models are priced, limited and timed in tokens, not in words or characters. How text is split is covered in [Tokenization](/interview/ai-engineer/nlp-transformers/tokenization).

Rules of thumb for English text (they vary by tokenizer, so treat them as estimates):

<div class="formula">

| Rule of thumb | Value |
|---|---|
| 1 token | ≈ 4 characters ≈ 0.75 words |
| 1,000 words | ≈ 1,300 tokens |
| One page of a document (≈ 400 words) | ≈ 500 tokens |
| A short chat question | ≈ 20–60 tokens |
| A one-paragraph answer | ≈ 100–200 tokens |
| Hindi, Tamil and other non-Latin scripts | Often several times more tokens than the same meaning in English |

</div>

The last row matters in India. A bot that answers in Hindi can cost much more per answer than the same bot in English, and is slower too. Measure it with your real tokenizer before quoting numbers.

To count tokens exactly, use the provider's counter instead of guessing:

```python
import anthropic

client = anthropic.Anthropic()
count = client.messages.count_tokens(
    model="claude-sonnet-5-5",
    system="You are an HR assistant. Answer only from the given policy.",
    messages=[{"role": "user", "content": "How many casual leaves do I get per year?"}],
)
print(count.input_tokens)   # exact input tokens for this request
```

### Where the tokens in a request come from

Beginners count only the user's question. The question is usually the smallest part.

| Part | Input or output | Typical size |
|---|---|---|
| System prompt (instructions, rules, persona) | Input | 300–3,000 tokens |
| Few-shot examples | Input | 0–2,000 |
| Tool definitions (for agents) | Input | 100–500 per tool |
| Retrieved context (RAG chunks) | Input | 1,000–8,000 |
| Conversation history | Input | Grows every turn |
| The user's message | Input | 20–200 |
| The answer | Output | 100–1,000 |
| Thinking / reasoning tokens (reasoning models) | Output (billed) | 0 to many thousands |

Two traps:

1. **History grows.** In a chat, every turn re-sends all earlier turns. Turn 10 can cost five times more than turn 1. Fix it by summarising old turns or keeping only the last few.
2. **Agents make many calls.** One user request to an agent may trigger 3–10 model calls (think, call tool, read result, think again). Multiply by the number of calls.

> **Common mistake:** Pricing a chatbot at "50 tokens in, 200 tokens out" because that is the question and answer size. The real input is usually thousands of tokens because of the system prompt, retrieved documents and history.

## The cost formula

Providers charge separately for input and output tokens, and output tokens are usually several times more expensive than input tokens (generating is harder than reading).

<div class="formula">

| Formula | Meaning |
|---|---|
| cost per request = (input tokens × input price + output tokens × output price) ÷ 1,000,000 | Prices are quoted per million tokens |
| daily cost = requests per day × cost per request | Then × 30 for monthly |
| cached input cost = cached tokens × input price × cache discount | Example: cache reads at 10% of the normal input price |
| agent cost per user request = calls per request × cost per call | Count every model call |

</div>

**Example prices used in this book.** Real prices change often and differ by provider, so this book uses round example numbers. They are realistic in order of magnitude, but they are not any provider's real price list. Always check current pricing.

| Example model tier | Input (US$ / 1M tokens) | Output (US$ / 1M tokens) |
|---|---|---|
| Large model (example) | 3.00 | 15.00 |
| Small model (example) | 1.00 | 5.00 |
| Embedding model (example) | 0.10 | — |
| Cached input (example) | 10% of the normal input price | — |

For rupee figures, this book uses an example rate of ₹85 per US$.

## Worked example: cost, scale and latency for a company assistant

The interviewer says: "Design an internal assistant for a large company. Employees ask questions about policies, IT and HR. Estimate cost and latency."

You ask clarifying questions and agree on these assumptions. Write them on the board first; every later number depends on them.

- 50,000 daily active employees, 4 questions each per day.
- RAG design: system prompt 500 tokens, 5 retrieved chunks of 400 tokens, conversation history about 1,000 tokens, the question about 50 tokens.
- Answers about 300 tokens.
- Almost all usage is in 8 working hours. Peak is 3 times the working-hour average.
- Large model at the example prices above.

### Step 1: Requests per day

```text
requests per day = 50,000 users × 4 questions = 200,000 requests
```

### Step 2: Tokens per request

```text
input  = 500 (system) + 5 × 400 (chunks) + 1,000 (history) + 50 (question)
       = 500 + 2,000 + 1,000 + 50
       = 3,550 tokens
output = 300 tokens
```

Notice that the question itself is only 50 of 3,550 input tokens, about 1.4%.

### Step 3: Tokens per day

```text
input tokens per day  = 200,000 × 3,550 = 710,000,000  = 710 million
output tokens per day = 200,000 × 300   =  60,000,000  =  60 million
```

### Step 4: Cost per day on the large model

```text
input cost  = 710 million × $3.00 per million  = $2,130
output cost =  60 million × $15.00 per million = $900
daily cost  = $2,130 + $900                    = $3,030
```

Check per request: $3,030 ÷ 200,000 = $0.01515, about 1.5 cents or ₹1.29 per question.

Output is only 60 ÷ 770 ≈ 8% of the tokens but $900 ÷ $3,030 ≈ 30% of the cost. That is why short answers save money.

### Step 5: Cost per month

```text
monthly cost = $3,030 × 30 = $90,900   (≈ ₹77 lakh at ₹85 per $)
per employee = $90,900 ÷ 50,000 = $1.82 per month
```

Saying "under two dollars per employee per month" helps the interviewer judge if the design is worth it.

### Step 6: Requests per second

```text
working-hour average = 200,000 ÷ (8 hours × 3,600 s) = 200,000 ÷ 28,800 ≈ 6.9 requests/s
peak                 = 3 × 6.9 ≈ 21 requests/s
```

21 requests per second is small for web servers. One or two app servers handle it. The constraint is not CPU; it is the model provider's limits and the cost.

### Step 7: Rate limits

Providers limit **requests per minute (RPM)** and **tokens per minute (TPM)**, often separately for input and output tokens.

```text
peak requests per minute = 21 × 60           = 1,260 RPM
peak input tokens/min    = 1,260 × 3,550     = 4,473,000 ≈ 4.5 million ITPM
peak output tokens/min   = 1,260 × 300       = 378,000 OTPM
```

4.5 million input tokens per minute is above many default account limits. Plan for it: request a higher tier, split traffic across regions or providers through the gateway, and shrink input tokens (next steps). Say this out loud; it shows production experience.

### Step 8: Latency budget

Latency for an LLM answer has two parts. **Time to first token (TTFT)** is how long until the first word appears. It includes your own steps plus the model's **prefill** (reading all input tokens). After that, the model **decodes** (generates) one token at a time; the time per output token is called **TPOT** (time per output token) or inter-token latency.

Assume the large model generates about 60 tokens per second for one request (an example figure; measure your real model).

| Step | Time (example) |
|---|---|
| Network and gateway | 60 ms |
| Input guardrail (small classifier) | 40 ms |
| Embed the question | 30 ms |
| Vector search | 20 ms |
| Rerank top 30 chunks | 80 ms |
| Model queue + prefill of 3,550 tokens | 470 ms |
| **Time to first token** | **700 ms** |
| Decode 300 tokens at 60 tokens/s = 300 ÷ 60 | 5,000 ms |
| **Total time** | **5,700 ms ≈ 5.7 s** |

<figure>
<svg viewBox="0 0 440 110" width="440" height="110" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="10" y="30" width="54" height="34" rx="4" stroke="var(--accent)" />
<text x="37" y="52" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">TTFT</text>
<rect x="64" y="30" width="366" height="34" rx="4" />
<text x="247" y="52" text-anchor="middle" fill="currentColor" stroke="none">Decode: 300 tokens at 60 tokens/s = 5.0 s</text>
<text x="10" y="20" fill="currentColor" stroke="none">0 s</text>
<text x="64" y="20" text-anchor="middle" fill="currentColor" stroke="none">0.7 s</text>
<text x="430" y="20" text-anchor="end" fill="currentColor" stroke="none">5.7 s</text>
<text x="10" y="88" fill="currentColor" stroke="none">Your steps + prefill</text>
<text x="430" y="88" text-anchor="end" fill="currentColor" stroke="none">The user reads while tokens stream in</text>
</svg>
<figcaption>Time to first token is a small slice at the start; generating the answer takes most of the time.</figcaption>
</figure>

5.7 seconds to the full answer feels slow. But with **streaming** (sending tokens to the screen as they are generated), the user starts reading after 0.7 s and reads at about the speed the text appears. So TTFT is the number users feel. Set targets like "TTFT p95 under 1.5 s".

### Step 9: Concurrency

How many requests are in progress at once? Use **Little's law**: items in the system = arrival rate × time each item spends in the system.

```text
concurrent requests = 21 requests/s × 5.7 s ≈ 120 open streams at peak
```

Your app servers must hold about 120 open streaming connections at peak (easy with async code; see [FastAPI for AI Apps](/interview/ai-engineer/mlops-deployment/fastapi-for-ai-apps)). If you self-host the model, the GPUs must serve 120 sequences at once.

### Step 10: Cut the cost

Now improve the numbers one change at a time. Each change targets one term in the formula.

**Change 1 — prompt caching.** The 500-token system prompt is the same in every request. With provider prompt caching, those tokens are charged at 10% of the input price (example).

```text
saving per request = 500 tokens × $3.00 × (1 − 0.10) ÷ 1,000,000 = $0.00135
saving per day     = 200,000 × $0.00135 = $270
large-model cost   = $3,030 − $270 = $2,760 per day   ($0.0138 per request)
```

**Change 2 — model routing.** Suppose evaluation shows that 70% of questions (simple policy look-ups) are answered equally well by the small model. Send those there.

```text
small model per request = (3,550 × $1.00 + 300 × $5.00) ÷ 1,000,000 = $0.00355 + $0.0015 = $0.00505
with prompt caching     = $0.00505 − 500 × $1.00 × 0.9 ÷ 1,000,000 = $0.00505 − $0.00045 = $0.0046
blended per request     = 0.7 × $0.0046 + 0.3 × $0.0138 = $0.00322 + $0.00414 = $0.00736
per day                 = 200,000 × $0.00736 = $1,472
```

**Change 3 — semantic cache.** Many employees ask the same policy questions. Suppose 15% of requests are answered from a semantic cache with no model call.

```text
per day = $1,472 × (1 − 0.15) = $1,251.20
per month = $1,251.20 × 30 ≈ $37,536
```

| Version | Cost per day | Cost per month | Saving vs baseline |
|---|---|---|---|
| Baseline, large model | $3,030 | $90,900 | — |
| + prompt caching | $2,760 | $82,800 | 9% |
| + 70% routed to small model | $1,472 | $44,160 | 51% |
| + 15% semantic cache hits | $1,251 | $37,536 | 59% |

Other levers you can mention: retrieve 3 chunks instead of 5 if evaluation shows no quality loss (saves 800 input tokens per request), summarise history after 4 turns, and ask the model for shorter answers.

> **Interview tip:** Always present the baseline first, then the optimisations as a table. Interviewers like seeing that you know which lever moves which number, and that every lever (routing, fewer chunks) must be checked against the evaluation set before you trust it.

> **Remember:** Every optimisation that removes tokens or uses a smaller model can lower quality. "Cheaper" is only a win if the golden-set score stays the same.

## Latency in more detail

<div class="formula">

| Formula | Meaning |
|---|---|
| total latency ≈ TTFT + output tokens × TPOT | Decode time grows with answer length |
| TTFT ≈ your pre-processing + queue time + prefill time | Prefill grows with input length |
| tokens per second = 1 ÷ TPOT | 60 tokens/s means TPOT ≈ 16.7 ms |
| concurrency = arrival rate × latency (Little's law) | Open requests at once |

</div>

Prefill and decode behave differently. **Prefill** processes all input tokens in parallel, so it is fast per token (thousands per second) but grows with long prompts. **Decode** produces one token after another, so it is slow per token and dominates total time for long answers. That gives you the main latency levers:

| Lever | Effect | Cost |
|---|---|---|
| Stream the output | User sees text after TTFT, not after the full answer | Client must handle a stream |
| Shorter answers (instruction, max_tokens) | Fewer decode steps | Less detail |
| Smaller / faster model | Lower TPOT and TTFT | Possibly lower quality |
| Shorter input (fewer chunks, summarised history) | Faster prefill, lower cost | Possibly missing context |
| Prompt caching | Faster prefill for the cached prefix | Prefix must be stable |
| Run independent steps in parallel | Guardrail and retrieval together, not one after another | More complex code |
| Speculative decoding (self-hosted) | A small draft model guesses tokens, the big one checks them | Extra GPU memory |
| Region close to users | Less network time | Data residency questions |
| Precompute offline | Zero model time on the request path | Only for predictable content |

Users judge speed differently by product. Chat users accept 1–2 s before the first word. Code autocomplete must appear in a few hundred milliseconds or developers keep typing. Voice assistants need the first audio in well under a second. Ask which one you are designing.

### Streaming in code

**Streaming** returns tokens as they are generated, usually over **SSE** (server-sent events, a simple one-way HTTP stream).

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-5-5",
    max_tokens=300,
    messages=[{"role": "user", "content": "Explain UPI in three sentences."}],
) as stream:
    for text in stream.text_stream:      # small pieces of text arrive one by one
        print(text, end="", flush=True)  # in a web app, forward each piece over SSE
    final = stream.get_final_message()
print("\n", final.usage.output_tokens, "output tokens")
```

Streaming does not make the full answer arrive sooner. It makes the wait feel shorter and lets the user stop reading early. It also makes output guardrails harder: you have already shown text before you can check the whole answer. Common fixes are checking in small buffered pieces, or not streaming for high-risk features.

## Batching

**Batching** means processing many requests together. It increases **throughput** (requests or tokens handled per second) and lowers cost, usually at the price of higher latency for each request.

| Kind | Where | How it helps | Trade-off |
|---|---|---|---|
| Provider batch API | Hosted APIs | Often about half the price; results within hours | Not for anything a user waits on |
| Continuous batching | Self-hosted servers (vLLM, TGI) | GPU works on many sequences at once; much higher tokens/s | Each request may get slightly slower under heavy load |
| Micro-batching | Embedding or classifier services | Group requests arriving within a few ms into one GPU call | Adds a few ms of waiting |
| Offline batch jobs | Nightly pipelines | Use cheap off-peak capacity | Results are hours old |

Rule: if nobody is waiting, batch it. Summaries, tagging, embeddings of new documents and evaluation runs are all batch jobs. See [Queues and Streams](/interview/system-design/queues-and-streams) for how workers pull jobs.

## Model routing in more detail

**Model routing** sends each request to the cheapest model that can handle it well. Three common patterns:

| Pattern | How it works | Good for |
|---|---|---|
| Static routing | Fixed rule per feature: autocomplete → small, "deep analysis" → large | Clearly different features |
| Classifier routing | A small fast model or classifier predicts "easy / hard" first | Mixed traffic in one feature |
| Cascade | Try the small model; check the answer (confidence, validation, judge); escalate to the large model if it fails | When a cheap check of answer quality exists |

Cascade worked example with the numbers above. Every request goes to the small model first ($0.00505). Suppose 20% fail the check and go to the large model as well ($0.01515).

```text
cost per request = $0.00505 + 0.20 × $0.01515
                 = $0.00505 + $0.00303
                 = $0.00808
saving vs large only = 1 − 0.00808 ÷ 0.01515 ≈ 47%
```

The 20% that escalate are also slower, because they wait for two models. Cascades trade some p95 latency for cost. A classifier router avoids that double wait but can send hard questions to the small model by mistake.

> **Interview tip:** When you propose routing, say how you will know it works: "I'd label 500 real questions as easy or hard, measure the small model's quality on each group, and only route the groups where its score matches the large model."

## API or self-hosting?

At some volume, running an open model on your own GPUs can be cheaper than an API. The decision is not only about price.

| Factor | Hosted API | Self-hosted open model |
|---|---|---|
| Quality | Usually the strongest models | Good open models, often behind the best hosted ones |
| Start-up effort | Minutes | Weeks: GPUs, serving, autoscaling, monitoring |
| Cost shape | Pay per token; zero at zero traffic | Pay per GPU hour, even when idle |
| Data privacy | Data goes to the provider (check contracts and regions) | Data stays in your network |
| Latency control | Shared infrastructure, some variance | Full control; can tune for low latency |
| Customisation | Limited fine-tuning | Any fine-tuning, LoRA adapters |
| Operations | Provider handles it | Your team is on call |

A break-even estimate, with clearly made-up numbers. Suppose a load test shows one replica of an open model (2 GPUs, example price $2.50 per GPU-hour, so $5 per hour) handles 3 requests per second of our workload at acceptable latency.

```text
replicas for peak  = 21 ÷ 3 = 7, plus 1 spare = 8 replicas
always-on cost     = 8 × $5 × 24 hours = $960 per day
small model API    = $1,010 per day (from Step 10)
```

On paper this is close to the small API model. But traffic is low at night, so autoscaling could cut GPU cost further; on the other hand you must add engineering time for operations, and quality may differ. The honest interview answer is: "Below a few million requests a day, the API is usually simpler and close in cost. Self-hosting wins when volume is very high and steady, when data cannot leave our network, or when we need a fine-tuned small model with tight latency." GPU memory sizing is in [Serving Models](/interview/ai-engineer/mlops-deployment/serving-models).

## Scaling an LLM system

When traffic grows 10×, what breaks first? Usually not your servers.

1. **Provider rate limits.** Raise tiers, spread across regions and providers through the gateway, and queue non-urgent work.
2. **Cost.** Grows linearly with traffic. Routing, caching and shorter prompts are your levers.
3. **Vector database.** Add replicas for read QPS; shard when the index no longer fits one machine. See [Sharding and Consistent Hashing](/interview/system-design/sharding-and-consistent-hashing).
4. **GPU capacity (self-hosted).** Autoscale replicas on queue length or GPU utilisation; GPUs take minutes to start, so keep headroom.
5. **Backpressure.** When the system is overloaded, reject or queue requests early with a clear message rather than letting every request time out. See [Reliability and Scalability Patterns](/interview/system-design/reliability-and-scalability-patterns).

Also set **per-user quotas and budgets** (for example 200 requests per user per day) so one script or a looping agent cannot burn the monthly budget in an hour.

## Key terms

| Term | Simple meaning |
|---|---|
| Token | A piece of text the model reads or writes; the unit of price and speed |
| Input / output tokens | Tokens sent to the model / tokens it generates; output costs more |
| Thinking tokens | Hidden reasoning tokens of reasoning models, billed as output |
| Prompt caching | Reusing a repeated prompt prefix at a lower price and faster prefill |
| RPM / TPM | Requests per minute / tokens per minute limits set by the provider |
| TTFT | Time to first token |
| TPOT | Time per output token after the first |
| Prefill | Model reads all input tokens; fast per token, grows with input |
| Decode | Model generates tokens one by one; dominates long answers |
| Streaming | Sending tokens to the user as they are generated |
| SSE | Server-sent events; one-way HTTP stream used for streaming |
| Little's law | Concurrency = arrival rate × time in system |
| Throughput | Work done per second |
| Batch API | Cheaper, slower provider mode for offline work |
| Continuous batching | Server keeps adding requests into the running GPU batch |
| Model routing | Choosing a model per request |
| Cascade | Small model first, escalate to large if a check fails |
| Speculative decoding | Small model drafts tokens, big model verifies them |
| Backpressure | Rejecting or slowing input when the system is overloaded |
| Break-even | Volume where two options cost the same |

## Interview questions

**How do you estimate the cost of an LLM feature?**
I list every part of the input (system prompt, retrieved context, history, tool definitions, the user message) and the expected output length, then multiply by requests per day and the per-million-token prices for input and output separately. I count every model call when there are agents or multi-step chains. I then show the monthly total and cost per user, and list optimisations with their savings.

**Why are output tokens priced higher than input tokens?**
Input tokens are processed in parallel during prefill, so each one is cheap to compute. Output tokens are generated one at a time, each needing a full pass through the model, and they hold GPU memory for longer. So the provider spends more compute per output token and charges more. It is also why shorter answers save both money and time.

**What is TTFT and why does it matter more than total latency for chat?**
Time to first token is how long the user waits before anything appears. With streaming, the user starts reading at TTFT, so it controls how fast the product feels. Total latency still matters for non-streamed uses, like a JSON result consumed by code, or for agents that chain many calls.

**Your chatbot costs too much. What do you do?**
First I measure where the tokens go using traces. Then I apply levers in order of safety: prompt caching for the stable prefix, trimming history and retrieved chunks, shorter answers, routing easy questions to a small model, a semantic cache for FAQ-style questions, and batch APIs for anything offline. I check every change against the golden evaluation set so cost cuts do not hurt quality.

**How does Little's law help in AI system design?**
It tells me how many requests are in flight at once: arrival rate times latency. LLM requests take seconds, so even modest QPS creates many open connections; 21 requests per second at 5.7 seconds each is about 120 concurrent streams. That sizes my app server connection pools and, if self-hosting, how many sequences the GPUs must serve together.

**When does self-hosting a model make sense?**
When volume is very high and steady enough to keep GPUs busy, when data must not leave our network, when I need a fine-tuned model with tight latency control, or when an open model is good enough on our evaluation set. Otherwise hosted APIs are simpler, have better top quality, and cost nothing when idle. I would show a break-even calculation including operations effort.

**What is the difference between a cascade and a classifier router?**
A classifier router decides the model before generating, using a cheap prediction of difficulty; it is fast but can misroute hard questions. A cascade always tries the small model and escalates if the answer fails a check, so quality is protected, but escalated requests pay for two calls and wait longer.

**How do rate limits affect your design?**
I compute peak RPM and TPM and compare them with the account limits. If I am close, I request higher limits, spread load across regions or providers via the gateway, reduce tokens per request, and queue non-urgent work. I also add per-user quotas and handle 429 errors with backoff and fallback.

**Does streaming reduce cost?**
No. The same tokens are generated and billed. Streaming only improves perceived latency. It can even complicate output guardrails because text is shown before the full answer is checked. If the user stops reading, you can cancel the stream and avoid paying for the remaining tokens.

**What happens to cost in a multi-turn chat?**
Each turn re-sends the conversation history, so input tokens grow every turn and late turns are much more expensive. I cap the history, summarise older turns, and use prompt caching so the repeated part is cheaper.

## Try it yourself

1. **Cost of a summariser.** A news app summarises 20,000 articles a day. Each article is 1,500 tokens, the instruction is 200 tokens, the summary is 150 tokens. Compute the daily cost on the example large and small models, and on the large model through a batch API at half price. *Hint: input = 1,700 tokens.*
2. **Latency.** A model has TTFT 600 ms and generates 80 tokens/s. How long does a 400-token answer take? What if you ask for 150 tokens instead? *Hint: decode time = tokens ÷ speed.*
3. **Agent cost.** A support agent makes 4 model calls per user message. Each call has 3,000 input and 200 output tokens. With the example large model, what is the cost per message, and for 100,000 messages a day? *Hint: compute one call first.*
4. **Code it.** Write a function `estimate(requests, parts, out_tokens, price_in, price_out, cached_tokens=0, cache_discount=0.1)` where `parts` is a dict of input token counts. Check it against Step 4 and Change 1 of the worked example. *Hint: cached tokens pay `price_in × cache_discount`.*

### Answers

1. Input per article = 1,500 + 200 = 1,700. Daily input = 20,000 × 1,700 = 34,000,000 = 34 million. Daily output = 20,000 × 150 = 3,000,000 = 3 million. Large: 34 × $3 + 3 × $15 = $102 + $45 = $147 per day. Small: 34 × $1 + 3 × $5 = $34 + $15 = $49 per day. Large through batch at half price: $147 ÷ 2 = $73.50 per day. Because nobody waits for these summaries, a batch API is the natural choice.
2. 400 tokens: 0.6 + 400 ÷ 80 = 0.6 + 5.0 = 5.6 s. 150 tokens: 0.6 + 150 ÷ 80 = 0.6 + 1.875 = 2.475 s ≈ 2.5 s.
3. One call: (3,000 × $3 + 200 × $15) ÷ 1,000,000 = ($9,000 + $3,000) ÷ 1,000,000 = $0.012. Per message: 4 × $0.012 = $0.048. Per day: 100,000 × $0.048 = $4,800.
4. One way:

```python
def estimate(requests, parts, out_tokens, price_in, price_out,
             cached_tokens=0, cache_discount=0.1):
    in_tokens = sum(parts.values())
    normal = in_tokens - cached_tokens
    per_req = (normal * price_in
               + cached_tokens * price_in * cache_discount
               + out_tokens * price_out) / 1_000_000
    return round(per_req, 6), round(per_req * requests, 2)

parts = {"system": 500, "chunks": 2000, "history": 1000, "question": 50}
print(estimate(200_000, parts, 300, 3.00, 15.00))                     # Step 4
print(estimate(200_000, parts, 300, 3.00, 15.00, cached_tokens=500))  # Change 1
# Output:
# (0.01515, 3030.0)
# (0.0138, 2760.0)
```

**Next:** [Case Study — Enterprise Document Chatbot](/interview/ai-engineer/ai-system-design/case-enterprise-document-chatbot)
