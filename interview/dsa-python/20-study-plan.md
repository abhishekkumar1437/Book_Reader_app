---
title: Study Plan & Mock Interviews
part: Wrap-up
summary: A four-week schedule through this book, how to run a mock interview on yourself, the mistakes log, and what to do in the last 48 hours.
---

## The plan in one paragraph

Four weeks, about ninety minutes a day. Week one covers the array and string patterns, which are the most common first-round questions. Week two covers the data-structure patterns. Week three covers graphs and dynamic programming, which are the most common second-round and onsite questions. Week four is review, mocks, and your weak spots. If you have eight weeks, do each week twice: first pass with the book open, second pass from memory.

## Week 1: Arrays, strings, and the linear patterns

| Day | Read | Solve (from the chapter's practice set) |
|---|---|---|
| 1 | How to Use This Book; Arrays & Two Pointers | Two Sum II, Valid Palindrome, Move Zeroes, Container With Most Water |
| 2 | Arrays & Two Pointers (again, code the templates from memory) | 3Sum, Sort Colors, Remove Duplicates II |
| 3 | Sliding Window | Longest Substring Without Repeating Characters, Max Consecutive Ones III, Permutation in String |
| 4 | Sliding Window | Minimum Size Subarray Sum, Longest Repeating Character Replacement, Minimum Window Substring |
| 5 | Prefix Sums & Hashing | Two Sum, Group Anagrams, Subarray Sum Equals K, Longest Consecutive Sequence |
| 6 | Prefix Sums & Hashing; Stacks & Monotonic Stack | Product of Array Except Self, LRU Cache, Valid Parentheses, Daily Temperatures |
| 7 | Stacks & Monotonic Stack | Largest Rectangle in Histogram, Sliding Window Maximum, then rest |

## Week 2: Data structures

| Day | Read | Solve |
|---|---|---|
| 8 | Linked Lists | Reverse Linked List, Merge Two Sorted Lists, Linked List Cycle, Remove Nth From End |
| 9 | Linked Lists | Reorder List, Add Two Numbers, Reverse Nodes in k-Group |
| 10 | Binary Search | Binary Search, First and Last Position, Search in Rotated Sorted Array, Find Minimum in Rotated |
| 11 | Binary Search | Koko Eating Bananas, Capacity to Ship Packages, Find Peak Element |
| 12 | Sorting & Intervals | Merge Intervals, Insert Interval, Non-overlapping Intervals, Meeting Rooms II |
| 13 | Trees & BST | Max Depth, Invert, Diameter, Level Order, Validate BST, LCA |
| 14 | Trees & BST; Heaps & Top-K | Max Path Sum, Serialize/Deserialize, Kth Largest, Top K Frequent, Merge k Lists, Find Median |

## Week 3: Search spaces, graphs, and DP

| Day | Read | Solve |
|---|---|---|
| 15 | Recursion & Backtracking | Subsets, Permutations, Combination Sum, Generate Parentheses |
| 16 | Recursion & Backtracking; Tries | Word Search, N-Queens, Implement Trie, Design Add and Search Words |
| 17 | Graphs I | Number of Islands, Rotting Oranges, Clone Graph, Course Schedule II |
| 18 | Graphs I; Graphs II | Word Ladder, Pacific Atlantic, Redundant Connection, Network Delay Time |
| 19 | Graphs II | Accounts Merge, Cheapest Flights Within K Stops, Min Cost to Connect All Points |
| 20 | Dynamic Programming I | Climbing Stairs, House Robber, Coin Change, Coin Change II, LIS |
| 21 | Dynamic Programming I; DP II | Partition Equal Subset Sum, Word Break, Unique Paths, LCS, Edit Distance |

## Week 4: Consolidate and simulate

| Day | Read | Do |
|---|---|---|
| 22 | Dynamic Programming II | Longest Palindromic Substring, Burst Balloons, Stock with Cooldown |
| 23 | Greedy; Bit Manipulation & Math | Jump Game II, Gas Station, Partition Labels, Single Number, Counting Bits |
| 24 | Pattern Cheat Sheet | Mock interview 1 (two problems, 45 minutes each) |
| 25 | Your mistakes log | Redo every problem you got wrong in weeks 1–3, from a blank file |
| 26 | Pattern Cheat Sheet | Mock interview 2 |
| 27 | Weakest two chapters | Solve five new problems from those chapters' practice sets |
| 28 | Nothing new | Mock interview 3, then stop early and rest |

## How to solve a practice problem properly

The way you practise decides what you can do under pressure. Follow this every time, even when it feels slow.

1. **Set a timer for 25 minutes.** Read the problem, do the five-step method from the first chapter, and write the solution in a plain editor without autocomplete or running the code.
2. **Trace it by hand** on the given example and on one edge case. Only then run it.
3. **If you are stuck at 25 minutes**, read the chapter's relevant section (not a full solution). Give yourself ten more minutes.
4. **If still stuck**, read a full solution, close it, and write it yourself from memory. Mark the problem for a redo in three days.
5. **Write one line in the mistakes log.** What went wrong, in your own words.

Solving fewer problems this way beats solving more problems by reading solutions. Recognition feels like knowledge but does not survive an interview.

## The mistakes log

A plain text file. One line per mistake. Examples of useful entries:

```
2026-09-24  Sliding window: recorded best before shrinking. Record AFTER the while loop.
2026-09-24  Coin Change II: had coins inner loop, counted permutations. Coins outer for combinations.
2026-09-25  Rotated search: used < instead of <= when checking if left half sorted. Single-element half.
2026-09-26  Forgot dummy head; special-cased removing the head and got it wrong.
2026-09-27  Said O(n log n) for size-k heap. It is O(n log k).
```

Read the whole file before every mock. After about thirty entries you will notice the same five mistakes repeating. Those five are your real study list.

## Running a mock interview on yourself

Real interviews are different from practice because someone is watching and you have to talk. Simulate both.

- **Pick two problems you have not seen**, one medium from a chapter you are comfortable with and one from a chapter you are not. Use the practice sets; choose blind by number.
- **Talk out loud the entire time.** Record yourself with your phone. This feels ridiculous and is the single most useful thing on this page.
- **Use a plain document, not an IDE.** No syntax highlighting, no running code.
- **45 minutes per problem, hard stop.** Clarify (3), brute force (3), plan (7), code (20), test (7), complexity and follow-ups (5).
- **Afterwards, listen to the recording** and note: how long before you said the brute force, whether you stated the pattern by name, whether you tested before declaring done, and every silence over thirty seconds.

If you can find a partner, alternate roles. Interviewing someone else teaches you what interviewers are actually listening for.

## What a strong 45 minutes sounds like

> "Let me make sure I understand: I get an array of positive integers and a target, and I return the shortest contiguous subarray with sum at least the target, or zero if none. For `[2,3,1,2,4,3]` and `7`, that's `[4,3]`, length 2. Can the array be empty? Are values always positive?"
>
> "Brute force is every start and end, that's O(n²) with a running sum. Since values are positive, a window's sum only grows as it extends, so a sliding window should give O(n): grow with the right pointer, and while the sum is at least the target, record the length and shrink from the left."
>
> *(writes the code, about 12 lines)*
>
> "Let me trace it: right at 0, sum 2, not enough... right at 4, sum 12, at least 7, record 5, shrink... right at 5, sum 7, record 2, shrink to 3, stop. Returns 2. Edge case: if no window ever reaches the target, best stays infinity and I return 0. Good."
>
> "Time is O(n) because each index enters and leaves the window once. Space is O(1). If values could be negative this breaks; I'd switch to prefix sums with a monotonic deque."

Every sentence there maps to a step in the method. Practise until that is how you naturally talk.

## The last 48 hours before an interview

- **Do not learn anything new.** New material displaces old material under stress.
- **Re-read the Pattern Cheat Sheet** and your mistakes log. Twice.
- **Re-implement from memory**, in order, taking about an hour total: sorted two-sum, sliding window longest-substring, prefix-sum subarray count, monotonic stack next-greater, reverse linked list, binary search first-true, BFS on a grid, topological sort, union-find class, house robber, coin change, LCS. These twelve are the skeletons of most questions.
- **Do one easy problem** on the morning of the interview, just to warm up your hands. Not a hard one.
- **Prepare three questions for the interviewer** about the team and the work. It changes how the conversation ends.
- **Sleep.** A rested brain finds patterns; a tired one recalls them badly.

## After the interview

Write down every question you were asked, immediately, while you remember. Solve any you missed within a day, from scratch, and add the lesson to your mistakes log. Interview questions repeat across companies far more than people expect.

That is the whole book. Go and do the reps.
