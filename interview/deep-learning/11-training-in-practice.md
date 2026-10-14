---
title: Training in Practice
part: In Practice
summary: The practical skills that make training work, including GPUs and CUDA, estimating GPU memory, fixing out-of-memory errors, mixed precision with autocast, gradient clipping, the overfit-one-batch test, reading loss curves, reproducibility with seeds, and a checklist of the most common bugs.
---

Knowing the theory is half the job. The other half is making a real training run finish without crashing, use the GPU well, and give results you can trust and repeat. These are the skills interviewers probe with questions like "your loss is NaN, what do you do?" or "your model does not fit in GPU memory, what are your options?". This chapter collects the practical tools and the debugging habits experienced engineers use every day.

> **In simple words:** Use a GPU and keep it busy. Use mixed precision to train faster with less memory. Clip gradients to prevent explosions. Before a long run, check that the model can overfit one small batch. Watch the loss curves, fix your random seeds, and go through a checklist of common bugs when something looks wrong.

## GPUs and CUDA

A **GPU** (graphics processing unit) has thousands of small cores that do many multiply-adds at the same time. Neural network training is mostly large matrix multiplications, so a GPU is often 10 to 100 times faster than a CPU. **CUDA** is NVIDIA's platform for running general computations on its GPUs; PyTorch uses it under the hood. NVIDIA GPUs dominate deep learning; Apple Silicon (MPS backend), AMD (ROCm) and Google TPUs are alternatives.

```bash
nvidia-smi            # shows GPUs, memory used, utilization %, running processes
```

```python
import torch
print(torch.cuda.is_available())            # True if a CUDA GPU can be used
print(torch.cuda.get_device_name(0))        # e.g. the GPU model name
print(torch.cuda.memory_allocated() / 1e9)  # GB currently used by tensors
print(torch.cuda.max_memory_allocated() / 1e9)  # peak GB so far
```

If you do not have a GPU, free and cheap options exist: Google Colab and Kaggle notebooks provide GPUs with time limits, and cloud providers rent them by the hour (see [Cloud for AI](/interview/mlops-deployment/cloud-for-ai)).

### Keeping the GPU busy

A GPU sitting idle while it waits for data is wasted money. If `nvidia-smi` shows low utilization:

| Fix | How |
|---|---|
| Load data in parallel | `DataLoader(..., num_workers=4, pin_memory=True)` |
| Overlap copies with compute | `x.to(device, non_blocking=True)` together with `pin_memory=True` |
| Bigger batch size | more work per step, if memory allows |
| Avoid syncing every step | do not call `.item()` or `print` on GPU tensors every iteration; log every N steps |
| Compile the model | `model = torch.compile(model)` in PyTorch 2.x |
| Mixed precision | see below |

## How much GPU memory does training need?

Four things use memory during training:

1. **Weights** (parameters).
2. **Gradients**: one per parameter.
3. **Optimizer state**: Adam/AdamW keeps two extra values (m and v) per parameter (see [Optimizers and Learning Rate](/interview/deep-learning/optimizers-and-learning-rate)).
4. **Activations**: intermediate outputs stored for backprop. These grow with batch size, sequence length or image size, and model depth.

<div class="formula">

| Item (fp32, AdamW) | Bytes per parameter |
|---|---|
| Weights | 4 |
| Gradients | 4 |
| Adam m and v | 4 + 4 = 8 |
| Total before activations | 16 bytes per parameter |

</div>

**Worked example.** A 100-million-parameter model with AdamW in fp32:

- Weights: 100 × 10⁶ × 4 bytes = 400 MB
- Gradients: 400 MB
- Adam state: 800 MB
- Total: 1.6 GB, plus activations (often several more GB at a normal batch size).

The same rule for a 7-billion-parameter model gives 7 × 10⁹ × 16 bytes = 112 GB **before activations**, more than one 80 GB GPU. That is why full fine-tuning of LLMs needs several GPUs or tricks, and why LoRA and QLoRA are popular (see [Fine-tuning, LoRA and QLoRA](/interview/llms-genai/fine-tuning-lora-and-qlora)). Inference needs far less: roughly just the weights (7B × 2 bytes in bf16 = 14 GB) plus a cache (see [Serving Models](/interview/mlops-deployment/serving-models)).

### Fixing "CUDA out of memory"

| Option | Saves | Cost |
|---|---|---|
| Smaller batch size | activations | noisier gradients; adjust learning rate |
| Gradient accumulation | lets you keep the effective batch size with a small real batch | more steps per update |
| Mixed precision (bf16/fp16) | about half of activation memory, faster | small numerical care |
| Activation (gradient) checkpointing | most activation memory | about 20–30% more compute: some activations are recomputed in backward |
| Shorter sequences / smaller images | activations | may lose information |
| Smaller model or freezing layers | weights, gradients, optimizer state | lower capacity |
| 8-bit optimizers, LoRA | optimizer state and gradients | an extra library / method |
| Multi-GPU sharding (FSDP, DeepSpeed ZeRO) | splits weights, gradients and optimizer state across GPUs | more GPUs and setup |

> **Common mistake:** Running out of memory during **validation** even though training fits. The validation loop is missing `torch.no_grad()`, so it stores activations for a backward pass that never happens.

## Mixed precision training

By default, PyTorch uses 32-bit floats (**fp32**). **Mixed precision** runs most operations in a 16-bit format, which halves memory traffic and uses the GPU's fast **tensor cores**, often giving a 1.5–3× speed-up. Sensitive operations (like reductions and the loss) stay in fp32 automatically.

| Format | Bits (sign / exponent / mantissa) | Range | Notes |
|---|---|---|---|
| fp32 | 1 / 8 / 23 | huge (up to about 3.4 × 10³⁸) | default, precise |
| fp16 | 1 / 5 / 10 | max 65,504; tiny values underflow to 0 | needs **loss scaling** |
| bf16 | 1 / 8 / 7 | same range as fp32, less precision | no loss scaling needed; standard for LLMs on modern GPUs |

The danger with **fp16** is that small gradients (smaller than about 6 × 10⁻⁸) become exactly zero. **Loss scaling** multiplies the loss by a big number (like 65,536) before backward, so the gradients are scaled up into fp16's range; they are divided back before the optimizer step. PyTorch's `GradScaler` does this automatically and adjusts the scale if it sees infinities.

### Mixed precision code (PyTorch 2.x)

```python
import torch

device = "cuda"
use_bf16 = torch.cuda.is_bf16_supported()          # True on most recent NVIDIA GPUs
amp_dtype = torch.bfloat16 if use_bf16 else torch.float16
scaler = torch.amp.GradScaler("cuda", enabled=not use_bf16)   # only needed for fp16

model.train()
for x, y in train_loader:
    x, y = x.to(device, non_blocking=True), y.to(device, non_blocking=True)

    with torch.autocast(device_type="cuda", dtype=amp_dtype):   # forward in 16-bit where safe
        logits = model(x)
        loss = loss_fn(logits, y)

    optimizer.zero_grad(set_to_none=True)
    scaler.scale(loss).backward()          # scales the loss (does nothing if scaler disabled)
    scaler.unscale_(optimizer)             # bring gradients back to true size before clipping
    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
    scaler.step(optimizer)                 # skips the step if gradients contain inf/NaN
    scaler.update()                        # adjusts the scale for the next iteration
```

- `torch.autocast` wraps only the **forward pass and loss**, not the backward or optimizer step.
- The weights stay in fp32 ("master weights"); only the computation is in 16-bit.
- With bf16 you can drop the scaler lines entirely: just `loss.backward()` and `optimizer.step()`.
- On Ampere or newer NVIDIA GPUs, `torch.set_float32_matmul_precision("high")` also lets fp32 matrix multiplies use the faster **TF32** format, a free speed-up.

> **Interview tip:** "Why bf16 over fp16?" Answer: bf16 has the same exponent range as fp32, so gradients do not underflow and no loss scaling is needed; it has less precision, but neural networks tolerate that well. fp16 has more precision but a small range, so it needs a GradScaler.

## Gradient clipping

**Gradient clipping** limits how big the gradients can be before the optimizer step. It is the standard defence against **exploding gradients** (see [Loss Functions and Backpropagation](/interview/deep-learning/loss-functions-and-backpropagation)), especially in RNNs and Transformers.

The usual method is **clipping by norm**: compute the overall length (L2 norm) of all gradients together. If it is larger than `max_norm`, scale all gradients down by the same factor so the norm equals `max_norm`. The direction stays the same; only the size changes.

<div class="formula">

| Formula | Meaning |
|---|---|
| ‖g‖ = √(g₁² + g₂² + … + gₙ²) | total gradient norm over all parameters |
| if ‖g‖ > max_norm: g ← g × max_norm / ‖g‖ | rescale to the maximum allowed length |

</div>

**Worked example.** Two gradients g = [3, 4], max_norm = 1.

- Norm: √(3² + 4²) = √(9 + 16) = √25 = 5
- 5 > 1, so scale by 1/5: g = [3/5, 4/5] = [0.6, 0.8]
- Check: √(0.36 + 0.64) = √1 = 1. Same direction, length 1.

```python
loss.backward()
total_norm = torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
optimizer.step()
# total_norm is the norm BEFORE clipping: log it to spot spikes
```

Typical `max_norm` is 1.0 for Transformers and LLM fine-tuning. Clip **after** `backward()` and **before** `step()`; with fp16 and a GradScaler, call `scaler.unscale_(optimizer)` first, as shown above. There is also `clip_grad_value_`, which caps each gradient value separately, but it changes the direction and is used less.

## The overfit-one-batch test

Before launching a 10-hour training run, check that your model **can learn at all**. Take a single small batch (say 8 to 32 examples) and train on it alone for a few hundred steps. A working model and pipeline should drive the training loss close to zero and reach 100% accuracy on that batch, because memorizing a few examples is easy.

```python
x, y = next(iter(train_loader))            # one fixed batch
x, y = x.to(device), y.to(device)
model.train()
for step in range(300):
    logits = model(x)
    loss = loss_fn(logits, y)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    if step % 50 == 0:
        acc = (logits.argmax(1) == y).float().mean().item()
        print(step, round(loss.item(), 4), acc)
# Expect: loss falls towards ~0, accuracy reaches 1.0
```

If it **cannot** overfit one batch, there is a bug, and you found it in one minute instead of ten hours. Typical culprits: labels not matching inputs, a missing `zero_grad` or `step`, the wrong loss for the output, a learning rate far too low or too high, frozen parameters, an activation missing or applied twice, or data that is all zeros after a broken transform. (Turn off dropout and augmentation for this test, or expect it to take a little longer.)

> **Remember:** Debug in small steps: (1) check one batch of data by eye, (2) check the initial loss, (3) overfit one batch, (4) train on a small subset, (5) only then train on everything.

### Check the initial loss

At the start, a randomly initialized classifier should be roughly equally unsure about every class. With K classes, each probability is about 1/K, so the cross-entropy loss should be about −ln(1/K) = ln(K).

| Classes K | Expected initial loss ln(K) |
|---|---|
| 2 | 0.693 |
| 10 | 2.303 |
| 100 | 4.605 |
| 1,000 | 6.908 |

If your 10-class model starts at a loss of 30, something is wrong: maybe inputs are not normalized, the initialization is too large, or the labels are wrong.

## Monitoring loss curves

Log, at a minimum, the training loss (every N steps), the validation loss and metric (every epoch or every N steps), and the learning rate. Also very useful: the gradient norm, throughput (examples per second) and GPU memory. Tools: **TensorBoard** (`torch.utils.tensorboard.SummaryWriter`), **Weights & Biases**, or **MLflow** (see [Experiment Tracking and Model Registry](/interview/mlops-deployment/experiment-tracking-and-model-registry)).

<figure>
<svg viewBox="0 0 440 200" width="440" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<line x1="50" y1="20" x2="50" y2="170" />
<line x1="50" y1="170" x2="410" y2="170" />
<text x="20" y="100" fill="currentColor" stroke="none" transform="rotate(-90 20 100)" text-anchor="middle">training loss</text>
<text x="230" y="192" fill="currentColor" stroke="none" text-anchor="middle">training steps</text>
<polyline points="55,40 80,90 100,60 125,110 150,55 175,100 200,45 225,70 250,32 280,24" stroke-dasharray="5 4" />
<polyline points="55,40 100,55 150,70 200,82 250,92 300,100 350,107 400,113" />
<polyline points="55,40 90,95 130,125 170,140 210,148 250,152 290,155 330,157 370,158 400,159" stroke="var(--accent)" stroke-width="2.5" />
<text x="288" y="30" fill="currentColor" stroke="none">LR too high</text>
<text x="398" y="104" fill="currentColor" stroke="none" text-anchor="end">LR too low</text>
<text x="398" y="150" fill="var(--accent)" stroke="none" text-anchor="end" font-weight="bold">good LR</text>
</svg>
<figcaption>Training loss shapes and what they say about the learning rate: wild bouncing and rising (too high), a slow straight decline (too low), and a fast drop that flattens smoothly (good).</figcaption>
</figure>

| Curve shape | Likely cause | Action |
|---|---|---|
| Loss is NaN or infinity | LR too high, exploding gradients, log(0), bad data | lower LR, clip gradients, check inputs for NaN, use stable losses |
| Loss bounces and rises | LR too high | lower LR by 3–10×, add warmup |
| Loss falls very slowly in a straight line | LR too low | raise LR; run an LR range test |
| Loss flat from the start | bug: no learning (frozen params, missing step, wrong labels) | overfit-one-batch test |
| Training falls, validation rises | overfitting | regularization (see [Regularization, Dropout and Batch Norm](/interview/deep-learning/regularization-dropout-and-batch-norm)) |
| Sudden spikes, then recovery | bad batches, LR slightly high | inspect those batches, clip gradients |
| Loss drops sharply at certain epochs | step LR schedule | expected |
| Both high and close together | underfitting | bigger model, longer training, better features |

Training loss is noisy from batch to batch. Look at a smoothed version (a moving average) and the overall trend.

## Reproducibility

Neural network training is full of randomness: weight initialization, data shuffling, dropout, augmentation. Two runs of the same code give slightly different results. To compare experiments fairly and to debug, fix the **random seeds**.

```python
import os, random
import numpy as np
import torch

def set_seed(seed: int = 42):
    random.seed(seed)                     # Python's random module
    np.random.seed(seed)                  # NumPy
    torch.manual_seed(seed)               # PyTorch on CPU and all GPUs
    torch.cuda.manual_seed_all(seed)      # (explicit, for clarity)
    os.environ["PYTHONHASHSEED"] = str(seed)

set_seed(42)

# Optional: force deterministic GPU algorithms (slower; raises an error for ops with no deterministic version)
torch.backends.cudnn.benchmark = False
torch.use_deterministic_algorithms(True)  # some CUDA ops also need: export CUBLAS_WORKSPACE_CONFIG=:4096:8

# Reproducible shuffling and worker randomness for the DataLoader
g = torch.Generator().manual_seed(42)
def seed_worker(worker_id):
    worker_seed = torch.initial_seed() % 2**32
    np.random.seed(worker_seed)
    random.seed(worker_seed)
loader = DataLoader(train_ds, batch_size=64, shuffle=True, num_workers=4,
                    worker_init_fn=seed_worker, generator=g)
```

Even with all of this, results can differ across different GPUs, driver versions or PyTorch versions. Exact bit-for-bit reproducibility is only guaranteed on the same hardware and software. Good practice beyond seeds:

- Record the code version (git commit), library versions, configuration and data version for each run.
- Report results as the mean and spread over 3 or more seeds when comparing ideas; a 0.3% "improvement" can be pure seed noise.
- Save checkpoints with optimizer and scheduler states, so a run can resume exactly.

> **Interview tip:** If asked "how do you make training reproducible?", list: set seeds for Python, NumPy and PyTorch; seed DataLoader workers and the shuffle generator; enable deterministic algorithms if needed; log configs, code and data versions; and acknowledge that different hardware can still give tiny differences.

## Common bugs checklist

| Area | Bug | Symptom |
|---|---|---|
| Data | labels shuffled separately from inputs | accuracy stuck at chance |
| Data | train-time augmentation applied to validation/test | lower, noisy validation scores |
| Data | normalization stats computed on the test set, or on all data | leakage, over-optimistic results |
| Data | images in HWC instead of CHW, BGR instead of RGB | poor accuracy with pretrained models |
| Data | duplicate or near-duplicate examples across splits | validation too good to be true |
| Model | softmax/sigmoid before `CrossEntropyLoss` / `BCEWithLogitsLoss` | slow learning |
| Model | wrong `nn.Linear` input size after convolutions | shape error |
| Model | layers in a Python list instead of `nn.ModuleList` | those layers never train, not saved |
| Loop | missing `optimizer.zero_grad()` | erratic or exploding loss |
| Loop | missing `model.eval()` / `model.train()` | random or degraded eval results |
| Loop | no `torch.no_grad()` in evaluation | out-of-memory, slow |
| Loop | `scheduler.step()` called per epoch when it expects per batch (or reverse) | LR schedule far too fast or slow |
| Loop | storing `loss` instead of `loss.item()` | memory grows until OOM |
| Shapes | (batch, 1) vs (batch,) mismatch in a loss | silent broadcasting, wrong loss |
| Device | model on GPU, data on CPU | "Expected all tensors to be on the same device" |
| Numerics | `log` of zero, division by zero | NaN loss |
| Saving | saving the whole model object with pickle | breaks after refactoring; security risk |

## Training on more than one GPU (awareness level)

| Approach | Idea | When |
|---|---|---|
| DDP (`DistributedDataParallel`) | every GPU has a full copy of the model and a different slice of each batch; gradients are averaged | model fits on one GPU; you want speed |
| FSDP / DeepSpeed ZeRO | weights, gradients and optimizer state are split (sharded) across GPUs | model too large for one GPU |
| Tensor / pipeline parallelism | individual layers or groups of layers are split across GPUs | very large LLM training |

Multi-GPU jobs are launched with `torchrun --nproc_per_node=4 train.py`. Libraries like Hugging Face Accelerate and PyTorch Lightning handle most of the boilerplate. As an AI engineer you mainly need to know these names, when each is used, and that the effective batch size is per-GPU batch × number of GPUs × accumulation steps.

## Key terms

| Term | Simple meaning |
|---|---|
| GPU | Processor with thousands of cores for parallel math |
| CUDA | NVIDIA's platform for computing on GPUs |
| nvidia-smi | Command showing GPU memory and utilization |
| Activations (memory) | Intermediate outputs stored for backprop |
| OOM | "Out of memory" error |
| Activation checkpointing | Recompute some activations in backward to save memory |
| Mixed precision | Compute in 16-bit, keep master weights in 32-bit |
| fp16 / bf16 / TF32 | 16-bit formats with small range / fp32 range; TF32 is a fast fp32 matmul mode |
| Tensor cores | Special GPU units that speed up low-precision matrix math |
| autocast | PyTorch context that picks 16-bit ops where safe |
| Loss scaling / GradScaler | Multiply the loss to stop fp16 gradients underflowing |
| Gradient clipping | Limit the gradient norm before the update |
| Gradient norm | The overall length of all gradients together |
| Overfit-one-batch test | Train on one batch to prove the pipeline can learn |
| Initial loss check | A K-class model should start near ln(K) |
| TensorBoard / W&B | Tools to log and plot training curves |
| Random seed | Starting value that makes random numbers repeatable |
| Deterministic algorithms | GPU operations that give identical results each run |
| DDP | Data-parallel training with a full model copy per GPU |
| FSDP / ZeRO | Sharding model state across GPUs |

## Interview questions

**Your training loss becomes NaN after some steps. How do you debug it?**
First lower the learning rate and add gradient clipping, since exploding gradients are the most common cause. Then check the input data for NaN or extreme values, look for log(0) or division by zero in custom losses, and make sure you use stable built-ins like `CrossEntropyLoss`. With fp16, make sure a GradScaler is used, or switch to bf16. Logging the gradient norm shows exactly when it explodes.

**What is mixed precision training and why use it?**
It runs most of the forward and backward computation in a 16-bit format while keeping master weights in fp32. It roughly halves activation memory and uses tensor cores, often giving a 1.5–3× speed-up with nearly identical accuracy. In PyTorch it is `torch.autocast` plus, for fp16, a `GradScaler`.

**What is the difference between fp16 and bf16?**
Both use 16 bits. fp16 has 5 exponent bits and 10 mantissa bits: more precision but a small range, so small gradients underflow and loss scaling is needed. bf16 has 8 exponent bits like fp32 and only 7 mantissa bits: less precision but the same range, so no loss scaling is needed, which is why it is the standard for LLM training.

**How does gradient clipping work and when do you use it?**
Clip-by-norm computes the combined L2 norm of all gradients and, if it exceeds a threshold, scales them all down so the norm equals the threshold, keeping the direction. It prevents single bad batches or exploding gradients from making huge updates. It is standard for RNNs and Transformers, usually with max_norm = 1.0.

**What is the "overfit one batch" test and why is it useful?**
You train the model on a single small batch repeatedly. A correct pipeline should reach near-zero loss quickly. If it cannot, there is a bug in the data, model, loss or loop. It finds most bugs in minutes, before you spend hours on a full run.

**Your model does not fit in GPU memory. What are your options?**
Reduce batch size and use gradient accumulation to keep the effective batch size, enable mixed precision, use activation checkpointing, shorten sequences or image sizes, freeze layers or use LoRA, use an 8-bit optimizer, or shard across GPUs with FSDP or DeepSpeed. Also check that evaluation runs under `torch.no_grad()`.

**Estimate the training memory for a 1B-parameter model with AdamW in fp32.**
About 16 bytes per parameter for weights, gradients and the two Adam states: 1 × 10⁹ × 16 = 16 GB, plus activations, which depend on batch size and sequence length. Mixed precision reduces activation memory but the optimizer state usually stays in fp32.

**What should the initial loss be for a 10-class classifier, and why check it?**
About ln(10) ≈ 2.30, because a random model gives each class roughly 1/10 probability. A very different value suggests a bug, such as unnormalized inputs, a bad initialization, wrong labels or a loss applied to the wrong outputs.

**How do you make PyTorch training reproducible?**
Set seeds for Python, NumPy and PyTorch, seed the DataLoader generator and workers, and optionally enable deterministic algorithms and disable cuDNN benchmarking. Log code, config and data versions. Results can still differ slightly across GPUs or library versions.

**Your GPU utilization is only 30%. What would you do?**
The GPU is likely waiting for data or for the CPU. Increase DataLoader `num_workers`, enable `pin_memory` and `non_blocking` copies, simplify or cache preprocessing, avoid `.item()` calls every step, increase the batch size, and use mixed precision or `torch.compile`. A profiler (`torch.profiler`) shows where time goes.

## Try it yourself

1. Clip the gradient vector [6, 8, 0] to max_norm = 5 by hand. *Hint:* the norm is 10.
2. Estimate the fp32 + AdamW training memory (without activations) for a 350-million-parameter model. Will it fit on a 16 GB GPU? *Hint:* 16 bytes per parameter.
3. Take the MNIST training script from [Building and Training a Model in PyTorch](/interview/deep-learning/building-and-training-a-model-in-pytorch), deliberately remove `optimizer.zero_grad()`, and run the overfit-one-batch test. What do you see? Then fix it. *Hint:* watch the loss over the first 50 steps.
4. Add gradient-norm logging to a training loop and print the maximum norm seen in each epoch. *Hint:* `clip_grad_norm_` returns the norm; use `max_norm=float("inf")` if you only want to measure without clipping.

### Answers

1. Norm = √(36 + 64 + 0) = 10. Scale by 5/10 = 0.5: [3, 4, 0]. Check: √(9 + 16) = 5.
2. 350 × 10⁶ × 16 bytes = 5.6 GB, so the model state fits on 16 GB, leaving about 10 GB for activations; reduce the batch size or use mixed precision if activations do not fit.
3. Without `zero_grad`, gradients from every step add up, so each update uses an ever-growing sum. The loss usually falls a little, then jumps around or explodes instead of going smoothly to zero. Adding `optimizer.zero_grad()` back before `loss.backward()` fixes it.
4. One solution:

```python
for epoch in range(num_epochs):
    max_norm_seen = 0.0
    for x, y in train_loader:
        x, y = x.to(device), y.to(device)
        loss = loss_fn(model(x), y)
        optimizer.zero_grad()
        loss.backward()
        norm = torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=float("inf"))
        max_norm_seen = max(max_norm_seen, norm.item())
        optimizer.step()
    print(f"epoch {epoch}: max grad norm {max_norm_seen:.3f}")
```

**Next:** [Deep Learning Interview Question Bank](/interview/deep-learning/deep-learning-interview-question-bank)
