---
title: Getting Started
part: Foundations
summary: How Python runs your code, the REPL versus scripts, setting up a clean environment with venv and pip, the style rules that matter, and how to use this book to learn and to revise for interviews.
---

## What Python is, in one paragraph

Python is a high-level, general-purpose language designed to be readable. You write instructions in a text file, and a program called the **interpreter** reads them and executes them line by line. There is no separate compile step you have to run. Python is **dynamically typed** (a variable can hold a number now and a string later), **garbage collected** (you do not free memory by hand), and comes with a large standard library so most everyday tasks need no extra packages.

The version you want is Python 3 (3.10 or newer). Python 2 is dead; if an interview mentions it, the expected answer is "Python 3 is the only version in use today".

## Two ways to run code

**The REPL** (read, evaluate, print, loop) is an interactive prompt. Type an expression, see the result immediately. Start it by running `python` (or `python3`) in a terminal. It is the fastest way to try something out, and this book shows most examples in this form: lines starting with `>>>` are what you type, the lines after are what Python prints.

```pycon
>>> 2 + 3
5
>>> name = "Ada"
>>> name.upper()
'ADA'
>>> print("Hello,", name)
Hello, Ada
```

Notice the difference between the two kinds of output. `name.upper()` shows `'ADA'` with quotes because the REPL is showing you the **value** of the expression (its representation). `print` shows `Hello, Ada` without quotes because `print` writes the **text** to the screen. In a script, only `print` produces output; bare expressions print nothing.

**A script** is a file ending in `.py`. Run it with `python hello.py`. Everything in the file executes top to bottom.

```python
# hello.py
name = "Ada"
print("Hello,", name)
```

Exit the REPL with `exit()` or Ctrl-D (Ctrl-Z then Enter on Windows).

## Setting up a project

Each project should have its own **virtual environment**: a private copy of the interpreter's package folder, so that project A's libraries do not interfere with project B's.

```
python -m venv .venv            # create it (once)
.venv\Scripts\activate          # Windows
source .venv/bin/activate       # macOS / Linux
pip install requests            # install a package into this environment only
pip freeze > requirements.txt   # record what is installed
pip install -r requirements.txt # recreate on another machine
deactivate                      # leave the environment
```

`pip` is the package installer; it downloads from the Python Package Index (PyPI). In interviews, "how do you manage dependencies?" wants: virtual environments plus a requirements file (or a tool such as Poetry or uv that does both).

## Indentation is syntax

Python uses indentation to define blocks, where other languages use braces. Four spaces per level is the standard. Mixing tabs and spaces is an error. This is the first thing that trips up beginners coming from other languages, and it is deliberate: the code's visual structure and its logical structure cannot disagree.

```python
if True:
    print("inside the block")
    print("still inside")
print("outside")
```

A colon ends the line that opens a block (`if`, `for`, `def`, `class`, `while`, `with`, `try`).

## Comments and docstrings

```python
# This is a comment. Python ignores it.

def area(radius):
    """Return the area of a circle. This is a docstring: documentation attached to the function."""
    return 3.14159 * radius ** 2
```

Docstrings are the first statement in a function, class, or module, and tools (and `help(area)`) can read them. Comments explain *why*; code should already say *what*.

## Style: PEP 8

PEP 8 is the official style guide. The parts everyone follows:

- `snake_case` for variables and functions, `PascalCase` for classes, `UPPER_CASE` for constants.
- Four-space indentation, lines under 79 (or 88 to 100 in many teams) characters.
- Spaces around operators (`x = a + b`), none inside brackets (`f(x)`).
- Two blank lines before top-level functions and classes.
- Imports at the top, one per line, standard library first.

Tools do this for you: `black` formats, `ruff` or `flake8` lint. Mention them in an interview when asked about code quality.

## The Zen of Python

Type `import this` in the REPL. It prints twenty aphorisms; the ones interviewers quote are "Explicit is better than implicit", "Simple is better than complex", "Readability counts", and "There should be one obvious way to do it". They summarise what "Pythonic" means: clear, direct code that uses the language's built-in idioms rather than fighting them.

## Getting help

```pycon
>>> help(len)              # documentation for a function (press q to leave)
Help on built-in function len in module builtins:
...
>>> dir("abc")             # everything a string can do
[...]
>>> type(3.5)
<class 'float'>
```

`type()` tells you what something is. `dir()` lists what it can do. `help()` explains it. These three cover most "how do I..." moments.

## How to use this book

Each chapter teaches one area, from the ground up, and ends with **Interview questions**: the questions actually asked about that topic, with answers you can say out loud. Read a chapter, type the examples yourself (do not copy-paste; the typing is where memory forms), then cover the answers and try the questions.

The last chapters are a question bank and a set of "what does this print?" puzzles that collect the tricky behaviour from the whole book. Use them to revise the week before an interview.

Code shown as `>>>` is the REPL; code without prompts is a script. Every example in this book has been executed, and the output shown is the real output.

## Interview questions

**What is Python? What kind of language is it?**
A high-level, interpreted, dynamically typed, garbage-collected, general-purpose language that supports multiple styles: procedural, object-oriented, and functional. Its design goal is readability.

**Is Python compiled or interpreted?**
Both, in a sense. CPython (the standard implementation) compiles source to **bytecode** (the `.pyc` files in `__pycache__`), then a virtual machine interprets the bytecode. You never run a compile step by hand, so it is called an interpreted language.

**What is the difference between Python 2 and 3?**
Python 3 made `print` a function, made all strings Unicode, made integer division return a float (`/`) with `//` for floor division, and cleaned up many inconsistencies. Python 2 reached end of life in 2020. Everything new is Python 3.

**What is PEP 8?**
The official style guide: naming conventions, indentation, line length, spacing. Following it makes code look like everyone else's Python, which makes it easier to read. Formatters like Black apply most of it automatically.

**What is a virtual environment and why use one?**
An isolated set of installed packages tied to one project, so different projects can use different versions of the same library without conflict, and so a project's dependencies can be recorded and reproduced.

**What does `pip` do?**
Installs packages from PyPI (or other indexes) into the active environment; `pip freeze` lists installed packages with versions so they can be pinned in a requirements file.

**What is the difference between the REPL showing `'ADA'` and `print` showing `ADA`?**
The REPL displays the `repr` of an expression's value (quotes mark it as a string). `print` writes the `str` form, the human-readable text. The difference between `repr` and `str` comes back in the classes chapter.

**Why does Python use indentation instead of braces?**
To make the visual structure of code match its logical structure; you cannot write code that looks like it does one thing and does another. It is enforced, not optional.

**What is "Pythonic" code?**
Code that uses Python's idioms naturally: iteration with `for` over sequences instead of index loops, comprehensions, unpacking, context managers, built-in functions, and clear names. The rest of this book is largely a catalogue of those idioms.
