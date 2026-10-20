---
title: Cheat Sheet and Interview Questions
part: Wrap-up
summary: Every formula from the book on one page, grouped by topic, followed by 52 interview questions with model answers on linear algebra, probability, statistics and calculus. The most asked ones are marked with a star.
---

Use this chapter on revision days (every 7th day) and in the last week before interviews. First read the formula sheet and say out loud what each line means and where it is used in ML. Then cover the answers and try each question yourself. If one feels weak, go back to its chapter.

> **In simple words:** Linear algebra stores and combines numbers (vectors, matrices, dot products). Probability and statistics measure uncertainty and check if results are real. Calculus gives the gradient, which tells every weight which way to move.

## Formula sheet

### Notation

<div class="formula">

| Symbol | Meaning |
|---|---|
| x, **x**, **X** | scalar, vector (bold lowercase), matrix (bold uppercase) |
| xᵢ · x⁽ⁱ⁾ | i-th element · i-th example in the dataset |
| ŷ · y | prediction · true label |
| Σ · Π | sum · product |
| μ, σ, σ² | mean, standard deviation, variance |
| θ · η · λ | all parameters · learning rate · regularization strength or eigenvalue |
| ∂L/∂w · ∇L | partial derivative · gradient vector |
| P(A \| B) · E[X] | conditional probability · expected value |

</div>

### Linear algebra

<div class="formula">

| Formula | Meaning / where used |
|---|---|
| a · b = Σ aᵢbᵢ | dot product; a neuron computes w · x + b |
| ‖a‖ = √(Σ aᵢ²) | L2 norm (length); ‖[3, 4]‖ = 5 |
| ‖a‖₁ = Σ \|aᵢ\| | L1 norm; Lasso penalty, Manhattan distance |
| a · b = ‖a‖ ‖b‖ cos θ | dot product and angle |
| cos_sim = a · b ÷ (‖a‖ ‖b‖) | −1 to 1; text embeddings, RAG retrieval |
| distance = ‖a − b‖ | Euclidean distance; KNN, K-Means |
| unit vector = a ÷ ‖a‖ | normalize; then dot product = cosine |
| (m × n) · (n × p) → (m × p) | matrix multiplication shape rule |
| Cᵢⱼ = (row i of A) · (column j of B) | how each entry of A·B is computed |
| AB ≠ BA · (AB)C = A(BC) | not commutative · associative |
| (AB)ᵀ = BᵀAᵀ | transpose of a product |
| AI = IA = A | identity matrix |
| 2×2 inverse: 1/(ad − bc) × [[d, −b], [−c, a]] | det = ad − bc; det = 0 → no inverse |
| w = (XᵀX)⁻¹Xᵀy | normal equation of linear regression |
| y = Wx + b · batch: Y = XWᵀ + b | dense layer (PyTorch stores W as out × in) |
| params = n_in × n_out + n_out | dense layer parameter count |
| Av = λv | eigenvector v, eigenvalue λ |
| det(A − λI) = 0 | find eigenvalues |
| Σλ = trace · Πλ = det | quick checks |
| PCA: centre → covariance → eigen → sort → project | principal components = top eigenvectors of covariance |
| explained ratio = λᵢ ÷ Σλ | share of variance kept |

</div>

### Probability

<div class="formula">

| Formula | Meaning / where used |
|---|---|
| P(not A) = 1 − P(A) | complement; "at least one" = 1 − P(none) |
| P(A or B) = P(A) + P(B) − P(A and B) | addition rule |
| P(A \| B) = P(A and B) ÷ P(B) | conditional probability |
| independent: P(A and B) = P(A) P(B) | Naive Bayes assumption, i.i.d. data |
| P(A \| B) = P(B \| A) P(A) ÷ P(B) | Bayes' theorem: posterior = likelihood × prior ÷ evidence |
| P(B) = Σ P(B \| Aᵢ) P(Aᵢ) | law of total probability |
| E[X] = Σ x P(x) | expected value; die = 3.5 |
| E[aX + b] = aE[X] + b · E[X + Y] = E[X] + E[Y] | linearity of expectation |
| Var(X) = E[X²] − (E[X])² | variance of a random variable |
| Var(aX + b) = a² Var(X) | scaling a variable |
| softmax(zᵢ) = e^zᵢ ÷ Σ e^zⱼ | scores → probabilities; LLM next token |
| log(ab) = log a + log b | why we use log-probabilities |

</div>

### Statistics and distributions

<div class="formula">

| Formula | Meaning / where used |
|---|---|
| mean = Σxᵢ ÷ n | average; MSE is minimized by the mean |
| median = middle value | robust to outliers; MAE is minimized by the median |
| σ² = Σ(xᵢ − μ)² ÷ n · s² = Σ(xᵢ − x̄)² ÷ (n − 1) | population vs sample variance |
| z = (x − μ) ÷ σ | z-score; StandardScaler |
| Normal: 68% / 95% / 99.7% within 1 / 2 / 3 σ | 95% exactly at ±1.96σ |
| Bernoulli(p): mean p, var p(1 − p) | one yes/no trial |
| Binomial(n, p): P(k) = C(n, k) pᵏ (1 − p)ⁿ⁻ᵏ, mean np, var np(1 − p) | count of successes |
| Uniform(a, b): mean (a + b)/2, var (b − a)²/12 | random init, random search |
| SE of mean = σ ÷ √n | 4× data → half the error |
| CLT: sample means ≈ Normal(μ, σ²/n) | basis of z-tests and CIs |
| r = cov(x, y) ÷ (σₓ σᵧ) | Pearson correlation, −1 to 1, linear only |
| 95% CI = estimate ± 1.96 × SE | confidence interval |
| SE of proportion = √(p(1 − p) ÷ n) | conversion rates, accuracy |
| two-proportion z = (p_B − p_A) ÷ √(p(1 − p)(1/n_A + 1/n_B)) | A/B test, p = pooled rate |
| p-value = P(data this extreme \| H₀) | reject H₀ if p < α (often 0.05) |
| Type I = false positive (α) · Type II = false negative (β) · power = 1 − β | test errors |
| MLE: θ̂ = argmax Π P(xᵢ \| θ) = argmax Σ log P(xᵢ \| θ) | maximum likelihood |
| log loss = −[y log ŷ + (1 − y) log(1 − ŷ)] | binary cross-entropy = Bernoulli NLL |

</div>

### Calculus

<div class="formula">

| Formula | Meaning / where used |
|---|---|
| f′(x) ≈ (f(x + h) − f(x − h)) ÷ 2h | numerical derivative; gradient checking |
| d/dx xⁿ = n xⁿ⁻¹ | power rule |
| d/dx eˣ = eˣ · d/dx ln x = 1/x | exponential and log |
| (fg)′ = f′g + fg′ | product rule |
| d/dx f(g(x)) = f′(g(x)) · g′(x) | chain rule; backpropagation |
| σ(x) = 1/(1 + e⁻ˣ), σ′ = σ(1 − σ) ≤ 0.25 | sigmoid; vanishing gradients |
| ReLU′ = 1 if x > 0 else 0 | dying ReLU |
| ∇f = [∂f/∂x₁, …, ∂f/∂xₙ] | gradient points uphill |
| w ← w − η ∇L(w) | gradient descent update |
| MSE = (1/n) Σ (ŷᵢ − yᵢ)² | regression loss |
| ∂MSE/∂w = (2/n) Σ (ŷᵢ − yᵢ) xᵢ | gradient for ŷ = wx + b |
| ∂MSE/∂b = (2/n) Σ (ŷᵢ − yᵢ) | gradient for the bias |
| sigmoid + log loss: ∂L/∂z = ŷ − y | clean gradient for logistic regression |
| f′ = 0 and f″ > 0 → minimum | second derivative test |

</div>

## Interview questions

### Vectors and the dot product

**⭐ 1. What is a dot product and where is it used in ML?**
Multiply matching elements of two vectors and add: [1, 2, 3] · [4, 5, 6] = 4 + 10 + 18 = 32. It is how a neuron combines inputs (w · x + b), how linear regression predicts, how attention scores tokens (Q·Kᵀ), and how embeddings are compared in search.
*Follow-up the interviewer may ask:* "What does a negative dot product mean?" The vectors point in roughly opposite directions (angle more than 90°).

**⭐ 2. What is cosine similarity? Why use it for embeddings?**
It is a · b ÷ (‖a‖ ‖b‖), the cosine of the angle between two vectors, from −1 to 1. It ignores vector length and compares only direction, which is where meaning lives in text embeddings. For [3, 4] and [4, 3]: 24 ÷ 25 = 0.96.
*Follow-up:* "Dot product or cosine in a vector DB?" If embeddings are normalized, they rank the same and dot product is cheaper; check the embedding model's recommendation.

**3. Compute the L1 and L2 norms of [3, −4].**
L1 = |3| + |−4| = 7. L2 = √(9 + 16) = 5.

**4. What does it mean when two vectors are orthogonal?**
Their dot product is 0, so they are at 90°. In embeddings it means they share no direction; in PCA, the principal components are orthogonal, so the projected features are uncorrelated.

**5. Why do we normalize features before KNN or K-Means?**
These methods use distance. A feature with large values (salary in ₹) would dominate a feature with small values (age). Standard or min-max scaling makes each feature contribute fairly.

**6. How is squared Euclidean distance related to cosine similarity for unit vectors?**
‖a − b‖² = ‖a‖² + ‖b‖² − 2a·b = 2 − 2·cos_sim. So for normalized vectors, nearest by Euclidean distance is the same as most similar by cosine.

### Matrices

**⭐ 7. What is the shape rule for matrix multiplication? What is the output shape of (32, 784) @ (784, 128)?**
Inner dimensions must match: (m × n)·(n × p) = (m × p). So (32, 784) @ (784, 128) = (32, 128): a batch of 32 examples, each now with 128 features.

**8. Multiply [[1, 2], [3, 4]] by [[5, 6], [7, 8]].**
Row 1: 1×5 + 2×7 = 19, 1×6 + 2×8 = 22. Row 2: 3×5 + 4×7 = 43, 3×6 + 4×8 = 50. Answer [[19, 22], [43, 50]].

**9. Is matrix multiplication commutative?**
No, AB is generally not equal to BA, and often only one is defined. It is associative, (AB)C = A(BC), and the order of evaluation can change the cost a lot.

**⭐ 10. What does a fully connected layer compute? How many parameters does a 256 → 64 layer have?**
y = Wx + b, then usually an activation. Parameters: 256 × 64 = 16,384 weights plus 64 biases = 16,448.
*Follow-up:* "Why not stack linear layers without activations?" Because W₂(W₁x) = (W₂W₁)x is still one linear layer; activations add non-linearity.

**11. What is the difference between `*` and `@` in NumPy/PyTorch?**
`*` is element-wise multiplication (same shapes, or broadcastable). `@` is matrix multiplication (inner dimensions must match). Mixing them up can give silent wrong results.

**12. What is broadcasting? Give an example.**
NumPy stretches dimensions of size 1 (or missing on the left) to make shapes match, without copying memory. Example: (100, 5) data minus a (5,) mean vector subtracts the means from every row. Shapes are compared from the right.

**13. What is a matrix inverse and when does it not exist?**
A⁻¹ satisfies AA⁻¹ = I; it undoes A. It exists only for square matrices with determinant not equal to 0. A zero determinant means the matrix squashes space into a lower dimension, so the information cannot be recovered.

**14. Find the inverse of [[2, 1], [1, 1]].**
det = 2×1 − 1×1 = 1. Inverse = [[1, −1], [−1, 2]]. Check: row 1 [2, 1]·[1, −1] = 1 and [2, 1]·[−1, 2] = 0.

**15. What is the normal equation, and when would you avoid it?**
w = (XᵀX)⁻¹Xᵀy gives linear regression weights directly. Avoid it when there are many features (inverting a d × d matrix costs about d³), when data does not fit in memory, or when XᵀX is singular because of perfectly correlated features (use Ridge or gradient descent).

**16. What does Q·Kᵀ produce in attention, and why the transpose?**
Q and K hold one vector per token as rows. Transposing K lets every query row dot with every key row, giving a tokens × tokens matrix of attention scores. They are then scaled by √d and passed through softmax.

### Eigenvectors and PCA

**⭐ 17. Explain eigenvectors and eigenvalues in plain words.**
An eigenvector is a direction that a matrix only stretches, not rotates: Av = λv. The eigenvalue λ is the stretch factor. For [[2, 1], [1, 2]], the vector [1, 1] becomes [3, 3], so λ = 3.

**18. Find the eigenvalues of [[2, 1], [1, 2]].**
det(A − λI) = (2 − λ)² − 1 = 0, so 2 − λ = ±1, giving λ = 3 and λ = 1. Check: sum 4 = trace, product 3 = determinant.

**⭐ 19. Explain PCA step by step.**
Standardize the features, compute the covariance matrix, find its eigenvectors and eigenvalues, sort by eigenvalue (largest first), keep the top k eigenvectors, and project the centred data onto them. The eigenvalues are the variances along each component; their share is the explained variance ratio.
*Follow-up:* "How do you choose k?" Keep enough components to reach about 90–95% cumulative explained variance, or look for an elbow.

**20. Why must features be scaled before PCA?**
PCA maximizes variance, and variance depends on units. Unscaled, a feature measured in large numbers would dominate PC1 regardless of importance.

**21. Is PCA supervised? What is one risk of using it before a classifier?**
It is unsupervised: it ignores labels. A low-variance direction that PCA drops might be exactly the one that separates the classes.

**22. What is the link between PCA and SVD?**
For centred X = UΣVᵀ, the columns of V are the principal components and the covariance eigenvalues are σᵢ² ÷ (n − 1). Libraries use SVD because it is more numerically stable than forming XᵀX.

### Probability

**⭐ 23. A disease affects 1% of people. A test has 90% sensitivity and a 5% false positive rate. If you test positive, what is the chance you are sick?**
Imagine 10,000 people: 100 sick, 90 test positive; 9,900 healthy, 495 test positive. P(sick | +) = 90 ÷ 585 ≈ 15%. The low base rate means most positives are false.
*Follow-up:* "What if you test positive twice (independent tests)?" Use 0.154 as the new prior: 0.9 × 0.154 ÷ (0.9 × 0.154 + 0.05 × 0.846) ≈ 77%.

**24. What is conditional probability? Give an example.**
P(A | B) = P(A and B) ÷ P(B): the chance of A among only the cases where B happened. If 120 of 600 clothing orders are returned, P(returned | clothing) = 0.2.

**25. What is the difference between independent and mutually exclusive events?**
Independent: one does not change the probability of the other, P(A and B) = P(A)P(B). Mutually exclusive: they cannot both happen, P(A and B) = 0. Mutually exclusive events with non-zero probabilities are actually strongly dependent.

**⭐ 26. What is Bayes' theorem and where is it used in ML?**
P(A | B) = P(B | A) P(A) ÷ P(B); posterior = likelihood × prior ÷ evidence. It is the basis of Naive Bayes classifiers, Bayesian updating, and it explains why precision falls for rare classes even with good recall.

**27. Why is Naive Bayes "naive"?**
It assumes all features (for example words) are independent given the class, so it can just multiply their likelihoods. This is rarely true, but the classifier still works well for text, is fast, and needs little data.

**28. What is the expected value of a game: pay ₹20, win ₹100 with probability 0.15?**
Expected winnings 100 × 0.15 = ₹15; expected profit 15 − 20 = −₹5 per game.

**29. What is the probability of at least one six in 3 rolls of a die?**
1 − (5/6)³ = 1 − 125/216 = 91/216 ≈ 0.42.

**30. Why do ML systems use log-probabilities?**
Products of many small probabilities underflow to 0. Logs turn products into sums, which are stable, and since log is increasing, maximizing log-likelihood gives the same parameters. Losses like cross-entropy are negative log-likelihoods.

**31. What does softmax do? Compute softmax([2, 1, 0]).**
It converts scores into probabilities that add to 1: e^zᵢ ÷ Σe^zⱼ. e² ≈ 7.389, e¹ ≈ 2.718, e⁰ = 1, total ≈ 11.107, so ≈ [0.665, 0.245, 0.090].

### Statistics

**⭐ 32. Mean vs median: when do you use which?**
The mean uses every value but is pulled by outliers; the median is the middle value and is robust. Use the median for skewed data such as income, prices or latency. MSE loss is minimized by predicting the mean, MAE by the median.

**33. What is standard deviation? Compute it for [2, 4, 4, 4, 5, 5, 7, 9].**
The typical distance from the mean, the square root of the variance. Mean 5, squared deviations sum to 32, population variance 32 ÷ 8 = 4, so std = 2.

**34. Why divide by n − 1 for sample variance?**
Deviations are measured from the sample mean, which is fitted to the same data, so they are slightly too small. Dividing by n − 1 (Bessel's correction) gives an unbiased estimate of the population variance.

**⭐ 35. State the Central Limit Theorem and why it matters.**
Means of large enough samples are approximately normally distributed around the true mean with standard error σ/√n, whatever the original distribution. It justifies z-tests, confidence intervals, and A/B tests on averages and conversion rates.

**36. What is the 68-95-99.7 rule? A score is 2 standard deviations above the mean; roughly what percentile is it?**
For a normal distribution, about 68%, 95% and 99.7% of values lie within 1, 2 and 3 standard deviations of the mean. Two above the mean is about the top 2.3%, so roughly the 97.7th percentile.

**37. What is the difference between the binomial and the normal distribution?**
Binomial is discrete: the number of successes in n yes/no trials, with mean np and variance np(1 − p). Normal is continuous and bell-shaped. For large n, the binomial is approximately normal, which is why we can use z-tests for click counts.

**⭐ 38. What is a p-value? What is it NOT?**
It is the probability of seeing a result at least as extreme as yours if the null hypothesis were true. A small p-value means the data would be surprising under "no effect". It is not the probability that the null is true, and not the probability that your result is a fluke.

**39. Explain Type I and Type II errors with an example.**
Type I (false positive): concluding a new feature helps when it does not; its rate is α. Type II (false negative): missing a feature that really helps; its rate is β, and power = 1 − β. Bigger samples reduce Type II errors without raising α.

**⭐ 40. Walk me through an A/B test of a new checkout button.**
Define the primary metric (conversion rate) and guardrails (refunds, latency). Randomize by user into control and treatment, compute the needed sample size for the minimum effect worth detecting at 80% power, and run for full weeks without peeking. Then run a two-proportion z-test: for 200/2000 vs 250/2000, z ≈ 2.5, p ≈ 0.012, so the lift is significant at 5%. Report the confidence interval and check practical value.
*Follow-up:* "What if you test 20 metrics?" Expect about one false positive at α = 0.05; use a correction like Bonferroni or pre-register one primary metric.

**41. What is a confidence interval? Compute a 95% CI for a mean of 30 with std 8 and n = 100.**
A range built so that 95% of such ranges, over repeated studies, would contain the true value. SE = 8 ÷ √100 = 0.8; margin = 1.96 × 0.8 ≈ 1.57; CI ≈ (28.4, 31.6).

**⭐ 42. Correlation vs causation: give an example and how to establish causation.**
Ice-cream sales and drowning are correlated because hot weather causes both (a confounder). Correlation alone does not show that changing one changes the other. A randomized experiment such as an A/B test balances confounders, so a difference can be attributed to the treatment.

**43. Can correlation be 0 while variables are strongly related?**
Yes. Pearson's r only captures linear relationships; y = x² on a symmetric range has r = 0. Use scatter plots or non-linear measures (such as mutual information).

**⭐ 44. What is maximum likelihood estimation? How does it relate to loss functions?**
MLE picks parameters that make the observed data most probable; for 7 heads in 10 flips, p̂ = 0.7. Minimizing MSE is MLE when noise is normal, and minimizing cross-entropy is MLE for Bernoulli or categorical labels, including LLM next-token training.

### Calculus and optimization

**⭐ 45. What is a gradient? Compute ∇f for f(x, y) = x² + 3xy + y² at (1, 2).**
The vector of partial derivatives, pointing in the direction of steepest increase. ∂f/∂x = 2x + 3y = 8 and ∂f/∂y = 3x + 2y = 7, so ∇f = [8, 7].

**⭐ 46. Do two steps of gradient descent on f(x) = (x − 3)² starting at x = 0 with η = 0.1.**
f′(x) = 2(x − 3). Step 1: f′(0) = −6, x = 0 + 0.6 = 0.6. Step 2: f′(0.6) = −4.8, x = 0.6 + 0.48 = 1.08. It is moving towards the minimum at 3, with steps shrinking as the slope flattens.
*Follow-up:* "What happens with η = 1.1?" x jumps to 6.6, then −1.32, then 8.18: it overshoots and diverges.

**⭐ 47. Explain the chain rule and backpropagation with a tiny example.**
The chain rule says slopes multiply along a chain: dL/dw = dL/dŷ × dŷ/dw. For ŷ = wx + b with w = 3, b = 1, x = 2, y = 10, loss (ŷ − y)²: ŷ = 7, dL/dŷ = 2(7 − 10) = −6, dL/dw = −6 × 2 = −12, dL/db = −6. Backprop does this for every weight, layer by layer from the loss backwards.

**48. What is the derivative of the sigmoid, and why does it cause vanishing gradients?**
σ′(x) = σ(x)(1 − σ(x)), with a maximum of 0.25 at x = 0. Backprop multiplies these through layers, so 10 layers can shrink the gradient by up to 0.25¹⁰ ≈ 10⁻⁶. ReLU, residual connections, good initialization and normalization reduce the problem.

**49. What happens if the learning rate is too small or too large?**
Too small: very slow progress, may stall on plateaus. Too large: overshooting, oscillation, divergence, or NaN loss. Use learning-rate schedules, warmup, and adaptive optimizers like Adam; lower the rate first when the loss explodes.

**50. Batch vs mini-batch vs stochastic gradient descent?**
Batch uses all data per step (accurate, slow, memory-heavy). Stochastic uses one example (fast, very noisy). Mini-batch uses a small batch like 32–512 (good balance, fits GPUs); it is the default in deep learning, and its noise can help escape saddle points.

**51. Is the neural network loss convex? What are saddle points?**
No, it is non-convex. A saddle point has zero gradient but goes down in some directions and up in others; in high dimensions they are more common than bad local minima and they slow training. Linear and logistic regression losses are convex, with one global minimum.

**52. How would you check that a hand-written gradient is correct?**
Gradient checking: compare it with the numerical estimate (f(w + h) − f(w − h)) ÷ 2h for small h (like 1e-5) on a few weights. The relative difference should be tiny, around 1e-7 or smaller.

## Last-week checklist

- [ ] I can compute a dot product, cosine similarity and a 2×2 matrix product by hand.
- [ ] I can state the shape of any layer's output and count its parameters.
- [ ] I can explain eigenvectors with a picture and do PCA in five steps.
- [ ] I can solve a Bayes medical test question with the "10,000 people" method.
- [ ] I can explain p-value, confidence interval, Type I/II errors and an A/B test design.
- [ ] I can explain why MSE and cross-entropy come from maximum likelihood.
- [ ] I can do two gradient descent steps and one backprop step by hand.

**Next:** start the Machine Learning book with [What Is Machine Learning](/interview/ai-engineer/machine-learning/what-is-machine-learning), or go back to the [Math for Machine Learning](/interview/ai-engineer/math-for-ml) contents.
