---
title: Functions
part: Foundations
summary: Defining and calling functions, positional and keyword arguments, defaults and the mutable-default trap, *args and **kwargs, scope and the LEGB rule, lambda, first-class functions, and closures.
---

## Defining and calling

```pycon
>>> def greet(name, greeting="Hello"):
...     """Return a greeting for name."""
...     return f"{greeting}, {name}!"
...
>>> greet("Ada")
'Hello, Ada!'
>>> greet("Ada", "Hi")
'Hi, Ada!'
>>> greet(greeting="Hey", name="Ada")     # keyword arguments can go in any order
'Hey, Ada!'
>>> greet()
Traceback (most recent call last):
    ...
TypeError: greet() missing 1 required positional argument: 'name'
```

A function without a `return`, or with a bare `return`, returns `None`. `return a, b` returns a tuple.

Functions are objects: they have a name, a docstring, and can be stored, passed, and returned.

```pycon
>>> greet.__name__, greet.__doc__
('greet', 'Return a greeting for name.')
>>> say = greet
>>> say("Bo")
'Hello, Bo!'
```

## Parameters, in order

A signature can have, in this order: positional-only parameters, ordinary parameters, `*args`, keyword-only parameters, `**kwargs`.

```python
def f(a, b, /, c, d=4, *args, e, f=6, **kwargs):
    #  ^ positional-only  ^ normal   ^ keyword-only    ^ everything else
    return a, b, c, d, args, e, f, kwargs
```

```pycon
>>> f(1, 2, 3, 4, 5, 6, e=7, g=8)
(1, 2, 3, 4, (5, 6), 7, 6, {'g': 8})
>>> f(a=1, b=2, c=3, e=7)
Traceback (most recent call last):
    ...
TypeError: f() missing 2 required positional arguments: 'a' and 'b'
```

- `/` marks everything before it as **positional-only**: callers cannot use its name. (Because this `f` also has `**kwargs`, `a=1` lands in `kwargs` and the real positional `a` is reported missing.) Used in built-ins like `len(obj, /)`.
- `*` (or `*args`) marks everything after it as **keyword-only**: callers must use the name. It makes calls self-documenting and lets you add parameters without breaking callers.

### `*args` and `**kwargs`

`*args` collects extra positional arguments into a tuple; `**kwargs` collects extra keyword arguments into a dict. The names are conventions; the stars are what matter.

```pycon
>>> def summarize(*args, **kwargs):
...     return args, kwargs
...
>>> summarize(1, 2, x=3)
((1, 2), {'x': 3})
>>> def total(*numbers):
...     return sum(numbers)
...
>>> total(), total(1, 2, 3)
(0, 6)
```

The same stars **unpack** at the call site:

```pycon
>>> def add(a, b, c):
...     return a + b + c
...
>>> args = [1, 2, 3]
>>> add(*args)
6
>>> options = {"b": 2, "c": 3}
>>> add(1, **options)
6
```

Wrapper functions that forward everything use both: `def wrapper(*args, **kwargs): return inner(*args, **kwargs)`. The decorators chapter relies on this.

## Default arguments and the mutable-default trap

Defaults are evaluated **once**, when the function is defined, not on every call. With an immutable default that is invisible. With a mutable default it is the most famous Python bug.

```pycon
>>> def add_item(item, items=[]):
...     items.append(item)
...     return items
...
>>> add_item(1)
[1]
>>> add_item(2)                 # the SAME list from the previous call
[1, 2]
>>> add_item.__defaults__
([1, 2],)
```

The fix is to use `None` as the default and create the object inside:

```pycon
>>> def add_item(item, items=None):
...     if items is None:
...         items = []
...     items.append(item)
...     return items
...
>>> add_item(1), add_item(2)
([1], [2])
```

The same evaluate-once rule means `def f(t=time.time())` captures the time at definition.

## Scope: the LEGB rule

When Python sees a name, it looks in four places in order: **L**ocal (the current function), **E**nclosing (any outer functions), **G**lobal (the module), **B**uilt-in (`len`, `print`, ...).

```pycon
>>> x = "global"
>>> def outer():
...     x = "enclosing"
...     def inner():
...         x = "local"
...         return x
...     return inner(), x
...
>>> outer(), x
(('local', 'enclosing'), 'global')
```

**Assignment makes a name local.** Reading a global inside a function works; assigning to it creates a new local unless you declare otherwise. This produces a confusing error:

```pycon
>>> count = 0
>>> def bump():
...     count += 1          # count is local here because it is assigned, but it is read first
...
>>> bump()
Traceback (most recent call last):
    ...
UnboundLocalError: cannot access local variable 'count' where it is not associated with a value
```

`global` declares that assignments target the module-level name; `nonlocal` targets the nearest enclosing function's name.

```pycon
>>> count = 0
>>> def bump():
...     global count
...     count += 1
...
>>> bump(); bump(); count
2
>>> def make_counter():
...     n = 0
...     def step():
...         nonlocal n
...         n += 1
...         return n
...     return step
...
>>> c = make_counter()
>>> c(), c(), c()
(1, 2, 3)
```

Mutating a global object (appending to a global list) needs no declaration because that is not assignment to the name. Rebinding it does.

Use `global` sparingly; functions that depend on hidden module state are hard to test. Prefer passing values in and returning them.

## Closures

`make_counter` above returns a function that remembers `n` from the scope where it was created, even after `make_counter` has returned. That inner function is a **closure**: a function plus the variables it captured.

```pycon
>>> def multiplier(factor):
...     def multiply(x):
...         return x * factor
...     return multiply
...
>>> double, triple = multiplier(2), multiplier(3)
>>> double(5), triple(5)
(10, 15)
>>> double.__closure__[0].cell_contents
2
```

Closures capture **variables, not values**. A loop that creates several closures over the same variable sees the final value in all of them:

```pycon
>>> funcs = [lambda: i for i in range(3)]
>>> [f() for f in funcs]
[2, 2, 2]
>>> funcs = [lambda i=i: i for i in range(3)]     # bind the current value as a default
>>> [f() for f in funcs]
[0, 1, 2]
```

This is the late-binding closure question, asked often. The default-argument trick or `functools.partial` fixes it.

## Lambda

An anonymous function containing a single expression. Use it for short callbacks (`key=`, `map`, `filter`); give anything longer a name with `def`.

```pycon
>>> square = lambda x: x * x
>>> square(4)
16
>>> sorted(["bb", "a", "ccc"], key=lambda s: -len(s))
['ccc', 'bb', 'a']
>>> (lambda a, b=2: a + b)(1)
3
```

Lambdas cannot contain statements (no `=`, `return`, `if` statements; the conditional *expression* is fine). PEP 8 says do not assign a lambda to a name; write a `def`.

## First-class functions and higher-order functions

Functions can be passed as arguments and returned as results. Built-ins that take functions:

```pycon
>>> list(map(str.upper, ["a", "b"]))
['A', 'B']
>>> list(filter(lambda n: n % 2, [1, 2, 3, 4]))
[1, 3]
>>> from functools import reduce
>>> reduce(lambda acc, n: acc * n, [1, 2, 3, 4])
24
>>> max(["apple", "fig"], key=len)
'apple'
```

In modern Python, comprehensions usually replace `map` and `filter`, and `sum`, `max`, `min`, `any`, `all` replace most `reduce` uses.

`functools.partial` fixes some arguments of a function:

```pycon
>>> from functools import partial
>>> int_from_binary = partial(int, base=2)
>>> int_from_binary("1010")
10
```

## Type hints and docstrings

Hints document the intended types and let tools check them; Python does not enforce them at run time.

```python
def mean(values: list[float], *, precision: int = 2) -> float:
    """Return the arithmetic mean of values, rounded to precision digits.

    Raises ValueError if values is empty.
    """
    if not values:
        raise ValueError("mean of empty list")
    return round(sum(values) / len(values), precision)
```

```pycon
>>> mean([1, 2, 4])
2.33
>>> mean.__annotations__
{'values': list[float], 'precision': <class 'int'>, 'return': <class 'float'>}
```

## Recursion, briefly

A function that calls itself needs a base case. Python's recursion limit is about 1,000 frames by default (`sys.setrecursionlimit` changes it), and there is no tail-call optimisation, so deep recursion should be rewritten as a loop.

```pycon
>>> def factorial(n):
...     return 1 if n <= 1 else n * factorial(n - 1)
...
>>> factorial(5)
120
>>> import sys
>>> sys.getrecursionlimit()
1000
```

## Pass by what?

Python passes **object references by value**: the function receives a reference to the same object the caller has. If the object is mutable and the function mutates it, the caller sees the change. If the function rebinds the parameter name, the caller does not.

```pycon
>>> def mutate(lst):
...     lst.append(4)          # changes the shared object
...
>>> def rebind(lst):
...     lst = [9]              # only the local name changes
...
>>> data = [1, 2, 3]
>>> mutate(data); data
[1, 2, 3, 4]
>>> rebind(data); data
[1, 2, 3, 4]
```

"Pass by assignment" or "pass by object reference" is the phrase to use; "pass by value" and "pass by reference" are both misleading.

## Interview questions

**What is the difference between arguments and parameters?**
Parameters are the names in the function definition; arguments are the values passed in a call.

**What are `*args` and `**kwargs`?**
`*args` gathers extra positional arguments into a tuple; `**kwargs` gathers extra keyword arguments into a dict. They let a function accept any number of arguments and let wrappers forward everything.

**Why should you not use a mutable default argument?**
Defaults are evaluated once at definition time, so the same object is shared by all calls that do not supply the argument. Use `None` and create the object inside the function.

**What is the LEGB rule?**
Name lookup order: Local, Enclosing, Global, Built-in. The first scope that has the name wins.

**When do you need `global` and `nonlocal`?**
Only when a function assigns to a name that belongs to an outer scope. `global` targets module scope; `nonlocal` targets the nearest enclosing function. Reading and mutating do not need them.

**What is a closure?**
A function that captures variables from its enclosing scope and keeps access to them after that scope has finished. Used for factories, decorators, and callbacks with state.

**Why does `[lambda: i for i in range(3)]` return 2 three times?**
Closures capture the variable `i`, not its value at creation; by the time the lambdas run, the loop has finished and `i` is 2. Bind the value with a default argument (`lambda i=i: i`) or `functools.partial`.

**What is a lambda, and what are its limits?**
An anonymous single-expression function. It cannot contain statements or annotations and should be used only for short, throwaway callbacks.

**Is Python pass-by-value or pass-by-reference?**
Neither in the C++ sense. It passes object references by value: mutations to a mutable argument are visible to the caller; rebinding the parameter is not.

**What does a function return if it has no `return` statement?**
`None`.

**What is the difference between a function and a method?**
A method is a function defined in a class and called on an instance, which is passed automatically as the first argument (`self`).

**What are keyword-only and positional-only parameters?**
Parameters after `*` must be passed by name; parameters before `/` must be passed by position. They make APIs clearer and safer to evolve.

**What is `functools.partial`?**
It returns a new callable with some arguments of the original pre-filled, useful for adapting functions to callback signatures and for fixing loop variables in closures.

**Does Python optimise tail recursion?**
No. Deep recursion hits the recursion limit (default about 1,000). Convert to iteration or raise the limit deliberately.
