---
title: Typing, Testing & Code Quality
part: Advanced
summary: Type hints that tools can check, pytest fundamentals, fixtures and parametrisation, mocking, unittest, logging instead of print, debugging with pdb, and the tooling a professional Python setup uses.
---

## Type hints

Hints annotate parameters, returns, and variables with expected types. Python ignores them at run time; **mypy**, **pyright**, and IDEs check them. They document intent, catch a class of bugs before running, and make refactoring safer.

```python
from collections.abc import Iterable, Callable
from typing import Optional, Union, Any, TypeVar

def mean(values: Iterable[float]) -> float: ...
def find(users: list[dict[str, str]], name: str) -> Optional[dict[str, str]]: ...   # or dict[str, str] | None
def apply(fn: Callable[[int], int], x: int) -> int: ...

T = TypeVar("T")
def first(items: list[T]) -> T: ...                # generic: returns the element type

Number = int | float                                # type alias
count: int = 0
```

Rules of thumb that interviewers like to hear:

- Since 3.9 use built-in generics (`list[int]`, `dict[str, int]`) instead of `typing.List`; since 3.10 use `X | None` instead of `Optional[X]`.
- Accept broad types (`Iterable`, `Mapping`, `Sequence`) and return specific ones (`list`, `dict`).
- `Any` disables checking for that value; use it rarely and deliberately.
- `Protocol` describes structural types (duck typing for the checker); `TypedDict` describes dict shapes; `Literal["a", "b"]` restricts to specific values.
- Hints do not validate input. For run-time validation (API payloads, config), use `pydantic` or explicit checks.

```pycon
>>> from typing import get_type_hints
>>> def scale(x: float, factor: float = 2.0) -> float:
...     return x * factor
...
>>> get_type_hints(scale)
{'x': <class 'float'>, 'factor': <class 'float'>, 'return': <class 'float'>}
>>> scale("ab", 2)                       # hints do not stop this at run time
'abab'
```

Run `mypy .` (or `pyright`) in CI; treat its errors as test failures. Start with `--strict` on new code; add gradually to old code.

## Testing with pytest

`pytest` discovers files named `test_*.py`, functions named `test_*`, and uses plain `assert` with helpful failure messages.

```python
# calc.py
def divide(a: float, b: float) -> float:
    if b == 0:
        raise ZeroDivisionError("cannot divide by zero")
    return a / b
```

```python
# test_calc.py
import pytest
from calc import divide

def test_divide_basic():
    assert divide(10, 4) == 2.5

def test_divide_by_zero_raises():
    with pytest.raises(ZeroDivisionError, match="divide by zero"):
        divide(1, 0)

@pytest.mark.parametrize("a, b, expected", [
    (6, 3, 2),
    (1, 4, 0.25),
    (-8, 2, -4),
])
def test_divide_cases(a, b, expected):
    assert divide(a, b) == expected

def test_float_result():
    assert divide(1, 3) == pytest.approx(0.3333, abs=1e-4)
```

Run with `pytest`, `pytest -q`, `pytest -k zero` (select by name), `pytest -x` (stop at first failure), `pytest --lf` (rerun last failures).

### Fixtures

A fixture is a function that prepares something a test needs; pytest injects it by parameter name. Scope controls how often it is built.

```python
import pytest

@pytest.fixture
def sample_users():
    return [{"name": "ann", "active": True}, {"name": "bob", "active": False}]

@pytest.fixture
def tmp_config(tmp_path):                   # tmp_path is a built-in fixture: a fresh temp directory
    path = tmp_path / "config.json"
    path.write_text('{"debug": true}')
    return path

def test_active_users(sample_users):
    assert [u["name"] for u in sample_users if u["active"]] == ["ann"]

def test_reads_config(tmp_config):
    assert "debug" in tmp_config.read_text()
```

Put shared fixtures in `conftest.py`. Use `yield` inside a fixture for teardown (code after the `yield` runs when the test finishes). Built-in fixtures to know: `tmp_path`, `monkeypatch` (temporarily set attributes, environment variables, dict items), `capsys` (capture printed output).

### Mocking

Replace a slow or external dependency (HTTP, database, time, randomness) with a controllable stand-in so the test is fast and deterministic. `unittest.mock.patch` swaps an object for the duration of a test; `MagicMock` records calls.

```python
from unittest.mock import patch, MagicMock
import weather                                   # module with fetch_temperature(city) that calls an API

def test_report_formats_temperature():
    with patch("weather.fetch_temperature", return_value=21.5) as fake:
        assert weather.report("Pune") == "Pune: 21.5°C"
        fake.assert_called_once_with("Pune")

@patch("weather.requests.get")
def test_fetch_parses_json(mock_get):
    mock_get.return_value = MagicMock(status_code=200, json=lambda: {"temp": 30})
    assert weather.fetch_temperature("Pune") == 30
```

Patch **where the name is looked up**, not where it is defined: if `weather.py` did `from requests import get`, you patch `weather.get`. This is the mocking question interviewers ask most.

`pytest`'s `monkeypatch` fixture is a lighter alternative for attributes and environment variables:

```python
def test_uses_env(monkeypatch):
    monkeypatch.setenv("API_KEY", "test-key")
    assert config.api_key() == "test-key"
```

### What to test, and how much

- Test behaviour through the public interface, not private details, so refactors do not break tests.
- One logical assertion per test where practical; name tests after the behaviour (`test_rejects_negative_amount`).
- Cover the happy path, edge cases (empty, one, many, boundaries), and error paths.
- Arrange, act, assert: setup, the call, the checks, in that order.
- Fast tests run on every save; slow integration tests run in CI and are marked (`@pytest.mark.slow`).
- Coverage (`pytest --cov`) tells you what is untested; 100% coverage does not mean correct.

## `unittest`

The standard-library framework, class-based, still common in older code and some companies.

```pycon
>>> import unittest
>>> class TestMath(unittest.TestCase):
...     def setUp(self):
...         self.data = [3, 1, 2]
...     def test_sorted(self):
...         self.assertEqual(sorted(self.data), [1, 2, 3])
...     def test_raises(self):
...         with self.assertRaises(ZeroDivisionError):
...             1 / 0
...
>>> suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestMath)
>>> result = unittest.TextTestRunner(verbosity=0, stream=open(__import__("os").devnull, "w")).run(suite)
>>> result.testsRun, result.wasSuccessful()
(2, True)
```

`pytest` runs `unittest` tests too, so mixing is fine. Prefer `pytest` for new work: less boilerplate, better assertions, fixtures, parametrisation, plugins.

## `doctest`

Examples in docstrings that are also tests. The examples in this book are verified this way.

```pycon
>>> def add(a, b):
...     """Add two numbers.
...
...     >>> add(2, 3)
...     5
...     """
...     return a + b
...
>>> import doctest
>>> doctest.run_docstring_examples(add, {"add": add}, verbose=False)   # prints nothing when all pass
```

Good for documentation that must stay true; not a replacement for a test suite.

## Logging, not print

`print` is for output the program is meant to produce. `logging` is for diagnostics: it has levels, can be turned up or down without code changes, includes timestamps and module names, and can go to files or external systems.

```pycon
>>> import logging, io
>>> stream = io.StringIO()
>>> logger = logging.getLogger("demo")
>>> logger.setLevel(logging.INFO)
>>> handler = logging.StreamHandler(stream)
>>> handler.setFormatter(logging.Formatter("%(levelname)s %(name)s: %(message)s"))
>>> logger.addHandler(handler)
>>> logger.debug("not shown at INFO level")
>>> logger.info("processing %d items", 3)           # lazy formatting: args are only formatted if emitted
>>> logger.warning("disk at %s%%", 91)
>>> print(stream.getvalue(), end="")
INFO demo: processing 3 items
WARNING demo: disk at 91%
```

Conventions: one logger per module (`logger = logging.getLogger(__name__)`); configure handlers once at program start (`logging.basicConfig(level=..., format=...)`); use `logger.exception("...")` inside `except` to include the traceback; never log secrets.

Levels: DEBUG < INFO < WARNING < ERROR < CRITICAL. The default threshold is WARNING, which is why `logger.info` prints nothing until configured.

## Debugging

- `breakpoint()` drops into the debugger (`pdb`) at that line: `n` next, `s` step into, `c` continue, `p expr` print, `l` list, `q` quit.
- `python -m pdb script.py` starts under the debugger; `pytest --pdb` opens it on the first failure.
- Read the traceback bottom-up; the last frame in *your* code is usually the bug.
- `repr()` and `type()` of the surprising value answer most "why" questions.
- `assert` liberally in development; `logging.debug` for state over time.

## Tooling for a professional setup

| Tool | Purpose |
|---|---|
| `black` | Formatting, no arguments about style |
| `ruff` (or `flake8` + `isort`) | Linting, import order, many auto-fixes; very fast |
| `mypy` / `pyright` | Static type checking |
| `pytest` + `pytest-cov` | Tests and coverage |
| `pre-commit` | Run the above before every commit |
| `pyproject.toml` | One config file for the project, build, and tools |
| `venv` / `uv` / `poetry` | Environments and dependency locking |
| `tox` / `nox` | Test across Python versions |
| GitHub Actions or similar | Run everything on every push |

Being able to describe this pipeline in two sentences is often the whole answer to "how do you ensure code quality".

## Interview questions

**Does Python enforce type hints?**
No. They are metadata for tools and readers. Static checkers (mypy, pyright) and IDEs use them; run-time validation needs a library or explicit checks.

**What is the difference between `list[int]` and `List[int]`?**
Same meaning; `list[int]` (3.9+) uses the built-in class and is preferred. `typing.List` is the legacy spelling.

**What is `Optional[str]`?**
`str | None`: the value may be a string or `None`. It does not mean the argument is optional in the sense of having a default.

**Why prefer `pytest` over `unittest`?**
Plain `assert` with rich failure output, fixtures with dependency injection, parametrisation, a plugin ecosystem, and less boilerplate. It also runs `unittest` tests.

**What is a fixture?**
A function that builds test dependencies (data, temp files, database connections) and is injected into tests by name; it can have setup and teardown and a scope (function, module, session).

**What is mocking and when do you mock?**
Replacing a dependency with a fake for a test, to avoid network, databases, time, or randomness and to assert how the dependency was called. Mock at boundaries; do not mock the code under test.

**Where do you patch an object?**
Where it is looked up by the code under test (the importing module's namespace), not where it is defined.

**How do you test that a function raises?**
`with pytest.raises(ValueError):` around the call, optionally with `match=` for the message; `assertRaises` in `unittest`.

**What is parametrisation?**
Running one test function with several input/expected pairs via `@pytest.mark.parametrize`, each reported separately.

**Why use `logging` instead of `print`?**
Levels, configurable destinations and formats, timestamps and module names, and the ability to silence or enable output without editing code. `print` is for program output.

**How do you debug a Python program?**
`breakpoint()`/`pdb`, IDE debuggers, reading tracebacks bottom-up, `logging.debug`, and small reproducible tests. `pytest --pdb` for failing tests.

**What is TDD?**
Write a failing test, write the minimum code to pass, refactor, repeat. Even without strict TDD, writing the test first for bug fixes ensures the bug is reproduced and stays fixed.

**What is code coverage and what does it not tell you?**
The percentage of lines or branches executed by tests. It shows what is untested; it says nothing about whether assertions are meaningful.
