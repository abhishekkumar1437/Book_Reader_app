---
title: Inheritance, Polymorphism & Dunder Methods
part: Intermediate
summary: Subclassing and super(), method resolution order and multiple inheritance, abstract base classes, duck typing, composition versus inheritance, dataclasses, and the special methods that make your objects behave like built-ins.
---

## Inheritance

A subclass reuses and extends a parent class. It inherits every attribute and method and can override or add.

```pycon
>>> class Animal:
...     def __init__(self, name):
...         self.name = name
...     def speak(self):
...         return "..."
...     def describe(self):
...         return f"{self.name} says {self.speak()}"
...
>>> class Dog(Animal):
...     def speak(self):                       # override
...         return "woof"
...
>>> class Puppy(Dog):
...     def __init__(self, name, age_weeks):
...         super().__init__(name)             # run the parent's initialiser first
...         self.age_weeks = age_weeks
...     def speak(self):
...         return super().speak() + " (squeaky)"     # extend rather than replace
...
>>> Puppy("rex", 8).describe()
'rex says woof (squeaky)'
>>> issubclass(Puppy, Animal), isinstance(Puppy("a", 1), Dog)
(True, True)
```

`describe` is defined once in `Animal` but calls `self.speak()`, which resolves to the subclass's version at run time. That is **polymorphism**: the same call does different things depending on the object's type.

`super()` returns a proxy that delegates to the next class in the method resolution order. Always use it (rather than naming the parent explicitly) so that multiple inheritance works.

## Method resolution order

With multiple inheritance, Python must decide where to look first. The **MRO** is a linearisation of the class hierarchy (the C3 algorithm): each class before its parents, parents in the order listed, and every class appearing once.

```pycon
>>> class A:
...     def who(self):
...         return "A"
...
>>> class B(A):
...     def who(self):
...         return "B>" + super().who()
...
>>> class C(A):
...     def who(self):
...         return "C>" + super().who()
...
>>> class D(B, C):
...     pass
...
>>> [k.__name__ for k in D.__mro__]
['D', 'B', 'C', 'A', 'object']
>>> D().who()
'B>C>A'
```

Notice `B.who` called `super().who()` and got `C`, not `A`. `super()` means "next in the MRO of the *instance's* class", not "my parent". This is what makes cooperative multiple inheritance work, and it is why every class in a chain should call `super().__init__()` and accept `**kwargs` if the chain is deep.

The diamond above is the classic interview drawing. Say: "D, B, C, A, object; C3 linearisation; super follows the MRO."

## Mixins

A mixin is a small class that adds one capability and is meant to be combined, not instantiated. Multiple inheritance is mostly used this way.

```pycon
>>> class JsonMixin:
...     def to_json(self):
...         import json
...         return json.dumps(vars(self))
...
>>> class User(JsonMixin):
...     def __init__(self, name):
...         self.name = name
...
>>> User("ann").to_json()
'{"name": "ann"}'
```

## Abstract base classes

An ABC declares methods that subclasses must implement. Instantiating an incomplete subclass fails immediately, rather than at the first missing call.

```pycon
>>> from abc import ABC, abstractmethod
>>> class Shape(ABC):
...     @abstractmethod
...     def area(self):
...         ...
...     def describe(self):
...         return f"{type(self).__name__} with area {self.area():.1f}"
...
>>> class Square(Shape):
...     def __init__(self, side):
...         self.side = side
...     def area(self):
...         return self.side ** 2
...
>>> Square(3).describe()
'Square with area 9.0'
>>> Shape()
Traceback (most recent call last):
    ...
TypeError: Can't instantiate abstract class Shape without an implementation for abstract method 'area'
```

`collections.abc` provides ready-made ABCs (`Iterable`, `Sequence`, `Mapping`) that also give you free methods when you implement the required ones: subclass `Sequence`, define `__getitem__` and `__len__`, and you get `__contains__`, `__iter__`, `index`, `count`.

## Duck typing and protocols

Python does not require inheritance for polymorphism. If an object has the methods you call, it works: "if it walks like a duck and quacks like a duck". `len()` works on anything with `__len__`; `for` works on anything with `__iter__`. Interfaces are implicit.

```pycon
>>> class Duck:
...     def speak(self):
...         return "quack"
...
>>> class Robot:
...     def speak(self):
...         return "beep"
...
>>> [thing.speak() for thing in (Duck(), Robot())]
['quack', 'beep']
```

For static checking, `typing.Protocol` names such an implicit interface without requiring inheritance:

```python
from typing import Protocol

class Speaker(Protocol):
    def speak(self) -> str: ...

def announce(s: Speaker) -> str:      # any object with speak() satisfies this
    return s.speak().upper()
```

Prefer checking behaviour (`hasattr`, try/except) or a Protocol to `isinstance` chains.

## Composition over inheritance

Inheritance says "is a". Composition says "has a": the object holds another object and delegates to it. Composition is more flexible (swap the part at run time, combine several) and avoids fragile deep hierarchies. Reach for inheritance when there is a genuine is-a relationship and shared behaviour; reach for composition when you just want to reuse functionality.

```pycon
>>> class Engine:
...     def start(self):
...         return "vroom"
...
>>> class Car:
...     def __init__(self, engine):
...         self.engine = engine            # has an Engine
...     def start(self):
...         return self.engine.start()
...
>>> Car(Engine()).start()
'vroom'
```

## Dataclasses

For classes that are mostly data, `@dataclass` writes `__init__`, `__repr__`, `__eq__` (and optionally ordering and hashing) from the field declarations.

```pycon
>>> from dataclasses import dataclass, field
>>> @dataclass
... class Item:
...     name: str
...     price: float
...     tags: list[str] = field(default_factory=list)      # never a bare mutable default
...     def total(self, qty):
...         return self.price * qty
...
>>> a = Item("pen", 1.5)
>>> a
Item(name='pen', price=1.5, tags=[])
>>> a == Item("pen", 1.5), a.total(4)
(True, 6.0)
>>> @dataclass(frozen=True, order=True)
... class Version:
...     major: int
...     minor: int
...
>>> sorted([Version(1, 2), Version(0, 9)]), hash(Version(1, 0)) == hash(Version(1, 0))
([Version(major=0, minor=9), Version(major=1, minor=2)], True)
>>> v = Version(1, 0)
>>> v.major = 2
Traceback (most recent call last):
    ...
dataclasses.FrozenInstanceError: cannot assign to field 'major'
```

`frozen=True` makes instances immutable and hashable; `order=True` adds comparisons field by field. Dataclasses replace most uses of `namedtuple` and hand-written boilerplate.

## Dunder (special) methods

Special methods let your objects plug into Python's syntax and built-ins. You never call them directly; Python does when you use the corresponding operation.

| You write | Python calls |
|---|---|
| `len(x)` | `x.__len__()` |
| `x[i]`, `x[i] = v`, `del x[i]` | `__getitem__`, `__setitem__`, `__delitem__` |
| `for item in x` | `__iter__` (then `__next__` on the iterator) |
| `item in x` | `__contains__` (falls back to iteration) |
| `x + y`, `x * n` | `__add__`, `__mul__` (and `__radd__` when the left operand does not know how) |
| `x == y`, `x < y` | `__eq__`, `__lt__` (`functools.total_ordering` fills in the rest) |
| `bool(x)`, `if x:` | `__bool__`, else `__len__` |
| `str(x)`, `repr(x)`, `f"{x:spec}"` | `__str__`, `__repr__`, `__format__` |
| `x()` | `__call__` |
| `with x:` | `__enter__`, `__exit__` |
| `x.attr` (missing) | `__getattr__` |
| `hash(x)` | `__hash__` |

A vector class that supports arithmetic, comparison, indexing, and iteration:

```pycon
>>> class Vector:
...     def __init__(self, *components):
...         self._c = tuple(components)
...     def __repr__(self):
...         return f"Vector{self._c}"
...     def __len__(self):
...         return len(self._c)
...     def __getitem__(self, i):
...         return self._c[i]
...     def __iter__(self):
...         return iter(self._c)
...     def __eq__(self, other):
...         return isinstance(other, Vector) and self._c == other._c
...     def __add__(self, other):
...         return Vector(*(a + b for a, b in zip(self._c, other._c)))
...     def __mul__(self, k):
...         return Vector(*(a * k for a in self._c))
...     def __rmul__(self, k):                 # for 3 * v, when int.__mul__ returns NotImplemented
...         return self * k
...     def __abs__(self):
...         return sum(a * a for a in self._c) ** 0.5
...     def __bool__(self):
...         return any(self._c)
...
>>> v = Vector(3, 4)
>>> v + Vector(1, 1), 2 * v, v * 2, abs(v), len(v), v[0], list(v)
(Vector(4, 5), Vector(6, 8), Vector(6, 8), 5.0, 2, 3, [3, 4])
>>> bool(Vector(0, 0)), Vector(1, 2) == Vector(1, 2), 3 in v
(False, True, True)
```

`3 in v` works without `__contains__` because Python falls back to iterating. `2 * v` needs `__rmul__` because `int.__mul__` does not know about `Vector` and returns `NotImplemented`, so Python tries the reflected method.

## `__getattr__` and `__getattribute__`

`__getattr__` is called only when normal lookup fails; use it for proxies and lazy attributes. `__getattribute__` is called for **every** attribute access and is easy to break (infinite recursion if you access `self.anything` inside it); avoid it unless you know why you need it.

```pycon
>>> class Config:
...     def __init__(self, data):
...         self._data = data
...     def __getattr__(self, name):
...         try:
...             return self._data[name]
...         except KeyError:
...             raise AttributeError(name) from None
...
>>> cfg = Config({"host": "localhost"})
>>> cfg.host
'localhost'
>>> cfg.port
Traceback (most recent call last):
    ...
AttributeError: port
```

## `isinstance` versus `type`

```pycon
>>> class Base: pass
>>> class Child(Base): pass
>>> c = Child()
>>> isinstance(c, Base), type(c) is Base, type(c) is Child
(True, False, True)
```

`isinstance` respects inheritance and is what you want almost always. Comparing `type(x) is Cls` excludes subclasses and is rarely correct.

## Interview questions

**What is inheritance and what is polymorphism?**
Inheritance lets a class reuse and extend another's attributes and methods. Polymorphism means the same operation behaves according to the object's actual type, typically via overridden methods called through a common interface.

**What does `super()` do?**
Returns a proxy that dispatches to the next class in the instance's MRO, so an overriding method can call the inherited version without naming the parent. It is essential for cooperative multiple inheritance.

**What is the MRO?**
The method resolution order: the ordered list of classes Python searches for an attribute, computed by C3 linearisation. `Cls.__mro__` or `Cls.mro()` shows it. In a diamond `D(B, C)` with both inheriting `A`, it is D, B, C, A, object.

**Does Python support multiple inheritance? What are the risks?**
Yes. Risks are ambiguity and fragile chains; the MRO resolves ambiguity deterministically, and using `super()` consistently keeps chains cooperative. Mixins are the common safe use.

**What is an abstract base class?**
A class with `@abstractmethod`s that cannot be instantiated until a subclass implements them all. It documents and enforces an interface. `abc.ABC` is the base.

**What is duck typing?**
Relying on an object's behaviour (the methods it has) rather than its type. If it has `read()`, treat it as a file. Python's built-ins work this way through special methods.

**Composition or inheritance: which do you prefer?**
Composition by default: it is more flexible and keeps classes decoupled. Inheritance when there is a true is-a relationship and behaviour to share, or when a framework expects subclassing.

**What are dunder methods?**
Methods named with double underscores on both sides (`__len__`, `__add__`) that Python calls to implement operators, built-in functions, and protocols. They let user classes behave like built-in types.

**What is the difference between `__getattr__` and `__getattribute__`?**
`__getattr__` runs only when normal lookup fails; `__getattribute__` intercepts every access and must delegate to `object.__getattribute__` to avoid infinite recursion.

**What is a dataclass?**
A class decorated with `@dataclass` that generates `__init__`, `__repr__`, `__eq__`, and optionally ordering and hashing from typed field declarations. `frozen=True` gives immutability; `field(default_factory=list)` avoids shared mutable defaults.

**What is method overloading in Python?**
Python does not support defining several methods with the same name and different signatures; the last definition wins. Use default arguments, `*args`, or `functools.singledispatch` for type-based dispatch.

**What is operator overloading?**
Defining dunder methods such as `__add__` or `__lt__` so operators work on your objects. Return `NotImplemented` for unsupported operand types so Python can try the reflected method.

**Why should you use `isinstance` instead of `type() ==`?**
`isinstance` honours subclasses and ABC registration; `type()` comparison breaks polymorphism.
