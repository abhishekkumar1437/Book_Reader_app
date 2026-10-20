---
title: From Neuron to Neural Network
part: Neural Network Basics
summary: What a single artificial neuron computes, how neurons stack into layers, a full forward pass by hand on a 2-2-1 network with real numbers, why depth helps, and the universal approximation idea.
---

Every deep learning model you will meet as an AI engineer, from an image classifier to a large language model, is built from one small unit repeated millions of times: the artificial neuron. In this chapter you learn exactly what that unit computes, how many of them join into a network, and how to push numbers through a network by hand. If you can do the forward pass on paper, every later chapter (backpropagation, PyTorch, CNNs, Transformers) becomes much easier.

> **In simple words:** A neuron multiplies each input by a weight, adds them up, adds a bias, and passes the result through a simple function. A neural network is many neurons arranged in layers, where the outputs of one layer become the inputs of the next.

## Why neural networks exist

In classical machine learning (see [What is Machine Learning](/interview/ai-engineer/machine-learning/what-is-machine-learning)) you often design the **features** yourself. A feature is a useful number that describes the input, such as "number of rooms" for a house. For a house price model this works well. For a photo of a cat, it does not. What feature would you write by hand for "has whiskers"? The raw input is just a grid of pixel numbers.

Neural networks solve this problem. They take raw numbers (pixels, audio samples, token IDs) and **learn their own features** in their hidden layers. The early layers learn simple patterns (edges), the later layers combine them into complex patterns (eyes, faces). This ability to learn features is called **representation learning**, and it is the main reason deep learning took over vision, speech and language after about 2012.

| | Classical ML | Deep learning |
|---|---|---|
| Features | Designed by humans | Learned from data |
| Best data type | Tables (rows and columns) | Images, text, audio, video |
| Data needed | Hundreds to thousands of rows | Usually thousands to millions of examples |
| Compute | A laptop CPU | Often a GPU |
| Interpretability | Often easier | Harder |

> **Interview tip:** If asked "when would you not use deep learning?", say: for small tabular datasets, gradient-boosted trees (XGBoost, LightGBM) usually win, train faster and are easier to explain. Deep learning shines on unstructured data and very large datasets.

## The artificial neuron

A neuron takes some numbers in and gives one number out. It does three steps:

1. Multiply each input xᵢ by its own **weight** wᵢ. A weight says how important that input is. A large positive weight means "this input pushes the output up strongly". A negative weight means "this input pushes the output down".
2. Add all those products together, and add one extra number called the **bias** b. The bias lets the neuron shift its output up or down even when all inputs are zero. This sum is often called z, the **pre-activation**.
3. Pass z through an **activation function** f. The result a = f(z) is the neuron's output, called the **activation**.

<div class="formula">

| Formula | Meaning |
|---|---|
| z = w₁x₁ + w₂x₂ + … + wₙxₙ + b = w · x + b | weighted sum plus bias (a dot product) |
| a = f(z) | apply the activation function |

</div>

<figure>
<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<circle cx="40" cy="40" r="16" />
<text x="40" y="45" text-anchor="middle" fill="currentColor" stroke="none">x₁</text>
<circle cx="40" cy="100" r="16" />
<text x="40" y="105" text-anchor="middle" fill="currentColor" stroke="none">x₂</text>
<circle cx="40" cy="160" r="16" />
<text x="40" y="165" text-anchor="middle" fill="currentColor" stroke="none">x₃</text>
<line x1="56" y1="44" x2="186" y2="92" />
<line x1="56" y1="100" x2="184" y2="100" />
<line x1="56" y1="156" x2="186" y2="108" />
<text x="110" y="58" fill="var(--accent)" stroke="none" font-weight="bold">w₁</text>
<text x="110" y="94" fill="var(--accent)" stroke="none" font-weight="bold">w₂</text>
<text x="110" y="150" fill="var(--accent)" stroke="none" font-weight="bold">w₃</text>
<circle cx="210" cy="100" r="26" />
<text x="210" y="106" text-anchor="middle" fill="currentColor" stroke="none" font-size="18">Σ</text>
<text x="210" y="150" text-anchor="middle" fill="currentColor" stroke="none">+ b (bias)</text>
<line x1="236" y1="100" x2="276" y2="100" />
<text x="256" y="92" text-anchor="middle" fill="currentColor" stroke="none">z</text>
<rect x="276" y="80" width="50" height="40" rx="8" />
<text x="301" y="105" text-anchor="middle" fill="currentColor" stroke="none">f(z)</text>
<line x1="326" y1="100" x2="380" y2="100" />
<polygon points="380,95 390,100 380,105" fill="currentColor" />
<text x="402" y="105" text-anchor="middle" fill="currentColor" stroke="none">a</text>
</svg>
<figcaption>One neuron: each input is multiplied by its weight, the products and the bias are summed into z, and the activation function f turns z into the output a.</figcaption>
</figure>

> **Real-life example:** Deciding whether to go to a cricket match. Inputs: ticket price, weather, whether your friend is coming. Each input has a weight in your mind (friend coming matters a lot, price matters a little). You add it all up, and if the total is high enough, you go. The bias is your general mood: some people say yes easily (high bias), some rarely (low bias).

### The perceptron

The very first neuron design (Frank Rosenblatt, 1958) was the **perceptron**. Its activation function is a **step function**: output 1 if z > 0, else 0. It is a yes/no decider.

**Worked example.** Predict if a student passes an exam. Inputs: x₁ = hours studied, x₂ = hours slept. Weights w₁ = 1.5, w₂ = 0.5, bias b = −8.

Student A studied 4 hours and slept 7 hours:

- z = 1.5 × 4 + 0.5 × 7 + (−8)
- z = 6 + 3.5 − 8 = 1.5
- 1.5 > 0, so the output is **1 (pass)**.

Student B studied 2 hours and slept 8 hours:

- z = 1.5 × 2 + 0.5 × 8 − 8 = 3 + 4 − 8 = −1
- −1 is not > 0, so the output is **0 (fail)**.

Notice that studying has a bigger weight than sleeping, so it moves the decision more. Training a network means finding good values for these weights and biases automatically.

> **Common mistake:** Saying a neuron "is" logistic regression or "is" a perceptron. A neuron with a sigmoid activation computes exactly what [logistic regression](/interview/ai-engineer/machine-learning/logistic-regression) computes. A neuron with a step activation is a perceptron. But modern hidden neurons usually use ReLU, which is neither.

### Weights and biases are the parameters

The weights and biases are called the model's **parameters**. They are the numbers the model learns. When people say "a 7-billion-parameter model", they mean 7 billion of these numbers. Everything else, like the number of layers or the learning rate, is a **hyperparameter**: a setting you choose before training, not learned from data.

## From one neuron to a layer to a network

One neuron draws one straight line (or, in many dimensions, one flat **hyperplane**) through the data. That is too simple for most problems. So we use many neurons.

- A **layer** is a group of neurons that all receive the same inputs. Each neuron in the layer has its own weights and bias, so each one learns to detect a different pattern.
- The **input layer** is just your data. It does no computing.
- **Hidden layers** sit in the middle. We call them hidden because we never see their correct values in the data; the network decides what they should mean.
- The **output layer** gives the final answer, such as a price or class probabilities.

When every neuron in a layer connects to every neuron in the next layer, it is called a **fully connected layer** or **dense layer**. In PyTorch it is `nn.Linear`. A network of dense layers is called a **multi-layer perceptron (MLP)** or a **feed-forward network**, because data flows forward only, from input to output, with no loops.

Computing the outputs layer by layer, from input to output, is called the **forward pass**.

### A layer as a matrix multiply

Doing every neuron one at a time is slow. Instead, put all the weights of a layer into a matrix W. Row j of W holds the weights of neuron j. Then the whole layer is one line (see [Matrix Operations and NumPy](/interview/ai-engineer/math-for-ml/matrix-operations-and-numpy)):

<div class="formula">

| Formula | Shapes (layer with n inputs, m neurons) |
|---|---|
| z = W · x + b | W is m × n, x is n × 1, b is m × 1, z is m × 1 |
| a = f(z) | f is applied to each of the m numbers separately |
| For a batch of B examples: Z = X · Wᵀ + b | X is B × n, Z is B × m (this is what `nn.Linear` does) |

</div>

GPUs are extremely good at matrix multiplication. That is the hardware reason deep learning became practical.

## Forward pass by hand: a 2-2-1 network

Let us compute a full forward pass with real numbers. The network has **2 inputs**, **2 hidden neurons** with the **ReLU** activation, and **1 output neuron** with the **sigmoid** activation.

- **ReLU** (Rectified Linear Unit): ReLU(z) = max(0, z). Negative numbers become 0, positive numbers pass unchanged.
- **Sigmoid**: σ(z) = 1 / (1 + e⁻ᶻ). It squashes any number into the range 0 to 1, so we can read the output as a probability.

Think of it as a model that predicts whether a Flipkart customer will buy a product (output near 1) or not (near 0), from two scaled features.

<figure>
<svg viewBox="0 0 420 240" width="420" height="240" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<circle cx="60" cy="70" r="18" />
<text x="60" y="75" text-anchor="middle" fill="currentColor" stroke="none">x₁=1</text>
<circle cx="60" cy="170" r="18" />
<text x="60" y="175" text-anchor="middle" fill="currentColor" stroke="none">x₂=2</text>
<circle cx="210" cy="70" r="20" />
<text x="210" y="75" text-anchor="middle" fill="currentColor" stroke="none">h₁</text>
<circle cx="210" cy="170" r="20" />
<text x="210" y="175" text-anchor="middle" fill="currentColor" stroke="none">h₂</text>
<circle cx="360" cy="120" r="20" />
<text x="360" y="125" text-anchor="middle" fill="currentColor" stroke="none">ŷ</text>
<line x1="78" y1="70" x2="190" y2="70" />
<line x1="76" y1="160" x2="192" y2="80" />
<line x1="76" y1="80" x2="192" y2="160" />
<line x1="78" y1="170" x2="190" y2="170" />
<line x1="230" y1="76" x2="341" y2="113" />
<line x1="230" y1="164" x2="341" y2="127" />
<text x="130" y="62" text-anchor="middle" fill="var(--accent)" stroke="none">0.5</text>
<text x="96" y="108" text-anchor="middle" fill="var(--accent)" stroke="none">−0.3</text>
<text x="96" y="140" text-anchor="middle" fill="var(--accent)" stroke="none">0.4</text>
<text x="130" y="188" text-anchor="middle" fill="var(--accent)" stroke="none">0.6</text>
<text x="290" y="84" text-anchor="middle" fill="var(--accent)" stroke="none">0.8</text>
<text x="290" y="166" text-anchor="middle" fill="var(--accent)" stroke="none">−0.5</text>
<text x="210" y="36" text-anchor="middle" fill="currentColor" stroke="none">b₁ = 0.1</text>
<text x="210" y="212" text-anchor="middle" fill="currentColor" stroke="none">b₂ = −0.2</text>
<text x="360" y="90" text-anchor="middle" fill="currentColor" stroke="none">b = 0.1</text>
<text x="60" y="230" text-anchor="middle" fill="currentColor" stroke="none">input</text>
<text x="210" y="232" text-anchor="middle" fill="currentColor" stroke="none">hidden (ReLU)</text>
<text x="360" y="160" text-anchor="middle" fill="currentColor" stroke="none">output (σ)</text>
</svg>
<figcaption>The 2-2-1 network used in this chapter and in the backpropagation chapter. Weights are on the lines, biases next to the neurons.</figcaption>
</figure>

The parameters are:

| Connection | Weight |
|---|---|
| x₁ → h₁ | 0.5 |
| x₂ → h₁ | 0.4 |
| x₁ → h₂ | −0.3 |
| x₂ → h₂ | 0.6 |
| h₁ → ŷ | 0.8 |
| h₂ → ŷ | −0.5 |

Biases: b₁ = 0.1 (for h₁), b₂ = −0.2 (for h₂), b = 0.1 (for the output). Input: x₁ = 1, x₂ = 2.

**Step 1: hidden neuron h₁.**

- z₁ = 0.5 × 1 + 0.4 × 2 + 0.1
- z₁ = 0.5 + 0.8 + 0.1 = **1.4**
- h₁ = ReLU(1.4) = max(0, 1.4) = **1.4**

**Step 2: hidden neuron h₂.**

- z₂ = (−0.3) × 1 + 0.6 × 2 + (−0.2)
- z₂ = −0.3 + 1.2 − 0.2 = **0.7**
- h₂ = ReLU(0.7) = **0.7**

**Step 3: output neuron.**

- z = 0.8 × 1.4 + (−0.5) × 0.7 + 0.1
- z = 1.12 − 0.35 + 0.1 = **0.87**
- ŷ = σ(0.87) = 1 / (1 + e⁻⁰·⁸⁷) = 1 / (1 + 0.4190) = 1 / 1.4190 ≈ **0.7047**

The network says there is about a 70% chance the customer buys. If the true answer is "buys" (y = 1), the network is somewhat right but not confident. In [Loss Functions and Backpropagation](/interview/ai-engineer/deep-learning/loss-functions-and-backpropagation) we will measure how wrong it is and fix the weights, using this same network.

**The same thing in matrix form.**

- W₁ = [[0.5, 0.4], [−0.3, 0.6]], x = [1, 2], b₁ = [0.1, −0.2]
- W₁ · x = [0.5·1 + 0.4·2, −0.3·1 + 0.6·2] = [1.3, 0.9]
- z = [1.3 + 0.1, 0.9 − 0.2] = [1.4, 0.7], so h = ReLU(z) = [1.4, 0.7]
- Output: [0.8, −0.5] · [1.4, 0.7] + 0.1 = 0.87, and σ(0.87) ≈ 0.7047

> **Remember:** Forward pass = for each layer, z = W·x + b, then a = f(z). Repeat until the last layer.

### The same forward pass in NumPy

```python
import numpy as np

def relu(z):
    return np.maximum(0, z)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

x  = np.array([1.0, 2.0])
W1 = np.array([[0.5, 0.4],      # row 0 = weights of h1
               [-0.3, 0.6]])    # row 1 = weights of h2
b1 = np.array([0.1, -0.2])
W2 = np.array([0.8, -0.5])      # weights from h1, h2 to the output
b2 = 0.1

z1 = W1 @ x + b1                # @ is matrix multiply
h  = relu(z1)
z2 = W2 @ h + b2
y_hat = sigmoid(z2)

print(z1, h, round(z2, 4), round(y_hat, 4))
# Output: [1.4 0.7] [1.4 0.7] 0.87 0.7047
```

### The same network in PyTorch

In PyTorch, `nn.Linear(in_features, out_features)` stores a weight of shape (out, in), exactly like our W₁.

```python
import torch
from torch import nn

model = nn.Sequential(
    nn.Linear(2, 2),   # input -> hidden: W1 is 2x2, b1 has 2 values
    nn.ReLU(),
    nn.Linear(2, 1),   # hidden -> output: W2 is 1x2, b2 has 1 value
    nn.Sigmoid(),
)

with torch.no_grad():                      # we are setting values, not training
    model[0].weight.copy_(torch.tensor([[0.5, 0.4], [-0.3, 0.6]]))
    model[0].bias.copy_(torch.tensor([0.1, -0.2]))
    model[2].weight.copy_(torch.tensor([[0.8, -0.5]]))
    model[2].bias.copy_(torch.tensor([0.1]))

x = torch.tensor([[1.0, 2.0]])             # a batch with 1 example
print(model(x))
# Output: tensor([[0.7047]], grad_fn=<SigmoidBackward0>)
```

You will learn `nn.Module`, `nn.Sequential` and `torch.no_grad()` properly in [PyTorch Tensors and Autograd](/interview/ai-engineer/deep-learning/pytorch-tensors-and-autograd) and [Building and Training a Model in PyTorch](/interview/ai-engineer/deep-learning/building-and-training-a-model-in-pytorch).

### Counting parameters

A dense layer with n inputs and m neurons has n × m weights plus m biases.

**Worked example.** An MLP for 28 × 28 grayscale digit images (784 pixels) with one hidden layer of 128 neurons and 10 outputs:

- Layer 1: 784 × 128 + 128 = 100,352 + 128 = 100,480
- Layer 2: 128 × 10 + 10 = 1,280 + 10 = 1,290
- Total: 100,480 + 1,290 = **101,770** parameters

> **Interview tip:** Parameter counting is a common quick question. Say the formula out loud, "inputs times outputs plus outputs for the bias", then compute.

## Why we need an activation function

What if we remove the activation and just stack linear layers? Layer 1 gives W₁x + b₁. Layer 2 gives W₂(W₁x + b₁) + b₂ = (W₂W₁)x + (W₂b₁ + b₂). That is just one new matrix times x plus one new bias. **Two linear layers collapse into one linear layer.** A hundred linear layers are still one straight line. The **non-linear** activation (like ReLU) is what stops the collapse and lets the network bend its decision boundary. The next chapter, [Activation Functions](/interview/ai-engineer/deep-learning/activation-functions), covers them in detail.

## Why depth helps

### XOR: the problem one neuron cannot solve

**XOR** ("exclusive or") outputs 1 when exactly one of two inputs is 1.

| x₁ | x₂ | XOR |
|---|---|---|
| 0 | 0 | 0 |
| 1 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 1 | 0 |

If you plot the four points, no single straight line separates the 1s from the 0s. A single perceptron draws one line, so it fails. This was a famous criticism of perceptrons in 1969.

A hidden layer with just 2 ReLU neurons solves it. Use h₁ = ReLU(x₁ + x₂), h₂ = ReLU(x₁ + x₂ − 1), and output y = h₁ − 2·h₂.

| x₁, x₂ | h₁ | h₂ | y = h₁ − 2h₂ |
|---|---|---|---|
| 0, 0 | 0 | ReLU(−1) = 0 | 0 − 0 = 0 |
| 1, 0 | 1 | ReLU(0) = 0 | 1 − 0 = 1 |
| 0, 1 | 1 | 0 | 1 |
| 1, 1 | 2 | ReLU(1) = 1 | 2 − 2 = 0 |

The hidden layer **re-describes** the inputs in a new space where the problem becomes easy. That is the core idea of all deep learning: each layer transforms the data into a representation that makes the next step easier.

### Depth vs width

- **Width** = how many neurons in a layer.
- **Depth** = how many layers.

Deep networks build features in a **hierarchy**: in an image model, layer 1 finds edges, layer 2 combines edges into corners and textures, layer 3 into parts like eyes or wheels, and later layers into whole objects. Re-using simple features to build complex ones is far more efficient than learning everything in one giant layer. In practice, a deep network with a moderate width usually needs far fewer parameters than a shallow, very wide network for the same accuracy.

Depth has a cost: deep networks are harder to train (gradients can vanish or explode, see [Loss Functions and Backpropagation](/interview/ai-engineer/deep-learning/loss-functions-and-backpropagation)). Tricks like ReLU, good initialization, normalization and skip connections made very deep networks trainable.

### Universal approximation (the intuition)

The **universal approximation theorem** says: a network with just **one hidden layer** and a non-linear activation can approximate **any continuous function** on a bounded range as closely as you want, **if it has enough hidden neurons**.

Intuition with ReLU: each ReLU neuron adds one "bend" to a line. With enough bends, you can trace any smooth curve, like drawing a circle with many short straight segments.

What the theorem does **not** say:

- It does not say how many neurons you need (it may be a huge number).
- It does not say that gradient descent will find the right weights.
- It does not say the network will generalize to new data.

So the theorem tells you neural networks are flexible enough. Depth, data and training tricks make them practical.

> **Interview tip:** A strong answer: "The universal approximation theorem guarantees that a wide enough single hidden layer can represent any continuous function, but it says nothing about learnability or efficiency. In practice deeper networks represent the same functions with far fewer parameters, which is why we go deep."

## Key terms

| Term | Simple meaning |
|---|---|
| Neuron | Unit that computes a weighted sum of inputs plus a bias, then applies an activation |
| Weight | A learned number that says how much one input matters |
| Bias | A learned number added to the sum, shifting the output |
| Pre-activation (z) | The weighted sum plus bias, before the activation function |
| Activation function | The function applied to z, such as ReLU or sigmoid |
| Activation (a) | The output of a neuron after the activation function |
| Perceptron | The original neuron with a step activation (output 0 or 1) |
| Parameters | All weights and biases; what the model learns |
| Hyperparameter | A setting you choose, like number of layers or learning rate |
| Layer | A group of neurons that share the same inputs |
| Hidden layer | A layer between input and output whose values are not given in the data |
| Dense / fully connected layer | Every input connects to every neuron (`nn.Linear`) |
| MLP / feed-forward network | A stack of dense layers, data flows one way |
| Forward pass | Computing the output from the input, layer by layer |
| Representation learning | The network learns its own useful features |
| XOR | A problem that is not linearly separable; needs a hidden layer |
| Universal approximation theorem | One wide hidden layer can approximate any continuous function |

## Interview questions

**What does a single neuron compute?**
It computes a weighted sum of its inputs plus a bias, z = w·x + b, and passes it through an activation function, a = f(z). The weights and the bias are learned during training. With a sigmoid activation this is exactly logistic regression.

**Why do we need a bias term?**
Without a bias, the neuron's output for an all-zero input is fixed at f(0), and its decision boundary must pass through the origin. The bias shifts the boundary so the neuron can fit data that is not centred at zero. It is like the intercept c in y = mx + c.

**What happens if you stack linear layers with no activation?**
They collapse into a single linear layer, because a product of matrices is just another matrix. The network can then only learn linear functions, no matter how deep it is. Non-linear activations are what give depth its power.

**Why can a single perceptron not learn XOR?**
A perceptron draws one straight line, and the XOR points cannot be separated by one line. Adding a hidden layer with two neurons lets the network map the points into a new space where they become linearly separable.

**How many parameters does a dense layer with 512 inputs and 256 outputs have?**
512 × 256 weights plus 256 biases: 131,072 + 256 = 131,328 parameters.

**What is the universal approximation theorem, and what are its limits?**
It says a feed-forward network with one hidden layer and a non-linear activation can approximate any continuous function on a bounded domain if it has enough neurons. It does not tell you how many neurons are needed, whether training will find the weights, or whether the model will generalize. It is a statement about capacity, not about learning.

**Why use deep networks instead of one very wide layer?**
Deep networks build features hierarchically, reusing simple features to make complex ones, which is much more parameter-efficient. Many functions that a deep network represents compactly would need an enormous number of neurons in a single layer. Depth also matches the structure of real data like images and language.

**Why are GPUs used for neural networks?**
Each layer is a large matrix multiplication, and matrix multiplication is made of many independent multiply-adds. GPUs have thousands of cores that do these in parallel, so they are often 10 to 100 times faster than CPUs for training.

**When would you not use a neural network?**
When data is small and tabular, when you need a simple explainable model, or when latency and cost limits are strict. Gradient-boosted trees or logistic regression are often better and cheaper in those cases.

## Try it yourself

1. Redo the 2-2-1 forward pass with input x₁ = 2, x₂ = 0 and the same weights. *Hint:* compute z₁ and z₂ first; check if ReLU sets one of them to 0.
2. Count the parameters of an MLP with layers 100 → 64 → 32 → 3. *Hint:* do each layer as inputs × outputs + outputs.
3. Write a NumPy function `forward(x, layers)` where `layers` is a list of `(W, b, activation)` tuples, and test it on the 2-2-1 network. *Hint:* loop over the list and keep updating `x`.
4. Show that two linear layers W₂(W₁x) with W₁ = [[1, 2], [0, 1]] and W₂ = [[1, 0], [1, 1]] equal one layer W·x. Find W. *Hint:* W = W₂ · W₁.

### Answers

1. z₁ = 0.5·2 + 0.4·0 + 0.1 = 1.1, h₁ = 1.1. z₂ = −0.3·2 + 0.6·0 − 0.2 = −0.8, so h₂ = ReLU(−0.8) = 0. Output z = 0.8·1.1 + (−0.5)·0 + 0.1 = 0.88 + 0.1 = 0.98. ŷ = σ(0.98) = 1 / (1 + e⁻⁰·⁹⁸) = 1 / (1 + 0.3753) ≈ 0.727. Note h₂ is switched off by ReLU for this input.
2. 100·64 + 64 = 6,464; 64·32 + 32 = 2,080; 32·3 + 3 = 99. Total = 8,643.
3. One solution:

```python
import numpy as np

def forward(x, layers):
    for W, b, act in layers:
        x = act(W @ x + b)
    return x

relu = lambda z: np.maximum(0, z)
sigmoid = lambda z: 1 / (1 + np.exp(-z))
layers = [
    (np.array([[0.5, 0.4], [-0.3, 0.6]]), np.array([0.1, -0.2]), relu),
    (np.array([[0.8, -0.5]]), np.array([0.1]), sigmoid),
]
print(forward(np.array([1.0, 2.0]), layers))   # Output: [0.70474...]
```

4. W = W₂ · W₁. Row 1: [1·1 + 0·0, 1·2 + 0·1] = [1, 2]. Row 2: [1·1 + 1·0, 1·2 + 1·1] = [1, 3]. So W = [[1, 2], [1, 3]]: one linear layer does the same job as two.

**Next:** [Activation Functions](/interview/ai-engineer/deep-learning/activation-functions)
