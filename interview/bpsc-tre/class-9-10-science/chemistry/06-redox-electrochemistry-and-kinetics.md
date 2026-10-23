---
title: Redox, Electrochemistry, Kinetics and Photochemistry
part: Physical Chemistry
summary: Oxidation numbers and redox titrations, galvanic cells, electrode potentials, Nernst equation, conductance, electrolysis and batteries; rate laws, order, half-life, Arrhenius equation and catalysis; laws of photochemistry, quantum yield and luminescence.
---

This is the most numerical chapter of chemistry and TRE asks it heavily. It covers NCERT class 10 (oxidation–reduction, corrosion), class 11 ("Redox Reactions"), class 12 ("Electrochemistry", "Chemical Kinetics") and B.Sc. photochemistry. TRE 1.0 asked five kinetics questions (specific rate constant, 2A + B rate change, first-order half-life numerical, catalyst, primary cell) and four photochemistry questions; TRE 2.0 asked oxidation number of Cr and Fe in complexes, a zero-order reaction, KMnO₄–FeSO₄, and the strongest reducing agent from E° values.

> **In simple words:** Oxidation is loss of electrons, reduction is gain ("OIL RIG"). A cell turns a redox reaction into electricity; electrolysis uses electricity to force a redox reaction. Kinetics is about speed: how the rate depends on concentration (order) and temperature (Arrhenius). Photochemistry is chemistry started by light.

## 1. Oxidation and reduction

| Oxidation | Reduction |
|---|---|
| Addition of oxygen / electronegative element | Removal of oxygen / electronegative element |
| Removal of hydrogen / electropositive element | Addition of hydrogen / electropositive element |
| **Loss of electrons** | **Gain of electrons** |
| **Increase in oxidation number** | **Decrease in oxidation number** |

- **Oxidising agent** (oxidant) gets reduced; **reducing agent** (reductant) gets oxidised.
- Strong oxidants: F₂, KMnO₄, K₂Cr₂O₇, O₃, H₂O₂, HNO₃, Cl₂, PbO₂. Strong reductants: alkali metals, H₂, C, CO, H₂S, SnCl₂, Na₂S₂O₃, LiAlH₄, NaBH₄.
- **H₂O₂ and SO₂ act as both** oxidant and reductant.

### Rules for oxidation number (ON)

1. Element in free state: 0 (Na, O₂, P₄, S₈).
2. Monatomic ion: equal to its charge.
3. Oxygen −2; but −1 in peroxides (H₂O₂, Na₂O₂, BaO₂), −½ in superoxides (KO₂), +2 in OF₂, +1 in O₂F₂.
4. Hydrogen +1; but −1 in metal hydrides (NaH, CaH₂, LiAlH₄).
5. Fluorine always −1. Alkali metals +1, alkaline earth +2.
6. Sum of ONs = 0 for a molecule, = charge for an ion.

| Species | ON | Note |
|---|---|---|
| Cr in K₂Cr₂O₇ | +6 | 2 + 2x − 14 = 0 |
| Mn in KMnO₄ | +7 | Highest for Mn |
| Mn in K₂MnO₄ | +6 | Green manganate |
| S in H₂SO₄ | +6 | — |
| S in H₂SO₅ (Caro's acid) | +6 | Has one peroxide O–O; naive calculation gives +8 (wrong) |
| Cr in CrO₅ | +6 | Butterfly structure with two peroxide groups; naive +10 is wrong |
| S in Na₂S₄O₆ (tetrathionate) | +2.5 (average) | Actual: two S at +5, two at 0 |
| S in Na₂S₂O₃ | +2 (average) | — |
| Fe in Fe₃O₄ | +8/3 (average) | Actually FeO·Fe₂O₃ (one Fe²⁺, two Fe³⁺) |
| C in C₃O₂ | +4/3 | — |
| N in NH₄NO₃ | −3 and +5 | Two different N atoms |
| Os in OsO₄ | +8 | Highest known common ON (also Ru in RuO₄) |
| Fe in Na₂[Fe(CN)₅NO] | **+2** | NO is taken as NO⁺ |
| Cr in [Cr(NH₃)₄Cl₂]⁺ | **+3** | x + 0 − 2 = +1 |

**Worked numerical 1.** ON of Cr in [Cr(NH₃)₄Cl₂]⁺: NH₃ is neutral, Cl⁻ is −1 each. x + 4(0) + 2(−1) = +1 → **x = +3**.

> **PYQ:** TRE 2.0 (2023) asked: "The oxidation number of Cr in [Cr(NH₃)₄Cl₂]⁺ is (A) +3 (B) +2 (C) +1". Official answer: **(A) +3**.

**Worked numerical 2.** ON of Fe in sodium nitroprusside Na₂[Fe(CN)₅NO]: 2(+1) + x + 5(−1) + (+1 for NO⁺) = 0 → **x = +2**. (Details and its IUPAC name in chapter 9.)

> **PYQ:** TRE 2.0 (2023) asked: "The oxidation number of iron (Fe) in sodium nitroprusside is (A) +3 (B) +2 (C) −4". Official answer: **(B) +2**.

### Types of redox reactions

| Type | Example |
|---|---|
| Combination | 2Mg + O₂ → 2MgO |
| Decomposition | 2KClO₃ → 2KCl + 3O₂ (MnO₂ catalyst) |
| Displacement | Zn + CuSO₄ → ZnSO₄ + Cu; Fe + CuSO₄ → FeSO₄ + Cu (blue colour fades) |
| **Disproportionation** (same element oxidised and reduced) | Cl₂ + 2NaOH (cold, dilute) → NaCl + NaOCl + H₂O; 3Cl₂ + 6NaOH (hot) → 5NaCl + NaClO₃ + 3H₂O; 2H₂O₂ → 2H₂O + O₂; P₄ + 3NaOH + 3H₂O → PH₃ + 3NaH₂PO₂; 2Cu⁺ → Cu + Cu²⁺ |
| Comproportionation (reverse) | 2H₂S + SO₂ → 3S + 2H₂O |

F₂ cannot disproportionate (only negative ON possible). Fluorine's ON is only 0 and −1.

### Redox titrations

**KMnO₄ vs FeSO₄ (in dilute H₂SO₄):**
MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O.
Purple MnO₄⁻ (Mn +7) is reduced to almost colourless Mn²⁺; Fe²⁺ is oxidised to Fe³⁺. KMnO₄ is a **self-indicator** — the first permanent pale pink shows the end point. HCl is not used to acidify (KMnO₄ would oxidise Cl⁻ to Cl₂); HNO₃ is not used (it is itself an oxidant).

> **PYQ:** TRE 1.0 (2023) asked why the light purple colour of acidified permanganate fades when dilute FeSO₄ is added. Correct explanation: **(A) KMnO₄ is an oxidising agent and it oxidises FeSO₄** (colour loss is due to reduction of MnO₄⁻ to Mn²⁺, not dilution).

- **K₂Cr₂O₇ vs Fe²⁺:** Cr₂O₇²⁻ + 6Fe²⁺ + 14H⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O (orange → green); needs an external/internal indicator (diphenylamine).
- **Iodometry:** I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻; starch indicator (blue → colourless).
- n-factor of KMnO₄: 5 (acidic), 3 (neutral/weakly alkaline, gives MnO₂), 1 (strongly alkaline, gives MnO₄²⁻). K₂Cr₂O₇ in acid: 6.

**Balancing by ion–electron method (acidic medium):** split into half-reactions; balance atoms other than O and H; balance O with H₂O, H with H⁺; balance charge with electrons; equalise electrons and add. (In basic medium, then add OH⁻ to both sides to cancel H⁺.)

## 2. Electrochemical cells

A **galvanic (voltaic) cell** converts chemical energy of a spontaneous redox reaction into electrical energy. An **electrolytic cell** uses electrical energy to drive a non-spontaneous reaction.

| Feature | Galvanic cell | Electrolytic cell |
|---|---|---|
| Energy change | Chemical → electrical | Electrical → chemical |
| Anode | **Negative**, oxidation | **Positive**, oxidation |
| Cathode | **Positive**, reduction | **Negative**, reduction |
| ΔG | Negative | Positive (driven) |

**Memory trick:** "An Ox, Red Cat" — oxidation at anode, reduction at cathode, in every cell.

**Daniell cell:** Zn | Zn²⁺(aq) || Cu²⁺(aq) | Cu; E° = 1.10 V. Zn (anode) dissolves; Cu deposits on the cathode. The **salt bridge** (KCl or KNO₃ in agar–agar) completes the circuit and keeps both solutions electrically neutral.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <rect x="40" y="90" width="110" height="90"/>
  <rect x="270" y="90" width="110" height="90"/>
  <rect x="80" y="55" width="12" height="105"/>
  <rect x="320" y="55" width="12" height="105"/>
  <path d="M120 120 L120 70 L300 70 L300 120"/>
  <path d="M132 120 L132 82 L288 82 L288 120"/>
  <line x1="86" y1="55" x2="86" y2="25"/>
  <line x1="326" y1="55" x2="326" y2="25"/>
  <line x1="86" y1="25" x2="190" y2="25"/>
  <line x1="230" y1="25" x2="326" y2="25"/>
  <circle cx="210" cy="25" r="18"/>
  <text x="205" y="29" fill="currentColor" stroke="none">V</text>
  <text x="155" y="18" fill="currentColor" stroke="none">e⁻ →</text>
  <text x="45" y="195" fill="currentColor" stroke="none">Zn anode (−), ZnSO₄</text>
  <text x="265" y="195" fill="currentColor" stroke="none">Cu cathode (+), CuSO₄</text>
  <text x="170" y="100" fill="currentColor" stroke="none">salt bridge</text>
  <text x="40" y="50" fill="currentColor" stroke="none" font-size="10">Zn → Zn²⁺ + 2e⁻</text>
  <text x="340" y="50" fill="currentColor" stroke="none" font-size="10">Cu²⁺ + 2e⁻ → Cu</text>
</svg>

### Electrode potential and the electrochemical series

- **Standard hydrogen electrode (SHE):** Pt | H₂(1 bar) | H⁺(1 M), E° = 0.00 V by convention.
- **Standard reduction potentials (E°, V) at 298 K:**

| Half-reaction | E° (V) |
|---|---|
| Li⁺ + e⁻ → Li | **−3.05** (most negative) |
| K⁺ + e⁻ → K | −2.93 |
| Ca²⁺ + 2e⁻ → Ca | −2.87 |
| Na⁺ + e⁻ → Na | −2.71 |
| Mg²⁺ + 2e⁻ → Mg | −2.37 |
| Al³⁺ + 3e⁻ → Al | −1.66 |
| Zn²⁺ + 2e⁻ → Zn | −0.76 |
| Fe²⁺ + 2e⁻ → Fe | −0.44 |
| 2H⁺ + 2e⁻ → H₂ | 0.00 |
| Cu²⁺ + 2e⁻ → Cu | +0.34 |
| I₂ + 2e⁻ → 2I⁻ | +0.54 |
| Ag⁺ + e⁻ → Ag | +0.80 |
| Br₂ + 2e⁻ → 2Br⁻ | +1.09 |
| Cr₂O₇²⁻ → Cr³⁺ (acid) | +1.33 |
| Cl₂ + 2e⁻ → 2Cl⁻ | +1.36 |
| MnO₄⁻ → Mn²⁺ (acid) | +1.51 |
| F₂ + 2e⁻ → 2F⁻ | **+2.87** (most positive) |

- **More negative E° → stronger reducing agent** (loses electrons easily). Li is the strongest reducing agent in aqueous solution (high hydration energy of tiny Li⁺), though Cs has the lowest ionisation energy.
- **More positive E° → stronger oxidising agent.** F₂ is the strongest.
- A metal with lower E° displaces a metal with higher E° from its salt solution (Zn displaces Cu). Metals with negative E° liberate H₂ from dilute acids; Cu, Ag, Au do not.
- **E°cell = E°cathode − E°anode** (both as reduction potentials). Positive E°cell → spontaneous.

> **PYQ:** TRE 2.0 (2023) asked: standard electrode potentials of X, Y and Z are −3.05 V, −1.66 V and −0.40 V; which is the strongest reducing agent? Official answer: **(A) X** (most negative E°; −3.05 V is the value for lithium).

### Nernst equation

For Mⁿ⁺ + ne⁻ → M: E = E° − (0.0591/n) log (1/[Mⁿ⁺]) at 298 K. For a cell reaction:

<div class="formula">

| Relation | Formula (298 K) |
|---|---|
| Nernst equation | E_cell = E°_cell − (0.0591/n) log Q |
| 2.303RT/F at 298 K | 0.0591 V |
| Gibbs energy | ΔG = −nFE; ΔG° = −nFE° |
| Equilibrium constant | log K = nE°/0.0591 |
| Faraday constant | 1 F = 96 485 C mol⁻¹ (≈ 96 500) |

</div>

**Worked numerical 3 (Nernst).** Zn | Zn²⁺(0.001 M) || Cu²⁺(0.1 M) | Cu, E° = 1.10 V, n = 2. Q = [Zn²⁺]/[Cu²⁺] = 0.001/0.1 = 10⁻².
E = 1.10 − (0.0591/2) log 10⁻² = 1.10 + 0.0591 = **1.159 V ≈ 1.16 V**.

**Worked numerical 4 (ΔG° and K).** For the Daniell cell: ΔG° = −2 × 96 485 × 1.10 = **−212.3 kJ mol⁻¹**. log K = 2 × 1.10/0.0591 = 37.2 → **K ≈ 1.7 × 10³⁷**.

**Worked numerical 5.** E°(Ag⁺/Ag) = 0.80 V, E°(Zn²⁺/Zn) = −0.76 V. E°cell for Zn | Zn²⁺ || Ag⁺ | Ag = 0.80 − (−0.76) = **1.56 V**.

**Worked numerical 6.** Potential of hydrogen electrode at pH 3 (p(H₂) = 1 bar)? E = −0.0591 × pH = **−0.177 V**.

## 3. Conductance of solutions

| Quantity | Symbol and relation | Unit |
|---|---|---|
| Resistance | R = ρ (l/A) | ohm (Ω) |
| Conductance | G = 1/R | siemens (S = Ω⁻¹) |
| Conductivity (specific conductance) | κ = 1/ρ = G × (l/A) | S m⁻¹ (S cm⁻¹) |
| Cell constant | G* = l/A = κ × R | m⁻¹ (cm⁻¹) |
| Molar conductivity | Λm = κ × 1000/M (κ in S cm⁻¹, M in mol L⁻¹) | S cm² mol⁻¹ |

- On dilution, **κ decreases** (fewer ions per cm³) but **Λm increases** (more ionisation, less interionic attraction).
- **Strong electrolytes** (KCl): Λm rises slightly; Λm = Λ°m − A√c (Debye–Hückel–Onsager). **Weak electrolytes** (CH₃COOH): Λm rises steeply at high dilution; Λ°m cannot be found by extrapolation.
- **Kohlrausch's law (1875):** at infinite dilution each ion contributes independently: Λ°m = ν₊λ°₊ + ν₋λ°₋. Used to find Λ°m of weak electrolytes: Λ°(CH₃COOH) = Λ°(CH₃COONa) + Λ°(HCl) − Λ°(NaCl); degree of dissociation α = Λm/Λ°m.
- H⁺ and OH⁻ have unusually high ionic mobility (Grotthuss proton-hopping).

**Worked numerical 7.** κ of 0.20 M KCl = 0.0248 S cm⁻¹. Λm = 0.0248 × 1000/0.20 = **124 S cm² mol⁻¹**.

## 4. Electrolysis

**Faraday's first law (1833):** mass deposited m ∝ charge passed: **m = Z I t** (Z = electrochemical equivalent). **Second law:** for the same charge, masses deposited are proportional to equivalent weights. **1 F = charge of 1 mole of electrons = 96 485 C.**

**Worked numerical 8.** Mass of Cu deposited by 2 A for 965 s from CuSO₄?
Q = 2 × 965 = 1930 C = 0.02 F. Cu²⁺ + 2e⁻ → Cu, so moles Cu = 0.01 → mass = 0.01 × 63.5 = **0.635 g**.

| Electrolysis of | At cathode | At anode |
|---|---|---|
| Molten NaCl | Na | Cl₂ |
| Aqueous NaCl (brine) | **H₂** (water reduced; E° of Na⁺ too negative) | **Cl₂** (overpotential of O₂) — NaOH left in solution (chlor-alkali process) |
| Aqueous CuSO₄ (Pt electrodes) | Cu | O₂ |
| Aqueous CuSO₄ (Cu electrodes) | Cu | Cu dissolves (used in electrorefining) |
| Dilute H₂SO₄ (Pt) | H₂ | O₂ (2 : 1 by volume) |
| Molten Al₂O₃ in cryolite (Hall–Héroult) | Al | O₂ (burns carbon anode to CO₂) |

Uses: electroplating, electrorefining (Cu, Ag, Au, Zn), extraction of reactive metals (Na, Mg, Al), anodising Al.

## 5. Batteries, fuel cells and corrosion

**Primary cells** — reaction cannot be reversed; discarded after use. **Secondary cells** — rechargeable (reaction reversed by passing current).

| Cell | Type | Anode | Cathode / electrolyte | Voltage |
|---|---|---|---|---|
| Dry cell (Leclanché) | Primary | Zinc container | Graphite rod with MnO₂ + C; NH₄Cl + ZnCl₂ paste | ~1.5 V |
| **Mercury cell** | **Primary** | Zn–Hg amalgam | HgO + carbon; KOH + ZnO paste | **1.35 V (constant over life)** — hearing aids, watches |
| Alkaline cell | Primary | Zn powder | MnO₂; KOH | 1.5 V |
| Lead storage battery | Secondary | Pb | PbO₂; 38% H₂SO₄ | 2 V per cell (12 V = 6 cells) |
| Nickel–cadmium | Secondary | Cd | NiO(OH); KOH | ~1.2–1.4 V |
| Lithium-ion | Secondary | Li in graphite | LiCoO₂ (and others) | ~3.7 V |
| H₂–O₂ fuel cell | Fuel cell | H₂ (porous C with Pt/Pd) | O₂; hot KOH | ~1.23 V; ~70% efficient; used in Apollo missions, product is water |

- Lead storage battery discharge: Pb + PbO₂ + 2H₂SO₄ → 2PbSO₄ + 2H₂O (density of acid falls; checked by hydrometer).

> **PYQ:** TRE 1.0 (2023) asked which assertion about primary cells is correct: (A) an example of a primary cell is a mercury cell (B) an example is a nickel–cadmium storage cell (C) the electrode reactions can be reversed. Correct: **(A)**. Ni–Cd is secondary; reversible electrode reactions describe secondary cells. (No official key in our folder.)

**Corrosion** — slow electrochemical destruction of metals. Rusting of iron needs **both water and oxygen**; salt (sea water) and acids speed it. Rust = **Fe₂O₃·xH₂O**. Anode: Fe → Fe²⁺ + 2e⁻; cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O. Prevention: painting, oiling, **galvanisation** (zinc coating; protects even when scratched), tinning (tin coating; protects only while intact), alloying (stainless steel: Fe + Cr + Ni), **sacrificial (cathodic) protection** with Mg or Zn blocks on ships and pipelines.

## 6. Chemical kinetics

**Rate of reaction** = change in concentration per unit time; unit mol L⁻¹ s⁻¹. For aA + bB → cC + dD: rate = −(1/a) d[A]/dt = −(1/b) d[B]/dt = (1/c) d[C]/dt.

**Factors:** concentration, temperature, catalyst, surface area, nature of reactants, light (photochemical reactions).

**Rate law:** rate = k[A]ˣ[B]ʸ, found by experiment. **Order** = x + y. **k** = rate constant = **specific reaction rate** (the rate when every concentration is 1 mol L⁻¹).

> **PYQ:** TRE 1.0 (2023) asked: "In the rate equation, when the concentration of reactants is unity, then the rate is equal to (A) specific rate constant (B) average rate constant (C) instantaneous rate constant". Correct: **(A) specific rate constant**.

| Order | Molecularity |
|---|---|
| Experimental quantity | Theoretical (from mechanism) |
| Can be 0, fraction, negative | Always a whole number 1, 2, 3 (rarely 3) |
| For overall complex reaction | For an elementary step |
| Depends on conditions | Never zero |

**Units of k:** (mol L⁻¹)^(1−n) s⁻¹. Zero order: mol L⁻¹ s⁻¹; first order: s⁻¹; second order: L mol⁻¹ s⁻¹.

**Worked numerical 9 (rate change).** For 2A + B → A₂B, if the rate law follows the equation (rate = k[A]²[B]), doubling [A] and halving [B] changes rate by 2² × ½ = **2 times (increases)**.

> **PYQ:** TRE 1.0 (2023) asked exactly this: "In the reaction 2A + B → A₂B, if the concentration of A is doubled and that of B is halved, then the rate of the reaction will (A) increase 2 times (B) increase 4 times (C) decrease 2 times". Taking rate = k[A]²[B] (treating it as elementary), the answer is **(A) increase 2 times**. (Strictly, order must come from experiment; no official key in our folder.)

<div class="formula">

| Order | Integrated rate law | Half-life t½ | Linear plot |
|---|---|---|---|
| Zero | [A] = [A]₀ − kt | **[A]₀/2k** (∝ [A]₀) | [A] vs t, slope −k |
| First | k = (2.303/t) log([A]₀/[A]) | **0.693/k** (independent of [A]₀) | log[A] vs t, slope −k/2.303 |
| Second (one reactant) | 1/[A] − 1/[A]₀ = kt | 1/(k[A]₀) | 1/[A] vs t |
| nth order | — | t½ ∝ 1/[A]₀^(n−1) | — |

</div>

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="40" y1="170" x2="190" y2="170"/>
  <line x1="40" y1="170" x2="40" y2="25"/>
  <line x1="40" y1="35" x2="170" y2="170"/>
  <text x="60" y="190" fill="currentColor" stroke="none">Zero order: [A] vs t</text>
  <text x="10" y="40" fill="currentColor" stroke="none">[A]</text>
  <line x1="240" y1="170" x2="400" y2="170"/>
  <line x1="240" y1="170" x2="240" y2="25"/>
  <path d="M240 35 C280 110 320 150 395 162"/>
  <line x1="240" y1="102" x2="285" y2="102" stroke-dasharray="3 3"/>
  <line x1="285" y1="102" x2="285" y2="170" stroke-dasharray="3 3"/>
  <line x1="240" y1="136" x2="330" y2="136" stroke-dasharray="3 3"/>
  <line x1="330" y1="136" x2="330" y2="170" stroke-dasharray="3 3"/>
  <text x="268" y="185" fill="currentColor" stroke="none" font-size="10">t½</text>
  <text x="315" y="185" fill="currentColor" stroke="none" font-size="10">2t½</text>
  <text x="290" y="60" fill="currentColor" stroke="none">First order: equal half-lives</text>
  <text x="210" y="40" fill="currentColor" stroke="none">[A]</text>
</svg>

**Examples by order**

| Order | Reactions |
|---|---|
| Zero | **H₂ + Cl₂ → 2HCl (photochemical, over water)**; decomposition of NH₃ on hot Pt or W; HI on gold surface; enzyme reactions at high substrate concentration |
| First | All radioactive decays; 2N₂O₅ → 4NO₂ + O₂; 2H₂O₂ → 2H₂O + O₂; decomposition of N₂O; SO₂Cl₂ → SO₂ + Cl₂ |
| Pseudo-first | Acid hydrolysis of ester (CH₃COOC₂H₅ + H₂O, H⁺); inversion of cane sugar (water in large excess) |
| Second | **Saponification: CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH**; 2HI → H₂ + I₂ (gas phase); H₂ + I₂ → 2HI; 2NO₂ → 2NO + O₂ |
| Third | 2NO + O₂ → 2NO₂; 2NO + Cl₂ → 2NOCl; 2FeCl₃ + SnCl₂ → 2FeCl₂ + SnCl₄ |

> **PYQ:** TRE 2.0 (2023) asked: "Which of the following is a zero-order reaction? (A) CH₃COOC₂H₅ + NaOH → … (B) H₂ + Cl₂ —hν→ 2HCl (C) 2FeCl₃ + SnCl₂ → 2FeCl₂ + SnCl₄". Official answer: **(B)** the photochemical combination of H₂ and Cl₂ (A is second order, C is third order).

**Worked numerical 10 (first-order half-life — TRE 1.0 question).** A decomposes by first order; [A] falls from 2.00 M to 0.15 M in 200 min. Find t½.
k = (2.303/200) log(2.00/0.15) = (2.303/200) × log 13.33 = (2.303/200) × 1.125 = 0.01295 min⁻¹.
t½ = 0.693/0.01295 = **≈ 53.5 min**.

> **PYQ:** TRE 1.0 (2023) asked this numerical with options (A) 53.72 min (B) 50.49 min (C) 48.45 min. Our calculation gives about 53.5 min, so the intended choice is **(A) 53.72 min** (the small gap comes from rounding in the question). No official key in our folder.

**Worked numerical 11.** k = 6.93 × 10⁻³ s⁻¹ for a first-order reaction. t½ = 0.693/6.93 × 10⁻³ = **100 s**. Time for 75% completion = 2 half-lives = 200 s; for 87.5% = 3 half-lives = 300 s; for 99.9% ≈ 10 half-lives.

**Worked numerical 12 (zero order).** [A]₀ = 0.4 M, k = 0.01 M min⁻¹. t½ = 0.4/(2 × 0.01) = **20 min**; reaction is complete in [A]₀/k = 40 min.

## 7. Temperature, Arrhenius equation and catalysis

- **Temperature coefficient:** rate (k) becomes about **2–3 times for every 10 °C rise**.
- **Arrhenius equation (1889):** **k = A e^(−Ea/RT)**; log k = log A − Ea/(2.303RT). Plot of log k vs 1/T is a straight line with slope −Ea/2.303R.
- Two temperatures: log(k₂/k₁) = (Ea/2.303R) × (T₂ − T₁)/(T₁T₂).
- **Activation energy (Ea):** minimum extra energy that colliding molecules need to form the **activated complex** (transition state). Threshold energy = Ea + average energy of reactants.
- **Collision theory:** rate = Z × fraction with E ≥ Ea × steric (orientation) factor P.

**Worked numerical 13.** Rate doubles from 300 K to 310 K. Ea?
Ea = 2.303 R log 2 × T₁T₂/(T₂ − T₁) = 2.303 × 8.314 × 0.301 × (300 × 310/10) = **≈ 53.6 kJ mol⁻¹**.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="40" y1="180" x2="400" y2="180"/>
  <line x1="40" y1="180" x2="40" y2="15"/>
  <path d="M50 120 L110 120 C160 120 170 30 210 30 C250 30 260 150 310 150 L390 150"/>
  <path d="M110 120 C160 120 170 80 210 80 C250 80 260 150 310 150" stroke-dasharray="5 3"/>
  <line x1="210" y1="30" x2="210" y2="120" stroke-dasharray="2 3"/>
  <text x="215" y="25" fill="currentColor" stroke="none">activated complex</text>
  <text x="215" y="78" fill="currentColor" stroke="none" font-size="10">with catalyst (lower Ea)</text>
  <text x="170" y="100" fill="currentColor" stroke="none" font-size="10">Ea</text>
  <text x="50" y="112" fill="currentColor" stroke="none">reactants</text>
  <text x="320" y="143" fill="currentColor" stroke="none">products</text>
  <text x="320" y="170" fill="currentColor" stroke="none" font-size="10">ΔH unchanged</text>
  <text x="5" y="20" fill="currentColor" stroke="none">PE</text>
  <text x="300" y="195" fill="currentColor" stroke="none">reaction path →</text>
</svg>

**Catalyst** (Berzelius, 1835) — changes the rate without being consumed.
- A catalyst **lowers the activation energy** by providing an alternative path.
- It does **not** change ΔH, ΔG, entropy, internal energy or the equilibrium constant; it speeds up forward and backward reactions equally.
- **Promoter** increases catalyst activity (Mo for Fe in Haber process); **poison** decreases it (CO, As₂O₃ poison Pt; Lindlar's catalyst is deliberately poisoned Pd).
- **Homogeneous** (same phase: NO in lead-chamber process, H⁺ in ester hydrolysis) vs **heterogeneous** (different phase: Fe in Haber, V₂O₅ in contact process, Ni in hydrogenation of oils, Pt in Ostwald process for HNO₃).
- **Enzymes** are biological catalysts — highly specific, best at ~37 °C and optimum pH (pepsin ~2, trypsin ~8). Examples: invertase (sucrose → glucose + fructose), zymase (glucose → ethanol + CO₂), urease (urea → NH₃ + CO₂), diastase (starch → maltose).
- **Autocatalysis:** a product catalyses the reaction (Mn²⁺ in the KMnO₄–oxalic acid titration).

> **PYQ:** TRE 1.0 (2023) asked: "A catalyst alters which of the following in a chemical reaction? (A) Entropy (B) Activation energy (C) Internal energy". Correct: **(B) Activation energy**.

## 8. Photochemistry

**Photochemistry** studies reactions that occur on absorption of visible or UV light (wavelength about 200–800 nm). Thermal reactions need heat; photochemical reactions can occur at room temperature and ΔG can even be positive (photosynthesis).

> **PYQ:** TRE 1.0 (2023) asked: "Photochemistry deals with the study of (A) photons (B) photos (C) reactions which proceed with absorption of visible or UV light". Correct: **(C)**.

| Law / term | Statement |
|---|---|
| **Grotthuss–Draper law** (first law) | Only light that is **absorbed** can cause a photochemical change |
| **Stark–Einstein law of photochemical equivalence** (1908–1912) | Each molecule taking part in the **primary** step absorbs one quantum (photon). Energy per mole of photons = 1 einstein = Nₐhν |
| **Quantum yield (φ)** | Molecules reacting ÷ photons absorbed |
| **Intensity of light** | Number of photons passing through unit area per unit time (energy per unit area per unit time) |
| Beer–Lambert law | Absorbance A = log(I₀/I) = εcl |

> **PYQ:** TRE 1.0 (2023) asked: "The number of photons that pass through a unit area in a unit time is called (A) amplitude (B) frequency (C) intensity of light". Correct: **(C) intensity**.

**Quantum yields**

| Reaction | φ | Reason |
|---|---|---|
| H₂ + Cl₂ → 2HCl | 10⁴–10⁶ (very high) | Chain reaction (Cl· radicals) |
| 2HI → H₂ + I₂ | 2 | Secondary step uses a second HI |
| H₂ + Br₂ → 2HBr | ~0.01 (low) | Br· + H₂ step is endothermic, slow |
| Photosynthesis | < 1 (about 0.1) | — |

**Photophysical processes** (after a molecule absorbs light):
- **Fluorescence** — emission stops almost immediately (~10⁻⁸ s) when light is removed; singlet → singlet (fluorite, chlorophyll solution, quinine sulphate, tube-light coating).
- **Phosphorescence** — glow continues after light is removed; comes from a triplet state (ZnS, radium-dial paints).
- **Chemiluminescence** — light from a chemical reaction (firefly — luciferin oxidised by luciferase; glow of white phosphorus; luminol). **Bioluminescence** is the living form.
- **Photosensitisation** — a substance absorbs light and transfers energy to another that cannot absorb it directly (chlorophyll in photosynthesis; Hg vapour in H₂ dissociation).
- **Photodissociation** — molecule absorbs light and breaks directly from an unstable excited state (Cl₂ → 2Cl·; O₂ → 2O in the stratosphere).
- **Predissociation** — molecule is first excited to a stable excited state, then crosses **without emitting radiation** to an unstable (repulsive) state, which leads to dissociation. Seen as diffuse bands in spectra.

> **PYQ:** TRE 1.0 (2023) asked: "The transition without emission of radiation of a molecule from a stable excited state to an unstable excited state that leads to dissociation is (A) predissociation (B) dissociation (C) photodissociation". Correct: **(A) predissociation**.

**Common photochemical reactions:** photosynthesis (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂, chlorophyll); formation of ozone; photochemical smog (NO₂ + hν → NO + O); vision (rhodopsin, cis → trans retinal); photography (AgBr → Ag + Br); **2AgCl —sunlight→ 2Ag + Cl₂** (white silver chloride turns grey, so AgCl is stored in dark bottles); 2AgBr → 2Ag + Br₂ (used in black-and-white photography).

> **PYQ:** TRE 1.0 (2023) asked why silver chloride turns grey in sunlight; statements were (i) formation of silver by decomposition of AgCl (ii) sublimation (iii) "decomposition of chlorine gas from silver chloride" (iv) oxidation of AgCl. The reliable choice is **(A) (i) only** — grey colour is metallic silver from photolysis. (Chlorine is released, but statement (iii) is worded oddly; no official key in our folder.)

## Traps and exceptions

- **O in H₂O₂ is −1, in OF₂ is +2**; H in NaH is −1.
- **S in H₂SO₅ and Cr in CrO₅ are +6**, not +8 and +10 (peroxide oxygens).
- Fe in nitroprusside is **+2** (NO⁺).
- In a galvanic cell the **anode is negative**; in an electrolytic cell the anode is positive. Oxidation is always at the anode.
- **Li is the strongest reducing agent** in water (E° = −3.05 V) even though Cs has a lower IE.
- E° is intensive: multiplying a half-reaction by 2 does **not** double E°.
- On dilution κ decreases but Λm increases.
- Brine electrolysis gives **H₂ at cathode**, not Na.
- **Mercury cell and dry cell are primary**; lead accumulator, Ni–Cd and Li-ion are secondary.
- **Photochemical H₂ + Cl₂ is zero order** but has huge quantum yield.
- Saponification of ester by NaOH is **second order**; acid hydrolysis is pseudo-first order.
- First-order t½ is independent of initial concentration; zero-order t½ is proportional to it.
- **Catalyst lowers Ea only** — no change in ΔH, ΔG, K or equilibrium yield.
- Order can be zero or fractional; molecularity cannot.
- Fluorescence stops instantly; phosphorescence persists.

## Quick revision

1. OIL RIG: oxidation is loss, reduction is gain of electrons.
2. ON of Mn in KMnO₄ +7; Cr in K₂Cr₂O₇ +6; Os in OsO₄ +8.
3. KMnO₄ is a self-indicator; n-factor 5 in acid.
4. MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O.
5. Cl₂ + cold dilute NaOH → disproportionation (NaCl + NaOCl).
6. SHE E° = 0; Li −3.05 V; F₂ +2.87 V.
7. E°cell = E°cathode − E°anode.
8. E = E° − (0.0591/n) log Q.
9. ΔG° = −nFE°; log K = nE°/0.0591.
10. 1 F = 96 485 C; m = ZIt.
11. Λm = κ × 1000/M; Kohlrausch's law of independent migration.
12. Mercury cell 1.35 V, primary; lead storage 2 V per cell, secondary.
13. H₂–O₂ fuel cell used in Apollo; product water.
14. Rust = Fe₂O₃·xH₂O; galvanisation = zinc coating.
15. k = rate when all concentrations are unity (specific rate constant).
16. Units of k: zero mol L⁻¹ s⁻¹, first s⁻¹, second L mol⁻¹ s⁻¹.
17. t½ (first order) = 0.693/k.
18. Photochemical H₂ + Cl₂ is zero order; φ up to 10⁶.
19. Rate doubles or triples per 10 °C rise.
20. k = A e^(−Ea/RT).
21. Catalyst lowers activation energy only.
22. Grotthuss–Draper: only absorbed light acts; Stark–Einstein: one photon per molecule.
23. Intensity of light = photons per unit area per unit time.
24. Predissociation = radiationless crossing to a dissociative state.
25. AgCl turns grey in sunlight (Ag formed).

## Practice with answers

1. ON of O in KO₂? — **−½** (superoxide).
2. ON of Mn in K₂MnO₄? — **+6**.
3. Which electrode is positive in a Daniell cell? — **Copper (cathode)**.
4. Function of a salt bridge? — **Completes the circuit and keeps solutions neutral**.
5. Strongest oxidising agent in the electrochemical series? — **F₂** (E° +2.87 V).
6. Can a copper vessel store dilute HCl safely? — **Yes** (Cu has positive E°, does not liberate H₂).
7. Charge needed to deposit 1 mol of Al from Al³⁺? — **3 F** (289 455 C).
8. Unit of molar conductivity? — **S cm² mol⁻¹** (S m² mol⁻¹ in SI).
9. Electrolyte in a lead storage battery? — **About 38% H₂SO₄**.
10. Example of a primary cell? — **Mercury cell / dry cell**.
11. Units of k for a first-order reaction? — **s⁻¹**.
12. Half-life of a zero-order reaction depends on? — **Initial concentration** (t½ = [A]₀/2k).
13. Order of decomposition of NH₃ on hot platinum? — **Zero**.
14. Order of inversion of cane sugar? — **Pseudo-first order**.
15. What does a catalyst change: ΔH or Ea? — **Ea**.
16. Quantum yield of H₂ + Cl₂ photochemical reaction is high because? — **Chain reaction**.
17. Glow that continues after light is removed? — **Phosphorescence**.
18. First-order reaction: time for 75% completion if t½ = 30 min? — **60 min** (two half-lives).
19. Strongest reducing agent among E° values −3.05, −1.66, −0.40 V? — **The −3.05 V metal** (official TRE 2.0 answer).
20. Effect of a catalyst on equilibrium constant? — **No effect**.
