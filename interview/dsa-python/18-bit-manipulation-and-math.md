---
title: Bit Manipulation & Math
part: Core Patterns
summary: The eight bit tricks that cover nearly every bit question, XOR problems, counting bits, and the small set of number-theory facts interviews actually use.
---

## Why interviewers love this pattern

Bit questions are short to state, have elegant O(1)-space answers, and expose whether you understand how integers are represented. They are usually asked as warm-ups or as the "can you do it without extra memory?" follow-up to a hashing solution. You do not need to be a wizard; you need a small bag of tricks and the habit of thinking in binary when a problem mentions "without extra space", "single number", "power of two", or "count bits".

## The tricks

| Trick | Expression | What it does |
|---|---|---|
| test bit k | `(x >> k) & 1` | 1 if bit k is set |
| set bit k | `x \| (1 << k)` | |
| clear bit k | `x & ~(1 << k)` | |
| toggle bit k | `x ^ (1 << k)` | |
| lowest set bit | `x & -x` | isolates the rightmost 1 |
| clear lowest set bit | `x & (x - 1)` | used to count bits |
| is power of two | `x > 0 and x & (x - 1) == 0` | exactly one bit set |
| XOR properties | `a ^ a == 0`, `a ^ 0 == a`, commutative | cancels pairs |

Python integers are arbitrary precision, so there is no overflow, and negative numbers behave as if they had infinitely many leading 1s. When a problem assumes 32-bit behaviour (bit reversal, two's complement), mask with `& 0xFFFFFFFF` and convert back at the end.

```python
bin(10)            # '0b1010'
int("1010", 2)     # 10
(10).bit_count()   # 2  (Python 3.10+)
bin(10).count("1") # 2  (older versions)
(10).bit_length()  # 4
```

## Worked problem 1: Single number (XOR)

**Problem.** Every element appears twice except one. Find it in O(n) time, O(1) space.

XOR cancels pairs, so XOR-ing everything leaves the single element.

```python
def single_number(nums: list[int]) -> int:
    result = 0
    for x in nums:
        result ^= x
    return result
```

**Single Number III** (two elements appear once, the rest twice). XOR everything to get `a ^ b`. Any set bit in that result distinguishes `a` from `b`; split the array by that bit and XOR each group.

```python
def single_number_iii(nums: list[int]) -> list[int]:
    xor_all = 0
    for x in nums:
        xor_all ^= x
    diff_bit = xor_all & -xor_all              # lowest bit where a and b differ
    a = 0
    for x in nums:
        if x & diff_bit:
            a ^= x                             # group with the bit set contains exactly one of them
    return [a, a ^ xor_all]
```

**Single Number II** (others appear three times). Count each bit position mod 3. O(32·n).

```python
def single_number_ii(nums: list[int]) -> int:
    result = 0
    for b in range(32):
        count = sum((x >> b) & 1 for x in nums)
        if count % 3:
            result |= (1 << b)
    if result >= 2**31:                        # interpret as signed 32-bit
        result -= 2**32
    return result
```

## Worked problem 2: Number of 1 bits, and counting bits for all numbers

`x & (x - 1)` clears the lowest set bit, so the loop runs once per set bit.

```python
def hamming_weight(n: int) -> int:
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count
```

**Counting Bits** (bit count for every number from 0 to n) in O(n): `bits[i] = bits[i >> 1] + (i & 1)`, or `bits[i] = bits[i & (i - 1)] + 1`.

```python
def count_bits(n: int) -> list[int]:
    bits = [0] * (n + 1)
    for i in range(1, n + 1):
        bits[i] = bits[i >> 1] + (i & 1)
    return bits
```

## Worked problem 3: Missing number

Numbers 0..n with one missing. Sum formula or XOR; both O(n), O(1).

```python
def missing_number(nums: list[int]) -> int:
    n = len(nums)
    return n * (n + 1) // 2 - sum(nums)

def missing_number_xor(nums: list[int]) -> int:
    result = len(nums)
    for i, x in enumerate(nums):
        result ^= i ^ x
    return result
```

## Worked problem 4: Reverse bits (32-bit)

```python
def reverse_bits(n: int) -> int:
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result
```

## Worked problem 5: Sum of two integers without + or −

Add with XOR (sum without carries) and AND-shift (carries), repeat until no carry. In Python, mask to 32 bits so negatives terminate.

```python
def get_sum(a: int, b: int) -> int:
    MASK = 0xFFFFFFFF
    MAX_INT = 0x7FFFFFFF
    while b:
        carry = ((a & b) << 1) & MASK
        a = (a ^ b) & MASK
        b = carry
    return a if a <= MAX_INT else ~(a ^ MASK)     # convert back to signed
```

Be ready to explain the two lines: XOR is addition without carry, AND shifted left is the carry.

## Worked problem 6: Subsets by bitmask, and bitmask DP

Every subset of n items maps to an n-bit integer. Iterate all masks to enumerate subsets, or use masks as DP states when n ≤ 20.

```python
def subsets_by_mask(nums: list[int]) -> list[list[int]]:
    n = len(nums)
    return [[nums[i] for i in range(n) if mask >> i & 1] for mask in range(1 << n)]
```

**Bitmask DP example: minimum cost to visit all cities (Travelling Salesman, n ≤ 16).** `dp[mask][last]` = min cost to have visited the set `mask`, ending at `last`.

```python
def tsp(dist: list[list[int]]) -> int:
    n = len(dist)
    INF = float("inf")
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0                                       # start at city 0
    for mask in range(1 << n):
        for last in range(n):
            if dp[mask][last] == INF or not (mask >> last & 1):
                continue
            for nxt in range(n):
                if mask >> nxt & 1:
                    continue
                new_mask = mask | (1 << nxt)
                cost = dp[mask][last] + dist[last][nxt]
                if cost < dp[new_mask][nxt]:
                    dp[new_mask][nxt] = cost
    full = (1 << n) - 1
    return min(dp[full][last] + dist[last][0] for last in range(n))
```

O(2ⁿ · n²). The pattern appears in *Shortest Path Visiting All Nodes*, *Partition to K Equal Sum Subsets* (feasibility over masks), and *Minimum XOR Sum of Two Arrays*.

## Math that actually comes up

### Greatest common divisor

```python
from math import gcd

def gcd_manual(a: int, b: int) -> int:
    while b:
        a, b = b, a % b
    return a

lcm = a * b // gcd(a, b)
```

Used in *Fraction problems*, *Water and Jug Problem* (target reachable iff it divides gcd), *Ugly Number*.

### Fast exponentiation

Square and multiply, O(log n). Python's built-in `pow(base, exp, mod)` does this with a modulus.

```python
def my_pow(x: float, n: int) -> float:
    if n < 0:
        x, n = 1 / x, -n
    result = 1.0
    while n:
        if n & 1:
            result *= x
        x *= x
        n >>= 1
    return result
```

### Primes: sieve of Eratosthenes

Count or list primes below n in O(n log log n).

```python
def count_primes(n: int) -> int:
    if n < 3:
        return 0
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n, i):        # start at i*i: smaller multiples were marked already
                is_prime[j] = False
    return sum(is_prime)
```

### Modular arithmetic

When answers must be reported mod 10⁹+7, take the mod after every addition and multiplication to keep numbers small. Division needs the modular inverse: `pow(a, MOD - 2, MOD)` when MOD is prime.

### Integer overflow questions

*Reverse Integer* and *String to Integer (atoi)* test 32-bit overflow handling. Python will not overflow, so check the bounds explicitly:

```python
def reverse(x: int) -> int:
    sign = -1 if x < 0 else 1
    result = sign * int(str(abs(x))[::-1])
    return result if -2**31 <= result <= 2**31 - 1 else 0
```

### Random sampling: reservoir and shuffle

**Reservoir sampling** picks a uniformly random element from a stream of unknown length: keep the i-th element with probability 1/i.

```python
import random

def reservoir_pick(stream) -> int:
    chosen = None
    for i, x in enumerate(stream, start=1):
        if random.randrange(i) == 0:
            chosen = x
    return chosen
```

**Fisher-Yates shuffle** produces a uniform random permutation in O(n): for `i` from n−1 down to 1, swap `i` with a random index in `[0, i]`. (`random.shuffle` does this.)

### Geometry basics

Two points on the same line as `(x1, y1)` and `(x2, y2)`: use cross-multiplication `(y2 − y1) * (x3 − x1) == (y3 − y1) * (x2 − x1)` to avoid floating-point slopes. Store slopes as reduced fractions `(dy // g, dx // g)` with sign normalised when hashing (*Max Points on a Line*).

### Matrix tricks

- **Rotate an image 90° clockwise**: transpose, then reverse each row.
- **Spiral order**: shrink four boundaries (top, bottom, left, right).
- **Set matrix zeroes in O(1) space**: use the first row and column as markers.

```python
def rotate(matrix: list[list[int]]) -> None:
    n = len(matrix)
    for r in range(n):
        for c in range(r + 1, n):
            matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]     # transpose
    for row in matrix:
        row.reverse()
```

## Common mistakes

- **Forgetting Python integers are unbounded** when the problem assumes 32-bit. Mask and convert.
- **Operator precedence.** `&`, `|`, `^` bind *looser* than `==` and comparison operators in Python. Write `(x & 1) == 1`, not `x & 1 == 1`.
- **Using `x % 2` on negatives** expecting the sign to carry. Python gives a non-negative remainder; use `& 1` for the low bit.
- **Off-by-one in sieve ranges.** Start marking at `i * i`, go up to `n` exclusive.
- **Floating-point comparison** in geometry. Use integers and cross-multiplication.

## Practice set

**Easy**

- Single Number
- Number of 1 Bits
- Counting Bits
- Missing Number
- Reverse Bits
- Power of Two
- Hamming Distance
- Reverse Integer
- Palindrome Number

**Medium**

- Single Number II, Single Number III
- Sum of Two Integers
- Subsets (bitmask version)
- Bitwise AND of Numbers Range
- Count Primes
- Pow(x, n)
- Rotate Image, Spiral Matrix, Set Matrix Zeroes
- Random Pick Index (reservoir sampling)
- Shuffle an Array
- Fraction to Recurring Decimal

**Hard**

- Max Points on a Line
- Shortest Path Visiting All Nodes (bitmask BFS)
- Minimum XOR Sum of Two Arrays

Next: the cheat sheet that maps problem wording to the pattern you should reach for.
