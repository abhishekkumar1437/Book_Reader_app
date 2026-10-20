---
title: ML Interview Question Bank
part: Wrap-up
summary: 77 classical machine learning interview questions grouped by topic, with crisp model answers, likely follow-up questions, quick by-hand calculations and scenario questions; the most frequently asked are marked with a star.
---

This chapter collects the classical ML questions that come up again and again in AI engineer, ML engineer and data scientist interviews. Each answer is short enough to say out loud in under a minute. Questions marked ⭐ are the most frequently asked — make sure you can answer those without notes. Follow-ups show where the interviewer usually goes next.

> **In simple words:** Read a question, cover the answer, say your own answer out loud, then compare. If you cannot explain it simply, go back to the chapter linked in that section.

How to use this bank in the 150-day plan: on the revision days of Phase 3 (Days 35, 42 and 49), do the sections you have finished. In Phase 10 (Days 143–150), go through the whole bank twice — once reading, once in mock-interview style with a friend or a timer.

## The questions

### Fundamentals

Review: [What Is Machine Learning](/interview/ai-engineer/machine-learning/what-is-machine-learning).

**1. ⭐ What is the difference between supervised, unsupervised and reinforcement learning?**
Supervised learning learns from labelled examples to predict a label (price, spam). Unsupervised learning finds structure in unlabelled data (clusters, lower-dimensional representations). Reinforcement learning learns a policy of actions from rewards received over time (games, robotics, RLHF).
*Follow-up the interviewer may ask:* "Where does LLM pretraining fit?" — It is self-supervised: the next token is an automatically created label.

**2. ⭐ What is the difference between classification and regression?**
Regression predicts a continuous number such as price or delivery time. Classification predicts a category such as fraud or not fraud. Many classifiers output probabilities, but the final answer is still a class.

**3. What is the difference between parameters and hyperparameters?**
Parameters are learned from data during training — weights, split thresholds. Hyperparameters are chosen before training — learning rate, tree depth, k, regularization strength — and are tuned with validation data.

**4. ⭐ Why do we split data into train, validation and test sets?**
Training data teaches the model, validation data is used to compare models and tune hyperparameters, and the test set is used once at the end for an honest estimate of performance on new data. Using the same data for training and evaluation gives over-optimistic scores.
*Follow-up:* "What ratio?" — Commonly 60/20/20 or 70/15/15; with small data, use cross-validation instead of a fixed validation set.

**5. What is a baseline model and why build one?**
A deliberately simple model — predict the majority class, the mean, or a simple rule. It tells you whether the real model adds value. A 95% accurate model is worthless if the baseline is also 95%.

**6. Walk me through an end-to-end ML project.**
Define the problem and the success metric, gather data, explore it, clean and engineer features, split honestly, build a baseline, train and compare models with cross-validation, tune, evaluate once on the test set, deploy behind an API, and monitor for drift and retrain.

**7. What is the difference between a generative and a discriminative model?**
A discriminative model learns P(y ∣ x) or the decision boundary directly — logistic regression, SVM, trees. A generative model learns how the data is produced, P(x ∣ y) and P(y), and can use Bayes' theorem to classify — Naive Bayes, Gaussian mixtures; modern generative AI models also generate new samples.

**8. When would you not use machine learning?**
When a simple deterministic rule solves the problem exactly, when there is too little or no relevant data, when errors cannot be tolerated or checked, or when the cost of building and maintaining a model exceeds its benefit.

### Data preparation and feature engineering

Review: [Data Preparation and Feature Engineering](/interview/ai-engineer/machine-learning/data-preparation-and-feature-engineering).

**9. ⭐ How do you handle missing values?**
First understand why values are missing. Then drop rows if very few are missing at random, impute with median for skewed numeric data or the most frequent value for categories, add a missing-indicator column when missingness carries information, or use a model that handles NaN natively such as LightGBM. Fit the imputer on training data only.
*Follow-up:* "Mean or median?" — Median for skewed data or data with outliers, because the mean is pulled by extreme values.

**10. ⭐ What is data leakage? Give examples.**
Leakage is when information unavailable at prediction time is used in training, so offline scores are too good. Target leakage: a feature created after the outcome, like "collection calls made" for predicting default. Contamination: fitting a scaler, imputer or SMOTE on the full dataset before splitting, duplicates across train and test, or a random split on time-series data.
*Follow-up:* "How do you detect it?" — Suspiciously high scores, a single feature with huge importance, and asking for each feature "would I know this at prediction time?"

**11. ⭐ One-hot encoding vs label encoding vs target encoding?**
One-hot creates a 0/1 column per category and assumes no order — good for low-cardinality nominal features in linear models. Label/ordinal encoding uses one integer column and implies an order — good for ordered categories or tree models. Target encoding replaces a category with the mean target, which suits high-cardinality features but must be smoothed and cross-fitted to avoid leakage.

**12. ⭐ Which models need feature scaling and why?**
Models based on distances or dot products — KNN, K-Means, SVM, PCA — and models trained with gradient descent or with regularization — linear and logistic regression, neural networks. Tree-based models do not need scaling because splits depend only on the order of values.

**13. StandardScaler vs MinMaxScaler vs RobustScaler?**
StandardScaler centres to mean 0 and unit variance and is the usual default. MinMaxScaler maps to [0, 1], useful for bounded features, but a single outlier squeezes the rest. RobustScaler uses the median and IQR, so it is the choice when outliers are present.

**14. ⭐ How do you handle an imbalanced dataset?**
Use the right metrics (precision, recall, F1, PR-AUC), a stratified split, class weights, threshold tuning, and if needed resampling of the training data only — undersampling the majority or SMOTE for the minority. Collecting more minority examples is best if possible.
*Follow-up:* "Does SMOTE always help?" — No. With strong tree ensembles, class weights plus threshold tuning are often as good, and SMOTE can create unrealistic points in high dimensions.

**15. How do you detect and treat outliers?**
Detect with the IQR rule (outside Q1 − 1.5·IQR or Q3 + 1.5·IQR), z-scores, or plots. Then decide: fix or remove clear errors, cap extreme but real values, apply a log transform, use robust scaling or a robust loss, or use tree models. In fraud or anomaly detection, outliers are the signal, not noise.

**16. Give examples of good feature engineering for tabular data.**
Date parts and time-since features, ratios (spend per order), aggregates per entity over windows (orders in the last 30 days), counts and frequencies, log transforms of skewed values, interaction features, flags from domain knowledge, and embeddings of text fields. Every feature must be computable at prediction time.

### Linear and logistic regression

Review: [Linear Regression](/interview/ai-engineer/machine-learning/linear-regression) and [Logistic Regression](/interview/ai-engineer/machine-learning/logistic-regression).

**17. ⭐ Explain linear regression and how it is fitted.**
It predicts a number as a weighted sum of features plus an intercept. Ordinary least squares chooses the weights that minimise the sum of squared residuals, either with the closed-form normal equation θ = (XᵀX)⁻¹Xᵀy or iteratively with gradient descent.

**18. ⭐ What are the assumptions of linear regression?**
Linearity, independent errors, constant error variance (homoscedasticity), approximately normal residuals, and no strong multicollinearity. They matter most when interpreting coefficients and p-values; for pure prediction, mild violations are acceptable.

**19. What is R², and what is adjusted R²?**
R² = 1 − SSE/SST, the fraction of the target's variance explained compared to predicting the mean. Adjusted R² penalises the number of features, so adding a useless feature lowers it, while plain R² never decreases when features are added.
*Follow-up:* "Can R² be negative?" — Yes, on test data, when the model is worse than predicting the mean.

**20. What is multicollinearity and how do you handle it?**
Strong correlation between features, which makes coefficients unstable and hard to interpret, though predictions may still be fine. Detect it with correlation matrices or VIF; handle it by dropping or combining features, using PCA, or using Ridge regression.

**21. ⭐ Why is logistic regression a classifier if it has "regression" in its name?**
It regresses the log-odds of the positive class on the features, producing a continuous probability through the sigmoid. Applying a threshold to that probability turns it into a classifier.

**22. ⭐ How do you interpret a logistic regression coefficient?**
A one-unit increase in the feature changes the log-odds by the coefficient, so it multiplies the odds by e to the coefficient — the odds ratio — holding other features constant. A coefficient of 0.7 roughly doubles the odds.

**23. ⭐ Why use log loss instead of MSE for logistic regression?**
Log loss is the negative log-likelihood of a Bernoulli model, it is convex in the weights so the optimum is global, and it strongly penalises confident wrong predictions. MSE with a sigmoid is non-convex and gives tiny gradients when the model is confidently wrong.

**24. How does logistic regression handle multiclass problems?**
With one-vs-rest — one binary model per class, pick the highest score — or with multinomial softmax regression, which learns all class scores jointly and turns them into probabilities that sum to 1. scikit-learn's default solver uses the multinomial form.

**25. What happens to logistic regression on perfectly separable data?**
The likelihood keeps improving as the weights grow, so unregularized weights diverge to infinity and the solver fails to converge. Regularization keeps the weights finite and the probabilities sensible.

### Gradient descent and loss functions

Review: [Gradient Descent and Loss Functions](/interview/ai-engineer/machine-learning/gradient-descent-and-loss-functions).

**26. ⭐ Explain gradient descent.**
An iterative optimiser: compute the gradient of the loss with respect to the parameters, then move the parameters a small step — the learning rate times the gradient — in the opposite direction, and repeat until the loss stops decreasing.
*Follow-up:* "What if the learning rate is too large?" — The updates overshoot, the loss oscillates or diverges, often to NaN.

**27. ⭐ Batch vs stochastic vs mini-batch gradient descent?**
Batch uses all rows per step: exact but slow. Stochastic uses one row: fast but noisy. Mini-batch uses small random batches like 64 rows: a balance that uses hardware efficiently and whose noise can help generalisation; it is the deep learning default.

**28. MSE vs MAE vs Huber loss?**
MSE squares errors, punishing large errors heavily, and predicts the conditional mean. MAE weights all errors linearly, is robust to outliers, and predicts the conditional median. Huber is quadratic for small errors and linear for large ones, a compromise controlled by δ.

**29. What does it mean for a loss to be convex, and which models have convex losses?**
A convex loss has a single bowl shape, so every local minimum is the global minimum. Linear regression with MSE, logistic regression with log loss and linear SVMs with hinge loss are convex; neural networks are not.

**30. Why does feature scaling speed up gradient descent?**
Unscaled features make the loss surface a long, narrow valley, so the gradient zig-zags and requires a tiny learning rate. Scaling makes the surface rounder, so steps point toward the minimum and convergence is much faster.

### Decision trees and ensembles

Review: [Decision Trees](/interview/ai-engineer/machine-learning/decision-trees) and [Ensembles: Random Forest and Boosting](/interview/ai-engineer/machine-learning/ensembles-random-forest-and-boosting).

**31. ⭐ How does a decision tree choose a split?**
For every feature and candidate threshold, it computes the impurity of the resulting child nodes — Gini or entropy for classification, MSE for regression — and picks the split with the largest weighted impurity decrease. It repeats greedily in each child.
*Follow-up:* "Compute the Gini of a node with 6 positives and 4 negatives." — 1 − 0.36 − 0.16 = 0.48.

**32. Gini impurity vs entropy?**
Both measure node impurity and are zero for pure nodes. Gini = 1 − Σp², entropy = −Σp log₂p. They almost always choose the same splits; Gini is slightly cheaper to compute and is the scikit-learn default.

**33. ⭐ Why do decision trees overfit and how do you prevent it?**
An unrestricted tree keeps splitting until leaves are pure, memorising noise. Prevent it with max_depth, min_samples_leaf, max_leaf_nodes, min_impurity_decrease, cost-complexity pruning (ccp_alpha), or by using an ensemble.

**34. ⭐ What is the difference between bagging and boosting?**
Bagging trains many models independently on bootstrap samples and averages them, mainly reducing variance; it uses deep trees and is hard to overfit by adding trees. Boosting trains models sequentially, each correcting the current ensemble's errors, mainly reducing bias; it uses shallow trees and needs early stopping.
*Follow-up:* "Which can be parallelised?" — Bagging fully; boosting only within each tree's construction.

**35. ⭐ How does a random forest work, and why is it better than a single tree?**
It trains many deep trees on bootstrap samples and lets each split consider only a random subset of features, then averages the trees. The randomness decorrelates the trees, so averaging cancels much of their variance while keeping their low bias.

**36. What is the out-of-bag score?**
Each bootstrap sample leaves out about 36.8% of rows. Predicting each row with only the trees that did not see it gives a nearly free validation estimate.

**37. ⭐ Explain gradient boosting.**
Start with a constant prediction, compute the negative gradient of the loss for each row (the residuals for squared error), fit a small tree to them, add it scaled by a learning rate, and repeat. It is gradient descent in function space.
*Follow-up:* "How do learning rate and number of trees interact?" — Smaller learning rates need more trees but usually generalise better; tune them together with early stopping.

**38. XGBoost vs LightGBM vs CatBoost?**
All are optimised gradient boosting libraries with regularization, histogram-based split finding and native missing-value handling. LightGBM grows trees leaf-wise and is often fastest on large data; CatBoost handles categorical features best with ordered target statistics and needs little tuning; XGBoost is very mature and widely supported. Pick by validation score and speed.

**39. ⭐ Why do tree ensembles beat neural networks on tabular data?**
Tabular targets often depend on sharp thresholds and interactions that trees model directly, tables contain many uninformative features that trees ignore, columns lack the spatial or sequential structure neural networks exploit, and datasets are usually modest in size. Trees also need no scaling and train fast on CPUs.

**40. How are feature importances computed and what are their pitfalls?**
Impurity-based importance sums the impurity decrease from splits on each feature; it is computed on training data and biased toward high-cardinality features. Permutation importance measures the score drop when a feature is shuffled on validation data; correlated features share importance. SHAP values give per-prediction contributions.

### KNN, SVM and Naive Bayes

Review: [KNN, SVM and Naive Bayes](/interview/ai-engineer/machine-learning/knn-svm-and-naive-bayes).

**41. ⭐ How does KNN work, and how do you choose k?**
It stores the training data and predicts by majority vote (or average) of the k nearest training points. Choose k by cross-validation: small k overfits noise, large k oversmooths. Scale features first.

**42. What is the curse of dimensionality?**
In high dimensions data becomes sparse, neighbourhoods must cover most of each feature's range to contain any points, and distances between points become nearly equal. Distance-based methods lose meaning; dimensionality reduction and feature selection help.

**43. ⭐ Explain SVM in simple terms.**
SVM finds the boundary with the widest margin between classes. Only the points on the margin — the support vectors — define it. A soft margin allows some violations with a penalty controlled by C, and kernels allow non-linear boundaries.
*Follow-up:* "What is the margin width?" — 2/‖w‖, so maximising the margin is minimising ‖w‖².

**44. What is the kernel trick?**
The SVM only needs dot products between points. A kernel computes the dot product in a high-dimensional transformed space directly from the original vectors, so non-linear boundaries can be learned without ever constructing the transformed features. RBF and polynomial kernels are common.

**45. What do C and gamma control in an RBF SVM?**
C trades margin width against violations: large C fits the training data closely, small C gives a smoother boundary. Gamma controls how far each point's influence reaches: high gamma gives a wiggly boundary that overfits, low gamma a smoother one.

**46. ⭐ Why is Naive Bayes "naive", and why does it work well for text?**
It assumes features are conditionally independent given the class, which is rarely true. It still works for text because classification only needs the right class to score highest, it handles thousands of word features with little data, and it is extremely fast. Laplace smoothing prevents unseen words from zeroing out a class.

### Unsupervised learning

Review: [Clustering: K-Means and DBSCAN](/interview/ai-engineer/machine-learning/clustering-kmeans-and-dbscan) and [Dimensionality Reduction and PCA](/interview/ai-engineer/machine-learning/dimensionality-reduction-pca).

**47. ⭐ Explain the K-Means algorithm.**
Pick k, initialise centroids (k-means++), assign each point to the nearest centroid, move each centroid to the mean of its points, and repeat until assignments stop changing. It minimises within-cluster squared distances and finds a local optimum.

**48. ⭐ How do you choose the number of clusters?**
The elbow in the inertia-versus-k plot, the k with the highest silhouette score, other indices like Davies–Bouldin, stability across runs, and above all business usefulness.

**49. What are the limitations of K-Means?**
Must choose k, assumes round clusters of similar size, sensitive to scale, outliers and initialisation, works only with numeric features, and forces every point into a cluster.

**50. ⭐ K-Means vs DBSCAN?**
K-Means needs k and finds round clusters, scales to large data and can assign new points. DBSCAN needs eps and min_samples, finds clusters of any shape, does not need k, and labels sparse points as noise, but struggles with clusters of very different densities.

**51. ⭐ What does PCA do and why standardise first?**
PCA finds orthogonal directions of maximum variance and projects data onto the top few, giving fewer, uncorrelated features that keep most of the variance. Standardising first stops features with large units from dominating the components.
*Follow-up:* "How do you choose the number of components?" — Cumulative explained variance (for example 95%), a scree-plot elbow, or downstream cross-validated performance.

**52. PCA vs t-SNE vs UMAP?**
PCA is linear, deterministic, fast and can transform new data — good for preprocessing. t-SNE is non-linear and preserves local neighbourhoods for visualisation only; cluster distances and sizes in its plots are not meaningful. UMAP is also non-linear, faster, keeps more global structure and can transform new points.

### Evaluation metrics

Review: [Evaluation Metrics](/interview/ai-engineer/machine-learning/evaluation-metrics).

**53. ⭐ Why is accuracy misleading for imbalanced data?**
Predicting the majority class gives high accuracy while catching none of the rare class. With 1% fraud, "never fraud" is 99% accurate and useless. Report precision, recall, F1 or PR-AUC for the positive class and compare to the baseline.

**54. ⭐ Explain precision and recall, and when you would prioritise each.**
Precision is the fraction of predicted positives that are correct; recall is the fraction of actual positives that are found. Prioritise recall when missing a positive is costly (cancer screening, safety); prioritise precision when false alarms are costly (spam filtering, auto-blocking accounts).
*Follow-up:* "How do you trade them off?" — Move the classification threshold, and pick it using the precision-recall curve or a cost function on validation data.

**55. ⭐ What does ROC-AUC measure?**
The probability that a random positive example is scored higher than a random negative one, across all thresholds. 0.5 is random, 1.0 is perfect. It measures ranking quality, not performance at a specific threshold or calibration.

**56. ⭐ When is PR-AUC better than ROC-AUC?**
When the positive class is rare. False positive rate divides by the large number of negatives, so ROC-AUC can look excellent even with many false alarms; PR-AUC focuses on the positive class and its random baseline equals the positive rate.

**57. What is the F1 score and why the harmonic mean?**
F1 = 2PR/(P + R). The harmonic mean is dominated by the smaller of the two, so F1 is high only when both precision and recall are high. F-beta weights recall β times as much as precision.

**58. Macro vs micro vs weighted averaging?**
Macro averages per-class scores equally, so rare classes count fully. Weighted averages by class support, dominated by large classes. Micro pools all counts first; for single-label multiclass it equals accuracy.

**59. MAE vs RMSE vs MAPE?**
MAE is the average absolute error, robust and easy to explain. RMSE punishes large errors more and is always at least MAE. MAPE expresses error as a percentage, which business teams like, but it breaks for values near zero and is asymmetric.

**60. What is model calibration and how do you fix poor calibration?**
A calibrated model's predicted probabilities match observed frequencies — of cases scored 0.7, about 70% are positive. Check with a reliability diagram or Brier score, and fix with Platt scaling (sigmoid) or isotonic regression using CalibratedClassifierCV.

### Overfitting, regularization and cross-validation

Review: [Overfitting, Regularization and Cross-Validation](/interview/ai-engineer/machine-learning/overfitting-regularization-and-cross-validation).

**61. ⭐ Explain the bias-variance trade-off.**
Expected error equals bias squared plus variance plus irreducible noise. Simple models have high bias and low variance; complex models have low bias and high variance. We look for the complexity that minimises total error, using validation data, regularization and ensembles.
*Follow-up:* "Give an example of each." — Linear regression on curved data has high bias; an unpruned decision tree has high variance.

**62. ⭐ How do you detect and fix overfitting?**
Detect it by a large gap between training and validation scores, or with learning curves. Fix it with more data, simpler models, regularization, pruning or depth limits, early stopping, dropout or weight decay, feature selection, and bagging.

**63. ⭐ L1 vs L2 regularization?**
L2 (Ridge) adds the sum of squared weights and shrinks all weights smoothly; it handles correlated features well. L1 (Lasso) adds the sum of absolute weights and drives some weights exactly to zero, performing feature selection. ElasticNet combines both.
*Follow-up:* "Why does L1 give zeros?" — Its constraint region is a diamond with corners on the axes, where the loss contours usually touch; algebraically it subtracts a constant amount until a weight hits zero.

**64. In scikit-learn, what is the difference between alpha in Ridge and C in LogisticRegression?**
Alpha is the regularization strength, so larger alpha means stronger regularization. C is the inverse strength, so smaller C means stronger regularization.

**65. ⭐ What is k-fold cross-validation and why use it?**
Split the training data into k folds; train on k − 1 and validate on the remaining one, rotating k times, and average the scores. It uses all data for both training and validation, gives a more stable estimate than one split, and reports a standard deviation.

**66. When do you use stratified, group or time-series cross-validation?**
Stratified for classification to keep the class ratio in each fold. Group when multiple rows belong to one entity, so it never appears in both train and validation. Time-series split when data is time-ordered, so the model only trains on the past.

**67. What is nested cross-validation?**
An inner loop tunes hyperparameters and an outer loop evaluates the whole tuning procedure on unseen folds, giving an unbiased estimate when no separate test set exists.

### Pipelines, tuning and production

Review: [Pipelines and Hyperparameter Tuning](/interview/ai-engineer/machine-learning/pipelines-and-hyperparameter-tuning).

**68. ⭐ Why use a scikit-learn Pipeline?**
It fits every preprocessing step only on training data or training folds, preventing leakage; it guarantees identical transformations at prediction time; it lets you tune preprocessing and model together; and it can be saved and deployed as one object.

**69. ⭐ Grid search vs random search vs Bayesian optimisation?**
Grid search tries every combination and explodes with more parameters. Random search samples combinations from distributions and usually finds good settings faster for the same budget. Bayesian optimisation, for example Optuna's TPE, learns from previous trials and is best when each trial is expensive.

**70. How do you save and serve a trained model safely?**
Save the full fitted pipeline with joblib plus metadata (feature list, threshold, data version, metrics), pin library versions, load it once at API start-up, validate inputs against the training schema, and log inputs and predictions for monitoring. Never load pickled files from untrusted sources; ONNX or skops are safer alternatives.

**71. ⭐ Your model scored 95% offline but performs poorly in production. What could be wrong?**
Data leakage in the offline setup, training-serving skew (features computed differently in production), data or concept drift since training, a different population in production, a wrong threshold for the live class balance, or a bug in the input pipeline. I would compare live feature distributions with training distributions and replay production inputs through the offline code.

### Scenarios and quick calculations

**72. ⭐ Design a fraud detection model for UPI payments.**
Label source: confirmed fraud reports and chargebacks, accepting label delay. Features: amount relative to the user's history, velocity counts in the last minutes and hours, new device or payee flags, time of day, location changes, and payee risk via target encoding. Model: gradient boosting with class weights, a time-based split, PR-AUC and recall at a fixed precision as metrics, and a threshold chosen from fraud cost versus review cost. Serve with low latency, monitor drift and retrain frequently because fraud patterns change.
*Follow-up:* "How do you handle the label delay?" — Train only on data old enough for labels to have matured, and track early proxy signals.

**73. ⭐ Your churn dataset has 3% positives. Your model's accuracy is 97%. Is it good?**
Not necessarily — the "nobody churns" baseline is also 97%. I would check the confusion matrix, recall and precision for churners, and PR-AUC against the 0.03 baseline, then tune the threshold based on the cost of a retention offer versus a lost customer.

**74. Compute it: 1,000 emails, 100 spam. The filter flags 90, of which 80 are spam. What are precision, recall and F1?**
TP = 80, FP = 10, FN = 20. Precision = 80/90 ≈ 0.889, recall = 80/100 = 0.80, F1 = 2 × 0.889 × 0.8 ÷ 1.689 ≈ 0.842.

**75. Compute it: a node has 4 Yes and 4 No. A split gives children (3 Yes, 1 No) and (1 Yes, 3 No). What is the Gini decrease?**
Parent Gini = 0.5. Each child Gini = 1 − 0.5625 − 0.0625 = 0.375, weighted average 0.375. Decrease = 0.5 − 0.375 = 0.125.

**76. A stakeholder wants to know why the model rejected a loan. What do you do?**
For a linear model, show each feature's contribution (coefficient × value) relative to the average applicant. For tree ensembles, use SHAP values for that single prediction, presented as the top reasons in plain language. Also make sure the features are legally allowed and the explanation is consistent with policy; in regulated settings, a simpler, explainable model may be required.

**77. You have 200 labelled rows and 10,000 unlabelled rows. What can you do?**
Start with a simple, well-regularized model and cross-validation, since 200 rows overfit easily. Use pretrained embeddings or transfer learning for text or images, semi-supervised methods like self-training, active learning to label the most informative rows next, and unsupervised pretraining or clustering to understand the unlabelled data. Often the best investment is labelling more data.

## Rapid-fire round

Answer each in one line.

| Question | Answer |
|---|---|
| Algorithm with no training step? | KNN |
| Default split criterion in scikit-learn trees? | Gini |
| Fraction of rows a bootstrap sample misses? | About 36.8% (1/e) |
| What does the sigmoid output at z = 0? | 0.5 |
| Softmax of equal scores for 4 classes? | 0.25 each |
| Margin width of an SVM? | 2/‖w‖ |
| Which regularization gives sparse weights? | L1 (Lasso) |
| Smaller C in LogisticRegression means? | Stronger regularization |
| Random baseline of ROC-AUC? | 0.5 |
| Random baseline of PR-AUC? | The positive class rate |
| Which is always ≥ MAE? | RMSE |
| Models that do not need scaling? | Trees and tree ensembles |
| Clustering method that labels noise? | DBSCAN (label −1) |
| PCA eigenvalue means? | Variance along that component |
| Split for time-ordered data? | TimeSeriesSplit / train on past, test on future |
| What does `n_init` control in K-Means? | Number of restarts with different initial centroids |
| What does early stopping watch? | Validation score/loss |
| Cross-validation for many rows per customer? | GroupKFold |

## Final checklist before an interview

- [ ] I can explain every ⭐ question in under a minute without notes.
- [ ] I can compute Gini, entropy, information gain, precision, recall, F1 and AUC by hand.
- [ ] I can run one iteration of gradient descent and one of K-Means on tiny data.
- [ ] I can draw the sigmoid, an SVM margin, a ROC curve and the bias-variance curve.
- [ ] I can sketch a scikit-learn Pipeline with a ColumnTransformer from memory.
- [ ] I can tell a leakage story and a production-failure story from my own project.
- [ ] I can say which metric I would use for fraud, cancer screening, spam and demand forecasting, and why.

**Next:** [From Neuron to Neural Network](/interview/ai-engineer/deep-learning/from-neuron-to-neural-network)
