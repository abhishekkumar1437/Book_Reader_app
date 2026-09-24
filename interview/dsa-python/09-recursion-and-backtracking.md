---
title: Recursion & Backtracking
part: Core Patterns
summary: One template for subsets, permutations, combinations, and constraint problems like N-Queens and Sudoku. Choose, explore, un-choose.
---

## Why interviewers love this pattern

Backtracking is how you enumerate every valid configuration when there is no shortcut: all subsets, all permutations, all ways to place queens, every path through a maze. The brute force *is* the algorithm. What the interviewer grades is whether you structure the search cleanly, prune early, and know its exponential cost.

Recognise it when:

- "return **all** possible..." (combinations, permutations, partitions, paths);
- "generate valid..." (parentheses, IP addresses, words in a grid);
- "place items subject to constraints" (N-Queens, Sudoku);
- n is small (≤ 20 or so), which signals exponential time is expected.

## Recursion, briefly

A recursive function needs a **base case** that returns without recursing and a **recursive case** that moves closer to it. When writing one, say the *contract* in one sentence: "`solve(i)` returns the best answer using elements from index i onward." Trust the contract when you make the call; do not try to trace the whole tree in your head.

Python specifics:

- Default recursion limit is ~1000. Raise it with `sys.setrecursionlimit(10**6)` for deep recursions, or go iterative.
- Every call costs O(1) stack space, so depth d means O(d) space.
- Mutable defaults (`def f(x, acc=[])`) are a classic bug. Pass the accumulator explicitly.

## The backtracking template

```python
def backtrack(state, choices):
    if is_complete(state):
        results.append(copy_of(state))       # copy! the same list is mutated later
        return
    for choice in choices:
        if not is_valid(choice, state):
            continue                         # prune
        state.add(choice)                    # choose
        backtrack(state, next_choices)       # explore
        state.remove(choice)                 # un-choose
```

Three lines, always in this order: choose, explore, un-choose. The un-choose step is what makes it "back" tracking: it restores the state so the next sibling choice starts clean.

The recursion tree has one node per partial state. Time is roughly (number of nodes) × (work per node). For subsets that is O(2ⁿ · n), for permutations O(n! · n).

> **Interview tip:** Draw the recursion tree for a tiny input (n = 3) on the whiteboard before coding. It makes the "start index" and "used set" choices obvious, and it shows the interviewer you understand what the code will enumerate.

## Worked problem 1: Subsets

```
[1, 2, 3]  ->  [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
```

**Approach.** At each level, choose the next element to add from those *after* the last one chosen (a `start` index). This avoids generating `[1,2]` and `[2,1]` both. Every node in the tree is a valid subset, so record on entry.

```python
def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    path = []

    def backtrack(start: int) -> None:
        result.append(path[:])                 # every partial path is a subset
        for i in range(start, len(nums)):
            path.append(nums[i])               # choose
            backtrack(i + 1)                   # explore, only later elements
            path.pop()                         # un-choose

    backtrack(0)
    return result
```

**Recursion tree** for `[1, 2, 3]` (each node records `path`):

```
[]
├── [1]
│   ├── [1,2]
│   │   └── [1,2,3]
│   └── [1,3]
├── [2]
│   └── [2,3]
└── [3]
```

**With duplicates** (*Subsets II*): sort, and skip an element if it equals the previous one *at the same level*:

```python
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue
```

`i > start` (not `i > 0`) is the important detail: the first use of a value at a level is allowed, only repeats within the same level are skipped.

**Alternative: bitmask.** For n ≤ 20, iterate `mask` from 0 to 2ⁿ−1 and include `nums[i]` when bit i is set. Same complexity, no recursion; good to mention.

## Worked problem 2: Permutations

```
[1, 2, 3]  ->  6 orderings
```

**Approach.** At each position, choose any element not yet used. Track usage with a boolean list (or a set). Record when the path is full.

```python
def permute(nums: list[int]) -> list[list[int]]:
    result = []
    path = []
    used = [False] * len(nums)

    def backtrack() -> None:
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            backtrack()
            path.pop()
            used[i] = False

    backtrack()
    return result
```

**With duplicates** (*Permutations II*): sort, and skip `nums[i]` if it equals `nums[i-1]` and `nums[i-1]` is **not** currently used. That forces equal values to be picked in left-to-right order, so each distinct permutation appears once.

```python
            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                continue
```

## Worked problem 3: Combination sum

**Problem.** Candidates (distinct, positive) and a target. Return all combinations that sum to the target. Each candidate may be reused any number of times.

```
[2, 3, 6, 7], target 7  ->  [[2, 2, 3], [7]]
```

**Approach.** Subsets-style `start` index, but pass `i` instead of `i + 1` to allow reuse. Prune when the remaining target goes negative; sorting the candidates lets you `break` instead of `continue`.

```python
def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    candidates.sort()
    result = []
    path = []

    def backtrack(start: int, remaining: int) -> None:
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break                              # sorted: nothing further can fit
            path.append(candidates[i])
            backtrack(i, remaining - candidates[i])   # i, not i + 1: reuse allowed
            path.pop()

    backtrack(0, target)
    return result
```

*Combination Sum II* (each candidate once, input has duplicates) uses `i + 1` and the same-level duplicate skip from Subsets II. *Combinations* (choose k of n) is subsets with a `len(path) == k` base case, and the prune `if len(path) + (n - i) < k: break`.

## Worked problem 4: Generate parentheses

```
n = 3  ->  ["((()))", "(()())", "(())()", "()(())", "()()()"]
```

**Approach.** Build the string one character at a time. Two choices, each with a validity rule: add `(` if fewer than `n` opens used; add `)` if closes used < opens used. This prunes every invalid prefix immediately.

```python
def generate_parenthesis(n: int) -> list[str]:
    result = []
    path = []

    def backtrack(opens: int, closes: int) -> None:
        if len(path) == 2 * n:
            result.append("".join(path))
            return
        if opens < n:
            path.append("(")
            backtrack(opens + 1, closes)
            path.pop()
        if closes < opens:
            path.append(")")
            backtrack(opens, closes + 1)
            path.pop()

    backtrack(0, 0)
    return result
```

Output size is the Catalan number, roughly 4ⁿ / n^1.5. Because of the pruning, no dead branches are explored.

## Worked problem 5: Word search in a grid

**Problem.** Does `word` appear in the grid by walking to adjacent cells (up/down/left/right) without reusing a cell?

**Approach.** Try every cell as a start. DFS matching one character at a time. Mark visited cells in place (temporarily overwrite with a sentinel) and restore on the way back. That is the un-choose step.

```python
def exist(board: list[list[str]], word: str) -> bool:
    rows, cols = len(board), len(board[0])

    def dfs(r: int, c: int, k: int) -> bool:
        if k == len(word):
            return True
        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != word[k]:
            return False
        saved, board[r][c] = board[r][c], "#"            # choose: mark visited
        found = (dfs(r + 1, c, k + 1) or dfs(r - 1, c, k + 1)
                 or dfs(r, c + 1, k + 1) or dfs(r, c - 1, k + 1))
        board[r][c] = saved                             # un-choose
        return found

    return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))
```

Returning as soon as one path succeeds (`or` short-circuits) is the difference between "does it exist" and "find all". For "find all words" with a dictionary, combine this with a trie (tries chapter).

## Worked problem 6: N-Queens

**Problem.** Place n queens on an n×n board so none attack each other. Return all boards.

**Approach.** One queen per row, so recurse row by row and choose a column. A column is valid if no queen is already in that column, that diagonal, or that anti-diagonal. Track the three with sets: `cols`, `diag = r - c`, `anti = r + c`.

```python
def solve_n_queens(n: int) -> list[list[str]]:
    result = []
    cols, diags, antis = set(), set(), set()
    placement = [-1] * n                            # placement[row] = column

    def backtrack(r: int) -> None:
        if r == n:
            result.append(["." * c + "Q" + "." * (n - c - 1) for c in placement])
            return
        for c in range(n):
            if c in cols or (r - c) in diags or (r + c) in antis:
                continue
            cols.add(c); diags.add(r - c); antis.add(r + c)
            placement[r] = c
            backtrack(r + 1)
            cols.remove(c); diags.remove(r - c); antis.remove(r + c)

    backtrack(0)
    return result
```

Using sets makes the validity check O(1) instead of scanning previous rows. For *N-Queens II* (count only), drop the board construction and increment a counter.

## Worked problem 7: Palindrome partitioning

**Problem.** Split a string into substrings that are all palindromes. Return all such partitions.

```
"aab"  ->  [["a","a","b"], ["aa","b"]]
```

**Approach.** Choose the next cut point. Only recurse if the piece is a palindrome.

```python
def partition(s: str) -> list[list[str]]:
    result = []
    path = []

    def is_pal(lo: int, hi: int) -> bool:
        while lo < hi:
            if s[lo] != s[hi]:
                return False
            lo += 1; hi -= 1
        return True

    def backtrack(start: int) -> None:
        if start == len(s):
            result.append(path[:])
            return
        for end in range(start, len(s)):
            if is_pal(start, end):
                path.append(s[start:end + 1])
                backtrack(end + 1)
                path.pop()

    backtrack(0)
    return result
```

Precomputing `is_pal` with DP (the dynamic programming chapters) turns the check into O(1); mention it as an optimisation.

## Worked problem 8: Letter combinations of a phone number

A pure product enumeration, useful as the simplest template check.

```python
def letter_combinations(digits: str) -> list[str]:
    if not digits:
        return []
    keys = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl",
            "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
    result = []

    def backtrack(i: int, path: list[str]) -> None:
        if i == len(digits):
            result.append("".join(path))
            return
        for ch in keys[digits[i]]:
            path.append(ch)
            backtrack(i + 1, path)
            path.pop()

    backtrack(0, [])
    return result
```

## Pruning: where the points are

An interviewer will be satisfied with a correct enumeration; they will be impressed by sensible pruning. The standard moves:

- **Sort first** so you can `break` instead of `continue` when a value is too large.
- **Bound check**: if even the best possible completion cannot beat the current best (or reach the target), return.
- **Deduplicate at the level** with the `i > start and nums[i] == nums[i-1]` skip.
- **Use sets for constraint checks** (N-Queens) instead of rescanning.
- **Memoise** when the same sub-state recurs; at that point you are doing dynamic programming.

## Common mistakes

- **Appending `path` instead of `path[:]`.** Every result then points to the same list, which is empty at the end.
- **Forgetting the un-choose step**, or un-choosing the wrong thing.
- **Using `i + 1` when reuse is allowed, or `i` when it is not.**
- **Deduplicating with `i > 0`** instead of `i > start`, which drops valid combinations.
- **Not copying the board state** in grid DFS, or forgetting to restore it, so later starts see a corrupted grid.
- **Stating the wrong complexity.** Subsets: O(n·2ⁿ). Permutations: O(n·n!). Say the output size is the lower bound.

## Practice set

**Easy**

- Binary Tree Paths (recursion with a path)
- Letter Case Permutation

**Medium**

- Subsets, Subsets II
- Permutations, Permutations II
- Combinations, Combination Sum, Combination Sum II, Combination Sum III
- Generate Parentheses
- Letter Combinations of a Phone Number
- Word Search
- Palindrome Partitioning
- Restore IP Addresses
- Partition to K Equal Sum Subsets (backtracking with pruning)

**Hard**

- N-Queens, N-Queens II
- Sudoku Solver
- Word Search II (with a trie)
- Expression Add Operators

Next: trees, where recursion becomes the default way of thinking.
