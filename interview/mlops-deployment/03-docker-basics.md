---
title: Docker Basics
part: Serving Code
summary: What images and containers are, how containers differ from virtual machines, a Dockerfile for the FastAPI service explained line by line, layer caching, ports, volumes, registries and the commands you use every day.
---

Your FastAPI service runs on your laptop. Now it must run on a cloud server with a different operating system, a different Python version and none of your libraries installed. Docker solves this by packaging your code together with everything it needs. Almost every AI deployment today, from a small portfolio project to a large LLM serving cluster, ships as a Docker container, so interviewers expect you to read and write a Dockerfile comfortably.

> **In simple words:** A Docker **image** is a frozen box that holds your code, Python, libraries and settings. A **container** is that box running. If it runs on your laptop, the same image runs the same way on any server.

## The problem Docker solves

Without Docker, deploying means a long list of manual steps on each server: install Python 3.12, install the right scikit-learn version, install system libraries, set environment variables, copy the model file. One small difference (scikit-learn 1.4 on the server, 1.5 on your laptop) and `joblib.load` fails or gives warnings. This is the classic "works on my machine" problem.

Docker writes those steps into a file (the **Dockerfile**), runs them once to create an **image**, and then you start the identical image anywhere.

> **Real-life example:** Think of a tiffin service. Instead of giving someone a recipe and hoping their kitchen has the same spices and stove, you send the cooked meal in a sealed tiffin box. It tastes the same in any office. The image is the sealed tiffin; the container is someone eating from it.

## Image vs container

| Idea | What it is | Analogy |
|---|---|---|
| **Image** | A read-only template: files + settings + the command to start | A class in Python, or a recipe card |
| **Container** | A running (or stopped) instance of an image, with its own writable layer | An object created from the class |
| **Dockerfile** | Text file with instructions to build an image | The recipe text |
| **Registry** | A server that stores images (Docker Hub, AWS ECR, GCP Artifact Registry, GitHub GHCR) | A library of recipe cards |
| **Docker Engine** | The background program that builds and runs containers | The kitchen |

You can start 10 containers from one image. Each has its own process, network address and writable files, but they share the read-only image layers on disk.

## Containers vs virtual machines

A **virtual machine (VM)** pretends to be a whole computer. It runs a full **guest operating system** on top of a **hypervisor** (software that splits one physical machine into many virtual ones). Booting takes tens of seconds to minutes and each VM uses gigabytes of memory for its own OS.

A **container** does not have its own OS kernel. It shares the host's Linux kernel and only isolates the process: what files it can see, what network it has, how much CPU and memory it may use. (Linux features called **namespaces** do the isolation and **cgroups** do the resource limits.) So containers start in about a second and add very little overhead.

<figure>
<svg viewBox="0 0 440 240" width="440" height="240" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<text x="110" y="22" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold" font-size="13">Virtual machines</text>
<text x="330" y="22" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold" font-size="13">Containers</text>
<rect x="10" y="40" width="95" height="28" rx="4" />
<text x="57" y="59" text-anchor="middle" fill="currentColor" stroke="none">App A</text>
<rect x="115" y="40" width="95" height="28" rx="4" />
<text x="162" y="59" text-anchor="middle" fill="currentColor" stroke="none">App B</text>
<rect x="10" y="72" width="95" height="28" rx="4" />
<text x="57" y="91" text-anchor="middle" fill="currentColor" stroke="none">Libs</text>
<rect x="115" y="72" width="95" height="28" rx="4" />
<text x="162" y="91" text-anchor="middle" fill="currentColor" stroke="none">Libs</text>
<rect x="10" y="104" width="95" height="28" rx="4" />
<text x="57" y="123" text-anchor="middle" fill="var(--accent)" stroke="none">Guest OS</text>
<rect x="115" y="104" width="95" height="28" rx="4" />
<text x="162" y="123" text-anchor="middle" fill="var(--accent)" stroke="none">Guest OS</text>
<rect x="10" y="136" width="200" height="28" rx="4" />
<text x="110" y="155" text-anchor="middle" fill="currentColor" stroke="none">Hypervisor</text>
<rect x="10" y="168" width="200" height="28" rx="4" />
<text x="110" y="187" text-anchor="middle" fill="currentColor" stroke="none">Host OS</text>
<rect x="10" y="200" width="200" height="28" rx="4" />
<text x="110" y="219" text-anchor="middle" fill="currentColor" stroke="none">Hardware</text>
<text x="330" y="55" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">no guest OS: share host kernel</text>
<rect x="230" y="72" width="62" height="28" rx="4" />
<text x="261" y="91" text-anchor="middle" fill="currentColor" stroke="none">App A</text>
<rect x="299" y="72" width="62" height="28" rx="4" />
<text x="330" y="91" text-anchor="middle" fill="currentColor" stroke="none">App B</text>
<rect x="368" y="72" width="62" height="28" rx="4" />
<text x="399" y="91" text-anchor="middle" fill="currentColor" stroke="none">App C</text>
<rect x="230" y="104" width="62" height="28" rx="4" />
<text x="261" y="123" text-anchor="middle" fill="currentColor" stroke="none">Libs</text>
<rect x="299" y="104" width="62" height="28" rx="4" />
<text x="330" y="123" text-anchor="middle" fill="currentColor" stroke="none">Libs</text>
<rect x="368" y="104" width="62" height="28" rx="4" />
<text x="399" y="123" text-anchor="middle" fill="currentColor" stroke="none">Libs</text>
<rect x="230" y="136" width="200" height="28" rx="4" />
<text x="330" y="155" text-anchor="middle" fill="currentColor" stroke="none">Docker Engine</text>
<rect x="230" y="168" width="200" height="28" rx="4" />
<text x="330" y="187" text-anchor="middle" fill="currentColor" stroke="none">Host OS (Linux kernel)</text>
<rect x="230" y="200" width="200" height="28" rx="4" />
<text x="330" y="219" text-anchor="middle" fill="currentColor" stroke="none">Hardware</text>
</svg>
<figcaption>Each VM carries a full guest OS; containers skip it and share the host kernel, so they are smaller and start faster.</figcaption>
</figure>

| | Virtual machine | Container |
|---|---|---|
| Has its own OS kernel | Yes | No, shares host kernel |
| Start time | Tens of seconds to minutes | About a second |
| Size | Gigabytes | Megabytes to a few GB |
| Isolation | Strong (hardware-level) | Good, but weaker (shared kernel) |
| Density | A few per server | Dozens to hundreds per server |
| Typical use | Running different OSes, strong security boundaries | Packaging and scaling apps, microservices |

In the cloud you usually use **both**: containers run *inside* VMs (an EC2 instance, a Kubernetes node). On Windows and macOS, Docker Desktop runs a small Linux VM behind the scenes, because containers need a Linux kernel.

> **Interview tip:** Say "a container is an isolated process sharing the host kernel; a VM virtualizes the hardware and runs its own kernel." Then give the trade-off: containers are lighter and faster, VMs isolate more strongly.

## A Dockerfile, line by line

Here is a production-quality Dockerfile for the service from [FastAPI for AI Apps](/interview/mlops-deployment/fastapi-for-ai-apps). The folder contains `main.py`, `model.joblib` and `requirements.txt`.

```dockerfile
# syntax=docker/dockerfile:1
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Line by line:

| Line | What it does | Why |
|---|---|---|
| `# syntax=docker/dockerfile:1` | Uses the latest stable Dockerfile syntax | Enables newer features like cache mounts |
| `FROM python:3.12-slim` | Starts from an official image with Debian + Python 3.12, minus extras | Every image starts from a **base image**. `slim` is much smaller than the full image |
| `ENV PYTHONDONTWRITEBYTECODE=1` | Python does not write `.pyc` files | Less clutter in the image |
| `PYTHONUNBUFFERED=1` | Print and log output appears immediately | Otherwise logs may be delayed or lost when a container crashes |
| `PIP_NO_CACHE_DIR=1` | pip does not keep downloaded files | The cache is useless inside an image and adds size |
| `WORKDIR /app` | Creates `/app` and makes it the current folder | All later paths are relative to `/app` |
| `COPY requirements.txt .` | Copies **only** the requirements file first | So the next step can be cached (see layers below) |
| `RUN pip install -r requirements.txt` | Installs libraries at **build time** | This is the slow step; it is cached unless requirements change |
| `COPY . .` | Copies the rest of your code and model | Comes after install, so code edits do not reinstall libraries |
| `RUN useradd --create-home appuser` | Creates a normal user | Running as `root` inside a container is a security risk |
| `USER appuser` | Later commands and the app run as that user | If the app is hacked, the attacker is not root |
| `EXPOSE 8000` | Documents the port the app listens on | Documentation only; it does **not** open the port. `-p` does |
| `HEALTHCHECK ...` | Docker calls `/health` every 30 s | Docker (and some platforms) mark the container unhealthy if it fails |
| `CMD [...]` | The command run when a container starts | **Exec form** (JSON list) so Uvicorn gets stop signals directly and shuts down cleanly |

Also create a `.dockerignore` file, so `COPY . .` does not copy junk or secrets:

```text
.git
.venv
__pycache__/
*.ipynb
.env
data/raw/
tests/
```

> **Common mistake:** Forgetting `.dockerignore` and copying `.env` (with your API keys) or a 5 GB `data/` folder into the image. Anyone who pulls the image can read the keys.

### RUN vs CMD vs ENTRYPOINT

| Instruction | When it runs | Example |
|---|---|---|
| `RUN` | At **build** time, creates a layer | `RUN pip install ...` |
| `CMD` | At **container start**; default command, easy to override | `CMD ["uvicorn", "main:app"]` |
| `ENTRYPOINT` | At container start; the fixed program, `CMD` becomes its arguments | `ENTRYPOINT ["python", "cli.py"]` + `CMD ["--help"]` |

`docker run myimage python train.py` replaces the `CMD`. Only use `ENTRYPOINT` when the image is "one program" and users only pass arguments.

### COPY vs ADD

Use `COPY`. `ADD` can also download URLs and unpack tar files, which is surprising behaviour. Prefer explicit `RUN curl ...` if you need a download.

## Layers and build caching

Each `FROM`, `RUN`, `COPY` and `ADD` instruction creates a **layer**: a set of file changes stacked on the previous layer. The final image is all layers stacked. Docker **caches** each layer. When you rebuild, it reuses layers from the top until it reaches the first instruction whose inputs changed. From that point on, every layer is rebuilt.

That is why the order of instructions matters so much.

### Worked example: the cost of bad ordering

Suppose in your project `pip install` takes 90 seconds (scikit-learn, numpy, etc.) and every other step takes about 1 second. You change one line in `main.py` and rebuild 20 times a day. (These timings are an illustration; yours will differ.)

**Bad order:**

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY . .                              # main.py changed → this layer changes
RUN pip install -r requirements.txt   # → so this runs again: 90 s
```

**Good order:**

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .               # unchanged → cached
RUN pip install -r requirements.txt   # cached: 0 s
COPY . .                              # only this rebuilds: ~1 s
```

| | Rebuild after a code change | 20 rebuilds per day |
|---|---|---|
| Bad order | about 90 + 1 = 91 s | 20 × 91 = 1,820 s ≈ 30 minutes |
| Good order | about 1 s | 20 × 1 = 20 s |

Same image, but the good order saves about half an hour every day.

> **Remember:** Put things that change rarely (base image, system packages, requirements) at the top. Put things that change often (your code) at the bottom.

Two more layer rules:

1. **Deleting a file in a later layer does not shrink the image.** The file still exists in the earlier layer. Download-and-delete must happen in the same `RUN`:
   ```dockerfile
   RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
       && rm -rf /var/lib/apt/lists/*        # same RUN, so the cache files never enter a layer
   ```
2. **Secrets in any layer are in the image forever.** Never `COPY .env` or `ENV API_KEY=...` in a Dockerfile. Pass secrets at run time (next chapter).

See the layers and their sizes with `docker history myimage`.

## Build and run

```bash
docker build -t ai-service:1.0.0 .
```

- `-t ai-service:1.0.0` gives the image a **name:tag**. The tag is usually a version or a Git commit hash.
- `.` is the **build context**: the folder whose files `COPY` can see (minus `.dockerignore`).

```text
[+] Building 94.2s (11/11) FINISHED
 => [1/6] FROM docker.io/library/python:3.12-slim
 => [2/6] WORKDIR /app
 => [3/6] COPY requirements.txt .
 => [4/6] RUN pip install -r requirements.txt
 => [5/6] COPY . .
 => [6/6] RUN useradd --create-home appuser
 => exporting to image
 => naming to docker.io/library/ai-service:1.0.0
```

Run it:

```bash
docker run -d --name ai -p 8000:8000 \
  -e ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" -e APP_API_KEY=dev-secret \
  ai-service:1.0.0

curl http://localhost:8000/health
```

```text
{"status":"ok","model_loaded":true}
```

| Flag | Meaning |
|---|---|
| `-d` | Detached: run in the background |
| `--name ai` | Give the container a name, so you can say `docker logs ai` |
| `-p 8000:8000` | Map host port 8000 → container port 8000 |
| `-e KEY=value` | Set an environment variable inside the container |
| `--rm` | Delete the container when it stops (good for one-off runs) |
| `-v host:container` | Mount a folder or volume |
| `--env-file .env` | Load many env variables from a file (the file stays outside the image) |

## Ports

A container has its own private network. Uvicorn listening on port 8000 *inside* the container is not reachable from your laptop until you **publish** the port.

`-p HOST_PORT:CONTAINER_PORT`. Examples:

| Command | You call | Reaches |
|---|---|---|
| `-p 8000:8000` | `localhost:8000` | container port 8000 |
| `-p 9000:8000` | `localhost:9000` | container port 8000 |
| `-p 127.0.0.1:8000:8000` | only from this machine | container port 8000 |

You can run three copies of the same image with `-p 8001:8000`, `-p 8002:8000`, `-p 8003:8000`. Inside, all listen on 8000; outside, they are on different host ports.

> **Common mistake:** Starting Uvicorn with `--host 127.0.0.1` inside the container. Then it only accepts connections from inside the container itself, and `-p` cannot reach it. Inside Docker, always use `--host 0.0.0.0`.

## Volumes: data that survives

A container's writable layer is deleted when the container is removed. Anything your app wrote there (uploaded PDFs, a SQLite database, a vector index) is gone. To keep data, you **mount** storage from outside.

| Type | Syntax | Use for |
|---|---|---|
| **Named volume** (managed by Docker) | `-v chroma_data:/data` | Databases, vector DB files, model caches in production |
| **Bind mount** (a folder on your machine) | `-v "$(pwd)/models:/app/models"` | Development: edit code or swap model files without rebuilding |
| **tmpfs** (in memory) | `--tmpfs /tmp` | Temporary files that must not touch disk |

```bash
docker volume create hf_cache
# Cache Hugging Face downloads so a restarted container does not re-download a 15 GB model
docker run -v hf_cache:/root/.cache/huggingface my-llm-image
```

> **Real-life example:** The container is a hotel room. When you check out, housekeeping clears it. A volume is a locker in the lobby: your bag is still there when you come back to a different room.

## Registries and tags

To run your image on a server, you **push** it to a registry and the server **pulls** it.

```bash
docker tag ai-service:1.0.0 ghcr.io/yourname/ai-service:1.0.0
docker push ghcr.io/yourname/ai-service:1.0.0
# on the server:
docker pull ghcr.io/yourname/ai-service:1.0.0
```

| Registry | Where |
|---|---|
| Docker Hub | Public default (`docker.io`) |
| GitHub Container Registry | `ghcr.io`, easy with GitHub Actions |
| AWS ECR | `<account>.dkr.ecr.<region>.amazonaws.com` |
| GCP Artifact Registry | `<region>-docker.pkg.dev/<project>/<repo>` |
| Azure Container Registry | `<name>.azurecr.io` |

> **Common mistake:** Deploying the `latest` tag. `latest` is just a default name, not "the newest". It changes over time, so you cannot tell what is running or roll back. Tag with a version or the Git commit hash, like `ai-service:3f9c2ab`.

## Common Docker commands

| Command | What it does |
|---|---|
| `docker build -t name:tag .` | Build an image from the Dockerfile in this folder |
| `docker images` | List images on this machine |
| `docker run -d -p 8000:8000 --name x name:tag` | Start a container in the background |
| `docker run --rm -it name:tag bash` | Start a throwaway container with a shell (use `sh` if no bash) |
| `docker ps` / `docker ps -a` | List running / all containers |
| `docker logs -f x` | Follow a container's logs |
| `docker exec -it x sh` | Open a shell inside a running container |
| `docker stop x` / `docker start x` | Stop / start a container |
| `docker rm x` | Delete a stopped container |
| `docker rmi name:tag` | Delete an image |
| `docker stats` | Live CPU and memory use per container |
| `docker inspect x` | Full JSON details (env, mounts, IP, health) |
| `docker history name:tag` | Show layers and their sizes |
| `docker tag src dst` | Give an image another name |
| `docker push` / `docker pull` | Upload to / download from a registry |
| `docker volume ls` / `docker volume create v` | List / create volumes |
| `docker system df` | Disk used by images, containers, volumes |
| `docker system prune` | Delete stopped containers, unused networks and dangling images (add `-a` for all unused images — careful) |
| `docker compose up -d` | Start a multi-container app (next chapter) |

### Debugging a container that will not start

1. `docker ps -a` — is it "Exited (1)"?
2. `docker logs x` — read the Python traceback. Usually a missing env variable, a missing file, or an import error.
3. `docker run --rm -it --entrypoint sh name:tag` — get a shell in the image and look around (`ls`, `python -c "import sklearn"`).
4. `docker inspect x` — check env variables and mounts.

## Key terms

| Term | Simple meaning |
|---|---|
| Docker | Tool to build and run containers |
| Image | Read-only template with code, dependencies and start command |
| Container | A running instance of an image |
| Dockerfile | Instructions to build an image |
| Base image | The image you start `FROM`, e.g. `python:3.12-slim` |
| Layer | One step's file changes; images are stacks of layers |
| Build cache | Reuse of unchanged layers to make rebuilds fast |
| Build context | The folder sent to the build; what `COPY` can see |
| `.dockerignore` | List of files not sent in the build context |
| Virtual machine | Software computer with its own OS on a hypervisor |
| Hypervisor | Software that runs VMs on physical hardware |
| Namespaces / cgroups | Linux features for container isolation / resource limits |
| Port publishing (`-p`) | Connect a host port to a container port |
| Volume | Storage outside the container that survives removal |
| Bind mount | A host folder mounted into a container |
| Registry | Server that stores images |
| Tag | Label for an image version, e.g. `1.0.0` |
| Exec form | `CMD ["a", "b"]` JSON form; proper signal handling |

## Interview questions

**What is the difference between an image and a container?**
An image is a read-only template built from a Dockerfile: files, dependencies and a start command. A container is a running instance of that image with its own writable layer, process and network. One image can run as many containers.

**How is a container different from a virtual machine?**
A VM virtualizes hardware and runs its own full OS kernel, so it is heavy and slow to start but strongly isolated. A container is an isolated process that shares the host's kernel, using namespaces and cgroups, so it is light and starts in about a second. In the cloud we usually run containers inside VMs.

**Why do you copy requirements.txt before the rest of the code?**
Because of layer caching. Docker reuses layers until the first changed instruction. If requirements are copied and installed first, a code change only rebuilds the final `COPY` layer, and the slow pip install is cached. Copying all code first would reinstall all libraries on every code change.

**What does EXPOSE do?**
It only documents which port the app listens on. It does not publish the port. You publish with `-p host:container` in `docker run` or `ports:` in compose.

**Why should a container not run as root?**
If an attacker exploits the app, they get the container user's permissions. As root, they can do much more damage, and some container escape bugs need root. Create a normal user and switch with `USER`.

**Your container exits immediately. How do you debug it?**
Check `docker ps -a` for the exit code and `docker logs` for the traceback. Common causes are a missing environment variable, a missing model file, or the main process ending (a container lives only as long as its main process). Then run the image with a shell entrypoint to inspect files.

**How do you keep data when a container is deleted?**
Mount a volume. Named volumes are managed by Docker and are best for databases or vector stores; bind mounts map a host folder and are handy in development. Anything written only to the container's own layer is lost on removal.

**What is the difference between CMD and ENTRYPOINT?**
Both run at container start. `CMD` is the default command and is fully replaced by arguments to `docker run`. `ENTRYPOINT` fixes the program, and `CMD` (or run arguments) become its arguments. Use the JSON exec form for both so signals reach the process.

**Why not use the `latest` tag in production?**
It is mutable and ambiguous: you cannot tell which code is running, two servers may run different versions, and rollback is unclear. Use immutable tags like a semantic version or the Git commit SHA.

**How do you make a Docker image smaller?**
Use a slim base image, combine install and cleanup in one `RUN`, use `.dockerignore`, use `--no-cache-dir` for pip, and use multi-stage builds so compilers and build tools are not in the final image. The next chapter covers this in detail.

## Try it yourself

1. **Build and run.** Write the Dockerfile above for your FastAPI service, build it, run it on host port 9000, and call `/health`.
   *Hint:* `-p 9000:8000`.
2. **Prove layer caching.** Build twice without changes and note the time. Then change one line in `main.py` and rebuild. Which steps say `CACHED`?
   *Hint:* Look at the build output step by step.
3. **Find the bug.** This container starts but `curl localhost:8000/health` fails. Why?
   ```dockerfile
   FROM python:3.12-slim
   WORKDIR /app
   COPY . .
   RUN pip install -r requirements.txt
   CMD ["uvicorn", "main:app", "--port", "8000"]
   ```
   Run with `docker run -d -p 8000:8000 img`.
   *Hint:* What host does Uvicorn listen on by default?
4. **Calculate.** A team has 5 developers. Each rebuilds 15 times a day. Bad ordering costs 80 s per rebuild, good ordering 3 s. How many minutes per day does the team save?

### Answers

1. `docker build -t ai-service:dev .` then `docker run -d -p 9000:8000 -e APP_API_KEY=dev-secret ai-service:dev` then `curl http://localhost:9000/health` → `{"status":"ok","model_loaded":true}`.
2. The second unchanged build shows every step as `CACHED` and finishes in a second or two. After changing `main.py`, steps up to `RUN pip install` are `CACHED`; only `COPY . .` and later steps run.
3. Uvicorn's default host is `127.0.0.1`, so it accepts connections only from inside the container. Add `"--host", "0.0.0.0"`. (Also, the Dockerfile copies code before installing requirements, which hurts caching, and it runs as root.)
4. Saving per rebuild = 80 − 3 = 77 s. Rebuilds per day = 5 × 15 = 75. Total = 77 × 75 = 5,775 s. 5,775 ÷ 60 = **96.25 minutes** ≈ 1.6 hours per day.

**Next:** [Docker for ML and Compose](/interview/mlops-deployment/docker-for-ml-and-compose)
