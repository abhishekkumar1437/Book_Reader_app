---
title: Decision Trees
part: Core Algorithms
summary: How a tree asks yes/no questions to make predictions — Gini impurity, entropy and information gain computed by hand on six rows, numeric thresholds, regression trees, depth and overfitting, pruning, and scikit-learn code.
---

A decision tree makes predictions by asking a series of simple questions: "Is income above ₹50,000?" → "Has the customer missed a payment before?" → "Approve". It is the easiest model to explain to a manager, and it is the building block of random forests and gradient boosting — the models that win most real-world tabular problems. Interviewers love asking you to compute a Gini split by hand, so this chapter does exactly that.

> **In simple words:** A tree splits the data again and again, each time choosing the question that makes the groups as "pure" (single-class) as possible. To predict, a new row walks down the questions until it reaches a leaf, and the leaf's majority answer is the prediction.

## How a tree makes a prediction

> **Real-life example:** A railway enquiry clerk deciding if you can get a confirmed ticket: "Is it a festival week?" If yes: "Is the booking more than 60 days ahead?" If no: "Is it the Tatkal window?" Each answer leads to the next question until there is a decision. That flowchart is a decision tree.

Parts of a tree:

- **Root node**: the first question, at the top.
- **Internal node** (or **decision node**): a question that splits the data.
- **Branch**: one answer to a question.
- **Leaf node**: an end point with a prediction (a class, or a number for regression).
- **Depth**: the number of questions from the root to the deepest leaf.

<figure>
<svg viewBox="0 0 420 230" width="420" height="230" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="140" y="10" width="140" height="44" rx="8" stroke="var(--accent)" />
<text x="210" y="28" text-anchor="middle" fill="currentColor" stroke="none" font-weight="bold">Age = Old?</text>
<text x="210" y="45" text-anchor="middle" fill="currentColor" stroke="none">6 rows · 3 Yes 3 No</text>
<line x1="180" y1="54" x2="100" y2="96" />
<line x1="240" y1="54" x2="320" y2="96" />
<text x="125" y="78" fill="currentColor" stroke="none">no</text>
<text x="285" y="78" fill="currentColor" stroke="none">yes</text>
<rect x="30" y="96" width="150" height="44" rx="8" />
<text x="105" y="114" text-anchor="middle" fill="currentColor" stroke="none" font-weight="bold">Income = High?</text>
<text x="105" y="131" text-anchor="middle" fill="currentColor" stroke="none">4 rows · 1 Yes 3 No</text>
<rect x="260" y="96" width="120" height="44" rx="8" />
<text x="320" y="114" text-anchor="middle" fill="currentColor" stroke="none">Leaf: Buy</text>
<text x="320" y="131" text-anchor="middle" fill="currentColor" stroke="none">2 Yes · Gini 0</text>
<line x1="80" y1="140" x2="55" y2="176" />
<line x1="130" y1="140" x2="165" y2="176" />
<text x="50" y="162" fill="currentColor" stroke="none">no</text>
<text x="152" y="162" fill="currentColor" stroke="none">yes</text>
<rect x="5" y="176" width="110" height="44" rx="8" />
<text x="60" y="194" text-anchor="middle" fill="currentColor" stroke="none">Leaf: No buy</text>
<text x="60" y="211" text-anchor="middle" fill="currentColor" stroke="none">2 No · Gini 0</text>
<rect x="125" y="176" width="120" height="44" rx="8" />
<text x="185" y="194" text-anchor="middle" fill="currentColor" stroke="none">Leaf: 1 Yes 1 No</text>
<text x="185" y="211" text-anchor="middle" fill="currentColor" stroke="none">Gini 0.5</text>
</svg>
<figcaption>The tree built in this chapter from six rows: the root question (Age) is chosen because it gives the largest drop in impurity.</figcaption>
</figure>

## How a tree chooses a split

At each node, the algorithm tries **every feature** and **every possible threshold**, and picks the split that makes the child groups as pure as possible. A group is **pure** when all its rows have the same label. A measure of how mixed a group is is called **impurity**.

The usual algorithm (called **CART**, Classification And Regression Trees, used by scikit-learn) is **greedy**: it picks the best split at the current node without looking ahead to future splits. It then repeats the same process inside each child, recursively.

### Gini impurity

<div class="formula">

| Formula | Meaning |
|---|---|
| Gini = 1 − Σ pₖ² | pₖ = fraction of rows of class k in the node |
| Two classes: Gini = 1 − p² − (1 − p)² | 0 = pure; 0.5 = 50/50 (the worst for two classes) |
| Weighted Gini of a split = Σ (n_child ÷ n_parent) × Gini_child | average impurity of the children |

</div>

Gini is the probability that two rows picked at random from the node (with replacement) have **different** labels.

### Entropy and information gain

**Entropy** comes from information theory. It measures uncertainty in "bits".

<div class="formula">

| Formula | Meaning |
|---|---|
| Entropy H = −Σ pₖ · log₂(pₖ) | 0 = pure; 1 bit = 50/50 for two classes |
| Information gain = H(parent) − Σ (n_child ÷ n_parent) × H(child) | how much uncertainty the split removes |

</div>

The split with the largest **information gain** (or the largest drop in Gini) wins.

| p (fraction of Yes) | Gini | Entropy |
|---|---|---|
| 0 or 1 | 0 | 0 |
| 0.25 | 0.375 | 0.811 |
| 1/3 | 0.444 | 0.918 |
| 0.5 | 0.5 | 1.0 |

Gini and entropy almost always choose the same split. Gini is slightly faster (no logarithm), so it is the scikit-learn default.

## Worked example: build a tree by hand

Will a customer buy a premium plan? Six rows, two features.

| Row | Age | Income | Buys? |
|---|---|---|---|
| 1 | Young | High | No |
| 2 | Young | High | Yes |
| 3 | Young | Low | No |
| 4 | Young | Low | No |
| 5 | Old | High | Yes |
| 6 | Old | Low | Yes |

### Step 1: impurity of the root

3 Yes, 3 No → p = 0.5.

- Gini = 1 − 0.5² − 0.5² = 1 − 0.25 − 0.25 = **0.5**
- Entropy = −0.5·log₂(0.5) − 0.5·log₂(0.5) = 0.5 + 0.5 = **1.0**

### Step 2: try the split on Income

- Income = High: rows 1, 2, 5 → No, Yes, Yes → 2 Yes, 1 No → p = 2/3.
  Gini = 1 − (2/3)² − (1/3)² = 1 − 4/9 − 1/9 = 4/9 ≈ **0.444**
- Income = Low: rows 3, 4, 6 → No, No, Yes → 1 Yes, 2 No.
  Gini = 1 − (1/3)² − (2/3)² = **0.444**
- Weighted Gini = (3/6) × 0.444 + (3/6) × 0.444 = **0.444**
- Gini decrease = 0.5 − 0.444 = **0.056**

### Step 3: try the split on Age

- Age = Young: rows 1–4 → No, Yes, No, No → 1 Yes, 3 No → p = 1/4.
  Gini = 1 − (1/4)² − (3/4)² = 1 − 1/16 − 9/16 = 6/16 = **0.375**
- Age = Old: rows 5, 6 → Yes, Yes → pure. Gini = **0**
- Weighted Gini = (4/6) × 0.375 + (2/6) × 0 = **0.25**
- Gini decrease = 0.5 − 0.25 = **0.25**

**Age wins** (0.25 > 0.056). It becomes the root question.

### Step 4: the same comparison with entropy

- Income: each child has p = 1/3 → H = −(1/3)log₂(1/3) − (2/3)log₂(2/3) = 0.528 + 0.390 = **0.918**. Weighted = 0.918. Information gain = 1 − 0.918 = **0.082**.
- Age: Young has p = 1/4 → H = −0.25·log₂(0.25) − 0.75·log₂(0.75) = 0.5 + 0.311 = **0.811**. Old H = 0. Weighted = (4/6) × 0.811 = 0.541. Information gain = 1 − 0.541 = **0.459**.

Entropy also picks Age. Same decision, different numbers.

### Step 5: grow the Young branch

The Old branch is pure (both Yes), so it becomes a **leaf**: predict "Yes".

The Young branch (rows 1–4: 1 Yes, 3 No, Gini 0.375) can split on Income:

- Young + High: rows 1, 2 → No, Yes → Gini 0.5
- Young + Low: rows 3, 4 → No, No → Gini 0
- Weighted = (2/4) × 0.5 + (2/4) × 0 = 0.25. Decrease = 0.375 − 0.25 = 0.125 > 0, so we split.

Rows 1 and 2 have **identical features but different labels**. No question can separate them. The leaf stays at 1 Yes, 1 No. Real data is full of such noise; this is why training accuracy is not always 100%.

The final tree is the figure above. To predict for a new "Old, Low income" customer: Age = Old? Yes → leaf "Buy".

> **Interview tip:** When asked to compute a split, say the steps out loud: "parent impurity, then each child's impurity, then the weighted average, then the decrease; choose the largest decrease". Interviewers care about the process more than the decimals.

## Numeric features: choosing a threshold

For a numeric feature like age in years, the tree sorts the values and tries thresholds **between consecutive values** (usually the midpoints). For ages 22, 25, 30, 41 it tries "age ≤ 23.5", "age ≤ 27.5" and "age ≤ 35.5", computes the impurity decrease for each, and keeps the best. With n distinct values there are n − 1 candidate thresholds per feature.

Because only the **order** of values matters, trees need no feature scaling and are not affected by monotonic transforms like log.

## Regression trees

For a numeric target, a leaf predicts the **mean** of the training targets in it. The split criterion is the reduction in **mean squared error** (variance) instead of Gini.

Worked example: flat size (x, in hundreds of sq ft) and price (₹ lakh).

| x | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| y | 10 | 12 | 11 | 30 | 32 | 31 |

1. Parent: mean = 126 ÷ 6 = 21. Squared deviations: 121, 81, 100, 81, 121, 100 → sum 604 → MSE = 604 ÷ 6 ≈ **100.67**.
2. Try split x ≤ 3.5. Left: 10, 12, 11 → mean 11, MSE = (1 + 1 + 0) ÷ 3 = 0.667. Right: 30, 32, 31 → mean 31, MSE = 0.667.
3. Weighted MSE = 0.667. Reduction = 100.67 − 0.667 = **100**. No other threshold comes close.
4. Predictions: x ≤ 3.5 → ₹11 lakh, x > 3.5 → ₹31 lakh.

A regression tree's prediction is a **step function**: flat within each leaf. It cannot predict outside the range of training targets — a 10,000 sq ft flat still gets ₹31 lakh. This inability to **extrapolate** matters for trends like prices that grow over time.

## Depth, overfitting and pruning

If you let a tree grow until every leaf is pure, it will memorise the training data — including the noise. Each leaf may hold just one row. Training accuracy becomes ~100%, test accuracy drops. Deep trees are a classic case of **high variance** (small changes in the data give a very different tree; see [Overfitting, Regularization and Cross-Validation](/interview/machine-learning/overfitting-regularization-and-cross-validation)).

**Pruning** means limiting or cutting back the tree so it generalises.

### Pre-pruning (stop early)

Stop growing when a condition is met. These are the hyperparameters you will tune most:

| Hyperparameter | Meaning | Typical values |
|---|---|---|
| `max_depth` | Maximum number of levels | 3–10 for a single tree |
| `min_samples_split` | A node needs at least this many rows to be split | 2 (default) to 50 |
| `min_samples_leaf` | Every leaf must have at least this many rows | 1 (default) to 50; strong smoother |
| `max_leaf_nodes` | Maximum number of leaves | 8–64 |
| `min_impurity_decrease` | Split only if impurity drops by at least this much | 0.0–0.01 |
| `max_features` | Features considered at each split | All (default) for one tree; `"sqrt"` in random forests |
| `criterion` | Split measure | `"gini"`, `"entropy"`, `"log_loss"`; `"squared_error"` for regression |
| `class_weight` | Up-weight rare classes | `"balanced"` |

### Post-pruning (grow, then cut)

Grow a full tree, then remove branches that do not help enough. scikit-learn implements **cost-complexity pruning**: it minimises

total impurity of the leaves + α × (number of leaves)

A bigger **α** (`ccp_alpha`) removes more branches. You pick α by cross-validation; `cost_complexity_pruning_path` lists the candidate values.

> **Common mistake:** Reporting a decision tree's training accuracy of 100% as "great". An unpruned tree almost always reaches ~100% on training data. Only validation or test accuracy means anything.

## Decision trees in scikit-learn

First the six-row example, so you can match the hand calculation:

```python
import pandas as pd
from sklearn.tree import DecisionTreeClassifier, export_text

df = pd.DataFrame({
    "is_old":      [0, 0, 0, 0, 1, 1],     # Young = 0, Old = 1
    "income_high": [1, 1, 0, 0, 1, 0],     # Low = 0, High = 1
    "buys":        ["No", "Yes", "No", "No", "Yes", "Yes"],
})
X, y = df[["is_old", "income_high"]], df["buys"]

tree = DecisionTreeClassifier(criterion="gini", random_state=0).fit(X, y)
print(export_text(tree, feature_names=list(X.columns)))
print(dict(zip(X.columns, tree.feature_importances_)))
print(tree.predict(pd.DataFrame({"is_old": [1], "income_high": [0]})))
```

```text
|--- is_old <= 0.50
|   |--- income_high <= 0.50
|   |   |--- class: No
|   |--- income_high >  0.50
|   |   |--- class: No
|--- is_old >  0.50
|   |--- class: Yes

{'is_old': 0.75, 'income_high': 0.25}
['Yes']
```

The leaf "income_high > 0.50" holds 1 Yes and 1 No; on a tie scikit-learn picks the first class in sorted order ("No"). The **feature importances** are each feature's total impurity decrease, weighted by the number of rows, normalised to sum to 1: Age reduced 6 × 0.25 = 1.5, Income reduced 4 × 0.125 = 0.5 → 1.5 ÷ 2 = 0.75 and 0.5 ÷ 2 = 0.25.

Now the effect of depth on a real dataset:

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.tree import DecisionTreeClassifier

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

for depth in [1, 2, 3, 5, None]:                     # None = grow until leaves are pure
    t = DecisionTreeClassifier(max_depth=depth, random_state=42).fit(X_train, y_train)
    cv = cross_val_score(DecisionTreeClassifier(max_depth=depth, random_state=42), X_train, y_train, cv=5).mean()
    print(f"depth={str(depth):4s} train={t.score(X_train, y_train):.3f} cv={cv:.3f} leaves={t.get_n_leaves()}")

# Post-pruning: find candidate alphas, then pick the best by cross-validation
path = DecisionTreeClassifier(random_state=42).cost_complexity_pruning_path(X_train, y_train)
print(len(path.ccp_alphas), "candidate alphas")
```

```text
depth=1    train=0.92... cv=0.90...  leaves=2
depth=2    train=0.95... cv=0.92...  leaves=4
depth=3    train=0.97... cv=0.92...  leaves=8 (or fewer)
depth=5    train=0.99... cv=0.92...  leaves=...
depth=None train=1.000  cv=0.91...  leaves=~15-20
(approximate; the pattern matters: train keeps rising, CV stops improving)
```

To visualise a tree as a picture use `sklearn.tree.plot_tree(tree, feature_names=..., filled=True)` with matplotlib.

## Pros, cons and when to use

| Pros | Cons |
|---|---|
| Very easy to explain and draw | A single tree overfits easily (high variance) |
| No scaling needed; handles mixed feature types | Unstable: small data changes give a different tree |
| Captures non-linear patterns and interactions automatically | Greedy splits are not globally optimal |
| Fast to predict | Axis-aligned splits: diagonal boundaries need many steps |
| Handles missing values (scikit-learn 1.3+ for some splitters) | Cannot extrapolate beyond the training range |
| Gives feature importances | Usually less accurate than ensembles |

**Use a single tree when:** you need a model a non-technical person can read (rules for a call centre, a medical triage flowchart), or as a quick baseline. **In practice**, for accuracy, use an ensemble of trees — random forest or gradient boosting — in [Ensembles: Random Forest and Boosting](/interview/machine-learning/ensembles-random-forest-and-boosting).

> **Remember:** Trees do not need scaling, they handle non-linearity and interactions, but a single deep tree has high variance. Ensembles fix the variance.

## Key terms

| Term | Simple meaning |
|---|---|
| Decision tree | A model that predicts by asking a sequence of yes/no questions |
| Root / internal / leaf node | First question / a question / an end point with a prediction |
| Depth | Number of questions from root to the deepest leaf |
| Split | Dividing a node's rows into two groups by a question |
| Pure node | All rows in it have the same label |
| Impurity | How mixed the labels in a node are |
| Gini impurity | 1 − Σpₖ²; chance two random rows have different labels |
| Entropy | −Σpₖlog₂pₖ; uncertainty in bits |
| Information gain | Parent entropy − weighted child entropy |
| CART | The greedy, binary-split tree algorithm used by scikit-learn |
| Greedy | Choosing the best step now without looking ahead |
| Threshold | The cut value for a numeric feature (age ≤ 27.5) |
| Regression tree | A tree whose leaves predict the mean target; splits reduce MSE |
| Extrapolation | Predicting outside the range of training data |
| Pre-pruning | Stopping growth early (max_depth, min_samples_leaf) |
| Post-pruning / cost-complexity pruning | Growing fully, then cutting branches; controlled by ccp_alpha |
| Feature importance | Total impurity decrease contributed by a feature |

## Interview questions

**How does a decision tree decide where to split?**
At each node it tries every feature and every candidate threshold, computes the impurity of the resulting children (Gini or entropy for classification, MSE for regression), and chooses the split with the largest weighted decrease in impurity. It repeats this greedily in each child until a stopping rule is met.

**What is the difference between Gini impurity and entropy?**
Both measure how mixed a node is and are zero for a pure node. Gini is 1 − Σp² and entropy is −Σp log₂p. They usually pick the same splits; Gini is slightly faster because it avoids logarithms, so it is the default in scikit-learn. Entropy is the basis of information gain.

**Compute the Gini impurity of a node with 8 positives and 2 negatives.**
p = 0.8, so Gini = 1 − 0.8² − 0.2² = 1 − 0.64 − 0.04 = 0.32.

**Why do decision trees overfit, and how do you stop it?**
Without limits, a tree keeps splitting until each leaf is pure, which memorises noise. Prevent it with pre-pruning (max_depth, min_samples_leaf, max_leaf_nodes, min_impurity_decrease), post-pruning with cost-complexity pruning (ccp_alpha), or by using an ensemble such as a random forest.

**Do decision trees need feature scaling? Why?**
No. A split only compares a feature's value to a threshold, so only the order of values matters. Multiplying a feature by 1,000 or taking its log changes the threshold but not the split.

**How does a regression tree make predictions?**
Each leaf predicts the mean of the training targets in that leaf, and splits are chosen to minimise the weighted mean squared error of the children. The prediction is a piecewise-constant step function, so it cannot extrapolate beyond the training target range.

**What is information gain?**
The reduction in entropy from a split: the parent's entropy minus the weighted average entropy of the children. The split with the largest information gain removes the most uncertainty about the label.

**How are feature importances computed in a tree, and what is their weakness?**
Each feature's importance is the total impurity decrease from splits on that feature, weighted by the number of samples reaching those splits, normalised to sum to 1. They are biased toward high-cardinality numeric features with many possible split points, and they are computed on training data. Permutation importance on validation data is more reliable.

**Why is a single decision tree called unstable?**
Small changes in the training data can change the root split, and because everything below depends on it, the whole tree can change. This is high variance. Bagging and random forests average many trees to reduce it.

**What is the time complexity of training a tree?**
Roughly O(n · d · log n) for n rows and d features: at each level, for each feature, the rows are sorted (or pre-sorted) and scanned once to evaluate thresholds. Prediction is O(depth).

## Try it yourself

1. **Gini by hand.** A node has 10 rows: 4 cats, 4 dogs, 2 rabbits. Compute its Gini impurity and entropy.
   *Hint: three classes; log₂(0.4) ≈ −1.322, log₂(0.2) ≈ −2.322.*
2. **Pick the split.** 8 rows, 4 Yes / 4 No. Split A gives children (3 Yes, 1 No) and (1 Yes, 3 No). Split B gives (4 Yes, 2 No) and (0 Yes, 2 No). Which has the lower weighted Gini?
   *Hint: compute each child's Gini, then weight by size (4/8 or 6/8 and 2/8).*
3. **Regression split.** x = 1, 2, 3, 4 and y = 5, 7, 20, 22. Compare the weighted MSE for thresholds x ≤ 1.5, x ≤ 2.5 and x ≤ 3.5.
   *Hint: leaf prediction = mean of its y values.*
4. **Code.** On breast cancer, run `GridSearchCV` over `max_depth` [2, 3, 4, 5, 6, None] and `min_samples_leaf` [1, 5, 10, 20]. Report the best parameters and test accuracy.
   *Hint: see [Pipelines and Hyperparameter Tuning](/interview/machine-learning/pipelines-and-hyperparameter-tuning).*

### Answers

1. p = 0.4, 0.4, 0.2. Gini = 1 − (0.16 + 0.16 + 0.04) = 0.64. Entropy = −(0.4 × −1.322 + 0.4 × −1.322 + 0.2 × −2.322) = 0.529 + 0.529 + 0.464 = 1.522 bits.
2. A: each child Gini = 1 − 0.5625 − 0.0625 = 0.375 → weighted 0.375. B: (4, 2) child Gini = 1 − (4/6)² − (2/6)² = 0.444, weight 6/8 → 0.333; (0, 2) child Gini = 0. Weighted = 0.333. **B is better** (lower).
3. x ≤ 1.5: left {5} MSE 0; right {7, 20, 22} mean 16.33, MSE = (87.1 + 13.4 + 32.1) ÷ 3 ≈ 44.2 → weighted 0.75 × 44.2 ≈ 33.2. x ≤ 2.5: left {5, 7} MSE 1; right {20, 22} MSE 1 → weighted **1.0**. x ≤ 3.5: left {5, 7, 20} mean 10.67, MSE ≈ 44.2; right {22} 0 → weighted ≈ 33.2. Best: x ≤ 2.5.
4. A typical result is a depth of 3–5 with min_samples_leaf around 5, and test accuracy around 0.92–0.95; a random forest will beat it.

**Next:** [Ensembles: Random Forest and Boosting](/interview/machine-learning/ensembles-random-forest-and-boosting)
