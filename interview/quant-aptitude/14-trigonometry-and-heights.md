---
title: Trigonometry & Heights and Distances
part: Algebra & Geometry
summary: The ratios, the value table, the identities SSC actually uses, and the heights-and-distances figures (one tower, two positions, two towers) with a method that solves every variant.
---

## Where it appears

SSC: two to four questions, split between identity simplification and heights and distances. CSAT and BPSC: at most one, always heights and distances with 30°, 45°, 60°. If you prepare only for CSAT or BPSC, read the table and the heights section only.

## Formulae

<div class="formula">

| Ratio (angle θ, opposite o, adjacent a, hypotenuse h) | Definition |
|---|---|
| sin θ · cos θ · tan θ | o/h · a/h · o/a |
| cosec · sec · cot | 1/sin · 1/cos · 1/tan |
| tan θ | sin θ ÷ cos θ |

| θ | 0° | 30° | 45° | 60° | 90° |
|---|---|---|---|---|---|
| sin | 0 | 1/2 | 1/√2 | √3/2 | 1 |
| cos | 1 | √3/2 | 1/√2 | 1/2 | 0 |
| tan | 0 | 1/√3 | 1 | √3 | ∞ |

Memory aid: sin values are √0/2, √1/2, √2/2, √3/2, √4/2; cos is the same list reversed.

| Identity | Formula |
|---|---|
| Pythagorean | sin²θ + cos²θ = 1 · 1 + tan²θ = sec²θ · 1 + cot²θ = cosec²θ |
| Complementary | sin(90° − θ) = cos θ · tan(90° − θ) = cot θ · sec(90° − θ) = cosec θ |
| sin(A ± B) | sin A cos B ± cos A sin B |
| cos(A ± B) | cos A cos B ∓ sin A sin B |
| sin 2A | 2 sin A cos A |
| cos 2A | cos²A − sin²A = 1 − 2sin²A = 2cos²A − 1 |
| tan 2A | 2 tan A ÷ (1 − tan²A) |
| Range of a sin θ + b cos θ | −√(a² + b²) to √(a² + b²) |

| Heights and distances | Rule |
|---|---|
| Angle of elevation | measured up from the horizontal at the observer |
| Angle of depression | measured down from the horizontal at the observer = angle of elevation from the object |
| Height | distance × tan θ (tan is almost always the ratio to use) |

</div>

## Identity questions

**Example.** If sin θ = 3/5, find tan θ + sec θ. cos = 4/5 → tan = 3/4, sec = 5/4 → 2.

**Example.** Simplify (1 − cos²θ)(1 + cot²θ). sin²θ × cosec²θ = 1.

**Example.** If tan θ + cot θ = 2, find tan²θ + cot²θ. Square: tan² + cot² + 2 = 4 → 2. (Also tan θ = 1, θ = 45°.)

**Example.** Value of sin 30° cos 60° + cos 30° sin 60° = sin 90° = 1. (Or ¼ + ¾.)

**Example.** If sec θ + tan θ = 3, find sec θ − tan θ. Product is sec² − tan² = 1 → 1/3.

**Example.** If sin θ + cos θ = √2, find θ. Square: 1 + 2 sin θ cos θ = 2 → sin 2θ = 1 → θ = 45°.

**Example.** Maximum of 3 sin θ + 4 cos θ = 5.

**Example.** Simplify (sin θ + cos θ)² + (sin θ − cos θ)² = 2.

**Example.** If cos θ = 5/13, θ acute, find (cosec θ − cot θ). sin = 12/13; cosec = 13/12, cot = 5/12 → 8/12 = 2/3.

## Heights and distances

<figure>
<svg viewBox="0 0 420 190" width="420" height="190" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<line x1="20" y1="160" x2="400" y2="160" />
<line x1="300" y1="160" x2="300" y2="40" stroke="var(--accent)" stroke-width="3" />
<line x1="60" y1="160" x2="300" y2="40" />
<line x1="160" y1="160" x2="300" y2="40" />
<path d="M100 160 A40 40 0 0 0 96 141" /><text x="102" y="150" fill="currentColor" stroke="none">30°</text>
<path d="M195 160 A35 35 0 0 0 186 133" /><text x="196" y="147" fill="currentColor" stroke="none">60°</text>
<text x="306" y="100" fill="var(--accent)" stroke="none">h</text>
<text x="50" y="178" fill="currentColor" stroke="none">A</text><text x="150" y="178" fill="currentColor" stroke="none">B</text><text x="296" y="178" fill="currentColor" stroke="none">C</text>
<text x="96" y="178" fill="currentColor" stroke="none" font-size="12">d</text><text x="225" y="178" fill="currentColor" stroke="none" font-size="12">x</text>
</svg>
<figcaption>The two-position figure: from A the angle of elevation of the top of the tower is 30°, from B (d metres closer) it is 60°. Then x = h/√3 and x + d = h√3, so d = h(√3 − 1/√3) = 2h/√3. With d given, h follows.</figcaption>
</figure>

**Method.** Draw the right triangle(s), label the height h and the unknown ground distance x, write tan of each angle as height over base, and solve the one or two equations. Everything reduces to tan 30° = 1/√3, tan 45° = 1, tan 60° = √3.

**Example.** From a point 100 m from the foot of a tower the angle of elevation of the top is 30°. Height? 100/√3 = 57.7 m.

**Example.** The angle of elevation of the top of a tower from a point is 60°, and from a point 40 m further away it is 30°. Height?
x = h/√3, x + 40 = h√3 → h√3 − h/√3 = 40 → h(3 − 1)/√3 = 40 → h = 20√3 ≈ 34.64 m.

**Example.** From the top of a 60 m cliff the angle of depression of a boat is 30°. Distance of the boat from the foot of the cliff? 60/tan 30° = 60√3 ≈ 103.9 m.

**Example.** Two towers stand on level ground; from the top of the taller (100 m) the angle of depression of the top of the shorter is 45° and of its foot is 60°. Height of the shorter?
Distance between them = 100/√3 (from the 60° triangle). Difference in heights = distance × tan 45° = 100/√3 ≈ 57.7 → shorter = 100 − 57.7 = 42.3 m.

**Example.** A ladder makes a 60° angle with the ground and reaches 4√3 m up a wall. Length of the ladder? sin 60° = 4√3/L → L = 8 m.

**Example.** The shadow of a pole is √3 times its height. Angle of elevation of the sun? tan θ = 1/√3 → 30°.

**Example.** A kite is flying at a height of 60 m attached to a string inclined at 60°. Length of string? 60/sin 60° = 60 × 2/√3 = 40√3 ≈ 69.3 m.

**Example.** From a point on a bridge, the angles of depression of the banks on opposite sides of a river are 30° and 45°. The bridge is 30 m above the water. Width of the river? 30/tan 30° + 30/tan 45° = 30√3 + 30 ≈ 81.96 m.

## Traps

- The angle of depression from the top equals the angle of elevation from the bottom; draw the horizontal at the observer.
- Use tan unless the hypotenuse (ladder, string, line of sight length) is involved; then sin or cos.
- "Further away" means the angle got smaller; if your equations say otherwise, the figure is drawn wrong.
- Rationalise: 100/√3 = 100√3/3.
- Identity questions with a given ratio: draw the 3-4-5 or 5-12-13 triangle instead of manipulating symbols.

## Practice set

1. If tan θ = 12/5, find sin θ + cos θ.
2. Simplify sin⁴θ − cos⁴θ + cos²θ − sin²θ... trick: it equals 0. Show why.
3. Value of tan 15° × tan 75° and of cos 20° − sin 70°.
4. If sin θ − cos θ = 0, find sin⁴θ + cos⁴θ.
5. Minimum value of 5 sin θ − 12 cos θ.
6. If cosec θ − cot θ = 1/2, find cosec θ + cot θ and sin θ.
7. Height of a tower whose shadow is 30 m when the sun's elevation is 60°.
8. From a boat, the angle of elevation of the top of a 45 m lighthouse is 45°. Distance from the lighthouse?
9. Angle of elevation of a tower's top changes from 30° to 45° as a person walks 20 m towards it. Height?
10. From the top of a 50 m building, the angles of depression of the top and foot of a tower are 30° and 60°. Tower height?
11. A tree breaks and its top touches the ground 10 m from the foot making 30° with the ground. Original height?
12. Two poles of heights 10 m and 20 m are 10√3 m apart. Angle of elevation of the taller's top from the shorter's top?

**Answers**

1. 5-12-13 → 12/13 + 5/13 = 17/13.
2. sin⁴ − cos⁴ = (sin² − cos²)(sin² + cos²) = sin² − cos²; adding cos² − sin² gives 0.
3. tan 75° = cot 15° → product 1; sin 70° = cos 20° → 0.
4. sin θ = cos θ → θ = 45° → 2 × (1/√2)⁴ = 2 × 1/4 = 1/2.
5. −√(25 + 144) = −13.
6. Product is 1 → cosec + cot = 2; adding: 2 cosec = 5/2 → cosec = 5/4 → sin θ = 4/5.
7. 30 × √3 ≈ 51.96 m.
8. 45 m.
9. x = h, x + 20 = h√3 → h(√3 − 1) = 20 → h = 20/(√3 − 1) = 10(√3 + 1) ≈ 27.32 m.
10. Distance = 50/√3; height difference = (50/√3)(1/√3) = 50/3 ≈ 16.67 → tower = 33.33 m.
11. Broken part = 10/cos 30° = 20/√3; standing part = 10 tan 30° = 10/√3; total = 30/√3 = 10√3 ≈ 17.32 m.
12. tan θ = 10/(10√3) = 1/√3 → 30°.
