---
title: Recurrent Networks and LSTM
part: Architectures
summary: How networks handle sequences with a hidden state, an RNN computed by hand over three time steps, backpropagation through time and why gradients vanish, LSTM gates explained simply with a worked step, GRU, PyTorch code, and why Transformers replaced RNNs.
---

Text, speech, stock prices, sensor readings and UPI transaction histories are **sequences**: the order of items matters, and the length changes from one example to the next. Recurrent neural networks (RNNs) were the main tool for sequences until about 2018, and the LSTM was behind Google Translate, Siri-era speech recognition and phone keyboards. Today Transformers do most of this work, but interviewers still ask about RNNs and LSTMs, because understanding their limits is the best way to understand why attention was invented.

> **In simple words:** An RNN reads a sequence one item at a time and keeps a "memory" vector called the hidden state, which it updates at every step. Plain RNNs forget long-ago items because gradients vanish. An LSTM adds a separate memory line (the cell state) and three gates that decide what to forget, what to write and what to show, so it can remember much longer.

## Why sequences need a different network

An MLP or CNN takes a fixed-size input. A sentence can be 3 words or 300. And meaning depends on order: "dog bites man" and "man bites dog" have the same words.

| Task | Input | Output |
|---|---|---|
| Sentiment of a Flipkart review | sequence of words | one label (many-to-one) |
| Next-word prediction | sequence of words | next word at each step (many-to-many) |
| Translation Hindi → English | sequence | another sequence of different length (sequence-to-sequence) |
| Image captioning | one image | a sequence of words (one-to-many) |
| Forecasting daily sales | past values | future values |

We need a model that (1) handles any length, (2) uses the same weights at every position, and (3) carries information from earlier items to later ones.

## The recurrent neural network

An RNN processes the sequence step by step. At each **time step** t it takes two things: the current input xₜ and the previous **hidden state** hₜ₋₁ (its memory of everything so far). It produces a new hidden state:

<div class="formula">

| Formula | Meaning |
|---|---|
| hₜ = tanh(Wₓ · xₜ + Wₕ · hₜ₋₁ + b) | mix the new input with the old memory, squash with tanh |
| ŷₜ = W_y · hₜ + c | optional output at each step |
| h₀ = 0 | the memory starts empty |

</div>

The **same** weights Wₓ, Wₕ and b are used at every time step. This is **weight sharing across time**, like a CNN shares a filter across positions. It is why one RNN can handle any length.

> **Real-life example:** Listening to a cricket commentary on the radio. You do not remember every word, but you keep a running summary in your head: "India 145 for 3, Kohli batting, needs 60 off 40 balls". Each new ball updates the summary. The summary is the hidden state.

### Unrolling

If you draw a copy of the RNN for each time step, it looks like a deep feed-forward network where every layer shares weights. This is called **unrolling** the RNN.

<figure>
<svg viewBox="0 0 440 200" width="440" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<rect x="60" y="80" width="80" height="44" rx="8" />
<text x="100" y="107" text-anchor="middle" fill="currentColor" stroke="none">RNN cell</text>
<rect x="190" y="80" width="80" height="44" rx="8" />
<text x="230" y="107" text-anchor="middle" fill="currentColor" stroke="none">RNN cell</text>
<rect x="320" y="80" width="80" height="44" rx="8" />
<text x="360" y="107" text-anchor="middle" fill="currentColor" stroke="none">RNN cell</text>
<line x1="10" y1="102" x2="52" y2="102" stroke="var(--accent)" />
<polygon points="52,97 60,102 52,107" fill="var(--accent)" stroke="var(--accent)" />
<line x1="140" y1="102" x2="182" y2="102" stroke="var(--accent)" />
<polygon points="182,97 190,102 182,107" fill="var(--accent)" stroke="var(--accent)" />
<line x1="270" y1="102" x2="312" y2="102" stroke="var(--accent)" />
<polygon points="312,97 320,102 312,107" fill="var(--accent)" stroke="var(--accent)" />
<line x1="400" y1="102" x2="430" y2="102" stroke="var(--accent)" />
<text x="30" y="94" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">h0</text>
<text x="165" y="94" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">h1</text>
<text x="295" y="94" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">h2</text>
<text x="420" y="94" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">h3</text>
<line x1="100" y1="160" x2="100" y2="132" />
<polygon points="95,132 100,124 105,132" fill="currentColor" />
<line x1="230" y1="160" x2="230" y2="132" />
<polygon points="225,132 230,124 235,132" fill="currentColor" />
<line x1="360" y1="160" x2="360" y2="132" />
<polygon points="355,132 360,124 365,132" fill="currentColor" />
<text x="100" y="178" text-anchor="middle" fill="currentColor" stroke="none">x1 = "the"</text>
<text x="230" y="178" text-anchor="middle" fill="currentColor" stroke="none">x2 = "movie"</text>
<text x="360" y="178" text-anchor="middle" fill="currentColor" stroke="none">x3 = "rocks"</text>
<line x1="100" y1="80" x2="100" y2="48" />
<polygon points="95,48 100,40 105,48" fill="currentColor" />
<line x1="230" y1="80" x2="230" y2="48" />
<polygon points="225,48 230,40 235,48" fill="currentColor" />
<line x1="360" y1="80" x2="360" y2="48" />
<polygon points="355,48 360,40 365,48" fill="currentColor" />
<text x="100" y="32" text-anchor="middle" fill="currentColor" stroke="none">y1</text>
<text x="230" y="32" text-anchor="middle" fill="currentColor" stroke="none">y2</text>
<text x="360" y="32" text-anchor="middle" fill="currentColor" stroke="none">y3</text>
</svg>
<figcaption>An RNN unrolled over three words. Each box is the same cell with the same weights; the hidden state (accent) carries memory from one step to the next.</figcaption>
</figure>

### An RNN by hand over three steps

Use a tiny RNN where everything is a single number: Wₓ = 0.5, Wₕ = 0.8, b = 0, h₀ = 0. The input sequence is x = [1, 0.5, −1].

**Step 1** (x₁ = 1):

- z = 0.5 × 1 + 0.8 × 0 + 0 = 0.5
- h₁ = tanh(0.5) = **0.4621**

**Step 2** (x₂ = 0.5):

- z = 0.5 × 0.5 + 0.8 × 0.4621 = 0.25 + 0.3697 = 0.6197
- h₂ = tanh(0.6197) = **0.5509**

**Step 3** (x₃ = −1):

- z = 0.5 × (−1) + 0.8 × 0.5509 = −0.5 + 0.4407 = −0.0593
- h₃ = tanh(−0.0593) = **−0.0592**

The final state h₃ still contains a little of x₁ and x₂ through the 0.8 × hₜ₋₁ term, but the most recent input dominates. For a sentiment model, h₃ would go into a dense layer to predict positive or negative.

```python
import numpy as np

Wx, Wh, b = 0.5, 0.8, 0.0
h = 0.0
for t, x in enumerate([1.0, 0.5, -1.0], start=1):
    h = np.tanh(Wx * x + Wh * h + b)
    print(t, round(h, 4))
# 1 0.4621
# 2 0.5509
# 3 -0.0592
```

In a real RNN, xₜ is a vector (for example a 300-number word embedding), hₜ is a vector (for example 128 numbers), and Wₓ and Wₕ are matrices.

## Backpropagation through time and vanishing gradients

To train an RNN, you unroll it over the sequence and run ordinary backpropagation through the unrolled graph. This is called **backpropagation through time (BPTT)**. Because the same weights appear at every step, their gradients from all steps are **added** together.

The problem: the gradient flowing from step 20 back to step 1 is multiplied, once per step, by Wₕ and by the tanh slope (which is at most 1). For our scalar RNN, each step multiplies by at most 0.8:

| Factor per step | After 20 steps | Effect |
|---|---|---|
| 0.8 | 0.8²⁰ ≈ 0.0115 | the gradient from step 1 is about 1% of its size: **vanishing** |
| 1.2 | 1.2²⁰ ≈ 38.3 | the gradient is 38 times bigger: **exploding** |

With vanishing gradients, the network cannot learn that a word at the start of a long review ("Not ... good") changes the meaning at the end. Plain RNNs in practice remember only around 10 or so steps. Exploding gradients are easier to fix with **gradient clipping** (see [Training in Practice](/interview/deep-learning/training-in-practice)); vanishing gradients need a better architecture: the LSTM.

> **Remember:** Plain RNN problem = multiply by the same matrix at every step = gradients vanish or explode over long sequences. Clipping fixes exploding; LSTM/GRU fix vanishing.

## LSTM: Long Short-Term Memory

The **LSTM** (Hochreiter and Schmidhuber, 1997) adds two ideas:

1. A second memory line called the **cell state** cₜ. Think of it as a conveyor belt running along the sequence. Information can travel along it for many steps with only small, controlled changes.
2. Three **gates** that control the belt. A gate is a sigmoid layer, so it outputs numbers between 0 and 1, and it multiplies some signal: 0 means "block everything", 1 means "let everything through".

### The gates in plain words

Imagine the LSTM is reading a long Flipkart review and keeping notes in a notebook (the cell state).

| Gate | Question it answers | Notebook analogy |
|---|---|---|
| **Forget gate** fₜ | What old information should I erase? | rub out notes that no longer matter, e.g. the previous product's details when a new product is mentioned |
| **Input gate** iₜ | How much of the new information should I write? | decide which new facts are worth writing down |
| **Candidate** gₜ (or c̃ₜ) | What new information could be written? | the draft of the new note (tanh, between −1 and 1) |
| **Output gate** oₜ | What part of the memory should I show now? | read out only the notes relevant to the current word |

### The equations

All gates look at the same two things: the current input xₜ and the previous hidden state hₜ₋₁. Each has its own weights.

<div class="formula">

| Step | Formula |
|---|---|
| Forget gate | fₜ = σ(W_f · [hₜ₋₁, xₜ] + b_f) |
| Input gate | iₜ = σ(W_i · [hₜ₋₁, xₜ] + b_i) |
| Candidate memory | gₜ = tanh(W_g · [hₜ₋₁, xₜ] + b_g) |
| Output gate | oₜ = σ(W_o · [hₜ₋₁, xₜ] + b_o) |
| New cell state | cₜ = fₜ ⊙ cₜ₋₁ + iₜ ⊙ gₜ |
| New hidden state | hₜ = oₜ ⊙ tanh(cₜ) |

</div>

[hₜ₋₁, xₜ] means the two vectors joined end to end, and ⊙ means element-wise multiplication.

Read the cell-state line as: **keep some old memory + add some new memory**. The hidden state is a filtered view of the memory.

<figure>
<svg viewBox="0 0 440 250" width="440" height="250" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="40" y="20" width="360" height="205" rx="12" stroke-dasharray="5 4" stroke-width="1" />
<line x1="10" y1="50" x2="98" y2="50" stroke="var(--accent)" stroke-width="2.5" />
<circle cx="110" cy="50" r="12" stroke="var(--accent)" />
<text x="110" y="55" text-anchor="middle" fill="currentColor" stroke="none">×</text>
<line x1="122" y1="50" x2="188" y2="50" stroke="var(--accent)" stroke-width="2.5" />
<circle cx="200" cy="50" r="12" stroke="var(--accent)" />
<text x="200" y="55" text-anchor="middle" fill="currentColor" stroke="none">+</text>
<line x1="212" y1="50" x2="430" y2="50" stroke="var(--accent)" stroke-width="2.5" />
<text x="12" y="42" fill="var(--accent)" stroke="none" font-weight="bold">c(t−1)</text>
<text x="430" y="42" text-anchor="end" fill="var(--accent)" stroke="none" font-weight="bold">c(t)</text>
<text x="300" y="42" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">cell state: the conveyor belt</text>
<rect x="85" y="150" width="50" height="30" rx="6" />
<text x="110" y="170" text-anchor="middle" fill="currentColor" stroke="none">f: σ</text>
<rect x="145" y="150" width="50" height="30" rx="6" />
<text x="170" y="170" text-anchor="middle" fill="currentColor" stroke="none">i: σ</text>
<rect x="205" y="150" width="50" height="30" rx="6" />
<text x="230" y="170" text-anchor="middle" fill="currentColor" stroke="none">g: tanh</text>
<rect x="265" y="150" width="50" height="30" rx="6" />
<text x="290" y="170" text-anchor="middle" fill="currentColor" stroke="none">o: σ</text>
<line x1="110" y1="150" x2="110" y2="62" />
<circle cx="200" cy="105" r="12" />
<text x="200" y="110" text-anchor="middle" fill="currentColor" stroke="none">×</text>
<line x1="170" y1="150" x2="192" y2="114" />
<line x1="230" y1="150" x2="208" y2="114" />
<line x1="200" y1="93" x2="200" y2="62" />
<line x1="340" y1="50" x2="340" y2="78" />
<rect x="318" y="78" width="44" height="24" rx="6" />
<text x="340" y="95" text-anchor="middle" fill="currentColor" stroke="none">tanh</text>
<line x1="340" y1="102" x2="340" y2="118" />
<circle cx="340" cy="130" r="12" />
<text x="340" y="135" text-anchor="middle" fill="currentColor" stroke="none">×</text>
<line x1="290" y1="150" x2="331" y2="139" />
<line x1="352" y1="130" x2="430" y2="130" />
<text x="430" y="122" text-anchor="end" fill="currentColor" stroke="none">h(t)</text>
<line x1="10" y1="205" x2="290" y2="205" />
<line x1="110" y1="205" x2="110" y2="180" />
<line x1="170" y1="205" x2="170" y2="180" />
<line x1="230" y1="205" x2="230" y2="180" />
<line x1="290" y1="205" x2="290" y2="180" />
<text x="12" y="198" fill="currentColor" stroke="none">h(t−1), x(t)</text>
<text x="220" y="244" text-anchor="middle" fill="currentColor" stroke="none">forget · input · candidate · output, all read h(t−1) and x(t)</text>
</svg>
<figcaption>An LSTM cell. The cell state runs along the top and is changed only by a multiply (forget gate) and an add (input gate × candidate). The output gate decides how much of tanh(c(t)) becomes the hidden state h(t).</figcaption>
</figure>

### One LSTM step by hand

Use single numbers again. Previous hidden state hₜ₋₁ = 0.5, previous cell state cₜ₋₁ = 1.0, input xₜ = 1. Each gate has a weight for x, a weight for h, and a bias:

| Gate | weight on x | weight on h | bias | pre-activation z | after activation |
|---|---|---|---|---|---|
| forget f | 0.5 | 0.5 | 0 | 0.5·1 + 0.5·0.5 = 0.75 | σ(0.75) = 0.6792 |
| input i | 1.0 | −1.0 | 0 | 1 − 0.5 = 0.5 | σ(0.5) = 0.6225 |
| candidate g | 1.0 | 1.0 | −0.5 | 1 + 0.5 − 0.5 = 1.0 | tanh(1.0) = 0.7616 |
| output o | 0.5 | 1.0 | 0 | 0.5 + 0.5 = 1.0 | σ(1.0) = 0.7311 |

Now update the memory:

- Keep old memory: f × cₜ₋₁ = 0.6792 × 1.0 = 0.6792
- Add new memory: i × g = 0.6225 × 0.7616 = 0.4741
- New cell state: cₜ = 0.6792 + 0.4741 = **1.1532**
- New hidden state: hₜ = o × tanh(cₜ) = 0.7311 × tanh(1.1532) = 0.7311 × 0.8188 = **0.5986**

In words: the LSTM kept about 68% of its old memory, wrote about 62% of a new candidate, and showed about 73% of the squashed memory as its output.

### Why the LSTM does not forget so easily

Look at cₜ = fₜ · cₜ₋₁ + iₜ · gₜ. The path from cₜ₋₁ to cₜ is just a multiply by fₜ and an **add**: no weight matrix, no squashing tanh. In backprop, the gradient along the cell state is multiplied only by fₜ at each step. If the network learns to keep the forget gate near 1 for information that matters, the gradient passes back through many steps almost unchanged.

This is the same trick as ResNet's skip connection (see [Convolutional Neural Networks](/interview/deep-learning/convolutional-neural-networks)): an additive path lets gradients flow. A practical detail: the forget gate bias is often initialized to 1 so that, at the start, the LSTM remembers by default.

> **Interview tip:** A crisp answer to "how does LSTM solve vanishing gradients?": "The cell state is updated additively, c = f·c_prev + i·g, so the gradient along it is multiplied only by the forget gate, not by a weight matrix and a tanh slope each step. When the forget gate is near 1, gradients survive over long distances."

## GRU: a simpler gated RNN

The **GRU** (Gated Recurrent Unit, Cho et al., 2014) merges the cell state and hidden state into one, and uses two gates instead of three:

<div class="formula">

| Step | Formula |
|---|---|
| Update gate | zₜ = σ(W_z · [hₜ₋₁, xₜ]) — how much to replace the old state |
| Reset gate | rₜ = σ(W_r · [hₜ₋₁, xₜ]) — how much of the old state to use when making the candidate |
| Candidate | h̃ₜ = tanh(W · [rₜ ⊙ hₜ₋₁, xₜ]) |
| New state | hₜ = (1 − zₜ) ⊙ hₜ₋₁ + zₜ ⊙ h̃ₜ |

</div>

The update gate does the job of both the forget and input gates: whatever it takes from the old state, it gives to the new candidate. (PyTorch writes the same formula with the roles of z and 1 − z swapped; the idea is identical.)

| | Simple RNN | LSTM | GRU |
|---|---|---|---|
| State | h | h and c | h |
| Gates | none | forget, input, output | update, reset |
| Parameters (relative) | 1× | 4× | 3× |
| Long-range memory | poor | good | good |
| Speed | fastest | slowest | in between |
| When to use | very short sequences, teaching | default gated RNN, long sequences | smaller/faster alternative; often similar accuracy |

**Worked example: parameter count.** PyTorch's `nn.LSTM(input_size=64, hidden_size=128)` has, per gate, a 128 × 64 input matrix, a 128 × 128 hidden matrix and two bias vectors of 128 (PyTorch keeps separate input and hidden biases):

- Per gate: 128·64 + 128·128 + 128 + 128 = 8,192 + 16,384 + 256 = 24,832
- LSTM, 4 gates (i, f, g, o): 4 × 24,832 = **99,328**
- GRU, 3 gates: 3 × 24,832 = **74,496**

## RNNs and LSTMs in PyTorch

`nn.LSTM` processes a whole sequence in one call. The most common confusion is the shapes.

```python
import torch
from torch import nn

lstm = nn.LSTM(input_size=64, hidden_size=128, num_layers=1, batch_first=True)
x = torch.randn(8, 20, 64)            # (batch=8, seq_len=20, features=64)

output, (h_n, c_n) = lstm(x)
print(output.shape)   # torch.Size([8, 20, 128])  hidden state at EVERY time step
print(h_n.shape)      # torch.Size([1, 8, 128])   final hidden state (num_layers, batch, hidden)
print(c_n.shape)      # torch.Size([1, 8, 128])   final cell state
print(sum(p.numel() for p in lstm.parameters()))   # 99328
```

- `batch_first=True` makes the input (batch, seq, features). The default is (seq, batch, features), a common source of bugs.
- `output` has the top layer's hidden state for every step: use it for many-to-many tasks (tagging each word).
- `h_n` has the last step's hidden state for every layer: use `h_n[-1]` for many-to-one tasks (classifying the whole sequence).
- `bidirectional=True` runs a second LSTM from right to left and joins both, so each position sees past and future words. The hidden size of `output` doubles.
- `num_layers=2` stacks LSTMs; the second reads the first one's outputs.

### A sentiment classifier

```python
class SentimentLSTM(nn.Module):
    def __init__(self, vocab_size=20_000, embed_dim=128, hidden=128, num_classes=2):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim, padding_idx=0)  # token id -> vector
        self.lstm = nn.LSTM(embed_dim, hidden, batch_first=True)
        self.head = nn.Linear(hidden, num_classes)

    def forward(self, token_ids):             # (batch, seq_len) of integer token ids
        x = self.embed(token_ids)             # (batch, seq_len, embed_dim)
        _, (h_n, _) = self.lstm(x)            # h_n: (1, batch, hidden)
        return self.head(h_n[-1])             # (batch, num_classes) logits

model = SentimentLSTM()
batch = torch.randint(1, 20_000, (4, 30))     # 4 reviews, 30 tokens each
print(model(batch).shape)                      # torch.Size([4, 2])
```

An **embedding layer** (`nn.Embedding`) is a lookup table that turns each token ID into a learned vector (see [Word Embeddings](/interview/nlp-transformers/word-embeddings)). Sentences in a batch have different lengths, so shorter ones are **padded** with a special ID (0 here). For best results with padding, use `nn.utils.rnn.pack_padded_sequence` so the LSTM stops at each sequence's real end; otherwise `h_n` for a short review is computed after reading many padding tokens.

> **Common mistake:** Forgetting `batch_first=True` and feeding (batch, seq, features). PyTorch will not raise an error if the shapes happen to fit; it will silently treat the batch as time steps and your model will learn nonsense.

## Why Transformers replaced RNNs

| Problem with RNNs | How Transformers solve it |
|---|---|
| **Sequential**: step t must wait for step t − 1, so a 1,000-token sequence needs 1,000 steps; GPUs cannot parallelize across time | self-attention processes all positions at once in big matrix multiplies |
| **Long-range memory** still fades, even in LSTMs, beyond a few hundred steps | attention connects any two positions directly in one step |
| **Bottleneck**: in sequence-to-sequence models, the whole input is squeezed into one fixed-size vector | the decoder attends to every encoder state |
| Hard to scale to billions of parameters and huge datasets | scales very well with data and compute |

Attention was first added **on top of** RNN translation models in 2014–2015 to fix the bottleneck. The 2017 paper "Attention Is All You Need" removed the recurrence completely. The full story is in [From RNNs to Attention](/interview/nlp-transformers/from-rnns-to-attention).

Where recurrent ideas still matter:

- **Streaming and on-device** tasks (keyword spotting, small sensors), where a fixed-size state and constant work per step are valuable.
- **Time-series** forecasting with small data, where LSTMs and GRUs are strong, simple baselines (gradient-boosted trees on lag features are also strong).
- **State-space models** such as Mamba, and other "linear recurrent" architectures, are a modern revival: they train in parallel like Transformers but run like an RNN at inference, with memory that does not grow with sequence length. Treat them as an active research area in 2026.

## Key terms

| Term | Simple meaning |
|---|---|
| Sequence | Ordered data where position matters (text, audio, time series) |
| Time step | One position in the sequence |
| RNN | Network that updates a hidden state at each time step with shared weights |
| Hidden state | The RNN's memory vector, updated every step |
| Unrolling | Drawing the RNN as one copy per time step |
| Many-to-one / many-to-many | Sequence in, one output / an output per step |
| Sequence-to-sequence | Sequence in, a different-length sequence out |
| BPTT | Backpropagation through the unrolled RNN |
| Vanishing / exploding gradients | Gradients shrinking / growing over many steps |
| LSTM | RNN with a cell state and forget, input and output gates |
| Cell state | The LSTM's long-term memory line, updated additively |
| Gate | Sigmoid layer (0 to 1) that controls how much of a signal passes |
| Forget gate | Decides what to erase from the cell state |
| Input gate | Decides how much new information to write |
| Candidate | The new information that could be written (tanh) |
| Output gate | Decides how much memory becomes the hidden state |
| GRU | Gated RNN with update and reset gates and no separate cell state |
| Bidirectional RNN | Two RNNs, left-to-right and right-to-left, combined |
| Embedding layer | Lookup table from token ID to a learned vector |
| Padding | Filler tokens so sequences in a batch have the same length |
| State-space model | Modern architecture with RNN-like inference and parallel training |

## Interview questions

**What is the hidden state in an RNN?**
It is a vector that summarizes everything the network has read so far. At each step, the RNN combines the previous hidden state with the current input using shared weights and a tanh to produce the new hidden state. It is the network's memory.

**Why do plain RNNs struggle with long sequences?**
During backpropagation through time, the gradient is multiplied by the recurrent weight matrix and the tanh slope once per time step. Over many steps this product shrinks towards zero or blows up. Vanishing gradients mean the network cannot learn dependencies more than a few steps apart.

**Explain the LSTM gates.**
The forget gate decides what to erase from the cell state, the input gate decides how much of the new candidate information to write, and the output gate decides how much of the (tanh-squashed) cell state to expose as the hidden state. All gates are sigmoids of the current input and previous hidden state, so they output values between 0 and 1.

**How does an LSTM solve the vanishing gradient problem?**
The cell state is updated additively: c = f·c_prev + i·g. The gradient along the cell state is multiplied only by the forget gate at each step, not by a weight matrix and an activation slope. When the forget gate stays near 1, gradients flow back over many steps, similar to a residual connection.

**What is the difference between LSTM and GRU?**
A GRU has two gates (update and reset) and no separate cell state, so it has about 25% fewer parameters than an LSTM and runs faster. An LSTM has three gates and a separate cell state. Accuracy is often similar; LSTM is sometimes better on very long or complex sequences.

**What do `output` and `h_n` contain in `nn.LSTM`?**
`output` has the last layer's hidden state at every time step, shape (batch, seq, hidden) with `batch_first=True`. `h_n` has the final time step's hidden state for every layer, shape (num_layers × directions, batch, hidden). Use `output` for per-token tasks and `h_n[-1]` for whole-sequence classification.

**Why did Transformers replace RNNs?**
RNNs process tokens one after another, so they cannot use GPU parallelism across time, and their memory of distant tokens still fades. Self-attention lets every token look at every other token directly and processes the whole sequence in parallel, which trains much faster and scales to huge models and datasets.

**How do you handle exploding gradients in RNNs?**
Gradient clipping: before the optimizer step, rescale the gradients if their overall norm exceeds a threshold like 1.0 (`torch.nn.utils.clip_grad_norm_`). Lower learning rates and gated architectures also help.

**What is a bidirectional LSTM and when can you not use it?**
It runs one LSTM forward and one backward over the sequence and combines their states, so each position knows both its past and future context. It is good for tagging or classification of complete sentences. You cannot use it for real-time generation or streaming, because the future is not available yet.

**When might you still choose an LSTM today?**
For small time-series datasets, low-latency streaming on small devices, or when sequences are short and compute is very limited. For most text tasks, a pretrained Transformer is better.

## Try it yourself

1. Run the scalar RNN by hand with Wₓ = 1, Wₕ = 0.5, b = 0, h₀ = 0 on x = [2, 0, 0]. How fast does the memory of x₁ fade? *Hint:* after step 1, the input is zero, so only Wₕ·h matters.
2. Repeat the LSTM step by hand, but change the forget gate bias to −3 (so f ≈ σ(−2.25)). What happens to the old memory? *Hint:* σ(−2.25) ≈ 0.095.
3. Compute the parameters of `nn.GRU(input_size=32, hidden_size=64)`. *Hint:* 3 × (64·32 + 64·64 + 64 + 64).
4. Write a PyTorch many-to-many model that predicts a label for every token: Embedding → bidirectional LSTM → Linear. Check that the output shape is (batch, seq_len, num_tags). *Hint:* the Linear input size is 2 × hidden.

### Answers

1. h₁ = tanh(2) = 0.9640. h₂ = tanh(0.5 × 0.9640) = tanh(0.4820) = 0.4479. h₃ = tanh(0.5 × 0.4479) = tanh(0.2240) = 0.2203. Each step roughly halves the memory of x₁, which is the "fading memory" of plain RNNs.
2. z_f = 0.75 − 3 = −2.25, f ≈ 0.0953. Kept memory: 0.0953 × 1.0 = 0.0953. cₜ = 0.0953 + 0.4741 = 0.5694. The cell mostly erased its old memory and is now dominated by the new information.
3. Per gate: 64·32 + 64·64 + 128 = 2,048 + 4,096 + 128 = 6,272. Times 3 = 18,816.
4. One solution:

```python
class Tagger(nn.Module):
    def __init__(self, vocab=10_000, emb=100, hidden=64, num_tags=9):
        super().__init__()
        self.embed = nn.Embedding(vocab, emb, padding_idx=0)
        self.lstm = nn.LSTM(emb, hidden, batch_first=True, bidirectional=True)
        self.out = nn.Linear(2 * hidden, num_tags)

    def forward(self, ids):
        out, _ = self.lstm(self.embed(ids))   # (batch, seq, 2*hidden)
        return self.out(out)                  # (batch, seq, num_tags)

print(Tagger()(torch.randint(1, 10_000, (2, 15))).shape)   # torch.Size([2, 15, 9])
```

For the loss, reshape: `loss_fn(logits.reshape(-1, num_tags), tags.reshape(-1))`.

**Next:** [Transfer Learning and Pretrained Models](/interview/deep-learning/transfer-learning-and-pretrained-models)
