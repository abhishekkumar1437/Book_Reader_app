---
title: Greedy
part: Core Patterns
summary: Make the locally best choice and never look back. When it is safe, how to argue it, and the standard greedy problems every interviewer keeps in reserve.
---

## Why interviewers love this pattern

Greedy solutions are short. What makes them interview-worthy is the **argument**: why does taking the best option right now never hurt later? Candidates who write a greedy without a reason get asked "why is that correct?" and often cannot answer. Candidates who know when greed fails and reach for DP instead score well.

Recognise greedy when:

- the problem asks for a minimum or maximum, and there is an obvious "best next step" (earliest end, cheapest, largest);
- sorting the input by some key makes a single pass sufficient;
- constraints are large (10⁵ or more), so DP over pairs is out;
- the problem is a known greedy: intervals, jumps, gas station, assignments, Huffman-style merging.

The one-line test: **does a locally optimal choice ever block a globally optimal solution?** If you can argue "no" with an exchange argument (swap any optimal solution's choice with the greedy one without making it worse), greedy is safe. If you can find a counterexample, use DP.

## The three standard arguments

1. **Exchange argument.** Take any optimal solution. Show that swapping its first choice for the greedy choice keeps it optimal. By induction the greedy solution is optimal. This is the one to say out loud.
2. **Greedy stays ahead.** After each step the greedy solution is at least as good as any other partial solution.
3. **Matroid structure.** Rare in interviews; do not go there.

Say something like: "If an optimal schedule does not pick the meeting that ends earliest, I can swap that meeting in for its first meeting: it ends no later, so nothing after it is affected, and the count is unchanged. So picking the earliest end is safe."

## Worked problem 1: Jump game II (minimum jumps)

**Problem.** Minimum jumps to reach the last index; `nums[i]` is the maximum jump from `i`.

**Approach.** Treat it as BFS by levels without a queue. `current_end` is the furthest index reachable with the current number of jumps; `furthest` is the furthest reachable with one more. When `i` reaches `current_end`, you must jump: increment and set `current_end = furthest`.

```python
def jump(nums: list[int]) -> int:
    jumps = current_end = furthest = 0
    for i in range(len(nums) - 1):                 # no need to jump from the last index
        furthest = max(furthest, i + nums[i])
        if i == current_end:
            jumps += 1
            current_end = furthest
    return jumps
```

**Dry run** on `[2, 3, 1, 1, 4]`: i=0: furthest 2, at current_end → jumps 1, current_end 2. i=1: furthest 4. i=2: furthest 4, at current_end → jumps 2, current_end 4. Loop ends. Answer 2.

Why greedy is safe: within one jump's range, choosing the landing spot that extends reach the most can never be worse than any other landing spot, because it reaches a superset of positions.

## Worked problem 2: Gas station

**Problem.** Circular route, `gas[i]` available at station `i`, `cost[i]` to reach the next. Return the starting index that completes the loop, or −1. A unique answer exists if any.

**Insight.** If total gas ≥ total cost, a solution exists. Walk once tracking the tank; whenever it goes negative, none of the stations from the current start up to here can be the answer (they all would have run dry here or earlier), so restart from the next station.

```python
def can_complete_circuit(gas: list[int], cost: list[int]) -> int:
    if sum(gas) < sum(cost):
        return -1
    start = tank = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            start = i + 1
            tank = 0
    return start
```

The exchange-style argument is the "none of these could be the start" observation, and it is what to say when asked why one pass is enough.

## Worked problem 3: Assign cookies / two-pointer greedy

**Problem.** Children with greed `g[i]`, cookies of size `s[j]`. A child is content if `s[j] >= g[i]`. Maximise content children.

**Approach.** Sort both. Give the smallest cookie that satisfies the least greedy child. Two pointers.

```python
def find_content_children(g: list[int], s: list[int]) -> int:
    g.sort(); s.sort()
    child = cookie = 0
    while child < len(g) and cookie < len(s):
        if s[cookie] >= g[child]:
            child += 1                      # content: move to the next child
        cookie += 1                         # this cookie is used or too small
    return child
```

"Sort both, match smallest to smallest" is the shape of *Boats to Save People* (largest with smallest), *Two City Scheduling* (sort by cost difference), and *Maximum Units on a Truck* (take the biggest boxes first).

## Worked problem 4: Partition labels

**Problem.** Split a string into as many parts as possible so that each letter appears in at most one part.

**Approach.** Record the last index of each letter. Sweep; a part can end at position `i` once `i` equals the furthest last-index seen in the current part.

```python
def partition_labels(s: str) -> list[int]:
    last = {ch: i for i, ch in enumerate(s)}
    sizes = []
    start = end = 0
    for i, ch in enumerate(s):
        end = max(end, last[ch])
        if i == end:
            sizes.append(end - start + 1)
            start = i + 1
    return sizes
```

This is the same "extend the current reach, cut when you meet it" loop as Jump Game II and Merge Intervals.

## Worked problem 5: Hand of straights / groups of k consecutive

**Problem.** Can the cards be split into groups of `k` consecutive values?

**Approach.** Always start a group from the smallest remaining value; it has no other group it could belong to. Count values, iterate in sorted order, and subtract.

```python
from collections import Counter

def is_n_straight_hand(hand: list[int], k: int) -> bool:
    if len(hand) % k:
        return False
    counts = Counter(hand)
    for value in sorted(counts):
        need = counts[value]
        if need == 0:
            continue
        for v in range(value, value + k):
            if counts[v] < need:
                return False
            counts[v] -= need
    return True
```

O(n log n) for the sort. A min-heap version avoids sorting the full list if only a few distinct values exist.

## Worked problem 6: Minimum number of arrows / activity selection (recap)

Sort intervals by end, keep the earliest-ending, skip everything that overlaps it. Covered in the intervals chapter; it is the textbook greedy and the exchange argument above applies to it verbatim.

## Worked problem 7: Candy

**Problem.** Ratings in a row; each child gets at least one candy, and a child with a higher rating than a neighbour gets more than that neighbour. Minimum candies?

**Approach.** Two passes. Left to right enforces the "greater than left neighbour" rule; right to left enforces the "greater than right neighbour" rule, taking the max so the first pass is not undone.

```python
def candy(ratings: list[int]) -> int:
    n = len(ratings)
    candies = [1] * n
    for i in range(1, n):
        if ratings[i] > ratings[i - 1]:
            candies[i] = candies[i - 1] + 1
    for i in range(n - 2, -1, -1):
        if ratings[i] > ratings[i + 1]:
            candies[i] = max(candies[i], candies[i + 1] + 1)
    return sum(candies)
```

"Two passes, one in each direction, combine with max" also solves *Trapping Rain Water* (left max and right max arrays) and *Product of Array Except Self*.

## Worked problem 8: Huffman-style merging (Minimum cost to connect ropes)

**Problem.** Connecting two ropes costs the sum of their lengths. Minimum total cost to connect all ropes into one?

**Approach.** Always merge the two shortest (a min-heap). Each merge's cost is added to every later merge that includes it, so cheap ropes should be merged early and often.

```python
import heapq

def connect_ropes(lengths: list[int]) -> int:
    heapq.heapify(lengths)
    total = 0
    while len(lengths) > 1:
        a, b = heapq.heappop(lengths), heapq.heappop(lengths)
        total += a + b
        heapq.heappush(lengths, a + b)
    return total
```

This is Huffman coding's structure. *Last Stone Weight* is the max-heap mirror.

## Worked problem 9: Non-decreasing array with one change

A "check with a greedy fix" question. When `nums[i] < nums[i-1]`, you may lower `nums[i-1]` (preferred, keeps future options open) or raise `nums[i]` (only if lowering would break the previous pair).

```python
def check_possibility(nums: list[int]) -> bool:
    fixed = False
    for i in range(1, len(nums)):
        if nums[i] < nums[i - 1]:
            if fixed:
                return False
            fixed = True
            if i < 2 or nums[i - 2] <= nums[i]:
                nums[i - 1] = nums[i]          # lower the left one
            else:
                nums[i] = nums[i - 1]          # must raise the right one
    return True
```

## When greedy fails: know the counterexamples

- **Coin change with arbitrary denominations.** Coins `[1, 3, 4]`, amount 6: greedy takes 4+1+1 (3 coins); optimal is 3+3 (2 coins). Use DP.
- **0/1 knapsack by value-to-weight ratio.** Fails; use DP. (Fractional knapsack is greedy.)
- **Longest path in a graph.** No greedy works; it is NP-hard in general.
- **Interval scheduling by earliest start or shortest duration.** Both fail; earliest end is the correct key.

Having one counterexample ready per family is a strong signal to the interviewer that you understand the boundary.

## Common mistakes

- **Greedy without an argument.** Always state the exchange reason in one sentence.
- **Sorting by the wrong key.** Sketch two small examples before committing.
- **Forgetting the feasibility check** (gas station total, hand size divisible by k).
- **Confusing "extend reach" loops.** In Jump Game II, increment jumps when `i == current_end`, not when `furthest` grows.
- **Overwriting the first pass** in two-pass problems. Use `max` in the second pass.

## Practice set

**Easy**

- Assign Cookies
- Best Time to Buy and Sell Stock II (sum every positive daily difference)
- Lemonade Change
- Maximum Units on a Truck
- Can Place Flowers

**Medium**

- Jump Game, Jump Game II
- Gas Station
- Partition Labels
- Hand of Straights
- Non-overlapping Intervals, Minimum Number of Arrows
- Task Scheduler
- Boats to Save People
- Two City Scheduling
- Minimum Number of Refueling Stops (greedy with a heap)
- Remove K Digits
- Non-decreasing Array
- Bag of Tokens

**Hard**

- Candy
- Minimum Cost to Hire K Workers
- IPO
- Course Schedule III (greedy with a heap on durations)

Next: bit manipulation and the handful of maths tricks interviews actually use.
