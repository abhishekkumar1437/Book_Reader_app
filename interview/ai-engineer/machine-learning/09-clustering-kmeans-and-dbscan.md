---
title: Clustering - K-Means and DBSCAN
part: Unsupervised Learning
summary: Grouping data without labels — K-Means run by hand for two iterations on six points, choosing k with the elbow method and silhouette score, DBSCAN with core, border and noise points, hierarchical clustering, and when to use which.
---

So far every algorithm had labels to learn from. Often you have none: a list of customers with no "segment" column, a pile of support tickets with no categories, a stream of transactions with no fraud tags. **Clustering** finds groups of similar items by itself. AI engineers use it for customer segmentation, grouping similar documents or embeddings, finding topics in chat logs, deduplicating near-identical items, and spotting unusual points (anomalies).

> **In simple words:** Clustering puts similar points in the same group and different points in different groups — without being told what the groups are. K-Means finds k round groups around centre points. DBSCAN finds dense regions of any shape and marks lonely points as noise.

## What clustering is (and is not)

**Clustering** is **unsupervised learning**: there is no label y, only features X. The algorithm decides which points are "similar", usually by distance. A group is called a **cluster**.

Because there are no labels, there is no single "correct" answer. Two reasonable people could group the same customers differently. You judge clusters by whether they are compact and well separated (internal metrics) and, more importantly, whether they are **useful** for the business ("these are price-sensitive weekend shoppers").

> **Real-life example:** A school gets 600 new students and no information about their interests. By watching who sits together at lunch, a teacher notices natural groups — cricket fans, music lovers, quiz kids. Nobody gave her the group names; she discovered them. That is clustering.

## K-Means

### The algorithm

**K-Means** splits the data into **k** clusters, where you choose k. Each cluster has a centre called a **centroid** (the mean of its points).

1. **Initialise**: pick k starting centroids (randomly, or with the smarter k-means++ method).
2. **Assign**: put each point in the cluster of its nearest centroid.
3. **Update**: move each centroid to the mean of the points assigned to it.
4. **Repeat** steps 2–3 until the assignments stop changing (**convergence**).

K-Means tries to minimise the **inertia**, also called **within-cluster sum of squares (WCSS)**:

<div class="formula">

| Formula | Meaning |
|---|---|
| inertia = Σ over clusters Σ over points in the cluster ‖x − centroid‖² | total squared distance from points to their own centroid |
| centroid = mean of the cluster's points | the update step |

</div>

### Worked example: two iterations by hand

Six customers, two features (both already scaled): visits per month and spend level.

| Point | x₁ | x₂ |
|---|---|---|
| P1 | 1 | 1 |
| P2 | 2 | 1 |
| P3 | 1 | 2 |
| P4 | 6 | 5 |
| P5 | 7 | 6 |
| P6 | 6 | 7 |

Use k = 2. To show that K-Means can recover from a poor start, we deliberately pick the starting centroids **c₁ = P1 = (1, 1)** and **c₂ = P2 = (2, 1)** — both in the same corner.

**Iteration 1 — assign.** Euclidean distance from each point to each centroid:

| Point | to c₁ (1, 1) | to c₂ (2, 1) | Cluster |
|---|---|---|---|
| P1 (1, 1) | 0 | 1 | 1 |
| P2 (2, 1) | 1 | 0 | 2 |
| P3 (1, 2) | √(0 + 1) = 1 | √(1 + 1) = 1.414 | 1 |
| P4 (6, 5) | √(25 + 16) = 6.403 | √(16 + 16) = 5.657 | 2 |
| P5 (7, 6) | √(36 + 25) = 7.810 | √(25 + 25) = 7.071 | 2 |
| P6 (6, 7) | √(25 + 36) = 7.810 | √(16 + 36) = 7.211 | 2 |

**Iteration 1 — update.**

- c₁ = mean of P1, P3 = ((1 + 1)/2, (1 + 2)/2) = **(1, 1.5)**
- c₂ = mean of P2, P4, P5, P6 = ((2 + 6 + 7 + 6)/4, (1 + 5 + 6 + 7)/4) = (21/4, 19/4) = **(5.25, 4.75)**

**Iteration 2 — assign** with the new centroids:

| Point | to c₁ (1, 1.5) | to c₂ (5.25, 4.75) | Cluster |
|---|---|---|---|
| P1 (1, 1) | 0.5 | √(18.06 + 14.06) = 5.668 | 1 |
| P2 (2, 1) | √(1 + 0.25) = 1.118 | √(10.56 + 14.06) = 4.962 | **1** (moved!) |
| P3 (1, 2) | 0.5 | √(18.06 + 7.56) = 5.062 | 1 |
| P4 (6, 5) | √(25 + 12.25) = 6.103 | √(0.5625 + 0.0625) = 0.791 | 2 |
| P5 (7, 6) | √(36 + 20.25) = 7.5 | √(3.06 + 1.56) = 2.151 | 2 |
| P6 (6, 7) | √(25 + 30.25) = 7.433 | √(0.5625 + 5.0625) = 2.372 | 2 |

P2 switched to cluster 1, because c₂ moved away towards the big group.

**Iteration 2 — update.**

- c₁ = mean of P1, P2, P3 = (4/3, 4/3) ≈ **(1.333, 1.333)**
- c₂ = mean of P4, P5, P6 = (19/3, 18/3) ≈ **(6.333, 6)**

**Iteration 3 — assign.** Every point stays in the same cluster (for example P2 is 0.745 from c₁ and 6.62 from c₂). Nothing changes, so the algorithm has **converged**.

**Inertia at the end:**

- Cluster 1: P1 → (1/3)² + (1/3)² = 2/9; P2 → (2/3)² + (1/3)² = 5/9; P3 → 5/9. Sum = 12/9 ≈ 1.333.
- Cluster 2: P4 → (1/3)² + 1² = 10/9; P5 → (2/3)² + 0² = 4/9; P6 → (1/3)² + 1² = 10/9. Sum = 24/9 ≈ 2.667.
- Total inertia = **4.0**.

<figure>
<svg viewBox="0 0 380 220" width="380" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="40" y1="200" x2="370" y2="200" />
<line x1="40" y1="200" x2="40" y2="20" />
<text x="360" y="215" fill="currentColor" stroke="none">x₁</text>
<text x="20" y="28" fill="currentColor" stroke="none">x₂</text>
<circle cx="100" cy="166" r="42" stroke-dasharray="4 3" />
<circle cx="293" cy="68" r="48" stroke-dasharray="4 3" />
<circle cx="80" cy="178" r="5" fill="currentColor" />
<circle cx="120" cy="178" r="5" fill="currentColor" />
<circle cx="80" cy="156" r="5" fill="currentColor" />
<rect x="275" y="85" width="10" height="10" fill="currentColor" />
<rect x="315" y="63" width="10" height="10" fill="currentColor" />
<rect x="275" y="41" width="10" height="10" fill="currentColor" />
<path d="M 87 165 L 99 177 M 99 165 L 87 177" stroke="var(--accent)" stroke-width="3" />
<path d="M 287 62 L 299 74 M 299 62 L 287 74" stroke="var(--accent)" stroke-width="3" />
<text x="150" y="160" fill="var(--accent)" stroke="none">c₁ = (1.33, 1.33)</text>
<text x="170" y="120" fill="var(--accent)" stroke="none">c₂ = (6.33, 6)</text>
<text x="70" y="195" fill="currentColor" stroke="none" font-size="11">P1</text>
<text x="124" y="195" fill="currentColor" stroke="none" font-size="11">P2</text>
<text x="60" y="152" fill="currentColor" stroke="none" font-size="11">P3</text>
</svg>
<figcaption>The final K-Means result on the six points: two compact clusters, each centroid (×) at the mean of its points.</figcaption>
</figure>

### Initialisation and k-means++

K-Means only finds a **local** minimum: different starting centroids can give different final clusters. Our bad start recovered, but on harder data it may not. Two fixes, both default in scikit-learn:

- **k-means++**: choose the first centroid at random, then choose each next centroid with probability proportional to its squared distance from the nearest existing centroid. Starting centroids end up spread out.
- **Multiple restarts** (`n_init`): run K-Means several times and keep the result with the lowest inertia. In scikit-learn 1.4+, `n_init="auto"` runs once when using k-means++.

### Choosing k: the elbow method

Inertia always decreases as k grows (with k = n every point is its own cluster and inertia is 0). So we cannot just pick the k with the lowest inertia. Instead, plot inertia against k and look for the **elbow** — the point where adding clusters stops helping much.

For our six points (best possible inertia for each k):

| k | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Inertia | 74.17 | 4.00 | 2.33 | 1.33 |

Going from 1 to 2 clusters removes 95% of the inertia; after that, gains are tiny. The elbow is at **k = 2**. On real data the elbow is often blurry, so also use the silhouette score.

### Choosing k: the silhouette score

For each point i:

- **a** = average distance from i to the other points **in its own cluster** (how tight its cluster is).
- **b** = average distance from i to the points in the **nearest other cluster** (how far the neighbours are).
- **silhouette** s = (b − a) ÷ max(a, b).

s is between −1 and 1. Near 1: the point is well inside its cluster. Near 0: on the border between two clusters. Negative: probably in the wrong cluster. The **silhouette score** of a clustering is the mean s over all points.

Worked example for P1 (1, 1) in the final clustering:

- a = mean distance to P2 and P3 = (1 + 1) ÷ 2 = **1**
- b = mean distance to P4, P5, P6 = (6.403 + 7.810 + 7.810) ÷ 3 = 22.023 ÷ 3 = **7.341**
- s = (7.341 − 1) ÷ 7.341 = **0.864**

The average over all six points is about **0.80** — a clear, well-separated clustering. Choose the k with the highest average silhouette (and that makes business sense).

### Limitations of K-Means

| Limitation | Why | What to do |
|---|---|---|
| You must choose k | It is an input | Elbow, silhouette, business needs |
| Assumes round (spherical), similar-size clusters | It uses distance to a centre | DBSCAN, Gaussian mixture models |
| Sensitive to scale | Distance-based | Standardise features first |
| Sensitive to outliers | Means are pulled by extreme points | Remove outliers, use K-Medoids or DBSCAN |
| Only numeric features | Needs a mean | One-hot encode, or K-Prototypes / K-Modes |
| Local minimum | Depends on initialisation | k-means++ and several restarts |

> **Common mistake:** Running K-Means on raw features like "age" (20–60) and "annual income" (₹2–50 lakh, stored in rupees). The clusters will be formed almost entirely by income. Always scale first.

### K-Means in scikit-learn

```python
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

P = np.array([[1, 1], [2, 1], [1, 2], [6, 5], [7, 6], [6, 7]])

km = KMeans(n_clusters=2, init="k-means++", n_init="auto", random_state=0).fit(P)
print(km.labels_)                      # cluster index of each point (0/1 order may be swapped)
print(km.cluster_centers_.round(3))
print(km.inertia_)
print(round(silhouette_score(P, km.labels_), 3))
print(km.predict([[2, 2], [6, 6]]))    # assign new points to the nearest centroid

# Elbow + silhouette on a range of k
for k in range(2, 5):
    m = KMeans(n_clusters=k, n_init=10, random_state=0).fit(P)
    print(k, round(m.inertia_, 3), round(silhouette_score(P, m.labels_), 3))
```

```text
[1 1 1 0 0 0]        (or [0 0 0 1 1 1])
[[6.333 6.   ]
 [1.333 1.333]]
4.0
0.799
[1 0]
2 4.0 0.799
3 2.333 ...
4 1.333 ...
```

For real data, put `StandardScaler` before `KMeans` in a pipeline. For millions of points, `MiniBatchKMeans` is much faster.

## DBSCAN

### The idea: clusters are dense regions

**DBSCAN** (Density-Based Spatial Clustering of Applications with Noise) defines a cluster as a region where points are packed closely together. Points in sparse regions are labelled **noise** (outliers). You do not choose the number of clusters; you choose what "dense" means with two parameters:

- **eps (ε)**: the neighbourhood radius.
- **min_samples**: how many points (including the point itself, in scikit-learn) must be within ε for a point to be a **core point**.

Every point is one of three types:

| Type | Rule |
|---|---|
| **Core point** | Has at least min_samples points within ε (counting itself) |
| **Border point** | Not core, but within ε of a core point |
| **Noise point** | Neither core nor border; label −1 |

Clusters grow by connecting core points that are within ε of each other, plus their border points.

### Worked example

Points on a number line: 1, 2, 3, 4, 10, 11, 12, 25. Use ε = 1.5 and min_samples = 3.

| Point | Neighbours within 1.5 (including itself) | Count | Type |
|---|---|---|---|
| 1 | 1, 2 | 2 | Border (near core 2) |
| 2 | 1, 2, 3 | 3 | **Core** |
| 3 | 2, 3, 4 | 3 | **Core** |
| 4 | 3, 4 | 2 | Border (near core 3) |
| 10 | 10, 11 | 2 | Border (near core 11) |
| 11 | 10, 11, 12 | 3 | **Core** |
| 12 | 11, 12 | 2 | Border (near core 11) |
| 25 | 25 | 1 | **Noise** |

Core points 2 and 3 are within ε of each other, so they form one cluster with their borders: **{1, 2, 3, 4}**. Core point 11 forms the second cluster: **{10, 11, 12}**. Point 25 is noise. DBSCAN found 2 clusters and 1 outlier without being told k.

### Choosing eps

A common method is the **k-distance plot**: for each point, compute the distance to its k-th nearest neighbour (k = min_samples), sort these distances, and plot them. The "knee" of the curve, where distances suddenly jump, is a good ε. A rule of thumb for min_samples is at least (number of features + 1), often 2 × the number of features.

```python
import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.datasets import make_moons
from sklearn.preprocessing import StandardScaler

x = np.array([1, 2, 3, 4, 10, 11, 12, 25]).reshape(-1, 1)
db = DBSCAN(eps=1.5, min_samples=3).fit(x)
print(db.labels_)                        # -1 means noise
print(db.core_sample_indices_)           # indices of core points

# Two interleaving half-moons: K-Means fails, DBSCAN succeeds
X, _ = make_moons(n_samples=300, noise=0.05, random_state=0)
X = StandardScaler().fit_transform(X)
labels = DBSCAN(eps=0.3, min_samples=5).fit_predict(X)
print(set(labels))                       # typically {0, 1}, possibly with -1 for a few noise points
```

```text
[ 0  0  0  0  1  1  1 -1]
[1 2 5]
{0, 1}
```

### DBSCAN vs K-Means

| | K-Means | DBSCAN |
|---|---|---|
| Need to choose | k | eps, min_samples |
| Cluster shape | Round, similar size | Any shape |
| Outliers | Forced into a cluster | Labelled as noise (−1) |
| Varying densities | OK-ish | Struggles (one eps for all) |
| Scales to big data | Very well (MiniBatchKMeans) | Moderately (needs neighbour search) |
| Predict new points | Yes (`predict`) | No built-in `predict` |
| Typical use | Customer segments, vector quantisation | Geographic hotspots, anomaly detection, odd shapes |

**HDBSCAN** (in scikit-learn 1.3+ as `sklearn.cluster.HDBSCAN`) extends DBSCAN to handle clusters of different densities and removes the need to pick ε. It is popular for clustering text embeddings (topic modelling tools like BERTopic use it).

## Hierarchical clustering

**Hierarchical clustering** builds a tree of clusters. The common bottom-up version is **agglomerative clustering**:

1. Start with every point as its own cluster.
2. Merge the two closest clusters.
3. Repeat until one cluster remains.

The merge history is drawn as a tree called a **dendrogram**. Cutting the dendrogram at a chosen height gives any number of clusters, so you can see the structure before choosing k.

How to measure the distance between two clusters is called the **linkage**:

| Linkage | Distance between clusters | Effect |
|---|---|---|
| Single | Closest pair of points | Long, chain-like clusters |
| Complete | Farthest pair of points | Compact clusters |
| Average | Average of all pairs | In between |
| Ward | Increase in total within-cluster variance | Compact, similar-size clusters; the scikit-learn default |

Worked example, single linkage, 1-D points 1, 2, 6, 7, 15:

1. Closest pairs: (1, 2) at distance 1 and (6, 7) at distance 1. Merge both → {1, 2}, {6, 7}, {15}.
2. Distance {1, 2} to {6, 7} = 6 − 2 = 4. Distance {6, 7} to {15} = 15 − 7 = 8. Merge at 4 → {1, 2, 6, 7}, {15}.
3. Merge the last two at distance 8.

<figure>
<svg viewBox="0 0 300 180" width="300" height="180" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="40" y1="160" x2="40" y2="145" /><line x1="80" y1="160" x2="80" y2="145" /><line x1="40" y1="145" x2="80" y2="145" />
<line x1="140" y1="160" x2="140" y2="145" /><line x1="180" y1="160" x2="180" y2="145" /><line x1="140" y1="145" x2="180" y2="145" />
<line x1="60" y1="145" x2="60" y2="100" /><line x1="160" y1="145" x2="160" y2="100" /><line x1="60" y1="100" x2="160" y2="100" />
<line x1="110" y1="100" x2="110" y2="40" /><line x1="250" y1="160" x2="250" y2="40" /><line x1="110" y1="40" x2="250" y2="40" />
<line x1="20" y1="120" x2="280" y2="120" stroke="var(--accent)" stroke-dasharray="5 4" />
<text x="40" y="175" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<text x="80" y="175" text-anchor="middle" fill="currentColor" stroke="none">2</text>
<text x="140" y="175" text-anchor="middle" fill="currentColor" stroke="none">6</text>
<text x="180" y="175" text-anchor="middle" fill="currentColor" stroke="none">7</text>
<text x="250" y="175" text-anchor="middle" fill="currentColor" stroke="none">15</text>
<text x="190" y="95" fill="currentColor" stroke="none">merge at 4</text>
<text x="180" y="35" fill="currentColor" stroke="none">merge at 8</text>
<text x="200" y="135" fill="var(--accent)" stroke="none">cut → 3 clusters</text>
</svg>
<figcaption>A dendrogram of the five points: cutting at the dashed height gives the three clusters {1, 2}, {6, 7} and {15}.</figcaption>
</figure>

Agglomerative clustering costs at least O(n²) memory for the distance matrix, so it suits up to tens of thousands of points.

```python
from sklearn.cluster import AgglomerativeClustering
import numpy as np

x = np.array([1, 2, 6, 7, 15]).reshape(-1, 1)
agg = AgglomerativeClustering(n_clusters=3, linkage="single").fit(x)
print(agg.labels_)        # e.g. [1 1 0 0 2]; numbering may differ

# For a dendrogram plot: from scipy.cluster.hierarchy import linkage, dendrogram
```

## Which clustering algorithm when?

| Situation | Choose |
|---|---|
| Large data, roughly round clusters, k known or easy to guess | K-Means / MiniBatchKMeans |
| Odd shapes, outliers to flag, k unknown | DBSCAN or HDBSCAN |
| Want to see structure at all levels, small data | Agglomerative + dendrogram |
| Overlapping clusters, want probabilities of membership | Gaussian mixture model (`GaussianMixture`) |
| Clustering text or image embeddings | K-Means for fixed topics; HDBSCAN for natural groups (often after UMAP) |

### Evaluating clusters

| Metric | Needs true labels? | Meaning |
|---|---|---|
| Inertia | No | Total squared distance to centroids (lower = tighter; always falls with k) |
| Silhouette score | No | Tightness vs separation, −1 to 1 (higher is better) |
| Davies–Bouldin index | No | Average similarity between each cluster and its most similar one (lower is better) |
| Calinski–Harabasz index | No | Between-cluster vs within-cluster dispersion (higher is better) |
| Adjusted Rand index (ARI) | Yes | Agreement with known labels, corrected for chance |

In practice the final test is human: look at examples from each cluster and ask whether the groups are meaningful and actionable.

> **Interview tip:** For a "segment our customers" question, say: engineer behavioural features (recency, frequency, monetary value — **RFM**), scale them, try K-Means for several k, check elbow and silhouette, then profile each cluster (average spend, visits) and give each a business name. Mention DBSCAN if outliers or odd shapes are expected.

## Key terms

| Term | Simple meaning |
|---|---|
| Clustering | Grouping similar points without labels |
| Cluster | A group of similar points |
| K-Means | Clustering into k groups around mean centres |
| Centroid | The mean (centre) of a cluster's points |
| Inertia / WCSS | Total squared distance from points to their centroid |
| Convergence | Assignments stop changing |
| k-means++ | Smart initialisation that spreads starting centroids out |
| Elbow method | Pick k where the inertia curve bends |
| Silhouette score | (b − a)/max(a, b), averaged over points; −1 to 1 |
| DBSCAN | Density-based clustering that labels sparse points as noise |
| eps (ε) | Neighbourhood radius in DBSCAN |
| min_samples | Points needed within ε to be a core point |
| Core / border / noise point | Dense centre / edge of a cluster / outlier |
| HDBSCAN | DBSCAN variant that handles different densities |
| Hierarchical / agglomerative clustering | Repeatedly merge the closest clusters |
| Dendrogram | Tree diagram of the merge history |
| Linkage | How distance between clusters is measured (single, complete, average, Ward) |
| Gaussian mixture model | Soft clustering with probability of membership |
| RFM | Recency, frequency, monetary value — classic customer features |

## Interview questions

**Explain the K-Means algorithm.**
Choose k, initialise k centroids (k-means++), assign each point to its nearest centroid, move each centroid to the mean of its assigned points, and repeat until assignments stop changing. It minimises the within-cluster sum of squared distances.

**How do you choose k in K-Means?**
Plot inertia against k and look for the elbow; compute the silhouette score for each k and prefer higher values; and use domain knowledge — sometimes the business needs exactly 4 segments. Gap statistic and Davies–Bouldin are alternatives.

**Is K-Means guaranteed to find the best clustering?**
No. It always converges, because inertia never increases, but only to a local minimum that depends on the initial centroids. k-means++ initialisation and multiple restarts (n_init) reduce the risk.

**What are the main limitations of K-Means?**
You must choose k; it assumes roughly spherical clusters of similar size; it is sensitive to feature scale and outliers; it needs numeric data; and it forces every point into a cluster, even outliers.

**How does DBSCAN work?**
A point is a core point if at least min_samples points lie within distance eps. Core points that are within eps of each other are connected into clusters, along with border points near them. Points that are not reachable from any core point are noise.

**When would you prefer DBSCAN over K-Means?**
When clusters have irregular shapes, when the number of clusters is unknown, or when I want outliers identified instead of forced into a cluster — for example GPS hotspots or anomaly detection. K-Means is better for large data with round clusters and when I need to assign new points quickly.

**What is the silhouette score?**
For each point, a is the average distance to its own cluster and b is the average distance to the nearest other cluster; s = (b − a)/max(a, b). Values near 1 mean well clustered, near 0 mean on a boundary, negative mean probably misassigned. The mean over points scores the whole clustering.

**Why does feature scaling matter for clustering?**
Clustering uses distances, so features with large numeric ranges dominate. Without scaling, a clustering of age and income in rupees is effectively a clustering on income alone.

**What is the difference between single, complete and Ward linkage?**
Single uses the closest pair of points between clusters and tends to create chains; complete uses the farthest pair and creates compact clusters; Ward merges the pair that least increases total within-cluster variance and gives compact, similar-size clusters.

**How would you cluster 1 million product descriptions?**
Turn each description into an embedding with a sentence-embedding model, optionally reduce dimensions with PCA or UMAP, then run MiniBatchKMeans for a fixed number of groups or HDBSCAN to discover natural groups. Inspect samples per cluster and label them, possibly with an LLM summarising each cluster.

**How do you evaluate clustering without labels?**
With internal metrics — silhouette, Davies–Bouldin, Calinski–Harabasz — plus stability checks (do clusters stay similar across subsamples or random seeds?) and, most importantly, human review of whether clusters are meaningful and useful.

## Try it yourself

1. **K-Means by hand.** 1-D points 2, 4, 5, 10, 12, 13. k = 2, starting centroids 2 and 4. Run until convergence and give the final centroids and inertia.
   *Hint: assign each point to the nearer centroid, then take means.*
2. **Silhouette.** For the final clustering in exercise 1, compute the silhouette of the point 5.
   *Hint: a uses 2 and 4; b uses 10, 12, 13.*
3. **DBSCAN.** Points 0, 1, 2, 6, 7, 8, 9, 20 with ε = 1 and min_samples = 2. Label each point core, border or noise and list the clusters.
   *Hint: count neighbours within distance 1, including the point itself.*
4. **Code.** Use `make_blobs(n_samples=500, centers=4, random_state=1)`. Plot inertia and silhouette for k = 2…8. Which k do they suggest?
   *Hint: `from sklearn.datasets import make_blobs`.*

### Answers

1. Iteration 1: 2 → c=2; 4, 5, 10, 12, 13 → c=4 (nearer to 4). New centroids: 2 and (4 + 5 + 10 + 12 + 13)/5 = 8.8. Iteration 2: 2, 4, 5 → 2 (5 is 3 from 2, 3.8 from 8.8); 10, 12, 13 → 8.8. New centroids: 11/3 ≈ 3.667 and 35/3 ≈ 11.667. Iteration 3: no change. Inertia: (1.667² + 0.333² + 1.333²) + (1.667² + 0.333² + 1.333²) = 4.667 + 4.667 = 9.333.
2. a = (abs(5 − 2) + abs(5 − 4)) ÷ 2 = 2. b = (5 + 7 + 8) ÷ 3 = 6.667. s = (6.667 − 2) ÷ 6.667 = 0.70.
3. Neighbour counts (within 1, including itself): 0 → {0, 1} = 2 core; 1 → 3 core; 2 → 2 core; 6 → 2 core; 7 → 3 core; 8 → 3 core; 9 → 2 core; 20 → 1 noise. Clusters: {0, 1, 2} and {6, 7, 8, 9}; 20 is noise. (With min_samples = 2, every point with any neighbour is core.)
4. Both the elbow and the highest silhouette usually point to k = 4, matching the 4 generated centres.

**Next:** [Dimensionality Reduction and PCA](/interview/ai-engineer/machine-learning/dimensionality-reduction-pca)
