---
title: Text as Data
part: Text Basics
summary: What NLP tasks look like, how to clean text, and how to turn sentences into numbers with bag of words, TF-IDF (computed by hand) and n-grams.
---

A machine learning model only understands numbers. Text is letters, words and sentences. This chapter shows the oldest and simplest ways to turn text into numbers: counting words (bag of words) and weighting them (TF-IDF). These methods are still used every day in real jobs — for quick baselines, for keyword search (BM25 in RAG systems is a cousin of TF-IDF), and for cheap classifiers that run without a GPU.

> **In simple words:** Make a list of all words. For each document, write how often each word appears. Give rare, meaningful words more weight than common words like "the". Now every document is a row of numbers that any ML model can use.

## What is NLP?

**Natural Language Processing (NLP)** is the part of AI that works with human language — text and speech. "Natural" language means languages people speak, like English, Hindi or Tamil, as opposed to programming languages.

### Common NLP tasks

| Task | Input → Output | Real example |
|---|---|---|
| **Text classification** | text → one label | Is this Flipkart review positive or negative? Is this email spam? |
| **Named Entity Recognition (NER)** | text → a label for each word | In "Virat Kohli plays for RCB in Bengaluru", find PERSON, TEAM, CITY |
| **Question answering** | question + passage → answer | "When is my train?" answered from a ticket PDF |
| **Summarization** | long text → short text | Summarize a 20-page policy into 5 lines |
| **Translation** | text in one language → text in another | English → Hindi |
| **Text generation** | prompt → new text | Chatbots, code assistants |
| **Semantic search** | query → most similar documents | Search a help centre by meaning, not exact words |

Before 2018, each task usually had its own small model and hand-made features. Today, one large pretrained Transformer can do most of them. But the first step is always the same: **represent text as numbers**.

> **Interview tip:** If asked "how would you build a spam classifier?", do not jump straight to a large language model. Say: "I would first build a TF-IDF + logistic regression baseline. It is fast, cheap and often 90%+ as good. Then I would try a fine-tuned Transformer if the baseline is not enough." Interviewers like engineers who start simple.

## Cleaning text (preprocessing)

Raw text is messy: capital letters, punctuation, HTML tags, emojis, extra spaces. **Preprocessing** means cleaning the text before turning it into numbers.

Common steps:

1. **Lowercasing** — "Good" and "good" become the same word.
2. **Removing punctuation and HTML** — `<br>`, `!!!`, `...`.
3. **Tokenization** — splitting text into pieces called **tokens** (usually words). The next chapter covers this in depth.
4. **Stop-word removal** — dropping very common words like "the", "is", "a". These are called **stop words**.
5. **Stemming** — cutting words to a rough root by rules: "playing", "played", "plays" → "play". It is fast but crude ("studies" → "studi").
6. **Lemmatization** — finding the real dictionary form using grammar knowledge: "better" → "good", "studies" → "study". Slower but cleaner.

```python
import re

STOP_WORDS = {"the", "is", "a", "an", "was", "and", "of", "to"}

def clean(text: str) -> list[str]:
    text = text.lower()                         # 1. lowercase
    text = re.sub(r"<[^>]+>", " ", text)        # 2. remove HTML tags
    text = re.sub(r"[^a-z0-9\s]", " ", text)    # 2. remove punctuation
    tokens = text.split()                       # 3. simple word tokenization
    return [t for t in tokens if t not in STOP_WORDS]  # 4. drop stop words

print(clean("The delivery was FAST!!! <br> Great product."))
# Output: ['delivery', 'fast', 'great', 'product']
```

> **Common mistake:** Removing stop words for every task. For sentiment, "not" is often in stop-word lists, but "not good" and "good" mean opposite things. For Transformers, you usually do **no** cleaning at all — the model's own tokenizer handles raw text, and the model learns from the full sentence.

| Step | Use with classic models (TF-IDF) | Use with Transformers (BERT, GPT) |
|---|---|---|
| Lowercase | Often yes | No (the tokenizer decides; "cased" models keep case) |
| Remove punctuation | Often yes | No |
| Remove stop words | Sometimes | No |
| Stemming / lemmatization | Sometimes | No |
| Remove HTML / junk | Yes | Yes |

## Bag of words

The simplest idea: ignore word order, and just count words. This is called **bag of words (BoW)** — imagine cutting the sentence into words and throwing them into a bag. You know what is in the bag, but not the order.

Steps:

1. Build a **vocabulary**: the list of all unique words in all documents.
2. For each document, make a vector with one slot per vocabulary word. Each slot holds the count of that word.

### Worked example

Three tiny movie and food reviews. We will use them for the whole chapter.

| Doc | Text |
|---|---|
| D1 | the movie was good |
| D2 | the movie was bad |
| D3 | the food was good |

Vocabulary (sorted): `bad, food, good, movie, the, was` → 6 words.

| | bad | food | good | movie | the | was |
|---|---|---|---|---|---|---|
| D1 | 0 | 0 | 1 | 1 | 1 | 1 |
| D2 | 1 | 0 | 0 | 1 | 1 | 1 |
| D3 | 0 | 1 | 1 | 0 | 1 | 1 |

Each document is now a vector of 6 numbers. D1 = [0, 0, 1, 1, 1, 1].

Most slots are zero in real life (a vocabulary has 50,000 words; a review uses 30). A vector that is mostly zeros is called **sparse**. Libraries store only the non-zero values to save memory.

```python
from sklearn.feature_extraction.text import CountVectorizer

docs = ["the movie was good", "the movie was bad", "the food was good"]
vec = CountVectorizer()
X = vec.fit_transform(docs)          # sparse matrix, shape (3, 6)

print(vec.get_feature_names_out())
# Output: ['bad' 'food' 'good' 'movie' 'the' 'was']
print(X.toarray())
# Output:
# [[0 0 1 1 1 1]
#  [1 0 0 1 1 1]
#  [0 1 1 0 1 1]]
```

**Problems with bag of words:**

- "the" and "was" get the same weight as "good" and "bad", even though they tell us nothing.
- Word order is lost: "dog bites man" and "man bites dog" get the same vector.
- No meaning: "good" and "great" are as different as "good" and "banana".

TF-IDF fixes the first problem. N-grams partly fix the second. Embeddings (chapter 3) fix the third.

## TF-IDF

Some words appear in almost every document ("the", "was"). They do not help tell documents apart. Other words appear in only a few documents ("bad", "food"). These are the useful ones. **TF-IDF** gives each word a score that is high when the word is frequent **in this document** but rare **across all documents**.

> **Real-life example:** In a class of 40 students, if every student scored 100 in drawing, a 100 in drawing tells you nothing special about Ravi. If only Ravi scored 100 in maths, that tells you a lot. Rare things carry more information.

TF-IDF has two parts:

- **TF (term frequency)** — how often the word appears in this document. One common version: count ÷ number of words in the document.
- **IDF (inverse document frequency)** — how rare the word is across all documents: ln(N ÷ df), where N = number of documents and df = number of documents that contain the word.

<div class="formula">

| Formula | Meaning |
|---|---|
| TF(t, d) = count of t in d ÷ total words in d | How important t is inside one document |
| IDF(t) = ln(N ÷ df(t)) | How rare t is across N documents |
| TF-IDF(t, d) = TF(t, d) × IDF(t) | Final weight |
| scikit-learn IDF = ln((1 + N) ÷ (1 + df)) + 1 | "Smoothed" version, never zero, avoids divide-by-zero |

</div>

### Worked example by hand

Same three documents. N = 3. Every document has 4 words.

**Step 1 — document frequency (df):** in how many documents does each word appear?

| Word | Appears in | df |
|---|---|---|
| the | D1, D2, D3 | 3 |
| was | D1, D2, D3 | 3 |
| movie | D1, D2 | 2 |
| good | D1, D3 | 2 |
| bad | D2 | 1 |
| food | D3 | 1 |

**Step 2 — IDF = ln(3 ÷ df):**

- the, was: ln(3 ÷ 3) = ln(1) = **0**
- movie, good: ln(3 ÷ 2) = ln(1.5) = **0.4055**
- bad, food: ln(3 ÷ 1) = ln(3) = **1.0986**

Notice: words in every document get IDF = 0. They are thrown away automatically.

**Step 3 — TF:** each word appears once in a 4-word document, so TF = 1 ÷ 4 = **0.25** for every word that is present.

**Step 4 — TF × IDF:**

- D1 "movie": 0.25 × 0.4055 = **0.1014**
- D1 "good": 0.25 × 0.4055 = **0.1014**
- D2 "bad": 0.25 × 1.0986 = **0.2747**
- D3 "food": 0.25 × 1.0986 = **0.2747**
- every "the" and "was": 0.25 × 0 = **0**

| | bad | food | good | movie | the | was |
|---|---|---|---|---|---|---|
| D1 | 0 | 0 | 0.1014 | 0.1014 | 0 | 0 |
| D2 | 0.2747 | 0 | 0 | 0.1014 | 0 | 0 |
| D3 | 0 | 0.2747 | 0.1014 | 0 | 0 | 0 |

Look at D2: "bad" (0.2747) is the strongest word. That is exactly the word that makes D2 different from the others.

### Comparing documents with cosine similarity

To ask "how similar are D1 and D2?", we compare their vectors with **cosine similarity**: the dot product divided by the product of the lengths. It is 1 when the vectors point the same way and 0 when they share nothing. (See [Vectors and Matrices](/interview/ai-engineer/math-for-ml/vectors-and-matrices) for a refresher.)

<div class="formula">

| Formula | Meaning |
|---|---|
| cos(a, b) = (a · b) ÷ (‖a‖ × ‖b‖) | 1 = same direction, 0 = nothing in common |
| a · b = a₁b₁ + a₂b₂ + … | Dot product |
| ‖a‖ = √(a₁² + a₂² + …) | Length (norm) |

</div>

D1 vs D2 (using the TF-IDF table):

- Dot product: only "movie" is non-zero in both → 0.1014 × 0.1014 = **0.01028**
- ‖D1‖ = √(0.1014² + 0.1014²) = √(0.01028 + 0.01028) = √0.02056 = **0.1434**
- ‖D2‖ = √(0.2747² + 0.1014²) = √(0.07546 + 0.01028) = √0.08574 = **0.2928**
- cos = 0.01028 ÷ (0.1434 × 0.2928) = 0.01028 ÷ 0.04199 = **0.245**

D2 vs D3: they share only "the" and "was", which have weight 0. So the dot product is 0 and cosine = **0**. A movie review saying "bad" and a food review saying "good" have nothing useful in common. That matches our intuition.

### TF-IDF in scikit-learn

scikit-learn uses the smoothed IDF and then scales each row to length 1 (**L2 normalization**), so its numbers differ from our hand calculation, but the ranking idea is the same.

```python
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

docs = ["the movie was good", "the movie was bad", "the food was good"]
tfidf = TfidfVectorizer()            # defaults: smooth_idf=True, norm="l2"
X = tfidf.fit_transform(docs)

print(tfidf.get_feature_names_out())
# Output: ['bad' 'food' 'good' 'movie' 'the' 'was']
print(np.round(tfidf.idf_, 2))
# Output: [1.69 1.69 1.29 1.29 1.   1.  ]
print(np.round(X.toarray(), 2))
# Output:
# [[0.   0.   0.56 0.56 0.43 0.43]
#  [0.66 0.   0.   0.5  0.39 0.39]
#  [0.   0.66 0.5  0.   0.39 0.39]]
```

Check one value by hand: smoothed IDF of "bad" = ln((1 + 3) ÷ (1 + 1)) + 1 = ln(2) + 1 = 0.693 + 1 = 1.69. Correct.

Notice "the" is no longer 0 because the smoothed formula adds 1. It still gets the smallest weight.

> **Interview tip:** Be ready to say why IDF uses a logarithm. Without the log, a word in 1 of 1,000,000 documents would get weight 1,000,000 — far too large. The log squashes big ratios so rare words matter more, but not absurdly more.

> **Common mistake:** Fitting the vectorizer on the whole dataset before splitting into train and test. The test documents then influence the vocabulary and IDF values. This is **data leakage**. Always `fit` on training data only and `transform` the test data.

### A complete TF-IDF classifier

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

train_texts = [
    "delivery was fast and product is great",
    "excellent quality, very happy",
    "worst product, broke in two days",
    "very bad packaging and late delivery",
]
train_labels = [1, 1, 0, 0]          # 1 = positive, 0 = negative

model = make_pipeline(
    TfidfVectorizer(ngram_range=(1, 2)),   # words and word pairs
    LogisticRegression(),
)
model.fit(train_texts, train_labels)     # the pipeline fits TF-IDF on train only

print(model.predict(["great quality product"]))
```

With 4 training sentences the prediction is only a toy, but the same 6 lines work for 100,000 reviews and are a strong baseline. See [Logistic Regression](/interview/ai-engineer/machine-learning/logistic-regression) and [Pipelines and Hyperparameter Tuning](/interview/ai-engineer/machine-learning/pipelines-and-hyperparameter-tuning).

## N-grams

Bag of words loses word order. An **n-gram** is a sequence of n words that appear next to each other. Using n-grams as features keeps a little bit of order.

- **Unigrams** (n = 1): single words.
- **Bigrams** (n = 2): pairs of neighbouring words.
- **Trigrams** (n = 3): triples.

Sentence: "not a good movie"

| n | n-grams |
|---|---|
| 1 | not, a, good, movie |
| 2 | not a, a good, good movie |
| 3 | not a good, a good movie |

Now "not a good" is a feature that a sentiment model can learn is negative.

```python
from sklearn.feature_extraction.text import CountVectorizer

vec = CountVectorizer(ngram_range=(1, 2), token_pattern=r"\b\w+\b")
vec.fit(["not a good movie"])
print(vec.get_feature_names_out())
# Output: ['a' 'a good' 'good' 'good movie' 'movie' 'not' 'not a']
```

(The custom `token_pattern` keeps the one-letter word "a"; the default pattern drops one-letter words.)

**Trade-off:** more n-grams mean more features. A vocabulary of 50,000 words can create millions of bigrams. Most appear once and add noise. Use `min_df` (ignore n-grams that appear in fewer than k documents) and `max_features` to control size.

### Count-based vs learned representations

| Method | Keeps order? | Knows meaning? | Vector type | Needs GPU? | Good for |
|---|---|---|---|---|---|
| Bag of words | No | No | Sparse, size = vocab | No | Quick baselines |
| TF-IDF | No | No | Sparse | No | Baselines, keyword search |
| TF-IDF + n-grams | A little | No | Very sparse | No | Better baselines, phrases |
| Word2Vec / GloVe | No | Yes (static) | Dense, ~100–300 dims | No | Similar words, simple features |
| Transformer embeddings | Yes | Yes (contextual) | Dense, ~384–4096 dims | Helps | Almost everything today |

> **Remember:** TF-IDF is not dead. **BM25**, the default ranking in search engines like Elasticsearch, is an improved TF-IDF. Modern RAG systems often combine BM25 with vector search ("hybrid search"). See [Advanced RAG](/interview/ai-engineer/llms-genai/advanced-rag).

## Key terms

| Term | Simple meaning |
|---|---|
| NLP | AI that works with human language |
| Preprocessing | Cleaning raw text before using it |
| Token | One piece of text after splitting (often a word) |
| Stop words | Very common words like "the", "is" |
| Stemming | Cutting words to a rough root by rules |
| Lemmatization | Turning words into their dictionary form |
| Vocabulary | The list of all unique tokens the model knows |
| Bag of words | Count of each word, ignoring order |
| Sparse vector | A vector where almost all values are zero |
| TF | How often a word appears in one document |
| IDF | How rare a word is across all documents |
| TF-IDF | TF × IDF; high for words frequent here but rare elsewhere |
| L2 normalization | Scaling a vector so its length is 1 |
| Cosine similarity | Similarity of two vectors by the angle between them |
| N-gram | A sequence of n neighbouring words |
| Data leakage | Test data influencing training, giving fake good results |
| BM25 | An improved TF-IDF used for ranking in search engines |

## Interview questions

**What is TF-IDF and why is it better than raw counts?**
TF-IDF multiplies how often a word appears in a document (TF) by how rare it is across documents (IDF). Raw counts give common words like "the" big values even though they carry no information. IDF pushes those words toward zero and boosts distinctive words. So TF-IDF vectors better capture what makes a document special.

**Why is there a log in IDF?**
The ratio N ÷ df can be huge for rare words. Without the log, one rare word would dominate the whole vector. The log compresses the scale, so rarer words get more weight but in a controlled way.

**What are the limits of bag of words and TF-IDF?**
They ignore word order, so "dog bites man" equals "man bites dog". They have no idea of meaning, so "good" and "great" are unrelated. Vectors are very large and sparse. And words not in the training vocabulary are simply ignored.

**What is the difference between stemming and lemmatization?**
Stemming chops word endings with fixed rules and can produce non-words like "studi". Lemmatization uses vocabulary and grammar to return the real base word, like "study". Lemmatization is more accurate but slower. Neither is needed for Transformer models.

**Do you preprocess text before feeding it to BERT?**
Mostly no. You only remove real junk such as HTML. You keep punctuation, case (for cased models) and stop words, because the model was pretrained on natural text and uses all of it. The model's own tokenizer must be used, exactly as in pretraining.

**What are n-grams and what is the trade-off?**
N-grams are sequences of n neighbouring words, like "not good". They capture short-range word order and phrases. The cost is a much larger and sparser feature space, which needs more data and memory. Usually unigrams + bigrams with a `min_df` cutoff is a good balance.

**How do you avoid data leakage with TF-IDF?**
Fit the vectorizer only on the training set, then use it to transform validation and test sets. Wrapping the vectorizer and model in a scikit-learn Pipeline does this automatically, including during cross-validation.

**When would you still choose TF-IDF over a Transformer?**
When data is small, latency or cost must be very low, there is no GPU, or you need a quick explainable baseline. Also for keyword search where exact terms (product codes, names) matter. Often TF-IDF + logistic regression gets close to Transformer accuracy on simple topic classification.

**Why use cosine similarity instead of Euclidean distance for text?**
Cosine looks only at direction, not length. A long document and a short document about the same topic have vectors pointing the same way but with different lengths. Cosine treats them as similar; Euclidean distance would say they are far apart.

## Try it yourself

1. Add a fourth document D4 = "the food was bad" to the three documents. Recompute df and IDF (natural log, unsmoothed) for "bad", "food", "good" and "movie". *Hint: N is now 4.*
2. Compute by hand the cosine similarity between D1 and D3 using the hand TF-IDF table in this chapter. *Hint: they share only "good".*
3. Write the bigrams of "the train was not late today".
4. In Python, train `TfidfVectorizer` on 5 sentences of your own and print the top 3 words of each sentence by TF-IDF score. *Hint: use `X.toarray()` and `np.argsort`.*

### Answers

1. With 4 documents: "bad" is in D2, D4 → df = 2, IDF = ln(4/2) = ln 2 = 0.693. "food" is in D3, D4 → 0.693. "good" is in D1, D3 → 0.693. "movie" is in D1, D2 → 0.693. All four now have the same IDF because each is in exactly half the documents.
2. Dot = 0.1014 × 0.1014 = 0.01028. ‖D1‖ = 0.1434, ‖D3‖ = 0.2928 (same numbers as D2). cos = 0.01028 ÷ 0.04199 = 0.245.
3. "the train", "train was", "was not", "not late", "late today".
4. Example:

```python
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

docs = ["my upi payment failed", "train ticket booked on irctc",
        "cricket score india won", "upi refund came back", "india won the test match"]
tfidf = TfidfVectorizer()
X = tfidf.fit_transform(docs).toarray()
words = tfidf.get_feature_names_out()
for i, row in enumerate(X):
    top = np.argsort(row)[::-1][:3]          # indices of the 3 largest scores
    print(docs[i], "->", [words[j] for j in top])
```

**Next:** [Tokenization](/interview/ai-engineer/nlp-transformers/tokenization)
