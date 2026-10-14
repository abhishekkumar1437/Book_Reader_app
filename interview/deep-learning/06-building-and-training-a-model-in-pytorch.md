---
title: Building and Training a Model in PyTorch
part: PyTorch
summary: Defining models with nn.Module, feeding data with Dataset and DataLoader, the complete PyTorch 2.x training loop explained line by line, evaluation mode, saving and loading checkpoints, and a full MNIST-style example from data to prediction.
---

This is the chapter you will use every day. Almost every PyTorch project, from a small image classifier to a custom fine-tuning script for an LLM, has the same skeleton: a model class, a dataset, a data loader, a loss, an optimizer, and a loop of forward, backward, step. Libraries like Hugging Face `Trainer` or PyTorch Lightning hide this loop, but interviewers expect you to write it from memory and to explain every line. By the end of this chapter you will be able to.

> **In simple words:** You define the model as a class with layers and a `forward` method. A `DataLoader` gives you batches. For each batch you run the model, compute the loss, clear old gradients, call `backward()`, and call `optimizer.step()`. For evaluation you switch to `model.eval()` and turn off gradients.

## nn.Module: how models are defined

Every PyTorch model is a class that inherits from `nn.Module` (see [Classes and Objects](/interview/python/classes-and-objects) if classes are new to you). You do two things:

1. In `__init__`, create the layers and store them as attributes. PyTorch automatically **registers** every layer and its parameters, so `model.parameters()` can find them.
2. In `forward`, describe how input flows through the layers.

```python
import torch
from torch import nn

class MLP(nn.Module):
    def __init__(self, in_features=784, hidden=256, num_classes=10):
        super().__init__()                       # always call this first
        self.fc1 = nn.Linear(in_features, hidden)
        self.fc2 = nn.Linear(hidden, 128)
        self.out = nn.Linear(128, num_classes)
        self.act = nn.ReLU()

    def forward(self, x):                        # x: (batch, 1, 28, 28)
        x = x.flatten(start_dim=1)               # -> (batch, 784)
        x = self.act(self.fc1(x))                # -> (batch, 256)
        x = self.act(self.fc2(x))                # -> (batch, 128)
        return self.out(x)                       # -> (batch, 10) raw logits

model = MLP()
print(model)
n_params = sum(p.numel() for p in model.parameters())
print(n_params)                                  # 235146
```

Parameter count check: 784 × 256 + 256 = 200,960; 256 × 128 + 128 = 32,896; 128 × 10 + 10 = 1,290. Total = 235,146.

Key rules:

- Call the model as `model(x)`, **not** `model.forward(x)`. `model(x)` runs hooks and other internal steps that `forward` alone skips.
- The model returns **logits** (raw scores). The loss `nn.CrossEntropyLoss` applies softmax internally (see [Activation Functions](/interview/deep-learning/activation-functions)).
- Layers stored in a plain Python list are **not** registered. Use `nn.ModuleList` or `nn.Sequential`.

### nn.Sequential for simple stacks

When the model is a straight chain of layers, `nn.Sequential` is shorter:

```python
model = nn.Sequential(
    nn.Flatten(),                 # (batch, 1, 28, 28) -> (batch, 784)
    nn.Linear(784, 256), nn.ReLU(),
    nn.Linear(256, 128), nn.ReLU(),
    nn.Linear(128, 10),
)
```

| | `nn.Sequential` | Custom `nn.Module` |
|---|---|---|
| Good for | simple straight chains | branches, skip connections, multiple inputs/outputs |
| Code | very short | a little longer |
| Flexibility | low | full Python in `forward` |

> **Common mistake:** Forgetting `super().__init__()`. You will get an error like "cannot assign module before Module.__init__() call".

## Dataset and DataLoader: feeding data

Training data rarely fits on the GPU at once, and we want shuffled mini-batches. PyTorch splits this into two parts.

A **Dataset** answers two questions: how many examples are there (`__len__`) and what is example number i (`__getitem__`). It returns one (input, label) pair at a time.

```python
from torch.utils.data import Dataset, DataLoader

class HousePriceDataset(Dataset):
    def __init__(self, features, prices):
        self.X = torch.tensor(features, dtype=torch.float32)
        self.y = torch.tensor(prices, dtype=torch.float32)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, i):
        return self.X[i], self.y[i]

ds = HousePriceDataset([[3, 1200], [2, 800], [4, 1500], [3, 1000]],
                       [75.0, 48.0, 95.0, 62.0])     # prices in ₹ lakh
print(len(ds), ds[0])   # 4 (tensor([   3., 1200.]), tensor(75.))
```

For in-memory tensors, `torch.utils.data.TensorDataset(X, y)` does the same with no class needed. For images on disk, `__getitem__` would open the file and apply transforms; loading happens lazily, one example at a time.

A **DataLoader** wraps a Dataset and produces **batches**: it picks indices, calls `__getitem__` for each, and stacks the results into tensors.

```python
loader = DataLoader(ds, batch_size=2, shuffle=True)
for xb, yb in loader:
    print(xb.shape, yb.shape)    # torch.Size([2, 2]) torch.Size([2])
```

| Argument | Meaning | Typical value |
|---|---|---|
| `batch_size` | examples per batch | 32 to 256 for small models |
| `shuffle` | new random order each epoch | `True` for training, `False` for val/test |
| `num_workers` | background processes that load data | 2 to 8 on Linux; start with 0 on Windows if you hit errors |
| `pin_memory` | page-locked CPU memory, faster copies to GPU | `True` when training on CUDA |
| `drop_last` | drop the final smaller batch | `True` if batch norm or fixed shapes need it |

> **Interview tip:** If the GPU is idle much of the time (low utilization in `nvidia-smi`), the data loader is often the bottleneck. Increase `num_workers`, use `pin_memory=True`, and move heavy preprocessing out of `__getitem__` or cache it.

## The training loop, line by line

Here is a complete, correct training function. Learn it until you can write it without looking.

```python
def train_one_epoch(model, loader, loss_fn, optimizer, device):
    model.train()                                   # 1. training mode
    total_loss, correct, seen = 0.0, 0, 0
    for x, y in loader:                             # 2. one mini-batch at a time
        x, y = x.to(device), y.to(device)           # 3. same device as the model

        logits = model(x)                           # 4. forward pass
        loss = loss_fn(logits, y)                   # 5. compare with labels

        optimizer.zero_grad()                       # 6. clear old gradients
        loss.backward()                             # 7. backprop: fill .grad
        optimizer.step()                            # 8. update the weights

        total_loss += loss.item() * x.size(0)       # 9. track metrics
        correct += (logits.argmax(dim=1) == y).sum().item()
        seen += x.size(0)
    return total_loss / seen, correct / seen
```

1. **`model.train()`** switches layers that behave differently during training into training mode. Dropout starts dropping neurons, and batch norm uses the current batch's statistics and updates its running averages (see [Regularization, Dropout and Batch Norm](/interview/deep-learning/regularization-dropout-and-batch-norm)). For a model without such layers it changes nothing, but always call it, because you will call `model.eval()` later.
2. **`for x, y in loader`** gives one batch per iteration. With `shuffle=True`, the order is new every epoch. One full pass of this loop is one **epoch**.
3. **`.to(device)`** moves the batch to the GPU (or wherever the model is). The model was moved once, before training, with `model.to(device)`.
4. **`logits = model(x)`** runs the forward pass. Autograd records every operation, building the computational graph.
5. **`loss = loss_fn(logits, y)`** gives one scalar: the average loss over the batch. For `CrossEntropyLoss`, `logits` has shape (batch, classes) and `y` has shape (batch,) with integer class labels.
6. **`optimizer.zero_grad()`** clears gradients from the previous batch. PyTorch accumulates gradients (see [PyTorch Tensors and Autograd](/interview/deep-learning/pytorch-tensors-and-autograd)), so without this you would use the sum of all past gradients. In PyTorch 2.x it sets `.grad` to `None` by default, which saves memory. It can go anywhere before `loss.backward()`; putting it right before is the clearest.
7. **`loss.backward()`** runs backpropagation through the graph and stores ∂loss/∂parameter in every parameter's `.grad`. The graph is freed afterward.
8. **`optimizer.step()`** updates every parameter using its `.grad`, with the rule of the chosen optimizer (SGD, Adam, AdamW; see [Optimizers and Learning Rate](/interview/deep-learning/optimizers-and-learning-rate)).
9. **Metrics.** `loss.item()` turns the loss into a Python float (no graph attached). We multiply by the batch size because the last batch may be smaller, so a plain average of batch losses would be slightly off. `argmax(dim=1)` picks the predicted class for each row.

> **Remember:** The order is **forward → loss → zero_grad → backward → step**. The four lines that never change: `logits = model(x)`, `loss = loss_fn(logits, y)`, `loss.backward()`, `optimizer.step()`, plus `zero_grad()` before backward.

<figure>
<svg viewBox="0 0 420 170" width="420" height="170" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<rect x="10" y="20" width="80" height="34" rx="8" />
<text x="50" y="42" text-anchor="middle" fill="currentColor" stroke="none">batch x, y</text>
<line x1="90" y1="37" x2="120" y2="37" />
<polygon points="120,32 130,37 120,42" fill="currentColor" />
<rect x="130" y="20" width="80" height="34" rx="8" />
<text x="170" y="42" text-anchor="middle" fill="currentColor" stroke="none">model(x)</text>
<line x1="210" y1="37" x2="240" y2="37" />
<polygon points="240,32 250,37 240,42" fill="currentColor" />
<rect x="250" y="20" width="80" height="34" rx="8" />
<text x="290" y="42" text-anchor="middle" fill="currentColor" stroke="none">loss_fn</text>
<line x1="330" y1="37" x2="360" y2="37" />
<line x1="360" y1="37" x2="360" y2="110" />
<polygon points="355,100 360,110 365,100" fill="currentColor" />
<rect x="300" y="110" width="110" height="34" rx="8" stroke="var(--accent)" />
<text x="355" y="132" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">zero_grad</text>
<line x1="300" y1="127" x2="270" y2="127" />
<polygon points="270,122 260,127 270,132" fill="currentColor" />
<rect x="160" y="110" width="100" height="34" rx="8" stroke="var(--accent)" />
<text x="210" y="132" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">backward()</text>
<line x1="160" y1="127" x2="130" y2="127" />
<polygon points="130,122 120,127 130,132" fill="currentColor" />
<rect x="20" y="110" width="100" height="34" rx="8" stroke="var(--accent)" />
<text x="70" y="132" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">step()</text>
<line x1="50" y1="110" x2="50" y2="64" />
<polygon points="45,64 50,54 55,64" fill="currentColor" />
</svg>
<figcaption>One training iteration: forward, loss, clear gradients, backward, update; then the next batch.</figcaption>
</figure>

## Evaluation: model.eval() and no_grad

```python
@torch.no_grad()                                    # no graph: saves memory and time
def evaluate(model, loader, loss_fn, device):
    model.eval()                                    # dropout off, batch norm uses running stats
    total_loss, correct, seen = 0.0, 0, 0
    for x, y in loader:
        x, y = x.to(device), y.to(device)
        logits = model(x)
        total_loss += loss_fn(logits, y).item() * x.size(0)
        correct += (logits.argmax(dim=1) == y).sum().item()
        seen += x.size(0)
    return total_loss / seen, correct / seen
```

`model.eval()` and `torch.no_grad()` do **different** jobs, and you need both:

| | `model.eval()` | `torch.no_grad()` |
|---|---|---|
| What it changes | behaviour of layers (dropout, batch norm) | whether autograd records a graph |
| If you forget it | wrong / random predictions, lower accuracy | wasted memory and time (results still correct) |
| Undo with | `model.train()` | leave the `with` block |

> **Common mistake:** Forgetting to call `model.train()` again after evaluating in the middle of training. Then dropout stays off and batch norm stops updating for the rest of training. Putting `model.train()` at the start of `train_one_epoch` and `model.eval()` at the start of `evaluate`, as above, avoids this.

## Saving and loading models

Save the **`state_dict`**: a dictionary mapping each parameter name to its tensor. Do not pickle the whole model object; that breaks if you rename or move your class.

```python
# Save only the weights (for inference)
torch.save(model.state_dict(), "mlp.pt")

# Load: build the same architecture, then fill in the weights
model = MLP()
model.load_state_dict(torch.load("mlp.pt", map_location="cpu", weights_only=True))
model.eval()
```

To **resume training** later, save a **checkpoint** with everything needed to continue:

```python
checkpoint = {
    "epoch": epoch,
    "model": model.state_dict(),
    "optimizer": optimizer.state_dict(),    # Adam's m and v, learning rate, etc.
    "best_val_acc": best_val_acc,
}
torch.save(checkpoint, "checkpoint.pt")

ckpt = torch.load("checkpoint.pt", map_location=device, weights_only=True)
model.load_state_dict(ckpt["model"])
optimizer.load_state_dict(ckpt["optimizer"])
start_epoch = ckpt["epoch"] + 1
```

- `map_location` lets a model trained on a GPU be loaded on a CPU-only machine.
- `weights_only=True` (the default since PyTorch 2.6) only loads tensors and simple Python types, which is safer: a `.pt` file from the internet could otherwise run arbitrary code when unpickled. For sharing weights publicly, the **safetensors** format (used by Hugging Face) is the safe standard.
- If you also use a learning rate scheduler, save `scheduler.state_dict()` too.

## A full MNIST-style example

**MNIST** is a dataset of 70,000 handwritten digits (0–9), each a 28 × 28 grayscale image: 60,000 for training and 10,000 for testing. **Fashion-MNIST** has the same format with clothing images and is a bit harder. Both are built into `torchvision` (`pip install torchvision`).

```python
import torch
from torch import nn
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms

# ---- 0. Setup ----
torch.manual_seed(42)                                  # reproducible results
device = "cuda" if torch.cuda.is_available() else "cpu"

# ---- 1. Data ----
transform = transforms.Compose([
    transforms.ToTensor(),                             # PIL image -> float tensor (1, 28, 28) in [0, 1]
    transforms.Normalize((0.1307,), (0.3081,)),        # MNIST mean and std
])
full_train = datasets.MNIST("data", train=True, download=True, transform=transform)
test_ds = datasets.MNIST("data", train=False, download=True, transform=transform)

train_ds, val_ds = random_split(full_train, [55_000, 5_000],
                                generator=torch.Generator().manual_seed(42))
train_loader = DataLoader(train_ds, batch_size=128, shuffle=True, num_workers=2)
val_loader = DataLoader(val_ds, batch_size=512)
test_loader = DataLoader(test_ds, batch_size=512)

# ---- 2. Model, loss, optimizer ----
model = nn.Sequential(
    nn.Flatten(),
    nn.Linear(784, 256), nn.ReLU(), nn.Dropout(0.2),
    nn.Linear(256, 128), nn.ReLU(),
    nn.Linear(128, 10),
).to(device)
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)

# ---- 3. Train with validation and keep the best model ----
best_val_acc = 0.0
for epoch in range(1, 6):
    train_loss, train_acc = train_one_epoch(model, train_loader, loss_fn, optimizer, device)
    val_loss, val_acc = evaluate(model, val_loader, loss_fn, device)
    print(f"epoch {epoch}: train loss {train_loss:.4f} acc {train_acc:.3f} | "
          f"val loss {val_loss:.4f} acc {val_acc:.3f}")
    if val_acc > best_val_acc:
        best_val_acc = val_acc
        torch.save(model.state_dict(), "best_mlp.pt")

# ---- 4. Final test with the best weights ----
model.load_state_dict(torch.load("best_mlp.pt", map_location=device, weights_only=True))
test_loss, test_acc = evaluate(model, test_loader, loss_fn, device)
print(f"test accuracy: {test_acc:.3f}")
```

(`train_one_epoch` and `evaluate` are the two functions defined above.) A model like this usually reaches about 97–98% test accuracy on MNIST within 5 epochs, a few minutes on a CPU. Exact numbers vary by machine and seed.

Things to notice:

- **Three splits.** Train to learn, validation to choose the best epoch and settings, test only once at the end. Using the test set to pick the epoch would make the reported accuracy too optimistic. (See [Overfitting, Regularization and Cross-Validation](/interview/machine-learning/overfitting-regularization-and-cross-validation).)
- **Normalization.** Inputs are scaled to mean 0 and std 1 using the training set's statistics. Networks train faster with centred inputs.
- **Validation loader** uses a bigger batch and no shuffle, because no gradients are stored.
- **Keeping the best model** is a simple form of early stopping.

### Predicting on a new image

```python
import torch.nn.functional as F

model.eval()
image, label = test_ds[0]                     # image: (1, 28, 28)
with torch.inference_mode():
    logits = model(image.unsqueeze(0).to(device))   # add batch dim -> (1, 1, 28, 28)
    probs = F.softmax(logits, dim=1)                 # (1, 10) probabilities
    pred = probs.argmax(dim=1).item()
print(f"true {label}, predicted {pred}, confidence {probs[0, pred]:.2f}")
```

The model always expects a batch dimension, even for one example. That is what `unsqueeze(0)` adds. Softmax is applied only here, at prediction time, to turn logits into readable probabilities.

## Regression and binary variants

Only the last layer, the loss and the target format change:

| Task | Last layer | Loss | Target dtype and shape | Prediction |
|---|---|---|---|---|
| Multi-class (10 digits) | `nn.Linear(h, 10)` | `nn.CrossEntropyLoss()` | `long`, (batch,) | `logits.argmax(1)` |
| Binary (spam or not) | `nn.Linear(h, 1)` | `nn.BCEWithLogitsLoss()` | `float`, (batch, 1) or squeeze logits to (batch,) | `torch.sigmoid(logit) > 0.5` |
| Regression (price) | `nn.Linear(h, 1)` | `nn.MSELoss()` | `float`, (batch, 1) to match output | the output itself |

## Common training-loop bugs

| Bug | Symptom | Fix |
|---|---|---|
| No `zero_grad()` | loss behaves erratically, explodes | call it every iteration |
| Softmax before `CrossEntropyLoss` | slow learning, accuracy stuck | return raw logits |
| Forgot `model.eval()` | val accuracy noisy or lower than expected | call `model.eval()` before evaluation |
| No `torch.no_grad()` in eval | out-of-memory during validation | wrap eval in `no_grad` |
| Labels float or shape (batch, 1) for CE | dtype / shape error | `y.long()`, shape (batch,) |
| Model and data on different devices | "Expected all tensors to be on the same device" | `.to(device)` on both |
| `losses.append(loss)` | memory grows every step | append `loss.item()` |
| `shuffle=False` for training | worse training, especially if data is sorted by class | `shuffle=True` |
| Not normalizing inputs | slow or unstable training | standardize features / images |

> **Interview tip:** A favourite question is "write a training loop for this model". Write the five core lines first, then add `model.train()`, device moves, metric tracking, and a separate eval function with `model.eval()` and `torch.no_grad()`. Mention checkpointing and early stopping as follow-ups.

## Key terms

| Term | Simple meaning |
|---|---|
| nn.Module | Base class for all PyTorch models and layers |
| forward | The method describing how input becomes output |
| Registered parameters | Parameters PyTorch finds automatically via `model.parameters()` |
| nn.Sequential | A container that runs layers one after another |
| nn.ModuleList | A list of layers that PyTorch registers properly |
| Dataset | Object giving the number of examples and example i |
| DataLoader | Turns a Dataset into shuffled batches |
| TensorDataset | Ready-made Dataset for in-memory tensors |
| num_workers | Background processes loading data in parallel |
| pin_memory | Faster CPU-to-GPU copies |
| Logits | Raw scores from the last layer, before softmax |
| model.train() / model.eval() | Switch layer behaviour between training and evaluation |
| Epoch | One full pass over the training set |
| state_dict | Dictionary of parameter names to tensors |
| Checkpoint | Saved model, optimizer and progress for resuming |
| weights_only | Safe loading option for `torch.load` |
| safetensors | Safe, fast file format for sharing weights |
| MNIST | 70,000 handwritten digit images, 28 × 28 |
| Validation set | Data used to choose epochs and settings, not for final reporting |

## Interview questions

**Walk me through a PyTorch training loop.**
Set `model.train()`, then for each batch move it to the device, run `logits = model(x)`, compute `loss = loss_fn(logits, y)`, call `optimizer.zero_grad()`, `loss.backward()` and `optimizer.step()`. Track the loss with `loss.item()`. After each epoch, evaluate on a validation set with `model.eval()` and `torch.no_grad()`, and save a checkpoint if it is the best so far.

**What is the difference between `model.eval()` and `torch.no_grad()`?**
`model.eval()` changes how certain layers behave: dropout is switched off and batch norm uses its running statistics. `torch.no_grad()` stops autograd from recording operations, which saves memory and time. For evaluation you want both; they are independent.

**Why do we call `optimizer.zero_grad()`?**
Because `loss.backward()` adds new gradients to whatever is already in `.grad`. Without clearing, each step would use the sum of gradients from all previous batches, which is wrong. The only time you deliberately skip it is gradient accumulation.

**What does a Dataset need to implement, and what does the DataLoader do?**
A map-style Dataset implements `__len__` and `__getitem__`. The DataLoader samples indices (shuffled if requested), fetches examples possibly in parallel worker processes, and collates them into batched tensors.

**Why save the `state_dict` instead of the whole model?**
The `state_dict` is just named tensors, so it is portable and does not depend on the exact Python class path. Pickling the full model ties the file to your code layout and can break after refactoring. Loading untrusted pickles can also execute code, which is why `weights_only=True` and safetensors exist.

**What would you save in a checkpoint to resume training?**
The model state_dict, the optimizer state_dict (it contains momentum or Adam statistics), the scheduler state, the epoch or step number, the best validation metric, and ideally random number generator states for full reproducibility.

**Why should the model output logits and not probabilities?**
`CrossEntropyLoss` and `BCEWithLogitsLoss` combine softmax/sigmoid with the log in one numerically stable operation. Passing probabilities applies the function twice, which squashes values and weakens gradients. Apply softmax or sigmoid only when you need probabilities for prediction.

**Why do we need a separate validation set if we have a test set?**
The validation set is used repeatedly to make decisions, like which epoch to keep or which learning rate is best, so the model indirectly fits to it. The test set must be untouched until the end to give an honest estimate of real-world performance.

**Your training accuracy is 99% but validation is 85%. What do you do?**
That is overfitting. Add regularization such as dropout, weight decay or data augmentation, get more data, use a smaller model, or stop earlier. Also check that training and validation data come from the same distribution and that there is no bug in the validation pipeline.

## Try it yourself

1. Write a custom `nn.Module` for a regression model with layers 8 → 32 → 16 → 1 and ReLU. Count its parameters by hand and with code. *Hint:* 8·32 + 32, and so on.
2. Make a `TensorDataset` from `X = torch.randn(100, 8)` and `y = torch.randn(100, 1)`, wrap it in a DataLoader with batch size 32, and print the shapes of every batch. How many batches are there, and what is the size of the last one? *Hint:* 100 = 3 × 32 + 4.
3. Change the MNIST example to Fashion-MNIST and compare test accuracy. *Hint:* `datasets.FashionMNIST`; use mean 0.2860 and std 0.3530 for normalization.
4. Add early stopping to the MNIST loop: stop if validation accuracy has not improved for 2 epochs in a row. *Hint:* keep a counter that resets when a new best is found.

### Answers

1. 8·32 + 32 = 288; 32·16 + 16 = 528; 16·1 + 1 = 17. Total 833.

```python
class Regressor(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(8, 32), nn.ReLU(),
            nn.Linear(32, 16), nn.ReLU(),
            nn.Linear(16, 1),
        )
    def forward(self, x):
        return self.net(x)

print(sum(p.numel() for p in Regressor().parameters()))   # 833
```

2. Four batches: three of shape (32, 8) / (32, 1) and the last of shape (4, 8) / (4, 1). With `drop_last=True` there would be 3.

```python
from torch.utils.data import TensorDataset, DataLoader
loader = DataLoader(TensorDataset(torch.randn(100, 8), torch.randn(100, 1)), batch_size=32)
for xb, yb in loader:
    print(xb.shape, yb.shape)
```

3. Replace `datasets.MNIST` with `datasets.FashionMNIST` and the normalization with `transforms.Normalize((0.2860,), (0.3530,))`. An MLP usually gets around 88–90% on Fashion-MNIST, lower than MNIST, because clothes are harder to tell apart than digits. A CNN (see [Convolutional Neural Networks](/interview/deep-learning/convolutional-neural-networks)) does better.
4. One solution:

```python
best_val_acc, patience, bad_epochs = 0.0, 2, 0
for epoch in range(1, 51):
    train_one_epoch(model, train_loader, loss_fn, optimizer, device)
    _, val_acc = evaluate(model, val_loader, loss_fn, device)
    if val_acc > best_val_acc:
        best_val_acc, bad_epochs = val_acc, 0
        torch.save(model.state_dict(), "best_mlp.pt")
    else:
        bad_epochs += 1
        if bad_epochs >= patience:
            print(f"early stop at epoch {epoch}")
            break
```

**Next:** [Regularization, Dropout and Batch Norm](/interview/deep-learning/regularization-dropout-and-batch-norm)
