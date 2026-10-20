---
title: Convolutional Neural Networks
part: Architectures
summary: Why images need convolutions, a convolution computed by hand on a 4×4 grid, filters, stride, padding, the output-size formula, channels and parameter counts, pooling, a full CNN with shapes traced layer by layer, and ResNet skip connections.
---

Convolutional neural networks (CNNs) are the classic architecture for images. They power photo search, medical scan analysis, OCR for Aadhaar and PAN card scanning, quality checks in factories, and the vision encoders of many multimodal models. Even though Vision Transformers now compete with them, CNNs remain fast, data-efficient and very common in production, and the ideas of local filters, stride, padding and skip connections show up everywhere. Interviewers often ask you to compute an output size or a parameter count on the spot; this chapter makes that easy.

> **In simple words:** A convolution slides a small grid of weights (a filter) over the image and, at each position, multiplies and adds to get one number. The same filter is used everywhere, so it detects the same pattern (like an edge) anywhere in the image. Stacking convolutions and pooling layers builds from edges to shapes to objects.

## Why not a normal dense network for images?

A small colour photo of 224 × 224 pixels has 224 × 224 × 3 = 150,528 input numbers. A dense layer with just 1,000 neurons would need 150,528 × 1,000 ≈ 150 million weights in the **first layer alone**. That is slow, needs huge amounts of data, and overfits.

Worse, a dense layer ignores how images work:

- **Locality.** Nearby pixels belong together (an eye is a small patch of pixels). A dense layer connects every pixel to every neuron, treating far-apart pixels the same as neighbours.
- **Translation.** A cat in the top-left corner is still a cat in the bottom-right. A dense layer would have to learn "cat" separately for every position.

A CNN builds these facts into the architecture:

1. **Local connectivity**: each output looks only at a small patch of the input (like 3 × 3).
2. **Weight sharing**: the same small filter is used at every position. Fewer parameters, and a pattern learned in one place is recognized everywhere. This property is called **translation equivariance** (shift the input, and the output shifts the same way).

## The convolution operation

A **filter** (also called a **kernel**) is a small grid of weights, for example 3 × 3. To **convolve** it with an image:

1. Place the filter on the top-left patch of the image.
2. Multiply each filter weight by the pixel under it and add all the products (plus a bias). That sum is one output value.
3. Slide the filter to the right by one step and repeat. At the end of a row, move down one step and start again from the left.

The grid of outputs is called a **feature map** or **activation map**. It shows where in the image the filter's pattern appears.

> **Real-life example:** Searching a newspaper page for the word "cricket" with a small cut-out window. You slide the window across every line. Wherever the window shows a good match, you put a mark. The marks form a "where does cricket appear" map. A filter does the same for a visual pattern.

### Convolution by hand on a 4 × 4 grid

Input (a tiny grayscale image) and a 3 × 3 **vertical edge filter**:

| Input X | col 0 | col 1 | col 2 | col 3 |
|---|---|---|---|---|
| row 0 | 3 | 1 | 0 | 2 |
| row 1 | 4 | 2 | 1 | 0 |
| row 2 | 5 | 3 | 0 | 1 |
| row 3 | 2 | 4 | 1 | 3 |

Filter K (each row is [1, 0, −1]): it computes "left column minus right column", so it responds strongly where the left side is brighter than the right side, which is a vertical edge.

| K | | | |
|---|---|---|---|
| | 1 | 0 | −1 |
| | 1 | 0 | −1 |
| | 1 | 0 | −1 |

A 3 × 3 filter fits in a 4 × 4 grid in 2 positions across and 2 down, so the output is 2 × 2 (stride 1, no padding).

**Position (0, 0)** — top-left 3 × 3 patch, rows 0–2, columns 0–2: [[3, 1, 0], [4, 2, 1], [5, 3, 0]].

- Row 0: 3×1 + 1×0 + 0×(−1) = 3 + 0 + 0 = 3
- Row 1: 4×1 + 2×0 + 1×(−1) = 4 + 0 − 1 = 3
- Row 2: 5×1 + 3×0 + 0×(−1) = 5 + 0 + 0 = 5
- Sum: 3 + 3 + 5 = **11**

**Position (0, 1)** — rows 0–2, columns 1–3: [[1, 0, 2], [2, 1, 0], [3, 0, 1]].

- Row 0: 1 − 2 = −1; Row 1: 2 − 0 = 2; Row 2: 3 − 1 = 2
- Sum: −1 + 2 + 2 = **3**

**Position (1, 0)** — rows 1–3, columns 0–2: [[4, 2, 1], [5, 3, 0], [2, 4, 1]].

- Row 1: 4 − 1 = 3; Row 2: 5 − 0 = 5; Row 3: 2 − 1 = 1
- Sum: 3 + 5 + 1 = **9**

**Position (1, 1)** — rows 1–3, columns 1–3: [[2, 1, 0], [3, 0, 1], [4, 1, 3]].

- Row 1: 2 − 0 = 2; Row 2: 3 − 1 = 2; Row 3: 4 − 3 = 1
- Sum: 2 + 2 + 1 = **5**

Output feature map: **[[11, 3], [9, 5]]**. The big values on the left column show a strong "bright-left, dark-right" edge in the left part of the image, which matches the large numbers 3, 4, 5 in the input's first column.

<figure>
<svg viewBox="0 0 390 175" width="390" height="175" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<rect x="10" y="30" width="30" height="30" stroke-width="1" />
<text x="25" y="50" text-anchor="middle" fill="currentColor" stroke="none">3</text>
<rect x="40" y="30" width="30" height="30" stroke-width="1" />
<text x="55" y="50" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<rect x="70" y="30" width="30" height="30" stroke-width="1" />
<text x="85" y="50" text-anchor="middle" fill="currentColor" stroke="none">0</text>
<rect x="100" y="30" width="30" height="30" stroke-width="1" />
<text x="115" y="50" text-anchor="middle" fill="currentColor" stroke="none">2</text>
<rect x="10" y="60" width="30" height="30" stroke-width="1" />
<text x="25" y="80" text-anchor="middle" fill="currentColor" stroke="none">4</text>
<rect x="40" y="60" width="30" height="30" stroke-width="1" />
<text x="55" y="80" text-anchor="middle" fill="currentColor" stroke="none">2</text>
<rect x="70" y="60" width="30" height="30" stroke-width="1" />
<text x="85" y="80" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<rect x="100" y="60" width="30" height="30" stroke-width="1" />
<text x="115" y="80" text-anchor="middle" fill="currentColor" stroke="none">0</text>
<rect x="10" y="90" width="30" height="30" stroke-width="1" />
<text x="25" y="110" text-anchor="middle" fill="currentColor" stroke="none">5</text>
<rect x="40" y="90" width="30" height="30" stroke-width="1" />
<text x="55" y="110" text-anchor="middle" fill="currentColor" stroke="none">3</text>
<rect x="70" y="90" width="30" height="30" stroke-width="1" />
<text x="85" y="110" text-anchor="middle" fill="currentColor" stroke="none">0</text>
<rect x="100" y="90" width="30" height="30" stroke-width="1" />
<text x="115" y="110" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<rect x="10" y="120" width="30" height="30" stroke-width="1" />
<text x="25" y="140" text-anchor="middle" fill="currentColor" stroke="none">2</text>
<rect x="40" y="120" width="30" height="30" stroke-width="1" />
<text x="55" y="140" text-anchor="middle" fill="currentColor" stroke="none">4</text>
<rect x="70" y="120" width="30" height="30" stroke-width="1" />
<text x="85" y="140" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<rect x="100" y="120" width="30" height="30" stroke-width="1" />
<text x="115" y="140" text-anchor="middle" fill="currentColor" stroke="none">3</text>
<rect x="10" y="30" width="90" height="90" stroke="var(--accent)" stroke-width="3" />
<text x="153" y="95" text-anchor="middle" fill="currentColor" stroke="none" font-size="18">∗</text>
<rect x="170" y="45" width="30" height="30" stroke-width="1" />
<text x="185" y="65" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<rect x="200" y="45" width="30" height="30" stroke-width="1" />
<text x="215" y="65" text-anchor="middle" fill="currentColor" stroke="none">0</text>
<rect x="230" y="45" width="30" height="30" stroke-width="1" />
<text x="245" y="65" text-anchor="middle" fill="currentColor" stroke="none">−1</text>
<rect x="170" y="75" width="30" height="30" stroke-width="1" />
<text x="185" y="95" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<rect x="200" y="75" width="30" height="30" stroke-width="1" />
<text x="215" y="95" text-anchor="middle" fill="currentColor" stroke="none">0</text>
<rect x="230" y="75" width="30" height="30" stroke-width="1" />
<text x="245" y="95" text-anchor="middle" fill="currentColor" stroke="none">−1</text>
<rect x="170" y="105" width="30" height="30" stroke-width="1" />
<text x="185" y="125" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<rect x="200" y="105" width="30" height="30" stroke-width="1" />
<text x="215" y="125" text-anchor="middle" fill="currentColor" stroke="none">0</text>
<rect x="230" y="105" width="30" height="30" stroke-width="1" />
<text x="245" y="125" text-anchor="middle" fill="currentColor" stroke="none">−1</text>
<text x="283" y="95" text-anchor="middle" fill="currentColor" stroke="none" font-size="18">=</text>
<rect x="305" y="60" width="30" height="30" stroke-width="1" />
<text x="320" y="80" text-anchor="middle" fill="currentColor" stroke="none">11</text>
<rect x="335" y="60" width="30" height="30" stroke-width="1" />
<text x="350" y="80" text-anchor="middle" fill="currentColor" stroke="none">3</text>
<rect x="305" y="90" width="30" height="30" stroke-width="1" />
<text x="320" y="110" text-anchor="middle" fill="currentColor" stroke="none">9</text>
<rect x="335" y="90" width="30" height="30" stroke-width="1" />
<text x="350" y="110" text-anchor="middle" fill="currentColor" stroke="none">5</text>
<rect x="305" y="60" width="30" height="30" stroke="var(--accent)" stroke-width="3" />
<text x="70" y="168" text-anchor="middle" fill="currentColor" stroke="none">input 4×4</text>
<text x="215" y="168" text-anchor="middle" fill="currentColor" stroke="none">filter 3×3</text>
<text x="335" y="168" text-anchor="middle" fill="currentColor" stroke="none">output 2×2</text>
</svg>
<figcaption>The highlighted 3×3 patch of the input, multiplied element by element with the filter and summed, gives the highlighted output value 11. Sliding the patch gives the other three values.</figcaption>
</figure>

In a real CNN, the filter values are **not** designed by hand. They start random and are learned by backpropagation, exactly like dense weights. The network discovers that edge detectors, colour blob detectors and texture detectors are useful.

> **Remember:** Deep learning "convolution" does not flip the filter. Mathematically it is **cross-correlation**. Since filters are learned, the difference does not matter, but a sharp interviewer may ask.

### The same in code

```python
import numpy as np

def conv2d(X, K, stride=1):
    kh, kw = K.shape
    out_h = (X.shape[0] - kh) // stride + 1
    out_w = (X.shape[1] - kw) // stride + 1
    out = np.zeros((out_h, out_w))
    for i in range(out_h):
        for j in range(out_w):
            patch = X[i*stride:i*stride+kh, j*stride:j*stride+kw]
            out[i, j] = (patch * K).sum()        # multiply and add
    return out

X = np.array([[3, 1, 0, 2], [4, 2, 1, 0], [5, 3, 0, 1], [2, 4, 1, 3]])
K = np.array([[1, 0, -1], [1, 0, -1], [1, 0, -1]])
print(conv2d(X, K))
# [[11.  3.]
#  [ 9.  5.]]
```

In PyTorch the same calculation is one layer. Note the 4-D shape (batch, channels, height, width):

```python
import torch
import torch.nn.functional as F

X = torch.tensor([[3., 1, 0, 2], [4, 2, 1, 0], [5, 3, 0, 1], [2, 4, 1, 3]]).reshape(1, 1, 4, 4)
K = torch.tensor([[1., 0, -1]] * 3).reshape(1, 1, 3, 3)   # (out_ch, in_ch, kh, kw)
print(F.conv2d(X, K))
# tensor([[[[11.,  3.],
#           [ 9.,  5.]]]])
```

## Stride and padding

**Stride** is how many pixels the filter moves each step. Stride 1 visits every position. Stride 2 skips every other position, so the output is about half as wide and half as tall. It is a cheap way to shrink the feature map.

**Worked example: a 2 × 2 filter with stride 2.** Use the same input X and the filter [[1, −1], [1, −1]] (left minus right). With stride 2 the patches do not overlap:

- Top-left patch [[3, 1], [4, 2]]: 3 − 1 + 4 − 2 = **4**
- Top-right patch [[0, 2], [1, 0]]: 0 − 2 + 1 − 0 = **−1**
- Bottom-left patch [[5, 3], [2, 4]]: 5 − 3 + 2 − 4 = **0**
- Bottom-right patch [[0, 1], [1, 3]]: 0 − 1 + 1 − 3 = **−3**

Output: [[4, −1], [0, −3]].

**Padding** adds a border of extra pixels (usually zeros) around the input before convolving. Why:

1. Without padding, every convolution shrinks the image (4 × 4 → 2 × 2 above). After many layers nothing would be left.
2. Without padding, edge pixels are covered by fewer filter positions than centre pixels, so border information is under-used.

With a 3 × 3 filter, padding 1 keeps the size the same: the 4 × 4 input padded to 6 × 6 gives a 4 × 4 output. This is called **"same" padding**. No padding is called **"valid"**.

### The output-size formula

<div class="formula">

| Formula | Meaning |
|---|---|
| O = ⌊(W − K + 2P) / S⌋ + 1 | W = input size, K = kernel size, P = padding, S = stride, ⌊ ⌋ = round down |
| "Same" size with stride 1 | choose P = (K − 1) / 2 (P = 1 for 3 × 3, P = 2 for 5 × 5) |
| Parameters of a conv layer | (K × K × C_in + 1) × C_out |
| Output shape | (batch, C_out, O_h, O_w) |

</div>

Apply it to height and width separately (they are usually the same).

| Input W | Kernel K | Padding P | Stride S | Calculation | Output |
|---|---|---|---|---|---|
| 4 | 3 | 0 | 1 | (4 − 3 + 0)/1 + 1 | 2 |
| 4 | 2 | 0 | 2 | (4 − 2 + 0)/2 + 1 | 2 |
| 4 | 3 | 1 | 1 | (4 − 3 + 2)/1 + 1 | 4 |
| 32 | 5 | 0 | 1 | (32 − 5)/1 + 1 | 28 |
| 28 | 3 | 1 | 2 | ⌊(28 − 3 + 2)/2⌋ + 1 = ⌊13.5⌋ + 1 | 14 |
| 224 | 7 | 3 | 2 | ⌊(224 − 7 + 6)/2⌋ + 1 = ⌊111.5⌋ + 1 | 112 (ResNet's first layer) |
| 112 | 3 (max pool) | 1 | 2 | ⌊(112 − 3 + 2)/2⌋ + 1 = ⌊55.5⌋ + 1 | 56 |

> **Interview tip:** Say the formula out loud before computing: "output equals input minus kernel plus two times padding, divided by stride, plus one". Then do the arithmetic. If the division is not exact, PyTorch rounds down.

## Channels and filters

Real images have 3 **channels** (red, green, blue). A filter for a 3-channel input is really 3 × 3 × 3: it has one 3 × 3 slice per input channel, and it adds up the results of all slices (plus one bias) into **one** number per position. So **one filter produces one output channel**.

To detect many patterns, a layer has many filters. A layer with 16 filters produces 16 output channels (16 feature maps). The next layer's filters then have depth 16.

**Worked example: parameter count.** `nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3)`:

- Each filter: 3 × 3 × 3 = 27 weights + 1 bias = 28
- 16 filters: 16 × 28 = **448** parameters

The count does **not** depend on the image size. The same 448 parameters work on a 32 × 32 or a 1024 × 1024 image. Compare with the 150 million weights of the dense layer earlier.

A **1 × 1 convolution** has K = 1: at each pixel it mixes the channels with a small dense layer. It is used to change the number of channels cheaply (for example 256 → 64), as in Inception and ResNet "bottleneck" blocks.

## Pooling

A **pooling** layer shrinks a feature map by summarizing small regions. It has **no learned parameters**.

- **Max pooling** takes the largest value in each window: "was the pattern present anywhere here?"
- **Average pooling** takes the mean.

**Worked example: 2 × 2 max pooling with stride 2 on X.**

| Window | Values | Max | Average |
|---|---|---|---|
| top-left | 3, 1, 4, 2 | 4 | 2.5 |
| top-right | 0, 2, 1, 0 | 2 | 0.75 |
| bottom-left | 5, 3, 2, 4 | 5 | 3.5 |
| bottom-right | 0, 1, 1, 3 | 3 | 1.25 |

Max pooling gives [[4, 2], [5, 3]]; average pooling gives [[2.5, 0.75], [3.5, 1.25]].

Why pool?

- Halves height and width, so later layers are 4× cheaper.
- Gives a little **translation invariance**: a feature moved by one pixel usually lands in the same window and gives the same max.
- Increases the **receptive field**: the region of the original image that one neuron "sees". After a few conv + pool layers, a single neuron depends on a large part of the image, so it can detect large objects.

**Global average pooling** averages each whole feature map to one number. A 512 × 7 × 7 tensor becomes 512 numbers, ready for the final classifier. Modern CNNs use it instead of big dense layers, which saves millions of parameters. In PyTorch: `nn.AdaptiveAvgPool2d(1)`.

Many modern architectures replace max pooling with stride-2 convolutions, which learn how to downsample.

## A complete CNN, shapes traced

A typical CNN repeats a block of [convolution → (batch norm) → ReLU → pooling], making the feature maps smaller and the channels deeper, then ends with a classifier.

<figure>
<svg viewBox="0 0 440 190" width="440" height="190" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="10" y="30" width="90" height="50" rx="8" />
<text x="55" y="51" text-anchor="middle" fill="currentColor" stroke="none">Image</text>
<text x="55" y="68" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">1×28×28</text>
<line x1="100" y1="55" x2="118" y2="55" />
<rect x="118" y="30" width="90" height="50" rx="8" stroke="var(--accent)" />
<text x="163" y="51" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Conv+ReLU</text>
<text x="163" y="68" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">32×28×28</text>
<line x1="208" y1="55" x2="226" y2="55" />
<rect x="226" y="30" width="90" height="50" rx="8" />
<text x="271" y="51" text-anchor="middle" fill="currentColor" stroke="none">MaxPool</text>
<text x="271" y="68" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">32×14×14</text>
<line x1="316" y1="55" x2="334" y2="55" />
<rect x="334" y="30" width="90" height="50" rx="8" stroke="var(--accent)" />
<text x="379" y="51" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Conv+ReLU</text>
<text x="379" y="68" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">64×14×14</text>
<line x1="379" y1="80" x2="379" y2="100" />
<line x1="379" y1="100" x2="55" y2="100" />
<line x1="55" y1="100" x2="55" y2="120" />
<polygon points="50,112 55,122 60,112" fill="currentColor" />
<rect x="10" y="122" width="90" height="50" rx="8" />
<text x="55" y="143" text-anchor="middle" fill="currentColor" stroke="none">MaxPool</text>
<text x="55" y="160" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">64×7×7</text>
<line x1="100" y1="147" x2="118" y2="147" />
<rect x="118" y="122" width="90" height="50" rx="8" />
<text x="163" y="143" text-anchor="middle" fill="currentColor" stroke="none">Flatten</text>
<text x="163" y="160" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">3136</text>
<line x1="208" y1="147" x2="226" y2="147" />
<rect x="226" y="122" width="90" height="50" rx="8" />
<text x="271" y="143" text-anchor="middle" fill="currentColor" stroke="none">Dense+ReLU</text>
<text x="271" y="160" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">128</text>
<line x1="316" y1="147" x2="334" y2="147" />
<rect x="334" y="122" width="90" height="50" rx="8" />
<text x="379" y="143" text-anchor="middle" fill="currentColor" stroke="none">Dense</text>
<text x="379" y="160" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">10 logits</text>
<text x="220" y="18" text-anchor="middle" fill="currentColor" stroke="none">feature extractor: smaller maps, more channels</text>
<text x="220" y="186" text-anchor="middle" fill="currentColor" stroke="none">classifier head</text>
</svg>
<figcaption>A small CNN for 28×28 digits. Convolutions add channels, pooling halves height and width, and dense layers at the end turn the features into class scores.</figcaption>
</figure>

```python
import torch
from torch import nn

class SmallCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1),   # (B, 1, 28, 28) -> (B, 32, 28, 28)
            nn.ReLU(),
            nn.MaxPool2d(2),                              # -> (B, 32, 14, 14)
            nn.Conv2d(32, 64, kernel_size=3, padding=1),  # -> (B, 64, 14, 14)
            nn.ReLU(),
            nn.MaxPool2d(2),                              # -> (B, 64, 7, 7)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),                                 # -> (B, 3136)
            nn.Linear(64 * 7 * 7, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes),                  # -> (B, 10) logits
        )

    def forward(self, x):
        return self.classifier(self.features(x))

model = SmallCNN()
x = torch.randn(8, 1, 28, 28)                 # a fake batch of 8 images
print(model(x).shape)                          # torch.Size([8, 10])
print(sum(p.numel() for p in model.parameters()))   # 421642
```

Parameter count by hand:

| Layer | Calculation | Parameters |
|---|---|---|
| Conv 1 → 32, 3 × 3 | (3·3·1 + 1) × 32 | 320 |
| Conv 32 → 64, 3 × 3 | (3·3·32 + 1) × 64 | 18,496 |
| Dense 3136 → 128 | 3136 × 128 + 128 | 401,536 |
| Dense 128 → 10 | 128 × 10 + 10 | 1,290 |
| Total | | 421,642 |

Notice that 95% of the parameters are in the first dense layer, not in the convolutions. That is why modern CNNs use global average pooling before a single small dense layer. You can train this model with exactly the loop from [Building and Training a Model in PyTorch](/interview/ai-engineer/deep-learning/building-and-training-a-model-in-pytorch); on MNIST it usually reaches about 99% test accuracy.

> **Common mistake:** Getting the input size of the first `nn.Linear` wrong after the conv layers. Either compute it with the output-size formula, pass a dummy tensor through `self.features` and print the shape, or use `nn.LazyLinear(128)`, which infers the input size on the first call.

## What CNN layers learn

Visualization studies of trained CNNs show a clear hierarchy:

| Depth | What filters respond to |
|---|---|
| First layers | edges at different angles, colour blobs |
| Middle layers | corners, textures, simple shapes, repeating patterns |
| Deep layers | object parts: eyes, wheels, letters, leaves |
| Last layers | whole objects and scenes |

This hierarchy is why pretrained CNNs transfer so well to new tasks: early-layer features are useful for almost any image (see [Transfer Learning and Pretrained Models](/interview/ai-engineer/deep-learning/transfer-learning-and-pretrained-models)).

## Famous architectures (a short history)

| Year | Model | Key idea |
|---|---|---|
| 1998 | LeNet-5 | early CNN for digit recognition (bank cheques) |
| 2012 | AlexNet | deep CNN on GPUs with ReLU and dropout; won ImageNet by a big margin and started the deep learning boom |
| 2014 | VGG | only 3 × 3 convolutions, stacked deep; simple and uniform |
| 2014 | GoogLeNet / Inception | parallel branches with different kernel sizes, 1 × 1 bottlenecks |
| 2015 | ResNet | skip connections; trained networks with 100+ layers |
| 2019 | EfficientNet | scales depth, width and resolution together |
| 2020 | Vision Transformer (ViT) | splits the image into patches and uses a Transformer instead of convolutions |
| 2022 | ConvNeXt | a modernized CNN that matches ViTs using ideas borrowed from them |

Two stacked 3 × 3 convolutions see a 5 × 5 region, and three see 7 × 7, with fewer parameters than one large filter (for C channels: 2 × 9C² = 18C² vs 25C²) and more non-linearities. That is VGG's insight, and why 3 × 3 is the default kernel size.

## ResNet and skip connections

By 2015, people expected deeper networks to be better. But a plain 56-layer CNN had **higher training error** than a 20-layer one. This was not overfitting (training error was worse too); the deeper network was simply harder to optimize. This is called the **degradation problem**.

**ResNet** (He et al., 2015) added **skip connections** (also called **residual connections** or **shortcuts**). Instead of a block learning the full output H(x), it learns only the change F(x), and the input is added back:

<div class="formula">

| Formula | Meaning |
|---|---|
| y = F(x) + x | output = what the block learned + the original input |
| ∂y/∂x = ∂F/∂x + 1 | the "+ 1" gives the gradient a direct path backward |

</div>

Why this works:

- **Easy to do nothing.** If a layer is not useful, the block only has to learn F(x) = 0 (weights near zero) to pass x through unchanged. In a plain network, learning the exact identity is surprisingly hard. So adding layers can no longer make things worse.
- **Gradient highway.** In backprop, the "+ 1" means the gradient reaches early layers through the shortcut without being multiplied by many small factors. This fights vanishing gradients (see [Loss Functions and Backpropagation](/interview/ai-engineer/deep-learning/loss-functions-and-backpropagation)).

> **Real-life example:** Editing a document with "track changes". Instead of rewriting the whole essay at every review, each reviewer only adds small corrections on top of the existing text. If a reviewer has nothing to add, the essay passes through unchanged.

```python
class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(channels)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(channels)

    def forward(self, x):
        out = torch.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        return torch.relu(out + x)          # the skip connection: add the input back

block = ResidualBlock(64)
print(block(torch.randn(2, 64, 14, 14)).shape)   # torch.Size([2, 64, 14, 14])
```

`out + x` needs both to have the same shape. When a block changes the number of channels or uses stride 2, the shortcut uses a 1 × 1 convolution with the same stride to match shapes.

Residual connections are now everywhere: every Transformer layer (BERT, GPT, Llama) wraps attention and the feed-forward network in them (see [The Transformer Architecture](/interview/ai-engineer/nlp-transformers/the-transformer-architecture)).

## CNNs beyond classification

| Task | Output | Example models |
|---|---|---|
| Image classification | one label per image | ResNet, EfficientNet |
| Object detection | boxes + labels | YOLO family, Faster R-CNN |
| Semantic segmentation | a label for every pixel | U-Net, DeepLab |
| Face recognition / similarity | an embedding vector per image | FaceNet-style networks |
| 1-D signals | labels or values for audio, sensor data, ECG | 1-D CNNs (`nn.Conv1d`) |

## Key terms

| Term | Simple meaning |
|---|---|
| CNN | Neural network built from convolution layers |
| Filter / kernel | A small grid of learned weights slid over the input |
| Convolution | Slide, multiply and add to make a feature map |
| Cross-correlation | Convolution without flipping the filter; what DL libraries compute |
| Feature map | The output grid of one filter |
| Local connectivity | Each output depends only on a small patch |
| Weight sharing | The same filter is used at every position |
| Translation equivariance | Shifting the input shifts the feature map the same way |
| Translation invariance | Output does not change when the input shifts a little |
| Stride | How many pixels the filter moves each step |
| Padding | Extra border (usually zeros) added around the input |
| Same / valid padding | Keep the size / no padding |
| Channel | One "layer" of a tensor, like R, G, B, or one feature map |
| 1 × 1 convolution | Mixes channels at each pixel; changes channel count |
| Pooling | Summarize regions (max or average) to shrink the map |
| Global average pooling | Average each whole feature map into one number |
| Receptive field | Region of the original input that affects one neuron |
| Degradation problem | Deeper plain networks training worse than shallower ones |
| Skip / residual connection | Adding a block's input to its output |
| ResNet | CNN family built from residual blocks |

## Interview questions

**Why are CNNs better than MLPs for images?**
They use local connectivity and weight sharing: each filter looks at a small patch and is reused across the whole image. This cuts parameters enormously, builds in the fact that nearby pixels are related, and lets a pattern learned in one place be detected anywhere. MLPs ignore spatial structure and need far more parameters and data.

**What is the output size of a convolution?**
O = ⌊(W − K + 2P)/S⌋ + 1. For example, a 224 input with a 7 × 7 kernel, padding 3 and stride 2 gives ⌊223/2⌋ + 1 = 112. A 3 × 3 kernel with padding 1 and stride 1 keeps the size the same.

**How many parameters does `nn.Conv2d(64, 128, kernel_size=3)` have?**
Each filter has 3 × 3 × 64 = 576 weights plus 1 bias, and there are 128 filters: 577 × 128 = 73,856. It does not depend on the image size.

**What does pooling do and why use it?**
Pooling reduces height and width by taking the max or average of small windows, with no learned parameters. It cuts computation, adds a little translation invariance and grows the receptive field so deeper layers see more of the image. Many modern networks use stride-2 convolutions instead.

**What are padding and stride for?**
Padding adds a border so the output does not shrink and edge pixels are used fully; "same" padding keeps the size. Stride sets the step size; stride 2 halves the output size, which is a way to downsample.

**What is a 1 × 1 convolution used for?**
It acts as a small dense layer applied at every pixel, mixing information across channels without looking at neighbours. It is used to reduce or increase the number of channels cheaply, as in bottleneck blocks of ResNet and Inception.

**Explain ResNet's skip connections and why they help.**
A residual block outputs F(x) + x, so it only needs to learn a correction to its input. If a block is not needed, it can learn F ≈ 0 and pass x through, so extra depth does not hurt. In backprop the identity path adds 1 to the local derivative, giving gradients a direct path to early layers and preventing vanishing gradients.

**What is the receptive field, and how do you increase it?**
It is the region of the input image that influences one neuron. Stacking more conv layers, using pooling or strided convolutions, larger kernels, or dilated convolutions all increase it. Deep neurons need a large receptive field to recognize large objects.

**Why use two 3 × 3 convolutions instead of one 5 × 5?**
Two stacked 3 × 3 layers cover the same 5 × 5 receptive field with fewer parameters (18C² vs 25C² for C channels) and add an extra non-linearity, which makes the function more expressive. VGG popularized this design.

**Are CNNs still relevant now that Vision Transformers exist?**
Yes. CNNs are efficient, need less data because of their built-in assumptions about images, and run well on edge devices. ViTs often win with very large datasets and pretraining. Modern CNNs like ConvNeXt are competitive, and many production vision systems still use CNN backbones.

## Try it yourself

1. Convolve the input [[1, 2, 3], [4, 5, 6], [7, 8, 9]] with the 2 × 2 filter [[1, 0], [0, −1]] (stride 1, no padding). *Hint:* the output is 2 × 2; each value is top-left minus bottom-right of its patch.
2. Compute the output size and parameter count for `nn.Conv2d(3, 64, kernel_size=5, stride=2, padding=2)` on a 128 × 128 RGB image. *Hint:* ⌊(128 − 5 + 4)/2⌋ + 1.
3. Trace the shapes of a 64 × 64 RGB image through: Conv(3→16, 3, p=1) → MaxPool(2) → Conv(16→32, 3, p=1) → MaxPool(2) → Flatten. What size must the next `nn.Linear` accept? *Hint:* pooling halves height and width.
4. Use the NumPy `conv2d` function above to apply the horizontal edge filter [[1, 1, 1], [0, 0, 0], [−1, −1, −1]] to the 4 × 4 input X from this chapter. *Hint:* it computes "top row minus bottom row" of each patch.

### Answers

1. Patches: [[1, 2], [4, 5]] → 1 − 5 = −4; [[2, 3], [5, 6]] → 2 − 6 = −4; [[4, 5], [7, 8]] → 4 − 8 = −4; [[5, 6], [8, 9]] → 5 − 9 = −4. Output [[−4, −4], [−4, −4]]: the image brightens evenly towards the bottom-right, so every patch gives the same answer.
2. Output: ⌊127/2⌋ + 1 = 63 + 1 = 64, so (64, 64, 64) as C × H × W. Parameters: (5·5·3 + 1) × 64 = 76 × 64 = 4,864.
3. (3, 64, 64) → conv → (16, 64, 64) → pool → (16, 32, 32) → conv → (32, 32, 32) → pool → (32, 16, 16) → flatten → 32 × 16 × 16 = 8,192. So `nn.Linear(8192, ...)`.
4. Position (0, 0): top row 3 + 1 + 0 = 4, bottom row 5 + 3 + 0 = 8, so 4 − 8 = −4. (0, 1): (1 + 0 + 2) − (3 + 0 + 1) = 3 − 4 = −1. (1, 0): (4 + 2 + 1) − (2 + 4 + 1) = 7 − 7 = 0. (1, 1): (2 + 1 + 0) − (4 + 1 + 3) = 3 − 8 = −5. Output [[−4, −1], [0, −5]].

**Next:** [Recurrent Networks and LSTM](/interview/ai-engineer/deep-learning/recurrent-networks-and-lstm)
