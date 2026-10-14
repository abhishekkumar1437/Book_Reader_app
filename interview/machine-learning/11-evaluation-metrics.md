---
title: Evaluation Metrics
part: Making Models Good
summary: How to measure a model honestly — the confusion matrix built from 100 predictions, accuracy, precision, recall, F1, ROC-AUC and PR-AUC worked by hand, multiclass averaging, calibration, which metric for fraud, cancer and spam, and regression metrics MAE, RMSE, R² and MAPE.
---

A model is only as good as the number you use to judge it. Choose the wrong metric and you will happily ship a fraud model that catches no fraud. In real AI engineering work, picking the metric is a product decision: it encodes what a mistake costs. In interviews, "precision vs recall" and "why not accuracy" are among the most asked questions of all.

> **In simple words:** First count the four kinds of outcomes — correct alarms, false alarms, missed cases, correct all-clears. Every classification metric is just a different ratio of these four counts. Pick the ratio that matches which mistake hurts more.

## The confusion matrix

For a binary classifier, every prediction falls into one of four boxes. Call the class we care about (disease, fraud, spam) the **positive** class.

| | Predicted positive | Predicted negative |
|---|---|---|
| **Actually positive** | **True positive (TP)** — correct alarm | **False negative (FN)** — missed case |
| **Actually negative** | **False positive (FP)** — false alarm | **True negative (TN)** — correct all-clear |

This table is the **confusion matrix**. A false positive is also called a **Type I error**; a false negative is a **Type II error**.

> **Real-life example:** A metal detector at a railway station. TP: it beeps for a person carrying a knife. FP: it beeps for a person with a belt buckle. FN: it stays silent for a person with a knife — the dangerous mistake. TN: silent for a person with nothing.

### Worked example: 100 predictions

A disease screening model is tested on **100 patients**. **10** really have the disease; **90** are healthy.

- Of the 10 sick patients, the model flags 8 → **TP = 8**, and misses 2 → **FN = 2**.
- Of the 90 healthy patients, the model wrongly flags 12 → **FP = 12**, and correctly clears 78 → **TN = 78**.

| | Predicted sick | Predicted healthy | Total |
|---|---|---|---|
| **Actually sick** | TP = 8 | FN = 2 | 10 |
| **Actually healthy** | FP = 12 | TN = 78 | 90 |
| **Total** | 20 | 80 | 100 |

Check: 8 + 2 + 12 + 78 = 100.

## Metrics from the confusion matrix

<div class="formula">

| Metric | Formula | Question it answers | Our example |
|---|---|---|---|
| Accuracy | (TP + TN) ÷ total | What fraction of all predictions is right? | (8 + 78) ÷ 100 = **0.86** |
| Precision | TP ÷ (TP + FP) | When the model says "positive", how often is it right? | 8 ÷ 20 = **0.40** |
| Recall (sensitivity, TPR) | TP ÷ (TP + FN) | Of all real positives, how many did we catch? | 8 ÷ 10 = **0.80** |
| Specificity (TNR) | TN ÷ (TN + FP) | Of all real negatives, how many did we clear? | 78 ÷ 90 = **0.867** |
| False positive rate (FPR) | FP ÷ (FP + TN) = 1 − specificity | Of real negatives, how many got a false alarm? | 12 ÷ 90 = **0.133** |
| F1 score | 2 · P · R ÷ (P + R) | Balance of precision and recall | 2 × 0.4 × 0.8 ÷ 1.2 = **0.533** |

</div>

### Why accuracy misleads

A "model" that simply says **healthy for everyone** gets TP = 0, FN = 10, FP = 0, TN = 90. Its accuracy is 90 ÷ 100 = **0.90** — higher than our real model's 0.86! But it catches zero sick patients (recall = 0).

When classes are imbalanced, accuracy rewards ignoring the rare class. **Accuracy is only meaningful when classes are roughly balanced and both errors cost about the same.**

> **Common mistake:** Reporting "99% accuracy" on fraud data where 99.5% of transactions are genuine. Always compare with the majority-class baseline and report precision and recall for the positive class.

### Precision vs recall

- **Precision** cares about **false alarms**. Low precision = many false positives. Our model: when it says "sick", it is right only 40% of the time.
- **Recall** cares about **missed cases**. Low recall = many false negatives. Our model catches 80% of sick patients.

They pull against each other through the **threshold** (see [Logistic Regression](/interview/machine-learning/logistic-regression)). Lowering the threshold flags more cases: recall goes up, precision usually goes down.

> **Remember:** **P**recision = how **p**ure your positive predictions are. **R**ecall = how many real positives you **r**etrieved.

### F1 and F-beta

**F1** is the **harmonic mean** of precision and recall. The harmonic mean is pulled towards the smaller value, so F1 is high only if **both** are high. A model with P = 1.0 and R = 0.01 has F1 ≈ 0.02, while a simple average would say 0.505.

When one matters more, use **F-beta**: Fβ = (1 + β²) · P · R ÷ (β² · P + R).

- β = 2 weights recall more (screening). Our example: F2 = 5 × 0.4 × 0.8 ÷ (4 × 0.4 + 0.8) = 1.6 ÷ 2.4 = **0.667**.
- β = 0.5 weights precision more (spam). F0.5 = 1.25 × 0.32 ÷ (0.25 × 0.4 + 0.8) = 0.4 ÷ 0.9 = **0.444**.

## Threshold-free metrics: ROC-AUC and PR-AUC

Precision, recall and F1 depend on one chosen threshold. Sometimes you want to judge the model's **ranking ability** over all thresholds.

### The ROC curve

For every possible threshold, compute the **true positive rate** (TPR = recall) and the **false positive rate** (FPR). Plot TPR (y-axis) against FPR (x-axis). This is the **ROC curve** (receiver operating characteristic). The **area under it** is **ROC-AUC** (or just AUC).

- AUC = 1.0: perfect ranking.
- AUC = 0.5: random guessing (the diagonal line).
- AUC < 0.5: worse than random (your labels may be flipped).

**AUC has a beautiful meaning: it is the probability that a randomly chosen positive gets a higher score than a randomly chosen negative.**

### Worked example: ROC and AUC by hand

Eight test cases, sorted by model score (4 positives, 4 negatives):

| Score | 0.9 | 0.8 | 0.7 | 0.6 | 0.5 | 0.4 | 0.3 | 0.2 |
|---|---|---|---|---|---|---|---|---|
| True label | 1 | 1 | 0 | 1 | 0 | 1 | 0 | 0 |

Move the threshold down one case at a time (predict positive if score ≥ threshold):

| Threshold | TP | FP | TPR = TP/4 | FPR = FP/4 | Precision |
|---|---|---|---|---|---|
| above 0.9 | 0 | 0 | 0 | 0 | — |
| 0.9 | 1 | 0 | 0.25 | 0 | 1.00 |
| 0.8 | 2 | 0 | 0.50 | 0 | 1.00 |
| 0.7 | 2 | 1 | 0.50 | 0.25 | 0.67 |
| 0.6 | 3 | 1 | 0.75 | 0.25 | 0.75 |
| 0.5 | 3 | 2 | 0.75 | 0.50 | 0.60 |
| 0.4 | 4 | 2 | 1.00 | 0.50 | 0.67 |
| 0.3 | 4 | 3 | 1.00 | 0.75 | 0.57 |
| 0.2 | 4 | 4 | 1.00 | 1.00 | 0.50 |

<figure>
<svg viewBox="0 0 400 260" width="400" height="260" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="50" y="30" width="200" height="200" />
<line x1="50" y1="230" x2="250" y2="30" stroke-dasharray="5 4" />
<polyline points="50,230 50,180 50,130 100,130 100,80 150,80 150,30 200,30 250,30" stroke="var(--accent)" stroke-width="2.5" />
<circle cx="100" cy="130" r="3" fill="var(--accent)" stroke="var(--accent)" />
<circle cx="100" cy="80" r="3" fill="var(--accent)" stroke="var(--accent)" />
<circle cx="150" cy="80" r="3" fill="var(--accent)" stroke="var(--accent)" />
<circle cx="150" cy="30" r="3" fill="var(--accent)" stroke="var(--accent)" />
<text x="150" y="250" text-anchor="middle" fill="currentColor" stroke="none">false positive rate</text>
<text x="20" y="130" fill="currentColor" stroke="none" transform="rotate(-90 20 130)" text-anchor="middle">true positive rate</text>
<text x="46" y="244" text-anchor="end" fill="currentColor" stroke="none">0</text>
<text x="250" y="244" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<text x="44" y="34" text-anchor="end" fill="currentColor" stroke="none">1</text>
<text x="265" y="90" fill="var(--accent)" stroke="none">model: AUC = 0.8125</text>
<text x="265" y="180" fill="currentColor" stroke="none">random: AUC = 0.5</text>
<line x1="258" y1="175" x2="200" y2="85" stroke-dasharray="2 2" />
</svg>
<figcaption>The ROC curve of the eight-case example: the area under the stepped curve is 0.8125; the dashed diagonal is a random model.</figcaption>
</figure>

**AUC as area.** Add the rectangles under the steps: FPR 0 → 0.25 at height 0.5 = 0.125; FPR 0.25 → 0.5 at height 0.75 = 0.1875; FPR 0.5 → 1 at height 1 = 0.5. Total = **0.8125**.

**AUC as pair counting.** There are 4 × 4 = 16 (positive, negative) pairs. Count pairs where the positive has the higher score:

- Positive 0.9: beats all 4 negatives (0.7, 0.5, 0.3, 0.2) → 4
- Positive 0.8: beats all 4 → 4
- Positive 0.6: beats 0.5, 0.3, 0.2 → 3
- Positive 0.4: beats 0.3, 0.2 → 2

Total = 13. AUC = 13 ÷ 16 = **0.8125**. Same answer.

### The precision-recall curve and PR-AUC

Plot **precision** (y) against **recall** (x) for all thresholds. The area under it is **PR-AUC**; the usual way to compute it is **average precision (AP)**: the sum of precision at each new recall level × the recall step.

For our 8 cases, recall rises by 0.25 at scores 0.9, 0.8, 0.6 and 0.4, with precisions 1.0, 1.0, 0.75 and 0.667:

AP = 0.25 × (1.0 + 1.0 + 0.75 + 0.667) = 0.25 × 3.417 = **0.854**.

A random model's PR-AUC equals the **fraction of positives** (here 0.5; for fraud with 0.1% positives, it is 0.001). ROC-AUC's random baseline is always 0.5.

### ROC-AUC vs PR-AUC

With heavy imbalance, ROC-AUC can look great while the model is poor. The FPR divides by the huge number of negatives, so even thousands of false alarms barely move it. Precision does not have that cushion.

| | ROC-AUC | PR-AUC (average precision) |
|---|---|---|
| Axes | TPR vs FPR | Precision vs recall |
| Uses true negatives? | Yes (in FPR) | No |
| Random baseline | 0.5 | Positive class fraction |
| Best for | Balanced-ish data; comparing ranking quality | Rare positive class (fraud, disease, defects) |
| Interpretation | P(random positive scores above random negative) | Average precision over recall levels |

> **Interview tip:** "For fraud with 0.2% positives I would report PR-AUC and precision/recall at the operating threshold, not ROC-AUC alone — ROC-AUC can be 0.98 while precision is only 10%." This sentence shows real-world experience.

## Probability quality: log loss, Brier score, calibration

Sometimes the probability itself matters (expected loss = P(default) × loan amount; ad bidding = P(click) × value).

- **Log loss**: −average of ln(probability given to the true class). Punishes confident mistakes hard. For the 8 cases above, log loss ≈ 0.529.
- **Brier score**: mean of (p − y)². For the 8 cases: (0.01 + 0.04 + 0.49 + 0.16 + 0.25 + 0.36 + 0.09 + 0.04) ÷ 8 = 1.44 ÷ 8 = **0.18**. Lower is better.
- **Calibration**: does "70% probability" really happen 70% of the time? Check with a **reliability diagram** (`CalibrationDisplay`). Fix with `CalibratedClassifierCV` (Platt/sigmoid or isotonic).

A model can have a high AUC (good ranking) but bad calibration (wrong probability values), and vice versa.

## Multiclass metrics

With K classes, the confusion matrix is K × K. Precision, recall and F1 are computed **per class** (that class vs the rest), then averaged:

| Average | How | Use when |
|---|---|---|
| Macro | Simple mean over classes | Every class matters equally, including rare ones |
| Weighted | Mean weighted by each class's support (count) | You want the average to reflect class sizes |
| Micro | Pool all TP, FP, FN, then compute | Overall performance; for single-label multiclass, micro-F1 = accuracy |

Example: three ticket classes with precision 0.9 (80 tickets), 0.5 (15 tickets), 0.2 (5 tickets).

- Macro precision = (0.9 + 0.5 + 0.2) ÷ 3 = **0.533**
- Weighted precision = (0.9 × 80 + 0.5 × 15 + 0.2 × 5) ÷ 100 = (72 + 7.5 + 1) ÷ 100 = **0.805**

Macro reveals that the small classes are poor; weighted hides it.

## Which metric when?

| Problem | Worse mistake | Main metric(s) | Typical choice |
|---|---|---|---|
| Cancer / disease screening | Missing a sick patient (FN) | Recall (sensitivity), F2 | Low threshold; follow-up tests remove false alarms |
| Fraud detection | Missed fraud (FN), but too many false alarms annoy users | PR-AUC, recall at a fixed precision, cost-based | Threshold from fraud cost vs review cost |
| Spam filter | Real email in spam (FP) | Precision, F0.5 | High threshold |
| Loan default | Both cost money | Expected cost, ROC-AUC, calibration | Probability × exposure |
| Ad click prediction | Wrong probability → wrong bid | Log loss, calibration, AUC | Calibrated probabilities |
| Search / recommendations | Bad items at the top | Precision@k, recall@k, NDCG, MRR | Ranking metrics |
| Balanced classes, equal costs | Neither | Accuracy, F1 | — |
| Content moderation | Depends: harmful content missed vs over-blocking | Recall on harmful classes + precision per class | Per-class thresholds |

The cleanest approach is a **cost matrix**: assign ₹ costs to FP and FN, and choose the model and threshold that minimise total cost. For a fraud team: cost(FN) = average fraud amount, cost(FP) = cost of a manual review plus customer annoyance.

For LLM applications, metrics are different again (faithfulness, answer relevance, LLM-as-judge); see [Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps).

## Regression metrics

For numeric predictions, the error is e = y − ŷ.

<div class="formula">

| Metric | Formula | Unit | Notes |
|---|---|---|---|
| MAE | mean of abs(e) | Same as y | Robust to outliers; "average miss" |
| MSE | mean of e² | y² | Punishes big errors; used for training |
| RMSE | √MSE | Same as y | Like MAE but punishes big errors; RMSE ≥ MAE always |
| R² | 1 − Σe² ÷ Σ(y − ȳ)² | None | Fraction of variance explained; 1 is perfect, 0 = predicting the mean |
| MAPE | mean of abs(e) ÷ abs(y) × 100% | % | Easy for business; breaks when y is near 0; penalises over-prediction more |

</div>

### Worked example

Four house prices (₹ lakh):

| True y | Predicted ŷ | Error e = y − ŷ | abs(e) | e² | abs(e) ÷ y |
|---|---|---|---|---|---|
| 100 | 110 | −10 | 10 | 100 | 0.100 |
| 200 | 190 | 10 | 10 | 100 | 0.050 |
| 300 | 330 | −30 | 30 | 900 | 0.100 |
| 400 | 370 | 30 | 30 | 900 | 0.075 |

- MAE = (10 + 10 + 30 + 30) ÷ 4 = **20** lakh
- MSE = (100 + 100 + 900 + 900) ÷ 4 = **500**
- RMSE = √500 ≈ **22.36** lakh
- R²: ȳ = 250; Σ(y − ȳ)² = 150² + 50² + 50² + 150² = 50,000; Σe² = 2,000 → R² = 1 − 2,000 ÷ 50,000 = **0.96**
- MAPE = (0.100 + 0.050 + 0.100 + 0.075) ÷ 4 = 0.08125 = **8.1%**

| Use | When |
|---|---|
| MAE | Business wants "average error in rupees"; outliers should not dominate |
| RMSE | Big errors are especially bad (inventory shortfall, energy demand) |
| R² | Comparing models on the same data; explaining to statisticians |
| MAPE | Business wants a percentage and y is never near zero (sales forecasting) |
| SMAPE / WAPE | Forecasting with some small values; more stable than MAPE |

> **Common mistake:** Using MAPE when some true values are 0 or near 0 (daily sales of a rare item). One true value of 1 with a prediction of 10 gives a 900% error and dominates everything.

## Metrics in scikit-learn

Reproduce the 100-patient example exactly:

```python
import numpy as np
from sklearn.metrics import (confusion_matrix, accuracy_score, precision_score, recall_score,
                             f1_score, fbeta_score, classification_report)

# 10 sick (8 caught, 2 missed) + 90 healthy (12 false alarms, 78 cleared)
y_true = np.array([1] * 10 + [0] * 90)
y_pred = np.array([1] * 8 + [0] * 2 + [1] * 12 + [0] * 78)

print(confusion_matrix(y_true, y_pred))         # rows = true [0, 1], columns = predicted [0, 1]
print(accuracy_score(y_true, y_pred), precision_score(y_true, y_pred),
      recall_score(y_true, y_pred), round(f1_score(y_true, y_pred), 3),
      round(fbeta_score(y_true, y_pred, beta=2), 3))
print(classification_report(y_true, y_pred, digits=3))
```

```text
[[78 12]
 [ 2  8]]
0.86 0.4 0.8 0.533 0.667
              precision    recall  f1-score   support

           0      0.975     0.867     0.918        90
           1      0.400     0.800     0.533        10

    accuracy                          0.860       100
   macro avg      0.688     0.833     0.725       100
weighted avg      0.917     0.860     0.879       100
```

Note scikit-learn's layout: **rows are the true class, columns the predicted class, ordered 0 then 1**. So the top-left is TN, not TP.

ROC-AUC and PR-AUC for the 8-case example:

```python
from sklearn.metrics import roc_auc_score, average_precision_score, roc_curve, brier_score_loss, log_loss

y = [1, 1, 0, 1, 0, 1, 0, 0]
s = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2]
print(roc_auc_score(y, s))                       # 0.8125
print(round(average_precision_score(y, s), 4))   # 0.8542
print(brier_score_loss(y, s), round(log_loss(y, s), 3))   # 0.18 0.529
fpr, tpr, thr = roc_curve(y, s)                  # points for plotting the ROC curve

# Plotting helpers (need a fitted model or predictions):
# from sklearn.metrics import RocCurveDisplay, PrecisionRecallDisplay, ConfusionMatrixDisplay
# RocCurveDisplay.from_predictions(y, s); PrecisionRecallDisplay.from_predictions(y, s)
```

Regression metrics:

```python
from sklearn.metrics import (mean_absolute_error, mean_squared_error, root_mean_squared_error,
                             r2_score, mean_absolute_percentage_error)
y_true = [100, 200, 300, 400]
y_pred = [110, 190, 330, 370]
print(mean_absolute_error(y_true, y_pred),          # 20.0
      mean_squared_error(y_true, y_pred),           # 500.0
      round(root_mean_squared_error(y_true, y_pred), 2),   # 22.36
      r2_score(y_true, y_pred),                     # 0.96
      mean_absolute_percentage_error(y_true, y_pred))      # 0.08125 (a fraction, not %)
```

In cross-validation and grid search, pass metric names as `scoring`: `"accuracy"`, `"f1"`, `"recall"`, `"precision"`, `"roc_auc"`, `"average_precision"`, `"neg_log_loss"`, `"neg_root_mean_squared_error"`, `"r2"`. Error metrics are negated so that "higher is better" always holds.

## Key terms

| Term | Simple meaning |
|---|---|
| Confusion matrix | Table of TP, FP, FN, TN counts |
| TP / FP / FN / TN | Correct alarm / false alarm / missed case / correct all-clear |
| Type I / Type II error | False positive / false negative |
| Accuracy | Fraction of all predictions that are correct |
| Precision | TP ÷ (TP + FP): purity of positive predictions |
| Recall / sensitivity / TPR | TP ÷ (TP + FN): fraction of real positives caught |
| Specificity / TNR | TN ÷ (TN + FP): fraction of real negatives cleared |
| FPR | FP ÷ (FP + TN) = 1 − specificity |
| F1 | Harmonic mean of precision and recall |
| F-beta | Weighted F score; β > 1 favours recall |
| Threshold | Score cut-off for predicting positive |
| ROC curve / ROC-AUC | TPR vs FPR over thresholds / area under it |
| PR curve / PR-AUC / average precision | Precision vs recall over thresholds / area under it |
| Log loss | Average −ln(probability of the true class) |
| Brier score | Mean squared error of probabilities |
| Calibration | Whether predicted probabilities match observed frequencies |
| Macro / weighted / micro average | Ways to combine per-class metrics |
| Cost matrix | Money (or harm) assigned to each type of error |
| MAE / MSE / RMSE | Mean absolute / mean squared / root mean squared error |
| R² | Fraction of variance explained |
| MAPE | Mean absolute percentage error |
| Precision@k / NDCG | Ranking metrics for search and recommendations |

## Interview questions

**Why is accuracy a bad metric for imbalanced data?**
Because a model that always predicts the majority class gets high accuracy while being useless. With 1% fraud, "never fraud" scores 99% accuracy and catches nothing. Use precision, recall, F1 or PR-AUC for the rare class, and compare against the majority baseline.

**Explain precision and recall with an example.**
In disease screening, recall is the share of sick patients we catch, and precision is the share of flagged patients who are actually sick. A model that flags everyone has perfect recall but terrible precision; one that flags only the single most obvious case may have perfect precision but terrible recall.

**When would you optimise for precision, and when for recall?**
Recall when missing a positive is very costly — cancer screening, safety defects, fraud alerts that a human will review. Precision when false alarms are costly — spam filtering (losing real email), recommending a risky medical procedure, auto-blocking a user's account.

**What is the F1 score and why use the harmonic mean?**
F1 = 2PR/(P + R). The harmonic mean is dominated by the smaller value, so F1 is high only when both precision and recall are high; an arithmetic mean would let a great precision hide a terrible recall.

**What does ROC-AUC mean intuitively?**
It is the probability that a randomly chosen positive example gets a higher score than a randomly chosen negative one. 0.5 is random ranking and 1.0 is perfect. It measures ranking quality across all thresholds, not performance at a specific threshold.

**ROC-AUC or PR-AUC for fraud detection?**
PR-AUC. With very few positives, the false positive rate stays tiny even with many false alarms, so ROC-AUC looks excellent. PR-AUC focuses on precision and recall of the rare class and its random baseline equals the positive rate, so it shows real difficulty.

**Your model has AUC 0.92 but poor F1. How is that possible?**
AUC measures ranking over all thresholds; F1 is computed at one threshold, probably the default 0.5. The model may rank well but use a bad threshold for this class balance. Tune the threshold on validation data, or the imbalance may make precision low at any threshold.

**What is the difference between macro and weighted averaging?**
Macro averages the per-class metric equally, so small classes count as much as large ones and poor minority performance shows up. Weighted averages by class frequency, so it is dominated by large classes. For imbalanced multiclass problems I report macro-F1.

**MAE vs RMSE — which would you report?**
MAE when every unit of error costs the same and outliers should not dominate; it is also easiest to explain. RMSE when large errors are disproportionately bad. RMSE is always at least MAE; a big gap between them indicates some large errors.

**What is the problem with MAPE?**
It explodes when true values are near zero, it is undefined at zero, and it penalises over-predictions more than under-predictions of the same size. For such data, use WAPE (sum of absolute errors divided by sum of actuals) or MAE.

**What is calibration and when does it matter?**
A model is calibrated if, among cases where it predicts 0.7, about 70% are positive. It matters when probabilities are used directly — expected-loss calculations, bidding, risk thresholds. Check with a reliability diagram and fix with Platt scaling or isotonic regression.

**How would you choose a threshold for a fraud model in production?**
Estimate the cost of a missed fraud and of a false alarm, compute expected cost on validation data for many thresholds, and pick the minimum — subject to constraints such as the review team's daily capacity. Then monitor precision and recall after launch because fraud patterns drift.

## Try it yourself

1. **Confusion matrix.** A spam filter sees 200 emails: 50 spam. It flags 45 emails, of which 40 are spam. Fill in TP, FP, FN, TN and compute accuracy, precision, recall and F1.
   *Hint: start from TP = 40.*
2. **AUC by counting.** Scores: positives 0.8, 0.6, 0.3; negatives 0.7, 0.4, 0.2, 0.1. Compute ROC-AUC.
   *Hint: 3 × 4 = 12 pairs.*
3. **Regression metrics.** True 10, 20, 30; predicted 12, 18, 36. Compute MAE, RMSE and MAPE.
   *Hint: errors are −2, 2, −6.*
4. **Code.** Train logistic regression on breast cancer (positive = malignant). Print the confusion matrix and classification report at thresholds 0.5 and 0.2.
   *Hint: `(model.predict_proba(X_test)[:, 1] >= 0.2).astype(int)`.*

### Answers

1. TP = 40, FP = 5, FN = 10, TN = 145. Accuracy = 185/200 = 0.925. Precision = 40/45 = 0.889. Recall = 40/50 = 0.80. F1 = 2 × 0.889 × 0.8 ÷ 1.689 ≈ 0.842.
2. 0.8 beats all 4 negatives (4); 0.6 beats 0.4, 0.2, 0.1 (3); 0.3 beats 0.2, 0.1 (2). Total 9/12 = **0.75**.
3. MAE = (2 + 2 + 6)/3 = 3.33. RMSE = √((4 + 4 + 36)/3) = √14.67 ≈ 3.83. MAPE = (0.2 + 0.1 + 0.2)/3 = 16.7%.
4. At 0.2, recall for malignant rises (fewer missed cancers) and precision drops slightly (a few more false alarms) — exactly the trade-off in this chapter.

**Next:** [Overfitting, Regularization and Cross-Validation](/interview/machine-learning/overfitting-regularization-and-cross-validation)
