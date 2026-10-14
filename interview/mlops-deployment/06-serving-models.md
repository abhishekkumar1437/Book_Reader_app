---
title: Serving Models
part: Cloud & Serving
summary: Online vs batch inference, why LLMs need special servers (KV cache, continuous batching, PagedAttention), vLLM with an OpenAI-compatible client, TGI and Ollama, quantization for serving, estimating GPU memory by hand, and autoscaling.
---

Serving a small scikit-learn model is easy: load it in FastAPI and call `predict`. Serving an LLM is a different problem. The model is billions of numbers that must sit in GPU memory, each answer is produced one token at a time, and a GPU costs a lot per hour, so you must keep it busy. This chapter explains how inference servers like vLLM solve this, and teaches the most asked practical skill: estimating how much GPU memory a model needs, by hand, in an interview.

> **In simple words:** For LLMs, use a dedicated inference server (vLLM, TGI, Ollama) instead of writing your own loop. It handles many users at once (continuous batching) and manages memory well (PagedAttention). GPU memory needed ≈ parameters × bytes per parameter + KV cache for all active tokens + some overhead.

## Online vs batch inference

**Inference** means using a trained model to make predictions. There are two main ways to do it.

**Online (real-time) inference**: a request comes in, the model answers immediately, the user waits. Latency matters. Example: a chatbot reply, a fraud check during a UPI payment.

**Batch (offline) inference**: you collect many inputs and process them together on a schedule. Nobody is waiting live. Throughput and cost matter. Example: every night, score all 10 lakh customers for churn risk; summarize yesterday's 50,000 support tickets.

| | Online | Batch |
|---|---|---|
| Who waits | A user or a calling service | Nobody (results stored for later) |
| Main metric | Latency (p95, time to first token) | Throughput (items per hour), cost per item |
| Infrastructure | Always-on API, autoscaling | A scheduled job (cron, Airflow), spot/preemptible machines |
| Failure handling | Retry fast or return an error | Retry the failed chunk, resume later |
| Cost | Higher (idle capacity for peaks) | Lower (full machines, cheap spot instances) |
| LLM provider option | Normal API | Batch APIs (e.g. Anthropic Message Batches) — discounted, results within hours |

A third pattern is **asynchronous inference**: the request is accepted, put in a queue, and the result is delivered later by polling or a webhook. Good for jobs that take 30 seconds to many minutes, like transcribing a long audio file.

> **Interview tip:** Always ask "does a user wait for this?" first. If not, batch it. Batch jobs are cheaper, easier to retry, and can use discounted batch APIs or spot machines.

A batch job for a classical model, processed in chunks so memory stays small:

```python
# batch_score.py — run nightly
import joblib
import pandas as pd

pipe = joblib.load("churn_model.joblib")                 # pipeline: preprocessing + model
reader = pd.read_csv("customers.csv", chunksize=50_000)  # do not load 10 lakh rows at once

for i, chunk in enumerate(reader):
    chunk["churn_prob"] = pipe.predict_proba(chunk)[:, 1]   # column 1 = probability of churn
    chunk[["customer_id", "churn_prob"]].to_parquet(f"scores/part-{i:04d}.parquet")
    print(f"chunk {i}: {len(chunk)} rows scored")
# Output: chunk 0: 50000 rows scored ... chunk 19: 50000 rows scored
```

## Serving classical models

For scikit-learn, XGBoost or a small PyTorch model, a FastAPI service ([FastAPI for AI Apps](/interview/mlops-deployment/fastapi-for-ai-apps)) is usually enough. When teams have many models or need GPU efficiency for neural networks, they use model-serving frameworks:

| Tool | What it adds |
|---|---|
| FastAPI (your own) | Full control, simplest for one or two models |
| BentoML | Packaging + serving + adaptive batching for many frameworks |
| NVIDIA Triton Inference Server | High-performance GPU serving, dynamic batching, many model formats (ONNX, TensorRT, PyTorch) |
| KServe | Model serving on Kubernetes with autoscaling and canary rollouts |
| Ray Serve | Python-native serving that scales across a cluster, good for model pipelines |
| SageMaker / Vertex AI endpoints | Managed hosting on a cloud |

**ONNX** (Open Neural Network Exchange) is a standard file format for models. Converting a PyTorch or scikit-learn model to ONNX and running it with **ONNX Runtime** often makes CPU inference faster and removes the need for PyTorch in the serving image.

## Why LLM serving is special

An LLM produces one token at a time. To generate a 200-token answer, it runs the model 200 times. Each step needs the model to "look at" all earlier tokens through **attention** (see [Attention Step by Step](/interview/nlp-transformers/attention-step-by-step)).

### The KV cache

At each step, attention needs the **key** and **value** vectors of every earlier token. Recomputing them for all earlier tokens at every step would waste huge amounts of work. So the server stores them in GPU memory and only computes them for the new token. This store is the **KV cache**. (Introduced in [Generation Settings and the Context Window](/interview/llms-genai/generation-settings-and-the-context-window).)

The KV cache makes generation fast, but it uses a lot of memory, and that memory grows with:
- the number of tokens in each conversation (prompt + output), and
- the number of conversations being served at the same time.

So on an LLM server, memory is shared between the fixed **model weights** and a variable **KV cache**. The more KV cache space you have, the more users you can serve at once.

### Two phases: prefill and decode

1. **Prefill**: the whole prompt is processed in one go. It is compute heavy and fast per token. It decides **time to first token (TTFT)**.
2. **Decode**: output tokens are produced one by one. Each step is small, and speed is limited by reading the weights from memory. It decides **time per output token (TPOT)**, often reported as tokens per second.

Long prompts (big RAG contexts) make TTFT worse. Long outputs make total time worse. Users feel TTFT most, which is why we stream.

## Batching: keeping the GPU busy

A GPU is like a bus with 64 seats. Sending one passenger per trip is a waste. **Batching** means processing many requests together in one forward pass, so the cost of reading the weights is shared.

**Static batching**: wait until you have, say, 4 requests, run them together until **all** are finished, then take the next 4.

The problem: LLM answers have different lengths. The short ones finish early and their slots sit empty.

### Worked example: static vs continuous batching

A batch has 4 requests that need 10, 20, 50 and 200 output tokens.

With static batching, the batch runs until the longest finishes: **200 steps**.
- Slots available = 4 slots × 200 steps = 800 slot-steps.
- Slots actually used = 10 + 20 + 50 + 200 = 280.
- GPU utilisation of slots = 280 ÷ 800 = **35%**.
- The request that needed 10 tokens also could not *start* until the batch formed, and a new request arriving at step 11 waits until step 200.

**Continuous batching** (also called in-flight batching) checks the batch at **every step**. When a request finishes, a waiting request takes its slot immediately. If requests keep arriving, slots stay close to 100% used, and new users do not wait for the slowest answer in the batch. This is the single biggest reason LLM servers get several times more throughput than a naive loop.

> **Real-life example:** Static batching is a cab that waits until all four passengers are dropped before taking anyone new. Continuous batching is a shared auto: as soon as one passenger gets down, a new one gets in.

### PagedAttention

Before vLLM, servers reserved one big continuous block of KV cache memory per request, sized for the maximum possible length. Most requests never used it all, so lots of memory was wasted. **PagedAttention** (the idea behind vLLM) splits the KV cache into small fixed-size **blocks**, like pages in an operating system's memory, and gives a request new blocks only as it grows. Waste drops sharply, so more requests fit at once. It also lets requests that share the same prompt prefix share the same blocks (**prefix caching**).

## The LLM inference servers

| Server | Best for | Notes |
|---|---|---|
| **vLLM** | Production GPU serving of open models | Continuous batching, PagedAttention, prefix caching, many quantization formats, OpenAI-compatible API. The default choice in 2026. |
| **SGLang** | High-throughput serving, structured output, agents | Similar features to vLLM, very fast; strong prefix sharing |
| **TGI** (Hugging Face Text Generation Inference) | Hugging Face ecosystem | Was widely used; Hugging Face has shifted focus to supporting vLLM and SGLang, so check its current status before choosing it |
| **TensorRT-LLM** (+ Triton) | Maximum speed on NVIDIA GPUs | More setup; compiles models for specific GPUs |
| **Ollama** | Local development on a laptop or one small server | One command to download and run quantized models; OpenAI-compatible API; not built for many concurrent users |
| **llama.cpp** | CPU and Apple Silicon, edge devices | Runs GGUF quantized models; Ollama uses it underneath |

### vLLM: serve an open model

On a Linux machine with an NVIDIA GPU:

```bash
pip install vllm

vllm serve Qwen/Qwen2.5-7B-Instruct \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.90 \
  --port 8000 \
  --api-key local-dev-key
```

| Flag | Meaning |
|---|---|
| `Qwen/Qwen2.5-7B-Instruct` | A Hugging Face model id (downloaded on first run). Any supported model works; check the model's licence. |
| `--max-model-len 8192` | Max tokens (prompt + output) per request. Smaller → less KV cache per request → more users fit. |
| `--gpu-memory-utilization 0.90` | vLLM may use 90% of GPU memory: weights first, the rest becomes KV cache blocks |
| `--api-key` | Clients must send this key |
| `--tensor-parallel-size 2` | (not used here) split a model across 2 GPUs when it does not fit on one |
| `--quantization awq` | (not used here) load an AWQ-quantized checkpoint |

```text
INFO ... Loading weights took 12.3 seconds
INFO ... # GPU blocks: ...    (KV cache blocks available)
INFO ... Starting vLLM API server on http://0.0.0.0:8000
```

(Exact log lines differ by version.) The same with Docker, caching downloads in a volume (see [Docker for ML and Compose](/interview/mlops-deployment/docker-for-ml-and-compose)):

```bash
docker run --gpus all --ipc=host -p 8000:8000 \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  -e HF_TOKEN="$HF_TOKEN" \
  vllm/vllm-openai:latest \
  --model Qwen/Qwen2.5-7B-Instruct --max-model-len 8192
```

`--ipc=host` gives the container enough shared memory, which PyTorch needs for multi-process work. Pin a specific vLLM image version in production instead of `latest`.

### Calling it with the OpenAI client

vLLM speaks the **OpenAI-compatible API** (`/v1/chat/completions`, `/v1/completions`, `/v1/models`). So the normal `openai` Python SDK works; you only change `base_url`. This is very useful: you can switch between a hosted API and your own server by changing configuration, not code.

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="local-dev-key")
MODEL = "Qwen/Qwen2.5-7B-Instruct"        # must match the served model name

# Normal call
resp = client.chat.completions.create(
    model=MODEL,
    messages=[
        {"role": "system", "content": "You answer in one short sentence."},
        {"role": "user", "content": "What is a KV cache?"},
    ],
    max_tokens=60,
    temperature=0.2,
)
print(resp.choices[0].message.content)
print(resp.usage)       # prompt_tokens, completion_tokens, total_tokens

# Streaming call
stream = client.chat.completions.create(
    model=MODEL,
    messages=[{"role": "user", "content": "Give two uses of Docker."}],
    max_tokens=80,
    stream=True,
)
for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)
```

```text
A KV cache stores the attention keys and values of earlier tokens so the model does not recompute them for each new token.
CompletionUsage(completion_tokens=27, prompt_tokens=31, total_tokens=58)
1. Packaging an app with its dependencies so it runs the same everywhere. 2. Running isolated services like databases for local development.
```

(Model output and token counts will differ.)

Check what is served with curl:

```bash
curl http://localhost:8000/v1/models -H "Authorization: Bearer local-dev-key"
```

```text
{"object":"list","data":[{"id":"Qwen/Qwen2.5-7B-Instruct","object":"model", ...}]}
```

### Ollama for local work

```bash
ollama pull llama3.2            # downloads a quantized model
ollama run llama3.2 "Explain overfitting in one line."
```

Ollama also serves an OpenAI-compatible API at `http://localhost:11434/v1`, so the client code above works with `base_url="http://localhost:11434/v1"` and any non-empty `api_key`. Use Ollama to develop offline; use vLLM when many users must be served on GPUs.

## Quantization for serving

**Quantization** stores each weight with fewer bits. Fewer bits → less memory → bigger models fit, more KV cache space, and often faster decode (because decode speed is limited by reading weights from memory). The cost is a small loss in quality, usually small at 8-bit and acceptable at 4-bit for many tasks. (Training-side quantization like QLoRA is in [Fine-Tuning with LoRA and QLoRA](/interview/llms-genai/fine-tuning-lora-and-qlora).)

<div class="formula">

| Precision | Bytes per parameter | Typical use |
|---|---|---|
| fp32 (32-bit float) | 4 | Training master weights; rarely for LLM serving |
| fp16 / bf16 (16-bit) | 2 | Default for serving full-quality models |
| fp8 / int8 (8-bit) | 1 | Near-full quality, half the memory of fp16; fp8 needs newer GPUs |
| int4 (4-bit) | 0.5 | Big savings; small quality loss; very common for open models |

</div>

Common quantized formats you will see on Hugging Face:

| Format | Used by | Notes |
|---|---|---|
| **AWQ** | vLLM, SGLang, TGI | 4-bit, protects the most important weights; good quality |
| **GPTQ** | vLLM, many tools | 4-bit, uses a calibration dataset |
| **FP8** | vLLM on newer NVIDIA GPUs | 8-bit float, very close to fp16 quality |
| **GGUF** | llama.cpp, Ollama | File format with many bit levels (Q4_K_M, Q8_0...) for CPU/Mac |
| **bitsandbytes** (int8/nf4) | transformers, QLoRA | Easy to use; often slower for serving than AWQ/GPTQ |

> **Common mistake:** Assuming 4-bit always halves latency compared with 8-bit. Memory drops, but speed depends on the GPU's kernels for that format and the batch size. Measure on your hardware.

## GPU memory estimate by hand

This is a favourite interview question: "Will a 7B model fit on a 24 GB GPU?" Here is the method.

<div class="formula">

| Part | Formula |
|---|---|
| Weights | parameters × bytes per parameter |
| KV cache per token | 2 × layers × KV heads × head dimension × bytes per value |
| KV cache total | KV per token × tokens per sequence × concurrent sequences |
| Overhead | CUDA context, activations, fragmentation: roughly 1–2 GB, or ~10–20% |
| Total | weights + KV cache + overhead |

</div>

The "2 ×" in the KV formula is because each token stores one **key** vector and one **value** vector, in every layer. Here 1 GB = 10⁹ bytes and 1 KB = 1,024 bytes to keep the numbers simple.

### Step 1: weights

A 7B model in fp16: 7 × 10⁹ parameters × 2 bytes = 14 × 10⁹ bytes = **14 GB**.

Quick rule: **GB ≈ billions of parameters × bytes per parameter.**

| Model size | fp16 (×2) | int8 (×1) | int4 (×0.5) |
|---|---|---|---|
| 7B | 14 GB | 7 GB | 3.5 GB |
| 8B | 16 GB | 8 GB | 4 GB |
| 70B | 140 GB | 70 GB | 35 GB |

### Step 2: KV cache per token

Take an older 7B design (like Llama 2 7B): 32 layers, 32 attention heads, head dimension 128, fp16 (2 bytes). Every head has its own K and V, so KV heads × head dim = 32 × 128 = 4,096.

KV per token = 2 × 32 × 4,096 × 2 = **524,288 bytes = 512 KB = 0.5 MB**.

One conversation with 4,096 tokens: 4,096 × 0.5 MB = **2,048 MB ≈ 2 GB**. Eight such users at once: 8 × 2 = **16 GB** of KV cache — more than the weights!

Newer models use **grouped-query attention (GQA)**: many query heads share a few KV heads. An 8B model in the Llama 3 style has 32 layers but only 8 KV heads of dimension 128, so KV heads × head dim = 8 × 128 = 1,024.

KV per token = 2 × 32 × 1,024 × 2 = **131,072 bytes = 128 KB**. That is 4 times smaller. This is a major reason GQA exists.

### Step 3: put it together on a 24 GB GPU

Model: 8B, GQA (128 KB per token), on a 24 GB GPU (like an NVIDIA L4). Assume 2 GB overhead and 4,096 tokens per conversation.

**In fp16:**
1. Weights = 8 × 2 = 16 GB.
2. Left for KV cache = 24 − 16 − 2 = **6 GB**.
3. Tokens that fit = 6 × 10⁹ ÷ 131,072 ≈ **45,776 tokens**.
4. Concurrent 4,096-token conversations = 45,776 ÷ 4,096 ≈ **11**.

**In int4 (AWQ):**
1. Weights = 8 × 0.5 = 4 GB.
2. Left for KV cache = 24 − 4 − 2 = **18 GB**.
3. Tokens = 18 × 10⁹ ÷ 131,072 ≈ **137,329 tokens**.
4. Concurrent conversations = 137,329 ÷ 4,096 ≈ **33**.

Quantizing the weights tripled the number of users the same GPU can serve at full context.

<figure>
<svg viewBox="0 0 440 170" width="440" height="170" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<text x="20" y="22" fill="currentColor" stroke="none">8B model, fp16 on a 24 GB GPU</text>
<rect x="20" y="30" width="267" height="34" />
<text x="153" y="52" text-anchor="middle" fill="currentColor" stroke="none">weights 16 GB</text>
<rect x="287" y="30" width="33" height="34" />
<text x="303" y="52" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">2</text>
<rect x="320" y="30" width="100" height="34" />
<text x="370" y="52" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">KV 6 GB</text>
<text x="20" y="102" fill="currentColor" stroke="none">same model, int4</text>
<rect x="20" y="110" width="67" height="34" />
<text x="53" y="132" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">4 GB</text>
<rect x="87" y="110" width="33" height="34" />
<text x="103" y="132" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">2</text>
<rect x="120" y="110" width="300" height="34" />
<text x="270" y="132" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">KV cache 18 GB (~33 users)</text>
<text x="20" y="162" fill="currentColor" stroke="none" font-size="11">small box = overhead (CUDA, activations); fp16 leaves room for only ~11 users</text>
</svg>
<figcaption>GPU memory is weights plus overhead plus KV cache; shrinking the weights leaves more room for KV cache and therefore more concurrent users.</figcaption>
</figure>

### Will a 70B model fit?

- fp16: 70 × 2 = 140 GB of weights. Does not fit on one 80 GB GPU. Needs at least 2 × 80 GB GPUs with **tensor parallelism** (splitting each layer's matrices across GPUs), and more for a useful KV cache.
- int4: 70 × 0.5 = 35 GB. Fits on one 48 GB or 80 GB GPU with room for KV cache.

### Training needs much more

Inference needs weights + KV cache. Full **training** with the Adam optimizer in mixed precision needs about **16 bytes per parameter** (fp16 weights and gradients, plus fp32 master weights and two Adam moment values), before activations. A 7B model: 7 × 16 = **112 GB**. That is why people fine-tune with LoRA/QLoRA instead.

> **Interview tip:** Say the formula out loud first, then the numbers: "Weights are 7 billion times 2 bytes, 14 GB in fp16. Then KV cache: 2 times layers times KV heads times head dim times 2 bytes per token. Then 1–2 GB overhead. So a 7B fp16 model fits on a 24 GB card, but with limited room for concurrent long contexts." Interviewers care about the method more than the exact number.

## Autoscaling LLM servers

**Autoscaling** adds or removes server instances based on load. For CPU web services you scale on CPU usage. For LLM servers, GPU utilisation is a poor signal, because a GPU can look "100% busy" while still able to batch more requests. Better signals:

| Signal | Why |
|---|---|
| Requests waiting in the queue | If requests wait, you need more replicas |
| Requests running per replica | Shows how full each server's batch is |
| KV cache usage % | Near 100% means new requests must wait or be pre-empted |
| p95 time to first token | The user-facing symptom; scale before it breaks your target |

vLLM exposes these as **Prometheus metrics** (Prometheus is a common metrics-collection system) at `/metrics`, for example the number of running and waiting requests and KV cache usage. Kubernetes (with KEDA or the Horizontal Pod Autoscaler on custom metrics) or a managed platform can scale on them.

Challenges specific to LLMs:

- **Slow cold starts.** A new replica must pull a big image, load many GB of weights, and warm up. This can take minutes (see the cold-start example in [Docker for ML and Compose](/interview/mlops-deployment/docker-for-ml-and-compose)). Keep a minimum number of warm replicas, cache weights locally, and scale up early.
- **Expensive idle GPUs.** Scale-to-zero saves money for internal tools but makes the first request very slow.
- **GPU availability.** Popular GPUs can be unavailable in a region. Have a fallback (another region, a hosted API).

Other ways to get more from the same GPUs:

| Technique | Idea |
|---|---|
| Prefix caching | Reuse KV cache for a shared system prompt or document across requests |
| Speculative decoding | A small draft model guesses several tokens; the big model checks them in one pass |
| Shorter `max-model-len` | Less KV cache reserved per request |
| Model routing | Send easy requests to a small model, hard ones to a big model (see [Latency, Cost and Scale](/interview/ai-system-design/latency-cost-and-scale)) |
| Response caching | Do not call the model at all for repeated questions ([Monitoring, Cost and Caching](/interview/mlops-deployment/monitoring-cost-and-caching)) |

## Key terms

| Term | Simple meaning |
|---|---|
| Inference | Using a trained model to make predictions |
| Online inference | Real-time answers while a user waits |
| Batch inference | Processing many inputs on a schedule, nobody waiting |
| Asynchronous inference | Accept now, deliver the result later via a queue |
| ONNX / ONNX Runtime | Standard model format / fast engine to run it |
| KV cache | Stored keys and values of earlier tokens, reused at each step |
| Prefill | Processing the whole prompt at once; sets TTFT |
| Decode | Generating output tokens one by one |
| TTFT / TPOT | Time to first token / time per output token |
| Batching | Running several requests in one forward pass |
| Static batching | Batch waits for all requests to finish |
| Continuous batching | Finished requests are replaced by new ones every step |
| PagedAttention | Storing KV cache in small blocks to avoid waste |
| Prefix caching | Reusing KV cache for a shared prompt start |
| vLLM | Popular high-throughput open-source LLM server |
| OpenAI-compatible API | A server that accepts the same requests as OpenAI's API |
| Ollama | Easy local runner for quantized models |
| Quantization | Storing weights in fewer bits to save memory |
| AWQ / GPTQ / GGUF / FP8 | Common quantized model formats |
| GQA | Grouped-query attention: query heads share fewer KV heads |
| Tensor parallelism | Splitting each layer across several GPUs |
| Autoscaling | Automatically changing the number of replicas with load |
| Speculative decoding | Draft model proposes tokens, big model verifies them |

## Interview questions

**What is the difference between online and batch inference? Give examples.**
Online inference answers each request immediately while someone waits, like a chatbot or fraud check, and is judged on latency. Batch inference processes many inputs together on a schedule, like nightly churn scores, and is judged on throughput and cost. Batch can use cheaper spot machines and discounted batch APIs.

**Why use vLLM instead of a simple loop with Hugging Face `generate()`?**
A simple loop handles one request or a static batch, wastes GPU time when answers have different lengths, and wastes memory on reserved KV cache. vLLM does continuous batching, PagedAttention memory management, prefix caching and optimized kernels, so it serves many times more users per GPU. It also gives an OpenAI-compatible API for free.

**Explain continuous batching.**
Instead of waiting for every request in a batch to finish, the server checks after each decoding step. Finished requests leave and waiting requests join immediately. GPU slots stay full and new requests do not wait for the longest answer, which raises throughput and lowers waiting time.

**What is the KV cache and why does it limit concurrency?**
It stores the attention keys and values for all earlier tokens, so each new token does not recompute them. It grows with tokens per sequence and with the number of sequences, so after the weights, it takes most of the remaining GPU memory. When it is full, no more requests can be served at once.

**Estimate the GPU memory for a 7B model in fp16.**
Weights are 7 billion × 2 bytes = 14 GB. Add KV cache: for a Llama-2-7B-like design, 2 × 32 layers × 4,096 × 2 bytes = 0.5 MB per token, so 2 GB per 4,096-token sequence. Add 1–2 GB overhead. So roughly 16–18 GB for one long conversation; it fits on a 24 GB GPU with room for a few concurrent users.
*Follow-up the interviewer may ask:* "And in int4?" Weights become 3.5 GB, leaving far more room for KV cache and users.

**What is quantization and what is the trade-off?**
Storing weights in fewer bits, for example 16-bit to 4-bit. It cuts memory by up to 4×, fits bigger models, frees space for KV cache and often speeds decoding. The trade-off is some quality loss, which you must measure on your own eval set.

**Why is GPU utilisation a bad autoscaling metric for LLM servers?**
A GPU can show high utilisation while still able to take more requests into its batch, so it does not tell you if users are waiting. Better metrics are queue length, running requests per replica, KV cache usage and p95 time to first token.

**What is the advantage of an OpenAI-compatible API on your own server?**
Client code stays the same; you only change the base URL and model name. You can switch between a hosted provider and a self-hosted model, or use a fallback, through configuration. Many tools and frameworks already support this API.

**How would you serve a 70B model?**
In fp16 it needs about 140 GB for weights, so use at least two 80 GB GPUs with tensor parallelism, or quantize to int4 (about 35 GB) to fit on one large GPU. Serve with vLLM or SGLang, set a sensible max context length, and keep warm replicas because cold starts are slow.

**What is the difference between prefill and decode?**
Prefill processes the whole prompt in parallel and is compute-bound; it determines time to first token. Decode generates one token per step and is memory-bandwidth bound; it determines tokens per second. Long prompts hurt TTFT; long outputs hurt total time.

## Try it yourself

1. **Memory math.** A 13B model in fp16 has 40 layers and 40 KV heads of dimension 128 (no GQA). Compute: weights, KV cache per token, KV cache for one 4,096-token sequence.
   *Hint:* KV heads × head dim = 40 × 128.
2. **Will it fit?** Using your answer, how many 4,096-token sequences fit on an 80 GB GPU with 3 GB overhead?
3. **Batching utilisation.** A static batch has requests with 30, 60, 90 and 120 output tokens. What fraction of slot-steps is used?
4. **Run Ollama.** Install Ollama, pull a small model, and call it with the `openai` client using `base_url="http://localhost:11434/v1"`. Print `resp.usage`.

### Answers

1. Weights = 13 × 2 = **26 GB**. KV heads × head dim = 40 × 128 = 5,120. KV per token = 2 × 40 × 5,120 × 2 = **819,200 bytes** (= 800 KB). One 4,096-token sequence = 4,096 × 819,200 = 3,355,443,200 bytes ≈ **3.36 GB**.
2. Left for KV = 80 − 26 − 3 = 51 GB. 51 × 10⁹ ÷ 3,355,443,200 ≈ 15.2 → **15 sequences**.
3. Batch runs 120 steps. Available = 4 × 120 = 480. Used = 30 + 60 + 90 + 120 = 300. 300 ÷ 480 = **62.5%**.
4. Example:
```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")   # key is ignored but required
resp = client.chat.completions.create(model="llama3.2",
                                      messages=[{"role": "user", "content": "Hi in Tamil?"}])
print(resp.choices[0].message.content)
print(resp.usage)
```

**Next:** [Experiment Tracking and Model Registry](/interview/mlops-deployment/experiment-tracking-and-model-registry)
