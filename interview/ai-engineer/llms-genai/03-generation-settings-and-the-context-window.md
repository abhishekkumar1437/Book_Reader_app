---
title: Generation Settings and the Context Window
part: How LLMs Work
summary: Logits and softmax over the vocabulary, greedy decoding vs sampling, temperature with worked numbers, top-k, top-p, penalties, max tokens and stop sequences, then the context window, the KV cache, and long-context trade-offs.
---

Every LLM API has knobs like `temperature`, `top_p`, `max_tokens` and `stop`. Every model also has a **context window** limit. Engineers who don't understand these get random-looking bugs: answers cut off in the middle, JSON that is different every time, a chatbot that "forgets" the start of a conversation, or a bill that doubles. This chapter explains exactly what each setting does to the numbers inside the model.

> **In simple words:** The model gives a score to every possible next token. Softmax turns the scores into probabilities. Settings like temperature, top-k and top-p change *how we pick* a token from those probabilities. The context window is the total number of tokens (your input plus the model's output) the model can handle in one call.

## Logits and softmax

At each step, the last layer of the model outputs one raw number for every token in the vocabulary. These raw numbers are called **logits**. A logit can be any real number: 4.0, −2.3, 0.0. Higher means "more likely".

To turn logits into probabilities (positive numbers that add up to 1), we use the **softmax** function:

<div class="formula">

| Formula | Meaning |
|---|---|
| pᵢ = e^(zᵢ) ÷ Σⱼ e^(zⱼ) | probability of token i from logit zᵢ |
| pᵢ = e^(zᵢ / T) ÷ Σⱼ e^(zⱼ / T) | softmax with temperature T |
| T → 0 | all probability goes to the top token (greedy) |
| T = 1 | the model's own distribution |
| T > 1 | flatter, more random |

</div>

### Worked example: softmax at T = 1

Prompt: `My favourite cricket player is`. Suppose the model's vocabulary had only four tokens (a real one has about 100,000), with these logits:

| Token | Logit z | e^z |
|---|---|---|
| ` Virat` | 4.0 | 54.598 |
| ` Sachin` | 2.0 | 7.389 |
| ` Dhoni` | 1.0 | 2.718 |
| ` Rohit` | 0.0 | 1.000 |
| **Sum** | | **65.705** |

Divide each e^z by the sum:

- Virat: 54.598 ÷ 65.705 = **0.831**
- Sachin: 7.389 ÷ 65.705 = **0.112**
- Dhoni: 2.718 ÷ 65.705 = **0.041**
- Rohit: 1.000 ÷ 65.705 = **0.015**

They add up to 1 (0.831 + 0.112 + 0.041 + 0.015 = 0.999, the last digit is rounding). Notice that a logit difference of 2 (4.0 vs 2.0) became a probability ratio of about 7.4×, because e² ≈ 7.39. Softmax exaggerates differences.

## Greedy decoding vs sampling

Once we have probabilities, we must **pick** one token. There are two families of methods.

**Greedy decoding**: always pick the most likely token (here, ` Virat`). It is predictable, but on long texts it often becomes boring and repetitive, and it can get stuck in loops ("I think that I think that I think...").

**Sampling**: pick a token at random, **weighted** by the probabilities. ` Virat` is chosen 83.1% of the time, ` Sachin` 11.2%, and so on. This gives variety and more natural text.

A third classic method is **beam search**: keep the top few partial sentences (the "beams") at each step and finally return the sequence with the highest total probability. It was popular for translation models; chat LLMs rarely use it because it produces bland text and is slower.

| Method | Output | Good for |
|---|---|---|
| Greedy (or temperature 0) | nearly the same every time | extraction, classification, JSON, tests |
| Sampling, moderate temperature | varied but sensible | chat, writing, brainstorming |
| Beam search | highest-probability sequence | older translation and summarization models |

## Temperature

**Temperature** (T) divides every logit before softmax. A small T makes big logits even bigger compared to small ones, so the top token wins more often. A large T shrinks the differences, so less likely tokens get a fair chance.

### Worked example: the same logits at T = 0.5 and T = 2

**T = 0.5** (divide logits by 0.5, which doubles them):

| Token | z / T | e^(z/T) | Probability |
|---|---|---|---|
| Virat | 8.0 | 2980.958 | 2980.958 ÷ 3043.945 = **0.979** |
| Sachin | 4.0 | 54.598 | **0.018** |
| Dhoni | 2.0 | 7.389 | **0.002** |
| Rohit | 0.0 | 1.000 | **0.0003** |
| Sum | | 3043.945 | |

**T = 2** (divide logits by 2, which halves them):

| Token | z / T | e^(z/T) | Probability |
|---|---|---|---|
| Virat | 2.0 | 7.389 | 7.389 ÷ 12.756 = **0.579** |
| Sachin | 1.0 | 2.718 | **0.213** |
| Dhoni | 0.5 | 1.649 | **0.129** |
| Rohit | 0.0 | 1.000 | **0.078** |
| Sum | | 12.756 | |

<figure>
<svg viewBox="0 0 440 200" width="440" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<text x="220" y="18" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">Bars left to right: Virat, Sachin, Dhoni, Rohit</text>
<line x1="20" y1="160" x2="430" y2="160" />
<rect x="30" y="42.5" width="22" height="117.5" fill="var(--accent)" stroke="none" />
<rect x="58" y="157.8" width="22" height="2.2" fill="currentColor" stroke="none" />
<rect x="86" y="159" width="22" height="1" fill="currentColor" stroke="none" />
<rect x="114" y="159" width="22" height="1" fill="currentColor" stroke="none" />
<text x="41" y="37" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">0.98</text>
<rect x="170" y="60.3" width="22" height="99.7" fill="var(--accent)" stroke="none" />
<rect x="198" y="146.5" width="22" height="13.5" fill="currentColor" stroke="none" />
<rect x="226" y="155" width="22" height="5" fill="currentColor" stroke="none" />
<rect x="254" y="158.2" width="22" height="1.8" fill="currentColor" stroke="none" />
<text x="181" y="55" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">0.83</text>
<rect x="310" y="90.5" width="22" height="69.5" fill="var(--accent)" stroke="none" />
<rect x="338" y="134.4" width="22" height="25.6" fill="currentColor" stroke="none" />
<rect x="366" y="144.5" width="22" height="15.5" fill="currentColor" stroke="none" />
<rect x="394" y="150.6" width="22" height="9.4" fill="currentColor" stroke="none" />
<text x="321" y="85" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">0.58</text>
<text x="83" y="180" text-anchor="middle" fill="currentColor" stroke="none" font-size="12">T = 0.5</text>
<text x="223" y="180" text-anchor="middle" fill="currentColor" stroke="none" font-size="12">T = 1</text>
<text x="363" y="180" text-anchor="middle" fill="currentColor" stroke="none" font-size="12">T = 2</text>
</svg>
<figcaption>Low temperature makes the distribution sharp (almost always Virat); high temperature flattens it.</figcaption>
</figure>

| Temperature | P(Virat) | Behaviour | Typical use |
|---|---|---|---|
| 0 | 1.0 | greedy, (nearly) deterministic | extraction, classification, code, JSON |
| 0.2 – 0.5 | very high | focused, small variation | factual Q&A, RAG answers |
| 0.7 – 1.0 | 0.83 at T = 1 | natural, varied | chat, writing |
| 1.2 – 2 | 0.58 at T = 2 | creative, risk of nonsense | brainstorming, story ideas |

You can check these numbers with NumPy:

```python
import numpy as np

logits = np.array([4.0, 2.0, 1.0, 0.0])        # Virat, Sachin, Dhoni, Rohit

def softmax(z, T=1.0):
    z = z / T
    e = np.exp(z - z.max())                    # subtract max for numerical stability
    return e / e.sum()

for T in [0.5, 1.0, 2.0]:
    print(T, softmax(logits, T).round(4))
# Output:
# 0.5 [0.9793 0.0179 0.0024 0.0003]
# 1.0 [0.831  0.1125 0.0414 0.0152]
# 2.0 [0.5793 0.2131 0.1293 0.0784]
```

> **Common mistake:** Believing temperature 0 is perfectly deterministic. On hosted APIs you can still get small differences between runs, because GPUs batch your request with others and floating-point additions in a different order give tiny differences that can flip a close choice. If you need exact repeatability, cache the output.

> **Remember:** Temperature does not make a model smarter or more factual. It only changes how much randomness is used when picking from the same probabilities.

## Top-k and top-p

Even at a normal temperature, the long tail of thousands of unlikely tokens adds up. Picking one of them now and then can derail an answer ("The capital of India is **banana**"). Two filters cut the tail before sampling.

### Top-k

**Top-k sampling** keeps only the k most likely tokens, sets the rest to zero, and renormalizes (divides by the new sum so they add to 1 again).

Worked example with k = 2 on our T = 1 probabilities:

1. Keep Virat (0.831) and Sachin (0.1125). Drop Dhoni and Rohit.
2. New sum = 0.831 + 0.1125 = 0.9435.
3. Renormalize: Virat = 0.831 ÷ 0.9435 = **0.881**, Sachin = 0.1125 ÷ 0.9435 = **0.119**.

The weakness of top-k: k is fixed. When the model is very sure, k = 50 still allows 49 bad options. When it is unsure (many good options), k = 50 may cut good ones.

### Top-p (nucleus sampling)

**Top-p sampling** (also called **nucleus sampling**) keeps the smallest set of top tokens whose probabilities add up to at least p. The size of the set changes with the model's confidence.

Worked example. Prompt: `Tomorrow I will go to the`. Probabilities after softmax:

| Rank | Token | Probability | Running total |
|---|---|---|---|
| 1 | ` market` | 0.50 | 0.50 |
| 2 | ` office` | 0.20 | 0.70 |
| 3 | ` temple` | 0.12 | 0.82 |
| 4 | ` station` | 0.08 | **0.90** |
| 5 | ` gym` | 0.06 | 0.96 |
| 6 | ` moon` | 0.04 | 1.00 |

With **top-p = 0.85**:

1. Add tokens from the top until the running total reaches 0.85. After 3 tokens it is 0.82 (not enough); after 4 it is 0.90 (enough). Keep market, office, temple, station.
2. Drop gym and moon.
3. Renormalize by 0.90: market 0.50 ÷ 0.90 = **0.556**, office **0.222**, temple **0.133**, station **0.089**.

If the model were very sure (say market = 0.95), top-p = 0.85 would keep **only one** token. That adaptive behaviour is why top-p is more common than top-k.

**Min-p** is a newer filter, popular in open-source tools: keep tokens whose probability is at least some fraction (for example 0.1) of the top token's probability.

| Filter | Keeps | Adapts to confidence? |
|---|---|---|
| Top-k | the k most likely tokens | no |
| Top-p | smallest set with total ≥ p | yes |
| Min-p | tokens with p ≥ min_p × p_max | yes |

The order inside most libraries is: logits → temperature → top-k / top-p filter → renormalize → sample. Here is a complete sampler:

```python
import numpy as np

rng = np.random.default_rng(seed=42)

def sample(logits, T=1.0, top_k=None, top_p=None):
    if T == 0:                                   # greedy
        return int(np.argmax(logits))
    z = logits / T
    p = np.exp(z - z.max()); p /= p.sum()        # softmax
    order = np.argsort(p)[::-1]                  # token ids, most likely first
    keep = order
    if top_k is not None:
        keep = keep[:top_k]
    if top_p is not None:
        cum = np.cumsum(p[keep])
        cutoff = np.searchsorted(cum, top_p) + 1 # first index where total >= top_p
        keep = keep[:cutoff]
    q = np.zeros_like(p); q[keep] = p[keep]
    q /= q.sum()                                 # renormalize
    return int(rng.choice(len(q), p=q))

probs = np.array([0.50, 0.20, 0.12, 0.08, 0.06, 0.04])
logits = np.log(probs)                           # logits whose softmax gives these probs
print([sample(logits, T=1.0, top_p=0.85) for _ in range(10)])
# Output: ten token ids, all in {0, 1, 2, 3}; ids 4 and 5 are never picked
```

> **Interview tip:** A common question is "temperature vs top-p, which should I change?". Good answer: "Usually change one, not both. Temperature reshapes the whole distribution; top-p cuts the unreliable tail. For factual or structured tasks I use low temperature; for creative tasks a moderate temperature with top-p around 0.9 to 0.95."

## Other settings

| Setting | What it does | Typical value |
|---|---|---|
| `max_tokens` (also `max_output_tokens`, `max_completion_tokens`, `num_predict`) | hard limit on output tokens | enough for the longest valid answer |
| `stop` / `stop_sequences` | stop when this text is generated | `"\n\n"`, `"</answer>"`, `"User:"` |
| `frequency_penalty` | lowers a token's logit more each time it repeats | 0 to 1 |
| `presence_penalty` | lowers a token's logit once it has appeared at all | 0 to 1 |
| `repetition_penalty` (open models) | divides logits of tokens already used | 1.05 to 1.2 |
| `seed` | fixes the random generator for repeatability (best effort) | any integer |

### Max tokens and truncation

`max_tokens` is a **ceiling**, not a target. The model does not try to fill it. But if the answer needs more tokens, generation simply stops in the middle of a sentence, or in the middle of a JSON object. The API tells you this happened: Anthropic returns `stop_reason == "max_tokens"`, OpenAI returns `finish_reason == "length"`. Always check it.

> **Common mistake:** Setting `max_tokens=200` "to save money" on a structured-output task, then getting broken JSON. You pay only for tokens actually generated, so a generous limit costs nothing extra on short answers. Control length with instructions, and use `max_tokens` as a safety limit.

### Stop sequences

A **stop sequence** is a string that ends generation as soon as the model writes it. It is useful when the model writes in a pattern, for example few-shot prompts with `Q:`/`A:` lines, so it doesn't start inventing the next question.

```python
import anthropic

client = anthropic.Anthropic()
resp = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=1024,
    stop_sequences=["</answer>"],            # stop as soon as this appears
    messages=[{"role": "user",
               "content": "Answer inside <answer></answer> tags: what is 12 × 8?"}],
)
print(resp.stop_reason)                      # "stop_sequence" if the tag was produced
print(next(b.text for b in resp.content if b.type == "text"))
```

### Which models accept sampling settings?

This changes fast, so check each provider's docs. As of 2026:

- **Open models** (Llama, Qwen, Mistral, Gemma) through Ollama, vLLM or Hugging Face accept temperature, top-p, top-k, min-p and penalties.
- Many **reasoning models** from OpenAI and recent **Claude** models do **not** accept custom `temperature` / `top_p` (they return an error or ignore them). You control them through an **effort** or reasoning setting instead, and sampling is fixed by the provider.

Here is how you set the sampling knobs on a local open model with Ollama:

```python
import ollama                                # pip install ollama; Ollama app must be running

resp = ollama.chat(
    model="llama3.2",                        # any model you have pulled
    messages=[{"role": "user", "content": "Give me one name for a chai shop."}],
    options={
        "temperature": 1.0,
        "top_p": 0.9,
        "top_k": 40,
        "num_predict": 30,                   # Ollama's name for max output tokens
        "stop": ["\n"],
        "seed": 7,                           # same seed + same settings -> same output locally
    },
)
print(resp["message"]["content"])
```

## The context window

The **context window** is the maximum number of tokens a model can look at in one request. It includes **everything**: the system prompt, tool definitions, retrieved documents, the full chat history, your new message, **and** the output (including any thinking tokens).

> **Real-life example:** It is like the whiteboard in a classroom. The teacher (model) can only use what is written on the board right now. When the board is full, something must be erased before writing more. Anything erased is gone; the teacher does not remember it.

As of 2026, typical context windows range from about 128K tokens to 1M tokens or more for frontier models. Small local models often run with 4K to 32K because memory is limited. The numbers keep growing, so don't memorize them; know how to plan within them.

### Worked example: a token budget for a RAG chatbot

Model context: 200,000 tokens. You want to reserve room for the answer.

| Part | Tokens |
|---|---|
| System prompt (rules, persona, format) | 1,500 |
| Tool definitions | 2,000 |
| Retrieved chunks: 8 chunks × 500 tokens | 4,000 |
| Chat history (last 10 turns) | 6,000 |
| New user question | 100 |
| **Input total** | **13,600** |
| Reserved for output (`max_tokens`) | 4,000 |
| **Total needed** | **17,600** |

This fits easily in 200K. But it is still 13,600 input tokens **on every turn**, which drives cost and latency. Fitting in the window and being affordable are two different questions.

### The API is stateless: you send the history every time

Chat APIs do not remember earlier calls. To continue a conversation, you resend all the previous messages. So the input grows each turn, and eventually you must manage it:

| Strategy | How | Trade-off |
|---|---|---|
| Sliding window | keep only the last N turns | forgets old details |
| Summarize old turns | replace old turns with a short summary | summary may lose facts |
| Retrieve memory | store old turns in a vector DB, retrieve relevant ones | more moving parts |
| Server-side compaction / caching | provider features that summarize or cache the prefix | provider-specific |

## The KV cache

During decoding, each new token must attend to all earlier tokens (see [Attention Step by Step](/interview/ai-engineer/nlp-transformers/attention-step-by-step)). Attention needs the **key** (K) and **value** (V) vectors of every earlier token at every layer. Recomputing them for all earlier tokens at every step would be very wasteful. So the model stores them in GPU memory after computing them once. This store is called the **KV cache**.

Effects you should know:

- It makes decoding fast: each step computes K and V only for the **new** token.
- It uses a lot of GPU memory, and it grows linearly with context length and with the number of users served at once.
- It is the reason long contexts are expensive to serve.

### Worked example: KV cache size

Take a model shaped like an 8B Llama-style model: 32 layers, 8 key-value heads (it uses **grouped-query attention**, where several query heads share one K/V head to save memory), head dimension 128, stored in fp16 (2 bytes).

<div class="formula">

| Formula | Meaning |
|---|---|
| KV bytes per token = 2 × layers × kv_heads × head_dim × bytes | the first 2 is for K and V |
| KV cache = bytes per token × tokens × concurrent requests | total memory |

</div>

1. Per token: 2 × 32 × 8 × 128 × 2 = 131,072 bytes = **128 KB**.
2. One request with 8,192 tokens: 131,072 × 8,192 = 1,073,741,824 bytes = **1 GB**.
3. One request with 128,000 tokens: about **15.6 GB**, more than the 16 GB of weights of the model itself.
4. 20 users at once with 8K tokens each: about **20 GB** of KV cache.

This is why serving engines like vLLM manage KV cache memory carefully (PagedAttention), and why providers charge more, or slow down, for very long prompts.

### Prompt (prefix) caching

If many requests start with the same long text (the same system prompt, the same document), the provider can keep that prefix's processed state and reuse it. This is called **prompt caching** or **prefix caching**. Cached input tokens are billed at a large discount and the time to first token drops. To benefit, put stable content **first** and changing content (the user question, timestamps) **last**. Details are in [Using LLM APIs](/interview/ai-engineer/llms-genai/using-llm-apis).

## Long-context trade-offs

A 1M-token window is useful, but "just put everything in the prompt" is rarely the best design.

| Issue | Explanation |
|---|---|
| Cost | You pay for every input token on every call. 500K tokens × 1,000 questions is a lot of money. |
| Latency | Prefill time grows with prompt length; time to first token can become many seconds. |
| Attention cost | Standard attention compares every token with every other token, so compute grows roughly with n² (optimized kernels help, but long is still costly). |
| Lost in the middle | Models tend to use information at the start and end of a long prompt better than information buried in the middle. |
| Distraction | Irrelevant text can pull the answer off topic or into contradictions. |
| Effective vs advertised length | A model may accept 1M tokens but reason well over a smaller part of it. Test on your own data. |

| Use long context when... | Use RAG when... |
|---|---|
| the material fits and you ask many deep questions about **one** document set | the knowledge base is much larger than the window |
| you need the model to see relationships across the whole text | the data changes often |
| volume is low, so cost is acceptable | you need low cost and latency at high volume |
| prompt caching can be used for the repeated document | you need citations to specific chunks and access control |

> **Interview tip:** If asked "why not just use a 1M context model instead of RAG?", mention cost per query, latency, lost-in-the-middle, data freshness and access control, and say the two are combined in practice: retrieve the most relevant material, then use a large window to fit more of it. See [RAG Fundamentals](/interview/ai-engineer/llms-genai/rag-fundamentals).

## Key terms

| Term | Simple meaning |
|---|---|
| Logit | Raw score the model gives each token before softmax |
| Softmax | Function that turns logits into probabilities that sum to 1 |
| Greedy decoding | Always pick the most likely token |
| Sampling | Pick a token at random, weighted by probability |
| Beam search | Keep several best partial sequences and return the best whole one |
| Temperature | Number that divides logits; low = sharp, high = flat |
| Top-k | Keep only the k most likely tokens before sampling |
| Top-p / nucleus sampling | Keep the smallest set of tokens whose probabilities sum to p |
| Min-p | Keep tokens at least a fraction of the top token's probability |
| Renormalize | Divide kept probabilities by their sum so they total 1 |
| Frequency / presence penalty | Lower logits of tokens that already appeared |
| max_tokens | Hard ceiling on the number of output tokens |
| Stop sequence | Text that ends generation when produced |
| Seed | Number that fixes randomness for repeatable output |
| Context window | Max tokens (input + output) per request |
| Stateless API | The server doesn't remember earlier calls; you resend history |
| KV cache | Stored keys and values of earlier tokens, reused at each step |
| Grouped-query attention | Several query heads share one K/V head to shrink the KV cache |
| Prompt / prefix caching | Reusing processed state for a repeated prompt start, at lower cost |
| Lost in the middle | Models use facts in the middle of long prompts less reliably |
| Time to first token (TTFT) | Delay before the first output token appears |

## Interview questions

**What are logits and how do they become probabilities?**
Logits are the raw scores from the model's final layer, one per vocabulary token. Softmax exponentiates each logit and divides by the sum of all exponentials, giving positive probabilities that add to 1. Because of the exponential, a small logit difference becomes a large probability ratio.

**What does temperature do mathematically?**
It divides every logit by T before softmax. T below 1 increases the gaps between logits, so the top token gets more probability; T above 1 shrinks the gaps, so the distribution is flatter and sampling is more random. T approaching 0 becomes greedy decoding.

**Explain top-p sampling with an example.**
Sort tokens by probability and keep the smallest set whose total reaches p, then renormalize and sample from that set. If the probabilities are 0.5, 0.2, 0.12, 0.08, 0.06, 0.04 and p = 0.85, we keep the first four (total 0.90) and renormalize by 0.90. The set is small when the model is confident and larger when it is unsure, which is the advantage over top-k.

**When would you use temperature 0?**
For tasks with one correct answer: classification, information extraction, code generation, and structured JSON output, and also for evaluation runs where you want stable results. Even at temperature 0, hosted APIs may not be perfectly deterministic because of batching and floating-point effects.

**Your JSON output is sometimes cut off. What is the likely cause and fix?**
The output probably hit the max-token limit, so the stop reason is "max_tokens" or "length". Raise the limit to cover the longest valid output, keep the requested content shorter, check the stop reason in code, and use the provider's structured output feature so the format is enforced.

**What is the context window and what counts toward it?**
It is the maximum number of tokens the model can handle in one request. It includes the system prompt, tool definitions, any documents, the full conversation history you resend, the new message, and the generated output including thinking tokens.

**What is the KV cache and why does it matter?**
It stores the key and value vectors for all previous tokens at every layer so each decoding step only computes them for the new token. It makes generation much faster but uses GPU memory proportional to context length and the number of concurrent requests. For long contexts it can be larger than the model weights, which limits how many users a GPU can serve.

**Estimate the KV cache for a 32-layer model with 8 KV heads of dimension 128 in fp16 at 8K tokens.**
Per token it is 2 × 32 × 8 × 128 × 2 bytes = 131,072 bytes, about 128 KB. Times 8,192 tokens gives about 1 GB per request. With 20 concurrent requests that is about 20 GB.

**Why not always use the largest context window instead of RAG?**
Long prompts cost money on every call, increase time to first token, and models can miss information in the middle of very long inputs. RAG keeps the prompt small and relevant, handles data larger than any window, and supports freshness and access control. In practice, teams combine retrieval with a reasonably large window.

**How does a chatbot "remember" earlier messages?**
It doesn't on the server side; the API is stateless. The application resends the conversation history on every call. When history gets long, you trim old turns, summarize them, or store them and retrieve the relevant parts.

**What is prompt caching and how do you design for it?**
The provider reuses the processed state of a prompt prefix that is identical to an earlier request, which cuts input cost and latency for that part. You design for it by putting stable content like the system prompt, tool definitions and long documents first, and putting changing content such as the user's question or the date at the end.

## Try it yourself

1. **Temperature by hand.** Logits [3.0, 1.0, 0.0]. Compute the probabilities at T = 1 and T = 0.5. Hint: e³ = 20.086, e¹ = 2.718, e⁶ = 403.429, e² = 7.389.
2. **Top-p by hand.** Probabilities [0.4, 0.3, 0.15, 0.1, 0.05]. Which tokens survive top-p = 0.8? What are their new probabilities?
3. **Code it.** Extend the NumPy `sample` function with a `min_p` option, and test it on the `market/office/...` example with min_p = 0.2.
4. **KV cache.** A model has 40 layers, 8 KV heads, head dimension 128, fp16. How much KV cache does one 32,000-token request need?

### Answers

1. T = 1: sum = 20.086 + 2.718 + 1 = 23.804 → [0.844, 0.114, 0.042]. T = 0.5 (logits become 6, 2, 0): sum = 403.429 + 7.389 + 1 = 411.818 → [0.980, 0.018, 0.002].
2. Running totals: 0.4, 0.7, 0.85 → keep the first three (0.85 ≥ 0.8). Renormalize by 0.85: [0.471, 0.353, 0.176].
3. Add after the softmax:

```python
if min_p is not None:
    keep = keep[p[keep] >= min_p * p.max()]   # p.max() is 0.50, so threshold is 0.10
```

With min_p = 0.2 the threshold is 0.2 × 0.50 = 0.10, so market (0.50), office (0.20) and temple (0.12) are kept; station (0.08), gym and moon are dropped.

4. Per token: 2 × 40 × 8 × 128 × 2 = 163,840 bytes (160 KB). × 32,000 = 5,242,880,000 bytes ≈ 5.2 GB (about 4.9 GiB).

**Next:** [Using LLM APIs](/interview/ai-engineer/llms-genai/using-llm-apis)
