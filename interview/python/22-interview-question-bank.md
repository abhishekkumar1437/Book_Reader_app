---
title: Interview Question Bank
part: Interview Prep
summary: One hundred questions from beginner to advanced, grouped by topic, each with a short answer you can say aloud and a pointer to the chapter that explains it. Cover the answers and test yourself.
---

## How to use this chapter

Read a question, answer out loud in two or three sentences, then reveal. Mark the ones you stumbled on and re-read the chapter named next to them. The first sections are what beginner and junior interviews ask; the later ones appear in mid-level and senior rounds.

## Basics (chapters 1 to 4)

**1. What are the key features of Python?**
Readable syntax, dynamic typing, automatic memory management, a large standard library, support for multiple paradigms (procedural, object-oriented, functional), and a huge ecosystem. It is interpreted (bytecode on a VM), portable, and embeddable.

**2. What is the difference between a list and a tuple?**
Lists are mutable and for homogeneous, variable-length collections; tuples are immutable, hashable, and for fixed records. Tuples are slightly cheaper.

**3. What is dynamic typing?**
Types belong to objects, not variables. A name can be rebound to a value of any type, and type errors surface at run time.

**4. What is `None`?**
The single object meaning "no value". Functions without `return` give `None`. Test with `is None`.

**5. What are `*args` and `**kwargs`?**
Catch-alls for extra positional (tuple) and keyword (dict) arguments; also used to forward arguments in wrappers.

**6. What is the difference between `/` and `//`?**
`/` is true division (float); `//` is floor division (rounds toward negative infinity).

**7. What is the difference between `==` and `is`?**
Value equality versus identity. Use `is` only for singletons like `None`.

**8. Which values are falsy?**
`False`, `None`, zero, and empty containers and strings.

**9. What is indentation's role in Python?**
It defines blocks; it is syntax, not style. Four spaces per level.

**10. How do you take input and convert it to an integer?**
`int(input())`, catching `ValueError` for bad input.

**11. What does `range(1, 10, 2)` produce?**
1, 3, 5, 7, 9: start inclusive, stop exclusive, step 2. It is a lazy sequence, not a list.

**12. What is the `else` clause on a loop?**
Runs when the loop ends without `break`.

**13. How do you swap two variables?**
`a, b = b, a`.

**14. What is `pass`?**
A no-op placeholder statement.

**15. What is the ternary expression?**
`x if condition else y`.

## Strings (chapter 3)

**16. Are strings mutable?**
No; every operation returns a new string.

**17. How do you reverse a string?**
`s[::-1]`.

**18. What is the difference between `str.find` and `str.index`?**
`find` returns −1 when missing; `index` raises `ValueError`.

**19. Why is `"".join(list)` preferred to `+=` in a loop?**
Avoids quadratic copying; joins once in linear time.

**20. What is an f-string?**
A literal prefixed with `f` that embeds expressions in `{}` with optional format specs.

**21. What is the difference between `str` and `bytes`?**
Text (Unicode code points) versus raw bytes. Convert with `encode`/`decode`, normally UTF-8.

**22. How do you check whether a string is a palindrome?**
Normalise (lowercase, strip non-alphanumerics) and compare with its reverse.

**23. What does `split()` with no argument do?**
Splits on runs of whitespace and drops empty strings.

## Collections (chapters 5 and 6)

**24. How is a dict implemented?**
Hash table with open addressing; average O(1) lookup, insertion order preserved since 3.7.

**25. What can be a dict key?**
Any hashable (immutable) object: numbers, strings, tuples of hashables, frozensets.

**26. What is the difference between `append` and `extend`?**
One element versus each element of an iterable.

**27. What is the difference between `sort()` and `sorted()`?**
In place returning `None` versus a new list from any iterable.

**28. What does `[[0] * 3] * 3` do?**
Three references to the same inner list; use a comprehension.

**29. What is the difference between a shallow and a deep copy?**
Shallow copies the container, sharing elements; deep copies recursively.

**30. What is a set and when do you use it?**
Unordered unique hashable items with O(1) membership; use for deduplication and fast `in` checks.

**31. What are `Counter` and `defaultdict`?**
A counting dict subclass with `most_common`; a dict that creates missing values via a factory.

**32. How do you remove duplicates while keeping order?**
`list(dict.fromkeys(items))`.

**33. What is a list comprehension?**
`[expr for x in iterable if cond]`, a one-expression way to build a list.

**34. What is the result of `{1: "a", 1.0: "b", True: "c"}`?**
`{1: 'c'}`, because the three keys are equal and hash the same.

**35. Why must dict keys be immutable?**
Their hash must never change, or lookups would fail.

## Functions (chapter 7)

**36. What is a lambda?**
An anonymous single-expression function for short callbacks.

**37. What is the mutable default argument problem?**
Defaults are evaluated once; a mutable default is shared across calls. Use `None` and create inside.

**38. What is the LEGB rule?**
Name resolution order: Local, Enclosing, Global, Built-in.

**39. When do you need `global` or `nonlocal`?**
Only to assign to a variable of an outer scope; reading and mutating do not need them.

**40. What is a closure?**
An inner function that remembers variables from its enclosing scope after that scope has ended.

**41. Why does `[lambda: i for i in range(3)]` give 2 three times?**
Late binding: the lambdas capture the variable, not its value. Bind with a default argument.

**42. Is Python pass-by-value or pass-by-reference?**
Pass by object reference: mutations through the parameter are visible; rebinding is not.

**43. What are keyword-only arguments?**
Parameters after `*` that must be passed by name.

**44. What is recursion's limit in Python?**
About 1,000 frames by default; no tail-call optimisation; convert deep recursion to loops.

## Modules, errors, files (chapters 8 to 10)

**45. What does `if __name__ == "__main__":` do?**
Runs code only when the file is executed directly, not when imported.

**46. What is the difference between a module and a package?**
A `.py` file versus a directory of modules.

**47. What is a circular import and how do you fix it?**
Two modules importing each other; fix by restructuring, importing inside functions, or importing the module instead of names.

**48. Explain `try`/`except`/`else`/`finally`.**
Guard, handle, run-if-no-error, always-run.

**49. Why is a bare `except:` bad?**
It catches `KeyboardInterrupt` and `SystemExit` and hides bugs; catch specific exceptions.

**50. How do you define a custom exception?**
Subclass `Exception`; give your module a base exception class.

**51. What is EAFP?**
Try the operation and handle the exception, rather than checking first.

**52. Why use `with open(...)`?**
Guaranteed close even on exceptions.

**53. How do you read a huge file?**
Iterate line by line; never `read()` it whole.

**54. `json.dump` versus `json.dumps`?**
File versus string.

**55. What is `pickle` and when is it dangerous?**
Python object serialisation; unpickling untrusted data can execute arbitrary code.

## Object-oriented Python (chapters 11 and 12)

**56. What is `self`?**
The instance a method is called on, passed automatically.

**57. Class attribute versus instance attribute?**
Shared on the class versus per instance in `__dict__`.

**58. `@staticmethod` versus `@classmethod`?**
No implicit argument versus receives the class; class methods make alternative constructors.

**59. `__str__` versus `__repr__`?**
User-facing versus developer-facing; define `__repr__` at minimum.

**60. What is inheritance? What is `super()`?**
Reusing a parent class; `super()` delegates to the next class in the MRO.

**61. What is the MRO?**
The order in which classes are searched for attributes, from C3 linearisation; `Cls.__mro__`.

**62. What is an abstract base class?**
A class with `@abstractmethod`s that cannot be instantiated until implemented.

**63. What is duck typing?**
Relying on behaviour (methods present) rather than type.

**64. Composition versus inheritance?**
Has-a versus is-a; prefer composition for flexibility.

**65. What is a dataclass?**
A decorator that generates `__init__`, `__repr__`, `__eq__` from field annotations.

**66. What are dunder methods?**
Special methods like `__len__` and `__add__` that hook into syntax and built-ins.

**67. How does Python do private attributes?**
By convention: `_name` internal, `__name` mangled to `_Class__name`.

**68. What is a property?**
A method accessed like an attribute, for computed values or validation.

**69. What is `__slots__`?**
Fixed attribute storage without a per-instance dict, saving memory.

**70. What is method overloading in Python?**
Not supported by signature; use defaults, `*args`, or `singledispatch`.

**71. What is polymorphism in Python?**
The same operation working on objects of different types, through overridden methods or duck typing.

**72. What is the difference between `isinstance` and `type()`?**
`isinstance` respects inheritance; `type()` comparison does not.

## Iterators, generators, decorators (chapters 13 to 15)

**73. Iterable versus iterator?**
Produces iterators via `__iter__` versus produces values via `__next__`; iterators are single-use.

**74. What is a generator?**
A function with `yield` returning a lazy iterator that resumes where it paused.

**75. Generator expression versus list comprehension?**
Lazy, single pass, constant memory versus a materialised list.

**76. What does `yield from` do?**
Delegates iteration to a sub-iterator.

**77. What is a decorator?**
A callable that wraps a function or class; `@d` is `f = d(f)`.

**78. Why `functools.wraps`?**
To preserve the wrapped function's name, docstring, and signature.

**79. How do you write a decorator with arguments?**
A factory that returns the decorator.

**80. What is `lru_cache`?**
Memoisation by hashable arguments.

**81. What is the difference between `map` and a comprehension?**
`map` applies an existing function lazily; a comprehension is clearer when a lambda would be needed.

**82. What is the walrus operator?**
`:=` assigns inside an expression.

**83. What do `any([])` and `all([])` return?**
`False` and `True`.

## Memory, context managers, concurrency (chapters 16 to 19)

**84. How does Python manage memory?**
Reference counting plus a cyclic garbage collector.

**85. What is a reference cycle?**
Objects referring to each other so counts never reach zero; the GC handles them.

**86. What does `del` do?**
Removes a binding; the object is freed when no references remain.

**87. What is a context manager?**
An object with `__enter__`/`__exit__` used by `with` for guaranteed setup and teardown.

**88. Two ways to write one?**
A class, or a generator with `@contextlib.contextmanager`.

**89. What is the GIL?**
A lock allowing one thread to run Python bytecode at a time; released on I/O.

**90. Threads versus processes?**
Threads for I/O-bound (share memory, GIL-limited); processes for CPU-bound (parallel, separate memory).

**91. What is a race condition?**
Result depends on thread timing; prevent with locks or queues.

**92. What is `concurrent.futures`?**
A pool API (`ThreadPoolExecutor`, `ProcessPoolExecutor`) with `submit`, `map`, and futures.

**93. What is `asyncio`?**
Single-threaded cooperative concurrency with an event loop, coroutines, and `await`; for I/O-bound work with many connections.

**94. What happens if you block inside a coroutine?**
The whole event loop stalls; use async libraries or `asyncio.to_thread`.

**95. Coroutine versus task?**
A suspended function versus a scheduled wrapper running concurrently.

## Quality and internals (chapters 20 and 21)

**96. Does Python enforce type hints?**
No; tools like mypy check them.

**97. What is a fixture in pytest?**
Injected setup for tests, with scope and teardown.

**98. Where do you patch when mocking?**
Where the name is looked up, in the module under test.

**99. Why `logging` over `print`?**
Levels, configurable outputs, timestamps, and no code changes to silence.

**100. How do you find a performance bottleneck?**
Profile with `cProfile`, optimise the top functions, and verify with `timeit`.

## Ten questions interviewers use to go deeper

**What happens when you run `python script.py`?**
The interpreter starts, sets up `sys.path`, compiles the file to bytecode, executes it top to bottom in the `__main__` module, imports run each module once, and at exit objects are finalised.

**What is the difference between a function and a coroutine?**
A function runs to completion when called; a coroutine (`async def`) returns a suspendable object that runs in an event loop and can pause at `await`.

**Explain the descriptor protocol.**
Objects with `__get__`/`__set__`/`__delete__` control attribute access when stored on a class; properties, methods, `classmethod`, and `staticmethod` are descriptors. It is how `obj.method` binds `self`.

**What is a metaclass?**
The class of a class; `type` by default. A custom metaclass customises class creation (registering classes, validating attributes). Rarely needed; class decorators and `__init_subclass__` cover most cases.

**What does `__init_subclass__` do?**
A hook on a parent class called whenever it is subclassed, used for registration and validation without a metaclass.

**How does `super()` work with multiple inheritance?**
It follows the instance's MRO, not the lexical parent, enabling cooperative chains where every class calls `super()`.

**What is monkey patching?**
Changing a module's or class's attributes at run time, commonly in tests. Powerful and dangerous; keep it to tests and well-documented shims.

**What is the difference between `copy.copy` and slicing for lists?**
Both shallow-copy; slicing is list-specific, `copy.copy` is generic and respects `__copy__`.

**How would you implement a singleton?**
A module-level instance is the Pythonic answer; otherwise override `__new__` to return a cached instance, or use a metaclass.

**What Python 3 versions matter and what did they add?**
3.6 f-strings and ordered dicts (implementation), 3.7 ordered dicts guaranteed and dataclasses, 3.8 walrus and positional-only parameters, 3.9 `dict |` and built-in generics, 3.10 `match` and `X | Y` types, 3.11 big speed-up and exception groups, 3.12 f-string improvements and `itertools.batched`, 3.13 experimental free-threading and a JIT.
