---
title: Regularization, Dropout and Batch Norm
part: PyTorch
summary: How deep networks overfit and how to read train vs validation curves, then the main fixes (data augmentation, weight decay, dropout, early stopping, label smoothing) and the normalization layers (batch norm, layer norm, RMSNorm), each with worked numbers and PyTorch code.
---

Deep networks have millions of parameters, so they can memorize a training set, including its noise, and then fail on new data. Fighting this is a daily part of the job: when your validation accuracy stalls while training accuracy keeps climbing, you reach for the tools in this chapter. Normalization layers are covered here too. They are not mainly regularizers, but they make deep networks train faster and more stably, and every modern architecture (ResNet, BERT, Llama) uses one.

> **In simple words:** Regularization means anything that makes the model do better on new data, even if it does slightly worse on training data. Dropout randomly switches neurons off during training, weight decay keeps weights small, augmentation creates new training examples, and early stopping quits before the model starts memorizing. Batch norm and layer norm rescale activations so training stays stable.

## Overfitting in deep learning

**Overfitting** means the model learns patterns that exist only in the training data (noise, accidents of sampling) instead of the general pattern. Its training loss keeps going down, but its loss on unseen data goes up. **Underfitting** is the opposite: the model is too simple or under-trained, and both losses stay high. (The classical view of this, the bias-variance trade-off, is in [Overfitting, Regularization and Cross-Validation](/interview/machine-learning/overfitting-regularization-and-cross-validation).)

You spot overfitting by plotting the **training loss** and the **validation loss** after each epoch. These plots are called **loss curves** or **learning curves**.

<figure>
<svg viewBox="0 0 440 210" width="440" height="210" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<line x1="50" y1="20" x2="50" y2="170" />
<line x1="50" y1="170" x2="410" y2="170" />
<text x="20" y="100" fill="currentColor" stroke="none" transform="rotate(-90 20 100)" text-anchor="middle">loss</text>
<text x="230" y="195" fill="currentColor" stroke="none" text-anchor="middle">epochs</text>
<polyline points="55,40 90,80 130,105 170,120 210,130 250,137 290,142 330,146 370,149 400,151" />
<polyline points="55,45 90,88 130,112 170,124 210,128 250,127 290,122 330,113 370,102 400,94" stroke="var(--accent)" stroke-width="2" />
<line x1="225" y1="25" x2="225" y2="170" stroke-dasharray="4 4" />
<text x="232" y="36" fill="currentColor" stroke="none">best epoch: stop here</text>
<text x="398" y="164" fill="currentColor" stroke="none" text-anchor="end">training</text>
<text x="398" y="86" fill="var(--accent)" stroke="none" text-anchor="end" font-weight="bold">validation</text>
<text x="120" y="155" fill="currentColor" stroke="none" text-anchor="middle" font-size="11">both falling: keep training</text>
<text x="330" y="132" fill="currentColor" stroke="none" text-anchor="middle" font-size="11">gap grows: overfitting</text>
</svg>
<figcaption>Training loss keeps falling, but validation loss reaches its lowest point and then rises. The model is best at the dashed line; after that it memorizes the training set.</figcaption>
</figure>

| What you see | Diagnosis | What to try |
|---|---|---|
| Both losses high and flat | underfitting | bigger model, train longer, higher learning rate, check for bugs |
| Both falling together | still learning | keep training |
| Train falls, validation rises | overfitting | the regularization tools below |
| Validation lower than training | often dropout/augmentation are active only in training; or a data leak | usually fine; check for leakage if large |
| Losses jump wildly or NaN | unstable training | lower learning rate, clip gradients (see [Training in Practice](/interview/deep-learning/training-in-practice)) |

> **Interview tip:** Always talk about the **gap** between training and validation performance. "Train accuracy 99%, validation 80%" is a large gap: overfitting. "Train 70%, validation 69%" is a small gap but low performance: underfitting.

### The toolbox

| Technique | Main idea | Typical setting |
|---|---|---|
| More data | the best regularizer of all | collect or label more |
| Data augmentation | create realistic variations of training examples | flips, crops, colour changes for images |
| Weight decay (L2) | keep weights small | AdamW `weight_decay` 0.01–0.1 |
| Dropout | randomly zero neurons during training | p = 0.1 to 0.5 |
| Early stopping | stop when validation stops improving | patience 3–10 epochs |
| Label smoothing | do not let the model be 100% sure | 0.1 |
| Smaller model | fewer parameters to memorize with | fewer layers or neurons |
| Transfer learning | start from a pretrained model | see [Transfer Learning and Pretrained Models](/interview/deep-learning/transfer-learning-and-pretrained-models) |

## Data augmentation

**Data augmentation** creates new training examples by changing existing ones in ways that do not change the label. A cat photo flipped left-to-right is still a cat. The model sees a slightly different version of each image every epoch, so it cannot memorize exact pixels and must learn the general shape.

| Data type | Common augmentations |
|---|---|
| Images | horizontal flip, random crop and resize, small rotation, colour jitter, random erasing, Mixup / CutMix |
| Text | synonym replacement, back-translation (translate to Hindi and back), random deletion, LLM paraphrasing |
| Audio | add background noise, time shift, speed change, SpecAugment (mask parts of the spectrogram) |
| Tabular | rarely used; maybe small noise; SMOTE for class imbalance |

```python
from torchvision import transforms

train_tf = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),   # random zoom and crop
    transforms.RandomHorizontalFlip(),                     # 50% chance of mirror image
    transforms.ColorJitter(brightness=0.2, contrast=0.2),  # lighting changes
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])
eval_tf = transforms.Compose([           # no randomness for validation and test
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])
```

> **Common mistake:** Augmenting the validation or test set with random transforms, or using an augmentation that changes the label. Flipping a digit "6" upside down makes it look like a "9"; horizontal flips are wrong for text in images. Pick augmentations that make sense for your data.

## Weight decay

**Weight decay** adds a small pull towards zero on every weight at every step. Large weights let the model build very sharp, specific functions that fit noise; small weights give smoother functions that generalize better.

<div class="formula">

| Formula | Meaning |
|---|---|
| L_total = L_data + (λ/2) · Σ w² | L2 penalty added to the loss |
| w ← w − η · (g + λ · w) = (1 − ηλ) · w − η · g | each step first shrinks w by the factor (1 − ηλ) |

</div>

**Worked example.** A weight w = 2.0 with gradient g = 0.5, learning rate η = 0.1 and λ = 0.01.

- Without decay: w = 2.0 − 0.1 × 0.5 = 1.95
- With decay: w = 2.0 − 0.1 × (0.5 + 0.01 × 2.0) = 2.0 − 0.1 × 0.52 = 2.0 − 0.052 = 1.948

The decay part removed an extra 0.002. Small per step, but over thousands of steps it stops weights from growing without reason. Use `torch.optim.AdamW(..., weight_decay=0.01)`; the [Optimizers and Learning Rate](/interview/deep-learning/optimizers-and-learning-rate) chapter explains why AdamW and not Adam + L2.

It is common to **not** apply weight decay to biases and normalization parameters, only to weight matrices:

```python
decay, no_decay = [], []
for name, p in model.named_parameters():
    (no_decay if p.ndim == 1 else decay).append(p)   # biases and norm weights are 1-D
optimizer = torch.optim.AdamW([
    {"params": decay, "weight_decay": 0.01},
    {"params": no_decay, "weight_decay": 0.0},
], lr=3e-4)
```

## Dropout

**Dropout** (Srivastava, Hinton and others, 2014) randomly sets each neuron's output to zero with probability p during training. A different random set is dropped for every example and every step.

Why does this help?

- **No co-adaptation.** A neuron cannot rely on one specific partner neuron, because that partner may be dropped. Each neuron must learn features that are useful on their own.
- **An ensemble for free.** Each step trains a different "thinned" sub-network. At test time, using the whole network is like averaging the predictions of many sub-networks. Averages of many models usually beat one model.

> **Real-life example:** A cricket team where any player might be missing on match day. If the team practises with random players absent, every player learns to bat and field well, instead of everyone depending on one star batsman.

### Inverted dropout: the scaling trick

If half the neurons are dropped, the next layer receives roughly half the usual total input. At test time nothing is dropped, so it would receive double. To keep training and testing consistent, PyTorch uses **inverted dropout**: during training, the surviving values are divided by (1 − p).

**Worked example.** Activations [2, 4, 6, 8], p = 0.5. Suppose the random mask is [keep, drop, keep, drop].

- After the mask: [2, 0, 6, 0]
- Divide survivors by (1 − 0.5) = 0.5, i.e. multiply by 2: [4, 0, 12, 0]
- Sum during training: 16. Sum without dropout: 2 + 4 + 6 + 8 = 20. These differ for one mask, but on average over many random masks the expected value of each output equals the original (each value is kept half the time at double size: 0.5 × 2x = x).

At evaluation time (`model.eval()`), dropout does nothing: values pass through unchanged, no scaling needed.

```python
import torch
from torch import nn

drop = nn.Dropout(p=0.5)
x = torch.tensor([2.0, 4.0, 6.0, 8.0])

drop.train()
print(drop(x))     # e.g. tensor([ 4.,  0., 12.,  0.])  -- random each call
drop.eval()
print(drop(x))     # tensor([2., 4., 6., 8.])          -- unchanged
```

Where and how much:

- Put dropout after the activation of hidden dense layers, for example `nn.Linear → nn.ReLU → nn.Dropout(0.3)`.
- Typical p: 0.2–0.5 for dense layers; 0.1 in Transformers (attention and feed-forward outputs). Many large LLMs use little or no dropout during pretraining because they see each example only about once, so overfitting is less of an issue.
- Dropout is less common directly after convolution layers; batch norm and augmentation do most of the work there.

> **Common mistake:** Forgetting `model.eval()` at test time. Dropout stays active, predictions become random and accuracy drops. If you run the same input twice and get different outputs, check this first.

## Early stopping

**Early stopping** watches the validation metric after each epoch and stops training when it has not improved for a number of epochs called the **patience**. You keep the weights from the best epoch (the dashed line in the figure above). It is simple, cheap and almost always worth using. The code is in the exercises of [Building and Training a Model in PyTorch](/interview/deep-learning/building-and-training-a-model-in-pytorch).

## Label smoothing

With normal cross-entropy, the target for the true class is 1.0 and the model is rewarded for pushing that probability ever closer to 1, which needs ever larger logits and leads to over-confidence. **Label smoothing** replaces the hard target with a softer one. With smoothing ε = 0.1 and K = 10 classes, the target becomes 0.9 + 0.1/10 = 0.91 for the true class and 0.1/10 = 0.01 for each other class.

```python
loss_fn = nn.CrossEntropyLoss(label_smoothing=0.1)
```

It often improves accuracy slightly and gives better-calibrated probabilities (confidence that matches real accuracy).

## Batch normalization

Now to normalization layers. During training, the inputs to each layer keep changing as earlier layers update, and activations can drift to very large or very small values. Training then needs a small learning rate and careful initialization. **Batch normalization** (Ioffe and Szegedy, 2015) fixes this by rescaling each feature to mean 0 and variance 1 **across the batch**, then letting the network learn its own preferred scale and shift.

<div class="formula">

| Step | Formula |
|---|---|
| Batch mean of each feature | μ = (1/m) Σ xᵢ |
| Batch variance | σ² = (1/m) Σ (xᵢ − μ)² |
| Normalize | x̂ᵢ = (xᵢ − μ) / √(σ² + ε) |
| Scale and shift (learned γ, β) | yᵢ = γ · x̂ᵢ + β |

</div>

**Worked example.** One feature (one neuron) over a batch of 4 examples: [2, 4, 6, 8]. Ignore the tiny ε.

1. Mean μ = (2 + 4 + 6 + 8) / 4 = 20 / 4 = 5
2. Differences from the mean: −3, −1, 1, 3. Squares: 9, 1, 1, 9. Variance σ² = 20 / 4 = 5
3. Standard deviation √5 ≈ 2.236
4. Normalized: −3/2.236 = −1.342, −1/2.236 = −0.447, 0.447, 1.342
5. With γ = 2 and β = 1: y = 2 × [−1.342, −0.447, 0.447, 1.342] + 1 = [−1.683, 0.106, 1.894, 3.683]

γ and β are learned. If the network finds that normalization hurts, it can learn γ = σ and β = μ and undo it completely, so batch norm never reduces what the layer can represent.

### Training vs evaluation behaviour

At test time you might predict one image, so there is no batch to compute statistics from. Batch norm therefore keeps **running averages** of the mean and variance during training and uses them at evaluation.

- PyTorch update rule: running_mean ← (1 − momentum) × running_mean + momentum × batch_mean, with momentum = 0.1. (Here "momentum" is a different idea from optimizer momentum.)
- Example: running_mean starts at 0. After a batch with mean 5: 0.9 × 0 + 0.1 × 5 = 0.5. After another batch with mean 5: 0.9 × 0.5 + 0.5 = 0.95. It slowly moves towards 5.
- `model.train()`: normalize with the **batch** statistics and update the running averages.
- `model.eval()`: normalize with the **running** averages. Output for an example no longer depends on the other examples in the batch.

Benefits: allows higher learning rates, less sensitive to initialization, faster convergence, and a mild regularization effect (batch statistics add noise). Problems: works poorly with small batches (statistics from 2 examples are noisy), behaves differently in training and evaluation (a source of bugs), and is awkward for variable-length sequences. That is why Transformers use layer norm.

```python
cnn_block = nn.Sequential(
    nn.Conv2d(3, 32, kernel_size=3, padding=1, bias=False),  # BN has its own shift (beta), so bias is redundant
    nn.BatchNorm2d(32),             # normalizes each of the 32 channels over (batch, H, W)
    nn.ReLU(),
)
mlp_block = nn.Sequential(nn.Linear(128, 64), nn.BatchNorm1d(64), nn.ReLU())
```

## Layer normalization and RMSNorm

**Layer normalization** normalizes **across the features of one example** instead of across the batch. Each example (each token, in a Transformer) is normalized on its own, so batch size does not matter and training and evaluation behave the same.

**Worked example.** One token's vector with 4 features: [1, 2, 3, 6].

1. Mean = (1 + 2 + 3 + 6) / 4 = 12 / 4 = 3
2. Differences: −2, −1, 0, 3. Squares: 4, 1, 0, 9. Variance = 14 / 4 = 3.5, standard deviation ≈ 1.871
3. Normalized: −2/1.871 = −1.069, −1/1.871 = −0.535, 0, 3/1.871 = 1.604
4. Then scale and shift with learned γ and β (one per feature), as in batch norm.

**RMSNorm** is a simpler version used in Llama, Mistral and many recent LLMs. It skips the mean subtraction and only divides by the root mean square: RMS = √((1 + 4 + 9 + 36)/4) = √12.5 ≈ 3.536, so [1, 2, 3, 6] becomes [0.283, 0.566, 0.849, 1.697], then multiplied by learned γ. It is slightly cheaper and works as well in practice.

| | Batch norm | Layer norm |
|---|---|---|
| Normalizes over | the batch (for each feature / channel) | the features (for each example) |
| Depends on batch size | yes; poor with small batches | no |
| Train vs eval | different (batch stats vs running stats) | identical |
| Extra state | running mean and variance | none (only γ, β) |
| Typical use | CNNs (ResNet) | Transformers, RNNs, LLMs |
| PyTorch | `nn.BatchNorm1d/2d` | `nn.LayerNorm(d)`, `nn.RMSNorm(d)` (PyTorch 2.4+) |

<figure>
<svg viewBox="0 0 420 170" width="420" height="170" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<text x="100" y="18" text-anchor="middle" fill="currentColor" stroke="none">Batch norm</text>
<text x="310" y="18" text-anchor="middle" fill="currentColor" stroke="none">Layer norm</text>
<rect x="40" y="30" width="120" height="120" />
<line x1="40" y1="60" x2="160" y2="60" stroke-width="1" /><line x1="40" y1="90" x2="160" y2="90" stroke-width="1" /><line x1="40" y1="120" x2="160" y2="120" stroke-width="1" />
<line x1="70" y1="30" x2="70" y2="150" stroke-width="1" /><line x1="100" y1="30" x2="100" y2="150" stroke-width="1" /><line x1="130" y1="30" x2="130" y2="150" stroke-width="1" />
<rect x="72" y="32" width="26" height="116" stroke="var(--accent)" stroke-width="2.5" />
<rect x="250" y="30" width="120" height="120" />
<line x1="250" y1="60" x2="370" y2="60" stroke-width="1" /><line x1="250" y1="90" x2="370" y2="90" stroke-width="1" /><line x1="250" y1="120" x2="370" y2="120" stroke-width="1" />
<line x1="280" y1="30" x2="280" y2="150" stroke-width="1" /><line x1="310" y1="30" x2="310" y2="150" stroke-width="1" /><line x1="340" y1="30" x2="340" y2="150" stroke-width="1" />
<rect x="252" y="62" width="116" height="26" stroke="var(--accent)" stroke-width="2.5" />
<text x="20" y="95" text-anchor="middle" fill="currentColor" stroke="none" transform="rotate(-90 20 95)">examples</text>
<text x="100" y="166" text-anchor="middle" fill="currentColor" stroke="none">features</text>
<text x="230" y="95" text-anchor="middle" fill="currentColor" stroke="none" transform="rotate(-90 230 95)">examples</text>
<text x="310" y="166" text-anchor="middle" fill="currentColor" stroke="none">features</text>
</svg>
<figcaption>Rows are examples in a batch, columns are features. Batch norm computes statistics down one column (one feature across the batch); layer norm computes them along one row (all features of one example).</figcaption>
</figure>

> **Interview tip:** "Why do Transformers use layer norm instead of batch norm?" Say: sequences have different lengths and padding, batch sizes per device can be small, and at inference we generate one token at a time; layer norm normalizes each token on its own, so it does not depend on the batch and behaves identically in training and inference.

## Putting it together

```python
import torch
from torch import nn

class RegularizedMLP(nn.Module):
    def __init__(self, in_features=784, num_classes=10, p_drop=0.3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Flatten(),
            nn.Linear(in_features, 512, bias=False),
            nn.BatchNorm1d(512),        # normalize, then activate
            nn.ReLU(),
            nn.Dropout(p_drop),         # regularize
            nn.Linear(512, 256, bias=False),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(p_drop),
            nn.Linear(256, num_classes),
        )

    def forward(self, x):
        return self.net(x)

model = RegularizedMLP()
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.05)
loss_fn = nn.CrossEntropyLoss(label_smoothing=0.1)
```

The order Linear → BatchNorm → ReLU → Dropout is a common, safe default. (Some people put batch norm after the activation; both work.)

## Key terms

| Term | Simple meaning |
|---|---|
| Regularization | Anything that improves performance on new data, often at a small cost on training data |
| Overfitting | Learning noise in the training set; validation gets worse |
| Underfitting | Model too simple or under-trained; both losses high |
| Loss / learning curves | Plots of training and validation loss per epoch |
| Generalization gap | Difference between training and validation performance |
| Data augmentation | New training examples from label-preserving changes |
| Weight decay | Shrinking weights towards zero every step |
| Dropout | Randomly zeroing neurons during training |
| Inverted dropout | Scaling survivors by 1/(1 − p) during training so eval needs no change |
| Co-adaptation | Neurons depending too much on specific other neurons |
| Early stopping | Stop when validation stops improving; keep the best weights |
| Patience | How many non-improving epochs to wait before stopping |
| Label smoothing | Softer targets so the model is not over-confident |
| Calibration | Whether predicted confidence matches real accuracy |
| Batch normalization | Normalize each feature over the batch, then scale and shift |
| Running statistics | Averages of mean and variance kept for evaluation in batch norm |
| γ, β | Learned scale and shift in normalization layers |
| Layer normalization | Normalize over the features of each example |
| RMSNorm | Layer norm without mean subtraction; used in many LLMs |

## Interview questions

**How do you detect overfitting in a neural network?**
Plot training and validation loss per epoch. If training loss keeps falling while validation loss stops falling and starts rising, the model is overfitting. A large gap between training and validation accuracy is the same signal.

**How does dropout work, and why does it reduce overfitting?**
During training, each neuron's output is set to zero with probability p, and the survivors are scaled by 1/(1 − p). This stops neurons from relying on specific partners and effectively trains an ensemble of many sub-networks that share weights. At evaluation, dropout is turned off and the full network is used.

**Why do we scale by 1/(1 − p) during training?**
So that the expected value of each activation is the same in training and evaluation. Without scaling, the next layer would receive smaller inputs during training than at test time. With inverted dropout, inference needs no change at all.

**What does batch norm do, and why does it help?**
It normalizes each feature to zero mean and unit variance using batch statistics, then applies a learned scale γ and shift β. This keeps activations in a stable range, allows higher learning rates, makes training less sensitive to initialization, and adds a little regularization noise.

**How does batch norm behave differently in training and evaluation?**
In training it uses the current batch's mean and variance and updates running averages. In evaluation it uses the stored running averages, so outputs do not depend on other examples in the batch. Forgetting `model.eval()` means using batch statistics at test time, which gives inconsistent predictions.

**What is the difference between batch norm and layer norm?**
Batch norm computes statistics for each feature across the examples in a batch; layer norm computes statistics across all features within one example. Layer norm does not depend on batch size and behaves the same in training and inference, which makes it the choice for Transformers and RNNs. Batch norm remains common in CNNs.

**Why might batch norm perform badly with a batch size of 2?**
The mean and variance estimated from two examples are very noisy, so the normalization itself becomes random and training suffers. The running statistics are also poor estimates. Group norm or layer norm, which do not depend on the batch, are better choices then.

**What is weight decay, and is it the same as L2 regularization?**
Weight decay shrinks each weight by a small factor every step. With plain SGD it is mathematically the same as adding an L2 penalty to the loss. With adaptive optimizers like Adam it is not, which is why AdamW applies decay directly to the weights.

**Name three ways to reduce overfitting without collecting more data.**
Data augmentation, dropout, weight decay, early stopping, label smoothing, a smaller model, or starting from a pretrained model. Mention that augmentation and transfer learning are often the most effective for images.

**Why do LLMs often use little or no dropout during pretraining?**
They are trained on enormous datasets, usually seeing each example about once, so memorizing the training set is not the main risk. Dropout would slow learning. Dropout is more useful when fine-tuning on small datasets.

## Try it yourself

1. Apply batch norm by hand to the batch [10, 20, 30, 40] with γ = 1 and β = 0. *Hint:* the mean is 25; the variance is 125.
2. Apply layer norm by hand to the vector [2, 2, 2, 6]. *Hint:* mean 3.
3. A dropout layer with p = 0.2 receives [5, 5, 5, 5, 5] and the mask drops only the second value. What is the output in training mode? In eval mode? *Hint:* scale by 1/0.8.
4. Train the MNIST MLP from the previous chapter with and without `nn.Dropout(0.5)` for 10 epochs and plot both sets of loss curves with Matplotlib. *Hint:* store the per-epoch losses in lists and call `plt.plot` four times.

### Answers

1. Differences: −15, −5, 5, 15; squares 225, 25, 25, 225; variance 500/4 = 125; std ≈ 11.18. Normalized: [−1.342, −0.447, 0.447, 1.342]. The same as the [2, 4, 6, 8] example, because normalization removes scale and shift.
2. Mean 3, differences −1, −1, −1, 3, squares 1, 1, 1, 9, variance 12/4 = 3, std ≈ 1.732. Output ≈ [−0.577, −0.577, −0.577, 1.732].
3. Training: [5/0.8, 0, 5/0.8, 5/0.8, 5/0.8] = [6.25, 0, 6.25, 6.25, 6.25]. Eval: [5, 5, 5, 5, 5] unchanged.
4. Sketch:

```python
import matplotlib.pyplot as plt

# history = {"train": [...], "val": [...]} collected for each model inside the epoch loop
plt.plot(hist_plain["train"], label="no dropout - train")
plt.plot(hist_plain["val"], label="no dropout - val")
plt.plot(hist_drop["train"], label="dropout - train")
plt.plot(hist_drop["val"], label="dropout - val")
plt.xlabel("epoch"); plt.ylabel("loss"); plt.legend(); plt.show()
```

You should see a smaller gap between training and validation loss with dropout; the training loss itself is higher because the network is handicapped during training.

**Next:** [Convolutional Neural Networks](/interview/deep-learning/convolutional-neural-networks)
