---
title: Sorting & Intervals
part: Core Patterns
summary: When to sort and what it buys you, the two sorts you must be able to write, and the interval family: merge, insert, overlap, meeting rooms.
---

## Why interviewers love this pattern

Sorting is rarely the whole question. It is the *first step* that turns a messy problem into a pattern you already know: two pointers, a greedy sweep, binary search. Interviewers want to see you reach for it deliberately, state its O(n log n) cost, and then exploit the order.

Interval problems are the best example. Almost every one of them is "sort by start, then sweep left to right keeping track of the current merged interval".

## Sorting in Python, briefly

`list.sort()` sorts in place; `sorted(iterable)` returns a new list. Both are **stable** (equal elements keep their original order), O(n log n), and accept a `key`.

```python
people.sort(key=lambda p: (p.age, p.name))        # by age, then name
people.sort(key=lambda p: -p.score)               # descending numeric
people.sort(key=lambda p: p.name, reverse=True)   # descending, any type
intervals.sort()                                  # lists/tuples sort lexicographically
```

Stability matters when you sort twice: sort by the secondary key first, then by the primary key, and ties keep the secondary order. Or, simpler, use a tuple key.

When a custom comparison cannot be expressed as a key (rare), use `functools.cmp_to_key`. *Largest Number* is the standard example: order strings `a`, `b` by whether `a + b > b + a`.

```python
from functools import cmp_to_key

def largest_number(nums: list[int]) -> str:
    strs = sorted(map(str, nums), key=cmp_to_key(lambda a, b: -1 if a + b > b + a else 1))
    result = "".join(strs)
    return "0" if result[0] == "0" else result
```

## The sorts you should be able to write

You will not be asked to implement sorting often, but merge sort and quicksort's partition come up as building blocks, and "explain how you would sort X" is a common warm-up.

### Merge sort

Divide, sort each half, merge. O(n log n) always, O(n) extra space, stable. Its merge step is the "two arrays, one pointer each" walk from the two-pointer chapter, and it is the basis of *Count Inversions* and *Count of Smaller Numbers After Self*.

```python
def merge_sort(nums: list[int]) -> list[int]:
    if len(nums) <= 1:
        return nums
    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:                   # <= keeps it stable
            merged.append(left[i]); i += 1
        else:
            merged.append(right[j]); j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged
```

### Quickselect (k-th smallest in O(n) average)

The partition step of quicksort, applied to only one side. This is the expected answer for *Kth Largest Element in an Array* when the interviewer says "better than O(n log n)".

```python
import random

def kth_smallest(nums: list[int], k: int) -> int:        # k is 1-based
    def select(lo: int, hi: int, k_idx: int) -> int:
        if lo == hi:
            return nums[lo]
        pivot = nums[random.randint(lo, hi)]
        # three-way partition: [< pivot] [== pivot] [> pivot]
        i, lt, gt = lo, lo, hi
        while i <= gt:
            if nums[i] < pivot:
                nums[lt], nums[i] = nums[i], nums[lt]
                lt += 1; i += 1
            elif nums[i] > pivot:
                nums[gt], nums[i] = nums[i], nums[gt]
                gt -= 1
            else:
                i += 1
        if k_idx < lt:
            return select(lo, lt - 1, k_idx)
        if k_idx > gt:
            return select(gt + 1, hi, k_idx)
        return pivot

    return select(0, len(nums) - 1, k - 1)
```

The three-way partition is the Dutch-flag loop from the two-pointer chapter. Random pivots make the O(n²) worst case vanish in practice; say "average O(n), worst O(n²), and there is a deterministic median-of-medians version if needed".

### Counting sort and bucket sort

When values are small integers or when you only care about frequencies, you can beat O(n log n).

```python
def sort_colors_counting(nums: list[int]) -> None:      # values in {0, 1, 2}
    counts = [0, 0, 0]
    for v in nums:
        counts[v] += 1
    i = 0
    for value in range(3):
        for _ in range(counts[value]):
            nums[i] = value
            i += 1
```

Bucket sort by frequency gives *Top K Frequent Elements* in O(n): put each value into `buckets[frequency]`, then read the buckets from the highest frequency down.

## Intervals: the sweep

Represent an interval as `[start, end]`. Two intervals `a` and `b` (with `a.start <= b.start`) overlap exactly when `b.start <= a.end`. After sorting by start, you only ever need to compare the new interval with the *last merged one*.

## Worked problem 1: Merge intervals

```
[[1,3],[2,6],[8,10],[15,18]]  ->  [[1,6],[8,10],[15,18]]
```

```python
def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda iv: iv[0])
    merged = []
    for start, end in intervals:
        if merged and start <= merged[-1][1]:          # overlaps the last one
            merged[-1][1] = max(merged[-1][1], end)     # extend it
        else:
            merged.append([start, end])
    return merged
```

**Dry run**: sorted input is already sorted. `[1,3]` → merged `[[1,3]]`. `[2,6]`: 2 ≤ 3, extend to `[1,6]`. `[8,10]`: 8 > 6, append. `[15,18]`: append.

The `max(...)` in the extend step handles the case `[1,10], [2,3]` where the new interval is fully inside the old one.

O(n log n) for the sort, O(n) sweep.

## Worked problem 2: Insert interval

**Problem.** Intervals are sorted and non-overlapping. Insert a new one and merge as needed. Do it in O(n) without re-sorting.

**Approach.** Three phases: copy everything that ends before the new interval starts, merge everything that overlaps into the new interval, copy the rest.

```python
def insert(intervals: list[list[int]], new: list[int]) -> list[list[int]]:
    result = []
    i, n = 0, len(intervals)
    start, end = new

    while i < n and intervals[i][1] < start:           # entirely before
        result.append(intervals[i]); i += 1

    while i < n and intervals[i][0] <= end:            # overlapping: absorb
        start = min(start, intervals[i][0])
        end = max(end, intervals[i][1])
        i += 1
    result.append([start, end])

    result.extend(intervals[i:])                       # entirely after
    return result
```

## Worked problem 3: Non-overlapping intervals (minimum removals)

**Problem.** Minimum number of intervals to remove so the rest do not overlap.

**Greedy insight.** Sort by **end**. Always keep the interval that ends earliest, because it leaves the most room for the ones after it. Remove anything that starts before the current end.

```python
def erase_overlap_intervals(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda iv: iv[1])
    removed = 0
    current_end = float("-inf")
    for start, end in intervals:
        if start >= current_end:
            current_end = end            # keep it
        else:
            removed += 1                 # overlaps the kept one: drop it
    return removed
```

This is the activity-selection problem. Sorting by end rather than start is the whole trick, and it is one interviewers deliberately probe: "why not sort by start?" Answer: an early-starting interval might be very long and block many short ones.

*Minimum Number of Arrows to Burst Balloons* is the same code counting kept intervals instead of removed ones.

## Worked problem 4: Meeting rooms II

**Problem.** Given meeting times, find the minimum number of rooms needed.

**Approach A: min-heap of end times.** Sort by start. For each meeting, if the earliest-ending meeting in the heap has finished, reuse its room (pop). Push the new end. The heap size is the number of rooms in use; the maximum over time is the answer.

```python
import heapq

def min_meeting_rooms(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda iv: iv[0])
    ends = []                                     # min-heap of end times
    for start, end in intervals:
        if ends and ends[0] <= start:
            heapq.heapreplace(ends, end)          # room freed: reuse it
        else:
            heapq.heappush(ends, end)             # need a new room
    return len(ends)
```

**Approach B: two sorted arrays.** Sort starts and ends separately. Walk starts; each time a start is before the next end, a room is added; otherwise a room frees up.

```python
def min_meeting_rooms_sweep(intervals: list[list[int]]) -> int:
    starts = sorted(iv[0] for iv in intervals)
    ends = sorted(iv[1] for iv in intervals)
    rooms = best = 0
    j = 0
    for s in starts:
        if s < ends[j]:
            rooms += 1
        else:
            j += 1                                # one meeting ended, room reused
        best = max(best, rooms)
    return best
```

Approach B is the general **line sweep**: turn each interval into a +1 event at start and a −1 event at end, sort events, and track the running total. It answers "maximum overlap at any point", "is any point covered k times", and *Car Pooling* / *Corporate Flight Bookings* (with a difference array when the coordinate range is small).

```python
def max_overlap(intervals: list[list[int]]) -> int:
    events = []
    for s, e in intervals:
        events.append((s, 1))
        events.append((e, -1))
    events.sort()                                 # at equal time, -1 sorts before +1: end frees before start uses
    running = best = 0
    for _, delta in events:
        running += delta
        best = max(best, running)
    return best
```

Whether an end at time `t` frees a room before a start at time `t` needs it depends on the problem's definition of overlap; the tuple ordering `(t, -1) < (t, 1)` encodes "yes". Check the statement.

## Worked problem 5: Interval list intersections

**Problem.** Two sorted lists of disjoint intervals. Return their intersections.

**Approach.** Two pointers, one per list. The intersection of the current pair is `[max(starts), min(ends)]` if non-empty. Advance the interval that ends first.

```python
def interval_intersection(a: list[list[int]], b: list[list[int]]) -> list[list[int]]:
    i = j = 0
    result = []
    while i < len(a) and j < len(b):
        lo = max(a[i][0], b[j][0])
        hi = min(a[i][1], b[j][1])
        if lo <= hi:
            result.append([lo, hi])
        if a[i][1] < b[j][1]:
            i += 1
        else:
            j += 1
    return result
```

## Worked problem 6: Sort by a custom order, then sweep (Queue Reconstruction by Height)

**Problem.** People are `[h, k]`: height and the number of people at least as tall standing in front. Reconstruct the queue.

**Insight.** Tallest first. Sort by height descending, then by `k` ascending. Insert each person at index `k`: everyone already placed is at least as tall, so `k` is exactly the number of taller-or-equal people in front.

```python
def reconstruct_queue(people: list[list[int]]) -> list[list[int]]:
    people.sort(key=lambda p: (-p[0], p[1]))
    queue = []
    for person in people:
        queue.insert(person[1], person)
    return queue
```

O(n²) because of `insert`, which is accepted for n ≤ 2000. It is a nice example of "choose the sort order so that a simple greedy becomes correct".

## Common mistakes

- **Sorting by the wrong key.** Merge by start; select non-overlapping by end. Say why.
- **Forgetting that sort is O(n log n)** and claiming O(n).
- **Off-by-one on "touching" intervals**: `[1,2]` and `[2,3]`. Read whether the problem treats them as overlapping (`<=`) or not (`<`).
- **Mutating the input** when the problem says not to. `sorted(...)` returns a copy.
- **Using `insert` or `pop(0)` in a loop** without noticing the O(n²).

## Practice set

**Easy**

- Meeting Rooms (can one person attend all?)
- Merge Sorted Array
- Sort Array by Parity
- Relative Sort Array

**Medium**

- Merge Intervals
- Insert Interval
- Non-overlapping Intervals
- Meeting Rooms II
- Interval List Intersections
- Minimum Number of Arrows to Burst Balloons
- Kth Largest Element in an Array (quickselect)
- Sort Colors, Sort List
- Largest Number
- Car Pooling
- Queue Reconstruction by Height

**Hard**

- Employee Free Time
- Count of Smaller Numbers After Self (merge sort with index tracking)
- The Skyline Problem (sweep with a heap)

Next: recursion and backtracking, for the "generate all…" questions.
