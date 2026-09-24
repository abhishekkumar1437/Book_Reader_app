---
title: Geometry
part: Algebra & Geometry
summary: Lines and angles, triangle properties and centres, congruence and similarity, Pythagorean triples, circle theorems (chords, tangents, angles), and polygons, with the diagrams the theorems refer to.
---

## Where it appears

SSC asks two to four geometry questions per paper, almost all from the theorems below. CSAT and BPSC rarely go beyond angles, triangles, and basic circle facts. Learn the figure with each theorem; the question is usually the figure with one value hidden.

## Formulae

<div class="formula">

| Angles and lines | Fact |
|---|---|
| On a straight line · around a point | 180° · 360° |
| Vertically opposite | equal |
| Parallel lines cut by a transversal | alternate and corresponding angles equal · co-interior angles add to 180° |

| Triangles | Fact |
|---|---|
| Angle sum | 180° |
| Exterior angle | sum of the two opposite interior angles |
| Sides | any two sides add to more than the third · largest angle faces the largest side |
| Pythagoras (right angle) | c² = a² + b² |
| Triples to recognise | 3-4-5 · 5-12-13 · 8-15-17 · 7-24-25 · 9-40-41 · 20-21-29 and multiples |
| Similar triangles | sides in ratio k ⇒ areas in ratio k² |
| Basic proportionality | a line parallel to one side divides the other two in the same ratio |
| Mid-point theorem | segment joining two mid-points ∥ third side and half of it |
| Angle bisector | divides the opposite side in the ratio of the other two sides |
| Centroid (medians) | divides each median 2 : 1 from the vertex |
| Incentre · circumcentre · orthocentre | angle bisectors · perpendicular bisectors · altitudes |
| Right triangle | circumcentre = midpoint of hypotenuse · R = hypotenuse/2 · r = (a + b − c)/2 |
| Inradius r · circumradius R (any triangle) | r = Area ÷ s · R = abc ÷ (4 × Area), s = semi-perimeter |

| Circles | Fact |
|---|---|
| Angle in a semicircle | 90° |
| Angle at the centre | twice the angle at the circumference on the same arc |
| Angles in the same segment | equal |
| Cyclic quadrilateral | opposite angles add to 180° |
| Tangent | perpendicular to the radius at the point of contact |
| Two tangents from a point | equal in length |
| Chords AB, CD crossing at P | PA × PB = PC × PD |
| Tangent PT and secant PAB | PT² = PA × PB |
| Perpendicular from the centre | bisects the chord · equal chords are equidistant from the centre |
| Circles touching | externally: distance = R + r · internally: R − r |

| Polygon with n sides | Formula |
|---|---|
| Sum of interior angles | (n − 2) × 180° |
| Each interior angle (regular) | (n − 2) × 180° ÷ n |
| Each exterior angle (regular) | 360° ÷ n |
| Number of diagonals | n(n − 3) ÷ 2 |

</div>

## Lines and angles

<figure>
<svg viewBox="0 0 360 170" width="360" height="170" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<line x1="20" y1="50" x2="340" y2="50" />
<line x1="20" y1="120" x2="340" y2="120" />
<line x1="100" y1="150" x2="260" y2="20" stroke="var(--accent)" />
<text x="150" y="42" fill="currentColor" stroke="none">1</text><text x="205" y="42" fill="currentColor" stroke="none">2</text>
<text x="150" y="70" fill="currentColor" stroke="none">4</text><text x="205" y="70" fill="currentColor" stroke="none">3</text>
<text x="120" y="112" fill="currentColor" stroke="none">5</text><text x="170" y="112" fill="currentColor" stroke="none">6</text>
<text x="120" y="140" fill="currentColor" stroke="none">8</text><text x="170" y="140" fill="currentColor" stroke="none">7</text>
<text x="290" y="40" fill="currentColor" stroke="none" font-size="12">parallel lines</text>
</svg>
<figcaption>A transversal across parallel lines: corresponding angles (1 and 5, 2 and 6, ...) are equal; alternate interior angles (4 and 6, 3 and 5) are equal; co-interior angles (4 and 5, 3 and 6) add to 180°; vertically opposite angles (1 and 3, 2 and 4) are equal.</figcaption>
</figure>

**Example.** Two parallel lines are cut by a transversal; one angle is 3x + 10 and its co-interior angle is 2x − 30. Find x. Sum 180: 5x − 20 = 180 → x = 40.

**Example.** The angles of a triangle are in the ratio 2 : 3 : 4. The largest angle? 4/9 × 180 = 80°.

**Example.** In triangle ABC, the exterior angle at C is 120° and angle A = 50°. Angle B? 120 − 50 = 70°.

## Triangles

<figure>
<svg viewBox="0 0 380 190" width="380" height="190" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<polygon points="40,160 200,160 200,40" />
<text x="28" y="178" fill="currentColor" stroke="none">A</text><text x="204" y="178" fill="currentColor" stroke="none">B</text><text x="204" y="35" fill="currentColor" stroke="none">C</text>
<rect x="186" y="146" width="14" height="14" />
<text x="110" y="178" fill="currentColor" stroke="none">b = 4</text><text x="208" y="105" fill="currentColor" stroke="none">a = 3</text><text x="95" y="90" fill="currentColor" stroke="none">c = 5</text>
<polygon points="250,160 360,160 300,60" />
<line x1="300" y1="60" x2="305" y2="160" stroke="var(--accent)" stroke-dasharray="4 3" />
<line x1="250" y1="160" x2="330" y2="110" stroke="var(--accent)" stroke-dasharray="4 3" />
<line x1="360" y1="160" x2="275" y2="110" stroke="var(--accent)" stroke-dasharray="4 3" />
<circle cx="305" cy="127" r="3" fill="var(--accent)" stroke="none" />
<text x="312" y="132" fill="var(--accent)" stroke="none" font-size="12">G</text>
</svg>
<figcaption>Left: a right triangle with the 3-4-5 triple; the right angle is opposite the hypotenuse. Right: medians meet at the centroid G, which divides each median 2 : 1 from the vertex.</figcaption>
</figure>

**Example.** A ladder 13 m long rests against a wall with its foot 5 m from the wall. Height reached? 12 m (5-12-13).

**Example.** In a right triangle with legs 6 and 8, find the inradius and circumradius. Hypotenuse 10. r = (6 + 8 − 10)/2 = 2; R = 5.

**Example.** The sides of a triangle are 7, 24, 25. Its area? Right-angled (7² + 24² = 625) → ½ × 7 × 24 = 84.

**Example.** Triangles ABC and PQR are similar with AB = 6 and PQ = 9. Ratio of areas? (6/9)² = 4 : 9.

**Example.** In triangle ABC, D and E are midpoints of AB and AC; DE = 5. BC? 10.

**Example.** A median of a triangle is 12 cm. The centroid is how far from the vertex? 8 cm.

**Example.** Two sides of a triangle are 8 and 15. The third side lies between? 7 < x < 23.

**Example.** In triangle ABC, the bisector of angle A meets BC at D. If AB = 6, AC = 9, BC = 10, find BD. Angle-bisector theorem: BD/DC = AB/AC = 2 : 3 → BD = 4.

## Circles

<figure>
<svg viewBox="0 0 400 200" width="400" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="13">
<circle cx="100" cy="100" r="70" />
<circle cx="100" cy="100" r="2.5" fill="currentColor" stroke="none" />
<text x="104" y="96" fill="currentColor" stroke="none" font-size="12">O</text>
<line x1="40" y1="65" x2="160" y2="65" /><line x1="40" y1="65" x2="100" y2="100" /><line x1="160" y1="65" x2="100" y2="100" />
<line x1="40" y1="65" x2="115" y2="168" stroke="var(--accent)" /><line x1="160" y1="65" x2="115" y2="168" stroke="var(--accent)" />
<text x="30" y="58" fill="currentColor" stroke="none">A</text><text x="164" y="58" fill="currentColor" stroke="none">B</text><text x="110" y="185" fill="var(--accent)" stroke="none">C</text>
<text x="88" y="118" fill="currentColor" stroke="none" font-size="12">2θ</text><text x="108" y="160" fill="var(--accent)" stroke="none" font-size="12">θ</text>
<circle cx="300" cy="100" r="60" />
<circle cx="300" cy="100" r="2.5" fill="currentColor" stroke="none" />
<line x1="300" y1="100" x2="342" y2="57" /><line x1="380" y1="20" x2="300" y2="100" stroke="none" />
<line x1="390" y1="110" x2="342" y2="57" stroke="var(--accent)" /><line x1="390" y1="110" x2="342" y2="143" stroke="var(--accent)" />
<line x1="300" y1="100" x2="342" y2="143" />
<text x="392" y="115" fill="var(--accent)" stroke="none">P</text><text x="336" y="50" fill="currentColor" stroke="none">T</text><text x="336" y="160" fill="currentColor" stroke="none">S</text>
<text x="252" y="190" fill="currentColor" stroke="none" font-size="12">PT = PS, OT ⟂ PT</text>
</svg>
<figcaption>Left: the angle at the centre (AOB = 2θ) is twice the angle at the circumference (ACB = θ) on the same arc. Right: two tangents from an external point P are equal, and each is perpendicular to the radius at the point of contact.</figcaption>
</figure>

**Example.** A chord of length 16 cm is 6 cm from the centre. Radius? Half-chord 8, distance 6 → radius 10 (6-8-10).

**Example.** Angle ACB on the circumference is 35°. Angle AOB at the centre? 70°.

**Example.** In a cyclic quadrilateral one angle is 110°. The opposite angle? 70°.

**Example.** From a point 13 cm from the centre of a circle of radius 5 cm, the tangent length? √(169 − 25) = 12 cm.

**Example.** Chords AB and CD intersect at P inside the circle with PA = 4, PB = 9, PC = 6. Find PD. 4 × 9 = 6 × PD → 6.

**Example.** A tangent PT = 12 and a secant from P meets the circle at A (nearer) and B with PA = 8. Find PB. 144 = 8 × PB → 18; so AB = 10.

**Example.** Two circles of radii 5 and 3 touch externally. Distance between centres? 8. (Internally: 2.)

**Example.** The angle between a tangent and a chord through the point of contact is 40°. The angle in the alternate segment? 40°.

## Polygons

**Example.** Each interior angle of a regular polygon is 150°. Number of sides? Exterior 30° → 360/30 = 12.

**Example.** Sum of interior angles of a hexagon: (6 − 2) × 180 = 720°. Diagonals: 6 × 3/2 = 9.

**Example.** A regular polygon has 20 diagonals. Sides? n(n − 3)/2 = 20 → n² − 3n − 40 = 0 → n = 8.

## Coordinate geometry, the minimum

Distance between (x₁, y₁) and (x₂, y₂) = √((x₂ − x₁)² + (y₂ − y₁)²). Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2). Slope = (y₂ − y₁)/(x₂ − x₁); parallel lines have equal slopes, perpendicular lines have slopes multiplying to −1. Area of a triangle with vertices (x₁,y₁), (x₂,y₂), (x₃,y₃) = ½|x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|.

**Example.** Distance between (1, 2) and (4, 6) = √(9 + 16) = 5.

## Traps

- The angle at the centre is double the angle at the circumference only for the same arc; on the opposite arc the circumference angle is 180° − θ.
- Similar triangles: areas scale with the square of the side ratio; volumes (solids) with the cube.
- The centroid divides medians 2 : 1 from the vertex, so it is one third of the way from the base.
- Exterior angle of a regular polygon is 360°/n regardless of size.
- "Touch externally" adds radii; "internally" subtracts.

## Practice set

1. Angles of a triangle are x, 2x, 3x. Find the smallest.
2. Legs of a right triangle are 9 and 40. Hypotenuse and inradius?
3. Sides 13, 14, 15: area (Heron) and circumradius.
4. Similar triangles have perimeters 24 and 36; the smaller has a side 8. Corresponding side in the larger?
5. A chord of a circle of radius 13 is 24 long. Its distance from the centre?
6. Angle in a semicircle is? Angle subtended by a diameter at the centre?
7. From an external point two tangents of length 15 are drawn to a circle of radius 8. Distance of the point from the centre?
8. Interior angle of a regular octagon.
9. Two chords intersect inside a circle: segments 3 and 8 on one, 4 and x on the other. Find x.
10. The centroid of a triangle with vertices (0, 0), (6, 0), (0, 9).
11. In triangle ABC, DE ∥ BC with AD = 3, DB = 6, AE = 2. Find EC.
12. Number of diagonals of a decagon.

**Answers**

1. 6x = 180 → x = 30°.
2. 41 (9-40-41); r = (9 + 40 − 41)/2 = 4.
3. s = 21; area = √(21 × 8 × 7 × 6) = √7056 = 84; R = 13 × 14 × 15/(4 × 84) = 2730/336 = 8.125.
4. Ratio 2 : 3 → 12.
5. Half-chord 12, radius 13 → 5.
6. 90°; 180°.
7. √(225 + 64) = 17.
8. 135°.
9. 3 × 8 = 4x → 6.
10. (2, 3).
11. AD/DB = AE/EC → 3/6 = 2/EC → EC = 4.
12. 10 × 7/2 = 35.
