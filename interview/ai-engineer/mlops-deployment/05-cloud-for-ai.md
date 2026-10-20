---
title: Cloud for AI
part: Cloud & Serving
summary: The cloud services AI engineers actually use on AWS, Azure and GCP (compute, storage, managed ML, hosted LLM APIs, serverless), which one to learn first, a cost comparison done by hand, and a step-by-step container deployment to Cloud Run with notes for ECS.
---

Your app runs in a container on your laptop. To give it a public URL that works when your laptop is off, you run it on someone else's computers: the **cloud**. The three big providers are AWS, Microsoft Azure and Google Cloud (GCP). Each has hundreds of services, but an AI engineer uses maybe ten of them. This chapter tells you which ten, how they map across the three clouds, and walks you through deploying your container end to end.

> **In simple words:** The cloud rents you computers (VMs and GPUs), storage (for files, models, data), and ready-made AI services (hosted LLMs, managed training). For deploying an API, the easiest path is a **serverless container platform**: you give it a Docker image and it gives you an HTTPS URL that scales automatically.

## Cloud basics in five ideas

1. **Region.** A geographic location with data centres, like Mumbai (`ap-south-1` on AWS, `asia-south1` on GCP, "Central India" on Azure). Choose one close to your users for low latency, and one where the service you need (e.g. a specific GPU or LLM) is available. Some data must legally stay in India; region choice handles that.
2. **Service models.** How much the provider manages for you.

   | Model | You manage | Provider manages | Example |
   |---|---|---|---|
   | **IaaS** (infrastructure as a service) | OS, runtime, app | Hardware, network | A VM (EC2, Compute Engine) |
   | **PaaS** (platform as a service) | Your app or container | OS, scaling, patching | Cloud Run, ECS Fargate, App Service |
   | **SaaS** / API | Nothing but your calls | Everything | Bedrock, Azure OpenAI, Vertex AI Gemini API |

3. **Pay as you go.** You pay per second of a VM, per GB stored, per request, or per token. Idle resources still cost money unless they **scale to zero**.
4. **IAM** (identity and access management). Who (a user or a service) may do what on which resource. Always give the **least privilege**: the minimum permissions needed.
5. **Managed vs self-hosted.** Running Postgres yourself on a VM vs using a managed database. Managed costs more per hour but saves your time on backups, upgrades and failover.

> **Real-life example:** IaaS is renting an empty flat: you buy furniture and fix the plumbing. PaaS is a PG (paying guest) room: furnished, food included, you just live there. SaaS is eating at a restaurant: you only order.

## The services that matter for AI, by cloud

| Job | AWS | Azure | GCP |
|---|---|---|---|
| Virtual machines (incl. GPUs) | EC2 | Virtual Machines | Compute Engine |
| Object storage (files, models, datasets) | S3 | Blob Storage | Cloud Storage (GCS) |
| Container registry | ECR | Container Registry (ACR) | Artifact Registry |
| Serverless containers | ECS on Fargate, App Runner | Container Apps | **Cloud Run** |
| Kubernetes | EKS | AKS | GKE |
| Serverless functions | Lambda | Functions | Cloud Run functions |
| Managed ML platform (train, deploy, pipelines) | SageMaker AI | Azure Machine Learning / AI Foundry | Vertex AI |
| Hosted LLM APIs | **Bedrock** (Claude, Llama, Mistral, Amazon Nova, ...) | **Azure OpenAI** in AI Foundry (GPT models, plus others) | Vertex AI Model Garden (Gemini, Claude, Llama, ...) |
| Secrets | Secrets Manager | Key Vault | Secret Manager |
| Logs and metrics | CloudWatch | Monitor | Cloud Logging / Monitoring |
| Managed vector search | OpenSearch, S3 Vectors, Aurora pgvector | AI Search | Vertex AI Vector Search, AlloyDB pgvector |

Cloud product names change often (for example, Azure's AI portal has been renamed several times, and SageMaker was renamed SageMaker AI). Learn the *category* of each service; look up the current name when you need it.

### AWS in a little more detail

AWS has the largest market share and appears most often in Indian job descriptions, so here is what each key service is for.

- **EC2** (Elastic Compute Cloud): rent a VM. Instance types are named by family: `t` and `m` general purpose, `c` compute heavy, `r` memory heavy, `g` and `p` GPU families (`g` for inference and smaller training, `p` for large training). You pay while it runs, even if idle.
- **S3** (Simple Storage Service): store any file as an **object** in a **bucket**, addressed by a key like `s3://my-bucket/models/churn/v3/model.joblib`. Cheap, durable, the default place for datasets, model artifacts and uploaded PDFs.
- **SageMaker AI**: managed ML platform. Notebooks, training jobs on rented GPUs that shut down when done, a model registry, and **endpoints** that host a model behind an HTTPS API with autoscaling. Good when a company wants everything ML in one place.
- **Bedrock**: call foundation models (Claude, Llama, Mistral, Amazon's own) through AWS. Data stays in your AWS account, billing is on your AWS bill, IAM controls access. Many Indian enterprises prefer this to calling model providers directly.
- **Lambda**: run a function on demand, pay per millisecond. Great for small glue tasks (process an uploaded file, a webhook). Limits: maximum 15 minutes per run, limited memory, no GPU, cold starts. Not good for loading big models.
- **ECS on Fargate**: run containers without managing servers. The common AWS choice for a FastAPI container.

```python
# Upload a model to S3 and call Claude through Bedrock (boto3)
import boto3

s3 = boto3.client("s3", region_name="ap-south-1")
s3.upload_file("model.joblib", "my-ml-bucket", "models/iris/1.0.0/model.joblib")

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")
MODEL_ID = "anthropic.claude-..."   # copy the exact current model/inference-profile id from the Bedrock console
resp = bedrock.converse(                       # Converse API: same shape for all Bedrock models
    modelId=MODEL_ID,
    messages=[{"role": "user", "content": [{"text": "Say hello in Hindi."}]}],
    inferenceConfig={"maxTokens": 100, "temperature": 0.2},
)
print(resp["output"]["message"]["content"][0]["text"])
print(resp["usage"])          # Output (shape): {'inputTokens': ..., 'outputTokens': ..., 'totalTokens': ...}
```

Credentials come from the environment (an IAM role on AWS, or `aws configure` locally), never from code. The `anthropic` SDK also has an `AnthropicBedrock` client if you prefer the same API shape as [Using LLM APIs](/interview/ai-engineer/llms-genai/using-llm-apis).

### Azure in brief

Azure matters because many large Indian IT services companies and their enterprise clients run on Microsoft. The key AI service is **Azure OpenAI**, which hosts OpenAI's models inside Azure with enterprise security and regional data control. You create a resource, **deploy** a model under a deployment name you choose, then call it.

```python
# Azure OpenAI with the openai SDK
import os
from openai import AzureOpenAI

client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],   # https://<resource>.openai.azure.com
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    api_version=os.environ["AZURE_OPENAI_API_VERSION"],   # check the current version in Azure docs
)
DEPLOYMENT = os.environ["AZURE_OPENAI_DEPLOYMENT"]       # YOUR deployment name, not the model name
resp = client.chat.completions.create(
    model=DEPLOYMENT,
    messages=[{"role": "user", "content": "One tip for a fresher interview?"}],
    max_tokens=100,
)
print(resp.choices[0].message.content)
```

> **Common mistake:** Passing the model name (like a GPT model id) instead of your *deployment name* to Azure OpenAI. Azure routes by deployment.

### GCP in brief

- **Vertex AI**: Google's ML platform (training, endpoints, pipelines) and the gateway to Gemini and other models in **Model Garden**, including Claude (the `anthropic` SDK has an `AnthropicVertex` client).
- **Cloud Run**: the simplest way to run a container with a public HTTPS URL. Scales to zero, and supports GPUs in some regions. We deploy to it below.
- **GKE**: managed Kubernetes for large setups.

## Which cloud to learn first?

| If... | Learn first |
|---|---|
| You are applying broadly in India | **AWS** (most job descriptions), focusing on EC2, S3, IAM, ECS/Fargate, Lambda, Bedrock |
| Target companies are Microsoft shops or IT services firms | **Azure** (Azure OpenAI, Container Apps, AKS) |
| You want the fastest path to a live demo | **GCP Cloud Run** (one command from container to URL) |

The concepts transfer. If you can explain "container in a registry → serverless container service → secrets from a secret manager → logs in the cloud console" on one cloud, you can learn another in a week.

> **Interview tip:** You are not expected to know every cloud. Say: "I've deployed on X. I know the equivalents: S3 is GCS is Blob Storage; Fargate is Cloud Run is Container Apps." This shows you understand categories, not just buttons.

## Choosing how to run your container

| Option | You manage | Scales to zero | GPUs | Good for |
|---|---|---|---|---|
| A single VM + Docker Compose | Everything (OS, updates, restarts) | No | Yes | Cheapest always-on demo, full control |
| Serverless containers (Cloud Run, Fargate, Container Apps) | Image + settings | Cloud Run / Container Apps: yes; Fargate: no (min tasks) | Cloud Run and Container Apps: yes in some regions | Most API services, portfolio projects |
| Kubernetes (EKS, GKE, AKS) | Cluster config, manifests | With extra tools | Yes | Many services, big teams, GPU fleets |
| Managed ML endpoints (SageMaker, Vertex AI) | Model + config | Some modes | Yes | Teams standardised on that platform |
| Serverless functions (Lambda) | Code only | Yes | No | Small, short tasks; not model serving |

### Worked example: how many instances do you need?

Serverless platforms let you set **concurrency**: how many requests one instance handles at the same time. To size it, use **Little's law**: requests in progress = arrival rate × time per request.

Your RAG API receives **200 requests per second** at peak. Each request takes **0.5 seconds** (mostly waiting for the LLM). Each instance is set to handle **20 concurrent requests**.

1. Requests in progress = 200 × 0.5 = **100**.
2. Instances needed = 100 ÷ 20 = **5**.
3. Add headroom for spikes (say 30%): 5 × 1.3 = 6.5 → set max instances to at least **7**.

If the LLM gets slower and each request takes 1.5 s: in progress = 200 × 1.5 = 300, instances = 300 ÷ 20 = 15. Latency of a dependency directly multiplies your instance count. (More on capacity math in [Estimation](/interview/system-design/estimation).)

## Cost: API vs your own GPU

The numbers below are made-up round examples to show the method. Real prices change often and differ by region; always check the provider's pricing page.

Suppose:
- A GPU VM that can run an open 8B-parameter model costs **₹100 per hour** (example).
- A hosted LLM API costs **₹0.50 per request** for your typical request size (example).

Running the GPU VM all month: 24 hours × 30 days = 720 hours. 720 × ₹100 = **₹72,000 per month**, whether you get 10 requests or 1 lakh.

API cost for N requests = N × ₹0.50.

**Break-even**: N × 0.50 = 72,000 → N = 72,000 ÷ 0.50 = **1,44,000 requests per month** (144,000). That is about 144,000 ÷ 30 = 4,800 per day.

| Monthly requests | API cost | Own GPU cost | Cheaper |
|---|---|---|---|
| 20,000 | 20,000 × 0.5 = ₹10,000 | ₹72,000 | API |
| 1,44,000 | ₹72,000 | ₹72,000 | Equal |
| 5,00,000 | ₹2,50,000 | ₹72,000 (if one GPU can handle the load) | Own GPU |

But own-GPU cost is not just the VM. Add engineer time to run it, a second GPU for reliability, and the quality gap if the open model is weaker. Most teams start with APIs and self-host only at high volume, for data privacy, or for a fine-tuned model.

> **Remember:** APIs have a cost per request and no fixed cost. Self-hosting has a fixed cost and near-zero cost per extra request (until the GPU is full). Compare at your expected volume.

## Deploying a container to Cloud Run, step by step

This deploys the image from [Docker Basics](/interview/ai-engineer/mlops-deployment/docker-basics). You need a GCP project with billing enabled and the `gcloud` CLI installed.

```bash
# 1. Log in and choose your project and region (Mumbai)
gcloud auth login
gcloud config set project my-ai-project
gcloud config set run/region asia-south1

# 2. Enable the services you need (one time)
gcloud services enable run.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com

# 3. Create a Docker repository in Artifact Registry (one time)
gcloud artifacts repositories create ai --repository-format=docker --location=asia-south1
gcloud auth configure-docker asia-south1-docker.pkg.dev

# 4. Build for linux/amd64 (needed if you are on an ARM Mac) and push
IMAGE=asia-south1-docker.pkg.dev/my-ai-project/ai/ai-service:v1
docker build --platform linux/amd64 -t $IMAGE .
docker push $IMAGE

# 5. Store the API key as a secret (one time)
printf "sk-ant-..." | gcloud secrets create anthropic-api-key --data-file=-

# 6. Deploy
gcloud run deploy ai-service \
  --image $IMAGE \
  --port 8000 \
  --cpu 1 --memory 1Gi \
  --concurrency 20 \
  --min-instances 0 --max-instances 7 \
  --set-secrets ANTHROPIC_API_KEY=anthropic-api-key:latest \
  --set-env-vars LLM_MODEL=claude-sonnet-5-5 \
  --allow-unauthenticated
```

```text
Deploying container to Cloud Run service [ai-service] in project [my-ai-project] region [asia-south1]
OK Deploying new service... Done.
  OK Creating Revision...
  OK Routing traffic...
Service [ai-service] revision [ai-service-00001-abc] has been deployed and is serving 100 percent of traffic.
Service URL: https://ai-service-xxxxxxxxxx-el.a.run.app
```

```bash
curl https://ai-service-xxxxxxxxxx-el.a.run.app/health
# {"status":"ok","model_loaded":true}
```

(Your URL will differ.) What each important flag means:

| Flag | Meaning |
|---|---|
| `--port 8000` | The port your container listens on (Cloud Run sends traffic there) |
| `--concurrency 20` | Max simultaneous requests per instance |
| `--min-instances 0` | Scale to zero when idle: no cost, but the first request has a cold start |
| `--max-instances 7` | A ceiling, so a traffic spike or attack cannot create a huge bill |
| `--set-secrets` | Inject a Secret Manager secret as an env variable at runtime |
| `--allow-unauthenticated` | Public URL; your app's own API-key check still applies |

Each deploy creates a new **revision**. You can split traffic between revisions (`gcloud run services update-traffic ai-service --to-revisions=REV=10`), which is how you do a canary release (see [CI/CD and Testing for AI](/interview/ai-engineer/mlops-deployment/ci-cd-and-testing-for-ai)).

> **Common mistake:** Building the image on an Apple Silicon Mac without `--platform linux/amd64`. The image is ARM, the cloud runs x86, and the container fails with "exec format error".

### The same on AWS (ECS Fargate), in outline

1. Create an ECR repository; `docker push` the image to it.
2. Put the API key in Secrets Manager.
3. Create an ECS **task definition**: image, CPU/memory, port 8000, env vars, secret references, and an IAM **task role**.
4. Create an ECS **service** on Fargate with a desired count (e.g. 2 tasks), behind an **Application Load Balancer** that gives HTTPS and health checks `/health`.
5. Add autoscaling on CPU or request count.

It is more steps than Cloud Run, but it is the most common production pattern on AWS. AWS also offers simpler "give me an image, get a URL" services (App Runner and newer options); AWS changes these often, so check which one is currently recommended.

## Safety and cost hygiene

- [ ] **Set a budget alert** on day one (e.g. alert at ₹1,000). A forgotten GPU VM can cost a lot in a weekend.
- [ ] **Set max instances** on autoscaling services.
- [ ] Use **IAM roles** for services instead of long-lived access keys.
- [ ] Never make an S3/GCS bucket public unless it really hosts public files.
- [ ] Stop or delete GPU VMs when not in use; prefer scale-to-zero for demos.
- [ ] Turn on request logging so you can see who is calling your API.

> **Interview tip:** If asked how you deployed a project, mention the cost controls too: "Cloud Run with min instances 0 and max 5, secrets from Secret Manager, a budget alert." It shows production maturity.

## Key terms

| Term | Simple meaning |
|---|---|
| Cloud | Renting computing, storage and services over the internet |
| Region | Geographic location of data centres, e.g. Mumbai |
| IaaS / PaaS / SaaS | You manage the OS / only your app / nothing |
| IAM | System that controls who can do what on which resource |
| Least privilege | Give only the minimum permissions needed |
| EC2 / Compute Engine | Rent VMs, including GPU VMs |
| S3 / GCS / Blob Storage | Object storage for files, models and data |
| Bucket / object | A storage container / one stored file with a key |
| SageMaker AI / Vertex AI / Azure ML | Managed ML platforms for training and endpoints |
| Bedrock / Azure OpenAI | Hosted LLM APIs inside a cloud account |
| Lambda | Serverless functions billed per run; no GPU, 15-minute max |
| Fargate / Cloud Run / Container Apps | Serverless platforms that run your container |
| Kubernetes (EKS/GKE/AKS) | System for running many containers across many machines |
| Scale to zero | No instances (and no cost) when there is no traffic |
| Cold start | Delay when a new instance starts to serve a request |
| Concurrency | Requests one instance handles at the same time |
| Little's law | In-progress requests = arrival rate × time per request |
| Revision | An immutable version of a Cloud Run service |
| Break-even | Volume at which two cost options cost the same |

## Interview questions

**Which cloud services would you use to deploy a RAG chatbot on AWS?**
The container image in ECR, running on ECS Fargate behind an Application Load Balancer. Documents in S3, the LLM via Bedrock or a provider API, the vector store in OpenSearch or Postgres with pgvector, the API key in Secrets Manager, logs and metrics in CloudWatch. IAM roles give the service only the permissions it needs.

**What is the difference between Lambda and Fargate for serving a model?**
Lambda runs short functions, up to 15 minutes, with limited memory and no GPU, and has cold starts, so it suits light tasks. Fargate runs long-lived containers with more memory, so it suits a FastAPI model server. For large models or GPUs you need EC2, SageMaker endpoints, or a GPU-capable container platform.

**When would you use Bedrock or Azure OpenAI instead of calling the model provider directly?**
When the company wants data to stay inside its cloud account and region, unified billing, IAM-based access control, private networking, and compliance certifications it already trusts. The trade-off is that new models and features sometimes arrive there later than on the provider's own API.

**What is SageMaker and when would you use it?**
SageMaker AI is AWS's managed ML platform: notebooks, managed training jobs, a model registry, pipelines, and hosted endpoints with autoscaling. Use it when a team wants a standard ML platform on AWS. For a single FastAPI app, plain containers on Fargate are often simpler.

**How do you decide between a hosted LLM API and self-hosting an open model?**
Compare cost at expected volume: APIs cost per request; self-hosting has a large fixed GPU cost plus engineering time. Also consider quality, latency, data privacy rules, and whether you need a fine-tuned model. Usually start with an API; self-host at high steady volume or for strict privacy.

**What does scale to zero mean and what is the downside?**
When there is no traffic, the platform runs zero instances, so you pay nothing. The downside is a cold start for the next request: the container must start and load the model, which can take seconds or much longer for big models. Set min instances to 1 for latency-sensitive services.

**How would you size the number of instances for an API?**
Use Little's law: concurrent requests = requests per second × seconds per request. Divide by the concurrency one instance can handle, then add headroom. For example 200 rps × 0.5 s = 100 in flight, ÷ 20 per instance = 5 instances, so set a max of about 7.

**How do you keep cloud costs under control for an AI project?**
Budget alerts, max instance limits, scale to zero for low-traffic services, turning off idle GPUs, right-sizing instance types, caching LLM responses, using smaller models for easy tasks, and tracking token cost per feature.

**What is IAM least privilege? Give an example.**
Giving each user or service only the permissions it needs. For example, the API's role can read only `s3://docs-bucket/uploads/*` and invoke one Bedrock model, but cannot delete buckets or read other data. This limits damage if the service is compromised.

## Try it yourself

1. **Map the services.** Write the GCP and Azure equivalents of: EC2, S3, ECR, Fargate, SageMaker, Bedrock, Secrets Manager.
   *Hint:* Use the table above, then close it and try from memory.
2. **Size a deployment.** 50 requests/second, each takes 2 s, concurrency 10 per instance. How many instances, with 25% headroom?
3. **Break-even.** A GPU VM costs ₹150/hour (example). API cost is ₹0.30 per request (example). What monthly request volume makes them equal (30-day month)?
4. **Deploy.** Deploy your FastAPI container to Cloud Run (free tier is enough for a demo) with `--min-instances 0 --max-instances 2` and a secret.
   *Hint:* Follow the six steps; remember `--platform linux/amd64` on ARM machines.

### Answers

1. EC2 → Compute Engine / Azure VMs. S3 → Cloud Storage / Blob Storage. ECR → Artifact Registry / Azure Container Registry. Fargate → Cloud Run / Container Apps. SageMaker → Vertex AI / Azure Machine Learning. Bedrock → Vertex AI Model Garden / Azure OpenAI (AI Foundry). Secrets Manager → Secret Manager / Key Vault.
2. In flight = 50 × 2 = 100. Instances = 100 ÷ 10 = 10. With 25% headroom: 10 × 1.25 = 12.5 → **13 instances**.
3. Monthly GPU cost = 24 × 30 × 150 = 720 × 150 = ₹1,08,000. Break-even N = 1,08,000 ÷ 0.30 = **3,60,000 requests per month** (360,000).
4. Success looks like `curl https://<your-url>/health` returning `{"status":"ok","model_loaded":true}`. Then delete the service or keep min instances at 0 to avoid cost.

**Next:** [Serving Models](/interview/ai-engineer/mlops-deployment/serving-models)
