---
title: PyTorch Tensors and Autograd
part: PyTorch
summary: Tensors, dtypes, shapes, reshaping, broadcasting and devices (CPU, CUDA, MPS), then autograd, requires_grad, backward, gradient accumulation, no_grad and detach, ending with linear regression trained from scratch using only tensors and autograd.
---

PyTorch is the most used deep learning framework in research and in most AI teams in 2026; nearly every open model on Hugging Face ships PyTorch weights. Two ideas carry the whole library: the **tensor**, a NumPy-like array that can live on a GPU, and **autograd**, the engine that computes gradients for you by recording your operations. Once you are comfortable with these two, `nn.Module`, optimizers and training loops are just convenient wrappers. Most real bugs you will debug are shape bugs, dtype bugs and device bugs, so this chapter spends time on those.

> **In simple words:** A tensor is a multi-dimensional array of numbers that can run on a GPU. If you set `requires_grad=True` on a tensor, PyTorch remembers every operation done with it, and calling `.backward()` on the final loss fills `.grad` with the gradient of the loss for that tensor.

This chapter assumes PyTorch 2.x. Install with `pip install torch` (check pytorch.org for the right command for your CUDA version).

## What a tensor is

A **tensor** is a container of numbers arranged in a grid with any number of dimensions. The number of dimensions is called the **rank** or `ndim`.

| Rank | Name | Example | Shape |
|---|---|---|---|
| 0 | scalar | a loss value | `()` |
| 1 | vector | one house's 3 features | `(3,)` |
| 2 | matrix | a batch of 32 rows with 10 features | `(32, 10)` |
| 3 | 3-D tensor | a batch of 8 sentences, 128 tokens each, 768-dim embeddings | `(8, 128, 768)` |
| 4 | 4-D tensor | a batch of 16 RGB images, 224 × 224 pixels | `(16, 3, 224, 224)` |

PyTorch images use **channels first**: (batch, channels, height, width), often written **N, C, H, W**. NumPy and image libraries like PIL usually use height, width, channels. Mixing these up is a classic bug.

> **Real-life example:** A tensor is like a stack of Excel sheets. A single cell is a scalar, one row is a vector, one sheet is a matrix, a workbook of sheets is a 3-D tensor, and a cupboard of workbooks is 4-D.

### Creating tensors

```python
import torch
import numpy as np

a = torch.tensor([[1.0, 2.0, 3.0],
                  [4.0, 5.0, 6.0]])        # from a Python list
print(a.shape, a.dtype, a.ndim)             # torch.Size([2, 3]) torch.float32 2

torch.zeros(2, 3)                           # all zeros, shape (2, 3)
torch.ones(4)                               # tensor([1., 1., 1., 1.])
torch.arange(0, 10, 2)                      # tensor([0, 2, 4, 6, 8])
torch.linspace(0, 1, 5)                     # tensor([0.00, 0.25, 0.50, 0.75, 1.00])
torch.rand(2, 2)                            # uniform random in [0, 1)
torch.randn(2, 2)                           # random from a normal distribution (mean 0, std 1)
torch.zeros_like(a)                         # same shape and dtype as a

n = np.array([1, 2, 3])
t = torch.from_numpy(n)                     # shares memory with n (no copy!)
back = t.numpy()                            # tensor -> NumPy (CPU tensors only)
```

> **Common mistake:** `torch.from_numpy` shares memory: changing the NumPy array changes the tensor too. Use `torch.tensor(n)` if you want an independent copy.

### Data types (dtypes)

| dtype | Bytes | Used for |
|---|---|---|
| `torch.float32` | 4 | the default for weights and inputs |
| `torch.float16` | 2 | mixed precision on GPUs (smaller, faster, smaller range) |
| `torch.bfloat16` | 2 | mixed precision with the same range as float32; standard for LLMs |
| `torch.int64` (`torch.long`) | 8 | class labels, token IDs, indices |
| `torch.bool` | 1 | masks |

`torch.tensor([1, 2])` gives int64; `torch.tensor([1.0, 2.0])` gives float32. Convert with `.float()`, `.long()`, or `.to(torch.bfloat16)`. Most operations need both inputs to have compatible dtypes; `CrossEntropyLoss` needs labels as `long`.

## Shapes and reshaping

Shape bugs are the most common PyTorch error. Learn these operations well.

```python
x = torch.arange(12)            # shape (12,)
x.reshape(3, 4)                 # shape (3, 4)
x.reshape(3, -1)                # -1 means "work it out": (3, 4)
x.view(2, 6)                    # like reshape, but needs contiguous memory

img = torch.rand(3, 32, 32)     # C, H, W
img.unsqueeze(0).shape          # (1, 3, 32, 32): add a batch dimension at position 0
img.unsqueeze(0).squeeze(0).shape   # (3, 32, 32): remove size-1 dimension
img.permute(1, 2, 0).shape      # (32, 32, 3): reorder dimensions to H, W, C

batch = torch.rand(16, 3, 32, 32)
batch.flatten(start_dim=1).shape    # (16, 3072): keep batch, flatten the rest
```

| Operation | What it does |
|---|---|
| `reshape(...)` | new shape with the same number of elements; copies only if needed |
| `view(...)` | new shape without copying; fails on non-contiguous tensors |
| `unsqueeze(d)` / `squeeze(d)` | add / remove a dimension of size 1 |
| `permute(...)` | reorder dimensions (e.g. HWC → CHW) |
| `transpose(a, b)` / `.T` | swap two dimensions |
| `flatten(start_dim)` | merge dimensions into one |
| `cat([a, b], dim)` | join along an existing dimension |
| `stack([a, b], dim)` | join along a new dimension |

After `permute` or `transpose`, the memory is no longer in row order (**not contiguous**), so `view` fails. Use `reshape`, or call `.contiguous()` first.

### Indexing and masks

```python
a = torch.tensor([[1, 2, 3],
                  [4, 5, 6]])
a[0]          # tensor([1, 2, 3])      first row
a[:, 1]       # tensor([2, 5])         second column
a[a > 2]      # tensor([3, 4, 5, 6])   boolean mask
a[1, -1]      # tensor(6)              last element of row 1
```

## Math and broadcasting

Arithmetic like `+`, `*`, `torch.exp` is **element-wise**. Matrix multiplication uses `@` (or `torch.matmul`).

**Broadcasting** lets you combine tensors of different shapes by "stretching" size-1 or missing dimensions. Rules, comparing shapes from the right:

1. Two dimensions are compatible if they are equal or one of them is 1 (or missing).
2. The size-1 dimension is stretched to match.

**Worked example.** X has shape (2, 3) and b has shape (3,). b is treated as (1, 3), then stretched to (2, 3):

- X = [[1, 2, 3], [4, 5, 6]], b = [10, 20, 30]
- X + b = [[1+10, 2+20, 3+30], [4+10, 5+20, 6+30]] = [[11, 22, 33], [14, 25, 36]]

This is exactly how a layer adds its bias to every example in a batch.

```python
X = torch.tensor([[1., 2., 3.], [4., 5., 6.]])   # (2, 3)
b = torch.tensor([10., 20., 30.])                # (3,)
print(X + b)            # tensor([[11., 22., 33.], [14., 25., 36.]])

W = torch.randn(4, 3)                            # 4 neurons, 3 inputs
print((X @ W.T).shape)  # torch.Size([2, 4])  -> like nn.Linear(3, 4)

print(X.sum())                  # tensor(21.)
print(X.sum(dim=0))             # tensor([5., 7., 9.])   sum down the rows
print(X.sum(dim=1))             # tensor([ 6., 15.])     sum across each row
print(X.mean(dim=1, keepdim=True).shape)   # torch.Size([2, 1])
print(X.argmax(dim=1))          # tensor([2, 2])   index of max in each row
```

`dim` means "the dimension that disappears". `keepdim=True` keeps it as size 1, which is useful for broadcasting back (for example X − X.mean(dim=1, keepdim=True)).

> **Common mistake:** Broadcasting can silently give a wrong shape. If predictions have shape (32, 1) and targets have shape (32,), `pred - target` broadcasts to (32, 32), and your MSE is computed over 1,024 wrong pairs with no error. `nn.MSELoss` warns about this; always check shapes with `.shape` or use `pred.squeeze(1)`.

## Devices: CPU, CUDA and MPS

A tensor lives on a **device**: the CPU, an NVIDIA GPU (**CUDA**), or an Apple Silicon GPU (**MPS**). Operations need all their tensors on the same device.

```python
device = (
    "cuda" if torch.cuda.is_available()
    else "mps" if torch.backends.mps.is_available()
    else "cpu"
)
print(device)

x = torch.randn(1000, 1000).to(device)   # move to GPU (copy)
y = torch.randn(1000, 1000, device=device)  # create directly on the device
z = x @ y                                # runs on the GPU
result = z.cpu().numpy()                 # bring back to CPU before NumPy
```

- `.to(device)` returns a copy on that device; the original stays where it was. For tensors you must assign it: `x = x.to(device)`. For a model, `model.to(device)` moves its parameters in place.
- Moving data between CPU and GPU is slow compared to GPU math. Move once, do lots of work, move back once.
- GPU work is **asynchronous**: Python continues before the GPU finishes. Calls like `.item()`, `.cpu()` or `print` force a wait. This matters when you time code.

> **Common mistake:** `RuntimeError: Expected all tensors to be on the same device`. You moved the model to the GPU but not the batch (or the reverse). Inside the training loop, always do `x, y = x.to(device), y.to(device)`.

## Autograd: automatic gradients

In [Loss Functions and Backpropagation](/interview/ai-engineer/deep-learning/loss-functions-and-backpropagation) you computed gradients by hand. **Autograd** does it automatically. When a tensor has `requires_grad=True`, PyTorch records each operation applied to it in a **computational graph**. Calling `.backward()` on a scalar result walks that graph backward with the chain rule and stores ∂result/∂tensor in each tensor's `.grad` field.

**Worked example.** y = x² + 3x at x = 2. By hand: y = 4 + 6 = 10, and dy/dx = 2x + 3 = 2 × 2 + 3 = **7**.

```python
x = torch.tensor(2.0, requires_grad=True)
y = x**2 + 3 * x
print(y)            # tensor(10., grad_fn=<AddBackward0>)
y.backward()        # compute dy/dx
print(x.grad)       # tensor(7.)
```

The `grad_fn=<AddBackward0>` shows that y remembers it was made by an addition. This chain of `grad_fn`s is the graph.

**Two inputs.** z = x·y + y² with x = 2, y = 3. By hand: ∂z/∂x = y = 3, and ∂z/∂y = x + 2y = 2 + 6 = 8.

```python
x = torch.tensor(2.0, requires_grad=True)
y = torch.tensor(3.0, requires_grad=True)
z = x * y + y**2          # 6 + 9 = 15
z.backward()
print(x.grad, y.grad)     # tensor(3.) tensor(8.)
```

### Key autograd facts

**1. Gradients accumulate.** Each `.backward()` **adds** to `.grad`, it does not replace it. That is why every training loop calls `optimizer.zero_grad()`.

```python
x = torch.tensor(2.0, requires_grad=True)
for _ in range(2):
    y = x**2 + 3 * x
    y.backward()
print(x.grad)       # tensor(14.)  -> 7 + 7, not 7!
x.grad = None       # reset (this is what zero_grad does by default)
```

Accumulation is a feature: it lets you do gradient accumulation over several batches (see [Optimizers and Learning Rate](/interview/ai-engineer/deep-learning/optimizers-and-learning-rate)).

**2. `.backward()` needs a scalar.** The loss is one number. If you call it on a tensor with many values, PyTorch raises an error unless you pass a `gradient` argument. Usually you just need `.mean()` or `.sum()` first.

**3. The graph is freed after backward.** Calling `.backward()` twice on the same graph fails unless you pass `retain_graph=True`. A normal training loop builds a new graph every iteration, so this rarely matters.

**4. Leaf tensors.** Only tensors you created directly with `requires_grad=True` (called **leaf tensors**, like model weights) get `.grad` filled. Intermediate results do not keep `.grad` unless you call `.retain_grad()` on them.

**5. Turning autograd off.** During evaluation and inference you do not need gradients. Recording the graph wastes memory and time.

| Tool | What it does | When to use |
|---|---|---|
| `with torch.no_grad():` | operations inside are not recorded | validation loops, manual weight updates |
| `with torch.inference_mode():` | like no_grad, a bit faster, tensors cannot be used in autograd later | pure inference / serving |
| `t.detach()` | a new tensor sharing data but cut from the graph | logging, using a value as a constant target |
| `t.item()` | Python number from a 1-element tensor | logging the loss |
| `p.requires_grad_(False)` | freeze a parameter | transfer learning (see [Transfer Learning and Pretrained Models](/interview/ai-engineer/deep-learning/transfer-learning-and-pretrained-models)) |

> **Common mistake:** Appending `loss` to a list for logging (`losses.append(loss)`). This keeps every graph alive and memory grows each step. Use `losses.append(loss.item())`.

**6. In-place changes can break autograd.** Operations ending in `_` (like `x.add_(1)`) change a tensor in place. If autograd needed the old value for the backward pass, you get an error like "one of the variables needed for gradient computation has been modified by an inplace operation". Avoid in-place ops on tensors that are part of the graph.

## Linear regression from scratch with autograd

Let us train a model using only tensors and autograd, no `nn` module, no optimizer. This shows exactly what the higher-level tools do. Data: y = 2x + 1. The model has one weight w and one bias b, both starting at 0.

```python
import torch

x = torch.linspace(0, 1, 20)           # 20 inputs between 0 and 1
y = 2 * x + 1                          # true relation: w = 2, b = 1

w = torch.tensor(0.0, requires_grad=True)
b = torch.tensor(0.0, requires_grad=True)
lr = 0.5

for step in range(201):
    pred = w * x + b                   # forward pass
    loss = ((pred - y) ** 2).mean()    # MSE loss (a scalar)

    loss.backward()                    # fills w.grad and b.grad

    with torch.no_grad():              # do not record the update itself
        w -= lr * w.grad               # gradient descent step
        b -= lr * b.grad
    w.grad = None                      # reset gradients for the next step
    b.grad = None

    if step % 50 == 0:
        print(step, f"{loss.item():.4f}")

print(f"w = {w.item():.4f}, b = {b.item():.4f}")
```

```text
0 4.3684
50 0.0001
100 0.0000
150 0.0000
200 0.0000
w = 2.0000, b = 1.0000
```

Line by line:

- `requires_grad=True` on w and b tells autograd to track them.
- The forward pass and loss build a graph from w and b to `loss`.
- `loss.backward()` computes ∂loss/∂w and ∂loss/∂b.
- The update is inside `torch.no_grad()` because we do not want autograd to record "w minus something" as part of the next graph. Without it, PyTorch raises an error for modifying a leaf tensor in place.
- We reset the gradients, otherwise they would add up across steps.

In the next chapter, `nn.Linear` replaces w and b, `nn.MSELoss` replaces the loss line, and `torch.optim.SGD` replaces the update and reset lines. The logic is identical.

> **Interview tip:** If asked "what does `optimizer.zero_grad()` do and why is it needed?", say: PyTorch accumulates gradients into `.grad` on every backward call, which is useful for gradient accumulation, so you must clear them before each new batch or you will use the sum of old and new gradients.

## A quick look at `torch.compile`

PyTorch 2.x added `torch.compile(model)`, which traces your model and generates faster fused GPU code. It often gives a speed-up with one line of code, but the first call is slow because it compiles. You do not need it to learn; it is useful to know it exists for training and serving speed.

```python
model = torch.compile(model)   # optional: same results, usually faster after warm-up
```

## Key terms

| Term | Simple meaning |
|---|---|
| Tensor | A multi-dimensional array that can live on a GPU and track gradients |
| Rank / ndim | Number of dimensions of a tensor |
| Shape | Size along each dimension, like (16, 3, 224, 224) |
| N, C, H, W | Batch, channels, height, width: PyTorch's image layout |
| dtype | The number type, like float32, bfloat16 or int64 |
| bfloat16 | 16-bit float with float32's range, common for LLMs |
| reshape / view | Change shape without changing data |
| permute | Reorder dimensions |
| squeeze / unsqueeze | Remove / add a size-1 dimension |
| Contiguous | Memory stored in normal row order; needed for `view` |
| Broadcasting | Stretching size-1 dimensions so different shapes can combine |
| Device | Where a tensor lives: CPU, CUDA GPU or MPS |
| CUDA | NVIDIA's GPU computing platform |
| MPS | Apple's GPU backend for PyTorch |
| Autograd | PyTorch's automatic differentiation engine |
| requires_grad | Flag telling autograd to track a tensor |
| grad_fn | The recorded operation that created a tensor |
| .backward() | Compute gradients of a scalar with respect to leaf tensors |
| .grad | Where a leaf tensor's gradient is stored |
| Leaf tensor | A tensor created by you (like a weight), not computed from others |
| Gradient accumulation | `.grad` adds up across backward calls until reset |
| no_grad / inference_mode | Contexts that switch off graph recording |
| detach | Cut a tensor from the graph |
| torch.compile | PyTorch 2 feature that compiles a model for speed |

## Interview questions

**What is the difference between a PyTorch tensor and a NumPy array?**
Both are n-dimensional arrays with similar operations. A tensor can live on a GPU and can record operations for automatic differentiation, which NumPy cannot. They can share memory on the CPU via `torch.from_numpy` and `.numpy()`.

**What does `requires_grad=True` do?**
It tells autograd to record every operation involving the tensor, so that gradients with respect to it can be computed with `.backward()`. Model parameters have it set automatically; input data normally does not.

**Why does PyTorch accumulate gradients instead of overwriting them?**
Accumulation allows gradient accumulation across mini-batches and models where one parameter is used in several places (gradients from all uses must be summed). The cost is that you must call `optimizer.zero_grad()` before each new step.

**What is the difference between `torch.no_grad()` and `.detach()`?**
`torch.no_grad()` is a context: no operations inside it are recorded, which saves memory during evaluation. `.detach()` acts on one tensor: it returns a view of the same data that is cut off from the graph, so gradients do not flow back through it.

**What is the difference between `view` and `reshape`?**
Both change the shape without changing the data. `view` never copies and requires contiguous memory; it fails after operations like `transpose`. `reshape` uses a view when possible and copies when needed, so it always works.

**Explain broadcasting with an example.**
When shapes differ, PyTorch compares them from the right and stretches dimensions of size 1. Adding a bias of shape (3,) to a batch of shape (32, 3) treats the bias as (1, 3) and adds it to each of the 32 rows. It saves memory because nothing is actually copied.

**You get "Expected all tensors to be on the same device". How do you fix it?**
One tensor is on the CPU and another on the GPU. Move the model once with `model.to(device)` and move every batch inside the loop with `x.to(device)`. Also check tensors created inside the forward method; create them with `device=x.device`.

**Why should you log `loss.item()` and not `loss`?**
`loss` is a tensor connected to the whole computational graph. Storing it keeps the graph and its activations in memory, so memory grows every step. `.item()` returns a plain Python number with no graph attached.

**How does autograd know how to compute gradients?**
Every operation on tracked tensors creates a node with a `grad_fn` that knows its local derivative. Calling `.backward()` traverses this graph from the output in reverse order, multiplying incoming gradients by local derivatives (the chain rule) and summing where paths merge. This is reverse-mode automatic differentiation.

## Try it yourself

1. Create a tensor of shape (2, 3, 4) with `torch.arange(24)`. Use `permute` to make it (4, 2, 3), then `reshape` it to (4, 6). Why would `view(4, 6)` fail after the permute? *Hint:* contiguous memory.
2. Use autograd to find the derivative of f(x) = x³ − 2x at x = 3. Check by hand. *Hint:* f′(x) = 3x² − 2.
3. Given `pred` with shape (8, 1) and `target` with shape (8,), what is the shape of `pred - target`? Fix it. *Hint:* broadcasting from the right.
4. Change the linear regression code to learn y = −3x + 5 and to also print w and b every 50 steps. *Hint:* only the data line changes for the first part.

### Answers

1. `t = torch.arange(24).reshape(2, 3, 4).permute(2, 0, 1)` gives shape (4, 2, 3); `t.reshape(4, 6)` works. `view` fails because after `permute` the elements are not stored in row order, so the tensor is not contiguous; `t.contiguous().view(4, 6)` works.
2. f′(3) = 3 × 9 − 2 = 25.

```python
x = torch.tensor(3.0, requires_grad=True)
f = x**3 - 2 * x
f.backward()
print(x.grad)   # tensor(25.)
```

3. (8, 1) and (8,) broadcast to (8, 8), which is wrong. Fix with `pred.squeeze(1) - target` (both (8,)) or `pred - target.unsqueeze(1)` (both (8, 1)).
4. Change the data line to `y = -3 * x + 5` and add `print(step, f"{loss.item():.4f}", w.item(), b.item())`. The values should approach w = −3 and b = 5.

**Next:** [Building and Training a Model in PyTorch](/interview/ai-engineer/deep-learning/building-and-training-a-model-in-pytorch)
