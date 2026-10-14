---
title: Fine-Tuning, LoRA and QLoRA
part: Customizing Models
summary: When to prompt, use RAG or fine-tune; the SFT data format; why full fine-tuning is expensive; LoRA's low-rank maths with real parameter counts; quantization and QLoRA memory maths; PEFT and TRL code; and distillation.
---

Prompting and RAG change what you *send* to a model. **Fine-tuning** changes the model itself: you continue training it on your own examples so it behaves the way you want — a fixed output format, a company tone, a narrow skill like extracting fields from Indian invoices. Fine-tuning a large model used to need a room full of GPUs. Techniques called **LoRA** and **QLoRA** made it possible on one GPU, even a free Colab one. Interviewers ask about these constantly, and they love the maths: "how many parameters does LoRA train?" and "how much memory does a 7B model need?"

> **In simple words:** Fine-tuning = more training on your examples. LoRA = freeze the big model and train only two tiny extra matrices per layer, so you train less than 1% of the parameters. QLoRA = the same, but the frozen model is stored in 4-bit numbers to save even more memory.

## What fine-tuning is (and the kinds of it)

A pretrained model learned general language from huge text data. Fine-tuning continues training on a much smaller, focused dataset (see [The LLM Training Pipeline](/interview/llms-genai/the-llm-training-pipeline) for how pretraining, SFT and RLHF fit together).

| Type | What changes | Data needed | Use |
|---|---|---|---|
| **Supervised fine-tuning (SFT)** | Model learns to produce your target answers | Input → ideal output pairs | Format, style, a narrow task |
| Preference tuning (RLHF, **DPO**) | Model learns which of two answers is better | Pairs of (better, worse) answers | Tone, helpfulness, safety |
| Continued pretraining | Model reads lots of raw domain text | Large raw text (legal, medical) | New domain vocabulary — expensive |
| **Full fine-tuning** | All weights updated | Any of the above | Maximum quality, maximum cost |
| **PEFT** (parameter-efficient fine-tuning) | Only a small number of new or chosen weights | Any of the above | The default today: LoRA, QLoRA |

In this chapter "fine-tuning" mostly means **SFT with LoRA or QLoRA** — what AI engineers actually do day to day.

## Prompt vs RAG vs fine-tune: how to decide

This is one of the most common interview questions. The key idea:

> **Remember:** **RAG gives the model knowledge. Fine-tuning gives the model behaviour.** If the problem is "it doesn't know our refund policy", use RAG. If the problem is "it knows, but never answers in our exact JSON format and tone", consider fine-tuning.

| Need | Prompt engineering | RAG | Fine-tuning |
|---|---|---|---|
| Use private or fresh facts (policies, docs, prices) | Only if they fit in the prompt | **Best** — update docs anytime | Poor — facts get stale, model may still hallucinate |
| Cite sources | Possible | **Best** | Hard |
| Consistent format / style / tone | Often good enough | No help | **Best** for strict, repeated formats |
| Narrow task at high volume (classify 10 lakh tickets/day) | Works but big prompts cost money | No help | **Best** — a small tuned model can replace a big prompted one |
| Teach a new skill the base model is weak at | Limited | No help | Good (with enough quality data) |
| Lower latency and cost | Shorter prompts help | Adds retrieval time | Smaller tuned model is fast and cheap |
| Time and effort to start | Minutes | Days | Days to weeks, plus data work |
| Needs ML infrastructure | No | Some (vector DB) | Yes (GPUs, training, model hosting) |

The order to try:

1. **Prompt engineering** first (see [Prompt Engineering](/interview/llms-genai/prompt-engineering)). It is cheap and often enough.
2. **RAG** if the model is missing knowledge (see [RAG Fundamentals](/interview/llms-genai/rag-fundamentals)).
3. **Fine-tuning** if, with good prompts and retrieval, behaviour is still not right — or if you want to replace a big expensive model with a small cheap one for one task.

They also combine: many production systems use a fine-tuned model *with* RAG.

> **Interview tip:** When asked "should we fine-tune?", ask back: "What exactly is failing — missing knowledge or wrong behaviour? Have we tried better prompts and few-shot examples? Do we have a few hundred high-quality examples and an eval set?" This shows judgment, which matters more than knowing the library.

## Preparing SFT data

SFT data is a list of conversations showing the model the ideal reply. The common format is **JSONL** (one JSON object per line) with chat messages:

```json
{"messages": [{"role": "system", "content": "Extract invoice fields as JSON."}, {"role": "user", "content": "Invoice no INV-2291, dated 03/02/2026, GSTIN 29ABCDE1234F1Z5, total ₹18,880"}, {"role": "assistant", "content": "{\"invoice_no\": \"INV-2291\", \"date\": \"2026-02-03\", \"gstin\": \"29ABCDE1234F1Z5\", \"total\": 18880}"}]}
{"messages": [{"role": "system", "content": "Extract invoice fields as JSON."}, {"role": "user", "content": "Bill #A-17 dt 15-Jan-2026 amount Rs 4,500 GST no 07PQRSX9876K1Z2"}, {"role": "assistant", "content": "{\"invoice_no\": \"A-17\", \"date\": \"2026-01-15\", \"gstin\": \"07PQRSX9876K1Z2\", \"total\": 4500}"}]}
```

Rules that matter more than any hyperparameter:

- **Quality beats quantity.** A few hundred to a few thousand clean, consistent examples usually beat 50,000 noisy ones. Every example teaches the model; wrong examples teach wrong behaviour.
- **Cover the real variety.** Different formats, edge cases (missing fields), the messy inputs real users send.
- **Keep a held-out set.** Split off 10–20% for validation and a separate test set to compare against the base model.
- **Match the chat template.** Each model family wraps messages in its own special tokens (the **chat template**). Libraries apply it for you when you use the `messages` format — do not invent your own.
- **Train on the answer, not the question.** Usually the loss is computed only on the assistant tokens (called **loss masking** or "completion-only" training), so the model learns to write answers, not to repeat prompts.
- **No secrets or personal data** in training data unless you are allowed — a model can memorize and repeat it.

## Why full fine-tuning is so expensive

During training, every parameter needs memory for several things. With the common **mixed-precision** setup and the **Adam** optimizer (see [Optimizers and Learning Rate](/interview/deep-learning/optimizers-and-learning-rate)):

<div class="formula">

| Item | Bytes per parameter |
|---|---|
| Weights in bf16 (16-bit) | 2 |
| Gradients in bf16 | 2 |
| Master copy of weights in fp32 | 4 |
| Adam first moment (m) in fp32 | 4 |
| Adam second moment (v) in fp32 | 4 |
| **Total (before activations)** | **16** |

</div>

**Worked example: a 7-billion-parameter model.**

- Full fine-tuning: 7 × 10⁹ × 16 bytes = 112 × 10⁹ bytes = **112 GB**, plus activations. That needs several 80 GB GPUs.
- Just running it (inference) in bf16: 7 × 10⁹ × 2 bytes = **14 GB**.

So training needs about 8 times the memory of inference, before counting activations. LoRA attacks this problem.

## LoRA: Low-Rank Adaptation

### The idea

A weight matrix W in a Transformer layer (for example the query projection in attention — see [The Transformer Architecture](/interview/nlp-transformers/the-transformer-architecture)) might be 4096 × 4096. Full fine-tuning learns a change ΔW of the same huge size.

The LoRA paper (2021) observed that the useful change ΔW is usually **low-rank**: it can be written well as the product of two thin matrices. (A matrix's **rank** is, roughly, how many independent directions of information it holds. A rank-8 matrix can be built from just 8 columns times 8 rows — see [Vectors and Matrices](/interview/math-for-ml/vectors-and-matrices).) So LoRA:

1. **Freezes** the original W — it is never updated.
2. Adds two small trainable matrices: **B** of shape d × r and **A** of shape r × d, where **r** (the **rank**) is small, like 8 or 16.
3. Computes the layer output as:

<div class="formula">

| Formula | Meaning |
|---|---|
| h = W·x + (α / r) · B·A·x | Original output plus a small learned correction |
| ΔW = (α / r) · B·A | The learned change; same shape as W but low-rank |
| Trainable params per matrix = d·r + r·k | For W of shape d × k (here d = k) |
| B starts as all zeros | So B·A = 0 and training starts from the original model exactly |

</div>

**α** (alpha, `lora_alpha`) is a scaling number. The ratio α/r controls how strongly the adapter changes the output. A common choice is α = 2r (for example r = 16, α = 32).

<figure>
<svg viewBox="0 0 440 215" width="440" height="215" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<text x="220" y="22" text-anchor="middle" fill="currentColor" stroke="none" font-weight="bold">h = W·x + (α/r)·B·A·x</text>
<rect x="40" y="40" width="120" height="120" />
<text x="100" y="98" text-anchor="middle" fill="currentColor" stroke="none">W</text>
<text x="100" y="116" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">frozen</text>
<text x="100" y="180" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">d × d = 16.8M</text>
<text x="190" y="106" text-anchor="middle" fill="currentColor" stroke="none" font-size="18">+</text>
<rect x="210" y="40" width="24" height="120" stroke="var(--accent)" />
<text x="222" y="105" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">B</text>
<text x="222" y="180" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">d × r</text>
<text x="242" y="106" text-anchor="middle" fill="currentColor" stroke="none">·</text>
<rect x="250" y="88" width="120" height="24" stroke="var(--accent)" />
<text x="310" y="105" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">A</text>
<text x="310" y="80" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">r × d</text>
<text x="290" y="203" text-anchor="middle" fill="var(--accent)" stroke="none">trainable: 2·d·r = 65,536 (d=4096, r=8)</text>
</svg>
<figcaption>LoRA keeps the big matrix W frozen and learns two thin side matrices B and A; their product has the same shape as W but needs only a tiny fraction of the parameters.</figcaption>
</figure>

### Worked example: tiny matrices by hand

Take d = 4 and r = 1. W is 4 × 4 = 16 numbers. B is 4 × 1 and A is 1 × 4 — together only 8 numbers.

Suppose after training B = [1, 2, 0, 1]ᵀ (a column) and A = [0.5, 0, 1, 0] (a row). Then B·A is row i = Bᵢ × A:

```text
row 1: 1 × [0.5, 0, 1, 0] = [0.5, 0, 1, 0]
row 2: 2 × [0.5, 0, 1, 0] = [1.0, 0, 2, 0]
row 3: 0 × [0.5, 0, 1, 0] = [0.0, 0, 0, 0]
row 4: 1 × [0.5, 0, 1, 0] = [0.5, 0, 1, 0]
```

A full 4 × 4 update from just 8 numbers. Every row is a multiple of the same row — that is what "rank 1" means. With r = 8, you would get 8 independent directions, which is enough for most fine-tuning tasks.

### Worked example: real parameter counts

One attention weight matrix with d = 4096 (the size in a typical 7B model):

- Full matrix: 4096 × 4096 = **16,777,216** parameters.
- LoRA, r = 8: B has 4096 × 8 = 32,768; A has 8 × 4096 = 32,768. Total = **65,536**.
- Fraction: 65,536 ÷ 16,777,216 = 0.0039 = **0.39%**, which is **256 times fewer**.

| Rank r | LoRA params (2 × 4096 × r) | % of 16,777,216 |
|---|---|---|
| 8 | 65,536 | 0.39% |
| 16 | 131,072 | 0.78% |
| 64 | 524,288 | 3.13% |

Now a whole 7B model with 32 layers (a Llama-style model with 4096 × 4096 attention matrices):

- LoRA r = 8 on the query and value matrices only: 32 layers × 2 matrices × 65,536 = **4,194,304** ≈ 4.2 million trainable parameters. That is about 0.06% of 7 billion.
- LoRA r = 8 on all four attention matrices (q, k, v, o): 32 × 4 × 65,536 = **8,388,608** ≈ 8.4 million.

So instead of storing gradients and Adam states for 7 billion parameters, you store them for a few million. The frozen weights still need memory, but only in their compact form, with no gradients or optimizer states.

### LoRA settings and facts to know

| Setting | Typical values | Effect |
|---|---|---|
| `r` (rank) | 8, 16, 32, 64 | Higher = more capacity, more memory. 8–16 is a good start |
| `lora_alpha` | Often 2 × r | Scales the update |
| `lora_dropout` | 0.05–0.1 | Regularization on the adapter |
| `target_modules` | Attention projections (`q_proj`, `k_proj`, `v_proj`, `o_proj`), often also MLP layers (`gate_proj`, `up_proj`, `down_proj`) | More modules = better quality usually, more params |
| Learning rate | Around 1e-4 to 2e-4 (higher than full fine-tuning) | Too high = unstable; too low = learns nothing |

Two big practical benefits:

- **No extra latency after training.** You can **merge** the adapter into the weights: W_new = W + (α/r)·B·A. The merged model is the same size and speed as the original.
- **Small, swappable adapters.** An adapter file is a few megabytes to a few hundred megabytes. One base model can serve many customers, each with its own adapter loaded on demand.

> **Common mistake:** Thinking LoRA "adds knowledge cheaply". LoRA changes behaviour well, but teaching many new facts through any fine-tuning is unreliable — the model may still mix them up or hallucinate. Use RAG for facts.

## Quantization

**Quantization** stores numbers with fewer bits. Fewer bits = less memory and often faster inference, with a small loss of accuracy.

| Format | Bits | Bytes per param | 7B model | 13B model | 70B model |
|---|---|---|---|---|---|
| fp32 | 32 | 4 | 28 GB | 52 GB | 280 GB |
| fp16 / bf16 | 16 | 2 | 14 GB | 26 GB | 140 GB |
| int8 | 8 | 1 | 7 GB | 13 GB | 70 GB |
| 4-bit (int4 / NF4) | 4 | 0.5 | 3.5 GB | 6.5 GB | 35 GB |

These are weights only. Running a model also needs memory for activations and the **KV cache** (see [Generation Settings and the Context Window](/interview/llms-genai/generation-settings-and-the-context-window)), so add some headroom.

### Worked example: int8 absmax quantization

Take four weights: [0.5, −1.2, 3.0, 0.1].

1. Find the largest absolute value: 3.0.
2. Scale = 3.0 ÷ 127 = 0.023622 (int8 holds −127 to 127).
3. Quantize: q = round(x ÷ scale).
   - 0.5 ÷ 0.023622 = 21.17 → **21**
   - −1.2 ÷ 0.023622 = −50.8 → **−51**
   - 3.0 ÷ 0.023622 = 127 → **127**
   - 0.1 ÷ 0.023622 = 4.23 → **4**
4. Store [21, −51, 127, 4] (1 byte each) plus the one scale.
5. Dequantize: x ≈ q × scale = [0.496, −1.205, 3.0, 0.094].

The errors are small: 0.004, 0.005, 0, 0.006. Real methods do this per small block of weights (for example 64 numbers share one scale) so that one big value does not ruin the precision of the rest.

Words you will hear:

- **NF4 (4-bit NormalFloat):** a 4-bit format designed for weights that follow a bell-shaped (normal) distribution, introduced with QLoRA.
- **GPTQ, AWQ:** methods that quantize a trained model carefully using a little calibration data, mostly for serving.
- **GGUF:** a file format used by llama.cpp and Ollama for quantized models that run on laptops (see [Serving Models](/interview/mlops-deployment/serving-models)).

## QLoRA

**QLoRA** (2023) combines the two ideas:

1. Load the frozen base model in **4-bit NF4**.
2. Add LoRA adapters in 16-bit and train only them. During the forward pass, weights are de-quantized to bf16 on the fly for the computation.
3. Extra tricks: **double quantization** (quantizing the scales too, saving a bit more memory) and **paged optimizers** (moving optimizer memory to CPU RAM during spikes to avoid out-of-memory crashes).

The QLoRA paper showed it can fine-tune a 65B model on a single 48 GB GPU while matching 16-bit fine-tuning quality on their benchmarks.

### Worked example: QLoRA memory for a 7B model

- Frozen base in 4-bit: 7 × 10⁹ × 0.5 bytes = **3.5 GB** (a bit more in practice for scales and layers kept in higher precision).
- LoRA r = 16 on q, k, v, o in 32 layers: 32 × 4 × (2 × 4096 × 16) = 16,777,216 ≈ 16.8 million parameters. With weights, gradients and Adam states at about 16 bytes each: 16.8 × 10⁶ × 16 = **0.27 GB**.
- Activations: depends on batch size and sequence length; a few GB with **gradient checkpointing** (recomputing activations instead of storing them all).

Total: roughly **6–10 GB** — it fits on a single 16 GB GPU, such as the free T4 on Google Colab. Compare with 112 GB+ for full fine-tuning.

| Method | Trainable params (7B) | Approx. GPU memory | Quality |
|---|---|---|---|
| Full fine-tuning | 7 billion | 112 GB + activations | Highest ceiling |
| LoRA (bf16 base) | ~4–40 million | 14 GB + adapters + activations (≈ 16–24 GB) | Close to full for most tasks |
| QLoRA (4-bit base) | ~4–40 million | 3.5 GB + adapters + activations (≈ 6–10 GB) | Close to LoRA; slightly slower training |

## Code: QLoRA with PEFT, transformers and TRL

The Hugging Face stack: **transformers** (models), **peft** (LoRA), **bitsandbytes** (4-bit loading), **trl** (the `SFTTrainer`), **datasets** (data). This needs an NVIDIA GPU. (If Hugging Face basics are new, see [Hugging Face in Practice](/interview/nlp-transformers/hugging-face-in-practice).)

```python
# pip install transformers peft trl bitsandbytes datasets accelerate
import torch
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer, SFTConfig

MODEL_ID = "Qwen/Qwen2.5-1.5B-Instruct"     # small open model; check the Hub for current options

bnb = BitsAndBytesConfig(
    load_in_4bit=True,                       # store frozen weights in 4-bit
    bnb_4bit_quant_type="nf4",               # NormalFloat4
    bnb_4bit_use_double_quant=True,          # quantize the scales too
    bnb_4bit_compute_dtype=torch.bfloat16,   # do the maths in bf16
)
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
model = AutoModelForCausalLM.from_pretrained(MODEL_ID, quantization_config=bnb, device_map="auto")
model = prepare_model_for_kbit_training(model)   # stability tweaks for k-bit training

lora = LoraConfig(
    r=16, lora_alpha=32, lora_dropout=0.05,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    task_type="CAUSAL_LM",
)
model = get_peft_model(model, lora)
model.print_trainable_parameters()
# Output (approx.): trainable params: ~4.4M || all params: ~1.5B || trainable%: ~0.3

data = load_dataset("json", data_files={"train": "train.jsonl", "test": "val.jsonl"})  # "messages" format

trainer = SFTTrainer(
    model=model,
    train_dataset=data["train"],
    eval_dataset=data["test"],
    processing_class=tokenizer,              # applies the model's chat template
    args=SFTConfig(
        output_dir="invoice-lora",
        num_train_epochs=2,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,       # effective batch = 16
        learning_rate=2e-4,
        gradient_checkpointing=True,         # save activation memory
        bf16=True,
        logging_steps=10,
        eval_strategy="epoch",
    ),
)
trainer.train()
model.save_pretrained("invoice-lora/adapter")    # saves only the small adapter
```

For this 1.5B model (hidden size 1536, 28 layers, smaller k/v projections), r = 16 on q, k, v, o gives about 4.4 million trainable parameters — around 0.3%.

Using the adapter later:

```python
from peft import PeftModel

base = AutoModelForCausalLM.from_pretrained(MODEL_ID, torch_dtype=torch.bfloat16, device_map="auto")
model = PeftModel.from_pretrained(base, "invoice-lora/adapter")
merged = model.merge_and_unload()             # fold B·A into W: no extra latency
merged.save_pretrained("invoice-model-merged")
```

### Training tips and warning signs

- **Watch validation loss.** Training loss going down while validation loss goes up = **overfitting** (memorizing the examples). Use fewer epochs (1–3 is typical) or more data.
- **Catastrophic forgetting:** the model gets good at your task but worse at general skills. LoRA reduces this (the base is frozen), but test general ability too.
- **Always compare against the base model + a good prompt** on the same test set. If fine-tuning does not clearly win, you do not need it.
- **Hosted fine-tuning:** OpenAI, AWS Bedrock, Google Vertex AI and others let you upload JSONL and fine-tune some of their models without managing GPUs. Which models support it changes often; check the provider.

> **Interview tip:** If asked "how do you know fine-tuning worked?", say: "I keep a held-out test set and evaluate the base model with my best prompt and the fine-tuned model on the same metrics — exact-match on fields, format validity, and an LLM-as-judge score for quality. I also spot-check general ability to detect forgetting." (See [Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps).)

## Distillation

**Knowledge distillation** trains a small **student** model to imitate a large **teacher** model. You get much of the big model's quality on your task at a fraction of the cost and latency.

Two forms:

1. **Classic (soft labels).** The student learns from the teacher's full probability distribution, not just the right answer. A **temperature** T > 1 softens the distribution so the student also learns which wrong answers are "almost right". The loss is usually the **KL divergence** between teacher and student distributions.
2. **LLM distillation by data.** Use a strong model to generate high-quality answers (or reasoning steps) for many inputs, then run SFT on a small model with that data. This is how many small "reasoning" and task models are made.

**Worked example: temperature softening.** Teacher logits for three classes are [2, 1, 0].

- T = 1: softmax = [e² , e¹, e⁰] ÷ (e² + e¹ + e⁰) = [7.389, 2.718, 1] ÷ 11.107 ≈ **[0.665, 0.245, 0.090]**.
- T = 2: divide logits by 2 → [1, 0.5, 0] → [2.718, 1.649, 1] ÷ 5.367 ≈ **[0.506, 0.307, 0.186]**.

At T = 2 the second and third classes get more probability, so the student sees more of the teacher's "dark knowledge" about how classes relate.

> **Common mistake:** Distilling from a commercial model without checking its terms of use. Many providers do not allow using outputs to train competing models. Check the licence before you build a dataset.

## Key terms

| Term | Simple meaning |
|---|---|
| Fine-tuning | Continuing to train a pretrained model on your own examples |
| SFT | Supervised fine-tuning on input → ideal output pairs |
| DPO | Direct Preference Optimization; tuning from pairs of better/worse answers |
| Full fine-tuning | Updating every weight of the model |
| PEFT | Parameter-efficient fine-tuning; training only a small number of parameters |
| LoRA | Low-Rank Adaptation; frozen W plus trainable low-rank B·A |
| Rank (r) | Inner size of the LoRA matrices; how many independent directions the update has |
| lora_alpha (α) | Scaling factor for the LoRA update (effect = α/r) |
| Target modules | Which layers get LoRA adapters (e.g. q_proj, v_proj) |
| Adapter | The small saved file with the trained LoRA weights |
| Merging | Adding B·A into W so the adapter has no inference cost |
| Chat template | Model-specific special tokens wrapping each message |
| Loss masking | Computing loss only on the assistant's answer tokens |
| Mixed precision | Training with 16-bit maths and a 32-bit master copy of weights |
| Quantization | Storing numbers in fewer bits (int8, 4-bit) to save memory |
| Absmax quantization | Scaling by the largest absolute value to fit the integer range |
| NF4 | 4-bit NormalFloat format used by QLoRA |
| QLoRA | LoRA on top of a 4-bit quantized frozen base model |
| Double quantization | Quantizing the quantization scales to save more memory |
| Paged optimizer | Optimizer memory that can spill to CPU RAM to avoid crashes |
| Gradient checkpointing | Recomputing activations during backprop to save memory |
| GPTQ / AWQ / GGUF | Post-training quantization methods / a quantized file format |
| Catastrophic forgetting | Losing general ability after narrow fine-tuning |
| Knowledge distillation | Training a small student to imitate a large teacher |
| Temperature (distillation) | Softens the teacher's probabilities so the student learns more |

## Interview questions

**When would you choose fine-tuning over RAG?**
When the problem is behaviour, not knowledge: a strict output format, a consistent style, or a narrow task at high volume where a small tuned model can replace a big prompted one. For facts that change or need citations, RAG is better. I try prompting first, then RAG, and fine-tune only if an eval shows a gap.

**Explain LoRA.**
LoRA freezes the pretrained weight matrix W and learns a low-rank update as the product of two small matrices, B of size d by r and A of size r by d. The output becomes W x plus alpha over r times B A x. B starts at zero so training begins from the original model. Only the small matrices are trained, typically under 1% of the parameters.

**How many trainable parameters does LoRA add to a 4096 × 4096 matrix at rank 8?**
B is 4096 by 8 and A is 8 by 4096, so 2 times 4096 times 8 equals 65,536 parameters, versus 16,777,216 for the full matrix. That is about 0.39%, or 256 times fewer.

**Why does LoRA save so much memory if the base model still has to be loaded?**
Most training memory goes to gradients and optimizer states — about 12 extra bytes per trained parameter with Adam in mixed precision. LoRA needs those only for the few million adapter parameters. The frozen base needs only its weights, with no gradients or optimizer states.

**Does LoRA slow down inference?**
Not if you merge it: W plus alpha over r times B A has the same shape as W, so the merged model is identical in size and speed. Unmerged adapters add a small cost but let you swap adapters per customer.

**What is QLoRA?**
LoRA where the frozen base model is stored in 4-bit NF4, with double quantization and paged optimizers to save memory. Computation happens in bf16 by de-quantizing on the fly. It lets you fine-tune a 7B model on a 16 GB GPU and very large models on one 48 GB GPU, with quality close to 16-bit LoRA.

**How much GPU memory do you need to run a 13B model in fp16, and in 4-bit?**
Weights alone: 13 billion times 2 bytes is 26 GB in fp16, and 13 billion times 0.5 bytes is 6.5 GB in 4-bit. I would add headroom for activations and the KV cache, which grows with context length and batch size.

**How much data do you need for SFT?**
It depends on the task, but a few hundred to a few thousand high-quality, consistent examples is often enough for format or style tasks with LoRA. Quality and coverage of real cases matter more than size. I always hold out validation and test sets.

**What is catastrophic forgetting and how do you reduce it?**
After narrow fine-tuning, the model can lose general abilities. LoRA helps because the base weights stay frozen; fewer epochs, a lower learning rate and mixing some general data into training also help. I test general ability as well as the target task.

**What is knowledge distillation?**
Training a small student model to imitate a larger teacher, either from the teacher's softened probability distributions or, for LLMs, by generating teacher outputs and doing SFT on the student. It gives a cheaper, faster model for a specific task.

**What do r and lora_alpha control?**
r is the rank, which sets the capacity and number of trainable parameters. lora_alpha scales the update; the effective strength is alpha divided by r. A common starting point is r 16 and alpha 32.

## Try it yourself

1. **LoRA counts.** A model has hidden size 5120 and 40 layers. LoRA r = 16 on q and v (both 5120 × 5120). How many trainable parameters? *Hint:* 2 × d × r per matrix.
2. **Memory maths.** Estimate weight memory for a 70B model in bf16 and in 4-bit. Could the 4-bit version fit on one 48 GB GPU?
3. **Quantize by hand.** Quantize [0.8, −0.4, 2.0] to int8 with absmax. Show the scale, the integers and the de-quantized values. *Hint:* scale = 2.0 ÷ 127.
4. **Decide.** For each, prompt, RAG, or fine-tune? (a) Bot must answer from 2,000 HR policy pages that change monthly. (b) A model must always output a 12-field JSON for insurance claims, and prompting gives 92% valid JSON. (c) Make replies sound friendlier.

### Answers

1. Per matrix: 2 × 5120 × 16 = 163,840. Per layer (q and v): 2 × 163,840 = 327,680. Total: 40 × 327,680 = **13,107,200** ≈ 13.1 million.
2. bf16: 70 × 10⁹ × 2 = **140 GB**. 4-bit: 70 × 10⁹ × 0.5 = **35 GB**. Yes, the 4-bit weights fit in 48 GB, leaving about 13 GB for activations and the KV cache (tight for long contexts, but possible).
3. Scale = 2.0 ÷ 127 = 0.015748. Integers: 0.8 ÷ 0.015748 = 50.8 → **51**; −0.4 ÷ 0.015748 = −25.4 → **−25**; 2.0 → **127**. De-quantized: 51 × 0.015748 = 0.803; −25 × 0.015748 = −0.394; 127 × 0.015748 = 2.0.
4. (a) **RAG** — large, changing knowledge. (b) First try structured outputs or strict tool schemas (they can guarantee valid JSON); if field *quality* is still weak, **fine-tune**. (c) **Prompt** — a tone instruction plus a few examples is usually enough.

**Next:** [Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps)
