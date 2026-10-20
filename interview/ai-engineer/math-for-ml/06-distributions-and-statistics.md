---
title: Distributions and Statistics
part: Probability & Statistics
summary: Mean, median, mode, variance and standard deviation; the normal, Bernoulli, binomial and uniform distributions; sampling and the Central Limit Theorem; correlation vs causation; hypothesis tests, p-values, A/B testing and confidence intervals; and maximum likelihood, the idea behind most loss functions.
---

Statistics is how you describe data and how you decide whether a result is real or just luck. As an AI engineer you will use it in exploratory data analysis ("what does this feature look like?"), in model evaluation ("is model B really better than model A, or did it get lucky on the test set?"), and in product work ("did the new chatbot increase conversions?"). Interviewers at product companies ask A/B testing and p-value questions very often. This chapter ends with **maximum likelihood**, which explains where MSE and cross-entropy loss come from.

> **In simple words:** Summary numbers (mean, median, standard deviation) describe a dataset in a few values. Distributions are standard shapes that data often follows. Hypothesis tests ask, "if there were really no difference, how surprising would my data be?" — that surprise level is the p-value.

## Describing data: centre

Here are the marks of 8 students in a 10-mark quiz:

```text
2, 4, 4, 4, 5, 5, 7, 9
```

**Mean** (average): add all values, divide by the count.

```text
mean = (2 + 4 + 4 + 4 + 5 + 5 + 7 + 9) ÷ 8 = 40 ÷ 8 = 5
```

**Median**: the middle value after sorting. With an even count, average the two middle ones. The middle values are the 4th and 5th: 4 and 5, so median = (4 + 5) ÷ 2 = **4.5**.

**Mode**: the most frequent value. 4 appears 3 times, so mode = **4**.

### Why the median matters: outliers

Change the last mark from 9 to 90 (a data entry error):

- New mean = (40 − 9 + 90) ÷ 8 = 121 ÷ 8 = **15.125**
- New median = still **4.5**

One bad value moved the mean from 5 to 15, but the median did not move. An unusual, extreme value is called an **outlier**. The median is **robust** to outliers; the mean is not.

> **Real-life example:** In a company where 9 people earn ₹5 lakh and the CEO earns ₹5 crore, the mean salary is about ₹54.5 lakh, which describes nobody. The median, ₹5 lakh, describes a typical employee. This is why news reports "median household income".

| Measure | Best for | Weakness |
|---|---|---|
| Mean | Symmetric data without outliers; used in most formulas | Pulled by outliers and skew |
| Median | Skewed data (income, house prices, delivery times) | Ignores how far extreme values are |
| Mode | Categories (most common city, most common product) | May not be unique |

**Where in ML:** filling missing values (**imputation**) with the median is safer than the mean for skewed features. MSE loss is minimized by predicting the mean; MAE loss is minimized by predicting the median — which is why MAE is more robust to outliers.

## Describing data: spread

Two classes can have the same mean but very different spreads. **Variance** measures spread: the average squared distance from the mean.

**Worked example** with the marks (mean 5):

| x | x − 5 | (x − 5)² |
|---|---|---|
| 2 | −3 | 9 |
| 4 | −1 | 1 |
| 4 | −1 | 1 |
| 4 | −1 | 1 |
| 5 | 0 | 0 |
| 5 | 0 | 0 |
| 7 | 2 | 4 |
| 9 | 4 | 16 |
| | **Sum** | **32** |

- **Population variance** (divide by n): σ² = 32 ÷ 8 = **4**
- **Sample variance** (divide by n − 1): s² = 32 ÷ 7 ≈ **4.571**
- **Standard deviation** = √variance: σ = √4 = **2**

Use n − 1 when your data is a **sample** from a larger population and you want to estimate the population's variance. Dividing by n slightly underestimates it, because the sample mean is itself fitted to the data. (This is called **Bessel's correction**.)

The **standard deviation** (std) is in the same units as the data, so it is easier to read: "marks are typically about 2 away from the mean".

Other spread measures:

- **Range** = max − min = 9 − 2 = 7 (very sensitive to outliers).
- **Percentiles**: the 90th percentile is the value below which 90% of the data falls. Latency is reported as p50, p95, p99.
- **Interquartile range (IQR)** = 75th percentile − 25th percentile. A common outlier rule: a point is an outlier if it is more than 1.5 × IQR below the 25th or above the 75th percentile.

```python
import numpy as np

marks = np.array([2, 4, 4, 4, 5, 5, 7, 9])
print(marks.mean())             # Output: 5.0
print(np.median(marks))         # Output: 4.5
print(marks.var())              # Output: 4.0      population (ddof=0, NumPy default)
print(marks.var(ddof=1))        # Output: 4.571...  sample
print(marks.std())              # Output: 2.0
print(np.percentile(marks, [25, 75]))   # Output: [4.   5.5]
```

> **Common mistake:** NumPy's `.var()` and `.std()` divide by n by default (`ddof=0`), but Pandas' `.var()` and `.std()` divide by n − 1 (`ddof=1`). The same data gives different numbers in the two libraries. Always know which one you used.

## Probability distributions

A **distribution** describes how likely each value of a random variable is. For a discrete variable it is a **probability mass function** (PMF), giving P(X = x). For a continuous variable it is a **probability density function** (PDF), and probabilities are areas under the curve. A few standard shapes appear again and again.

### Bernoulli: one yes/no trial

A **Bernoulli** variable is 1 with probability p and 0 with probability 1 − p. One coin flip, one click on an ad, one email being spam.

- Mean = p
- Variance = p(1 − p)

**Worked example.** An ad is clicked with p = 0.3. Mean = 0.3, variance = 0.3 × 0.7 = **0.21**.

**Where in ML:** binary classification models the label as Bernoulli. Logistic regression outputs p, and the log loss is the negative log of the Bernoulli probability (more below in MLE).

### Binomial: count of successes in n trials

The **binomial** distribution counts the successes in n independent Bernoulli trials with the same p.

```text
P(X = k) = C(n, k) × pᵏ × (1 − p)ⁿ⁻ᵏ        C(n, k) = n! ÷ (k! (n − k)!)
mean = n·p        variance = n·p·(1 − p)
```

C(n, k), read "n choose k", counts the ways to pick which k trials are the successes.

**Worked example.** Flip a fair coin 10 times. P(exactly 3 heads)?

1. C(10, 3) = 10 × 9 × 8 ÷ (3 × 2 × 1) = 720 ÷ 6 = 120
2. pᵏ(1 − p)ⁿ⁻ᵏ = 0.5³ × 0.5⁷ = 0.5¹⁰ = 1/1024
3. P = 120 ÷ 1024 ≈ **0.117**

**Worked example.** 10 visitors each click with p = 0.2. P(nobody clicks) = 0.8¹⁰ ≈ **0.107**. Expected clicks = 10 × 0.2 = **2**, variance = 10 × 0.2 × 0.8 = **1.6**.

### Uniform: every value equally likely

A **uniform** distribution on [a, b] gives every value in the range the same density. `np.random.rand()` draws from uniform [0, 1].

- Mean = (a + b) ÷ 2
- Variance = (b − a)² ÷ 12

For [0, 1]: mean 0.5, variance 1/12 ≈ 0.083.

**Where in ML:** random weight initialization (Xavier/Glorot uniform), random search over hyperparameters, and random train/test splits.

### Normal (Gaussian): the bell curve

The **normal** distribution, also called **Gaussian**, is the symmetric bell curve. It is described by two numbers: the mean μ (centre) and the standard deviation σ (width). Written N(μ, σ²). Heights, measurement errors, and averages of many things are roughly normal.

<figure>
<svg viewBox="0 0 420 210" width="420" height="210" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<polygon points="155,170 155,91 160,83 166,76 172,68 177,61 182,55 188,50 194,46 199,43 204,41 210,40 216,41 221,43 226,46 232,50 238,55 243,61 248,68 254,76 260,83 265,91 265,170" fill="var(--accent)" fill-opacity="0.2" stroke="none" />
<polyline points="18,170 24,170 30,169 37,169 43,169 50,168 56,167 62,166 69,165 75,164 82,161 88,159 94,156 101,152 107,147 114,142 120,136 127,129 133,121 139,113 146,104 152,95 159,86 165,77 172,68 178,60 184,53 191,48 197,43 204,41 210,40 216,41 223,43 229,48 236,53 242,60 248,68 255,77 261,86 268,95 274,104 281,113 287,121 293,129 300,136 306,142 313,147 319,152 326,156 332,159 338,161 345,164 351,165 358,166 364,167 370,168 377,169 383,169 390,169 396,170 402,170" stroke-width="2" />
<line x1="15" y1="170" x2="405" y2="170" />
<line x1="210" y1="40" x2="210" y2="170" stroke-dasharray="3 3" />
<line x1="45" y1="166" x2="45" y2="174" /><line x1="100" y1="166" x2="100" y2="174" /><line x1="155" y1="166" x2="155" y2="174" /><line x1="265" y1="166" x2="265" y2="174" /><line x1="320" y1="166" x2="320" y2="174" /><line x1="375" y1="166" x2="375" y2="174" />
<text x="45" y="188" text-anchor="middle" fill="currentColor" stroke="none">μ−3σ</text><text x="100" y="188" text-anchor="middle" fill="currentColor" stroke="none">μ−2σ</text><text x="155" y="188" text-anchor="middle" fill="currentColor" stroke="none">μ−σ</text><text x="210" y="188" text-anchor="middle" fill="currentColor" stroke="none">μ</text><text x="265" y="188" text-anchor="middle" fill="currentColor" stroke="none">μ+σ</text><text x="320" y="188" text-anchor="middle" fill="currentColor" stroke="none">μ+2σ</text><text x="375" y="188" text-anchor="middle" fill="currentColor" stroke="none">μ+3σ</text>
<text x="210" y="140" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">68%</text>
<text x="210" y="205" text-anchor="middle" fill="currentColor" stroke="none">±2σ: 95%   ·   ±3σ: 99.7%</text>
<text x="300" y="60" fill="currentColor" stroke="none">N(μ, σ²)</text>
</svg>
<figcaption>The normal curve: about 68% of values lie within one standard deviation of the mean, 95% within two, 99.7% within three.</figcaption>
</figure>

<div class="formula">

| Normal distribution fact | Value |
|---|---|
| Within μ ± 1σ | ≈ 68% |
| Within μ ± 2σ | ≈ 95% (exactly ± 1.96σ for 95%) |
| Within μ ± 3σ | ≈ 99.7% |
| z-score | z = (x − μ) ÷ σ |
| Standard normal | N(0, 1): mean 0, std 1 |

</div>

The **z-score** says how many standard deviations a value is from the mean.

**Worked example.** Exam marks are normal with mean 60 and std 10. You scored 80.

1. z = (80 − 60) ÷ 10 = **2**
2. About 95% of students are within ±2σ, so 5% are outside, split equally: 2.5% above. (The exact value is 2.3%.)
3. You are in roughly the **top 2.3%**.

```python
rng = np.random.default_rng(0)
marks = rng.normal(loc=60, scale=10, size=100_000)
print(((marks > 50) & (marks < 70)).mean())   # Output: about 0.683
print((marks > 80).mean())                    # Output: about 0.023

z = (marks - marks.mean()) / marks.std()      # standardization = z-scores
print(z.mean().round(3), z.std().round(3))    # Output: 0.0 1.0
```

**Where in ML:** **standard scaling** (`StandardScaler`) converts every feature to z-scores. Weight initialization often uses normal random numbers. Linear regression assumes the errors are normal. Anomaly detection can flag points with |z| > 3.

| Distribution | Type | Parameters | Mean | Variance | Example |
|---|---|---|---|---|---|
| Bernoulli | discrete (0/1) | p | p | p(1−p) | one click |
| Binomial | discrete (0..n) | n, p | np | np(1−p) | clicks out of 1000 visits |
| Uniform | continuous | a, b | (a+b)/2 | (b−a)²/12 | random init, random search |
| Normal | continuous | μ, σ | μ | σ² | heights, errors, averages |

> **Interview tip:** If asked "is this feature normally distributed?", mention plotting a histogram, comparing mean and median (far apart = skewed), and a Q-Q plot. For right-skewed features like income or prices, a **log transform** often makes them closer to normal.

## Sampling and the Central Limit Theorem

The **population** is everyone you care about (all Flipkart customers). A **sample** is the part you actually measured (1,000 surveyed customers). A number computed from a sample, like the sample mean, is a **statistic**, and it changes from sample to sample. We use it to estimate the population's true value, the **parameter**.

How much does the sample mean change between samples? Its standard deviation is called the **standard error**:

```text
standard error of the mean = σ ÷ √n
```

More data → smaller standard error → more precise estimate. But it shrinks with √n: to halve the error you need **4 times** the data.

The **Central Limit Theorem (CLT)** says: if you take many samples of size n and compute each sample's mean, those means form an approximately **normal** distribution — even if the original data is not normal — as long as n is large enough (often n ≥ 30 is enough). Its centre is the true mean μ and its spread is σ ÷ √n.

**Worked example.** A die roll is uniform on 1 to 6, not bell-shaped. Mean 3.5, variance 35/12 ≈ 2.917, std ≈ 1.708. Average 30 rolls:

1. Mean of the averages ≈ **3.5**
2. Standard error = 1.708 ÷ √30 = 1.708 ÷ 5.477 ≈ **0.312**
3. The averages look like a bell curve: about 95% fall within 3.5 ± 2 × 0.312, so between **2.88 and 4.12**.

```python
rng = np.random.default_rng(0)
means = rng.integers(1, 7, size=(10_000, 30)).mean(axis=1)   # 10,000 samples of 30 rolls
print(means.mean().round(3))    # Output: 3.5
print(means.std().round(3))     # Output: 0.311   (theory: 0.312)
# A histogram of `means` (plt.hist(means, bins=40)) is bell-shaped.
```

**Why the CLT matters:** it is the reason we can use normal-distribution formulas (z-tests, confidence intervals) for averages and proportions — like conversion rates in an A/B test — without knowing the shape of the original data.

## Correlation vs causation

**Correlation** measures how strongly two variables move together in a straight-line way. The **Pearson correlation coefficient** r is between −1 and 1:

- r = 1: perfect positive line
- r = 0: no linear relationship
- r = −1: perfect negative line

```text
r = Σ (xᵢ − x̄)(yᵢ − ȳ) ÷ √( Σ (xᵢ − x̄)² × Σ (yᵢ − ȳ)² )
```

It is the covariance divided by both standard deviations, so it has no units.

**Worked example.** Hours studied x = [1, 2, 3, 4, 5], marks y = [2, 4, 5, 4, 5].

1. Means: x̄ = 3, ȳ = 20 ÷ 5 = 4
2. Deviations: x − 3 = [−2, −1, 0, 1, 2]; y − 4 = [−2, 0, 1, 0, 1]
3. Products: 4, 0, 0, 0, 2 → sum = **6**
4. Σ(x − x̄)² = 4 + 1 + 0 + 1 + 4 = **10**; Σ(y − ȳ)² = 4 + 0 + 1 + 0 + 1 = **6**
5. r = 6 ÷ √(10 × 6) = 6 ÷ √60 = 6 ÷ 7.746 ≈ **0.775**

A fairly strong positive correlation.

```python
x = np.array([1, 2, 3, 4, 5]); y = np.array([2, 4, 5, 4, 5])
print(np.corrcoef(x, y)[0, 1].round(3))   # Output: 0.775
# Pandas: df.corr() gives the whole correlation matrix
```

**Correlation does not mean causation.** Ice-cream sales and drowning deaths are correlated, but ice cream does not cause drowning: hot weather causes both. A hidden variable that affects both is a **confounder**. To prove causation you usually need a **randomized experiment** (like an A/B test), where chance decides who gets the treatment, so confounders are balanced between groups.

Also remember: r measures only **linear** relationships. y = x² for x from −3 to 3 has r = 0 even though y depends perfectly on x.

> **Common mistake:** Dropping a feature because its correlation with the target is near 0. The relationship may be non-linear (a tree model could still use it), or the feature may matter only together with another feature.

**Where in ML:** checking correlations during EDA, finding **multicollinearity** (two features with r near ±1 make linear regression weights unstable), and avoiding **data leakage** (a feature suspiciously correlated with the target, like "refund_issued" when predicting "returned").

## Hypothesis testing and p-values

You changed the "Buy" button colour and conversions went from 10% to 12.5%. Is the new button better, or did you get lucky? A **hypothesis test** answers this in a standard way.

1. **Null hypothesis (H₀)**: the boring explanation — "there is no real difference".
2. **Alternative hypothesis (H₁)**: "there is a real difference".
3. Compute a **test statistic** from the data that measures how far the result is from what H₀ predicts (for example, a z-score).
4. The **p-value** = the probability of seeing a result at least this extreme **if H₀ were true**.
5. If the p-value is below a threshold chosen in advance, called the **significance level α** (usually 0.05), **reject H₀**: the result is **statistically significant**.

> **In simple words:** The p-value answers: "If nothing had really changed, how often would pure luck give a difference this big?" A small p-value (like 0.01) means luck rarely does this, so we believe something real changed.

> **Common mistake:** Saying "p = 0.03 means there is a 3% chance the null hypothesis is true" or "a 97% chance B is better". Both are wrong. The p-value is P(data this extreme | H₀), not P(H₀ | data). (It is the Bayes flip from the last chapter again.)

### Two kinds of errors

| | H₀ true (no real effect) | H₀ false (real effect) |
|---|---|---|
| Reject H₀ | **Type I error** (false positive), probability α | Correct (probability = **power**) |
| Do not reject H₀ | Correct | **Type II error** (false negative), probability β |

- α = 0.05 means you accept a 5% false-alarm rate when there is no effect.
- **Power** = 1 − β = the chance of detecting a real effect. Bigger samples give more power. A common target is 80%.

## A/B testing, worked end to end

An **A/B test** is a randomized experiment: users are randomly split into group A (old version, the **control**) and group B (new version, the **treatment**), and you compare a metric.

**Data.** 2,000 users in each group.

- A: 200 purchases → p_A = 200 ÷ 2000 = **0.10**
- B: 250 purchases → p_B = 250 ÷ 2000 = **0.125**
- Difference: 0.125 − 0.10 = **0.025** (2.5 percentage points)

**Two-proportion z-test.**

1. Under H₀ both groups share one rate. **Pooled rate**: p = (200 + 250) ÷ (2000 + 2000) = 450 ÷ 4000 = **0.1125**
2. Standard error of the difference: SE = √(p(1 − p) × (1/n_A + 1/n_B)) = √(0.1125 × 0.8875 × (1/2000 + 1/2000)) = √(0.09984 × 0.001) = √0.00009984 ≈ **0.00999**
3. z = difference ÷ SE = 0.025 ÷ 0.00999 ≈ **2.50**
4. Two-sided p-value: the chance a standard normal value is beyond ±2.50 is about **0.012**
5. 0.012 < 0.05, so **reject H₀**. The new button is significantly better at the 5% level.

```python
import math

def two_proportion_z_test(success_a, n_a, success_b, n_b):
    p_a, p_b = success_a / n_a, success_b / n_b
    p_pool = (success_a + success_b) / (n_a + n_b)
    se = math.sqrt(p_pool * (1 - p_pool) * (1 / n_a + 1 / n_b))
    z = (p_b - p_a) / se
    p_value = math.erfc(abs(z) / math.sqrt(2))     # two-sided p-value from the normal curve
    return z, p_value

z, p = two_proportion_z_test(200, 2000, 250, 2000)
print(round(z, 2), round(p, 4))    # Output: 2.5 0.0124
```

In practice you can also use `statsmodels.stats.proportion.proportions_ztest`, or `scipy.stats.ttest_ind(a, b)` to compare the means of two groups of numbers (like average order value). These libraries return the test statistic and the p-value.

### Good A/B testing practice

- **Decide the sample size before starting**, based on the smallest effect you care about and the power you want. Do not stop the test the moment p dips below 0.05 ("**peeking**"); that inflates false positives.
- **Randomize** at the right unit (user, not page view) so the same person does not see both versions.
- Run for full weeks to cover weekday/weekend behaviour.
- Watch **guardrail metrics** (latency, refunds, complaints), not only the main metric.
- Testing many metrics or many variants increases the chance of a false positive somewhere (**multiple comparisons**). Corrections like Bonferroni (divide α by the number of tests) help.
- **Statistical significance ≠ practical significance.** With millions of users, a 0.01% lift can be "significant" but not worth the engineering cost.

> **Interview tip:** A great A/B test answer has this structure: metric and hypothesis → randomization unit → sample size and duration → test and threshold → check guardrails → decide. For an LLM feature, also mention offline evaluation first, then an online A/B test on a business metric like task completion or thumbs-up rate.

## Confidence intervals

A single estimate (0.025) hides its uncertainty. A **confidence interval (CI)** gives a range:

```text
95% CI = estimate ± 1.96 × standard error
```

**Worked example: the A/B difference.** For the interval we use the unpooled standard error:

1. SE = √(p_A(1 − p_A)/n_A + p_B(1 − p_B)/n_B) = √(0.1 × 0.9 ÷ 2000 + 0.125 × 0.875 ÷ 2000) = √(0.000045 + 0.0000547) ≈ **0.00998**
2. Margin = 1.96 × 0.00998 ≈ **0.0196**
3. 95% CI = 0.025 ± 0.0196 = **(0.0054, 0.0446)**

The whole interval is above 0, which agrees with the test: B is better, by somewhere between about 0.5 and 4.5 percentage points.

**Worked example: a mean.** 100 deliveries took on average 30 minutes, with sample std 8 minutes.

1. SE = 8 ÷ √100 = **0.8**
2. Margin = 1.96 × 0.8 ≈ **1.57**
3. 95% CI = 30 ± 1.57 = **(28.43, 31.57) minutes**

**What "95% confidence" means:** if you repeated the whole study many times and built an interval each time, about 95% of those intervals would contain the true value. It does **not** mean "there is a 95% probability the true value is in this particular interval" (in classical statistics, the true value is fixed, not random).

> **Remember:** If a 95% CI for a difference does not include 0, the difference is significant at α = 0.05. Wider interval = less certainty; more data makes it narrower (by √n).

**Where in ML:** report model accuracy with a confidence interval, especially on small test sets. 85% accuracy on 100 test examples has a CI of roughly ±7 points, so "model B at 87%" may not be truly better. **Bootstrapping** (resample the test set with replacement many times and recompute the metric) gives CIs for any metric, including F1 or LLM-judge scores.

```python
rng = np.random.default_rng(0)
correct = rng.random(100) < 0.85            # 100 test results (True = correct), simulated
boot = [rng.choice(correct, size=100, replace=True).mean() for _ in range(5000)]
print(correct.mean(), np.percentile(boot, [2.5, 97.5]))
# Output: 0.77 [0.69 0.85]  — the interval is about ±8 points wide
```

## Maximum likelihood estimation (MLE)

How does a model choose its parameters? The most common principle is: **choose the parameters that make the observed data most probable**. This is **maximum likelihood estimation (MLE)**. The **likelihood** L(θ) is the probability of the data, seen as a function of the parameters θ.

**Worked example: a coin.** You flip a coin 10 times and get 7 heads, 3 tails. What is the best estimate of p = P(heads)?

The likelihood of this exact sequence is L(p) = p⁷ × (1 − p)³. Try a few values:

| p | p⁷ × (1 − p)³ | log-likelihood |
|---|---|---|
| 0.3 | 0.000075 | −9.50 |
| 0.5 | 0.000977 | −6.93 |
| **0.7** | **0.002224** | **−6.11** |
| 0.9 | 0.000478 | −7.65 |

The likelihood is highest at **p = 0.7** = 7 ÷ 10, the fraction of heads. (Calculus gives the exact answer: set the derivative of the log-likelihood to zero — see the next chapter.) The intuitive answer is also the MLE.

```python
p = np.linspace(0.01, 0.99, 99)
log_lik = 7 * np.log(p) + 3 * np.log(1 - p)
print(p[np.argmax(log_lik)].round(2))      # Output: 0.7
```

### Why MLE explains your loss functions

| If you assume the label is… | Maximizing likelihood is the same as minimizing… | Used in |
|---|---|---|
| Normal around the prediction | **Mean squared error** | Linear regression |
| Bernoulli with probability ŷ | **Binary cross-entropy (log loss)** | Logistic regression, binary classifiers |
| Categorical (softmax over classes) | **Categorical cross-entropy** | Multiclass classifiers, LLM next-token training |

For a binary label y (0 or 1) with predicted probability ŷ, the Bernoulli likelihood is ŷʸ(1 − ŷ)¹⁻ʸ. Taking the negative log gives the familiar loss:

```text
log loss = −[ y·log(ŷ) + (1 − y)·log(1 − ŷ) ]
```

**Worked example.** True label y = 1, model says ŷ = 0.9: loss = −log(0.9) ≈ **0.105**. If the model says ŷ = 0.1: loss = −log(0.1) ≈ **2.303**. Confident wrong answers are punished heavily.

So when an LLM is trained to "minimize cross-entropy on the next token", it is doing maximum likelihood: making the real training text as probable as possible. See [Loss Functions and Backpropagation](/interview/ai-engineer/deep-learning/loss-functions-and-backpropagation).

> **Interview tip:** If asked "why cross-entropy for classification and not MSE?", say: cross-entropy is the negative log-likelihood of a Bernoulli/categorical model, so it is the statistically natural choice; it also gives strong gradients when the model is confidently wrong, while MSE with a sigmoid gives tiny gradients there and learns slowly.

## Key terms

| Term | Simple meaning |
|---|---|
| Mean | Sum ÷ count; the average |
| Median | Middle value after sorting; robust to outliers |
| Mode | Most frequent value |
| Outlier | An unusual, extreme value |
| Variance | Average squared distance from the mean |
| Standard deviation | √variance; typical distance from the mean, in data units |
| Bessel's correction | Dividing by n − 1 for a sample variance |
| Percentile | Value below which a given % of data falls (p95 latency) |
| IQR | 75th − 25th percentile; spread of the middle half |
| PMF / PDF | Probability for each value (discrete) / density curve (continuous) |
| Bernoulli | One yes/no trial with probability p |
| Binomial | Number of successes in n trials |
| Uniform | All values in a range equally likely |
| Normal (Gaussian) | Symmetric bell curve, N(μ, σ²) |
| z-score | (x − μ) ÷ σ; how many stds from the mean |
| Population / sample | Everyone / the part you measured |
| Standard error | Std of an estimate across samples; σ ÷ √n for the mean |
| Central Limit Theorem | Averages of many samples are approximately normal |
| Correlation (r) | Strength of linear relationship, −1 to 1 |
| Confounder | Hidden variable that affects both things |
| Causation | One thing actually making another happen |
| Null hypothesis | "No real effect" assumption |
| p-value | P(result this extreme \| null hypothesis true) |
| Significance level (α) | Threshold for the p-value, often 0.05 |
| Type I / Type II error | False positive / false negative in a test |
| Power | Probability of detecting a real effect |
| A/B test | Randomized comparison of two versions |
| Peeking | Stopping a test early when it looks significant; inflates false positives |
| Confidence interval | Range likely to contain the true value; estimate ± 1.96 × SE |
| Bootstrapping | Resampling the data to estimate uncertainty |
| Likelihood | Probability of the data as a function of the parameters |
| MLE | Choosing parameters that make the data most probable |
| Log loss / cross-entropy | Negative log-likelihood for classification |

## Interview questions

**When would you use the median instead of the mean?**
When the data is skewed or has outliers, like income, house prices, or delivery times. One extreme value can move the mean a lot but barely moves the median. For example, imputing missing incomes with the median is safer.

**Why divide by n − 1 for the sample variance?**
The sample mean is computed from the same data, so deviations from it are a little smaller than deviations from the true mean. Dividing by n − 1 corrects this underestimate and gives an unbiased estimate of the population variance. For large n it hardly matters.

**What does the Central Limit Theorem say and why is it useful?**
The mean of a large enough sample is approximately normally distributed around the true mean, with standard error σ/√n, whatever the shape of the original data. It lets us use normal-based tests and confidence intervals for averages and conversion rates, which is what A/B testing relies on.

**Explain a p-value to a product manager.**
"If the new feature really had no effect, the p-value is how often we would see a difference this big just from random chance." A p-value of 0.01 means luck alone would rarely produce this, so we trust that the effect is real. It is not the probability the feature works.

**What are Type I and Type II errors? Which is worse?**
Type I is a false positive (declaring an effect that is not there), with probability α. Type II is a false negative (missing a real effect). Which is worse depends on the cost: launching a broken pricing change may be worse than missing a small improvement, so you would lower α.

**How would you design an A/B test for a new recommendation model?**
Choose a primary metric (like click-through or revenue per user) and guardrails (latency, complaints). Randomize by user, compute the sample size from the minimum effect you care about and 80% power, run for at least a full week, then do a two-proportion z-test or t-test and check the confidence interval. Avoid peeking and correct for many metrics.

**What is the difference between correlation and causation?**
Correlation means two variables move together; causation means changing one changes the other. A confounder can create correlation without causation, like hot weather driving both ice-cream sales and drowning. Randomized experiments are the standard way to show causation.

**Can two variables have zero correlation but be strongly related?**
Yes. Pearson correlation only measures straight-line relationships. y = x² on a range symmetric around zero has r = 0 although y is fully determined by x.

**What is a 95% confidence interval, exactly?**
A range built so that if we repeated the experiment many times, 95% of such ranges would contain the true value. It is computed as estimate ± 1.96 × standard error. If an interval for a difference excludes zero, the difference is significant at the 5% level.

**What is maximum likelihood estimation?**
Choosing model parameters so the observed data is as probable as possible. For 7 heads in 10 flips, the MLE of P(heads) is 0.7. In ML, minimizing MSE is MLE under normal noise, and minimizing cross-entropy is MLE for classification.

**Your test set has 200 examples. Model A gets 84%, model B 86%. Is B better?**
Probably not provably. The standard error of an 85% accuracy on 200 examples is about √(0.85 × 0.15 / 200) ≈ 0.025, so the 95% interval is about ±5 points — much wider than the 2-point gap. I would use a larger test set, a paired test like McNemar's, or bootstrap confidence intervals.

**What is the variance of a Bernoulli variable, and when is it largest?**
p(1 − p). It is largest at p = 0.5 (variance 0.25), when the outcome is most uncertain, and zero when p is 0 or 1.

## Try it yourself

1. For the data [10, 12, 12, 15, 21], compute the mean, median, mode, population variance and standard deviation by hand. *Hint:* the mean is 14.
2. In 20 coin flips, what is the expected number of heads and the standard deviation? *Hint:* binomial, n·p and √(n·p·(1 − p)).
3. An A/B test gives A: 300/5000 conversions, B: 360/5000. Run the two-proportion z-test with the function above. Is it significant at α = 0.05? *Hint:* compute z by hand first; the pooled rate is 0.066.
4. Write code that simulates 10,000 samples of size 50 from an exponential distribution (`rng.exponential(scale=2, size=(10000, 50))`) and checks that the sample means have std ≈ 2 ÷ √50. *Hint:* the exponential with scale 2 has mean 2 and std 2.

### Answers

1. Mean = 70 ÷ 5 = **14**. Median = **12**. Mode = **12**. Deviations −4, −2, −2, 1, 7; squares 16, 4, 4, 1, 49; sum 74; population variance = 74 ÷ 5 = **14.8**; std = √14.8 ≈ **3.85**.
2. Expected heads = 20 × 0.5 = **10**. Std = √(20 × 0.5 × 0.5) = √5 ≈ **2.24**.
3. p_A = 0.06, p_B = 0.072, difference 0.012. Pooled p = 660 ÷ 10000 = 0.066. SE = √(0.066 × 0.934 × (2 ÷ 5000)) = √(0.0000247) ≈ 0.00497. z = 0.012 ÷ 0.00497 ≈ **2.42**, p ≈ **0.016** < 0.05, so **significant**.
4. Solution:

```python
rng = np.random.default_rng(0)
means = rng.exponential(scale=2, size=(10_000, 50)).mean(axis=1)
print(means.std().round(3), round(2 / np.sqrt(50), 3))   # both about 0.283
```

**Next:** [Derivatives, Gradients and the Chain Rule](/interview/ai-engineer/math-for-ml/derivatives-gradients-and-the-chain-rule)
