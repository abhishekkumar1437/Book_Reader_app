---
title: What Is Machine Learning
part: Foundations
summary: Why we let computers learn from data instead of writing rules, the three kinds of learning, regression versus classification, the full ML workflow, and the vocabulary (features, labels, train, test) that every later chapter uses.
---

This chapter gives you the mental model for everything else in the book. You will learn what "learning" means for a computer, which kinds of problems machine learning solves, and the step-by-step workflow that every real ML project follows. As an AI engineer, you will use this vocabulary every day: in design discussions, in code reviews, and in the first ten minutes of almost every ML interview.

> **In simple words:** Normal programming = you write the rules. Machine learning = you give the computer many examples with answers, and it finds the rules by itself. Then it uses those rules on new examples it has never seen.

## Rules versus learning

Imagine you must build a spam filter for an email app. The first idea is to write rules by hand:

```python
def is_spam(email: str) -> bool:
    text = email.lower()
    if "lottery" in text or "free money" in text:
        return True
    if text.count("!") > 5:
        return True
    return False
```

This works for a week. Then spammers write "fr33 m0ney" and "l0ttery". You add more rules. Soon you have 500 rules, they conflict with each other, and nobody knows which rule blocks which genuine email. Rules are hard to write when the pattern is fuzzy, when it changes over time, or when there are too many cases for a human to list.

**Machine learning (ML)** is a different approach. You collect thousands of emails that people already marked as "spam" or "not spam". You give these examples to an algorithm. The algorithm looks for patterns that separate the two groups and stores them as numbers. This stored set of numbers is called a **model**. When a new email arrives, the model uses the patterns to make a guess. This guess is called a **prediction**.

<figure>
<svg viewBox="0 0 420 190" width="420" height="190" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<text x="10" y="20" fill="currentColor" stroke="none" font-weight="bold">Traditional programming</text>
<rect x="10" y="30" width="80" height="34" rx="6" />
<text x="50" y="52" text-anchor="middle" fill="currentColor" stroke="none">Rules</text>
<rect x="10" y="70" width="80" height="34" rx="6" />
<text x="50" y="92" text-anchor="middle" fill="currentColor" stroke="none">Data</text>
<line x1="90" y1="67" x2="140" y2="67" /><polygon points="140,62 150,67 140,72" fill="currentColor" />
<rect x="150" y="50" width="90" height="34" rx="6" />
<text x="195" y="72" text-anchor="middle" fill="currentColor" stroke="none">Program</text>
<line x1="240" y1="67" x2="290" y2="67" /><polygon points="290,62 300,67 290,72" fill="currentColor" />
<text x="305" y="72" fill="currentColor" stroke="none">Answers</text>
<text x="10" y="125" fill="var(--accent)" stroke="none" font-weight="bold">Machine learning</text>
<rect x="10" y="135" width="80" height="22" rx="6" />
<text x="50" y="151" text-anchor="middle" fill="currentColor" stroke="none">Data</text>
<rect x="10" y="162" width="80" height="22" rx="6" />
<text x="50" y="178" text-anchor="middle" fill="currentColor" stroke="none">Answers</text>
<line x1="90" y1="159" x2="140" y2="159" /><polygon points="140,154 150,159 140,164" fill="currentColor" />
<rect x="150" y="142" width="90" height="34" rx="6" stroke="var(--accent)" />
<text x="195" y="164" text-anchor="middle" fill="currentColor" stroke="none">Learning</text>
<line x1="240" y1="159" x2="290" y2="159" /><polygon points="290,154 300,159 290,164" fill="currentColor" />
<text x="305" y="164" fill="var(--accent)" stroke="none">Rules (model)</text>
</svg>
<figcaption>In normal programming you give rules and get answers; in machine learning you give examples with answers and get the rules.</figcaption>
</figure>

> **Real-life example:** A child learns what a "dog" is not from a definition, but from seeing many dogs and being told "dog" each time. After enough examples, the child recognises a breed it has never seen. ML works the same way: many labelled examples, then generalisation to new ones.

### When ML is the right tool

Use ML when:

- The pattern is real but hard to write as rules (spam, faces, fraud, speech).
- The pattern changes over time and the model can be retrained (fraud tricks, user taste).
- You have enough examples, ideally with correct answers.
- A small error rate is acceptable (a recommendation can be wrong sometimes).

Do **not** use ML when a simple rule is exact and stable. "GST = 18% of price" is a formula, not an ML problem. "Is the PIN code 6 digits?" is a rule. Interviewers like candidates who say "a rule or a SQL query would do this; ML is not needed".

> **Interview tip:** When asked "how would you solve X with ML?", first ask: is there labelled data, what is the cost of a wrong prediction, and is there a simple baseline (a rule or the average)? This shows engineering judgement, not just algorithm knowledge.

## What "learning" really means

A model is a function with adjustable numbers inside. These adjustable numbers are called **parameters** (or **weights**). Learning means finding parameter values that make the function's outputs close to the true answers on the examples. This search is called **training** or **fitting**.

### A tiny worked example

You have three flats sold in one area of Pune:

| Area (sq ft) | Price (₹ lakh) |
|---|---|
| 1000 | 50 |
| 1500 | 75 |
| 2000 | 100 |

Suppose your model is `price = w × area`, with one parameter `w`.

1. Try `w = 0.04`: predictions are 40, 60, 80. Each is too low by 10, 15, 20.
2. Try `w = 0.06`: predictions are 60, 90, 120. Each is too high by 10, 15, 20.
3. Try `w = 0.05`: predictions are 50, 75, 100. Errors are 0, 0, 0.

So training "learns" `w = 0.05` (₹5,000 per sq ft). Now a new flat of 1200 sq ft arrives. The prediction is 0.05 × 1200 = **₹60 lakh**. The model was never shown a 1200 sq ft flat, but it gave a sensible answer. This ability to work on new examples is called **generalisation**, and it is the whole point of ML.

Real models have thousands or billions of parameters, and real data is noisy, so the errors never become exactly zero. The computer searches for parameters automatically using methods such as gradient descent (see [Gradient Descent and Loss Functions](/interview/machine-learning/gradient-descent-and-loss-functions)).

### Parameters versus hyperparameters

- **Parameters** are learned from data during training. Example: `w` above, the weights of a linear model, the split points in a decision tree.
- **Hyperparameters** are settings you choose **before** training. Example: how deep a tree may grow, how many neighbours KNN uses, the learning rate. You choose them by trying values and checking results (see [Pipelines and Hyperparameter Tuning](/interview/machine-learning/pipelines-and-hyperparameter-tuning)).

> **Common mistake:** Saying "the model learns the learning rate". It does not. The learning rate is a hyperparameter you set; the weights are what the model learns.

## The vocabulary you need

Here is one small dataset of Flipkart customers, used to predict whether a customer will stop using the app (this is called **churn**).

| customer_id | age | orders_last_90d | avg_order_₹ | city | churned |
|---|---|---|---|---|---|
| 101 | 24 | 12 | 850 | Delhi | 0 |
| 102 | 41 | 1 | 2300 | Patna | 1 |
| 103 | 33 | 5 | 1200 | Pune | 0 |
| 104 | 29 | 0 | 0 | Delhi | 1 |

- Each **row** is one **sample** (also called an example, instance, observation, or data point).
- Each input **column** (age, orders, avg order, city) is a **feature**. Features are the information the model uses. People also call them inputs, attributes, predictors, or independent variables. We usually write the feature table as **X**.
- The column we want to predict (`churned`) is the **label** or **target**, written **y**.
- `customer_id` is an identifier. It is **not** a useful feature, because it carries no real meaning. Including it can even let the model memorise rows.
- **Numerical** features are numbers (age). **Categorical** features are groups (city). Most algorithms need categories turned into numbers first (see [Data Preparation and Feature Engineering](/interview/machine-learning/data-preparation-and-feature-engineering)).

The shape of X is written as `(n_samples, n_features)`. For the table above, X has shape (4, 4) and y has shape (4,).

### Train set and test set

If you test a student with the exact questions they practised, a high score proves nothing. They might have memorised the answers. The same is true for models.

So we split the data:

- **Training set** (often 70–80%): the model learns from this.
- **Test set** (often 20–30%): kept hidden during training, used once at the end to estimate how the model will do on new data.
- Often a third part, the **validation set**, is used to choose hyperparameters, so that the test set stays truly unseen.

When a model is excellent on training data but poor on test data, it has memorised instead of learned. This is called **overfitting**. When it is poor on both, it is too simple; this is called **underfitting**. Chapter 12 covers both in depth: [Overfitting, Regularization and Cross-Validation](/interview/machine-learning/overfitting-regularization-and-cross-validation).

> **Remember:** The test set is like the final board exam. You look at it once, at the very end. If you keep tuning the model until the test score looks good, the test score is no longer honest.

## The three kinds of learning

### Supervised learning

Every training example has the correct answer (label). The model learns the mapping from features to label. Examples: spam/not spam, house price, loan default, disease from an X-ray. Most business ML is supervised. Chapters 3–8 of this book are supervised algorithms.

### Unsupervised learning

There are no labels. The model looks for structure in the data by itself. Examples:

- **Clustering**: group customers with similar shopping habits ([Clustering: K-Means and DBSCAN](/interview/machine-learning/clustering-kmeans-and-dbscan)).
- **Dimensionality reduction**: compress 100 features into 2 for a plot ([Dimensionality Reduction and PCA](/interview/machine-learning/dimensionality-reduction-pca)).
- **Anomaly detection**: find unusual UPI transactions without knowing in advance which ones are fraud.

### Reinforcement learning

An **agent** takes **actions** in an **environment** and receives **rewards** or penalties. It learns a strategy (called a **policy**) that collects the most reward over time. Examples: game-playing programs, robot control, and the RLHF step that makes chatbots helpful (see [The LLM Training Pipeline](/interview/llms-genai/the-llm-training-pipeline)). There is no fixed label for each step; the feedback comes later, as reward.

### Self-supervised learning (the one behind LLMs)

The labels are created automatically from the data itself. A language model reads "The cat sat on the ___" and the hidden next word "mat" is the label. No human labelling is needed, so the model can learn from huge amounts of text. Technically it is supervised learning with automatic labels. See [How LLMs Work](/interview/llms-genai/how-llms-work).

| Type | Has labels? | Goal | Example |
|---|---|---|---|
| Supervised | Yes | Predict the label | Loan default yes/no |
| Unsupervised | No | Find structure | Customer segments |
| Reinforcement | Reward signal | Learn actions | Game playing, RLHF |
| Self-supervised | Made from the data | Learn general patterns | Next-word prediction in LLMs |
| Semi-supervised | A few labels + many unlabelled | Use both | 1,000 labelled X-rays + 100,000 unlabelled |

## Regression versus classification

Supervised problems come in two main types, based on what the label looks like.

- **Regression**: the label is a continuous number. Examples: house price (₹62.5 lakh), delivery time (34 minutes), tomorrow's temperature.
- **Classification**: the label is a category. Examples: spam / not spam (**binary classification**, two classes), the digit 0–9 in an image (**multiclass classification**), the set of tags on a movie (**multilabel classification**, many labels at once).

| Question | Type |
|---|---|
| How many runs will a team score? | Regression |
| Will the team win? | Binary classification |
| Which of 10 teams will win the IPL? | Multiclass classification |
| What will a customer spend next month in ₹? | Regression |
| Is this UPI payment fraud? | Binary classification |

> **Common mistake:** Thinking "the output is a number, so it is regression". If the number is a category code (city 1, 2, 3 or rating class 1–5 treated as groups), it is classification. Also, many classifiers output a **probability** (0.83) — that is still classification, because the final answer is a class.

## The ML workflow

Every real project follows roughly the same loop. Interviewers often ask "walk me through how you would build a model for X". Use these steps.

<figure>
<svg viewBox="0 0 440 200" width="440" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="5" y="20" width="95" height="40" rx="8" /><text x="52" y="38" text-anchor="middle" fill="currentColor" stroke="none">1. Define</text><text x="52" y="53" text-anchor="middle" fill="currentColor" stroke="none">problem</text>
<rect x="115" y="20" width="95" height="40" rx="8" /><text x="162" y="38" text-anchor="middle" fill="currentColor" stroke="none">2. Collect</text><text x="162" y="53" text-anchor="middle" fill="currentColor" stroke="none">data</text>
<rect x="225" y="20" width="95" height="40" rx="8" /><text x="272" y="38" text-anchor="middle" fill="currentColor" stroke="none">3. Explore</text><text x="272" y="53" text-anchor="middle" fill="currentColor" stroke="none">(EDA)</text>
<rect x="335" y="20" width="100" height="40" rx="8" /><text x="385" y="38" text-anchor="middle" fill="currentColor" stroke="none">4. Prepare</text><text x="385" y="53" text-anchor="middle" fill="currentColor" stroke="none">features</text>
<line x1="100" y1="40" x2="112" y2="40" /><line x1="210" y1="40" x2="222" y2="40" /><line x1="320" y1="40" x2="332" y2="40" />
<line x1="385" y1="60" x2="385" y2="112" /><polygon points="380,108 385,118 390,108" fill="currentColor" />
<rect x="335" y="120" width="100" height="40" rx="8" /><text x="385" y="138" text-anchor="middle" fill="currentColor" stroke="none">5. Train</text><text x="385" y="153" text-anchor="middle" fill="currentColor" stroke="none">models</text>
<rect x="225" y="120" width="95" height="40" rx="8" stroke="var(--accent)" /><text x="272" y="138" text-anchor="middle" fill="currentColor" stroke="none">6. Evaluate</text><text x="272" y="153" text-anchor="middle" fill="currentColor" stroke="none">&amp; tune</text>
<rect x="115" y="120" width="95" height="40" rx="8" /><text x="162" y="138" text-anchor="middle" fill="currentColor" stroke="none">7. Deploy</text>
<rect x="5" y="120" width="95" height="40" rx="8" /><text x="52" y="138" text-anchor="middle" fill="currentColor" stroke="none">8. Monitor</text><text x="52" y="153" text-anchor="middle" fill="currentColor" stroke="none">&amp; retrain</text>
<line x1="335" y1="140" x2="323" y2="140" /><line x1="225" y1="140" x2="213" y2="140" /><line x1="115" y1="140" x2="103" y2="140" />
<path d="M 272 120 C 272 95, 385 95, 385 62" stroke="var(--accent)" stroke-dasharray="4 3" />
<path d="M 52 160 C 52 190, 162 190, 162 62" stroke-dasharray="4 3" />
<text x="300" y="100" fill="var(--accent)" stroke="none" font-size="11">iterate</text>
<text x="70" y="192" fill="currentColor" stroke="none" font-size="11">new data</text>
</svg>
<figcaption>The ML workflow is a loop: evaluation sends you back to feature work, and monitoring in production sends you back to collecting data.</figcaption>
</figure>

1. **Define the problem.** What decision will the prediction support? Regression or classification? What metric matters (for fraud, catching fraud matters more than overall accuracy)? What is the simple baseline?
2. **Collect data.** From databases (SQL), logs, APIs, or labelling. Check that the label really exists at prediction time.
3. **Explore the data (EDA).** **Exploratory data analysis** means looking at distributions, missing values, outliers and correlations before modelling.
4. **Prepare features.** Clean, fill missing values, encode categories, scale numbers, create new features.
5. **Train models.** Start with a simple baseline (logistic regression, a small tree), then try stronger ones (random forest, gradient boosting).
6. **Evaluate and tune.** Use the right metric on validation data, tune hyperparameters, then check the test set once.
7. **Deploy.** Put the model behind an API so other systems can call it (see [What Is MLOps](/interview/mlops-deployment/what-is-mlops)).
8. **Monitor and retrain.** Real-world data changes (this is called **drift**). Track performance and retrain when it drops.

> **Real-life example:** Building a model is like cooking for a wedding. Buying vegetables (data) and cutting them (preparation) take most of the time; the actual cooking (training) is short. Data work is often 60–80% of a real ML project.

### A first scikit-learn program

**scikit-learn** (imported as `sklearn`) is the standard Python library for classical ML. Every model in it has the same simple interface: `fit` to learn, `predict` to use. Here is the full workflow on a real built-in dataset of breast tumour measurements (569 samples, 30 features, label = malignant or benign).

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.dummy import DummyClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# 1. Load data: X is a table of features, y is the label (0 = malignant, 1 = benign)
X, y = load_breast_cancer(return_X_y=True, as_frame=True)
print(X.shape, y.shape)            # (569, 30) (569,)

# 2. Split: 80% train, 20% test. stratify keeps the class ratio the same in both parts
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# 3. Baseline: always predict the most common class
baseline = DummyClassifier(strategy="most_frequent").fit(X_train, y_train)
print("baseline:", accuracy_score(y_test, baseline.predict(X_test)))

# 4. Real model: learn from the training set only
model = DecisionTreeClassifier(max_depth=3, random_state=42)
model.fit(X_train, y_train)

# 5. Evaluate on data the model has never seen
print("tree:", accuracy_score(y_test, model.predict(X_test)))
```

```text
(569, 30) (569,)
baseline: 0.62...   (about 62-63%)
tree: 0.93...       (about 92-95%; the exact value depends on the split)
```

The baseline gets about 62% just by always saying "benign", because 62.7% of the samples are benign. The tree must beat this to be useful. Always print a baseline.

> **Interview tip:** Saying "first I would build a dumb baseline" is a strong signal. It shows you know that 95% accuracy can be worthless if 95% of rows belong to one class.

## AI, ML and deep learning

These words are often mixed up.

- **Artificial intelligence (AI)**: the broad goal of making machines do tasks that need intelligence. Includes old rule-based expert systems.
- **Machine learning**: a part of AI where the system learns from data.
- **Deep learning**: a part of ML that uses neural networks with many layers. It is best for images, audio, and text (see [From Neuron to Neural Network](/interview/deep-learning/from-neuron-to-neural-network)).
- **Generative AI**: models that create new content (text, images, code), such as large language models.

| | Classical ML (this book) | Deep learning |
|---|---|---|
| Best data type | Tables (rows and columns) | Images, audio, text |
| Data needed | Hundreds to millions of rows | Usually much more |
| Feature engineering | Done by you | Mostly learned by the network |
| Hardware | CPU is fine | GPU usually needed |
| Explainability | Often easier | Harder |
| Typical models | Linear models, trees, gradient boosting | CNNs, Transformers |

Even in the age of LLMs, classical ML is everywhere: credit scoring, fraud detection, demand forecasting, ranking, and churn prediction mostly use gradient-boosted trees on tables. An AI engineer is expected to know both.

## Key terms

| Term | Simple meaning |
|---|---|
| Machine learning | Computers learning patterns from examples instead of hand-written rules |
| Model | A function with learned numbers inside that turns inputs into predictions |
| Prediction | The model's output for one input |
| Parameters / weights | Numbers the model learns during training |
| Hyperparameters | Settings you choose before training (depth, learning rate, k) |
| Training / fitting | Adjusting parameters so predictions match the known answers |
| Inference | Using a trained model to predict on new data |
| Generalisation | Doing well on new, unseen data |
| Sample / row | One example in the dataset |
| Feature (X) | An input column the model uses |
| Label / target (y) | The answer column the model predicts |
| Training / validation / test set | Data for learning / for choosing settings / for the final honest check |
| Overfitting | Memorising training data; poor on new data |
| Underfitting | Too simple; poor even on training data |
| Supervised learning | Learning from labelled examples |
| Unsupervised learning | Finding structure without labels |
| Reinforcement learning | Learning actions from rewards |
| Self-supervised learning | Labels created automatically from the data (next word) |
| Regression | Predicting a continuous number |
| Classification | Predicting a category (binary, multiclass, multilabel) |
| EDA | Exploratory data analysis: studying the data before modelling |
| Baseline | A very simple model to beat (most frequent class, the mean) |
| Drift | Real-world data changing after deployment |

## Interview questions

**What is machine learning, in one or two sentences?**
Machine learning is a way to build software that learns patterns from examples instead of following hand-written rules. We give it data (and usually the correct answers), it fits parameters so its predictions match, and then it uses those patterns on new data.

**What is the difference between supervised and unsupervised learning?**
In supervised learning every training example has a label, and the model learns to predict that label — like price prediction or spam detection. In unsupervised learning there are no labels, and the model finds structure on its own, such as clusters of similar customers or a lower-dimensional view of the data.

**Regression or classification: predicting a customer's credit score bucket (Poor/Fair/Good/Excellent)?**
It is classification, because the output is one of four categories. Since the categories have an order, it is called ordinal classification; some teams model it as regression on a 1–4 scale and round, but the standard answer is multiclass classification.

**Why do we need a separate test set?**
Because the model has already seen the training data, its score there is too optimistic — it may have memorised rows. A held-out test set, never used for training or tuning, gives an honest estimate of performance on new data.

**What is the difference between a parameter and a hyperparameter?**
Parameters are learned from data during training, such as the weights of linear regression. Hyperparameters are chosen by us before training, such as tree depth, the number of neighbours in KNN, or the learning rate. We tune hyperparameters using validation data or cross-validation.

**What is overfitting and how do you detect it?**
Overfitting is when a model fits noise in the training data and does not generalise. You detect it when training performance is much better than validation or test performance — for example 99% train accuracy and 75% validation accuracy.

**Walk me through the steps of an ML project.**
Define the problem and success metric, collect data, explore it, clean and engineer features, build a simple baseline, train stronger models, evaluate and tune on validation data, check the test set once, deploy behind an API, then monitor for drift and retrain. Most of the time goes into the data steps.

**When should you NOT use machine learning?**
When a simple, exact rule exists (tax calculation, format validation), when there is too little data, when mistakes are unacceptable and cannot be checked, or when the decision must be fully explainable and a rule already works. A baseline rule should always be compared first.

**How is the training of an LLM related to supervised learning?**
LLM pretraining is self-supervised: the label for each position is simply the next token in the text, so labels come for free. Mathematically it is supervised classification over the vocabulary, but no human labelling is needed. Later steps such as instruction tuning use human-written examples, and RLHF uses reinforcement learning.

**Why is classical ML still relevant when deep learning exists?**
For tabular business data — transactions, customers, loans — gradient-boosted trees are usually as accurate as or more accurate than neural networks, train in minutes on a CPU, need less data, and are easier to explain. Deep learning wins on images, audio and text.

## Try it yourself

1. **Classify the problems.** For each, write regression / binary / multiclass / unsupervised: (a) predict the number of IRCTC tickets booked tomorrow, (b) group songs by sound with no genre tags, (c) detect if a cricket ball was a no-ball from video, (d) predict which of 5 departments an email should go to.
   *Hint: look at what the label looks like, or whether there is a label at all.*
2. **Learn a parameter by hand.** Three bike rides: 10 km took 30 min, 20 km took 60 min, 5 km took 15 min. Using the model `time = w × distance`, find `w` and predict the time for 12 km.
   *Hint: try a few values of w and check the errors.*
3. **Baseline check.** A fraud dataset has 10,000 payments, 50 of them fraud. What accuracy does "always predict not fraud" get? Is a model with 99.4% accuracy good?
   *Hint: compute the baseline first.*
4. **Run the code.** Run the breast-cancer example above with `max_depth=1`, `3` and `None`. Print both training and test accuracy each time.
   *Hint: use `model.score(X_train, y_train)` and `model.score(X_test, y_test)`.*

### Answers

1. (a) regression, (b) unsupervised (clustering), (c) binary classification, (d) multiclass classification.
2. `w = 3` minutes per km (30/10 = 60/20 = 15/5 = 3). Prediction for 12 km = 3 × 12 = 36 minutes.
3. Baseline accuracy = 9,950 / 10,000 = 99.5%. A model with 99.4% is **worse** than doing nothing. Accuracy is the wrong metric here; use recall, precision and PR-AUC (see [Evaluation Metrics](/interview/machine-learning/evaluation-metrics)).
4. With `max_depth=None` the training accuracy becomes 1.0 (perfect memorisation) while test accuracy is often no better than depth 3 — a first sight of overfitting. Depth 1 is lower on both — underfitting.

**Next:** [Data Preparation and Feature Engineering](/interview/machine-learning/data-preparation-and-feature-engineering)
