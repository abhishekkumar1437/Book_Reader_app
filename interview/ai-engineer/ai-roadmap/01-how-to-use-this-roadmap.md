---
title: How to Use This Roadmap
part: Start
summary: The whole 150-day plan on one page, your daily and weekly routine, how to study so that it sticks, how to use every book on this shelf, how to track progress, what to do when you fall behind, and when to start applying for jobs.
---

This book is your timetable. It does not teach AI by itself. It tells you, day by day, which chapter of which book to read, which coding problem to solve, and how to check that you really understood it. Follow it for 150 days, about 4.5 hours a day, and you will finish with strong Python, solid ML and deep learning basics, real LLM skills (RAG, agents, fine-tuning), deployment skills, three portfolio projects, and practice for every interview round an AI Engineer faces.

> **In simple words:** Open this book every morning. Find today's row in the week's table. Do the DSA hour, do the 3.5-hour topic, write 15 minutes of notes, and tick the box. Every 7th day, revise instead of learning new things.

## What an AI Engineer does

Before the plan, be clear about the goal. An **AI Engineer** builds software products that use AI models. Most of the job today is not inventing new models. It is taking existing models (like Claude, GPT, Llama or a scikit-learn model) and turning them into reliable products: a chatbot that answers from company documents, an agent that books tickets, a model that predicts which customers will leave.

So the job needs four kinds of skill, and the plan follows them in this order:

| Skill | Why you need it | Where in the plan |
|---|---|---|
| Programming (Python, DSA, SQL, Git) | Everything is built in code, and coding rounds filter most candidates | Phase 1 and the daily DSA hour |
| ML and deep learning understanding | To choose models, explain results and answer "why" questions | Phases 2–5 |
| LLM application skills (prompting, RAG, agents, fine-tuning, evaluation) | This is the core of most AI Engineer jobs in 2026 | Phase 6 |
| Production skills (APIs, Docker, cloud, monitoring, system design) | A model is useless until users can reach it safely and cheaply | Phases 7–8 |

Projects (Phase 9 and the 🛠 days) tie all four together and give you something to show.

## The plan on one page

There are 10 phases across 150 days. The days are fixed. Every book on this shelf uses the same day numbers, so when a chapter says "Days 89–96", it means the same days as here.

| Phase | Days | What you learn | Main books | 🛠 What you build |
|---|---|---|---|---|
| 1 Foundations | 1–20 | Python (1–12), NumPy, Pandas, Matplotlib (13–17), Git, Linux, SQL (18–20) | [Python](/interview/python), [Databases & SQL](/interview/databases-sql) | Small scripts, one EDA notebook |
| 2 Math for ML | 21–30 | Linear algebra (21–24), probability and statistics (25–27), calculus (28–30) | [Math for ML](/interview/ai-engineer/math-for-ml) | Gradient descent by hand and in NumPy |
| 3 Classical ML | 31–50 | Basics, regression, trees, other algorithms, evaluation | [Machine Learning](/interview/ai-engineer/machine-learning) | Mini project 1: churn prediction (49–50) |
| 4 Deep Learning | 51–66 | Neural networks, training, PyTorch, CNN and RNN | [Deep Learning](/interview/ai-engineer/deep-learning) | Mini project 2: image classifier (64–66) |
| 5 NLP & Transformers | 67–80 | Text and tokens, attention, the Transformer, BERT/GPT/T5, Hugging Face | [NLP & Transformers](/interview/ai-engineer/nlp-transformers) | Fine-tuned text classifier |
| 6 LLMs & GenAI | 81–110 | How LLMs work, prompting, embeddings, vector DBs, RAG, agents, MCP, fine-tuning, evaluation, safety | [LLMs & GenAI](/interview/ai-engineer/llms-genai) | Project 1: RAG PDF chatbot (89–96), Project 2: research agent (97–103) |
| 7 MLOps & Deployment | 111–122 | FastAPI, Docker, cloud, serving, MLflow, CI/CD, monitoring | [MLOps & Deployment](/interview/ai-engineer/mlops-deployment) | Your RAG chatbot running in the cloud |
| 8 AI System Design | 123–130 | A design framework and 5 case studies | [AI System Design](/interview/ai-engineer/ai-system-design), [System Design](/interview/system-design) | Design diagrams you can draw from memory |
| 9 Capstone & Portfolio | 131–142 | One full-stack AI app, README, deploy, demo, resume | [AI Portfolio Projects](/interview/ai-engineer/ai-projects) | Project 3: AI Study Assistant |
| 10 Interview Mode | 143–150 | Question banks, project deep-dives, mock interviews, revision | All question banks | Your interview notes |

<figure>
<svg viewBox="0 0 440 240" width="440" height="240" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="20" y="40" width="400" height="30" rx="4" />
<line x1="73.3" y1="40" x2="73.3" y2="70" />
<line x1="100" y1="40" x2="100" y2="70" />
<line x1="153.3" y1="40" x2="153.3" y2="70" />
<line x1="196" y1="40" x2="196" y2="70" />
<line x1="233.3" y1="40" x2="233.3" y2="70" />
<line x1="313.3" y1="40" x2="313.3" y2="70" />
<line x1="345.3" y1="40" x2="345.3" y2="70" />
<line x1="366.7" y1="40" x2="366.7" y2="70" />
<line x1="398.7" y1="40" x2="398.7" y2="70" />
<text x="46.7" y="60" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<text x="86.7" y="60" text-anchor="middle" fill="currentColor" stroke="none">2</text>
<text x="126.7" y="60" text-anchor="middle" fill="currentColor" stroke="none">3</text>
<text x="174.7" y="60" text-anchor="middle" fill="currentColor" stroke="none">4</text>
<text x="214.7" y="60" text-anchor="middle" fill="currentColor" stroke="none">5</text>
<text x="273.3" y="60" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">6</text>
<text x="329.3" y="60" text-anchor="middle" fill="currentColor" stroke="none">7</text>
<text x="356" y="60" text-anchor="middle" fill="currentColor" stroke="none">8</text>
<text x="382.7" y="60" text-anchor="middle" fill="currentColor" stroke="none">9</text>
<text x="409.3" y="60" text-anchor="middle" fill="currentColor" stroke="none">10</text>
<line x1="20" y1="34" x2="20" y2="40" />
<line x1="100" y1="34" x2="100" y2="40" />
<line x1="196" y1="34" x2="196" y2="40" />
<line x1="313.3" y1="34" x2="313.3" y2="40" />
<line x1="366.7" y1="34" x2="366.7" y2="40" />
<line x1="420" y1="34" x2="420" y2="40" />
<text x="20" y="28" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">Day 1</text>
<text x="100" y="28" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">31</text>
<text x="196" y="28" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">67</text>
<text x="313.3" y="28" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">111</text>
<text x="366.7" y="28" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">131</text>
<text x="420" y="28" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">150</text>
<line x1="73.3" y1="70" x2="73.3" y2="76" />
<line x1="153.3" y1="70" x2="153.3" y2="76" />
<line x1="233.3" y1="70" x2="233.3" y2="76" />
<line x1="345.3" y1="70" x2="345.3" y2="76" />
<line x1="398.7" y1="70" x2="398.7" y2="76" />
<text x="73.3" y="88" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">21</text>
<text x="153.3" y="88" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">51</text>
<text x="233.3" y="88" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">81</text>
<text x="345.3" y="88" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">123</text>
<text x="398.7" y="88" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">143</text>
<text x="20" y="130" fill="currentColor" stroke="none">1 Foundations · Days 1–20</text>
<text x="20" y="150" fill="currentColor" stroke="none">2 Math for ML · 21–30</text>
<text x="20" y="170" fill="currentColor" stroke="none">3 Classical ML · 31–50</text>
<text x="20" y="190" fill="currentColor" stroke="none">4 Deep Learning · 51–66</text>
<text x="20" y="210" fill="currentColor" stroke="none">5 NLP &amp; Transformers · 67–80</text>
<text x="230" y="130" fill="var(--accent)" stroke="none" font-weight="bold">6 LLMs &amp; GenAI · 81–110</text>
<text x="230" y="150" fill="currentColor" stroke="none">7 MLOps · 111–122</text>
<text x="230" y="170" fill="currentColor" stroke="none">8 AI System Design · 123–130</text>
<text x="230" y="190" fill="currentColor" stroke="none">9 Capstone · 131–142</text>
<text x="230" y="210" fill="currentColor" stroke="none">10 Interview Mode · 143–150</text>
</svg>
<figcaption>The 10 phases drawn to scale. Phase 6 (LLMs and GenAI) is the longest because it is the heart of most AI Engineer jobs.</figcaption>
</figure>

Notice the shape. The first 80 days build understanding: Python, math, ML, deep learning, Transformers. Days 81–150 turn that understanding into products and then into interview answers. Do not skip the first half to "get to LLMs faster". Interviewers ask "why does RAG beat fine-tuning here?" or "what is the loss function of a classifier?", and only the first half lets you answer.

> **Remember:** Every 7th day (7, 14, 21, … 147) is a revision day. No new chapters on those days, except where the week chapter says "light reading".

## Your daily routine

You study about 4 hours 45 minutes a day: 1 hour of DSA, 3.5 hours of the current topic, and 15 minutes of notes. Split it into blocks with breaks. Your brain learns better in focused blocks of 45–90 minutes than in one long sitting.

| Block | Time | What you do |
|---|---|---|
| 1. DSA | 1 h | Solve today's 1–2 problems from the [DSA book](/interview/dsa-python). Timer on. Plain editor first. |
| Break | 10 min | Walk, water, no phone scrolling |
| 2. Recall | 15 min | Without notes, write what you learned yesterday. Then check your notes. |
| 3. Read and understand | 1 h 15 min | Read today's chapter slowly. Run every code example yourself. |
| Break | 15 min | |
| 4. Build and practise | 1 h 30 min | Do the chapter's "Try it yourself" exercises, or today's project step |
| 5. Explain | 30 min | Answer 3–4 of the chapter's interview questions out loud, then compare with the model answer |
| 6. Notes | 15 min | One page: today's key ideas, one diagram, mistakes you made, questions you still have |

Two example timetables:

| If you are… | DSA | Topic | Notes |
|---|---|---|---|
| A full-time learner | 7:00–8:00 | 8:15–10:00 and 10:30–12:15 | 12:15–12:30 |
| Working or in college | 6:30–7:30 before work | 7:30–11:00 pm in two blocks (or 2 h on weekdays + more on weekends) | Before sleep |

If you work full time and cannot do 4.5 hours, stretch the plan. Do each "day" in 1.5 days. 150 days becomes about 225 days. That is fine. Finishing slowly beats quitting fast.

## Your weekly routine

Six learning days and one revision day. On the revision day, do this:

| Time | Revision day task |
|---|---|
| 1 h | DSA: redo, from a blank file, the two problems you found hardest this week. Do not look at old code. |
| 1 h | Read your six pages of notes. Then close them and write the week's main ideas from memory. |
| 1 h | Answer the week chapter's "End-of-week self-check" questions out loud. Mark any you could not answer. |
| 1 h | Fix the marked gaps: re-read only those sections, or redo one exercise. Update your progress tracker. |
| 15 min | Look at next week's table so you know what is coming. |

Keep the revision day lighter. Rest is part of learning. Your brain stores memories during sleep and rest, not only while you read.

## How to study so that it sticks

Reading a chapter and nodding along feels like learning. It mostly is not. The four habits below are what make knowledge survive until interview day.

### Active recall

**Active recall** means pulling information out of your memory instead of putting it in again. Close the book and ask yourself: "What is precision? How do I compute it?" Then answer before you check.

Why it works: every time you successfully remember something, the memory becomes stronger. Re-reading only makes the page look familiar, and familiar is not the same as knowing.

How to do it:

- At the start of every topic block, spend 15 minutes writing what you learned yesterday, from memory.
- Turn headings into questions. "Bias–variance trade-off" becomes "What is the bias–variance trade-off, with an example?"
- Use the "Interview questions" section of each chapter as your recall test. Answer first, then read the model answer.

> **Real-life example:** Think of a cricket batsman in the nets. Watching videos of cover drives does not make you play one. Facing 100 balls does. Active recall is facing the balls.

### The Feynman technique

The **Feynman technique** is named after the physicist Richard Feynman. The idea: if you cannot explain something in simple words, you do not understand it yet. It has four steps.

1. Pick a topic, for example "gradient descent".
2. Explain it out loud, or on paper, as if to a 12-year-old cousin. No jargon. "The model guesses, checks how wrong it is, and then takes a small step in the direction that makes it less wrong."
3. Notice where you got stuck or used a big word you could not explain. That is your gap.
4. Go back to the chapter, fill the gap, and explain again, simpler.

This is also exactly what an interview is: explaining clearly to someone. Practising Feynman-style explanations is interview practice.

### Spaced revision

**Spaced revision** means revising the same thing several times with growing gaps between the sessions. Memory fades quickly at first and more slowly after each revision. A simple schedule:

| When | What |
|---|---|
| Same day | 15 minutes of notes |
| Next day | 15-minute recall at the start of the topic block |
| Day 7 | Weekly revision day |
| About 30 days later | Re-read that week's notes and redo its self-check |

The plan already builds in the first three. For the fourth, on each revision day also spend 15 minutes on the week from about a month earlier. For example, on Day 35 also skim Week 1 notes.

### Notes that you will actually use

Write one page per day. Not a copy of the chapter, but what you need to remember. Use the same template every day:

```text
Day 37 · Logistic regression
1. Big idea (2 lines in my own words):
2. Key formulas / code I must remember:
3. One diagram:
4. A mistake I made today:
5. Questions I still have:
6. Interview question I can now answer:
```

Keep notes in one place: a notebook, a single Markdown file per week, or a notes app. In Phase 10 your notes become your fastest revision material.

### Build while you learn

You do not understand a model until you have written code that uses it. Every day has a coding part: run the chapter examples, change a number, see what breaks. Push your daily code to one GitHub repository (for example `ai-150-days`) with a folder per week. By Day 150 this repository shows 150 days of steady work, and recruiters do look at that.

### The mistakes log

Keep one plain text file where every mistake becomes one line. The [DSA study plan](/interview/dsa-python/study-plan) explains this for coding. Use it for ML too:

```text
Day 46  Said accuracy is fine for fraud detection. Wrong: 99% of data is "not fraud". Use recall / PR-AUC.
Day 59  Forgot optimizer.zero_grad(), so gradients added up across batches.
```

Read the whole log before every mock interview. After a month you will see the same five mistakes repeating. Those five are your real study list.

## The books on this shelf

You will use every book on this shelf. This table tells you when.

| Book | When you use it |
|---|---|
| [AI Engineer Roadmap](/interview/ai-engineer/ai-roadmap) (this book) | Every day, to know what to do |
| [Python](/interview/python) | Days 1–14, then its question bank in Phase 10 |
| [Data Structures & Algorithms](/interview/dsa-python) | The 1-hour DSA block on all 150 days |
| [Databases & SQL](/interview/databases-sql) | Days 19–20, then the question bank on Day 146 |
| [Math for Machine Learning](/interview/ai-engineer/math-for-ml) | Days 21–30, and whenever an ML chapter uses a formula you forgot |
| [Machine Learning](/interview/ai-engineer/machine-learning) | Days 31–56 |
| [Deep Learning with PyTorch](/interview/ai-engineer/deep-learning) | Days 51–70 |
| [NLP & Transformers](/interview/ai-engineer/nlp-transformers) | Days 67–80 |
| [LLMs & Generative AI](/interview/ai-engineer/llms-genai) | Days 81–110, the biggest book of the plan |
| [MLOps & Deployment](/interview/ai-engineer/mlops-deployment) | Days 111–122 |
| [AI System Design](/interview/ai-engineer/ai-system-design) | Days 123–130 |
| [System Design](/interview/system-design) | Selected chapters on Days 123–126, for general backend design |
| [AI Portfolio Projects](/interview/ai-engineer/ai-projects) | Project days: 49–50, 64–66, 89–96, 97–103, 131–142 |
| [AI Glossary A–Z](/interview/ai-engineer/ai-glossary) | Any time you meet a word you do not know. Keep it open in a second tab. |

Each concept chapter in those books ends with "Key terms", "Interview questions" and "Try it yourself". Do all three. They are not optional extras; they are where the learning happens.

## How to read a week chapter

Every week chapter in this book has the same parts:

| Section | How to use it |
|---|---|
| Goal and "In simple words" | Read on the first day of the week, so you know where you are going |
| Day-by-day plan | Your daily instructions. The last column, "Done when…", tells you when you can stop |
| What each topic means | Short plain-English meanings of every new term. Read it before the chapter if a word scares you, and after it to check yourself |
| Checklist | Tick each box only when you can do the thing without notes |
| End-of-week self-check | Your revision-day test. Answer out loud first, then read the answers |
| If you fall behind | What is safe to skip or shorten that week |

## Tracking your progress

Track three things. A simple spreadsheet or a text file is enough.

```text
Day | Date   | Topic done? | DSA solved (self / with hint / read solution) | Hours | Note
1   | 1 Nov  | yes         | Two Sum II (self), Valid Palindrome (hint)     | 4.5   | venv confusing
2   | 2 Nov  | yes         | Move Zeroes (self)                             | 4.0   |
```

- **Topic progress**: did you finish the "Done when…" for the day?
- **DSA honesty**: mark each problem as solved by yourself, with a hint, or by reading the solution. Only "self" counts as solved. Redo the others within three days.
- **Checklist score**: on each revision day, count the ticked boxes in the week's checklist. Aim for at least 80%.

Also look at your GitHub commit graph once a week. A green square for most days is a good sign that you are building, not only reading.

## When you fall behind

You will fall behind at some point. Illness, exams, family functions, a hard topic. This is normal. What matters is how you respond.

1. **Never try to "catch up" by doing two days in one.** You will be tired, learn less, and fall further behind. Instead, move the whole plan forward by the missed days.
2. **Use the revision day as a buffer.** If you are one day behind, use the revision day to finish the missed day, and do a shorter 1-hour revision.
3. **Check the week's "If you fall behind" section.** It lists what is safe to compress. For example, you can read the RNN chapter quickly, but you cannot skip attention.
4. **Protect three things always**: the DSA hour, the projects, and Phase 6 (LLMs). These three decide most interview results.
5. **If you are more than 7 days behind**, drop the "nice to have" parts listed in each week and keep going. A finished plan with some skipped details is far better than a perfect plan stopped at Day 60.

> **Common mistake:** Restarting from Day 1 after a two-week break. Instead, do one revision day for the weeks you have done, then continue from where you stopped.

## When to start applying

Do not wait until Day 150 to apply. Hiring takes weeks, and real interviews are the best practice.

| When | What to do |
|---|---|
| Day 1 | Create or clean up your LinkedIn and GitHub profiles. Start the `ai-150-days` repository. |
| After Day 50 (mini project 1 done) | If you are a student, start applying for **internships** and data/ML intern roles. One finished project is enough for many internships. |
| After Day 66 (mini project 2 done) | Write a first resume version with both mini projects. Ask a friend in the industry to review it. |
| Around Day 96–103 (RAG and agent projects done) | Polish the resume with the two main projects. Start applying for AI Engineer, ML Engineer, and GenAI Developer roles. |
| Day 110 onward | Apply steadily: aim for 5–10 good applications a week, plus referrals. Interviews will start arriving in Phase 7–9, which is fine: you will know enough by then. |
| Days 143–150 | Interview mode. Many people get their first offers during or soon after this phase. |

Referrals work much better than cold applications. Message people who work at the company, share your project link, and ask politely if they would refer you. A deployed project with a short demo video is the strongest thing you can attach.

## Before Day 1: set up your tools

Spend an hour on this before you start, so Day 1 is about learning, not installing.

- [ ] A laptop with at least 8 GB RAM. 16 GB is better for Docker in Phase 7.
- [ ] Python 3.12 or newer installed. Check with `python --version`.
- [ ] VS Code (or any editor you like) with the Python extension.
- [ ] Git installed, and a GitHub account.
- [ ] A Google account for Google Colab (free GPU for deep learning days).
- [ ] A LeetCode account (or similar) for the DSA problems.
- [ ] One notebook or notes file for daily notes, and one text file for the mistakes log.
- [ ] Around Day 81 you will need an API key for an LLM provider (for example Anthropic for Claude). Small personal projects usually cost very little, but check the current price page and set a spending limit.

You do not need a powerful GPU. Colab, Kaggle notebooks, or a small cloud GPU for an hour are enough for everything in this plan.

## A final word before you start

150 days is long. You will have days when nothing makes sense. On those days, do the DSA hour and read for one hour. Small progress keeps the habit alive. Most people who succeed are not the smartest; they are the ones who did not stop.

**Next:** [Week 1 · Python Basics (Days 1–7)](/interview/ai-engineer/ai-roadmap/week-01)
