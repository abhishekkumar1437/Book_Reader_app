---
title: Heaps & Top-K
part: Core Patterns
summary: The priority queue in Python, the size-k heap trick, merging k sorted things, the two-heap median, and heap-based scheduling.
---

## Why interviewers love this pattern

A heap gives you the smallest (or largest) item in O(1) and lets you insert or remove in O(log n). That is exactly what you need whenever a problem repeatedly asks "what is the current best?": the k largest elements, the next smallest among k lists, the running median, the task that should run next.

Recognise it when you read:

- "k largest / k smallest / k most frequent / k closest";
- "merge k sorted...";
- "median of a stream", "running statistics";
- "schedule tasks", "minimum cost to connect", "process in order of priority";
- anything where sorting fully would be O(n log n) but you only need part of the order.

## Python's heapq, briefly

`heapq` turns a plain list into a **min-heap**. There is no max-heap; negate the values.

```python
import heapq

heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 1)
smallest = heapq.heappop(heap)         # 1
peek = heap[0]                         # smallest without removing

heapq.heapify(nums)                    # O(n) in-place build; faster than n pushes

heapq.heappushpop(heap, x)             # push x, then pop smallest (faster than two calls)
heapq.heapreplace(heap, x)             # pop smallest, then push x

heapq.nlargest(k, nums)                # convenience; O(n log k)
heapq.nsmallest(k, nums, key=len)
```

Tuples compare element by element, so `(priority, payload)` works. If payloads might be compared and are not comparable (objects, dicts), add a tie-breaker counter: `(priority, index, payload)`.

For a **max-heap**, push `-value` and negate on the way out.

| Operation | Cost |
|---|---|
| peek | O(1) |
| push, pop | O(log n) |
| heapify | O(n) |
| find arbitrary element, delete arbitrary | O(n), heaps are not for this |

## The size-k heap trick

To find the **k largest** elements, keep a **min-heap of size k**. For each element, push it; if the heap exceeds k, pop the smallest. What remains after the pass is the k largest, and the root is the k-th largest. O(n log k) time, O(k) space, which beats sorting when k is small, and works on a stream.

```python
def k_largest(nums: list[int], k: int) -> list[int]:
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap                      # any order; sort if needed
```

Symmetrically, for the **k smallest** keep a max-heap of size k (negated values).

The naming trips people up. Say it as: *"To keep the k largest, I evict the smallest, so I need fast access to the smallest: a min-heap."*

## Worked problem 1: Kth largest element in an array

```
[3, 2, 1, 5, 6, 4], k = 2  ->  5
```

```python
def find_kth_largest(nums: list[int], k: int) -> int:
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]
```

**Dry run**, k = 2: push 3 → [3]; push 2 → [2,3]; push 1 → [1,2,3], pop 1 → [2,3]; push 5 → [2,3,5], pop 2 → [3,5]; push 6 → pop 3 → [5,6]; push 4 → pop 4 → [5,6]. Root 5.

Interviewers usually ask for the O(n) average alternative: quickselect (sorting chapter). Know both and the trade-off: heap is O(n log k), streaming-friendly, simple; quickselect is O(n) average, in-place, but O(n²) worst case.

*Kth Largest Element in a Stream* is the same heap kept alive in a class with an `add` method.

## Worked problem 2: Top k frequent elements

**Approach.** Count, then size-k heap on `(count, value)`.

```python
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    heap = []
    for value, count in counts.items():
        heapq.heappush(heap, (count, value))
        if len(heap) > k:
            heapq.heappop(heap)
    return [value for _, value in heap]
```

O(n log k). For the O(n) follow-up, bucket by frequency:

```python
def top_k_frequent_bucket(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]      # index = frequency
    for value, count in counts.items():
        buckets[count].append(value)
    result = []
    for freq in range(len(buckets) - 1, 0, -1):
        for value in buckets[freq]:
            result.append(value)
            if len(result) == k:
                return result
    return result
```

## Worked problem 3: K closest points to the origin

Distance `x² + y²` (no need for the square root). Max-heap of size k on negated distance.

```python
def k_closest(points: list[list[int]], k: int) -> list[list[int]]:
    heap = []
    for x, y in points:
        heapq.heappush(heap, (-(x * x + y * y), x, y))
        if len(heap) > k:
            heapq.heappop(heap)
    return [[x, y] for _, x, y in heap]
```

## Worked problem 4: Merge k sorted lists

**Problem.** Merge k sorted linked lists into one sorted list.

**Approach.** Put the head of every list in a min-heap keyed by value. Pop the smallest, append it to the output, and push its successor. Each node enters the heap once: O(N log k) where N is the total number of nodes.

```python
def merge_k_lists(lists: list[Optional[ListNode]]) -> Optional[ListNode]:
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))    # i breaks ties; nodes are not comparable
    dummy = ListNode()
    tail = dummy
    while heap:
        _, i, node = heapq.heappop(heap)
        tail.next = node
        tail = node
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next
```

The `i` in the tuple is the tie-breaker that prevents Python from comparing `ListNode` objects when values are equal. Forgetting it produces a `TypeError` in the interview.

The same "heap of iterators" shape solves: *Smallest Range Covering Elements from K Lists*, *Kth Smallest Element in a Sorted Matrix* (each row is a list), *Find K Pairs with Smallest Sums*.

## Worked problem 5: Find median from a data stream

**Problem.** Support `add_num(x)` and `find_median()` efficiently.

**Approach.** Two heaps. A max-heap `low` holds the smaller half, a min-heap `high` holds the larger half. Keep them balanced so that `low` has the same size as `high` or one more. The median is then the top of `low`, or the average of both tops.

```python
class MedianFinder:
    def __init__(self):
        self.low = []        # max-heap (negated), smaller half
        self.high = []       # min-heap, larger half

    def add_num(self, num: int) -> None:
        heapq.heappush(self.low, -num)                              # 1. push to low
        heapq.heappush(self.high, -heapq.heappop(self.low))         # 2. move low's max to high
        if len(self.high) > len(self.low):                          # 3. rebalance
            heapq.heappush(self.low, -heapq.heappop(self.high))

    def find_median(self) -> float:
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) / 2
```

The three-step `add_num` is the version that is hard to get wrong: always push to `low`, always move the max across, then fix the size. Every element that ends up in `high` is guaranteed larger than everything in `low`.

**Dry run** adding 5, 2, 8: after 5 → low [5], high []. After 2 → push to low [5,2], move 5 to high: low [2], high [5]; sizes equal. Median (2+5)/2 = 3.5. After 8 → low [8,2], move 8: low [2], high [5,8]; high bigger, move 5 back: low [5,2], high [8]. Median 5.

Follow-up: "what if numbers are in [0, 100]?" Counting array. "What if 99% are in [0, 100]?" Counting array plus heaps for outliers.

## Worked problem 6: Task scheduler

**Problem.** Tasks labelled A–Z, each takes one unit; identical tasks must be at least `n` units apart. Minimum total time (idle allowed)?

**Approach with a heap.** Always run the most frequent remaining task. Simulate in rounds of `n + 1` slots: pop up to `n + 1` tasks, run them, decrement, push back what is left.

```python
from collections import Counter

def least_interval(tasks: list[str], n: int) -> int:
    heap = [-c for c in Counter(tasks).values()]
    heapq.heapify(heap)
    time = 0
    while heap:
        round_tasks = []
        for _ in range(n + 1):
            if heap:
                round_tasks.append(heapq.heappop(heap) + 1)   # run one unit (counts are negative)
        for c in round_tasks:
            if c < 0:
                heapq.heappush(heap, c)
        time += (n + 1) if heap else len(round_tasks)         # last round: no idle padding
    return time
```

There is also an O(n) formula answer: `max(len(tasks), (max_count - 1) * (n + 1) + number_of_tasks_with_max_count)`. Give the formula if you remember it; the heap simulation is the safer derivation.

## Worked problem 7: Reorganize string

**Problem.** Rearrange so no two adjacent characters are equal, or return `""`.

**Approach.** Greedy with a max-heap by count: always place the most frequent character that is *not the one just placed*. Hold the previous character out of the heap for one step.

```python
def reorganize_string(s: str) -> str:
    heap = [(-c, ch) for ch, c in Counter(s).items()]
    heapq.heapify(heap)
    result = []
    prev = None                                       # (count, char) waiting to re-enter
    while heap:
        count, ch = heapq.heappop(heap)
        result.append(ch)
        if prev and prev[0] < 0:
            heapq.heappush(heap, prev)
        prev = (count + 1, ch)                        # one fewer of ch remains
    return "".join(result) if len(result) == len(s) else ""
```

If the heap empties while `prev` still has remaining count, the arrangement is impossible and the length check catches it.

## When a heap is the wrong tool

- **Need to delete or update an arbitrary element.** Heaps cannot find it. Use *lazy deletion*: keep a "removed" set or a version number and skip stale entries when they surface at the top. Dijkstra (graphs chapter) does exactly this.
- **Need sorted iteration of everything.** Just sort.
- **Need both min and max, or order statistics.** A sorted container (there is none in the standard library; mention `sortedcontainers` or a balanced BST) or two heaps.
- **k is close to n.** Sorting is simpler and just as fast.

## Common mistakes

- **Building a max-heap by passing `reverse=True`.** There is no such flag; negate.
- **Comparing non-comparable objects** in tuples. Add an index tie-breaker.
- **Popping from an empty heap** in simulations. Check `if heap` first.
- **Using `heap[0]` after `heapify` on an empty list.** Index error.
- **Claiming O(n log n) for the size-k trick.** It is O(n log k); say the difference.
- **Sorting inside a loop** to get the max each time. That is the O(n² log n) solution the heap is supposed to replace.

## Practice set

**Easy**

- Kth Largest Element in a Stream
- Last Stone Weight
- Relative Ranks

**Medium**

- Kth Largest Element in an Array
- Top K Frequent Elements, Top K Frequent Words
- K Closest Points to Origin
- Task Scheduler
- Reorganize String
- Meeting Rooms II (sorting chapter)
- Kth Smallest Element in a Sorted Matrix
- Find K Pairs with Smallest Sums
- Design Twitter (merge k feeds)
- Single-Threaded CPU (heap of ready tasks)
- Furthest Building You Can Reach

**Hard**

- Merge k Sorted Lists
- Find Median from Data Stream
- Sliding Window Median
- IPO (two heaps)
- Minimum Cost to Hire K Workers

Next: graphs, starting with the two traversals that solve most of them.
