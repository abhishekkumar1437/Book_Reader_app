---
title: Modules, Packages & the Standard Library
part: Intermediate
summary: How import works, the module search path, __name__ == "__main__", packages and relative imports, circular imports, and a tour of the standard library modules every Python developer should know.
---

## Modules

A module is a `.py` file. Importing it runs the file once and gives you an object whose attributes are the file's top-level names.

```python
# geometry.py
PI = 3.14159

def area(r):
    return PI * r * r
```

```python
import geometry
geometry.area(2)                 # 12.56636

from geometry import area, PI    # bind names directly
area(2)

import geometry as geo           # alias
from geometry import *           # everything not starting with _ ; avoid: hides where names come from
```

Prefer `import module` or `from module import name`. Star imports make it impossible to tell where a name came from, and they can overwrite your own names silently.

### Import happens once

The first import executes the module and stores it in `sys.modules`. Later imports anywhere in the program reuse that object; the code does not run again. This is why module-level state is effectively a singleton and why `importlib.reload` exists for interactive use.

```pycon
>>> import sys
>>> "json" in sys.modules
False
>>> import json
>>> "json" in sys.modules
True
>>> import json          # no re-execution
```

### Where Python looks

`sys.path` is the list of directories searched, in order: the script's directory (or the current directory in the REPL), `PYTHONPATH` entries, the standard library, and the active environment's `site-packages`.

```pycon
>>> import sys
>>> isinstance(sys.path, list)
True
>>> import json
>>> json.__file__.endswith("json" + "\\" + "__init__.py") or json.__file__.endswith("json/__init__.py")
True
```

A file named `random.py` in your project shadows the standard library's `random` because your directory is searched first. This causes confusing errors; do not name files after standard modules.

## `if __name__ == "__main__"`

Every module has a `__name__`. When a file is run directly it is `"__main__"`; when imported, it is the module's name. The idiom lets a file act as both a library and a script:

```python
# tool.py
def main():
    print("running as a script")

if __name__ == "__main__":
    main()
```

`python tool.py` prints; `import tool` does not. Tests and other modules can import `main` without side effects.

## Packages

A package is a directory of modules. Since Python 3.3 the `__init__.py` file is optional (a namespace package), but including it is still the norm; it runs when the package is imported and can define what `from package import *` exports via `__all__`.

```
myapp/
    __init__.py
    models.py
    services/
        __init__.py
        billing.py
```

```python
from myapp.models import User
from myapp.services import billing
from myapp.services.billing import charge
```

Inside a package, **relative imports** refer to siblings:

```python
# myapp/services/billing.py
from ..models import User          # two dots: parent package
from . import helpers              # one dot: same package
```

Relative imports only work when the module is imported as part of the package, not when the file is run directly; that is another reason for the `-m` form: `python -m myapp.services.billing`.

## Circular imports

Module A imports B, and B imports A. When A starts, it begins executing, hits `import B`, which starts B, which hits `import A`, which finds A in `sys.modules` **partially initialised** and continues; if B then uses a name from A that has not been defined yet, you get `ImportError: cannot import name`.

Fixes, in order of preference: restructure so the shared code lives in a third module both import; import inside the function that needs it (deferring the import to call time); import the module (`import a`) rather than names (`from a import x`) so attribute lookup happens later.

## Running modules and scripts

```
python script.py            run a file
python -m module            run a module by import name (sets up sys.path correctly for packages)
python -c "print(1+1)"      run a one-liner
python -i script.py         run, then drop into the REPL with its names
```

`__file__` is the module's path; `sys.argv` holds command-line arguments (`argv[0]` is the script name).

## The standard library tour

You do not need to memorise APIs, but you should know what exists so that you reach for the right module. These come up in interviews as "how would you..." questions.

| Module | Use it for |
|---|---|
| `os`, `os.path` | Environment variables, process info, path joining (prefer `pathlib`) |
| `pathlib` | Object-oriented paths: `Path("data") / "file.txt"`, `.exists()`, `.read_text()` |
| `sys` | `argv`, `exit`, `path`, `stdin`/`stdout`, recursion limit |
| `shutil` | Copy, move, delete files and directories |
| `json` | `dumps`/`loads` for strings, `dump`/`load` for files |
| `csv` | Reading and writing CSV with proper quoting; `DictReader` |
| `re` | Regular expressions: `search`, `match`, `findall`, `sub`, compile |
| `datetime` | `datetime`, `date`, `timedelta`, `timezone`; `strftime`/`strptime` |
| `time` | `time()`, `sleep()`, `perf_counter()` for timing |
| `math` | `sqrt`, `floor`, `ceil`, `gcd`, `isclose`, `inf`, `pi` |
| `random` | `random()`, `randint`, `choice`, `shuffle`, `sample`; seedable |
| `statistics` | `mean`, `median`, `stdev` |
| `collections` | `Counter`, `defaultdict`, `deque`, `namedtuple`, `OrderedDict` |
| `itertools` | `chain`, `product`, `permutations`, `combinations`, `groupby`, `islice`, `accumulate` |
| `functools` | `lru_cache`/`cache`, `partial`, `reduce`, `wraps`, `total_ordering` |
| `operator` | `itemgetter`, `attrgetter` for sort keys; function forms of operators |
| `heapq` | Min-heap on a list: `heappush`, `heappop`, `nlargest` |
| `bisect` | Binary search on sorted lists: `bisect_left`, `insort` |
| `enum` | `Enum`, `IntEnum`, `auto()` for named constants |
| `dataclasses` | `@dataclass` for record classes |
| `typing` | `Optional`, `Union`, `Callable`, `TypeVar`, `Protocol`, `Any` |
| `abc` | Abstract base classes: `ABC`, `abstractmethod` |
| `logging` | Structured logging with levels, handlers, formatters |
| `unittest`, `doctest` | Testing (plus third-party `pytest`) |
| `threading`, `multiprocessing`, `concurrent.futures`, `asyncio` | Concurrency (their own chapters) |
| `subprocess` | Run external commands: `run([...], capture_output=True, text=True)` |
| `argparse` | Command-line argument parsing |
| `copy` | `copy` and `deepcopy` |
| `pickle` | Serialise Python objects (not safe with untrusted data) |
| `hashlib`, `secrets`, `uuid` | Hashing, secure random tokens, UUIDs |
| `urllib.request`, `http.server` | Basic HTTP client and server (third-party `requests` is nicer) |
| `sqlite3` | Built-in SQL database |
| `decimal`, `fractions` | Exact decimal and rational arithmetic |
| `string` | `ascii_letters`, `digits`, `punctuation` |
| `textwrap`, `pprint` | Wrapping text, pretty-printing nested data |

A few in action:

```pycon
>>> from pathlib import Path
>>> p = Path("reports") / "q3" / "summary.txt"
>>> p.name, p.suffix, p.parent.name, p.with_suffix(".md").name
('summary.txt', '.txt', 'q3', 'summary.md')
>>> import json
>>> data = json.loads('{"a": [1, 2], "b": null}')
>>> data
{'a': [1, 2], 'b': None}
>>> json.dumps(data, sort_keys=True)
'{"a": [1, 2], "b": null}'
>>> import re
>>> re.findall(r"\d+", "a1b22c333")
['1', '22', '333']
>>> re.sub(r"\s+", " ", "too   many    spaces")
'too many spaces'
>>> m = re.search(r"(\w+)@(\w+)\.com", "mail ann@example.com now")
>>> m.group(0), m.group(1), m.groups()
('ann@example.com', 'ann', ('ann', 'example'))
>>> from datetime import datetime, timedelta, date
>>> d = datetime(2026, 9, 24, 10, 30)
>>> (d + timedelta(days=7)).strftime("%Y-%m-%d %H:%M")
'2026-10-01 10:30'
>>> datetime.strptime("2026-01-05", "%Y-%m-%d").date() == date(2026, 1, 5)
True
>>> import itertools
>>> list(itertools.combinations("abc", 2))
[('a', 'b'), ('a', 'c'), ('b', 'c')]
>>> list(itertools.permutations([1, 2], 2))
[(1, 2), (2, 1)]
>>> list(itertools.accumulate([1, 2, 3, 4]))
[1, 3, 6, 10]
>>> [(k, list(g)) for k, g in itertools.groupby("aabbbc")]
[('a', ['a', 'a']), ('b', ['b', 'b', 'b']), ('c', ['c'])]
>>> from operator import itemgetter
>>> sorted([("b", 2), ("a", 1)], key=itemgetter(1))
[('a', 1), ('b', 2)]
>>> import random
>>> random.seed(1)
>>> random.randint(1, 6) in range(1, 7)
True
>>> import math
>>> math.gcd(12, 18), math.ceil(2.1), math.floor(-2.1), math.isclose(1.0, 1.0000000001)
(6, 3, -3, True)
>>> from enum import Enum, auto
>>> class Color(Enum):
...     RED = auto()
...     GREEN = auto()
...
>>> Color.RED, Color.RED.name, Color.RED.value, Color["GREEN"] is Color.GREEN
(<Color.RED: 1>, 'RED', 1, True)
```

`itertools.groupby` groups **consecutive** equal items only; sort first to group globally.

## Third-party packages worth naming

`requests` (HTTP), `numpy` and `pandas` (numerical and tabular data), `pytest` (testing), `black` and `ruff` (formatting and linting), `mypy` (type checking), `fastapi`, `flask`, `django` (web), `sqlalchemy` (database ORM), `pydantic` (data validation). Knowing which exists for what is enough for most interviews unless the role is specifically about one.

## Interview questions

**What is the difference between a module and a package?**
A module is a single `.py` file; a package is a directory of modules (usually with an `__init__.py`) that can be imported with dotted names.

**What does `if __name__ == "__main__":` do?**
It runs the block only when the file is executed directly, not when it is imported, so a file can be both a script and an importable library.

**What happens when you import a module twice?**
The second import returns the cached object from `sys.modules`; the module's code runs only once per process.

**How does Python find modules?**
It searches the directories in `sys.path` in order: the script's directory, `PYTHONPATH`, the standard library, and `site-packages`.

**What is a circular import and how do you fix it?**
Two modules importing each other, so one sees the other half-initialised. Fix by moving shared code to a third module, importing inside functions, or importing the module rather than names from it.

**Why is `from module import *` discouraged?**
It hides where names come from, can overwrite existing names, and makes static analysis harder.

**What is `__init__.py` for?**
It marks a directory as a regular package, runs on package import, and can define the package's public API (`__all__`) or re-export submodule names.

**What is the difference between `python script.py` and `python -m package.module`?**
`-m` runs the module by import name with the current directory on `sys.path`, so relative imports inside a package work. Running the file directly sets its own directory as the path root and breaks relative imports.

**Name some standard library modules you use often.**
`collections`, `itertools`, `functools`, `json`, `re`, `datetime`, `pathlib`, `os`, `sys`, `logging`, `dataclasses`, `typing`, `heapq`, `bisect`. Be ready to say what each is for.

**How do you serialise Python objects?**
`json` for interoperable data (dicts, lists, strings, numbers, booleans, None); `pickle` for arbitrary Python objects between trusted Python programs, never for untrusted input because unpickling can execute code.

**What is `pathlib` and why prefer it to `os.path`?**
An object-oriented path API: `/` joins paths, and methods like `.exists()`, `.read_text()`, `.glob()` live on the path object, which is clearer than string manipulation.
