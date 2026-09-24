---
title: Variables, Types & Operators
part: Foundations
summary: What a variable really is in Python, the core types, numbers and the division gotchas, truthiness, comparisons, is versus ==, and the first look at mutability.
---

## Variables are names bound to objects

In Python, every value is an **object** living somewhere in memory, and a variable is just a **name** that points at one. Assignment does not copy the value; it makes the name refer to the object.

```pycon
>>> x = 10
>>> y = x        # y now refers to the same object as x
>>> x = 20       # x is re-bound to a new object; y is unaffected
>>> y
10
```

This is why beginners hear "everything in Python is an object" and "variables are references". The consequences become visible with mutable objects in the lists chapter. For now: a name is a label, not a box.

Names can be rebound to values of a different type at any time; that is what **dynamic typing** means. The *object* always has a type; the *name* does not.

```pycon
>>> x = 10
>>> type(x)
<class 'int'>
>>> x = "ten"
>>> type(x)
<class 'str'>
```

Multiple assignment and swapping are built in:

```pycon
>>> a, b = 1, 2
>>> a, b = b, a
>>> a, b
(2, 1)
```

## The core types

| Type | Example | Notes |
|---|---|---|
| `int` | `42`, `-7`, `10**100` | Arbitrary precision: never overflows |
| `float` | `3.14`, `1e-9`, `2.0` | 64-bit IEEE double; has rounding error |
| `bool` | `True`, `False` | A subclass of `int`: `True == 1` |
| `str` | `"hi"`, `'hi'`, `"""multi-line"""` | Immutable text (Unicode) |
| `NoneType` | `None` | The single "no value" object |
| `list` | `[1, 2, 3]` | Mutable ordered sequence |
| `tuple` | `(1, 2, 3)` | Immutable ordered sequence |
| `dict` | `{"a": 1}` | Mutable key → value mapping |
| `set` | `{1, 2, 3}` | Mutable collection of unique items |
| `bytes` | `b"abc"` | Immutable byte sequence |

Check a type with `type(x)` or, better, `isinstance(x, int)`, which also accepts subclasses.

```pycon
>>> isinstance(True, int)
True
>>> type(True) is int
False
```

## Numbers

```pycon
>>> 7 / 2         # true division always gives a float
3.5
>>> 7 // 2        # floor division
3
>>> -7 // 2       # floors toward negative infinity, not toward zero
-4
>>> 7 % 2         # remainder; takes the sign of the divisor
1
>>> -7 % 2
1
>>> 2 ** 10       # power
1024
>>> divmod(17, 5)
(3, 2)
>>> abs(-3), round(2.675, 2), round(2.5), round(3.5)
(3, 2.67, 2, 4)
```

Two of those lines are interview classics. `-7 // 2` is `-4` because floor division rounds down, and `round` uses banker's rounding (ties go to the even neighbour), so `round(2.5)` is `2`. Also `round(2.675, 2)` gives `2.67` because `2.675` cannot be represented exactly in binary.

Integers have no maximum:

```pycon
>>> 2 ** 200
1606938044258990275541962092341162602522202993782792835301376
```

Floats have limited precision. Never compare floats with `==` after arithmetic:

```pycon
>>> 0.1 + 0.2
0.30000000000000004
>>> 0.1 + 0.2 == 0.3
False
>>> import math
>>> math.isclose(0.1 + 0.2, 0.3)
True
```

For money, use `decimal.Decimal`; for exact ratios, `fractions.Fraction`.

Conversions:

```pycon
>>> int("42"), float("2.5"), str(3), int(3.99), int(-3.99)
(42, 2.5, '3', 3, -3)
>>> int("0x1f", 16), int("101", 2), hex(255), bin(5)
(31, 5, '0xff', '0b101')
>>> int("4.2")
Traceback (most recent call last):
    ...
ValueError: invalid literal for int() with base 10: '4.2'
```

`int()` truncates toward zero; it does not floor.

## Strings, briefly

Strings get their own chapter. The essentials: single or double quotes are the same; triple quotes span lines; `+` concatenates; `*` repeats; `len` measures; f-strings format.

```pycon
>>> "ab" + "cd", "ab" * 3, len("hello")
('abcd', 'ababab', 5)
>>> n = 3
>>> f"{n} items cost {n * 2.5:.2f}"
'3 items cost 7.50'
```

## Booleans and truthiness

Every object is either truthy or falsy. Falsy values: `False`, `None`, zero of any numeric type (`0`, `0.0`), and **empty** containers (`""`, `[]`, `{}`, `set()`, `()`). Everything else is truthy, including the strings `"0"` and `"False"`.

```pycon
>>> bool(0), bool(""), bool([]), bool(None)
(False, False, False, False)
>>> bool("0"), bool([0]), bool(-1), bool(" ")
(True, True, True, True)
```

This is why idiomatic Python writes `if items:` instead of `if len(items) > 0:`.

`and` and `or` do not return `True`/`False`; they return one of their operands (short-circuit evaluation):

```pycon
>>> 0 or "default"
'default'
>>> "first" and "second"
'second'
>>> None or 0 or [] or "x"
'x'
>>> not 3
False
```

`x or default` is a common idiom for defaults, with the trap that a legitimate falsy value (`0`, `""`) also triggers the default.

## Comparisons

```pycon
>>> 1 < 2 < 3           # chained comparison
True
>>> 1 == 1.0
True
>>> "apple" < "banana"  # strings compare lexicographically by code point
True
>>> "Zebra" < "apple"   # uppercase sorts before lowercase
True
>>> [1, 2] < [1, 3]     # sequences compare element by element
True
>>> 1 < "2"
Traceback (most recent call last):
    ...
TypeError: '<' not supported between instances of 'int' and 'str'
```

Python 3 refuses to order unrelated types; Python 2 allowed it. Equality between unrelated types is simply `False`.

## `is` versus `==`

`==` asks "do these have the same value?" (it calls `__eq__`). `is` asks "are these the very same object?" (same identity, same `id()`).

```pycon
>>> a = [1, 2, 3]
>>> b = [1, 2, 3]
>>> a == b
True
>>> a is b
False
>>> c = a
>>> c is a
True
```

Use `is` only for singletons: `x is None`, `x is True`, `x is not None`. Never use `is` to compare numbers or strings; it sometimes works because CPython caches small integers (−5 to 256) and short strings, which is an implementation detail, not a promise:

```pycon
>>> x = 256; y = 256
>>> x is y
True
>>> x = 1000; y = 1000
>>> x == y
True
```

(Whether `1000 is 1000` is `True` depends on how the code was compiled; that is exactly why you must not rely on it.)

## Operators worth knowing

```pycon
>>> 5 & 3, 5 | 3, 5 ^ 3, ~5, 1 << 4, 32 >> 2     # bitwise
(1, 7, 6, -6, 16, 8)
>>> x = 5
>>> x += 2; x *= 3; x //= 4          # augmented assignment
>>> x
5
>>> 3 in [1, 2, 3], "ell" in "hello", "k" not in {"a": 1}
(True, True, True)
>>> (y := 10) + 1                    # walrus: assign inside an expression
11
>>> y
10
```

Precedence, high to low: `**`, unary `-`, `* / // %`, `+ -`, comparisons (including `in`, `is`), `not`, `and`, `or`. When in doubt, add parentheses.

## `None`

`None` is the absence of a value: what functions return when they do not `return` anything, the default for "not set yet", and the conventional "no result".

```pycon
>>> def f():
...     pass
...
>>> print(f())
None
>>> result = None
>>> result is None
True
```

## Immutability, first look

Some types cannot be changed after creation: `int`, `float`, `str`, `tuple`, `bool`, `frozenset`, `bytes`. Operations on them always produce a new object.

```pycon
>>> s = "hello"
>>> s.upper()
'HELLO'
>>> s               # unchanged; upper() returned a new string
'hello'
>>> s = s.upper()   # rebind the name to the new object
>>> s
'HELLO'
```

Mutable types (`list`, `dict`, `set`, and most user-defined classes) can be changed in place, and every name referring to them sees the change. That distinction runs through the whole language and is the subject of several later chapters.

## Interview questions

**What does it mean that Python is dynamically typed?**
Types belong to objects, not to variables. A name can be rebound to an object of any type. Type checking happens at run time (and optionally ahead of time with type hints and a checker such as mypy).

**What is the difference between `/` and `//`?**
`/` is true division and always returns a float. `//` is floor division: it rounds toward negative infinity, so `-7 // 2` is `-4`.

**What is the difference between `is` and `==`?**
`==` compares values by calling `__eq__`; `is` compares identity (whether both names refer to the same object). Use `is` for `None`, `True`, `False`; use `==` for everything else.

**Why is `0.1 + 0.2 == 0.3` False?**
Floats are binary fractions with finite precision; `0.1` and `0.2` are not exactly representable, and the rounding errors add up. Compare with a tolerance (`math.isclose`) or use `Decimal` for exact decimal arithmetic.

**What values are falsy in Python?**
`False`, `None`, numeric zero, and empty containers and strings. Everything else is truthy.

**What does `x = y = []` do, and is it a problem?**
Both names refer to one list. Appending through `x` is visible through `y`. If two separate lists were wanted, this is a bug.

**Does Python have integer overflow?**
No. `int` has arbitrary precision, growing as needed. Floats can overflow to `inf`.

**What is `None`, and how do you check for it?**
The single object representing "no value". Check with `x is None`, never `x == None`.

**What is the output of `round(2.5)` and why?**
`2`. Python rounds ties to the nearest even number (banker's rounding) to avoid systematic bias.

**Is `bool` a separate type from `int`?**
`bool` is a subclass of `int` with exactly two instances. `True + True` is `2`, and `isinstance(True, int)` is `True`.

**What does the walrus operator do?**
`:=` assigns and returns the value inside an expression, useful in `while (line := f.readline()):` or to avoid computing a value twice in a comprehension. Added in Python 3.8.
