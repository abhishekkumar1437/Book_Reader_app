---
title: What Does This Print?
part: Interview Prep
summary: Fifty short snippets that test whether you really know the rules: aliasing, defaults, closures, integer caching, comparisons, and slicing. Predict the output, then check.
---

## How to use this chapter

Read the code, say the output, then look. Each answer is real, verified output, followed by a one-line reason. The snippets are grouped by the chapter that explains the behaviour. If you get one wrong, that chapter is your next revision.

## Variables and types

**1.**

```pycon
>>> x = 5
>>> y = x
>>> x += 1
>>> print(x, y)
6 5
```

Integers are immutable; `x += 1` rebinds `x` to a new object.

**2.**

```pycon
>>> print(7 // 2, -7 // 2, 7 % -2)
3 -4 -1
```

Floor division rounds down; the remainder takes the sign of the divisor.

**3.**

```pycon
>>> print(0.1 + 0.2 == 0.3, round(2.5), round(3.5))
False 2 4
```

Binary floating point; banker's rounding.

**4.**

```pycon
>>> print(True + True, True == 1, True is 1)
2 True False
```

`bool` is an `int` subclass; `True` and `1` are equal but not the same object.

**5.**

```pycon
>>> print(bool("False"), bool(""), bool([0]), bool(0.0))
True False True False
```

Non-empty strings and lists are truthy regardless of content.

**6.**

```pycon
>>> print(1 < 2 < 3, 3 > 2 > 2, 1 == 1.0 == True)
True False True
```

Chained comparisons are `and`-ed pairs.

**7.**

```pycon
>>> print("a" < "b", "Z" < "a", "10" < "9")
True True True
```

Strings compare by code point, character by character.

**8.**

```pycon
>>> print(2 ** 3 ** 2, (2 ** 3) ** 2, -2 ** 2)
512 64 -4
```

`**` is right-associative and binds tighter than unary minus.

## Strings

**9.**

```pycon
>>> s = "hello"
>>> print(s[1:3], s[-2:], s[::-1], s[10:])
el lo olleh 
```

Slices never raise; an out-of-range slice is empty (there is a trailing space in the printed line).

**10.**

```pycon
>>> print("a,b,,c".split(","), "a  b".split(), "abc".split("b"))
['a', 'b', '', 'c'] ['a', 'b'] ['a', 'c']
```

Explicit separators keep empty fields; no-argument `split` collapses whitespace.

**11.**

```pycon
>>> print("-".join("abc"), "ab" * 2 + "c", "abc" > "abd")
a-b-c ababc False
```

A string is an iterable of characters.

**12.**

```pycon
>>> s = "immutable"
>>> t = s.upper()
>>> print(s, t, s is s.lower())
immutable IMMUTABLE False
```

`lower()` returns a new object even when the content is unchanged (implementation may return the same object for some cases, but not guaranteed; here it is a new one).

**13.**

```pycon
>>> print(f"{3.14159:.2f} {42:>5} {'x':*^5} {1000000:,}")
3.14    42 **x** 1,000,000
```

Format specs: precision, width and alignment, fill, thousands separator.

## Lists and aliasing

**14.**

```pycon
>>> a = [1, 2, 3]
>>> b = a
>>> b.append(4)
>>> print(a, a is b)
[1, 2, 3, 4] True
```

Assignment does not copy.

**15.**

```pycon
>>> a = [1, 2, 3]
>>> b = a[:]
>>> b.append(4)
>>> print(a, b)
[1, 2, 3] [1, 2, 3, 4]
```

Slicing copies.

**16.**

```pycon
>>> grid = [[0] * 2] * 2
>>> grid[0][0] = 1
>>> print(grid)
[[1, 0], [1, 0]]
```

Both rows are the same list.

**17.**

```pycon
>>> nums = [1, 2, 3]
>>> print(nums.append(4), nums)
None [1, 2, 3, 4]
```

In-place methods return `None`.

**18.**

```pycon
>>> nums = [3, 1, 2]
>>> print(sorted(nums), nums, nums.sort(), nums)
[1, 2, 3] [1, 2, 3] None [1, 2, 3]
```

All four arguments are evaluated before `print` runs. The second argument is a reference to the list itself, not a snapshot, so by the time it is printed `nums.sort()` has already sorted it in place. `sorted` returned a copy; `sort` returned `None`.

**19.**

```pycon
>>> a = [1, 2, 3]
>>> for x in a:
...     if x == 2:
...         a.remove(x)
...
>>> print(a)
[1, 3]
```

Works here by luck; removing while iterating skips the next element. With `[1, 2, 2, 3]` it would leave a `2`.

**20.**

```pycon
>>> a = [1, 2, 2, 3]
>>> for x in a:
...     if x == 2:
...         a.remove(x)
...
>>> print(a)
[1, 2, 3]
```

The skip in action: after removing the first 2, the iterator moves past the second one.

**21.**

```pycon
>>> t = (1, [2])
>>> t[1].append(3)
>>> print(t)
(1, [2, 3])
```

The tuple is immutable; the list inside it is not.

**22.**

```pycon
>>> t = (1,)
>>> u = (1)
>>> print(type(t).__name__, type(u).__name__, len("a,b".split(",")))
tuple int 2
```

The comma makes the tuple.

**23.**

```pycon
>>> first, *middle, last = [1, 2, 3, 4, 5]
>>> print(first, middle, last)
1 [2, 3, 4] 5
```

Starred unpacking collects the middle into a list.

**24.**

```pycon
>>> print([x for x in range(5) if x % 2], [x if x % 2 else -x for x in range(4)])
[1, 3] [0, 1, -2, 3]
```

Trailing `if` filters; leading conditional expression chooses the value.

## Dicts and sets

**25.**

```pycon
>>> d = {"a": 1, "b": 2}
>>> d["a"] = 3
>>> d["c"] = 4
>>> print(list(d), d.get("z"), d.get("z", 0))
['a', 'b', 'c'] None 0
```

Updating keeps position; new keys go at the end.

**26.**

```pycon
>>> print({1: "a", 1.0: "b", True: "c"}, {1, 1.0, True})
{1: 'c'} {1}
```

Equal keys collapse; the first key object is kept, the last value wins.

**27.**

```pycon
>>> print(len({}), type({}).__name__, len(set()), {} == dict())
0 dict 0 True
```

`{}` is a dict.

**28.**

```pycon
>>> a = {1, 2, 3}
>>> b = {3, 4}
>>> print(sorted(a | b), sorted(a & b), sorted(a - b), sorted(a ^ b))
[1, 2, 3, 4] [3] [1, 2] [1, 2, 4]
```

Union, intersection, difference, symmetric difference.

**29.**

```pycon
>>> from collections import Counter
>>> c = Counter("banana")
>>> print(c["a"], c["z"], c.most_common(1))
3 0 [('a', 3)]
```

Missing keys count as zero.

## Functions and scope

**30.**

```pycon
>>> def f(x, items=[]):
...     items.append(x)
...     return items
...
>>> print(f(1), f(2), f(3, []))
[1, 2] [1, 2] [3]
```

The default list is shared; the first two calls return the *same* list, which already holds both values by the time `print` runs.

**31.**

```pycon
>>> x = 10
>>> def f():
...     x = 20
...     return x
...
>>> print(f(), x)
20 10
```

Assignment inside a function creates a local.

**32.**

```pycon
>>> def outer():
...     n = 0
...     def inner():
...         nonlocal n
...         n += 1
...         return n
...     return inner
...
>>> f = outer()
>>> print(f(), f(), outer()())
1 2 1
```

Each call to `outer` creates a fresh `n`.

**33.**

```pycon
>>> funcs = [lambda: i for i in range(3)]
>>> print([f() for f in funcs])
[2, 2, 2]
```

Late binding of the loop variable.

**34.**

```pycon
>>> def f(*args, **kwargs):
...     return args, kwargs
...
>>> print(f(1, 2, a=3), f(*[1, 2], **{"a": 3}))
((1, 2), {'a': 3}) ((1, 2), {'a': 3})
```

Packing and unpacking are symmetric.

**35.**

```pycon
>>> def f():
...     try:
...         return "try"
...     finally:
...         print("finally")
...
>>> print(f())
finally
try
```

`finally` runs before the function returns.

**36.**

```pycon
>>> def f():
...     try:
...         return "try"
...     finally:
...         return "finally"
...
>>> print(f())
finally
```

A `return` in `finally` overrides the earlier one. Do not do this.

## Classes

**37.**

```pycon
>>> class A:
...     count = 0
...     def __init__(self):
...         A.count += 1
...         self.count = 99
...
>>> a, b = A(), A()
>>> print(A.count, a.count, b.count)
2 99 99
```

The instance attribute shadows the class attribute on lookup through an instance.

**38.**

```pycon
>>> class A:
...     def who(self): return "A"
...
>>> class B(A):
...     def who(self): return "B" + super().who()
...
>>> class C(A):
...     def who(self): return "C" + super().who()
...
>>> class D(B, C):
...     pass
...
>>> print(D().who(), [k.__name__ for k in D.__mro__])
BCA ['D', 'B', 'C', 'A', 'object']
```

`super()` follows the MRO, so `B` hands off to `C`, not `A`.

**39.**

```pycon
>>> class P:
...     def __init__(self, x): self.x = x
...     def __eq__(self, other): return self.x == other.x
...
>>> p, q = P(1), P(1)
>>> print(p == q, p is q, p != q)
True False False
```

`__ne__` is derived from `__eq__` automatically.

**40.**

```pycon
>>> class P:
...     def __init__(self, x): self.x = x
...     def __eq__(self, other): return self.x == other.x
...
>>> try:
...     {P(1)}
... except TypeError as e:
...     print(type(e).__name__)
...
TypeError
```

Defining `__eq__` without `__hash__` makes instances unhashable.

## Generators and iteration

**41.**

```pycon
>>> def gen():
...     print("start")
...     yield 1
...     yield 2
...
>>> g = gen()
>>> print("created")
created
>>> print(next(g), next(g))
start
1 2
```

The body does not run until the first `next()`.

**42.**

```pycon
>>> g = (x * x for x in range(3))
>>> print(sum(g), sum(g), list(g))
5 0 []
```

A generator is exhausted after one pass.

**43.**

```pycon
>>> it = iter([1, 2, 3])
>>> print(next(it), list(it), next(it, "end"))
1 [2, 3] end
```

`list` consumes the rest; `next` with a default avoids `StopIteration`.

**44.**

```pycon
>>> print(list(zip("ab", [1, 2, 3])), list(enumerate("xy", 1)))
[('a', 1), ('b', 2)] [(1, 'x'), (2, 'y')]
```

`zip` stops at the shortest; `enumerate` takes a start.

**45.**

```pycon
>>> for i in range(3):
...     pass
...
>>> print(i)
2
```

The loop variable survives the loop; comprehension variables do not leak.

## Odds and ends

**46.**

```pycon
>>> print(type(lambda: 0).__name__, (lambda *a: a)(1, 2), callable(len))
function (1, 2) True
```

Lambdas are ordinary function objects.

**47.**

```pycon
>>> a = 256; b = 256
>>> c = 257; d = 257
>>> print(a is b, c == d)
True True
```

Small integers are cached; `c is d` may or may not be `True`, which is exactly why you never write it.

**48.**

```pycon
>>> print(not None, None or "x", "" or [], 0 and "never", [] or {} or "z")
True x [] 0 z
```

`and`/`or` return an operand, not a boolean; `not` returns a boolean.

**49.**

```pycon
>>> import copy
>>> a = [[1], [2]]
>>> b = copy.copy(a)
>>> c = copy.deepcopy(a)
>>> a[0].append(9)
>>> print(b, c)
[[1, 9], [2]] [[1], [2]]
```

Shallow copies share the inner lists.

**50.**

```pycon
>>> x = [1, 2, 3]
>>> y = x
>>> x = x + [4]
>>> print(x, y)
[1, 2, 3, 4] [1, 2, 3]
```

`x + [4]` builds a new list and rebinds `x`; compare with `x += [4]`, which would have mutated the shared list and changed `y` too.

## Scoring

- 45 or more: the rules are yours; move on to the DSA book.
- 35 to 44: re-read the chapters for the groups you missed.
- Under 35: work through Foundations again with the REPL open, typing every example.
