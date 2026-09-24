---
title: Pattern Cheat Sheet
part: Wrap-up
summary: Problem wording to pattern in one lookup. Read this before every mock interview until you no longer need it.
---

## How to use this page

Read the problem. Find the phrase that matches. Reach for that pattern first and say it out loud. If the constraints rule it out, use the second column for the fallback. Then check the complexity table at the bottom to confirm the answer fits the input size.

## From wording to pattern

| The problem says... | Reach for | If that fails, consider |
|---|---|---|
| sorted array, pair or triplet with target sum | Two pointers (opposite ends) | Hash map if unsorted |
| remove or move elements in place, keep order | Two pointers (slow/fast) | |
| palindrome check, compare from both ends | Two pointers | Expand around centre for substrings |
| longest / shortest **substring or subarray** with a condition | Sliding window | Prefix sums + hash map if values can be negative |
| exactly k of something (count) | Sliding window: atMost(k) − atMost(k−1) | |
| anagram / permutation of a pattern in a string | Fixed-size sliding window with counts | |
| **sum of a range** asked many times | Prefix sums | Segment tree / Fenwick if updates too |
| count subarrays with sum k, divisible by k, equal 0s and 1s | Running prefix + hash map | |
| have I seen this before, group by, duplicates | Hash map / set | Sort then compare (O(n log n)) |
| two values that satisfy a relation on unsorted data | Hash map (complement lookup) | |
| next greater / smaller, nearest taller, days until warmer | Monotonic stack | |
| largest rectangle, histogram, maximal rectangle | Monotonic stack | |
| maximum / minimum of every window of size k | Monotonic deque | Heap with lazy deletion |
| brackets, nested structure, undo / most recent | Stack | |
| linked list: middle, cycle, k-th from end | Fast and slow pointers | |
| linked list: head might change, build a new list | Dummy head | |
| reverse part of a list | Iterative three-pointer reversal | |
| sorted input, O(log n) required | Binary search | |
| rotated / mountain / partially sorted array | Binary search with a "which half is sorted" check | |
| **minimum X such that feasible(X)**, feasibility is monotonic | Binary search on the answer | |
| k-th smallest in a sorted matrix or across lists | Binary search on value, or heap | |
| intervals: merge, insert, overlaps | Sort by start, sweep | |
| intervals: maximum non-overlapping, min removals | Sort by **end**, greedy | |
| how many rooms / overlap at any time | Min-heap of end times, or +1/−1 sweep | |
| k-th largest, top k, k most frequent, k closest | Size-k heap | Quickselect (average O(n)); bucket sort for frequencies |
| merge k sorted things | Heap of heads with an index tie-breaker | Divide and conquer pairwise merge |
| running median | Two heaps | |
| schedule by priority, next task, cooldown | Heap (+ queue for waiting) | Formula if one exists |
| generate **all** subsets / permutations / combinations / partitions | Backtracking (choose, explore, un-choose) | Bitmask enumeration for subsets, n ≤ 20 |
| place items under constraints (queens, sudoku) | Backtracking with pruning via sets | |
| tree: height, sum, balanced, symmetric | Recursion returning a value for the subtree | |
| tree: diameter, max path sum, longest univalue path | Recursion updating a global best, returning one arm | |
| tree: by level, closest, right side view, zigzag | BFS with `for _ in range(len(queue))` | |
| BST: validate, k-th smallest, sorted output | Inorder traversal or (low, high) range | |
| lowest common ancestor | Postorder: return found node, combine | Walk down for BST |
| serialize / rebuild a tree | Preorder with null markers; hash map for inorder positions | |
| prefix queries, autocomplete, starts with, many words in a grid | Trie | Sorted list + bisect for simple prefix lookups |
| islands, regions, connected cells, flood fill | DFS / BFS on the grid | Union-find |
| fewest steps / shortest path, all edges equal | BFS | Bidirectional BFS for big spaces |
| distance to nearest X for every cell | Multi-source BFS | |
| shortest path with **weights** (non-negative) | Dijkstra | Bellman-Ford with negatives or hop limits |
| path minimising the maximum edge | Dijkstra with `max` relaxation | Binary search + BFS |
| prerequisites, build order, can all be done | Topological sort (Kahn's) | DFS with three colours |
| are two things connected, edges added over time, merge groups | Union-find | |
| connect everything at minimum cost | Kruskal (sort + union-find) or Prim (heap) | |
| number of ways, min/max cost, is it possible; choices in order | Dynamic programming | Greedy if an exchange argument holds |
| coins, unlimited reuse | Unbounded knapsack: inner loop upward | Coins outer for combinations, amount outer for permutations |
| each item once, subset sum, partition | 0/1 knapsack: inner loop downward | Bitset trick |
| longest increasing subsequence | O(n²) DP, or `tails` with bisect for O(n log n) | |
| two strings: align, common, edit, match | 2D DP with empty-prefix row and column | |
| palindromic substring / count | Expand around centre | 2D table if the table is reused |
| best answer over a range `[i, j]` with a split point | Interval DP by increasing length ("choose the last one") | |
| buy/sell with rules (cooldown, fee, k transactions) | State-machine DP | |
| visit all of a small set (n ≤ 16) | Bitmask DP | |
| locally best choice is provably safe | Greedy, with the exchange argument stated | DP if a counterexample exists |
| single number, pairs cancel, without extra space | XOR | |
| count bits, power of two, lowest set bit | `x & (x − 1)`, `x & −x` | |
| 32-bit overflow, reverse bits, add without + | Mask with `0xFFFFFFFF` | |

## From constraints to target complexity

| n up to | Target | Typical patterns |
|---|---|---|
| 10–12 | O(n!) | permutations by backtracking |
| 15–20 | O(2ⁿ · n) | subsets, bitmask DP |
| 50–100 | O(n⁴) | rare; heavy DP |
| 200–500 | O(n³) | interval DP, Floyd-Warshall |
| 10³–5·10³ | O(n²) | 2D DP, simple nested loops, O(n²) LIS |
| 10⁵–10⁶ | O(n log n) | sorting, heaps, binary search, LIS with bisect |
| 10⁶–10⁸ | O(n) | two pointers, sliding window, prefix sums, hashing, BFS/DFS, monotonic stack |
| > 10⁹ (a value, not a count) | O(log n) or O(1) | binary search on the answer, math, bit tricks |

If your planned solution does not fit the row for the given n, it is the wrong solution. Say so and look for the next pattern.

## Data structure costs to recite

| Structure | Access | Search | Insert | Delete | Notes |
|---|---|---|---|---|---|
| list | O(1) | O(n) | O(1) end, O(n) front | O(1) end, O(n) front | `sort` O(n log n), stable |
| deque | O(1) ends | O(n) | O(1) both ends | O(1) both ends | use for queues |
| dict / set | O(1) avg | O(1) avg | O(1) avg | O(1) avg | keys must be hashable |
| heapq | O(1) min | O(n) | O(log n) | O(log n) top only | `heapify` O(n) |
| sorted list + bisect | O(1) | O(log n) | O(n) | O(n) | fine when inserts are rare |
| trie | O(L) | O(L) | O(L) | O(L) | L = string length |
| union-find | | O(α(n)) find | O(α(n)) union | | effectively constant |
| balanced BST | O(log n) | O(log n) | O(log n) | O(log n) | not in the standard library; mention `sortedcontainers` |

## Ten things to say in every interview

1. Restate the problem and confirm one example.
2. Ask about input size, value range, duplicates, empty input, and whether the input can be modified.
3. Give the brute force and its complexity before anything else.
4. Name the pattern: "this looks like a sliding window because...".
5. Define your state or invariant in one sentence before coding.
6. Write the function signature, then comments for each step, then the code.
7. Handle the empty case once at the top.
8. Trace a small example by hand after writing the code. Find your own bug.
9. State the final time and space complexity, including recursion depth.
10. Offer one follow-up: a space optimisation, a streaming version, or what changes with negative numbers.

## Five things never to say

- "I have seen this before, the answer is..." (then solve it wrong from memory).
- "It's O(n)" without saying why.
- "I'll handle edge cases later."
- Silence for more than thirty seconds.
- "That's the best possible" without an argument.

The final chapter turns all of this into a study schedule.
