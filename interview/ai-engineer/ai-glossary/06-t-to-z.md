---
title: T to Z
part: Glossary
summary: Terms from t-SNE to Z-Score, covering temperature, tensors, TF-IDF, tokens, tool calling, top-k and top-p, the Transformer, vanishing gradients, vector databases, vLLM, Word2Vec, XGBoost and zero-shot prompting.
---

How to use this glossary: scan the index table for a quick reminder, then open the full entry for the meaning, an example, and the chapter that teaches the idea in depth. Terms that start with a number or symbol are listed under the nearest letter.

| Term | One-line meaning |
|---|---|
| t-SNE (t-distributed Stochastic Neighbor Embedding) | Squashes high-dimensional data to 2-D for plotting |
| T5 (Text-to-Text Transfer Transformer) | Encoder-decoder model that treats every task as text in, text out |
| Tanh | Squashes numbers into −1 to 1 |
| Target Encoding | Replace a category with the average target for it |
| Temperature | Controls how random sampling is |
| Tensor | Multi-dimensional array, the basic data type in PyTorch |
| Test Set | Held-out data used once for the final score |
| TF-IDF (Term Frequency–Inverse Document Frequency) | Word weight: frequent here, rare elsewhere |
| TGI (Text Generation Inference) | Hugging Face's LLM serving server |
| Throughput | Requests or tokens handled per second |
| Time-Series Split | Validation that always trains on the past, tests on the future |
| Token | A small piece of text the model reads and writes |
| Token Cost | Money spent per input and output token |
| Tokenizer | Converts text to token ids and back |
| Tool (Agent Tool) | A function an LLM can ask your code to run |
| Tool Calling | The loop where the model requests tools and gets results |
| Top-k Sampling | Sample only from the k most likely tokens |
| Top-p Sampling | Sample from the smallest set covering probability p |
| Tracing | Recording every step of one request end to end |
| Trainer (Hugging Face) | Ready-made training loop for transformers models |
| Training Set | Data the model learns its parameters from |
| Transfer Learning | Reuse a model trained on one task for another |
| Transformer | Attention-based architecture behind modern LLMs |
| Transpose | Flip a matrix over its diagonal |
| True Positive and True Negative | Correctly found positive, correctly found negative |
| Truncation | Cutting text that is too long for the model |
| TTFT (Time to First Token) | Delay before the first output token appears |
| UMAP (Uniform Manifold Approximation and Projection) | Fast non-linear dimension reduction for visualization |
| Underfitting | Model too simple to learn the pattern |
| Undersampling | Remove majority-class examples to balance classes |
| Uniform Distribution | Every value in a range is equally likely |
| Universal Approximation Theorem | A wide enough network can approximate any continuous function |
| Unsupervised Learning | Finding structure in data without labels |
| Validation Set | Data used to tune and compare models during development |
| Vanishing Gradient | Gradients shrink toward zero in early layers |
| Variance (Model) | Error from being too sensitive to the training data |
| Variance (Statistics) | Average squared distance from the mean |
| Vector | An ordered list of numbers |
| Vector Database | Database built to store and search embeddings |
| Vertex AI | Google Cloud's ML and generative AI platform |
| Vision Transformer (ViT) | Transformer that reads an image as patches |
| vLLM | High-throughput open-source LLM serving engine |
| Vocabulary | The full set of tokens a tokenizer knows |
| Volume (Docker) | Storage that lives outside a container |
| Warmup | Start with a small learning rate and raise it |
| Weight | A learned number that scales an input |
| Weight Decay | Shrinking weights a little at every step |
| Word Embedding | A vector for each word |
| Word2Vec | 2013 method that learns word vectors from context |
| WordPiece | Subword tokenizer used by BERT |
| Workflow (vs Agent) | Fixed sequence of LLM steps chosen by your code |
| XGBoost (Extreme Gradient Boosting) | Popular regularized gradient boosting library |
| XML Tags (Prompting) | Tags like `<context>` that separate parts of a prompt |
| YAML | Human-friendly config file format |
| YOLO (You Only Look Once) | Fast single-pass object detection model family |
| Z-Score | How many standard deviations a value is from the mean |
| Zero-Shot Classification | Classify into labels the model was never trained on |
| Zero-Shot Prompting | Asking for a task with instructions but no examples |

## T

### t-SNE (t-distributed Stochastic Neighbor Embedding)

A non-linear method that maps high-dimensional data to 2 or 3 dimensions for plotting, keeping close neighbours close. Good for pictures, not as model features, and distances between far clusters mean little.

**Example:** Plot 10,000 MNIST images (784 dims) in 2-D; the 10 digits appear as 10 separate blobs.

**Learn more:** [Dimensionality Reduction: PCA](/interview/ai-engineer/machine-learning/dimensionality-reduction-pca)

### T5 (Text-to-Text Transfer Transformer)

Google's encoder-decoder Transformer (2019) that frames every task as text in, text out, using a task prefix.

**Example:** "translate English to German: Thank you" → "Danke". "summarize: <article>" → summary.

**Learn more:** [BERT, GPT and T5](/interview/ai-engineer/nlp-transformers/bert-gpt-and-t5)

### Tanh

The hyperbolic tangent activation, which squashes inputs into the range −1 to 1 and is centred at 0. Used inside RNNs and LSTMs.

**Example:** tanh(0) = 0, tanh(1) ≈ 0.76, tanh(−1) ≈ −0.76.

**Learn more:** [Activation Functions](/interview/ai-engineer/deep-learning/activation-functions)

### Target Encoding

Replacing each category with the average target value for that category, computed on training data (ideally out-of-fold to avoid leakage). Useful for categories with many values.

**Example:** Churn rate by city: Pune 0.12, Patna 0.30 → the "city" column becomes 0.12 or 0.30.

**Learn more:** [Data Preparation and Feature Engineering](/interview/ai-engineer/machine-learning/data-preparation-and-feature-engineering)

### Temperature

A setting that divides the logits before softmax. Low temperature (< 1) makes the top token more likely (focused, repeatable); high temperature (> 1) flattens the probabilities (more random, creative).

**Example:** Logits [2, 1, 0]. At T = 1: probabilities [0.67, 0.24, 0.09]. At T = 0.5 the logits become [4, 2, 0]: [0.87, 0.12, 0.02]. At T = 2 they become [1, 0.5, 0]: [0.51, 0.31, 0.19].

**Learn more:** [Generation Settings and the Context Window](/interview/ai-engineer/llms-genai/generation-settings-and-the-context-window)

### Tensor

A multi-dimensional array of numbers: a scalar is 0-D, a vector 1-D, a matrix 2-D, and so on. PyTorch tensors can live on a GPU and track gradients.

**Example:** `torch.zeros(32, 3, 224, 224)` is a 4-D tensor: batch, channels, height, width.

**Learn more:** [PyTorch Tensors and Autograd](/interview/ai-engineer/deep-learning/pytorch-tensors-and-autograd)

### Test Set

Data kept completely aside until the end and used once to estimate real-world performance. Never tune on it.

**Example:** 70% train, 15% validation, 15% test. You try 20 models using validation, then report the chosen one's test score.

**Learn more:** [What Is Machine Learning](/interview/ai-engineer/machine-learning/what-is-machine-learning)

### TF-IDF (Term Frequency–Inverse Document Frequency)

A word weight that is high when a word appears often in this document but rarely in other documents: TF × log(N ÷ df).

**Example:** "refund" appears 3 times in a 100-word document (TF = 0.03) and in 100 of 10,000 documents (IDF = log₁₀(100) = 2) → TF-IDF = 0.06. "the" appears everywhere, so its IDF ≈ 0.

**Learn more:** [Text as Data](/interview/ai-engineer/nlp-transformers/text-as-data)

### TGI (Text Generation Inference)

Hugging Face's server for serving LLMs, with continuous batching, streaming and quantization support. Check its current maintenance status before choosing it; vLLM is a common alternative.

**Example:** `docker run --gpus all -p 8080:80 ghcr.io/huggingface/text-generation-inference --model-id <model>`.

**Learn more:** [Serving Models](/interview/ai-engineer/mlops-deployment/serving-models)

### Throughput

How much work a system completes per unit time, such as requests per second or output tokens per second across all users.

**Example:** One GPU server produces 2,000 output tokens per second in total while serving 40 users at about 50 tokens per second each.

**Don't confuse with:** latency (time for one request). Bigger batches raise throughput but can raise latency.

**Learn more:** [Latency, Cost and Scale](/interview/ai-engineer/ai-system-design/latency-cost-and-scale)

### Time-Series Split

Validation for time-ordered data where each fold trains only on earlier data and tests on later data, so the model never "sees the future".

**Example:** Train Jan–Jun, test Jul; train Jan–Jul, test Aug; train Jan–Aug, test Sep. `TimeSeriesSplit(n_splits=3)`.

**Learn more:** [Overfitting, Regularization and Cross-Validation](/interview/ai-engineer/machine-learning/overfitting-regularization-and-cross-validation)

### Token

The unit of text an LLM reads and writes: a word, part of a word, a punctuation mark or a byte. In English, one token is about 4 characters or about 0.75 words on average; Hindi and other languages often need more tokens per word.

**Example:** "unbelievable" might be split into "un", "believ", "able" = 3 tokens. Exact splits depend on the tokenizer.

**Learn more:** [Tokenization](/interview/ai-engineer/nlp-transformers/tokenization)

### Token Cost

LLM APIs charge per token, usually as a price per million input tokens and a higher price per million output tokens. Prices change often, so always check the provider's page.

**Example:** Suppose input costs ₹250 and output ₹1,250 per million tokens (made-up prices). A request with 2,000 input and 500 output tokens costs 2,000 × 250 ÷ 10⁶ + 500 × 1,250 ÷ 10⁶ = ₹0.50 + ₹0.625 = ₹1.125.

**Learn more:** [Latency, Cost and Scale](/interview/ai-engineer/ai-system-design/latency-cost-and-scale)

### Tokenizer

The component that splits text into tokens and maps them to integer ids (and back). Every model must use the tokenizer it was trained with.

**Example:**

```python
from transformers import AutoTokenizer
tok = AutoTokenizer.from_pretrained("bert-base-uncased")
print(tok("I love you")["input_ids"])  # Output: [101, 1045, 2293, 2017, 102]
```

(101 and 102 are the [CLS] and [SEP] special tokens.)

**Learn more:** [Tokenization](/interview/ai-engineer/nlp-transformers/tokenization)

### Tool (Agent Tool)

A function your application exposes to an LLM, described by a name, a description and a JSON schema for its inputs. The model decides when to call it; your code actually runs it.

**Example:**

```python
tools = [{"name": "get_order_status",
          "description": "Get the delivery status of an order by its id",
          "input_schema": {"type": "object",
                           "properties": {"order_id": {"type": "string"}},
                           "required": ["order_id"]}}]
```

**Learn more:** [Tool Calling](/interview/ai-engineer/llms-genai/tool-calling)

### Tool Calling

The request–response loop where you send tool definitions, the model replies with a tool-use request (name + arguments), your code runs the tool, sends the result back, and the model continues until it gives a final answer.

**Example:** User: "Where is order 4521?" → model: `get_order_status({"order_id": "4521"})` → your code returns "Out for delivery" → model: "Your order is out for delivery today."

**Also called:** function calling, tool use.

**Learn more:** [Tool Calling](/interview/ai-engineer/llms-genai/tool-calling)

### Top-k Sampling

At each step, keep only the k most likely tokens, renormalize their probabilities, and sample from them.

**Example:** k = 2 with probabilities {A: 0.5, B: 0.3, C: 0.2} → keep A and B → renormalize to {A: 0.625, B: 0.375}.

**Learn more:** [Generation Settings and the Context Window](/interview/ai-engineer/llms-genai/generation-settings-and-the-context-window)

### Top-p Sampling

Keep the smallest set of most likely tokens whose probabilities add up to at least p, then sample from that set. The set size adapts to how confident the model is.

**Example:** p = 0.9 with {A: 0.5, B: 0.3, C: 0.15, D: 0.05}: A + B = 0.8 < 0.9, A + B + C = 0.95 ≥ 0.9 → sample from A, B, C.

**Also called:** nucleus sampling.

**Learn more:** [Generation Settings and the Context Window](/interview/ai-engineer/llms-genai/generation-settings-and-the-context-window)

### Tracing

Recording each step of a single request (retrieval, each LLM call, each tool call) with inputs, outputs, timing and cost, linked under one trace id. Essential for debugging agents.

**Example:** Trace 7f3a: retrieve (90 ms) → LLM call 1 (1.2 s, 1,800 tokens) → tool `search` (600 ms) → LLM call 2 (0.9 s).

**Learn more:** [Monitoring, Cost and Caching](/interview/ai-engineer/mlops-deployment/monitoring-cost-and-caching)

### Trainer (Hugging Face)

A class in the `transformers` library that runs the full training loop for you: batching, optimizer, learning rate schedule, evaluation, checkpointing and mixed precision.

**Example:**

```python
from transformers import Trainer, TrainingArguments
args = TrainingArguments(output_dir="out", num_train_epochs=3, learning_rate=2e-5)
trainer = Trainer(model=model, args=args, train_dataset=train_ds, eval_dataset=val_ds)
trainer.train()
```

**Learn more:** [Fine-Tuning a Transformer](/interview/ai-engineer/nlp-transformers/fine-tuning-a-transformer)

### Training Set

The part of the data the model learns its parameters from.

**Example:** Of 10,000 labelled emails, 7,000 are the training set.

**Learn more:** [What Is Machine Learning](/interview/ai-engineer/machine-learning/what-is-machine-learning)

### Transfer Learning

Starting from a model already trained on a large dataset and adapting it to your task, either by using it as a fixed feature extractor or by fine-tuning some or all of its layers. You need much less data.

**Example:** Take a ResNet pretrained on ImageNet, replace its final layer with a 5-class layer for 5 Indian food dishes, and train with only 500 photos.

**Learn more:** [Transfer Learning and Pretrained Models](/interview/ai-engineer/deep-learning/transfer-learning-and-pretrained-models)

### Transformer

A neural network architecture (from the 2017 paper "Attention Is All You Need") built from stacked blocks of multi-head self-attention and feed-forward layers, with residual connections and layer normalization. It processes all tokens in parallel and is the base of all modern LLMs.

**Example:** BERT-base stacks 12 Transformer encoder blocks; GPT-style models stack decoder blocks.

**Learn more:** [The Transformer Architecture](/interview/ai-engineer/nlp-transformers/the-transformer-architecture)

### Transpose

Flipping a matrix over its diagonal so rows become columns. Shape (m, n) becomes (n, m).

**Example:** [[1, 2, 3], [4, 5, 6]]ᵀ = [[1, 4], [2, 5], [3, 6]]. In attention, Q·Kᵀ uses a transpose.

**Learn more:** [Matrix Operations and NumPy](/interview/ai-engineer/math-for-ml/matrix-operations-and-numpy)

### True Positive and True Negative

A true positive (TP) is a positive case correctly predicted as positive. A true negative (TN) is a negative case correctly predicted as negative.

**Example:** A fraud model flags a real fraud (TP) and lets a normal payment pass (TN).

**Learn more:** [Evaluation Metrics](/interview/ai-engineer/machine-learning/evaluation-metrics)

### Truncation

Cutting input that is longer than the model's maximum length, usually from the end. Important information can be lost, so chunk or summarize long texts instead when it matters.

**Example:** BERT's limit is 512 tokens; a 900-token review is cut to its first 512 tokens with `truncation=True, max_length=512`.

**Learn more:** [Tokenization](/interview/ai-engineer/nlp-transformers/tokenization)

### TTFT (Time to First Token)

The time from sending a request until the first output token arrives. It is driven by queueing and by processing the prompt (prefill), and it is what users "feel" in a streaming chat.

**Example:** TTFT 400 ms, then 60 tokens/s → a 300-token answer finishes in about 0.4 + 5 = 5.4 s, but the user sees text after 0.4 s.

**Learn more:** [Latency, Cost and Scale](/interview/ai-engineer/ai-system-design/latency-cost-and-scale)

## U

### UMAP (Uniform Manifold Approximation and Projection)

A non-linear dimensionality reduction method, like t-SNE but usually faster and better at keeping some global structure. Popular for visualizing embeddings.

**Example:** Reduce 50,000 support-ticket embeddings to 2-D with UMAP and colour them by category to spot topic clusters.

**Learn more:** [Dimensionality Reduction: PCA](/interview/ai-engineer/machine-learning/dimensionality-reduction-pca)

### Underfitting

The model is too simple (or trained too little) to capture the pattern, so it performs badly even on training data.

**Example:** Training accuracy 62%, validation 60% on a task where 90% is possible. Fixes: more features, a more complex model, less regularization, longer training.

**Learn more:** [Overfitting, Regularization and Cross-Validation](/interview/ai-engineer/machine-learning/overfitting-regularization-and-cross-validation)

### Undersampling

Balancing classes by randomly removing examples from the majority class. Fast, but it throws away data.

**Example:** 9,900 normal and 100 fraud → keep 1,000 normal and all 100 fraud for training.

**Don't confuse with:** oversampling (SMOTE), which adds minority examples.

**Learn more:** [Data Preparation and Feature Engineering](/interview/ai-engineer/machine-learning/data-preparation-and-feature-engineering)

### Uniform Distribution

Every value in a range is equally likely.

**Example:** A fair die: each face has probability 1/6. `np.random.uniform(0, 1)` gives any number between 0 and 1 with equal chance.

**Learn more:** [Distributions and Statistics](/interview/ai-engineer/math-for-ml/distributions-and-statistics)

### Universal Approximation Theorem

A result showing that a neural network with one hidden layer and enough neurons (with a non-linear activation) can approximate any continuous function on a bounded range as closely as you want. It says such a network exists, not that training will find it easily.

**Example:** A small network with enough ReLU units can fit the curve y = sin(x) on [0, 2π] very closely.

**Learn more:** [From Neuron to Neural Network](/interview/ai-engineer/deep-learning/from-neuron-to-neural-network)

### Unsupervised Learning

Learning patterns from data that has no labels, such as groups, structure or unusual points.

**Example:** Clustering customers by purchase behaviour, or reducing dimensions with PCA.

**Learn more:** [What Is Machine Learning](/interview/ai-engineer/machine-learning/what-is-machine-learning)

## V

### Validation Set

Data held out from training and used to choose hyperparameters, compare models and decide when to stop training.

**Example:** You try learning rates 1e-3 and 1e-4 and keep the one with lower validation loss.

**Don't confuse with:** the test set, which is used only once at the end.

**Learn more:** [What Is Machine Learning](/interview/ai-engineer/machine-learning/what-is-machine-learning)

### Vanishing Gradient

Gradients become tiny as they are multiplied backward through many layers or time steps, so early layers barely learn. Common with sigmoid/tanh and plain RNNs.

**Example:** Sigmoid's derivative is at most 0.25; through 10 layers, 0.25¹⁰ ≈ 0.00000095. Fixes: ReLU, residual connections, normalization, LSTM/GRU.

**Learn more:** [Loss Functions and Backpropagation](/interview/ai-engineer/deep-learning/loss-functions-and-backpropagation)

### Variance (Model)

Error from a model being too sensitive to the exact training data, so small changes in data change it a lot. High variance means overfitting.

**Example:** A very deep decision tree gives very different predictions when trained on two random halves of the same data.

**Learn more:** [Overfitting, Regularization and Cross-Validation](/interview/ai-engineer/machine-learning/overfitting-regularization-and-cross-validation)

### Variance (Statistics)

The average squared distance of values from their mean. Its square root is the standard deviation.

**Example:** [2, 4, 6]: mean 4; squared distances 4, 0, 4; variance = 8 ÷ 3 ≈ 2.67 (population).

**Learn more:** [Distributions and Statistics](/interview/ai-engineer/math-for-ml/distributions-and-statistics)

### Vector

An ordered list of numbers. It can describe a point, a direction, a data row, or an embedding.

**Example:** A house as [1200 (sq ft), 3 (rooms), 10 (years old)] is a 3-dimensional vector.

**Learn more:** [Vectors and Matrices](/interview/ai-engineer/math-for-ml/vectors-and-matrices)

### Vector Database

A database designed to store embeddings with their metadata and quickly find the nearest vectors to a query, using ANN indexes such as HNSW or IVF. Examples: Chroma, Pinecone, Qdrant, Weaviate, Milvus, and pgvector in Postgres.

**Example:**

```python
import chromadb
col = chromadb.Client().create_collection("docs")
col.add(ids=["1", "2"], documents=["Refunds take 5-7 days", "We deliver in 48 hours"])
print(col.query(query_texts=["How long for my money back?"], n_results=1)["documents"])
```

**Learn more:** [Vector Databases](/interview/ai-engineer/llms-genai/vector-databases)

### Vertex AI

Google Cloud's platform for training, deploying and monitoring ML models, and for using Google's Gemini models and other foundation models through an API.

**Example:** Deploy a custom model to a Vertex AI endpoint, or call a Gemini model from the same project with Google Cloud credentials.

**Learn more:** [Cloud for AI](/interview/ai-engineer/mlops-deployment/cloud-for-ai)

### Vision Transformer (ViT)

A Transformer for images: the image is cut into fixed-size patches, each patch is turned into a vector like a token, and standard Transformer layers process them.

**Example:** A 224×224 image with 16×16 patches → (224 ÷ 16)² = 14² = 196 patch tokens.

**Learn more:** [Transfer Learning and Pretrained Models](/interview/ai-engineer/deep-learning/transfer-learning-and-pretrained-models)

### vLLM

An open-source, high-throughput LLM serving engine. Its PagedAttention manages KV-cache memory in small pages like an operating system, and it uses continuous batching. It offers an OpenAI-compatible API.

**Example:** `vllm serve <model-name>` starts a server at `http://localhost:8000/v1` that the `openai` SDK can call.

**Learn more:** [Serving Models](/interview/ai-engineer/mlops-deployment/serving-models)

### Vocabulary

The full list of tokens a tokenizer knows, each with an integer id. The model's output layer has one score (logit) per vocabulary token.

**Example:** BERT-base uncased has 30,522 tokens; many modern LLMs have vocabularies of roughly 100,000 or more.

**Learn more:** [Tokenization](/interview/ai-engineer/nlp-transformers/tokenization)

### Volume (Docker)

Storage managed by Docker that lives outside the container's own filesystem, so data survives when the container is removed or replaced.

**Example:** `docker run -v qdrant_data:/qdrant/storage qdrant/qdrant` keeps your vectors even after the container restarts.

**Learn more:** [Docker Basics](/interview/ai-engineer/mlops-deployment/docker-basics)

## W

### Warmup

Starting training with a very small learning rate and increasing it over the first steps, so early updates (when weights are random and Adam's statistics are unreliable) do not destabilize the model.

**Example:** Learning rate rises linearly from 0 to 5e-5 over the first 500 steps, then decays.

**Learn more:** [Optimizers and Learning Rate](/interview/ai-engineer/deep-learning/optimizers-and-learning-rate)

### Weight

A learned number that says how strongly one input affects a neuron's output. Training adjusts weights to reduce the loss.

**Example:** In z = 0.8 × study_hours + 0.1 × sleep_hours + b, the weight of study hours (0.8) is much larger.

**Learn more:** [From Neuron to Neural Network](/interview/ai-engineer/deep-learning/from-neuron-to-neural-network)

### Weight Decay

At every update, shrink all weights slightly toward zero, which acts as regularization. In AdamW it is applied directly to the weights, separate from the gradient step.

**Example:** With learning rate 0.01 and weight decay 0.1, each step multiplies weights by about (1 − 0.01 × 0.1) = 0.999 before the gradient update.

**Learn more:** [Regularization, Dropout and Batch Norm](/interview/ai-engineer/deep-learning/regularization-dropout-and-batch-norm)

### Word Embedding

A dense vector for each word, learned so that words used in similar contexts get similar vectors.

**Example:** vector("king") − vector("man") + vector("woman") ≈ vector("queen").

**Learn more:** [Word Embeddings](/interview/ai-engineer/nlp-transformers/word-embeddings)

### Word2Vec

A 2013 method from Google that learns static word embeddings with a shallow network, using CBOW or skip-gram training on large text.

**Example:** After training on news text, the nearest words to "Mumbai" include other big Indian cities.

**Learn more:** [Word Embeddings](/interview/ai-engineer/nlp-transformers/word-embeddings)

### WordPiece

A subword tokenization method used by BERT. Like BPE it builds a vocabulary of word pieces, but it picks merges by how much they increase training-data likelihood. Pieces inside a word start with "##".

**Example:** "playing" → ["play", "##ing"].

**Learn more:** [Tokenization](/interview/ai-engineer/nlp-transformers/tokenization)

### Workflow (vs Agent)

A system where your code fixes the sequence of LLM calls and tools in advance (for example retrieve → answer → check). It is more predictable, cheaper and easier to test than an agent; use an agent only when the steps cannot be known ahead.

**Example:** An invoice pipeline always does extract fields → validate totals → save to DB. No agent loop needed.

**Learn more:** [AI Agents](/interview/ai-engineer/llms-genai/ai-agents)

## X

### XGBoost (Extreme Gradient Boosting)

A fast, widely used gradient boosting library with built-in regularization, missing-value handling and parallel tree building. Often a top choice for tabular data.

**Example:** `XGBClassifier(n_estimators=500, max_depth=6, learning_rate=0.05)`.

**Learn more:** [Ensembles, Random Forest and Boosting](/interview/ai-engineer/machine-learning/ensembles-random-forest-and-boosting)

### XML Tags (Prompting)

Using tags such as `<context>`, `<instructions>` and `<example>` to clearly separate parts of a prompt, so the model knows what is data and what is instruction. Claude models are trained to pay attention to such structure.

**Example:**

```text
<context>
{retrieved chunks}
</context>
<question>What is the refund window?</question>
Answer only from the context.
```

**Learn more:** [Prompt Engineering](/interview/ai-engineer/llms-genai/prompt-engineering)

## Y

### YAML

A human-friendly text format for configuration, based on indentation. Docker Compose, GitHub Actions and Kubernetes all use it.

**Example:**

```yaml
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pytest
```

**Learn more:** [CI/CD and Testing for AI](/interview/ai-engineer/mlops-deployment/ci-cd-and-testing-for-ai)

### YOLO (You Only Look Once)

A family of real-time object detection models that predict all bounding boxes and classes in a single pass over the image, instead of looking at many regions separately.

**Example:** A traffic camera runs a YOLO model to draw boxes around cars, bikes and autos many times per second.

**Learn more:** [Convolutional Neural Networks](/interview/ai-engineer/deep-learning/convolutional-neural-networks)

## Z

### Z-Score

How many standard deviations a value is above or below the mean: z = (x − μ) ÷ σ. Used for standardization and outlier detection (|z| > 3 is often flagged).

**Example:** Marks 80, class mean 60, std 10 → z = 2, i.e. 2 standard deviations above average.

**Learn more:** [Distributions and Statistics](/interview/ai-engineer/math-for-ml/distributions-and-statistics)

### Zero-Shot Classification

Classifying text into labels the model was not specifically trained on, by asking an LLM or by using an NLI model that checks "This text is about {label}".

**Example:**

```python
from transformers import pipeline
clf = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
clf("My UPI payment failed twice", candidate_labels=["payments", "delivery", "login"])
# Output: highest score on "payments"
```

**Learn more:** [Hugging Face in Practice](/interview/ai-engineer/nlp-transformers/hugging-face-in-practice)

### Zero-Shot Prompting

Giving the model only an instruction, with no worked examples, and relying on what it already knows.

**Example:** "Classify this review as positive or negative: 'The phone heats up a lot.'" → "negative".

**Don't confuse with:** few-shot prompting, which includes examples.

**Learn more:** [Prompt Engineering](/interview/ai-engineer/llms-genai/prompt-engineering)
