---
title: Q to S
part: Glossary
summary: Terms from 4-bit Quantization to System Prompt, covering QLoRA, Query/Key/Value, RAG, ReAct, recall, reranking, RLHF, ROC, self-attention, softmax, streaming, SVM and more.
---

How to use this glossary: scan the index table for a quick reminder, then open the full entry for the meaning, an example, and the chapter that teaches the idea in depth. Terms that start with a number or symbol are listed under the nearest letter (for example, 4-bit and 8-bit quantization are under Q, and R² is under R).

| Term | One-line meaning |
|---|---|
| 4-bit Quantization | Store each weight in 4 bits to cut memory about 4× vs fp16 |
| 8-bit (INT8) Quantization | Store each weight as an 8-bit integer |
| QLoRA (Quantized LoRA) | LoRA on top of a 4-bit frozen base model |
| Qdrant | Open-source vector database written in Rust |
| Quantization | Using fewer bits per number to make models smaller and faster |
| Query, Key and Value | The three vectors each token makes for attention |
| Query Rewriting | Turning a vague user question into a better search query |
| Queue (Message Queue) | Buffer that holds jobs until workers process them |
| Qwen | Alibaba's family of open-weight LLMs |
| R² (R-Squared) | Share of variance in the target explained by the model |
| RAG (Retrieval-Augmented Generation) | Retrieve relevant documents, then let the LLM answer from them |
| RAGAS | Open-source library of RAG evaluation metrics |
| Random Forest | Many decision trees on random data and feature subsets, voting |
| Random Search | Try random hyperparameter combinations |
| Rate Limit | Cap on requests or tokens per minute |
| ReAct (Reason + Act) | Agent loop that alternates thinking and tool use |
| Reasoning Model | LLM trained to think at length before answering |
| Recall | Of real positives, how many the model found |
| Reciprocal Rank Fusion (RRF) | Merge ranked lists by summing 1/(k + rank) |
| Recommendation System | Suggests items a user is likely to want |
| Red Teaming | Deliberately attacking a model to find failures |
| Regression | Predicting a number |
| Regularization | Techniques that reduce overfitting |
| Reinforcement Learning (RL) | Learning by trial, error and reward |
| ReLU (Rectified Linear Unit) | max(0, x) |
| Reranking | Re-scoring retrieved results with a stronger model |
| Residual Connection | Adding a layer's input to its output |
| ResNet (Residual Network) | CNN family built from residual blocks |
| Retry with Exponential Backoff | Retry failed calls with growing waits |
| Reward Model | Model that scores how good a response is |
| RLHF (Reinforcement Learning from Human Feedback) | Tune an LLM toward human-preferred answers |
| RMSE (Root Mean Squared Error) | Square root of MSE; in the target's units |
| RMSProp | Optimizer that divides by a running average of squared gradients |
| RNN (Recurrent Neural Network) | Network that reads a sequence step by step with memory |
| ROC Curve | True positive rate vs false positive rate over thresholds |
| RoPE (Rotary Position Embedding) | Encodes position by rotating query and key vectors |
| ROUGE | Overlap metric for summaries, recall-oriented |
| Sampling (Text Generation) | Picking the next token randomly by its probability |
| Scaled Dot-Product Attention | softmax(QKᵀ ÷ √d) · V |
| Scaling Laws | Loss falls predictably as model, data and compute grow |
| Self-Attention | Attention where a sequence attends to itself |
| Semantic Caching | Reuse a stored answer for a similar-meaning question |
| Semantic Search | Search by meaning using embeddings |
| Sentence Embedding | One vector for a whole sentence or paragraph |
| SentencePiece | Tokenizer library that works on raw text including spaces |
| SFT (Supervised Fine-Tuning) | Fine-tuning on input–ideal output pairs |
| Shadow Deployment | New model gets copies of live traffic but its output is hidden |
| Sigmoid | Squashes any number into 0–1 |
| Silhouette Score | How well each point fits its cluster vs the next one |
| Skip-Gram | Word2Vec variant that predicts neighbours from a word |
| SMOTE (Synthetic Minority Over-sampling Technique) | Creates synthetic minority-class examples |
| Softmax | Turns scores into probabilities that sum to 1 |
| Special Tokens | Reserved tokens like [CLS], [SEP], <eos> |
| SSE (Server-Sent Events) | One-way HTTP stream from server to browser |
| Standard Deviation | Typical distance of values from the mean |
| Standardization | Rescale to mean 0 and standard deviation 1 |
| Stochastic Gradient Descent (SGD) | Update weights using one example or a small batch |
| Stop Sequence | Text that makes the model stop generating |
| Stratified Split | Split that keeps class proportions the same |
| Streaming | Sending tokens to the user as they are generated |
| Stride | How many pixels a filter moves each step |
| Structured Output | Forcing the model to reply in a fixed format such as JSON |
| Supervised Learning | Learning from labelled examples |
| Supervisor (Agent Pattern) | A manager agent that routes work to specialist agents |
| SVM (Support Vector Machine) | Classifier that finds the widest-margin boundary |
| Synthetic Data | Artificially generated training or test data |
| System Prompt | Top-level instructions that set the model's role and rules |

## Q

### 4-bit Quantization

Storing each model weight in only 4 bits instead of 16. Memory for weights drops about 4×, with a small quality loss when done well (for example NF4, GPTQ or AWQ methods).

**Example:** A 7B model needs about 14 GB in fp16 but about 3.5 GB (plus some overhead) in 4-bit, so it fits on a laptop GPU.

**Learn more:** [Fine-Tuning, LoRA and QLoRA](/interview/ai-engineer/llms-genai/fine-tuning-lora-and-qlora)

### 8-bit (INT8) Quantization

Storing each weight as an 8-bit integer plus a scale factor. Memory halves compared with fp16 and quality loss is usually very small.

**Example:** Weights in the range −1.0 to 1.0 map to integers −127 to 127 with scale 1/127; 0.5 is stored as about 64.

**Learn more:** [Fine-Tuning, LoRA and QLoRA](/interview/ai-engineer/llms-genai/fine-tuning-lora-and-qlora)

### QLoRA (Quantized LoRA)

Fine-tuning with LoRA adapters while the frozen base model is loaded in 4-bit (NF4) to save memory. Gradients flow through the 4-bit weights into the small 16-bit adapters.

**Example:** Fine-tuning a 7B model needs far more than 14 GB with full fine-tuning, but QLoRA can do it on a single 16–24 GB GPU.

**Learn more:** [Fine-Tuning, LoRA and QLoRA](/interview/ai-engineer/llms-genai/fine-tuning-lora-and-qlora)

### Qdrant

An open-source vector database written in Rust, with HNSW search, rich payload (metadata) filtering, and both self-hosted and cloud options.

**Example:** `docker run -p 6333:6333 qdrant/qdrant` starts a local Qdrant server.

**Learn more:** [Vector Databases](/interview/ai-engineer/llms-genai/vector-databases)

### Quantization

Representing weights (and sometimes activations) with fewer bits, such as 8 or 4 instead of 16 or 32. Models get smaller and often faster, at some cost in accuracy.

**Example:** fp32 = 4 bytes per weight, fp16/bf16 = 2, int8 = 1, 4-bit = 0.5.

**Learn more:** [Serving Models](/interview/ai-engineer/mlops-deployment/serving-models)

### Query, Key and Value

In attention, each token produces three vectors by multiplying its embedding by three learned matrices. The **query** asks "what am I looking for?", the **key** says "what do I contain?", and the **value** is the information passed on. Query–key dot products decide the weights over values.

**Example:** For "it" in "The cat sat because it was tired", the query of "it" matches the key of "cat" strongly, so "it" takes most of its value from "cat".

**Learn more:** [Attention Step by Step](/interview/ai-engineer/nlp-transformers/attention-step-by-step)

### Query Rewriting

Using an LLM (or rules) to turn the user's message into a clearer, standalone search query before retrieval.

**Example:** Chat history about "SBI home loan"; user asks "what about the interest?" → rewritten query: "SBI home loan interest rate".

**Learn more:** [Advanced RAG](/interview/ai-engineer/llms-genai/advanced-rag)

### Queue (Message Queue)

A buffer where producers put jobs and workers take them out to process later. It smooths traffic spikes and lets slow work (like embedding 10,000 PDFs) run in the background.

**Example:** The upload API puts "embed file 123" on a queue and replies at once; 4 worker processes pick up jobs from the queue.

**Learn more:** [Queues and Streams](/interview/system-design/queues-and-streams)

### Qwen

Alibaba Cloud's family of open-weight LLMs, available in many sizes and strong in multilingual and coding tasks. Versions change often; check the current release.

**Example:** You can load a small Qwen instruct model from the Hugging Face Hub and run it on one GPU.

**Learn more:** [BERT, GPT and T5](/interview/ai-engineer/nlp-transformers/bert-gpt-and-t5)

## R

### R² (R-Squared)

The share of the target's variance that the regression model explains: 1 − (SS_res ÷ SS_tot). 1 is perfect; 0 means no better than predicting the mean; it can be negative for a very bad model.

**Example:** Sum of squared errors 20, total sum of squares around the mean 100 → R² = 1 − 20/100 = 0.8.

**Learn more:** [Linear Regression](/interview/ai-engineer/machine-learning/linear-regression)

### RAG (Retrieval-Augmented Generation)

A pattern where you first retrieve relevant pieces of your own documents, put them in the prompt, and ask the LLM to answer from them. It gives the model fresh, private knowledge and reduces hallucination, without retraining.

**Example:** Pipeline: load PDFs → chunk → embed → store in a vector DB → embed the question → retrieve top 5 chunks → add them to the prompt → generate an answer with citations.

**Don't confuse with:** fine-tuning, which changes the model's weights.

**Learn more:** [RAG Fundamentals](/interview/ai-engineer/llms-genai/rag-fundamentals)

### RAGAS

An open-source Python library that computes RAG evaluation metrics such as faithfulness, answer relevancy, context precision and context recall, mostly using an LLM as the judge.

**Example:** You give it 50 rows of (question, answer, retrieved contexts, reference answer) and get an average score for each metric.

**Learn more:** [Evaluating LLM Apps](/interview/ai-engineer/llms-genai/evaluating-llm-apps)

### Random Forest

A bagging ensemble of decision trees. Each tree trains on a random resample of rows and considers only a random subset of features at each split; predictions are averaged or voted.

**Example:** `RandomForestClassifier(n_estimators=300, max_features="sqrt")`. Strong default for tabular data with little tuning.

**Learn more:** [Ensembles, Random Forest and Boosting](/interview/ai-engineer/machine-learning/ensembles-random-forest-and-boosting)

### Random Search

Trying a fixed number of random combinations from hyperparameter ranges. With the same budget it often beats grid search because it tests more distinct values of the important parameters.

**Example:** 20 random trials over learning rate in [1e-4, 1e-1] (log scale) and depth in 2–10.

**Learn more:** [Pipelines and Hyperparameter Tuning](/interview/ai-engineer/machine-learning/pipelines-and-hyperparameter-tuning)

### Rate Limit

A cap set by an API provider on how many requests or tokens you can send per minute. Going over returns HTTP 429 ("Too Many Requests").

**Example:** If your limit is 50 requests per minute and a batch job sends 200 at once, about 150 fail with 429 unless you queue and retry.

**Learn more:** [Using LLM APIs](/interview/ai-engineer/llms-genai/using-llm-apis)

### ReAct (Reason + Act)

An agent pattern where the model alternates between a reasoning step (Thought), a tool call (Action) and reading the result (Observation), until it can answer.

**Example:**

```text
Thought: I need today's USD to INR rate.
Action: get_rate(from="USD", to="INR")
Observation: 1 USD = 84.1 INR
Thought: 50 × 84.1 = 4205.
Answer: 50 USD is about ₹4,205.
```

(The rate is an example value.)

**Learn more:** [AI Agents](/interview/ai-engineer/llms-genai/ai-agents)

### Reasoning Model

An LLM trained (often with reinforcement learning on problems with checkable answers) to produce a long internal chain of thought before its final answer. It is better at maths, code and planning but slower and uses more tokens.

**Example:** For a tricky scheduling puzzle, the model "thinks" for a few thousand tokens, checking options, then gives a short final answer. Many APIs let you set a thinking budget.

**Learn more:** [The LLM Training Pipeline](/interview/ai-engineer/llms-genai/the-llm-training-pipeline)

### Recall

Of all items that are really positive, the share the model found: TP ÷ (TP + FN). High recall = few misses.

**Example:** 60 fraud cases exist; the model catches 40 → recall = 40/60 ≈ 0.67.

**Also called:** sensitivity, true positive rate.

**Learn more:** [Evaluation Metrics](/interview/ai-engineer/machine-learning/evaluation-metrics)

### Reciprocal Rank Fusion (RRF)

A simple way to merge several ranked lists (for example BM25 and vector results): each document scores Σ 1 ÷ (k + rank), usually with k = 60, and you sort by total score.

**Example:** Doc A is rank 1 in BM25 and rank 3 in vectors: 1/61 + 1/63 ≈ 0.0164 + 0.0159 = 0.0323.

**Learn more:** [Advanced RAG](/interview/ai-engineer/llms-genai/advanced-rag)

### Recommendation System

A system that suggests items (products, videos, songs) a user is likely to want, usually in two stages: retrieve a few hundred candidates fast, then rank them with a stronger model.

**Example:** A shopping app shows "Customers who bought this phone also bought" a cover and a charger.

**Learn more:** [Case: Recommendation System](/interview/ai-engineer/ai-system-design/case-recommendation-system)

### Red Teaming

Deliberately trying to make a model or app fail, by writing attacks such as jailbreaks, prompt injections and tricky edge cases, so the problems can be fixed before users find them.

**Example:** A team writes 500 attack prompts against a banking bot and finds 12 that leak internal instructions.

**Learn more:** [Safety, Guardrails and Prompt Injection](/interview/ai-engineer/llms-genai/safety-guardrails-and-prompt-injection)

### Regression

A supervised task where the model predicts a continuous number.

**Example:** Predicting a flat's price (₹72,00,000) or tomorrow's temperature (31.5 °C).

**Don't confuse with:** classification. Note that "logistic regression" is actually a classifier.

**Learn more:** [What Is Machine Learning](/interview/ai-engineer/machine-learning/what-is-machine-learning)

### Regularization

Any technique that discourages a model from fitting noise, so it generalizes better: L1/L2 penalties, dropout, early stopping, data augmentation, weight decay.

**Example:** Adding L2 with λ = 0.01 drops training accuracy from 99% to 95% but raises test accuracy from 80% to 88%.

**Learn more:** [Overfitting, Regularization and Cross-Validation](/interview/ai-engineer/machine-learning/overfitting-regularization-and-cross-validation)

### Reinforcement Learning (RL)

An agent learns by acting in an environment and receiving rewards or penalties, aiming to maximize total reward over time.

**Example:** A game-playing program gets +1 for winning and −1 for losing and slowly learns good moves. RLHF uses the same idea to tune LLMs.

**Learn more:** [What Is Machine Learning](/interview/ai-engineer/machine-learning/what-is-machine-learning)

### ReLU (Rectified Linear Unit)

The activation f(x) = max(0, x). It is cheap, does not saturate for positive values, and is the default for hidden layers in many networks.

**Example:** ReLU([−2, 0, 3]) = [0, 0, 3].

**Learn more:** [Activation Functions](/interview/ai-engineer/deep-learning/activation-functions)

### Reranking

After a fast first retrieval (say top 50), a slower but more accurate model (usually a cross-encoder) re-scores each result for the query, and only the best few go to the LLM.

**Example:** Vector search returns 50 chunks; the reranker keeps 5, and answer accuracy on the eval set improves.

**Learn more:** [Advanced RAG](/interview/ai-engineer/llms-genai/advanced-rag)

### Residual Connection

Adding a block's input directly to its output: output = x + F(x). Gradients can flow straight through the "skip", which makes very deep networks trainable.

**Example:** Every Transformer sub-layer does x + Attention(LayerNorm(x)) (in the common pre-norm form).

**Also called:** skip connection.

**Learn more:** [The Transformer Architecture](/interview/ai-engineer/nlp-transformers/the-transformer-architecture)

### ResNet (Residual Network)

A CNN family (2015) built from residual blocks, which allowed networks with 50, 101 or even 152 layers to train well.

**Example:** `torchvision.models.resnet18(weights="DEFAULT")` loads a pretrained 18-layer ResNet for transfer learning.

**Learn more:** [Convolutional Neural Networks](/interview/ai-engineer/deep-learning/convolutional-neural-networks)

### Retry with Exponential Backoff

When a call fails with a temporary error (429, 500, 503, timeout), wait and retry, doubling the wait each time, often with some random "jitter" so clients do not retry together.

**Example:** Waits of 1 s, 2 s, 4 s, 8 s, then give up and use a fallback. The official `anthropic` and `openai` SDKs retry some errors automatically (`max_retries`).

**Learn more:** [Using LLM APIs](/interview/ai-engineer/llms-genai/using-llm-apis)

### Reward Model

A model trained on human preference data to give a score for how good a response is. In RLHF, the LLM is optimized to get high scores from it.

**Example:** For one prompt, people preferred answer A over B; the reward model learns to score A higher, e.g. 2.1 vs −0.4.

**Learn more:** [The LLM Training Pipeline](/interview/ai-engineer/llms-genai/the-llm-training-pipeline)

### RLHF (Reinforcement Learning from Human Feedback)

A training stage after SFT: humans rank model answers, a reward model learns those preferences, and the LLM is then tuned with RL (classically PPO) to produce higher-reward answers, with a KL penalty to stay close to the original.

**Example:** Labelers rank 4 answers to "Explain inflation to a child"; the model learns to prefer the clear, short, correct style.

**Learn more:** [The LLM Training Pipeline](/interview/ai-engineer/llms-genai/the-llm-training-pipeline)

### RMSE (Root Mean Squared Error)

The square root of MSE. It is in the same unit as the target and penalizes large errors more than MAE.

**Example:** Errors [1, −2, 3] → MSE ≈ 4.67 → RMSE ≈ 2.16 (MAE is 2).

**Learn more:** [Evaluation Metrics](/interview/ai-engineer/machine-learning/evaluation-metrics)

### RMSProp

An optimizer that keeps a running average of squared gradients for each weight and divides the step by its square root, so weights with large, noisy gradients take smaller steps.

**Example:** `torch.optim.RMSprop(model.parameters(), lr=1e-3, alpha=0.99)`.

**Learn more:** [Optimizers and Learning Rate](/interview/ai-engineer/deep-learning/optimizers-and-learning-rate)

### RNN (Recurrent Neural Network)

A network for sequences that reads one element at a time and keeps a hidden state as memory. Plain RNNs struggle with long sequences because of vanishing gradients, and they cannot be parallelized over time steps.

**Example:** Reading a sentence word by word to predict its sentiment at the end.

**Learn more:** [Recurrent Networks and LSTM](/interview/ai-engineer/deep-learning/recurrent-networks-and-lstm)

### ROC Curve (Receiver Operating Characteristic)

A plot of true positive rate (recall) against false positive rate as you move the decision threshold from 1 down to 0. The area under it is ROC-AUC.

**Example:** At threshold 0.5: TPR 0.80, FPR 0.10. At threshold 0.3: TPR 0.92, FPR 0.25. Each threshold is one point on the curve.

**Learn more:** [Evaluation Metrics](/interview/ai-engineer/machine-learning/evaluation-metrics)

### RoPE (Rotary Position Embedding)

A way to add position information by rotating each query and key vector by an angle that depends on its position. The attention score then depends on the relative distance between tokens. Used by Llama, Qwen, Mistral and many others.

**Example:** Tokens at positions 5 and 8 get the same relative effect as tokens at 105 and 108, because only the difference (3) matters.

**Learn more:** [The Transformer Architecture](/interview/ai-engineer/nlp-transformers/the-transformer-architecture)

### ROUGE (Recall-Oriented Understudy for Gisting Evaluation)

A family of metrics that measure word or n-gram overlap between a generated summary and a reference summary, focused on recall. ROUGE-L uses the longest common subsequence.

**Example:** Reference has 10 words; 6 of them appear in the output → ROUGE-1 recall = 0.6.

**Learn more:** [Evaluating LLM Apps](/interview/ai-engineer/llms-genai/evaluating-llm-apps)

## S

### Sampling (Text Generation)

Choosing the next token randomly according to the model's probabilities, instead of always taking the top one. Temperature, top-k and top-p control how random it is.

**Example:** Probabilities {"tea": 0.6, "coffee": 0.3, "juice": 0.1} → "tea" is picked about 60% of the time.

**Learn more:** [Generation Settings and the Context Window](/interview/ai-engineer/llms-genai/generation-settings-and-the-context-window)

### Scaled Dot-Product Attention

The core attention formula: Attention(Q, K, V) = softmax(Q·Kᵀ ÷ √d) · V, where d is the key dimension. Dividing by √d keeps scores from growing too large and making softmax too sharp.

**Example:** With d = 64, raw score 16 becomes 16 ÷ 8 = 2 before softmax.

**Learn more:** [Attention Step by Step](/interview/ai-engineer/nlp-transformers/attention-step-by-step)

### Scaling Laws

Observed rules that a language model's loss decreases smoothly and predictably (roughly as a power law) as you increase parameters, training data and compute. They guide how big a model to train for a budget.

**Example:** The "Chinchilla" finding suggests about 20 training tokens per parameter for compute-optimal training, e.g. a 10B model on about 200B tokens.

**Learn more:** [How LLMs Work](/interview/ai-engineer/llms-genai/how-llms-work)

### Self-Attention

Attention where the queries, keys and values all come from the same sequence, so every token can look at every other token (or only earlier ones, with causal masking).

**Example:** In "The animal didn't cross the road because it was too tired", self-attention lets "it" connect to "animal".

**Don't confuse with:** cross-attention, where the decoder's queries look at the encoder's keys and values.

**Learn more:** [Attention Step by Step](/interview/ai-engineer/nlp-transformers/attention-step-by-step)

### Semantic Caching

Storing previous question–answer pairs with their embeddings; when a new question is very similar in meaning (e.g. cosine > 0.95), return the stored answer instead of calling the LLM.

**Example:** "What are your delivery charges?" and "How much is delivery?" hit the same cached answer, saving one LLM call.

**Don't confuse with:** prompt caching, which still calls the model but reuses a processed prefix.

**Learn more:** [Monitoring, Cost and Caching](/interview/ai-engineer/mlops-deployment/monitoring-cost-and-caching)

### Semantic Search

Searching by meaning instead of exact words: embed the query and documents, then return documents whose vectors are closest to the query vector.

**Example:** Query "laptop is very hot" finds a help article titled "Fixing overheating issues", though it shares no keywords.

**Don't confuse with:** keyword search (BM25), which matches exact terms.

**Learn more:** [Embeddings and Semantic Search](/interview/ai-engineer/llms-genai/embeddings-and-semantic-search)

### Sentence Embedding

A single fixed-size vector for a whole sentence or paragraph, from a model trained so that similar meanings get nearby vectors.

**Example:** "Train is late" and "The train is delayed" → cosine similarity about 0.9.

**Learn more:** [Embeddings and Semantic Search](/interview/ai-engineer/llms-genai/embeddings-and-semantic-search)

### SentencePiece

A Google tokenizer library that works directly on raw text, treating spaces as a normal symbol (shown as ▁), so it handles any language without pre-splitting words. It supports BPE and Unigram methods.

**Example:** "Hello world" → ["▁Hello", "▁world"].

**Learn more:** [Tokenization](/interview/ai-engineer/nlp-transformers/tokenization)

### SFT (Supervised Fine-Tuning)

Fine-tuning a model on examples of inputs paired with ideal outputs. For LLMs, it turns a base model into an assistant that follows instructions.

**Example:** Data in chat format:

```json
{"messages": [{"role": "user", "content": "Translate 'thank you' to Hindi"},
              {"role": "assistant", "content": "Dhanyavaad (धन्यवाद)"}]}
```

**Learn more:** [Fine-Tuning, LoRA and QLoRA](/interview/ai-engineer/llms-genai/fine-tuning-lora-and-qlora)

### Shadow Deployment

The new model receives a copy of real production requests and its outputs are logged, but users only see the old model's answers. You compare safely before switching.

**Example:** For one week, model v2 runs in shadow; it agrees with v1 on 94% of cases, and the 6% differences are reviewed by hand.

**Learn more:** [CI/CD and Testing for AI](/interview/ai-engineer/mlops-deployment/ci-cd-and-testing-for-ai)

### Sigmoid

The function σ(x) = 1 ÷ (1 + e⁻ˣ), which squashes any number into the range 0 to 1. Used for binary probabilities.

**Example:** σ(0) = 0.5, σ(2) ≈ 0.88, σ(−2) ≈ 0.12.

**Learn more:** [Activation Functions](/interview/ai-engineer/deep-learning/activation-functions)

### Silhouette Score

For each point: (b − a) ÷ max(a, b), where a = average distance to its own cluster and b = average distance to the nearest other cluster. Ranges from −1 to 1; higher is better.

**Example:** a = 2, b = 5 → (5 − 2) ÷ 5 = 0.6.

**Learn more:** [Clustering: K-Means and DBSCAN](/interview/ai-engineer/machine-learning/clustering-kmeans-and-dbscan)

### Skip-Gram

A Word2Vec training method that uses a word to predict the words around it. It works well for rare words.

**Example:** Input "cricket" → targets "played", "match", "bat" from nearby positions.

**Learn more:** [Word Embeddings](/interview/ai-engineer/nlp-transformers/word-embeddings)

### SMOTE (Synthetic Minority Over-sampling Technique)

Creates new minority-class examples by picking a minority point and one of its nearest minority neighbours and placing a new point on the line between them. Apply it only to training data.

**Example:** Fraud points (2, 4) and (4, 6) → new synthetic point at the halfway mark (3, 5).

**Learn more:** [Data Preparation and Feature Engineering](/interview/ai-engineer/machine-learning/data-preparation-and-feature-engineering)

### Softmax

Turns a list of scores into probabilities that are all positive and sum to 1: softmax(zᵢ) = eᶻⁱ ÷ Σ eᶻʲ.

**Example:** [2, 1, 0] → e² = 7.39, e¹ = 2.72, e⁰ = 1, sum 11.11 → [0.67, 0.24, 0.09].

**Learn more:** [Activation Functions](/interview/ai-engineer/deep-learning/activation-functions)

### Special Tokens

Reserved tokens with a fixed role, such as marking the start or end of text, separating segments, padding, or unknown words.

**Example:** BERT input: `[CLS] I love tea [SEP]`. Many LLMs use an end-of-sequence token to stop generation.

**Learn more:** [Tokenization](/interview/ai-engineer/nlp-transformers/tokenization)

### SSE (Server-Sent Events)

A simple HTTP technique where the server keeps the connection open and pushes text events to the client one by one. LLM APIs and chat UIs use it to stream tokens.

**Example:** The stream contains lines like `data: {"text": "Hel"}` then `data: {"text": "lo"}`.

**Learn more:** [FastAPI for AI Apps](/interview/ai-engineer/mlops-deployment/fastapi-for-ai-apps)

### Standard Deviation

The typical distance of values from their mean: the square root of the variance.

**Example:** [2, 4, 4, 4, 5, 5, 7, 9]: mean 5, variance 4, standard deviation 2.

**Learn more:** [Distributions and Statistics](/interview/ai-engineer/math-for-ml/distributions-and-statistics)

### Standardization

Rescaling a feature to mean 0 and standard deviation 1: z = (x − mean) ÷ std. Fit the mean and std on training data only.

**Example:** Mean 60, std 10: a value of 80 becomes (80 − 60) ÷ 10 = 2.

**Also called:** z-score scaling (`StandardScaler`).

**Learn more:** [Data Preparation and Feature Engineering](/interview/ai-engineer/machine-learning/data-preparation-and-feature-engineering)

### Stochastic Gradient Descent (SGD)

Gradient descent that updates the weights using the gradient from one example (strictly) or a small mini-batch (in practice), instead of the whole dataset. Updates are noisy but fast.

**Example:** `torch.optim.SGD(model.parameters(), lr=0.01, momentum=0.9)`.

**Learn more:** [Gradient Descent and Loss Functions](/interview/ai-engineer/machine-learning/gradient-descent-and-loss-functions)

### Stop Sequence

A string that tells the model to stop generating as soon as it produces it.

**Example:** With `stop_sequences=["\nUser:"]`, the model stops before writing a fake next user turn.

**Learn more:** [Generation Settings and the Context Window](/interview/ai-engineer/llms-genai/generation-settings-and-the-context-window)

### Stratified Split

A train/test (or cross-validation) split that keeps the same proportion of each class in every part. Important for imbalanced data.

**Example:** 5% positive overall → `train_test_split(X, y, stratify=y)` gives about 5% positive in both train and test.

**Learn more:** [Overfitting, Regularization and Cross-Validation](/interview/ai-engineer/machine-learning/overfitting-regularization-and-cross-validation)

### Streaming

Sending tokens to the user as soon as they are generated, instead of waiting for the full answer. Total time is the same, but the app feels much faster.

**Example:**

```python
with client.messages.stream(model="claude-sonnet-5-5", max_tokens=500,
                            messages=[{"role": "user", "content": "Explain RAG"}]) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

**Learn more:** [Using LLM APIs](/interview/ai-engineer/llms-genai/using-llm-apis)

### Stride

How many pixels a convolution filter (or pooling window) moves at each step. A larger stride gives a smaller output.

**Example:** 28×28 input, 3×3 kernel, padding 0, stride 2 → (28 − 3) ÷ 2 + 1 = 13 (rounded down) → 13×13.

**Learn more:** [Convolutional Neural Networks](/interview/ai-engineer/deep-learning/convolutional-neural-networks)

### Structured Output

Making the model reply in an exact, machine-readable format, usually JSON that matches a schema, by instructions, tool definitions, or a provider's structured-output mode. Always validate the result.

**Example:** Ask for `{"sentiment": "positive" | "negative", "confidence": number}` and parse it with Pydantic.

**Learn more:** [Prompt Engineering](/interview/ai-engineer/llms-genai/prompt-engineering)

### Supervised Learning

Learning from examples that come with the correct answer (labels). Both classification and regression are supervised.

**Example:** 10,000 emails labelled spam / not spam train a spam filter.

**Learn more:** [What Is Machine Learning](/interview/ai-engineer/machine-learning/what-is-machine-learning)

### Supervisor (Agent Pattern)

A multi-agent pattern where a supervisor agent reads each request, decides which specialist agent should handle it, and collects their answers.

**Example:** A supervisor routes "change my address" to the account agent and "my order is late" to the delivery agent.

**Learn more:** [Multi-Agent Systems](/interview/ai-engineer/llms-genai/multi-agent-systems)

### SVM (Support Vector Machine)

A classifier that finds the boundary with the widest possible margin between classes. Only the closest points (support vectors) define it. Kernels let it draw curved boundaries.

**Example:** `SVC(kernel="rbf", C=1.0)`. A larger C allows fewer margin violations (less regularization).

**Learn more:** [KNN, SVM and Naive Bayes](/interview/ai-engineer/machine-learning/knn-svm-and-naive-bayes)

### Synthetic Data

Data created artificially, for example by an LLM or by simulation, to train or test models when real data is scarce, private or expensive.

**Example:** An LLM writes 300 realistic customer questions about your product to build a first eval set, which you then review by hand.

**Learn more:** [Evaluating LLM Apps](/interview/ai-engineer/llms-genai/evaluating-llm-apps)

### System Prompt

Top-level instructions given to the model separately from the user's messages, setting its role, rules, tone and output format for the whole conversation.

**Example:**

```python
client.messages.create(model="claude-sonnet-5-5", max_tokens=300,
    system="You are a polite support agent for an Indian bank. Never ask for OTPs.",
    messages=[{"role": "user", "content": "My card is blocked"}])
```

**Learn more:** [Using LLM APIs](/interview/ai-engineer/llms-genai/using-llm-apis)
