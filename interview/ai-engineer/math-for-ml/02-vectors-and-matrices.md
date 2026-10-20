---
title: Vectors and Matrices
part: Linear Algebra
summary: Vectors as arrows and as lists of features, length, distance, the dot product, cosine similarity (the heart of semantic search), and matrices with their shapes, all with small worked numbers and NumPy.
---

Everything a model sees is a list of numbers. A customer is a list of features, a word is a list of 768 numbers called an embedding, and an image is a grid of pixel values. This chapter teaches the two containers that hold these numbers, vectors and matrices, and the single most important operation in ML: the dot product. When you build semantic search or a RAG chatbot later, the cosine similarity in this chapter is exactly what finds the matching documents.

> **In simple words:** A vector is a list of numbers that you can also picture as an arrow. The dot product multiplies two lists item by item and adds the results; it tells you how much two arrows point the same way. A matrix is a table of numbers, many vectors stacked together.

## What is a vector?

A **vector** is an ordered list of numbers. "Ordered" matters: `[3, 4]` and `[4, 3]` are different vectors. The number of items is the **dimension** of the vector. `[3, 4]` is a 2-dimensional vector; an OpenAI or Cohere text embedding can have 1,000+ dimensions.

You can think of a vector in two ways, and both are useful.

**1. As a list of features.** A Flipkart customer could be:

```text
customer = [age, orders_last_month, avg_order_value_in_₹]
         = [28, 5, 1200]
```

Each position always means the same thing. Position 1 is always age.

**2. As an arrow in space.** The vector `[3, 4]` is an arrow that starts at the origin (0, 0), goes 3 steps right and 4 steps up. In 3 dimensions it is an arrow in a room. In 768 dimensions we cannot draw it, but the same math works.

<figure>
<svg viewBox="0 0 420 230" width="420" height="230" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<line x1="40" y1="200" x2="300" y2="200" />
<line x1="40" y1="200" x2="40" y2="20" />
<polygon points="300,200 292,196 292,204" fill="currentColor" />
<polygon points="40,20 36,28 44,28" fill="currentColor" />
<text x="306" y="204" fill="currentColor" stroke="none">x</text>
<text x="30" y="16" fill="currentColor" stroke="none">y</text>
<line x1="70" y1="196" x2="70" y2="204" /><line x1="100" y1="196" x2="100" y2="204" /><line x1="130" y1="196" x2="130" y2="204" /><line x1="160" y1="196" x2="160" y2="204" /><line x1="190" y1="196" x2="190" y2="204" />
<text x="66" y="218" fill="currentColor" stroke="none" font-size="11">1</text><text x="96" y="218" fill="currentColor" stroke="none" font-size="11">2</text><text x="126" y="218" fill="currentColor" stroke="none" font-size="11">3</text><text x="156" y="218" fill="currentColor" stroke="none" font-size="11">4</text><text x="186" y="218" fill="currentColor" stroke="none" font-size="11">5</text>
<line x1="36" y1="170" x2="44" y2="170" /><line x1="36" y1="140" x2="44" y2="140" /><line x1="36" y1="110" x2="44" y2="110" /><line x1="36" y1="80" x2="44" y2="80" />
<text x="22" y="174" fill="currentColor" stroke="none" font-size="11">1</text><text x="22" y="144" fill="currentColor" stroke="none" font-size="11">2</text><text x="22" y="114" fill="currentColor" stroke="none" font-size="11">3</text><text x="22" y="84" fill="currentColor" stroke="none" font-size="11">4</text>
<line x1="40" y1="200" x2="130" y2="80" stroke="var(--accent)" stroke-width="2.5" />
<polygon points="130,80 121,85 128,91" fill="var(--accent)" stroke="var(--accent)" />
<text x="108" y="70" fill="var(--accent)" stroke="none" font-weight="bold">a = [3, 4]</text>
<line x1="40" y1="200" x2="160" y2="110" stroke-width="2.5" />
<polygon points="160,110 150,112 155,119" fill="currentColor" />
<text x="166" y="112" fill="currentColor" stroke="none" font-weight="bold">b = [4, 3]</text>
<line x1="130" y1="80" x2="130" y2="200" stroke-dasharray="4 3" />
<line x1="40" y1="80" x2="130" y2="80" stroke-dasharray="4 3" />
<text x="225" y="60" fill="currentColor" stroke="none">‖a‖ = √(3² + 4²) = 5</text>
<text x="225" y="82" fill="currentColor" stroke="none">‖b‖ = √(4² + 3²) = 5</text>
<text x="225" y="104" fill="currentColor" stroke="none">angle between ≈ 16°</text>
</svg>
<figcaption>Two vectors drawn as arrows from the origin. They have the same length (5) but point in slightly different directions.</figcaption>
</figure>

```python
import numpy as np

a = np.array([3, 4])
b = np.array([4, 3])
print(a.shape)   # Output: (2,)   — a 1-D array with 2 items
print(a[0])      # Output: 3      — Python counts from 0
```

> **Real-life example:** Your exam result card is a vector: [Maths 85, Physics 78, Chemistry 90]. Two students can be compared subject by subject because each position means the same subject.

**Where in ML:** every row of your dataset is a **feature vector**. Every word or sentence passed to an LLM becomes an **embedding vector**. Model weights are stored as vectors and matrices.

## Adding vectors and multiplying by a number

**Vector addition** adds item by item. Both vectors must have the same dimension.

```text
[3, 4] + [1, 2] = [3 + 1, 4 + 2] = [4, 6]
```

As arrows: walk along the first arrow, then along the second. You end at [4, 6].

**Scalar multiplication** multiplies every item by one number (a **scalar**).

```text
2 × [3, 4] = [6, 8]       (same direction, twice as long)
−1 × [3, 4] = [−3, −4]    (same length, opposite direction)
```

```python
a = np.array([3, 4])
print(a + np.array([1, 2]))   # Output: [4 6]
print(2 * a)                  # Output: [6 8]
print(-1 * a)                 # Output: [-3 -4]
```

**Where in ML:** a gradient descent update is `w_new = w − η × gradient`. That is a scalar multiplication (learning rate η times the gradient vector) followed by a vector subtraction. The famous word-embedding example "king − man + woman ≈ queen" is also just vector addition and subtraction.

## Length of a vector (magnitude, norm)

The **magnitude** or **norm** of a vector is its length as an arrow. Use Pythagoras: square every item, add, take the square root. This is called the **L2 norm** (or Euclidean norm), written ‖**a**‖.

**Worked example.** **a** = [3, 4]

1. Square each item: 3² = 9, 4² = 16
2. Add: 9 + 16 = 25
3. Square root: √25 = **5**

For 3 dimensions, **v** = [1, 2, 2]: 1 + 4 + 4 = 9, √9 = **3**.

There is also the **L1 norm**: add the absolute values. For [3, 4] it is |3| + |4| = **7**. Think of walking on city streets in a grid: 3 blocks east then 4 blocks north = 7 blocks. That is why it is also called **Manhattan distance**.

A **unit vector** has length 1. To make one, divide by the length. This is called **normalizing**.

```text
[3, 4] ÷ 5 = [0.6, 0.8]     check: 0.6² + 0.8² = 0.36 + 0.64 = 1
```

```python
a = np.array([3, 4])
print(np.linalg.norm(a))          # Output: 5.0   (L2)
print(np.linalg.norm(a, ord=1))   # Output: 7.0   (L1)
unit = a / np.linalg.norm(a)
print(unit)                       # Output: [0.6 0.8]
```

**Where in ML:**

- **L2 regularization** adds ‖**w**‖² to the loss so weights stay small; **L1 regularization** adds ‖**w**‖₁ and pushes some weights to exactly zero. See [Overfitting, Regularization and Cross-Validation](/interview/ai-engineer/machine-learning/overfitting-regularization-and-cross-validation).
- **Gradient clipping** in deep learning limits the norm of the gradient vector so training does not explode.
- Many embedding models return **normalized** vectors (length 1), which makes cosine similarity equal to the plain dot product.

## Distance between two vectors

The **Euclidean distance** between two points is the length of the vector from one to the other: subtract, then take the norm.

**Worked example.** Distance from **p** = [1, 2] to **q** = [4, 6].

1. Subtract: **q** − **p** = [4 − 1, 6 − 2] = [3, 4]
2. Norm: √(3² + 4²) = √25 = **5**

```python
p = np.array([1, 2]); q = np.array([4, 6])
print(np.linalg.norm(q - p))   # Output: 5.0
```

**Where in ML:** K-Nearest Neighbours (KNN) predicts using the closest training points, and K-Means puts each point in the cluster with the nearest centre. Both use this distance. See [KNN, SVM and Naive Bayes](/interview/ai-engineer/machine-learning/knn-svm-and-naive-bayes).

> **Common mistake:** Using distance on features with very different scales. If one feature is salary in ₹ (like 50,000) and another is age (like 30), the salary dominates the distance completely. Always scale features first (standard scaling or min-max) before KNN, K-Means or SVM.

## The dot product

This is the most important operation in this book. The **dot product** of two vectors of the same length: multiply matching items, then add everything.

```text
a · b = a₁b₁ + a₂b₂ + … + aₙbₙ = Σᵢ aᵢ bᵢ
```

**Worked example 1.** **a** = [1, 2, 3], **b** = [4, 5, 6]

1. Multiply pairs: 1 × 4 = 4, 2 × 5 = 10, 3 × 6 = 18
2. Add: 4 + 10 + 18 = **32**

**Worked example 2.** **a** = [3, 4], **b** = [4, 3]

1. 3 × 4 = 12, 4 × 3 = 12
2. 12 + 12 = **24**

The result is a single number (a scalar), not a vector.

```python
a = np.array([1, 2, 3]); b = np.array([4, 5, 6])
print(np.dot(a, b))    # Output: 32
print(a @ b)           # Output: 32   — @ also works for 1-D arrays
print(np.sum(a * b))   # Output: 32   — a * b is item-by-item, then sum
```

### The dot product is what a neuron computes

A single **neuron** in a neural network takes inputs **x**, multiplies each by a weight, adds them up, and adds a bias. That is exactly a dot product plus a number.

**Worked example.** Inputs **x** = [2, 3, 1], weights **w** = [0.5, −1, 2], bias b = 0.5.

1. Multiply pairs: 0.5 × 2 = 1, −1 × 3 = −3, 2 × 1 = 2
2. Add: 1 + (−3) + 2 = 0
3. Add the bias: 0 + 0.5 = **0.5**

So the neuron's output before the activation function is 0.5. Linear regression is also this: ŷ = **w** · **x** + b.

```python
x = np.array([2, 3, 1])
w = np.array([0.5, -1, 2])
b = 0.5
z = w @ x + b
print(z)   # Output: 0.5
```

> **Remember:** "Multiply and add" is the core operation of almost every ML model. A large language model does billions of dot products for every token it writes. This is why GPUs, which do many multiply-and-add operations in parallel, are the hardware of AI.

### What the dot product means geometrically

The dot product has a second formula that uses the angle θ between the two arrows:

```text
a · b = ‖a‖ × ‖b‖ × cos θ
```

cos θ is 1 when the angle is 0° (same direction), 0 at 90° (perpendicular) and −1 at 180° (opposite). So the sign of the dot product tells you about direction:

<figure>
<svg viewBox="0 0 420 150" width="420" height="150" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<line x1="30" y1="100" x2="110" y2="100" stroke-width="2" />
<line x1="30" y1="100" x2="100" y2="60" stroke="var(--accent)" stroke-width="2" />
<path d="M 60 100 A 30 30 0 0 0 56 85" />
<text x="65" y="92" fill="currentColor" stroke="none" font-size="11">θ</text>
<text x="70" y="130" text-anchor="middle" fill="currentColor" stroke="none">small angle</text>
<text x="70" y="146" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">a · b &gt; 0</text>
<line x1="170" y1="100" x2="250" y2="100" stroke-width="2" />
<line x1="170" y1="100" x2="170" y2="30" stroke="var(--accent)" stroke-width="2" />
<rect x="170" y="88" width="12" height="12" />
<text x="210" y="130" text-anchor="middle" fill="currentColor" stroke="none">90°</text>
<text x="210" y="146" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">a · b = 0</text>
<line x1="340" y1="100" x2="410" y2="100" stroke-width="2" />
<line x1="340" y1="100" x2="275" y2="100" stroke="var(--accent)" stroke-width="2" />
<circle cx="340" cy="100" r="3" fill="currentColor" />
<text x="340" y="130" text-anchor="middle" fill="currentColor" stroke="none">opposite</text>
<text x="340" y="146" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">a · b &lt; 0</text>
</svg>
<figcaption>The dot product is positive when two vectors point roughly the same way, zero when they are perpendicular, and negative when they point in opposite directions.</figcaption>
</figure>

**Worked example.** For **a** = [3, 4] and **b** = [4, 3] we found **a** · **b** = 24 and both lengths are 5.

```text
cos θ = 24 ÷ (5 × 5) = 24 ÷ 25 = 0.96
θ = arccos(0.96) ≈ 16.3°
```

Check perpendicular vectors: [1, 0] · [0, 1] = 1 × 0 + 0 × 1 = 0. Yes, 90°.

Two vectors with dot product 0 are called **orthogonal** (perpendicular).

## Cosine similarity

Often we only care about **direction**, not length. For text, a long document and a short summary about the same topic should count as "similar", even though one vector may be longer. **Cosine similarity** is the cosine of the angle between two vectors:

```text
cosine_similarity(a, b) = (a · b) ÷ (‖a‖ × ‖b‖)
```

It ranges from −1 (opposite) through 0 (unrelated) to 1 (same direction).

**Worked example: tiny word embeddings.** Imagine a 3-dimensional embedding where the dimensions loosely mean [animal-ness, vehicle-ness, small-ness]:

| Word | Embedding |
|---|---|
| cat | [0.9, 0.1, 0.3] |
| kitten | [0.8, 0.2, 0.4] |
| car | [0.1, 0.9, 0.2] |

**cat vs kitten**

1. Dot product: 0.9 × 0.8 + 0.1 × 0.2 + 0.3 × 0.4 = 0.72 + 0.02 + 0.12 = **0.86**
2. ‖cat‖ = √(0.81 + 0.01 + 0.09) = √0.91 ≈ 0.954
3. ‖kitten‖ = √(0.64 + 0.04 + 0.16) = √0.84 ≈ 0.917
4. Cosine = 0.86 ÷ (0.954 × 0.917) = 0.86 ÷ 0.875 ≈ **0.98**

**cat vs car**

1. Dot product: 0.9 × 0.1 + 0.1 × 0.9 + 0.3 × 0.2 = 0.09 + 0.09 + 0.06 = **0.24**
2. ‖car‖ = √(0.01 + 0.81 + 0.04) = √0.86 ≈ 0.927
3. Cosine = 0.24 ÷ (0.954 × 0.927) = 0.24 ÷ 0.884 ≈ **0.27**

So "cat" is very close to "kitten" (0.98) and far from "car" (0.27). Real embeddings have hundreds of dimensions and the meaning of each dimension is not readable, but the math is identical.

```python
import numpy as np

def cosine_similarity(a, b):
    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

cat    = np.array([0.9, 0.1, 0.3])
kitten = np.array([0.8, 0.2, 0.4])
car    = np.array([0.1, 0.9, 0.2])

print(round(cosine_similarity(cat, kitten), 3))  # Output: 0.984
print(round(cosine_similarity(cat, car), 3))     # Output: 0.271
```

### Semantic search in five lines

This is the core of a RAG system. Store one embedding per document chunk in a matrix, compute the similarity with the query, and pick the highest.

```python
docs = np.array([[0.9, 0.1, 0.3],    # chunk 0: about cats
                 [0.1, 0.9, 0.2],    # chunk 1: about cars
                 [0.2, 0.3, 0.9]])   # chunk 2: about small things
query = np.array([0.8, 0.2, 0.4])    # "kitten"

# normalize every row to length 1, then one matrix-vector product gives all cosines
docs_n  = docs / np.linalg.norm(docs, axis=1, keepdims=True)
query_n = query / np.linalg.norm(query)
scores = docs_n @ query_n
print(scores.round(3))        # Output: [0.984 0.4   0.653]
print(np.argmax(scores))      # Output: 0   — the cat chunk wins
```

> **Interview tip:** If asked "cosine similarity or dot product for embeddings?", say: if the vectors are normalized to length 1, they give the same ranking, and the dot product is cheaper. If not normalized, the dot product also rewards longer vectors, which may or may not be wanted. Check what your embedding model recommends.

| Measure | Formula | Cares about length? | Typical use |
|---|---|---|---|
| Dot product | Σ aᵢbᵢ | Yes | Neurons, attention scores, normalized embeddings |
| Cosine similarity | a·b ÷ (‖a‖‖b‖) | No | Text embeddings, semantic search, RAG |
| Euclidean (L2) distance | ‖a − b‖ | Yes | KNN, K-Means, some vector databases |
| Manhattan (L1) distance | Σ \|aᵢ − bᵢ\| | Yes | Robust distance, some KNN uses |

> **Common mistake:** Saying "cosine similarity is a distance". It is a similarity: bigger means closer. **Cosine distance** = 1 − cosine similarity. Vector databases let you pick "cosine", "dot" or "L2"; picking the wrong one for your embedding model gives poor search results.

**Where in ML:** cosine similarity finds similar documents in RAG ([Embeddings and Semantic Search](/interview/ai-engineer/llms-genai/embeddings-and-semantic-search)), similar products in recommendation systems, and duplicate questions on Q&A sites. In Transformers, **attention** scores are dot products between query and key vectors ([Attention Step by Step](/interview/ai-engineer/nlp-transformers/attention-step-by-step)).

## Matrices

A **matrix** is a rectangular table of numbers. Its **shape** is (number of rows, number of columns), written rows × columns. A matrix with 3 rows and 2 columns is a "3 × 2 matrix".

```text
X = | 1000  2 |      shape (3, 2)
    | 1500  3 |      3 rows = 3 houses
    |  800  1 |      2 columns = 2 features (area, bedrooms)
```

You can see a matrix as a stack of row vectors (one per example) or a set of column vectors (one per feature). Both views are useful.

```python
X = np.array([[1000, 2],
              [1500, 3],
              [800,  1]])
print(X.shape)     # Output: (3, 2)
print(X[1])        # Output: [1500    3]   — row 1 = house 2
print(X[:, 0])     # Output: [1000 1500  800]   — column 0 = all areas
print(X[2, 1])     # Output: 1    — row 2, column 1
```

### Shapes you will meet in ML

Learning to think in shapes is the single best skill for avoiding bugs in deep learning code.

| Thing | Shape | Meaning |
|---|---|---|
| Tabular dataset | (n_samples, n_features) | e.g. (10000, 20): 10,000 customers, 20 features |
| Labels | (n_samples,) | one label per row |
| Weight vector of linear regression | (n_features,) | one weight per feature |
| Weight matrix of a dense layer | (n_out, n_in) in PyTorch | e.g. (64, 20): 20 inputs → 64 outputs |
| Grayscale image | (height, width) | e.g. (28, 28) for MNIST |
| Batch of colour images (PyTorch) | (batch, channels, height, width) | e.g. (32, 3, 224, 224) |
| Batch of token embeddings | (batch, seq_len, d_model) | e.g. (8, 512, 768) |
| Embedding table | (vocab_size, d_model) | e.g. (50000, 768): one row per token |

> **Real-life example:** A cricket scorecard is a matrix. Each row is a batsman, each column is a stat (runs, balls, fours, sixes). Shape: (11, 4). Reading one row tells you about one player; reading one column compares all players on one stat.

### A grayscale image is a matrix

A tiny 3 × 3 image where 0 is black and 255 is white:

```python
img = np.array([[  0, 255,   0],
                [255, 255, 255],
                [  0, 255,   0]])   # a white plus sign on black
print(img.shape)    # Output: (3, 3)
print(img / 255)    # scale to 0..1, a common preprocessing step
```

Neural networks usually want inputs scaled to small numbers, so dividing by 255 is the first step in many image pipelines.

### Element-wise operations

Adding, subtracting or multiplying two matrices of the **same shape** with `+`, `-`, `*` works item by item. This is **element-wise** (also called the **Hadamard product** for `*`). It is NOT matrix multiplication, which you will learn in the next chapter.

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[10, 20], [30, 40]])
print(A + B)   # Output: [[11 22] [33 44]]
print(A * B)   # Output: [[ 10  40] [ 90 160]]  — element-wise, not matrix multiply
```

> **Common mistake:** Writing `A * B` when you mean matrix multiplication. In NumPy and PyTorch, `*` is element-wise and `@` is matrix multiplication. The code may run without error and give a silently wrong answer if the shapes happen to match.

## Key terms

| Term | Simple meaning |
|---|---|
| Vector | Ordered list of numbers; also an arrow from the origin |
| Dimension | Number of items in a vector |
| Feature vector | One example (row) of data as a vector |
| Embedding | A learned vector that represents a word, sentence, image or item |
| Scalar | A single number |
| Scalar multiplication | Multiply every item of a vector by one number |
| Magnitude / norm (‖v‖) | Length of a vector |
| L2 norm | √(sum of squares); ordinary length |
| L1 norm | Sum of absolute values; Manhattan length |
| Unit vector | A vector of length 1 |
| Normalize | Divide a vector by its length so it has length 1 |
| Euclidean distance | Straight-line distance between two points: ‖a − b‖ |
| Dot product | Multiply matching items and add; one number |
| Orthogonal | Perpendicular; dot product is 0 |
| Cosine similarity | Dot product divided by both lengths; −1 to 1; direction only |
| Cosine distance | 1 − cosine similarity |
| Neuron | Computes w · x + b, then applies an activation |
| Matrix | Rectangular table of numbers |
| Shape | (rows, columns) of a matrix, or sizes of every dimension of a tensor |
| Element-wise | Operation applied to matching items one by one |
| Hadamard product | Element-wise multiplication of two same-shape matrices |

## Interview questions

**What is a dot product and why is it important in ML?**
Multiply matching items of two vectors and add the results. It gives one number that is large when the vectors point the same way. A neuron computes w · x + b, linear regression predicts with a dot product, and attention in Transformers scores words with dot products, so it is the most-used operation in ML.

**What is cosine similarity? Compute it for [1, 0] and [1, 1].**
It is the dot product divided by the product of the lengths, so it measures only the angle between vectors. Dot product = 1 × 1 + 0 × 1 = 1. Lengths are 1 and √2 ≈ 1.414. Cosine = 1 ÷ 1.414 ≈ 0.707, which is the cosine of 45°.

**Why use cosine similarity instead of Euclidean distance for text embeddings?**
For text, the direction of the embedding carries the meaning, while the length can depend on things like text length or word frequency. Cosine ignores length, so two texts about the same topic score as similar. For normalized vectors, cosine ranking and Euclidean ranking give the same order anyway.

**If two embedding vectors are normalized, how are cosine similarity and dot product related?**
They are equal, because both lengths are 1 and the denominator becomes 1. Also, the squared Euclidean distance becomes 2 − 2 × cosine, so all three give the same nearest-neighbour ranking.

**What does a dot product of zero mean?**
The vectors are orthogonal (perpendicular). In terms of meaning, the two vectors share no direction, for example two features that are completely unrelated in the embedding space.

**What is the L2 norm of [2, 3, 6]?**
√(4 + 9 + 36) = √49 = 7.

**What is the difference between L1 and L2 norms, and where are they used?**
L1 adds absolute values, L2 is the square root of the sum of squares. As a regularization penalty, L1 (Lasso) tends to push some weights to exactly zero and selects features, while L2 (Ridge) shrinks all weights smoothly. L2 is also the usual distance for KNN and K-Means.

**What is the shape of a batch of 16 RGB images of size 64×64 in PyTorch?**
(16, 3, 64, 64): batch, channels, height, width. TensorFlow and NumPy image libraries often use channels last: (16, 64, 64, 3).

**What is the difference between `A * B` and `A @ B` in NumPy?**
`A * B` multiplies element by element and needs the same (or broadcastable) shapes. `A @ B` is matrix multiplication and needs the inner dimensions to match. Using the wrong one is a common silent bug.

**Why should you scale features before KNN?**
KNN uses distance. A feature with large numbers, like salary in rupees, will dominate the distance and features like age will be almost ignored. Scaling puts all features on a similar range so each contributes fairly.

## Try it yourself

1. Compute the dot product and cosine similarity of [2, 1] and [1, 3] by hand. Then check with NumPy. *Hint:* lengths are √5 and √10.
2. Normalize the vector [1, 2, 2]. *Hint:* its length is 3.
3. Write a function `top_k(query, docs, k)` that returns the indices of the k most cosine-similar rows of `docs`. *Hint:* `np.argsort(scores)[::-1][:k]`.
4. You have a weight matrix of shape (64, 20) and an input vector of shape (20,). What is the shape of the output? *Hint:* each of the 64 rows does one dot product with the input.

### Answers

1. Dot = 2 × 1 + 1 × 3 = 5. Lengths √5 ≈ 2.236 and √10 ≈ 3.162; product = √50 ≈ 7.071. Cosine = 5 ÷ 7.071 ≈ **0.707** (an angle of 45°).
2. [1/3, 2/3, 2/3] ≈ [0.333, 0.667, 0.667]. Check: 1/9 + 4/9 + 4/9 = 1.
3. Solution:

```python
def top_k(query, docs, k):
    docs_n = docs / np.linalg.norm(docs, axis=1, keepdims=True)
    q_n = query / np.linalg.norm(query)
    scores = docs_n @ q_n
    return np.argsort(scores)[::-1][:k]   # biggest scores first
```

4. **(64,)** — 64 dot products, one output per row.

**Next:** [Matrix Operations and NumPy](/interview/ai-engineer/math-for-ml/matrix-operations-and-numpy)
