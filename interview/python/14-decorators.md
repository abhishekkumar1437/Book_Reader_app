---
title: Decorators
part: Intermediate
summary: What the @ syntax really does, writing decorators with closures, preserving metadata with functools.wraps, decorators with arguments, stacking, class-based decorators, and the ones from the standard library you will actually use.
---

## What a decorator is

A decorator is a function that takes a function and returns a new function, usually one that wraps the original with extra behaviour. The `@` syntax is only shorthand for calling it:

```python
@timer
def work():
    ...

# is exactly the same as

def work():
    ...
work = timer(work)
```

Everything about decorators follows from that one line and from closures (functions chapter): the wrapper is a closure that remembers the original function.

## Writing one

```pycon
>>> import functools, time
>>> def timer(func):
...     @functools.wraps(func)                  # copy name, docstring, etc. onto the wrapper
...     def wrapper(*args, **kwargs):
...         start = time.perf_counter()
...         result = func(*args, **kwargs)      # call the original
...         elapsed = time.perf_counter() - start
...         print(f"{func.__name__} took {elapsed * 1000:.0f} ms")
...         return result
...     return wrapper
...
>>> @timer
... def add(a, b):
...     """Add two numbers."""
...     return a + b
...
>>> add(2, 3)
add took 0 ms
5
>>> add.__name__, add.__doc__
('add', 'Add two numbers.')
```

Three things every decorator needs:

1. **`*args, **kwargs`** in the wrapper, so it works for any signature.
2. **Return the result** of the original call, or callers lose their return value.
3. **`@functools.wraps(func)`**, so the wrapped function keeps its name, docstring, and signature for debugging, documentation, and testing. Without it, `add.__name__` would be `'wrapper'`.

## When the decorator runs

The decorator runs **once, at definition time**, when the module is imported. The wrapper runs on every call. Code outside the wrapper is setup; code inside is per-call.

```pycon
>>> def register(func):
...     print("registering", func.__name__)
...     return func                           # a decorator does not have to wrap; it can just record and return
...
>>> @register
... def handler():
...     pass
...
registering handler
>>> handler()
```

Returning the function unchanged is how frameworks build registries of routes, commands, or plugins.

## Decorators with arguments

`@retry(times=3)` means `retry(times=3)` is called first and must **return a decorator**. That needs one more level of nesting: a decorator factory.

```pycon
>>> def retry(times, exceptions=(Exception,)):
...     def decorator(func):
...         @functools.wraps(func)
...         def wrapper(*args, **kwargs):
...             last = None
...             for attempt in range(1, times + 1):
...                 try:
...                     return func(*args, **kwargs)
...                 except exceptions as exc:
...                     last = exc
...                     print(f"attempt {attempt} failed: {exc}")
...             raise last
...         return wrapper
...     return decorator
...
>>> calls = []
>>> @retry(times=3, exceptions=(ValueError,))
... def flaky():
...     calls.append(1)
...     if len(calls) < 3:
...         raise ValueError("not yet")
...     return "ok"
...
>>> flaky()
attempt 1 failed: not yet
attempt 2 failed: not yet
'ok'
```

Read it inside out: `retry(...)` returns `decorator`; `decorator(flaky)` returns `wrapper`; `flaky` is now `wrapper`.

## Stacking

Decorators apply bottom-up: the one closest to the function wraps first.

```pycon
>>> def tag(name):
...     def decorator(func):
...         @functools.wraps(func)
...         def wrapper(*a, **k):
...             return f"<{name}>{func(*a, **k)}</{name}>"
...         return wrapper
...     return decorator
...
>>> @tag("b")
... @tag("i")
... def text():
...     return "hi"
...
>>> text()
'<b><i>hi</i></b>'
```

`text = tag("b")(tag("i")(text))`.

## Decorating methods

The wrapper receives `self` as the first positional argument, so `*args` handles it automatically. Order with `@property`, `@staticmethod`, and `@classmethod` matters: those must be outermost (listed first) because they return descriptor objects, not plain functions.

```pycon
>>> def log_calls(func):
...     @functools.wraps(func)
...     def wrapper(*args, **kwargs):
...         print("calling", func.__name__)
...         return func(*args, **kwargs)
...     return wrapper
...
>>> class Greeter:
...     @log_calls
...     def hello(self, name):
...         return f"hello {name}"
...     @classmethod
...     @log_calls
...     def make(cls):
...         return cls()
...
>>> Greeter().hello("ann")
calling hello
'hello ann'
>>> isinstance(Greeter.make(), Greeter)
calling make
True
```

## Class-based decorators and decorating classes

Any callable can be a decorator. A class with `__call__` can hold state more explicitly than a closure:

```pycon
>>> class CountCalls:
...     def __init__(self, func):
...         functools.update_wrapper(self, func)
...         self.func = func
...         self.count = 0
...     def __call__(self, *args, **kwargs):
...         self.count += 1
...         return self.func(*args, **kwargs)
...
>>> @CountCalls
... def ping():
...     return "pong"
...
>>> ping(), ping(), ping.count
('pong', 'pong', 2)
```

A decorator can also be applied to a **class**: it receives the class and returns a class (the same one, modified, or a new one). `@dataclass` and `@functools.total_ordering` work this way.

```pycon
>>> def add_repr(cls):
...     cls.__repr__ = lambda self: f"{type(self).__name__}({vars(self)})"
...     return cls
...
>>> @add_repr
... class Box:
...     def __init__(self, w):
...         self.w = w
...
>>> Box(3)
Box({'w': 3})
```

## Standard-library decorators to know

| Decorator | Purpose |
|---|---|
| `@functools.wraps(func)` | Inside your own decorators, copy metadata to the wrapper |
| `@functools.lru_cache(maxsize=128)` / `@functools.cache` | Memoise a pure function by its arguments (must be hashable) |
| `@functools.total_ordering` | Define `__eq__` and one of `__lt__`/`__le__`/`__gt__`/`__ge__`; get the rest |
| `@functools.singledispatch` | Function overloading by the type of the first argument |
| `@functools.cached_property` | A property computed once per instance, then stored |
| `@property`, `@staticmethod`, `@classmethod` | Method kinds (classes chapter) |
| `@dataclass` | Generate boilerplate for data classes |
| `@abc.abstractmethod` | Declare abstract methods |
| `@contextlib.contextmanager` | Turn a generator into a context manager (next chapters) |
| `@unittest.mock.patch(...)`, `@pytest.fixture` | Testing |

```pycon
>>> @functools.lru_cache(maxsize=None)
... def fib(n):
...     return n if n < 2 else fib(n - 1) + fib(n - 2)
...
>>> fib(80)
23416728348467685
>>> fib.cache_info().hits > 0
True
>>> @functools.singledispatch
... def describe(x):
...     return "something"
...
>>> @describe.register
... def _(x: int):
...     return "an int"
...
>>> @describe.register
... def _(x: list):
...     return f"a list of {len(x)}"
...
>>> describe(1), describe([1, 2]), describe("s")
('an int', 'a list of 2', 'something')
```

`lru_cache` turns the exponential naive Fibonacci into linear time and is the fastest route to memoised dynamic programming in interviews. Its arguments must be hashable, so pass tuples, not lists.

## Typical uses

- **Logging and timing** calls.
- **Caching** results.
- **Retrying** on failure with backoff.
- **Access control** ("must be logged in") in web frameworks.
- **Validation** of arguments.
- **Registration** of functions (routes, event handlers, CLI commands).
- **Rate limiting** or **synchronisation** (acquire a lock around a call).

## Common mistakes

- Forgetting `@functools.wraps`, so stack traces and docs show `wrapper`.
- Forgetting to `return` the inner function's result.
- Writing a wrapper with a fixed signature (`def wrapper(x):`), which breaks on other functions.
- Doing per-call work outside the wrapper (it runs once at import) or setup inside it (it runs every call).
- Putting `@property` below a custom decorator instead of above it.
- Decorating with `@decorator()` when the decorator takes no arguments, or `@decorator` when it needs them.

## Interview questions

**What is a decorator?**
A callable that takes a function (or class) and returns a replacement, usually a wrapper adding behaviour. `@d` above `def f` is sugar for `f = d(f)`.

**How do decorators work under the hood?**
They rely on functions being first-class objects and on closures: the wrapper is an inner function that captures the original in its enclosing scope and is returned in its place.

**Why use `functools.wraps`?**
So the wrapper reports the original's `__name__`, `__doc__`, `__module__`, and signature. Without it, introspection, documentation, and some frameworks break.

**How do you write a decorator that takes arguments?**
Add a level: a factory function that receives the arguments and returns the actual decorator, which receives the function and returns the wrapper.

**In what order are stacked decorators applied?**
Bottom to top: the decorator nearest the function is applied first, and the topmost wraps the result.

**When does the decorator code run?**
At definition (import) time, once. The wrapper it returns runs on every call.

**Can you decorate a class? A method?**
Yes. A class decorator receives the class object. Method decorators work because `self` is just the first positional argument caught by `*args`; built-in method decorators like `@property` must be outermost.

**What is `lru_cache` and what are its limits?**
A decorator that memoises results by arguments. Arguments must be hashable; the cache grows up to `maxsize`; it is per process and not safe for functions with side effects.

**Give an example of a decorator you would write at work.**
A retry with exponential backoff for calls to an external API; a timer that logs slow functions; a permission check for view functions.

**What is the difference between a decorator and a context manager?**
A decorator wraps a function's whole execution; a context manager wraps a block of code inside a function. Some behaviours (timing, locking) can be written as either; `contextlib.ContextDecorator` lets one object serve as both.
