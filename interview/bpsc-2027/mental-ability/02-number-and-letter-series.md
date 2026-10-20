---
title: Number and Letter Series
part: Reasoning
summary: How to find the rule behind a number series or a letter series — differences, ratios, squares and cubes, alternating series, mixed operations, letter positions and repeating patterns — with 25 solved examples and a practice set.
---

A **series** is a list of numbers or letters that follows a hidden rule. The question asks you to find the next term, a missing term in the middle, or the one wrong term. BPSC asks number series almost every year and letter series often, at an easy-to-medium level. This chapter teaches the order in which to test rules, so you find the answer in under 30 seconds.

> **In simple words:** Every series has a rule like "add 3 each time" or "multiply by 2 and add 1". Write the gaps between the terms under the series. Nine times out of ten, the gaps show the rule.

For the same topic from the maths side, and for clocks and calendars, see [Number Series, Clocks and Calendars](/interview/quant-aptitude/number-series-clocks-and-calendars) in the Quantitative Aptitude book. This chapter goes deeper on reasoning-style series and adds letter series.

## Part A — Number series

### The checking order

Test rules in this order. Stop as soon as one fits **all** the terms.

<div class="formula">

| Step | Test | Example |
|---|---|---|
| 1 | **Differences** constant (an *arithmetic progression*, AP — a series where the same number is added each time) | 4, 9, 14, 19 (+5) |
| 2 | Differences that themselves form a pattern (**second differences**) | 1, 3, 8, 18, 35 (gaps 2, 5, 10, 17) |
| 3 | **Ratios** constant (a *geometric progression*, GP — the same number multiplies each time) | 3, 6, 12, 24 (×2) |
| 4 | **Mixed rule**: ×a + b | 4, 11, 25, 53 (×2 + 3) |
| 5 | **Squares, cubes, primes** (maybe ± 1 or ± 2) | 3, 10, 29, 66 (n³ + 2) |
| 6 | **Alternating** (two series mixed: odd places and even places) | 2, 15, 4, 12, 6, 9 |
| 7 | **Changing multiplier** (×1, ×2, ×3 …) or **Fibonacci-type** (sum of the previous two) | 7, 14, 42, 168 / 1, 1, 2, 3, 5 |

</div>

### Numbers to know by heart

Knowing these lists by sight lets you spot rules 5 and 7 instantly.

<div class="formula">

| List | Values |
|---|---|
| Squares 1–20 | 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400 |
| Cubes 1–12 | 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000, 1331, 1728 |
| Primes below 60 | 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59 |
| Factorials | 1! = 1, 2! = 2, 3! = 6, 4! = 24, 5! = 120, 6! = 720 |
| Powers of 2 | 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 |
| n(n + 1) | 2, 6, 12, 20, 30, 42, 56, 72, 90 |

</div>

A **prime number** has exactly two factors, 1 and itself (1 is not prime; 2 is the only even prime). A **factorial**, n!, is 1 × 2 × … × n.

### The difference table

<figure>
<svg viewBox="0 0 420 170" width="420" height="170" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="14">
<text x="10" y="30" fill="currentColor" stroke="none" font-size="12">Series</text>
<text x="110" y="30" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<text x="170" y="30" text-anchor="middle" fill="currentColor" stroke="none">3</text>
<text x="230" y="30" text-anchor="middle" fill="currentColor" stroke="none">8</text>
<text x="290" y="30" text-anchor="middle" fill="currentColor" stroke="none">18</text>
<text x="350" y="30" text-anchor="middle" fill="currentColor" stroke="none">35</text>
<text x="405" y="30" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">61</text>
<text x="10" y="85" fill="currentColor" stroke="none" font-size="12">1st diff</text>
<text x="140" y="85" text-anchor="middle" fill="currentColor" stroke="none">2</text>
<text x="200" y="85" text-anchor="middle" fill="currentColor" stroke="none">5</text>
<text x="260" y="85" text-anchor="middle" fill="currentColor" stroke="none">10</text>
<text x="320" y="85" text-anchor="middle" fill="currentColor" stroke="none">17</text>
<text x="378" y="85" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">26</text>
<text x="10" y="140" fill="currentColor" stroke="none" font-size="12">2nd diff</text>
<text x="170" y="140" text-anchor="middle" fill="currentColor" stroke="none">3</text>
<text x="230" y="140" text-anchor="middle" fill="currentColor" stroke="none">5</text>
<text x="290" y="140" text-anchor="middle" fill="currentColor" stroke="none">7</text>
<text x="350" y="140" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">9</text>
<line x1="114" y1="38" x2="136" y2="70" /><line x1="166" y1="38" x2="144" y2="70" />
<line x1="174" y1="38" x2="196" y2="70" /><line x1="226" y1="38" x2="204" y2="70" />
<line x1="234" y1="38" x2="256" y2="70" /><line x1="286" y1="38" x2="264" y2="70" />
<line x1="294" y1="38" x2="316" y2="70" /><line x1="346" y1="38" x2="324" y2="70" />
<line x1="354" y1="38" x2="374" y2="70" stroke="var(--accent)" /><line x1="401" y1="38" x2="382" y2="70" stroke="var(--accent)" />
<line x1="144" y1="93" x2="166" y2="125" /><line x1="196" y1="93" x2="174" y2="125" />
<line x1="204" y1="93" x2="226" y2="125" /><line x1="256" y1="93" x2="234" y2="125" />
<line x1="264" y1="93" x2="286" y2="125" /><line x1="316" y1="93" x2="294" y2="125" />
<line x1="324" y1="93" x2="346" y2="125" stroke="var(--accent)" /><line x1="374" y1="93" x2="354" y2="125" stroke="var(--accent)" />
</svg>
<figcaption>Write the gaps below the series, then the gaps of the gaps. Here the second differences are 3, 5, 7, so the next is 9, the next gap is 26, and the next term is 35 + 26 = 61.</figcaption>
</figure>

> **In simple words:** Build the table from the bottom up. Once the bottom row is clear (here: odd numbers), extend it by one, then add upwards.

### Shortcut signals

- Terms **grow slowly** (by a few units) → differences.
- Terms **roughly double or triple** → ×2 or ×3, perhaps with ± a small number.
- Terms **grow very fast** → changing multiplier (×2, ×3, ×4) or powers (nⁿ).
- Terms go **up and down** → alternating series.
- Terms are **near a square or cube** → n² ± k or n³ ± k.
- **Look at the options.** If two options differ by a small amount, the rule usually involves ± 1 or ± 2.

## Solved examples — number series

**Example 1.** 4, 11, 25, 53, 109, ?

- The terms roughly double. Test ×2 + something: 4 × 2 = 8, and 11 − 8 = 3.
- Check: 11 × 2 + 3 = 25 ✓; 25 × 2 + 3 = 53 ✓; 53 × 2 + 3 = 109 ✓.
- Next: 109 × 2 + 3 = **221**.

**Example 2.** 6, 11, 21, 36, 56, ?

- Differences: 5, 10, 15, 20 — multiples of 5.
- Next difference 25 → 56 + 25 = **81**.

**Example 3.** 2, 3, 5, 7, 11, 13, ?

- These are consecutive prime numbers. The prime after 13 is **17**.

**Example 4.** 3, 10, 29, 66, 127, ?

- Each term is close to a cube: 1, 8, 27, 64, 125.
- Each term = n³ + 2 (1 + 2 = 3, 8 + 2 = 10, …, 125 + 2 = 127).
- Next: 6³ + 2 = 216 + 2 = **218**.

**Example 5.** 120, 99, 80, 63, 48, ?

- The terms fall. Differences: −21, −19, −17, −15 → next −13 → 48 − 13 = **35**.
- Another view: 11² − 1, 10² − 1, 9² − 1, 8² − 1, 7² − 1 → next 6² − 1 = 35. Both views agree.

**Example 6.** 5, 6, 14, 45, 184, ?

- Grows fast with a changing step. Test ×1 + 1, ×2 + 2, ×3 + 3 …
- 5 × 1 + 1 = 6 ✓; 6 × 2 + 2 = 14 ✓; 14 × 3 + 3 = 45 ✓; 45 × 4 + 4 = 184 ✓.
- Next: 184 × 5 + 5 = 920 + 5 = **925**.

**Example 7.** 7, 14, 42, 168, 840, ?

- Ratios: 14 ÷ 7 = 2, 42 ÷ 14 = 3, 168 ÷ 42 = 4, 840 ÷ 168 = 5.
- Next ratio 6 → 840 × 6 = **5040**.

**Example 8.** 2, 15, 4, 12, 6, 9, 8, ?

- Up-and-down terms → split into two series.
- Odd places: 2, 4, 6, 8 (+2). Even places: 15, 12, 9 (−3).
- The missing term is in the even places: 9 − 3 = **6**.

**Example 9.** 1, 3, 8, 18, 35, ?

- First differences: 2, 5, 10, 17. Second differences: 3, 5, 7.
- Next second difference 9 → next first difference 17 + 9 = 26 → 35 + 26 = **61**. (See the difference table above.)

**Example 10.** Find the wrong term: 1, 2, 6, 24, 96, 720

- Ratios: 2, 3, 4, then 96 ÷ 24 = 4 again, then 720 ÷ 96 = 7.5 — broken.
- The pattern is factorials: 1, 2, 6, 24, **120**, 720.
- The wrong term is **96** (it should be 120).

**Example 11.** 2, 5, 11, 23, ?, 95

- Test ×2 + 1: 2 → 5 → 11 → 23 → 47 → 95 ✓.
- Missing term = **47**. Check from the right too: 47 × 2 + 1 = 95 ✓.

**Example 12.** 4, 9, 25, 49, 121, ?

- These are squares: 2², 3², 5², 7², 11² — squares of **prime numbers**.
- Next prime after 11 is 13 → 13² = **169**.

**Example 13.** 0, 6, 24, 60, 120, ?

- Each term is n³ − n: 1 − 1 = 0, 8 − 2 = 6, 27 − 3 = 24, 64 − 4 = 60, 125 − 5 = 120.
- Next: 216 − 6 = **210**.
- Check by another route: 0, 6, 24, 60, 120 = 0×1×2, 1×2×3, 2×3×4, 3×4×5, 4×5×6 → next 5×6×7 = 210 ✓.

**Example 14.** 1, 4, 27, 256, ?

- 1¹, 2², 3³, 4⁴ → next 5⁵ = **3125**.

**Example 15.** 720, 360, 120, 30, 6, ?

- Ratios: ÷2, ÷3, ÷4, ÷5 → next ÷6 → 6 ÷ 6 = **1**.

**Example 16.** Find the wrong term: 3, 5, 9, 17, 33, 66

- Test ×2 − 1: 3 → 5 → 9 → 17 → 33 → 65.
- The last term should be 65. Wrong term = **66**.

> **Common mistake:** In "find the wrong term" questions, students fix the first term that looks odd. Instead, find a rule that fits **all but one** term. Then the one left over is wrong.

## Part B — Letter series

### Letter positions

Every letter series is a number series in disguise. Convert letters to positions (A = 1 … Z = 26), find the rule, and convert back.

<figure>
<svg viewBox="0 0 440 90" width="440" height="90" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1" font-size="11">
<text x="8" y="20" fill="currentColor" stroke="none">A</text><text x="25" y="20" fill="currentColor" stroke="none">B</text><text x="42" y="20" fill="currentColor" stroke="none">C</text><text x="59" y="20" fill="currentColor" stroke="none">D</text><text x="76" y="20" fill="var(--accent)" stroke="none" font-weight="bold">E</text><text x="93" y="20" fill="currentColor" stroke="none">F</text><text x="110" y="20" fill="currentColor" stroke="none">G</text><text x="127" y="20" fill="currentColor" stroke="none">H</text><text x="144" y="20" fill="currentColor" stroke="none">I</text><text x="161" y="20" fill="var(--accent)" stroke="none" font-weight="bold">J</text><text x="178" y="20" fill="currentColor" stroke="none">K</text><text x="195" y="20" fill="currentColor" stroke="none">L</text><text x="212" y="20" fill="currentColor" stroke="none">M</text>
<text x="229" y="20" fill="currentColor" stroke="none">N</text><text x="246" y="20" fill="var(--accent)" stroke="none" font-weight="bold">O</text><text x="263" y="20" fill="currentColor" stroke="none">P</text><text x="280" y="20" fill="currentColor" stroke="none">Q</text><text x="297" y="20" fill="currentColor" stroke="none">R</text><text x="314" y="20" fill="currentColor" stroke="none">S</text><text x="331" y="20" fill="var(--accent)" stroke="none" font-weight="bold">T</text><text x="348" y="20" fill="currentColor" stroke="none">U</text><text x="365" y="20" fill="currentColor" stroke="none">V</text><text x="382" y="20" fill="currentColor" stroke="none">W</text><text x="399" y="20" fill="currentColor" stroke="none">X</text><text x="416" y="20" fill="var(--accent)" stroke="none" font-weight="bold">Y</text><text x="430" y="20" fill="currentColor" stroke="none">Z</text>
<text x="76" y="40" fill="currentColor" stroke="none">5</text><text x="159" y="40" fill="currentColor" stroke="none">10</text><text x="244" y="40" fill="currentColor" stroke="none">15</text><text x="329" y="40" fill="currentColor" stroke="none">20</text><text x="414" y="40" fill="currentColor" stroke="none">25</text>
<line x1="217" y1="50" x2="217" y2="80" stroke-dasharray="3 3" />
<text x="110" y="72" text-anchor="middle" fill="currentColor" stroke="none">A–M: 1 to 13</text>
<text x="330" y="72" text-anchor="middle" fill="currentColor" stroke="none">N–Z: 14 to 26</text>
</svg>
<figcaption>EJOTY marks every fifth letter (5, 10, 15, 20, 25). The alphabet splits into halves at M (13) and N (14); a letter and its opposite always add up to 27.</figcaption>
</figure>

<div class="formula">

| Tool | Use |
|---|---|
| EJOTY | E5, J10, O15, T20, Y25 — count from the nearest one (R = T − 2 = 18) |
| Opposite letter | 27 − position (C3 ↔ X24) |
| Wrap-around | after Z comes A again: position above 26 → subtract 26 |
| Backward series | subtract; below 1 → add 26 |

</div>

### Solved examples — letter series

**Example 17.** A, C, F, J, O, ?

- Positions: 1, 3, 6, 10, 15. Differences: 2, 3, 4, 5.
- Next difference 6 → 15 + 6 = 21 = **U**.

**Example 18.** Z, X, U, Q, L, ?

- Positions: 26, 24, 21, 17, 12. Differences: −2, −3, −4, −5.
- Next: 12 − 6 = 6 = **F**.

**Example 19.** AZ, BY, CX, DW, ?

- First letters move forward: A, B, C, D → E.
- Second letters move backward: Z, Y, X, W → V. (Each pair is an opposite pair.)
- Answer: **EV**.

**Example 20.** BDF, HJL, NPR, ?

- Positions: (2, 4, 6), (8, 10, 12), (14, 16, 18) — even numbers in order.
- Next group: 20, 22, 24 = T, V, X → **TVX**.

**Example 21.** K, M, P, T, ?

- Positions: 11, 13, 16, 20. Differences: 2, 3, 4.
- Next difference 5 → 25 = **Y**.

**Example 22.** A1, C3, E5, G7, ?

- Letters skip one letter (A, C, E, G → I). Numbers are the letter positions (1, 3, 5, 7 → 9).
- Answer: **I9**.

**Example 23.** 1A, 2B, 4D, 8H, ?

- Numbers double: 1, 2, 4, 8 → 16.
- Each letter is the letter at that position: 1 = A, 2 = B, 4 = D, 8 = H → 16 = P.
- Answer: **16P**.

### Repeating-pattern (blank-filling) series

Here a short block of letters repeats, and some letters are blanked out. You choose the option that fills all blanks in order.

**Method:** guess the block length (try 3, 4, 5), write the series in blocks, and fill the blanks so that every block is the same.

**Example 24.** m _ n _ n n m _ n m _ n

- Try block length 3: "m _ n | _ n n | m _ n | m _ n".
- Block 2 is "_ n n"; the others start with "m". So the block is "m n n".
- Fill: m **n** n | **m** n n | m **n** n | m **n** n.
- Blanks in order: **n m n n**.

**Example 25.** Which number replaces the question mark? 1, 3, 4, 7, 11, 18, ?

- Each term = sum of the two before it (Fibonacci-type): 1 + 3 = 4, 3 + 4 = 7, 4 + 7 = 11, 7 + 11 = 18.
- Next: 11 + 18 = **29**.

> **Prelims angle:** BPSC series questions are usually one-rule series (difference, ×a + b, squares/cubes, alternating) or letter positions. Two-level rules (second differences) appear now and then. Very rarely is a series so hard that it is worth more than 45 seconds — if you see no rule after 30 seconds, circle it and move on.

## Common traps

1. **Fitting only the first three terms.** A rule must fit every given term. 2, 4, 8 could be ×2 or "+2, +4"; the fourth term decides.
2. **Missing the alternating series.** If terms go up and down, always split odd and even places.
3. **Forgetting wrap-around** in letter series: after Z comes A (Y + 3 = B).
4. **Counting letter positions wrongly.** Use EJOTY instead of counting from A each time.
5. **"Wrong term" questions:** do not stop at the first odd-looking term; find the rule that fits the most terms.
6. **Ignoring the options.** If you are stuck, put each option into the series and see which keeps a clean pattern.
7. **Two valid rules.** Sometimes two rules fit (Example 5). If both give the same answer, fine; if not, choose the simpler rule that fits all terms.

## Quick revision

- Checking order: differences → second differences → ratios → ×a + b → squares/cubes/primes → alternating → changing multiplier / Fibonacci.
- Squares to 20², cubes to 12³, primes to 60, factorials to 6! — learn by heart.
- n(n + 1): 2, 6, 12, 20, 30, 42; n³ − n: 0, 6, 24, 60, 120, 210.
- Letter position A1 … Z26; EJOTY; opposite = 27 − n.
- Wrap-around: subtract 26 above Z, add 26 below A.
- Blank-filling: find the repeating block length first (try 3, 4, 5).
- Check the answer against all terms before marking.

## Key terms

| Term | Simple meaning |
|---|---|
| Series | A list of numbers or letters that follows one hidden rule |
| Difference | The gap between two neighbouring terms |
| Second difference | The gap between two neighbouring differences |
| Arithmetic progression (AP) | Same number added each time |
| Geometric progression (GP) | Same number multiplied each time |
| Alternating series | Two series mixed together in odd and even places |
| Fibonacci-type series | Each term is the sum of the two terms before it |
| Prime number | A number with exactly two factors, 1 and itself |
| Factorial (n!) | 1 × 2 × 3 × … × n |
| Wrap-around | Continuing from Z back to A |

## Practice

Try each problem, then read the worked answer.

### Problems

1. 5, 9, 17, 33, 65, ?
2. 1, 9, 25, 49, 81, ?
3. 8, 15, 24, 35, 48, ?
4. 1, 2, 5, 10, 17, 26, ?
5. 3, 4, 8, 17, 33, ?
6. Find the wrong term: 2, 8, 18, 32, 50, 70, 98
7. 11, 13, 17, 19, 23, ?
8. 4, 6, 9, 13.5, ?
9. D, G, J, M, P, ?
10. B, E, J, Q, ?
11. ZA, YB, XC, WD, ?
12. CMM, EOO, GQQ, ?
13. 2, 6, 18, 54, ?
14. 1, 3, 4, 7, 11, 18, 29, ?

### Answers

1. Rule ×2 − 1: 5 × 2 − 1 = 9, 9 × 2 − 1 = 17 … 65 × 2 − 1 = **129**.
2. Squares of odd numbers: 1², 3², 5², 7², 9² → 11² = **121**.
3. n² − 1 for n = 3 to 8: 9 − 1, 16 − 1, 25 − 1, 36 − 1, 49 − 1 → 64 − 1 = **63**. (Also: differences 7, 9, 11, 13 → 15.)
4. Differences 1, 3, 5, 7, 9 → next 11 → 26 + 11 = **37**.
5. Differences 1, 4, 9, 16 (squares) → next 25 → 33 + 25 = **58**.
6. Rule 2n²: 2, 8, 18, 32, 50, **72**, 98. The wrong term is **70**.
7. Consecutive primes → next prime after 23 is **29**.
8. Each term × 1.5: 4 → 6 → 9 → 13.5 → **20.25**.
9. Positions 4, 7, 10, 13, 16 (+3) → 19 = **S**.
10. Positions 2, 5, 10, 17 = n² + 1 for n = 1 to 4 → 5² + 1 = 26 = **Z**.
11. First letter backward (Z, Y, X, W → V), second forward (A, B, C, D → E) → **VE**.
12. First letter +2 (C, E, G → I); doubled letter +2 (M, O, Q → S) → **ISS**.
13. ×3 each time → 54 × 3 = **162**.
14. Each term = sum of the previous two → 18 + 29 = **47**.

**Next:** [Coding-Decoding](/interview/bpsc-2027/mental-ability/coding-decoding)
