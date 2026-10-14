---
title: How to Build a Portfolio
part: Start
summary: What recruiters and interviewers actually check, how to pick projects, the GitHub repo layout, a README template, the demo video, deployment and resume bullets with numbers.
---

A portfolio is the proof that you can build things, not only talk about them. For a fresher or a career switcher, it is often the only proof you have. This chapter explains what people check when they open your GitHub, how to choose and present projects, and how to turn each project into resume lines that get you interviews. The rest of this book then walks you through building five projects, one step at a time.

> **In simple words:** Build a few projects that solve real problems, deploy them so anyone can try them, write a clear README, and describe each one on your resume with what you built, how, and a number that shows the result.

## Why a portfolio matters for AI Engineer roles

Many people now finish online AI courses. A certificate shows that you watched videos. It does not show that you can take messy data, write working code, handle errors, measure quality and ship something. A portfolio project shows all of that.

An **AI Engineer** is a software engineer who builds products on top of machine learning models and large language models (LLMs). The job is less about inventing new models and more about connecting models, data and software so that real users get value. So your portfolio should look like a software engineer's portfolio, with the AI part done properly:

- Clean code that someone else can run.
- A clear problem and a clear result.
- Measurement: "how do you know it works?"
- Deployment: a link that works.

> **Real-life example:** When you buy a used phone on OLX, a seller who says "works perfectly" is less convincing than a seller who sends a video of the phone turning on, the camera working and the battery health screen. Your portfolio is that video for your skills.

## What recruiters and interviewers check

Different people look at your work in different ways, and they give it different amounts of time.

<figure>
<svg viewBox="0 0 440 150" width="440" height="150" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<rect x="5" y="30" width="90" height="50" rx="8" />
<text x="50" y="52" text-anchor="middle" fill="currentColor" stroke="none">Resume</text>
<text x="50" y="70" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">10 seconds</text>
<line x1="95" y1="55" x2="113" y2="55" />
<polygon points="113,51 121,55 113,59" fill="currentColor" />
<rect x="121" y="30" width="90" height="50" rx="8" />
<text x="166" y="52" text-anchor="middle" fill="currentColor" stroke="none">README</text>
<text x="166" y="70" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">1 minute</text>
<line x1="211" y1="55" x2="229" y2="55" />
<polygon points="229,51 237,55 229,59" fill="currentColor" />
<rect x="237" y="30" width="90" height="50" rx="8" />
<text x="282" y="52" text-anchor="middle" fill="currentColor" stroke="none">Live demo</text>
<text x="282" y="70" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">2 minutes</text>
<line x1="327" y1="55" x2="345" y2="55" />
<polygon points="345,51 353,55 345,59" fill="currentColor" />
<rect x="353" y="30" width="82" height="50" rx="8" />
<text x="394" y="52" text-anchor="middle" fill="currentColor" stroke="none">Code</text>
<text x="394" y="70" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">interview</text>
<text x="220" y="120" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Each step must make them want the next one</text>
</svg>
<figcaption>Most people stop at the resume or the README, so those two must be the strongest.</figcaption>
</figure>

| Who | How long | What they look for |
|---|---|---|
| Recruiter (HR) | 10–30 seconds | Keywords that match the job (RAG, FastAPI, Docker, PyTorch), a link that works, numbers in bullets |
| Hiring manager | 1–3 minutes | Is the problem real? Is there a demo? Does the README explain the design and results? |
| Interviewer (technical round) | 10–30 minutes of questions | Do you understand every part? Why did you choose X over Y? What failed? How did you measure it? |
| Senior engineer reading code | 5 minutes | Folder structure, small functions, no secrets in the repo, tests, requirements file, clear commits |

> **Interview tip:** Interviewers often say "Tell me about a project you are proud of." They are checking three things: did you really build it, do you understand the trade-offs, and can you explain clearly. The last chapter of this book, [Explaining Your Projects in Interviews](/interview/ai-projects/explaining-your-projects-in-interviews), trains you for exactly this.

## Choosing projects

### Fewer, deeper projects win

Three strong projects are better than ten copies of tutorials. A **tutorial clone** is a project where you followed a video line by line, such as "Titanic survival prediction" or "MNIST digit classifier". Interviewers have seen these thousands of times. They are fine for learning, but they do not stand out.

What makes a project strong:

1. **A real user and a real problem.** "Students waste time searching long PDFs for answers" is better than "I wanted to try RAG".
2. **End to end.** Data in, model or LLM in the middle, a working app out.
3. **Measured.** You have an **evaluation** (a repeatable test of quality) with a number: accuracy, recall, retrieval hit rate, faithfulness, latency, cost.
4. **Deployed.** A public link or at least a one-command local run with Docker.
5. **Your own decisions.** You changed something from the tutorial and can explain why.

### The five projects in this book

This book follows the 150-day plan from the [AI Engineer Roadmap](/interview/ai-roadmap/how-to-use-this-roadmap). Each project appears right after you learn the skills it needs.

| Project | Days | What it proves | Main skills |
|---|---|---|---|
| [Churn prediction](/interview/ai-projects/mini-project-churn-prediction) | 49–50 | You can do classical ML properly | Pandas, scikit-learn pipelines, metrics, threshold choice, saving a model |
| [Image classifier](/interview/ai-projects/mini-project-image-classifier) | 64–66 | You can train deep learning models | PyTorch, transfer learning, training loop, Gradio demo |
| [RAG PDF chatbot](/interview/ai-projects/project-rag-pdf-chatbot) | 89–96 | You can build the most common LLM product | Chunking, embeddings, Chroma, Claude API, citations, FastAPI, eval set |
| [Research agent](/interview/ai-projects/project-research-agent) | 97–103 | You understand agents and tools | Tool calling, ReAct loop, guardrails, LangGraph, MCP server, agent eval |
| [Capstone: AI Study Assistant](/interview/ai-projects/capstone-full-stack-ai-app) | 131–142 | You can ship a production-style AI app | Auth, Postgres + pgvector, Docker Compose, cloud deploy, tracing, cost tracking |

The two mini projects are practice. The three main projects are what you put at the top of your resume. If you only have time to polish one, polish the RAG chatbot and the capstone, because most AI Engineer jobs in 2026 involve retrieval and LLM apps.

### How to make a project your own

Start from the guide in this book, then change at least one meaningful thing:

- **Domain:** use PDFs from a field you know: GATE notes, Indian tax rules, your college syllabus, a company's HR policy.
- **Language:** support Hindi or Hinglish questions.
- **Feature:** add something not in the guide (see each chapter's "Stretch goals").
- **Measurement:** run an experiment and report it, for example "chunk size 500 vs 1000 characters".

> **Common mistake:** Copying a project, renaming it, and putting it on the resume. In the interview, one question like "why did you use an overlap of 150 characters?" exposes it. Only claim what you built and understood.

## The GitHub repository layout

A clean repository tells a reviewer you work like a professional. Use this layout for every project (each chapter gives the exact tree):

```text
project-name/
├── README.md            # the front page: problem, demo, how to run, results
├── requirements.txt     # pinned or minimum versions of libraries
├── .env.example         # names of secret variables, with fake values
├── .gitignore           # ignores .env, data/, models/, __pycache__/, .venv/
├── src/ or app/         # your code, split into small modules
├── tests/               # pytest tests
├── eval/                # evaluation data and scripts
├── notebooks/           # optional: exploration only, not the main code
├── Dockerfile           # for projects you deploy
└── docs/                # screenshots, architecture diagram
```

Rules that reviewers notice:

- **Never commit secrets.** API keys go in a `.env` file that is listed in `.gitignore`. Commit only `.env.example`. If you ever push a key by mistake, **revoke it immediately** in the provider's console. Deleting the commit is not enough, because bots scan GitHub within minutes.
- **Do not commit large data or model files.** Put a download script or a link in the README instead.
- **Small, meaningful commits.** "Add chunking with overlap" is better than "update" ten times.
- **Pin the main library versions** in `requirements.txt` so the project still runs next year.
- **A pinned repo:** on your GitHub profile, pin your best 3–6 repositories.

A `.gitignore` you can reuse for every Python AI project:

```text
.venv/
__pycache__/
*.pyc
.env
data/
models/
chroma_db/
*.joblib
*.pt
.ipynb_checkpoints/
.DS_Store
```

## The README template

The **README** is the front page of your project. Most people read only this file, so it must answer "what, why, how, how well" in under a minute. Copy this template and fill it in for every project.

```text
# Project Name — one line saying what it does

![demo](docs/demo.gif)

**Live demo:** https://your-link   ·   **Video (2 min):** https://your-video-link

## Problem
Two or three sentences. Who has the problem? Why does it matter?

## What it does
- Bullet 1: main feature
- Bullet 2: second feature
- Bullet 3: how it shows its sources / explains its result

## Architecture
![architecture](docs/architecture.png)
One paragraph: the flow from input to output, and the main components.

## Tech stack
Python 3.12 · FastAPI · Chroma · sentence-transformers · Claude API · Docker

## Results
| Metric | Value | How measured |
|---|---|---|
| Retrieval hit rate @5 | 0.90 | 30-question eval set in eval/ |
| Median latency | 2.1 s | 30 requests on my laptop |

## How to run
    git clone https://github.com/you/project-name
    cd project-name
    python -m venv .venv && source .venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env   # add your API key
    python -m app.ingest data/pdfs
    uvicorn app.api:app --reload

## Design decisions
- Why chunk size 800 characters with 150 overlap
- Why Chroma instead of Pinecone
- Why I refuse to answer when retrieval scores are low

## Limitations and next steps
- Scanned PDFs (images) are not supported yet
- Next: hybrid search with BM25

## What I learned
Two or three honest lines.
```

The numbers in that template are only examples. Put your real measured numbers, even if they are not impressive. "Hit rate 0.70, improved to 0.85 after adding overlap" is a great story.

> **Interview tip:** The "Design decisions" and "Limitations" sections are where you win. They show that you made choices on purpose and that you know the weak points. Interviewers often ask questions straight from these sections.

## The demo video

A **demo video** is a short screen recording that shows the project working. Many hiring managers will watch a 2-minute video but will not clone your code.

How to record a good one:

1. **Length:** 90 seconds to 3 minutes.
2. **Structure:** problem (15 s) → live use of the app (60–90 s) → architecture diagram (20 s) → results and what you would improve (20 s).
3. **Tools:** OBS Studio (free), or the built-in screen recorder on Windows (Win + Alt + R with Xbox Game Bar) or macOS (Cmd + Shift + 5).
4. **Upload:** YouTube (unlisted is fine) or Loom. Put the link at the top of the README.
5. **Also make a GIF** of 5–10 seconds for the README itself, so people see it without clicking.

Speak slowly and clearly. You do not need perfect English. Clear structure matters more than accent.

## Deployment: give them a link

**Deployment** means putting your app on a server so anyone can open it in a browser. A working link removes all doubt.

| Option | Good for | Cost | Notes |
|---|---|---|---|
| Hugging Face Spaces | Gradio or Streamlit demos (image classifier, simple RAG) | Free tier (CPU) | Easiest. Push code, it builds. Sleeps when idle. |
| Streamlit Community Cloud | Streamlit apps from a GitHub repo | Free | Good for UIs; secrets set in the dashboard. |
| Google Cloud Run | Any Docker container (FastAPI backend) | Free tier, then pay per use | Scales to zero. Used in the capstone. |
| AWS App Runner / ECS, Azure Container Apps | Any Docker container | Pay per use | Same idea as Cloud Run; good if the job asks for AWS or Azure. |
| Render / Railway / Fly.io | Small full-stack apps | Small free or cheap tiers | Simple; free tiers change often, so check current limits. |

Free tiers and prices change often. Check the current limits before you choose, and set a **budget alert** in any cloud account so a bug cannot cost you money. For LLM apps, also set a **spending limit** on your API key in the provider's console.

> **Common mistake:** A live demo that calls a paid LLM API with no limits. Someone can spam it and spend your money. Add a simple rate limit, a daily cap, or a password to the demo. The capstone chapter shows how.

For details on containers and cloud services, see [Docker Basics](/interview/mlops-deployment/docker-basics) and [Cloud for AI](/interview/mlops-deployment/cloud-for-ai).

## Resume bullets that get interviews

### The STAR idea, compressed

**STAR** stands for Situation, Task, Action, Result. In an interview you tell the full story. On a resume you compress it into one line: **action verb + what you built + how (key tech) + result with a number.**

Weak bullet:

```text
Made a chatbot using LangChain and OpenAI.
```

Strong bullet:

```text
Built a RAG chatbot over 40 policy PDFs (FastAPI, Chroma, Claude API) that answers with
page-level citations; raised retrieval hit rate from 0.72 to 0.90 on a 30-question eval set
by tuning chunk size and adding overlap.
```

Why the second one works:

- It starts with a strong verb: Built, Designed, Deployed, Reduced, Improved.
- It names the keywords recruiters search for.
- It has numbers: 40 PDFs, 0.72 → 0.90, 30 questions.
- It shows a decision: you tuned something and measured the effect.

### Worked example: computing an honest number

Say your RAG eval set has 30 questions. For each one you know which page holds the answer. You check whether that page appears in the top 5 retrieved chunks.

- First version: the right page appeared for 21 of 30 questions. Hit rate = 21 ÷ 30 = 0.70.
- After changing chunk size from 1500 to 800 characters and adding 150 characters of overlap: 27 of 30. Hit rate = 27 ÷ 30 = 0.90.
- Improvement = 0.90 − 0.70 = 0.20, which is 20 percentage points. In relative terms, 0.20 ÷ 0.70 ≈ 0.286, so about 29% better.

Now you can write: "improved retrieval hit rate from 0.70 to 0.90 (30-question eval)". Every number is real and you can explain how you got it.

> **Remember:** Say "percentage points" when you subtract two percentages (70% → 90% is +20 points). Say "percent" when you divide (a 29% relative improvement). Interviewers notice when people mix these up.

### Numbers you can measure in any project

| Kind of number | Example |
|---|---|
| Quality | ROC-AUC 0.84, recall 0.80, accuracy 88%, hit rate @5 0.90, faithfulness 0.93 |
| Speed | median latency 1.8 s, p95 latency 4.2 s |
| Cost | ₹0.85 per question, 60% lower cost after prompt caching |
| Scale | 40 PDFs, 3,200 chunks, 7,043 customers |
| Effort saved | "replaces about 10 minutes of manual searching per question" (only if you measured it with real users) |

Never invent numbers. If you have no users, do not write "used by 1,000 students". Write what you measured.

## When to work on the portfolio in the 150-day plan

- **Day 49–50, 64–66:** build the two mini projects. Push to GitHub with a short README.
- **Day 89–103:** build the RAG chatbot and the research agent. These get full READMEs and demo videos.
- **Around Day 110:** start applying. You will already have three good projects. See the [roadmap](/interview/ai-roadmap/how-to-use-this-roadmap) for timing.
- **Day 131–142:** build and deploy the capstone. Then update your resume and pin the repositories.
- **Day 143–150:** practise explaining every project out loud using [the last chapter](/interview/ai-projects/explaining-your-projects-in-interviews).

Each project chapter is designed to fit its day range at about 3.5 hours per day. If you fall behind, cut the stretch goals, not the eval or the README.

## Key terms

| Term | Simple meaning |
|---|---|
| Portfolio | A set of projects that proves you can build things |
| AI Engineer | A software engineer who builds products using ML models and LLMs |
| Tutorial clone | A project copied step by step from a tutorial without your own decisions |
| Evaluation (eval) | A repeatable test that measures how good your system is, with a number |
| README | The front-page document of a repository |
| Demo video | A short screen recording that shows the project working |
| Deployment | Putting the app on a server so others can use it through a link |
| STAR | Situation, Task, Action, Result: a way to structure a project story |
| Percentage points | The plain difference between two percentages (70% → 90% = +20 points) |
| `.env` / `.env.example` | A file of secret settings (never committed) and its safe template (committed) |
| Budget alert | A cloud setting that emails you when spending passes a limit |

## Interview questions

**Walk me through your best project.**
Start with the problem and the user in one sentence. Then give the architecture in three or four steps, the one or two hardest decisions, how you measured quality, and the result with a number. End with what you would improve. Keep it to about two minutes, then let the interviewer choose where to go deeper.

**How do you know your project works?**
I built an evaluation set before I tuned anything. For the RAG chatbot it was 30 questions with the page that contains each answer, so I could measure retrieval hit rate and check answers for faithfulness. I ran the same eval after every change, so I could see whether a change helped or hurt.

**Why should we care about a project and not a certificate?**
A certificate shows I completed a course. A project shows I can take an unclear problem, make design decisions, handle errors, measure results and ship something people can use. The deployed link and the eval numbers can be checked; a certificate cannot show any of that.

**What was the hardest bug in your project and how did you fix it?**
Pick a real one. A good structure is: what you saw, how you narrowed down the cause, the fix, and how you made sure it does not come back (for example, a test). For example: "Answers cited the wrong page. I printed the retrieved chunks and saw page numbers were off by one because pypdf pages start at 0. I fixed it by storing page index plus one and added a test."

**How did you keep secrets safe in your repository?**
API keys live in a `.env` file that is in `.gitignore`, and the code reads them from environment variables. The repository only contains `.env.example` with fake values. In the cloud I used the platform's secret manager instead of plain environment variables in the config.

**If you had two more weeks, what would you add?**
Name one improvement that fixes a measured weakness, not a random feature. For example: "My eval shows the chatbot fails on questions that need two documents, so I would add query decomposition and measure the hit rate on those questions again."

**Did you use a framework like LangChain? Why or why not?**
Either answer is fine if you can explain it. A good answer: "I wrote the first version in plain Python so I understood every step: chunk, embed, retrieve, prompt. Then I tried LangGraph for the agent because it gave me state handling and retries. For the simple RAG pipeline, plain code was easier to debug."

**How much does your app cost to run?**
Give token math. "One question uses about 3,000 input tokens and 400 output tokens. At the model's price per million tokens, that is about one US cent per question. I log tokens for every call, so I know the real average, and I added a daily cap per user."

## Try it yourself

1. **Audit a repository.** Open one of your old repositories (or any public tutorial repository). List five things you would change using the rules in this chapter. *Hint:* check for secrets, a missing `requirements.txt`, no README results, notebooks as the only code, and large files.
2. **Rewrite a bullet.** Rewrite this bullet using the formula verb + what + how + number: "Did a project on sentiment analysis using BERT." *Hint:* invent nothing; leave a placeholder like `<accuracy>` if you have not measured it yet.
3. **Compute the improvement.** Your image classifier's accuracy went from 82% to 91%. Write the improvement in percentage points and in relative percent. *Hint:* subtract for points, divide by the old value for relative.

### Answers

1. Typical findings: an API key hard-coded in a notebook (move to `.env`, revoke the key); no `requirements.txt` (add one with versions); README has no results or run instructions (use the template); all code lives in one notebook (move it into modules under `src/`); dataset CSV or model file committed (remove it, add to `.gitignore`, add a download step).
2. Example: "Fine-tuned a BERT classifier on 25,000 movie reviews (Hugging Face Transformers, PyTorch) reaching `<accuracy>` test accuracy versus `<baseline>` for a TF-IDF + logistic regression baseline; served it with FastAPI." Replace placeholders with measured values.
3. Points: 91 − 82 = 9 percentage points. Relative: 9 ÷ 82 ≈ 0.1098, so about 11% relative improvement. Another useful view: error rate fell from 18% to 9%, which halves the errors.

**Next:** [Mini Project: Customer Churn Prediction](/interview/ai-projects/mini-project-churn-prediction)
