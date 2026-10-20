---
title: Logistic Regression
part: Core Algorithms
summary: The workhorse classifier — the sigmoid, probabilities and odds, the decision boundary, log loss and its gradient worked by hand, multiclass with one-vs-rest and softmax, choosing the threshold, and scikit-learn code.
---

Logistic regression answers yes/no questions: will this customer churn, is this payment fraud, will this user click the ad? Despite the name, it is a **classification** algorithm. It is fast, gives probabilities, and is easy to explain, so banks, hospitals and ad systems use it everywhere — and it is the first baseline you should train on any classification problem. It is also exactly one neuron of a neural network, so it is the bridge to deep learning.

> **In simple words:** Compute a score like linear regression (w·x + b), then squash it through the S-shaped sigmoid curve so it becomes a probability between 0 and 1. If the probability is above a threshold (usually 0.5), predict "yes".

## Why not just use linear regression?

Suppose we predict pass (1) or fail (0) from hours studied, using a straight line. Problems:

1. The line gives values like −0.3 or 1.4. These cannot be probabilities.
2. One student who studied 40 hours pulls the line flat and moves the 0.5 crossing point, even though they are an easy "pass".
3. Squared error is not the right way to judge probabilities.

We need a function that turns any score into a number between 0 and 1. That function is the sigmoid.

## The sigmoid function

The **sigmoid** (also called the **logistic function**) is:

<div class="formula">

| Formula | Meaning |
|---|---|
| σ(z) = 1 ÷ (1 + e⁻ᶻ) | squashes any real number z into (0, 1) |
| σ(0) = 0.5 · σ(large +) → 1 · σ(large −) → 0 | key values |
| σ(−z) = 1 − σ(z) | symmetric around 0.5 |
| σ′(z) = σ(z)·(1 − σ(z)) | its derivative (maximum 0.25 at z = 0) |

</div>

<figure>
<svg viewBox="0 0 420 220" width="420" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="20" y1="190" x2="400" y2="190" />
<line x1="210" y1="20" x2="210" y2="200" />
<line x1="20" y1="30" x2="400" y2="30" stroke-dasharray="3 3" />
<line x1="20" y1="110" x2="400" y2="110" stroke-dasharray="3 3" />
<text x="24" y="26" fill="currentColor" stroke="none">1</text>
<text x="24" y="106" fill="currentColor" stroke="none">0.5</text>
<text x="24" y="186" fill="currentColor" stroke="none">0</text>
<polyline points="30,189.6 60,188.9 90,187.1 120,182.4 135,177.9 150,170.9 165,160.8 180,147.0 195,129.6 210,110 225,90.4 240,73.0 255,59.2 270,49.1 285,42.1 300,37.6 330,34.9 360,33.1 390,30.4" stroke="var(--accent)" stroke-width="2.5" />
<text x="30" y="207" fill="currentColor" stroke="none">z = −6</text>
<text x="210" y="207" text-anchor="middle" fill="currentColor" stroke="none">0</text>
<text x="390" y="207" text-anchor="end" fill="currentColor" stroke="none">z = 6</text>
<text x="250" y="130" fill="currentColor" stroke="none">predict 1 when σ(z) ≥ 0.5</text>
<text x="250" y="145" fill="currentColor" stroke="none">(that is, when z ≥ 0)</text>
<text x="230" y="60" fill="var(--accent)" stroke="none">σ(z)</text>
</svg>
<figcaption>The sigmoid turns any score z into a probability; it is 0.5 at z = 0, close to 1 for large positive z and close to 0 for large negative z.</figcaption>
</figure>

## The model

Logistic regression has two steps:

1. Compute a linear score: z = w₁x₁ + w₂x₂ + … + b. This is called the **logit**.
2. Turn it into a probability: p = σ(z) = P(y = 1 | x).

Then decide: predict 1 if p ≥ threshold (default 0.5), else 0.

### Worked example: pass or fail

A trained model for "will the student pass?" has w = 1.5 and b = −6. So z = 1.5 × hours − 6.

| Hours | z = 1.5h − 6 | p = σ(z) | Prediction (threshold 0.5) |
|---|---|---|---|
| 1 | −4.5 | 0.011 | Fail |
| 2 | −3.0 | 0.047 | Fail |
| 3 | −1.5 | 0.182 | Fail |
| 4 | 0.0 | 0.500 | Boundary |
| 5 | 1.5 | 0.818 | Pass |
| 6 | 3.0 | 0.953 | Pass |
| 7 | 4.5 | 0.989 | Pass |

How to compute one row by hand, hours = 5: z = 1.5 × 5 − 6 = 1.5. e⁻¹·⁵ ≈ 0.2231. p = 1 ÷ (1 + 0.2231) = 1 ÷ 1.2231 ≈ **0.818**.

### Odds and log-odds: what the weights mean

The **odds** of an event are p ÷ (1 − p). If p = 0.8, the odds are 0.8 ÷ 0.2 = 4 ("4 to 1"). Logistic regression says the **log of the odds** is linear:

ln(p ÷ (1 − p)) = z = w·x + b

So:

- Increasing x by 1 adds w to the log-odds.
- That means it **multiplies the odds by eʷ**.

Here w = 1.5, and e¹·⁵ ≈ 4.48. **Each extra hour of study multiplies the odds of passing by about 4.5.** At 5 hours, the odds are 0.818 ÷ 0.182 ≈ 4.48; at 4 hours they were 1. This is exactly how doctors and bankers interpret logistic regression ("smoking multiplies the odds of disease by 2.3").

> **Interview tip:** Say "a coefficient is the change in log-odds for a one-unit change in the feature; e to the coefficient is the **odds ratio**". This one sentence is a very common interview check.

## The decision boundary

The model predicts 1 when p ≥ 0.5, which happens exactly when z ≥ 0. The set of points where z = 0 is the **decision boundary**.

- With one feature: 1.5 × hours − 6 = 0 → hours = **4**. Students above 4 hours are predicted to pass.
- With two features, z = w₁x₁ + w₂x₂ + b = 0 is a **straight line** in the plane. With more features it is a flat surface (a **hyperplane**).

So logistic regression is a **linear classifier**: it separates classes with a straight line. If the classes are arranged in a circle (one class inside another), it fails — unless you add features like x₁², x₂².

Example with two features: a loan model with z = 0.8 × income_lakh − 1.2 × existing_loans − 2. The boundary is 0.8 × income − 1.2 × loans = 2. An applicant with income 5 lakh and 1 loan: z = 4 − 1.2 − 2 = 0.8 > 0 → approve, p = σ(0.8) ≈ 0.69.

## Training: log loss

For each training row the model gives p. We judge it with **log loss** (binary cross-entropy), explained in [Gradient Descent and Loss Functions](/interview/ai-engineer/machine-learning/gradient-descent-and-loss-functions):

<div class="formula">

| Formula | Meaning |
|---|---|
| L = −(1/n) Σ [ yᵢ·ln(pᵢ) + (1 − yᵢ)·ln(1 − pᵢ) ] | average log loss |
| ∂L/∂w = (1/n) Σ (pᵢ − yᵢ)·xᵢ | gradient for a weight |
| ∂L/∂b = (1/n) Σ (pᵢ − yᵢ) | gradient for the bias |

</div>

The gradient is beautifully simple: **(prediction − truth) × input**, the same shape as for linear regression. This is because the derivative of the sigmoid cancels against the derivative of the log. There is no closed-form solution, so we use gradient descent or a related solver. The loss is convex, so the solver finds the global best weights.

### Worked example: loss and one gradient step

Four students. Current model w = 1.5, b = −6.

| Hours x | Passed y | p | Loss term |
|---|---|---|---|
| 2 | 0 | 0.0474 | −ln(1 − 0.0474) = 0.0486 |
| 3 | 1 | 0.1824 | −ln(0.1824) = 1.7014 |
| 5 | 1 | 0.8176 | −ln(0.8176) = 0.2014 |
| 6 | 1 | 0.9526 | −ln(0.9526) = 0.0486 |

Average log loss = (0.0486 + 1.7014 + 0.2014 + 0.0486) ÷ 4 = 2.0 ÷ 4 = **0.500**. The student who studied 3 hours and still passed causes most of the loss — the model gave them only 18%.

Gradient:

- p − y = 0.0474, −0.8176, −0.1824, −0.0474
- (p − y) × x = 0.0949, −2.4527, −0.9121, −0.2846 → sum = −3.5546 → ∂L/∂w = −3.5546 ÷ 4 = **−0.8886**
- ∂L/∂b = (0.0474 − 0.8176 − 0.1824 − 0.0474) ÷ 4 = −1.0 ÷ 4 = **−0.25**

Update with learning rate 0.1:

- w = 1.5 − 0.1 × (−0.8886) = **1.5889**
- b = −6 − 0.1 × (−0.25) = **−5.975**

The new average loss is about **0.422**, lower than 0.500. The boundary moved from 4.0 hours to 5.975 ÷ 1.5889 ≈ 3.76 hours, towards the student who passed with 3 hours.

## Regularization in logistic regression

If the classes can be separated perfectly, the weights grow without limit (the model becomes "infinitely confident"). In general, large weights mean overfitting. **Regularization** adds a penalty for large weights to the loss:

- **L2** (ridge-like) penalty: adds λ·Σw². Shrinks all weights. The scikit-learn default.
- **L1** (lasso-like) penalty: adds λ·Σ|w|. Pushes some weights to exactly 0, which selects features.

In scikit-learn the strength is set by **C = 1 ÷ λ**. **Smaller C means stronger regularization.** This is the opposite direction from `alpha` in Ridge — a classic trap. Details in [Overfitting, Regularization and Cross-Validation](/interview/ai-engineer/machine-learning/overfitting-regularization-and-cross-validation).

> **Common mistake:** Not scaling features before regularized logistic regression. The penalty treats all weights equally, so a feature measured in rupees (small weight) is penalised differently from one measured in lakhs. Put `StandardScaler` in the pipeline.

## Multiclass logistic regression

What if there are more than two classes — for example, classify a support ticket as Billing, Delivery or Technical?

### One-vs-rest (OvR)

Train one binary model per class: "Billing vs not Billing", "Delivery vs not Delivery", "Technical vs not Technical". For a new ticket, run all three and pick the class with the highest probability. Simple, but the three probabilities do not add up to 1.

### Softmax (multinomial) regression

One model gives a score zₖ for each class k, then the **softmax** function turns the scores into probabilities that add up to 1:

<div class="formula">

| Formula | Meaning |
|---|---|
| P(class k) = e^(zₖ) ÷ Σⱼ e^(zⱼ) | softmax: exponentiate, then divide by the total |
| Loss = −ln(P(true class)) | categorical cross-entropy |

</div>

Worked example: scores z = [2.0, 1.0, 0.1] for [Billing, Delivery, Technical].

1. Exponentiate: e² = 7.389, e¹ = 2.718, e⁰·¹ = 1.105.
2. Total = 7.389 + 2.718 + 1.105 = 11.212.
3. Divide: 7.389 ÷ 11.212 = **0.659**, 2.718 ÷ 11.212 = **0.242**, 1.105 ÷ 11.212 = **0.099**.

Predicted class: Billing (65.9%). If the true class is Billing, loss = −ln(0.659) = 0.417.

With two classes, softmax reduces to the sigmoid. The same softmax sits at the end of every neural classifier and of every LLM (choosing the next token from the vocabulary).

| | One-vs-rest | Softmax (multinomial) |
|---|---|---|
| Models | K binary models | One joint model |
| Probabilities sum to 1? | No (normalise afterwards) | Yes |
| Classes | Independent decisions | Compete with each other |
| scikit-learn | `OneVsRestClassifier(LogisticRegression())` | `LogisticRegression()` default for multiclass with lbfgs |

In current scikit-learn (1.5+), `LogisticRegression` with the default `lbfgs` solver uses the multinomial (softmax) form for multiclass data automatically. The old `multi_class` argument is deprecated; to get OvR, wrap the model in `OneVsRestClassifier`.

## Choosing the threshold

The default threshold of 0.5 is not sacred. The model gives a probability; **you** decide the cut-off based on the cost of each mistake.

Ten patients with model scores (1 = has the disease):

| Score | 0.95 | 0.80 | 0.70 | 0.60 | 0.45 | 0.40 | 0.35 | 0.20 | 0.10 | 0.05 |
|---|---|---|---|---|---|---|---|---|---|---|
| True y | 1 | 1 | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 0 |

**Precision** = of the patients we flagged, what fraction are really sick. **Recall** = of the sick patients, what fraction we flagged (see [Evaluation Metrics](/interview/ai-engineer/machine-learning/evaluation-metrics)).

| Threshold | Flagged | True positives | False positives | Missed sick | Precision | Recall |
|---|---|---|---|---|---|---|
| 0.75 | 2 | 2 | 0 | 2 | 2/2 = 1.00 | 2/4 = 0.50 |
| 0.50 | 4 | 3 | 1 | 1 | 3/4 = 0.75 | 3/4 = 0.75 |
| 0.30 | 7 | 4 | 3 | 0 | 4/7 = 0.57 | 4/4 = 1.00 |

- **Cancer screening**: missing a sick patient is terrible → use a low threshold (0.3) for high recall; doctors re-check the false alarms.
- **Spam filter**: losing a real email is worse than seeing some spam → use a high threshold for high precision.
- **Fraud**: choose the threshold from the cost: (cost of missed fraud × missed) vs (cost of blocking a good user × false alarms).

> **Remember:** Lower threshold → more positives → higher recall, lower precision. Higher threshold → the opposite. Choose the threshold on validation data, never on the test set.

## Logistic regression in scikit-learn

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score, precision_recall_curve
import numpy as np

X, y = load_breast_cancer(return_X_y=True, as_frame=True)
y = 1 - y          # make 1 = malignant, so "positive" means "disease"
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

model = make_pipeline(
    StandardScaler(),                               # needed: penalty treats all weights equally
    LogisticRegression(C=1.0, max_iter=1000),       # L2 penalty by default; smaller C = stronger
)
model.fit(X_train, y_train)

proba = model.predict_proba(X_test)[:, 1]           # P(malignant) for each test row
print("ROC-AUC:", round(roc_auc_score(y_test, proba), 3))
print(classification_report(y_test, model.predict(X_test), digits=3))

# Choose a threshold that gives at least 98% recall (for illustration; do this on validation data)
prec, rec, thr = precision_recall_curve(y_test, proba)
ok = np.where(rec[:-1] >= 0.98)[0]
best = ok[-1]                                       # highest threshold that still keeps recall >= 0.98
print("threshold:", round(thr[best], 3), "precision:", round(prec[best], 3), "recall:", round(rec[best], 3))
y_pred_custom = (proba >= thr[best]).astype(int)

# Interpreting weights: odds ratio per 1 standard deviation of each feature
coefs = model.named_steps["logisticregression"].coef_[0]
top = np.argsort(-np.abs(coefs))[:3]
for i in top:
    print(X.columns[i], "odds ratio per 1 std:", round(np.exp(coefs[i]), 2))
```

```text
ROC-AUC: 0.99...     (logistic regression is very strong on this dataset; about 0.99-1.00)
              precision    recall  f1-score   support
           0      0.97...   0.98...  ...         72
           1      0.97...   0.95...  ...         42
    accuracy                         0.97...    114
threshold: 0.2...  precision: 0.9...  recall: 0.98...
worst texture  odds ratio per 1 std: ...
...  (exact digits depend on the version and split)
```

Useful methods: `predict_proba` (probabilities), `decision_function` (the raw score z), `coef_` and `intercept_` (the learned weights).

> **Interview tip:** Mention that logistic regression probabilities are usually **well calibrated** (a predicted 0.8 really happens about 80% of the time), unlike many tree models or SVMs. This matters when probabilities feed business decisions, such as expected loss = P(default) × loan amount.

## Pros, cons and when to use

| Pros | Cons |
|---|---|
| Fast to train and predict, even on millions of rows | Linear boundary only (unless you engineer features) |
| Outputs calibrated probabilities | Needs scaling and encoding of features |
| Coefficients are interpretable (odds ratios) | Struggles with complex interactions |
| Little overfitting with regularization | Sensitive to strongly correlated features (interpretation) |
| Convex: always finds the best weights | Usually less accurate than gradient boosting on tabular data |
| Works well with sparse high-dimensional data (text TF-IDF) | Perfectly separable data needs regularization |

**Use it when:** you need a fast, explainable baseline; regulators require explanation (credit scoring); you need good probabilities; features are many and sparse (text classification with TF-IDF works surprisingly well).

**Prefer something else when:** relationships are strongly non-linear and you have plenty of data (gradient boosting), or the input is raw images or audio (neural networks).

### Hyperparameters that matter

| Hyperparameter | Meaning | Tip |
|---|---|---|
| `C` | Inverse regularization strength | Try 0.001 to 100 on a log scale; smaller = simpler model |
| `penalty` | `"l2"` (default), `"l1"`, `"elasticnet"`, or none | L1 needs solver `"liblinear"` or `"saga"`; elasticnet needs `"saga"` with `l1_ratio` |
| `solver` | Optimisation algorithm | `"lbfgs"` default; `"saga"` for large or sparse data |
| `class_weight` | Up-weight rare classes | `"balanced"` for imbalanced data |
| `max_iter` | Iteration limit | Raise to 1000+ if you see a convergence warning |
| Threshold | Cut-off on `predict_proba` | Not a constructor argument — choose it yourself (or use `TunedThresholdClassifierCV` in scikit-learn 1.5+) |

## Key terms

| Term | Simple meaning |
|---|---|
| Logistic regression | A linear classifier that outputs probabilities via the sigmoid |
| Sigmoid / logistic function | σ(z) = 1/(1 + e⁻ᶻ), squashes any number into (0, 1) |
| Logit | The raw linear score z before the sigmoid; equals the log-odds |
| Odds | p ÷ (1 − p) |
| Log-odds | ln(odds); linear in the features |
| Odds ratio | eʷ: how much the odds multiply for +1 in a feature |
| Decision boundary | Where p = 0.5 (z = 0); a straight line or hyperplane |
| Linear classifier | A classifier whose boundary is a line or hyperplane |
| Log loss / binary cross-entropy | −[y·ln p + (1 − y)·ln(1 − p)] |
| One-vs-rest (OvR) | One binary model per class |
| Softmax | Turns K scores into K probabilities that sum to 1 |
| Multinomial logistic regression | Softmax-based multiclass logistic regression |
| Threshold | The probability cut-off for predicting the positive class |
| Precision / recall | Correct among flagged / flagged among actual positives |
| C | Inverse regularization strength in scikit-learn |
| Calibration | Whether predicted probabilities match real frequencies |

## Interview questions

**Why is it called regression if it does classification?**
Because it is a regression on the log-odds: it fits a linear model to ln(p/(1 − p)). The output is a continuous probability; it becomes a classifier only when we apply a threshold.

**Why use the sigmoid?**
It maps any real-valued score to (0, 1), so the output can be read as a probability. It is smooth and differentiable, and it comes naturally from modelling log-odds as linear. Its derivative σ(1 − σ) makes the log-loss gradient simple.

**What loss does logistic regression minimise, and why not MSE?**
Log loss (binary cross-entropy), which is the negative log-likelihood of a Bernoulli model. It is convex in the weights, so we get the global optimum, and it strongly penalises confident wrong predictions. MSE with a sigmoid is non-convex and gives tiny gradients when the model is confidently wrong.

**How do you interpret a coefficient of 0.7?**
A one-unit increase in that feature increases the log-odds by 0.7, which multiplies the odds of the positive class by e⁰·⁷ ≈ 2.0, holding other features fixed. If the features were standardised, "one unit" means one standard deviation.

**Is the decision boundary linear? How can it learn a non-linear boundary?**
Yes, it is a line or hyperplane where w·x + b = 0. To get a curved boundary, add non-linear features — squares, interactions, splines — and the boundary is still linear in that new feature space but curved in the original one.

**How does logistic regression handle multiple classes?**
Either one-vs-rest, training one binary classifier per class and picking the highest score, or multinomial (softmax) regression, which learns all class scores jointly and normalises them with softmax so the probabilities sum to 1. scikit-learn uses multinomial by default with the lbfgs solver.

**How do you choose the classification threshold?**
Based on the business cost of false positives versus false negatives. I plot precision and recall against the threshold on validation data and pick the point that meets the requirement — for example recall ≥ 95% for disease screening — or the one that minimises expected cost.

**What happens with perfectly separable data?**
The likelihood keeps increasing as the weights grow, so without regularization the weights go to infinity and the solver does not converge. Regularization (scikit-learn's default L2) keeps the weights finite.

**What does C mean in scikit-learn's LogisticRegression?**
C is the inverse of the regularization strength. Small C means strong regularization and simpler models; large C means weak regularization and a closer fit to the training data. It is usually tuned on a log scale with cross-validation.

**How is logistic regression related to neural networks?**
A single neuron with a sigmoid activation, trained with binary cross-entropy, is exactly logistic regression. A neural network stacks many such units with non-linear activations, which lets it learn non-linear boundaries. See [From Neuron to Neural Network](/interview/ai-engineer/deep-learning/from-neuron-to-neural-network).

**Logistic regression vs a decision tree for a credit model?**
Logistic regression gives smooth, calibrated probabilities and clear coefficients that regulators like, but only a linear boundary. A tree captures interactions and non-linearity without scaling but is unstable and less calibrated. In practice banks often use logistic regression scorecards or gradient boosting with explainability tools.

## Try it yourself

1. **Compute by hand.** With w = 2, b = −5: find p for x = 1, 2.5 and 4. Where is the decision boundary?
   *Hint: σ(z) = 1/(1 + e⁻ᶻ); e³ ≈ 20.09.*
2. **Odds ratio.** A churn model has a coefficient of −0.4 for "number of orders last month". Interpret it.
   *Hint: e⁻⁰·⁴ ≈ 0.67.*
3. **Softmax.** Scores [1, 1, 3]. Compute the probabilities.
   *Hint: e³ ≈ 20.09, e¹ ≈ 2.718.*
4. **Code.** Train logistic regression on breast cancer with C = 0.01, 1 and 100. Print train and test accuracy for each, and the number of coefficients with absolute value > 1.
   *Hint: `np.sum(np.abs(coef) > 1)`.*

### Answers

1. x = 1: z = −3, p = 1/(1 + 20.09) ≈ 0.047. x = 2.5: z = 0, p = 0.5. x = 4: z = 3, p = 1/(1 + 0.0498) ≈ 0.953. Boundary at x = 2.5.
2. Each extra order last month multiplies the odds of churning by about 0.67 — a 33% decrease in the odds — holding other features fixed.
3. Exponentials 2.718, 2.718, 20.09; total 25.52. Probabilities ≈ 0.107, 0.107, 0.787.
4. C = 0.01 gives smaller weights (few or none above 1) and slightly lower train accuracy; C = 100 gives larger weights and near-perfect train accuracy, with test accuracy often no better — stronger regularization trades a little fit for stability.

**Next:** [Decision Trees](/interview/ai-engineer/machine-learning/decision-trees)
