---
title: Gradient Descent and Loss Functions
part: Core Algorithms
summary: How models actually learn — loss functions (MSE, MAE, Huber, log loss) compared on real numbers, the gradient descent update worked by hand, batch versus stochastic versus mini-batch, learning rate and convergence, with NumPy and scikit-learn code.
---

Almost every model you will train as an AI engineer — logistic regression, gradient boosting, neural networks, LLMs — learns the same way: measure how wrong it is with a **loss function**, then nudge the parameters in the direction that reduces the loss. That nudging is **gradient descent**. If you understand this chapter, you understand the engine inside all of deep learning.

> **In simple words:** The loss function is a score of "how wrong am I". Gradient descent repeatedly asks "which small change to my weights makes the loss go down fastest?" and takes a small step that way, until the loss stops falling.

## Loss functions: measuring how wrong a model is

A **loss function** takes the true answers and the predictions and returns one number. Smaller is better. Training means finding the parameters that make this number as small as possible. (People use "loss" for one example and "cost" for the average over the dataset, but most use the words interchangeably.)

The choice of loss tells the model **what kind of mistakes matter**.

### Regression losses

Let e = y − ŷ be the error for one example.

<div class="formula">

| Loss | Formula (average over n rows) | Behaviour |
|---|---|---|
| MSE (squared error, L2) | (1/n) Σ e² | Big errors punished heavily; smooth |
| MAE (absolute error, L1) | (1/n) Σ abs(e) | Every unit of error costs the same; robust to outliers |
| Huber (with threshold δ) | ½e² if abs(e) ≤ δ, else δ·(abs(e) − ½δ) | Squared for small errors, linear for big ones |

</div>

### Worked example: one outlier

Four delivery-time predictions have errors (in minutes) of 1, −2, 0.5 and 10. The last one is a rare traffic jam.

| Error e | e² (MSE term) | abs(e) (MAE term) | Huber term, δ = 1 |
|---|---|---|---|
| 1 | 1 | 1 | ½ × 1² = 0.5 |
| −2 | 4 | 2 | 1 × (2 − 0.5) = 1.5 |
| 0.5 | 0.25 | 0.5 | ½ × 0.25 = 0.125 |
| 10 | 100 | 10 | 1 × (10 − 0.5) = 9.5 |
| **Mean** | **26.3125** | **3.375** | **2.906** |

The single outlier contributes 100 out of 105.25 of the squared error total — 95% of the MSE. A model trained with MSE will bend itself to reduce that one error. MAE and Huber give it much less power.

| Loss | Use when | Note |
|---|---|---|
| MSE | Default; large errors are really bad; noise is roughly normal | Predicts the **mean** of y given x |
| MAE | Outliers in the target; all errors equally bad | Predicts the **median**; gradient is constant, so less smooth near 0 |
| Huber | You want MSE behaviour but some robustness | Needs δ chosen |

### Classification loss: log loss

For classification, the model outputs a probability p that the label is 1. The standard loss is **log loss**, also called **binary cross-entropy**:

<div class="formula">

| Formula | Meaning |
|---|---|
| loss = −[ y·ln(p) + (1 − y)·ln(1 − p) ] | for one example; y is 0 or 1, p is predicted P(y = 1) |
| if y = 1: loss = −ln(p) | if y = 0: loss = −ln(1 − p) |

</div>

Worked numbers for a true label y = 1:

| Predicted p | Loss = −ln(p) | Comment |
|---|---|---|
| 0.9 | 0.105 | Confident and right: tiny loss |
| 0.6 | 0.511 | Unsure: medium loss |
| 0.1 | 2.303 | Confident and wrong: big loss |
| 0.01 | 4.605 | Very confident and wrong: huge loss |

Log loss punishes **confident wrong answers** very hard. This pushes the model to give honest probabilities. It is the loss behind logistic regression ([Logistic Regression](/interview/machine-learning/logistic-regression)) and, in its multiclass form (**cross-entropy**), behind neural network classifiers and LLM next-token training.

Other losses you may hear: **hinge loss** (used by SVMs, see [KNN, SVM and Naive Bayes](/interview/machine-learning/knn-svm-and-naive-bayes)) and **quantile loss** (for predicting, say, the 90th percentile of delivery time).

> **Interview tip:** If asked "why not use MSE for classification?", say: with a sigmoid output, MSE gives a non-convex loss surface with flat regions and weak gradients when the model is confidently wrong. Log loss is convex for logistic regression and gives strong gradients exactly when the model is badly wrong. It also comes from maximum likelihood.

## Gradient descent: walking downhill

Imagine plotting the loss for every possible value of a weight w. You get a curve (for many weights, a surface) called the **loss landscape**. The best w is at the bottom.

> **Real-life example:** You are on a hill in thick fog and want to reach the valley. You cannot see the valley, but you can feel the slope under your feet. So you take a step in the steepest downhill direction, feel the slope again, and repeat. That is gradient descent.

The slope of the loss with respect to a weight is its **derivative** (written ∂L/∂w, "the partial derivative of L with respect to w"). With many weights, the list of all these derivatives is the **gradient**, written ∇L. The gradient points uphill (the direction where loss increases fastest), so we step the **opposite** way. Derivatives are explained in [Derivatives, Gradients and the Chain Rule](/interview/math-for-ml/derivatives-gradients-and-the-chain-rule).

<div class="formula">

| Formula | Meaning |
|---|---|
| w ← w − η · ∂L/∂w | the **update rule**; η (eta) is the **learning rate** (step size) |
| For MSE with ŷ = w·x + b: ∂L/∂w = (2/n) Σ (ŷᵢ − yᵢ)·xᵢ | how the loss changes with w |
| ∂L/∂b = (2/n) Σ (ŷᵢ − yᵢ) | how the loss changes with b |

</div>

Why these formulas? For one row, the loss is (ŷ − y)² = (w·x + b − y)². By the chain rule, its derivative with respect to w is 2·(ŷ − y)·x, and with respect to b it is 2·(ŷ − y). Average over rows and you get the box above.

Read the sign: if predictions are too high (ŷ > y), the gradient is positive, so w goes down. If too low, w goes up. The size of the step depends on how big the error is.

### Worked example by hand

Data: x = 1, 2, 3 and y = 2, 4, 6. (The true rule is y = 2x.) Model: ŷ = w·x with no intercept, to keep it simple. Start at w = 0. Learning rate η = 0.1.

The gradient here is ∂L/∂w = (2/3) Σ (w·xᵢ − yᵢ)·xᵢ.

**Iteration 1** (w = 0):

- Predictions: 0, 0, 0. Errors (ŷ − y): −2, −4, −6.
- Loss = (4 + 16 + 36) ÷ 3 = 56 ÷ 3 = **18.667**.
- Σ error × x = (−2)(1) + (−4)(2) + (−6)(3) = −2 − 8 − 18 = −28.
- Gradient = (2/3) × (−28) = **−18.667**.
- New w = 0 − 0.1 × (−18.667) = **1.8667**.

**Iteration 2** (w = 1.8667):

- Predictions: 1.8667, 3.7333, 5.6. Errors: −0.1333, −0.2667, −0.4.
- Loss = (0.0178 + 0.0711 + 0.16) ÷ 3 = **0.083**.
- Σ error × x = −0.1333 − 0.5333 − 1.2 = −1.8667.
- Gradient = (2/3) × (−1.8667) = **−1.2444**.
- New w = 1.8667 + 0.1 × 1.2444 = **1.9911**.

**Iteration 3** (w = 1.9911): loss ≈ **0.0004**, gradient ≈ −0.083, new w ≈ **1.9994**.

| Iteration | w | Loss | Gradient |
|---|---|---|---|
| 1 | 0 | 18.667 | −18.667 |
| 2 | 1.8667 | 0.083 | −1.244 |
| 3 | 1.9911 | 0.0004 | −0.083 |
| 4 | 1.9994 | ≈ 0 | −0.006 |

In three steps w is almost exactly 2. Notice the steps get smaller automatically, because the gradient shrinks near the bottom.

### The same example with a learning rate that is too big

Now use η = 0.25 and start again at w = 0.

| Iteration | w | Loss |
|---|---|---|
| 1 | 0 | 18.67 |
| 2 | 4.667 | 33.19 |
| 3 | −1.556 | 59.00 |
| 4 | 6.741 | 104.88 |

Each step overshoots the bottom and lands higher on the other side. The loss grows every time. This is called **divergence**. In this example any η above about 0.214 diverges (the loss curve is 14/3·(w − 2)², and steps larger than 2 ÷ (its curvature 28/3) overshoot).

## The learning rate

The **learning rate** η is the most important hyperparameter of gradient descent.

<figure>
<svg viewBox="0 0 420 220" width="420" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<path d="M30 20 Q210 360 390 20" />
<line x1="20" y1="200" x2="400" y2="200" />
<text x="395" y="215" text-anchor="end" fill="currentColor" stroke="none">weight w</text>
<text x="25" y="15" fill="currentColor" stroke="none">loss</text>
<circle cx="90" cy="114" r="4" fill="currentColor" />
<circle cx="138" cy="163" r="4" fill="currentColor" />
<circle cx="168" cy="181" r="4" fill="currentColor" />
<circle cx="186" cy="187" r="4" fill="currentColor" />
<circle cx="198" cy="189" r="4" fill="currentColor" />
<polyline points="90,114 138,163 168,181 186,187 198,189" stroke-dasharray="3 3" />
<text x="40" y="100" fill="currentColor" stroke="none">good η: steady steps</text>
<circle cx="150" cy="171" r="4" fill="var(--accent)" stroke="var(--accent)" />
<circle cx="288" cy="158" r="4" fill="var(--accent)" stroke="var(--accent)" />
<circle cx="114" cy="142" r="4" fill="var(--accent)" stroke="var(--accent)" />
<circle cx="336" cy="107" r="4" fill="var(--accent)" stroke="var(--accent)" />
<polyline points="150,171 288,158 114,142 336,107" stroke="var(--accent)" />
<text x="270" y="90" fill="var(--accent)" stroke="none">too big η: bounces out</text>
<text x="210" y="212" text-anchor="middle" fill="currentColor" stroke="none">minimum</text>
</svg>
<figcaption>A good learning rate walks steadily to the bottom; a learning rate that is too large overshoots further each time and the loss grows.</figcaption>
</figure>

| Learning rate | What happens | Sign in the loss curve |
|---|---|---|
| Too small | Very slow progress; may stop before the minimum | Loss falls slowly in a straight line |
| Good | Fast, smooth convergence | Loss drops quickly, then flattens |
| Too large | Oscillates or diverges | Loss jumps up and down or explodes to NaN |

Practical rules:

- Try values on a log scale: 0.1, 0.01, 0.001, 0.0001.
- **Scale your features** first. If one feature is in lakhs and another is 0–1, the loss surface becomes a long narrow valley and gradient descent zig-zags. Standardising makes the bowl round and convergence fast.
- **Learning rate schedules** reduce η over time: big steps early, small steps near the end. Deep learning uses warmup and cosine decay (see [Optimizers and Learning Rate](/interview/deep-learning/optimizers-and-learning-rate)).

> **Common mistake:** Seeing the loss become NaN and thinking the code is broken. Very often the learning rate is simply too high. Divide it by 10 and try again.

## Batch, stochastic and mini-batch gradient descent

The gradient formula averages over rows. How many rows do we use per step?

- **Batch gradient descent**: use **all** n rows for every step. Accurate gradient, but one step on 10 million rows is slow.
- **Stochastic gradient descent (SGD)**: use **one** random row per step. Very fast steps, but noisy — the path wobbles.
- **Mini-batch gradient descent**: use a small random group (a **batch**), typically 32–512 rows. The standard choice in deep learning. (Confusingly, people often call this "SGD" too.)

One full pass through the training data is called an **epoch**. With 10,000 rows and batch size 100, one epoch = 100 steps.

### SGD step by hand

Same data, w = 0, η = 0.1, but use only one random row: (x = 3, y = 6).

- Error = 0 × 3 − 6 = −6.
- Single-row gradient = 2 × (−6) × 3 = −36.
- New w = 0 + 0.1 × 36 = **3.6**.

The full-batch step went to 1.87; this one row went past the answer (2) to 3.6. One row gives a noisy estimate of the true gradient. Over many steps the noise averages out, and it can even help escape flat regions and poor local minima.

| | Batch GD | Stochastic GD | Mini-batch GD |
|---|---|---|---|
| Rows per step | All n | 1 | 32–512 typical |
| Cost per step | High | Very low | Low |
| Gradient quality | Exact | Very noisy | Slightly noisy |
| Path | Smooth | Wobbly | Mostly smooth |
| Memory | All data | Tiny | Fits on a GPU |
| Used in | Small problems, classical solvers | Online learning, streaming | Deep learning (the default) |

## Convergence: when do we stop?

**Convergence** means the parameters have stopped changing much and the loss is at (or near) its minimum. Common stopping rules:

1. A fixed number of iterations or epochs.
2. The loss improves by less than a tolerance (for example 0.0001) between steps.
3. The gradient is close to zero.
4. **Early stopping**: the **validation** loss stops improving for a few epochs (this also prevents overfitting).

### Convex versus non-convex

A loss surface shaped like a single bowl is **convex**: it has only one minimum, so gradient descent with a good learning rate always finds the best answer. Linear regression with MSE and logistic regression with log loss are convex.

Neural networks have **non-convex** losses with many valleys (**local minima**) and flat areas (**saddle points**). Gradient descent finds a good valley, not necessarily the best one. In practice, for big networks, most valleys reached are good enough.

> **Remember:** Convex = one bowl = guaranteed global minimum. Linear and logistic regression are convex. Neural networks are not.

### Beyond plain gradient descent

Plain GD uses the same step size for every weight. Better **optimizers** adapt the step:

- **Momentum**: remembers the previous direction, like a ball rolling downhill; smooths zig-zags.
- **Adam / AdamW**: keeps a separate, adaptive step size per weight. The default for deep learning and LLM fine-tuning.

These are covered in [Optimizers and Learning Rate](/interview/deep-learning/optimizers-and-learning-rate).

## Code: gradient descent from scratch

Fit ŷ = w·x + b on the 5-student data from [Linear Regression](/interview/machine-learning/linear-regression). The true OLS answer is w = 0.6, b = 2.2.

```python
import numpy as np

x = np.array([1, 2, 3, 4, 5], dtype=float)   # hours studied
y = np.array([2, 4, 5, 4, 5], dtype=float)   # marks

w, b = 0.0, 0.0
lr = 0.05                                    # learning rate (eta)

for step in range(2001):
    y_hat = w * x + b                        # forward: predictions
    err = y_hat - y
    loss = np.mean(err ** 2)                 # MSE
    dw = 2 * np.mean(err * x)                # dL/dw
    db = 2 * np.mean(err)                    # dL/db
    if step in (0, 1, 10, 100, 500, 2000):
        print(f"step {step:4d}  w={w:.4f}  b={b:.4f}  loss={loss:.4f}")
    w -= lr * dw                             # update: step against the gradient
    b -= lr * db
```

```text
step    0  w=0.0000  b=0.0000  loss=17.2000
step    1  w=1.3200  b=0.4000  loss=1.6464
step   10  w=1.0412  b=0.6072  loss=0.9418
step  100  w=0.6951  b=1.8566  loss=0.5015
step  500  w=0.6001  b=2.1996  loss=0.4800
step 2000  w=0.6000  b=2.2000  loss=0.4800
```

After the first step, w jumps to 1.32 — too high — because b has not caught up yet. Then w slowly comes down while b rises. After about 500 steps both match the exact answer, and the loss reaches the minimum MSE of 0.48 found in the previous chapter.

## Code: scikit-learn's SGD models

`SGDRegressor` and `SGDClassifier` train linear models with stochastic gradient descent. They are useful for very large datasets and support `partial_fit` for streaming data.

```python
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import SGDRegressor, SGDClassifier
from sklearn.metrics import r2_score

X, y = fetch_california_housing(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

sgd = make_pipeline(
    StandardScaler(),                         # essential for SGD: features on the same scale
    SGDRegressor(
        loss="squared_error",                 # or "huber", "epsilon_insensitive"
        learning_rate="invscaling",           # step size shrinks over time (the default schedule)
        eta0=0.01,                            # initial learning rate
        max_iter=1000, tol=1e-4,              # stop when improvement < tol
        early_stopping=True,                  # hold out 10% to watch validation score
        random_state=42,
    ),
)
sgd.fit(X_train, y_train)
print(round(r2_score(y_test, sgd.predict(X_test)), 3))   # close to plain LinearRegression's 0.576

# Classification with log loss = logistic regression trained by SGD
clf = SGDClassifier(loss="log_loss", alpha=1e-4, random_state=42)   # alpha = L2 regularization strength
```

```text
0.57...  (similar to the OLS result; SGD is approximate, so digits vary)
```

> **Common mistake:** Forgetting `StandardScaler` before `SGDRegressor`. Unscaled features make SGD converge slowly or produce very poor scores, even though the same data works fine with `LinearRegression`.

## Hyperparameters that matter

| Hyperparameter | What it controls | Typical values |
|---|---|---|
| Learning rate η | Step size | 0.1 to 0.0001; tune on a log scale |
| Batch size | Rows per step | 32–512 for neural nets |
| Number of epochs / iterations | How long to train | Until validation loss stops improving |
| Learning-rate schedule | How η changes over time | Constant, inverse scaling, step decay, cosine |
| Loss function | What errors cost | MSE, MAE, Huber, log loss |
| Tolerance | When to stop early | 1e-3 to 1e-5 |

## Key terms

| Term | Simple meaning |
|---|---|
| Loss / cost function | A single number saying how wrong the model is |
| MSE | Mean of squared errors; punishes big errors strongly |
| MAE | Mean of absolute errors; robust to outliers |
| Huber loss | Squared for small errors, linear for large ones |
| Log loss / binary cross-entropy | −ln(probability given to the true class) |
| Cross-entropy | Log loss for many classes |
| Loss landscape | The loss plotted over all parameter values |
| Derivative / partial derivative | The slope of the loss with respect to one parameter |
| Gradient (∇L) | The vector of all partial derivatives; points uphill |
| Gradient descent | Repeatedly step opposite to the gradient |
| Learning rate (η) | The size of each step |
| Divergence | Loss growing because steps overshoot |
| Batch GD | Use all rows per step |
| Stochastic GD (SGD) | Use one row per step |
| Mini-batch GD | Use a small random group of rows per step |
| Epoch | One full pass over the training data |
| Convergence | Parameters stop changing; loss at its minimum |
| Convex | A single-bowl loss with one global minimum |
| Local minimum / saddle point | A valley that is not the lowest / a flat point that is not a minimum |
| Early stopping | Stop when validation loss stops improving |
| Optimizer | The update rule (SGD, momentum, Adam) |

## Interview questions

**Explain gradient descent in simple words.**
It is an iterative way to minimise a loss. At the current parameters we compute the gradient — the direction in which the loss increases fastest — and take a small step in the opposite direction. We repeat until the loss stops decreasing. The step size is the learning rate.

**What happens if the learning rate is too high or too low?**
Too low: training is very slow and may stop before reaching the minimum. Too high: the updates overshoot the minimum, the loss oscillates or diverges, and you may see NaN values. You find a good value by trying a log-scale range and watching the loss curve.

**Batch vs stochastic vs mini-batch gradient descent?**
Batch uses all data per step: accurate but slow and memory-heavy. Stochastic uses one row: fast but noisy. Mini-batch uses small groups like 64 rows: a good balance, it uses GPU parallelism well and its mild noise helps generalisation. Mini-batch is the default in deep learning.

**MSE vs MAE — when would you choose each?**
MSE when large errors are especially bad and noise is roughly normal; it is smooth and predicts the conditional mean. MAE when the target has outliers that should not dominate training; it predicts the conditional median. Huber is a compromise between the two.

**Why is log loss used for classification?**
It comes from maximum likelihood for a Bernoulli outcome, it is convex for logistic regression, and it punishes confident wrong predictions very strongly, which encourages well-calibrated probabilities. MSE with a sigmoid gives weak gradients when the model is confidently wrong.

**What does "convex" mean and why do we care?**
A convex loss has a single bowl shape, so any local minimum is the global minimum, and gradient descent with a suitable learning rate is guaranteed to find it. Linear regression with MSE and logistic regression with log loss are convex; neural networks are not.

**Why does feature scaling help gradient descent?**
With features on very different scales, the loss surface is a long, narrow valley. The gradient points mostly across the valley, so steps zig-zag and you need a tiny learning rate. Scaling makes the surface rounder, so steps point toward the minimum and convergence is much faster.

**How do you know gradient descent has converged?**
The training loss flattens, the change in loss between iterations falls below a tolerance, or the gradient norm is near zero. In practice we also watch validation loss and stop early when it stops improving.

**Can gradient descent get stuck? What helps?**
In non-convex problems it can slow down in flat regions or saddle points, or settle in a poor local minimum. The noise in mini-batch SGD, momentum, adaptive optimizers like Adam, good initialisation and learning-rate schedules all help.

**Derive the gradient of MSE for ŷ = w·x + b.**
For one row the loss is (w·x + b − y)². By the chain rule, ∂/∂w = 2(ŷ − y)·x and ∂/∂b = 2(ŷ − y). Averaging over n rows gives (2/n)Σ(ŷᵢ − yᵢ)xᵢ and (2/n)Σ(ŷᵢ − yᵢ).

## Try it yourself

1. **One more step by hand.** Continue the worked example with η = 0.1 from w = 1.9994. Compute the next w.
   *Hint: gradient = (2/3) × Σ(w·xᵢ − yᵢ)·xᵢ = (28/3) × (w − 2).*
2. **Huber vs MSE.** Errors are 0.5, −1, 3, −6. Compute MSE, MAE and the Huber loss with δ = 2.
   *Hint: for abs(e) > 2, use 2 × (abs(e) − 1).*
3. **Find the divergence point.** For the loss L(w) = 5·(w − 1)², which learning rates make gradient descent diverge?
   *Hint: the update is w ← w − η·10·(w − 1). When does the distance to 1 grow?*
4. **Code.** Modify the NumPy loop to use mini-batches of size 2 (shuffle indices each epoch). Compare the path of w with full-batch GD.
   *Hint: `idx = np.random.permutation(5)` then loop over `idx[i:i+2]`.*

### Answers

1. Gradient = (28/3) × (1.9994 − 2) = 9.333 × (−0.0006) ≈ −0.0056. New w = 1.9994 + 0.1 × 0.0056 ≈ 1.99996.
2. Squares: 0.25, 1, 9, 36 → MSE = 46.25 ÷ 4 = 11.5625. MAE = (0.5 + 1 + 3 + 6) ÷ 4 = 2.625. Huber: 0.125, 0.5, 2 × (3 − 1) = 4, 2 × (6 − 1) = 10 → mean = 14.625 ÷ 4 = 3.656.
3. The distance to the minimum is multiplied by (1 − 10η) every step. It grows when abs(1 − 10η) > 1, that is when η > 0.2. At exactly η = 0.2 it bounces forever between two points.
4. The mini-batch path reaches the same neighbourhood (w ≈ 0.6, b ≈ 2.2) but wobbles around it instead of settling exactly; reducing the learning rate over time makes it settle.

**Next:** [Logistic Regression](/interview/machine-learning/logistic-regression)
