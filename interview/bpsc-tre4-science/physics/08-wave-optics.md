---
title: Wave Optics
part: Optics
summary: Huygens' principle, coherence and Young's double slit, intensity in interference, thin films and Newton's rings, single-slit diffraction and gratings, resolving power, and polarisation — Malus, Brewster, wave plates and optical activity — with the TRE 1.0 numericals worked out.
---

This chapter is class 12 wave optics plus the B.Sc. optics that TRE 1.0 asked three times in a row: interference intensity (I = 4I₀), single-slit width from the first minimum, and the quarter-wave plate.
Most questions are short numericals with one formula, so learn each formula with its meaning of every symbol.

> **In simple words:** Ray optics cannot explain why light makes bright and dark bands, bends around tiny edges, or can be "filtered" by Polaroid glasses. Treating light as a transverse wave explains all three: interference (waves adding or cancelling), diffraction (bending at small openings) and polarisation (vibrations in one plane only).

Ray-optics background is in [Ray optics and optical instruments](/interview/bpsc-tre4-science/physics/ray-optics-and-optical-instruments).

## 1. Wave theory of light — history and Huygens' principle

| Scientist | Contribution |
|---|---|
| Newton (1704) | Corpuscular theory; predicted light is **faster** in denser medium (wrong) |
| Christiaan Huygens (1678) | Wave theory; secondary wavelets |
| Thomas Young (1801) | Double-slit interference — proved wave nature |
| Augustin Fresnel (1815–18) | Diffraction theory; transverse nature with Arago |
| Étienne-Louis Malus (1808) | Polarisation by reflection; Malus' law |
| David Brewster (1815) | Brewster's law of polarising angle |
| Foucault (1850) | Measured light slower in water — supported wave theory |
| Maxwell (1865) | Light is an electromagnetic wave |

**Wavefront:** the locus of all points vibrating in the same phase. A point source gives spherical wavefronts; a distant source (sun) gives plane wavefronts; a line source (slit) gives cylindrical ones. Rays are always **perpendicular** to wavefronts.

**Huygens' principle:** (1) every point on a wavefront acts as a source of secondary wavelets that spread out with the speed of light in that medium; (2) the new wavefront is the forward envelope (common tangent) of these wavelets at a later time.

Using it, one can prove the laws of reflection and Snell's law, and show n = c/v — light is **slower** in a denser medium, which Foucault's experiment confirmed.

## 2. Superposition and coherence

When two waves overlap, the resultant displacement is the sum of individual displacements (**principle of superposition**).

- **Coherent sources** keep a **constant phase difference** (and same frequency). Only coherent sources give a steady interference pattern.
- Two independent bulbs or two candles are **not** coherent (atoms emit randomly, phase changes every ~10⁻⁸ s). Coherent sources are obtained from **one source**: Young's double slit (division of wavefront), Fresnel's biprism, Lloyd's mirror, thin films (division of amplitude). A **laser** is highly coherent.

<div class="formula">

| Quantity | Formula |
|---|---|
| Phase difference | φ = (2π/λ) × Δx (path difference) |
| Resultant intensity | I = I₁ + I₂ + 2√(I₁I₂) cos φ |
| Constructive (bright) | Δx = nλ, φ = 2nπ → I_max = (√I₁ + √I₂)² |
| Destructive (dark) | Δx = (2n − 1)λ/2, φ = (2n − 1)π → I_min = (√I₁ − √I₂)² |
| Equal sources I₀ each | I = 4I₀ cos²(φ/2); I_max = 4I₀, I_min = 0 |
| Intensity ∝ amplitude² | I₁/I₂ = (a₁/a₂)² |

</div>

Energy is **not destroyed** in interference; it is only redistributed — average intensity is still 2I₀.

**Worked numerical 1.** Two coherent sources have intensity ratio 9 : 1. Ratio I_max : I_min?
Amplitude ratio = √9 : √1 = 3 : 1 → I_max : I_min = (3 + 1)² : (3 − 1)² = 16 : 4 = **4 : 1**.

> **PYQ:** TRE 1.0 (2023) asked: in an interference pattern by two identical slits, intensity at a maximum is I; if either slit is closed, intensity at the same spot is I₀. Relation? (A) I = I₀ (B) I = 2I₀ (C) I = 4I₀. **Worked answer: (C) I = 4I₀** — amplitudes add (2a), and intensity ∝ (2a)² = 4a². (No official key for TRE 1.0 in our files.)

## 3. Young's double-slit experiment (YDSE)

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="40" y1="20" x2="40" y2="95"/>
  <line x1="40" y1="105" x2="40" y2="180"/>
  <line x1="150" y1="20" x2="150" y2="75"/>
  <line x1="150" y1="85" x2="150" y2="115"/>
  <line x1="150" y1="125" x2="150" y2="180"/>
  <line x1="380" y1="20" x2="380" y2="180" stroke-width="2.5"/>
  <line x1="40" y1="100" x2="150" y2="80" stroke-width="1"/>
  <line x1="40" y1="100" x2="150" y2="120" stroke-width="1"/>
  <line x1="150" y1="80" x2="380" y2="50"/>
  <line x1="150" y1="120" x2="380" y2="50"/>
  <line x1="150" y1="100" x2="380" y2="100" stroke-dasharray="4 3" stroke-width="1"/>
  <text x="20" y="104" fill="currentColor" stroke="none">S</text>
  <text x="130" y="76" fill="currentColor" stroke="none">S₁</text>
  <text x="130" y="134" fill="currentColor" stroke="none">S₂</text>
  <text x="156" y="104" fill="currentColor" stroke="none">d</text>
  <text x="385" y="54" fill="currentColor" stroke="none">P</text>
  <text x="385" y="104" fill="currentColor" stroke="none">O</text>
  <text x="385" y="80" fill="currentColor" stroke="none">y</text>
  <line x1="150" y1="190" x2="380" y2="190" stroke-width="1"/>
  <text x="255" y="186" fill="currentColor" stroke="none">D</text>
  <text x="170" y="40" fill="currentColor" stroke="none">path difference S₂P − S₁P ≈ y d / D</text>
  <text x="300" y="160" fill="currentColor" stroke="none">screen</text>
</svg>

<div class="formula">

| Quantity | Formula |
|---|---|
| Path difference at P | Δx = y d/D |
| Bright fringe positions | y_n = n λ D/d |
| Dark fringe positions | y_n = (2n − 1) λ D/(2d) |
| **Fringe width** | **β = λ D/d** (same for bright and dark) |
| Angular fringe width | θ = λ/d |
| Whole apparatus in liquid of index n | β′ = β/n |
| Thin sheet (thickness t, index μ) in front of one slit | fringe shift = (μ − 1) t D/d, towards that slit |

</div>

**Worked numerical 2.** λ = 600 nm, d = 0.5 mm, D = 1 m. Fringe width?
β = 6 × 10⁻⁷ × 1 / 5 × 10⁻⁴ = 1.2 × 10⁻³ m = **1.2 mm**.

**Worked numerical 3.** The same set-up is immersed in water (n = 4/3). New β? — 1.2/(4/3) = **0.9 mm**.

**Worked numerical 4.** Distance of the 3rd bright fringe from the centre in numerical 2? — 3β = **3.6 mm**.

YDSE facts:
- β ∝ λ: red fringes are wider than blue ones. β ∝ D, β ∝ 1/d.
- With **white light** the central fringe is **white**; others are coloured (violet edge nearer the centre), and only a few fringes are seen.
- If one slit is covered, the interference pattern disappears (a single-slit diffraction pattern remains).
- Central fringe in YDSE is **bright** (path difference zero).

## 4. Interference in thin films and Newton's rings

Colours of soap bubbles, oil films on wet roads and peacock feathers come from interference between light reflected from the top and bottom surfaces of a thin film.

<div class="formula">

| Case (film in air, reflected light) | Condition |
|---|---|
| Extra phase change of π on reflection from a denser medium | adds λ/2 path |
| Bright | 2 μ t cos r = (2n − 1) λ/2 |
| Dark | 2 μ t cos r = n λ |
| Anti-reflection coating (minimum thickness) | t = λ/(4μ) |
| Newton's rings — radius of n-th dark ring (reflected light) | r_n² = n λ R |
| Diameter | D_n² = 4 n λ R; λ = (D²_{n+p} − D²_n)/(4pR) |

</div>

- A very thin film (t ≪ λ) looks **dark** in reflected light (only the λ/2 shift acts) — that is why a soap film turns black just before it bursts.
- In **Newton's rings** (plano-convex lens on a glass plate), the **centre is dark** in reflected light; rings get closer as you go outward (r ∝ √n). Placing a liquid between lens and plate makes rings smaller (D² ∝ 1/μ).

**Worked numerical 5.** Anti-reflection coating of MgF₂ (μ = 1.38) for λ = 550 nm. Minimum thickness?
t = 550/(4 × 1.38) = 550/5.52 ≈ **100 nm**.

**Worked numerical 6.** Newton's rings: R = 1 m, λ = 589 nm. Radius of the 10th dark ring?
r² = 10 × 5.89 × 10⁻⁷ × 1 = 5.89 × 10⁻⁶ m² → r ≈ **2.43 mm**.

## 5. Diffraction

**Diffraction** = bending of light around the edges of an obstacle or aperture and spreading into the geometrical shadow. It is noticeable only when the size of the opening is comparable to λ. Sound (λ ~ 1 m) diffracts around doors easily; light (λ ~ 500 nm) needs tiny slits — that is why we hear around a corner but cannot see around it.

| Type | Source and screen | Wavefront |
|---|---|---|
| **Fresnel** | At finite distance | Spherical/cylindrical |
| **Fraunhofer** | Effectively at infinity (lenses used) | Plane |

### Single-slit (Fraunhofer) diffraction

<div class="formula">

| Quantity | Formula |
|---|---|
| Minima (dark) | a sin θ = n λ (n = 1, 2, 3 …) |
| Secondary maxima (approx.) | a sin θ = (2n + 1) λ/2 |
| Position of n-th minimum on screen | y_n = n λ D/a |
| Width of central maximum | 2 λ D/a (twice the other maxima); angular width 2λ/a |
| Intensities of maxima | 1 : 1/22 : 1/62 (approx., i.e. 100 % : 4.5 % : 1.6 %) |

</div>

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="20" y1="170" x2="400" y2="170" stroke-width="1"/>
  <path d="M 30 170 Q 60 162 90 170 Q 120 156 150 170 C 175 170 185 30 210 30 C 235 30 245 170 270 170 Q 300 156 330 170 Q 360 162 390 170"/>
  <line x1="210" y1="30" x2="210" y2="170" stroke-dasharray="2 3" stroke-width="1"/>
  <text x="140" y="188" fill="currentColor" stroke="none">−λD/a</text>
  <text x="255" y="188" fill="currentColor" stroke="none">+λD/a</text>
  <text x="205" y="188" fill="currentColor" stroke="none">0</text>
  <text x="225" y="40" fill="currentColor" stroke="none">central maximum (width 2λD/a)</text>
  <text x="290" y="145" fill="currentColor" stroke="none">weak secondary maxima</text>
  <text x="20" y="20" fill="currentColor" stroke="none">I (not to scale)</text>
</svg>

**Worked numerical 7 (TRE 1.0 type).** λ = 600 nm on a single slit; first minimum 4 mm from the centre on a screen 2 m away. Slit width?
a = λD/y = (6 × 10⁻⁷ × 2)/(4 × 10⁻³) = 3 × 10⁻⁴ m = **0.3 mm**. (Width of the central maximum = 2 × 4 = 8 mm.)

> **PYQ:** TRE 1.0 (2023) asked exactly this: "A light of 600 nm wavelength is incident on a single slit. The first minimum of the diffraction pattern is obtained at a distance of 4 mm from the centre. The distance between the screen and the slit is 2 m. What is the width of the slit? (A) 0.1 mm (B) 0.3 mm (C) 0.5 mm." **Worked answer: (B) 0.3 mm.**

Interference vs diffraction:

| Interference | Diffraction |
|---|---|
| Superposition of waves from two (or more) coherent sources | Superposition of secondary wavelets from different parts of the **same** wavefront |
| Fringes of equal width (YDSE) | Central maximum twice as wide as others |
| All bright fringes nearly equally intense | Intensity of maxima falls rapidly |
| Dark fringes nearly perfectly dark | Minima not perfectly dark |

### Diffraction grating

A grating has many equally spaced slits (N lines per unit length → grating element d = 1/N).

<div class="formula">

| Grating equation | d sin θ = n λ |
|---|---|
| Maximum order | n_max < d/λ |
| Resolving power | R = λ/Δλ = n N_total |

</div>

**Worked numerical 8.** A grating has 5000 lines per cm; λ = 600 nm. Angle of first-order maximum and highest order?
d = 1/5000 cm = 2 × 10⁻⁶ m. sin θ = 6 × 10⁻⁷/2 × 10⁻⁶ = 0.3 → **θ ≈ 17.5°**. d/λ = 3.33 → highest order **3**.

A CD/DVD shows rainbow colours because its closely spaced tracks act as a reflection grating. X-ray diffraction by crystals (Bragg's law 2d sin θ = nλ) uses atomic planes as a grating.

### Resolving power

Two close objects are just resolved when the central maximum of one falls on the first minimum of the other (**Rayleigh criterion**).

<div class="formula">

| Instrument | Limit of resolution | Resolving power |
|---|---|---|
| Telescope (aperture D) | θ = 1.22 λ/D | D/(1.22 λ) — larger aperture is better |
| Microscope | d_min = 1.22 λ/(2 n sin β) | 2 n sin β/(1.22 λ); n sin β = numerical aperture; oil immersion raises n |

</div>

**Worked numerical 9.** Eye pupil 2 mm, λ = 550 nm. Angular limit of resolution?
θ = 1.22 × 5.5 × 10⁻⁷/2 × 10⁻³ ≈ **3.4 × 10⁻⁴ rad** (about 1 minute of arc).

Shorter λ → better resolution: an **electron microscope** (de Broglie λ ~ 0.01 nm) resolves far smaller details than an optical one; blue/UV light resolves better than red.

## 6. Polarisation

Light is a **transverse** wave: the electric field vibrates perpendicular to the direction of travel. In ordinary (**unpolarised**) light, vibrations occur in all directions perpendicular to the ray. If the vibrations are confined to one plane, the light is **plane-polarised (linearly polarised)**.

- Polarisation **proves light is transverse.** Sound in air (longitudinal) can never be polarised.
- **Plane of vibration** contains the electric vector; **plane of polarisation** is perpendicular to it (old convention).

### Ways to produce polarised light

| Method | Device / idea |
|---|---|
| Selective absorption (dichroism) | **Polaroid** sheets (herapathite / stretched PVA with iodine), tourmaline crystal |
| Reflection | At **Brewster's angle**, reflected light is completely plane-polarised |
| Refraction (pile of plates) | Transmitted light becomes partly polarised |
| Double refraction (birefringence) | Calcite (Iceland spar), quartz split light into **ordinary (O) and extraordinary (E)** rays, both polarised in perpendicular planes; **Nicol prism** (made of calcite, uses TIR to remove the O-ray) |
| Scattering | Sky light at 90° to the sun is strongly polarised (bees navigate with it) |

### Malus' law

<div class="formula">

| Malus' law | I = I₀ cos² θ (θ = angle between transmission axes of polariser and analyser) |
|---|---|
| Unpolarised light through one polariser | I = I₀/2 |
| Crossed polaroids (θ = 90°) | I = 0 |

</div>

**Worked numerical 10.** Plane-polarised light of intensity I₀ passes an analyser at 60°. Transmitted intensity? — I₀ cos² 60° = **I₀/4**.

**Worked numerical 11.** Unpolarised light I₀ passes two polaroids at 45°. Final intensity?
After first: I₀/2. After second: (I₀/2) × cos² 45° = (I₀/2)(1/2) = **I₀/4**.

### Brewster's law

When unpolarised light falls on a transparent surface at the **polarising angle θ_B**, the reflected light is completely plane-polarised (vibrations parallel to the surface), and the reflected and refracted rays are **perpendicular** to each other.

<div class="formula">

| Brewster's law | tan θ_B = n (= n₂/n₁) |
|---|---|
| Reflected ⟂ refracted | θ_B + r = 90° |
| Glass n = 1.5 | θ_B ≈ 56.3° |
| Water n = 1.33 | θ_B ≈ 53.1° |
| n = √3 | θ_B = 60° |

</div>

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="40" y1="110" x2="380" y2="110"/>
  <line x1="210" y1="20" x2="210" y2="195" stroke-dasharray="3 3" stroke-width="1"/>
  <line x1="127" y1="55" x2="210" y2="110"/>
  <line x1="210" y1="110" x2="293" y2="55"/>
  <line x1="210" y1="110" x2="265" y2="193"/>
  <text x="80" y="50" fill="currentColor" stroke="none">unpolarised</text>
  <text x="290" y="48" fill="currentColor" stroke="none">reflected: fully polarised</text>
  <text x="272" y="185" fill="currentColor" stroke="none">refracted: partly polarised</text>
  <text x="178" y="80" fill="currentColor" stroke="none">θB</text>
  <text x="218" y="150" fill="currentColor" stroke="none">r</text>
  <text x="300" y="104" fill="currentColor" stroke="none">air</text>
  <text x="300" y="126" fill="currentColor" stroke="none">glass</text>
  <text x="40" y="190" fill="currentColor" stroke="none">tan θB = n; θB + r = 90°</text>
</svg>

**Worked numerical 12.** Brewster angle for glass of n = 1.5? — θ_B = tan⁻¹ 1.5 ≈ **56.3°**; refraction angle = 90° − 56.3° = **33.7°**.

**Worked numerical 13.** The polarising angle for a medium is 60°. Refractive index and critical angle?
n = tan 60° = **1.732**; sin C = 1/1.732 = 0.577 → **C ≈ 35.3°**.

Uses: Polaroid sunglasses cut glare (reflected light from roads/water is horizontally polarised), LCD screens, 3-D movie glasses, photographic filters, stress analysis (photoelasticity), car headlights in some designs.

### Wave plates and elliptical/circular polarisation (B.Sc.)

In a doubly refracting crystal cut with its optic axis parallel to the faces, the O-ray and E-ray travel along the same path but with different speeds (μ_o ≠ μ_e), so a phase difference builds up.

<div class="formula">

| Plate | Thickness | Path difference | Action |
|---|---|---|---|
| **Quarter-wave plate (QWP)** | t = λ/[4(μ_o − μ_e)] (magnitude) | λ/4 (phase π/2) | Plane-polarised light at **45°** to the optic axis → **circularly** polarised; at any other angle (except 0°, 90°) → elliptically polarised |
| **Half-wave plate (HWP)** | t = λ/[2(μ_o − μ_e)] | λ/2 (phase π) | Rotates the plane of polarisation by 2θ; reverses the sense of circular light |

</div>

**Worked numerical 14.** Quarter-wave plate of calcite for λ = 589 nm (μ_o = 1.658, μ_e = 1.486).
t = 589/(4 × 0.172) = 589/0.688 ≈ **856 nm ≈ 0.86 µm**.

> **PYQ:** TRE 1.0 (2023) asked: "At what angle of incidence of plane-polarised light with a quarter-wave plate does elliptically polarised light become circularly polarised? (A) 90° (B) 45° (C) 60°." **Worked answer: (B) 45°** — the vibration must make 45° with the optic axis so that the O and E components have equal amplitudes; a λ/4 shift between equal components gives a circle.

Analysing light with a QWP + analyser: unpolarised light shows no intensity change on rotating an analyser; plane-polarised light gives zero twice per rotation; circular light shows no change through an analyser alone, but becomes plane-polarised after a QWP.

### Optical activity

Some substances rotate the plane of polarised light: **quartz, sugar (sucrose) solution, tartaric acid, turpentine**. Clockwise (seen facing the light) = **dextro-rotatory (+, d)**; anticlockwise = **laevo-rotatory (−, l)**. Measured with a **polarimeter** (saccharimeter for sugar).

<div class="formula">

| Specific rotation | [α] = θ/(l × c) |
|---|---|
| θ | rotation in degrees; l in decimetres; c in g/cm³ |

</div>

**Worked numerical 15.** A 2 dm tube of sugar solution (0.05 g/cm³) rotates the plane by 13°. Specific rotation?
[α] = 13/(2 × 0.05) = **130° dm⁻¹ (g/cm³)⁻¹**. (Sucrose's standard value is about +66.5°, so this is an imaginary sample.)

Optical activity arises from molecular asymmetry (chirality) — linked to optical isomerism in chemistry ([Organic basics and isomerism](/interview/bpsc-tre4-science/chemistry/organic-basics-iupac-isomerism-and-mechanisms)).

## 7. Doppler effect for light and group velocity

- For a source moving with speed v (≪ c): Δλ/λ = v/c. Receding → **red shift** (λ increases), approaching → **blue shift**. Hubble used red shift to show the universe is expanding.
- In a dispersive medium like glass, a light pulse travels at the **group velocity** v_g < v_p = c/n. For a matter wave or waveguide, v_p v_g = c². Details and the TRE 1.0 numerical (v_g = 2 × 10⁸ → v_p = 4.5 × 10⁸ m/s) are in [Oscillations, waves and sound](/interview/bpsc-tre4-science/physics/oscillations-waves-and-sound).

**Worked numerical 16.** A galaxy's 600 nm line is observed at 606 nm. Speed of recession?
v = c Δλ/λ = 3 × 10⁸ × 6/600 = **3 × 10⁶ m/s** (moving away).

## 8. Light as wave and particle

Interference, diffraction and polarisation prove the **wave** nature; the photoelectric effect and Compton effect prove the **particle (photon)** nature. Light shows **wave–particle duality** — see [Modern physics: atoms and nuclei](/interview/bpsc-tre4-science/physics/modern-physics-atoms-and-nuclei).

## Traps and exceptions

- Two **independent** sources (two bulbs, two lasers of the same colour) are **not** coherent; no sustained pattern.
- With two identical slits, maximum intensity is **4I₀**, not 2I₀; average intensity stays 2I₀ (energy conserved).
- Fringe width **decreases** in water (β/n), and increases with λ and D.
- Central fringe in YDSE is **bright**; centre of Newton's rings (reflected) is **dark**.
- Single slit: a sin θ = nλ gives **minima** (in YDSE, d sin θ = nλ gives maxima) — a classic swap.
- Central diffraction maximum is **twice** as wide as the others.
- Polarisation shows light is **transverse**; interference and diffraction alone do not prove this (sound also interferes and diffracts).
- Unpolarised light through one polaroid → **I₀/2**, not I₀ cos²θ.
- Brewster: **tan** θ_B = n (not sin θ_B = 1/n, which is the critical angle).
- At Brewster's angle, reflected and refracted rays are at **90°** to each other.
- QWP gives circular light only when the incident vibration is at **45°** to the optic axis.
- Larger aperture → **better** (smaller) limit of resolution of a telescope.

## Quick revision

1. Wavefront: locus of points in the same phase; rays ⟂ wavefronts.
2. Huygens' principle → light slower in denser medium.
3. Coherent sources: constant phase difference; derived from one source.
4. φ = (2π/λ)Δx.
5. I = I₁ + I₂ + 2√(I₁I₂) cos φ; identical slits I_max = 4I₀.
6. YDSE fringe width β = λD/d; in medium β/n.
7. White light YDSE: central fringe white.
8. Thin film colours = interference; anti-reflection t = λ/4μ.
9. Newton's rings: r_n² = nλR; centre dark (reflected).
10. Single slit minima: a sin θ = nλ; central max width 2λD/a.
11. Grating: d sin θ = nλ.
12. Rayleigh limit: θ = 1.22λ/D.
13. Polarisation proves light is transverse.
14. Malus: I = I₀ cos²θ; unpolarised through polaroid → I₀/2.
15. Brewster: tan θ_B = n; glass ≈ 56.3°; reflected ⟂ refracted.
16. Calcite: double refraction (O and E rays); Nicol prism.
17. QWP: λ/4 path, 45° → circular; HWP rotates plane by 2θ.
18. Optical activity: sugar, quartz; polarimeter; [α] = θ/(lc).
19. Red shift: Δλ/λ = v/c → receding galaxy.
20. Young 1801 (interference); Malus 1808; Brewster 1815.

## Practice with answers

1. Shape of the wavefront from a distant star? — **Plane**.
2. Who first demonstrated interference of light? — **Thomas Young (1801)**.
3. Phase difference for a path difference of λ/2? — **π radians**.
4. Two sources with amplitudes in ratio 2 : 1; I_max : I_min? — **9 : 1** ((2+1)² : (2−1)²).
5. In YDSE, d is halved; fringe width? — **Doubles** (β ∝ 1/d).
6. YDSE with λ = 500 nm, D = 1 m, d = 1 mm; β? — **0.5 mm**.
7. Colours in a soap bubble are due to? — **Interference in thin films**.
8. Is the centre of Newton's rings bright or dark in reflected light? — **Dark**.
9. Condition for the first minimum in single-slit diffraction? — **a sin θ = λ**.
10. Width of central maximum compared with secondary maxima? — **Twice**.
11. Why can we hear but not see around corners? — **Sound's wavelength is comparable to obstacles; light's is tiny**.
12. Which phenomenon proves light is transverse? — **Polarisation**.
13. Intensity after crossed polaroids? — **Zero**.
14. Brewster angle for a medium with n = √3? — **60°**.
15. Angle between reflected and refracted rays at the polarising angle? — **90°**.
16. Crystal used in a Nicol prism? — **Calcite (Iceland spar)**.
17. Path difference introduced by a quarter-wave plate? — **λ/4**.
18. Instrument to measure the rotation by sugar solution? — **Polarimeter (saccharimeter)**.
19. How does a telescope's resolving power change if its aperture is doubled? — **Doubles**.
20. A galaxy's spectral lines shift to longer wavelengths; it is? — **Moving away (red shift)**.

Previous: [Ray optics and optical instruments](/interview/bpsc-tre4-science/physics/ray-optics-and-optical-instruments) · Next: [Electrostatics and current electricity](/interview/bpsc-tre4-science/physics/electrostatics-and-current-electricity) · Bank: [Physics question bank](/interview/bpsc-tre4-science/physics/physics-question-bank-and-revision).
