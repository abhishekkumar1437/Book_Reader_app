---
title: Evaluating LLM Apps
part: Quality & Safety
summary: Why LLM outputs are hard to grade, how to build a golden dataset, the limits of exact match, BLEU and ROUGE, LLM-as-judge with a real rubric and harness, RAG metrics with a worked example, agent evaluation, regression tests in CI and human review.
---

You changed one line of the prompt. Did the chatbot get better or worse? Without an evaluation, nobody knows — you only have a feeling from trying three questions. **Evaluation (eval)** is how you measure the quality of an LLM app with numbers, so you can compare prompts, models, chunk sizes and fine-tunes, and catch regressions before users do. Teams that ship reliable AI products all have good evals; in interviews, "how would you evaluate this?" follows almost every design question.

> **In simple words:** Collect a set of test questions with known good answers (a golden set). Run your app on all of them. Score each answer — with simple code checks where possible, and with another LLM acting as a judge where not. Track the scores every time you change something.

## Why evaluating LLMs is hard

With a classifier you compare the predicted label with the true label and compute accuracy (see [Evaluation Metrics](/interview/machine-learning/evaluation-metrics)). LLM outputs are harder:

- **Many correct answers.** "Returns are accepted within 7 days" and "You have one week to return it" are both right but share few words.
- **Open-ended quality.** Is the answer helpful, complete, polite, short enough? These are partly subjective.
- **Non-determinism.** The same input can give different outputs on different runs.
- **Several parts can fail.** In RAG, the retriever can fetch wrong chunks, or the generator can ignore good chunks. You need to know *which* part failed.
- **Things change under you.** Providers update models; your documents change.

"Looks good to me" testing on a few examples — often called a **vibe check** — misses most problems. You need a repeatable process.

## What to measure

| Dimension | Question it answers | Example check |
|---|---|---|
| Correctness | Is the answer right? | Matches the reference; judge score |
| **Faithfulness** (groundedness) | Is every claim supported by the given context? | Judge checks each claim against retrieved chunks |
| Relevance | Does it answer *this* question? | Judge or embedding similarity |
| Completeness | Are all parts of the question answered? | Rubric item |
| Format | Valid JSON? Under 100 words? Has citations? | Code checks |
| Safety | No harmful content, no PII leak, refuses when it should | Classifier, judge, red-team set |
| Latency | How long does it take? | p50 / p95 seconds |
| Cost | How much per request? | Tokens × price |

Measure at two levels: **component-level** (for example, retrieval quality alone) and **end-to-end** (the final answer the user sees). End-to-end tells you *whether* it works; component-level tells you *why* it does not.

## Golden datasets

A **golden dataset** (also called an eval set or test set) is a fixed list of inputs, each with what a good output looks like.

```json
{"id": "ret-001", "question": "What is the return window for phones?", "reference": "7 days from delivery", "must_include": ["7 days"], "tags": ["returns"]}
{"id": "ret-002", "question": "Can I return an opened phone?", "reference": "Yes, if it is defective or damaged on arrival", "must_include": ["defective"], "tags": ["returns", "edge"]}
{"id": "oos-001", "question": "Who will win the IPL this year?", "reference": "Polite refusal: out of scope", "must_include": [], "tags": ["out-of-scope"]}
```

How to build one:

1. **Start from real usage.** Take real user questions from logs (remove personal data first). Invent only to fill gaps.
2. **Cover the categories:** common questions, edge cases, multi-part questions, questions the app should refuse, tricky or adversarial inputs (including prompt injection — see [Safety, Guardrails and Prompt Injection](/interview/llms-genai/safety-guardrails-and-prompt-injection)).
3. **Write references** with a domain expert. A reference can be an exact answer, key facts that must appear, or a description of good behaviour.
4. **Start small, grow steadily.** 50–100 good examples is a fine start. Every bug a user reports becomes a new test case.
5. **Version it** in git like code, and never train or tune few-shot examples on the test items (that is **data leakage** — your scores will look better than reality).

> **Interview tip:** If asked "how would you start evaluating a new chatbot?", say: "I'd collect 50–100 real questions with expert-written reference answers, covering normal, edge and out-of-scope cases. Then I'd define pass criteria — code checks plus an LLM judge with a rubric — and run it on every change."

## Types of metrics

| Type | Examples | Pros | Cons |
|---|---|---|---|
| **Deterministic checks** | Exact match, contains keyword, regex, valid JSON, code passes unit tests | Fast, free, perfectly repeatable | Only work for answers with a checkable form |
| **Text-overlap metrics** | BLEU, ROUGE | Cheap, standard in research | Punish correct paraphrases; ignore meaning |
| **Semantic similarity** | Embedding cosine similarity, BERTScore | Handles paraphrases | "Similar" is not "correct"; a wrong number can still be very similar |
| **LLM-as-judge** | Rubric score 1–5, pass/fail, pairwise A vs B | Handles open-ended quality, scales well | Costs money; has biases; must be validated |
| **Human evaluation** | Expert rating, user thumbs up/down | The real ground truth for quality | Slow, expensive, raters disagree |

Use the cheapest metric that actually measures what you care about. Code checks first, judges for what code cannot check, humans to validate the judges.

### Why BLEU and ROUGE are not enough

**ROUGE** (used for summaries) counts how many words or word sequences of the reference appear in the candidate. **BLEU** (used for translation) is similar but precision-based, with a penalty for short outputs.

**Worked example: ROUGE-1 recall** (the fraction of reference words found in the candidate).

Reference: "the cat sat on the mat" — 6 words.

- Candidate A: "the cat is on the mat". Matching words: the, cat, on, the, mat = 5. ROUGE-1 recall = 5 ÷ 6 = **0.83**.
- Candidate B: "a feline rested on the rug". Matching: on, the = 2. ROUGE-1 recall = 2 ÷ 6 = **0.33**.

Candidate B means nearly the same as the reference but scores much lower. And "the cat sat on the mat" versus "the cat never sat on the mat" would score very high while meaning the opposite. This is why overlap metrics are rarely used alone for LLM apps.

## LLM-as-judge

An **LLM-as-judge** is a model that grades another model's output using a rubric you write. Common setups:

- **Pointwise:** score one answer (1–5, or pass/fail).
- **Pairwise:** "Which is better, A or B?" — useful when comparing two prompts or models.
- **Reference-guided:** the judge also sees a reference answer, which makes grading much more reliable.

Known **biases** and how to reduce them:

| Bias | What happens | Fix |
|---|---|---|
| Position bias | In pairwise tests, the judge prefers the first (or second) answer | Run both orders; count only consistent wins |
| Verbosity bias | Longer answers get higher scores | Rubric says "judge meaning, not length"; penalize padding |
| Self-preference | A model rates its own style higher | Use a different or stronger judge model |
| Vague rubric | Scores drift and are inconsistent | Define each score level with concrete criteria |

A good judge prompt: a clear rubric with each level defined, the reference answer, a request for short reasoning *before* the score, and a strict output format. Pass/fail or small scales (1–5) are more reliable than 1–100.

> **Common mistake:** Trusting a judge without checking it. Before using a judge, have humans label 30–100 examples and measure agreement. If humans and the judge agree on 44 of 50 items, agreement is 44 ÷ 50 = **88%**. If agreement is low, fix the rubric before trusting any number it gives.

## A small eval harness

<figure>
<svg viewBox="0 0 440 200" width="440" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="5" y="70" width="80" height="40" rx="6" />
<text x="45" y="94" text-anchor="middle" fill="currentColor" stroke="none">Golden set</text>
<line x1="85" y1="90" x2="105" y2="90" />
<polygon points="105,90 97,86 97,94" fill="currentColor" />
<rect x="105" y="70" width="75" height="40" rx="6" />
<text x="142" y="94" text-anchor="middle" fill="currentColor" stroke="none">Run app</text>
<line x1="180" y1="90" x2="200" y2="45" />
<line x1="180" y1="90" x2="200" y2="133" />
<rect x="200" y="25" width="95" height="36" rx="6" />
<text x="247" y="48" text-anchor="middle" fill="currentColor" stroke="none">Code checks</text>
<rect x="200" y="115" width="95" height="36" rx="6" stroke="var(--accent)" />
<text x="247" y="138" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">LLM judge</text>
<line x1="295" y1="43" x2="315" y2="82" />
<line x1="295" y1="133" x2="315" y2="98" />
<rect x="315" y="70" width="120" height="40" rx="6" />
<text x="375" y="94" text-anchor="middle" fill="currentColor" stroke="none">Scores + report</text>
<text x="220" y="185" text-anchor="middle" fill="var(--accent)" stroke="none">CI gate: block the change if pass rate drops</text>
</svg>
<figcaption>Every change runs the same golden set through the app; cheap code checks and an LLM judge produce scores that are compared with the last accepted version.</figcaption>
</figure>

Here is a complete harness in plain Python. It runs the app on each golden item, applies a code check, asks a judge model for a 1–5 score, and prints a report. Replace `my_app` with your real RAG or agent.

```python
import json, re, time, statistics
import anthropic

client = anthropic.Anthropic()
APP_MODEL = "claude-sonnet-5-5"
JUDGE_MODEL = "claude-opus-5-5"        # a stronger, different model as judge

GOLDEN = [json.loads(line) for line in open("golden.jsonl", encoding="utf-8")]

def my_app(question: str) -> str:
    """Your real app goes here (RAG, agent...). A plain call as a placeholder."""
    r = client.messages.create(model=APP_MODEL, max_tokens=1000,
        system="You are ShopKart support. Policy: phones can be returned within 7 days if defective. "
               "Answer only shopping questions; politely refuse others.",
        messages=[{"role": "user", "content": question}])
    return "".join(b.text for b in r.content if b.type == "text")

JUDGE_PROMPT = """You are grading an answer from a customer-support assistant.

<question>{question}</question>
<reference>{reference}</reference>
<answer>{answer}</answer>

Score the answer from 1 to 5:
5 = correct and complete; same meaning as the reference
4 = correct, but a minor detail is missing
3 = partly correct, OR correct but adds a claim not supported by the reference
2 = mostly wrong or misleading
1 = wrong, off-topic, or an unjustified refusal
Judge meaning, not wording or length. Write one or two sentences of reasoning in
<reasoning> tags, then only the number in <score> tags."""

def judge(question: str, reference: str, answer: str) -> tuple[int, str]:
    r = client.messages.create(model=JUDGE_MODEL, max_tokens=1000, messages=[{"role": "user",
        "content": JUDGE_PROMPT.format(question=question, reference=reference, answer=answer)}])
    text = "".join(b.text for b in r.content if b.type == "text")
    score = re.search(r"<score>\s*(\d)\s*</score>", text)
    reason = re.search(r"<reasoning>(.*?)</reasoning>", text, re.S)
    return (int(score.group(1)) if score else 0), (reason.group(1).strip() if reason else text)

def run_eval(label: str):
    rows = []
    for item in GOLDEN:
        t0 = time.time()
        answer = my_app(item["question"])
        latency = time.time() - t0
        contains_ok = all(k.lower() in answer.lower() for k in item.get("must_include", []))
        score, reason = judge(item["question"], item["reference"], answer)
        passed = contains_ok and score >= 4
        rows.append({"id": item["id"], "score": score, "contains_ok": contains_ok,
                     "passed": passed, "latency": round(latency, 2), "reason": reason, "answer": answer})

    pass_rate = sum(r["passed"] for r in rows) / len(rows)
    print(f"[{label}] items={len(rows)} pass_rate={pass_rate:.0%} "
          f"mean_score={statistics.mean(r['score'] for r in rows):.2f} "
          f"p50_latency={statistics.median(r['latency'] for r in rows):.2f}s")
    for r in rows:
        if not r["passed"]:
            print(f"  FAIL {r['id']}: score={r['score']} contains_ok={r['contains_ok']} - {r['reason'][:90]}")
    json.dump(rows, open(f"eval_{label}.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    return pass_rate

run_eval("prompt-v2")
```

```text
[prompt-v2] items=3 pass_rate=67% mean_score=4.00 p50_latency=2.10s
  FAIL ret-002: score=3 contains_ok=True - The answer says opened phones can be returned but adds that a 10% fee applies, which ...
```

(Numbers here are illustrative.) Things to notice:

- The code check (`must_include`) is cheap and catches obvious misses. The judge handles meaning.
- The judge writes **reasoning first, then the score**, which tends to give more consistent scores, and the reasoning helps you debug failures.
- Results are saved with a **label**, so you can compare versions ("prompt-v1" vs "prompt-v2").
- Some newer models do not let you set `temperature`, so consistency must come from a clear rubric and strict output format rather than sampling settings.

### Worked example: reading the scores

Five items get judge scores [5, 4, 2, 5, 3].

- Mean score = (5 + 4 + 2 + 5 + 3) ÷ 5 = 19 ÷ 5 = **3.8**.
- Pass rate (score ≥ 4) = 3 of 5 = **60%**.

The mean hides details; the pass rate is easier to set a target for ("≥ 90% pass before release"). Always read the failures — two failures for the same reason (say, the made-up fee) point straight at the fix.

## RAG metrics

For RAG apps (see [RAG Fundamentals](/interview/llms-genai/rag-fundamentals)) you evaluate retrieval and generation separately. Four metrics, popularized by the **RAGAS** library, are widely used:

| Metric | Measures | Part tested | Formula idea |
|---|---|---|---|
| **Faithfulness** | Are the answer's claims supported by the retrieved context? | Generator | supported claims ÷ total claims in the answer |
| **Answer relevance** | Does the answer address the question? | Generator | similarity between the question and questions generated back from the answer |
| **Context precision** | Are the relevant chunks ranked near the top? | Retriever / reranker | average of precision@k at each relevant position |
| **Context recall** | Did retrieval find all the information needed? | Retriever | reference claims found in context ÷ total reference claims |

Most of these use an LLM to split text into claims and check support, so they are LLM-as-judge metrics with a fixed recipe.

### Worked example

**Question:** "What is the return window for phones, and is there a fee?"
**Reference answer:** "Phones can be returned within 7 days. There is no return fee." (2 claims)

**Retrieved chunks, in rank order:**

1. c1 — "Phones may be returned within 7 days of delivery." ✅ relevant
2. c2 — "Standard shipping takes 3–5 days." ❌
3. c3 — "No fee is charged for returns." ✅ relevant
4. c4 — "Gift cards cannot be refunded." ❌
5. c5 — "Our offices are closed on Sundays." ❌

**Generated answer:** "You can return a phone within 7 days. There is no return fee. Refunds reach your UPI account in 2 days."

**Faithfulness.** The answer has 3 claims: (a) 7 days ✅ in c1, (b) no fee ✅ in c3, (c) UPI refund in 2 days ❌ not in any chunk. Faithfulness = 2 ÷ 3 = **0.67**. The third claim is a hallucination — even if it happens to be true, the context does not support it.

**Context precision.** Relevance by rank: [1, 0, 1, 0, 0].

- At rank 1 (relevant): precision@1 = 1 ÷ 1 = 1.0
- At rank 3 (relevant): precision@3 = 2 ÷ 3 = 0.667
- Average over relevant positions = (1.0 + 0.667) ÷ 2 = **0.83**

If a reranker moved c3 to rank 2, the pattern would be [1, 1, 0, 0, 0], giving (1 + 1) ÷ 2 = **1.0**. If the relevant chunks were at ranks 3 and 5 ([0, 0, 1, 0, 1]), it would be (1/3 + 2/5) ÷ 2 = (0.333 + 0.4) ÷ 2 = **0.37**.

**Context recall.** Both reference claims (7 days, no fee) appear in the retrieved chunks: 2 ÷ 2 = **1.0**. If c3 had not been retrieved, recall would be 1 ÷ 2 = 0.5, and no generator could answer the fee part correctly.

**Answer relevance.** The judge writes, say, 3 questions that the answer would answer, embeds them, and compares each with the original question by cosine similarity (see [Embeddings and Semantic Search](/interview/llms-genai/embeddings-and-semantic-search)): 0.92, 0.88, 0.75. Mean = (0.92 + 0.88 + 0.75) ÷ 3 = 2.55 ÷ 3 = **0.85**. The extra UPI sentence makes one generated question drift off-topic and lowers the score a little.

**Diagnosis:** retrieval is good (recall 1.0, precision 0.83); the generator added an unsupported claim. Fix the prompt ("answer only from the context; if it is not in the context, say you don't know"), not the retriever.

> **Remember:** Low **context recall** → fix retrieval (chunking, embeddings, hybrid search, more chunks). Low **faithfulness** with good recall → fix generation (prompt, model). This split is the most useful debugging idea in RAG evaluation.

Simple retrieval metrics that need no LLM, if you have labels of which chunk is correct: **hit rate@k** (did any correct chunk appear in the top k?) and **MRR** (mean reciprocal rank: 1 ÷ rank of the first correct chunk, averaged over questions).

### RAGAS in code

```python
# pip install ragas langchain-anthropic langchain-huggingface
from ragas import EvaluationDataset, evaluate
from ragas.metrics import Faithfulness, ResponseRelevancy, LLMContextPrecisionWithReference, LLMContextRecall
from ragas.llms import LangchainLLMWrapper
from ragas.embeddings import LangchainEmbeddingsWrapper
from langchain_anthropic import ChatAnthropic
from langchain_huggingface import HuggingFaceEmbeddings

judge_llm = LangchainLLMWrapper(ChatAnthropic(model="claude-sonnet-5-5"))
embeddings = LangchainEmbeddingsWrapper(HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5"))

data = EvaluationDataset.from_list([{
    "user_input": "What is the return window for phones, and is there a fee?",
    "retrieved_contexts": ["Phones may be returned within 7 days of delivery.",
                           "Standard shipping takes 3-5 days.", "No fee is charged for returns."],
    "response": "You can return a phone within 7 days. There is no return fee. Refunds reach your UPI account in 2 days.",
    "reference": "Phones can be returned within 7 days. There is no return fee.",
}])

result = evaluate(dataset=data, llm=judge_llm, embeddings=embeddings, metrics=[
    Faithfulness(), ResponseRelevancy(), LLMContextPrecisionWithReference(), LLMContextRecall()])
print(result)
```

RAGAS changes its API often (metric class names and dataset fields have changed between versions), so check its docs. The ideas above stay the same, and you can always implement them yourself with a judge prompt.

## Evaluating agents

Agents (see [AI Agents](/interview/llms-genai/ai-agents)) need extra measures, because the path matters as well as the answer:

| Metric | Question |
|---|---|
| **Task success rate** | Did the agent achieve the goal? Best checked on the final *state* (was the refund record created? do the tests pass?) |
| Trajectory quality | Did it call sensible tools in a sensible order? Any forbidden actions? |
| Tool-call accuracy | Right tool, valid arguments? |
| Steps, tokens, cost, time | How efficient was it? |
| Robustness | Does it still work with typos, tool errors, or injected instructions? |
| Consistency | Over 5 runs of the same task, how many succeed? (Agents vary run to run) |

A good agent eval builds a small **sandbox environment** (fake database, fake APIs) where each task has a checkable end state.

## Regression testing and CI

A **regression** is when something that worked stops working after a change. Put your eval into automated tests so every prompt, model or code change is checked (see [CI/CD and Testing for AI](/interview/mlops-deployment/ci-cd-and-testing-for-ai)):

```python
# test_eval.py — run with: pytest -q
from eval_harness import run_eval

def test_quality_does_not_regress():
    pass_rate = run_eval("ci")
    assert pass_rate >= 0.90, f"Pass rate {pass_rate:.0%} is below the 90% release bar"
```

Tips:

- Keep a fast **smoke set** (20 items) for every pull request and the full set nightly or before release.
- Because outputs vary, allow a small margin, or run flaky items more than once.
- Track scores over time; a slow 1% drop per week is easy to miss without a chart.

## Online evaluation and human review

Offline evals use your golden set. **Online evaluation** watches real traffic:

- **User feedback:** thumbs up/down, "was this helpful?", whether the user had to ask again.
- **A/B tests:** send 50% of users to prompt A and 50% to prompt B; compare resolution rate.
- **Sampled judging:** run the LLM judge on a random 1% of production conversations every day.
- **Monitoring:** latency, cost, error rates, refusal rates (see [Monitoring, Cost and Caching](/interview/mlops-deployment/monitoring-cost-and-caching)).

**Human evaluation** stays essential for high-stakes domains (medical, legal, finance), for building the golden set, and for checking judges. Give raters a written rubric, use at least two raters on a sample, and measure how often they agree.

## Key terms

| Term | Simple meaning |
|---|---|
| Eval | A repeatable measurement of an LLM app's quality |
| Vibe check | Informal testing by trying a few examples |
| Golden dataset | Fixed set of inputs with reference answers or criteria |
| Reference answer | The expert-approved good answer for a test input |
| Component vs end-to-end eval | Testing one part (e.g. retriever) vs the full system output |
| Exact match | Output must equal the reference exactly |
| BLEU / ROUGE | Word-overlap metrics from translation and summarization |
| Semantic similarity | Closeness of meaning, often via embeddings |
| LLM-as-judge | Using an LLM with a rubric to grade outputs |
| Pointwise / pairwise judging | Scoring one answer / choosing the better of two |
| Position / verbosity / self-preference bias | Judge favouring order, length, or its own style |
| Rubric | Written criteria defining each score level |
| Judge–human agreement | How often the judge's grades match human grades |
| Faithfulness | Share of answer claims supported by the retrieved context |
| Answer relevance | How well the answer addresses the question |
| Context precision | Whether relevant chunks are ranked near the top |
| Context recall | Whether retrieval found all needed information |
| RAGAS | Open-source library for RAG evaluation metrics |
| Hit rate@k / MRR | Retrieval metrics based on where the correct chunk appears |
| Task success rate | Share of agent tasks that reach the goal state |
| Trajectory | The sequence of steps and tool calls an agent took |
| Regression | Something that used to work breaks after a change |
| Online evaluation | Measuring quality on live traffic (feedback, A/B tests) |

## Interview questions

**Why is evaluating LLM applications harder than evaluating a classifier?**
Outputs are open-ended with many valid answers, quality has subjective parts like helpfulness and tone, outputs vary between runs, and a pipeline like RAG has several components that can fail. So I combine code checks, LLM judges and human review instead of a single accuracy number.

**How would you build an evaluation set?**
Start from real user queries, add edge cases, out-of-scope and adversarial inputs, and have domain experts write reference answers or criteria. Start with 50 to 100 items, version it in git, keep it separate from anything used for tuning, and add every production bug as a new case.

**What are the limitations of BLEU and ROUGE?**
They count word overlap, so correct paraphrases score low and answers with a small but critical change, like a negation or wrong number, can score high. They do not measure faithfulness or helpfulness, so they are weak for LLM apps.

**What is LLM-as-judge and how do you make it reliable?**
A model grades outputs using a rubric. I define each score level concretely, include a reference answer, ask for brief reasoning before the score, and use a strict output format. I check position, verbosity and self-preference bias, and I validate the judge against human labels before trusting it.

**Explain faithfulness and context recall.**
Faithfulness is the fraction of claims in the answer that the retrieved context supports — it detects hallucination by the generator. Context recall is the fraction of facts in the reference answer that appear in the retrieved context — it tells me whether retrieval found what was needed.

**Your RAG app gives wrong answers. How do you find the cause?**
I look at context recall and precision first. If the needed facts are not retrieved, I fix retrieval: chunking, embeddings, hybrid search, reranking. If they are retrieved but the answer is wrong or adds claims, faithfulness is low and I fix the prompt or model.

**How do you evaluate an agent?**
On a set of tasks in a sandbox where success can be checked on the final state, plus trajectory checks: correct tools, valid arguments, no forbidden actions. I also track steps, cost and latency, and run each task several times because agents are not deterministic.

**How do you stop quality from regressing when you change a prompt?**
I run the eval set automatically in CI on every change, with a pass-rate threshold that blocks the merge, a quick smoke set on pull requests and the full set nightly, and I compare against the last accepted version.

**How do you choose a judge model?**
Usually a strong model, ideally different from the one being evaluated, to reduce self-preference. I check its agreement with human labels and consider cost, since the judge runs on every test case.

**What is online evaluation?**
Measuring quality on live traffic: user feedback, A/B tests between versions, running a judge on sampled production conversations, and monitoring latency, cost and refusal rates. It catches problems the offline set does not cover.

## Try it yourself

1. **Make a golden set.** Write 10 JSONL items for a college-admission chatbot: 6 normal, 2 edge cases, 2 out-of-scope. *Hint:* include `must_include` keywords where an answer has a fixed fact.
2. **Compute ROUGE-1 recall.** Reference: "refunds take five working days". Candidate: "your refund will take five days". *Hint:* compare word forms exactly — "refunds" ≠ "refund".
3. **Compute context precision.** Relevance by rank is [0, 1, 1, 0]. *Hint:* precision@2 and precision@3, then average.
4. **Faithfulness.** An answer has 5 claims; 4 are supported by the context. What is faithfulness? Which component do you fix?

### Answers

1. Example lines: `{"id": "adm-01", "question": "What is the last date to apply for B.Tech?", "reference": "30 June 2026", "must_include": ["30 June"]}`; an edge case like "Can I apply if my Class 12 result is pending?"; out-of-scope like "Write my statement of purpose for me" with reference "politely decline; offer guidance instead".
2. Reference words: refunds, take, five, working, days (5). Found in candidate: take, five, days = 3. ROUGE-1 recall = 3 ÷ 5 = **0.6**, even though the meaning is nearly the same — one more example of the metric's weakness.
3. Relevant at ranks 2 and 3. Precision@2 = 1 ÷ 2 = 0.5; precision@3 = 2 ÷ 3 = 0.667. Average = (0.5 + 0.667) ÷ 2 = **0.58**.
4. Faithfulness = 4 ÷ 5 = **0.8**. The unsupported claim came from the generator, so improve the prompt (answer only from context, cite sources) or the model — and check whether the claim was actually needed (maybe retrieval missed it, then check context recall too).

**Next:** [Safety, Guardrails and Prompt Injection](/interview/llms-genai/safety-guardrails-and-prompt-injection)
