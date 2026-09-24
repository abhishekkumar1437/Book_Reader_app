---
title: Graphs I — BFS, DFS & Topological Sort
part: Core Patterns
summary: Represent a graph, traverse it without getting lost, count components, find shortest paths in unweighted graphs, detect cycles, and order dependencies.
---

## Why interviewers love this pattern

Graph questions look intimidating and are usually one of four things: a BFS, a DFS, a topological sort, or union-find. The hard part is *recognising the graph*, because it is rarely handed to you as one. A grid is a graph. A list of prerequisites is a graph. Words that differ by one letter form a graph. Once you see the nodes and edges, the algorithm is standard.

Recognise a graph problem when you read:

- "islands", "regions", "connected", "reachable";
- "shortest path", "minimum number of steps", "fewest moves" (unweighted → BFS);
- "prerequisites", "dependencies", "build order", "can all courses be finished" (topological sort);
- "clone", "detect cycle", "is it a tree";
- a grid with movement rules.

## Representing a graph

**Adjacency list** is the default. Build it from an edge list in one pass.

```python
from collections import defaultdict

def build_graph(n: int, edges: list[list[int]], directed: bool = False) -> dict[int, list[int]]:
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        if not directed:
            graph[v].append(u)
    return graph
```

For a **grid**, the graph is implicit: the neighbours of `(r, c)` are the four cells around it that are in bounds. Write the direction list once:

```python
DIRS = [(1, 0), (-1, 0), (0, 1), (0, -1)]

for dr, dc in DIRS:
    nr, nc = r + dr, c + dc
    if 0 <= nr < rows and 0 <= nc < cols:
        ...
```

Add the four diagonals for eight-directional movement.

## DFS: go deep, mark visited

Use DFS to explore everything reachable from a node: counting components, flood fill, checking connectivity, finding cycles.

**Recursive** (short, but depth-limited in Python):

```python
def dfs(node: int, graph, visited: set) -> None:
    visited.add(node)
    for nxt in graph[node]:
        if nxt not in visited:
            dfs(nxt, graph, visited)
```

**Iterative** with an explicit stack (safe for large inputs):

```python
def dfs_iter(start: int, graph, visited: set) -> None:
    stack = [start]
    visited.add(start)
    while stack:
        node = stack.pop()
        for nxt in graph[node]:
            if nxt not in visited:
                visited.add(nxt)          # mark when pushing, not when popping
                stack.append(nxt)
```

Mark visited **when you push**, not when you pop. Otherwise the same node can be pushed multiple times.

## BFS: go wide, count levels

Use BFS whenever you need the **shortest path in an unweighted graph** or anything organised by distance from a source. The first time BFS reaches a node is via a shortest path.

```python
from collections import deque

def bfs(start: int, graph) -> dict[int, int]:
    dist = {start: 0}
    queue = deque([start])
    while queue:
        node = queue.popleft()
        for nxt in graph[node]:
            if nxt not in dist:
                dist[nxt] = dist[node] + 1
                queue.append(nxt)
    return dist
```

**Multi-source BFS**: start the queue with *all* sources at distance 0. That answers "distance to the nearest X for every cell" in one pass (*Rotting Oranges*, *Walls and Gates*, *01 Matrix*).

Both traversals are O(V + E). On a grid that is O(rows × cols).

> **Interview tip:** The decision is one sentence: "I need the fewest steps, so BFS" or "I just need to know what is connected, so DFS". If edges have different weights, neither is enough; that is Dijkstra, in the next chapter.

## Worked problem 1: Number of islands

**Problem.** Grid of `'1'` (land) and `'0'` (water). Count islands (4-directionally connected land).

**Approach.** Scan every cell. When you find unvisited land, that is a new island: flood-fill it (DFS or BFS) so it is not counted again. Sinking the island by writing `'0'` avoids a separate visited set, if mutation is allowed.

```python
def num_islands(grid: list[list[str]]) -> int:
    rows, cols = len(grid), len(grid[0])
    count = 0

    def sink(r: int, c: int) -> None:
        stack = [(r, c)]
        grid[r][c] = "0"
        while stack:
            cr, cc = stack.pop()
            for dr, dc in DIRS:
                nr, nc = cr + dr, cc + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "1":
                    grid[nr][nc] = "0"
                    stack.append((nr, nc))

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                sink(r, c)
    return count
```

O(rows × cols) time; each cell is visited a constant number of times.

Siblings: *Max Area of Island* (return the size of the fill), *Number of Closed Islands*, *Surrounded Regions* (flood from the border first, then flip the rest), *Pacific Atlantic Water Flow* (flood from both oceans, intersect).

## Worked problem 2: Rotting oranges (multi-source BFS)

**Problem.** 0 empty, 1 fresh, 2 rotten. Every minute, rotten oranges rot their 4 neighbours. Minutes until no fresh remain, or −1.

```python
def oranges_rotting(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1

    minutes = 0
    while queue and fresh:
        for _ in range(len(queue)):               # one minute = one level
            r, c = queue.popleft()
            for dr, dc in DIRS:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    queue.append((nr, nc))
        minutes += 1
    return minutes if fresh == 0 else -1
```

The `while queue and fresh` condition stops as soon as everything is rotten, so you do not count an extra empty minute.

## Worked problem 3: Word ladder

**Problem.** Transform `begin` into `end` one letter at a time, each intermediate word in the dictionary. Fewest words in the sequence?

**Graph.** Words are nodes; two words are adjacent if they differ by one letter. Generating neighbours by trying 26 letters at each position is O(26 · L) per word, which beats comparing every pair.

```python
def ladder_length(begin: str, end: str, word_list: list[str]) -> int:
    words = set(word_list)
    if end not in words:
        return 0
    queue = deque([(begin, 1)])
    words.discard(begin)
    while queue:
        word, steps = queue.popleft()
        if word == end:
            return steps
        for i in range(len(word)):
            for ch in "abcdefghijklmnopqrstuvwxyz":
                candidate = word[:i] + ch + word[i + 1:]
                if candidate in words:
                    words.remove(candidate)           # visited = removed from the set
                    queue.append((candidate, steps + 1))
    return 0
```

Removing from the set as you enqueue doubles as the visited check. Bidirectional BFS (search from both ends, expand the smaller frontier) is the follow-up optimisation.

## Worked problem 4: Clone graph

**Problem.** Deep copy an undirected graph given a reference node.

**Approach.** DFS or BFS with a map from original node to its clone. Create the clone on first visit; wire neighbours through the map.

```python
def clone_graph(node):
    if not node:
        return None
    clones = {node: Node(node.val)}
    queue = deque([node])
    while queue:
        curr = queue.popleft()
        for nb in curr.neighbors:
            if nb not in clones:
                clones[nb] = Node(nb.val)
                queue.append(nb)
            clones[curr].neighbors.append(clones[nb])
    return clones[node]
```

## Worked problem 5: Course schedule (cycle detection and topological sort)

**Problem.** `n` courses and prerequisite pairs `[a, b]` meaning "take b before a". Can you finish all courses? And in what order?

**Graph.** Directed edge `b → a`. Finishing is possible exactly when there is no cycle. A valid order is a **topological sort**.

**Kahn's algorithm (BFS).** Repeatedly take a node with no remaining incoming edges, output it, and remove its outgoing edges. If you output all `n` nodes, there is no cycle.

```python
def find_order(n: int, prerequisites: list[list[int]]) -> list[int]:
    graph = defaultdict(list)
    indegree = [0] * n
    for a, b in prerequisites:
        graph[b].append(a)
        indegree[a] += 1

    queue = deque(i for i in range(n) if indegree[i] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in graph[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)
    return order if len(order) == n else []          # [] means a cycle exists
```

**Dry run** with n = 4, prerequisites `[[1,0],[2,0],[3,1],[3,2]]`: edges 0→1, 0→2, 1→3, 2→3. Indegrees [0,1,1,2]. Queue starts [0]. Pop 0 → order [0]; 1 and 2 drop to 0, enqueue. Pop 1 → 3 drops to 1. Pop 2 → 3 drops to 0, enqueue. Pop 3. Order [0,1,2,3], length 4: valid.

**DFS with three colours.** White = unvisited, grey = on the current path, black = finished. Seeing a grey node again means a cycle. Postorder gives the reverse topological order.

```python
def can_finish(n: int, prerequisites: list[list[int]]) -> bool:
    graph = defaultdict(list)
    for a, b in prerequisites:
        graph[b].append(a)
    WHITE, GREY, BLACK = 0, 1, 2
    color = [WHITE] * n

    def has_cycle(node: int) -> bool:
        color[node] = GREY
        for nxt in graph[node]:
            if color[nxt] == GREY:
                return True                          # back edge
            if color[nxt] == WHITE and has_cycle(nxt):
                return True
        color[node] = BLACK
        return False

    return not any(color[i] == WHITE and has_cycle(i) for i in range(n))
```

Both are O(V + E). Kahn's is easier to write iteratively and naturally produces the order; the DFS version is what people mean by "cycle detection in a directed graph". For an **undirected** graph, a cycle exists if DFS reaches a visited node that is not the parent, or use union-find.

## Worked problem 6: Shortest path in a binary matrix (BFS with 8 directions)

Straight BFS on a grid, eight neighbours, counting steps. Written out because it is the shape of many "minimum moves" questions (*Knight moves*, *Open the Lock*, *Minimum Knight Moves*, *Jump Game IV*).

```python
def shortest_path_binary_matrix(grid: list[list[int]]) -> int:
    n = len(grid)
    if grid[0][0] or grid[n - 1][n - 1]:
        return -1
    queue = deque([(0, 0, 1)])
    grid[0][0] = 1                                    # mark visited in place
    while queue:
        r, c, steps = queue.popleft()
        if (r, c) == (n - 1, n - 1):
            return steps
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                    grid[nr][nc] = 1
                    queue.append((nr, nc, steps + 1))
    return -1
```

## Worked problem 7: Graph valid tree

**Problem.** `n` nodes and an edge list. Is it a tree?

A tree has exactly `n − 1` edges and is connected. Check the edge count, then BFS/DFS from node 0 and confirm every node is reached. (Union-find, next chapter, gives an even shorter answer.)

```python
def valid_tree(n: int, edges: list[list[int]]) -> bool:
    if len(edges) != n - 1:
        return False
    graph = build_graph(n, edges)
    seen = {0}
    stack = [0]
    while stack:
        node = stack.pop()
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt)
                stack.append(nxt)
    return len(seen) == n
```

## Common mistakes

- **Marking visited on pop instead of push** in BFS/DFS, which lets nodes enter the queue many times and can blow up to exponential work.
- **Forgetting bounds checks** on grids, or checking them after indexing.
- **Using DFS for shortest paths.** DFS finds *a* path, not the shortest.
- **Not handling disconnected graphs**: loop over all nodes as potential starts when counting components.
- **Recursion depth** on a 1000×1000 grid. Go iterative.
- **Building the reverse edge direction** in course schedule. Write the edge as "prerequisite → course" and say it out loud.
- **Treating grey and black the same** in DFS cycle detection; a black node is finished and safe to revisit.

## Practice set

**Easy**

- Flood Fill
- Find if Path Exists in Graph
- Find Center of Star Graph

**Medium**

- Number of Islands, Max Area of Island
- Rotting Oranges
- Clone Graph
- Course Schedule, Course Schedule II
- Pacific Atlantic Water Flow
- Surrounded Regions
- Walls and Gates, 01 Matrix
- Number of Connected Components in an Undirected Graph
- Graph Valid Tree
- Word Ladder
- Shortest Path in Binary Matrix
- Open the Lock
- All Paths From Source to Target
- Is Graph Bipartite? (BFS with two colours)
- Keys and Rooms

**Hard**

- Word Ladder II (BFS to build layers, then DFS to reconstruct paths)
- Alien Dictionary (build the graph from adjacent words, then topological sort)
- Bus Routes

Next: union-find, Dijkstra, and minimum spanning trees.
