---
title: Ranking, Order and Seating Arrangement
part: Reasoning
summary: The position formulas for ranks in a row or class (total, from the other end, people between, interchange, minimum number), ordering by height or marks, and linear and circular seating with the left–right rules for facing the centre or facing outward — 20 solved examples and practice.
---

Ranking questions ask about positions in a row, a queue or a class list: "14th from the left and 19th from the right — how many people?" Ordering questions compare people by height, weight or marks. Seating arrangement questions give clues about who sits where in a row or around a table. BPSC asks ranking almost every year and small seating puzzles often. All three need one formula and one rule about left and right.

> **In simple words:** In a row, your position from the left plus your position from the right is one more than the total, because you are counted twice. In seating, draw the seats first, fix the person with the most definite clue, then fill the rest.

## Part A — Ranking

### The formulas

<div class="formula">

| Situation | Formula |
|---|---|
| Total people (one person's two positions known) | Total = left + right − 1 |
| Position from the other end | Right = Total − Left + 1 |
| People between A and B (no overlap) | Total − (A's position from left + B's position from right) |
| People between A and B (both counted from the same end) | difference of positions − 1 |
| Same position from both ends | Total = 2 × position − 1 |
| Interchange of two people | new position of one + old position of the other from the other end − 1 = Total |

</div>

<figure>
<svg viewBox="0 0 440 120" width="440" height="120" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<circle cx="30" cy="50" r="10" /><circle cx="60" cy="50" r="10" /><circle cx="90" cy="50" r="10" /><circle cx="120" cy="50" r="10" /><circle cx="150" cy="50" r="10" />
<circle cx="180" cy="50" r="10" stroke="var(--accent)" stroke-width="3" />
<circle cx="210" cy="50" r="10" /><circle cx="240" cy="50" r="10" /><circle cx="270" cy="50" r="10" /><circle cx="300" cy="50" r="10" /><circle cx="330" cy="50" r="10" /><circle cx="360" cy="50" r="10" /><circle cx="390" cy="50" r="10" /><circle cx="420" cy="50" r="10" />
<text x="180" y="54" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">X</text>
<line x1="20" y1="80" x2="190" y2="80" /><text x="105" y="98" text-anchor="middle" fill="currentColor" stroke="none">6th from left (includes X)</text>
<line x1="170" y1="20" x2="430" y2="20" /><text x="300" y="14" text-anchor="middle" fill="currentColor" stroke="none">9th from right (includes X)</text>
<text x="220" y="116" text-anchor="middle" fill="currentColor" stroke="none">Total = 6 + 9 − 1 = 14, because X is inside both counts.</text>
</svg>
<figcaption>Both counts include X, so X is counted twice; subtract 1.</figcaption>
</figure>

### Solved examples — ranking

**Example 1.** Raju is 14th from the left and 19th from the right in a row. How many people are in the row?

- Total = 14 + 19 − 1 = **32**.

**Example 2.** In a class of 40, Asha is 12th from the top. What is her rank from the bottom?

- Bottom rank = 40 − 12 + 1 = **29**.

**Example 3.** Kiran ranks 9th from the top and 38th from the bottom. How many students are in the class?

- Total = 9 + 38 − 1 = **46**.

**Example 4.** Gopal is 7th from both ends of a row. How many people are in the row?

- Total = 2 × 7 − 1 = **13**.

**Example 5.** In a row of 40 people, A is 10th from the left and B is 15th from the right. A is to the left of B. How many people are between them?

- B's position from the left = 40 − 15 + 1 = 26.
- Between = 26 − 10 − 1 = **15**.
- (Formula check: 40 − (10 + 15) = 15 ✓.)

**Example 6.** In a row of 20, A is 14th from the left and B is 12th from the right. How many people are between A and B?

- B from the left = 20 − 12 + 1 = 9. A is at 14.
- Here the two counts **overlap** (14 + 12 = 26 is more than 20), so B is to the left of A.
- Between = 14 − 9 − 1 = **4** (positions 10, 11, 12, 13).

**Example 7.** In a class of 50, A is 18th from the top and B is 20th from the bottom. How many students are between them?

- B from the top = 50 − 20 + 1 = 31.
- Between = 31 − 18 − 1 = **12**.

**Example 8.** In a row, A is 8th from the left and B is 12th from the right. When they interchange their positions, A becomes 15th from the left. How many people are in the row?

- After the swap, A stands where B stood. So **B's old position is 15th from the left**.
- B's old position is also 12th from the right.
- Total = 15 + 12 − 1 = **26**.

**Example 9.** In a row of boys, Ajay is 12th from the left. Vijay is 4th to the right of Ajay and 10th from the right end. How many boys are in the row?

- Vijay from the left = 12 + 4 = 16.
- Total = 16 + 10 − 1 = **25**.

**Example 10.** In a queue, Ravi is 7th from the front and Mohan is 9th from the back. There are 4 people between them. What is the **minimum** number of people in the queue?

- **Case 1 (no overlap):** Ravi ahead of Mohan: 7 + 4 + 9 = 20 people.
- **Case 2 (overlap):** Mohan ahead of Ravi. With 4 people between them, Mohan is at position 7 − 4 − 1 = 2 from the front. Mohan is 9th from the back → total = 2 + 9 − 1 = 10. (Ravi at 7 fits inside 10 ✓.)
- Minimum = **10**.

> **Common mistake:** In "minimum number" questions, students give only the no-overlap answer. Always test the overlap case too.

**Example 11.** In a class of 35, Rohan is 10th from the top. Five students ranked above him fail and are removed from the list. What is Rohan's new rank from the bottom?

- New total = 35 − 5 = 30. New rank from the top = 10 − 5 = 5.
- From the bottom = 30 − 5 + 1 = **26**.

## Part B — Ordering and comparison

Write the people in a vertical line, tallest (or heaviest, highest marks) at the top. Place each clue one by one.

**Example 12.** A is taller than B. B is taller than C. D is taller than A. E is shorter than C. Who is the tallest, and who is the third tallest?

- From the clues: D > A > B > C > E.
- Tallest **D**; third tallest **B**.

**Example 13.** Among P, Q, R, S and T: P scored more than Q but less than R. S scored less than Q. T scored more than R. Who scored the least, and who is in the middle?

- R > P > Q, S < Q, T > R → T > R > P > Q > S.
- Least **S**; middle (3rd) **P**.

**Example 14.** Five friends have different weights. A is heavier than only C. D is heavier than A and B but not E. Who is the heaviest?

- "A is heavier than only C" → C is the lightest and A is second lightest; B, D, E are all heavier than A.
- D is heavier than B; E is heavier than D.
- Order: E > D > B > A > C. Heaviest = **E**.

> **Prelims angle:** "Heavier than only C" means exactly one person (C) is below A. Words like "only", "not", "but not" carry the whole question. Underline them.

## Part C — Seating arrangement

### The left–right rules

<div class="formula">

| Arrangement | Left is | Right is |
|---|---|---|
| Row facing north (the usual drawing: you see their backs) | your left on the page | your right on the page |
| Row facing south (you see their faces) | your right on the page | your left on the page |
| Circle, facing the centre | **clockwise** | **anticlockwise** |
| Circle, facing outward | **anticlockwise** | **clockwise** |

</div>

> **Memory trick:** Facing the centre, "**L**eft = c**L**ockwise". Facing outward, everything reverses.

### Method for any seating puzzle

1. Draw the seats (a line of dashes, or a circle of dots).
2. Start with the **definite** clue — someone at an end, in the middle, or opposite someone.
3. Use clues that link to people already placed. Skip vague clues and come back.
4. When two cases are possible, draw both and let later clues remove one.
5. Check every clue against the final drawing.

### Solved examples — linear seating

**Example 15.** Seven people P, Q, R, S, T, U and V sit in a row facing north.
- S sits in the middle.
- P sits third to the left of S.
- T sits immediately to the left of S.
- U sits immediately to the right of S.
- R sits at one end.
- Q sits between U and R.

(a) Who sits second from the right end? (b) How many people sit between P and U? (c) Who sits exactly in the middle between V and S?

<figure>
<svg viewBox="0 0 420 90" width="420" height="90" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<rect x="20" y="20" width="44" height="34" rx="6" /><text x="42" y="42" text-anchor="middle" fill="currentColor" stroke="none">P</text>
<rect x="76" y="20" width="44" height="34" rx="6" /><text x="98" y="42" text-anchor="middle" fill="currentColor" stroke="none">V</text>
<rect x="132" y="20" width="44" height="34" rx="6" /><text x="154" y="42" text-anchor="middle" fill="currentColor" stroke="none">T</text>
<rect x="188" y="20" width="44" height="34" rx="6" stroke="var(--accent)" /><text x="210" y="42" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">S</text>
<rect x="244" y="20" width="44" height="34" rx="6" /><text x="266" y="42" text-anchor="middle" fill="currentColor" stroke="none">U</text>
<rect x="300" y="20" width="44" height="34" rx="6" /><text x="322" y="42" text-anchor="middle" fill="currentColor" stroke="none">Q</text>
<rect x="356" y="20" width="44" height="34" rx="6" /><text x="378" y="42" text-anchor="middle" fill="currentColor" stroke="none">R</text>
<text x="20" y="78" fill="currentColor" stroke="none" font-size="11">left end</text>
<text x="400" y="78" text-anchor="end" fill="currentColor" stroke="none" font-size="11">right end</text>
<text x="210" y="78" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">all face north (up)</text>
</svg>
<figcaption>The row of Example 15. Facing north, "left" is the left side of the page.</figcaption>
</figure>

- S is 4th (middle of 7). P is third to the left → position 1.
- T is immediately left of S → 3. U is immediately right of S → 5.
- R is at an end; position 1 is taken by P, so R is at 7.
- Q is between U (5) and R (7) → 6. The only seat left, 2, goes to V.
- Row: P V T S U Q R.
- (a) Second from the right: **Q**. (b) Between P (1) and U (5): V, T, S → **3**. (c) Between V (2) and S (4): **T**.

**Example 16.** Five friends A, B, C, D and E sit in a row facing south. A is at the extreme right end of the row (from A's own point of view). Where does A appear on your page if you draw the row with north at the top?

- People facing south face you, so their right is your left.
- A's right end appears on the **left end of your drawing**.
- This is why you should always note the facing direction before you place anyone.

### Solved examples — circular seating

**Example 17.** Six friends P, Q, R, S, T and U sit around a round table facing the centre.
- P sits opposite S.
- Q sits immediately to the left of P.
- R sits between Q and S.
- T sits immediately to the right of P.

(a) Who sits opposite Q? (b) Who sits between S and T? (c) Who sits opposite R?

<figure>
<svg viewBox="0 0 420 230" width="420" height="230" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<circle cx="210" cy="115" r="45" stroke-dasharray="4 3" />
<text x="210" y="119" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">table</text>
<circle cx="210" cy="45" r="14" stroke="var(--accent)" /><text x="210" y="50" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">P</text>
<circle cx="271" cy="80" r="14" /><text x="271" y="85" text-anchor="middle" fill="currentColor" stroke="none">Q</text>
<circle cx="271" cy="150" r="14" /><text x="271" y="155" text-anchor="middle" fill="currentColor" stroke="none">R</text>
<circle cx="210" cy="185" r="14" /><text x="210" y="190" text-anchor="middle" fill="currentColor" stroke="none">S</text>
<circle cx="149" cy="150" r="14" /><text x="149" y="155" text-anchor="middle" fill="currentColor" stroke="none">U</text>
<circle cx="149" cy="80" r="14" /><text x="149" y="85" text-anchor="middle" fill="currentColor" stroke="none">T</text>
<path d="M300 60 A110 110 0 0 1 320 120" />
<polygon points="316,112 321,124 326,112" fill="currentColor" />
<text x="330" y="80" fill="currentColor" stroke="none" font-size="11">clockwise</text>
<text x="330" y="95" fill="currentColor" stroke="none" font-size="11">= left of a person</text>
<text x="330" y="110" fill="currentColor" stroke="none" font-size="11">facing the centre</text>
</svg>
<figcaption>Example 17. Everyone faces the centre, so a person's left neighbour is the next seat clockwise.</figcaption>
</figure>

- Fix P at the top. S is opposite → bottom.
- Facing the centre, left = clockwise → Q is the next seat clockwise from P.
- R is between Q and S → the next seat clockwise after Q.
- Right = anticlockwise → T is the next seat anticlockwise from P.
- The last seat (between S and T) goes to U.
- (a) Opposite Q: **U**. (b) Between S and T: **U**. (c) Opposite R: **T**.

**Example 18.** Eight people A to H sit around a circular table facing the centre.
- A sits opposite B.
- C sits second to the left of A.
- H sits immediately to the left of C.
- D sits second to the right of A.
- E sits immediately to the right of D.
- G sits immediately to the right of A.

(a) Who sits opposite F? (b) Who sits between H and E? (c) How many people sit between A and B going clockwise from A?

<figure>
<svg viewBox="0 0 420 240" width="420" height="240" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<circle cx="210" cy="120" r="48" stroke-dasharray="4 3" />
<circle cx="210" cy="45" r="14" stroke="var(--accent)" /><text x="210" y="50" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">A</text>
<circle cx="263" cy="67" r="14" /><text x="263" y="72" text-anchor="middle" fill="currentColor" stroke="none">F</text>
<circle cx="285" cy="120" r="14" /><text x="285" y="125" text-anchor="middle" fill="currentColor" stroke="none">C</text>
<circle cx="263" cy="173" r="14" /><text x="263" y="178" text-anchor="middle" fill="currentColor" stroke="none">H</text>
<circle cx="210" cy="195" r="14" /><text x="210" y="200" text-anchor="middle" fill="currentColor" stroke="none">B</text>
<circle cx="157" cy="173" r="14" /><text x="157" y="178" text-anchor="middle" fill="currentColor" stroke="none">E</text>
<circle cx="135" cy="120" r="14" /><text x="135" y="125" text-anchor="middle" fill="currentColor" stroke="none">D</text>
<circle cx="157" cy="67" r="14" /><text x="157" y="72" text-anchor="middle" fill="currentColor" stroke="none">G</text>
<text x="210" y="124" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">facing centre</text>
<text x="330" y="60" fill="currentColor" stroke="none" font-size="11">Seats in clockwise</text>
<text x="330" y="75" fill="currentColor" stroke="none" font-size="11">order from A:</text>
<text x="330" y="90" fill="currentColor" stroke="none" font-size="11">A F C H B E D G</text>
</svg>
<figcaption>Example 18. "Second to the left" of A means two seats clockwise from A.</figcaption>
</figure>

- Number the seats 0 to 7 clockwise, with A at 0. B (opposite) is at 4.
- Second to the left of A (2 seats clockwise) → **C at 2**. Immediately left of C → **H at 3**.
- Second to the right of A (2 seats anticlockwise) → **D at 6**. Immediately right of D → **E at 5**.
- Immediately right of A → **G at 7**. The last seat, 1, goes to **F**.
- Clockwise order: A F C H B E D G.
- (a) Opposite F (seat 1) is seat 5: **E**. (b) Between H (3) and E (5): **B**. (c) Between A and B clockwise: F, C, H → **3**.

**Example 19.** A, B, C and D sit around a circular table **facing outward** (away from the centre). B is immediately to the left of A. C sits opposite A. Who is immediately to the right of A?

- Facing outward, left = **anticlockwise** and right = **clockwise**.
- Put A at the top (seat 0). B is anticlockwise of A (seat 3). C is opposite (seat 2). D gets seat 1.
- Right of A = clockwise of A = seat 1 = **D**.

**Example 20.** Six people sit around a table facing the centre. M sits third to the left of N. Where is M with respect to N?

- In a circle of 6, third to the left (3 seats clockwise) and third to the right (3 seats anticlockwise) are the same seat.
- M sits **opposite** N.

> **Remember:** In a circle of n people, the person opposite is n ÷ 2 seats away (only when n is even). "k-th to the left" = "(n − k)-th to the right".

## Common traps

1. **Forgetting the −1** in the total formula.
2. **Overlap cases** in "people between" and "minimum number" questions (Examples 6 and 10).
3. **Interchange questions:** the new position of one person is the old position of the other (Example 8).
4. **Facing south in a row:** left and right are reversed on your page (Example 16).
5. **Facing outward in a circle:** left becomes anticlockwise (Example 19).
6. **"Only" in comparisons:** "heavier than only C" fixes A at second from the bottom.
7. **Two possible arrangements:** keep both until a clue removes one; if none does, the answer may be "cannot be determined".

## Quick revision

- Total = left + right − 1; other-end position = total − position + 1.
- Same position k from both ends → total 2k − 1.
- People between (no overlap) = total − (sum of the two end-positions).
- Interchange: one person's new position + the other's old position from the other end − 1 = total.
- Minimum number: test the overlap case.
- Row facing north: page left = their left. Row facing south: reversed.
- Circle facing centre: left = clockwise, right = anticlockwise. Facing out: reversed.
- Opposite seat in a circle of n = n ÷ 2 seats away.
- Start every puzzle from the most definite clue.

## Key terms

| Term | Simple meaning |
|---|---|
| Rank | Position in an ordered list (1st = top) |
| From the left / right | Counting starts from that end, and includes the person |
| Overlap | When two counts from opposite ends cover some of the same people |
| Interchange | Two people swap places |
| Linear arrangement | People in a straight row |
| Circular arrangement | People around a round table |
| Immediate left / right | The very next seat on that side |
| Second to the left | Two seats away on the left side |
| Opposite | Directly across the table |

## Practice

### Problems

1. In a row, Sita is 11th from the left and 16th from the right. How many people are in the row?
2. In a class of 52, Arun is 17th from the top. What is his rank from the bottom?
3. In a row of 30 children, Mona is 9th from the left and Raju is 13th from the right. How many children are between them?
4. A is 6th from the left and B is 10th from the right. They interchange places, and A is now 18th from the left. How many people are in the row?
5. Among A, B, C, D and E, C is taller than A but shorter than E. B is taller than E. D is the shortest. Who is the second tallest?
6. Five people sit in a row facing north. M is to the immediate right of N. N is in the middle. O is at the left end. P is not next to O. Where does the fifth person, Q, sit?
7. Six people A, B, C, D, E and F sit around a table facing the centre. A is opposite D. B is immediately to the left of A. C is immediately to the right of D. F is immediately to the right of A. Who sits opposite C?
8. In a queue, X is 10th from the front and Y is 6th from the back. There are 3 people between them. What is the minimum number of people in the queue?

### Answers

1. 11 + 16 − 1 = **26**.
2. 52 − 17 + 1 = **36**.
3. Raju from the left = 30 − 13 + 1 = 18. Between = 18 − 9 − 1 = **8**.
4. B's old position = A's new position = 18th from the left. B was 10th from the right. Total = 18 + 10 − 1 = **27**.
5. B > E > C > A, and D is shortest → B > E > C > A > D. Second tallest: **E**.
6. Positions 1–5: N at 3, M at 4, O at 1. P is not next to O, so P is not at 2 → P at 5. **Q sits at 2** (between O and N).
7. Seats 0–5 clockwise, A at 0, D at 3. B is immediately left of A → clockwise → seat 1. C is immediately right of D → anticlockwise of D → seat 2. F is immediately right of A → anticlockwise of A → seat 5. E takes seat 4. Opposite C (seat 2) is seat 5: **F**.
8. No overlap: 10 + 3 + 6 = 19. Overlap: Y ahead of X with 3 between → Y at 10 − 3 − 1 = 6 from the front, and 6th from the back → total = 6 + 6 − 1 = 11 (X at 10 fits ✓). Minimum = **11**.

**Next:** [Syllogism, Statements and Conclusions](/interview/bpsc-2027/mental-ability/syllogism-statements-and-conclusions)
