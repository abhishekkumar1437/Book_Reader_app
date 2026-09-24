---
title: Number System
part: Arithmetic
summary: Divisibility rules, HCF and LCM, unit digits, remainders, counting factors, and the classic questions about digits and numbers that open most papers.
---

## Where it appears

Every exam: divisibility, HCF/LCM word problems (bells ringing together, tiles fitting a floor), unit digit of a power, remainders, number of factors, sum of a sequence, and "how many numbers between..." counting. Usually one to three questions, quick marks if the rules are memorised.

## Formulae

<div class="formula">

| Divisibility by | Test |
|---|---|
| 2, 5, 10 | last digit even · 0 or 5 · 0 |
| 3, 9 | digit sum divisible by 3 · by 9 |
| 4, 8 | last two digits ÷ 4 · last three digits ÷ 8 |
| 11 | alternating sum of digits (from the right) is 0 or a multiple of 11 |
| 6, 12 | by 2 and 3 · by 3 and 4 |
| 25 | last two digits 00, 25, 50, 75 |

| What | Formula |
|---|---|
| HCF × LCM (two numbers) | product of the two numbers |
| 1 + 2 + … + n | n(n + 1) ÷ 2 |
| 1² + 2² + … + n² | n(n + 1)(2n + 1) ÷ 6 |
| 1³ + 2³ + … + n³ | [n(n + 1) ÷ 2]² |
| Number of factors of N = pᵃ qᵇ rᶜ | (a + 1)(b + 1)(c + 1) |
| Sum of factors | (pᵃ⁺¹ − 1)/(p − 1) × (qᵇ⁺¹ − 1)/(q − 1) × … |
| Trailing zeros of n! | ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + … |
| Remainder of a product | (a × b) mod m = [(a mod m) × (b mod m)] mod m |
| Remainder trick | if a ≡ −1 (mod m) then aⁿ ≡ (−1)ⁿ (mod m) |

| Unit digit of | Cycle (repeat every 4, or 2) |
|---|---|
| 2ⁿ | 2, 4, 8, 6 |
| 3ⁿ | 3, 9, 7, 1 |
| 7ⁿ | 7, 9, 3, 1 |
| 8ⁿ | 8, 4, 2, 6 |
| 4ⁿ | 4, 6 |
| 9ⁿ | 9, 1 |
| 0, 1, 5, 6 | never change |

Exponent ÷ cycle length: the remainder picks the position; remainder 0 means the last entry.

</div>

## Divisibility: the rules in use

Test 7 and 13 by the "subtract twice the last digit" (7) rule or by splitting into groups of three digits and alternating sums (7, 11, 13 all divide 1001). For exam speed, 7 and 13 questions are rare; 3, 4, 8, 9, 11 are common.

**Hint:** a question giving a number with a missing digit and asking for divisibility by 9 or 11 is a digit-sum question. Write the sum, set the condition, solve for the digit.

**Example.** For what digit x is 4x62 divisible by 9?
Digit sum = 4 + x + 6 + 2 = 12 + x. Multiples of 9 near: 18. x = 6.

**Example.** Is 918,082 divisible by 11?
Alternating sum from the right: 2 − 8 + 0 − 8 + 1 − 9 = −22, divisible by 11. Yes.

## HCF and LCM

**HCF** (greatest common divisor) answers "largest measure that fits exactly": longest tape to measure three lengths, largest tile for a floor, greatest number dividing several numbers leaving equal remainders.

**LCM** answers "smallest common multiple": when bells ringing at different intervals ring together, smallest number divisible by several numbers, when runners on a track meet at the start.

Find HCF by prime factorisation (common primes, lowest powers) or by repeated division (Euclid). LCM: all primes, highest powers.

**Hints for the word problems:**

- "Greatest number that divides a, b, c leaving remainder r each" → HCF(a − r, b − r, c − r).
- "Greatest number that divides a, b, c leaving the same remainder" → HCF of the differences (a − b, b − c).
- "Smallest number that when divided by a, b, c leaves remainder r each" → LCM(a, b, c) + r.
- "Smallest number divisible by a, b, c that leaves remainder k when divided by d" → step through multiples of LCM.
- Fractions: HCF of fractions = HCF of numerators / LCM of denominators; LCM of fractions = LCM of numerators / HCF of denominators.

**Example.** Three bells ring at intervals of 12, 18, and 30 seconds. They ring together at 9:00. When next together?
LCM(12, 18, 30): 12 = 2²·3, 18 = 2·3², 30 = 2·3·5 → 2²·3²·5 = 180 seconds = 3 minutes. Together at 9:03.

**Example.** The greatest number that divides 62, 132, and 237 leaving remainder 2 in each case.
HCF(60, 130, 235). 60 = 2²·3·5, 130 = 2·5·13, 235 = 5·47. HCF = 5.

**Example.** HCF of two numbers is 12, LCM is 360, one number is 72. Find the other.
Product = 12 × 360 = 4320; other = 4320 / 72 = 60.

## Unit digit of a power

Use the cycle of the base's unit digit. Divide the exponent by the cycle length (4 for 2, 3, 7, 8; 2 for 4, 9); the remainder picks the position; remainder 0 means the last entry of the cycle.

**Example.** Unit digit of 7^103.
Cycle of 7: 7, 9, 3, 1. 103 ÷ 4 leaves remainder 3 → third entry → 3.

**Example.** Unit digit of 24^38 × 13^21.
4^38: 38 even → 6. 3^21: 21 mod 4 = 1 → 3. Product 6 × 3 = 18 → 8.

## Remainders

Reduce the base first, then use small powers and the (−1) trick.

**Example.** Remainder when 2^50 is divided by 7.
2³ = 8 ≡ 1 (mod 7). 2^50 = (2³)^16 × 2² ≡ 1 × 4 = 4.

**Example.** Remainder when 17^200 is divided by 18.
17 ≡ −1 (mod 18), so 17^200 ≡ (−1)^200 = 1.

**Example.** Remainder when 1! + 2! + 3! + ... + 50! is divided by 6.
From 3! onwards every factorial is divisible by 6. 1! + 2! = 3. Remainder 3.

## Counting factors

**Example.** Number of factors of 360.
360 = 2³ × 3² × 5. Factors = (3+1)(2+1)(1+1) = 24.

Odd factors: drop the power of 2 → (2+1)(1+1) = 6. Even factors = 24 − 6 = 18.

**Example.** Sum of all factors of 72.
72 = 2³ × 3². Sum = (2⁴ − 1)/(2 − 1) × (3³ − 1)/(3 − 1) = 15 × 13 = 195.

A number has an odd number of factors exactly when it is a perfect square.

## Counting numbers and sums

**Example.** How many numbers between 1 and 200 are divisible by 6 or 8?
By 6: floor(200/6) = 33. By 8: 25. By both (LCM 24): 8. Total = 33 + 25 − 8 = 50.

**Example.** Sum of all two-digit numbers divisible by 7.
First 14, last 98, count = (98 − 14)/7 + 1 = 13. Sum = 13 × (14 + 98)/2 = 13 × 56 = 728.

**Example.** How many zeros at the end of 100! ?
Count factors of 5: floor(100/5) + floor(100/25) = 20 + 4 = 24.

## Digit problems

"A two-digit number, sum of digits 9, reversing increases it by 27." Let the number be 10a + b. Then a + b = 9 and (10b + a) − (10a + b) = 9(b − a) = 27, so b − a = 3. Solve: b = 6, a = 3. Number 36.

**Hint:** reversing a two-digit number changes it by 9 × (difference of digits). Reversing a three-digit number changes it by 99 × (difference of first and last digits).

## Traps

- "Between 1 and 200" may or may not include the ends; read it.
- HCF × LCM = product holds for two numbers, not three.
- Unit-digit remainder 0 means the last cycle entry, not the first.
- "Divisible by 6 or 8" needs the subtraction of the overlap.
- "Smallest number leaving remainder r" is LCM + r, but check whether r is smaller than every divisor.

## Practice set

1. Find x if 5x37 is divisible by 11.
2. LCM of 24, 36, 40.
3. Greatest number dividing 43, 91, and 183 leaving the same remainder.
4. Smallest number that leaves remainder 3 when divided by 5, 6, 8.
5. Unit digit of 3^75 + 4^33.
6. Remainder of 3^101 divided by 8.
7. Number of factors of 1200.
8. Sum of all three-digit numbers divisible by 9.
9. How many numbers from 1 to 500 are divisible by neither 2 nor 5?
10. Number of trailing zeros in 150!.
11. A number when divided by 342 leaves remainder 47. What is the remainder when divided by 18?
12. The product of two numbers is 2028 and their HCF is 13. How many such pairs exist?

**Answers**

1. Alternating sum from the right: 7 − 3 + x − 5 = x − 1 → x = 1.
2. 24 = 2³·3, 36 = 2²·3², 40 = 2³·5 → 2³·3²·5 = 360.
3. HCF of differences: 91 − 43 = 48, 183 − 91 = 92 → HCF(48, 92) = 4.
4. LCM(5, 6, 8) = 120; answer 123.
5. 3^75: 75 mod 4 = 3 → 7. 4^33: odd → 4. Sum 11 → 1.
6. 3² = 9 ≡ 1 (mod 8); 3^101 = (3²)^50 × 3 ≡ 3.
7. 1200 = 2⁴·3·5² → 5·2·3 = 30.
8. First 108, last 999, count 100, sum = 100 × (108 + 999)/2 = 55,350.
9. Divisible by 2: 250; by 5: 100; by 10: 50. Either: 300. Neither: 200.
10. 150/5 = 30, 150/25 = 6, 150/125 = 1 → 37.
11. 342 = 18 × 19, so the number = 342k + 47 = 18(19k) + 47; 47 mod 18 = 11.
12. Numbers are 13a and 13b with ab = 12 and HCF(a, b) = 1: (1, 12), (3, 4) → 2 pairs.
