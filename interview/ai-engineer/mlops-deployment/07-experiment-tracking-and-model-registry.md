---
title: Experiment Tracking and Model Registry
part: Operations
summary: Why you must record every training run, MLflow tracking code (params, metrics, artifacts, autolog), the model registry with versions and aliases, loading the champion model in an API, versioning data with DVC, and MLflow features for LLM apps.
---

After a week of experiments you will have trained 40 models. Which one had F1 0.91? Which data and which learning rate did it use? Can you build it again exactly? Without a system, the honest answer is "I think it was the one in `model_final_v2_REAL.joblib`". Experiment tracking and a model registry fix this. They are the backbone of reproducible ML, and interviewers often ask "how did you choose and version your model?".

> **In simple words:** **Experiment tracking** = a diary that automatically records every training run: settings, scores and files. A **model registry** = a shelf of approved models with version numbers and labels like "champion", so your API always loads the right one.

## Why track experiments?

Each time you train, many things affect the result:

- the **code** version (Git commit),
- the **data** version (which rows, which date),
- **hyperparameters** (settings you choose before training, like learning rate or tree depth),
- the **environment** (library versions),
- the **random seed**.

**Reproducibility** means anyone can get the same model again from the same inputs. Without recording all of the above, you cannot reproduce, compare fairly, or explain to your manager why model B is better than model A.

> **Real-life example:** A chemistry lab notebook. Each experiment records date, chemicals, amounts, temperature and result. If one batch turns out perfect, you can make it again. A spreadsheet of "my_results.xlsx" that you fill in by hand is the same idea, but you will forget to fill it in.

| Approach | Problem |
|---|---|
| Filenames like `model_lr0.01_depth5.pkl` | Breaks after 10 runs; no metrics; no data version |
| Manual spreadsheet | People forget; no link to the actual model file |
| Experiment tracker (MLflow, W&B) | Automatic, searchable, linked to artifacts |

## MLflow concepts

**MLflow** is the most widely used open-source tool for tracking and registry. Its vocabulary:

| Term | Meaning | Example |
|---|---|---|
| **Experiment** | A named group of runs for one problem | `churn-classifier` |
| **Run** | One training execution | Logistic regression with C = 0.1 |
| **Parameter** | An input setting (logged once) | `C = 0.1`, `max_depth = 6` |
| **Metric** | A number measured (can be logged per step) | `val_f1 = 0.94`, `loss` per epoch |
| **Tag** | Free text label | `git_commit = 3f9c2ab`, `author = priya` |
| **Artifact** | Any file saved with the run | The model, a confusion matrix image, `requirements.txt` |
| **Model** (logged model) | A model saved in MLflow's standard format with its environment | `pipe` saved via `mlflow.sklearn.log_model` |
| **Tracking server** | The service that stores all of this, with a web UI | `http://mlflow.internal:5000` |

Where MLflow stores things:

- **Backend store**: run metadata (params, metrics, tags). Local files, SQLite, or Postgres/MySQL for a team.
- **Artifact store**: the files. A local folder, or S3 / GCS / Azure Blob for a team.

```bash
pip install mlflow scikit-learn
mlflow ui --port 5000             # local UI at http://localhost:5000 (stores in ./mlruns by default)

# A shared team server (Postgres for metadata, S3 for files):
mlflow server --host 0.0.0.0 --port 5000 \
  --backend-store-uri postgresql://user:pass@db:5432/mlflow \
  --default-artifact-root s3://my-mlflow-artifacts
```

## Tracking runs: the code

We tune a classifier on scikit-learn's breast cancer dataset (binary: malignant or benign), trying four values of `C`. (`C` is the inverse of regularization strength in logistic regression; smaller C = stronger regularization. See [Overfitting, Regularization and Cross-Validation](/interview/ai-engineer/machine-learning/overfitting-regularization-and-cross-validation).)

```python
# train_track.py
import subprocess

import mlflow
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, recall_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

mlflow.set_tracking_uri("http://localhost:5000")   # where to send runs
mlflow.set_experiment("cancer-classifier")         # created if it does not exist

X, y = load_breast_cancer(return_X_y=True, as_frame=True)
X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)

git_sha = subprocess.run(["git", "rev-parse", "--short", "HEAD"],
                         capture_output=True, text=True).stdout.strip() or "no-git"

results = []
for C in [0.01, 0.1, 1.0, 10.0]:
    with mlflow.start_run(run_name=f"logreg-C{C}"):          # one run per setting
        pipe = make_pipeline(StandardScaler(), LogisticRegression(C=C, max_iter=5000))
        pipe.fit(X_train, y_train)
        pred = pipe.predict(X_val)

        mlflow.log_params({"model": "logreg", "C": C, "test_size": 0.2, "seed": 42})
        metrics = {
            "val_f1": f1_score(y_val, pred),
            "val_recall": recall_score(y_val, pred),
            "val_accuracy": accuracy_score(y_val, pred),
        }
        mlflow.log_metrics(metrics)
        mlflow.set_tags({"git_commit": git_sha, "dataset": "sklearn-breast-cancer"})

        # Save the model (with its pip requirements and an input example)
        info = mlflow.sklearn.log_model(pipe, name="model",          # MLflow 3; in 2.x use artifact_path="model"
                                        input_example=X_train.head(2))
        results.append((metrics["val_f1"], C, info.model_uri))
        print(f"C={C:<5} f1={metrics['val_f1']:.3f}")

best_f1, best_C, best_uri = max(results)                    # highest F1 wins
print("best:", best_C, round(best_f1, 3), best_uri)
```

```text
C=0.01  f1=0.96...
C=0.1   f1=0.98...
C=1.0   f1=0.98...
C=10.0  f1=0.97...
best: ...
```

(Exact scores depend on the split and library version; they are all high because this dataset is easy.) Open `http://localhost:5000`: you will see four runs in a table, can sort by `val_f1`, select runs and press "Compare" to see charts of params against metrics.

> **Common mistake:** Choosing the best run by its score on the **test** set and then reporting that same test score. You have tuned on the test set, so the score is optimistic. Pick using a validation set (or cross-validation); report the test score once at the end.

### Logging per-step metrics and files

For neural network training, log metrics per epoch to get curves:

```python
with mlflow.start_run():
    for epoch in range(10):
        train_loss, val_loss = train_one_epoch(), evaluate()       # your functions
        mlflow.log_metric("train_loss", train_loss, step=epoch)    # step → x-axis
        mlflow.log_metric("val_loss", val_loss, step=epoch)
    mlflow.log_artifact("confusion_matrix.png")                    # any file
    mlflow.log_dict({"labels": ["benign", "malignant"]}, "labels.json")
```

### Autologging

Many libraries can be tracked automatically. One line before training logs params, metrics and the model:

```python
mlflow.sklearn.autolog()        # also: mlflow.pytorch.autolog(), mlflow.xgboost.autolog(), mlflow.lightgbm.autolog()
pipe.fit(X_train, y_train)      # params, training metrics and the model are logged by itself
```

Autolog is great for a quick start. For the metrics you actually decide on (like validation recall), still log them explicitly so you know exactly how they were computed.

### Searching runs in code

```python
runs = mlflow.search_runs(
    experiment_names=["cancer-classifier"],
    filter_string="metrics.val_recall > 0.95",
    order_by=["metrics.val_f1 DESC"],
)
print(runs[["run_id", "params.C", "metrics.val_f1", "metrics.val_recall"]].head(3))
```

`search_runs` returns a pandas DataFrame, so you can build reports or automatic "pick the best" scripts.

### Worked example: choosing between runs

Suppose (illustrative numbers) your fraud model runs show:

| Run | Model | val precision | val recall | val F1 | p95 latency |
|---|---|---|---|---|---|
| A | Logistic regression | 0.80 | 0.70 | ? | 2 ms |
| B | XGBoost | 0.85 | 0.80 | ? | 8 ms |
| C | XGBoost (deeper) | 0.86 | 0.81 | ? | 35 ms |

F1 = 2 × P × R ÷ (P + R).
- A: 2 × 0.80 × 0.70 ÷ 1.50 = 1.12 ÷ 1.50 = **0.747**
- B: 2 × 0.85 × 0.80 ÷ 1.65 = 1.36 ÷ 1.65 = **0.824**
- C: 2 × 0.86 × 0.81 ÷ 1.67 = 1.3932 ÷ 1.67 = **0.834**

C is best by F1, by only 0.010 over B. But if the payment API's latency budget is 20 ms, C is not allowed. **B is the right choice.** Tracking latency along with quality metrics lets you make this decision from data. (Metrics: [Evaluation Metrics](/interview/ai-engineer/machine-learning/evaluation-metrics).)

## The model registry

Tracking records *all* runs. Most are experiments you will never deploy. The **model registry** is where you put the models that matter, as numbered **versions** of a **registered model**.

<figure>
<svg viewBox="0 0 440 170" width="440" height="170" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<text x="60" y="20" text-anchor="middle" fill="currentColor" stroke="none" font-weight="bold">Experiment runs</text>
<rect x="10" y="30" width="100" height="30" rx="6" />
<text x="60" y="50" text-anchor="middle" fill="currentColor" stroke="none">run A  F1 .75</text>
<rect x="10" y="70" width="100" height="30" rx="6" />
<text x="60" y="90" text-anchor="middle" fill="var(--accent)" stroke="none">run B  F1 .82</text>
<rect x="10" y="110" width="100" height="30" rx="6" />
<text x="60" y="130" text-anchor="middle" fill="currentColor" stroke="none">run C  F1 .83</text>
<line x1="110" y1="85" x2="160" y2="85" />
<polygon points="160,85 152,81 152,89" fill="currentColor" />
<text x="135" y="77" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">register</text>
<text x="225" y="20" text-anchor="middle" fill="currentColor" stroke="none" font-weight="bold">Model registry</text>
<rect x="160" y="30" width="130" height="115" rx="8" />
<text x="225" y="58" text-anchor="middle" fill="currentColor" stroke="none">v1 (old)</text>
<text x="225" y="90" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">v2 @champion</text>
<text x="225" y="122" text-anchor="middle" fill="currentColor" stroke="none">v3 @challenger</text>
<line x1="290" y1="90" x2="340" y2="90" />
<polygon points="340,90 332,86 332,94" fill="currentColor" />
<rect x="340" y="70" width="90" height="40" rx="8" />
<text x="385" y="95" text-anchor="middle" fill="currentColor" stroke="none">API</text>
<text x="385" y="130" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">loads @champion</text>
</svg>
<figcaption>Good runs are registered as numbered versions; aliases like champion tell the API which version to load, so switching models is a label change, not a code change.</figcaption>
</figure>

Key ideas:

- **Registered model**: a name, like `cancer-classifier`.
- **Version**: each registration adds v1, v2, v3... Versions are immutable and each links back to the run that made it (so you know its params, data and code).
- **Alias**: a movable label pointing to one version, like `champion` (serving now) and `challenger` (being tested). Moving the alias is how you promote or roll back. (Older MLflow used fixed **stages** — Staging, Production, Archived. Stages are deprecated; use aliases and tags.)
- **Tags** on versions: `validation_status=approved`, `approved_by=team-lead`.

```python
from mlflow import MlflowClient

client = MlflowClient()
mv = mlflow.register_model(best_uri, "cancer-classifier")   # creates version N
print(mv.version)                                            # Output: e.g. 1

client.set_model_version_tag("cancer-classifier", mv.version, "validation_status", "approved")
client.set_registered_model_alias("cancer-classifier", "champion", mv.version)
```

### Loading the champion in your API

The API should not hard-code a file path. It asks the registry for whatever version is `champion`:

```python
# in FastAPI lifespan (see the FastAPI chapter)
import mlflow

mlflow.set_tracking_uri("http://mlflow.internal:5000")
MODEL_URI = "models:/cancer-classifier@champion"            # name@alias

model = mlflow.pyfunc.load_model(MODEL_URI)                 # generic interface for any flavor
version = mlflow.MlflowClient().get_model_version_by_alias("cancer-classifier", "champion").version
# model.predict(pandas_dataframe) → predictions
```

Release flow:

1. Train → many runs tracked.
2. Best run passes evaluation → register as new version (v3).
3. Set alias `challenger` → v3. Run it in shadow or canary mode (see [CI/CD and Testing for AI](/interview/ai-engineer/mlops-deployment/ci-cd-and-testing-for-ai)).
4. If it wins, move `champion` → v3 and restart or reload the API.
5. If it causes problems, move `champion` back → v2. **Rollback takes seconds.**

> **Interview tip:** "We never deploy a file; we deploy a registry version. The API loads `models:/name@champion`. Promotion and rollback are alias changes, and each version links back to its run, code commit and data version." This answer covers reproducibility, governance and rollback in one breath.

> **Common mistake:** Loading the registry model at *every request*. Load it once at startup (or on a reload signal) and cache it in memory.

## Versioning data with DVC

Git is great for code but bad for large files: a 2 GB CSV makes the repo huge and slow. Yet to reproduce a model, you need the exact data.

**DVC** (Data Version Control) solves this. It stores large files in remote storage (S3, GCS, a shared drive) and keeps only a tiny **pointer file** (`.dvc`) with the file's hash in Git. When you check out an old Git commit, `dvc pull` fetches the data that matched it.

```bash
pip install "dvc[s3]"
git init && dvc init                      # once per repo

dvc add data/train.csv                    # creates data/train.csv.dvc (small) and adds train.csv to .gitignore
git add data/train.csv.dvc data/.gitignore
git commit -m "Add training data v1"

dvc remote add -d storage s3://my-bucket/dvc
dvc push                                  # upload the real file to S3

# Later, on another machine or an old commit:
git checkout <old-commit>
dvc pull                                  # downloads the data version for that commit
```

The pointer file looks like:

```yaml
outs:
- md5: 3f1c...e9a2
  size: 2147483648
  path: train.csv
```

DVC can also define **pipelines** (`dvc.yaml`: prepare → train → evaluate) and rerun only the stages whose inputs changed, like a Makefile for ML.

Log the data hash (or DVC commit) as an MLflow tag. Then each model version links to code (Git SHA), data (DVC hash), params and metrics: full **lineage** (the history of where something came from).

| Tool | Versions what | Notes |
|---|---|---|
| Git | Code, configs, prompts | Not for big files |
| DVC | Data and model files via pointers in Git | Works with any storage |
| Git LFS | Large files in Git hosting | Simpler, less ML-aware, storage limits |
| lakeFS / Delta Lake / Iceberg | Data lakes and tables | For big data platforms |
| MLflow registry | Model versions with aliases | Links to runs |

## Alternatives to MLflow

| Tool | Strength |
|---|---|
| MLflow | Open source, self-hostable, tracking + registry + GenAI tracing; also offered as a managed service on Databricks and some clouds |
| Weights & Biases (W&B) | Polished hosted UI, great for deep learning dashboards and sweeps |
| Neptune, Comet | Hosted trackers with similar features |
| SageMaker AI / Vertex AI / Azure ML | Tracking and registry built into the cloud ML platform |

The concepts (run, params, metrics, artifacts, versions, aliases) are the same everywhere.

## Tracking for LLM apps

With LLM apps, you often do not train anything, but you still run experiments: prompt A vs prompt B, chunk size 500 vs 1,000, model X vs model Y. Track them the same way.

- **Params**: model name, temperature, prompt version, chunk size, top-k retrieved.
- **Metrics**: scores on your eval set (faithfulness, answer correctness, pass rate), average tokens, cost per query, p95 latency.
- **Artifacts**: the prompt text, the eval results table.

```python
import mlflow

mlflow.set_experiment("rag-prompt-tuning")
for prompt_version in ["v3", "v4"]:
    with mlflow.start_run(run_name=f"prompt-{prompt_version}"):
        scores = run_eval_set(prompt_version)          # your eval function (see the evaluation chapter)
        mlflow.log_params({"prompt_version": prompt_version, "model": "claude-sonnet-5-5",
                           "chunk_size": 800, "top_k": 5})
        mlflow.log_metrics({"faithfulness": scores["faithfulness"],
                            "pass_rate": scores["pass_rate"],
                            "avg_cost_inr": scores["avg_cost_inr"]})
        mlflow.log_text(open(f"prompts/{prompt_version}.txt").read(), "prompt.txt")
```

Recent MLflow versions (3.x) also add GenAI features: **tracing** of LLM calls (with autolog integrations for popular SDKs and frameworks), LLM evaluation with judges, and a **prompt registry** to version prompts like models. Dedicated LLM observability tools (Langfuse, LangSmith) overlap with these; see [Monitoring, Cost and Caching](/interview/ai-engineer/mlops-deployment/monitoring-cost-and-caching). Evaluation methods themselves are in [Evaluating LLM Apps](/interview/ai-engineer/llms-genai/evaluating-llm-apps).

## Key terms

| Term | Simple meaning |
|---|---|
| Experiment tracking | Automatically recording each training run's settings, scores and files |
| Reproducibility | Being able to rebuild the same model from the same inputs |
| Hyperparameter | A setting chosen before training (C, learning rate, depth) |
| MLflow | Open-source tool for tracking, model registry and more |
| Experiment / run | A group of attempts / one attempt |
| Parameter / metric / tag | Logged input setting / measured number / free label |
| Artifact | A file saved with a run (model, plot) |
| Backend store / artifact store | Where run metadata / files are stored |
| Autolog | Automatic logging of params, metrics and model for a library |
| Model registry | Catalogue of approved model versions |
| Registered model / version | A named model / one immutable numbered copy |
| Alias | Movable label (champion, challenger) pointing to a version |
| Stage (deprecated) | Old fixed labels: Staging, Production, Archived |
| `models:/name@alias` | URI to load the version an alias points to |
| Champion / challenger | Model in production / candidate being tested |
| DVC | Tool that versions data with pointer files in Git |
| Lineage | Record of which code, data and params produced a model |
| Prompt registry | Versioned store for prompts |

## Interview questions

**Why do we need experiment tracking?**
To make results reproducible and comparable. Each run records code version, data version, hyperparameters, metrics and artifacts automatically. Without it you cannot say which settings made the best model, rebuild it, or explain decisions to the team.

**What do you log for each run?**
Parameters (hyperparameters, data split, seed), metrics on validation data (and per-epoch curves for deep learning), tags for the Git commit and data version, and artifacts such as the model with its environment, plots and the evaluation table. For deployment decisions I also log latency and model size.

**What is a model registry and why not just store models in S3?**
A registry gives named models with immutable numbered versions, each linked to the run that produced it, plus aliases like champion and approval tags. S3 alone stores files but not lineage, approvals or a clean way to promote and roll back. Often the registry uses S3 underneath as its artifact store.

**How do you promote a model to production and roll back?**
Register the candidate as a new version, label it challenger, and test it with offline evals and a canary or shadow deployment. If it wins, move the champion alias to it; the API loads `models:/name@champion`. To roll back, move the alias back to the previous version and reload.

**What is the difference between MLflow stages and aliases?**
Stages were fixed labels (Staging, Production, Archived) with one model per stage, and they are now deprecated. Aliases are flexible, named pointers to versions, so you can have champion, challenger or any label you define, and move them freely.

**How do you version data?**
With a tool like DVC: the data lives in remote storage and a small pointer file with its hash is committed to Git, so each commit references the exact data. I also log the data hash as an MLflow tag so each model version has full lineage.

**How do you make a training run reproducible?**
Pin library versions, fix random seeds, version the data, record the Git commit, log all hyperparameters and the environment, and keep preprocessing inside the saved pipeline. Ideally the training runs inside a container from a known image.

**How does experiment tracking apply to LLM applications?**
Each run is a configuration: prompt version, model, temperature, chunk size, top-k. Metrics are eval-set scores like faithfulness and pass rate, plus cost and latency. Artifacts include the prompt text and per-question results. Tools like MLflow and Langfuse also trace individual LLM calls.

**Your best run on validation is only 0.01 F1 better but 4× slower. What do you do?**
Check the latency budget and whether 0.01 is even significant, for example with cross-validation or a confidence interval. If the gain is within noise or the slower model breaks the latency requirement, choose the faster model. Business constraints decide, not the leaderboard alone.

## Try it yourself

1. **Track a sweep.** Run the `train_track.py` example with a `RandomForestClassifier` instead, trying `max_depth` in [3, 5, 10, None]. Open the MLflow UI and compare runs.
   *Hint:* Change the pipeline and the params you log.
2. **Register and load.** Register the best run, set alias `champion`, then load it with `mlflow.pyfunc.load_model("models:/cancer-classifier@champion")` and predict on 3 rows.
3. **Compute F1 and choose.** Run X: precision 0.90, recall 0.60. Run Y: precision 0.75, recall 0.78. Which has higher F1? If missing a positive is very costly (cancer), which would you pick and why?
4. **DVC.** In a test repo, `dvc add` a CSV, commit, change the CSV, `dvc add` again, commit. Then check out the first commit and `dvc checkout`. Confirm the old data is back.

### Answers

1. Replace with `make_pipeline(RandomForestClassifier(max_depth=d, random_state=42))` (scaling is not needed for trees) and `mlflow.log_params({"model": "rf", "max_depth": str(d)})`. In the UI, sort by `val_f1` and use Compare.
2.
```python
mv = mlflow.register_model(best_uri, "cancer-classifier")
MlflowClient().set_registered_model_alias("cancer-classifier", "champion", mv.version)
m = mlflow.pyfunc.load_model("models:/cancer-classifier@champion")
print(m.predict(X_val.head(3)))       # Output: e.g. [1 0 1]
```
3. X: 2 × 0.90 × 0.60 ÷ 1.50 = 1.08 ÷ 1.50 = **0.720**. Y: 2 × 0.75 × 0.78 ÷ 1.53 = 1.17 ÷ 1.53 = **0.765**. Y has higher F1. For cancer, missing a real case is the costly error, so recall matters most: **Y** (recall 0.78 vs 0.60) is the better choice too.
4. After `git checkout <first-commit>` and `dvc checkout`, the CSV content matches the first version, because the `.dvc` pointer file at that commit holds the first hash.

**Next:** [CI/CD and Testing for AI](/interview/ai-engineer/mlops-deployment/ci-cd-and-testing-for-ai)
