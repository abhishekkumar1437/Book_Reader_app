---
title: Control Flow
part: Foundations
summary: if, elif and else, while and for loops, range, enumerate and zip, break, continue and the loop else clause, pass, and the match statement.
---

## Conditionals

```python
temperature = 23
if temperature > 30:
    label = "hot"
elif temperature > 20:
    label = "warm"
else:
    label = "cold"
```

`elif` chains are evaluated top to bottom; the first true branch runs and the rest are skipped. There is no `switch`; use `elif`, a dictionary of actions, or (3.10+) `match`.

The conditional expression (ternary) puts a choice on one line:

```pycon
>>> n = 4
>>> "even" if n % 2 == 0 else "odd"
'even'
```

Conditions use truthiness, so the idiomatic forms are:

```python
if items:              # not: if len(items) > 0
if not name:           # not: if name == ""
if value is None:      # not: if value == None
if 0 <= x < 10:        # chained comparison
```

## `while` loops

Repeat while a condition holds. Make sure something in the body changes the condition, or you have an infinite loop (which is sometimes intended, with a `break` inside).

```pycon
>>> n, steps = 27, 0
>>> while n != 1:
...     n = n // 2 if n % 2 == 0 else 3 * n + 1
...     steps += 1
...
>>> steps
111
```

```python
while True:
    line = input("> ")
    if line == "quit":
        break
    print(line.upper())
```

## `for` loops

`for` iterates over any **iterable**: lists, strings, tuples, dicts, sets, files, generators, ranges. It does not use an index unless you ask for one.

```pycon
>>> for fruit in ["apple", "banana"]:
...     print(fruit)
...
apple
banana
```

### `range`

```pycon
>>> list(range(5)), list(range(2, 6)), list(range(10, 0, -3))
([0, 1, 2, 3, 4], [2, 3, 4, 5], [10, 7, 4, 1])
```

`range` is lazy: it does not build a list, so `range(10**9)` costs nothing until iterated.

### `enumerate` and `zip`

When you need the index, use `enumerate`, not `range(len(...))`:

```pycon
>>> for i, ch in enumerate("ab", start=1):
...     print(i, ch)
...
1 a
2 b
```

To walk two sequences together, use `zip`. It stops at the shortest; `strict=True` (3.10+) raises if lengths differ.

```pycon
>>> names = ["a", "b", "c"]
>>> scores = [90, 85]
>>> list(zip(names, scores))
[('a', 90), ('b', 85)]
>>> dict(zip(names, scores))
{'a': 90, 'b': 85}
```

### Iterating dictionaries

```pycon
>>> d = {"x": 1, "y": 2}
>>> for k in d:            # keys
...     print(k, end=" ")
...
x y 
>>> for k, v in d.items():
...     print(k, v, end="; ")
...
x 1; y 2; 
```

Do not add or remove keys while iterating a dict; that raises `RuntimeError`. Iterate over `list(d)` if you must modify.

## `break`, `continue`, and the loop `else`

- `break` leaves the innermost loop immediately.
- `continue` skips to the next iteration.
- `else` on a loop runs when the loop finished **without** hitting `break`. It is the "search failed" branch.

```pycon
>>> def find_first_negative(nums):
...     for n in nums:
...         if n < 0:
...             print("found", n)
...             break
...     else:
...         print("none found")
...
>>> find_first_negative([1, -2, 3])
found -2
>>> find_first_negative([1, 2, 3])
none found
```

The loop `else` confuses most people the first time; think of it as "no break".

## `pass`

A statement that does nothing, used where syntax requires a block but there is nothing to do yet.

```python
def todo():
    pass

class Placeholder:
    pass
```

## Nested loops and early exit

Python has no labelled break. To leave nested loops, either return from a function, set a flag, or restructure with `itertools.product`:

```pycon
>>> from itertools import product
>>> for i, j in product(range(3), range(3)):
...     if i * j == 2:
...         break
...
>>> i, j
(1, 2)
```

## The `match` statement (3.10+)

Structural pattern matching: compare a value against patterns that can destructure it, with guards.

```python
def describe(command):
    match command.split():
        case ["go", direction]:
            return f"going {direction}"
        case ["pick", "up", *items]:
            return f"picking up {len(items)} items"
        case ["quit" | "exit"]:
            return "bye"
        case [single] if single.isdigit():
            return f"number {single}"
        case _:
            return "unknown"
```

```pycon
>>> describe("go north"), describe("pick up sword shield"), describe("exit"), describe("42"), describe("dance")
('going north', 'picking up 2 items', 'bye', 'number 42', 'unknown')
```

It also matches dictionaries (`case {"type": "click", "x": x}`) and class instances (`case Point(x=0, y=y)`). A bare name in a pattern **binds** (captures), which is why `case _:` is the catch-all, and a dotted name (`case Color.RED:`) matches a value.

## Common patterns

**Loop with an accumulator**

```pycon
>>> total = 0
>>> for n in [1, 2, 3, 4]:
...     total += n
...
>>> total
10
>>> sum([1, 2, 3, 4])           # the built-in is better
10
```

**Finding a maximum with a key**

```pycon
>>> words = ["pear", "banana", "fig"]
>>> longest = words[0]
>>> for w in words:
...     if len(w) > len(longest):
...         longest = w
...
>>> longest
'banana'
>>> max(words, key=len)         # again, the built-in
'banana'
```

**Filtering while iterating: build a new list**

```pycon
>>> nums = [1, 2, 3, 4, 5, 6]
>>> [n for n in nums if n % 2 == 0]
[2, 4, 6]
```

Removing from a list *while* iterating over it skips elements; build a new list instead.

**Counting**

```pycon
>>> from collections import Counter
>>> Counter(w[0] for w in ["apple", "avocado", "banana"])
Counter({'a': 2, 'b': 1})
```

## FizzBuzz, because it is still asked

```python
def fizzbuzz(n: int) -> list[str]:
    out = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            out.append("FizzBuzz")
        elif i % 3 == 0:
            out.append("Fizz")
        elif i % 5 == 0:
            out.append("Buzz")
        else:
            out.append(str(i))
    return out
```

```pycon
>>> fizzbuzz(15)[-6:]
['Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz']
```

Check divisibility by 15 first; checking 3 first would never reach the combined case.

## Interview questions

**What is the difference between `for` and `while`?**
`for` iterates over the items of an iterable and ends when they run out; `while` repeats while a condition is true. Use `for` when you have a collection or a count, `while` when you are waiting for a state.

**What does the `else` clause on a loop do?**
It runs after the loop completes normally, without `break`. Useful for "searched everything and did not find it".

**What is the difference between `break` and `continue`?**
`break` exits the loop; `continue` skips the rest of the current iteration and proceeds to the next.

**How do you loop with an index?**
`for i, item in enumerate(items)`. Avoid `for i in range(len(items))` unless you only need the index.

**How do you iterate over two lists at once?**
`zip(a, b)`, which stops at the shorter; pass `strict=True` to require equal lengths, or `itertools.zip_longest` to pad.

**Does Python have a switch statement?**
Not in the C sense. Use `if`/`elif`, a dictionary mapping keys to functions, or the `match` statement (3.10+), which is more powerful because it destructures.

**What does `range(len(x))` return, and is it a list?**
A `range` object, a lazy sequence of integers. `list(range(...))` materialises it.

**Why is modifying a list while iterating over it a problem?**
Removing elements shifts the remaining ones, so the iterator skips the element after each removal. Build a new list or iterate over a copy.

**What is `pass`?**
A no-op statement for blocks that must exist syntactically but do nothing yet.

**What does `case _:` mean in `match`?**
The wildcard pattern that matches anything; it plays the role of `default`.

**How do you break out of nested loops?**
Return from an enclosing function, use a flag checked by the outer loop, or flatten the loops with `itertools.product`. Python has no labelled break.
