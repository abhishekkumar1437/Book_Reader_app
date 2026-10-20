---
title: AI Agents
part: Agents
summary: What makes an LLM system an agent, the ReAct loop, planning, short- and long-term memory, stopping conditions, a from-scratch agent in plain Python with a max-steps guard, and when not to use an agent at all.
---

In the last chapter the model called one or two tools and answered. An **agent** goes further: it keeps choosing its own next step — search, read, calculate, write a note — until the goal is reached. Coding assistants, research assistants and support bots that can actually fix a problem are agents. As an AI engineer you will be asked to build one, and in interviews you will be asked to judge when an agent is the right design and when it is overkill.

> **In simple words:** An agent is an LLM in a loop. Each turn it looks at what has happened so far, decides the next action (usually a tool call), sees the result, and repeats until it decides it is done — or until your code stops it.

## What makes something an agent

Not every LLM app is an agent. A useful way to think about it is a **spectrum of autonomy** — how much the model decides by itself.

| Level | Who decides the steps? | Example |
|---|---|---|
| Single call | Nobody — one prompt, one answer | Summarize this email |
| **Workflow** (fixed pipeline) | Your code. The steps are fixed in advance | RAG: retrieve → answer. Or: translate → check grammar → format |
| Router | The model picks one of a few fixed paths | Classify a support ticket as billing / delivery / refund, then run that path |
| **Agent** | The model decides each next step, how many steps, and when to stop | "Find out why our Flipkart returns rose last week and write a report" |

A **workflow** is a set of LLM calls connected by code you wrote. An **agent** is a system where the LLM directs its own process and tool use. Both are useful. Workflows are cheaper, faster and more predictable. Agents handle open-ended tasks where you cannot write the steps in advance.

> **Interview tip:** Many interviewers ask "is RAG an agent?" A plain RAG pipeline is a workflow: the code always retrieves once and then answers. It becomes **agentic RAG** when the model decides whether to search, what query to use, and whether to search again (see [Advanced RAG](/interview/ai-engineer/llms-genai/advanced-rag)).

An agent has four parts:

1. **A model** that reasons and decides.
2. **Tools** it can call (see [Tool Calling](/interview/ai-engineer/llms-genai/tool-calling)).
3. **Memory** — at least the conversation so far, sometimes more.
4. **A loop with stopping rules**, written by you.

## The agent loop

<figure>
<svg viewBox="0 0 440 230" width="440" height="230" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="10" y="20" width="100" height="40" rx="8" />
<text x="60" y="44" text-anchor="middle" fill="currentColor" stroke="none">Goal / task</text>
<line x1="110" y1="40" x2="160" y2="40" />
<polygon points="160,40 152,36 152,44" fill="currentColor" />
<rect x="160" y="20" width="130" height="40" rx="8" stroke="var(--accent)" />
<text x="225" y="44" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">LLM: think, choose</text>
<line x1="290" y1="40" x2="320" y2="40" />
<polygon points="320,40 312,36 312,44" fill="currentColor" />
<text x="305" y="32" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">done</text>
<rect x="320" y="20" width="110" height="40" rx="8" />
<text x="375" y="44" text-anchor="middle" fill="currentColor" stroke="none">Final answer</text>
<line x1="260" y1="60" x2="330" y2="140" />
<polygon points="330,140 322,136 327,131" fill="currentColor" />
<text x="305" y="100" fill="currentColor" stroke="none">act: tool_use</text>
<rect x="290" y="140" width="130" height="40" rx="8" />
<text x="355" y="164" text-anchor="middle" fill="currentColor" stroke="none">Run the tool</text>
<line x1="290" y1="160" x2="250" y2="160" />
<polygon points="250,160 258,156 258,164" fill="currentColor" />
<rect x="120" y="140" width="130" height="40" rx="8" />
<text x="185" y="164" text-anchor="middle" fill="currentColor" stroke="none">Observe result</text>
<line x1="185" y1="140" x2="205" y2="60" />
<polygon points="205,60 200,69 208,70" fill="currentColor" />
<text x="182" y="100" text-anchor="end" fill="currentColor" stroke="none">add to history</text>
<text x="220" y="215" text-anchor="middle" fill="var(--accent)" stroke="none">Your code: stop after max steps, budget or time limit</text>
</svg>
<figcaption>The agent loop: think → act → observe, repeated. The model decides when it is done, but your code always has the final say through hard limits.</figcaption>
</figure>

Every agent framework — LangGraph, the OpenAI Agents SDK, the Claude Agent SDK, CrewAI — is a version of this loop with extra features around it.

## ReAct: reasoning plus acting

In 2022 a paper called **ReAct** (short for *Reason + Act*) showed that models solve tasks better when they alternate between writing a short **thought** ("I need the population first"), taking an **action** (a tool call), and reading the **observation** (the result). Before that, people either let the model reason without tools, or call tools without reasoning.

A ReAct trace looks like this:

```text
Question: How much older is Sachin Tendulkar than Virat Kohli, in years?

Thought: I need both birth years.
Action: search("Sachin Tendulkar birth date")
Observation: Born 24 April 1973.

Thought: Now Virat Kohli.
Action: search("Virat Kohli birth date")
Observation: Born 5 November 1988.

Thought: 1988 - 1973 = 15. Sachin's birthday comes earlier in the year, so the gap is 15 years and about 6 months.
Action: finish("About 15 and a half years.")
```

In the original ReAct, the model wrote `Action: search(...)` as plain text and the program parsed it. Today you use **native tool calling** instead: the action is a `tool_use` block, and the observation is a `tool_result`. The "thought" part happens inside the model (modern **reasoning models** think before acting — see [The LLM Training Pipeline](/interview/ai-engineer/llms-genai/the-llm-training-pipeline)) or in short text the model writes before a tool call. The pattern is the same; the parsing problem is gone.

> **Remember:** ReAct = Thought → Action → Observation, repeated. It grounds reasoning in real data (fewer made-up facts) and lets the model change its plan when an observation surprises it.

## Planning

For long tasks, it helps if the agent makes a **plan** first. Three common styles:

| Style | How it works | Good for | Weakness |
|---|---|---|---|
| Interleaved (pure ReAct) | Decide one step at a time | Short tasks, exploring | Can wander or forget the big goal |
| **Plan-then-execute** | First write a full step list, then do each step | Tasks with clear structure (a report with 5 sections) | Plan may be wrong; needs replanning |
| Plan + replan | Plan, execute a few steps, revise the plan using what was learned | Long, uncertain tasks (research, debugging) | More model calls |

A simple trick that works very well in practice: give the agent a **to-do list tool** (`write_todos`, `mark_done`). The agent writes its plan into the list and checks items off. This keeps the goal visible in the context even after many steps. Coding agents use exactly this idea.

## Memory

An LLM itself remembers nothing between calls. All "memory" is something your code stores and puts back into the prompt.

| Type | What it holds | Where it lives | Example |
|---|---|---|---|
| **Short-term memory** | The current task: messages, tool calls, results | The `messages` list, inside the context window | The order ID the user gave two turns ago |
| Working memory / scratchpad | Notes and plans for this task | A to-do list or notes tool, or a file | "Step 2 of 5 done; found 3 sources" |
| **Long-term memory** | Facts that should last across sessions | A database, files, or a vector store | "User prefers answers in Hindi", past tickets |

**Short-term memory** fills up. The **context window** (the maximum number of tokens the model can read at once — see [Generation Settings and the Context Window](/interview/ai-engineer/llms-genai/generation-settings-and-the-context-window)) is large today, but long agent runs still hit it, and cost grows with every step. Ways to manage it:

- **Trim** old tool results (keep only the last few, or replace big results with "[result removed]").
- **Summarize** old turns into a short paragraph. This is called **compaction**. Some APIs can do it server-side.
- **Store and fetch**: save big data to a file or memory store, and keep only a pointer ("saved to notes/sales.csv").

**Long-term memory** is usually built like RAG: save important facts, then retrieve the relevant ones at the start of a new session (see [RAG Fundamentals](/interview/ai-engineer/llms-genai/rag-fundamentals)). Some systems separate **episodic memory** (what happened: "last week we fixed the login bug") from **semantic memory** (facts: "the API key lives in vault X").

### Worked example: why the context grows fast

Suppose the system prompt plus tools is 1,500 tokens, and each step (tool call + result) adds 400 tokens. Each call resends everything so far.

- Step 1 input: 1,500 tokens
- Step 2 input: 1,500 + 400 = 1,900
- Step 3 input: 1,500 + 800 = 2,300
- ...
- Step 10 input: 1,500 + 9 × 400 = 5,100

Total input over 10 steps = 10 × 1,500 + 400 × (0 + 1 + 2 + … + 9) = 15,000 + 400 × 45 = **33,000 tokens**, even though the final context is only about 5,500 tokens. The total cost grows roughly with the **square** of the number of steps. Prompt caching (reusing the unchanged prefix at a lower price) and trimming are the main fixes.

## Stopping conditions

An agent that never stops burns money. An agent that stops too early gives a half answer. You need several stopping rules, and your code — not the model — enforces the hard ones.

| Condition | Who checks | Why |
|---|---|---|
| Model gives a final answer (`stop_reason == "end_turn"`) | Model decides | Normal success |
| **Max steps** (for example 15 tool rounds) | Your code | Stops infinite loops |
| Token or money budget (for example 200,000 tokens or ₹50) | Your code | Stops runaway cost |
| Wall-clock time limit | Your code | Users will not wait 10 minutes |
| Same tool called with same arguments 3 times | Your code | Detects the agent going in circles |
| Human approval needed | Your code pauses | Before risky actions: payments, deleting data, sending emails |

> **Common mistake:** Relying on the model to "know when to stop" with no hard limit. One bug — a tool that always returns an error, for example — and the agent can loop until you hit your API spending limit.

### Errors compound

If each step succeeds with probability 0.95, a task needing 10 correct steps succeeds with probability 0.95¹⁰ ≈ **0.60**. With 20 steps it is 0.95²⁰ ≈ **0.36**. Raise per-step reliability to 0.99 and you get 0.99¹⁰ ≈ 0.90 and 0.99²⁰ ≈ 0.82. This is why good agents have short paths, reliable tools, clear error messages, and ways to check their own work (run the tests, re-read the file).

## A from-scratch agent loop

Here is a small but complete agent in plain Python — no framework, just the `anthropic` SDK. It has:

- a **tool registry** (name → function + schema),
- **short-term memory** (the messages list),
- **long-term memory** (a notes file that survives restarts),
- a **max-steps guard**, a **token budget**, and **loop detection**,
- a log of every step.

```python
import json, pathlib
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-5-5"
NOTES_FILE = pathlib.Path("agent_notes.json")      # long-term memory on disk

# ---------- tools ----------
def search_web(query: str) -> str:
    # Replace with a real search API. Fake result for practice:
    return f"Top result for '{query}': Example text about {query}."

def save_note(key: str, value: str) -> str:
    notes = json.loads(NOTES_FILE.read_text()) if NOTES_FILE.exists() else {}
    notes[key] = value
    NOTES_FILE.write_text(json.dumps(notes, indent=2))
    return f"Saved note '{key}'."

def read_notes() -> str:
    return NOTES_FILE.read_text() if NOTES_FILE.exists() else "{}"

TOOLS = {
    "search_web": (search_web, {"type": "object",
        "properties": {"query": {"type": "string"}}, "required": ["query"]},
        "Search the web. Returns a short text snippet."),
    "save_note": (save_note, {"type": "object",
        "properties": {"key": {"type": "string"}, "value": {"type": "string"}},
        "required": ["key", "value"]},
        "Save a fact to long-term memory so it is available in future sessions."),
    "read_notes": (read_notes, {"type": "object", "properties": {}},
        "Read all saved long-term notes."),
}
TOOL_SPECS = [{"name": n, "description": d, "input_schema": s} for n, (_, s, d) in TOOLS.items()]

SYSTEM = ("You are a careful research assistant. Use tools when you need facts. "
          "Check read_notes at the start. Save important findings with save_note. "
          "When the task is complete, reply with the final answer and no tool call.")

class Agent:
    def __init__(self, max_steps=10, token_budget=100_000):
        self.max_steps = max_steps
        self.token_budget = token_budget

    def run_tool(self, name, args):
        if name not in TOOLS:
            return f"Error: unknown tool '{name}'. Valid: {list(TOOLS)}", True
        try:
            return str(TOOLS[name][0](**args)), False
        except Exception as e:
            return f"Error: {e}", True

    def run(self, task: str) -> str:
        messages = [{"role": "user", "content": task}]
        tokens_used, seen_calls = 0, {}

        for step in range(1, self.max_steps + 1):
            response = client.messages.create(
                model=MODEL, max_tokens=4096, system=SYSTEM,
                tools=TOOL_SPECS, messages=messages)
            tokens_used += response.usage.input_tokens + response.usage.output_tokens

            if response.stop_reason != "tool_use":          # model says it is done
                print(f"[step {step}] finished, {tokens_used} tokens")
                return "".join(b.text for b in response.content if b.type == "text")

            messages.append({"role": "assistant", "content": response.content})
            results = []
            for block in response.content:
                if block.type != "tool_use":
                    continue
                key = (block.name, json.dumps(block.input, sort_keys=True))
                seen_calls[key] = seen_calls.get(key, 0) + 1
                if seen_calls[key] >= 3:                     # loop detection
                    output, err = "Error: you already made this exact call twice. Try something else or finish.", True
                else:
                    output, err = self.run_tool(block.name, block.input)
                print(f"[step {step}] {block.name}({block.input}) -> {output[:60]}")
                results.append({"type": "tool_result", "tool_use_id": block.id,
                                "content": output, "is_error": err})
            messages.append({"role": "user", "content": results})

            if tokens_used > self.token_budget:              # budget guard
                return f"Stopped: token budget exceeded ({tokens_used} tokens)."

        return f"Stopped: reached max_steps={self.max_steps} without finishing."

agent = Agent(max_steps=8)
print(agent.run("Find what HNSW stands for in vector databases and save it as a note."))
```

```text
[step 1] read_notes({}) -> {}
[step 2] search_web({'query': 'HNSW vector database meaning'}) -> Top result for 'HNSW vector database meaning': Exa
[step 3] save_note({'key': 'HNSW', 'value': 'Hierarchical Navigable Small World ...'}) -> Saved note 'HNSW'.
[step 4] finished, 9120 tokens
HNSW stands for Hierarchical Navigable Small World...
```

(Your exact steps and numbers will differ.)

What to notice:

- The **model** decides which tools to call and when to finish.
- The **code** owns every hard limit: `max_steps`, `token_budget`, loop detection, unknown-tool errors.
- Long-term memory is just a JSON file behind two tools. Run the agent again tomorrow and `read_notes` returns what it saved.
- The returned message when a limit hits is honest ("Stopped: ..."), so the calling code can decide what to do — retry, escalate to a human, or show a partial result.

> **Interview tip:** If asked to "design an agent" on a whiteboard, draw this loop and name the guards. Then add: logging/tracing of every step, evaluation on a set of test tasks (see [Evaluating LLM Apps](/interview/ai-engineer/llms-genai/evaluating-llm-apps)), and human approval for risky tools. That is what separates a demo from a production agent.

## Common agent failures

| Failure | What it looks like | Fix |
|---|---|---|
| Looping | Same search again and again | Loop detection, max steps, better tool errors |
| Wrong tool / bad arguments | Calls `delete_user` instead of `get_user` | Clear names and descriptions, fewer tools, `strict` schemas |
| Lost goal | After 30 steps it forgets the original task | To-do list tool, restate the goal, compaction |
| Hallucinated success | Says "I sent the email" without calling the tool | Check tool logs; verify results in code |
| Context overflow | Huge tool results fill the window | Truncate results, store big data in files |
| Prompt injection | A web page says "ignore your instructions" and the agent obeys | Treat tool output as data, least-privilege tools, approvals (see [Safety, Guardrails and Prompt Injection](/interview/ai-engineer/llms-genai/safety-guardrails-and-prompt-injection)) |

## When NOT to use an agent

This is a favourite interview question, and the honest answer is: **less often than people think.** Start with the simplest thing that works.

| Situation | Better choice | Why |
|---|---|---|
| The steps are always the same | A workflow (fixed code) | Cheaper, faster, easy to test |
| One question, one lookup | Single tool call or RAG | No loop needed |
| Strict latency (under 1–2 seconds) | Single call | Each agent step adds seconds |
| Mistakes are very costly and hard to undo (money transfers) | Workflow + human approval | Agents are less predictable |
| You cannot test or measure success | Fix that first | You will not know if the agent works |
| Open-ended, many possible paths, value is high, errors can be caught | **Agent** | This is where agents shine: research, coding, complex support |

> **Real-life example:** For a train ticket booking, you do not need a "travel agent" that thinks freely. The steps are fixed: search trains → pick → pay. A workflow is right. But "plan a 5-day trip to Kerala for a family of four under ₹60,000, with one rest day" has many paths and trade-offs — that is agent territory.

## Key terms

| Term | Simple meaning |
|---|---|
| Agent | An LLM in a loop that chooses its own next actions until the goal is met |
| Workflow | A fixed sequence of LLM calls and code, with steps decided by the programmer |
| Router | A model that picks one of a few fixed paths |
| ReAct | Reason + Act: thought → action → observation, repeated |
| Observation | The result of an action (the tool result) that the agent reads |
| Reasoning model | A model trained to think step by step internally before answering |
| Plan-then-execute | Make a full plan first, then carry out each step |
| Replanning | Updating the plan after learning something new |
| Short-term memory | The current conversation and tool results in the context |
| Long-term memory | Facts saved outside the model (database, files, vector store) and fetched later |
| Episodic / semantic memory | Memory of past events vs memory of general facts |
| Context window | The maximum tokens the model can read in one call |
| Compaction | Summarizing old conversation to free up context space |
| Stopping condition | A rule that ends the loop (final answer, max steps, budget, time) |
| Max-steps guard | A hard limit on loop iterations enforced by code |
| Agentic RAG | RAG where the model decides when and how to search |

## Interview questions

**What is the difference between a workflow and an agent?**
In a workflow, my code fixes the steps in advance, and the LLM fills in each step. In an agent, the LLM decides the next step, how many steps to take and when to stop. Workflows are cheaper and more predictable; agents handle open-ended tasks where the path is unknown.

**Explain the ReAct pattern.**
The model alternates between a thought, an action such as a tool call, and an observation, which is the result. It repeats until it can answer. It grounds reasoning in real data and lets the model adjust the plan. Today the action and observation are native tool_use and tool_result blocks instead of parsed text.

**How do you stop an agent from running forever?**
My code enforces hard limits: maximum steps, a token or cost budget, a time limit, and detection of repeated identical calls. I return an honest "stopped" status so the caller can retry or hand over to a human. The model's own "I am done" is only the normal success path.

**How do agents remember things?**
Within a task, memory is the messages list in the context window. Across sessions, I store facts in a database, file or vector store and retrieve the relevant ones into the prompt. When the context grows too large, I trim old tool results or summarize older turns.

**Why does agent cost grow so quickly with the number of steps?**
The API is stateless, so each step resends the whole history. If each step adds a fixed amount, total input tokens grow roughly with the square of the steps. Prompt caching, trimming tool results and fewer steps keep it under control.

**If each step of an agent is 95% reliable, how reliable is a 10-step task?**
About 0.95 to the power 10, which is roughly 60%, assuming independent steps. So long agents need reliable tools, self-checks like running tests, and short paths. Improving per-step reliability to 99% raises a 10-step task to about 90%.

**When would you not use an agent?**
When the steps are known in advance, when latency must be very low, when errors are expensive and hard to undo, or when I cannot measure success. I start with a single call or a workflow and only add autonomy if the task truly needs it.

**What is plan-then-execute and when is it better than pure ReAct?**
The agent first writes a full plan, then executes steps one by one, ideally replanning when something unexpected happens. It is better for long, structured tasks because the goal stays visible and steps are less likely to drift.

**How would you test an agent?**
I build a set of test tasks with known good outcomes, run the agent on all of them, and measure success rate, number of steps, cost and failures like wrong tool calls. I also check the trajectory — which tools were called — not only the final answer, and run it again after every prompt or model change.

**What safety measures does a production agent need?**
Least-privilege tools, human approval before irreversible actions, treating tool outputs as untrusted data, limits on steps and budget, and full logging of every step so incidents can be investigated.

## Try it yourself

1. **Add a to-do tool.** Add `write_todos(items: list[str])` and `mark_done(index: int)` to the agent, stored in a Python list. Ask a 3-part question and print the list after each step. *Hint:* the schema for a list is `{"type": "array", "items": {"type": "string"}}`.
2. **Break it on purpose.** Make `search_web` always raise an exception. Run the agent with `max_steps=5`. *Hint:* watch for loop detection or the max-steps message.
3. **Compute total tokens.** System + tools = 2,000 tokens, each step adds 500 tokens, 6 steps. What is the total input across all calls?
4. **Reliability math.** A 12-step task with 0.97 per-step reliability. What is the chance of full success? *Hint:* use Python: `0.97 ** 12`.

### Answers

1. Keep `todos = []` at module level; `write_todos` sets `todos[:] = items` and returns the numbered list; `mark_done` returns the updated list with a ✓ marker. Add both to `TOOLS` with descriptions like "Write your plan as a list of steps. Call this first for multi-part tasks."
2. Each `search_web` call returns an `is_error` result. The model usually tries different queries, then either explains it cannot search or hits `max_steps=5` and you get "Stopped: reached max_steps=5 without finishing." If it repeats the same query, the third identical call gets the loop-detection error.
3. Inputs are 2,000, 2,500, 3,000, 3,500, 4,000, 4,500. Total = 6 × 2,000 + 500 × (0+1+2+3+4+5) = 12,000 + 500 × 15 = **19,500 tokens**.
4. 0.97¹² ≈ **0.694**, so about a 69% chance.

**Next:** [MCP — Model Context Protocol](/interview/ai-engineer/llms-genai/mcp-model-context-protocol)
