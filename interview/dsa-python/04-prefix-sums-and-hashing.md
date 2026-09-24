---
title: Prefix Sums & Hashing
part: Core Patterns
summary: Trade memory for speed. Answer range queries in O(1), count subarrays by sum with a hash map, and use dictionaries as the universal interview shortcut.
---

## Why interviewers love this pattern

A hash map is the single most useful tool in a coding interview. It converts "have I seen this before?" from O(n) to O(1), and that one change is behind a large fraction of all optimal solutions. Prefix sums are the array-specific version of the same trade: precompute once so each later query is instant.

Recognise these when you see:

- "sum of elements between index i and j" asked many times;
- "subarray with sum equal to k", "count subarrays whose sum is divisible by k";
- "two elements that satisfy a relationship" (sum, difference, product) on unsorted data;
- "group by", "find duplicates", "first unique", "anagrams";
- any O(n²) brute force whose inner loop is a lookup.

## Hashing: the core moves

You know `dict` and `set`. What matters in interviews is the *pattern* of use.

### Complement lookup (Two Sum on unsorted input)

Walk once. For each value, ask whether the value that would complete the answer was already seen.

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}                             # value -> index
    for i, value in enumerate(nums):
        need = target - value
        if need in seen:
            return [seen[need], i]
        seen[value] = i                   # add AFTER checking, so an element is not paired with itself
    return []
```

O(n) time, O(n) space. Sorting plus two pointers would be O(n log n) and would lose the original indices, which is why the hash map is the standard answer here.

### Grouping by a canonical key

To group anagrams, pick a key that is identical for all members of a group: the sorted string, or a tuple of 26 counts.

```python
from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = [0] * 26
        for c in s:
            key[ord(c) - ord("a")] += 1
        groups[tuple(key)].append(s)      # lists are not hashable; tuples are
    return list(groups.values())
```

The count-tuple key is O(len(s)) per string; the sorted-string key is O(len(s) log len(s)). Both are accepted; mention the difference.

### Counting with Counter

```python
from collections import Counter

def first_unique_char(s: str) -> int:
    counts = Counter(s)
    for i, c in enumerate(s):
        if counts[c] == 1:
            return i
    return -1

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    return [value for value, _ in Counter(nums).most_common(k)]
```

`most_common` sorts, so it is O(n log n). For a guaranteed O(n) solution use bucket sort by frequency (shown in the heaps chapter).

### Set for O(1) membership: longest consecutive sequence

**Problem.** Unsorted integers. Length of the longest run of consecutive values, in O(n).

```
[100, 4, 200, 1, 3, 2]  ->  4  (1, 2, 3, 4)
```

The trick: only start counting from a number that is the *start* of a run, meaning `num - 1` is absent. Each number is then visited a constant number of times overall.

```python
def longest_consecutive(nums: list[int]) -> int:
    values = set(nums)
    best = 0
    for num in values:
        if num - 1 in values:
            continue                      # not a run start
        length = 1
        while num + length in values:
            length += 1
        best = max(best, length)
    return best
```

Without the `num - 1` check this is O(n²) on sorted input. Interviewers know this and will test you on it.

## Prefix sums: the core idea

Build `prefix[i]` = sum of the first `i` elements, with `prefix[0] = 0`. Then any range sum is one subtraction:

```
sum(nums[i..j]) = prefix[j + 1] - prefix[i]
```

```python
def build_prefix(nums: list[int]) -> list[int]:
    prefix = [0] * (len(nums) + 1)
    for i, value in enumerate(nums):
        prefix[i + 1] = prefix[i] + value
    return prefix

# nums = [3, 1, 4, 1, 5]  ->  prefix = [0, 3, 4, 8, 9, 14]
# sum(nums[1..3]) = 1 + 4 + 1 = 6 = prefix[4] - prefix[1] = 9 - 3
```

Using length `n + 1` with a leading zero avoids the special case for ranges starting at 0. Always do it this way.

The same idea works for any operation that has an inverse: XOR (its own inverse), products (if no zeros), and counts of some property ("number of vowels up to index i").

## Worked problem 1: Subarray sum equals k

**Problem.** Count the contiguous subarrays whose elements sum to `k`. Values can be negative.

```
[1, 2, 3], k = 3  ->  2   ([1,2] and [3])
[1, -1, 0], k = 0 ->  3
```

**Why not sliding window.** Negatives break the monotonic shrink argument.

**Approach.** A subarray `nums[i..j]` sums to `k` exactly when `prefix[j+1] - prefix[i] == k`, so `prefix[i] == prefix[j+1] - k`. Walk left to right maintaining a running prefix sum and a map from *prefix value → how many times seen*. At each position, the number of valid subarrays ending here equals `seen[current - k]`.

```python
from collections import defaultdict

def subarray_sum(nums: list[int], k: int) -> int:
    seen = defaultdict(int)
    seen[0] = 1                    # empty prefix: a subarray starting at index 0
    running = 0
    count = 0
    for value in nums:
        running += value
        count += seen[running - k]
        seen[running] += 1
    return count
```

**Dry run** on `[1, 2, 3]`, k = 3:

| value | running | running − k | seen[running − k] | count | seen after |
|---|---|---|---|---|---|
| 1 | 1 | −2 | 0 | 0 | {0:1, 1:1} |
| 2 | 3 | 0 | 1 | 1 | {0:1, 1:1, 3:1} |
| 3 | 6 | 3 | 1 | 2 | {0:1, 1:1, 3:1, 6:1} |

**Complexity.** O(n) time and space.

The `seen[0] = 1` line is the one people forget. Without it, subarrays that start at index 0 are never counted.

> **Interview tip:** This "running prefix + hash map of earlier prefixes" pattern is a family. The same skeleton solves: subarray sum divisible by k (store `running % k`), contiguous array with equal 0s and 1s (treat 0 as −1, look for `running` seen before), longest subarray with sum k (store first index instead of count), and binary subarrays with sum.

## Worked problem 2: Subarray sums divisible by k

**Problem.** Count subarrays whose sum is divisible by `k`.

```
[4, 5, 0, -2, -3, 1], k = 5  ->  7
```

**Approach.** Two prefixes with the same remainder mod `k` bracket a subarray divisible by `k`. Python's `%` already returns a non-negative result for positive `k`, which sidesteps the negative-remainder bug other languages have.

```python
def subarrays_div_by_k(nums: list[int], k: int) -> int:
    remainder_count = [0] * k
    remainder_count[0] = 1
    running = 0
    count = 0
    for value in nums:
        running = (running + value) % k
        count += remainder_count[running]
        remainder_count[running] += 1
    return count
```

## Worked problem 3: Contiguous array (equal 0s and 1s)

**Problem.** Longest contiguous subarray with the same number of 0s and 1s.

**Approach.** Map 0 → −1. Then "equal count" means "sum zero", so we want the longest gap between two equal prefix values. Store the *first* index each prefix value was seen.

```python
def find_max_length(nums: list[int]) -> int:
    first_seen = {0: -1}          # prefix value -> earliest index
    running = 0
    best = 0
    for i, value in enumerate(nums):
        running += 1 if value == 1 else -1
        if running in first_seen:
            best = max(best, i - first_seen[running])
        else:
            first_seen[running] = i
    return best
```

Note the difference from problem 1: here we store the earliest index and never overwrite, because we want the longest span.

## Worked problem 4: Product of array except self

**Problem.** Return an array where `output[i]` is the product of all elements except `nums[i]`, without division, in O(n).

```
[1, 2, 3, 4]  ->  [24, 12, 8, 6]
```

**Approach.** Prefix products from the left, suffix products from the right, multiplied. Do it in the output array to keep O(1) extra space.

```python
def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    output = [1] * n
    left = 1
    for i in range(n):                 # output[i] = product of everything to the left
        output[i] = left
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):     # multiply in product of everything to the right
        output[i] *= right
        right *= nums[i]
    return output
```

**Dry run** on `[1, 2, 3, 4]`: after the first pass `output = [1, 1, 2, 6]`. Second pass from the right with `right` = 1, 4, 12, 24 gives `[24, 12, 8, 6]`.

## Worked problem 5: Range sum query, 2D

**Problem.** Preprocess a matrix so that the sum of any rectangle can be returned in O(1).

**Approach.** 2D prefix: `P[r][c]` = sum of the rectangle from `(0,0)` to `(r-1, c-1)`. Use an extra row and column of zeros, same reason as in 1D.

```python
class NumMatrix:
    def __init__(self, matrix: list[list[int]]):
        rows, cols = len(matrix), len(matrix[0])
        self.P = [[0] * (cols + 1) for _ in range(rows + 1)]
        for r in range(rows):
            for c in range(cols):
                self.P[r + 1][c + 1] = (
                    matrix[r][c]
                    + self.P[r][c + 1]      # above
                    + self.P[r + 1][c]      # left
                    - self.P[r][c]          # counted twice
                )

    def sum_region(self, r1: int, c1: int, r2: int, c2: int) -> int:
        P = self.P
        return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1]
```

The inclusion-exclusion signs are the whole trick. Draw the four rectangles once and it stays with you.

## Worked problem 6: LRU cache

This is a design question, but it lives here because the answer is a hash map plus a doubly linked list, and it is asked extremely often.

**Problem.** Implement `get(key)` and `put(key, value)` in O(1), evicting the least recently used entry when capacity is exceeded.

**Approach.** The dictionary gives O(1) lookup. The linked list keeps recency order so that moving an entry to the front and removing from the back are O(1). Sentinel head and tail nodes remove all null checks.

```python
class Node:
    __slots__ = ("key", "val", "prev", "next")
    def __init__(self, key: int = 0, val: int = 0):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.map: dict[int, Node] = {}
        self.head, self.tail = Node(), Node()      # head.next is most recent
        self.head.next, self.tail.prev = self.tail, self.head

    def _remove(self, node: Node) -> None:
        node.prev.next, node.next.prev = node.next, node.prev

    def _add_front(self, node: Node) -> None:
        node.next, node.prev = self.head.next, self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.map:
            return -1
        node = self.map[key]
        self._remove(node)
        self._add_front(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.map:
            self._remove(self.map[key])
        node = Node(key, value)
        self.map[key] = node
        self._add_front(node)
        if len(self.map) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.map[lru.key]
```

**The Python shortcut.** `collections.OrderedDict` does all of this: `move_to_end(key)` and `popitem(last=False)`. Interviewers usually let you mention it but want the linked-list version written. Know both.

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.data = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.data:
            return -1
        self.data.move_to_end(key)
        return self.data[key]

    def put(self, key: int, value: int) -> None:
        if key in self.data:
            self.data.move_to_end(key)
        self.data[key] = value
        if len(self.data) > self.cap:
            self.data.popitem(last=False)
```

## Common mistakes

- **Forgetting the empty prefix** (`seen[0] = 1` or `first_seen[0] = -1`). It represents subarrays that start at index 0.
- **Inserting into the map before checking** in Two Sum, pairing an element with itself.
- **Using a list as a dictionary key.** Convert to a tuple.
- **Overwriting first-seen indices** when the problem asks for the longest span.
- **Confusing "count of subarrays" with "longest subarray".** The first stores counts, the second stores earliest indices.
- **Off-by-one with prefix arrays** when you skip the leading zero. Just always include it.

## Practice set

**Easy**

- Two Sum
- Contains Duplicate
- Valid Anagram
- Range Sum Query, Immutable
- Find Pivot Index

**Medium**

- Group Anagrams
- Subarray Sum Equals K
- Contiguous Array
- Subarray Sums Divisible by K
- Product of Array Except Self
- Longest Consecutive Sequence
- Range Sum Query 2D, Immutable
- LRU Cache
- Insert Delete GetRandom O(1) (hash map plus list with swap-remove)

**Hard**

- LFU Cache
- Count of Range Sum (prefix sums plus merge sort)

Next: stacks, and the monotonic stack pattern that answers "next greater element" questions in one pass.
