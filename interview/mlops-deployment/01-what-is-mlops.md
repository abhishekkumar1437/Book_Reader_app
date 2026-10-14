---
title: What Is MLOps
part: Start
summary: The machine learning lifecycle, the many reasons a model that works in a notebook fails in production, how MLOps differs from DevOps, and what changes for LLM apps (LLMOps).
---

Training a model is maybe 20% of the work. The other 80% is getting it to real users, keeping it fast and cheap, noticing when it gets worse, and fixing it without breaking anything. This chapter gives you the map for the whole book. In AI engineer interviews, "how would you put this in production?" is asked after almost every project discussion, so this map is worth knowing well.

> **In simple words:** MLOps is the set of habits and tools that take a model from "works on my laptop" to "works for 1 lakh users every day, and we know when it breaks". LLMOps is the same idea for apps built on large language models.

## The ML lifecycle

A model in production is not a one-time thing. It is a loop. You collect data, train, evaluate, deploy, watch it, and when the world changes, you go back and train again. This loop is called the **ML lifecycle**.

<figure>
<svg viewBox="0 0 440 260" width="440" height="260" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<rect x="20" y="30" width="100" height="40" rx="8" />
<text x="70" y="55" text-anchor="middle" fill="currentColor" stroke="none">Collect data</text>
<rect x="170" y="30" width="100" height="40" rx="8" />
<text x="220" y="55" text-anchor="middle" fill="currentColor" stroke="none">Train</text>
<rect x="320" y="30" width="100" height="40" rx="8" />
<text x="370" y="55" text-anchor="middle" fill="currentColor" stroke="none">Evaluate</text>
<rect x="320" y="190" width="100" height="40" rx="8" />
<text x="370" y="215" text-anchor="middle" fill="currentColor" stroke="none">Deploy</text>
<rect x="170" y="190" width="100" height="40" rx="8" />
<text x="220" y="215" text-anchor="middle" fill="currentColor" stroke="none">Monitor</text>
<rect x="20" y="190" width="100" height="40" rx="8" />
<text x="70" y="215" text-anchor="middle" fill="currentColor" stroke="none">Detect drift</text>
<line x1="120" y1="50" x2="170" y2="50" />
<polygon points="170,50 162,46 162,54" fill="currentColor" />
<line x1="270" y1="50" x2="320" y2="50" />
<polygon points="320,50 312,46 312,54" fill="currentColor" />
<line x1="370" y1="70" x2="370" y2="190" />
<polygon points="370,190 366,182 374,182" fill="currentColor" />
<line x1="320" y1="210" x2="270" y2="210" />
<polygon points="270,210 278,206 278,214" fill="currentColor" />
<line x1="170" y1="210" x2="120" y2="210" />
<polygon points="120,210 128,206 128,214" fill="currentColor" />
<line x1="70" y1="190" x2="70" y2="70" />
<polygon points="70,70 66,78 74,78" fill="currentColor" />
<text x="220" y="125" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">The loop never stops</text>
<text x="220" y="145" text-anchor="middle" fill="currentColor" stroke="none">retrain when the world changes</text>
<text x="395" y="135" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">pass?</text>
</svg>
<figcaption>The ML lifecycle is a loop: monitoring in production feeds new data and new training runs.</figcaption>
</figure>

Each step in plain words:

| Step | What happens | Example (fraud model for UPI payments) |
|---|---|---|
| Collect data | Gather and label examples | Past payments marked "fraud" or "not fraud" |
| Train | Fit a model on the data | Train a gradient boosting classifier |
| Evaluate | Check quality on data the model has not seen | Recall on last month's frauds ≥ 90%? |
| Deploy | Make the model answer real requests | An API that scores each payment in < 50 ms |
| Monitor | Watch inputs, outputs, speed, errors, cost | Fraud rate, latency, input value ranges |
| Detect drift | Notice the world has changed | New scam pattern; model misses it |

In a small team, one person may do all six. In a big company, data engineers, ML engineers, platform engineers and AI engineers split them. As an AI engineer you are expected to understand the full loop, even if you own only part of it.

> **Real-life example:** A model is like a new cricket player. Selecting him (training) is only the start. The coach watches every match (monitoring), notices when bowlers find his weakness (drift), and sends him back to the nets (retraining).

## Why models fail in production

A model that scored 95% in your notebook can fail on day one in production. Here are the most common reasons. Interviewers love this list because it shows you have shipped real things.

### 1. Training-serving skew

**Training-serving skew** means the data the model sees in production is prepared differently from the data it was trained on. The model is fine; the plumbing is wrong.

Example: in the notebook you scaled "amount" by dividing by 1000. The API developer forgot this step and sends raw rupees. The model now sees ₹50,000 as 50,000 instead of 50, and every big payment looks like fraud.

The fix is to put all preprocessing inside the saved model object, for example a scikit-learn `Pipeline` (see [Pipelines and Hyperparameter Tuning](/interview/machine-learning/pipelines-and-hyperparameter-tuning)).

```python
# BAD: preprocessing lives in the notebook only
X_scaled = (X - X.mean()) / X.std()          # the API will forget to do this
model.fit(X_scaled, y)

# GOOD: preprocessing is saved together with the model
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
import joblib

pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
pipe.fit(X, y)                                # scaler learns mean/std here
joblib.dump(pipe, "model.joblib")             # one file = scaler + model
# The API loads model.joblib and calls pipe.predict(raw_X). No skew.
```

### 2. Data drift and concept drift

**Data drift** means the input data changes. During a Big Billion Days sale, average order value on Flipkart jumps. The model never saw so many large orders.

**Concept drift** means the relationship between input and answer changes. Last year a ₹2,000 payment at 2 a.m. was suspicious. Now night food delivery is normal, so the same input should get a different answer.

Both slowly reduce quality. You only catch them if you monitor. Chapter 9 ([Monitoring, Cost and Caching](/interview/mlops-deployment/monitoring-cost-and-caching)) shows how.

### 3. Data quality problems

An upstream team renames a column, a sensor sends `null`, a date comes in a new format. The model does not crash; it silently gives bad answers. This is why you validate inputs (Pydantic in [FastAPI for AI Apps](/interview/mlops-deployment/fastapi-for-ai-apps)) and check data before training.

### 4. Too slow or too expensive

A model that takes 3 seconds per prediction is useless for a payment that must be approved in 200 ms. An LLM feature that costs ₹4 per user query may lose money on a ₹99/month plan. Latency and cost are product requirements, not afterthoughts.

### 5. Environment differences

"It works on my machine." Different Python version, different library version, missing system library. **Docker** solves this by packaging the code with its whole environment ([Docker Basics](/interview/mlops-deployment/docker-basics)).

### 6. No feedback loop

Nobody records what the model predicted or whether it was right. Months later, someone asks "is the model still good?" and nobody knows. Logging predictions and collecting labels later is part of the job.

### Worked example: watching accuracy fall

A churn model is checked every month on 1,000 customers whose real outcome is now known. The team set an alert: retrain if accuracy goes below 85%.

| Month | Correct out of 1,000 | Accuracy | Alert? |
|---|---|---|---|
| 1 | 920 | 920 ÷ 1000 = 92.0% | No |
| 2 | 915 | 91.5% | No |
| 3 | 900 | 90.0% | No |
| 4 | 870 | 87.0% | No |
| 5 | 820 | 82.0% | **Yes** (82 < 85) |

From month 1 to month 5 accuracy dropped 92.0 − 82.0 = 10 percentage points. Without the monthly check, the team would never notice. With it, they retrain in month 5 on recent data.

> **Common mistake:** Saying "I would retrain every week" without saying how you know retraining helped. Always pair retraining with evaluation on fresh data and a comparison against the current model.

## MLOps vs DevOps

**DevOps** is the practice of building, testing and releasing normal software quickly and safely: version control, automated tests, CI/CD (automatic build-test-deploy pipelines), infrastructure as code, monitoring.

**MLOps** takes all of DevOps and adds the things that are special about ML. In normal software, behaviour comes only from code. In ML, behaviour comes from **code + data + model weights**. Any of the three can change and break things.

| Topic | DevOps (normal software) | MLOps (ML systems) |
|---|---|---|
| What you version | Code | Code + data + model + config |
| What tests check | Logic is correct (pass/fail) | Logic + model quality (a score, e.g. F1 ≥ 0.80) |
| Why it breaks | A code change | Code change OR data change OR world change (drift) |
| Build output | A binary / container | A container + a trained model artifact |
| Monitoring | Errors, latency, CPU | All of that + input drift, prediction quality |
| Release | Deploy new code | Deploy new code or new model, often separately |
| Extra steps | – | Experiment tracking, model registry, retraining |

> **Interview tip:** A crisp one-liner: "DevOps versions and tests code. MLOps also versions and tests data and models, because in ML the behaviour comes from data, and data changes even when code does not."

### MLOps maturity levels

Google describes three levels. It is a useful way to talk about a team's setup.

| Level | Name | What it looks like |
|---|---|---|
| 0 | Manual | Notebook training, model file copied by hand to a server. No monitoring. |
| 1 | Automated training | A pipeline retrains on new data automatically; models go to a registry; basic monitoring. |
| 2 | Automated CI/CD for pipelines | Changes to the training pipeline itself are tested and deployed automatically; full monitoring and triggers. |

Most startups are at level 0 or 1. That is fine. In an interview, show you know where you are and what the next step would be.

## LLMOps: what changes for LLM apps

Many AI engineer jobs in 2026 build on top of large language models (LLMs) through an API or an open model, instead of training models from scratch. **LLMOps** is MLOps for these apps. Some things get easier (you often do not train anything), and new things appear.

| Concern | Classical MLOps | LLMOps |
|---|---|---|
| Main artifact | Your trained model | Prompts, retrieval setup, tool definitions, model choice |
| Training | You train often | Usually none; sometimes fine-tuning (see [Fine-Tuning with LoRA and QLoRA](/interview/llms-genai/fine-tuning-lora-and-qlora)) |
| Evaluation | Accuracy, F1 on labelled test set | Golden datasets, LLM-as-judge, faithfulness (see [Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps)) |
| Cost driver | Training compute, small inference servers | Tokens per request × requests, or GPU hours |
| Latency | Milliseconds | Seconds; time to first token matters, so you stream |
| Failure types | Wrong prediction | Hallucination, prompt injection, unsafe output, wrong tool call |
| Versioning | Model versions | Prompt versions + model versions + index versions |
| Drift | Input data drift | Provider model updates, new user question types, stale documents |

The key LLMOps habits:

1. **Treat prompts as code.** Keep them in files under Git, give them versions, review changes.
2. **Have an eval set before you change anything.** 50–200 real questions with expected answers. Run it on every prompt or model change.
3. **Trace every call.** Log the prompt, retrieved documents, model, tokens, latency, cost.
4. **Control cost.** Cache, choose smaller models for easy tasks, limit output tokens.
5. **Add guardrails.** Check inputs and outputs for injection, PII and unsafe content (see [Safety, Guardrails and Prompt Injection](/interview/llms-genai/safety-guardrails-and-prompt-injection)).

> **Remember:** LLM apps still need everything from MLOps: tests, containers, CI/CD, monitoring. They add prompt versioning, eval sets, token cost tracking and guardrails.

## The tool map for this book

You do not need every tool. You need one tool per box and the reason it exists.

| Job | Tools you will meet | Chapter |
|---|---|---|
| Serve a model as an API | FastAPI, Pydantic, Uvicorn | [FastAPI for AI Apps](/interview/mlops-deployment/fastapi-for-ai-apps) |
| Package the environment | Docker, Docker Compose | [Docker Basics](/interview/mlops-deployment/docker-basics), [Docker for ML and Compose](/interview/mlops-deployment/docker-for-ml-and-compose) |
| Run it somewhere | AWS, GCP, Azure; Cloud Run, ECS | [Cloud for AI](/interview/mlops-deployment/cloud-for-ai) |
| Serve LLMs on GPUs | vLLM, TGI, Ollama | [Serving Models](/interview/mlops-deployment/serving-models) |
| Track experiments and models | MLflow, DVC | [Experiment Tracking and Model Registry](/interview/mlops-deployment/experiment-tracking-and-model-registry) |
| Test and release safely | pytest, GitHub Actions, canary | [CI/CD and Testing for AI](/interview/mlops-deployment/ci-cd-and-testing-for-ai) |
| Watch and save money | Langfuse, OpenTelemetry, Redis caching | [Monitoring, Cost and Caching](/interview/mlops-deployment/monitoring-cost-and-caching) |

In the 150-day plan this book covers Days 111–122: FastAPI on Days 111–114, Docker on 115–117, cloud and serving on 118–120, MLflow/CI/monitoring on 121–122. You will then use all of it in the capstone ([Capstone: Full-Stack AI App](/interview/ai-projects/capstone-full-stack-ai-app)).

## What "production-ready" means

When an interviewer asks "is your project production-ready?", they are checking a list like this:

- [ ] Preprocessing is inside the saved model or shared code (no skew)
- [ ] Inputs are validated; bad input returns a clear 4xx error, not a crash
- [ ] Runs in a container with pinned versions
- [ ] Has a health check endpoint
- [ ] Has automated tests, including a model quality check
- [ ] Secrets (API keys) are in environment variables, not in code
- [ ] Logs requests, latency, errors, and for LLMs, tokens and cost
- [ ] Can roll back to the previous model quickly
- [ ] Has a plan for retraining or updating prompts when quality drops

> **Interview tip:** When asked "how would you deploy this?", walk the lifecycle out loud: "I would wrap the pipeline in a FastAPI service, containerize it, deploy behind a load balancer with a canary release, log inputs and predictions, track latency p95, and set a drift alert that triggers retraining." That one sentence covers six chapters of this book.

## Key terms

| Term | Simple meaning |
|---|---|
| MLOps | Practices and tools to deploy, monitor and maintain ML models reliably |
| ML lifecycle | The loop: data → train → evaluate → deploy → monitor → retrain |
| Training-serving skew | Production data is prepared differently from training data |
| Data drift | The distribution of inputs changes over time |
| Concept drift | The relationship between inputs and the correct answer changes |
| DevOps | Practices to build, test and release normal software fast and safely |
| CI/CD | Continuous integration / continuous delivery: automatic build, test and deploy |
| Model artifact | The saved trained model file (e.g. `model.joblib`) |
| Model registry | A store of model versions with labels like "champion" |
| LLMOps | MLOps for LLM-based apps: prompts, evals, tokens, guardrails |
| Golden dataset | A fixed set of inputs with known good answers used for evaluation |
| Guardrails | Checks on LLM inputs/outputs for safety and correctness |
| Maturity level | How automated a team's ML process is (level 0, 1, 2) |

## Interview questions

**What is MLOps and why do we need it?**
MLOps is the practice of deploying, monitoring and maintaining ML models in production reliably. We need it because a model's behaviour depends on data, and data changes. Without MLOps you get training-serving skew, silent quality drops from drift, and no way to reproduce or roll back a model. It brings DevOps habits like versioning, testing and CI/CD to code, data and models together.

**How is MLOps different from DevOps?**
DevOps versions and tests code; tests are pass/fail. MLOps also versions data and models, and tests include quality scores like F1 above a threshold. ML systems can break with no code change at all, because the world changes. So MLOps adds experiment tracking, a model registry, drift monitoring and retraining.

**Why do models that work in a notebook fail in production?**
Common reasons: training-serving skew (different preprocessing), data drift and concept drift, bad or missing input data, latency or cost that is too high, environment differences, and no monitoring. I prevent skew by saving preprocessing inside a pipeline, and catch drift by monitoring inputs and quality over time.

**What is the difference between data drift and concept drift?**
Data drift is when the input distribution changes, like higher order values during a sale. Concept drift is when the correct answer for the same input changes, like a payment pattern that used to be fraud becoming normal. Data drift can be detected from inputs alone; concept drift usually needs labels or proxy signals.

**What is training-serving skew and how do you prevent it?**
It is when the features the model sees at serving time are computed differently from training. Prevent it by putting preprocessing in the same saved object as the model (scikit-learn Pipeline), sharing one feature code library for training and serving, or using a feature store. Also log serving inputs and compare their statistics with training data.

**What is LLMOps? What is new compared to MLOps?**
LLMOps is MLOps for LLM apps. The main artifacts are prompts, retrieval indexes and model choices rather than trained weights. New concerns are token cost, time to first token, hallucination, prompt injection, prompt versioning, and evaluation without a single correct label, often using LLM-as-judge.

**Describe the MLOps maturity levels.**
Level 0 is manual: notebooks and hand-copied model files. Level 1 automates the training pipeline so models retrain on new data and go to a registry. Level 2 also automates testing and deployment of the pipeline code itself with CI/CD. Most teams start at 0 and should aim for 1 first.

**What does "production-ready" mean for an ML service?**
Input validation, containerized with pinned versions, health checks, automated tests including quality checks, secrets in environment variables, logging and monitoring of latency, errors and drift, a rollback path, and a retraining or prompt-update plan.

**If accuracy drops after deployment, what do you check first?**
First check if it is a data problem, not a model problem: did an upstream schema change, are there nulls, did preprocessing change? Then compare recent input distributions with training data for drift. If inputs look fine, check for concept drift with fresh labels. Only then retrain, and compare the new model with the old one before switching.

## Try it yourself

1. **List failure modes for your own project.** Take the churn model from [Mini Project: Churn Prediction](/interview/ai-projects/mini-project-churn-prediction). Write down one concrete example of each of the six failure reasons in this chapter.
   *Hint:* Think about what columns could change, what could be null, and what could happen during a festival offer.
2. **Compute an alert.** A model is checked weekly on 400 labelled examples. Correct counts: 372, 368, 361, 340. The alert threshold is 88%. In which week does the alert fire?
   *Hint:* Divide each count by 400.
3. **Fix the skew.** Rewrite this so the API cannot forget the encoding: training code does `df["city"] = df["city"].map({"Delhi": 0, "Mumbai": 1})` and then fits a `RandomForestClassifier`.
   *Hint:* Use `ColumnTransformer` with `OneHotEncoder` inside a `Pipeline`.

### Answers

1. Example answers: skew (tenure in months in training, days in API); data drift (many new users after an ad campaign); concept drift (a competitor's cheaper plan changes who churns); data quality (`monthly_charges` arrives as a string "₹499"); latency/cost (fine here, the model is small); environment (scikit-learn version differs between notebook and server, so `joblib.load` warns or fails); no feedback (nobody records who actually left).
2. Week 1: 372 ÷ 400 = 93.0%. Week 2: 368 ÷ 400 = 92.0%. Week 3: 361 ÷ 400 = 90.25%. Week 4: 340 ÷ 400 = 85.0%. The alert fires in **week 4** (85.0 < 88).
3.
```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

pre = ColumnTransformer(
    [("city", OneHotEncoder(handle_unknown="ignore"), ["city"])],
    remainder="passthrough",          # keep other numeric columns as they are
)
pipe = Pipeline([("pre", pre), ("rf", RandomForestClassifier(random_state=0))])
pipe.fit(df.drop(columns="churn"), df["churn"])
# Save pipe; the API sends raw "Delhi"/"Mumbai" strings. New cities are ignored, not crashed on.
```

**Next:** [FastAPI for AI Apps](/interview/mlops-deployment/fastapi-for-ai-apps)
