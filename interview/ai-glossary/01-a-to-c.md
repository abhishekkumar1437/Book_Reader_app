---
title: A to C
part: Glossary
summary: Terms from A/B Testing to Curse of Dimensionality, covering optimizers, attention, agents, backpropagation, chunking, CNNs, cross-validation and more.
---

How to use this glossary: scan the index table for a quick reminder, then open the full entry for the meaning, an example, and the chapter that teaches the idea in depth. Terms that start with a number or symbol are listed under the nearest letter.

| Term | One-line meaning |
|---|---|
| A/B Testing | Show two versions to two random groups and compare a metric |
| Accuracy | Share of all predictions that are correct |
| Activation Function | Non-linear function applied to a neuron's output |
| AdaBoost (Adaptive Boosting) | Boosting that up-weights the examples earlier models got wrong |
| Adam (Adaptive Moment Estimation) | Optimizer with momentum plus a per-weight learning rate |
| AdamW | Adam with weight decay applied separately from the gradient |
| Agent (AI Agent) | An LLM in a loop that chooses and calls tools until a goal is done |
| Agentic RAG | RAG where an agent decides when and what to retrieve |
| Alignment | Making a model behave as people intend: helpful, honest, harmless |
| Anomaly Detection | Finding data points that are very unusual |
| ANN (Approximate Nearest Neighbor) | Fast vector search that returns almost-exact closest matches |
| API (Application Programming Interface) | A defined way for one program to call another |
| Attention | Mechanism that lets each token weigh information from other tokens |
| Attention Mask | A 0/1 list telling the model which tokens to ignore |
| AUC (Area Under the Curve) | Area under the ROC curve; 1.0 is perfect, 0.5 is random |
| Autoencoder | Network that compresses input and then rebuilds it |
| Autograd | PyTorch's automatic gradient calculator |
| Autoregressive Model | Model that generates one token at a time, using its own past output |
| Autoscaling | Adding or removing servers automatically based on load |
| Backpropagation | Chain-rule method to compute every weight's gradient |
| Bag of Words | Text represented by word counts, ignoring order |
| Bagging (Bootstrap Aggregating) | Train many models on random resamples and average them |
| Batch | A group of examples processed together in one step |
| Batch Inference | Running predictions on many inputs at once, offline |
| Batch Normalization | Normalizing a layer's outputs across the batch |
| Batch Size | How many examples are in one batch |
| Bayes' Theorem | Rule to update a probability after seeing evidence |
| Beam Search | Decoding that keeps the best few partial outputs at each step |
| BERT (Bidirectional Encoder Representations from Transformers) | Encoder-only Transformer pretrained by filling in masked words |
| Bernoulli Distribution | Distribution of one yes/no trial |
| Bias (Neuron) | The constant added to a neuron's weighted sum |
| Bias (Model Error) | Error from a model being too simple |
| Bias-Variance Trade-off | Balance between too simple and too sensitive models |
| Binomial Distribution | Number of successes in n yes/no trials |
| BLEU (Bilingual Evaluation Understudy) | Score of n-gram overlap with a reference text |
| Blue-Green Deployment | Two identical environments; switch all traffic at once |
| BM25 (Best Matching 25) | Classic keyword ranking formula used by search engines |
| BPE (Byte-Pair Encoding) | Subword tokenizer that merges the most frequent pairs |
| Broadcasting | NumPy/PyTorch rule that stretches smaller arrays to match shapes |
| Canary Deployment | Send a small share of traffic to the new version first |
| CatBoost | Gradient boosting library that handles categorical features well |
| Causal Masking | Hiding future tokens so a decoder only looks backward |
| CBOW (Continuous Bag of Words) | Word2Vec variant that predicts a word from its neighbours |
| Central Limit Theorem | Averages of many samples look normally distributed |
| Chain Rule | Derivative of a function inside a function |
| Chain-of-Thought (CoT) | Asking the model to reason step by step before answering |
| Chunk Overlap | Repeating some text between neighbouring chunks |
| Chunking | Splitting documents into smaller pieces for retrieval |
| CI/CD (Continuous Integration / Continuous Delivery) | Automatic testing and release on every code change |
| Class Imbalance | One class is much rarer than the others |
| Classification | Predicting a category |
| Clustering | Grouping similar items without labels |
| CNN (Convolutional Neural Network) | Network that slides small filters over images |
| Collaborative Filtering | Recommending items liked by similar users |
| Concept Drift | The relationship between inputs and the answer changes over time |
| Confidence Interval | A range likely to contain the true value |
| Confusion Matrix | Table of true/false positives and negatives |
| Constitutional AI | Training a model to follow a written list of principles |
| Container | A running, isolated package of an app and its dependencies |
| Content Filter | A check that blocks harmful input or output |
| Context Precision | Share of retrieved chunks that are actually relevant |
| Context Recall | Share of needed facts that the retrieved chunks contain |
| Context Window | Maximum tokens a model can read and write in one call |
| Contextual Embedding | Word vector that changes with the surrounding sentence |
| Contextual Retrieval | Adding a short document-level context to each chunk before indexing |
| Continuous Batching | Serving trick that adds and removes requests from a running batch |
| Correlation | How strongly two variables move together |
| Cosine Similarity | Similarity of two vectors by the angle between them |
| Cross-Encoder | Model that reads query and document together to score relevance |
| Cross-Entropy Loss | Loss that punishes low probability on the correct class |
| Cross-Validation | Rotating which part of the data is used for validation |
| CUDA (Compute Unified Device Architecture) | NVIDIA's platform for running code on GPUs |
| Curse of Dimensionality | With many features, data becomes sparse and distances lose meaning |

## A

### A/B Testing

You show version A to one random group of users and version B to another, then compare a metric to see which is better. Randomness makes the comparison fair.

**Example:** 10,000 users see the old RAG prompt and 10,000 see the new one. Thumbs-up rate is 61% vs 64%. A significance test tells you whether the 3-point gap is real or just luck.

**Don't confuse with:** offline evaluation on a fixed test set. A/B testing uses real live users.

**Learn more:** [Distributions and Statistics](/interview/math-for-ml/distributions-and-statistics)

### Accuracy

The share of all predictions that are correct: (TP + TN) ÷ total.

**Example:** 1,000 transactions, the model gets 970 right → accuracy = 970 ÷ 1000 = 97%. But if only 10 were fraud and the model says "not fraud" every time, accuracy is still 99%, and it catches zero fraud.

**Don't confuse with:** precision. Accuracy is misleading on imbalanced data.

**Learn more:** [Evaluation Metrics](/interview/machine-learning/evaluation-metrics)

### Activation Function

A non-linear function applied to each neuron's output. Without it, many layers would collapse into one straight-line (linear) model.

**Example:** ReLU(−3) = 0 and ReLU(2) = 2. Sigmoid(0) = 0.5.

**Learn more:** [Activation Functions](/interview/deep-learning/activation-functions)

### AdaBoost (Adaptive Boosting)

A boosting method that trains small models one after another. After each model, the examples it got wrong get a higher weight, so the next model focuses on them.

**Example:** Tree 1 misclassifies 3 of 10 emails. Those 3 get bigger weights, so Tree 2 tries hardest to get them right. The final answer is a weighted vote of all trees.

**Don't confuse with:** gradient boosting, which fits each new model to the remaining errors (residuals) instead of re-weighting examples.

**Learn more:** [Ensembles, Random Forest and Boosting](/interview/machine-learning/ensembles-random-forest-and-boosting)

### Adam (Adaptive Moment Estimation)

The most common deep learning optimizer. It keeps a running average of past gradients (momentum) and of past squared gradients, so each weight gets its own step size.

**Example:**

```python
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)  # defaults: betas=(0.9, 0.999)
```

**Learn more:** [Optimizers and Learning Rate](/interview/deep-learning/optimizers-and-learning-rate)

### AdamW

Adam with **decoupled weight decay**: weights are shrunk directly at each step instead of adding an L2 term to the gradient. It regularizes better and is the default for training Transformers.

**Example:** `torch.optim.AdamW(model.parameters(), lr=2e-5, weight_decay=0.01)` is a typical setting for fine-tuning BERT.

**Learn more:** [Optimizers and Learning Rate](/interview/deep-learning/optimizers-and-learning-rate)

### Agent (AI Agent)

An LLM that runs in a loop: it thinks, chooses a tool, reads the tool result, and repeats until the goal is reached or a stop rule fires. The model, not your code, decides the next step.

**Example:** "Find the cheapest Delhi–Mumbai train tomorrow." The agent calls `search_trains`, then `get_fares` for 3 trains, compares them, and answers.

**Don't confuse with:** a workflow, where your code fixes the order of steps in advance.

**Learn more:** [AI Agents](/interview/llms-genai/ai-agents)

### Agentic RAG

RAG where an agent controls retrieval. It can decide whether to search, rewrite the query, search again, or pick a different source.

**Example:** First search returns nothing about "Q3 refund policy", so the agent rewrites the query to "refund rules July–September" and searches again.

**Learn more:** [Advanced RAG](/interview/llms-genai/advanced-rag)

### Alignment

Making a model's behaviour match human intentions and values: helpful, honest and harmless. RLHF, DPO and Constitutional AI are alignment methods.

**Example:** A base model may continue a harmful request. An aligned model refuses it politely and offers safe help.

**Learn more:** [The LLM Training Pipeline](/interview/llms-genai/the-llm-training-pipeline)

### Anomaly Detection

Finding data points that are very different from normal ones. It is often unsupervised because examples of anomalies are rare.

**Example:** A UPI account that usually spends ₹500 a day suddenly sends ₹2,00,000 at 3 a.m. The system flags it.

**Learn more:** [Clustering: K-Means and DBSCAN](/interview/machine-learning/clustering-kmeans-and-dbscan)

### ANN (Approximate Nearest Neighbor)

A family of search methods that find vectors *close to* the nearest ones very fast, instead of comparing against every vector. You trade a little accuracy for a big speed-up.

**Example:** Exact search over 10 million embeddings compares 10 million vectors. HNSW visits only a few thousand and still finds most of the true top 10.

**Don't confuse with:** ANN meaning "artificial neural network". Context tells you which.

**Learn more:** [Vector Databases](/interview/llms-genai/vector-databases)

### API (Application Programming Interface)

A defined set of requests and responses that lets one program use another. LLM providers expose their models through HTTP APIs.

**Example:** Your app sends a JSON request with `model`, `max_tokens` and `messages` to the Claude API and receives the reply as JSON.

**Learn more:** [Using LLM APIs](/interview/llms-genai/using-llm-apis)

### Attention

A mechanism where each token looks at the other tokens and decides how much each one matters for its meaning. The output is a weighted mix of their information.

**Example:** In "The bank of the river", the token "bank" puts high weight on "river", so it means riverbank, not a money bank.

**Learn more:** [Attention Step by Step](/interview/nlp-transformers/attention-step-by-step)

### Attention Mask

A list of 1s and 0s that tells the model which tokens are real (1) and which are padding to ignore (0).

**Example:** Two sentences padded to length 5: `[1, 1, 1, 1, 1]` and `[1, 1, 1, 0, 0]`.

**Don't confuse with:** causal mask, which hides future tokens.

**Learn more:** [Hugging Face in Practice](/interview/nlp-transformers/hugging-face-in-practice)

### AUC (Area Under the Curve)

Usually the area under the ROC curve (ROC-AUC). It is the chance that the model scores a random positive higher than a random negative. 1.0 is perfect, 0.5 is random guessing.

**Example:** AUC = 0.92 means that in 92% of positive–negative pairs, the positive gets the higher score.

**Learn more:** [Evaluation Metrics](/interview/machine-learning/evaluation-metrics)

### Autoencoder

A network with an encoder that squeezes the input into a small vector and a decoder that rebuilds the input from it. It learns useful compressed features without labels.

**Example:** A 784-pixel digit image is compressed to 32 numbers and rebuilt. Images that rebuild badly are likely anomalies.

**Learn more:** [From Neuron to Neural Network](/interview/deep-learning/from-neuron-to-neural-network)

### Autograd

PyTorch's system that records every operation on tensors and computes gradients automatically when you call `.backward()`.

**Example:**

```python
x = torch.tensor(3.0, requires_grad=True)
y = x ** 2
y.backward()
print(x.grad)  # Output: tensor(6.)  because dy/dx = 2x = 6
```

**Learn more:** [PyTorch Tensors and Autograd](/interview/deep-learning/pytorch-tensors-and-autograd)

### Autoregressive Model

A model that produces output one step at a time, feeding each new token back in as input for the next. GPT-style LLMs are autoregressive.

**Example:** "The sky is" → "blue" → "The sky is blue" → "today" → ...

**Learn more:** [How LLMs Work](/interview/llms-genai/how-llms-work)

### Autoscaling

Automatically adding servers or containers when load rises and removing them when it falls, so you pay only for what you need.

**Example:** A rule says "add a replica when average GPU utilization stays above 80% for 2 minutes; minimum 1, maximum 8 replicas".

**Learn more:** [Serving Models](/interview/mlops-deployment/serving-models)

## B

### Backpropagation

The algorithm that computes the gradient of the loss with respect to every weight, by applying the chain rule backward from the output layer to the input layer.

**Example:** If loss L depends on output y and y = w·x with x = 2, then ∂L/∂w = ∂L/∂y × ∂y/∂w = ∂L/∂y × 2.

**Learn more:** [Loss Functions and Backpropagation](/interview/deep-learning/loss-functions-and-backpropagation)

### Bag of Words

Representing a text as counts of each vocabulary word, ignoring word order.

**Example:** Vocabulary [good, bad, movie]. "good good movie" → [2, 0, 1]. "movie good good" gives the same vector.

**Learn more:** [Text as Data](/interview/nlp-transformers/text-as-data)

### Bagging (Bootstrap Aggregating)

Training many models on random samples drawn with replacement from the training data, then averaging (regression) or voting (classification). It reduces variance.

**Example:** 100 decision trees, each trained on a different random resample of 10,000 rows; the final prediction is the majority vote.

**Don't confuse with:** boosting, where models are trained one after another to fix earlier errors.

**Learn more:** [Ensembles, Random Forest and Boosting](/interview/machine-learning/ensembles-random-forest-and-boosting)

### Batch

A group of training or inference examples processed together in one step. GPUs are fast because they work on a whole batch in parallel.

**Example:** A tensor of shape `(32, 3, 224, 224)` is a batch of 32 colour images.

**Learn more:** [Building and Training a Model in PyTorch](/interview/deep-learning/building-and-training-a-model-in-pytorch)

### Batch Inference

Running a model on a large set of inputs at once, usually on a schedule, and saving the results. Nobody is waiting for a reply in real time.

**Example:** Every night, score all 2 million customers for churn risk and write the scores to a table.

**Don't confuse with:** online inference, which answers each request within milliseconds.

**Learn more:** [Serving Models](/interview/mlops-deployment/serving-models)

### Batch Normalization

A layer that normalizes each feature to mean 0 and variance 1 across the current batch, then applies a learned scale and shift. It makes training faster and more stable, mostly in CNNs.

**Example:** `nn.BatchNorm2d(64)` after a conv layer with 64 output channels.

**Don't confuse with:** layer normalization, which normalizes across the features of one example.

**Learn more:** [Regularization, Dropout and Batch Norm](/interview/deep-learning/regularization-dropout-and-batch-norm)

### Batch Size

The number of examples in one batch. Bigger batches give smoother gradients but need more memory.

**Example:** 50,000 images with batch size 100 → 500 steps per epoch.

**Learn more:** [Optimizers and Learning Rate](/interview/deep-learning/optimizers-and-learning-rate)

### Bayes' Theorem

A rule for updating a probability after seeing evidence: P(A|B) = P(B|A) × P(A) ÷ P(B).

**Example:** A disease affects 1% of people. The test catches 99% of sick people but also flags 5% of healthy people. If you test positive, P(sick) = 0.0099 ÷ (0.0099 + 0.0495) ≈ 0.167, only about 17%.

**Learn more:** [Probability Basics](/interview/math-for-ml/probability-basics)

### Beam Search

A decoding method that keeps the k most likely partial sequences at each step instead of only the single best one. It is common in translation; chat LLMs usually use sampling instead.

**Example:** With beam width 3, the decoder tracks the 3 best sentences so far and extends each of them at every step.

**Learn more:** [Generation Settings and the Context Window](/interview/llms-genai/generation-settings-and-the-context-window)

### BERT (Bidirectional Encoder Representations from Transformers)

An encoder-only Transformer from Google (2018), pretrained by guessing masked words using context from both sides. It is good for understanding tasks such as classification and search, not for writing long text.

**Example:** BERT-base has 12 layers, hidden size 768 and about 110 million parameters.

**Learn more:** [BERT, GPT and T5](/interview/nlp-transformers/bert-gpt-and-t5)

### Bernoulli Distribution

The distribution of a single trial with two outcomes: 1 with probability p, 0 with probability 1 − p.

**Example:** One customer either clicks an ad (p = 0.03) or not (0.97).

**Learn more:** [Distributions and Statistics](/interview/math-for-ml/distributions-and-statistics)

### Bias (Neuron)

The extra constant b added to a neuron's weighted sum, z = w·x + b. It lets the neuron shift its output even when all inputs are zero.

**Example:** w = [0.5, −1], x = [2, 1], b = 0.3 → z = 1 − 1 + 0.3 = 0.3.

**Don't confuse with:** model bias (error from a too-simple model) or fairness bias.

**Learn more:** [From Neuron to Neural Network](/interview/deep-learning/from-neuron-to-neural-network)

### Bias (Model Error)

Error that comes from wrong or too-simple assumptions. A high-bias model underfits: it does badly on both training and test data.

**Example:** Fitting a straight line to data shaped like a curve. Training error stays high no matter how much data you add.

**Learn more:** [Overfitting, Regularization and Cross-Validation](/interview/machine-learning/overfitting-regularization-and-cross-validation)

### Bias-Variance Trade-off

Simple models have high bias (underfit); very flexible models have high variance (overfit). The best model sits in between and gives the lowest test error.

**Example:** Polynomial degree 1: train and test error both high. Degree 15: train error near 0 but test error high. Degree 3: both low.

**Learn more:** [Overfitting, Regularization and Cross-Validation](/interview/machine-learning/overfitting-regularization-and-cross-validation)

### Binomial Distribution

The number of successes in n independent yes/no trials, each with probability p.

**Example:** 10 fair coin flips: P(exactly 5 heads) = C(10,5) ÷ 2¹⁰ = 252 ÷ 1024 ≈ 0.246.

**Learn more:** [Distributions and Statistics](/interview/math-for-ml/distributions-and-statistics)

### BLEU (Bilingual Evaluation Understudy)

A score from 0 to 1 that measures how many n-grams (word sequences) of a generated text also appear in a reference text. It was built for machine translation.

**Example:** Reference "the cat sat on the mat", output "the cat sat on a mat" scores high; "a feline rested on the rug" scores low even though the meaning is the same.

**Don't confuse with:** ROUGE, which is recall-oriented and used for summaries.

**Learn more:** [Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps)

### Blue-Green Deployment

You keep two identical production environments. "Blue" serves users while you deploy to "green"; then you switch all traffic to green. Rollback means switching back.

**Example:** Model v1 runs on blue. Deploy v2 on green, run smoke tests, flip the load balancer. If errors rise, flip back in seconds.

**Don't confuse with:** canary deployment, which moves traffic gradually.

**Learn more:** [CI/CD and Testing for AI](/interview/mlops-deployment/ci-cd-and-testing-for-ai)

### BM25 (Best Matching 25)

A keyword ranking formula. It scores documents higher when they contain the query words often, when those words are rare across the collection, and it adjusts for document length.

**Example:** Query "UPI refund". A document that mentions "refund" 4 times scores higher than one that mentions it once, but extra repeats add less and less.

**Learn more:** [Advanced RAG](/interview/llms-genai/advanced-rag)

### BPE (Byte-Pair Encoding)

A subword tokenizer. It starts from characters (or bytes) and repeatedly merges the most frequent adjacent pair into a new token until it reaches the target vocabulary size.

**Example:** "l o w", "l o w e r", "l o w e s t" → the pair "l o" is most frequent → merge to "lo" → then "lo w" → "low".

**Learn more:** [Tokenization](/interview/nlp-transformers/tokenization)

### Broadcasting

The rule that lets NumPy and PyTorch combine arrays of different shapes by virtually stretching the smaller one.

**Example:**

```python
import numpy as np
x = np.array([[1, 2, 3], [4, 5, 6]])   # shape (2, 3)
b = np.array([10, 20, 30])             # shape (3,)
print(x + b)  # Output: [[11 22 33] [14 25 36]]
```

**Learn more:** [Matrix Operations and NumPy](/interview/math-for-ml/matrix-operations-and-numpy)

## C

### Canary Deployment

Release the new version to a small share of traffic first, watch the metrics, and increase the share step by step if all is well.

**Example:** New model gets 5% of requests for one hour, then 25%, then 100%, as long as error rate and latency stay normal.

**Don't confuse with:** shadow deployment, where the new model gets copies of requests but its answers are not shown to users.

**Learn more:** [CI/CD and Testing for AI](/interview/mlops-deployment/ci-cd-and-testing-for-ai)

### CatBoost

A gradient boosting library from Yandex that handles categorical features natively, using ordered target statistics to avoid leakage.

**Example:** You can pass a "city" column with values like "Pune" and "Patna" directly, using `cat_features=["city"]`, without one-hot encoding.

**Learn more:** [Ensembles, Random Forest and Boosting](/interview/machine-learning/ensembles-random-forest-and-boosting)

### Causal Masking

In a decoder, each position is allowed to look only at itself and earlier positions. Future positions get a score of −∞ before softmax, so their weight becomes 0.

**Example:** For 4 tokens, token 2 can attend to tokens 1 and 2, but not to 3 or 4.

**Also called:** look-ahead mask.

**Learn more:** [The Transformer Architecture](/interview/nlp-transformers/the-transformer-architecture)

### CBOW (Continuous Bag of Words)

A Word2Vec training method that predicts a middle word from the words around it.

**Example:** Input "the ___ sat on" → target "cat".

**Don't confuse with:** skip-gram, which does the reverse (predicts neighbours from the middle word).

**Learn more:** [Word Embeddings](/interview/nlp-transformers/word-embeddings)

### Central Limit Theorem

If you take many random samples and compute their averages, those averages form a roughly normal (bell-shaped) distribution, even if the original data is not normal.

**Example:** Single dice rolls are uniform from 1 to 6, but the average of 30 rolls, repeated many times, forms a bell curve around 3.5.

**Learn more:** [Distributions and Statistics](/interview/math-for-ml/distributions-and-statistics)

### Chain Rule

The rule for the derivative of a function inside another function: if y = f(g(x)), then dy/dx = f′(g(x)) × g′(x). Backpropagation is the chain rule applied many times.

**Example:** y = (3x + 1)². Outer derivative 2(3x + 1), inner derivative 3, so dy/dx = 6(3x + 1). At x = 1, dy/dx = 24.

**Learn more:** [Derivatives, Gradients and the Chain Rule](/interview/math-for-ml/derivatives-gradients-and-the-chain-rule)

### Chain-of-Thought (CoT)

A prompting technique where you ask the model to show its reasoning steps before the final answer. It improves multi-step maths and logic.

**Example:** "A ticket costs ₹450 and there is 18% GST. Think step by step, then give the total." → "18% of 450 = 81; 450 + 81 = 531. Total: ₹531."

**Learn more:** [Prompt Engineering](/interview/llms-genai/prompt-engineering)

### Chunk Overlap

Repeating a small part of text at the boundary of neighbouring chunks, so an idea that crosses a boundary is not cut in half.

**Example:** Chunk size 500 tokens with overlap 50: chunk 1 = tokens 0–499, chunk 2 = tokens 450–949.

**Learn more:** [RAG Fundamentals](/interview/llms-genai/rag-fundamentals)

### Chunking

Splitting long documents into smaller pieces before embedding them, so retrieval can return just the relevant part and it fits the context window.

**Example:** A 40-page PDF is split by headings into 120 chunks of about 300–500 tokens each.

**Learn more:** [RAG Fundamentals](/interview/llms-genai/rag-fundamentals)

### CI/CD (Continuous Integration / Continuous Delivery)

CI runs tests automatically on every code change; CD automatically packages and releases the change if tests pass. For AI apps, CI can also run an evaluation set.

**Example:** A GitHub Actions workflow runs `pytest` and a 50-question RAG eval on every pull request and blocks the merge if the faithfulness score drops.

**Learn more:** [CI/CD and Testing for AI](/interview/mlops-deployment/ci-cd-and-testing-for-ai)

### Class Imbalance

When one class is much rarer than the others. Models then learn to ignore the rare class, and accuracy becomes misleading.

**Example:** 990 normal transactions and 10 fraud. Fixes: class weights, SMOTE, a different decision threshold, and metrics like recall and PR-AUC.

**Also called:** imbalanced data.

**Learn more:** [Data Preparation and Feature Engineering](/interview/machine-learning/data-preparation-and-feature-engineering)

### Classification

A supervised task where the model predicts a category (class).

**Example:** Spam or not spam (binary); cat, dog or bird (multiclass).

**Don't confuse with:** regression, which predicts a number.

**Learn more:** [What Is Machine Learning](/interview/machine-learning/what-is-machine-learning)

### Clustering

Grouping similar data points together without any labels. It is unsupervised learning.

**Example:** Grouping Flipkart customers into "bargain hunters", "premium buyers" and "occasional shoppers" from purchase history.

**Learn more:** [Clustering: K-Means and DBSCAN](/interview/machine-learning/clustering-kmeans-and-dbscan)

### CNN (Convolutional Neural Network)

A neural network that slides small learned filters across an image to detect patterns such as edges, then shapes, then objects. Sharing the same filter everywhere keeps parameters low.

**Example:** A 3×3 filter on a 28×28 image (stride 1, no padding) gives a 26×26 output, using only 9 weights + 1 bias.

**Learn more:** [Convolutional Neural Networks](/interview/deep-learning/convolutional-neural-networks)

### Collaborative Filtering

A recommendation method that uses the behaviour of many users: if users similar to you liked an item, you will probably like it too. It needs no item content.

**Example:** You and Ravi both bought the same 5 books. Ravi also bought a 6th book, so it is recommended to you.

**Learn more:** [Case: Recommendation System](/interview/ai-system-design/case-recommendation-system)

### Concept Drift

The relationship between inputs and the correct output changes over time, so a model that was accurate becomes wrong.

**Example:** Before a festival sale, a "high spend" pattern meant fraud; during the sale, it is normal. The same input now has a different correct label.

**Don't confuse with:** data drift, where the input distribution changes but the rule may be the same.

**Learn more:** [Monitoring, Cost and Caching](/interview/mlops-deployment/monitoring-cost-and-caching)

### Confidence Interval

A range computed from a sample that is likely to contain the true value. A 95% interval means the method captures the true value 95% of the time.

**Example:** Conversion rate 12% with a 95% CI of 10.5% to 13.5%.

**Learn more:** [Distributions and Statistics](/interview/math-for-ml/distributions-and-statistics)

### Confusion Matrix

A table that counts true positives (TP), false positives (FP), false negatives (FN) and true negatives (TN). Precision, recall and accuracy come from it.

**Example:** TP = 40, FP = 10, FN = 20, TN = 930 → precision = 40/50 = 0.80, recall = 40/60 ≈ 0.67, accuracy = 970/1000 = 0.97.

**Learn more:** [Evaluation Metrics](/interview/machine-learning/evaluation-metrics)

### Constitutional AI

An Anthropic training method where the model critiques and revises its own answers using a written set of principles (a "constitution"), and AI feedback replaces much of the human labelling for harmlessness.

**Example:** Principle: "Choose the response that is least likely to help someone cause harm." The model rewrites an unsafe draft to follow it.

**Learn more:** [The LLM Training Pipeline](/interview/llms-genai/the-llm-training-pipeline)

### Container

A running instance of an image: your app plus its libraries, isolated from other processes but sharing the host's operating system kernel. It runs the same way on any machine with Docker.

**Example:** `docker run -p 8000:8000 rag-api:1.0` starts a container from the image `rag-api:1.0`.

**Don't confuse with:** image (the read-only template) or virtual machine (which runs a whole separate OS).

**Learn more:** [Docker Basics](/interview/mlops-deployment/docker-basics)

### Content Filter

A classifier or rule set that checks input or output text and blocks or flags harmful content such as hate speech, violence or self-harm.

**Example:** Before showing a reply, a moderation model scores it; if "violence" > 0.8, the app replaces it with a safe message.

**Learn more:** [Safety, Guardrails and Prompt Injection](/interview/llms-genai/safety-guardrails-and-prompt-injection)

### Context Precision

A RAG metric: of the chunks you retrieved, how many are actually relevant (and are the relevant ones ranked near the top)?

**Example:** You retrieve 5 chunks and 3 are relevant → simple precision = 3/5 = 0.6.

**Learn more:** [Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps)

### Context Recall

A RAG metric: of the facts needed for the correct answer, how many appear in the retrieved chunks?

**Example:** The ideal answer needs 4 facts and the retrieved chunks contain 3 → context recall = 0.75.

**Learn more:** [Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps)

### Context Window

The maximum number of tokens a model can handle in one call, counting the prompt, any documents and the output. Anything beyond it must be cut or summarized.

**Example:** With a 200,000-token window, a 150,000-token contract plus question fits; three such contracts do not.

**Learn more:** [Generation Settings and the Context Window](/interview/llms-genai/generation-settings-and-the-context-window)

### Contextual Embedding

A vector for a word that depends on the sentence around it, produced by models such as BERT.

**Example:** "bank" in "river bank" and in "bank loan" gets two different vectors.

**Don't confuse with:** static embeddings (Word2Vec, GloVe), which give one fixed vector per word.

**Learn more:** [Word Embeddings](/interview/nlp-transformers/word-embeddings)

### Contextual Retrieval

A RAG technique (described by Anthropic in 2024) where an LLM writes a short sentence placing each chunk in its document's context, and that sentence is added to the chunk before embedding and keyword indexing.

**Example:** Chunk "Revenue grew 3%" becomes "From ACME's Q2 2024 report, finance section: Revenue grew 3%". Now a search for "ACME Q2 revenue" finds it.

**Learn more:** [Advanced RAG](/interview/llms-genai/advanced-rag)

### Continuous Batching

An LLM serving technique where new requests join the running batch as soon as any request finishes, instead of waiting for the whole batch to end. It greatly increases GPU throughput.

**Example:** vLLM serves 50 chat users at once; when one short reply ends, a waiting request takes its slot at the next token step.

**Learn more:** [Serving Models](/interview/mlops-deployment/serving-models)

### Correlation

A number from −1 to +1 that shows how strongly two variables move together in a straight-line way. Correlation does not prove one causes the other.

**Example:** Ice-cream sales and drowning cases are positively correlated, because both rise in summer, not because ice cream causes drowning.

**Learn more:** [Distributions and Statistics](/interview/math-for-ml/distributions-and-statistics)

### Cosine Similarity

The cosine of the angle between two vectors: (a·b) ÷ (‖a‖ × ‖b‖). It is 1 for the same direction, 0 for unrelated (perpendicular), −1 for opposite. It is the standard way to compare embeddings.

**Example:** a = [3, 4], b = [4, 3]: a·b = 24, ‖a‖ = ‖b‖ = 5 → 24 ÷ 25 = 0.96.

**Learn more:** [Embeddings and Semantic Search](/interview/llms-genai/embeddings-and-semantic-search)

### Cross-Encoder

A model that reads the query and a document together in one input and outputs a relevance score. It is more accurate but slower than comparing separate embeddings, so it is used to rerank a short list.

**Example:** Retrieve top 50 chunks with vector search, then a cross-encoder scores each (query, chunk) pair and you keep the best 5.

**Don't confuse with:** bi-encoder, which embeds query and document separately.

**Learn more:** [Advanced RAG](/interview/llms-genai/advanced-rag)

### Cross-Entropy Loss

The standard classification loss: −log of the probability the model gave to the correct class. Confident wrong answers are punished heavily.

**Example:** Correct class probability 0.8 → loss = −ln(0.8) ≈ 0.22. Probability 0.1 → loss = −ln(0.1) ≈ 2.30.

**Also called:** log loss (in the binary case).

**Learn more:** [Loss Functions and Backpropagation](/interview/deep-learning/loss-functions-and-backpropagation)

### Cross-Validation

Splitting training data into k parts (folds), training k times with a different fold held out each time, and averaging the scores. It gives a more reliable estimate than a single split.

**Example:**

```python
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5)  # 5 scores, one per fold
print(scores.mean())
```

**Learn more:** [Overfitting, Regularization and Cross-Validation](/interview/machine-learning/overfitting-regularization-and-cross-validation)

### CUDA (Compute Unified Device Architecture)

NVIDIA's platform for running general computations on its GPUs. PyTorch uses it under the hood.

**Example:** `device = "cuda" if torch.cuda.is_available() else "cpu"; model.to(device)`.

**Learn more:** [Training in Practice](/interview/deep-learning/training-in-practice)

### Curse of Dimensionality

As the number of features grows, data points become very spread out, you need far more data, and distances between points become almost equal, which hurts methods like KNN.

**Example:** To cover a 1-D range with points 0.1 apart you need 10 points; in 10 dimensions you need 10¹⁰ points.

**Learn more:** [KNN, SVM and Naive Bayes](/interview/machine-learning/knn-svm-and-naive-bayes)
