---
title: Dictionaries & Sets
part: Foundations
summary: Hash-based containers. Dictionary operations and idioms, ordering guarantees, defaultdict and Counter, set algebra, what hashable means, and why lookups are O(1).
---

## Dictionaries

A dict maps keys to values. Lookup, insertion, and deletion by key are O(1) on average because keys are hashed.

```pycon
>>> ages = {"ann": 31, "bob": 25}
>>> ages["ann"]
31
>>> ages["cat"] = 40            # insert
>>> ages["bob"] = 26            # update
>>> len(ages), "bob" in ages, 25 in ages
(3, True, False)
>>> ages["zed"]
Traceback (most recent call last):
    ...
KeyError: 'zed'
```

`in` checks keys, not values. Keys must be hashable (below); values can be anything.

### Reading safely

```pycon
>>> ages.get("zed")                 # None when missing
>>> ages.get("zed", 0)              # default when missing
0
>>> ages.setdefault("dan", 18)      # insert the default if missing, return the value
18
>>> ages["dan"]
18
```

### Removing

```pycon
>>> ages.pop("dan")
18
>>> ages.pop("nobody", None)        # default avoids KeyError
>>> del ages["cat"]
>>> ages.popitem()                  # remove and return the last inserted pair
('bob', 26)
>>> ages
{'ann': 31}
```

### Views and iteration

`keys()`, `values()`, and `items()` return live **views** of the dict, not copies.

```pycon
>>> d = {"x": 1, "y": 2}
>>> list(d.keys()), list(d.values()), list(d.items())
(['x', 'y'], [1, 2], [('x', 1), ('y', 2)])
>>> for key, value in d.items():
...     print(key, "->", value)
...
x -> 1
y -> 2
>>> {v: k for k, v in d.items()}            # invert (values must be unique and hashable)
{1: 'x', 2: 'y'}
```

### Ordering

Since Python 3.7, dicts preserve **insertion order** as a language guarantee. Iteration, `list(d)`, `popitem`, and printing all follow the order keys were first added. Updating a value does not move a key; deleting and re-adding does.

```pycon
>>> d = {"b": 1, "a": 2}
>>> d["b"] = 99
>>> list(d)
['b', 'a']
>>> dict(sorted(d.items()))                 # sort by key
{'a': 2, 'b': 99}
>>> dict(sorted(d.items(), key=lambda kv: kv[1], reverse=True))    # sort by value
{'b': 99, 'a': 2}
```

### Building dicts

```pycon
>>> dict(a=1, b=2)
{'a': 1, 'b': 2}
>>> dict([("a", 1), ("b", 2)])
{'a': 1, 'b': 2}
>>> dict(zip("ab", [1, 2]))
{'a': 1, 'b': 2}
>>> {n: n * n for n in range(4)}            # comprehension
{0: 0, 1: 1, 2: 4, 3: 9}
>>> dict.fromkeys(["a", "b"], 0)
{'a': 0, 'b': 0}
```

### Merging

```pycon
>>> base = {"a": 1, "b": 2}
>>> extra = {"b": 3, "c": 4}
>>> {**base, **extra}                       # right side wins
{'a': 1, 'b': 3, 'c': 4}
>>> base | extra                            # same, Python 3.9+
{'a': 1, 'b': 3, 'c': 4}
>>> base.update(extra)                      # in place
>>> base
{'a': 1, 'b': 3, 'c': 4}
```

### Nested dicts and JSON-like data

```pycon
>>> user = {"name": "ann", "address": {"city": "Pune"}, "tags": ["a", "b"]}
>>> user["address"]["city"]
'Pune'
>>> user.get("address", {}).get("zip", "n/a")
'n/a'
```

## Counting and grouping: `Counter` and `defaultdict`

The two most useful tools in `collections`, and they show up in nearly every interview solution that involves counting.

```pycon
>>> from collections import Counter, defaultdict
>>> counts = Counter("abracadabra")
>>> counts["a"], counts["z"]                # missing keys count as 0
(5, 0)
>>> counts.most_common(2)
[('a', 5), ('b', 2)]
>>> Counter([1, 2]) + Counter([2, 3])
Counter({2: 2, 1: 1, 3: 1})
>>> sum(counts.values())
11
```

`defaultdict` creates a missing key's value by calling a factory:

```pycon
>>> groups = defaultdict(list)
>>> for word in ["apple", "avocado", "banana"]:
...     groups[word[0]].append(word)
...
>>> dict(groups)
{'a': ['apple', 'avocado'], 'b': ['banana']}
>>> totals = defaultdict(int)
>>> for item, price in [("x", 2), ("y", 3), ("x", 4)]:
...     totals[item] += price
...
>>> dict(totals)
{'x': 6, 'y': 3}
```

Without `defaultdict` the loop body needs `if key not in d: d[key] = []` or `d.setdefault(key, []).append(...)`. Both are fine; `defaultdict` is cleanest when the whole dict has one default.

## What "hashable" means

A key must have a hash value that never changes during its lifetime, and equal objects must have equal hashes. Immutable built-ins qualify: numbers, strings, tuples of hashables, `frozenset`. Mutable built-ins do not: lists, dicts, sets. User-defined objects are hashable by identity unless they define `__eq__` without `__hash__`.

```pycon
>>> hash("a") == hash("a"), hash((1, 2)) == hash((1, 2))
(True, True)
>>> {[1]: "x"}
Traceback (most recent call last):
    ...
TypeError: unhashable type: 'list'
>>> {(1, [2]): "x"}
Traceback (most recent call last):
    ...
TypeError: unhashable type: 'list'
>>> {1: "int", 1.0: "float", True: "bool"}          # 1 == 1.0 == True, same hash: one key
{1: 'bool'}
```

The last line surprises everyone: the key `1` stays, but the value is overwritten each time because all three keys are equal.

### How the dict works, briefly

A dict is a hash table: an array of slots. `hash(key)` picks a slot; if it is taken by a different key (a collision), probing finds another. Lookup is O(1) on average, O(n) in the worst case if everything collides. Since 3.6 the implementation keeps a compact array of entries in insertion order plus a sparse index, which is why order is preserved and memory is small.

## Sets

A set is an unordered collection of unique, hashable items with O(1) membership tests.

```pycon
>>> s = {3, 1, 2, 3}
>>> len(s), 2 in s
(3, True)
>>> s.add(4)
>>> s.discard(99)              # no error if missing
>>> s.remove(99)
Traceback (most recent call last):
    ...
KeyError: 99
>>> empty = set()              # {} is an empty DICT
>>> type({})
<class 'dict'>
>>> sorted(s)
[1, 2, 3, 4]
```

Sets have no order you can rely on; print them sorted when the order matters.

### Set algebra

```pycon
>>> a, b = {1, 2, 3}, {3, 4}
>>> a | b, a & b, a - b, a ^ b            # union, intersection, difference, symmetric difference
({1, 2, 3, 4}, {3}, {1, 2}, {1, 2, 4})
>>> a.union(b) == a | b
True
>>> {1, 2} <= a, a >= {1}, {1, 2}.isdisjoint({3})     # subset, superset, no overlap
(True, True, True)
>>> a |= {9}                              # in-place update
>>> sorted(a)
[1, 2, 3, 9]
```

### Frozen sets

`frozenset` is an immutable set, so it can be a dict key or a member of another set.

```pycon
>>> pairs = {frozenset({"a", "b"}), frozenset({"b", "a"})}
>>> len(pairs)
1
```

### Set comprehensions

```pycon
>>> {word[0] for word in ["apple", "avocado", "banana"]} == {"a", "b"}
True
```

## Choosing between them

| Need | Use |
|---|---|
| Lookup a value by key | dict |
| Membership test, deduplication | set |
| Counting | `Counter` |
| Grouping | `defaultdict(list)` |
| Ordered pairs with duplicates | list of tuples |
| Immutable mapping | `types.MappingProxyType` (rare); tuple of pairs |

## Classic problems

**Two Sum with a dict (O(n))**

```python
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []
```

```pycon
>>> two_sum([2, 7, 11, 15], 9)
[0, 1]
```

**Word frequency, top 3**

```pycon
>>> text = "the cat and the hat and the bat"
>>> Counter(text.split()).most_common(3)
[('the', 3), ('and', 2), ('cat', 1)]
```

**Group anagrams**

```pycon
>>> words = ["eat", "tea", "tan", "ate", "nat"]
>>> groups = defaultdict(list)
>>> for w in words:
...     groups["".join(sorted(w))].append(w)
...
>>> list(groups.values())
[['eat', 'tea', 'ate'], ['tan', 'nat']]
```

**Common elements of two lists**

```pycon
>>> sorted(set([1, 2, 2, 3]) & set([2, 3, 4]))
[2, 3]
```

**Check for duplicates**

```pycon
>>> def has_duplicates(items):
...     return len(set(items)) != len(items)
...
>>> has_duplicates([1, 2, 3]), has_duplicates([1, 2, 1])
(False, True)
```

**Invert a dict with duplicate values**

```pycon
>>> scores = {"ann": 90, "bob": 85, "cat": 90}
>>> by_score = defaultdict(list)
>>> for name, score in scores.items():
...     by_score[score].append(name)
...
>>> dict(by_score)
{90: ['ann', 'cat'], 85: ['bob']}
```

## Interview questions

**How is a dictionary implemented, and why is lookup O(1)?**
As a hash table. The key's hash selects a slot directly, so lookup does not scan. Collisions are resolved by probing; with a good hash function they are rare, giving average O(1).

**What can be a dictionary key?**
Any hashable object: immutable built-ins (numbers, strings, tuples of hashables, frozensets) and most user-defined objects. Lists, dicts, and sets cannot be keys.

**Do dictionaries preserve order?**
Yes, insertion order, guaranteed since Python 3.7 (an implementation detail in 3.6).

**What is the difference between `d[key]` and `d.get(key)`?**
`d[key]` raises `KeyError` when the key is missing; `get` returns `None` or a supplied default.

**What is the difference between a list and a set?**
Lists are ordered, allow duplicates, and membership is O(n). Sets are unordered, unique, and membership is O(1). Sets require hashable elements.

**What is `defaultdict` and when would you use it?**
A dict subclass that creates a missing key's value with a factory function on first access. Use it for grouping (`defaultdict(list)`) and counting (`defaultdict(int)`) to avoid "if key not in dict" checks.

**What does `Counter` do?**
Counts hashable items; it is a dict subclass with `most_common`, arithmetic between counters, and missing keys reading as 0.

**What happens with `{1: "a", 1.0: "b", True: "c"}`?**
One key, because `1 == 1.0 == True` and they hash the same. The key remains `1` (the first inserted) and the value is `"c"` (the last assigned).

**How do you merge two dictionaries?**
`{**a, **b}`, `a | b` (3.9+), or `a.update(b)` in place. Later values win.

**What is the difference between `remove` and `discard` on a set?**
`remove` raises `KeyError` if the element is absent; `discard` does nothing.

**How do you create an empty set?**
`set()`. `{}` creates an empty dict.

**Why must dict keys be immutable?**
If a key's value could change, its hash would change and the dict could no longer find it in the slot it was placed in. Hashability requires a stable hash, which in practice means immutability.

**How do you sort a dictionary by value?**
`dict(sorted(d.items(), key=lambda kv: kv[1]))`, or iterate over `sorted(d, key=d.get)` for keys ordered by value.
