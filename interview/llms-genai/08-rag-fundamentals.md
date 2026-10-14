---
title: RAG Fundamentals
part: Retrieval & RAG
summary: Why retrieval-augmented generation exists, the full pipeline (load, chunk, embed, store, retrieve, augment, generate), chunking strategies with sizes and overlap, a complete minimal RAG in plain Python with an embedding model, Chroma and Claude, and how to add citations.
---

**Retrieval-augmented generation (RAG)** is the most common pattern in real LLM products: "chat with your PDFs", internal knowledge bots, customer-support assistants, legal and medical search. If you build one project for your portfolio, it is usually a RAG app, and nearly every AI engineer interview asks you to explain or design one. This chapter builds RAG from first principles, with no framework hiding the steps.

> **In simple words:** Before asking the LLM, search your own documents for the passages most related to the question, paste those passages into the prompt, and tell the model to answer only from them and say which passage it used. The model becomes an "open-book exam" student instead of answering from memory.

## Why RAG exists

An LLM on its own has four problems for business use:

| Problem | Example |
|---|---|
| It doesn't know your private data | your company's HR policy, your product manuals |
| Its knowledge has a cutoff date | this month's price list, today's train timings |
| It may hallucinate | invents a refund rule that sounds right |
| It can't show where an answer came from | users and auditors can't verify it |

RAG fixes all four by giving the model the right facts at question time. Because the facts are in the prompt, you can update them any time (just re-index the documents), and you can show **citations**.

> **Real-life example:** A closed-book exam tests what you memorized; you may confidently write something wrong. An open-book exam lets you look up the right page, and the examiner can check which page you used. RAG turns the LLM's job into an open-book exam.

| Approach | How knowledge gets in | Update cost | Citations | Good for |
|---|---|---|---|---|
| Plain LLM | training data only | retrain (impossible for you) | no | general knowledge |
| Paste everything into the prompt | whole documents in context | none | possible | small document sets, low volume |
| **RAG** | retrieve relevant chunks per question | re-index changed docs | yes | large or changing private knowledge |
| Fine-tuning | changes model weights | retrain | no | style, format, narrow skills, not facts |

> **Remember:** Fine-tuning is for teaching **behaviour** (format, tone, a skill). RAG is for giving **knowledge** (facts that change or must be cited). This sentence answers a very common interview question. More in [Fine-Tuning with LoRA and QLoRA](/interview/llms-genai/fine-tuning-lora-and-qlora).

## The pipeline

RAG has two halves. **Indexing** runs offline whenever documents change. **Querying** runs for every user question.

<figure>
<svg viewBox="0 0 440 230" width="440" height="230" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<text x="10" y="16" fill="currentColor" stroke="none" font-size="11" font-weight="bold">Indexing (offline)</text>
<rect x="10" y="26" width="90" height="36" rx="8" />
<text x="55" y="49" text-anchor="middle" fill="currentColor" stroke="none">Load docs</text>
<line x1="100" y1="44" x2="120" y2="44" />
<polygon points="120,44 112,40 112,48" fill="currentColor" />
<rect x="120" y="26" width="90" height="36" rx="8" />
<text x="165" y="49" text-anchor="middle" fill="currentColor" stroke="none">Chunk</text>
<line x1="210" y1="44" x2="230" y2="44" />
<polygon points="230,44 222,40 222,48" fill="currentColor" />
<rect x="230" y="26" width="90" height="36" rx="8" />
<text x="275" y="49" text-anchor="middle" fill="currentColor" stroke="none">Embed</text>
<line x1="320" y1="44" x2="340" y2="44" />
<polygon points="340,44 332,40 332,48" fill="currentColor" />
<rect x="340" y="26" width="90" height="36" rx="8" />
<text x="385" y="49" text-anchor="middle" fill="currentColor" stroke="none">Vector DB</text>
<text x="10" y="98" fill="currentColor" stroke="none" font-size="11" font-weight="bold">Query (online)</text>
<rect x="10" y="108" width="90" height="36" rx="8" />
<text x="55" y="131" text-anchor="middle" fill="currentColor" stroke="none">Question</text>
<line x1="100" y1="126" x2="120" y2="126" />
<polygon points="120,126 112,122 112,130" fill="currentColor" />
<rect x="120" y="108" width="90" height="36" rx="8" />
<text x="165" y="131" text-anchor="middle" fill="currentColor" stroke="none">Embed query</text>
<line x1="210" y1="126" x2="340" y2="126" />
<polygon points="340,126 332,122 332,130" fill="currentColor" />
<text x="275" y="119" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">query vector</text>
<line x1="385" y1="62" x2="385" y2="108" />
<polygon points="385,108 381,100 389,100" fill="currentColor" />
<rect x="340" y="108" width="90" height="36" rx="8" />
<text x="385" y="131" text-anchor="middle" fill="currentColor" stroke="none">Retrieve top-k</text>
<line x1="385" y1="144" x2="385" y2="180" />
<polygon points="385,180 381,172 389,172" fill="currentColor" />
<rect x="340" y="180" width="90" height="36" rx="8" />
<text x="385" y="203" text-anchor="middle" fill="currentColor" stroke="none">Build prompt</text>
<line x1="340" y1="198" x2="300" y2="198" />
<polygon points="300,198 308,194 308,202" fill="currentColor" />
<rect x="200" y="180" width="100" height="36" rx="8" />
<text x="250" y="203" text-anchor="middle" fill="currentColor" stroke="none">LLM answers</text>
<line x1="200" y1="198" x2="160" y2="198" />
<polygon points="160,198 168,194 168,202" fill="currentColor" />
<rect x="10" y="180" width="150" height="36" rx="8" />
<text x="85" y="203" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Answer + citations</text>
</svg>
<figcaption>Indexing fills the vector DB once; every question then retrieves a few chunks and sends them to the LLM with the question.</figcaption>
</figure>

The seven steps: **load → chunk → embed → store → retrieve → augment → generate**. Let's go through each, then build the whole thing.

## Step 1: Load

Turn your sources into plain text plus **metadata** (where it came from).

| Source | Common tools | Watch out for |
|---|---|---|
| PDFs with text | `pypdf`, `pymupdf` | headers/footers repeated on every page, two-column layouts |
| Scanned PDFs / images | OCR (Tesseract), document AI services, vision LLMs | OCR errors in numbers and names |
| Word, PowerPoint, HTML | `python-docx`, `unstructured`, `docling`, BeautifulSoup | menus and boilerplate text in HTML |
| Tables (Excel, CSV, tables inside PDFs) | pandas; table extractors | flattening a table loses row/column meaning |
| Wikis, Confluence, Notion, Google Drive | APIs or connectors | permissions must come along |

Always keep metadata such as `source` (file name or URL), `page`, `title`, `section`, `updated_at` and, for company data, **who is allowed to see it**. You need these for citations and filtering.

> **Common mistake:** Ignoring document quality. If the text extraction is broken (columns mixed, tables flattened into number soup), no embedding model or LLM can fix it later. Look at your extracted text with your own eyes before building anything else. "Garbage in, garbage out" is the biggest RAG lesson.

## Step 2: Chunk

A **chunk** is a small piece of a document that is embedded and retrieved as one unit. We split documents because:

1. Embedding models have a maximum input length (often 512 to 8,192 tokens), and anything longer is cut off.
2. One vector for a whole 50-page document is a blurry average; a vector for one paragraph is precise.
3. We only want to put the **relevant** parts into the prompt, to save tokens and avoid distraction.

**Chunk overlap** means consecutive chunks share some text at their borders, so a sentence cut at a boundary still appears whole in at least one chunk.

### Chunking strategies

| Strategy | How it splits | Typical size / overlap | Good for | Weakness |
|---|---|---|---|---|
| Fixed-size (tokens) | every N tokens | 256–512 tokens, 10–20% overlap | quick baseline, uniform text | cuts mid-sentence and mid-idea |
| Recursive character | try paragraphs, then lines, then sentences, then words until under the limit | 500–1,500 characters, 100–200 overlap | most prose; the common default | ignores document structure |
| Sentence-based | group whole sentences up to a limit | 3–10 sentences, 1–2 sentence overlap | articles, FAQs, chat logs | very long sentences |
| Structure-aware (headings) | split on Markdown/HTML headings or sections, then size-limit | one section, max ~500–1,000 tokens | manuals, docs, policies, wikis | uneven sizes |
| Page-based | one chunk per page (or split long pages) | one page | PDFs where users cite pages; slides | pages that cut a topic in half |
| Semantic chunking | start a new chunk where the embedding similarity between neighbouring sentences drops | variable | mixed-topic long texts | slower; more tuning |
| Code-aware | split by function/class using the syntax tree | one function or class | code search | needs a parser per language |
| Parent-child | retrieve small chunks, but send their larger parent section to the LLM | child 100–300 tokens, parent 1,000–2,000 | precise search + full context | more storage and logic (see [Advanced RAG](/interview/llms-genai/advanced-rag)) |

### Chunk size trade-off

| Smaller chunks (100–300 tokens) | Larger chunks (800–1,500 tokens) |
|---|---|
| more precise matching | more context per chunk |
| may lose surrounding meaning ("it", "this rule") | vector is a blurry average of several ideas |
| need more chunks (higher k) per answer | fewer chunks fit in the prompt |
| more vectors to store | fewer vectors |

A good starting point for prose: **about 400–600 tokens with 10–15% overlap**, retrieving the top **4–8** chunks. Then tune with an evaluation set; the best size depends on your documents and questions.

### Worked example: how many chunks?

A 100-page policy PDF with about 500 words per page has 50,000 words. With 1 token ≈ 0.75 words, that is 50,000 ÷ 0.75 ≈ **66,700 tokens**.

With chunk size 500 tokens and overlap 50 tokens, each new chunk starts 500 − 50 = **450** tokens after the previous one (this is the **stride**).

<div class="formula">

| Formula | Meaning |
|---|---|
| stride = chunk_size − overlap | how far each new chunk moves forward |
| number of chunks ≈ ⌈(total_tokens − chunk_size) ÷ stride⌉ + 1 | ⌈ ⌉ means round up |

</div>

Number of chunks = ⌈(66,700 − 500) ÷ 450⌉ + 1 = ⌈147.1⌉ + 1 = 148 + 1 = **149 chunks**.

| Chunk size / overlap | Stride | Chunks for 66,700 tokens |
|---|---|---|
| 200 / 20 | 180 | 371 |
| 500 / 50 | 450 | 149 |
| 1,000 / 100 | 900 | 74 |

Retrieving the top 5 chunks of 500 tokens puts about 2,500 tokens of context into each prompt, which is cheap compared with sending all 66,700.

### A simple chunker

This splits text into word-based chunks with overlap, trying to end chunks at sentence boundaries. Words are a rough stand-in for tokens; for exact token sizes use your embedding model's tokenizer.

```python
import re

def chunk_text(text: str, max_words: int = 350, overlap_words: int = 50) -> list[str]:
    """Split text into chunks of whole sentences, about max_words long, with overlap."""
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())   # split after . ! ?
    chunks, current = [], []
    for sent in sentences:
        words = sent.split()
        if current and len(current) + len(words) > max_words:
            chunks.append(" ".join(current))
            current = current[-overlap_words:]              # carry the tail into the next chunk
        current.extend(words)
    if current:
        chunks.append(" ".join(current))
    return chunks

text = "UPI refunds take up to 5 days. " * 200
parts = chunk_text(text)
print(len(parts), len(parts[0].split()))
```

350 words ≈ 470 tokens, which matches the starting point above. Libraries like LangChain's `RecursiveCharacterTextSplitter` or LlamaIndex's node parsers do the same with more options ([LangChain, LangGraph and LlamaIndex](/interview/llms-genai/langchain-langgraph-and-llamaindex)), but you should be able to write it yourself.

## Steps 3 and 4: Embed and store

Embed every chunk with an embedding model ([Embeddings and Semantic Search](/interview/llms-genai/embeddings-and-semantic-search)) and store the vector, the chunk text and its metadata in a vector database ([Vector Databases](/interview/llms-genai/vector-databases)). Give each chunk a **stable ID** like `policy.pdf:p12:c3`, so re-indexing a changed document replaces old chunks instead of duplicating them.

## Step 5: Retrieve

At question time, embed the question with the **same** embedding model and ask the vector DB for the top-k most similar chunks, applying any metadata filters (user permissions, document type, date).

Choosing k: too few and you miss needed facts; too many and you add noise and cost. Start with k = 4–8. A similarity cutoff can drop chunks that are clearly unrelated, but tune it on your data, because score scales differ between models.

## Step 6: Augment the prompt

Build a prompt that contains the instructions, the retrieved chunks clearly labelled with IDs, and the question. This is where good prompt engineering ([Prompt Engineering](/interview/llms-genai/prompt-engineering)) pays off.

```text
System:
You answer questions about ShopKart's company policies for employees.
Use ONLY the information in the <documents>. If the answer is not in the
documents, say "I couldn't find this in the policy documents" and suggest
contacting HR. After each sentence that uses a document, cite its id in
square brackets, like [hr.pdf:p4]. Keep answers under 120 words.

User:
<documents>
<document id="hr.pdf:p4">Employees get 24 days of paid leave per year ...</document>
<document id="hr.pdf:p5">Unused leave up to 10 days can be carried forward ...</document>
<document id="travel.pdf:p2">Train travel in 3AC is reimbursed for ...</document>
</documents>

<question>How many leave days can I carry forward to next year?</question>
```

Key parts:

- **Grounding instruction**: answer only from the documents.
- **Permission to abstain**: a clear sentence to use when the answer isn't there. This is one of the strongest hallucination reducers.
- **Citation format** tied to the chunk IDs.
- Documents first, question last.

## Step 7: Generate, with citations

Send the prompt to the LLM. Then, in code, **check the citations**: every ID the model cites should be one of the IDs you actually sent. Map IDs back to file names and pages to show clickable sources in the UI.

Some APIs also have built-in citation features. For example, the Anthropic API can take documents as special content blocks with citations enabled and returns, for each part of the answer, the exact quoted text and its location in the source. This is more reliable than asking for `[id]` markers in plain text; consider it for production.

## A complete minimal RAG in plain Python

This is a full, working RAG over a folder of PDFs: `pypdf` to load, the chunker above, `sentence-transformers` for embeddings, Chroma for storage, and Claude for the answer. About 90 lines, no framework.

```bash
pip install pypdf sentence-transformers chromadb anthropic
```

```python
# rag.py
import re
from pathlib import Path

import anthropic
import chromadb
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer

EMBED_MODEL = SentenceTransformer("all-MiniLM-L6-v2")   # use a multilingual model for Indian languages
LLM = anthropic.Anthropic()
db = chromadb.PersistentClient(path="./rag_db")
col = db.get_or_create_collection("docs", configuration={"hnsw": {"space": "cosine"}})


def chunk_text(text: str, max_words: int = 350, overlap_words: int = 50) -> list[str]:
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    chunks, current = [], []
    for sent in sentences:
        words = sent.split()
        if current and len(current) + len(words) > max_words:
            chunks.append(" ".join(current))
            current = current[-overlap_words:]
        current.extend(words)
    if current:
        chunks.append(" ".join(current))
    return chunks


def embed(texts: list[str]) -> list[list[float]]:
    return EMBED_MODEL.encode(texts, normalize_embeddings=True, batch_size=64).tolist()


# ---------- indexing (run when documents change) ----------
def index_folder(folder: str) -> None:
    for pdf in Path(folder).glob("*.pdf"):
        reader = PdfReader(pdf)
        ids, docs, metas = [], [], []
        for page_no, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            for c_no, chunk in enumerate(chunk_text(text)):
                ids.append(f"{pdf.name}:p{page_no}:c{c_no}")       # stable id
                docs.append(chunk)
                metas.append({"source": pdf.name, "page": page_no})
        if ids:
            col.upsert(ids=ids, documents=docs, embeddings=embed(docs), metadatas=metas)
            print(f"indexed {pdf.name}: {len(ids)} chunks")


# ---------- querying (run for every question) ----------
SYSTEM = (
    "You answer questions using ONLY the provided documents. "
    "If the documents do not contain the answer, reply exactly: "
    "\"I couldn't find this in the documents.\" "
    "Cite the document id in square brackets after each fact, like [file.pdf:p3:c0]. "
    "Be concise."
)


def retrieve(question: str, k: int = 5) -> list[dict]:
    res = col.query(query_embeddings=embed([question]), n_results=k)
    return [
        {"id": i, "text": d, "meta": m, "score": 1 - dist}       # cosine similarity
        for i, d, m, dist in zip(res["ids"][0], res["documents"][0],
                                 res["metadatas"][0], res["distances"][0])
    ]


def answer(question: str) -> dict:
    hits = retrieve(question)
    context = "\n".join(f'<document id="{h["id"]}">\n{h["text"]}\n</document>' for h in hits)
    resp = LLM.messages.create(
        model="claude-sonnet-5-5",
        max_tokens=1024,
        system=SYSTEM,
        messages=[{"role": "user",
                   "content": f"<documents>\n{context}\n</documents>\n\n<question>{question}</question>"}],
    )
    text = "".join(b.text for b in resp.content if b.type == "text")

    sent_ids = {h["id"] for h in hits}
    cited = set(re.findall(r"\[([^\[\]]+?)\]", text))
    valid = [c for c in cited if c in sent_ids]                     # ignore made-up ids
    sources = sorted({(h["meta"]["source"], h["meta"]["page"]) for h in hits if h["id"] in valid})
    return {"answer": text, "sources": sources, "invalid_citations": sorted(cited - sent_ids)}


if __name__ == "__main__":
    index_folder("./pdfs")
    result = answer("How many leave days can be carried forward?")
    print(result["answer"])
    print("Sources:", result["sources"])
```

An example run (your text will differ):

```text
indexed hr_policy.pdf: 41 chunks
indexed travel_policy.pdf: 12 chunks
Up to 10 unused leave days can be carried forward to the next calendar year
[hr_policy.pdf:p5:c1]. Days above this limit lapse on 31 December unless HR
approves an exception [hr_policy.pdf:p5:c1].
Sources: [('hr_policy.pdf', 5)]
```

What each part teaches:

- `upsert` with stable IDs: re-running indexing doesn't create duplicates.
- The **same** `embed` function for chunks and questions.
- `1 - distance`: Chroma returns cosine **distance**; convert to similarity for logging and thresholds.
- The citation check: the app trusts only IDs it actually sent.

This is the core of the portfolio project [RAG PDF Chatbot](/interview/ai-projects/project-rag-pdf-chatbot), which adds a FastAPI backend, a UI and an evaluation set.

> **Interview tip:** When asked to "walk me through a RAG system", go step by step through the seven stages and name one design decision at each: loader and cleaning, chunk size and overlap, embedding model, vector DB and filters, top-k, the grounding prompt with citations, and the LLM. Finish with how you evaluate it. That structure alone puts you ahead of most candidates.

## Evaluating a RAG system (the basics)

A RAG answer can fail in two places, so measure both:

| Part | Question | Example metrics |
|---|---|---|
| Retrieval | Did we fetch the chunks that contain the answer? | recall@k, MRR, context precision/recall |
| Generation | Is the answer correct, supported by the chunks, and relevant? | faithfulness (groundedness), answer relevance, correctness |

Build a small **golden set**: 30–100 real questions, each with the expected answer and the source page. Run it after every change (chunk size, model, prompt). Tools like RAGAS automate parts of this. Details are in [Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps).

When an answer is wrong, first check **retrieval**: print the retrieved chunks. If the right chunk isn't there, no prompt can save the answer. Most RAG bugs are retrieval bugs.

## Common beginner mistakes

| Mistake | Effect | Fix |
|---|---|---|
| Not reading the extracted text | broken tables, mixed columns, repeated footers in every chunk | inspect and clean; use better loaders or OCR |
| Chunks too big (whole pages of mixed topics) | blurry vectors, poor retrieval | 400–600 token chunks; structure-aware splitting |
| Chunks too small, no overlap | facts split across chunks, "it" without context | add overlap; parent-child chunks |
| Different embedding models for docs and queries | random-looking results | one model, re-embed on change |
| No metadata | can't cite, can't filter by permission | store source, page, section, access group |
| No "I don't know" path | confident hallucinations on unanswerable questions | explicit abstain sentence in the prompt |
| Trusting the model's citations | fake or wrong references | validate cited IDs against the retrieved set |
| Only vector search | misses exact codes and names | hybrid search ([Advanced RAG](/interview/llms-genai/advanced-rag)) |
| No evaluation set | "it seems fine" until users complain | golden set, measured on every change |

## Key terms

| Term | Simple meaning |
|---|---|
| RAG | Retrieval-augmented generation: retrieve relevant text, then generate an answer from it |
| Grounding | Making the model base its answer on given sources |
| Indexing | The offline steps that prepare documents for search |
| Loader | Code that turns files into text and metadata |
| OCR | Optical character recognition: reading text from images |
| Chunk | A small piece of a document stored and retrieved as one unit |
| Chunk overlap | Text shared between neighbouring chunks |
| Stride | How far each new chunk starts after the previous one |
| Recursive splitting | Splitting by paragraphs, then lines, then sentences until small enough |
| Semantic chunking | Splitting where the topic changes, using embeddings |
| Parent-child chunks | Search small chunks, send the larger parent to the LLM |
| Stable ID | A chunk ID that stays the same when re-indexing |
| top-k | The number of chunks retrieved per question |
| Augmentation | Adding retrieved chunks to the prompt |
| Abstain | Saying "I don't know" when sources don't contain the answer |
| Citation | A reference from an answer sentence to its source chunk |
| Golden set | A fixed list of test questions with expected answers and sources |
| Faithfulness | Whether the answer is supported by the retrieved context |

## Interview questions

**What is RAG and why use it instead of just asking the LLM?**
RAG retrieves passages relevant to the question from your own data and puts them in the prompt so the LLM answers from them. It gives the model private and up-to-date knowledge without retraining, reduces hallucination by grounding answers in sources, and allows citations so users can verify. Updating knowledge is just re-indexing documents.

**Walk me through the RAG pipeline.**
Offline: load documents into text with metadata, split them into chunks, embed each chunk, and store vectors with text and metadata in a vector database. Online: embed the user's question with the same model, retrieve the top-k similar chunks with any permission filters, build a prompt with those chunks and grounding instructions, and have the LLM generate an answer with citations. Then validate citations and log everything for evaluation.

**How do you choose chunk size and overlap?**
I start around 400–600 tokens with 10–15% overlap, split on document structure like headings and paragraphs where possible, then tune using a golden question set measuring retrieval recall and answer quality. Smaller chunks give precise matches but lose context; larger chunks keep context but blur the embedding and use more prompt tokens. The best value depends on the documents and the kind of questions.

**What is chunk overlap and why is it needed?**
Overlap means the end of one chunk is repeated at the start of the next. Without it, a sentence or fact cut at a boundary might not be fully present in any chunk, so it could never be retrieved whole. Too much overlap wastes storage and returns near-duplicate chunks.

**RAG or fine-tuning for a company knowledge bot?**
RAG, because the need is knowledge that changes and must be cited, and RAG updates by re-indexing and supports access control per document. Fine-tuning changes behaviour like tone or output format and is poor at reliably adding facts; it also can't cite sources. They can be combined: fine-tune for format, RAG for facts.

**How do you make the model cite its sources, and how do you trust the citations?**
Label each retrieved chunk with an ID in the prompt and instruct the model to cite IDs after each fact, or use an API's built-in citation feature. In code, check that every cited ID was actually in the retrieved set and map IDs to file and page for display. Faithfulness evaluation then checks that cited chunks really support the claims.

**The RAG bot gives a wrong answer. How do you debug it?**
First look at the retrieved chunks for that question. If the right information isn't there, it's a retrieval problem: check text extraction, chunking, embedding model, filters, k, or add hybrid search and reranking. If the right chunk is there but the answer is wrong, it's a generation problem: improve the prompt, reduce noisy chunks, or use a stronger model. Then add the case to the golden set.

**How do you handle questions whose answer isn't in the documents?**
Explicitly tell the model what to say when the documents don't contain the answer, and test this with unanswerable questions in the evaluation set. You can also use a similarity threshold to detect when retrieval found nothing relevant and skip the LLM call or route to a human. Measuring the abstention rate is part of evaluation.

**How would you handle access control in RAG?**
Store each chunk's permission information, like department or user groups, as metadata during indexing, copied from the source system. At query time, apply a filter for the current user's groups inside the vector search, so restricted chunks never reach the prompt. For strict isolation, keep separate collections per tenant.

**Why are tables and scanned PDFs hard for RAG?**
Text extraction can flatten tables so numbers lose their row and column meaning, and scanned pages need OCR, which can misread digits and names. The embedding of a broken table doesn't match questions well, and the LLM may misread it. Fixes include table-aware parsers, converting tables to Markdown or row-wise sentences, vision models for parsing, and checking extraction quality manually.

## Try it yourself

1. **Chunk math.** A 300-page book has about 400 words per page. With 1 token ≈ 0.75 words, chunk size 400 tokens and overlap 40, how many chunks do you get?
2. **Build it.** Run the minimal RAG on two or three of your own PDFs (college notes, a policy, a manual). Ask 10 questions, including 2 whose answers are not in the PDFs. Did it abstain correctly?
3. **Tune chunk size.** Re-index with `max_words` = 150, 350 and 700. For 10 questions where you know the correct page, record whether the right page is in the top 5. Which size wins?
4. **Show sources.** Change `answer()` to also return the first 100 characters of each cited chunk, so a UI can show a preview under the answer.

### Answers

1. Words = 300 × 400 = 120,000 → tokens ≈ 160,000. Stride = 360. Chunks = ⌈(160,000 − 400) ÷ 360⌉ + 1 = ⌈443.3⌉ + 1 = 444 + 1 = 445.
2. If it didn't abstain, make the abstain instruction more explicit, and check whether retrieved chunks were only loosely related; a similarity threshold can help.
3. There is no universal answer; typically the middle size wins for prose, and very small chunks lose context. The skill is running the comparison, not the specific number.
4. Add, inside `answer()`:

```python
previews = {h["id"]: h["text"][:100] for h in hits if h["id"] in valid}
return {"answer": text, "sources": sources, "previews": previews,
        "invalid_citations": sorted(cited - sent_ids)}
```

**Next:** [Advanced RAG](/interview/llms-genai/advanced-rag)
