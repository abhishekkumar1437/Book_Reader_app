---
title: Context Managers
part: Advanced
summary: What with really does, writing context managers as classes and with contextlib, handling exceptions in __exit__, reentrancy, and the standard-library managers you should reach for.
---

## What `with` does

`with` guarantees that a setup step and a teardown step surround a block, and that the teardown runs no matter how the block exits: normally, by `return`, by `break`, or by an exception.

```python
with open("data.txt") as f:
    process(f)
# f is closed here, even if process raised
```

is equivalent to:

```python
manager = open("data.txt")
f = manager.__enter__()
try:
    process(f)
finally:
    manager.__exit__(None, None, None)     # receives exception info if there was one
```

An object with `__enter__` and `__exit__` is a **context manager**. `__enter__` runs at the start and its return value is bound by `as`; `__exit__` runs at the end and receives the exception type, value, and traceback (or three `None`s).

## Writing one as a class

```pycon
>>> import time
>>> class Timer:
...     def __enter__(self):
...         self.start = time.perf_counter()
...         return self                          # bound to the `as` name
...     def __exit__(self, exc_type, exc, tb):
...         self.elapsed = time.perf_counter() - self.start
...         return False                         # do not suppress exceptions
...
>>> with Timer() as t:
...     total = sum(range(1000))
...
>>> t.elapsed >= 0, total
(True, 499500)
```

`__exit__` returning a truthy value **suppresses** the exception; returning `False` or `None` lets it propagate after cleanup. Suppression is rare and deliberate (`contextlib.suppress` is the standard example).

```pycon
>>> class Suppress:
...     def __init__(self, *types):
...         self.types = types
...     def __enter__(self):
...         return None
...     def __exit__(self, exc_type, exc, tb):
...         return exc_type is not None and issubclass(exc_type, self.types)
...
>>> with Suppress(KeyError):
...     {}["missing"]
...
>>> print("still running")
still running
```

## Writing one with `contextlib.contextmanager`

A generator with exactly one `yield` becomes a context manager: everything before the `yield` is setup, the yielded value is bound by `as`, everything after is teardown. Wrap the `yield` in `try`/`finally` so teardown runs on exceptions.

```pycon
>>> from contextlib import contextmanager
>>> @contextmanager
... def temporary_setting(config, key, value):
...     old = config.get(key)
...     config[key] = value
...     try:
...         yield config
...     finally:
...         if old is None:
...             del config[key]
...         else:
...             config[key] = old
...
>>> cfg = {"debug": False}
>>> with temporary_setting(cfg, "debug", True):
...     cfg["debug"]
...
True
>>> cfg
{'debug': False}
>>> try:
...     with temporary_setting(cfg, "debug", True):
...         raise RuntimeError("boom")
... except RuntimeError:
...     pass
...
>>> cfg                                       # restored despite the exception
{'debug': False}
```

This is the form to use in interviews: shorter, and the setup/teardown order is obvious. Inside the generator, an exception raised in the `with` block appears at the `yield`, so `except` clauses around it can handle or transform it.

## Common uses

| Need | Manager |
|---|---|
| Files | `open()` |
| Locks | `threading.Lock()` (acquire on enter, release on exit) |
| Database transactions | connection objects: commit on success, rollback on exception |
| Temporary files and directories | `tempfile.TemporaryDirectory()`, `tempfile.NamedTemporaryFile()` |
| Change directory temporarily | `contextlib.chdir(path)` (3.11) |
| Ignore specific exceptions | `contextlib.suppress(FileNotFoundError)` |
| Redirect output | `contextlib.redirect_stdout(buffer)` |
| Close anything with `.close()` | `contextlib.closing(obj)` |
| Timing, logging, resource pools | your own |
| Testing: assert an exception | `pytest.raises(ValueError)`, `unittest.TestCase.assertRaises` |
| Mocking | `unittest.mock.patch(...)` |

```pycon
>>> import io, contextlib, tempfile, os
>>> buf = io.StringIO()
>>> with contextlib.redirect_stdout(buf):
...     print("captured")
...
>>> buf.getvalue()
'captured\n'
>>> with contextlib.suppress(FileNotFoundError):
...     os.remove("definitely-not-here.txt")
...
>>> with tempfile.TemporaryDirectory() as d:
...     exists_inside = os.path.isdir(d)
...
>>> exists_inside, os.path.isdir(d)
(True, False)
```

## Several managers at once

```python
with open("in.txt") as src, open("out.txt", "w") as dst:
    dst.write(src.read())

# 3.10+: parenthesised for long lists
with (
    open("in.txt") as src,
    open("out.txt", "w") as dst,
):
    ...
```

Managers enter left to right and exit right to left. If the second `open` fails, the first file is still closed.

For a **variable number** of managers, `contextlib.ExitStack` collects them and closes all on exit:

```python
from contextlib import ExitStack

with ExitStack() as stack:
    files = [stack.enter_context(open(p)) for p in paths]
    ...
```

## Locks as context managers

The most important non-file use. Forgetting to release a lock on an exception deadlocks the program; `with` makes it impossible to forget.

```pycon
>>> import threading
>>> lock = threading.Lock()
>>> counter = 0
>>> def increment():
...     global counter
...     with lock:                          # acquire; release in __exit__ even on error
...         counter += 1
...
>>> threads = [threading.Thread(target=increment) for _ in range(50)]
>>> for t in threads: t.start()
>>> for t in threads: t.join()
>>> counter
50
```

## A manager that is also a decorator

`contextlib.ContextDecorator` (or a class inheriting from it) lets one object be used both ways:

```pycon
>>> from contextlib import ContextDecorator
>>> class Announce(ContextDecorator):
...     def __enter__(self):
...         print("start")
...         return self
...     def __exit__(self, *exc):
...         print("end")
...         return False
...
>>> @Announce()
... def task():
...     print("working")
...
>>> task()
start
working
end
```

## Async context managers

`async with` uses `__aenter__`/`__aexit__` (or `contextlib.asynccontextmanager`) for resources whose setup or teardown awaits, such as network connections. Covered in the async chapter.

## Common mistakes

- Doing the teardown after the `yield` without `try`/`finally`, so an exception skips it.
- Returning `True` from `__exit__` by accident (for example returning the result of a cleanup call), which silently swallows every exception.
- Opening a file with `open()` in one place and closing it in another; if the code between them can raise, the file leaks. Use `with`.
- Holding a lock across a call that might block for a long time or re-acquire the same lock (use `RLock` for reentrancy, or restructure).
- Yielding more than once in a `@contextmanager` generator, which raises `RuntimeError`.

## Interview questions

**What is a context manager?**
An object implementing `__enter__` and `__exit__` that the `with` statement uses to run setup and guaranteed teardown around a block.

**How does `with` handle exceptions?**
`__exit__` is called with the exception type, value, and traceback. If it returns a truthy value the exception is suppressed; otherwise it propagates after cleanup has run.

**Two ways to write a context manager?**
A class with `__enter__`/`__exit__`, or a generator function decorated with `@contextlib.contextmanager` where the code before `yield` is setup and the code after (in a `finally`) is teardown.

**Why prefer `with open(...)` over calling `close()` yourself?**
`with` closes the file even when an exception or early return leaves the block, so you cannot leak the handle or lose buffered writes.

**What is `contextlib.suppress`?**
A context manager that ignores the given exception types inside its block, a cleaner replacement for `try: ... except X: pass`.

**How do you use several context managers together?**
Comma-separate them in one `with`, use parentheses for long lists (3.10+), or use `ExitStack` when the number is dynamic.

**How does a `threading.Lock` work with `with`?**
Entering acquires the lock; exiting releases it, even on exception, which prevents deadlocks caused by a forgotten release.

**Can a context manager be reused or nested?**
Depends on the object. File objects cannot be re-entered after closing; a `Lock` can be used repeatedly but not re-entered by the same thread (use `RLock`). A `@contextmanager` generator produces a fresh manager per call.

**What is `__exit__`'s signature?**
`__exit__(self, exc_type, exc_value, traceback)`; all three are `None` when the block finished without an exception.

**What is the relationship between context managers and `try`/`finally`?**
A context manager packages a `try`/`finally` (and optionally `except`) pattern into a reusable object, so the cleanup logic is written once and used with `with`.
