---
title: Iterators & Generators
part: Intermediate
summary: The iteration protocol behind every for loop, writing your own iterators, generators with yield, generator expressions, lazy pipelines, itertools, and why generators are the answer to "how do you process a file bigger than memory".
---

## The iteration protocol

A `for` loop does not use indexes. It asks the object for an **iterator** with `iter()`, then calls `next()` on it repeatedly until `StopIteration` is raised.

```pycon
>>> nums = [10, 20]
>>> it = iter(nums)
>>> next(it)
10
>>> next(it)
20
>>> next(it)
Traceback (most recent call last):
    ...
StopIteration
>>> next(it, "done")          # a default instead of the exception
'done'
```

Two terms, often confused:

- An **iterable** is anything you can get an iterator from: it has `__iter__` (or `__getitem__` with integer indexes). Lists, strings, dicts, sets, files, ranges.
- An **iterator** is the object that produces values: it has `__next__` and also `__iter__` returning itself. Iterators are consumed once; a list can be iterated many times because each `iter()` returns a fresh iterator.

```pycon
>>> it = iter([1, 2, 3])
>>> list(it)
[1, 2, 3]
>>> list(it)                   # exhausted
[]
```

Under the hood, `for x in obj: body` is:

```python
_it = iter(obj)
while True:
    try:
        x = next(_it)
    except StopIteration:
        break
    body
```

## Writing an iterator class

```pycon
>>> class Countdown:
...     def __init__(self, start):
...         self.current = start
...     def __iter__(self):
...         return self                       # an iterator returns itself
...     def __next__(self):
...         if self.current <= 0:
...             raise StopIteration
...         self.current -= 1
...         return self.current + 1
...
>>> list(Countdown(3))
[3, 2, 1]
>>> c = Countdown(2)
>>> next(c), next(c)
(2, 1)
```

This works but is verbose. Generators do the same in a fraction of the code.

## Generators

A function containing `yield` is a **generator function**. Calling it does not run the body; it returns a **generator object** (an iterator). Each `next()` runs until the next `yield`, hands out the value, and **pauses**, keeping all local state. When the function returns, `StopIteration` is raised.

```pycon
>>> def countdown(n):
...     print("starting")
...     while n > 0:
...         yield n
...         n -= 1
...     print("done")
...
>>> gen = countdown(3)
>>> gen
<generator object countdown at 0x...>
>>> next(gen)
starting
3
>>> next(gen)
2
>>> list(gen)                  # continues from where it paused
done
[1]
```

Note that "starting" was printed only when the first value was requested, not when `countdown(3)` was called. Generators are **lazy**.

### Why generators matter

1. **Memory.** They produce one value at a time instead of building a whole list. A generator over a 10 GB file uses constant memory.
2. **Infinite sequences** are natural.
3. **Pipelines.** Chain generators so that each item flows through every stage before the next item is read.
4. **Cleaner code** for anything stateful that hands out values.

```pycon
>>> def naturals():
...     n = 1
...     while True:
...         yield n
...         n += 1
...
>>> def take(k, iterable):
...     for i, x in enumerate(iterable):
...         if i >= k:
...             return
...         yield x
...
>>> list(take(5, naturals()))
[1, 2, 3, 4, 5]
```

### Reading a huge file

```python
def error_lines(path):
    with open(path, encoding="utf-8") as f:
        for line in f:                     # the file is itself a lazy iterator of lines
            if "ERROR" in line:
                yield line.rstrip()

def first_n(gen, n):
    return [x for _, x in zip(range(n), gen)]
```

The file is opened when iteration starts and closed when the generator finishes or is garbage collected. Nothing is loaded that is not needed.

## Generator expressions

Like a list comprehension but with parentheses: produces a generator instead of a list.

```pycon
>>> squares = (n * n for n in range(5))
>>> squares
<generator object <genexpr> at 0x...>
>>> sum(squares)
30
>>> sum(n * n for n in range(5))          # parentheses of the call are enough
30
>>> any(n > 3 for n in range(5)), max(len(w) for w in ["a", "bcd"])
(True, 3)
```

Rule of thumb: if you only iterate once and feed a function (`sum`, `max`, `any`, `join`, `set`), use a generator expression. If you need the values several times, indexing, or `len`, build a list.

## `yield from` and delegating

`yield from iterable` yields every item from another iterable (or generator) and is how recursive generators are written.

```pycon
>>> def flatten(nested):
...     for item in nested:
...         if isinstance(item, list):
...             yield from flatten(item)
...         else:
...             yield item
...
>>> list(flatten([1, [2, [3, 4]], 5]))
[1, 2, 3, 4, 5]
```

## Sending values in, and closing

Generators are also coroutines: `send(value)` resumes the generator and makes the paused `yield` expression evaluate to `value`. This is the basis of `asyncio`'s history, though today you rarely use it directly.

```pycon
>>> def running_average():
...     total = count = 0
...     average = None
...     while True:
...         value = yield average
...         total += value
...         count += 1
...         average = total / count
...
>>> avg = running_average()
>>> next(avg)                       # prime it: run to the first yield
>>> avg.send(10), avg.send(20), avg.send(60)
(10.0, 15.0, 30.0)
>>> avg.close()
```

`gen.close()` raises `GeneratorExit` inside the generator so `finally` blocks run. A `return value` inside a generator becomes `StopIteration.value` and is what `yield from` evaluates to.

## itertools: the lazy toolkit

```pycon
>>> from itertools import chain, islice, count, cycle, repeat, groupby, product, permutations, combinations, accumulate, zip_longest, takewhile, dropwhile
>>> list(chain([1, 2], (3,), "ab"))                 # concatenate iterables lazily
[1, 2, 3, 'a', 'b']
>>> list(islice(count(10, 5), 3))                   # slice an infinite iterator
[10, 15, 20]
>>> list(islice(cycle("ab"), 5))
['a', 'b', 'a', 'b', 'a']
>>> list(repeat("x", 2))
['x', 'x']
>>> list(accumulate([1, 2, 3], lambda a, b: a * b))
[1, 2, 6]
>>> list(zip_longest([1, 2, 3], "ab", fillvalue=None))
[(1, 'a'), (2, 'b'), (3, None)]
>>> list(takewhile(lambda x: x < 3, [1, 2, 3, 1]))
[1, 2]
>>> list(dropwhile(lambda x: x < 3, [1, 2, 3, 1]))
[3, 1]
>>> [(k, len(list(g))) for k, g in groupby(sorted("mississippi"))]
[('i', 4), ('m', 1), ('p', 2), ('s', 4)]
>>> list(product("ab", [1, 2]))
[('a', 1), ('a', 2), ('b', 1), ('b', 2)]
>>> list(combinations([1, 2, 3], 2)), len(list(permutations(range(4))))
([(1, 2), (1, 3), (2, 3)], 24)
```

Also `enumerate`, `zip`, `map`, `filter`, `reversed`, and `range` are lazy built-ins. `sorted` is not (it must see everything).

## Pipelines

Because each stage is lazy, a chain of generators processes one item through all stages at a time.

```pycon
>>> def read(lines):
...     for line in lines:
...         yield line.strip()
...
>>> def non_empty(lines):
...     return (l for l in lines if l)
...
>>> def numbers(lines):
...     for l in lines:
...         yield int(l)
...
>>> raw = ["1", "", " 2 ", "3", ""]
>>> sum(numbers(non_empty(read(raw))))
6
```

## Common mistakes

- **Treating a generator like a list**: no `len()`, no indexing, and it is exhausted after one pass. Convert with `list()` if you need those.
- **Checking `if gen:`**: a generator object is always truthy, even when exhausted.
- **Returning a generator from a `with` block** that closes the resource before iteration starts. Put the `with` inside the generator function.
- **Forgetting that `yield` pauses**: side effects before the first `yield` do not happen until the first `next()`.
- **Mixing `return value` and iteration** and expecting the value to appear in the loop; it is only visible via `yield from` or `StopIteration.value`.

## Interview questions

**What is the difference between an iterable and an iterator?**
An iterable can produce an iterator (`__iter__`); an iterator produces values with `__next__` and raises `StopIteration` when done. Lists are iterables; `iter(list)` gives an iterator. Iterators are single-use.

**What is a generator?**
A function that uses `yield` and returns a lazy iterator. Each `next()` resumes the function where it paused, preserving local variables, until the function returns.

**When would you use a generator instead of a list?**
When the data is large or infinite, when you only iterate once, or when you want to build a pipeline. Generators use constant memory and start producing immediately.

**What is the difference between `return` and `yield`?**
`return` ends the function and gives back one value. `yield` gives back a value and pauses; the function can resume and yield again. A function with any `yield` is a generator function.

**What is a generator expression and how does it differ from a list comprehension?**
Same syntax with parentheses; it produces values lazily instead of building a list. Use it when feeding a consumer like `sum` or `any`.

**What happens if you call `next()` on an exhausted generator?**
`StopIteration` is raised. `for` loops handle it silently; `next(it, default)` returns a default instead.

**How do you make a class iterable?**
Define `__iter__` returning an iterator (often a generator: `def __iter__(self): yield from self._items`). Alternatively define `__iter__` and `__next__` on the same class to make it its own iterator.

**What does `yield from` do?**
Delegates to a sub-iterator, yielding each of its values; it also passes `send`/`throw` through and returns the sub-generator's return value. It is the natural way to write recursive generators.

**How would you read a 50 GB file and count lines containing a word?**
Iterate the file object line by line (it is a lazy iterator), or wrap that in a generator, so memory stays constant. Never `read()` or `readlines()`.

**Can you iterate a generator twice?**
No. It is exhausted after the first pass. Recreate it by calling the generator function again, or store the values in a list if they are needed more than once.

**What is `itertools.islice` for?**
Taking a slice of any iterator lazily, including infinite ones, without converting to a list.

**Is `range` a generator?**
No. It is a lazy immutable sequence: it supports `len`, indexing, and repeated iteration, which generators do not. It computes values on demand like a generator would.
