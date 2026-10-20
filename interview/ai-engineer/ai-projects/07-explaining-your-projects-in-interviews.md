---
title: Explaining Your Projects in Interviews
part: Interview
summary: The 2-minute project pitch with a full worked example for the RAG chatbot, how to walk through an architecture, how to answer trade-off and "what would you improve" questions, and 30 project questions with model answers.
---

Building the project is half the work. The other half is explaining it so that an interviewer, in 30 minutes, believes three things: you really built it, you understand why every part is there, and you can think about its weaknesses. Many candidates with good projects fail here because they ramble, list technologies without reasons, or freeze on a follow-up question. This chapter gives you a fixed pitch structure, a complete worked example, a method for architecture walk-throughs and trade-off questions, and a bank of 30 questions with model answers to practise out loud.

> **In simple words:** Prepare a 2-minute story with six parts: problem, what you built, how it works, the hardest decision, the result with numbers, and what you would improve. Then prepare to go three levels deeper on every part, and always answer "why" with a constraint and a trade-off.

## What interviewers are really testing

When an interviewer says "tell me about your project", they are checking:

| What they check | How they check it | What fails |
|---|---|---|
| Ownership | Detailed follow-ups: "why 150 characters of overlap?" | Vague answers, "the tutorial did it that way" |
| Understanding | "What happens, step by step, when a user asks a question?" | Skipping steps, mixing up components |
| Judgement | "Why X and not Y?" | One-sided answers with no downside |
| Measurement | "How do you know it works?" | "It worked when I tried it" |
| Communication | Your structure and clarity | Long monologues, jargon without explanation |
| Honesty | Questions at the edge of your knowledge | Bluffing |

> **Interview tip:** You control the first two minutes. Use them to plant the topics you want to be asked about: a decision you are proud of, a metric you improved, a failure you fixed. Interviewers usually follow the threads you give them.

## The 2-minute pitch template

Speak at a comfortable pace, about 130–150 words per minute. Two minutes is therefore about 260–300 words. Write your pitch, read it aloud with a timer, and cut until it fits.

| Part | Time | What to say | Template sentence |
|---|---|---|---|
| 1. Problem | 15 s | Who has the problem, why it matters | "<Who> wastes time / loses money because <problem>." |
| 2. What you built | 20 s | The product in one sentence, the main features | "I built <thing> that <does what> so that <benefit>." |
| 3. How it works | 30 s | The architecture as a 4–5 step flow | "When <input> comes in, it <step 1>, <step 2>, <step 3>, and returns <output>." |
| 4. Hardest decision | 25 s | One real problem, the options, your choice and why | "The hardest part was <problem>. I compared <A> and <B> and chose <A> because <reason>." |
| 5. Result | 15 s | Numbers from your eval, latency, cost | "On a <N>-question eval it reaches <metric>, at about <cost> per <unit>." |
| 6. Next step | 15 s | One improvement tied to a measured weakness | "Its weakest area is <X>, so next I would <Y>." |

Rules that make the pitch work:

- **One sentence per idea.** Short sentences are easier for you to say and for them to follow.
- **Numbers you can defend.** Every number must come from your eval or logs, and you must know how it was measured.
- **Name technologies with reasons.** Not "I used Chroma", but "I used Chroma because it runs in-process, so there was no server to manage".
- **End with an open door.** "Happy to go deeper into retrieval or the eval." The interviewer often accepts the invitation.

## Worked example: the RAG PDF chatbot pitch

This is a complete pitch for [Project 1](/interview/ai-engineer/ai-projects/project-rag-pdf-chatbot). The numbers in angle brackets are placeholders; use your own measured values. Read it aloud and time yourself.

> **Problem.** In most companies, policies live in long PDFs. Employees spend minutes searching for a single rule, and a general chatbot cannot help because it has never seen those private documents.
>
> **What I built.** I built a RAG chatbot that answers questions from uploaded PDFs, cites the exact file and page for every claim, and says "I could not find this" when the documents do not contain the answer.
>
> **How it works.** When a PDF is uploaded, I extract text page by page with pypdf, split each page into 800-character chunks with 150 characters of overlap, embed them with a small sentence-transformers model, and store them in Chroma with the file name and page. When a question comes in, I embed it, retrieve the five closest chunks, and if the best similarity is below a threshold, I return "not found" without calling the LLM. Otherwise Claude answers using only those chunks, with numbered citations. It runs as a FastAPI service with a simple web page.
>
> **Hardest decision.** The hardest part was chunking. My first version used whole pages, and retrieval often missed the right passage because one page covered several topics. I built an eval set first, then compared chunk sizes and overlaps on it instead of guessing.
>
> **Result.** On my <25>-question eval, retrieval hit rate went from <0.70> to <0.90>, faithfulness measured with an LLM judge is <0.95>, and it correctly refuses all <5> out-of-scope questions. A question costs about <half a cent> and takes about <2> seconds.
>
> **Next step.** Its weakest questions are ones with exact codes, like policy numbers, where semantic search struggles. So next I would add BM25 hybrid search and a reranker and measure them on the same eval. I'm happy to go deeper into retrieval or the eval.

That is about 290 words, so roughly two minutes. Notice what it does:

- Every technology comes with a reason or a role.
- It plants three follow-up topics: chunking, the threshold, the eval.
- It admits a weakness and turns it into a plan.

### The 30-second version

Sometimes you get "briefly describe your projects". Compress to problem, build, one number:

> "I built a RAG chatbot over company PDFs that answers with page-level citations and refuses when the answer isn't in the documents. It uses pypdf, sentence-transformers, Chroma, Claude and FastAPI. I wrote a 25-question eval and used it to raise retrieval hit rate from 0.70 to 0.90 by tuning chunking."

Prepare a 30-second and a 2-minute version for each of your three main projects.

## The architecture walk-through

Interviewers often say "draw it for me". Practise drawing each project on paper or a whiteboard in this order, talking while you draw:

<figure>
<svg viewBox="0 0 440 190" width="440" height="190" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="11">
<rect x="5" y="20" width="80" height="40" rx="6" />
<text x="45" y="38" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">1</text>
<text x="45" y="52" text-anchor="middle" fill="currentColor" stroke="none">user + input</text>
<line x1="85" y1="40" x2="103" y2="40" />
<polygon points="103,36 111,40 103,44" fill="currentColor" />
<rect x="111" y="20" width="96" height="40" rx="6" />
<text x="159" y="38" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">2</text>
<text x="159" y="52" text-anchor="middle" fill="currentColor" stroke="none">entry point (API)</text>
<line x1="207" y1="40" x2="225" y2="40" />
<polygon points="225,36 233,40 225,44" fill="currentColor" />
<rect x="233" y="20" width="96" height="40" rx="6" />
<text x="281" y="38" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">3</text>
<text x="281" y="52" text-anchor="middle" fill="currentColor" stroke="none">core logic</text>
<line x1="329" y1="40" x2="347" y2="40" />
<polygon points="347,36 355,40 347,44" fill="currentColor" />
<rect x="355" y="20" width="80" height="40" rx="6" />
<text x="395" y="38" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">4</text>
<text x="395" y="52" text-anchor="middle" fill="currentColor" stroke="none">output</text>
<line x1="281" y1="60" x2="281" y2="88" />
<polygon points="277,88 281,96 285,88" fill="currentColor" />
<rect x="196" y="96" width="170" height="40" rx="6" />
<text x="281" y="114" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">5</text>
<text x="281" y="128" text-anchor="middle" fill="currentColor" stroke="none">data stores + external APIs</text>
<rect x="5" y="96" width="170" height="40" rx="6" stroke-dasharray="4 3" />
<text x="90" y="114" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">6</text>
<text x="90" y="128" text-anchor="middle" fill="currentColor" stroke="none">offline parts (ingest, eval)</text>
<text x="220" y="170" text-anchor="middle" fill="currentColor" stroke="none">7. Then add: auth, monitoring, cost limits, failure handling</text>
</svg>
<figcaption>Draw the main request path first, then storage, then the offline jobs, and only then the production concerns.</figcaption>
</figure>

1. **Start with the user and the input.** "A student uploads a PDF or asks a question."
2. **The entry point.** "Requests go to a FastAPI service."
3. **The core logic** in 3–5 boxes, following one request. Say what each step outputs.
4. **The output** and what the user sees (answer, citations).
5. **Data stores and external services.** Vector store or database, the LLM API.
6. **Offline paths.** Ingestion and the eval run, drawn with dashed lines.
7. **Production concerns last:** auth, monitoring, cost controls, errors.

While drawing, keep one request in mind and trace it with your finger. "This question goes here, becomes a 384-number vector, goes to the database, comes back as five chunks..." Concrete beats abstract.

### Prepare three levels of depth

For every box in your diagram, prepare answers at three depths. Interviewers drill down until you reach the edge of your knowledge, and they want to see how deep you go.

| Box | Level 1 (what) | Level 2 (how) | Level 3 (why / edge cases) |
|---|---|---|---|
| Chunking | Split pages into 800-character pieces with overlap | Sliding window that cuts at word boundaries, per page | Why per page (exact citations), the cost (answers across page breaks), how I chose the size (eval) |
| Embeddings | MiniLM turns text into 384 numbers | Normalized vectors, so dot product = cosine | Same model for docs and queries; 256-token limit; when I'd switch to an API model |
| Vector search | Chroma finds the 5 nearest chunks | HNSW approximate search, squared L2 on unit vectors | Converting distance to similarity; threshold choice; filtering issues at scale |
| Generation | Claude answers from the chunks | System prompt rules, XML-tagged sources, citations parsed with a regex | Prompt injection in documents; refusals; cost per question |

Write this table for each of your projects. It is the best preparation you can do.

## Trade-off questions

"Why did you choose X?" is really asking "do you know the alternatives and the costs?" Use this four-part answer:

1. **The choice and the main reason**, tied to a constraint: "I chose Chroma because this is a single-user app and Chroma runs in-process with no server."
2. **The alternative you considered**: "I also considered pgvector and Pinecone."
3. **The downside you accepted**: "The cost is that Chroma isn't built for many concurrent writers or very large scale."
4. **When you would switch**: "With many users I'd move to pgvector, so permissions and vectors live in one database, which is what I did in my capstone."

> **Common mistake:** Saying "X is the best". Nothing is best in general; things are best for a constraint. An answer with no downside sounds like you have not thought about it.

Common trade-offs in AI projects and the constraint that usually decides them:

| Trade-off | Usually decided by |
|---|---|
| RAG vs fine-tuning | Do facts change often? Are citations needed? (RAG for both) |
| Big model vs small model | Task difficulty vs latency and cost; measure on your eval |
| Local embeddings vs API embeddings | Privacy, cost and operations vs quality |
| Agent vs fixed workflow | Are the steps known in advance? (workflow if yes) |
| Framework (LangChain/LangGraph) vs plain code | Need for built-in persistence, branching, human-in-the-loop vs debuggability |
| Background task vs queue | Scale and reliability requirements |
| Logistic regression vs gradient boosting | Accuracy gain vs explainability and simplicity |

## "What would you improve?"

This question is almost guaranteed. A weak answer lists random features ("add a mobile app"). A strong answer:

1. Names a **measured weakness**: "In my eval, 4 of the 5 failures were questions about tables."
2. Explains the **cause**: "pypdf flattens tables, so the chunk loses row and column meaning."
3. Proposes a **specific fix**: "Use a layout-aware parser and convert tables to Markdown before chunking."
4. Says how you would **verify**: "I'd add 10 table questions to the eval and compare."

Prepare one such answer per project. Also prepare one "production" improvement (monitoring, scaling, security), because interviewers for engineering roles like to hear you think beyond the demo.

## Honesty, "we" vs "I", and not knowing

- **Team projects:** say "we" for the team's work and "I" for yours, and be specific: "We built a support bot; I owned retrieval and the eval." Interviewers will ask about your part.
- **Tutorials:** it is fine to say "I started from a tutorial structure and then changed X and Y". It is not fine to hide it and be caught.
- **When you do not know:** say what you do know, then reason. "I haven't measured that. My guess is that most of the latency is the LLM call, because embedding and vector search are milliseconds. I'd confirm by timing each step." Reasoning aloud scores better than a confident wrong answer.
- **Never invent numbers.** "I didn't measure p95 latency, only the median, which was about 2 seconds" is a perfectly good answer.

> **Remember:** An interviewer can forgive "I don't know, but here is how I'd find out". They rarely forgive a bluff they catch.

## Behavioural questions about projects

Behavioural rounds also use your projects. Use **STAR** (Situation, Task, Action, Result), about one minute each. Prepare these three stories from your projects:

- **A failure or bug:** "Citations pointed to the wrong page (S). I had to find why (T). I traced one question through each step and found pypdf counts pages from 0 (A). I fixed it, added a test, and checked 20 citations by hand (R)."
- **A decision under uncertainty:** choosing chunk size without knowing the answer, and building an eval to decide.
- **Learning something fast:** learning MCP or LangGraph for the research agent in two days, and what you did to learn it (built a tiny server first, read the spec examples).

## Practice routine (Days 143–150)

This is the interview mode of the [150-day plan](/interview/ai-engineer/ai-roadmap/how-to-use-this-roadmap).

| Day | Practice |
|---|---|
| 143 | Write the 2-minute and 30-second pitch for your three main projects; time them aloud |
| 144 | Draw each architecture from memory; fill the three-levels-of-depth table for each |
| 145 | Answer the question bank below aloud, recording yourself; re-record the weakest five |
| 146 | Mock interview with a friend: they pick any box in your diagram and drill down |
| 147 | Revision day: re-run your evals, update numbers in README and resume |
| 148 | Trade-off drills: for each technology in your projects, say the four-part answer |
| 149 | Full mock: pitch, walk-through, 10 random questions from this chapter |
| 150 | Light review; check every demo link works; rest |

Record yourself on your phone. Listen for filler words, missing numbers and answers longer than 90 seconds.

## Project question bank

The ⭐ questions are the most frequently asked. Answers use the projects in this book; replace details with your own.

### General questions about any project

**⭐ 1. Tell me about a project you are proud of.**
Use the 2-minute template: problem, what you built, how it works, the hardest decision, the result with numbers, and the next step. Choose your strongest project for the role: the capstone or RAG chatbot for LLM-focused roles. End with an invitation to go deeper.
*Follow-up the interviewer may ask:* "What was your specific contribution?" Be precise about what you built yourself.

**⭐ 2. How do you know your project works?**
"I built an evaluation set before tuning anything: questions with known answers and the page each answer is on, plus questions the documents cannot answer. I measure retrieval hit rate, fact match, faithfulness with an LLM judge, refusal rates, latency and cost, and run it after every change. I also read a sample of answers by hand because metrics can mislead."
*Follow-up:* "How big is the eval set and how did you write it?" Say the number, that you wrote questions by reading the documents, and that you included paraphrased and unanswerable questions.

**⭐ 3. What was the hardest problem and how did you solve it?**
Pick a real technical problem with a clear before and after. Describe how you diagnosed it (traced one example through every step), the options, the fix, and how you measured that the fix worked. Example: low retrieval hit rate fixed by smaller chunks with overlap, measured on the eval.

**⭐ 4. What would you do differently if you started again?**
Name a process lesson and a technical one. "I'd write the eval set on day one, because my early changes were guesses. And I'd add database migrations from the start instead of `create_all`, because changing the schema later meant resetting the database."

**5. How much does it cost to run, and how did you calculate it?**
"I log input and output tokens for every call. A typical question uses about 1,200 input and 300 output tokens; at the model's per-million-token prices that is about half a US cent. I cap max tokens, keep answers short, and the capstone has a per-user daily budget enforced before every call."

**6. What happens when the LLM API fails or is slow?**
"The SDK retries rate limits and server errors a couple of times. After that, the API returns a clear 503 message instead of a stack trace, and the parts of the app that do not need the LLM keep working. Next steps would be a fallback model, a timeout per call, and streaming so slow answers feel faster."

**7. How did you test your code?**
"Unit tests for pure logic like chunking, cost calculation and URL safety checks. For the agent loop and the API, I replaced the LLM and embedding model with fakes, so tests are fast, free and deterministic. CI runs them on every push with a real Postgres service. Model quality is measured separately by the eval, because unit tests cannot judge answer quality."

### RAG chatbot

**⭐ 8. Walk me through what happens when a user asks a question.**
"The question is embedded with the same model as the documents. Chroma returns the five nearest chunks with distances, which I convert to cosine similarity. If the best is below my threshold, I return 'not found' without calling the LLM. Otherwise I build a prompt with the chunks in numbered source tags plus the question, Claude answers with citations, and I return the answer with only the sources it cited."

**⭐ 9. How did you choose chunk size and overlap?**
"I started at 800 characters with 150 overlap, because that is about 150–200 tokens, well within the embedding model's limit, and usually one idea per chunk. Then I compared alternatives on the eval and kept the best hit rate without a big token increase. The overlap means a sentence on a boundary is complete in at least one chunk."
*Follow-up:* "What if documents were legal contracts?" Mention structure-aware chunking by clause or section headings, and re-measuring.

**⭐ 10. How do you reduce hallucinations?**
"Four layers: a retrieval threshold so we skip the LLM when nothing relevant is found; a strict prompt to answer only from sources with an exact refusal sentence; citations the user can verify; and an eval measuring faithfulness and refusal rates. I also tell the model that document text is data, not instructions."

**11. Why didn't you fine-tune a model on the documents?**
"Fine-tuning is good for style and behaviour but poor for storing facts. It is expensive, it cannot cite pages, it can still mix facts, and every document change means retraining. RAG updates instantly when a PDF changes and keeps private data out of model weights."

**12. What is the difference between retrieval metrics and generation metrics?**
"Retrieval metrics, like hit rate at k, check whether the right passage was found. Generation metrics, like faithfulness and answer correctness, check what the model did with it. Measuring both tells me which half to fix: if hit rate is low, improve chunking or search; if hit rate is high but faithfulness is low, fix the prompt."

**13. How would you improve retrieval?**
"Hybrid search, combining BM25 keyword scores with vector scores, helps with exact terms like codes and names. A cross-encoder reranker over the top 20 improves ordering. Query rewriting helps follow-up questions. Better parsing helps tables. I would add each one separately and measure on the eval."

**14. What is prompt injection, and is your RAG bot vulnerable?**
"It is when text the model reads, such as a sentence inside a PDF, tries to override its instructions. Any LLM reading untrusted text is somewhat vulnerable. My bot wraps documents in tags and tells the model to ignore instructions inside them, but the real protection is that the bot has no tools or secrets, so the worst outcome is a bad answer, which citations make visible."

### Research agent

**⭐ 15. How does your agent loop work?**
"I send the conversation and tool definitions to Claude. If the response stops with 'tool_use', I run each requested tool, send back tool results with matching ids in one message, and call again. The loop ends when the model gives a final answer, or my code stops it at the step limit or token budget, in which case I ask for a final answer with tools disabled."

**⭐ 16. How do you stop an agent from looping forever or spending too much?**
"A maximum number of model calls, a token budget per question, and per-tool limits like a maximum of four page fetches. I also truncate tool outputs so the context doesn't explode. When a limit is hit, the agent still returns a best-effort answer that says what is missing."

**17. How did you evaluate the agent?**
"Questions with stable facts, checking both outcome and trajectory: whether key facts appear, whether it finished within budget, whether every cited URL was actually fetched, the number of tool errors, steps, cost and time. I ran it three times and averaged, because agents take different paths each run."

**18. What security risks does a web-browsing agent have?**
"Prompt injection from pages, SSRF if it can fetch internal addresses, path traversal if it writes files, and runaway cost. I block private and loopback addresses before and after redirects, write notes only to a sandboxed folder with sanitized names, wrap tool output as untrusted, and keep tools low-privilege. Anything with real-world effects would need human approval."

**19. Why did you build the loop by hand instead of using LangGraph from the start?**
"To understand the protocol: message formats, parallel tool calls, error results and stopping. Then I rebuilt it in LangGraph and could compare. LangGraph gives checkpointing, human-in-the-loop pauses and branching; plain code was easier to test with a fake client. I'd choose based on whether I need those features."

**20. What is MCP and why did you build a server?**
"The Model Context Protocol is an open standard for connecting AI applications to tools and data. A server exposes tools, resources and prompts; any MCP host, such as Claude Desktop or Claude Code, can use them through a client. My server exposes the search and notes tools, so they work in any host without new integration code."

**21. When should you not use an agent?**
"When the steps are known in advance. A fixed workflow is cheaper, faster, more predictable and easier to test. Agents make sense for open-ended tasks where the value justifies extra cost and latency and where mistakes can be caught."

### Capstone (full-stack app)

**⭐ 22. How do you keep users' data separate?**
"Every user-owned row has a user id, and every query filters on the id from the verified JWT, never from the request body. Vector search filters by user id in the same SQL query. Accessing another user's document by id returns 404, not 403, so we don't even confirm it exists. A test with two users checks this. At scale I'd add Postgres row-level security as a second layer."

**⭐ 23. Why pgvector and not a vector database like Pinecone?**
"One database holds users, documents, permissions and vectors, so filtering and similarity happen in one query, deleting a document cascades to its chunks, and there is one system to back up. At our scale pgvector with an HNSW index is fast enough. I'd consider a dedicated vector database at very large scale or if I needed features like managed hybrid search."
*Follow-up:* "Any problem with filters and HNSW?" Explain post-filtering returning fewer than k results and pgvector's iterative scans.

**24. Explain your authentication.**
"Passwords are hashed with argon2; login returns a signed JWT with the user id and an expiry. Each protected route verifies the signature and expiry with a pinned algorithm and loads the user. The same error is returned for unknown email and wrong password. The JWT secret lives in Secret Manager, not in code."

**25. Why are uploads processed in the background, and what are the limits of your approach?**
"Embedding a large PDF takes many seconds, so the upload returns 202 and processing continues after the response, with a status the UI polls. The limitation is that the task lives in the same container, so a crash loses the job, and on Cloud Run I had to keep CPU allocated after responses. At scale I'd use a queue with workers and retries."

**26. How did you deploy it, and how are secrets handled?**
"Both services are Docker images deployed to Cloud Run in Mumbai, built from source with Cloud Build. The database is managed Postgres with pgvector. The API key, JWT secret and database URL are in Secret Manager and injected as environment variables; the service account has only the secret-reader role. Instance count is capped and there are budget alerts."

**27. What do you monitor?**
"Every LLM call is traced in Langfuse with tokens, cost and latency, linked to the user id. My own usage table powers the daily budget and the usage display. I watch p50 and p95 latency, error rates, cost per day, failed ingestions, and the share of 'not found' answers, which would jump if retrieval broke."

**28. How would you scale it to 100,000 users?**
"The API is stateless, so it scales horizontally. Ingestion moves to a queue with autoscaled workers, maybe with an embedding API to keep containers small. Postgres gets connection pooling, read replicas, and tuned or partitioned vector indexes. Add a cache for repeated questions, per-user rate limits, and atomic budget counters in Redis."

### Mini projects

**29. In your churn project, why not just use accuracy, and how did you pick the threshold?**
"Only about 26.5% of customers churn, so always predicting 'stays' gets 73.5% accuracy and catches nobody. I compared models with ROC-AUC and average precision, then chose the threshold from business costs: missing a churner costs more than an extra call, so I set a recall target and picked the best precision at that recall using cross-validated predictions, not the test set."

**30. In your image classifier, why transfer learning and why two stages?**
"With about 3,000 training images, training from scratch would overfit. A ResNet pretrained on ImageNet already detects general visual features, so I replaced its head with a 37-class layer and trained only that first, because a random head sends large, noisy gradients that would damage pretrained weights. Then I unfroze the last block with a ten times smaller learning rate to adapt the features gently."

### Trade-offs and judgement

**31. Which model did you use and why that one?**
"I used a mid-tier model, Claude Sonnet, because grounded Q&A over a few chunks does not need the largest model, and it balances quality, speed and cost. I kept the model name in configuration and would compare a smaller model on the eval: if quality holds, it is cheaper and faster. I'd use the largest model only where the eval shows it matters."

**32. If you had one more week, what would you build?**
Use the improvement method: a measured weakness, its cause, a specific fix, how you'd verify. "My eval shows table questions fail most, because text extraction flattens tables. I'd add a layout-aware parser that turns tables into Markdown, add ten table questions to the eval, and compare hit rate before and after."

## Final checklist before an interview

- [ ] 2-minute and 30-second pitch for each main project, timed aloud
- [ ] Architecture drawn from memory for each project
- [ ] Three-levels-of-depth table for each project
- [ ] Every number on your resume: you know how it was measured
- [ ] One "hardest problem", one "what I'd improve" and one failure story per project
- [ ] Four-part trade-off answer for every technology you list
- [ ] All demo links and repositories open and work (check the morning of the interview)
- [ ] README results match your latest eval run

You have built five projects and can now explain them. Go back to the [roadmap](/interview/ai-engineer/ai-roadmap/how-to-use-this-roadmap) for the final interview days, or to the [book home](/interview/ai-engineer/ai-projects) to revisit any project.
