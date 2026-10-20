---
title: Hugging Face in Practice
part: Models & Tools
summary: Use the Hugging Face ecosystem the way working engineers do — pipelines for quick results, AutoTokenizer and AutoModel for control, the Model Hub and model cards, the datasets library, sentence embeddings, text generation with chat templates, and inference speed tips.
---

**Hugging Face** is the company and open platform where most open models and datasets live. Its `transformers` library is the standard way to download and run BERT, T5, Llama, Qwen and thousands of other models with a few lines of Python. In an AI engineer job you use it to test open models, build classifiers and embedding services, prepare datasets, and fine-tune (next chapter). This chapter teaches the parts you will use every week.

> **In simple words:** The Hub is a giant library of free models and datasets. `pipeline()` runs a model in one line. `AutoTokenizer` + `AutoModel...` give you full control: text → token IDs → model → numbers → answer.

## The ecosystem

| Part | What it is | You use it to |
|---|---|---|
| **Hub** (huggingface.co) | Website with 1M+ models, datasets and demo apps | Find, download and share models and data |
| `transformers` | Python library for Transformer models | Load and run models, fine-tune with `Trainer` |
| `datasets` | Library for loading and processing datasets | Load data from the Hub, CSV or JSON; map, filter, split |
| `tokenizers` | Fast Rust tokenizers (used inside `transformers`) | Train or use BPE/WordPiece tokenizers |
| `accelerate` | Multi-GPU and mixed-precision helper | Run the same code on CPU, 1 GPU or many |
| `peft` | Parameter-efficient fine-tuning | LoRA / QLoRA (see [Fine-tuning, LoRA and QLoRA](/interview/ai-engineer/llms-genai/fine-tuning-lora-and-qlora)) |
| `evaluate` | Metrics library | Accuracy, F1, BLEU, ROUGE |
| `huggingface_hub` + `hf` CLI | Client for the Hub | Log in, download, upload |
| **Spaces** | Hosted demo apps (Gradio / Streamlit) | Show a demo of your project |

Install (PyTorch backend):

```bash
pip install "transformers[torch]" datasets evaluate accelerate
```

> **Remember:** The code here uses current APIs (transformers 4.4x and the 5.x line). The library moves fast and a few argument names change between versions (for example `evaluation_strategy` → `eval_strategy`, `torch_dtype` → `dtype`). If an argument fails, check the docs for your installed version with `pip show transformers`.

## Pipelines: one line to a result

A **pipeline** wraps the three steps — tokenize, run the model, post-process the output — behind one function call. Always pass `model=` explicitly; otherwise the library picks a default model and prints a warning, and the default can change between versions.

### Sentiment analysis

```python
from transformers import pipeline

clf = pipeline("sentiment-analysis",
               model="distilbert-base-uncased-finetuned-sst-2-english")

print(clf("The delivery was fast and the phone works perfectly."))
# Output: [{'label': 'POSITIVE', 'score': 0.99...}]

print(clf(["Worst purchase ever.", "Okay product for the price."]))  # a list = a batch
# Output: [{'label': 'NEGATIVE', 'score': 0.99...}, {'label': ..., 'score': ...}]
```

### Zero-shot classification

**Zero-shot classification** sorts text into labels **you choose at run time**, with no training. It uses a model trained on natural language inference (does sentence A imply sentence B?) and asks "Does this text imply 'This example is about {label}'?"

```python
zs = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
result = zs("My UPI payment failed but money was debited from my account.",
            candidate_labels=["payments", "delivery", "account login", "refund"])
print(result["labels"][0], round(result["scores"][0], 2))
# "payments" (or "refund") should come first
```

Good for quick prototypes and when you have no labeled data. Slower and less accurate than a fine-tuned classifier.

### Named entity recognition

```python
ner = pipeline("ner", model="dslim/bert-base-NER", aggregation_strategy="simple")
for ent in ner("Sundar Pichai visited Bengaluru to meet engineers from Infosys."):
    print(ent["entity_group"], ent["word"], round(float(ent["score"]), 2))
# PER Sundar Pichai ...
# LOC Bengaluru ...
# ORG Infosys ...
```

`aggregation_strategy="simple"` joins word pieces ("Ben", "##gal", "##uru") back into whole entities.

### Question answering (extractive)

```python
qa = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")
context = "The Rajdhani Express to Delhi leaves Patna at 7:40 pm from platform 1."
print(qa(question="When does the train leave?", context=context))
# Output: {'score': ..., 'start': ..., 'end': ..., 'answer': '7:40 pm'}
```

This model **extracts** a span from the context; it cannot write new sentences.

### Summarization, translation and generation

```python
summ = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
print(summ(long_article_text, max_length=60, min_length=20)[0]["summary_text"])

translate = pipeline("translation", model="Helsinki-NLP/opus-mt-en-hi")
print(translate("Where is the railway station?")[0]["translation_text"])

chat = pipeline("text-generation", model="Qwen/Qwen2.5-0.5B-Instruct")
messages = [{"role": "user", "content": "Explain TF-IDF in two sentences."}]
out = chat(messages, max_new_tokens=80)
print(out[0]["generated_text"][-1]["content"])   # the assistant's reply
```

`long_article_text` is any long string you provide. The chat pipeline accepts a list of messages, applies the model's chat template, and returns the conversation with the new assistant message at the end.

### Common pipeline tasks

| Task name | Input → output | Example model |
|---|---|---|
| `sentiment-analysis` / `text-classification` | text → label + score | distilbert-base-uncased-finetuned-sst-2-english |
| `zero-shot-classification` | text + your labels → ranked labels | facebook/bart-large-mnli |
| `ner` / `token-classification` | text → entities | dslim/bert-base-NER |
| `question-answering` | question + context → span | distilbert-base-cased-distilled-squad |
| `fill-mask` | text with `[MASK]` → guesses | bert-base-uncased |
| `summarization` | long text → short text | sshleifer/distilbart-cnn-12-6 |
| `translation` | text → text in another language | Helsinki-NLP/opus-mt-en-hi |
| `text-generation` | prompt or messages → continuation | Qwen/Qwen2.5-0.5B-Instruct |
| `feature-extraction` | text → hidden-state vectors | any encoder |
| `automatic-speech-recognition` | audio → text | openai/whisper-small |

Use `device=0` for the first GPU, or `device_map="auto"` (needs `accelerate`) to place large models automatically.

## Under the hood: tokenizer + model

Pipelines are great for demos. For real services you need control over batching, truncation and outputs. Here is the sentiment pipeline done by hand.

```python
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

name = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(name)      # downloads tokenizer files
model = AutoModelForSequenceClassification.from_pretrained(name)
model.eval()                                          # inference mode (no dropout)

texts = ["The delivery was fast.", "The box arrived broken and support never replied."]
batch = tokenizer(texts, padding=True, truncation=True, max_length=128,
                  return_tensors="pt")              # PyTorch tensors
print(batch["input_ids"].shape)                       # (2, longest_length)

with torch.no_grad():                                 # no gradients = faster, less memory
    logits = model(**batch).logits                    # (2, 2): one score per class

probs = torch.softmax(logits, dim=-1)
for text, p in zip(texts, probs):
    label_id = int(p.argmax())
    print(model.config.id2label[label_id], round(float(p[label_id]), 3), "|", text)
```

The steps:

1. **Tokenize:** `padding=True` pads to the longest text in the batch, `truncation=True` cuts texts longer than `max_length`, and `return_tensors="pt"` returns PyTorch tensors. The result holds `input_ids` and `attention_mask`.
2. **Forward pass:** `model(**batch)` passes both tensors. The output has `.logits` — raw scores before softmax.
3. **Post-process:** softmax → probabilities; `model.config.id2label` maps class index → name.

### The Auto classes

`AutoTokenizer` and the `AutoModel...` classes read the model's `config.json` from the Hub and build the right architecture for you. You choose the **head** — the final layer for a task — by choosing the class.

| Class | Head on top | Output | Use for |
|---|---|---|---|
| `AutoModel` | None | `last_hidden_state` (batch, tokens, hidden) | Embeddings, custom heads |
| `AutoModelForSequenceClassification` | Linear on `[CLS]`/pooled vector | `logits` (batch, num_labels) | Sentiment, intent, spam |
| `AutoModelForTokenClassification` | Linear on every token | `logits` (batch, tokens, num_labels) | NER, POS tagging |
| `AutoModelForQuestionAnswering` | Start/end scores per token | `start_logits`, `end_logits` | Extractive QA |
| `AutoModelForMaskedLM` | Vocab scores per token | `logits` (batch, tokens, vocab) | Fill-mask, MLM training |
| `AutoModelForCausalLM` | Next-token vocab scores | `logits` (batch, tokens, vocab) | GPT/Llama-style generation |
| `AutoModelForSeq2SeqLM` | Decoder vocab scores | `logits` | T5, BART, translation, summarization |

> **Common mistake:** Loading a plain base model like `bert-base-uncased` into `AutoModelForSequenceClassification` and using its predictions directly. The library prints "Some weights ... were newly initialized". That means the classification head is **random** — you must fine-tune it first (next chapter).

### Getting sentence embeddings with AutoModel

`AutoModel` returns one vector per token. To get one vector per sentence, a common method is **mean pooling**: average the token vectors, ignoring padding.

```python
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModel

name = "sentence-transformers/all-MiniLM-L6-v2"     # small embedding model, 384 dims
tok = AutoTokenizer.from_pretrained(name)
enc_model = AutoModel.from_pretrained(name)

def embed(texts):
    batch = tok(texts, padding=True, truncation=True, return_tensors="pt")
    with torch.no_grad():
        hidden = enc_model(**batch).last_hidden_state          # (B, T, 384)
    mask = batch["attention_mask"].unsqueeze(-1).float()       # (B, T, 1): 1 = real token
    summed = (hidden * mask).sum(dim=1)                        # ignore padding
    mean = summed / mask.sum(dim=1)                            # average over real tokens
    return F.normalize(mean, dim=-1)                           # length 1 → dot = cosine

E = embed(["How do I get a refund?", "I want my money back", "Today's cricket score"])
print(E.shape)          # Output: torch.Size([3, 384])
print(E @ E.T)          # sentences 0 and 1 should be much more similar than 0 and 2
```

In practice the `sentence-transformers` library does this in two lines (`SentenceTransformer(name).encode(texts)`). Knowing the pooling step helps in interviews. See [Embeddings and Semantic Search](/interview/ai-engineer/llms-genai/embeddings-and-semantic-search).

### Text generation with a chat model

```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

name = "Qwen/Qwen2.5-0.5B-Instruct"          # small instruct model; runs on CPU
tok = AutoTokenizer.from_pretrained(name)
lm = AutoModelForCausalLM.from_pretrained(name, dtype="auto")   # older versions: torch_dtype="auto"

messages = [
    {"role": "system", "content": "You are a helpful tutor. Answer briefly."},
    {"role": "user", "content": "What is a KV cache?"},
]
# The chat template turns messages into the exact special-token format this model was trained on
inputs = tok.apply_chat_template(messages, add_generation_prompt=True,
                                 return_dict=True, return_tensors="pt")

with torch.no_grad():
    out = lm.generate(**inputs, max_new_tokens=100,
                      do_sample=True, temperature=0.7, top_p=0.9)

new_tokens = out[0, inputs["input_ids"].shape[1]:]     # drop the prompt part
print(tok.decode(new_tokens, skip_special_tokens=True))
```

Key points:

- **Chat templates** differ for every model family (different special tokens). Always use `apply_chat_template` instead of building the prompt string by hand.
- `generate` returns prompt + new tokens; slice off the prompt before decoding.
- `do_sample=False` gives **greedy** decoding (always the most likely token); `temperature` and `top_p` control randomness. See [Generation Settings and the Context Window](/interview/ai-engineer/llms-genai/generation-settings-and-the-context-window).
- `generate` uses the KV cache automatically.

## The Model Hub

Every model on the Hub has an ID `owner/name` (like `google/flan-t5-small`) and a **model card** — a README that describes the model.

What to check on a model card before using a model:

| Check | Why |
|---|---|
| **Task and head** | Is it a base model or fine-tuned for your task? |
| **Licence** | Apache-2.0 and MIT allow commercial use; some licences restrict it |
| **Languages** | Many models are English-only; check for Hindi or other languages you need |
| **Size** | Parameters → memory (≈ 2 bytes per parameter in fp16) |
| **Context length** | Max tokens (512 for BERT; much more for modern LLMs) |
| **Training data and limits** | Bias and known failure cases |
| **Downloads, likes, last update** | Popular, maintained models are safer |
| **Files** | Prefer `.safetensors` weights |

Practical facts:

- Models download once and are **cached** in `~/.cache/huggingface/hub` (change it with the `HF_HOME` environment variable).
- **Gated models** (like Llama) require accepting the licence on the website and logging in: `hf auth login` (older versions: `huggingface-cli login`), or set the `HF_TOKEN` environment variable.
- **safetensors** is a safe, fast file format for weights. Old `.bin` files use Python pickle, which can run code when loaded — only load them from sources you trust.
- `trust_remote_code=True` runs Python code from the model repository on your machine. Only use it for repositories you trust, and pin a `revision`.
- Pin a version for production: `from_pretrained(name, revision="<commit hash>")`, so an update to the repository does not silently change your model.

> **Interview tip:** If asked how you would pick an open model for a task, mention: task fit (fine-tuned or base), quality on your own small eval set, licence, size versus your GPU memory and latency budget, language support, and context length. Leaderboards are a starting point, not the answer.

## The datasets library

The `datasets` library loads data from the Hub or local files into a fast, memory-mapped table (built on Apache Arrow), so even large datasets do not need to fit in RAM.

```python
from datasets import load_dataset

ds = load_dataset("imdb")                 # movie reviews: 25k train, 25k test
print(ds)
# DatasetDict({
#     train: Dataset({features: ['text', 'label'], num_rows: 25000})
#     test:  Dataset({features: ['text', 'label'], num_rows: 25000})
#     unsupervised: Dataset({features: ['text', 'label'], num_rows: 50000})
# })

print(ds["train"][0]["text"][:80], ds["train"][0]["label"])
print(ds["train"].features["label"].names)    # Output: ['neg', 'pos']
```

Common operations:

```python
small = ds["train"].shuffle(seed=42).select(range(2000))       # quick subset
short = small.filter(lambda ex: len(ex["text"]) < 1000)       # keep short reviews
splits = small.train_test_split(test_size=0.2, seed=42)        # new train/test dict

# Add a column with map; batched=True processes many rows at once (much faster)
def add_length(batch):
    return {"n_chars": [len(t) for t in batch["text"]]}
small = small.map(add_length, batched=True)

df = small.to_pandas()                                          # to Pandas for EDA
```

Loading your own files:

```python
tickets = load_dataset("csv", data_files={"train": "train.csv", "test": "test.csv"})
docs = load_dataset("json", data_files="faq.jsonl", split="train")
big = load_dataset("allenai/c4", "en", split="train", streaming=True)   # stream, no full download
print(next(iter(big))["text"][:100])
```

The most important use of `map` — tokenizing a whole dataset — is in the next chapter.

## Making inference fast

| Technique | What it does | Typical gain |
|---|---|---|
| `torch.no_grad()` / `torch.inference_mode()` | No gradient tracking | Less memory, faster |
| `model.eval()` | Turns off dropout | Correct, deterministic outputs |
| **Batching** | Process many texts per forward pass | Large throughput gain on GPU |
| Sort by length before batching | Less padding wasted | Faster for mixed lengths |
| `truncation=True, max_length=...` | Caps input length | Protects latency and memory |
| GPU + half precision (`dtype=torch.float16` or `bfloat16`) | Faster math, half the memory | Often 2× or more |
| Smaller model (DistilBERT, MiniLM) | Fewer layers | 2–6× faster |
| Quantization (8-bit / 4-bit) | Smaller weights | Fits big models on small GPUs |
| ONNX Runtime / dedicated servers (vLLM, TGI) | Optimized runtimes | Big gains for production serving |

See [Serving Models](/interview/ai-engineer/mlops-deployment/serving-models) for production serving.

### Common errors and fixes

| Error / symptom | Likely cause | Fix |
|---|---|---|
| "Some weights ... newly initialized" | Head not trained for your task | Fine-tune, or pick a model already fine-tuned |
| Token indices sequence length is longer than the max | Text longer than 512 tokens (BERT) | `truncation=True`, or chunk the text |
| CUDA out of memory | Batch or model too big | Smaller batch, fp16, shorter `max_length`, smaller model |
| Gibberish output | Wrong tokenizer for the model | Load tokenizer and model from the same name |
| 401 / gated repo error | Not logged in or licence not accepted | Accept on the website, `hf auth login` |
| Chat model ignores instructions | Prompt built by hand without chat template | Use `apply_chat_template` |
| Results differ every run | Sampling is on | `do_sample=False` or set a seed |

## Key terms

| Term | Simple meaning |
|---|---|
| Hugging Face Hub | Website hosting open models, datasets and demo apps |
| `transformers` | Library to load, run and train Transformer models |
| Pipeline | One-line wrapper: tokenize → model → post-process |
| Zero-shot classification | Classify into labels given at run time, without training |
| Extractive QA | Answer by selecting a span from given text |
| AutoTokenizer | Loads the right tokenizer for a model name |
| AutoModel / AutoModelFor... | Load the right architecture, with or without a task head |
| Head | Final task-specific layer on top of the base model |
| Logits | Raw scores before softmax |
| `id2label` | Map from class index to label name in the model config |
| Mean pooling | Average token vectors (ignoring padding) to get a sentence vector |
| Chat template | Model-specific format for turning messages into tokens |
| Greedy decoding | Always pick the most likely next token |
| Model card | README describing a model's use, data, licence and limits |
| Gated model | Model that needs licence acceptance and login to download |
| safetensors | Safe, fast weights format |
| `trust_remote_code` | Allows running code from a model repo — a security risk |
| `datasets` | Library for loading and processing datasets efficiently |
| `map(batched=True)` | Apply a function to many rows at once |
| Streaming | Read a dataset row by row without downloading it all |

## Interview questions

**What does a Hugging Face pipeline do internally?**
It runs three steps: the tokenizer turns text into input IDs and an attention mask; the model runs a forward pass and returns logits; post-processing turns logits into a readable result, such as softmax and mapping indices to labels. It also handles batching and device placement.

**What is the difference between AutoModel and AutoModelForSequenceClassification?**
`AutoModel` loads only the Transformer body and returns hidden states for every token. `AutoModelForSequenceClassification` adds a classification head that maps the pooled representation to one score per label. If that head was not trained, its outputs are random until you fine-tune.

**What do `padding` and `truncation` do in the tokenizer?**
Padding adds `[PAD]` tokens so all sequences in a batch have the same length, with the attention mask marking them as 0. Truncation cuts sequences longer than `max_length`. Together they make rectangular tensors and control memory and latency.

**How do you get a sentence embedding from a BERT-style model?**
Run the model, take `last_hidden_state`, and pool it — usually mean pooling over real tokens using the attention mask, or the `[CLS]` vector. For good similarity results, use a model trained for embeddings, such as a sentence-transformers model, not raw BERT.

**Why use `apply_chat_template`?**
Every chat model was trained with its own format of special tokens marking system, user and assistant turns. If you build the prompt yourself and get it slightly wrong, quality drops. The template stored with the tokenizer produces exactly the format the model expects.

**What would you check before using a model from the Hub in production?**
The licence, whether it is fine-tuned for my task, its size versus my memory and latency budget, languages, context length, known limitations from the model card, safetensors weights, and avoiding `trust_remote_code` unless trusted. I would test it on my own eval set and pin a revision.

**How do you speed up inference for a BERT classifier?**
Batch requests, sort by length to reduce padding, cap `max_length`, use `inference_mode`, run on a GPU in fp16, or switch to a distilled model. For more, export to ONNX or quantize. Measure throughput and p95 latency before and after.

**Why does the datasets library use Arrow and memory mapping?**
Data lives on disk in a columnar format and is read on demand, so datasets bigger than RAM can be processed. Operations like `map` are cached, so re-running a notebook does not redo work.

**What is zero-shot classification and when would you use it?**
It classifies text into labels you choose at run time without training, using a model trained on natural language inference or an LLM. It is good for prototypes or when there is no labeled data. For high volume and accuracy, a fine-tuned classifier is usually better and cheaper.

## Try it yourself

1. Use the zero-shot pipeline to classify 5 customer messages of your own into ["payments", "delivery", "refund", "other"]. Print the top label for each.
2. Rewrite the manual sentiment example to process a list of 100 texts in batches of 16. *Hint: loop over `range(0, len(texts), 16)`.*
3. Using the `embed` function, find which of 5 FAQ questions is most similar to the query "my parcel has not arrived". *Hint: `E[0] @ E[1:].T` and `argmax`.*
4. Load `imdb`, take 1,000 training examples, and use `map(batched=True)` to add a column `n_words`. Print the average.

### Answers

1. Example:

```python
from transformers import pipeline
zs = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
msgs = ["Money debited but recharge failed", "Where is my order?", "I want my money back",
        "App crashes on login", "Courier marked delivered but nothing came"]
for m in msgs:
    r = zs(m, candidate_labels=["payments", "delivery", "refund", "other"])
    print(r["labels"][0], "|", m)
```

2. Example:

```python
preds = []
for i in range(0, len(texts), 16):
    batch = tokenizer(texts[i:i + 16], padding=True, truncation=True,
                      max_length=128, return_tensors="pt")
    with torch.no_grad():
        preds += model(**batch).logits.argmax(dim=-1).tolist()
```

3. Example:

```python
faqs = ["How do I track my order?", "How to change my password?",
        "What is the refund policy?", "Can I pay with UPI?", "Delivery is late, what to do?"]
E = embed(["my parcel has not arrived"] + faqs)
scores = E[0] @ E[1:].T
print(faqs[int(scores.argmax())])      # likely the tracking or late-delivery question
```

4. Example:

```python
from datasets import load_dataset
small = load_dataset("imdb", split="train").shuffle(seed=0).select(range(1000))
small = small.map(lambda b: {"n_words": [len(t.split()) for t in b["text"]]}, batched=True)
print(sum(small["n_words"]) / len(small))   # roughly 230 words on average
```

**Next:** [Fine-tuning a Transformer](/interview/ai-engineer/nlp-transformers/fine-tuning-a-transformer)
