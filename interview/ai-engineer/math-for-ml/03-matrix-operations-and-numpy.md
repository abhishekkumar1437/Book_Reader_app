---
title: Matrix Operations and NumPy
part: Linear Algebra
summary: Matrix multiplication by hand and the shape rule, transpose, identity, the idea of an inverse, solving linear regression with matrices, broadcasting in NumPy, and how every neural network layer computes W·x + b.
---

In the last chapter you multiplied one vector by another. Real models do this for thousands of examples and thousands of weights at once, and the tool for that is **matrix multiplication**. Every dense layer in a neural network, every attention head in a Transformer, and the closed-form solution of linear regression are matrix multiplications. When your PyTorch code crashes with "mat1 and mat2 shapes cannot be multiplied", this chapter is what you need.

> **In simple words:** Matrix multiplication is many dot products done together: each row of the first matrix dotted with each column of the second. The inner sizes must match. A neural network layer is just `output = W · input + b`.

## Matrix times vector

Start with the simplest case. A matrix times a vector gives a vector. Each **row** of the matrix does one dot product with the vector.

**Worked example.**

```text
| 1  2 |   | 5 |   | 1×5 + 2×6 |   | 17 |
| 3  4 | · | 6 | = | 3×5 + 4×6 | = | 39 |
```

1. Row 1 [1, 2] · [5, 6] = 5 + 12 = **17**
2. Row 2 [3, 4] · [5, 6] = 15 + 24 = **39**

```python
import numpy as np

A = np.array([[1, 2],
              [3, 4]])
v = np.array([5, 6])
print(A @ v)    # Output: [17 39]
```

**Where in ML:** if each row of a matrix is one house and the vector is the weights, the result is one prediction per house. In chapter 1 you computed `X @ w + b` this way: 3 houses × 2 features times 2 weights gave 3 predictions.

## Matrix times matrix

To multiply **A** by **B**, take every row of **A** and dot it with every column of **B**. The answer at row i, column j is (row i of **A**) · (column j of **B**).

<figure>
<svg viewBox="0 0 430 150" width="430" height="150" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="14">
<rect x="20" y="30" width="90" height="80" rx="4" />
<rect x="24" y="36" width="82" height="30" rx="4" stroke="var(--accent)" stroke-width="2" />
<text x="45" y="56" text-anchor="middle" fill="currentColor" stroke="none">1</text><text x="85" y="56" text-anchor="middle" fill="currentColor" stroke="none">2</text>
<text x="45" y="96" text-anchor="middle" fill="currentColor" stroke="none">3</text><text x="85" y="96" text-anchor="middle" fill="currentColor" stroke="none">4</text>
<text x="65" y="130" text-anchor="middle" fill="currentColor" stroke="none">A (2×2)</text>
<text x="125" y="76" text-anchor="middle" fill="currentColor" stroke="none">·</text>
<rect x="140" y="30" width="90" height="80" rx="4" />
<rect x="146" y="34" width="38" height="72" rx="4" stroke="var(--accent)" stroke-width="2" />
<text x="165" y="56" text-anchor="middle" fill="currentColor" stroke="none">5</text><text x="205" y="56" text-anchor="middle" fill="currentColor" stroke="none">6</text>
<text x="165" y="96" text-anchor="middle" fill="currentColor" stroke="none">7</text><text x="205" y="96" text-anchor="middle" fill="currentColor" stroke="none">8</text>
<text x="185" y="130" text-anchor="middle" fill="currentColor" stroke="none">B (2×2)</text>
<text x="248" y="76" text-anchor="middle" fill="currentColor" stroke="none">=</text>
<rect x="265" y="30" width="100" height="80" rx="4" />
<rect x="270" y="36" width="44" height="30" rx="4" stroke="var(--accent)" stroke-width="2" />
<text x="292" y="56" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">19</text><text x="340" y="56" text-anchor="middle" fill="currentColor" stroke="none">22</text>
<text x="292" y="96" text-anchor="middle" fill="currentColor" stroke="none">43</text><text x="340" y="96" text-anchor="middle" fill="currentColor" stroke="none">50</text>
<text x="315" y="130" text-anchor="middle" fill="currentColor" stroke="none">C = A·B</text>
<text x="292" y="20" text-anchor="middle" fill="var(--accent)" stroke="none" font-size="12">1×5 + 2×7 = 19</text>
</svg>
<figcaption>Row 1 of A dotted with column 1 of B gives the entry at row 1, column 1 of the answer.</figcaption>
</figure>

**Worked example (2 × 2).**

```text
A = | 1  2 |     B = | 5  6 |
    | 3  4 |         | 7  8 |
```

1. C₁₁ = row 1 of A · column 1 of B = [1, 2] · [5, 7] = 5 + 14 = **19**
2. C₁₂ = row 1 of A · column 2 of B = [1, 2] · [6, 8] = 6 + 16 = **22**
3. C₂₁ = row 2 of A · column 1 of B = [3, 4] · [5, 7] = 15 + 28 = **43**
4. C₂₂ = row 2 of A · column 2 of B = [3, 4] · [6, 8] = 18 + 32 = **50**

```text
A · B = | 19  22 |
        | 43  50 |
```

**Worked example (2 × 3 times 3 × 2).**

```text
A = | 1  2  3 |      B = | 1  0 |
    | 4  5  6 |          | 0  1 |
                         | 2  1 |
```

1. Row 1 · column 1: [1, 2, 3] · [1, 0, 2] = 1 + 0 + 6 = **7**
2. Row 1 · column 2: [1, 2, 3] · [0, 1, 1] = 0 + 2 + 3 = **5**
3. Row 2 · column 1: [4, 5, 6] · [1, 0, 2] = 4 + 0 + 12 = **16**
4. Row 2 · column 2: [4, 5, 6] · [0, 1, 1] = 0 + 5 + 6 = **11**

Answer: a 2 × 2 matrix [[7, 5], [16, 11]].

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(A @ B)            # Output: [[19 22] [43 50]]
print(np.matmul(A, B))  # same thing

A2 = np.array([[1, 2, 3], [4, 5, 6]])
B2 = np.array([[1, 0], [0, 1], [2, 1]])
print(A2 @ B2)          # Output: [[ 7  5] [16 11]]
```

### The shape rule

<div class="formula">

| Rule | Example |
|---|---|
| (m × **n**) · (**n** × p) → (m × p) | (2 × 3) · (3 × 2) → (2 × 2) |
| Inner sizes must be equal | (2 × 3) · (2 × 3) → error |
| Outer sizes give the answer's shape | (64 × 20) · (20 × 1) → (64 × 1) |
| Cost: m × n × p multiply-adds | (1000 × 1000) · (1000 × 1000) → 1 billion |

</div>

> **Remember:** Write the shapes side by side. The two inner numbers must match and "cancel"; the two outer numbers are the result's shape. `(32, 784) @ (784, 128) → (32, 128)`.

### Order matters

For numbers, 3 × 5 = 5 × 3. For matrices, usually **A·B ≠ B·A**. Check with our example:

```text
B · A = | 5×1 + 6×3   5×2 + 6×4 |   | 23  34 |
        | 7×1 + 8×3   7×2 + 8×4 | = | 31  46 |
```

That is different from [[19, 22], [43, 50]]. Sometimes B·A is not even possible (shapes do not fit).

Matrix multiplication **is** associative: (A·B)·C = A·(B·C). This matters for speed: choosing the order with fewer multiplications can save a lot of time on large matrices.

> **Common mistake:** Assuming you can swap the order of a matrix product to "fix" a shape error. Swapping usually changes the meaning. Instead, check which dimension is which and use a transpose if needed.

## Transpose

The **transpose** of a matrix, written **A**ᵀ, swaps rows and columns. Row 1 becomes column 1. Shape (m × n) becomes (n × m).

```text
A = | 1  2  3 |      Aᵀ = | 1  4 |
    | 4  5  6 |           | 2  5 |
                          | 3  6 |
```

Useful facts:

- (**A**ᵀ)ᵀ = **A**
- (**A** · **B**)ᵀ = **B**ᵀ · **A**ᵀ (the order flips)
- The dot product of two column vectors can be written **a**ᵀ**b**.
- **X**ᵀ**X** for a data matrix **X** of shape (n, d) has shape (d, d). It appears in linear regression and PCA.

```python
A = np.array([[1, 2, 3], [4, 5, 6]])
print(A.T)          # Output: [[1 4] [2 5] [3 6]]
print(A.T.shape)    # Output: (3, 2)
```

**Where in ML:** in attention, scores are Q·Kᵀ: you transpose the key matrix so each query row can dot with each key row. In backpropagation, gradients flow backwards through a layer by multiplying with **W**ᵀ.

## Identity matrix

The **identity matrix** **I** is the matrix version of the number 1. It has 1s on the main diagonal and 0s everywhere else. Multiplying by it changes nothing: **I**·**A** = **A**·**I** = **A**.

```text
I₂ = | 1  0 |      I₂ · | 5 | = | 1×5 + 0×6 | = | 5 |
     | 0  1 |           | 6 |   | 0×5 + 1×6 |   | 6 |
```

A **diagonal matrix** has numbers only on the diagonal. It scales each coordinate separately:

```text
| 2  0 | · | 1 | = | 2 |      (x doubled, y tripled)
| 0  3 |   | 1 |   | 3 |
```

```python
I = np.eye(3)
print(I)
# Output:
# [[1. 0. 0.]
#  [0. 1. 0.]
#  [0. 0. 1.]]
D = np.diag([2, 3])
print(D @ np.array([1, 1]))   # Output: [2 3]
```

**Where in ML:** Ridge regression adds λ**I** to **X**ᵀ**X** to make it safely invertible. Residual (skip) connections in ResNets and Transformers compute `x + f(x)`, which you can think of as "identity plus a change".

## The inverse (idea)

For numbers, the inverse of 5 is 1/5 because 5 × 1/5 = 1. For a square matrix **A**, the **inverse** **A**⁻¹ is the matrix with **A**·**A**⁻¹ = **I**. It "undoes" what **A** does.

For a 2 × 2 matrix there is a short formula:

```text
A = | a  b |       A⁻¹ = 1/(ad − bc) × |  d  −b |
    | c  d |                           | −c   a |
```

The number ad − bc is the **determinant**. If it is 0, the matrix has **no inverse** (it is called **singular**). Geometrically, a zero determinant means the matrix squashes the plane flat onto a line, and you cannot un-squash it.

**Worked example.** **A** = [[4, 7], [2, 6]]

1. Determinant: 4 × 6 − 7 × 2 = 24 − 14 = **10**
2. Swap a and d, change signs of b and c: [[6, −7], [−2, 4]]
3. Divide by 10: **A**⁻¹ = [[0.6, −0.7], [−0.2, 0.4]]
4. Check row 1 of **A** times column 1 of **A**⁻¹: 4 × 0.6 + 7 × (−0.2) = 2.4 − 1.4 = 1. Good.

### Solving equations with matrices

Two equations:

```text
2a + 1b = 5
1a + 3b = 10
```

In matrix form: **M**·**x** = **c** with **M** = [[2, 1], [1, 3]], **x** = [a, b], **c** = [5, 10]. The solution is **x** = **M**⁻¹**c**.

1. det = 2 × 3 − 1 × 1 = 5
2. **M**⁻¹ = (1/5) × [[3, −1], [−1, 2]]
3. **M**⁻¹**c** = (1/5) × [3×5 − 1×10, −1×5 + 2×10] = (1/5) × [5, 15] = **[1, 3]**

So a = 1, b = 3. Check: 2 + 3 = 5 and 1 + 9 = 10. Correct.

```python
M = np.array([[2, 1], [1, 3]])
c = np.array([5, 10])
print(np.linalg.inv(M) @ c)     # Output: [1. 3.]
print(np.linalg.solve(M, c))    # Output: [1. 3.]  — faster and more accurate
print(np.linalg.det(M))         # Output: 5.000000000000001 (tiny float error)
```

> **Interview tip:** If asked how to solve **A**x = b in code, say "use `np.linalg.solve`, not `inv(A) @ b`". Computing the inverse is slower and less numerically stable. This shows practical experience.

### Linear regression with matrices (the normal equation)

Linear regression finds weights **w** that make **X****w** as close as possible to **y**. There is a direct formula, called the **normal equation**:

```text
w = (XᵀX)⁻¹ Xᵀ y
```

**Worked example.** Three points: (x, y) = (1, 2), (2, 4), (3, 5). We want y ≈ b + w·x. Add a column of 1s to **X** for the bias:

```text
X = | 1  1 |     y = | 2 |
    | 1  2 |         | 4 |
    | 1  3 |         | 5 |
```

1. **X**ᵀ**X** = [[1+1+1, 1+2+3], [1+2+3, 1+4+9]] = [[3, 6], [6, 14]]
2. det = 3 × 14 − 6 × 6 = 42 − 36 = 6, so (**X**ᵀ**X**)⁻¹ = (1/6) × [[14, −6], [−6, 3]]
3. **X**ᵀ**y** = [2 + 4 + 5, 1×2 + 2×4 + 3×5] = [11, 25]
4. **w** = (1/6) × [14×11 − 6×25, −6×11 + 3×25] = (1/6) × [154 − 150, −66 + 75] = (1/6) × [4, 9] = **[0.667, 1.5]**

The best line is **y = 0.667 + 1.5x**. Predictions: 2.17, 3.67, 5.17, close to 2, 4, 5.

```python
X = np.array([[1, 1], [1, 2], [1, 3]])
y = np.array([2, 4, 5])
w = np.linalg.solve(X.T @ X, X.T @ y)
print(w.round(3))     # Output: [0.667 1.5  ]
```

The normal equation is fine for small data, but inverting a d × d matrix costs about d³ operations, so for many features or huge data we use gradient descent instead. See [Linear Regression](/interview/ai-engineer/machine-learning/linear-regression).

## Broadcasting in NumPy

**Broadcasting** is NumPy's rule for doing element-wise operations on arrays of **different** shapes. The smaller array is "stretched" (virtually copied) to match the bigger one, without using extra memory.

The rule: compare shapes from the **right**. Two sizes are compatible if they are equal or one of them is 1 (or missing).

| Shape A | Shape B | Result | Why |
|---|---|---|---|
| (3, 2) | (2,) | (3, 2) | (2,) is treated as (1, 2), stretched to 3 rows |
| (3, 2) | (3, 1) | (3, 2) | the column is stretched across 2 columns |
| (3, 1) | (1, 4) | (3, 4) | both stretched: an "outer" table |
| (3, 2) | (3,) | error | rightmost sizes 2 and 3 do not match |

**Worked example: centring features.** Using the 3 houses:

```text
X = | 1000  2 |      column means = [1100, 2]
    | 1500  3 |
    |  800  1 |
```

`X − mean` subtracts [1100, 2] from **every** row:

```text
| 1000−1100  2−2 |   | −100   0 |
| 1500−1100  3−2 | = |  400   1 |
|  800−1100  1−2 |   | −300  −1 |
```

```python
X = np.array([[1000, 2], [1500, 3], [800, 1]], dtype=float)
mean = X.mean(axis=0)          # shape (2,) — mean of each column
std = X.std(axis=0)            # shape (2,)
print(X - mean)                # broadcasting: (3,2) - (2,)
# Output:
# [[-100.    0.]
#  [ 400.    1.]
#  [-300.   -1.]]
X_scaled = (X - mean) / std    # standard scaling, exactly what StandardScaler does
print(X_scaled.round(2))

# A row of scores minus a per-row value needs keepdims=True
scores = np.array([[1.0, 2.0, 3.0], [1.0, 1.0, 4.0]])
row_max = scores.max(axis=1, keepdims=True)   # shape (2, 1), not (2,)
print(scores - row_max)        # Output: [[-2. -1.  0.] [-3. -3.  0.]]
```

The last two lines are the first step of a numerically stable **softmax**: subtract the row maximum before taking exponentials.

> **Common mistake:** Forgetting `keepdims=True`. `scores.max(axis=1)` has shape (2,), and `(2, 3) − (2,)` fails (or, for a square matrix, silently subtracts along the wrong axis). Print shapes when in doubt.

**Where in ML:** adding the bias vector to a whole batch (`X @ W.T + b`) uses broadcasting. So do feature scaling, softmax, and attention masks.

## How a neural network layer is W·x + b

A **dense layer** (also called a **fully connected** or **linear** layer) with 3 inputs and 2 outputs has:

- a **weight matrix** **W** of shape (2, 3): one row per output neuron
- a **bias vector** **b** of shape (2,): one bias per output neuron

Each output neuron is one dot product (row of **W** · input) plus its bias. Doing all rows at once is a matrix-vector product.

<figure>
<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<circle cx="70" cy="50" r="18" /><circle cx="70" cy="100" r="18" /><circle cx="70" cy="150" r="18" />
<text x="70" y="55" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<text x="70" y="105" text-anchor="middle" fill="currentColor" stroke="none">2</text>
<text x="70" y="155" text-anchor="middle" fill="currentColor" stroke="none">3</text>
<text x="30" y="105" text-anchor="middle" fill="currentColor" stroke="none">x</text>
<circle cx="260" cy="70" r="22" stroke="var(--accent)" stroke-width="2" /><circle cx="260" cy="135" r="22" />
<line x1="88" y1="50" x2="238" y2="70" stroke="var(--accent)" /><line x1="88" y1="100" x2="238" y2="70" stroke="var(--accent)" /><line x1="88" y1="150" x2="238" y2="70" stroke="var(--accent)" />
<line x1="88" y1="50" x2="238" y2="135" /><line x1="88" y1="100" x2="238" y2="135" /><line x1="88" y1="150" x2="238" y2="135" />
<text x="260" y="75" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">2.3</text>
<text x="260" y="140" text-anchor="middle" fill="currentColor" stroke="none">−0.2</text>
<line x1="282" y1="70" x2="330" y2="70" /><line x1="282" y1="135" x2="330" y2="135" />
<text x="345" y="66" fill="currentColor" stroke="none">ReLU → 2.3</text>
<text x="345" y="131" fill="currentColor" stroke="none">ReLU → 0</text>
<text x="160" y="192" text-anchor="middle" fill="currentColor" stroke="none">6 weights (W is 2×3) + 2 biases</text>
</svg>
<figcaption>A layer with 3 inputs and 2 neurons. The highlighted neuron computes row 1 of W dotted with x, plus its bias.</figcaption>
</figure>

**Worked example.**

```text
W = | 0.2  −0.5   1.0 |     x = | 1 |     b = |  0.1 |
    | 0.7   0.1  −0.3 |         | 2 |         | −0.2 |
                                | 3 |
```

1. Neuron 1: 0.2 × 1 + (−0.5) × 2 + 1.0 × 3 = 0.2 − 1.0 + 3.0 = 2.2; plus 0.1 = **2.3**
2. Neuron 2: 0.7 × 1 + 0.1 × 2 + (−0.3) × 3 = 0.7 + 0.2 − 0.9 = 0.0; plus (−0.2) = **−0.2**
3. Apply the **ReLU** activation (replace negatives with 0): [2.3, 0]

The **activation function** adds non-linearity. Without it, stacking layers would just be one big matrix multiplication, because W₂(W₁x) = (W₂W₁)x. See [Activation Functions](/interview/ai-engineer/deep-learning/activation-functions).

### A batch of inputs

In practice you send a **batch** of examples at once. Put each example as a row of **X** (shape (batch, 3)). Then `X @ W.T + b` gives shape (batch, 2). The bias is broadcast to every row. PyTorch's `nn.Linear` computes exactly `x @ W.T + b`, with W stored as (out_features, in_features).

```python
W = np.array([[0.2, -0.5,  1.0],
              [0.7,  0.1, -0.3]])        # shape (2, 3) = (out, in)
b = np.array([0.1, -0.2])               # shape (2,)

x = np.array([1, 2, 3])
print(W @ x + b)                        # Output: [ 2.3 -0.2]

X = np.array([[1, 2, 3],                # batch of 2 examples, shape (2, 3)
              [0, 1, -1]])
Z = X @ W.T + b                         # (2,3) @ (3,2) -> (2,2), then + b broadcast
print(Z)                                # Output: [[ 2.3 -0.2] [-1.4  0.2]]
A = np.maximum(Z, 0)                    # ReLU
print(A)                                # Output: [[2.3 0. ] [0.  0.2]]
```

The same layer in PyTorch:

```python
import torch
import torch.nn as nn

layer = nn.Linear(in_features=3, out_features=2)
print(layer.weight.shape)   # Output: torch.Size([2, 3])
print(layer.bias.shape)     # Output: torch.Size([2])
x = torch.tensor([[1., 2., 3.], [0., 1., -1.]])
print(layer(x).shape)       # Output: torch.Size([2, 2])  — random weights, so values vary
```

### Counting parameters

A dense layer from n_in to n_out has **n_in × n_out weights + n_out biases**.

**Worked example.** An MNIST network: 784 inputs → 128 hidden → 10 outputs.

1. Layer 1: 784 × 128 + 128 = 100,352 + 128 = **100,480**
2. Layer 2: 128 × 10 + 10 = 1,280 + 10 = **1,290**
3. Total: **101,770** parameters

> **Interview tip:** Interviewers often ask "how many parameters in this layer?" or "what is the output shape?". Say the shape rule out loud: "(batch, 784) times (784, 128) gives (batch, 128)". It shows you think in shapes.

## Matrix operations cheat table

| Operation | NumPy | Shapes | ML use |
|---|---|---|---|
| Matrix multiply | `A @ B` | (m,n)@(n,p)→(m,p) | layers, attention, regression |
| Element-wise multiply | `A * B` | same shape | masks, gating in LSTMs |
| Transpose | `A.T` | (m,n)→(n,m) | Q·Kᵀ, backprop |
| Identity | `np.eye(n)` | (n,n) | Ridge regression, initialization |
| Inverse | `np.linalg.inv(A)` | (n,n) | theory; prefer `solve` |
| Solve Ax = b | `np.linalg.solve(A, b)` | (n,n),(n,)→(n,) | normal equation |
| Determinant | `np.linalg.det(A)` | (n,n)→number | check invertibility |
| Sum over axis | `A.sum(axis=0)` | (m,n)→(n,) | column totals, means |

## Key terms

| Term | Simple meaning |
|---|---|
| Matrix multiplication | Every row of the first dotted with every column of the second |
| Shape rule | (m×n)·(n×p) = (m×p); inner sizes must match |
| Non-commutative | A·B is usually not equal to B·A |
| Associative | (A·B)·C = A·(B·C) |
| Transpose (Aᵀ) | Rows become columns |
| Identity matrix (I) | 1s on the diagonal, 0s elsewhere; multiplying by it changes nothing |
| Diagonal matrix | Non-zero numbers only on the diagonal; scales each axis |
| Inverse (A⁻¹) | The matrix that undoes A: A·A⁻¹ = I |
| Determinant | A number (ad − bc for 2×2); zero means no inverse |
| Singular matrix | A square matrix with no inverse |
| Normal equation | w = (XᵀX)⁻¹Xᵀy, the direct solution of linear regression |
| Broadcasting | NumPy stretching a smaller array to match a bigger one |
| keepdims | Keep the reduced axis with size 1 so broadcasting works |
| Dense / linear layer | Computes W·x + b for all neurons at once |
| Activation function | Non-linear function applied after W·x + b, like ReLU |
| ReLU | max(0, z): keeps positives, replaces negatives with 0 |
| Batch | Several examples processed together as rows of a matrix |
| Parameter | A learned number (weight or bias) |

## Interview questions

**What are the rules for multiplying two matrices?**
The number of columns of the first must equal the number of rows of the second. (m×n)·(n×p) gives (m×p). Each entry is a dot product of a row of the first with a column of the second, so it costs m×n×p multiply-adds.

**Is matrix multiplication commutative?**
No. In general A·B ≠ B·A, and often only one order is even allowed by the shapes. It is associative, though, so (AB)C = A(BC), and choosing a good order can save computation.

**What does a dense layer compute? What are the shapes?**
It computes y = W·x + b. With n_in inputs and n_out outputs, W is (n_out, n_in) and b is (n_out,). For a batch X of shape (batch, n_in), PyTorch computes X·Wᵀ + b, giving (batch, n_out).

**How many parameters does a dense layer from 512 to 256 units have?**
512 × 256 weights = 131,072, plus 256 biases, so 131,328 parameters.

**Why do neural networks need activation functions between layers?**
Without them, two layers W₂(W₁x + b₁) + b₂ collapse into one linear layer, because the product of matrices is just another matrix. The network could then only learn linear relationships, no matter how deep it is.

**What is broadcasting? Give an example.**
It is NumPy's rule for combining arrays of different shapes by virtually stretching dimensions of size 1. For example, a (100, 5) data matrix minus a (5,) mean vector subtracts the means from every row. Shapes are compared from the right; sizes must match or be 1.

**What is a singular matrix and why does it matter for linear regression?**
A singular matrix has determinant 0 and no inverse. In linear regression, XᵀX becomes singular (or nearly so) when features are perfectly correlated, like price in rupees and price in thousands of rupees. The normal equation then fails; Ridge regression fixes it by adding λI.

**Why prefer `np.linalg.solve` over computing the inverse?**
Solve uses a factorization that is faster and more numerically accurate. Computing the inverse and multiplying does more work and amplifies rounding errors.

**When would you not use the normal equation for linear regression?**
When the number of features d is large, because inverting a d×d matrix costs about d³ operations, or when data does not fit in memory. Then gradient descent or stochastic gradient descent is used.

**What does Q·Kᵀ compute in attention?**
Q has one query vector per token as rows and K has one key vector per token as rows. Q·Kᵀ dots every query with every key, giving a (tokens × tokens) table of similarity scores that says how much each token should attend to each other token.

## Try it yourself

1. Compute [[2, 0], [1, 3]] · [[1, 4], [2, 1]] by hand. *Hint:* four dot products.
2. Find the inverse of [[3, 1], [5, 2]] and check it. *Hint:* the determinant is 1.
3. Given `X` of shape (64, 10), `W1` (32, 10), `b1` (32,), `W2` (1, 32), `b2` (1,), write the NumPy forward pass with ReLU in between and say the output shape. *Hint:* `X @ W1.T + b1`.
4. Which of these broadcast, and to what shape: (4, 1) + (3,), (5, 3) + (5,), (2, 1, 3) + (4, 1)? *Hint:* line them up from the right.

### Answers

1. Row 1: [2, 0]·[1, 2] = 2, [2, 0]·[4, 1] = 8. Row 2: [1, 3]·[1, 2] = 1 + 6 = 7, [1, 3]·[4, 1] = 4 + 3 = 7. Answer **[[2, 8], [7, 7]]**.
2. det = 3 × 2 − 1 × 5 = 1. Inverse = [[2, −1], [−5, 3]]. Check row 1 · column 1: 3 × 2 + 1 × (−5) = 1; row 1 · column 2: 3 × (−1) + 1 × 3 = 0. Correct.
3. Solution:

```python
H = np.maximum(X @ W1.T + b1, 0)   # (64,10)@(10,32) -> (64,32)
out = H @ W2.T + b2                # (64,32)@(32,1) -> (64,1)
print(out.shape)                   # Output: (64, 1)
```

4. (4, 1) + (3,) → **(4, 3)**. (5, 3) + (5,) → **error** (3 vs 5 on the right). (2, 1, 3) + (4, 1) → treat as (1, 4, 1) → **(2, 4, 3)**.

**Next:** [Eigenvalues and PCA Intuition](/interview/ai-engineer/math-for-ml/eigenvalues-and-pca-intuition)
