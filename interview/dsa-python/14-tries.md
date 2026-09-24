---
title: Tries
part: Core Patterns
summary: The prefix tree. Build one in ten lines, then use it for autocomplete, word search in a grid, wildcard matching, and maximum XOR.
---

## Why interviewers love this pattern

A trie stores a set of strings so that any prefix query costs O(length of the prefix), regardless of how many words are stored. That single property makes it the answer whenever a problem says **prefix**, **autocomplete**, **starts with**, or asks you to search a grid for *many* words at once. It is also a good test of whether you can design a small class cleanly.

Recognise it when you read:

- "implement insert / search / startsWith";
- "find all words in the dictionary that appear in this grid";
- "search with wildcards `.`";
- "shortest unique prefix", "replace words with their root";
- "maximum XOR of two numbers" (a binary trie on bits).

## The structure

Each node has a map from character to child, and a flag saying whether a word ends here. The root is an empty node. Inserting "cat" and "car" produces:

```
(root)
  └─ c
     └─ a
        ├─ t  [end]
        └─ r  [end]
```

Shared prefixes share nodes. That is the whole idea.

```python
class TrieNode:
    __slots__ = ("children", "is_end")
    def __init__(self):
        self.children: dict[str, "TrieNode"] = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def _walk(self, prefix: str):
        node = self.root
        for ch in prefix:
            node = node.children.get(ch)
            if node is None:
                return None
        return node

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return node is not None and node.is_end

    def starts_with(self, prefix: str) -> bool:
        return self._walk(prefix) is not None
```

The `_walk` helper is the trick that keeps `search` and `starts_with` to two lines each.

| Operation | Cost |
|---|---|
| insert, search, starts_with | O(L), L = length of the string |
| space | O(total characters), worst case; shared prefixes reduce it |

For a fixed lowercase alphabet, a list of 26 slots per node is faster than a dict but uses more memory. In an interview, the dict is fine and handles any characters.

**Dictionary-of-dicts shorthand.** When you want the shortest possible code, nest plain dicts and use a sentinel key for the end marker:

```python
def build(words: list[str]) -> dict:
    root = {}
    for w in words:
        node = root
        for ch in w:
            node = node.setdefault(ch, {})
        node["$"] = True                     # end-of-word marker
    return root
```

It is compact but harder to extend (no room for counts or stored values without care). Use the class when the problem needs extra data on nodes.

> **Interview tip:** Store useful data on the end node. For word search, store the word itself so you never rebuild it from the path. For autocomplete with counts, store a counter. For "replace words", stop at the first `is_end` on the walk.

## Worked problem 1: Design Add and Search Words (wildcards)

**Problem.** `add_word(word)` and `search(pattern)` where `.` matches any single letter.

**Approach.** Normal trie. For `search`, DFS: on a letter follow that child; on `.` try every child.

```python
class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def add_word(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_end = True

    def search(self, word: str) -> bool:
        def dfs(node: TrieNode, i: int) -> bool:
            if i == len(word):
                return node.is_end
            ch = word[i]
            if ch == ".":
                return any(dfs(child, i + 1) for child in node.children.values())
            child = node.children.get(ch)
            return child is not None and dfs(child, i + 1)
        return dfs(self.root, 0)
```

Worst case for a pattern of all dots is O(26^L), but in practice the branching is small. Say that.

## Worked problem 2: Word Search II

**Problem.** A grid of letters and a list of words. Return every word that can be formed by a path of adjacent cells (no cell reused).

**Why a trie.** Running the single-word DFS once per word is O(words × cells × 4^L). With all words in a trie, one DFS from each cell walks the trie and the grid together, pruning the moment the current path is not a prefix of any word.

```python
class WordNode:
    def __init__(self):
        self.children: dict[str, "WordNode"] = {}
        self.word: str | None = None                     # set on the last letter of a word

def find_words(board: list[list[str]], words: list[str]) -> list[str]:
    root = WordNode()
    for w in words:
        node = root
        for ch in w:
            node = node.children.setdefault(ch, WordNode())
        node.word = w                                    # store the word at its end node

    rows, cols = len(board), len(board[0])
    found = []

    def dfs(r: int, c: int, parent: WordNode) -> None:
        ch = board[r][c]
        node = parent.children.get(ch)
        if node is None:
            return
        if node.word:
            found.append(node.word)
            node.word = None                             # report each word once
        board[r][c] = "#"                                # mark visited
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != "#":
                dfs(nr, nc, node)
        board[r][c] = ch                                 # restore
        if not node.children:                            # prune: dead leaf, remove it
            del parent.children[ch]

    for r in range(rows):
        for c in range(cols):
            dfs(r, c, root)
    return found
```

Two refinements worth pointing out: storing the whole word on the end node, and deleting exhausted leaves so later searches skip them. The second one is what makes this solution pass the largest test cases.

## Worked problem 3: Replace words

**Problem.** A dictionary of roots and a sentence. Replace every word with the shortest root that is its prefix.

```python
def replace_words(dictionary: list[str], sentence: str) -> str:
    trie = Trie()
    for root in dictionary:
        trie.insert(root)

    def shortest_root(word: str) -> str:
        node = trie.root
        for i, ch in enumerate(word):
            node = node.children.get(ch)
            if node is None:
                return word
            if node.is_end:
                return word[:i + 1]
        return word

    return " ".join(shortest_root(w) for w in sentence.split())
```

Stop at the *first* end marker on the walk to get the shortest root.

## Worked problem 4: Autocomplete (Search Suggestions System)

**Problem.** For each prefix of the typed string, return up to three lexicographically smallest products that start with it.

**Trie approach.** Walk the prefix; DFS the subtree in sorted order and collect three. To make the collection fast, sort children keys on the fly or store up to three suggestions on each node at insert time (sort products first).

```python
def suggested_products(products: list[str], search_word: str) -> list[list[str]]:
    products.sort()
    root = {}
    for p in products:
        node = root
        for ch in p:
            node = node.setdefault(ch, {})
            node.setdefault("$sug", [])
            if len(node["$sug"]) < 3:
                node["$sug"].append(p)              # products arrive sorted, so first 3 are smallest

    result = []
    node = root
    for ch in search_word:
        node = node.get(ch) if node is not None else None
        result.append(node["$sug"] if node else [])
    return result
```

The simple alternative (sort, then binary search each prefix with `bisect` and check the next three) is also accepted and shorter. Mention both; write whichever the interviewer prefers.

## Worked problem 5: Maximum XOR of two numbers

**Problem.** Find the maximum `a ^ b` over all pairs in the array.

**Insight.** A binary trie on the bits (most significant first). For each number, walk the trie greedily choosing the *opposite* bit at each level when it exists, which sets that bit in the XOR. O(n × 32).

```python
def find_maximum_xor(nums: list[int]) -> int:
    root = {}
    for x in nums:
        node = root
        for b in range(31, -1, -1):
            bit = (x >> b) & 1
            node = node.setdefault(bit, {})

    best = 0
    for x in nums:
        node = root
        acc = 0
        for b in range(31, -1, -1):
            bit = (x >> b) & 1
            want = 1 - bit
            if want in node:
                acc |= (1 << b)
                node = node[want]
            else:
                node = node[bit]
        best = max(best, acc)
    return best
```

This is the pattern behind *Maximum XOR With an Element From Array* and *Count Pairs With XOR in a Range*.

## When not to use a trie

- A single `search` with no prefix queries: a `set` is simpler and O(L) as well.
- Very few words or very short queries: the constant factor of a trie is not worth it.
- You need substring (not prefix) matching: that is suffix trees/arrays or rolling hashes, rarely asked in coding rounds.

## Common mistakes

- **Forgetting the end marker**, so "car" matches after inserting only "cart".
- **Returning `True` from `search` when the walk succeeds** without checking `is_end`.
- **Rebuilding words from the path** in Word Search II instead of storing them on the node.
- **Not restoring the board** in the grid DFS.
- **Using a list of 26 with non-lowercase input.** Read the constraints.

## Practice set

**Easy**

- Longest Common Prefix (a trie is overkill; know the vertical-scan answer too)

**Medium**

- Implement Trie (Prefix Tree)
- Design Add and Search Words Data Structure
- Replace Words
- Search Suggestions System
- Map Sum Pairs
- Maximum XOR of Two Numbers in an Array
- Implement Magic Dictionary

**Hard**

- Word Search II
- Palindrome Pairs
- Stream of Characters (trie of reversed words)

Next: dynamic programming, in two parts.
