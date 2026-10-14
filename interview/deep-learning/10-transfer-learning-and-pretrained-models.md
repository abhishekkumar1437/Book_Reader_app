---
title: Transfer Learning and Pretrained Models
part: Architectures
summary: Why starting from a pretrained model beats training from scratch, feature extraction vs fine-tuning and how to choose, torchvision pretrained weights, freezing layers, different learning rates per layer, a complete image classifier on your own folders, and using a backbone to make embeddings.
---

In real jobs you almost never train a large network from scratch. You download a model that someone already trained on millions of images or billions of words, and adapt it to your task with a few hundred or thousand examples. This is **transfer learning**, and it is how most computer vision and NLP products are built, from a crop-disease detector trained on 2,000 farm photos to a support-ticket classifier built on BERT. Fine-tuning LLMs with LoRA is the same idea at a bigger scale. This chapter teaches the core technique with image models in PyTorch; your mini project 2 (see [Mini Project: Image Classifier](/interview/ai-projects/mini-project-image-classifier)) uses exactly this.

> **In simple words:** A pretrained model has already learned general features (edges, textures, shapes, word meanings). You keep those layers, replace the last layer with one for your own classes, and train. Either train only the new layer (feature extraction) or also gently update the old layers with a small learning rate (fine-tuning).

## Why transfer learning works

Recall from [Convolutional Neural Networks](/interview/deep-learning/convolutional-neural-networks) that CNN layers learn a hierarchy: early layers detect edges and colours, middle layers detect textures and parts, and the last layers detect task-specific objects. Edges and textures are useful for **any** image task, whether you classify dogs, X-rays or mangoes. Only the last layers are specific to the original task.

So a model trained on **ImageNet** (about 1.28 million photos in 1,000 classes) has already done the expensive part of learning to "see". Re-using it gives you:

| Benefit | Why |
|---|---|
| Much less data needed | general features are already learned; you only teach the task-specific part |
| Much less compute | minutes to hours on one GPU instead of days on many |
| Better accuracy | especially with small datasets, where from-scratch models overfit |
| Faster experiments | a strong baseline on day one |

> **Real-life example:** A cricketer switching to baseball. They do not learn from zero: hand-eye coordination, fitness and reading a ball's movement transfer directly. They only need to learn the new rules and the new bat grip. The pretrained layers are the general sporting skills; the new head is the baseball-specific part.

The model you start from is called the **pretrained model**, and its main body (everything except the final classifier) is called the **backbone**. The new final layer you add is the **head**. Training the pretrained model further on your data is **fine-tuning**, and your task is the **downstream task**.

## Feature extraction vs fine-tuning

There are two main strategies.

**Feature extraction.** **Freeze** the whole backbone, meaning its weights do not change (`requires_grad=False`). Replace the head with a new layer for your classes and train only that. The backbone acts as a fixed machine that turns each image into a feature vector.

**Fine-tuning.** Start the same way, but also **unfreeze** some or all backbone layers and train them too, with a **small learning rate** so the useful pretrained features are adjusted gently rather than destroyed.

| | Feature extraction | Fine-tuning |
|---|---|---|
| What trains | only the new head | head + some or all backbone layers |
| Data needed | very little (tens to hundreds per class) | more (hundreds to thousands per class) |
| Compute and memory | low (no gradients for the backbone) | higher |
| Risk of overfitting | low | higher with small data |
| Accuracy | good if your images look like the pretraining data | usually best, especially for different-looking data |
| Learning rate | normal (e.g. 1e-3 for the head) | small for the backbone (e.g. 1e-5 to 1e-4) |

### Which to choose

| | Your data is similar to ImageNet (everyday photos) | Your data is very different (X-rays, satellite, microscope) |
|---|---|---|
| **Small dataset** | feature extraction | feature extraction from earlier layers, or fine-tune only the last block, with strong augmentation |
| **Large dataset** | fine-tune the whole network | fine-tune the whole network (pretrained weights still help as a starting point) |

A practical recipe that works well: first train only the head for a few epochs (feature extraction), then unfreeze the last block or the whole backbone and continue with a 10× smaller learning rate. Training the head first means the random new head does not send large, noisy gradients into the good pretrained layers.

> **Common mistake:** Fine-tuning the whole pretrained network from the start with a large learning rate like 1e-2. The big updates destroy the pretrained features within a few steps, and you lose the benefit. This is a form of **catastrophic forgetting**: the model forgets what it learned before.

## Pretrained models in torchvision

`torchvision.models` provides many pretrained image models. Since torchvision 0.13, you choose weights with a `weights` argument (the old `pretrained=True` is deprecated).

```python
import torch
from torch import nn
from torchvision import models

weights = models.ResNet18_Weights.DEFAULT           # the best available ImageNet weights
model = models.resnet18(weights=weights)            # downloads the weights the first time

print(model.fc)                                     # Linear(in_features=512, out_features=1000, bias=True)
print(sum(p.numel() for p in model.parameters()))   # 11689512  (about 11.7 million)

preprocess = weights.transforms()                   # the exact resizing and normalization used in training
print(weights.meta["categories"][:3])               # ['tench', 'goldfish', 'great white shark']
```

Every pretrained model expects input prepared **the same way as during its pretraining**: the same size (often 224 × 224) and the same normalization (ImageNet mean [0.485, 0.456, 0.406] and std [0.229, 0.224, 0.225]). `weights.transforms()` gives you exactly that.

Common choices:

| Model | Parameters (approx.) | Notes |
|---|---|---|
| ResNet-18 / ResNet-50 | 11.7M / 25.6M | reliable classic baselines |
| MobileNetV3 | 2–5M | small and fast, for phones and edge devices |
| EfficientNet (B0–B7) | 5M–66M | good accuracy per compute |
| ConvNeXt | 28M+ | modern CNN, strong accuracy |
| ViT / Swin | 86M+ (ViT-B) | Transformers for vision; best with large data |

Beyond torchvision, the `timm` library has hundreds of image models, and the Hugging Face Hub hosts vision, text and audio models, all loadable in a few lines (see [Hugging Face in Practice](/interview/nlp-transformers/hugging-face-in-practice)).

## Replacing the head

The ResNet's last layer `model.fc` maps 512 features to 1,000 ImageNet classes. For 5 classes of your own, replace it:

```python
num_classes = 5
model.fc = nn.Linear(model.fc.in_features, num_classes)   # 512 -> 5, new random weights
```

The new head has 512 × 5 + 5 = 2,565 parameters. The old head had 512 × 1,000 + 1,000 = 513,000. Each architecture names its head differently: `model.fc` for ResNet, `model.classifier[-1]` for EfficientNet and MobileNet, `model.heads.head` for torchvision ViT. Print the model to find it.

## Freezing layers

To freeze a parameter, set `requires_grad` to `False`. Autograd then does not compute its gradient, and the optimizer cannot change it.

```python
# 1. Freeze everything
for p in model.parameters():
    p.requires_grad = False

# 2. Replace the head (new layers have requires_grad=True by default)
model.fc = nn.Linear(model.fc.in_features, num_classes)

# 3. Give the optimizer only the trainable parameters
trainable = [p for p in model.parameters() if p.requires_grad]
optimizer = torch.optim.AdamW(trainable, lr=1e-3)

n_train = sum(p.numel() for p in trainable)
n_total = sum(p.numel() for p in model.parameters())
print(f"training {n_train:,} of {n_total:,} parameters")   # training 2,565 of 11,179,077 parameters
```

(The total is now lower than 11.7 million because the 513,000-parameter ImageNet head was replaced by a 2,565-parameter one.)

**Batch norm in frozen layers.** Setting `requires_grad=False` stops γ and β from learning, but in `model.train()` mode batch norm layers still **update their running mean and variance** with your data. With small batches this can hurt. For pure feature extraction, a common approach is to put the frozen backbone's batch norm layers in eval mode during training:

```python
def set_bn_eval(module):
    if isinstance(module, nn.BatchNorm2d):
        module.eval()

model.train()
model.apply(set_bn_eval)   # call after every model.train()
```

### Unfreezing for fine-tuning, with layer-wise learning rates

ResNet is organized in blocks: `conv1`, `layer1`, `layer2`, `layer3`, `layer4`, then `fc`. To fine-tune the last block too:

```python
for p in model.layer4.parameters():
    p.requires_grad = True

optimizer = torch.optim.AdamW([
    {"params": model.layer4.parameters(), "lr": 1e-4},   # pretrained block: small steps
    {"params": model.fc.parameters(), "lr": 1e-3},       # new head: bigger steps
], weight_decay=0.01)
```

Using smaller learning rates for earlier (more general) layers and larger ones for later (more specific) layers is called **discriminative learning rates** or **layer-wise learning rates**. Unfreezing blocks one at a time, from the top down, over several epochs is called **gradual unfreezing**.

## A complete image classifier on your own data

Suppose you have photos of 5 kinds of Indian street food arranged like this:

```text
data/
  train/
    dosa/        img001.jpg, img002.jpg, ...
    idli/
    pani_puri/
    samosa/
    vada_pav/
  val/
    dosa/ ...    (same class folders)
```

`torchvision.datasets.ImageFolder` reads this layout: each sub-folder name becomes a class.

```python
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets, models, transforms

device = "cuda" if torch.cuda.is_available() else "cpu"
torch.manual_seed(0)

# ---- Data: augmentation for training, plain resize for validation ----
mean, std = [0.485, 0.456, 0.406], [0.229, 0.224, 0.225]     # ImageNet statistics
train_tf = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.7, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(0.2, 0.2, 0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean, std),
])
val_tf = transforms.Compose([
    transforms.Resize(256), transforms.CenterCrop(224),
    transforms.ToTensor(), transforms.Normalize(mean, std),
])
train_ds = datasets.ImageFolder("data/train", transform=train_tf)
val_ds = datasets.ImageFolder("data/val", transform=val_tf)
print(train_ds.classes)       # ['dosa', 'idli', 'pani_puri', 'samosa', 'vada_pav']
train_loader = DataLoader(train_ds, batch_size=32, shuffle=True, num_workers=2)
val_loader = DataLoader(val_ds, batch_size=64, num_workers=2)

# ---- Model: pretrained backbone, frozen, new head ----
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
for p in model.parameters():
    p.requires_grad = False
model.fc = nn.Linear(model.fc.in_features, len(train_ds.classes))
model = model.to(device)

loss_fn = nn.CrossEntropyLoss(label_smoothing=0.1)

def run_epoch(model, loader, optimizer=None):
    training = optimizer is not None
    model.train(training)                      # train() if training, else eval()
    total, correct, loss_sum = 0, 0, 0.0
    with torch.set_grad_enabled(training):     # gradients only when training
        for x, y in loader:
            x, y = x.to(device), y.to(device)
            logits = model(x)
            loss = loss_fn(logits, y)
            if training:
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
            loss_sum += loss.item() * x.size(0)
            correct += (logits.argmax(1) == y).sum().item()
            total += x.size(0)
    return loss_sum / total, correct / total

# ---- Stage 1: feature extraction (train the head only) ----
opt = torch.optim.AdamW(model.fc.parameters(), lr=1e-3)
for epoch in range(3):
    tr = run_epoch(model, train_loader, opt)
    va = run_epoch(model, val_loader)
    print(f"[head] epoch {epoch}: train acc {tr[1]:.3f}  val acc {va[1]:.3f}")

# ---- Stage 2: fine-tune the last block too, with smaller learning rates ----
for p in model.layer4.parameters():
    p.requires_grad = True
opt = torch.optim.AdamW([
    {"params": model.layer4.parameters(), "lr": 1e-4},
    {"params": model.fc.parameters(), "lr": 3e-4},
], weight_decay=0.01)
for epoch in range(5):
    tr = run_epoch(model, train_loader, opt)
    va = run_epoch(model, val_loader)
    print(f"[fine-tune] epoch {epoch}: train acc {tr[1]:.3f}  val acc {va[1]:.3f}")

torch.save(model.state_dict(), "food_resnet18.pt")
```

The structure is exactly the training loop from [Building and Training a Model in PyTorch](/interview/deep-learning/building-and-training-a-model-in-pytorch), merged into one function: `model.train(training)` switches modes and `torch.set_grad_enabled(training)` switches autograd. With a few hundred images per class, a setup like this usually reaches high accuracy within a few epochs, often far better than any model trained from scratch on the same data.

> **Interview tip:** When asked "how would you build an image classifier with only 500 labelled images?", answer: start from a pretrained backbone like ResNet or EfficientNet, use the matching preprocessing, replace the head, train the head with the backbone frozen, add augmentation, then optionally unfreeze the top block with a 10× lower learning rate, and evaluate with a held-out validation set and per-class metrics (see [Evaluation Metrics](/interview/machine-learning/evaluation-metrics)).

## Using a backbone to make embeddings

Sometimes you do not want a classifier at all. You want a **vector** that describes each image, for "find similar products" search or clustering. Remove the head and the backbone outputs a feature vector, called an **embedding**.

```python
backbone = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
backbone.fc = nn.Identity()          # the "head" now just returns its input
backbone.eval()

with torch.inference_mode():
    emb = backbone(torch.randn(4, 3, 224, 224))   # 4 preprocessed images
print(emb.shape)                                    # torch.Size([4, 512])
```

Compare embeddings with cosine similarity to find similar images; store them in a vector database for large-scale search. The same idea, with text models, powers semantic search and RAG (see [Embeddings and Semantic Search](/interview/llms-genai/embeddings-and-semantic-search)). For image embeddings, models trained for that purpose, such as CLIP or DINOv2, usually work better than a classification ResNet.

## Transfer learning beyond images

| Domain | Typical pretrained model | How you adapt it |
|---|---|---|
| Images | ResNet, EfficientNet, ViT, CLIP, DINOv2 | new head; freeze or fine-tune |
| Text classification | BERT, RoBERTa, DeBERTa | add a classification head, fine-tune everything with LR ~2e-5 (see [Fine-tuning a Transformer](/interview/nlp-transformers/fine-tuning-a-transformer)) |
| Text generation | Llama, Mistral, Qwen and other LLMs | prompting first; then LoRA / QLoRA fine-tuning (see [Fine-tuning, LoRA and QLoRA](/interview/llms-genai/fine-tuning-lora-and-qlora)) |
| Speech | Whisper, wav2vec 2.0 | fine-tune on your language or domain |

**Parameter-efficient fine-tuning (PEFT)**, such as LoRA, is the LLM-scale version of freezing: keep the huge pretrained weights frozen and train a small number of new parameters added alongside them.

## Common pitfalls

| Pitfall | Effect | Fix |
|---|---|---|
| Wrong preprocessing (no normalization, wrong size, BGR instead of RGB) | poor accuracy despite a good model | use `weights.transforms()` or the documented mean/std |
| Learning rate too high when fine-tuning | pretrained features destroyed | 1e-5 to 1e-4 for the backbone; train the head first |
| Forgetting to pass only trainable params, or freezing after creating the optimizer | confusing behaviour, wasted memory | freeze first, then build the optimizer |
| Frozen batch norm still updating statistics | unstable results with small batches | put frozen BN layers in eval mode |
| Validation images augmented randomly | noisy, pessimistic metrics | deterministic resize + centre crop for validation |
| Data leakage (same photo in train and val) | over-optimistic accuracy | split by source, remove near-duplicates |
| Ignoring the model licence | legal risk in production | check the weights' licence before shipping |

## Key terms

| Term | Simple meaning |
|---|---|
| Transfer learning | Re-using a model trained on one task for another task |
| Pretrained model | A model already trained on a large dataset |
| ImageNet | A dataset of ~1.28M labelled photos in 1,000 classes, used for pretraining |
| Backbone | The main body of a model that produces features |
| Head | The final task-specific layer(s) |
| Downstream task | The new task you adapt the model to |
| Feature extraction | Freeze the backbone, train only a new head |
| Fine-tuning | Continue training pretrained layers on new data |
| Freezing | Setting `requires_grad=False` so weights do not change |
| Catastrophic forgetting | Losing pretrained knowledge because of large updates |
| Discriminative / layer-wise learning rates | Smaller LRs for earlier layers, larger for later ones |
| Gradual unfreezing | Unfreezing layers step by step from the top |
| ImageFolder | torchvision dataset that reads one folder per class |
| Embedding | A feature vector that describes an input |
| nn.Identity | A layer that returns its input unchanged |
| PEFT | Training a small number of added parameters while freezing the rest |

## Interview questions

**What is transfer learning and why does it work?**
It is re-using a model trained on a large dataset as the starting point for a new task. It works because early and middle layers learn general features, like edges, textures and shapes in images or grammar and meaning in text, that are useful for many tasks. Only the task-specific top layers need to be learned from your smaller dataset.

**What is the difference between feature extraction and fine-tuning?**
In feature extraction you freeze the whole pretrained backbone and train only a new head, so the backbone is a fixed feature generator. In fine-tuning you also update some or all backbone layers with a small learning rate. Feature extraction is cheaper and safer with very little data; fine-tuning usually gives better accuracy with more data or when the new data looks different.

**How do you freeze layers in PyTorch?**
Set `requires_grad = False` on their parameters, for example in a loop over `model.parameters()`, and pass only parameters with `requires_grad=True` to the optimizer. Remember that batch norm layers still update running statistics in training mode unless you put them in eval mode.

**Why use a smaller learning rate when fine-tuning?**
The pretrained weights are already good; large updates would overwrite them, causing catastrophic forgetting. A small learning rate adjusts them gently towards the new task. The new head, which starts random, can use a larger learning rate.

**Why train the head first before unfreezing the backbone?**
A newly initialized head produces large, random gradients at the start. If the backbone is unfrozen, those gradients flow into the pretrained layers and damage them. Training the head first lets it become sensible, so later fine-tuning gradients are smaller and more meaningful.

**Your fine-tuned model performs poorly even though the pretrained model is strong. What do you check?**
First, the preprocessing: input size, RGB order, and normalization must match the pretraining. Then the learning rate (too high destroys features), whether the right layers are trainable, batch norm behaviour, label correctness and class balance, and possible data leakage or a mismatch between training and validation transforms.

**When would you train from scratch instead?**
When your data is extremely different from any available pretraining data and you have a very large dataset, when a pretrained model's licence or size does not fit your constraints, or when the input type is unusual (for example, special sensor data with many channels). Even then, pretrained weights often still help as initialization.

**How would you use a pretrained CNN for image similarity search?**
Replace the classification head with `nn.Identity()` to get a feature vector for each image, normalize the vectors, and compare them with cosine similarity. For many images, store the vectors in a vector database with approximate nearest neighbour search. Models trained for embeddings, like CLIP or DINOv2, usually give better similarity results.

**How does transfer learning relate to LoRA fine-tuning of LLMs?**
It is the same idea at a larger scale. The pretrained LLM is the backbone and is kept frozen; LoRA adds small trainable low-rank matrices to some layers and trains only those. This gives most of the benefit of full fine-tuning with a fraction of the memory and compute.

## Try it yourself

1. Load `models.resnet50` with default weights and print `model.fc`. How many parameters does a new head for 12 classes have? *Hint:* ResNet-50's features are 2,048-dimensional.
2. Write a function `count_trainable(model)` that returns the number of trainable and total parameters, and use it before and after freezing a ResNet-18. *Hint:* filter on `p.requires_grad`.
3. Load `models.mobilenet_v3_small` with default weights and replace its final layer for 3 classes. *Hint:* print `model.classifier` to see which index is the final `nn.Linear`.
4. With the street-food example, how would you change the code to fine-tune the whole network in stage 2 with layer-wise learning rates of 1e-5 (layers 1–2), 5e-5 (layer 3), 1e-4 (layer 4) and 3e-4 (head)? *Hint:* one parameter group per block; unfreeze everything first.

### Answers

1. `model.fc` is `Linear(in_features=2048, out_features=1000)`. A 12-class head has 2,048 × 12 + 12 = 24,588 parameters.
2. One solution:

```python
def count_trainable(model):
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    total = sum(p.numel() for p in model.parameters())
    return trainable, total

m = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
print(count_trainable(m))            # (11689512, 11689512)
for p in m.parameters():
    p.requires_grad = False
m.fc = nn.Linear(512, 5)
print(count_trainable(m))            # (2565, 11179077)
```

3. In torchvision, `model.classifier` for MobileNetV3-Small is a `Sequential` whose last item is `Linear(1024, 1000)`:

```python
m = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
m.classifier[-1] = nn.Linear(m.classifier[-1].in_features, 3)
```

4. Unfreeze everything with `for p in model.parameters(): p.requires_grad = True`, then:

```python
opt = torch.optim.AdamW([
    {"params": list(model.conv1.parameters()) + list(model.bn1.parameters())
               + list(model.layer1.parameters()) + list(model.layer2.parameters()), "lr": 1e-5},
    {"params": model.layer3.parameters(), "lr": 5e-5},
    {"params": model.layer4.parameters(), "lr": 1e-4},
    {"params": model.fc.parameters(), "lr": 3e-4},
], weight_decay=0.01)
```

**Next:** [Training in Practice](/interview/deep-learning/training-in-practice)
