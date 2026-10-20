---
title: Tool Calling
part: Agents
summary: How an LLM asks your code to run a function, how to describe tools with JSON Schema, and the full request–response loop with the anthropic SDK, including parallel calls, errors and the OpenAI equivalent.
---

An LLM on its own can only produce text. It cannot check today's weather, look up a Flipkart order, or add a row to a database. **Tool calling** (also called **function calling**) is the bridge: the model says "please run this function with these arguments", your code runs it, and you send the result back. Almost every real AI product you will build — a support bot, a research agent, a coding assistant — is built on this one loop.

> **In simple words:** You give the model a menu of functions. The model does not run them. It only *asks* for one by name, with arguments in JSON. Your program runs the function and sends the answer back, and the model uses that answer to reply.

## Why tool calling exists

An LLM learns from a fixed snapshot of text (see [How LLMs Work](/interview/ai-engineer/llms-genai/how-llms-work)). This gives it three gaps:

1. **No fresh data.** It does not know your order status or today's Sensex.
2. **No private data.** It has never seen your company database.
3. **No actions.** It cannot send an email or book a ticket.

Before tool calling, people asked the model to write something like `CALL weather(Pune)` and then parsed the text with regular expressions. That broke often. Modern APIs solve this properly: you describe each tool with a **JSON Schema**, and the model is trained to reply with a structured, machine-readable request instead of free text.

> **Real-life example:** Think of a bank manager and a clerk. The manager (the LLM) decides what is needed: "Get me the balance of account 1234." The clerk (your code) actually opens the system and reads the number. The manager never touches the computer. If the clerk is not allowed to transfer money, the manager simply cannot transfer money.

This picture also explains the most important safety fact: **the model can only do what your tools allow.** Your code is always in control.

## The parts of a tool definition

A tool definition has three parts:

| Part | What it is | Why it matters |
|---|---|---|
| `name` | Short identifier, like `get_weather` | The model uses it to say which tool it wants |
| `description` | Plain-English text: what the tool does and *when to use it* | The model decides almost entirely from this. It is a prompt. |
| `input_schema` | A **JSON Schema** describing the arguments | Tells the model the argument names, types and which are required |

**JSON Schema** is a standard way to describe the shape of JSON data: "an object with a string field `city` that is required, and an optional field `unit` that must be `celsius` or `fahrenheit`".

```json
{
  "name": "get_weather",
  "description": "Get the current weather for a city in India. Use this when the user asks about weather, rain or temperature.",
  "input_schema": {
    "type": "object",
    "properties": {
      "city": {"type": "string", "description": "City name, for example Pune"},
      "unit": {"type": "string", "enum": ["celsius", "fahrenheit"], "description": "Temperature unit"}
    },
    "required": ["city"]
  }
}
```

The `enum` keyword limits a value to a fixed list. Use it whenever there are only a few valid choices — the model makes fewer mistakes.

> **Interview tip:** If asked "how does the model know which tool to call?", say: the tool names, descriptions and schemas are put into the model's context (they cost input tokens), and the model was fine-tuned to emit structured tool requests. So the **description is the most important part** — write it like you would explain the tool to a new teammate.

## The tool-calling loop

Here is the full flow. Read it once, then look at the diagram.

1. Your app sends the user message **plus the list of tools** to the API.
2. The model decides it needs a tool. It replies with a **`tool_use`** block (tool name, arguments, and a unique `id`). The response's **`stop_reason`** is `"tool_use"` — this means "I stopped because I am waiting for a tool result."
3. Your code runs the real function.
4. You send the result back as a **`tool_result`** block, inside a new `user` message, with the same `id` (called `tool_use_id`).
5. The model reads the result. It may ask for another tool (go back to step 2) or give the final answer, with `stop_reason` `"end_turn"`.

<figure>
<svg viewBox="0 0 440 300" width="440" height="300" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="20" y="10" width="100" height="30" rx="6" />
<text x="70" y="30" text-anchor="middle" fill="currentColor" stroke="none">Your app</text>
<rect x="170" y="10" width="100" height="30" rx="6" />
<text x="220" y="30" text-anchor="middle" fill="currentColor" stroke="none">LLM API</text>
<rect x="320" y="10" width="100" height="30" rx="6" />
<text x="370" y="30" text-anchor="middle" fill="currentColor" stroke="none">Tool (your fn)</text>
<line x1="70" y1="40" x2="70" y2="290" stroke-dasharray="4 4" />
<line x1="220" y1="40" x2="220" y2="290" stroke-dasharray="4 4" />
<line x1="370" y1="40" x2="370" y2="290" stroke-dasharray="4 4" />
<line x1="70" y1="70" x2="220" y2="70" />
<polygon points="220,70 212,66 212,74" fill="currentColor" />
<text x="145" y="63" text-anchor="middle" fill="currentColor" stroke="none">1. messages + tools</text>
<line x1="70" y1="110" x2="220" y2="110" stroke="var(--accent)" />
<polygon points="70,110 78,106 78,114" fill="var(--accent)" stroke="var(--accent)" />
<text x="145" y="103" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">2. tool_use block</text>
<line x1="70" y1="150" x2="370" y2="150" />
<polygon points="370,150 362,146 362,154" fill="currentColor" />
<text x="295" y="143" text-anchor="middle" fill="currentColor" stroke="none">3. run get_weather</text>
<line x1="70" y1="190" x2="370" y2="190" />
<polygon points="70,190 78,186 78,194" fill="currentColor" />
<text x="295" y="183" text-anchor="middle" fill="currentColor" stroke="none">4. "29°C, cloudy"</text>
<line x1="70" y1="230" x2="220" y2="230" stroke="var(--accent)" />
<polygon points="220,230 212,226 212,234" fill="var(--accent)" stroke="var(--accent)" />
<text x="145" y="223" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">5. tool_result block</text>
<line x1="70" y1="270" x2="220" y2="270" />
<polygon points="70,270 78,266 78,274" fill="currentColor" />
<text x="145" y="263" text-anchor="middle" fill="currentColor" stroke="none">6. final answer</text>
</svg>
<figcaption>The model never calls the tool directly: it returns a tool_use request (2), your app runs the function (3–4) and sends a tool_result back (5).</figcaption>
</figure>

> **Remember:** The API is **stateless**. It does not remember the earlier steps. Every request must contain the whole conversation so far: the user message, the assistant's `tool_use` turn, and your `tool_result` turn.

### What the messages look like

After step 2, the assistant's response content looks like this (simplified; real `id` values are longer):

```json
{
  "stop_reason": "tool_use",
  "content": [
    {"type": "tool_use", "id": "toolu_01A", "name": "get_weather", "input": {"city": "Pune"}}
  ]
}
```

The content can also contain other block types, such as `text` or `thinking`. Current Claude models may return short progress notes or reasoning as `thinking` blocks between tool calls. You do not need to understand them — just **append the whole `content` list back unchanged**.

In step 4 you send:

```json
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01A", "content": "{\"temp_c\": 29, \"sky\": \"cloudy\"}"}
  ]
}
```

Notice two things. The tool result goes in a **`user`** message (from the API's point of view, you are the one supplying information). And `tool_use_id` must match the `id` from the request, so the model knows which answer belongs to which call.

## A real loop with the anthropic SDK

This is a complete, runnable program. It needs `pip install anthropic` and the `ANTHROPIC_API_KEY` environment variable. The tools use fake data so you can focus on the loop.

```python
import json
import anthropic

client = anthropic.Anthropic()          # reads ANTHROPIC_API_KEY from the environment
MODEL = "claude-sonnet-5-5"

tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for an Indian city. Use for questions about weather, rain or temperature.",
        "input_schema": {
            "type": "object",
            "properties": {"city": {"type": "string", "description": "City name, e.g. Pune"}},
            "required": ["city"],
        },
    },
    {
        "name": "get_order_status",
        "description": "Look up the delivery status of a customer order by its order ID (format OD followed by digits).",
        "input_schema": {
            "type": "object",
            "properties": {"order_id": {"type": "string", "description": "Order ID, e.g. OD1234"}},
            "required": ["order_id"],
        },
    },
]

# --- The real functions (fake data for practice) ---
def get_weather(city: str) -> dict:
    data = {"pune": {"temp_c": 29, "sky": "cloudy"}, "delhi": {"temp_c": 35, "sky": "sunny"}}
    if city.lower() not in data:
        raise ValueError(f"No weather data for {city}")
    return data[city.lower()]

def get_order_status(order_id: str) -> dict:
    return {"order_id": order_id, "status": "out for delivery", "eta": "today 6 pm"}

TOOL_FUNCTIONS = {"get_weather": get_weather, "get_order_status": get_order_status}

def run_tool(name: str, args: dict) -> tuple[str, bool]:
    """Run one tool. Return (result_text, is_error). Never let an exception escape."""
    try:
        result = TOOL_FUNCTIONS[name](**args)
        return json.dumps(result), False
    except Exception as e:                       # unknown tool, bad args, tool failure
        return f"Error: {e}", True

def ask(question: str, max_rounds: int = 5) -> str:
    messages = [{"role": "user", "content": question}]
    for _ in range(max_rounds):                  # guard: never loop forever
        response = client.messages.create(
            model=MODEL, max_tokens=4096, tools=tools, messages=messages,
        )
        if response.stop_reason != "tool_use":   # "end_turn" (or max_tokens, refusal...)
            return "".join(b.text for b in response.content if b.type == "text")

        # 1) keep the assistant turn exactly as returned (tool_use + any other blocks)
        messages.append({"role": "assistant", "content": response.content})

        # 2) run every requested tool and collect ALL results in ONE user message
        results = []
        for block in response.content:
            if block.type == "tool_use":
                output, is_error = run_tool(block.name, block.input)
                results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,     # must match the request
                    "content": output,
                    "is_error": is_error,
                })
        messages.append({"role": "user", "content": results})
    return "Stopped: too many tool rounds."

print(ask("Is my order OD5521 arriving today? Also, will it rain in Pune?"))
```

```text
Your order OD5521 is out for delivery and should arrive today by 6 pm.
In Pune it is 29°C and cloudy right now, so rain is possible...
```

(The exact wording will differ each run.)

Walk through what happened:

1. Round 1: the model returned two `tool_use` blocks in one response — one for `get_order_status`, one for `get_weather`. `stop_reason` was `"tool_use"`.
2. Your code ran both and sent two `tool_result` blocks in a single user message.
3. Round 2: the model had everything it needed and answered with `stop_reason` `"end_turn"`.

> **Common mistake:** Appending only the text of the assistant reply, or forgetting to append the assistant turn at all. The next request then contains a `tool_result` with no matching `tool_use`, and the API returns a 400 error. Always append `response.content` as it is.

### The SDK's tool runner (less code)

Writing this loop by hand is the best way to learn it, and interviewers expect you to know it. In real projects, the `anthropic` SDK also has a **tool runner** (currently a beta helper) that runs the loop for you. You decorate normal Python functions, and the SDK builds the JSON Schema from the type hints and docstring:

```python
import anthropic
from anthropic import beta_tool

client = anthropic.Anthropic()

@beta_tool
def get_weather(city: str) -> str:
    """Get current weather for an Indian city.

    Args:
        city: City name, e.g. Pune.
    """
    return "29°C, cloudy"

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-5-5",
    max_tokens=4096,
    tools=[get_weather],
    messages=[{"role": "user", "content": "Weather in Pune?"}],
)
for message in runner:        # each loop step yields one model response
    print(message.content)
```

Use the manual loop when you need full control (custom logging, approval steps, unusual stopping rules); use the runner when you just want the loop to work.

## Controlling tool use

| Setting | What it does |
|---|---|
| `tool_choice={"type": "auto"}` | Default. The model decides whether to use a tool. |
| `tool_choice={"type": "none"}` | Tools are listed but the model must answer in text. |
| `tool_choice={"type": "auto", "disable_parallel_tool_use": True}` | At most one tool call per response. |
| `"strict": True` on a tool | The model's arguments are guaranteed to match your schema exactly. The schema must set `"additionalProperties": false` and list `required` fields. |

Older APIs also had a "forced" mode (`"any"`, or a specific tool name) that made the model call a tool. The newest Claude models (such as `claude-sonnet-5-5` and `claude-opus-5-5`) reject forced tool choice with a 400 error. Instead, keep `auto`, say clearly in the prompt which tool to use, and add `strict: true` if you need valid arguments. If you only wanted JSON output, use structured outputs (see [Prompt Engineering](/interview/ai-engineer/llms-genai/prompt-engineering)). API details like this change fast — check the docs when you start a project.

## Parallel tool calls

When the user asks "What is the weather in Pune and in Delhi?", the model can return **two `tool_use` blocks in one response**. This is called **parallel tool use**. It saves a full round trip.

Your job:

1. Run the calls. If they are slow (network calls), run them at the same time.
2. Return **all** the results in **one** `user` message, each with its own `tool_use_id`.

```python
from concurrent.futures import ThreadPoolExecutor

tool_blocks = [b for b in response.content if b.type == "tool_use"]

with ThreadPoolExecutor() as pool:          # run I/O-bound tools at the same time
    outputs = list(pool.map(lambda b: run_tool(b.name, b.input), tool_blocks))

results = [
    {"type": "tool_result", "tool_use_id": b.id, "content": out, "is_error": err}
    for b, (out, err) in zip(tool_blocks, outputs)
]
messages.append({"role": "assistant", "content": response.content})
messages.append({"role": "user", "content": results})    # one message, all results
```

**Worked example (time saved).** Suppose each weather API call takes 800 ms and each model call takes 1,500 ms.

- One tool per round, two cities: model (1,500) + tool (800) + model (1,500) + tool (800) + model (1,500) = **6,100 ms**.
- Parallel: model (1,500) + both tools at once (800) + model (1,500) = **3,800 ms**.

You save 2,300 ms, about 38%.

> **Common mistake:** Sending each `tool_result` in a separate user message. It works, but it teaches the model (through the conversation pattern) to stop making parallel calls. Put all results of one turn together.

## Handling errors

Tools fail all the time: a city is not found, an API times out, the model passes a wrong argument. **Do not crash the loop.** Send the error back as a `tool_result` with `"is_error": true` and a helpful message. The model will usually fix its mistake — for example, ask the user for the correct order ID or try a different spelling.

| Problem | What to do |
|---|---|
| Tool raises an exception | Catch it; return `is_error: true` with a short, clear message ("No order found with ID OD99. IDs look like OD1234.") |
| Model calls a tool name that does not exist | Return an error result listing valid tool names |
| Arguments fail validation | Validate with Pydantic or `jsonschema`; return what was wrong. Or use `strict: true` |
| Tool is slow | Set a timeout; return "timed out, try again later" |
| Tool result is huge (10,000 rows) | Truncate or summarize before sending. Large results cost tokens and confuse the model |
| API error (429 rate limit, 5xx) | The SDK retries twice by default. Add your own backoff for long jobs (see [Using LLM APIs](/interview/ai-engineer/llms-genai/using-llm-apis)) |
| Loop never ends | Keep a `max_rounds` limit, as in the code above |

Also check `stop_reason` before running tools. If it is `"max_tokens"`, the response was cut off and a tool's arguments may be incomplete — raise `max_tokens` and retry instead of running a broken call.

> **Interview tip:** Interviewers love the question "what happens when the tool fails?" Say: "I return the error as a tool result with `is_error` set, so the model can recover. I also cap the number of rounds, add timeouts, validate arguments, and log every call for debugging."

## Designing good tools

Good tools matter more than clever prompts. A few rules from experience:

- **Clear names and descriptions.** `search_orders` is better than `query_db_v2`. In the description, say *when* to use the tool and what it returns.
- **Few, simple arguments.** Three well-named parameters beat ten. Use `enum` for fixed choices.
- **Return only what is needed.** Return `{"status": "delivered"}`, not the whole 200-field database row. Every character costs tokens.
- **Helpful errors.** The error message is read by the model. Write it so the model knows what to do next.
- **Safe by default.** Read-only tools are low risk. For tools that change things (refund, delete, send email), ask the human to confirm, and give the tool only the permissions it needs. See [Safety, Guardrails and Prompt Injection](/interview/ai-engineer/llms-genai/safety-guardrails-and-prompt-injection).
- **Not too many tools.** With 50 similar tools, the model picks wrongly more often. Group them or load only the relevant ones.

## The cost of a tool loop

Every round resends the **whole history plus all tool definitions**. So tool loops cost more than a single call.

**Worked example.** Tool definitions = 300 tokens, user question = 50 tokens.

- Round 1 input: 300 + 50 = **350 tokens**. Output (the `tool_use` block): **60 tokens**.
- Round 2 input: 350 + 60 (assistant turn) + 80 (tool result) = **490 tokens**. Output (answer): **100 tokens**.
- Total input = 350 + 490 = **840 tokens**. Total output = 60 + 100 = **160 tokens**.

At `claude-sonnet-5-5` list prices when this book was written ($2 per million input tokens, $10 per million output tokens — prices change, always check):

- Input: 840 × 2 ÷ 1,000,000 = $0.00168
- Output: 160 × 10 ÷ 1,000,000 = $0.00160
- Total = **$0.00328**, about ₹0.29 at ₹88 per dollar.

Tiny for one question, but at 1 lakh questions a day it is about $328 (≈ ₹28,900) per day. This is why long agent loops need prompt caching (reusing the unchanged prefix of the request cheaply — see [Monitoring, Cost and Caching](/interview/ai-engineer/mlops-deployment/monitoring-cost-and-caching)).

## The OpenAI equivalent

The idea is the same everywhere. Only field names differ. OpenAI has two APIs: the newer **Responses API** and the older **Chat Completions API**.

| Concept | Anthropic Messages API | OpenAI Responses API | OpenAI Chat Completions |
|---|---|---|---|
| Tool schema field | `input_schema` | `parameters` (inside `{"type": "function", "name": ...}`) | `function.parameters` |
| "Model wants a tool" signal | `stop_reason == "tool_use"` | output items with `type == "function_call"` | `finish_reason == "tool_calls"` |
| Arguments | `block.input` (already a dict) | `item.arguments` (a JSON **string** — call `json.loads`) | `tool_call.function.arguments` (JSON string) |
| Call ID | `block.id` | `item.call_id` | `tool_call.id` |
| Sending the result | `tool_result` block in a `user` message | input item `{"type": "function_call_output", "call_id": ..., "output": ...}` | message with `role: "tool"` and `tool_call_id` |

A short Responses API version:

```python
import json
from openai import OpenAI

client = OpenAI()
MODEL = "gpt-5"   # keep the name in a variable; check current model names

tools = [{
    "type": "function",
    "name": "get_weather",
    "description": "Get current weather for an Indian city.",
    "parameters": {"type": "object", "properties": {"city": {"type": "string"}}, "required": ["city"]},
}]
inputs = [{"role": "user", "content": "Weather in Pune?"}]

response = client.responses.create(model=MODEL, input=inputs, tools=tools)
inputs += response.output                                # keep the model's calls in history
for item in response.output:
    if item.type == "function_call":
        args = json.loads(item.arguments)               # arguments arrive as a string
        inputs.append({"type": "function_call_output", "call_id": item.call_id,
                       "output": json.dumps(get_weather(**args))})

final = client.responses.create(model=MODEL, input=inputs, tools=tools)
print(final.output_text)
```

> **Interview tip:** If you know one provider's loop well, say "the other providers follow the same request → tool call → tool result → final answer loop; only the field names differ." That shows you understand the concept, not just one SDK.

## Key terms

| Term | Simple meaning |
|---|---|
| Tool calling / function calling | The model asks your code to run a named function with JSON arguments |
| Tool definition | Name + description + input schema that you send to the model |
| JSON Schema | A standard format that describes the shape and types of JSON data |
| `input_schema` | The JSON Schema for a tool's arguments in the Anthropic API |
| `tool_use` block | The model's request: tool name, arguments (`input`) and an `id` |
| `stop_reason` | Why the model stopped; `"tool_use"` means it waits for tool results, `"end_turn"` means it finished |
| `tool_result` block | Your reply with the tool's output, linked by `tool_use_id` |
| `is_error` | Flag on a tool result saying the tool failed, so the model can recover |
| Parallel tool use | Several tool calls in one model response |
| `tool_choice` | Setting that controls whether and how the model may use tools |
| Strict tool use | `strict: true`; guarantees arguments match the schema |
| Tool runner | SDK helper that runs the tool loop for you |
| Stateless API | The server keeps no memory; you resend the full history each time |

## Interview questions

**What is function calling and why do we need it?**
It lets an LLM request that our code run a specific function with structured JSON arguments. We need it because the model has no live data, no private data and cannot take actions. The model only decides what to call; our code executes it and returns the result, so we stay in control of what is possible.

**Walk me through the tool-calling loop.**
I send the messages plus tool definitions. If the model needs a tool, it returns `stop_reason` "tool_use" with one or more `tool_use` blocks. I append that assistant turn, run each tool, and send a user message with `tool_result` blocks that reference each `tool_use_id`. I repeat until `stop_reason` is "end_turn", with a maximum number of rounds as a guard.

**Does the model execute the function?**
No. The model only outputs text that happens to be a structured request. Execution happens in my application, which is why permissions, validation and confirmation steps belong in my code.

**How does the model choose between tools?**
The names, descriptions and schemas are placed into its context, and it was trained to match the user's need to a tool. So clear descriptions that say when to use each tool are the biggest lever. Too many overlapping tools reduce accuracy.

**How do you handle a tool that fails?**
Catch the exception and return a `tool_result` with `is_error: true` and a clear message. The model can then retry with different arguments or ask the user. I also add timeouts, argument validation and a round limit, and I log every call.

**What is parallel tool calling and what must you be careful about?**
The model returns several `tool_use` blocks in one response. I can run them concurrently, and I must return all results in a single user message, each with the matching ID. Independent calls are fine in parallel; calls that depend on each other's output need separate rounds.

**Why do tool loops cost more than a single call?**
The API is stateless, so every round resends all tool definitions and the growing history. A 3-round loop pays for the prefix three times. Prompt caching, short tool results and fewer rounds reduce the cost.

**What is strict tool use?**
With `strict: true`, the API guarantees the tool arguments match the schema, so I do not get missing fields or wrong types. The schema must disallow extra properties and list required fields.

**How does OpenAI's function calling differ from Anthropic's?**
Same loop, different field names. OpenAI calls the schema `parameters`, returns arguments as a JSON string, and the result is sent as a `function_call_output` item (Responses API) or a `tool` role message (Chat Completions) with the call ID.

**Is tool calling the same as an agent?**
No. Tool calling is the mechanism. An agent is a loop where the model keeps choosing tools on its own until a goal is reached. A single tool call inside a fixed workflow is not an agent. See the next chapter.

## Try it yourself

1. **Add a calculator tool.** Add a tool `calculate(expression: str)` to the program above and ask "What is 18% GST on ₹2,450?" *Hint:* do not use `eval` on raw input; allow only digits, `+-*/().` and spaces.
2. **Force an error.** Ask about the weather in "Mumbai" (not in the fake data). Print the `messages` list after the run. *Hint:* look for the `is_error` result and see how the model responded.
3. **Count the rounds.** Add a counter and print how many model calls each question needed, and `response.usage.input_tokens` per call. *Hint:* the second call's input is always larger.
4. **Compute the parallel saving.** Three cities, tool latency 500 ms, model latency 1,200 ms. Compare one-at-a-time versus parallel.

### Answers

1. A safe calculator:
   ```python
   import re
   def calculate(expression: str) -> dict:
       if not re.fullmatch(r"[0-9+\-*/(). ]+", expression):
           raise ValueError("Only numbers and + - * / ( ) are allowed")
       return {"result": eval(expression, {"__builtins__": {}})}
   ```
   Add it to `TOOL_FUNCTIONS` and to `tools` with a description like "Evaluate a basic arithmetic expression. Use for any calculation." The model should call it with `2450 * 0.18`, giving 441.0, so GST is ₹441.
2. You will see a `tool_result` with `"is_error": true` and content `"Error: No weather data for Mumbai"`. The model usually tells the user it does not have data for Mumbai, instead of inventing a number.
3. A question needing one tool uses 2 model calls; the second call's `input_tokens` includes the first call's input plus the tool_use and tool_result.
4. One at a time: 4 model calls + 3 tool calls = 4 × 1,200 + 3 × 500 = 4,800 + 1,500 = 6,300 ms. Parallel: 2 model calls + one batch of tools = 2 × 1,200 + 500 = 2,900 ms. Saving = 3,400 ms (about 54%).

**Next:** [AI Agents](/interview/ai-engineer/llms-genai/ai-agents)
