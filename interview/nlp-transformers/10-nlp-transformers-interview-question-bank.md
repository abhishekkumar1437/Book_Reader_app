---
title: NLP & Transformers Interview Question Bank
part: Wrap-up
summary: 65 interview questions with model answers on text representation, tokenization, embeddings, attention, the Transformer architecture, BERT/GPT/T5, Hugging Face, fine-tuning and inference, with the most frequently asked marked ⭐.
---

Use this chapter in Phase 10 (Days 143–150) and on every 7th revision day during Phase 5. Cover each answer, say your own answer out loud, then compare. The ⭐ questions come up in almost every AI engineer interview — you should be able to answer them in under a minute, and draw or write the formula when asked. Each section links back to the chapter that teaches it.

> **In simple words:** Interviewers check three things: do you understand **why** each part exists, can you do the **math** on a small example, and can you make **practical** choices (which model, what cost, what to do when it fails).

## Last-minute formula sheet

<div class="formula">

| Formula | Meaning |
|---|---|
| TF-IDF(t, d) = TF(t, d) × ln(N ÷ df(t)) | Word weight: frequent here, rare elsewhere |
| cos(a, b) = a·b ÷ (‖a‖‖b‖) | Similarity by angle |
| Attention(Q, K, V) = softmax(QKᵀ ÷ √d_k) · V | Scaled dot-product attention |
| d_k = d_model ÷ h | Size of each head |
| MultiHead = Concat(head₁…head_h) · W_O | Multi-head attention |
| PE(pos, 2i) = sin(pos ÷ 10000^(2i/d)), PE(pos, 2i+1) = cos(…) | Sinusoidal positions |
| LayerNorm(x) = γ (x − mean) ÷ √(var + ε) + β | Normalize each token vector |
| Params per block ≈ 12 · d_model² | 4d² attention + 8d² FFN |
| KV cache = 2 × layers × kv_heads × d_head × tokens × bytes | Generation memory |
| Weights memory ≈ params × 2 bytes (fp16) | 7B → ~14 GB |
| Loss = −ln p(correct token); perplexity = e^loss | Language-model training |

</div>

## Text basics and tokenization

See [Text as Data](/interview/nlp-transformers/text-as-data) and [Tokenization](/interview/nlp-transformers/tokenization).

**1. ⭐ What is TF-IDF? Compute it for a small example.**
TF-IDF scores a word by how often it appears in a document (TF) times how rare it is across documents (IDF = ln(N ÷ df)). For 3 documents where "bad" appears once in a 4-word document and in only 1 document: TF = 1/4, IDF = ln 3 = 1.099, TF-IDF = 0.275. A word in all 3 documents gets IDF = ln 1 = 0, so it is ignored.
*Follow-up the interviewer may ask: why the log?* Without it, very rare words would get huge weights; the log compresses the scale.

**2. What are the limitations of bag of words and TF-IDF?**
They ignore word order, have no notion of meaning or synonyms, produce huge sparse vectors, and cannot handle words outside the training vocabulary. They are still strong, cheap baselines for classification and keyword search.

**3. Should you remove stop words and lowercase text before BERT?**
No. Pretrained Transformers were trained on natural text and use every token, including "not" and punctuation. Use the model's own tokenizer on raw text; only remove junk like HTML.

**4. ⭐ Why do modern models use subword tokenization?**
Word vocabularies are huge and still have unknown words; character sequences are very long and slow for attention. Subwords keep common words whole and split rare words into known pieces, giving a medium vocabulary and almost no unknown tokens.

**5. ⭐ Explain BPE.**
Start from characters (or the 256 bytes). Count adjacent symbol pairs across the corpus, weighted by word frequency, and merge the most frequent pair into a new token. Repeat until the vocabulary reaches the target size. New text is tokenized by applying the learned merges in order.
*Follow-up: BPE vs WordPiece?* WordPiece merges the pair with the highest count(ab) ÷ (count(a) × count(b)) and uses `##` for word-continuation pieces.

**6. What is byte-level BPE?**
BPE whose base vocabulary is the 256 byte values. Every string in any language or emoji is a byte sequence, so nothing is ever out of vocabulary. GPT-2 introduced it; most LLMs use it.

**7. ⭐ Why does token count matter in LLM applications?**
APIs charge per input and output token, context windows are limited in tokens, and latency grows with tokens generated. Non-English text often needs more tokens for the same meaning, so it costs more. Engineers shorten prompts, limit retrieved context and cap output length.

**8. Why are LLMs bad at counting letters in a word?**
They never see letters, only subword tokens. "strawberry" might be 2–3 tokens, so the model must have memorized the spelling of each token to count letters.

## Embeddings

See [Word Embeddings](/interview/nlp-transformers/word-embeddings).

**9. Why not represent words as one-hot vectors?**
They are as long as the vocabulary, almost all zeros, and every two different words have dot product 0, so they carry no similarity. Dense embeddings are short and put similar words close together.

**10. ⭐ Explain Word2Vec. CBOW vs skip-gram?**
Word2Vec trains a shallow network on a fake task so that words in similar contexts get similar vectors. CBOW predicts the centre word from its neighbours (faster, good for frequent words). Skip-gram predicts the neighbours from the centre word (better for rare words). We keep the embedding matrix after training.

**11. What is negative sampling?**
Instead of a softmax over the whole vocabulary for each training pair, the model learns to tell a real (word, context) pair from a few random fake pairs with logistic loss. It makes training on billions of words feasible.

**12. ⭐ Static vs contextual embeddings?**
Static embeddings (Word2Vec, GloVe) give one vector per word type, so "bank" is the same in "river bank" and "bank loan". Contextual embeddings (BERT, GPT) compute a vector per occurrence using self-attention over the sentence, so the two "bank"s differ.

**13. Why cosine similarity for embeddings?**
It compares direction and ignores vector length, which often reflects frequency rather than meaning. For unit-length vectors, cosine equals the dot product, which is cheap to compute.

**14. How does king − man + woman ≈ queen work?**
Embedding training places consistent relationships along consistent directions, like a male→female direction. Subtracting "man" and adding "woman" moves "king" along that direction, landing nearest to "queen" (excluding the input words). It is approximate, and the same mechanism also captures biases.

## From RNNs to attention

See [From RNNs to Attention](/interview/nlp-transformers/from-rnns-to-attention).

**15. ⭐ Why did Transformers replace RNNs?**
RNNs process tokens one after another, so training cannot be parallelized across the sequence, and long-range information must survive many steps (vanishing gradients). Transformers process all tokens in parallel during training, connect any two tokens in one attention step, and scale well with data and compute. The cost is O(n²) attention in sequence length.

**16. What is the bottleneck problem in seq2seq?**
The encoder squeezes the whole input into one fixed-size vector, and the decoder sees only that. Long inputs lose information. Attention lets the decoder look at all encoder states at each step.

**17. Explain the original (Bahdanau) attention idea.**
At each decoder step, score every encoder hidden state for relevance to the current decoder state, softmax the scores into weights, and take the weighted sum as a fresh context vector. The alignment between source and target words is learned, not given.

**18. What is teacher forcing?**
During training, the decoder receives the true previous token instead of its own prediction. It speeds up and stabilizes training. GPT training uses the same idea: predict every next token in parallel from the true prefix.

## Self-attention

See [Attention Step by Step](/interview/nlp-transformers/attention-step-by-step).

**19. ⭐ Explain self-attention step by step.**
Project each token's vector into a query, key and value with learned matrices. Compute scores QKᵀ between every query and every key, divide by √d_k, apply softmax per row to get weights, and multiply by V. Each token's output is a weighted mix of all tokens' values, focused on the most relevant ones.

**20. ⭐ Why divide by √d_k?**
If query and key entries have variance 1, their dot product has variance d_k, so scores grow with dimension. Large scores push softmax towards one-hot, where gradients are nearly zero and learning stalls. Dividing by √d_k brings the variance back to 1.
*Follow-up: why not divide by d_k?* That over-shrinks the scores (variance 1/d_k), making attention nearly uniform so the model cannot focus.
*Follow-up: numbers?* With d_k = 64, raw scores [12, 4, 0] give softmax ≈ [0.9997, 0.0003, 0.0000]; scaled [1.5, 0.5, 0] give [0.63, 0.23, 0.14].

**21. ⭐ What do Q, K and V represent, and why three matrices?**
The query is what a token looks for, the key is how it can be found, and the value is the information it passes on. Separate projections let the same token play different roles and allow asymmetric relationships; using the raw embedding for all three would be far less expressive.

**22. Compute a tiny attention example.**
Take q = [1, 1] and keys [0, 1], [1, 0], [1, 1] with d_k = 2. Scores = [1, 1, 2]; scaled = [0.707, 0.707, 1.414]; softmax = [0.248, 0.248, 0.503]. With values [1, 0], [0, 2], [1, 2], the output is 0.248·[1, 0] + 0.248·[0, 2] + 0.503·[1, 2] = [0.752, 1.503].

**23. In attention, is softmax applied over rows or columns?**
Over each row: for each query, softmax across all keys. Each row of the weight matrix sums to 1.

**24. ⭐ What is the causal mask?**
A lower-triangular mask that sets scores for future positions to −∞ before softmax, so their weights are 0. It stops decoder tokens from seeing later tokens during training, matching generation where future tokens do not exist.

```text
      t1 t2 t3
t1  [  0 -∞ -∞ ]
t2  [  0  0 -∞ ]
t3  [  0  0  0 ]
```

**25. What is a padding mask?**
It blocks attention to `[PAD]` positions so padding does not affect real tokens. It comes from the tokenizer's attention mask (0 = padding).

**26. ⭐ What is the complexity of self-attention?**
O(n² · d) time and O(n²) memory per head for the score matrix, where n is sequence length. Doubling the context makes attention about 4× more expensive. FlashAttention reduces memory traffic but compute stays quadratic.

**27. Self-attention vs cross-attention?**
In self-attention, Q, K and V come from the same sequence. In cross-attention, Q comes from the decoder and K, V from the encoder output, so the decoder can look up the input while generating.

**28. Is self-attention aware of word order?**
No. Without positional information it is permutation-equivariant: shuffling inputs just shuffles outputs. That is why positional encodings or RoPE are needed.

## The Transformer architecture

See [The Transformer Architecture](/interview/nlp-transformers/the-transformer-architecture).

**29. ⭐ Walk through a Transformer block.**
Pre-LN version: x = x + MultiHeadAttention(LayerNorm(x)), then x = x + FFN(LayerNorm(x)), where the FFN expands to about 4d, applies GELU or SwiGLU, and projects back. Decoders mask attention causally; encoder-decoder decoders also add cross-attention. The block is stacked N times, then a final norm and a linear layer to vocabulary logits.

**30. ⭐ Why multi-head attention?**
Each head has its own projections and softmax, so different heads can attend to different relationships at once (syntax, coreference, nearby tokens). One head would average them into one distribution. Splitting d_model into h heads of d_model/h keeps cost about the same.
*Follow-up: does the number of heads change parameter count?* No; W_Q, W_K, W_V, W_O are d_model × d_model in total regardless of h.

**31. ⭐ Why are positional encodings needed? Compare the main types.**
Attention has no sense of order. Sinusoidal encodings add fixed sin/cos vectors; learned absolute embeddings add a trained vector per position but cannot go past the table size; RoPE rotates queries and keys so scores depend on relative distance; ALiBi adds a distance penalty to scores. Most modern LLMs use RoPE.

**32. Explain RoPE in simple terms.**
Each pair of dimensions in q and k is rotated by an angle proportional to the token's position. The dot product of two rotated vectors depends on the angle difference, so the attention score depends on relative position m − n. It adds no parameters and can be extended to longer contexts with scaling tricks.

**33. ⭐ What do residual connections do?**
They add a sublayer's input to its output (x + f(x)), so each layer learns a correction. They give gradients a direct path through deep stacks, preventing vanishing gradients and enabling very deep models.

**34. LayerNorm vs BatchNorm — why LayerNorm?**
LayerNorm normalizes each token across its features, so it does not depend on batch size or sequence length and behaves the same in training and inference. BatchNorm normalizes each feature across the batch, which is awkward for variable-length text and small batches.

**35. Pre-LN vs Post-LN?**
Post-LN (original, BERT) normalizes after the residual add; Pre-LN (GPT-2 onwards) normalizes the input to each sublayer, leaving the residual path clean. Pre-LN trains deep models more stably and needs less warmup.

**36. What is RMSNorm?**
A simpler LayerNorm that divides by the root-mean-square of the vector without subtracting the mean, then applies a learned scale. It is slightly faster and works as well; Llama-family models use it.

**37. What does the feed-forward network do?**
It transforms each token independently after attention has mixed information between tokens. It expands to ~4d, applies a non-linearity, and projects back. It holds about two thirds of a block's parameters and is thought to store much factual knowledge.

**38. ⭐ Encoder vs decoder?**
Encoders use bidirectional self-attention, so every token sees the whole input — good for understanding. Decoders use causal self-attention, so each token sees only the past — required for generation. Encoder-decoder models add cross-attention from the decoder to the encoder output.

**39. ⭐ Estimate the parameters of GPT-2 small (d = 768, 12 layers, vocab 50,257, 1,024 positions).**
Per block ≈ 12d² + 13d = 7.09 M; × 12 = 85.1 M. Token embeddings 50,257 × 768 = 38.6 M; positions 0.8 M; output layer tied to the embeddings. Total ≈ 124 M.
*Follow-up: memory to load it in fp16?* 124 M × 2 bytes ≈ 250 MB.

**40. What is weight tying?**
The output projection to vocabulary logits reuses the input embedding matrix (transposed). It saves V × d parameters and often improves quality slightly. GPT-2 uses it; many large LLMs keep them separate.

**41. Why is the FFN hidden size usually 4× d_model?**
It was an empirical choice in the original paper that gave a good balance of capacity and cost. SwiGLU models use about (8/3)·d with three matrices to keep the same parameter count.

## Model families and pretraining

See [BERT, GPT and T5](/interview/nlp-transformers/bert-gpt-and-t5).

**42. ⭐ BERT vs GPT?**
BERT is encoder-only, bidirectional, pretrained with masked language modelling — best for classification, NER, embeddings and reranking. GPT is decoder-only, causal, pretrained with next-token prediction — built for generation. BERT cannot generate well; GPT sees only the past.

**43. ⭐ Explain masked language modelling.**
About 15% of tokens are selected; of those, 80% become `[MASK]`, 10% a random token, 10% unchanged. The model predicts the originals using context from both sides, with loss only on selected positions. The 80/10/10 mix reduces the mismatch with fine-tuning, where `[MASK]` never appears.

**44. ⭐ What is next-token prediction and what loss is used?**
The model predicts each token from all previous tokens. The loss is cross-entropy, −ln p(correct token), averaged over positions. With the causal mask, all positions are trained in one forward pass.

**45. What is perplexity?**
e raised to the average cross-entropy loss. A perplexity of 4 means the model is as uncertain as choosing uniformly among 4 tokens. Lower is better; compare only with the same tokenizer and data.

**46. What is T5's text-to-text approach?**
Every task is input text → output text, with a prefix such as "summarize:" or "translate English to German:". It uses an encoder-decoder pretrained with span corruption, where spans are replaced by sentinel tokens that the decoder must reconstruct.

**47. ⭐ Why are most LLMs decoder-only?**
Simple single objective, every token gives a training signal, smooth scaling with data and compute, in-context learning at scale, and efficient generation with a KV cache. Any task can be written as text continuation.

**48. When would you choose an encoder model over an LLM?**
High-volume, low-latency tasks with labeled data — classification, NER, embeddings, reranking. A fine-tuned encoder is far cheaper and often as accurate. Use an LLM for generation, reasoning, or when labeled data is scarce.

**49. What do Llama, Mistral, Qwen and Gemma have in common?**
Decoder-only Transformers with pre-norm RMSNorm, RoPE, SwiGLU FFNs, grouped-query attention and large byte-level BPE vocabularies; some use mixture-of-experts. They differ mainly in data, scale, context length and training recipe. Versions change fast, so check the Hub.

**50. What is a mixture-of-experts model?**
Each block has many expert FFNs and a router sending each token to a few of them. The model has many total parameters but uses few per token, so it is fast for its size. All experts still need memory, and routing adds training complexity.

**51. Base model vs instruct model?**
A base model is only pretrained and continues text. An instruct (chat) model is further trained with instruction data and preference tuning to follow instructions and act as an assistant. For applications you usually want the instruct version.

## Hugging Face and fine-tuning

See [Hugging Face in Practice](/interview/nlp-transformers/hugging-face-in-practice) and [Fine-tuning a Transformer](/interview/nlp-transformers/fine-tuning-a-transformer).

**52. ⭐ What happens inside a Hugging Face pipeline?**
Tokenization (text → input IDs and attention mask), a model forward pass (→ logits), and post-processing (softmax, label mapping, decoding). It also handles batching and device placement. For production you usually call the tokenizer and model directly for control.

**53. AutoModel vs AutoModelForSequenceClassification?**
AutoModel returns hidden states without a task head. The ForSequenceClassification class adds a linear head producing one logit per label. If the head was not trained, it is random — the "newly initialized weights" warning — and you must fine-tune.

**54. ⭐ Walk through fine-tuning BERT for classification.**
Split data into train/validation/test; tokenize with truncation using `map(batched=True)`; use dynamic padding; load the model with `num_labels` and `id2label`; train with Trainer at learning rate ~2e-5 for 2–4 epochs, evaluating each epoch on macro-F1 or accuracy; keep the best checkpoint with early stopping; report the test score and analyse errors.

**55. Why is the fine-tuning learning rate so small?**
Pretrained weights are already good; large updates would overwrite that knowledge (catastrophic forgetting) and make training unstable. Typical values are 1e-5 to 5e-5, often with warmup.

**56. ⭐ How do you recognise and fix overfitting during fine-tuning?**
Training loss keeps falling while validation loss rises and the validation metric stops improving. Fix with early stopping, fewer epochs, more or augmented data, more weight decay, lower learning rate, or a smaller model.

**57. How do you handle an imbalanced dataset?**
Select models by macro-F1 or rare-class recall, use class-weighted loss or oversampling, tune the decision threshold on validation data, and collect more rare-class examples.

**58. How do you get sentence embeddings from a Transformer?**
Run the model and pool the token vectors — usually mean pooling over non-padding tokens using the attention mask, then normalize. Use a model trained for embeddings (sentence-transformers style) rather than raw BERT for good similarity scores.

## Inference, KV cache and efficiency

**59. ⭐ What is the KV cache?**
During generation, each layer's keys and values for past tokens are stored, so each new token only computes its own q, k, v and attends to the cache. This avoids recomputing the whole prefix at every step, making decoding much faster. It costs memory that grows with sequence length, layers, KV heads and batch size.
*Follow-up: why only K and V, not Q?* Past queries are never needed again; only the new token's query attends to past keys and values.

**60. ⭐ Estimate the KV cache size.**
2 × layers × KV heads × head dim × tokens × bytes. For 32 layers, 32 heads × 128 dims, fp16, 4,096 tokens: 2 × 32 × 4,096 × 2 = 0.5 MB per token → 2 GB per sequence. With GQA and 8 KV heads it is 0.5 GB.

**61. What are grouped-query and multi-query attention?**
In GQA, groups of query heads share one key/value head; in MQA, all query heads share a single one. This shrinks the KV cache and speeds up decoding with little quality loss. Llama 3 and Mistral use GQA.

**62. Why is generation slower than training per token?**
Training processes all positions of known text in parallel. Generation must produce tokens one at a time, because each depends on the previous one, so it is limited by memory bandwidth for reading weights and the KV cache at every step.

**63. What is FlashAttention?**
An exact attention algorithm that computes attention in small tiles in fast on-chip GPU memory, never writing the full n × n score matrix to slow memory. It gives the same result with much less memory traffic, so it is faster and allows longer sequences.

## Scenario questions

**64. ⭐ You must classify 5 million support tickets per day into 20 categories. What do you build?**
Start with a TF-IDF + logistic regression baseline. If you have a few thousand labels, fine-tune a small encoder (DistilBERT, DeBERTa, ModernBERT) and serve it batched on a GPU or optimized CPU runtime — far cheaper than calling an LLM per ticket. Use an LLM to help label data and to handle low-confidence cases. Track macro-F1, per-class recall and drift over time.

**65. ⭐ Your model works well on English but poorly on Hindi and Hinglish messages. What do you check and do?**
Check the tokenizer (Hindi may split into many tokens or be poorly covered) and the training data (probably little Hindi). Options: a multilingual model (such as XLM-R or a multilingual LLM), adding labeled Hindi/Hinglish data, translating training data, and evaluating per language separately. Also handle transliterated text (Hindi in Latin script), which is very common.

## How to practise

- [ ] Write `softmax(QKᵀ/√d_k)V` and compute a 3-token example by hand in under 5 minutes.
- [ ] Draw a Transformer block from memory, with residuals and norms in the right places.
- [ ] Explain "why √d_k" in four sentences without notes.
- [ ] Do one BPE merge round on a small corpus by hand.
- [ ] Estimate parameters and fp16 memory for a model given d, layers and vocabulary.
- [ ] Run the fine-tuning script from chapter 9 once and explain every argument.

**Next:** continue with [How LLMs Work](/interview/llms-genai/how-llms-work) in the LLMs & Generative AI book.
