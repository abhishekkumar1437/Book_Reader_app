---
title: Electrostatics and Current Electricity
part: Electricity
summary: Charge, Coulomb's law, field, potential, Gauss's law and capacitors, then current, Ohm's law, resistivity and temperature, Kirchhoff's laws, bridges, heating effect, household wiring, cells and lightning — NCERT class 10 to 12 with the B.Sc. points TRE asks.
---

This chapter starts with charges at rest (electrostatics, class 12 chapter 1–2) and then moves to charges in motion (current electricity, class 10 "Electricity" and class 12 chapter 3). TRE asks it as one-liners — a unit, "what happens to resistance on heating", which cell converts solar energy — plus short numericals on series/parallel, Kirchhoff's laws and power.

> **In simple words:** Charge is the "stuff" of electricity. Charges push or pull each other (Coulomb's law). A charge creates a field around it, and moving a charge in that field needs work — that work per charge is the potential (volt). When a potential difference is applied across a wire, charges flow: that flow is current. The wire resists the flow (resistance), and the lost energy becomes heat.

## 1. Electric charge — the basics

| Property | Meaning |
|---|---|
| Two kinds | Positive and negative (named by Benjamin Franklin). Like charges repel, unlike attract |
| Quantisation | Every charge is q = ne, where e = 1.6 × 10⁻¹⁹ C and n is a whole number |
| Conservation | Total charge of an isolated system never changes |
| Additivity | Charges add like ordinary numbers (scalar, with sign) |
| SI unit | coulomb (C). 1 C = charge of 6.25 × 10¹⁸ electrons |

- **Charging by friction:** glass rod rubbed with silk becomes positive (glass loses electrons); ebonite rubbed with wool/fur becomes negative.
- **Charging by conduction** (touching) gives the same sign; **charging by induction** (bringing near, then earthing) gives the opposite sign.
- **Conductors** (metals, salt water, human body) let charge move; **insulators** (glass, rubber, dry wood, plastic) do not.
- A **gold-leaf electroscope** detects charge; the leaves diverge because like charges repel.
- On a charged conductor, the charge sits only on the **outer surface**, and more of it gathers at **sharp points** (high surface charge density). This is why lightning conductors are pointed.

> **Remember:** Mass of a body changes very slightly on charging. A negatively charged body has gained electrons, so its mass increases (by 9.1 × 10⁻³¹ kg per electron).

## 2. Coulomb's law

The force between two point charges q₁ and q₂ separated by distance r:

<div class="formula">

| Quantity | Formula |
|---|---|
| Coulomb force | F = k q₁q₂ / r² |
| Constant | k = 1/(4πε₀) = 9 × 10⁹ N m² C⁻² |
| Permittivity of free space | ε₀ = 8.85 × 10⁻¹² C² N⁻¹ m⁻² |
| In a medium of dielectric constant K | F_medium = F_vacuum / K |

</div>

- It is an **inverse-square law**, like Newton's law of gravitation, but far stronger: between two protons the electric force is about **10³⁶ times** the gravitational force (between two electrons about 10⁴² times).
- Unlike gravity, it can be attractive or repulsive, and it depends on the medium.
- Dielectric constant (relative permittivity) K of water ≈ 80, so salt (NaCl) dissolves in water easily — the attraction between Na⁺ and Cl⁻ drops 80 times.

**Worked numerical 1.** Charges 2 μC and 3 μC are 30 cm apart in air. Force?
F = 9 × 10⁹ × (2 × 10⁻⁶)(3 × 10⁻⁶) / (0.3)² = 9 × 10⁹ × 6 × 10⁻¹² / 0.09 = 0.054 / 0.09 = **0.6 N** (repulsive).

**Worked numerical 2.** If the distance between two charges is halved, the force becomes? F ∝ 1/r², so (1/½)² = **4 times**.

## 3. Electric field and field lines

The **electric field** E at a point is the force on a unit positive test charge placed there: E = F/q₀. Unit: **N/C = V/m**. It is a vector.

<div class="formula">

| Source | Field |
|---|---|
| Point charge q at distance r | E = kq / r² |
| Electric dipole, axial point (far) | E = 2kp / r³ |
| Electric dipole, equatorial point (far) | E = kp / r³ (opposite to p) |
| Infinite plane sheet (charge density σ) | E = σ / 2ε₀ (independent of distance) |
| Just outside a charged conductor | E = σ / ε₀ |
| Inside a conductor (static) | E = 0 |

</div>

**Worked numerical 3.** Field 10 cm from a 5 nC charge: E = 9 × 10⁹ × 5 × 10⁻⁹ / (0.1)² = 45 / 0.01 = **4500 N/C**.

**Rules of field lines:**

1. Start on positive charge, end on negative charge (or at infinity).
2. Two field lines **never cross** (the field would have two directions at one point).
3. Crowded lines = strong field.
4. They meet a conductor's surface at **90°**.
5. Electrostatic field lines never form closed loops (magnetic field lines do).

**Electric dipole:** two equal and opposite charges ±q a distance 2a apart. **Dipole moment p = q × 2a**, unit **C·m**, direction from −q to +q. In a uniform field a dipole feels **zero net force** but a **torque τ = pE sin θ**. Water (H₂O) and HCl are polar molecules with permanent dipole moments; CO₂ is non-polar.

## 4. Electric flux and Gauss's law

**Electric flux** Φ = E·A = EA cos θ (number of field lines crossing a surface). Unit: N m² C⁻¹ (or V·m).

> **Remember:** **Gauss's law:** total flux through any closed surface = (charge enclosed) / ε₀. A charge outside the surface gives zero net flux. If a charge q sits at the centre of a cube, the flux through **one face = q / 6ε₀**.

Applications (B.Sc. level): field of an infinite line charge E = λ/(2πε₀r); infinite sheet σ/2ε₀; field inside a uniformly charged spherical shell is **zero**; outside the shell it behaves as if all charge were at the centre.

**Faraday cage:** inside a closed conductor the field is zero, so a person inside a car (metal body) is safe during lightning; sensitive instruments are shielded the same way (electrostatic shielding).

## 5. Electric potential

**Potential** V at a point = work done to bring a unit positive charge from infinity to that point. **V = W/q**. Unit **volt = J/C**. Potential is a **scalar**.

<div class="formula">

| Quantity | Formula |
|---|---|
| Potential of a point charge | V = kq / r |
| Potential difference | V_A − V_B = W_BA / q |
| Field from potential | E = −dV/dr (field points toward decreasing potential) |
| Potential energy of two charges | U = k q₁q₂ / r |
| Electron-volt | 1 eV = 1.6 × 10⁻¹⁹ J |

</div>

- **Equipotential surface:** all points at the same potential. No work is done moving a charge along it, and the field is always **perpendicular** to it. For a point charge, equipotentials are concentric spheres.
- Inside a charged conducting sphere the field is zero but the **potential is constant** (equal to the surface value) — not zero. A common trap.

**Worked numerical 4.** Potential 10 cm from a 5 nC charge: V = 9 × 10⁹ × 5 × 10⁻⁹ / 0.1 = **450 V**. Work to bring a 2 μC charge there from infinity: W = qV = 2 × 10⁻⁶ × 450 = **9 × 10⁻⁴ J**.

## 6. Capacitors

A **capacitor** stores charge and energy: two conductors separated by an insulator (dielectric). **Capacitance C = Q/V**. Unit **farad (F) = C/V**; practical units μF, nF, pF.

<div class="formula">

| Quantity | Formula |
|---|---|
| Parallel-plate capacitor | C = ε₀A / d ; with dielectric C = Kε₀A / d |
| Isolated sphere of radius R | C = 4πε₀R |
| Series | 1/C = 1/C₁ + 1/C₂ + … (same charge on each) |
| Parallel | C = C₁ + C₂ + … (same voltage on each) |
| Energy stored | U = ½CV² = Q²/2C = ½QV |
| Energy density in field | u = ½ε₀E² |

</div>

> **Memory trick:** Capacitors combine the **opposite** way to resistors: series capacitors use the reciprocal rule, parallel capacitors simply add.

**Worked numerical 5.** 2 μF and 3 μF in series: C = (2 × 3)/(2 + 3) = **1.2 μF**. In parallel: **5 μF**. Energy in the parallel combination at 100 V: U = ½ × 5 × 10⁻⁶ × 100² = **0.025 J**.

**Worked numerical 6.** Plates of area 0.01 m², gap 1 mm, air: C = 8.85 × 10⁻¹² × 0.01 / 10⁻³ = **8.85 × 10⁻¹¹ F ≈ 88.5 pF**. Inserting mica (K = 6) makes it 6 times larger: ≈ 531 pF.

**Effect of inserting a dielectric slab (K):**

| Condition | C | Q | V | E | Energy |
|---|---|---|---|---|---|
| Battery stays connected (V fixed) | K times | K times | same | same | K times |
| Battery removed first (Q fixed) | K times | same | 1/K | 1/K | 1/K |

The **capacitance of the earth** (R = 6.4 × 10⁶ m) is only about 4πε₀R ≈ 711 μF — a farad is a very large unit.

Uses: camera flash, fan/motor starting, filters in rectifiers (see [Electronics](/interview/bpsc-tre/class-9-10-science/physics/electronics-and-communication)), tuning circuits in radios (with an inductor, see [Magnetism, EMI and AC](/interview/bpsc-tre/class-9-10-science/physics/magnetism-emi-and-ac)).

## 7. Electric current and drift velocity

**Current I = Q/t** — charge passing per second. SI unit **ampere (A)**, one of the seven **base units**. Conventional current flows from + to −; electrons move the opposite way.

- In a metal wire, free electrons move randomly at about 10⁵–10⁶ m/s but with no net flow. When a field is applied they acquire a tiny average **drift velocity** v_d ≈ 10⁻⁴ m/s (fraction of a mm per second).
- The bulb still lights instantly because the **electric field** travels along the wire at nearly the speed of light, pushing all electrons at once.

<div class="formula">

| Quantity | Formula |
|---|---|
| Current and drift speed | I = n e A v_d |
| Drift velocity | v_d = eEτ / m (τ = relaxation time) |
| Mobility | μ = v_d / E |
| Current density | J = I / A = σE |

</div>

**Worked numerical 7.** A copper wire of cross-section 1 mm² carries 1.5 A; n = 8.5 × 10²⁸ m⁻³. v_d = I/(neA) = 1.5 / (8.5 × 10²⁸ × 1.6 × 10⁻¹⁹ × 10⁻⁶) = 1.5 / (1.36 × 10⁴) = **1.1 × 10⁻⁴ m/s**.

## 8. Ohm's law, resistance and resistivity

**Ohm's law (Georg Ohm, 1827):** at constant temperature, V ∝ I, so **V = IR**. Resistance unit **ohm (Ω) = V/A**.

<div class="formula">

| Quantity | Formula | Unit |
|---|---|---|
| Resistance | R = ρL / A | Ω |
| Resistivity | ρ = m / (n e² τ) | Ω·m |
| Conductance | G = 1/R | siemens (S), old name mho |
| Conductivity | σ = 1/ρ | S/m |
| Temperature effect | R_T = R₀ (1 + αΔT) | α in /°C |

</div>

- Resistance depends on length (∝ L), area (∝ 1/A), material and temperature. **Resistivity depends only on material and temperature, not on shape.**
- **Stretching a wire** to n times its length (volume constant): area becomes 1/n, so **R becomes n² times**; resistivity unchanged.
- **Ohmic** conductors: metals at constant temperature (straight V–I line). **Non-ohmic:** diode, transistor, filament bulb (heats up), electrolytes, thermistor.

**Worked numerical 8.** Copper wire, ρ = 1.7 × 10⁻⁸ Ω·m, L = 2 m, A = 1 mm²: R = 1.7 × 10⁻⁸ × 2 / 10⁻⁶ = **0.034 Ω**.

**Worked numerical 9.** A wire of 10 Ω is stretched to double its length. New R = 2² × 10 = **40 Ω**.

### Resistivity values and materials

| Material | ρ at 20 °C (Ω·m, approx.) | Use / note |
|---|---|---|
| Silver | 1.6 × 10⁻⁸ | Best conductor (too costly for wiring) |
| Copper | 1.7 × 10⁻⁸ | House wiring |
| Aluminium | 2.7 × 10⁻⁸ | Overhead power lines (light, cheap) |
| Tungsten | 5.6 × 10⁻⁸ | Bulb filament (melting point ≈ 3400 °C) |
| Nichrome (Ni-Cr alloy) | ≈ 1.1 × 10⁻⁶ | Heater, iron, toaster elements (high ρ, does not oxidise) |
| Manganin, constantan | ≈ 4.4–4.9 × 10⁻⁷ | Standard resistors, rheostats (very small α) |
| Germanium, silicon | ≈ 0.46, ≈ 2300 | Semiconductors |
| Glass, rubber | 10¹⁰ – 10¹⁶ | Insulators |

**Fuse wire** is a tin–lead alloy: low melting point, so it melts when current exceeds its rating.

### Resistance and temperature

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="50" y1="170" x2="390" y2="170"/>
<line x1="50" y1="170" x2="50" y2="20"/>
<text x="330" y="190" fill="currentColor" stroke="none">Temperature T</text>
<text x="10" y="18" fill="currentColor" stroke="none">Resistance R</text>
<line x1="60" y1="130" x2="370" y2="40"/>
<text x="280" y="45" fill="currentColor" stroke="none">Metal (α positive)</text>
<path d="M60 30 C 120 110, 200 150, 370 160"/>
<text x="190" y="128" fill="currentColor" stroke="none">Semiconductor / insulator (α negative)</text>
<line x1="70" y1="168" x2="110" y2="168" stroke-width="3"/>
<line x1="110" y1="168" x2="110" y2="100" stroke-dasharray="3 3"/>
<line x1="110" y1="100" x2="200" y2="72"/>
<text x="118" y="95" fill="currentColor" stroke="none">Superconductor: R = 0 below Tc</text>
</svg>

| Material type | On heating | Why |
|---|---|---|
| Metals (conductors) | Resistance **increases** (α positive, Cu ≈ 4 × 10⁻³ /°C) | Ions vibrate more, electrons collide more often (τ falls) |
| Semiconductors (Si, Ge, carbon) | Resistance **decreases** (α negative) | More electrons jump to the conduction band; carrier number n rises sharply |
| Insulators | Resistance decreases | Same reason, at much higher temperature |
| Alloys (manganin, constantan) | Almost no change | Used in standard resistors |
| Electrolytes | Resistance decreases | Ions move faster |
| Superconductors | **Zero** resistance below a critical temperature Tc | Mercury at 4.2 K — Kamerlingh Onnes, 1911 |

> **PYQ:** TRE 2.0 (2023) asked: "On heating, the resistance of a semiconductor (A) increases (B) decreases (C) remains same." **Official answer: (B) decreases.** Heat creates more free charge carriers. (Details in [Electronics and Communication](/interview/bpsc-tre/class-9-10-science/physics/electronics-and-communication).)

**Worked numerical 10.** A copper coil has 10 Ω at 0 °C; α = 0.004 /°C. At 50 °C: R = 10 (1 + 0.004 × 50) = 10 × 1.2 = **12 Ω**.

**Thermistor:** a semiconductor resistor with a large negative α — used as a temperature sensor.

## 9. Resistors in series and parallel

<div class="formula">

| Combination | Rule | Same quantity |
|---|---|---|
| Series | R = R₁ + R₂ + R₃ … | Current |
| Parallel | 1/R = 1/R₁ + 1/R₂ + … ; two resistors: R = R₁R₂/(R₁ + R₂) | Voltage |
| n equal resistors R | Series nR ; parallel R/n ; ratio series/parallel = n² |  |

</div>

- The equivalent of resistors in parallel is **smaller than the smallest** one.
- Household appliances are connected in **parallel**: each gets full 220 V and can be switched independently; one fault does not cut the others.

**Worked numerical 11.** Three 6 Ω resistors: series **18 Ω**; parallel **2 Ω**; two in parallel plus one in series: 3 + 6 = **9 Ω**.

**Worked numerical 12.** A wire of resistance 12 Ω is bent into a circle. Resistance between two diametrically opposite points: two 6 Ω halves in parallel = **3 Ω**.

## 10. EMF and internal resistance

**EMF (ε)** of a cell = work done by the cell per unit charge in moving it around the whole circuit = p.d. across terminals when **no current** flows. Unit volt. EMF is not a force (bad old name).

<div class="formula">

| Situation | Formula |
|---|---|
| Current in circuit | I = ε / (R + r) |
| Terminal voltage (discharging) | V = ε − Ir |
| Terminal voltage (charging) | V = ε + Ir |
| Maximum power to external R | when R = r ; P_max = ε² / 4r |
| n cells in series | ε_total = nε, r_total = nr |
| n identical cells in parallel | ε_total = ε, r_total = r/n |

</div>

**Worked numerical 13.** ε = 12 V, r = 1 Ω, R = 5 Ω: I = 12/6 = **2 A**; terminal voltage V = 12 − 2 × 1 = **10 V**.

## 11. Kirchhoff's laws

Gustav Kirchhoff (1845) gave two rules to solve any network:

| Law | Statement | Based on |
|---|---|---|
| **Junction law (KCL)** | Sum of currents entering a junction = sum of currents leaving: ΣI = 0 | **Conservation of charge** |
| **Loop law (KVL)** | Around any closed loop, sum of EMFs = sum of IR drops: Σε = ΣIR, i.e. ΣV = 0 | **Conservation of energy** |

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<circle cx="210" cy="100" r="5" fill="currentColor"/>
<line x1="60" y1="40" x2="205" y2="97"/>
<line x1="60" y1="160" x2="205" y2="103"/>
<line x1="215" y1="97" x2="360" y2="40"/>
<line x1="215" y1="103" x2="360" y2="160"/>
<line x1="210" y1="105" x2="210" y2="185"/>
<path d="M120 63 l12 2 l-6 9" />
<path d="M120 137 l12 -2 l-6 -9" />
<path d="M300 63 l12 -2 l-8 -8" />
<path d="M300 137 l12 2 l-8 8" />
<path d="M204 165 l6 10 l6 -10" />
<text x="60" y="32" fill="currentColor" stroke="none">I₁ = 5 A (in)</text>
<text x="60" y="180" fill="currentColor" stroke="none">I₂ = 3 A (in)</text>
<text x="300" y="32" fill="currentColor" stroke="none">I₃ = 2 A (out)</text>
<text x="300" y="180" fill="currentColor" stroke="none">I₄ = 1 A (out)</text>
<text x="220" y="190" fill="currentColor" stroke="none">i = ? (out)</text>
<text x="150" y="100" fill="currentColor" stroke="none">Junction</text>
</svg>

**Worked numerical 14 (KCL).** In the figure, 5 A + 3 A enter; 2 A, 1 A and i leave. 8 = 2 + 1 + i, so **i = 5 A**.

> **PYQ:** TRE 1.0 (2023) gave a network with branch currents 1 A, 3 A, 5 A, 6 A and 2 A and asked for the unknown current i (Q56). The figure was not recoverable from our copy of the paper, so we do not state its answer here. The method is always the same: at each junction, **total in = total out**; work junction by junction until i is the only unknown.

**Worked numerical 15 (KVL).** A single loop has a 10 V cell and a 4 V cell connected so they **oppose** each other, with total resistance 3 Ω (including internal resistances). Net EMF = 10 − 4 = 6 V, so I = 6/3 = **2 A**, flowing in the direction set by the 10 V cell.

**Worked numerical 16 (two loops).** Two cells, ε₁ = 6 V and ε₂ = 3 V (internal resistance neglected), have their positive terminals joined to a top junction A through R₁ = 1 Ω and R₂ = 1 Ω respectively; a load R = 2 Ω joins A to the common bottom wire. Let the potential of A (above the bottom wire) be V.
Current from cell 1 into A: I₁ = (6 − V)/1; from cell 2: I₂ = (3 − V)/1; current down the load: I = V/2.
KCL at A: (6 − V) + (3 − V) = V/2 → 9 = 2.5V → **V = 3.6 V**. So I = 1.8 A, I₁ = 2.4 A, I₂ = −0.6 A (the minus sign means 0.6 A actually flows **into** the 3 V cell — it is being charged). Check: 2.4 − 0.6 = 1.8 A. (Lesson: assume directions, apply KCL/KVL, and let a negative answer tell you the true direction.)

> **Exam angle:** "Kirchhoff's first law is based on conservation of ___" (charge); "second law on conservation of ___" (energy). This pair is a favourite one-liner.

## 12. Wheatstone bridge, metre bridge and potentiometer

**Wheatstone bridge:** four resistances P, Q, R, S in a diamond with a galvanometer across the middle. At **balance** (galvanometer shows zero current), **P/Q = R/S**.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="210" y1="30" x2="110" y2="100"/>
<line x1="210" y1="30" x2="310" y2="100"/>
<line x1="110" y1="100" x2="210" y2="170"/>
<line x1="310" y1="100" x2="210" y2="170"/>
<rect x="147" y="59" width="26" height="12" transform="rotate(-35 160 65)"/>
<rect x="247" y="59" width="26" height="12" transform="rotate(35 260 65)"/>
<rect x="147" y="129" width="26" height="12" transform="rotate(35 160 135)"/>
<rect x="247" y="129" width="26" height="12" transform="rotate(-35 260 135)"/>
<line x1="110" y1="100" x2="195" y2="100"/>
<circle cx="210" cy="100" r="15"/>
<line x1="225" y1="100" x2="310" y2="100"/>
<text x="206" y="104" fill="currentColor" stroke="none">G</text>
<text x="138" y="55" fill="currentColor" stroke="none">P</text>
<text x="274" y="55" fill="currentColor" stroke="none">Q</text>
<text x="138" y="158" fill="currentColor" stroke="none">R</text>
<text x="274" y="158" fill="currentColor" stroke="none">S</text>
<line x1="210" y1="30" x2="210" y2="12"/>
<line x1="210" y1="12" x2="40" y2="12"/>
<line x1="40" y1="12" x2="40" y2="92"/>
<line x1="30" y1="92" x2="50" y2="92"/>
<line x1="34" y1="100" x2="46" y2="100" stroke-width="3"/>
<line x1="40" y1="100" x2="40" y2="190"/>
<line x1="40" y1="190" x2="210" y2="190"/>
<line x1="210" y1="190" x2="210" y2="170"/>
<text x="55" y="100" fill="currentColor" stroke="none">cell</text>
<text x="300" y="30" fill="currentColor" stroke="none">Balance: P/Q = R/S</text>
<text x="300" y="185" fill="currentColor" stroke="none">G reads zero</text>
</svg>

**Worked numerical 17.** P = 10 Ω, Q = 20 Ω, R = 15 Ω. For balance S = RQ/P = 15 × 20 / 10 = **30 Ω**.

**Metre bridge (slide-wire bridge):** a practical Wheatstone bridge with a 1 m uniform wire. If the balance point is at length l (cm) from the end next to the unknown X, and known R is in the other gap: **X/R = l / (100 − l)**.

**Worked numerical 18.** Balance at 40 cm, R = 12 Ω: X = 12 × 40 / 60 = **8 Ω**.

**Potentiometer:** a long uniform wire with a steady current; potential drop ∝ length (V = kl, k = potential gradient). It measures EMF **without drawing current** at balance, so it is more accurate than a voltmeter (it acts like an ideal voltmeter of infinite resistance).

| Use | Formula |
|---|---|
| Compare EMFs of two cells | ε₁/ε₂ = l₁/l₂ |
| Internal resistance of a cell | r = R (l₁ − l₂)/l₂ |

Sensitivity increases with **longer wire / smaller potential gradient**.

**Ammeter and voltmeter:** ammeter has **low** resistance and is put in **series**; voltmeter has **high** resistance and is put in **parallel**. An ideal ammeter has zero resistance; an ideal voltmeter infinite. (Conversion of a galvanometer: see [Magnetism, EMI and AC](/interview/bpsc-tre/class-9-10-science/physics/magnetism-emi-and-ac).)

## 13. Heating effect and electric power

**Joule's law of heating:** H = I²Rt (joules). Energy delivered by a source = VIt.

<div class="formula">

| Quantity | Formula |
|---|---|
| Heat produced | H = I²Rt = V²t/R = VIt |
| Power | P = VI = I²R = V²/R |
| Unit of power | watt (W) = J/s; 1 horsepower (hp) = 746 W |
| Commercial unit of energy | 1 kWh = 1 "unit" = 3.6 × 10⁶ J |

</div>

**Worked numerical 19.** 2 A through 10 Ω for 1 minute: H = 2² × 10 × 60 = **2400 J**.

**Worked numerical 20.** A bulb is rated 100 W, 220 V. R = V²/P = 220² / 100 = 48400/100 = **484 Ω**; rated current I = 100/220 ≈ **0.45 A**. On 110 V it draws P = 110²/484 = **25 W** (power ∝ V², so half voltage gives one-fourth power).

**Worked numerical 21.** A 1500 W heater runs 2 hours a day for 30 days. Energy = 1.5 kW × 60 h = **90 kWh (units)**. At ₹6 per unit, bill = **₹540**.

**Worked numerical 22.** 100 W and 60 W bulbs (both 220 V) in **series**: R₁₀₀ = 484 Ω, R₆₀ = 806.7 Ω. Same current flows, so P = I²R is larger in the higher R — the **60 W bulb glows brighter**. In **parallel** the 100 W bulb glows brighter.

Applications of heating: electric iron, heater, toaster, kettle, bulb filament (tungsten in inert gas such as argon or nitrogen to prevent oxidation), **fuse**. LED and CFL waste less energy as heat than filament bulbs.

## 14. Household electricity and safety

| Point | Fact (India) |
|---|---|
| Supply | AC, nominally 220 V (official standard now 230 V), frequency **50 Hz** |
| Live wire | Red insulation (new code: brown) |
| Neutral wire | Black (new code: light blue) |
| Earth wire | Green (new code: green with yellow) — connected to a metal plate buried deep in moist earth |
| Fuse / MCB | Always in the **live** wire; switches too are in the live wire |
| Circuits | Lighting circuit about 5 A; power circuit (geyser, AC, cooler) 15 A |
| Short circuit | Live touches neutral; R ≈ 0, current very high; fuse blows |
| Overloading | Too many appliances on one socket; current exceeds rating |
| Earthing | Protects the user if the live wire touches a metal body; the leak goes to earth and the fuse blows |

MCB = miniature circuit breaker (resettable switch); ELCB/RCCB detects current leaking to earth and trips in milliseconds.

## 15. Cells and batteries — chemical and solar sources

| Cell | Electrodes / material | EMF (approx.) | Rechargeable? |
|---|---|---|---|
| Voltaic (simple) cell | Zn and Cu in dilute H₂SO₄ (Volta, 1800) | ≈ 1.0 V | No (polarisation) |
| Daniell cell | Zn in ZnSO₄, Cu in CuSO₄ | 1.1 V | No |
| Leclanché / dry cell | Zinc can (−), carbon rod (+) in MnO₂ + NH₄Cl paste | 1.5 V | No (primary) |
| Mercury cell | Zn–HgO | 1.35 V | No (watches, hearing aids) |
| Lead–acid accumulator | Pb and PbO₂ in H₂SO₄ | 2 V per cell (car battery 6 cells = 12 V) | Yes (secondary) |
| Nickel–cadmium | Ni(OH)₂ / Cd | 1.2 V | Yes |
| Lithium-ion | Li compounds | ≈ 3.7 V | Yes (phones, EVs) |
| Fuel cell | H₂ + O₂ (Apollo missions) | ≈ 1.2 V | Fuel fed continuously |
| **Solar (photovoltaic) cell** | Silicon p-n junction | ≈ 0.5–0.6 V per cell | Converts light directly to electricity |

> **PYQ:** TRE 2.0 (2023) asked: "Solar energy is converted into electric energy through (A) voltaic cells (B) dry cells (C) photovoltaic cells." **Official answer: (C) photovoltaic cells.** Voltaic and dry cells turn **chemical** energy into electricity. A solar cell works by the photovoltaic effect in a p-n junction (see [Electronics](/interview/bpsc-tre/class-9-10-science/physics/electronics-and-communication)).

Energy conversions to remember: cell/battery — chemical → electrical; solar cell — light → electrical; generator — mechanical → electrical; motor — electrical → mechanical; bulb — electrical → light + heat; loudspeaker — electrical → sound; microphone — sound → electrical; thermocouple — heat → electrical (Seebeck effect).

## 16. Lightning and atmospheric electricity

- Inside a thundercloud, ice particles and water droplets collide and separate charge: usually the **top becomes positive** and the **bottom negative**. The negative base induces positive charge on the ground below.
- When the potential difference reaches crores of volts (≈ 10⁸–10⁹ V), the air breaks down and a giant **spark discharge** — lightning — occurs. A typical stroke carries about **30,000 A** (can exceed 1 lakh A) for microseconds and heats the air channel to about **30,000 K** — hotter than the Sun's surface (≈ 5800 K).
- The sudden expansion of heated air makes **thunder**. We see the flash first because light (3 × 10⁸ m/s) is far faster than sound (≈ 340 m/s); distance ≈ 340 × time gap (seconds) metres.
- **Benjamin Franklin's kite experiment (1752)** showed lightning is electricity; he invented the **lightning conductor** — a pointed copper rod on top of a building connected by a thick strip to a plate buried in the earth, which leaks charge safely to ground.

> **PYQ:** TRE 2.0 (2023) asked: "Lightning can even burn a tree because it contains tremendous amount of (A) heat energy (B) electric energy (C) nuclear energy." **Official answer: (B) electric energy.** The heat that burns the tree comes from the huge electric energy of the discharge (H = VIt). Option (A) is the tempting trap.

**Safety (very relevant to Bihar, among the most lightning-affected states; the state runs the "Indra Vajra" alert app):** do not shelter under an isolated tree; stay away from poles, water and open fields; inside a house or a closed car (Faraday cage) is safe; in the open, crouch low on your feet, do not lie flat; unplug appliances.

For GS-level revision of the same ideas, see [Electricity, magnetism and modern physics (BPSC CCE)](/interview/bpsc-2027/science/electricity-magnetism-and-modern-physics).

## 17. Units and discoveries table

| Quantity | SI unit | Equivalent |
|---|---|---|
| Charge | coulomb (C) | A·s |
| Current | ampere (A) | base unit |
| Potential, EMF | volt (V) | J/C = W/A |
| Electric field | N/C | V/m |
| Resistance | ohm (Ω) | V/A |
| Resistivity | Ω·m | |
| Conductance | siemens (S) | Ω⁻¹ (mho) |
| Capacitance | farad (F) | C/V |
| Electric dipole moment | C·m | |
| Electric flux | N m² C⁻¹ | V·m |
| Power | watt (W) | J/s = VA (for DC) |
| Energy | joule; kWh | 1 kWh = 3.6 MJ |

| Law / device | Person | Year |
|---|---|---|
| Coulomb's law (torsion balance) | Charles-Augustin de Coulomb | 1785 |
| Voltaic pile (first battery) | Alessandro Volta | 1800 |
| Ohm's law | Georg Simon Ohm | 1827 |
| Joule heating | James Prescott Joule | 1841 |
| Kirchhoff's laws | Gustav Kirchhoff | 1845 |
| Wheatstone bridge (popularised) | Charles Wheatstone (devised by S. H. Christie) | 1843 |
| Charge of electron (oil drop) | Robert Millikan | 1909 |
| Superconductivity | Heike Kamerlingh Onnes | 1911 |

## Traps and exceptions

- **Resistance on heating:** metals ↑, semiconductors and insulators ↓, electrolytes ↓, alloys nearly constant. Do not apply "resistance increases with temperature" to semiconductors.
- **Resistivity vs resistance:** stretching or cutting changes R, never ρ.
- **Series vs parallel:** resistors in series add; **capacitors** in parallel add.
- **Lightning burns by electric energy** (official TRE answer), not "heat energy" as the source.
- **Solar cell = photovoltaic**, not voltaic. A voltaic cell is chemical.
- **Kirchhoff:** junction law = charge conservation; loop law = energy conservation. Do not swap.
- Inside a charged conductor **E = 0 but V ≠ 0** (constant).
- **Drift velocity is tiny** (≈ 10⁻⁴ m/s); the "signal" (field) is fast. Bulbs glow instantly for that reason.
- Fuse goes in the **live** wire, not the neutral.
- In series, the **lower-wattage** bulb glows brighter; in parallel, the higher-wattage one.
- EMF is measured in volts — it is not a force.
- Ammeter: low R, series. Voltmeter: high R, parallel. A potentiometer is better than a voltmeter because it draws **no** current at balance.
- 1 kWh = 3.6 × 10⁶ J, not 3.6 × 10³ J.
- Electric field lines never form closed loops (magnetic ones do) and never cross.

## Quick revision

1. e = 1.6 × 10⁻¹⁹ C; 1 C = 6.25 × 10¹⁸ electrons.
2. k = 9 × 10⁹ N m² C⁻²; ε₀ = 8.85 × 10⁻¹² C² N⁻¹ m⁻².
3. Force in a medium = vacuum force / K; water K ≈ 80.
4. Field unit N/C = V/m; potential unit volt = J/C.
5. Gauss: flux = q/ε₀; charge at cube centre gives q/6ε₀ per face.
6. Field inside a conductor = 0; charge lies on the outer surface, most at sharp points.
7. Dipole in uniform field: zero force, torque pE sin θ.
8. Parallel-plate C = Kε₀A/d; energy ½CV².
9. I = neAv_d; drift speed ≈ 10⁻⁴ m/s.
10. R = ρL/A; stretching n times → R × n².
11. Metals: R rises with temperature; semiconductors: R falls (TRE 2.0).
12. Superconductivity: Hg at 4.2 K, Onnes 1911.
13. Nichrome — heater; tungsten — filament; tin–lead — fuse; manganin — standard resistor.
14. Terminal voltage V = ε − Ir; max power when R = r.
15. KCL — charge conservation; KVL — energy conservation.
16. Wheatstone balance P/Q = R/S; metre bridge X/R = l/(100 − l).
17. Potentiometer draws no current at balance.
18. H = I²Rt; P = VI = V²/R; 1 kWh = 3.6 MJ; 1 hp = 746 W.
19. India: 220–230 V, 50 Hz AC; fuse in live wire; earth wire green.
20. Dry cell 1.5 V; lead–acid 2 V/cell; Daniell 1.1 V; Li-ion ≈ 3.7 V.
21. Solar cell = photovoltaic (TRE 2.0).
22. Lightning burns trees because of huge electric energy (TRE 2.0).
23. Lightning conductor — Franklin; a car is a Faraday cage.

## Practice with answers

1. SI unit of electric field? — **N/C or V/m** (force per unit charge = potential gradient).
2. Force between two charges if the distance is tripled? — **1/9 of the original** (inverse square).
3. Flux through a closed surface enclosing no charge? — **Zero** (Gauss's law).
4. Equivalent of 4 μF and 4 μF in series? — **2 μF** (C₁C₂/(C₁ + C₂)).
5. Energy stored in a 10 μF capacitor at 200 V? — **0.2 J** (½ × 10⁻⁵ × 4 × 10⁴).
6. What happens to the resistance of copper when heated? — **Increases** (more ionic vibration, more collisions).
7. What happens to the resistance of silicon when heated? — **Decreases** (more carriers; TRE 2.0 official B).
8. Resistance of a 10 Ω wire cut into two equal halves joined in parallel? — **2.5 Ω** (5 Ω ∥ 5 Ω).
9. Kirchhoff's junction law follows from? — **Conservation of charge**.
10. Metre bridge balances at 60 cm with 20 Ω in the right gap; unknown X in left gap? — **30 Ω** (20 × 60/40).
11. Resistance of a 60 W, 240 V bulb? — **960 Ω** (240²/60 = 57600/60).
12. A 2 kW geyser runs 1 hour daily for 30 days; units consumed? — **60 kWh**.
13. Element of an electric heater is made of? — **Nichrome** (high resistivity, high melting point, no oxidation).
14. Which wire carries the fuse? — **Live wire**.
15. Device that converts sunlight directly into electricity? — **Photovoltaic (solar) cell** (TRE 2.0 official C).
16. Lightning can burn a tree because it carries enormous? — **Electric energy** (TRE 2.0 official B).
17. Cell with EMF 6 V and internal resistance 0.5 Ω connected to 2.5 Ω; current? — **2 A** (6/3).
18. Why is a person in a car safe from lightning? — **The metal body acts as a Faraday cage** (field inside a closed conductor is zero).
19. Drift velocity of electrons in a wire is of the order of? — **10⁻⁴ m/s**.
20. Two bulbs 40 W and 100 W in series on 220 V; which glows brighter? — **40 W** (higher resistance, same current, larger I²R).
