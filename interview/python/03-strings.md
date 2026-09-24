---
title: Strings
part: Foundations
summary: Indexing and slicing, the methods you use daily, formatting with f-strings, immutability and why joining beats concatenating, Unicode versus bytes, and the string questions every beginner interview includes.
---

## Creating strings

```pycon
>>> a = 'single'
>>> b = "double"
>>> c = """spans
... lines"""
>>> d = "escapes: tab\tnewline\\n quote\" "
>>> e = r"raw\n strings keep backslashes"
>>> print(d)
escapes: tab	newline\n quote" 
>>> e
'raw\\n strings keep backslashes'
```

Raw strings (`r"..."`) are what you want for regular expressions and Windows paths.

## Indexing and slicing

Strings are sequences: index from 0, negative indexes count from the end, and slices take `[start:stop:step]` with `stop` excluded.

```pycon
>>> s = "python"
>>> s[0], s[-1], s[2]
('p', 'n', 't')
>>> s[1:4]        # characters 1, 2, 3
'yth'
>>> s[:2], s[2:], s[-3:]
('py', 'thon', 'hon')
>>> s[::2]        # every second character
'pto'
>>> s[::-1]       # reversed
'nohtyp'
>>> s[10]
Traceback (most recent call last):
    ...
IndexError: string index out of range
>>> s[10:20]      # slices never raise; out-of-range slices are just empty
''
```

`s[::-1]` is the standard way to reverse a string, and a common interview warm-up.

## Immutability

A string cannot be changed. Methods return new strings.

```pycon
>>> s = "hello"
>>> s[0] = "H"
Traceback (most recent call last):
    ...
TypeError: 'str' object does not support item assignment
>>> "H" + s[1:]
'Hello'
```

**Consequence for performance.** Building a string with `+=` in a loop creates a new string each time, copying everything so far: O(n²) for n pieces. Collect the pieces in a list and join once.

```python
parts = []
for i in range(5):
    parts.append(str(i))
result = ",".join(parts)          # '0,1,2,3,4'
```

`join` is a method on the *separator*, which surprises beginners: `",".join(list_of_strings)`. All items must already be strings.

## The methods you actually use

```pycon
>>> s = "  Hello, World  "
>>> s.strip(), s.lstrip(), s.rstrip()
('Hello, World', 'Hello, World  ', '  Hello, World')
>>> s.strip().lower(), s.strip().upper(), "hello world".title(), "Hello".swapcase()
('hello, world', 'HELLO, WORLD', 'Hello World', 'hELLO')
>>> "a,b,,c".split(",")
['a', 'b', '', 'c']
>>> "  one   two three ".split()          # no argument: split on any whitespace, drop empties
['one', 'two', 'three']
>>> "-".join(["a", "b", "c"])
'a-b-c'
>>> "hello".replace("l", "L"), "hello".replace("l", "L", 1)
('heLLo', 'heLlo')
>>> "hello".find("l"), "hello".find("z"), "hello".index("l")
(2, -1, 2)
>>> "hello".count("l")
2
>>> "hello".startswith("he"), "hello".endswith(("lo", "xx"))
(True, True)
>>> "42".isdigit(), "abc".isalpha(), "abc1".isalnum(), " ".isspace(), "Hello".istitle()
(True, True, True, True, True)
>>> "hello".center(11, "*"), "7".zfill(3), "ab".ljust(5, ".") 
('***hello***', '007', 'ab...')
>>> "a\nb\nc".splitlines()
['a', 'b', 'c']
>>> "key=value=x".partition("=")
('key', '=', 'value=x')
```

`find` returns −1 when missing; `index` raises `ValueError`. Use `in` when you only need a yes/no.

## Formatting

**f-strings** (Python 3.6+) are the modern way. Any expression goes inside the braces, and a format spec after a colon controls the output.

```pycon
>>> name, qty, price = "widget", 3, 4.5
>>> f"{name}: {qty} × {price:.2f} = {qty * price:.2f}"
'widget: 3 × 4.50 = 13.50'
>>> f"{1234567:,}", f"{0.256:.1%}", f"{42:08.3f}", f"{255:x}", f"{255:#b}"
('1,234,567', '25.6%', '0042.000', 'ff', '0b11111111')
>>> f"{'left':<8}|{'mid':^8}|{'right':>8}|"
'left    |  mid   |   right|'
>>> f"{name=}, {qty=}"          # debugging: prints the expression too (3.8+)
"name='widget', qty=3"
>>> f"{name!r}"                  # !r uses repr, !s uses str
"'widget'"
```

The older forms still appear in code you will read:

```pycon
>>> "{} has {} items".format(name, qty)
'widget has 3 items'
>>> "{0} {1} {0}".format("a", "b")
'a b a'
>>> "%s has %d items" % (name, qty)
'widget has 3 items'
```

## Characters and code points

Strings are sequences of Unicode characters, not bytes.

```pycon
>>> ord("A"), chr(66), ord("é")
(65, 'B', 233)
>>> len("héllo")
5
>>> "héllo".encode("utf-8")
b'h\xc3\xa9llo'
>>> len("héllo".encode("utf-8"))
6
>>> b'h\xc3\xa9llo'.decode("utf-8")
'héllo'
```

`str` is text; `bytes` is raw data. Reading from a network or a binary file gives bytes; you `decode` to get text and `encode` to send text. Mixing them is a `TypeError`. The default and correct encoding is UTF-8.

`ord` and `chr` are what you use for character arithmetic in interview problems (`ord(c) - ord("a")` gives 0 to 25 for lowercase letters).

## Iterating and membership

```pycon
>>> [c for c in "abc"]
['a', 'b', 'c']
>>> "ell" in "hello"
True
>>> list(enumerate("ab"))
[(0, 'a'), (1, 'b')]
>>> sorted("banana")
['a', 'a', 'a', 'b', 'n', 'n']
>>> "".join(sorted("banana"))
'aaabnn'
```

`sorted` on a string gives a list of characters; join it back to get a string. `"".join(sorted(s))` is the standard anagram key.

## Classic beginner string problems

**Reverse a string**

```pycon
>>> s = "interview"
>>> s[::-1]
'weivretni'
>>> "".join(reversed(s))
'weivretni'
```

**Palindrome check (ignore case and non-letters)**

```python
def is_palindrome(s: str) -> bool:
    cleaned = "".join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]
```

```pycon
>>> is_palindrome("A man, a plan, a canal: Panama"), is_palindrome("hello")
(True, False)
```

**Count characters**

```pycon
>>> from collections import Counter
>>> Counter("mississippi").most_common(2)
[('i', 4), ('s', 4)]
```

**Anagram check**

```pycon
>>> sorted("listen") == sorted("silent")
True
>>> Counter("listen") == Counter("silent")
True
```

**First non-repeating character**

```python
def first_unique(s: str) -> str | None:
    counts = Counter(s)
    for c in s:
        if counts[c] == 1:
            return c
    return None
```

```pycon
>>> first_unique("swiss"), first_unique("aabb")
('w', None)
```

**Reverse words**

```pycon
>>> " ".join("the quick brown fox".split()[::-1])
'fox brown quick the'
```

**Compress runs (aabccc → a2b1c3)**

```python
def compress(s: str) -> str:
    out = []
    i = 0
    while i < len(s):
        j = i
        while j < len(s) and s[j] == s[i]:
            j += 1
        out.append(f"{s[i]}{j - i}")
        i = j
    return "".join(out)
```

```pycon
>>> compress("aabccc")
'a2b1c3'
```

**Check if a string is a number**

```pycon
>>> "42".isdigit(), "-42".isdigit(), "4.2".isdigit()
(True, False, False)
>>> def is_number(s):
...     try:
...         float(s)
...         return True
...     except ValueError:
...         return False
...
>>> is_number("-4.2e3"), is_number("abc")
(True, False)
```

`isdigit` handles only unsigned integers; for anything else, try the conversion.

## Interview questions

**Are strings mutable in Python?**
No. Every operation returns a new string. To "modify" a string you build a new one, typically via slicing, `replace`, or joining a list of pieces.

**Why is `"".join(parts)` preferred over `+=` in a loop?**
Each `+=` copies the whole string so far, giving quadratic time. `join` computes the total size once and copies each piece once: linear.

**How do you reverse a string?**
`s[::-1]`. Also `"".join(reversed(s))`. There is no `s.reverse()` because strings are immutable.

**What is the difference between `find` and `index`?**
Both return the position of a substring; `find` returns −1 if absent, `index` raises `ValueError`.

**What is the difference between `str` and `bytes`?**
`str` is Unicode text; `bytes` is a sequence of integers 0 to 255. Convert with `encode` and `decode`, normally with UTF-8. They cannot be mixed in operations.

**What does `split()` without arguments do?**
Splits on runs of any whitespace and discards empty strings, unlike `split(" ")`, which splits on single spaces and keeps empties.

**How do you check whether two strings are anagrams?**
Compare sorted characters, or compare `Counter` objects. Sorting is O(n log n); counting is O(n).

**What are f-strings and why use them?**
String literals prefixed with `f` that evaluate expressions inside `{}` at run time, with format specs after a colon. They are faster and more readable than `%` and `.format`.

**How do you check if a string contains only digits?**
`s.isdigit()` for unsigned integers; for general numbers, attempt `float(s)` and catch `ValueError`.

**What is string interning?**
CPython reuses one object for identical short or identifier-like string literals, so `"abc" is "abc"` may be `True`. It is an optimisation, not a guarantee; compare strings with `==`.

**How do `ord` and `chr` relate?**
`ord` gives a character's Unicode code point; `chr` gives the character for a code point. They are inverses and are used for character arithmetic.
