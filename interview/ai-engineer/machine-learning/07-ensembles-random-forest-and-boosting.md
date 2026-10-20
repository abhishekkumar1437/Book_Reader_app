---
title: Ensembles - Random Forest and Boosting
part: Core Algorithms
summary: Why many weak trees beat one strong tree — bagging and bootstrap samples, random forests and feature importance, boosting with AdaBoost and gradient boosting worked by hand, XGBoost vs LightGBM vs CatBoost, and why trees still beat neural networks on tabular data.
---

If you work with tables — transactions, customers, loans, sensor logs — the model you will ship most often is not a neural network. It is an **ensemble of decision trees**: a random forest or, more often, a gradient-boosted model such as XGBoost, LightGBM or CatBoost. These models win most tabular competitions and run inside fraud, credit, pricing and ranking systems at large companies. Interviewers expect you to explain the difference between bagging and boosting clearly.

> **In simple words:** One decision tree is unstable and makes mistakes. Bagging trains many trees on different random samples and averages their votes — this cancels out random errors. Boosting trains trees one after another, each new tree fixing the mistakes of the trees before it.

## Why ensembles work: the wisdom of the crowd

An **ensemble** combines the predictions of several models into one. The individual models are called **base learners** or **weak learners**.

> **Real-life example:** At a village fair, people guess the weight of a buffalo. Individual guesses are often far off, but the average of 500 guesses is usually very close. Each person's random error cancels with someone else's. This only works if people guess **independently** — if everyone copies one loud person, the crowd is no wiser than that person.

### Worked example: majority voting

Suppose each classifier is right 70% of the time, and their mistakes are **independent**. With 3 classifiers voting, the majority is right if at least 2 of 3 are right:

- P(all 3 right) = 0.7³ = 0.343
- P(exactly 2 right) = 3 × 0.7² × 0.3 = 3 × 0.49 × 0.3 = 0.441
- P(majority right) = 0.343 + 0.441 = **0.784**

With 5 independent classifiers, P(at least 3 right) = **0.837**. More voters → higher accuracy, but **only if their errors are not correlated**. The whole design of random forests is about making trees disagree with each other in useful ways.

### Errors: bias and variance

A model's error has two main parts (see [Overfitting, Regularization and Cross-Validation](/interview/ai-engineer/machine-learning/overfitting-regularization-and-cross-validation)):

- **Bias**: error from the model being too simple (always wrong in the same way).
- **Variance**: error from the model being too sensitive to the training data (a different sample gives a very different model).

A deep decision tree has **low bias, high variance**. A tiny tree (a "stump" with one split) has **high bias, low variance**. The two ensemble families attack different parts:

| | Bagging (random forest) | Boosting (AdaBoost, gradient boosting) |
|---|---|---|
| Base learner | Deep trees (low bias, high variance) | Shallow trees (high bias, low variance) |
| Mainly reduces | Variance | Bias |
| Training | Parallel, independent trees | Sequential: each tree depends on the previous ones |
| Combining | Average / majority vote | Weighted sum |
| Overfitting risk with more trees | Very low | Yes, if too many trees and no early stopping |
| Tuning effort | Low | Medium to high |

<figure>
<svg viewBox="0 0 440 220" width="440" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<text x="10" y="18" fill="currentColor" stroke="none" font-weight="bold">Bagging: parallel</text>
<rect x="10" y="30" width="60" height="70" rx="6" /><text x="40" y="62" text-anchor="middle" fill="currentColor" stroke="none">Data</text>
<line x1="70" y1="65" x2="100" y2="38" /><line x1="70" y1="65" x2="100" y2="65" /><line x1="70" y1="65" x2="100" y2="92" />
<rect x="100" y="28" width="60" height="20" rx="4" /><text x="130" y="42" text-anchor="middle" fill="currentColor" stroke="none">tree 1</text>
<rect x="100" y="55" width="60" height="20" rx="4" /><text x="130" y="69" text-anchor="middle" fill="currentColor" stroke="none">tree 2</text>
<rect x="100" y="82" width="60" height="20" rx="4" /><text x="130" y="96" text-anchor="middle" fill="currentColor" stroke="none">tree 3</text>
<line x1="160" y1="38" x2="190" y2="65" /><line x1="160" y1="65" x2="190" y2="65" /><line x1="160" y1="92" x2="190" y2="65" />
<rect x="190" y="50" width="70" height="30" rx="6" stroke="var(--accent)" /><text x="225" y="69" text-anchor="middle" fill="currentColor" stroke="none">vote/avg</text>
<text x="275" y="50" fill="currentColor" stroke="none">each tree sees a</text>
<text x="275" y="65" fill="currentColor" stroke="none">bootstrap sample and</text>
<text x="275" y="80" fill="currentColor" stroke="none">random features</text>
<text x="10" y="128" fill="currentColor" stroke="none" font-weight="bold">Boosting: sequential</text>
<rect x="10" y="140" width="60" height="30" rx="6" /><text x="40" y="159" text-anchor="middle" fill="currentColor" stroke="none">tree 1</text>
<line x1="70" y1="155" x2="95" y2="155" /><polygon points="95,150 103,155 95,160" fill="currentColor" />
<rect x="103" y="140" width="60" height="30" rx="6" /><text x="133" y="159" text-anchor="middle" fill="currentColor" stroke="none">tree 2</text>
<line x1="163" y1="155" x2="188" y2="155" /><polygon points="188,150 196,155 188,160" fill="currentColor" />
<rect x="196" y="140" width="60" height="30" rx="6" /><text x="226" y="159" text-anchor="middle" fill="currentColor" stroke="none">tree 3</text>
<line x1="256" y1="155" x2="281" y2="155" /><polygon points="281,150 289,155 281,160" fill="currentColor" />
<rect x="289" y="140" width="80" height="30" rx="6" stroke="var(--accent)" /><text x="329" y="159" text-anchor="middle" fill="currentColor" stroke="none">weighted sum</text>
<text x="70" y="192" fill="currentColor" stroke="none">each new tree is trained on the errors</text>
<text x="70" y="207" fill="currentColor" stroke="none">(residuals or re-weighted rows) of the trees so far</text>
</svg>
<figcaption>Bagging trains independent trees at the same time and averages them; boosting trains trees one after another, each correcting the previous ones.</figcaption>
</figure>

## Bagging

**Bagging** is short for **bootstrap aggregating**.

1. **Bootstrap**: from the n training rows, draw n rows **with replacement**. Some rows appear twice or three times; others not at all. This is one **bootstrap sample**.
2. Train a model (usually a deep tree) on it.
3. Repeat for, say, 300 models, each on its own bootstrap sample.
4. **Aggregate**: average the predictions (regression) or take a majority vote (classification).

Because each tree sees a slightly different dataset, their errors are partly different, and averaging cancels much of the variance.

### Out-of-bag rows

What fraction of rows does one bootstrap sample miss? For a single row, the chance it is not picked in one draw is (1 − 1/n). Over n draws: (1 − 1/n)ⁿ.

- For n = 100: (0.99)¹⁰⁰ ≈ **0.366**.
- As n grows, this approaches 1/e ≈ **0.368**.

So each tree sees about **63.2%** of the distinct rows, and about **36.8%** are left out. These left-out rows are called **out-of-bag (OOB)** rows. Each row is OOB for roughly a third of the trees, so we can predict it using only those trees and get a free validation score without a separate validation set. This is the **OOB score**.

## Random forest

A **random forest** is bagging of decision trees plus one extra trick: at every split, each tree may only look at a **random subset of features**.

Why? If one feature is very strong, every bagged tree would split on it first, and all trees would look alike. Their errors would be correlated, and averaging would help little. Forcing each split to choose from a random subset (`max_features`) makes trees **decorrelated**, so the average is much better.

- Classification default: `max_features="sqrt"` → with 100 features, each split considers 10.
- Regression default in scikit-learn: `max_features=1.0` (all features); many practitioners use about one third.

> **Remember:** Random forest = bootstrap rows + random features at each split + deep trees + average. More trees never cause overfitting; they only cost time. The gains flatten after a few hundred trees.

### Feature importance

Random forests give two kinds of importance:

| Method | How it works | Weakness |
|---|---|---|
| Impurity-based (MDI), `feature_importances_` | Total impurity decrease from splits on the feature, averaged over trees | Biased toward high-cardinality and continuous features; computed on training data |
| Permutation importance | Shuffle one feature's column in validation data and measure how much the score drops | Slower; correlated features share (and hide) importance |
| SHAP values | Game-theory based contribution of each feature to each single prediction | Extra library (`shap`); slower, but explains individual predictions |

A useful trick: add a column of random numbers. Any real feature with lower importance than the random column is probably useless.

```python
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance

X, y = fetch_california_housing(return_X_y=True, as_frame=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

rf = RandomForestRegressor(
    n_estimators=300,        # number of trees
    max_features=1/3,        # fraction of features tried at each split
    min_samples_leaf=2,      # smooths leaves a little
    oob_score=True,          # free validation estimate from out-of-bag rows
    n_jobs=-1,               # use all CPU cores (trees are independent)
    random_state=42,
)
rf.fit(X_train, y_train)
print("OOB R2: ", round(rf.oob_score_, 3))
print("test R2:", round(rf.score(X_test, y_test), 3))

perm = permutation_importance(rf, X_test, y_test, n_repeats=5, random_state=42, n_jobs=-1)
for name, imp in sorted(zip(X.columns, perm.importances_mean), key=lambda t: -t[1])[:4]:
    print(f"{name:10s} {imp:.3f}")
```

```text
OOB R2:  0.80...
test R2: 0.80...     (compare: linear regression got about 0.58 on the same split)
MedInc     0.4...
Latitude   ...
Longitude  ...
AveOccup   ...
(approximate values; ranking is typically MedInc first, then location features)
```

## Boosting

**Boosting** builds the ensemble one model at a time. Each new model focuses on what the current ensemble gets wrong. The base learners are deliberately weak (shallow trees), and the final model is a weighted sum.

> **Real-life example:** A student preparing for an exam takes a mock test, then studies only the topics she got wrong, takes another test, studies the new weak topics, and so on. Each round fixes the remaining mistakes.

### AdaBoost: re-weight the hard rows

**AdaBoost** (Adaptive Boosting) gives every training row a weight. After each round, wrongly classified rows get **more** weight, so the next weak learner pays more attention to them.

<div class="formula">

| Step | Formula |
|---|---|
| Weighted error of learner t | εₜ = sum of weights of misclassified rows |
| Learner's say (vote weight) | αₜ = ½ · ln((1 − εₜ) ÷ εₜ) |
| Misclassified row | weight × e^(αₜ), then normalise |
| Correct row | weight × e^(−αₜ), then normalise |
| Final prediction | sign of Σ αₜ · hₜ(x), with hₜ(x) = +1 or −1 |

</div>

Worked example: 10 rows, each weight 0.1. The first stump misclassifies 3 rows.

1. ε = 3 × 0.1 = 0.3.
2. α = ½ · ln(0.7 ÷ 0.3) = ½ · ln(2.333) = ½ × 0.847 = **0.424**.
3. Wrong rows: 0.1 × e⁰·⁴²⁴ = 0.1 × 1.527 = 0.1527. Correct rows: 0.1 × e⁻⁰·⁴²⁴ = 0.1 × 0.655 = 0.0655.
4. Total = 3 × 0.1527 + 7 × 0.0655 = 0.458 + 0.458 = 0.9165. Normalise: wrong rows → 0.1527 ÷ 0.9165 = **0.167**; correct rows → 0.0655 ÷ 0.9165 = **0.071**.

After one round, the 3 hard rows together hold half the total weight (3 × 0.167 = 0.5). The next stump must get them right. A learner with ε = 0.5 (random guessing) gets α = 0; better learners get a bigger say.

AdaBoost is sensitive to noisy labels and outliers, because a mislabelled row keeps getting more weight. Today it is mostly an interview topic; gradient boosting replaced it in practice.

### Gradient boosting: fit the residuals

**Gradient boosting** builds the model step by step:

1. Start with a constant prediction F₀ (for MSE, the mean of y).
2. Compute the **residuals** r = y − F (for MSE these are the negative gradient of the loss — hence "gradient" boosting).
3. Fit a small tree to the residuals.
4. Add it, scaled by a **learning rate** η: F ← F + η × tree.
5. Repeat.

Each tree predicts "how much the current model is still wrong", and we add a small fraction of that correction.

#### Worked example by hand

Four flats; price y in ₹ lakh: 10, 20, 30, 40 (sizes x = 1, 2, 3, 4). Use stumps (one split) and η = 0.5.

**Round 0.** F₀ = mean = 25 for every row. Residuals = −15, −5, 5, 15. MSE = (225 + 25 + 25 + 225) ÷ 4 = **125**.

**Round 1.** The best stump on the residuals splits x ≤ 2.5: left leaf = mean(−15, −5) = −10, right leaf = mean(5, 15) = +10.
F₁ = 25 + 0.5 × (−10, −10, +10, +10) = **20, 20, 30, 30**. Residuals = −10, 0, 0, 10. MSE = (100 + 0 + 0 + 100) ÷ 4 = **50**.

**Round 2.** Residuals −10, 0, 0, 10. The stump x ≤ 1.5 gives left = −10, right = mean(0, 0, 10) = 3.33. (The split x ≤ 3.5 ties; we take the first.)
F₂ = (20 − 5, 20 + 1.67, 30 + 1.67, 30 + 1.67) = **15, 21.67, 31.67, 31.67**. Residuals = −5, −1.67, −1.67, 8.33. MSE = (25 + 2.78 + 2.78 + 69.44) ÷ 4 = **25**.

| Round | Predictions | MSE |
|---|---|---|
| 0 | 25, 25, 25, 25 | 125 |
| 1 | 20, 20, 30, 30 | 50 |
| 2 | 15, 21.67, 31.67, 31.67 | 25 |

The error keeps falling. With a smaller learning rate (0.05–0.1) each step is smaller, so you need more trees, but the final model usually generalises better. This trade-off between `learning_rate` and `n_estimators` is the key tuning idea of boosting. Because each step can keep reducing training error, boosting **can overfit** — use **early stopping** on a validation set.

> **Interview tip:** Explain gradient boosting as "gradient descent in function space": instead of updating weights, each step adds a new tree that points in the negative-gradient direction of the loss. For MSE the negative gradient is just the residual; for log loss it is y − p.

### XGBoost, LightGBM and CatBoost

These are fast, regularized, production-grade implementations of gradient boosting.

| | XGBoost | LightGBM | CatBoost | sklearn HistGradientBoosting |
|---|---|---|---|---|
| Released by | Tianqi Chen / DMLC (2014) | Microsoft (2016) | Yandex (2017) | scikit-learn |
| Tree growth | Level-wise (depth by depth) by default | Leaf-wise (best leaf first) | Symmetric (oblivious) trees | Leaf-wise with histogram bins |
| Speed | Fast (has `hist` method, GPU) | Usually fastest on big data | Slower training, fast prediction | Fast, no extra install |
| Categorical features | Supported (`enable_categorical`) | Native support | Best native support (ordered target statistics) | Native support |
| Missing values | Native | Native | Native | Native |
| Regularization | L1/L2 on leaf weights, gamma | L1/L2, min data in leaf | Ordered boosting reduces overfitting | L2, min samples leaf |
| Good default choice when | Well-known, very mature | Large data, need speed | Many categorical columns, little tuning | You want zero extra dependencies |

Main ideas that make them strong:

- **Histogram binning**: group a feature's values into ~256 bins, so finding the best split is much faster.
- **Second-order information** (XGBoost): uses both gradient and curvature (Hessian) of the loss to choose leaf values.
- **Regularization** on the number of leaves and the size of leaf values.
- **Row and column subsampling** like a random forest (`subsample`, `colsample_bytree`).
- **Early stopping** on a validation set.

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import roc_auc_score

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# 1) scikit-learn's own fast gradient boosting
hgb = HistGradientBoostingClassifier(
    learning_rate=0.05, max_iter=500,           # max_iter = number of trees
    max_leaf_nodes=15, min_samples_leaf=20,
    early_stopping=True, validation_fraction=0.1, n_iter_no_change=20,
    random_state=42,
)
hgb.fit(X_train, y_train)
print("HGB trees used:", hgb.n_iter_, " AUC:", round(roc_auc_score(y_test, hgb.predict_proba(X_test)[:, 1]), 3))

# 2) XGBoost (pip install xgboost) - early stopping is a constructor argument in xgboost 2.x
import xgboost as xgb
X_tr, X_val, y_tr, y_val = train_test_split(X_train, y_train, test_size=0.2, stratify=y_train, random_state=0)
xgbc = xgb.XGBClassifier(
    n_estimators=2000, learning_rate=0.05, max_depth=4,
    subsample=0.8, colsample_bytree=0.8, reg_lambda=1.0,
    tree_method="hist", eval_metric="auc", early_stopping_rounds=50,
)
xgbc.fit(X_tr, y_tr, eval_set=[(X_val, y_val)], verbose=False)
print("XGB best iteration:", xgbc.best_iteration)

# 3) LightGBM (pip install lightgbm)
import lightgbm as lgb
lgbc = lgb.LGBMClassifier(n_estimators=2000, learning_rate=0.05, num_leaves=15, subsample=0.8,
                          subsample_freq=1, colsample_bytree=0.8, verbose=-1)
lgbc.fit(X_tr, y_tr, eval_set=[(X_val, y_val)], callbacks=[lgb.early_stopping(50, verbose=False)])

# 4) CatBoost (pip install catboost) - pass categorical column names/indices via cat_features
from catboost import CatBoostClassifier
cat = CatBoostClassifier(iterations=2000, learning_rate=0.05, depth=6, verbose=0, early_stopping_rounds=50)
cat.fit(X_tr, y_tr, eval_set=(X_val, y_val))
```

```text
HGB trees used: 1xx  AUC: 0.99...
XGB best iteration: 1xx
(all four reach a test ROC-AUC around 0.99 on this small, easy dataset; differences show on larger, messier data)
```

### Hyperparameters that matter for boosting

| Hyperparameter | XGBoost / LightGBM name | Effect | Typical start |
|---|---|---|---|
| Number of trees | `n_estimators` | More trees fit more; use early stopping | 1000–5000 with early stopping |
| Learning rate | `learning_rate` | Smaller = more trees needed, better generalisation | 0.03–0.1 |
| Tree size | `max_depth` / `num_leaves` | Bigger trees capture more interactions, overfit more | depth 4–8 / 15–63 leaves |
| Min rows per leaf | `min_child_weight` / `min_child_samples` | Larger = smoother | 1–100 |
| Row sampling | `subsample` | Adds randomness, reduces overfitting | 0.7–0.9 |
| Column sampling | `colsample_bytree` | Decorrelates trees | 0.7–0.9 |
| L2 / L1 on leaves | `reg_lambda` / `reg_alpha` | Shrinks leaf values | 0–10 |
| Class imbalance | `scale_pos_weight` / `class_weight` | Up-weights positives | negatives ÷ positives |

For random forests, the main ones are `n_estimators` (more is better, until it plateaus), `max_features`, `max_depth` / `min_samples_leaf`, and `class_weight`.

## When trees beat neural networks

On **tabular data** — rows of mixed numeric and categorical columns — gradient-boosted trees usually match or beat deep learning. Studies comparing the two on many tabular datasets keep finding this, although newer tabular neural models are closing the gap on some benchmarks. Reasons:

1. **Irregular patterns**: tabular targets often jump at thresholds ("age ≥ 60", "amount > ₹1 lakh"). Trees model steps directly; neural networks prefer smooth functions.
2. **Uninformative features**: tables often have many weak or useless columns. Trees ignore them by never splitting on them; neural networks are hurt more.
3. **No natural structure**: images have neighbouring pixels and text has word order, which CNNs and Transformers exploit. Table columns have no such order.
4. **Data size**: many business tables have thousands to a few million rows — small for deep learning.
5. **Practical**: trees need no scaling, handle missing values, train in minutes on a CPU, and are easier to explain with SHAP.

Neural networks win when the input is images, audio, or text; when there are huge amounts of data; or when you need to learn embeddings of IDs (users, items) end-to-end. A common production pattern: use a pretrained neural network to turn text or images into **embeddings**, then feed those embeddings into a gradient-boosting model with the tabular features.

## Other ways to combine models

- **Voting**: average the predictions (or probabilities) of different model types — e.g. logistic regression + random forest + gradient boosting. `VotingClassifier`.
- **Stacking**: train a **meta-model** (often logistic regression) on the out-of-fold predictions of several base models. `StackingClassifier`. Gives small gains; common in competitions, rarer in production because of complexity.
- **Blending**: like stacking but with one holdout set instead of cross-validation.

## Pros, cons and when to use

| | Random forest | Gradient boosting |
|---|---|---|
| Accuracy on tabular data | Very good | Usually the best |
| Tuning needed | Little; defaults work | More (learning rate, trees, depth) |
| Overfitting risk | Low | Medium; use early stopping |
| Training | Parallel, fast | Sequential (but parallel inside each tree), fast with histograms |
| Handles missing values | scikit-learn 1.4+ supports NaN in RF | Yes, natively |
| Probability calibration | Fair | Fair; calibrate if needed |
| Extrapolation | No | No |
| Good first choice when | You want a strong, safe baseline fast | You want maximum accuracy |

**Use ensembles when:** the data is tabular and you want strong accuracy. Start with a random forest or `HistGradientBoosting` with defaults, then tune LightGBM/XGBoost/CatBoost.

**Avoid when:** you need a model that must be fully readable (use a small tree or logistic regression), you need to extrapolate trends (use linear models or add trend features), or the input is raw images/text/audio.

> **Common mistake:** Saying "random forest overfits when you add more trees". It does not — adding trees only reduces variance and plateaus. What makes a random forest overfit is very deep trees on noisy data with tiny leaves. Boosting, however, **can** overfit with too many trees.

## Key terms

| Term | Simple meaning |
|---|---|
| Ensemble | Combining several models into one prediction |
| Base / weak learner | One model inside an ensemble (often a small tree) |
| Bias / variance | Error from being too simple / from being too sensitive to the data |
| Bagging | Bootstrap aggregating: train on random resamples, then average |
| Bootstrap sample | n rows drawn with replacement from n rows |
| Out-of-bag (OOB) | Rows a tree did not see (~36.8%); used for a free validation score |
| Random forest | Bagged deep trees + random feature subsets at each split |
| max_features | How many features each split may consider |
| Decorrelation | Making trees' errors less similar so averaging helps more |
| MDI importance | Impurity-based feature importance from the trees |
| Permutation importance | Score drop when one feature's values are shuffled |
| SHAP | Per-prediction feature contributions based on game theory |
| Boosting | Training models sequentially, each fixing earlier mistakes |
| AdaBoost | Boosting by increasing the weights of misclassified rows |
| Stump | A tree with a single split |
| Gradient boosting | Each new tree fits the negative gradient (residuals) of the loss |
| Learning rate / shrinkage | Fraction of each new tree's correction that is added |
| Early stopping | Stop adding trees when validation score stops improving |
| XGBoost / LightGBM / CatBoost | Popular fast gradient-boosting libraries |
| Histogram binning | Grouping feature values into bins to speed up split search |
| Voting / stacking | Averaging different models / training a meta-model on their outputs |

## Interview questions

**What is the difference between bagging and boosting?**
Bagging trains many models independently on bootstrap samples and averages them; it mainly reduces variance and uses deep trees. Boosting trains models sequentially, each one focusing on the errors of the current ensemble; it mainly reduces bias and uses shallow trees. Bagging is parallel and hard to overfit; boosting is sequential and needs early stopping.

**How does a random forest differ from plain bagging of trees?**
It adds feature randomness: at every split, a tree can only choose from a random subset of features (for classification, by default the square root of the number of features). This decorrelates the trees, so averaging them reduces variance much more than bagging alone.

**What is the out-of-bag score?**
Each bootstrap sample leaves out about 36.8% of rows. For each row, we predict with only the trees that did not see it and compare to the truth. The resulting score is a nearly free estimate of generalisation performance, similar to cross-validation.

**Can a random forest overfit? What about gradient boosting?**
Adding more trees to a random forest does not cause overfitting; performance plateaus. A forest can still overfit through very deep trees with tiny leaves on noisy data. Gradient boosting can overfit as trees are added, because each tree keeps reducing training error, so we use a small learning rate and early stopping on validation data.

**Explain gradient boosting step by step.**
Start with a constant prediction such as the mean. Compute the negative gradient of the loss for each row — for squared error that is the residual. Fit a small tree to these values, add it to the model multiplied by the learning rate, and repeat. The final prediction is the initial constant plus the sum of all scaled trees.

**What is the role of the learning rate in gradient boosting?**
It scales each tree's contribution. A small learning rate makes each step cautious, which needs more trees but usually generalises better; a large one learns fast but overfits sooner. Learning rate and number of trees are tuned together, usually with early stopping.

**How does AdaBoost decide each learner's weight?**
Each learner's weight is α = ½ ln((1 − ε)/ε), where ε is its weighted error. Accurate learners get a large say, a random-guess learner (ε = 0.5) gets zero. Misclassified rows are multiplied by e^α and correct rows by e^−α, then normalised.

**XGBoost vs LightGBM vs CatBoost — how would you choose?**
All are strong gradient-boosting libraries. LightGBM is usually fastest on large data thanks to histograms and leaf-wise growth. CatBoost handles many categorical features best with little tuning. XGBoost is very mature with wide tooling. In practice I try one with early stopping, and pick based on validation score, speed and how many categorical columns there are.

**Why do tree ensembles often beat neural networks on tabular data?**
Tabular targets often have sharp, threshold-like patterns that trees model directly, tables contain many uninformative features that trees can ignore, columns have no spatial or sequential structure for a neural network to exploit, and datasets are often modest in size. Trees also need no scaling and handle missing values.

**Why are impurity-based feature importances misleading sometimes?**
They are computed on training data and favour features with many unique values, because such features offer more split points and can fit noise. Correlated features also split the credit. Permutation importance on a validation set or SHAP values are more reliable.

**What is stacking?**
Stacking trains several different base models, collects their out-of-fold predictions, and trains a meta-model on those predictions to combine them. It can squeeze out extra accuracy but adds complexity, so it is more common in competitions than in production.

## Try it yourself

1. **Voting math.** Three independent classifiers with accuracies 0.8, 0.7 and 0.6 vote. What is the probability the majority is right?
   *Hint: add P(all right) and the three cases where exactly two are right.*
2. **AdaBoost round.** 5 rows with weight 0.2 each; a stump misclassifies 1 row. Compute ε, α and the new normalised weights.
   *Hint: ln(4) ≈ 1.386.*
3. **Gradient boosting round.** y = 3, 5, 10, 14 with F₀ = mean. Fit a stump on residuals that splits after the second row, with η = 0.1. Give F₁.
   *Hint: mean of y is 8.*
4. **Code.** On California housing, compare `RandomForestRegressor`, `HistGradientBoostingRegressor` and `LinearRegression` by test R² and training time (`time.perf_counter()`).
   *Hint: expect trees around 0.8+ and linear around 0.58.*

### Answers

1. All right: 0.8 × 0.7 × 0.6 = 0.336. Exactly two: 0.8 × 0.7 × 0.4 = 0.224; 0.8 × 0.3 × 0.6 = 0.144; 0.2 × 0.7 × 0.6 = 0.084. Total = 0.336 + 0.224 + 0.144 + 0.084 = **0.788**. This is slightly **worse** than the best single model (0.8): when members are very unequal, the weak ones can outvote the strong one. Ensembles help most when members are similarly good and make independent errors.
2. ε = 0.2, α = ½ ln(0.8/0.2) = ½ × 1.386 = 0.693. e^0.693 = 2, e^−0.693 = 0.5. Wrong row: 0.2 × 2 = 0.4; correct rows: 0.2 × 0.5 = 0.1 each. Total = 0.4 + 4 × 0.1 = 0.8. Normalised: wrong row 0.5, each correct row 0.125.
3. F₀ = 8; residuals −5, −3, 2, 6. Stump leaves: mean(−5, −3) = −4 and mean(2, 6) = 4. F₁ = 8 + 0.1 × (−4, −4, 4, 4) = 7.6, 7.6, 8.4, 8.4.
4. Typical results: linear ≈ 0.58 (well under a second), random forest ≈ 0.80 (tens of seconds with 300 trees), HistGradientBoosting ≈ 0.83–0.84 (a few seconds).

**Next:** [KNN, SVM and Naive Bayes](/interview/ai-engineer/machine-learning/knn-svm-and-naive-bayes)
