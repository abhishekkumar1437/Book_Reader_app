---
title: Linear Regression
part: Core Algorithms
summary: Fitting the best straight line through data — residuals, mean squared error, the closed-form solution worked by hand, multiple and polynomial regression, the assumptions, R² and adjusted R², with scikit-learn code.
---

Linear regression is the first algorithm everyone learns and the one interviewers use to test whether you really understand ML. It predicts a number — price, demand, delivery time — as a weighted sum of features. In real jobs it is the baseline for every regression problem, and its ideas (weights, loss, gradient, regularization) carry straight into neural networks.

> **In simple words:** Draw the straight line that passes as close as possible to all the points. "As close as possible" means the sum of squared vertical gaps between points and line is as small as it can be.

## The idea: a line through the points

You have data on 5 students: hours studied for a test and marks out of 10.

| Student | Hours (x) | Marks (y) |
|---|---|---|
| A | 1 | 2 |
| B | 2 | 4 |
| C | 3 | 5 |
| D | 4 | 4 |
| E | 5 | 5 |

More hours roughly means more marks, but not perfectly. We want a rule `ŷ = b₀ + b₁ · x` that predicts marks from hours. Here:

- `ŷ` (read "y-hat") is the **predicted** value. `y` is the true value.
- `b₁` is the **slope**: how much ŷ changes when x goes up by 1.
- `b₀` is the **intercept**: the prediction when x = 0.

The vertical gap between a true point and the line is called the **residual** (or error): `residual = y − ŷ`.

<figure>
<svg viewBox="0 0 400 230" width="400" height="230" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="40" y1="200" x2="390" y2="200" />
<line x1="40" y1="200" x2="40" y2="20" />
<text x="380" y="218" fill="currentColor" stroke="none">hours</text>
<text x="45" y="20" fill="currentColor" stroke="none">marks</text>
<text x="100" y="215" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<text x="160" y="215" text-anchor="middle" fill="currentColor" stroke="none">2</text>
<text x="220" y="215" text-anchor="middle" fill="currentColor" stroke="none">3</text>
<text x="280" y="215" text-anchor="middle" fill="currentColor" stroke="none">4</text>
<text x="340" y="215" text-anchor="middle" fill="currentColor" stroke="none">5</text>
<text x="32" y="148" text-anchor="end" fill="currentColor" stroke="none">2</text>
<text x="32" y="92" text-anchor="end" fill="currentColor" stroke="none">4</text>
<text x="32" y="64" text-anchor="end" fill="currentColor" stroke="none">5</text>
<line x1="70" y1="130" x2="370" y2="46" stroke="var(--accent)" stroke-width="2" />
<line x1="100" y1="144" x2="100" y2="121.6" stroke-dasharray="3 3" />
<line x1="160" y1="88" x2="160" y2="104.8" stroke-dasharray="3 3" />
<line x1="220" y1="60" x2="220" y2="88" stroke-dasharray="3 3" />
<line x1="280" y1="88" x2="280" y2="71.2" stroke-dasharray="3 3" />
<line x1="340" y1="60" x2="340" y2="54.4" stroke-dasharray="3 3" />
<circle cx="100" cy="144" r="4" fill="currentColor" />
<circle cx="160" cy="88" r="4" fill="currentColor" />
<circle cx="220" cy="60" r="4" fill="currentColor" />
<circle cx="280" cy="88" r="4" fill="currentColor" />
<circle cx="340" cy="60" r="4" fill="currentColor" />
<text x="228" y="78" fill="currentColor" stroke="none" font-size="11">residual +1.0</text>
<text x="250" y="40" fill="var(--accent)" stroke="none">ŷ = 2.2 + 0.6x</text>
</svg>
<figcaption>The fitted line and its residuals (dashed): least squares chooses the line that makes the sum of the squared dashed lengths as small as possible.</figcaption>
</figure>

## Measuring how good a line is: MSE

Many lines are possible. To choose the best, we need a single number that says how wrong a line is. This number is called the **loss** or **cost**.

We cannot just add the residuals, because positive and negative errors cancel out. So we square them first. The average of the squared residuals is the **mean squared error (MSE)**:

<div class="formula">

| Formula | Meaning |
|---|---|
| ŷᵢ = b₀ + b₁·xᵢ | prediction for row i |
| eᵢ = yᵢ − ŷᵢ | residual for row i |
| SSE = Σ eᵢ² | sum of squared errors |
| MSE = (1/n) · Σ eᵢ² | mean squared error |
| RMSE = √MSE | error in the same unit as y |

</div>

Squaring has two effects: all errors become positive, and big errors are punished much more than small ones (an error of 4 costs 16, an error of 1 costs 1). Fitting by minimising squared error is called **ordinary least squares (OLS)**.

> **Real-life example:** Think of each point pulling on the line with a spring. Points far away pull harder. The line settles where all the pulls balance. That resting place is the least squares line.

## Finding the best line by hand

For one feature there is a direct formula. Let x̄ and ȳ be the means of x and y.

<div class="formula">

| Formula | Meaning |
|---|---|
| b₁ = Σ(xᵢ − x̄)(yᵢ − ȳ) ÷ Σ(xᵢ − x̄)² | slope = covariance of x, y ÷ variance of x |
| b₀ = ȳ − b₁ · x̄ | the line always passes through the point (x̄, ȳ) |

</div>

### Worked example (the 5 students)

**Step 1: means.** x̄ = (1 + 2 + 3 + 4 + 5) ÷ 5 = 3. ȳ = (2 + 4 + 5 + 4 + 5) ÷ 5 = 20 ÷ 5 = 4.

**Step 2: deviations and products.**

| x | y | x − x̄ | y − ȳ | (x − x̄)(y − ȳ) | (x − x̄)² |
|---|---|---|---|---|---|
| 1 | 2 | −2 | −2 | 4 | 4 |
| 2 | 4 | −1 | 0 | 0 | 1 |
| 3 | 5 | 0 | 1 | 0 | 0 |
| 4 | 4 | 1 | 0 | 0 | 1 |
| 5 | 5 | 2 | 1 | 2 | 4 |
| | | | **Sum** | **6** | **10** |

**Step 3: slope.** b₁ = 6 ÷ 10 = **0.6**. Each extra hour adds 0.6 marks.

**Step 4: intercept.** b₀ = 4 − 0.6 × 3 = 4 − 1.8 = **2.2**.

So the best line is **ŷ = 2.2 + 0.6x**.

**Step 5: predictions, residuals and MSE.**

| x | y | ŷ = 2.2 + 0.6x | e = y − ŷ | e² |
|---|---|---|---|---|
| 1 | 2 | 2.8 | −0.8 | 0.64 |
| 2 | 4 | 3.4 | 0.6 | 0.36 |
| 3 | 5 | 4.0 | 1.0 | 1.00 |
| 4 | 4 | 4.6 | −0.6 | 0.36 |
| 5 | 5 | 5.2 | −0.2 | 0.04 |
| | | | **SSE** | **2.40** |

MSE = 2.40 ÷ 5 = **0.48**. RMSE = √0.48 ≈ **0.69** marks. Notice the residuals add to 0 (−0.8 + 0.6 + 1.0 − 0.6 − 0.2 = 0). This is always true for least squares with an intercept.

A student who studies 6 hours is predicted to get 2.2 + 0.6 × 6 = **5.8** marks.

### The matrix form: the normal equation

With many features we write the data as a matrix **X** (one row per sample, plus a column of 1s for the intercept) and the weights as a vector **θ**. The prediction is ŷ = **X**θ. The least squares solution is:

<div class="formula">

| Formula | Meaning |
|---|---|
| θ = (XᵀX)⁻¹ Xᵀy | the **normal equation**: exact best weights in one step |

</div>

Check it on our data. **X** has rows [1, xᵢ].

- XᵀX = [[n, Σx], [Σx, Σx²]] = [[5, 15], [15, 55]] (because Σx² = 1 + 4 + 9 + 16 + 25 = 55).
- Xᵀy = [Σy, Σxy] = [20, 66] (Σxy = 2 + 8 + 15 + 16 + 25 = 66).
- Determinant = 5 × 55 − 15 × 15 = 275 − 225 = 50.
- (XᵀX)⁻¹ = (1/50) × [[55, −15], [−15, 5]].
- θ = (1/50) × [55 × 20 − 15 × 66, −15 × 20 + 5 × 66] = (1/50) × [1100 − 990, −300 + 330] = (1/50) × [110, 30] = **[2.2, 0.6]**. Same answer.

Matrix basics (transpose, inverse) are in [Matrix Operations and NumPy](/interview/ai-engineer/math-for-ml/matrix-operations-and-numpy).

### Closed form versus gradient descent

| | Normal equation | Gradient descent |
|---|---|---|
| How | One formula, exact answer | Many small steps downhill |
| Cost | Inverting a d × d matrix: about d³ operations | About n × d per step |
| Good when | Few features (up to a few thousand) | Many features or huge n, streaming data |
| Hyperparameters | None | Learning rate, number of steps |
| Problem cases | XᵀX not invertible (duplicate features) | Needs scaled features to converge quickly |

scikit-learn's `LinearRegression` uses a stable least squares solver (based on SVD, not a literal inverse). Gradient descent is the next chapter: [Gradient Descent and Loss Functions](/interview/ai-engineer/machine-learning/gradient-descent-and-loss-functions).

> **Interview tip:** If asked "why not always use the normal equation?", say: it costs roughly O(d³) to solve with d features, it needs all data in memory, and it fails when features are perfectly correlated. Gradient descent scales to huge data and is how neural networks are trained.

## Multiple linear regression

Real problems have many features. **Multiple linear regression** uses all of them:

ŷ = b₀ + b₁·x₁ + b₂·x₂ + … + b_d·x_d

Example: flat prices in ₹ lakh. Suppose the fitted model is:

price = 10 + 0.04 × area_sqft + 5 × bedrooms

For a 1,200 sq ft, 2-bedroom flat: 10 + 0.04 × 1200 + 5 × 2 = 10 + 48 + 10 = **₹68 lakh**.

How to read the weights: "**holding the number of bedrooms fixed**, each extra square foot adds 0.04 lakh = ₹4,000". Each coefficient is the effect of its feature when all other features stay the same.

> **Common mistake:** Comparing raw coefficient sizes to decide which feature is "most important". The area weight (0.04) is small only because area is measured in thousands of square feet. Standardise features first if you want to compare coefficients.

### Multicollinearity

If two features are strongly correlated (area in sq ft and area in sq m, or "rooms" and "bedrooms"), the model cannot tell which one deserves the credit. Coefficients become unstable: they can be huge, flip sign, and change a lot when data changes slightly. Predictions may still be fine, but interpretation breaks. This is called **multicollinearity**. Fixes: drop one of the correlated features, combine them, or use Ridge regression (see [Overfitting, Regularization and Cross-Validation](/interview/ai-engineer/machine-learning/overfitting-regularization-and-cross-validation)). A common check is the **variance inflation factor (VIF)**; values above about 5–10 indicate a problem.

### Polynomial regression: curves with a linear model

"Linear" means linear **in the weights**, not necessarily in x. If the data is curved, add new features x², x³:

ŷ = b₀ + b₁·x + b₂·x²

This is still linear regression — just with extra columns. scikit-learn's `PolynomialFeatures` creates them. High degrees can overfit badly (the curve wiggles through every point).

## The assumptions of linear regression

Classic statistics lists assumptions under which OLS estimates and their p-values are reliable. A memory trick is **LINE**:

| Assumption | Meaning | How to check | If broken |
|---|---|---|---|
| **L**inearity | y is roughly a straight-line function of the features | Plot residuals vs predictions: no curve pattern | Add polynomial/log features, or use trees |
| **I**ndependence | Errors of different rows are unrelated | Time data: check autocorrelation | Use time-series models |
| **N**ormality | Residuals are roughly bell-shaped | Histogram or Q-Q plot of residuals | Matters mainly for confidence intervals; transform y |
| **E**qual variance | Spread of residuals is the same for all predictions (**homoscedasticity**) | Residual plot: no funnel shape | Log-transform y, weighted least squares |

Plus: **no strong multicollinearity** among features.

For prediction only, mild violations are often fine. For interpretation ("does advertising really increase sales?"), they matter a lot.

> **Remember:** The normality assumption is about the **residuals**, not about the features or y itself.

## R²: how much of the variation did we explain?

MSE depends on the unit of y (marks, rupees, lakhs), so it is hard to say whether 0.48 is "good". **R²** (R-squared, the **coefficient of determination**) is a unit-free score.

Idea: the simplest possible model always predicts the mean ȳ. Its error is the **total sum of squares (SST)**. Our model's error is SSE. R² is the fraction of SST that our model removed:

<div class="formula">

| Formula | Meaning |
|---|---|
| SST = Σ(yᵢ − ȳ)² | error of always predicting the mean |
| R² = 1 − SSE ÷ SST | 1 = perfect, 0 = no better than the mean, negative = worse than the mean |
| Adjusted R² = 1 − (1 − R²)(n − 1) ÷ (n − p − 1) | penalises adding useless features; p = number of features |

</div>

### Worked example

From the table above: y − ȳ = −2, 0, 1, 0, 1 → SST = 4 + 0 + 1 + 0 + 1 = **6**. SSE = 2.4.

R² = 1 − 2.4 ÷ 6 = 1 − 0.4 = **0.6**. The model explains 60% of the variation in marks. The other 40% comes from things we did not measure (sleep, ability, luck).

Adjusted R² with n = 5, p = 1: 1 − 0.4 × (5 − 1) ÷ (5 − 1 − 1) = 1 − 0.4 × 4 ÷ 3 = 1 − 0.533 = **0.467**.

Why adjusted R²? Plain R² never goes down when you add a feature, even a random one. Adjusted R² goes down if the new feature does not help enough.

> **Common mistake:** Saying R² cannot be negative. On the training data with an intercept it is between 0 and 1, but on **test** data a bad model can score below 0 — it is worse than predicting the mean.

## Linear regression in scikit-learn

First the 5-student example, so you can check the numbers:

```python
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

X = np.array([[1], [2], [3], [4], [5]])    # 2-D: shape (n_samples, n_features)
y = np.array([2, 4, 5, 4, 5])

model = LinearRegression().fit(X, y)
print(round(model.intercept_, 4), model.coef_.round(4))   # b0 and b1
pred = model.predict(X)
print(pred.round(2))
print(round(mean_squared_error(y, pred), 4), round(r2_score(y, pred), 4))
print(model.predict([[6]]).round(2))       # new student who studies 6 hours
```

```text
2.2 [0.6]
[2.8 3.4 4.  4.6 5.2]
0.48 0.6
[5.8]
```

Now a realistic multi-feature example with a train/test split, using the California housing dataset (20,640 districts, 8 features, target = median house value in units of $100,000):

```python
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import root_mean_squared_error, r2_score

X, y = fetch_california_housing(return_X_y=True, as_frame=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scaling does not change OLS predictions, but makes coefficients comparable
model = make_pipeline(StandardScaler(), LinearRegression())
model.fit(X_train, y_train)

pred = model.predict(X_test)
print("RMSE:", round(root_mean_squared_error(y_test, pred), 3))
print("R2:  ", round(r2_score(y_test, pred), 3))

coefs = model.named_steps["linearregression"].coef_
for name, c in sorted(zip(X.columns, coefs), key=lambda t: -abs(t[1])):
    print(f"{name:12s} {c:+.3f}")
```

```text
RMSE: 0.746
R2:   0.576
Latitude     -0.9...
Longitude    -0.8...
MedInc       +0.8...
...  (exact digits vary slightly by version; R2 is about 0.58)
```

An R² of about 0.58 shows that a straight-line model misses a lot here — location effects are not linear. A tree ensemble reaches about 0.8 on the same data (see [Ensembles: Random Forest and Boosting](/interview/ai-engineer/machine-learning/ensembles-random-forest-and-boosting)).

`root_mean_squared_error` exists in scikit-learn 1.4+. Older code used `mean_squared_error(..., squared=False)`, which has been removed.

For p-values and confidence intervals (statistics-style output), use `statsmodels`:

```python
import statsmodels.api as sm
ols = sm.OLS(y_train, sm.add_constant(X_train)).fit()
print(ols.summary())     # coefficients, standard errors, p-values, R², adjusted R²
```

## Pros, cons and when to use

| Pros | Cons |
|---|---|
| Very fast to train and predict | Only straight-line (or hand-made curved) relationships |
| Easy to explain: each weight has a meaning | Sensitive to outliers (squared error) |
| Works well with little data | Unstable with correlated features |
| No hyperparameters in plain OLS | Needs manual feature engineering for interactions |
| A strong baseline; extends to Ridge/Lasso | Extrapolates blindly beyond the training range |

**Use it when:** you need a baseline; the relationship is roughly linear; you need to explain the effect of each feature (economics, pricing, A/B analysis); data is small.

**Prefer something else when:** relationships are strongly non-linear with interactions (use gradient boosting); there are many outliers (use Huber regression or trees).

**Hyperparameters that matter:** plain `LinearRegression` has almost none (`fit_intercept`). The real knobs come with regularized versions: `alpha` in `Ridge` and `Lasso`, and `l1_ratio` in `ElasticNet`. Feature choices (polynomial degree, log transforms) matter more than anything.

## Key terms

| Term | Simple meaning |
|---|---|
| Linear regression | Predict a number as a weighted sum of features plus a constant |
| ŷ (y-hat) | The predicted value |
| Slope / coefficient / weight | How much ŷ changes when a feature goes up by 1 (others fixed) |
| Intercept | The prediction when all features are 0 |
| Residual | y − ŷ, the vertical gap between a point and the line |
| SSE | Sum of squared residuals |
| MSE / RMSE | Mean squared error / its square root (in y's unit) |
| OLS | Ordinary least squares: choose weights that minimise SSE |
| Normal equation | θ = (XᵀX)⁻¹Xᵀy, the exact OLS solution |
| Multiple regression | Linear regression with several features |
| Polynomial regression | Linear regression on x, x², x³ … to fit curves |
| Multicollinearity | Features strongly correlated with each other |
| VIF | Variance inflation factor: a multicollinearity measure |
| Homoscedasticity | Residuals have the same spread everywhere |
| SST | Total squared deviation of y from its mean |
| R² | 1 − SSE/SST: fraction of variation explained |
| Adjusted R² | R² penalised for the number of features |

## Interview questions

**Explain linear regression to a non-technical person.**
It draws the best straight line through data points so we can predict one number from others — for example price from area. "Best" means the line where the squared vertical distances from the points to the line add up to the smallest possible total.

**Why do we square the errors instead of using absolute values?**
Squaring makes all errors positive, punishes large errors more, and gives a smooth function with a simple derivative, so there is a closed-form solution and gradient descent works well. Under normally distributed noise, minimising squared error is also the maximum likelihood estimate. Absolute error (MAE) is more robust to outliers but has no closed form.

**What does the normal equation compute and when would you avoid it?**
It computes the exact least-squares weights θ = (XᵀX)⁻¹Xᵀy in one step. I would avoid it with a very large number of features (solving is roughly cubic in the number of features), with data that does not fit in memory, or when XᵀX is singular because of perfectly correlated features.

**What are the assumptions of linear regression?**
Linearity between features and target, independence of errors, constant variance of errors (homoscedasticity), approximately normal residuals, and no strong multicollinearity. For pure prediction, mild violations are acceptable; for inference about coefficients they matter.

**What is R², and can it be negative?**
R² = 1 − SSE/SST, the fraction of the target's variance explained compared to always predicting the mean. On training data with an intercept it lies between 0 and 1; on test data it can be negative if the model is worse than predicting the mean.

**Why use adjusted R²?**
Plain R² never decreases when you add a feature, even a useless one. Adjusted R² includes a penalty for the number of features, so it only increases if the new feature improves the fit more than chance would.

**What is multicollinearity and why is it a problem?**
It is strong correlation between features. The model cannot separate their individual effects, so coefficients become unstable and hard to interpret, and their standard errors grow. Predictions can still be fine. Fix it by dropping or combining features, or using Ridge regression.

**How do you interpret a coefficient of 0.04 for area in a price model?**
Holding all other features constant, one extra square foot increases the predicted price by 0.04 units of the target — ₹4,000 if price is in lakhs. It is an association, not automatically a cause.

**Is polynomial regression a linear model?**
Yes. It is linear in the weights; we only add new feature columns like x² and x³. The same OLS solution applies. The risk is overfitting with high degrees.

**How does linear regression handle outliers?**
Poorly — because errors are squared, one extreme point can pull the line strongly. Options: investigate and fix the data, cap values, transform the target with a log, or use a robust loss such as Huber (`HuberRegressor`) or MAE.

**Your residual plot shows a funnel shape. What does it mean?**
The error spread grows with the prediction — heteroscedasticity. Coefficient estimates are still unbiased, but their standard errors and p-values are unreliable. A log transform of the target often fixes it, as does weighted least squares.

## Try it yourself

1. **Fit by hand.** Data: x = 1, 2, 3, 4 and y = 3, 5, 7, 9. Compute b₁, b₀, and R².
   *Hint: is there any error at all?*
2. **Fit by hand, with noise.** x = 0, 1, 2, 3 and y = 1, 3, 2, 6. Compute the line, the SSE and R².
   *Hint: x̄ = 1.5, ȳ = 3.*
3. **Code.** Verify exercise 2 with `LinearRegression` and `r2_score`.
   *Hint: X must be 2-D: `[[0], [1], [2], [3]]`.*
4. **Adjusted R².** A model on n = 50 rows with p = 10 features has R² = 0.70. Compute adjusted R².
   *Hint: use the formula box.*

### Answers

1. The points lie exactly on y = 2x + 1. b₁ = 2, b₀ = 1, SSE = 0, so R² = 1.
2. Deviations of x: −1.5, −0.5, 0.5, 1.5; of y: −2, 0, −1, 3. Σ products = 3 + 0 − 0.5 + 4.5 = 7. Σ(x − x̄)² = 2.25 + 0.25 + 0.25 + 2.25 = 5. b₁ = 7/5 = 1.4; b₀ = 3 − 1.4 × 1.5 = 0.9. Predictions: 0.9, 2.3, 3.7, 5.1. Residuals: 0.1, 0.7, −1.7, 0.9. SSE = 0.01 + 0.49 + 2.89 + 0.81 = 4.2. SST = 4 + 0 + 1 + 9 = 14. R² = 1 − 4.2/14 = 0.7.
3. The code prints intercept 0.9, coefficient [1.4] and R² 0.7.
4. 1 − 0.30 × 49 ÷ 39 = 1 − 0.377 ≈ 0.623.

**Next:** [Gradient Descent and Loss Functions](/interview/ai-engineer/machine-learning/gradient-descent-and-loss-functions)
