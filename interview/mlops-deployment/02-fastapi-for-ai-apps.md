---
title: FastAPI for AI Apps
part: Serving Code
summary: Build a complete FastAPI service that serves a scikit-learn model and a streaming LLM endpoint, with Pydantic v2 validation, async, background tasks, API-key auth, and curl examples with real output.
---

A model inside a notebook helps nobody. To be useful, other programs (a website, a mobile app, another service) must be able to send it data and get an answer back over HTTP. FastAPI is the most common Python tool for this in AI teams. In this chapter you will build one complete service with a classic ML endpoint and an LLM endpoint that streams its answer word by word, exactly like ChatGPT or Claude.

> **In simple words:** FastAPI turns a Python function into a web address. Pydantic checks that the data coming in has the right shape. Uvicorn is the server that runs it. Together they are the standard way to put a model behind an API.

## Why an API, and why FastAPI

An **API** (application programming interface) here means a set of web addresses (**endpoints**) that accept a request and return a response, usually as **JSON** (a text format like `{"label": "spam"}`). The client does not need to know Python or have the model. It just sends HTTP.

**FastAPI** is a Python web framework. It became the default for ML because:

| Feature | Why it matters for AI apps |
|---|---|
| Type hints drive everything | You write `age: int`, FastAPI validates it. Less code, fewer bugs. |
| Pydantic validation | Bad input gets a clear 422 error instead of crashing the model. |
| Async support | One server can wait on many slow LLM calls at the same time. |
| Automatic docs | Open `/docs` and you get an interactive page to try every endpoint. |
| Streaming responses | Send LLM tokens as they are generated. |
| Fast enough | Built on Starlette; the model is almost always the slow part, not FastAPI. |

| Framework | Use when |
|---|---|
| FastAPI | Default for ML/LLM APIs. Typed, async, auto docs. |
| Flask | Old projects, very simple sync apps. No built-in validation. |
| Django | Full websites with admin, ORM, users. Heavy for a model API. |
| Streamlit / Gradio | Quick demo UI for humans, not an API for other programs. |

Install (in a virtual environment):

```bash
pip install "fastapi[standard]" scikit-learn joblib anthropic httpx
```

`fastapi[standard]` includes **Uvicorn** (the server that actually listens on a port and runs your app) and the `fastapi` command-line tool.

> **Remember:** Your code is the *app*. Uvicorn is the *server*. `fastapi dev main.py` or `uvicorn main:app` starts the server with your app.

## Routes, path and query parameters

A **route** connects an HTTP method + path to a Python function. The decorator `@app.get("/health")` means "when someone sends GET to `/health`, run this function". (If decorators are new, see [Decorators](/interview/python/decorators).)

```python
# hello.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")                      # GET http://localhost:8000/health
def health():
    return {"status": "ok"}              # dict is converted to JSON automatically

@app.get("/items/{item_id}")             # {item_id} is a path parameter
def get_item(item_id: int, q: str | None = None):   # q is a query parameter: ?q=...
    return {"item_id": item_id, "q": q}
```

Run it and call it:

```bash
fastapi dev hello.py          # development mode, auto-reload on file save
curl "http://localhost:8000/items/42?q=phone"
```

```text
{"item_id":42,"q":"phone"}
```

If you call `/items/abc`, FastAPI returns status **422** because `abc` is not an `int`. You wrote zero validation code.

HTTP methods you will use:

| Method | Meaning | AI example |
|---|---|---|
| GET | Read, no body | `/health`, `/models` |
| POST | Send data, get result | `/predict`, `/chat` |
| PUT/PATCH | Update | Update a prompt template |
| DELETE | Remove | Delete an uploaded document |

Status codes you must know: **200** OK, **201** created, **400** bad request, **401** not authenticated, **403** not allowed, **404** not found, **422** validation failed, **429** too many requests, **500** server bug, **502/503** upstream (e.g. LLM provider) failed or unavailable.

## Pydantic models: the shape of your data

**Pydantic** is a library that checks data against a class you define. FastAPI uses it for request bodies and responses. This guide uses **Pydantic v2** (current since 2023). Its API differs from v1, and many old blog posts still show v1.

```python
from pydantic import BaseModel, Field, ConfigDict

class Applicant(BaseModel):
    model_config = ConfigDict(extra="forbid")   # reject unknown fields (v2 style)

    age: int = Field(ge=18, le=100)             # 18 ≤ age ≤ 100
    monthly_income: float = Field(gt=0, description="In rupees")
    city: str = Field(min_length=2, max_length=50)
    has_loan: bool = False                      # default value → optional field

a = Applicant(age=30, monthly_income=55000, city="Pune")
print(a.model_dump())                 # v2: model_dump() (v1 was .dict())
# Output: {'age': 30, 'monthly_income': 55000.0, 'city': 'Pune', 'has_loan': False}

Applicant(age=15, monthly_income=55000, city="Pune")
# Raises ValidationError: age - Input should be greater than or equal to 18
```

| Pydantic v1 (old) | Pydantic v2 (use this) |
|---|---|
| `class Config:` | `model_config = ConfigDict(...)` |
| `.dict()`, `.json()` | `.model_dump()`, `.model_dump_json()` |
| `parse_obj(...)` | `model_validate(...)` |
| `@validator` | `@field_validator` |
| `schema_extra` | `json_schema_extra` |

> **Common mistake:** Copying `class Config: orm_mode = True` or `.dict()` from an old tutorial. In v2 these give deprecation warnings or errors. In an interview, saying "model_dump in Pydantic v2" shows your knowledge is current.

Notice `monthly_income=55000` became `55000.0`. Pydantic converts compatible types (int → float) by default. This is called **lax mode**. Use `ConfigDict(strict=True)` if you want no conversion.

## Sync vs async: `def` or `async def`?

This is the most asked FastAPI interview question.

FastAPI runs on an **event loop**: one thread that switches between many requests whenever one of them is *waiting* (for the network, a database, an LLM). Waiting on the network is called **I/O-bound** work. Heavy math on the CPU (like `model.predict` on a big matrix) is **CPU-bound**: there is no waiting, the CPU is just busy. (Background: [Async Programming](/interview/python/async-programming) and [Concurrency, Threads, Processes and the GIL](/interview/python/concurrency-threads-processes-gil).)

FastAPI's rule:

- `async def` endpoint → runs directly on the event loop. Fast, but **if you block inside it, every request waits**.
- plain `def` endpoint → FastAPI runs it in a **thread pool**, so a blocking call does not freeze the loop.

| Your endpoint does | Write | Why |
|---|---|---|
| Calls an LLM API with an async client (`AsyncAnthropic`, `httpx.AsyncClient`) | `async def` + `await` | Thousands of requests can wait at once |
| Calls a sync library (`requests`, sync DB driver) | `def` | Thread pool keeps the loop free |
| Runs a small scikit-learn `predict` | `def` | It blocks the CPU; let the thread pool handle it |
| Runs a big model on CPU for seconds | `def` + separate worker process or model server | Threads share the GIL; heavy CPU work needs processes |

> **Real-life example:** The event loop is one waiter in a restaurant. He takes your order, gives it to the kitchen, and serves other tables while your food cooks. If he goes into the kitchen and cooks your biryani himself (blocking work), every other table waits.

> **Common mistake:** Writing `async def` and then calling `time.sleep(2)` or `requests.post(...)` inside it. This blocks the whole server. Use `await asyncio.sleep(2)` and `httpx.AsyncClient`, or make the endpoint a plain `def`.

### Worked example: why async matters for LLM calls

Suppose each LLM call takes 2 seconds, almost all of it waiting for the provider. 100 users send a request at the same moment.

- Sync server with 1 worker and no threads: requests are handled one after another. The last user waits 100 × 2 = **200 seconds**.
- Sync server with a 40-thread pool: 100 ÷ 40 = 2.5, so 3 rounds. The last user waits about 3 × 2 = **6 seconds**.
- Async server: all 100 calls are "in flight" together. Everyone gets an answer in about **2 seconds** (plus small overhead), limited only by the provider's rate limit.

## The complete service

Now the real thing. We will build one app with:

1. `GET /health` — is the service alive and is the model loaded?
2. `POST /predict` — a scikit-learn model (iris flower classifier, chosen because everyone can reproduce it)
3. `POST /chat` — an LLM answer in one piece
4. `POST /chat/stream` — the same LLM answer streamed token by token
5. API-key auth, input validation, background logging

Folder:

```text
ai-service/
├── train.py          # trains and saves model.joblib
├── main.py           # the FastAPI app
├── requirements.txt
└── tests/test_api.py # see the CI/CD chapter
```

### Step 1: train and save the model

```python
# train.py
import joblib
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_iris(return_X_y=True)
pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
pipe.fit(X, y)

# Save the model WITH its metadata, so the API knows class names and version
joblib.dump(
    {"model": pipe, "classes": ["setosa", "versicolor", "virginica"], "version": "1.0.0"},
    "model.joblib",
)
print("saved model.joblib")
```

```bash
python train.py
# Output: saved model.joblib
```

### Step 2: the app

```python
# main.py
import json
import logging
import os
import secrets
import time
from contextlib import asynccontextmanager
from typing import Annotated, AsyncIterator

import anthropic
import joblib
from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, Security
from fastapi.responses import StreamingResponse
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, ConfigDict, Field

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("ai-service")

LLM_MODEL = os.getenv("LLM_MODEL", "claude-sonnet-5-5")
state: dict = {}                                   # holds things loaded once at startup


# ---------- Startup / shutdown ----------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs ONCE when the server starts: load heavy things here, not per request
    state["bundle"] = joblib.load("model.joblib")
    state["llm"] = anthropic.AsyncAnthropic()      # reads ANTHROPIC_API_KEY from env
    log.info("model %s loaded", state["bundle"]["version"])
    yield                                          # the app serves requests here
    await state["llm"].close()                     # runs once on shutdown
    state.clear()


app = FastAPI(title="AI Service", version="1.0.0", lifespan=lifespan)


# ---------- Auth ----------
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def verify_api_key(key: Annotated[str | None, Security(api_key_header)]) -> str:
    expected = os.getenv("APP_API_KEY", "dev-secret")
    # compare_digest takes the same time for any input → no timing attacks
    if key is None or not secrets.compare_digest(key, expected):
        raise HTTPException(status_code=401, detail="Invalid or missing API key")
    return key

Auth = Annotated[str, Depends(verify_api_key)]     # reusable dependency type


# ---------- Schemas ----------
class IrisFeatures(BaseModel):
    model_config = ConfigDict(json_schema_extra={"examples": [
        {"sepal_length": 5.1, "sepal_width": 3.5, "petal_length": 1.4, "petal_width": 0.2}
    ]})
    sepal_length: float = Field(gt=0, lt=10, description="cm")
    sepal_width: float = Field(gt=0, lt=10)
    petal_length: float = Field(gt=0, lt=10)
    petal_width: float = Field(gt=0, lt=10)

class Prediction(BaseModel):
    label: str
    probability: float
    model_version: str

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    max_tokens: int = Field(default=512, ge=1, le=2048)

class ChatResponse(BaseModel):
    answer: str
    input_tokens: int
    output_tokens: int
    latency_ms: int


# ---------- Helpers ----------
def log_prediction(features: dict, label: str, prob: float) -> None:
    # Runs AFTER the response is sent (background task). In real life: write to a DB.
    log.info("prediction features=%s label=%s prob=%.3f", features, label, prob)


# ---------- Endpoints ----------
@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": "bundle" in state}


@app.post("/predict", response_model=Prediction)
def predict(features: IrisFeatures, background: BackgroundTasks, _: Auth):
    # Plain def: scikit-learn is CPU work, FastAPI runs this in a thread pool
    bundle = state["bundle"]
    x = [[features.sepal_length, features.sepal_width,
          features.petal_length, features.petal_width]]
    probs = bundle["model"].predict_proba(x)[0]    # e.g. [0.98, 0.02, 0.00]
    idx = int(probs.argmax())
    label, prob = bundle["classes"][idx], round(float(probs[idx]), 3)
    background.add_task(log_prediction, features.model_dump(), label, prob)
    return Prediction(label=label, probability=prob, model_version=bundle["version"])


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, _: Auth):
    start = time.perf_counter()
    try:
        msg = await state["llm"].messages.create(          # await: frees the event loop
            model=LLM_MODEL,
            max_tokens=req.max_tokens,
            messages=[{"role": "user", "content": req.message}],
        )
    except anthropic.APIStatusError as e:                  # provider returned 4xx/5xx
        raise HTTPException(status_code=502, detail=f"LLM error: {e.status_code}")
    except anthropic.APIConnectionError:
        raise HTTPException(status_code=503, detail="LLM unreachable")
    answer = "".join(block.text for block in msg.content if block.type == "text")
    return ChatResponse(
        answer=answer,
        input_tokens=msg.usage.input_tokens,
        output_tokens=msg.usage.output_tokens,
        latency_ms=int((time.perf_counter() - start) * 1000),
    )


async def sse_tokens(req: ChatRequest) -> AsyncIterator[str]:
    # Server-Sent Events format: each event is "data: <text>\n\n"
    try:
        async with state["llm"].messages.stream(
            model=LLM_MODEL,
            max_tokens=req.max_tokens,
            messages=[{"role": "user", "content": req.message}],
        ) as stream:
            async for text in stream.text_stream:          # small pieces of text
                yield f"data: {json.dumps({'text': text})}\n\n"
        yield "data: [DONE]\n\n"                           # tell the client we finished
    except anthropic.APIError as e:
        # Headers (status 200) were already sent, so report errors as an event
        yield f"event: error\ndata: {json.dumps({'error': type(e).__name__})}\n\n"


@app.post("/chat/stream")
async def chat_stream(req: ChatRequest, _: Auth):
    return StreamingResponse(
        sse_tokens(req),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},  # no proxy buffering
    )
```

`requirements.txt` (pin versions in real projects; check the latest when you start):

```text
fastapi[standard]>=0.115
pydantic>=2.7
scikit-learn>=1.5
joblib>=1.4
anthropic>=0.40
```

Let us walk through the important parts.

**`lifespan`.** The model is loaded once when the server starts, not on every request. Loading a model can take seconds; doing it per request would make every call slow. The code before `yield` runs at startup, the code after runs at shutdown. (The older `@app.on_event("startup")` is deprecated.)

**`Depends` and `Security`.** A **dependency** is a function FastAPI runs before your endpoint. Its return value is passed in. Here `verify_api_key` reads the `X-API-Key` header and raises 401 if it is wrong. Every endpoint that has the `_: Auth` parameter is protected. Dependencies are also used for DB sessions, current user, rate limits.

**`response_model`.** FastAPI checks the output too and removes any extra fields. This stops you from leaking internal data by mistake.

**`BackgroundTasks`.** `background.add_task(...)` runs a function **after** the response has been sent. The user does not wait for the logging.

### Step 3: run and call it

```bash
export ANTHROPIC_API_KEY="sk-ant-..."     # Windows PowerShell: $env:ANTHROPIC_API_KEY="sk-ant-..."
export APP_API_KEY="dev-secret"
fastapi dev main.py                        # or: uvicorn main:app --reload --port 8000
```

```text
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:ai-service:model 1.0.0 loaded
INFO:     Application startup complete.
```

**Health check:**

```bash
curl http://localhost:8000/health
```

```text
{"status":"ok","model_loaded":true}
```

**Prediction:**

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-secret" \
  -d '{"sepal_length": 5.1, "sepal_width": 3.5, "petal_length": 1.4, "petal_width": 0.2}'
```

```text
{"label":"setosa","probability":0.98,"model_version":"1.0.0"}
```

(The exact probability can differ slightly with your scikit-learn version. Setosa is easy, so it will be close to 1.)

**Wrong API key:**

```bash
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" \
  -H "X-API-Key: wrong" -d '{"sepal_length": 5.1, "sepal_width": 3.5, "petal_length": 1.4, "petal_width": 0.2}'
```

```text
{"detail":"Invalid or missing API key"}
```

**Invalid input** (negative length):

```bash
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" \
  -H "X-API-Key: dev-secret" -d '{"sepal_length": -1, "sepal_width": 3.5, "petal_length": 1.4, "petal_width": 0.2}'
```

```text
{"detail":[{"type":"greater_than","loc":["body","sepal_length"],"msg":"Input should be greater than 0","input":-1,"ctx":{"gt":0.0}}]}
```

Status 422. The error says exactly which field failed and why. The model never ran.

**LLM, one piece:**

```bash
curl -X POST http://localhost:8000/chat -H "Content-Type: application/json" \
  -H "X-API-Key: dev-secret" -d '{"message": "Explain Docker in one sentence.", "max_tokens": 100}'
```

```text
{"answer":"Docker packages an application and everything it needs into a container so it runs the same way on any machine.","input_tokens":14,"output_tokens":24,"latency_ms":1180}
```

(LLM text, token counts and latency will differ on every call.)

**LLM, streaming.** The `-N` flag tells curl not to buffer, so you see pieces arrive:

```bash
curl -N -X POST http://localhost:8000/chat/stream -H "Content-Type: application/json" \
  -H "X-API-Key: dev-secret" -d '{"message": "Explain Docker in one sentence."}'
```

```text
data: {"text": "Docker packages"}

data: {"text": " an application and everything"}

data: {"text": " it needs into a container"}

data: {"text": " so it runs the same way on any machine."}

data: [DONE]

```

Open `http://localhost:8000/docs` in a browser. You will see every endpoint, its schema and example, and a "Try it out" button. This page is generated from your type hints and Pydantic models.

> **Interview tip:** When you present a project, open `/docs` live. It shows the interviewer your schemas and validation in ten seconds.

## Streaming with Server-Sent Events

An LLM generates text one **token** (a word piece) at a time. A full answer may take 5–10 seconds. If you wait for the whole answer, the user stares at a blank screen. If you send each piece as soon as it exists, the user sees text after about half a second. The delay until the first piece is called **time to first token (TTFT)**, and it is the latency users feel most.

**Server-Sent Events (SSE)** is a simple standard for a server to push many messages over one HTTP response. The response has content type `text/event-stream`, and each message looks like:

```text
data: some text here

```

(a line starting with `data:` and then a blank line). Optional lines like `event: error` give the event a name. Browsers have a built-in `EventSource` for GET streams; for POST streams, frontends read `fetch()` response bodies.

| Option | Direction | Use for |
|---|---|---|
| Normal JSON response | Server → client, once | Classic predictions, short LLM answers |
| SSE (`StreamingResponse`) | Server → client, many messages | LLM token streaming (most common) |
| WebSocket | Both directions, long-lived | Voice agents, live collaboration |

A Python client that reads the stream:

```python
# stream_client.py
import json
import httpx

payload = {"message": "Give 3 tips for a Python interview."}
headers = {"X-API-Key": "dev-secret"}

with httpx.stream("POST", "http://localhost:8000/chat/stream",
                  json=payload, headers=headers, timeout=60) as r:
    for line in r.iter_lines():
        if not line.startswith("data: "):
            continue                        # skip blank lines between events
        data = line.removeprefix("data: ")
        if data == "[DONE]":
            break
        print(json.loads(data)["text"], end="", flush=True)   # print as it arrives
print()
```

> **Common mistake:** Streaming works locally but not in production. Usually a proxy (Nginx, a load balancer) is **buffering** the response and sending it all at the end. The `X-Accel-Buffering: no` header disables buffering in Nginx; other proxies have their own settings.

> **Common mistake:** Trying to return HTTP 500 after streaming has started. Once the first byte is sent, the status code (200) is fixed. Send errors as an event inside the stream, as the code above does.

## The request flow

This is how a request travels through a typical AI service once you add a cache (a fast store of recent answers, covered in [Monitoring, Cost and Caching](/interview/mlops-deployment/monitoring-cost-and-caching)).

<figure>
<svg viewBox="0 0 440 220" width="440" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<rect x="10" y="90" width="70" height="40" rx="8" />
<text x="45" y="115" text-anchor="middle" fill="currentColor" stroke="none">Client</text>
<line x1="80" y1="103" x2="120" y2="103" />
<polygon points="120,103 112,99 112,107" fill="currentColor" />
<line x1="120" y1="120" x2="80" y2="120" />
<polygon points="80,120 88,116 88,124" fill="currentColor" />
<rect x="120" y="75" width="110" height="70" rx="8" />
<text x="175" y="103" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">FastAPI</text>
<text x="175" y="123" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">validate + auth</text>
<polyline points="230,90 260,90 260,40 290,40" />
<polygon points="290,40 282,36 282,44" fill="currentColor" />
<text x="266" y="70" fill="currentColor" stroke="none" font-size="11">1 lookup</text>
<rect x="290" y="20" width="120" height="40" rx="8" />
<text x="350" y="45" text-anchor="middle" fill="currentColor" stroke="none">Cache (Redis)</text>
<text x="350" y="13" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">hit: answer in ~1 ms</text>
<polyline points="230,130 260,130 260,180 290,180" />
<polygon points="290,180 282,176 282,184" fill="currentColor" />
<text x="266" y="158" fill="currentColor" stroke="none" font-size="11">2 miss</text>
<rect x="290" y="160" width="120" height="40" rx="8" />
<text x="350" y="185" text-anchor="middle" fill="currentColor" stroke="none">Model / LLM</text>
<line x1="380" y1="160" x2="380" y2="60" stroke-dasharray="4 3" />
<polygon points="380,60 376,68 384,68" fill="currentColor" />
<text x="388" y="115" fill="currentColor" stroke="none" font-size="11">3 store</text>
</svg>
<figcaption>FastAPI validates and authenticates first, checks the cache, and only calls the expensive model on a miss, storing the result for next time.</figcaption>
</figure>

## Background tasks vs real job queues

FastAPI's `BackgroundTasks` runs work in the same process after the response. It is perfect for small things: writing a log row, sending an email, updating a counter.

It is **not** right for heavy or important jobs, like embedding a 300-page PDF:

- If the server restarts, the task is lost.
- It uses the same CPU as your API, so requests slow down.
- You cannot retry it or see its status.

For those, use a **job queue**: the API puts a job message in a queue (Redis, RabbitMQ, SQS) and returns a `job_id` at once; separate **worker** processes pick up jobs. Tools: Celery, RQ, Arq, Dramatiq. (Queues in general: [Queues and Streams](/interview/system-design/queues-and-streams).)

| Need | Use |
|---|---|
| Tiny work after response (log, notify) | `BackgroundTasks` |
| Heavy work (embed PDFs, batch predictions, fine-tune) | Job queue + workers, return `202 Accepted` + `job_id` |
| Run on a schedule (nightly retrain) | Cron, Airflow, a cloud scheduler |

```python
# Pattern for long jobs (sketch)
@app.post("/documents", status_code=202)
async def upload(doc: DocumentIn, _: Auth):
    job_id = await queue.enqueue("embed_document", doc.model_dump())  # returns immediately
    return {"job_id": job_id, "status": "queued"}

@app.get("/jobs/{job_id}")
async def job_status(job_id: str, _: Auth):
    return await queue.status(job_id)        # "queued" | "running" | "done" | "failed"
```

## Auth basics

**Authentication** answers "who are you?". **Authorization** answers "what are you allowed to do?".

| Method | How it works | Good for |
|---|---|---|
| API key | Client sends a secret in a header (`X-API-Key`) | Service-to-service, internal tools, your portfolio project |
| OAuth2 + JWT | User logs in, gets a signed token, sends `Authorization: Bearer <token>` | Apps with real users |
| Managed auth (Auth0, Clerk, Cognito, Firebase Auth) | A provider handles login; you verify its token | Most production apps — do not build login yourself |

A **JWT** (JSON Web Token) is a signed string containing the user id and an expiry time. The server checks the signature, so it does not need a database lookup per request. FastAPI has helpers in `fastapi.security` (`OAuth2PasswordBearer`, `HTTPBearer`).

Rules that always apply:

1. Secrets come from environment variables, never from code or Git.
2. Use HTTPS in production (the cloud load balancer usually handles this).
3. Compare secrets with `secrets.compare_digest`.
4. Add **rate limiting** (max requests per user per minute) to LLM endpoints. A leaked key can cost thousands of rupees in tokens in one night. (See [Case: Rate Limiter](/interview/system-design/case-rate-limiter).)
5. Restrict **CORS** (which websites' JavaScript can call your API) with `CORSMiddleware` and an explicit list of origins.

> **Interview tip:** If asked "how do you secure an LLM endpoint?", cover four layers: authentication (API key or JWT), rate limits per user, input limits (max message length, max tokens — the Pydantic `Field` limits above), and output guardrails.

## Production settings

`fastapi dev` is for development. In production:

```bash
fastapi run main.py --port 8000 --workers 2
# or
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
```

- `--host 0.0.0.0` listens on all network interfaces (needed inside Docker; `127.0.0.1` only accepts connections from the same machine).
- `--workers N` starts N processes. Each loads its own copy of the model, so memory use is N × model size. For a big model, prefer 1 worker per container and run more containers.
- No `--reload` in production.

## Key terms

| Term | Simple meaning |
|---|---|
| API / endpoint | A web address that accepts requests and returns responses |
| FastAPI | Python framework to build typed, async APIs |
| Uvicorn | The ASGI server that runs a FastAPI app |
| Route | Method + path linked to a function, e.g. `POST /predict` |
| Path / query parameter | Value in the URL path (`/items/42`) / after `?` (`?q=phone`) |
| Pydantic | Library that validates data against typed classes |
| `model_dump()` | Pydantic v2 method to turn a model into a dict |
| 422 | Status code for "your input failed validation" |
| Event loop | One thread that switches between tasks while they wait |
| I/O-bound / CPU-bound | Waiting on network/disk / busy computing |
| `lifespan` | Startup/shutdown hook; load models once here |
| Dependency (`Depends`) | A function FastAPI runs before the endpoint (auth, DB) |
| `response_model` | Pydantic model that shapes and checks the output |
| BackgroundTasks | Small work run after the response is sent |
| Job queue / worker | Durable list of jobs processed by separate processes |
| Streaming / SSE | Sending many messages in one response, `text/event-stream` |
| TTFT | Time to first token; the delay before the user sees text |
| JWT | Signed token with user info and expiry |
| CORS | Browser rule for which websites may call your API |
| Rate limiting | Max requests allowed per user per time window |

## Interview questions

**Why FastAPI over Flask for ML serving?**
FastAPI gives request and response validation from type hints and Pydantic, automatic OpenAPI docs, and first-class async support. Async matters for LLM apps because most time is spent waiting on the provider. Flask can work, but you write the validation and docs yourself and async is an afterthought.

**When do you use `def` vs `async def` in FastAPI?**
Use `async def` when everything inside is awaitable, like an async LLM client or async DB driver. Use plain `def` for blocking code, such as `requests` or scikit-learn prediction; FastAPI runs it in a thread pool so the event loop is not blocked. Calling blocking code inside `async def` freezes all requests.

**Where should you load the model, and why?**
Once at startup in the `lifespan` handler, stored in app state or a module-level variable. Loading per request adds seconds of latency and wastes memory. Also add a health check that reports whether the model is loaded, so the load balancer does not send traffic before it is ready.

**How does streaming an LLM response work?**
The server calls the LLM with streaming on, and for each text chunk it yields an SSE event, `data: ...` followed by a blank line, through a `StreamingResponse` with media type `text/event-stream`. The client reads the body incrementally. It reduces perceived latency because the user sees the first tokens in under a second instead of waiting for the full answer.

**What happens if the LLM fails halfway through a stream?**
The HTTP status 200 is already sent, so you cannot change it. You send an error event inside the stream, like `event: error`, and the client shows a message or retries. You should also log the partial response and the error.

**What is the difference between `BackgroundTasks` and Celery?**
`BackgroundTasks` runs in the same process after the response; it is lost on restart and has no retries. Celery or another queue stores jobs in a broker and runs them in separate workers with retries and status tracking. Use BackgroundTasks for logging, a queue for PDF ingestion or batch jobs.

**What does Pydantic give you? Mention a v2 change.**
Type validation and conversion, clear error messages, JSON schema for docs, and serialization. In v2, `model_dump()` replaced `.dict()`, `model_config = ConfigDict(...)` replaced `class Config`, and `field_validator` replaced `validator`. The core was rewritten in Rust and is much faster.

**How would you protect an LLM endpoint from abuse?**
Require authentication, add per-user rate limits and a monthly token budget, cap input length and `max_tokens` in the schema, and add guardrails for prompt injection. Log usage per key so you can spot spikes and revoke keys.

**How many Uvicorn workers would you run?**
For a small model, about one worker per CPU core. Each worker loads its own model copy, so for big models memory is the limit; then run one worker per container and scale containers horizontally. For GPU models, usually one process owns the GPU and you use a dedicated model server.

**Why use `response_model`?**
It validates and filters the response, so you never accidentally return internal fields like a raw database row. It also documents the response shape in `/docs`, which helps frontend developers.

## Try it yourself

1. **Add a batch endpoint.** Write `POST /predict/batch` that accepts `{"items": [IrisFeatures, ...]}` with at most 100 items and returns a list of predictions in one `predict_proba` call.
   *Hint:* `items: list[IrisFeatures] = Field(min_length=1, max_length=100)`.
2. **Add a field validator.** Reject a `ChatRequest` whose message is only spaces.
   *Hint:* `from pydantic import field_validator` and `@field_validator("message")`.
3. **Measure async.** Write an `async def` endpoint that does `await asyncio.sleep(1)` and another `async def` that does `time.sleep(1)`. Fire 10 requests at each at the same time with `httpx.AsyncClient` and `asyncio.gather`. Compare total time.
   *Hint:* One should take about 1 second, the other about 10.

### Answers

1.
```python
class BatchIn(BaseModel):
    items: list[IrisFeatures] = Field(min_length=1, max_length=100)

@app.post("/predict/batch", response_model=list[Prediction])
def predict_batch(body: BatchIn, _: Auth):
    b = state["bundle"]
    X = [[i.sepal_length, i.sepal_width, i.petal_length, i.petal_width] for i in body.items]
    probs = b["model"].predict_proba(X)            # one call for all rows: much faster
    out = []
    for p in probs:
        idx = int(p.argmax())
        out.append(Prediction(label=b["classes"][idx], probability=round(float(p[idx]), 3),
                              model_version=b["version"]))
    return out
```
2.
```python
from pydantic import field_validator

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    max_tokens: int = Field(default=512, ge=1, le=2048)

    @field_validator("message")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("message must not be blank")
        return v.strip()
```
3. The `asyncio.sleep` endpoint finishes all 10 in about 1 second, because the event loop serves others while each one waits. The `time.sleep` inside `async def` blocks the loop, so the requests run one by one: about 10 seconds. If you change the blocking one to plain `def`, it runs in the thread pool and drops back to about 1 second.

**Next:** [Docker Basics](/interview/mlops-deployment/docker-basics)
