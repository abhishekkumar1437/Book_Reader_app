---
title: Statistics, Graphs and Diagrams
part: GS Paper I
summary: The complete GS I statistics section at class 10 level — mean, median, mode, range, standard deviation, percentages, ratios, index numbers, and reading and drawing bar, pie and line graphs, with every formula solved step by step.
---

GS Paper I has a section on **statistical analysis, graphs and diagrams** at about class 10 level. Unlike essay-type answers, statistics answers are **exact**: if your method and arithmetic are correct, you get full marks. This chapter teaches every formula you need, with a worked example for each, and shows how to draw and read bar, pie and line graphs. [Chapter 07](/interview/bpsc-2027/mains-answer-writing/statistics-practice-problems) then gives 50 practice problems. For extra arithmetic practice, see [Percentages](/interview/quant-aptitude/percentages), [Averages](/interview/quant-aptitude/averages), [Ratio and Proportion](/interview/quant-aptitude/ratio-proportion-and-alligation) and [Data Interpretation](/interview/quant-aptitude/data-interpretation) in the Quant Aptitude book.

> **In simple words:** Statistics is about summarising many numbers. An **average** (mean, median, mode) tells you the centre. **Dispersion** (range, standard deviation) tells you how spread out the numbers are. **Graphs** show the numbers as a picture. Show every step, write the formula first, and give the answer with units.

All data in the examples are **hypothetical** (made up for practice) unless a source is named.

## How to write a statistics answer in the exam

Examiners give marks for the **method**, not just the final number. Use this five-step layout every time.

| Step | What to write |
|---|---|
| 1. Given | Copy the data in a neat table |
| 2. Formula | Write the formula in words and symbols |
| 3. Working table | Add columns (x, f, fx, cf, d, d² …) |
| 4. Substitution and calculation | Put values in the formula, line by line |
| 5. Answer + interpretation | Box the answer with units; one line on what it means |

> **Remember:** Keep 2 decimal places unless told otherwise. Write units (₹, kg, marks, persons). A one-line interpretation ("the average daily wage is ₹422.50") shows understanding and often earns the last mark.

## Basic terms

| Term | Meaning | Example |
|---|---|---|
| **Data** | Collected facts in number form | Marks of 40 students |
| **Variable** | The thing measured, which varies | Marks, wages, rainfall |
| **Raw data** | Data as collected, not arranged | 12, 25, 15, 18 … |
| **Frequency (f)** | How many times a value or class occurs | 8 students scored 10–20 |
| **Frequency distribution** | Table of values/classes with frequencies | See below |
| **Class interval** | A group of values, e.g. 10–20 | |
| **Lower / upper limit** | Smallest and largest value of a class | 10 and 20 in 10–20 |
| **Class width (h)** | Upper limit − lower limit | 20 − 10 = 10 |
| **Class mark (mid-point, x)** | (Lower + upper) ÷ 2 | (10 + 20) ÷ 2 = 15 |
| **Cumulative frequency (cf)** | Running total of frequencies | 5, 13, 25 … |
| **N or n** | Total number of observations (Σf) | 40 |
| **Σ (sigma)** | "Sum of" | Σfx = sum of all f × x |

### Exclusive and inclusive classes

- **Exclusive classes:** 0–10, 10–20, 20–30. The upper limit is *not* included in the class (a value of 10 goes in 10–20). Formulas for median and mode use these.
- **Inclusive classes:** 0–9, 10–19, 20–29. Both limits included.
- **Converting inclusive to exclusive:** find the gap between one class's upper limit and the next class's lower limit (19 and 20 → gap 1). Subtract half the gap (0.5) from every lower limit and add 0.5 to every upper limit: 9.5–19.5, 19.5–29.5 …

> **Common mistake:** Using inclusive classes directly in the median or mode formula. Always convert to exclusive classes first; otherwise L (the lower limit) is wrong.

### The two datasets used in this chapter

**Dataset A (ungrouped): marks of 10 students** — 12, 15, 18, 20, 15, 22, 15, 25, 18, 20

**Dataset B (grouped): marks of 40 students**

| Marks | 0–10 | 10–20 | 20–30 | 30–40 | 40–50 |
|---|---|---|---|---|---|
| Students (f) | 5 | 8 | 12 | 10 | 5 |

## Arithmetic mean

The **arithmetic mean** (usually just "mean" or "average") is the sum of values divided by the number of values. It uses every value, so it is affected by very large or very small values.

<div class="formula">

| Data type | Formula |
|---|---|
| Ungrouped | x̄ = Σx ÷ n |
| Discrete frequency | x̄ = Σfx ÷ Σf |
| Grouped — direct | x̄ = Σfx ÷ Σf, where x = class mark |
| Grouped — assumed mean | x̄ = A + Σfd ÷ Σf, where d = x − A |
| Grouped — step deviation | x̄ = A + (Σfu ÷ Σf) × h, where u = (x − A) ÷ h |
| Weighted mean | x̄w = Σwx ÷ Σw |
| Combined mean | x̄ = (n₁x̄₁ + n₂x̄₂) ÷ (n₁ + n₂) |

</div>

### Example 1: ungrouped mean (Dataset A)

Σx = 12 + 15 + 18 + 20 + 15 + 22 + 15 + 25 + 18 + 20 = **180**; n = 10

x̄ = 180 ÷ 10 = **18 marks**

### Example 2: discrete frequency mean

Number of children (x) in 30 families of a village:

| x | f | fx |
|---|---|---|
| 1 | 4 | 4 |
| 2 | 6 | 12 |
| 3 | 10 | 30 |
| 4 | 7 | 28 |
| 5 | 3 | 15 |
| **Total** | **Σf = 30** | **Σfx = 89** |

x̄ = Σfx ÷ Σf = 89 ÷ 30 = **2.97 children per family** (2.966… rounded).

### Example 3: grouped mean, direct method (Dataset B)

| Marks | f | Class mark x | fx |
|---|---|---|---|
| 0–10 | 5 | 5 | 25 |
| 10–20 | 8 | 15 | 120 |
| 20–30 | 12 | 25 | 300 |
| 30–40 | 10 | 35 | 350 |
| 40–50 | 5 | 45 | 225 |
| **Total** | **40** | | **1,020** |

x̄ = 1,020 ÷ 40 = **25.5 marks**

### Example 4: step deviation method (same data — faster with big numbers)

Take assumed mean A = 25 (the middle class mark) and h = 10. Then u = (x − 25) ÷ 10.

| x | f | u = (x − 25) ÷ 10 | fu |
|---|---|---|---|
| 5 | 5 | −2 | −10 |
| 15 | 8 | −1 | −8 |
| 25 | 12 | 0 | 0 |
| 35 | 10 | 1 | 10 |
| 45 | 5 | 2 | 10 |
| **Total** | **40** | | **Σfu = 2** |

x̄ = A + (Σfu ÷ Σf) × h = 25 + (2 ÷ 40) × 10 = 25 + 0.5 = **25.5 marks** ✓ (same as the direct method).

> **Memory trick:** Choose A as the class mark in the **middle** of the table. Then u becomes small whole numbers (−2, −1, 0, 1, 2) and the arithmetic is easy.

### Example 5: weighted mean

A candidate's marks: History 70 (weight 4), Polity 60 (weight 3), Geography 80 (weight 2), Economy 50 (weight 1).

x̄w = (70×4 + 60×3 + 80×2 + 50×1) ÷ (4 + 3 + 2 + 1) = (280 + 180 + 160 + 50) ÷ 10 = 670 ÷ 10 = **67**

(The simple mean would be 260 ÷ 4 = 65; weights change the answer.)

### Example 6: combined mean

Section A: 40 students, mean 62. Section B: 60 students, mean 55.

x̄ = (40×62 + 60×55) ÷ (40 + 60) = (2,480 + 3,300) ÷ 100 = 5,780 ÷ 100 = **57.8**

> **Common mistake:** Taking (62 + 55) ÷ 2 = 58.5. This is wrong because the sections are of unequal size. Always weight by the number of observations.

### Properties of the mean (often asked as short questions)

1. Σ(x − x̄) = 0 — deviations from the mean add up to zero.
2. If every value increases by k, the mean increases by k.
3. If every value is multiplied by k, the mean is multiplied by k.
4. The mean is affected by extreme values (outliers).

## Median

The **median** is the middle value when the data are arranged in order. Half the values lie below it and half above. It is **not** affected by extreme values, so it is better for skewed data such as incomes.

<div class="formula">

| Data type | Rule / formula |
|---|---|
| Ungrouped, n odd | Median = value of the ((n + 1) ÷ 2)th item |
| Ungrouped, n even | Median = average of the (n ÷ 2)th and (n ÷ 2 + 1)th items |
| Discrete frequency | Find cf; median = value whose cf first reaches or crosses N ÷ 2 (check the (N ÷ 2)th and (N ÷ 2 + 1)th items) |
| Grouped | Median = L + ((N ÷ 2 − cf) ÷ f) × h |
| | L = lower limit of median class; cf = cumulative frequency of class **before** it; f = frequency of median class; h = class width |

</div>

### Example 7: odd number of items

Data: 7, 3, 9, 5, 11 → in order: 3, 5, **7**, 9, 11. n = 5, (5 + 1) ÷ 2 = 3rd item. **Median = 7.**

### Example 8: even number of items (Dataset A)

In order: 12, 15, 15, 15, 18, **18**, 20, 20, 22, 25. n = 10 → 5th and 6th items = 18 and 18.

Median = (18 + 18) ÷ 2 = **18 marks**

### Example 9: discrete frequency (children data from Example 2)

| x | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| f | 4 | 6 | 10 | 7 | 3 |
| cf | 4 | 10 | 20 | 27 | 30 |

N = 30, so we need the 15th and 16th items. cf 10 covers items 1–10 (x ≤ 2); cf 20 covers items 11–20 (x = 3). Both the 15th and 16th items are 3. **Median = 3 children.**

### Example 10: grouped median (Dataset B)

| Marks | f | cf |
|---|---|---|
| 0–10 | 5 | 5 |
| 10–20 | 8 | 13 |
| **20–30** | **12** | **25** |
| 30–40 | 10 | 35 |
| 40–50 | 5 | 40 |

1. N = 40, N ÷ 2 = **20**.
2. The first cf to reach 20 is 25 → **median class 20–30**.
3. L = 20, cf (before) = 13, f = 12, h = 10.
4. Median = 20 + ((20 − 13) ÷ 12) × 10 = 20 + (7 ÷ 12) × 10 = 20 + 5.83 = **25.83 marks**

> **Common mistake:** Using the cf **of** the median class (25) instead of the cf of the class **before** it (13). Remember: "cf before".

## Mode

The **mode** is the value that occurs most often. Data can have one mode (unimodal), two (bimodal) or more. It is useful for "most common" questions — the most common shoe size, the most popular crop.

<div class="formula">

| Data type | Rule / formula |
|---|---|
| Ungrouped / discrete | The value with the highest frequency |
| Grouped | Mode = L + ((f₁ − f₀) ÷ (2f₁ − f₀ − f₂)) × h |
| | L = lower limit of modal class (class with highest f); f₁ = its frequency; f₀ = frequency of class before; f₂ = frequency of class after; h = class width |
| Empirical relation | Mode ≈ 3 Median − 2 Mean (for moderately skewed data) |

</div>

### Example 11: ungrouped mode (Dataset A)

15 occurs 3 times — more than any other value. **Mode = 15 marks.**

### Example 12: grouped mode (Dataset B)

1. Highest frequency is 12 → **modal class 20–30**.
2. L = 20, f₁ = 12, f₀ = 8, f₂ = 10, h = 10.
3. Mode = 20 + ((12 − 8) ÷ (2×12 − 8 − 10)) × 10 = 20 + (4 ÷ 6) × 10 = 20 + 6.67 = **26.67 marks**

### Example 13: checking with the empirical relation

Mode ≈ 3 × 25.83 − 2 × 25.5 = 77.5 − 51 = **26.5**. This is close to 26.67, as expected for moderately skewed data.

### Which average to use?

| Situation | Best average | Reason |
|---|---|---|
| Marks, heights, rainfall (no extreme values) | Mean | Uses all values |
| Incomes, house prices (a few very large values) | Median | Not pulled by extremes |
| Most common size, most popular choice | Mode | Shows the most frequent value |
| Open-ended classes ("above 60") | Median | Mean needs all class marks |
| Data in categories (crop names) | Mode | Only mode works for non-numbers |

> **Prelims angle:** Also asked in Prelims GMA: "which average is not affected by extreme values?" (median); "for a symmetric distribution, mean = median = mode".

## Measures of dispersion

Two villages can have the same average income but very different inequality. **Dispersion** measures how spread out the values are.

<div class="formula">

| Measure | Formula |
|---|---|
| Range | Largest value (L) − smallest value (S) |
| Coefficient of range | (L − S) ÷ (L + S) |
| Mean deviation (about mean) | Σ\|x − x̄\| ÷ n |
| Variance (ungrouped) | σ² = Σ(x − x̄)² ÷ n = Σx² ÷ n − x̄² |
| Standard deviation | σ = √variance |
| SD (discrete/grouped) | σ = √(Σfx² ÷ N − x̄²) |
| SD (step deviation) | σ = h × √(Σfu² ÷ N − (Σfu ÷ N)²) |
| Coefficient of variation | CV = (σ ÷ x̄) × 100 |

</div>

### Example 14: range (Dataset A)

L = 25, S = 12. Range = 25 − 12 = **13 marks**. Coefficient of range = 13 ÷ 37 = **0.35**.

### Example 15: standard deviation, simple data

Data: 2, 4, 4, 4, 5, 5, 7, 9 (n = 8).

1. Mean = 40 ÷ 8 = 5.
2. Deviations (x − 5): −3, −1, −1, −1, 0, 0, 2, 4.
3. Squares: 9, 1, 1, 1, 0, 0, 4, 16 → sum = **32**.
4. Variance = 32 ÷ 8 = **4**.
5. SD = √4 = **2**.

### Example 16: standard deviation (Dataset A), two methods

**Deviation method** (mean = 18):

| x | 12 | 15 | 15 | 15 | 18 | 18 | 20 | 20 | 22 | 25 |
|---|---|---|---|---|---|---|---|---|---|---|
| x − 18 | −6 | −3 | −3 | −3 | 0 | 0 | 2 | 2 | 4 | 7 |
| (x − 18)² | 36 | 9 | 9 | 9 | 0 | 0 | 4 | 4 | 16 | 49 |

Σ(x − x̄)² = **136**. Variance = 136 ÷ 10 = **13.6**. SD = √13.6 = **3.69 marks**.

**Shortcut method:** Σx² = 144 + 225 + 225 + 225 + 324 + 324 + 400 + 400 + 484 + 625 = 3,376.
Variance = 3,376 ÷ 10 − 18² = 337.6 − 324 = **13.6** ✓.

### Example 17: SD of a discrete frequency distribution (children data)

| x | f | fx | x² | fx² |
|---|---|---|---|---|
| 1 | 4 | 4 | 1 | 4 |
| 2 | 6 | 12 | 4 | 24 |
| 3 | 10 | 30 | 9 | 90 |
| 4 | 7 | 28 | 16 | 112 |
| 5 | 3 | 15 | 25 | 75 |
| **Total** | **30** | **89** | | **305** |

Mean = 89 ÷ 30 = 2.967. Variance = 305 ÷ 30 − (2.967)² = 10.167 − 8.801 = **1.366**. SD = √1.366 = **1.17 children**.

### Example 18: SD of grouped data by step deviation (Dataset B)

A = 25, h = 10.

| x | f | u | fu | u² | fu² |
|---|---|---|---|---|---|
| 5 | 5 | −2 | −10 | 4 | 20 |
| 15 | 8 | −1 | −8 | 1 | 8 |
| 25 | 12 | 0 | 0 | 0 | 0 |
| 35 | 10 | 1 | 10 | 1 | 10 |
| 45 | 5 | 2 | 10 | 4 | 20 |
| **Total** | **40** | | **2** | | **58** |

σ = 10 × √(58 ÷ 40 − (2 ÷ 40)²) = 10 × √(1.45 − 0.0025) = 10 × √1.4475 = 10 × 1.2031 = **12.03 marks**

Check by direct method: Σfx² = 31,800 → variance = 31,800 ÷ 40 − 25.5² = 795 − 650.25 = 144.75 → σ = √144.75 = 12.03 ✓.

### Example 19: coefficient of variation — who is more consistent?

Batsman P: mean score 50, SD 10. Batsman Q: mean 40, SD 12.

CV(P) = (10 ÷ 50) × 100 = **20%**. CV(Q) = (12 ÷ 40) × 100 = **30%**.

**Lower CV = more consistent → P is more consistent.**

### Properties of SD

| Change to every value | Effect on mean | Effect on SD |
|---|---|---|
| Add or subtract a constant k | Mean changes by k | **No change** |
| Multiply by k | Mean × k | SD × \|k\| (variance × k²) |

> **Common mistake:** Forgetting to take the square root at the end. Variance and SD are different: SD has the same unit as the data; variance has squared units.

## Percentages, ratios and averages in data

Many GS I statistics questions use simple percentages and ratios on a table.

<div class="formula">

| Concept | Formula |
|---|---|
| Percentage | (Part ÷ Whole) × 100 |
| Percentage change | ((New − Old) ÷ Old) × 100 |
| Percentage point change | New % − Old % |
| Successive changes a% and b% | Net = a + b + (a × b) ÷ 100 |
| Ratio share | Share of A = Total × (a ÷ (a + b + …)) |
| Decadal growth rate | ((P_later − P_earlier) ÷ P_earlier) × 100 |
| Compound growth (CAGR) | (Final ÷ Initial)^(1/years) − 1 |
| Sex ratio (Indian Census) | (Females ÷ Males) × 1,000 |
| Literacy rate (Census) | (Literates aged 7+ ÷ Population aged 7+) × 100 |
| Density | Population ÷ Area (persons per sq km) |

</div>

### Example 20: percentage change

Production rises from 250 tonnes to 300 tonnes. Change = ((300 − 250) ÷ 250) × 100 = **20%**.

### Example 21: percentage vs percentage point

Unemployment rate falls from 8% to 6%.
- Change in **percentage points** = 8 − 6 = **2 percentage points**.
- **Percentage** fall = (2 ÷ 8) × 100 = **25%**.

> **Common mistake:** Saying "unemployment fell by 2%". It fell by 2 percentage points, which is a 25% fall. Examiners notice this.

### Example 22: decadal growth

A district's population grows from 1,20,000 to 1,50,000 in ten years. Growth = (30,000 ÷ 1,20,000) × 100 = **25%** per decade.

> **Bihar connection:** In Census 2011, Bihar's sex ratio was **918** (918 females per 1,000 males), its density **1,106** persons per sq km and decadal growth (2001–11) about **25.4%**. These are formulas in action — use them in GS II answers too.

## Index numbers

An **index number** measures the change in a group of related values (prices, production, wages) over time, compared with a **base year** whose value is taken as **100**. India's **Consumer Price Index (CPI)** and **Wholesale Price Index (WPI)** are index numbers used to measure inflation (base years are being revised — check the latest series published by MoSPI and the Office of the Economic Adviser).

<div class="formula">

| Index | Formula |
|---|---|
| Simple (single item) price index | (p₁ ÷ p₀) × 100 |
| Simple aggregative | (Σp₁ ÷ Σp₀) × 100 |
| Simple average of price relatives | Σ((p₁ ÷ p₀) × 100) ÷ n |
| Laspeyres (base-year quantities) | (Σp₁q₀ ÷ Σp₀q₀) × 100 |
| Paasche (current-year quantities) | (Σp₁q₁ ÷ Σp₀q₁) × 100 |
| Fisher's ideal | √(Laspeyres × Paasche) |
| Inflation rate from index | ((I₁ − I₀) ÷ I₀) × 100 |
| Real value | (Money value ÷ Price index) × 100 |

</div>

p₀ = base-year price, p₁ = current-year price, q₀ = base-year quantity, q₁ = current-year quantity.

### Example 23: price indices for a household basket

| Item | p₀ (₹) | p₁ (₹) | q₀ | q₁ |
|---|---|---|---|---|
| Rice (per kg) | 40 | 50 | 10 | 12 |
| Salt (per kg) | 25 | 30 | 4 | 5 |
| Oil (per litre) | 60 | 66 | 2 | 2 |

**(a) Simple aggregative index** = (50 + 30 + 66) ÷ (40 + 25 + 60) × 100 = 146 ÷ 125 × 100 = **116.8**

**(b) Average of price relatives:** relatives = 125, 120, 110 → (125 + 120 + 110) ÷ 3 = **118.33**

**(c) Laspeyres:**
Σp₁q₀ = 50×10 + 30×4 + 66×2 = 500 + 120 + 132 = 752
Σp₀q₀ = 40×10 + 25×4 + 60×2 = 400 + 100 + 120 = 620
Index = 752 ÷ 620 × 100 = **121.29**

**(d) Paasche:**
Σp₁q₁ = 50×12 + 30×5 + 66×2 = 600 + 150 + 132 = 882
Σp₀q₁ = 40×12 + 25×5 + 60×2 = 480 + 125 + 120 = 725
Index = 882 ÷ 725 × 100 = **121.66**

**(e) Fisher** = √(121.29 × 121.66) = **121.47**

**Interpretation:** the cost of this basket rose by about 21% between the base year and the current year.

> **Remember:** Laspeyres uses **base-year** quantities (q₀) — "L for last/old"; Paasche uses **current-year** quantities (q₁). Fisher is their geometric mean and is called "ideal".

## Graphs and diagrams

Graphs present data as a picture so that patterns are seen at a glance. Every graph must have these parts:

| Part | Rule |
|---|---|
| **Title** | What, where, when ("Tube wells installed in five blocks, 2025") |
| **Axes labels** | Name and unit on both axes |
| **Scale** | Equal steps; start the value axis at 0 for bar graphs |
| **Legend** | When there is more than one series or colour |
| **Source / note** | "Hypothetical data" or the source |
| **Neatness** | Pencil, ruler, equal bar widths and gaps |

### Choosing the right diagram

| Data | Best diagram |
|---|---|
| Compare separate categories (districts, crops) | **Bar graph** |
| Compare two or three series across categories | **Multiple (grouped) bar graph** |
| Parts of a total across years | **Sub-divided (component) bar** or **percentage bar** |
| Share of parts in one total | **Pie chart** |
| Change over time (trend) | **Line graph** |
| Continuous frequency distribution | **Histogram**, **frequency polygon** |
| Finding median graphically | **Ogive** (cumulative frequency curve) |

### Bar graph

Bars of **equal width** with **equal gaps**; height proportional to the value; value axis starts at 0.

**Data:** Tube wells installed in five blocks (hypothetical): A 120, B 80, C 150, D 60, E 100.

<figure>
<svg viewBox="0 0 440 240" width="440" height="240" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="11">
<line x1="45" y1="200" x2="420" y2="200" />
<line x1="45" y1="30" x2="45" y2="200" />
<line x1="40" y1="157.5" x2="420" y2="157.5" stroke-dasharray="3 4" stroke-width="0.6" />
<line x1="40" y1="115" x2="420" y2="115" stroke-dasharray="3 4" stroke-width="0.6" />
<line x1="40" y1="72.5" x2="420" y2="72.5" stroke-dasharray="3 4" stroke-width="0.6" />
<line x1="40" y1="30" x2="420" y2="30" stroke-dasharray="3 4" stroke-width="0.6" />
<text x="36" y="204" text-anchor="end" fill="currentColor" stroke="none">0</text>
<text x="36" y="161" text-anchor="end" fill="currentColor" stroke="none">40</text>
<text x="36" y="119" text-anchor="end" fill="currentColor" stroke="none">80</text>
<text x="36" y="76" text-anchor="end" fill="currentColor" stroke="none">120</text>
<text x="36" y="34" text-anchor="end" fill="currentColor" stroke="none">160</text>
<rect x="60" y="72.5" width="40" height="127.5" fill="var(--accent)" fill-opacity="0.35" />
<rect x="125" y="115" width="40" height="85" fill="var(--accent)" fill-opacity="0.35" />
<rect x="190" y="40.6" width="40" height="159.4" fill="var(--accent)" fill-opacity="0.35" />
<rect x="255" y="136.2" width="40" height="63.8" fill="var(--accent)" fill-opacity="0.35" />
<rect x="320" y="93.8" width="40" height="106.2" fill="var(--accent)" fill-opacity="0.35" />
<text x="80" y="66" text-anchor="middle" fill="currentColor" stroke="none">120</text>
<text x="145" y="109" text-anchor="middle" fill="currentColor" stroke="none">80</text>
<text x="210" y="35" text-anchor="middle" fill="currentColor" stroke="none">150</text>
<text x="275" y="130" text-anchor="middle" fill="currentColor" stroke="none">60</text>
<text x="340" y="88" text-anchor="middle" fill="currentColor" stroke="none">100</text>
<text x="80" y="215" text-anchor="middle" fill="currentColor" stroke="none">A</text>
<text x="145" y="215" text-anchor="middle" fill="currentColor" stroke="none">B</text>
<text x="210" y="215" text-anchor="middle" fill="currentColor" stroke="none">C</text>
<text x="275" y="215" text-anchor="middle" fill="currentColor" stroke="none">D</text>
<text x="340" y="215" text-anchor="middle" fill="currentColor" stroke="none">E</text>
<text x="230" y="234" text-anchor="middle" fill="currentColor" stroke="none">Block (hypothetical data)</text>
<text x="12" y="120" text-anchor="middle" fill="currentColor" stroke="none" transform="rotate(-90 12 120)">Tube wells</text>
</svg>
<figcaption>Bar graph: equal widths and gaps; the value axis starts at zero so bar heights compare fairly.</figcaption>
</figure>

**Reading it:** total = 120 + 80 + 150 + 60 + 100 = 510; average = 510 ÷ 5 = **102** per block; highest C (150), lowest D (60); C installed **2.5 times** as many as D (150 ÷ 60).

**How to draw:** choose a scale (here 1 cm = 20 tube wells would make C 7.5 cm tall); mark blocks on the x-axis with equal gaps; draw bars; write values on top; add title and labels.

### Pie chart

A pie chart shows **parts of a whole**. The full circle is **360°**.

<div class="formula">

| Step | Formula |
|---|---|
| Angle of a sector | (Value ÷ Total) × 360° |
| Percentage of a sector | (Angle ÷ 360°) × 100 |
| Value from angle | (Angle ÷ 360°) × Total |

</div>

**Data:** monthly spending of a family (hypothetical), total ₹12,000.

| Item | Spending (₹) | Calculation | Angle | % |
|---|---|---|---|---|
| Food | 4,800 | 4,800 ÷ 12,000 × 360 | **144°** | 40% |
| Rent | 2,400 | 2,400 ÷ 12,000 × 360 | **72°** | 20% |
| Education | 1,800 | 1,800 ÷ 12,000 × 360 | **54°** | 15% |
| Health | 1,200 | 1,200 ÷ 12,000 × 360 | **36°** | 10% |
| Others | 1,800 | 1,800 ÷ 12,000 × 360 | **54°** | 15% |
| **Total** | **12,000** | | **360°** | **100%** |

<figure>
<svg viewBox="0 0 440 230" width="440" height="230" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="11">
<path d="M110 110 L110 20 A90 90 0 0 1 162.9 182.8 Z" fill="var(--accent)" fill-opacity="0.45" />
<path d="M110 110 L162.9 182.8 A90 90 0 0 1 57.1 182.8 Z" fill="var(--accent)" fill-opacity="0.25" />
<path d="M110 110 L57.1 182.8 A90 90 0 0 1 20 110 Z" fill="var(--accent)" fill-opacity="0.12" />
<path d="M110 110 L20 110 A90 90 0 0 1 37.2 57.1 Z" fill="none" />
<path d="M110 110 L37.2 57.1 A90 90 0 0 1 110 20 Z" fill="var(--accent)" fill-opacity="0.06" />
<text x="160" y="96" text-anchor="middle" fill="currentColor" stroke="none">Food</text>
<text x="110" y="168" text-anchor="middle" fill="currentColor" stroke="none">Rent</text>
<text x="62" y="140" text-anchor="middle" fill="currentColor" stroke="none">Edu.</text>
<text x="52" y="96" text-anchor="middle" fill="currentColor" stroke="none">Health</text>
<text x="86" y="62" text-anchor="middle" fill="currentColor" stroke="none">Others</text>
<text x="240" y="50" fill="currentColor" stroke="none" font-weight="bold">Sector angles</text>
<text x="240" y="75" fill="currentColor" stroke="none">Food 144° (40%)</text>
<text x="240" y="97" fill="currentColor" stroke="none">Rent 72° (20%)</text>
<text x="240" y="119" fill="currentColor" stroke="none">Education 54° (15%)</text>
<text x="240" y="141" fill="currentColor" stroke="none">Health 36° (10%)</text>
<text x="240" y="163" fill="currentColor" stroke="none">Others 54° (15%)</text>
<text x="240" y="190" fill="var(--accent)" stroke="none">Total 360° (100%)</text>
<text x="110" y="222" text-anchor="middle" fill="currentColor" stroke="none">Monthly spending, ₹12,000 (hypothetical)</text>
</svg>
<figcaption>Pie chart: start at the top (12 o'clock) and draw sectors clockwise with a protractor, largest first.</figcaption>
</figure>

**How to draw:** draw a circle with a compass; draw a radius to 12 o'clock; with a protractor mark 144° clockwise for Food, then 72° from that line for Rent, and so on; label each sector with its name and percentage; add a title.

> **Common mistake:** Angles that do not add up to 360° because of rounding. Round so the total stays 360°, and write the check line "Total = 360°".

### Line graph

A line graph shows **change over time**. Time goes on the x-axis; values on the y-axis. Points are joined by straight lines.

**Data:** students enrolled in a block's schools (hypothetical): 2021 – 1,200; 2022 – 1,350; 2023 – 1,500; 2024 – 1,450; 2025 – 1,650.

<figure>
<svg viewBox="0 0 440 240" width="440" height="240" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="11">
<line x1="50" y1="200" x2="420" y2="200" />
<line x1="50" y1="30" x2="50" y2="200" />
<line x1="45" y1="157.5" x2="420" y2="157.5" stroke-dasharray="3 4" stroke-width="0.6" />
<line x1="45" y1="115" x2="420" y2="115" stroke-dasharray="3 4" stroke-width="0.6" />
<line x1="45" y1="72.5" x2="420" y2="72.5" stroke-dasharray="3 4" stroke-width="0.6" />
<line x1="45" y1="30" x2="420" y2="30" stroke-dasharray="3 4" stroke-width="0.6" />
<text x="42" y="204" text-anchor="end" fill="currentColor" stroke="none">1000</text>
<text x="42" y="161" text-anchor="end" fill="currentColor" stroke="none">1200</text>
<text x="42" y="119" text-anchor="end" fill="currentColor" stroke="none">1400</text>
<text x="42" y="76" text-anchor="end" fill="currentColor" stroke="none">1600</text>
<text x="42" y="34" text-anchor="end" fill="currentColor" stroke="none">1800</text>
<polyline points="70,157.5 145,125.6 220,93.8 295,104.4 370,61.9" stroke="var(--accent)" stroke-width="2.5" />
<circle cx="70" cy="157.5" r="3.5" fill="var(--accent)" stroke="none" />
<circle cx="145" cy="125.6" r="3.5" fill="var(--accent)" stroke="none" />
<circle cx="220" cy="93.8" r="3.5" fill="var(--accent)" stroke="none" />
<circle cx="295" cy="104.4" r="3.5" fill="var(--accent)" stroke="none" />
<circle cx="370" cy="61.9" r="3.5" fill="var(--accent)" stroke="none" />
<text x="70" y="148" text-anchor="middle" fill="currentColor" stroke="none">1200</text>
<text x="145" y="116" text-anchor="middle" fill="currentColor" stroke="none">1350</text>
<text x="220" y="84" text-anchor="middle" fill="currentColor" stroke="none">1500</text>
<text x="295" y="122" text-anchor="middle" fill="currentColor" stroke="none">1450</text>
<text x="370" y="52" text-anchor="middle" fill="currentColor" stroke="none">1650</text>
<text x="70" y="215" text-anchor="middle" fill="currentColor" stroke="none">2021</text>
<text x="145" y="215" text-anchor="middle" fill="currentColor" stroke="none">2022</text>
<text x="220" y="215" text-anchor="middle" fill="currentColor" stroke="none">2023</text>
<text x="295" y="215" text-anchor="middle" fill="currentColor" stroke="none">2024</text>
<text x="370" y="215" text-anchor="middle" fill="currentColor" stroke="none">2025</text>
<text x="235" y="234" text-anchor="middle" fill="currentColor" stroke="none">Year (hypothetical data; y-axis starts at 1,000 — note the break)</text>
</svg>
<figcaption>Line graph: the dip in 2024 is easy to see. When the y-axis does not start at zero, say so clearly.</figcaption>
</figure>

**Reading it:** overall growth 2021 → 2025 = ((1,650 − 1,200) ÷ 1,200) × 100 = **37.5%**. The only fall is in 2024: ((1,450 − 1,500) ÷ 1,500) × 100 = **−3.33%**. The biggest one-year rise is 2024 → 2025 (+200).

> **Remember:** A line graph's y-axis may start above zero to show changes clearly, but you must show a break mark (a small zig-zag) on the axis and say so. A bar graph's value axis should always start at zero.

### Histogram and frequency polygon

A **histogram** is a bar graph for a **continuous** frequency distribution: bars touch each other (no gaps), and the class intervals are on the x-axis. A **frequency polygon** joins the mid-points of the tops of the bars, and is closed by joining to the mid-points of empty classes at both ends.

<figure>
<svg viewBox="0 0 440 240" width="440" height="240" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="11">
<line x1="30" y1="200" x2="420" y2="200" />
<line x1="45" y1="30" x2="45" y2="200" />
<text x="40" y="204" text-anchor="end" fill="currentColor" stroke="none">0</text>
<text x="40" y="155" text-anchor="end" fill="currentColor" stroke="none">4</text>
<text x="40" y="107" text-anchor="end" fill="currentColor" stroke="none">8</text>
<text x="40" y="58" text-anchor="end" fill="currentColor" stroke="none">12</text>
<rect x="60" y="139.3" width="60" height="60.7" fill="var(--accent)" fill-opacity="0.2" />
<rect x="120" y="102.9" width="60" height="97.1" fill="var(--accent)" fill-opacity="0.2" />
<rect x="180" y="54.3" width="60" height="145.7" fill="var(--accent)" fill-opacity="0.2" />
<rect x="240" y="78.6" width="60" height="121.4" fill="var(--accent)" fill-opacity="0.2" />
<rect x="300" y="139.3" width="60" height="60.7" fill="var(--accent)" fill-opacity="0.2" />
<polyline points="30,200 90,139.3 150,102.9 210,54.3 270,78.6 330,139.3 390,200" stroke="var(--accent)" stroke-width="2.5" />
<text x="60" y="215" text-anchor="middle" fill="currentColor" stroke="none">0</text>
<text x="120" y="215" text-anchor="middle" fill="currentColor" stroke="none">10</text>
<text x="180" y="215" text-anchor="middle" fill="currentColor" stroke="none">20</text>
<text x="240" y="215" text-anchor="middle" fill="currentColor" stroke="none">30</text>
<text x="300" y="215" text-anchor="middle" fill="currentColor" stroke="none">40</text>
<text x="360" y="215" text-anchor="middle" fill="currentColor" stroke="none">50</text>
<text x="210" y="48" text-anchor="middle" fill="currentColor" stroke="none">12</text>
<text x="230" y="234" text-anchor="middle" fill="currentColor" stroke="none">Marks (Dataset B) — bars = histogram, line = frequency polygon</text>
</svg>
<figcaption>Histogram of Dataset B with its frequency polygon; the polygon touches the x-axis at the mid-points of the empty classes −10–0 and 50–60.</figcaption>
</figure>

**Unequal class widths:** if classes have different widths, draw bar heights using the **adjusted frequency** = (f ÷ class width) × standard width. Example: class 20–40 (width 20) with f = 12 → adjusted height for width 10 = 12 ÷ 20 × 10 = **6**.

### Ogive (cumulative frequency curve) and graphical median

An **ogive** plots cumulative frequency against the **upper class limits** ("less than" ogive) or lower limits ("more than" ogive). The median is the x-value where cf = N ÷ 2.

| Marks less than | 10 | 20 | 30 | 40 | 50 |
|---|---|---|---|---|---|
| cf | 5 | 13 | 25 | 35 | 40 |

<figure>
<svg viewBox="0 0 440 240" width="440" height="240" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="11">
<line x1="60" y1="200" x2="400" y2="200" />
<line x1="60" y1="30" x2="60" y2="200" />
<text x="54" y="204" text-anchor="end" fill="currentColor" stroke="none">0</text>
<text x="54" y="164" text-anchor="end" fill="currentColor" stroke="none">10</text>
<text x="54" y="124" text-anchor="end" fill="currentColor" stroke="none">20</text>
<text x="54" y="84" text-anchor="end" fill="currentColor" stroke="none">30</text>
<text x="54" y="44" text-anchor="end" fill="currentColor" stroke="none">40</text>
<polyline points="60,200 120,180 180,148 240,100 300,60 360,40" stroke="var(--accent)" stroke-width="2.5" />
<circle cx="120" cy="180" r="3" fill="var(--accent)" stroke="none" />
<circle cx="180" cy="148" r="3" fill="var(--accent)" stroke="none" />
<circle cx="240" cy="100" r="3" fill="var(--accent)" stroke="none" />
<circle cx="300" cy="60" r="3" fill="var(--accent)" stroke="none" />
<circle cx="360" cy="40" r="3" fill="var(--accent)" stroke="none" />
<line x1="60" y1="120" x2="215" y2="120" stroke-dasharray="4 3" />
<line x1="215" y1="120" x2="215" y2="200" stroke-dasharray="4 3" />
<text x="60" y="215" text-anchor="middle" fill="currentColor" stroke="none">0</text>
<text x="120" y="215" text-anchor="middle" fill="currentColor" stroke="none">10</text>
<text x="180" y="215" text-anchor="middle" fill="currentColor" stroke="none">20</text>
<text x="240" y="215" text-anchor="middle" fill="currentColor" stroke="none">30</text>
<text x="300" y="215" text-anchor="middle" fill="currentColor" stroke="none">40</text>
<text x="360" y="215" text-anchor="middle" fill="currentColor" stroke="none">50</text>
<text x="222" y="190" fill="var(--accent)" stroke="none" font-weight="bold">≈ 25.8</text>
<text x="100" y="114" fill="currentColor" stroke="none">N ÷ 2 = 20</text>
<text x="230" y="234" text-anchor="middle" fill="currentColor" stroke="none">Upper class limit (marks) — "less than" ogive</text>
</svg>
<figcaption>Read across from cf = 20 to the curve and down to the x-axis: the graphical median is about 25.8, matching the formula answer 25.83.</figcaption>
</figure>

## Reading a graph or table: a checklist

1. Read the **title, units and scale** first (thousands? lakhs? percent?).
2. Note the **highest and lowest** values and the years/categories.
3. Calculate **change** and **percentage change** for the key comparison.
4. Look for the **trend** (rising, falling, fluctuating) and any break in it.
5. Write a **one-line conclusion** ("Enrolment rose by 37.5% over five years despite a fall in 2024").

> **Mains angle:** You can also use small graphs in GS II answers: a bar comparing Bihar and India on literacy (61.8% vs 73.0%, Census 2011 final) or a pie of sector shares from the latest Bihar Economic Survey (check the latest figures). A neat small graph is a strong value addition.

## Quick revision

<div class="formula">

| Measure | Formula |
|---|---|
| Mean (grouped) | Σfx ÷ Σf |
| Step deviation mean | A + (Σfu ÷ N) × h |
| Combined mean | (n₁x̄₁ + n₂x̄₂) ÷ (n₁ + n₂) |
| Median (grouped) | L + ((N/2 − cf) ÷ f) × h |
| Mode (grouped) | L + ((f₁ − f₀) ÷ (2f₁ − f₀ − f₂)) × h |
| Empirical relation | Mode ≈ 3 Median − 2 Mean |
| Range; coefficient | L − S; (L − S) ÷ (L + S) |
| Variance | Σx² ÷ n − x̄² |
| SD (step deviation) | h × √(Σfu² ÷ N − (Σfu ÷ N)²) |
| CV | (σ ÷ x̄) × 100 — lower = more consistent |
| % change | (New − Old) ÷ Old × 100 |
| Pie angle | (Value ÷ Total) × 360° |
| Laspeyres | Σp₁q₀ ÷ Σp₀q₀ × 100 |
| Paasche | Σp₁q₁ ÷ Σp₀q₁ × 100 |
| Fisher | √(L × P) |
| Sex ratio | Females ÷ Males × 1,000 |

</div>

- Median uses "cf **before**" the median class.
- SD does not change when a constant is added to every value.
- Bar graphs start at zero; histograms have no gaps; ogives use upper limits.
- Percentage points ≠ percent.

## Key terms

| Term | Simple meaning |
|---|---|
| Mean | Sum of values ÷ number of values |
| Median | Middle value of ordered data |
| Mode | Most frequent value |
| Class mark | Mid-point of a class interval |
| Cumulative frequency | Running total of frequencies |
| Dispersion | How spread out the data are |
| Standard deviation | Square root of the average squared deviation from the mean |
| Variance | Square of standard deviation |
| Coefficient of variation | SD as a percentage of the mean; compares consistency |
| Index number | Value relative to a base year taken as 100 |
| Base year | Year used for comparison (index = 100) |
| Histogram | Touching-bar graph for continuous classes |
| Frequency polygon | Line joining mid-points of histogram bar tops |
| Ogive | Cumulative frequency curve |
| Percentage point | Simple difference between two percentages |

## Practice

### Recall questions

1. What is the class mark of 30–40?
2. Write the formula for the median of grouped data and name each symbol.
3. Write the formula for the mode of grouped data.
4. State the empirical relation between mean, median and mode.
5. Which average is best for data with extreme values?
6. What happens to SD if 5 is added to every value?
7. What happens to SD if every value is multiplied by 3?
8. Find the pie-chart angle for ₹3,000 out of a total of ₹12,000.
9. A rate rises from 20% to 25%. What is the change in percentage points and in percent?
10. What quantities does the Laspeyres index use?
11. Find the coefficient of range for 40 and 10 (largest, smallest).
12. Why are there no gaps between bars in a histogram?
13. On which class limits is a "less than" ogive plotted?
14. What is the mean of 4, 8, 12, 16?

### Answers

1. (30 + 40) ÷ 2 = 35.
2. Median = L + ((N/2 − cf) ÷ f) × h; L = lower limit of median class, N = total frequency, cf = cumulative frequency of the class before the median class, f = frequency of median class, h = class width.
3. Mode = L + ((f₁ − f₀) ÷ (2f₁ − f₀ − f₂)) × h.
4. Mode ≈ 3 Median − 2 Mean.
5. Median.
6. No change.
7. SD becomes 3 times (variance 9 times).
8. 3,000 ÷ 12,000 × 360 = 90°.
9. 5 percentage points; (5 ÷ 20) × 100 = 25% rise.
10. Base-year quantities (q₀).
11. (40 − 10) ÷ (40 + 10) = 30 ÷ 50 = 0.6.
12. The classes are continuous — one class ends where the next begins.
13. Upper class limits.
14. 40 ÷ 4 = 10.

### Mains-style problems

**1.** *For Dataset B, find the mean, median and mode, and comment on the shape of the distribution.*

Answer outline: mean 25.5, median 25.83, mode 26.67 (worked above). Mean < median < mode → slightly **negatively (left) skewed** — a few low scores pull the mean down slightly. Present all three tables, formulas, and a one-line comment.

**2.** *Draw a pie chart for the family spending data and state which two items together take more than half the budget.*

Answer outline: angles 144°, 72°, 54°, 36°, 54° (total 360°). Food + Rent = 216° = 60% of the budget → more than half.

**3.** *Two batsmen: P (mean 50, SD 10) and Q (mean 40, SD 12). Who is more consistent and who scores more on average?*

Answer outline: CV(P) = 20%, CV(Q) = 30%. P scores more on average **and** is more consistent.

**Next:** [Statistics Practice Problems](/interview/bpsc-2027/mains-answer-writing/statistics-practice-problems)
