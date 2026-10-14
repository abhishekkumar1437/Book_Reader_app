---
title: D to G
part: Glossary
summary: Terms from Data Augmentation to Guardrails, covering data drift, Docker, DPO, embeddings, F1, fine-tuning, gradient descent, GraphRAG and more.
---

How to use this glossary: scan the index table for a quick reminder, then open the full entry for the meaning, an example, and the chapter that teaches the idea in depth. Terms that start with a number or symbol are listed under the nearest letter.

| Term | One-line meaning |
|---|---|
| Data Augmentation | Creating extra training examples by changing existing ones |
| Data Drift | The input data in production changes from the training data |
| Data Leakage | Training uses information that will not exist at prediction time |
| DataLoader | PyTorch object that serves shuffled batches from a Dataset |
| Dataset (PyTorch) | Class that returns one example by index |
| DBSCAN | Density-based clustering that also finds noise points |
| Decision Boundary | The line or surface where the predicted class changes |
| Decision Tree | Model that predicts by asking a series of yes/no questions |
| Decoder | Part of a Transformer that generates output tokens |
| Decoder-Only Model | Transformer with only causal decoder blocks, like GPT |
| Deep Learning | Machine learning with many-layered neural networks |
| Derivative | Rate of change, or slope, of a function |
| Diffusion Model | Generative model that learns to turn noise into data |
| Dimensionality Reduction | Reducing the number of features while keeping information |
| Distillation (Knowledge Distillation) | Training a small model to copy a big model |
| Docker | Tool to package apps into portable containers |
| Docker Compose | Tool to run several containers together from one YAML file |
| Docker Image | Read-only template a container is started from |
| Dockerfile | Text recipe that builds a Docker image |
| Dot Product | Sum of element-wise products of two vectors |
| DPO (Direct Preference Optimization) | Preference tuning without a separate reward model |
| Dropout | Randomly switching off neurons during training |
| DVC (Data Version Control) | Git-like versioning for large data and model files |
| Early Stopping | Stop training when validation loss stops improving |
| EDA (Exploratory Data Analysis) | First look at data with stats and plots |
| Eigenvalue and Eigenvector | A direction a matrix only stretches, and by how much |
| ElasticNet | Regression with both L1 and L2 penalties |
| Elbow Method | Picking k in K-Means where the error curve bends |
| Embedding | A list of numbers that captures meaning |
| Embedding Model | Model that turns text into embeddings |
| Emergent Abilities | Skills that appear only once models are large enough |
| Encoder | Part of a Transformer that reads input into vectors |
| Encoder-Decoder Model | Transformer that encodes input and decodes a new output |
| Ensemble | Combining several models for a better prediction |
| Entropy | Measure of uncertainty or impurity |
| Epoch | One full pass through the training data |
| Euclidean Distance | Straight-line distance between two points |
| Exact Match | Eval score: 1 if output equals the reference exactly |
| Expected Value | Probability-weighted average outcome |
| Experiment Tracking | Logging parameters, metrics and files of every run |
| Explained Variance | Share of total variance kept by each principal component |
| Exploding Gradient | Gradients grow huge and training blows up |
| F1 Score | Harmonic mean of precision and recall |
| FAISS (Facebook AI Similarity Search) | Meta's library for fast vector search |
| Faithfulness | Answer is fully supported by the retrieved context |
| Fallback | Backup model or response used when the main one fails |
| False Positive and False Negative | Wrong alarm, and missed case |
| FastAPI | Python web framework for building APIs |
| Feature | An input variable the model uses |
| Feature Engineering | Creating better input features from raw data |
| Feature Importance | How much each feature contributes to predictions |
| Feature Scaling | Putting features on similar numeric ranges |
| Feature Store | Shared system that stores and serves ML features |
| Feed-Forward Network | The per-token MLP inside each Transformer block |
| Few-Shot Prompting | Putting a few solved examples in the prompt |
| Fine-Tuning | Further training a pretrained model on your own data |
| FLOPs (Floating-Point Operations) | Count of arithmetic operations; a measure of compute |
| Foundation Model | Large pretrained model adapted to many tasks |
| Function Calling | Model outputs a structured call to a function you defined |
| GELU (Gaussian Error Linear Unit) | Smooth ReLU-like activation used in Transformers |
| Generalization | Doing well on new, unseen data |
| Generative AI | AI that creates new text, images, audio or code |
| Gini Impurity | How mixed the classes in a tree node are |
| GloVe (Global Vectors) | Static word embeddings from co-occurrence counts |
| Golden Dataset | Hand-checked set of inputs and ideal outputs for eval |
| GPT (Generative Pre-trained Transformer) | Decoder-only model family trained on next-token prediction |
| GPU (Graphics Processing Unit) | Chip with thousands of cores for parallel maths |
| GPU Memory Estimate | Rough VRAM needed = parameters × bytes per parameter + overhead |
| Gradient | Vector of partial derivatives; points uphill |
| Gradient Accumulation | Add gradients over several small batches before one update |
| Gradient Boosting | Each new tree fits the errors of the trees before it |
| Gradient Clipping | Capping gradient size to keep training stable |
| Gradient Descent | Step weights against the gradient to reduce loss |
| GraphRAG | RAG over a knowledge graph of entities and relations |
| Greedy Decoding | Always pick the single most likely next token |
| Grid Search | Try every combination of chosen hyperparameter values |
| Grounding | Tying a model's answer to given sources or facts |
| GRU (Gated Recurrent Unit) | Simpler LSTM-like recurrent unit with two gates |
| Guardrails | Checks around an LLM that block unsafe input, output or actions |

## D

### Data Augmentation

Making new training examples by changing existing ones in ways that keep the label the same. It reduces overfitting when data is small.

**Example:** For a cat photo: flip it, rotate 10°, crop, change brightness. It is still a cat, so you get 5 images from 1.

**Learn more:** [Regularization, Dropout and Batch Norm](/interview/deep-learning/regularization-dropout-and-batch-norm)

### Data Drift

The distribution of inputs in production moves away from what the model saw in training. Performance often drops even though the code did not change.

**Example:** A loan model trained on users aged 25–45 starts receiving many users aged 18–22 after a campus campaign.

**Don't confuse with:** concept drift, where the input-to-label relationship itself changes.

**Learn more:** [Monitoring, Cost and Caching](/interview/mlops-deployment/monitoring-cost-and-caching)

### Data Leakage

When training uses information that will not be available at prediction time, so validation scores look great but production fails.

**Example:** Predicting loan default using a column "days_overdue_last_month", which is only filled in after default happens. Another case: fitting a scaler on the whole dataset before the train/test split.

**Learn more:** [Data Preparation and Feature Engineering](/interview/machine-learning/data-preparation-and-feature-engineering)

### DataLoader

A PyTorch utility that takes a Dataset and gives you batches, with optional shuffling and parallel loading.

**Example:**

```python
from torch.utils.data import DataLoader
loader = DataLoader(train_ds, batch_size=32, shuffle=True)
for X, y in loader:   # X has shape (32, ...)
    ...
```

**Learn more:** [Building and Training a Model in PyTorch](/interview/deep-learning/building-and-training-a-model-in-pytorch)

### Dataset (PyTorch)

A class with `__len__` and `__getitem__` that returns one (input, label) pair for a given index.

**Example:** `train_ds[0]` returns `(image_tensor, 7)` for the first MNIST digit.

**Learn more:** [Building and Training a Model in PyTorch](/interview/deep-learning/building-and-training-a-model-in-pytorch)

### DBSCAN (Density-Based Spatial Clustering of Applications with Noise)

A clustering algorithm that groups points in dense areas and marks isolated points as noise. You do not choose the number of clusters; you set `eps` (radius) and `min_samples`.

**Example:** With eps = 0.5 and min_samples = 5, a point with at least 5 neighbours within 0.5 is a core point; a lonely point far from all clusters gets label −1 (noise).

**Learn more:** [Clustering: K-Means and DBSCAN](/interview/machine-learning/clustering-kmeans-and-dbscan)

### Decision Boundary

The line (or surface) in feature space where the model's prediction switches from one class to another.

**Example:** Logistic regression with z = 2x₁ + x₂ − 4 predicts class 1 when z > 0, so the boundary is the line 2x₁ + x₂ = 4.

**Learn more:** [Logistic Regression](/interview/machine-learning/logistic-regression)

### Decision Tree

A model that makes predictions by asking a sequence of yes/no questions about features, like a flowchart. Each leaf gives a prediction.

**Example:** "Monthly bill > ₹1,500?" → yes → "Contract = monthly?" → yes → predict "will churn".

**Learn more:** [Decision Trees](/interview/machine-learning/decision-trees)

### Decoder

The Transformer part that produces output tokens one at a time. It uses causal self-attention, and in encoder-decoder models it also attends to the encoder's output (cross-attention).

**Example:** In translation, the decoder writes "Main ghar ja raha hoon" token by token while looking at the encoded English sentence.

**Learn more:** [The Transformer Architecture](/interview/nlp-transformers/the-transformer-architecture)

### Decoder-Only Model

A Transformer made only of decoder blocks with causal masking, trained to predict the next token. Most chat LLMs (GPT, Claude, Llama) are of this kind.

**Example:** Input "2 + 2 =" → the model predicts " 4" as the next token.

**Learn more:** [BERT, GPT and T5](/interview/nlp-transformers/bert-gpt-and-t5)

### Deep Learning

Machine learning that uses neural networks with many layers. Each layer learns more abstract features from the one before.

**Example:** In a face model, early layers find edges, middle layers find eyes and noses, late layers recognise whole faces.

**Learn more:** [From Neuron to Neural Network](/interview/deep-learning/from-neuron-to-neural-network)

### Derivative

How fast a function's output changes when its input changes a tiny bit; the slope at a point.

**Example:** f(x) = x² → f′(x) = 2x. At x = 3 the slope is 6.

**Learn more:** [Derivatives, Gradients and the Chain Rule](/interview/math-for-ml/derivatives-gradients-and-the-chain-rule)

### Diffusion Model

A generative model trained to remove noise step by step. To create an image, it starts from pure random noise and denoises it many times, often guided by a text prompt.

**Example:** Prompt "a tea stall in Kolkata at sunrise" → about 20–50 denoising steps turn noise into a picture.

**Learn more:** [How LLMs Work](/interview/llms-genai/how-llms-work)

### Dimensionality Reduction

Reducing the number of features while keeping most of the useful information, for speed, less noise, or plotting.

**Example:** Reduce 768-dimension embeddings to 2 dimensions with PCA or UMAP to plot them on a chart.

**Learn more:** [Dimensionality Reduction: PCA](/interview/machine-learning/dimensionality-reduction-pca)

### Distillation (Knowledge Distillation)

Training a small "student" model to imitate the outputs of a large "teacher" model. The student is cheaper and faster but keeps much of the quality.

**Example:** A large LLM labels 50,000 support tickets with categories; a small model is fine-tuned on those labels and runs 20× cheaper.

**Learn more:** [Fine-Tuning, LoRA and QLoRA](/interview/llms-genai/fine-tuning-lora-and-qlora)

### Docker

A tool that packages an application with everything it needs (code, libraries, system tools) into an image, and runs it as a container anywhere.

**Example:** "It works on my laptop" problems disappear because the server runs the exact same image.

**Learn more:** [Docker Basics](/interview/mlops-deployment/docker-basics)

### Docker Compose

A tool that starts several related containers together, defined in one `compose.yaml` file.

**Example:**

```yaml
services:
  api:
    build: .
    ports: ["8000:8000"]
  qdrant:
    image: qdrant/qdrant
  redis:
    image: redis:7
```

`docker compose up` starts all three.

**Learn more:** [Docker for ML and Compose](/interview/mlops-deployment/docker-for-ml-and-compose)

### Docker Image

A read-only, layered template containing your app and its environment. Containers are started from images.

**Example:** `docker build -t rag-api:1.0 .` builds an image; `docker images` lists it.

**Don't confuse with:** container, the running instance.

**Learn more:** [Docker Basics](/interview/mlops-deployment/docker-basics)

### Dockerfile

A text file with step-by-step instructions to build an image. Each instruction creates a layer.

**Example:**

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Learn more:** [Docker Basics](/interview/mlops-deployment/docker-basics)

### Dot Product

Multiply two vectors element by element and add the results. A big dot product means the vectors point in a similar direction.

**Example:** [1, 2, 3] · [4, 5, 6] = 4 + 10 + 18 = 32.

**Learn more:** [Vectors and Matrices](/interview/math-for-ml/vectors-and-matrices)

### DPO (Direct Preference Optimization)

A way to align a model to human preferences directly from pairs of "chosen" and "rejected" answers, without training a separate reward model or running reinforcement learning.

**Example:** Data row: prompt "Explain GST", chosen = clear short answer, rejected = rambling wrong answer. DPO raises the probability of the chosen one relative to the rejected one.

**Don't confuse with:** RLHF with PPO, which needs a reward model and an RL loop.

**Learn more:** [The LLM Training Pipeline](/interview/llms-genai/the-llm-training-pipeline)

### Dropout

During training, each neuron's output is set to zero with probability p, so the network cannot rely on any single neuron. It is turned off at evaluation time.

**Example:** `nn.Dropout(p=0.5)`. In training, half the values become 0 and the rest are multiplied by 2 (1 ÷ (1 − 0.5)) to keep the average the same.

**Learn more:** [Regularization, Dropout and Batch Norm](/interview/deep-learning/regularization-dropout-and-batch-norm)

### DVC (Data Version Control)

A tool that versions large data and model files alongside Git. Git stores small pointer files; the real data lives in storage such as S3.

**Example:** `dvc add data/train.csv` then `git commit` lets you return to the exact dataset used for model v3.

**Learn more:** [Experiment Tracking and Model Registry](/interview/mlops-deployment/experiment-tracking-and-model-registry)

## E

### Early Stopping

Stop training when the validation loss has not improved for a set number of epochs (the "patience"), and keep the best weights.

**Example:** Patience 3: validation loss is best at epoch 12 and does not improve in epochs 13–15, so training stops and epoch 12 weights are restored.

**Learn more:** [Regularization, Dropout and Batch Norm](/interview/deep-learning/regularization-dropout-and-batch-norm)

### EDA (Exploratory Data Analysis)

Looking at a new dataset with summary statistics and plots before modelling, to find missing values, outliers, skew and relationships.

**Example:** `df.describe()`, `df.isna().sum()` and a histogram show that "income" has 8% missing values and a long right tail.

**Learn more:** [Data Preparation and Feature Engineering](/interview/machine-learning/data-preparation-and-feature-engineering)

### Eigenvalue and Eigenvector

An eigenvector of a matrix is a direction that the matrix only stretches or shrinks, without turning. The eigenvalue is the stretch factor. PCA uses the eigenvectors of the covariance matrix.

**Example:** A = [[2, 0], [0, 3]]. Vector [1, 0] becomes [2, 0] (eigenvalue 2); vector [0, 1] becomes [0, 3] (eigenvalue 3).

**Learn more:** [Eigenvalues and PCA Intuition](/interview/math-for-ml/eigenvalues-and-pca-intuition)

### ElasticNet

Linear regression with both an L1 penalty (pushes some weights to exactly 0) and an L2 penalty (keeps weights small). Useful when many features are correlated.

**Example:** `ElasticNet(alpha=0.1, l1_ratio=0.5)` mixes the two penalties equally.

**Learn more:** [Overfitting, Regularization and Cross-Validation](/interview/machine-learning/overfitting-regularization-and-cross-validation)

### Elbow Method

To choose k in K-Means, plot the within-cluster error (inertia) for k = 1, 2, 3, ... and pick the k where the curve bends and stops dropping fast.

**Example:** Inertia: k=1: 1000, k=2: 500, k=3: 200, k=4: 180, k=5: 170 → the elbow is at k = 3.

**Learn more:** [Clustering: K-Means and DBSCAN](/interview/machine-learning/clustering-kmeans-and-dbscan)

### Embedding

A list of numbers (a vector) that represents a word, sentence, image or user so that similar things get similar vectors.

**Example:** "How do I reset my password?" and "I forgot my login password" get embeddings with cosine similarity around 0.85; "Today's cricket score" gets around 0.1.

**Learn more:** [Embeddings and Semantic Search](/interview/llms-genai/embeddings-and-semantic-search)

### Embedding Model

A model trained to turn text (or images) into embeddings that are good for similarity search. Its output size is fixed, for example 384, 768 or 1536 numbers.

**Example:**

```python
from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")
vec = model.encode("UPI payment failed")
print(vec.shape)  # Output: (384,)
```

**Learn more:** [Embeddings and Semantic Search](/interview/llms-genai/embeddings-and-semantic-search)

### Emergent Abilities

Skills that seem to appear suddenly once a model is large enough, such as multi-step arithmetic. Some researchers argue the jump partly depends on how the skill is measured.

**Example:** A small model scores near 0 on a multi-step reasoning test while a much larger model from the same family scores well.

**Learn more:** [How LLMs Work](/interview/llms-genai/how-llms-work)

### Encoder

The Transformer part that reads the whole input with bidirectional self-attention and turns each token into a context-rich vector.

**Example:** BERT is encoder-only: "I love this phone" → 4 (or more) vectors of size 768, used for sentiment classification.

**Learn more:** [The Transformer Architecture](/interview/nlp-transformers/the-transformer-architecture)

### Encoder-Decoder Model

A Transformer with an encoder that reads the input and a decoder that writes a new sequence while attending to the encoder's output. Good for translation and summarization.

**Example:** T5 takes "summarize: <long article>" and outputs a 3-sentence summary.

**Learn more:** [BERT, GPT and T5](/interview/nlp-transformers/bert-gpt-and-t5)

### Ensemble

Combining predictions of several models so their errors cancel out. Bagging, boosting and stacking are ensemble methods.

**Example:** Three models predict churn probability 0.6, 0.7 and 0.8 → averaged prediction 0.7.

**Learn more:** [Ensembles, Random Forest and Boosting](/interview/machine-learning/ensembles-random-forest-and-boosting)

### Entropy

A measure of uncertainty. In decision trees, a node with mixed classes has high entropy; a pure node has entropy 0. Formula: −Σ pᵢ log₂ pᵢ.

**Example:** 50% yes / 50% no → entropy = 1 bit. 100% yes → entropy = 0.

**Learn more:** [Decision Trees](/interview/machine-learning/decision-trees)

### Epoch

One complete pass of the model over the entire training dataset.

**Example:** 10,000 examples, batch size 100 → 100 steps = 1 epoch. Training for 5 epochs means 500 steps.

**Learn more:** [Building and Training a Model in PyTorch](/interview/deep-learning/building-and-training-a-model-in-pytorch)

### Euclidean Distance

The straight-line distance between two points: √(Σ (aᵢ − bᵢ)²).

**Example:** Between (1, 2) and (4, 6): √(3² + 4²) = √25 = 5.

**Don't confuse with:** cosine similarity, which looks only at direction, not length.

**Learn more:** [KNN, SVM and Naive Bayes](/interview/machine-learning/knn-svm-and-naive-bayes)

### Exact Match

An evaluation score that is 1 if the model's answer is exactly the same as the reference (often after lower-casing and removing punctuation), else 0.

**Example:** Reference "New Delhi"; output "new delhi" → 1; output "The capital is New Delhi" → 0, even though it is correct.

**Learn more:** [Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps)

### Expected Value

The long-run average of a random outcome: Σ (value × probability).

**Example:** A fair die: (1+2+3+4+5+6) × 1/6 = 3.5.

**Learn more:** [Probability Basics](/interview/math-for-ml/probability-basics)

### Experiment Tracking

Recording every training run's parameters, metrics, code version and output files, so you can compare runs and reproduce the best one.

**Example:**

```python
import mlflow
with mlflow.start_run():
    mlflow.log_param("max_depth", 6)
    mlflow.log_metric("val_f1", 0.81)
```

**Learn more:** [Experiment Tracking and Model Registry](/interview/mlops-deployment/experiment-tracking-and-model-registry)

### Explained Variance

In PCA, the share of the data's total variance captured by each principal component.

**Example:** `explained_variance_ratio_ = [0.72, 0.18, 0.06, 0.04]` → the first two components keep 90% of the information.

**Learn more:** [Dimensionality Reduction: PCA](/interview/machine-learning/dimensionality-reduction-pca)

### Exploding Gradient

Gradients grow larger and larger as they pass back through many layers, causing huge weight updates and a loss that becomes NaN.

**Example:** Multiplying by 1.5 across 50 layers gives 1.5⁵⁰ ≈ 637 million. Fix with gradient clipping, careful initialization and normalization.

**Learn more:** [Loss Functions and Backpropagation](/interview/deep-learning/loss-functions-and-backpropagation)

## F

### F1 Score

The harmonic mean of precision and recall: 2PR ÷ (P + R). It is high only when both are high.

**Example:** Precision 0.8, recall 0.5 → F1 = 2 × 0.4 ÷ 1.3 ≈ 0.62 (the simple average would be 0.65).

**Learn more:** [Evaluation Metrics](/interview/machine-learning/evaluation-metrics)

### FAISS (Facebook AI Similarity Search)

An open-source library from Meta for fast similarity search over vectors, with exact (Flat) and approximate (IVF, HNSW, PQ) indexes. It is a library, not a database server.

**Example:**

```python
import faiss
index = faiss.IndexFlatL2(384)   # exact search, 384-dim vectors
index.add(vectors)               # vectors: float32 array (n, 384)
D, I = index.search(query, 5)    # distances and ids of top 5
```

**Learn more:** [Vector Databases](/interview/llms-genai/vector-databases)

### Faithfulness

A RAG metric: is every claim in the answer supported by the retrieved context? An unfaithful answer adds facts that are not in the sources.

**Example:** Context says "refunds take 5–7 days". Answer "Refunds take 5–7 days and are free" has 1 of 2 claims supported → faithfulness 0.5.

**Learn more:** [Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps)

### Fallback

A backup path used when the main model or service fails, times out, or is rate-limited.

**Example:** If the primary LLM returns HTTP 529/503 three times, route the request to a second model, or show "Please try again" with a cached answer.

**Learn more:** [Monitoring, Cost and Caching](/interview/mlops-deployment/monitoring-cost-and-caching)

### False Positive and False Negative

A false positive (FP) is a wrong alarm: predicted positive, actually negative. A false negative (FN) is a miss: predicted negative, actually positive.

**Example:** Cancer screening: FP = healthy person told "maybe cancer" (stress, more tests); FN = sick person told "healthy" (very dangerous). Here you want few FNs, so high recall.

**Learn more:** [Evaluation Metrics](/interview/machine-learning/evaluation-metrics)

### FastAPI

A modern Python web framework for building APIs. It uses type hints and Pydantic for automatic validation and documentation, and supports async code.

**Example:**

```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}
```

**Learn more:** [FastAPI for AI Apps](/interview/mlops-deployment/fastapi-for-ai-apps)

### Feature

One input variable that a model uses to make a prediction. A row of data is a list of feature values.

**Example:** For house price: area (sq ft), bedrooms, city, age of building.

**Don't confuse with:** label, the value you want to predict.

**Learn more:** [What Is Machine Learning](/interview/machine-learning/what-is-machine-learning)

### Feature Engineering

Creating new, more useful features from raw data using domain knowledge.

**Example:** From "order_time" create "hour_of_day" and "is_weekend"; from "total_spend" and "num_orders" create "avg_order_value".

**Learn more:** [Data Preparation and Feature Engineering](/interview/machine-learning/data-preparation-and-feature-engineering)

### Feature Importance

A score showing how much each feature contributes to a model's predictions. Tree models give it directly; permutation importance works for any model.

**Example:** Churn model: "contract_type" 0.35, "monthly_bill" 0.25, "tenure" 0.20, others 0.20.

**Learn more:** [Ensembles, Random Forest and Boosting](/interview/machine-learning/ensembles-random-forest-and-boosting)

### Feature Scaling

Transforming features so they have similar ranges, so no feature dominates just because its numbers are bigger. Needed for KNN, SVM, linear models and neural networks; not for trees.

**Example:** Salary (₹20,000–₹2,00,000) and age (18–60) are both scaled to mean 0, std 1 with `StandardScaler`.

**Learn more:** [Data Preparation and Feature Engineering](/interview/machine-learning/data-preparation-and-feature-engineering)

### Feature Store

A central system that computes, stores and serves ML features, so training and live serving use exactly the same feature values.

**Example:** "user_orders_last_7_days" is computed once and read both by the nightly training job and by the real-time fraud API.

**Learn more:** [Building Blocks of AI Systems](/interview/ai-system-design/building-blocks-of-ai-systems)

### Feed-Forward Network

In each Transformer block, a small two-layer MLP applied to every token separately, after attention. It usually expands the size about 4× and then shrinks it back.

**Example:** In BERT-base: 768 → 3072 → 768 with GELU in between.

**Learn more:** [The Transformer Architecture](/interview/nlp-transformers/the-transformer-architecture)

### Few-Shot Prompting

Including a few worked examples of the task in the prompt so the model copies the pattern and format.

**Example:**

```text
Review: "Delivery was late" -> negative
Review: "Great quality" -> positive
Review: "Battery died in 2 days" ->
```

**Don't confuse with:** zero-shot (no examples) and fine-tuning (changing weights).

**Learn more:** [Prompt Engineering](/interview/llms-genai/prompt-engineering)

### Fine-Tuning

Continuing to train a pretrained model on a smaller, task-specific dataset so it adapts to your task, style or domain.

**Example:** Fine-tune a BERT model on 5,000 labelled Hindi-English support tickets to classify them into 8 categories.

**Don't confuse with:** RAG, which adds knowledge at query time without changing weights.

**Learn more:** [Fine-Tuning, LoRA and QLoRA](/interview/llms-genai/fine-tuning-lora-and-qlora)

### FLOPs (Floating-Point Operations)

A count of arithmetic operations (additions, multiplications) a model needs. Used to measure training and inference compute.

**Example:** A common estimate for training a Transformer is about 6 × parameters × training tokens FLOPs. For 1B parameters and 20B tokens: 6 × 10⁹ × 2×10¹⁰ = 1.2 × 10²⁰ FLOPs.

**Don't confuse with:** FLOPS (per second), a hardware speed.

**Learn more:** [Latency, Cost and Scale](/interview/ai-system-design/latency-cost-and-scale)

### Foundation Model

A large model pretrained on broad data that can be adapted to many tasks by prompting or fine-tuning.

**Example:** One LLM is used for summarizing, translating, coding and answering questions without separate models for each.

**Learn more:** [How LLMs Work](/interview/llms-genai/how-llms-work)

### Function Calling

A model feature where, instead of only text, the model can return a structured request to call a function you described, with JSON arguments. Your code runs it and sends back the result.

**Example:** User: "Weather in Pune?" → model returns `get_weather({"city": "Pune"})` → your code calls the weather API → model writes the final reply.

**Also called:** tool calling, tool use.

**Learn more:** [Tool Calling](/interview/llms-genai/tool-calling)

## G

### GELU (Gaussian Error Linear Unit)

A smooth activation function similar to ReLU but slightly curved near zero, and allows small negative outputs. Used in BERT, GPT and many Transformers.

**Example:** GELU(2) ≈ 1.95, GELU(0) = 0, GELU(−1) ≈ −0.16.

**Learn more:** [Activation Functions](/interview/deep-learning/activation-functions)

### Generalization

A model's ability to perform well on new data it has never seen, not just on training data.

**Example:** Training accuracy 98%, test accuracy 96% → good generalization. Training 99%, test 70% → poor (overfitting).

**Learn more:** [Overfitting, Regularization and Cross-Validation](/interview/machine-learning/overfitting-regularization-and-cross-validation)

### Generative AI

AI that creates new content (text, images, code, audio, video) instead of only labelling existing data.

**Example:** An LLM writes a product description; a diffusion model makes a poster image.

**Learn more:** [How LLMs Work](/interview/llms-genai/how-llms-work)

### Gini Impurity

A measure of how mixed a tree node is: 1 − Σ pᵢ². 0 means pure. Trees choose splits that lower it most.

**Example:** Node with 50% yes, 50% no → 1 − (0.25 + 0.25) = 0.5. Node with 90% / 10% → 1 − (0.81 + 0.01) = 0.18.

**Learn more:** [Decision Trees](/interview/machine-learning/decision-trees)

### GloVe (Global Vectors)

Static word embeddings from Stanford (2014), learned from global word co-occurrence counts in a large corpus.

**Example:** A pretrained GloVe file maps "cricket" to a fixed 100-dimension vector close to "batsman" and "wicket".

**Learn more:** [Word Embeddings](/interview/nlp-transformers/word-embeddings)

### Golden Dataset

A carefully checked set of test inputs with their ideal outputs (or grading notes), used to evaluate an AI app and catch regressions.

**Example:** 100 real customer questions, each with the correct answer and the document it should come from. Every prompt change is scored against it.

**Learn more:** [Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps)

### GPT (Generative Pre-trained Transformer)

OpenAI's family of decoder-only Transformers trained to predict the next token. "GPT" is also used loosely for any similar model.

**Example:** GPT-2 (2019) had up to 1.5 billion parameters; later GPT models are much larger.

**Learn more:** [BERT, GPT and T5](/interview/nlp-transformers/bert-gpt-and-t5)

### GPU (Graphics Processing Unit)

A chip with thousands of small cores that do many multiplications in parallel, which is exactly what matrix-heavy neural networks need.

**Example:** A matrix multiply that takes seconds on a CPU may take milliseconds on a GPU.

**Learn more:** [Training in Practice](/interview/deep-learning/training-in-practice)

### GPU Memory Estimate

A rough rule for how much GPU memory (VRAM) a model needs just for its weights: number of parameters × bytes per parameter. Add extra for the KV cache and activations.

**Example:** 7B parameters × 2 bytes (fp16) = 14 GB. In 4-bit: 7B × 0.5 bytes ≈ 3.5 GB.

**Learn more:** [Serving Models](/interview/mlops-deployment/serving-models)

### Gradient

A vector of all partial derivatives of a function. It points in the direction of steepest increase; going the opposite way reduces the loss.

**Example:** f(x, y) = x² + 3y → ∇f = [2x, 3]. At (1, 2) the gradient is [2, 3].

**Learn more:** [Derivatives, Gradients and the Chain Rule](/interview/math-for-ml/derivatives-gradients-and-the-chain-rule)

### Gradient Accumulation

Running several small batches, adding up their gradients, and updating weights once. It simulates a big batch when GPU memory is small.

**Example:** Batch size 8 with 4 accumulation steps behaves like batch size 32.

**Learn more:** [Training in Practice](/interview/deep-learning/training-in-practice)

### Gradient Boosting

A boosting method that adds trees one at a time; each new tree is trained to predict the remaining errors (residuals) of the trees so far. XGBoost, LightGBM and CatBoost implement it.

**Example:** True price 100. Tree 1 predicts 80 (residual 20). Tree 2 learns about +15. With learning rate 1, the prediction is now 95.

**Learn more:** [Ensembles, Random Forest and Boosting](/interview/machine-learning/ensembles-random-forest-and-boosting)

### Gradient Clipping

Limiting how large the gradient can be before each update, to avoid exploding gradients.

**Example:** `torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)` scales the whole gradient down if its norm is above 1.0.

**Learn more:** [Training in Practice](/interview/deep-learning/training-in-practice)

### Gradient Descent

Repeatedly move the weights a small step against the gradient to lower the loss: w ← w − η × gradient, where η is the learning rate.

**Example:** Loss (x − 3)², start x = 0, η = 0.1. Gradient = 2(0 − 3) = −6. New x = 0 − 0.1 × (−6) = 0.6. It keeps moving toward 3.

**Learn more:** [Gradient Descent and Loss Functions](/interview/machine-learning/gradient-descent-and-loss-functions)

### GraphRAG

A RAG approach (popularized by Microsoft) that first extracts entities and relationships from documents into a knowledge graph, then retrieves along the graph or from community summaries. Good for "big picture" questions across many documents.

**Example:** "Which suppliers are linked to delayed shipments in 2025?" needs connections across many reports, which a graph answers better than top-5 chunk search.

**Learn more:** [Advanced RAG](/interview/llms-genai/advanced-rag)

### Greedy Decoding

Always choosing the single most likely next token. It is deterministic but can be repetitive.

**Example:** Probabilities {"blue": 0.6, "clear": 0.3, "grey": 0.1} → always "blue". Same as temperature 0.

**Learn more:** [Generation Settings and the Context Window](/interview/llms-genai/generation-settings-and-the-context-window)

### Grid Search

Trying every combination of the hyperparameter values you list and keeping the best one by cross-validation score.

**Example:** max_depth ∈ {3, 5, 7} and n_estimators ∈ {100, 300} → 6 combinations; with 5-fold CV that is 30 model fits.

**Learn more:** [Pipelines and Hyperparameter Tuning](/interview/machine-learning/pipelines-and-hyperparameter-tuning)

### Grounding

Making the model's answer based on specific provided sources or facts rather than on its memory, often with citations.

**Example:** System prompt: "Answer only from the documents below. If the answer is not there, say you don't know. Cite the document id."

**Learn more:** [RAG Fundamentals](/interview/llms-genai/rag-fundamentals)

### GRU (Gated Recurrent Unit)

A recurrent unit like the LSTM but simpler, with two gates (update and reset) and no separate cell state. It trains faster and often works about as well.

**Example:** `nn.GRU(input_size=100, hidden_size=128, batch_first=True)`.

**Learn more:** [Recurrent Networks and LSTM](/interview/deep-learning/recurrent-networks-and-lstm)

### Guardrails

Checks placed around an LLM to block or fix unsafe inputs, outputs and actions: input filters, output validators, PII masking, topic limits, and human approval for risky tool calls.

**Example:** A banking bot rejects off-topic requests, masks account numbers in logs, and needs user confirmation before any transfer tool runs.

**Learn more:** [Safety, Guardrails and Prompt Injection](/interview/llms-genai/safety-guardrails-and-prompt-injection)
