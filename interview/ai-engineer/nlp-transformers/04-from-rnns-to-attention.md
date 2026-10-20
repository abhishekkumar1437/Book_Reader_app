---
title: From RNNs to Attention
part: The Transformer
summary: How sequence-to-sequence models with RNN encoders and decoders worked, why squeezing a whole sentence into one vector was a bottleneck, and how the attention idea fixed it and led to the Transformer.
---

Before Transformers, the best models for translation, summarization and chatbots were built from **recurrent neural networks (RNNs)**. They had one big weakness: they squeezed a whole input sentence into a single vector. The fix for this weakness — **attention** — turned out to be so powerful that in 2017 researchers dropped the RNN completely and built the Transformer from attention alone. Understanding this history is how you answer the classic interview question "Why did Transformers replace RNNs?"

> **In simple words:** An RNN reads a sentence one word at a time and keeps a running summary. For long sentences, that one summary forgets things. Attention lets the model look back at **every** input word whenever it needs, and decide which ones matter right now.

## A quick reminder: RNNs

A **recurrent neural network (RNN)** processes a sequence one step at a time. At each step it takes the current word's embedding and its own previous **hidden state** (a vector that acts as memory), and produces a new hidden state.

<div class="formula">

| Formula | Meaning |
|---|---|
| hₜ = tanh(W·hₜ₋₁ + U·xₜ + b) | New memory = mix of old memory and current word |
| xₜ | Embedding of word number t |
| hₜ | Hidden state after reading word t |

</div>

Reading "I love chai":

```text
h0 = [0, 0, ...]                  (empty memory)
h1 = f(h0, "I")
h2 = f(h1, "love")
h3 = f(h2, "chai")   ← h3 is a summary of the whole sentence
```

**LSTM** (Long Short-Term Memory) and **GRU** (Gated Recurrent Unit) are improved RNNs. They add **gates** — small learned switches that decide what to keep, forget and output — so memory lasts longer. For details see [Recurrent Networks and LSTM](/interview/ai-engineer/deep-learning/recurrent-networks-and-lstm).

Two problems remain even with LSTMs:

1. **Sequential = slow.** h3 needs h2, which needs h1. You cannot compute step 100 before step 99. GPUs are good at doing thousands of things at once, and RNNs waste that.
2. **Long-range memory is weak.** Information from word 1 must survive through every step to reach word 200. Gradients shrink as they travel back through many steps (the **vanishing gradient** problem), so learning long-range links is hard.

## Sequence-to-sequence (seq2seq)

Many tasks turn one sequence into another sequence of a different length:

- Translation: "I love chai" (3 words) → "मुझे चाय पसंद है" (4 words)
- Summarization: 500 words → 50 words
- Chatbot: question → answer

The **sequence-to-sequence (seq2seq)** model (Sutskever et al., 2014) uses two RNNs:

- The **encoder** reads the input sentence and produces a final hidden state, called the **context vector**.
- The **decoder** starts from the context vector and generates the output one word at a time. Each generated word is fed back as the next input. It stops when it outputs a special end token `<eos>`.

<figure>
<svg viewBox="0 0 440 170" width="440" height="170" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="10" y="60" width="50" height="34" rx="6" /><text x="35" y="81" text-anchor="middle" fill="currentColor" stroke="none">I</text>
<rect x="70" y="60" width="50" height="34" rx="6" /><text x="95" y="81" text-anchor="middle" fill="currentColor" stroke="none">love</text>
<rect x="130" y="60" width="50" height="34" rx="6" /><text x="155" y="81" text-anchor="middle" fill="currentColor" stroke="none">chai</text>
<line x1="60" y1="77" x2="70" y2="77" /><line x1="120" y1="77" x2="130" y2="77" />
<line x1="180" y1="77" x2="205" y2="77" />
<circle cx="220" cy="77" r="15" stroke="var(--accent)" stroke-width="2.5" />
<text x="220" y="81" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">c</text>
<line x1="235" y1="77" x2="255" y2="77" />
<rect x="255" y="60" width="40" height="34" rx="6" /><rect x="300" y="60" width="40" height="34" rx="6" /><rect x="345" y="60" width="40" height="34" rx="6" /><rect x="390" y="60" width="40" height="34" rx="6" />
<text x="275" y="115" text-anchor="middle" fill="currentColor" stroke="none">मुझे</text>
<text x="320" y="115" text-anchor="middle" fill="currentColor" stroke="none">चाय</text>
<text x="365" y="115" text-anchor="middle" fill="currentColor" stroke="none">पसंद</text>
<text x="410" y="115" text-anchor="middle" fill="currentColor" stroke="none">है</text>
<text x="95" y="40" text-anchor="middle" fill="currentColor" stroke="none">encoder RNN</text>
<text x="342" y="40" text-anchor="middle" fill="currentColor" stroke="none">decoder RNN</text>
<text x="220" y="145" text-anchor="middle" fill="var(--accent)" stroke="none">one fixed-size vector = bottleneck</text>
</svg>
<figcaption>Classic seq2seq: everything the decoder knows about the input must pass through one context vector c.</figcaption>
</figure>

### Teacher forcing

During training, the decoder is given the **correct** previous word as input (not its own guess). This is called **teacher forcing**. It makes training faster and more stable. At test time there is no correct word, so the decoder must use its own previous output. The same idea is used to train GPT models today: feed the true text, predict the next token at every position at once.

## The bottleneck problem

The whole input sentence — 3 words or 60 words — must fit into one fixed-size context vector (say, 512 numbers). For short sentences this is fine. For long ones, details get lost. Experiments showed seq2seq translation quality dropped sharply as sentences got longer.

> **Real-life example:** Imagine reading a full page of a textbook once, closing the book, and then translating the page from memory. Short paragraphs are easy. A full page is not. A human translator keeps the book open and looks back at the right sentence while writing each line. Attention gives the model an open book.

## The attention idea (Bahdanau, 2014)

Bahdanau, Cho and Bengio proposed: **keep all the encoder hidden states**, not just the last one. At each decoder step:

1. **Score** each encoder hidden state: how relevant is input word i to the output word I am about to write?
2. Turn scores into **weights** that add up to 1, using **softmax**.
3. Make a **context vector for this step** = weighted sum of all encoder hidden states.
4. Use this fresh context vector (plus the decoder state) to predict the next word.

When writing "चाय", the model puts most weight on "chai". When writing "पसंद", it puts most weight on "love". The weights are learned, not hand-written — no one tells the model which word aligns with which. These weights are called **attention weights**, and plotting them as a grid shows a clean **alignment** between source and target words.

<figure>
<svg viewBox="0 0 420 190" width="420" height="190" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="20" y="130" width="60" height="32" rx="6" /><text x="50" y="150" text-anchor="middle" fill="currentColor" stroke="none">h₁ I</text>
<rect x="100" y="130" width="60" height="32" rx="6" /><text x="130" y="150" text-anchor="middle" fill="currentColor" stroke="none">h₂ love</text>
<rect x="180" y="130" width="60" height="32" rx="6" stroke="var(--accent)" stroke-width="2.5" /><text x="210" y="150" text-anchor="middle" fill="currentColor" stroke="none">h₃ chai</text>
<line x1="50" y1="130" x2="300" y2="60" stroke-dasharray="3 3" />
<line x1="130" y1="130" x2="300" y2="60" stroke-dasharray="3 3" />
<line x1="210" y1="130" x2="300" y2="60" stroke="var(--accent)" stroke-width="3" />
<text x="70" y="105" fill="currentColor" stroke="none" font-size="11">0.05</text>
<text x="160" y="105" fill="currentColor" stroke="none" font-size="11">0.10</text>
<text x="250" y="110" fill="var(--accent)" stroke="none" font-size="11" font-weight="bold">0.85</text>
<rect x="300" y="40" width="100" height="36" rx="8" />
<text x="350" y="62" text-anchor="middle" fill="currentColor" stroke="none">decoder: चाय</text>
<text x="350" y="100" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">context = Σ weightᵢ · hᵢ</text>
</svg>
<figcaption>When producing "चाय", the decoder gives most attention weight to the encoder state of "chai" (illustrative weights).</figcaption>
</figure>

### A small worked example

Encoder hidden states (2 numbers each, to keep it small):

| Input word | Hidden state |
|---|---|
| I | h₁ = [1, 0] |
| love | h₂ = [0, 1] |
| chai | h₃ = [1, 1] |

Current decoder state: s = [2, 0].

We use the simplest score: the **dot product** of s with each hᵢ (this is Luong's "dot" attention, 2015; Bahdanau used a small neural network instead, but the idea is the same).

**Step 1 — scores:**

- s · h₁ = 2×1 + 0×0 = **2**
- s · h₂ = 2×0 + 0×1 = **0**
- s · h₃ = 2×1 + 0×1 = **2**

**Step 2 — softmax** (turn scores into positive weights that add to 1: weightᵢ = e^scoreᵢ ÷ Σ e^score):

- e² = 7.389, e⁰ = 1, e² = 7.389. Sum = 15.778.
- weights = 7.389 ÷ 15.778, 1 ÷ 15.778, 7.389 ÷ 15.778 = **[0.468, 0.063, 0.468]**

Check: 0.468 + 0.063 + 0.468 ≈ 1. Good.

**Step 3 — context vector** = weighted sum:

- 0.468 × [1, 0] + 0.063 × [0, 1] + 0.468 × [1, 1]
- = [0.468, 0] + [0, 0.063] + [0.468, 0.468]
- = **[0.937, 0.532]**

The decoder mostly "looked at" words 1 and 3, and almost ignored word 2. This new vector is different at every decoder step, so there is no single bottleneck.

```python
import numpy as np

H = np.array([[1, 0], [0, 1], [1, 1]], dtype=float)   # encoder states, one per row
s = np.array([2, 0], dtype=float)                      # decoder state

scores = H @ s                                 # dot product with each row
weights = np.exp(scores) / np.exp(scores).sum()   # softmax
context = weights @ H                          # weighted sum of rows

print(scores)               # Output: [2. 0. 2.]
print(weights.round(3))     # Output: [0.468 0.063 0.468]
print(context.round(3))     # Output: [0.937 0.532]
```

> **Remember:** Every attention mechanism, from 2014 to today's LLMs, has the same three steps: **score → softmax → weighted sum**. If you remember this, the Transformer's attention in the next chapter is just a cleaner, more general version.

## From "RNN + attention" to "attention only"

After 2014, the best translation systems were RNN encoder-decoders with attention. But they were still RNNs: still sequential, still slow to train on long text.

In 2017, Vaswani et al. at Google published **"Attention Is All You Need"**. The key ideas:

1. **Drop the recurrence.** No hidden state passed step by step.
2. **Self-attention:** instead of only the decoder attending to the encoder, let every word in a sentence attend to every other word **in the same sentence**. This builds contextual meaning — "bank" looks at "river" or "money".
3. **All positions in parallel.** Because no step waits for the previous step, the whole sentence is processed at once with matrix multiplications — perfect for GPUs.
4. **Add position information separately** (positional encodings), since attention by itself does not know word order.

The result, the **Transformer**, trained faster and translated better. It became the base of BERT (2018), GPT (2018 onwards), T5 (2019) and every modern LLM.

### RNN vs LSTM vs Transformer

| Property | RNN | LSTM / GRU | Transformer |
|---|---|---|---|
| Processes tokens | One at a time | One at a time | All at once (in training) |
| Training speed on GPU | Slow | Slow | Fast (parallel) |
| Long-range dependencies | Poor (vanishing gradients) | Better | Strong (direct link between any two tokens) |
| Path length between word 1 and word n | n steps | n steps | 1 step |
| Cost per layer vs length n | Grows like n | Grows like n | Grows like n² (all pairs) |
| Memory at inference | Small fixed state | Small fixed state | Grows with context (KV cache) |
| Used today for | Rarely | Some small/streaming tasks, time series | Almost all NLP, vision, speech |

> **Interview tip:** When asked "Why did Transformers replace RNNs?", give three reasons: (1) **parallel training** — no step-by-step dependency, so GPUs are used fully and models can be scaled up; (2) **better long-range modelling** — any token connects to any other in one step; (3) **they scale** — more data and parameters keep improving results. Then mention the cost: attention is O(n²) in sequence length.

> **Common mistake:** Saying Transformers have "no sequential step at all". **Training** is parallel across positions. **Generation** (inference) in GPT-style models is still one token at a time, because each new token depends on the previous ones. The KV cache (chapter 6) makes this faster.

## Key terms

| Term | Simple meaning |
|---|---|
| RNN | Network that reads a sequence one step at a time with a memory vector |
| Hidden state | The RNN's memory vector after each step |
| LSTM / GRU | RNNs with gates that keep memory longer |
| Vanishing gradient | Gradients shrink over many steps, so early inputs are hard to learn from |
| Seq2seq | Encoder-decoder model that maps one sequence to another |
| Encoder | Part that reads the input and builds representations |
| Decoder | Part that generates the output one token at a time |
| Context vector | The summary of the input given to the decoder |
| Bottleneck | Forcing all input information through one fixed-size vector |
| Teacher forcing | Feeding the correct previous token during training |
| Attention | Score every input state, softmax, take weighted sum |
| Attention weights | Softmax outputs that say how much each input matters now |
| Alignment | Which input words match which output words |
| Self-attention | Words in one sequence attending to each other |
| Transformer | Model built from attention without recurrence (2017) |

## Interview questions

**What is the bottleneck problem in seq2seq models?**
The encoder compresses the entire input into one fixed-size context vector, and the decoder sees only that. Long inputs lose details, so quality drops as sentences get longer. Attention fixes this by letting the decoder look at all encoder states at every step.

**Explain the attention mechanism in simple terms.**
At each output step, the model scores how relevant each input position is, turns the scores into weights with softmax, and takes a weighted sum of the input representations. That sum is a context vector made fresh for this step. The weights are learned through normal training.

**What is the difference between Bahdanau and Luong attention?**
Bahdanau (additive) attention scores with a small feed-forward network on the decoder and encoder states. Luong (multiplicative) attention uses a dot product or a bilinear form, which is simpler and faster. The Transformer uses a scaled dot product, a cousin of Luong attention.

**Why are RNNs slow to train?**
Each hidden state depends on the previous one, so the time steps must be computed in order. You cannot parallelize across the sequence, so GPUs are under-used. Transformers compute all positions at the same time during training.

**What is teacher forcing?**
During training the decoder receives the true previous token instead of its own prediction. It speeds up and stabilizes training. The downside is a mismatch at test time, when the model must use its own, possibly wrong, outputs (called exposure bias).

**What does "Attention Is All You Need" change compared to RNN + attention?**
It removes recurrence completely and uses self-attention inside both encoder and decoder, plus positional encodings for order. All positions are processed in parallel. This made training much faster and enabled much larger models.

**Do Transformers have any disadvantage compared to RNNs?**
Yes. Self-attention compares every pair of tokens, so compute and memory grow with the square of sequence length. During generation they keep a growing KV cache, while an RNN keeps a small fixed state. This is why research continues on efficient attention and state-space models.

**Is generation in GPT parallel?**
Training is parallel because all target tokens are known. Generation is sequential: each new token is produced after the previous ones, one forward pass per token. Caching keys and values avoids recomputing old tokens.

## Try it yourself

1. Redo the worked attention example with decoder state s = [0, 3]. Compute the scores, softmax weights, and context vector. *Hint: e³ ≈ 20.086.*
2. In the RNN vs Transformer table, the Transformer path length is 1. Explain in one sentence why that helps learning.
3. Write a NumPy function `attend(H, s)` that returns `(weights, context)` and test it with your answer from exercise 1.

### Answers

1. Scores: s·h₁ = 0, s·h₂ = 3, s·h₃ = 3. Exponents: 1, 20.086, 20.086; sum = 41.171. Weights = [0.024, 0.488, 0.488]. Context = 0.024×[1,0] + 0.488×[0,1] + 0.488×[1,1] = [0.512, 0.976].
2. The gradient flows directly between any two tokens through one attention step, instead of through many RNN steps where it can vanish, so long-range relationships are easier to learn.
3. Example:

```python
import numpy as np

def attend(H, s):
    scores = H @ s
    w = np.exp(scores - scores.max())   # subtract max for numerical safety
    w = w / w.sum()
    return w, w @ H

H = np.array([[1, 0], [0, 1], [1, 1]], dtype=float)
w, c = attend(H, np.array([0, 3.0]))
print(w.round(3), c.round(3))   # Output: [0.024 0.488 0.488] [0.512 0.976]
```

**Next:** [Attention Step by Step](/interview/ai-engineer/nlp-transformers/attention-step-by-step)
