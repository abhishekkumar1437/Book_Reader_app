---
title: Fine-tuning a Transformer
part: Models & Tools
summary: Fine-tune a pretrained encoder into a text classifier with the Hugging Face Trainer — tokenizing a dataset, dynamic padding, metrics, hyperparameters, early stopping, spotting overfitting, class imbalance, and token-classification label alignment.
---

A pretrained model like DistilBERT knows English, but it does not know your labels — "refund request" vs "delivery issue", "positive" vs "negative". **Fine-tuning** means continuing to train the pretrained model on a small labeled dataset so it learns your task. It is one of the most common practical jobs for an AI engineer: a fine-tuned small encoder can classify millions of messages a day at a tiny fraction of an LLM's cost. This chapter walks through a complete, modern fine-tuning script and how to tell whether it worked.

> **In simple words:** Take a model that already understands language, put a small new layer on top for your labels, and train the whole thing for a few passes over your labeled examples with a small learning rate. Check a validation set every epoch and keep the best checkpoint.

## When to fine-tune

Fine-tuning is not always the right answer. Compare the options:

| Option | Labeled data needed | Cost per request | Accuracy on a narrow task | Setup effort |
|---|---|---|---|---|
| TF-IDF + logistic regression ([Text as Data](/interview/nlp-transformers/text-as-data)) | Hundreds to thousands | Tiny | Good baseline | Very low |
| Zero-shot / prompting an LLM | None or a few examples | High | Good, varies | Low |
| **Fine-tuned small encoder** (DistilBERT, DeBERTa, ModernBERT) | ~1,000+ (more is better) | Very low | Often best | Medium |
| Fine-tuned LLM with LoRA | Hundreds to thousands | Medium–high | Very good, also for generation | High |

Rules of thumb:

- No labeled data yet → start with an LLM prompt; use its outputs (checked by humans) to create labels.
- Thousands of labels, high volume, fixed labels → **fine-tune an encoder**.
- You need generated text in a specific style or format → fine-tune a decoder LLM with LoRA (see [Fine-tuning, LoRA and QLoRA](/interview/llms-genai/fine-tuning-lora-and-qlora)).

### What actually changes during fine-tuning

`AutoModelForSequenceClassification` takes the pretrained body and adds a new **classification head**: a linear layer from the hidden size (768) to the number of labels. The head starts random. During fine-tuning:

- **Full fine-tuning** (most common for encoders): all weights — body and head — are updated, using a **small learning rate** (around 2e-5) so the pretrained knowledge is adjusted, not destroyed.
- **Feature extraction / freezing:** keep the body fixed and train only the head. Faster and needs less data, but usually less accurate. See [Transfer Learning and Pretrained Models](/interview/deep-learning/transfer-learning-and-pretrained-models).
- **Parameter-efficient fine-tuning (PEFT)** like LoRA: train a few small extra matrices and freeze the rest. Standard for large LLMs.

## The full fine-tuning script

We fine-tune `distilbert-base-uncased` (66 M parameters) on the IMDB movie-review dataset (positive/negative). A subset keeps it fast: on a single free cloud GPU, this runs in a few minutes; on a CPU it is slow but works.

### Step 1 — load the data

```python
from datasets import load_dataset

raw = load_dataset("imdb")
train_full = raw["train"].shuffle(seed=42).select(range(4000))
splits = train_full.train_test_split(test_size=0.2, seed=42)    # 3,200 train / 800 validation
train_ds, val_ds = splits["train"], splits["test"]
test_ds = raw["test"].shuffle(seed=42).select(range(2000))      # untouched until the end

print(train_ds[0]["text"][:100], train_ds[0]["label"])
```

We create three sets: **train** (learn the weights), **validation** (choose epochs and hyperparameters), and **test** (one final, honest score). Never tune on the test set.

### Step 2 — tokenize the whole dataset

```python
from transformers import AutoTokenizer

checkpoint = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)

def tokenize(batch):
    # truncation only; padding is done later per batch (dynamic padding)
    return tokenizer(batch["text"], truncation=True, max_length=256)

train_tok = train_ds.map(tokenize, batched=True, remove_columns=["text"])
val_tok   = val_ds.map(tokenize, batched=True, remove_columns=["text"])
test_tok  = test_ds.map(tokenize, batched=True, remove_columns=["text"])
print(train_tok)    # columns: label, input_ids, attention_mask
```

- `batched=True` sends 1,000 rows at a time to the fast tokenizer — much quicker than one by one.
- `max_length=256` caps long reviews. Attention cost grows with the square of length (see [Attention Step by Step](/interview/nlp-transformers/attention-step-by-step)), so this is a speed/accuracy trade-off. Check how long your texts usually are before choosing.
- The column must be called `label` (or `labels`); the Trainer passes it to the model, which then computes the loss itself.

### Step 3 — dynamic padding

```python
from transformers import DataCollatorWithPadding

collator = DataCollatorWithPadding(tokenizer=tokenizer)
```

**Dynamic padding** pads each batch only to the longest text **in that batch**, not to 256 for every example. Short batches stay short, which saves a lot of compute. The **data collator** is the function that builds each batch.

### Step 4 — the model

```python
from transformers import AutoModelForSequenceClassification

id2label = {0: "negative", 1: "positive"}
label2id = {v: k for k, v in id2label.items()}

model = AutoModelForSequenceClassification.from_pretrained(
    checkpoint, num_labels=2, id2label=id2label, label2id=label2id
)
# Warning "Some weights ... newly initialized: classifier..." is expected — that is the new head.
```

Saving `id2label` in the config means the saved model and the pipeline will print "positive" instead of "LABEL_1".

### Step 5 — metrics

```python
import numpy as np
from sklearn.metrics import accuracy_score, f1_score

def compute_metrics(eval_pred):
    logits, labels = eval_pred                  # numpy arrays from the Trainer
    preds = np.argmax(logits, axis=-1)          # highest logit = predicted class
    return {
        "accuracy": accuracy_score(labels, preds),
        "f1": f1_score(labels, preds, average="macro"),
    }
```

### Step 6 — training arguments and Trainer

```python
import torch
from transformers import TrainingArguments, Trainer, EarlyStoppingCallback

args = TrainingArguments(
    output_dir="distilbert-imdb",
    learning_rate=2e-5,                 # small: adjust, do not destroy, pretrained weights
    per_device_train_batch_size=16,
    per_device_eval_batch_size=32,
    num_train_epochs=4,
    weight_decay=0.01,                  # mild L2-style regularization
    eval_strategy="epoch",              # evaluate on validation after every epoch
    save_strategy="epoch",              # must match eval_strategy for best-model loading
    load_best_model_at_end=True,        # keep the checkpoint with the best metric
    metric_for_best_model="f1",
    save_total_limit=2,                 # keep disk use small
    logging_steps=50,
    fp16=torch.cuda.is_available(),     # mixed precision on GPU
    report_to="none",                   # or "wandb", "mlflow", "tensorboard"
    seed=42,
)

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=train_tok,
    eval_dataset=val_tok,
    processing_class=tokenizer,         # older versions used tokenizer=tokenizer
    data_collator=collator,
    compute_metrics=compute_metrics,
    callbacks=[EarlyStoppingCallback(early_stopping_patience=1)],
)

trainer.train()
```

What the Trainer does for you: builds data loaders, runs the training loop (forward pass, loss, backward pass, optimizer step), uses the AdamW optimizer with a linear learning-rate decay by default, evaluates every epoch, saves checkpoints, handles GPU/mixed precision, and stops early if validation F1 does not improve for 1 epoch. Writing this yourself is the loop from [Building and Training a Model in PyTorch](/interview/deep-learning/building-and-training-a-model-in-pytorch).

### Step 7 — final test, save and use

```python
print(trainer.evaluate(test_tok))     # one final score on unseen test data
# {'eval_loss': ..., 'eval_accuracy': ..., 'eval_f1': ..., ...}

trainer.save_model("distilbert-imdb/best")    # saves model + tokenizer + config

from transformers import pipeline
clf = pipeline("text-classification", model="distilbert-imdb/best")
print(clf("A beautiful film with brilliant acting."))
# [{'label': 'positive', 'score': 0.9...}]
```

With this setup, DistilBERT typically reaches around 88–92% accuracy on IMDB; using the full 25,000 training reviews improves it further. Your exact number will vary with the subset, seed and hardware.

> **Interview tip:** When describing a fine-tuning project, mention the full process, not just "I used Trainer": the data split, the max length you chose and why, the learning rate and epochs, the metric you optimized (and why — e.g. macro-F1 for imbalanced classes), early stopping, the final test score compared with a baseline, and error analysis.

## Hyperparameters that matter

| Hyperparameter | Typical range for BERT-style fine-tuning | Effect |
|---|---|---|
| Learning rate | 1e-5 to 5e-5 (2e-5 is a safe start) | Too high → loss jumps or becomes NaN, model forgets; too low → slow |
| Epochs | 2–4 | More → risk of overfitting on small data |
| Batch size | 16–32 | Larger → smoother gradients, more memory |
| Max length | 128–512 | Longer → more context, much slower |
| Weight decay | 0.0–0.1 (0.01 common) | Regularization |
| Warmup | First 5–10% of steps (`warmup_steps`) | Avoids big early updates that damage pretrained weights |
| Seed | Try 2–3 seeds | Small datasets give noticeably different results per seed |

Pretrained weights are already good, so fine-tuning uses learning rates about **10–100 times smaller** than training from scratch. A large learning rate can wipe out what the model learned in pretraining; this is called **catastrophic forgetting**.

> **Common mistake:** Using `learning_rate=1e-3` (a common value for training small networks from scratch). For BERT-style fine-tuning it usually destroys the pretrained knowledge, and accuracy drops to around 50% — random guessing on a balanced binary task.

## Reading the metrics

Suppose your model's predictions on 100 validation reviews give this **confusion matrix** (see [Evaluation Metrics](/interview/machine-learning/evaluation-metrics)):

| | Predicted positive | Predicted negative |
|---|---|---|
| **Actually positive** (50) | TP = 40 | FN = 10 |
| **Actually negative** (50) | FP = 5 | TN = 45 |

- Accuracy = (40 + 45) ÷ 100 = **0.85**
- Precision (positive) = TP ÷ (TP + FP) = 40 ÷ 45 = **0.889**
- Recall (positive) = TP ÷ (TP + FN) = 40 ÷ 50 = **0.800**
- F1 (positive) = 2 × 0.889 × 0.800 ÷ (0.889 + 0.800) = 1.422 ÷ 1.689 = **0.842**

The model misses 10 positive reviews (false negatives) — more than the 5 false alarms. If missing positives is costly for the business, you could lower the decision threshold on the positive probability.

For imbalanced data (for example 95% "not fraud"), accuracy can look great while the model ignores the rare class. Use **macro-F1** (average F1 over classes) or per-class recall instead.

## Overfitting: how to spot it

**Overfitting** means the model memorizes the training data and stops improving on new data. With a 66 M-parameter model and 3,200 examples, it can happen within a few epochs.

Example training log (illustrative numbers):

| Epoch | Training loss | Validation loss | Validation F1 |
|---|---|---|---|
| 1 | 0.42 | 0.31 | 0.87 |
| 2 | 0.21 | 0.28 | 0.89 |
| 3 | 0.09 | 0.33 | 0.89 |
| 4 | 0.03 | 0.41 | 0.88 |

Signs of overfitting:

1. **Training loss keeps falling, validation loss starts rising** (after epoch 2 here).
2. Validation F1 stops improving or drops.
3. The model is very confident (probabilities near 1.0) even on wrong answers.
4. A big gap between training accuracy (~99%) and validation accuracy.

The best checkpoint here is epoch 2. With `load_best_model_at_end=True` and early stopping, the Trainer keeps epoch 2 for you.

Fixes:

| Fix | How |
|---|---|
| Stop earlier | Early stopping on validation metric; fewer epochs |
| More data | Label more examples; data augmentation (back-translation, paraphrasing with an LLM) |
| Regularize | Higher weight decay; dropout is already inside the model |
| Smaller model or freeze lower layers | Fewer trainable parameters |
| Lower learning rate | Gentler updates |

The opposite problem, **underfitting** (both losses high, accuracy near a simple baseline), usually means the learning rate is wrong, the labels are wrong or shuffled, the max length cuts off the important part, or training is too short.

> **Remember:** A quick sanity check before a long run: train on 50 examples for many steps. A healthy setup should reach almost 100% training accuracy (it memorizes them). If it cannot, there is a bug — wrong labels, wrong columns, or a learning rate problem.

## Handling class imbalance

If 90% of tickets are "general" and 10% are "fraud", the model can score 90% accuracy by always saying "general". Options:

1. **Use the right metric** (macro-F1, per-class recall) for model selection.
2. **Class weights in the loss** — make mistakes on the rare class cost more.
3. **Resample** — oversample rare-class examples in training.
4. **Tune the threshold** on validation data instead of using 0.5.

Class-weighted loss with a custom Trainer:

```python
import torch
from torch import nn
from transformers import Trainer

class WeightedTrainer(Trainer):
    def __init__(self, *args, class_weights=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.class_weights = class_weights

    def compute_loss(self, model, inputs, return_outputs=False, **kwargs):
        labels = inputs.pop("labels")
        outputs = model(**inputs)
        weight = self.class_weights.to(outputs.logits.device)
        loss = nn.functional.cross_entropy(outputs.logits, labels, weight=weight)
        return (loss, outputs) if return_outputs else loss

# 90% class 0, 10% class 1 → weight class 1 about 9x more
trainer = WeightedTrainer(model=model, args=args, train_dataset=train_tok,
                          eval_dataset=val_tok, processing_class=tokenizer,
                          data_collator=collator, compute_metrics=compute_metrics,
                          class_weights=torch.tensor([1.0, 9.0]))
```

(The Trainer renames the `label` column to `labels` when it builds batches, which is why `inputs.pop("labels")` works.)

## Fine-tuning for token classification (NER)

For NER, each **word** has a label, but the tokenizer splits words into **subword tokens**. "Bengaluru" might become `["ben", "##gal", "##uru"]`. Labels must be **aligned** to tokens:

- Give the label to the **first** subword of each word.
- Give the other subwords and the special tokens the label **−100**. PyTorch's cross-entropy **ignores** −100, so they do not count in the loss.

```python
def tokenize_and_align(batch):
    enc = tokenizer(batch["tokens"], truncation=True, is_split_into_words=True)
    all_labels = []
    for i, word_labels in enumerate(batch["ner_tags"]):
        word_ids = enc.word_ids(batch_index=i)    # which word each token came from
        prev, labels = None, []
        for w in word_ids:
            if w is None:            # [CLS], [SEP], padding
                labels.append(-100)
            elif w != prev:          # first token of a new word
                labels.append(word_labels[w])
            else:                    # later sub-tokens of the same word
                labels.append(-100)
            prev = w
        all_labels.append(labels)
    enc["labels"] = all_labels
    return enc
```

Then use `AutoModelForTokenClassification` and `DataCollatorForTokenClassification`, and the same Trainer setup. The standard metric is entity-level F1 (the `seqeval` package).

## Practical notes

**Memory.** Full fine-tuning with AdamW needs about 16 bytes per parameter for weights, gradients and optimizer state (with mixed precision), plus activations. DistilBERT: 66 M × 16 bytes ≈ 1 GB + activations — fits on a small GPU. A 7 B LLM would need ~112 GB, which is why LLMs are fine-tuned with LoRA/QLoRA instead.

**Ways to reduce memory:** smaller batch with `gradient_accumulation_steps` (e.g. batch 8 × 4 steps = effective batch 32), shorter `max_length`, `fp16`/`bf16`, `gradient_checkpointing=True` (recomputes activations instead of storing them; slower but much less memory).

**Error analysis.** After training, look at 30–50 wrong predictions. You often find label mistakes, ambiguous examples, sarcasm, or text truncated before the important part. Fixing data usually helps more than tuning hyperparameters.

**Sharing.** `trainer.push_to_hub()` (after logging in) uploads the model, tokenizer and an auto-generated model card. Add your own description of data, metrics and limitations.

| Problem | Symptom | First thing to try |
|---|---|---|
| Learning rate too high | Loss jumps up or becomes NaN | Lower to 2e-5, add warmup |
| Wrong label column | Error about missing `labels`, or loss is None | Name the column `label` or `labels` |
| Overfitting | Val loss rises after epoch 1–2 | Early stopping, fewer epochs, more data |
| Imbalanced classes | High accuracy, low recall on rare class | Macro-F1, class weights, threshold |
| Out of GPU memory | CUDA OOM | Smaller batch + gradient accumulation, shorter max_length, fp16 |
| Truncation loses key info | Errors on long texts | Increase max_length, or keep head + tail of the text |

## Key terms

| Term | Simple meaning |
|---|---|
| Fine-tuning | Continuing training of a pretrained model on labeled data for one task |
| Classification head | New linear layer mapping hidden vectors to label scores |
| Full fine-tuning | Updating all model weights |
| Freezing | Keeping some weights fixed during training |
| PEFT / LoRA | Training a few small extra weights instead of all of them |
| Train / validation / test split | Learn / tune / final honest check |
| Dynamic padding | Padding each batch only to its own longest sequence |
| Data collator | Function that builds batches (padding, label handling) |
| `compute_metrics` | Function the Trainer calls to compute validation metrics |
| TrainingArguments | Settings for the Trainer: learning rate, epochs, batch size, saving |
| Trainer | Hugging Face class that runs the training loop |
| Early stopping | Stop when the validation metric stops improving |
| Warmup | Slowly increasing the learning rate at the start |
| Catastrophic forgetting | Losing pretrained knowledge, often from too high a learning rate |
| Overfitting / underfitting | Memorizing training data / not learning enough |
| Confusion matrix | Table of true vs predicted classes |
| Macro-F1 | F1 averaged equally over classes |
| Class weights | Making errors on rare classes cost more in the loss |
| Label alignment (−100) | Giving sub-tokens a label that the loss ignores |
| Gradient accumulation | Summing gradients over steps to simulate a bigger batch |
| Gradient checkpointing | Recomputing activations to save memory |

## Interview questions

**Walk me through fine-tuning BERT for text classification.**
Load a labeled dataset and split it into train, validation and test. Tokenize with the model's tokenizer, using truncation and dynamic padding. Load `AutoModelForSequenceClassification` with the right number of labels, which adds a random classification head. Train with a small learning rate (about 2e-5) for 2–4 epochs, evaluate every epoch with a suitable metric, keep the best checkpoint, then report the test score and do error analysis.

**Why is the learning rate for fine-tuning so small?**
The pretrained weights already encode useful language knowledge. Large updates would overwrite it (catastrophic forgetting) and make training unstable. A small learning rate, often with warmup, adjusts the weights gently toward the new task.

**How do you detect overfitting during fine-tuning?**
Training loss keeps going down while validation loss goes up, and the validation metric stops improving or drops. There is a growing gap between training and validation accuracy. I use per-epoch evaluation, early stopping and load the best checkpoint.

**What is dynamic padding and why use it?**
Each batch is padded only to the length of its longest example rather than to a fixed maximum. Most batches become much shorter, which saves compute and memory and speeds up training, with no change in results because padding is masked anyway.

**How do you handle class imbalance?**
Choose a metric that reflects the rare class, like macro-F1 or recall, for model selection. Use class weights in the loss or oversample the rare class. Tune the decision threshold on validation data. Collect more rare-class examples if possible.

**Full fine-tuning vs freezing layers vs LoRA — when would you choose each?**
Full fine-tuning gives the best accuracy for small encoders when you have enough data and GPU memory. Freezing the body and training only the head is cheap and works with very little data, but is less accurate. LoRA trains small adapter matrices and is the standard for large LLMs, where full fine-tuning would need too much memory.

**Why do we label sub-tokens with −100 in NER?**
A word split into several sub-tokens has only one label. We assign it to the first sub-token and set the rest, plus special tokens, to −100, which PyTorch's cross-entropy ignores. This keeps each word counted once in the loss and metric.

**Your fine-tuned model has 95% accuracy but users complain. What do you check?**
Whether the data is imbalanced and the rare important class has low recall. Whether production text differs from training text (data drift, new slang, longer messages being truncated). Whether there was leakage, such as duplicates between train and test. Then I would do error analysis on real failing examples.

**How do you fine-tune when GPU memory is limited?**
Use a smaller batch with gradient accumulation, mixed precision, shorter max length, gradient checkpointing, or a smaller model. For large models use LoRA or QLoRA, which train far fewer parameters and can load the base model in 4-bit.

**What does `load_best_model_at_end` need to work?**
Evaluation and saving must happen on the same schedule (for example both per epoch), and you set `metric_for_best_model`. At the end the Trainer reloads the checkpoint with the best validation metric instead of keeping the last one.

## Try it yourself

1. A validation confusion matrix has TP = 30, FN = 20, FP = 10, TN = 140. Compute accuracy, precision, recall and F1 for the positive class. Is accuracy a good metric here?
2. Run the full script with `num_train_epochs=1` and then `3`. Compare validation F1 and the gap between training and validation loss.
3. Change `max_length` from 256 to 64. How do speed and accuracy change? Why?
4. You have 8 GB of GPU memory and want an effective batch of 64, but only batch 16 fits. Which arguments do you set?

### Answers

1. Accuracy = (30 + 140) ÷ 200 = 0.85. Precision = 30 ÷ 40 = 0.75. Recall = 30 ÷ 50 = 0.60. F1 = 2 × 0.75 × 0.60 ÷ (0.75 + 0.60) = 0.9 ÷ 1.35 = 0.667. Accuracy hides the problem: only 50 of 200 are positive, and the model misses 40% of them.
2. Usually 1 epoch is slightly underfit, 2–3 are best, and with more epochs training loss keeps falling while validation loss rises. Exact numbers vary by run.
3. Training becomes several times faster because sequences are shorter and attention cost grows with length squared. Accuracy usually drops a few points, because IMDB reviews are long and the sentiment often appears later in the review.
4. `per_device_train_batch_size=16` and `gradient_accumulation_steps=4` (16 × 4 = 64). Optionally add `fp16=True` and `gradient_checkpointing=True` to free more memory.

**Next:** [NLP & Transformers Interview Question Bank](/interview/nlp-transformers/nlp-transformers-interview-question-bank)
