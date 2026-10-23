---
title: Thermodynamics, Equilibrium, Acids and Bases
part: Physical Chemistry
summary: Laws of thermodynamics, enthalpy, Hess's law, entropy and Gibbs energy; chemical equilibrium, Kc and Kp, Le Chatelier's principle; acid–base theories, pH, weak acids, buffers, hydrolysis, solubility product and indicators, with worked numericals.
---

This chapter answers three questions: will a reaction happen (thermodynamics), how far will it go (equilibrium), and how acidic is the solution (ionic equilibrium)? It covers NCERT class 10 ("Acids, Bases and Salts"), class 11 ("Thermodynamics" and "Equilibrium") and B.Sc. points like ΔG° = −RT ln K and the Ostwald dilution law. TRE 1.0 asked about the nature of chemical dissociation; TRE papers also love "pH of 10⁻⁸ M HCl", "conjugate base of …" and Le Chatelier questions.

> **In simple words:** A reaction "wants" to go if it releases energy (ΔH negative) and/or increases disorder (ΔS positive); Gibbs energy ΔG = ΔH − TΔS combines both, and ΔG < 0 means spontaneous. At equilibrium forward and backward rates are equal, and the equilibrium constant tells you how far the reaction went. pH is simply −log[H⁺].

## 1. Basic terms of thermodynamics

| Term | Meaning | Example |
|---|---|---|
| System / surroundings | Part under study / everything else | Reaction mixture / beaker and room |
| Open system | Exchanges energy and matter | Open beaker of hot water |
| Closed system | Exchanges energy only | Sealed flask |
| Isolated system | Exchanges neither | Ideal thermos flask |
| State function | Depends only on initial and final state | U, H, S, G, P, V, T |
| Path function | Depends on the path | Work (w), heat (q) |
| Isothermal | Constant temperature (ΔU = 0 for ideal gas) | — |
| Adiabatic | No heat exchange (q = 0) | Sudden expansion |
| Isobaric / isochoric | Constant pressure / constant volume | Open vessel / bomb calorimeter |
| Reversible | Carried out infinitesimally slowly, always near equilibrium | Gives maximum work |

## 2. First law and enthalpy

**First law (conservation of energy):** ΔU = q + w (IUPAC sign convention: heat absorbed by system and work done **on** the system are positive). Older books write ΔU = q − w (w = work done by system).

- Work of expansion against constant external pressure: **w = −P_ext ΔV**. Free expansion (into vacuum) does no work.
- Isothermal reversible work for ideal gas: w = −2.303 nRT log(V₂/V₁).
- At constant volume, q_v = ΔU (measured in a **bomb calorimeter**). At constant pressure, q_p = ΔH (coffee-cup calorimeter).
- **Enthalpy** H = U + PV. **ΔH = ΔU + Δn_g RT**, where Δn_g = moles of gaseous products − moles of gaseous reactants.
- **Exothermic:** ΔH < 0 (combustion, neutralisation, respiration, formation of NH₃). **Endothermic:** ΔH > 0 (photosynthesis, melting, evaporation, decomposition of CaCO₃, **breaking of bonds**).
- Heat capacity C = q/ΔT; C_p − C_v = R for one mole of ideal gas; γ = C_p/C_v = 1.67 (monatomic), 1.40 (diatomic).

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="30" y1="170" x2="190" y2="170"/>
  <line x1="30" y1="170" x2="30" y2="20"/>
  <line x1="50" y1="60" x2="100" y2="60"/>
  <line x1="130" y1="130" x2="180" y2="130"/>
  <line x1="115" y1="62" x2="115" y2="128"/>
  <polyline points="110,120 115,128 120,120"/>
  <text x="50" y="52" fill="currentColor" stroke="none">reactants</text>
  <text x="130" y="148" fill="currentColor" stroke="none">products</text>
  <text x="120" y="98" fill="currentColor" stroke="none">ΔH &lt; 0</text>
  <text x="40" y="190" fill="currentColor" stroke="none">Exothermic</text>
  <text x="5" y="30" fill="currentColor" stroke="none">H</text>
  <line x1="230" y1="170" x2="400" y2="170"/>
  <line x1="230" y1="170" x2="230" y2="20"/>
  <line x1="250" y1="130" x2="300" y2="130"/>
  <line x1="330" y1="60" x2="380" y2="60"/>
  <line x1="315" y1="128" x2="315" y2="62"/>
  <polyline points="310,70 315,62 320,70"/>
  <text x="250" y="148" fill="currentColor" stroke="none">reactants</text>
  <text x="330" y="52" fill="currentColor" stroke="none">products</text>
  <text x="320" y="98" fill="currentColor" stroke="none">ΔH &gt; 0</text>
  <text x="240" y="190" fill="currentColor" stroke="none">Endothermic (e.g. dissociation)</text>
</svg>

**Worked numerical 1 (work).** A gas expands from 1 L to 5 L against a constant 1 atm. w = −1 × (5 − 1) = −4 L atm = −4 × 101.3 J = **−405 J** (work done by the gas).

**Worked numerical 2 (ΔH and ΔU).** N₂(g) + 3H₂(g) → 2NH₃(g), ΔH = −92.4 kJ at 298 K. Find ΔU.
Δn_g = 2 − 4 = −2. Δn_g RT = −2 × 8.314 × 298 = −4955 J = −4.96 kJ.
ΔU = ΔH − Δn_g RT = −92.4 − (−4.96) = **−87.4 kJ**.

### Types of enthalpy change

| Enthalpy of | Meaning | Value to remember |
|---|---|---|
| Formation (Δ_fH°) | 1 mol compound from elements in standard state | Zero for elements in standard state (O₂, graphite, H₂) |
| Combustion | 1 mol burnt completely in O₂ | Always negative; C(graphite) −393.5 kJ mol⁻¹ |
| Neutralisation | 1 mol H₂O formed from acid + base | Strong acid + strong base = **−57.1 kJ mol⁻¹** (constant, H⁺ + OH⁻ → H₂O); less for weak acid/base (energy spent in ionisation) |
| Atomisation | 1 mol gaseous atoms from element | — |
| Solution | 1 mol solute dissolved | NH₄Cl dissolving is endothermic |
| Fusion / vaporisation | Melting / boiling of 1 mol | H₂O: 6.01 and 40.7 kJ mol⁻¹ |
| Lattice | Separating 1 mol ionic solid into gaseous ions | NaCl +788 kJ mol⁻¹ |

Standard state: pure substance at **1 bar** and specified temperature (usually 298 K). Graphite (not diamond) is the standard state of carbon.

**Hess's law of constant heat summation (1840):** total enthalpy change is the same whether the reaction occurs in one step or many. Thermochemical equations can be added like algebra.

**Worked numerical 3 (Hess).** C + O₂ → CO₂, ΔH = −393.5 kJ; CO + ½O₂ → CO₂, ΔH = −283.0 kJ. Find ΔH for C + ½O₂ → CO.
Subtract the second from the first: ΔH = −393.5 − (−283.0) = **−110.5 kJ mol⁻¹**.

**Worked numerical 4 (bond enthalpy).** H₂ + Cl₂ → 2HCl. Bond enthalpies H–H 436, Cl–Cl 242, H–Cl 431 kJ mol⁻¹.
ΔH = (bonds broken) − (bonds formed) = (436 + 242) − 2 × 431 = 678 − 862 = **−184 kJ** (for 2 mol HCl).

> **PYQ:** TRE 1.0 (2023) asked: "For all the reactions, what is the nature of the chemical dissociation? (A) Exothermic (B) Reversible (C) Endothermic". Dissociation means breaking a molecule into smaller parts, which needs energy to break bonds, so the intended answer is **(C) Endothermic**. (Not every dissociation is reversible; no official key in our folder.)

## 3. Entropy, the second and third laws

- **Entropy (S)** = measure of disorder or randomness (more precisely, of the number of ways energy can be distributed). Unit J K⁻¹ mol⁻¹. ΔS = q_rev/T.
- Entropy order: **gas ≫ liquid > solid**. Entropy increases on melting, boiling, dissolving, heating, and when Δn_g > 0 (e.g. CaCO₃ → CaO + CO₂).
- **Second law:** the entropy of the universe (isolated system) increases in every spontaneous process: ΔS_total = ΔS_system + ΔS_surroundings > 0. Heat cannot flow by itself from cold to hot (Clausius); no engine converts heat completely into work (Kelvin–Planck).
- **Third law (Nernst heat theorem, 1906):** the entropy of a perfectly crystalline substance is zero at 0 K.
- **Trouton's rule:** ΔH_vap/T_b ≈ 88 J K⁻¹ mol⁻¹ for many non-associated liquids (water and alcohols deviate because of H-bonding).

## 4. Gibbs energy and spontaneity

**Gibbs free energy:** G = H − TS, so at constant T and P, **ΔG = ΔH − TΔS** (Gibbs–Helmholtz). ΔG = maximum non-expansion (useful) work.

| ΔH | ΔS | ΔG = ΔH − TΔS | Spontaneous? |
|---|---|---|---|
| − | + | Always − | At all temperatures |
| + | − | Always + | Never |
| − | − | − at low T | Only at low temperature |
| + | + | − at high T | Only at high temperature (melting of ice, CaCO₃ decomposition) |

- ΔG < 0 spontaneous; ΔG = 0 equilibrium; ΔG > 0 non-spontaneous (reverse is spontaneous).
- **ΔG° = −RT ln K = −2.303 RT log K.** K > 1 means ΔG° < 0.
- **ΔG° = −nFE°** for a cell (chapter 6).
- Spontaneous does not mean fast: diamond → graphite has ΔG < 0 but is extremely slow.

**Worked numerical 5.** ΔH = +40 kJ mol⁻¹ and ΔS = +100 J K⁻¹ mol⁻¹. Above which temperature is the reaction spontaneous?
At ΔG = 0, T = ΔH/ΔS = 40 000/100 = **400 K**. Above 400 K, TΔS > ΔH.

**Worked numerical 6.** K = 10 at 298 K. ΔG°?
ΔG° = −2.303 × 8.314 × 298 × log 10 = **−5.71 kJ mol⁻¹**.

## 5. Chemical equilibrium

A **reversible reaction** in a closed vessel reaches **dynamic equilibrium**: forward and backward rates are equal, concentrations stop changing (but reactions continue). It can be reached from either side. A **catalyst does not change the equilibrium position**; it only helps reach equilibrium faster.

**Law of mass action (Guldberg and Waage, 1864):** for aA + bB ⇌ cC + dD,

<div class="formula">

| Expression | Formula |
|---|---|
| Equilibrium constant (concentration) | Kc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ |
| In terms of partial pressures | Kp = (p_C)ᶜ(p_D)ᵈ / (p_A)ᵃ(p_B)ᵇ |
| Relation | **Kp = Kc (RT)^Δn**, Δn = (c + d) − (a + b) for gases |
| Reaction reversed | K′ = 1/K |
| Reaction multiplied by n | K′ = Kⁿ |
| Reactions added | K = K₁ × K₂ |

</div>

- Pure solids and pure liquids are not written in K (activity = 1). For CaCO₃(s) ⇌ CaO(s) + CO₂(g): Kp = p(CO₂).
- Kp = Kc when Δn = 0 (H₂ + I₂ ⇌ 2HI; N₂ + O₂ ⇌ 2NO). For N₂ + 3H₂ ⇌ 2NH₃, Δn = −2, Kp = Kc(RT)⁻². For PCl₅ ⇌ PCl₃ + Cl₂, Δn = +1.
- **Reaction quotient Q** (same expression, any moment): Q < K → reaction moves forward; Q > K → backward; Q = K → at equilibrium.
- K depends only on **temperature** (and how the equation is written), not on concentration, pressure or catalyst. For an exothermic reaction K decreases with rising temperature; for endothermic, K increases.

### Le Chatelier's principle (1884)

If a system at equilibrium is disturbed, it shifts in the direction that tends to undo the disturbance.

| Change | Shift |
|---|---|
| Add reactant / remove product | Forward |
| Increase pressure (decrease volume) | Toward **fewer gas moles** |
| Increase temperature | Toward **endothermic** direction |
| Add catalyst | No shift (equilibrium reached faster) |
| Add inert gas at constant volume | No shift |
| Add inert gas at constant pressure | Toward more gas moles |

**Applications**
- **Haber process** N₂ + 3H₂ ⇌ 2NH₃, ΔH = −92.4 kJ: high pressure (~200 atm), moderate temperature (~700 K, a compromise between yield and rate), iron catalyst with Mo/K₂O–Al₂O₃ promoters, NH₃ removed by cooling.
- **Contact process** 2SO₂ + O₂ ⇌ 2SO₃, exothermic: V₂O₅ catalyst, ~720 K, about 2 bar.
- Melting of ice (volume decreases on melting) is favoured by **high pressure** — ice skating, regelation.
- Increasing pressure has no effect on H₂ + I₂ ⇌ 2HI (Δn = 0).

## 6. Acids and bases

| Theory | Acid | Base | Limitation |
|---|---|---|---|
| Arrhenius (1884) | Gives H⁺ (H₃O⁺) in water | Gives OH⁻ in water | Only aqueous solutions; cannot explain NH₃ as base |
| Brønsted–Lowry (1923) | **Proton donor** | **Proton acceptor** | Cannot explain BF₃ |
| Lewis (1923) | **Electron-pair acceptor** | **Electron-pair donor** | Most general |

- **Conjugate pairs** differ by one H⁺: HCl/Cl⁻, H₂O/OH⁻, NH₄⁺/NH₃, H₂CO₃/HCO₃⁻. A strong acid has a weak conjugate base.
- **Amphiprotic** species act both ways: H₂O, HCO₃⁻, HSO₄⁻, H₂PO₄⁻.
- **Lewis acids:** BF₃, AlCl₃, FeCl₃, SO₃, CO₂, H⁺, metal cations (Ag⁺, Co³⁺) — they have empty orbitals. **Lewis bases:** NH₃, H₂O, OH⁻, CN⁻, R₃N, ethers, CO — they have lone pairs. Lewis acid = electrophile; Lewis base = nucleophile (chapter 10).

**Acid-strength orders (inorganic)**
- Hydrohalic acids (bond strength decides): **HI > HBr > HCl > HF** (HF is weak because the H–F bond is very strong).
- Oxyacids of the same element: more O → stronger: **HClO₄ > HClO₃ > HClO₂ > HClO**; H₂SO₄ > H₂SO₃; HNO₃ > HNO₂.
- Hypohalous acids: HOCl > HOBr > HOI (EN of halogen).
- Hydrides across a period: CH₄ < NH₃ < H₂O < HF (acidity). Down group 16: H₂O < H₂S < H₂Se < H₂Te.
- Basicity of hydrides of group 15: **NH₃ > PH₃ > AsH₃ > SbH₃** (chapter 8).
- HClO₄ is among the strongest common acids; the "superacid" fluoroantimonic acid is stronger still.

## 7. pH and the ionic product of water

- Water self-ionises: H₂O ⇌ H⁺ + OH⁻. **Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ at 25 °C.** Kw increases with temperature (ionisation is endothermic): ~10⁻¹³ at about 60 °C, so pure water at higher temperature has pH < 7 but is still neutral.
- **pH = −log[H⁺]** (Sørensen, 1909); pOH = −log[OH⁻]; **pH + pOH = 14** at 25 °C. pKa + pKb = 14 for a conjugate pair.
- Each unit drop in pH = 10 times more [H⁺].

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <rect x="20" y="80" width="380" height="30"/>
  <line x1="210" y1="75" x2="210" y2="115"/>
  <text x="20" y="130" fill="currentColor" stroke="none">0</text>
  <text x="203" y="130" fill="currentColor" stroke="none">7</text>
  <text x="385" y="130" fill="currentColor" stroke="none">14</text>
  <text x="60" y="100" fill="currentColor" stroke="none">acidic</text>
  <text x="300" y="100" fill="currentColor" stroke="none">basic</text>
  <text x="25" y="60" fill="currentColor" stroke="none" font-size="10">gastric juice 1.2–3</text>
  <text x="110" y="45" fill="currentColor" stroke="none" font-size="10">lemon ~2.2, vinegar ~3</text>
  <text x="150" y="160" fill="currentColor" stroke="none" font-size="10">milk 6.8, pure water 7, blood 7.35–7.45</text>
  <text x="260" y="60" fill="currentColor" stroke="none" font-size="10">baking soda ~8.3</text>
  <text x="300" y="185" fill="currentColor" stroke="none" font-size="10">milk of magnesia ~10, NaOH (1 M) 14</text>
  <text x="15" y="185" fill="currentColor" stroke="none" font-size="10">rain is acid rain below 5.6</text>
</svg>

**Worked numerical 7.** pH of 0.001 M HCl? [H⁺] = 10⁻³ → **pH = 3**.

**Worked numerical 8.** pH of 0.01 M NaOH? pOH = 2 → **pH = 12**.

**Worked numerical 9.** pH of 0.005 M H₂SO₄ (fully ionised)? [H⁺] = 2 × 0.005 = 0.01 M → **pH = 2**.

**Worked numerical 10 (the trap).** pH of 10⁻⁸ M HCl?
Not 8! An acid cannot give a basic pH. Water's own H⁺ must be added: [H⁺] = 10⁻⁸ + x, with (10⁻⁸ + x)x = 10⁻¹⁴ → x = 9.5 × 10⁻⁸. Total [H⁺] = 1.05 × 10⁻⁷ → **pH ≈ 6.98** (just below 7).

**Worked numerical 11.** pH of a solution with [OH⁻] = 2 × 10⁻³ M? pOH = 3 − log 2 = 2.70 → **pH = 11.30**.

## 8. Weak electrolytes, buffers and hydrolysis

**Ostwald's dilution law:** for a weak acid HA of concentration C and degree of ionisation α, Ka = Cα²/(1 − α) ≈ Cα². So **α = √(Ka/C)** and **[H⁺] = √(Ka·C)**. Dilution increases α.

**Worked numerical 12.** 0.1 M acetic acid, Ka = 1.8 × 10⁻⁵. Find [H⁺], pH and α.
[H⁺] = √(1.8 × 10⁻⁵ × 0.1) = √(1.8 × 10⁻⁶) = 1.34 × 10⁻³ M → **pH = 2.87**; α = 1.34 × 10⁻³/0.1 = **1.34%**.

**Common ion effect:** adding a salt with a common ion suppresses ionisation of a weak electrolyte (CH₃COONa suppresses CH₃COOH; NH₄Cl suppresses NH₄OH — used in group III of salt analysis to precipitate only Fe³⁺, Al³⁺, Cr³⁺ hydroxides).

**Buffer** = solution that resists change in pH on adding small amounts of acid or base.
- Acidic buffer: weak acid + its salt with strong base (CH₃COOH + CH₃COONa, pH ≈ 4.74).
- Basic buffer: weak base + its salt with strong acid (NH₄OH + NH₄Cl, pH ≈ 9.25).
- Blood buffer: H₂CO₃/HCO₃⁻ (main), also phosphate and proteins; keeps pH 7.35–7.45.
- **Henderson–Hasselbalch equation:** pH = pKa + log([salt]/[acid]); pOH = pKb + log([salt]/[base]). Maximum buffer capacity when [salt] = [acid] (pH = pKa).

**Worked numerical 13.** Buffer of 0.1 M CH₃COOH and 0.1 M CH₃COONa (pKa 4.74) → pH = **4.74**. If salt is 1.0 M and acid 0.1 M: pH = 4.74 + log 10 = **5.74**.

**Salt hydrolysis**

| Salt from | Example | Solution | pH |
|---|---|---|---|
| Strong acid + strong base | NaCl, KNO₃, Na₂SO₄ | Neutral, no hydrolysis | 7 |
| Weak acid + strong base | CH₃COONa, Na₂CO₃, NaHCO₃, KCN | Basic (anion hydrolyses) | > 7 |
| Strong acid + weak base | NH₄Cl, CuSO₄, FeCl₃, AlCl₃ | Acidic (cation hydrolyses) | < 7 |
| Weak acid + weak base | CH₃COONH₄ | Depends on Ka vs Kb (≈ 7 for ammonium acetate) | ~7 |

For a salt of weak acid and strong base: pH = 7 + ½pKa + ½log C.

## 9. Solubility product

For a sparingly soluble salt AₓBᵧ ⇌ xAʸ⁺ + yBˣ⁻, **Ksp = [Aʸ⁺]ˣ[Bˣ⁻]ʸ** at saturation. If solubility is s mol L⁻¹:

| Salt type | Example | Ksp in terms of s |
|---|---|---|
| AB | AgCl, BaSO₄ | s² |
| AB₂ or A₂B | CaF₂, PbI₂, Ag₂CrO₄ | 4s³ |
| AB₃ | Fe(OH)₃, Al(OH)₃ | 27s⁴ |
| A₃B₂ | Ca₃(PO₄)₂ | 108s⁵ |

- **Precipitation occurs when ionic product > Ksp.** Common ion lowers solubility (AgCl less soluble in NaCl solution).
- **Salt analysis:** group II sulphides (CuS, PbS, CdS — very low Ksp) are precipitated by H₂S in **acidic** medium (HCl suppresses S²⁻); group IV sulphides (ZnS, MnS, NiS, CoS) need **ammoniacal** medium.
- Purification of common salt: passing HCl gas into saturated NaCl solution precipitates pure NaCl (common ion effect).

**Worked numerical 14.** Ksp of AgCl = 1.8 × 10⁻¹⁰. Solubility? s = √(1.8 × 10⁻¹⁰) = **1.34 × 10⁻⁵ mol L⁻¹**.

**Worked numerical 15.** Ksp of CaF₂ = 4 × 10⁻¹¹. s = (Ksp/4)^(1/3) = (10⁻¹¹)^(1/3) = **2.15 × 10⁻⁴ mol L⁻¹**.

## 10. Acid–base indicators and titrations

| Indicator | pH range | Colour (acid → base) | Use |
|---|---|---|---|
| Methyl orange | 3.1–4.4 | Red → yellow | Strong acid vs weak base (HCl vs Na₂CO₃/NH₄OH) |
| Methyl red | 4.2–6.3 | Red → yellow | Strong acid vs weak base |
| Litmus | 5–8 | Red → blue | General test (not for titration) |
| Bromothymol blue | 6.0–7.6 | Yellow → blue | Strong vs strong |
| Phenolphthalein | 8.2–10 | Colourless → pink | Weak acid vs strong base (CH₃COOH vs NaOH) |

- Strong acid vs strong base: both methyl orange and phenolphthalein work (big pH jump 3–11).
- Weak acid vs weak base: no sharp end point; no simple indicator is suitable.
- **Natural indicators:** litmus (from lichens), turmeric (yellow → reddish-brown in base), red cabbage, hydrangea, China rose petals. **Olfactory indicators:** onion, vanilla, clove oil (smell disappears in base).

## Traps and exceptions

- **pH of 10⁻⁸ M HCl is about 6.98**, not 8.
- Pure water at 80 °C has pH < 7 yet is **neutral** ([H⁺] = [OH⁻]).
- **A catalyst does not change K or the equilibrium yield.**
- K changes only with temperature. Pressure changes the position but not K.
- **Kp = Kc only when Δn_g = 0.**
- Enthalpy of neutralisation is −57.1 kJ mol⁻¹ only for strong acid + strong base; less negative for weak ones (CH₃COOH + NaOH ≈ −55.2 kJ mol⁻¹).
- Δ_fH° of elements in standard state is zero — of graphite, not of diamond; of O₂, not of O₃.
- Spontaneous ≠ fast.
- HF is a **weak** acid though F is most electronegative.
- NH₄Cl solution is acidic; Na₂CO₃ and CH₃COONa solutions are basic.
- Degree of ionisation of a weak acid **increases** on dilution, but [H⁺] decreases.
- Lewis acid BF₃ is not a Brønsted acid (no proton).

## Quick revision

1. ΔU = q + w (IUPAC sign convention).
2. w = −P_ext ΔV; 1 L atm = 101.3 J.
3. ΔH = ΔU + Δn_g RT.
4. Hess's law — enthalpy is a state function.
5. Neutralisation (strong/strong) = −57.1 kJ mol⁻¹.
6. ΔG = ΔH − TΔS; ΔG < 0 spontaneous.
7. ΔG° = −2.303 RT log K = −nFE°.
8. Third law: S = 0 for perfect crystal at 0 K.
9. Law of mass action — Guldberg and Waage (1864).
10. Kp = Kc(RT)^Δn.
11. Le Chatelier: pressure → fewer gas moles; heat → endothermic side.
12. Haber: ~200 atm, ~700 K, Fe catalyst (Mo promoter).
13. Kw = 10⁻¹⁴ at 25 °C; increases with temperature.
14. pH + pOH = 14.
15. Lewis acid accepts electron pair (BF₃, AlCl₃).
16. α = √(Ka/C) (Ostwald).
17. Henderson: pH = pKa + log(salt/acid).
18. Blood pH 7.35–7.45; main buffer H₂CO₃/HCO₃⁻.
19. Ksp of AB = s²; AB₂ = 4s³; AB₃ = 27s⁴.
20. Phenolphthalein 8.2–10 (colourless → pink); methyl orange 3.1–4.4 (red → yellow).
21. Acid strength: HI > HBr > HCl > HF; HClO₄ > HClO₃ > HClO₂ > HClO.
22. Dissociation (bond breaking) is endothermic.
23. Acid rain: pH below 5.6.

## Practice with answers

1. Is heat a state function? — **No** (it is a path function).
2. Which property is zero for an element in its standard state? — **Standard enthalpy of formation**.
3. ΔH − ΔU for H₂ + I₂ → 2HI? — **Zero** (Δn_g = 0).
4. Sign of ΔS when water freezes? — **Negative** (order increases).
5. A reaction with ΔH < 0 and ΔS > 0 is spontaneous when? — **At all temperatures**.
6. Effect of a catalyst on K? — **None** (both rates increase equally).
7. For PCl₅ ⇌ PCl₃ + Cl₂, increasing pressure shifts equilibrium? — **Backward** (fewer gas moles).
8. Kp/Kc for N₂ + 3H₂ ⇌ 2NH₃? — **(RT)⁻²** (Δn = −2).
9. Conjugate base of H₂SO₄? — **HSO₄⁻**.
10. Conjugate acid of NH₃? — **NH₄⁺**.
11. pH of 10⁻⁴ M KOH? — **10** (pOH 4).
12. Nature of aqueous Na₂CO₃? — **Basic** (CO₃²⁻ hydrolyses).
13. Indicator for CH₃COOH vs NaOH? — **Phenolphthalein** (end point pH ~8.7).
14. Solubility of BaSO₄ if Ksp = 1 × 10⁻¹⁰? — **10⁻⁵ mol L⁻¹** (√Ksp).
15. Strongest acid among HF, HCl, HBr, HI? — **HI** (weakest H–X bond).
16. Lewis acid among NH₃, BF₃, H₂O? — **BF₃** (electron-deficient boron).
17. pH of buffer when [salt] = [acid]? — **pH = pKa**.
18. Which law states S = 0 at 0 K for perfect crystals? — **Third law of thermodynamics**.
19. In the Haber process, why not use a very low temperature? — **Rate becomes too slow** (compromise ~700 K).
20. pH of pure water at 25 °C? — **7**.

Class-10 level acid–base and salt facts are also in [Acids, Bases, Metals and Everyday Chemistry](/interview/bpsc-2027/science/acids-bases-metals-and-everyday-chemistry).
