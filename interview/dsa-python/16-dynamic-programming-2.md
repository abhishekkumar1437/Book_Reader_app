---
title: Dynamic Programming II — Grids, Strings & Intervals
part: Core Patterns
summary: Two-dimensional states. Grid paths, edit distance and the LCS family, palindromic substrings, and interval DP like burst balloons.
---

## Why interviewers love this pattern

Once the state needs two indices, the recurrence gets richer and the table gets bigger. These are the "medium-hard" DP questions: two strings compared position by position, a grid walked from one corner to another, or a range `[i, j]` split at every possible midpoint. The method is unchanged; the state just has two coordinates.

Recognise 2D DP when:

- there are **two sequences** (two strings, two arrays) being aligned or compared;
- you move through a **grid** with restricted directions;
- the answer for a **range** `[i, j]` depends on smaller ranges inside it;
- the state needs "position **and** something else" (position and remaining budget, position and last choice).

## Family 1: Grid paths

The state is the cell. The recurrence comes from which neighbours you could have arrived from.

### Unique paths

Move only right or down from top-left to bottom-right. `dp[r][c] = dp[r-1][c] + dp[r][c-1]`, first row and column are 1.

```python
def unique_paths(m: int, n: int) -> int:
    row = [1] * n
    for _ in range(1, m):
        for c in range(1, n):
            row[c] += row[c - 1]              # row[c] still holds the value from the row above
    return row[-1]
```

One row suffices because each cell needs only the cell above (the old value) and the cell to the left (already updated). With obstacles, set blocked cells to 0 before adding.

### Minimum path sum

Same movement; minimise the sum of visited values.

```python
def min_path_sum(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    dp = [[0] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            best_prev = 0
            if r and c:
                best_prev = min(dp[r - 1][c], dp[r][c - 1])
            elif r:
                best_prev = dp[r - 1][c]
            elif c:
                best_prev = dp[r][c - 1]
            dp[r][c] = grid[r][c] + best_prev
    return dp[-1][-1]
```

*Triangle* and *Minimum Falling Path Sum* are the same with three possible predecessors. *Maximal Square* uses `dp[r][c] = 1 + min(up, left, up-left)` for the side of the largest square ending at `(r, c)`.

### Dungeon game (reverse direction)

When the constraint is about *surviving until the end* (health must never drop to zero), compute from the bottom-right backwards: `need[r][c]` = minimum health needed on entering `(r, c)` to survive. The direction of the DP follows the direction of the dependency, not the direction of movement.

## Family 2: Two strings

State: `dp[i][j]` = answer for the prefix `a[:i]` and the prefix `b[:j]`. Use lengths `n + 1` and `m + 1` so that `i = 0` means "empty prefix". The recurrence compares `a[i-1]` and `b[j-1]`.

### Longest common subsequence

```
dp[i][j] = dp[i-1][j-1] + 1                   if a[i-1] == b[j-1]
         = max(dp[i-1][j], dp[i][j-1])        otherwise
```

```python
def longest_common_subsequence(a: str, b: str) -> int:
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]
```

**Dry run** for `a = "abcde"`, `b = "ace"`:

|   | "" | a | c | e |
|---|---|---|---|---|
| "" | 0 | 0 | 0 | 0 |
| a | 0 | 1 | 1 | 1 |
| b | 0 | 1 | 1 | 1 |
| c | 0 | 1 | 2 | 2 |
| d | 0 | 1 | 2 | 2 |
| e | 0 | 1 | 2 | 3 |

Answer 3. O(n·m) time and space; O(m) space with two rows.

Same table, different questions: *Shortest Common Supersequence* (`n + m − LCS`), *Delete Operation for Two Strings* (`n + m − 2·LCS`), *Uncrossed Lines* (LCS on integers), *Longest Palindromic Subsequence* (LCS of `s` and `reversed(s)`).

### Edit distance

**Problem.** Minimum insert/delete/replace operations to turn `a` into `b`.

```
dp[i][j] = dp[i-1][j-1]                               if a[i-1] == b[j-1]
         = 1 + min(dp[i-1][j],      # delete a[i-1]
                   dp[i][j-1],      # insert b[j-1]
                   dp[i-1][j-1])    # replace
```

Base cases: `dp[i][0] = i` (delete everything), `dp[0][j] = j` (insert everything).

```python
def min_distance(a: str, b: str) -> int:
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[n][m]
```

Be ready to explain what each of the three options *means*. Interviewers ask.

### Distinct subsequences (counting)

How many ways does `t` appear as a subsequence of `s`? `dp[i][j]` = ways for `s[:i]`, `t[:j]`. Always allowed to skip `s[i-1]`; additionally, if characters match, use it.

```python
def num_distinct(s: str, t: str) -> int:
    n, m = len(s), len(t)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = 1                                    # empty t: one way
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            dp[i][j] = dp[i - 1][j]
            if s[i - 1] == t[j - 1]:
                dp[i][j] += dp[i - 1][j - 1]
    return dp[n][m]
```

### Regular expression / wildcard matching

State `dp[i][j]` = does `s[:i]` match `p[:j]`. The interesting case is `*`.

For **wildcard** (`?` any char, `*` any sequence): `dp[i][j] = dp[i][j-1] (star matches empty) or dp[i-1][j] (star absorbs s[i-1])`.

For **regex** (`.` and `*` meaning "zero or more of the previous char"), the `*` at `p[j-1]` refers to `p[j-2]`:

```python
def is_match(s: str, p: str) -> bool:
    n, m = len(s), len(p)
    dp = [[False] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = True
    for j in range(2, m + 1):                            # patterns like a*b* match empty
        if p[j - 1] == "*":
            dp[0][j] = dp[0][j - 2]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if p[j - 1] == "*":
                dp[i][j] = dp[i][j - 2]                  # zero occurrences
                if p[j - 2] in (s[i - 1], "."):
                    dp[i][j] |= dp[i - 1][j]             # one more occurrence
            elif p[j - 1] in (s[i - 1], "."):
                dp[i][j] = dp[i - 1][j - 1]
    return dp[n][m]
```

This is a hard question; being able to state the two `*` cases is what matters.

## Family 3: Substrings of one string (palindromes)

State: `dp[i][j]` = is `s[i..j]` a palindrome (or the best answer for that range). Fill by increasing length so that `dp[i+1][j-1]` is ready.

### Longest palindromic substring

Two accepted approaches. The DP table is O(n²) time and space. **Expand around centre** is O(n²) time, O(1) space, and shorter; it is usually the one to write.

```python
def longest_palindrome(s: str) -> str:
    best = ""
    for centre in range(len(s)):
        for lo, hi in ((centre, centre), (centre, centre + 1)):    # odd and even lengths
            while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
                lo -= 1
                hi += 1
            if hi - lo - 1 > len(best):
                best = s[lo + 1:hi]
    return best
```

*Palindromic Substrings* (count) is the same loop counting each successful expansion.

The DP version, for when a table is needed (for example to speed up *Palindrome Partitioning*):

```python
def palindrome_table(s: str) -> list[list[bool]]:
    n = len(s)
    is_pal = [[False] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):                  # i descending so is_pal[i+1] is ready
        for j in range(i, n):
            if s[i] == s[j] and (j - i < 2 or is_pal[i + 1][j - 1]):
                is_pal[i][j] = True
    return is_pal
```

### Longest palindromic subsequence

`dp[i][j]` = longest palindromic subsequence in `s[i..j]`. If the ends match, `2 + dp[i+1][j-1]`; otherwise `max(dp[i+1][j], dp[i][j-1])`. Or run LCS on `s` and its reverse.

## Family 4: Interval DP

State: `dp[i][j]` = best answer for the range `i..j`, computed by choosing a **split point** `k` inside it. Fill by increasing range length. O(n³) typically.

### Burst balloons

**Problem.** Bursting balloon `i` earns `nums[i-1] * nums[i] * nums[i+1]` (with 1s at the boundaries). Maximise total coins.

**The trick.** Think about which balloon is burst **last** in the range `(i, j)` (exclusive bounds). If `k` is last, its neighbours at that moment are exactly `i` and `j`, because everything between has already gone. So:

```
dp[i][j] = max over k in (i, j) of dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j]
```

```python
def max_coins(nums: list[int]) -> int:
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n):                     # distance between i and j
        for i in range(n - length):
            j = i + length
            for k in range(i + 1, j):
                dp[i][j] = max(dp[i][j], dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j])
    return dp[0][n - 1]
```

"Choose the last one, not the first" is the insight that makes interval DP work; the same trick solves *Minimum Cost to Cut a Stick*, *Remove Boxes* (harder), and *Matrix Chain Multiplication*.

### Minimum cost to merge stones / matrix chain

Same skeleton: `dp[i][j] = min over k of dp[i][k] + dp[k+1][j] + cost_of_merging`. Know the shape; you will recognise the problem when it appears.

## Family 5: Position plus an extra dimension

When the state needs "where am I" and "what mode am I in", add a small second dimension.

### Best time to buy and sell stock with cooldown (state machine)

States per day: `hold` (own a share), `sold` (sold today, must cool down), `rest` (no share, free to buy).

```python
def max_profit(prices: list[int]) -> int:
    hold, sold, rest = float("-inf"), 0, 0
    for p in prices:
        hold, sold, rest = max(hold, rest - p), hold + p, max(rest, sold)
    return max(sold, rest)
```

Drawing the three states and the arrows between them is the whole solution; the code follows the drawing. *With transaction fee* removes the cooldown state and subtracts the fee on sell. *At most k transactions* adds a `k` dimension.

### Paint house

Cost `costs[i][c]` to paint house `i` colour `c`, no two adjacent the same. `dp[i][c] = costs[i][c] + min(dp[i-1][other])`. With three colours it is O(n); with `k` colours track the best and second-best of the previous row to keep O(n·k).

## Reconstructing the answer

Sometimes you must return the actual path or subsequence, not just its length. Keep a `parent` table recording which choice produced each cell, then walk backwards from the answer cell. For LCS: start at `(n, m)`; if characters match, take the character and go diagonal; else move to whichever of up/left has the larger value.

## Common mistakes

- **Index confusion between `dp[i]` and `s[i-1]`.** With the leading empty-prefix row and column, the string index is always one less. Write it that way consistently.
- **Filling interval DP in the wrong order.** Loop over length first, then start index.
- **Missing the empty-pattern base cases** in matching problems.
- **Off-by-one on the space-optimised row** in grid DP: initialise the first row correctly before the loop.
- **O(n³) when O(n²) exists.** For palindromic substrings, expand around centre; for LCS-type, one pass per pair of prefixes.
- **Not naming the states** in state-machine DP. Draw them.

## Practice set

**Easy**

- Pascal's Triangle
- Is Subsequence

**Medium**

- Unique Paths, Unique Paths II
- Minimum Path Sum, Triangle
- Maximal Square
- Longest Common Subsequence
- Edit Distance
- Longest Palindromic Substring, Palindromic Substrings
- Longest Palindromic Subsequence
- Best Time to Buy and Sell Stock with Cooldown / with Transaction Fee
- Paint House
- Interleaving String
- Minimum ASCII Delete Sum for Two Strings
- Number of Longest Increasing Subsequence

**Hard**

- Burst Balloons
- Regular Expression Matching, Wildcard Matching
- Distinct Subsequences
- Minimum Cost to Cut a Stick
- Dungeon Game
- Best Time to Buy and Sell Stock IV
- Cherry Pickup

Next: greedy algorithms, and how to know when greed is safe.
