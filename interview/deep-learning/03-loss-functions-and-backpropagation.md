---
title: Loss Functions and Backpropagation
part: Neural Network Basics
summary: How a loss function scores the network's mistakes (MSE, MAE, binary and categorical cross-entropy), how a computational graph and the chain rule give every gradient, a full backpropagation by hand on a 2-2-1 network, and why gradients vanish or explode.
---

A network with random weights gives random answers. To improve, it needs two things: a single number that says how wrong it is (the loss), and a way to find out how each weight should change to make that number smaller (backpropagation). Every training run you ever start, from a small classifier to fine-tuning an LLM, is this loop repeated millions of times. Interviewers love asking you to explain backprop, and the best way to explain it is to have done it by hand once. You will do that in this chapter.

> **In simple words:** The loss measures how wrong the predictions are. Backpropagation uses the chain rule to compute, for every weight, "if I increase this weight a tiny bit, how much does the loss change?" Then gradient descent moves each weight a small step in the direction that lowers the loss.

## What a loss function is

A **loss function** takes the model's prediction ŷ and the true answer y and returns one number. Small loss = good predictions, large loss = bad predictions. Training means **minimizing** the average loss over the training data. People also call it the **cost function** or **objective**. (Some books use "loss" for one example and "cost" for the average; in practice the words are mixed.)

Why one number? Because we can only "go downhill" on one thing at a time. If you want several things (accuracy and small weights), you combine them into one number, for example loss + λ · (size of weights).

The loss must be **differentiable**: we need its slope with respect to the predictions. That is why we train with cross-entropy instead of accuracy. Accuracy jumps in steps (a prediction is either right or wrong), so its slope is zero almost everywhere and gives no direction to move.

## Losses for regression

**Regression** means predicting a number, like a house price or tomorrow's temperature. (More detail in [Gradient Descent and Loss Functions](/interview/machine-learning/gradient-descent-and-loss-functions).)

<div class="formula">

| Loss | Formula | Behaviour |
|---|---|---|
| MSE (mean squared error) | (1/n) Σ (yᵢ − ŷᵢ)² | big errors punished a lot (squared); sensitive to outliers |
| MAE (mean absolute error) | (1/n) Σ \|yᵢ − ŷᵢ\| | every unit of error counts the same; robust to outliers |
| Huber / Smooth L1 | squared for small errors, absolute for large ones | a mix of both |

</div>

**Worked example.** Three houses with true prices y = [3, 5, 2] (in ₹ crore) and predictions ŷ = [2.5, 5.5, 4].

- Errors y − ŷ: 0.5, −0.5, −2
- Squares: 0.25, 0.25, 4
- MSE = (0.25 + 0.25 + 4) / 3 = 4.5 / 3 = **1.5**
- Absolute errors: 0.5, 0.5, 2, so MAE = 3 / 3 = **1.0**

Notice that the single big error (2) contributes 4 out of 4.5 to the MSE. MSE "cares" most about the worst predictions.

## Losses for classification: cross-entropy

### Binary cross-entropy

For a yes/no task, the model outputs ŷ = probability of "yes" (after a sigmoid). The **binary cross-entropy (BCE)**, also called **log loss**, is:

<div class="formula">

| Formula | Meaning |
|---|---|
| L = −[ y · ln(ŷ) + (1 − y) · ln(1 − ŷ) ] | if y = 1 this is −ln(ŷ); if y = 0 it is −ln(1 − ŷ) |

</div>

**Worked example.** The true label is y = 1 (the email is spam).

| Model says ŷ | Loss −ln(ŷ) | Comment |
|---|---|---|
| 0.9 | 0.105 | confident and right: tiny loss |
| 0.5 | 0.693 | unsure: medium loss |
| 0.1 | 2.303 | confident and wrong: big loss |
| 0.001 | 6.908 | very confident and wrong: huge loss |

Cross-entropy punishes **confident wrong answers** very hard. That is exactly what we want from a classifier.

### Categorical cross-entropy

For K classes, the model outputs logits, softmax turns them into probabilities p₁ … p_K (see [Activation Functions](/interview/deep-learning/activation-functions)), and the loss is:

<div class="formula">

| Formula | Meaning |
|---|---|
| L = −Σₖ yₖ · ln(pₖ) = −ln(p_true) | y is one-hot, so only the true class's probability matters |
| ∂L/∂zₖ = pₖ − yₖ | gradient with respect to each logit: prediction minus target |

</div>

**Worked example.** Logits for [cat, dog, bird] are [2.0, 1.0, 0.1], so softmax gives p = [0.659, 0.242, 0.099].

- If the true class is cat: L = −ln(0.659) = **0.417**.
- If the true class is bird: L = −ln(0.099) = **2.317**.

The gradient for the "cat" case is p − y = [0.659 − 1, 0.242 − 0, 0.099 − 0] = **[−0.341, 0.242, 0.099]**. Negative for cat means "raise the cat logit"; positive for the others means "lower them". This beautifully simple formula, prediction minus target, also holds for sigmoid + BCE, and you will use it in the backprop example below.

### Why not MSE for classification?

1. With a sigmoid output, MSE's gradient includes the sigmoid slope σ′(z), which is nearly 0 when the model is confidently wrong. So the model learns slowest exactly when it is most wrong. Cross-entropy's gradient is just ŷ − y, which is large when the model is badly wrong.
2. Cross-entropy comes from **maximum likelihood**: minimizing it is the same as making the observed labels as probable as possible under the model. It is the statistically natural choice.

### Loss functions in PyTorch

| Task | PyTorch loss | Model output it expects |
|---|---|---|
| Regression | `nn.MSELoss()`, `nn.L1Loss()`, `nn.HuberLoss()` | any real numbers |
| Binary / multi-label | `nn.BCEWithLogitsLoss()` | raw logits (sigmoid is inside) |
| Multi-class | `nn.CrossEntropyLoss()` | raw logits of shape (batch, K) and integer class labels of shape (batch,) |

```python
import torch
from torch import nn

ce = nn.CrossEntropyLoss()
logits = torch.tensor([[2.0, 1.0, 0.1]])   # shape (1, 3): one example, 3 classes
target = torch.tensor([0])                  # true class index = 0 (cat)
print(ce(logits, target))                   # tensor(0.4170)

bce = nn.BCEWithLogitsLoss()
print(bce(torch.tensor([0.87]), torch.tensor([1.0])))   # tensor(0.3499)
```

> **Common mistake:** Passing one-hot vectors or float labels to `CrossEntropyLoss` when you meant class indices, or passing labels of shape (batch, 1). The normal input is integer class indices with shape (batch,) and dtype `torch.long`.

## Gradients and the chain rule

Training uses **gradient descent** (see [Gradient Descent and Loss Functions](/interview/machine-learning/gradient-descent-and-loss-functions)):

<div class="formula">

| Formula | Meaning |
|---|---|
| w ← w − η · ∂L/∂w | move each weight against its gradient; η (eta) is the learning rate |

</div>

The **gradient** ∂L/∂w answers: "if w goes up by a tiny amount, how much does L go up?" If it is positive, decrease w. If it is negative, increase w.

A network is a long chain of simple functions. The **chain rule** (see [Derivatives, Gradients and the Chain Rule](/interview/math-for-ml/derivatives-gradients-and-the-chain-rule)) says that for a chain, you multiply the local slopes:

<div class="formula">

| Formula | Meaning |
|---|---|
| If L depends on z and z depends on w: ∂L/∂w = ∂L/∂z · ∂z/∂w | multiply slopes along the path |
| If w affects L through several paths: add the products of all paths | multivariable chain rule |

</div>

> **Real-life example:** A UPI cashback offer. Your cashback grows 2 rupees for every ₹100 you spend, and your spending grows ₹300 for every extra day of a sale. So cashback grows 2 × 3 = 6 rupees per extra sale day. Rates multiply along the chain.

### The computational graph

A **computational graph** draws a calculation as boxes (operations) connected by arrows (values). Frameworks like PyTorch build this graph automatically while running your forward pass, then walk it backward to compute gradients.

Take a one-weight model with squared error: L = (w·x + b − y)². Use w = 3, x = 2, b = 1, y = 10.

**Forward pass (left to right):**

- u = w · x = 3 × 2 = 6
- z = u + b = 6 + 1 = 7
- e = z − y = 7 − 10 = −3
- L = e² = 9

**Backward pass (right to left).** Start with ∂L/∂L = 1. At each box, multiply the incoming gradient by that box's local slope.

- Square box: ∂L/∂e = 2e = 2 × (−3) = **−6**
- Minus box (z − y): ∂e/∂z = 1, so ∂L/∂z = −6 × 1 = **−6**
- Plus box (u + b): passes the gradient to both inputs unchanged. ∂L/∂u = **−6**, ∂L/∂b = **−6**
- Times box (w · x): the gradient for w is "incoming × the other input". ∂L/∂w = −6 × x = −6 × 2 = **−12**. And ∂L/∂x = −6 × w = −6 × 3 = −18.

<figure>
<svg viewBox="0 0 440 180" width="440" height="180" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<rect x="10" y="20" width="60" height="28" rx="6" />
<text x="40" y="39" text-anchor="middle" fill="currentColor" stroke="none">w = 3</text>
<rect x="10" y="80" width="60" height="28" rx="6" />
<text x="40" y="99" text-anchor="middle" fill="currentColor" stroke="none">x = 2</text>
<line x1="70" y1="34" x2="100" y2="56" />
<line x1="70" y1="94" x2="100" y2="72" />
<circle cx="115" cy="64" r="16" />
<text x="115" y="69" text-anchor="middle" fill="currentColor" stroke="none">×</text>
<rect x="85" y="120" width="60" height="28" rx="6" />
<text x="115" y="139" text-anchor="middle" fill="currentColor" stroke="none">b = 1</text>
<line x1="131" y1="64" x2="184" y2="64" />
<line x1="140" y1="120" x2="190" y2="77" />
<circle cx="200" cy="64" r="16" />
<text x="200" y="69" text-anchor="middle" fill="currentColor" stroke="none">+</text>
<rect x="170" y="120" width="60" height="28" rx="6" />
<text x="200" y="139" text-anchor="middle" fill="currentColor" stroke="none">y = 10</text>
<line x1="216" y1="64" x2="269" y2="64" />
<line x1="225" y1="120" x2="275" y2="77" />
<circle cx="285" cy="64" r="16" />
<text x="285" y="69" text-anchor="middle" fill="currentColor" stroke="none">−</text>
<line x1="301" y1="64" x2="354" y2="64" />
<circle cx="370" cy="64" r="16" />
<text x="370" y="69" text-anchor="middle" fill="currentColor" stroke="none">x²</text>
<line x1="386" y1="64" x2="400" y2="64" />
<text x="404" y="69" fill="currentColor" stroke="none">L=9</text>
<text x="157" y="56" text-anchor="middle" fill="currentColor" stroke="none">u=6</text>
<text x="242" y="56" text-anchor="middle" fill="currentColor" stroke="none">z=7</text>
<text x="327" y="56" text-anchor="middle" fill="currentColor" stroke="none">e=−3</text>
<text x="157" y="84" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">−6</text>
<text x="242" y="84" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">−6</text>
<text x="327" y="84" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">−6</text>
<text x="418" y="88" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">1</text>
<text x="40" y="66" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">−12</text>
<text x="40" y="126" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">−18</text>
<text x="115" y="166" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">−6</text>
</svg>
<figcaption>Computational graph of L = (w·x + b − y)². Black labels are forward values; bold accent labels are the gradients of L flowing backward (∂L/∂w = −12, ∂L/∂b = −6).</figcaption>
</figure>

With learning rate η = 0.01: w becomes 3 − 0.01 × (−12) = 3.12 and b becomes 1 − 0.01 × (−6) = 1.06. New prediction: 3.12 × 2 + 1.06 = 7.30, closer to 10. New loss: (7.30 − 10)² = 7.29, down from 9.

Three patterns to remember at the boxes:

| Operation | Backward rule |
|---|---|
| Add (a + b) | copies the gradient to both inputs ("gradient distributor") |
| Multiply (a · b) | gradient for a = incoming × b; for b = incoming × a ("swap and multiply") |
| Function f(a) | gradient for a = incoming × f′(a) |
| Value used twice | add the gradients from both uses |

## Backpropagation by hand on a 2-2-1 network

**Backpropagation** ("backprop") is the algorithm that applies the chain rule backward through the whole network, layer by layer, reusing results so every gradient is computed in one backward sweep. Its cost is roughly the same as one or two forward passes, no matter how many weights there are. That efficiency is why we can train billions of parameters.

We use the network from [From Neuron to Neural Network](/interview/deep-learning/from-neuron-to-neural-network): inputs x = [1, 2], hidden layer with ReLU, output with sigmoid, loss BCE, and the true label **y = 1**.

### Step 1: forward pass (store everything)

| Quantity | Value |
|---|---|
| z₁ = 0.5·1 + 0.4·2 + 0.1 | 1.4 |
| z₂ = −0.3·1 + 0.6·2 − 0.2 | 0.7 |
| h₁ = ReLU(1.4), h₂ = ReLU(0.7) | 1.4, 0.7 |
| z = 0.8·1.4 + (−0.5)·0.7 + 0.1 | 0.87 |
| ŷ = σ(0.87) | 0.7047 |
| L = −ln(0.7047) | 0.3499 |

Backprop needs these stored values (the **activations**). That is why training uses much more memory than inference.

### Step 2: gradient at the output

For sigmoid followed by BCE, the slope of the loss with respect to the output's pre-activation z simplifies to:

- ∂L/∂z = ŷ − y = 0.7047 − 1 = **−0.2953**

(Why: ∂L/∂ŷ = −1/ŷ for y = 1, and ∂ŷ/∂z = ŷ(1 − ŷ). Multiply: −1/ŷ × ŷ(1 − ŷ) = −(1 − ŷ) = ŷ − 1.)

### Step 3: gradients of the output layer

The output is z = v₁h₁ + v₂h₂ + c, where v₁ = 0.8, v₂ = −0.5, c = 0.1. Using "swap and multiply":

- ∂L/∂v₁ = ∂L/∂z × h₁ = −0.2953 × 1.4 = **−0.4134**
- ∂L/∂v₂ = ∂L/∂z × h₂ = −0.2953 × 0.7 = **−0.2067**
- ∂L/∂c = ∂L/∂z × 1 = **−0.2953**

### Step 4: send the gradient back to the hidden neurons

- ∂L/∂h₁ = ∂L/∂z × v₁ = −0.2953 × 0.8 = **−0.2362**
- ∂L/∂h₂ = ∂L/∂z × v₂ = −0.2953 × (−0.5) = **+0.1476**

Read this as: "raising h₁ would lower the loss; raising h₂ would raise it". That makes sense, because h₂ has a negative weight to the output and we want the output to go up.

### Step 5: through the ReLU

ReLU's slope is 1 if its input was positive, 0 otherwise. Both z₁ = 1.4 and z₂ = 0.7 were positive, so the gradients pass through unchanged:

- ∂L/∂z₁ = −0.2362 × 1 = **−0.2362**
- ∂L/∂z₂ = 0.1476 × 1 = **0.1476**

(If z₂ had been negative, ∂L/∂z₂ would be 0, and h₂'s weights would get no update for this example. That is how ReLU neurons "die" if it happens for every example.)

### Step 6: gradients of the hidden layer

z₁ = w₁₁x₁ + w₁₂x₂ + b₁. Gradient for each weight = ∂L/∂z₁ × its input.

| Parameter | Formula | Gradient |
|---|---|---|
| w₁₁ (x₁ → h₁) | −0.2362 × 1 | −0.2362 |
| w₁₂ (x₂ → h₁) | −0.2362 × 2 | −0.4724 |
| b₁ | −0.2362 × 1 | −0.2362 |
| w₂₁ (x₁ → h₂) | 0.1476 × 1 | 0.1476 |
| w₂₂ (x₂ → h₂) | 0.1476 × 2 | 0.2953 |
| b₂ | 0.1476 × 1 | 0.1476 |

(0.1476 × 2 shows as 0.2953 because the unrounded value is 0.14763.)

We now have all 9 gradients.

### Step 7: update and check

Use learning rate η = 0.5 (large, just to see a clear change). New value = old − 0.5 × gradient.

| Parameter | Old | Gradient | New |
|---|---|---|---|
| w₁₁ | 0.5 | −0.2362 | 0.6181 |
| w₁₂ | 0.4 | −0.4724 | 0.6362 |
| b₁ | 0.1 | −0.2362 | 0.2181 |
| w₂₁ | −0.3 | 0.1476 | −0.3738 |
| w₂₂ | 0.6 | 0.2953 | 0.4524 |
| b₂ | −0.2 | 0.1476 | −0.2738 |
| v₁ | 0.8 | −0.4134 | 1.0067 |
| v₂ | −0.5 | −0.2067 | −0.3967 |
| c | 0.1 | −0.2953 | 0.2476 |

Run the forward pass again with the new weights: ŷ becomes **0.9062** and the loss drops from **0.3499 to 0.0985**. One step of backprop plus gradient descent made the network much more confident in the right answer.

### Backprop in matrix form

For any dense layer with z = W·a_prev + b and a = f(z), call δ = ∂L/∂z (the "error signal" of the layer). Then:

<div class="formula">

| Formula | Meaning |
|---|---|
| δ_last = ŷ − y | for sigmoid + BCE or softmax + cross-entropy |
| ∂L/∂W = δ · a_prevᵀ | outer product: error × input |
| ∂L/∂b = δ | bias gradient is the error itself |
| δ_prev = (Wᵀ · δ) ⊙ f′(z_prev) | send error back, multiply by the activation slope (⊙ = element-wise) |

</div>

### Checking it in NumPy (with a numerical gradient check)

A **gradient check** compares your analytic gradient with a numerical estimate: nudge one weight by a tiny ε and see how much the loss changes, (L(w + ε) − L(w)) / ε. If they match, your backprop is right.

```python
import numpy as np

sig = lambda z: 1 / (1 + np.exp(-z))
x, y = np.array([1.0, 2.0]), 1.0
W1 = np.array([[0.5, 0.4], [-0.3, 0.6]]); b1 = np.array([0.1, -0.2])
W2 = np.array([0.8, -0.5]);               b2 = 0.1

def loss(W1, b1, W2, b2):
    h = np.maximum(0, W1 @ x + b1)
    p = sig(W2 @ h + b2)
    return -(y * np.log(p) + (1 - y) * np.log(1 - p))

# forward, keeping intermediate values
z1 = W1 @ x + b1; h = np.maximum(0, z1); p = sig(W2 @ h + b2)

# backward
dz  = p - y                      # output error
dW2 = dz * h;  db2 = dz
dh  = dz * W2
dz1 = dh * (z1 > 0)              # ReLU slope: 1 if z1 > 0 else 0
dW1 = np.outer(dz1, x); db1 = dz1
print(dW1.round(4))              # [[-0.2362 -0.4724] [ 0.1476  0.2953]]

# numerical check for W1[0, 1]
eps = 1e-6
W1p = W1.copy(); W1p[0, 1] += eps
print((loss(W1p, b1, W2, b2) - loss(W1, b1, W2, b2)) / eps)   # about -0.4724
```

### The same in PyTorch: autograd does it for you

In PyTorch you never write the backward pass. You mark tensors with `requires_grad=True`, compute the loss, and call `.backward()`. PyTorch walks the computational graph and fills each tensor's `.grad`.

```python
import torch
import torch.nn.functional as F

x  = torch.tensor([1.0, 2.0])
W1 = torch.tensor([[0.5, 0.4], [-0.3, 0.6]], requires_grad=True)
b1 = torch.tensor([0.1, -0.2], requires_grad=True)
W2 = torch.tensor([0.8, -0.5], requires_grad=True)
b2 = torch.tensor(0.1, requires_grad=True)

z = W2 @ torch.relu(W1 @ x + b1) + b2
loss = F.binary_cross_entropy_with_logits(z, torch.tensor(1.0))
loss.backward()                 # backprop through the whole graph

print(round(loss.item(), 4))    # 0.3499
print(W1.grad)                  # tensor([[-0.2362, -0.4724], [ 0.1476,  0.2953]])
print(W2.grad, b2.grad)         # tensor([-0.4134, -0.2067]) tensor(-0.2953)
```

The numbers match our hand calculation exactly. More on autograd in [PyTorch Tensors and Autograd](/interview/deep-learning/pytorch-tensors-and-autograd).

> **Interview tip:** When asked "explain backpropagation", give three sentences: (1) do a forward pass and store intermediate values; (2) starting from the loss, apply the chain rule backward layer by layer, where each layer's gradient is the incoming gradient times its local derivative; (3) use the gradients in an optimizer step. Then mention it costs about the same as a forward pass and is implemented by autograd.

## Vanishing and exploding gradients

In Step 5, the gradient was multiplied by the ReLU slope. In a deep network, the gradient reaching layer 1 is a **product** of many such factors, one per layer (weight values times activation slopes). Products of many numbers behave badly:

| Factor per layer | After 10 layers | Effect |
|---|---|---|
| 0.25 (max sigmoid slope) | 0.25¹⁰ ≈ 0.000001 | gradient vanishes |
| 0.9 | 0.9¹⁰ ≈ 0.35 | shrinks |
| 1.0 | 1 | stable |
| 1.5 | 1.5¹⁰ ≈ 57.7 | gradient explodes |

- **Vanishing gradients**: early layers get almost zero gradient and stop learning. Training looks stuck; the loss plateaus. Classic causes: sigmoid/tanh activations, small initial weights, very deep or long (RNN) chains.
- **Exploding gradients**: gradients become huge, weights jump wildly, and the loss becomes `NaN` (not a number) or infinity. Classic causes: large initial weights, high learning rate, RNNs over long sequences.

| Fix | Helps with | How |
|---|---|---|
| ReLU-family activations | vanishing | slope 1 for positive inputs |
| Good initialization (He/Kaiming for ReLU, Xavier/Glorot for tanh) | both | keeps the variance of signals the same across layers |
| Batch norm / layer norm | both | keeps activations in a healthy range (see [Regularization, Dropout and Batch Norm](/interview/deep-learning/regularization-dropout-and-batch-norm)) |
| Residual (skip) connections | vanishing | gradient has a direct "highway" path (see [Convolutional Neural Networks](/interview/deep-learning/convolutional-neural-networks)) |
| LSTM / GRU gates | vanishing in RNNs | additive cell-state path (see [Recurrent Networks and LSTM](/interview/deep-learning/recurrent-networks-and-lstm)) |
| Gradient clipping | exploding | cap the gradient norm (see [Training in Practice](/interview/deep-learning/training-in-practice)) |
| Lower learning rate, warmup | exploding | smaller steps at the start |

> **Remember:** Gradient at an early layer = product of many per-layer factors. Factors below 1 make it vanish, above 1 make it explode. ReLU, good init, normalization, residuals and clipping keep the factors near 1.

## Key terms

| Term | Simple meaning |
|---|---|
| Loss function | One number that measures how wrong the predictions are |
| Cost / objective | Another name for the (average) loss being minimized |
| MSE | Mean of squared errors; for regression |
| MAE | Mean of absolute errors; robust to outliers |
| Huber loss | Squared for small errors, absolute for big ones |
| Binary cross-entropy / log loss | −[y ln ŷ + (1−y) ln(1−ŷ)]; for yes/no tasks |
| Categorical cross-entropy | −ln(probability of the true class); for multi-class |
| Maximum likelihood | Choosing parameters that make the observed data most probable |
| Gradient | How much the loss changes when a parameter changes slightly |
| Learning rate (η) | Size of each gradient descent step |
| Chain rule | Multiply slopes along a chain of functions |
| Computational graph | A diagram of operations and values that frameworks use for gradients |
| Backpropagation | Applying the chain rule backward through the network to get all gradients |
| Error signal (δ) | ∂L/∂z for a layer |
| Gradient check | Comparing analytic gradients with a numerical estimate |
| Vanishing gradient | Gradients become tiny in early layers |
| Exploding gradient | Gradients become huge, training diverges or gives NaN |
| He / Xavier initialization | Weight starting values scaled to keep signals stable |

## Interview questions

**Explain backpropagation in simple terms.**
After a forward pass, we know the loss. Backpropagation applies the chain rule from the loss backward through each layer, multiplying the incoming gradient by each layer's local derivative, to get the gradient of the loss with respect to every weight. It reuses intermediate results, so it costs about as much as a forward pass. The optimizer then uses these gradients to update the weights.

**Is backpropagation the same as gradient descent?**
No. Backpropagation only computes the gradients. Gradient descent (or Adam, etc.) is the optimizer that uses those gradients to update the weights. You can use backprop gradients with many different optimizers.

**Why use cross-entropy instead of MSE for classification?**
Cross-entropy with softmax or sigmoid gives a gradient of simply prediction minus target, which is large when the model is confidently wrong. MSE with a sigmoid multiplies by the sigmoid slope, which is near zero in that case, so learning is slow. Cross-entropy also follows from maximum likelihood.

**What is the gradient of softmax + cross-entropy with respect to the logits?**
It is p − y, the predicted probabilities minus the one-hot target. For logits [2, 1, 0.1] with true class 0, that is [−0.341, 0.242, 0.099]. This simple form is why the two are combined into one loss function.

**Why does training need more memory than inference?**
Backprop needs the intermediate activations from the forward pass to compute gradients, so they must be stored for every layer. The optimizer also stores gradients and its own state (Adam keeps two extra numbers per parameter). Inference can throw activations away as soon as the next layer is computed.

**What causes vanishing gradients, and how do you fix them?**
The gradient at an early layer is a product of many per-layer factors; if they are below 1, the product shrinks towards zero. Saturating activations like sigmoid are the classic cause. Fixes: ReLU-family activations, He initialization, batch or layer normalization, residual connections, and gated RNNs like LSTM.

**How would you detect exploding gradients?**
The loss suddenly jumps or becomes NaN or infinity, and the gradient norm (which you can log each step) spikes. Fix with gradient clipping, a lower learning rate, warmup, normalization, or better initialization.

**What is a gradient check and when would you use one?**
You compare the gradient from backprop with a numerical estimate (L(w + ε) − L(w − ε)) / 2ε for a few weights. If they match to several decimal places, your backward code is correct. It is useful when writing a custom layer or custom backward function; it is too slow to run during real training.

**What happens to the gradient at a ReLU whose input was negative?**
It becomes exactly zero, so the weights feeding that neuron get no update from that example. If this happens for all examples, the neuron is dead.

**Why can't we train with accuracy as the loss?**
Accuracy only changes when a prediction crosses the decision threshold, so tiny weight changes usually do not change it at all. Its gradient is zero almost everywhere and undefined at the jumps, so gradient descent gets no signal. We train on a smooth surrogate like cross-entropy and report accuracy as a metric.

## Try it yourself

1. For L = (w·x + b − y)² with w = 1, x = 3, b = 0, y = 6, compute L, ∂L/∂w and ∂L/∂b by hand. *Hint:* e = 3 − 6 = −3.
2. In the 2-2-1 example, change the true label to y = 0. Compute the new ∂L/∂z at the output and ∂L/∂v₁. *Hint:* the output error is still ŷ − y.
3. Compute the binary cross-entropy for y = 0 and ŷ = 0.8. *Hint:* only the (1 − y) ln(1 − ŷ) term remains.
4. Extend the NumPy backprop code to run 20 gradient descent steps with η = 0.5 and print the loss every 5 steps. *Hint:* put forward, backward and update in a loop.

### Answers

1. z = 3, e = −3, L = 9. ∂L/∂e = −6, ∂L/∂w = −6 × x = −18, ∂L/∂b = −6.
2. ∂L/∂z = 0.7047 − 0 = 0.7047 (positive: push the output down). ∂L/∂v₁ = 0.7047 × 1.4 ≈ 0.9866.
3. L = −ln(1 − 0.8) = −ln(0.2) ≈ 1.609.
4. One solution:

```python
import numpy as np

sig = lambda z: 1 / (1 + np.exp(-z))
x, y, lr = np.array([1.0, 2.0]), 1.0, 0.5
W1 = np.array([[0.5, 0.4], [-0.3, 0.6]]); b1 = np.array([0.1, -0.2])
W2 = np.array([0.8, -0.5]); b2 = 0.1

for step in range(1, 21):
    z1 = W1 @ x + b1; h = np.maximum(0, z1); p = sig(W2 @ h + b2)
    loss = -np.log(p)                      # y = 1
    dz = p - y
    dW2, db2 = dz * h, dz
    dz1 = dz * W2 * (z1 > 0)
    dW1, db1 = np.outer(dz1, x), dz1
    W1 -= lr * dW1; b1 -= lr * db1; W2 -= lr * dW2; b2 -= lr * db2
    if step % 5 == 0:
        print(step, round(loss, 5))
```

```text
5 0.02708
10 0.01123
15 0.0068
20 0.00477
```

The loss keeps falling towards 0 because the network is memorizing a single example.

**Next:** [Optimizers and Learning Rate](/interview/deep-learning/optimizers-and-learning-rate)
