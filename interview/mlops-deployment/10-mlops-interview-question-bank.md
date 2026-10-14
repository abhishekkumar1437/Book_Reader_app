---
title: MLOps Interview Question Bank
part: Wrap-up
summary: 60+ MLOps and deployment interview questions grouped by topic, with model answers you can say out loud, follow-ups interviewers ask, and ⭐ on the most frequently asked ones.
---

Use this bank in Phase 10 (Days 143–150) and whenever you finish a chapter of this book. Read the question, answer out loud without looking, then compare. The ⭐ questions come up most often in AI engineer interviews; make sure you can answer all of them in under a minute. Each answer links back to the chapter that teaches it.

> **In simple words:** Interviewers want to see that you can take a model to production and keep it healthy: serve it (FastAPI), package it (Docker), run it (cloud, GPUs), version it (MLflow), release it safely (CI/CD, canary), and watch it (monitoring, cost, caching).

## How to use this bank

- Do one section per day in the revision week, plus all ⭐ questions twice.
- For each answer, add **one example from your own project** ("In my RAG chatbot, I...").
- Practise the numbers: GPU memory, p95 from samples, token cost, Little's law. Interviewers often ask you to calculate on a whiteboard.

## Fundamentals

### ⭐ 1. What is MLOps?
The practices and tools to deploy, monitor and maintain ML models reliably in production. It extends DevOps by versioning and testing data and models as well as code, because model behaviour comes from data and data changes over time. ([What Is MLOps](/interview/mlops-deployment/what-is-mlops))

*Follow-up the interviewer may ask:* "What does an MLOps pipeline look like?" Data validation → training → evaluation with a quality gate → registry → containerized deployment with canary → monitoring and drift alerts → retraining.

### ⭐ 2. Why do models that work offline fail in production?
Training-serving skew, data drift, concept drift, bad or missing input data, latency or cost that is too high, environment differences, and no monitoring or feedback loop. The most common silent killer is skew from preprocessing done differently at serving time.

### 3. What is the difference between data drift and concept drift?
Data drift: the inputs change (bigger orders during a sale). Concept drift: the right answer for the same input changes (a payment pattern that was fraud is now normal). Data drift is visible from inputs; concept drift needs labels or proxy signals.

### 4. How is MLOps different from DevOps?
DevOps versions code and has pass/fail tests. MLOps also versions data and models, tests quality against thresholds, tracks experiments, keeps a model registry, and monitors drift. ML systems can break with no code change.

### 5. What is LLMOps?
MLOps for LLM apps. The artifacts are prompts, retrieval indexes, tool definitions and model choices. New concerns: token cost, time to first token, hallucination, prompt injection, prompt versioning, and evaluation with golden sets and LLM judges.

### 6. What are the MLOps maturity levels?
Level 0: manual notebooks and hand-copied models. Level 1: automated training pipeline, registry and basic monitoring. Level 2: CI/CD for the pipeline itself plus full monitoring and automated retraining triggers.

## FastAPI and serving code

### ⭐ 7. How would you serve a scikit-learn model as an API?
Save the full pipeline (preprocessing + model) with joblib. In FastAPI, load it once in the `lifespan` startup handler. Define Pydantic request and response models, write a `POST /predict` endpoint as a plain `def` (CPU work runs in the thread pool), add `/health`, auth, logging, and package it with Docker. ([FastAPI for AI Apps](/interview/mlops-deployment/fastapi-for-ai-apps))

### ⭐ 8. When do you use `async def` vs `def` in FastAPI?
`async def` when everything inside is awaitable (async LLM client, async DB driver), so the event loop can serve other requests while waiting. Plain `def` for blocking code (sync libraries, scikit-learn predict); FastAPI runs it in a thread pool. Blocking inside `async def` freezes the whole server.

*Follow-up:* "What about heavy CPU inference?" Threads share the GIL, so heavy CPU work should go to separate processes, more workers or containers, or a dedicated model server.

### ⭐ 9. How do you stream LLM responses to the client?
Call the LLM with streaming on, and yield each text chunk as a Server-Sent Event (`data: ...` and a blank line) from a generator passed to `StreamingResponse` with media type `text/event-stream`. The client reads the body incrementally. It reduces perceived latency because the first tokens appear in under a second.

*Follow-up:* "Streaming works locally but not behind Nginx?" The proxy buffers the response; disable buffering (e.g. `X-Accel-Buffering: no`).

### 10. What does Pydantic do in FastAPI? Name a v2 change.
It validates and converts request data against typed models, returns clear 422 errors, generates JSON schema for `/docs`, and shapes responses. In v2, `.dict()` became `model_dump()`, `class Config` became `model_config = ConfigDict(...)`, and `@validator` became `@field_validator`.

### 11. Why load the model in `lifespan` and not per request?
Loading takes seconds and memory; per-request loading makes every call slow. Load once at startup, keep it in app state, and report readiness in `/health` so the load balancer only sends traffic when the model is ready.

### 12. BackgroundTasks vs a job queue?
`BackgroundTasks` runs small work in the same process after the response; it is lost on restart and has no retries. A queue (Celery, RQ, Arq with Redis or SQS) stores jobs durably and runs them in separate workers with retries and status. Use queues for PDF ingestion or batch scoring; return `202` with a `job_id`.

### 13. How do you secure an LLM endpoint?
Authentication (API key or JWT), per-user rate limits and token budgets, input limits (max length, max tokens) in the schema, HTTPS, restricted CORS, secrets from env/secret manager, and guardrails against prompt injection and unsafe output.

### 14. What status codes would your AI API return and when?
200 success, 202 job accepted, 400 bad request, 401 missing/invalid auth, 403 not allowed, 404 not found, 422 validation failed, 429 rate limit or budget exceeded, 500 bug, 502/503 when the LLM provider fails or is unavailable.

## Docker and Compose

### ⭐ 15. What is the difference between a Docker image and a container?
An image is a read-only template (files, dependencies, start command) built from a Dockerfile. A container is a running instance of it with its own writable layer and process. One image can run as many containers. ([Docker Basics](/interview/mlops-deployment/docker-basics))

### ⭐ 16. Container vs virtual machine?
A VM virtualizes hardware and runs its own OS kernel: strong isolation but heavy and slow to start. A container is an isolated process sharing the host kernel (namespaces and cgroups): light, starts in about a second, dozens per host. In the cloud, containers usually run inside VMs.

### ⭐ 17. Walk me through a Dockerfile for a FastAPI model service.
`FROM python:3.12-slim`; set `PYTHONUNBUFFERED`; `WORKDIR /app`; copy `requirements.txt` and `pip install --no-cache-dir` first for caching; then `COPY . .`; create and switch to a non-root user; `EXPOSE 8000`; add a `HEALTHCHECK`; `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]` in exec form.

*Follow-up:* "Why `0.0.0.0`?" With `127.0.0.1` the server only accepts connections from inside the container, so the published port cannot reach it.

### 18. Explain Docker layer caching and why instruction order matters.
Each instruction creates a cached layer; on rebuild Docker reuses layers until the first changed one, then rebuilds everything after. Put rarely changing steps (base image, dependency install) first and code last, so a code change does not reinstall all libraries.

### ⭐ 19. How do you make an ML Docker image smaller?
Slim base image, multi-stage build (compilers only in the builder stage), `--no-cache-dir`, clean apt lists in the same `RUN`, `.dockerignore`, CPU-only PyTorch wheels when there is no GPU, and keeping large model weights out of the image. ([Docker for ML and Compose](/interview/mlops-deployment/docker-for-ml-and-compose))

### 20. How do containers use GPUs?
The host has the NVIDIA driver and NVIDIA Container Toolkit; the image contains CUDA libraries; you run with `--gpus all` or a GPU reservation in compose. The host driver must support the image's CUDA version.

### 21. What does Docker Compose do? How do services talk to each other?
It defines multi-container apps in YAML (API, vector DB, Redis) and starts them with one command. Services share a network where each service name is a hostname, so the API reaches Redis at `redis://redis:6379`, not `localhost`.

### 22. How do you handle secrets in Docker?
Never in code or Dockerfile (`ENV` and `COPY` keep them in image layers forever). Locally: git-ignored `.env` or compose secrets at `/run/secrets`. Production: a cloud secret manager injecting them at runtime, least-privilege access, rotation. Leaked keys must be rotated.

### 23. Where should model weights live: in the image or outside?
Small models: inside the image, versioned with the code. Large models: outside, downloaded at startup from a registry or object storage into a cached volume, because huge images are slow to push, pull and scale.

## Cloud

### 24. Which AWS services would you use for an AI app?
ECR for images, ECS Fargate (or EKS) for containers behind an Application Load Balancer, S3 for data and models, Bedrock for hosted LLMs or SageMaker AI endpoints for own models, Secrets Manager, CloudWatch for logs and metrics, IAM roles with least privilege. ([Cloud for AI](/interview/mlops-deployment/cloud-for-ai))

### 25. Lambda vs Fargate vs EC2 for serving a model?
Lambda: short functions (15-minute max), no GPU, cold starts; good for glue tasks. Fargate: long-running containers without managing servers; good for FastAPI services. EC2: full VMs including GPUs and full control; needed for large self-hosted models.

### 26. Why might a company use Bedrock or Azure OpenAI instead of the provider's API directly?
Data stays in their cloud account and region, unified billing, IAM access control, private networking and existing compliance approvals. New models or features may arrive there a bit later.

### ⭐ 27. When would you self-host an open model instead of using an API?
At high, steady volume where a GPU's fixed cost beats per-request API cost, when data cannot leave your environment, when you need a fine-tuned or custom model, or for latency control. Include engineering and redundancy costs and check quality on your eval set.

*Follow-up:* "Compute break-even." Monthly GPU cost ÷ API cost per request. E.g. ₹72,000 ÷ ₹0.50 = 1,44,000 requests/month (example prices).

### 28. How do you size the number of instances for an API?
Little's law: concurrent requests = arrival rate × time per request. 200 rps × 0.5 s = 100 in flight; ÷ 20 concurrency per instance = 5 instances; add headroom, say a max of 7.

### 29. What is scale to zero and its downside?
No instances run when idle, so there is no cost. The next request pays a cold start (start container, load model), which can be seconds or minutes for large models. Use a minimum of 1 instance for latency-sensitive services.

## Model serving and GPUs

### ⭐ 30. Online vs batch inference?
Online: immediate answers while a user waits; judged on latency. Batch: many inputs on a schedule; judged on throughput and cost, can use spot machines and discounted batch APIs. Ask first: "does anyone wait for this?" ([Serving Models](/interview/mlops-deployment/serving-models))

### ⭐ 31. Estimate GPU memory for serving a 7B model.
Weights: 7 × 10⁹ × 2 bytes (fp16) = 14 GB. KV cache per token: 2 × layers × KV heads × head dim × 2 bytes; for a Llama-2-7B-like design, 2 × 32 × 4,096 × 2 = 0.5 MB/token, so 2 GB per 4,096-token sequence. Add 1–2 GB overhead. So about 16–18 GB for one long conversation; a 24 GB card fits it with room for a few users.

*Follow-up:* "And in int4?" Weights drop to 3.5 GB, leaving much more KV cache space. "And a 70B model?" 140 GB in fp16 (multiple GPUs with tensor parallelism) or about 35 GB in int4.

### ⭐ 32. What is the KV cache?
Stored attention keys and values for all previous tokens, so each new token does not recompute them. It speeds generation but grows with sequence length × number of concurrent sequences, so it limits how many users a GPU can serve.

### ⭐ 33. Explain continuous batching.
The server re-forms the batch at every decoding step: finished sequences leave and waiting requests join immediately. Unlike static batching, GPU slots do not sit idle waiting for the longest answer, so throughput rises and queueing falls. Example: static batch of 10/20/50/200-token answers uses only 280 of 800 slot-steps (35%).

### 34. What is PagedAttention?
vLLM's method of storing the KV cache in small fixed-size blocks allocated on demand, like OS memory pages. It removes the waste of reserving max-length memory per request, fits more concurrent requests, and enables prefix sharing.

### ⭐ 35. How do you serve an open LLM in production?
Use vLLM (or SGLang) in its Docker image on a GPU instance: `vllm serve <model> --max-model-len ... --gpu-memory-utilization 0.9`. It exposes an OpenAI-compatible API, so clients use the `openai` SDK with a different `base_url`. Add autoscaling on queue length, warm replicas, weights cached locally, and monitoring of TTFT and KV cache usage.

### 36. What is quantization and its trade-off?
Storing weights in fewer bits (fp16 → int8 → int4). Memory drops 2–4×, bigger models fit, more KV cache space, often faster decoding. The cost is some quality loss, which you measure on your eval set. Common formats: AWQ, GPTQ, FP8, GGUF.

### 37. What is the difference between prefill and decode?
Prefill processes the whole prompt in parallel (compute-bound) and sets time to first token. Decode generates one token per step (memory-bandwidth-bound) and sets tokens per second. Long prompts hurt TTFT; long outputs hurt total time.

### 38. How should you autoscale an LLM server?
Not on GPU utilisation, which looks high even when more requests could fit. Scale on waiting requests, running requests per replica, KV cache usage, or p95 TTFT. Keep warm replicas because cold starts are slow.

## Experiment tracking and model registry

### ⭐ 39. Why use experiment tracking? What do you log?
For reproducibility and fair comparison. Log parameters (hyperparameters, seed, data split), metrics (validation scores, curves, latency), tags (Git commit, data version), and artifacts (model with environment, plots, eval tables). ([Experiment Tracking and Model Registry](/interview/mlops-deployment/experiment-tracking-and-model-registry))

### ⭐ 40. What is a model registry? How do you promote and roll back?
A catalogue of named models with immutable versions linked to their runs, plus aliases and tags. Register a candidate as a new version, mark it challenger, test it (offline eval, shadow, canary), then move the `champion` alias; the API loads `models:/name@champion`. Rollback = move the alias back.

### 41. MLflow stages vs aliases?
Stages (Staging, Production, Archived) were fixed labels and are deprecated. Aliases are flexible named pointers like champion and challenger that you can move freely.

### 42. How do you version data?
DVC: data stored in remote storage, a small pointer file with its hash committed to Git, `dvc pull` gets the matching data for any commit. Log the data hash in the MLflow run for full lineage.

### 43. How do you make training reproducible?
Pin library versions (ideally train in a container), fix seeds, version data, record the Git commit and all hyperparameters, keep preprocessing inside the saved pipeline, and log everything to the tracker.

## CI/CD and testing

### ⭐ 44. How do you test ML code?
Unit tests for preprocessing and helpers, data tests for schema and ranges, model quality gates with thresholds on a fixed held-out set, behavioural tests (invariance, directional, minimum functionality), and API tests with FastAPI's `TestClient`. ([CI/CD and Testing for AI](/interview/mlops-deployment/ci-cd-and-testing-for-ai))

### ⭐ 45. How do you test LLM applications in CI?
Mock the LLM in unit tests for speed and determinism. For quality, run a golden eval set with low temperature, score each case (required facts, LLM-as-judge, refusal and injection checks), and fail the pipeline if the pass rate is below a threshold or below the production prompt. Run a subset on each PR and the full set nightly.

*Follow-up:* "How do you handle non-determinism?" Thresholds instead of exact matches, low temperature, multiple samples for flaky cases, and tracking scores over time.

### 46. Describe a CI/CD pipeline for a model service.
On pull request: lint, unit/data/model/API tests, eval gate. On merge to main: build the Docker image tagged with the commit SHA, push to a registry, deploy to staging, smoke test, then canary to production with automatic rollback rules.

### ⭐ 47. Compare deployment strategies: rolling, blue-green, canary, shadow.
Rolling replaces instances gradually; cheap, medium rollback. Blue-green runs a full new copy and switches all traffic at once; instant rollback, double resources. Canary sends a small share to the new version and grows it while watching metrics; limits blast radius. Shadow copies traffic to the new version without showing its output; zero user risk, good for validating ML models.

### 48. Canary vs A/B test?
Canary checks safety (errors, latency) over hours with automatic rollback. A/B testing compares business outcomes (conversion, retention) over days or weeks with statistical significance. They answer different questions: "is it safe?" vs "is it better?".

### 49. Canary: stable error rate 0.5%, canary 1.2%, rule "≤ 2× stable". Decision?
2 × 0.5% = 1.0%; 1.2% > 1.0%, so roll back. Decide and automate rules before the release.

### 50. Why tag images with the Git SHA?
Immutable and traceable: you know exactly which code runs everywhere, and rollback means redeploying the previous SHA. `latest` is mutable and hides what is deployed.

## Monitoring, cost and caching

### ⭐ 51. What do you monitor for an ML or LLM service?
Service: request rate, error rate, p50/p95/p99 latency, TTFT. Model/data: input drift, prediction distribution. Quality: accuracy on delayed labels, user feedback, judge scores on sampled traffic. LLM: tokens and cost per request/user/feature, cache hit rate, guardrail triggers. Infra: CPU, memory, GPU, KV cache. ([Monitoring, Cost and Caching](/interview/mlops-deployment/monitoring-cost-and-caching))

### ⭐ 52. Why p95/p99 rather than average latency? Compute from samples.
Averages are skewed by outliers and hide slow users. For 120, 135, 150, 160, 180, 200, 220, 250, 400, 900 ms: mean 271.5 ms (higher than 8 of 10 requests), nearest-rank p50 = 180 ms, p95 = p99 = 900 ms. SLOs are written in percentiles.

*Follow-up:* "Why does tail latency matter more with many calls?" If a page makes 10 calls, the chance at least one exceeds p99 is 1 − 0.99¹⁰ ≈ 9.6%.

### 53. How do you detect drift? Explain PSI.
Compare feature and prediction distributions between training and production. PSI = Σ (actual − expected) × ln(actual ÷ expected) over bins; below 0.1 stable, 0.1–0.25 moderate, above 0.25 major. Also KS and chi-square tests. Confirm with quality metrics when labels arrive.

### 54. What do you log for each LLM call?
Request id, user (hashed), route, prompt version, model, input/output/cached tokens, latency and TTFT, cost, retrieved document ids, status, and user feedback. Redact PII and set retention limits.

### ⭐ 55. How do you track and reduce LLM cost?
Cost = input tokens × input price + output tokens × output price (per million). Track per user, feature, model and prompt version. Reduce with prompt caching, response and semantic caching, fewer or shorter retrieved chunks, shorter prompts, `max_tokens`, routing easy queries to smaller models, batch APIs for offline work, and per-user budgets.

### ⭐ 56. What is prompt caching?
The provider reuses the processed state of an identical prompt prefix across requests, cutting input cost and TTFT. Put static instructions, documents and tools first and variable content last; keep the prefix byte-identical. The answer is still generated fresh.

### ⭐ 57. What is semantic caching? What can go wrong?
Store answers keyed by question embeddings; return a cached answer when a new question's cosine similarity exceeds a threshold. Risks: false hits on questions that differ in a key detail (phone vs laptop), stale answers after document updates, leaking personal answers. Mitigate with strict thresholds, namespaces/filters, TTLs, and no caching of personalised queries.

### 58. How do you handle LLM provider outages or rate limits?
Timeouts; retries with exponential backoff and jitter for 429/5xx only; fallback to another model or provider (OpenAI-compatible self-hosted model helps); circuit breaker; queue non-urgent work; graceful messages for users.

### 59. What is an SLO and an error budget?
An SLO is a target like 99.5% availability or p95 < 2 s. The error budget is the allowed failure: 0.5% of 43,200 minutes in 30 days = 216 minutes. When it is almost used, slow down risky releases.

### 60. How would you debug a hallucination report from a user?
Find the trace by request id; inspect retrieved chunks, prompt version, full prompt, model settings and output. Classify the failure: retrieval missed the document, the prompt allowed guessing, or the model ignored context. Fix it and add the case to the golden set.

## Scenario and design questions

### ⭐ 61. Walk me through deploying your RAG chatbot to production.
FastAPI with `/chat/stream` (SSE) and `/documents` (queued ingestion), Pydantic validation, API-key or JWT auth. Docker image tagged with the commit SHA; compose locally with Qdrant and Redis. CI: tests with a mocked LLM plus a golden-set eval gate. Deploy on Cloud Run or ECS with secrets from a secret manager, min/max instances, and a canary. Monitor p95 TTFT, cost per query, cache hit rate, faithfulness on sampled traffic. ([Project: RAG PDF Chatbot](/interview/ai-projects/project-rag-pdf-chatbot))

### 62. Your model's accuracy dropped 8% last month. What do you do?
First rule out data problems: schema changes, nulls, preprocessing bugs. Then check input drift (PSI by feature) and the prediction distribution. If inputs shifted or the concept changed, retrain on recent data, compare with the champion on a fresh held-out set, release via shadow or canary, and add a drift alert so it is caught earlier next time.

### 63. Your LLM bill doubled this week. How do you investigate?
Break cost down by feature, user, model and prompt version from the logs. Look for a new prompt version with more tokens, a bug causing retries or loops (agents), a single user or leaked key with abnormal usage, or a cache hit rate drop after a deploy. Fix the cause, then add per-user budgets and cost alerts.

### 64. Users say the chatbot feels slow. What do you check?
Measure TTFT and total time at p50/p95 and look at traces: is the time in retrieval, reranking, the LLM prefill (long prompts) or decode (long answers)? Fixes: stream responses, shrink context, prompt caching, smaller model for simple queries, semantic cache, more replicas if requests are queueing.

### 65. How would you roll out a new prompt safely?
Version it in Git, run the golden eval set in CI and compare with the current prompt, then release behind a feature flag or canary to a small share of users. Watch quality signals (feedback, judge scores), cost and latency, and roll back by switching the flag.

### 66. You must serve 50 concurrent users with 4,096-token contexts on one 24 GB GPU using an 8B model. Is it possible?
With GQA (128 KB per token), each user needs 4,096 × 128 KB = 512 MB of KV cache, so 50 users need about 25 GB, on top of weights. fp16 weights (16 GB) leave about 6 GB, so roughly 11 users fit. int4 weights (4 GB) leave about 18 GB, so roughly 33 users. To reach 50: shorter max context, a second GPU, or rely on most users not using full context at once (vLLM allocates as needed), and measure.

## Last-day checklist

- [ ] I can explain the ML lifecycle and five reasons models fail in production.
- [ ] I can write a FastAPI endpoint with Pydantic v2 models and a streaming SSE endpoint from memory.
- [ ] I can explain every line of a Dockerfile and the layer-caching rule.
- [ ] I can write a compose file with an app, a vector DB and Redis.
- [ ] I can estimate GPU memory (weights + KV cache + overhead) on a whiteboard.
- [ ] I can explain continuous batching and why vLLM exists.
- [ ] I can describe MLflow tracking, the registry and aliases.
- [ ] I can sketch a GitHub Actions pipeline with an eval gate.
- [ ] I can compare blue-green, canary and shadow deployments.
- [ ] I can compute p50/p95/p99, PSI and token cost by hand.
- [ ] I can explain prompt caching vs semantic caching and their risks.

**Next:** continue with [The AI System Design Framework](/interview/ai-system-design/the-ai-system-design-framework), or go back to the [MLOps & Deployment book home](/interview/mlops-deployment).
