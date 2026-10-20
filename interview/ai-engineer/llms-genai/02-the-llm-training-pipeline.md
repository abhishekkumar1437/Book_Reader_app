---
title: The LLM Training Pipeline
part: How LLMs Work
summary: How a raw next-token predictor becomes a helpful assistant — pretraining, supervised fine-tuning, reward models and RLHF, DPO, reasoning models trained with reinforcement learning, and safety training.
---

A model that only predicts the next token is not yet a helpful assistant. If you ask it a question, it may answer with three more questions, because that is what it saw on the web. This chapter explains the stages that turn a raw model into something like Claude or ChatGPT. As an AI engineer you will mostly use finished models, but you will fine-tune open models, read model cards, and answer interview questions like "what is RLHF?" and "how is DPO different?".

> **In simple words:** First the model reads a huge amount of text and learns language (pretraining). Then it studies good example conversations (supervised fine-tuning). Then it learns from human or AI preferences which answers are better (RLHF or DPO). Newer models also practise solving problems with checkable answers so they learn to think step by step (reasoning training).

## The pipeline at a glance

<figure>
<svg viewBox="0 0 440 240" width="440" height="240" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<rect x="10" y="20" width="120" height="50" rx="8" />
<text x="70" y="41" text-anchor="middle" fill="currentColor" stroke="none">Raw text</text>
<text x="70" y="58" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">trillions of tokens</text>
<line x1="130" y1="45" x2="160" y2="45" />
<polygon points="160,45 152,41 152,49" fill="currentColor" />
<rect x="160" y="20" width="110" height="50" rx="8" />
<text x="215" y="41" text-anchor="middle" fill="currentColor" stroke="none">Pretraining</text>
<text x="215" y="58" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">next-token loss</text>
<line x1="270" y1="45" x2="300" y2="45" />
<polygon points="300,45 292,41 292,49" fill="currentColor" />
<rect x="300" y="20" width="130" height="50" rx="8" />
<text x="365" y="41" text-anchor="middle" fill="currentColor" stroke="none">Base model</text>
<text x="365" y="58" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">only continues text</text>
<line x1="365" y1="70" x2="365" y2="100" />
<polygon points="365,100 361,92 369,92" fill="currentColor" />
<rect x="300" y="100" width="130" height="50" rx="8" />
<text x="365" y="121" text-anchor="middle" fill="currentColor" stroke="none">SFT</text>
<text x="365" y="138" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">example chats</text>
<line x1="300" y1="125" x2="270" y2="125" />
<polygon points="270,125 278,121 278,129" fill="currentColor" />
<rect x="160" y="100" width="110" height="50" rx="8" />
<text x="215" y="121" text-anchor="middle" fill="currentColor" stroke="none">Preferences</text>
<text x="215" y="138" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">RLHF or DPO</text>
<line x1="160" y1="125" x2="130" y2="125" />
<polygon points="130,125 138,121 138,129" fill="currentColor" />
<rect x="10" y="100" width="120" height="50" rx="8" />
<text x="70" y="121" text-anchor="middle" fill="currentColor" stroke="none">RL on tasks</text>
<text x="70" y="138" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">reasoning + safety</text>
<line x1="70" y1="150" x2="70" y2="180" />
<polygon points="70,180 66,172 74,172" fill="currentColor" />
<rect x="10" y="180" width="200" height="44" rx="8" />
<text x="110" y="207" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">Assistant model</text>
<text x="225" y="198" fill="currentColor" stroke="none" font-size="11">follows instructions, reasons,</text>
<text x="225" y="214" fill="currentColor" stroke="none" font-size="11">refuses harmful requests</text>
</svg>
<figcaption>Pretraining gives knowledge; every later stage (post-training) shapes behaviour.</figcaption>
</figure>

Everything after pretraining is called **post-training**. Pretraining uses most of the compute. Post-training uses much less compute but decides most of how the model *behaves*.

| Stage | Data | What the model learns | Rough cost |
|---|---|---|---|
| Pretraining | trillions of tokens of raw text and code | language, facts, coding, patterns | weeks to months on thousands of GPUs |
| SFT | thousands to millions of example conversations | to follow instructions in chat format | hours to days |
| Preference tuning (RLHF / DPO) | pairs of answers with "which is better" labels | helpfulness, tone, honesty, harmlessness | days |
| RL on verifiable tasks | math, code, puzzles with checkable answers | step-by-step reasoning, self-checking | can be large for reasoning models |
| Safety training | red-team prompts, policies, principles | when to refuse, how to answer safely | runs inside the stages above |

## Stage 1: Pretraining

The model reads text and predicts the next token, over and over, as explained in [How LLMs Work](/interview/ai-engineer/llms-genai/how-llms-work). The result is a **base model** (also called a **pretrained model** or **foundation model**). It knows a lot, but it only *continues* text.

Ask a base model a question and you may get this:

```text
Prompt:  What is the capital of India?
Base model output:
         What is the capital of Nepal? What is the capital of Bhutan?
         These questions often appear in class 6 general knowledge quizzes...
```

It saw lists of quiz questions on the web, so continuing the list is the most "likely" text. It is not trying to help you. That is the problem post-training solves.

> **Real-life example:** A base model is like a student who has read every book in the library but has never sat in a class where a teacher asks questions. They know a lot, but they don't know that when someone asks a question, they should give a short, direct answer.

## Stage 2: Supervised fine-tuning (SFT)

In **supervised fine-tuning (SFT)**, also called **instruction tuning**, we continue training the base model on example conversations: an instruction from a user and a high-quality answer written by a human expert or by a strong model. The training task is still next-token prediction, but now only on good assistant answers.

A typical training example in the **chat format** (JSON lines, one conversation per line):

```json
{"messages": [
  {"role": "system", "content": "You are a helpful assistant."},
  {"role": "user", "content": "Explain UPI in one sentence."},
  {"role": "assistant", "content": "UPI is India's real-time system for sending money between bank accounts using a phone app and a UPI ID."}
]}
```

Before training, each conversation is turned into one long string with special tokens that mark who is speaking. This is called a **chat template**, and every model family has its own. You should never write it by hand; the tokenizer knows it:

```python
from transformers import AutoTokenizer

tok = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct")
messages = [
    {"role": "user", "content": "Explain UPI in one sentence."},
]
text = tok.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
print(text)
# Output (format differs per model family), roughly:
# <|im_start|>system ... <|im_end|>
# <|im_start|>user
# Explain UPI in one sentence.<|im_end|>
# <|im_start|>assistant
```

Two important details:

- **Loss masking**: during SFT, the loss is usually computed only on the **assistant** tokens. The model should learn to *write* answers, not to predict the user's question.
- **Quality beats quantity**: a few thousand excellent, varied examples often help more than a million noisy ones. Bad SFT data teaches bad habits (for example, always starting with "Certainly!").

> **Common mistake:** Fine-tuning an instruct model with the wrong chat template (or none). The model then sees text in a format it never learned, and quality drops sharply. Always use `apply_chat_template` from the same model's tokenizer.

## Stage 3: Learning from preferences

SFT has a limit. It is hard and expensive for a human to *write* the perfect answer to every question. But it is easy for a human to *compare* two answers and say "B is better than A". **Preference tuning** uses these comparisons.

The data looks like this:

```json
{"prompt": "My UPI payment failed but money was debited. What should I do?",
 "chosen": "Don't worry. In most cases a failed UPI payment is reversed automatically within a few working days. Check the transaction status in your app; if it still shows debited after that, raise a complaint in the app using the transaction ID, or contact your bank.",
 "rejected": "Money lost. Contact bank."}
```

There are two main ways to use this data: **RLHF** and **DPO**.

### RLHF step 1: train a reward model

**RLHF** means **Reinforcement Learning from Human Feedback**. First, you train a separate model called a **reward model**. It reads a prompt and an answer and outputs a single score (the **reward**): higher means "humans would prefer this".

It is trained on the comparison pairs. The standard formula (called the **Bradley–Terry model**) says the probability that answer A is preferred over answer B is:

<div class="formula">

| Formula | Meaning |
|---|---|
| P(A preferred over B) = σ(r_A − r_B) | σ is the sigmoid function, σ(x) = 1 ÷ (1 + e^(−x)) |
| Loss = −ln σ(r_chosen − r_rejected) | small when the chosen answer gets a clearly higher score |

</div>

#### Worked example: reward model loss

The reward model gives the chosen answer r_chosen = 2.0 and the rejected answer r_rejected = 0.5.

1. Difference: 2.0 − 0.5 = 1.5
2. σ(1.5) = 1 ÷ (1 + e^(−1.5)) = 1 ÷ (1 + 0.2231) = **0.818**. So the model thinks there is an 82% chance humans prefer the chosen answer.
3. Loss = −ln(0.818) = **0.201** (small, good).

If the reward model had the scores the wrong way round (chosen 0.5, rejected 2.0), the difference is −1.5, σ(−1.5) = 0.182, and loss = −ln(0.182) = **1.701** (large). Training pushes the scores to fix this.

### RLHF step 2: optimize the LLM against the reward model

Now the LLM (called the **policy** in reinforcement learning words) writes answers to many prompts, the reward model scores them, and an RL algorithm (classically **PPO**, Proximal Policy Optimization) changes the LLM's weights to get higher rewards.

There is one important safety rope. If the LLM is free to chase the reward, it finds tricks that fool the reward model: very long answers, flattery, repeating keywords. This is called **reward hacking**. To stop it, the objective subtracts a penalty when the model drifts too far from the SFT model (the **reference model**):

<div class="formula">

| Formula | Meaning |
|---|---|
| objective = reward − β × KL(policy ‖ reference) | KL divergence measures how different the new model's token probabilities are from the reference model's |
| β (beta) | how strongly to keep the model close to the reference |

</div>

RLHF is powerful but complex: you run four models (policy, reference, reward model, and a value model for PPO), and training can be unstable.

### DPO: preference tuning without a reward model

**DPO (Direct Preference Optimization)**, published in 2023, showed you can skip the separate reward model and the RL loop. It trains the LLM directly on chosen/rejected pairs with a simple loss. The idea: increase the probability of the chosen answer and decrease the probability of the rejected answer, **relative to the reference model**.

<div class="formula">

| Formula | Meaning |
|---|---|
| m = β × [(log π(chosen) − log π_ref(chosen)) − (log π(rejected) − log π_ref(rejected))] | how much more the model now prefers chosen over rejected, compared to the reference |
| DPO loss = −ln σ(m) | small when m is large and positive |

</div>

Here π (pi) is the model being trained, π_ref is the frozen SFT model, and log π(answer) is the total log-probability the model gives to that whole answer.

#### Worked example: DPO loss

Take β = 0.1 and these log-probabilities:

| | Model being trained | Reference model | Change |
|---|---|---|---|
| Chosen answer | −10 | −12 | −10 − (−12) = **+2** (model likes it more now) |
| Rejected answer | −14 | −13 | −14 − (−13) = **−1** (model likes it less now) |

1. Inside the bracket: 2 − (−1) = 3
2. m = 0.1 × 3 = 0.3
3. σ(0.3) = 1 ÷ (1 + e^(−0.3)) = 1 ÷ (1 + 0.7408) = 0.574
4. Loss = −ln(0.574) = **0.554**

As training continues, m grows, σ(m) moves toward 1, and the loss moves toward 0.

### RLHF vs DPO

| | RLHF (reward model + PPO) | DPO |
|---|---|---|
| Separate reward model | yes | no |
| Models in memory | 4 (policy, reference, reward, value) | 2 (policy, reference) |
| Training | RL loop, sampling, can be unstable | like normal supervised training, stable |
| Uses new samples during training | yes (online) | no, fixed dataset (offline) |
| Flexibility | reward model can score anything, reused for many runs | limited to the pairs you have |
| Common use | frontier labs, large scale | open-source fine-tunes, smaller teams |

There are many variants (IPO, KTO, ORPO, SimPO). You don't need details; know that they are all ways to learn from preferences more simply or stably.

Here is DPO with the Hugging Face **TRL** library (check the TRL docs for your installed version; argument names change between releases):

```python
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer
from trl import DPOConfig, DPOTrainer

name = "Qwen/Qwen2.5-0.5B-Instruct"          # a small SFT'd model to start from
model = AutoModelForCausalLM.from_pretrained(name)
tok = AutoTokenizer.from_pretrained(name)

# each row has "prompt", "chosen", "rejected"
ds = load_dataset("trl-lib/ultrafeedback_binarized", split="train[:1000]")

args = DPOConfig(output_dir="dpo-out", beta=0.1,   # beta = how close to stay to the reference
                 per_device_train_batch_size=2, num_train_epochs=1)
trainer = DPOTrainer(model=model, args=args, train_dataset=ds,
                     processing_class=tok)          # reference model is created automatically
trainer.train()
```

In real projects you combine this with LoRA so it fits on one GPU; see [Fine-Tuning with LoRA and QLoRA](/interview/ai-engineer/llms-genai/fine-tuning-lora-and-qlora).

> **Interview tip:** A crisp answer to "RLHF vs DPO?": "Both learn from preference pairs. RLHF first trains a reward model and then uses RL like PPO with a KL penalty to maximize reward. DPO skips the reward model and the RL loop and optimizes a classification-style loss directly on the pairs, which is simpler and more stable, but it is offline and depends on the quality of the pairs."

## AI feedback and Constitutional AI

Human labels are slow and expensive. Labs now use AI models to help label. **RLAIF** (Reinforcement Learning from AI Feedback) uses a strong model to judge which answer is better, guided by written rules.

Anthropic's **Constitutional AI** (2022) is a well-known version. It gives the model a list of principles (a "constitution"), such as "choose the response that is most helpful, honest and harmless". The model:

1. writes an answer,
2. critiques its own answer against a principle,
3. rewrites it,
4. and later an AI judge uses the principles to create preference labels for RL.

The benefit: the rules are written down and can be inspected and changed, and the process scales without thousands of human labellers reading harmful content.

## Reasoning (thinking) models

Since late 2024, a big change has been **reasoning models** (also called **thinking models**): models that write a long internal chain of reasoning before the final answer. Examples include OpenAI's o-series and later GPT models, DeepSeek-R1, and Claude with extended or adaptive thinking.

### How they are trained

The key idea is **reinforcement learning with verifiable rewards (RLVR)**. For some tasks you can check the answer automatically:

- a math problem has a known final number,
- code can be run against unit tests,
- a puzzle has a checkable solution.

So you let the model try a problem many times, give reward 1 for a correct final answer and 0 for wrong, and reinforce the reasoning paths that led to correct answers. No human needs to label every step. Over time the model learns useful habits: breaking problems into steps, checking its work, trying another approach when stuck.

A popular algorithm is **GRPO** (Group Relative Policy Optimization, used for DeepSeek-R1). For each prompt, it samples a **group** of answers and compares each answer to the group average, instead of training a separate value model.

#### Worked example: GRPO advantages

The model answers one math question 4 times. Rewards: [1, 0, 0, 1] (two correct).

1. Mean reward = (1 + 0 + 0 + 1) ÷ 4 = 0.5
2. Standard deviation = √(((0.5)² + (−0.5)² + (−0.5)² + (0.5)²) ÷ 4) = √(1 ÷ 4) = 0.5
3. **Advantage** of each answer = (reward − mean) ÷ std:
   - correct answers: (1 − 0.5) ÷ 0.5 = **+1**
   - wrong answers: (0 − 0.5) ÷ 0.5 = **−1**

Tokens in the correct answers are pushed up; tokens in the wrong answers are pushed down. If all 4 were correct (or all wrong), every advantage is 0 and that question teaches nothing, which is why training uses questions of the right difficulty.

### Test-time compute

Reasoning models show that you can buy better answers with more **thinking tokens** at inference time. This is called **test-time compute** (or inference-time scaling). For engineering this means:

| Effect | Why it matters |
|---|---|
| Higher accuracy on math, code, planning, agents | use them for hard tasks |
| More output tokens | thinking tokens are usually **billed as output tokens** |
| Higher latency | the user waits while the model thinks; stream progress |
| Controllable | APIs expose a setting such as `effort` or a reasoning level |

Simple tasks (classification, short extraction, casual chat) usually don't need much thinking; use a low effort setting or a smaller model. Many providers also **distill** reasoning into smaller models: a big reasoning model generates solutions, and a small model is fine-tuned on them.

> **Common mistake:** Adding "think step by step" to every prompt for a modern reasoning model and also asking it to print the full reasoning. The model already reasons internally; asking for long visible reasoning mostly adds cost. Use the provider's thinking/effort controls instead, and ask for a short explanation only if the user needs one.

## Safety training

Safety is not one stage; it is mixed into SFT, preference tuning and RL. Common parts:

- **Red teaming**: people (and models) try hard to make the model do harmful things: weapons instructions, malware, self-harm advice, hate. Failures become training data.
- **Refusal training**: the model learns to decline clearly harmful requests and explain briefly, while still helping with safe ones.
- **Avoiding over-refusal**: a model that refuses "how do I kill a Python process?" is useless. Training balances helpfulness and harmlessness.
- **Honesty**: rewarding "I am not sure" when the model does not know, and not making up sources.
- **Classifiers around the model**: separate safety classifiers can check inputs and outputs at serving time. Some APIs return a special stop reason when such a classifier declines a request, so your code should handle it.
- **Model cards / system cards**: documents from the lab describing evaluations and known risks. Read them before choosing a model for a sensitive product.

Even after all this, models can be tricked by **jailbreaks** and **prompt injection**, so your application needs its own guardrails; see [Safety, Guardrails and Prompt Injection](/interview/ai-engineer/llms-genai/safety-guardrails-and-prompt-injection).

## Where you fit in as an AI engineer

| You will usually... | You will rarely... |
|---|---|
| choose between base, instruct and reasoning models | pretrain a model from scratch |
| fine-tune an open instruct model with SFT + LoRA | train a reward model at scale |
| run DPO on a few thousand preference pairs | run full PPO RLHF |
| tune prompts and effort settings for reasoning models | design a new RL algorithm |
| read model cards and choose safe models | write a constitution for a frontier model |

## Key terms

| Term | Simple meaning |
|---|---|
| Base / pretrained / foundation model | The model after pretraining; it continues text but doesn't follow instructions well |
| Post-training | All training after pretraining (SFT, preference tuning, RL) |
| SFT / instruction tuning | Training on example conversations with good answers |
| Chat template | Special-token format that marks system, user and assistant turns |
| Loss masking | Computing loss only on assistant tokens |
| Preference data | Pairs of answers with a label saying which is better |
| RLHF | Reinforcement learning from human feedback: reward model + RL |
| Reward model | A model that scores how good an answer is |
| Bradley–Terry model | P(A beats B) = σ(r_A − r_B) |
| Policy | In RL, the model whose behaviour we are training (the LLM) |
| PPO | A classic RL algorithm used in RLHF |
| Reference model | A frozen copy of the SFT model used to limit drift |
| KL divergence | A measure of how different two probability distributions are |
| Reward hacking | The model finds tricks to get high reward without being better |
| DPO | Direct Preference Optimization: learn from pairs without a reward model |
| RLAIF | RL from AI feedback, where a model provides preference labels |
| Constitutional AI | Training with written principles the model uses to critique and revise |
| Reasoning / thinking model | A model trained to reason in many steps before answering |
| RLVR | RL with rewards from automatic checks (tests, correct answers) |
| GRPO | RL method that compares each sample to its group's average reward |
| Advantage | How much better an answer is than the average |
| Test-time compute | Spending more tokens thinking at answer time for better results |
| Distillation | Training a small model on a large model's outputs |
| Red teaming | Deliberately trying to make the model misbehave to find weaknesses |
| Over-refusal | Refusing safe requests because they look similar to harmful ones |

## Interview questions

**What are the main stages of training a modern chat LLM?**
Pretraining on trillions of tokens with next-token prediction gives a base model with broad knowledge. Supervised fine-tuning on example conversations teaches it to follow instructions in chat format. Preference tuning with RLHF or DPO makes answers more helpful, honest and harmless. Many current models also get RL on verifiable tasks to improve reasoning, with safety training mixed into all post-training stages.

**What is the difference between a base model and an instruct model?**
A base model only continues text in the most likely way, so it may not answer your question directly. An instruct (chat) model has been post-trained to respond to instructions as an assistant, using a chat template. For products you almost always use instruct models; base models are mainly for further fine-tuning or research.

**Explain RLHF.**
Humans compare pairs of model answers. A reward model is trained on these pairs so that it gives higher scores to preferred answers, using the loss −log σ(r_chosen − r_rejected). Then the LLM is optimized with an RL algorithm like PPO to maximize the reward, minus a KL penalty that keeps it close to the SFT model so it does not exploit the reward model.

**Why is a KL penalty needed in RLHF?**
Without it, the model can drift into strange outputs that score highly on the imperfect reward model, for example very long or flattering answers. This is reward hacking. The KL penalty measures how far the new model's token probabilities are from the reference model and subtracts it from the reward, keeping the model fluent and close to its sensible starting point.

**How does DPO differ from RLHF, and when would you use it?**
DPO trains directly on chosen/rejected pairs with a simple loss that raises the chosen answer's probability relative to a reference model and lowers the rejected one's. It needs no reward model and no RL sampling loop, so it is cheaper, simpler and more stable. I would use DPO for fine-tuning an open model on a few thousand preference pairs; RLHF makes more sense at large scale when you want a reusable reward model and online sampling.

**What is a reasoning model and how is it trained?**
It is a model that writes a long chain of internal reasoning before giving its final answer. It is trained with reinforcement learning on tasks whose answers can be checked automatically, like math with known answers or code with unit tests. Reasoning paths that lead to correct answers are reinforced, so the model learns to plan, check its work, and backtrack.

**What is test-time compute and what does it mean for cost?**
It means improving results by letting the model use more computation at inference time, mainly by generating more thinking tokens. Accuracy on hard tasks goes up, but so do latency and output-token cost, because thinking tokens are usually billed as output. So you route hard tasks to high effort and keep simple tasks at low effort or on a small model.

**What is Constitutional AI?**
It is Anthropic's method where the model is guided by a written list of principles. The model critiques and revises its own answers using those principles, and an AI judge uses them to produce preference labels for reinforcement learning. This reduces the need for human labels on harmful content and makes the rules explicit.

**What is reward hacking? Give an example.**
Reward hacking is when the model finds a way to get a high reward without actually doing the task better. For example, if the reward model slightly prefers longer answers, the policy may learn to pad answers. In code RL, a model might learn to special-case tests instead of solving the problem. Fixes include KL penalties, better reward models, and checking samples by hand.

**Why does SFT usually mask the loss on user tokens?**
We want the model to learn to produce good assistant replies, not to predict what users will type. Training on user text wastes capacity and can make the model imitate user style. So the loss is computed only on the assistant part of each conversation.

## Try it yourself

1. **Reward model loss.** Compute the loss when r_chosen = 1.0 and r_rejected = 0.8. Is the model confident? Hint: σ(0.2).
2. **DPO by hand.** β = 0.2. Chosen: model −20, reference −21. Rejected: model −18, reference −18. Compute m and the loss.
3. **GRPO advantages.** Rewards for 5 samples: [1, 1, 1, 1, 0]. Compute mean, std and each advantage. Which sample gets the strongest push?
4. **Chat template.** Use `apply_chat_template` with a system, user and assistant message on any small instruct model and print the result. Find the special tokens that mark each role.

### Answers

1. σ(0.2) = 1 ÷ (1 + e^(−0.2)) = 1 ÷ 1.8187 = 0.550. Loss = −ln 0.550 = 0.598. Not confident: 55% is close to a coin toss.
2. Chosen change = +1, rejected change = 0. m = 0.2 × (1 − 0) = 0.2. σ(0.2) = 0.550, loss = 0.598.
3. Mean = 0.8. Std = √((4 × 0.2² + 0.8²) ÷ 5) = √((0.16 + 0.64) ÷ 5) = √0.16 = 0.4. Advantages: correct ones (1 − 0.8) ÷ 0.4 = +0.5 each; the wrong one (0 − 0.8) ÷ 0.4 = −2. The single wrong answer gets the strongest (negative) push, because it is the surprising one.
4. For Qwen-style models you will see `<|im_start|>system`, `<|im_start|>user`, `<|im_start|>assistant` and `<|im_end|>`. Llama-style models use different tokens, which is why you must always use the model's own template.

**Next:** [Generation Settings and the Context Window](/interview/ai-engineer/llms-genai/generation-settings-and-the-context-window)
