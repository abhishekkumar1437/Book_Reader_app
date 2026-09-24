---
title: Files & Input/Output
part: Intermediate
summary: Opening files safely with with, reading and writing text and binary data, iterating large files line by line, JSON and CSV, pathlib, and the encoding mistakes that bite in production.
---

## Opening files

`open(path, mode)` returns a file object. Always use it in a `with` block so the file is closed even if an exception occurs.

```python
with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("first line\n")
    f.write("second line\n")

with open("notes.txt", encoding="utf-8") as f:
    content = f.read()
```

```pycon
>>> import os, tempfile
>>> tmp = tempfile.mkdtemp()
>>> path = os.path.join(tmp, "notes.txt")
>>> with open(path, "w", encoding="utf-8") as f:
...     _ = f.write("first line\n")
...     _ = f.write("second line\n")
...
>>> with open(path, encoding="utf-8") as f:
...     f.read()
...
'first line\nsecond line\n'
>>> f.closed
True
```

`write` returns the number of characters written, which is why the REPL example assigns it to `_`.

### Modes

| Mode | Meaning |
|---|---|
| `"r"` | read text (default); error if missing |
| `"w"` | write text; **truncates** an existing file or creates it |
| `"a"` | append text; creates if missing |
| `"x"` | create for writing; error if it exists |
| `"rb"`, `"wb"`, `"ab"` | the same, in binary (bytes) |
| `"r+"` | read and write, no truncation |

Text modes decode bytes into `str` using an encoding; binary modes give raw `bytes`. **Always pass `encoding="utf-8"` for text files.** The default depends on the operating system's locale (on Windows it is often not UTF-8), which causes files that work on one machine to fail on another.

## Reading

```pycon
>>> with open(path, encoding="utf-8") as f:
...     f.readline()          # one line, including the newline
...     f.readline()
...     f.readline()          # empty string at end of file
...
'first line\n'
'second line\n'
''
>>> with open(path, encoding="utf-8") as f:
...     f.readlines()         # all lines as a list (loads everything into memory)
...
['first line\n', 'second line\n']
>>> with open(path, encoding="utf-8") as f:
...     [line.rstrip("\n") for line in f]      # the file object is an iterator over lines
...
['first line', 'second line']
```

**Iterate the file object directly** for large files. It reads one line at a time and never holds the whole file in memory. `f.read()` and `f.readlines()` load everything; fine for small files, dangerous for a 10 GB log.

```python
count = 0
with open("huge.log", encoding="utf-8") as f:
    for line in f:
        if "ERROR" in line:
            count += 1
```

To read in fixed-size chunks (binary files, hashing):

```python
import hashlib

def sha256_of(path, chunk_size=1 << 20):
    digest = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(chunk_size):
            digest.update(chunk)
    return digest.hexdigest()
```

## Writing

```pycon
>>> with open(path, "a", encoding="utf-8") as f:
...     _ = f.write("third line\n")
...     f.writelines(["fourth\n", "fifth\n"])       # no newlines are added for you
...
>>> with open(path, encoding="utf-8") as f:
...     print(f.read(), end="")
...
first line
second line
third line
fourth
fifth
```

`print` can write to a file too: `print("text", file=f)`. Writes are buffered; they reach the disk when the buffer fills, on `f.flush()`, or on close. That is another reason to always close (use `with`).

## `pathlib`

The modern way to handle paths. `Path` objects join with `/`, know their parts, and have read/write shortcuts.

```pycon
>>> from pathlib import Path
>>> p = Path(tmp) / "data" / "report.csv"
>>> p.suffix, p.stem, p.name, p.parent.name
('.csv', 'report', 'report.csv', 'data')
>>> p.parent.mkdir(parents=True, exist_ok=True)
>>> _ = p.write_text("id,name\n1,ann\n", encoding="utf-8")
>>> p.exists(), p.is_file(), p.read_text(encoding="utf-8").splitlines()
(True, True, ['id,name', '1,ann'])
>>> sorted(f.name for f in p.parent.glob("*.csv"))
['report.csv']
>>> p.with_suffix(".bak").name
'report.bak'
```

Other useful members: `Path.cwd()`, `Path.home()`, `.resolve()` (absolute path), `.iterdir()`, `.rglob("*.py")` (recursive), `.unlink()` (delete file), `.rename()`, `.stat().st_size`.

For operations `pathlib` lacks, `shutil` has `copy`, `copytree`, `move`, `rmtree`.

## JSON

The interchange format you will use most. `dumps`/`loads` work with strings; `dump`/`load` work with file objects.

```pycon
>>> import json
>>> record = {"id": 1, "tags": ["a", "b"], "active": True, "score": None}
>>> text = json.dumps(record)
>>> text
'{"id": 1, "tags": ["a", "b"], "active": true, "score": null}'
>>> json.loads(text) == record
True
>>> print(json.dumps({"b": 1, "a": [1, 2]}, indent=2, sort_keys=True))
{
  "a": [
    1,
    2
  ],
  "b": 1
}
>>> json.dumps({1: "x"})           # keys become strings
'{"1": "x"}'
>>> json.dumps({"when": object()})
Traceback (most recent call last):
    ...
TypeError: Object of type object is not JSON serializable
```

Only dicts, lists, strings, numbers, booleans, and `None` serialise. For other types (dates, sets, dataclasses), pass a `default=` function that converts them, or convert before dumping.

```pycon
>>> from datetime import date
>>> json.dumps({"d": date(2026, 1, 5)}, default=str)
'{"d": "2026-01-05"}'
>>> jpath = Path(tmp) / "record.json"
>>> with open(jpath, "w", encoding="utf-8") as f:
...     json.dump(record, f)
...
>>> with open(jpath, encoding="utf-8") as f:
...     json.load(f)["tags"]
...
['a', 'b']
```

## CSV

Do not split lines on commas yourself; quoted fields contain commas. Use the `csv` module, and open the file with `newline=""` as the documentation requires.

```pycon
>>> import csv
>>> cpath = Path(tmp) / "people.csv"
>>> with open(cpath, "w", newline="", encoding="utf-8") as f:
...     writer = csv.writer(f)
...     writer.writerow(["name", "city"])
...     writer.writerow(["Ann", "Pune, MH"])
...
11
16
>>> with open(cpath, newline="", encoding="utf-8") as f:
...     list(csv.reader(f))
...
[['name', 'city'], ['Ann', 'Pune, MH']]
>>> with open(cpath, newline="", encoding="utf-8") as f:
...     [row["city"] for row in csv.DictReader(f)]
...
['Pune, MH']
```

`writerow` returns the number of characters written (including the CR LF line ending), which is what the REPL shows. `DictReader` uses the header row as keys; `DictWriter(f, fieldnames=[...])` writes from dicts. For anything beyond basic reading, `pandas.read_csv` is the practical tool.

## Standard input and output

```python
import sys

for line in sys.stdin:                 # read until EOF; good for piped input
    print(line.rstrip().upper())

name = input("Name: ")                 # one line from the user, without the newline
print("hello", name, sep=", ", end="!\n")
print("to stderr", file=sys.stderr)
```

`input()` always returns a string; convert with `int()` and handle `ValueError`. In competitive-style problems, read all of stdin at once with `sys.stdin.read().split()` for speed.

## Binary files and encodings

```pycon
>>> bpath = Path(tmp) / "blob.bin"
>>> _ = bpath.write_bytes(bytes([0, 255, 10]))
>>> bpath.read_bytes()
b'\x00\xff\n'
>>> "café".encode("utf-8"), "café".encode("latin-1")
(b'caf\xc3\xa9', b'caf\xe9')
>>> b"caf\xc3\xa9".decode("latin-1")               # wrong codec: mojibake, not an error
'cafÃ©'
>>> b"caf\xe9".decode("utf-8")
Traceback (most recent call last):
    ...
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xe9 in position 3: unexpected end of data
>>> b"caf\xe9".decode("utf-8", errors="replace")
'caf�'
```

The rule: bytes at the boundaries (disk, network), `str` inside the program, UTF-8 to convert, and be explicit about it.

## Cleanup

```pycon
>>> import shutil
>>> shutil.rmtree(tmp)
>>> Path(tmp).exists()
False
```

## Interview questions

**Why use `with` when opening files?**
It guarantees the file is closed when the block ends, even if an exception is raised, and releases the OS handle promptly. Without it, files can stay open until garbage collection and buffered writes may be lost.

**What is the difference between `read()`, `readline()`, and `readlines()`?**
`read()` returns the whole file as one string; `readline()` returns the next line; `readlines()` returns a list of all lines. Iterating the file object gives lines lazily and is the right choice for large files.

**How do you read a large file without running out of memory?**
Iterate over the file object line by line, or read fixed-size chunks with `f.read(n)` in a loop. Never `read()` or `readlines()` a file you cannot hold in memory.

**What is the difference between `"w"` and `"a"` modes?**
`"w"` truncates the file to empty before writing; `"a"` appends to the end and keeps existing content.

**What is the difference between text and binary mode?**
Text mode decodes bytes to `str` with an encoding and translates newlines; binary mode gives raw `bytes` unchanged. Use binary for images, archives, and anything not text.

**Why specify `encoding="utf-8"`?**
The default text encoding depends on the platform locale. Being explicit makes the program behave the same everywhere and avoids `UnicodeDecodeError` on non-ASCII content.

**What is the difference between `json.dump` and `json.dumps`?**
`dumps` returns a string; `dump` writes to a file object. The same for `load`/`loads`.

**How do you serialise a `datetime` or a custom object to JSON?**
Convert it first, or pass `default=` a function that returns a serialisable value (for example `str` or `obj.__dict__`).

**Why `newline=""` when opening a CSV file?**
So the `csv` module controls line endings itself; otherwise on Windows you get blank lines between rows.

**How do you check whether a file exists before opening?**
`Path(p).exists()` or `os.path.exists(p)`. But prefer just opening it and catching `FileNotFoundError` (EAFP), which avoids the race where the file disappears between the check and the open.

**What does `pathlib` give you over `os.path`?**
Path objects with `/` joining, properties like `.name`/`.suffix`/`.parent`, and methods like `.read_text()`, `.glob()`, `.mkdir()`. Fewer string manipulations and fewer bugs.

**Where does `print` output go and how do you redirect it?**
To `sys.stdout` by default; pass `file=` to send it elsewhere, such as `sys.stderr` or an open file.
