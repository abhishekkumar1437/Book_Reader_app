---
title: Magnetism, EMI and AC
part: Magnetism and AC
summary: Magnetic effect of current (Biot-Savart, Ampère, solenoid), forces and cyclotron, magnetic materials and domains, Faraday and Lenz, inductance, AC circuits with LCR resonance and Q-factor, transformers, Maxwell's equations and EM waves — class 10 to B.Sc., with the units TRE loves.
---

This chapter joins NCERT class 10 "Magnetic Effects of Electric Current" with class 12 chapters 4–8 (moving charges, magnetism and matter, EMI, AC, EM waves) and the B.Sc. points that TRE 1.0 asked (Biot-Savart statements, Q-factor of parallel resonance, Maxwell's equations, flux through a loop). TRE 2.0 asked mostly **units and laws**: unit of magnetic dipole moment, unit of inductance, Lenz's law, domains, speed of EM waves.

> **In simple words:** A moving charge (current) makes a magnetic field. A changing magnetic field makes a current (electromagnetic induction). Put these two facts together and you get transformers, generators, motors, radio — and light itself, which is a travelling wave of electric and magnetic fields.

## 1. Magnetic field and its sources

- **Oersted (1820)** saw a compass needle deflect near a current-carrying wire: current produces a magnetic field.
- Magnetic field **B** (magnetic flux density) unit: **tesla (T) = N/(A·m) = Wb/m²**. 1 T = 10⁴ gauss. Earth's field ≈ 0.3–0.6 gauss (3–6 × 10⁻⁵ T).
- **μ₀ = 4π × 10⁻⁷ T·m/A** (H/m) — permeability of free space.
- Magnetic field lines form **closed loops** (outside a magnet N → S, inside S → N), never cross, and there is **no magnetic monopole** — the net flux through any closed surface is zero.

### Biot–Savart law

The field dB at distance r from a small current element I dl:

<div class="formula">

| Law / case | Formula |
|---|---|
| Biot–Savart law | dB = (μ₀/4π) · I dl sin θ / r² |
| Long straight wire | B = μ₀I / (2πr) |
| Centre of circular loop (N turns, radius R) | B = μ₀NI / (2R) |
| Axis of loop at distance x | B = μ₀NIR² / [2(R² + x²)^(3/2)] |
| Long solenoid (n turns per metre) | B = μ₀nI inside (uniform); ≈ 0 outside |
| End of long solenoid | B = μ₀nI / 2 |
| Toroid (N turns, radius r) | B = μ₀NI / (2πr) inside the core |

</div>

So dB is **directly proportional** to current I, to the length of the element dl and to sin θ, and **inversely proportional to r²** (like Coulomb's law). It deals with the **magnetic** field of a current, not the electric field.

> **PYQ:** TRE 1.0 (2023) gave three statements about the Biot–Savart law: (i) magnetic field is directly proportional to the length of element; (ii) the law deals with electric field; (iii) magnetic field is directly proportional to the current. Worked answer: **(C) (i) and (iii)** — statement (ii) is false. (No official key for TRE 1.0 in our files.)

**Ampère's circuital law:** ∮B·dl = μ₀ I_enclosed. It is to magnetism what Gauss's law is to electrostatics — easy for symmetric cases (straight wire, solenoid, toroid).

**Direction rules:**

| Rule | Gives |
|---|---|
| Right-hand thumb rule (Maxwell's corkscrew) | Thumb = current, curled fingers = field around a wire |
| Right-hand grip for coil | Fingers along current, thumb = N pole of the coil |
| Fleming's left-hand rule (motor) | Forefinger field, middle finger current, thumb force/motion |
| Fleming's right-hand rule (generator) | Forefinger field, thumb motion, middle finger induced current |

> **Memory trick:** Left hand = Motor, Right hand = Generator — think "gene-RIGHT-or".

**Worked numerical 1.** Field 5 cm from a long wire carrying 10 A: B = μ₀I/(2πr) = 2 × 10⁻⁷ × 10 / 0.05 = **4 × 10⁻⁵ T**.

**Worked numerical 2.** Circular loop, one turn, R = 10 cm, I = 10 A: B = 4π × 10⁻⁷ × 10 / (2 × 0.1) = 2π × 10⁻⁵ ≈ **6.28 × 10⁻⁵ T**.

**Worked numerical 3.** Solenoid with 1000 turns per metre, I = 2 A: B = 4π × 10⁻⁷ × 1000 × 2 ≈ **2.51 × 10⁻³ T**.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<ellipse cx="130" cy="100" rx="10" ry="35"/>
<ellipse cx="160" cy="100" rx="10" ry="35"/>
<ellipse cx="190" cy="100" rx="10" ry="35"/>
<ellipse cx="220" cy="100" rx="10" ry="35"/>
<ellipse cx="250" cy="100" rx="10" ry="35"/>
<ellipse cx="280" cy="100" rx="10" ry="35"/>
<line x1="100" y1="90" x2="320" y2="90"/>
<line x1="100" y1="100" x2="320" y2="100"/>
<line x1="100" y1="110" x2="320" y2="110"/>
<path d="M312 86 l8 4 l-8 4"/>
<path d="M312 96 l8 4 l-8 4"/>
<path d="M312 106 l8 4 l-8 4"/>
<path d="M320 90 C 400 40, 380 10, 210 15 C 40 10, 20 40, 100 90"/>
<path d="M320 110 C 400 160, 380 190, 210 185 C 40 190, 20 160, 100 110"/>
<path d="M205 11 l-8 4 l8 4"/>
<path d="M205 181 l-8 4 l8 4"/>
<text x="330" y="104" fill="currentColor" stroke="none">N</text>
<text x="80" y="104" fill="currentColor" stroke="none">S</text>
<text x="150" y="150" fill="currentColor" stroke="none">uniform field inside: B = μ₀nI</text>
</svg>

A current-carrying solenoid behaves like a **bar magnet** (N and S poles at its ends). With a soft-iron core it becomes an **electromagnet**.

> **PYQ:** TRE 2.0 (2023) asked: "Which of the following processes will not produce new magnetic poles? (A) cutting a bar magnet in half (B) turning on a current in a solenoid (C) running a current through a straight wire." **Official answer: (C).** A straight wire's field lines are closed circles around it — no N or S end. Cutting a magnet gives two new magnets, each with two poles; a solenoid gets poles at its ends.

## 2. Force on charges and currents

<div class="formula">

| Situation | Formula |
|---|---|
| Lorentz force on a charge | F = q(E + v × B); magnetic part F = qvB sin θ |
| Radius in uniform B (v ⟂ B) | r = mv / (qB) |
| Cyclotron frequency | f = qB / (2πm) — independent of speed and radius |
| Force on a wire | F = BIL sin θ |
| Force between parallel wires (per metre) | F/L = μ₀I₁I₂ / (2πd); like currents attract, unlike repel |
| Torque on a coil | τ = NIAB sin θ = mB sin θ |

</div>

- The magnetic force is always **perpendicular to velocity**, so it does **no work** and cannot change speed (only direction). A charge moving **parallel** to B feels no force; at an angle it follows a **helix**.
- **Cyclotron** (E. O. Lawrence, 1932) accelerates protons, deuterons, α-particles — not electrons (their mass changes quickly with speed, so they fall out of step).
- **Old definition of the ampere:** the current which, in two long parallel wires 1 m apart in vacuum, produces a force of **2 × 10⁻⁷ N per metre**. (Since 2019 the ampere is defined by fixing e = 1.602176634 × 10⁻¹⁹ C.)

**Worked numerical 4.** A proton (m = 1.67 × 10⁻²⁷ kg) moves at 10⁶ m/s perpendicular to B = 0.1 T. r = mv/(qB) = 1.67 × 10⁻²¹ / (1.6 × 10⁻¹⁹ × 0.1) = 1.67 × 10⁻²¹ / 1.6 × 10⁻²⁰ ≈ **0.104 m (10.4 cm)**.

**Worked numerical 5.** A 20 cm wire carrying 4 A lies perpendicular to B = 0.5 T. F = 0.5 × 4 × 0.2 = **0.4 N**.

### Moving-coil galvanometer, ammeter and voltmeter

A galvanometer detects small currents; deflection θ ∝ I (radial magnetic field). To convert:

| Into | Connect | Formula |
|---|---|---|
| Ammeter | **Low** resistance shunt S in **parallel** | S = I_g G / (I − I_g) |
| Voltmeter | **High** resistance R in **series** | R = V/I_g − G |

**Worked numerical 6.** G = 50 Ω, full-scale I_g = 1 mA. For a 1 A ammeter: S = 10⁻³ × 50 / 0.999 ≈ **0.05 Ω**. For a 10 V voltmeter: R = 10/10⁻³ − 50 = **9950 Ω**.

## 3. Magnetic dipole moment and the earth's magnetism

A current loop is a **magnetic dipole**. Its dipole moment **m = NIA** (direction by right-hand rule). Unit: **A·m²** (equivalently **J/T**). For a bar magnet m = pole strength × magnetic length; pole strength unit is A·m.

> **PYQ:** TRE 2.0 (2023) asked: "The unit of magnetic dipole moment is (A) newton/(ampere-metre) (B) ampere/metre (C) ampere-metre²." **Official answer: (C) A·m².** Note the distractors: N/(A·m) is the tesla (unit of B), and A/m is the unit of magnetic intensity H and of magnetisation M.

**Worked numerical 7.** A coil of 50 turns, area 0.01 m², carries 2 A: m = 50 × 2 × 0.01 = **1 A·m²**. In B = 0.2 T at 30°, torque τ = mB sin 30° = 1 × 0.2 × 0.5 = **0.1 N·m**.

**Bohr magneton:** the natural unit of an electron's orbital magnetic moment, μ_B = eh/(4πm_e) ≈ 9.27 × 10⁻²⁴ A·m².

### Earth's magnetism

| Element | Meaning |
|---|---|
| Declination (D) | Angle between geographic meridian and magnetic meridian |
| Dip / inclination (δ) | Angle the earth's field makes with the horizontal: 0° at magnetic equator, 90° at magnetic poles |
| Horizontal component | B_H = B cos δ ; vertical B_V = B sin δ ; tan δ = B_V / B_H |

- Earth's geographic North pole region contains the **magnetic south pole** (that is why the N-end of a compass points north).
- The field is believed to come from currents in the molten iron outer core (**dynamo theory**). The magnetic poles drift and the field has **reversed** many times in geological history.
- **Van Allen belts** trap charged particles from the solar wind; their entry near the poles causes **auroras**.

## 4. Magnetic materials: dia, para, ferro

Key quantities: magnetic intensity **H** (A/m), magnetisation **M** (A/m), **B = μ₀(H + M)**, susceptibility **χ = M/H** (no unit), relative permeability **μᵣ = 1 + χ**.

| Property | Diamagnetic | Paramagnetic | Ferromagnetic |
|---|---|---|---|
| Susceptibility χ | Small, **negative** (≈ −10⁻⁵) | Small, positive (≈ 10⁻⁵ to 10⁻³) | Very large positive (10³ – 10⁵) |
| μᵣ | slightly < 1 | slightly > 1 | ≫ 1 |
| In a magnetic field | Weakly **repelled**; moves from strong to weak field | Weakly attracted | Strongly attracted |
| Field lines | Pushed out | Slightly concentrated | Strongly concentrated |
| Effect of temperature | Independent of T | χ = C/T (**Curie's law**) | Above Curie temperature becomes paramagnetic: χ = C/(T − T_c) (Curie–Weiss) |
| Atomic picture | No permanent moments (paired electrons) | Permanent moments, randomly oriented | Permanent moments aligned in **domains** |
| Examples | Bi, Cu, Ag, Au, Pb, water, NaCl, diamond, N₂, **superconductors** (χ = −1, perfect diamagnet — Meissner effect) | Al, Na, Pt, Mn, Cr, O₂ (liquid oxygen sticks to a magnet), CuCl₂ | **Fe, Co, Ni, Gd**, alloys like alnico, steel |

### Domains

In a ferromagnet, strong quantum "exchange" interaction lines up the atomic moments in small regions called **domains** (size about 1 μm to 1 mm, each containing ≈ 10¹⁷–10²¹ atoms). In an unmagnetised piece the domains point randomly; an external field makes favourable domains **grow** (domain walls move) and then **rotate** — the piece becomes magnetised. Heating above the **Curie temperature** destroys the alignment.

> **PYQ:** TRE 2.0 (2023) asked: "Domains are formed in which of the following substances? (A) diamagnetic (B) paramagnetic (C) ferromagnetic." **Official answer: (C) ferromagnetic.**

| Material | Curie temperature (approx.) |
|---|---|
| Iron | 770 °C (1043 K) |
| Cobalt | ≈ 1120 °C (≈ 1390 K) — highest of the common ones |
| Nickel | 358 °C (≈ 631 K) |
| Gadolinium | ≈ 19 °C (292 K) — ferromagnetic only below room temperature |

Related B.Sc. terms: **antiferromagnetic** (neighbouring moments antiparallel, e.g. MnO; transition at the **Néel temperature**) and **ferrimagnetic** (unequal antiparallel moments, e.g. ferrites like magnetite Fe₃O₄ and spinel ferrites — high resistivity, used in high-frequency cores).

### Hysteresis

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="60" y1="100" x2="360" y2="100"/>
<line x1="210" y1="15" x2="210" y2="185"/>
<text x="365" y="104" fill="currentColor" stroke="none">H</text>
<text x="215" y="18" fill="currentColor" stroke="none">B</text>
<path d="M330 35 C 280 30, 230 45, 210 60 C 190 75, 175 95, 165 100 C 140 140, 110 160, 90 165"/>
<path d="M90 165 C 140 170, 190 155, 210 140 C 230 125, 245 105, 255 100 C 280 60, 310 40, 330 35"/>
<circle cx="210" cy="60" r="3" fill="currentColor"/>
<circle cx="165" cy="100" r="3" fill="currentColor"/>
<text x="218" y="56" fill="currentColor" stroke="none">retentivity (Bᵣ)</text>
<text x="70" y="92" fill="currentColor" stroke="none">coercivity (−H_c)</text>
<text x="300" y="28" fill="currentColor" stroke="none">saturation</text>
<text x="250" y="170" fill="currentColor" stroke="none">loop area = energy lost per cycle</text>
</svg>

B lags behind H — this is **hysteresis**. **Retentivity (remanence)** = B left when H returns to zero; **coercivity** = reverse H needed to make B zero. Loop area = energy lost as heat per cycle per unit volume.

| Use | Need | Material |
|---|---|---|
| Permanent magnet | High retentivity, **high coercivity**, wide loop | Steel, alnico, NdFeB (neodymium) |
| Electromagnet, transformer core | High permeability, **low coercivity**, narrow loop (low loss) | **Soft iron**, silicon steel, ferrites, mu-metal |

## 5. Electromagnetic induction (Faraday and Lenz)

**Magnetic flux** Φ = B·A = BA cos θ (θ = angle between B and the normal to the area). Unit **weber (Wb) = T·m² = V·s**.

> **PYQ:** TRE 1.0 (2023) asked: an equilateral-triangle wire of side 1 m "sits in a magnetic field of 2 T, pointing to the right" — what is the flux through the triangle? Options 0 Wb, 1 Wb, 1.73 Wb. Worked answer: **(A) 0 Wb** — the field lies in the plane of the loop, so θ = 90° between B and the normal, cos 90° = 0. (If the field were perpendicular, Φ = 2 × (√3/4) × 1² = 2 × 0.433 = 0.866 Wb — still not 1.73; 1.73 = √3 is a distractor.)

**Faraday's laws (1831):** an EMF is induced whenever the flux through a circuit changes; its magnitude equals the rate of change of flux linkage.

**Lenz's law (1834):** the induced current flows in a direction that **opposes the change** producing it. This is required by **conservation of energy** — if the induced current helped the change, you would get energy from nothing.

<div class="formula">

| Quantity | Formula |
|---|---|
| Induced EMF | e = −N dΦ/dt |
| Motional EMF (rod of length l, speed v) | e = Blv |
| Rotating rod (length l, angular speed ω) | e = ½Bωl² |
| AC generator | e = NBAω sin ωt; peak e₀ = NBAω |
| Self-induced EMF | e = −L dI/dt |
| Mutual EMF | e₂ = −M dI₁/dt |
| Self-inductance of solenoid | L = μ₀N²A / l |
| Energy in inductor | U = ½LI² |

</div>

> **PYQ:** TRE 2.0 (2023) asked: "Lenz's law is based on the conservation of (A) energy (B) charge (C) momentum." **Official answer: (A) energy.**

> **PYQ:** TRE 1.0 (2023) asked: "The voltage induced across a stationary conductor in an external static magnetic field (A) depends on the angle of the conductor with the field (B) increases with time (C) is zero." Worked answer: **(C) is zero** — no motion and no change of B means no change of flux, so no EMF.

**Worked numerical 8.** B = 0.2 T, area 0.5 m², angle between B and normal 60°: Φ = 0.2 × 0.5 × cos 60° = **0.05 Wb**.

**Worked numerical 9.** A 100-turn coil's flux falls from 0.05 Wb to 0 in 0.1 s. e = 100 × 0.05/0.1 = **50 V**.

**Worked numerical 10.** A 20 cm rod moves at 10 m/s perpendicular to B = 0.5 T: e = Blv = 0.5 × 0.2 × 10 = **1 V**.

**Worked numerical 11.** L = 0.2 H, current changes at 50 A/s: e = 0.2 × 50 = **10 V**. Energy stored at 5 A: ½ × 0.2 × 25 = **2.5 J**.

### Inductance and its unit

Unit of inductance: **henry (H) = Wb/A = V·s/A = Ω·s**. (From e = L dI/dt: L = V/(A/s) = V·s/A, and V/A = Ω.)

> **PYQ:** TRE 2.0 (2023) asked: "The unit of inductance is (A) ohm-second (B) ohm/second (C) second/ohm." **Official answer: (A) ohm-second.** Second/ohm (s/Ω) is the unit of capacitance — the matching trap (since RC is a time, C = s/Ω).

**Eddy currents** (Foucault currents): induced loops of current in bulk metal. Useful in **induction cooktops**, electromagnetic brakes of trains, speedometers, induction furnaces, metal detectors; harmful in transformer cores — reduced by **laminating** the core.

## 6. Alternating current

AC: I = I₀ sin ωt, ω = 2πf. Indian mains: **50 Hz**, 220–230 V rms (USA 60 Hz, 120 V).

<div class="formula">

| Quantity | Formula |
|---|---|
| rms value | I_rms = I₀/√2 ≈ 0.707 I₀ ; V_rms = V₀/√2 |
| Mean (half cycle) | I_avg = 2I₀/π ≈ 0.637 I₀ ; over full cycle = 0 |
| Inductive reactance | X_L = ωL = 2πfL (voltage leads current by 90°) |
| Capacitive reactance | X_C = 1/(ωC) = 1/(2πfC) (current leads voltage by 90°) |
| Impedance (series LCR) | Z = √[R² + (X_L − X_C)²] |
| Phase angle | tan φ = (X_L − X_C)/R |
| Average power | P = V_rms I_rms cos φ ; power factor = cos φ = R/Z |

</div>

> **Memory trick:** **"ELI the ICE man"** — in an inductor (L), EMF (E) comes before current (I); in a capacitor (C), current (I) comes before EMF (E).

- An inductor blocks high frequency and passes DC (X_L = 0 at f = 0); a capacitor **blocks DC** (X_C = ∞) and passes high frequency.
- AC voltmeters/ammeters read **rms** values. 220 V rms means peak V₀ = 220 × √2 ≈ **311 V**.
- **Wattless current:** in a purely inductive or capacitive circuit φ = 90°, so average power = 0. A **choke coil** (high L, low R) controls AC current with almost no power loss, unlike a resistor.

**Worked numerical 12.** L = 0.1 H at 50 Hz: X_L = 2π × 50 × 0.1 = **31.4 Ω**. C = 100 μF at 50 Hz: X_C = 1/(2π × 50 × 10⁻⁴) = 1/0.0314 ≈ **31.8 Ω**.

**Worked numerical 13.** Series LCR: R = 30 Ω, X_L = 80 Ω, X_C = 40 Ω, V_rms = 200 V. Z = √(30² + 40²) = **50 Ω**; I = 200/50 = **4 A**; cos φ = 30/50 = **0.6**; P = 200 × 4 × 0.6 = **480 W** (check: I²R = 16 × 30 = 480 W). Circuit is inductive; voltage leads current by φ = 53°.

## 7. Resonance and Q-factor

**Series resonance:** when X_L = X_C, impedance is minimum (Z = R), current is **maximum**, and voltage and current are in phase (cos φ = 1).

<div class="formula">

| Quantity | Formula |
|---|---|
| Resonant frequency | f₀ = 1 / (2π√(LC)) ; ω₀ = 1/√(LC) |
| Quality factor | Q = ω₀L/R = 1/(ω₀CR) = (1/R)√(L/C) |
| Q from the curve | Q = f₀ / (bandwidth) = ω₀ / (ω₂ − ω₁) |
| Voltage across L or C at series resonance | V_L = V_C = Q × V (voltage magnification) |
| Parallel (tank) circuit current in L or C | I_L = I_C = Q × I_supply (current magnification) |

</div>

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="50" y1="175" x2="390" y2="175"/>
<line x1="50" y1="175" x2="50" y2="15"/>
<text x="330" y="193" fill="currentColor" stroke="none">frequency f</text>
<text x="10" y="13" fill="currentColor" stroke="none">current I (series LCR)</text>
<path d="M60 170 C 150 165, 185 150, 200 90 C 207 40, 213 30, 220 30 C 227 30, 233 40, 240 90 C 255 150, 290 165, 380 170"/>
<path d="M60 168 C 130 155, 170 115, 220 105 C 270 115, 310 155, 380 168"/>
<line x1="220" y1="30" x2="220" y2="175" stroke-dasharray="4 3"/>
<text x="213" y="190" fill="currentColor" stroke="none">f₀</text>
<text x="240" y="45" fill="currentColor" stroke="none">small R: sharp, high Q</text>
<text x="275" y="128" fill="currentColor" stroke="none">large R: broad, low Q</text>
</svg>

- The resonant frequency does **not** depend on R; R only sets the height and sharpness of the peak.
- High Q = sharp tuning = good **selectivity** (a radio picks one station). Radio tuning uses an LC circuit with a variable capacitor.
- **Parallel resonance (rejector / tank circuit):** at resonance the impedance is **maximum** and line current **minimum**, while a large current (Q times the supply) circulates between L and C. So parallel resonance gives **current magnification**; series resonance gives **voltage magnification**. For the same coil and capacitor the Q expression is the same, Q = ω₀L/R (textbook result for a low-resistance coil).

> **PYQ:** TRE 1.0 (2023) asked which statement is **not correct** about the Q-factor of a **parallel** resonance circuit: (A) Q of parallel resonance is the same as that of series resonance; (B) Q provides the current magnification; (C) Q provides the voltage magnification. Worked answer: **(C)** — voltage magnification belongs to series resonance.

**Worked numerical 14.** L = 10 mH, C = 1 μF, R = 10 Ω. LC = 10⁻² × 10⁻⁶ = 10⁻⁸, √LC = 10⁻⁴ s. ω₀ = 10⁴ rad/s; f₀ = 10⁴/(2π) ≈ **1592 Hz**. Q = ω₀L/R = 10⁴ × 10⁻²/10 = **10** (check (1/R)√(L/C) = (1/10)√(10⁻²/10⁻⁶) = (1/10) × 100 = 10). With 2 V applied at resonance, V_L = V_C = Q × V = **20 V** each.

**LC oscillations:** a charged capacitor discharging through an inductor makes energy swing between electric (½CV²) and magnetic (½LI²) forms at ω = 1/√(LC) — the electrical analogue of a spring–mass system (L ↔ mass, 1/C ↔ spring constant).

## 8. Transformer, generator and motor

**Transformer** (works only on AC; based on **mutual induction**):

<div class="formula">

| Ideal transformer | |
|---|---|
| Turns ratio | V_s / V_p = N_s / N_p = I_p / I_s |
| Step-up | N_s > N_p : voltage up, current down |
| Step-down | N_s < N_p : voltage down, current up |
| Ideal power | V_p I_p = V_s I_s ; efficiency = output / input |

</div>

**Worked numerical 15.** To step 220 V down to 11 V with 2000 primary turns: N_s = 2000 × 11/220 = **100 turns**. If the secondary gives 2 A, primary current = 2 × 11/220 = **0.1 A**.

| Loss | Cause | Remedy |
|---|---|---|
| Copper loss | I²R heating of windings | Thick copper wire |
| Eddy current loss | Induced currents in core | **Laminated** core |
| Hysteresis loss | Repeated magnetisation | **Soft iron** / silicon steel core |
| Flux leakage | Not all flux links secondary | Windings on top of each other, shell-type core |

Power is transmitted at **high voltage** (e.g. 220 kV, 400 kV, 765 kV) so that current and I²R loss are small, then stepped down near homes.

| Machine | Principle | Energy change | Key part |
|---|---|---|---|
| AC generator (dynamo) | Electromagnetic induction (Faraday) | Mechanical → electrical | **Slip rings** |
| DC generator | Induction | Mechanical → electrical | Split-ring commutator |
| DC motor | Force on current in B (Fleming's left hand) | Electrical → mechanical | **Split-ring commutator** reverses current every half turn |
| Induction motor (fans, pumps) | Rotating magnetic field induces currents in rotor | Electrical → mechanical | No brushes |

## 9. Maxwell's equations and electromagnetic waves

**James Clerk Maxwell (1864–65)** completed the laws of electricity and magnetism by adding the **displacement current** I_d = ε₀ dΦ_E/dt (a changing electric field acts like a current and produces a magnetic field). This made the equations symmetric and predicted EM waves.

<div class="formula">

| Name | Differential form | Meaning |
|---|---|---|
| Gauss's law (electric) | ∇·E = ρ/ε₀ (or ∇·D = ρ) | Charges are sources of E |
| Gauss's law (magnetic) | ∇·B = 0 | No magnetic monopoles |
| Faraday's law | ∇×E = −∂B/∂t | Changing B creates E |
| Ampère–Maxwell law | ∇×B = μ₀J + μ₀ε₀ ∂E/∂t (or ∇×H = J + ∂D/∂t) | Currents and changing E create B |

</div>

The **continuity equation ∇·J + ∂ρ/∂t = 0** (conservation of charge) can be **derived** from Maxwell's equations but is **not** one of the four.

> **PYQ:** TRE 1.0 (2023) asked which expression is **not** a Maxwell's equation for time-varying fields; the options were (A) ∇·J + ∂ρ/∂t = 0, (B) ∇·D = ρ, (C) ∇×E = −∂B/∂t. Worked answer: **(A)** — that is the continuity equation.

### Properties of EM waves

- Oscillating **E and B are perpendicular to each other and to the direction of travel** — EM waves are **transverse**.
- They need **no medium**; produced by **accelerated charges**.
- Speed in vacuum **c = 1/√(μ₀ε₀) = 3 × 10⁸ m/s**; in a medium v = c/n = 1/√(με).
- E₀/B₀ = c. Energy is shared equally between E and B fields. They carry momentum and exert **radiation pressure**.
- **Heinrich Hertz (1887–88)** first produced and detected them (radio waves); **J. C. Bose** worked with microwaves (5 mm – 25 mm) in 1895; **Marconi** sent radio signals across the Atlantic in 1901.

**Check c:** 1/√(4π × 10⁻⁷ × 8.85 × 10⁻¹²) = 1/√(1.112 × 10⁻¹⁷) = 1/(3.335 × 10⁻⁹) ≈ **3.0 × 10⁸ m/s**.

> **PYQ:** TRE 2.0 (2023) asked: "The velocity of electromagnetic waves in vacuum is (A) 3 × 10⁸ m/s (B) 3 × 10⁷ m/s (C) 3 × 10⁶ m/s." **Official answer: (A).**

### Electromagnetic spectrum

| Wave | Wavelength (approx.) | Source / discoverer | Use |
|---|---|---|---|
| Gamma rays | < 10⁻¹¹ m | Radioactive nuclei (Villard, 1900) | Cancer therapy, sterilising |
| X-rays | 10⁻¹¹ – 10⁻⁸ m | Röntgen, 1895 | Medical imaging, crystal study |
| Ultraviolet | 10⁻⁸ – 4 × 10⁻⁷ m | Ritter, 1801; the Sun | Sterilising water, vitamin D; ozone absorbs it |
| Visible | 400 – 700 nm (violet to red) | Hot bodies | Seeing |
| Infrared | 7 × 10⁻⁷ m – 1 mm | Herschel, 1800 | Heating, TV remote, night vision, greenhouse effect |
| Microwaves | 1 mm – 0.3 m | Klystron, magnetron (Bose) | Radar, microwave oven (water absorbs 2.45 GHz), mobile phones |
| Radio waves | > 0.1 m | Oscillating circuits (Hertz) | Radio, TV, communication |

> **Memory trick:** "**G**ood **X**-men **U**se **V**ery **I**nteresting **M**icro **R**adios" — γ, X, UV, Visible, IR, Micro, Radio: wavelength increasing, frequency and photon energy decreasing.

> **PYQ:** TRE 2.0 (2023) asked: "Which of the following is not an electromagnetic wave? (A) gamma ray (B) X-ray (C) beta ray." **Official answer: (C) beta ray** — β-rays are fast **electrons** (charged particles), deflected by electric and magnetic fields. (More in [Modern Physics](/interview/bpsc-tre4-science/physics/modern-physics-atoms-and-nuclei).)

Crookes glass absorbs UV (used in sunglasses) — see [Ray Optics](/interview/bpsc-tre4-science/physics/ray-optics-and-optical-instruments). For GS-level revision see [Electricity, magnetism and modern physics (BPSC CCE)](/interview/bpsc-2027/science/electricity-magnetism-and-modern-physics).

## 10. Units summary

| Quantity | SI unit | Equivalent |
|---|---|---|
| Magnetic field B | tesla (T) | N/(A·m) = Wb/m² = 10⁴ gauss |
| Magnetic intensity H, magnetisation M | A/m | |
| Magnetic flux Φ | weber (Wb) | T·m² = V·s (CGS: maxwell; 1 Wb = 10⁸ Mx) |
| Magnetic dipole moment | A·m² | J/T |
| Pole strength | A·m | |
| Inductance | henry (H) | Wb/A = V·s/A = **Ω·s** |
| Permeability μ₀ | H/m | T·m/A |
| Reactance, impedance | ohm (Ω) | |
| Frequency | hertz (Hz) | s⁻¹ |

Dimensional checks: L/R has the unit of **time** (time constant); RC is time; 1/√(LC) is angular frequency.

## Traps and exceptions

- **Straight wire → no poles** (TRE 2.0). Solenoid and a broken magnet do have poles.
- **Lenz's law = conservation of energy**, not of charge or momentum.
- **Henry = ohm-second**; farad = second/ohm. Don't swap.
- **A·m²** is the dipole moment; N/(A·m) is tesla; A/m is H.
- **Domains exist only in ferromagnetic (and ferrimagnetic) materials**, not in para- or diamagnetic ones.
- Diamagnetism is present in **all** materials but is masked in para/ferro ones; superconductors are perfect diamagnets (χ = −1).
- Curie's law (χ ∝ 1/T) is for **paramagnets**; diamagnetic χ does not depend on temperature.
- **Soft iron** for electromagnets and transformer cores (low coercivity); **steel** for permanent magnets.
- Flux through a loop is zero when B lies in its plane (θ between B and normal = 90°).
- A **stationary** conductor in a **static** field: EMF = 0.
- Magnetic force does no work; a charge moving parallel to B feels no force.
- **Series resonance: Z minimum, current maximum, voltage magnification.** **Parallel resonance: Z maximum, line current minimum, current magnification.**
- Resonant frequency is independent of R.
- **Continuity equation is not a Maxwell equation.**
- **Beta rays are not EM waves**; gamma, X-rays, UV, IR, microwaves, radio are.
- AC meters read rms; 220 V rms = 311 V peak.
- Transformers do not work on steady DC.
- Cyclotron cannot accelerate electrons (relativistic mass increase) or neutrons (no charge).

## Quick revision

1. Oersted (1820): current produces magnetic field.
2. Biot–Savart: dB = (μ₀/4π) I dl sin θ / r²; B ∝ I and ∝ dl (TRE 1.0).
3. μ₀ = 4π × 10⁻⁷ T·m/A; 1 T = 10⁴ gauss.
4. Long wire B = μ₀I/2πr; loop centre μ₀NI/2R; solenoid μ₀nI.
5. Fleming's left hand — motor; right hand — generator.
6. r = mv/qB; cyclotron frequency qB/2πm independent of speed.
7. Parallel wires: like currents attract.
8. Ammeter = galvanometer + low shunt; voltmeter = galvanometer + high series resistance.
9. Magnetic dipole moment m = NIA, unit A·m² (TRE 2.0).
10. Dip is 0° at magnetic equator, 90° at magnetic poles.
11. Diamagnetic χ negative; paramagnetic χ = C/T; ferromagnetic above Curie point becomes paramagnetic.
12. Domains — ferromagnetic only (TRE 2.0). Curie point of iron 770 °C.
13. Soft iron: narrow hysteresis loop; steel/alnico: permanent magnets.
14. Φ = BA cos θ; unit weber = T·m².
15. e = −N dΦ/dt; motional e = Blv.
16. Lenz's law ⇒ conservation of energy (TRE 2.0).
17. Henry = Wb/A = Ω·s (TRE 2.0).
18. Laminated core reduces eddy current loss.
19. X_L = 2πfL, X_C = 1/2πfC; ELI the ICE man.
20. f₀ = 1/(2π√LC); Q = ω₀L/R = (1/R)√(L/C).
21. Series resonance — voltage magnification; parallel — current magnification (TRE 1.0).
22. Power factor cos φ = R/Z; pure L or C draws wattless current.
23. Maxwell added displacement current; four equations; continuity equation is not one of them.
24. c = 1/√(μ₀ε₀) = 3 × 10⁸ m/s (TRE 2.0); EM waves are transverse.
25. β-rays are not EM waves (TRE 2.0).

## Practice with answers

1. SI unit of magnetic flux? — **Weber** (T·m² = V·s).
2. SI unit of inductance in base-friendly form? — **Ohm-second** (henry = V·s/A).
3. Which law gives the direction of induced current? — **Lenz's law** (opposes the change).
4. Lenz's law is a consequence of conservation of? — **Energy**.
5. Field at the centre of a 50-turn coil, radius 5 cm, 1 A? — **≈ 6.28 × 10⁻⁴ T** (4π × 10⁻⁷ × 50 × 1 / 0.1).
6. Material whose susceptibility is small and negative? — **Diamagnetic** (e.g. bismuth, copper, water).
7. Above the Curie temperature a ferromagnet becomes? — **Paramagnetic**.
8. Why is a transformer core laminated? — **To reduce eddy current losses**.
9. A step-up transformer has 100 primary and 5000 secondary turns; 220 V input gives? — **11,000 V** (ratio 50).
10. Peak value of 230 V rms mains? — **≈ 325 V** (230 × 1.414).
11. Resonant frequency of L = 1 H, C = 1 μF? — **≈ 159 Hz** (1/(2π × 10⁻³)).
12. At series resonance, the impedance equals? — **R** (X_L = X_C cancel).
13. Which resonance gives current magnification? — **Parallel resonance** (tank circuit).
14. Flux through a loop whose plane is parallel to B? — **Zero** (cos 90° = 0).
15. Who added displacement current to Ampère's law? — **James Clerk Maxwell**.
16. Speed of EM waves in vacuum from μ₀ and ε₀? — **3 × 10⁸ m/s** (1/√(μ₀ε₀)).
17. Arrange in increasing wavelength: radio, X-ray, visible, microwave. — **X-ray < visible < microwave < radio**.
18. Which is not an EM wave: gamma, X-ray, beta? — **Beta** (stream of electrons).
19. Which does not produce new magnetic poles: cutting a magnet, solenoid current, straight-wire current? — **Straight-wire current** (circular field lines).
20. Power in a series LCR with R = 10 Ω carrying 2 A rms? — **40 W** (only R dissipates: I²R).
