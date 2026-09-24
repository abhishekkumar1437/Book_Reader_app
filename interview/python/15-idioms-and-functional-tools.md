---
title: Pythonic Idioms & Functional Tools
part: Intermediate
summary: The built-ins and idioms that make code short and clear. any and all, sorted with keys, unpacking, chained comparisons, the walrus, string building, and when to prefer a comprehension, a loop, or map.
---

## Why idioms matter

Interviewers notice how you write, not only whether it works. Two solutions can be equally correct, and the one that uses `enumerate` instead of `range(len(...))`, `any` instead of a flag variable, and unpacking instead of indexing reads as written by someone who knows the language. This chapter collects those habits.

## Built-ins that replace loops

```pycon
>>> nums = [3, 8, 1, 9]
>>> sum(nums), min(nums), max(nums), len(nums)
(21, 1, 9, 4)
>>> any(n > 8 for n in nums), all(n > 0 for n in nums)
(True, True)
>>> sorted(nums), sorted(nums, reverse=True)
([1, 3, 8, 9], [9, 8, 3, 1])
>>> max(["apple", "fig", "banana"], key=len), min({"a": 3, "b": 1}, key=lambda k: {"a": 3, "b": 1}[k])
('banana', 'b')
>>> sum([[1], [2, 3]], [])                 # works, but quadratic; prefer chain
[1, 2, 3]
>>> list(reversed("abc")), "abc"[::-1]
(['c', 'b', 'a'], 'cba')
>>> round(3.14159, 2), abs(-4), divmod(17, 5), pow(2, 10), pow(2, 10, 7)
(3.14, 4, (3, 2), 1024, 2)
```

`any` and `all` short-circuit and accept generator expressions, so `any(condition for x in big_iterable)` stops at the first hit. `all([])` is `True` and `any([])` is `False`.

## Flag variables become `any`/`all`/`next`

```python
# clumsy
found = False
for u in users:
    if u.active:
        found = True
        break

# idiomatic
found = any(u.active for u in users)

# first matching item, or a default
first_active = next((u for u in users if u.active), None)
```

`next(iterator, default)` on a generator expression is the "find first" idiom.

## `enumerate`, `zip`, and unpacking

```pycon
>>> pairs = [("a", 1), ("b", 2)]
>>> for i, (letter, number) in enumerate(pairs, start=1):
...     print(i, letter, number)
...
1 a 1
2 b 2
>>> letters, numbers = zip(*pairs)              # "unzip"
>>> letters, numbers
(('a', 'b'), (1, 2))
>>> head, *body, tail = range(5)
>>> head, body, tail
(0, [1, 2, 3], 4)
>>> a, b = 1, 2
>>> a, b = b, a
>>> a, b
(2, 1)
```

Swap with `a, b = b, a`. Ignore values with `_`: `for _ in range(3)`, `first, _, third = t`.

## Comprehensions versus `map`/`filter`

```pycon
>>> words = ["Apple", "fig", "Banana"]
>>> [w.lower() for w in words]
['apple', 'fig', 'banana']
>>> list(map(str.lower, words))                # fine when the function already exists
['apple', 'fig', 'banana']
>>> [w for w in words if len(w) > 3]
['Apple', 'Banana']
>>> list(filter(lambda w: len(w) > 3, words))  # a lambda here is a sign to use the comprehension
['Apple', 'Banana']
>>> {w[0].lower() for w in words} == {"a", "f", "b"}
True
>>> {w: len(w) for w in words}
{'Apple': 5, 'fig': 3, 'Banana': 6}
```

Prefer the comprehension when you would need a lambda; prefer `map` when passing an existing function. Both are lazy in the `map` case; comprehensions build the list immediately.

## Sorting idioms

```pycon
>>> people = [("ann", 30), ("bob", 25), ("cy", 30)]
>>> sorted(people, key=lambda p: p[1])                       # by age
[('bob', 25), ('ann', 30), ('cy', 30)]
>>> sorted(people, key=lambda p: (-p[1], p[0]))              # age desc, name asc
[('ann', 30), ('cy', 30), ('bob', 25)]
>>> from operator import itemgetter, attrgetter
>>> sorted(people, key=itemgetter(1, 0))
[('bob', 25), ('ann', 30), ('cy', 30)]
>>> sorted("Hello World".split(), key=str.casefold)
['Hello', 'World']
>>> sorted([3, 1, 2], reverse=True) == sorted([3, 1, 2])[::-1]
True
```

Sort by several keys with a tuple. Negate numbers to reverse one key. Because sorts are stable, you can also sort by the secondary key first, then by the primary.

## Dictionary idioms

```pycon
>>> inventory = {"apple": 3, "pear": 0}
>>> inventory.get("kiwi", 0)
0
>>> {k: v for k, v in inventory.items() if v}                # filter
{'apple': 3}
>>> max(inventory, key=inventory.get)                        # key with the largest value
'apple'
>>> for name, qty in sorted(inventory.items()):
...     print(f"{name:<6}{qty:>3}")
...
apple   3
pear    0
>>> from collections import Counter
>>> Counter("hello").most_common(1)
[('l', 2)]
```

## String building and formatting idioms

```pycon
>>> ", ".join(str(n) for n in range(4))
'0, 1, 2, 3'
>>> "-" * 10
'----------'
>>> f"{'Name':<10}{'Qty':>5}"
'Name        Qty'
>>> "yes" if 3 > 2 else "no"
'yes'
>>> lines = ["a", "b"]
>>> print("\n".join(lines))
a
b
```

## Truthiness and defaults

```pycon
>>> name = ""
>>> display = name or "anonymous"
>>> display
'anonymous'
>>> count = 0
>>> count or 10                                   # trap: 0 is falsy; use `count if count is not None else 10`
10
>>> settings = None
>>> (settings or {}).get("theme", "light")
'light'
```

Use `x or default` only when every falsy value of `x` should be replaced. When `0`, `""`, or `[]` are legitimate, test `is None` explicitly.

## The walrus operator

Assign inside an expression to avoid repeating a call or a lookup.

```pycon
>>> import re
>>> text = "order 42 shipped"
>>> if (m := re.search(r"\d+", text)):
...     print(int(m.group()))
...
42
>>> data = [1, 5, 9]
>>> [y for x in data if (y := x * 2) > 5]
[10, 18]
```

## Chained comparisons and membership

```pycon
>>> x = 5
>>> 1 < x <= 5, x in range(1, 6), x in (1, 5, 9), "a" in "cat"
(True, True, True, True)
>>> status = "active"
>>> status in {"active", "trial"}                # a set literal for a fixed set of options
True
```

## Small functions from the standard library that keep code short

```pycon
>>> import itertools, functools, operator, statistics
>>> list(itertools.chain.from_iterable([[1, 2], [3]]))        # flatten one level
[1, 2, 3]
>>> functools.reduce(operator.mul, [1, 2, 3, 4])
24
>>> statistics.mean([1, 2, 3, 4]), statistics.median([3, 1, 2])
(2.5, 2)
>>> list(itertools.pairwise([1, 2, 3]))
[(1, 2), (2, 3)]
>>> list(itertools.batched("abcdefg", 3))
[('a', 'b', 'c'), ('d', 'e', 'f'), ('g',)]
```

`itertools.pairwise` (3.10) and `itertools.batched` (3.12) replace small helper functions people used to write by hand.

## Functional style, in moderation

Python supports functional patterns (first-class functions, `map`, `reduce`, closures, immutability via tuples and frozensets), but it is not a functional language. Idiomatic Python uses comprehensions and generators for data transformations, keeps `reduce` for the rare fold that `sum`/`min`/`max` do not cover, and avoids deeply nested lambdas. Pure functions (no side effects) are still a good habit: they are easy to test and to cache.

## Style checklist for interview code

- Names: `snake_case`, descriptive, no single letters except loop indexes and maths.
- Prefer `for item in items` to index loops; `enumerate` when you need the index.
- Use truthiness: `if items:`, `if not name:`.
- Build strings with `join` and f-strings.
- Use `with` for files and locks.
- Return early to avoid deep nesting.
- Small functions, one job each, with type hints on the signature.
- No mutable default arguments, no bare `except`, no `global` unless unavoidable.

## Interview questions

**What does "Pythonic" mean?**
Writing code the way the language and its community intend: readable, direct, using built-in idioms (comprehensions, unpacking, iteration protocols, context managers) instead of translating patterns from other languages.

**What is the difference between `map`/`filter` and comprehensions?**
Both transform iterables. Comprehensions are usually more readable, especially when a lambda would be needed; `map` and `filter` return lazy iterators and are fine when the function already exists.

**What do `any` and `all` do with an empty iterable?**
`any([])` is `False`, `all([])` is `True` (vacuous truth).

**How do you sort a list of tuples by the second element, descending, then the first ascending?**
`sorted(items, key=lambda t: (-t[1], t[0]))`, or use `itemgetter` and rely on stability with two sorts.

**How do you swap two variables?**
`a, b = b, a`; tuple packing and unpacking, no temporary.

**How do you flatten a list of lists?**
`[x for row in rows for x in row]` or `list(itertools.chain.from_iterable(rows))`. Not `sum(rows, [])`, which is quadratic.

**What is the walrus operator for?**
Assigning a value inside an expression so it can be tested and reused without a separate statement, for example in `while` loops reading chunks or in comprehensions.

**What is `functools.reduce` and when would you use it?**
It folds an iterable into one value with a two-argument function. Use it only when no built-in (`sum`, `min`, `max`, `any`, `all`, `"".join`) fits; readability suffers otherwise.

**Why is `x or default` sometimes wrong?**
Because every falsy value (`0`, `""`, `[]`, `False`) triggers the default, not only `None`. Use `x if x is not None else default` when falsy values are valid.

**How do you get the first element of an iterable that matches a condition?**
`next((x for x in items if cond(x)), None)`.
