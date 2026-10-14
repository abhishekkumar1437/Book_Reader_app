---
title: How LLMs Work
part: How LLMs Work
summary: Next-token prediction, tokens, parameters, training data, loss and perplexity, scaling laws, emergent abilities, and the real reasons LLMs hallucinate.
---

A large language model (LLM) such as Claude, GPT, Llama or Qwen is the engine inside almost every AI product you will build as an AI engineer. You will not train one from scratch at work, but you must understand what it does inside, because that explains its costs, its speed, its strengths, and its mistakes. Interviewers almost always start the LLM round with "explain how an LLM works", so this chapter gives you a clear answer.

> **In simple words:** An LLM is a very large neural network that has one job: given some text, predict the next small piece of text (a token). It does this again and again, one token at a time, to write whole answers. Everything else (chat, code, reasoning) comes out of doing that one job very well.

## The one job: predict the next token

Your phone keyboard suggests the next word when you type "Happy". It suggests "birthday" because it has seen "Happy birthday" many times. An LLM does the same thing, but with a much bigger memory of patterns and a much deeper understanding of context.

The model reads the text so far and outputs a **probability** for every possible next piece of text. This is called **next-token prediction**, and a model trained this way is called an **autoregressive** model ("auto" = self, "regressive" = depends on earlier values): each new token depends on all the tokens before it, including the ones the model wrote itself.

> **Real-life example:** Think of a cricket commentator who has watched 10,000 matches. When the bowler runs in and the batter steps out, the commentator can guess "...and that's lofted over long-on for SIX!" before it happens. He is not magic; he has seen the pattern many times. An LLM has "watched" trillions of words.

### Tokens, briefly

LLMs do not read letters or whole words. They read **tokens**: small chunks of text, usually a word or part of a word. "unbelievable" might become `un` + `believ` + `able`. Each token has an ID number in the model's **vocabulary** (the fixed list of all tokens it knows, often 32,000 to 260,000 entries).

| Text | Possible tokens | Count |
|---|---|---|
| `I love cricket` | `I` · ` love` · ` cricket` | 3 |
| `unbelievable` | `un` · `believ` · `able` | 3 |
| `₹2,499` | `₹` · `2` · `,` · `499` | 4 |

A useful rule for English: **1 token ≈ 4 characters ≈ 0.75 words**, so 1,000 words is roughly 1,300 tokens. Hindi, Tamil and other non-Latin scripts usually need more tokens for the same meaning. Tokenization is taught in detail in [Tokenization](/interview/nlp-transformers/tokenization).

> **Remember:** Cost, speed and the context limit of an LLM are all measured in tokens, not words or characters.

## The generation loop

Writing an answer is a loop. The model predicts a probability for each token in the vocabulary, one token is picked, it is added to the text, and the whole thing runs again.

<figure>
<svg viewBox="0 0 440 220" width="440" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<rect x="10" y="30" width="110" height="44" rx="8" />
<text x="65" y="49" text-anchor="middle" fill="currentColor" stroke="none">Tokens so far</text>
<text x="65" y="66" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">"The cat sat"</text>
<line x1="120" y1="52" x2="150" y2="52" />
<polygon points="150,52 142,48 142,56" fill="currentColor" />
<rect x="150" y="22" width="120" height="60" rx="8" />
<text x="210" y="48" text-anchor="middle" fill="currentColor" stroke="none" font-weight="bold">LLM</text>
<text x="210" y="66" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">(Transformer)</text>
<line x1="270" y1="52" x2="300" y2="52" />
<polygon points="300,52 292,48 292,56" fill="currentColor" />
<rect x="300" y="22" width="130" height="60" rx="8" />
<text x="365" y="42" text-anchor="middle" fill="currentColor" stroke="none">Probabilities</text>
<text x="365" y="59" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">on 0.62 · in 0.21</text>
<text x="365" y="74" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">… for every token</text>
<line x1="365" y1="82" x2="365" y2="130" />
<polygon points="365,130 361,122 369,122" fill="currentColor" />
<rect x="300" y="130" width="130" height="44" rx="8" />
<text x="365" y="149" text-anchor="middle" fill="currentColor" stroke="none">Pick one token</text>
<text x="365" y="166" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">"on"</text>
<line x1="300" y1="152" x2="65" y2="152" />
<line x1="65" y1="152" x2="65" y2="74" />
<polygon points="65,74 61,82 69,82" fill="currentColor" />
<text x="182" y="144" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">append "on", run again</text>
<text x="220" y="205" text-anchor="middle" fill="currentColor" stroke="none" font-size="12">Stops at an end-of-text token, a stop sequence, or max tokens</text>
</svg>
<figcaption>Every output token needs one full pass through the model; the picked token is fed back as input.</figcaption>
</figure>

This loop explains three facts that interviewers like:

1. **Output is slower than input.** The model can read all prompt tokens in parallel (this step is called **prefill**), but it must write output tokens one by one (this step is called **decode**). That is why output tokens cost more than input tokens on most APIs.
2. **The model cannot "go back".** Once a token is written, it stays. If an early token is wrong, later tokens build on the mistake.
3. **Randomness comes from the "pick" step.** The model gives probabilities; *how* we pick from them (greedy, temperature, top-p) is a setting. See [Generation Settings and the Context Window](/interview/llms-genai/generation-settings-and-the-context-window).

### Worked example: a tiny "language model" from counts

Real LLMs use neural networks, but the idea of "probability of the next token" can be shown with simple counting. Take this tiny training text of three sentences:

```text
I love cricket . I love chai . I play cricket .
```

Count what comes after each word:

| Previous word | Next word counts | Probabilities |
|---|---|---|
| `I` | love: 2, play: 1 | P(love) = 2/3 ≈ 0.67, P(play) = 1/3 ≈ 0.33 |
| `love` | cricket: 1, chai: 1 | 0.5 each |
| `play` | cricket: 1 | 1.0 |

Now generate from the start word `I`:

1. After `I`, pick the most likely word: `love` (0.67).
2. After `love`, it is a tie: `cricket` and `chai` are both 0.5. Say we pick `chai`.
3. The sentence so far is `I love chai`, which the model never saw as one sentence. It made a **new** sentence from learned patterns.

The probability of the whole sentence `I love chai` (given that it starts with `I`) is P(love | I) × P(chai | love) = 0.67 × 0.5 ≈ 0.33.

This counting model only looks at **one** previous word (it is called a **bigram model**). A real LLM looks at **all** previous tokens, up to hundreds of thousands of them, using the attention mechanism from [Attention Step by Step](/interview/nlp-transformers/attention-step-by-step). That is the big difference.

### See real next-token probabilities

You can look inside a small open model with Hugging Face `transformers`. GPT-2 is old but tiny (124 million parameters) and runs on a laptop CPU.

```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

name = "gpt2"                                   # small model, fine for learning
tok = AutoTokenizer.from_pretrained(name)
model = AutoModelForCausalLM.from_pretrained(name)

text = "The capital of France is"
ids = tok(text, return_tensors="pt").input_ids   # shape: (1, number_of_tokens)

with torch.no_grad():
    logits = model(ids).logits                   # shape: (1, tokens, vocab_size)

next_logits = logits[0, -1]                      # scores for the NEXT token only
probs = torch.softmax(next_logits, dim=-1)       # turn scores into probabilities
top = torch.topk(probs, k=5)

for p, i in zip(top.values, top.indices):
    print(f"{tok.decode(i)!r:12} {p.item():.3f}")
```

The output is five candidate tokens with their probabilities; ` Paris` should be near the top. The exact numbers depend on the model version, so do not memorize them. The important lines are `logits[0, -1]` (only the last position predicts the next token) and `softmax` (turns raw scores into probabilities that add up to 1).

## Parameters: what the model has learned

A neural network is made of many numbers called **weights** (also called **parameters**). During training, these numbers are adjusted so the predictions get better. "Llama 3 8B" means about 8 billion parameters. Frontier models like Claude or GPT are much larger; their exact sizes are usually not published.

Parameters are not a database of facts. They are a compressed set of patterns: grammar, facts, styles, coding habits, and ways of reasoning, all mixed together across billions of numbers.

### Worked example: how much memory does a model need?

Each parameter is stored as a number. In 16-bit format (**fp16** or **bf16**), each number takes 2 bytes.

- 7 billion parameters × 2 bytes = 14 billion bytes ≈ **14 GB** just to load the weights.
- The same model in 4-bit **quantized** form (each number squeezed into half a byte): 7 billion × 0.5 = 3.5 billion bytes ≈ **3.5 GB**. That is why 4-bit models run on laptops.
- A 70 billion parameter model in fp16: 70 × 2 = **140 GB**, which needs two or more large GPUs.

<div class="formula">

| Formula | Meaning |
|---|---|
| Weight memory ≈ parameters × bytes per parameter | fp32 = 4 bytes, fp16/bf16 = 2, int8 = 1, int4 = 0.5 |
| 1 billion params in fp16 ≈ 2 GB | quick mental rule |
| Real usage is higher | add KV cache and activations (see the generation settings chapter) |

</div>

> **Interview tip:** If asked "can we run a 13B model on a 16 GB GPU?", do the math out loud: 13 × 2 = 26 GB in fp16, so no; in 8-bit it is about 13 GB (tight); in 4-bit about 6.5 GB (yes, with room for the KV cache). Showing the calculation impresses more than a yes/no.

## Training data

An LLM learns from huge amounts of text, measured in **trillions of tokens**. Typical sources are:

| Source | What it teaches |
|---|---|
| Web pages (filtered) | general knowledge, many writing styles |
| Books and papers | long, careful reasoning and explanations |
| Code (public repositories) | programming, and also step-by-step logic |
| Wikipedia, reference sites | facts |
| Conversations, Q&A sites | dialogue style |
| Licensed and synthetic data | specific skills, safer and higher-quality examples |

Raw web text is messy, so teams spend a lot of effort on **data cleaning**: removing duplicates (**deduplication**), spam, very low quality pages, and personal information, and balancing languages and topics. Data quality matters as much as data size.

Training data stops at some date. This date is called the **knowledge cutoff**. The model does not know about events after it unless you give that information in the prompt (this is the main idea of RAG; see [RAG Fundamentals](/interview/llms-genai/rag-fundamentals)).

## How the model learns: loss and perplexity

Training shows the model a piece of real text, asks it to predict each next token, and measures how wrong it was. The measure is the **cross-entropy loss**: for each position, take the probability the model gave to the *correct* next token, and compute −log of it. If the model gave the correct token a high probability, the loss is small. If it gave a low probability, the loss is large. Training adjusts the weights (by gradient descent and backpropagation; see [Loss Functions and Backpropagation](/interview/deep-learning/loss-functions-and-backpropagation)) to reduce this loss over trillions of examples.

A related number is **perplexity** = e^(average loss). You can read it as "how many tokens the model is confused between, on average". Lower is better.

### Worked example: loss and perplexity for 3 tokens

The correct next tokens got these probabilities from the model: 0.5, 0.25, 0.8.

| Token | P(correct) | −ln P |
|---|---|---|
| 1 | 0.5 | 0.6931 |
| 2 | 0.25 | 1.3863 |
| 3 | 0.8 | 0.2231 |

- Average loss = (0.6931 + 1.3863 + 0.2231) ÷ 3 = 2.3026 ÷ 3 ≈ **0.768**
- Perplexity = e^0.768 ≈ **2.15**

So, on average, the model is about as unsure as if it were choosing between 2 equally likely tokens. A perfect model (probability 1.0 every time) would have loss 0 and perplexity 1.

> **Common mistake:** Saying "the model is trained to tell the truth". Pretraining only rewards predicting **likely** text, not **true** text. Truthfulness and helpfulness come mostly from later training steps (see [The LLM Training Pipeline](/interview/llms-genai/the-llm-training-pipeline)), and they are never perfect.

## Scaling: why bigger got better

Researchers found that loss goes down in a smooth, predictable way when you increase three things together: **model size** (parameters), **data** (tokens), and **compute** (the total number of calculations, measured in FLOPs). These smooth curves are called **scaling laws**.

An important result from 2022 (the "Chinchilla" paper from DeepMind) was that many earlier models were too big for the data they were trained on. A rough rule from that work is about **20 training tokens per parameter** for compute-efficient training. Since then, teams often train smaller models on **far more** tokens than that, because a smaller model is cheaper to run for millions of users. Training cost is paid once; serving cost is paid on every request.

| Scale (order of magnitude) | Example use |
|---|---|
| 0.5B – 4B parameters | phones, laptops, simple classification and extraction |
| 7B – 14B | good local assistants, fine-tuned task models |
| 30B – 120B | strong open models, need server GPUs |
| Frontier (size usually not published) | Claude, GPT, Gemini: best reasoning, coding and agents |

Since around 2024, a second kind of scaling became important: **test-time compute**. Instead of only making the model bigger, you let it "think" longer by writing hidden reasoning tokens before the answer. These are **reasoning models**, covered in [The LLM Training Pipeline](/interview/llms-genai/the-llm-training-pipeline).

> **Remember:** Bigger models and more data give lower loss, but with diminishing returns. Today, gains also come from better data, post-training, and letting the model think at inference time.

## Emergent abilities and in-context learning

As models grew, they started doing things nobody trained them for directly: translating, writing code, solving word problems, following instructions in a new format. Abilities that appear at larger scale are called **emergent abilities**.

One of the most useful is **in-context learning**: you show a few examples in the prompt, and the model follows the pattern without any weight change.

```text
Convert to formal English.
gonna -> going to
wanna -> want to
dunno ->
```

The model answers `do not know` even though nobody fine-tuned it for this exact task. This is the basis of **few-shot prompting** (see [Prompt Engineering](/interview/llms-genai/prompt-engineering)).

There is a research debate here. Some papers argue that many "sudden jumps" are partly caused by how we measure (an all-or-nothing metric hides smooth progress). A balanced interview answer: "Abilities improve with scale; some look sudden because of the metric, but in practice larger models can do tasks that small ones cannot."

## Why LLMs hallucinate

A **hallucination** is when the model states something false, with confidence, as if it were true: a fake citation, a wrong date, a function that does not exist in a library. It is the number one problem in LLM products, so understand the causes.

| Cause | Explanation | Example |
|---|---|---|
| Trained to be fluent, not true | Pretraining rewards likely-sounding text | invents a believable paper title |
| Knowledge is compressed | Rare facts are stored weakly, so the model fills gaps with patterns | wrong birth year of a minor politician |
| Knowledge cutoff | It does not know recent events | "latest iPhone" from two years ago |
| No built-in "I don't know" | Answering is usually rewarded more than refusing | guesses instead of saying unsure |
| Error builds up | One wrong token early leads to a confident wrong story | wrong step 1 in a math solution |
| Tokens hide letters | It sees `straw` + `berry`, not letters | miscounting the r's in "strawberry" |
| Unclear or false prompt | It goes along with the question's assumption | "Why did India win the 1987 World Cup?" (Australia won) |

How engineers reduce hallucination (no method removes it fully):

- **Ground the answer** in real documents with RAG and ask for citations ([RAG Fundamentals](/interview/llms-genai/rag-fundamentals)).
- **Give tools**: a calculator, a search API, a database query ([Tool Calling](/interview/llms-genai/tool-calling)).
- **Allow "I don't know"** explicitly in the prompt.
- **Use a stronger or reasoning model** for hard questions.
- **Verify** with checks, a second model, or evaluation ([Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps)).
- More in [Safety, Guardrails and Prompt Injection](/interview/llms-genai/safety-guardrails-and-prompt-injection).

> **Interview tip:** When asked "why do LLMs hallucinate?", give the root cause first ("they are trained to produce probable text, not verified text, and facts are compressed into weights"), then two or three fixes from real systems (RAG with citations, tools, allowing abstention, evaluation). Interviewers want to hear that you design around it, not that you expect it to disappear.

## What LLMs are good and bad at

| Good at | Weak at (without help) |
|---|---|
| Writing, summarizing, rewriting, translating | Exact arithmetic on long numbers |
| Code generation and explanation | Counting letters or words exactly |
| Extracting structured data from messy text | Facts after the knowledge cutoff |
| Following a format from examples | Rare, specific facts (IDs, prices, phone numbers) |
| Reasoning in many steps (newer models) | Keeping secrets that are inside its prompt |
| Classifying intent, sentiment, topic | Being consistent across many separate calls |

Most of the weak points are solved in real products by giving the model **tools** and **context**, which is exactly what the rest of this book teaches.

## Key terms

| Term | Simple meaning |
|---|---|
| LLM | A very large neural network trained to predict the next token of text |
| Token | A small chunk of text (word or part of a word) with an ID number |
| Vocabulary | The fixed list of all tokens a model knows |
| Next-token prediction | The training task: guess the next token from the earlier ones |
| Autoregressive | Each new output depends on all earlier outputs |
| Prefill | Reading all prompt tokens at once, in parallel |
| Decode | Writing output tokens one by one |
| Bigram model | A toy model that uses only one previous word |
| Parameters / weights | The learned numbers inside the network |
| fp16 / bf16 | 16-bit number formats, 2 bytes per parameter |
| Quantization | Storing weights with fewer bits (8-bit, 4-bit) to save memory |
| Knowledge cutoff | The date after which the model has no training data |
| Cross-entropy loss | −log of the probability given to the correct token, averaged |
| Perplexity | e^(average loss); lower means less confused |
| Scaling laws | Smooth curves showing loss falls as size, data and compute grow |
| Test-time compute | Letting the model think longer at answer time to improve results |
| Emergent ability | A skill that appears only in larger models |
| In-context learning | Learning a pattern from examples in the prompt, without training |
| Hallucination | A confident but false statement made by the model |

## Interview questions

**Explain how an LLM generates text, in simple terms.**
An LLM is a Transformer network trained to predict the next token. When generating, it reads the prompt, outputs a probability for every token in its vocabulary, one token is picked by a sampling rule, and that token is appended to the input. This repeats until it produces an end token, hits a stop sequence, or reaches the max token limit. So a long answer is just many single-token predictions in a loop.

**Why are output tokens usually priced higher than input tokens?**
Input tokens are processed in parallel in one forward pass (prefill), which uses the GPU efficiently. Output tokens must be generated one at a time, each needing its own forward pass (decode), so they use more GPU time per token. Providers price this difference in.

**What is a token and why does it matter for engineering?**
A token is a chunk of text from the model's vocabulary, often part of a word. Cost, latency, rate limits and the context window are all counted in tokens. For English, one token is about four characters, but other languages and code can use more, so you should always measure with the real tokenizer.

**What does "7B parameters" mean, and how much GPU memory does it need?**
It means the network has about 7 billion learned weights. In fp16 each weight is 2 bytes, so about 14 GB just for the weights, plus extra for the KV cache and activations. With 4-bit quantization it drops to about 3.5 GB.

**What is perplexity?**
Perplexity is e raised to the average cross-entropy loss on some text. It tells you how many tokens the model is, on average, choosing between. A lower value means the model predicts the text better. It is useful for comparing language models on the same data, but it does not directly measure helpfulness or truth.

**Why do LLMs hallucinate? How do you reduce it in a product?**
Pretraining rewards text that is likely, not text that is verified, and facts are stored in compressed form, so rare facts get filled in with plausible patterns. The model also has a knowledge cutoff and is often rewarded for answering rather than abstaining. In products we reduce it with RAG and citations, tools for exact data, prompts that allow "I don't know", and evaluation that measures faithfulness.

**What are scaling laws, and what did Chinchilla change?**
Scaling laws show that loss decreases smoothly and predictably as parameters, data and compute increase. Chinchilla showed many models were under-trained for their size and suggested roughly 20 tokens per parameter for compute-optimal training. In practice, modern small models are trained on many more tokens than that because inference cost matters more than training cost.

**What are emergent abilities? Are they real?**
They are abilities, like few-shot learning or multi-step arithmetic, that appear in larger models but not smaller ones. Some research shows the "sudden" jump is partly an effect of all-or-nothing metrics, and with smoother metrics progress looks gradual. Either way, larger and better-trained models can do tasks smaller ones cannot.

**Why can an LLM fail at counting the letters in a word?**
The model sees tokens, not letters. A word like "strawberry" may be two or three tokens, so the letters are not directly visible to it. Reasoning models or a code tool can fix this by spelling the word out or running code.

**What is the difference between prefill and decode, and why should an engineer care?**
Prefill processes all prompt tokens in parallel and decides the time to first token. Decode generates output tokens one by one and decides how fast the rest of the answer streams. Long prompts increase prefill time and cost; long answers increase decode time. Knowing this helps you design prompts, streaming UIs and latency budgets.

## Try it yourself

1. **Bigram model in Python.** Write a function that takes a list of sentences, counts next-word frequencies, and generates a sentence by always picking the most likely next word. Hint: use `collections.defaultdict(collections.Counter)`.
2. **Memory math.** How much memory do the weights of a 32B model need in bf16, int8 and int4? Hint: multiply by 2, 1 and 0.5 bytes.
3. **Perplexity.** A model gives the correct tokens probabilities 0.9, 0.6, 0.3 and 0.9. Compute the average loss and perplexity. Hint: use natural log.
4. **Look inside GPT-2.** Run the `transformers` snippet above with the text `"I scored 95 marks in my"`. Which tokens come up? Change the text and see how the top-5 list changes.

### Answers

1. One possible solution:

```python
from collections import defaultdict, Counter

def train(sentences):
    counts = defaultdict(Counter)
    for s in sentences:
        words = s.split()
        for a, b in zip(words, words[1:]):   # pairs of neighbours
            counts[a][b] += 1
    return counts

def generate(counts, start, max_words=6):
    out = [start]
    for _ in range(max_words):
        if out[-1] not in counts:
            break
        out.append(counts[out[-1]].most_common(1)[0][0])  # greedy pick
    return " ".join(out)

c = train(["I love cricket .", "I love chai .", "I play cricket ."])
print(generate(c, "I"))   # Output: I love cricket .
```

(`love` is followed by `cricket` and `chai` once each; `most_common` returns the first one seen on a tie, which is `cricket`.)

2. bf16: 32 × 2 = 64 GB. int8: 32 GB. int4: 16 GB.
3. −ln 0.9 = 0.1054, −ln 0.6 = 0.5108, −ln 0.3 = 1.2040, −ln 0.9 = 0.1054. Sum = 1.9256, average ≈ 0.481. Perplexity = e^0.481 ≈ 1.62.
4. You should see tokens like ` exam`, ` class`, ` final` near the top. The point is to see that the model gives a whole probability list, not one answer.

**Next:** [The LLM Training Pipeline](/interview/llms-genai/the-llm-training-pipeline)
