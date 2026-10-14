---
title: Dimensionality Reduction and PCA
part: Unsupervised Learning
summary: Why fewer features can be better, PCA step by step on four points (centre, covariance, eigenvectors, projection), explained variance and choosing the number of components, PCA in real pipelines, and t-SNE and UMAP for visualising high-dimensional data such as embeddings.
---

Modern data often has hundreds or thousands of features: pixel values, word counts, sensor readings, or the 768 to 3,072 numbers in a text embedding. Many of these features are redundant. **Dimensionality reduction** compresses them into a few new features that keep most of the information. AI engineers use it to speed up models, remove noise, fight the curse of dimensionality, and — very often — to **plot** embeddings in 2-D to see whether similar documents really sit together.

> **In simple words:** PCA finds the directions in which your data spreads out the most and keeps only the top few. It is like photographing a 3-D object from the angle that shows the most detail. t-SNE and UMAP are for drawing pictures of high-dimensional data, not for feeding models.

## Why reduce dimensions?

| Problem with many features | How reduction helps |
|---|---|
| Training and prediction are slow | Fewer columns → faster |
| Curse of dimensionality: distances lose meaning (KNN, clustering) | Neighbourhoods become meaningful again |
| Correlated, redundant features (height in cm and in inches) | Combined into one direction |
| Noise in many weak features | Low-variance directions (often noise) are dropped |
| Humans cannot see 50-D data | Project to 2-D or 3-D for plots |
| Storage and memory | Smaller embeddings / compressed data |

There are two families:

- **Feature selection**: keep a subset of the original columns (drop the rest). Easy to interpret. Methods: remove low-variance columns, correlation filters, L1 regularization (Lasso), tree feature importance, recursive feature elimination.
- **Feature extraction**: create **new** columns that are combinations of the old ones. PCA, t-SNE, UMAP and autoencoders do this. More powerful, but the new columns are harder to explain.

## PCA: the intuition

**Principal component analysis (PCA)** finds new axes for the data:

- The first axis, **PC1** (first **principal component**), points in the direction where the data has the **most variance** (it is most spread out).
- **PC2** is perpendicular (at 90°) to PC1 and captures the most of the **remaining** variance.
- And so on. With d features there are d components, ordered by how much variance they capture.

Keeping only the first few components gives a lower-dimensional version of the data that loses as little spread as possible.

> **Real-life example:** Imagine the heights and weights of 1,000 students. They are strongly related: tall students are usually heavier. Most of the variation is along one diagonal direction — "overall body size". PCA finds that diagonal as PC1. The second direction, "heavier or lighter than usual for your height", carries much less variation. If you keep only PC1, you describe each student with one number and lose little.

Why variance? A direction in which every point has nearly the same value carries no information to tell points apart. Directions with big spread carry the differences between points.

<figure>
<svg viewBox="0 0 420 220" width="420" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="50" y1="205" x2="250" y2="205" />
<line x1="50" y1="205" x2="50" y2="15" />
<text x="245" y="218" fill="currentColor" stroke="none">x₁</text>
<text x="32" y="22" fill="currentColor" stroke="none">x₂</text>
<line x1="75" y1="185" x2="225" y2="35" stroke="var(--accent)" stroke-width="2.5" />
<line x1="105" y1="65" x2="195" y2="155" stroke-dasharray="5 4" />
<line x1="180" y1="140" x2="150" y2="110" stroke-dasharray="2 2" />
<line x1="120" y1="80" x2="150" y2="110" stroke-dasharray="2 2" />
<circle cx="210" cy="50" r="5" fill="currentColor" />
<circle cx="90" cy="170" r="5" fill="currentColor" />
<circle cx="180" cy="140" r="5" fill="currentColor" />
<circle cx="120" cy="80" r="5" fill="currentColor" />
<circle cx="150" cy="110" r="3" />
<text x="218" y="48" fill="currentColor" stroke="none">(7, 7)</text>
<text x="96" y="186" fill="currentColor" stroke="none">(3, 3)</text>
<text x="186" y="152" fill="currentColor" stroke="none">(6, 4)</text>
<text x="80" y="74" fill="currentColor" stroke="none">(4, 6)</text>
<text x="262" y="60" fill="var(--accent)" stroke="none">PC1: direction (1, 1)</text>
<text x="262" y="76" fill="var(--accent)" stroke="none">80% of the variance</text>
<text x="262" y="130" fill="currentColor" stroke="none">PC2: direction (1, −1)</text>
<text x="262" y="146" fill="currentColor" stroke="none">20% of the variance</text>
<text x="262" y="185" fill="currentColor" stroke="none">small circle = mean (5, 5)</text>
</svg>
<figcaption>The four points spread most along the diagonal PC1; projecting onto PC1 alone keeps 80% of the variance.</figcaption>
</figure>

## PCA step by step on four points

Data: four points (x₁, x₂) = (7, 7), (3, 3), (6, 4), (4, 6).

### Step 1: centre the data

Subtract the mean of each feature. Mean = ((7 + 3 + 6 + 4)/4, (7 + 3 + 4 + 6)/4) = (5, 5).

| Point | Centred (x₁ − 5, x₂ − 5) |
|---|---|
| (7, 7) | (2, 2) |
| (3, 3) | (−2, −2) |
| (6, 4) | (1, −1) |
| (4, 6) | (−1, 1) |

If the features had different units (rupees and years), we would also **standardise** them (divide by the standard deviation). Otherwise the feature with the biggest numbers would dominate PC1.

### Step 2: covariance matrix

The **covariance matrix** shows how features vary together. For centred data, entry (j, k) = average of xⱼ·xₖ. (We divide by n = 4 here to keep numbers simple; NumPy and scikit-learn divide by n − 1 = 3. That scales every number by the same factor and does not change the directions or the percentages.)

- var(x₁) = (2² + (−2)² + 1² + (−1)²) ÷ 4 = (4 + 4 + 1 + 1) ÷ 4 = **2.5**
- var(x₂) = (4 + 4 + 1 + 1) ÷ 4 = **2.5**
- cov(x₁, x₂) = (2·2 + (−2)(−2) + 1·(−1) + (−1)·1) ÷ 4 = (4 + 4 − 1 − 1) ÷ 4 = **1.5**

Covariance matrix C = [[2.5, 1.5], [1.5, 2.5]].

### Step 3: eigenvectors and eigenvalues

An **eigenvector** of C is a direction that C only stretches (does not rotate). The stretch factor is its **eigenvalue**. For PCA: eigenvectors = principal component directions, eigenvalues = the variance along them. (The math is in [Eigenvalues and PCA Intuition](/interview/math-for-ml/eigenvalues-and-pca-intuition).)

Check the direction v = (1, 1):

C·v = (2.5 × 1 + 1.5 × 1, 1.5 × 1 + 2.5 × 1) = (4, 4) = **4** × (1, 1). So (1, 1) is an eigenvector with eigenvalue **4**.

Check v = (1, −1):

C·v = (2.5 − 1.5, 1.5 − 2.5) = (1, −1) = **1** × (1, −1). Eigenvalue **1**.

As unit vectors: PC1 = (1, 1)/√2 ≈ (0.707, 0.707), PC2 = (1, −1)/√2 ≈ (0.707, −0.707).

### Step 4: explained variance

Total variance = 4 + 1 = 5 (also equal to var(x₁) + var(x₂) = 2.5 + 2.5).

- PC1 explains 4 ÷ 5 = **80%**.
- PC2 explains 1 ÷ 5 = **20%**.

This fraction is the **explained variance ratio**.

### Step 5: project the data

The new coordinate of a point on a component = dot product of the centred point with the unit direction.

| Centred point | PC1 score = (x₁ + x₂)/√2 | PC2 score = (x₁ − x₂)/√2 |
|---|---|---|
| (2, 2) | 4/1.414 = **2.828** | 0 |
| (−2, −2) | **−2.828** | 0 |
| (1, −1) | 0 | 2/1.414 = **1.414** |
| (−1, 1) | 0 | **−1.414** |

Check: the variance of the PC1 scores = (8 + 8 + 0 + 0) ÷ 4 = 4 (its eigenvalue) and of the PC2 scores = (0 + 0 + 2 + 2) ÷ 4 = 1. The new features are also **uncorrelated** with each other — a key property of PCA.

If we keep only PC1, each point becomes one number: 2.828, −2.828, 0, 0. We lost the 20% of variance in PC2: points (6, 4) and (4, 6) now look identical. That is the price of compression.

### Step 6 (optional): reconstruct

To go back to 2-D from PC1 only: x ≈ mean + score × PC1. For (6, 4): (5, 5) + 0 × (0.707, 0.707) = (5, 5). The **reconstruction error** is the squared distance to the true point: (6 − 5)² + (4 − 5)² = 2. PCA chooses the directions that make the total reconstruction error as small as possible — "maximum variance kept" and "minimum reconstruction error" are the same goal.

<div class="formula">

| PCA recipe | |
|---|---|
| 1. Standardise (or at least centre) each feature | X → X − mean (÷ std) |
| 2. Covariance matrix | C = XᵀX ÷ (n − 1) |
| 3. Eigen-decomposition (in practice: SVD of X) | C·v = λ·v |
| 4. Sort components by eigenvalue λ, largest first | λ₁ ≥ λ₂ ≥ … |
| 5. Explained variance ratio of component i | λᵢ ÷ Σλ |
| 6. Project | Z = X · V_k (first k eigenvectors as columns) |

</div>

In practice libraries compute PCA with the **singular value decomposition (SVD)** of the centred data, which is faster and more numerically stable than building the covariance matrix.

## Choosing the number of components

Options:

1. **Cumulative explained variance**: keep enough components to explain, say, 90–99% of the variance. In scikit-learn: `PCA(n_components=0.95)`.
2. **Scree plot**: plot each component's explained variance and look for the elbow, like K-Means.
3. **For visualisation**: 2 or 3, whatever the variance.
4. **Downstream performance**: treat the number of components as a hyperparameter and pick the value that gives the best cross-validated score.

## PCA in scikit-learn

The four-point example:

```python
import numpy as np
from sklearn.decomposition import PCA

X = np.array([[7, 7], [3, 3], [6, 4], [4, 6]])
pca = PCA(n_components=2).fit(X)
print(pca.mean_)                              # [5. 5.]
print(pca.components_.round(3))               # rows = PC directions (signs may be flipped)
print(pca.explained_variance_.round(3))       # eigenvalues with n-1: [5.333 1.333]
print(pca.explained_variance_ratio_)          # [0.8 0.2]
print(pca.transform(X).round(3))              # PC scores (signs may be flipped)
```

```text
[5. 5.]
[[ 0.707  0.707]
 [ 0.707 -0.707]]
[5.333 1.333]
[0.8 0.2]
[[ 2.828  0.   ]
 [-2.828  0.   ]
 [ 0.     1.414]
 [ 0.    -1.414]]
```

The eigenvalues are 5.333 and 1.333 instead of 4 and 1 because scikit-learn divides by n − 1 = 3 (4 × 4/3 = 5.333). The ratios are the same.

> **Common mistake:** Expecting PCA signs to be fixed. A direction (0.707, 0.707) and (−0.707, −0.707) describe the same axis. Different libraries or versions may flip signs. Never write code that depends on the sign of a component.

A realistic example: the digits dataset (1,797 images of 8 × 8 pixels = 64 features).

```python
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
import numpy as np

X, y = load_digits(return_X_y=True)

pca = PCA().fit(X)
cum = np.cumsum(pca.explained_variance_ratio_)
print("components for 90%:", np.argmax(cum >= 0.90) + 1)
print("components for 95%:", np.argmax(cum >= 0.95) + 1)

# PCA inside a pipeline, so it is fitted only on training folds
for k in [5, 10, 20, 40, 64]:
    pipe = make_pipeline(StandardScaler(), PCA(n_components=k), LogisticRegression(max_iter=2000))
    print(k, round(cross_val_score(pipe, X, y, cv=5).mean(), 3))
```

```text
components for 90%: 21
components for 95%: 29
5  0.7...
10 0.8...
20 0.9...
40 0.9...
64 0.9...
(approximate: accuracy rises quickly and then flattens; about 20-30 components give most of the accuracy of all 64)
```

The pixels on the image border are almost always 0 and carry no information, and neighbouring pixels are highly correlated, so 64 features compress well.

### Practical points

- **Scale first** when features have different units. PCA on unscaled data just finds the feature with the biggest numbers.
- **Fit PCA on training data only**, inside a `Pipeline`, to avoid leakage.
- PCA components are **linear combinations** of all original features, so they are hard to explain ("PC3 = 0.4 × age − 0.3 × income + …").
- PCA does not use the label. The direction with the most variance is not always the most useful for prediction. If you have labels, **Linear Discriminant Analysis (LDA)** finds directions that separate classes.
- For huge or sparse data: `IncrementalPCA` (in batches), `TruncatedSVD` (works on sparse matrices such as TF-IDF without centring — this is **latent semantic analysis**), or `PCA(svd_solver="randomized")`.
- **Whitening** (`whiten=True`) also scales each component to unit variance.

## Non-linear methods for visualisation: t-SNE and UMAP

PCA is linear: it can only rotate and flatten. If the data lies on a curved surface (like a rolled-up sheet), PCA squashes it badly. For **visualising** clusters in high-dimensional data — such as sentence embeddings — we use non-linear methods.

### t-SNE

**t-SNE** (t-distributed Stochastic Neighbour Embedding) tries to keep **neighbours together**. It measures, for every pair of points, how likely they are to be neighbours in the high-dimensional space, and then places points in 2-D so that these neighbour probabilities are similar.

- Main hyperparameter: **perplexity** (roughly the number of effective neighbours; typical 5–50, default 30).
- Very good at showing local cluster structure.
- **Cluster sizes and distances between clusters in a t-SNE plot mean very little.** Two clusters far apart in the plot are not necessarily far apart in reality.
- Slow on large data (use PCA to 50 dimensions first).
- No `transform` for new points in scikit-learn — you must re-run it on all data.
- Results change with the random seed and perplexity.

### UMAP

**UMAP** (Uniform Manifold Approximation and Projection) has a similar goal but is based on building a neighbour graph and laying it out in 2-D.

- Usually **much faster** than t-SNE and scales to millions of points.
- Keeps more of the **global** structure (relative positions of clusters) than t-SNE, though still not perfectly.
- Can `transform` new points.
- Main hyperparameters: `n_neighbors` (local vs global balance, default 15) and `min_dist` (how tightly points pack, default 0.1).
- Also used as a pre-step before clustering embeddings (UMAP → HDBSCAN).
- Lives in the separate `umap-learn` package.

| | PCA | t-SNE | UMAP |
|---|---|---|---|
| Type | Linear | Non-linear | Non-linear |
| Main use | Compression, preprocessing, denoising, quick plots | 2-D/3-D visualisation | Visualisation, preprocessing for clustering |
| Keeps | Global variance | Local neighbourhoods | Local + some global structure |
| Speed | Very fast | Slow | Fast |
| Deterministic | Yes (up to sign) | No (random) | No (random unless seeded) |
| Transform new data | Yes | No (scikit-learn) | Yes |
| Interpretable axes | Partly (loadings) | No | No |
| Use as model input? | Yes | No | Sometimes |

```python
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt

X, y = load_digits(return_X_y=True)

X_pca = PCA(n_components=2).fit_transform(X)
X_tsne = TSNE(n_components=2, perplexity=30, init="pca", random_state=42).fit_transform(X)

# UMAP: pip install umap-learn
import umap
X_umap = umap.UMAP(n_neighbors=15, min_dist=0.1, random_state=42).fit_transform(X)

fig, axes = plt.subplots(1, 3, figsize=(15, 4))
for ax, Z, title in zip(axes, [X_pca, X_tsne, X_umap], ["PCA", "t-SNE", "UMAP"]):
    ax.scatter(Z[:, 0], Z[:, 1], c=y, s=5, cmap="tab10")
    ax.set_title(title)
plt.show()
# PCA: digits overlap heavily. t-SNE and UMAP: ten clearly separated groups.
```

> **Interview tip:** If asked "how would you check whether your embedding model groups similar support tickets together?", say: embed a sample, reduce with UMAP (or PCA then t-SNE) to 2-D, colour points by known category, and look for clean groups — but confirm with a numeric metric such as retrieval accuracy or silhouette, because these plots can mislead.

## Other methods worth knowing by name

| Method | Idea |
|---|---|
| Linear Discriminant Analysis (LDA) | Supervised; finds directions that best separate known classes |
| Truncated SVD / LSA | PCA-like on sparse matrices (TF-IDF) |
| Kernel PCA | PCA with a kernel, for non-linear structure |
| Autoencoder | Neural network that compresses input to a small "bottleneck" and reconstructs it; non-linear PCA |
| Random projection | Multiply by a random matrix; surprisingly preserves distances; very fast |
| Matryoshka / truncated embeddings | Some modern embedding models are trained so that the first k numbers alone still work, letting you shorten vectors |

## Pros, cons and when to use PCA

| Pros | Cons |
|---|---|
| Fast, deterministic, well understood | Only linear structure |
| Removes correlation and some noise | Components are hard to interpret |
| Speeds up downstream models | Needs scaling; sensitive to outliers |
| Good for visualising and compressing | Ignores the label; may drop useful low-variance signals |

**Use PCA when:** you have many correlated numeric features, need speed or compression, want to reduce noise before KNN/clustering, or want a quick 2-D view. **Skip it when:** you use tree models (they handle many features well and lose interpretability), or features are few and meaningful.

**Hyperparameters that matter:** `n_components` (number or variance fraction), `whiten`, `svd_solver`. For t-SNE: `perplexity`. For UMAP: `n_neighbors`, `min_dist`, `metric` (use `"cosine"` for embeddings).

## Key terms

| Term | Simple meaning |
|---|---|
| Dimensionality reduction | Representing data with fewer features |
| Feature selection | Keeping a subset of the original features |
| Feature extraction | Creating new features from combinations of old ones |
| PCA | Finding perpendicular directions of maximum variance |
| Principal component | One of those directions (PC1, PC2, …) |
| Centring | Subtracting the mean of each feature |
| Covariance matrix | Table of how each pair of features varies together |
| Eigenvector / eigenvalue | A direction a matrix only stretches / the stretch amount (= variance in PCA) |
| Explained variance ratio | Fraction of total variance captured by a component |
| Scree plot | Plot of variance per component |
| Projection / scores | Coordinates of points on the new axes |
| Reconstruction error | Squared difference between a point and its compressed-then-restored version |
| SVD | Matrix factorisation used to compute PCA efficiently |
| Whitening | Scaling components to unit variance |
| LDA | Supervised projection that separates classes |
| Truncated SVD / LSA | PCA-like reduction for sparse text matrices |
| t-SNE | Non-linear 2-D map that keeps local neighbours together |
| Perplexity | t-SNE's effective neighbourhood size |
| UMAP | Fast non-linear map that keeps local and some global structure |
| Autoencoder | Neural network that learns a compressed representation |

## Interview questions

**What does PCA do, in simple words?**
It finds new axes — principal components — that are combinations of the original features, ordered by how much of the data's variance they capture. Keeping the first few gives a smaller representation that preserves as much spread as possible, and the new features are uncorrelated.

**Why do we standardise data before PCA?**
PCA looks for directions of maximum variance, and variance depends on units. Without scaling, a feature measured in rupees with huge variance would dominate PC1 regardless of its importance. Standardising gives every feature equal starting weight.

**How do you choose the number of principal components?**
Keep enough to reach a cumulative explained variance target like 95%, look for an elbow in the scree plot, or treat it as a hyperparameter and choose by cross-validated performance of the downstream model. For visualisation, use 2 or 3.

**What are eigenvalues and eigenvectors in PCA?**
The eigenvectors of the covariance matrix are the principal component directions; each eigenvalue is the variance of the data along its eigenvector. Sorting by eigenvalue gives the components in order of importance, and eigenvalue divided by the sum is the explained variance ratio.

**Is PCA supervised or unsupervised? What is the risk?**
Unsupervised — it ignores the label. The risk is that a low-variance direction that is very predictive gets dropped. If class separation is the goal, LDA or supervised feature selection may be better.

**What is the difference between PCA and t-SNE?**
PCA is a linear, deterministic projection that preserves global variance, can transform new data, and can be used as model input. t-SNE is a non-linear, random method that preserves local neighbourhoods for visualisation only; distances between clusters and cluster sizes in its plots are not meaningful.

**Why prefer UMAP over t-SNE?**
UMAP is much faster on large data, keeps more of the global arrangement of clusters, and can transform new points. Both are mainly for visualisation; UMAP is also used before clustering embeddings.

**Can PCA be used for feature selection?**
Not directly — every component mixes all original features, so you still need all features to compute it. PCA is feature extraction. For selection, use methods like Lasso, tree importance or recursive feature elimination.

**How is PCA computed in practice?**
Usually via the singular value decomposition of the centred data matrix: X = UΣVᵀ. The columns of V are the principal directions and the squared singular values divided by n − 1 are the eigenvalues. This avoids explicitly forming the covariance matrix and is more stable.

**What is the relationship between PCA and autoencoders?**
A linear autoencoder with a small bottleneck trained with MSE learns the same subspace as PCA. Non-linear autoencoders generalise this to curved structure, at the cost of training a neural network.

**Should you apply PCA before training a random forest?**
Usually not. Trees handle many features well, PCA removes interpretability, and rotating features can make axis-aligned splits less effective. PCA helps more for distance-based models, linear models with correlated features, and very high-dimensional data.

## Try it yourself

1. **PCA by hand.** Points (1, 2), (3, 4), (5, 6). Centre them, compute the covariance matrix (divide by n), find PC1 and its explained variance ratio.
   *Hint: all points lie on one line.*
2. **Explained variance.** Eigenvalues of a 4-feature dataset are 6, 2, 1.5, 0.5. How many components keep at least 90% of the variance?
   *Hint: total = 10.*
3. **Projection.** With PC1 = (0.6, 0.8) and mean (2, 3), what is the PC1 score of the point (5, 7)?
   *Hint: centre first, then take the dot product.*
4. **Code.** On `load_breast_cancer`, compare 5-fold accuracy of `LogisticRegression` with and without `PCA(n_components=0.95)` (both with `StandardScaler`). How many components were kept?
   *Hint: after fitting, check `pipe.named_steps["pca"].n_components_`.*

### Answers

1. Mean (3, 4). Centred: (−2, −2), (0, 0), (2, 2). var(x₁) = var(x₂) = cov = 8/3 ≈ 2.667. C = [[2.667, 2.667], [2.667, 2.667]], eigenvalues 5.333 and 0. PC1 = (1, 1)/√2, explaining **100%** of the variance — the data is really 1-D.
2. Cumulative: 6/10 = 60%, 8/10 = 80%, 9.5/10 = 95%. **Three** components.
3. Centred: (3, 4). Score = 3 × 0.6 + 4 × 0.8 = 1.8 + 3.2 = **5.0**.
4. About 10 components keep 95% of the variance of the 30 standardised features; accuracy stays roughly the same (about 0.97–0.98) with or without PCA.

**Next:** [Evaluation Metrics](/interview/machine-learning/evaluation-metrics)
