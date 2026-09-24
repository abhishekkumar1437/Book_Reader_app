---
title: Memory, Mutability & Copying
part: Advanced
summary: The object model under the hood. References and id, mutable versus immutable in depth, shallow and deep copies, reference counting and garbage collection, interning, and the bugs that come from getting this wrong.
---

## Names, objects, references

Every value is an object with an identity (`id()`), a type, and a value. A variable is a name bound to an object; assignment binds, it never copies.

```pycon
>>> a = [1, 2, 3]
>>> b = a
>>> id(a) == id(b), a is b
(True, True)
>>> b.append(4)
>>> a
[1, 2, 3, 4]
```

Two names, one object. This is not a bug; it is the model. Containers hold references too: a list of lists holds references to the inner lists, a dict holds references to its keys and values, function arguments are references to the caller's objects.

```pycon
>>> inner = [0]
>>> outer = [inner, inner]
>>> inner.append(1)
>>> outer
[[0, 1], [0, 1]]
```

## Mutable versus immutable

| Immutable | Mutable |
|---|---|
| `int`, `float`, `bool`, `complex` | `list`, `dict`, `set` |
| `str`, `bytes`, `tuple`, `frozenset`, `range` | `bytearray`, `collections.deque` |
| `None`, `NamedTuple`, frozen dataclasses | most user-defined classes |

Operations on immutable objects create new objects. `x += 1` on an int rebinds `x` to a new int; `lst += [1]` on a list mutates the list in place. Same operator, different meaning, and the difference is visible when two names share the object:

```pycon
>>> x = y = 10
>>> x += 1
>>> x, y
(11, 10)
>>> p = q = [10]
>>> p += [11]                    # calls list.__iadd__: in place
>>> p, q
([10, 11], [10, 11])
>>> p = p + [12]                 # creates a new list; q is unchanged
>>> p, q
([10, 11, 12], [10, 11])
```

The `+=` on a list inside a tuple is the famous puzzle:

```pycon
>>> t = (1, [2])
>>> t[1] += [3]
Traceback (most recent call last):
    ...
TypeError: 'tuple' object does not support item assignment
>>> t
(1, [2, 3])
```

The list was mutated in place (the `__iadd__` succeeded), and then the tuple slot assignment failed. Both things happened. An interviewer who asks this wants you to explain the two steps.

## Why immutability matters

- **Hashability**: dict keys and set members must not change, so they must be immutable (or hash by identity).
- **Safety**: an immutable object can be shared freely between functions, threads, and callers without defensive copies.
- **Reasoning**: a function that receives a tuple cannot alter the caller's data.

The price is that "modifying" an immutable object means building a new one, which is why string concatenation in loops is slow and `"".join` exists.

## Shallow and deep copies

A **shallow copy** creates a new container whose elements are the same objects as the original's. A **deep copy** recursively copies the elements too.

```pycon
>>> import copy
>>> original = {"nums": [1, 2], "name": "x"}
>>> shallow = original.copy()                   # or dict(original), or copy.copy(original)
>>> deep = copy.deepcopy(original)
>>> shallow["nums"].append(3)
>>> original["nums"], deep["nums"]
([1, 2, 3], [1, 2])
>>> shallow["name"] = "y"                        # rebinding a key in the copy does not touch the original
>>> original["name"]
'x'
```

Ways to shallow-copy: `list(x)`, `x[:]`, `x.copy()`, `dict(x)`, `set(x)`, `copy.copy(x)`. Only `copy.deepcopy` goes all the way down. Deep copies are expensive and can be surprising with objects that hold references to files or sockets; classes can customise with `__copy__` and `__deepcopy__`.

The trap from the lists chapter, restated in these terms: `[[0] * 3] * 3` is a list holding three references to one inner list. Copying it shallowly does not help; the comprehension `[[0] * 3 for _ in range(3)]` creates three distinct inner lists.

## Function arguments

A function receives references to the caller's objects. Mutating a mutable argument changes the caller's object; rebinding the parameter does not.

```pycon
>>> def add_default(config):
...     config["debug"] = False          # visible to the caller
...     config = {}                       # only the local name
...     return config
...
>>> settings = {}
>>> add_default(settings), settings
({}, {'debug': False})
```

Functions that must not alter their inputs copy them first, or work on immutable inputs (tuples). Documenting whether a function mutates its argument is good API practice; the standard library convention is that in-place methods return `None` (`list.sort`, `list.append`) and non-mutating functions return a new object (`sorted`).

## How memory is managed

CPython uses **reference counting** plus a **cycle-detecting garbage collector**.

- Every object stores a count of references to it. Binding a name, adding to a container, or passing as an argument increments it; unbinding, deletion, or going out of scope decrements it. When the count hits zero the object is freed **immediately**. This is why files closed by `with` and objects freed at function exit behave predictably.
- Reference counting cannot free **cycles** (an object that refers to itself, directly or through others). The garbage collector (`gc` module) periodically finds unreachable cycles and frees them, using generations so that long-lived objects are checked less often.

```pycon
>>> import sys
>>> a = []
>>> sys.getrefcount(a)               # one for a, one for the argument to getrefcount
2
>>> b = a
>>> sys.getrefcount(a)
3
>>> del b
>>> sys.getrefcount(a)
2
>>> import gc
>>> node = {}
>>> node["self"] = node               # a cycle
>>> del node                          # refcount never reaches zero on its own
>>> isinstance(gc.collect(), int)     # the collector reclaims it (returns number of unreachable objects found)
True
```

`del name` removes the binding; the object is freed only when nothing else refers to it. `__del__` methods run when an object is freed, but their timing is not guaranteed for cycles; do not rely on them for cleanup, use context managers.

`weakref` lets you refer to an object without keeping it alive, which is how caches avoid holding everything forever.

## Interning and small-object caching

CPython keeps a single copy of small integers (−5 to 256) and of many short strings, so `is` comparisons on them appear to work. This is an optimisation, not a rule:

```pycon
>>> a, b = 100, 100
>>> a is b
True
>>> s1, s2 = "hello", "hello"
>>> s1 is s2
True
>>> "".join(["hel", "lo"]) is "hello"     # a computed string is a different object
False
```

The last line prints a `SyntaxWarning` about `is` with a literal in recent versions, which is the interpreter telling you the same thing this section does: use `==` for values.

## Measuring memory

```pycon
>>> import sys
>>> sys.getsizeof(0), sys.getsizeof(10**100) > sys.getsizeof(0)
(28, True)
>>> sys.getsizeof([]) < sys.getsizeof([1, 2, 3])
True
>>> sys.getsizeof(range(10**6)) < 100          # a range is tiny no matter its length
True
```

`sys.getsizeof` reports the container's own size, not the elements it references. For real profiling use `tracemalloc`.

Ways to reduce memory when it matters: `__slots__` on classes with many instances, generators instead of lists, `array.array` or NumPy for large numeric data, tuples instead of lists for fixed records, and not keeping references to things you no longer need.

## Common bugs from this chapter

- A default argument list shared across calls (functions chapter).
- A class attribute list shared across instances (classes chapter).
- `[[0] * n] * m` grids.
- Returning an internal list from a method and having the caller mutate it: return a copy or a tuple.
- Sorting a list a caller still uses with `.sort()` instead of `sorted()`.
- Iterating a list while removing from it.
- Expecting `copy()` to duplicate nested structures.

## Interview questions

**What is the difference between mutable and immutable objects? Give examples.**
Mutable objects can change in place (list, dict, set, most classes); immutable ones cannot and every "change" creates a new object (int, str, tuple, frozenset). Immutable objects are hashable and safe to share.

**What does `id()` return and what is `is`?**
`id()` returns an object's identity (its address in CPython); `is` compares identities. Two equal objects can have different ids; two names for one object have the same id.

**What is the difference between a shallow copy and a deep copy?**
A shallow copy duplicates the outer container but shares the inner objects; a deep copy duplicates recursively. Use `copy.deepcopy` when the structure is nested and the copy must be independent.

**Is Python pass-by-value or pass-by-reference?**
Pass by object reference (assignment semantics). Mutations through the parameter are visible to the caller; rebinding the parameter is not.

**How does Python manage memory?**
Reference counting frees objects the moment their count hits zero; a generational garbage collector finds and frees reference cycles. Memory for small objects is managed by CPython's own allocator (pymalloc).

**What is a reference cycle and why does it matter?**
Objects that refer to each other so their counts never reach zero. The cyclic garbage collector reclaims them, but objects with `__del__` or holding external resources may be freed late; avoid cycles or use weak references.

**What does `del` do?**
Removes a name binding (or an item from a container). The object itself is freed only if no other references remain.

**Why does `t[1] += [3]` on a tuple both raise and modify?**
`+=` on the inner list mutates it in place and returns it; the tuple then refuses the slot assignment and raises. The mutation has already happened.

**What is string interning?**
Reusing a single object for identical immutable strings (identifiers and some literals) to save memory and speed comparisons. It is an implementation detail; compare strings with `==`.

**When would you use `__slots__`?**
For classes with a large number of instances, to save memory by removing the per-instance `__dict__` and to prevent accidental new attributes.

**What is a weak reference?**
A reference that does not increase the reference count, so the object can be collected while the weak reference exists. Used in caches and observer patterns.
