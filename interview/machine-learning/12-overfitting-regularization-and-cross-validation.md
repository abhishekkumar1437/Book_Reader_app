---
title: Overfitting, Regularization and Cross-Validation
part: Making Models Good
summary: Why models memorise instead of learn — underfitting and overfitting, the bias-variance trade-off, learning curves, L1, L2 and ElasticNet regularization with worked numbers, and honest evaluation with k-fold, stratified, group and time-series cross-validation.
---

Every model you build will sit somewhere between "too simple" and "too complex". Too simple and it misses the pattern; too complex and it memorises noise that will never repeat. This chapter gives you the tools to see where a model sits (train vs validation scores, learning curves), to pull it back (regularization), and to measure it honestly (cross-validation). These ideas are used daily — from tuning a churn model to deciding when to stop fine-tuning an LLM — and "explain the bias-variance trade-off" is a top-five interview question.

> **In simple words:** Underfitting = the model is too simple, bad even on training data. Overfitting = the model memorised the training data, great there but bad on new data. Regularization adds a penalty for complexity to stop memorising. Cross-validation tests the model on several different held-out parts so the score is trustworthy.

## Underfitting and overfitting

<figure>
<svg viewBox="0 0 440 170" width="440" height="170" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="5" y="10" width="140" height="120" rx="4" />
<rect x="150" y="10" width="140" height="120" rx="4" />
<rect x="295" y="10" width="140" height="120" rx="4" />
<circle cx="20" cy="105" r="3" fill="currentColor" /><circle cx="35" cy="78" r="3" fill="currentColor" /><circle cx="50" cy="66" r="3" fill="currentColor" /><circle cx="65" cy="50" r="3" fill="currentColor" /><circle cx="80" cy="58" r="3" fill="currentColor" /><circle cx="95" cy="48" r="3" fill="currentColor" /><circle cx="110" cy="62" r="3" fill="currentColor" /><circle cx="125" cy="80" r="3" fill="currentColor" />
<line x1="10" y1="86" x2="140" y2="58" stroke="var(--accent)" stroke-width="2" />
<circle cx="165" cy="105" r="3" fill="currentColor" /><circle cx="180" cy="78" r="3" fill="currentColor" /><circle cx="195" cy="66" r="3" fill="currentColor" /><circle cx="210" cy="50" r="3" fill="currentColor" /><circle cx="225" cy="58" r="3" fill="currentColor" /><circle cx="240" cy="48" r="3" fill="currentColor" /><circle cx="255" cy="62" r="3" fill="currentColor" /><circle cx="270" cy="80" r="3" fill="currentColor" />
<path d="M 158 112 Q 222 0 285 92" stroke="var(--accent)" stroke-width="2" />
<circle cx="310" cy="105" r="3" fill="currentColor" /><circle cx="325" cy="78" r="3" fill="currentColor" /><circle cx="340" cy="66" r="3" fill="currentColor" /><circle cx="355" cy="50" r="3" fill="currentColor" /><circle cx="370" cy="58" r="3" fill="currentColor" /><circle cx="385" cy="48" r="3" fill="currentColor" /><circle cx="400" cy="62" r="3" fill="currentColor" /><circle cx="415" cy="80" r="3" fill="currentColor" />
<polyline points="302,120 310,105 318,70 325,78 333,85 340,66 348,35 355,50 363,72 370,58 378,30 385,48 393,75 400,62 408,95 415,80 428,40" stroke="var(--accent)" stroke-width="2" />
<text x="75" y="148" text-anchor="middle" fill="currentColor" stroke="none" font-weight="bold">Underfit</text>
<text x="75" y="163" text-anchor="middle" fill="currentColor" stroke="none">high bias</text>
<text x="220" y="148" text-anchor="middle" fill="currentColor" stroke="none" font-weight="bold">Good fit</text>
<text x="220" y="163" text-anchor="middle" fill="currentColor" stroke="none">balanced</text>
<text x="365" y="148" text-anchor="middle" fill="currentColor" stroke="none" font-weight="bold">Overfit</text>
<text x="365" y="163" text-anchor="middle" fill="currentColor" stroke="none">high variance</text>
</svg>
<figcaption>The same noisy points fitted three ways: a straight line misses the curve, a smooth curve captures it, and a wiggly curve chases every point including the noise.</figcaption>
</figure>

- **Underfitting**: the model is too simple to capture the real pattern. A straight line for curved data. It does badly on **both** training and validation data.
- **Overfitting**: the model is so flexible that it learns the noise in the training set. A degree-15 polynomial, a decision tree with unlimited depth, a neural network trained for too long on little data. It does very well on training data and badly on new data.
- **Good fit**: captures the real pattern, ignores the noise. Training and validation scores are both good and close to each other.

> **Real-life example:** Three students prepare for a maths exam. The first reads only the chapter titles (underfit — fails everything). The second memorises the answers to last year's paper word for word (overfit — perfect on old questions, lost on new ones). The third understands the methods and practises varied problems (good fit — does well on any paper).

### Diagnosing from scores

| Training score | Validation score | Diagnosis | What to do |
|---|---|---|---|
| Low | Low (similar) | Underfitting (high bias) | More complex model, better features, less regularization, train longer |
| High | Much lower | Overfitting (high variance) | More data, regularization, simpler model, early stopping, fewer features |
| High | High (close) | Good fit | Ship it (after a final test-set check) |
| Low | Higher than training | Usually a bug or leakage, or heavy regularization/dropout active only in training | Check the split and the data pipeline |

Example: a churn model with 0.99 training AUC and 0.71 validation AUC is overfitting. One with 0.72 and 0.71 is underfitting (if the business needs better than 0.72). One with 0.86 and 0.84 is healthy.

## The bias-variance trade-off

The expected error of a model on new data can be split into three parts:

<div class="formula">

| Formula | Meaning |
|---|---|
| Expected error = Bias² + Variance + Irreducible noise | for squared error |
| Bias | How far the **average** model (over many training sets) is from the truth — error from wrong assumptions |
| Variance | How much the model **changes** when trained on different samples — error from sensitivity to the data |
| Irreducible noise | Randomness in the data itself; no model can remove it |

</div>

- Simple models (linear regression on curved data, shallow trees, large k in KNN): **high bias, low variance**.
- Complex models (deep trees, high-degree polynomials, k = 1 KNN): **low bias, high variance**.

As complexity rises, bias falls and variance rises. Total error is U-shaped: the sweet spot is in the middle.

<figure>
<svg viewBox="0 0 400 210" width="400" height="210" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="40" y1="180" x2="380" y2="180" />
<line x1="40" y1="180" x2="40" y2="15" />
<text x="380" y="198" text-anchor="end" fill="currentColor" stroke="none">model complexity →</text>
<text x="46" y="24" fill="currentColor" stroke="none">error</text>
<path d="M 50 40 Q 120 150 370 165" stroke-dasharray="5 4" />
<path d="M 50 170 Q 280 160 370 40" stroke-dasharray="2 3" />
<path d="M 50 32 Q 200 178 370 32" stroke="var(--accent)" stroke-width="2.5" />
<line x1="205" y1="105" x2="205" y2="180" stroke="var(--accent)" stroke-dasharray="3 3" />
<text x="72" y="80" fill="currentColor" stroke="none">bias²</text>
<text x="322" y="112" fill="currentColor" stroke="none">variance</text>
<text x="235" y="70" fill="var(--accent)" stroke="none">total error</text>
<text x="205" y="196" text-anchor="middle" fill="var(--accent)" stroke="none">sweet spot</text>
<text x="70" y="172" fill="currentColor" stroke="none" font-size="11">underfit</text>
<text x="320" y="172" fill="currentColor" stroke="none" font-size="11">overfit</text>
</svg>
<figcaption>As complexity grows, bias falls and variance rises; total error is lowest in between, which is where regularization and tuning aim.</figcaption>
</figure>

> **Real-life example:** Throwing darts. High bias: all darts land close together but far from the bullseye (a consistent wrong aim). High variance: darts are spread all over the board, centred on the bullseye on average. You want darts tight **and** centred.

> **Interview tip:** Connect the trade-off to concrete knobs: "In a random forest I reduce variance by averaging trees; in gradient boosting I reduce bias by adding trees and control variance with learning rate, depth and early stopping; in KNN, small k is high variance and large k is high bias."

### Learning curves

A **learning curve** plots training and validation scores against the **training set size**. It tells you whether more data will help.

| Pattern | Meaning | Will more data help? |
|---|---|---|
| Both curves low and close together, flat | High bias (underfitting) | No — get a better model or features |
| Training high, validation much lower, gap shrinking as data grows | High variance (overfitting) | Yes — more data closes the gap |
| Both high and close | Good | Only a little |

A **validation curve** plots training and validation scores against a **hyperparameter** (such as `max_depth` or `alpha`). You pick the value where validation is best.

```python
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import learning_curve, validation_curve
from sklearn.tree import DecisionTreeClassifier

X, y = load_breast_cancer(return_X_y=True)

sizes, train_sc, val_sc = learning_curve(
    DecisionTreeClassifier(random_state=0), X, y,
    train_sizes=np.linspace(0.1, 1.0, 5), cv=5, scoring="accuracy",
)
for n, tr, va in zip(sizes, train_sc.mean(1), val_sc.mean(1)):
    print(f"n={n:4d}  train={tr:.3f}  val={va:.3f}")   # unpruned tree: train = 1.000 always; val rises slowly

depths = [1, 2, 3, 4, 6, 8, 12]
tr, va = validation_curve(DecisionTreeClassifier(random_state=0), X, y,
                          param_name="max_depth", param_range=depths, cv=5)
print([round(v, 3) for v in va.mean(1)])                # peaks around depth 3-5, then flattens or drops
```

## Regularization

**Regularization** means adding a penalty for model complexity to the training loss, so that the model prefers simpler solutions. For linear models, "complex" means large weights: large weights let the model react strongly to tiny changes in the input, which is how it fits noise.

<div class="formula">

| Method | Loss being minimised | Effect on weights |
|---|---|---|
| OLS (no penalty) | Σ(y − ŷ)² | — |
| **Ridge (L2)** | Σ(y − ŷ)² + λ · Σ wⱼ² | Shrinks all weights smoothly toward 0; rarely exactly 0 |
| **Lasso (L1)** | Σ(y − ŷ)² + λ · Σ abs(wⱼ) | Shrinks, and sets some weights **exactly** to 0 → feature selection |
| **ElasticNet** | Σ(y − ŷ)² + λ · [ρ · Σ abs(wⱼ) + (1 − ρ)/2 · Σ wⱼ²] | Mix of both; ρ = `l1_ratio` |

</div>

λ (lambda) is the **regularization strength**: λ = 0 means no penalty (plain OLS); large λ pushes weights strongly toward 0 (risk of underfitting). The intercept is not penalised. (scikit-learn's Lasso and ElasticNet divide the squared-error term by 2n, so their `alpha` values are on a different scale from Ridge's; the ideas are the same.)

### Worked example: Ridge shrinks the weight

Data x = 1, 2, 3 and y = 2, 4, 6 (true rule y = 2x), model ŷ = w·x with no intercept. Minimising Σ(y − wx)² + λw² gives the closed form:

w = Σxy ÷ (Σx² + λ)

Here Σxy = 2 + 8 + 18 = 28 and Σx² = 1 + 4 + 9 = 14.

| λ | w = 28 ÷ (14 + λ) | Effect |
|---|---|---|
| 0 | 28 ÷ 14 = **2.0** | Plain least squares |
| 1 | 28 ÷ 15 = **1.867** | Slight shrink |
| 14 | 28 ÷ 28 = **1.0** | Strong shrink (underfits this clean data) |

Ridge adds λ to the diagonal of XᵀX (the normal equation becomes (XᵀX + λI)⁻¹Xᵀy). This also fixes the problem of XᵀX not being invertible with correlated features, which is why Ridge is the standard fix for **multicollinearity** (see [Linear Regression](/interview/machine-learning/linear-regression)).

### Worked example: Lasso sets weights to zero

To compare Ridge and Lasso cleanly, imagine three uncorrelated, standardised features whose plain least-squares weights are **w = (3.0, 0.4, −0.2)**. In this special case (orthonormal features, loss Σ(y − ŷ)² + penalty), the formulas are simple:

- Ridge: w_ridge = w_ols ÷ (1 + λ)
- Lasso: w_lasso = sign(w_ols) × max(abs(w_ols) − λ/2, 0) — called **soft thresholding**

With λ = 1:

| Feature | OLS | Ridge: w ÷ 2 | Lasso: shrink by 0.5, stop at 0 |
|---|---|---|---|
| 1 | 3.0 | **1.5** | 3.0 − 0.5 = **2.5** |
| 2 | 0.4 | **0.2** | 0.4 − 0.5 < 0 → **0** |
| 3 | −0.2 | **−0.1** | → **0** |

Ridge shrinks every weight by the same **factor** — none becomes zero. Lasso subtracts the same **amount** — small weights hit zero and their features are dropped. Lasso keeps the big weight larger (2.5 vs 1.5) because it does not scale it down proportionally.

### Why L1 gives zeros: the geometry

Picture the weights as a point in a 2-D plane. The L2 penalty's constraint region (all weights with Σw² ≤ t) is a **circle**; the L1 region (Σ abs(w) ≤ t) is a **diamond** with corners on the axes. The best solution is where the loss contours first touch the region. A diamond is most often touched at a **corner**, where one weight is exactly 0. A circle has no corners, so the touching point usually has both weights non-zero.

### Choosing between them

| | Ridge (L2) | Lasso (L1) | ElasticNet |
|---|---|---|---|
| Zeros out features | No | Yes | Yes (fewer than Lasso) |
| Correlated features | Spreads weight across them (stable) | Picks one arbitrarily (unstable) | Groups them (best of both) |
| More features than rows (d > n) | Works | Selects at most n features | Works |
| Use when | Many small effects, multicollinearity | You believe few features matter, want selection | Many correlated features + want selection |
| scikit-learn | `Ridge(alpha=...)` | `Lasso(alpha=...)` | `ElasticNet(alpha=..., l1_ratio=...)` |

> **Common mistake:** Forgetting to scale features before Ridge or Lasso. The penalty treats all weights equally, so a feature measured in large units (small weight) is barely penalised while a feature in small units (large weight) is crushed. Always put `StandardScaler` first.

> **Remember:** In `Ridge`, `Lasso` and `ElasticNet`, **bigger `alpha` = stronger** regularization. In `LogisticRegression` and `SVC`, **smaller `C` = stronger** regularization (C = 1/λ).

### Regularization beyond linear models

| Model | Regularization knobs |
|---|---|
| Logistic regression / SVM | `C` (inverse strength), penalty type |
| Decision tree | `max_depth`, `min_samples_leaf`, `ccp_alpha` |
| Random forest | Leaf size, `max_features`, bagging itself |
| Gradient boosting | `learning_rate`, `max_depth`, `subsample`, `reg_lambda`, early stopping |
| KNN | Larger k |
| Neural networks | Weight decay (L2), dropout, early stopping, data augmentation, batch norm (see [Regularization, Dropout and Batch Norm](/interview/deep-learning/regularization-dropout-and-batch-norm)) |
| Any model | More data, fewer/better features, ensembling |

**Early stopping** deserves special mention: stop training (adding trees, or running epochs) when the validation score stops improving. It is cheap and effective for boosting and neural networks.

### Code: Ridge, Lasso and ElasticNet

```python
import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet, RidgeCV, LassoCV

X, y = load_diabetes(return_X_y=True)          # 442 patients, 10 features, target = disease progression

for name, reg in [("OLS", LinearRegression()),
                  ("Ridge a=10", Ridge(alpha=10)),
                  ("Lasso a=1", Lasso(alpha=1.0)),
                  ("ENet a=0.1", ElasticNet(alpha=0.1, l1_ratio=0.5))]:
    pipe = make_pipeline(StandardScaler(), reg)
    r2 = cross_val_score(pipe, X, y, cv=5, scoring="r2").mean()
    coef = pipe.fit(X, y)[-1].coef_
    print(f"{name:11s} CV R2={r2:.3f}  zero weights={np.sum(np.abs(coef) < 1e-8)}")

# Let cross-validation choose alpha automatically
lasso = make_pipeline(StandardScaler(), LassoCV(alphas=np.logspace(-3, 2, 50), cv=5)).fit(X, y)
print("best Lasso alpha:", round(lasso[-1].alpha_, 3))
ridge = make_pipeline(StandardScaler(), RidgeCV(alphas=np.logspace(-3, 3, 50))).fit(X, y)
print("best Ridge alpha:", round(ridge[-1].alpha_, 3))
```

```text
OLS         CV R2=0.48...  zero weights=0
Ridge a=10  CV R2=0.48...  zero weights=0
Lasso a=1   CV R2=0.48...  zero weights=3 (approximately; a few features dropped)
ENet a=0.1  CV R2=0.48...  zero weights=0
best Lasso alpha: ...
best Ridge alpha: ...
(on this small dataset all are close; the point is that Lasso removes features at almost no cost)
```

## Cross-validation

A single train/validation split has two problems: the score depends on **which** rows landed in validation (luck), and with small data you waste rows that could be used for training. **Cross-validation (CV)** fixes both by repeating the split several times.

### k-fold cross-validation

1. Shuffle and split the training data into **k** equal parts called **folds** (usually k = 5 or 10).
2. For each fold i: train on the other k − 1 folds, validate on fold i.
3. Report the **mean** and **standard deviation** of the k scores.

Every row is used for validation exactly once and for training k − 1 times.

<figure>
<svg viewBox="0 0 400 170" width="400" height="170" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<text x="10" y="32" fill="currentColor" stroke="none">Fold 1</text><text x="10" y="60" fill="currentColor" stroke="none">Fold 2</text><text x="10" y="88" fill="currentColor" stroke="none">Fold 3</text><text x="10" y="116" fill="currentColor" stroke="none">Fold 4</text><text x="10" y="144" fill="currentColor" stroke="none">Fold 5</text>
<rect x="60" y="18" width="50" height="20" fill="var(--accent)" stroke="var(--accent)" /><rect x="112" y="18" width="50" height="20" /><rect x="164" y="18" width="50" height="20" /><rect x="216" y="18" width="50" height="20" /><rect x="268" y="18" width="50" height="20" />
<rect x="60" y="46" width="50" height="20" /><rect x="112" y="46" width="50" height="20" fill="var(--accent)" stroke="var(--accent)" /><rect x="164" y="46" width="50" height="20" /><rect x="216" y="46" width="50" height="20" /><rect x="268" y="46" width="50" height="20" />
<rect x="60" y="74" width="50" height="20" /><rect x="112" y="74" width="50" height="20" /><rect x="164" y="74" width="50" height="20" fill="var(--accent)" stroke="var(--accent)" /><rect x="216" y="74" width="50" height="20" /><rect x="268" y="74" width="50" height="20" />
<rect x="60" y="102" width="50" height="20" /><rect x="112" y="102" width="50" height="20" /><rect x="164" y="102" width="50" height="20" /><rect x="216" y="102" width="50" height="20" fill="var(--accent)" stroke="var(--accent)" /><rect x="268" y="102" width="50" height="20" />
<rect x="60" y="130" width="50" height="20" /><rect x="112" y="130" width="50" height="20" /><rect x="164" y="130" width="50" height="20" /><rect x="216" y="130" width="50" height="20" /><rect x="268" y="130" width="50" height="20" fill="var(--accent)" stroke="var(--accent)" />
<text x="328" y="32" fill="currentColor" stroke="none">0.82</text><text x="328" y="60" fill="currentColor" stroke="none">0.85</text><text x="328" y="88" fill="currentColor" stroke="none">0.80</text><text x="328" y="116" fill="currentColor" stroke="none">0.84</text><text x="328" y="144" fill="currentColor" stroke="none">0.83</text>
<text x="60" y="166" fill="currentColor" stroke="none">filled = validation fold, empty = training folds</text>
</svg>
<figcaption>5-fold cross-validation: each fold takes one turn as the validation set; the five scores are averaged.</figcaption>
</figure>

### Worked example

The five fold accuracies are 0.82, 0.85, 0.80, 0.84, 0.83.

- Mean = (0.82 + 0.85 + 0.80 + 0.84 + 0.83) ÷ 5 = 4.14 ÷ 5 = **0.828**
- Deviations from the mean: −0.008, 0.022, −0.028, 0.012, 0.002. Squares: 0.000064, 0.000484, 0.000784, 0.000144, 0.000004 → sum 0.00148 → ÷ 5 = 0.000296 → std = √0.000296 ≈ **0.017**

Report: **0.828 ± 0.017**. If another model scores 0.832 ± 0.02, the difference is well within the noise — they are effectively tied, and you should prefer the simpler or cheaper one.

> **Interview tip:** Always report the spread, not just the mean. "0.83 ± 0.02 over 5 folds" sounds like someone who understands that scores are noisy estimates.

### Types of cross-validation

| Splitter | How it splits | Use when |
|---|---|---|
| `KFold` | k random folds | Regression, balanced data with independent rows |
| `StratifiedKFold` | Each fold keeps the same class ratio | **Classification** (scikit-learn's default for classifiers with `cv=5`) — essential with imbalance |
| `GroupKFold` / `StratifiedGroupKFold` | All rows of one group (customer, patient, device) stay in the same fold | Several rows per entity; prevents leakage across the same person |
| `TimeSeriesSplit` | Train on the past, validate on the next block; window expands forward | Time-ordered data (sales, prices, fraud over months) |
| `LeaveOneOut` | k = n; each row is its own fold | Very small datasets; expensive and high-variance |
| `RepeatedStratifiedKFold` | Repeat stratified k-fold with different shuffles | Small data where you want a more stable estimate |
| `ShuffleSplit` | Random train/validation splits, repeated | Large data, quick estimates |

### Time-series split

With 12 months of data and `TimeSeriesSplit(n_splits=3)`:

| Split | Train months | Validation months |
|---|---|---|
| 1 | 1–3 | 4–6 |
| 2 | 1–6 | 7–9 |
| 3 | 1–9 | 10–12 |

The model is never trained on the future. A random k-fold on time data would let the model use December to predict March, which is impossible in reality and gives an over-optimistic score. You can add a `gap` between train and validation to mimic the delay before labels arrive.

### Nested cross-validation

If you tune hyperparameters with CV and report that same CV score, the score is slightly optimistic — you picked the best of many tries on the same folds. **Nested CV** uses an inner CV loop for tuning and an outer CV loop for scoring. It is expensive but gives an honest estimate when you have no separate test set. In practice, most teams use CV for tuning and a held-out test set for the final number.

### Code: cross-validation

```python
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import (cross_val_score, cross_validate, StratifiedKFold,
                                     TimeSeriesSplit, GroupKFold)
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

X, y = load_breast_cancer(return_X_y=True)
pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))   # scaler refit inside each fold

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(pipe, X, y, cv=cv, scoring="roc_auc")
print(scores.round(3), f"mean={scores.mean():.3f} std={scores.std():.3f}")

# Several metrics at once, plus training scores to check over/underfitting
res = cross_validate(pipe, X, y, cv=cv, scoring=["accuracy", "f1", "roc_auc"], return_train_score=True)
print("train acc", res["train_accuracy"].mean().round(3), " val acc", res["test_accuracy"].mean().round(3))

# Time-series split on 12 ordered rows
for tr, va in TimeSeriesSplit(n_splits=3).split(np.arange(12)):
    print("train", tr, "val", va)

# Group split: rows of the same customer never appear in both train and validation
groups = np.repeat(np.arange(114), 5)[: len(y)]          # pretend every 5 rows belong to one customer
print(cross_val_score(pipe, X, y, cv=GroupKFold(n_splits=5), groups=groups).mean().round(3))
```

```text
[0.99... 0.99... 0.99... 0.99... 0.99...] mean=0.99... std=0.00...
train acc 0.98...  val acc 0.97...
train [0 1 2] val [3 4 5]
train [0 1 2 3 4 5] val [6 7 8]
train [0 1 2 3 4 5 6 7 8] val [ 9 10 11]
0.97...
```

> **Common mistake:** Scaling, imputing or selecting features on the whole dataset and then running cross-validation. The preprocessing has already seen the validation folds. Put every learned step in a `Pipeline` and pass the pipeline to `cross_val_score` — see [Pipelines and Hyperparameter Tuning](/interview/machine-learning/pipelines-and-hyperparameter-tuning).

## A practical checklist against overfitting

1. Split honestly first: test set locked away; use stratified, group or time-based splits as the data requires.
2. Start simple; add complexity only if validation improves.
3. Compare training and validation scores every time.
4. Use cross-validation with mean ± std for model selection.
5. Regularize: alpha/C for linear models, depth/leaf size for trees, early stopping for boosting and neural nets.
6. Check learning curves: if the gap shrinks with more data, collect more data.
7. Remove leaky and useless features.
8. Touch the test set once.

## Key terms

| Term | Simple meaning |
|---|---|
| Underfitting | Too simple; poor on training and validation data |
| Overfitting | Memorises training noise; poor on new data |
| Generalisation gap | Training score minus validation score |
| Bias | Error from wrong or too-simple assumptions |
| Variance | Error from sensitivity to the particular training sample |
| Irreducible noise | Randomness no model can remove |
| Bias-variance trade-off | Lowering one usually raises the other; find the balance |
| Learning curve | Scores vs training set size |
| Validation curve | Scores vs a hyperparameter value |
| Regularization | A penalty for complexity added to the loss |
| λ / alpha | Regularization strength (bigger = stronger) |
| C | Inverse regularization strength in logistic regression and SVM |
| Ridge (L2) | Penalty λΣw²; shrinks all weights |
| Lasso (L1) | Penalty λΣ abs(w); sets some weights to exactly zero |
| ElasticNet | Mix of L1 and L2 (l1_ratio) |
| Soft thresholding | Lasso's "subtract and stop at zero" rule |
| Early stopping | Stop training when validation stops improving |
| Cross-validation | Repeating train/validate over several splits |
| Fold | One of the k parts in k-fold CV |
| Stratified k-fold | Folds keep the class ratio |
| Group k-fold | Keeps all rows of an entity in one fold |
| Time-series split | Train on the past, validate on the future |
| Nested CV | Inner loop tunes, outer loop scores |
| LOOCV | Leave-one-out: each row is a fold |

## Interview questions

**Explain the bias-variance trade-off.**
Expected error on new data is bias squared plus variance plus irreducible noise. Bias is error from overly simple assumptions; variance is error from sensitivity to the training sample. Increasing model complexity lowers bias but raises variance, so the best model balances the two — we find that balance with validation data, regularization and ensembling.

**How do you detect overfitting?**
Compare training and validation (or cross-validated) performance: a large gap, such as 99% training versus 80% validation accuracy, signals overfitting. Learning curves and validation curves show the same thing across data sizes and hyperparameter values.

**How do you fix overfitting? Name at least five methods.**
Get more data or augment it, simplify the model, add regularization (L1/L2, smaller C, larger alpha), limit tree depth or leaf size, use early stopping, use dropout or weight decay in neural networks, remove noisy or leaky features, and use ensembles like bagging.

**What is the difference between L1 and L2 regularization?**
L2 adds the sum of squared weights; it shrinks all weights smoothly and handles correlated features by spreading weight across them. L1 adds the sum of absolute weights; it can set weights exactly to zero, performing feature selection, but picks arbitrarily among correlated features. ElasticNet combines both.

**Why does L1 produce sparse solutions?**
Geometrically, the L1 constraint region is a diamond with corners on the axes, and the loss contours typically touch it at a corner, where some weights are zero. Algebraically, the L1 penalty has a constant gradient magnitude, so it keeps pushing small weights by the same amount until they reach zero, unlike L2 whose push shrinks as the weight shrinks.

**What does the alpha parameter in Ridge do, and how is C in logistic regression different?**
Alpha is the regularization strength: larger alpha shrinks weights more and makes the model simpler. C in LogisticRegression and SVC is the inverse, 1/λ, so smaller C means stronger regularization. Mixing up the directions is a common bug.

**Why use k-fold cross-validation instead of a single validation split?**
A single split gives a noisy score that depends on which rows landed in validation, and it wastes data. k-fold uses every row for validation once, averages k scores for a more reliable estimate, and gives a standard deviation to judge whether differences between models are real.

**When would you use stratified, group or time-series splits?**
Stratified for classification, especially with imbalance, so every fold has the same class ratio. Group splits when several rows belong to the same entity, like a patient or customer, to avoid leaking that entity across train and validation. Time-series splits whenever the data is ordered in time, so the model only learns from the past.

**What is nested cross-validation and when is it needed?**
An inner CV loop selects hyperparameters, and an outer loop measures the performance of the whole tuning procedure on folds it never saw. It is needed for an unbiased estimate when tuning heavily on small data without a separate test set.

**Your validation score is higher than your training score. What could cause it?**
Strong regularization or dropout that is active only during training, a validation set that happens to be easier, very small data with noisy estimates, or a bug such as leakage into validation or mismatched preprocessing. I would check the splits and the pipeline first.

**How does more data affect bias and variance?**
More data mainly reduces variance, because the model has less room to fit noise; it does little for bias. If a model underfits, more data will not help — a more expressive model or better features will.

## Try it yourself

1. **Ridge by hand.** For x = 1, 2 and y = 3, 5 (model ŷ = w·x, no intercept), compute w for λ = 0, 1 and 5.
   *Hint: w = Σxy ÷ (Σx² + λ).*
2. **Lasso vs Ridge.** Orthonormal features with OLS weights (1.2, −0.3, 0.8, 0.05). Compute Ridge and Lasso weights for λ = 1 using the formulas in this chapter.
   *Hint: Lasso threshold = λ/2 = 0.5.*
3. **CV statistics.** Fold scores 0.70, 0.74, 0.72, 0.78, 0.76. Compute the mean and standard deviation (divide by 5).
   *Hint: the mean is 0.74.*
4. **Code.** Fit polynomial regression of degree 1, 3 and 15 to 20 noisy points from y = sin(x). Print training and 5-fold CV R² for each.
   *Hint: `make_pipeline(PolynomialFeatures(d), StandardScaler(), LinearRegression())`.*

### Answers

1. Σxy = 3 + 10 = 13, Σx² = 1 + 4 = 5. λ = 0: 13/5 = 2.6. λ = 1: 13/6 ≈ 2.167. λ = 5: 13/10 = 1.3.
2. Ridge (divide by 2): (0.6, −0.15, 0.4, 0.025). Lasso (subtract 0.5, stop at 0): (0.7, 0, 0.3, 0).
3. Mean = 3.70/5 = 0.74. Deviations: −0.04, 0, −0.02, 0.04, 0.02 → squares sum = 0.0016 + 0 + 0.0004 + 0.0016 + 0.0004 = 0.004 → ÷ 5 = 0.0008 → std ≈ 0.028.
4. Degree 1 underfits (low train and CV R²), degree 3 fits well (both high), degree 15 has near-perfect training R² but much lower, often negative, CV R² — overfitting.

**Next:** [Pipelines and Hyperparameter Tuning](/interview/machine-learning/pipelines-and-hyperparameter-tuning)
