---
title: Ray Optics and Optical Instruments
part: Optics
summary: Reflection and mirrors, refraction, total internal reflection and optical fibres, prisms, dispersion and scattering, lenses and power, the human eye and its defects, and microscopes and telescopes — with ray diagrams and sign-convention numericals.
---

This chapter runs from class 7–10 light (mirrors, lenses, eye, scattering) to class 12 ray optics (TIR, prism, lens-maker's formula, instruments).
TRE 2.0 asked five quick questions from here (retina, dioptre, optical fibre, Crookes glass, scattering), so the factual tables matter as much as the formulas.

> **In simple words:** In ray optics we treat light as straight lines (rays). Light bounces off surfaces (reflection), bends when it changes medium (refraction), splits into colours in a prism (dispersion), and is scattered by tiny particles (that is why the sky is blue). Lenses and mirrors use these rules to form images.

GS-level revision: [Heat, light and sound (BPSC CCE shelf)](/interview/bpsc-2027/science/heat-light-and-sound).

## 1. Nature of light — quick facts

| Fact | Value / note |
|---|---|
| Speed in vacuum | c = 3 × 10⁸ m/s (exactly 299 792 458 m/s) |
| Visible range | about 400 nm (violet) to 700 nm (red) (some books 380–780 nm) |
| VIBGYOR | Violet has the shortest λ and highest frequency; red the longest λ |
| Light from sun to earth | ≈ 8 min 20 s |
| Light is | Electromagnetic, transverse; shows wave nature (interference, diffraction, polarisation) and particle nature (photoelectric effect) |
| Rectilinear propagation | Light travels in straight lines → shadows, eclipses, pin-hole camera (inverted image) |

## 2. Reflection and plane mirrors

**Laws of reflection:** (1) angle of incidence = angle of reflection; (2) incident ray, reflected ray and normal lie in one plane.

Plane mirror image: virtual, erect, same size, as far behind the mirror as the object is in front, **laterally inverted** (that is why AMBULANCE is written in mirror letters).

| Plane-mirror fact | Rule |
|---|---|
| Mirror rotated by θ | Reflected ray turns by **2θ** |
| Two mirrors at angle θ | Number of images n = 360/θ − 1 (if 360/θ is even); 60° → 5; 90° → 3; parallel mirrors → infinite |
| Minimum length for full image | **Half** the height of the person |
| Person walks towards mirror at v | Image approaches the person at 2v |

## 3. Spherical mirrors

- **Concave** (converging): used in shaving/make-up mirrors, dentist's mirror, reflecting telescopes, headlights and torches (bulb at focus gives a parallel beam), solar furnaces.
- **Convex** (diverging): always virtual, erect, diminished image with a **wider field of view** → rear-view mirrors of vehicles, street-light reflectors, shop security mirrors.
- Pole P, centre of curvature C, radius R, principal focus F: **f = R/2**.

**New Cartesian sign convention:** measure all distances from the pole (or optical centre); distances in the direction of incident light (usually to the right) are positive, against it negative; heights up positive, down negative. So for a mirror u is always negative; f is negative for concave, positive for convex.

<div class="formula">

| Quantity | Mirror | Lens |
|---|---|---|
| Formula | 1/v + 1/u = 1/f | 1/v − 1/u = 1/f |
| Magnification | m = h′/h = −v/u | m = h′/h = v/u |
| m negative | Real and inverted | Real and inverted |
| m positive | Virtual and erect | Virtual and erect |
| Focal length sign | Concave −, convex + | Convex +, concave − |

</div>

### Image formation by a concave mirror

| Object position | Image position | Nature and size |
|---|---|---|
| At infinity | At F | Real, inverted, point-sized |
| Beyond C | Between F and C | Real, inverted, diminished |
| At C | At C | Real, inverted, same size |
| Between C and F | Beyond C | Real, inverted, magnified |
| At F | At infinity | Real, inverted, highly magnified |
| Between F and P | Behind the mirror | **Virtual, erect, magnified** (shaving mirror) |

A **convex lens** gives the same table with 2F in place of C (object between F and O → virtual, erect, magnified: magnifying glass).

**Worked numerical 1.** An object is 30 cm in front of a concave mirror of focal length 20 cm. Find the image.
u = −30, f = −20: 1/v = 1/f − 1/u = −1/20 + 1/30 = −1/60 → **v = −60 cm** (in front, real).
m = −v/u = −(−60)/(−30) = **−2**: real, inverted, twice the size.

**Worked numerical 2.** Object 30 cm in front of a convex mirror of f = 15 cm.
1/v = 1/15 + 1/30 = 3/30 → **v = +10 cm** (behind, virtual). m = −10/(−30) = **+1/3**: erect, diminished.

## 4. Refraction

Bending of light when it passes obliquely from one medium to another, because its **speed changes**. Frequency stays the same; wavelength and speed change.

<div class="formula">

| Law / quantity | Formula |
|---|---|
| Snell's law | n₁ sin i = n₂ sin r; ₁n₂ = sin i/sin r |
| Absolute refractive index | n = c/v (no unit, ≥ 1) |
| Relative index | ₁n₂ = n₂/n₁ = v₁/v₂ |
| Wavelength in medium | λ_medium = λ_vacuum/n |
| Apparent depth | apparent depth = real depth/n (viewed normally) |
| Normal shift by glass slab | shift = t(1 − 1/n) |

</div>

| Medium | Refractive index (approx.) |
|---|---|
| Air | 1.0003 |
| Water | 1.33 (4/3) |
| Kerosene | 1.44 |
| Crown glass | 1.52 |
| Dense flint glass | 1.65 |
| Ruby | 1.71 |
| Diamond | **2.42** (highest common value) |

- Going from rarer to denser, light bends **towards** the normal; denser to rarer, **away** from the normal.
- Refractive index is greatest for **violet** and least for **red** (normal dispersion) — so red travels fastest in glass.
- Refractive index is an **intensive** property (does not depend on the size of the sample) — a TRE 2.0 question; see [Heat and thermodynamics](/interview/bpsc-tre/class-9-10-science/physics/heat-thermodynamics-and-kinetic-theory).
- Optical density ≠ mass density: kerosene is optically denser than water but less dense by mass.

**Worked numerical 3.** Light enters glass at i = 60° and refracts at r = 30°. Refractive index?
n = sin 60°/sin 30° = 0.866/0.5 = **1.73 (√3)**.

**Worked numerical 4.** Speed of light in glass of n = 1.5? — v = c/n = 3 × 10⁸/1.5 = **2 × 10⁸ m/s**.

**Worked numerical 5.** A tank has 12 cm of water (n = 4/3). Apparent depth? — 12/(4/3) = **9 cm**; the bottom appears raised by 3 cm.

Everyday refraction: a pencil in water looks bent; a pool looks shallower; **twinkling of stars** (changing atmospheric refraction; planets do not twinkle as they are extended sources); **advanced sunrise and delayed sunset by about 2 minutes** each; flattened sun at the horizon; **mirage** in deserts and on hot roads (refraction + total internal reflection in layers of hot, rarer air near the ground); looming in cold regions.

## 5. Total internal reflection (TIR) and optical fibres

When light goes from a **denser to a rarer** medium and the angle of incidence exceeds the **critical angle C**, no light is refracted — all is reflected back. That is TIR.

<div class="formula">

| Critical angle | sin C = 1/n (denser medium relative to air) |
|---|---|
| Conditions | (1) denser → rarer; (2) i > C |
| Water (n = 4/3) | C ≈ 48.6° |
| Glass (n = 1.5) | C ≈ 41.8° |
| Diamond (n = 2.42) | C ≈ 24.4° |

</div>

**Worked numerical 6.** Critical angle for glass of n = 1.5? — sin C = 1/1.5 = 0.667 → **C ≈ 41.8°**.

Examples of TIR: sparkling of **diamond** (small C, cut so light reflects many times inside), **mirage**, totally reflecting prisms (in periscopes and binoculars, better than mirrors), shining of an air bubble or a crack in glass, and **optical fibres**.

### Optical fibre

A thin glass/plastic fibre with a **core** of higher refractive index surrounded by **cladding** of lower refractive index. Light entering one end strikes the core–cladding boundary at angles larger than C and keeps reflecting totally, travelling along bends with very little loss.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="20" y1="60" x2="400" y2="60"/>
  <line x1="20" y1="140" x2="400" y2="140"/>
  <line x1="20" y1="80" x2="400" y2="80" stroke-dasharray="4 3"/>
  <line x1="20" y1="120" x2="400" y2="120" stroke-dasharray="4 3"/>
  <path d="M 20 110 L 80 80 L 160 120 L 240 80 L 320 120 L 400 80" stroke-width="2"/>
  <text x="300" y="75" fill="currentColor" stroke="none">cladding (lower n)</text>
  <text x="300" y="155" fill="currentColor" stroke="none">cladding (lower n)</text>
  <text x="170" y="103" fill="currentColor" stroke="none">core (higher n)</text>
  <text x="20" y="40" fill="currentColor" stroke="none">At every hit, angle of incidence &gt; critical angle → TIR</text>
  <text x="20" y="185" fill="currentColor" stroke="none">Uses: internet/telephone cables, endoscopy, decorative lamps</text>
</svg>

> **PYQ:** TRE 2.0 (2023) asked: "The phenomenon used in optical fibre for transmission of light energy is — (A) total internal reflection (B) diffraction (C) refraction." **Official answer: (A).** Optical fibres were pioneered by Narinder Singh Kapany ("father of fibre optics", Indian-born); Charles Kao got the 2009 Nobel Prize for low-loss fibres.

## 6. Prism and dispersion

A prism is a transparent body with two inclined refracting faces; the angle between them is the **angle of prism A**.

<div class="formula">

| Relation | Formula |
|---|---|
| Angles | r₁ + r₂ = A; deviation δ = i + e − A |
| Minimum deviation | at δ_m, i = e and r₁ = r₂ = A/2 |
| Prism formula | n = sin[(A + δ_m)/2] / sin(A/2) |
| Thin prism | δ = (n − 1) A |
| Angular dispersion | δ_v − δ_r = (n_v − n_r) A |
| Dispersive power | ω = (n_v − n_r)/(n_y − 1) |

</div>

**Worked numerical 7.** A 60° prism gives minimum deviation 30°. Refractive index?
n = sin 45°/sin 30° = 0.707/0.5 = **1.414 (√2)**.

**Worked numerical 8.** Thin prism, A = 5°, n = 1.5. Deviation? — δ = (1.5 − 1) × 5° = **2.5°**.

**Dispersion:** splitting of white light into its colours, because n (and so the deviation) is different for different colours. **Violet deviates most, red least.** Newton (1666) showed with two prisms that white light is a mixture and a second inverted prism recombines it.

**Rainbow:** formed by dispersion + refraction + **internal reflection** inside raindrops; seen with the **sun behind** the observer; primary bow (one internal reflection) has **red on the outside** at ~42°, violet inside at ~40°; the fainter secondary bow (two internal reflections, ~51°) has the colours reversed.

**Colours of objects:** an object's colour is the light it reflects. Primary colours of light: red, green, blue (mix → white). A red rose under green light looks black. Complementary pairs: red–cyan, green–magenta, blue–yellow.

## 7. Scattering of light

When light hits very small particles (molecules, dust, water droplets), it is sent off in many directions — **scattering** (diffusion of light).

<div class="formula">

| Rayleigh's law (particles much smaller than λ) | Intensity of scattered light ∝ 1/λ⁴ |
|---|---|

</div>

| Observation | Reason |
|---|---|
| Sky is **blue** | Air molecules scatter blue (short λ) much more than red |
| Sun looks **red at sunrise/sunset** | Light travels a long path through air; blue is scattered away, red reaches us |
| Danger signals are **red** | Red is scattered least → seen from farthest, through fog/smoke |
| Sky looks **black** to astronauts / from the moon | No atmosphere, no scattering |
| **Clouds are white** | Water droplets are large compared to λ → scatter all colours equally |
| **Tyndall effect** | Path of a light beam visible in colloids, dusty room, forest canopy, smoke |
| Deep-sea water looks blue | Scattering + absorption of red by water |
| Raman effect (C.V. Raman, 1928; Nobel 1930) | Scattered light contains new wavelengths shifted by molecular energy levels; 28 February = National Science Day |

**Worked numerical 9.** How much more is blue light (450 nm) scattered than red (700 nm)?
(700/450)⁴ = (1.556)⁴ ≈ **5.9 times**.

> **PYQ:** TRE 2.0 (2023) asked: "The diffusion of light in the atmosphere takes place due to — (A) carbon dioxide (B) dust particles (C) water vapour." **Official answer: (B) dust particles.** (Strictly, air molecules also scatter light — that is Rayleigh scattering — but among the given options the textbook answer is dust particles.)

## 8. Lenses

Convex (converging) lens: thicker at the centre. Concave (diverging) lens: thinner at the centre. Optical centre O, principal focus F, focal length f.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="10" y1="100" x2="410" y2="100" stroke-width="1"/>
  <path d="M 210 20 Q 228 100 210 180 Q 192 100 210 20 Z"/>
  <line x1="120" y1="100" x2="120" y2="60" stroke-width="2.5"/>
  <line x1="390" y1="100" x2="390" y2="180" stroke-width="2.5" stroke-dasharray="4 2"/>
  <path d="M 120 60 L 210 60 L 390 180"/>
  <path d="M 120 60 L 390 180"/>
  <circle cx="150" cy="100" r="2.5"/>
  <circle cx="270" cy="100" r="2.5"/>
  <circle cx="330" cy="100" r="2.5"/>
  <text x="145" y="116" fill="currentColor" stroke="none">F</text>
  <text x="265" y="116" fill="currentColor" stroke="none">F</text>
  <text x="323" y="116" fill="currentColor" stroke="none">2F</text>
  <text x="95" y="56" fill="currentColor" stroke="none">object</text>
  <text x="340" y="194" fill="currentColor" stroke="none">real, inverted image</text>
  <text x="10" y="20" fill="currentColor" stroke="none">Object between F and 2F → image beyond 2F, magnified</text>
  <text x="10" y="194" fill="currentColor" stroke="none">u = −90, f = +60 → v = +180, m = −2</text>
</svg>

Two rays drawn: a ray parallel to the axis refracts through the far focus F; a ray through the optical centre goes straight. They meet at the image.

<div class="formula">

| Quantity | Formula |
|---|---|
| Lens formula | 1/v − 1/u = 1/f |
| Magnification | m = v/u |
| Power | P = 1/f (f in metres); unit **dioptre (D)** = m⁻¹ |
| Convex lens | P positive; concave lens: P negative |
| Lenses in contact | P = P₁ + P₂ + …; 1/F = 1/f₁ + 1/f₂ |
| Lens-maker's formula | 1/f = (n − 1)(1/R₁ − 1/R₂) |
| Lens in a medium | 1/f = (n_lens/n_medium − 1)(1/R₁ − 1/R₂) |

</div>

**Worked numerical 10.** Object 15 cm from a convex lens of f = 10 cm.
1/v = 1/f + 1/u = 1/10 − 1/15 = 1/30 → **v = +30 cm**; m = v/u = 30/(−15) = **−2** (real, inverted, magnified).

**Worked numerical 11.** Power of a lens of f = 25 cm? — P = 1/0.25 = **+4 D**. A concave lens of f = 50 cm → **−2 D**.

**Worked numerical 12.** Lenses of +4 D and −2 D in contact. Net power and focal length?
P = +2 D → f = 1/2 m = **50 cm (converging)**.

**Worked numerical 13.** Biconvex lens, R₁ = +20 cm, R₂ = −20 cm, n = 1.5. Focal length?
1/f = 0.5 × (1/20 + 1/20) = 0.5 × 0.1 = 0.05 → **f = 20 cm**.

> **PYQ:** TRE 2.0 (2023) asked: "The power of a lens is measured in — (A) dioptre (B) aeon (C) candela." **Official answer: (A) dioptre.** (Candela is the SI unit of luminous intensity; aeon is a span of geological time.)

Facts: a convex lens dipped in a liquid of the same refractive index behaves like a plane glass (f → ∞); an air bubble in water acts as a **diverging** lens; opticians prescribe lenses in dioptres, e.g. "−1.5 D" = concave lens for myopia.

## 9. The human eye

| Part | Function |
|---|---|
| **Cornea** | Transparent front; does **most of the refraction** |
| Iris | Coloured diaphragm; controls pupil size |
| Pupil | Opening that lets light in (dilates in dim light) |
| Crystalline lens | Convex lens of variable focal length; fine focusing |
| Ciliary muscles | Change lens curvature (**accommodation**) |
| Aqueous / vitreous humour | Fluids that maintain shape and pressure |
| **Retina** | Light-sensitive screen where the **real, inverted image** forms; rods (dim light, black-and-white, contain rhodopsin) and cones (colour, bright light) |
| Yellow spot (fovea) | Sharpest vision, most cones |
| Blind spot | Where the optic nerve leaves; no rods/cones |
| Optic nerve | Carries signals to the brain, which makes the image erect |

> **PYQ:** TRE 2.0 (2023) asked: "The human eye forms the image of an object on its — (A) cornea (B) retina (C) pupil." **Official answer: (B) retina.**

- **Near point** of a normal eye = **25 cm** (least distance of distinct vision D); **far point = infinity**.
- **Persistence of vision** ≈ 1/16 s (0.0625 s) → movies at 24 frames/s look continuous.
- Range of vision normal eye: 25 cm to infinity. The eye's power of accommodation ≈ 4 D in a young adult.

### Defects of vision

| Defect | Can see clearly | Cause | Correction |
|---|---|---|---|
| **Myopia** (short-sightedness) | Near objects; far ones blurred | Eyeball too long / lens too converging; image forms **in front of** retina | **Concave lens** |
| **Hypermetropia** (long-sightedness) | Far objects; near ones blurred | Eyeball too short / lens too weak; image **behind** retina | **Convex lens** |
| **Presbyopia** | — (near point recedes with age) | Weak ciliary muscles, less flexible lens | **Bifocal** (concave upper, convex lower) or progressive lenses |
| **Astigmatism** | Lines in one direction blurred | Cornea has unequal curvature | **Cylindrical lens** |
| **Cataract** | Cloudy vision | Lens becomes opaque | Surgery (artificial intraocular lens) |
| Colour blindness | Cannot tell some colours (red–green) | Defective cones; X-linked genetic | No cure |
| Night blindness | Poor vision in dim light | Vitamin A deficiency (rhodopsin) | Vitamin A |

**Worked numerical 14 (myopia).** Far point of a person is 2 m. Lens needed?
The lens must make an object at infinity appear at 2 m: f = −2 m → **P = −0.5 D (concave)**.

**Worked numerical 15 (hypermetropia).** Near point is 50 cm; he wants to read at 25 cm.
u = −25 cm, v = −50 cm: 1/f = 1/v − 1/u = −1/50 + 1/25 = 1/50 → f = +50 cm → **P = +2 D (convex)**.

## 10. Optical instruments

<div class="formula">

| Instrument | Magnifying power | Note |
|---|---|---|
| Simple microscope (magnifier) | m = 1 + D/f (image at D = 25 cm); m = D/f (image at infinity) | Short f → more m |
| Compound microscope | m ≈ (L/f_o)(D/f_e) ≈ m_o × m_e | Objective: short f, small aperture; eyepiece: a bit larger f |
| Astronomical telescope (normal adjustment) | m = f_o/f_e; tube length L = f_o + f_e | Objective: **large f and large aperture** |
| Galilean telescope | m = f_o/f_e; L = f_o − f_e | Concave eyepiece, erect image (opera glass) |
| Reflecting telescope | Concave mirror objective | No chromatic aberration, easier large aperture (Hubble, JWST use mirrors) |

</div>

**Worked numerical 16.** A magnifier of f = 5 cm, image at 25 cm. m? — 1 + 25/5 = **6**.

**Worked numerical 17.** Telescope: f_o = 100 cm, f_e = 5 cm, normal adjustment. m and length?
m = 100/5 = **20**; L = 100 + 5 = **105 cm**.

Other instruments: **periscope** (two mirrors or two totally reflecting prisms at 45°), **kaleidoscope** (multiple reflection in inclined mirrors), **binoculars** (prisms to erect and shorten), camera (convex lens, real inverted image on sensor; aperture like the iris, focusing like accommodation), **projector**, **spectrometer**.

Aberrations: **chromatic** aberration (different colours focus at different points) is removed by an **achromatic doublet** (convex crown + concave flint glass in contact, ω₁/f₁ + ω₂/f₂ = 0); **spherical** aberration reduced by stops/parabolic mirrors.

## 11. Special glasses (fact table)

| Glass | Property / use |
|---|---|
| **Crookes glass** | Contains cerium (and other rare-earth) oxides; **absorbs ultraviolet** → sunglasses, welder's/sun goggles |
| Pyrex / borosilicate | Low expansion, heat-resistant → lab ware, ovenware |
| Jena glass | A borosilicate glass, very resistant to heat and chemicals → laboratory apparatus |
| Flint glass | Contains lead oxide, high refractive index → lenses, prisms, cut-glass |
| Crown glass | Soda-lime-potash, low dispersion → spectacle lenses |
| Soda-lime glass | Ordinary window panes, bottles |
| Photochromic glass | Contains silver halide; darkens in sunlight |
| Coloured glass | Cobalt oxide → blue; chromium oxide → green; gold/cuprous oxide → ruby red; manganese dioxide → violet |
| Quartz glass | Transmits UV; used in UV lamps |

> **PYQ:** TRE 2.0 (2023) asked: "Which of the following types of glass can cut off ultraviolet rays? (A) Crookes glass (B) Jena glass (C) Pyrex glass." **Official answer: (A) Crookes glass.**

## Traps and exceptions

- The image in the eye is formed on the **retina**, not on the cornea, lens or pupil; but most **bending** happens at the cornea.
- Myopia → concave (negative power); hypermetropia → convex (positive power). Do not swap.
- Power in dioptre needs f in **metres**: f = 20 cm → P = 5 D, not 0.05 D.
- TIR needs light going **from denser to rarer**; it never happens when light enters glass from air.
- In an optical fibre, the **core** has the **higher** refractive index.
- Red is scattered **least**, violet/blue **most**; the sky is blue (not violet) because sunlight has less violet and our eyes are less sensitive to it.
- Clouds are white because of scattering by **large** droplets (non-selective), not Rayleigh scattering.
- Convex mirror: **always** virtual, erect, diminished image; concave lens likewise.
- Sign convention: for a real image by a mirror v is negative; for a real image by a lens v is positive.
- Plane mirror: mirror rotated θ → reflected ray rotated **2θ**.
- Frequency of light does **not** change on refraction; speed and wavelength do.
- A planet does not twinkle; a star does.
- Crookes glass cuts UV; Pyrex/Jena are heat-resistant borosilicate glasses — the classic distractors.

## Quick revision

1. c = 3 × 10⁸ m/s; visible ≈ 400–700 nm.
2. Angle of incidence = angle of reflection.
3. f = R/2; mirror: 1/v + 1/u = 1/f; lens: 1/v − 1/u = 1/f.
4. Convex mirror in vehicles — wide field of view.
5. n = c/v = sin i/sin r; diamond n ≈ 2.42.
6. Apparent depth = real depth/n.
7. sin C = 1/n; glass 41.8°, water 48.6°, diamond 24.4°.
8. Optical fibre works on TIR; core n > cladding n.
9. Prism: n = sin[(A + δ_m)/2]/sin(A/2); thin prism δ = (n − 1)A.
10. Violet deviates most; red least.
11. Rayleigh: scattering ∝ 1/λ⁴ → blue sky, red sunset.
12. Rainbow: dispersion + refraction + internal reflection; red outside (primary).
13. Power P = 1/f (m), unit dioptre; P = P₁ + P₂ in contact.
14. Lens-maker: 1/f = (n − 1)(1/R₁ − 1/R₂).
15. Image forms on the retina; near point 25 cm.
16. Myopia — concave; hypermetropia — convex; presbyopia — bifocal; astigmatism — cylindrical.
17. Simple microscope m = 1 + D/f; telescope m = f_o/f_e.
18. Crookes glass absorbs UV.
19. Raman effect 1928; National Science Day 28 February.
20. Persistence of vision ≈ 1/16 s.

## Practice with answers

1. Which mirror is used as a rear-view mirror? — **Convex** (erect, diminished, wide view).
2. Which mirror is used by dentists? — **Concave** (magnified, erect image when close).
3. Focal length of a concave mirror of radius 40 cm? — **20 cm** (f = R/2).
4. Number of images between two mirrors at 45°? — **7** (360/45 − 1).
5. Refractive index of a medium where light travels at 2.25 × 10⁸ m/s? — **4/3** (3/2.25).
6. Why does a diamond sparkle? — **Total internal reflection** (small critical angle 24.4°).
7. Which colour has the highest refractive index in glass? — **Violet**.
8. Why does the sky look blue? — **Rayleigh scattering of short wavelengths by air molecules**.
9. Power of a convex lens of focal length 50 cm? — **+2 D**.
10. Lenses of +5 D and −3 D in contact; focal length? — **50 cm** (P = +2 D).
11. Where is the image formed in a myopic eye? — **In front of the retina**.
12. Lens used to correct astigmatism? — **Cylindrical lens**.
13. Least distance of distinct vision for a normal eye? — **25 cm**.
14. Which part of the eye controls the size of the pupil? — **Iris**.
15. Telescope with f_o = 150 cm, f_e = 5 cm: magnifying power? — **30**.
16. An air bubble in water behaves like which lens? — **Concave (diverging)**.
17. Glass used in welders' goggles to block UV? — **Crookes glass**.
18. Why are danger signals red? — **Red is scattered least, so it is visible from far**.
19. Phenomenon behind the mirage? — **Refraction and total internal reflection in hot air layers**.
20. Who discovered the Raman effect? — **C. V. Raman (1928)**.

Previous: [Oscillations, waves and sound](/interview/bpsc-tre/class-9-10-science/physics/oscillations-waves-and-sound) · Next: [Wave optics](/interview/bpsc-tre/class-9-10-science/physics/wave-optics).
