---
title: Sliding Window
part: Core Patterns
summary: Track a contiguous range with two moving ends. Fixed-size windows, the grow-then-shrink template, and the classic substring problems.
---

## Why interviewers love this pattern

Any question about a **contiguous subarray or substring** that must satisfy some condition is a candidate for sliding window. The brute force is to check every `(start, end)` pair, O(n²) or worse. A sliding window does it in O(n) because each end of the range only ever moves forward.

Recognise it when you read:

- "longest / shortest substring (or subarray) such that..."
- "contains at most k distinct...", "at most k zeros...", "sum at least target..."
- "find all anagrams of...", "permutation in string..."
- "maximum sum of any k consecutive elements"

If the condition is about the *whole* array or about non-contiguous picks, it is not sliding window.

## The idea

A window is a range `[left, right]`. `right` grows the window by one element at a time. When the window becomes invalid, `left` shrinks it until it is valid again. You maintain a small summary of what is inside the window (a count, a sum, a dictionary of frequencies) so that checking validity is O(1).

Every element is added once (when `right` passes it) and removed at most once (when `left` passes it). That is why the total work is O(n) even though there is a loop inside a loop.

### Fixed-size window

When the size `k` is given, the window slides one step at a time: add the new element, remove the one that fell out.

```python
def max_sum_of_k(nums: list[int], k: int) -> int:
    window = sum(nums[:k])
    best = window
    for right in range(k, len(nums)):
        window += nums[right] - nums[right - k]   # slide by one
        best = max(best, window)
    return best
```

### Variable-size window (grow, then shrink)

This is the template you will use most. Memorise its shape.

```python
def longest_valid_window(nums):
    left = 0
    state = ...                       # whatever describes the window: sum, counter, set
    best = 0
    for right in range(len(nums)):
        add nums[right] to state      # 1. grow

        while window is invalid:      # 2. shrink until valid
            remove nums[left] from state
            left += 1

        best = max(best, right - left + 1)   # 3. record (window is valid here)
    return best
```

For **shortest** windows the order flips: shrink *while the window is still valid* and record before each shrink.

```python
def shortest_valid_window(nums):
    left = 0
    best = float("inf")
    for right in range(len(nums)):
        add nums[right]
        while window is valid:
            best = min(best, right - left + 1)
            remove nums[left]
            left += 1
    return best if best != float("inf") else 0
```

> **Interview tip:** Say which kind you are building before you write it. "This is a longest-window problem, so I grow with `right`, shrink while invalid, and record after shrinking." The interviewer then knows exactly what to expect from your code.

## Worked problem 1: Longest substring without repeating characters

**Problem.** Return the length of the longest substring of `s` with all distinct characters.

```
"abcabcbb" -> 3 ("abc")      "pwwkew" -> 3 ("wke")
```

**State.** The set of characters in the window. Invalid when the new character is already in the set.

```python
def length_of_longest_substring(s: str) -> int:
    seen = set()
    left = 0
    best = 0
    for right, ch in enumerate(s):
        while ch in seen:                # shrink until ch can be added
            seen.remove(s[left])
            left += 1
        seen.add(ch)
        best = max(best, right - left + 1)
    return best
```

**Dry run** on `"pwwkew"`:

| right | ch | window before | action | window after | best |
|---|---|---|---|---|---|
| 0 | p | "" | add | "p" | 1 |
| 1 | w | "p" | add | "pw" | 2 |
| 2 | w | "pw" | w seen: drop p, drop w, add w | "w" | 2 |
| 3 | k | "w" | add | "wk" | 2 |
| 4 | e | "wk" | add | "wke" | 3 |
| 5 | w | "wke" | w seen: drop w, add w | "kew" | 3 |

**Faster variant.** Store the last index of each character instead of a set. Then when a repeat appears you jump `left` directly instead of shrinking one by one:

```python
def length_of_longest_substring(s: str) -> int:
    last = {}
    left = best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best
```

The `last[ch] >= left` check matters: a stale index from before the current window must be ignored.

**Complexity.** O(n) time, O(min(n, alphabet)) space.

## Worked problem 2: Longest substring with at most k distinct characters

**Problem.** Return the length of the longest substring containing at most `k` distinct characters.

```
"eceba", k = 2  ->  3 ("ece")
```

**State.** A frequency map. Invalid when `len(freq) > k`. Remember to delete keys whose count hits zero, otherwise `len(freq)` lies.

```python
from collections import defaultdict

def longest_k_distinct(s: str, k: int) -> int:
    freq = defaultdict(int)
    left = best = 0
    for right, ch in enumerate(s):
        freq[ch] += 1
        while len(freq) > k:
            freq[s[left]] -= 1
            if freq[s[left]] == 0:
                del freq[s[left]]
            left += 1
        best = max(best, right - left + 1)
    return best
```

The same code with `k = 2` solves *Fruit Into Baskets*. With `k = 1` it finds the longest run of one character.

## Worked problem 3: Minimum size subarray sum

**Problem.** Positive integers `nums` and a `target`. Return the length of the shortest contiguous subarray whose sum is at least `target`, or 0.

```
[2, 3, 1, 2, 4, 3], target = 7  ->  2  ([4, 3])
```

**State.** The window sum. This is a *shortest* window, so shrink while valid.

```python
def min_subarray_len(target: int, nums: list[int]) -> int:
    left = 0
    total = 0
    best = float("inf")
    for right, value in enumerate(nums):
        total += value
        while total >= target:
            best = min(best, right - left + 1)
            total -= nums[left]
            left += 1
    return 0 if best == float("inf") else best
```

**Why positivity matters.** Shrinking only reduces the sum if all numbers are positive. With negatives, a smaller window could have a larger sum and the pointer logic breaks. For that case you need prefix sums with a monotonic deque (chapter on stacks) or a different method. Interviewers ask this follow-up on purpose.

## Worked problem 4: Minimum window substring

**Problem.** Return the smallest substring of `s` that contains every character of `t` (with multiplicity). Empty string if none.

```
s = "ADOBECODEBANC", t = "ABC"  ->  "BANC"
```

**State.** A `need` map of what `t` requires, and a counter `formed` of how many distinct characters currently meet their requirement. The window is valid when `formed == len(need)`.

```python
from collections import Counter

def min_window(s: str, t: str) -> str:
    if not t or not s:
        return ""
    need = Counter(t)
    window = {}
    formed = 0                      # characters whose count in window >= need
    required = len(need)
    left = 0
    best = (float("inf"), 0, 0)     # (length, start, end)

    for right, ch in enumerate(s):
        window[ch] = window.get(ch, 0) + 1
        if ch in need and window[ch] == need[ch]:
            formed += 1

        while formed == required:                       # valid: try to shrink
            if right - left + 1 < best[0]:
                best = (right - left + 1, left, right)
            out = s[left]
            window[out] -= 1
            if out in need and window[out] < need[out]:
                formed -= 1
            left += 1

    return "" if best[0] == float("inf") else s[best[1]:best[2] + 1]
```

**Dry run sketch.** The window grows to `"ADOBEC"` (first time all of A, B, C present), shrinks to `"ADOBEC"` still since A is needed at index 0. Later grows to `"...CODEBA"`, then shrinks from the left dropping characters until formed drops. Eventually `"BANC"` (length 4) wins.

**Complexity.** O(|s| + |t|) time, O(alphabet) space. This is the hardest standard sliding-window question; if you can write it from memory, the easier ones fall out.

## Worked problem 5: Find all anagrams in a string

**Problem.** Return every start index where an anagram of `p` begins in `s`.

```
s = "cbaebabacd", p = "abc"  ->  [0, 6]
```

**Approach.** Fixed window of size `len(p)`. Compare frequency arrays. Comparing two 26-length arrays is O(26) = O(1), so the whole thing is O(n).

```python
def find_anagrams(s: str, p: str) -> list[int]:
    k = len(p)
    if k > len(s):
        return []
    need = [0] * 26
    have = [0] * 26
    idx = lambda c: ord(c) - ord("a")

    for c in p:
        need[idx(c)] += 1
    for c in s[:k]:
        have[idx(c)] += 1

    result = [0] if have == need else []
    for right in range(k, len(s)):
        have[idx(s[right])] += 1            # enter
        have[idx(s[right - k])] -= 1        # leave
        if have == need:
            result.append(right - k + 1)
    return result
```

*Permutation in String* is the same code returning `True` on the first match.

## Worked problem 6: Max consecutive ones with k flips

**Problem.** Binary array, you may flip at most `k` zeros to ones. Longest run of ones after flipping?

```
[1,1,1,0,0,0,1,1,1,1,0], k = 2  ->  6
```

**Reframe.** Longest window containing at most `k` zeros. State: count of zeros.

```python
def longest_ones(nums: list[int], k: int) -> int:
    left = zeros = best = 0
    for right, value in enumerate(nums):
        if value == 0:
            zeros += 1
        while zeros > k:
            if nums[left] == 0:
                zeros -= 1
            left += 1
        best = max(best, right - left + 1)
    return best
```

The "reframe as at most k of something" move is worth remembering. *Longest Repeating Character Replacement* is the same idea: window is valid while `window_length - max_frequency <= k`.

## A note on the "at most k" trick for counting

Some problems ask to **count** subarrays with **exactly** `k` of something (for example, exactly `k` odd numbers). Sliding window handles "at most" naturally, and:

```
exactly(k) = at_most(k) - at_most(k - 1)
```

```python
def count_at_most(nums: list[int], k: int) -> int:
    left = odd = count = 0
    for right, value in enumerate(nums):
        odd += value % 2
        while odd > k:
            odd -= nums[left] % 2
            left += 1
        count += right - left + 1     # every subarray ending at right with start in [left, right]
    return count

def number_of_nice_subarrays(nums: list[int], k: int) -> int:
    return count_at_most(nums, k) - count_at_most(nums, k - 1)
```

The line `count += right - left + 1` is the key: once the window `[left, right]` is valid, so is every sub-window that ends at `right`.

## Common mistakes

- **Recording the best before the window is valid.** In the longest-window template, record *after* the shrink loop.
- **Not deleting zero-count keys** from the frequency map, so `len(freq)` overstates distinct characters.
- **Using a set when you need counts.** If characters can repeat inside a valid window, you need a dictionary.
- **Off-by-one in fixed windows.** The element leaving is at `right - k`, not `right - k + 1`. Draw it once.
- **Applying sliding window to arrays with negatives** in sum problems. Check the constraints.
- **Rebuilding the state from scratch** each iteration (for example, `sum(nums[left:right+1])`). That silently turns O(n) into O(n²).

## Practice set

**Easy**

- Maximum Average Subarray I
- Contains Duplicate II (window of size k with a set)

**Medium**

- Longest Substring Without Repeating Characters
- Longest Repeating Character Replacement
- Permutation in String, Find All Anagrams in a String
- Minimum Size Subarray Sum
- Max Consecutive Ones III
- Fruit Into Baskets
- Subarray Product Less Than K
- Count Number of Nice Subarrays

**Hard**

- Minimum Window Substring
- Sliding Window Maximum (needs a monotonic deque, covered with stacks)
- Substring with Concatenation of All Words

Next: prefix sums and hashing, which handle the subarray questions that sliding window cannot, such as those with negative numbers.
