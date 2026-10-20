---
title: Tokenization
part: Text Basics
summary: How text is split into tokens — word, character and subword methods — with BPE merges done by hand, WordPiece, SentencePiece, special tokens, and why token count decides LLM cost and limits.
---

Every language model reads and writes **tokens**, not letters or words. The piece of software that splits text into tokens is the **tokenizer**. As an AI engineer you meet tokenizers every day: API bills are per token, context windows are measured in tokens, and many strange model bugs (bad at counting letters, weak at Hindi, odd spacing) come from tokenization.

> **In simple words:** A tokenizer cuts text into small pieces from a fixed list (the vocabulary) and gives each piece a number. Common words stay whole; rare words are cut into smaller known pieces. The model only ever sees these numbers.

## Why we need tokenization

A neural network needs a fixed list of possible inputs, each with an ID number. Each ID points to a row in an **embedding table** (a big matrix with one vector per token — see [Word Embeddings](/interview/ai-engineer/nlp-transformers/word-embeddings)). So we must decide: what are the units?

<figure>
<svg viewBox="0 0 440 150" width="440" height="150" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="10" y="50" width="90" height="40" rx="8" />
<text x="55" y="74" text-anchor="middle" fill="currentColor" stroke="none">"I love chai"</text>
<line x1="100" y1="70" x2="125" y2="70" /><polygon points="125,65 133,70 125,75" fill="currentColor" />
<rect x="133" y="50" width="95" height="40" rx="8" stroke="var(--accent)" />
<text x="180" y="68" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">tokenizer</text>
<text x="180" y="83" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">I · love · ch · ai</text>
<line x1="228" y1="70" x2="253" y2="70" /><polygon points="253,65 261,70 253,75" fill="currentColor" />
<rect x="261" y="50" width="70" height="40" rx="8" />
<text x="296" y="68" text-anchor="middle" fill="currentColor" stroke="none">IDs</text>
<text x="296" y="83" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">[40, 1842, …]</text>
<line x1="331" y1="70" x2="350" y2="70" /><polygon points="350,65 358,70 350,75" fill="currentColor" />
<rect x="358" y="50" width="75" height="40" rx="8" />
<text x="395" y="68" text-anchor="middle" fill="currentColor" stroke="none">embedding</text>
<text x="395" y="83" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">row lookup</text>
<text x="220" y="125" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">the model never sees letters, only token IDs (IDs here are illustrative)</text>
</svg>
<figcaption>Text becomes tokens, tokens become ID numbers, and each ID selects one row of the embedding table.</figcaption>
</figure>

There are three main choices.

### Word-level tokenization

Split on spaces and punctuation. "I love chai" → `["I", "love", "chai"]`.

- Simple and easy to read.
- **Problem 1: huge vocabulary.** English has hundreds of thousands of word forms: play, plays, played, playing, player… Hindi, Tamil and German have even more forms.
- **Problem 2: out-of-vocabulary (OOV) words.** A word not seen in training ("Zomato-ed", a new product name, a typo like "delivry") has no ID. It becomes a special unknown token `[UNK]`, and its meaning is lost.

### Character-level tokenization

Each character is a token. "chai" → `["c", "h", "a", "i"]`.

- Tiny vocabulary (maybe 100–300 symbols) and no OOV problem.
- **Problem: sequences become very long.** A 1,000-word essay becomes about 5,000+ tokens. Attention cost grows with the square of length (chapter 5), so this is slow. Also, single letters carry little meaning, so the model must work harder.

### Subword tokenization (what modern models use)

Keep frequent words whole, and split rare words into frequent pieces.

"unhappiness" → `["un", "happiness"]` or `["un", "happ", "iness"]`.

- Medium vocabulary (about 30,000 to 260,000 tokens in today's models).
- Almost no OOV: any word can be built from smaller pieces, down to single characters or bytes.
- Pieces like "un", "ing", "ly" carry meaning that is shared across many words.

| Method | Vocabulary size | Sequence length | Unknown words | Used by |
|---|---|---|---|---|
| Word | Very large (100k–1M) | Short | Common problem → `[UNK]` | Old models, Word2Vec |
| Character | Very small (~100s) | Very long | None | Some research models |
| Subword (BPE, WordPiece, Unigram) | Medium (30k–260k) | Medium | Very rare | BERT, GPT, Llama, T5, Claude |

> **Interview tip:** If asked "why subword tokenization?", give the trade-off in one line: "It balances vocabulary size against sequence length, and it removes the out-of-vocabulary problem because any word can be built from smaller pieces."

## Byte Pair Encoding (BPE)

**Byte Pair Encoding (BPE)** is the most common subword method. GPT-2, GPT-4, Llama 3 and many others use a form of it.

The idea is simple: start with single characters, then repeatedly **glue together the pair of neighbouring symbols that appears most often**. Each glue step is called a **merge**. Stop when the vocabulary reaches the size you want.

Training BPE:

1. Split every word in the training text into characters.
2. Count every pair of neighbouring symbols, weighted by how often the word appears.
3. Merge the most frequent pair into one new symbol. Add it to the vocabulary and remember the merge rule.
4. Repeat steps 2–3 until the vocabulary is big enough.

### BPE merges by hand

Our tiny training corpus has 5 words with these counts:

| Word | Count |
|---|---|
| hug | 10 |
| pug | 5 |
| pun | 12 |
| bun | 4 |
| hugs | 5 |

Starting vocabulary (all characters): `b, g, h, n, p, s, u`.

Split into characters:

```text
h u g   ×10
p u g   ×5
p u n   ×12
b u n   ×4
h u g s ×5
```

**Merge 1 — count every neighbouring pair:**

| Pair | Comes from | Count |
|---|---|---|
| u g | hug (10) + pug (5) + hugs (5) | **20** |
| p u | pug (5) + pun (12) | 17 |
| u n | pun (12) + bun (4) | 16 |
| h u | hug (10) + hugs (5) | 15 |
| g s | hugs (5) | 5 |
| b u | bun (4) | 4 |

Winner: **u + g → "ug"** (20). New vocabulary: `b, g, h, n, p, s, u, ug`.

```text
h ug    ×10
p ug    ×5
p u n   ×12
b u n   ×4
h ug s  ×5
```

**Merge 2 — count again:**

| Pair | Count |
|---|---|
| u n | 12 + 4 = **16** |
| h ug | 10 + 5 = 15 |
| p u | 12 (only "pun" now; "pug" became "p ug") |
| p ug | 5 |
| ug s | 5 |
| b u | 4 |

Winner: **u + n → "un"** (16).

```text
h ug    ×10
p ug    ×5
p un    ×12
b un    ×4
h ug s  ×5
```

**Merge 3:** pairs are h ug = 15, p un = 12, p ug = 5, ug s = 5, b un = 4. Winner: **h + ug → "hug"** (15).

**Merge 4:** pairs are p un = 12, p ug = 5, hug s = 5, b un = 4. Winner: **p + un → "pun"** (12).

After 4 merges:

```text
hug     ×10
p ug    ×5
pun     ×12
b un    ×4
hug s   ×5
```

Learned merge rules, in order: `(u, g)`, `(u, n)`, `(h, ug)`, `(p, un)`.
Final vocabulary: `b, g, h, n, p, s, u, ug, un, hug, pun` (7 characters + 4 merges = 11 tokens).

### Tokenizing a new word

To tokenize new text, split into characters and **apply the merges in the same order** they were learned.

- "hugs" → `h u g s` → (u,g) → `h ug s` → (h,ug) → `hug s` → **["hug", "s"]**
- "bug" → `b u g` → (u,g) → **["b", "ug"]** — a word never seen in training, built from known pieces.
- "mug" → `m u g` → **["m", "ug"]**, but "m" is not in our vocabulary! A character-level BPE would have to output `[UNK]` for "m".

This last case is why GPT-2 and later models use **byte-level BPE**: the starting vocabulary is the 256 possible **bytes**, not characters. Every piece of text — Hindi, emoji, Chinese, code — is a sequence of UTF-8 bytes, so nothing is ever unknown.

### BPE in Python

This tiny implementation reproduces the merges above.

```python
from collections import Counter

def get_pair_counts(corpus):
    counts = Counter()
    for word, freq in corpus.items():
        for a, b in zip(word, word[1:]):      # neighbouring symbols
            counts[(a, b)] += freq
    return counts

def merge(corpus, pair):
    new_corpus = {}
    for word, freq in corpus.items():
        out, i = [], 0
        while i < len(word):
            if i < len(word) - 1 and (word[i], word[i + 1]) == pair:
                out.append(word[i] + word[i + 1])   # glue the pair
                i += 2
            else:
                out.append(word[i])
                i += 1
        new_corpus[tuple(out)] = freq
    return new_corpus

word_freqs = {"hug": 10, "pug": 5, "pun": 12, "bun": 4, "hugs": 5}
corpus = {tuple(w): f for w, f in word_freqs.items()}   # start from characters
merges = []
for step in range(4):
    pairs = get_pair_counts(corpus)
    best = max(pairs, key=pairs.get)          # most frequent pair
    corpus = merge(corpus, best)
    merges.append(best)
    print(step + 1, best, pairs[best])
```

```text
1 ('u', 'g') 20
2 ('u', 'n') 16
3 ('h', 'ug') 15
4 ('p', 'un') 12
```

> **Common mistake:** Thinking BPE picks the longest matching piece at tokenization time. Classic BPE replays the merge rules **in training order**. (WordPiece, below, does use longest-match at inference.)

## WordPiece

**WordPiece** is the tokenizer of BERT. It is very similar to BPE, with two differences:

1. **How it picks a merge.** BPE merges the most frequent pair. WordPiece merges the pair with the highest score = count(pair) ÷ (count(first) × count(second)). This prefers pairs whose parts rarely appear apart — pairs that "belong together".
2. **The `##` prefix.** A piece that continues a word (not at the start) is written with `##`. "tokenization" → `["token", "##ization"]`. The `##` tells you there was no space before it.

At tokenization time, WordPiece takes the **longest piece from the vocabulary** that matches the start of the word, then repeats on the rest.

## SentencePiece and Unigram

Word-level and BPE tokenizers usually first split on spaces. That fails for languages like Chinese and Japanese that do not use spaces, and it loses exact spacing information.

**SentencePiece** is a library (by Google) that treats the input as a raw stream of characters, **including the space**. It replaces the space with a visible symbol `▁` (a low line). "I love chai" → `["▁I", "▁love", "▁ch", "ai"]`. Because spaces are inside tokens, you can turn tokens back into the exact original text.

SentencePiece can train either BPE or the **Unigram** method. **Unigram** works the other way round from BPE: it starts with a very large vocabulary and **removes** the pieces that hurt a language-model score the least, until it reaches the target size. T5, ALBERT and XLNet use Unigram via SentencePiece. Llama 1 and 2 used SentencePiece BPE; Llama 3 moved to a tiktoken-style byte-level BPE with about 128,000 tokens.

| Tokenizer | Builds vocabulary by | Marks word pieces by | Used by (examples) |
|---|---|---|---|
| BPE (byte-level) | Merging most frequent pairs | `Ġ` = space before (GPT-2 style) | GPT-2, GPT-4 family, Llama 3, Qwen |
| WordPiece | Merging highest-score pairs | `##` = continues a word | BERT, DistilBERT |
| Unigram (SentencePiece) | Pruning a big vocabulary | `▁` = space before | T5, ALBERT, XLNet |
| SentencePiece BPE | Merging pairs, spaces as `▁` | `▁` | Llama 1/2, Mistral, Gemma |

## Special tokens

Besides normal text pieces, every tokenizer has **special tokens** — reserved tokens with a job.

| Token | Meaning | Model family |
|---|---|---|
| `[CLS]` | "Classification" token at the start; its final vector summarizes the sentence | BERT |
| `[SEP]` | Separator between two sentences and at the end | BERT |
| `[PAD]` | Filler to make all sequences in a batch the same length | BERT and others |
| `[MASK]` | Hidden word the model must guess during pretraining | BERT |
| `[UNK]` | Unknown piece (rare with subwords) | BERT |
| `<s>`, `</s>` | Start and end of sequence | Llama, RoBERTa, T5 (`</s>`) |
| `<\|endoftext\|>` | End of a document | GPT-2 |
| Chat tokens like `<\|im_start\|>` | Mark where a system/user/assistant turn starts | Chat models (varies by model) |

A BERT input for a sentence pair looks like:

```text
[CLS] my upi payment failed [SEP] what should i do [SEP] [PAD] [PAD]
```

Along with the token IDs, the tokenizer returns an **attention mask**: 1 for real tokens and 0 for padding, so the model ignores the `[PAD]` positions.

### Tokenizers in Hugging Face

```python
from transformers import AutoTokenizer

bert = AutoTokenizer.from_pretrained("bert-base-uncased")    # WordPiece
print(bert.tokenize("Tokenization is fun"))
# Output: ['token', '##ization', 'is', 'fun']

enc = bert("Tokenization is fun")
print(enc["input_ids"])        # starts with 101 ([CLS]) and ends with 102 ([SEP])
print(enc["attention_mask"])   # all 1s, no padding here

gpt2 = AutoTokenizer.from_pretrained("gpt2")                 # byte-level BPE
print(gpt2.tokenize("Hello world"))
# Output: ['Hello', 'Ġworld']    (Ġ means "there was a space before")

batch = bert(["short", "a much longer sentence"], padding=True, return_tensors="pt")
print(batch["attention_mask"])  # 0s mark the [PAD] positions of the short sentence
```

> **Remember:** Always use the tokenizer that was trained with the model. A model's embedding table row 2023 means something only for its own tokenizer. Mixing tokenizers gives garbage.

## Why token count matters

### Cost and limits

LLM APIs charge **per token**, separately for **input tokens** (your prompt) and **output tokens** (the reply). Output tokens usually cost several times more than input tokens. The **context window** — the maximum tokens a model can handle in one request (prompt + reply) — is also measured in tokens.

Rough rules for English with modern tokenizers:

- 1 token ≈ 4 characters ≈ ¾ of a word.
- 100 tokens ≈ 75 words.
- 1 page of text (~500 words) ≈ 650–700 tokens.

These are rules of thumb only. Code, numbers, and non-English text usually need **more** tokens per word.

### Worked cost example

Your support bot gets 2,000 chats per day. Each chat sends a 1,200-token prompt (instructions + retrieved documents + question) and gets a 300-token answer. Suppose (only for this example) the price is $3 per million input tokens and $15 per million output tokens. Check the provider's page for real current prices.

- Input tokens per day: 2,000 × 1,200 = 2,400,000 = 2.4 M → 2.4 × $3 = **$7.20**
- Output tokens per day: 2,000 × 300 = 600,000 = 0.6 M → 0.6 × $15 = **$9.00**
- Total ≈ **$16.20 per day** ≈ $486 per 30-day month.

If you cut the prompt from 1,200 to 800 tokens (shorter instructions, fewer retrieved chunks), input cost drops by one third. This is why engineers watch token counts closely. See [Using LLM APIs](/interview/ai-engineer/llms-genai/using-llm-apis) for counting tokens with the SDKs.

### Indian languages and fairness

Tokenizers are trained mostly on English text. Words in Hindi, Tamil, Bengali and other languages are split into many more pieces — sometimes several times more tokens for the same meaning. This means the same message costs more, uses more context window, and can be answered worse. Newer tokenizers with larger vocabularies (100k–260k tokens) reduce this gap.

### Strange behaviours caused by tokens

- **Counting letters:** "How many r's in strawberry?" is hard because the model sees pieces like `["str", "aw", "berry"]`, not letters.
- **Arithmetic:** numbers like "12345" may be split into odd chunks such as "123" + "45".
- **Spaces matter:** "hello" and " hello" are often different tokens.

> **Interview tip:** If asked "why are LLMs bad at spelling or counting characters?", the expected answer is tokenization: the model never sees individual characters, only subword tokens.

## Key terms

| Term | Simple meaning |
|---|---|
| Token | One piece of text the model reads, from a fixed vocabulary |
| Tokenizer | Software that splits text into tokens and maps them to IDs |
| Vocabulary | The fixed list of all tokens a model knows |
| Token ID | The number for a token; the row index in the embedding table |
| OOV (out-of-vocabulary) | A word that is not in the vocabulary |
| `[UNK]` | Special token used for unknown pieces |
| Subword tokenization | Splitting rare words into frequent smaller pieces |
| BPE | Builds a vocabulary by repeatedly merging the most frequent pair |
| Merge rule | One learned "glue these two symbols" step in BPE |
| Byte-level BPE | BPE that starts from 256 bytes, so no text is ever unknown |
| WordPiece | BERT's subword method; uses `##` for word continuations |
| Unigram | Subword method that starts big and prunes pieces |
| SentencePiece | Library that tokenizes raw text, treating space as `▁` |
| Special tokens | Reserved tokens like `[CLS]`, `[SEP]`, `[PAD]`, `[MASK]`, `<s>` |
| Attention mask | 1 for real tokens, 0 for padding |
| Context window | Max tokens a model can process in one request |

## Interview questions

**Why do modern models use subword tokenization?**
Word-level vocabularies are huge and still have unknown words. Character-level sequences are very long, which makes attention slow. Subwords keep common words whole and split rare words into known pieces, so the vocabulary stays medium-sized and nothing is unknown.

**Explain how BPE works.**
Start with characters (or bytes) as the vocabulary. Count all neighbouring symbol pairs in the training corpus, weighted by word frequency. Merge the most frequent pair into a new symbol and record the merge. Repeat until the vocabulary reaches the target size. To tokenize new text, apply the recorded merges in the same order.

**What is the difference between BPE and WordPiece?**
Both merge pairs bottom-up. BPE picks the most frequent pair. WordPiece picks the pair with the highest count(pair) ÷ (count(a) × count(b)), which favours pieces that rarely appear separately. WordPiece marks word-continuation pieces with `##` and tokenizes with longest-match-first.

**What is byte-level BPE and why is it useful?**
It starts from the 256 byte values instead of characters. Any text in any language or emoji is a sequence of UTF-8 bytes, so every input can be tokenized and there is no `[UNK]`. GPT-2 introduced it and most modern LLMs use it.

**What is the attention mask in a tokenizer output?**
It is a list of 1s and 0s the same length as the input IDs. 1 means a real token, 0 means padding. The model uses it to ignore padded positions so they do not affect the result.

**What does vocabulary size trade off?**
A bigger vocabulary gives shorter sequences (faster, cheaper, more text fits in context) but a larger embedding table and output layer, and rare tokens get fewer training examples. A smaller vocabulary does the opposite. Modern LLMs pick about 32k–260k.

**Why are LLMs bad at counting letters in a word?**
Because they see subword tokens, not characters. "strawberry" might be 2–3 tokens, and the model has to have memorized how each token is spelled. Tokenization hides the letters.

**Why does the same sentence cost more in Hindi than in English?**
Tokenizers are trained mostly on English, so Hindi words were merged less often and are split into more, smaller pieces. More tokens mean higher cost, more context used and sometimes lower quality.

**Can you use the GPT-2 tokenizer with a BERT model?**
No. Token IDs are just row numbers into the model's embedding table. Each model learned its embeddings for its own tokenizer's IDs. A different tokenizer's IDs point at the wrong rows and the model sees nonsense.

## Try it yourself

1. Continue the BPE example for one more merge (merge 5). Which pair wins and with what count? *Hint: list the pairs from the corpus after merge 4.*
2. Using the 4 learned merges, tokenize "pugs" and "hun". *Hint: apply merges in order.*
3. Estimate tokens and cost: a RAG app sends 3 chunks of 400 tokens each plus a 200-token question and instructions, and gets a 250-token answer, 10,000 times a day. Use $3 / M input and $15 / M output (example prices).
4. Install nothing new: in a Python environment with `transformers`, print `len(tok)` (vocabulary size) for `bert-base-uncased` and `gpt2`, and tokenize your own name with both. *Hint: `AutoTokenizer.from_pretrained`.*

### Answers

1. After merge 4 the corpus is `hug ×10`, `p ug ×5`, `pun ×12`, `b un ×4`, `hug s ×5`. Pairs: p ug = 5, hug s = 5, b un = 4. There is a tie at 5 between (p, ug) and (hug, s). The tie-break rule depends on the implementation (often "first seen"); with the Python code above, `max` returns (p, ug) because it is counted first. So merge 5 = **p + ug → "pug"** with count 5.
2. "pugs": `p u g s` → (u,g) → `p ug s`. No other merge applies → **["p", "ug", "s"]**. "hun": `h u n` → (u,g) does not apply → (u,n) → `h un` → (h,ug) does not apply → **["h", "un"]**.
3. Input per request = 3 × 400 + 200 = 1,400 tokens. Per day: 10,000 × 1,400 = 14 M → 14 × $3 = $42. Output: 10,000 × 250 = 2.5 M → 2.5 × $15 = $37.50. Total ≈ $79.50 per day.
4. `bert-base-uncased` has 30,522 tokens; `gpt2` has 50,257. Your name's split will differ — notice the `##` pieces in BERT and the `Ġ` markers in GPT-2.

**Next:** [Word Embeddings](/interview/ai-engineer/nlp-transformers/word-embeddings)
