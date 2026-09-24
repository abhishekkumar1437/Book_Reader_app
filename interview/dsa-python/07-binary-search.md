---
title: Binary Search
part: Core Patterns
summary: One template that never has off-by-one bugs, then the two ideas that unlock hard problems: search on the answer, and search on a rotated or partially sorted array.
---

## Why interviewers love this pattern

Binary search is easy to describe and notoriously easy to get wrong. Interviewers use it to check precision: boundaries, termination, and whether you can adapt it beyond "find the target". The advanced uses, searching over a range of *answers* rather than over the array, are where medium and hard problems come from.

Recognise it when:

- the input is sorted, or **partially** sorted (rotated, mountain, two sorted halves);
- you are asked for O(log n) explicitly;
- the question is "minimum value of X such that condition holds", and the condition is **monotonic** (if it holds for X it holds for all larger X);
- the constraints are huge (values up to 10⁹) while n is small.

## The template: find the first true

Most binary search bugs come from mixing up "find exact value" with "find a boundary". Use one template for everything: the array of answers to some predicate looks like `F F F F T T T`, and you want the **first T**.

```python
def first_true(lo: int, hi: int, condition) -> int:
    """Smallest x in [lo, hi] with condition(x) True. Returns hi + 1 if none."""
    while lo < hi:
        mid = (lo + hi) // 2
        if condition(mid):
            hi = mid              # mid could be the answer, keep it
        else:
            lo = mid + 1          # mid is definitely not, discard it
    return lo if condition(lo) else hi + 1
```

Why this never loops forever: `mid` is always strictly less than `hi` when `lo < hi`, so `hi = mid` shrinks the range, and `lo = mid + 1` shrinks it too. It ends with `lo == hi`.

Every classic question is this template with a different `condition`:

| Question | condition(mid) |
|---|---|
| first index with `nums[i] >= target` (lower bound) | `nums[mid] >= target` |
| first index with `nums[i] > target` (upper bound) | `nums[mid] > target` |
| does target exist | lower bound, then check `nums[i] == target` |
| first bad version | `is_bad(mid)` |
| square root (floor) | `mid * mid > x`, answer minus 1 |
| minimum in rotated array | `nums[mid] <= nums[-1]` |

Python's `bisect` module implements the first two: `bisect_left` is lower bound, `bisect_right` is upper bound. It is fine to use them in interviews for plain lookups; you will still be asked to write the loop for anything custom.

### Plain search, for completeness

```python
def search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

This closed-interval form is fine when you only need "found or not". Switch to the first-true form the moment you need a boundary.

## Worked problem 1: First and last position of a target

```
[5, 7, 7, 8, 8, 10], target = 8  ->  [3, 4]
```

**Approach.** First position is the lower bound. Last position is `upper_bound − 1`.

```python
def search_range(nums: list[int], target: int) -> list[int]:
    def lower_bound(t: int) -> int:               # first index with nums[i] >= t
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] >= t:
                hi = mid
            else:
                lo = mid + 1
        return lo

    start = lower_bound(target)
    if start == len(nums) or nums[start] != target:
        return [-1, -1]
    end = lower_bound(target + 1) - 1
    return [start, end]
```

Using `hi = len(nums)` (one past the end) lets "not found" return `len(nums)` naturally.

**Dry run** of `lower_bound(8)` on the example:

| lo | hi | mid | nums[mid] | move |
|---|---|---|---|---|
| 0 | 6 | 3 | 8 | ≥ 8, hi = 3 |
| 0 | 3 | 1 | 7 | < 8, lo = 2 |
| 2 | 3 | 2 | 7 | < 8, lo = 3 |
| 3 | 3 | | | stop, return 3 |

## Worked problem 2: Search in rotated sorted array

```
[4, 5, 6, 7, 0, 1, 2], target = 0  ->  4
```

**Key fact.** Cut a rotated array at any `mid` and at least one of the two halves is properly sorted. Check which half is sorted, check whether the target lies in that half's range, and discard the other.

```python
def search_rotated(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:                       # left half is sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                                           # right half is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1
```

**Dry run** for target 0:

| lo | hi | mid | nums[mid] | sorted half | target in it? | move |
|---|---|---|---|---|---|---|
| 0 | 6 | 3 | 7 | left [4..7] | no | lo = 4 |
| 4 | 6 | 5 | 1 | left [0..1] | yes | hi = 4 |
| 4 | 4 | 4 | 0 | found | | |

**With duplicates** (`[1, 0, 1, 1, 1]`), `nums[lo] == nums[mid] == nums[hi]` makes it impossible to tell which half is sorted. Shrink both ends by one and continue. Worst case becomes O(n); say so.

**Find the minimum** in a rotated array is cleaner with the first-true template: the condition "`nums[mid] <= nums[-1]`" is false for the first (larger) part and true for the rotated part.

```python
def find_min(nums: list[int]) -> int:
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] <= nums[hi]:
            hi = mid
        else:
            lo = mid + 1
    return nums[lo]
```

## Binary search on the answer

This is the idea that separates people who memorised binary search from people who understand it.

If a problem asks for "the minimum capacity / speed / time / size such that some task is feasible", and feasibility is monotonic (a bigger capacity is never *less* feasible), then:

1. the answer lies in a known numeric range `[lo, hi]`;
2. you can write a function `feasible(x)` that checks a candidate in O(n) or so;
3. binary search over `x` with the first-true template.

Total cost O(n log(range)). You never search the array; you search the space of possible answers.

## Worked problem 3: Koko eating bananas

**Problem.** Piles of bananas and `h` hours. Koko eats at speed `k` bananas per hour, one pile at a time (a pile of 3 at speed 5 still takes a full hour). Minimum `k` to finish in `h` hours?

```
piles = [3, 6, 7, 11], h = 8  ->  4
```

**Range.** Speed 1 is the slowest sensible; `max(piles)` always works.

**Feasible(k).** Total hours `= sum(ceil(p / k))`, must be `<= h`. Monotonic: faster never takes more hours.

```python
def min_eating_speed(piles: list[int], h: int) -> int:
    def hours(k: int) -> int:
        return sum((p + k - 1) // k for p in piles)     # ceiling division

    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if hours(mid) <= h:
            hi = mid
        else:
            lo = mid + 1
    return lo
```

**Dry run**: lo=1, hi=11. mid=6 → hours 1+1+2+2=6 ≤ 8, hi=6. mid=3 → 1+2+3+4=10 > 8, lo=4. mid=5 → 1+2+2+3=8 ≤ 8, hi=5. mid=4 → 1+2+2+3=8 ≤ 8, hi=4. Answer 4.

`(p + k - 1) // k` is the integer ceiling. Know it; `math.ceil(p / k)` also works but floats can bite for huge numbers.

## Worked problem 4: Capacity to ship packages within D days

**Problem.** Weights in order, must ship in order, `days` days. Minimum ship capacity?

**Range.** `max(weights)` (must fit the largest) to `sum(weights)` (ship all in one day).

**Feasible(cap).** Greedy: fill the current day until adding the next weight would exceed `cap`, then start a new day. Count days.

```python
def ship_within_days(weights: list[int], days: int) -> int:
    def days_needed(cap: int) -> int:
        count, load = 1, 0
        for w in weights:
            if load + w > cap:
                count += 1
                load = 0
            load += w
        return count

    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if days_needed(mid) <= days:
            hi = mid
        else:
            lo = mid + 1
    return lo
```

*Split Array Largest Sum* is the identical problem with different words. *Minimum Number of Days to Make m Bouquets*, *Magnetic Force Between Balls*, and *Minimise Max Distance to Gas Station* all use the same skeleton with a different feasibility check.

> **Interview tip:** When you recognise search-on-answer, say the three parts explicitly: "The answer is between A and B, feasibility is monotonic because ..., and I can check feasibility in O(n). So I binary search the answer." That sentence is worth more than the code.

## Worked problem 5: Find peak element

**Problem.** `nums[i] != nums[i+1]` for all i. Return any index that is greater than its neighbours, in O(log n).

**Insight.** If `nums[mid] < nums[mid + 1]`, there must be a peak to the right (the array must eventually come down or end, and the end counts as a peak). Otherwise there is one to the left or at `mid`.

```python
def find_peak_element(nums: list[int]) -> int:
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < nums[mid + 1]:
            lo = mid + 1
        else:
            hi = mid
    return lo
```

`mid + 1` is always valid because `mid < hi` when `lo < hi`. This is the first-true template with the condition "we are on a descending slope".

## Worked problem 6: Median of two sorted arrays

The classic hard binary search. You are unlikely to be asked to derive it cold, but you should be able to explain the idea and write it with a hint.

**Idea.** Partition the shorter array `A` at index `i` and the longer array `B` at `j = half − i`, so the left parts together hold half of all elements. The partition is correct when every left element ≤ every right element: `A[i−1] <= B[j]` and `B[j−1] <= A[i]`. Binary search over `i`.

```python
def find_median_sorted_arrays(a: list[int], b: list[int]) -> float:
    if len(a) > len(b):
        a, b = b, a                                 # binary search on the shorter one
    m, n = len(a), len(b)
    half = (m + n + 1) // 2
    lo, hi = 0, m
    INF = float("inf")
    while lo <= hi:
        i = (lo + hi) // 2                          # elements of a on the left side
        j = half - i                                # elements of b on the left side
        a_left = a[i - 1] if i > 0 else -INF
        a_right = a[i] if i < m else INF
        b_left = b[j - 1] if j > 0 else -INF
        b_right = b[j] if j < n else INF
        if a_left <= b_right and b_left <= a_right:
            if (m + n) % 2:
                return max(a_left, b_left)
            return (max(a_left, b_left) + min(a_right, b_right)) / 2
        if a_left > b_right:
            hi = i - 1                              # too many from a
        else:
            lo = i + 1                              # too few from a
    raise ValueError("inputs not sorted")
```

O(log(min(m, n))).

## Common mistakes

- **Infinite loop** from `lo = mid` without the `+ 1` in a `while lo < hi` loop. In the first-true template, `hi = mid` and `lo = mid + 1`, never the other way round.
- **Wrong initial `hi`.** For "index of first element ≥ target", `hi = len(nums)` so that "none" is representable. For exact-match search, `hi = len(nums) − 1`.
- **Checking `nums[mid]` for the target** in boundary problems. That short-circuit returns *a* match, not the *first* match.
- **Non-monotonic condition.** If `feasible(x)` can go true → false → true, binary search is invalid. Verify monotonicity before you start.
- **Integer overflow with `(lo + hi) // 2`.** Not an issue in Python; mention that it would be in other languages if asked.
- **Feasibility function that is too slow.** If checking a candidate is O(n²), the total may be worse than a direct approach.

## Practice set

**Easy**

- Binary Search
- First Bad Version
- Search Insert Position
- Sqrt(x)
- Valid Perfect Square

**Medium**

- Find First and Last Position of Element in Sorted Array
- Search in Rotated Sorted Array (I and II)
- Find Minimum in Rotated Sorted Array
- Find Peak Element
- Koko Eating Bananas
- Capacity To Ship Packages Within D Days
- Search a 2D Matrix (treat as a flat sorted array; index `r = mid // cols`, `c = mid % cols`)
- Time Based Key-Value Store (bisect over timestamps)
- Minimum Number of Days to Make m Bouquets

**Hard**

- Median of Two Sorted Arrays
- Split Array Largest Sum
- Kth Smallest Element in a Sorted Matrix (search on value, count with a staircase walk)

Next: sorting, and the interval problems that are really "sort, then sweep".
