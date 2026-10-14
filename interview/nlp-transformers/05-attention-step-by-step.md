---
title: Attention Step by Step
part: The Transformer
summary: Self-attention computed fully by hand on a 3-word sentence — Query, Key and Value matrices, dot-product scores, scaling by √d, softmax and the weighted sum — plus why we scale, the causal mask, and a NumPy implementation.
---

This is the most important chapter in the book. **Self-attention** is the one operation that makes a Transformer a Transformer, and "explain attention" or "why divide by √d?" is asked in almost every AI engineer interview. We will compute every number by hand on a 3-word sentence, then write the same thing in 15 lines of NumPy.

> **In simple words:** Each word asks a question (its **query**). Every word offers a label describing itself (its **key**) and some content (its **value**). A word compares its query with every key, turns the matches into percentages with softmax, and collects that percentage of each word's value. The result is a new vector for the word that includes information from the words that matter to it.

## Why self-attention exists

Take the sentence: "The animal didn't cross the road because **it** was too tired."

What does "it" mean? The animal, not the road. To build a good vector for "it", the model must pull in information from "animal". In another sentence — "...because **it** was too wide" — "it" means the road.

So the meaning of a word depends on other words in the same sentence. **Self-attention** is a layer where every word looks at every other word in the same sequence and decides how much of each to mix into its own new vector. "Self" means the words attend to their own sequence (not to a different sentence, as in the decoder-to-encoder attention of [the previous chapter](/interview/nlp-transformers/from-rnns-to-attention)).

## Query, Key and Value

Each word's input vector is turned into three different vectors, using three learned weight matrices:

- **Query (q)** — "What am I looking for?"
- **Key (k)** — "What do I contain? Here is my label."
- **Value (v)** — "If you pick me, this is the information I give you."

> **Real-life example:** Searching on YouTube. Your search text is the **query**. Each video's title and tags are its **key**. The video itself is the **value**. YouTube compares your query with every key, ranks the matches, and shows you the values. Attention does a "soft" version: instead of picking only the top video, it takes a weighted mix of all of them, with more weight on better matches.

Why three separate vectors instead of using the word vector directly? Because "what I am looking for" and "what I offer" are different things. The word "it" is *looking for* a noun it refers to; the word "animal" *offers* "I am a living noun". Separate learned matrices let the model learn these roles.

<div class="formula">

| Formula | Meaning |
|---|---|
| Q = X · W_Q | Queries for all words (one row per word) |
| K = X · W_K | Keys for all words |
| V = X · W_V | Values for all words |
| Attention(Q, K, V) = softmax(Q · Kᵀ ÷ √d_k) · V | The whole of self-attention in one line |
| d_k | Size of each query/key vector |

</div>

The four steps:

1. **Scores:** S = Q · Kᵀ. Entry (i, j) = how well word i's query matches word j's key.
2. **Scale:** divide every score by √d_k.
3. **Softmax** each row, so each word's weights are positive and add up to 1.
4. **Weighted sum:** output = weights · V. Row i is word i's new vector.

## The full example by hand

Sentence: **"I love chai"** — 3 tokens. To keep the arithmetic small, each word has a 2-number embedding (d_model = 2) and the query/key/value size is also 2 (d_k = d_v = 2). Real models use 768 to 16,384 numbers, but the steps are identical.

### Step 0 — inputs and weights

Input embeddings X (one row per word):

```text
         x₁  x₂
I     [  1   0 ]
love  [  0   1 ]
chai  [  1   1 ]
```

Learned weight matrices (in a real model these come from training; here we pick small integers):

```text
W_Q = [ 1  0 ]     W_K = [ 0  1 ]     W_V = [ 1  0 ]
      [ 1  1 ]           [ 1  0 ]           [ 0  2 ]
```

### Step 1 — compute Q, K, V

Each row of X times the weight matrix. For a row [a, b] and a 2×2 matrix with rows r₁ and r₂, the result is a·r₁ + b·r₂.

**Queries Q = X · W_Q** (rows of W_Q are [1, 0] and [1, 1]):

- I: 1·[1, 0] + 0·[1, 1] = **[1, 0]**
- love: 0·[1, 0] + 1·[1, 1] = **[1, 1]**
- chai: 1·[1, 0] + 1·[1, 1] = **[2, 1]**

**Keys K = X · W_K** (rows [0, 1] and [1, 0]):

- I: 1·[0, 1] + 0·[1, 0] = **[0, 1]**
- love: 0·[0, 1] + 1·[1, 0] = **[1, 0]**
- chai: 1·[0, 1] + 1·[1, 0] = **[1, 1]**

**Values V = X · W_V** (rows [1, 0] and [0, 2]):

- I: 1·[1, 0] + 0·[0, 2] = **[1, 0]**
- love: 0·[1, 0] + 1·[0, 2] = **[0, 2]**
- chai: 1·[1, 0] + 1·[0, 2] = **[1, 2]**

| Word | q | k | v |
|---|---|---|---|
| I | [1, 0] | [0, 1] | [1, 0] |
| love | [1, 1] | [1, 0] | [0, 2] |
| chai | [2, 1] | [1, 1] | [1, 2] |

### Step 2 — scores S = Q · Kᵀ

Entry (i, j) = qᵢ · kⱼ (dot product). Every word's query against every word's key, including its own.

Row "I" (q = [1, 0]):

- · k_I = [0, 1] → 1×0 + 0×1 = **0**
- · k_love = [1, 0] → 1×1 + 0×0 = **1**
- · k_chai = [1, 1] → 1×1 + 0×1 = **1**

Row "love" (q = [1, 1]):

- · k_I → 1×0 + 1×1 = **1**
- · k_love → 1×1 + 1×0 = **1**
- · k_chai → 1×1 + 1×1 = **2**

Row "chai" (q = [2, 1]):

- · k_I → 2×0 + 1×1 = **1**
- · k_love → 2×1 + 1×0 = **2**
- · k_chai → 2×1 + 1×1 = **3**

```text
               key: I   love  chai
S =  query I    [   0     1     1  ]
     query love [   1     1     2  ]
     query chai [   1     2     3  ]
```

S is n × n (3 × 3): one score for every pair of words. This is why attention cost grows with the **square** of the sequence length.

### Step 3 — scale by √d_k

d_k = 2, so √d_k = √2 ≈ **1.4142**. Divide every score:

- 0 ÷ 1.4142 = **0**
- 1 ÷ 1.4142 = **0.7071**
- 2 ÷ 1.4142 = **1.4142**
- 3 ÷ 1.4142 = **2.1213**

```text
                 I       love    chai
S/√2 =  I    [ 0       0.7071  0.7071 ]
        love [ 0.7071  0.7071  1.4142 ]
        chai [ 0.7071  1.4142  2.1213 ]
```

(Why we scale is explained in the next section.)

### Step 4 — softmax each row

**Softmax** turns a row of numbers into positive weights that add to 1: weightⱼ = e^(scoreⱼ) ÷ Σ e^(score). Bigger scores get bigger weights. See [Activation Functions](/interview/deep-learning/activation-functions) for a refresher.

The exponentials we need: e⁰ = 1, e^0.7071 = **2.0281**, e^1.4142 = **4.1132**, e^2.1213 = **8.3420**.

Row "I": [0, 0.7071, 0.7071]

- exps: [1, 2.0281, 2.0281], sum = 5.0562
- weights: 1 ÷ 5.0562 = **0.198**, 2.0281 ÷ 5.0562 = **0.401**, **0.401**

Row "love": [0.7071, 0.7071, 1.4142]

- exps: [2.0281, 2.0281, 4.1132], sum = 8.1694
- weights: 2.0281 ÷ 8.1694 = **0.248**, **0.248**, 4.1132 ÷ 8.1694 = **0.503**

Row "chai": [0.7071, 1.4142, 2.1213]

- exps: [2.0281, 4.1132, 8.3420], sum = 14.4833
- weights: 2.0281 ÷ 14.4833 = **0.140**, 4.1132 ÷ 14.4833 = **0.284**, 8.3420 ÷ 14.4833 = **0.576**

This is the **attention weight matrix** A (each row adds to 1, small rounding aside):

```text
             I      love   chai
A =  I    [ 0.198  0.401  0.401 ]
     love [ 0.248  0.248  0.503 ]
     chai [ 0.140  0.284  0.576 ]
```

Read row "chai": when building its new vector, "chai" takes 14% from "I", 28% from "love" and 58% from itself.

<figure>
<svg viewBox="0 0 360 200" width="360" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<text x="140" y="22" text-anchor="middle" fill="currentColor" stroke="none">I</text>
<text x="210" y="22" text-anchor="middle" fill="currentColor" stroke="none">love</text>
<text x="280" y="22" text-anchor="middle" fill="currentColor" stroke="none">chai</text>
<text x="210" y="195" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">keys (attended to)</text>
<text x="60" y="64" text-anchor="end" fill="currentColor" stroke="none">I</text>
<text x="60" y="114" text-anchor="end" fill="currentColor" stroke="none">love</text>
<text x="60" y="164" text-anchor="end" fill="currentColor" stroke="none">chai</text>
<text x="20" y="114" fill="currentColor" stroke="none" font-size="11" transform="rotate(-90 20 114)" text-anchor="middle">queries</text>
<rect x="105" y="35" width="70" height="50" fill="var(--accent)" fill-opacity="0.20" />
<rect x="175" y="35" width="70" height="50" fill="var(--accent)" fill-opacity="0.40" />
<rect x="245" y="35" width="70" height="50" fill="var(--accent)" fill-opacity="0.40" />
<rect x="105" y="85" width="70" height="50" fill="var(--accent)" fill-opacity="0.25" />
<rect x="175" y="85" width="70" height="50" fill="var(--accent)" fill-opacity="0.25" />
<rect x="245" y="85" width="70" height="50" fill="var(--accent)" fill-opacity="0.50" />
<rect x="105" y="135" width="70" height="50" fill="var(--accent)" fill-opacity="0.14" />
<rect x="175" y="135" width="70" height="50" fill="var(--accent)" fill-opacity="0.28" />
<rect x="245" y="135" width="70" height="50" fill="var(--accent)" fill-opacity="0.58" />
<text x="140" y="64" text-anchor="middle" fill="currentColor" stroke="none">0.198</text>
<text x="210" y="64" text-anchor="middle" fill="currentColor" stroke="none">0.401</text>
<text x="280" y="64" text-anchor="middle" fill="currentColor" stroke="none">0.401</text>
<text x="140" y="114" text-anchor="middle" fill="currentColor" stroke="none">0.248</text>
<text x="210" y="114" text-anchor="middle" fill="currentColor" stroke="none">0.248</text>
<text x="280" y="114" text-anchor="middle" fill="currentColor" stroke="none">0.503</text>
<text x="140" y="164" text-anchor="middle" fill="currentColor" stroke="none">0.140</text>
<text x="210" y="164" text-anchor="middle" fill="currentColor" stroke="none">0.284</text>
<text x="280" y="164" text-anchor="middle" fill="currentColor" stroke="none">0.576</text>
</svg>
<figcaption>The attention weight matrix: each row is one word's softmax over all words, and each row adds up to 1. Darker = more attention.</figcaption>
</figure>

### Step 5 — weighted sum of values

Output for word i = Σⱼ Aᵢⱼ · vⱼ, with v_I = [1, 0], v_love = [0, 2], v_chai = [1, 2].

**I:** 0.198·[1, 0] + 0.401·[0, 2] + 0.401·[1, 2]
= [0.198, 0] + [0, 0.802] + [0.401, 0.802]
= **[0.599, 1.604]**

**love:** 0.248·[1, 0] + 0.248·[0, 2] + 0.503·[1, 2]
= [0.248, 0] + [0, 0.497] + [0.503, 1.007]
= **[0.752, 1.503]**

**chai:** 0.140·[1, 0] + 0.284·[0, 2] + 0.576·[1, 2]
= [0.140, 0] + [0, 0.568] + [0.576, 1.152]
= **[0.716, 1.720]**

(Products shown with unrounded weights, then rounded to 3 decimals.)

```text
                  out₁    out₂
Output =  I    [ 0.599   1.604 ]
          love [ 0.752   1.503 ]
          chai [ 0.716   1.720 ]
```

Each word now has a new vector that mixes in information from the other words, in proportion to the attention weights. That is **one self-attention layer**. Input shape (3 × 2) = output shape (3 × 2), so layers can be stacked.

> **Remember:** The four steps in order — **QKᵀ → ÷√d_k → softmax (per row) → × V**. Write the formula `softmax(QKᵀ/√d_k)V` from memory; interviewers often ask you to write it on the whiteboard.

## Why divide by √d_k?

This is one of the most frequently asked interview questions. Here is the full answer.

**1. Dot products grow with dimension.** Suppose the numbers in q and k are random with mean 0 and variance 1. Then q · k = q₁k₁ + q₂k₂ + … + q_dk_d is a sum of d terms, each with variance 1. Variances of independent terms add, so **Var(q · k) = d**, and the **standard deviation is √d**. With d = 64, typical scores are around ±8; with d = 512, around ±23.

**2. Big scores make softmax "saturate".** Softmax of large numbers puts almost all the weight on the largest one and almost zero everywhere else. It behaves like a hard max (one-hot).

**3. Saturated softmax kills gradients.** When one weight is ≈ 1 and the rest ≈ 0, the softmax output barely changes when the scores change slightly. The gradient is close to zero, so the model learns very slowly or not at all. (See [Loss Functions and Backpropagation](/interview/deep-learning/loss-functions-and-backpropagation) on vanishing gradients.)

**4. Dividing by √d fixes the scale.** (q · k) ÷ √d has variance d ÷ d = 1, whatever the dimension. Scores stay in a range where softmax is smooth and gradients flow.

### Numbers that show it

Say d_k = 64 and one row of raw scores is [12, 4, 0].

- **Without scaling:** softmax([12, 4, 0]) = **[0.99966, 0.00034, 0.00001]** — almost one-hot.
- **With scaling** (÷ √64 = 8): softmax([1.5, 0.5, 0]) = **[0.629, 0.231, 0.140]** — a smooth distribution that still prefers the best match.

A quick NumPy check of the variance claim (random q and k with variance 1):

```python
import numpy as np

rng = np.random.default_rng(0)
for d in [4, 64, 512]:
    q = rng.normal(size=(100_000, d))
    k = rng.normal(size=(100_000, d))
    s = (q * k).sum(axis=1)                   # 100,000 dot products
    print(d, s.std().round(2), (s / np.sqrt(d)).std().round(3))
```

```text
4 2.01 1.003
64 8.01 1.001
512 22.68 1.002
```

The raw standard deviation is √d (2, 8, 22.6). After dividing by √d, it is 1 every time.

In our tiny example with d = 2, scaling made the "chai" row softer: unscaled softmax([1, 2, 3]) = [0.090, 0.245, 0.665]; scaled = [0.140, 0.284, 0.576].

> **Interview tip:** A complete answer in four sentences: "The dot product of two d-dimensional vectors with unit-variance entries has variance d. Large scores push softmax into a nearly one-hot region where its gradients are almost zero. Dividing by √d brings the variance back to 1, keeping softmax in a smooth region. So training is stable regardless of the head dimension."

> **Common mistake:** Saying "we divide by d" or "by √(sequence length)". It is **√d_k**, the size of the key/query vectors (per head), not the model width and not the number of tokens.

## The causal mask

In GPT-style models (decoders that generate text left to right), a word must **not** look at future words. During training the whole sentence is given at once, so without a rule, "I" could peek at "love" and "chai" — that would be cheating, because at generation time future words do not exist yet.

The **causal mask** (also called the **look-ahead mask**) blocks attention to future positions. Before softmax, we add −∞ to every score where the key comes after the query. e^(−∞) = 0, so those positions get zero weight.

Mask matrix M for 3 tokens (0 = allowed, −∞ = blocked):

```text
             I     love   chai
M =  I    [  0     -∞     -∞  ]
     love [  0      0     -∞  ]
     chai [  0      0      0  ]
```

It is **lower-triangular**: row i can see columns 1 to i. Add M to our scaled scores:

```text
                   I       love    chai
S/√2 + M =  I    [ 0       -∞      -∞     ]
            love [ 0.7071  0.7071  -∞     ]
            chai [ 0.7071  1.4142  2.1213 ]
```

Softmax per row:

- Row "I": only itself → **[1, 0, 0]**
- Row "love": e^0.7071 and e^0.7071 are equal → **[0.5, 0.5, 0]**
- Row "chai": nothing blocked → **[0.140, 0.284, 0.576]** (same as before)

Outputs with the mask:

- I: 1·[1, 0] = **[1, 0]**
- love: 0.5·[1, 0] + 0.5·[0, 2] = **[0.5, 1.0]**
- chai: **[0.716, 1.720]** (unchanged)

The last word's output is the same with or without the mask, because it is allowed to see everything before it anyway.

> **Remember:** In code we use a large negative number like −1e9 (or the dtype's minimum) instead of true −∞, to avoid NaN when a whole row is masked.

A second kind of mask, the **padding mask**, blocks `[PAD]` tokens in a batch (see [Tokenization](/interview/nlp-transformers/tokenization)). It works the same way: −∞ before softmax for key positions that are padding.

## Shapes: what goes where

For a sequence of n tokens, model width d_model, and key/value size d_k, d_v:

| Matrix | Shape | In our example |
|---|---|---|
| X (inputs) | n × d_model | 3 × 2 |
| W_Q, W_K | d_model × d_k | 2 × 2 |
| W_V | d_model × d_v | 2 × 2 |
| Q, K | n × d_k | 3 × 2 |
| V | n × d_v | 3 × 2 |
| Scores QKᵀ, weights A | n × n | 3 × 3 |
| Output A·V | n × d_v | 3 × 2 |

Cost: computing QKᵀ needs about n × n × d_k multiplications. Doubling the context length from 4,000 to 8,000 tokens makes this part **4 times** more expensive. This is the famous **O(n²)** cost of attention.

## NumPy implementation

Here is scaled dot-product attention, with optional mask, in NumPy. It works for one sequence (2-D inputs) and for many heads or batches (3-D or 4-D), because it only uses the last two axes.

```python
import numpy as np

def softmax(x, axis=-1):
    x = x - x.max(axis=axis, keepdims=True)    # subtract max: avoids overflow, same result
    e = np.exp(x)
    return e / e.sum(axis=axis, keepdims=True)

def scaled_dot_product_attention(Q, K, V, mask=None):
    """Q, K: (..., n, d_k), V: (..., n, d_v). mask: True = allowed."""
    d_k = Q.shape[-1]
    scores = Q @ K.swapaxes(-2, -1) / np.sqrt(d_k)   # (..., n, n)
    if mask is not None:
        scores = np.where(mask, scores, -1e9)          # blocked -> huge negative
    weights = softmax(scores, axis=-1)                 # each row sums to 1
    return weights @ V, weights

np.set_printoptions(precision=4, suppress=True)
X   = np.array([[1, 0], [0, 1], [1, 1]], dtype=float)   # I, love, chai
W_Q = np.array([[1, 0], [1, 1]], dtype=float)
W_K = np.array([[0, 1], [1, 0]], dtype=float)
W_V = np.array([[1, 0], [0, 2]], dtype=float)

out, w = scaled_dot_product_attention(X @ W_Q, X @ W_K, X @ W_V)
print(w)
print(out)

causal = np.tril(np.ones((3, 3), dtype=bool))         # lower-triangular = allowed
out_c, w_c = scaled_dot_product_attention(X @ W_Q, X @ W_K, X @ W_V, causal)
print(w_c)
print(out_c)
```

```text
[[0.1978 0.4011 0.4011]
 [0.2483 0.2483 0.5035]
 [0.14   0.284  0.576 ]]
[[0.5989 1.6044]
 [0.7517 1.5035]
 [0.716  1.7199]]
[[1.    0.    0.   ]
 [0.5   0.5   0.   ]
 [0.14  0.284 0.576]]
[[1.     0.    ]
 [0.5    1.    ]
 [0.716  1.7199]]
```

These match our hand calculations (small differences in the 4th decimal are from rounding by hand).

### The same thing in PyTorch

PyTorch 2.x has a built-in, fast version. It uses optimized kernels such as **FlashAttention** on supported GPUs, which compute the same result without storing the full n × n matrix in slow memory.

```python
import torch
import torch.nn.functional as F

X = torch.tensor([[1., 0.], [0., 1.], [1., 1.]])
W_Q = torch.tensor([[1., 0.], [1., 1.]])
W_K = torch.tensor([[0., 1.], [1., 0.]])
W_V = torch.tensor([[1., 0.], [0., 2.]])

out = F.scaled_dot_product_attention(X @ W_Q, X @ W_K, X @ W_V)   # scales by sqrt(d_k) itself
out_causal = F.scaled_dot_product_attention(X @ W_Q, X @ W_K, X @ W_V, is_causal=True)
print(out)          # same numbers as the NumPy output
print(out_causal)
```

## Self-attention vs cross-attention

So far Q, K and V all came from the same sequence. That is **self-attention**. In an encoder-decoder model (like the original Transformer or T5), the decoder also has **cross-attention**: queries come from the decoder (the output being written), and keys and values come from the encoder (the input sentence). This is exactly the 2014 attention idea from [the previous chapter](/interview/nlp-transformers/from-rnns-to-attention), in Q/K/V form.

| | Self-attention | Cross-attention |
|---|---|---|
| Queries from | The same sequence | The decoder sequence |
| Keys and values from | The same sequence | The encoder output |
| Purpose | Build context within a sentence | Look up the input while generating output |
| Score matrix shape | n × n | n_target × n_source |
| Found in | Encoders and decoders | Encoder-decoder models (T5, original Transformer, Whisper) |

## Key terms

| Term | Simple meaning |
|---|---|
| Self-attention | Every token in a sequence attends to every token in the same sequence |
| Query (q) | What a token is looking for |
| Key (k) | What a token offers to be matched against |
| Value (v) | The information a token gives when it is attended to |
| W_Q, W_K, W_V | Learned matrices that make queries, keys and values |
| Attention score | Dot product of a query and a key |
| Scaling | Dividing scores by √d_k to keep their variance near 1 |
| Softmax | Turns a row of scores into positive weights that add to 1 |
| Attention weights | The softmax output; how much each token takes from each other token |
| Saturation | Softmax becoming nearly one-hot, with near-zero gradients |
| Causal (look-ahead) mask | Blocks attention to future tokens in decoders |
| Padding mask | Blocks attention to `[PAD]` tokens |
| Cross-attention | Queries from one sequence, keys and values from another |
| O(n²) | Cost grows with the square of sequence length |
| FlashAttention | A fast, memory-saving way to compute exact attention on GPUs |

## Interview questions

**Explain self-attention.**
Each token is projected into a query, a key and a value using learned matrices. A token's query is compared with every key by dot product to get scores, which are scaled by √d_k and turned into weights with softmax. The token's output is the weighted sum of all value vectors. So each token's new representation contains information from the tokens most relevant to it.

**Write the attention formula and explain each part.**
Attention(Q, K, V) = softmax(QKᵀ / √d_k) V. QKᵀ gives an n × n matrix of similarity scores between every query and key. Dividing by √d_k keeps scores at a stable scale. Softmax per row turns them into weights that sum to 1, and multiplying by V mixes the value vectors with those weights.

**Why do we divide by √d_k?**
With unit-variance entries, a dot product of d_k-dimensional vectors has variance d_k, so scores grow with dimension. Large scores push softmax into a near one-hot region with tiny gradients, which slows or stops learning. Dividing by √d_k restores unit variance and keeps gradients healthy.
*Follow-up: why not divide by d_k?* That would shrink the variance to 1/d_k, making scores too small and softmax nearly uniform, so the model could not focus.

**Why do we need separate Q, K and V matrices?**
They let a token play different roles: what it searches for (query), how it is found (key), and what it passes on (value). If we used the raw embedding for all three, a token's similarity would be symmetric and tied to its own content. Separate projections give the model freedom to learn useful, asymmetric relationships.

**What is the causal mask and why is it needed?**
It is a lower-triangular mask that sets scores for future positions to −∞ before softmax, so their weights become zero. In decoder (GPT-style) models it prevents a token from seeing tokens after it during training. This keeps training consistent with generation, where future tokens do not exist yet.

**What is the time and memory complexity of self-attention?**
For n tokens and dimension d, computing QKᵀ and multiplying by V costs O(n² · d) time, and the score matrix needs O(n²) memory per head. That is why long contexts are expensive. FlashAttention reduces memory traffic but the compute is still quadratic.

**What does the softmax in attention act on — rows or columns?**
Rows: for each query (each token), softmax runs over all keys. So each row of the weight matrix sums to 1. Columns do not have to sum to 1.

**What is the difference between self-attention and cross-attention?**
In self-attention Q, K and V come from the same sequence. In cross-attention, Q comes from one sequence (the decoder) and K, V from another (the encoder output). Cross-attention lets a decoder look up the input while generating.

**Is attention permutation-invariant?**
Self-attention without position information is permutation-equivariant: if you shuffle the input tokens, the outputs shuffle in the same way, with the same values. It has no built-in idea of order. That is why Transformers add positional encodings, covered in the next chapter.

**Why subtract the max inside softmax?**
e^x overflows for large x. Subtracting the row maximum makes the largest exponent e⁰ = 1 and does not change the result, because the same factor cancels in the numerator and denominator. It is a standard numerical-stability trick.

## Try it yourself

1. Change W_V to the identity matrix [[1, 0], [0, 1]] and recompute the three output vectors using the weights A from this chapter. *Hint: V now equals X.*
2. Compute the attention weights for row "love" **without** scaling. Compare with the scaled weights [0.248, 0.248, 0.503].
3. Suppose d_k = 128. What is √d_k, and what is the typical standard deviation of raw dot products of unit-variance vectors?
4. Modify the NumPy function to also accept a **padding** mask: given `lengths = [2]` for our 3-token example (the third token is padding), block attention to the third key. Print the new weights. *Hint: build a boolean mask of shape (3, 3) where column 2 is False.*

### Answers

1. V = X = I:[1,0], love:[0,1], chai:[1,1]. I: 0.198·[1,0] + 0.401·[0,1] + 0.401·[1,1] = [0.599, 0.802]. love: 0.248·[1,0] + 0.248·[0,1] + 0.503·[1,1] = [0.752, 0.752]. chai: 0.140·[1,0] + 0.284·[0,1] + 0.576·[1,1] = [0.716, 0.860].
2. Raw scores [1, 1, 2]: exps [2.718, 2.718, 7.389], sum 12.825 → [0.212, 0.212, 0.576]. Without scaling the largest weight grows from 0.503 to 0.576 — the distribution is sharper.
3. √128 ≈ 11.31. The raw dot products have standard deviation ≈ 11.3, so without scaling, scores of ±20 or more would be common.
4. Example:

```python
mask = np.ones((3, 3), dtype=bool)
mask[:, 2] = False                         # no query may attend to key 2 (padding)
out_p, w_p = scaled_dot_product_attention(X @ W_Q, X @ W_K, X @ W_V, mask)
print(w_p)
# Output:
# [[0.3302 0.6698 0.    ]
#  [0.5    0.5    0.    ]
#  [0.3302 0.6698 0.    ]]
```

Row "I" uses scaled scores [0, 0.7071]: e⁰ = 1, e^0.7071 = 2.0281, sum 3.0281 → [0.330, 0.670]. Row "chai" uses [0.7071, 1.4142], which differ by the same 0.7071, so it gets the same weights.

**Next:** [The Transformer Architecture](/interview/nlp-transformers/the-transformer-architecture)
