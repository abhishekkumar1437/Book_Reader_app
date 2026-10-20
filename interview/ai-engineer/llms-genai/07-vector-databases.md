---
title: Vector Databases
part: Retrieval & RAG
summary: Why vector databases exist, exact vs approximate nearest-neighbour search, how IVF, HNSW and product quantization work (with numbers), metadata filtering, and a practical comparison of FAISS, Chroma, Pinecone, pgvector, Qdrant and others with code.
---

Once you can turn text into embeddings ([Embeddings and Semantic Search](/interview/ai-engineer/llms-genai/embeddings-and-semantic-search)), you need a place to store millions of them and find the closest ones in milliseconds. That is the job of a **vector database**. Almost every RAG system, recommendation feature and agent memory uses one. Interviewers ask "how does HNSW work?", "pgvector or Pinecone?", and "how do you filter by user?" very often.

> **In simple words:** A vector database stores vectors together with their text and metadata, and builds a special index so it can find the nearest vectors to a query **approximately but very fast**, instead of comparing against every stored vector.

## Why not just use a NumPy array?

For a few thousand vectors, a NumPy array and a dot product (as in the previous chapter) is perfect. The problems start at scale.

**Worked example: the cost of brute force.** You have 10 million chunks with 768-dimension embeddings.

1. One similarity = 768 multiply-adds.
2. One query compared with all chunks = 10,000,000 × 768 = **7.68 billion** multiply-adds.
3. At 100 queries per second, that is 768 billion multiply-adds every second, plus about 30 GB of vectors (10M × 768 × 4 bytes) read from memory for each query.

That is too slow and expensive for an interactive app. Besides speed, a real system also needs:

| Need | Why |
|---|---|
| Persistence | vectors survive restarts; backups |
| Inserts, updates, deletes | documents change every day |
| Metadata filtering | "only this user's files", "only 2025 policies" |
| Scaling | data bigger than one machine's memory, replication |
| Hybrid search | combine keyword and vector search |
| Multi-tenancy | keep each customer's data separate |

A vector database gives you these, built around an **ANN index**.

## Exact vs approximate nearest neighbours

**k-nearest neighbours (kNN)** search returns the k vectors that are truly closest to the query. Doing it exactly needs the brute-force comparison above. This is called **exact search** or **flat search**.

**Approximate nearest neighbour (ANN)** search uses a clever index to look at only a small part of the data. It returns *almost* the true top k, much faster. The quality is measured by **recall@k**: of the true top-k neighbours, what fraction did the ANN search return? A good ANN index returns 95–99% recall while checking well under 1% of the vectors.

> **Real-life example:** To find the house nearest to you in a city, you don't measure the distance to every house in India. You go to your city, then your area, then your street. You might occasionally miss a house that is technically 10 metres closer on the next street, but you find a very close one in seconds. That is ANN.

> **Remember:** ANN trades a little recall for a lot of speed. Every ANN index has settings that move you along this trade-off: more search effort means higher recall and higher latency.

## IVF: search only the nearest clusters

**IVF** (Inverted File index) first groups all vectors into clusters using K-Means ([Clustering](/interview/ai-engineer/machine-learning/clustering-kmeans-and-dbscan)). Each cluster has a centre (**centroid**). Each vector is stored in the list of its nearest centroid.

At query time:

1. Compare the query with all centroids.
2. Pick the `nprobe` closest clusters.
3. Search only the vectors inside those clusters.

The two settings are **nlist** (how many clusters) and **nprobe** (how many clusters to search).

**Worked example.** 1,000,000 vectors, nlist = 1,000 clusters, so about 1,000 vectors per cluster. With nprobe = 10:

1. Compare with 1,000 centroids.
2. Search 10 clusters × 1,000 vectors = 10,000 vectors.
3. Total ≈ 11,000 comparisons instead of 1,000,000: about **1.1%** of the work, roughly **90× fewer** comparisons.

If the true nearest neighbour sits just across a cluster border, nprobe = 10 may miss it. Raising nprobe to 50 improves recall but costs about 5× more work. IVF needs a **training** step (running K-Means) before you add data, and clusters can become unbalanced as data changes.

## HNSW: a multi-layer graph

**HNSW** (Hierarchical Navigable Small World) is the most popular ANN index today. It is the default in Qdrant, Weaviate, Chroma, pgvector (optional), Milvus, Elasticsearch and many others.

The idea: connect each vector to a few of its close neighbours, forming a graph. Then search by **greedily walking** through the graph toward the query: from the current node, jump to whichever neighbour is closer to the query, and repeat until no neighbour is closer.

To make long jumps fast, HNSW builds **several layers**. The top layer has very few nodes with long-distance links (like express highways). Each lower layer has more nodes and shorter links. The bottom layer (layer 0) contains every vector.

<figure>
<svg viewBox="0 0 440 245" width="440" height="245" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<text x="10" y="44" fill="currentColor" stroke="none" font-size="11">Layer 2</text>
<text x="10" y="114" fill="currentColor" stroke="none" font-size="11">Layer 1</text>
<text x="10" y="189" fill="currentColor" stroke="none" font-size="11">Layer 0</text>
<rect x="70" y="20" width="360" height="40" rx="6" stroke-dasharray="4 3" />
<rect x="70" y="85" width="360" height="50" rx="6" stroke-dasharray="4 3" />
<rect x="70" y="155" width="360" height="60" rx="6" stroke-dasharray="4 3" />
<text x="100" y="14" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">entry</text>
<line x1="100" y1="110" x2="190" y2="100" />
<line x1="190" y1="100" x2="270" y2="120" />
<line x1="100" y1="185" x2="140" y2="170" />
<line x1="140" y1="170" x2="190" y2="195" />
<line x1="190" y1="195" x2="230" y2="175" />
<line x1="230" y1="175" x2="270" y2="195" />
<line x1="300" y1="170" x2="330" y2="192" />
<line x1="330" y1="192" x2="360" y2="180" />
<line x1="360" y1="180" x2="400" y2="200" />
<line x1="100" y1="40" x2="100" y2="110" stroke-dasharray="2 3" />
<line x1="100" y1="110" x2="100" y2="185" stroke-dasharray="2 3" />
<line x1="360" y1="110" x2="360" y2="180" stroke-dasharray="2 3" />
<line x1="100" y1="40" x2="360" y2="40" stroke="var(--accent)" stroke-width="2.5" />
<line x1="360" y1="40" x2="360" y2="110" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="5 3" />
<line x1="360" y1="110" x2="270" y2="120" stroke="var(--accent)" stroke-width="2.5" />
<line x1="270" y1="120" x2="270" y2="195" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="5 3" />
<line x1="270" y1="195" x2="300" y2="170" stroke="var(--accent)" stroke-width="2.5" />
<circle cx="100" cy="40" r="5" fill="currentColor" />
<circle cx="360" cy="40" r="5" fill="currentColor" />
<circle cx="100" cy="110" r="5" fill="currentColor" />
<circle cx="190" cy="100" r="5" fill="currentColor" />
<circle cx="270" cy="120" r="5" fill="currentColor" />
<circle cx="360" cy="110" r="5" fill="currentColor" />
<circle cx="100" cy="185" r="4" fill="currentColor" />
<circle cx="140" cy="170" r="4" fill="currentColor" />
<circle cx="190" cy="195" r="4" fill="currentColor" />
<circle cx="230" cy="175" r="4" fill="currentColor" />
<circle cx="270" cy="195" r="4" fill="currentColor" />
<circle cx="300" cy="170" r="6" fill="var(--accent)" stroke="none" />
<circle cx="330" cy="192" r="4" fill="currentColor" />
<circle cx="360" cy="180" r="4" fill="currentColor" />
<circle cx="400" cy="200" r="4" fill="currentColor" />
<text x="220" y="236" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">highlighted path: long jumps on top, then short steps down to the nearest vector</text>
</svg>
<figcaption>HNSW search starts at the sparse top layer, moves greedily toward the query, then drops down a layer and repeats.</figcaption>
</figure>

The search goes: start at the entry point on the top layer → move to the neighbour closest to the query → when no neighbour is closer, drop to the next layer → repeat → on layer 0, return the best k found. The number of hops grows roughly with log(N), so it stays fast even for very large N.

HNSW settings you will see in every database:

| Setting | What it controls | Higher value means |
|---|---|---|
| `M` | links per node | better recall, more memory, slower build |
| `ef_construction` | how many candidates are checked while building | better graph quality, slower build |
| `ef_search` (or `ef`) | how many candidates are kept while searching | better recall, slower queries |

Typical starting values: M = 16, ef_construction = 100–200, ef_search = 50–200. You tune `ef_search` at query time to hit your recall target.

Strengths: high recall at low latency, no training step, handles inserts well. Weaknesses: uses a lot of **memory** (vectors plus graph links, usually kept in RAM), and deletes are tricky (often marked deleted and cleaned later).

## Product quantization: compress the vectors

**Product quantization (PQ)** shrinks vectors so more fit in memory. It splits each vector into small sub-vectors, and replaces each sub-vector with the ID of its closest "codeword" from a small learned codebook.

**Worked example.** A 768-dimension float32 vector takes 768 × 4 = **3,072 bytes**. Split it into 96 sub-vectors of 8 dimensions each. For each sub-vector, store the ID (0–255, so **1 byte**) of the nearest of 256 learned codewords. New size = 96 × 1 = **96 bytes**, which is **32× smaller**. Distances become approximate, so recall drops a bit; systems often re-check the top candidates with full vectors (**re-scoring**).

PQ is often combined with IVF as **IVF-PQ** for billion-scale data. Newer systems also use **scalar** (int8) and **binary** quantization, and disk-based indexes like **DiskANN** that keep most data on SSD.

| Index | Idea | Memory | Build | Best for |
|---|---|---|---|---|
| Flat | compare with everything | vectors only | none | < ~100K vectors, or exact ground truth |
| IVF | search nearest clusters | low | needs K-Means training | large, mostly static data |
| HNSW | multi-layer graph walk | high (vectors + links) | moderate | most production use; frequent inserts |
| IVF-PQ / PQ | compressed codes | very low | training | hundreds of millions to billions |
| DiskANN-style | graph on SSD | low RAM | slow | huge data on limited RAM |

> **Interview tip:** For "explain HNSW", give the picture in three sentences: a graph where each vector links to near neighbours; several layers, sparse on top for long jumps and dense at the bottom; greedy search from the top layer down. Then name the trade-off knobs (M, ef_search) and the main cost (memory).

## Metadata filtering

Real queries come with conditions: "search only documents this user may see", "only HR policies", "only after 2024". Each vector is stored with **metadata** (also called **payload**), such as `{"user_id": 42, "dept": "HR", "year": 2025}`, and the query includes a **filter**.

How the filter is applied matters a lot:

| Approach | How | Problem |
|---|---|---|
| Post-filtering | ANN finds top k, then drop results that fail the filter | may return far fewer than k results |
| Pre-filtering | filter first, then exact search on the remaining vectors | slow if the remaining set is large |
| Filtered (in-index) search | the ANN search skips non-matching nodes while walking | best; supported by Qdrant, Weaviate, Pinecone, Milvus, and others |

**Worked example of the post-filter problem.** You ask for the top 10, then filter to `dept = "Legal"`. Only 5% of documents are Legal. Expected matches in the top 10 ≈ 10 × 0.05 = **0.5**. Most queries get zero or one result, even though thousands of Legal documents exist. Filtered search avoids this.

> **Common mistake:** Implementing access control by filtering results in Python after retrieval. Besides the empty-results problem above, any bug leaks other users' data into the prompt. Put the permission filter **inside** the vector query (or use a separate collection or namespace per tenant).

## The main options compared

| Tool | Type | Hosting | Strengths | Watch out for |
|---|---|---|---|---|
| **FAISS** (Meta) | library, not a database | in your Python process | very fast; every index type (Flat, IVF, HNSW, PQ); GPU support | no server, no metadata filtering or persistence built in; you manage everything |
| **Chroma** | embedded / server DB | local file, server, or managed cloud | simplest API; great for prototypes and small apps; built-in embedding | not the first choice for very large, multi-node workloads |
| **pgvector** | Postgres extension | anywhere Postgres runs (incl. managed cloud Postgres) | vectors next to your normal data; SQL joins, transactions, filters with WHERE | tuning needed at large scale; one big Postgres is the limit |
| **Qdrant** | vector DB (Rust) | self-host (Docker) or managed | strong filtered search, payload indexes, quantization, hybrid | another service to run |
| **Pinecone** | fully managed service | cloud only (serverless) | no ops, scales easily, namespaces for tenants | cost at scale; data leaves your infra; vendor lock-in |
| **Weaviate** | vector DB | self-host or managed | built-in hybrid search, modules for embedding | more concepts to learn |
| **Milvus / Zilliz** | distributed vector DB | self-host (Kubernetes) or managed | billion-scale, many index types, GPU | heavier to operate |
| **Elasticsearch / OpenSearch** | search engine with vectors | self-host or managed | best-in-class keyword search + vectors in one place | memory-heavy; more ops |
| **LanceDB** | embedded, file-based | local files or object storage | serverless, good for large local datasets | younger ecosystem |

How to choose, in practice:

| Situation | Good choice |
|---|---|
| Learning, notebooks, a demo | Chroma or FAISS |
| You already use Postgres, up to a few million vectors | pgvector |
| Production RAG with heavy filtering and multi-tenancy | Qdrant, Weaviate, or Pinecone |
| No ops team, want managed and fast to start | Pinecone or a managed Qdrant/Weaviate |
| Hundreds of millions to billions of vectors | Milvus, or FAISS/IVF-PQ in a custom service |
| Keyword search is critical and you already run Elasticsearch | Elasticsearch / OpenSearch vectors |

> **Interview tip:** A strong answer to "which vector DB would you choose?" starts with requirements, not brand names: number of vectors, update rate, filtering and tenancy needs, hybrid search, latency target, team's ops ability, and data-residency rules. Then say "for this size and since we already run Postgres, pgvector; if we grow past X or need heavy filtered search, Qdrant or a managed service."

## Code: Chroma

Chroma runs inside your Python process and saves to a folder, so it needs no server.

```python
import chromadb

client = chromadb.PersistentClient(path="./chroma_db")      # data saved on disk

col = client.get_or_create_collection(
    name="bank_faq",
    configuration={"hnsw": {"space": "cosine"}},            # older Chroma: metadata={"hnsw:space": "cosine"}
)

col.add(
    ids=["f1", "f2", "f3", "f4"],
    documents=[
        "To reset your UPI PIN, open the app and tap 'Forgot PIN'.",
        "Failed UPI payments are refunded within a few working days.",
        "Home loan interest rates start from 8.5% per year.",
        "To update your mobile number, visit any branch with ID proof.",
    ],
    metadatas=[
        {"category": "payments", "year": 2025},
        {"category": "payments", "year": 2024},
        {"category": "loans", "year": 2025},
        {"category": "account", "year": 2023},
    ],
)   # no embeddings given: Chroma embeds with its default small model

res = col.query(
    query_texts=["I forgot my PIN"],
    n_results=2,
    where={"category": "payments"},                          # metadata filter
)
print(res["ids"][0], res["distances"][0])                    # cosine distance = 1 - similarity
print(res["documents"][0][0])
```

Other operations you will use: `col.upsert(...)` (insert or replace by ID), `col.delete(ids=[...])` or `col.delete(where={...})`, `col.count()`, and filters like `{"year": {"$gte": 2024}}` or `{"$and": [{...}, {...}]}`. In real projects you usually compute embeddings yourself (so you control the model) and pass `embeddings=` to `add` and `query_embeddings=` to `query`; the RAG chapter does this.

## Code: pgvector

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chunks (
    id         bigserial PRIMARY KEY,
    doc_id     text,
    dept       text,
    content    text,
    embedding  vector(384)                 -- dimension must match your model
);

-- HNSW index for cosine distance
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- top 5 HR chunks closest to the query vector
SET hnsw.ef_search = 100;                   -- recall vs speed knob
SELECT id, content, 1 - (embedding <=> '[0.12, -0.03, ...]') AS cosine_similarity
FROM chunks
WHERE dept = 'HR'
ORDER BY embedding <=> '[0.12, -0.03, ...]'  -- <=> is cosine distance
LIMIT 5;
```

pgvector operators: `<->` Euclidean distance, `<=>` cosine distance, `<#>` negative inner product. The big advantage: the same SQL can join with your `users`, `permissions` or `orders` tables, inside one transaction. See [Indexes and Performance](/interview/databases-sql/indexes-and-performance) for how Postgres indexes work in general.

## Code: Qdrant

```python
from qdrant_client import QdrantClient
from qdrant_client.models import (Distance, VectorParams, PointStruct,
                                  Filter, FieldCondition, MatchValue)

client = QdrantClient(":memory:")          # or QdrantClient(url="http://localhost:6333")

client.create_collection(
    collection_name="faq",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

# vectors come from your embedding model; short fake ones shown here for shape only
client.upsert(collection_name="faq", points=[
    PointStruct(id=1, vector=vec1, payload={"text": "Reset UPI PIN ...", "category": "payments"}),
    PointStruct(id=2, vector=vec2, payload={"text": "Home loan rates ...", "category": "loans"}),
])

hits = client.query_points(
    collection_name="faq",
    query=query_vec,
    query_filter=Filter(must=[FieldCondition(key="category", match=MatchValue(value="payments"))]),
    limit=3,
).points
for h in hits:
    print(h.id, round(h.score, 3), h.payload["text"])
```

## Code: FAISS

```python
import faiss
import numpy as np

d = 384
xb = np.random.rand(100_000, d).astype("float32")   # stand-in for document embeddings
faiss.normalize_L2(xb)                               # unit vectors -> inner product = cosine

index = faiss.IndexHNSWFlat(d, 32, faiss.METRIC_INNER_PRODUCT)   # M = 32
index.add(xb)

index.hnsw.efSearch = 64                             # recall vs speed at query time
xq = xb[:3].copy()                                   # three queries
scores, ids = index.search(xq, 5)                    # top 5 for each query
print(ids[0])                                        # first result is the query itself (id 0)
```

FAISS returns only integer IDs and scores. You keep a separate mapping from ID to text and metadata (a list, a dict, or a normal database).

## Running a vector DB in production

- **Size the memory.** For HNSW, estimate vectors + links: 1M × 768-d float32 vectors ≈ 3.1 GB, plus roughly M × 2 links × 4 bytes ≈ 128 bytes per vector for M = 16 at the bottom layer (≈ 0.13 GB), plus metadata. Quantization cuts the vector part.
- **Measure recall.** Compute exact top-k (flat search) for a sample of queries and compare with your ANN results. Tune `ef_search` / `nprobe` until recall meets your target.
- **Plan for updates and deletes.** Use stable IDs (for example `docid_chunknumber`) so re-ingesting a document **upserts** instead of duplicating.
- **Multi-tenancy.** Small tenants: one collection with a `tenant_id` filter. Large or strict tenants: a separate collection or namespace each.
- **Re-embedding.** Changing the embedding model means building a new collection, backfilling, then switching traffic.
- **Backups and monitoring.** Snapshot regularly; monitor latency (p95), memory, and index size. See [Monitoring, Cost and Caching](/interview/ai-engineer/mlops-deployment/monitoring-cost-and-caching).

## Key terms

| Term | Simple meaning |
|---|---|
| Vector database | A database that stores vectors with metadata and finds nearest ones fast |
| kNN | Finding the k closest vectors |
| Exact / flat search | Comparing the query with every stored vector |
| ANN | Approximate nearest neighbour search: fast, almost exact |
| Recall@k (for ANN) | Fraction of the true top-k that the index returned |
| IVF | Index that clusters vectors and searches only nearby clusters |
| Centroid | The centre point of a cluster |
| nlist / nprobe | IVF number of clusters / clusters searched per query |
| HNSW | Multi-layer graph index searched greedily from top to bottom |
| M | HNSW links per node |
| ef_construction / ef_search | HNSW candidate list size while building / searching |
| Product quantization (PQ) | Compressing vectors into short codes from learned codebooks |
| Re-scoring | Re-checking top candidates with full-precision vectors |
| DiskANN | Graph index designed to live mostly on SSD |
| Metadata / payload | Extra fields stored with each vector (source, date, user) |
| Pre-/post-/filtered search | Ways to combine filters with vector search |
| Multi-tenancy | Serving many customers while keeping their data apart |
| Namespace / collection | A separate group of vectors inside a database |
| Upsert | Insert a record, or replace it if the ID already exists |
| pgvector | Postgres extension that adds a vector type and indexes |
| FAISS | Meta's library for fast vector search inside a program |

## Interview questions

**Why do we need a vector database instead of a normal database?**
Normal B-tree indexes work for exact matches and ranges, not for "find the closest vectors in 768 dimensions". Comparing a query with every vector is too slow at millions of vectors. A vector database provides ANN indexes for fast similarity search, plus persistence, updates, metadata filtering, scaling and often hybrid search.

**What is ANN and why is it acceptable to be approximate?**
Approximate nearest neighbour search returns almost the true top-k by exploring only a small part of the data through an index. It is acceptable because embeddings are themselves approximate representations of meaning, so missing a neighbour that is very slightly closer rarely changes the final answer, and the speed gain is huge. We measure recall against exact search and tune for a target like 95–99%.

**Explain how HNSW works.**
HNSW builds a graph where each vector is linked to several near neighbours, organized in layers: the top layers have few nodes and long links, and the bottom layer has every node. A search starts at an entry point on the top layer, greedily moves to the neighbour closest to the query until it can't improve, then drops a layer and repeats. On the bottom layer it returns the best candidates found; M and ef_search control the recall-speed-memory trade-off.

**Compare IVF and HNSW.**
IVF clusters vectors with K-Means and searches only the nprobe nearest clusters; it uses less memory and pairs well with PQ compression, but needs training and can miss neighbours near cluster borders. HNSW uses a layered graph, gives high recall at low latency and handles inserts well, but uses more memory. HNSW is the common default; IVF-PQ is common at very large scale.

**What is product quantization?**
It compresses vectors by splitting them into sub-vectors and replacing each with the ID of its nearest codeword from a learned codebook. For example, a 768-dimension float32 vector of 3,072 bytes can become 96 one-byte codes, 32 times smaller. Distances become approximate, so systems often re-score the top candidates with full vectors.

**What is the problem with post-filtering, and how do you solve it?**
If you retrieve the top k and then apply a selective filter, most results may be removed, leaving few or none. For example, a filter matching 5% of documents leaves on average 0.5 of the top 10. The fix is filtered search inside the index, which most production vector databases support, or separate collections for large tenants.

**When would you choose pgvector over a dedicated vector database?**
When I already run Postgres, the data is up to a few million vectors, and I want vectors next to relational data with SQL filters, joins and transactions, without running another system. If I needed very large scale, heavy filtered search at high QPS, or advanced features like built-in hybrid search and quantization, I'd consider Qdrant, Weaviate, Milvus or a managed service.

**How do you implement multi-tenant access control in vector search?**
Store a tenant or user ID in each vector's metadata and apply it as a filter inside the vector query, never after retrieval in application code. For large tenants or strict isolation, use a separate collection or namespace per tenant. Also test that one tenant can never retrieve another's chunks.

**How do you check that your ANN index is good enough?**
Take a sample of real queries, compute the exact top-k with flat search as ground truth, and measure the ANN recall@k. Then tune ef_search or nprobe until recall meets the target while latency stays within budget. Repeat after big data changes or reindexing.

**What changes when you switch the embedding model?**
All existing vectors become incompatible, so you must re-embed every document into a new collection or index, possibly with a new dimension. Usually you build the new index in parallel, evaluate retrieval quality on a test set, then switch traffic and delete the old one.

## Try it yourself

1. **IVF math.** 5 million vectors, nlist = 2,000, nprobe = 20. About how many vectors are compared per query, and what fraction of brute force is that?
2. **Chroma filters.** Create a Chroma collection with 10 documents tagged with `city` and `year`. Write queries that use `{"city": "Pune"}` and `{"year": {"$gte": 2024}}` together with `$and`.
3. **FAISS recall.** Build a `faiss.IndexFlatIP` and an `IndexHNSWFlat` on 50,000 random normalized vectors. For 100 queries, compute recall@10 of HNSW against Flat at `efSearch` = 16, 64, 256.
4. **Memory sizing.** Estimate RAM for 20 million 1,024-dimension float32 vectors in HNSW with M = 16 (links only at the bottom layer, 4-byte IDs). What if you use int8 scalar quantization?

### Answers

1. Each cluster has about 5,000,000 ÷ 2,000 = 2,500 vectors. Comparisons ≈ 2,000 centroids + 20 × 2,500 = 52,000. That is 52,000 ÷ 5,000,000 ≈ 1% of brute force.
2. `col.query(query_texts=["..."], n_results=3, where={"$and": [{"city": "Pune"}, {"year": {"$gte": 2024}}]})`
3. Core loop:

```python
flat = faiss.IndexFlatIP(d); flat.add(xb)
_, true_ids = flat.search(xq, 10)
for ef in [16, 64, 256]:
    hnsw.hnsw.efSearch = ef
    _, ids = hnsw.search(xq, 10)
    recall = np.mean([len(set(a) & set(b)) / 10 for a, b in zip(ids, true_ids)])
    print(ef, round(recall, 3))
```

Recall should rise as efSearch increases (random vectors are a hard case, so real data usually does better).

4. Vectors: 20M × 1,024 × 4 = 81.9 GB. Links: 20M × 32 × 4 bytes = 2.56 GB. Total ≈ 85 GB plus metadata. With int8: vectors become 20.5 GB, total ≈ 23 GB.

**Next:** [RAG Fundamentals](/interview/ai-engineer/llms-genai/rag-fundamentals)
