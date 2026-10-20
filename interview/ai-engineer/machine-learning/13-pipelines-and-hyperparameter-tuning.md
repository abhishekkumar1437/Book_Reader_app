---
title: Pipelines and Hyperparameter Tuning
part: Making Models Good
summary: Building leak-free, deployable models with scikit-learn Pipeline and ColumnTransformer, custom transformers, tuning with GridSearchCV, RandomizedSearchCV, successive halving and Optuna, saving models with joblib, and a full end-to-end churn example from raw table to saved model.
---

Knowing algorithms is not enough; you have to put the pieces together correctly. A real model is a chain: fill missing values → encode categories → scale → train → choose a threshold. If these steps are done by hand in a notebook, they leak information, break at prediction time, and cannot be reproduced. A **pipeline** packages the whole chain into one object that you can cross-validate, tune, save and deploy. This is how production ML code looks, and interviewers often ask you to sketch it.

> **In simple words:** A Pipeline glues preprocessing and the model into one object with `fit` and `predict`. A ColumnTransformer applies different preprocessing to different columns. Hyperparameter search tries many settings with cross-validation and keeps the best. joblib saves the whole fitted pipeline to a file.

## Why pipelines?

Without a pipeline, a typical notebook looks like this:

```python
# DON'T DO THIS
scaler = StandardScaler().fit(X)                # fitted on ALL rows, including future test rows
X_scaled = scaler.transform(X)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y)
model.fit(X_train, y_train)
```

Problems:

1. **Leakage**: the scaler's mean and std include the test rows, so the test score is optimistic. In cross-validation it is worse — every fold's validation rows influenced preprocessing. (See [Data Preparation and Feature Engineering](/interview/ai-engineer/machine-learning/data-preparation-and-feature-engineering).)
2. **Train/serve mismatch**: at prediction time you must remember to apply exactly the same scaler, encoder and column order. Forgetting one step gives silent garbage predictions.
3. **Tuning is awkward**: you cannot easily tune a preprocessing choice (median vs mean imputation) together with model settings.
4. **Deployment**: you have to save and load five objects instead of one.

A pipeline fixes all four: when you call `pipe.fit(X_train, y_train)`, each step is fitted only on the data passed in. Inside `cross_val_score`, each step is re-fitted on each training fold.

## Pipeline basics

```python
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ("impute", SimpleImputer(strategy="median")),     # step name, transformer
    ("scale", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),        # the last step is the model
])

# Same thing with automatic names: "simpleimputer", "standardscaler", "logisticregression"
pipe2 = make_pipeline(SimpleImputer(strategy="median"), StandardScaler(), LogisticRegression(max_iter=1000))

# pipe.fit(X_train, y_train)   -> fit_transform on each transformer, then fit the model
# pipe.predict(X_test)         -> transform with the fitted transformers, then predict
# pipe.named_steps["clf"].coef_ or pipe[-1].coef_ -> reach inside
```

All steps except the last must be **transformers** (they have `fit` and `transform`). The last step can be a model or a transformer.

### Setting parameters of steps: the double underscore

Each parameter of a step is addressed as `<step name>__<parameter>`:

```python
pipe.set_params(clf__C=0.1, impute__strategy="mean")
print(pipe.get_params()["clf__C"])      # 0.1
```

This naming is how grid search reaches inside a pipeline. You can even swap whole steps: `pipe.set_params(scale="passthrough")` disables scaling.

## ColumnTransformer: different columns, different steps

Real tables have numeric and categorical columns that need different treatment. A **ColumnTransformer** applies a separate transformer (or sub-pipeline) to each group of columns and joins the results side by side.

```python
import pandas as pd
from sklearn.compose import ColumnTransformer, make_column_selector
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder

numeric = ["age", "tenure_months", "monthly_spend", "support_calls"]
nominal = ["city", "payment_method"]
ordinal = ["plan"]

numeric_pipe = Pipeline([("impute", SimpleImputer(strategy="median")), ("scale", StandardScaler())])
nominal_pipe = Pipeline([("impute", SimpleImputer(strategy="most_frequent")),
                         ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))])
ordinal_pipe = Pipeline([("impute", SimpleImputer(strategy="most_frequent")),
                         ("ord", OrdinalEncoder(categories=[["basic", "standard", "premium"]]))])

preprocess = ColumnTransformer(
    transformers=[
        ("num", numeric_pipe, numeric),
        ("nom", nominal_pipe, nominal),
        ("ord", ordinal_pipe, ordinal),
    ],
    remainder="drop",          # columns not listed (like customer_id) are dropped; "passthrough" keeps them
)

# Select columns by dtype instead of by name:
auto = ColumnTransformer([
    ("num", numeric_pipe, make_column_selector(dtype_include="number")),
    ("cat", nominal_pipe, make_column_selector(dtype_include=["object", "category"])),
])

model = Pipeline([("prep", preprocess), ("clf", LogisticRegression(max_iter=1000))])
# After fitting: model[:-1].get_feature_names_out() lists output columns like 'num__age', 'nom__city_Delhi'
# preprocess.set_output(transform="pandas") makes the transformers return DataFrames (easier debugging)
```

<figure>
<svg viewBox="0 0 440 200" width="440" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="5" y="70" width="70" height="60" rx="6" /><text x="40" y="96" text-anchor="middle" fill="currentColor" stroke="none">raw</text><text x="40" y="112" text-anchor="middle" fill="currentColor" stroke="none">table</text>
<line x1="75" y1="100" x2="100" y2="35" /><line x1="75" y1="100" x2="100" y2="100" /><line x1="75" y1="100" x2="100" y2="165" />
<rect x="100" y="15" width="150" height="40" rx="6" /><text x="175" y="32" text-anchor="middle" fill="currentColor" stroke="none">numeric: impute median</text><text x="175" y="47" text-anchor="middle" fill="currentColor" stroke="none">→ standard scale</text>
<rect x="100" y="80" width="150" height="40" rx="6" /><text x="175" y="97" text-anchor="middle" fill="currentColor" stroke="none">nominal: impute mode</text><text x="175" y="112" text-anchor="middle" fill="currentColor" stroke="none">→ one-hot</text>
<rect x="100" y="145" width="150" height="40" rx="6" /><text x="175" y="162" text-anchor="middle" fill="currentColor" stroke="none">ordinal: impute mode</text><text x="175" y="177" text-anchor="middle" fill="currentColor" stroke="none">→ ordinal codes</text>
<line x1="250" y1="35" x2="275" y2="100" /><line x1="250" y1="100" x2="275" y2="100" /><line x1="250" y1="165" x2="275" y2="100" />
<rect x="275" y="80" width="60" height="40" rx="6" /><text x="305" y="97" text-anchor="middle" fill="currentColor" stroke="none">join</text><text x="305" y="112" text-anchor="middle" fill="currentColor" stroke="none">columns</text>
<line x1="335" y1="100" x2="355" y2="100" /><polygon points="355,95 363,100 355,105" fill="currentColor" />
<rect x="363" y="80" width="72" height="40" rx="6" stroke="var(--accent)" /><text x="399" y="104" text-anchor="middle" fill="currentColor" stroke="none">model</text>
<text x="220" y="8" text-anchor="middle" fill="var(--accent)" stroke="none" font-size="11">one Pipeline object: fit, predict, tune, save</text>
</svg>
<figcaption>A ColumnTransformer sends each group of columns through its own preprocessing, joins the results, and feeds the model — all inside one Pipeline.</figcaption>
</figure>

### Custom transformers

For your own feature engineering, write a small class. Inheriting from `BaseEstimator` and `TransformerMixin` gives you `get_params`, `set_params` and `fit_transform` for free.

```python
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import FunctionTransformer
import numpy as np

class RatioFeatures(BaseEstimator, TransformerMixin):
    """Adds spend_per_month_of_tenure and calls_per_month. Learns nothing, so fit just returns self."""
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.copy()
        X["spend_per_tenure"] = X["monthly_spend"] / (X["tenure_months"] + 1)   # +1 avoids division by zero
        X["calls_per_month"] = X["support_calls"] / (X["tenure_months"] + 1)
        return X

# For a simple stateless function, FunctionTransformer is enough
log_tf = FunctionTransformer(np.log1p, feature_names_out="one-to-one")
```

If a transformer learns something (like a mean), compute it in `fit`, store it in an attribute ending with an underscore (`self.mean_`), and use it in `transform`. That way it is learned only from training data.

## Hyperparameter tuning

**Hyperparameters** are settings you choose before training: `C`, `max_depth`, `learning_rate`, `n_neighbors`. **Tuning** means searching for the values that give the best validation score. Every method below uses cross-validation inside the training set; the test set stays locked.

### Grid search

**Grid search** tries **every combination** of the values you list.

```python
from sklearn.model_selection import GridSearchCV, StratifiedKFold

param_grid = {
    "clf__C": [0.01, 0.1, 1, 10],                        # 4 values
    "prep__num__impute__strategy": ["mean", "median", "most_frequent"],   # 3 values
}
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
grid = GridSearchCV(model, param_grid, cv=cv, scoring="roc_auc", n_jobs=-1, refit=True)
# grid.fit(X_train, y_train)
# grid.best_params_, grid.best_score_, grid.best_estimator_ (refitted on all of X_train)
# pd.DataFrame(grid.cv_results_) shows every combination's mean and std score
```

Cost: 4 × 3 = **12 combinations** × 5 folds = **60 model fits**, plus 1 final refit on the full training set = 61. Add a third parameter with 5 values and it becomes 300 fits. Grid search grows **exponentially** with the number of parameters.

Note the nested name `prep__num__impute__strategy`: ColumnTransformer step `prep` → its transformer `num` → sub-pipeline step `impute` → parameter `strategy`.

### Random search

**Random search** samples a fixed number of combinations from ranges or distributions you give. For the same budget it usually finds better settings than grid search, because:

- Often only one or two hyperparameters really matter. A 5 × 5 grid tests only 5 distinct values of the important one; 25 random trials test 25 distinct values.
- You can sample continuous ranges, especially on a **log scale** (learning rate from 0.001 to 0.3).

A useful fact: if the best 5% of the search space counts as "good", then with 60 random trials the chance that at least one lands in it is 1 − 0.95⁶⁰ ≈ 1 − 0.046 = **95.4%**, no matter how many hyperparameters there are.

```python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import loguniform, randint, uniform

param_dist = {
    "clf__learning_rate": loguniform(0.01, 0.3),     # log scale: 0.01, 0.03, 0.1 equally likely regions
    "clf__max_leaf_nodes": randint(8, 64),           # integers 8..63
    "clf__min_samples_leaf": randint(5, 100),
    "clf__l2_regularization": uniform(0, 1.0),       # 0..1
}
# search = RandomizedSearchCV(hgb_pipe, param_dist, n_iter=40, cv=cv, scoring="average_precision",
#                             n_jobs=-1, random_state=42)
```

### Successive halving

**Successive halving** starts many candidates on a small budget (few rows or few trees), keeps the best fraction (for example the top third), gives them more budget, and repeats. Bad settings are thrown out early, so it is much faster on large data. In scikit-learn it is still marked experimental and needs a special import:

```python
from sklearn.experimental import enable_halving_search_cv  # noqa: F401  (enables the import below)
from sklearn.model_selection import HalvingRandomSearchCV
# HalvingRandomSearchCV(hgb_pipe, param_dist, factor=3, resource="n_samples", cv=cv, random_state=42)
```

### Bayesian optimisation with Optuna

**Bayesian optimisation** learns from earlier trials: it builds a model of "which settings gave good scores" and proposes the next trial where improvement is most likely. **Optuna** is the most popular library for this in Python (its default sampler is **TPE**, Tree-structured Parzen Estimator). It also supports **pruning**: stopping clearly bad trials early.

```python
import optuna
from sklearn.base import clone
from sklearn.model_selection import cross_val_score

def objective(trial):
    params = {
        "clf__learning_rate": trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
        "clf__max_leaf_nodes": trial.suggest_int("max_leaf_nodes", 8, 64),
        "clf__min_samples_leaf": trial.suggest_int("min_samples_leaf", 5, 100),
        "clf__l2_regularization": trial.suggest_float("l2_regularization", 1e-3, 10, log=True),
    }
    pipe = clone(hgb_pipe).set_params(**params)          # fresh copy for every trial
    return cross_val_score(pipe, X_train, y_train, cv=cv, scoring="average_precision").mean()

study = optuna.create_study(direction="maximize", sampler=optuna.samplers.TPESampler(seed=42))
study.optimize(objective, n_trials=50)
print(study.best_params, round(study.best_value, 4))
```

### Which tuning method when?

| Method | How it searches | Strengths | Weaknesses | Use when |
|---|---|---|---|---|
| Manual | You try values by hand | Builds intuition | Slow, biased | Early exploration |
| Grid search | Every combination | Simple, exhaustive, reproducible | Explodes with more parameters; wastes trials | 1–3 parameters with few values |
| Random search | Random samples from distributions | Same budget finds better values; handles continuous ranges | No learning between trials | The default for 3+ parameters |
| Successive halving | Many cheap trials, keep the best, increase budget | Very fast on big data | Early small-budget results can mislead | Large data, many candidates |
| Bayesian (Optuna, TPE) | Learns from past trials | Fewest trials for a good result; pruning | More setup; sequential by nature | Expensive models (boosting, neural nets) |

Tips that matter more than the method:

- Tune the **few hyperparameters that matter** (see the tables in each algorithm chapter): `C` for linear models; `learning_rate`, tree size and number of trees with early stopping for boosting; `max_features` and leaf size for forests.
- Use **log scales** for strengths and rates.
- Use the **metric you actually care about** as `scoring` (PR-AUC for imbalanced data, not accuracy).
- Look at `cv_results_`: if the best value is at the edge of your range, widen the range.
- Small differences (0.001) between top candidates are noise; prefer the simpler, faster model.

> **Common mistake:** Tuning on the test set, or reporting `grid.best_score_` as the final performance. The best CV score is slightly optimistic because it was selected from many tries. Report the score of `best_estimator_` on the untouched test set.

## Saving and loading models

A fitted pipeline is a Python object. Save it with **joblib** (efficient for objects holding large NumPy arrays):

```python
import joblib

joblib.dump(best_model, "churn_model_v1.joblib")       # saves preprocessing + model together
loaded = joblib.load("churn_model_v1.joblib")
loaded.predict_proba(new_customers_df)                 # same columns as training, raw (unprocessed) values
```

Rules for saved models:

1. **Save the whole pipeline**, not just the final estimator, so preprocessing travels with it.
2. **Pin library versions** (scikit-learn, numpy) in `requirements.txt`. A model saved with one scikit-learn version may fail or behave differently when loaded with another; scikit-learn warns about this.
3. **Never load a joblib/pickle file from an untrusted source.** Loading can execute arbitrary code. For safer sharing, look at the `skops` format, or export to **ONNX** for fast, language-independent serving.
4. Store metadata next to the file: training date, data version, feature list, metrics, threshold. Experiment trackers such as MLflow do this for you (see [Experiment Tracking and Model Registry](/interview/ai-engineer/mlops-deployment/experiment-tracking-and-model-registry)).

## End-to-end example: churn prediction

The full workflow from this book in one script. It generates a realistic synthetic dataset so you can run it anywhere; replace the generator with `pd.read_csv("churn.csv")` for real data. The mini project in [Mini Project: Churn Prediction](/interview/ai-engineer/ai-projects/mini-project-churn-prediction) builds on this.

```python
import numpy as np
import pandas as pd
import joblib
from scipy.stats import loguniform, randint
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score, RandomizedSearchCV
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.dummy import DummyClassifier
from sklearn.metrics import average_precision_score, roc_auc_score, classification_report, precision_recall_curve

# ---------- 1. Data (synthetic but realistic) ----------
rng = np.random.default_rng(42)
n = 5000
df = pd.DataFrame({
    "customer_id": np.arange(n),
    "age": rng.integers(18, 70, n).astype(float),
    "tenure_months": rng.integers(1, 72, n),
    "monthly_spend": rng.gamma(2.0, 400.0, n).round(0),
    "support_calls": rng.poisson(1.5, n),
    "city": rng.choice(["Delhi", "Mumbai", "Patna", "Pune", "Chennai"], n),
    "payment_method": rng.choice(["UPI", "card", "netbanking", "COD"], n, p=[0.5, 0.25, 0.1, 0.15]),
    "plan": rng.choice(["basic", "standard", "premium"], n, p=[0.5, 0.3, 0.2]),
})
# Churn is more likely with short tenure, many support calls, COD payments and the basic plan
logit = (-1.0 - 0.04 * df.tenure_months + 0.45 * df.support_calls
         + 0.8 * (df.payment_method == "COD") + 0.5 * (df.plan == "basic") - 0.0003 * df.monthly_spend)
df["churned"] = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)
df.loc[rng.random(n) < 0.05, "age"] = np.nan                 # 5% missing ages, like real data
print("churn rate:", round(df.churned.mean(), 3))

# ---------- 2. Split (test set locked away) ----------
X = df.drop(columns=["churned", "customer_id"])               # the ID is not a feature
y = df["churned"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# ---------- 3. Preprocessing ----------
numeric = ["age", "tenure_months", "monthly_spend", "support_calls"]
categorical = ["city", "payment_method", "plan"]
preprocess = ColumnTransformer([
    ("num", Pipeline([("impute", SimpleImputer(strategy="median")), ("scale", StandardScaler())]), numeric),
    ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical),
])

# ---------- 4. Compare models with cross-validation ----------
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
candidates = {
    "baseline": DummyClassifier(strategy="prior"),
    "logreg": LogisticRegression(max_iter=1000, class_weight="balanced"),
    "forest": RandomForestClassifier(n_estimators=300, min_samples_leaf=5, n_jobs=-1, random_state=42),
    "hgb": HistGradientBoostingClassifier(random_state=42),
}
for name, clf in candidates.items():
    pipe = Pipeline([("prep", preprocess), ("clf", clf)])
    s = cross_val_score(pipe, X_train, y_train, cv=cv, scoring="average_precision", n_jobs=-1)
    print(f"{name:8s} PR-AUC = {s.mean():.3f} ± {s.std():.3f}")

# ---------- 5. Tune the best family ----------
hgb_pipe = Pipeline([("prep", preprocess), ("clf", HistGradientBoostingClassifier(random_state=42))])
search = RandomizedSearchCV(
    hgb_pipe,
    {"clf__learning_rate": loguniform(0.01, 0.3),
     "clf__max_leaf_nodes": randint(8, 64),
     "clf__min_samples_leaf": randint(10, 200),
     "clf__l2_regularization": loguniform(1e-3, 10),
     "clf__max_iter": randint(100, 600)},
    n_iter=30, cv=cv, scoring="average_precision", n_jobs=-1, random_state=42,
)
search.fit(X_train, y_train)
print("best CV PR-AUC:", round(search.best_score_, 3))
print("best params:", search.best_params_)
best = search.best_estimator_

# ---------- 6. Choose a threshold on training-set CV predictions (not on the test set) ----------
from sklearn.model_selection import cross_val_predict
oof = cross_val_predict(best, X_train, y_train, cv=cv, method="predict_proba")[:, 1]
prec, rec, thr = precision_recall_curve(y_train, oof)
f1 = 2 * prec[:-1] * rec[:-1] / (prec[:-1] + rec[:-1] + 1e-12)
threshold = float(thr[np.argmax(f1)])
print("chosen threshold:", round(threshold, 3))

# ---------- 7. Final, one-time test evaluation ----------
proba = best.predict_proba(X_test)[:, 1]
pred = (proba >= threshold).astype(int)
print("test PR-AUC:", round(average_precision_score(y_test, proba), 3),
      " ROC-AUC:", round(roc_auc_score(y_test, proba), 3))
print(classification_report(y_test, pred, digits=3))

# ---------- 8. Save everything needed for serving ----------
joblib.dump({"model": best, "threshold": threshold, "features": list(X.columns)}, "churn_model_v1.joblib")

# ---------- 9. Load and predict for a new customer ----------
bundle = joblib.load("churn_model_v1.joblib")
new = pd.DataFrame([{"age": 29, "tenure_months": 3, "monthly_spend": 450, "support_calls": 4,
                     "city": "Patna", "payment_method": "COD", "plan": "basic"}])
p = bundle["model"].predict_proba(new[bundle["features"]])[:, 1][0]
print(f"churn probability {p:.2f} -> {'at risk' if p >= bundle['threshold'] else 'ok'}")
```

```text
churn rate: 0.2...          (about 20-25% with this generator)
baseline PR-AUC = 0.2... ± 0.00...   (equals the churn rate: the random baseline)
logreg   PR-AUC = 0.4... ± 0.0...
forest   PR-AUC = 0.4... ± 0.0...
hgb      PR-AUC = 0.4... ± 0.0...
best CV PR-AUC: 0.4...
best params: {...}
chosen threshold: 0.2... to 0.3...
test PR-AUC: 0.4...  ROC-AUC: 0.7...
...classification report...
churn probability 0.8... -> at risk   (about 0.75-0.87)
(exact numbers depend on library versions; the data is noisy by design, so no model gets near 1.0)
```

What to notice:

- Logistic regression does about as well as the tree models here, because the synthetic churn rule is itself linear in the log-odds. On real data with interactions and thresholds, gradient boosting usually wins. **Always compare against a simple model.**
- Every preprocessing step is inside the pipeline, so cross-validation, tuning and the saved file are all leak-free and consistent.
- The threshold was chosen from **out-of-fold** predictions on the training set, then applied to the test set once.
- The saved bundle contains the model, the threshold and the expected feature list — everything a serving API needs. Wrapping it in a FastAPI endpoint is covered in [FastAPI for AI Apps](/interview/ai-engineer/mlops-deployment/fastapi-for-ai-apps).

> **Interview tip:** When asked "how would you put this model into production?", describe exactly this: one fitted pipeline saved with pinned versions and metadata, loaded once at API start-up, input validated against the training schema, the chosen threshold applied, and predictions plus inputs logged for monitoring drift.

## Key terms

| Term | Simple meaning |
|---|---|
| Pipeline | A chain of preprocessing steps plus a model, used as one estimator |
| Transformer | A step with fit and transform (scaler, encoder, imputer) |
| Estimator | Any scikit-learn object with fit; models also have predict |
| make_pipeline | Builds a Pipeline with automatic step names |
| step__param | Syntax to set a parameter of a step inside a pipeline |
| ColumnTransformer | Applies different transformers to different column groups |
| remainder | What happens to columns not listed (drop or passthrough) |
| make_column_selector | Picks columns by dtype or name pattern |
| Custom transformer | Your own class with fit/transform, usually from BaseEstimator + TransformerMixin |
| FunctionTransformer | Wraps a plain function as a transformer |
| Hyperparameter tuning | Searching for the best settings using validation scores |
| Grid search | Try every combination of listed values |
| Random search | Try random samples from given distributions |
| Log-uniform distribution | Samples evenly across orders of magnitude (0.001–0.1) |
| Successive halving | Start many cheap trials, keep the best, give them more budget |
| Bayesian optimisation | Choose the next trial using a model of past results |
| Optuna / TPE | Popular tuning library / its default Bayesian sampler |
| Pruning (in tuning) | Stopping unpromising trials early |
| refit / best_estimator_ | Retraining the best settings on all training data |
| cv_results_ | Table of scores for every tried combination |
| Out-of-fold predictions | Predictions for each row from a model that did not train on it |
| joblib | Library to save and load fitted Python objects |
| ONNX / skops | Portable / safer formats for saved models |

## Interview questions

**Why should preprocessing be inside a Pipeline?**
So that every learned preprocessing step — imputation values, scaling statistics, encoder categories — is fitted only on the training data or training folds, preventing leakage. It also guarantees the exact same transformations at prediction time and lets you tune and save preprocessing and model together as one object.

**What does a ColumnTransformer do?**
It applies different transformers to different subsets of columns — for example median imputation and scaling for numeric columns, and one-hot encoding for categorical columns — and concatenates the outputs into one feature matrix. Columns not listed are dropped or passed through according to `remainder`.

**How do you set the hyperparameters of a step inside a pipeline during grid search?**
Use the step name, two underscores and the parameter name, such as `clf__C` or, for nested objects, `prep__num__impute__strategy`. The same syntax works with `set_params`.

**Grid search vs random search — which would you use and why?**
For more than two or three hyperparameters I use random search. With the same number of trials, it tests many more distinct values of each important parameter and can sample continuous ranges on a log scale, so it usually finds equal or better settings faster. Grid search is fine for one or two parameters with a few values.

**How many model fits does a grid search run?**
The number of combinations times the number of CV folds, plus one refit. For example 4 values of C × 3 imputation strategies × 5 folds = 60 fits, plus 1 refit on the whole training set.

**What is Bayesian optimisation and when is it worth it?**
It builds a probabilistic model of how hyperparameters relate to the score and chooses the next trial where improvement is most likely, learning from all previous trials. It is worth it when each trial is expensive, like gradient boosting on large data or neural networks; Optuna with TPE and pruning is the common tool.

**Is `best_score_` from GridSearchCV a fair estimate of performance?**
Not fully. It is the best of many cross-validated scores on the same folds, so it is optimistically biased. The fair estimate is the score of the refitted best model on a held-out test set, or nested cross-validation.

**How do you save a scikit-learn model for production, and what are the risks?**
Save the entire fitted pipeline with joblib, along with metadata like the feature list, threshold, data version and metrics. Pin the scikit-learn and numpy versions, because loading with a different version can fail or change behaviour, and never load pickle or joblib files from untrusted sources since loading can execute code. ONNX or skops are alternatives.

**How would you write a custom transformer?**
Create a class that inherits from BaseEstimator and TransformerMixin, learn any statistics in `fit` and store them in attributes ending with an underscore, return self from `fit`, and apply the transformation in `transform`. Then it works inside pipelines, cross-validation and grid search like any built-in step.

**How do you choose the classification threshold without leaking test data?**
Generate out-of-fold predicted probabilities on the training set with cross_val_predict, or use a separate validation set, pick the threshold that optimises the business metric there, and only then apply it to the test set once. scikit-learn 1.5+ also offers TunedThresholdClassifierCV to do this automatically.

**What would you log when serving a model?**
The input features, the predicted probability, the threshold-based decision, the model version and a timestamp — and later the true outcome when it arrives. This allows monitoring of data drift, prediction drift and real-world precision and recall.

## Try it yourself

1. **Count the fits.** A grid has `max_depth` [3, 5, 7, None], `min_samples_leaf` [1, 5, 20] and `max_features` ["sqrt", 0.5]. With 5-fold CV, how many fits does GridSearchCV run including the refit?
   *Hint: multiply the list sizes.*
2. **Random search odds.** If the top 2% of settings count as good, how many random trials do you need for a 90% chance of hitting at least one?
   *Hint: solve 1 − 0.98ⁿ ≥ 0.9.*
3. **Find the bug.** A colleague runs `X = SimpleImputer().fit_transform(X)` and `X = StandardScaler().fit_transform(X)`, then `cross_val_score(LogisticRegression(), X, y, cv=5)`. What is wrong and how do you fix it?
   *Hint: think about which rows the imputer and scaler saw.*
4. **Code.** Run the end-to-end example. Then change the churn rule to include an interaction (for example, extra churn only when `support_calls > 3` **and** `tenure_months < 6`) and see whether the tree models now beat logistic regression.
   *Hint: add `+ 1.5 * ((df.support_calls > 3) & (df.tenure_months < 6))` to `logit`.*

### Answers

1. 4 × 3 × 2 = 24 combinations × 5 folds = 120 fits, + 1 refit = **121**.
2. 0.98ⁿ ≤ 0.1 → n ≥ ln(0.1)/ln(0.98) = −2.303/−0.0202 ≈ 114. About **114 trials**.
3. The imputer and scaler were fitted on all rows, so every validation fold influenced the preprocessing — leakage. Fix: `cross_val_score(make_pipeline(SimpleImputer(), StandardScaler(), LogisticRegression()), X_raw, y, cv=5)`.
4. With a sharp interaction, gradient boosting and the random forest typically move ahead of logistic regression, because trees model "both conditions true" directly while a linear model needs a hand-made interaction feature.

**Next:** [ML Interview Question Bank](/interview/ai-engineer/machine-learning/ml-interview-question-bank)
