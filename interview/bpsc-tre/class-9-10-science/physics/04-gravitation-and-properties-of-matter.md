---
title: Gravitation and Properties of Matter
part: Mechanics
summary: Newton's law of gravitation, g and its variation, escape and orbital velocity, satellites, Kepler's laws and orbits in a central-force potential (B.Sc.), then elasticity, fluid pressure, buoyancy, surface tension, viscosity, streamlines, continuity and Bernoulli's theorem.
---

This chapter joins two NCERT topics — "Gravitation" (class 9 and 11) and "Mechanical Properties of Solids and Fluids" (class 11) — and adds the B.Sc. central-force result TRE 1.0 asked.
Questions are one-liners: "Kepler's second law is based on…", "a curve tangent to the velocity everywhere is called…", the value of escape velocity, which liquid shows capillary fall.

> **In simple words:** Every mass pulls every other mass; near the Earth this pull gives every falling body the same acceleration g. Satellites are simply objects falling around the Earth fast enough never to hit it. Solids resist being stretched (elasticity), liquids push equally in all directions (pressure), push up on anything inside them (buoyancy), and moving fluids follow streamlines where faster flow means lower pressure (Bernoulli).

## 1. Newton's law of gravitation

Every particle attracts every other particle with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between them:

<div class="formula">

| Quantity | Formula / value |
|---|---|
| Law of gravitation | F = G m₁m₂ / r² |
| Gravitational constant | G = 6.67 × 10⁻¹¹ N m² kg⁻² (universal, scalar) |
| First measured by | Henry Cavendish, 1798 (torsion balance) |
| Acceleration due to gravity | g = GM/R² ≈ 9.8 m/s² |
| Mass of Earth | M = gR²/G ≈ 6 × 10²⁴ kg |
| Radius of Earth | R ≈ 6400 km (6.37 × 10⁶ m) |

</div>

- Gravity is always **attractive**, acts along the line joining the masses, is a **central and conservative** force, and is the **weakest** of the four fundamental forces (but has infinite range).
- Gravitational force does not depend on the medium between the bodies.
- Force of Earth on an apple = force of the apple on Earth (third law); the apple accelerates visibly because its mass is tiny.

> **PYQ:** TRE 3.0 (2024) asked about the **universal law of gravitation** (per PW analysis). Key points: F ∝ m₁m₂, F ∝ 1/r², G = 6.67 × 10⁻¹¹ N m² kg⁻² is a universal constant.

**Example 1.** Two 1 kg masses 1 m apart: F = 6.67 × 10⁻¹¹ × 1 × 1/1² = **6.67 × 10⁻¹¹ N**. If the distance is halved, force becomes **4 times**.

## 2. Mass, weight and variation of g

- **Mass** = amount of matter, scalar, same everywhere (kg). **Weight** = force of gravity on it, W = mg, a vector, changes with g (N).
- On the Moon g is about **1/6** of Earth's (1.62 m/s²): a 60 kg person still has mass 60 kg but weighs 60 × 9.8/6 ≈ **98 N**.

<div class="formula">

| Change | g becomes |
|---|---|
| At height h (any h) | g_h = g R²/(R + h)² |
| At small height h ≪ R | g_h ≈ g (1 − 2h/R) |
| At depth d | g_d = g (1 − d/R) |
| At the centre of the Earth | g = 0 |
| With latitude λ (rotation) | g′ = g − ω²R cos²λ |

</div>

- g is **maximum at the poles, minimum at the equator** (Earth is flattened at the poles and the equator has the biggest rotation effect).
- If the Earth stopped rotating, g at the equator would **increase** (by ω²R ≈ 0.034 m/s²); at the poles there would be no change.
- If the Earth rotated about 17 times faster (one day ≈ 1.4 h), bodies at the equator would feel weightless.

**Example 2.** At h = R, g_h = g/4. At h = 32 km: g_h = g(1 − 64/6400) = 0.99 g (**1% less**). At the same depth d = 32 km: g_d = g(1 − 32/6400) = 0.995 g (**0.5% less**). Going up reduces g twice as fast as going down (for small distances).

**Example 3.** A planet has the same density as Earth but twice the radius. g = (4/3)πGρR → g ∝ R → **2g**.

## 3. Gravitational potential energy, escape and orbital velocity

<div class="formula">

| Quantity | Formula | Earth value |
|---|---|---|
| Gravitational PE | U = −GMm/r | — |
| Gravitational potential | V = −GM/r | — |
| Escape velocity | vₑ = √(2GM/R) = √(2gR) | **11.2 km/s** |
| Orbital velocity (near surface) | v₀ = √(GM/r) ≈ √(gR) | **7.9 km/s** |
| Relation | vₑ = √2 v₀ | — |
| Time period of a satellite | T = 2π √(r³/GM) | ≈ 84 min near the surface |
| Total energy of orbiting satellite | E = −GMm/(2r) (KE = −E, PE = 2E) | — |

</div>

- Escape velocity does **not** depend on the mass of the body thrown or the angle of projection. Moon's escape velocity ≈ **2.4 km/s**; this is why the Moon has no atmosphere (gas molecules escape).
- Orbital velocity does **not** depend on the satellite's mass; it decreases as orbit radius increases.
- An astronaut in an orbiting satellite feels **weightless** because he and the satellite are both falling freely with the same acceleration (not because gravity is zero there).

**Example 4.** vₑ = √(2 × 9.8 × 6.4 × 10⁶) = √(1.254 × 10⁸) ≈ **1.12 × 10⁴ m/s = 11.2 km/s**; v₀ = 11.2/√2 ≈ **7.9 km/s**.

**Example 5.** To make a satellite moving in a circular orbit escape, its speed must be increased by a factor of √2, i.e. by **41.4%**.

### Satellites

| Type | Height | Period | Use |
|---|---|---|---|
| Geostationary (geosynchronous, equatorial) | ≈ 35 786 km above surface (≈ 36 000 km; orbit radius ≈ 42 164 km) | 24 h (sidereal day ≈ 23 h 56 min), moves west → east | communication, TV, weather (INSAT/GSAT) |
| Polar / sun-synchronous | ≈ 500–800 km | ≈ 100 min | remote sensing, mapping (IRS, Cartosat) |
| Low Earth orbit | 160–2000 km | ≈ 90 min | ISS (≈ 400 km), Earth observation |

For India's space missions see [Space and Defence Technology (BPSC CCE)](/interview/bpsc-2027/science/space-and-defence-technology).

## 4. Kepler's laws of planetary motion

Johannes Kepler (1609, 1619) found three laws from Tycho Brahe's observations:

1. **Law of orbits**: every planet moves in an **ellipse** with the Sun at one focus.
2. **Law of areas**: the line joining the planet to the Sun sweeps **equal areas in equal times** → a planet moves fastest at perihelion (nearest point, early January for Earth) and slowest at aphelion (early July).
3. **Law of periods**: T² ∝ a³ (a = semi-major axis).

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <ellipse cx="210" cy="100" rx="160" ry="80"/>
  <circle cx="290" cy="100" r="8"/>
  <text x="280" y="125" fill="currentColor" stroke="none">Sun (focus)</text>
  <polygon points="290,100 370,100 362,65" stroke-dasharray="4 3"/>
  <polygon points="290,100 50,100 54,78" stroke-dasharray="4 3"/>
  <circle cx="370" cy="100" r="4"/>
  <circle cx="50" cy="100" r="4"/>
  <text x="374" y="96" fill="currentColor" stroke="none">perihelion</text>
  <text x="4" y="122" fill="currentColor" stroke="none">aphelion</text>
  <text x="336" y="60" fill="currentColor" stroke="none">fast</text>
  <text x="60" y="72" fill="currentColor" stroke="none">slow</text>
  <text x="120" y="160" fill="currentColor" stroke="none">equal shaded areas in equal times</text>
</svg>

- Law 2 follows from **conservation of angular momentum** (gravity is central, so no torque about the Sun): dA/dt = L/(2m) = constant.
- Law 3 follows from the inverse-square law: GMm/r² = m(2π/T)² r → T² = (4π²/GM) r³.

> **PYQ:** TRE 2.0 (2023) asked: "Kepler's second law is based on (A) Newton's first law (B) Newton's second law (C) conservation of angular momentum". **Official answer: (C) conservation of angular momentum.**

**Example 6.** A planet is 4 times as far from the Sun as Earth. T = 4^(3/2) = **8 years**.

**Example 7.** Two satellites at radii r and 4r: speeds v ∝ 1/√r → ratio **2 : 1**; periods ∝ r^(3/2) → **1 : 8**.

## 5. Motion under a central force (B.Sc.)

A **central force** acts along the line joining the body to a fixed centre and depends only on the distance r: F = f(r) r̂. Gravity and Coulomb's force are examples.

- Torque about the centre is zero → **angular momentum is conserved** → motion stays in **one plane** and the areal velocity is constant (Kepler's 2nd law holds for *every* central force, not only inverse-square).
- A central force is conservative: F = −dV/dr.
- For the inverse-square force, total energy decides the orbit: **E < 0 → ellipse (circle as a special case, bound)**, **E = 0 → parabola**, **E > 0 → hyperbola** (unbound).
- Effective potential: V_eff(r) = V(r) + L²/(2mr²); the extra term is the "centrifugal barrier".
- **Bertrand's theorem**: only two central forces give closed orbits for every bound state — the inverse-square force (F ∝ −1/r²) and the linear spring force (F ∝ −r).
- Circular orbits are stable for power-law forces F ∝ 1/r^m only if m < 3, i.e. for potentials −k/rⁿ only if n < 2.

### Period of circular orbits in V(r) = −k/rⁿ

<div class="formula">

| Step | Result |
|---|---|
| Force | F = −dV/dr = −nk/r^(n+1) (attractive, k > 0) |
| Circular orbit | mv²/R = nk/R^(n+1) → v² = nk/(mRⁿ) → v ∝ R^(−n/2) |
| Period | T = 2πR/v ∝ R^(1 + n/2) |
| Ratio for R → 2R | **T₂/T₁ = 2^(1 + n/2) = 2^((n + 2)/2)** |
| Check n = 1 (gravity) | T ∝ R^(3/2) — Kepler's third law ✓ |

</div>

> **PYQ:** TRE 1.0 (2023) asked: circular orbits in V(r) = −k/rⁿ (k > 0, 0 < n < 2); if T₁ is the period at radius R and T₂ at 2R, then T₂/T₁ = ? Options (A) 2^(n/2) (B) 2^(2n/3) (C) 2^(n/2 + 1). **Worked answer: (C) 2^(n/2 + 1)** (no official key in our files; option text partly garbled in the extracted file).

**Example 8.** For n = 1, T₂/T₁ = 2^1.5 = **2.83**. For n = 0.5, T₂/T₁ = 2^1.25 ≈ **2.38**.

## 6. Elasticity

- **Elasticity** = property of a body to regain its original shape/size after the deforming force is removed. **Plasticity** = no recovery (putty, wet clay).
- **Stress** = restoring force per unit area (N/m² = Pa). **Strain** = change in dimension ÷ original dimension (no unit).
- **Hooke's law**: within the elastic limit, stress ∝ strain; stress/strain = **modulus of elasticity**.

| Modulus | Definition | Applies to |
|---|---|---|
| Young's modulus Y | longitudinal stress / longitudinal strain = (F/A)/(ΔL/L) | solids (wires) |
| Bulk modulus K | −ΔP/(ΔV/V) | solids, liquids, gases; compressibility = 1/K |
| Shear (rigidity) modulus η or G | tangential stress / shear angle | solids only |
| Poisson's ratio σ | lateral strain / longitudinal strain | theoretical −1 to 0.5; practically 0 to 0.5 |

Relations: Y = 2η(1 + σ) = 3K(1 − 2σ). Elastic energy stored per unit volume = ½ × stress × strain.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="40" y1="170" x2="400" y2="170"/>
  <line x1="40" y1="170" x2="40" y2="15"/>
  <text x="360" y="188" fill="currentColor" stroke="none">strain</text>
  <text x="4" y="25" fill="currentColor" stroke="none">stress</text>
  <path d="M 40 170 L 120 70 Q 135 55 150 60 L 170 64 Q 250 20 320 40 Q 345 50 360 75"/>
  <circle cx="120" cy="70" r="3"/>
  <circle cx="150" cy="60" r="3"/>
  <circle cx="265" cy="30" r="3"/>
  <circle cx="360" cy="75" r="3"/>
  <text x="70" y="70" fill="currentColor" stroke="none">A</text>
  <text x="146" y="50" fill="currentColor" stroke="none">B</text>
  <text x="258" y="20" fill="currentColor" stroke="none">D</text>
  <text x="366" y="78" fill="currentColor" stroke="none">E</text>
  <text x="170" y="120" fill="currentColor" stroke="none">A proportional limit (Hooke)</text>
  <text x="170" y="135" fill="currentColor" stroke="none">B elastic limit / yield point</text>
  <text x="170" y="150" fill="currentColor" stroke="none">D ultimate strength, E fracture</text>
</svg>

- **Steel is more elastic than rubber** (larger Y — needs a bigger stress for the same strain). This is a favourite trap.
- **Ductile** materials (copper, aluminium) have a large plastic region between D and E; **brittle** ones (glass, cast iron) break soon after the elastic limit.
- Y of steel ≈ 2 × 10¹¹ Pa; Y of rubber ≈ 10⁶–10⁷ Pa. Y depends on the material, not on length or area.
- A liquid has only bulk modulus (no rigidity); for a perfectly rigid body Y would be infinite.
- **Elastic fatigue**: repeated stress weakens a material (bridges are declared unsafe after long use).
- Elasticity usually decreases with temperature (invar steel is an exception: almost no change).

**Example 9.** A 2 m wire of area 1 mm² stretches 1 mm under a 10 kg load (g = 10).
Stress = 100/10⁻⁶ = 10⁸ Pa; strain = 10⁻³/2 = 5 × 10⁻⁴; Y = 10⁸/(5 × 10⁻⁴) = **2 × 10¹¹ Pa** (steel).

## 7. Pressure in fluids, Pascal and Archimedes

<div class="formula">

| Idea | Formula |
|---|---|
| Pressure | P = F/A (Pa) |
| Pressure at depth h | P = P₀ + hρg |
| Atmospheric pressure | 1 atm = 76 cm of Hg = 1.013 × 10⁵ Pa ≈ 10.3 m of water |
| Pascal's law (hydraulic machine) | F₁/A₁ = F₂/A₂ |
| Buoyant force (Archimedes) | F_B = weight of fluid displaced = Vρ_fluid g |
| Floating condition | weight of body = weight of liquid displaced |
| Fraction submerged | ρ_body/ρ_liquid |

</div>

- **Pascal's law**: pressure applied to an enclosed fluid is transmitted equally and undiminished in all directions. Uses: hydraulic lift, hydraulic (car) brakes, hydraulic press.
- Pressure in a liquid does not depend on the shape of the container (hydrostatic paradox), only on depth and density.
- **Barometer** (Torricelli, 1643) measures atmospheric pressure; a sudden fall indicates a storm, a gradual rise fair weather. Pressure decreases with altitude — nose bleeding and difficulty in cooking at high altitude (water boils below 100 °C).
- **Archimedes' principle**: a body wholly or partly immersed in a fluid experiences an upward force equal to the weight of the fluid displaced.
- A ship floats because its hollow shape displaces water equal to its weight. It floats **higher in sea water** (denser) than in river water.
- **Hydrometer** measures density of liquids; **lactometer** checks purity of milk. Ice (density ≈ 0.92 g/cm³) floats with about 9/10 of it under water.
- **Relative density** (specific gravity) = density of substance ÷ density of water at 4 °C (no unit).

**Example 10 (hydraulic lift).** Small piston 10 cm², large piston 1000 cm². A 50 N push lifts 50 × 100 = **5000 N**.

**Example 11.** At 10 m depth in water, extra pressure = 1000 × 10 × 10 = 10⁵ Pa ≈ 1 atm → total ≈ **2 atm**.

**Example 12.** A stone weighs 10 N in air and 8 N in water. Buoyant force = 2 N → volume = 2/(1000 × 10) = 2 × 10⁻⁴ m³; relative density = 10/2 = **5**.

> **Remember:** When ice floating in water melts, the water level **does not change**. A body floats if its average density is less than the liquid's (an iron needle sinks, an iron ship floats).

## 8. Surface tension and capillarity

- **Surface tension (T)** = force per unit length acting along the surface of a liquid, perpendicular to any line drawn on it; also = surface energy per unit area. Unit N/m (or J/m²), dimensions [M T⁻²].
- Cause: **cohesive forces** (between like molecules) pull surface molecules inward, so the surface behaves like a stretched membrane. **Adhesive force** = between unlike molecules.
- Drops and bubbles are **spherical** because a sphere has the least surface area for a given volume.
- Surface tension **decreases with rise in temperature** (zero at the critical temperature) and with soap/detergent; it increases with highly soluble salts (NaCl).
- Everyday examples: insects (water strider) walking on water, a greased needle floating, hot soup tasting better (lower T spreads it), oil calming waves, detergents cleaning by lowering T, raindrops.

<div class="formula">

| Result | Formula |
|---|---|
| Excess pressure inside a liquid drop | ΔP = 2T/r |
| Excess pressure inside a soap bubble (two surfaces) | ΔP = 4T/r |
| Capillary rise (Jurin's law) | h = 2T cos θ/(r ρ g) → h ∝ 1/r |

</div>

- **Angle of contact θ**: water–clean glass ≈ 0° (acute, liquid wets glass, **rises** in a capillary, concave meniscus); mercury–glass ≈ 135°–140° (obtuse, does not wet, **falls**, convex meniscus).
- Capillary action examples: oil rising in a lamp wick, ink in blotting paper, water rising in plants (partly), towels soaking water, sap in trees. Ploughing fields breaks capillaries and keeps moisture in the soil.
- In a satellite (weightless) water rises to the top of any capillary tube, whatever its length.

**Example 13.** Water (T = 0.073 N/m, θ = 0°) in a tube of radius 0.5 mm: h = 2 × 0.073/(5 × 10⁻⁴ × 1000 × 9.8) = 0.146/4.9 ≈ **0.030 m = 3 cm**. Halving the radius doubles the rise.

## 9. Viscosity

- **Viscosity** = internal friction of a fluid; it opposes relative motion between its layers.
- **Newton's law of viscosity**: F = −η A (dv/dx); η = coefficient of viscosity. SI unit **Pa s** (= N s m⁻², also called poiseuille); CGS unit **poise**; 1 Pa s = 10 poise.
- Viscosity of **liquids decreases** with temperature; viscosity of **gases increases** with temperature.
- Honey, glycerine are very viscous; water ≈ 10⁻³ Pa s; air ≈ 1.8 × 10⁻⁵ Pa s. Blood viscosity rises when there are more cells.

<div class="formula">

| Result | Formula |
|---|---|
| Stokes' law (sphere moving slowly) | F = 6πηrv |
| Terminal velocity | v_t = 2r²(ρ − σ)g / (9η) → v_t ∝ r² |
| Reynolds number | Re = ρvD/η (dimensionless) |

</div>

- Below Re ≈ 2000 flow is usually **laminar (streamline)**, above ≈ 3000 **turbulent** (values vary by source, e.g. < 1000 / > 2000 in NCERT examples).
- Applications: raindrops fall slowly (terminal velocity), parachutes, Millikan's oil-drop experiment, choosing engine oil.

**Example 14.** If the radius of a falling droplet doubles, its terminal velocity becomes **4 times**.

## 10. Streamline flow, continuity and Bernoulli

- **Streamline (laminar) flow**: every particle passing a point follows the same path with the same velocity as earlier particles. A **streamline** is a curve whose tangent at any point gives the direction of fluid velocity at that point at that instant. Two streamlines can never cross.
- **Turbulent flow**: irregular, eddies, above the critical velocity.
- **Equation of continuity** (conservation of mass for an incompressible fluid): A₁v₁ = A₂v₂ → fluid speeds up where the pipe narrows (water from a narrowed hose goes farther; rivers flow faster in narrow parts).
- **Bernoulli's theorem** (conservation of energy per unit volume, ideal fluid): P + ½ρv² + ρgh = constant along a streamline. Where speed is high, pressure is low.

> **PYQ:** TRE 1.0 (2023) asked: "In the analysis of flow velocity of a fluid for a fixed instant of time, a space curve is drawn so that it is tangent everywhere to the velocity vector. This curve is usually known as (A) instantaneous curve (B) momentum curve (C) streamline". **Worked answer: (C) streamline** (no official key in our files).

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <path d="M 20 50 L 150 50 L 220 80 L 300 80 L 370 50 L 400 50"/>
  <path d="M 20 150 L 150 150 L 220 120 L 300 120 L 370 150 L 400 150"/>
  <line x1="40" y1="100" x2="120" y2="100"/>
  <polyline points="112,95 120,100 112,105"/>
  <line x1="225" y1="100" x2="295" y2="100" stroke-width="2.5"/>
  <polyline points="285,94 295,100 285,106"/>
  <text x="40" y="80" fill="currentColor" stroke="none">wide: A₁, slow v₁</text>
  <text x="40" y="125" fill="currentColor" stroke="none">high pressure P₁</text>
  <text x="215" y="70" fill="currentColor" stroke="none">narrow: fast v₂</text>
  <text x="215" y="140" fill="currentColor" stroke="none">low pressure P₂</text>
  <text x="90" y="190" fill="currentColor" stroke="none">A₁v₁ = A₂v₂ and P + ½ρv² = constant (Venturi)</text>
</svg>

| Application of Bernoulli | Explanation |
|---|---|
| Lift on an aeroplane wing (aerofoil) | air faster over the curved top → lower pressure above |
| Roofs blown off in storms | fast wind above lowers pressure; higher pressure inside pushes up |
| Two boats/trains moving close side by side are pulled together | fast flow between them lowers pressure |
| Atomiser, spray gun, Bunsen burner, carburettor | fast air stream lowers pressure and sucks liquid/gas up |
| Venturi meter | measures flow speed from pressure difference |
| Swing of a spinning cricket ball (Magnus effect) | different air speeds on the two sides |

- **Torricelli's theorem** (speed of efflux): water leaves a hole at depth h below the free surface with v = √(2gh), the same as free fall from h.

**Example 15.** A pipe narrows from 4 cm² to 1 cm². If water enters at 2 m/s it leaves the narrow part at 2 × 4/1 = **8 m/s**.

**Example 16.** A hole 5 m below the water surface in a tank: v = √(2 × 10 × 5) = **10 m/s**.

## Traps and exceptions

- **G** is a universal constant; **g** changes with place. G is a scalar, g is a vector.
- g is maximum at the **poles**, minimum at the **equator**; zero at the centre of the Earth.
- Escape velocity does **not** depend on the mass of the body or launch angle.
- Weightlessness in orbit is due to **free fall**, not absence of gravity.
- Geostationary satellites orbit **west to east** above the **equator** at ≈ 36 000 km.
- Kepler's second law = **conservation of angular momentum** (true for any central force).
- T₂/T₁ for V = −k/rⁿ is **2^(n/2 + 1)**, not 2^(n/2) — the extra 1 comes from the circumference 2πR.
- **Steel is more elastic than rubber.**
- Liquids and gases have **no** shear modulus.
- **Viscosity of gases increases** with temperature; of liquids decreases.
- **Mercury falls** in a glass capillary (obtuse angle of contact); water rises.
- Surface tension **decreases** with temperature and detergent.
- A soap bubble has **two** surfaces → excess pressure 4T/r; a drop has one → 2T/r.
- **Streamlines never intersect**.
- Where velocity is higher, pressure is **lower** (Bernoulli), not higher.
- When floating ice melts, the water level stays the **same**.

## Quick revision

1. F = Gm₁m₂/r²; G = 6.67 × 10⁻¹¹ N m² kg⁻² (Cavendish, 1798).
2. g = GM/R² ≈ 9.8 m/s²; on the Moon ≈ 1/6.
3. g at height h: g(1 − 2h/R); at depth d: g(1 − d/R).
4. Escape velocity (Earth) 11.2 km/s; Moon 2.4 km/s.
5. Orbital velocity near the surface 7.9 km/s; vₑ = √2 v₀.
6. Geostationary: 24 h period, ≈ 36 000 km, equatorial, west → east.
7. Kepler 1 ellipse, 2 equal areas, 3 T² ∝ a³.
8. Kepler's second law ← conservation of angular momentum.
9. Central force → L conserved → planar motion.
10. V = −k/rⁿ circular orbits: T ∝ R^(1 + n/2).
11. Hooke's law: stress ∝ strain within the elastic limit.
12. Y = 2η(1 + σ); Poisson's ratio practically 0–0.5.
13. Pascal's law → hydraulic lift and brakes.
14. 1 atm = 76 cm Hg = 1.013 × 10⁵ Pa.
15. Archimedes: buoyant force = weight of displaced fluid.
16. Surface tension unit N/m; decreases with temperature.
17. Capillary rise h = 2T cos θ/(rρg).
18. Viscosity unit Pa s; 1 Pa s = 10 poise.
19. Stokes' law F = 6πηrv; terminal velocity ∝ r².
20. Streamline = curve tangent to velocity at every point.
21. Continuity A₁v₁ = A₂v₂; Bernoulli P + ½ρv² + ρgh = constant.
22. Torricelli: v = √(2gh).

## Practice with answers

1. Who first measured G? — **Henry Cavendish** (1798, torsion balance).
2. Where is g maximum on Earth's surface? — **At the poles**.
3. Value of g at the centre of the Earth? — **Zero**.
4. Escape velocity from Earth? — **11.2 km/s**.
5. Does escape velocity depend on the mass of the projectile? — **No**.
6. Period of a geostationary satellite? — **24 hours** (one sidereal day ≈ 23 h 56 min).
7. A planet is 9 times farther from the Sun than Earth. Its year? — **27 Earth years** (9^(3/2)).
8. Which conservation law gives Kepler's second law? — **Angular momentum**.
9. In V = −k/r (n = 1), T₂/T₁ for R → 2R? — **2√2 ≈ 2.83**.
10. Which is more elastic, steel or rubber? — **Steel** (larger Young's modulus).
11. Which modulus does a liquid have? — **Only bulk modulus**.
12. Principle behind hydraulic brakes? — **Pascal's law**.
13. Why does a ship float higher in sea water? — **Sea water is denser**, so less volume is displaced.
14. Unit of surface tension? — **N/m**.
15. Does mercury rise or fall in a glass capillary? — **Falls** (angle of contact > 90°).
16. Effect of temperature on viscosity of a gas? — **Increases**.
17. Name the curve tangent everywhere to fluid velocity. — **Streamline**.
18. Which theorem explains lift on an aeroplane wing? — **Bernoulli's theorem**.
19. Excess pressure inside a soap bubble of radius r? — **4T/r**.
20. Water level after floating ice melts? — **Unchanged**.
