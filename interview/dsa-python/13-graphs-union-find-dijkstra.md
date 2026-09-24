---
title: Graphs II — Union-Find, Dijkstra & MST
part: Core Patterns
summary: Dynamic connectivity in near-constant time, shortest paths when edges have weights, and connecting everything at minimum cost.
---

## Why interviewers love this pattern

The previous chapter handles graphs where every edge counts as one step. This chapter handles the two natural extensions: **connectivity that changes as edges are added** (union-find), and **edges with different costs** (Dijkstra for shortest path, Kruskal and Prim for minimum spanning tree). These are the algorithms interviewers use to separate "knows BFS" from "knows graphs".

Recognise them when you read:

- "add edges one by one, and after each, report..." or "are these two connected?" (union-find);
- "accounts that share an email belong to the same person", "friend circles", "redundant connection" (union-find);
- "minimum cost / time / effort to get from A to B" with per-edge costs (Dijkstra);
- "minimum cost to connect all points / cities" (MST);
- "network delay", "cheapest flights with at most k stops" (Dijkstra or a bounded Bellman-Ford).

## Union-Find (Disjoint Set Union)

Maintains a partition of elements into groups. Two operations:

- `find(x)`: which group is `x` in? Returns a representative (the root).
- `union(a, b)`: merge the groups of `a` and `b`.

With two optimisations, **path compression** (point every node on the way to the root directly at the root) and **union by rank or size** (attach the smaller tree under the larger), both operations are effectively O(1) amortised; formally O(α(n)), where α is the inverse Ackermann function, which is at most 4 for any realistic input.

```python
class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.size = [1] * n
        self.components = n

    def find(self, x: int) -> int:
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # path halving
            x = self.parent[x]
        return x

    def union(self, a: int, b: int) -> bool:
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                                   # already connected
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra                               # smaller under larger
        self.size[ra] += self.size[rb]
        self.components -= 1
        return True

    def connected(self, a: int, b: int) -> bool:
        return self.find(a) == self.find(b)
```

The `union` return value is the key detail: `False` means the edge connected two nodes that were already connected, which is exactly what "this edge creates a cycle" means.

Write this class from memory. It is under twenty lines and appears in a whole family of questions.

## Worked problem 1: Number of connected components

**Problem.** `n` nodes, an edge list. How many components?

```python
def count_components(n: int, edges: list[list[int]]) -> int:
    uf = UnionFind(n)
    for a, b in edges:
        uf.union(a, b)
    return uf.components
```

BFS/DFS also works; union-find is shorter and handles "edges arrive over time" for free.

## Worked problem 2: Redundant connection

**Problem.** A tree with one extra edge added. Return the edge that, if removed, leaves a tree (the last one in the input if several qualify).

**Approach.** Process edges in order; the first edge whose endpoints are already connected is the answer.

```python
def find_redundant_connection(edges: list[list[int]]) -> list[int]:
    uf = UnionFind(len(edges) + 1)           # nodes are 1-indexed
    for a, b in edges:
        if not uf.union(a, b):
            return [a, b]
    return []
```

*Graph Valid Tree* is the same idea: valid if every union succeeds and the result has one component.

## Worked problem 3: Accounts merge

**Problem.** Each account is `[name, email1, email2, ...]`. Accounts with a shared email belong to the same person. Merge them.

**Approach.** Union account indices that share an email (map email → first account index seen). Then group emails by root.

```python
from collections import defaultdict

def accounts_merge(accounts: list[list[str]]) -> list[list[str]]:
    uf = UnionFind(len(accounts))
    owner = {}                                       # email -> account index
    for i, (_, *emails) in enumerate(accounts):
        for email in emails:
            if email in owner:
                uf.union(i, owner[email])
            else:
                owner[email] = i

    groups = defaultdict(list)
    for email, i in owner.items():
        groups[uf.find(i)].append(email)

    return [[accounts[root][0]] + sorted(emails) for root, emails in groups.items()]
```

Sibling problems: *Number of Provinces* (union over an adjacency matrix), *Smallest String With Swaps* (union swappable indices, sort within groups), *Satisfiability of Equality Equations*, *Most Stones Removed with Same Row or Column*.

## Dijkstra: shortest paths with non-negative weights

BFS finds shortest paths when every edge costs 1. When edges have different non-negative costs, replace the queue with a **min-heap keyed by distance so far**. Always expand the closest unfinished node; the first time you pop a node, its distance is final.

```python
import heapq

def dijkstra(graph: dict[int, list[tuple[int, int]]], source: int, n: int) -> list[float]:
    """graph[u] = [(v, weight), ...]. Returns dist[] from source; inf if unreachable."""
    dist = [float("inf")] * n
    dist[source] = 0
    heap = [(0, source)]
    while heap:
        d, node = heapq.heappop(heap)
        if d > dist[node]:
            continue                                   # stale entry: a shorter path was found already
        for nxt, w in graph[node]:
            nd = d + w
            if nd < dist[nxt]:
                dist[nxt] = nd
                heapq.heappush(heap, (nd, nxt))
    return dist
```

Two details to say out loud:

- **Stale entries.** You cannot update a value inside the heap, so you push a new one and skip the old one when it surfaces (`if d > dist[node]: continue`). This is lazy deletion.
- **Non-negative weights only.** With negative edges the "first pop is final" guarantee breaks. Use Bellman-Ford (O(V·E)) for that case; it is rarely asked, but know the name.

Complexity: O((V + E) log V) with a binary heap.

## Worked problem 4: Network delay time

**Problem.** `times[i] = [u, v, w]`: a signal takes `w` to go from `u` to `v`. From node `k`, how long until all nodes receive the signal? −1 if impossible.

```python
def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    graph = defaultdict(list)
    for u, v, w in times:
        graph[u].append((v, w))
    dist = dijkstra(graph, k, n + 1)                   # nodes 1..n
    longest = max(dist[1:])
    return -1 if longest == float("inf") else longest
```

## Worked problem 5: Path with minimum effort

**Problem.** Grid of heights. A path's effort is the maximum absolute height difference between consecutive cells. Minimise the effort from top-left to bottom-right.

**Approach.** Dijkstra where the "distance" of a path is its maximum edge, not its sum. The relaxation becomes `max(effort_so_far, |diff|)`. Everything else is unchanged. This "minimax path" variant is a common twist.

```python
def minimum_effort_path(heights: list[list[int]]) -> int:
    rows, cols = len(heights), len(heights[0])
    effort = [[float("inf")] * cols for _ in range(rows)]
    effort[0][0] = 0
    heap = [(0, 0, 0)]
    while heap:
        e, r, c = heapq.heappop(heap)
        if (r, c) == (rows - 1, cols - 1):
            return e
        if e > effort[r][c]:
            continue
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                ne = max(e, abs(heights[nr][nc] - heights[r][c]))
                if ne < effort[nr][nc]:
                    effort[nr][nc] = ne
                    heapq.heappush(heap, (ne, nr, nc))
    return 0
```

Returning as soon as the target is popped is valid in Dijkstra: the popped distance is final. The alternative solution, binary search on the effort plus BFS, is also accepted and worth mentioning.

## Worked problem 6: Cheapest flights within k stops

**Problem.** Flights `[from, to, price]`. Cheapest price from `src` to `dst` with at most `k` stops.

**Why plain Dijkstra fails.** The stop limit means a more expensive path with fewer stops may be needed later. The state must include the number of stops.

**Approach: Bellman-Ford limited to k+1 rounds.** Each round relaxes every edge once using the *previous* round's distances (so one round adds exactly one edge to any path).

```python
def find_cheapest_price(n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
    dist = [float("inf")] * n
    dist[src] = 0
    for _ in range(k + 1):
        prev = dist[:]                                      # snapshot: relax from last round only
        for u, v, price in flights:
            if prev[u] + price < dist[v]:
                dist[v] = prev[u] + price
    return -1 if dist[dst] == float("inf") else dist[dst]
```

O(k · E). The `prev` snapshot is the whole trick; without it, a single round can chain many edges and violate the stop limit.

## Minimum spanning tree

Given a connected weighted undirected graph, an MST is a subset of edges connecting all nodes with minimum total weight. Two algorithms, both greedy.

**Kruskal.** Sort edges by weight, add each edge if it joins two different components (union-find). O(E log E).

```python
def kruskal(n: int, edges: list[tuple[int, int, int]]) -> int:
    """edges: (weight, u, v). Returns total MST weight, or -1 if disconnected."""
    uf = UnionFind(n)
    total = 0
    for w, u, v in sorted(edges):
        if uf.union(u, v):
            total += w
            if uf.components == 1:
                break
    return total if uf.components == 1 else -1
```

**Prim.** Grow the tree from any node, always adding the cheapest edge that reaches a new node. Looks like Dijkstra with the heap keyed by edge weight instead of path distance. O(E log V). Better when the graph is dense or given as an adjacency structure.

```python
def prim(n: int, graph: dict[int, list[tuple[int, int]]]) -> int:
    """graph[u] = [(v, w)]. Returns total MST weight."""
    in_tree = [False] * n
    heap = [(0, 0)]                                   # (weight, node)
    total = 0
    count = 0
    while heap and count < n:
        w, node = heapq.heappop(heap)
        if in_tree[node]:
            continue
        in_tree[node] = True
        total += w
        count += 1
        for nxt, nw in graph[node]:
            if not in_tree[nxt]:
                heapq.heappush(heap, (nw, nxt))
    return total
```

## Worked problem 7: Min cost to connect all points

**Problem.** Points in the plane; cost between two is the Manhattan distance. Minimum cost to connect all of them.

**Approach.** It is a complete graph with n² edges. Prim in O(n²) without a heap is the cleanest: keep `min_dist[i]` = cheapest known edge from the tree to point `i`, and each round pick the smallest.

```python
def min_cost_connect_points(points: list[list[int]]) -> int:
    n = len(points)
    in_tree = [False] * n
    min_dist = [float("inf")] * n
    min_dist[0] = 0
    total = 0
    for _ in range(n):
        # pick the closest point not in the tree
        u = min((i for i in range(n) if not in_tree[i]), key=lambda i: min_dist[i])
        in_tree[u] = True
        total += min_dist[u]
        # update distances through u
        for v in range(n):
            if not in_tree[v]:
                d = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])
                if d < min_dist[v]:
                    min_dist[v] = d
    return total
```

Kruskal also works: generate all n(n−1)/2 edges, sort, union. It is O(n² log n) and simpler to explain; either is accepted.

## Choosing the algorithm

| Situation | Use |
|---|---|
| Unweighted shortest path | BFS |
| Non-negative weights, shortest path | Dijkstra |
| Negative weights, or "at most k edges" | Bellman-Ford (k rounds) |
| All-pairs shortest paths, small V (≤ 400) | Floyd-Warshall, O(V³), three nested loops |
| Are two nodes connected, with edges added over time | Union-Find |
| Count components, detect cycle in undirected graph | Union-Find or DFS |
| Order with dependencies, detect cycle in directed graph | Topological sort |
| Connect everything at minimum cost | Kruskal or Prim |

Floyd-Warshall for reference, since it is three lines:

```python
for k in range(n):
    for i in range(n):
        for j in range(n):
            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```

## Common mistakes

- **Forgetting the stale-entry check** in Dijkstra. The code still gives right answers but can degrade badly on dense graphs.
- **Using Dijkstra with negative weights.** Say why it fails: a later, cheaper path can appear after a node is finalised.
- **Union-find without path compression** on adversarial inputs becomes O(n) per operation. Always include it.
- **Off-by-one in node numbering** (1-indexed inputs with 0-indexed arrays). Allocate `n + 1`.
- **Bellman-Ford without the snapshot** when a hop limit is required.
- **Trying to modify a value in the heap.** Push a new entry and skip stale ones.

## Practice set

**Easy**

- Find if Path Exists in Graph (union-find version)

**Medium**

- Number of Connected Components in an Undirected Graph
- Redundant Connection
- Accounts Merge
- Number of Provinces
- Graph Valid Tree
- Network Delay Time
- Path With Minimum Effort
- Cheapest Flights Within K Stops
- Min Cost to Connect All Points
- Connecting Cities With Minimum Cost
- Smallest String With Swaps
- Most Stones Removed with Same Row or Column
- Path with Maximum Probability (Dijkstra with a max-heap on probability)
- Number of Operations to Make Network Connected

**Hard**

- Swim in Rising Water (minimax Dijkstra or binary search plus BFS)
- Critical Connections in a Network (Tarjan's bridges; know the idea)
- Minimum Cost to Make at Least One Valid Path in a Grid (0-1 BFS)

Next: tries, the tree for strings.
