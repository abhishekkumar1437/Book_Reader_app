---
title: Classes & Objects
part: Intermediate
summary: Defining classes, __init__ and self, instance versus class attributes, methods of three kinds, __repr__ and __str__, properties, privacy conventions, and the everything-is-an-object model.
---

## A class is a blueprint; an object is an instance

```pycon
>>> class Account:
...     """A bank account with a balance."""
...     def __init__(self, owner, balance=0):
...         self.owner = owner            # instance attribute
...         self.balance = balance
...     def deposit(self, amount):
...         if amount <= 0:
...             raise ValueError("deposit must be positive")
...         self.balance += amount
...         return self.balance
...
>>> acct = Account("ann", 100)
>>> acct.owner, acct.balance
('ann', 100)
>>> acct.deposit(50)
150
>>> type(acct), isinstance(acct, Account)
(<class '__main__.Account'>, True)
```

- `__init__` is the initialiser, called automatically after the object is created. It is not a constructor in the C++ sense (`__new__` creates; `__init__` fills in); you will almost never touch `__new__`.
- `self` is the instance the method was called on. Python passes it automatically: `acct.deposit(50)` is `Account.deposit(acct, 50)`. The name `self` is a convention, not a keyword.
- Attributes are created by assignment, usually in `__init__`. There is no declaration step.

```pycon
>>> Account.deposit(acct, 10)      # the explicit form of the same call
160
```

## Instance attributes versus class attributes

A **class attribute** is defined in the class body and shared by all instances. An **instance attribute** is set on `self` and belongs to one object. Lookup goes instance first, then class.

```pycon
>>> class Dog:
...     species = "Canis familiaris"       # class attribute: shared
...     count = 0
...     def __init__(self, name):
...         self.name = name                # instance attribute: per object
...         Dog.count += 1
...
>>> a, b = Dog("rex"), Dog("fido")
>>> a.species, b.species, Dog.count
('Canis familiaris', 'Canis familiaris', 2)
>>> a.species = "wolf"                      # creates an INSTANCE attribute that shadows the class one
>>> a.species, b.species, Dog.species
('wolf', 'Canis familiaris', 'Canis familiaris')
>>> a.__dict__
{'name': 'rex', 'species': 'wolf'}
```

The trap is a **mutable class attribute**: a list defined in the class body is one list shared by every instance.

```pycon
>>> class Team:
...     members = []                        # shared by all teams!
...     def add(self, name):
...         self.members.append(name)
...
>>> t1, t2 = Team(), Team()
>>> t1.add("ann")
>>> t2.members
['ann']
```

Put per-instance state in `__init__`: `self.members = []`.

## Three kinds of methods

```pycon
>>> class Temperature:
...     scale = "C"
...     def __init__(self, degrees):
...         self.degrees = degrees
...     def warmer(self, delta):                  # instance method: needs an object
...         return Temperature(self.degrees + delta)
...     @classmethod
...     def from_fahrenheit(cls, f):              # class method: receives the class; alternative constructor
...         return cls((f - 32) * 5 / 9)
...     @staticmethod
...     def is_valid(degrees):                    # static method: no self, no cls; a plain function in the namespace
...         return degrees >= -273.15
...     def __repr__(self):
...         return f"Temperature({self.degrees:.1f})"
...
>>> Temperature.from_fahrenheit(212)
Temperature(100.0)
>>> Temperature(20).warmer(5)
Temperature(25.0)
>>> Temperature.is_valid(-300), Temperature(1).is_valid(5)
(False, True)
```

Use a `classmethod` for alternative constructors (`from_json`, `from_string`) because it works correctly in subclasses (`cls` is the subclass). Use a `staticmethod` for helpers that belong with the class conceptually but need nothing from it.

## `__repr__` and `__str__`

`__repr__` is the unambiguous developer representation (what the REPL and debuggers show; ideally valid code to recreate the object). `__str__` is the readable user form used by `print` and `f"{obj}"`. If you define only one, define `__repr__`; `str` falls back to it.

```pycon
>>> class Point:
...     def __init__(self, x, y):
...         self.x, self.y = x, y
...     def __repr__(self):
...         return f"Point(x={self.x}, y={self.y})"
...     def __str__(self):
...         return f"({self.x}, {self.y})"
...
>>> p = Point(1, 2)
>>> p
Point(x=1, y=2)
>>> print(p)
(1, 2)
>>> f"{p} and {p!r}"
'(1, 2) and Point(x=1, y=2)'
>>> [p]                         # containers use repr for their elements
[Point(x=1, y=2)]
```

Without `__repr__`, you get the useless `<__main__.Point object at 0x...>`.

## Equality and hashing

By default, objects compare equal only to themselves (identity). Define `__eq__` for value equality. Defining `__eq__` sets `__hash__` to `None` (the object becomes unhashable), so if instances should be usable as dict keys, define `__hash__` too, based on the same fields, and keep those fields immutable.

```pycon
>>> class Point:
...     def __init__(self, x, y):
...         self.x, self.y = x, y
...     def __repr__(self):
...         return f"Point({self.x}, {self.y})"
...     def __eq__(self, other):
...         if not isinstance(other, Point):
...             return NotImplemented
...         return (self.x, self.y) == (other.x, other.y)
...     def __hash__(self):
...         return hash((self.x, self.y))
...
>>> Point(1, 2) == Point(1, 2), Point(1, 2) is Point(1, 2)
(True, False)
>>> len({Point(1, 2), Point(1, 2)})
1
```

Return `NotImplemented` (not `False`) for unrelated types so Python can try the other operand's `__eq__`.

## Properties

A property is a method that is accessed like an attribute. Use it to compute a value on demand, to validate on assignment, or to keep a public attribute name while changing the implementation underneath, all without changing callers.

```pycon
>>> class Circle:
...     def __init__(self, radius):
...         self.radius = radius              # goes through the setter below
...     @property
...     def radius(self):
...         return self._radius
...     @radius.setter
...     def radius(self, value):
...         if value < 0:
...             raise ValueError("radius must be non-negative")
...         self._radius = value
...     @property
...     def area(self):                        # read-only computed attribute
...         return 3.14159 * self._radius ** 2
...
>>> c = Circle(2)
>>> c.radius, round(c.area, 2)
(2, 12.57)
>>> c.radius = -1
Traceback (most recent call last):
    ...
ValueError: radius must be non-negative
>>> c.area = 5
Traceback (most recent call last):
    ...
AttributeError: property 'area' of 'Circle' object has no setter
```

Start with plain attributes; add a property only when you need behaviour. That is the opposite of the getter/setter-everything habit from Java, and interviewers ask about it.

## Privacy is a convention

Python has no `private` keyword.

- `_name`: single underscore means "internal; do not touch from outside". Nothing enforces it.
- `__name`: double underscore triggers **name mangling**: the attribute is stored as `_ClassName__name`, which prevents accidental clashes in subclasses. It is not security; it is still accessible.
- `__name__`: double underscores on both sides are **dunder** methods that Python calls (`__init__`, `__len__`); never invent your own.

```pycon
>>> class Secretive:
...     def __init__(self):
...         self._internal = 1
...         self.__mangled = 2
...
>>> s = Secretive()
>>> s._internal
1
>>> s.__mangled
Traceback (most recent call last):
    ...
AttributeError: 'Secretive' object has no attribute '__mangled'
>>> s._Secretive__mangled
2
```

## Everything is an object

Classes are objects too (instances of `type`); functions, modules, and integers all have attributes and a type. This is what makes Python's introspection and metaprogramming possible.

```pycon
>>> type(Point), type(type), type(len)
(<class 'type'>, <class 'type'>, <class 'builtin_function_or_method'>)
>>> Point.__name__, Point.__doc__ is None
('Point', True)
>>> hasattr(p, "x"), getattr(p, "z", "missing")
(True, 'missing')
>>> setattr(p, "z", 9); p.z
9
>>> sorted(k for k in vars(p))
['x', 'y', 'z']
```

`vars(obj)` (or `obj.__dict__`) is the instance's attribute dictionary. Attribute access is a dictionary lookup on the instance, then the class, then the parents; the next chapter covers that order.

## `__slots__`

Declaring `__slots__` replaces the per-instance `__dict__` with fixed storage: less memory, slightly faster attribute access, and no new attributes can be added. Use it for classes with millions of instances.

```pycon
>>> class Pixel:
...     __slots__ = ("x", "y")
...     def __init__(self, x, y):
...         self.x, self.y = x, y
...
>>> px = Pixel(1, 2)
>>> px.z = 3
Traceback (most recent call last):
    ...
AttributeError: 'Pixel' object has no attribute 'z' and no __dict__ for setting new attributes
```

## A complete small class

```python
class Stack:
    """A last-in, first-out stack."""

    def __init__(self, items=None):
        self._items = list(items) if items is not None else []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self):
        return self._items[-1] if self._items else None

    def __len__(self):
        return len(self._items)

    def __bool__(self):
        return bool(self._items)

    def __repr__(self):
        return f"Stack({self._items})"
```

```pycon
>>> s = Stack([1, 2])
>>> s.push(3); s.pop(), len(s), bool(Stack()), s
(3, 2, False, Stack([1, 2]))
```

Implementing `__len__`, `__bool__`, `__iter__`, `__getitem__` and friends makes a class behave like a built-in; the next chapter covers the full set.

## Interview questions

**What is the difference between a class and an object?**
A class defines attributes and behaviour; an object (instance) is a concrete value created from the class with its own attribute values.

**What is `self`?**
The instance on which a method was called, passed automatically as the first argument. It is how methods access and modify the object's attributes.

**What does `__init__` do? Is it a constructor?**
It initialises a newly created instance. Object creation is done by `__new__`; `__init__` sets up attributes. It is called the constructor informally.

**What is the difference between class attributes and instance attributes?**
Class attributes live on the class and are shared by all instances; instance attributes live in the instance's `__dict__`. Assigning through an instance creates an instance attribute that shadows the class one.

**What is the difference between `@staticmethod` and `@classmethod`?**
A class method receives the class (`cls`) and is used for alternative constructors and class-level behaviour; a static method receives nothing and is a plain function grouped in the class namespace.

**What is the difference between `__str__` and `__repr__`?**
`__repr__` is for developers: unambiguous, ideally code-like, used by the REPL and containers. `__str__` is for users: readable, used by `print` and `str()`. Define `__repr__` at minimum.

**How do you make instances of a class usable as dictionary keys?**
Define `__eq__` and a consistent `__hash__` based on the same immutable fields.

**What is a property and when do you use one?**
A method accessed like an attribute via `@property`. Use it for computed values, validation on set, or to keep an attribute's public name while changing its implementation.

**How does Python implement private attributes?**
It does not. A leading underscore signals "internal". A double leading underscore mangles the name to `_Class__name` to avoid clashes in subclasses; it is still accessible.

**What is `__slots__`?**
A class-level declaration of the allowed attribute names, which removes the per-instance dict, saving memory and preventing new attributes.

**What is `__dict__`?**
The dictionary holding an object's writable attributes; `vars(obj)` returns it. Classes have one too, holding methods and class attributes.

**What happens when you access an attribute that does not exist?**
`AttributeError`. `getattr(obj, name, default)` avoids it; `hasattr` tests for it.
