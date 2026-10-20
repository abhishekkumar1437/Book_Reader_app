---
title: Coding-Decoding
part: Reasoning
summary: How words, numbers and symbols are hidden in a code — letter shifts, opposite letters, reversal, position numbers, letter-to-digit codes, sentence (common-word) codes, substitution and operator codes — with 20 solved examples and practice.
---

In **coding–decoding**, a word or number is changed into a secret form (the **code**) by a fixed rule. You are shown one example of the rule and asked to code (or decode) a new word. BPSC asks one or two such questions in most papers, and they are quick marks once you know the six common rules.

> **In simple words:** Write the word and its code one under the other. Compare each letter with the letter below it. The gap (+1, −2, opposite, reversed …) is the rule. Apply the same rule to the new word.

## The six common rules

<div class="formula">

| Type | Rule | Example |
|---|---|---|
| 1. Letter shift | every letter moves forward or backward by a fixed number | CAT → DBU (+1) |
| 2. Changing shift | the shift changes by position (+1, +2, +3 … or +1, −2, +1, −2) | FRIEND → HUMJTK (+2, +3, +4 …) |
| 3. Opposite letter | each letter is replaced by its opposite (27 − position) | GOOD → TLLW |
| 4. Reversal / rearrangement | letters are reversed or swapped in blocks | SCHOOL → LOOHCS |
| 5. Number codes | letters become their positions, or a sum of positions, or fixed digits | CAT = 3 + 1 + 20 = 24 |
| 6. Sentence and substitution codes | find common words in coded sentences; or names are swapped ("sky is called sea") | "na" = good |

</div>

Plus a seventh type that BPSC likes in the maths-flavoured form:

- **Operator coding** — the signs +, −, ×, ÷ are swapped by a given rule, and you must work out the value.

### The basic method

<figure>
<svg viewBox="0 0 420 150" width="420" height="150" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="15">
<text x="20" y="40" fill="currentColor" stroke="none" font-size="12">Word</text>
<text x="20" y="115" fill="currentColor" stroke="none" font-size="12">Code</text>
<text x="100" y="40" text-anchor="middle" fill="currentColor" stroke="none">F</text>
<text x="150" y="40" text-anchor="middle" fill="currentColor" stroke="none">R</text>
<text x="200" y="40" text-anchor="middle" fill="currentColor" stroke="none">I</text>
<text x="250" y="40" text-anchor="middle" fill="currentColor" stroke="none">E</text>
<text x="300" y="40" text-anchor="middle" fill="currentColor" stroke="none">N</text>
<text x="350" y="40" text-anchor="middle" fill="currentColor" stroke="none">D</text>
<text x="100" y="115" text-anchor="middle" fill="currentColor" stroke="none">H</text>
<text x="150" y="115" text-anchor="middle" fill="currentColor" stroke="none">U</text>
<text x="200" y="115" text-anchor="middle" fill="currentColor" stroke="none">M</text>
<text x="250" y="115" text-anchor="middle" fill="currentColor" stroke="none">J</text>
<text x="300" y="115" text-anchor="middle" fill="currentColor" stroke="none">T</text>
<text x="350" y="115" text-anchor="middle" fill="currentColor" stroke="none">K</text>
<line x1="100" y1="48" x2="100" y2="95" /><polygon points="96,95 100,102 104,95" fill="currentColor" />
<line x1="150" y1="48" x2="150" y2="95" /><polygon points="146,95 150,102 154,95" fill="currentColor" />
<line x1="200" y1="48" x2="200" y2="95" /><polygon points="196,95 200,102 204,95" fill="currentColor" />
<line x1="250" y1="48" x2="250" y2="95" /><polygon points="246,95 250,102 254,95" fill="currentColor" />
<line x1="300" y1="48" x2="300" y2="95" /><polygon points="296,95 300,102 304,95" fill="currentColor" />
<line x1="350" y1="48" x2="350" y2="95" /><polygon points="346,95 350,102 354,95" fill="currentColor" />
<text x="112" y="76" fill="var(--accent)" stroke="none" font-size="12">+2</text>
<text x="162" y="76" fill="var(--accent)" stroke="none" font-size="12">+3</text>
<text x="212" y="76" fill="var(--accent)" stroke="none" font-size="12">+4</text>
<text x="262" y="76" fill="var(--accent)" stroke="none" font-size="12">+5</text>
<text x="312" y="76" fill="var(--accent)" stroke="none" font-size="12">+6</text>
<text x="362" y="76" fill="var(--accent)" stroke="none" font-size="12">+7</text>
<text x="225" y="142" text-anchor="middle" fill="currentColor" stroke="none" font-size="12">Write positions: F6→H8, R18→U21, I9→M13 … the gaps are the rule.</text>
</svg>
<figcaption>Write the word above its code and mark the gap for each letter. Here the shift grows by one at each position.</figcaption>
</figure>

1. Write the word and its code **letter under letter**.
2. Check the **first letter** of the code. Is it a shift of the first letter of the word? The opposite letter? The last letter of the word (reversal)?
3. Check the **second and third** letters. Is the shift the same, growing, or alternating?
4. If letters do not match up at all, check for **rearrangement** (reversal, halves reversed, pairs swapped).
5. Apply the rule to the new word **letter by letter**, using EJOTY to find positions quickly.

> **Remember:** Positions: A1 B2 C3 D4 E5 F6 G7 H8 I9 J10 K11 L12 M13 N14 O15 P16 Q17 R18 S19 T20 U21 V22 W23 X24 Y25 Z26. Opposite = 27 − position.

## Solved examples

### Letter shifts

**Example 1.** If CAT is coded as DBU, how is DOG coded?

- C → D (+1), A → B (+1), T → U (+1). Rule: +1.
- D → E, O → P, G → H. Answer: **EPH**.

**Example 2.** If MANGO is coded as OCPIQ, how is APPLE coded?

- M → O (+2), A → C (+2), N → P (+2), G → I (+2), O → Q (+2). Rule: +2.
- A → C, P → R, P → R, L → N, E → G. Answer: **CRRNG**.

**Example 3.** If WORK is coded as XMSI, how is PLAY coded?

- W → X (+1), O → M (−2), R → S (+1), K → I (−2). Rule: +1, −2 alternately.
- P → Q (+1), L → J (−2), A → B (+1), Y → W (−2). Answer: **QJBW**.

**Example 4.** If FRIEND is coded as HUMJTK, how is CANDLE coded?

- F → H (+2), R → U (+3), I → M (+4), E → J (+5), N → T (+6), D → K (+7). Rule: +2, +3, +4, +5, +6, +7.
- C(3) + 2 = 5 = E; A(1) + 3 = 4 = D; N(14) + 4 = 18 = R; D(4) + 5 = 9 = I; L(12) + 6 = 18 = R; E(5) + 7 = 12 = L.
- Answer: **EDRIRL**.

### Opposite letters

**Example 5.** If GOOD is coded as TLLW, how is BAD coded?

- G (7) → T (20): 7 + 20 = 27. O (15) → L (12): 15 + 12 = 27. D (4) → W (23). Rule: opposite letter.
- B → Y, A → Z, D → W. Answer: **YZW**.

**Example 6.** In a code, A is written as 26, B as 25, C as 24, and so on. How is FACE written?

- Each letter gets its reverse position, 27 − n.
- F (6) → 21, A (1) → 26, C (3) → 24, E (5) → 22. Answer: **21-26-24-22**.

### Reversal and rearrangement

**Example 7.** If SCHOOL is coded as LOOHCS, how is TEACHER coded?

- The code is the word written backwards.
- TEACHER backwards: **REHCAET**.

**Example 8.** If COMPUTER is coded as PMOCRETU, how is KEYBOARD coded?

- Split into halves: COMP | UTER. Each half reversed: PMOC | RETU.
- KEYB | OARD → BYEK | DRAO. Answer: **BYEKDRAO**.

**Example 9.** If TRAIN is coded as RTIAN, how is BRAKE coded?

- Pairs swapped: TR → RT, AI → IA, N stays (no partner).
- BR → RB, AK → KA, E stays. Answer: **RBKAE**.

### Number codes

**Example 10.** If PEN = 35 (sum of letter positions), what is INK?

- Check: P 16 + E 5 + N 14 = 35 ✓.
- I 9 + N 14 + K 11 = **34**.

**Example 11.** If SUN = 54 and MOON = 57, what is STAR?

- SUN: 19 + 21 + 14 = 54 ✓. MOON: 13 + 15 + 15 + 14 = 57 ✓. Rule: sum of positions.
- STAR: 19 + 20 + 1 + 18 = **58**.

**Example 12.** If BIHAR is coded as 298118, how is PATNA coded?

- B = 2, I = 9, H = 8, A = 1, R = 18 → written together: 2 9 8 1 18.
- P = 16, A = 1, T = 20, N = 14, A = 1 → **16120141**.

**Example 13.** If ROSE is coded 6821, CHAIR is 73456 and PREACH is 961473, how is SEARCH coded?

- From ROSE: R = 6, O = 8, S = 2, E = 1.
- From CHAIR: C = 7, H = 3, A = 4, I = 5, R = 6 (R = 6 matches ROSE ✓).
- From PREACH: P = 9, R = 6, E = 1, A = 4, C = 7, H = 3 — all match ✓.
- SEARCH = S2 E1 A4 R6 C7 H3 → **214673**.

> **In simple words:** In fixed-digit codes each letter always has the same digit. Build a small table letter → digit, and check every new word against it.

### Sentence codes (common-word method)

**Example 14.** In a code language:
"pit na sa" means "you are good";
"na ho pa" means "good and bad";
"sa ho ri" means "you and me".
What is the code for "and"? What is the code for "bad"?

- Compare sentences 1 and 2: the common word is "good"; the common code is "na". So **good = na**.
- Sentences 1 and 3: common word "you"; common code "sa". So **you = sa**.
- Sentences 2 and 3: common word "and"; common code "ho". So **and = ho**.
- Sentence 2 = good, and, bad = na, ho, pa → **bad = pa**. (Also are = pit, me = ri.)

<figure>
<svg viewBox="0 0 420 160" width="420" height="160" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="10" y="10" width="190" height="34" rx="6" /><text x="105" y="32" text-anchor="middle" fill="currentColor" stroke="none">pit na sa = you are good</text>
<rect x="10" y="62" width="190" height="34" rx="6" /><text x="105" y="84" text-anchor="middle" fill="currentColor" stroke="none">na ho pa = good and bad</text>
<rect x="10" y="114" width="190" height="34" rx="6" /><text x="105" y="136" text-anchor="middle" fill="currentColor" stroke="none">sa ho ri = you and me</text>
<line x1="200" y1="27" x2="250" y2="50" /><line x1="200" y1="79" x2="250" y2="56" />
<text x="258" y="57" fill="var(--accent)" stroke="none">1 and 2 → good = na</text>
<line x1="200" y1="36" x2="250" y2="100" /><line x1="200" y1="131" x2="250" y2="106" />
<text x="258" y="107" fill="var(--accent)" stroke="none">1 and 3 → you = sa</text>
<line x1="200" y1="88" x2="250" y2="140" /><line x1="200" y1="140" x2="250" y2="146" />
<text x="258" y="150" fill="var(--accent)" stroke="none">2 and 3 → and = ho</text>
</svg>
<figcaption>Compare each pair of sentences: the word they share has the code they share.</figcaption>
</figure>

**Example 15.** In a code, "786" means "study very hard", "958" means "hard work pays", and "645" means "study and work". Which digit means "very"?

- 786 and 958 share "hard" and the digit 8 → **hard = 8**.
- 786 and 645 share "study" and 6 → **study = 6**.
- 958 and 645 share "work" and 5 → **work = 5**.
- 786 = study (6), very, hard (8) → **very = 7**. (Also pays = 9, and = 4.)

> **Common mistake:** In sentence codes, the **order** of code words is not the order of the English words. Never match "first word with first code". Always use common words.

### Substitution codes

**Example 16.** If "sky" is called "sea", "sea" is called "water", "water" is called "air", and "air" is called "cloud", where do fish live?

- Fish live in **water**.
- But water is called "air" in this language.
- Answer: **air**.

> **Common mistake:** Students answer "water" (the real answer) or "sea" (the word before). Find the real answer first, then give **the name it is called**.

### Operator coding

**Example 17.** If + means ×, × means −, − means ÷ and ÷ means +, find 8 + 2 × 6 − 3 ÷ 4.

- Replace the signs: 8 × 2 − 6 ÷ 3 + 4.
- BODMAS (division and multiplication before addition and subtraction): 8 × 2 = 16; 6 ÷ 3 = 2.
- 16 − 2 + 4 = **18**.

**Example 18.** If P means ÷, Q means ×, R means + and S means −, find 18 P 3 Q 4 R 6 S 2.

- Replace: 18 ÷ 3 × 4 + 6 − 2.
- Left to right for ÷ and ×: 18 ÷ 3 = 6; 6 × 4 = 24.
- 24 + 6 − 2 = **28**.

> **Common mistake:** Do **not** apply BODMAS to the coded signs. First replace every sign, then apply BODMAS to the real expression.

**Example 19.** If CAT = 24 (sum of positions), what is DOG?

- Check: C 3 + A 1 + T 20 = 24 ✓.
- D 4 + O 15 + G 7 = **26**.

**Example 20.** In a code, TEA is 579 and EAT is 795. What is ATE?

- TEA → 5, 7, 9 gives T = 5, E = 7, A = 9.
- Check EAT: E 7, A 9, T 5 → 795 ✓.
- ATE = A 9, T 5, E 7 → **957**.

## Shortcut checklist

- First letter of code = next/previous letters of first letter of word → **shift**.
- First letter of code = last letter of word → **reversal** (or halves reversed).
- Code letter + word letter = 27 → **opposite**.
- Code is a number close to 20–80 for a 3–4 letter word → **sum of positions**.
- Code has many digits → **positions written side by side** or fixed digits.
- Several coded sentences → **common-word method**.

> **Prelims angle:** BPSC codes are usually single-rule (shift, opposite, reverse) or the sentence type. Operator coding (sign substitution) also appears as a maths-style question. Always check your rule on **at least two letters** before applying it — one letter can fit many rules.

## Common traps

1. **Checking only one letter.** C → D could be "+1" or part of "+1, +2, +3". Check all letters.
2. **Wrap-around:** Y + 3 = B (25 + 3 = 28 − 26 = 2). Z − 2 = X.
3. **Reversal plus shift:** sometimes the word is reversed *and* shifted. If the first code letter is near the last word letter, test this.
4. **Substitution trap:** give the *code name*, not the real name (Example 16).
5. **Operator coding:** replace all signs first, then BODMAS.
6. **Sentence codes:** order of code words is random.

## Quick revision

- Six rules: shift, changing shift, opposite, rearrangement, number codes, sentence/substitution codes.
- Opposite letter = 27 − position.
- Sum-of-positions codes: CAT 24, DOG 26, SUN 54, STAR 58.
- Common-word method: the word two sentences share has the code they share.
- Substitution codes: find the real answer, then give its code name.
- Operator codes: substitute first, then BODMAS.
- Verify the rule on at least two letters.

## Key terms

| Term | Simple meaning |
|---|---|
| Code | The changed (secret) form of a word or number |
| Decoding | Turning the code back into the original word |
| Shift | Moving a letter forward or backward in the alphabet |
| Opposite letter | The letter at position 27 − n (A ↔ Z) |
| Reversal | Writing the letters in the opposite order |
| Sentence code | A code where whole words are replaced by code words |
| Substitution | One name is used for another ("sky" is called "sea") |
| BODMAS | Order of operations: Brackets, Of, Division, Multiplication, Addition, Subtraction |

## Practice

### Problems

1. If BOOK is coded as CPPL, how is PAGE coded?
2. If LAMP is coded as OZNK, how is BIHAR coded?
3. If GAYA = 34 and the rule is the sum of letter positions, what is PATNA?
4. "ka pa na" means "red big ball", "na ta ra" means "ball is round", and "pa ri ta" means "big round tree". What is the code for "tree"?
5. If × means +, + means −, − means ÷ and ÷ means ×, find 12 × 4 + 18 − 6 ÷ 2.
6. If GARDEN is coded as NEDRAG, how is FLOWER coded?
7. If each letter is moved three places back, how is FIRE coded?
8. If RAIN is coded as 18-1-9-14, how is SNOW coded?
9. If "water" is called "food", "food" is called "tree", "tree" is called "sky" and "sky" is called "wall", on what do fruits grow?
10. If TEA is 579 and EAT is 795, how is TEE coded?

### Answers

1. +1 shift (B→C, O→P, O→P, K→L). PAGE → **QBHF**.
2. Opposite letters (L12 ↔ O15, A ↔ Z, M ↔ N, P16 ↔ K11). B → Y, I(9) → R(18), H(8) → S(19), A → Z, R(18) → I(9): **YRSZI**.
3. Check GAYA: 7 + 1 + 25 + 1 = 34 ✓. PATNA: 16 + 1 + 20 + 14 + 1 = **52**.
4. Sentences 1 & 2 share "ball" and "na" → ball = na. Sentences 1 & 3 share "big" and "pa" → big = pa. Sentences 2 & 3 share "round" and "ta" → round = ta. Sentence 3 left over: tree = **ri**.
5. Replace signs: 12 + 4 − 18 ÷ 6 × 2. Division and multiplication first, left to right: 18 ÷ 6 = 3, 3 × 2 = 6. Then 12 + 4 − 6 = **10**.
6. The word is reversed. FLOWER → **REWOLF**.
7. F(6) − 3 = C(3), I(9) − 3 = F(6), R(18) − 3 = O(15), E(5) − 3 = B(2): **CFOB**.
8. Letter positions: S 19, N 14, O 15, W 23 → **19-14-15-23**.
9. Fruits grow on a **tree**, and "tree" is called "**sky**". Answer: sky.
10. T = 5, E = 7, A = 9. TEE = **577**.

**Next:** [Blood Relations and Direction Sense](/interview/bpsc-2027/mental-ability/blood-relations-and-direction-sense)
