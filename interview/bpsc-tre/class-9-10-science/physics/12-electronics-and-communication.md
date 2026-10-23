---
title: Electronics and Communication
part: Electronics
summary: Band theory, intrinsic and extrinsic semiconductors, Fermi level, p-n junction, rectifiers with efficiency and ripple, Zener, LED, photodiode and solar cell, transistor, logic gates, and communication — modulation, propagation and antennas — class 12 to B.Sc., the area where TRE 1.0 asked six questions.
---

This chapter is NCERT class 12 "Semiconductor Electronics" plus the old class 12 "Communication Systems" chapter and B.Sc. electronics. It is a **high-yield** area: TRE 1.0 asked six questions in a row here (donor impurity, Fermi level, half-wave efficiency, TV modulation, reverse saturation current, photodiode cut-off wavelength) and TRE 2.0 asked how a semiconductor's resistance changes on heating.

> **In simple words:** In a solid, electron energies form bands. If the top band is partly empty, the solid conducts (metal). If a small gap separates the full band from the empty one, a little heat or light can push electrons across — a semiconductor. Adding tiny impurities gives extra electrons (n-type) or "holes" (p-type). Joining p and n makes a diode, which lets current flow one way — the heart of rectifiers, LEDs, solar cells and transistors.

## 1. Energy bands: conductors, semiconductors, insulators

In an isolated atom electrons have sharp levels; in a crystal of ≈ 10²³ atoms these spread into **bands**. The highest filled band is the **valence band (VB)**; the next band above is the **conduction band (CB)**; the gap between them is the **forbidden energy gap Eg**.

| Type | Band picture | Eg | Examples |
|---|---|---|---|
| Conductor | CB partly filled or VB and CB overlap | 0 | Cu, Al, Ag |
| Semiconductor | Small gap | < ≈ 3 eV | Si ≈ 1.1 eV, Ge ≈ 0.67 eV (≈ 0.7), GaAs ≈ 1.43 eV |
| Insulator | Large gap | > ≈ 3 eV | Diamond ≈ 5.5 eV (5.4–5.5 in books), glass, wood |

- **Resistivity:** conductors 10⁻² – 10⁻⁸ Ω·m; semiconductors 10⁻⁵ – 10⁶ Ω·m; insulators 10¹¹ – 10¹⁹ Ω·m (NCERT ranges).
- At **0 K** a pure semiconductor behaves as an **insulator** (no electron in CB).
- **On heating, a semiconductor's resistance decreases** — more electrons cross the gap, so carrier concentration rises fast (negative temperature coefficient). In a metal the number of carriers is fixed and collisions increase, so resistance rises.

> **PYQ:** TRE 2.0 (2023) asked: "On heating, the resistance of a semiconductor (A) increases (B) decreases (C) remains same." **Official answer: (B) decreases.**

## 2. Intrinsic and extrinsic semiconductors

**Intrinsic** = pure Si or Ge (group 14 / IV, four valence electrons, covalent diamond-type lattice). Heat breaks some bonds: each freed electron leaves a **hole** (a vacancy that behaves like a +e charge). So **nₑ = nₕ = nᵢ**. Holes move in the opposite direction to electrons; total current = electron current + hole current.

**Extrinsic (doped)** = a tiny amount of impurity added (≈ 1 atom per 10⁶–10⁸ Si atoms) — **doping** raises conductivity enormously.

| | n-type | p-type |
|---|---|---|
| Dopant | **Pentavalent** — group 15 (old **group V**): P, As, Sb | **Trivalent** — group 13 (old **group III**): B, Al, Ga, In |
| Name of impurity | **Donor** (donates an electron) | **Acceptor** (accepts an electron, creates a hole) |
| Majority carriers | Electrons | Holes |
| Minority carriers | Holes | Electrons |
| Impurity level | Donor level just **below CB** (≈ 0.01 eV in Ge, ≈ 0.05 eV in Si) | Acceptor level just **above VB** |
| Net charge of crystal | **Neutral** | **Neutral** |

> **PYQ:** TRE 1.0 (2023) asked: "Donor-type impurities are the materials of (A) V group of periodic table (B) IV group (C) III group." Worked answer: **(A) group V** (pentavalent: P, As, Sb). (No official key for TRE 1.0 in our files.)

<div class="formula">

| Relation | Formula |
|---|---|
| Mass-action law (equilibrium) | nₑ × nₕ = nᵢ² |
| n-type (donor density N_D ≫ nᵢ) | nₑ ≈ N_D, nₕ = nᵢ²/N_D |
| Conductivity | σ = e(nₑμₑ + nₕμₕ) |

</div>

**Worked numerical 1 (NCERT type).** Pure Si has nᵢ = 1.5 × 10¹⁶ m⁻³. It is doped with arsenic at 5 × 10²² m⁻³. Then nₑ ≈ **5 × 10²² m⁻³** and nₕ = (1.5 × 10¹⁶)² / (5 × 10²²) = 2.25 × 10³² / 5 × 10²² = **4.5 × 10⁹ m⁻³**. The material is n-type.

> **Memory trick:** "**P**hosphorus → **N**egative carriers (n-type); **B**oron → **P**ositive holes (p-type)": **F**ive gives a **F**ree electron, **T**hree leaves a hole (**T**rouble).

## 3. Fermi level

The **Fermi level E_F** is the energy at which the probability of an electron state being occupied is exactly **½** (Fermi–Dirac distribution). At 0 K in a metal it is the highest filled level.

| Material | Position of Fermi level |
|---|---|
| Metal | Inside the partly filled band |
| Intrinsic semiconductor | **Middle of the forbidden gap** (exactly at the middle if electron and hole effective masses are equal; very slightly shifted otherwise) |
| n-type | Shifts **up, toward the conduction band** — lies just **below the bottom of the CB** (above the donor level at low T) |
| p-type | Shifts **down, toward the valence band** — just **above the top of the VB** |
| p-n junction in equilibrium | Fermi level is the **same (flat)** throughout |

- Increasing doping pushes E_F closer to the band edge; increasing **temperature** moves it back toward the **middle** (the material becomes more intrinsic).

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="20" y="25" width="110" height="30"/>
<rect x="20" y="135" width="110" height="30"/>
<rect x="155" y="25" width="110" height="30"/>
<rect x="155" y="135" width="110" height="30"/>
<rect x="290" y="25" width="110" height="30"/>
<rect x="290" y="135" width="110" height="30"/>
<text x="55" y="44" fill="currentColor" stroke="none">CB</text>
<text x="55" y="154" fill="currentColor" stroke="none">VB</text>
<text x="190" y="44" fill="currentColor" stroke="none">CB</text>
<text x="190" y="154" fill="currentColor" stroke="none">VB</text>
<text x="325" y="44" fill="currentColor" stroke="none">CB</text>
<text x="325" y="154" fill="currentColor" stroke="none">VB</text>
<line x1="20" y1="95" x2="130" y2="95" stroke-dasharray="6 3"/>
<text x="40" y="90" fill="currentColor" stroke="none">E_F (middle)</text>
<line x1="165" y1="63" x2="180" y2="63"/>
<line x1="190" y1="63" x2="205" y2="63"/>
<line x1="215" y1="63" x2="230" y2="63"/>
<line x1="240" y1="63" x2="255" y2="63"/>
<line x1="155" y1="74" x2="265" y2="74" stroke-dasharray="6 3"/>
<text x="168" y="90" fill="currentColor" stroke="none">E_F (near CB)</text>
<line x1="300" y1="127" x2="315" y2="127"/>
<line x1="325" y1="127" x2="340" y2="127"/>
<line x1="350" y1="127" x2="365" y2="127"/>
<line x1="375" y1="127" x2="390" y2="127"/>
<line x1="290" y1="116" x2="400" y2="116" stroke-dasharray="6 3"/>
<text x="303" y="110" fill="currentColor" stroke="none">E_F (near VB)</text>
<text x="40" y="185" fill="currentColor" stroke="none">Intrinsic</text>
<text x="160" y="185" fill="currentColor" stroke="none">n-type (donor level)</text>
<text x="290" y="185" fill="currentColor" stroke="none">p-type (acceptor level)</text>
</svg>

> **PYQ:** TRE 1.0 (2023) asked: "In an n-type semiconductor, the Fermi level lies (A) above the top of the valence band (B) below the bottom of the conduction band (C) in the middle of the forbidden gap." Intended worked answer: **(B) just below the bottom of the conduction band.** Note a catch: since the Fermi level of n-type is inside the gap near the CB, statement (A) "above the top of the valence band" is also literally true, so a strict reader could argue for (D) "more than one of the above". Textbooks phrase the n-type position as "near/below the conduction band", so (B) is the expected answer; no official key is available to settle it.

## 4. The p-n junction diode

When p and n regions are formed in one crystal, electrons diffuse from n to p and holes from p to n. They recombine near the junction, leaving behind **immobile ions** (negative acceptor ions on the p-side, positive donor ions on the n-side). This thin region (≈ 1 μm) with no free carriers is the **depletion layer**; its ions create an electric field (n → p) and a **potential barrier**: **≈ 0.7 V for Si, ≈ 0.3 V for Ge**. At equilibrium, diffusion current = drift current.

| Bias | Connection | Barrier and depletion width | Current |
|---|---|---|---|
| **Forward** | p to +, n to − | Barrier **lowered**, depletion layer **narrows** | Large (mA), rises sharply after the **knee / cut-in voltage** (≈ 0.7 V Si, 0.3 V Ge) |
| **Reverse** | p to −, n to + | Barrier **raised**, depletion layer **widens** | Tiny, nearly constant **reverse saturation current** I₀ (μA for Ge, nA for Si) due to minority carriers, until **breakdown** |

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<rect x="15" y="50" width="160" height="70"/>
<line x1="80" y1="50" x2="80" y2="120" stroke-dasharray="3 3"/>
<line x1="110" y1="50" x2="110" y2="120" stroke-dasharray="3 3"/>
<line x1="95" y1="50" x2="95" y2="120"/>
<text x="35" y="90" fill="currentColor" stroke="none">p  + +</text>
<text x="125" y="90" fill="currentColor" stroke="none">n  − −</text>
<text x="83" y="75" fill="currentColor" stroke="none">−</text>
<text x="83" y="105" fill="currentColor" stroke="none">−</text>
<text x="100" y="75" fill="currentColor" stroke="none">+</text>
<text x="100" y="105" fill="currentColor" stroke="none">+</text>
<text x="60" y="40" fill="currentColor" stroke="none">depletion layer</text>
<text x="20" y="140" fill="currentColor" stroke="none">holes (p), electrons (n);</text>
<text x="20" y="155" fill="currentColor" stroke="none">fixed ions in the middle</text>
<line x1="210" y1="120" x2="410" y2="120"/>
<line x1="310" y1="15" x2="310" y2="190"/>
<text x="385" y="135" fill="currentColor" stroke="none">V</text>
<text x="316" y="22" fill="currentColor" stroke="none">I (mA)</text>
<path d="M310 120 C 330 119, 340 117, 345 112 C 352 100, 356 60, 360 20"/>
<text x="350" y="135" fill="currentColor" stroke="none">0.7 V</text>
<path d="M310 120 L 240 124 L 232 126 C 228 140, 226 165, 224 188"/>
<text x="250" y="140" fill="currentColor" stroke="none">I₀ (μA)</text>
<text x="210" y="105" fill="currentColor" stroke="none">breakdown</text>
<text x="362" y="40" fill="currentColor" stroke="none">forward</text>
<text x="240" y="175" fill="currentColor" stroke="none">reverse</text>
</svg>

- Diode current (B.Sc.): I = I₀ (e^(eV/ηkT) − 1); η = 1 for Ge, ≈ 2 for Si.
- **Reverse saturation current roughly doubles for every 10 °C rise** in temperature (about 7% per °C). It depends on minority carriers, which are thermally generated.

> **PYQ:** TRE 1.0 (2023) asked: "For every 10 °C increase in temperature, the reverse saturation current of a p-n junction will be increased by (A) 10 times (B) 2 times (C) 4 times." Worked answer: **(B) 2 times.**

**Worked numerical 2.** I₀ = 5 μA at 25 °C. At 55 °C (three 10 °C steps): 5 × 2³ = **40 μA**.

**Breakdown:** **Zener breakdown** — heavily doped, very thin junction, strong field pulls electrons out of bonds (below ≈ 5–6 V); **avalanche breakdown** — lightly doped, carriers gain energy and knock out more carriers (higher voltages).

## 5. Rectifiers

A **rectifier** converts AC into (pulsating) DC using diodes.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<line x1="40" y1="55" x2="400" y2="55" stroke-dasharray="3 3"/>
<path d="M40 55 C 60 5, 100 5, 120 55 C 140 105, 180 105, 200 55 C 220 5, 260 5, 280 55 C 300 105, 340 105, 360 55"/>
<text x="5" y="59" fill="currentColor" stroke="none">AC in</text>
<line x1="40" y1="170" x2="400" y2="170"/>
<path d="M40 170 C 60 120, 100 120, 120 170 L 200 170 C 220 120, 260 120, 280 170 L 360 170"/>
<text x="5" y="174" fill="currentColor" stroke="none">HW</text>
<text x="210" y="195" fill="currentColor" stroke="none">half-wave output: only positive halves</text>
<path d="M120 170 C 140 120, 180 120, 200 170" stroke-dasharray="3 3"/>
<text x="130" y="130" fill="currentColor" stroke="none">full-wave adds these</text>
</svg>

<div class="formula">

| Quantity | Half-wave | Full-wave (centre-tap or bridge) |
|---|---|---|
| Diodes | 1 | 2 (centre-tap) or 4 (bridge) |
| DC (average) current | I_m/π | 2I_m/π |
| rms current | I_m/2 | I_m/√2 |
| Maximum efficiency | **40.6%** (= 4/π²) | **81.2%** (= 8/π², twice HW) |
| Ripple factor | **1.21** | **0.48** |
| Ripple frequency | f (50 Hz) | **2f (100 Hz)** |
| Form factor | 1.57 | 1.11 |
| Peak inverse voltage (PIV) | V_m | 2V_m (centre-tap), V_m (bridge) |

</div>

Where these come from: efficiency η = (I_dc)²R_L / (I_rms)²(R_L + r_f); with r_f ≪ R_L, half-wave η = (I_m/π)²/(I_m/2)² = 4/π² ≈ 0.405 → quoted as **40.6%**. Ripple factor = √((I_rms/I_dc)² − 1) = √((π/2)² − 1) = √1.467 ≈ **1.21** (HW); for FW √((π/2√2)² − 1) = √0.234 ≈ **0.48**.

> **PYQ:** TRE 1.0 (2023) asked: "The maximum efficiency of a half-wave rectifier is (A) 33.3% (B) 40.6% (C) 66.6%." Worked answer: **(B) 40.6%.**

**Worked numerical 3.** Peak voltage V_m = 20 V. Half-wave DC output V_dc = 20/π ≈ **6.37 V**; full-wave V_dc = 40/π ≈ **12.73 V**.

**Filters:** a capacitor across the load (or an LC / π-filter) smooths the output; a **Zener diode** then regulates it.

## 6. Special-purpose diodes

| Device | Bias | Principle / use |
|---|---|---|
| **Zener diode** | Reverse, in breakdown | Heavily doped; voltage stays constant → **voltage regulator** |
| **LED** | Forward | Electron–hole recombination emits light; colour set by Eg (GaAs — IR, GaAsP — red/yellow, GaN — blue). Blue LED: Akasaki, Amano, Nakamura, Nobel 2014 |
| **Photodiode** | **Reverse** | Light creates electron–hole pairs; reverse current ∝ light intensity → light detector |
| **Solar cell** | No external bias (works in 4th quadrant of I–V) | **Photovoltaic effect**: light → EMF (≈ 0.5–0.6 V per Si cell); Si (Eg ≈ 1.1 eV) suits the solar spectrum |
| Varactor | Reverse | Depletion width acts as a voltage-variable capacitor (tuning) |

For a light-sensitive device, a photon is detected only if hν ≥ Eg, so the **cut-off (longest) wavelength** is:

<div class="formula">

| Relation | Formula |
|---|---|
| Cut-off wavelength | λ_c = hc/Eg = 1240/Eg (nm, Eg in eV) |
| LED colour | λ ≈ 1240/Eg |

</div>

> **PYQ:** TRE 1.0 (2023) asked: band gaps of Si and Ge photodiodes are 1.1 eV and 0.67 eV; their cut-off wavelengths? Worked answer: Si: 1240/1.1 = **1127.27 nm**; Ge: 1240/0.67 = **1850.75 nm** → option **(A) 1127.27 nm, 1850.75 nm**. (Both lie in the infrared.)

**Worked numerical 4.** An LED has Eg = 1.9 eV. λ = 1240/1.9 ≈ **653 nm — red**.

**Worked numerical 5 (Zener regulator).** Input 15 V, Zener V_Z = 10 V, series resistor 500 Ω, load 2 kΩ. Current through series resistor = (15 − 10)/500 = **10 mA**; load current = 10 V/2000 Ω = **5 mA**; Zener current = 10 − 5 = **5 mA**.

## 7. Transistor (BJT)

Invented at **Bell Labs in 1947** by **Bardeen, Brattain and Shockley** (Nobel 1956). Two types: **n-p-n** and **p-n-p**. Three regions:

| Region | Doping | Size |
|---|---|---|
| Emitter | **Heavily** doped (supplies carriers) | Moderate |
| Base | **Lightly** doped | **Very thin** |
| Collector | Moderately doped | **Largest** (dissipates heat) |

For normal (active) operation: **emitter–base junction forward biased, collector–base junction reverse biased**.

<div class="formula">

| Relation | Formula |
|---|---|
| Currents | I_E = I_B + I_C |
| Common-base current gain | α = I_C/I_E (slightly less than 1, ≈ 0.95–0.99) |
| Common-emitter current gain | β = I_C/I_B (≈ 20–500) |
| Link | β = α/(1 − α) ; α = β/(1 + β) |
| CE voltage gain | A_v = β × (R_L / R_in) |

</div>

**Worked numerical 6.** α = 0.98 → β = 0.98/0.02 = **49**.

**Worked numerical 7.** β = 100, I_B = 20 μA → I_C = **2 mA**, I_E = **2.02 mA**. With R_L = 2 kΩ and R_in = 1 kΩ, voltage gain = 100 × 2 = **200**.

Uses: **amplifier** (CE amplifier gives a **180° phase reversal**), **switch** (cut-off ↔ saturation: basis of digital circuits), **oscillator** (amplifier + positive feedback). The **integrated circuit (IC)** was made by **Jack Kilby (1958, Nobel 2000)** and Robert Noyce (silicon planar IC, 1959). FETs and MOSFETs dominate modern chips.

## 8. Logic gates

Digital circuits use two levels: 1 (high) and 0 (low).

| A | B | AND (A·B) | OR (A+B) | NAND | NOR | XOR |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 |

- **NOT** gate: output = Ā (inverter, one input).
- **NAND and NOR are universal gates** — any gate can be built from them alone. (NAND with both inputs joined = NOT.)
- **De Morgan's theorems:** (A + B)‾ = Ā · B̄ and (A · B)‾ = Ā + B̄.
- XOR gives 1 when inputs **differ**; XNOR when they are the same.

> **Memory trick:** AND = "all 1 → 1"; OR = "any 1 → 1"; NAND/NOR are just the opposite rows.

## 9. Communication systems

**Basic blocks:** information source → **transmitter** (transducer, modulator, amplifier, antenna) → **channel** (wire, free space, optical fibre) → **receiver** (antenna, amplifier, demodulator) → user. **Noise** enters mainly in the channel.

### Why modulate?

A message (audio 20 Hz – 20 kHz, the "baseband") cannot be sent directly through space because:

1. **Antenna size:** an antenna must be about **λ/4** long. For a 15 kHz signal, λ = 3 × 10⁸/1.5 × 10⁴ = 20 km → antenna 5 km. Impossible.
2. **Effective power radiated** by an antenna ∝ (l/λ)² — low frequencies radiate poorly.
3. **Mixing:** all stations' audio would overlap; giving each a different carrier separates them.

So the message rides on a **high-frequency carrier**.

**Worked numerical 8.** Antenna for a 1 MHz carrier: λ = 300 m → λ/4 = **75 m**. For 100 MHz (FM): λ = 3 m → **0.75 m**.

### Types of modulation

| Type | What is varied | Notes |
|---|---|---|
| **Amplitude modulation (AM)** | Amplitude of carrier | Simple, cheap; noise affects amplitude; bandwidth = 2f_m; medium-wave radio (≈ 540–1600 kHz) |
| **Frequency modulation (FM)** | Frequency of carrier | Better noise immunity and fidelity; larger bandwidth; FM radio 88–108 MHz |
| **Phase modulation (PM)** | Phase of carrier | Closely related to FM |
| **Pulse modulation** | A property of a pulse train: PAM (amplitude), PWM/PDM (width), PPM (position) | **PCM** (pulse code modulation) is the basis of digital telephony |
| Digital (ASK, FSK, PSK, QAM) | Carrier switched by bits | Mobile, Wi-Fi, DTH |

**Classic (analogue) TV** sends the **picture (video) by AM** (vestigial side-band, VSB) and the **sound by FM**.

> **PYQ:** TRE 1.0 (2023) asked which of (i) AM (ii) FM (iii) PM (iv) pulse modulation are used for telecasting TV programmes. Worked answer: **(C) (i) and (ii)** — AM for picture, FM for sound.

<div class="formula">

| AM relations | Formula |
|---|---|
| Modulation index | m = A_m / A_c (keep m ≤ 1 to avoid distortion) |
| Side frequencies | f_c + f_m (USB) and f_c − f_m (LSB) |
| Bandwidth | 2f_m |
| Total power | P_t = P_c (1 + m²/2) |
| FM bandwidth (Carson's rule) | ≈ 2(Δf + f_m) |
| Sampling (Nyquist) | f_s ≥ 2 f_max |

</div>

**Worked numerical 9.** Carrier 10 V peak at 1 MHz; message 5 V peak at 5 kHz. m = 5/10 = **0.5**; side frequencies **1005 kHz and 995 kHz**; bandwidth **10 kHz**. For m = 1, P_t = 1.5 P_c, so the sidebands carry only one-third of the total power.

**Worked numerical 10.** FM with frequency deviation 75 kHz and audio 15 kHz: bandwidth ≈ 2(75 + 15) = **180 kHz** (FM channels are spaced 200 kHz apart).

**Worked numerical 11.** Voice up to 4 kHz must be sampled at least at **8 kHz** (telephone PCM uses 8000 samples/s).

### Propagation of radio waves

| Mode | Frequency range | How | Used for |
|---|---|---|---|
| **Ground (surface) wave** | Up to ≈ 2 MHz | Travels along the earth's surface; attenuation grows with frequency | MW/LW AM broadcast, ship navigation |
| **Sky wave** | ≈ 2–30 MHz (HF, short wave) | **Reflected (refracted back) by the ionosphere** (mainly F₂ layer) | Long-distance short-wave radio |
| **Space wave (line of sight)** | Above ≈ 30–40 MHz (VHF, UHF, microwaves) | Straight line from antenna to antenna, or to satellites — passes through the ionosphere | **TV, FM, mobile, radar, satellite** |

- Ionosphere layers: **D, E, F₁, F₂** (≈ 65–400 km); D absorbs; F₂ reflects best and exists day and night. Maximum frequency reflected for vertical incidence (critical frequency) f_c ≈ 9√N_max.
- **Line-of-sight range** of an antenna of height h: d = √(2Rh) (R = 6.4 × 10⁶ m). Two antennas: d = √(2Rh_T) + √(2Rh_R).

**Worked numerical 12.** A TV tower 80 m high: d = √(2 × 6.4 × 10⁶ × 80) = √(1.024 × 10⁹) ≈ 3.2 × 10⁴ m = **32 km**; area covered = πd² ≈ 3.14 × (32)² ≈ **3215 km²**.

| Service | Band (NCERT values) |
|---|---|
| AM broadcast (MW) | 540 – 1600 kHz |
| FM broadcast | 88 – 108 MHz |
| Television | 54 – 890 MHz |
| Cellular mobile | 896 – 901 MHz (uplink), 840 – 935 MHz (downlink) |
| Satellite communication | 5.925 – 6.425 GHz (uplink), 3.7 – 4.2 GHz (downlink) |

**Optical fibre communication** works by **total internal reflection** — huge bandwidth, low loss, immune to electrical interference (see [Ray Optics](/interview/bpsc-tre/class-9-10-science/physics/ray-optics-and-optical-instruments)). **Geostationary satellites** (≈ 36,000 km, period 24 h) relay TV and communication; three satellites cover almost the whole earth (Arthur C. Clarke's idea).

For GS-level revision see [Electricity, magnetism and modern physics (BPSC CCE)](/interview/bpsc-2027/science/electricity-magnetism-and-modern-physics). The photoelectric basis of photodiodes is in [Modern Physics](/interview/bpsc-tre/class-9-10-science/physics/modern-physics-atoms-and-nuclei); resistance–temperature behaviour is compared in [Electrostatics and Current Electricity](/interview/bpsc-tre/class-9-10-science/physics/electrostatics-and-current-electricity).

## 10. Names and dates

| Item | Person / fact | Year |
|---|---|---|
| Point-contact transistor | Bardeen, Brattain (with Shockley — junction transistor) | 1947 (Nobel 1956) |
| Integrated circuit | Jack Kilby; Robert Noyce | 1958; 1959 |
| Vacuum diode / triode | J. A. Fleming / Lee De Forest | 1904 / 1906 |
| Radio across the Atlantic | G. Marconi | 1901 |
| Microwave/radio pioneer, crystal detector | Jagadish Chandra Bose | 1895 onward |
| Blue LED | Akasaki, Amano, Nakamura | Nobel 2014 |
| Geostationary satellite idea | Arthur C. Clarke | 1945 |

## Traps and exceptions

- **Donor = group V (pentavalent) → n-type; acceptor = group III (trivalent) → p-type.** Group IV (Si, Ge) is the host, not a dopant.
- **n-type and p-type materials are electrically neutral** — "n-type is negatively charged" is wrong.
- Fermi level: intrinsic — middle; n-type — near CB; p-type — near VB. In TRE 1.0 Q63, option (A) is also literally true; expected answer (B).
- Semiconductor resistance **decreases** on heating (TRE 2.0); at 0 K it is an insulator.
- Forward bias **narrows** the depletion layer; reverse bias **widens** it.
- Reverse saturation current is due to **minority** carriers and **doubles every 10 °C** (not 10 times).
- **Half-wave max efficiency 40.6%, full-wave 81.2%**; ripple 1.21 and 0.48. Do not mix ripple and efficiency numbers.
- Full-wave ripple frequency is **double** the supply frequency (100 Hz in India).
- **Photodiode works in reverse bias; LED in forward; solar cell needs no bias.**
- Cut-off wavelength = 1240/Eg — **smaller gap → longer** wavelength (Ge 1851 nm > Si 1127 nm).
- Transistor: emitter heavily doped, base thin and lightly doped, collector largest.
- β = α/(1 − α) — β is large because α is close to 1.
- NAND and NOR are universal; AND/OR/XOR are not.
- **TV: picture AM (VSB), sound FM.** FM radio 88–108 MHz; AM medium-wave 540–1600 kHz.
- Sky waves (2–30 MHz) are reflected by the ionosphere; TV and mobile signals (space waves) pass through it, so they need towers or satellites.

## Quick revision

1. Eg: Si ≈ 1.1 eV, Ge ≈ 0.67 eV, GaAs ≈ 1.43 eV, diamond ≈ 5.5 eV.
2. Semiconductor resistance decreases with temperature (TRE 2.0).
3. Intrinsic: nₑ = nₕ = nᵢ; mass-action nₑnₕ = nᵢ².
4. Donor = group V (P, As, Sb) → n-type (TRE 1.0).
5. Acceptor = group III (B, Al, Ga, In) → p-type.
6. Fermi level: occupation probability ½; intrinsic middle; n-type just below CB (TRE 1.0).
7. Barrier potential: Si 0.7 V, Ge 0.3 V; depletion layer ≈ 1 μm.
8. Forward bias narrows depletion layer; reverse widens it.
9. Reverse saturation current doubles per 10 °C (TRE 1.0).
10. Half-wave η_max = 40.6% (TRE 1.0); full-wave 81.2%.
11. Ripple factor 1.21 (HW), 0.48 (FW); FW ripple frequency 100 Hz.
12. Zener — voltage regulator in reverse breakdown.
13. LED forward; photodiode reverse; solar cell unbiased.
14. λ_cut-off = 1240/Eg nm: Si 1127 nm, Ge 1851 nm (TRE 1.0).
15. Transistor 1947, Bell Labs; IC — Kilby 1958.
16. I_E = I_B + I_C; β = α/(1 − α).
17. CE amplifier gives 180° phase shift.
18. NAND, NOR universal; XOR = 1 when inputs differ.
19. Antenna ≈ λ/4; modulation needed for antenna size, radiated power, separation.
20. AM bandwidth 2f_m; m = A_m/A_c ≤ 1; P_t = P_c(1 + m²/2).
21. TV: AM for picture, FM for sound (TRE 1.0).
22. Ground wave < 2 MHz; sky wave 2–30 MHz; space wave > 40 MHz.
23. Line-of-sight range d = √(2Rh); 80 m tower → 32 km.

## Practice with answers

1. Which impurity makes silicon n-type: boron or phosphorus? — **Phosphorus** (pentavalent donor).
2. Majority carriers in p-type? — **Holes**.
3. Net charge on an n-type crystal? — **Zero** (donor ions balance the extra electrons).
4. Where is the Fermi level in an intrinsic semiconductor? — **Near the middle of the forbidden gap**.
5. Fermi level of a p-type semiconductor lies near? — **Top of the valence band**.
6. What happens to a semiconductor's resistance at 0 K? — **Infinite (behaves as an insulator)**.
7. Barrier potential of a silicon junction? — **≈ 0.7 V**.
8. In reverse bias, what happens to the depletion layer? — **It widens**.
9. Reverse saturation current at 20 °C is 2 μA; at 40 °C? — **8 μA** (doubles twice).
10. Maximum efficiency of a full-wave rectifier? — **81.2%**.
11. Ripple frequency of a full-wave rectifier on 50 Hz mains? — **100 Hz**.
12. Diode used as a voltage regulator? — **Zener diode**.
13. Cut-off wavelength of a photodiode with Eg = 2 eV? — **620 nm** (1240/2).
14. In which bias does a photodiode work? — **Reverse bias**.
15. Transistor with β = 50; α = ? — **≈ 0.98** (50/51).
16. Which gates are universal? — **NAND and NOR**.
17. Output of a NOR gate when both inputs are 0? — **1**.
18. Minimum antenna length for a 300 MHz signal? — **0.25 m** (λ = 1 m, λ/4).
19. Which modulation is used for TV sound? — **FM** (picture uses AM).
20. Which layer reflects short-wave (sky-wave) signals? — **Ionosphere (mainly F₂ layer)**.
