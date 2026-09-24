---
title: Lists & Tuples
part: Foundations
summary: The workhorse sequence and its immutable sibling. Methods, slicing, copying versus aliasing, sorting with keys, comprehensions, unpacking, and the cost of each operation.
---

## Lists

A list is an ordered, mutable sequence of any objects.

```pycon
>>> nums = [3, 1, 4, 1, 5]
>>> len(nums), nums[0], nums[-1]
(5, 3, 5)
>>> nums[1:3]
[1, 4]
>>> mixed = [1, "two", 3.0, [4]]
>>> mixed[3][0]
4
```

### Adding and removing

```pycon
>>> nums = [3, 1, 4]
>>> nums.append(1)            # add one item at the end
>>> nums.extend([5, 9])       # add all items of an iterable
>>> nums += [2]               # same as extend
>>> nums.insert(0, 0)         # insert at index (O(n): shifts everything)
>>> nums
[0, 3, 1, 4, 1, 5, 9, 2]
>>> nums.pop()                # remove and return the last item (O(1))
2
>>> nums.pop(0)               # remove and return by index (O(n))
0
>>> nums.remove(1)            # remove the first occurrence by value (O(n))
>>> nums
[3, 4, 1, 5, 9]
>>> del nums[0]
>>> nums
[4, 1, 5, 9]
>>> nums.clear()
>>> nums
[]
```

`append(x)` adds one element; `extend(xs)` adds each element of `xs`. `append([1, 2])` adds a single nested list, a classic beginner mistake.

### Searching and counting

```pycon
>>> letters = ["a", "b", "a", "c"]
>>> "a" in letters, letters.index("b"), letters.count("a")
(True, 1, 2)
>>> letters.index("z")
Traceback (most recent call last):
    ...
ValueError: 'z' is not in list
```

`in` and `index` scan the whole list: O(n). If you do many membership checks, use a set.

### Slicing

Slices copy. Assignment to a slice replaces a range in place.

```pycon
>>> nums = [0, 1, 2, 3, 4, 5]
>>> nums[::2], nums[::-1], nums[-2:]
([0, 2, 4], [5, 4, 3, 2, 1, 0], [4, 5])
>>> nums[1:3] = ["a", "b", "c"]     # replace 2 items with 3
>>> nums
[0, 'a', 'b', 'c', 3, 4, 5]
>>> nums[::2] = [9, 9, 9, 9]         # extended slices need the same length
>>> nums
[9, 'a', 9, 'c', 9, 4, 9]
>>> del nums[1::2]
>>> nums
[9, 9, 9, 9]
```

### Sorting and reversing

```pycon
>>> nums = [3, 1, 2]
>>> nums.sort()                      # in place, returns None
>>> nums
[1, 2, 3]
>>> nums.sort(reverse=True)
>>> nums
[3, 2, 1]
>>> sorted([3, 1, 2])                # new list; works on any iterable
[1, 2, 3]
>>> words = ["banana", "Apple", "cherry"]
>>> sorted(words)                    # uppercase sorts first
['Apple', 'banana', 'cherry']
>>> sorted(words, key=str.lower)
['Apple', 'banana', 'cherry']
>>> sorted(words, key=len)
['Apple', 'banana', 'cherry']
>>> pairs = [("b", 2), ("a", 2), ("c", 1)]
>>> sorted(pairs, key=lambda p: (p[1], p[0]))     # by number, then letter
[('c', 1), ('a', 2), ('b', 2)]
>>> sorted(pairs, key=lambda p: (-p[1], p[0]))    # number descending, letter ascending
[('a', 2), ('b', 2), ('c', 1)]
>>> nums.reverse()                   # in place
>>> nums
[1, 2, 3]
>>> list(reversed(nums))             # iterator over a reversed view
[3, 2, 1]
```

`sort` and `reverse` mutate and return `None`; `sorted` and `reversed` leave the original alone. Writing `nums = nums.sort()` sets `nums` to `None`, another classic mistake. Python's sort is **stable**: equal keys keep their original order, which is why sorting twice by different keys works.

### Aliasing versus copying

Assignment makes a second name for the same list. To get an independent list, copy it.

```pycon
>>> a = [1, 2, 3]
>>> b = a               # alias
>>> b.append(4)
>>> a
[1, 2, 3, 4]
>>> c = a.copy()        # or a[:] or list(a)
>>> c.append(5)
>>> a
[1, 2, 3, 4]
```

These are **shallow** copies: the new list holds the same element objects. If the elements are themselves mutable (a list of lists), changing an inner list is visible through both.

```pycon
>>> grid = [[0, 0], [0, 0]]
>>> copy1 = grid.copy()
>>> copy1[0][0] = 9
>>> grid
[[9, 0], [0, 0]]
>>> import copy
>>> copy2 = copy.deepcopy(grid)
>>> copy2[1][1] = 7
>>> grid
[[9, 0], [0, 0]]
```

The related trap is building a grid with `*`:

```pycon
>>> rows = [[0] * 3] * 2      # two references to ONE inner list
>>> rows[0][0] = 1
>>> rows
[[1, 0, 0], [1, 0, 0]]
>>> rows = [[0] * 3 for _ in range(2)]
>>> rows[0][0] = 1
>>> rows
[[1, 0, 0], [0, 0, 0]]
```

`[x] * n` repeats the *reference* n times. It is fine for immutable `x` (numbers, strings) and wrong for mutable `x`.

### List comprehensions

A comprehension builds a list from an iterable in one expression: `[expression for item in iterable if condition]`.

```pycon
>>> [n * n for n in range(6)]
[0, 1, 4, 9, 16, 25]
>>> [n for n in range(10) if n % 3 == 0]
[0, 3, 6, 9]
>>> [(x, y) for x in range(2) for y in range(2)]           # nested loops, left to right
[(0, 0), (0, 1), (1, 0), (1, 1)]
>>> [[r * c for c in range(3)] for r in range(3)]          # nested comprehension
[[0, 0, 0], [0, 1, 2], [0, 2, 4]]
>>> ["even" if n % 2 == 0 else "odd" for n in range(3)]   # conditional expression in the output
['even', 'odd', 'even']
>>> matrix = [[1, 2], [3, 4]]
>>> [x for row in matrix for x in row]                     # flatten
[1, 2, 3, 4]
```

Comprehensions are faster and clearer than the equivalent loop with `append`. Keep them to one or two clauses; beyond that, a loop is more readable.

### Unpacking

```pycon
>>> first, second = [1, 2]
>>> first, *rest = [1, 2, 3, 4]
>>> first, rest
(1, [2, 3, 4])
>>> *init, last = [1, 2, 3, 4]
>>> init, last
([1, 2, 3], 4)
>>> a, (b, c) = 1, (2, 3)
>>> b
2
>>> def f(x, y, z):
...     return x + y + z
...
>>> f(*[1, 2, 3])           # unpack a list into arguments
6
>>> [*[1, 2], *[3]]          # splat inside a literal
[1, 2, 3]
```

### Cost of operations

| Operation | Cost |
|---|---|
| index, `len`, `append`, `pop()` | O(1) |
| `pop(0)`, `insert(0, x)`, `remove`, `in`, `index`, `del x[i]` | O(n) |
| slice of length k | O(k) |
| `sort` | O(n log n) |
| `extend` by k items | O(k) |

Lists are dynamic arrays: appending is amortised constant because Python over-allocates. Anything at the front shifts every element. For a queue, use `collections.deque`.

## Tuples

A tuple is an immutable sequence. Same indexing and slicing as a list; no methods that change it.

```pycon
>>> point = (3, 4)
>>> point[0], len(point), point[::-1]
(3, 2, (4, 3))
>>> point[0] = 5
Traceback (most recent call last):
    ...
TypeError: 'tuple' object does not support item assignment
>>> single = (5,)          # the comma makes the tuple, not the parentheses
>>> not_a_tuple = (5)
>>> type(single), type(not_a_tuple)
(<class 'tuple'>, <class 'int'>)
>>> t = 1, 2, 3            # parentheses are optional
>>> t
(1, 2, 3)
>>> point.count(3), point.index(4)
(1, 1)
```

### When to use a tuple

- **Fixed structure**: a record with positional meaning, like `(x, y)` or `(name, age)`. Lists are for homogeneous collections of variable length.
- **Dictionary keys and set members** must be hashable; tuples are (if their contents are), lists are not.
- **Returning multiple values** from a function is really returning one tuple.
- **Safety**: nothing can accidentally modify it.

```pycon
>>> locations = {(0, 0): "origin", (1, 2): "point"}
>>> locations[(1, 2)]
'point'
>>> {[0, 0]: "origin"}
Traceback (most recent call last):
    ...
TypeError: unhashable type: 'list'
>>> def min_max(nums):
...     return min(nums), max(nums)
...
>>> low, high = min_max([3, 1, 4])
>>> low, high
(1, 4)
```

A tuple is immutable, but a mutable object inside it can still change:

```pycon
>>> t = (1, [2, 3])
>>> t[1].append(4)
>>> t
(1, [2, 3, 4])
```

### Named tuples

For readable records without writing a class:

```pycon
>>> from collections import namedtuple
>>> Point = namedtuple("Point", ["x", "y"])
>>> p = Point(3, 4)
>>> p.x, p[1], p
(3, 4, Point(x=3, y=4))
>>> p._replace(x=0)
Point(x=0, y=4)
```

`typing.NamedTuple` gives the same with type hints; `dataclasses` (classes chapter) are the modern alternative when you want mutability or methods.

## Classic problems

**Remove duplicates, keep order**

```pycon
>>> list(dict.fromkeys([3, 1, 3, 2, 1]))
[3, 1, 2]
```

**Second largest**

```pycon
>>> nums = [4, 9, 9, 2, 7]
>>> sorted(set(nums))[-2]
7
```

**Rotate by k**

```pycon
>>> nums, k = [1, 2, 3, 4, 5], 2
>>> nums[-k:] + nums[:-k]
[4, 5, 1, 2, 3]
```

**Chunk into groups of n**

```pycon
>>> data = list(range(7))
>>> [data[i:i + 3] for i in range(0, len(data), 3)]
[[0, 1, 2], [3, 4, 5], [6]]
```

**Transpose**

```pycon
>>> matrix = [[1, 2, 3], [4, 5, 6]]
>>> [list(col) for col in zip(*matrix)]
[[1, 4], [2, 5], [3, 6]]
```

**Find all indexes of a value**

```pycon
>>> [i for i, v in enumerate([1, 2, 1, 3]) if v == 1]
[0, 2]
```

## Interview questions

**What is the difference between a list and a tuple?**
Lists are mutable, tuples are immutable. Tuples are hashable (usable as dict keys and set members) when their contents are, slightly smaller and faster to create, and signal "fixed structure". Lists are for collections that change.

**What is the difference between `append` and `extend`?**
`append(x)` adds `x` as one element. `extend(xs)` adds each element of `xs`. `a.append([1, 2])` makes the last element a list; `a.extend([1, 2])` adds two integers.

**What is the difference between `sort()` and `sorted()`?**
`list.sort()` sorts in place and returns `None`. `sorted()` returns a new sorted list and accepts any iterable. Both take `key` and `reverse`.

**How do you copy a list?**
`a.copy()`, `a[:]`, or `list(a)` for a shallow copy; `copy.deepcopy(a)` when the elements are mutable and must be independent.

**What does `[[0] * 3] * 3` do wrong?**
It creates three references to the same inner list, so changing one row changes all. Use a comprehension: `[[0] * 3 for _ in range(3)]`.

**Why is `pop(0)` slow?**
Lists are arrays; removing the first element shifts every remaining element. Use `collections.deque` for queue behaviour.

**How is a one-element tuple written?**
`(5,)` with a trailing comma. `(5)` is just the integer 5.

**Is a tuple completely immutable?**
The tuple's slots cannot be reassigned, but a mutable object stored in a slot (such as a list) can still be modified through it.

**How do you remove duplicates while preserving order?**
`list(dict.fromkeys(items))`, because dicts preserve insertion order and keys are unique. `list(set(items))` removes duplicates but loses order.

**What is a list comprehension and when should you avoid it?**
A single-expression way to build a list from an iterable with optional filtering. Avoid it when the logic needs more than one or two clauses, side effects, or exception handling; use a loop.

**How does Python's `sort` work?**
Timsort, a stable hybrid of merge sort and insertion sort, O(n log n) worst case and O(n) on already-sorted data. Stability means equal elements keep their relative order.
