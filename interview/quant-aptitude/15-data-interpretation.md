---
title: Data Interpretation
part: Data & Reasoning
summary: Tables, bar charts, line graphs, and pie charts, read with the four calculations they always require: totals, percentages, ratios, and growth. Approximation habits, the pie-chart degree conversion, and a full worked set on each format.
---

## Where it appears

CSAT: the single largest block of numeracy marks, in sets of three to five questions on one table or chart. SSC: one set per paper. BPSC: usually one set. The arithmetic is percentages and ratios; the skill is reading the right cell fast and estimating.

## The four calculations

<div class="formula">

| What | Formula |
|---|---|
| Share | part ÷ total × 100 |
| Ratio of two parts | their values, simplified |
| Growth from A to B | (B − A) ÷ A × 100 |
| Average over categories | total ÷ count |
| Pie chart | 360° = 100 % · 1 % = 3.6° · d° = d ÷ 3.6 % · sector d° = (d ÷ 360) × total |
| Approximation | if options differ by more than 5 %, round to two significant figures first |

</div>

## Reading before computing

Spend the first fifteen seconds on the chart itself: the title, the units (thousands? percent? crores?), the axis scale, the legend, and whether a column is a total or a rate. Most DI errors are misreads, not miscalculations.

## Table

Sales (in ₹ lakh) of four products over three years:

| Product | 2023 | 2024 | 2025 |
|---|---|---|---|
| A | 120 | 150 | 180 |
| B | 80 | 100 | 90 |
| C | 200 | 180 | 240 |
| D | 60 | 90 | 120 |

**Q1. Total sales in 2024?** 150 + 100 + 180 + 90 = 520.

**Q2. Percentage growth of D from 2023 to 2025?** (120 − 60)/60 = 100%.

**Q3. Which product had the highest growth from 2024 to 2025?** A: 30/150 = 20%; B: −10%; C: 60/180 = 33.3%; D: 30/90 = 33.3%. C and D tie at 33.3%; if forced to one, compare exactly: both 1/3. (Setters avoid ties; when they occur, re-read the numbers.)

**Q4. C's share of total sales in 2025?** Total = 180 + 90 + 240 + 120 = 630. 240/630 = 38.1%.

**Q5. Ratio of A's total over three years to B's?** A = 450, B = 270 → 5 : 3.

**Q6. Average annual sales of C?** 620/3 ≈ 206.7.

## Bar chart

<figure>
<svg viewBox="0 0 420 220" width="420" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="50" y1="180" x2="400" y2="180" /><line x1="50" y1="20" x2="50" y2="180" />
<text x="20" y="184" fill="currentColor" stroke="none">0</text><text x="14" y="104" fill="currentColor" stroke="none">40</text><text x="14" y="24" fill="currentColor" stroke="none">80</text>
<rect x="80" y="100" width="28" height="80" fill="var(--accent)" stroke="none" /><rect x="112" y="60" width="28" height="120" fill="currentColor" opacity="0.5" stroke="none" />
<rect x="170" y="80" width="28" height="100" fill="var(--accent)" stroke="none" /><rect x="202" y="120" width="28" height="60" fill="currentColor" opacity="0.5" stroke="none" />
<rect x="260" y="40" width="28" height="140" fill="var(--accent)" stroke="none" /><rect x="292" y="90" width="28" height="90" fill="currentColor" opacity="0.5" stroke="none" />
<text x="96" y="200" fill="currentColor" stroke="none">North</text><text x="182" y="200" fill="currentColor" stroke="none">South</text><text x="272" y="200" fill="currentColor" stroke="none">West</text>
<rect x="340" y="30" width="12" height="12" fill="var(--accent)" stroke="none" /><text x="356" y="41" fill="currentColor" stroke="none">2024</text>
<rect x="340" y="50" width="12" height="12" fill="currentColor" opacity="0.5" stroke="none" /><text x="356" y="61" fill="currentColor" stroke="none">2025</text>
<text x="120" y="14" fill="currentColor" stroke="none">Units sold (thousands) by region</text>
</svg>
<figcaption>Read the bar heights against the axis: North 40 and 60; South 50 and 30; West 70 and 45 (thousands of units), for 2024 and 2025.</figcaption>
</figure>

**Q1. Total units in 2025?** 60 + 30 + 45 = 135 thousand.

**Q2. Percentage change in South?** (30 − 50)/50 = −40%.

**Q3. Which region's share of the total rose the most?** 2024 total 160: North 25%, South 31.25%, West 43.75%. 2025 total 135: North 44.4%, South 22.2%, West 33.3%. North rose by about 19 percentage points.

**Q4. Ratio of West's two-year total to North's?** 115 : 100 = 23 : 20.

## Line graph

Monthly production (units) Jan to Jun: 200, 240, 210, 270, 300, 330.

**Q1. Highest month-on-month growth?** Feb: 20%; Mar: −12.5%; Apr: 28.6%; May: 11.1%; Jun: 10%. **April.**

**Q2. Average monthly production?** 1550/6 ≈ 258.3.

**Q3. In how many months was production above the average?** Apr, May, Jun → 3.

**Hint:** on a line graph, "growth" is a slope question: compare the rises, but divide by the starting value when the question says percentage.

## Pie chart

<figure>
<svg viewBox="0 0 420 220" width="420" height="220" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<circle cx="130" cy="110" r="80" />
<path d="M130 110 L130 30 A80 80 0 0 1 210 110 Z" fill="var(--accent)" stroke="currentColor" />
<path d="M130 110 L210 110 A80 80 0 0 1 130 190 Z" fill="currentColor" opacity="0.45" stroke="currentColor" />
<path d="M130 110 L130 190 A80 80 0 0 1 60.7 70 Z" fill="currentColor" opacity="0.2" stroke="currentColor" />
<path d="M130 110 L60.7 70 A80 80 0 0 1 130 30 Z" fill="none" stroke="currentColor" />
<text x="240" y="60" fill="currentColor" stroke="none">Rent 25% (90°)</text>
<text x="240" y="85" fill="currentColor" stroke="none">Food 25% (90°)</text>
<text x="240" y="110" fill="currentColor" stroke="none">Travel 30% (108°)</text>
<text x="240" y="135" fill="currentColor" stroke="none">Savings 20% (72°)</text>
<text x="240" y="175" fill="currentColor" stroke="none">Monthly budget ₹40,000</text>
</svg>
<figcaption>A pie chart may be labelled in percent or in degrees. Convert with 3.6° per percent: 108° is 30%, so travel = 0.3 × 40,000 = ₹12,000.</figcaption>
</figure>

**Q1. Amount spent on food?** 25% of 40,000 = ₹10,000.

**Q2. How much more is spent on travel than saved?** 10% of 40,000 = ₹4,000.

**Q3. If the total rises to ₹50,000 with the same shares, savings become?** 20% of 50,000 = ₹10,000.

**Q4. Angle for rent plus food?** 180°.

**Q5. If savings are ₹9,000 in another month with the same percentages, the budget was?** 9000/0.2 = ₹45,000.

## Mixed and two-chart sets

Some sets give a pie chart of shares and a separate total or a table of totals per year. The process is the same: find the total, apply the share, then compare. Write the two or three numbers you need in the margin before answering; most errors come from recomputing a value from memory.

**Example.** Population of a city is 2.4 million; a pie shows 35% under 18, 55% aged 18 to 60, 10% over 60. Literacy is 90%, 80%, 60% in the groups. Literate population? 2.4 × (0.35 × 0.9 + 0.55 × 0.8 + 0.1 × 0.6) = 2.4 × (0.315 + 0.44 + 0.06) = 2.4 × 0.815 = 1.956 million.

## Approximation in practice

- 38.6% of 1,842: 40% of 1,850 = 740, minus 1.4% (≈ 26) → ≈ 714 (exact 711).
- 617/1,290: about 62/129 ≈ 0.48 → 48% (exact 47.8%).
- Growth from 4,830 to 6,120: difference 1,290 over 4,830 → 1,290/4,830 ≈ 0.267 → 26.7%.

Check the options first. If they are 45%, 48%, 51%, 54%, a rough answer suffices; if they are 47%, 48%, 49%, compute exactly.

## Traps

- Percentage change uses the earlier value as base; a fall from 50 to 30 is −40%, and a rise back to 50 is +66.7%.
- Percentage points versus percent when comparing shares across years.
- A bar chart with two series: read the legend before reading heights.
- Pie charts show shares, not amounts; two pies with different totals cannot be compared sector to sector without the totals.
- Units in the title ("in thousands", "in ₹ crore") multiply the final answer.

## Practice set

Use the table at the top of the chapter.

1. Total sales of all products over three years.
2. B's sales in 2025 as a percentage of A's.
3. Percentage change in total sales from 2024 to 2025.
4. Which product had the lowest average over the three years?
5. Ratio of total sales in 2023 to 2025.
6. By what percent did C's sales fall from 2023 to 2024?

Use the pie chart (budget ₹40,000).

7. Angle of the savings sector plus the travel sector.
8. If rent rises to ₹12,000 and everything else stays, rent's new share of the new total?
9. Food and rent together as a fraction of travel and savings together.
10. If the budget is split in the same shares over 12 months, annual savings?

**Answers**

1. 450 + 270 + 620 + 270 = 1,610.
2. 90/180 = 50%.
3. (630 − 520)/520 = 21.15%.
4. B and D both average 90; the lowest average is 90 (B and D tie).
5. 460 : 630 = 46 : 63.
6. (200 − 180)/200 = 10%.
7. 72 + 108 = 180°.
8. New total 42,000; 12,000/42,000 = 28.57%.
9. 50% : 50% = 1.
10. 12 × 8,000 = ₹96,000.
