---
title: Arrays & Two Pointers
part: Core Patterns
summary: Replace nested loops with two indices that move with purpose. Pair sums, in-place removal, partitioning, and the 3Sum family.
---

## Why interviewers love this pattern

Two pointers turns an O(n²) "check every pair" solution into O(n) by walking two indices through the array with a rule for which one moves. It is the first optimisation most interviewers expect you to find, and it appears inside harder problems as a building block.

You should recognise it when the problem:

- gives a **sorted** array and asks about pairs, triplets, or a target sum;
- asks you to do something **in place** with O(1) extra space (remove duplicates, move zeros, partition);
- involves a **palindrome** or comparing an array from both ends;
- asks for the **maximum area or width** between two boundaries.

## The idea

There are three shapes. Learn to name them.

### Opposite ends, moving inward

Start `left` at index 0 and `right` at the end. Each step, look at the pair and move exactly one pointer based on a comparison. The invariant is: everything outside `[left, right]` has already been ruled out.

```python
left, right = 0, len(nums) - 1
while left < right:
    current = nums[left] + nums[right]
    if current == target:
        return [left, right]
    if current < target:
        left += 1          # need a bigger sum, only left can increase it
    else:
        right -= 1         # need a smaller sum, only right can decrease it
return []
```

Why is moving one pointer safe? If `nums[left] + nums[right] < target`, then `nums[left]` paired with *any* index less than `right` is even smaller, so `nums[left]` can never be part of the answer. Discard it. The same argument works on the other side. Every step discards one element for good, so it ends in at most n steps.

### Same direction, slow and fast

Both pointers start at the left. `fast` scans every element. `slow` marks the boundary of the "kept" or "processed" part. Use it for in-place filtering.

```python
slow = 0
for fast in range(len(nums)):
    if keep(nums[fast]):
        nums[slow] = nums[fast]
        slow += 1
# nums[:slow] is the result
```

The invariant: `nums[:slow]` contains exactly the kept elements seen so far, in order.

### Two arrays, one pointer each

Merge-style walks. Both pointers start at index 0 of their own array and advance the one whose current value is smaller. Used in merging sorted lists, finding intersections, and comparing versions.

## Worked problem 1: Two Sum on a sorted array

**Problem.** Given a sorted array `numbers` (1-indexed in the output) and a `target`, return the indices of the two numbers that add up to `target`. Exactly one solution exists.

```
numbers = [2, 7, 11, 15], target = 9  ->  [1, 2]
```

**Brute force.** Every pair, O(n²). Say it, then improve.

**Approach.** Sorted plus "pair with a target sum" means opposite-end pointers.

```python
def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        total = numbers[left] + numbers[right]
        if total == target:
            return [left + 1, right + 1]
        if total < target:
            left += 1
        else:
            right -= 1
    return []   # unreachable if a solution is guaranteed
```

**Dry run** on `[2, 7, 11, 15]`, target 9:

| left | right | total | action |
|---|---|---|---|
| 0 (2) | 3 (15) | 17 | too big, right -= 1 |
| 0 (2) | 2 (11) | 13 | too big, right -= 1 |
| 0 (2) | 1 (7) | 9 | found |

**Complexity.** O(n) time, O(1) space.

> **Interview tip:** If the array were *not* sorted, this pattern breaks. The standard answer for an unsorted array is a hash map storing `value -> index` in a single pass (see the hashing chapter). Knowing when to switch between the two is what the interviewer is checking.

## Worked problem 2: Remove duplicates in place

**Problem.** Given a sorted array, remove duplicates in place so that each value appears once. Return the new length `k`. The first `k` elements must hold the result.

```
[1, 1, 2, 2, 2, 3]  ->  k = 3, nums[:3] == [1, 2, 3]
```

**Approach.** Slow/fast. `slow` points to the last unique value written. `fast` scans. When `nums[fast]` differs from `nums[slow]`, it is a new value: write it just after `slow`.

```python
def remove_duplicates(nums: list[int]) -> int:
    if not nums:
        return 0
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1
```

**Dry run** on `[1, 1, 2, 2, 2, 3]`:

| fast | nums[fast] | nums[slow] | action | array |
|---|---|---|---|---|
| 1 | 1 | 1 | same, skip | [1,1,2,2,2,3] |
| 2 | 2 | 1 | new, slow=1, write | [1,2,2,2,2,3] |
| 3 | 2 | 2 | same | |
| 4 | 2 | 2 | same | |
| 5 | 3 | 2 | new, slow=2, write | [1,2,3,2,2,3] |

Return 3. The tail after index 2 is garbage, and that is allowed.

**Variation.** "Allow each value at most twice" is the same loop with `if fast < 2 or nums[fast] != nums[slow - 1]` and `slow` starting at 2. Generalising: compare with the element `k` positions back.

## Worked problem 3: Move zeros

**Problem.** Move all zeros to the end while keeping the relative order of the non-zero elements. In place.

```
[0, 1, 0, 3, 12]  ->  [1, 3, 12, 0, 0]
```

**Approach.** Slow/fast where `keep` means "non-zero". Instead of overwriting and then filling zeros in a second pass, swap: this keeps the array valid at every step.

```python
def move_zeroes(nums: list[int]) -> None:
    slow = 0                                   # next position for a non-zero
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1
```

When `slow == fast` the swap is a no-op, which is fine. O(n) time, O(1) space, one pass.

## Worked problem 4: Container with most water

**Problem.** `height[i]` is the height of a vertical line at position `i`. Choose two lines that, with the x-axis, hold the most water. Return the area.

```
height = [1, 8, 6, 2, 5, 4, 8, 3, 7]  ->  49   (lines at index 1 and 8, width 7, height min(8,7)=7)
```

**Brute force.** All pairs, O(n²).

**Key insight.** Area = width × min(height[left], height[right]). Start with the widest container. Moving either pointer inward shrinks the width, so the only way to gain area is to increase the minimum height. The shorter line is the bottleneck. Moving the *taller* line can never help because the minimum stays capped by the shorter one. So always move the shorter line.

```python
def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    best = 0
    while left < right:
        width = right - left
        best = max(best, width * min(height[left], height[right]))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return best
```

**Dry run** (first few steps) on the example:

| left | right | min height | width | area | move |
|---|---|---|---|---|---|
| 0 (1) | 8 (7) | 1 | 8 | 8 | left (shorter) |
| 1 (8) | 8 (7) | 7 | 7 | **49** | right |
| 1 (8) | 7 (3) | 3 | 6 | 18 | right |
| 1 (8) | 6 (8) | 8 | 5 | 40 | right (tie) |

Continues shrinking; 49 stays the best. O(n) time, O(1) space.

> **Interview tip:** Interviewers will ask "why is it safe to skip the pairs you never checked?" Have the bottleneck argument ready in one sentence: *the shorter line limits the area, and every pair involving it with a narrower width is strictly worse.*

## Worked problem 5: 3Sum

**Problem.** Return all unique triplets `[a, b, c]` from `nums` with `a + b + c == 0`.

```
[-1, 0, 1, 2, -1, -4]  ->  [[-1, -1, 2], [-1, 0, 1]]
```

**Approach.** Sort. Fix the first element with a loop, then run the sorted two-sum on the rest. Skip duplicates at every level so the output has no repeats.

```python
def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result = []
    n = len(nums)
    for i in range(n - 2):
        if nums[i] > 0:
            break                                  # all remaining are positive, no zero-sum possible
        if i > 0 and nums[i] == nums[i - 1]:
            continue                               # skip duplicate first element
        left, right = i + 1, n - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1                      # skip duplicate second element
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1                     # skip duplicate third element
    return result
```

**Dry run** on sorted `[-4, -1, -1, 0, 1, 2]`:

- `i=0` (−4): need pair summing to 4 from `[-1,-1,0,1,2]`. Max pair is 3. Nothing.
- `i=1` (−1): need pair summing to 1. `left=2 (−1), right=5 (2)` → total 0, record `[-1,-1,2]`. Move both; skip dups. `left=3 (0), right=4 (1)` → total 0, record `[-1,0,1]`.
- `i=2` (−1): duplicate of previous, skip.
- `i=3` (0): need pair summing to 0 from `[1, 2]`. Nothing.

**Complexity.** O(n²) time (n outer × n inner), O(1) extra space besides the output. Sorting is O(n log n) and is dominated.

**Follow-ups you should expect.**

- *3Sum Closest*: same loop, track `abs(total - target)`.
- *4Sum*: add one more outer loop. O(n³).
- *Count of triplets with sum less than target*: when `total < target`, all pairs `(left, left+1..right)` qualify, so add `right - left` and move `left`.

## Worked problem 6: Valid palindrome

**Problem.** Given a string, return `True` if it is a palindrome after removing non-alphanumeric characters and ignoring case.

```
"A man, a plan, a canal: Panama"  ->  True
```

**Approach.** Opposite-end pointers, skipping characters that do not count. No need to build a cleaned copy, which saves O(n) space.

```python
def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True
```

**Variation: Valid Palindrome II** (may delete at most one character). On the first mismatch, try skipping either side and check the remaining substring is a plain palindrome:

```python
def valid_palindrome_ii(s: str) -> bool:
    def is_pal(lo: int, hi: int) -> bool:
        while lo < hi:
            if s[lo] != s[hi]:
                return False
            lo += 1
            hi -= 1
        return True

    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return is_pal(left + 1, right) or is_pal(left, right - 1)
        left += 1
        right -= 1
    return True
```

## Worked problem 7: Sort colors (Dutch national flag)

**Problem.** An array contains only 0, 1 and 2. Sort it in place in one pass without using a sorting function.

**Approach.** Three regions using three pointers: `low` (next place for a 0), `mid` (current element), `high` (next place for a 2). Everything before `low` is 0, everything after `high` is 2, everything between `low` and `mid` is 1.

```python
def sort_colors(nums: list[int]) -> None:
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:                                    # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1                            # do NOT advance mid: the swapped-in value is unexamined
```

The subtle line is the last one. After swapping with `high`, the element now at `mid` came from the unexplored right side, so it must be looked at again. After swapping with `low`, the element at `mid` is known to be a 1 (or `low == mid`), so advancing is safe.

**Why it matters.** This is the partition step of quicksort, and the same three-way structure shows up in "partition array around a pivot" questions.

## Common mistakes

- **Using two pointers on unsorted data** for the sum problems. It only works when the move rule is guaranteed to discard a losing element.
- **Forgetting the `left < right` guard** inside inner skip loops (palindrome, 3Sum). Without it you run past the ends.
- **Advancing both pointers when only one should move.** Ask yourself: which element did I just prove cannot be in the answer? Move only that one.
- **Duplicate results in 3Sum** because dedup was done on `left` but not on `i`, or on `i` but not after a match.
- **Returning early from `remove_duplicates` with the wrong length.** The answer is `slow + 1` when `slow` is an index, or `slow` when it is a count. Pick one convention and be consistent.

## Practice set

**Easy**

- Two Sum II (sorted input)
- Valid Palindrome
- Remove Element
- Merge Sorted Array (start from the back so you never overwrite unread values)
- Squares of a Sorted Array

**Medium**

- 3Sum, 3Sum Closest
- Container With Most Water
- Sort Colors
- Remove Duplicates from Sorted Array II
- Boats to Save People (sort, then pair heaviest with lightest)
- Partition Labels

**Hard**

- Trapping Rain Water (two pointers with running left and right maximums)
- 4Sum

The next chapter, sliding window, is the same-direction two-pointer idea specialised to contiguous ranges.
