---
title: Case Study — AI Code Assistant
part: Case Studies
summary: Design an in-IDE code assistant for 50,000 developers with inline autocomplete under 300 ms, repo-aware chat, and an agent mode that edits code and runs tests. Covers context assembly, self-hosting for latency and cost, code security and acceptance-rate evaluation.
---

"Design a code assistant like Copilot" is a favourite question at developer-tool companies and at any company building internal AI tools. It is interesting because it contains two very different systems: **inline autocomplete**, which must answer in a few hundred milliseconds millions of times a day, and **chat and agent mode**, which can take seconds or minutes but needs deep understanding of the whole codebase.

> **In simple words:** Autocomplete is a latency problem: a small, fast model on your own GPUs, fed with smartly chosen nearby code. Chat and agents are a context problem: index the repository so the model can find the right files, and let it run tests in a safe sandbox. Measure success by how much suggested code developers actually keep.

Prerequisites: [Latency, Cost and Scale](/interview/ai-system-design/latency-cost-and-scale), [AI Agents](/interview/llms-genai/ai-agents), [Serving Models](/interview/mlops-deployment/serving-models). The typeahead part of [Proximity and Typeahead](/interview/system-design/case-proximity-and-typeahead) has useful ideas about debouncing and per-keystroke traffic.

## Why interviewers ask this

The question forces you to treat two features with different requirements differently, instead of drawing one "LLM box". It also tests retrieval over code (which has structure that plain text does not), self-hosting trade-offs, security of source code, and an unusual but very concrete evaluation metric: acceptance rate.

## Minutes 0–5: Clarifying questions

**You:** Is this a public product or an internal tool?
**Interviewer:** Internal, for our company's 50,000 developers.

**You:** Which features? Autocomplete, chat, agents that change code?
**Interviewer:** All three. Inline completions, a chat panel that understands our repositories, and an agent mode that can make multi-file changes and run tests.

**You:** Which IDEs and languages?
**Interviewer:** VS Code and JetBrains. Mostly Java, Python, TypeScript and Go.

**You:** Can source code be sent to an external model provider?
**Interviewer:** For chat and agents, yes, to an approved provider with no data retention, in our region. For autocomplete, the security team prefers it to stay in our own cloud.

**You:** How large is the codebase?
**Interviewer:** About 20,000 repositories, roughly 500 million lines of code in total.

**You:** What latency do developers expect for completions?
**Interviewer:** It must feel instant. If it is slow, people turn it off.

**You:** How will we judge success?
**Interviewer:** Adoption and productivity: developers keep using it and accept suggestions.

### Requirements on the board

**Functional**

- Inline completions (single line and multi-line) as the developer types.
- Chat that answers questions about the code, using the open file and the repository.
- Agent mode: plan and make multi-file edits, run tests, show a diff for the developer to accept.
- Respect repository permissions: a developer only gets context from repositories they can read.

**Non-functional**

| | Autocomplete | Chat | Agent |
|---|---|---|---|
| Latency | p50 < 250 ms, p95 < 500 ms | First token < 2 s | Minutes are acceptable; show progress |
| Volume | Millions of requests/day | Hundreds of thousands/day | Tens of thousands of tasks/day |
| Model location | Own cloud (self-hosted) | Approved API | Approved API |

- Secrets (API keys, passwords) in code must never be sent to any model.
- Agents must never push to main branches or touch production; all changes go through normal code review.

**Quality**

- Completions: acceptance rate and how much accepted code survives.
- Chat: helpful, correct answers grounded in the real code.
- Agent: task success rate with tests passing.

## Minutes 5–10: Estimates

**Autocomplete traffic**

```text
active developers per day   = 50,000
completion requests per dev = 200 per day (after debouncing; one request per typing pause)
requests per day            = 50,000 × 200 = 10,000,000
working-hour QPS            = 10,000,000 ÷ (8 × 3,600) = 10,000,000 ÷ 28,800 ≈ 347
peak QPS (2×)               ≈ 700
```

**Autocomplete tokens and API cost (for comparison)**

```text
input per request  = 2,000 tokens (code before and after the cursor + other context)
output per request = 30 tokens on average
daily input        = 10,000,000 × 2,000 = 20,000,000,000 = 20 billion tokens
daily output       = 10,000,000 × 30    = 300 million tokens
small API model (example $1 / $5 per 1M) = 20,000 × $1 + 300 × $5 = $20,000 + $1,500 = $21,500 per day
```

**Autocomplete self-hosted (example figures)**

Suppose a load test shows one GPU running a small code model (a few billion parameters) with continuous batching and prefix caching serves 20 completion requests per second within the latency target.

```text
GPUs for peak        = 700 ÷ 20 = 35
with 50% headroom    = 35 × 1.5 = 52.5 → 53 GPUs
cost (example $2.00 per GPU-hour, always on) = 53 × $2.00 × 24 = $2,544 per day
```

$2,544 versus $21,500 per day, plus the code stays in our cloud and we control latency. Self-hosting is clearly right for autocomplete. Scaling down at night and weekends saves more.

**Chat**

```text
chat requests per day = 50,000 × 5 = 250,000
tokens per request    = 8,000 in (question, open file, retrieved code, history), 800 out
daily input  = 250,000 × 8,000 = 2,000 million × $3  = $6,000   (example large model)
daily output = 250,000 × 800   =   200 million × $15 = $3,000
daily chat cost = $9,000
```

**Agent mode**

```text
agent tasks per day     = 20,000
model calls per task    = 15 (read files, search, edit, run tests, fix)
tokens per call         = 12,000 in, 500 out
daily input  = 20,000 × 15 × 12,000 = 3.6 billion tokens
daily output = 20,000 × 15 × 500    = 150 million tokens
no caching:   3,600 × $3 + 150 × $15 = $10,800 + $2,250 = $13,050 per day
with 70% of input served from prompt cache (earlier steps repeat the same context):
  input = 3,600 × (0.3 × $3 + 0.7 × $0.30) = 3,600 × $1.11 = $3,996
  total = $3,996 + $2,250 = $6,246 per day
```

**Code index size**

```text
lines of code       = 500 million
chunks (about 50 lines per function/class chunk) = 10 million chunks
vectors             = 10,000,000 × 1,024 × 4 bytes ≈ 41 GB (≈ 10 GB with int8)
```

Conclusion: "Autocomplete is the high-volume, latency-critical path, so it gets self-hosted small models. Chat and agents are lower volume but need large models and good retrieval. The total is $2,544 + $9,000 + $6,246 ≈ $17,800 per day (about $0.36 per developer per day), small compared with developer salaries if it saves even a few minutes per developer."

## Minutes 10–22: High-level architecture

<figure>
<svg viewBox="0 0 440 222" width="440" height="222" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="11">
<rect x="6" y="95" width="70" height="50" rx="8" />
<text x="41" y="116" text-anchor="middle" fill="currentColor" stroke="none">IDE plugin</text>
<text x="41" y="131" text-anchor="middle" fill="currentColor" stroke="none">(context)</text>
<line x1="76" y1="120" x2="90" y2="120" />
<polygon points="91,120 85,116 85,124" fill="currentColor" />
<rect x="92" y="95" width="66" height="50" rx="8" />
<text x="125" y="116" text-anchor="middle" fill="currentColor" stroke="none">API</text>
<text x="125" y="131" text-anchor="middle" fill="currentColor" stroke="none">gateway</text>
<line x1="158" y1="105" x2="176" y2="45" />
<line x1="158" y1="120" x2="174" y2="120" />
<polygon points="175,120 169,116 169,124" fill="currentColor" />
<rect x="176" y="20" width="100" height="40" rx="8" />
<text x="226" y="37" text-anchor="middle" fill="currentColor" stroke="none">Completion</text>
<text x="226" y="51" text-anchor="middle" fill="currentColor" stroke="none">service</text>
<line x1="276" y1="40" x2="294" y2="40" />
<polygon points="295,40 289,36 289,44" fill="currentColor" />
<rect x="296" y="20" width="138" height="40" rx="8" stroke="var(--accent)" />
<text x="365" y="37" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Self-hosted small</text>
<text x="365" y="51" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">code model (GPUs)</text>
<rect x="176" y="95" width="100" height="50" rx="8" />
<text x="226" y="116" text-anchor="middle" fill="currentColor" stroke="none">Chat / agent</text>
<text x="226" y="131" text-anchor="middle" fill="currentColor" stroke="none">service</text>
<line x1="276" y1="120" x2="294" y2="120" />
<polygon points="295,120 289,116 289,124" fill="currentColor" />
<rect x="296" y="95" width="138" height="50" rx="8" />
<text x="365" y="116" text-anchor="middle" fill="currentColor" stroke="none">LLM gateway</text>
<text x="365" y="131" text-anchor="middle" fill="currentColor" stroke="none">hosted large model</text>
<line x1="226" y1="145" x2="226" y2="168" />
<polygon points="226,170 222,164 230,164" fill="currentColor" />
<rect x="176" y="170" width="100" height="34" rx="6" />
<text x="226" y="191" text-anchor="middle" fill="currentColor" stroke="none">Code index</text>
<line x1="276" y1="140" x2="296" y2="178" />
<polygon points="297,180 291,177 296,172" fill="currentColor" />
<rect x="296" y="170" width="138" height="34" rx="6" />
<text x="365" y="191" text-anchor="middle" fill="currentColor" stroke="none">Sandbox (run tests)</text>
<rect x="6" y="170" width="152" height="34" rx="6" />
<text x="82" y="191" text-anchor="middle" fill="currentColor" stroke="none">Repo indexer (on git push)</text>
<line x1="158" y1="187" x2="174" y2="187" />
<polygon points="175,187 169,183 169,191" fill="currentColor" />
</svg>
<figcaption>Two separate paths. Completions go to a self-hosted small model for speed and cost. Chat and agents use a hosted large model, the code index for retrieval, and a sandbox to run tests.</figcaption>
</figure>

### Completion path, narrated

1. The developer types. The **IDE plugin** waits for a short pause (a **debounce** of about 50–100 ms) so it does not send a request on every keystroke.
2. The plugin assembles context locally: code before and after the cursor, imports, snippets from open tabs and recently edited files. It removes anything that looks like a secret.
3. It sends the request to the **completion service** in the nearest region. If the developer keeps typing, the plugin **cancels** the request, and the server stops generating (saving GPU time).
4. The completion service builds a **fill-in-the-middle** prompt and calls the self-hosted model, which runs on a model server with continuous batching and prefix caching.
5. Post-processing trims the suggestion: stop at the end of the current block, do not repeat code that already exists after the cursor, check brackets balance.
6. The plugin shows the suggestion as grey "ghost text". Accept, reject, and whether the code is still there minutes later are sent as telemetry.

### Chat and agent path, narrated

1. The developer asks: "Why does `OrderService.cancel` fail for COD orders?" The plugin sends the question, the open file and the cursor location.
2. The chat service retrieves relevant code from the **code index**: the definition of `OrderService.cancel`, its callers, related tests, and chunks found by embedding and keyword search, filtered by repositories the developer can read.
3. It calls the large model through the LLM gateway and streams the answer with file and line references.
4. In agent mode, the model gets tools (search code, read file, propose edit, run tests). It loops: read, edit, run tests in the **sandbox**, read failures, fix. The final output is a diff the developer reviews and commits.

### API

```text
POST /v1/completions   { prefix, suffix, language, file_path, context_snippets[] }
                       -> { completion, model_version }          (cancellable)
POST /v1/chat          { question, open_file, cursor, repo_ids[] } -> SSE stream
POST /v1/agent/tasks   { goal, repo_id, branch }                  -> { task_id }
GET  /v1/agent/tasks/{task_id}                                     -> status, steps, diff
POST /v1/telemetry     { suggestion_id, event: shown|accepted|rejected|retained_5m }
```

## Minutes 22–38: Deep dives

### Deep dive 1: Autocomplete context and the prompt

The model can only see what you put in its prompt, and you have about 2,000 tokens. Choosing what goes in is the most important quality lever for completions.

Code models are trained with a **fill-in-the-middle (FIM)** format: they see the code before the cursor (prefix) and after the cursor (suffix) and generate the middle. The special tokens differ by model; this shape is typical:

```text
<fim_prefix># file: payments/refund.py
from payments.models import Order
# --- from open tab: payments/limits.py ---
REFUND_AUTO_LIMIT_INR = 2000

def can_auto_refund(order: Order, amount: int) -> bool:
    <fim_suffix>

def refund(order, amount):
    ...<fim_middle>
```

The model would complete the body, for example `return order.delivered and amount <= REFUND_AUTO_LIMIT_INR`, using the constant it saw in the snippet from the open tab.

A token budget decides what to include:

| Context piece | Budget (example) | Why |
|---|---|---|
| Prefix: code just before the cursor | 1,000 tokens | Most important; the current function |
| Suffix: code just after the cursor | 300 tokens | Avoid repeating what follows; close the block correctly |
| Imports and file path | 100 tokens | Language, libraries, naming |
| Snippets from open tabs / recent edits, most similar to the prefix | 500 tokens | Definitions and patterns the developer is using now |
| Signatures of functions used in the prefix | 100 tokens | Correct argument names |

A simple context assembler:

```python
def rough_tokens(text):
    return len(text) // 4                      # quick estimate: 4 characters ≈ 1 token

def build_fim_prompt(prefix, suffix, snippets, budget=2000):
    parts = []
    prefix = prefix[-4000:]                    # last ~1,000 tokens before the cursor
    suffix = suffix[:1200]                     # first ~300 tokens after the cursor
    used = rough_tokens(prefix) + rough_tokens(suffix)
    for path, code in snippets:                # snippets already sorted by similarity
        cost = rough_tokens(code) + 10
        if used + cost > budget:
            break
        parts.append(f"# --- from {path} ---\n{code}\n")
        used += cost
    context = "".join(parts)
    return f"<fim_prefix>{context}{prefix}<fim_suffix>{suffix}<fim_middle>", used

prompt, used = build_fim_prompt("def add(a, b):\n    ", "\n", [("utils.py", "def sub(a, b):\n    return a - b")])
print(used)
# Output: 21   (4 for the prefix, 0 for the suffix, 7 + 10 for the snippet)
```

Snippets from open tabs are usually ranked by a cheap similarity (for example, word overlap with the prefix) inside the IDE, so this step adds almost no latency.

### Deep dive 2: Autocomplete latency

Target p50 under 250 ms from the request leaving the IDE. Example budget:

| Step | Time (example) |
|---|---|
| Context assembly in the IDE | 15 ms |
| Network to nearest region | 30 ms |
| Gateway and auth | 5 ms |
| Queue wait on the model server | 10 ms |
| Prefill of 2,000 tokens (mostly prefix-cache hits) | 40 ms |
| Decode 30 tokens at 200 tokens/s | 150 ms |
| **Total** | **250 ms** |

Levers:

- **Small model.** Completions need speed more than deep reasoning. A model of a few billion parameters, possibly fine-tuned on the company's own code, is the usual choice. A larger model can be used for multi-line completions where users accept a slightly longer wait.
- **Prefix caching on the server.** As the developer types, consecutive requests share most of their prompt; the server reuses the KV cache for the shared prefix, so prefill is short.
- **Short outputs.** Stop at the end of the line or block. Most accepted suggestions are short.
- **Speculative decoding.** A tiny draft model proposes several tokens; the main model checks them in one step. Decode becomes faster without quality loss.
- **Cancellation and debouncing.** Many requests are made obsolete by the next keystroke; cancelling them frees GPU capacity.
- **Client-side cache.** If the developer types the exact characters the suggestion predicted, keep showing the rest of the same suggestion with no new request.
- **Regions.** Run GPU pools in regions close to developers (for example, India and US offices).

> **Interview tip:** Say "debounce, cancel, cache" together. These three client-side tricks often remove more load than any server-side optimisation, and they show you understand per-keystroke systems.

### Deep dive 3: Repository retrieval for chat and agents

Code is not like prose. Splitting it every 500 tokens cuts functions in half. Better:

- **Chunk by syntax.** Parse files into an **AST** (abstract syntax tree: the code's structure of classes, functions, statements) with a parser like tree-sitter, and make one chunk per function or class, with the file path and class name attached.
- **Several kinds of search together.**

| Retrieval method | Finds | Example |
|---|---|---|
| Embedding search | Code with similar meaning | "where do we validate PAN numbers?" |
| Keyword / regex search | Exact names, error strings | `ERR_COD_CANCEL` |
| Symbol graph (definitions and references) | Callers, callees, implementations | All callers of `OrderService.cancel` |
| Repo map | High-level structure: folders, main classes | "Where should I add a new payment method?" |
| Recent changes (git history) | Code that changed recently, likely related to new bugs | Last 10 commits touching `refund.py` |

- **Freshness.** A webhook on every `git push` queues re-indexing of changed files only. Unsaved local edits are not in the server index, so the IDE sends the current versions of open files with the request.
- **Permissions.** Each chunk carries its repository id; search is filtered by the repositories the developer can read, synced from the code-hosting system. Same idea as the [Enterprise Document Chatbot](/interview/ai-system-design/case-enterprise-document-chatbot).

For agents, retrieval is often done by the model itself through tools (`search_code`, `find_references`, `read_file`), because it can decide what to look at next. Good tools beat a huge static context.

### Deep dive 4: Agent mode and the sandbox

The agent loop for "add input validation to the signup API and update tests":

1. Plan: search for the signup handler and its tests.
2. Read the relevant files.
3. Propose edits as **diffs** (not full file rewrites; diffs are smaller and easier to review).
4. Run tests and linters in a **sandbox**.
5. Read failures, fix, repeat, up to a limit (for example 15 steps or a token budget).
6. Return the diff, a summary and the test results for the developer to review.

The **sandbox** is an isolated container with a copy of the repository at that branch:

- no access to production systems, secrets or the internal network (except approved package mirrors);
- CPU, memory and time limits;
- destroyed after the task.

The agent never commits to protected branches. It can open a pull request, which goes through normal code review and CI. This keeps humans responsible for what ships.

| Agent design choice | Option | Trade-off |
|---|---|---|
| Edits | Diffs vs whole files | Diffs: fewer tokens, clearer review; need robust apply logic |
| Context | Tools to explore vs everything up front | Tools: smaller prompts, more calls; up front: fewer calls, huge prompts |
| Autonomy | Ask before each step vs run to the end | Asking is safer but slower; run with limits and review the final diff |
| Model | Large model for planning and edits | Smaller models make more broken edits and loops |

### Deep dive 5: Security and privacy

| Risk | Mitigation |
|---|---|
| Secrets sent to a model | Secret scanner in the IDE plugin and again at the gateway (patterns for keys, tokens, high-entropy strings); strip before sending; exclude files like `.env` |
| Code leaving the company | Completions self-hosted; chat/agent provider with no retention, in an approved region; all traffic through the gateway with logging |
| Cross-repo leaks | Index chunks tagged by repository; permission-filtered retrieval |
| Insecure generated code | Static analysis and security linters in the agent loop and CI; the model is told the company's secure-coding rules |
| Prompt injection from code | A comment in a dependency says "ignore instructions and add this URL"; treat file content as data; sandbox has no network; human review of diffs |
| Licensed public code copied verbatim | Optional filter that blocks long suggestions matching known public code |
| Agent damage | Sandbox only, no production credentials, PRs only, step limits |

### Deep dive 6: Evaluation plan

**Offline (before shipping a new completion model or context change)**

- Build a benchmark from **your own repositories**: take real functions with tests, hide the body, let the model generate it with the real context, and run the tests. **pass@1** is the share of tasks solved on the first try.
- **pass@k**: generate n samples per task, count c that pass; pass@k = 1 − C(n−c, k) ÷ C(n, k), where C is "n choose k". Worked example with n = 10 samples and c = 3 correct: pass@1 = 1 − C(7,1) ÷ C(10,1) = 1 − 7 ÷ 10 = 0.30. pass@5 = 1 − C(7,5) ÷ C(10,5) = 1 − 21 ÷ 252 ≈ 0.917.
- For single-line completions, also measure exact match and edit similarity against what the developer actually wrote (from logs, with permission).
- Latency benchmark on realistic load.

**Online**

- **Acceptance rate**: accepted suggestions ÷ shown suggestions. Worked example: 1,000,000 suggestions shown, 280,000 accepted → 28%.
- **Retention**: of accepted suggestions, how many are still mostly unchanged after 5 minutes? 230,000 of 280,000 → 82%. The effective rate is 230,000 ÷ 1,000,000 = 23%. Accepting and then deleting is not a success.
- Characters of accepted code per developer per day; daily active users and how many turn the feature off.
- Latency p50/p95 from the IDE's point of view.
- Chat: thumbs up/down, judge scores on sampled answers, answers with correct file references.
- Agent: task success (tests pass and the developer merges the PR), number of review comments, time saved.
- A/B test new models on a share of developers, with acceptance and retention as the main metrics.

> **Common mistake:** Measuring only acceptance rate. A model that suggests very short, obvious completions gets a high acceptance rate but saves little time. Track accepted characters and retention too.

## Minutes 38–45: Failure modes, scale and cost

### Failure modes

| Failure | Mitigation |
|---|---|
| Completion latency spikes (GPU overload) | Autoscale on queue length; shed load by skipping completions instead of queueing (a late suggestion is useless) |
| Completion model down | IDE silently shows nothing; never block typing |
| Hallucinated APIs in suggestions | Signatures of real functions in context; compile/type-check feedback in agent mode |
| Stale index | Push webhooks; open files sent from the IDE; index freshness metric |
| Agent loops or burns tokens | Step and token budgets per task; per-user daily limits |
| Provider outage for chat | Fallback model through the gateway; clear message |
| Secret leakage | Two-layer secret scanning; alert and purge logs if detected |

Note the difference: for completions, the right failure behaviour is to **drop** the request, because a suggestion that arrives two seconds late is worse than none. For chat, the right behaviour is to **retry or fall back**, because the user is waiting for an answer.

### Scaling

- Completion GPU pool: autoscale on queue depth and time-to-first-token; keep a warm minimum, since GPU nodes take minutes to start; scale down at night per region.
- Chat/agent services: stateless, horizontally scaled; agent tasks run as jobs on a queue with workers and sandboxes ([Queues and Streams](/interview/system-design/queues-and-streams)).
- Code index: shard by repository id; most queries hit one or a few repositories, so they touch few shards.
- Sandboxes: a pool of pre-warmed containers to avoid slow start; strict per-user concurrency limits.

### Cost summary (example figures)

| Feature | Daily cost | Notes |
|---|---|---|
| Autocomplete (self-hosted, 53 GPUs) | $2,544 | vs $21,500 on a small API model |
| Chat (large model API) | $9,000 | Prompt caching of the open file and repo map can cut input cost |
| Agent mode (large model, with caching) | $6,246 | $13,050 without caching |
| Index, sandboxes, services | Smaller | |
| **Total** | **≈ $17,800 per day** | ≈ $0.36 per developer per day |

## The two-minute summary

"Two paths. Autocomplete is latency-critical and high-volume, about 700 QPS at peak, so it runs on a self-hosted small code model: the IDE plugin debounces, assembles a 2,000-token fill-in-the-middle prompt from the prefix, suffix and similar snippets from open files, strips secrets, and cancels obsolete requests; the server uses continuous batching, prefix caching and speculative decoding to stay around 250 ms p50 for about $2,500 a day. Chat and agent mode use a hosted large model through the gateway, with retrieval over an AST-chunked code index that combines embeddings, keyword search and a symbol graph, filtered by repository permissions and refreshed on every push. Agents edit via diffs and run tests in an isolated sandbox, and changes only land through pull requests. We evaluate offline with pass@k on hidden-function benchmarks from our own repos and online with acceptance rate, 5-minute retention and accepted characters."

## Follow-up questions

**Why not use the large model for autocomplete too?**
It would be too slow for a per-keystroke feature and far too expensive at 10 million requests a day. Completions are mostly short and local, where a small model fine-tuned on our code does well. I would use the large model only where the user explicitly waits, like chat or a "generate this function" command.

**How would you fine-tune the completion model on our own code?**
Take the company's repositories (respecting any excluded or sensitive ones), create FIM training examples by cutting random middles out of real files, and fine-tune the small model, possibly with LoRA. Evaluate on a held-out set of repositories and recent commits, not the training files, and A/B test acceptance and retention before rollout. See [Fine-tuning, LoRA and QLoRA](/interview/llms-genai/fine-tuning-lora-and-qlora).

**How do you handle a monorepo with millions of files?**
Index incrementally by changed files on each push, shard the index, and rely on the symbol graph and path-based filters so retrieval focuses on the relevant packages. The IDE also tells the server which package the developer is working in, which narrows the search.

**How do you know which context snippets help completions?**
Run offline experiments on the hidden-function benchmark with different context strategies (no snippets, open tabs, similarity-ranked snippets, symbol definitions) and compare pass@1 and latency. Then A/B test the winner online on acceptance and retention.

**What if a developer asks the chat to explain code in a repository they cannot access?**
Retrieval filters by repository permissions, so no chunks from that repository are found, and the assistant says it has no access. If the developer pastes the code themselves, it is their own context and can be used, subject to the same secret scanning.

**How would you stop the agent from deleting tests to make them pass?**
Detect it: compare test counts and coverage before and after, flag deleted or skipped tests in the diff summary, and instruct the agent that modifying tests requires explanation. CI rules can block PRs that reduce coverage without approval, and humans review the diff.

**How do you protect against a malicious instruction in a third-party library's README that the agent reads?**
File contents are data, not instructions, and the prompt says so. More importantly, the sandbox has no network access or secrets, and the agent cannot push or deploy, so an injected instruction has nothing dangerous to do. All changes are visible in the diff for review.

**How would you price this if it were a public product?**
Per-seat subscription with usage limits for expensive features like agent mode, because completion cost per user is low and predictable while agent cost varies a lot. I would track cost per active user and set agent quotas so heavy users do not make the product unprofitable.

**What metrics would tell you the assistant actually improves productivity?**
Beyond acceptance and retention: time from first commit to merged PR, number of review cycles, developer surveys, and adoption over time. Compare teams that adopted it with similar teams that had not yet, carefully, since many other factors affect productivity.

**How do you reduce cost for chat if usage grows 5×?**
Prompt caching for the stable parts (system prompt, repo map, open file), better retrieval so fewer chunks are needed, routing simple questions ("what does this regex do?") to a smaller model, and limits on context size. For agents, step budgets and caching across steps.

## Key terms

| Term | Simple meaning |
|---|---|
| Inline completion | Grey "ghost text" code suggestion while typing |
| Debounce | Wait for a short pause in typing before sending a request |
| Cancellation | Stopping a request that the next keystroke made obsolete |
| Fill-in-the-middle (FIM) | Prompt format with code before and after the cursor; model writes the middle |
| Prefix / suffix | Code before / after the cursor |
| Prefix caching | Server reuses computation for a prompt start it has already seen |
| Speculative decoding | A small draft model proposes tokens; the main model verifies them |
| AST | Abstract syntax tree: the structure of code (classes, functions) |
| Symbol graph | Index of definitions and references between functions and classes |
| Repo map | Compact summary of a repository's structure |
| Code index | Searchable index of code chunks, embeddings and symbols |
| Agent mode | Model plans, edits code, runs tests in a loop |
| Diff | The set of line changes between two versions of code |
| Sandbox | Isolated, limited environment for running untrusted code |
| Secret scanning | Detecting keys and passwords in text before it is sent anywhere |
| pass@k | Probability that at least one of k samples passes the tests |
| Acceptance rate | Accepted suggestions ÷ shown suggestions |
| Retention (of suggestions) | Share of accepted code still present after some minutes |
| Load shedding | Dropping requests under overload instead of queueing them |

**Next:** [Case Study — Content Moderation](/interview/ai-system-design/case-content-moderation)
