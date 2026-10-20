---
title: The Transformer Architecture
part: The Transformer
summary: How attention becomes a full model — multi-head attention, positional encodings (sinusoidal and RoPE), residual connections, layer norm, the feed-forward layer, encoder vs decoder blocks, causal masking, the KV cache, and how to count parameters.
---

The previous chapter built one self-attention layer. A real Transformer wraps that layer with a few more parts — several attention heads, position information, a feed-forward network, residual connections and normalization — and stacks the block 12 to 100+ times. This chapter puts all the pieces together. When an interviewer says "walk me through a Transformer block", this is the answer, and when you estimate GPU memory or explain why a 7B model is called 7B, this is the math.

> **In simple words:** A Transformer turns tokens into vectors, adds position information, and then repeats the same block many times. Each block does two things: **attention** (tokens share information with each other) and a **feed-forward network** (each token thinks on its own). Shortcuts (residuals) and normalization keep the deep stack trainable.

## The big picture

The original Transformer (2017) was built for translation and had two halves:

- An **encoder** stack that reads the input sentence and builds contextual vectors for it.
- A **decoder** stack that generates the output, one token at a time, while looking at the encoder output.

Later models kept only one half:

- **Encoder-only** — BERT. Good at understanding text.
- **Decoder-only** — GPT, Llama, Claude. Good at generating text.
- **Encoder-decoder** — T5, BART. Good at text-to-text tasks like translation and summarization.

Chapter 7 compares these. Here we look inside the blocks.

The data flow of a decoder-only model (GPT-style):

1. Text → tokenizer → token IDs (see [Tokenization](/interview/ai-engineer/nlp-transformers/tokenization)).
2. Token IDs → **embedding table** lookup → one vector of size d_model per token.
3. Add (or apply) **position information**.
4. Pass through N identical **Transformer blocks**.
5. A final layer norm, then a **linear layer** to vocabulary size → one score (**logit**) per possible next token.
6. Softmax → probabilities for the next token.

## Multi-head attention

One attention layer gives each token one set of weights over the other tokens. But a word has many kinds of relationships at once. In "The tired student in Patna finished her exam", the word "finished" needs to know **who** finished (student), **what** was finished (exam), and maybe **where** (Patna). One softmax has to share its attention among all of these.

**Multi-head attention** runs several attention operations in parallel, each with its own W_Q, W_K, W_V. Each one is called a **head**. Different heads can learn different relationships — one may track the subject of a verb, another the previous word, another a matching bracket in code.

To keep the cost the same as one big head, each head works in a smaller space: **d_k = d_model ÷ h**, where h is the number of heads. In the original Transformer, d_model = 512 and h = 8, so each head has d_k = 64.

Steps:

1. For each head i: Qᵢ = X·W_Qⁱ, Kᵢ = X·W_Kⁱ, Vᵢ = X·W_Vⁱ (each n × d_k).
2. headᵢ = softmax(QᵢKᵢᵀ ÷ √d_k)·Vᵢ (each n × d_k).
3. **Concatenate** all heads side by side → n × (h·d_k) = n × d_model.
4. Multiply by an output matrix **W_O** (d_model × d_model) to mix the heads' results.

<div class="formula">

| Formula | Meaning |
|---|---|
| headᵢ = Attention(X·W_Qⁱ, X·W_Kⁱ, X·W_Vⁱ) | One head |
| MultiHead(X) = Concat(head₁, …, head_h) · W_O | Combine heads |
| d_k = d_model ÷ h | Each head's size |
| Attention parameters ≈ 4·d_model² | W_Q, W_K, W_V, W_O (all heads together) |

</div>

<figure>
<svg viewBox="0 0 440 200" width="440" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<rect x="10" y="80" width="60" height="40" rx="8" />
<text x="40" y="105" text-anchor="middle" fill="currentColor" stroke="none">X</text>
<line x1="70" y1="100" x2="120" y2="38" /><line x1="70" y1="100" x2="120" y2="100" /><line x1="70" y1="100" x2="120" y2="162" />
<rect x="120" y="20" width="120" height="36" rx="8" /><text x="180" y="43" text-anchor="middle" fill="currentColor" stroke="none">head 1 (d_k)</text>
<rect x="120" y="82" width="120" height="36" rx="8" /><text x="180" y="105" text-anchor="middle" fill="currentColor" stroke="none">head 2 (d_k)</text>
<text x="180" y="138" text-anchor="middle" fill="currentColor" stroke="none">⋮</text>
<rect x="120" y="144" width="120" height="36" rx="8" /><text x="180" y="167" text-anchor="middle" fill="currentColor" stroke="none">head h (d_k)</text>
<line x1="240" y1="38" x2="280" y2="85" /><line x1="240" y1="100" x2="280" y2="100" /><line x1="240" y1="162" x2="280" y2="115" />
<rect x="280" y="70" width="70" height="60" rx="8" stroke="var(--accent)" />
<text x="315" y="104" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">concat</text>
<line x1="350" y1="100" x2="370" y2="100" />
<rect x="370" y="82" width="60" height="36" rx="8" /><text x="400" y="105" text-anchor="middle" fill="currentColor" stroke="none">× W_O</text>
</svg>
<figcaption>Multi-head attention: h smaller attentions run in parallel on the same input, their outputs are concatenated and mixed by W_O.</figcaption>
</figure>

### Tiny multi-head attention in NumPy

This reuses `scaled_dot_product_attention` from [Attention Step by Step](/interview/ai-engineer/nlp-transformers/attention-step-by-step). The trick is to **reshape** instead of looping over heads: split the last axis of size d_model into (h, d_k), then move the head axis to the front.

```python
import numpy as np

def softmax(x, axis=-1):
    x = x - x.max(axis=axis, keepdims=True)
    e = np.exp(x)
    return e / e.sum(axis=axis, keepdims=True)

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.shape[-1]
    scores = Q @ K.swapaxes(-2, -1) / np.sqrt(d_k)
    if mask is not None:
        scores = np.where(mask, scores, -1e9)
    weights = softmax(scores, axis=-1)
    return weights @ V, weights

class MultiHeadAttention:
    def __init__(self, d_model, n_heads, seed=0):
        assert d_model % n_heads == 0
        self.h, self.d_k = n_heads, d_model // n_heads
        rng = np.random.default_rng(seed)
        s = 1 / np.sqrt(d_model)                    # small random init
        self.W_q = rng.normal(0, s, (d_model, d_model))   # all heads' W_Q side by side
        self.W_k = rng.normal(0, s, (d_model, d_model))
        self.W_v = rng.normal(0, s, (d_model, d_model))
        self.W_o = rng.normal(0, s, (d_model, d_model))

    def split_heads(self, x):                      # (T, d_model) -> (h, T, d_k)
        T = x.shape[0]
        return x.reshape(T, self.h, self.d_k).transpose(1, 0, 2)

    def __call__(self, x, mask=None):
        Q = self.split_heads(x @ self.W_q)
        K = self.split_heads(x @ self.W_k)
        V = self.split_heads(x @ self.W_v)
        out, weights = scaled_dot_product_attention(Q, K, V, mask)   # (h, T, d_k)
        T = x.shape[0]
        out = out.transpose(1, 0, 2).reshape(T, self.h * self.d_k)   # concat heads
        return out @ self.W_o, weights

np.set_printoptions(precision=4, suppress=True)
x = np.random.default_rng(42).normal(size=(4, 8))    # 4 tokens, d_model = 8
mha = MultiHeadAttention(d_model=8, n_heads=2)        # 2 heads, d_k = 4
mask = np.tril(np.ones((4, 4), dtype=bool))           # causal mask
y, w = mha(x, mask)
print(y.shape, w.shape)
print(w[0])               # head 0's attention weights
```

```text
(4, 8) (2, 4, 4)
[[1.     0.     0.     0.    ]
 [0.8596 0.1404 0.     0.    ]
 [0.3035 0.2806 0.4158 0.    ]
 [0.3197 0.113  0.2948 0.2725]]
```

The output has the same shape as the input (4 × 8). There is one 4 × 4 weight matrix per head, and the causal mask makes each one lower-triangular.

> **Interview tip:** "Why multi-head instead of one big head?" — "Each head has its own softmax, so different heads can attend to different positions for different reasons at the same time, like syntax in one head and coreference in another. A single head would have to average these into one distribution. Because each head is d_model/h wide, the total cost is about the same as one full-width head."

> **Common mistake:** Thinking each head sees only part of the tokens. Every head sees **all** tokens; it sees a smaller **projection** (d_k numbers) of each token.

## Positional encoding

Self-attention has no idea of order. If you shuffle "dog bites man" into "man bites dog", each token gets the same output vector as before, just in a different position. But order changes meaning. So we must inject **position** information.

### Sinusoidal positional encoding (original Transformer)

Add to each token embedding a fixed vector that depends on its position. The original paper used sine and cosine waves of different frequencies:

<div class="formula">

| Formula | Meaning |
|---|---|
| PE(pos, 2i) = sin(pos ÷ 10000^(2i/d)) | Even dimensions |
| PE(pos, 2i+1) = cos(pos ÷ 10000^(2i/d)) | Odd dimensions |
| input = token embedding + PE(pos) | Added, not concatenated |

</div>

Example with d = 4. Dimensions 0 and 1 use frequency 1 (10000⁰ = 1). Dimensions 2 and 3 use 10000^(2/4) = 100, so they change 100 times more slowly.

| pos | dim 0: sin(pos) | dim 1: cos(pos) | dim 2: sin(pos/100) | dim 3: cos(pos/100) |
|---|---|---|---|---|
| 0 | 0 | 1 | 0 | 1 |
| 1 | 0.8415 | 0.5403 | 0.0100 | 1.0000 |
| 2 | 0.9093 | −0.4161 | 0.0200 | 0.9998 |

Like the hands of a clock — the fast hand (dims 0–1) tells small differences, the slow hand (dims 2–3) tells big differences — every position gets a unique pattern. And the encoding of pos + k is a fixed rotation of the encoding of pos, which makes relative positions easy for the model to learn.

### Learned positional embeddings

BERT and GPT-2 use a simpler idea: a second embedding table with one learned vector per position (0 to 511 for BERT, 0 to 1023 for GPT-2). It works well but **cannot handle positions longer than the table** — this is one reason those models have hard length limits.

### RoPE (Rotary Position Embedding)

Most modern LLMs — Llama, Mistral, Qwen, Gemma — use **RoPE** (Su et al., 2021). Instead of adding a vector to the input, RoPE **rotates** the query and key vectors inside each attention layer. The vector is split into pairs of numbers; each pair is treated as a 2-D point and rotated by an angle of **position × θ** (each pair has its own θ, fast to slow, like the sinusoidal frequencies).

Why rotation? The dot product of two rotated vectors depends only on the **difference** of their angles. So the attention score between a query at position m and a key at position n depends on **m − n**, the relative distance — exactly what language needs ("the word 2 steps before me").

Small example: one pair, θ = 30°, and q = k = [1, 0] (pointing at 0°).

- Query at position 3 → rotated by 90°. Key at position 1 → rotated by 30°. Angle between them = 60° → dot product = cos 60° = **0.5**.
- Query at position 5 → rotated by 150°. Key at position 3 → rotated by 90°. Angle between = 60° → dot product = **0.5**.

Same distance (2), same score, even though the absolute positions differ.

| Method | How | Relative positions | Longer than training? | Used by |
|---|---|---|---|---|
| Sinusoidal | Fixed sin/cos vector added to input | Indirect | Somewhat | Original Transformer |
| Learned absolute | Learned vector per position, added | No | No (table has fixed size) | BERT, GPT-2 |
| RoPE | Rotate q and k by position angle | Yes, built in | With scaling tricks (e.g. YaRN) | Llama, Mistral, Qwen, Gemma |
| ALiBi | Subtract a penalty proportional to distance from scores | Yes | Extrapolates well | BLOOM, MPT |

## Residual connections

Deep networks are hard to train: gradients fade as they pass back through many layers. A **residual connection** (or skip connection) adds a layer's input to its output:

**output = x + Sublayer(x)**

So each sublayer only has to learn a *change* to x, not a whole new representation. And the gradient has a direct path — through the "+ x" — from the top of the network to the bottom. This idea came from ResNet in computer vision (see [Convolutional Neural Networks](/interview/ai-engineer/deep-learning/convolutional-neural-networks)). Every attention and feed-forward sublayer in a Transformer has one.

> **Real-life example:** Editing a document with "track changes". Each reviewer adds small edits to the existing text; nobody rewrites the whole document from zero. The original text always survives underneath. The stream of vectors flowing through the residual connections is often called the **residual stream**.

## Layer normalization

**Layer normalization (LayerNorm)** rescales each token's vector to have mean 0 and variance 1, then applies a learned scale γ and shift β. It keeps the numbers in a stable range as they pass through many layers.

Worked example: one token vector x = [2, 4, 6].

- Mean = (2 + 4 + 6) ÷ 3 = **4**
- Variance = ((2−4)² + (4−4)² + (6−4)²) ÷ 3 = (4 + 0 + 4) ÷ 3 = **2.667**
- Standard deviation = √2.667 = **1.633**
- Normalized = [(2−4)/1.633, 0, (6−4)/1.633] = **[−1.225, 0, 1.225]**
- Output = γ · normalized + β (γ starts as 1, β as 0)

LayerNorm normalizes **across the features of one token**. **Batch norm** normalizes each feature **across the batch**, which works badly for variable-length text and small batches. That is why Transformers use LayerNorm. See [Regularization, Dropout and Batch Norm](/interview/ai-engineer/deep-learning/regularization-dropout-and-batch-norm).

Modern LLMs (Llama, Mistral) use **RMSNorm**, a simpler version that skips subtracting the mean and divides by the root-mean-square only. It is a bit faster and works as well.

### Post-LN vs Pre-LN

- **Post-LN** (original 2017 paper, BERT): x = LayerNorm(x + Sublayer(x)).
- **Pre-LN** (GPT-2 onwards, almost all modern LLMs): x = x + Sublayer(LayerNorm(x)).

Pre-LN keeps a clean residual path with nothing in the way, so very deep models train more stably and need less careful learning-rate warmup.

## The feed-forward network

After attention mixes information **between** tokens, each token passes **on its own** through a small 2-layer neural network called the **feed-forward network (FFN)** or **MLP**. The same weights are used for every position.

**FFN(x) = W₂ · GELU(W₁ · x + b₁) + b₂**

- W₁ expands from d_model to d_ff (usually d_ff = 4 × d_model; 768 → 3072 in GPT-2 small).
- An activation (ReLU in 2017, **GELU** in BERT/GPT-2) adds non-linearity.
- W₂ projects back to d_model.

Llama-style models use **SwiGLU**, a gated version with three matrices instead of two, and pick d_ff ≈ (8/3)·d_model so the parameter count stays about the same.

The FFN holds about **two thirds** of each block's parameters. Research suggests much of a model's factual knowledge is stored here. Attention moves information around; the FFN processes it.

> **Remember:** Attention = tokens talk to each other. FFN = each token thinks alone. Residual + norm = keep the deep stack stable.

## The full Transformer block

Putting it together, one **decoder block** of a GPT-style model (pre-LN):

```text
x = x + MaskedMultiHeadAttention(LayerNorm(x))
x = x + FeedForward(LayerNorm(x))
```

<figure>
<svg viewBox="0 0 440 480" width="440" height="480" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="120" y="10" width="220" height="30" rx="8" />
<text x="230" y="30" text-anchor="middle" fill="currentColor" stroke="none">Linear → softmax over vocabulary</text>
<line x1="230" y1="60" x2="230" y2="40" />
<polygon points="225,46 230,40 235,46" fill="currentColor" />
<rect x="120" y="60" width="220" height="26" rx="8" />
<text x="230" y="78" text-anchor="middle" fill="currentColor" stroke="none">Final LayerNorm</text>
<rect x="70" y="100" width="330" height="305" rx="10" stroke-dasharray="5 4" />
<text x="390" y="255" text-anchor="end" fill="var(--accent)" stroke="none" font-weight="bold" font-size="14">× N</text>
<line x1="230" y1="115" x2="230" y2="86" />
<polygon points="225,92 230,86 235,92" fill="currentColor" />
<circle cx="230" cy="125" r="10" />
<text x="230" y="129" text-anchor="middle" fill="currentColor" stroke="none" font-size="14">+</text>
<line x1="230" y1="155" x2="230" y2="135" />
<rect x="120" y="155" width="220" height="34" rx="8" stroke="var(--accent)" />
<text x="230" y="176" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold" font-size="11">Feed-forward (Linear → GELU → Linear)</text>
<line x1="230" y1="210" x2="230" y2="189" />
<rect x="120" y="210" width="220" height="26" rx="8" />
<text x="230" y="228" text-anchor="middle" fill="currentColor" stroke="none">LayerNorm</text>
<line x1="230" y1="260" x2="230" y2="236" />
<line x1="230" y1="250" x2="95" y2="250" />
<line x1="95" y1="250" x2="95" y2="125" />
<line x1="95" y1="125" x2="220" y2="125" />
<circle cx="230" cy="270" r="10" />
<text x="230" y="274" text-anchor="middle" fill="currentColor" stroke="none" font-size="14">+</text>
<line x1="230" y1="295" x2="230" y2="280" />
<rect x="120" y="295" width="220" height="34" rx="8" stroke="var(--accent)" />
<text x="230" y="316" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Masked multi-head self-attention</text>
<line x1="230" y1="350" x2="230" y2="329" />
<rect x="120" y="350" width="220" height="26" rx="8" />
<text x="230" y="368" text-anchor="middle" fill="currentColor" stroke="none">LayerNorm</text>
<line x1="230" y1="430" x2="230" y2="376" />
<line x1="230" y1="390" x2="95" y2="390" />
<line x1="95" y1="390" x2="95" y2="270" />
<line x1="95" y1="270" x2="220" y2="270" />
<text x="88" y="330" text-anchor="end" fill="currentColor" stroke="none" font-size="11">residual</text>
<text x="88" y="190" text-anchor="end" fill="currentColor" stroke="none" font-size="11">residual</text>
<rect x="100" y="430" width="260" height="34" rx="8" />
<text x="230" y="451" text-anchor="middle" fill="currentColor" stroke="none">Token embedding + position info</text>
</svg>
<figcaption>A pre-LN decoder block (GPT, Llama style): normalize, attend, add back; normalize, feed-forward, add back. The block is repeated N times.</figcaption>
</figure>

### Encoder block vs decoder block

| Part | Encoder block (BERT) | Decoder block, decoder-only (GPT, Llama) | Decoder block, encoder-decoder (T5, original) |
|---|---|---|---|
| Self-attention | Full (bidirectional): every token sees all tokens | Masked (causal): sees only earlier tokens | Masked (causal) |
| Cross-attention to encoder | No | No | Yes: Q from decoder, K/V from encoder |
| Feed-forward | Yes | Yes | Yes |
| Residual + norm | Yes | Yes | Yes |
| Output used for | Understanding (classification, NER, embeddings) | Next-token generation | Generating output conditioned on input |

### The causal mask in a decoder

For a 4-token input "I love masala chai", the decoder's self-attention uses this mask (1 = may attend, 0 = blocked → −∞ before softmax):

```text
            I   love  masala  chai
I         [ 1    0     0       0 ]
love      [ 1    1     0       0 ]
masala    [ 1    1     1       0 ]
chai      [ 1    1     1       1 ]
```

During training, one forward pass makes a prediction at **every** position at once: after "I" predict "love", after "I love" predict "masala", and so on. The mask makes sure each prediction only uses earlier tokens. This is why training is parallel even though generation is not.

## A PyTorch decoder block

This is a compact, correct GPT-style block using PyTorch 2.x. It is about the same as the block in GPT-2.

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class CausalSelfAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        assert d_model % n_heads == 0
        self.n_heads = n_heads
        self.qkv = nn.Linear(d_model, 3 * d_model)   # W_Q, W_K, W_V in one matrix
        self.proj = nn.Linear(d_model, d_model)      # W_O

    def forward(self, x):                            # x: (B, T, C)
        B, T, C = x.shape
        q, k, v = self.qkv(x).split(C, dim=-1)
        # (B, T, C) -> (B, heads, T, d_head)
        q = q.view(B, T, self.n_heads, C // self.n_heads).transpose(1, 2)
        k = k.view(B, T, self.n_heads, C // self.n_heads).transpose(1, 2)
        v = v.view(B, T, self.n_heads, C // self.n_heads).transpose(1, 2)
        y = F.scaled_dot_product_attention(q, k, v, is_causal=True)
        y = y.transpose(1, 2).contiguous().view(B, T, C)   # concat heads
        return self.proj(y)

class Block(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.ln1 = nn.LayerNorm(d_model)
        self.attn = CausalSelfAttention(d_model, n_heads)
        self.ln2 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, 4 * d_model),
            nn.GELU(),
            nn.Linear(4 * d_model, d_model),
        )

    def forward(self, x):
        x = x + self.attn(self.ln1(x))   # residual around attention
        x = x + self.ffn(self.ln2(x))    # residual around feed-forward
        return x

block = Block(d_model=768, n_heads=12)
x = torch.randn(2, 10, 768)                         # batch 2, 10 tokens
print(block(x).shape)                               # Output: torch.Size([2, 10, 768])
print(sum(p.numel() for p in block.parameters()))   # Output: 7087872
```

The 7,087,872 parameters match the hand count below.

## Counting parameters

Interviewers like asking "roughly how many parameters does a Transformer layer have?" because it tests whether you really know the parts. Let d = d_model.

| Part | Weights | Biases | With d = 768 |
|---|---|---|---|
| W_Q, W_K, W_V | 3·d² | 3·d | 1,769,472 + 2,304 |
| W_O | d² | d | 589,824 + 768 |
| FFN first layer (d → 4d) | 4·d² | 4·d | 2,359,296 + 3,072 |
| FFN second layer (4d → d) | 4·d² | d | 2,359,296 + 768 |
| 2 LayerNorms (γ, β) | — | 4·d | 3,072 |
| **Total per block** | **12·d²** | **13·d** | **7,087,872** |

> **Remember:** Parameters per block ≈ **12 · d_model²** (4d² for attention + 8d² for the FFN). The number of heads does **not** change the count.

### Worked example: GPT-2 small

GPT-2 small: d = 768, N = 12 layers, vocabulary V = 50,257, context 1,024.

- Blocks: 12 × 7,087,872 = **85,054,464**
- Token embedding table: 50,257 × 768 = **38,597,376**
- Position embedding table: 1,024 × 768 = **786,432**
- Final LayerNorm: 2 × 768 = **1,536**
- Output layer: shares the token embedding weights (**weight tying**), so **0** extra.
- **Total = 124,439,808 ≈ 124 M** — exactly the published size of GPT-2 small.

Quick estimate: 12 × N × d² = 12 × 12 × 768² = 84.9 M for the blocks, plus V × d = 38.6 M for embeddings ≈ 124 M.

### Worked example: a "7B" model

A Llama-2-7B-style model: d = 4,096, N = 32, V = 32,000, SwiGLU FFN with d_ff = 11,008 (three matrices), no biases, RMSNorm.

- Attention per layer: 4 × 4,096² = 67,108,864
- FFN per layer: 3 × 4,096 × 11,008 = 135,266,304
- Per layer ≈ 202.4 M; × 32 layers = **6.476 B**
- Embeddings 32,000 × 4,096 = 131 M, plus an untied output layer of the same size = 262 M
- Total ≈ **6.74 B** — that is the "7B".

### Memory from parameter count

Each parameter in 16-bit precision (fp16/bf16) takes 2 bytes. A 7B model needs about 7 × 2 = **14 GB** just to hold the weights. In 4-bit quantization, about 3.5 GB. Training with Adam needs roughly 16 bytes per parameter (weights, gradients, two optimizer states, fp32 copies), about 112 GB for 7B — this is why fine-tuning uses tricks like LoRA (see [Fine-tuning, LoRA and QLoRA](/interview/ai-engineer/llms-genai/fine-tuning-lora-and-qlora)).

## KV cache basics

When a decoder generates text, it produces one token per forward pass. Without care, generating token 500 would recompute keys and values for tokens 1 to 499 again, and token 501 would redo all of them again — very wasteful.

Observation: thanks to the causal mask, the keys and values of old tokens **never change** when new tokens are added. So we compute each token's K and V once and store them. This store is the **KV cache**. For each new token we only compute its own q, k, v, append k and v to the cache, and attend over the cached keys and values.

- **Without cache:** each step re-processes the full prefix.
- **With cache:** each step processes one new token (but attention still reads all cached keys).

The cost is **memory**. The cache size is:

**KV cache bytes = 2 (K and V) × layers × n_kv_heads × d_head × tokens × bytes per number**

Example: 32 layers, 32 heads × 128 dims (= 4,096), fp16 (2 bytes), one sequence of 4,096 tokens:

- Per token: 2 × 32 × 4,096 × 2 bytes = 524,288 bytes = **0.5 MB**
- 4,096 tokens: 0.5 MB × 4,096 = **2 GB** — for one user's conversation!

**Grouped-query attention (GQA)** lets several query heads share one key/value head. With 8 KV heads instead of 32, the cache shrinks 4× (to 0.5 GB here). Llama 2 70B, Llama 3, Mistral and many others use GQA. **Multi-query attention (MQA)** goes further with a single KV head. For serving details, see [Generation Settings and the Context Window](/interview/ai-engineer/llms-genai/generation-settings-and-the-context-window) and [Serving Models](/interview/ai-engineer/mlops-deployment/serving-models).

> **Interview tip:** If asked "what is the KV cache and what is the trade-off?" — "It stores the keys and values of previous tokens so each generation step only computes the new token, which makes decoding much faster. The trade-off is memory, which grows linearly with sequence length, layers and batch size, and often limits how many users a GPU can serve. GQA, MQA and cache quantization reduce it."

## Key terms

| Term | Simple meaning |
|---|---|
| Encoder | Stack that builds contextual vectors for the input (bidirectional) |
| Decoder | Stack that generates tokens left to right (causal) |
| d_model | Width of each token vector throughout the model |
| Multi-head attention | Several attention heads in parallel, concatenated, mixed by W_O |
| Head | One attention operation with its own W_Q, W_K, W_V |
| d_k (d_head) | Size of one head = d_model ÷ h |
| W_O | Output matrix that mixes the concatenated heads |
| Positional encoding | Information about token position added to the model |
| Sinusoidal encoding | Fixed sin/cos position vectors |
| RoPE | Rotates q and k by a position-dependent angle; encodes relative position |
| ALiBi | Adds a distance penalty to attention scores |
| Residual connection | output = x + Sublayer(x); a shortcut for signal and gradients |
| Residual stream | The vectors flowing through the residual path |
| LayerNorm | Normalizes each token's vector to mean 0, variance 1, then scales |
| RMSNorm | LayerNorm without the mean subtraction; used in Llama |
| Pre-LN / Post-LN | Norm before the sublayer / after the residual add |
| Feed-forward network (FFN, MLP) | Per-token 2-layer network, d → 4d → d |
| GELU / SwiGLU | Activations used in the FFN |
| Causal mask | Lower-triangular mask that hides future tokens |
| Cross-attention | Decoder queries attend to encoder keys and values |
| Logits | Raw scores for each vocabulary token before softmax |
| Weight tying | Output layer reuses the input embedding matrix |
| KV cache | Stored keys and values of past tokens for fast generation |
| GQA / MQA | Fewer KV heads shared by query heads, to shrink the KV cache |

## Interview questions

**Walk me through one Transformer block.**
The input vectors go through LayerNorm, then multi-head self-attention, and the result is added back to the input (residual). Then another LayerNorm, a position-wise feed-forward network (expand to 4d, GELU, project back), and another residual add. In a decoder the attention is causally masked; in an encoder-decoder's decoder there is also a cross-attention sublayer.

**Why multi-head attention?**
Each head has its own projections and softmax, so heads can focus on different relationships at once — syntax, coreference, nearby words. One head would have to average them into one distribution. Splitting d_model across heads keeps the cost similar to one full-size head.

**Why do Transformers need positional encodings?**
Self-attention treats the input as a set; shuffling tokens just shuffles the outputs. Without position information, "dog bites man" and "man bites dog" would look the same. Positional encodings or RoPE inject order.

**What is RoPE and why is it popular?**
RoPE rotates query and key vectors by an angle proportional to their position. The dot product of two rotated vectors depends only on the difference in positions, so attention naturally uses relative position. It needs no extra parameters and, with scaling tricks, can be extended to longer contexts, so most modern open LLMs use it.

**What do residual connections do?**
They add the sublayer input to its output, so each layer learns a correction. They give gradients a direct path through the deep stack, preventing vanishing gradients, and make very deep models trainable.

**LayerNorm vs BatchNorm — why LayerNorm in Transformers?**
BatchNorm normalizes each feature across the batch, which depends on batch size and is awkward with variable-length sequences and at inference. LayerNorm normalizes each token across its own features, so it works the same for any batch size and sequence length.

**What is the role of the feed-forward layer?**
It processes each token independently after attention has mixed information between tokens. It adds non-linear transformation capacity and holds about two thirds of the block's parameters; research suggests a lot of factual knowledge is stored there.

**Encoder vs decoder — what is the difference?**
An encoder uses bidirectional self-attention: every token sees every other token, which is good for understanding. A decoder uses causal self-attention: each token sees only earlier tokens, which is needed for generation. Encoder-decoder models add cross-attention from decoder to encoder.

**Estimate the parameters of a Transformer with d = 1,024, 24 layers and a 50k vocabulary.**
Per layer ≈ 12 × 1,024² ≈ 12.6 M, so 24 layers ≈ 302 M. Embeddings ≈ 50,000 × 1,024 ≈ 51 M. Total ≈ 353 M (roughly GPT-2 medium / BERT-large size).

**What is the KV cache?**
During generation it stores each layer's keys and values for all previous tokens, so each new token only computes its own projections and attends to the cache. It turns repeated recomputation into a lookup, making decoding much faster. It costs memory proportional to layers × KV heads × head size × tokens × batch.

**Pre-LN vs Post-LN?**
Post-LN normalizes after the residual add, as in the original paper and BERT. Pre-LN normalizes the input of each sublayer, leaving the residual path clean. Pre-LN trains more stably for deep models, so modern LLMs use it.

**Does the number of heads change the parameter count?**
No. W_Q, W_K, W_V and W_O are each d_model × d_model in total no matter how they are split into heads. Heads change how the computation is divided, not its size.

## Try it yourself

1. Compute the sinusoidal positional encoding for position 3 with d = 4. *Hint: sin 3, cos 3, sin 0.03, cos 0.03.*
2. Apply LayerNorm (γ = 1, β = 0) by hand to x = [1, 1, 4].
3. Count the parameters of BERT-base: d = 768, 12 layers, vocabulary 30,522, 512 positions, plus 2 segment embeddings. Ignore the pooler and the embedding LayerNorm.
4. Estimate the KV cache size for a model with 40 layers, 8 KV heads of 128 dims, fp16, batch of 16 users, 8,000 tokens each.

### Answers

1. [sin 3, cos 3, sin 0.03, cos 0.03] = [0.1411, −0.9900, 0.0300, 0.9996].
2. Mean = 2. Variance = ((1−2)² + (1−2)² + (4−2)²) ÷ 3 = (1 + 1 + 4) ÷ 3 = 2. Std = √2 = 1.414. Normalized = [−0.707, −0.707, 1.414].
3. Blocks: 12 × 7,087,872 = 85,054,464. Token embeddings: 30,522 × 768 = 23,440,896. Positions: 512 × 768 = 393,216. Segments: 2 × 768 = 1,536. Total ≈ 108.9 M. With the pooler and embedding LayerNorm (about 0.6 M more), you get the published ≈ 110 M.
4. Per token: 2 × 40 × 8 × 128 × 2 bytes = 163,840 bytes = 160 KB. Tokens: 16 × 8,000 = 128,000. Total = 163,840 × 128,000 ≈ 2.1 × 10¹⁰ bytes ≈ 19.5 GiB (about 21 GB).

**Next:** [BERT, GPT and T5](/interview/ai-engineer/nlp-transformers/bert-gpt-and-t5)
