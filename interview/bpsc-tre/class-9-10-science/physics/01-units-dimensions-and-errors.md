---
title: Units, Dimensions and Errors
part: Foundations
summary: SI units and their 2019 definitions, practical units, prefixes, dimensional formulas and their uses, significant figures, errors and least count, scalars vs vectors, intensive vs extensive — the "which unit / which is not a vector" questions TRE loves.
---

This chapter covers measurement: units (NCERT class 9 and class 11 Chapter 1–2), dimensional analysis, errors and the basics of vectors.
TRE asks it as one-liners — "The unit of inductance is…", "Which is not a vector quantity?", "Which is an intensive property?" — so every unit table below is exam material.

> **In simple words:** A physical quantity = a number × a unit (5 m, 10 kg). Units tell us *what* we measured; dimensions tell us *what the quantity is made of* in terms of mass (M), length (L) and time (T). If you know the dimensions, you can check a formula, convert units and even guess a formula.

## 1. Physical quantities: fundamental and derived

- A **fundamental (base) quantity** does not depend on any other quantity (length, mass, time…).
- A **derived quantity** is made from base quantities (speed = length ÷ time, force = mass × acceleration).
- A **system of units**: CGS (centimetre–gram–second), FPS (foot–pound–second), MKS (metre–kilogram–second) and today's **SI** (Système International, adopted 1960 by the 11th CGPM).

### The seven SI base units

| Quantity | SI unit | Symbol | Defined today (since 20 May 2019) by fixing |
|---|---|---|---|
| Length | metre | m | speed of light c = 299 792 458 m/s |
| Mass | kilogram | kg | Planck constant h = 6.626 070 15 × 10⁻³⁴ J s |
| Time | second | s | caesium-133 hyperfine frequency = 9 192 631 770 Hz |
| Electric current | ampere | A | elementary charge e = 1.602 176 634 × 10⁻¹⁹ C |
| Temperature | kelvin | K | Boltzmann constant k = 1.380 649 × 10⁻²³ J/K |
| Amount of substance | mole | mol | Avogadro number Nₐ = 6.022 140 76 × 10²³ mol⁻¹ |
| Luminous intensity | candela | cd | luminous efficacy 683 lm/W at 540 × 10¹² Hz |

> **Remember:** Before 2019 the kilogram was a platinum–iridium cylinder kept at Sèvres, near Paris (the "International Prototype Kilogram"). Now **all seven** base units are defined through fixed constants of nature.

- **Radian (rad)** — plane angle; **steradian (sr)** — solid angle. They used to be called "supplementary units"; since 1995 they are *dimensionless derived units*.
- Full sphere = 4π sr; full circle = 2π rad; 1 rad = 57.3°.

> **Memory trick:** "**M**y **K**ind **S**ister **A**lways **K**eeps **M**y **C**andy" → metre, kilogram, second, ampere, kelvin, mole, candela.

## 2. Derived SI units with special names

These are the most asked "unit of …" facts.

| Quantity | Unit (name) | In base units | Other forms |
|---|---|---|---|
| Force | newton (N) | kg m s⁻² | — |
| Work, energy, heat | joule (J) | kg m² s⁻² | N m, W s |
| Power | watt (W) | kg m² s⁻³ | J/s |
| Pressure, stress | pascal (Pa) | kg m⁻¹ s⁻² | N/m² |
| Frequency | hertz (Hz) | s⁻¹ | — |
| Charge | coulomb (C) | A s | — |
| Potential, EMF | volt (V) | kg m² s⁻³ A⁻¹ | J/C, W/A |
| Resistance | ohm (Ω) | kg m² s⁻³ A⁻² | V/A |
| Conductance | siemens (S) | Ω⁻¹ | old name "mho" |
| Capacitance | farad (F) | kg⁻¹ m⁻² s⁴ A² | C/V |
| Inductance | henry (H) | kg m² s⁻² A⁻² | Wb/A = V s/A = **Ω s** |
| Magnetic flux | weber (Wb) | kg m² s⁻² A⁻¹ | V s, T m² |
| Magnetic field (flux density) B | tesla (T) | kg s⁻² A⁻¹ | Wb/m², N/(A m) |
| Magnetic dipole moment | — | A m² | J/T |
| Activity (radioactivity) | becquerel (Bq) | s⁻¹ | 1 Ci = 3.7 × 10¹⁰ Bq |
| Absorbed dose | gray (Gy) | J/kg | old unit rad = 0.01 Gy |
| Dose equivalent | sievert (Sv) | J/kg | old unit rem = 0.01 Sv |
| Luminous flux | lumen (lm) | cd sr | — |
| Illuminance | lux (lx) | lm/m² | — |
| Power of lens | dioptre (D) | m⁻¹ | 1/focal length in metre |
| Sound intensity level | decibel (dB) | dimensionless (log ratio) | 1 bel = 10 dB |

> **PYQ:** TRE 2.0 (2023) asked: "The power of a lens is measured in — (A) dioptre (B) aeon (C) candela". **Official answer: (A) dioptre.** (An *aeon* is a time span of 10⁹ years; the *candela* is the unit of luminous intensity.)

> **PYQ:** TRE 2.0 (2023) asked: "The unit of magnetic dipole moment is — (A) newton/(ampere-metre) (B) ampere/metre (C) ampere-metre²". **Official answer: (C) A m².** Option (A) N/(A m) is the tesla (unit of B); option (B) A/m is the unit of magnetic intensity H and of magnetisation M.

> **PYQ:** TRE 2.0 (2023) asked: "The unit of inductance is — (A) ohm-second (B) ohm/second (C) second/ohm". **Official answer: (A) ohm-second.** Reason: EMF = L (dI/dt) → L = V·s/A = (V/A)·s = Ω s.

> **PYQ:** TRE 2.0 (2023) asked: "The unit of sound is — (A) hertz (B) decibel (C) wave number". **Official answer: (B) decibel** (loudness / intensity level). Hertz is the unit of frequency (pitch), wave number is 1/λ (m⁻¹).

> **PYQ:** TRE 3.0 (2024) asked the **SI unit of force** — the newton (1 N = 1 kg m s⁻²). One newton is the force that gives 1 kg an acceleration of 1 m/s².

## 3. Practical (non-SI) units you must convert

| Unit | Measures | Value |
|---|---|---|
| Ångström (Å) | length (atoms, wavelengths) | 10⁻¹⁰ m |
| Fermi (fm, femtometre) | nuclear size | 10⁻¹⁵ m |
| Micron (µm) | length | 10⁻⁶ m |
| Astronomical unit (AU) | Earth–Sun mean distance | 1.496 × 10¹¹ m |
| Light year (ly) | distance light travels in 1 year | 9.46 × 10¹⁵ m |
| Parsec (pc) | astronomical distance | 3.26 ly = 3.086 × 10¹⁶ m |
| Nautical mile | sea/air navigation | 1852 m |
| Knot | speed | 1 nautical mile per hour ≈ 1.852 km/h |
| Barn | nuclear cross-section (area) | 10⁻²⁸ m² |
| Electron volt (eV) | energy | 1.6 × 10⁻¹⁹ J |
| Kilowatt hour (kWh, "unit" of electricity) | energy | 3.6 × 10⁶ J |
| Calorie (cal) | heat | 4.186 J (≈ 4.2 J) |
| Horsepower (hp) | power | 746 W |
| Erg | energy (CGS) | 10⁻⁷ J |
| Dyne | force (CGS) | 10⁻⁵ N |
| Atmosphere (atm) | pressure | 1.013 × 10⁵ Pa = 760 mm Hg |
| Bar | pressure | 10⁵ Pa |
| Torr | pressure | 1 mm of Hg ≈ 133.3 Pa |
| Gauss | magnetic field (CGS) | 10⁻⁴ T |
| Maxwell | magnetic flux (CGS) | 10⁻⁸ Wb |
| Curie (Ci) | radioactivity | 3.7 × 10¹⁰ decays/s |
| Shake | time (nuclear physics) | 10⁻⁸ s |

> **Common mistake:** The light year is a unit of **distance**, not time. The "unit" on your electricity bill is **energy** (kWh), not power.

> **Remember:** Largest to smallest distance unit: parsec > light year > AU. 1 parsec is the distance at which 1 AU subtends 1 arc-second.

## 4. SI prefixes

| Prefix | Symbol | Power | Prefix | Symbol | Power |
|---|---|---|---|---|---|
| quetta | Q | 10³⁰ | deci | d | 10⁻¹ |
| ronna | R | 10²⁷ | centi | c | 10⁻² |
| yotta | Y | 10²⁴ | milli | m | 10⁻³ |
| zetta | Z | 10²¹ | micro | µ | 10⁻⁶ |
| exa | E | 10¹⁸ | nano | n | 10⁻⁹ |
| peta | P | 10¹⁵ | pico | p | 10⁻¹² |
| tera | T | 10¹² | femto | f | 10⁻¹⁵ |
| giga | G | 10⁹ | atto | a | 10⁻¹⁸ |
| mega | M | 10⁶ | zepto | z | 10⁻²¹ |
| kilo | k | 10³ | yocto | y | 10⁻²⁴ |
| hecto | h | 10² | ronto | r | 10⁻²⁷ |
| deca | da | 10¹ | quecto | q | 10⁻³⁰ |

Ronna, quetta, ronto and quecto were added in November 2022 (27th CGPM).

## 5. Dimensions and dimensional formulas

The **dimensions** of a quantity are the powers to which base quantities must be raised to represent it. Force = mass × acceleration → [M L T⁻²]. We write [M^a L^b T^c A^d K^e].

### Master table of dimensional formulas

| Quantity | Formula used | Dimensions |
|---|---|---|
| Velocity, speed | distance/time | [L T⁻¹] |
| Acceleration | v/t | [L T⁻²] |
| Force | ma | [M L T⁻²] |
| Momentum, impulse | mv, F t | [M L T⁻¹] |
| Work, energy, torque | F s, F r | [M L² T⁻²] |
| Power | W/t | [M L² T⁻³] |
| Pressure, stress, Young's modulus, energy density | F/A | [M L⁻¹ T⁻²] |
| Strain, angle, refractive index, relative density | ratio | dimensionless [M⁰L⁰T⁰] |
| Frequency, angular velocity, velocity gradient | 1/t | [T⁻¹] |
| Gravitational constant G | F r²/(m₁m₂) | [M⁻¹ L³ T⁻²] |
| Planck constant h, angular momentum | E/ν, mvr | [M L² T⁻¹] |
| Surface tension, spring constant | F/l | [M T⁻²] |
| Coefficient of viscosity η | F/(A dv/dx) | [M L⁻¹ T⁻¹] |
| Moment of inertia | m r² | [M L²] |
| Specific heat | Q/(m ΔT) | [L² T⁻² K⁻¹] |
| Latent heat | Q/m | [L² T⁻²] |
| Thermal conductivity | — | [M L T⁻³ K⁻¹] |
| Gas constant R, Boltzmann k | PV/(nT), E/T | [M L² T⁻² K⁻¹ mol⁻¹], [M L² T⁻² K⁻¹] |
| Stefan constant σ | E/(A t T⁴) | [M T⁻³ K⁻⁴] |
| Charge | I t | [A T] |
| Potential difference | W/q | [M L² T⁻³ A⁻¹] |
| Resistance | V/I | [M L² T⁻³ A⁻²] |
| Capacitance | q/V | [M⁻¹ L⁻² T⁴ A²] |
| Inductance | V/(dI/dt) | [M L² T⁻² A⁻²] |
| Magnetic field B | F/(I l) | [M T⁻² A⁻¹] |
| Magnetic flux | B A | [M L² T⁻² A⁻¹] |
| Permittivity ε₀ | q²/(4π F r²) | [M⁻¹ L⁻³ T⁴ A²] |
| Permeability µ₀ | — | [M L T⁻² A⁻²] |

### Quantities with the same dimensions (favourite "match the pair")

| Same dimensions | Dimensions |
|---|---|
| Work, energy, torque, heat | [M L² T⁻²] |
| Momentum and impulse | [M L T⁻¹] |
| Pressure, stress, Young's modulus, bulk modulus, energy per unit volume | [M L⁻¹ T⁻²] |
| Planck constant, angular momentum | [M L² T⁻¹] |
| Surface tension, spring constant, surface energy (energy/area) | [M T⁻²] |
| Frequency, angular frequency, velocity gradient, decay constant | [T⁻¹] |
| Time constants RC, L/R and √(LC) | [T] |
| 1/√(µ₀ε₀) and E/B | [L T⁻¹] (a speed — the speed of light) |
| Latent heat and gravitational potential (energy/mass) | [L² T⁻²] |

> **Exam angle:** "Torque and work have the same dimensions but torque is not measured in joule" — torque is written N m (it is a vector), work is J (a scalar). Same dimensions do not mean same quantity.

## 6. Uses of dimensional analysis

1. **Check a formula** (principle of homogeneity: each term on both sides must have the same dimensions).
2. **Convert a value from one system to another**: n₂ = n₁ [M₁/M₂]^a [L₁/L₂]^b [T₁/T₂]^c.
3. **Derive a relation** when the quantity depends on known quantities as a product of powers.

<div class="formula">

| Rule | Statement |
|---|---|
| Homogeneity | [LHS] = [RHS]; you can only add or subtract like dimensions |
| Conversion | n₁u₁ = n₂u₂ → n₂ = n₁ (u₁/u₂) |
| Arguments | sin θ, e^x, log x need dimensionless θ, x |

</div>

### Worked numericals

**Example 1 (checking).** Is s = ut + ½at² correct dimensionally?
[s] = L. [ut] = (L T⁻¹)(T) = L. [at²] = (L T⁻²)(T²) = L. All terms are L → **dimensionally correct** (the ½ cannot be checked — numbers have no dimensions).

**Example 2 (conversion: 1 newton into dyne).** 1 N = 1 kg m s⁻². 1 kg = 10³ g, 1 m = 10² cm.
1 N = 10³ g × 10² cm × s⁻² = **10⁵ dyne**.

**Example 3 (G into CGS).** G = 6.67 × 10⁻¹¹ N m² kg⁻², dimensions [M⁻¹ L³ T⁻²].
n₂ = 6.67 × 10⁻¹¹ × (1 kg/1 g)⁻¹ × (1 m/1 cm)³ = 6.67 × 10⁻¹¹ × 10⁻³ × 10⁶ = **6.67 × 10⁻⁸ dyne cm² g⁻²**.

**Example 4 (1 joule into erg).** 1 J = 1 kg m² s⁻² = 10³ g × 10⁴ cm² s⁻² = **10⁷ erg**.

**Example 5 (deriving the pendulum formula).** Suppose T depends on length l, mass m and g: T = k l^a m^b g^c.
[T] = L^a M^b (L T⁻²)^c → M: b = 0; T: −2c = 1 → c = −½; L: a + c = 0 → a = ½.
So **T = k √(l/g)**; the time period does not depend on mass. (k = 2π comes from experiment/theory, not from dimensions.)

**Example 6 (find the dimensions of a constant).** In van der Waals' (P + a/V²)(V − b) = RT, a/V² must be a pressure → [a] = [P][V²] = M L⁻¹ T⁻² × L⁶ = **[M L⁵ T⁻²]**; b must be a volume → [b] = **[L³]**.

### Limitations of dimensional analysis

- Cannot give dimensionless constants (2π, ½).
- Cannot derive formulas with sums (s = ut + ½at²), or with sin, log, exponential.
- Fails if the quantity depends on more than three base quantities (with M, L, T only three equations).
- A dimensionally correct formula may still be wrong (e.g. s = ut + at² is dimensionally fine but wrong).

## 7. Accuracy, precision and significant figures

- **Accuracy** = how close a measurement is to the true value.
- **Precision** = how close repeated measurements are to each other (also the resolution of the instrument).
- A measurement can be precise but not accurate (all readings close but a zero error shifts all of them).

### Rules for significant figures (s.f.)

1. All non-zero digits are significant: 2.345 → 4 s.f.
2. Zeros between non-zero digits are significant: 2005 → 4 s.f.
3. Leading zeros (before the first non-zero digit) are **not** significant: 0.0052 → 2 s.f.
4. Trailing zeros after the decimal point are significant: 2.500 → 4 s.f.; 0.007020 → 4 s.f.
5. Trailing zeros in a whole number without a decimal point are ambiguous: 4500 → use 4.5 × 10³ (2 s.f.) or 4.50 × 10³ (3 s.f.).
6. Changing units does not change s.f.: 2.30 m = 230 cm = 2.30 × 10² cm (3 s.f.).

<div class="formula">

| Operation | Keep in the answer |
|---|---|
| Multiplication / division | the **least number of significant figures** among the data |
| Addition / subtraction | the **least number of decimal places** among the data |
| Rounding | digit after last kept digit > 5 → round up; < 5 → drop; exactly 5 → make the kept digit even (NCERT rule) |

</div>

**Example 7.** 2.5 × 3.42 = 8.55 → keep 2 s.f. → **8.6**. 2.5 + 3.42 = 5.92 → keep one decimal place → **5.9**.

**Example 8.** Number of s.f. in 0.0006032 → **4** (6, 0, 3, 2).

## 8. Errors in measurement

| Type | Cause | Example | Can be removed? |
|---|---|---|---|
| Systematic error | same direction every time | zero error of a screw gauge, wrong calibration | yes, by correction |
| Random error | unpredictable fluctuations | small changes in temperature, reading variation | reduced by averaging many readings |
| Least-count error | limit of the instrument's resolution | metre scale reads only to 1 mm | reduced with a finer instrument |
| Personal / gross error | carelessness | reading the wrong scale | yes, by care |

- **Absolute error** Δa = |true (mean) value − measured value|.
- **Mean absolute error** = average of |Δa|.
- **Relative error** = Δa_mean / a_mean; **percentage error** = relative error × 100.

<div class="formula">

| Result | Maximum error |
|---|---|
| Z = A + B or A − B | ΔZ = ΔA + ΔB (absolute errors **add**, even for subtraction) |
| Z = AB or A/B | ΔZ/Z = ΔA/A + ΔB/B (relative errors add) |
| Z = Aⁿ | ΔZ/Z = n (ΔA/A) |
| Z = A^p B^q / C^r | ΔZ/Z = p ΔA/A + q ΔB/B + r ΔC/C |

</div>

**Example 9 (NCERT).** Pendulum time readings: 2.63, 2.56, 2.42, 2.71, 2.80 s.
Mean = 13.12/5 = 2.624 ≈ 2.62 s. Absolute errors: 0.01, 0.06, 0.20, 0.09, 0.18 → mean = 0.54/5 = 0.108 ≈ 0.11 s.
Relative error = 0.11/2.62 ≈ 0.042 → **T = 2.62 ± 0.11 s, ≈ 4%**.

**Example 10.** R = V/I with V = (100 ± 5) V and I = (10 ± 0.2) A.
% error in R = 5% + 2% = **7%** → R = 10 Ω ± 7% (± 0.7 Ω).

**Example 11.** Side of a square = (2.0 ± 0.1) cm. % error in side = 5%. Area = a² → % error = 2 × 5% = **10%** → A = 4.0 ± 0.4 cm².

**Example 12.** g = 4π² l / T². If l has 1% error and T has 2% error, % error in g = 1 + 2 × 2 = **5%**. (This is why we time many oscillations — T carries double weight.)

### Least count of instruments

| Instrument | Least count |
|---|---|
| Metre scale | 1 mm |
| Vernier callipers | 1 MSD − 1 VSD (usually 0.1 mm = 0.01 cm) |
| Screw gauge | pitch ÷ number of circular-scale divisions (usually 1 mm/100 = 0.01 mm) |
| Spherometer | 0.01 mm (typical) |
| Stopwatch | 0.1 s or 0.01 s |

**Example 13 (vernier).** 10 VSD = 9 MSD and 1 MSD = 1 mm → 1 VSD = 0.9 mm → LC = 1 − 0.9 = **0.1 mm**.

**Example 14 (screw gauge).** Pitch 0.5 mm, circular scale has 50 divisions → LC = 0.5/50 = **0.01 mm**.

> **Remember:** *Zero error* — if the vernier zero lies to the right of the main-scale zero, the error is positive and is **subtracted** from the reading (corrected reading = observed − zero error).

## 9. Scalars and vectors

- A **scalar** has magnitude only (mass, speed, time, energy).
- A **vector** has magnitude **and** direction and obeys the vector (triangle/parallelogram) law of addition.

| Scalars | Vectors |
|---|---|
| distance, speed | displacement, velocity |
| mass, time, temperature | acceleration, force, weight |
| work, energy, power | momentum, impulse |
| pressure, density | torque, angular momentum, angular velocity |
| charge, electric potential | electric field, magnetic field B |
| electric current (!) | area (as a vector normal to the surface), dipole moment |
| electric and magnetic flux | gravitational field intensity |

> **PYQ:** TRE 2.0 (2023) asked: "Which of the following is not a vector quantity? (A) Speed (B) Displacement (C) Velocity". **Official answer: (A) speed** — speed is the magnitude of velocity and has no direction.

> **Common mistake:** **Current** has a direction but is a **scalar**, because currents add algebraically (they do not obey the parallelogram law). Pressure is also a scalar — it acts equally in all directions.

### Adding two vectors

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="60" y1="160" x2="240" y2="160"/>
  <polyline points="232,155 240,160 232,165"/>
  <line x1="60" y1="160" x2="130" y2="60"/>
  <polyline points="122,64 130,60 129,69"/>
  <line x1="130" y1="60" x2="310" y2="60" stroke-dasharray="4 3"/>
  <line x1="240" y1="160" x2="310" y2="60" stroke-dasharray="4 3"/>
  <line x1="60" y1="160" x2="310" y2="60" stroke-width="2"/>
  <polyline points="300,61 310,60 304,69"/>
  <path d="M 90 160 A 30 30 0 0 0 78 135"/>
  <text x="150" y="178" fill="currentColor" stroke="none">A</text>
  <text x="74" y="105" fill="currentColor" stroke="none">B</text>
  <text x="190" y="100" fill="currentColor" stroke="none">R = A + B</text>
  <text x="94" y="150" fill="currentColor" stroke="none">θ</text>
  <text x="330" y="120" fill="currentColor" stroke="none">Parallelogram law</text>
</svg>

<div class="formula">

| Result | Formula |
|---|---|
| Magnitude of resultant | R = √(A² + B² + 2AB cos θ) |
| Direction (angle with A) | tan α = B sin θ / (A + B cos θ) |
| Maximum (θ = 0°) | R = A + B |
| Minimum (θ = 180°) | R = \|A − B\| |
| Perpendicular (θ = 90°) | R = √(A² + B²) |
| Dot (scalar) product | A·B = AB cos θ (e.g. work W = F·s, power P = F·v) |
| Cross (vector) product | \|A × B\| = AB sin θ (e.g. torque τ = r × F, L = r × p) |

</div>

**Example 15.** Two forces of 3 N and 4 N act at 90°. R = √(9 + 16) = **5 N**. The resultant of 3 N and 4 N can be anything from 1 N to 7 N — it can never be 8 N or 0.5 N.

**Example 16.** Two equal forces F at 120°: R = √(F² + F² + 2F² cos 120°) = √(2F² − F²) = **F**.

- Three vectors can add to zero only if they can form a closed triangle (each ≤ sum of the other two).
- A·B = 0 → vectors are perpendicular; A × B = 0 → vectors are parallel or antiparallel.

## 10. Intensive and extensive properties

- **Extensive** property depends on the amount of matter: mass, volume, weight, energy, heat capacity, entropy, length.
- **Intensive** property does not depend on the amount: temperature, pressure, density, refractive index, specific heat, boiling point, viscosity, surface tension, colour, emf of a cell, molar quantities.

> **PYQ:** TRE 2.0 (2023) asked: "Which of the following is an intensive property? (A) Refractive index (B) Volume (C) Mass". **Official answer: (A) refractive index.**

> **Memory trick:** Divide an extensive by an extensive and you get an intensive: mass ÷ volume = density; heat capacity ÷ mass = specific heat.

## 11. Important physical constants (keep in memory)

| Constant | Value |
|---|---|
| Speed of light c | 3 × 10⁸ m/s |
| Gravitational constant G | 6.67 × 10⁻¹¹ N m² kg⁻² |
| Planck constant h | 6.63 × 10⁻³⁴ J s |
| Electron charge e | 1.6 × 10⁻¹⁹ C |
| Electron mass mₑ | 9.11 × 10⁻³¹ kg |
| Proton mass mₚ | 1.673 × 10⁻²⁷ kg (≈ 1836 mₑ) |
| Avogadro number Nₐ | 6.022 × 10²³ mol⁻¹ |
| Boltzmann constant k | 1.38 × 10⁻²³ J/K |
| Gas constant R | 8.314 J mol⁻¹ K⁻¹ |
| Stefan constant σ | 5.67 × 10⁻⁸ W m⁻² K⁻⁴ |
| Permittivity ε₀ | 8.85 × 10⁻¹² C² N⁻¹ m⁻² (1/4πε₀ = 9 × 10⁹) |
| Permeability µ₀ | 4π × 10⁻⁷ T m/A (now measured, ≈ 1.2566 × 10⁻⁶) |
| hc | 1240 eV nm (very useful: λ in nm = 1240/E in eV) |
| 1 atomic mass unit | 1.66 × 10⁻²⁷ kg = 931.5 MeV |

For GS-level revision of the same ideas see [Motion, Force, Work and Energy (BPSC CCE)](/interview/bpsc-2027/science/motion-force-work-and-energy). Next chapter: [Kinematics and Laws of Motion](/interview/bpsc-tre/class-9-10-science/physics/kinematics-and-laws-of-motion).

## Traps and exceptions

- **Light year** = distance, **parsec** = distance (bigger), **aeon** = time, **"unit" of electricity** = kWh = energy.
- **Current** has direction but is a **scalar**; **pressure** is a scalar; **area** can be treated as a vector.
- **Torque** and **work** share [M L² T⁻²] but are different quantities (vector vs scalar).
- **Angle** has a unit (radian) but no dimensions; **strain** has neither.
- **Henry = Ω s = Wb/A**, not Ω/s. **Farad = s/Ω** (since RC is a time).
- **Tesla = N/(A m) = Wb/m²**; A/m is the unit of H (and magnetisation), **not** of B.
- **Magnetic dipole moment** = A m² (also J/T), **not** A/m.
- **Decibel** measures sound *level* (loudness), **hertz** measures frequency (pitch).
- **Candela** (luminous intensity) is a base unit; **lumen** and **lux** are derived.
- In **subtraction**, absolute errors still **add**.
- Leading zeros are never significant; trailing zeros after a decimal point always are.
- A dimensionally correct equation is **not necessarily** a correct equation.
- **kg** is the only SI base unit with a prefix in its name.
- Supplementary units (rad, sr) are now dimensionless derived units — old books still call them supplementary.

## Quick revision

1. SI has 7 base units: m, kg, s, A, K, mol, cd.
2. Since 2019, the kilogram is defined by fixing Planck's constant.
3. 1 N = 10⁵ dyne; 1 J = 10⁷ erg; 1 kWh = 3.6 × 10⁶ J; 1 eV = 1.6 × 10⁻¹⁹ J.
4. 1 hp = 746 W; 1 cal = 4.186 J; 1 atm = 1.013 × 10⁵ Pa.
5. 1 ly = 9.46 × 10¹⁵ m; 1 pc = 3.26 ly; 1 AU = 1.496 × 10¹¹ m.
6. 1 Å = 10⁻¹⁰ m; 1 fermi = 10⁻¹⁵ m; 1 barn = 10⁻²⁸ m².
7. Power of lens — dioptre; sound level — decibel; luminous intensity — candela.
8. Inductance — henry = Ω s; magnetic dipole moment — A m²; B — tesla.
9. [G] = M⁻¹L³T⁻²; [h] = ML²T⁻¹ = [angular momentum].
10. Pressure, stress, modulus and energy density share ML⁻¹T⁻².
11. Surface tension and spring constant share MT⁻².
12. RC, L/R and √(LC) all have the dimension of time.
13. 1/√(µ₀ε₀) has the dimension of velocity.
14. Dimensional analysis cannot find numerical constants.
15. In products/quotients percentage errors add; in powers they multiply by the power.
16. Vernier LC = 1 MSD − 1 VSD; screw gauge LC = pitch ÷ divisions.
17. Speed, work, energy, current, pressure are scalars.
18. Max resultant = A + B; min = |A − B|.
19. Refractive index, density, temperature are intensive; mass, volume, energy are extensive.
20. hc = 1240 eV nm.

## Practice with answers

1. SI unit of luminous intensity? — **Candela** (one of the seven base units).
2. 1 parsec is about how many light years? — **3.26 ly** (≈ 3.086 × 10¹⁶ m).
3. Unit of magnetic flux? — **Weber** (1 Wb = 1 T m² = 1 V s).
4. Dimensions of Planck's constant? — **[M L² T⁻¹]** (same as angular momentum).
5. Which pair has the same dimensions: torque–work or force–power? — **Torque and work** ([M L² T⁻²]).
6. How many significant figures in 0.00450? — **3** (4, 5 and the trailing 0).
7. 1 kWh in joule? — **3.6 × 10⁶ J** (1000 W × 3600 s).
8. Is electric current a vector? — **No, a scalar** (does not obey vector addition).
9. Value of G in CGS? — **6.67 × 10⁻⁸ dyne cm² g⁻²** (multiply SI value by 10³).
10. Percentage error in kinetic energy if the speed has 2% error (mass exact)? — **4%** (K ∝ v²).
11. Least count of a screw gauge with 1 mm pitch and 100 divisions? — **0.01 mm**.
12. Dimensions of coefficient of viscosity? — **[M L⁻¹ T⁻¹]** (unit: Pa s, poise in CGS).
13. Unit of absorbed radiation dose? — **Gray** (J/kg); dose equivalent — sievert.
14. A/m is the unit of which quantity? — **Magnetic intensity H** (and magnetisation), not B.
15. The farad can be written as? — **s/Ω** (because RC has the unit of time) or C/V.
16. Can 3 N and 5 N give a resultant of 9 N? — **No** (maximum is 8 N).
17. Which prefix means 10⁻¹⁵? — **Femto** (f).
18. Is boiling point intensive or extensive? — **Intensive** (does not depend on amount).
19. Which base unit was defined by a physical artefact until 2019? — **Kilogram** (prototype at Sèvres).
20. 1 tesla = how many gauss? — **10⁴ gauss**.
