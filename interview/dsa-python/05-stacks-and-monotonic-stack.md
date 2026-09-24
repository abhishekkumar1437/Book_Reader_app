---
title: Stacks & Monotonic Stack
part: Core Patterns
summary: Matching brackets and expression evaluation are the warm-up. The real interview weapon is the monotonic stack for "next greater", histograms, and sliding-window maximum.
---

## Why interviewers love this pattern

A stack is a list you only touch at one end. That restriction is exactly what makes it the right tool for anything with **nesting** (brackets, nested expressions, directory paths) or **"most recent unresolved thing"** (the last opening bracket, the last bar that is still waiting for a taller one).

The monotonic stack is the version that appears in medium and hard questions. It keeps the stack sorted, and it solves in O(n) a family of problems that look like they need O(n²):

- next greater / next smaller element to the right or left;
- how many days until a warmer temperature;
- largest rectangle in a histogram;
- sliding window maximum (with a deque);
- stock span, remove k digits, trapping rain water.

## Basic stack use, briefly

In Python a `list` is the stack: `append` to push, `pop` to pop, `stack[-1]` to peek. All O(1).

### Valid parentheses

```python
def is_valid(s: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs:                                  # closing bracket
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack                                     # anything left is unmatched
```

Common follow-ups: minimum removals to make a string valid (count unmatched of each kind), and longest valid parentheses (push indices, use a base index of −1).

### Evaluate reverse Polish notation

```python
def eval_rpn(tokens: list[str]) -> int:
    stack = []
    for t in tokens:
        if t in "+-*/":
            b, a = stack.pop(), stack.pop()             # order matters: a op b
            if t == "+": stack.append(a + b)
            elif t == "-": stack.append(a - b)
            elif t == "*": stack.append(a * b)
            else: stack.append(int(a / b))              # truncate toward zero, not floor
        else:
            stack.append(int(t))
    return stack[0]
```

`int(a / b)` instead of `a // b` matters for negatives: `-7 // 2 == -4` but the problem wants −3.

### Min stack

Keep a second stack of running minimums. Push onto it when the new value is less than or equal to the current minimum; pop from it when the popped value equals the current minimum.

```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.mins = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        if not self.mins or val <= self.mins[-1]:
            self.mins.append(val)

    def pop(self) -> None:
        if self.stack.pop() == self.mins[-1]:
            self.mins.pop()

    def top(self) -> int:
        return self.stack[-1]

    def get_min(self) -> int:
        return self.mins[-1]
```

The `<=` (not `<`) in `push` handles duplicates correctly.

## The monotonic stack idea

Keep the stack **sorted** (increasing or decreasing from bottom to top). When a new element would break the order, pop until it fits. Each pop *resolves* the popped element: the new element is the first one to its right that is greater (or smaller). Because each index is pushed once and popped at most once, the whole pass is O(n).

Think of it as a line of people waiting for someone taller to walk by. When a taller person arrives, everyone shorter at the front of the line gets their answer and leaves.

### Template: next greater element to the right

```python
def next_greater(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n
    stack = []                                # indices; values are decreasing bottom -> top
    for i, value in enumerate(nums):
        while stack and nums[stack[-1]] < value:
            result[stack.pop()] = value       # value is the first greater element for that index
        stack.append(i)
    return result
```

**Dry run** on `[2, 1, 2, 4, 3]`:

| i | value | stack (indices) before | pops | result so far | stack after |
|---|---|---|---|---|---|
| 0 | 2 | [] | | [-1,-1,-1,-1,-1] | [0] |
| 1 | 1 | [0] | | | [0,1] |
| 2 | 2 | [0,1] | idx1 (1<2) → 2 | [-1,2,-1,-1,-1] | [0,2] |
| 3 | 4 | [0,2] | idx2 → 4, idx0 → 4 | [4,2,4,-1,-1] | [3] |
| 4 | 3 | [3] | | | [3,4] |

Indices 3 and 4 are never popped, so they keep −1. Final: `[4, 2, 4, -1, -1]`.

**The four variants** come from two choices: which direction you scan, and whether you pop on `<` or `>`.

| Question | Scan | Pop while |
|---|---|---|
| next greater to the right | left → right | `nums[top] < value` |
| next smaller to the right | left → right | `nums[top] > value` |
| previous greater to the left | left → right, answer is `stack[-1]` after popping | `nums[top] <= value` |
| previous smaller to the left | left → right, answer is `stack[-1]` after popping | `nums[top] >= value` |

For "previous" questions, after the popping loop, the top of the stack (if any) *is* the answer for the current element, and then you push the current element.

Store **indices**, not values. You almost always need the distance or the position later.

> **Interview tip:** Say "monotonic stack" out loud as soon as you see "next greater" or "nearest smaller". It signals you know the pattern and lets the interviewer skip ahead to the interesting variation.

## Worked problem 1: Daily temperatures

**Problem.** For each day, how many days until a warmer temperature? 0 if never.

```
[73, 74, 75, 71, 69, 72, 76, 73]  ->  [1, 1, 4, 2, 1, 1, 0, 0]
```

**Approach.** Next greater to the right, but store the index difference.

```python
def daily_temperatures(temps: list[int]) -> list[int]:
    answer = [0] * len(temps)
    stack = []                                   # indices with decreasing temperatures
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            answer[j] = i - j
        stack.append(i)
    return answer
```

O(n) time, O(n) space.

## Worked problem 2: Largest rectangle in a histogram

**Problem.** Bar heights are given. Find the area of the largest rectangle that fits under the bars.

```
[2, 1, 5, 6, 2, 3]  ->  10   (bars 5 and 6, width 2)
```

**Reasoning.** For each bar, the widest rectangle using that bar's full height extends left until a shorter bar and right until a shorter bar. So the answer is `height[i] × (next_smaller_right − previous_smaller_left − 1)`, maximised over `i`. A single increasing monotonic stack finds both boundaries: when bar `i` pops a taller bar `j`, then `i` is `j`'s right boundary and the new stack top is `j`'s left boundary.

```python
def largest_rectangle_area(heights: list[int]) -> int:
    stack = []                                 # indices with increasing heights
    best = 0
    for i, h in enumerate(heights + [0]):      # sentinel 0 flushes the stack at the end
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            left = stack[-1] if stack else -1
            width = i - left - 1
            best = max(best, height * width)
        stack.append(i)
    return best
```

The sentinel is the trick that removes the "process leftover stack" loop. Note `heights + [0]` creates a new list, so `heights[stack[-1]]` still indexes the original correctly because the extra element is last.

**Dry run** on `[2, 1, 5, 6, 2, 3]` plus sentinel:

| i | h | pops (height × width) | best | stack after |
|---|---|---|---|---|
| 0 | 2 | | 0 | [0] |
| 1 | 1 | idx0: 2 × (1−(−1)−1)=2 | 2 | [1] |
| 2 | 5 | | 2 | [1,2] |
| 3 | 6 | | 2 | [1,2,3] |
| 4 | 2 | idx3: 6×1=6; idx2: 5×(4−1−1)=10 | 10 | [1,4] |
| 5 | 3 | | 10 | [1,4,5] |
| 6 | 0 | idx5: 3×1; idx4: 2×(6−1−1)=8; idx1: 1×6 | 10 | [6] |

**Follow-up: Maximal rectangle in a binary matrix.** Treat each row as the base of a histogram where `heights[c]` counts consecutive 1s above. Run the function per row. O(rows × cols).

## Worked problem 3: Sliding window maximum

**Problem.** Return the maximum of every window of size `k`.

```
[1, 3, -1, -3, 5, 3, 6, 7], k = 3  ->  [3, 3, 5, 5, 6, 7]
```

**Approach.** A monotonic *deque* of indices with decreasing values. The front is always the max of the current window. Pop from the back when a new value is larger (those elements can never be the max again while the new one is around). Pop from the front when the index falls out of the window.

```python
from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    dq = deque()                              # indices, values decreasing front -> back
    result = []
    for i, value in enumerate(nums):
        while dq and nums[dq[-1]] < value:
            dq.pop()                          # smaller elements behind a larger one are useless
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()                      # front is out of the window
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result
```

**Dry run** on the example, k = 3:

| i | value | deque (values) after push | out-of-window? | output |
|---|---|---|---|---|
| 0 | 1 | [1] | | |
| 1 | 3 | [3] (popped 1) | | |
| 2 | −1 | [3, −1] | | 3 |
| 3 | −3 | [3, −1, −3] | | 3 |
| 4 | 5 | [5] | | 5 |
| 5 | 3 | [5, 3] | | 5 |
| 6 | 6 | [6] | | 6 |
| 7 | 7 | [7] | | 7 |

O(n) time, O(k) space. The same deque solves "shortest subarray with sum at least k" when negatives are allowed (apply it to the prefix sums).

## Worked problem 4: Trapping rain water

**Problem.** Given bar heights, how much water is trapped after raining?

```
[0,1,0,2,1,0,1,3,2,1,2,1]  ->  6
```

Two accepted solutions. Know both; the two-pointer one is the usual "optimal" answer, the stack one shows you understand the monotonic idea.

**Two pointers.** Water above index `i` is `min(max_left, max_right) − height[i]`. Walk from both ends keeping the running max on each side; the side with the smaller max is the bottleneck and can be resolved.

```python
def trap(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    left_max = right_max = 0
    water = 0
    while left < right:
        if height[left] < height[right]:
            left_max = max(left_max, height[left])
            water += left_max - height[left]
            left += 1
        else:
            right_max = max(right_max, height[right])
            water += right_max - height[right]
            right -= 1
    return water
```

**Monotonic stack.** Decreasing stack of indices. When a taller bar arrives, it forms a "bowl" with the popped bar as the bottom and the new stack top as the left wall.

```python
def trap_stack(height: list[int]) -> int:
    stack = []
    water = 0
    for i, h in enumerate(height):
        while stack and height[stack[-1]] < h:
            bottom = stack.pop()
            if not stack:
                break
            left = stack[-1]
            width = i - left - 1
            bounded = min(height[left], h) - height[bottom]
            water += width * bounded
        stack.append(i)
    return water
```

## Worked problem 5: Remove k digits

**Problem.** Remove `k` digits from the number string so the result is as small as possible.

```
"1432219", k = 3  ->  "1219"
```

**Approach.** Greedy with an increasing stack: whenever the current digit is smaller than the top, removing the top makes the number smaller. Remove while you still have budget. Strip leading zeros at the end.

```python
def remove_k_digits(num: str, k: int) -> str:
    stack = []
    for d in num:
        while k and stack and stack[-1] > d:
            stack.pop()
            k -= 1
        stack.append(d)
    if k:
        stack = stack[:-k]                     # still have removals: drop from the end (largest tail)
    result = "".join(stack).lstrip("0")
    return result or "0"
```

Sibling problems with the identical skeleton: *Remove Duplicate Letters* (smallest subsequence with each letter once), *Create Maximum Number*, *Find the Most Competitive Subsequence*.

## Worked problem 6: Asteroid collision

A good "simulate with a stack" question. Positive numbers move right, negative move left; when they meet, the smaller explodes.

```python
def asteroid_collision(asteroids: list[int]) -> list[int]:
    stack = []
    for a in asteroids:
        alive = True
        while alive and a < 0 and stack and stack[-1] > 0:
            if stack[-1] < -a:
                stack.pop()                     # top explodes, keep checking
            elif stack[-1] == -a:
                stack.pop()                     # both explode
                alive = False
            else:
                alive = False                   # current explodes
        if alive:
            stack.append(a)
    return stack
```

Collisions only happen when a left-mover meets a right-mover already on the stack; that single condition is what the `while` guards.

## Common mistakes

- **Storing values instead of indices.** You lose the ability to compute widths and distances.
- **Wrong comparison strictness.** `<` versus `<=` decides how duplicates are handled. For "next greater" use strict `<` so equal elements are not popped. For histogram boundaries either works if you are consistent.
- **Forgetting to drain the stack** at the end when leftover elements need processing. The sentinel trick avoids this.
- **Using `list.pop(0)`** as a queue in sliding window maximum. Use `deque`.
- **Re-scanning the stack** with a loop inside the loop. If you ever search the stack, you have lost the O(n) guarantee.

## Practice set

**Easy**

- Valid Parentheses
- Min Stack
- Implement Queue using Stacks
- Next Greater Element I

**Medium**

- Daily Temperatures
- Evaluate Reverse Polish Notation
- Asteroid Collision
- Remove K Digits
- Next Greater Element II (circular: loop over `2n` with `i % n`)
- Online Stock Span
- Decode String
- Simplify Path
- Sum of Subarray Minimums (contribution counting with previous/next smaller)

**Hard**

- Largest Rectangle in Histogram
- Maximal Rectangle
- Sliding Window Maximum
- Trapping Rain Water
- Basic Calculator (stack for parentheses and signs)

Next: linked lists, where the pointer-manipulation questions live.
