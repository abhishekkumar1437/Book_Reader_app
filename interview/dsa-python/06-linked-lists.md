---
title: Linked Lists
part: Core Patterns
summary: Reversal, the dummy head, fast and slow pointers, cycle detection, and merging. Small set of tricks, asked constantly.
---

## Why interviewers love this pattern

Linked list questions are cheap to state and unforgiving to code. They test whether you can manipulate pointers without losing a node, and whether you handle the edge cases (empty list, one node, the head itself changing). There is a small toolkit of tricks; once you own them, almost every linked-list question is a combination.

You will be given this node class (or should write it in a few seconds):

```python
from typing import Optional

class ListNode:
    def __init__(self, val: int = 0, next: "Optional[ListNode]" = None):
        self.val = val
        self.next = next
```

## The toolkit

### 1. The dummy head

Whenever the head of the result might change, or you build a new list, start with a placeholder node and return `dummy.next`. This removes all the `if head is None` special cases.

```python
dummy = ListNode()
tail = dummy
...
tail.next = new_node
tail = tail.next
...
return dummy.next
```

### 2. Reverse a list, iteratively

Three pointers. Say the invariant out loud: `prev` is the head of the reversed part, `curr` is the head of the unreversed part.

```python
def reverse_list(head: Optional[ListNode]) -> Optional[ListNode]:
    prev, curr = None, head
    while curr:
        nxt = curr.next          # save before breaking the link
        curr.next = prev         # reverse the pointer
        prev = curr              # advance both
        curr = nxt
    return prev
```

**Dry run** on `1 → 2 → 3`:

| step | prev | curr | list state |
|---|---|---|---|
| start | None | 1 | 1→2→3 |
| after 1 | 1 | 2 | 1→None, 2→3 |
| after 2 | 2 | 3 | 2→1→None, 3 |
| after 3 | 3 | None | 3→2→1→None |

Recursive version, for when asked:

```python
def reverse_list_rec(head):
    if head is None or head.next is None:
        return head
    new_head = reverse_list_rec(head.next)
    head.next.next = head        # the node after me now points back to me
    head.next = None
    return new_head
```

Recursion uses O(n) stack; prefer the iterative form in Python.

### 3. Fast and slow pointers

`slow` moves one step, `fast` moves two. When `fast` reaches the end, `slow` is at the middle. If there is a cycle, they meet inside it.

```python
def middle_node(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow                  # for even length, this is the second middle
```

To get the *first* middle on even length (needed for splitting a list in half), start `fast = head.next`.

### 4. Find the k-th from the end

Move `lead` k steps ahead, then advance both until `lead` hits the end. The gap stays k.

### 5. Splice and cut

To remove a node you need the node *before* it. To insert, you need the node before the insertion point. That is why the dummy head and "previous" pointers appear everywhere.

## Worked problem 1: Merge two sorted lists

**Problem.** Merge two sorted linked lists into one sorted list.

```python
def merge_two_lists(a: Optional[ListNode], b: Optional[ListNode]) -> Optional[ListNode]:
    dummy = ListNode()
    tail = dummy
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b           # attach whatever is left
    return dummy.next
```

O(n + m) time, O(1) extra space. *Merge k sorted lists* is this plus a heap (heaps chapter) or a divide-and-conquer pairwise merge.

## Worked problem 2: Remove n-th node from end

```
1 → 2 → 3 → 4 → 5, n = 2   ->   1 → 2 → 3 → 5
```

**Approach.** Dummy head plus a two-pointer gap. `lead` goes `n + 1` steps ahead so `trail` stops on the node *before* the target.

```python
def remove_nth_from_end(head: Optional[ListNode], n: int) -> Optional[ListNode]:
    dummy = ListNode(0, head)
    lead = trail = dummy
    for _ in range(n + 1):
        lead = lead.next
    while lead:
        lead = lead.next
        trail = trail.next
    trail.next = trail.next.next
    return dummy.next
```

Without the dummy, removing the head (`n == length`) needs a special case. With it, `trail` stays on the dummy and the code is unchanged.

## Worked problem 3: Linked list cycle, and where it starts

**Detect.** Floyd's algorithm: slow/fast. If they meet, there is a cycle.

```python
def has_cycle(head: Optional[ListNode]) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
```

**Find the start.** After they meet, reset one pointer to the head and move both one step at a time. They meet at the cycle entry.

```python
def detect_cycle(head: Optional[ListNode]) -> Optional[ListNode]:
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            slow = head
            while slow is not fast:
                slow, fast = slow.next, fast.next
            return slow
    return None
```

**Why it works.** Let the distance from head to cycle start be `a`, and let the pointers meet `b` steps into the cycle, with cycle length `c`. Slow has walked `a + b`; fast has walked `2(a + b)`, and the difference `a + b` is a multiple of `c`. So `a ≡ −b (mod c)`: walking `a` more steps from the meeting point lands exactly on the cycle start. Interviewers ask for this; a two-sentence version is enough.

The same algorithm solves *Find the Duplicate Number* by treating `nums[i]` as a `next` pointer, which is a favourite "aha" question.

## Worked problem 4: Reorder list

**Problem.** Reorder `L0 → L1 → … → Ln` into `L0 → Ln → L1 → Ln−1 → …` in place.

**Approach.** Three toolkit pieces in sequence: find the middle, reverse the second half, merge alternately.

```python
def reorder_list(head: Optional[ListNode]) -> None:
    if not head or not head.next:
        return
    # 1. middle (first middle for even length)
    slow, fast = head, head.next
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    second = slow.next
    slow.next = None                          # cut

    # 2. reverse second half
    prev = None
    while second:
        nxt = second.next
        second.next = prev
        prev, second = second, nxt

    # 3. interleave: first half is the longer one when the length is odd
    first, second = head, prev
    while second:
        first_next, second_next = first.next, second.next
        first.next = second
        second.next = first_next
        first, second = first_next, second_next
```

It is tempting to compress the pointer updates into one-line tuple assignments. Resist it: the right-hand side is evaluated before any assignment happens, and it is very easy to read a pointer that has already moved. Four plain lines are safer under pressure.

## Worked problem 5: Reverse nodes in k-group

**Problem.** Reverse every consecutive group of `k` nodes; leave a final shorter group as is.

```
1→2→3→4→5, k = 2  ->  2→1→4→3→5
```

**Approach.** For each group: check that `k` nodes exist, reverse exactly `k`, reconnect. A dummy head and a `group_prev` pointer keep the reconnection uniform.

```python
def reverse_k_group(head: Optional[ListNode], k: int) -> Optional[ListNode]:
    dummy = ListNode(0, head)
    group_prev = dummy

    while True:
        # is there a full group ahead?
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if kth is None:
                return dummy.next
        group_next = kth.next

        # reverse k nodes starting at group_prev.next
        prev, curr = group_next, group_prev.next
        for _ in range(k):
            nxt = curr.next
            curr.next = prev
            prev, curr = curr, nxt

        # reconnect: old first node is now the tail of this group
        old_first = group_prev.next
        group_prev.next = kth
        group_prev = old_first
```

Notice `prev` starts at `group_next`, not `None`: the reversed group's tail should point straight to the rest of the list, saving a separate fix-up.

## Worked problem 6: Add two numbers

Digits stored in reverse order; add them like on paper, carrying.

```python
def add_two_numbers(a: Optional[ListNode], b: Optional[ListNode]) -> Optional[ListNode]:
    dummy = ListNode()
    tail = dummy
    carry = 0
    while a or b or carry:
        total = carry + (a.val if a else 0) + (b.val if b else 0)
        carry, digit = divmod(total, 10)
        tail.next = ListNode(digit)
        tail = tail.next
        a = a.next if a else None
        b = b.next if b else None
    return dummy.next
```

The `while a or b or carry` condition handles unequal lengths and a final carry with no extra code.

## Worked problem 7: Copy list with random pointer

Each node has a `next` and a `random` pointer. Deep copy it.

**Hash-map approach** (O(n) space): first pass creates a copy of each node and maps `old → new`; second pass wires `next` and `random` through the map.

```python
def copy_random_list(head):
    if not head:
        return None
    mapping = {}
    node = head
    while node:
        mapping[node] = Node(node.val)
        node = node.next
    node = head
    while node:
        mapping[node].next = mapping.get(node.next)
        mapping[node].random = mapping.get(node.random)
        node = node.next
    return mapping[head]
```

The O(1)-space version interleaves copies (`A → A' → B → B'`), sets `A'.random = A.random.next`, then unweaves. Mention it as a follow-up; write it only if asked.

## Worked problem 8: Palindrome linked list in O(1) space

Find the middle, reverse the second half, compare, and (good manners) restore the list.

```python
def is_palindrome(head: Optional[ListNode]) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    prev = None
    while slow:                                  # reverse from the middle
        slow.next, prev, slow = prev, slow, slow.next
    left, right = head, prev
    while right:                                 # second half is the shorter or equal one
        if left.val != right.val:
            return False
        left, right = left.next, right.next
    return True
```

## Common mistakes

- **Losing the rest of the list** by overwriting `.next` before saving it. Always `nxt = curr.next` first.
- **Not using a dummy head** and then special-casing the head, which is where bugs hide.
- **Off-by-one in fast/slow** for even-length lists. Decide whether you want the first or second middle and set `fast` accordingly.
- **Comparing with `==` instead of `is`** when checking node identity in cycle detection. `==` on nodes without `__eq__` is identity anyway, but `is` says what you mean.
- **Forgetting the final carry** in add-two-numbers.
- **Infinite loops** when a cut (`slow.next = None`) is missing before reversing or merging halves.

## Practice set

**Easy**

- Reverse Linked List
- Merge Two Sorted Lists
- Linked List Cycle
- Middle of the Linked List
- Palindrome Linked List
- Remove Duplicates from Sorted List
- Intersection of Two Linked Lists (two pointers that switch lists at the end)

**Medium**

- Remove Nth Node From End of List
- Add Two Numbers
- Reorder List
- Linked List Cycle II
- Copy List with Random Pointer
- Swap Nodes in Pairs
- Sort List (merge sort on a linked list, O(n log n), O(log n) stack)
- Rotate List
- Partition List
- LRU Cache (hashing chapter)

**Hard**

- Reverse Nodes in k-Group
- Merge k Sorted Lists

Next: binary search, which is far more than "find x in a sorted array".
