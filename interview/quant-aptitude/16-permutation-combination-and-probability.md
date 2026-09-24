---
title: Permutation, Combination & Probability
part: Data & Reasoning
summary: Counting with the multiplication rule, arrangements versus selections, the standard restrictions (together, never together, at least one), and probability as favourable over total, with cards, dice, coins, and balls.
---

## Where it appears

CSAT: one or two questions, usually simple probability or a counting question with small numbers. SSC: occasional. BPSC: occasional. Most questions are solved by listing cases carefully rather than by a formula.

## Formulae

<div class="formula">

| Counting | Formula |
|---|---|
| Multiplication rule | m ways then n ways ⇒ m × n · mutually exclusive alternatives add |
| n! | n × (n − 1) × … × 1 · 0! = 1 · 1, 2, 6, 24, 120, 720, 5040, 40320 |
| Permutations ⁿPᵣ (order matters) | n! ÷ (n − r)! |
| Arrangements in a row · circle · necklace | n! · (n − 1)! · (n − 1)! ÷ 2 |
| With repeated items | n! ÷ (p! q! …) |
| Combinations ⁿCᵣ (order ignored) | n! ÷ [r!(n − r)!] · ⁿCᵣ = ⁿCₙ₋ᵣ · ⁿC₂ = n(n − 1)/2 · Σ ⁿCᵣ = 2ⁿ |
| Together · never together | bundle as one unit, arrange inside · total − together |
| At least one | total − none |

| Probability | Formula |
|---|---|
| P(E) | favourable ÷ total, between 0 and 1 · P(not E) = 1 − P(E) |
| A or B (mutually exclusive) | P(A) + P(B) |
| A or B (general) | P(A) + P(B) − P(A and B) |
| A and B (independent) | P(A) × P(B) |
| Odds a : b in favour | P = a ÷ (a + b) |
| Standard totals | coin 2 · die 6 · two dice 36 · three coins 8 · cards 52 (4 suits × 13, 26 red, 12 face, 4 aces) |

</div>

## Counting

**Example.** How many 3-digit numbers can be formed from 1 to 5 without repetition? 5 × 4 × 3 = 60. With repetition: 125.

**Example.** How many 4-digit numbers have no repeated digit? First digit 9 choices (not 0), then 9, 8, 7 → 4,536.

**Example.** Arrangements of the letters of BANANA? 6!/(3! 2!) = 720/12 = 60.

**Example.** In how many ways can 5 people sit in a row if two particular people must sit together? Treat the pair as one: 4! × 2! = 48. Never together: 120 − 48 = 72.

**Example.** How many ways to choose a committee of 3 from 8 people? ⁸C₃ = 56. With a particular person always included: ⁷C₂ = 21. Always excluded: ⁷C₃ = 35.

**Example.** From 5 men and 4 women, a committee of 4 with at least 2 women? Cases: 2W 2M (6 × 10 = 60) + 3W 1M (4 × 5 = 20) + 4W (1) = 81.

**Example.** How many diagonals in a polygon of 12 sides? ¹²C₂ − 12 = 66 − 12 = 54.

**Example.** How many handshakes among 10 people? ¹⁰C₂ = 45.

**Example.** Number of ways to arrange 6 people around a round table: 5! = 120.

**Example.** How many words from the letters of EQUATION with vowels together? Vowels E, U, A, I, O (5) as one unit with Q, T, N: 4! × 5! = 24 × 120 = 2,880.

**Example.** How many even 3-digit numbers from digits 1, 2, 3, 4, 5, 6 without repetition? Last digit 3 choices, then 5 × 4 → 60.

## Probability

**Example.** Two dice: probability the sum is 8? Pairs (2,6), (3,5), (4,4), (5,3), (6,2) → 5/36.

**Example.** Two dice: sum at least 10? Sums 10 (3), 11 (2), 12 (1) → 6/36 = 1/6.

**Example.** Three coins: probability of exactly two heads? 3/8. At least one head? 1 − 1/8 = 7/8.

**Example.** One card from a pack: probability of a king or a heart? 4/52 + 13/52 − 1/52 = 16/52 = 4/13.

**Example.** A bag has 4 red and 6 blue balls; two drawn without replacement. Probability both red? ⁴C₂/¹⁰C₂ = 6/45 = 2/15. One of each? (4 × 6)/45 = 24/45 = 8/15.

**Example.** Same bag, two drawn with replacement, both red? (4/10)² = 4/25.

**Example.** A and B solve a problem with probabilities 1/2 and 1/3 independently. Probability it is solved? 1 − (1/2)(2/3) = 2/3.

**Example.** Probability that a leap year has 53 Sundays? A leap year has 52 weeks + 2 days; the extra two are one of seven consecutive pairs; two of them contain a Sunday → 2/7. (Ordinary year: 1/7.)

**Example.** A number is chosen from 1 to 100. Probability it is divisible by 3 or 5? 33 + 20 − 6 = 47 → 47/100.

**Example.** Two people are chosen from 3 boys and 2 girls. Probability both are boys? ³C₂/⁵C₂ = 3/10.

## Hints

- Order matters when positions or ranks differ (seating, digits, prizes); it does not for committees, handshakes, pairs.
- "At least" is nearly always total minus the complement.
- For dice and coins, list the sample space; 36 and 8 outcomes are small enough.
- Without replacement, the denominator shrinks each draw; with replacement it does not.
- Sanity-check a probability: between 0 and 1, and the complement should make sense.

## Traps

- Counting a pair twice (AB and BA) when order does not matter.
- Forgetting that a number cannot start with 0.
- Adding probabilities of events that are not mutually exclusive without subtracting the overlap.
- Circular arrangements: fix one seat to remove rotations.
- Treating "at least one" as a single case.

## Practice set

1. How many 5-letter arrangements of the letters of TABLE? How many start with T?
2. Arrangements of MISSISSIPPI.
3. Ways to select 2 balls from 7 distinct balls; ways to arrange 2 of them in order.
4. Committee of 5 from 6 men and 5 women with exactly 3 men.
5. 7 people in a row with A and B never together.
6. Number of 3-digit numbers with all digits odd.
7. Probability of getting a prime on one die.
8. Two dice: probability of a doublet or a sum of 7.
9. A bag has 5 white and 3 black balls; three drawn. Probability all white?
10. Probability of at least one six in two throws of a die.
11. A card is drawn: probability of a red face card.
12. Four coins are tossed: probability of more heads than tails.

**Answers**

1. 120; 24.
2. 11!/(4! 4! 2!) = 39,916,800/1,152 = 34,650.
3. ⁷C₂ = 21; ⁷P₂ = 42.
4. ⁶C₃ × ⁵C₂ = 20 × 10 = 200.
5. 7! − 6! × 2 = 5040 − 1440 = 3,600.
6. 5 × 5 × 5 = 125.
7. Primes 2, 3, 5 → 1/2.
8. Doublets 6, sum 7 gives 6, overlap 0 (a doublet sums to an even number) → 12/36 = 1/3.
9. ⁵C₃/⁸C₃ = 10/56 = 5/28.
10. 1 − (5/6)² = 11/36.
11. 6/52 = 3/26.
12. 3 heads (4) + 4 heads (1) = 5/16.
