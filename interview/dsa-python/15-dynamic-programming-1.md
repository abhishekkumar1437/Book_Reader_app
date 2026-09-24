---
title: Dynamic Programming I — 1D & Knapsack
part: Core Patterns
summary: A repeatable way to find the state and the recurrence, memoisation versus tabulation, and the 1D families: climbing stairs, house robber, coin change, knapsack, LIS.
---

## Why interviewers love this pattern

Dynamic programming is where most candidates feel least confident, so it is where interviewers learn the most. The good news: interview DP is a small number of families, and there is a method for finding the recurrence that works every time if you follow it slowly.

Recognise DP when the problem asks for:

- **the number of ways** to do something;
- **the minimum or maximum** cost, length, value, or count;
- **whether it is possible** to reach a state;

*and* the input can be processed in order with choices at each step whose consequences depend only on a small summary of the past. That summary is the **state**.

If the problem asks to *list* all solutions, it is backtracking, not DP.

## The method

1. **Define the state in words.** "`dp[i]` is the minimum cost to reach step i." Be precise about what `i` means and what value is stored. Most DP bugs are a vague state.
2. **Write the recurrence.** How does `dp[i]` depend on smaller states? This comes from the *last decision*: what was the final choice that led to state `i`? Take the best over all possibilities for that choice.
3. **Base cases.** The smallest states whose answers you know directly.
4. **Order of evaluation.** Smaller states before larger ones. For memoised recursion this is automatic.
5. **Answer.** Which state holds the final answer? Sometimes it is `dp[n]`, sometimes the max over all `dp[i]`.
6. **Optimise space** if only the last few states are needed.

Say these steps out loud in the interview, in this order. The interviewer will follow, and if you get stuck at step 2 they can nudge you without you losing credit for the rest.

## Memoisation versus tabulation

**Top-down (memoisation).** Write the recursive function you would write naively, then cache it. Easiest to get right; handles states that are never needed; costs recursion depth.

```python
from functools import lru_cache

def fib(n: int) -> int:
    @lru_cache(maxsize=None)
    def f(i: int) -> int:
        if i < 2:
            return i
        return f(i - 1) + f(i - 2)
    return f(n)
```

**Bottom-up (tabulation).** Fill a table from base cases up. No recursion limit; makes space optimisation obvious.

```python
def fib(n: int) -> int:
    if n < 2:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr
```

In an interview, start top-down if the recurrence is complicated; convert to bottom-up if asked about space or if n is large enough to hit the recursion limit. Both get full marks when correct.

> **Interview tip:** `@lru_cache` on a nested function is the fastest way to a correct DP under time pressure. Arguments must be hashable (ints, strings, tuples). If you need to memoise on a list, convert it to a tuple or index into it by position.

## Family 1: Linear sequences (one index)

### Climbing stairs

Number of ways to climb `n` stairs taking 1 or 2 at a time. State: `dp[i]` = ways to reach step i. Last decision: the final step was a 1 or a 2. `dp[i] = dp[i-1] + dp[i-2]`. This is Fibonacci.

Variants that use the identical shape: *Min Cost Climbing Stairs* (`dp[i] = cost[i] + min(dp[i-1], dp[i-2])`), *Decode Ways* (add `dp[i-1]` if the single digit is valid and `dp[i-2]` if the pair is valid), *Fibonacci*, *Tribonacci*.

### House robber

**Problem.** Rob houses in a row, never two adjacent. Maximum loot?

**State.** `dp[i]` = max loot from the first `i` houses. **Last decision:** rob house `i−1` (then you could not rob `i−2`) or skip it.

```
dp[i] = max(dp[i-1], dp[i-2] + nums[i-1])
```

```python
def rob(nums: list[int]) -> int:
    prev2, prev1 = 0, 0                      # dp[i-2], dp[i-1]
    for value in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + value)
    return prev1
```

**Dry run** on `[2, 7, 9, 3, 1]`:

| value | prev2 | prev1 (new) |
|---|---|---|
| 2 | 0 | max(0, 0+2) = 2 |
| 7 | 2 | max(2, 0+7) = 7 |
| 9 | 7 | max(7, 2+9) = 11 |
| 3 | 11 | max(11, 7+3) = 11 |
| 1 | 11 | max(11, 11+1) = 12 |

Answer 12. O(n) time, O(1) space.

*House Robber II* (circular): run it twice, once excluding the first house and once excluding the last, take the max. *Delete and Earn*: bucket by value, then house-robber over the values.

### Maximum subarray (Kadane)

**State.** `best_ending_here[i]` = maximum sum of a subarray ending exactly at `i`. **Last decision:** extend the previous best, or start fresh at `i`.

```python
def max_sub_array(nums: list[int]) -> int:
    best_ending_here = best = nums[0]
    for value in nums[1:]:
        best_ending_here = max(value, best_ending_here + value)
        best = max(best, best_ending_here)
    return best
```

The answer is the max over all `i`, not `dp[n-1]`. *Maximum Product Subarray* keeps both the max and min product ending here, because a negative flips them.

## Family 2: Unbounded choices (coin change)

### Coin change (fewest coins)

**Problem.** Coins of given denominations, unlimited supply. Fewest coins to make `amount`, or −1.

**State.** `dp[a]` = fewest coins to make amount `a`. **Last decision:** which coin was added last. `dp[a] = 1 + min(dp[a - c] for c in coins if c <= a)`.

```python
def coin_change(coins: list[int], amount: int) -> int:
    INF = float("inf")
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return dp[amount] if dp[amount] != INF else -1
```

O(amount × coins). **Dry run** for coins `[1, 2, 5]`, amount 6: dp = [0, 1, 1, 2, 2, 1, 2]. dp[6] = 1 + min(dp[5], dp[4], dp[1]) = 1 + 1 = 2 (5 + 1).

### Coin change II (number of combinations)

**Problem.** Number of *combinations* of coins that make `amount` (order does not matter).

**The order-of-loops trap.** If the coin loop is inside the amount loop, you count `[1,2]` and `[2,1]` separately (permutations). To count combinations, put the **coin loop outside**, so each coin is "decided" once for all amounts.

```python
def change(amount: int, coins: list[int]) -> int:
    dp = [1] + [0] * amount                  # dp[0] = 1: one way to make zero
    for c in coins:                          # coins outer: combinations
        for a in range(c, amount + 1):
            dp[a] += dp[a - c]
    return dp[amount]
```

*Combination Sum IV* asks for ordered sequences, so it uses amount outer, coins inner. Being able to explain the difference is a classic interview moment.

### Perfect squares, word break

*Perfect Squares* is coin change with coins = squares. *Word Break* is "can amount be made" with words as coins and string matching instead of subtraction:

```python
def word_break(s: str, word_dict: list[str]) -> bool:
    words = set(word_dict)
    dp = [True] + [False] * len(s)           # dp[i]: can s[:i] be segmented
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]
```

O(n² · L). Limiting `j` to `i - max_word_length` is a standard speed-up.

## Family 3: 0/1 knapsack (each item once)

**Problem.** Items with weight and value, capacity `W`. Maximum value without exceeding capacity, each item at most once.

**State.** `dp[i][w]` = best value using the first `i` items with capacity `w`. **Last decision:** take item `i` or not.

```
dp[i][w] = max(dp[i-1][w],                            # skip
               dp[i-1][w - wt[i]] + val[i] if wt[i] <= w)   # take
```

**Space optimisation.** Only the previous row is needed. With one row, iterate `w` **downwards** so that `dp[w - wt]` still holds the previous item's value (not the current item's, which would allow taking it twice).

```python
def knapsack(weights: list[int], values: list[int], capacity: int) -> int:
    dp = [0] * (capacity + 1)
    for wt, val in zip(weights, values):
        for w in range(capacity, wt - 1, -1):          # downwards: each item once
            dp[w] = max(dp[w], dp[w - wt] + val)
    return dp[capacity]
```

Compare with coin change II, where the inner loop goes *upwards* because reuse is allowed. Upwards = unbounded, downwards = 0/1. That one rule covers most knapsack variants.

### Partition equal subset sum

**Problem.** Can the array be split into two subsets with equal sum?

**Reframe.** Is there a subset with sum `total / 2`? Boolean 0/1 knapsack.

```python
def can_partition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    reachable = [True] + [False] * target
    for x in nums:
        for s in range(target, x - 1, -1):
            if reachable[s - x]:
                reachable[s] = True
        if reachable[target]:
            return True
    return reachable[target]
```

A bitset version (`bits |= bits << x`) is a neat O(n · target / 64) trick worth mentioning.

*Target Sum* (assign + or − to reach a target) reduces to "count subsets with sum `(total + target) / 2`", which is the counting version of the same loop. *Last Stone Weight II* is "minimise the difference between two subset sums", again the same table.

## Family 4: Longest increasing subsequence

**Problem.** Length of the longest strictly increasing subsequence (not necessarily contiguous).

**State.** `dp[i]` = length of the LIS that **ends at** index `i`. **Last decision:** which earlier element `j < i` with `nums[j] < nums[i]` comes before it.

```python
def length_of_lis(nums: list[int]) -> int:
    n = len(nums)
    dp = [1] * n
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)
```

O(n²). Answer is `max(dp)`, not `dp[-1]`.

**O(n log n) with patience sorting.** Keep `tails[k]` = the smallest possible tail of an increasing subsequence of length `k+1`. For each number, binary search its position in `tails` and replace (or append). The length of `tails` is the answer; `tails` itself is *not* an actual subsequence.

```python
from bisect import bisect_left

def length_of_lis_fast(nums: list[int]) -> int:
    tails = []
    for x in nums:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)
```

Use `bisect_right` for non-decreasing (allow equal). *Russian Doll Envelopes* is LIS after sorting by width ascending and height **descending** (so equal widths cannot nest). *Number of LIS* keeps a count alongside each length in the O(n²) version.

## Worked problem: Jump game

**Problem.** `nums[i]` is the maximum jump length from index `i`. Can you reach the last index?

DP state: `can[i]`, O(n²). But the greedy is O(n) and expected: track the furthest reachable index.

```python
def can_jump(nums: list[int]) -> bool:
    furthest = 0
    for i, jump in enumerate(nums):
        if i > furthest:
            return False
        furthest = max(furthest, i + jump)
    return True
```

*Jump Game II* (minimum jumps): a BFS-like greedy with `current_end` and `furthest`; increment jumps each time you pass `current_end`. This is a reminder that some "DP-looking" problems have a greedy shortcut; DP is the safe first answer, greedy is the follow-up.

## Common mistakes

- **Vague state.** "dp[i] is the answer for i" is not a definition. Say what `i` indexes and what is stored.
- **Wrong loop order** in knapsack-type problems: upward for unbounded, downward for 0/1; coins outer for combinations.
- **Answer in the wrong cell.** For "ending at i" states the answer is the max over all cells.
- **Base case off by one**, especially `dp[0] = 1` for counting problems ("one way to make nothing").
- **Recursion limit** with memoised solutions on n = 10⁴ or more. Convert to bottom-up or raise the limit.
- **Using `lru_cache` with a list argument.** Not hashable; pass indices.

## Practice set

**Easy**

- Climbing Stairs, Min Cost Climbing Stairs
- Fibonacci Number
- Maximum Subarray
- Best Time to Buy and Sell Stock (one pass with running minimum)

**Medium**

- House Robber, House Robber II, Delete and Earn
- Decode Ways
- Coin Change, Coin Change II
- Perfect Squares
- Word Break
- Partition Equal Subset Sum, Target Sum
- Longest Increasing Subsequence, Number of LIS
- Maximum Product Subarray
- Jump Game, Jump Game II
- Combination Sum IV
- Best Time to Buy and Sell Stock with Cooldown (state machine DP)
- Integer Break

**Hard**

- Russian Doll Envelopes
- Best Time to Buy and Sell Stock IV
- Word Break II (DP to prune, backtracking to build)

Next: DP on grids, strings, and intervals.
