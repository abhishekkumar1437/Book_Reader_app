---
title: Docker for ML and Compose
part: Serving Code
summary: Small and fast ML images with slim bases and multi-stage builds, GPU containers, where to put model weights, a docker-compose.yml running the API with Qdrant and Redis, and handling environment variables and secrets safely.
---

ML images have special problems. PyTorch alone can be several gigabytes, models can be tens of gigabytes, GPUs need special drivers, and a real AI app is never one container: it needs a vector database for retrieval and Redis for caching. This chapter shows how to keep ML images small, how to run on GPUs, and how to start a whole multi-container app with one command using Docker Compose. You will use exactly this setup in [Project: RAG PDF Chatbot](/interview/ai-projects/project-rag-pdf-chatbot) and the [capstone](/interview/ai-projects/capstone-full-stack-ai-app).

> **In simple words:** Keep ML images small (slim base, multi-stage build, CPU-only wheels when you have no GPU). Keep big model files out of the image when they change often. Use Docker Compose to describe "my API + vector DB + Redis" in one YAML file. Never bake secrets into images.

## Why ML images get huge

A reminder: an **image** is the frozen package; a **container** is it running (see [Docker Basics](/interview/mlops-deployment/docker-basics)).

Big images are slow to build, slow to push, slow to pull on every new server, and slow to scale up. Where the size comes from:

| Source | Typical size (order of magnitude) | How to shrink |
|---|---|---|
| Full `python:3.12` base | around 1 GB | Use `python:3.12-slim` (around 150 MB) |
| Compilers (`build-essential`) | hundreds of MB | Multi-stage build: compile in stage 1, copy only results |
| PyTorch with CUDA | several GB | Use the CPU-only wheel if you do not need a GPU |
| Model weights | 100 MB (BERT-size) to 100+ GB (big LLMs) | Download at start into a volume, or mount from storage |
| pip cache, apt lists | tens to hundreds of MB | `--no-cache-dir`, `rm -rf /var/lib/apt/lists/*` |
| Your data folder | anything | `.dockerignore` |

These sizes change between versions; check with `docker images` and `docker history`.

### The CPU-only PyTorch trick

The default `pip install torch` on Linux downloads a build with CUDA (GPU) libraries included. If your container will only run on CPU (for example, a small embedding model on Cloud Run), install the CPU wheel instead. It is several times smaller.

```text
# requirements.txt
--extra-index-url https://download.pytorch.org/whl/cpu
torch
sentence-transformers
fastapi[standard]
```

> **Common mistake:** Shipping a multi-gigabyte CUDA PyTorch image to a CPU-only server. It works, but every deploy pulls gigabytes it never uses.

## Multi-stage builds

Some Python packages need a C compiler to install. But you do not need the compiler to *run* the app. A **multi-stage build** uses one stage (with compilers) to build, and a second clean stage that copies only the finished result.

```dockerfile
# syntax=docker/dockerfile:1

# ---------- Stage 1: builder (has compilers) ----------
FROM python:3.12-slim AS builder
RUN apt-get update \
 && apt-get install -y --no-install-recommends build-essential \
 && rm -rf /var/lib/apt/lists/*
RUN python -m venv /opt/venv                      # install into a virtualenv we can copy
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---------- Stage 2: runtime (no compilers) ----------
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PATH="/opt/venv/bin:$PATH"
COPY --from=builder /opt/venv /opt/venv           # only the installed packages come across
WORKDIR /app
COPY . .
RUN useradd --create-home appuser
USER appuser
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

The final image has no `build-essential`, no apt cache, nothing from stage 1 except `/opt/venv`. Stage 1 is thrown away.

> **Interview tip:** "Multi-stage builds separate build-time dependencies from runtime dependencies, so the final image is smaller and has a smaller attack surface." Attack surface means fewer programs an attacker could misuse.

| Base image choice | Size | Notes |
|---|---|---|
| `python:3.12` | Large | Has compilers; fine for a builder stage |
| `python:3.12-slim` | Small | Best default for ML APIs |
| `python:3.12-alpine` | Smallest | Uses musl instead of glibc; many ML wheels (numpy, torch) do not support it well, so builds are slow or fail. Avoid for ML. |
| `nvidia/cuda:<ver>-runtime-ubuntu<ver>` | Large | GPU runtime libraries; for GPU inference |
| `nvidia/cuda:<ver>-devel-...` | Very large | Includes CUDA compiler; only to build custom kernels |
| Vendor images (`vllm/vllm-openai`, `pytorch/pytorch`) | Large | Ready-made; versions already match |

## GPU containers

A container shares the host kernel, and the same idea applies to GPUs: the **NVIDIA driver** lives on the host, and the container brings the **CUDA libraries** (the toolkit programs use to talk to the GPU). The **NVIDIA Container Toolkit** installed on the host lets Docker pass GPUs into containers.

Three rules:

1. The host needs an NVIDIA GPU, the NVIDIA driver, and the NVIDIA Container Toolkit.
2. The host driver must be new enough for the CUDA version inside the image. (A newer driver runs older CUDA; not the other way around.)
3. You must ask for GPUs when you run: `--gpus all`.

```bash
# Check that Docker can see the GPU
docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi
```

```text
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 550.xx      Driver Version: 550.xx      CUDA Version: 12.4       |
|  GPU  Name        ...  Memory-Usage                                         |
|   0   NVIDIA L4   ...      0MiB / 23034MiB                                  |
+-----------------------------------------------------------------------------+
```

(Your driver version, GPU and memory will differ.)

A simple GPU inference Dockerfile:

```dockerfile
FROM nvidia/cuda:12.4.1-runtime-ubuntu22.04
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt   # torch wheel that matches CUDA 12.x
COPY . .
CMD ["python3", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

In practice, for LLMs you rarely write this yourself. You use a ready-made server image like `vllm/vllm-openai`, covered in [Serving Models](/interview/mlops-deployment/serving-models).

> **Common mistake:** "CUDA error: no kernel image is available" or "driver version is insufficient". The image's CUDA version is newer than what the host driver supports. Use an image with an older CUDA, or update the host driver.

## Where do the model weights go?

Three options, each with trade-offs:

| Option | How | Good | Bad |
|---|---|---|---|
| **Bake into the image** | `COPY model.joblib .` | Simple; image is fully self-contained; version locked with code | Huge images if model is big; rebuild for each new model |
| **Download at startup** | App pulls from S3 / Hugging Face / MLflow registry in `lifespan` | Small image; swap models without rebuild | Slow cold start; needs network and credentials |
| **Mount a volume** | `-v models:/models` or a cloud file share | Fast restarts; shared between containers | More infrastructure; must manage what is in the volume |

Rule of thumb: small classical models (a few MB) → bake in. LLMs and large models → download once into a cached volume, or use a model server that handles it.

### Worked example: cold start time

You run an LLM server whose weights are 15 GB. Your servers can download at about 100 MB/s (0.1 GB/s) from storage.

- Download time per new server = 15 ÷ 0.1 = **150 seconds**, before loading into the GPU even starts.
- If autoscaling adds 4 new servers during a traffic spike, each one waits about 150 s. Users wait or get errors for 2.5 minutes.
- With weights in a pre-filled volume or a node-local cache, download time is about 0, and only the load into GPU memory remains.

This is why big-model autoscaling is slow, and why teams keep a minimum number of warm replicas.

## Docker Compose: many containers, one file

A RAG app needs at least: your **API**, a **vector database** (stores embeddings for search; see [Vector Databases](/interview/llms-genai/vector-databases)), and **Redis** (an in-memory key-value store used for caching, rate limits and queues). Starting each with a long `docker run` command and wiring their networks by hand is painful.

**Docker Compose** describes all services in one YAML file, `compose.yaml` (the older name `docker-compose.yml` also works). One command starts everything.

> **Real-life example:** A compose file is a wedding plan. It lists the caterer, the decorator and the band, when each must arrive, and how they contact each other. Then one phone call ("`docker compose up`") starts the whole event.

### The full compose file

```yaml
# compose.yaml  (the top-level "version:" key is obsolete; do not add it)
services:
  app:
    build: .                                  # build from the Dockerfile in this folder
    image: ai-service:dev
    ports:
      - "8000:8000"                           # host:container
    env_file: .env                            # non-secret settings + local dev keys
    environment:
      QDRANT_URL: http://qdrant:6333          # "qdrant" = service name = hostname
      REDIS_URL: redis://redis:6379/0
      LLM_MODEL: claude-sonnet-5-5
    secrets:
      - anthropic_api_key                     # appears as /run/secrets/anthropic_api_key
    depends_on:
      qdrant:
        condition: service_started
      redis:
        condition: service_healthy            # wait until Redis passes its healthcheck
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 2g                          # stop a memory leak from eating the laptop

  qdrant:
    image: qdrant/qdrant:latest               # pin a specific version in real projects
    ports:
      - "6333:6333"                           # REST API + web dashboard at /dashboard
    volumes:
      - qdrant_data:/qdrant/storage           # vectors survive restarts
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: ["redis-server", "--appendonly", "yes"]   # save data to disk too
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]      # healthy when it answers PONG
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

volumes:
  qdrant_data:
  redis_data:

secrets:
  anthropic_api_key:
    file: ./secrets/anthropic_api_key.txt     # this file is in .gitignore
```

What to notice:

- **Service names are hostnames.** Compose creates a private network. Inside it, the app reaches Qdrant at `http://qdrant:6333`, not `localhost`. Inside a container, `localhost` means *that same container*.
- **Only publish what you must.** Redis has no `ports:`, so only other containers can reach it, not the outside world. Qdrant's port is published only so you can open its dashboard during development.
- **Named volumes** (`qdrant_data`, `redis_data`) keep data when containers are recreated.
- **`depends_on` with `condition: service_healthy`** waits for Redis to pass its healthcheck before starting the app. Plain `depends_on` only waits for the container to *start*, not to be *ready*. Your app should still retry connections on startup, because services can restart later too.

If you prefer Chroma over Qdrant, replace the `qdrant` service with the `chromadb/chroma` image, which listens on port 8000 (so publish it as e.g. `"8001:8000"` to avoid clashing with the app) and stores data in a mounted volume. Check the current image docs for the data path, as it has changed between versions.

### How the app uses the other services

```python
# deps.py — connect using env vars set in compose
import os
from pathlib import Path

import redis.asyncio as redis
from qdrant_client import AsyncQdrantClient

def read_secret(name: str) -> str:
    # Prefer a Docker secret file; fall back to an env var (handy outside Docker)
    path = Path(f"/run/secrets/{name}")
    if path.exists():
        return path.read_text().strip()
    return os.environ[name.upper()]                  # e.g. ANTHROPIC_API_KEY

qdrant = AsyncQdrantClient(url=os.environ["QDRANT_URL"])
cache = redis.Redis.from_url(os.environ["REDIS_URL"], decode_responses=True)
ANTHROPIC_API_KEY = read_secret("anthropic_api_key")
# then: anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
```

### Running it

```bash
mkdir -p secrets && echo "sk-ant-..." > secrets/anthropic_api_key.txt
docker compose up -d --build
docker compose ps
```

```text
NAME             IMAGE                 SERVICE   STATUS                    PORTS
proj-app-1       ai-service:dev        app       Up 5 seconds              0.0.0.0:8000->8000/tcp
proj-qdrant-1    qdrant/qdrant:latest  qdrant    Up 12 seconds             0.0.0.0:6333->6333/tcp
proj-redis-1     redis:7-alpine        redis     Up 12 seconds (healthy)   6379/tcp
```

(Names start with your folder name; exact columns vary by Docker version.)

### Compose commands

| Command | What it does |
|---|---|
| `docker compose up -d` | Create and start all services in the background |
| `docker compose up -d --build` | Rebuild images first (after code changes) |
| `docker compose ps` | Status of each service |
| `docker compose logs -f app` | Follow logs of one service |
| `docker compose exec app sh` | Shell inside the running app container |
| `docker compose restart app` | Restart one service |
| `docker compose stop` | Stop containers, keep them |
| `docker compose down` | Stop and remove containers and network (volumes kept) |
| `docker compose down -v` | Also delete volumes — **your vector data is gone** |
| `docker compose config` | Print the final merged config (great for debugging env vars) |
| `docker compose pull` | Pull newer versions of images |

> **Common mistake:** Running `docker compose down -v` to "clean up" and then wondering why all ingested PDFs disappeared from the vector DB. `-v` deletes named volumes.

### Compose in development vs production

Compose is perfect for local development and for a single small server (a portfolio demo on one VM). For production at scale, teams move to a managed container platform (Cloud Run, ECS, Kubernetes) and a managed database/cache. The ideas are the same: images, env vars, health checks, volumes, service discovery by name.

A handy pattern is a `compose.override.yaml` for development only. Compose merges it automatically:

```yaml
# compose.override.yaml — dev only: live code reload
services:
  app:
    volumes:
      - ./:/app                              # bind mount: edits appear without rebuild
    command: ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

## Environment variables and secrets

**Configuration** (which model, which DB URL, log level) changes between environments. The **twelve-factor app** rule says: keep config in **environment variables**, not in code. Then the same image runs in dev, staging and production with different settings.

**Secrets** are config that must stay private: API keys, DB passwords. They need extra care.

| Method | Safe? | Use |
|---|---|---|
| Hard-coded in code | No | Never |
| `ENV API_KEY=...` in Dockerfile | No — stored in the image layer forever | Never |
| `.env` file + `env_file:` | OK locally if `.env` is in `.gitignore` and `.dockerignore` | Local development |
| `-e KEY=$KEY` at run time | OK; visible in `docker inspect` | Quick tests, CI |
| Docker / compose secrets (`/run/secrets/...`) | Better; file not in env or image | Single-server deployments |
| Cloud secret manager (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault) | Best | Production; platform injects at runtime, access is logged and rotatable |

Reading config cleanly in Python with **pydantic-settings**:

```python
# settings.py
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", secrets_dir="/run/secrets")

    llm_model: str = "claude-sonnet-5-5"
    qdrant_url: str = "http://localhost:6333"
    redis_url: str = "redis://localhost:6379/0"
    anthropic_api_key: SecretStr            # required; read from env or /run/secrets file

settings = Settings()
print(settings.anthropic_api_key)           # Output: ********** (hidden in logs)
key = settings.anthropic_api_key.get_secret_value()   # the real value, only where needed
```

`SecretStr` prints as stars, so a stray `print(settings)` in logs does not leak the key. If the variable is missing, the app fails at startup with a clear error instead of failing on the first user request.

> **Remember:** If a secret was ever committed to Git or baked into a pushed image, treat it as leaked. Rotate it (create a new key, delete the old one). Deleting the commit is not enough.

> **Interview tip:** Asked "how do you manage secrets?", answer in three steps: "Never in code or images. Env vars or a secrets file locally, excluded from Git. A cloud secret manager in production, injected at runtime, with least-privilege access and rotation."

## Key terms

| Term | Simple meaning |
|---|---|
| Slim image | Base image with extras removed (`python:3.12-slim`) |
| Multi-stage build | Build in one stage, copy results into a clean final stage |
| Attack surface | Programs/libraries an attacker could misuse; fewer is safer |
| CPU-only wheel | A PyTorch build without CUDA libraries, much smaller |
| NVIDIA driver | Host software that controls the GPU |
| CUDA | NVIDIA's toolkit/libraries for running code on GPUs |
| NVIDIA Container Toolkit | Lets Docker give containers access to GPUs |
| `--gpus all` | Run flag that attaches all GPUs to a container |
| Cold start | Time for a new instance to become ready (pull, download, load) |
| Docker Compose | Tool to define and run multi-container apps from YAML |
| Service | One container definition in a compose file |
| Service discovery | Containers reach each other by service name |
| Healthcheck | A command that tells Docker if a service is ready |
| `depends_on` | Start order between services, optionally waiting for health |
| Named volume | Docker-managed storage that outlives containers |
| Environment variable | Key-value config given to a process at start |
| Secret | Private config like an API key |
| Secret manager | Cloud service that stores and injects secrets safely |
| pydantic-settings | Library that loads typed settings from env/files |
| Twelve-factor app | Guidelines for cloud apps, e.g. config in env vars |

## Interview questions

**How do you reduce the size of a Docker image for an ML service?**
Use `python:3.12-slim`, a multi-stage build so compilers stay out of the final image, `--no-cache-dir` for pip, clean apt lists in the same `RUN`, a `.dockerignore`, and CPU-only PyTorch wheels when there is no GPU. Keep large model weights outside the image if they change often.

**Why avoid Alpine for Python ML images?**
Alpine uses musl libc, while most prebuilt Python wheels (numpy, scipy, torch) target glibc. Pip may then compile from source, which is slow and can fail, and the result can even be bigger. Slim Debian images are the practical choice.

**How do GPUs work with Docker?**
The host has the NVIDIA driver and the NVIDIA Container Toolkit; the image contains CUDA libraries. You run with `--gpus all` or a GPU reservation in compose. The host driver must support the image's CUDA version.

**Should model weights be inside the image?**
For small models, yes: it is simple and versions code and model together. For large models, usually no: images become huge and slow to pull. Download at startup from a registry or object storage into a cached volume, or mount shared storage, and keep a version pin in config.

**In docker compose, why can't the app connect to `localhost:6333` for Qdrant?**
Inside a container, `localhost` is the container itself. Compose puts services on a shared network where each service name is a hostname, so the app should use `http://qdrant:6333`.

**What is the difference between `depends_on` and a healthcheck condition?**
Plain `depends_on` only controls start order; the dependency may not be ready yet. With `condition: service_healthy`, compose waits until the dependency's healthcheck passes. The app should still retry connections, because services can restart at any time.

**How do you handle secrets in containers?**
Never in code or the Dockerfile, since image layers keep them forever. Locally use a git-ignored `.env` or compose secrets mounted at `/run/secrets`. In production use a cloud secret manager that injects them at runtime, with least-privilege access and rotation.

**What happens to data in a container when you redeploy?**
Anything in the container's writable layer is lost when the container is replaced. Persistent data must live in volumes or, better in production, in managed services like a hosted vector DB, Redis or object storage.

**Why is autoscaling an LLM server slow?**
New instances must pull a large image, download many gigabytes of weights, and load them into GPU memory before they can serve. For 15 GB at 100 MB/s that is 150 seconds just to download. Teams keep warm replicas, cache weights on nodes, and scale ahead of predicted traffic.

## Try it yourself

1. **Write a compose file** for your FastAPI app plus Redis only. The app should read `REDIS_URL` and must start only after Redis is healthy.
   *Hint:* Copy the `redis` service and the `depends_on` block above.
2. **Find three problems** in this Dockerfile:
   ```dockerfile
   FROM python:3.12
   ENV OPENAI_API_KEY=sk-123abc
   COPY . .
   RUN pip install torch fastapi uvicorn
   CMD uvicorn main:app
   ```
   *Hint:* Think about secrets, size, caching, versions, host, and the CMD form.
3. **Cold start math.** Weights are 28 GB; download speed is 250 MB/s; loading into GPU takes 40 s. How long until a new replica is ready? If traffic doubles in 2 minutes, will it be ready in time?

### Answers

1.
```yaml
services:
  app:
    build: .
    ports: ["8000:8000"]
    environment:
      REDIS_URL: redis://redis:6379/0
    depends_on:
      redis:
        condition: service_healthy
  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      retries: 5
```
2. Problems: (a) the API key is baked into an image layer — it is leaked to anyone with the image; pass it at runtime. (b) Full `python:3.12` base plus default CUDA torch makes a huge image; use slim and the CPU wheel if no GPU. (c) `COPY . .` before `pip install` breaks layer caching. (d) No version pins and no `requirements.txt`. (e) Uvicorn listens on `127.0.0.1` by default; add `--host 0.0.0.0`. (f) Shell-form `CMD` means signals go to a shell, not Uvicorn; use exec form. (g) Runs as root; no `.dockerignore`. Any three are enough.
3. 28 GB = 28,000 MB. 28,000 ÷ 250 = 112 s to download. 112 + 40 = **152 s** ≈ 2.5 minutes. Traffic doubles in 120 s, so the replica is about 32 s late. You need warm spare replicas or earlier (predictive) scaling.

**Next:** [Cloud for AI](/interview/mlops-deployment/cloud-for-ai)
