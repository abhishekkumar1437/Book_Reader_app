---
title: Word Embeddings
part: Text Basics
summary: Why one-hot vectors fail, how Word2Vec (CBOW and skip-gram) and GloVe learn dense word vectors, cosine similarity and king − man + woman with real numbers, and static vs contextual embeddings.
---

TF-IDF knows how often words appear, but it has no idea that "good" and "great" mean almost the same thing. **Word embeddings** fix this: each word becomes a short list of numbers, and words with similar meanings get similar numbers. Embeddings are everywhere in an AI engineer's work — the first layer of every Transformer is an embedding table, and semantic search and RAG are built on embeddings of whole sentences.

> **In simple words:** Give every word a point in space (a vector of, say, 300 numbers). Train it so that words used in similar sentences end up close together. Then "close in space" means "similar in meaning".

## The problem with one-hot vectors

The simplest way to give a word an ID vector is **one-hot encoding**: a vector as long as the vocabulary, with a 1 in the word's position and 0 everywhere else.

Vocabulary of 4 words: `[chai, coffee, cricket, football]`

| Word | One-hot vector |
|---|---|
| chai | [1, 0, 0, 0] |
| coffee | [0, 1, 0, 0] |
| cricket | [0, 0, 1, 0] |
| football | [0, 0, 0, 1] |

Problems:

1. **No similarity.** The dot product of any two different one-hot vectors is 0. chai · coffee = 1·0 + 0·1 + 0·0 + 0·0 = 0, and chai · football = 0 as well. The model cannot tell that chai is more like coffee than like football.
2. **Huge size.** With a 50,000-word vocabulary, each word is a 50,000-number vector with a single 1.
3. **No sharing.** What the model learns about "chai" teaches it nothing about "coffee".

We want **dense** vectors: short (50–1,000 numbers), all numbers non-zero, and similar words close together.

## The idea: words are known by their neighbours

> **Real-life example:** If you hear "I drank a hot cup of ___ in the morning", you can guess the word is tea, chai or coffee, without seeing it. Words that fit in the same places tend to mean similar things.

This is the **distributional hypothesis**: "You shall know a word by the company it keeps" (J. R. Firth, 1957). If two words appear with the same neighbours, they probably have similar meanings. All embedding methods turn this idea into a training task.

## Word2Vec

**Word2Vec** (Mikolov et al., Google, 2013) learns word vectors with a very small neural network. It has two versions:

- **CBOW (Continuous Bag of Words):** look at the neighbour words and predict the middle word.
- **Skip-gram:** look at the middle word and predict each neighbour word.

The neighbours are the words inside a **context window** — for example, 2 words to the left and 2 to the right.

### Making training pairs (skip-gram)

Sentence: "i drink hot chai every morning", window = 2.

For the centre word **chai**, the neighbours within 2 positions are: drink, hot (left) and every, morning (right).

Skip-gram training pairs (input → target):

```text
chai → drink
chai → hot
chai → every
chai → morning
```

CBOW makes one example instead: `[drink, hot, every, morning] → chai`.

The network learns to make these predictions. It is never used for prediction afterwards — we throw away the task and keep the **weights**, which are the word vectors.

<figure>
<svg viewBox="0 0 440 200" width="440" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<rect x="10" y="80" width="80" height="36" rx="8" />
<text x="50" y="103" text-anchor="middle" fill="currentColor" stroke="none">chai</text>
<text x="50" y="135" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">one-hot (V)</text>
<line x1="90" y1="98" x2="150" y2="98" />
<polygon points="150,93 160,98 150,103" fill="currentColor" />
<rect x="160" y="70" width="100" height="56" rx="8" stroke="var(--accent)" />
<text x="210" y="94" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">embedding</text>
<text x="210" y="112" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">d numbers</text>
<line x1="260" y1="98" x2="300" y2="40" />
<line x1="260" y1="98" x2="300" y2="80" />
<line x1="260" y1="98" x2="300" y2="120" />
<line x1="260" y1="98" x2="300" y2="160" />
<rect x="300" y="25" width="120" height="28" rx="6" /><text x="360" y="44" text-anchor="middle" fill="currentColor" stroke="none">drink</text>
<rect x="300" y="65" width="120" height="28" rx="6" /><text x="360" y="84" text-anchor="middle" fill="currentColor" stroke="none">hot</text>
<rect x="300" y="105" width="120" height="28" rx="6" /><text x="360" y="124" text-anchor="middle" fill="currentColor" stroke="none">every</text>
<rect x="300" y="145" width="120" height="28" rx="6" /><text x="360" y="164" text-anchor="middle" fill="currentColor" stroke="none">morning</text>
<text x="360" y="192" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">predict neighbours</text>
</svg>
<figcaption>Skip-gram: the centre word's embedding is trained to predict its neighbours; the learned embedding is what we keep.</figcaption>
</figure>

### What the "embedding layer" really is

The network's first weight matrix **E** has one row per word: shape V × d (vocabulary size × vector size). Multiplying a one-hot vector by E just **picks out one row**.

Example: V = 4, d = 3.

```text
E =  chai     [ 0.2  0.9  0.1 ]
     coffee   [ 0.3  0.8  0.2 ]
     cricket  [ 0.9  0.1  0.7 ]
     football [ 0.8  0.2  0.8 ]

one-hot(cricket) = [0, 0, 1, 0]

[0, 0, 1, 0] × E = 0·row1 + 0·row2 + 1·row3 + 0·row4 = [0.9, 0.1, 0.7]
```

So in code we never multiply — we just look up the row by index. This is exactly what `torch.nn.Embedding` does in every Transformer.

### Negative sampling

Predicting the right neighbour out of 50,000 words needs a softmax over all 50,000 words for every training pair — very slow. **Negative sampling** turns it into many tiny yes/no questions: "Is (chai, drink) a real neighbour pair?" → yes. "Is (chai, tractor) a real pair?" → no, where "tractor" is a random word (a **negative sample**). The model is trained with logistic loss on 1 real pair + about 5–20 random pairs. This makes Word2Vec fast enough to train on billions of words.

| | CBOW | Skip-gram |
|---|---|---|
| Predicts | Middle word from neighbours | Neighbours from middle word |
| Speed | Faster | Slower |
| Rare words | Weaker (averaged away) | Better |
| Good for | Large corpora, frequent words | Smaller corpora, rare words |

## Measuring similarity: cosine similarity

To compare two word vectors we use **cosine similarity**: the cosine of the angle between them. It is 1 when they point in the same direction, 0 when they are at a right angle (unrelated), and −1 when opposite. See [Vectors and Matrices](/interview/math-for-ml/vectors-and-matrices).

<div class="formula">

| Formula | Meaning |
|---|---|
| cos(a, b) = (a · b) ÷ (‖a‖ × ‖b‖) | Similarity by angle, range −1 to 1 |
| a · b = Σ aᵢ bᵢ | Dot product |
| ‖a‖ = √(Σ aᵢ²) | Length of the vector |

</div>

### Worked example

Toy 3-dimensional vectors:

| Word | Vector |
|---|---|
| cricket | [0.9, 0.8, 0.1] |
| football | [0.8, 0.9, 0.2] |
| mango | [0.1, 0.2, 0.9] |

**cricket vs football:**

- Dot product: 0.9×0.8 + 0.8×0.9 + 0.1×0.2 = 0.72 + 0.72 + 0.02 = **1.46**
- ‖cricket‖ = √(0.81 + 0.64 + 0.01) = √1.46 = **1.2083**
- ‖football‖ = √(0.64 + 0.81 + 0.04) = √1.49 = **1.2207**
- cos = 1.46 ÷ (1.2083 × 1.2207) = 1.46 ÷ 1.4750 = **0.990** → very similar

**cricket vs mango:**

- Dot product: 0.9×0.1 + 0.8×0.2 + 0.1×0.9 = 0.09 + 0.16 + 0.09 = **0.34**
- ‖mango‖ = √(0.01 + 0.04 + 0.81) = √0.86 = **0.9274**
- cos = 0.34 ÷ (1.2083 × 0.9274) = 0.34 ÷ 1.1206 = **0.303** → not very similar

```python
import numpy as np

def cosine(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

cricket  = np.array([0.9, 0.8, 0.1])
football = np.array([0.8, 0.9, 0.2])
mango    = np.array([0.1, 0.2, 0.9])

print(round(cosine(cricket, football), 3))   # Output: 0.99
print(round(cosine(cricket, mango), 3))      # Output: 0.303
```

> **Remember:** If vectors are already normalized to length 1, cosine similarity equals the plain dot product. Many vector databases store normalized vectors for this reason — the dot product is cheaper to compute.

## Word arithmetic: king − man + woman ≈ queen

A famous result: with Word2Vec vectors, **vector("king") − vector("man") + vector("woman")** is closest to **vector("queen")**. Directions in the space carry meaning: there is a "male → female" direction, a "country → capital" direction, and so on.

Toy vectors where the 3 dimensions mean (royalty, male, female):

| Word | royalty | male | female |
|---|---|---|---|
| king | 0.9 | 0.9 | 0.1 |
| man | 0.1 | 0.9 | 0.1 |
| woman | 0.1 | 0.1 | 0.9 |
| queen | 0.9 | 0.1 | 0.9 |

Step by step:

- king − man = [0.9 − 0.1, 0.9 − 0.9, 0.1 − 0.1] = [0.8, 0.0, 0.0] → "the royalty part"
- + woman = [0.8 + 0.1, 0.0 + 0.1, 0.0 + 0.9] = **[0.9, 0.1, 0.9]**
- That is exactly the queen vector, so cosine with queen = 1.

Real embeddings have 300 dimensions with no clear meaning per dimension, and the answer is only *closest to* queen (you also exclude the input words king, man, woman from the search). But the idea is the same.

<figure>
<svg viewBox="0 0 400 200" width="400" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<circle cx="80" cy="150" r="4" fill="currentColor" />
<text x="70" y="172" fill="currentColor" stroke="none">man</text>
<circle cx="250" cy="150" r="4" fill="currentColor" />
<text x="240" y="172" fill="currentColor" stroke="none">woman</text>
<circle cx="120" cy="50" r="4" fill="currentColor" />
<text x="100" y="38" fill="currentColor" stroke="none">king</text>
<circle cx="290" cy="50" r="4" fill="var(--accent)" stroke="var(--accent)" />
<text x="280" y="38" fill="var(--accent)" stroke="none" font-weight="bold">queen</text>
<line x1="80" y1="150" x2="118" y2="58" stroke="var(--accent)" />
<line x1="250" y1="150" x2="288" y2="58" stroke="var(--accent)" />
<line x1="80" y1="150" x2="244" y2="150" stroke-dasharray="4 4" />
<line x1="120" y1="50" x2="284" y2="50" stroke-dasharray="4 4" />
<text x="30" y="105" fill="var(--accent)" stroke="none" font-size="11">+ royalty</text>
<text x="275" y="105" fill="var(--accent)" stroke="none" font-size="11">+ royalty</text>
<text x="140" y="142" fill="currentColor" stroke="none" font-size="11">male → female</text>
</svg>
<figcaption>The same "royalty" direction takes man to king and woman to queen, so king − man + woman lands near queen.</figcaption>
</figure>

> **Common mistake:** Saying embeddings "understand" words. They capture patterns of usage in the training text — including its biases. Early Word2Vec models gave results like "man : programmer :: woman : homemaker". Bias in embeddings is a real interview topic.

## GloVe and FastText

**GloVe** (Global Vectors, Stanford, 2014) uses the same neighbour idea but in a different way. It first counts, over the whole corpus, how often each pair of words appears near each other. This table is the **co-occurrence matrix**. Then it learns vectors so that the dot product of two word vectors ≈ log(how often they co-occur). Word2Vec learns from one window at a time; GloVe learns from global counts. The results are similar in quality.

**FastText** (Facebook, 2016) represents a word as the sum of its character n-gram vectors. "chai" with n = 3 uses `<ch, cha, hai, ai>` (the `<` and `>` mark word start and end). Because of this, FastText can build a vector for a word it never saw (like a typo "chaii") from its pieces. It is good for languages with many word forms, like Hindi or Finnish.

| Method | Learns from | Handles unseen words? | Year |
|---|---|---|---|
| Word2Vec | Local windows (predict neighbours) | No | 2013 |
| GloVe | Global co-occurrence counts | No | 2014 |
| FastText | Windows + character n-grams | Yes | 2016 |

### Using pretrained vectors

```python
# pip install gensim
import gensim.downloader as api

wv = api.load("glove-wiki-gigaword-100")    # 100-dim GloVe, downloads ~130 MB once

print(wv.most_similar("cricket", topn=3))   # nearest words by cosine similarity
print(wv.most_similar(positive=["king", "woman"], negative=["man"], topn=1))
# "queen" is normally the top answer
print(wv.similarity("chai", "coffee"))      # a cosine similarity between -1 and 1
```

Training your own Word2Vec on your own text:

```python
from gensim.models import Word2Vec

sentences = [
    ["i", "drink", "hot", "chai", "every", "morning"],
    ["i", "drink", "hot", "coffee", "every", "morning"],
    ["we", "play", "cricket", "every", "sunday"],
    ["we", "play", "football", "every", "sunday"],
]
model = Word2Vec(
    sentences,
    vector_size=20,   # size of each word vector
    window=2,         # neighbours on each side
    min_count=1,      # keep words that appear at least once
    sg=1,             # 1 = skip-gram, 0 = CBOW
    epochs=200,
)
print(model.wv["chai"].shape)                # Output: (20,)
print(model.wv.most_similar("chai", topn=2))  # with this tiny data, results are noisy
```

## Static vs contextual embeddings

Word2Vec and GloVe give each word **one fixed vector**, no matter the sentence. These are **static embeddings**. That is a problem for words with several meanings.

- "I deposited money in the **bank**."
- "We sat on the river **bank**."

A static embedding gives "bank" the same vector in both sentences — a blurry average of "money place" and "river side".

**Contextual embeddings** give a word a different vector in each sentence, based on the words around it. Models like ELMo (2018, using LSTMs) and then BERT and GPT (using Transformers) produce these. Inside a Transformer, each token starts with a static embedding from a lookup table, and then attention layers mix in information from the other words, so the output vector of "bank" depends on "money" or "river". Chapters 4–6 show exactly how.

```python
import torch
from transformers import AutoTokenizer, AutoModel

tok = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

def bank_vector(sentence):
    enc = tok(sentence, return_tensors="pt")
    with torch.no_grad():
        out = model(**enc).last_hidden_state[0]           # (num_tokens, 768)
    idx = enc["input_ids"][0].tolist().index(tok.convert_tokens_to_ids("bank"))
    return out[idx]

a = bank_vector("i deposited money in the bank")
b = bank_vector("we sat on the river bank")
c = bank_vector("the bank approved my loan")
cos = torch.nn.functional.cosine_similarity
print(cos(a, b, dim=0), cos(a, c, dim=0))   # a-c is usually higher than a-b
```

| | Static (Word2Vec, GloVe) | Contextual (BERT, GPT) |
|---|---|---|
| Vectors per word | One | One per occurrence |
| Handles multiple meanings | No | Yes |
| Speed | Instant lookup | Needs a full model forward pass |
| Size | ~100–300 dims, small files | ~768–4096+ dims, large models |
| Use today | Light features, teaching, some search | Almost all NLP |

From word vectors, the next step is **sentence embeddings**: one vector for a whole sentence, used in semantic search and RAG. See [Embeddings and Semantic Search](/interview/llms-genai/embeddings-and-semantic-search).

> **Interview tip:** A crisp answer to "What is the difference between Word2Vec and BERT embeddings?" — "Word2Vec gives one static vector per word type. BERT gives a contextual vector per token occurrence, computed by self-attention over the whole sentence, so 'bank' gets different vectors in 'river bank' and 'bank loan'."

## Key terms

| Term | Simple meaning |
|---|---|
| One-hot vector | Vector with a single 1 at the word's index and 0 elsewhere |
| Dense vector | Short vector where most values are non-zero |
| Word embedding | A dense vector that represents a word's meaning |
| Distributional hypothesis | Words in similar contexts have similar meanings |
| Context window | How many neighbour words on each side we look at |
| Word2Vec | 2013 method that learns embeddings by predicting neighbours |
| CBOW | Predict the middle word from its neighbours |
| Skip-gram | Predict the neighbours from the middle word |
| Embedding matrix / table | V × d matrix; row i is the vector of token i |
| Negative sampling | Train with real pairs vs random fake pairs instead of a full softmax |
| Cosine similarity | Similarity by angle between vectors |
| Word analogy | Vector arithmetic like king − man + woman ≈ queen |
| Co-occurrence matrix | Table of how often word pairs appear near each other |
| GloVe | Embeddings learned from global co-occurrence counts |
| FastText | Embeddings built from character n-grams; handles unseen words |
| Static embedding | One fixed vector per word |
| Contextual embedding | A vector that changes with the surrounding sentence |

## Interview questions

**Why not use one-hot vectors for words?**
They are as long as the vocabulary, mostly zeros, and every pair of different words has dot product 0. So they carry no similarity information and nothing learned about one word transfers to another. Dense embeddings are short and place similar words close together.

**Explain Word2Vec.**
It is a shallow network trained on a fake task: predict neighbour words from a centre word (skip-gram) or the centre word from its neighbours (CBOW). Words used in similar contexts need similar vectors to make similar predictions, so their vectors move close together. After training we keep the first weight matrix as the embeddings.

**What is negative sampling and why is it needed?**
A full softmax over a 50,000+ word vocabulary for each training pair is expensive. Negative sampling replaces it with a binary task: tell the real neighbour pair apart from a few random "negative" pairs. This is much cheaper and still learns good vectors.

**CBOW vs skip-gram — which is better?**
CBOW is faster and works well for frequent words because it averages the context. Skip-gram is slower but represents rare words better, since each word gets its own prediction updates. On small data, skip-gram is often preferred.

**Why cosine similarity rather than Euclidean distance?**
Vector length often reflects word frequency, not meaning. Cosine compares only direction, which carries the meaning. For normalized vectors, cosine and Euclidean ranking give the same order.

**How does GloVe differ from Word2Vec?**
Word2Vec learns from local context windows one at a time with a prediction task. GloVe first builds global word co-occurrence counts and fits vectors whose dot products match the log counts. Both give similar-quality static embeddings.

**What are static vs contextual embeddings?**
Static embeddings assign one vector per word type regardless of context, so "bank" is one vector. Contextual embeddings, from models like BERT, compute a vector for each occurrence using the whole sentence, so "river bank" and "bank loan" get different vectors.

**How does FastText handle a word it never saw?**
It represents words as a sum of character n-gram vectors. For an unseen word, it sums the vectors of the n-grams it contains, which usually exist from other words.

**Can embeddings be biased? How?**
Yes. They learn from human text, so they absorb stereotypes in it, such as gender–job associations. This can leak into downstream systems like resume screening. Mitigations include debiasing methods, careful data, and evaluating the final system for bias.

## Try it yourself

1. Compute cosine similarity by hand between chai = [0.2, 0.9, 0.1] and coffee = [0.3, 0.8, 0.2]. *Hint: dot product first, then the two lengths.*
2. Write all skip-gram (input, target) pairs for the sentence "we play cricket on sunday" with window = 1.
3. Using the toy royalty/male/female table, compute queen − woman + man. Which word does it match?
4. Load `glove-wiki-gigaword-100` with gensim and test 3 analogies of your own, such as "delhi − india + japan". *Hint: `most_similar(positive=[...], negative=[...])`.*

### Answers

1. Dot = 0.2×0.3 + 0.9×0.8 + 0.1×0.2 = 0.06 + 0.72 + 0.02 = 0.80. ‖chai‖ = √(0.04 + 0.81 + 0.01) = √0.86 = 0.9274. ‖coffee‖ = √(0.09 + 0.64 + 0.04) = √0.77 = 0.8775. cos = 0.80 ÷ (0.9274 × 0.8775) = 0.80 ÷ 0.8138 = 0.983.
2. (we, play), (play, we), (play, cricket), (cricket, play), (cricket, on), (on, cricket), (on, sunday), (sunday, on).
3. queen − woman = [0.8, 0.0, 0.0]; + man = [0.9, 0.9, 0.1] = king.
4. With GloVe, "delhi − india + japan" usually returns "tokyo" near the top. Results vary by model; that is fine.

**Next:** [From RNNs to Attention](/interview/nlp-transformers/from-rnns-to-attention)
