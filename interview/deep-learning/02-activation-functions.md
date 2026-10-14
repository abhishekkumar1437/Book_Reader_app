---
title: Activation Functions
part: Neural Network Basics
summary: Why networks need non-linearity, and how sigmoid, tanh, ReLU, Leaky ReLU, GELU, SiLU and softmax behave, with their derivatives, problems, worked numbers and a table of which to use where.
---

The activation function is the small piece of each neuron that bends straight lines into curves. Choosing it affects whether your network trains at all, how fast it trains, and how its outputs should be read. As an AI engineer you will pick activations when you design a model head, read them in model configs (`"hidden_act": "gelu"` in a Hugging Face config), and debug training problems caused by them.

> **In simple words:** An activation function is a simple non-linear function applied to each neuron's sum. Hidden layers usually use ReLU or GELU. The output layer uses sigmoid for yes/no, softmax for "pick one class", and nothing at all for predicting a number.

## Why non-linearity is needed

A neuron computes z = w·x + b. That is a linear function. As you saw in [From Neuron to Neural Network](/interview/deep-learning/from-neuron-to-neural-network), stacking linear layers gives only another linear layer, because W₂(W₁x) = (W₂W₁)x. A straight line cannot separate data shaped like a circle or a spiral.

A **non-linear** function is any function whose graph is not a straight line. Putting one after each layer lets the network combine many simple bends into very complex shapes. The activation is applied **element-wise**: to each number in the layer separately.

A good hidden-layer activation should be:

- **Non-linear**, so depth adds power.
- **Differentiable** (almost everywhere), because training uses its **derivative** (its slope). See [Derivatives, Gradients and the Chain Rule](/interview/math-for-ml/derivatives-gradients-and-the-chain-rule).
- **Not saturating**: its slope should not become nearly zero for large inputs. When the slope is near zero, the neuron stops learning. This is called **saturation**.
- **Cheap to compute**, because it runs billions of times.

<figure>
<svg viewBox="0 0 440 220" width="440" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<line x1="40" y1="140" x2="405" y2="140" stroke-width="1" />
<line x1="220" y1="30" x2="220" y2="200" stroke-width="1" />
<line x1="215" y1="90" x2="225" y2="90" stroke-width="1" />
<line x1="215" y1="190" x2="225" y2="190" stroke-width="1" />
<line x1="215" y1="40" x2="225" y2="40" stroke-width="1" />
<text x="208" y="94" text-anchor="end" fill="currentColor" stroke="none" font-size="11">1</text>
<text x="208" y="194" text-anchor="end" fill="currentColor" stroke="none" font-size="11">−1</text>
<text x="208" y="44" text-anchor="end" fill="currentColor" stroke="none" font-size="11">2</text>
<text x="400" y="156" text-anchor="end" fill="currentColor" stroke="none" font-size="11">z = 4</text>
<text x="44" y="156" fill="currentColor" stroke="none" font-size="11">z = −4</text>
<polyline points="40,139 51,139 62,139 74,138 85,138 96,137 108,136 119,135 130,134 141,133 152,131 164,129 175,127 186,124 198,121 209,118 220,115 231,112 242,109 254,106 265,103 276,101 288,99 299,97 310,96 321,95 332,94 344,93 355,92 366,92 378,91 389,91 400,91" />
<polyline points="40,190 51,190 62,190 74,190 85,190 96,190 108,189 119,189 130,188 141,187 152,185 164,182 175,178 186,172 198,163 209,152 220,140 231,128 242,117 254,108 265,102 276,98 288,95 299,93 310,92 321,91 332,91 344,90 355,90 366,90 378,90 389,90 400,90" stroke-dasharray="5 4" />
<polyline points="40,140 220,140 310,40" stroke="var(--accent)" stroke-width="2.5" />
<line x1="50" y1="30" x2="75" y2="30" />
<text x="80" y="34" fill="currentColor" stroke="none">sigmoid (0 to 1)</text>
<line x1="50" y1="50" x2="75" y2="50" stroke-dasharray="5 4" />
<text x="80" y="54" fill="currentColor" stroke="none">tanh (−1 to 1)</text>
<line x1="50" y1="70" x2="75" y2="70" stroke="var(--accent)" stroke-width="2.5" />
<text x="80" y="74" fill="var(--accent)" stroke="none" font-weight="bold">ReLU</text>
</svg>
<figcaption>Sigmoid and tanh flatten out at both ends (they saturate); ReLU is flat for negative z but keeps a slope of 1 for all positive z.</figcaption>
</figure>

## Sigmoid

<div class="formula">

| Formula | Meaning |
|---|---|
| σ(z) = 1 / (1 + e⁻ᶻ) | output between 0 and 1 |
| σ′(z) = σ(z) · (1 − σ(z)) | derivative; largest value is 0.25 at z = 0 |

</div>

The **sigmoid** squashes any number into the range 0 to 1. Big positive z gives nearly 1, big negative z gives nearly 0, and z = 0 gives exactly 0.5. Because the output looks like a probability, sigmoid is the standard **output** activation for **binary classification** (two classes, such as spam / not spam) and for **multi-label** problems (each label is its own yes/no, such as "this movie is action AND comedy").

**Worked example.** σ(2) = 1 / (1 + e⁻²) = 1 / (1 + 0.1353) = 1 / 1.1353 ≈ 0.8808. Its slope there: 0.8808 × (1 − 0.8808) = 0.8808 × 0.1192 ≈ 0.105.

Problems in hidden layers:

1. **Saturation and vanishing gradients.** The slope is at most 0.25. For z = 5, σ′ ≈ 0.0066. During backpropagation, gradients are multiplied by these slopes layer after layer. Ten sigmoid layers can shrink a gradient by up to 0.25¹⁰ ≈ 0.00000095. Early layers then barely learn. This is the **vanishing gradient** problem.
2. **Not zero-centred.** Outputs are always positive, which makes gradient updates zig-zag and slows training.
3. **Uses an exponential**, which is a bit slower than simple comparisons.

> **Common mistake:** Using sigmoid in hidden layers of a deep network because "it is the classic one". Use it at the output for binary or multi-label tasks, and inside gates of LSTMs (where a 0-to-1 "how much to let through" value is exactly what you want). Use ReLU-family functions in hidden layers.

## Tanh

<div class="formula">

| Formula | Meaning |
|---|---|
| tanh(z) = (eᶻ − e⁻ᶻ) / (eᶻ + e⁻ᶻ) = 2σ(2z) − 1 | output between −1 and 1 |
| tanh′(z) = 1 − tanh²(z) | derivative; largest value is 1 at z = 0 |

</div>

**Tanh** (hyperbolic tangent) has the same S-shape as sigmoid but goes from −1 to 1, and it is **zero-centred**, so training is usually faster than with sigmoid. Its maximum slope is 1 instead of 0.25. But it still saturates at both ends, so deep tanh networks still suffer from vanishing gradients. Tanh is used inside RNNs and LSTMs to keep the hidden state between −1 and 1 (see [Recurrent Networks and LSTM](/interview/deep-learning/recurrent-networks-and-lstm)).

**Worked example.** tanh(1) ≈ 0.7616. Slope: 1 − 0.7616² = 1 − 0.5800 = 0.42.

## ReLU

<div class="formula">

| Formula | Meaning |
|---|---|
| ReLU(z) = max(0, z) | negative becomes 0, positive passes unchanged |
| ReLU′(z) = 1 if z > 0, 0 if z < 0 | slope is either 1 or 0 (at exactly 0, frameworks use 0) |

</div>

**ReLU** (Rectified Linear Unit) became the default hidden activation around 2011–2012, and it is a big reason deep networks became trainable. Why it works so well:

- **No saturation for positive inputs.** The slope is exactly 1, so gradients pass back through active neurons without shrinking.
- **Very cheap**: one comparison, no exponential.
- **Sparse activations**: many neurons output exactly 0 for a given input, which acts like a simple form of feature selection.

Its problem is the **dying ReLU**. If a neuron's z becomes negative for every training example (for example after a too-large update caused by a high learning rate), its output and its slope are always 0. No gradient flows into it, so it can never recover. It is "dead". In a badly tuned network a large fraction of neurons can die.

> **Real-life example:** ReLU is like a one-way water valve. Water pushing forward flows freely. Water pushing backward is stopped completely. A dead ReLU is a valve stuck shut.

## Leaky ReLU, PReLU and ELU

**Leaky ReLU** fixes dying ReLU by giving negative inputs a small slope instead of zero:

<div class="formula">

| Function | Formula | Notes |
|---|---|---|
| Leaky ReLU | z if z > 0, else 0.01·z | slope 0.01 for negatives, never fully dead |
| PReLU | z if z > 0, else a·z | the slope a is learned |
| ELU | z if z > 0, else α(eᶻ − 1) | smooth, outputs can be negative, closer to zero-centred |

</div>

**Worked example.** Leaky ReLU(−2) = 0.01 × (−2) = −0.02, and its slope is 0.01, not 0. A small gradient still flows, so the neuron can come back to life.

## GELU and SiLU (the Transformer era)

Modern Transformers do not use plain ReLU in their feed-forward layers. They use smooth versions.

**GELU** (Gaussian Error Linear Unit): GELU(z) = z · Φ(z), where Φ(z) is the probability that a standard normal random number is less than z. In words: the input is multiplied by "how likely it is to be kept". Large positive z is kept almost fully, large negative z is almost removed, and around zero the curve is smooth with a small dip below zero. BERT and GPT-2/GPT-3 use GELU.

**SiLU**, also called **Swish**: SiLU(z) = z · σ(z). It has a similar smooth shape. Llama, Mistral, Qwen and many other open LLMs use it inside a gated feed-forward block called **SwiGLU**.

| z | Sigmoid | Tanh | ReLU | Leaky ReLU | GELU | SiLU |
|---|---|---|---|---|---|---|
| −2 | 0.119 | −0.964 | 0 | −0.02 | −0.045 | −0.238 |
| −1 | 0.269 | −0.762 | 0 | −0.01 | −0.159 | −0.269 |
| 0 | 0.5 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0.731 | 0.762 | 1 | 1 | 0.841 | 0.731 |
| 2 | 0.881 | 0.964 | 2 | 2 | 1.955 | 1.762 |

Why smooth activations? Their slope changes gradually instead of jumping from 0 to 1, which tends to give slightly better accuracy in very large models. They cost a little more compute than ReLU.

> **Interview tip:** If asked "why GELU in Transformers?", say: it is a smooth, non-monotonic version of ReLU; small negative values pass a little gradient, and empirically it trains large language models slightly better. Do not claim it is dramatically better; the difference is usually small.

## Softmax: the output layer for many classes

**Softmax** is not used in hidden layers. It is an output function that turns a vector of raw scores into a **probability distribution**: every value between 0 and 1, all values adding up to 1. The raw scores before softmax are called **logits**.

<div class="formula">

| Formula | Meaning |
|---|---|
| softmax(zᵢ) = eᶻⁱ / Σⱼ eᶻʲ | exponentiate each logit, divide by the total |
| softmax(z − max(z)) = softmax(z) | subtracting the max gives the same answer but avoids overflow |

</div>

**Worked example.** A model classifies a photo as cat, dog or bird. The logits are [2.0, 1.0, 0.1].

1. Exponentiate: e²·⁰ = 7.389, e¹·⁰ = 2.718, e⁰·¹ = 1.105.
2. Sum: 7.389 + 2.718 + 1.105 = 11.212.
3. Divide: 7.389 / 11.212 = 0.659, 2.718 / 11.212 = 0.242, 1.105 / 11.212 = 0.099.

So P(cat) ≈ 65.9%, P(dog) ≈ 24.2%, P(bird) ≈ 9.9%, and 0.659 + 0.242 + 0.099 = 1.000.

Why exponentiate instead of just dividing by the sum? Logits can be negative, and the exponential makes everything positive. It also **exaggerates differences**: the biggest logit gets a much bigger share, which is why it is called a "soft" max (a smooth version of picking the maximum).

**Numerical stability.** e¹⁰⁰⁰ overflows to infinity in a computer. Subtracting the largest logit first, [2.0, 1.0, 0.1] → [0, −1.0, −1.9], gives e⁰ = 1, e⁻¹ = 0.368, e⁻¹·⁹ = 0.150, sum 1.518, and the same probabilities 0.659, 0.242, 0.099. All libraries do this for you.

```python
import numpy as np

def softmax(z):
    z = z - np.max(z)          # stability trick: largest becomes 0
    e = np.exp(z)
    return e / e.sum()

print(softmax(np.array([2.0, 1.0, 0.1])).round(3))
# Output: [0.659 0.242 0.099]
print(softmax(np.array([1000.0, 999.0])).round(3))   # no overflow
# Output: [0.731 0.269]
```

### Sigmoid vs softmax at the output

| Task | Output activation | Loss in PyTorch |
|---|---|---|
| Binary (spam or not) | Sigmoid on 1 logit | `nn.BCEWithLogitsLoss` |
| Multi-class, exactly one correct (cat / dog / bird) | Softmax over K logits | `nn.CrossEntropyLoss` |
| Multi-label, several can be true (tags on a movie) | Sigmoid on each of K logits | `nn.BCEWithLogitsLoss` |
| Regression (price in ₹) | None (identity / linear) | `nn.MSELoss` or `nn.L1Loss` |

> **Common mistake:** Adding `nn.Softmax` as the last layer and then using `nn.CrossEntropyLoss`. `CrossEntropyLoss` already applies log-softmax inside, so it expects raw logits. Applying softmax twice gives wrong gradients and slow training. The same is true for `BCEWithLogitsLoss` and sigmoid. Apply softmax or sigmoid only at prediction time.

## Activations in PyTorch

```python
import torch
from torch import nn
import torch.nn.functional as F

z = torch.tensor([-2.0, -1.0, 0.0, 1.0, 2.0])

print(torch.sigmoid(z))        # tensor([0.1192, 0.2689, 0.5000, 0.7311, 0.8808])
print(torch.tanh(z))           # tensor([-0.9640, -0.7616, 0.0000, 0.7616, 0.9640])
print(F.relu(z))               # tensor([0., 0., 0., 1., 2.])
print(F.leaky_relu(z, 0.01))   # tensor([-0.0200, -0.0100, 0.0000, 1.0000, 2.0000])
print(F.gelu(z))               # tensor([-0.0455, -0.1587, 0.0000, 0.8413, 1.9545])
print(F.silu(z))               # tensor([-0.2384, -0.2689, 0.0000, 0.7311, 1.7616])

logits = torch.tensor([2.0, 1.0, 0.1])
print(F.softmax(logits, dim=0))  # tensor([0.6590, 0.2424, 0.0986])

# As layers inside a model:
mlp = nn.Sequential(nn.Linear(10, 32), nn.GELU(), nn.Linear(32, 3))
```

`dim` in softmax tells PyTorch which axis should sum to 1. For a batch of logits with shape (batch, classes), use `dim=1` (or `dim=-1`).

## Which activation to use where

| Place | Default choice | Why |
|---|---|---|
| Hidden layers of MLPs and CNNs | ReLU | fast, simple, works well |
| If many neurons die | Leaky ReLU or ELU | keeps a small gradient for negatives |
| Transformer feed-forward layers | GELU or SiLU / SwiGLU | smooth, slightly better for large models |
| RNN / LSTM hidden state | tanh | keeps state bounded in −1 to 1 |
| LSTM / GRU gates | sigmoid | gives a 0-to-1 "how much" value |
| Output: binary or multi-label | sigmoid | each output is a probability |
| Output: one class out of many | softmax | probabilities that sum to 1 |
| Output: regression | none | any real number allowed |

> **Remember:** ReLU for hidden layers, GELU/SiLU in Transformers, sigmoid for yes/no outputs and gates, softmax for "choose one class", nothing for regression.

## Key terms

| Term | Simple meaning |
|---|---|
| Activation function | Non-linear function applied to each neuron's sum |
| Non-linear | A function whose graph is not a straight line |
| Element-wise | Applied to each number separately |
| Derivative / slope | How fast the output changes when the input changes |
| Saturation | The function becomes flat, so its slope is nearly zero |
| Vanishing gradient | Gradients shrink layer by layer until early layers stop learning |
| Sigmoid | S-curve from 0 to 1 |
| Tanh | S-curve from −1 to 1, zero-centred |
| ReLU | max(0, z) |
| Dying ReLU | A ReLU neuron stuck at 0 output, so it never learns again |
| Leaky ReLU | ReLU with a small slope (like 0.01) for negatives |
| PReLU | Leaky ReLU where the negative slope is learned |
| ELU | Smooth ReLU variant with negative outputs α(eᶻ − 1) |
| GELU | z · Φ(z), smooth ReLU used in BERT and GPT |
| SiLU / Swish | z · σ(z), used in SwiGLU blocks of Llama-style LLMs |
| Softmax | Turns logits into probabilities that sum to 1 |
| Logits | Raw output scores before sigmoid or softmax |
| Multi-label | Several labels can be true at once |

## Interview questions

**Why do neural networks need non-linear activation functions?**
Without them, any stack of layers equals one linear layer, because multiplying matrices gives another matrix. Non-linear activations let the network bend its decision boundary and represent complex functions. Depth is useless without them.

**Why is ReLU preferred over sigmoid in hidden layers?**
ReLU's slope is 1 for all positive inputs, so it does not saturate and gradients do not shrink as they pass through active neurons. Sigmoid's slope is at most 0.25 and near zero for large inputs, which causes vanishing gradients in deep networks. ReLU is also cheaper to compute.

**What is the dying ReLU problem and how do you fix it?**
A ReLU neuron whose input is negative for all examples outputs 0 and has a gradient of 0, so it never updates again. It is often caused by a learning rate that is too high or bad initialization. Fixes include a lower learning rate, good initialization (He/Kaiming), Leaky ReLU or ELU, and normalization layers.

**What is the derivative of sigmoid, and why does it matter?**
σ′(z) = σ(z)(1 − σ(z)), with a maximum of 0.25 at z = 0. In backpropagation the gradient is multiplied by this slope at every sigmoid layer, so the gradient can shrink by at least 4 times per layer. That is the root of the vanishing gradient problem with sigmoid.

**What is the difference between softmax and sigmoid at the output?**
Softmax turns K logits into one distribution that sums to 1, used when exactly one class is correct. Sigmoid treats each output independently as its own yes/no probability, used for binary or multi-label tasks. With softmax, raising one class's probability lowers the others; with sigmoid they are independent.

**Why do we subtract the max logit before softmax?**
Exponentials of large numbers overflow to infinity. Since softmax(z − c) = softmax(z) for any constant c, subtracting the maximum keeps all exponents ≤ 0 without changing the answer. Libraries do this automatically, and loss functions like `CrossEntropyLoss` combine log and softmax in a stable way.

**Why does `nn.CrossEntropyLoss` take logits instead of probabilities?**
It applies log-softmax internally using a numerically stable formula. If you pass softmax outputs, softmax is applied twice, the probabilities get squashed, and gradients become small and wrong. So the model should output raw logits during training.

**Which activation do modern LLMs use?**
GPT-2/GPT-3 and BERT use GELU. Many recent open models such as Llama, Mistral and Qwen use SiLU inside a SwiGLU gated feed-forward layer. Both are smooth versions of ReLU that train large Transformers slightly better.

**Is tanh better than sigmoid in hidden layers?**
Usually yes, because tanh is zero-centred and its maximum slope is 1 instead of 0.25. But both saturate, so for deep feed-forward networks ReLU-family activations are still preferred. Tanh remains common in RNN hidden states.

## Try it yourself

1. Compute softmax of logits [1.0, 2.0, 3.0] by hand. *Hint:* subtract 3 first, so you need e⁻², e⁻¹ and e⁰.
2. Compute the sigmoid slope σ′(z) at z = 0, 2 and 5. How many times smaller is it at z = 5 than at z = 0? *Hint:* σ(5) ≈ 0.9933.
3. Write a NumPy function that returns what fraction of ReLU neurons are "dead" (output 0 for every row) given a matrix of pre-activations with shape (examples, neurons). *Hint:* `(Z <= 0).all(axis=0)`.
4. Show that multiplying all logits by 2 makes softmax more confident, using logits [1, 0]. *Hint:* compare softmax([1, 0]) and softmax([2, 0]).

### Answers

1. Shifted logits [−2, −1, 0]: e⁻² = 0.135, e⁻¹ = 0.368, e⁰ = 1. Sum = 1.503. Probabilities: 0.090, 0.245, 0.665.
2. σ′(0) = 0.5 × 0.5 = 0.25. σ′(2) = 0.8808 × 0.1192 ≈ 0.105. σ′(5) = 0.9933 × 0.0067 ≈ 0.0066. So it is about 0.25 / 0.0066 ≈ 38 times smaller at z = 5.
3. One solution:

```python
import numpy as np

def dead_fraction(Z):
    dead = (Z <= 0).all(axis=0)     # True for neurons never positive
    return dead.mean()

Z = np.array([[ 1.0, -2.0, -0.5],
              [ 0.3, -1.0,  2.0],
              [-0.2, -3.0,  0.1]])
print(dead_fraction(Z))   # Output: 0.3333... (only neuron 2 is dead)
```

4. softmax([1, 0]): e¹ = 2.718, e⁰ = 1, so [2.718/3.718, 1/3.718] = [0.731, 0.269]. softmax([2, 0]): e² = 7.389, so [7.389/8.389, 1/8.389] = [0.881, 0.119]. Bigger gaps between logits give more confident probabilities. This is the idea behind the temperature setting in LLMs.

**Next:** [Loss Functions and Backpropagation](/interview/deep-learning/loss-functions-and-backpropagation)
