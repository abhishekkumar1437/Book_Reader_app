---
title: KNN, SVM and Naive Bayes
part: Core Algorithms
summary: Three classic classifiers with very different ideas — K-nearest neighbours worked by hand with five points, distance metrics and the curse of dimensionality, support vector machines with margins, hinge loss and kernels, and Naive Bayes on a spam example with Laplace smoothing.
---

This chapter covers three algorithms that interviewers still ask about all the time, because each one teaches a core idea. **KNN** teaches distance and similarity — the same idea behind vector search in RAG systems. **SVM** teaches margins and kernels. **Naive Bayes** teaches probabilistic thinking with Bayes' theorem and is still a strong, fast baseline for text classification.

> **In simple words:** KNN says "you are like your nearest neighbours". SVM says "draw the boundary with the widest possible gap between the classes". Naive Bayes says "use word probabilities from each class and Bayes' theorem to see which class most likely produced this message".

## K-nearest neighbours (KNN)

### The idea

To classify a new point, find the **k** training points closest to it and take a **majority vote** of their labels. For regression, average their values. There is no real training step: the model just stores the data. This is called a **lazy learner** or **instance-based learning**.

> **Real-life example:** You move to a new city and want to guess if a restaurant is good. You ask the 5 people who live closest to it. If 4 of them say "good", you go. That is KNN with k = 5.

### Worked example with five points

Training data (two features, two classes):

| Point | x₁ | x₂ | Class |
|---|---|---|---|
| A | 1 | 1 | Red |
| B | 2 | 1 | Red |
| C | 4 | 4 | Blue |
| D | 5 | 3 | Blue |
| E | 2 | 3 | Red |

Classify the new point **Q = (4, 3)**.

**Step 1: Euclidean distance** from Q to each point, d = √((x₁ − 4)² + (x₂ − 3)²):

| Point | Differences | Squared sum | Distance | Rank |
|---|---|---|---|---|
| A | (−3, −2) | 9 + 4 = 13 | 3.606 | 5 |
| B | (−2, −2) | 4 + 4 = 8 | 2.828 | 4 |
| C | (0, 1) | 0 + 1 = 1 | 1.000 | 1 (tie) |
| D | (1, 0) | 1 + 0 = 1 | 1.000 | 1 (tie) |
| E | (−2, 0) | 4 + 0 = 4 | 2.000 | 3 |

**Step 2: vote.**

- k = 1: nearest is C or D, both Blue → **Blue**.
- k = 3: C (Blue), D (Blue), E (Red) → 2 Blue, 1 Red → **Blue**.
- k = 5: all points → 3 Red, 2 Blue → **Red**!

The answer depends on k. With k = 5 we use every point, so the majority class always wins — that is too smooth. With k = 1, one noisy point decides everything — too sensitive.

**Step 3: distance-weighted voting.** Give each neighbour a vote of 1 ÷ distance. With k = 5:

- Blue: 1/1 + 1/1 = **2.0**
- Red: 1/2 + 1/2.828 + 1/3.606 = 0.5 + 0.354 + 0.277 = **1.131**

Blue wins, because the close points count more. In scikit-learn: `weights="distance"`.

### Choosing k

| Small k (1–3) | Large k (50+) |
|---|---|
| Wiggly, complex boundary | Smooth, simple boundary |
| Low bias, high variance (overfits noise) | High bias, low variance (underfits) |
| Sensitive to mislabelled points | Majority class may dominate |

Pick k by cross-validation. A common start is k = 5, or about √n. For binary problems use an **odd** k to avoid ties.

### Distance metrics

| Metric | Formula (for vectors a, b) | Use for |
|---|---|---|
| Euclidean (L2) | √Σ(aᵢ − bᵢ)² | Default for continuous features |
| Manhattan (L1) | Σ abs(aᵢ − bᵢ) | Grid-like movement; more robust to one large difference |
| Minkowski | (Σ abs(aᵢ − bᵢ)ᵖ)^(1/p) | General form: p = 1 Manhattan, p = 2 Euclidean |
| Cosine distance | 1 − (a·b) ÷ (‖a‖·‖b‖) | Text and embeddings: direction matters, length does not |
| Hamming | Number of positions that differ | Binary or categorical vectors |

For our Q, the Manhattan distances are A = 3 + 2 = 5, B = 4, C = 1, D = 1, E = 2 — the same ranking here, but not in general.

Cosine example: a = (1, 2) and b = (2, 4) point in the same direction. a·b = 2 + 8 = 10, ‖a‖ = √5, ‖b‖ = √20, so cosine similarity = 10 ÷ √100 = 1 and cosine distance = 0, even though their Euclidean distance is √5 ≈ 2.24. This is why embedding search in RAG uses cosine similarity (see [Embeddings and Semantic Search](/interview/ai-engineer/llms-genai/embeddings-and-semantic-search) and [Vectors and Matrices](/interview/ai-engineer/math-for-ml/vectors-and-matrices)).

### Why scaling is essential for KNN

Two customers: (age 30, income ₹50,000) and (age 60, income ₹51,000). Euclidean distance = √(30² + 1000²) ≈ 1000.4. The age difference of 30 years barely counts, because income is measured in bigger numbers. After standardising both features, each contributes fairly. **Always scale features before KNN** (and before SVM and K-Means).

### The curse of dimensionality

As the number of features grows, distance-based methods break down. This is called the **curse of dimensionality**.

Worked example: points spread evenly in a unit cube. To capture just 10% of the data around a point, how long must each side of a small cube be?

- 1 dimension: side = 0.1 (10% of the range).
- 10 dimensions: side = 0.1^(1/10) ≈ **0.79** (79% of each feature's range!).
- 100 dimensions: side = 0.1^(1/100) ≈ **0.98**.

In high dimensions, the "neighbourhood" covers almost the whole range of every feature, so "nearest" neighbours are not really near. Also, distances between all pairs become almost the same, so the difference between nearest and farthest shrinks. Remedies: feature selection, dimensionality reduction ([Dimensionality Reduction and PCA](/interview/ai-engineer/machine-learning/dimensionality-reduction-pca)), or models that do not rely on raw distances.

### KNN cost

Training is O(1) (just store data), but each prediction compares against all n training points: O(n × d). For millions of points, use tree indexes (KD-tree, Ball tree) or **approximate nearest neighbour (ANN)** methods such as HNSW, which vector databases use (see [Vector Databases](/interview/ai-engineer/llms-genai/vector-databases)).

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
import numpy as np

# The five-point example
X5 = np.array([[1, 1], [2, 1], [4, 4], [5, 3], [2, 3]])
y5 = np.array(["Red", "Red", "Blue", "Blue", "Red"])
for k in (3, 5):
    knn = KNeighborsClassifier(n_neighbors=k).fit(X5, y5)
    print(k, knn.predict([[4, 3]]))                    # 3 -> ['Blue'], 5 -> ['Red']
print(KNeighborsClassifier(n_neighbors=5, weights="distance").fit(X5, y5).predict([[4, 3]]))  # ['Blue']

# A real dataset: scaling + tuning k
X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
pipe = Pipeline([("scale", StandardScaler()), ("knn", KNeighborsClassifier())])
grid = GridSearchCV(pipe, {"knn__n_neighbors": [1, 3, 5, 7, 11, 15, 21],
                           "knn__weights": ["uniform", "distance"],
                           "knn__p": [1, 2]}, cv=5)
grid.fit(X_train, y_train)
print(grid.best_params_, round(grid.score(X_test, y_test), 3))
```

```text
3 ['Blue']
5 ['Red']
['Blue']
{'knn__n_neighbors': ..., 'knn__p': ..., 'knn__weights': ...} 0.96...   (about 0.95-0.97)
```

Without the `StandardScaler`, the same KNN scores several points lower on this dataset — try it.

### KNN: pros, cons, hyperparameters

| Pros | Cons |
|---|---|
| Simple; no training | Slow predictions on large data |
| Naturally multiclass; flexible boundaries | Needs scaling; hurt by irrelevant features |
| Easy to update (just add points) | Curse of dimensionality |
| | Must store the whole training set |

**Hyperparameters that matter:** `n_neighbors` (k), `weights` ("uniform" or "distance"), `metric` / `p`. **Use it for:** small, low-dimensional data, recommendation-style "similar items", a quick baseline, and as the mental model for vector search.

## Support vector machines (SVM)

### The idea: the widest street

Many lines can separate two classes. Which is best? SVM chooses the line with the **largest margin** — the widest "street" between the classes, with no points inside it. The idea is that a wide gap generalises better to new points.

- The boundary is w·x + b = 0.
- The two edges of the street are w·x + b = +1 and w·x + b = −1.
- The **margin** (street width) is **2 ÷ ‖w‖**. Maximising the margin = minimising ‖w‖.
- The points lying on the edges are the **support vectors**. Only they decide the boundary; you could delete every other training point and get the same SVM.

<figure>
<svg viewBox="0 0 380 220" width="380" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="30" y1="200" x2="360" y2="200" />
<line x1="30" y1="200" x2="30" y2="20" />
<text x="350" y="215" fill="currentColor" stroke="none">x₁</text>
<text x="12" y="28" fill="currentColor" stroke="none">x₂</text>
<line x1="30" y1="75" x2="255" y2="200" stroke="var(--accent)" stroke-width="2.5" />
<line x1="30" y1="100" x2="210" y2="200" stroke-dasharray="5 4" />
<line x1="30" y1="50" x2="300" y2="200" stroke-dasharray="5 4" />
<circle cx="75" cy="175" r="5" />
<circle cx="75" cy="150" r="5" />
<circle cx="120" cy="175" r="5" />
<circle cx="120" cy="150" r="7" stroke-width="3" />
<circle cx="97.5" cy="137.5" r="7" stroke-width="3" />
<rect x="160" y="120" width="10" height="10" fill="var(--accent)" stroke="var(--accent)" />
<rect x="158" y="118" width="14" height="14" stroke-width="2" />
<rect x="205" y="95" width="10" height="10" fill="var(--accent)" stroke="var(--accent)" />
<rect x="250" y="120" width="10" height="10" fill="var(--accent)" stroke="var(--accent)" />
<rect x="205" y="70" width="10" height="10" fill="var(--accent)" stroke="var(--accent)" />
<text x="235" y="30" fill="var(--accent)" stroke="none">solid: w·x + b = 0</text>
<text x="235" y="46" fill="currentColor" stroke="none">dashed: ±1 edges</text>
<text x="235" y="62" fill="currentColor" stroke="none">margin = 2 ÷ ‖w‖</text>
<text x="235" y="78" fill="currentColor" stroke="none">bold = support vectors</text>
</svg>
<figcaption>The SVM boundary (solid) sits in the middle of the widest street (dashed edges); only the support vectors on the edges determine it.</figcaption>
</figure>

### Worked example

In the figure, the boundary is x₁ + x₂ − 5 = 0, so w = (1, 1) and b = −5. (The figure's two dashed edges are x₁ + x₂ = 4 and x₁ + x₂ = 6.)

- ‖w‖ = √(1² + 1²) = √2 ≈ 1.414.
- Margin = 2 ÷ 1.414 ≈ **1.414**.
- Classify the point (4, 4): w·x + b = 4 + 4 − 5 = 3 > 0 → positive class. Its distance from the boundary is 3 ÷ √2 ≈ 2.12.
- The point (2, 2): 2 + 2 − 5 = −1 → exactly on the −1 edge → a support vector.

If instead w = (3, 4), then ‖w‖ = 5 and the margin = 2 ÷ 5 = 0.4. Bigger weights mean a narrower street.

### Soft margin and the C parameter

Real data is rarely perfectly separable, and one outlier should not force a terrible boundary. A **soft-margin SVM** allows some points inside the street or on the wrong side, but charges a penalty. The penalty is the **hinge loss**:

<div class="formula">

| Formula | Meaning |
|---|---|
| f(x) = w·x + b, label y ∈ {−1, +1} | the SVM score |
| hinge loss = max(0, 1 − y·f(x)) | 0 if correct and outside the street; grows linearly otherwise |
| objective = ½‖w‖² + C · Σ hinge losses | wide margin vs few violations |

</div>

Hinge loss with w = (1, 1), b = −5:

| Point | y | f(x) | y·f(x) | Hinge loss |
|---|---|---|---|---|
| (1, 2) | −1 | −2 | 2 | max(0, −1) = 0 (correct, outside street) |
| (3, 3) | +1 | 1 | 1 | 0 (exactly on the edge) |
| (2.5, 3) | +1 | 0.5 | 0.5 | 0.5 (correct but inside the street) |
| (3, 1) | +1 | −1 | −1 | 2 (wrong side) |

**C** controls the trade-off:

- **Large C**: violations are expensive → narrow margin, fits training data closely → risk of overfitting.
- **Small C**: violations are cheap → wide margin, more errors allowed → smoother, may underfit.

### Kernels: curved boundaries

What if the classes are not separable by a straight line? Example in 1-D: negatives at x = −1, 0, 1 and positives at x = −3, 3. No single threshold separates them. But add a new feature x²: negatives get 1, 0, 1 and positives get 9, 9. Now the threshold x² = 4 separates them perfectly. Mapping data into a higher-dimensional space where it becomes linearly separable is the key idea.

The **kernel trick** makes this cheap. The SVM only needs dot products between pairs of points. A **kernel function** K(a, b) computes the dot product in the high-dimensional space **without ever creating** the new features.

| Kernel | Formula | Shape of boundary |
|---|---|---|
| Linear | a·b | Straight line / hyperplane |
| Polynomial | (γ·a·b + r)ᵈ | Curves of degree d |
| RBF (Gaussian) | exp(−γ·‖a − b‖²) | Any smooth shape; the default |
| Sigmoid | tanh(γ·a·b + r) | Rarely used |

RBF example: two points at squared distance 1 with γ = 0.5 have K = e^(−0.5) ≈ 0.607. Points far apart have K close to 0. So the RBF kernel is a similarity score.

**γ (gamma)** for RBF controls how far one training point's influence reaches:

- Large γ → each point influences only a tiny area → very wiggly boundary → overfitting.
- Small γ → wide influence → smooth boundary → may underfit.

C and γ are tuned together, usually on a log grid (0.01, 0.1, 1, 10, 100).

```python
from sklearn.svm import SVC, LinearSVC
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import GridSearchCV

svm = make_pipeline(StandardScaler(), SVC(kernel="rbf"))       # scaling is essential for SVM
params = {"svc__C": [0.1, 1, 10, 100], "svc__gamma": ["scale", 0.001, 0.01, 0.1]}
grid = GridSearchCV(svm, params, cv=5, n_jobs=-1).fit(X_train, y_train)
print(grid.best_params_, round(grid.score(X_test, y_test), 3))

best = grid.best_estimator_.named_steps["svc"]
print("support vectors per class:", best.n_support_)

# Probabilities need probability=True (slower: uses internal cross-validation, Platt scaling)
svm_proba = make_pipeline(StandardScaler(), SVC(C=1, probability=True, random_state=0))

# For large, high-dimensional data (e.g. text), a linear SVM is much faster
lin = make_pipeline(StandardScaler(), LinearSVC(C=1.0))
```

```text
{'svc__C': ..., 'svc__gamma': ...} 0.97...   (about 0.96-0.98 on breast cancer)
support vectors per class: [.. ..]            (a few dozen per class)
```

### SVM: pros, cons, when to use

| Pros | Cons |
|---|---|
| Strong on small and medium data | Training is slow for large n (kernel SVM is roughly O(n²) to O(n³)) |
| Works in high dimensions (text) | Needs scaling and careful C, γ tuning |
| Kernels give flexible boundaries | No native probabilities (needs calibration) |
| Only support vectors matter (memory at prediction) | Hard to interpret with non-linear kernels |

**Use it when:** data has up to tens of thousands of rows, many features, and clear margins (text classification with `LinearSVC`, small image or bioinformatics datasets). For large tabular data, gradient boosting is usually better and faster.

> **Interview tip:** Be ready to say "the margin is 2/‖w‖, so maximising the margin is minimising ‖w‖²; C trades margin width against violations measured by hinge loss; kernels let SVM compute dot products in a high-dimensional space without building it".

## Naive Bayes

### The idea: Bayes' theorem plus a "naive" shortcut

**Bayes' theorem** turns "how likely is this evidence if the class is spam" into "how likely is spam given this evidence" (see [Probability Basics](/interview/ai-engineer/math-for-ml/probability-basics)):

<div class="formula">

| Formula | Meaning |
|---|---|
| P(class ∣ x) = P(x ∣ class) · P(class) ÷ P(x) | Bayes' theorem |
| P(class) | **prior**: how common the class is before seeing the message |
| P(x ∣ class) | **likelihood**: how likely these words are in that class |
| P(class ∣ x) | **posterior**: what we want |
| Naive assumption: P(x₁, x₂, … ∣ class) = P(x₁ ∣ class) × P(x₂ ∣ class) × … | features independent given the class |

</div>

The **naive** part is assuming that the words are independent of each other once you know the class. That is obviously false ("free" and "prize" often appear together), but the classifier still works well, because it only needs to rank the classes correctly, not get exact probabilities.

Since P(x) is the same for every class, we compare P(x ∣ class) · P(class) and normalise at the end.

### Worked example: spam filter

Training data: 10 emails, 4 spam and 6 not spam ("ham"). We count words over a tiny vocabulary of 3 words: free, win, meeting.

| | free | win | meeting | Total words |
|---|---|---|---|---|
| Spam (4 emails) | 6 | 4 | 0 | 10 |
| Ham (6 emails) | 1 | 1 | 8 | 10 |

Priors: P(spam) = 4/10 = 0.4, P(ham) = 0.6.

**Problem: zero counts.** "meeting" never appears in spam, so P(meeting ∣ spam) = 0, and any email containing "meeting" would get spam probability exactly 0 — no matter how many spam words it has. Fix: **Laplace smoothing** (add-one smoothing). Add α = 1 to every count, and add α × (vocabulary size) = 3 to the total:

P(word ∣ class) = (count + 1) ÷ (total + 3)

| | P(free ∣ c) | P(win ∣ c) | P(meeting ∣ c) |
|---|---|---|---|
| Spam | 7/13 = 0.538 | 5/13 = 0.385 | 1/13 = 0.077 |
| Ham | 2/13 = 0.154 | 2/13 = 0.154 | 9/13 = 0.692 |

**New email 1: "free win".**

- Spam score = 0.4 × (7/13) × (5/13) = 0.4 × 35/169 = 14/169 ≈ **0.0828**
- Ham score = 0.6 × (2/13) × (2/13) = 0.6 × 4/169 = 2.4/169 ≈ **0.0142**
- P(spam ∣ email) = 0.0828 ÷ (0.0828 + 0.0142) = **0.854** → spam.

**New email 2: "free meeting".**

- Spam score = 0.4 × (7/13) × (1/13) = 2.8/169 ≈ 0.0166
- Ham score = 0.6 × (2/13) × (9/13) = 10.8/169 ≈ 0.0639
- P(spam ∣ email) = 2.8 ÷ (2.8 + 10.8) = **0.206** → not spam.

In code, libraries add **log** probabilities instead of multiplying many small numbers, because multiplying hundreds of tiny probabilities underflows to 0 on a computer.

### Types of Naive Bayes

| Variant | Feature type | Example use |
|---|---|---|
| `MultinomialNB` | Word counts / TF-IDF | Text classification, spam |
| `BernoulliNB` | Binary (word present or not) | Short texts |
| `GaussianNB` | Continuous, assumes a normal distribution per class | Sensor readings, quick baseline |
| `ComplementNB` | Counts, for imbalanced text classes | Imbalanced text |
| `CategoricalNB` | Categorical features | Survey answers |

```python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

texts = ["win a free prize now", "free cash offer win", "limited offer claim free prize",
         "meeting at noon tomorrow", "project meeting notes attached", "lunch tomorrow with the team"]
labels = [1, 1, 1, 0, 0, 0]                  # 1 = spam

nb = make_pipeline(CountVectorizer(), MultinomialNB(alpha=1.0))   # alpha = Laplace smoothing
nb.fit(texts, labels)

tests = ["free prize meeting", "team meeting tomorrow", "claim your free cash"]
print(nb.predict(tests))
print(nb.predict_proba(tests).round(3))      # columns: [P(ham), P(spam)]
```

```text
[1 0 1]
[[0.2   0.8  ]
 [0.947 0.053]
 [0.059 0.941]]
```

The word "your" was never seen in training, so `CountVectorizer` simply ignores it. (The default tokenizer also drops one-letter words like "a".)

### Naive Bayes: pros, cons, when to use

| Pros | Cons |
|---|---|
| Extremely fast to train and predict | Independence assumption is unrealistic |
| Works with very little data | Probabilities are often overconfident (badly calibrated) |
| Handles thousands of features (words) | Correlated features get double-counted |
| Simple to explain; incremental updates | Usually beaten by logistic regression or boosting with enough data |

**Hyperparameters that matter:** `alpha` (smoothing) for Multinomial/Bernoulli; `var_smoothing` for Gaussian. **Use it for:** text baselines (spam, sentiment, topic), very small datasets, and real-time systems that need tiny models.

## Comparing the three

| | KNN | SVM | Naive Bayes |
|---|---|---|---|
| Type | Instance-based, lazy | Margin-based, discriminative | Probabilistic, generative |
| Training cost | None | High for kernel SVM on big n | Very low |
| Prediction cost | High (compare to all points) | Medium (support vectors) | Very low |
| Needs scaling | Yes | Yes | No |
| Probabilities | Vote fractions | Only with calibration | Yes (often overconfident) |
| Best for | Small, low-dimensional data; similarity search | Small/medium data, high dimensions, text | Text, tiny data, speed |
| Key hyperparameters | k, weights, metric | C, kernel, γ | alpha |

> **Remember:** A **discriminative** model (logistic regression, SVM) learns the boundary P(y ∣ x) directly. A **generative** model (Naive Bayes) learns how each class generates data, P(x ∣ y), and uses Bayes' theorem to get P(y ∣ x).

## Key terms

| Term | Simple meaning |
|---|---|
| KNN | Classify by majority vote of the k closest training points |
| Lazy learner | Stores data and does the work at prediction time |
| Euclidean / Manhattan distance | Straight-line distance / sum of absolute differences |
| Minkowski distance | General distance with power p (p = 1 Manhattan, p = 2 Euclidean) |
| Cosine similarity | Similarity of direction: a·b ÷ (‖a‖‖b‖) |
| Curse of dimensionality | In many dimensions, neighbourhoods become huge and distances similar |
| ANN | Approximate nearest neighbour search, fast for large data |
| SVM | Classifier that finds the boundary with the widest margin |
| Margin | Width of the gap between classes; 2/‖w‖ |
| Support vectors | Training points on the margin edges that define the boundary |
| Hard / soft margin | No violations allowed / violations allowed with a penalty |
| Hinge loss | max(0, 1 − y·f(x)) |
| C | Penalty for margin violations (large = fit training data closely) |
| Kernel trick | Computing dot products in a high-dimensional space without building it |
| RBF kernel | exp(−γ‖a − b‖²), a similarity that decays with distance |
| γ (gamma) | How far one point's influence reaches in the RBF kernel |
| Naive Bayes | Bayes' theorem with the assumption that features are independent given the class |
| Prior / likelihood / posterior | P(class) / P(x ∣ class) / P(class ∣ x) |
| Laplace smoothing | Adding a small count so unseen words do not give zero probability |
| Discriminative vs generative | Model P(y ∣ x) directly vs model P(x ∣ y) and P(y) |

## Interview questions

**How does KNN work and what is its training time?**
It stores the training data. To predict, it computes the distance from the new point to every training point, takes the k closest, and returns the majority class (or average value). Training is essentially free; prediction costs O(n·d) per query without an index.

**How do you choose k in KNN?**
By cross-validation over a range of values. Small k gives a complex boundary that overfits noise; large k gives a smooth boundary that may underfit. Use an odd k for binary problems, and consider distance weighting.

**Why must you scale features for KNN and SVM?**
Both rely on distances or dot products. A feature with a large numeric range, such as income in rupees, would dominate the distance and the others would be ignored. Standardising puts every feature on a comparable scale.

**What is the curse of dimensionality?**
In high dimensions, data becomes very sparse: to include even a small fraction of the points you need a neighbourhood covering most of each feature's range, and distances between points become almost equal. Distance-based methods like KNN lose meaning. Dimensionality reduction and feature selection help.

**What are support vectors?**
The training points that lie on the margin edges or violate the margin. They alone determine the SVM boundary; removing any other point does not change the model.

**Explain the C parameter in SVM.**
C sets the penalty for margin violations. A large C punishes violations heavily, giving a narrow margin that fits the training data closely and may overfit. A small C allows more violations for a wider, smoother margin that may underfit.

**What is the kernel trick?**
An SVM only needs dot products between data points. A kernel function computes the dot product in a transformed, higher-dimensional feature space directly from the original vectors, so the SVM can learn non-linear boundaries without ever computing the transformed features. RBF and polynomial kernels are common.

**What does gamma do in an RBF SVM?**
Gamma controls how quickly the similarity decays with distance. A high gamma means each training point affects only a small region, giving a very flexible, overfitting boundary; a low gamma gives a smoother boundary. It is tuned together with C.

**Why is Naive Bayes called naive, and why does it still work?**
It assumes features are independent given the class, which is almost never true. It still works because classification only needs the correct class to have the highest score, and the errors from the assumption often affect all classes similarly. It is especially good for text with many weak word features.

**What is Laplace smoothing?**
Adding a small count (usually 1) to every word count per class, so that a word never seen in a class does not get zero probability and wipe out the whole product. Without it, a single unseen word would force the probability of that class to zero.

**When would you pick Naive Bayes over logistic regression?**
With very little training data, a huge vocabulary, a need for very fast training and updates, or as a quick text baseline. With more data, logistic regression usually wins because it does not rely on the independence assumption.

**Generative vs discriminative models?**
A discriminative model learns P(y ∣ x) or the boundary directly — logistic regression, SVM, trees. A generative model learns P(x ∣ y) and P(y) and uses Bayes' theorem — Naive Bayes, Gaussian mixture models. Generative models can work with less data and can generate samples; discriminative models are usually more accurate with enough data.

## Try it yourself

1. **KNN by hand.** Training: (0, 0) A, (1, 0) A, (0, 1) A, (3, 3) B, (4, 4) B. Classify (2, 2) with k = 1 and k = 3, using Euclidean distance.
   *Hint: compute all five distances first.*
2. **Margin.** An SVM has w = (6, 8). What is the margin width? Is the point (1, 1) with b = −10 inside the street?
   *Hint: the street is where abs(w·x + b) < 1.*
3. **Naive Bayes.** Using the smoothed table in this chapter, compute P(spam) for the email "win meeting".
   *Hint: multiply the prior by both word probabilities for each class.*
4. **Code.** Train `KNeighborsClassifier` on breast cancer with and without `StandardScaler`, and `SVC` with and without it. Report the four test accuracies.
   *Hint: use `make_pipeline` for the scaled versions.*

### Answers

1. Distances from (2, 2): (0, 0) → √8 = 2.83; (1, 0) → √5 = 2.24; (0, 1) → √5 = 2.24; (3, 3) → √2 = 1.41; (4, 4) → √8 = 2.83. k = 1: nearest is (3, 3) → **B**. k = 3: (3, 3) B, (1, 0) A, (0, 1) A → 2 A vs 1 B → **A**. The answer flips with k.
2. ‖w‖ = 10, margin = 2/10 = 0.2. w·x + b = 6 + 8 − 10 = 4. abs(4) > 1, so the point is outside the street, on the positive side.
3. Spam: 0.4 × (5/13) × (1/13) = 2/169. Ham: 0.6 × (2/13) × (9/13) = 10.8/169. P(spam) = 2 ÷ (2 + 10.8) = 0.156.
4. Typical results: KNN unscaled ≈ 0.92–0.94, scaled ≈ 0.96–0.97; SVC unscaled ≈ 0.92–0.94, scaled ≈ 0.97–0.98. Scaling matters for both.

**Next:** [Clustering: K-Means and DBSCAN](/interview/ai-engineer/machine-learning/clustering-kmeans-and-dbscan)
