---
title: Deep Learning Interview Question Bank
part: Wrap-up
summary: 72 deep learning interview questions grouped by topic, from neurons and backprop to optimizers, normalization, PyTorch, CNNs, LSTMs, transfer learning and practical training, each with a crisp model answer, follow-ups for the important ones, and ⭐ on the most frequently asked.
---

This chapter collects the deep learning questions that come up most often in AI engineer, ML engineer and applied scientist interviews. Use it in the Interview Mode phase (Days 143–150) and in every weekly revision day after Phase 4. Each answer is short enough to say out loud in under a minute. Questions marked ⭐ are asked very often; know those perfectly.

> **In simple words:** Read the question, answer it out loud from memory, then compare with the model answer. If you could not answer, go back to the linked chapter and redo its worked example by hand.

How to practise:

- Cover the answer, speak your own answer for 30–60 seconds, then check.
- For questions with numbers (parameter counts, output sizes), write the calculation on paper, as you would on a whiteboard.
- When an answer lists several points, say the most important one first.
- Prepare one example from your own projects for "tell me about a time" follow-ups (see [Explaining Your Projects in Interviews](/interview/ai-engineer/ai-projects/explaining-your-projects-in-interviews)).

## Neural network basics

Review: [From Neuron to Neural Network](/interview/ai-engineer/deep-learning/from-neuron-to-neural-network).

**⭐ 1. What does a single neuron compute?**
A weighted sum of its inputs plus a bias, z = w·x + b, followed by an activation function, a = f(z). The weights and bias are learned. With a sigmoid activation, one neuron is exactly logistic regression.

*Follow-up the interviewer may ask:* "Why do we need the bias?" Without it, the decision boundary must pass through the origin; the bias shifts it, like the intercept in y = mx + c.

**⭐ 2. Why do neural networks need non-linear activation functions?**
Stacked linear layers collapse into one linear layer, because W₂(W₁x) = (W₂W₁)x. Non-linear activations let each layer bend the function, so depth adds real power and the network can learn complex boundaries.

**3. Walk me through a forward pass.**
For each layer, multiply the input by the weight matrix, add the bias (z = W·x + b), and apply the activation (a = f(z)); the output becomes the next layer's input. The last layer gives logits, which a softmax or sigmoid turns into probabilities. For x = [1, 2] in the book's 2-2-1 network, the hidden layer gives [1.4, 0.7] and the output σ(0.87) ≈ 0.70.

**⭐ 4. How many parameters does a dense layer with 512 inputs and 256 outputs have?**
Inputs × outputs + outputs = 512 × 256 + 256 = 131,328.

*Follow-up:* "And an MLP 784 → 128 → 10?" 784·128 + 128 = 100,480 plus 128·10 + 10 = 1,290, total 101,770.

**5. Why can't a single perceptron learn XOR?**
A perceptron draws one straight line, and XOR's positive and negative points cannot be separated by one line. A hidden layer with two neurons maps the points to a new space where one line works.

**6. What is the universal approximation theorem, and what does it not say?**
A network with one hidden layer and a non-linear activation can approximate any continuous function on a bounded domain if it has enough neurons. It does not say how many neurons are needed, whether gradient descent will find the weights, or whether the model generalizes.

**⭐ 7. Why go deep instead of wide?**
Deep networks build features hierarchically, reusing simple features (edges) to build complex ones (eyes, faces), which needs far fewer parameters than one huge layer for the same function. The cost is harder optimization, solved by ReLU, normalization, good initialization and residual connections.

**8. When would you not use deep learning?**
For small or medium tabular datasets, gradient-boosted trees usually win and are faster and easier to explain. Also when you need strict interpretability, have very little data and no pretrained model, or have tight latency and cost budgets.

## Activation functions

Review: [Activation Functions](/interview/ai-engineer/deep-learning/activation-functions).

**⭐ 9. Why is ReLU preferred over sigmoid in hidden layers?**
ReLU has slope 1 for positive inputs, so gradients do not shrink through active neurons; sigmoid's slope is at most 0.25 and near 0 when saturated, causing vanishing gradients. ReLU is also cheaper (one comparison) and gives sparse activations.

**⭐ 10. What is the dying ReLU problem?**
A neuron whose input is negative for every example always outputs 0 and gets zero gradient, so it never recovers. Causes are high learning rates and poor initialization. Fixes: lower learning rate, He initialization, Leaky ReLU/ELU, normalization.

**11. What is the derivative of sigmoid?**
σ′(z) = σ(z)(1 − σ(z)), maximum 0.25 at z = 0. For example σ(2) ≈ 0.881, so σ′(2) ≈ 0.881 × 0.119 ≈ 0.105.

**⭐ 12. Softmax vs sigmoid at the output: when to use which?**
Softmax over K logits when exactly one class is correct; it gives probabilities that sum to 1. Sigmoid on each output for binary or multi-label tasks, where each label is an independent yes/no. For logits [2, 1, 0.1], softmax gives [0.659, 0.242, 0.099].

*Follow-up:* "Why subtract the max logit?" To avoid overflow in eᶻ; softmax(z − c) = softmax(z), so the answer does not change.

**13. Which activations do Transformers and modern LLMs use?**
GELU in BERT and GPT-2/3; SiLU (Swish) inside SwiGLU feed-forward blocks in Llama, Mistral and Qwen. Both are smooth versions of ReLU that train large models slightly better.

## Loss functions and backpropagation

Review: [Loss Functions and Backpropagation](/interview/ai-engineer/deep-learning/loss-functions-and-backpropagation).

**⭐ 14. Explain backpropagation.**
Run a forward pass and store intermediate values. Starting from the loss, apply the chain rule backward through each layer: each layer's gradient is the incoming gradient times its local derivative. This gives ∂L/∂w for every weight in about the cost of one forward pass, and the optimizer then updates the weights.

*Follow-up:* "Is backprop the same as gradient descent?" No. Backprop computes gradients; gradient descent (or Adam) uses them to update weights.

**⭐ 15. Why use cross-entropy instead of MSE for classification?**
With softmax or sigmoid, cross-entropy's gradient with respect to the logits is simply p − y, which is large when the model is confidently wrong. MSE with sigmoid multiplies by σ′(z), which is near zero exactly then, so learning stalls. Cross-entropy also comes from maximum likelihood.

**16. What is the gradient of softmax + cross-entropy with respect to the logits?**
p − y: predicted probabilities minus the one-hot target. For p = [0.659, 0.242, 0.099] and true class 0, it is [−0.341, 0.242, 0.099].

**17. MSE vs MAE vs Huber?**
MSE squares errors, so it punishes big errors heavily and is sensitive to outliers. MAE treats every unit of error the same and is robust to outliers but has a constant gradient. Huber is squared for small errors and linear for large ones, combining both. For y = [3, 5, 2] and ŷ = [2.5, 5.5, 4], MSE = 1.5 and MAE = 1.0.

**18. What is a computational graph?**
A graph of operations (nodes) and the values flowing between them. PyTorch builds it during the forward pass and walks it in reverse to apply the chain rule. Add nodes copy the gradient to both inputs; multiply nodes give each input "incoming gradient × the other input".

**⭐ 19. What causes vanishing and exploding gradients?**
The gradient at an early layer is a product of per-layer factors (weights × activation slopes). Factors below 1 shrink it to zero (0.25¹⁰ ≈ 10⁻⁶); above 1 they blow it up (1.5¹⁰ ≈ 58). Fixes: ReLU, He/Xavier initialization, batch/layer norm, residual connections, LSTM gates, and gradient clipping for explosions.

**20. Why does training use more memory than inference?**
Backprop needs the stored activations of every layer, plus a gradient for every parameter and the optimizer's state (Adam keeps two values per parameter). Inference keeps only the weights and the current layer's output.

**21. Why can't we train directly on accuracy?**
Accuracy changes only when a prediction crosses the threshold, so its gradient is zero almost everywhere. We optimize a smooth surrogate like cross-entropy and report accuracy as a metric.

**22. What is a gradient check?**
Comparing backprop gradients to a numerical estimate, (L(w + ε) − L(w − ε)) / 2ε, for a few weights. It verifies a custom backward implementation; it is too slow for real training.

## Optimizers and learning rate

Review: [Optimizers and Learning Rate](/interview/ai-engineer/deep-learning/optimizers-and-learning-rate).

**⭐ 23. Explain Adam.**
Adam keeps a running average of gradients (momentum, β₁ = 0.9) and of squared gradients (β₂ = 0.999) for each parameter, applies bias correction because both start at zero, and updates w ← w − η·m̂/(√v̂ + ε). Each weight gets its own step size of roughly η, so it works well with little tuning.

*Follow-up:* "Why bias correction?" Without it, the first steps would be too small or wrongly sized, because m and v start at zero.

**⭐ 24. Adam vs AdamW?**
With Adam, an L2 penalty's gradient is divided by √v̂, so weights with large gradients are barely regularized. AdamW applies weight decay directly to the weights, separately from the adaptive step. AdamW generalizes better and is the default for Transformers.

**25. How does momentum help?**
It accumulates a velocity of past gradients (v ← βv + g), so consistent directions speed up and oscillating directions cancel. On f(w) = w² from w = 5 with η = 0.1, three momentum steps reach 0.31 while plain SGD reaches 2.56.

**⭐ 26. What happens if the learning rate is too high or too low?**
Too high: the loss bounces, rises, or becomes NaN. Too low: the loss falls very slowly and training may stall in a poor region. Find a good value with an LR range test, or start from defaults (Adam 1e-3 from scratch, 1e-5 to 5e-5 for fine-tuning Transformers).

**⭐ 27. Why use learning rate warmup?**
At the start, weights are random, gradients can be large, and Adam's variance estimates are unreliable, so full-size steps can destabilize training. Warmup increases the learning rate gradually over the first steps. It is used in nearly every Transformer recipe, usually followed by cosine or linear decay.

**28. How does batch size affect training?**
Larger batches give smoother gradients and better GPU use but need more memory and often a higher learning rate with warmup; very large batches can generalize worse. Smaller batches are noisier, which can help generalization. The linear scaling rule suggests scaling the learning rate with batch size.

**29. What is gradient accumulation?**
Running several small batches, letting gradients add up in `.grad`, and stepping the optimizer once. It simulates a large batch with little memory. Divide each loss by the number of accumulation steps so the gradient is an average.

## Regularization and normalization

Review: [Regularization, Dropout and Batch Norm](/interview/ai-engineer/deep-learning/regularization-dropout-and-batch-norm).

**⭐ 30. How do you detect and reduce overfitting?**
Detect it when training loss keeps falling but validation loss rises, or the train–validation accuracy gap is large. Reduce it with more data, augmentation, weight decay, dropout, early stopping, label smoothing, a smaller model, or a pretrained model.

**⭐ 31. How does dropout work?**
During training, each neuron's output is zeroed with probability p and survivors are multiplied by 1/(1 − p) (inverted dropout). This prevents co-adaptation and acts like training an ensemble of sub-networks. At evaluation, dropout does nothing.

*Follow-up:* "Why the 1/(1 − p) scaling?" So the expected activation is the same in training and evaluation, and inference needs no change.

**⭐ 32. What does batch norm do and why does it help?**
It normalizes each feature to mean 0 and variance 1 over the batch, then applies a learned scale γ and shift β. It keeps activations stable, allows higher learning rates, reduces sensitivity to initialization and adds mild regularization. For [2, 4, 6, 8]: mean 5, variance 5, output ≈ [−1.34, −0.45, 0.45, 1.34].

**33. How is batch norm different in training and evaluation?**
Training uses the current batch's statistics and updates running averages (momentum 0.1 in PyTorch). Evaluation uses the running averages, so a prediction does not depend on the other examples in the batch. Forgetting `model.eval()` gives inconsistent results.

**⭐ 34. Batch norm vs layer norm?**
Batch norm normalizes each feature across the batch; layer norm normalizes across the features of each example. Layer norm does not depend on batch size and behaves the same in training and inference, so Transformers and RNNs use it; CNNs commonly use batch norm. Many LLMs use RMSNorm, which skips the mean subtraction.

**35. What is weight decay?**
Shrinking every weight by a small factor each step: w ← w − η(g + λw). It discourages large weights and gives smoother functions that generalize better. Usually not applied to biases and normalization parameters.

**36. What is data augmentation, and what is a bad augmentation?**
Creating new training examples with label-preserving changes such as flips, crops and colour changes for images. A bad augmentation changes the label: flipping a "6" upside down, or horizontally flipping text. Never randomly augment validation or test data.

**37. What is label smoothing?**
Replacing the one-hot target with a softer one, for example 0.91 for the true class and 0.01 for each of 9 others with ε = 0.1. It stops the model from becoming over-confident and often improves accuracy and calibration. In PyTorch: `nn.CrossEntropyLoss(label_smoothing=0.1)`.

## PyTorch

Review: [PyTorch Tensors and Autograd](/interview/ai-engineer/deep-learning/pytorch-tensors-and-autograd) and [Building and Training a Model in PyTorch](/interview/ai-engineer/deep-learning/building-and-training-a-model-in-pytorch).

**⭐ 38. Write and explain a PyTorch training loop.**

```python
model.train()
for x, y in train_loader:
    x, y = x.to(device), y.to(device)
    logits = model(x)                 # forward
    loss = loss_fn(logits, y)         # scalar loss
    optimizer.zero_grad()             # clear old gradients
    loss.backward()                   # backprop: fill .grad
    optimizer.step()                  # update weights
```

Then evaluate with `model.eval()` inside `torch.no_grad()`, track `loss.item()`, and save the best checkpoint.

*Follow-up:* "What if you remove `zero_grad()`?" Gradients accumulate across steps, so each update uses the sum of all past gradients and training becomes erratic.

**⭐ 39. `model.eval()` vs `torch.no_grad()`?**
`model.eval()` changes layer behaviour: dropout off, batch norm uses running statistics. `torch.no_grad()` stops autograd from recording, saving memory and time. Use both for evaluation; they are independent.

**40. What does `requires_grad=True` do?**
It tells autograd to record operations on that tensor so `.backward()` can compute gradients for it. Model parameters have it by default; setting it to False freezes them.

**41. Why does PyTorch accumulate gradients?**
It allows gradient accumulation across batches and correctly sums gradients for parameters used several times in one graph. The price is calling `optimizer.zero_grad()` every step.

**42. `view` vs `reshape`?**
Both change shape without changing data. `view` never copies and needs contiguous memory, so it fails after `transpose` or `permute`. `reshape` uses a view when it can and copies otherwise.

**43. What do Dataset and DataLoader do?**
A Dataset defines `__len__` and `__getitem__`, returning one example. The DataLoader shuffles indices, loads examples (optionally in parallel workers) and stacks them into batch tensors.

**⭐ 44. Why should the model return logits, not probabilities?**
`CrossEntropyLoss` and `BCEWithLogitsLoss` apply log-softmax or log-sigmoid internally in a numerically stable way. Applying softmax yourself first means applying it twice, which weakens gradients. Use softmax only for predictions.

**45. How do you save and load a model correctly?**
Save `model.state_dict()` with `torch.save`, and for resuming also the optimizer and scheduler state and the epoch. Load by building the same architecture and calling `load_state_dict(torch.load(path, map_location=..., weights_only=True))`. Avoid pickling whole models; use safetensors for sharing.

**46. Why log `loss.item()` instead of `loss`?**
`loss` is attached to the computational graph; storing it keeps all its activations in memory and memory grows every step. `.item()` returns a plain Python float.

## Convolutional neural networks

Review: [Convolutional Neural Networks](/interview/ai-engineer/deep-learning/convolutional-neural-networks).

**⭐ 47. Why are CNNs better than MLPs for images?**
Local connectivity and weight sharing: a small filter looks at nearby pixels and is reused at every position. This cuts parameters massively (a dense layer on a 224×224×3 image with 1,000 neurons needs ~150M weights), uses spatial structure, and detects a pattern anywhere in the image.

**⭐ 48. What is the output size of a convolution layer?**
O = ⌊(W − K + 2P)/S⌋ + 1. Examples: 32 input, 5×5 kernel, no padding, stride 1 → 28. 224 input, 7×7, padding 3, stride 2 → ⌊223/2⌋ + 1 = 112.

*Follow-up:* "What padding keeps the size the same with a 3×3 kernel?" P = 1 with stride 1.

**⭐ 49. How many parameters does `nn.Conv2d(3, 16, kernel_size=3)` have?**
(3 × 3 × 3 + 1) × 16 = 28 × 16 = 448. It does not depend on image size.

**50. Compute a convolution by hand.**
Slide the filter over the input; at each position multiply element-wise and sum. For the 4×4 input [[3,1,0,2],[4,2,1,0],[5,3,0,1],[2,4,1,3]] and the vertical edge filter with rows [1, 0, −1], the top-left patch gives (3−0) + (4−1) + (5−0) = 11, and the full output is [[11, 3], [9, 5]].

**51. What does pooling do?**
It summarizes small windows (max or average) to shrink height and width, with no parameters. It reduces compute, adds some translation invariance and enlarges the receptive field. 2×2 max pooling of the input above gives [[4, 2], [5, 3]].

**52. What is a 1×1 convolution for?**
Mixing channels at each pixel without looking at neighbours, mainly to reduce or expand the number of channels cheaply, as in ResNet bottlenecks and Inception.

**⭐ 53. Explain ResNet's skip connections.**
A block outputs F(x) + x, so it learns only a correction to its input. If a block is not useful it can learn F ≈ 0, so extra depth does not hurt (this solved the degradation problem). In backprop, ∂y/∂x = ∂F/∂x + 1, giving gradients a direct path to early layers.

**54. What is the receptive field?**
The region of the input that affects one neuron. It grows with more conv layers, pooling, strides, larger or dilated kernels. Two stacked 3×3 convolutions see 5×5 with fewer parameters than one 5×5.

## Recurrent networks and LSTM

Review: [Recurrent Networks and LSTM](/interview/ai-engineer/deep-learning/recurrent-networks-and-lstm).

**55. How does an RNN process a sequence?**
It reads one element at a time and updates a hidden state with shared weights: hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁ + b). The hidden state is the memory of everything so far; the same weights handle any sequence length.

**⭐ 56. Why do plain RNNs fail on long sequences?**
Backpropagation through time multiplies the gradient by the recurrent weights and tanh slope at every step; over many steps it vanishes (0.8²⁰ ≈ 0.01) or explodes (1.2²⁰ ≈ 38). So the network cannot learn long-range dependencies.

**⭐ 57. Explain the LSTM gates.**
The forget gate decides what to erase from the cell state, the input gate decides how much of the new candidate to write, and the output gate decides how much of tanh(cell state) to expose as the hidden state. Gates are sigmoids (0 to 1); the candidate is a tanh. The update is c = f·c_prev + i·g and h = o·tanh(c).

*Follow-up:* "How does that fix vanishing gradients?" The cell state is updated additively, so its gradient is multiplied only by the forget gate each step; when f ≈ 1 the gradient survives many steps, like a residual connection.

**58. LSTM vs GRU?**
GRU has two gates (update, reset) and no separate cell state, so it has about 25% fewer parameters (3 vs 4 gate blocks) and is faster. Accuracy is often similar; LSTM can be better on very long or complex sequences.

**59. What do `output` and `h_n` from `nn.LSTM` contain?**
`output`: the top layer's hidden state at every time step, (batch, seq, hidden) with `batch_first=True`. `h_n`: the last step's hidden state for each layer, (layers × directions, batch, hidden). Use `output` for per-token tasks and `h_n[-1]` for classifying a whole sequence.

**⭐ 60. Why did Transformers replace RNNs?**
RNNs are sequential, so they cannot parallelize across time on GPUs, and their memory of distant tokens still fades. Self-attention connects every pair of positions directly and processes the whole sequence in parallel, so it trains faster and scales to huge datasets. See [From RNNs to Attention](/interview/ai-engineer/nlp-transformers/from-rnns-to-attention).

## Transfer learning

Review: [Transfer Learning and Pretrained Models](/interview/ai-engineer/deep-learning/transfer-learning-and-pretrained-models).

**⭐ 61. What is transfer learning and why does it work?**
Re-using a model pretrained on a large dataset (ImageNet, web text) for a new task. Early and middle layers learn general features useful for many tasks; only the top layers are task-specific. It needs far less data and compute and usually gives better accuracy.

**⭐ 62. Feature extraction vs fine-tuning?**
Feature extraction freezes the backbone and trains only a new head: cheap, safe with very little data. Fine-tuning also updates some or all backbone layers with a small learning rate: usually more accurate with more data or when the new data looks different from the pretraining data.

*Follow-up:* "What is a good recipe?" Train the head first with the backbone frozen, then unfreeze the top block(s) with a learning rate about 10× smaller.

**63. How do you freeze layers in PyTorch?**
Set `p.requires_grad = False` for their parameters, replace the head, and give the optimizer only trainable parameters. Batch norm layers still update running statistics in train mode, so put frozen ones in eval mode if needed.

**64. Why use a small learning rate when fine-tuning?**
Large updates overwrite the useful pretrained features (catastrophic forgetting). A small learning rate adjusts them gently; the random new head can use a larger one (discriminative learning rates).

**65. How would you build an image classifier with 500 labelled images?**
Take a pretrained backbone (ResNet, EfficientNet), use its exact preprocessing, replace the head, train with the backbone frozen and with augmentation, then optionally fine-tune the top block with a low learning rate. Use a held-out validation set, per-class metrics, and check for duplicate images across splits.

## Training in practice

Review: [Training in Practice](/interview/ai-engineer/deep-learning/training-in-practice).

**⭐ 66. Your loss becomes NaN. What do you do?**
Lower the learning rate, add gradient clipping (max_norm 1.0), and log the gradient norm to see when it spikes. Check the data for NaN or extreme values, look for log(0) or division by zero in custom code, use built-in stable losses, and with fp16 use a GradScaler or switch to bf16.

**⭐ 67. What is mixed precision training?**
Running most forward and backward computation in 16-bit (bf16 or fp16) while keeping master weights in fp32. It saves memory and uses tensor cores, often 1.5–3× faster. In PyTorch: `torch.autocast`, plus `GradScaler` for fp16 because its small range makes small gradients underflow.

*Follow-up:* "Why is bf16 preferred for LLMs?" It has fp32's exponent range, so no loss scaling is needed.

**68. How does gradient clipping by norm work?**
Compute the combined L2 norm of all gradients; if it exceeds max_norm, scale all gradients by max_norm/norm. Gradients [3, 4] with max_norm 1 have norm 5 and become [0.6, 0.8]. Call it after `backward()` and before `step()`.

**⭐ 69. What is the overfit-one-batch test?**
Train repeatedly on one small batch; a correct pipeline should reach near-zero loss and 100% accuracy on it quickly. If it cannot, there is a bug in data, labels, model, loss or loop. It catches most bugs in minutes.

**70. What should the initial loss be for a 10-class classifier?**
About ln(10) ≈ 2.30, because a random model assigns about 1/10 to each class. A very different value points to unnormalized inputs, bad initialization or wrong labels.

**⭐ 71. The model does not fit in GPU memory. What are your options?**
Smaller batch with gradient accumulation, mixed precision, activation checkpointing, shorter sequences or smaller images, freezing layers or LoRA, 8-bit optimizers, and sharding with FSDP or DeepSpeed ZeRO. Also make sure evaluation runs under `torch.no_grad()`. Rough training budget: 16 bytes per parameter for fp32 + AdamW, before activations.

**72. How do you make training reproducible?**
Seed Python, NumPy and PyTorch; seed the DataLoader generator and workers; optionally enable deterministic algorithms and disable cuDNN benchmarking; and log code, config and data versions. Report results over several seeds, and accept that different hardware can still give tiny differences.

## Rapid-fire numbers to know

<div class="formula">

| Fact | Value |
|---|---|
| Dense layer parameters | inputs × outputs + outputs |
| Conv layer parameters | (K × K × C_in + 1) × C_out |
| Conv output size | ⌊(W − K + 2P)/S⌋ + 1 |
| LSTM parameters (PyTorch) | 4 × (h·x + h·h + 2h) |
| GRU parameters (PyTorch) | 3 × (h·x + h·h + 2h) |
| Max slope of sigmoid / tanh | 0.25 / 1 |
| Initial cross-entropy for K classes | ln(K): 0.693 (2), 2.303 (10), 6.908 (1,000) |
| Adam defaults | lr 1e-3, β₁ 0.9, β₂ 0.999, ε 1e-8 |
| Fine-tuning LR for pretrained Transformers | about 1e-5 to 5e-5 |
| Training memory, fp32 + AdamW | ~16 bytes per parameter + activations |
| Inference weights in bf16 | 2 bytes per parameter |
| Typical gradient clipping | max_norm = 1.0 |
| Typical dropout | 0.1 (Transformers) to 0.5 (dense layers) |
| ResNet-18 / ResNet-50 parameters | ~11.7M / ~25.6M |

</div>

## Key terms

| Term | Simple meaning |
|---|---|
| ⭐ question | Asked very often; know it perfectly |
| Follow-up | The deeper question an interviewer asks after your first answer |
| Model answer | A short answer you can say out loud in under a minute |

## Try it yourself

1. Pick 10 ⭐ questions at random and answer each out loud in under 60 seconds. Record yourself and listen back. *Hint:* start with the main idea in one sentence, then give one detail or example.
2. On paper, without notes, compute: the parameters of `nn.Conv2d(32, 64, 3)`, the output size of a 3×3 conv with stride 2 and padding 1 on a 56×56 input, and the parameters of `nn.LSTM(100, 50)`. *Hint:* use the rapid-fire formulas.
3. Write the full PyTorch training and evaluation loop from memory in under 5 minutes, then compare with [Building and Training a Model in PyTorch](/interview/ai-engineer/deep-learning/building-and-training-a-model-in-pytorch). *Hint:* forward, loss, zero_grad, backward, step.

### Answers

1. Self-check: if any answer took more than a minute or you got stuck, reread that chapter's worked example.
2. Conv: (3·3·32 + 1) × 64 = 289 × 64 = 18,496. Output size: ⌊(56 − 3 + 2)/2⌋ + 1 = ⌊27.5⌋ + 1 = 28. LSTM: 4 × (50·100 + 50·50 + 100) = 4 × (5,000 + 2,500 + 100) = 4 × 7,600 = 30,400.
3. Your loop should include `model.train()`, moving the batch to the device, the five core lines, and an evaluation function with `model.eval()` and `@torch.no_grad()`.

**Next:** continue to [NLP & Transformers](/interview/ai-engineer/nlp-transformers), starting with [Text as Data](/interview/ai-engineer/nlp-transformers/text-as-data).
