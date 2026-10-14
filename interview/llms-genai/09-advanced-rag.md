---
title: Advanced RAG
part: Retrieval & RAG
summary: Techniques that make RAG work in production — hybrid search with BM25 and reciprocal rank fusion, cross-encoder reranking, query rewriting, multi-query, HyDE, parent-child chunks, contextual retrieval, GraphRAG and agentic RAG — plus a table of common RAG failures and their fixes.
---

The minimal RAG from [RAG Fundamentals](/interview/llms-genai/rag-fundamentals) works well in a demo. With real users it starts to fail: it misses exact product codes, answers follow-up questions badly, picks a chunk that is "similar" but not the one with the answer, or can't combine facts from two documents. This chapter covers the techniques teams add to fix these problems, what each one costs, and in what order to add them. Interviewers use these topics to separate people who built a tutorial from people who shipped a system.

> **In simple words:** Advanced RAG improves three things. Better **questions** (rewrite the user's query before searching), better **search** (combine keyword and vector search, then re-sort the results with a more careful model), and better **chunks** (store chunks with more context). For hard questions, let the LLM search several times like a researcher (agentic RAG).

## Where each technique fits

| Stage | Technique | Fixes |
|---|---|---|
| Before retrieval | query rewriting, multi-query, HyDE, decomposition | vague, conversational or multi-part questions |
| Retrieval | hybrid search (BM25 + vectors) | missed exact terms, codes, names |
| After retrieval | reranking, filtering, compression, ordering | right chunk retrieved but ranked low; noisy context |
| Indexing | parent-child chunks, contextual retrieval, summaries, metadata | chunks that lack context; precise search vs full context |
| Structure | GraphRAG | questions about relationships and themes across many documents |
| Orchestration | agentic RAG | multi-step questions needing several searches or tools |

> **Remember:** Add techniques only when your evaluation set shows a problem they solve. Each one adds latency, cost and complexity. The usual order that pays off: evaluation set → hybrid search → reranking → query rewriting → better chunking/contextual retrieval → agentic RAG for the hard cases.

## Hybrid search: keywords + vectors

Vector search understands meaning but is weak on exact strings. Keyword search (**BM25**) is the opposite ([Embeddings and Semantic Search](/interview/llms-genai/embeddings-and-semantic-search)). **Hybrid search** runs both and merges the results.

| Query | Vector search | BM25 |
|---|---|---|
| "my money got stuck after paying" | finds "failed UPI transaction refund" | misses it (different words) |
| "error code PNR-ERR-77" | may return other error pages | finds the exact page |
| "Section 80C limit" | may return other tax sections | finds "80C" exactly |

### BM25 in one formula

BM25 scores a document higher when it contains the query words, especially **rare** words, with diminishing credit for repeats and a correction for long documents.

<div class="formula">

| Formula | Meaning |
|---|---|
| score(D, Q) = Σ over query words q of IDF(q) × f(q, D) × (k₁ + 1) ÷ (f(q, D) + k₁ × (1 − b + b × \|D\| ÷ avgdl)) | BM25 |
| f(q, D) | how many times word q appears in document D |
| IDF(q) | high for rare words, low for common words like "the" |
| \|D\| ÷ avgdl | document length relative to the average |
| k₁ ≈ 1.2–2.0, b ≈ 0.75 | usual defaults; k₁ limits credit for repeats, b controls length correction |

</div>

### Merging results: reciprocal rank fusion

BM25 scores (like 12.7) and cosine similarities (like 0.83) are on different scales, so you can't just add them. The most popular way to merge is **reciprocal rank fusion (RRF)**: ignore the scores and use only each document's **rank** in each list.

<div class="formula">

| Formula | Meaning |
|---|---|
| RRF(d) = Σ over result lists of 1 ÷ (k + rank of d in that list) | k is a constant, usually 60 |
| a document missing from a list | gets nothing from that list |

</div>

#### Worked example: RRF with k = 60

| Doc | BM25 rank | Vector rank | RRF score |
|---|---|---|---|
| A | 1 | 3 | 1/61 + 1/63 = 0.016393 + 0.015873 = **0.032266** |
| B | 2 | 1 | 1/62 + 1/61 = 0.016129 + 0.016393 = **0.032522** |
| C | — | 2 | 1/62 = **0.016129** |
| D | 3 | — | 1/63 = **0.015873** |

Final order: **B, A, C, D**. B and A appear high in **both** lists, so they beat C and D, which appear in only one. That is exactly what we want: agreement between two different search methods is strong evidence.

Another way is **weighted score fusion**: normalize each score list to 0–1 and compute α × vector + (1 − α) × keyword. It needs tuning of α and normalization; RRF works well with no tuning, which is why it is the common default. Many vector databases (Weaviate, Qdrant, Elasticsearch/OpenSearch, Milvus, Pinecone) offer hybrid search built in.

### Hybrid search in plain Python

```python
import numpy as np
from rank_bm25 import BM25Okapi                    # pip install rank-bm25
from sentence_transformers import SentenceTransformer

docs = [
    "PNR-ERR-77 means the booking server timed out. Retry after 10 minutes.",
    "If money was debited but the ticket was not booked, the refund is automatic.",
    "Tatkal booking opens at 10 AM for AC classes and 11 AM for sleeper class.",
    "Error PNR-ERR-12 appears when the passenger name has special characters.",
]

bm25 = BM25Okapi([d.lower().split() for d in docs])
model = SentenceTransformer("all-MiniLM-L6-v2")
doc_emb = model.encode(docs, normalize_embeddings=True)

def ranks_from_scores(scores):
    order = np.argsort(-np.asarray(scores))        # best first
    return {int(doc): r for r, doc in enumerate(order, start=1)}

def hybrid_search(query, k=3, rrf_k=60):
    kw = ranks_from_scores(bm25.get_scores(query.lower().split()))
    q = model.encode([query], normalize_embeddings=True)[0]
    vec = ranks_from_scores(doc_emb @ q)
    fused = {d: 1 / (rrf_k + kw[d]) + 1 / (rrf_k + vec[d]) for d in range(len(docs))}
    best = sorted(fused, key=fused.get, reverse=True)[:k]
    return [(round(fused[d], 5), docs[d]) for d in best]

for score, doc in hybrid_search("what does pnr-err-77 mean"):
    print(score, doc)
```

(For simplicity, this gives every document a rank in both lists. In a real system each search returns only its top 50, and a document missing from a list gets no score from it.)

## Reranking with cross-encoders

The embedding model used for retrieval is a **bi-encoder**: it embeds the query and each document **separately** and compares vectors. That is fast (document vectors are precomputed) but a bit shallow, because the model never sees the query and the document together.

A **cross-encoder** takes the query and one document **together** as one input and outputs a relevance score. It can see exactly how each query word relates to each document word, so it is much more accurate. But it must run once per (query, document) pair at query time, so it is too slow to run on millions of documents.

The solution is a two-stage design: retrieve many candidates fast (for example top 50 from hybrid search), then **rerank** them with the cross-encoder and keep the best few (for example top 5) for the prompt.

<figure>
<svg viewBox="0 0 440 210" width="440" height="210" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<rect x="10" y="85" width="70" height="40" rx="8" />
<text x="45" y="110" text-anchor="middle" fill="currentColor" stroke="none">Query</text>
<polyline points="80,105 95,105 95,50 110,50" />
<polygon points="110,50 102,46 102,54" fill="currentColor" />
<polyline points="95,105 95,160 110,160" />
<polygon points="110,160 102,156 102,164" fill="currentColor" />
<rect x="110" y="30" width="100" height="40" rx="8" />
<text x="160" y="47" text-anchor="middle" fill="currentColor" stroke="none">BM25</text>
<text x="160" y="63" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">exact words · top 50</text>
<rect x="110" y="140" width="100" height="40" rx="8" />
<text x="160" y="157" text-anchor="middle" fill="currentColor" stroke="none">Vector search</text>
<text x="160" y="173" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">meaning · top 50</text>
<polyline points="210,50 225,50 225,105 240,105" />
<polyline points="210,160 225,160 225,105" />
<polygon points="240,105 232,101 232,109" fill="currentColor" />
<rect x="240" y="85" width="80" height="40" rx="8" />
<text x="280" y="102" text-anchor="middle" fill="currentColor" stroke="none">RRF</text>
<text x="280" y="118" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">merge ranks</text>
<line x1="320" y1="105" x2="345" y2="105" />
<polygon points="345,105 337,101 337,109" fill="currentColor" />
<rect x="345" y="85" width="85" height="40" rx="8" />
<text x="387" y="102" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">Cross-encoder</text>
<text x="387" y="118" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">rerank</text>
<line x1="387" y1="125" x2="387" y2="160" />
<polygon points="387,160 383,152 391,152" fill="currentColor" />
<rect x="330" y="160" width="100" height="40" rx="8" />
<text x="380" y="185" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">top 5 → LLM</text>
</svg>
<figcaption>Two cheap searches cast a wide net; fusion merges them; a slower, more accurate reranker picks the few chunks the LLM will read.</figcaption>
</figure>

| | Bi-encoder (embedding model) | Cross-encoder (reranker) |
|---|---|---|
| Input | query and document separately | query and document together |
| Document work at query time | none (vectors precomputed) | one model run per candidate |
| Speed | very fast, millions of docs | slow; tens to a few hundred candidates |
| Accuracy | good | better |
| Role | first-stage retrieval | second-stage reranking |

```python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")   # small, English

query = "how long does a failed ticket refund take"
candidates = [   # e.g. the top 50 from hybrid search; 4 shown
    "Tatkal booking opens at 10 AM for AC classes.",
    "If money was debited but the ticket was not booked, the refund is automatic within 3-5 working days.",
    "Refund rules for cancelled confirmed tickets depend on time before departure.",
    "PNR-ERR-77 means the booking server timed out.",
]
scores = reranker.predict([(query, c) for c in candidates])        # one score per pair
ranked = sorted(zip(scores, candidates), reverse=True)
for s, c in ranked[:2]:
    print(round(float(s), 2), c)
```

The failed-booking refund passage should come first. Other rerankers: the `BAAI/bge-reranker` family (open, multilingual options), and hosted rerank APIs from Cohere, Voyage AI and others. You can also ask an LLM to score or sort candidates (**LLM reranking**): accurate but slower and more expensive.

> **Interview tip:** "Why not use the cross-encoder for everything?" Answer: a cross-encoder must process every (query, document) pair at query time, so scoring a million documents per query is far too slow; a bi-encoder precomputes document vectors. So we use the bi-encoder (plus BM25) for recall over everything, and the cross-encoder for precision over a short list.

## Improving the query

Users write short, vague, or conversational questions. Fixing the query before searching is cheap and often very effective.

### Query rewriting for follow-ups

In a chat, the second question often depends on the first:

```text
User: What is the refund rule for cancelled Tatkal tickets?
Bot:  ...
User: And for 3AC?
```

Searching for "And for 3AC?" finds nothing useful. **Query rewriting** uses a small, fast LLM to turn the latest message plus history into a **standalone** search query.

```python
import anthropic

client = anthropic.Anthropic()

def rewrite_query(history: list[dict], question: str) -> str:
    convo = "\n".join(f'{m["role"]}: {m["content"]}' for m in history[-6:])  # recent turns only
    resp = client.messages.create(
        model="claude-haiku-5-5",                      # small model: fast and cheap
        max_tokens=100,
        output_config={"effort": "low"},
        messages=[{"role": "user", "content":
            "Rewrite the last user question as a standalone search query, using the "
            "conversation for missing details. Return only the query.\n\n"
            f"<conversation>\n{convo}\n</conversation>\n<question>{question}</question>"}],
    )
    return "".join(b.text for b in resp.content if b.type == "text").strip()

# rewrite_query(history, "And for 3AC?")
# -> "refund rules for cancelled 3AC train tickets"   (example output)
```

### Multi-query

One phrasing may miss documents that use different words. **Multi-query retrieval** asks an LLM for 3–5 different versions of the question, retrieves for each, and merges the lists with RRF.

```text
Original: "Can I carry my pet on a train?"
Variants: "rules for travelling with dogs or cats in Indian Railways"
          "pet transport booking in train first AC"
          "animal luggage policy railway"
```

It improves recall at the cost of extra retrieval calls and one LLM call.

### HyDE (Hypothetical Document Embeddings)

A question and its answer often look different ("How long is the warranty?" vs "All laptops include a 12-month manufacturer warranty..."). **HyDE** asks the LLM to write a short **hypothetical answer** first (it may be wrong in details), then embeds that fake answer and searches with it. The fake answer is written in "document style", so it lands closer to real answer passages.

| Technique | How | Helps when | Cost / risk |
|---|---|---|---|
| Query rewriting | make a standalone, clearer query | chat follow-ups, vague queries | one small LLM call |
| Multi-query | several paraphrases, fuse results | vocabulary mismatch | several retrievals + one LLM call |
| HyDE | embed a generated hypothetical answer | question and answer phrased very differently | LLM call; can drift for topics the LLM doesn't know |
| Decomposition | split into sub-questions | multi-part or comparison questions | several retrieval rounds |
| Step-back | also search a more general version of the question | questions needing background principles | extra retrieval |

**Decomposition** example: "Compare the leave policy of 2024 with 2025" becomes "leave policy 2024" and "leave policy 2025", retrieved separately, then answered together.

## Better chunks

### Parent-child (small-to-big) retrieval

Small chunks are best for **finding** (precise vectors). Large chunks are best for **answering** (enough context). **Parent-child retrieval** gets both: split each section (the **parent**, say 1,500 tokens) into small **child** chunks (say 200 tokens). Index only the children. When a child matches, send its **parent** to the LLM.

```python
# at indexing time, store the parent id in each child's metadata
col.upsert(ids=child_ids, embeddings=embed(child_texts), documents=child_texts,
           metadatas=[{"parent_id": pid} for pid in child_parent_ids])

# at query time
res = col.query(query_embeddings=embed([question]), n_results=10)
parent_ids = list(dict.fromkeys(m["parent_id"] for m in res["metadatas"][0]))[:3]  # unique, in order
context = [parents[pid] for pid in parent_ids]     # parents stored in a dict or another table
```

A related idea is the **sentence window**: index single sentences, and send each matched sentence with a few sentences around it.

### Contextual retrieval

A chunk often makes no sense alone: "The limit was increased to ₹5 lakh from April." Which limit? Which year? Its embedding doesn't know either, and BM25 can't match "health insurance" because those words are not in the chunk.

**Contextual retrieval** (described by Anthropic in 2024) fixes this at indexing time. For each chunk, an LLM reads the **whole document** and writes one or two sentences of context for that chunk, which are **prepended** to the chunk before embedding **and** before building the BM25 index:

```text
Context added: "This chunk is from ShopKart's 2025 Employee Benefits policy,
section 4 on health insurance top-up coverage."
Chunk: "The limit was increased to ₹5 lakh from April."
```

Anthropic reported that this, combined with hybrid search and reranking, substantially reduced retrieval failures in their tests. The cost is one LLM call per chunk at indexing time; because every call for the same document repeats the same long document text, **prompt caching** makes it much cheaper. It is a one-time cost, not a per-query cost.

### Other indexing ideas

- **Metadata extraction**: use an LLM to tag each chunk with product, year, department, so you can filter.
- **Summaries**: index a summary of each document (or a tree of summaries, as in the RAPTOR method) for broad questions, alongside the detailed chunks.
- **Question generation**: generate likely questions for each chunk and index those too, so questions match questions.

## After retrieval: compress and order

- **Filter**: drop chunks below a rerank score threshold, so weak matches don't distract the model.
- **Deduplicate**: overlapping chunks and copies of the same FAQ waste context.
- **Compress**: extract only the relevant sentences from each chunk (with a small model) when context is tight.
- **Order**: models use the beginning and end of the context best ("lost in the middle"); put the strongest chunks first.

## GraphRAG

Some questions are not about one passage. "What are the main complaints across 5,000 support tickets this quarter?" or "How are these three companies connected?" Plain RAG retrieves a few similar chunks and can't see the big picture or follow relationships.

**GraphRAG** (popularized by Microsoft Research in 2024) builds a **knowledge graph** from the documents:

1. An LLM extracts **entities** (people, companies, products, places) and **relationships** between them from every chunk.
2. The graph is grouped into **communities** of closely connected entities, and the LLM writes a summary for each community.
3. At query time, **local search** starts from entities in the question and follows their relationships; **global search** uses the community summaries to answer questions about the whole collection.

| Plain vector RAG | GraphRAG |
|---|---|
| best for "find the passage that answers this" | best for relationships, multi-hop links, themes across many documents |
| cheap indexing (embeddings only) | expensive indexing (many LLM calls to extract entities and summaries) |
| easy to update | harder to update the graph incrementally |
| simple to explain | more moving parts |

Use it when your evaluation shows many relationship or "whole collection" questions. For most document Q&A, hybrid search + reranking is enough.

## Agentic RAG

In all the designs above, retrieval happens **once**, in a fixed order, decided by your code. In **agentic RAG**, the LLM decides **whether**, **what**, and **how many times** to search, using retrieval as a tool. It can:

- reformulate and search again when results are poor,
- break a question into sub-questions and search for each,
- choose between sources (the policy vector DB, a SQL database of orders, web search),
- check whether the evidence is enough before answering.

A minimal version with a simple text protocol (the proper way uses tool calling; see [Tool Calling](/interview/llms-genai/tool-calling) and [AI Agents](/interview/llms-genai/ai-agents)):

```python
def agentic_answer(question: str, max_steps: int = 4) -> str:
    notes = []
    for step in range(max_steps):                          # hard limit on loops
        prompt = (
            "You answer questions using a document search tool.\n"
            "Reply with exactly one line:\n"
            "SEARCH: <query>   to search the documents, or\n"
            "ANSWER: <final answer with [ids]>   when the notes are enough.\n\n"
            f"<question>{question}</question>\n<notes>\n" + "\n".join(notes) + "\n</notes>"
        )
        reply = ask(prompt).strip()                        # ask() = one LLM call returning text
        if reply.startswith("ANSWER:"):
            return reply.removeprefix("ANSWER:").strip()
        query = reply.removeprefix("SEARCH:").strip()
        for h in retrieve(query, k=3):                     # retrieve() from the RAG chapter
            notes.append(f'[{h["id"]}] {h["text"][:500]}')
    return "I could not find enough information to answer confidently."
```

| Fixed pipeline RAG | Agentic RAG |
|---|---|
| one retrieval, predictable | several retrievals, flexible |
| low, stable latency and cost | higher and variable latency and cost |
| easy to test | harder to test and debug |
| best for simple factual Q&A | best for complex, multi-step research questions |

A practical design is a **router**: simple questions go through the fast fixed pipeline; complex ones go to the agent. Related research ideas you may hear: **Self-RAG** (the model decides when to retrieve and critiques its own output) and **Corrective RAG** (grade the retrieved documents and search again, possibly on the web, if they are poor).

## Common RAG failures and fixes

| Failure | Symptom | Likely cause | Fix |
|---|---|---|---|
| Content missing | confident wrong answer or "not found" | the answer isn't in the indexed data | check coverage; add sources; make abstention work |
| Bad extraction | garbled numbers, mixed columns | PDF parsing, tables, OCR | better parsers, table handling, manual checks |
| Right chunk not retrieved | answer exists but never in top-k | vocabulary mismatch, poor embedding model, chunk too big | hybrid search, query rewriting, better model, smaller chunks |
| Right chunk ranked too low | retrieved at rank 15, cut at top 5 | bi-encoder ranking too coarse | reranking; larger first-stage k |
| Chunk lacks context | "the limit" without saying which | chunking cut the context | contextual retrieval, parent-child, structure-aware chunking |
| Follow-up questions fail | "and for 3AC?" finds nothing | query not standalone | conversational query rewriting |
| Multi-part questions half-answered | only one part answered | single retrieval | decomposition, multi-query, agentic RAG |
| Context ignored or misread | answer contradicts the chunk | too much noisy context, weak prompt, lost in the middle | fewer, better chunks; strongest first; clearer grounding prompt |
| Hallucinated citations | cited ID not in context | model invents references | validate IDs; use API citation features |
| Stale answers | old price or policy | index not refreshed; duplicates of old versions | incremental re-indexing; delete old versions; date metadata and filters |
| Conflicting documents | mixes 2023 and 2025 rules | both versions retrieved | metadata filter by date/version; tell the model to prefer the newest |
| Permission leak | user sees another team's data | filter applied after retrieval, or missing | permission filter inside the vector query; tenant collections |
| Prompt injection via documents | bot follows instructions hidden in a document | untrusted text in context | treat documents as data, guardrails, least-privilege tools ([Safety, Guardrails and Prompt Injection](/interview/llms-genai/safety-guardrails-and-prompt-injection)) |
| Numeric/table questions wrong | wrong totals or comparisons | LLM arithmetic over text tables | route to SQL or a code tool; structured data stays structured |
| Too slow | users wait several seconds before text appears | too many LLM calls in the pipeline | small models for rewriting, caching, parallel retrieval, stream the answer |

> **Common mistake:** Tuning the prompt for weeks when the real problem is retrieval. Always log the retrieved chunks for each question. In your evaluation, measure retrieval recall separately from answer quality, so you know which half to fix.

## A production RAG design

Putting it together, a strong but sensible production pipeline looks like this:

1. **Indexing**: good parsing → structure-aware chunks (≈ 400–600 tokens) with contextual headers → embeddings + BM25 index → metadata (source, page, date, access groups) → stable IDs and incremental updates.
2. **Query**: conversational rewrite (small model) → hybrid retrieval (top 30–50 each) with permission filter → RRF → cross-encoder rerank → top 5–8 → grounded prompt with IDs → strong LLM, streamed → citation validation.
3. **Routing**: complex questions go to an agentic loop with a step limit.
4. **Evaluation and monitoring**: golden set run in CI; log queries, chunks, answers, latency, cost; review failures weekly ([Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps), [Monitoring, Cost and Caching](/interview/mlops-deployment/monitoring-cost-and-caching)).

The latency budget, roughly in orders of magnitude: retrieval takes tens of milliseconds, a small-model rewrite and a reranker each add around a few hundred milliseconds, and generation takes seconds (which streaming hides). A full case study is in [Enterprise Document Chatbot](/interview/ai-system-design/case-enterprise-document-chatbot).

## Key terms

| Term | Simple meaning |
|---|---|
| Hybrid search | Combining keyword (BM25) and vector search results |
| BM25 | Keyword scoring that rewards rare matching words, with limits for repeats and length |
| IDF | Inverse document frequency: rare words get higher weight |
| Reciprocal rank fusion (RRF) | Merging ranked lists by summing 1 ÷ (k + rank) |
| Weighted score fusion | Merging normalized scores with a weight α |
| Bi-encoder | Embeds query and document separately; fast |
| Cross-encoder | Scores query and document together; accurate but slow |
| Reranking | Re-sorting a short candidate list with a more accurate model |
| LLM reranking | Using an LLM to score or order candidates |
| Query rewriting | Turning a vague or follow-up question into a clear standalone query |
| Multi-query retrieval | Searching with several paraphrases and merging results |
| HyDE | Searching with the embedding of a generated hypothetical answer |
| Query decomposition | Splitting a complex question into sub-questions |
| Step-back prompting | Also searching a more general version of the question |
| Parent-child retrieval | Match small chunks, send their larger parent section |
| Sentence window | Match a sentence, send it with its neighbouring sentences |
| Contextual retrieval | Prepending LLM-written context to each chunk before indexing |
| Contextual compression | Keeping only the relevant sentences of retrieved chunks |
| Knowledge graph | Entities and their relationships stored as a graph |
| GraphRAG | RAG over an LLM-built knowledge graph with community summaries |
| Agentic RAG | The LLM decides when and what to retrieve, possibly many times |
| Self-RAG / Corrective RAG | Variants where the model critiques retrieval and retries |
| Router | Logic that sends each question to a simple or complex pipeline |

## Interview questions

**What is hybrid search and why use it?**
Hybrid search runs keyword search (BM25) and vector search and merges the results. Vector search handles paraphrases and meaning, while BM25 handles exact terms like product codes, error codes and names that embeddings often blur. Merging, usually with reciprocal rank fusion, gives better recall than either alone.

**Explain reciprocal rank fusion with an example.**
Each document's fused score is the sum over result lists of 1 divided by (60 plus its rank in that list). If document B is rank 2 in BM25 and rank 1 in vector search, it scores 1/62 + 1/61 ≈ 0.0325, while a document that is rank 2 in only one list scores 1/62 ≈ 0.0161. It uses only ranks, so it needs no score normalization and rewards documents both methods agree on.

**What is the difference between a bi-encoder and a cross-encoder?**
A bi-encoder embeds the query and documents separately, so document vectors are precomputed and search over millions is fast. A cross-encoder reads the query and one document together and outputs a relevance score, which is more accurate but needs one model run per pair at query time. So we retrieve with bi-encoders and BM25, then rerank the top few dozen with a cross-encoder.

**When does reranking help and what does it cost?**
It helps when the right chunk is retrieved but not ranked high enough to make the final top-k, which is very common. It costs extra latency, typically a few hundred milliseconds for tens of candidates, plus compute or API cost. I'd measure the improvement in answer quality on the golden set to justify it.

**How do you handle follow-up questions in a RAG chatbot?**
Use conversational query rewriting: a small LLM takes recent history and the new message and writes a standalone search query, such as turning "and for 3AC?" into "refund rules for cancelled 3AC tickets". Retrieval then uses the rewritten query, while the answer step still sees the conversation.

**What is HyDE and when can it hurt?**
HyDE generates a hypothetical answer to the question with an LLM and embeds that answer to search, because answer-style text is closer to real document passages than a short question. It helps when questions and documents are phrased very differently. It can hurt when the LLM knows little about the topic and writes a misleading fake answer, pulling retrieval toward wrong documents, and it adds an LLM call.

**What is parent-child retrieval?**
You index small child chunks for precise matching but store a link to their larger parent section. When a child matches, you send the parent to the LLM so it has full context. It gives the precision of small chunks and the context of large ones, at the cost of more storage and logic.

**What is contextual retrieval?**
At indexing time, an LLM reads the whole document and writes a short context sentence for each chunk, such as which policy and section it belongs to, and this is prepended to the chunk before embedding and BM25 indexing. Chunks that were ambiguous alone become findable. It adds a one-time indexing cost, which prompt caching reduces because the same document is reused for every chunk.

**When would you use GraphRAG instead of vector RAG?**
When many questions are about relationships between entities, multi-hop connections, or themes across a large collection, like "what are the main issues across all reports". GraphRAG extracts entities and relations into a graph and summarizes communities, which supports these global questions. It is expensive to build and update, so for normal passage lookup questions I'd stay with hybrid search and reranking.

**What is agentic RAG and what are its risks?**
The LLM uses retrieval as a tool and decides whether to search, what to search, and when it has enough evidence, possibly searching many times or using other tools like SQL. It handles complex multi-step questions better. The risks are higher and unpredictable latency and cost, loops, and harder testing, so I'd add step limits, route only complex questions to it, and evaluate it separately.

**Your RAG system works in tests but users say answers are often outdated. What do you do?**
Check whether the index is refreshed when documents change and whether old versions are still stored alongside new ones. I'd add incremental re-indexing with stable IDs, delete or mark superseded versions, store dates or version metadata, filter or prefer the latest version, and tell the model to prefer the newest document when sources conflict. Then add "freshness" questions to the golden set.

**How do you decide which advanced techniques to add?**
I start with an evaluation set that measures retrieval recall and answer faithfulness separately, then look at failure categories. Missed exact terms suggest hybrid search, correct-but-low-ranked chunks suggest reranking, failed follow-ups suggest query rewriting, ambiguous chunks suggest contextual retrieval or parent-child, and multi-step questions suggest decomposition or agentic RAG. I add one change at a time and keep it only if the metrics improve enough to justify the latency and cost.

## Try it yourself

1. **RRF by hand.** BM25 ranks: X = 1, Y = 2, Z = 3. Vector ranks: Z = 1, W = 2, X = 3. Compute RRF scores with k = 60 and give the final order.
2. **Add hybrid search** to the minimal RAG from the previous chapter: build a BM25 index over the same chunks, retrieve the top 20 from each, and fuse with RRF. Test with a query containing an exact code or number.
3. **Add a reranker.** After fusion, rerank the top 20 with `cross-encoder/ms-marco-MiniLM-L-6-v2` and keep 5. On 10 questions with known answer pages, compare how often the right page is in the final 5 with and without reranking.
4. **Query rewriting.** Write three two-turn conversations where the second question depends on the first. Run `rewrite_query` and check whether each rewrite is a good standalone search query.

### Answers

1. X: 1/61 + 1/63 = 0.016393 + 0.015873 = 0.032266. Z: 1/63 + 1/61 = 0.032266 (a tie with X). Y: 1/62 = 0.016129. W: 1/62 = 0.016129 (a tie with Y). Order: X and Z tied first, then Y and W tied. Ties are broken by a rule you choose, such as the vector rank.
2. Keep a list of chunk texts in the same order as their IDs, build `BM25Okapi` over tokenized chunks, and reuse the `hybrid_search` logic, giving 0 to documents missing from a list. Exact-code queries should now find the right chunk reliably.
3. Typically the right page appears in the top 5 more often after reranking; the size of the gain depends on your data. Also record the added latency.
4. A good rewrite contains every needed detail from the history (the topic, the entity, the time), and no words like "it" or "that".

**Next:** [Tool Calling](/interview/llms-genai/tool-calling)
