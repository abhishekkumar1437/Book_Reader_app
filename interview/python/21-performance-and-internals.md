---
title: Performance & Internals
part: Advanced
summary: How CPython runs code, measuring before optimising, the cost of built-in operations, the optimisations that actually help, caching, __slots__, and the questions about "how Python works" that senior interviews include.
---

## How CPython executes your code

1. **Parse**: source text becomes an abstract syntax tree (`ast` module can show it).
2. **Compile**: the tree becomes **bytecode**, a compact instruction set for a stack-based virtual machine. Modules are cached as `.pyc` files in `__pycache__` so the next import skips compilation.
3. **Interpret**: the eval loop executes bytecode instructions one at a time, holding the GIL. Since 3.11 a specialising adaptive interpreter rewrites hot instructions into faster specialised forms, which is why 3.11+ is noticeably faster.

```pycon
>>> import dis
>>> def add_one(x):
...     return x + 1
...
>>> [ins.opname for ins in dis.get_instructions(add_one)]
['RESUME', 'LOAD_FAST', 'LOAD_CONST', 'BINARY_OP', 'RETURN_VALUE']
```

(`dis.dis(add_one)` prints the same instructions with line numbers and arguments; the exact opcodes vary slightly between Python versions.)

Seeing the bytecode explains several things: why local variable access (`LOAD_FAST`, an array index) is faster than global (`LOAD_GLOBAL`, a dict lookup), why `x += 1` is several instructions and therefore not atomic, and why attribute access costs a lookup each time.

Other implementations exist: **PyPy** (a JIT; often several times faster for pure-Python loops), **Cython** (compile annotated Python to C), **MicroPython** (microcontrollers). "Python is slow" means "CPython's interpreter has overhead per operation"; code that spends its time in C (NumPy, sorting, hashing, I/O) is not slow.

## Measure first

Guessing is wrong more often than not. Three tools, in increasing depth:

```pycon
>>> import timeit
>>> timeit.timeit("''.join(str(i) for i in range(100))", number=2000) > 0
True
>>> timeit.timeit("[i * i for i in range(1000)]", number=1000) < timeit.timeit("list(map(lambda i: i * i, range(1000)))", number=1000)
True
```

- `timeit` for micro-benchmarks of a snippet (repeats it and reports total time; compare alternatives, not absolute numbers).
- `time.perf_counter()` around a section of real code.
- `cProfile` for a whole program: `python -m cProfile -s cumulative script.py` shows which functions consume the time; `snakeviz` or `py-spy` visualise it. `tracemalloc` for memory.

Optimise the top of the profile. If the top is not your code, change the algorithm or the data structure, not the syntax.

## Costs of built-in operations

| Operation | Cost | Faster alternative |
|---|---|---|
| `x in list` | O(n) | `x in set` O(1) |
| `list.insert(0, x)`, `list.pop(0)` | O(n) | `collections.deque` O(1) |
| `s += piece` in a loop | O(n²) total | collect and `"".join` |
| `sum(lists, [])` | O(n²) | `itertools.chain.from_iterable` |
| `sorted()` inside a loop to get max | O(n log n) per iteration | `heapq` or track the max |
| `dict[key]` / `set` lookup | O(1) average | |
| `list[i]`, `append`, `pop()` | O(1) | |
| `len()` on any built-in container | O(1) | |
| slicing `a[i:j]` | O(j − i) | use indices, or `itertools.islice` |
| `for i in range(len(a))` with indexing | slower constant | iterate directly |
| global lookup in a hot loop | dict lookup per access | bind to a local first |
| function call | ~50–100 ns | inline only if profiling says so |

The DSA book's complexity table covers the algorithmic side; this table is about constant factors and the shape of Python's data structures.

## Optimisations that actually help

**1. Better algorithm or data structure.** Almost always the biggest win: a set instead of a list for membership, a dict instead of a linear search, a heap instead of repeated sorting, memoisation instead of recomputation.

**2. Do the work in C.** Built-ins (`sum`, `min`, `sorted`, `str.join`, `map` with a built-in function) and libraries (NumPy, pandas) run tight loops in C. Vectorised NumPy over arrays is often 10 to 100 times faster than a Python loop over lists.

**3. Cache.** `functools.lru_cache` for pure functions; a dict for anything else that repeats.

```pycon
>>> from functools import lru_cache
>>> @lru_cache(maxsize=None)
... def ways(n):
...     return 1 if n <= 1 else ways(n - 1) + ways(n - 2)
...
>>> ways(200)
453973694165307953197296969697410619233826
```

**4. Avoid repeated work in loops.** Hoist invariant expressions and attribute lookups out of the loop; bind frequently used globals and methods to locals.

```python
def slow(items):
    out = []
    for x in items:
        out.append(math.sqrt(x))          # global lookup + attribute lookup each time
    return out

def faster(items):
    sqrt = math.sqrt                       # one lookup
    return [sqrt(x) for x in items]        # comprehension avoids the method call per append
```

**5. Generators and streaming** to cut memory, which also cuts time spent allocating and collecting.

**6. Use `__slots__`** for classes with many instances; `array.array` or NumPy for large homogeneous numeric data; tuples over lists for fixed records.

**7. Parallelise** only after the above: processes for CPU, threads or async for I/O (concurrency chapters).

**8. Compile the hot spot** with Cython, mypyc, or write it in Rust/C via a binding, as the last resort.

Things that do **not** help much and hurt readability: replacing every `for` with `map`, avoiding function calls by inlining, micro-tweaks below the profiler's noise. Do not do them without a measurement.

## Strings and numbers, internals worth knowing

- Small integers (−5 to 256) are pre-allocated singletons; other ints are objects created per operation. Integer arithmetic is arbitrary precision and slower than in C; for heavy numeric work use NumPy's fixed-width types.
- Strings are immutable, so CPython can cache their hash (fast dict lookups) and intern identifiers.
- `str` uses a flexible internal representation (1, 2, or 4 bytes per character depending on the widest character), so ASCII text is compact.
- Lists over-allocate when growing, which makes `append` amortised O(1); `sys.getsizeof` shows spare capacity.
- Dicts (since 3.6) store entries in insertion order in a dense array plus a sparse hash index, saving memory and giving ordering for free.

## Memory and object overhead

```pycon
>>> import sys
>>> sys.getsizeof(1), sys.getsizeof("a"), sys.getsizeof(()), sys.getsizeof([])
(28, 42, 40, 56)
>>> class P:
...     def __init__(self): self.x = 1; self.y = 2
...
>>> class S:
...     __slots__ = ("x", "y")
...     def __init__(self): self.x = 1; self.y = 2
...
>>> sys.getsizeof(S()) < sys.getsizeof(P()) + sys.getsizeof(P().__dict__)
True
```

Every object carries a header (type pointer, reference count), which is why a million small objects cost far more than a million C integers. When memory matters, batch data into arrays or use slotted classes.

## Interpreter startup and imports

Importing a large library costs time (tens to hundreds of milliseconds). For command-line tools, import lazily inside the function that needs the library. `python -X importtime script.py` shows where import time goes.

## Common performance mistakes

- Optimising before profiling.
- Using a list where a set or dict is needed.
- Building strings with `+=` in loops.
- Reading whole files into memory when streaming would do.
- Repeated `sorted()`, `min()`, or `len()` of a growing structure inside a loop.
- Deep recursion where iteration is simpler and faster.
- Threads for CPU-bound work.
- Ignoring that NumPy exists for numeric arrays.

## Interview questions

**Is Python compiled or interpreted, and what is bytecode?**
CPython compiles source to bytecode (cached in `.pyc`) and interprets it on a virtual machine. Bytecode is the intermediate instruction set; `dis` shows it.

**Why is Python slower than C or Java?**
Dynamic typing means every operation checks types at run time, values are heap-allocated objects with headers, and the interpreter executes bytecode instead of native machine code. The trade is developer speed and flexibility; hot spots move to C libraries.

**How do you find the slow part of a Python program?**
Profile with `cProfile` (or `py-spy` for a running process), look at cumulative time per function, and optimise the top entries. Use `timeit` to compare candidate rewrites.

**What is the difference between `timeit` and `cProfile`?**
`timeit` measures a small snippet accurately by repeating it; `cProfile` instruments a whole program and reports time per function, with overhead.

**How would you speed up a slow loop?**
Check the algorithm first, replace lists with sets/dicts for lookups, use built-ins and comprehensions, hoist invariants, cache results, move to NumPy for numeric work, and only then consider multiprocessing or native code.

**What is `lru_cache` and when is it inappropriate?**
Memoisation for pure functions with hashable arguments. Inappropriate for functions with side effects, unbounded argument spaces without `maxsize`, or arguments that are large/unhashable.

**What are `.pyc` files?**
Cached bytecode for modules, stored in `__pycache__`, regenerated when the source changes. They speed up imports, not execution.

**What is PyPy?**
An alternative Python implementation with a just-in-time compiler; often much faster for pure-Python code, with a different C-extension story.

**Why is attribute access slower than local variable access?**
Locals are array slots (`LOAD_FAST`); attributes are dictionary lookups through the instance and class (`LOAD_ATTR`), possibly with descriptor logic. Binding a method to a local before a hot loop avoids the repeated lookup.

**What does `__slots__` change about performance?**
Attributes are stored in fixed slots instead of a per-instance dict: less memory and slightly faster access, at the cost of no dynamic attributes.

**Why is `"".join(parts)` faster than repeated `+`?**
Strings are immutable; each `+` copies the accumulated string, giving O(n²). `join` computes the final size once and copies each piece once.

**What is the specialising adaptive interpreter?**
The 3.11+ mechanism that observes types at hot bytecode sites and swaps in specialised instructions (for example integer addition without generic dispatch), giving large speed-ups without changing semantics.
