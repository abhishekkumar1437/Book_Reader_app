---
title: Mini Project · Customer Churn Prediction
part: Mini Projects
summary: Days 49–50. Predict which telecom customers will leave using Pandas and a scikit-learn pipeline, compare models with cross-validation, pick a business threshold, and save the model for reuse.
---

**Churn** means a customer stops using a service: they cancel a Jio plan, close a bank account, or stop ordering on Swiggy. Companies spend a lot to get new customers, so keeping existing ones is cheaper. In this project you build a model that predicts which customers are likely to churn, so a retention team can call them or offer a discount first. It is the classic "first real ML project" because it uses every core skill from the [Machine Learning](/interview/ai-engineer/machine-learning) book on messy tabular data.

> **In simple words:** You take a table of customers (plan, monthly bill, contract type, how long they stayed), train a model that outputs a churn probability for each one, choose a cut-off that suits the business, and save the whole thing as one file you can load later.

## Goal and what you will learn

**Goal:** Given a customer's details, output the probability they will leave, plus a yes/no decision using a threshold that the business chooses.

**What you will learn:**

- Loading and cleaning a real CSV with Pandas, including a hidden data-type bug.
- Building a scikit-learn **Pipeline** so that cleaning, encoding and the model live in one object.
- Comparing a baseline, logistic regression, random forest and gradient boosting with **cross-validation**.
- Why accuracy is misleading on **imbalanced data**, and which metrics to use instead.
- Choosing a **decision threshold** from business costs, not the default 0.5.
- Saving the model with `joblib` and loading it in a separate prediction script.

### Prerequisites

| You need | Where it is taught |
|---|---|
| Pandas basics | Phase 1 (Days 13–17); [Files and I/O](/interview/python/files-and-io) |
| Encoding, scaling, train/test split, leakage | [Data Preparation and Feature Engineering](/interview/ai-engineer/machine-learning/data-preparation-and-feature-engineering) |
| Logistic regression and probabilities | [Logistic Regression](/interview/ai-engineer/machine-learning/logistic-regression) |
| Random forest and boosting | [Ensembles: Random Forest and Boosting](/interview/ai-engineer/machine-learning/ensembles-random-forest-and-boosting) |
| Precision, recall, ROC-AUC, PR-AUC | [Evaluation Metrics](/interview/ai-engineer/machine-learning/evaluation-metrics) |
| Cross-validation | [Overfitting, Regularization and Cross-Validation](/interview/ai-engineer/machine-learning/overfitting-regularization-and-cross-validation) |
| Pipeline, ColumnTransformer, joblib | [Pipelines and Hyperparameter Tuning](/interview/ai-engineer/machine-learning/pipelines-and-hyperparameter-tuning) |

### Day split (Days 49–50)

Day 49 is a revision day in the 150-day plan (every 7th day is lighter), so it holds only the light setup work.

| Day | Time | Work |
|---|---|---|
| 49 (light) | about 1.5 h after revision | Steps 1–3: set up the project, download data, explore and clean it |
| 50 | 3.5 h | Steps 4–9: pipeline, model comparison, threshold, final test, save, predict script, README |

If you have extra time later, do the stretch goals (a FastAPI endpoint, SHAP explanations).

## Architecture

<figure>
<svg viewBox="0 0 440 210" width="440" height="210" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="5" y="20" width="80" height="40" rx="6" />
<text x="45" y="44" text-anchor="middle" fill="currentColor" stroke="none">CSV file</text>
<line x1="85" y1="40" x2="103" y2="40" />
<polygon points="103,36 111,40 103,44" fill="currentColor" />
<rect x="111" y="20" width="90" height="40" rx="6" />
<text x="156" y="38" text-anchor="middle" fill="currentColor" stroke="none">load + clean</text>
<text x="156" y="53" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">(Pandas)</text>
<line x1="201" y1="40" x2="219" y2="40" />
<polygon points="219,36 227,40 219,44" fill="currentColor" />
<rect x="227" y="10" width="208" height="110" rx="8" stroke-dasharray="4 3" />
<text x="331" y="26" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Pipeline (one saved file)</text>
<rect x="237" y="36" width="58" height="34" rx="5" />
<text x="266" y="57" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">features</text>
<rect x="302" y="36" width="64" height="34" rx="5" />
<text x="334" y="51" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">impute,</text>
<text x="334" y="63" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">scale, one-hot</text>
<rect x="373" y="36" width="54" height="34" rx="5" />
<text x="400" y="57" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">model</text>
<line x1="295" y1="53" x2="302" y2="53" />
<line x1="366" y1="53" x2="373" y2="53" />
<text x="331" y="100" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">outputs churn probability</text>
<line x1="331" y1="120" x2="331" y2="140" />
<polygon points="327,140 331,148 335,140" fill="currentColor" />
<rect x="227" y="148" width="208" height="40" rx="6" />
<text x="331" y="166" text-anchor="middle" fill="currentColor" stroke="none">threshold (from business cost)</text>
<text x="331" y="181" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">→ "call this customer" yes / no</text>
<rect x="5" y="110" width="196" height="78" rx="6" />
<text x="103" y="130" text-anchor="middle" fill="currentColor" stroke="none">train.py</text>
<text x="103" y="148" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">5-fold CV to compare models</text>
<text x="103" y="163" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">pick threshold on CV predictions</text>
<text x="103" y="178" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">test once → save .joblib</text>
</svg>
<figcaption>Every transformation lives inside the pipeline, so training and prediction always process data the same way.</figcaption>
</figure>

## Folder structure

```text
churn-prediction/
├── README.md
├── requirements.txt
├── .gitignore
├── data/
│   └── telco_churn.csv          # downloaded, not committed
├── notebooks/
│   └── 01_eda.ipynb             # exploration only
├── src/
│   ├── __init__.py
│   ├── data.py                  # load + clean + column lists
│   ├── features.py              # feature engineering function
│   ├── train.py                 # compare models, pick threshold, save
│   └── predict.py               # load model, predict for new customers
├── models/                      # created by train.py, not committed
│   ├── churn_model.joblib
│   └── metadata.json
└── tests/
    └── test_features.py
```

## requirements.txt

```text
pandas>=2.2
numpy>=1.26
scikit-learn>=1.5
joblib>=1.4
matplotlib>=3.8
jupyter>=1.0
pytest>=8.0
```

## Step 1: Set up the project

Create the folders and a **virtual environment** (an isolated set of Python packages just for this project, so versions do not clash with other projects).

```bash
mkdir churn-prediction && cd churn-prediction
mkdir -p data notebooks src models tests
touch src/__init__.py
python -m venv .venv
source .venv/bin/activate          # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
git init
```

**What you should see:** `pip` ends with "Successfully installed ...", and `python -c "import sklearn; print(sklearn.__version__)"` prints 1.5 or higher.

## Step 2: Get the data

You will use the **Telco Customer Churn** dataset, a public dataset originally published by IBM. Search Kaggle for "Telco Customer Churn" (file name `WA_Fn-UseC_-Telco-Customer-Churn.csv`), download it, and save it as `data/telco_churn.csv`.

It has 7,043 customers and 21 columns: an ID, 19 customer details, and the label `Churn` (Yes/No).

```python
import pandas as pd

df = pd.read_csv("data/telco_churn.csv")
print(df.shape)
print(df["Churn"].value_counts())
print(df.dtypes.head(21))
```

**What you should see:**

```text
(7043, 21)
Churn
No     5174
Yes    1869
Name: count, dtype: int64
...
TotalCharges        object
...
```

Two things to notice right away:

1. **The data is imbalanced.** Only 1869 of 7043 customers churned. 1869 ÷ 7043 ≈ 0.265, so 26.5% churn and 73.5% stay. A model that always says "No" gets 73.5% accuracy while being useless.
2. **`TotalCharges` is `object` (text), not a number.** Something in that column is not numeric. This is the hidden bug.

## Step 3: Explore and clean

Do this part in `notebooks/01_eda.ipynb`. **EDA** (exploratory data analysis) means looking at the data before modelling, to find bugs and ideas.

```python
# Find the rows that broke TotalCharges
bad = pd.to_numeric(df["TotalCharges"], errors="coerce").isna()
print(bad.sum())
print(df.loc[bad, ["tenure", "MonthlyCharges", "TotalCharges"]].head())
```

**What you should see:** 11 rows, all with `tenure` equal to 0 and `TotalCharges` equal to a blank space `" "`. These are new customers who have not been billed yet. That makes sense: no months, no total.

Decision: convert `TotalCharges` to numbers, turning the blanks into `NaN` (missing), and let the pipeline fill them with the median. (Filling with 0 would also be reasonable here, since they have paid nothing. Either way, write the decision in your README.)

Now look at churn rate by a few columns:

```python
df["churned"] = (df["Churn"] == "Yes").astype(int)
for col in ["Contract", "InternetService", "PaymentMethod"]:
    print(df.groupby(col)["churned"].mean().sort_values(ascending=False).round(3), "\n")
print(df.groupby(pd.cut(df["tenure"], [0, 6, 12, 24, 48, 72], include_lowest=True), observed=True)["churned"].mean().round(3))
```

**What you should see:** month-to-month contracts churn far more than one- or two-year contracts, fibre-optic internet users churn more than DSL users, electronic-check payers churn more than auto-pay users, and churn falls steadily as tenure grows. These patterns give you confidence the data is sensible, and they are great sentences for your README.

> **Common mistake:** Doing EDA on the whole dataset and then making decisions that use the test set's information (for example, choosing which rows to drop by looking at their labels). Explore freely, but fit every learned step (imputer, scaler, model) on training data only. The pipeline below does this for you.

Now write the clean loading code as a module.

```python
# src/data.py
from pathlib import Path

import pandas as pd

DATA_PATH = Path("data/telco_churn.csv")

# Raw input columns the model expects (customerID and Churn are excluded)
NUMERIC = ["tenure", "MonthlyCharges", "TotalCharges", "SeniorCitizen"]
CATEGORICAL = [
    "gender", "Partner", "Dependents", "PhoneService", "MultipleLines",
    "InternetService", "OnlineSecurity", "OnlineBackup", "DeviceProtection",
    "TechSupport", "StreamingTV", "StreamingMovies", "Contract",
    "PaperlessBilling", "PaymentMethod",
]


def load_data(path: Path = DATA_PATH) -> tuple[pd.DataFrame, pd.Series]:
    df = pd.read_csv(path)
    # " " (blank) for new customers -> NaN; the pipeline imputes it later
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")
    X = df[NUMERIC + CATEGORICAL]
    y = (df["Churn"] == "Yes").astype(int)   # 1 = churned
    return X, y
```

`SeniorCitizen` is already 0/1 in this dataset, so it can go with the numeric columns.

## Step 4: Feature engineering inside the pipeline

**Feature engineering** means creating new input columns that make patterns easier for the model to learn. One useful idea: customers who use more services are more "locked in". Count how many add-on services each customer has.

```python
# src/features.py
import pandas as pd

SERVICE_COLS = [
    "PhoneService", "MultipleLines", "OnlineSecurity", "OnlineBackup",
    "DeviceProtection", "TechSupport", "StreamingTV", "StreamingMovies",
]


def add_features(X: pd.DataFrame) -> pd.DataFrame:
    X = X.copy()                                  # never modify the caller's data
    X["NumServices"] = (X[SERVICE_COLS] == "Yes").sum(axis=1)
    # average monthly spend so far; tenure 0 would divide by zero, so use 1
    X["AvgCharge"] = X["TotalCharges"] / X["tenure"].clip(lower=1)
    return X
```

This function goes **inside** the pipeline as the first step, using `FunctionTransformer`. That way the saved model file adds these features automatically at prediction time. If you added them only in the training script, you would have to remember to add them in every place you predict. Forgetting is a very common production bug called **training-serving skew**: the model sees different data in production than in training.

A quick test:

```python
# tests/test_features.py
import pandas as pd

from src.features import add_features


def test_add_features_counts_services_and_avoids_divide_by_zero():
    row = {c: "No" for c in ["PhoneService", "MultipleLines", "OnlineSecurity",
                             "OnlineBackup", "DeviceProtection", "TechSupport",
                             "StreamingTV", "StreamingMovies"]}
    row.update({"PhoneService": "Yes", "StreamingTV": "Yes",
                "tenure": 0, "TotalCharges": 0.0})
    out = add_features(pd.DataFrame([row]))
    assert out.loc[0, "NumServices"] == 2
    assert out.loc[0, "AvgCharge"] == 0.0     # 0 / max(0, 1) = 0, no crash
```

**What you should see:** `pytest -q` prints `1 passed`.

## Step 5: Build the pipeline and compare models

A **pipeline** chains steps so that `fit` runs them in order on training data and `predict` runs the same steps on new data. A **ColumnTransformer** applies different steps to different columns: numbers get imputed and scaled, text categories get one-hot encoded. **One-hot encoding** turns a category like `Contract = "Two year"` into separate 0/1 columns, one per category.

**Cross-validation** (CV) splits the training data into 5 parts, trains on 4 and scores on the 5th, five times. It gives a more reliable score than a single split. **Stratified** means each part keeps the same 26.5% churn rate.

```python
# src/train.py  (part 1)
import json
from pathlib import Path

import joblib
import numpy as np
import sklearn
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.inspection import permutation_importance
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (average_precision_score, classification_report,
                             confusion_matrix, precision_recall_curve, roc_auc_score)
from sklearn.model_selection import (StratifiedKFold, cross_val_predict,
                                     cross_validate, train_test_split)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer, OneHotEncoder, StandardScaler

from src.data import CATEGORICAL, NUMERIC, load_data
from src.features import add_features

SEED = 42
MODEL_DIR = Path("models")
NUMERIC_MODEL = NUMERIC + ["NumServices", "AvgCharge"]   # after add_features


def make_pipeline(model) -> Pipeline:
    numeric_steps = Pipeline([
        ("impute", SimpleImputer(strategy="median")),   # fills the 11 blanks
        ("scale", StandardScaler()),                    # mean 0, std 1
    ])
    preprocess = ColumnTransformer([
        ("num", numeric_steps, NUMERIC_MODEL),
        # dense output so every model type (including HistGradientBoosting) accepts it
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL),
    ])
    return Pipeline([
        ("features", FunctionTransformer(add_features)),
        ("preprocess", preprocess),
        ("model", model),
    ])


CANDIDATES = {
    "baseline_majority": DummyClassifier(strategy="most_frequent"),
    "logistic_regression": LogisticRegression(max_iter=1000, class_weight="balanced"),
    "random_forest": RandomForestClassifier(
        n_estimators=300, min_samples_leaf=5, class_weight="balanced",
        n_jobs=-1, random_state=SEED),
    "hist_gradient_boosting": HistGradientBoostingClassifier(
        learning_rate=0.05, max_iter=300, class_weight="balanced", random_state=SEED),
}
```

Notes on the choices:

- `class_weight="balanced"` makes mistakes on the rare class (churners) count more during training. It is a simple fix for imbalance. The alternative, **SMOTE** (creating synthetic minority rows), is explained in the data preparation chapter; class weights are simpler and usually enough.
- `handle_unknown="ignore"` means a category never seen in training (say, a new payment method) becomes all zeros instead of crashing.
- The **baseline** (`DummyClassifier`) always predicts the majority class. Every real model must beat it, or something is wrong.

```python
# src/train.py  (part 2)
def compare_models(X_train, y_train) -> dict:
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
    results = {}
    for name, model in CANDIDATES.items():
        scores = cross_validate(
            make_pipeline(model), X_train, y_train, cv=cv,
            scoring=["roc_auc", "average_precision", "recall", "accuracy"],
        )
        results[name] = {k.replace("test_", ""): round(float(v.mean()), 3)
                         for k, v in scores.items() if k.startswith("test_")}
        print(f"{name:24s} {results[name]}")
    return results
```

**ROC-AUC** measures how well the model ranks churners above non-churners (0.5 = random, 1.0 = perfect). **Average precision** (PR-AUC) is similar but focuses on the rare class, so it is more honest on imbalanced data.

## Step 6: Choose a threshold using business cost

A model outputs probabilities. To act, you need a **threshold**: call the customer if probability ≥ threshold. The default 0.5 is arbitrary. The right threshold depends on what mistakes cost.

### Worked example: 10 customers

Suppose your model gives these probabilities. "Churned" is the true answer.

| Customer | A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|---|
| Probability | 0.92 | 0.81 | 0.66 | 0.55 | 0.48 | 0.37 | 0.31 | 0.22 | 0.15 | 0.05 |
| Churned? | 1 | 1 | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 0 |

There are 5 real churners: A, B, D, E, G.

**Threshold 0.5:** we call A, B, C, D (4 customers).
- True positives (called and really churning): A, B, D = 3. False positives (called but staying): C = 1. Missed churners: E, G = 2.
- Precision = 3 ÷ 4 = 0.75. Recall = 3 ÷ 5 = 0.60.

**Threshold 0.3:** we call A to G (7 customers).
- True positives: A, B, D, E, G = 5. False positives: C, F = 2. Missed: 0.
- Precision = 5 ÷ 7 ≈ 0.714. Recall = 5 ÷ 5 = 1.00.

Now add money. Say each call with a discount offer costs ₹200, and each churner you reach and keep is worth ₹2,000 of future revenue (assume the offer works on everyone it reaches, to keep the example simple).

- Threshold 0.5: cost = 4 × ₹200 = ₹800. Value = 3 × ₹2,000 = ₹6,000. Net = ₹6,000 − ₹800 = **₹5,200**.
- Threshold 0.3: cost = 7 × ₹200 = ₹1,400. Value = 5 × ₹2,000 = ₹10,000. Net = ₹10,000 − ₹1,400 = **₹8,600**.

Because a missed churner (₹2,000 lost) costs ten times more than a wasted call (₹200), a lower threshold earns more. This is why you should ask "what does each mistake cost?" before choosing a threshold.

> **Interview tip:** When asked "how did you choose the threshold?", never say "0.5 is the default". Say: "Missing a churner costs more than an extra call, so I set a recall target of 80% and picked the threshold with the best precision at that recall, using cross-validated predictions on the training set, not the test set."

### Threshold code

You must not tune the threshold on the test set; that would make your test score look better than reality. Instead, use **out-of-fold predictions**: `cross_val_predict` gives each training row a probability from a model that did not see that row.

```python
# src/train.py  (part 3)
def pick_threshold(y_true, proba, min_recall: float = 0.80) -> float:
    precision, recall, thresholds = precision_recall_curve(y_true, proba)
    # precision/recall have one more element than thresholds; drop the last
    precision, recall = precision[:-1], recall[:-1]
    ok = recall >= min_recall
    # among thresholds that keep recall >= target, take the best precision
    best = int(np.argmax(np.where(ok, precision, -1.0)))
    return float(thresholds[best])
```

## Step 7: Train the final model and test it once

```python
# src/train.py  (part 4)
def main():
    X, y = load_data()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=SEED)
    print(f"train={len(X_train)} test={len(X_test)} churn rate={y.mean():.3f}\n")

    results = compare_models(X_train, y_train)
    real = {k: v for k, v in results.items() if k != "baseline_majority"}
    best_name = max(real, key=lambda k: real[k]["average_precision"])
    print(f"\nBest by average precision: {best_name}")

    pipe = make_pipeline(CANDIDATES[best_name])
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
    oof = cross_val_predict(pipe, X_train, y_train, cv=cv, method="predict_proba")[:, 1]
    threshold = pick_threshold(y_train, oof, min_recall=0.80)
    print(f"Chosen threshold: {threshold:.3f}")

    pipe.fit(X_train, y_train)                      # final fit on all training data
    proba = pipe.predict_proba(X_test)[:, 1]
    pred = (proba >= threshold).astype(int)

    test_metrics = {
        "roc_auc": round(float(roc_auc_score(y_test, proba)), 3),
        "average_precision": round(float(average_precision_score(y_test, proba)), 3),
    }
    print("\nTEST:", test_metrics)
    print(confusion_matrix(y_test, pred))
    print(classification_report(y_test, pred, digits=3))

    imp = permutation_importance(pipe, X_test, y_test, scoring="roc_auc",
                                 n_repeats=5, random_state=SEED)
    top = sorted(zip(X_test.columns, imp.importances_mean), key=lambda t: -t[1])[:8]
    print("Top features:", [(n, round(float(s), 3)) for n, s in top])

    MODEL_DIR.mkdir(exist_ok=True)
    joblib.dump(pipe, MODEL_DIR / "churn_model.joblib")
    meta = {"model": best_name, "threshold": threshold, "test": test_metrics,
            "cv": results, "sklearn_version": sklearn.__version__,
            "features": list(X.columns)}
    (MODEL_DIR / "metadata.json").write_text(json.dumps(meta, indent=2))
    print("Saved models/churn_model.joblib")


if __name__ == "__main__":
    main()
```

Run it from the project root:

```bash
python -m src.train
```

**What you should see** (your exact numbers will differ a little; the pattern matters):

```text
train=5634 test=1409 churn rate=0.265

baseline_majority        {'roc_auc': 0.5, 'average_precision': 0.265, 'recall': 0.0, 'accuracy': 0.735}
logistic_regression      {'roc_auc': 0.84..., 'average_precision': 0.6..., 'recall': 0.7..., 'accuracy': 0.7...}
random_forest            {...similar ROC-AUC...}
hist_gradient_boosting   {...similar ROC-AUC...}

Best by average precision: ...
Chosen threshold: 0.4...
TEST: {'roc_auc': 0.8..., 'average_precision': 0.6...}
[[... ...]
 [ ...  ...]]
Top features: [('Contract', ...), ('tenure', ...), ...]
Saved models/churn_model.joblib
```

How to read this:

- The baseline has 73.5% accuracy but 0 recall. It never finds a churner. This proves accuracy alone is misleading.
- The three real models usually land close together, with ROC-AUC in the low-to-mid 0.80s on this dataset. On small tabular data, a well-regularized logistic regression is often as good as tree ensembles. That is a valuable finding to report, and a reason to prefer the simpler model if scores are tied (easier to explain, faster).
- Contract type and tenure normally top the feature list, matching what you saw in EDA.

> **Common mistake:** Running the test set many times while you tweak things. Each look leaks a little information and your final number becomes optimistic. Use cross-validation for all choices and look at the test set once at the end.

## Step 8: Predict for new customers

A separate script shows the model works outside training. This is how an app or an API would use it.

```python
# src/predict.py
import json
from pathlib import Path

import joblib
import pandas as pd

MODEL_DIR = Path("models")
model = joblib.load(MODEL_DIR / "churn_model.joblib")
meta = json.loads((MODEL_DIR / "metadata.json").read_text())


def predict(customers: list[dict]) -> list[dict]:
    df = pd.DataFrame(customers)[meta["features"]]   # same columns, same order
    proba = model.predict_proba(df)[:, 1]
    return [{"churn_probability": round(float(p), 3),
             "call_customer": bool(p >= meta["threshold"])} for p in proba]


if __name__ == "__main__":
    new_customer = {
        "tenure": 2, "MonthlyCharges": 95.5, "TotalCharges": 190.0, "SeniorCitizen": 0,
        "gender": "Female", "Partner": "No", "Dependents": "No", "PhoneService": "Yes",
        "MultipleLines": "No", "InternetService": "Fiber optic", "OnlineSecurity": "No",
        "OnlineBackup": "No", "DeviceProtection": "No", "TechSupport": "No",
        "StreamingTV": "Yes", "StreamingMovies": "Yes", "Contract": "Month-to-month",
        "PaperlessBilling": "Yes", "PaymentMethod": "Electronic check",
    }
    print(predict([new_customer]))
```

```bash
python -m src.predict
```

**What you should see:** something like `[{'churn_probability': 0.8..., 'call_customer': True}]`. This customer has every high-risk sign: 2 months tenure, month-to-month, fibre, electronic check, no support add-ons. Try changing `Contract` to `"Two year"` and `tenure` to 60; the probability should drop sharply.

> **Remember:** A `joblib` file stores Python objects using pickle. Load it with the **same scikit-learn version** you trained with (that is why `metadata.json` records it), and never load a `.joblib` file from someone you do not trust, because unpickling can run code.

## Step 9: Write the README and push

Use the template from [How to Build a Portfolio](/interview/ai-engineer/ai-projects/how-to-build-a-portfolio). Fill these sections with your real numbers:

- **Problem:** telecom companies lose about a quarter of customers in this dataset; retention calls are cheaper than new customers.
- **Results table:** CV scores for all four models, test ROC-AUC and PR-AUC, the chosen threshold and the resulting recall and precision.
- **Design decisions:** class weights instead of SMOTE; threshold from a recall target; feature engineering inside the pipeline; why you kept the model you kept.
- **Findings:** the top features and what they mean for the business ("month-to-month contracts churn most, so offer contract upgrades").
- **How to run:** `pip install -r requirements.txt`, download the CSV, `python -m src.train`, `python -m src.predict`.

```bash
git add .
git commit -m "Churn prediction: pipeline, model comparison, threshold, saved model"
```

### README checklist

- [ ] One-line description and the problem in plain words
- [ ] Data source and how to download it (not the file itself)
- [ ] Results table with CV and test metrics, and the baseline
- [ ] Threshold and the reasoning behind it
- [ ] Top features with a business interpretation
- [ ] How to run in 4 commands
- [ ] Limitations (one dataset, no time dimension, offer effect assumed)

## Resume bullets

Pick one and fill in your measured numbers:

```text
Built a customer-churn model on 7,043 telecom customers (Pandas, scikit-learn Pipeline),
comparing 4 models with stratified 5-fold CV; reached test ROC-AUC <0.8x> and recall <0.80>
using a cost-based decision threshold instead of the default 0.5.
```

```text
Designed a leakage-safe scikit-learn pipeline (imputation, scaling, one-hot encoding, engineered
features) saved as a single artifact, and identified contract type and tenure as the top churn
drivers with permutation importance.
```

## Interview questions about this project

**Why not just use accuracy?**
Only 26.5% of customers churn, so a model that always predicts "stays" gets 73.5% accuracy and catches zero churners. I used ROC-AUC to compare ranking quality and average precision because it focuses on the rare churn class. For the final decision I reported precision and recall at the chosen threshold, because those map directly to wasted calls and missed churners.

**How did you handle class imbalance?**
I used `class_weight="balanced"`, which makes errors on churners count more in the loss. I also chose the threshold to hit a recall target instead of using 0.5. I considered SMOTE, but class weights are simpler, add no synthetic rows, and worked well. With SMOTE you must apply it only inside training folds, otherwise you leak information.

**How did you choose the threshold?**
I asked what each mistake costs. Missing a churner loses future revenue; a wasted call only costs the offer. So I set a minimum recall of 80% and, among thresholds that meet it, chose the one with the best precision. I computed this on out-of-fold cross-validated predictions from the training set, so the test set stayed untouched for the final score.

**What is data leakage, and how did you avoid it?**
Leakage is when information that would not be available at prediction time, or information from the test set, sneaks into training. I split train and test first, and put imputation, scaling and encoding inside a pipeline so they are fitted only on training folds. I also checked there are no columns created after the churn event.

**Why put feature engineering inside the pipeline?**
So the saved model file does exactly the same transformations at prediction time. If feature code lived only in the training script, the prediction service could compute features differently or forget them. That mismatch is called training-serving skew and is a common production bug.

**Logistic regression and gradient boosting scored about the same. Which would you deploy?**
If scores are within noise, I would deploy logistic regression. It is faster, smaller, easier to explain to the business (each coefficient has a direction), and less likely to overfit. I would pick boosting only if it gave a clear gain that matters in money.

**How would you explain a single prediction to the retention team?**
For logistic regression I can show the features that pushed the score up the most for that customer. For tree models I would use SHAP values, which split a prediction into contributions from each feature. The message would be simple: "high risk because month-to-month contract, 2 months tenure, electronic check".

**How would this model fail in production?**
Customer behaviour changes: new plans, price changes or a competitor's offer can shift the data, called drift. I would monitor the input distributions and the churn rate of called versus not-called customers, and retrain on a schedule. There is also a feedback problem: once we call high-risk customers, their outcomes change, so future labels are affected by the model itself.

**What does ROC-AUC 0.84 mean in plain words?**
If you pick one random churner and one random non-churner, the model gives the churner a higher probability about 84% of the time. It measures ranking, not calibrated probabilities and not the result at any one threshold.

**What would you do with more time?**
Tune hyperparameters with randomized search or Optuna inside cross-validation, check probability calibration, add SHAP explanations, and serve the model with a FastAPI endpoint. If I had time-stamped data, I would use a time-based split, because in reality you train on the past and predict the future.

## Stretch goals

1. **Serve it with FastAPI.** Wrap `predict()` in a `POST /predict` endpoint with a Pydantic model for the 19 fields. See [FastAPI for AI Apps](/interview/ai-engineer/mlops-deployment/fastapi-for-ai-apps).
2. **Hyperparameter tuning.** Use `RandomizedSearchCV` over the pipeline (for example `model__learning_rate`, `model__max_leaf_nodes`) with average precision as the score.
3. **Calibration check.** Plot a calibration curve with `sklearn.calibration.CalibrationDisplay`. If 0.7 does not mean "70% of these churn", try `CalibratedClassifierCV`.
4. **SHAP explanations.** Install `shap` and plot the reasons for the five highest-risk customers.
5. **Profit curve.** Using the ₹200 call cost and ₹2,000 customer value, plot net profit for every threshold from 0.05 to 0.95 and mark the best one.
6. **Track experiments.** Log every model's CV scores with MLflow. See [Experiment Tracking and Model Registry](/interview/ai-engineer/mlops-deployment/experiment-tracking-and-model-registry).

**Next:** [Mini Project: Image Classifier with Transfer Learning](/interview/ai-engineer/ai-projects/mini-project-image-classifier)
