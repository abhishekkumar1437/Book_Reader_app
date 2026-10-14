---
title: Eigenvalues and PCA Intuition
part: Linear Algebra
summary: A matrix as a machine that moves vectors, eigenvectors as the directions it only stretches, variance and the covariance matrix, and Principal Component Analysis done by hand on five points, then in NumPy and scikit-learn.
---

Real datasets often have many features that say almost the same thing, like "height in cm" and "height in inches", or 50 survey questions that all measure "customer happiness". **Principal Component Analysis (PCA)** finds the few directions in the data that carry most of the information, so you can compress 100 features into 10 or plot high-dimensional embeddings on a 2-D screen. PCA is built on **eigenvectors**, which sound scary but have a simple picture. This chapter gives you that picture and then runs PCA by hand on 5 points.

> **In simple words:** A matrix moves and stretches vectors. Most vectors get turned to a new direction, but a few special directions only get longer or shorter; these are **eigenvectors**, and the stretch amount is the **eigenvalue**. PCA finds the eigenvectors of the data's covariance matrix: the directions where the data spreads out the most.

## A matrix is a machine that transforms vectors

In the last chapter a matrix times a vector gave a new vector. Think of the matrix as a machine: a vector goes in, a moved vector comes out. This is called a **linear transformation**. "Linear" means straight lines stay straight and the origin stays fixed.

| Matrix | What it does to the plane |
|---|---|
| [[2, 0], [0, 3]] | Stretches x by 2 and y by 3 (**scaling**) |
| [[0, −1], [1, 0]] | Turns everything 90° anticlockwise (**rotation**) |
| [[1, 1], [0, 1]] | Slides the top sideways, like pushing a deck of cards (**shear**) |
| [[1, 0], [0, 0]] | Squashes everything flat onto the x-axis (**projection**) |

A useful trick: the **columns** of a matrix tell you where the basic arrows [1, 0] and [0, 1] land.

**Worked example.** Take **A** = [[2, 1], [1, 2]].

1. **A**·[1, 0] = [2×1 + 1×0, 1×1 + 2×0] = [2, 1] (column 1)
2. **A**·[0, 1] = [2×0 + 1×1, 1×0 + 2×1] = [1, 2] (column 2)
3. **A**·[1, 1] = [2 + 1, 1 + 2] = [3, 3]
4. **A**·[1, −1] = [2 − 1, 1 − 2] = [1, −1]

Look at steps 3 and 4. [1, 1] became [3, 3] — the **same direction**, just 3 times longer. [1, −1] became [1, −1] — the same direction, stretch 1. But [1, 0] became [2, 1], which points in a new direction.

<figure>
<svg viewBox="0 0 420 230" width="420" height="230" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="20" y1="170" x2="210" y2="170" stroke-dasharray="2 3" />
<line x1="60" y1="225" x2="60" y2="20" stroke-dasharray="2 3" />
<line x1="60" y1="170" x2="95" y2="170" stroke-width="2" />
<line x1="60" y1="170" x2="130" y2="135" stroke-width="2" stroke-dasharray="5 3" />
<text x="96" y="186" fill="currentColor" stroke="none">[1,0]</text>
<text x="134" y="140" fill="currentColor" stroke="none">→ [2,1]</text>
<line x1="60" y1="170" x2="95" y2="135" stroke="var(--accent)" stroke-width="2" />
<line x1="95" y1="135" x2="165" y2="65" stroke="var(--accent)" stroke-width="2" stroke-dasharray="5 3" />
<circle cx="165" cy="65" r="3" fill="var(--accent)" stroke="var(--accent)" />
<text x="70" y="128" fill="var(--accent)" stroke="none">[1,1]</text>
<text x="170" y="62" fill="var(--accent)" stroke="none" font-weight="bold">→ [3,3] = 3 × [1,1]</text>
<line x1="60" y1="170" x2="95" y2="205" stroke="var(--accent)" stroke-width="2" />
<circle cx="95" cy="205" r="3" fill="var(--accent)" stroke="var(--accent)" />
<text x="100" y="215" fill="var(--accent)" stroke="none" font-weight="bold">[1,−1] → [1,−1] = 1 × [1,−1]</text>
<text x="250" y="110" fill="currentColor" stroke="none">A = [[2, 1], [1, 2]]</text>
<text x="250" y="132" fill="currentColor" stroke="none">[1,0] changes direction</text>
<text x="250" y="154" fill="var(--accent)" stroke="none">eigenvectors keep direction</text>
</svg>
<figcaption>The matrix turns [1, 0] to a new direction, but [1, 1] and [1, −1] stay on their own lines: they are the eigenvectors, stretched by 3 and by 1.</figcaption>
</figure>

```python
import numpy as np
A = np.array([[2, 1], [1, 2]])
for v in ([1, 0], [1, 1], [1, -1]):
    print(v, "->", A @ np.array(v))
# Output:
# [1, 0] -> [2 1]
# [1, 1] -> [3 3]
# [1, -1] -> [ 1 -1]
```

## Eigenvectors and eigenvalues

An **eigenvector** of a square matrix **A** is a non-zero vector **v** that the matrix only stretches (or shrinks, or flips), never turns:

```text
A v = λ v
```

The number λ (lambda) is the **eigenvalue**: how much **v** is stretched. "Eigen" is German for "own" — each matrix has its own special directions.

- λ > 1: stretched longer
- 0 < λ < 1: shrunk
- λ < 0: flipped to the opposite direction
- λ = 0: squashed to zero (the matrix is singular)

Any multiple of an eigenvector is also an eigenvector (2 × [1, 1] = [2, 2] also gets stretched by 3), so we usually report the unit-length one: [1, 1]/√2 ≈ [0.707, 0.707].

> **Real-life example:** Imagine stretching a rubber sheet with a drawing on it. Most lines on the drawing tilt to new angles. But a few lines only get longer along their own direction. Those lines are the eigenvectors of the stretch.

### Finding them by hand (2 × 2)

You will rarely do this by hand at work, but interviewers sometimes ask, and it builds trust in the idea.

Rewrite **A**v = λv as (**A** − λ**I**)v = 0. A non-zero v can only exist if (**A** − λ**I**) squashes some direction to zero, which means its determinant is 0:

```text
det(A − λI) = 0       (the "characteristic equation")
```

**Worked example.** **A** = [[2, 1], [1, 2]].

1. **A** − λ**I** = [[2 − λ, 1], [1, 2 − λ]]
2. Determinant: (2 − λ)(2 − λ) − 1 × 1 = (2 − λ)² − 1
3. Set to 0: (2 − λ)² = 1, so 2 − λ = 1 or 2 − λ = −1
4. Eigenvalues: **λ = 1** or **λ = 3**
5. For λ = 3: (**A** − 3**I**) = [[−1, 1], [1, −1]]. The equation −x + y = 0 gives y = x, so **v = [1, 1]**.
6. For λ = 1: (**A** − **I**) = [[1, 1], [1, 1]]. The equation x + y = 0 gives y = −x, so **v = [1, −1]**.

This matches the picture above.

Two quick checks you can use: the **sum** of eigenvalues equals the **trace** (sum of the diagonal): 3 + 1 = 2 + 2 = 4. The **product** of eigenvalues equals the determinant: 3 × 1 = 2×2 − 1×1 = 3.

```python
A = np.array([[2., 1.], [1., 2.]])
values, vectors = np.linalg.eigh(A)   # eigh: for symmetric matrices (like covariance)
print(values)     # Output: [1. 3.]          — sorted smallest first
print(vectors)    # columns are eigenvectors
# Output:
# [[-0.7071  0.7071]
#  [ 0.7071  0.7071]]
```

Column 2 is [0.707, 0.707] = [1, 1]/√2 for λ = 3. Column 1 is [−0.707, 0.707], which is −[1, −1]/√2. The sign of an eigenvector is arbitrary; both point along the same line.

> **Common mistake:** Reading eigenvectors from the **rows** of the NumPy output. `np.linalg.eig` and `eigh` return eigenvectors as **columns**: `vectors[:, i]` belongs to `values[i]`. Also, `eigh` sorts eigenvalues from smallest to largest, so for PCA you must reverse the order.

### Symmetric matrices are friendly

A **symmetric** matrix equals its own transpose (**A** = **A**ᵀ), like [[2, 1], [1, 2]]. For symmetric matrices, the eigenvalues are always real numbers and the eigenvectors are always perpendicular to each other. [1, 1] · [1, −1] = 1 − 1 = 0. Covariance matrices are always symmetric, which is why PCA gives clean, perpendicular directions.

## Variance and the covariance matrix

Before PCA, you need one more idea: how spread out data is in each direction.

The **variance** of a feature is the average squared distance from its mean. Large variance = values spread widely. (Full detail in [Distributions and Statistics](/interview/math-for-ml/distributions-and-statistics).)

```text
variance(x) = Σ (xᵢ − x̄)² ÷ (n − 1)
```

(We divide by n − 1 instead of n for a **sample**; this is the standard choice in `np.cov`. With large n the difference does not matter.)

The **covariance** of two features says whether they move together:

```text
cov(x, y) = Σ (xᵢ − x̄)(yᵢ − ȳ) ÷ (n − 1)
```

- Positive: when x is above its mean, y tends to be above its mean too (height and weight).
- Negative: when one goes up, the other goes down (price and units sold).
- Near zero: no linear relationship.

The **covariance matrix** puts all of these in a table. For 2 features:

```text
C = | var(x)     cov(x, y) |
    | cov(x, y)  var(y)    |
```

It is symmetric because cov(x, y) = cov(y, x).

## PCA by hand on five points

Here is the whole PCA algorithm, step by step, on 5 students with 2 test scores (out of 10):

| Student | Test 1 (x) | Test 2 (y) |
|---|---|---|
| A | 1 | 2 |
| B | 2 | 1 |
| C | 3 | 3 |
| D | 4 | 5 |
| E | 5 | 4 |

The two tests clearly move together: good students do well on both. PCA should find that one direction, "overall ability", carries most of the information.

<figure>
<svg viewBox="0 0 420 230" width="420" height="230" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="40" y1="200" x2="240" y2="200" />
<line x1="40" y1="200" x2="40" y2="20" />
<text x="236" y="216" fill="currentColor" stroke="none">Test 1</text>
<text x="10" y="16" fill="currentColor" stroke="none">Test 2</text>
<line x1="55" y1="185" x2="205" y2="35" stroke="var(--accent)" stroke-width="2.5" />
<text x="200" y="28" fill="var(--accent)" stroke="none" font-weight="bold">PC1 (variance 4.5)</text>
<line x1="109" y1="89" x2="151" y2="131" stroke-dasharray="4 3" stroke-width="2" />
<text x="155" y="145" fill="currentColor" stroke="none">PC2 (variance 0.5)</text>
<circle cx="70" cy="140" r="4" fill="currentColor" />
<circle cx="100" cy="170" r="4" fill="currentColor" />
<circle cx="130" cy="110" r="4" fill="currentColor" />
<circle cx="160" cy="50" r="4" fill="currentColor" />
<circle cx="190" cy="80" r="4" fill="currentColor" />
<text x="58" y="134" fill="currentColor" stroke="none">A</text>
<text x="104" y="184" fill="currentColor" stroke="none">B</text>
<text x="118" y="108" fill="currentColor" stroke="none">C</text>
<text x="148" y="46" fill="currentColor" stroke="none">D</text>
<text x="196" y="84" fill="currentColor" stroke="none">E</text>
<text x="270" y="90" fill="currentColor" stroke="none">PC1 = [0.707, 0.707]</text>
<text x="270" y="110" fill="currentColor" stroke="none">PC2 = [0.707, −0.707]</text>
<text x="270" y="130" fill="var(--accent)" stroke="none">PC1 explains 90%</text>
</svg>
<figcaption>The five students lie close to the diagonal line PC1. Spread along PC1 is large (4.5); spread across it, along PC2, is small (0.5).</figcaption>
</figure>

**Step 1: centre the data.** Subtract the mean of each column so the cloud sits around the origin.

- Mean of x: (1 + 2 + 3 + 4 + 5) ÷ 5 = 15 ÷ 5 = **3**
- Mean of y: (2 + 1 + 3 + 5 + 4) ÷ 5 = 15 ÷ 5 = **3**

| Student | x − 3 | y − 3 |
|---|---|---|
| A | −2 | −1 |
| B | −1 | −2 |
| C | 0 | 0 |
| D | 1 | 2 |
| E | 2 | 1 |

**Step 2: covariance matrix** (divide by n − 1 = 4).

- var(x) = (4 + 1 + 0 + 1 + 4) ÷ 4 = 10 ÷ 4 = **2.5**
- var(y) = (1 + 4 + 0 + 4 + 1) ÷ 4 = 10 ÷ 4 = **2.5**
- cov(x, y) = ((−2)(−1) + (−1)(−2) + 0×0 + 1×2 + 2×1) ÷ 4 = (2 + 2 + 0 + 2 + 2) ÷ 4 = 8 ÷ 4 = **2**

```text
C = | 2.5  2 |
    | 2    2.5 |
```

**Step 3: eigenvalues and eigenvectors of C.**

1. det(C − λI) = (2.5 − λ)² − 2² = 0
2. 2.5 − λ = 2 or 2.5 − λ = −2
3. **λ₁ = 4.5** and **λ₂ = 0.5**
4. For λ₁ = 4.5: −2x + 2y = 0 → y = x → **PC1 = [1, 1]/√2 ≈ [0.707, 0.707]**
5. For λ₂ = 0.5: 2x + 2y = 0 → y = −x → **PC2 = [1, −1]/√2 ≈ [0.707, −0.707]**

The eigenvectors are the **principal components** (new axes), and each eigenvalue is the **variance of the data along that axis**.

**Step 4: explained variance.** Total variance = 4.5 + 0.5 = 5 (also equal to 2.5 + 2.5, the trace).

- PC1 explains 4.5 ÷ 5 = **90%**
- PC2 explains 0.5 ÷ 5 = **10%**

**Step 5: project onto PC1 (reduce 2 features to 1).** Dot each centred point with PC1:

| Student | Centred | Score on PC1 |
|---|---|---|
| A | (−2, −1) | (−2 − 1) × 0.707 = −3 × 0.707 = **−2.12** |
| B | (−1, −2) | (−1 − 2) × 0.707 = **−2.12** |
| C | (0, 0) | **0** |
| D | (1, 2) | (1 + 2) × 0.707 = **2.12** |
| E | (2, 1) | **2.12** |

Each student is now one number, an "overall ability score". Check: the variance of these scores is (4.5 + 4.5 + 0 + 4.5 + 4.5) ÷ 4 = 18 ÷ 4 = 4.5 — exactly λ₁, as promised.

**Step 6 (optional): reconstruct.** To go back to 2-D, multiply the score by PC1 and add the mean. Student A: −2.12 × [0.707, 0.707] = [−1.5, −1.5]; plus [3, 3] = **(1.5, 1.5)**. The true point was (1, 2). We lost a small part, (−0.5, +0.5), which lies along PC2 — the 10% we threw away. Notice that A and B now look the same: PCA kept the "overall ability" and dropped "better at test 1 or test 2".

> **Remember:** PCA in five words: **centre, covariance, eigen, sort, project.** The eigenvector with the largest eigenvalue is the direction of greatest variance.

### PCA from scratch in NumPy

```python
import numpy as np

X = np.array([[1, 2], [2, 1], [3, 3], [4, 5], [5, 4]], dtype=float)

X_c = X - X.mean(axis=0)                  # step 1: centre
C = np.cov(X_c, rowvar=False)             # step 2: covariance (divides by n-1)
values, vectors = np.linalg.eigh(C)       # step 3: eigen (ascending order)
order = np.argsort(values)[::-1]          # step 4: sort largest first
values, vectors = values[order], vectors[:, order]

print(C)                                  # Output: [[2.5 2. ] [2.  2.5]]
print(values)                             # Output: [4.5 0.5]
print(values / values.sum())              # Output: [0.9 0.1]  explained variance ratio

pc1 = vectors[:, 0]
scores = X_c @ pc1                        # step 5: project (sign may be flipped)
print(scores.round(2))                    # Output: [-2.12 -2.12  0.    2.12  2.12] (or all signs flipped)
```

### PCA with scikit-learn

In practice you use the library. It computes PCA with the **SVD** (singular value decomposition), a related factorization that is more numerically stable, but the results are the same.

```python
from sklearn.decomposition import PCA

pca = PCA(n_components=1)
scores = pca.fit_transform(X)              # centres the data for you
print(pca.components_)                     # Output: [[0.7071 0.7071]] (sign may differ)
print(pca.explained_variance_)             # Output: [4.5]
print(pca.explained_variance_ratio_)       # Output: [0.9]
```

> **Common mistake:** Running PCA on unscaled features. PCA chases variance, and variance depends on units. If one feature is salary in ₹ (variance in the millions) and another is age (variance around 100), PC1 will just be "salary". Standardize first, usually with `StandardScaler`, unless all features share the same unit (like pixels).

## How many components to keep?

Plot the **cumulative explained variance** and keep enough components to reach a target, often 90–95%. Or look for the "elbow" where extra components add little. In scikit-learn, `PCA(n_components=0.95)` picks the number for you.

```python
rng = np.random.default_rng(0)
latent = rng.normal(size=(200, 2))                 # 2 hidden "true" factors
X10 = latent @ rng.normal(size=(2, 10)) + 0.1 * rng.normal(size=(200, 10))  # 10 noisy features

pca = PCA().fit(X10)
print(np.cumsum(pca.explained_variance_ratio_).round(3)[:4])
# Output: [0.595 0.997 0.997 0.998]  — 2 components already keep 99.7%
```

## Where eigenvectors and PCA appear in ML

| Use | How |
|---|---|
| Dimensionality reduction | Compress hundreds of features to a few before a model, to speed up training and reduce noise |
| Visualisation | Project embeddings to 2-D to plot them (t-SNE and UMAP are non-linear alternatives) |
| Removing correlated features | PCA components are uncorrelated with each other |
| Image compression / eigenfaces | Keep top components of face images |
| PageRank | Google's original ranking is the top eigenvector of the link matrix |
| Spectral clustering | Uses eigenvectors of a similarity graph |
| Low-rank ideas (LoRA) | Fine-tuning updates as a product of two thin matrices; related to keeping only top singular directions |
| Training stability | The size of the largest eigenvalue of the loss curvature limits how large the learning rate can be |

See [Dimensionality Reduction with PCA](/interview/machine-learning/dimensionality-reduction-pca) for PCA in a real ML pipeline, and [Fine-tuning, LoRA and QLoRA](/interview/llms-genai/fine-tuning-lora-and-qlora) for low-rank matrices.

### Limits of PCA

- It finds only **linear** directions. Data on a curved shape (a spiral) needs non-linear methods.
- The components are mixtures of all features, so they can be **hard to interpret**.
- High variance is not always useful for your prediction task. A direction with small variance can still be the one that separates classes.
- It is sensitive to **scaling** and **outliers**.

> **Interview tip:** A great one-line answer to "What is PCA?": "PCA rotates the data to new perpendicular axes ordered by how much variance they capture; these axes are the eigenvectors of the covariance matrix, and their eigenvalues are the variances. Keeping the top k gives the best k-dimensional linear approximation of the data."

## Key terms

| Term | Simple meaning |
|---|---|
| Linear transformation | What a matrix does to vectors: stretch, rotate, shear, project, keeping lines straight |
| Eigenvector | A direction that a matrix only stretches, never turns: Av = λv |
| Eigenvalue (λ) | How much the eigenvector is stretched |
| Characteristic equation | det(A − λI) = 0, solved to find eigenvalues |
| Trace | Sum of the diagonal; equals the sum of eigenvalues |
| Symmetric matrix | Equals its transpose; real eigenvalues, perpendicular eigenvectors |
| Variance | Average squared distance from the mean; spread of one feature |
| Covariance | Whether two features move together (positive), opposite (negative) or neither (≈0) |
| Covariance matrix | Table of all variances (diagonal) and covariances (off-diagonal) |
| Centring | Subtracting the mean of each feature |
| PCA | Finding the directions of greatest variance and projecting data onto the top ones |
| Principal component | One of those directions; an eigenvector of the covariance matrix |
| Explained variance ratio | Fraction of total variance captured by a component |
| Projection | Dot product of a point with a direction; its coordinate along that axis |
| Reconstruction | Mapping projected data back to the original space (with some loss) |
| SVD | Singular value decomposition; a factorization that libraries use to compute PCA |

## Interview questions

**What is an eigenvector, in plain words?**
A direction that a matrix does not rotate; it only stretches or shrinks it. If Av = λv, then v is an eigenvector and λ is the stretch factor called the eigenvalue. For example, [[2, 1], [1, 2]] sends [1, 1] to [3, 3], so [1, 1] is an eigenvector with eigenvalue 3.

**Find the eigenvalues of [[4, 0], [0, 2]].**
It is diagonal, so the eigenvalues are the diagonal entries: 4 and 2. The eigenvectors are [1, 0] and [0, 1]. A diagonal matrix just scales each axis.

**Explain PCA step by step.**
Standardize or at least centre the data, compute the covariance matrix, find its eigenvectors and eigenvalues, sort them by eigenvalue from largest to smallest, keep the top k eigenvectors, and project the centred data onto them with a matrix multiplication. The eigenvalues tell how much variance each component keeps.

**Why must you scale data before PCA?**
PCA looks for directions of largest variance, and variance depends on units. A feature with large numbers would dominate the first component even if it is not more important. Standardizing gives every feature variance 1 so they compete fairly.

**What does the explained variance ratio tell you?**
It is each component's eigenvalue divided by the sum of all eigenvalues: the share of the total spread it captures. If the first 3 components explain 95%, you can reduce to 3 dimensions while keeping most of the information.

**Are principal components correlated?**
No. They are eigenvectors of a symmetric matrix, so they are perpendicular, and the projected data on different components has zero covariance. This is one reason PCA helps with multicollinearity in regression.

**What is the relation between PCA and SVD?**
If you centre X and take its SVD, X = UΣVᵀ, the columns of V are the principal components, and the eigenvalues of the covariance matrix are σᵢ² ÷ (n − 1). Libraries use SVD because it is more numerically stable than forming XᵀX.

**When would PCA be a bad choice?**
When the structure is non-linear (use t-SNE or UMAP for visualisation, or autoencoders), when you need interpretable features, or when the low-variance directions are the ones that matter for prediction. It is also sensitive to outliers.

**Is PCA supervised or unsupervised?**
Unsupervised. It uses only the features, never the labels. That is why it may drop a direction that would have been useful for a classifier.

**What does a zero eigenvalue mean?**
The matrix squashes that direction to zero, so it is singular and has no inverse. In a covariance matrix, it means the data has no spread in that direction: one feature is an exact linear combination of others.

## Try it yourself

1. Find the eigenvalues of [[3, 1], [0, 2]] by hand. *Hint:* the matrix is triangular; det(A − λI) = (3 − λ)(2 − λ).
2. Run PCA by hand on three centred points: (−1, −1), (0, 0), (1, 1). What fraction of variance does PC1 explain? *Hint:* compute the covariance matrix; all points lie on one line.
3. Write a function `pca(X, k)` that returns the projected data and explained variance ratios, using only NumPy. Compare with scikit-learn on random data. *Hint:* reuse the from-scratch code; signs may differ.
4. Check the trace and determinant rules for the covariance matrix [[2.5, 2], [2, 2.5]]. *Hint:* eigenvalues are 4.5 and 0.5.

### Answers

1. (3 − λ)(2 − λ) − 1 × 0 = 0, so **λ = 3 and λ = 2** (the diagonal entries of a triangular matrix).
2. var(x) = (1 + 0 + 1) ÷ 2 = 1, var(y) = 1, cov = (1 + 0 + 1) ÷ 2 = 1. C = [[1, 1], [1, 1]]. Eigenvalues: (1 − λ)² = 1 → λ = 2 or 0. PC1 = [1, 1]/√2 explains 2 ÷ 2 = **100%**; the data has no spread across the line.
3. Solution:

```python
def pca(X, k):
    X_c = X - X.mean(axis=0)
    vals, vecs = np.linalg.eigh(np.cov(X_c, rowvar=False))
    order = np.argsort(vals)[::-1]
    vals, vecs = vals[order], vecs[:, order]
    return X_c @ vecs[:, :k], vals[:k] / vals.sum()
```

4. Trace = 2.5 + 2.5 = 5 = 4.5 + 0.5. Determinant = 2.5 × 2.5 − 2 × 2 = 6.25 − 4 = 2.25 = 4.5 × 0.5. Both rules hold.

**Next:** [Probability Basics](/interview/math-for-ml/probability-basics)
