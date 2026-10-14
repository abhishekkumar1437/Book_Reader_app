---
title: LangChain, LangGraph and LlamaIndex
part: Agents
summary: What each popular LLM framework is for, LangChain's common model interface and pipes, a LangGraph StateGraph with conditional edges, tools and memory, LlamaIndex for RAG, and when plain Python is the better choice.
---

You can build everything in this book with plain Python and an LLM SDK — and you have, in the last three chapters. But job descriptions often mention **LangChain**, **LangGraph** and **LlamaIndex**, and many company codebases use them. This chapter tells you what each one is for, shows the current core APIs, and gives you an honest way to decide between a framework and plain code — a question interviewers like to ask.

> **In simple words:** LangChain gives you ready-made building blocks (one interface for many models, prompt templates, parsers, integrations). LangGraph lets you build agents and workflows as a graph of steps with shared state. LlamaIndex is specialised for connecting your documents to an LLM (RAG). Plain code is often fine; frameworks save time when you need their specific features.

## What each framework is for

| Framework | Main job | Think of it as | Typical use |
|---|---|---|---|
| **LangChain** | Common interfaces + many integrations | A big toolbox | Swap between Claude/OpenAI/Ollama with one line; chains of prompt → model → parser; hundreds of loaders and vector-store connectors |
| **LangGraph** | Stateful, multi-step workflows and agents as graphs | A flowchart engine with memory | Agents with loops, branching, human approval, pause/resume, multi-agent systems |
| **LlamaIndex** | Data ingestion, indexing and retrieval for LLMs | A RAG specialist | Load PDFs/Notion/SQL, chunk, index, and query with a few lines |

LangChain and LangGraph come from the same company and work together: LangGraph is the lower-level engine, and since LangChain 1.0 (late 2025) LangChain's own agent helper is built on LangGraph. LlamaIndex is a separate project, though it can be used alongside the others.

> **Remember:** These libraries change quickly — names move between packages and old tutorials break. Learn the concepts (model interface, state, nodes, edges, index, retriever), and check the current docs for exact imports when you start a project.

## LangChain: the building blocks

### One interface for many models

Every chat model in LangChain has the same methods: `.invoke()` (one call), `.stream()` (token by token), `.batch()` (many inputs). So switching providers is a one-line change.

```python
# pip install langchain-anthropic langchain-openai
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI

llm = ChatAnthropic(model="claude-sonnet-5-5")
# llm = ChatOpenAI(model=OPENAI_MODEL)         # same code below works unchanged

reply = llm.invoke("Explain UPI in one sentence.")
print(reply.content)
```

### Pipes: prompt → model → parser

LangChain lets you join components with the `|` operator. This is called the **LangChain Expression Language (LCEL)**. The output of each step becomes the input of the next.

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a patient tutor. Explain in simple English for a beginner."),
    ("user", "Explain {topic} with one Indian example."),
])
chain = prompt | llm | StrOutputParser()      # template -> model -> plain string

print(chain.invoke({"topic": "compound interest"}))
```

A **prompt template** is a prompt with blanks (`{topic}`) filled in at run time. An **output parser** turns the model's message into something useful — here a plain string.

### Structured output

Very often you want a Python object, not text. `with_structured_output` takes a Pydantic model and returns validated objects:

```python
from pydantic import BaseModel, Field

class Ticket(BaseModel):
    category: str = Field(description="one of: billing, delivery, other")
    urgent: bool
    summary: str

extractor = llm.with_structured_output(Ticket)
t = extractor.invoke("I was charged twice for order OD881 and I need the money back today!")
print(t)
# Output: category='billing' urgent=True summary='Customer charged twice for order OD881, wants refund today.'
```

### Integrations

LangChain's biggest strength is its catalogue: document loaders (PDF, web, Notion), text splitters, embedding models, and vector stores (Chroma, FAISS, pgvector, Pinecone — see [Vector Databases](/interview/llms-genai/vector-databases)). If you need to read 15 kinds of files, this saves real time.

> **Common mistake:** Building deep, many-layered chains you cannot debug. When a chain of 6 components gives a bad answer, you must find which step failed. Keep chains short, and use tracing (LangSmith, Langfuse, or plain logging — see [Monitoring, Cost and Caching](/interview/mlops-deployment/monitoring-cost-and-caching)) to see each step's input and output.

## LangGraph: workflows and agents as graphs

### Why a graph?

A chain goes in one direction: A → B → C. Agents need more:

- **Loops** — call the model, run a tool, call the model again.
- **Branching** — go to the billing step or the delivery step based on a decision.
- **Shared state** — every step reads and updates the same data.
- **Persistence** — save progress so a conversation or long job can pause and resume, even after a crash.
- **Human-in-the-loop** — stop and wait for a person to approve before a risky step.

LangGraph models your program as a **graph**: **nodes** are steps (Python functions), **edges** are the arrows between them, and a **state** object flows through.

| Concept | Meaning |
|---|---|
| **State** | A typed dictionary (usually a `TypedDict`) shared by all nodes |
| **Node** | A function that takes the state and returns a dict of *updates* to it |
| **Edge** | A fixed arrow: after node A, always go to node B |
| **Conditional edge** | A function that looks at the state and returns the name of the next node |
| `START` / `END` | Special nodes marking where the graph begins and finishes |
| **Reducer** | A rule for how an update merges into a state key (replace, or append to a list) |
| **Checkpointer** | Saves the state after each step, so you can resume or keep conversation memory |
| `compile()` | Turns the graph definition into a runnable app with `.invoke()` and `.stream()` |

### Example 1: a support-ticket router (runs without an API key)

<figure>
<svg viewBox="0 0 440 170" width="440" height="170" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<ellipse cx="32" cy="85" rx="24" ry="16" />
<text x="32" y="89" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">START</text>
<line x1="56" y1="85" x2="70" y2="85" />
<rect x="70" y="65" width="90" height="40" rx="6" stroke="var(--accent)" />
<text x="115" y="89" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">classify</text>
<line x1="160" y1="85" x2="220" y2="30" />
<line x1="160" y1="85" x2="220" y2="85" />
<line x1="160" y1="85" x2="220" y2="140" />
<text x="190" y="80" text-anchor="middle" fill="var(--accent)" stroke="none" font-size="10">route()</text>
<rect x="220" y="12" width="90" height="36" rx="6" />
<text x="265" y="34" text-anchor="middle" fill="currentColor" stroke="none">billing</text>
<rect x="220" y="67" width="90" height="36" rx="6" />
<text x="265" y="89" text-anchor="middle" fill="currentColor" stroke="none">delivery</text>
<rect x="220" y="122" width="90" height="36" rx="6" />
<text x="265" y="144" text-anchor="middle" fill="currentColor" stroke="none">other</text>
<line x1="310" y1="30" x2="378" y2="80" />
<line x1="310" y1="85" x2="378" y2="85" />
<line x1="310" y1="140" x2="378" y2="90" />
<ellipse cx="402" cy="85" rx="24" ry="16" />
<text x="402" y="89" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">END</text>
</svg>
<figcaption>A conditional edge after "classify" picks exactly one of three nodes, then the graph ends.</figcaption>
</figure>

```python
# pip install langgraph
from typing import TypedDict, Literal
from langgraph.graph import StateGraph, START, END

class TicketState(TypedDict):
    text: str
    category: str
    reply: str

def classify(state: TicketState) -> dict:
    t = state["text"].lower()                    # in real life: an LLM call
    if "refund" in t or "charged" in t:
        return {"category": "billing"}
    if "late" in t or "where is" in t:
        return {"category": "delivery"}
    return {"category": "other"}

def billing(state: TicketState) -> dict:
    return {"reply": "Billing team: we will check your payment within 24 hours."}

def delivery(state: TicketState) -> dict:
    return {"reply": "Delivery team: your order is on the way."}

def other(state: TicketState) -> dict:
    return {"reply": "Thanks! A support person will reply soon."}

def route(state: TicketState) -> Literal["billing", "delivery", "other"]:
    return state["category"]                     # the returned string is the next node

graph = StateGraph(TicketState)
graph.add_node("classify", classify)
graph.add_node("billing", billing)
graph.add_node("delivery", delivery)
graph.add_node("other", other)
graph.add_edge(START, "classify")
graph.add_conditional_edges("classify", route)
for node in ["billing", "delivery", "other"]:
    graph.add_edge(node, END)

app = graph.compile()
print(app.invoke({"text": "I was charged twice for my order"}))
```

```text
{'text': 'I was charged twice for my order', 'category': 'billing', 'reply': 'Billing team: we will check your payment within 24 hours.'}
```

Notice that each node returns **only the keys it changes**. LangGraph merges the update into the state. By default a new value **replaces** the old one.

### Example 2: a tool-using agent with memory

For a chat agent, the state is a list of messages, and you want new messages **appended**, not replaced. You say this with a **reducer**: `Annotated[list, add_messages]`.

```python
# pip install langgraph langchain-anthropic
from typing import Annotated, TypedDict
from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool
from langgraph.graph import StateGraph, START
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import MemorySaver

@tool
def get_train_status(train_no: str) -> str:
    """Get the live running status of an Indian Railways train by its number."""
    return f"Train {train_no} is running 25 minutes late, next station Nagpur."

tools = [get_train_status]
llm = ChatAnthropic(model="claude-sonnet-5-5").bind_tools(tools)   # model now knows the tools

class State(TypedDict):
    messages: Annotated[list, add_messages]      # reducer: append, don't replace

def agent(state: State) -> dict:
    return {"messages": [llm.invoke(state["messages"])]}

graph = StateGraph(State)
graph.add_node("agent", agent)
graph.add_node("tools", ToolNode(tools))         # prebuilt node that runs tool calls
graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", tools_condition)   # tool call? -> "tools", else -> END
graph.add_edge("tools", "agent")                 # after tools, back to the model: a loop!

app = graph.compile(checkpointer=MemorySaver())  # saves state per conversation thread

config = {"configurable": {"thread_id": "user-42"}, "recursion_limit": 10}
out = app.invoke({"messages": [("user", "Is train 12627 on time?")]}, config)
print(out["messages"][-1].content)
out = app.invoke({"messages": [("user", "Which station did you say is next?")]}, config)
print(out["messages"][-1].content)               # remembers: same thread_id
```

```text
Train 12627 is running about 25 minutes late. Its next station is Nagpur.
I said the next station is Nagpur.
```

What each piece does:

- `bind_tools(tools)` sends the tool schemas to the model with every call (the same JSON Schema idea as [Tool Calling](/interview/llms-genai/tool-calling)).
- `ToolNode` runs whatever tool calls the last AI message asked for and adds the results as tool messages.
- `tools_condition` is a ready-made conditional edge: if the last message has tool calls, go to `"tools"`; otherwise end.
- The edge `tools → agent` creates the **loop** — this is the agent loop from [AI Agents](/interview/llms-genai/ai-agents), drawn as a graph.
- `MemorySaver` is an in-memory **checkpointer**. With the same `thread_id`, the second call continues the same conversation. In production use a database-backed checkpointer (Postgres, SQLite, Redis).
- `recursion_limit` is LangGraph's **max-steps guard**: it raises an error if the graph runs more than that many steps.

### Human-in-the-loop

LangGraph can pause inside a node and wait for a person. You call `interrupt(...)` (from `langgraph.types`) inside a node — for example, before a `issue_refund` tool runs. The graph saves its state through the checkpointer and returns. Later you resume it with `Command(resume="approved")`. Because state is saved, the pause can last seconds or days. This **durable execution** is one of the main reasons teams pick LangGraph over a hand-written loop.

> **Interview tip:** If asked "why LangGraph instead of a while loop?", say: explicit state, branching and loops you can visualise, built-in persistence per thread, pause/resume for human approval, streaming of intermediate steps, and good support for multi-agent graphs. For a 30-line agent, a while loop is still fine.

## LlamaIndex: RAG with very little code

LlamaIndex focuses on the "data" half of an LLM app: loading documents, splitting them into **nodes** (its word for chunks), building an **index**, and querying it. The classic five lines:

```python
# pip install llama-index llama-index-llms-anthropic llama-index-embeddings-huggingface
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.llms.anthropic import Anthropic
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

Settings.llm = Anthropic(model="claude-sonnet-5-5")
Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")   # local, free

docs = SimpleDirectoryReader("company_policies/").load_data()   # PDFs, .docx, .txt ...
index = VectorStoreIndex.from_documents(docs)                    # chunk + embed + store
query_engine = index.as_query_engine(similarity_top_k=3)

answer = query_engine.query("How many casual leaves do employees get per year?")
print(answer)
for src in answer.source_nodes:                                   # which chunks were used
    print(src.metadata.get("file_name"), round(src.score, 2))
```

This hides every step of the RAG pipeline from [RAG Fundamentals](/interview/llms-genai/rag-fundamentals): load → chunk → embed → store → retrieve → augment → generate. You can still control each one (chunk size, a real vector database, a reranker, hybrid search from [Advanced RAG](/interview/llms-genai/advanced-rag)) through settings and components. LlamaIndex also has chat engines, agents and workflow features, but RAG is where it is strongest.

| Task | LangChain | LlamaIndex |
|---|---|---|
| Quick RAG over a folder | Possible, more pieces to connect | Very fast, sensible defaults |
| Advanced retrieval (sub-questions, hierarchical, routers) | Possible | Many built-in retrievers and query engines |
| Many model/tool integrations | Very large catalogue | Large catalogue (LlamaHub) |
| Complex agent control flow | Use LangGraph | Has workflows, but LangGraph is more common |

## Other frameworks you may hear about

| Name | One-line description |
|---|---|
| OpenAI Agents SDK | Lightweight agent loop with handoffs between agents, for OpenAI models (and others via adapters) |
| Claude Agent SDK | The harness behind Claude Code as a library: built-in file, shell and web tools, subagents, MCP |
| CrewAI | Multi-agent "crews" with roles and tasks; quick to prototype |
| AutoGen / Microsoft Agent Framework | Microsoft's multi-agent conversation frameworks |
| Pydantic AI | Type-safe agents built around Pydantic models |
| DSPy | Treats prompts as programs and optimizes them automatically against a metric |
| Haystack | Production pipelines for search and RAG |

You do not need to learn all of them. Know one deeply (LangGraph is the most asked-about for agents) and understand that the rest are variations of the same loop.

## Framework or plain code?

This is the most useful judgment in this chapter.

| Factor | Plain Python + SDK | Framework |
|---|---|---|
| Learning curve | Low — you already know Python | Medium to high; frequent API changes |
| Debugging | Easy — every line is yours | Harder — errors deep inside library code |
| Speed of first prototype | Medium | Fast, especially RAG and many integrations |
| Control over prompts and API features | Full; new API features available on day one | Sometimes lags behind provider features |
| Persistence, pause/resume, human approval | You build it | Built in (LangGraph) |
| Swapping providers | You write a thin wrapper | Built in |
| Dependencies | Small | Many packages, version conflicts possible |

A sensible path many teams follow:

1. **Prototype** with whatever is fastest (often LlamaIndex for RAG, or a plain loop for an agent).
2. **Measure** with an eval set (see [Evaluating LLM Apps](/interview/llms-genai/evaluating-llm-apps)).
3. **Keep** framework parts that give real value (LangGraph's checkpointing, a loader you need). **Replace** layers you do not understand or cannot debug.

> **Interview tip:** Avoid both extremes. Do not say "frameworks are useless" or "I always use LangChain." Say: "I understand the underlying loop, so I can use a framework where it saves time — like LangGraph for persistence and human-in-the-loop — and drop to plain SDK code where I need control or simpler debugging."

## Key terms

| Term | Simple meaning |
|---|---|
| LangChain | Library of common interfaces and integrations for LLM apps |
| LCEL | LangChain Expression Language; joining components with `\|` |
| Prompt template | A prompt with placeholders filled at run time |
| Output parser | Converts model output into a string, JSON or object |
| Structured output | Getting a validated object (e.g. Pydantic) from the model |
| LangGraph | Library for building stateful workflows and agents as graphs |
| State | The shared data that flows through a LangGraph graph |
| Node | One step in the graph; a function returning state updates |
| Edge / conditional edge | Fixed arrow between nodes / a function choosing the next node |
| Reducer | Rule for merging an update into state (e.g. append messages) |
| Checkpointer | Saves graph state after each step for memory and resume |
| Thread ID | Identifier for one conversation's saved state |
| Recursion limit | LangGraph's maximum number of steps in one run |
| Interrupt | Pausing a graph to wait for human input |
| Durable execution | A long task that survives pauses and crashes because state is saved |
| LlamaIndex | Framework focused on data ingestion and retrieval for RAG |
| Node (LlamaIndex) | A chunk of a document with metadata |
| Query engine | LlamaIndex object that retrieves and answers a question |

## Interview questions

**What is the difference between LangChain and LangGraph?**
LangChain provides building blocks: a common model interface, prompt templates, parsers and many integrations, joined in mostly linear chains. LangGraph builds stateful applications as graphs with nodes, edges, loops and branches, plus checkpointing and human-in-the-loop. Agents with loops and persistence are LangGraph territory.

**Explain the main concepts of a LangGraph StateGraph.**
The state is a typed dictionary shared by all nodes. Nodes are functions that receive the state and return partial updates. Edges connect nodes, conditional edges choose the next node from the state, and START and END mark entry and exit. Reducers define how updates merge, for example appending messages. You compile the graph, optionally with a checkpointer, and call invoke or stream.

**How does LangGraph give an agent memory across turns?**
A checkpointer saves the state after every step, keyed by a thread ID. When I invoke again with the same thread ID, the graph loads the saved messages and continues. In production I use a database-backed checkpointer instead of the in-memory one.

**How do you prevent infinite loops in LangGraph?**
The recursion limit in the run config caps the number of steps and raises an error when exceeded. I also design conditional edges with clear exit conditions and can track a step counter in the state.

**When would you choose LlamaIndex?**
When the main problem is getting my documents into an LLM — loading many formats, chunking, indexing and advanced retrieval. It gives a working RAG pipeline in a few lines with good defaults that I can then tune.

**What are the downsides of using frameworks?**
Extra abstraction makes debugging harder, APIs change often, new provider features may arrive later, and dependency trees get large. Over-abstracted chains hide prompts, so it is harder to see what the model actually received.

**Would you use a framework for a production agent?**
It depends on the need. If I need persistence, pause and resume for human approval and complex branching, LangGraph saves real work. If the agent is a simple tool loop, plain SDK code is easier to test and debug. Either way I add tracing and an eval set.

**What does `bind_tools` do?**
It attaches tool schemas to a chat model so they are sent with every call, letting the model return tool calls. The tools are usually created from Python functions with type hints and docstrings.

## Try it yourself

1. **Add a node.** In the ticket router, add an `escalate` node that runs after `billing` only if the text contains "urgent". *Hint:* replace the fixed edge `billing → END` with a conditional edge.
2. **See the memory.** In Example 2, call `app.get_state(config).values["messages"]` after both turns and count the messages. *Hint:* tool calls and tool results are messages too.
3. **Swap the model.** Change Example 2 to use a local Ollama model through `langchain-ollama` (`ChatOllama`). Which lines change? *Hint:* only the model line, if the model supports tools.
4. **Decide.** For each, framework or plain code? (a) A one-off script that summarizes 500 PDFs once. (b) A support agent that must pause for manager approval before refunds above ₹5,000. (c) A classifier that tags reviews as positive/negative.

### Answers

1. ```python
   def needs_escalation(state) -> Literal["escalate", "__end__"]:
       return "escalate" if "urgent" in state["text"].lower() else END
   graph.add_node("escalate", lambda s: {"reply": s["reply"] + " Escalated to a manager."})
   graph.add_conditional_edges("billing", needs_escalation)
   graph.add_edge("escalate", END)
   ```
   (`END` is the string `"__end__"`.) Remove the old `billing → END` edge from the loop.
2. Turn 1 adds: user message, AI message with a tool call, tool message, final AI message = 4. Turn 2 adds: user message + AI answer = 2. Total **6** messages.
3. Only `llm = ChatOllama(model="llama3.1").bind_tools(tools)` (with `from langchain_ollama import ChatOllama`). The graph code stays the same — that is the benefit of a common interface.
4. (a) Plain code — a simple loop over files, maybe a batch API. (b) LangGraph — interrupts and checkpointing make the pause/resume easy. (c) Plain code — one call with structured output; no framework needed.

**Next:** [Multi-Agent Systems](/interview/llms-genai/multi-agent-systems)
