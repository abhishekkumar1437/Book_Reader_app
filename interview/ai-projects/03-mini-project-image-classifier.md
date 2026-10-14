---
title: Mini Project · Image Classifier with Transfer Learning
part: Mini Projects
summary: Days 64–66. Classify 37 cat and dog breeds by fine-tuning a pretrained ResNet in PyTorch, debug training the professional way, evaluate per class, and ship a Gradio demo to Hugging Face Spaces.
---

Training an image model from zero needs millions of images and many GPU hours. Almost nobody does that at work. Instead, you take a model that already learned to see on a huge dataset (ImageNet, 1.2 million photos) and teach it your specific task with a few thousand images. This is **transfer learning**, and it is how most real computer-vision features are built, from defect detection in factories to crop-disease apps for farmers. In this project you fine-tune a pretrained **ResNet-18** to recognise 37 cat and dog breeds and put it behind a web demo anyone can try.

> **In simple words:** Borrow a network that already knows edges, textures and shapes. Replace its last layer with one for your 37 breeds. Train that new layer first, then gently adjust the top of the network. Wrap it in a small web app.

## Goal and what you will learn

**Goal:** Upload a photo of a pet, get the top 3 breeds with probabilities, from a model you trained, at a public link.

**What you will learn:**

- Loading a dataset with `torchvision`, with separate training and evaluation transforms.
- **Data augmentation**: random crops, flips and colour changes that make the model robust.
- Loading pretrained weights, **freezing** layers, and replacing the classifier head.
- Writing the PyTorch training loop yourself, with validation, checkpoints and a GPU when available.
- The **overfit-one-batch** test that catches bugs in minutes.
- Two-stage training: head first, then fine-tuning the last block with a lower learning rate.
- Per-class evaluation and reading a confusion matrix.
- Building a **Gradio** demo and deploying it free on Hugging Face Spaces.

### Prerequisites

| You need | Where it is taught |
|---|---|
| Tensors, devices, autograd | [PyTorch Tensors and Autograd](/interview/deep-learning/pytorch-tensors-and-autograd) |
| `nn.Module`, `Dataset`, `DataLoader`, the training loop | [Building and Training a Model in PyTorch](/interview/deep-learning/building-and-training-a-model-in-pytorch) |
| Convolutions, ResNet and skip connections | [Convolutional Neural Networks](/interview/deep-learning/convolutional-neural-networks) |
| Feature extraction vs fine-tuning, freezing | [Transfer Learning and Pretrained Models](/interview/deep-learning/transfer-learning-and-pretrained-models) |
| Augmentation, dropout, weight decay | [Regularization, Dropout and Batch Norm](/interview/deep-learning/regularization-dropout-and-batch-norm) |
| GPUs, debugging, seeds | [Training in Practice](/interview/deep-learning/training-in-practice) |
| Optimizers and learning rates | [Optimizers and Learning Rate](/interview/deep-learning/optimizers-and-learning-rate) |

### Day split (Days 64–66)

| Day | Time | Work |
|---|---|---|
| 64 | 3.5 h | Steps 1–4: setup, data and transforms, model, overfit-one-batch check |
| 65 | 3.5 h | Steps 5–7: two-stage training, evaluation on the test set, error analysis |
| 66 | 3.5 h | Steps 8–10: Gradio app, deploy to Hugging Face Spaces, README and resume bullets |

**Hardware:** a CPU works but each epoch takes several minutes. A free GPU on Google Colab or Kaggle Notebooks makes each epoch take well under a minute. You can train in Colab, download the `.pt` file, and run the Gradio app on your laptop.

## Architecture

<figure>
<svg viewBox="0 0 440 220" width="440" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="5" y="25" width="70" height="44" rx="6" />
<text x="40" y="45" text-anchor="middle" fill="currentColor" stroke="none">Pet photo</text>
<text x="40" y="60" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">any size</text>
<line x1="75" y1="47" x2="91" y2="47" />
<polygon points="91,43 99,47 91,51" fill="currentColor" />
<rect x="99" y="25" width="78" height="44" rx="6" />
<text x="138" y="44" text-anchor="middle" fill="currentColor" stroke="none">transforms</text>
<text x="138" y="59" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">224×224, normalize</text>
<line x1="177" y1="47" x2="193" y2="47" />
<polygon points="193,43 201,47 193,51" fill="currentColor" />
<rect x="201" y="10" width="150" height="74" rx="8" />
<text x="276" y="27" text-anchor="middle" fill="currentColor" stroke="none">ResNet-18 backbone</text>
<rect x="211" y="36" width="60" height="38" rx="4" stroke-dasharray="3 3" />
<text x="241" y="52" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">layers 1–3</text>
<text x="241" y="66" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">frozen</text>
<rect x="281" y="36" width="60" height="38" rx="4" />
<text x="311" y="52" text-anchor="middle" fill="var(--accent)" stroke="none" font-size="10">layer 4</text>
<text x="311" y="66" text-anchor="middle" fill="var(--accent)" stroke="none" font-size="10">fine-tuned</text>
<line x1="351" y1="47" x2="367" y2="47" />
<polygon points="367,43 375,47 367,51" fill="currentColor" />
<rect x="375" y="25" width="60" height="44" rx="6" />
<text x="405" y="44" text-anchor="middle" fill="var(--accent)" stroke="none">new fc</text>
<text x="405" y="59" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">512 → 37</text>
<line x1="405" y1="69" x2="405" y2="115" />
<polygon points="401,115 405,123 409,115" fill="currentColor" />
<rect x="320" y="123" width="115" height="40" rx="6" />
<text x="377" y="141" text-anchor="middle" fill="currentColor" stroke="none">softmax</text>
<text x="377" y="155" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">top-3 breeds</text>
<line x1="320" y1="143" x2="246" y2="143" />
<polygon points="246,139 238,143 246,147" fill="currentColor" />
<rect x="98" y="123" width="140" height="40" rx="6" />
<text x="168" y="141" text-anchor="middle" fill="currentColor" stroke="none">Gradio web app</text>
<text x="168" y="155" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">Hugging Face Spaces</text>
<text x="220" y="200" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">Only the dashed part stays fixed; the coloured parts learn your 37 breeds.</text>
</svg>
<figcaption>Transfer learning keeps the general vision layers and retrains only the parts closest to the output.</figcaption>
</figure>

## Folder structure

```text
pet-classifier/
├── README.md
├── requirements.txt
├── .gitignore               # includes data/ and models/
├── src/
│   ├── __init__.py
│   ├── data.py              # dataset, transforms, loaders
│   ├── model.py             # build ResNet-18 with a new head
│   ├── train.py             # two-stage training + checkpoints
│   └── evaluate.py          # test accuracy, per-class report, confusions
├── app.py                   # Gradio demo
├── examples/                # 3–4 sample images for the demo
├── data/                    # downloaded automatically, not committed
└── models/
    └── pet_resnet18.pt      # best checkpoint (about 45 MB)
```

## requirements.txt

```text
torch>=2.3
torchvision>=0.18
gradio>=4.40
pillow>=10.0
scikit-learn>=1.5
matplotlib>=3.8
```

On Colab, PyTorch and torchvision are already installed; only `pip install gradio` may be needed.

## Step 1: Set up

```bash
mkdir pet-classifier && cd pet-classifier
mkdir -p src models examples
touch src/__init__.py
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -c "import torch; print(torch.__version__, torch.cuda.is_available())"
```

**What you should see:** a version like `2.x.x` and `True` if you have an NVIDIA GPU set up (on most laptops it prints `False`, which is fine). On a Mac with Apple silicon, `torch.backends.mps.is_available()` may be `True`; the code below uses it automatically.

## Step 2: The dataset and transforms

You will use the **Oxford-IIIT Pet** dataset: 37 breeds (12 cats, 25 dogs), about 200 images per breed. `torchvision` downloads it for you (about 800 MB). It comes split into `trainval` (3,680 images) and `test` (3,669 images). You will carve a validation set out of `trainval`.

Why three sets? The **training set** updates weights. The **validation set** helps you choose things (epochs, learning rate, which checkpoint to keep). The **test set** is touched once at the end to report an honest score.

**Transforms** convert a photo into the tensor the model expects. Pretrained ImageNet models expect 224×224 images, normalized with ImageNet's channel means and standard deviations. Training transforms also add **augmentation**: random changes so the model sees a slightly different version of each photo every epoch. This fights **overfitting** (memorizing the training images instead of learning the breed).

```python
# src/data.py
import torch
from torch.utils.data import DataLoader, Subset
from torchvision import datasets, transforms

MEAN = [0.485, 0.456, 0.406]   # ImageNet channel means (R, G, B)
STD = [0.229, 0.224, 0.225]    # ImageNet channel standard deviations

train_tf = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.7, 1.0)),  # random zoom + crop
    transforms.RandomHorizontalFlip(),                     # a cat flipped is still a cat
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
    transforms.ToTensor(),                                 # PIL [0,255] -> tensor [0,1], shape (3,H,W)
    transforms.Normalize(MEAN, STD),
])

eval_tf = transforms.Compose([                             # no randomness for evaluation
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(MEAN, STD),
])


def get_loaders(root: str = "data", batch_size: int = 32, val_fraction: float = 0.15,
                seed: int = 42, num_workers: int = 2):
    # Two copies of trainval with different transforms, split by the same indices
    train_full = datasets.OxfordIIITPet(root, split="trainval", target_types="category",
                                        transform=train_tf, download=True)
    val_full = datasets.OxfordIIITPet(root, split="trainval", target_types="category",
                                      transform=eval_tf, download=True)
    test_ds = datasets.OxfordIIITPet(root, split="test", target_types="category",
                                     transform=eval_tf, download=True)

    g = torch.Generator().manual_seed(seed)                # same split every run
    perm = torch.randperm(len(train_full), generator=g).tolist()
    n_val = int(len(perm) * val_fraction)
    train_ds = Subset(train_full, perm[n_val:])
    val_ds = Subset(val_full, perm[:n_val])

    loaders = {
        "train": DataLoader(train_ds, batch_size=batch_size, shuffle=True, num_workers=num_workers),
        "val": DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=num_workers),
        "test": DataLoader(test_ds, batch_size=batch_size, shuffle=False, num_workers=num_workers),
    }
    return loaders, train_full.classes
```

Check it:

```python
# run in a notebook or python shell from the project root
from src.data import get_loaders
loaders, classes = get_loaders()
images, labels = next(iter(loaders["train"]))
print(len(classes), classes[:3])
print(images.shape, labels[:8])
print({k: len(v.dataset) for k, v in loaders.items()})
```

**What you should see:**

```text
37 ['Abyssinian', 'American Bulldog', 'American Pit Bull Terrier']
torch.Size([32, 3, 224, 224]) tensor([...8 integers between 0 and 36...])
{'train': 3128, 'val': 552, 'test': 3669}
```

The validation size is int(3680 × 0.15) = int(552.0) = 552, and 3680 − 552 = 3128 for training.

> **Common mistake:** Using the training transforms (with random crops) for validation and test. Your scores then change from run to run and look worse than reality. Evaluation must be deterministic.

> **Common mistake (Windows):** With `num_workers > 0`, every script that creates a `DataLoader` must have its main code under `if __name__ == "__main__":`. Otherwise you get a long error about "freeze_support". If it keeps failing, set `num_workers=0`.

## Step 3: The model

```python
# src/model.py
import torch.nn as nn
from torchvision.models import ResNet18_Weights, resnet18


def build_model(num_classes: int, pretrained: bool = True) -> nn.Module:
    weights = ResNet18_Weights.DEFAULT if pretrained else None
    model = resnet18(weights=weights)            # downloads ~45 MB the first time
    for p in model.parameters():                 # freeze everything...
        p.requires_grad = False
    # ...then replace the ImageNet head (512 -> 1000) with ours (512 -> 37).
    # A new layer has requires_grad=True by default, so only it will train.
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    return model


def unfreeze_last_block(model: nn.Module) -> None:
    for p in model.layer4.parameters():          # layer4 = the last residual stage
        p.requires_grad = True


def count_trainable(model: nn.Module) -> int:
    return sum(p.numel() for p in model.parameters() if p.requires_grad)
```

Why freeze first? Early layers detect general things (edges, fur texture, eyes) that are useful for any photo. The new head starts with random weights. If you trained everything at once with a normal learning rate, the large random errors from the head would flow back and damage the good pretrained weights. So you train the head alone first, then unfreeze a little.

### Worked example: how many weights are you training?

- The new head is a linear layer from 512 features to 37 classes. Weights = 512 × 37 = 18,944. Biases = 37. Total = 18,944 + 37 = **18,981** trainable parameters in stage 1.
- ResNet-18 has about 11.7 million parameters in total. So in stage 1 you train about 18,981 ÷ 11,700,000 ≈ 0.16% of the network.
- In stage 2, `layer4` adds 8,393,728 parameters (it is the widest stage, 512 channels), so stage 2 trains 8,393,728 + 18,981 = 8,412,709 parameters. Now you train most of the weights, which is why stage 2 needs a lower learning rate.

Check with code:

```python
from src.model import build_model, count_trainable, unfreeze_last_block
m = build_model(37)
print(count_trainable(m))      # 18981
unfreeze_last_block(m)
print(count_trainable(m))      # 8412709
```

## Step 4: The overfit-one-batch test

Before a long training run, prove the pipeline can learn at all. Take one batch of 32 images and train on it again and again. A correct setup drives the loss close to zero within a few dozen steps. If it does not, you have a bug (wrong labels, wrong loss, frozen head, learning rate far too small), and you found it in one minute instead of after an hour.

```python
# quick_check.py  (delete after use, or keep in a scripts/ folder)
import torch
import torch.nn as nn

from src.data import get_loaders
from src.model import build_model

if __name__ == "__main__":
    loaders, classes = get_loaders(num_workers=0)
    images, labels = next(iter(loaders["train"]))
    model = build_model(len(classes))
    opt = torch.optim.Adam(model.fc.parameters(), lr=1e-2)
    loss_fn = nn.CrossEntropyLoss()
    model.train()
    for step in range(60):
        loss = loss_fn(model(images), labels)
        opt.zero_grad()
        loss.backward()
        opt.step()
        if step % 10 == 0:
            print(step, round(loss.item(), 3))
```

**What you should see:** the first loss is near ln(37) ≈ 3.61. That is the loss of a model that gives every class equal probability 1/37, and −ln(1/37) = ln(37) ≈ 3.61. Then it falls steadily towards 0 (below about 0.1 by the last prints). If the first loss is far from 3.6, check your labels and the number of output classes.

> **Interview tip:** "How do you debug a model that is not learning?" A strong answer starts with "first I overfit a single batch". It shows you debug systematically. Then mention checking the initial loss against ln(number of classes), the learning rate, and that gradients are non-zero.

## Step 5: Two-stage training

**Cross-entropy loss** measures how much probability the model gives to the correct class (lower is better). **Adam/AdamW** are optimizers that adapt the step size for each weight. **Weight decay** gently pulls weights towards zero to reduce overfitting. You keep the checkpoint with the best **validation accuracy**.

```python
# src/train.py
import time
from pathlib import Path

import torch
import torch.nn as nn

from src.data import get_loaders
from src.model import build_model, count_trainable, unfreeze_last_block

CKPT = Path("models/pet_resnet18.pt")


def get_device() -> torch.device:
    if torch.cuda.is_available():
        return torch.device("cuda")
    if torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


def run_epoch(model, loader, loss_fn, device, optimizer=None):
    training = optimizer is not None
    model.train(training)                        # dropout/batch-norm behave differently in eval
    total_loss, correct, count = 0.0, 0, 0
    with torch.set_grad_enabled(training):       # no gradients needed for validation
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            logits = model(images)
            loss = loss_fn(logits, labels)
            if training:
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
            total_loss += loss.item() * labels.size(0)
            correct += (logits.argmax(dim=1) == labels).sum().item()
            count += labels.size(0)
    return total_loss / count, correct / count


def fit(model, loaders, optimizer, epochs, device, classes, best_acc, stage):
    loss_fn = nn.CrossEntropyLoss(label_smoothing=0.1)  # softens targets; small regularizer
    for epoch in range(1, epochs + 1):
        t0 = time.time()
        tr_loss, tr_acc = run_epoch(model, loaders["train"], loss_fn, device, optimizer)
        va_loss, va_acc = run_epoch(model, loaders["val"], loss_fn, device)
        mark = ""
        if va_acc > best_acc:                    # keep only the best checkpoint
            best_acc = va_acc
            CKPT.parent.mkdir(exist_ok=True)
            torch.save({"state_dict": model.state_dict(), "classes": classes,
                        "val_acc": va_acc}, CKPT)
            mark = "  <- saved"
        print(f"[{stage}] epoch {epoch} train_loss={tr_loss:.3f} train_acc={tr_acc:.3f} "
              f"val_loss={va_loss:.3f} val_acc={va_acc:.3f} ({time.time()-t0:.0f}s){mark}")
    return best_acc


def main():
    torch.manual_seed(42)
    device = get_device()
    loaders, classes = get_loaders()
    model = build_model(len(classes)).to(device)
    print(f"device={device} trainable={count_trainable(model):,}")

    # Stage 1: train only the new head
    opt = torch.optim.AdamW(model.fc.parameters(), lr=1e-3, weight_decay=1e-4)
    best = fit(model, loaders, opt, epochs=4, device=device, classes=classes,
               best_acc=0.0, stage="head")

    # Stage 2: also fine-tune layer4, with a smaller learning rate for pretrained weights
    unfreeze_last_block(model)
    print(f"trainable after unfreeze={count_trainable(model):,}")
    opt = torch.optim.AdamW([
        {"params": model.layer4.parameters(), "lr": 1e-4},
        {"params": model.fc.parameters(), "lr": 5e-4},
    ], weight_decay=1e-4)
    best = fit(model, loaders, opt, epochs=4, device=device, classes=classes,
               best_acc=best, stage="finetune")
    print(f"best val_acc={best:.3f}, saved to {CKPT}")


if __name__ == "__main__":
    main()
```

```bash
python -m src.train
```

**What you should see:**

```text
device=cuda trainable=18,981
[head] epoch 1 train_loss=... train_acc=0.6.. val_loss=... val_acc=0.8..  <- saved
[head] epoch 2 ...
...
trainable after unfreeze=8,412,709
[finetune] epoch 1 ... val_acc=0.8..  <- saved
...
best val_acc=0.8.., saved to models/pet_resnet18.pt
```

Exact values depend on your hardware and random seed. With ResNet-18 on this dataset, validation accuracy commonly reaches the 80s (in percent) during stage 1 and gains a few more points in stage 2. Two things to notice:

- Early on, **validation accuracy can be higher than training accuracy**. That is normal here: training images are randomly cropped and colour-shifted (harder), and label smoothing raises the training loss.
- If train accuracy keeps rising while validation accuracy falls for two or more epochs, you are overfitting. Stop earlier (this is **early stopping**) or add more augmentation.

> **Remember:** The `.pt` file contains the `state_dict` (a dictionary of weight tensors) and the class names. Saving the class list with the weights means the app can never show the wrong breed name for an index.

## Step 6: Evaluate on the test set

Now, and only now, use the test set.

```python
# src/evaluate.py
import numpy as np
import torch
from sklearn.metrics import classification_report, confusion_matrix

from src.data import get_loaders
from src.model import build_model
from src.train import CKPT, get_device


@torch.inference_mode()                         # faster than no_grad; no autograd tracking
def predict_all(model, loader, device):
    model.eval()
    ys, preds = [], []
    for images, labels in loader:
        logits = model(images.to(device))
        preds.append(logits.argmax(1).cpu())
        ys.append(labels)
    return torch.cat(ys).numpy(), torch.cat(preds).numpy()


def main():
    device = get_device()
    ckpt = torch.load(CKPT, map_location=device)
    classes = ckpt["classes"]
    model = build_model(len(classes), pretrained=False).to(device)
    model.load_state_dict(ckpt["state_dict"])

    loaders, _ = get_loaders()
    y, p = predict_all(model, loaders["test"], device)
    print(f"test accuracy = {(y == p).mean():.3f} on {len(y)} images\n")
    print(classification_report(y, p, target_names=classes, digits=3))

    cm = confusion_matrix(y, p)
    np.fill_diagonal(cm, 0)                     # keep only the mistakes
    worst = np.dstack(np.unravel_index(np.argsort(cm.ravel())[::-1][:5], cm.shape))[0]
    print("Most confused (true -> predicted, count):")
    for t, q in worst:
        print(f"  {classes[t]} -> {classes[q]}: {cm[t, q]}")


if __name__ == "__main__":
    main()
```

```bash
python -m src.evaluate
```

**What you should see:** a test accuracy close to your best validation accuracy (within a few points), a per-breed table of precision, recall and F1, and a list of the most confused pairs. The confusions are usually breeds that look alike, for example pairs of terriers or of bully breeds such as American Pit Bull Terrier and Staffordshire Bull Terrier. That tells you the model's mistakes are "reasonable" mistakes, which is a good sentence for your README.

## Step 7: Error analysis

Numbers tell you how often the model is wrong. Looking at the wrong images tells you why. Spend 30 minutes on this; it is the part most people skip and interviewers love.

```python
# in a notebook
import matplotlib.pyplot as plt
import torch
from torchvision import datasets

from src.data import eval_tf
from src.model import build_model

ckpt = torch.load("models/pet_resnet18.pt", map_location="cpu")
classes = ckpt["classes"]
model = build_model(len(classes), pretrained=False)
model.load_state_dict(ckpt["state_dict"])
model.eval()

raw_test = datasets.OxfordIIITPet("data", split="test", target_types="category")  # PIL images
wrong = []
with torch.inference_mode():
    for i in range(0, len(raw_test), 7):          # sample every 7th image to be quick
        img, label = raw_test[i]
        probs = model(eval_tf(img).unsqueeze(0)).softmax(1)[0]
        pred = int(probs.argmax())
        if pred != label:
            wrong.append((img, classes[label], classes[pred], float(probs[pred])))

fig, axes = plt.subplots(2, 4, figsize=(14, 7))
for ax, (img, t, p, conf) in zip(axes.ravel(), wrong[:8]):
    ax.imshow(img)
    ax.set_title(f"true: {t}\npred: {p} ({conf:.2f})", fontsize=9)
    ax.axis("off")
plt.tight_layout()
plt.show()
```

Write down patterns you see: dark or blurry photos, the pet very small in the frame, two animals in one photo, or genuinely similar breeds. Each pattern suggests a fix (more augmentation, a bigger model, a higher resolution). Mention one in your README's "Limitations".

## Step 8: The Gradio demo

**Gradio** is a Python library that turns a function into a web page with upload buttons and output widgets, in a few lines.

```python
# app.py
import gradio as gr
import torch
from PIL import Image

from src.data import eval_tf
from src.model import build_model

ckpt = torch.load("models/pet_resnet18.pt", map_location="cpu")
CLASSES = ckpt["classes"]
model = build_model(len(CLASSES), pretrained=False)   # no ImageNet download needed
model.load_state_dict(ckpt["state_dict"])
model.eval()


def predict(image: Image.Image) -> dict[str, float]:
    if image is None:
        return {}
    x = eval_tf(image.convert("RGB")).unsqueeze(0)    # (1, 3, 224, 224); convert drops alpha
    with torch.inference_mode():
        probs = model(x).softmax(dim=1)[0]
    top = probs.topk(5)
    return {CLASSES[i]: float(p) for p, i in zip(top.values, top.indices)}


demo = gr.Interface(
    fn=predict,
    inputs=gr.Image(type="pil", label="Upload a cat or dog photo"),
    outputs=gr.Label(num_top_classes=3, label="Top breeds"),
    title="Pet Breed Classifier (37 breeds)",
    description="ResNet-18 fine-tuned on Oxford-IIIT Pet with transfer learning.",
    examples=[["examples/beagle.jpg"], ["examples/persian.jpg"]],  # add your own files
)

if __name__ == "__main__":
    demo.launch()
```

Put two or three of your own photos (or test-set images) in `examples/` with those names, or remove the `examples` line.

```bash
python app.py
```

**What you should see:** `Running on local URL: http://127.0.0.1:7860`. Open it, upload a photo, and a bar chart of the top 3 breeds appears. Try a photo of something that is not a pet, such as a car. The model still picks a breed, often with low confidence. That is a known limitation of a closed-set classifier; note it in the README (and see the stretch goals).

## Step 9: Deploy to Hugging Face Spaces

**Hugging Face Spaces** hosts small demo apps for free on CPU. Each Space is a git repository; when you push, it installs `requirements.txt` and runs `app.py`.

1. Create a free account at huggingface.co. Click **New Space**, choose the **Gradio** SDK, CPU basic hardware, and a name like `pet-classifier`.
2. Prepare a folder with exactly what the app needs:

```text
space/
├── app.py
├── requirements.txt         # torch, torchvision, gradio, pillow
├── src/
│   ├── __init__.py
│   ├── data.py
│   └── model.py
├── examples/
└── models/
    └── pet_resnet18.pt
```

3. Upload it. The model file is about 45 MB, so use the `huggingface_hub` library, which handles large files for you:

```python
# upload_space.py  — run once after `pip install huggingface_hub` and `huggingface-cli login`
from huggingface_hub import HfApi

HfApi().upload_folder(
    folder_path="space",
    repo_id="your-username/pet-classifier",   # change to your Space
    repo_type="space",
)
```

(The login command may be shown as `hf auth login` in newer versions of the library; either opens the same token prompt.)

**What you should see:** the Space page shows "Building", then "Running", with your demo. Copy the URL into your README. Free Spaces sleep after a period of no use and take a little time to wake up; mention that in the README so visitors are patient.

`data.py` imports `datasets` from torchvision, which is fine in the Space; the dataset is only downloaded if `get_loaders()` is called, and the app never calls it.

## Step 10: README and push

Your README should include:

- A GIF of the demo and the Space link at the top.
- **Results:** test accuracy, the best and worst 3 breeds by F1, and the top confused pairs.
- **Training details:** ResNet-18 ImageNet weights, input 224×224, augmentation list, stage 1 (head only, lr 1e-3, 4 epochs), stage 2 (layer4 + head, lr 1e-4 / 5e-4, 4 epochs), AdamW, label smoothing 0.1, hardware used and time per epoch.
- **Design decisions:** why transfer learning, why two stages, why ResNet-18 (small enough for a free CPU Space).
- **Limitations:** similar-looking breeds, non-pet images still get a breed, single-pet photos only.

### README checklist

- [ ] Demo GIF and live link
- [ ] Dataset name, size, and that it downloads automatically
- [ ] Test accuracy and per-class highlights
- [ ] Training recipe in a small table
- [ ] Error-analysis findings with 2–4 example images
- [ ] How to train (`python -m src.train`) and run the app (`python app.py`)
- [ ] Limitations and next steps

## Resume bullets

```text
Fine-tuned an ImageNet-pretrained ResNet-18 in PyTorch to classify 37 pet breeds (7.3k images)
using two-stage transfer learning and augmentation; reached <xx>% test accuracy and deployed a
Gradio demo on Hugging Face Spaces.
```

```text
Wrote the full PyTorch training pipeline (custom loop, validation checkpoints, GPU/CPU support,
overfit-one-batch sanity check) and used confusion-matrix error analysis to show most errors
were between visually similar breeds.
```

## Interview questions about this project

**Why use transfer learning instead of training from scratch?**
I had about 3,000 training images, which is far too few to learn good visual features from zero; the model would overfit. A ResNet pretrained on ImageNet already detects edges, textures and object parts, so I only needed to learn how to combine them into breeds. It trains in minutes instead of days and reaches much higher accuracy.

**What is the difference between feature extraction and fine-tuning?**
In feature extraction I freeze the whole pretrained network and train only a new head on top of its features. In fine-tuning I also update some pretrained layers, usually the last ones, with a small learning rate. I did both in sequence: head only first, then unfroze `layer4`.

**Why train the head first and use a lower learning rate for the backbone?**
The new head starts random, so its early gradients are large and noisy. If the backbone were unfrozen at that point, those gradients would damage good pretrained features. Once the head is reasonable, I unfreeze the last block with a learning rate about ten times smaller so the pretrained weights only move a little.

**Why normalize with ImageNet mean and standard deviation?**
The pretrained weights were learned on inputs normalized that way. If I fed images with a different scale, the activations in the first layers would be shifted and the pretrained features would work worse. The rule is: preprocess exactly as the model was trained.

**What augmentations did you use and why not vertical flips?**
Random resized crops, horizontal flips and small colour jitter, because real photos vary in framing, direction and lighting. I did not use vertical flips because upside-down pets almost never appear in real photos, so it would teach the model something useless. Augmentations should match variation you expect in real data.

**Your validation accuracy was higher than training accuracy. Is that a bug?**
Not here. Training images go through random crops and colour jitter, and I use label smoothing, both of which make the training numbers worse. Validation uses clean center crops. If the gap were reversed and growing, that would be overfitting.

**What does `model.eval()` do and why does it matter?**
It switches layers like dropout and batch normalization to inference behaviour. Batch norm then uses its stored running statistics instead of the current batch's statistics. Forgetting `eval()` makes predictions depend on the batch and usually lowers accuracy. I also use `torch.inference_mode()` to skip gradient tracking, which saves memory and time.

**How did you debug training?**
First I overfit a single batch: the loss started near ln(37) ≈ 3.6, which matches uniform predictions over 37 classes, and fell close to zero, which proved the data, labels, model and loss were wired correctly. Then I watched train and validation curves each epoch and saved only the best validation checkpoint.

**Which breeds were confused and what would you do about it?**
The worst confusions were between visually similar breeds, which suggests the model needs finer detail. I could try a higher input resolution, a stronger backbone such as ResNet-50 or an EfficientNet or ViT, more augmentation, or collect more images of those breeds.

**What happens when someone uploads a photo of a car?**
The model still outputs one of the 37 breeds, because softmax always sums to 1 over known classes. To handle this I could reject predictions below a confidence threshold, add an "other" class trained with non-pet images, or use a separate out-of-distribution detector.

**How would you make inference faster on a CPU?**
Export to ONNX or TorchScript, use dynamic quantization or a smaller model like MobileNet, and resize images once. For a server with many users I would batch requests. For this demo ResNet-18 on CPU is already fast enough for one image at a time.

## Stretch goals

1. **Compare backbones.** Train ResNet-50, EfficientNet-B0 and a small ViT with the same recipe. Make a table: accuracy, parameters, CPU latency per image.
2. **Grad-CAM.** Show a heat map of which pixels drove the prediction (libraries like `pytorch-grad-cam`). Add it as a second output in Gradio.
3. **Reject unknowns.** If the top probability is below a threshold you choose on validation data, answer "This does not look like one of the 37 breeds."
4. **Mixed precision.** Use `torch.autocast` on GPU and compare epoch time. See [Training in Practice](/interview/deep-learning/training-in-practice).
5. **Your own dataset.** Collect 5 classes of something from your life (Indian street foods, local bird species) with `datasets.ImageFolder` and re-use the same code.
6. **Serve with FastAPI and Docker.** Build a `POST /predict` endpoint that accepts an image file. See [Docker for ML and Compose](/interview/mlops-deployment/docker-for-ml-and-compose).

**Next:** [Project 1: RAG PDF Chatbot](/interview/ai-projects/project-rag-pdf-chatbot)
