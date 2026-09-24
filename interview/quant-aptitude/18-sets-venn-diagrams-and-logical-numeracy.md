---
title: Sets, Venn Diagrams & Logical Numeracy
part: Data & Reasoning
summary: Two- and three-set Venn diagrams with the inclusion-exclusion formula, the "only", "exactly", and "at least" regions, counting from a diagram, and the CSAT-style reasoning-with-numbers questions on ages, arrangements, and conditions.
---

## Where it appears

CSAT: one or two Venn-diagram questions almost every year, plus several "basic numeracy" puzzles that are logic with small numbers. BPSC: similar. SSC: Venn diagrams appear in reasoning. The diagram is the method; draw it every time.

## Formulae

<div class="formula">

| Two sets | Formula |
|---|---|
| A or B | n(A ∪ B) = n(A) + n(B) − n(A ∩ B) |
| Only A | n(A) − n(A ∩ B) |
| Neither | total − n(A ∪ B) |

| Three sets | Formula |
|---|---|
| A or B or C | n(A) + n(B) + n(C) − n(A∩B) − n(B∩C) − n(C∩A) + n(A∩B∩C) |
| Exactly one | Σ singles − 2 × Σ pairs + 3 × triple |
| Exactly two | Σ pairs − 3 × triple |
| At least two | Σ pairs − 2 × triple |

</div>

## Two sets

<figure>
<svg viewBox="0 0 320 180" width="320" height="180" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<rect x="10" y="10" width="300" height="160" />
<circle cx="125" cy="90" r="60" /><circle cx="195" cy="90" r="60" />
<text x="80" y="95" fill="currentColor" stroke="none">only A</text><text x="145" y="95" fill="var(--accent)" stroke="none">A∩B</text><text x="210" y="95" fill="currentColor" stroke="none">only B</text>
<text x="20" y="160" fill="currentColor" stroke="none">neither</text>
<text x="70" y="26" fill="currentColor" stroke="none">A</text><text x="245" y="26" fill="currentColor" stroke="none">B</text>
</svg>
<figcaption>Fill the middle first (the intersection), then the "only" regions by subtraction, then "neither" from the total. Every question is answered by reading regions.</figcaption>
</figure>

**Example.** In a class of 60, 35 play cricket, 30 play football, and 10 play neither. How many play both?
Union = 50; both = 35 + 30 − 50 = 15. Only cricket 20, only football 15.

**Example.** In a survey, 70% like tea, 60% like coffee, 15% like neither. Percentage liking both? Union 85; both = 70 + 60 − 85 = 45%.

**Example.** 40 students passed maths, 30 passed science, 20 passed both, and 10 failed both. Class size? Union = 50; total 60.

## Three sets

<figure>
<svg viewBox="0 0 320 230" width="320" height="230" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<circle cx="125" cy="95" r="65" /><circle cx="195" cy="95" r="65" /><circle cx="160" cy="155" r="65" />
<text x="70" y="80" fill="currentColor" stroke="none">a</text><text x="155" y="70" fill="currentColor" stroke="none">d</text><text x="238" y="80" fill="currentColor" stroke="none">b</text>
<text x="112" y="140" fill="currentColor" stroke="none">e</text><text x="156" y="120" fill="var(--accent)" stroke="none" font-weight="bold">g</text><text x="200" y="140" fill="currentColor" stroke="none">f</text>
<text x="156" y="195" fill="currentColor" stroke="none">c</text>
<text x="60" y="26" fill="currentColor" stroke="none">A</text><text x="250" y="26" fill="currentColor" stroke="none">B</text><text x="150" y="225" fill="currentColor" stroke="none">C</text>
</svg>
<figcaption>Seven regions: a, b, c (only one set), d, e, f (exactly two), g (all three). Fill g first, then d, e, f as pairwise intersections minus g, then a, b, c.</figcaption>
</figure>

**Example.** In a group of 100, 50 read newspaper A, 40 read B, 30 read C; 15 read A and B, 10 read B and C, 12 read A and C; 5 read all three. How many read none? Exactly one?
Union = 50 + 40 + 30 − 15 − 10 − 12 + 5 = 88 → none = 12.
Exactly one = 120 − 2(37) + 15 = 61. (Check by regions: g = 5; d = 10, e = 7, f = 5; a = 50 − 10 − 7 − 5 = 28; b = 40 − 10 − 5 − 5 = 20; c = 30 − 7 − 5 − 5 = 13; 28 + 20 + 13 = 61.)

**Example.** 25 students play hockey, 20 cricket, 15 both; with three games and every student playing at least one, given 40 students and 10 playing football, how many play only football? Hockey ∪ cricket = 30; only football = 40 − 30 = 10 (all footballers play nothing else).

**Hint:** when the question gives "exactly", "only", or "at least", translate each to regions before touching the formula; mixing them is the standard trap.

## Logical numeracy: the CSAT style

These look like puzzles and are solved by writing the constraints as small equations or by trying the options.

**Example.** A is twice as old as B; the sum of their ages 6 years ago was 30. Ages now? a = 2b, (a − 6) + (b − 6) = 30 → 3b = 42 → b = 14, a = 28.

**Example.** In a row of 40 people, Ram is 12th from the left and Shyam is 15th from the right. How many people are between them? Ram is 12th from left; Shyam is 26th from the left; between them 13.

**Example.** A frog climbs 3 m up a 10 m well by day and slips 2 m by night. Days to get out? Net 1 m per day for 7 days (at 7 m), then on day 8 it climbs 3 m to reach 10 m. **8 days.**

**Example.** In a group, each person shakes hands with every other person once; there are 45 handshakes. People? n(n − 1)/2 = 45 → n = 10.

**Example.** A watch shows 3:15; the mirror image reads? 11:60 − 3:15 = 8:45.

**Example.** If it takes 5 machines 5 minutes to make 5 items, how long for 100 machines to make 100 items? 5 minutes (each machine makes one item in 5 minutes).

**Example.** A number of chickens and cows have 30 heads and 74 legs. Cows? 4c + 2(30 − c) = 74 → 2c = 14 → 7 cows.

**Example.** A bat and a ball cost ₹110 together and the bat costs ₹100 more than the ball. Ball? b + (b + 100) = 110 → ₹5.

**Example.** How many times does the digit 7 appear from 1 to 100? Units place 10 times, tens place 10 times → 20.

**Example.** A person has 3 shirts and 4 trousers. Outfits? 12.

**Example.** If today is Monday, what day is it 100 days from now? 100 mod 7 = 2 → Wednesday.

**Example.** How many squares are on a chessboard? 1² + 2² + ... + 8² = 204. Rectangles: ⁹C₂ × ⁹C₂ = 1,296.

**Example.** The sum of ages of a family of four is 100. After 5 years? 120.

## Data sufficiency, briefly

CSAT sometimes asks whether statements I and II are enough to answer. Test each statement alone (does it fix the answer uniquely?), then both together. Do not solve fully; decide sufficiency.

## Traps

- "Only A" excludes the intersection; "A" includes it.
- Three-set formula adds back the triple intersection once; the "exactly one/two" formulae subtract it more.
- Position puzzles: the person at position p from the left is at n − p + 1 from the right.
- Climbing puzzles: the last climb ends the process before the slip.
- Mirror time: subtract from 11:60 (or 23:60), not from 12:00.

## Practice set

1. Of 80 people, 45 like tea, 40 like coffee, 20 like both. How many like neither?
2. In a class, 65% pass maths, 55% pass science, 10% fail both. Percentage passing both?
3. Three sets: n(A) = 30, n(B) = 25, n(C) = 20, pairwise intersections 10, 8, 6, all three 4. Union?
4. From question 3, exactly two? Only A?
5. In a row of 50, a person is 20th from the right. Position from the left?
6. A snail climbs 5 m and slips 3 m each day in a 15 m well. Days?
7. 66 handshakes at a party. People?
8. Mirror image of 4:20?
9. Chickens and goats: 50 heads, 140 legs. Goats?
10. How many two-digit numbers have the digit 5?
11. If the day before yesterday was Thursday, what day is the day after tomorrow?
12. Number of squares in a 4 × 4 grid.

**Answers**

1. Union 65 → 15.
2. Union 90 → both = 65 + 55 − 90 = 30%.
3. 75 − 24 + 4 = 55.
4. Exactly two = 24 − 12 = 12; only A = 30 − 10 − 6 + 4 = 18.
5. 50 − 20 + 1 = 31.
6. Net 2 m/day; after 5 days at 10 m; day 6 climbs to 15 → 6 days.
7. n(n − 1)/2 = 66 → n = 12.
8. 11:60 − 4:20 = 7:40.
9. 4g + 2(50 − g) = 140 → g = 20.
10. Tens 5: 10 numbers (50–59); units 5: 9 numbers (15, 25, ..., 95), minus 55 counted twice → 18.
11. Thursday + 2 = Saturday (today) → +2 = Monday.
12. 16 + 9 + 4 + 1 = 30.
