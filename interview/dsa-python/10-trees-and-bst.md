---
title: Trees & Binary Search Trees
part: Core Patterns
summary: Traversals as tools, the "return something from the subtree" recursion shape, level-order with a queue, BST properties, and lowest common ancestor.
---

## Why interviewers love this pattern

Trees are the purest test of recursive thinking. A binary tree is either empty or a node with two smaller trees, so nearly every question is: *decide what the function returns for a subtree, combine the answers for the left and right children, handle the empty case.* Once that clicks, dozens of problems become five-line functions.

You will be given:

```python
from typing import Optional

class TreeNode:
    def __init__(self, val: int = 0, left: "Optional[TreeNode]" = None, right: "Optional[TreeNode]" = None):
        self.val = val
        self.left = left
        self.right = right
```

## Traversals, briefly

You know these. The interview point is *what each order is good for*.

| Order | Visit sequence | Use it when |
|---|---|---|
| Preorder | node, left, right | copying or serialising a tree; the root comes first |
| Inorder | left, node, right | BST: gives sorted order |
| Postorder | left, right, node | computing something about a subtree before its parent (height, delete) |
| Level order (BFS) | by depth | anything with "level", "depth", "closest", "right side view" |

Recursive inorder:

```python
def inorder(root: Optional[TreeNode]) -> list[int]:
    result = []
    def visit(node):
        if node:
            visit(node.left)
            result.append(node.val)
            visit(node.right)
    visit(root)
    return result
```

**Iterative inorder** with an explicit stack is asked often, especially as the basis of the *BST Iterator* question:

```python
def inorder_iterative(root: Optional[TreeNode]) -> list[int]:
    result, stack = [], []
    node = root
    while node or stack:
        while node:                       # go as far left as possible
            stack.append(node)
            node = node.left
        node = stack.pop()                # visit
        result.append(node.val)
        node = node.right                 # then the right subtree
    return result
```

**Level order** with a queue, processing one level per outer iteration:

```python
from collections import deque

def level_order(root: Optional[TreeNode]) -> list[list[int]]:
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):       # exactly the nodes on this level
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result
```

The `for _ in range(len(queue))` trick is what separates levels. Variants: zigzag (reverse alternate levels), right side view (last value of each level), average of levels, minimum depth (stop at the first leaf).

## The recursion shape

Most tree problems fit one of two shapes.

**Shape A: return a value about the subtree.** Height, size, sum, is-balanced, is-symmetric. The function returns the answer for the subtree rooted at `node`.

```python
def max_depth(node: Optional[TreeNode]) -> int:
    if not node:
        return 0
    return 1 + max(max_depth(node.left), max_depth(node.right))
```

**Shape B: update a global best while returning something smaller.** Diameter, max path sum, longest univalue path. The function returns the best *downward* path from `node`, and updates a shared best using the *through-node* combination of both children.

```python
def diameter_of_binary_tree(root: Optional[TreeNode]) -> int:
    best = 0

    def height(node) -> int:
        nonlocal best
        if not node:
            return 0
        left = height(node.left)
        right = height(node.right)
        best = max(best, left + right)          # path through this node, in edges
        return 1 + max(left, right)             # what the parent can use

    height(root)
    return best
```

The line to internalise: **the value you return to the parent is not always the value you are optimising.** The parent can only extend one arm; the best path might use both.

> **Interview tip:** Before coding a tree problem, say the contract: "My helper returns the height of the subtree, and as a side effect updates the diameter." The interviewer can then follow the code without guessing.

## Worked problem 1: Validate a binary search tree

**Problem.** Return whether the tree is a valid BST: every node in the left subtree is strictly smaller, every node in the right subtree strictly larger, at all levels.

**Common wrong answer.** Checking only `node.left.val < node.val < node.right.val`. That misses a grandchild that violates the range of a grandparent.

**Approach.** Pass down the allowed `(low, high)` range.

```python
def is_valid_bst(root: Optional[TreeNode]) -> bool:
    def valid(node, low, high) -> bool:
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return valid(node.left, low, node.val) and valid(node.right, node.val, high)

    return valid(root, float("-inf"), float("inf"))
```

Alternative: an inorder traversal must be strictly increasing. Keep the previous value and compare.

## Worked problem 2: Lowest common ancestor

**Problem.** Given two nodes `p` and `q` in a binary tree, find the deepest node that is an ancestor of both (a node counts as its own ancestor).

**Approach.** Postorder. Return `p` or `q` if you find one; otherwise, if both sides returned something, this node is the LCA; otherwise pass up whichever side found something.

```python
def lowest_common_ancestor(root, p, q):
    if root is None or root is p or root is q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root                        # one on each side
    return left or right                   # both on one side, or none
```

**Dry run** on:

```
        3
      /   \
     5     1
    / \   / \
   6   2 0   8
      / \
     7   4
```

LCA(5, 1): the left subtree returns 5 (found immediately), the right returns 1. Both non-null at node 3, so answer is 3. LCA(5, 4): the left subtree finds 5 at once and returns it without going deeper (4 is under 5, so 5 is its own ancestor). Right subtree returns None. Answer 5.

**In a BST** it is simpler: walk down from the root. If both values are smaller, go left; both larger, go right; otherwise the current node is the split point.

```python
def lca_bst(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
```

## Worked problem 3: Binary tree maximum path sum

**Problem.** A path is any sequence of nodes connected parent-child, not necessarily through the root. Find the maximum sum of node values along a path.

**Approach.** Shape B. Return the best *single-arm* gain from a node (node value plus the better child, floored at 0 because a negative arm should be dropped). Update the global best with node plus both arms.

```python
def max_path_sum(root: Optional[TreeNode]) -> int:
    best = float("-inf")

    def gain(node) -> int:
        nonlocal best
        if not node:
            return 0
        left = max(gain(node.left), 0)          # ignore negative arms
        right = max(gain(node.right), 0)
        best = max(best, node.val + left + right)
        return node.val + max(left, right)

    gain(root)
    return best
```

The `max(..., 0)` is the detail interviewers wait for. Without it, a subtree of negatives drags down the answer.

## Worked problem 4: Serialize and deserialize a binary tree

**Problem.** Convert a tree to a string and back.

**Approach.** Preorder with explicit null markers. Preorder is natural for reconstruction because the root comes first; nulls make the shape unambiguous.

```python
class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        parts = []
        def walk(node):
            if node is None:
                parts.append("#")
                return
            parts.append(str(node.val))
            walk(node.left)
            walk(node.right)
        walk(root)
        return ",".join(parts)

    def deserialize(self, data: str) -> Optional[TreeNode]:
        tokens = iter(data.split(","))
        def build():
            token = next(tokens)
            if token == "#":
                return None
            node = TreeNode(int(token))
            node.left = build()
            node.right = build()
            return node
        return build()
```

Using an iterator for `tokens` avoids passing an index around. O(n) both ways.

## Worked problem 5: Construct a tree from preorder and inorder

**Problem.** Rebuild the unique binary tree from its preorder and inorder traversals (distinct values).

**Insight.** The first preorder value is the root. Find it in inorder: everything left of it is the left subtree, everything right is the right subtree. The left subtree's size tells you where to split preorder.

```python
def build_tree(preorder: list[int], inorder: list[int]) -> Optional[TreeNode]:
    index_in_inorder = {v: i for i, v in enumerate(inorder)}
    pre_idx = 0

    def build(lo: int, hi: int) -> Optional[TreeNode]:   # inorder range [lo, hi)
        nonlocal pre_idx
        if lo >= hi:
            return None
        root_val = preorder[pre_idx]
        pre_idx += 1
        root = TreeNode(root_val)
        mid = index_in_inorder[root_val]
        root.left = build(lo, mid)            # must build left first: preorder order
        root.right = build(mid + 1, hi)
        return root

    return build(0, len(inorder))
```

The hash map turns each split into O(1), so the whole thing is O(n). Passing index ranges instead of slicing lists avoids O(n²) copying.

## Worked problem 6: Kth smallest in a BST

Inorder visits a BST in sorted order, so stop at the k-th visit. Use the iterative form so you can stop early.

```python
def kth_smallest(root: Optional[TreeNode], k: int) -> int:
    stack = []
    node = root
    while node or stack:
        while node:
            stack.append(node)
            node = node.left
        node = stack.pop()
        k -= 1
        if k == 0:
            return node.val
        node = node.right
    raise ValueError("k out of range")
```

Follow-up: "what if the tree is modified often and you need k-th smallest repeatedly?" Store subtree sizes in each node, then walk down in O(height).

## Worked problem 7: Invert, symmetric, same tree

Three warm-ups with the same skeleton. Know them cold; they take thirty seconds each.

```python
def invert_tree(root):
    if root:
        root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root

def is_same_tree(a, b) -> bool:
    if not a or not b:
        return a is b                      # both None
    return a.val == b.val and is_same_tree(a.left, b.left) and is_same_tree(a.right, b.right)

def is_symmetric(root) -> bool:
    def mirror(a, b) -> bool:
        if not a or not b:
            return a is b
        return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)
    return mirror(root, root)
```

## Worked problem 8: Path sum III (count paths with a given sum)

**Problem.** Count downward paths (any start, any end, going down) whose node values sum to `target`.

**Approach.** The prefix-sum-plus-hash-map trick from the hashing chapter, applied along the root-to-node path. Backtrack the map on the way up.

```python
from collections import defaultdict

def path_sum(root: Optional[TreeNode], target: int) -> int:
    prefix_count = defaultdict(int)
    prefix_count[0] = 1
    count = 0

    def dfs(node, running: int) -> None:
        nonlocal count
        if not node:
            return
        running += node.val
        count += prefix_count[running - target]
        prefix_count[running] += 1
        dfs(node.left, running)
        dfs(node.right, running)
        prefix_count[running] -= 1          # un-choose: leave this path

    dfs(root, 0)
    return count
```

O(n) time versus O(n²) for the "try every start node" approach. This is a great example of one pattern (prefix sums) transferring to another structure.

## Common mistakes

- **Not handling the empty tree** at the top of each recursive function. The `if not node` line is the base case and should be first.
- **Validating a BST with only local checks.** Pass the range down.
- **Returning the through-node value to the parent** in shape-B problems. Return the single arm.
- **Forgetting `nonlocal`** when updating a best value from an inner function. (Or use a one-element list, but `nonlocal` is cleaner.)
- **Slicing lists in build-tree recursion**, which makes it O(n²).
- **Hitting the recursion limit** on a skewed tree of 10⁴ nodes. Raise the limit or go iterative, and say which.

## Practice set

**Easy**

- Maximum Depth of Binary Tree
- Invert Binary Tree
- Same Tree, Symmetric Tree
- Diameter of Binary Tree
- Balanced Binary Tree
- Path Sum
- Subtree of Another Tree

**Medium**

- Binary Tree Level Order Traversal, Zigzag, Right Side View
- Validate Binary Search Tree
- Kth Smallest Element in a BST
- Lowest Common Ancestor (binary tree and BST versions)
- Construct Binary Tree from Preorder and Inorder Traversal
- Path Sum II, Path Sum III
- Count Good Nodes in Binary Tree
- Binary Tree Inorder Traversal (iterative)
- Flatten Binary Tree to Linked List
- Populating Next Right Pointers in Each Node
- Delete Node in a BST

**Hard**

- Binary Tree Maximum Path Sum
- Serialize and Deserialize Binary Tree
- Binary Tree Cameras

Next: heaps, for everything "top k" and "k-th largest".
