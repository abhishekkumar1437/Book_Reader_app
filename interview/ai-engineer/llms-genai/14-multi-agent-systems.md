---
title: Multi-Agent Systems
part: Agents
summary: When and how to split work across several LLM agents — orchestrator-worker, supervisor, handoffs, pipelines, debate and critic loops — with runnable code, cost and latency maths, failure modes, and when one agent is better.
---

One agent in a loop can do a lot. But some tasks are too big or too varied for one context window: researching 10 companies, writing and reviewing code, or a support system where billing and technical questions need different tools and rules. A **multi-agent system** splits the work between several LLM agents that each have their own instructions, tools and context. It is a hot topic in interviews — and also one where interviewers reward candidates who know its costs.

> **In simple words:** Instead of one agent doing everything, a "manager" agent breaks the job into parts and gives each part to a "worker" agent. Workers can run at the same time, each with a clean, focused context. The manager then combines their results. This helps for big, splittable tasks, but costs more tokens and adds new ways to fail.

## Why use more than one agent?

Recall from [AI Agents](/interview/ai-engineer/llms-genai/ai-agents) that an agent is an LLM in a loop with tools. Splitting into several agents gives three real benefits:

1. **Separate contexts.** Each worker reads only what its subtask needs. A research worker can read 20 web pages and return a one-paragraph summary; the main agent never sees the 20 pages. This keeps each context small and focused. This is called **context isolation**.
2. **Specialization.** Each agent gets its own system prompt and tools. A "SQL agent" has database tools and SQL rules; a "writer agent" has none of that clutter. Fewer tools per agent means fewer wrong tool choices.
3. **Parallelism.** Independent subtasks run at the same time, so the whole job finishes sooner.

And three real costs:

1. **More tokens.** Every agent has its own system prompt, its own loop, and the results must be passed around. Anthropic's write-up on its multi-agent research system reported that multi-agent runs used roughly 15 times more tokens than a normal chat.
2. **Coordination problems.** Agents can duplicate work, contradict each other, or lose important details when passing summaries.
3. **Harder debugging.** A bad final answer could come from any agent or any hand-over.

> **Real-life example:** A wedding planner (orchestrator) does not cook, decorate and play music herself. She gives the caterer, the decorator and the DJ clear briefs, and they work at the same time. But if her briefs are vague, you may get a beautiful stage in the wrong colour and food for 200 when 500 guests come. Multi-agent systems have exactly this problem: **the quality of the hand-over decides the result.**

## The main patterns

| Pattern | How it works | Good for | Watch out for |
|---|---|---|---|
| **Orchestrator-worker** | A lead agent plans, splits the task, sends subtasks to workers (often in parallel), then combines results | Research, analysis over many items, big reports | Vague subtask briefs; workers duplicating each other |
| **Supervisor** (hierarchical) | A supervisor repeatedly decides which specialist agent acts next, and checks their output | Tasks needing several skills in an unknown order | Supervisor becomes a bottleneck; many extra calls |
| **Handoffs** (router / triage) | One agent talks to the user, then hands the whole conversation to another specialist | Customer support (billing → refunds → technical) | Context lost in the hand-over; ping-pong between agents |
| **Sequential pipeline** | Agent A's output goes to agent B, then C (like an assembly line) | Draft → edit → translate → format | Errors pass down the line; not much better than a workflow |
| **Parallel fan-out + aggregator** (map-reduce) | Same task on many inputs at once; one agent merges | Summarize 50 documents, review 30 files | Merge step must handle conflicts |
| **Evaluator-optimizer** (generator-critic) | One agent produces, another critiques, repeat until good | Writing, code, translations with clear quality criteria | Endless loops; critic too harsh or too easy |
| **Debate** | Several agents argue different answers; a judge decides | Hard reasoning questions, reducing one-sided answers | Expensive; agents may just agree with each other |

Notice that several of these (pipeline, fan-out, generator-critic) can be built as plain **workflows** with fixed code, where the steps never change. They become truly "agentic" when the agents decide the steps themselves.

## Orchestrator-worker in detail

This is the most common and most useful pattern.

<figure>
<svg viewBox="0 0 440 220" width="440" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="150" y="10" width="140" height="36" rx="8" stroke="var(--accent)" />
<text x="220" y="33" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Orchestrator</text>
<line x1="220" y1="46" x2="70" y2="95" />
<line x1="220" y1="46" x2="220" y2="95" />
<line x1="220" y1="46" x2="370" y2="95" />
<text x="15" y="66" fill="currentColor" stroke="none" font-size="11">1. plan, split</text>
<rect x="15" y="95" width="110" height="36" rx="8" />
<text x="70" y="118" text-anchor="middle" fill="currentColor" stroke="none">Worker: trains</text>
<rect x="165" y="95" width="110" height="36" rx="8" />
<text x="220" y="118" text-anchor="middle" fill="currentColor" stroke="none">Worker: hotels</text>
<rect x="315" y="95" width="110" height="36" rx="8" />
<text x="370" y="118" text-anchor="middle" fill="currentColor" stroke="none">Worker: weather</text>
<text x="340" y="156" fill="currentColor" stroke="none" font-size="11">2. parallel,</text>
<text x="340" y="169" fill="currentColor" stroke="none" font-size="11">own contexts</text>
<line x1="70" y1="131" x2="220" y2="170" />
<line x1="220" y1="131" x2="220" y2="170" />
<line x1="370" y1="131" x2="220" y2="170" />
<text x="15" y="160" fill="currentColor" stroke="none" font-size="11">3. short summaries</text>
<rect x="150" y="170" width="140" height="36" rx="8" stroke="var(--accent)" />
<text x="220" y="193" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Combine → answer</text>
</svg>
<figcaption>The orchestrator writes a clear brief for each worker; workers do their part in their own context and return only short summaries for the final answer.</figcaption>
</figure>

The steps:

1. **Plan.** The orchestrator reads the task and writes a list of subtasks. Each subtask brief should say: the goal, what output format to return, what *not* to do (to avoid overlap), and how much effort to spend.
2. **Delegate.** Each worker runs, often as its own small agent with tools, in parallel.
3. **Combine.** The orchestrator (or a separate "synthesizer" call) merges the worker summaries into the final answer. It may send more work if there are gaps.

A common cost trick: use a **strong model for the orchestrator** (planning and combining need judgment) and a **cheaper, faster model for workers** (narrow, simpler jobs).

### Runnable orchestrator-worker code

This version plans with one model call, runs workers in parallel with `asyncio`, and combines the results. (If `async` is new to you, see [Async Programming](/interview/python/async-programming).)

```python
import asyncio, json
import anthropic

client = anthropic.AsyncAnthropic()               # async client: many calls at once
LEAD_MODEL = "claude-sonnet-5-5"                  # judgment: planning + combining
WORKER_MODEL = "claude-haiku-5-5"                 # cheaper: narrow subtasks

def text_of(resp) -> str:
    return "".join(b.text for b in resp.content if b.type == "text")

async def plan(task: str) -> list[dict]:
    resp = await client.messages.create(
        model=LEAD_MODEL, max_tokens=2000,
        system=("Split the user's task into 2-4 independent subtasks for worker agents. "
                'Reply ONLY with a JSON list like [{"name": "...", "brief": "..."}]. '
                "Each brief must state the goal, the exact output format (max 120 words), "
                "and what is out of scope so workers do not overlap."),
        messages=[{"role": "user", "content": task}],
    )
    return json.loads(text_of(resp))

async def worker(sub: dict) -> str:
    resp = await client.messages.create(
        model=WORKER_MODEL, max_tokens=1000,
        system="You are a focused specialist. Do only your brief. Be factual and concise.",
        messages=[{"role": "user", "content": sub["brief"]}],
    )
    return f"## {sub['name']}\n{text_of(resp)}"

async def orchestrate(task: str) -> str:
    subtasks = await plan(task)
    print("Plan:", [s["name"] for s in subtasks])
    results = await asyncio.gather(*(worker(s) for s in subtasks))   # parallel
    combined = "\n\n".join(results)
    resp = await client.messages.create(
        model=LEAD_MODEL, max_tokens=3000,
        system="Combine the worker reports into one clear answer. Resolve conflicts; note gaps.",
        messages=[{"role": "user", "content": f"Task: {task}\n\nWorker reports:\n{combined}"}],
    )
    return text_of(resp)

print(asyncio.run(orchestrate(
    "Plan a 3-day budget trip from Bengaluru to Hampi for 2 students: travel options, "
    "cheap stays, and what to see each day.")))
```

```text
Plan: ['travel', 'stay', 'itinerary']
... combined trip plan ...
```

Real systems give each worker **tools** (web search, a database) so it is an agent of its own, and let the orchestrator loop: check the combined result, then send follow-up subtasks. In production, also wrap `json.loads` in a try/except (or use structured outputs) and cap the number of workers.

> **Interview tip:** The most important line in this code is the planner's system prompt. Say it in the interview: "Most multi-agent failures come from bad delegation. Each brief needs a clear goal, output format, boundaries and an effort budget."

### Worked example: cost and time

A research task. Suppose:

- **Single agent:** 12 sequential steps, about 50,000 total tokens, about 4 minutes.
- **Orchestrator + 4 workers:** orchestrator uses 20,000 tokens; each worker 30,000 tokens; workers run in parallel and each takes about 1 minute; orchestrator planning + combining takes about 30 seconds.

Tokens: 20,000 + 4 × 30,000 = 20,000 + 120,000 = **140,000 tokens** — that is 140,000 ÷ 50,000 = **2.8 times** the single agent.

Time: 0.5 minutes + 1 minute (parallel workers) = **1.5 minutes**, versus 4 minutes.

So you pay about 2.8× more tokens to be about 2.7× faster (and often more thorough, because each worker can read more sources). Whether that is worth it depends on the value of the task. For a ₹2 question, no. For a research report that saves an analyst a day, yes.

## Supervisor pattern

A **supervisor** is an orchestrator that stays in control in a loop: after each specialist acts, it looks at the state and picks the next specialist (or finishes). In LangGraph this is a graph where the supervisor node has a conditional edge to each specialist, and each specialist has an edge back to the supervisor (see [LangChain, LangGraph and LlamaIndex](/interview/ai-engineer/llms-genai/langchain-langgraph-and-llamaindex)).

```text
user → supervisor → sql_agent → supervisor → chart_agent → supervisor → FINISH
```

Use it when the order of specialist work is not known in advance. The cost is an extra supervisor call between every specialist step.

## Handoffs

In a **handoff**, one agent passes the conversation to another, and the new agent talks to the user from then on. It is natural for customer support: a triage agent detects "refund" and hands over to the refunds agent, which has refund tools and refund rules.

A simple way to build handoffs: give each agent a `transfer_to_<name>` tool. When the model calls it, your code switches the active agent's system prompt and tools, and keeps the same message history.

```python
AGENTS = {
    "triage":  {"system": "You greet customers and route them. Call transfer_to_refunds for refund issues.",
                "tools": ["transfer_to_refunds"]},
    "refunds": {"system": "You handle refunds. Verify the order before refunding. Refunds above ₹5,000 need a human.",
                "tools": ["get_order", "issue_refund"]},
}
active = "triage"

def handle_tool(name: str, args: dict) -> str:
    global active
    if name.startswith("transfer_to_"):
        active = name.removeprefix("transfer_to_")      # switch agent; history is kept
        return f"Transferred to {active} agent."
    return run_real_tool(name, args)
```

The OpenAI Agents SDK makes handoffs a first-class feature; the idea is the same in every framework.

> **Common mistake:** Handing over without context. If the refunds agent only sees "transferred", it asks the customer for the order ID again. Keep the history, or pass a short structured summary ("order OD881, charged twice, wants refund").

## Evaluator-optimizer and debate

In an **evaluator-optimizer** loop, a generator writes, an evaluator critiques against clear criteria, and the generator revises. Always cap the rounds.

```python
async def write_with_critic(task: str, max_rounds: int = 3) -> str:
    draft = text_of(await client.messages.create(model=WORKER_MODEL, max_tokens=1500,
                    messages=[{"role": "user", "content": task}]))
    for _ in range(max_rounds):
        review = text_of(await client.messages.create(model=LEAD_MODEL, max_tokens=800,
            system=("Review the draft against: correct facts, answers the task, under 200 words, simple English. "
                    "If all are met reply exactly APPROVED. Otherwise list the specific fixes."),
            messages=[{"role": "user", "content": f"Task: {task}\n\nDraft:\n{draft}"}]))
        if review.strip() == "APPROVED":
            break
        draft = text_of(await client.messages.create(model=WORKER_MODEL, max_tokens=1500,
            messages=[{"role": "user", "content": f"Task: {task}\n\nDraft:\n{draft}\n\nFix these:\n{review}"}]))
    return draft
```

This works best when the criteria are concrete and checkable. For code, the best "critic" is often not an LLM at all: run the tests.

In **debate**, two or more agents answer independently, see each other's answers, and argue for a few rounds; a judge picks the final answer. It can improve hard reasoning, but costs several times more and agents often just converge on whatever sounded most confident. Use it rarely.

## How agents share information

| Method | How | Pros | Cons |
|---|---|---|---|
| Message passing | Agents send text summaries to each other | Simple, small contexts | Details can be lost ("telephone game") |
| Shared state | All agents read/write one state object (LangGraph state) | Everyone sees the same facts | State can grow big and messy |
| Shared files / artifacts | Workers write results to files or a store; pass only the path | Large outputs don't flood contexts; nothing lost | Needs storage and naming rules |

A good rule: **pass references and short summaries, not whole contexts.** A worker that read 40 pages should save the important details to a file and return "summary + file path".

## When multi-agent helps and when it hurts

| Helps | Hurts |
|---|---|
| Task splits into independent parts (research 10 companies) | Steps depend tightly on each other (fixing one bug in one file) |
| Each part needs a lot of reading that would overflow one context | Task fits easily in one context |
| Parts need very different tools or rules | All parts need the same tools |
| Speed matters and parallelism is possible | Token budget is tight |
| Value of the task is high | Simple, cheap questions |

Many coding tasks are a bad fit for parallel agents: two agents editing the same code at once easily produce conflicting changes. Research and analysis tasks are a good fit.

> **Interview tip:** A strong answer to "should we use multi-agent here?" is: "First I would build a single agent with good tools and measure it. If it fails because the context overflows, or the task has clearly independent parts that could run in parallel, I would move to orchestrator-worker. Multi-agent costs several times more tokens and adds coordination failures, so it needs to earn its place."

## Failure modes and how to evaluate

Common failures:

- **Bad delegation** — vague briefs, so workers duplicate or miss work.
- **Telephone game** — key facts lost in summaries.
- **Over-spawning** — the orchestrator creates 20 workers for a simple question. Fix: tell it how many workers suit how complex a task ("simple fact: 1 worker; comparison: 2–4").
- **Error amplification** — one worker's wrong fact gets confidently repeated in the final answer.
- **Endless loops** between agents (supervisor ↔ specialist, critic ↔ generator). Fix: max rounds.

Evaluate the **whole system end-to-end** on a test set (final answer quality, cost, latency), and also trace each agent's input and output so you can see *where* it broke. More on this in [Evaluating LLM Apps](/interview/ai-engineer/llms-genai/evaluating-llm-apps).

## Key terms

| Term | Simple meaning |
|---|---|
| Multi-agent system | Several LLM agents, each with its own instructions/tools/context, working on one task |
| Context isolation | Each agent sees only the information its subtask needs |
| Orchestrator (lead agent) | The agent that plans, delegates and combines |
| Worker (subagent) | An agent that performs one delegated subtask |
| Brief | The instructions an orchestrator gives a worker: goal, output format, scope, effort |
| Supervisor | A controller agent that repeatedly picks the next specialist |
| Handoff | Passing the conversation from one agent to another |
| Triage agent | First-contact agent that routes users to the right specialist |
| Sequential pipeline | Agents arranged in a fixed chain |
| Fan-out / map-reduce | Same task on many inputs in parallel, then merge |
| Evaluator-optimizer | Generator and critic loop until criteria are met |
| Debate | Agents argue different answers; a judge decides |
| Telephone game | Information lost as it is summarized from agent to agent |
| Over-spawning | Creating far more agents than the task needs |

## Interview questions

**What is a multi-agent system and why would you build one?**
It is a system where several LLM agents, each with its own prompt, tools and context, cooperate on one task. The main reasons are context isolation, specialization and parallelism. It helps most for big tasks that split into independent parts.

**Explain the orchestrator-worker pattern.**
A lead agent analyses the task, writes a brief for each subtask, and sends them to worker agents that often run in parallel with their own tools and context. Workers return short results, and the lead combines them, possibly sending follow-up work. Delegation quality decides the outcome.

**What are the downsides of multi-agent systems?**
Much higher token cost, coordination failures such as duplicated or contradictory work, information loss between agents, and harder debugging. They also add latency per hand-over if run sequentially.

**What is the difference between a supervisor and handoffs?**
A supervisor stays in control and picks which specialist acts next after every step. With handoffs, control moves fully to another agent, which then talks to the user directly. Supervisors suit internal multi-step work; handoffs suit customer-facing routing.

**How do you stop agents from duplicating work?**
Clear briefs with explicit scope and boundaries, a plan the orchestrator writes before delegating, and sometimes a shared record of what each worker covers. I also tell the orchestrator how many workers fit the task's complexity.

**How would you choose models in a multi-agent system?**
A strong model for planning and synthesis, and smaller, cheaper models for narrow worker tasks. Then I measure on an eval set to check that cheaper workers do not lower quality.

**When is a single agent better?**
When the task fits in one context, when steps depend tightly on each other — like editing one codebase — or when cost and latency matter more than thoroughness. I always start with one agent and add more only if measurements show a need.

**How do you evaluate a multi-agent system?**
End-to-end on a test set for answer quality, cost and latency, plus tracing every agent's inputs and outputs so I can locate failures — bad plans, weak workers or poor synthesis.

**What is the evaluator-optimizer pattern and its risk?**
A generator produces output, an evaluator checks it against criteria, and the generator revises. The risk is endless loops or a critic that is too strict or too lenient, so I cap rounds and keep criteria concrete. For code, running tests is often a better critic.

## Try it yourself

1. **Run the orchestrator.** Run the code with your own task, such as "Compare three budget phones under ₹15,000 for students." Print the plan and each worker's output. *Hint:* check whether the briefs overlap.
2. **Add a worker limit.** Change `orchestrate` so it never runs more than 3 workers, even if the plan has more. *Hint:* slice the list.
3. **Cost maths.** Single agent: 60,000 tokens. Multi-agent: orchestrator 25,000 + 5 workers × 20,000. What is the ratio? If tokens cost $3 per million (blended), what is the cost difference?
4. **Pick a pattern.** For each, which pattern fits? (a) Customer chat that may need billing or technical help. (b) Summarize 40 meeting transcripts into one report. (c) Write a cover letter and improve it until it meets 5 rules.

### Answers

1. Typical plan for the phones: one worker per phone, or workers for "specs", "prices", "reviews". The per-phone split overlaps less. If briefs overlap, tighten the planner prompt.
2. `subtasks = (await plan(task))[:3]` — and tell the planner the limit too, so the plan itself fits.
3. Multi-agent = 25,000 + 5 × 20,000 = 125,000 tokens. Ratio = 125,000 ÷ 60,000 ≈ **2.08×**. Costs: 60,000 × 3 ÷ 1,000,000 = $0.18; 125,000 × 3 ÷ 1,000,000 = $0.375. Difference = **$0.195** per task.
4. (a) Handoffs (triage → specialist). (b) Parallel fan-out + aggregator (map-reduce). (c) Evaluator-optimizer.

**Next:** [Fine-Tuning, LoRA and QLoRA](/interview/ai-engineer/llms-genai/fine-tuning-lora-and-qlora)
