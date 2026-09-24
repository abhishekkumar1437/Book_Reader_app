---
title: Errors & Exceptions
part: Intermediate
summary: try, except, else and finally, the exception hierarchy, raising and re-raising, custom exceptions, chaining, EAFP versus LBYL, and the mistakes that make error handling worse than none.
---

## What an exception is

When something goes wrong, Python creates an exception object and **raises** it. The current function stops; the exception travels up the call stack until some `try` block catches it. If nothing does, the program prints a traceback and exits.

```pycon
>>> int("abc")
Traceback (most recent call last):
    ...
ValueError: invalid literal for int() with base 10: 'abc'
>>> [1, 2][5]
Traceback (most recent call last):
    ...
IndexError: list index out of range
>>> {}["k"]
Traceback (most recent call last):
    ...
KeyError: 'k'
>>> None.upper()
Traceback (most recent call last):
    ...
AttributeError: 'NoneType' object has no attribute 'upper'
>>> 1 / 0
Traceback (most recent call last):
    ...
ZeroDivisionError: division by zero
```

Read a traceback **from the bottom**: the last line is the exception type and message; the lines above show the call chain, innermost last.

## Handling with `try`

```pycon
>>> def parse_age(text):
...     try:
...         age = int(text)
...     except ValueError:
...         return None
...     else:
...         return age          # runs only if no exception occurred
...     finally:
...         pass                # always runs: cleanup goes here
...
>>> parse_age("42"), parse_age("x")
(42, None)
```

- `except` catches the named exception (and its subclasses).
- `else` runs when the `try` body completed without raising. Put code there that should not be protected by the `except`, so its own errors are not accidentally swallowed.
- `finally` always runs: after success, after a handled exception, after an unhandled one, and even after a `return`. Use it to release resources (or, better, use a `with` statement).

Catch several types, or bind the exception to a name:

```pycon
>>> def safe_div(a, b):
...     try:
...         return a / b
...     except (ZeroDivisionError, TypeError) as exc:
...         return f"failed: {type(exc).__name__}: {exc}"
...
>>> safe_div(1, 0), safe_div(1, "x")
('failed: ZeroDivisionError: division by zero', "failed: TypeError: unsupported operand type(s) for /: 'int' and 'str'")
```

Multiple `except` clauses are checked in order; put specific exceptions before general ones.

```python
try:
    do_work()
except FileNotFoundError:
    ...                      # specific
except OSError:
    ...                      # its parent; would also catch FileNotFoundError if placed first
except Exception as exc:
    log(exc)                 # anything else that is a normal error
    raise                    # re-raise the same exception unchanged
```

## The hierarchy

```
BaseException
 ├── SystemExit, KeyboardInterrupt, GeneratorExit      (not "errors": do not catch casually)
 └── Exception
      ├── ArithmeticError → ZeroDivisionError, OverflowError
      ├── LookupError → IndexError, KeyError
      ├── ValueError → UnicodeError
      ├── TypeError
      ├── AttributeError, NameError, ImportError (ModuleNotFoundError)
      ├── OSError → FileNotFoundError, PermissionError, TimeoutError, ConnectionError
      ├── RuntimeError → RecursionError, NotImplementedError
      ├── StopIteration, AssertionError
      └── ...
```

`except Exception` catches every ordinary error. A bare `except:` catches **everything**, including `KeyboardInterrupt` (Ctrl-C) and `SystemExit`, which is why it is almost always wrong.

```pycon
>>> issubclass(KeyError, LookupError), issubclass(FileNotFoundError, OSError), issubclass(KeyboardInterrupt, Exception)
(True, True, False)
```

## Raising

```pycon
>>> def withdraw(balance, amount):
...     if amount <= 0:
...         raise ValueError(f"amount must be positive, got {amount}")
...     if amount > balance:
...         raise ValueError("insufficient funds")
...     return balance - amount
...
>>> withdraw(100, 30)
70
>>> withdraw(100, 300)
Traceback (most recent call last):
    ...
ValueError: insufficient funds
```

Pick the built-in type whose meaning fits: `ValueError` for a bad value, `TypeError` for a wrong type, `KeyError`/`IndexError` for missing items, `RuntimeError` when nothing else fits. The message should say what was wrong and, where useful, what the value was.

Inside an `except` block, a bare `raise` re-raises the current exception with its original traceback. `raise exc` from a handler re-raises a specific object; `raise NewError(...) from exc` chains them.

## Chaining and context

When an exception is raised while handling another, Python keeps both and prints "During handling of the above exception, another exception occurred". `raise ... from ...` makes the relationship explicit ("The above exception was the direct cause of the following exception"), and `from None` suppresses the original when it is just noise.

```pycon
>>> def load_config(text):
...     try:
...         return int(text)
...     except ValueError as exc:
...         raise RuntimeError("config is not a number") from exc
...
>>> try:
...     load_config("x")
... except RuntimeError as e:
...     print(e, "| caused by:", repr(e.__cause__))
...
config is not a number | caused by: ValueError("invalid literal for int() with base 10: 'x'")
```

## Custom exceptions

Define your own when callers need to distinguish your errors from everyone else's, or when you want a hierarchy. Subclass `Exception` (or a more specific built-in), keep them small, and give the module a base class so callers can catch all of them at once.

```pycon
>>> class AppError(Exception):
...     """Base for all errors in this application."""
...
>>> class NotFound(AppError):
...     def __init__(self, kind, key):
...         super().__init__(f"{kind} {key!r} not found")
...         self.kind, self.key = kind, key
...
>>> class PermissionDenied(AppError):
...     pass
...
>>> def get_user(users, key):
...     if key not in users:
...         raise NotFound("user", key)
...     return users[key]
...
>>> try:
...     get_user({}, "ann")
... except AppError as e:
...     print(type(e).__name__, "-", e, "-", e.key)
...
NotFound - user 'ann' not found - ann
```

## EAFP versus LBYL

**LBYL** (look before you leap) checks conditions first. **EAFP** (easier to ask forgiveness than permission) tries the operation and handles the exception. Python favours EAFP: it avoids race conditions (the file could vanish between the check and the open), it is often faster when failures are rare, and it handles all failure modes rather than the one you thought of.

```python
# LBYL
if key in d:
    value = d[key]
else:
    value = default

# EAFP
try:
    value = d[key]
except KeyError:
    value = default

# For this specific case, the best form is neither:
value = d.get(key, default)
```

Use LBYL when the check is cheap and the exception would be expensive or confusing; use EAFP when the operation naturally reports failure by raising.

## Exceptions are for control flow, too

`StopIteration` ends every `for` loop; `KeyError` is how `dict` reports absence. Exceptions are a normal part of Python's design, not only for catastrophes. That said, using `try`/`except` where an `if` reads better is poor style.

## Assertions

`assert condition, message` raises `AssertionError` if the condition is false. It is for checking things that should be impossible (internal invariants during development), not for validating input, because `python -O` strips assertions entirely.

```pycon
>>> def mean(xs):
...     assert xs, "mean of empty list"
...     return sum(xs) / len(xs)
...
>>> mean([])
Traceback (most recent call last):
    ...
AssertionError: mean of empty list
```

## Common mistakes

**Swallowing everything.**

```python
try:
    process()
except Exception:
    pass                    # the error is gone; nobody will ever know
```

At minimum log it. Catch only what you can handle; let the rest propagate.

**Catching too early.** Handle an exception at the level that knows what to do about it. Low-level code should usually let errors rise to the caller that can retry, report, or abort.

**Using exceptions to hide bugs.** Catching `AttributeError` around code that has a typo in an attribute name hides the typo.

**Returning error codes instead of raising.** `return -1` on failure forces every caller to check; raising cannot be silently ignored.

**`except ValueError, TypeError:`** is Python 2 syntax; Python 3 needs the tuple `except (ValueError, TypeError):`.

## Interview questions

**What is the difference between an error and an exception in Python?**
Both are exceptions. Syntax errors are found before running; run-time exceptions are objects raised while running. Everything catchable derives from `BaseException`.

**Explain `try`, `except`, `else`, `finally`.**
`try` wraps code that may raise; `except` handles matching exceptions; `else` runs only if nothing was raised; `finally` always runs, for cleanup.

**When does `finally` run if the `try` block has a `return`?**
Still runs, right before the function returns. If `finally` itself returns, its value replaces the original (a known trap; avoid `return` in `finally`).

**What is wrong with a bare `except:`?**
It catches `KeyboardInterrupt`, `SystemExit`, and everything else, so the program cannot be interrupted and bugs are hidden. Use `except Exception` at most, and preferably a specific type.

**What is the difference between `raise` and `raise exc`?**
Bare `raise` inside a handler re-raises the exception being handled, preserving its traceback. `raise exc` raises that object (and, if it is a new one, starts a new traceback).

**What does `raise ... from ...` do?**
Sets the new exception's `__cause__` to the original, so the traceback shows the chain explicitly. `from None` suppresses the implicit context.

**How do you define a custom exception?**
Subclass `Exception` (or a more specific built-in). Give your module one base class and derive specific ones from it. Add attributes for structured information if callers need it.

**What is EAFP?**
"Easier to ask forgiveness than permission": try the operation and catch the exception, instead of checking preconditions first. It is the idiomatic style because it avoids race conditions and covers all failure modes.

**What is the difference between `KeyError`, `IndexError`, and `AttributeError`?**
Missing dict key; sequence index out of range; missing attribute on an object. All three are common signs of a `None` or an unexpected shape of data.

**When should you use `assert`?**
For internal invariants during development. Not for validating user input or enforcing conditions in production, because assertions are removed under `python -O`.

**What is exception chaining?**
When an exception is raised while another is being handled, Python links them (`__context__`, or `__cause__` with `from`) and prints both tracebacks, so the root cause is not lost.

**Is it expensive to use exceptions?**
Setting up a `try` is nearly free; raising and catching costs more than a comparison. Use them for exceptional paths, not for loops that fail on most iterations.
