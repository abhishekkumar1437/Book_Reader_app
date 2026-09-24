---
title: Number Series, Clocks & Calendars
part: Data & Reasoning
summary: Spotting the rule in a series (differences, ratios, squares, alternating), the clock angle formula and hand-overlap times, and the odd-days method for finding the day of any date.
---

## Where it appears

CSAT and BPSC: number series and calendars regularly, clocks sometimes. SSC: series in the reasoning section; clocks and calendars occasionally. All three are short once the method is known.

## Number series

Check in this order, stopping at the first that fits:

1. **Differences** constant (AP), or differences forming their own pattern (2, 4, 6, ...; 1, 4, 9, ...).
2. **Ratios** constant (GP), or "×2 + 1", "×3 − 2" style mixed rules.
3. **Squares, cubes, primes** possibly shifted: 4, 9, 16, 25 (squares); 2, 3, 5, 7, 11 (primes); 1, 8, 27 (cubes).
4. **Alternating series**: two interleaved patterns; look at odd positions and even positions separately.
5. **Second differences**: for 2, 6, 12, 20, 30 the differences 4, 6, 8, 10 increase by 2.
6. **Products of consecutive terms**, or each term = sum of the previous two (Fibonacci-like).

**Example.** 3, 7, 15, 31, 63, ? Each is ×2 + 1 → 127.

**Example.** 2, 5, 10, 17, 26, ? Differences 3, 5, 7, 9 → next 11 → 37. (Also n² + 1.)

**Example.** 1, 4, 9, 16, 25, 36, 49, ? Squares → 64.

**Example.** 5, 11, 23, 47, ? ×2 + 1 → 95.

**Example.** 3, 8, 6, 14, 9, 20, 12, ? Alternating: 3, 6, 9, 12 and 8, 14, 20 (+6) → 26.

**Example.** 2, 6, 12, 20, 30, ? n(n + 1) → 42.

**Example.** Find the wrong term: 2, 3, 5, 8, 13, 22, 34. Fibonacci-like sums: 2 + 3 = 5, 3 + 5 = 8, 5 + 8 = 13, 8 + 13 = 21 (not 22), 13 + 21 = 34. Wrong term 22.

**Hint:** write the differences under the series immediately; most exam series are visible at the first or second difference.

## Clocks

<figure>
<svg viewBox="0 0 220 220" width="220" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<circle cx="110" cy="110" r="95" />
<g fill="currentColor" stroke="none">
<text x="104" y="30">12</text><text x="188" y="116">3</text><text x="106" y="200">6</text><text x="24" y="116">9</text>
<text x="146" y="43">1</text><text x="176" y="72">2</text><text x="176" y="164">4</text><text x="146" y="194">5</text>
<text x="66" y="194">7</text><text x="36" y="164">8</text><text x="36" y="72">10</text><text x="66" y="43">11</text>
</g>
<line x1="110" y1="110" x2="110" y2="40" stroke="var(--accent)" stroke-width="3" />
<line x1="110" y1="110" x2="155" y2="80" stroke="currentColor" stroke-width="4" />
<circle cx="110" cy="110" r="3" fill="currentColor" stroke="none" />
<path d="M110 60 A50 50 0 0 1 143 89" stroke="var(--accent)" stroke-dasharray="3 3" />
<text x="126" y="66" fill="var(--accent)" stroke="none">θ</text>
</svg>
<figcaption>At 2:00 the hour hand (short) is at 60° and the minute hand (long) at 0°. The minute hand gains 5.5° per minute on the hour hand.</figcaption>
</figure>

<div class="formula">

| Clocks | Formula |
|---|---|
| Angle at H hours M minutes | |30H − 5.5M| (if over 180°, use 360° minus it) |
| Hand speeds | minute 6°/min · hour 0.5°/min · relative 5.5°/min |
| Hands together | every 65 5/11 min · 11 times in 12 h · 22 times a day |
| Hands opposite · at right angles | 11 times in 12 h · 22 times in 12 h (44 a day) |
| Time after H o'clock for angle θ | M = (30H ± θ) ÷ 5.5 minutes |
| Clock gaining x min per day | shows ahead by x × (hours elapsed ÷ 24) |

</div>

**Example.** Angle at 3:40. |90 − 220| = 130°.

**Example.** Angle at 7:20. |210 − 110| = 100°.

**Example.** When between 4 and 5 are the hands together? M = 120/5.5 = 21 9/11 minutes past 4.

**Example.** When between 5 and 6 are the hands at right angles? M = (150 ± 90)/5.5 → 60/5.5 = 10 10/11 and 240/5.5 = 43 7/11 minutes past 5.

**Example.** A clock is set right at 8 am and gains 10 minutes in 24 hours. What does it show at 8 pm the same day? Gains 5 minutes in 12 hours → 8:05 pm.

**Example.** How many times do the hands overlap between 12 noon and 12 midnight? 11 (the 12 o'clock overlap counted once).

## Calendars

<div class="formula">

| Calendars | Rule |
|---|---|
| Odd days | days mod 7 · ordinary year 1 · leap year 2 |
| Leap year | divisible by 4; century years only if divisible by 400 (1900 no, 2000 yes, 2100 no) |
| Odd days in 100 · 200 · 300 · 400 years | 5 · 3 · 1 · 0 |
| Odd days per month | Jan 3 · Feb 0 (1 leap) · Mar 3 · Apr 2 · May 3 · Jun 2 · Jul 3 · Aug 3 · Sep 2 · Oct 3 · Nov 2 · Dec 3 |
| Reference | 31 Dec 2000 (and every 400-year block end) is a Sunday · 1 Jan 0001 was a Monday |
| Day code | 0 Sun · 1 Mon · 2 Tue · 3 Wed · 4 Thu · 5 Fri · 6 Sat |
| Same calendar again | when the odd days between add to a multiple of 7 with the same leap status (often 6 or 11 years) |

</div>

**Method for "what day was date X":** odd days from the reference (31 Dec 2000 = Sunday, count 0) up to the date, add, take mod 7.

**Example.** What day was 15 August 1947?
Up to 1600: 0 odd days. 1601 to 1900: 300 years → 1 odd day. 1901 to 1946: 46 years with 11 leap years (1904 to 1944) → 46 + 11 = 57 → 57 mod 7 = 1. Total so far 2. 1947 up to 15 Aug: Jan 31 + Feb 28 + Mar 31 + Apr 30 + May 31 + Jun 30 + Jul 31 + 15 = 227 → 227 mod 7 = 3. Total 5 → Friday.

**Example.** 26 January 1950?
Up to 1900: 1. 1901 to 1949: 49 years, 12 leap (1904 to 1948) → 61 → 5. 1950 up to 26 Jan: 26 → 5. Total 11 → 4 → Thursday.

**Example.** If 1 January 2026 is a Thursday, what day is 1 January 2027? 2026 is not a leap year → 1 odd day → Friday.

**Example.** Which year after 2025 has the same calendar as 2025? 2025 is ordinary. Odd days: 2025 → 1, 2026 → 1, 2027 → 1, 2028 → 2, 2029 → 1, 2030 → 1: total 7 → 2031 has the same calendar.

**Example.** How many odd days in 250 years? 200 → 3, 50 years with 12 leap years → 62 → 6; total 9 → 2.

**Example.** How many days from 15 March to 20 August of the same (non-leap) year, exclusive of the first day? Mar 16 + Apr 30 + May 31 + Jun 30 + Jul 31 + Aug 20 = 158.

## Traps

- The angle formula gives the smaller angle only after reflecting anything above 180.
- "Hands together" happens 11 times in 12 hours, not 12; between 11 and 1 there is only the 12:00 overlap.
- Century years: 1900 is not a leap year.
- When counting leap years in a range, check whether the end years are included.
- Odd-day arithmetic is mod 7; 57 odd days means 1.

## Practice set

1. 4, 9, 19, 39, 79, ?
2. 1, 2, 6, 24, 120, ?
3. 7, 10, 8, 11, 9, 12, ?
4. 1, 1, 2, 3, 5, 8, 13, ?
5. Find the wrong term: 3, 10, 27, 4, 16, 64, 5, 25, 125, 6, 36, 217.
6. Angle at 9:30.
7. Angle at 12:20.
8. When between 3 and 4 are the hands opposite each other?
9. At what time between 6 and 7 do the hands coincide?
10. What day was 2 October 1869?
11. If 1 March 2024 is a Friday, what day is 1 March 2025?
12. Number of odd days in 175 years.

**Answers**

1. ×2 + 1 → 159.
2. Factorials → 720.
3. Alternating +3, −2 → 10.
4. Fibonacci → 21.
5. Groups n, n², n³: 6, 36, 216 → wrong term 217.
6. |270 − 165| = 105°.
7. |0 − 110| = 110°.
8. M = (90 + 180)/5.5 = 270/5.5 = 49 1/11 minutes past 3.
9. M = 180/5.5 = 32 8/11 minutes past 6.
10. Up to 1800: 0 + 5 + 5 + 5 = 15 → 1... use blocks: 1600 → 0; 1601–1800: 200 years → 3. 1801–1868: 68 years, 17 leap → 85 → 1. 1869 to 2 Oct: 31+28+31+30+31+30+31+31+30+2 = 275 → 2. Total 3 + 1 + 2 = 6 → Saturday.
11. 2024 is leap but 29 Feb 2024 is before 1 March, so the span 1 Mar 2024 to 1 Mar 2025 has 365 days → 1 odd day → Saturday.
12. 100 → 5; 75 years with 18 leap → 93 → 2; total 7 → 0.
