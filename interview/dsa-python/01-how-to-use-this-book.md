---
title: How to Use This Book
part: Getting Started
summary: What interviews actually test, a five-step method for every problem, and the small Python toolkit you need before the patterns.
---

## Who this book is for

You already know the basics: what an array is, how a loop works, what a dictionary does. This book does not re-teach that. It teaches the **patterns** that coding interviews are built from, in Python, with the level of detail you need to recognise a pattern under pressure and write a clean solution from memory.

Every core chapter follows the same shape:

1. **Why interviewers ask it** and how to recognise the pattern from the problem statement.
2. **The idea**, explained once, in plain words, with a reusable template.
3. **Worked problems**, each with a brute-force baseline, the optimised approach, working code, and a dry run.
4. **Mistakes people make** in real interviews.
5. **A practice list** so you can go and do the reps.

Read a chapter, then solve the practice problems the same day. Reading alone builds recognition. Solving builds recall. You need both.

## What an interview actually tests

A 45-minute coding round is rarely about whether you know an obscure algorithm. Interviewers are grading four things:

| What they watch | What "good" looks like |
|---|---|
| **Problem understanding** | You restate the task, ask about edge cases and constraints, and confirm the expected output on an example before coding. |
| **Approach** | You name a brute force first, state its complexity, then improve it by spotting the pattern. |
| **Code quality** | Readable names, small helper functions, no dead code, handles edge cases without special-casing everything. |
| **Verification** | You trace your code on a small example, find your own bugs, and state the final time and space complexity. |

Most rejections come from the first and last rows, not from the middle two. People jump into code, and people never test what they wrote.

## The five-step method

Use the same routine every time. It removes the panic and makes you look organised.

### 1. Clarify (2 minutes)

Ask short, concrete questions:

- Input size? ("Up to 10⁵ elements" tells you O(n²) is out.)
- Can values be negative, zero, duplicated, empty?
- Is the input sorted? Can I modify it?
- What should I return for an empty input or when there is no answer?

Then say the example back: "So for `[2, 7, 11, 15]` and target `9`, I return `[0, 1]`."

### 2. Brute force out loud (2 minutes)

State the obvious approach and its cost. "I could check every pair, that is O(n²)." This proves you understand the problem and gives you a fallback if the clever idea does not come.

### 3. Find the pattern (5 minutes)

Ask yourself the questions from the cheat sheet at the end of this book:

- Sorted input, or asking for a pair? Think **two pointers** or **binary search**.
- Contiguous subarray or substring with a condition? Think **sliding window** or **prefix sums**.
- "Next greater", "previous smaller", "how many days until"? Think **monotonic stack**.
- Top k, k-th largest, merge k lists? Think **heap**.
- Shortest path in an unweighted grid? Think **BFS**.
- Count the ways, minimum cost, "can we reach"? Think **dynamic programming**.
- Generate all combinations or permutations? Think **backtracking**.

Say what you are thinking. "This wants the longest substring without repeats, so a sliding window with a set should work."

### 4. Code it cleanly (15 minutes)

- Write the function signature first, then a comment for each step, then fill the steps.
- Use meaningful names: `left`, `right`, `seen`, `best`, not `i`, `j`, `d`, `x`.
- Handle the empty case at the top, once.
- Do not optimise micro-details. Get it correct and readable.

### 5. Test and analyse (5 minutes)

Trace a small example by hand, line by line, updating variables in a little table. Then test one edge case: empty input, one element, all duplicates, the answer at the very end. Finally say the complexity: "O(n) time because each element enters and leaves the window once, O(k) space for the set."

> **Interview tip:** If you get stuck, do not go silent. Say "Let me think about a simpler version of this problem" and solve it for a small input by hand. The pattern almost always shows itself.

## Complexity in one page

You have seen Big-O before. Here is the only part you need to recite fluently.

| Complexity | Name | Safe input size | Typical source |
|---|---|---|---|
| O(1) | constant | any | hash lookup, arithmetic |
| O(log n) | logarithmic | any | binary search, heap push/pop |
| O(n) | linear | up to ~10⁸ | single pass, two pointers, BFS |
| O(n log n) | linearithmic | up to ~10⁶ | sorting, heap-based algorithms |
| O(n²) | quadratic | up to ~10⁴ | nested loops, simple DP tables |
| O(2ⁿ) | exponential | up to ~20 | subsets, naive recursion |
| O(n!) | factorial | up to ~10 | permutations |

Two rules:

- **Read the constraints.** They tell you the required complexity. n ≤ 20 means brute force over subsets is expected. n ≤ 10⁵ means you need O(n log n) or better.
- **Space counts too.** Recursion depth is space. A `set` of all elements is O(n) space. Say it.

Amortised cost matters for Python lists: `append` is O(1) amortised, but `insert(0, x)` and `pop(0)` are O(n). Use `collections.deque` when you need to add or remove from the front.

## The Python toolkit for interviews

These are the tools that appear in almost every solution in this book. Skim now, come back when a chapter uses one.

### Costs of common operations

| Structure | Operation | Cost |
|---|---|---|
| `list` | index, `append`, `pop()` | O(1) |
| `list` | `insert(0, x)`, `pop(0)`, `x in lst`, `remove` | O(n) |
| `list` | `sort()` | O(n log n), stable |
| `dict` / `set` | get, set, `in`, delete | O(1) average |
| `deque` | `append`, `appendleft`, `pop`, `popleft` | O(1) |
| `heapq` | `heappush`, `heappop` | O(log n) |
| `heapq` | `heapify(list)` | O(n) |
| `str` | slicing `s[a:b]`, concatenation `a + b` | O(length) each time |

### Collections you should use without thinking

```python
from collections import defaultdict, Counter, deque
import heapq

# Counting things
counts = Counter("mississippi")        # {'i': 4, 's': 4, 'p': 2, 'm': 1}
counts.most_common(2)                  # [('i', 4), ('s', 4)]

# Grouping without checking "if key not in dict"
groups = defaultdict(list)
groups["fruit"].append("apple")        # key is created automatically

# A queue for BFS (never use list.pop(0) for a queue)
queue = deque([start])
queue.append(x)                        # push to the back
node = queue.popleft()                 # pop from the front, O(1)

# A min-heap. For a max-heap, push negated values.
heap = []
heapq.heappush(heap, (priority, item)) # tuples compare by first element
priority, item = heapq.heappop(heap)
```

### Idioms that make solutions shorter and safer

```python
# Enumerate instead of range(len(...))
for i, value in enumerate(nums):
    ...

# Walk two sequences together
for a, b in zip(list_a, list_b):
    ...

# Sort by a key, descending on the second field, ascending on the first
items.sort(key=lambda p: (p[0], -p[1]))

# Infinity as an initial "best"
best = float("inf")

# Swap without a temp variable
nums[i], nums[j] = nums[j], nums[i]

# Integer division and modulo (floor toward negative infinity)
mid = (lo + hi) // 2

# Reverse a slice, or a whole string
s[::-1]

# Build strings with a list, then join once (O(n), not O(n²))
parts = []
parts.append("a")
result = "".join(parts)
```

### Recursion limit

Python's default recursion limit is about 1000 frames. Deep DFS on a linked structure of 10⁴ nodes will crash. Either write the iterative version (this book shows both where it matters) or raise the limit at the top of your solution:

```python
import sys
sys.setrecursionlimit(10**6)
```

Mention this in the interview. It shows you know the runtime.

### Type hints

Use them. They cost nothing and make your intent clear to the interviewer:

```python
from typing import Optional

def two_sum(nums: list[int], target: int) -> list[int]:
    ...

class ListNode:
    def __init__(self, val: int = 0, next: "Optional[ListNode]" = None):
        self.val = val
        self.next = next
```

## How to study with this book

1. **One chapter per session.** Read it fully, including the dry runs. Do not skip them; they are where understanding happens.
2. **Close the book and re-implement the template** from memory. If you cannot, read the idea section again.
3. **Solve the practice list** in order. Easy problems confirm the template. Medium problems teach the variations. Hard ones are optional until your second pass.
4. **Keep a mistakes log.** One line per bug you made: "Forgot to shrink window when count exceeded k." You will see the same five mistakes repeat, and then they stop.
5. **Do timed mocks** once you are through the core chapters. The last chapter has a schedule.

The next chapter starts with arrays and two pointers, the pattern that appears most often in first-round interviews.
