---
title: Optimizers and Learning Rate
part: Neural Network Basics
summary: How optimizers turn gradients into weight updates, from plain SGD to momentum, RMSProp, Adam and AdamW, worked by hand on small numbers, plus learning rate schedules, warmup, batch size effects and gradient accumulation in PyTorch.
---

Backpropagation tells you which direction each weight should move. The **optimizer** decides how far to move, and it is often the difference between a model that trains in an hour and one that never trains at all. In your job you will pick an optimizer and a learning rate for every training run, read them in fine-tuning configs (`learning_rate: 2e-5`, `warmup_ratio: 0.03`, `lr_scheduler_type: cosine`), and debug runs where the loss explodes or gets stuck. This chapter gives you the reasoning behind those settings.

> **In simple words:** An optimizer uses the gradient to update weights. Plain SGD takes a step of fixed size along the gradient. Momentum adds memory of past steps. Adam also gives each weight its own step size. The learning rate is the most important single setting, and it is usually changed during training with a schedule.

## Gradient descent recap: batch, mini-batch, stochastic

The basic update is w ← w − η · g, where g = ∂L/∂w is the gradient and η (eta) is the **learning rate**. The question is: gradient of the loss over which examples?

| Variant | Gradient computed on | Pros | Cons |
|---|---|---|---|
| Batch gradient descent | the whole training set | exact gradient, smooth | far too slow and too much memory for big data |
| Stochastic gradient descent (SGD) | one example | very cheap per step | very noisy |
| Mini-batch gradient descent | a small group (e.g. 32 to 512 examples) | good balance, uses GPU parallelism | one more setting (batch size) |

In deep learning, "SGD" almost always means **mini-batch SGD**. Two words you must know:

- **Iteration** (or **step**): one mini-batch forward + backward + update.
- **Epoch**: one full pass over the training data.

**Worked example.** 50,000 training images, batch size 64. Iterations per epoch = 50,000 ÷ 64 = 781.25, so 782 iterations (the last batch has only 16 images). Ten epochs = 7,820 updates.

The noise in mini-batch gradients is not only a problem. It helps the model jump out of bad flat regions and often leads to solutions that generalize better.

## The learning rate

The learning rate controls the step size. On the simple function f(w) = w², the gradient is 2w, so one step gives w ← w − η · 2w = (1 − 2η) · w. Start at w = 5 and run 10 steps:

| η | Factor (1 − 2η) per step | w after 10 steps | What happens |
|---|---|---|---|
| 0.01 | 0.98 | 5 × 0.98¹⁰ ≈ 4.09 | too small: barely moved |
| 0.1 | 0.8 | 5 × 0.8¹⁰ ≈ 0.54 | good: steady progress |
| 0.9 | −0.8 | 5 × (−0.8)¹⁰ ≈ 0.54 | overshoots: w jumps across 0 every step |
| 1.1 | −1.2 | 5 × (−1.2)¹⁰ ≈ 30.96 | diverges: gets worse every step |

In real networks the same happens. Too small: the loss falls painfully slowly. Too large: the loss bounces, then shoots up to `NaN`.

> **Interview tip:** If asked "your loss is NaN after a few hundred steps, what do you check first?", say the learning rate (try 3 to 10 times lower), then gradient clipping, then the data (NaN or huge values in inputs), then numerical issues like log(0).

## SGD, step by step

Use f(w) = w² again, start w = 5, η = 0.1.

| Step | Gradient g = 2w | Update w ← w − 0.1·g |
|---|---|---|
| 1 | 2 × 5 = 10 | 5 − 1.0 = 4.0 |
| 2 | 2 × 4 = 8 | 4 − 0.8 = 3.2 |
| 3 | 2 × 3.2 = 6.4 | 3.2 − 0.64 = 2.56 |

Each step shrinks w by 20%. Steady, but slow.

Problems with plain SGD:

1. **One learning rate for all weights.** Some weights need big steps (gentle slope), others small steps (steep slope). In a long narrow valley, the steep direction forces a small η, so progress along the gentle direction is very slow.
2. **Noise and zig-zag.** Mini-batch gradients point in slightly random directions.
3. **Flat regions and saddle points.** Where the gradient is near zero, SGD crawls.

## Momentum

**Momentum** gives the optimizer a memory. Instead of stepping along the current gradient only, it keeps a running **velocity** v that adds up past gradients.

<div class="formula">

| Formula (PyTorch style) | Meaning |
|---|---|
| v ← β · v + g | velocity: old velocity, slightly decayed, plus the new gradient |
| w ← w − η · v | step along the velocity |
| β ≈ 0.9 | keeps 90% of the old velocity each step |

</div>

> **Real-life example:** A ball rolling down a hill. It does not stop and restart at every small bump; it keeps rolling in the direction it has been going. Zig-zags across a valley cancel out, while steps along the valley add up.

**Worked example.** f(w) = w², w = 5, η = 0.1, β = 0.9, v starts at 0.

| Step | g = 2w | v ← 0.9v + g | w ← w − 0.1v |
|---|---|---|---|
| 1 | 10 | 0 + 10 = 10 | 5 − 1.0 = 4.0 |
| 2 | 8 | 9 + 8 = 17 | 4 − 1.7 = 2.3 |
| 3 | 4.6 | 15.3 + 4.6 = 19.9 | 2.3 − 1.99 = 0.31 |

After 3 steps, momentum is at 0.31 while plain SGD is at 2.56. Momentum built up speed. (It may overshoot past 0 next and swing back; that is the price of speed.)

**Nesterov momentum** is a small improvement: it computes the gradient at the point where momentum is about to take you ("look ahead"), which reduces overshooting. In PyTorch: `torch.optim.SGD(params, lr=0.1, momentum=0.9, nesterov=True)`.

SGD with momentum is still a top choice for training CNNs on images from scratch (for example ResNets on ImageNet), usually with a step or cosine schedule.

## Adaptive learning rates: AdaGrad and RMSProp

Idea: give **each weight its own effective learning rate**. Weights with consistently large gradients get smaller steps; weights with small gradients get bigger steps.

**AdaGrad** divides by the square root of the sum of all past squared gradients. The sum only grows, so the steps keep shrinking until learning stops. Good for sparse features, rarely used for deep nets now.

**RMSProp** fixes that by using a decaying average of squared gradients instead of the full sum:

<div class="formula">

| Formula | Meaning |
|---|---|
| s ← β · s + (1 − β) · g² | running average of squared gradients (β ≈ 0.9 or 0.99) |
| w ← w − η · g / (√s + ε) | divide the step by the typical gradient size; ε (like 1e-8) avoids division by zero |

</div>

Dividing by √s means the step size is roughly η, whatever the scale of the gradient. A weight whose gradients are always around 100 and one whose gradients are around 0.01 both move about η per step.

## Adam

**Adam** (Adaptive Moment Estimation, 2014) combines momentum and RMSProp. It keeps two running averages per weight:

- m: the average of gradients (the **first moment**, like momentum).
- v: the average of squared gradients (the **second moment**, like RMSProp).

Both start at 0, so early on they are too small. Adam fixes this with **bias correction**.

<div class="formula">

| Formula | Meaning |
|---|---|
| m ← β₁·m + (1 − β₁)·g | average gradient, β₁ = 0.9 |
| v ← β₂·v + (1 − β₂)·g² | average squared gradient, β₂ = 0.999 |
| m̂ = m / (1 − β₁ᵗ), v̂ = v / (1 − β₂ᵗ) | bias correction at step t |
| w ← w − η · m̂ / (√v̂ + ε) | the update |
| Defaults: η = 0.001, β₁ = 0.9, β₂ = 0.999, ε = 1e-8 | PyTorch defaults |

</div>

**Worked example.** f(w) = w², w = 5, η = 0.1.

Step 1 (t = 1):

- g = 2 × 5 = 10
- m = 0.9 × 0 + 0.1 × 10 = 1.0
- v = 0.999 × 0 + 0.001 × 100 = 0.1
- m̂ = 1.0 / (1 − 0.9) = 1.0 / 0.1 = 10
- v̂ = 0.1 / (1 − 0.999) = 0.1 / 0.001 = 100
- step = 0.1 × 10 / √100 = 0.1 × 10 / 10 = 0.1
- w = 5 − 0.1 = **4.9**

Step 2 (t = 2):

- g = 2 × 4.9 = 9.8
- m = 0.9 × 1.0 + 0.1 × 9.8 = 0.9 + 0.98 = 1.88
- v = 0.999 × 0.1 + 0.001 × 96.04 = 0.0999 + 0.09604 = 0.19594
- m̂ = 1.88 / (1 − 0.81) = 1.88 / 0.19 = 9.895
- v̂ = 0.19594 / (1 − 0.998001) = 0.19594 / 0.001999 = 98.02
- step = 0.1 × 9.895 / 9.900 = 0.0999
- w = 4.9 − 0.0999 ≈ **4.800**

Notice: the step is about η = 0.1 each time, even though the gradient was 10. Without bias correction, step 1 would have been 0.1 × 1.0 / √0.1 ≈ 0.32, a wrong size caused only by the zero start. Adam's steps are roughly "learning rate × sign of the gradient" early on, which makes η easy to choose and makes Adam robust across very different layers.

> **Remember:** Adam = momentum (m) + per-weight scaling by the gradient size (v) + bias correction. Default learning rate 1e-3 for training from scratch; much smaller (around 1e-5 to 5e-5) for full fine-tuning of pretrained Transformers.

### AdamW: Adam with decoupled weight decay

**Weight decay** pulls every weight slightly towards zero each step, which reduces overfitting (see [Regularization, Dropout and Batch Norm](/interview/deep-learning/regularization-dropout-and-batch-norm)). With SGD, adding an L2 penalty λw² to the loss is the same as weight decay. With Adam it is **not**: the L2 gradient gets divided by √v̂ like every other gradient, so weights with large gradients are barely regularized.

**AdamW** (Loshchilov and Hutter) applies the decay directly to the weights, separate from the adaptive step:

<div class="formula">

| Formula | Meaning |
|---|---|
| w ← w − η · ( m̂ / (√v̂ + ε) + λ · w ) | the λ·w term is not divided by √v̂ |

</div>

AdamW is the default optimizer for Transformers and LLMs. Typical λ is 0.01 to 0.1. In PyTorch, `torch.optim.AdamW` has a default `weight_decay=0.01`, while `torch.optim.Adam` has a default of 0.

> **Common mistake:** Using `torch.optim.Adam(params, weight_decay=0.01)` and thinking it is AdamW. `Adam` with `weight_decay` adds L2 to the gradient (the coupled version). Use `torch.optim.AdamW` for decoupled weight decay.

### The memory cost of Adam

Adam stores m and v for **every** parameter: two extra numbers each. For a 7-billion-parameter model in 32-bit floats (4 bytes), m and v alone take 2 × 7 × 10⁹ × 4 bytes = 56 GB, on top of the weights and gradients. This is one reason fine-tuning big models needs tricks like LoRA (see [Fine-tuning, LoRA and QLoRA](/interview/llms-genai/fine-tuning-lora-and-qlora)) or 8-bit optimizers.

### Optimizer comparison

| Optimizer | Extra memory per parameter | Strengths | Typical use |
|---|---|---|---|
| SGD | 0 | simple, generalizes well with tuning | rarely alone |
| SGD + momentum (Nesterov) | 1 (velocity) | strong results on CNNs, generalizes well | image classification from scratch |
| RMSProp | 1 | adaptive, handles changing gradients | older RNN / RL work |
| Adam | 2 (m and v) | fast, robust, little tuning | default for most new models |
| AdamW | 2 | Adam + correct weight decay | Transformers, LLMs, fine-tuning |

## Learning rate schedules

A fixed learning rate is rarely best. Early in training you want big steps to make fast progress; late in training you want small steps to settle into a good minimum. A **learning rate schedule** changes η over time.

| Schedule | What it does | Where you see it |
|---|---|---|
| Step decay | multiply η by 0.1 every N epochs | classic ResNet training |
| Exponential decay | multiply η by γ (like 0.95) every epoch | older models |
| Cosine annealing | η follows half a cosine curve from max down to near 0 | very common; LLM pretraining |
| Linear decay | η falls in a straight line to 0 | BERT fine-tuning, Hugging Face default |
| One-cycle | η rises then falls in one cycle | fast training of CNNs |
| Reduce on plateau | lower η when the validation loss stops improving | simple, reactive |

### Warmup

**Warmup** means starting with a tiny learning rate and increasing it linearly to the target over the first few hundred or thousand steps. Why it helps:

- At the start, weights are random, and gradients can be large and inconsistent. A full-size step can push the model into a bad region or blow up the loss.
- Adam's v estimate is based on very few gradients at the start, so its step sizes are unreliable. Small steps protect the model until the statistics settle.
- Transformers are particularly sensitive; nearly every Transformer recipe uses warmup.

**Worked example: warmup + cosine.** Peak η = 3 × 10⁻⁴, 1,000 warmup steps, 10,000 total steps. During warmup, η = peak × step / 1000. After warmup, η = peak × 0.5 × (1 + cos(π × progress)), where progress = (step − 1000) / 9000.

| Step | Phase | Learning rate |
|---|---|---|
| 0 | warmup start | 0 |
| 500 | half of warmup | 1.5 × 10⁻⁴ |
| 1,000 | peak | 3.0 × 10⁻⁴ |
| 5,500 | progress 0.5, cos(π/2) = 0 | 1.5 × 10⁻⁴ |
| 10,000 | progress 1, cos(π) = −1 | 0 |

### Schedules in PyTorch

```python
import torch
from torch import nn
from torch.optim.lr_scheduler import LinearLR, CosineAnnealingLR, SequentialLR

model = nn.Linear(10, 2)
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)

warmup_steps, total_steps = 1000, 10000
warmup = LinearLR(optimizer, start_factor=0.01, end_factor=1.0, total_iters=warmup_steps)
cosine = CosineAnnealingLR(optimizer, T_max=total_steps - warmup_steps, eta_min=0.0)
scheduler = SequentialLR(optimizer, schedulers=[warmup, cosine], milestones=[warmup_steps])

for step in range(total_steps):
    # ... forward, loss.backward() ...
    optimizer.step()          # 1) update the weights
    scheduler.step()          # 2) then move the learning rate one step
    optimizer.zero_grad()
    if step % 2500 == 0:
        print(step, scheduler.get_last_lr())
```

Here the scheduler is stepped **every batch**. Some schedules (like `StepLR` in older code) are stepped once **per epoch**. Read which one a recipe expects.

> **Common mistake:** Calling `scheduler.step()` before `optimizer.step()`. PyTorch warns about this, and you skip the first value of the schedule. The order is: `loss.backward()`, `optimizer.step()`, `scheduler.step()`.

### Finding a good learning rate

A practical method is the **learning rate range test** (LR finder): train for a few hundred steps while increasing η exponentially from 1e-7 to 1, and plot loss against η. Pick a value a little below the point where the loss falls fastest, usually about 10 times smaller than where it starts to blow up. Otherwise, start from known defaults: Adam 1e-3 from scratch, AdamW 1e-5 to 5e-5 for full fine-tuning of a pretrained Transformer, and SGD with momentum around 0.1 for ResNets with batch size 256. These are starting points; always check the loss curve.

## Batch size effects

The **batch size** is how many examples go into one gradient estimate.

| | Small batch (e.g. 16–64) | Large batch (e.g. 1,024+) |
|---|---|---|
| Gradient noise | high | low |
| Steps per epoch | many | few |
| GPU use per step | low, may be inefficient | high, efficient |
| Memory | low | high (activations grow with batch size) |
| Generalization | often good (noise acts as regularization) | can be worse without tuning |
| Learning rate | smaller | can be larger |

The **linear scaling rule** (a guideline from large-batch ImageNet training): if you multiply the batch size by k, multiply the learning rate by k as well, and use warmup. It works up to a point, then breaks down. For Adam, a square-root scaling is sometimes used instead. Treat these as starting points, not laws.

### Gradient accumulation

What if the batch you want does not fit in GPU memory? Run several small batches, **add up** their gradients (PyTorch does this automatically if you do not zero them), and update once. This is **gradient accumulation**: it simulates a big batch with small memory.

```python
accum_steps = 4                         # 4 batches of 16 = effective batch of 64
optimizer.zero_grad()
for i, (x, y) in enumerate(train_loader):
    loss = loss_fn(model(x), y) / accum_steps   # divide so gradients are averaged
    loss.backward()                              # gradients add up in .grad
    if (i + 1) % accum_steps == 0:
        optimizer.step()
        optimizer.zero_grad()
```

> **Interview tip:** Gradient accumulation is not exactly the same as a real large batch when the model has batch norm, because batch norm statistics are still computed on the small batches. For Transformers with layer norm it is effectively the same.

## Key terms

| Term | Simple meaning |
|---|---|
| Optimizer | The rule that turns gradients into weight updates |
| Learning rate (η) | Size of each update step |
| Mini-batch | A small group of examples used for one gradient estimate |
| Iteration / step | One forward, backward and update on one mini-batch |
| Epoch | One full pass over the training data |
| SGD | Update w ← w − η·g using mini-batch gradients |
| Momentum | Keeps a velocity of past gradients to speed up and smooth steps |
| Nesterov momentum | Momentum that looks ahead before computing the gradient |
| AdaGrad | Per-weight steps scaled by the sum of past squared gradients |
| RMSProp | Per-weight steps scaled by a running average of squared gradients |
| Adam | Momentum + RMSProp + bias correction |
| First / second moment | Running average of gradients / of squared gradients |
| Bias correction | Fix for averages that start at zero |
| Weight decay | Shrinking weights a little each step to reduce overfitting |
| AdamW | Adam with weight decay applied directly to the weights |
| Learning rate schedule | A plan for changing η during training |
| Cosine annealing | η decreases along a cosine curve |
| Warmup | Start with tiny η and ramp up over the first steps |
| LR range test | Short run with increasing η to find a good value |
| Linear scaling rule | Scale η with batch size (with warmup) |
| Gradient accumulation | Sum gradients over several small batches before one update |

## Interview questions

**What is the difference between SGD, mini-batch GD and batch GD?**
Batch gradient descent uses the whole dataset for each update, SGD uses one example, and mini-batch uses a small group. Mini-batch is the standard in deep learning because it balances accurate gradients with cheap, GPU-friendly steps. In practice "SGD" usually means mini-batch SGD.

**How does momentum help?**
It keeps a running velocity of past gradients, so consistent directions build up speed while oscillating directions cancel out. This speeds up progress along long, narrow valleys and helps roll through flat regions and small bumps. β = 0.9 is the usual value.

**Explain Adam in two or three sentences.**
Adam keeps, for each weight, a running average of gradients (like momentum) and a running average of squared gradients (like RMSProp). It divides the first by the square root of the second, so each weight gets a step of roughly the learning rate in the direction of its recent gradients. Bias correction fixes the fact that both averages start at zero.

**Why do we need bias correction in Adam?**
m and v start at zero, so in the first steps they are much smaller than the true averages. Dividing by (1 − βᵗ) scales them up to unbiased estimates. Without it, early steps would have the wrong size, especially because β₂ = 0.999 makes v start very small.

**What is the difference between Adam with L2 regularization and AdamW?**
With Adam, an L2 penalty's gradient is divided by √v̂ along with the rest of the gradient, so weights with large gradients get very little regularization. AdamW subtracts η·λ·w directly from the weights, separate from the adaptive scaling, which gives true weight decay. AdamW generalizes better and is standard for Transformers.

**Why use learning rate warmup?**
At the start, weights are random, gradients can be large and Adam's second-moment estimates are unreliable, so a full learning rate can destabilize training. Warmup ramps the learning rate from near zero over the first steps, letting the statistics settle. It is essential for most Transformer training.

**Your training loss is going down very slowly. What would you try?**
Check the learning rate first; try a larger one or run an LR range test. Check that the data and labels are correct and that inputs are normalized. Then consider a better optimizer (Adam), normalization layers, better initialization, or checking for vanishing gradients by logging gradient norms per layer.

**How does batch size affect training?**
Larger batches give less noisy gradients and better GPU use, but need more memory and often a larger learning rate with warmup; very large batches can generalize worse. Small batches are noisier, which can act as regularization, but use the hardware less efficiently. Gradient accumulation lets you simulate a larger batch.

**When would you choose SGD with momentum over Adam?**
For training CNNs on image classification from scratch, well-tuned SGD with momentum and a good schedule often generalizes slightly better. Adam or AdamW is preferred for Transformers, for fine-tuning, and when you want something that works with little tuning.

**How much extra memory does Adam need?**
Two extra values per parameter (m and v). In fp32 that is 8 extra bytes per parameter, so 56 GB for a 7B-parameter model, just for optimizer state. This drives techniques like 8-bit optimizers, optimizer state sharding (ZeRO / FSDP) and parameter-efficient fine-tuning.

## Try it yourself

1. Run plain SGD on f(w) = (w − 3)² from w = 0 with η = 0.25 for three steps, by hand. *Hint:* the gradient is 2(w − 3).
2. Do one Adam step by hand for a weight with gradient g = 0.001, η = 0.01, starting from m = v = 0. Compare the step size with the case g = 1000. *Hint:* after bias correction, m̂ = g and v̂ = g².
3. Write a function `lr_at(step, peak, warmup, total)` for linear warmup followed by cosine decay and check it against the table above. *Hint:* use `math.cos` and `math.pi`.
4. A model trains well with batch size 32 and η = 1e-4. You move to 4 GPUs with batch size 32 each. What learning rate would you try first, and what else would you add? *Hint:* effective batch size.

### Answers

1. Step 1: g = 2(0 − 3) = −6, w = 0 − 0.25 × (−6) = 1.5. Step 2: g = 2(1.5 − 3) = −3, w = 1.5 + 0.75 = 2.25. Step 3: g = −1.5, w = 2.25 + 0.375 = 2.625. Each step halves the distance to 3.
2. m = 0.1g, v = 0.001g², m̂ = g, v̂ = g², step = η · g / |g| = 0.01 (ignoring ε). The same 0.01 for g = 1000. Adam's first step size does not depend on the gradient's scale, only on its sign.
3. One solution:

```python
import math

def lr_at(step, peak, warmup, total):
    if step < warmup:
        return peak * step / warmup
    progress = (step - warmup) / (total - warmup)
    return peak * 0.5 * (1 + math.cos(math.pi * progress))

for s in [0, 500, 1000, 5500, 10000]:
    print(s, lr_at(s, 3e-4, 1000, 10000))
# 0 0.0 | 500 0.00015 | 1000 0.0003 | 5500 0.00015 (approx.) | 10000 0.0
```

4. The effective batch is 4 × 32 = 128, four times larger. By the linear scaling rule, try η = 4 × 1e-4 = 4e-4, with a warmup period, and watch the loss curve; if it is unstable, try 2e-4 (square-root scaling).

**Next:** [PyTorch Tensors and Autograd](/interview/deep-learning/pytorch-tensors-and-autograd)
