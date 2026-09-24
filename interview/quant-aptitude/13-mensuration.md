---
title: Mensuration
part: Algebra & Geometry
summary: Areas and perimeters of 2D shapes, surface areas and volumes of solids, in one table each, with the diagrams that fix the formulae in memory and the conversion and "melted and recast" questions that use them.
---

## Where it appears

SSC: two to four questions, spread across the table below; recasting solids, paths around fields, and cost-of-fencing or painting are favourites. CSAT and BPSC: rectangles, circles, and simple volumes.

## 2D formulae

<div class="formula">

| Shape | Area | Perimeter |
|---|---|---|
| Rectangle (l × b) | lb | 2(l + b); diagonal √(l² + b²) |
| Square (side a) | a²; also d²/2 | 4a; diagonal a√2 |
| Triangle (base b, height h) | ½bh | sum of sides |
| Triangle (sides a, b, c), Heron | √(s(s−a)(s−b)(s−c)), s = (a+b+c)/2 | a + b + c |
| Equilateral triangle (side a) | (√3/4)a²; height (√3/2)a | 3a |
| Parallelogram | base × height | 2(a + b) |
| Rhombus (diagonals d₁, d₂) | ½d₁d₂; side = ½√(d₁² + d₂²) | 4 × side |
| Trapezium (parallel sides a, b, height h) | ½(a + b)h | sum of sides |
| Circle (radius r) | πr² | 2πr |
| Semicircle | ½πr² | πr + 2r |
| Sector (angle θ) | (θ/360)πr²; arc length (θ/360)2πr | arc + 2r |
| Ring (radii R, r) | π(R² − r²) | |

</div>

## 3D formulae

<div class="formula">

| Solid | Volume | Curved / lateral surface | Total surface |
|---|---|---|---|
| Cuboid (l, b, h) | lbh | 2h(l + b) | 2(lb + bh + hl); diagonal √(l² + b² + h²) |
| Cube (a) | a³ | 4a² | 6a²; diagonal a√3 |
| Cylinder (r, h) | πr²h | 2πrh | 2πr(r + h) |
| Cone (r, h, slant l = √(r² + h²)) | ⅓πr²h | πrl | πr(r + l) |
| Sphere (r) | (4/3)πr³ | 4πr² | 4πr² |
| Hemisphere (r) | (2/3)πr³ | 2πr² | 3πr² |
| Prism | base area × height | perimeter of base × height | lateral + 2 × base |
| Pyramid | ⅓ × base area × height | ½ × base perimeter × slant height | lateral + base |
| Frustum of a cone (R, r, h) | ⅓πh(R² + Rr + r²) | π(R + r)l, l = √(h² + (R − r)²) | curved + π(R² + r²) |

Use π = 22/7 when the radius is a multiple of 7; otherwise 3.14. **Melting and recasting** preserves volume. **Scaling** a solid by factor k multiplies areas by k² and volumes by k³.

</div>

<figure>
<svg viewBox="0 0 420 170" width="420" height="170" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<ellipse cx="70" cy="40" rx="35" ry="10" /><ellipse cx="70" cy="130" rx="35" ry="10" /><line x1="35" y1="40" x2="35" y2="130" /><line x1="105" y1="40" x2="105" y2="130" />
<line x1="70" y1="40" x2="105" y2="40" stroke="var(--accent)" /><text x="82" y="34" fill="var(--accent)" stroke="none">r</text><text x="110" y="90" fill="currentColor" stroke="none">h</text>
<text x="45" y="160" fill="currentColor" stroke="none">cylinder</text>
<ellipse cx="200" cy="130" rx="35" ry="10" /><line x1="165" y1="130" x2="200" y2="30" /><line x1="235" y1="130" x2="200" y2="30" />
<line x1="200" y1="30" x2="200" y2="130" stroke-dasharray="4 3" /><line x1="200" y1="130" x2="235" y2="130" stroke="var(--accent)" />
<text x="204" y="85" fill="currentColor" stroke="none">h</text><text x="225" y="80" fill="currentColor" stroke="none">l</text><text x="214" y="125" fill="var(--accent)" stroke="none">r</text>
<text x="185" y="160" fill="currentColor" stroke="none">cone</text>
<circle cx="330" cy="85" r="45" /><ellipse cx="330" cy="85" rx="45" ry="12" stroke-dasharray="4 3" /><line x1="330" y1="85" x2="375" y2="85" stroke="var(--accent)" />
<text x="348" y="80" fill="var(--accent)" stroke="none">r</text><text x="312" y="160" fill="currentColor" stroke="none">sphere</text>
</svg>
<figcaption>The three solids that appear most: cylinder (πr²h), cone (⅓πr²h with slant height l = √(r² + h²)), sphere ((4/3)πr³). A cone is one third of the cylinder on the same base and height; a hemisphere is two thirds of it.</figcaption>
</figure>

## 2D examples

**Example.** A rectangular field is 60 m by 40 m with a 2 m path around the outside. Area of the path?
Outer 64 × 44 = 2816; inner 2400; path 416 m².

**Example.** A path 3 m wide runs inside a square field of side 50 m along its border. Area of path? 2500 − 44² = 2500 − 1936 = 564 m².

**Example.** The diagonals of a rhombus are 24 and 10. Side and area? Side = ½√(576 + 100) = 13; area = 120.

**Example.** A wire bent into a square encloses 121 cm². The same wire bent into a circle encloses? Side 11, perimeter 44 → 2πr = 44 → r = 7 → area 154 cm².

**Example.** The radius of a circle is increased by 10%. Its area increases by? 21%.

**Example.** A sector has radius 7 cm and angle 90°. Area and perimeter? Area = ¼ × 154 = 38.5; arc = ¼ × 44 = 11; perimeter = 11 + 14 = 25 cm.

**Example.** Area of an equilateral triangle of side 6 = (√3/4) × 36 = 9√3 ≈ 15.59.

**Example.** A trapezium has parallel sides 12 and 18 and height 5. Area = ½ × 30 × 5 = 75.

**Example.** How many tiles of 20 cm × 30 cm cover a floor 6 m × 4.5 m? 27 m² / 0.06 m² = 450.

## 3D examples

**Example.** A cuboid is 12 × 8 × 5. Volume, total surface, diagonal? 480; 2(96 + 40 + 60) = 392; √(144 + 64 + 25) = √233 ≈ 15.26.

**Example.** A cylinder of radius 7 and height 10: volume 1540; curved surface 440; total 748.

**Example.** A cone of radius 6 and height 8: slant 10; volume 96π ≈ 301.6; curved surface 60π ≈ 188.5.

**Example.** A sphere of radius 3: volume 36π ≈ 113.1; surface 36π ≈ 113.1. (Radius 3 is the case where the two are numerically equal.)

**Example.** A solid metal sphere of radius 6 is melted into small spheres of radius 2. How many? (6/2)³ = 27.

**Example.** A cylinder of radius 6 and height 12 is melted into a cone of the same radius. Height of the cone? Volume equal: ⅓h = 12 → 36.

**Example.** A cube of side 4 is cut into cubes of side 1. Increase in surface area? 64 × 6 − 96 = 384 − 96 = 288, i.e. four times.

**Example.** The volume of a cube is 1728 cm³. Its surface area? Side 12 → 864 cm².

**Example.** Water flows through a pipe of cross-section 1 cm² at 2 m/s into a tank 1 m × 0.5 m. Rise in water level per minute? Volume per minute = 1 cm² × 200 cm/s × 60 = 12,000 cm³ = 0.012 m³; base 0.5 m² → 0.024 m = 2.4 cm.

**Example.** A hemisphere bowl of radius 7 holds how much? (2/3) × (22/7) × 343 = 718.67 cm³.

## Cost questions

Fencing uses perimeter; painting walls uses lateral surface; flooring or carpeting uses area; digging uses volume.

**Example.** Cost of fencing a circular field of radius 35 m at ₹20/m: 2 × (22/7) × 35 = 220 m → ₹4,400.

**Example.** Cost of painting the four walls of a room 8 × 6 × 4 m at ₹15/m²: 2 × 4 × (8 + 6) = 112 → ₹1,680.

## Traps

- The path "outside" adds twice the width to each dimension; "inside" subtracts.
- Sector angle in the formula is in degrees over 360.
- A cone's slant height, not its vertical height, goes in the curved surface formula.
- Total surface of a hemisphere is 3πr² (curved plus the flat face).
- Recasting: equate volumes, not surface areas; cutting a solid keeps volume but increases surface.
- Units: convert everything to the same unit before multiplying (1 m² = 10,000 cm², 1 m³ = 1,000 L).

## Practice set

1. A rectangle's length is twice its breadth and its perimeter is 72. Area?
2. Area of a square with diagonal 10√2.
3. A circular garden of radius 14 m has a 3.5 m path around it. Area of the path?
4. Triangle sides 5, 6, 7: area (Heron, to one decimal).
5. Sides of a rhombus are 10 and one diagonal is 12. The other diagonal and area?
6. Curved surface of a cylinder is 880 cm² and height is 20 cm. Radius?
7. A cone has volume 314 cm³ and height 12 cm (π = 3.14). Radius?
8. Surface area of a sphere is 616 cm². Volume?
9. How many cubes of side 3 cm can be cut from a cuboid 27 × 18 × 9 cm?
10. A cylindrical tank of radius 3.5 m and height 4 m holds how many litres?
11. Ratio of volumes of a cylinder, a cone, and a hemisphere with the same radius r and height r.
12. A cube's surface area is 150. Its diagonal?

**Answers**

1. 2(2b + b) = 72 → b = 12, l = 24 → 288.
2. d²/2 = 200/2 = 100.
3. π(17.5² − 14²) = (22/7)(306.25 − 196) = (22/7)(110.25) = 346.5 m².
4. s = 9; √(9 × 4 × 3 × 2) = √216 ≈ 14.7.
5. Half-diagonals 6 and x: 36 + x² = 100 → x = 8 → other diagonal 16; area ½ × 12 × 16 = 96.
6. 2πrh = 880 → r = 880/(2 × 22/7 × 20) = 7 cm.
7. ⅓ × 3.14 × r² × 12 = 314 → r² = 25 → 5 cm.
8. 4πr² = 616 → r² = 49 → r = 7 → (4/3)(22/7)(343) = 1437.33 cm³.
9. 4374/27 = 162 (9 × 6 × 3).
10. π × 3.5² × 4 = (22/7)(12.25)(4) = 154 m³ = 154,000 L.
11. πr³ : ⅓πr³ : ⅔πr³ = 3 : 1 : 2.
12. 6a² = 150 → a = 5 → 5√3 ≈ 8.66.
