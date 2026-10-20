---
title: BERT, GPT and T5
part: Models & Tools
summary: The three Transformer families — encoder-only (BERT), decoder-only (GPT) and encoder-decoder (T5) — how each is pretrained (masked LM, next-token, span corruption), when to use which, and how modern open models like Llama, Mistral, Qwen and Gemma are built.
---

After 2017, researchers split the Transformer into pieces and found that each piece is good at different jobs. **BERT** kept the encoder and became the standard for understanding text. **GPT** kept the decoder and grew into today's chatbots. **T5** kept both and turned every task into "text in, text out". As an AI engineer, you choose between these families every week: an encoder for a cheap, fast classifier or embedding model; a decoder LLM for generation and reasoning; an encoder-decoder for some translation and summarization systems.

> **In simple words:** BERT reads the whole sentence at once and is trained to fill in hidden words — great for understanding. GPT reads left to right and is trained to guess the next word — great for writing. T5 has a reader and a writer and is trained to turn one text into another.

## Pretraining and fine-tuning

All three families follow the same two-stage recipe:

1. **Pretraining** — train on a huge amount of unlabeled text (web pages, books, code) with a **self-supervised** task. Self-supervised means the labels come from the text itself (the hidden word, the next word), so no human labelling is needed.
2. **Fine-tuning** — continue training the pretrained model on a smaller labeled dataset for your task (sentiment, NER, question answering). Or, for large decoder models, just give instructions in the prompt.

This is **transfer learning**: knowledge learned from general text transfers to your task. See [Transfer Learning and Pretrained Models](/interview/ai-engineer/deep-learning/transfer-learning-and-pretrained-models).

The families differ in **architecture** and **pretraining objective**.

<figure>
<svg viewBox="0 0 440 210" width="440" height="210" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<text x="70" y="20" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Encoder-only</text>
<text x="220" y="20" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Decoder-only</text>
<text x="370" y="20" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Encoder-decoder</text>
<rect x="20" y="40" width="100" height="90" rx="8" />
<text x="70" y="80" text-anchor="middle" fill="currentColor" stroke="none">encoder</text>
<text x="70" y="98" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">sees all tokens</text>
<rect x="170" y="40" width="100" height="90" rx="8" />
<text x="220" y="80" text-anchor="middle" fill="currentColor" stroke="none">decoder</text>
<text x="220" y="98" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">sees past only</text>
<rect x="315" y="40" width="50" height="90" rx="8" />
<text x="340" y="90" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">enc</text>
<rect x="378" y="40" width="50" height="90" rx="8" />
<text x="403" y="90" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">dec</text>
<line x1="365" y1="85" x2="378" y2="85" />
<text x="70" y="150" text-anchor="middle" fill="currentColor" stroke="none">BERT, RoBERTa</text>
<text x="70" y="168" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">fill in [MASK]</text>
<text x="220" y="150" text-anchor="middle" fill="currentColor" stroke="none">GPT, Llama, Claude</text>
<text x="220" y="168" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">predict next token</text>
<text x="370" y="150" text-anchor="middle" fill="currentColor" stroke="none">T5, BART</text>
<text x="370" y="168" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">text → text</text>
<text x="70" y="195" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">understand</text>
<text x="220" y="195" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">generate</text>
<text x="370" y="195" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">transform</text>
</svg>
<figcaption>The three Transformer families differ in which half they keep and what game they are trained on.</figcaption>
</figure>

## BERT: encoder-only

**BERT** (Bidirectional Encoder Representations from Transformers; Google, 2018) is a stack of Transformer **encoder** blocks. Its self-attention has **no causal mask**, so every token sees every other token, left and right. This is called **bidirectional** attention. For understanding a sentence, seeing both sides helps: in "I went to the bank to deposit money", the word "deposit" after "bank" tells you which bank.

Sizes: **BERT-base** = 12 layers, d = 768, 12 heads, about 110 M parameters. **BERT-large** = 24 layers, d = 1,024, 16 heads, about 340 M.

### Masked language modelling (MLM)

If every token can see every other token, you cannot train BERT to predict the next word — it would just look at it. So BERT plays a fill-in-the-blank game called **masked language modelling (MLM)**:

1. Pick 15% of the tokens at random.
2. Of those: replace 80% with `[MASK]`, 10% with a random token, and leave 10% unchanged. (The mix stops the model from relying on always seeing `[MASK]`, which never appears in real use.)
3. The model predicts the original token at those positions. The loss is computed **only** on the chosen positions.

Example:

```text
Original:  i drink hot chai every morning
Input:     i drink [MASK] chai every morning
Target:    position 3 → "hot"
```

The model must use both "drink" (left) and "chai every morning" (right) to guess "hot".

Original BERT also had a second task, **next sentence prediction (NSP)**: given two sentences, was B really the next sentence after A? Later work (**RoBERTa**, 2019) showed NSP does not help much; RoBERTa dropped it and trained longer on more data, and got better results.

### How BERT is used

- **Classification:** take the final vector of the `[CLS]` token (first position), add a small linear layer, fine-tune. Sentiment, spam, intent detection.
- **Token classification:** a linear layer on every token's vector. NER ("Virat → PERSON"), part-of-speech tagging.
- **Extractive question answering:** predict the start and end positions of the answer span inside a passage.
- **Embeddings:** encoder models fine-tuned for similarity (like **Sentence-BERT** and most open embedding models) give one vector per sentence for semantic search and RAG. See [Embeddings and Semantic Search](/interview/ai-engineer/llms-genai/embeddings-and-semantic-search).

Popular variants: **DistilBERT** (40% smaller, about 60% faster, keeps most of the accuracy, made with **distillation** — a small model trained to copy a big one), **RoBERTa** (better training), **ALBERT** (shares weights across layers), **DeBERTa** (better position handling), and **ModernBERT** (2024; longer 8k context, RoPE, faster).

> **Interview tip:** BERT cannot generate text well. It was never trained to produce tokens one after another. If someone suggests "use BERT for a chatbot", explain that it is an encoder for understanding; use a decoder model for generation.

## GPT: decoder-only

**GPT** (Generative Pre-trained Transformer; OpenAI, 2018) is a stack of Transformer **decoder** blocks with a **causal mask** and no cross-attention. Each token sees only the tokens before it.

### Next-token prediction (causal language modelling)

The pretraining task is simply: **predict the next token**. This is called **causal language modelling (CLM)**. Every position in every training text is a training example, so no data is wasted.

```text
Text:     I  drink  hot  chai
Position 1 sees "I"                → predict "drink"
Position 2 sees "I drink"          → predict "hot"
Position 3 sees "I drink hot"      → predict "chai"
```

Because of the causal mask, all these predictions are made in **one** forward pass during training.

The loss is **cross-entropy**: −ln(probability the model gave to the correct next token), averaged over positions. See [Loss Functions and Backpropagation](/interview/ai-engineer/deep-learning/loss-functions-and-backpropagation).

Worked example — suppose the model gives these probabilities to the correct tokens:

| Position | Context | Correct next token | Model's probability | Loss = −ln(p) |
|---|---|---|---|---|
| 1 | I | drink | 0.10 | 2.303 |
| 2 | I drink | hot | 0.25 | 1.386 |
| 3 | I drink hot | chai | 0.60 | 0.511 |

Average loss = (2.303 + 1.386 + 0.511) ÷ 3 = 4.200 ÷ 3 = **1.400**.

A perfect model (p = 1) would have loss 0. Training lowers this number over trillions of tokens. **Perplexity** = e^loss = e^1.400 ≈ **4.05**: roughly, the model is as unsure as if it were choosing among about 4 equally likely tokens.

### From GPT to chat models

- **GPT-1** (2018, ~117 M parameters): pretrain, then fine-tune per task.
- **GPT-2** (2019, up to 1.5 B): showed a big model can do some tasks with no fine-tuning, just a prompt.
- **GPT-3** (2020, 175 B): **in-context learning** — give a few examples in the prompt (**few-shot**) and the model follows the pattern, no weight updates.
- **ChatGPT** (2022) and later chat models: the pretrained decoder is further trained with instruction tuning and RLHF to follow instructions and behave as an assistant. See [The LLM Training Pipeline](/interview/ai-engineer/llms-genai/the-llm-training-pipeline).

Today almost all frontier LLMs — GPT, Claude, Gemini, Llama, Qwen — are decoder-only Transformers (some with mixture-of-experts layers).

## T5: encoder-decoder

**T5** (Text-to-Text Transfer Transformer; Google, 2019) keeps the full original architecture: an encoder reads the input with bidirectional attention, and a decoder generates the output with causal self-attention plus **cross-attention** to the encoder.

T5's big idea: **every task is text-to-text.** You tell the model the task with a text prefix:

```text
"translate English to German: The house is wonderful."  → "Das Haus ist wunderbar."
"summarize: <long article>"                             → "<short summary>"
"cola sentence: The course is jumping well."            → "unacceptable"
```

Even classification produces the label as text. One model, one loss, one training loop for everything.

### Span corruption

T5's pretraining is a version of fill-in-the-blank called **span corruption**. Random **spans** (runs of consecutive tokens) are replaced with special **sentinel tokens**, and the decoder must output the missing spans:

```text
Original: I drink hot chai every morning in Patna
Input:    I drink <extra_id_0> every morning <extra_id_1> Patna
Target:   <extra_id_0> hot chai <extra_id_1> in <extra_id_2>
```

**BART** (Facebook, 2019) is a similar encoder-decoder trained to rebuild text after several kinds of noise (masking, deleting, shuffling sentences). It is strong for summarization. **Flan-T5** is T5 further trained on many instruction-style tasks, which makes it much better at following prompts.

## Comparing the three

| | Encoder-only | Decoder-only | Encoder-decoder |
|---|---|---|---|
| Examples | BERT, RoBERTa, DeBERTa, ModernBERT | GPT, Llama, Mistral, Qwen, Gemma, Claude | T5, Flan-T5, BART, Whisper (speech) |
| Attention | Bidirectional | Causal (masked) | Encoder bidirectional; decoder causal + cross-attention |
| Pretraining | Masked LM (+ NSP in BERT) | Next-token prediction | Span corruption / denoising |
| Can generate text? | Not well | Yes | Yes |
| Strengths | Fast, cheap understanding; embeddings | Generation, reasoning, in-context learning, chat | Clear input→output tasks |
| Typical size in use | 100 M – 1 B | 1 B – 1 T+ | 60 M – 11 B |
| Typical tasks | Classification, NER, retrieval, reranking | Chat, code, agents, almost everything | Translation, summarization, speech recognition |

### When to use which

| Your problem | Good choice | Why |
|---|---|---|
| Classify 10 million support tickets per day cheaply | Fine-tuned encoder (DistilBERT, ModernBERT) | Small, fast, runs on CPU or a cheap GPU |
| Embeddings for semantic search / RAG | Encoder embedding model | Trained for similarity; one vector per text |
| Rerank top 50 search results | Cross-encoder (encoder) | Reads query and document together |
| Chatbot, writing, code, multi-step reasoning | Decoder-only LLM | Only family that does open-ended generation well |
| Few labeled examples, many tasks | Decoder LLM with prompting | In-context learning, no training needed |
| Fixed translation or summarization at scale | Encoder-decoder or small decoder LLM | Efficient for input→output |
| Speech to text | Encoder-decoder (Whisper) | Audio encoder + text decoder |

> **Interview tip:** A strong answer mentions **cost**. "For high-volume classification with labeled data, I would fine-tune a small encoder like DeBERTa or ModernBERT — it is 100× cheaper per request than an LLM and often as accurate. I would use an LLM when there is little labeled data, the task needs generation or reasoning, or requirements change often."

### Why decoder-only models won for LLMs

1. **Simple and general.** One objective (next token) and one stack. Any task can be written as "continue this text".
2. **Every token is a training signal.** MLM learns from 15% of tokens; next-token prediction learns from 100%.
3. **Scales smoothly.** Loss keeps improving predictably as data, parameters and compute grow (**scaling laws**).
4. **In-context learning** appears at scale — the model can learn a task from examples in the prompt.
5. **Efficient generation** with the KV cache (see [The Transformer Architecture](/interview/ai-engineer/nlp-transformers/the-transformer-architecture)).

> **Common mistake:** Saying "encoder-decoder is always better for translation". Large decoder-only LLMs translate very well today. Encoder-decoder models still win when you want a small, efficient, specialised model.

## Modern open models

**Open-weight models** are models whose trained weights you can download and run yourself. Each family releases new versions often, so learn the **ideas**, then check the Hugging Face Hub for current versions. As of 2026, important families include:

| Family | From | Notes (idea level) |
|---|---|---|
| **Llama** | Meta | The model family that made strong open weights common. Llama 3.x dense models from 1 B to 405 B; Llama 4 (2025) uses mixture-of-experts. |
| **Mistral / Mixtral** | Mistral AI (France) | Efficient small models; Mixtral popularised open mixture-of-experts. |
| **Qwen** | Alibaba | Wide size range, strong multilingual and coding versions; Qwen3 includes reasoning ("thinking") modes. |
| **Gemma** | Google | Small, efficient models built from Gemini research; good for running on one GPU or laptop. |
| **DeepSeek** | DeepSeek (China) | Large mixture-of-experts models (V3) and open reasoning models (R1). |
| **Phi** | Microsoft | Small models trained heavily on high-quality and synthetic data. |

Most of them share the same recipe, all of which you now understand:

- **Decoder-only** Transformer
- **Pre-norm** with **RMSNorm**
- **RoPE** positions
- **SwiGLU** feed-forward
- **Grouped-query attention** to shrink the KV cache
- Byte-level BPE tokenizers with large vocabularies (about 128k–260k tokens)
- Often **mixture-of-experts (MoE)**

**Mixture-of-experts (MoE)** replaces the single feed-forward network in a block with many smaller FFNs ("experts") and a small **router** that sends each token to only a few of them (for example 2 out of 8, or 8 out of 256). The model has many total parameters (lots of knowledge) but uses only a fraction per token (fast). The trade-off: all experts must still fit in GPU memory.

| Term | Meaning |
|---|---|
| Base model | Only pretrained; continues text, does not follow instructions well |
| Instruct / chat model | Base model further trained to follow instructions |
| Open weights | Weights downloadable; the licence may still limit use |
| Open source (strict sense) | Weights, code, and ideally data and training recipe, under an open licence |

> **Remember:** "Llama-3.1-8B-Instruct" tells you: family (Llama), version (3.1), size (8 billion parameters), and type (instruction-tuned). Always read the model card for licence, context length and intended use.

## Trying all three in code

```python
from transformers import pipeline

# Encoder-only: fill in the mask
fill = pipeline("fill-mask", model="bert-base-uncased")
for r in fill("Paris is the [MASK] of France.", top_k=3):
    print(r["token_str"], round(r["score"], 3))      # "capital" should be first

# Decoder-only: continue the text
gen = pipeline("text-generation", model="gpt2")
print(gen("The best thing about Indian trains is", max_new_tokens=20)[0]["generated_text"])

# Encoder-decoder: text to text
t2t = pipeline("text2text-generation", model="google/flan-t5-small")
print(t2t("translate English to German: How old are you?")[0]["generated_text"])
```

GPT-2 is old and small, so its continuation will be rough; the point is to see the three behaviours. The next chapter explains pipelines and the Hugging Face library in detail.

## Key terms

| Term | Simple meaning |
|---|---|
| Pretraining | Training on huge unlabeled text with a self-supervised task |
| Self-supervised | Labels come from the data itself (hidden word, next word) |
| Fine-tuning | Further training on a small labeled dataset for one task |
| Transfer learning | Reusing knowledge from pretraining for a new task |
| BERT | Encoder-only model trained with masked language modelling |
| Bidirectional attention | Each token sees tokens on both sides |
| MLM | Masked language modelling: predict hidden tokens |
| NSP | Next sentence prediction; BERT's second task, later dropped |
| `[CLS]` | First token whose vector is used for classification |
| Distillation | Training a small model to copy a big one |
| GPT | Decoder-only model trained to predict the next token |
| CLM | Causal language modelling = next-token prediction |
| Cross-entropy loss | −ln(probability of the correct token) |
| Perplexity | e^loss; how many choices the model is "confused between" |
| In-context learning | Learning a task from examples in the prompt, without weight updates |
| T5 | Encoder-decoder model treating every task as text-to-text |
| Span corruption | Hiding runs of tokens with sentinel tokens to be reconstructed |
| Sentinel token | Placeholder like `<extra_id_0>` marking a hidden span |
| BART | Encoder-decoder trained to denoise corrupted text |
| Open weights | Model weights you can download and run |
| Mixture-of-experts (MoE) | Many FFN experts; a router picks a few per token |
| Base vs instruct model | Pretrained only vs further trained to follow instructions |

## Interview questions

**What is the difference between BERT and GPT?**
BERT is an encoder with bidirectional attention, pretrained with masked language modelling, so it is best for understanding tasks like classification, NER and embeddings. GPT is a decoder with causal attention, pretrained with next-token prediction, so it is built for generation. BERT sees the whole sentence; GPT sees only the past.

**Explain masked language modelling.**
About 15% of tokens are selected; most are replaced with `[MASK]`, some with random tokens, some left unchanged. The model predicts the original tokens at those positions using context from both sides. The loss is computed only on the selected positions.
*Follow-up: why not mask 100% of the selected tokens with [MASK]?* `[MASK]` never appears at fine-tuning time, so always using it creates a mismatch; random and unchanged tokens force the model to build good representations for every token.

**Why can't BERT generate text the way GPT does?**
It was trained to fill blanks with bidirectional attention, not to produce tokens one at a time from left to right. It has no learned way to continue a sequence. You can force it, but the results are poor and slow.

**What is next-token prediction and why is it so effective?**
The model predicts each token from the previous ones, using cross-entropy loss. Every token in the corpus is a training signal, the objective is simple, and it scales smoothly with data and parameters. To predict well, the model must learn grammar, facts and reasoning patterns.

**What is T5's text-to-text idea?**
Every task — translation, summarization, classification, QA — is framed as input text to output text, with a task prefix like "summarize:". One model, loss and decoding method serve all tasks. It is pretrained with span corruption.

**When would you choose an encoder model over an LLM?**
For high-volume, latency-sensitive tasks with labeled data, like classifying tickets or generating embeddings. Encoders are small, fast and cheap, and fine-tuned ones are often as accurate as LLMs on narrow tasks. LLMs are better when you need generation, reasoning, or have little labeled data.

**What is perplexity?**
Perplexity is e raised to the average cross-entropy loss. Lower is better. A perplexity of 4 means the model is, on average, as uncertain as choosing uniformly among 4 tokens. It is useful for comparing language models on the same tokenizer and data.

**Why are almost all modern LLMs decoder-only?**
Decoder-only models are simple, use every token for training, scale predictably, support in-context learning, and generate efficiently with a KV cache. Any task can be written as text continuation. Encoder-decoders offer little extra benefit at very large scale.

**What is a mixture-of-experts model?**
In an MoE model, each block's feed-forward layer is replaced by many expert FFNs and a router that sends each token to only a few experts. Total parameters are large, but compute per token is small. The cost is that all experts must fit in memory, and routing adds complexity.

**What do modern open LLMs like Llama have in common architecturally?**
They are decoder-only Transformers with pre-norm RMSNorm, RoPE positional encoding, SwiGLU feed-forward layers, grouped-query attention, and large byte-level BPE vocabularies. Some use mixture-of-experts. The differences are mostly data, scale, and training recipe.

## Try it yourself

1. For "the train to Delhi is late again" with BERT's MLM, choose 15% of tokens (round to 1) and write the input and target. *Hint: 7 tokens.*
2. A model gives the correct next tokens probabilities 0.5, 0.2, 0.8, 0.4. Compute the average cross-entropy loss and perplexity.
3. Write the T5 span-corruption input and target for "UPI payments are fast and free", hiding "are fast" and "free".
4. Run the three pipelines from this chapter. Then change the BERT sentence to one about cricket and see if the top guesses make sense.

### Answers

1. 15% of 7 ≈ 1 token. Example: input "the train to [MASK] is late again", target at position 4 = "delhi" (bert-base-uncased lowercases).
2. Losses: −ln 0.5 = 0.693, −ln 0.2 = 1.609, −ln 0.8 = 0.223, −ln 0.4 = 0.916. Sum = 3.442, average = 0.861. Perplexity = e^0.861 ≈ 2.36.
3. Input: "UPI payments <extra_id_0> and <extra_id_1>". Target: "<extra_id_0> are fast <extra_id_1> free <extra_id_2>".
4. For example, "Virat Kohli is a famous [MASK] player." should give "cricket" near the top.

**Next:** [Hugging Face in Practice](/interview/ai-engineer/nlp-transformers/hugging-face-in-practice)
