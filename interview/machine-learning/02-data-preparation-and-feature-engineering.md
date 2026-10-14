---
title: Data Preparation and Feature Engineering
part: Foundations
summary: How to turn raw, messy tables into model-ready features — EDA, missing values, outliers, encoding, scaling, honest splits, data leakage, imbalanced classes and SMOTE, and feature ideas — with worked numbers and Pandas plus scikit-learn code.
---

Real data is messy. It has empty cells, typing errors, text categories, numbers on very different scales, and far more "normal" rows than "interesting" ones. Before any algorithm can learn, you must clean and reshape the data. In a real AI engineer job this is where most of the time goes, and in interviews "how would you handle missing values / leakage / imbalance?" are some of the most common questions.

> **In simple words:** Garbage in, garbage out. Data preparation turns raw columns into clean numbers the model can learn from, without accidentally showing the model the answer.

We use one running example: a churn dataset of app customers.

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "age":            [24, 41, 33, np.nan, 52, 29, 38, 45],
    "city":           ["Delhi", "Patna", "Pune", "Delhi", "Patna", "Pune", "Delhi", "Mumbai"],
    "plan":           ["basic", "premium", "basic", "standard", "premium", "basic", "standard", "basic"],
    "monthly_spend":  [450, 2300, 800, 600, np.nan, 300, 1500, 52000],
    "signup_date":    pd.to_datetime(["2024-01-10", "2023-06-05", "2024-03-15", "2022-11-20",
                                      "2023-02-01", "2024-05-30", "2023-09-12", "2022-12-25"]),
    "churned":        [0, 1, 0, 0, 1, 1, 0, 0],
})
```

## Exploratory data analysis (EDA)

**Exploratory data analysis (EDA)** means studying the data before modelling. You are looking for problems (missing values, wrong types, impossible values) and for signal (which features relate to the label).

```python
print(df.shape)                    # (8, 6) -> 8 rows, 6 columns
df.info()                          # column types and non-null counts
print(df.describe())               # count, mean, std, min, quartiles, max of numeric columns
print(df.isna().sum())             # missing values per column
print(df["city"].value_counts())   # how often each category appears
print(df["churned"].mean())        # class balance: 0.375 -> 37.5% churned
print(df.groupby("plan")["churned"].mean())   # churn rate per plan
print(df.select_dtypes("number").corr())      # correlation between numeric columns
```

What to check, in order:

1. **Shape and types.** Is a number stored as text ("1,200")? Is a date a string?
2. **Missing values** per column.
3. **Distributions.** Histograms of numeric columns. Look for skew (a long tail of large values) and impossible values (age 250, negative price).
4. **Outliers.** Values far from the rest (₹52,000 spend in our table).
5. **Class balance** of the label.
6. **Relationship with the label.** Churn rate per category, correlation with numeric features.
7. **Duplicates** (`df.duplicated().sum()`).

> **Interview tip:** If asked "you get a new dataset, what do you do first?", list EDA steps before any model: shape, types, missing values, distributions, outliers, class balance, leakage check. Do not jump straight to "I would train XGBoost".

## Missing values

Values can be missing for many reasons: the user skipped a field, a sensor failed, or the event never happened (a new customer has no "last order date"). Most scikit-learn models raise an error on `NaN`, so you must handle them.

### The options

| Method | How | When to use |
|---|---|---|
| Drop rows | `df.dropna()` | Very few rows missing, and missing at random |
| Drop column | `df.drop(columns=...)` | Column is mostly empty (for example 80%+) and not important |
| Mean imputation | Fill with column mean | Numeric, roughly symmetric, no big outliers |
| Median imputation | Fill with column median | Numeric with skew or outliers (income, spend) |
| Most frequent (mode) | Fill with the most common value | Categorical columns |
| Constant | Fill with "Unknown" or 0 | When "missing" has a meaning |
| Missing indicator | Add a 0/1 column "was missing" | When the fact of being missing is informative |
| Model-based | KNN imputer, iterative imputer | Columns strongly related to each other |
| Leave as NaN | Use a model that handles NaN | `HistGradientBoosting`, XGBoost, LightGBM |

**Imputation** means filling missing values with estimates.

### Worked example

`monthly_spend` = 450, 2300, 800, 600, NaN, 300, 1500, 52000.

- Known values sorted: 300, 450, 600, 800, 1500, 2300, 52000 (7 values).
- Mean = (300 + 450 + 600 + 800 + 1500 + 2300 + 52000) ÷ 7 = 57950 ÷ 7 ≈ **8278.6**.
- Median = the middle (4th) value = **800**.

The mean is pulled up by one huge value (52,000). Filling with 8,278 would invent a big spender. The median (800) is a much more typical value. This is why **median is the safe default for skewed money columns**.

```python
from sklearn.impute import SimpleImputer

num_imputer = SimpleImputer(strategy="median", add_indicator=True)   # also adds a 0/1 "was missing" column
cat_imputer = SimpleImputer(strategy="most_frequent")
print(num_imputer.fit_transform(df[["age", "monthly_spend"]]))
```

> **Common mistake:** Computing the mean or median on the **whole** dataset before splitting. The fill value then contains information from the test rows. Always `fit` the imputer on training data only, then `transform` the test data with the same fitted value. A scikit-learn `Pipeline` does this for you automatically (see [Pipelines and Hyperparameter Tuning](/interview/machine-learning/pipelines-and-hyperparameter-tuning)).

## Outliers

An **outlier** is a value far away from most other values. Some are errors (age = 999); some are real but rare (a customer who spends ₹52,000 a month). First decide which kind it is. Never delete real rare cases blindly — in fraud detection the outliers are exactly what you want to find.

### Finding outliers with the IQR rule

The **interquartile range (IQR)** is the spread of the middle 50% of the data: IQR = Q3 − Q1, where Q1 is the 25th percentile and Q3 is the 75th percentile. Values below Q1 − 1.5 × IQR or above Q3 + 1.5 × IQR are flagged as outliers.

Worked example: monthly incomes (₹ thousand) of 10 people: 12, 15, 18, 20, 22, 25, 28, 30, 35, 200.

1. Data is already sorted. n = 10.
2. Q1 position = (n − 1) × 0.25 = 2.25 → between the 3rd value (18) and 4th value (20), a quarter of the way: 18 + 0.25 × 2 = **18.5**.
3. Q3 position = (n − 1) × 0.75 = 6.75 → between the 7th (28) and 8th (30): 28 + 0.75 × 2 = **29.5**.
4. IQR = 29.5 − 18.5 = **11**.
5. Lower fence = 18.5 − 1.5 × 11 = 2. Upper fence = 29.5 + 16.5 = **46**.
6. 200 > 46, so **200 is an outlier**. Everything else is inside.

Notice also: the mean is 40.5 but the median is 23.5. One outlier moved the mean a lot. (Different tools use slightly different percentile formulas; this is the default in NumPy and Pandas.)

Another method is the **z-score**: z = (x − mean) ÷ std. Values with |z| > 3 are flagged. It assumes roughly bell-shaped data and is itself affected by the outliers, so IQR is more robust.

### What to do with outliers

| Action | How | Good for |
|---|---|---|
| Fix or remove | Correct typing errors, drop impossible values | Clear errors (age 999) |
| Cap / clip (winsorize) | Replace values above the 99th percentile with the 99th percentile | Real but extreme values |
| Log transform | Use log(1 + x) | Right-skewed money and count features |
| Robust scaling | `RobustScaler` (uses median and IQR) | Keep values but reduce influence |
| Robust model | Trees, Huber loss | Let the model handle it |

Tree models are barely affected by outliers in features, because they only care about the order of values. Linear regression and KNN are strongly affected.

## Encoding categorical features

Models do arithmetic, so the text "Patna" must become numbers. This is called **encoding**.

### One-hot encoding

Create one 0/1 column per category. "city = Pune" becomes `city_Delhi=0, city_Mumbai=0, city_Patna=0, city_Pune=1`.

| city | city_Delhi | city_Mumbai | city_Patna | city_Pune |
|---|---|---|---|---|
| Delhi | 1 | 0 | 0 | 0 |
| Patna | 0 | 0 | 1 | 0 |
| Pune | 0 | 0 | 0 | 1 |

It assumes no order between categories, which is correct for cities. The problem: a column with 10,000 categories (like PIN code) creates 10,000 columns. This is called **high cardinality**.

### Label and ordinal encoding

Replace each category with an integer. For categories with a natural order, this is called **ordinal encoding**: basic = 0, standard = 1, premium = 2. Good — premium really is "more" than basic.

For categories without order (Delhi = 0, Mumbai = 1, Patna = 2), an integer code tells a linear model that Patna is "twice" Mumbai, which is nonsense. Tree models can still work with such codes, because they only split on thresholds. (In scikit-learn, `LabelEncoder` is meant for the target y; for features use `OrdinalEncoder`.)

### Target encoding

Replace each category with the **average of the target** for that category. For churn, "Patna" becomes the churn rate of Patna customers. This gives one strong numeric column even for thousands of categories.

The danger: a rare category with 1 row gets a rate of exactly 0 or 1, which is noise. So we **smooth** it towards the global average:

<div class="formula">

| Formula | Meaning |
|---|---|
| encoded = (n × category_mean + m × global_mean) ÷ (n + m) | n = rows in the category, m = smoothing strength |

</div>

Worked example: Patna has n = 3 customers, 2 churned → category mean = 2/3 ≈ 0.667. Global churn rate = 0.2. Take m = 10.

- Numerator = 3 × 0.667 + 10 × 0.2 = 2 + 2 = 4
- Denominator = 3 + 10 = 13
- Encoded value = 4 ÷ 13 ≈ **0.308**

With only 3 rows, the value moves most of the way back to 0.2. With 3,000 rows it would stay near the true category rate.

Target encoding uses the label, so it can **leak** the answer if done carelessly. scikit-learn's `TargetEncoder` (version 1.3+) uses internal cross-fitting during `fit_transform` to prevent this.

| Encoding | Columns created | Order assumed? | Best for |
|---|---|---|---|
| One-hot | One per category | No | Low-cardinality nominal (city, colour), linear models |
| Ordinal | One | Yes | Ordered categories (size S/M/L, education level), trees |
| Target | One | No (uses label) | High-cardinality (PIN code, product ID) |
| Frequency | One | No | High-cardinality; count of each category |

```python
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, TargetEncoder

ohe = OneHotEncoder(handle_unknown="ignore", sparse_output=False)   # unseen city at test time -> all zeros
print(ohe.fit_transform(df[["city"]]))
print(ohe.get_feature_names_out())   # ['city_Delhi' 'city_Mumbai' 'city_Patna' 'city_Pune']

ord_enc = OrdinalEncoder(categories=[["basic", "standard", "premium"]])  # give the order explicitly
print(ord_enc.fit_transform(df[["plan"]]).ravel())   # [0. 2. 0. 1. 2. 0. 1. 0.]

te = TargetEncoder(smooth="auto", random_state=0)
city_te = te.fit_transform(df[["city"]], df["churned"])   # cross-fitted to avoid leakage
```

> **Common mistake:** Using `pd.get_dummies` separately on train and test. If the test set has a city that train does not, the columns will not match. Use `OneHotEncoder(handle_unknown="ignore")` fitted on train.

## Scaling numeric features

Features often live on very different scales: age 20–60, monthly spend 300–52,000. Some algorithms think big numbers are more important just because they are big. **Scaling** puts features on a similar range.

### Standardisation (z-score)

z = (x − mean) ÷ std. After this, each feature has mean 0 and standard deviation 1. In scikit-learn: `StandardScaler`.

Worked example: ages 20, 30, 40, 50, 60.

1. Mean = 200 ÷ 5 = 40.
2. Squared differences: 400, 100, 0, 100, 400 → sum 1000 → variance = 1000 ÷ 5 = 200.
3. Std = √200 ≈ 14.14. (`StandardScaler` divides by n, not n − 1.)
4. z for 20 = (20 − 40) ÷ 14.14 = **−1.414**; for 30: −0.707; 40: 0; 50: 0.707; 60: 1.414.

### Min-max scaling

x' = (x − min) ÷ (max − min). Values go to the range [0, 1]. In scikit-learn: `MinMaxScaler`.

Same ages: min 20, max 60, range 40 → 0, 0.25, 0.5, 0.75, 1.

| Scaler | Result | Sensitive to outliers? | Use when |
|---|---|---|---|
| StandardScaler | Mean 0, std 1 | Somewhat | Default for linear models, SVM, KNN, PCA, neural nets |
| MinMaxScaler | Range [0, 1] | Very (one outlier squeezes the rest) | Bounded features, images (pixels 0–255), neural nets |
| RobustScaler | Median 0, scaled by IQR | Little | Data with outliers |
| Log transform | log(1 + x) | Reduces skew | Right-skewed money and counts |

### Which models need scaling?

| Needs scaling | Does not need scaling |
|---|---|
| KNN, K-Means (distances) | Decision trees |
| SVM | Random forest |
| Linear / logistic regression with regularization | Gradient boosting (XGBoost, LightGBM) |
| PCA | Naive Bayes (mostly) |
| Neural networks, anything trained with gradient descent | |

> **Remember:** Distance-based and gradient-based models need scaling. Tree-based models do not, because a split "spend ≤ 800" works the same whether spend is in rupees or in lakhs.

## Splitting the data honestly

### Train, validation and test

- **Training set**: the model learns from it.
- **Validation set**: you compare models and tune hyperparameters on it.
- **Test set**: one final check, at the very end.

A common split is 60/20/20 or 70/15/15. With small data, use cross-validation instead of one fixed validation set (see [Overfitting, Regularization and Cross-Validation](/interview/machine-learning/overfitting-regularization-and-cross-validation)).

```python
from sklearn.model_selection import train_test_split

X = df.drop(columns=["churned"])
y = df["churned"]

# First cut off the test set, then split the rest into train and validation
X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.25, stratify=y_temp, random_state=42)
# 0.25 of the remaining 80% = 20% of the total -> 60/20/20
```

- `stratify=y` keeps the same class ratio in each part. Important for imbalanced labels.
- `random_state` makes the split repeatable.

### Time-based split

If the data has time order (sales, stock prices, fraud over months), a random split lets the model "see the future". Instead, train on older data and test on newer data: train on January–September, validate on October, test on November. This matches how the model is really used.

## Data leakage

**Data leakage** happens when information that will not be available at prediction time gets into training. The model looks brilliant in testing and fails in production. It is one of the most important topics in ML interviews.

### Type 1: target leakage

A feature is created **after** the label, or is a disguised copy of it.

- Predicting loan default with a feature "number of recovery calls made". Recovery calls only happen after a default.
- Predicting churn with "account_closed_date is not null".
- Predicting if a patient has pneumonia with "took antibiotics". Antibiotics are given after the diagnosis.

Test: for every feature, ask "at the moment I make the prediction, would I already know this value?"

### Type 2: train-test contamination

Information from the test set leaks into training through preprocessing.

- Scaling or imputing using statistics of the whole dataset before splitting.
- Choosing features by their correlation with the label on the whole dataset.
- Oversampling (SMOTE) before splitting: synthetic copies of test rows end up in training.
- Duplicate rows that land in both train and test.
- Random split on time-series data.
- Same customer in train and test when the task is "predict for new customers" (use `GroupKFold` / group splits).

> **Interview tip:** A classic question is "your model has 99% accuracy in testing but 60% in production — what happened?" Your first answer should be leakage (target leakage or contamination), then drift between training data and live data, then a train/serve mismatch in feature code.

> **Real-life example:** Leakage is like a student who scores 100% in a mock test because the answer key was printed on the back of the question paper. In the real exam there is no answer key.

## Imbalanced data

In fraud detection, maybe 1 payment in 1,000 is fraud. A model that always says "not fraud" is 99.9% accurate and completely useless. Data where one class is much rarer is called **imbalanced**. The rare class is the **minority class**; the common one is the **majority class**.

### The tools

| Technique | Idea | Notes |
|---|---|---|
| Right metric | Use recall, precision, F1, PR-AUC instead of accuracy | Always do this first |
| Class weights | Make mistakes on the minority class cost more | `class_weight="balanced"`; no new rows |
| Random undersampling | Throw away some majority rows | Fast, but loses data |
| Random oversampling | Duplicate minority rows | Can overfit to the copies |
| SMOTE | Create new synthetic minority rows between neighbours | Train data only |
| Threshold tuning | Predict "fraud" when probability > 0.2 instead of 0.5 | Cheap and very effective |
| Collect more minority data | Label more fraud cases | Best if possible |

### Class weights by hand

With `class_weight="balanced"`, scikit-learn uses weight = n_samples ÷ (n_classes × count_of_class).

Example: 1,000 rows, 950 normal and 50 fraud, 2 classes.

- Weight for normal = 1000 ÷ (2 × 950) ≈ **0.526**
- Weight for fraud = 1000 ÷ (2 × 50) = **10**

So one mistake on a fraud row costs as much as about 19 mistakes on normal rows (10 ÷ 0.526 ≈ 19). The two classes now contribute equally to the total loss.

### SMOTE by hand

**SMOTE (Synthetic Minority Over-sampling Technique)** creates new minority samples. For a minority point, it picks one of its k nearest minority neighbours, then creates a new point at a random position on the line between them:

new = x + r × (neighbour − x), where r is a random number between 0 and 1.

Example: a fraud point x = (2, 10) and a fraud neighbour (4, 14). With r = 0.4:

- Difference = (4 − 2, 14 − 10) = (2, 4)
- 0.4 × (2, 4) = (0.8, 1.6)
- New point = (2 + 0.8, 10 + 1.6) = **(2.8, 11.6)**

SMOTE lives in the separate `imbalanced-learn` library (`pip install imbalanced-learn`). Use its own `Pipeline` so SMOTE runs only on the training folds:

```python
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline            # NOT sklearn.pipeline: this one allows samplers
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

pipe = Pipeline([
    ("scale", StandardScaler()),
    ("smote", SMOTE(k_neighbors=5, random_state=42)),   # applied only when fitting, never to validation data
    ("model", LogisticRegression(max_iter=1000)),
])
# scores = cross_val_score(pipe, X_num, y, cv=5, scoring="average_precision")

# The simpler alternative, often just as good:
weighted = LogisticRegression(class_weight="balanced", max_iter=1000)
```

> **Common mistake:** Applying SMOTE to the whole dataset and then splitting. Synthetic points are built from test rows, so the test score becomes too optimistic. Resample only the training data.

> **Interview tip:** Say that in practice class weights plus threshold tuning plus PR-AUC are often enough, and that SMOTE is less useful for strong tree models like gradient boosting. Mentioning this trade-off sounds experienced.

## Feature engineering

**Feature engineering** means creating new input columns that make the pattern easier to learn. For tabular data, good features often matter more than the choice of algorithm.

| Idea | Example |
|---|---|
| Date parts | From `signup_date`: month, day of week, is_weekend, is_festival_season |
| Time since | days_since_signup, days_since_last_order |
| Ratios | spend_per_order = total_spend ÷ orders; debt_to_income |
| Aggregates per entity | Per customer: number of orders in last 30 days, average basket value |
| Counts and frequencies | How many times this device was used today (fraud) |
| Log transform | log(1 + income) for skewed money values |
| Binning | age → 18–25, 26–35, 36–50, 50+ |
| Interactions | price × quantity; city × plan |
| Text basics | Message length, number of digits, has_url (more in [Text as Data](/interview/nlp-transformers/text-as-data)) |
| Domain flags | is_new_device, amount > 3 × usual amount |
| Embeddings | Turn text or images into vectors with a pretrained model (see [Embeddings and Semantic Search](/interview/llms-genai/embeddings-and-semantic-search)) |

```python
ref_date = pd.Timestamp("2024-06-30")
df["tenure_days"]     = (ref_date - df["signup_date"]).dt.days
df["signup_month"]    = df["signup_date"].dt.month
df["signup_weekday"]  = df["signup_date"].dt.dayofweek      # 0 = Monday
df["log_spend"]       = np.log1p(df["monthly_spend"])       # log(1 + x) handles 0 safely
df["is_premium"]      = (df["plan"] == "premium").astype(int)
df["age_band"]        = pd.cut(df["age"], bins=[0, 25, 35, 50, 120], labels=["18-25", "26-35", "36-50", "50+"])
df = df.drop(columns=["signup_date"])                        # raw dates are not useful to most models
```

> **Remember:** Every feature must be computable at prediction time with the same code as in training. A mismatch between training feature code and serving feature code (called **training-serving skew**) is a top cause of production bugs.

## Putting it together with scikit-learn

The professional way is to put all preprocessing in a `ColumnTransformer` inside a `Pipeline`. Then every step is fitted on training data only, and the same steps run at prediction time. Chapter 13 explains this in full; here is the shape:

```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.linear_model import LogisticRegression

numeric = ["age", "monthly_spend", "tenure_days"]
nominal = ["city"]
ordinal = ["plan"]

preprocess = ColumnTransformer([
    ("num", Pipeline([("impute", SimpleImputer(strategy="median")),
                      ("scale", StandardScaler())]), numeric),
    ("nom", OneHotEncoder(handle_unknown="ignore"), nominal),
    ("ord", OrdinalEncoder(categories=[["basic", "standard", "premium"]]), ordinal),
])

model = Pipeline([
    ("prep", preprocess),
    ("clf", LogisticRegression(class_weight="balanced", max_iter=1000)),
])
# model.fit(X_train, y_train); model.predict(X_test)   # no leakage: stats come from X_train only
```

## Key terms

| Term | Simple meaning |
|---|---|
| EDA | Studying data (types, missing values, distributions) before modelling |
| Imputation | Filling missing values with an estimate (median, mode, model) |
| Missing indicator | Extra 0/1 column saying "this value was missing" |
| Outlier | A value far away from most others |
| IQR | Q3 − Q1, the spread of the middle 50% of data |
| Winsorize / clip | Cap extreme values at a percentile |
| Encoding | Turning categories into numbers |
| One-hot encoding | One 0/1 column per category |
| Ordinal encoding | Integers that follow a natural order |
| Target encoding | Replace a category with the average label for that category |
| High cardinality | A categorical column with very many distinct values |
| Standardisation | (x − mean) ÷ std → mean 0, std 1 |
| Min-max scaling | (x − min) ÷ (max − min) → range [0, 1] |
| Stratified split | Split that keeps the class ratio the same in every part |
| Data leakage | Information not available at prediction time getting into training |
| Target leakage | A feature that is created from, or after, the label |
| Train-test contamination | Test-set information leaking through preprocessing |
| Imbalanced data | One class much rarer than the other |
| Class weights | Make errors on rare classes cost more in the loss |
| SMOTE | Create synthetic minority samples between neighbours |
| Feature engineering | Creating new, more useful input columns |
| Training-serving skew | Features computed differently in training and in production |

## Interview questions

**How do you handle missing values?**
First find out why they are missing, because missingness can carry information. For few random gaps I drop rows; otherwise I impute — median for skewed numeric columns, most frequent or "Unknown" for categorical — and often add a missing-indicator column. I fit the imputer on the training set only, inside a pipeline. Some models, like LightGBM and HistGradientBoosting, handle NaN natively.

**Mean or median imputation — which and why?**
Median for skewed data or data with outliers, because one huge value pulls the mean far from typical values. Mean is fine for roughly symmetric data. For income-like columns, median is the safe default.

**One-hot versus label encoding?**
One-hot creates one 0/1 column per category and assumes no order, so it suits nominal categories in linear models. Label or ordinal encoding uses one integer column and implies an order, so it suits truly ordered categories, or tree models which can split on any threshold. For very many categories, one-hot explodes the column count, so target or frequency encoding is better.

**What is target encoding and what is its risk?**
It replaces each category with the mean of the target for that category. The risk is leakage and overfitting, especially for rare categories, because the encoding is computed from the labels. Fix it with smoothing towards the global mean and out-of-fold (cross-fitted) encoding.

**Which algorithms need feature scaling?**
Distance-based (KNN, K-Means, SVM), PCA, regularized linear models and anything trained with gradient descent, including neural networks. Tree-based models — decision trees, random forests, gradient boosting — do not need scaling because splits depend only on order.

**StandardScaler or MinMaxScaler?**
StandardScaler is the usual default; it centres at 0 with unit variance. MinMaxScaler maps to [0, 1], which is useful for bounded data like pixels, but a single outlier squeezes all other values together. With heavy outliers, RobustScaler is better.

**What is data leakage? Give two examples.**
Leakage is when information not available at prediction time is used in training, making offline scores too good. Target leakage example: using "number of collection calls" to predict loan default. Contamination example: fitting a scaler or SMOTE on the full dataset before splitting.

**Why must the scaler be fitted only on training data?**
Because the scaler's mean and std are learned parameters. If they are computed on all data, the test set influences training, which is a mild leakage and makes test scores slightly optimistic. Fit on train, transform both train and test.

**How do you handle an imbalanced dataset?**
Start with the right metric — recall, precision, F1 or PR-AUC, not accuracy — and a stratified split. Then use class weights, tune the decision threshold, and if needed resample the training data with undersampling or SMOTE. Collecting more minority examples is best when possible.

**When should you not use a random train/test split?**
With time-ordered data, where you must train on the past and test on the future, and with grouped data (several rows per customer or patient), where the same group must not appear in both train and test. Use a time-based split or a group split.

**Give some feature engineering ideas for a fraud model on UPI payments.**
Amount relative to the user's average, number of transactions in the last hour, is this a new device or new payee, time of day, distance from the usual location, the payee's fraud history via target encoding, and failed attempts before success. Each must be computable in real time at payment.

## Try it yourself

1. **Median vs mean.** Delivery times in minutes: 22, 25, 28, 30, 31, 35, 240. Compute the mean and median. Which would you use to fill a missing delivery time?
   *Hint: one order took 4 hours.*
2. **IQR fences.** For 4, 6, 7, 8, 9, 10, 11, 30, compute Q1, Q3, IQR and the fences using the (n − 1) × p position rule. Which values are outliers?
   *Hint: n = 8, so Q1 is at position 1.75 (0-based).*
3. **Spot the leakage.** You predict whether a hospital patient will be readmitted within 30 days. Features: age, diagnosis, length of stay, "number of follow-up visits in next 30 days", discharge day of week. Which feature leaks?
   *Hint: ask "would I know this at discharge?"*
4. **Code.** Using the `df` from this chapter, build a `ColumnTransformer` that median-imputes and standard-scales `age` and `monthly_spend`, and one-hot encodes `city`. Print the output shape.
   *Hint: `preprocess.fit_transform(df)`; then check `get_feature_names_out()`.*

### Answers

1. Sum = 22 + 25 + 28 + 30 + 31 + 35 + 240 = 411, mean = 411 ÷ 7 ≈ 58.7. Median = 30 (the 4th value). Use the median; the 240-minute order would distort the mean.
2. Sorted: 4, 6, 7, 8, 9, 10, 11, 30. Q1 at 1.75 → 6 + 0.75 × (7 − 6) = 6.75. Q3 at 5.25 → 10 + 0.25 × (11 − 10) = 10.25. IQR = 3.5. Fences: 6.75 − 5.25 = 1.5 and 10.25 + 5.25 = 15.5. Only **30** is an outlier.
3. "Number of follow-up visits in next 30 days" — it is only known after the prediction window, and readmitted patients obviously have more visits. Remove it.
4. Shape = (8, 6): 2 scaled numeric columns + 4 city columns (Delhi, Mumbai, Patna, Pune).

**Next:** [Linear Regression](/interview/machine-learning/linear-regression)
