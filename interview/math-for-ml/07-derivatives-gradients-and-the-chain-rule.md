---
title: Derivatives, Gradients and the Chain Rule
part: Calculus
summary: The derivative as a slope, the few rules you need, partial derivatives and the gradient, the chain rule, gradient descent on y = (x − 3)² by hand, and how backpropagation uses the chain rule to train every neural network.
---

Training a model means adjusting its weights to make the loss smaller. But a modern model has millions or billions of weights. Which way should each one move, and by how much? The **derivative** answers this for one weight, the **gradient** answers it for all weights at once, and the **chain rule** lets us compute it through many layers. Together they give **gradient descent** and **backpropagation**, the engine behind linear regression, neural networks and LLM training.

> **In simple words:** A derivative is a slope: how much the output changes when you nudge the input a little. The gradient is the list of slopes for every input, and it points uphill. To reduce the loss, take small steps in the opposite direction of the gradient. The chain rule multiplies slopes along a chain of functions, which is how backpropagation works.

## The derivative is a slope

Imagine driving. Your position changes over time. Your **speed** is how fast position changes: 60 km/h means each hour adds 60 km. Speed is the derivative of position with respect to time.

For a straight line y = 2x + 1, the **slope** is 2: every step of 1 in x raises y by 2. A curve does not have one slope; it is steeper in some places than others. The **derivative** f′(x) (read "f prime of x"), also written **df/dx**, is the slope of the curve at one point — the slope of the **tangent line** that just touches the curve there.

<figure>
<svg viewBox="0 0 420 220" width="420" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="40" y1="200" x2="300" y2="200" />
<line x1="40" y1="200" x2="40" y2="15" />
<text x="304" y="204" fill="currentColor" stroke="none">x</text>
<text x="30" y="12" fill="currentColor" stroke="none">y</text>
<polyline points="40,200 52,200 64,198 76,196 88,193 100,189 112,184 124,178 136,172 148,164 160,156 172,147 184,137 196,126 208,114 220,101 232,87 244,73 256,57 268,41 280,24" stroke-width="2" />
<line x1="160" y1="167" x2="280" y2="35" stroke="var(--accent)" stroke-width="2" />
<circle cx="220" cy="101" r="4" fill="var(--accent)" stroke="var(--accent)" />
<line x1="220" y1="101" x2="220" y2="200" stroke-dasharray="3 3" />
<text x="220" y="215" text-anchor="middle" fill="currentColor" stroke="none">3</text>
<line x1="100" y1="200" x2="100" y2="204" /><text x="100" y="215" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<line x1="160" y1="200" x2="160" y2="204" /><text x="160" y="215" text-anchor="middle" fill="currentColor" stroke="none">2</text>
<text x="230" y="110" fill="var(--accent)" stroke="none" font-weight="bold">(3, 9)</text>
<text x="290" y="60" fill="var(--accent)" stroke="none">tangent: slope 6</text>
<text x="290" y="80" fill="currentColor" stroke="none">curve: y = x²</text>
<text x="290" y="100" fill="currentColor" stroke="none">f′(x) = 2x</text>
<text x="290" y="120" fill="currentColor" stroke="none">f′(3) = 6</text>
</svg>
<figcaption>The curve y = x² is flat near 0 and steep near 3. At x = 3 the tangent line has slope 6, which is the derivative there.</figcaption>
</figure>

### Computing a slope with small numbers

You can estimate the slope by nudging x by a tiny amount h and seeing how much f changes:

```text
slope ≈ (f(x + h) − f(x)) ÷ h
```

**Worked example.** f(x) = x² at x = 3, with h = 0.001.

1. f(3) = 9
2. f(3.001) = 3.001 × 3.001 = 9.006001
3. Change in f = 9.006001 − 9 = 0.006001
4. Slope ≈ 0.006001 ÷ 0.001 = **6.001**

As h gets smaller, the answer gets closer to exactly **6**. The derivative is the value this ratio approaches as h goes to 0 (this is called a **limit**). The rule "the derivative of x² is 2x" gives 2 × 3 = 6 directly.

```python
def f(x):
    return x ** 2

h = 0.001
print((f(3 + h) - f(3)) / h)            # Output: 6.000999999999479
print((f(3 + h) - f(3 - h)) / (2 * h))  # Output: 5.999999999999339  (central difference, more accurate)
```

What the sign tells you:

- f′(x) > 0: f goes **up** when x increases.
- f′(x) < 0: f goes **down** when x increases.
- f′(x) = 0: flat — possibly a minimum or a maximum.

> **Remember:** The derivative answers: "If I increase this input by a tiny bit, how much does the output change, and in which direction?" For training, the input is a weight and the output is the loss.

## The rules you need

You do not need to compute limits. A short table of rules covers almost everything in ML.

<div class="formula">

| Function f(x) | Derivative f′(x) | Example |
|---|---|---|
| c (a constant) | 0 | f = 7 → 0 |
| x | 1 | |
| xⁿ (power rule) | n·xⁿ⁻¹ | x³ → 3x² |
| c·f(x) | c·f′(x) | 5x² → 10x |
| f(x) + g(x) (sum rule) | f′(x) + g′(x) | x² + x → 2x + 1 |
| f(x)·g(x) (product rule) | f′g + fg′ | x·eˣ → eˣ + x·eˣ |
| eˣ | eˣ | |
| ln x | 1/x | |
| f(g(x)) (chain rule) | f′(g(x))·g′(x) | (2x + 1)³ → 3(2x + 1)²·2 |
| sigmoid σ(x) = 1/(1 + e⁻ˣ) | σ(x)·(1 − σ(x)) | at x = 0: 0.5 × 0.5 = 0.25 |
| ReLU max(0, x) | 1 if x > 0, else 0 | |
| tanh x | 1 − tanh²x | |

</div>

**Worked example.** f(x) = 3x² + 2x + 1. Find f′(1).

1. 3x² → 3 × 2x = 6x (power rule and constant multiple)
2. 2x → 2
3. 1 → 0 (constant)
4. f′(x) = 6x + 2, so f′(1) = 6 + 2 = **8**

**Worked example.** f(x) = (x − 3)². Expand: x² − 6x + 9. Derivative: **2x − 6 = 2(x − 3)**. At x = 0: −6. At x = 3: 0, the bottom of the curve. We will use this function for gradient descent below.

> **Common mistake:** Forgetting that ReLU's derivative is exactly 0 for negative inputs. If a neuron's input is negative for every example, its gradient is always 0 and it never learns again. This is the **dying ReLU** problem; Leaky ReLU fixes it with a small slope like 0.01 for negatives.

## Partial derivatives

A loss depends on many weights at once. A **partial derivative** measures how the output changes when you nudge **one** input and keep all the others fixed. It is written with a curly ∂: ∂f/∂x ("partial f by partial x").

The method: treat every other variable as a constant, then use the normal rules.

**Worked example.** f(x, y) = x² + 3xy + y². Find both partial derivatives at (x, y) = (1, 2).

∂f/∂x (treat y as a constant):

1. x² → 2x
2. 3xy → 3y (3y is a constant multiplier of x)
3. y² → 0 (no x in it)
4. ∂f/∂x = 2x + 3y. At (1, 2): 2 + 6 = **8**

∂f/∂y (treat x as a constant):

1. x² → 0
2. 3xy → 3x
3. y² → 2y
4. ∂f/∂y = 3x + 2y. At (1, 2): 3 + 4 = **7**

Meaning: near (1, 2), increasing x by a tiny amount 0.01 raises f by about 0.08, and increasing y by 0.01 raises f by about 0.07.

## The gradient

Put all the partial derivatives into one vector. That vector is the **gradient**, written ∇f ("nabla f" or "grad f").

```text
∇f(x, y) = [∂f/∂x, ∂f/∂y]        at (1, 2):  ∇f = [8, 7]
```

Two key facts:

1. The gradient points in the direction of **steepest increase** of the function.
2. The **negative gradient** points in the direction of steepest **decrease**. That is the direction we want for the loss.

> **Real-life example:** You are on a hill in thick fog and want to reach the valley. You cannot see the valley, but you can feel the slope under your feet. So you step in the direction that goes down most steeply, check again, and repeat. That is gradient descent: the gradient is "the slope under your feet" for all directions at once.

```python
import numpy as np

def f(v):
    x, y = v
    return x**2 + 3*x*y + y**2

def numerical_gradient(func, v, h=1e-5):
    grad = np.zeros_like(v, dtype=float)
    for i in range(len(v)):
        step = np.zeros_like(v, dtype=float)
        step[i] = h
        grad[i] = (func(v + step) - func(v - step)) / (2 * h)   # nudge one input at a time
    return grad

print(numerical_gradient(f, np.array([1.0, 2.0])).round(4))    # Output: [8. 7.]
```

This **numerical gradient** is slow (two function calls per weight), but it is a great way to check that a hand-written gradient is correct. This is called **gradient checking**.

**Where in ML:** for a model with weights **w**, the gradient ∇L(**w**) has one entry per weight: "how much would the loss change if this weight increased a little?" A model with 7 billion parameters has a gradient with 7 billion numbers, computed once per training step.

## The chain rule

Models are chains of functions: input → layer 1 → activation → layer 2 → … → loss. To know how the loss changes when an early weight changes, you multiply the slopes along the chain. This is the **chain rule**:

```text
if y = f(u) and u = g(x), then  dy/dx = dy/du × du/dx
```

> **Real-life example:** A car goes 2 times as fast as a bicycle, and the bicycle goes 4 times as fast as a walker. So the car goes 2 × 4 = 8 times as fast as the walker. The rates multiply along the chain.

**Worked example.** y = (2x + 1)³. Find dy/dx at x = 1.

1. Name the inside: u = 2x + 1, so y = u³.
2. Outer slope: dy/du = 3u²
3. Inner slope: du/dx = 2
4. Multiply: dy/dx = 3u² × 2 = 6(2x + 1)²
5. At x = 1: u = 3, so dy/dx = 3 × 9 × 2 = **54**

Check numerically: (2 × 1.001 + 1)³ − 3³ = 3.002³ − 27 = 27.054036 − 27 = 0.054036; divided by 0.001 ≈ 54.04. Correct.

**Worked example: a sigmoid neuron.** a = σ(w·x + b), with x = 1, w = 0.5, b = 0. How does a change with w?

1. Inside: z = w·x + b = 0.5 × 1 + 0 = 0.5
2. a = σ(0.5) = 1 ÷ (1 + e⁻⁰·⁵) ≈ 1 ÷ (1 + 0.6065) ≈ **0.6225**
3. da/dz = σ(z)(1 − σ(z)) = 0.6225 × 0.3775 ≈ **0.235**
4. dz/dw = x = 1
5. da/dw = 0.235 × 1 = **0.235**

## Gradient descent by hand

**Gradient descent** repeats one simple update:

```text
x_new = x_old − η × f′(x_old)
```

η (eta) is the **learning rate**: how big a step to take. The minus sign moves us downhill.

Minimize f(x) = (x − 3)². We know the answer is x = 3, so we can watch the algorithm find it. The derivative is f′(x) = 2(x − 3). Start at x = 0 with η = 0.1.

**Step 1.**

1. Gradient: f′(0) = 2(0 − 3) = −6
2. Update: x = 0 − 0.1 × (−6) = 0 + 0.6 = **0.6**

**Step 2.**

1. Gradient: f′(0.6) = 2(0.6 − 3) = 2 × (−2.4) = −4.8
2. Update: x = 0.6 − 0.1 × (−4.8) = 0.6 + 0.48 = **1.08**

**Step 3.**

1. Gradient: f′(1.08) = 2(1.08 − 3) = 2 × (−1.92) = −3.84
2. Update: x = 1.08 + 0.384 = **1.464**

| Step | x | f(x) = (x − 3)² | Gradient 2(x − 3) | Step size η × gradient |
|---|---|---|---|---|
| 0 | 0 | 9 | −6 | −0.6 |
| 1 | 0.6 | 5.76 | −4.8 | −0.48 |
| 2 | 1.08 | 3.6864 | −3.84 | −0.384 |
| 3 | 1.464 | 2.3593 | −3.072 | −0.3072 |
| 4 | 1.7712 | 1.5099 | −2.4576 | −0.2458 |
| 5 | 2.017 | 0.9663 | −1.966 | −0.1966 |
| 10 | 2.6779 | 0.1037 | −0.644 | |

<figure>
<svg viewBox="0 0 420 210" width="420" height="210" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="20" y1="190" x2="380" y2="190" />
<polyline points="25,48 40,73 55,95 70,115 85,133 100,148 115,161 130,171 145,179 160,185 175,189 190,190 205,189 220,185 235,179 250,171 265,161 280,148 295,133 310,115 325,95 340,73 355,48" stroke-width="2" />
<circle cx="40" cy="73" r="4" fill="var(--accent)" stroke="var(--accent)" />
<circle cx="70" cy="115" r="4" fill="var(--accent)" stroke="var(--accent)" />
<circle cx="94" cy="142" r="4" fill="var(--accent)" stroke="var(--accent)" />
<circle cx="113" cy="159" r="4" fill="var(--accent)" stroke="var(--accent)" />
<circle cx="129" cy="170" r="4" fill="var(--accent)" stroke="var(--accent)" />
<circle cx="141" cy="177" r="4" fill="var(--accent)" stroke="var(--accent)" />
<path d="M 40 73 Q 52 85 70 115" stroke="var(--accent)" stroke-dasharray="3 2" />
<path d="M 70 115 Q 80 126 94 142" stroke="var(--accent)" stroke-dasharray="3 2" />
<text x="30" y="62" fill="var(--accent)" stroke="none">x=0</text>
<text x="74" y="108" fill="var(--accent)" stroke="none">0.6</text>
<text x="98" y="136" fill="var(--accent)" stroke="none">1.08</text>
<line x1="190" y1="186" x2="190" y2="194" />
<text x="190" y="206" text-anchor="middle" fill="currentColor" stroke="none">x = 3 (minimum)</text>
<text x="200" y="30" fill="currentColor" stroke="none">f(x) = (x − 3)²</text>
<text x="200" y="48" fill="currentColor" stroke="none">η = 0.1</text>
<text x="185" y="66" fill="var(--accent)" stroke="none" font-size="11">steps shrink near the bottom</text>
</svg>
<figcaption>Gradient descent on (x − 3)² from x = 0. Steps are big where the curve is steep and get smaller near the minimum, because the gradient itself gets smaller.</figcaption>
</figure>

Notice two things:

1. We never "aim" at 3. We only follow the local slope, and we still get there.
2. The steps shrink automatically, because the gradient gets smaller near the bottom. Here the distance to 3 is multiplied by 0.8 every step (3 → 2.4 → 1.92 → …), so after k steps x = 3 − 3 × 0.8ᵏ.

```python
def grad(x):
    return 2 * (x - 3)

x = 0.0
lr = 0.1
for step in range(1, 26):
    x = x - lr * grad(x)          # the gradient descent update
    if step in (1, 2, 3, 10, 25):
        print(step, round(x, 4))
# Output:
# 1 0.6
# 2 1.08
# 3 1.464
# 10 2.6779
# 25 2.9887
```

### Choosing the learning rate

| Learning rate η | What happens on (x − 3)² from x = 0 |
|---|---|
| 0.01 (too small) | After 10 steps x ≈ 0.55. Very slow. |
| 0.1 (good) | After 10 steps x ≈ 2.68. Smooth progress. |
| 0.5 (perfect here) | x = 0 − 0.5 × (−6) = 3 in one step. Lucky for this exact function. |
| 1.1 (too big) | x = 6.6, then −1.32, then 8.18, then −3.22: jumps over the minimum and **diverges** |

```python
for lr in (0.01, 0.1, 1.1):
    x = 0.0
    for _ in range(10):
        x -= lr * grad(x)
    print(lr, round(x, 3))
# Output:
# 0.01 0.549
# 0.1 2.678
# 1.1 -15.575   — exploding
```

> **Interview tip:** If asked "the training loss is going up or becoming NaN, what do you check first?", say: the learning rate is probably too high — lower it (for example by 10×), and check for exploding gradients (use gradient clipping) and bad input data. If the loss decreases very slowly, the learning rate may be too small.

## Gradient descent for linear regression

Now a real ML case. Fit ŷ = w·x (no bias, to keep it short) to three points: x = [1, 2, 3], y = [2, 4, 6]. The true answer is w = 2.

The loss is MSE: L(w) = (1/n) Σ (w·xᵢ − yᵢ)². By the chain rule, the derivative of each term (w·xᵢ − yᵢ)² is 2(w·xᵢ − yᵢ) × xᵢ. So:

```text
dL/dw = (1/n) Σ 2·xᵢ·(w·xᵢ − yᵢ)
```

Start at w = 0, η = 0.1.

**Step 1.**

1. Errors w·x − y = [0 − 2, 0 − 4, 0 − 6] = [−2, −4, −6]
2. 2·x·error = [2×1×(−2), 2×2×(−4), 2×3×(−6)] = [−4, −16, −36]
3. Mean: (−4 − 16 − 36) ÷ 3 = −56 ÷ 3 ≈ **−18.67**
4. w = 0 − 0.1 × (−18.67) = **1.867**

**Step 2.**

1. Predictions: [1.867, 3.733, 5.600]. Errors: [−0.133, −0.267, −0.400]
2. 2·x·error = [−0.267, −1.067, −2.400]
3. Mean ≈ −3.733 ÷ 3 ≈ **−1.244**
4. w = 1.867 + 0.124 = **1.991**

Two steps and we are already very close to 2.

```python
x = np.array([1.0, 2.0, 3.0])
y = np.array([2.0, 4.0, 6.0])
w, lr = 0.0, 0.1
for step in range(3):
    y_hat = w * x
    grad_w = np.mean(2 * x * (y_hat - y))   # dL/dw from the chain rule
    w -= lr * grad_w
    print(step + 1, round(w, 4))
# Output:
# 1 1.8667
# 2 1.9911
# 3 1.9994
```

In practice, computing the gradient on all data each step (**batch gradient descent**) is slow for big datasets, so we use a small random subset per step (**mini-batch** or **stochastic gradient descent, SGD**). Optimizers like **Adam** adapt the step size for each weight. See [Gradient Descent and Loss Functions](/interview/machine-learning/gradient-descent-and-loss-functions) and [Optimizers and Learning Rate](/interview/deep-learning/optimizers-and-learning-rate).

## Why it matters: backpropagation

A neural network is a long chain: input → W₁ → activation → W₂ → … → loss. **Backpropagation** is the chain rule applied efficiently from the loss backwards: first compute how the loss depends on the last layer, then reuse that to get the layer before, and so on. Each weight's gradient is a product of local slopes along the path from that weight to the loss.

**Worked example: one neuron, one training example.**

Model: ŷ = w·x + b. Loss: L = (ŷ − y)². Data: x = 2, y = 10. Current weights: w = 3, b = 1. Learning rate η = 0.01.

**Forward pass** (compute the output and loss):

1. ŷ = 3 × 2 + 1 = **7**
2. L = (7 − 10)² = (−3)² = **9**

**Backward pass** (chain rule from the loss back to each weight):

1. dL/dŷ = 2(ŷ − y) = 2 × (7 − 10) = **−6**
2. dŷ/dw = x = 2, so dL/dw = dL/dŷ × dŷ/dw = −6 × 2 = **−12**
3. dŷ/db = 1, so dL/db = −6 × 1 = **−6**

**Update** (gradient descent):

1. w = 3 − 0.01 × (−12) = 3 + 0.12 = **3.12**
2. b = 1 − 0.01 × (−6) = 1 + 0.06 = **1.06**

**Check:** new ŷ = 3.12 × 2 + 1.06 = 7.30, new loss = (7.30 − 10)² = 2.7² = **7.29**. The loss went down from 9 to 7.29. Training is just this, repeated millions of times for millions of weights.

<figure>
<svg viewBox="0 0 430 140" width="430" height="140" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="10" y="40" width="80" height="36" rx="6" /><text x="50" y="63" text-anchor="middle" fill="currentColor" stroke="none">w=3, x=2</text>
<rect x="135" y="40" width="105" height="36" rx="6" /><text x="187" y="63" text-anchor="middle" fill="currentColor" stroke="none">ŷ = wx+b = 7</text>
<rect x="285" y="40" width="125" height="36" rx="6" /><text x="347" y="63" text-anchor="middle" fill="currentColor" stroke="none">L = (ŷ−10)² = 9</text>
<line x1="90" y1="52" x2="135" y2="52" /><polygon points="135,52 127,48 127,56" fill="currentColor" />
<line x1="240" y1="52" x2="285" y2="52" /><polygon points="285,52 277,48 277,56" fill="currentColor" />
<text x="210" y="28" text-anchor="middle" fill="currentColor" stroke="none">forward →</text>
<line x1="285" y1="68" x2="240" y2="68" stroke="var(--accent)" /><polygon points="240,68 248,64 248,72" fill="var(--accent)" stroke="var(--accent)" />
<line x1="135" y1="68" x2="90" y2="68" stroke="var(--accent)" /><polygon points="90,68 98,64 98,72" fill="var(--accent)" stroke="var(--accent)" />
<text x="262" y="98" text-anchor="middle" fill="var(--accent)" stroke="none">dL/dŷ = −6</text>
<text x="112" y="98" text-anchor="middle" fill="var(--accent)" stroke="none">× dŷ/dw = 2</text>
<text x="215" y="128" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">← backward: dL/dw = −6 × 2 = −12</text>
</svg>
<figcaption>Forward pass computes the loss; the backward pass multiplies local slopes from the loss back to the weight.</figcaption>
</figure>

### The same thing with PyTorch autograd

Frameworks build the chain of operations during the forward pass and run the chain rule backwards automatically when you call `.backward()`. This is **automatic differentiation** (autograd).

```python
import torch

w = torch.tensor(3.0, requires_grad=True)   # track gradients for w and b
b = torch.tensor(1.0, requires_grad=True)
x, y = torch.tensor(2.0), torch.tensor(10.0)

y_hat = w * x + b        # forward pass
loss = (y_hat - y) ** 2
loss.backward()          # backward pass: chain rule, automatically

print(loss.item())       # Output: 9.0
print(w.grad.item())     # Output: -12.0
print(b.grad.item())     # Output: -6.0
```

The numbers match the hand calculation exactly. See [PyTorch Tensors and Autograd](/interview/deep-learning/pytorch-tensors-and-autograd) and [Loss Functions and Backpropagation](/interview/deep-learning/loss-functions-and-backpropagation).

### Vanishing and exploding gradients

Because backprop **multiplies** slopes layer by layer, long chains cause trouble:

- The sigmoid's derivative is at most 0.25. Through 10 sigmoid layers the gradient can shrink by 0.25¹⁰ ≈ **0.00000095**. Early layers barely learn. This is the **vanishing gradient** problem.
- If each layer multiplies the gradient by something larger than 1, it grows exponentially instead: the **exploding gradient** problem (loss becomes NaN).

Fixes you should name in interviews: ReLU-family activations (derivative 1 for positive inputs), careful weight initialization (He/Xavier), **residual connections** (they add a path where the gradient passes straight through), normalization layers (batch norm, layer norm), gradient clipping, and LSTM/GRU gates for RNNs.

> **Common mistake:** Forgetting to reset gradients in PyTorch. `.backward()` **adds** to `.grad`; if you do not call `optimizer.zero_grad()` each step, gradients from previous batches pile up and training behaves strangely.

## Minima, maxima and the shape of the loss

Where the derivative is 0, the function is flat. That point can be:

- a **minimum** (bottom of a valley),
- a **maximum** (top of a hill),
- a **saddle point** (down in one direction, up in another, like a horse saddle).

The **second derivative** f″(x) is the slope of the slope; it measures **curvature**. For (x − 3)², f″ = 2 > 0, so the curve bends upward and x = 3 is a minimum.

A **convex** function is bowl-shaped everywhere: any flat point is the global minimum. The MSE loss of linear regression and the log loss of logistic regression are convex, so gradient descent reliably finds the best solution. Neural network losses are **not** convex: they have many local minima and saddle points. In practice, for large networks, most local minima are about as good as each other, and the noise in SGD helps escape saddle points.

| Term | Picture | Gradient | Matters because |
|---|---|---|---|
| Global minimum | lowest point overall | 0 | the best possible weights |
| Local minimum | a valley, but not the lowest | 0 | GD can get stuck (rarely a big problem in large nets) |
| Saddle point | flat, down one way, up another | 0 | slows training in high dimensions |
| Plateau | wide flat region | ≈ 0 | training seems stuck; adaptive optimizers help |

## Key terms

| Term | Simple meaning |
|---|---|
| Derivative (f′(x), df/dx) | Slope of a function at a point; how fast output changes with input |
| Tangent line | Line that touches the curve at one point with the same slope |
| Limit | The value a ratio approaches as the nudge h gets closer to 0 |
| Power rule | d/dx xⁿ = n·xⁿ⁻¹ |
| Partial derivative (∂f/∂x) | Slope with respect to one input, others held fixed |
| Gradient (∇f) | Vector of all partial derivatives; points to steepest increase |
| Numerical gradient | Estimating a slope by nudging inputs; used for gradient checking |
| Chain rule | Slope of a chain = product of the slopes of each link |
| Gradient descent | Repeatedly step opposite to the gradient: x ← x − η·∇f |
| Learning rate (η) | Size of each gradient descent step |
| Divergence | Steps get bigger and the loss blows up; learning rate too high |
| Batch / mini-batch / SGD | Gradient from all data / a small batch / one or few examples per step |
| Backpropagation | Chain rule applied from the loss backwards through a network |
| Forward pass | Computing outputs and loss from the inputs |
| Backward pass | Computing gradients from the loss back to every weight |
| Autograd | Automatic differentiation in frameworks like PyTorch |
| Vanishing gradient | Gradients shrink through many layers; early layers stop learning |
| Exploding gradient | Gradients grow huge through many layers; loss becomes NaN |
| Dying ReLU | A ReLU neuron stuck at 0 output with 0 gradient |
| Second derivative | Slope of the slope; curvature |
| Saddle point | Flat point that is a minimum in one direction and maximum in another |
| Convex function | Bowl-shaped; every local minimum is the global minimum |

## Interview questions

**What is a derivative, in one sentence?**
It is the slope of a function at a point: how much the output changes for a tiny change in the input. For example, the derivative of x² at 3 is 6, so increasing x from 3 to 3.01 raises x² by about 0.06.

**What is a gradient and why do we move in its negative direction?**
The gradient is the vector of partial derivatives of the loss with respect to every weight. It points in the direction of steepest increase of the loss. Moving the opposite way decreases the loss fastest locally, which is why the update is w ← w − η∇L.

**Do one step of gradient descent on f(x) = x² from x = 5 with learning rate 0.1.**
f′(x) = 2x, so f′(5) = 10. The update is x = 5 − 0.1 × 10 = 4. The function value goes from 25 to 16.

**What happens if the learning rate is too high or too low?**
Too low: training is very slow and can stall on plateaus. Too high: steps overshoot the minimum, the loss oscillates or diverges to infinity or NaN. Common fixes are learning-rate schedules, warmup, and adaptive optimizers like Adam.

**Explain the chain rule and why it is central to deep learning.**
If y depends on u and u depends on x, then dy/dx = dy/du × du/dx: slopes multiply along a chain. A neural network is a chain of layers, so the gradient of the loss with respect to an early weight is the product of local derivatives along the path. Backpropagation computes all of these efficiently in one backward pass.

**What is backpropagation?**
It is an algorithm that computes the gradient of the loss with respect to every weight by applying the chain rule from the output layer back to the input, reusing intermediate results. After it, an optimizer such as SGD or Adam updates the weights. It costs about as much as one or two forward passes.

**What is the derivative of the sigmoid, and why does it cause vanishing gradients?**
σ′(x) = σ(x)(1 − σ(x)), which is at most 0.25 (at x = 0) and near 0 for large |x|. Multiplying many such small numbers through deep layers makes gradients tiny, so early layers learn very slowly. ReLU, residual connections and normalization help.

**What is a partial derivative? Compute ∂/∂w of L = (wx + b − y)².**
It is the derivative with respect to one variable while holding the others constant. By the chain rule, ∂L/∂w = 2(wx + b − y) × x, and ∂L/∂b = 2(wx + b − y).

**Is the loss of a neural network convex? Does it matter?**
No; it has many local minima and saddle points. In practice, large networks trained with SGD find solutions that generalize well, and saddle points, not bad local minima, are the main slowdown. Linear and logistic regression losses are convex, so they have a single best solution.

**How can you check that your gradient code is correct?**
Use gradient checking: compare your analytical gradient with a numerical estimate (f(w + h) − f(w − h)) ÷ 2h for a small h, for a few weights. They should match to several decimal places.

**What is the difference between batch, mini-batch and stochastic gradient descent?**
Batch GD computes the gradient on the whole dataset per step: accurate but slow. SGD uses one example per step: fast but noisy. Mini-batch uses a small batch, such as 32–512 examples, which balances speed, noise and GPU efficiency; it is the standard in deep learning.

**Why does `.backward()` in PyTorch need `zero_grad()`?**
PyTorch accumulates gradients into `.grad` by adding. Without zeroing them each step, the gradient becomes the sum over all previous batches and updates are wrong.

## Try it yourself

1. Find the derivatives: (a) 4x³ − 2x, (b) eˣ + ln x, (c) (3x − 1)² using the chain rule. Evaluate each at x = 1. *Hint:* for (c), the inner derivative is 3.
2. For f(x, y) = x²y + y³, find ∇f at (2, 1). *Hint:* ∂f/∂x = 2xy.
3. Run gradient descent by hand for 3 steps on f(x) = x² − 4x from x = 0 with η = 0.25. Where is the minimum? *Hint:* f′(x) = 2x − 4.
4. Extend the one-neuron backprop example to 50 steps in NumPy and print the final w, b and loss. *Hint:* loop the forward pass, the two gradient formulas and the update.

### Answers

1. (a) 12x² − 2 → **10**. (b) eˣ + 1/x → e + 1 ≈ **3.718**. (c) 2(3x − 1) × 3 = 6(3x − 1) → **12**.
2. ∂f/∂x = 2xy = 4; ∂f/∂y = x² + 3y² = 4 + 3 = 7. **∇f = [4, 7]**.
3. Step 1: f′(0) = −4, x = 0 + 1 = **1**. Step 2: f′(1) = −2, x = 1 + 0.5 = **1.5**. Step 3: f′(1.5) = −1, x = 1.5 + 0.25 = **1.75**. The minimum is at **x = 2** (where 2x − 4 = 0); each step halves the remaining distance.
4. Solution:

```python
w, b, x, y, lr = 3.0, 1.0, 2.0, 10.0, 0.01
for _ in range(50):
    y_hat = w * x + b
    d = 2 * (y_hat - y)          # dL/dŷ
    w -= lr * d * x              # dL/dw = d * x
    b -= lr * d                  # dL/db = d
print(round(w, 3), round(b, 3), round((w * x + b - y) ** 2, 5))
# Output: 4.194 1.597 0.00024 — w*x + b is now very close to 10
```

**Next:** [Cheat Sheet and Interview Questions](/interview/math-for-ml/cheat-sheet-and-interview-questions)
