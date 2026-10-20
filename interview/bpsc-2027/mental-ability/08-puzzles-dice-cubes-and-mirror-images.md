---
title: Puzzles, Dice, Cubes and Mirror Images
part: Reasoning
summary: Grid-method solving of schedule, attribute and floor puzzles; counting triangles, squares and rectangles; opposite faces of dice from views and nets; painted-cube counting; and mirror and water images of letters, words and clock times — 22 solved examples and practice.
---

This chapter covers the "non-verbal" and multi-clue questions of GMA. **Puzzles** give several clues about people, days, cities or floors and ask you to fit everything together. **Dice** and **cube** questions test how well you picture a 3-D object. **Mirror image** questions ask how a word, a figure or a clock looks in a mirror. BPSC asks small puzzles and dice questions regularly; mirror images and figure-counting appear now and then.

> **In simple words:** For puzzles, draw a grid and fill it clue by clue. For dice, remember one rule: two faces that never appear together are opposite. For mirrors, left becomes right and right becomes left, but top and bottom stay the same.

## Part A — Puzzles

### The grid method

1. **List the categories**: people, days, cities, drinks, floors …
2. **Draw a grid**: one row per person, one column per category (or one slot per day/floor).
3. **Fill the definite clues first** ("C meets on Wednesday", "Bina lives in Bhagalpur").
4. **Use the linking clues** ("A meets the day after C") to place more people.
5. **Use the negative clues last** ("E is not on Monday") to remove options.
6. When one slot has only one possible person left, fill it — this often unlocks the rest.

> **Remember:** Mark "✗" in the grid for every "not" clue. A row or column with only one empty cell left is solved.

### Solved examples — puzzles

**Example 1. (Schedule)** Five officers A, B, C, D and E inspect a district office on five days, Monday to Friday, one officer per day.
- C inspects on Wednesday.
- A inspects on the day after C.
- B inspects on the day before C.
- E does not inspect on Monday.

(a) Who inspects on Friday? (b) How many officers inspect between D and A?

| Day | Mon | Tue | Wed | Thu | Fri |
|---|---|---|---|---|---|
| Step 1 (C on Wed) | | | C | | |
| Step 2 (A after C, B before C) | | B | C | A | |
| Step 3 (E not Mon) | D | B | C | A | E |

- Only Monday and Friday are left for D and E. E is not on Monday → E on Friday, D on Monday.
- (a) **E**. (b) Between D (Mon) and A (Thu): B and C → **2**.

**Example 2. (Attributes)** Amit, Bina and Chetan live in three different cities — Patna, Gaya and Bhagalpur — and each likes a different drink — tea, coffee or milk.
- Amit does not live in Patna and does not like tea.
- The person who lives in Gaya likes coffee.
- Bina lives in Bhagalpur.
- Chetan does not like milk.

Who likes tea, and where does that person live?

| Person | City | Drink |
|---|---|---|
| Bina | Bhagalpur (clue 3) | ? |
| Amit | not Patna, not Bhagalpur → **Gaya** | Gaya → **coffee** (clue 2) |
| Chetan | **Patna** (only city left) | not milk, not coffee → **tea** |
| Bina | Bhagalpur | **milk** (only drink left) |

- **Chetan likes tea and lives in Patna.**

**Example 3. (Floors)** Five people P, Q, R, S and T live on five floors of a building, numbered 1 (bottom) to 5 (top), one person per floor.
- P lives on an odd-numbered floor, but not on the top or bottom floor.
- R lives on the bottom floor.
- Q lives on the floor immediately above S.

(a) Who lives on floor 2? (b) Who lives immediately above P?

- Odd floors are 1, 3, 5. Not top (5) or bottom (1) → **P on floor 3**.
- **R on floor 1.**
- Floors left: 2, 4, 5. Q directly above S: S on 4 and Q on 5 is the only pair of neighbouring free floors (2 and 3 are not both free) → **S on 4, Q on 5**.
- **T on floor 2.**
- (a) **T**. (b) Floor 4: **S**.

> **Prelims angle:** BPSC puzzle sets are usually 4–6 people and 2 categories. Give a puzzle set 2–3 minutes in your second pass; if the grid is full, all its questions become 10-second questions.

### Counting figures

Questions such as "How many triangles are there in the figure?" need a system, not guessing.

<div class="formula">

| Figure | Count |
|---|---|
| Triangle with k lines drawn from the top corner to the base (making k + 1 small triangles side by side) | (k + 1)(k + 2) ÷ 2 triangles |
| n × n grid of small squares | 1² + 2² + … + n² squares |
| Grid with m rows and n columns of small boxes | [m(m + 1) ÷ 2] × [n(n + 1) ÷ 2] rectangles (squares included) |

</div>

**Example 4.** A triangle has two lines drawn from its top corner to its base. How many triangles are there?

<figure>
<svg viewBox="0 0 300 150" width="300" height="150" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<polygon points="150,15 20,130 280,130" />
<line x1="150" y1="15" x2="110" y2="130" stroke="var(--accent)" />
<line x1="150" y1="15" x2="190" y2="130" stroke="var(--accent)" />
<text x="70" y="122" fill="currentColor" stroke="none">1</text>
<text x="146" y="122" fill="currentColor" stroke="none">2</text>
<text x="225" y="122" fill="currentColor" stroke="none">3</text>
<text x="150" y="146" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">small parts 1, 2, 3 along the base</text>
</svg>
<figcaption>Every triangle here has the top corner as one vertex and a run of neighbouring base parts as its base: 1, 2, 3, 1+2, 2+3, 1+2+3.</figcaption>
</figure>

- Small triangles along the base: 3 (k = 2 lines).
- Triangles = single parts (3) + two neighbouring parts together (2) + all three (1) = **6**.
- Formula: (2 + 1)(2 + 2) ÷ 2 = 12 ÷ 2 = 6 ✓.

**Example 5.** How many squares are there in a 4 × 4 grid (like a small chessboard)?

- 1 × 1 squares: 16; 2 × 2: 9; 3 × 3: 4; 4 × 4: 1.
- Total = 16 + 9 + 4 + 1 = **30**.

**Example 6.** How many rectangles (including squares) are there in a 3 × 3 grid?

- Choose 2 of the 4 vertical lines: 4 × 3 ÷ 2 = 6 ways. Choose 2 of the 4 horizontal lines: 6 ways.
- Rectangles = 6 × 6 = **36**.

## Part B — Dice

A **die** (plural: dice) is a cube with six faces. Each face touches four others (its **adjacent** faces) and is **opposite** one face.

<div class="formula">

| Rule | Detail |
|---|---|
| Standard die | opposite faces add up to 7: 1–6, 2–5, 3–4 |
| Adjacent faces | four faces around a face are adjacent to it; only one face is opposite |
| Never together | two faces that are never seen together in any view are opposite |
| Four adjacent seen | if a face is seen with four different faces, the sixth face is its opposite |
| Two views sharing two faces | the two faces that differ are opposite each other |
| Net rule | in a flat net, two faces in a straight line with **one face between them** are opposite |

</div>

### Solved examples — dice

**Example 7.** A standard die shows 2 on top and 3 in front. What number is at the bottom?

- Bottom is opposite the top. On a standard die, opposite faces add up to 7.
- Bottom = 7 − 2 = **5**.

**Example 8.** Four views of the same die show these faces: (1, 2, 3), (1, 3, 5), (1, 5, 6), (1, 6, 2). What is opposite 1? What is opposite 2?

- Face 1 is seen next to 2, 3, 5 and 6 → these are its four adjacent faces. So **4 is opposite 1**.
- Face 2 is seen next to 1, 3 and 6. Its opposite must be 4 or 5. But 4 is already opposite 1, and each face has only one opposite. So **5 is opposite 2**.
- That leaves **3 opposite 6**.

**Example 9.** Two views of a die: View 1 shows 1 on top, 2 in front, 3 on the right. View 2 shows 2 on top, 1 in front, 5 on the right. What is opposite 3?

<figure>
<svg viewBox="0 0 400 160" width="400" height="160" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="16">
<rect x="40" y="60" width="70" height="70" />
<polygon points="40,60 75,30 145,30 110,60" />
<polygon points="110,60 145,30 145,100 110,130" />
<text x="75" y="101" text-anchor="middle" fill="currentColor" stroke="none">2</text>
<text x="93" y="51" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">1</text>
<text x="128" y="86" text-anchor="middle" fill="currentColor" stroke="none">3</text>
<text x="92" y="152" text-anchor="middle" fill="currentColor" stroke="none" font-size="12">View 1</text>
<rect x="240" y="60" width="70" height="70" />
<polygon points="240,60 275,30 345,30 310,60" />
<polygon points="310,60 345,30 345,100 310,130" />
<text x="275" y="101" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">1</text>
<text x="293" y="51" text-anchor="middle" fill="currentColor" stroke="none">2</text>
<text x="328" y="86" text-anchor="middle" fill="currentColor" stroke="none">5</text>
<text x="292" y="152" text-anchor="middle" fill="currentColor" stroke="none" font-size="12">View 2</text>
</svg>
<figcaption>Faces 1 and 2 are in both views. The faces that touch both 1 and 2 sit at the two ends of their shared edge — they are 3 and 5, and they must be opposite each other.</figcaption>
</figure>

- 1 and 2 appear in both views; the third faces differ (3 and 5).
- Exactly two faces touch both 1 and 2, and those two are opposite each other.
- **3 is opposite 5.**

**Example 10.** A die is made from this net. Which number is opposite 2? Which is opposite 5?

<figure>
<svg viewBox="0 0 260 180" width="260" height="180" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="16">
<rect x="70" y="10" width="50" height="50" />
<rect x="20" y="60" width="50" height="50" /><rect x="70" y="60" width="50" height="50" stroke="var(--accent)" /><rect x="120" y="60" width="50" height="50" /><rect x="170" y="60" width="50" height="50" stroke="var(--accent)" />
<rect x="70" y="110" width="50" height="50" />
<text x="95" y="41" text-anchor="middle" fill="currentColor" stroke="none">5</text>
<text x="45" y="91" text-anchor="middle" fill="currentColor" stroke="none">1</text>
<text x="95" y="91" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">2</text>
<text x="145" y="91" text-anchor="middle" fill="currentColor" stroke="none">3</text>
<text x="195" y="91" text-anchor="middle" fill="var(--accent)" stroke="none" font-weight="bold">4</text>
<text x="95" y="141" text-anchor="middle" fill="currentColor" stroke="none">6</text>
</svg>
<figcaption>In the straight row 1-2-3-4, faces with one face between them are opposite: 1 and 3, 2 and 4. In the column 5-2-6, 5 and 6 are opposite.</figcaption>
</figure>

- Row 1–2–3–4: skip one → **1 opposite 3**, **2 opposite 4**.
- Column 5–2–6: skip one → **5 opposite 6**.

**Example 11.** On a standard die, which numbers can never be seen together with 4?

- On a standard die 4 is opposite 3 (3 + 4 = 7). Opposite faces are never seen together.
- Answer: **3** (and 4 itself is the face).

> **Common mistake:** Using the "sum is 7" rule when the question does not say "standard die". For an ordinary die in a reasoning question, use only the views given.

## Part C — Cubes

A large cube is painted on all faces and then cut into n × n × n small equal cubes. (Here n is the number of small cubes along one edge.)

<div class="formula">

| Small cubes with … | Where they are | Number |
|---|---|---|
| 3 faces painted | corners | 8 (always) |
| 2 faces painted | edges, not corners | 12(n − 2) |
| 1 face painted | middle of each face | 6(n − 2)² |
| No face painted | hidden inside | (n − 2)³ |
| Total | | n³ |

</div>

### Solved examples — cubes

**Example 12.** A cube painted red on all faces is cut into 27 equal small cubes. How many small cubes have (a) 3 red faces (b) 2 red faces (c) 1 red face (d) no red face?

- 27 = 3³ → n = 3, so n − 2 = 1.
- (a) **8** (b) 12 × 1 = **12** (c) 6 × 1² = **6** (d) 1³ = **1**.
- Check: 8 + 12 + 6 + 1 = 27 ✓.

**Example 13.** A painted cube of edge 4 cm is cut into cubes of edge 1 cm. How many small cubes have no paint? How many have exactly one painted face?

- n = 4 ÷ 1 = 4; n − 2 = 2.
- No paint: 2³ = **8**. One face: 6 × 2² = **24**.
- (Also: 2 faces 12 × 2 = 24; 3 faces 8. Total 8 + 24 + 24 + 8 = 64 ✓.)

**Example 14.** A painted cube is cut into 125 equal small cubes. How many have exactly two painted faces?

- 125 = 5³ → n = 5; n − 2 = 3.
- Two faces: 12 × 3 = **36**.

**Example 15.** What is the least number of straight cuts needed to divide a cube into 27 equal small cubes?

- 27 = 3 × 3 × 3: you need 3 pieces along each of the three directions.
- 3 pieces along one direction needs 2 cuts. So 2 + 2 + 2 = **6** cuts.

## Part D — Mirror and water images

### Mirror image (mirror standing to the side)

A mirror placed to the right or left of an object **swaps left and right** but keeps top and bottom the same.

<figure>
<svg viewBox="0 0 440 110" width="440" height="110" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="28">
<text x="30" y="60" fill="currentColor" stroke="none">BIHAR</text>
<line x1="220" y1="15" x2="220" y2="85" stroke="var(--accent)" stroke-dasharray="5 4" stroke-width="2" />
<g transform="translate(440,0) scale(-1,1)">
<text x="30" y="60" fill="currentColor" stroke="none">BIHAR</text>
</g>
<text x="110" y="100" text-anchor="middle" fill="currentColor" stroke="none" font-size="12">object</text>
<text x="220" y="100" text-anchor="middle" fill="var(--accent)" stroke="none" font-size="12">mirror</text>
<text x="330" y="100" text-anchor="middle" fill="currentColor" stroke="none" font-size="12">mirror image</text>
</svg>
<figcaption>In a mirror the order of letters is reversed and each letter is flipped left to right. I, H and A look the same; B and R are turned around.</figcaption>
</figure>

<div class="formula">

| Fact | Detail |
|---|---|
| Capital letters unchanged in a side mirror | A, H, I, M, O, T, U, V, W, X, Y |
| Capital letters unchanged in water (mirror below) | B, C, D, E, H, I, K, O, X |
| Unchanged in both | H, I, O, X |
| Clock in a side mirror | mirror time = 11:60 − actual time (use 23:60 − time if the hour is 11 or 12) |
| Clock in a mirror, check | actual time + mirror time = 12:00 |

</div>

### Solved examples — mirror images

**Example 16.** Which of these words looks the same in a side mirror, apart from the reversed order of letters? (a) BIHAR (b) TOMATO (c) PATNA (d) GAYA

- TOMATO has only T, O, M, A — all mirror-symmetric letters. Its mirror image reads **OTAMOT**, with every letter looking normal.
- BIHAR has B and R, PATNA has P and N, GAYA has G — these letters look reversed in a mirror.
- Answer: **(b) TOMATO**.

**Example 17.** A clock shows 3:40. What time does its mirror image show?

- 11:60 − 3:40 = **8:20**.
- Check: 3:40 + 8:20 = 12:00 ✓.

**Example 18.** A clock shows 4:15. What is the mirror time?

- 11:60 − 4:15 = **7:45**.

**Example 19.** A clock shows 12:20. What is the mirror time?

- The hour is 12, so use 23:60: 23:60 − 12:20 = **11:40**.
- Check by picture: the minute hand at "4" appears at "8" (40 minutes); the hour hand just after 12 appears just before 12 → 11:40 ✓.

**Example 20.** The mirror image of a clock shows 2:30. What is the actual time?

- Actual = 11:60 − 2:30 = **9:30**. (The rule works in both directions.)

**Example 21.** Which capital letter looks the same both in a side mirror and in water? (a) B (b) M (c) X (d) E

- Side mirror keeps M and X. Water keeps B, E and X.
- Only **X** is in both lists.

**Example 22.** If the word "MOM" is held in front of a side mirror, what do you see?

- Reverse order: M O M → M O M (the word is a palindrome).
- M and O are mirror-symmetric → it looks exactly like **MOM**.

> **Prelims angle:** BPSC shows mirror/water images as pictures in the options. Use two checks: (1) is the **order** reversed (side mirror) or **upside down** (water)? (2) Look at one non-symmetric letter (like R, P, F or a number like 2, 7) — is it flipped the correct way? These two checks remove the wrong options quickly.

## Common traps

1. **Puzzles:** filling a guess too early. Place only what a clue forces; keep two cases if needed.
2. **"Immediately above/after"** means the very next floor or day; "above/after" alone means anywhere later.
3. **Dice:** using the "sum 7" rule for a non-standard die.
4. **Dice views:** a face next to another in a view is **adjacent**, never opposite.
5. **Cubes:** n is the number of small cubes along one edge, not the total number of cubes.
6. **Mirror clocks:** subtract from 11:60 (not 12:00) to avoid borrowing errors; for hours 11 and 12 use 23:60.
7. **Side mirror vs water:** a side mirror swaps left–right; water swaps top–bottom.
8. **Figure counting:** count by size (single parts, then pairs, then triples) so you do not miss or repeat.

## Quick revision

- Puzzle grid: definite clues → linking clues → negative clues.
- Triangles with k lines from one corner: (k + 1)(k + 2) ÷ 2. Squares in n × n grid: 1² + … + n². Rectangles in an m × n grid: [m(m+1)/2] × [n(n+1)/2].
- Standard die: opposite faces sum to 7.
- Never seen together → opposite. Seen with four faces → the sixth is opposite.
- Two views sharing two faces → the differing faces are opposite.
- Net: in a straight line, skip one → opposite.
- Painted cube (n per edge): 8 corners; 12(n − 2) two-face; 6(n − 2)² one-face; (n − 2)³ hidden.
- Mirror time = 11:60 − time; times add to 12:00.
- Side-mirror-symmetric letters: A H I M O T U V W X Y. Water-symmetric: B C D E H I K O X.

## Key terms

| Term | Simple meaning |
|---|---|
| Puzzle | A set of clues to be fitted together into one arrangement |
| Grid method | A table used to record what each clue allows or rules out |
| Die / dice | A six-faced cube with numbers or dots (one die, two dice) |
| Adjacent faces | Faces that share an edge |
| Opposite faces | Faces that are parallel and never seen together |
| Net | A flat shape that folds into a cube |
| Mirror image | What an object looks like in a mirror placed to its side |
| Water image | What an object looks like reflected in water below it |
| Palindrome | A word that reads the same backwards (MOM, MALAYALAM) |

## Practice

### Problems

1. Four people W, X, Y and Z have their birthdays in four different months: March, June, September and December. X's birthday is in June. W's birthday comes after X's but before Y's. In which month is Z's birthday?
2. How many triangles are there in a triangle with three lines drawn from the top corner to the base?
3. How many squares are there in a 3 × 3 grid?
4. A standard die shows 6 on top. What is at the bottom?
5. Three views of a die show (2, 3, 4), (2, 4, 5) and (2, 5, 6). Which number is opposite 3?
6. A painted cube is cut into 64 equal small cubes. How many have exactly two painted faces?
7. A clock shows 9:10. What does its mirror image show?
8. Which of these looks the same in water? (a) KICK (b) PICK (c) MAKE (d) RICE
9. A painted cube is cut into small cubes, and exactly 1 small cube has no paint. How many small cubes are there?

### Answers

1. Months in order: March, June, September, December. X = June. W is after X and before Y → W = September, Y = December. The only month left is March → **Z = March**.
2. k = 3 → (3 + 1)(3 + 2) ÷ 2 = **10**.
3. 9 + 4 + 1 = **14**.
4. 7 − 6 = **1**.
5. Views (2, 3, 4) and (2, 4, 5) share faces 2 and 4. The faces that differ, **3 and 5, are opposite** (two-shared-faces rule). (Also, 2 is seen with 3, 4, 5 and 6, so 1 is opposite 2, and then 4 is opposite 6.)
6. n = 4 → 12 × (4 − 2) = **24**.
7. 11:60 − 9:10 = **2:50**.
8. K, I and C are all symmetric top-to-bottom → **(a) KICK**.
9. (n − 2)³ = 1 → n = 3 → **27** cubes.

**Next:** [Arithmetic Quick Revision Map](/interview/bpsc-2027/mental-ability/arithmetic-quick-revision-map)
