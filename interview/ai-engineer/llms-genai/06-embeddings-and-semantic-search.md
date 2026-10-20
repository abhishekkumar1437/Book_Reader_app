---
title: Embeddings and Semantic Search
part: Retrieval & RAG
summary: How text becomes a vector that captures meaning, how cosine similarity works with worked numbers, which embedding models to use, how to build semantic search in Python, and how it compares with keyword search.
---

Search by meaning is the foundation of RAG, recommendations, duplicate detection and many agent memory systems. The tool that makes it possible is the **embedding**: a list of numbers that represents what a piece of text means. In an AI engineer role you will choose embedding models, embed millions of chunks, debug "why didn't search find this?", and explain cosine similarity in interviews.

> **In simple words:** An embedding model turns a sentence into a list of numbers (a vector). Sentences with similar meaning get vectors that point in similar directions. To search, you turn the question into a vector too and find the stored vectors closest to it.

## What an embedding is

A computer can't compare meanings directly. "How do I reset my UPI PIN?" and "Steps to change UPI PIN" share few exact words, but they mean nearly the same. We want a representation where this similarity is easy to measure.

An **embedding** is a fixed-length list of numbers (a **vector**) produced by a neural network for a piece of text. A typical embedding has 384 to 3,072 numbers; this length is called the **dimension**. The model is trained so that texts with similar meaning get vectors that are close together in this high-dimensional space.

<figure>
<svg viewBox="0 0 420 235" width="420" height="235" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<line x1="30" y1="210" x2="410" y2="210" />
<line x1="30" y1="210" x2="30" y2="20" />
<text x="220" y="228" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">2-D picture of a space that really has hundreds of dimensions</text>
<circle cx="70" cy="50" r="4" fill="currentColor" />
<text x="78" y="54" fill="currentColor" stroke="none" font-size="11">reset UPI PIN</text>
<circle cx="95" cy="75" r="4" fill="currentColor" />
<text x="103" y="79" fill="currentColor" stroke="none" font-size="11">change UPI PIN</text>
<circle cx="60" cy="95" r="4" fill="currentColor" />
<text x="68" y="99" fill="currentColor" stroke="none" font-size="11">forgot UPI PIN</text>
<circle cx="120" cy="120" r="5" fill="var(--accent)" stroke="none" />
<text x="128" y="124" fill="var(--accent)" stroke="none" font-size="11" font-weight="bold">query: how to reset my PIN?</text>
<line x1="120" y1="120" x2="95" y2="75" stroke-dasharray="4 3" />
<line x1="120" y1="120" x2="60" y2="95" stroke-dasharray="4 3" />
<circle cx="280" cy="150" r="4" fill="currentColor" />
<text x="288" y="154" fill="currentColor" stroke="none" font-size="11">IPL score</text>
<circle cx="300" cy="175" r="4" fill="currentColor" />
<text x="308" y="179" fill="currentColor" stroke="none" font-size="11">cricket bat price</text>
<circle cx="260" cy="195" r="4" fill="currentColor" />
<text x="268" y="199" fill="currentColor" stroke="none" font-size="11">best bat under ₹2000</text>
</svg>
<figcaption>Texts about the same topic cluster together; the query lands next to the PIN texts even with different words.</figcaption>
</figure>

> **Real-life example:** Think of a library where books are not sorted by title but by topic, and very similar books sit on the same shelf. If you walk to the shelf for "UPI help", all the related books are within arm's reach, whatever their titles say. An embedding gives each text a "shelf position".

### From word embeddings to sentence embeddings

You may know **word embeddings** like Word2Vec, where each word has one fixed vector ([Word Embeddings](/interview/ai-engineer/nlp-transformers/word-embeddings)). Those are **static**: "bank" has the same vector in "river bank" and "bank loan". Transformer models produce **contextual** embeddings, where each token's vector depends on the surrounding words.

For search we need one vector for a whole sentence or paragraph, called a **sentence embedding** (or text embedding). An embedding model gets it by running a Transformer encoder over the text and **pooling** the token vectors into one, usually by averaging them (**mean pooling**) or by using a special first token.

These models are trained with **contrastive learning**: they are shown pairs that should match (a question and its answer, a title and its article) and pushed to give them close vectors, while unrelated texts in the same batch are pushed apart. That is why they are good at "does this passage answer this question?".

| | Word2Vec / GloVe | LLM (Claude, GPT) | Embedding model |
|---|---|---|---|
| Output | one vector per word | generated text | one vector per text |
| Context-aware | no | yes | yes |
| Size | small | very large | small to medium (≈ 20M – 8B parameters) |
| Used for | older NLP | generation, reasoning | search, clustering, RAG retrieval |

> **Common mistake:** Thinking you need a chat LLM to create embeddings. Embedding models are separate, much smaller and cheaper models. You call a different endpoint (or run a small local model) for them.

## Measuring similarity

Once texts are vectors, "how similar?" becomes geometry. Three measures are common.

<div class="formula">

| Measure | Formula | Range and meaning |
|---|---|---|
| Dot product | a · b = Σ aᵢ × bᵢ | larger = more similar; depends on vector length |
| Vector length (norm) | ‖a‖ = √(Σ aᵢ²) | always ≥ 0 |
| Cosine similarity | cos(a, b) = (a · b) ÷ (‖a‖ × ‖b‖) | −1 to 1; 1 = same direction |
| Cosine distance | 1 − cos(a, b) | 0 = identical direction |
| Euclidean (L2) distance | ‖a − b‖ = √(Σ (aᵢ − bᵢ)²) | 0 = identical; smaller = closer |
| For unit-length vectors | cos(a, b) = a · b, and ‖a − b‖² = 2 − 2 cos(a, b) | all three give the same ranking |

</div>

**Cosine similarity** measures the **angle** between two vectors and ignores their length. It is the default for text embeddings because the direction carries the meaning. Many embedding models output **normalized** vectors (length 1), and then cosine similarity equals the plain dot product, which is faster to compute.

### Worked example: cosine similarity by hand

Real embeddings have hundreds of dimensions whose meanings we can't read. To learn, pretend we have a 3-dimensional embedding where the numbers roughly mean (payments, sports, how-to):

| Text | Vector |
|---|---|
| A: "How do I reset my UPI PIN?" | [0.8, 0.1, 0.3] |
| B: "Steps to change UPI PIN" | [0.7, 0.2, 0.4] |
| C: "Best cricket bats under ₹2000" | [0.1, 0.9, 0.0] |

**Step 1 — lengths:**

- ‖A‖ = √(0.8² + 0.1² + 0.3²) = √(0.64 + 0.01 + 0.09) = √0.74 = **0.860**
- ‖B‖ = √(0.49 + 0.04 + 0.16) = √0.69 = **0.831**
- ‖C‖ = √(0.01 + 0.81 + 0.00) = √0.82 = **0.906**

**Step 2 — A vs B:**

- A · B = 0.8 × 0.7 + 0.1 × 0.2 + 0.3 × 0.4 = 0.56 + 0.02 + 0.12 = **0.70**
- cos(A, B) = 0.70 ÷ (0.860 × 0.831) = 0.70 ÷ 0.7146 = **0.980**

**Step 3 — A vs C:**

- A · C = 0.08 + 0.09 + 0.00 = **0.17**
- cos(A, C) = 0.17 ÷ (0.860 × 0.906) = 0.17 ÷ 0.7790 = **0.218**

**Step 4 — B vs C:**

- B · C = 0.07 + 0.18 + 0.00 = **0.25**
- cos(B, C) = 0.25 ÷ (0.831 × 0.906) = 0.25 ÷ 0.7522 = **0.332**

So A and B (both about the UPI PIN) are very similar (0.98), and the cricket text is far from both. For comparison, the Euclidean distances are ‖A − B‖ = √(0.1² + 0.1² + 0.1²) = √0.03 = 0.173 and ‖A − C‖ = √(0.49 + 0.64 + 0.09) = √1.22 = 1.105, which gives the same ranking.

Check it with NumPy:

```python
import numpy as np

A = np.array([0.8, 0.1, 0.3])
B = np.array([0.7, 0.2, 0.4])
C = np.array([0.1, 0.9, 0.0])

def cosine(x, y):
    return x @ y / (np.linalg.norm(x) * np.linalg.norm(y))

print(round(cosine(A, B), 3), round(cosine(A, C), 3), round(cosine(B, C), 3))
# Output: 0.98 0.218 0.332
```

> **Remember:** Cosine similarity scores are only meaningful **relative to each other, for the same model**. One model may give unrelated texts 0.2 and another may give them 0.6. Never hard-code a threshold like "0.8 means relevant" without testing it on your data and your model.

## Embedding models

Many good embedding models exist. They differ in quality, dimension, maximum input length, languages, speed and price. The public **MTEB** leaderboard (Massive Text Embedding Benchmark) compares them across many tasks, but always test on **your** data: a model that ranks high on general benchmarks can be average on Indian legal documents or Hinglish chat.

| Model (examples) | Type | Dimension | Notes |
|---|---|---|---|
| `all-MiniLM-L6-v2` | open, sentence-transformers | 384 | tiny and fast; good for learning and prototypes; English |
| `BAAI/bge-small-en-v1.5` / `bge-base` / `bge-large` | open | 384 / 768 / 1024 | strong English retrieval |
| `BAAI/bge-m3` | open | 1024 | multilingual (including Indian languages), long inputs |
| `intfloat/multilingual-e5-large` | open | 1024 | multilingual; needs `query: ` / `passage: ` prefixes |
| `nomic-embed-text` | open (easy in Ollama) | 768 | good local choice |
| Qwen3-Embedding family | open | varies | strong multilingual, several sizes |
| OpenAI `text-embedding-3-small` / `-large` | API | 1536 / 3072 (can be shortened) | widely used, cheap |
| Voyage AI, Cohere, Google embedding models | API | varies | strong retrieval; some offer domain models (code, law, finance) |

This list changes every few months; treat it as a starting point and check current leaderboards. At the time of writing Anthropic does not offer its own embedding model, and its documentation points to partners such as Voyage AI, so a common stack is "Claude for generation + a separate embedding model for retrieval".

Things to compare when choosing:

| Factor | Why it matters |
|---|---|
| Retrieval quality on your data | the only number that really matters |
| Languages | Hindi, Hinglish, Tamil queries need a multilingual model |
| Max input tokens | long chunks are cut off silently if they exceed it |
| Dimension | storage, memory and search speed scale with it |
| Hosting | API (easy) vs local (private, no per-call cost) |
| Price / throughput | you may embed millions of chunks |

Some models support **Matryoshka** embeddings: the first 256 numbers of a 1,024-number vector are already a good, smaller embedding, so you can shorten vectors to save storage with a small loss in quality (OpenAI's `dimensions` parameter does this).

## Creating embeddings in code

### Locally with sentence-transformers

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")      # downloads ~90 MB once

texts = [
    "How do I reset my UPI PIN?",
    "Steps to change UPI PIN",
    "Best cricket bats under ₹2000",
]
emb = model.encode(texts, normalize_embeddings=True)  # unit length -> dot = cosine
print(emb.shape)                                      # Output: (3, 384)

sims = emb @ emb.T                                    # all pairwise cosine similarities
print(sims.round(2))
```

The first two texts get a much higher similarity to each other than to the third. The exact values depend on the model.

### With an API (OpenAI) and locally with Ollama

```python
from openai import OpenAI

client = OpenAI()
resp = client.embeddings.create(
    model="text-embedding-3-small",          # check current model names
    input=["How do I reset my UPI PIN?", "Steps to change UPI PIN"],
)
vectors = [d.embedding for d in resp.data]   # list of lists of floats
print(len(vectors[0]))                       # Output: 1536
```

```python
import ollama                                # after: ollama pull nomic-embed-text

resp = ollama.embed(model="nomic-embed-text",
                    input=["How do I reset my UPI PIN?", "Steps to change UPI PIN"])
vectors = resp["embeddings"]
```

> **Common mistake:** Embedding documents with one model and queries with another, or upgrading the model and keeping old vectors. Vectors from different models live in different spaces and can't be compared. If you change the embedding model, **re-embed everything**.

## Semantic search

**Semantic search** finds documents by meaning: embed every document once, store the vectors, then for each query embed it and return the documents with the highest similarity. A model that embeds the query and each document **separately** like this is called a **bi-encoder**. It is fast, because document vectors are computed ahead of time.

```python
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

docs = [
    "To reset your UPI PIN, open the app, choose the bank account and tap 'Forgot PIN'.",
    "Refunds for failed UPI payments are usually credited back within a few working days.",
    "Our store sells cricket bats, balls and pads at discounted prices.",
    "You can change your registered mobile number by visiting the bank branch.",
    "The IPL final will be played on Sunday evening.",
]
doc_emb = model.encode(docs, normalize_embeddings=True)   # do this ONCE and store it

def search(query: str, k: int = 2):
    q = model.encode([query], normalize_embeddings=True)[0]
    scores = doc_emb @ q                                  # cosine similarity with every doc
    top = np.argsort(-scores)[:k]                         # indices of the k highest scores
    return [(round(float(scores[i]), 3), docs[i]) for i in top]

for score, doc in search("I forgot my payment PIN, what do I do?"):
    print(score, doc)
```

The UPI PIN document comes first even though the query says "payment PIN" and "forgot", not "reset UPI PIN". With 5 documents, comparing against all of them is instant. With 10 million chunks, checking every vector is too slow, which is why we use vector databases with approximate search; see [Vector Databases](/interview/ai-engineer/llms-genai/vector-databases).

### Queries and documents are not the same kind of text

A query is short ("refund time UPI"), a document is long and written differently. This is called **asymmetric search**. Several models are trained to expect a marker that says which is which:

```python
# E5 models expect prefixes
q = model_e5.encode(["query: refund time for failed UPI payment"])
d = model_e5.encode(["passage: Refunds for failed UPI payments are usually credited ..."])
```

Read the model card and use exactly the prefixes or instructions it asks for. Forgetting them quietly lowers quality.

## Semantic search vs keyword search

**Keyword search** (also **lexical search**) matches the actual words. The classic scoring method is **BM25**, an improved version of TF-IDF ([Text as Data](/interview/ai-engineer/nlp-transformers/text-as-data)) that rewards rare words that appear in a document and stops giving extra credit after a word repeats many times. It is what Elasticsearch and OpenSearch use by default.

| | Keyword search (BM25) | Semantic search (embeddings) |
|---|---|---|
| Matches | exact words (after simple normalization) | meaning |
| Synonyms, paraphrases | misses them ("cheap" ≠ "affordable") | finds them |
| Exact codes, IDs, names | excellent (`ERR-4031`, `12309`, `IFSC SBIN0001234`) | often weak |
| Other languages / Hinglish | only if words match | good with a multilingual model |
| Explainable | yes (which words matched) | harder |
| Needs a model | no | yes; embedding cost and storage |
| Speed at scale | very fast with inverted index | fast with ANN index |

Examples of each failing:

- Query `"cheap phone with good camera"` vs document `"affordable smartphone, excellent photos"`: keyword search finds almost nothing in common; semantic search matches well.
- Query `"error ERR-4031"` vs a page explaining ERR-4031: keyword search finds it immediately; semantic search may return pages about other error codes because they "look similar".

The best systems use **both** and merge the results. This is called **hybrid search**, explained in [Advanced RAG](/interview/ai-engineer/llms-genai/advanced-rag).

> **Interview tip:** If asked "semantic or keyword search?", say "both, usually": semantic for meaning and paraphrases, BM25 for exact terms like product codes and names, merged with hybrid search and then reranked. Give one failure example of each; it shows you have actually debugged retrieval.

## Practical engineering details

### Storage cost

Each number is a 4-byte float (float32).

- 1 million chunks × 768 dimensions × 4 bytes = 3,072,000,000 bytes ≈ **3.1 GB**.
- With 1,536 dimensions: ≈ **6.1 GB**.
- Stored as float16 (2 bytes): half. Stored as int8 (1 byte, called **scalar quantization**): a quarter, with a small accuracy loss. **Binary quantization** (1 bit per dimension) is 32× smaller and is used for a fast first pass.

### Batch, cache, and keep metadata

- Embed in **batches** (for example 64 or 256 texts per call), not one by one.
- **Cache** embeddings: store them with a hash of the text so unchanged documents are not re-embedded.
- Store the original text and **metadata** (source file, page, date, access group) next to each vector. You will need them for citations and filtering.
- Respect the model's **max input length**. Long documents must be **chunked** first; see [RAG Fundamentals](/interview/ai-engineer/llms-genai/rag-fundamentals).

## Measuring search quality

You can't improve what you don't measure. Make a small test set: 30–100 real queries, each with the IDs of the documents that should be found. Then compute:

<div class="formula">

| Metric | Meaning |
|---|---|
| Recall@k | fraction of queries where a relevant document appears in the top k |
| Precision@k | fraction of the top k results that are relevant |
| MRR (mean reciprocal rank) | average of 1 ÷ (rank of the first relevant result) |

</div>

### Worked example: Recall@3 and MRR

Three test queries. The rank where the first correct document appeared:

| Query | First relevant rank | In top 3? | 1 ÷ rank |
|---|---|---|---|
| q1 | 1 | yes | 1.000 |
| q2 | 3 | yes | 0.333 |
| q3 | 5 | no | 0.200 |

- Recall@3 = 2 of 3 queries = **0.667**
- MRR = (1.000 + 0.333 + 0.200) ÷ 3 = 1.533 ÷ 3 = **0.511**

Use these numbers to compare embedding models, chunk sizes, and hybrid search settings on your own data.

## Other uses of embeddings

| Use | How |
|---|---|
| Clustering | group support tickets by topic with K-Means on embeddings ([Clustering](/interview/ai-engineer/machine-learning/clustering-kmeans-and-dbscan)) |
| Duplicate detection | flag pairs with very high similarity |
| Classification | train logistic regression on embeddings as features |
| Recommendations | "products similar to this one" |
| Semantic caching | reuse an earlier LLM answer if a new question is very similar |
| Agent memory | store past conversation facts and retrieve relevant ones |

## Key terms

| Term | Simple meaning |
|---|---|
| Embedding | A vector of numbers representing the meaning of a text |
| Vector | An ordered list of numbers |
| Dimension | How many numbers are in the vector |
| Static embedding | One fixed vector per word, regardless of context |
| Contextual embedding | A token vector that depends on the surrounding words |
| Sentence embedding | One vector for a whole sentence or passage |
| Pooling / mean pooling | Combining token vectors into one, e.g. by averaging |
| Contrastive learning | Training that pulls matching pairs together and pushes others apart |
| Dot product | Sum of element-wise products of two vectors |
| Norm | The length of a vector |
| Cosine similarity | Similarity based on the angle between two vectors |
| Normalized vector | A vector scaled to length 1 |
| Euclidean (L2) distance | Straight-line distance between two vectors |
| MTEB | A public benchmark leaderboard for embedding models |
| Matryoshka embedding | An embedding whose first part also works as a shorter embedding |
| Semantic search | Finding documents by meaning using embeddings |
| Bi-encoder | Model that embeds query and document separately |
| Asymmetric search | Short queries searched against longer, different-style documents |
| Keyword / lexical search | Finding documents by matching words |
| BM25 | Standard keyword ranking formula |
| Hybrid search | Combining keyword and semantic search results |
| Scalar / binary quantization | Storing vectors with fewer bits to save space |
| Recall@k | Share of queries with a relevant result in the top k |
| MRR | Average of 1 ÷ rank of the first relevant result |

## Interview questions

**What is an embedding?**
An embedding is a fixed-length vector produced by a neural network that represents the meaning of a piece of text. The model is trained so that texts with similar meaning get vectors close together. This turns "how similar are these texts?" into a simple math operation like cosine similarity.

**Explain cosine similarity. Why is it used for text?**
Cosine similarity is the dot product of two vectors divided by the product of their lengths, which equals the cosine of the angle between them. It ranges from −1 to 1, with 1 meaning the same direction. It is used for text because the direction of an embedding carries the meaning, while the length can vary for unimportant reasons. With normalized vectors it equals the dot product.

**What is the difference between cosine similarity, dot product and Euclidean distance?**
The dot product depends on both direction and length, cosine only on direction, and Euclidean distance on the straight-line gap between points. For unit-length vectors all three give the same ranking, because cosine equals the dot product and squared distance equals 2 minus 2 times cosine. Use the metric the embedding model was trained with.

**How is an embedding model different from an LLM like GPT or Claude?**
An embedding model is usually a smaller encoder that outputs one vector per input text and is trained with contrastive learning for similarity. An LLM is a large decoder that generates text token by token. In RAG we use an embedding model to retrieve and an LLM to generate the answer.

**How would you choose an embedding model?**
I'd shortlist a few from MTEB and providers, considering language support, max input length, dimension, hosting and cost. Then I'd build a test set of real queries with known relevant documents and compare recall@k and MRR on my own data. I'd pick the cheapest model that meets the quality bar, and remember that changing models later means re-embedding everything.

**When does keyword search beat semantic search?**
For exact strings like product codes, error codes, IDs, names and rare technical terms, where the exact word matters more than meaning. Embeddings can blur these into "similar-looking" items. That is why production systems often combine BM25 and vector search in hybrid search.

**Why can't you mix vectors from two embedding models?**
Each model creates its own vector space, so dimension number 5 in one model means something completely different in another, and dimensions may not even match in count. Similarity between vectors from different models is meaningless. When you change models, you re-embed all documents.

**How much storage do 10 million 1,024-dimension float32 embeddings need?**
10 million × 1,024 × 4 bytes = about 41 GB, before index overhead. With float16 it's about 20 GB, with int8 about 10 GB. Index structures like HNSW add more memory on top.

**How do you evaluate a semantic search system?**
Build a labelled set of real queries with their relevant documents, then measure recall@k, precision@k and MRR (or nDCG) for the system. Use it to compare embedding models, chunking, and hybrid settings. Also look at failure cases by hand to find patterns such as exact-code queries or wrong language.

**What is asymmetric search and how do models handle it?**
It is when short queries are matched against long documents that are written differently. Many embedding models are trained with special prefixes or instructions, such as "query:" and "passage:", to tell the model which side each text is on. Using the prefixes the model card asks for improves retrieval quality.

## Try it yourself

1. **Cosine by hand.** Compute the cosine similarity of [1, 2, 2] and [2, 1, 2]. Hint: both vectors have length 3.
2. **Semantic search.** Use the `search` function above on 15 short FAQ answers you write about train ticket booking, and test 5 queries in Hinglish (for example "ticket cancel kaise kare"). Compare `all-MiniLM-L6-v2` with a multilingual model like `BAAI/bge-m3`.
3. **Keyword vs semantic.** Add a document that contains the code `PNR-ERR-77`. Query for `PNR-ERR-77` with semantic search. Is it in the top 1? Now implement a simple keyword check and compare.
4. **MRR.** Four queries had their first relevant result at ranks 2, 1, 4, 1. Compute MRR and Recall@1.

### Answers

1. Dot = 1×2 + 2×1 + 2×2 = 8. Lengths = √9 = 3 each. Cosine = 8 ÷ 9 = 0.889.
2. The multilingual model should rank the right FAQ much higher for Hinglish queries; the small English model often fails on them. This is why language support is a key selection factor.
3. Often it is found because the exact string is rare, but it can be beaten by documents with similar codes. A keyword check (`"PNR-ERR-77" in doc`) always finds it, which motivates hybrid search.
4. MRR = (1/2 + 1 + 1/4 + 1) ÷ 4 = 2.75 ÷ 4 = 0.6875. Recall@1 = 2 of 4 = 0.5.

**Next:** [Vector Databases](/interview/ai-engineer/llms-genai/vector-databases)
