---
title: Probability Basics
part: Probability & Statistics
summary: Events and the basic rules, joint and conditional probability from a table, independence, Bayes' theorem with the classic medical test example and a tiny spam filter, random variables and expected value, and why ML works with log-probabilities.
---

Machine learning models rarely say "yes" or "no". A spam filter says "93% spam", a medical model says "12% chance of disease", and an LLM gives a probability to every possible next word before choosing one. To read, trust and debug these numbers, you need probability. This chapter covers the rules you will use every week, and Bayes' theorem, which is one of the most asked math questions in data science and ML interviews.

> **In simple words:** Probability is a number from 0 to 1 that says how likely something is. Conditional probability is the chance of A when you already know B happened. Bayes' theorem lets you flip a conditional around: from "how often does the test detect the disease" to "if the test is positive, how likely is the disease".

## What probability means

The **probability** of an event is a number between 0 and 1:

- 0 means it never happens.
- 1 means it always happens.
- 0.25 means it happens about 1 time in 4, if you repeat the situation many times.

An **experiment** is something with an uncertain result, like rolling a die. The **sample space** is the set of all possible results: {1, 2, 3, 4, 5, 6}. An **event** is a set of results you care about, like "the roll is even" = {2, 4, 6}.

When all results are equally likely:

```text
P(event) = (number of results in the event) ÷ (total number of results)
```

**Worked example.** P(even on one die) = 3 ÷ 6 = **0.5**.

**Worked example.** Roll two dice. P(sum is 7)?

1. Total results: 6 × 6 = 36 (each pair like (1, 6) or (6, 1) counts separately).
2. Pairs that sum to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 pairs.
3. P = 6 ÷ 36 = 1/6 ≈ **0.167**.

In real data, results are not equally likely, so we estimate probabilities by counting. If 20 out of 1,000 UPI payments failed yesterday, we estimate P(failure) ≈ 20 ÷ 1000 = **0.02**.

```python
import numpy as np

rng = np.random.default_rng(seed=0)
rolls = rng.integers(1, 7, size=100_000)     # 100,000 die rolls (7 is excluded)
print((rolls % 2 == 0).mean())               # Output: close to 0.5

d1 = rng.integers(1, 7, size=100_000)
d2 = rng.integers(1, 7, size=100_000)
print(((d1 + d2) == 7).mean())               # Output: close to 0.167
```

The idea that a frequency gets closer to the true probability as you repeat more times is called the **law of large numbers**. It is why more data gives better estimates.

## The basic rules

<div class="formula">

| Rule | Formula | Example |
|---|---|---|
| Complement (NOT) | P(not A) = 1 − P(A) | P(payment OK) = 1 − 0.02 = 0.98 |
| Addition (OR), general | P(A or B) = P(A) + P(B) − P(A and B) | subtract the overlap so it is not counted twice |
| Addition, mutually exclusive | P(A or B) = P(A) + P(B) | P(roll 1 or 2) = 1/6 + 1/6 = 1/3 |
| Multiplication (AND), general | P(A and B) = P(A) × P(B \| A) | |
| Multiplication, independent | P(A and B) = P(A) × P(B) | two heads: 0.5 × 0.5 = 0.25 |
| All outcomes | probabilities of all separate outcomes add to 1 | softmax outputs add to 1 |

</div>

Two events are **mutually exclusive** if they cannot both happen (a die cannot show 1 and 2 at the same time).

**Worked example: "at least one".** P(at least one six in 4 rolls)?

The easy way is the complement: "at least one six" = NOT "no sixes".

1. P(no six in one roll) = 5/6
2. P(no six in 4 independent rolls) = (5/6)⁴ = 625/1296 ≈ 0.482
3. P(at least one six) = 1 − 0.482 = **0.518**

> **Interview tip:** Whenever you see "at least one", use 1 − P(none). For example, "if each of 10 microservices fails with probability 0.01, what is the chance at least one fails?" = 1 − 0.99¹⁰ ≈ 1 − 0.904 = 0.096.

## Joint, marginal and conditional probability

Probability questions become easy when you put the counts in a table. Here are 1,000 Flipkart orders:

|  | Returned | Not returned | Total |
|---|---|---|---|
| Electronics | 40 | 360 | 400 |
| Clothing | 120 | 480 | 600 |
| Total | 160 | 840 | 1000 |

**Joint probability** — both things at once:

- P(Clothing and Returned) = 120 ÷ 1000 = **0.12**

**Marginal probability** — one thing, ignoring the other (use the totals in the margins, which is where the name comes from):

- P(Returned) = 160 ÷ 1000 = **0.16**
- P(Clothing) = 600 ÷ 1000 = **0.6**

**Conditional probability** — the chance of A when we **know** B happened. Written P(A | B), read "probability of A given B". Knowing B shrinks the world to only the B cases.

```text
P(A | B) = P(A and B) ÷ P(B)
```

- P(Returned | Clothing): only look at the Clothing row. 120 ÷ 600 = **0.2**. Using the formula: 0.12 ÷ 0.6 = 0.2. Same.
- P(Returned | Electronics) = 40 ÷ 400 = **0.1**
- P(Clothing | Returned): only look at the Returned column. 120 ÷ 160 = **0.75**

Notice that P(Returned | Clothing) = 0.2 but P(Clothing | Returned) = 0.75. These are different questions with different answers.

> **Common mistake:** Confusing P(A | B) with P(B | A). "Most returned orders are clothing" (0.75) is not the same as "most clothing orders are returned" (only 0.2). This mistake is so common in courts that it has a name: the **prosecutor's fallacy**.

```python
import numpy as np

#                 returned  not_returned
counts = np.array([[ 40, 360],     # electronics
                   [120, 480]])    # clothing
total = counts.sum()

p_joint = counts / total                     # joint probability table
p_returned = p_joint[:, 0].sum()             # marginal: 0.16
p_clothing = p_joint[1].sum()                # marginal: 0.6
print(p_joint[1, 0] / p_clothing)            # P(returned | clothing)  Output: 0.2
print(p_joint[1, 0] / p_returned)            # P(clothing | returned)  Output: 0.75
```

**Where in ML:** a classifier's output is a conditional probability: P(class = spam | the words in this email). An LLM computes P(next token | all previous tokens). Every "given the input" in ML is a conditional.

## Independence

Two events are **independent** if knowing one tells you nothing about the other:

```text
A and B are independent  ⇔  P(A | B) = P(A)  ⇔  P(A and B) = P(A) × P(B)
```

**Worked example.** Are "Clothing" and "Returned" independent in our table?

1. If independent, P(Clothing and Returned) should be P(Clothing) × P(Returned) = 0.6 × 0.16 = 0.096.
2. The actual value is 0.12.
3. 0.12 ≠ 0.096, so they are **not independent**: clothing orders are returned more often (0.2 vs the overall 0.16).

**Worked example.** Three fair coin flips are independent. P(three heads) = 0.5 × 0.5 × 0.5 = **0.125**.

> **Common mistake:** The **gambler's fallacy**: "the coin gave 5 heads in a row, so tails is due". For independent flips the next flip is still 0.5. The coin has no memory.

**Where in ML:** many methods assume independence to make the math simple. **Naive Bayes** assumes the words in an email are independent given the class. Most training methods assume examples are **i.i.d.** (independent and identically distributed); time-series data breaks this, which is why you need a time-based split.

## Bayes' theorem

Often you know P(evidence | cause) but you want P(cause | evidence). A medical test is described by how well it detects the disease, but a patient wants to know "I tested positive — do I have it?". **Bayes' theorem** flips the conditional:

```text
P(A | B) = P(B | A) × P(A) ÷ P(B)
```

The parts have names:

| Part | Name | Meaning in the test example |
|---|---|---|
| P(A) | **Prior** | How common the disease is before any test |
| P(B \| A) | **Likelihood** | How often a sick person tests positive |
| P(B) | **Evidence** | How often anyone tests positive |
| P(A \| B) | **Posterior** | Chance of disease after a positive test |

The evidence P(B) is usually computed with the **law of total probability**: add up all the ways B can happen.

```text
P(B) = P(B | A) × P(A) + P(B | not A) × P(not A)
```

### The medical test example

A disease affects **1%** of people. A test has:

- **Sensitivity 90%**: if you are sick, it is positive 90% of the time. P(+ | sick) = 0.9.
- **False positive rate 5%**: if you are healthy, it is still positive 5% of the time. P(+ | healthy) = 0.05.

You test positive. What is the chance you are sick? Most people guess about 90%. Let us compute.

**Method 1: imagine 10,000 people** (the easiest way to explain in an interview).

1. Sick: 1% of 10,000 = **100**. Healthy: **9,900**.
2. Sick and positive: 90% of 100 = **90**.
3. Healthy and positive: 5% of 9,900 = **495**.
4. All positives: 90 + 495 = **585**.
5. P(sick | +) = 90 ÷ 585 ≈ **0.154**, about **15%**.

<figure>
<svg viewBox="0 0 430 210" width="430" height="210" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="10" y="88" width="80" height="34" rx="6" />
<text x="50" y="110" text-anchor="middle" fill="currentColor" stroke="none">10,000</text>
<line x1="90" y1="100" x2="150" y2="50" /><line x1="90" y1="110" x2="150" y2="160" />
<text x="100" y="66" fill="currentColor" stroke="none">1%</text><text x="100" y="152" fill="currentColor" stroke="none">99%</text>
<rect x="150" y="33" width="90" height="34" rx="6" />
<text x="195" y="55" text-anchor="middle" fill="currentColor" stroke="none">100 sick</text>
<rect x="150" y="143" width="90" height="34" rx="6" />
<text x="195" y="165" text-anchor="middle" fill="currentColor" stroke="none">9,900 healthy</text>
<line x1="240" y1="45" x2="290" y2="22" /><line x1="240" y1="55" x2="290" y2="72" />
<line x1="240" y1="155" x2="290" y2="138" /><line x1="240" y1="165" x2="290" y2="188" />
<text x="296" y="26" fill="var(--accent)" stroke="none" font-weight="bold">90% → 90 positive</text>
<text x="296" y="76" fill="currentColor" stroke="none">10% → 10 negative</text>
<text x="296" y="142" fill="var(--accent)" stroke="none" font-weight="bold">5% → 495 positive</text>
<text x="296" y="192" fill="currentColor" stroke="none">95% → 9,405 negative</text>
</svg>
<figcaption>Only 90 of the 585 positive results come from sick people, so a positive test means about a 15% chance of disease.</figcaption>
</figure>

**Method 2: the formula.**

1. Prior: P(sick) = 0.01, P(healthy) = 0.99
2. Evidence: P(+) = 0.9 × 0.01 + 0.05 × 0.99 = 0.009 + 0.0495 = **0.0585**
3. Posterior: P(sick | +) = 0.9 × 0.01 ÷ 0.0585 = 0.009 ÷ 0.0585 ≈ **0.154**

Why so low? The disease is rare, so the many healthy people produce more false positives (495) than there are true positives (90). The low **prior** matters a lot. This is called **base rate neglect** when people forget it.

**A second test.** If the person takes the test again (assume independent results) and is positive again, the old posterior becomes the new prior:

```text
P(sick | ++) = 0.9 × 0.154 ÷ (0.9 × 0.154 + 0.05 × 0.846) ≈ 0.139 ÷ 0.181 ≈ 0.77
```

Two positives raise the chance to about 77%. This "update your belief with each new piece of evidence" is the core idea of Bayesian thinking.

```python
def bayes(prior, p_e_given_h, p_e_given_not_h):
    evidence = p_e_given_h * prior + p_e_given_not_h * (1 - prior)
    return p_e_given_h * prior / evidence

p1 = bayes(0.01, 0.9, 0.05)
print(round(p1, 3))                     # Output: 0.154
p2 = bayes(p1, 0.9, 0.05)               # posterior becomes the new prior
print(round(p2, 3))                     # Output: 0.766

# check by simulation
import numpy as np
rng = np.random.default_rng(1)
n = 1_000_000
sick = rng.random(n) < 0.01
positive = np.where(sick, rng.random(n) < 0.9, rng.random(n) < 0.05)
print(sick[positive].mean())            # Output: about 0.15
```

> **Interview tip:** For any Bayes question, say "let me imagine 10,000 people" and build the tree. It is fast, hard to get wrong, and the interviewer can follow every number. Then mention that the result shows why we look at **precision** for rare classes like fraud.

**Where in ML:** this example is exactly the link between **recall** (P(positive prediction | actually positive), like sensitivity) and **precision** (P(actually positive | positive prediction), like the posterior). A fraud model with 90% recall can still have low precision if fraud is very rare. See [Evaluation Metrics](/interview/ai-engineer/machine-learning/evaluation-metrics).

### A tiny spam filter with Bayes

Suppose from past emails:

- P(spam) = 0.3, so P(not spam) = 0.7
- The word "free" appears in 40% of spam: P("free" | spam) = 0.4
- "free" appears in 5% of normal email: P("free" | not spam) = 0.05

An email contains "free". P(spam | "free")?

1. Spam path: 0.4 × 0.3 = **0.12**
2. Not-spam path: 0.05 × 0.7 = **0.035**
3. Evidence: 0.12 + 0.035 = **0.155**
4. Posterior: 0.12 ÷ 0.155 ≈ **0.774**

Now add a second word, "winner", with P("winner" | spam) = 0.3 and P("winner" | not spam) = 0.02. **Naive Bayes** assumes the words are independent given the class, so we just multiply:

1. Spam: 0.3 × 0.4 × 0.3 = **0.036**
2. Not spam: 0.7 × 0.05 × 0.02 = **0.0007**
3. P(spam | "free", "winner") = 0.036 ÷ (0.036 + 0.0007) = 0.036 ÷ 0.0367 ≈ **0.981**

That is the whole Naive Bayes classifier: prior × product of word likelihoods, for each class, then normalize. See [KNN, SVM and Naive Bayes](/interview/ai-engineer/machine-learning/knn-svm-and-naive-bayes).

## Random variables and expected value

A **random variable** is a number whose value depends on chance, like "the number on a die" or "₹ won in a lucky draw". It is **discrete** if it takes separate values (0, 1, 2, …) and **continuous** if it can be any value in a range (height, time).

The **expected value** E[X] is the long-run average: each value times its probability, added up.

```text
E[X] = Σ x × P(X = x)
```

**Worked example: a die.** E[X] = (1 + 2 + 3 + 4 + 5 + 6) × 1/6 = 21 ÷ 6 = **3.5**. You can never roll 3.5, but over many rolls the average approaches it.

**Worked example: is a game worth playing?** A ticket costs ₹10. You win ₹50 with probability 0.1, otherwise nothing.

1. Expected winnings: 50 × 0.1 + 0 × 0.9 = **₹5**
2. Expected profit: 5 − 10 = **−₹5** per game. Over 100 games you expect to lose about ₹500.

**Variance of a random variable** measures spread around the expected value: Var(X) = E[(X − E[X])²] = E[X²] − (E[X])².

For a die: E[X²] = (1 + 4 + 9 + 16 + 25 + 36) ÷ 6 = 91 ÷ 6 ≈ 15.17, so Var = 15.17 − 3.5² = 15.17 − 12.25 ≈ **2.92**.

Useful rules:

- E[aX + b] = a·E[X] + b
- E[X + Y] = E[X] + E[Y] (always, even if not independent)
- Var(aX + b) = a²·Var(X)
- Var(X + Y) = Var(X) + Var(Y) only if X and Y are independent

```python
values = np.array([0, 50])
probs = np.array([0.9, 0.1])
print(values @ probs - 10)          # expected profit  Output: -5.0

die = np.arange(1, 7)
print(die.mean(), die.var())        # Output: 3.5 2.9166666666666665
```

**Where in ML:**

- A **loss function** is the expected error over the data. Training minimizes the average loss on the training set, an estimate of the expected loss on new data.
- **Cross-entropy loss** is the expected value of −log(predicted probability of the true class).
- In reinforcement learning, an agent maximizes **expected** future reward.
- In product decisions: expected revenue of showing an ad = P(click) × revenue per click.

## Probability distributions over classes

A **probability distribution** lists every possible outcome with its probability, and the probabilities add to 1. A classifier for 3 classes might output:

```text
P(cat) = 0.7, P(dog) = 0.2, P(bird) = 0.1      (sum = 1.0)
```

Neural networks produce raw scores called **logits**, which can be any numbers. The **softmax** function turns them into a distribution: take e to the power of each score, then divide by the total.

**Worked example.** Logits [2, 1, 0].

1. e² ≈ 7.389, e¹ ≈ 2.718, e⁰ = 1
2. Total ≈ 7.389 + 2.718 + 1 = 11.107
3. Probabilities ≈ [7.389, 2.718, 1] ÷ 11.107 ≈ **[0.665, 0.245, 0.090]**

```python
def softmax(z):
    z = z - z.max()               # subtract the max for numerical safety
    e = np.exp(z)
    return e / e.sum()

print(softmax(np.array([2.0, 1.0, 0.0])).round(3))   # Output: [0.665 0.245 0.09 ]
```

An LLM does exactly this over its whole vocabulary (often 100,000+ tokens) for every token it generates. See [Generation Settings and the Context Window](/interview/ai-engineer/llms-genai/generation-settings-and-the-context-window).

## Why ML uses log-probabilities

The probability of a whole sentence is the product of the probabilities of each token. Multiplying many small numbers quickly gives a number too small for the computer: 0.001²⁰⁰ = 10⁻⁶⁰⁰, but a 64-bit float cannot go below about 10⁻³⁰⁸, so it becomes 0. This is called **underflow**.

The fix: use **logarithms**. log(a × b) = log a + log b, so the product becomes a sum, which is safe:

```text
log(0.001²⁰⁰) = 200 × log(0.001) = 200 × (−6.908) ≈ −1381.6
```

```python
print(0.001 ** 200)              # Output: 0.0   (underflow)
print(200 * np.log(0.001))       # Output: -1381.5510557964274
```

Since log is increasing, the biggest probability also has the biggest log-probability, so maximizing one is the same as maximizing the other. This is why loss functions use **negative log-likelihood** and why LLM APIs return "logprobs".

> **Remember:** Products of probabilities → sums of log-probabilities. Maximizing likelihood = minimizing negative log-likelihood = minimizing cross-entropy.

## Key terms

| Term | Simple meaning |
|---|---|
| Probability | A number from 0 to 1 for how likely an event is |
| Experiment | Something with an uncertain result |
| Sample space | All possible results |
| Event | A set of results you care about |
| Law of large numbers | With more repeats, the frequency approaches the true probability |
| Complement | "Not A"; P(not A) = 1 − P(A) |
| Mutually exclusive | Cannot happen together |
| Joint probability | P(A and B) |
| Marginal probability | P(A) alone, from the row or column totals |
| Conditional probability | P(A \| B), chance of A when B is known to have happened |
| Independent events | Knowing one does not change the chance of the other |
| i.i.d. | Independent and identically distributed data points |
| Bayes' theorem | P(A \| B) = P(B \| A)P(A) ÷ P(B) |
| Prior | Belief before seeing the evidence |
| Likelihood | P(evidence \| hypothesis) |
| Posterior | Belief after seeing the evidence |
| Law of total probability | P(B) = sum of P(B \| case) × P(case) over all cases |
| Base rate neglect | Ignoring how rare something is to begin with |
| Sensitivity | P(test positive \| sick); same as recall |
| False positive rate | P(test positive \| healthy) |
| Naive Bayes | Classifier that multiplies word likelihoods assuming independence |
| Random variable | A number whose value depends on chance |
| Expected value | Long-run average: Σ value × probability |
| Probability distribution | All outcomes with probabilities that add to 1 |
| Logits | Raw model scores before softmax |
| Softmax | Turns scores into probabilities that sum to 1 |
| Underflow | A number too small for the computer, rounded to 0 |
| Log-probability | log of a probability; products become sums |

## Interview questions

**A disease affects 1 in 1,000 people. A test has 99% sensitivity and a 1% false positive rate. You test positive. What is the chance you are sick?**
Imagine 100,000 people: 100 sick, 99 of them test positive; 99,900 healthy, 1% = 999 test positive. P(sick | +) = 99 ÷ (99 + 999) = 99 ÷ 1098 ≈ 9%. The disease is so rare that false positives outnumber true positives.

**What is the difference between P(A | B) and P(A and B)?**
P(A and B) is the chance both happen, out of everything. P(A | B) is the chance of A only among the cases where B happened, so it equals P(A and B) ÷ P(B). For example, P(clothing and returned) = 0.12 but P(returned | clothing) = 0.2.

**What does independence mean? Give an ML example where it is assumed.**
A and B are independent if P(A and B) = P(A) × P(B), so knowing one tells nothing about the other. Naive Bayes assumes features are independent given the class. Most training also assumes data points are i.i.d.

**Are mutually exclusive events independent?**
No (unless one has probability 0). If A and B cannot happen together, then knowing A happened tells you B definitely did not, which is strong dependence. P(A and B) = 0, but P(A) × P(B) > 0.

**Explain prior, likelihood and posterior.**
The prior is what you believe before seeing data. The likelihood is how probable the observed data is under each hypothesis. The posterior is your updated belief after the data, proportional to prior × likelihood. Bayes' theorem connects them.

**What is the expected value of rolling two dice and adding them?**
E[sum] = E[die 1] + E[die 2] = 3.5 + 3.5 = 7. Expectation adds even without independence.

**Why do models work with log-probabilities instead of probabilities?**
Multiplying many probabilities underflows to zero. Logs turn products into sums, which are numerically stable and easier to differentiate. Because log is increasing, maximizing the log-likelihood gives the same answer as maximizing the likelihood.

**What does softmax do, and why subtract the max first?**
It turns any real-valued scores into positive probabilities that add to 1, using e^z divided by the sum. Subtracting the max does not change the result (it cancels in the ratio) but prevents e^z from overflowing for large scores.

**How does Bayes' theorem relate to precision and recall?**
Recall is P(predicted positive | actually positive), like sensitivity. Precision is P(actually positive | predicted positive), like the posterior. Bayes shows that precision depends on the base rate: for rare classes, even a high-recall, low-false-positive model can have low precision.

**You flip a fair coin 3 times. What is P(at least one head)?**
1 − P(no heads) = 1 − 0.5³ = 1 − 0.125 = 0.875.

**What is the gambler's fallacy?**
Believing that past independent outcomes change the next one, like "tails is due after 5 heads". Independent events have no memory, so the probability stays 0.5.

## Try it yourself

1. From the Flipkart table, compute P(Electronics | Returned) and check that P(Electronics | Returned) + P(Clothing | Returned) = 1. *Hint:* look at the Returned column only.
2. A fraud model flags 95% of fraud (recall) and wrongly flags 2% of normal transactions. Fraud is 0.5% of transactions. What fraction of flagged transactions are really fraud? *Hint:* imagine 100,000 transactions.
3. Write a function `naive_bayes(prior_spam, word_probs_spam, word_probs_ham)` that returns P(spam | words) given lists of word likelihoods. Use log-probabilities. *Hint:* sum the logs, then convert back with `np.exp` and normalize.
4. A delivery is on time with probability 0.8. For 3 independent deliveries, what is P(all on time) and P(at least one late)? *Hint:* multiplication rule, then complement.

### Answers

1. P(Electronics | Returned) = 40 ÷ 160 = **0.25**. 0.25 + 0.75 = 1.
2. Fraud: 500, flagged 0.95 × 500 = 475. Normal: 99,500, flagged 0.02 × 99,500 = 1,990. Precision = 475 ÷ (475 + 1990) = 475 ÷ 2465 ≈ **0.193**, about 19%.
3. Solution:

```python
import numpy as np

def naive_bayes(prior_spam, word_probs_spam, word_probs_ham):
    log_spam = np.log(prior_spam) + np.sum(np.log(word_probs_spam))
    log_ham = np.log(1 - prior_spam) + np.sum(np.log(word_probs_ham))
    m = max(log_spam, log_ham)                       # avoid overflow when exponentiating
    s, h = np.exp(log_spam - m), np.exp(log_ham - m)
    return s / (s + h)

print(round(naive_bayes(0.3, [0.4, 0.3], [0.05, 0.02]), 3))   # Output: 0.981
```

4. P(all on time) = 0.8³ = **0.512**. P(at least one late) = 1 − 0.512 = **0.488**.

**Next:** [Distributions and Statistics](/interview/ai-engineer/math-for-ml/distributions-and-statistics)
