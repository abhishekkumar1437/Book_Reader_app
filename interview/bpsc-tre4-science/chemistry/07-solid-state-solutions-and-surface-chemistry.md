---
title: Solid State, Solutions and Surface Chemistry
part: Physical Chemistry
summary: Crystalline and amorphous solids, unit cells, packing, voids, ionic structures, density numericals, defects, magnetic solids and spinels; solutions, Henry's and Raoult's laws, azeotropes and colligative properties; adsorption, colloids, Tyndall effect, Hardy–Schulze rule and emulsions.
---

This chapter covers three NCERT class 12 units (Solid State, Solutions, Surface Chemistry) plus B.Sc. solid-state points such as spinels and their preparation. TRE 1.0 opened its chemistry section with "Which method gives high homogeneity in ZnFe₂O₄ spinel?" and "___ is a crystalline solid's basic repetitive structural unit". Colligative property numericals and colloid facts (Tyndall effect, gold number, Hardy–Schulze) are classic one-liners.

> **In simple words:** In a crystal, one small box of atoms (the **unit cell**) repeats in all directions, like bricks in a wall. In solutions, many properties depend only on **how many** solute particles there are, not what they are (colligative properties). Colloids are "in-between" mixtures with particles big enough to scatter light.

## 1. Crystalline and amorphous solids

| Crystalline | Amorphous |
|---|---|
| Regular, long-range order | Only short-range order |
| Sharp melting point | Soften over a range of temperature |
| **Anisotropic** (properties differ with direction) | **Isotropic** |
| Clean cleavage along planes | Irregular (conchoidal) cut |
| Definite heat of fusion | No definite heat of fusion |
| NaCl, quartz, diamond, ice, sugar | Glass, rubber, plastics, quartz glass, amorphous silica |

Glass is called a **supercooled liquid** (pseudo-solid); old window panes are slightly thicker at the bottom.

| Type of crystalline solid | Particles and force | Examples | Properties |
|---|---|---|---|
| Molecular — non-polar | Molecules, dispersion forces | Ar, CCl₄, H₂, I₂, CO₂ (dry ice) | Soft, very low m.p., insulators |
| Molecular — polar | Dipole–dipole | HCl, SO₂, solid NH₃ | Low m.p. |
| Molecular — H-bonded | H-bonds | Ice | Hard-ish, low m.p. |
| Ionic | Ions, electrostatic | NaCl, MgO, ZnS, CaF₂ | Hard, brittle, high m.p., conduct when molten |
| Metallic | Cations in electron sea | Cu, Fe, Mg | Malleable, ductile, conduct |
| Covalent (network) | Atoms, covalent bonds | Diamond, SiO₂ (quartz), SiC, AlN | Very hard, very high m.p., insulators (graphite is an exception — soft, conducts) |

## 2. Lattice, unit cell and crystal systems

- **Crystal lattice:** regular 3-D arrangement of points representing particles.
- **Unit cell:** the smallest repeating portion of the lattice which, when repeated in all directions, generates the whole crystal. Described by edge lengths a, b, c and angles α, β, γ.

> **PYQ:** TRE 1.0 (2023) asked: "___ is a crystalline solid's basic repetitive structural unit. (A) Monomer (B) Molecule (C) Unit cell". Correct: **(C) Unit cell**.

**7 crystal systems and 14 Bravais lattices (Bravais, 1848)**

| System | Axes | Angles | Bravais lattices | Example |
|---|---|---|---|---|
| Cubic | a = b = c | all 90° | 3 (simple, bcc, fcc) | NaCl, ZnS, Cu, KCl |
| Tetragonal | a = b ≠ c | all 90° | 2 (simple, body-centred) | White tin, SnO₂, TiO₂ |
| Orthorhombic | a ≠ b ≠ c | all 90° | 4 (simple, bc, fc, end-centred) | Rhombic sulphur, KNO₃, BaSO₄ |
| Hexagonal | a = b ≠ c | α = β = 90°, γ = 120° | 1 | Graphite, ZnO, Mg, Zn |
| Rhombohedral (trigonal) | a = b = c | α = β = γ ≠ 90° | 1 | Calcite (CaCO₃), HgS (cinnabar) |
| Monoclinic | a ≠ b ≠ c | α = γ = 90°, β ≠ 90° | 2 | Monoclinic sulphur, Na₂SO₄·10H₂O |
| Triclinic | a ≠ b ≠ c | all different, none 90° | 1 | K₂Cr₂O₇, CuSO₄·5H₂O, H₃BO₃ |

Most symmetric: cubic; least symmetric: triclinic.

## 3. Cubic unit cells and packing

**Counting atoms per unit cell:** corner atom = 1/8, face-centre = 1/2, edge-centre = 1/4, body-centre = 1.

| Cell | Atoms per cell (Z) | Coordination number | Relation of a and r | Packing efficiency | Examples |
|---|---|---|---|---|---|
| Simple cubic (sc) | 8 × 1/8 = **1** | 6 | a = 2r | **52.4%** | Polonium |
| Body-centred (bcc) | 1 + 1 = **2** | 8 | √3 a = 4r | **68%** | Na, K, Fe (α), Cr, W |
| Face-centred (fcc = ccp) | 1 + 3 = **4** | 12 | √2 a = 4r | **74%** | Cu, Ag, Au, Al, Ni |
| Hexagonal close-packed (hcp) | 6 per hexagonal cell | 12 | — | **74%** | Mg, Zn, Ti, Be |

- **ABAB…** stacking = hcp; **ABCABC…** stacking = ccp (fcc). Both are the most efficient (74%).
- **Voids:** for N close-packed spheres there are **N octahedral** and **2N tetrahedral** voids. In fcc (4 atoms): 4 octahedral voids (body centre + 12 edge-centres × ¼) and 8 tetrahedral voids.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <rect x="20" y="60" width="80" height="80"/>
  <rect x="45" y="35" width="80" height="80" stroke-dasharray="3 3"/>
  <line x1="20" y1="60" x2="45" y2="35"/><line x1="100" y1="60" x2="125" y2="35"/>
  <line x1="20" y1="140" x2="45" y2="115"/><line x1="100" y1="140" x2="125" y2="115"/>
  <circle cx="20" cy="60" r="4"/><circle cx="100" cy="60" r="4"/><circle cx="20" cy="140" r="4"/><circle cx="100" cy="140" r="4"/>
  <circle cx="45" cy="35" r="4"/><circle cx="125" cy="35" r="4"/><circle cx="45" cy="115" r="4"/><circle cx="125" cy="115" r="4"/>
  <text x="25" y="170" fill="currentColor" stroke="none">simple cubic: Z = 1</text>
  <rect x="160" y="60" width="80" height="80"/>
  <rect x="185" y="35" width="80" height="80" stroke-dasharray="3 3"/>
  <line x1="160" y1="60" x2="185" y2="35"/><line x1="240" y1="60" x2="265" y2="35"/>
  <line x1="160" y1="140" x2="185" y2="115"/><line x1="240" y1="140" x2="265" y2="115"/>
  <circle cx="160" cy="60" r="4"/><circle cx="240" cy="60" r="4"/><circle cx="160" cy="140" r="4"/><circle cx="240" cy="140" r="4"/>
  <circle cx="185" cy="35" r="4"/><circle cx="265" cy="35" r="4"/><circle cx="185" cy="115" r="4"/><circle cx="265" cy="115" r="4"/>
  <circle cx="212" cy="88" r="6"/>
  <text x="170" y="170" fill="currentColor" stroke="none">bcc: Z = 2</text>
  <rect x="300" y="60" width="80" height="80"/>
  <rect x="325" y="35" width="80" height="80" stroke-dasharray="3 3"/>
  <line x1="300" y1="60" x2="325" y2="35"/><line x1="380" y1="60" x2="405" y2="35"/>
  <line x1="300" y1="140" x2="325" y2="115"/><line x1="380" y1="140" x2="405" y2="115"/>
  <circle cx="300" cy="60" r="4"/><circle cx="380" cy="60" r="4"/><circle cx="300" cy="140" r="4"/><circle cx="380" cy="140" r="4"/>
  <circle cx="325" cy="35" r="4"/><circle cx="405" cy="35" r="4"/><circle cx="325" cy="115" r="4"/><circle cx="405" cy="115" r="4"/>
  <circle cx="340" cy="100" r="5"/><circle cx="365" cy="75" r="5" stroke-dasharray="2 2"/>
  <circle cx="312" cy="88" r="5"/><circle cx="392" cy="88" r="5"/><circle cx="352" cy="48" r="5"/><circle cx="352" cy="128" r="5"/>
  <text x="310" y="170" fill="currentColor" stroke="none">fcc: Z = 4</text>
  <text x="120" y="195" fill="currentColor" stroke="none" font-size="10">small dots: corners (1/8 each); big dots: body or face centres</text>
</svg>

<div class="formula">

| Quantity | Formula |
|---|---|
| Density of crystal | ρ = Z × M / (a³ × Nₐ) |
| fcc radius | r = a / (2√2) = 0.3536 a |
| bcc radius | r = √3 a / 4 = 0.433 a |
| sc radius | r = a / 2 |

</div>

**Worked numerical 1.** Copper is fcc with a = 361 pm; M = 63.5 g mol⁻¹. Density?
a = 3.61 × 10⁻⁸ cm → a³ = 4.70 × 10⁻²³ cm³. ρ = (4 × 63.5)/(4.70 × 10⁻²³ × 6.022 × 10²³) = 254/28.3 = **≈ 8.97 g cm⁻³** (actual 8.96). Radius r = 361/(2√2) = **127.6 pm**.

**Worked numerical 2.** An element (M = 60) has bcc structure; how many atoms are in 60 g, and how many unit cells? Atoms = Nₐ = 6.022 × 10²³; unit cells = Nₐ/2 = **3.01 × 10²³**.

**Worked numerical 3.** In a compound, B atoms form ccp and A atoms occupy ⅓ of the tetrahedral voids. Formula? Per B atom there are 2 tetrahedral voids; ⅓ × 2 = ⅔ A per B → A₂B₃.

## 4. Ionic crystal structures and radius ratio

**Radius ratio (r₊/r₋)** decides the coordination number and shape of the cation site:

| r₊/r₋ | Coordination number | Void / geometry | Example |
|---|---|---|---|
| 0.155–0.225 | 3 | Triangular | B₂O₃ |
| 0.225–0.414 | 4 | Tetrahedral | ZnS |
| 0.414–0.732 | 6 | Octahedral | NaCl |
| 0.732–1.000 | 8 | Cubic | CsCl |

| Structure | Lattice | Coordination (cation : anion) | Formula units per cell | Other examples |
|---|---|---|---|---|
| Rock salt (NaCl) | Cl⁻ fcc, Na⁺ in all octahedral voids | 6 : 6 | 4 | KCl, MgO, AgCl, LiF |
| Caesium chloride | Cl⁻ simple cubic, Cs⁺ at body centre | 8 : 8 | 1 | CsBr, CsI, NH₄Cl |
| Zinc blende (ZnS) | S²⁻ fcc, Zn²⁺ in half the tetrahedral voids | 4 : 4 | 4 | CuCl, AgI, diamond-like |
| Fluorite (CaF₂) | Ca²⁺ fcc, F⁻ in all tetrahedral voids | 8 : 4 | 4 | SrF₂, BaCl₂ |
| Antifluorite (Na₂O) | O²⁻ fcc, Na⁺ in all tetrahedral voids | 4 : 8 | 4 | Li₂O, K₂O |

On applying high pressure, NaCl (6:6) changes to CsCl type (8:8); on heating, CsCl changes to NaCl type.

## 5. Imperfections (defects) in solids

| Defect | What happens | Density | Found in |
|---|---|---|---|
| **Schottky** | Equal number of cations and anions missing | **Decreases** | NaCl, KCl, CsCl, KBr, AgBr (ions of similar size, high CN) |
| **Frenkel** (dislocation) | Smaller ion (usually cation) leaves its site and sits in an interstitial void | **No change** | ZnS, AgCl, AgBr, AgI (large size difference, low CN) |
| Metal excess — anion vacancy (**F-centre**) | Anion missing; electron trapped in its place gives colour | Decreases | NaCl heated in Na vapour → **yellow**; KCl → **violet**; LiCl → **pink** |
| Metal excess — interstitial cation | Extra cation plus electron in interstitial site | — | ZnO turns **yellow on heating** (loses O) |
| Metal deficiency | Some cations show higher charge, leaving vacancies | — | FeO (actually Fe₀.₉₅O), FeS, NiO |
| Impurity (substitution) | e.g. Sr²⁺ in NaCl replaces two Na⁺ → one cation vacancy | — | NaCl + SrCl₂, AgCl + CdCl₂ |

AgBr shows **both** Schottky and Frenkel defects. F-centre: "F" from German *Farbe* = colour.

## 6. Electrical and magnetic properties

- **Conductors** (10⁴–10⁷ S m⁻¹), **semiconductors** (10⁻⁶–10⁴), **insulators** (10⁻²⁰–10⁻¹⁰). Band theory: small band gap in semiconductors; conductivity of semiconductors **increases** with temperature.
- **n-type:** Si/Ge doped with group-15 (P, As) — extra electrons. **p-type:** doped with group-13 (B, Al, Ga) — holes. (Details in the physics book: [Electronics and Communication](/interview/bpsc-tre4-science/physics/electronics-and-communication).)
- 12–16 and 13–15 compounds (ZnS, CdS, GaAs, InSb, AlP) are semiconductors too.

| Magnetic type | Alignment of moments | Example |
|---|---|---|
| Diamagnetic | All electrons paired; weakly repelled | NaCl, H₂O, benzene, Zn, TiO₂ |
| Paramagnetic | Unpaired electrons, random; weakly attracted | O₂, Cu²⁺, Fe³⁺, Cr³⁺ |
| Ferromagnetic | Domains aligned parallel; strongly attracted, permanent magnet | Fe, Co, Ni, Gd, CrO₂ |
| Antiferromagnetic | Equal moments aligned antiparallel → zero net | MnO, MnO₂, Mn₂O₃ |
| Ferrimagnetic | Unequal antiparallel moments → small net | **Fe₃O₄ (magnetite), ferrites MgFe₂O₄, ZnFe₂O₄** |

Above the Curie temperature, ferro- and ferrimagnets become paramagnetic.

### Spinels (B.Sc.)

**Spinel** = mixed oxide AB₂O₄ (A²⁺, B³⁺), named after the mineral MgAl₂O₄. Oxide ions form a ccp array (32 O²⁻ per cell, 8 formula units).

| Type | A²⁺ sits in | B³⁺ sits in | Examples |
|---|---|---|---|
| Normal spinel | ⅛ of tetrahedral voids | ½ of octahedral voids | MgAl₂O₄, **ZnFe₂O₄**, Co₃O₄, Mn₃O₄ |
| Inverse spinel | Octahedral voids | Half of B³⁺ tetrahedral, half octahedral: B(AB)O₄ | **Fe₃O₄**, NiFe₂O₄, CoFe₂O₄, MgFe₂O₄ (largely) |

Crystal-field stabilisation decides normal vs inverse: Ni²⁺ (d⁸) strongly prefers octahedral sites, so NiFe₂O₄ is inverse; Fe³⁺ (d⁵) and Zn²⁺ (d¹⁰) have no preference, so ZnFe₂O₄ is normal.

**Preparation:** the ceramic (solid-state) method grinds and heats oxides at high temperature, giving poor mixing. The **co-precipitation method** precipitates both metal ions together from a common solution (e.g. Zn²⁺ and Fe³⁺ as hydroxides or oxalates), so the ions are mixed at the atomic level; heating then gives a **highly homogeneous** product with small particle size at lower temperature. Sol–gel and hydrothermal methods are other wet routes.

> **PYQ:** TRE 1.0 (2023) asked: "Which method can be employed to produce a high degree of homogeneity in the creation of ZnFe₂O₄ spinel? (A) Distillation method (B) Vaporization method (C) Coprecipitation method". Correct: **(C) Coprecipitation method**.

## 7. Solutions

A **solution** is a homogeneous mixture; the component in larger amount is the **solvent**. Types include gas in gas (air), gas in liquid (soda water), liquid in liquid (ethanol in water), solid in liquid (sugar solution), solid in solid (alloys like brass), liquid in solid (amalgam of Hg with Na), gas in solid (H₂ in Pd).

**Solubility of solids** in water usually rises with temperature (if dissolving is endothermic), but falls for some (Ce₂(SO₄)₃, Li₂CO₃). **Solubility of gases** falls with temperature (fish need cold water; dissolved O₂ is less in summer) and rises with pressure.

**Henry's law (1803):** the partial pressure of a gas over a solution is proportional to its mole fraction in solution: **p = K_H × x**. Higher K_H → lower solubility.
- Soft drinks are bottled under high CO₂ pressure.
- **Bends** in scuba divers: N₂ dissolved under high pressure forms bubbles in blood on fast ascent; tanks use He-diluted air (11.7% He, 56.2% N₂, 32.1% O₂ in NCERT).
- At high altitude, low O₂ partial pressure causes **anoxia**.

**Raoult's law (1887):** for a solution of volatile liquids, pᵢ = xᵢ pᵢ°; total p = x_A p_A° + x_B p_B°. For a non-volatile solute, the vapour pressure of the solution = x(solvent) × p°.

| Ideal solution | Positive deviation | Negative deviation |
|---|---|---|
| Obeys Raoult's law at all compositions; ΔH_mix = 0, ΔV_mix = 0 | A–B attraction weaker than A–A and B–B; ΔH_mix > 0, ΔV_mix > 0 | A–B attraction stronger; ΔH_mix < 0, ΔV_mix < 0 |
| n-hexane + n-heptane, benzene + toluene, bromoethane + chloroethane | Ethanol + water, ethanol + cyclohexane, acetone + CS₂, acetone + ethanol | Chloroform + acetone (H-bond forms), HNO₃ + water, HCl + water, phenol + aniline |
| — | Forms **minimum-boiling azeotrope**: 95.6% ethanol + water (b.p. 351.1 K) | Forms **maximum-boiling azeotrope**: 68% HNO₃ + water (b.p. 393.5 K) |

An **azeotrope** boils at constant temperature with the same composition in liquid and vapour, so it cannot be separated by fractional distillation. That is why rectified spirit is only about 95% ethanol; absolute alcohol needs benzene (azeotropic distillation) or CaO.

## 8. Colligative properties

**Colligative properties** depend only on the **number** of solute particles, not their nature (for dilute solutions of non-volatile solutes).

<div class="formula">

| Property | Formula | Notes |
|---|---|---|
| Relative lowering of vapour pressure | (p° − p)/p° = x(solute) ≈ n₂/n₁ | Raoult |
| Elevation of boiling point | ΔT_b = i K_b m | K_b(water) = 0.52 K kg mol⁻¹ |
| Depression of freezing point | ΔT_f = i K_f m | K_f(water) = 1.86 K kg mol⁻¹; benzene 5.12 |
| Osmotic pressure | π = i C R T | van 't Hoff (1886); C in mol L⁻¹ |
| Molar mass from ΔT | M₂ = (K × w₂ × 1000)/(ΔT × w₁) | w in grams |

</div>

- **Osmosis:** flow of solvent through a semipermeable membrane from dilute to concentrated solution. **Osmotic pressure** is the extra pressure needed to stop it. Best method for molar mass of polymers and proteins (measured at room temperature, large values even for dilute solutions).
- **Isotonic** solutions have equal osmotic pressure: **0.9% NaCl (normal saline)** is isotonic with blood cells. In a **hypertonic** solution cells shrink (plasmolysis); in a **hypotonic** solution they swell and may burst (haemolysis).
- **Reverse osmosis:** applying pressure greater than π pushes pure water out of salt water — used for desalination and RO water purifiers (cellulose acetate membrane).
- Everyday examples: salting of meat and pickles, raisins swelling in water, salt sprinkled on icy roads, antifreeze (ethylene glycol) in car radiators, dried fruit, wilted flowers reviving in fresh water.

**van 't Hoff factor (i)** = observed colligative property / calculated value = (number of particles after association/dissociation) / (before).

| Solute | i (ideal) | Reason |
|---|---|---|
| Glucose, urea, sucrose | 1 | Non-electrolyte |
| NaCl, KCl, MgSO₄ | 2 | 2 ions |
| CaCl₂, K₂SO₄, Na₂SO₄ | 3 | 3 ions |
| AlCl₃, K₃[Fe(CN)₆] | 4 | 4 ions |
| K₄[Fe(CN)₆], Al₂(SO₄)₃ | 5 | 5 ions |
| Ethanoic acid in benzene | ≈ 0.5 | Dimerisation (H-bonding) |

Dissociation → observed molar mass lower than true (i > 1); association → higher (i < 1).

**Worked numerical 4.** Freezing point of 0.1 m aqueous glucose? ΔT_f = 1.86 × 0.1 = 0.186 K → **−0.186 °C**. For 0.1 m NaCl (i = 2): ΔT_f = 0.372 K → −0.372 °C.

**Worked numerical 5.** Boiling point of a solution of 18 g glucose in 1 kg water? m = 18/180 = 0.1 → ΔT_b = 0.52 × 0.1 = 0.052 K → **100.052 °C**.

**Worked numerical 6.** Osmotic pressure of 0.1 M glucose at 300 K? π = CRT = 0.1 × 0.0821 × 300 = **2.46 atm**.

**Worked numerical 7.** 1.8 g of a non-electrolyte in 100 g water freezes at −0.186 °C. Molar mass?
M = (1.86 × 1.8 × 1000)/(0.186 × 100) = 3348/18.6 = **180 g mol⁻¹**.

**Worked numerical 8.** Lowest freezing point among 0.1 m solutions of glucose, NaCl, CaCl₂ and AlCl₃? Largest i → **AlCl₃** (i = 4). Order of ΔT_f: AlCl₃ > CaCl₂ > NaCl > glucose.

## 9. Adsorption

**Adsorption** = accumulation of molecules on the **surface** of a solid or liquid (surface phenomenon). **Absorption** = uniform distribution through the **bulk** (water by sponge). **Sorption** = both together. The substance on which adsorption occurs is the **adsorbent** (charcoal, silica gel); the substance adsorbed is the **adsorbate**. Adsorption is **exothermic** and ΔS is negative.

| Physisorption | Chemisorption |
|---|---|
| van der Waals forces | Chemical bonds |
| Low heat (20–40 kJ mol⁻¹) | High heat (80–240 kJ mol⁻¹) |
| Not specific; reversible | Highly specific; irreversible |
| Multimolecular layers | Unimolecular layer |
| Decreases with rise in temperature | First increases, then decreases (needs activation) |
| Easily liquefiable gases adsorbed more (higher critical temperature: NH₃, SO₂ > H₂, N₂) | — |

**Freundlich adsorption isotherm:** x/m = k P^(1/n) (n > 1). log(x/m) = log k + (1/n) log P — straight line, slope 1/n. **Langmuir isotherm** assumes a monolayer.

**Applications:** gas masks (activated charcoal), silica gel and alumina as drying agents, decolourising sugar (animal charcoal), chromatography, heterogeneous catalysis, froth flotation of sulphide ores (pine oil), adsorption indicators (eosin, fluorescein), high vacuum (charcoal in Dewar flasks), ion-exchange water softening.

## 10. Colloids

**Particle size:** true solution < 1 nm; **colloid 1–1000 nm**; suspension > 1000 nm. Colloids pass through filter paper but not through parchment or animal membranes.

| Dispersed phase | Dispersion medium | Type | Examples |
|---|---|---|---|
| Solid | Gas | Aerosol | Smoke, dust |
| Liquid | Gas | Aerosol | Fog, mist, clouds, insecticide spray |
| Gas | Liquid | Foam | Soap lather, whipped cream, soda water froth |
| Gas | Solid | Solid foam | Pumice, foam rubber, bread |
| Liquid | Liquid | **Emulsion** | Milk, hair cream, cod-liver oil |
| Liquid | Solid | **Gel** | Cheese, butter, jelly, curd |
| Solid | Liquid | Sol | Paints, cell fluids, gold sol, starch solution |
| Solid | Solid | Solid sol | Coloured glass, gemstones, some alloys |

(Gas in gas cannot form a colloid — gases mix completely.)

| Lyophilic (solvent-loving) | Lyophobic (solvent-hating) |
|---|---|
| Starch, gum, gelatin, proteins in water | Metal sols (Au, Ag), metal sulphides, Fe(OH)₃ |
| Formed directly by mixing | Need special methods |
| Reversible, stable, self-stabilising | Irreversible; easily coagulated by electrolytes |

- **Multimolecular** (S sol, Au sol), **macromolecular** (starch, proteins, polymers), **associated colloids** (micelles of soaps and detergents above the **critical micelle concentration**, CMC, and above the **Kraft temperature**).
- **Preparation:** Bredig's arc method (metal sols), **peptisation** (fresh precipitate + small amount of electrolyte → sol: Fe(OH)₃ + FeCl₃), chemical methods (hydrolysis of FeCl₃ in hot water; oxidation of H₂S to S sol; double decomposition: As₂S₃ sol).
- **Purification:** dialysis (through parchment/cellophane), electrodialysis, ultrafiltration. The kidney works by dialysis.

**Properties**
- **Tyndall effect** (1869): scattering of light by colloidal particles, making the beam path visible — sunlight in a dusty room, headlights in fog, blue sky. True solutions do not show it. Used in the ultramicroscope (Zsigmondy).
- **Brownian movement** (Robert Brown, 1827): zig-zag motion due to unequal bombardment by medium molecules; stabilises sols.
- **Electrophoresis:** movement of charged colloidal particles in an electric field. **Positive sols:** Fe(OH)₃, Al(OH)₃, basic dyes (methylene blue), haemoglobin, TiO₂. **Negative sols:** As₂S₃, metal sols (Au, Ag, Cu), starch, clay, gum, blood (overall), acid dyes (eosin).
- **Coagulation (flocculation):** precipitation of a sol by an electrolyte. **Hardy–Schulze rule:** greater the valency of the oppositely charged (flocculating) ion, greater its coagulating power.
  - For a negative sol (As₂S₃): **Al³⁺ > Ba²⁺ > Na⁺**.
  - For a positive sol (Fe(OH)₃): **[Fe(CN)₆]⁴⁻ > PO₄³⁻ > SO₄²⁻ > Cl⁻**.
- **Protective colloids:** lyophilic colloids protect lyophobic sols from coagulation. **Gold number** = milligrams of protective colloid needed to prevent coagulation of 10 mL gold sol by 1 mL of 10% NaCl. **Smaller gold number → better protection.** Gelatin (0.005–0.01) is best; then haemoglobin, gum arabic, egg albumin; starch (15–25) is poor.

**Emulsions:** oil-in-water (O/W) — milk, vanishing cream; water-in-oil (W/O) — butter, cold cream. **Emulsifying agents:** soaps, detergents, proteins, gums (casein in milk).

**Applications of colloids:** delta formation where river meets sea (sea salts coagulate clay), purification of water with alum, Cottrell electrostatic smoke precipitator, artificial rain (spraying charged sand or AgI on clouds), alum/FeCl₃ to stop bleeding (coagulates blood), tanning of leather, rubber from latex (negative), medicines (colloidal gold, Argyrol — silver sol eye lotion), photographic films.

## Traps and exceptions

- **Glass is amorphous and isotropic**; quartz is crystalline. Quartz glass is amorphous.
- Packing: **sc 52.4%, bcc 68%, fcc/hcp 74%**; CN 6, 8, 12.
- fcc has **4** atoms per cell; bcc 2; sc 1.
- Tetrahedral voids = **2N**, octahedral = N.
- **Schottky lowers density; Frenkel does not.** AgBr shows both.
- NaCl heated with Na turns **yellow** (F-centres), not red.
- ZnO turns yellow on heating, white on cooling.
- **ZnFe₂O₄ is a normal spinel; Fe₃O₄ is an inverse spinel** (and ferrimagnetic).
- **Molality**, not molarity, is used for ΔT_b and ΔT_f; osmotic pressure uses molarity.
- Ethanol–water: **positive** deviation, **minimum**-boiling azeotrope; HNO₃–water: negative deviation, maximum-boiling.
- Acetic acid in benzene: i ≈ 0.5 (association), molar mass appears doubled.
- **Smaller gold number = better protective colloid.**
- Adsorption is exothermic; physisorption decreases with temperature.
- Fe(OH)₃ sol is positive; As₂S₃ and gold sols are negative.
- Gas–gas mixtures do not form colloids.

## Quick revision

1. Unit cell = smallest repeating unit of a crystal lattice.
2. 7 crystal systems, 14 Bravais lattices.
3. Triclinic least symmetric; K₂Cr₂O₇ and CuSO₄·5H₂O triclinic.
4. Z: sc 1, bcc 2, fcc 4; packing 52.4%, 68%, 74%.
5. fcc: √2 a = 4r; bcc: √3 a = 4r.
6. ρ = ZM/(a³Nₐ).
7. NaCl 6:6, CsCl 8:8, ZnS 4:4, CaF₂ 8:4.
8. Radius ratio 0.414–0.732 → octahedral (CN 6).
9. Schottky: NaCl, KCl; Frenkel: ZnS, AgCl; both: AgBr.
10. F-centres give colour (NaCl yellow, KCl violet).
11. Fe₃O₄ ferrimagnetic, inverse spinel; MnO antiferromagnetic.
12. Co-precipitation gives homogeneous ZnFe₂O₄.
13. Henry: p = K_H x; bends in divers.
14. Raoult: p = x p°.
15. Ethanol–water azeotrope 95.6% (min-boiling).
16. K_b(water) 0.52, K_f(water) 1.86 K kg mol⁻¹.
17. π = CRT; 0.9% NaCl isotonic with blood.
18. Reverse osmosis → desalination.
19. i for K₄[Fe(CN)₆] = 5.
20. Colloid size 1–1000 nm.
21. Tyndall effect = scattering of light by colloids.
22. Hardy–Schulze: higher valency of opposite ion → stronger coagulation.
23. Gelatin has the lowest gold number (best protector).
24. Milk is O/W emulsion; butter W/O.
25. Freundlich: x/m = kP^(1/n).

## Practice with answers

1. Coordination number in bcc? — **8**.
2. Packing efficiency of hcp? — **74%**.
3. Number of atoms in an fcc unit cell? — **4**.
4. Which defect does not change density? — **Frenkel**.
5. Colour of KCl with excess K? — **Violet** (F-centres).
6. Type of magnetism in MnO? — **Antiferromagnetic**.
7. Is Fe₃O₄ a normal or inverse spinel? — **Inverse**.
8. Best method for homogeneous ZnFe₂O₄? — **Co-precipitation**.
9. Which colligative property is used for molar mass of proteins? — **Osmotic pressure**.
10. Which solution has the highest boiling point: 0.1 m urea, NaCl or K₂SO₄? — **K₂SO₄** (i = 3).
11. Isotonic saline concentration? — **0.9% w/v NaCl**.
12. Type of deviation in chloroform + acetone? — **Negative** (H-bonding between them).
13. Why are scuba tanks diluted with helium? — **He is less soluble in blood (avoids bends)**.
14. Fog is which type of colloid? — **Aerosol** (liquid in gas).
15. Butter is which type? — **Gel / W/O emulsion** (water dispersed in fat).
16. Which ion best coagulates As₂S₃ sol: Na⁺, Ba²⁺ or Al³⁺? — **Al³⁺**.
17. Which ion best coagulates Fe(OH)₃ sol: Cl⁻, SO₄²⁻, PO₄³⁻? — **PO₄³⁻**.
18. Phenomenon that makes a light beam visible in a colloid? — **Tyndall effect**.
19. Does physisorption increase with temperature? — **No, it decreases** (exothermic).
20. Basic repeating structural unit of a crystal? — **Unit cell**.
