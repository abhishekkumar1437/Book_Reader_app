---
title: Using LLM APIs
part: How LLMs Work
summary: Calling LLMs from Python with the anthropic and openai SDKs — messages and roles, system prompts, multi-turn chat, streaming, token counting and cost estimation, rate limits and retries, local open models with Ollama, and how to choose a model.
---

Most AI engineering work starts with one HTTP call to a model provider. You send messages, you get text (and token counts) back. Doing this well in production means more than one call: streaming for a good user experience, counting tokens to control cost, retrying when the provider is busy, and choosing the right model for each job. This chapter gives you working code for the Anthropic and OpenAI Python SDKs and for local models with Ollama.

> **In simple words:** An LLM API takes a list of messages (who said what) plus some settings, and returns the model's reply and how many tokens were used. The server remembers nothing between calls, so your code keeps the conversation. You pay per token, so you measure tokens.

## The shape of a request and a response

Every major chat API has the same basic parts.

| Part | Meaning | Example |
|---|---|---|
| `model` | which model to use | `"claude-sonnet-5-5"` |
| `system` | instructions that apply to the whole conversation | `"You are a polite support agent for an Indian bank."` |
| `messages` | the conversation so far, as a list of turns | `[{"role": "user", "content": "Hi"}]` |
| role `user` | text from the person (or your app) | the question |
| role `assistant` | earlier replies from the model | its previous answers |
| `max_tokens` | ceiling on output tokens | `1024` |
| response `content` | the model's reply (a list of blocks: text, tool calls, thinking) | `"Hello! How can I help?"` |
| response `stop_reason` | why it stopped | `end_turn`, `max_tokens`, `tool_use` |
| response `usage` | input and output token counts | `input_tokens=25, output_tokens=12` |

The **system prompt** is a special instruction that sets the model's role, rules and output format. It is stronger than a normal user message and stays the same for every turn. With OpenAI's Chat Completions API it is sent as a message with role `system` (newer OpenAI models also call it `developer`); with Anthropic it is a separate `system` parameter.

## Setup

```bash
pip install anthropic openai ollama python-dotenv
```

Put keys in environment variables, never in code or Git.

```bash
# .env  (add .env to .gitignore!)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

```python
from dotenv import load_dotenv
load_dotenv()          # reads .env into environment variables; SDKs read them automatically
```

> **Common mistake:** Committing an API key to GitHub. Bots scan public repos and use leaked keys within minutes, and you pay the bill. If it happens, revoke the key immediately in the provider console.

## Your first call with the Anthropic SDK

```python
import anthropic

client = anthropic.Anthropic()            # reads ANTHROPIC_API_KEY from the environment

response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=1024,
    system="You are a friendly tutor. Answer in at most 3 short sentences.",
    messages=[
        {"role": "user", "content": "What is UPI and why is it popular in India?"}
    ],
)

# content is a list of blocks; pick the text ones
answer = "".join(block.text for block in response.content if block.type == "text")
print(answer)
print(response.stop_reason)               # e.g. "end_turn"
print(response.usage.input_tokens, response.usage.output_tokens)
```

```text
UPI (Unified Payments Interface) lets you send money instantly between bank accounts using just a phone and a UPI ID or QR code. It is popular because it is free for users, works 24x7, and is supported by almost every bank and shop.
end_turn
41 52
```

(Your exact words and token counts will differ.) Three habits to build now:

1. **Read text blocks by type.** The `content` list can also contain `thinking` blocks (from reasoning) or `tool_use` blocks (see [Tool Calling](/interview/llms-genai/tool-calling)). Don't assume `content[0]` is text.
2. **Check `stop_reason`.** `max_tokens` means the answer was cut off. A `refusal` stop reason means the provider's safety system declined the request; handle it gracefully.
3. **Log `usage`.** It is your bill.

Current Claude models think adaptively before answering. For simple jobs like short chat or classification, you can ask for less thinking (cheaper, faster) with the effort setting:

```python
response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=256,
    output_config={"effort": "low"},      # low | medium | high | xhigh | max
    messages=[{"role": "user", "content": "Is this review positive or negative? 'Delivery was late but the phone is great.'"}],
)
```

### Multi-turn conversations

The API is **stateless**: the server forgets everything after each call. To hold a conversation, you keep a list of messages and send the whole list every time.

```python
import anthropic

client = anthropic.Anthropic()
history = []                                   # grows every turn

def chat(user_text: str) -> str:
    history.append({"role": "user", "content": user_text})
    resp = client.messages.create(
        model="claude-sonnet-5-5",
        max_tokens=1024,
        system="You are a helpful assistant for train travel in India.",
        messages=history,                      # full history every time
    )
    reply = "".join(b.text for b in resp.content if b.type == "text")
    history.append({"role": "assistant", "content": reply})
    return reply

print(chat("I want to go from Delhi to Jaipur tomorrow morning."))
print(chat("Which class should I book for a 5-hour trip?"))   # model sees turn 1 too
```

Because the full history is resent, input tokens grow every turn. See the context window section in [Generation Settings and the Context Window](/interview/llms-genai/generation-settings-and-the-context-window) for trimming strategies.

## Streaming

Without streaming, the user stares at a spinner until the whole answer is ready (maybe 10–30 seconds for a long answer). With **streaming**, the server sends tokens as they are generated, so text appears almost immediately. The key metric is **time to first token (TTFT)**. Streaming also avoids HTTP timeouts on long outputs.

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-5-5",
    max_tokens=4096,
    system="You are a concise technical writer.",
    messages=[{"role": "user", "content": "Explain what a vector database is, in 5 bullet points."}],
) as stream:
    for text in stream.text_stream:          # yields text pieces as they arrive
        print(text, end="", flush=True)

    final = stream.get_final_message()       # full message after the stream ends

print()
print("stop:", final.stop_reason)
print("tokens in/out:", final.usage.input_tokens, final.usage.output_tokens)
```

In a web app you forward these pieces to the browser with Server-Sent Events (SSE); see [FastAPI for AI Apps](/interview/mlops-deployment/fastapi-for-ai-apps).

> **Interview tip:** When asked how to make a chatbot feel fast, say: stream the response, keep the prompt short or cached to lower time to first token, use a smaller model or lower effort for simple turns, and show progress for tool calls. Mention TTFT and output tokens per second as the two numbers you'd measure.

## The same with the OpenAI SDK

OpenAI has two APIs. **Chat Completions** is the older, very widely copied format (many other providers and Ollama offer an "OpenAI-compatible" version of it). The **Responses API** is OpenAI's newer interface. Model names change often, so keep the name in a variable and check the current list in OpenAI's docs.

```python
from openai import OpenAI

client = OpenAI()                     # reads OPENAI_API_KEY
MODEL = "gpt-5-mini"                  # example name: check OpenAI's docs for current models

# Chat Completions style: the system prompt is just the first message
resp = client.chat.completions.create(
    model=MODEL,
    messages=[
        {"role": "system", "content": "You are a friendly tutor. Answer in at most 3 short sentences."},
        {"role": "user", "content": "What is UPI and why is it popular in India?"},
    ],
)
print(resp.choices[0].message.content)
print(resp.choices[0].finish_reason)              # "stop" or "length"
print(resp.usage.prompt_tokens, resp.usage.completion_tokens)
```

```python
# Responses API style
resp = client.responses.create(
    model=MODEL,
    instructions="You are a friendly tutor. Answer in at most 3 short sentences.",
    input="What is UPI and why is it popular in India?",
)
print(resp.output_text)                            # convenience: all text joined
print(resp.usage.input_tokens, resp.usage.output_tokens)

# Streaming with the Responses API
stream = client.responses.create(model=MODEL, input="Write a haiku about monsoon.", stream=True)
for event in stream:
    if event.type == "response.output_text.delta":
        print(event.delta, end="", flush=True)
```

| Concept | Anthropic (`anthropic`) | OpenAI Chat Completions | OpenAI Responses |
|---|---|---|---|
| Call | `client.messages.create` | `client.chat.completions.create` | `client.responses.create` |
| System prompt | `system=` parameter | message with role `system` / `developer` | `instructions=` |
| Output text | text blocks in `resp.content` | `resp.choices[0].message.content` | `resp.output_text` |
| Why it stopped | `stop_reason` (`end_turn`, `max_tokens`, `tool_use`) | `finish_reason` (`stop`, `length`, `tool_calls`) | `status` and output items |
| Token usage | `usage.input_tokens`, `usage.output_tokens` | `usage.prompt_tokens`, `usage.completion_tokens` | `usage.input_tokens`, `usage.output_tokens` |
| Streaming | `client.messages.stream(...)` → `text_stream` | `stream=True` → `chunk.choices[0].delta.content` | `stream=True` → `response.output_text.delta` events |
| Output limit | `max_tokens` (required) | `max_completion_tokens` | `max_output_tokens` |

> **Remember:** The ideas are identical across providers: messages with roles, a system instruction, a token limit, a stop reason, token usage. Learn the ideas; the field names are a quick lookup.

## Counting tokens

You need token counts **before** a call (to check the context window and estimate cost) and **after** a call (to track real cost).

- **After**: always read `usage` from the response. This is the true billed number.
- **Before, Anthropic**: use the token counting endpoint, which uses the real tokenizer.

```python
count = client.messages.count_tokens(
    model="claude-sonnet-5-5",
    system="You are a helpful assistant.",
    messages=[{"role": "user", "content": "Summarize this contract: ..."}],
)
print(count.input_tokens)
```

- **Before, OpenAI models**: the `tiktoken` library implements OpenAI's tokenizers locally. Do not use it to estimate Claude or Llama tokens; each model family has a different tokenizer.

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")       # tokenizer used by recent OpenAI models
print(len(enc.encode("I love cricket and chai.")))
```

- **Rough rule** when nothing else is available: English ≈ 4 characters per token, ≈ 0.75 words per token. Code, numbers, and Indian languages often use more tokens per word.

## Estimating cost

Providers charge separately for **input tokens** and **output tokens**, quoted per million tokens. Output is usually several times more expensive than input.

<div class="formula">

| Formula | Meaning |
|---|---|
| cost per request = input_tokens × input_price ÷ 1,000,000 + output_tokens × output_price ÷ 1,000,000 | prices in $ per million tokens |
| monthly cost = cost per request × requests per day × 30 | simple projection |
| thinking tokens | billed as output tokens on most providers |

</div>

### Worked example: a support chatbot

The prices below are **example prices for illustration only**. Real prices differ between models and change often, so always check the provider's pricing page.

- Example large model: **$2** per million input tokens, **$10** per million output tokens.
- Example small model: **$0.10** per million input tokens, **$0.50** per million output tokens.

Each request has 2,000 input tokens (system prompt 1,500 + question and context 500) and 300 output tokens. Traffic: 10,000 requests per day.

**Large model:**

1. Input: 2,000 × $2 ÷ 1,000,000 = $0.004
2. Output: 300 × $10 ÷ 1,000,000 = $0.003
3. Per request: $0.004 + $0.003 = **$0.007**
4. Per day: $0.007 × 10,000 = **$70**
5. Per month: $70 × 30 = **$2,100** (at an example rate of ₹85 per dollar, about ₹1,78,500)

**Small model:**

1. Input: 2,000 × $0.10 ÷ 1,000,000 = $0.0002
2. Output: 300 × $0.50 ÷ 1,000,000 = $0.00015
3. Per request: **$0.00035**, per month: $0.00035 × 10,000 × 30 = **$105**

**If the large model also thinks for 1,500 tokens** per request, output becomes 1,800 tokens: 1,800 × $10 ÷ 1,000,000 = $0.018, plus $0.004 input = **$0.022** per request, about **3 times** the cost without thinking.

**With prompt caching** of the 1,500-token system prompt, suppose cached reads cost 10% of the normal input price (an example discount; check the real one, and note that writing to the cache usually costs a little more than normal input):

1. Cached part: 1,500 × $0.20 ÷ 1,000,000 = $0.0003
2. Uncached part: 500 × $2 ÷ 1,000,000 = $0.001
3. Input now costs $0.0013 instead of $0.004 per request.

Main cost levers, roughly in the order to try them:

| Lever | Typical effect |
|---|---|
| Prompt caching for repeated prefixes | big cut in input cost and latency |
| Shorter prompts (remove unused instructions, fewer chunks) | proportional cut |
| Smaller model for easy requests (routing) | often 10–20× cheaper per request |
| Lower thinking effort for simple tasks | fewer output tokens |
| Batch API for non-urgent jobs | providers usually discount around 50% |
| Limit output length by instruction | fewer output tokens |

A small helper to track cost from `usage`:

```python
# EXAMPLE prices in $ per million tokens. Replace with real values from the pricing page.
PRICES = {
    "claude-sonnet-5-5": {"in": 2.00, "out": 10.00},
    "claude-haiku-5-5":  {"in": 0.10, "out": 0.50},
}

def cost_usd(model: str, usage) -> float:
    p = PRICES[model]
    return (usage.input_tokens * p["in"] + usage.output_tokens * p["out"]) / 1_000_000

print(f"${cost_usd('claude-sonnet-5-5', response.usage):.5f}")
```

> **Interview tip:** In system design rounds, interviewers love a quick cost estimate. State your assumptions (tokens in, tokens out, requests per day, example price), do the multiplication out loud, and then name two levers to reduce it. Being in the right order of magnitude matters more than the exact price.

## Rate limits, errors and retries

Providers limit how much you can send. Typical limits are **requests per minute (RPM)**, **input tokens per minute (ITPM)** and **output tokens per minute (OTPM)**, set per organization and per model, and raised as you spend more. If you go over, you get HTTP **429 Too Many Requests**, usually with a `retry-after` header.

| Error | Meaning | What to do |
|---|---|---|
| 400 Bad request | your request is invalid (bad parameter, too many tokens) | fix the code; do not retry |
| 401 / 403 | bad or missing API key, no permission | fix configuration; do not retry |
| 404 | wrong model name or endpoint | fix the name |
| 429 | rate limited | wait (respect `retry-after`), then retry |
| 500, 503, 529 | server error or overloaded | retry with backoff; consider a fallback model |
| Timeout / connection error | network problem | retry with backoff |

Rule: **retry only errors that can succeed later** (429, 5xx, timeouts). Never retry a 400 in a loop.

The official SDKs already retry 429 and 5xx errors with **exponential backoff** (waiting longer after each failure: 1s, 2s, 4s, ...). The default in the Anthropic and OpenAI SDKs is 2 retries; you can raise it:

```python
import anthropic

client = anthropic.Anthropic(max_retries=5, timeout=60.0)   # timeout in seconds

try:
    resp = client.messages.create(
        model="claude-sonnet-5-5",
        max_tokens=512,
        messages=[{"role": "user", "content": "Hello"}],
    )
except anthropic.RateLimitError as e:          # still 429 after all retries
    print("Rate limited; retry-after =", e.response.headers.get("retry-after"))
except anthropic.APIStatusError as e:          # any other HTTP error status
    print("API error", e.status_code, e.message)
except anthropic.APIConnectionError:
    print("Network problem")
```

When you send many requests (for example, summarizing 5,000 documents), also limit **concurrency** so you don't trigger 429s in the first place:

```python
import asyncio
import anthropic

client = anthropic.AsyncAnthropic(max_retries=5)
limit = asyncio.Semaphore(8)                   # at most 8 requests in flight

async def summarize(doc: str) -> str:
    async with limit:
        resp = await client.messages.create(
            model="claude-haiku-5-5",           # small model for a bulk, simple task
            max_tokens=300,
            messages=[{"role": "user", "content": f"Summarize in 2 lines:\n\n{doc}"}],
        )
        return "".join(b.text for b in resp.content if b.type == "text")

async def main(docs):
    return await asyncio.gather(*(summarize(d) for d in docs))

# summaries = asyncio.run(main(list_of_docs))
```

For jobs that don't need an answer right away, use the provider's **Batch API** instead: you submit thousands of requests at once and collect results later (often within hours) at a discount.

> **Common mistake:** Writing your own `while True: try ... except: sleep(1)` loop. It retries non-retryable errors forever, ignores `retry-after`, and all your workers retry at the same moment. Use the SDK's retries, add **jitter** (a small random delay) if you write your own, and cap the number of attempts.

## Open models locally with Ollama

**Open-weight models** (Llama, Qwen, Mistral, Gemma, DeepSeek and others) publish their weights, so you can run them on your own machine. **Ollama** is the easiest way to do this on a laptop: it downloads quantized models and serves them on `http://localhost:11434`.

```bash
# after installing Ollama from ollama.com
ollama pull llama3.2          # download a small model (a few GB)
ollama run llama3.2           # chat in the terminal
ollama list                   # see downloaded models
```

From Python, use the `ollama` package:

```python
import ollama

resp = ollama.chat(
    model="llama3.2",
    messages=[
        {"role": "system", "content": "You answer in one sentence."},
        {"role": "user", "content": "What is a GPU?"},
    ],
)
print(resp["message"]["content"])

# streaming
for chunk in ollama.chat(model="llama3.2",
                         messages=[{"role": "user", "content": "Count from 1 to 5."}],
                         stream=True):
    print(chunk["message"]["content"], end="", flush=True)
```

Ollama also offers an **OpenAI-compatible** endpoint, so the OpenAI SDK works by changing the base URL. This makes it easy to switch between a local model in development and a hosted model in production:

```python
from openai import OpenAI

local = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")  # key is ignored
resp = local.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "Say hello in Hindi."}],
)
print(resp.choices[0].message.content)
```

| Use a hosted API when... | Use a local / self-hosted open model when... |
|---|---|
| you need the best quality, reasoning, coding or agents | data must not leave your machine or network |
| you want zero infrastructure work | you have high, steady volume and GPUs to amortize |
| traffic is spiky or small | you want offline use or full control of the model |
| you need long context and tool use that just work | you plan to fine-tune the model yourself |

For production self-hosting, teams use serving engines such as **vLLM** or **TGI** rather than Ollama; see [Serving Models](/interview/mlops-deployment/serving-models). Cloud platforms (AWS Bedrock, Google Vertex AI, Azure) also host many models behind their own APIs; see [Cloud for AI](/interview/mlops-deployment/cloud-for-ai).

## Choosing a model

There is no single best model. Choose per task, and re-check every few months because models change quickly.

| Factor | Questions to ask |
|---|---|
| Quality | Does it pass **your** evaluation set? (Public benchmarks are only a hint.) |
| Cost | Price per million input/output tokens × your expected volume |
| Latency | Time to first token and tokens per second for your prompt size |
| Context window | Does your largest prompt plus output fit comfortably? |
| Capabilities | Tool calling, structured output, vision, long documents, reasoning |
| Data and privacy | Where is data processed? Retention policy? Need for self-hosting? |
| Reliability | Rate limits you can get, uptime, a fallback model |
| Licence (open models) | Is commercial use allowed? |

A practical pattern is **model routing**: send easy, high-volume requests (classification, short replies, extraction) to a small fast model, and hard ones (multi-step reasoning, coding, agent planning) to a large model. Start with a strong model to find out what "good" looks like, build an eval set, then try cheaper models and keep them only if they pass.

| Task | Good starting choice |
|---|---|
| Classification, routing, short extraction at high volume | small model, low effort |
| RAG answers over documents | mid-size model |
| Complex reasoning, coding, agents | large or reasoning model |
| Private or offline data on a laptop | local open model with Ollama |
| Millions of offline items | small model + Batch API |

> **Interview tip:** If asked "which LLM would you use?", don't name one model and stop. Say: "I'd define the task and an eval set, start with a strong model to set the quality bar, then test cheaper models and route easy traffic to the smallest one that passes, while watching latency, cost and data-privacy needs."

## A production checklist

- [ ] API keys in environment variables or a secrets manager, never in code
- [ ] Model name in config, not hard-coded across the codebase
- [ ] Streaming for user-facing responses
- [ ] `stop_reason` / `finish_reason` checked; truncation and refusals handled
- [ ] `usage` logged per request with cost, latency and model name
- [ ] SDK retries with backoff; timeouts set; concurrency limited
- [ ] A fallback model or a friendly error message when the provider is down
- [ ] Prompt caching for long, repeated prefixes
- [ ] An evaluation set run before switching models or prompts ([Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps))

## Key terms

| Term | Simple meaning |
|---|---|
| SDK | A library that wraps the HTTP API in easy functions |
| System prompt | Instructions that apply to the whole conversation |
| Role | Who wrote a message: `user`, `assistant` (and `system`/`developer` in OpenAI) |
| Content block | One piece of a reply: text, thinking, or a tool call |
| Stop reason / finish reason | Why generation ended |
| Usage | Token counts returned with each response |
| Stateless API | The server keeps no conversation memory between calls |
| Streaming | Receiving the reply piece by piece as it is generated |
| Time to first token (TTFT) | Delay until the first piece of text arrives |
| Server-Sent Events (SSE) | A simple way to stream text from a server to a browser |
| Effort | A setting that controls how much a reasoning model thinks |
| Token counting | Measuring how many tokens a prompt uses before sending it |
| tiktoken | OpenAI's local tokenizer library |
| Prompt caching | Discounted reuse of a repeated prompt prefix |
| Batch API | Submit many requests for later processing at lower cost |
| Rate limit | Maximum requests or tokens allowed per minute |
| HTTP 429 | "Too many requests" error |
| Exponential backoff | Waiting longer after each failed retry |
| Jitter | A small random delay so clients don't retry at the same time |
| Concurrency limit | Maximum number of requests in flight at once |
| Open-weight model | A model whose weights are published for anyone to run |
| Ollama | A tool to download and run open models locally |
| OpenAI-compatible API | An endpoint that accepts the OpenAI request format |
| Model routing | Sending each request to the cheapest model that can handle it |

## Interview questions

**What is the difference between the system prompt and a user message?**
The system prompt sets the role, rules, tone and format for the entire conversation and is given higher priority by the model. User messages are the individual turns of the conversation. Put stable instructions in the system prompt and the changing request in the user message; this also helps prompt caching.

**How do you maintain conversation context with a stateless API?**
The application stores the message history and sends all of it on every request, alternating user and assistant turns. As it grows, you trim old turns, summarize them, or retrieve only relevant past messages, while keeping the system prompt fixed.

**Why use streaming? What do you measure?**
Streaming shows text as it is generated, so the user sees a response in under a second instead of waiting for the whole answer, and long outputs don't hit HTTP timeouts. I measure time to first token and output tokens per second, plus total latency. In a web app I forward the stream to the browser with Server-Sent Events.

**Estimate the monthly cost: 50,000 requests a day, 1,000 input and 200 output tokens each, at an example price of $1 per million input and $5 per million output.**
Input per request is 1,000 × $1 ÷ 1M = $0.001 and output is 200 × $5 ÷ 1M = $0.001, so $0.002 per request. Per day that is $100, and about $3,000 per month. I would then look at caching the system prompt, routing easy requests to a smaller model, and limiting output length.

**How do you handle rate limits from an LLM provider?**
Use the SDK's built-in retries with exponential backoff and respect the retry-after header. Limit concurrency with a semaphore or a queue, spread bulk jobs over time or use the Batch API, and request higher limits as usage grows. For user-facing paths, have a fallback model or a graceful error.

**Which errors should you retry and which not?**
Retry 429, 5xx and overload errors, timeouts and connection errors, because they can succeed later. Don't retry 400, 401, 403 or 404, because the request itself is wrong and will fail again. Always cap the retries and add jitter.

**Why can't you use tiktoken to count tokens for Claude?**
Every model family has its own tokenizer with its own vocabulary, so the same text gives different counts. tiktoken implements OpenAI's tokenizers only. For Claude, use the token counting endpoint or the usage field in responses.

**When would you run an open model locally instead of using an API?**
When data must stay on-premises for privacy or compliance, when I need offline use, when I want to fine-tune and fully control the model, or when volume is high and steady enough that owning GPUs is cheaper. For best quality on complex reasoning and agents, or for spiky traffic, hosted APIs are usually better.

**How would you choose between a small and a large model for a feature?**
Build a small eval set for the feature, run the large model to set the quality bar, then run the small model. If the small one passes, use it for that traffic; often I route easy requests to the small model and escalate hard or low-confidence ones to the large model. I also compare latency and cost per request.

**What do thinking tokens mean for cost and latency?**
Reasoning models generate internal thinking before the answer, and those tokens are usually billed as output tokens and take time to generate. That can multiply cost and latency for each request. So I use high effort only where it improves results on my eval, and low effort or a non-reasoning small model for simple tasks.

## Try it yourself

1. **Chat loop.** Write a terminal chatbot that keeps history, streams each reply with `messages.stream`, and prints the cost of each turn using the `cost_usd` helper. Hint: use `stream.get_final_message().usage`.
2. **Cost estimate.** A résumé screener processes 2,000 résumés a day. Each call has 3,000 input tokens and 400 output tokens. Using example prices of $2 / $10 per million (large) and $0.10 / $0.50 (small), compute the monthly cost for each. Hint: 30 days.
3. **Provider switch.** Write one function `ask(prompt, provider)` that works with `"anthropic"`, `"openai"` and `"ollama"` and returns plain text. Hint: Ollama can use the OpenAI client with a different `base_url`.
4. **Retry test.** Set `max_retries=0` on the client and send 30 requests in parallel to see a 429 (if your limit is low), then turn retries back on with a semaphore of 5.

### Answers

1. Key part:

```python
with client.messages.stream(model="claude-sonnet-5-5", max_tokens=2048,
                            messages=history) as stream:
    reply = ""
    for t in stream.text_stream:
        print(t, end="", flush=True)
        reply += t
    usage = stream.get_final_message().usage
history.append({"role": "assistant", "content": reply})
print(f"\n[cost ${cost_usd('claude-sonnet-5-5', usage):.5f}]")
```

2. Large: input 3,000 × 2 ÷ 1M = $0.006, output 400 × 10 ÷ 1M = $0.004 → $0.010 per résumé → $20/day → **$600/month**. Small: 3,000 × 0.10 ÷ 1M = $0.0003, 400 × 0.50 ÷ 1M = $0.0002 → $0.0005 → $1/day → **$30/month**.
3. One approach:

```python
import anthropic
from openai import OpenAI

def ask(prompt: str, provider: str) -> str:
    if provider == "anthropic":
        r = anthropic.Anthropic().messages.create(
            model="claude-sonnet-5-5", max_tokens=1024,
            messages=[{"role": "user", "content": prompt}])
        return "".join(b.text for b in r.content if b.type == "text")
    if provider == "openai":
        c, model = OpenAI(), "gpt-5-mini"          # check current model names
    elif provider == "ollama":
        c, model = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama"), "llama3.2"
    else:
        raise ValueError(provider)
    r = c.chat.completions.create(model=model, messages=[{"role": "user", "content": prompt}])
    return r.choices[0].message.content
```

4. With no retries, some calls raise `anthropic.RateLimitError` if you exceed your limit. With retries and `asyncio.Semaphore(5)`, all should succeed, just more slowly.

**Next:** [Prompt Engineering](/interview/llms-genai/prompt-engineering)
