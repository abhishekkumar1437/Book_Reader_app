---
title: Immune System and Enzymes
part: Immunity and Biochemistry
summary: Innate and adaptive immunity, lymphoid organs, B and T cells, antibody structure and the five classes, clonal selection, MHC, primary and secondary responses, active and passive immunity, vaccines, the four types of hypersensitivity, autoimmunity, SCID and HIV, monoclonal antibodies; enzyme classification (EC), cofactors, mechanism of action, Michaelis–Menten kinetics, Km, Lineweaver–Burk, inhibition, allostery, isozymes, ribozymes — NCERT to M.Sc. level.
---

"Immune system" and "Enzymes" are separate lines in the syllabus, but both rest on protein-based recognition (antigen–antibody, enzyme–substrate), so they share one chapter. Starting from NCERT 12 ("Human Health and Disease") and NCERT 11 ("Biomolecules"), the chapter goes up to B.Sc./M.Sc. level — MHC restriction, hypersensitivity, Km and inhibition graphs. In UP PGT these come as statement combinations and match-the-following questions.

> **In simple words:** Immunity is the body's ability to fight pathogens. The first line is **innate** — present from birth, the same for everyone, immediate but without memory. The second is **adaptive (acquired)** — it recognises a specific pathogen, starts slowly, but keeps a memory; vaccines use this memory. Enzymes are biocatalysts — mostly proteins — that speed up reactions by lowering the activation energy and remain unchanged themselves.

For more depth: [Immunology](/interview/bpsc-tre/class-11-12-zoology/reproduction-health/immunology) and [Biomolecules and Enzymes](/interview/bpsc-tre/class-11-12-zoology/cell-genetics/biomolecules-and-enzymes).

## Part A — Immune System

## 1. Innate vs adaptive immunity

| Feature | Innate | Adaptive |
|---|---|---|
| Presence | From birth | Develops after exposure |
| Specificity | Non-specific — recognises PAMPs (pathogen-associated molecular patterns) through **pattern-recognition receptors (PRRs, e.g. Toll-like receptors/TLRs)** | Highly specific — each antigenic determinant (epitope) |
| Speed | Immediate (minutes–hours) | Slow (5–7+ days the first time) |
| Memory | No (except the recent idea of "trained innate immunity") | Yes |
| Components | Barriers, phagocytes, NK cells, complement, interferons, inflammation, fever | B and T lymphocytes, antibodies |
| In evolution | All multicellular animals (invertebrates too) | Only jawed vertebrates (gnathostomes); jawless vertebrates have a different system (VLR) |

Discovery of TLRs — **Bruce Beutler and Jules Hoffmann** (Toll of *Drosophila*); dendritic cell — **Ralph Steinman**; Nobel 2011.

### Barriers of innate immunity (NCERT's four types)

| Barrier | Examples |
|---|---|
| Physical | Skin, mucous membranes and mucus |
| Physiological | HCl in the stomach, saliva, tears (lysozyme — breaks the peptidoglycan of the bacterial wall; Fleming, 1922) |
| Cellular | Neutrophils (PMNL), monocyte-macrophages, NK cells (phagocytosis/killing) |
| Cytokine | Interferons — secreted by virus-infected cells, protect uninfected cells (Isaacs and Lindenmann, 1957) |

- **Phagocytosis** — discovered by **Élie Metchnikoff** in starfish larvae; father of cellular immunity; Nobel 1908 (shared with Paul Ehrlich — humoral theory).
- **NK (natural killer) cells:** large granular lymphocytes; kill virus-infected and cancer cells lacking MHC-I ("missing self") with **perforin and granzymes**; no prior sensitisation needed.
- **Complement system:** ≈ 30 plasma proteins (C1–C9 etc.), made in the liver; three pathways — classical (antigen–antibody complex, C1q; IgM/IgG), alternative (pathogen surface), lectin (mannose-binding lectin); all converge on **C3**; outcomes — opsonisation (C3b), inflammation and chemotaxis (C3a, C5a — anaphylatoxins), cell lysis by the **membrane attack complex (MAC, C5b–C9)**.
- **Inflammation:** histamine and prostaglandins from mast cells → vasodilation and increased permeability; five signs — redness (rubor), heat (calor), swelling (tumor), pain (dolor), loss of function (functio laesa).
- **Fever:** pyrogens (IL-1, IL-6, TNF-α) → PGE₂ in the hypothalamus → temperature "set point" raised; aspirin lowers fever by blocking COX.
- **Characteristic acute-phase protein:** C-reactive protein (CRP — liver).

## 2. Organs and cells of the immune system

| Organ | Type | Function |
|---|---|---|
| Bone marrow | Primary lymphoid | Origin of all blood cells; B cell maturation (mammals) |
| Thymus | Primary lymphoid | T cell maturation and selection (positive — MHC recognition; negative — deletion of self-reactive cells); large at birth, atrophies after puberty |
| Bursa of Fabricius | Primary (in birds) | B cell maturation — the name "B" comes from here |
| Spleen | Secondary | Blood-borne antigens, destruction of old RBCs, blood reservoir |
| Lymph nodes | Secondary | Lymph-borne antigens, lymphocyte activation |
| MALT (mucosa-associated lymphoid tissue) — tonsils, Peyer's patches (small intestine), appendix | Secondary | On mucosal surfaces; ≈ 50% of the body's lymphoid tissue |

| Cell | Function |
|---|---|
| B lymphocyte | Antibody-mediated (humoral) immunity; on activation becomes a **plasma cell** (antibody-secreting, abundant RER) and memory cell |
| T helper (Th, CD4⁺) | Activates B and Tc cells through cytokines (IL-2 etc.); Th1 (cellular), Th2 (humoral/IgE), Th17 |
| T cytotoxic (Tc/CTL, CD8⁺) | Kills infected/cancer cells with perforin-granzyme; graft rejection |
| T regulatory (Treg, CD4⁺CD25⁺FOXP3⁺) | Suppresses responses, self-tolerance |
| Antigen-presenting cells (APC) | Dendritic cells (most effective), macrophages, B cells — present on MHC-II |

## 3. Antigens and antibodies

- **Antigen:** a molecule that provokes an immune response (usually protein, polysaccharide; >10 kDa is more antigenic). **Epitope** = the part of the antigen to which the antibody binds; **paratope** = the binding site of the antibody. **Hapten** = a small molecule that becomes antigenic only when attached to a carrier protein (e.g. penicillin).
- **Antibody / immunoglobulin (Ig):** γ-globulin glycoprotein; **Y-shaped**; **2 heavy (H) + 2 light (L) chains = H₂L₂**, joined by disulphide bonds; the light chain is of two types — κ (kappa) or λ (lambda).
- Structure — **Rodney Porter and Gerald Edelman** (Nobel 1972). Cleavage with papain gives **2 Fab** (antigen-binding) + **1 Fc** (crystallisable, effector functions — complement, Fc receptors); pepsin gives **F(ab')₂**.
- The variable (V) region contains **hypervariable / CDR** regions — specificity; the constant (C) region determines the class. **Hinge region** — flexibility.
- Basis of diversity — **V(D)J recombination** (RAG-1, RAG-2) — **Susumu Tonegawa**, Nobel 1987; along with somatic hypermutation and class switching.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="200" y1="110" x2="200" y2="185"/>
  <line x1="220" y1="110" x2="220" y2="185"/>
  <line x1="200" y1="110" x2="140" y2="30"/>
  <line x1="220" y1="110" x2="280" y2="30"/>
  <line x1="180" y1="115" x2="120" y2="40"/>
  <line x1="240" y1="115" x2="300" y2="40"/>
  <line x1="200" y1="125" x2="220" y2="125" stroke-dasharray="2 2"/>
  <text x="40" y="30" fill="currentColor" stroke="none">Antigen-binding</text>
  <text x="300" y="30" fill="currentColor" stroke="none">site (V)</text>
  <text x="85" y="90" fill="currentColor" stroke="none">Light chain</text>
  <text x="250" y="95" fill="currentColor" stroke="none">Heavy chain</text>
  <text x="230" y="130" fill="currentColor" stroke="none">Hinge (S–S)</text>
  <text x="230" y="170" fill="currentColor" stroke="none">Fc (constant part)</text>
  <text x="95" y="160" fill="currentColor" stroke="none">Fab = arms</text>
</svg>

### The five classes of antibodies

| Class | Heavy chain | Form | % in serum | Feature |
|---|---|---|---|---|
| **IgG** | γ | Monomer | ≈ 75–80% (highest) | **The only one that crosses the placenta** (passive immunity to the foetus); main antibody of the secondary response; longest half-life (≈ 23 days); opsonisation, complement activation; anti-Rh antibody |
| **IgA** | α | Monomer in serum; **dimer** + J chain + secretory component in secretions | ≈ 10–15% | Mucosal immunity — saliva, tears, intestinal secretions, **colostrum** (passive immunity to the infant through breastfeeding) |
| **IgM** | μ | **Pentamer** + J chain; largest (≈ 900 kDa, "macroglobulin") | ≈ 5–10% | **First to appear in the primary response**; most effective at complement activation; ABO blood group antibodies (agglutination); first made by the foetus; B cell surface receptor (monomer) |
| **IgD** | δ | Monomer | < 1% | Receptor on the surface of mature naive B cells; function unclear |
| **IgE** | ε | Monomer | ≈ 0.002% (lowest) | **Allergy** (type I) — binds mast cells and basophils, releasing histamine; against helminth parasites; heat-labile |

> **Memory trick:** Serum concentration in decreasing order: "**GAMDE**" (G > A > M > D > E). "**M** = **M**ost first, **M**assive pentamer; **G** = **G**oes across placenta; **A** = mucos**A** & milk; **E** = **E**llergy (Allergy)".

## 4. Mechanism of the immune response

- **Clonal selection theory** — **Macfarlane Burnet, 1957**: each lymphocyte already carries a receptor of a single specificity; the antigen "selects" that lymphocyte, which divides to form a clone (effector + memory cells); self-reactive clones are destroyed during development. Burnet and **Peter Medawar** — acquired immunological tolerance, Nobel 1960.
- **Types of immunity:** humoral (antibody-mediated, AMI — B cells; extracellular pathogens, toxins) vs cell-mediated (CMI — T cells; intracellular pathogens, viruses, cancer, **graft rejection**).

### MHC (major histocompatibility complex) — HLA in humans

- In humans the **HLA** genes are on **chromosome 6**; in mice H-2 (chromosome 17); the most polymorphic genes.
- Discovery: **George Snell (mouse), Jean Dausset (human HLA), Baruj Benacerraf** — Nobel 1980.
- **MHC restriction:** a T cell recognises an antigen only when it is presented on self-MHC — **Doherty and Zinkernagel**, Nobel 1996.

| Feature | MHC class I | MHC class II |
|---|---|---|
| Presence | **All nucleated cells** (not on mammalian RBCs) | Only APCs — dendritic cells, macrophages, B cells |
| HLA loci | HLA-A, B, C | HLA-DP, DQ, DR |
| Structure | α chain + **β₂-microglobulin** (chromosome 15) | α + β chains |
| Antigen presented | **Endogenous** (cytosolic, e.g. viral proteins) — proteasome → TAP → ER | **Exogenous** (phagocytosed) — endosome/lysosome |
| T cell that recognises it | **CD8⁺ (Tc)** | **CD4⁺ (Th)** |

> **Memory trick:** "**Rule of 8**" — MHC I × CD8 = 8; MHC II × CD4 = 8.

**Class III MHC genes** — complement proteins (C2, C4, factor B), TNF.

### Primary vs secondary response

| Feature | Primary | Secondary / memory (anamnestic) |
|---|---|---|
| When | First encounter with the antigen | Repeat encounter |
| Lag period | Long (≈ 5–10 days) | Short (1–3 days) |
| Antibody level | Low | Much higher (10–100 times) |
| Main antibody | **IgM** | **IgG** (class switching) |
| Affinity | Low | Higher (affinity maturation) |
| Duration | Short | Long |

## 5. Active and passive immunity; vaccines

| | Active | Passive |
|---|---|---|
| Definition | The body makes its own antibodies | Ready-made antibodies are given |
| Natural | By infection | IgG from mother to foetus (placenta), IgA to infant (colostrum) |
| Artificial | Vaccination | Antitoxin/antiserum — anti-tetanus serum (ATS), antivenom (raised in horses), rabies immunoglobulin |
| Onset | Slow | Immediate |
| Duration | Long-lasting (memory) | Short (weeks–months) |

**History of vaccination:**

- **Edward Jenner, 1796** — vaccine against smallpox using cowpox; "vaccine" — from Latin *vacca* (cow). Eradication of smallpox — WHO declaration **1980** (last natural case 1977, Somalia); last case in India 1975.
- **Louis Pasteur** — attenuated vaccines: chicken cholera (1879), anthrax (1881), **rabies (1885)** — gave the word "vaccine" its general meaning.
- **Emil von Behring** — diphtheria antitoxin (passive), first Nobel in Medicine 1901. BCG — Calmette and Guérin (1921). Polio — Salk (inactivated IPV, 1955), Sabin (oral live OPV, 1961). India polio-free — WHO certification **2014** (last case January 2011).

| Type of vaccine | Examples |
|---|---|
| Live attenuated | BCG, OPV, MMR, yellow fever, smallpox (vaccinia), rotavirus |
| Inactivated/killed | IPV (Salk), rabies, hepatitis A, typhoid (injectable), cholera |
| Toxoid — inactivated toxin | Tetanus (TT), diphtheria (the D and T of DPT) |
| Subunit / recombinant | **Hepatitis B** (HBsAg made in yeast — first recombinant human vaccine, 1986), HPV |
| Conjugate | Hib, pneumococcal (polysaccharide + protein carrier) |
| mRNA / viral vector | COVID-19 — mRNA (Pfizer, Moderna; Karikó and Weissman, Nobel 2023); Covishield (adenovirus vector) |
| DNA vaccine | ZyCoV-D (India, 2021 — world's first human DNA vaccine) |

**Adjuvant** — alum — enhances the immune response. **Herd immunity**.

## 6. Hypersensitivity — Gell and Coombs (1963) classification

| Type | Mediators | Mechanism | Time | Examples |
|---|---|---|---|---|
| **I — Immediate / anaphylactic** | **IgE**, mast cells, basophils | First exposure → IgE on mast cells (sensitisation); second → histamine, serotonin, leukotrienes | Minutes | **Allergy**, hay fever, asthma, urticaria, anaphylactic shock (penicillin, bee sting) — treated with antihistamines, adrenaline, corticosteroids |
| **II — Cytotoxic** | IgG/IgM + cell-surface antigen | Complement lysis, ADCC | Hours | Mismatched blood transfusion, **haemolytic disease of the newborn (erythroblastosis fetalis — Rh)**, autoimmune haemolytic anaemia, Goodpasture's; (some books call Graves' and myasthenia "type V/stimulatory") |
| **III — Immune complex** | Antigen–IgG complexes deposited in tissues | Complement activation, damage by neutrophils | 3–10 hours | **SLE**, serum sickness, **Arthus reaction**, post-streptococcal glomerulonephritis, rheumatoid arthritis (partly) |
| **IV — Delayed-type (DTH)** | **T cells** (Th1, CD8), macrophages — no antibodies | Cytokine-mediated inflammation | 24–72 hours | **Tuberculin (Mantoux) test**, contact dermatitis (poison ivy, nickel), graft rejection, leprosy, type-1 diabetes |

> **Memory trick:** "**ACID**" — **A**naphylactic (I), **C**ytotoxic (II), **I**mmune complex (III), **D**elayed (IV). Only type IV involves no antibodies.

## 7. Autoimmunity and immunodeficiency

**Autoimmunity** — when self-tolerance breaks down, the body attacks its own cells ("horror autotoxicus" — Paul Ehrlich).

| Disease | Target |
|---|---|
| Rheumatoid arthritis | Synovial membrane (rheumatoid factor — IgM against IgG) |
| Type-1 diabetes (IDDM) | β cells of the pancreas (T cell-mediated) |
| Myasthenia gravis | ACh receptors of the NMJ |
| Graves' disease | TSH receptor (stimulating antibodies → hyperthyroidism) |
| Hashimoto's thyroiditis | Thyroglobulin, thyroid peroxidase |
| Multiple sclerosis | CNS myelin |
| SLE (lupus) | Nuclear antigens (anti-ds-DNA antibodies) — multi-organ |
| Pernicious anaemia | Intrinsic factor / parietal cells of the stomach |
| Coeliac disease | Gluten-sensitive intestinal damage |
| Psoriasis, vitiligo | Skin |

**Immunodeficiency:**

- **Primary (congenital):** **SCID (severe combined immunodeficiency)** — both B and T cells defective; one form is due to **ADA (adenosine deaminase) deficiency** — **first gene therapy (1990, 4-year-old Ashanti DeSilva, NIH, USA)**; "bubble boy" (David Vetter). DiGeorge syndrome — thymus absent (T cell deficiency); Bruton's X-linked agammaglobulinaemia — B cell deficiency.
- **Secondary (acquired):** **AIDS** — **HIV** (retrovirus, ssRNA, reverse transcriptase); destroys **CD4⁺ T helper cells** (gp120 → CD4 + CCR5/CXCR4 co-receptor); macrophages are the "HIV factory"; diagnosis by **ELISA** (screening), Western blot (confirmation, now less used), PCR; treatment ART (zidovudine/AZT — reverse transcriptase inhibitor). Discovery — **Luc Montagnier and Françoise Barré-Sinoussi** (Nobel 2008). CCR5-Δ32 homozygous individuals are resistant.
- Other causes — malnutrition, anti-cancer drugs, immunosuppressants in transplantation (cyclosporin — from the fungus *Tolypocladium inflatum*).

## 8. Monoclonal antibodies and blood groups (brief)

- **Monoclonal antibodies (mAb)** — **Köhler and Milstein, 1975**, **hybridoma technique** (Nobel 1984, shared with Niels Jerne): spleen B cell of an immunised mouse + myeloma (tumour) cell fused by **PEG** → selection in **HAT medium** (the myeloma is HGPRT⁻, so it cannot survive alone; the B cell is mortal) → immortal clone secreting antibody of a single specificity. Uses — pregnancy test kits (hCG), cancer treatment (trastuzumab, rituximab), blood typing, ELISA. Names end in "-mab" (mouse "-omab", humanised "-zumab", fully human "-umab").
- **ABO** — **Karl Landsteiner (1900–01)**, Nobel 1930; AB group — Decastello and Sturli (1902). **Rh** — Landsteiner and Wiener (1940), from the *Rhesus* monkey. Universal donor O⁻, universal recipient AB⁺. ABO antibodies are natural, IgM (do not cross the placenta); anti-Rh is IgG (crosses the placenta → haemolytic disease of the newborn; prevention — **anti-D (RhoGAM)** given to the Rh⁻ mother within 72 hours of delivery = passive immunity). Bombay blood group (hh, lacks H antigen) — Bhende, 1952, Mumbai.

> **PYQ (UP PGT 2026):** One patient has recurrent fever, enlarged liver and spleen, and intracellular parasites in red blood cells, while another has elephantiasis due to long-standing lymphatic obstruction. Which explanation correctly links the pathogen, transmission and pathology?
> (A) *Entamoeba* infects RBCs through contaminated food, *Ascaris* causes lymphatic obstruction by tissue invasion
> (B) *Leishmania* infects RBCs through the sandfly, adult *Ancylostoma* block lymphatic vessels
> (C) *Plasmodium* infects RBCs through the mosquito causing recurrent fever, *Wuchereria* causes lymphatic obstruction through the mosquito
> (D) *Trypanosoma* infects RBCs through the tsetse fly, *Taenia* larvae cause lymphatic damage during migration
> Reasoned answer (official key not available): **(C)** — malaria (*Plasmodium*, female *Anopheles*; fever is caused by **haemozoin** released when RBCs burst) and filariasis (*Wuchereria bancrofti*, *Culex*). Parasites are covered in detail in Zoology I.

## Part B — Enzymes

## 9. Enzymes — nature and history

- The word "enzyme" — **Wilhelm Kühne, 1878** (Greek *en zyme* = in yeast). **Eduard Buchner, 1897** — fermentation by cell-free yeast juice ("zymase"), Nobel 1907.
- First crystallised enzyme — **urease** (from jack bean, *Canavalia ensiformis*), **James Sumner, 1926** — proved that enzymes are proteins (Nobel 1946).
- Exception: **ribozyme** — catalytic RNA; **Thomas Cech** (self-splicing rRNA intron of *Tetrahymena*) and **Sidney Altman** (RNase P) — Nobel 1989. The **peptidyl transferase** of the ribosome = 23S rRNA (bacteria) — a ribozyme.
- Enzymes **do not change the equilibrium constant** of a reaction; they only increase the rate of reaching equilibrium; they lower the **activation energy (Ea)**; they do not change ΔG.
- **Turnover number (kcat)** — product formed per second per enzyme molecule; among the highest are **carbonic anhydrase** (≈ 10⁶/s) and catalase (≈ 10⁷/s). **Catalytic efficiency** = kcat/Km; "perfect enzymes" (diffusion-limited, ≈ 10⁸–10⁹ M⁻¹s⁻¹) — triose phosphate isomerase, carbonic anhydrase, acetylcholinesterase.

## 10. Classification of enzymes (IUBMB) and EC numbers

Every enzyme has a four-part **EC number (Enzyme Commission)** — e.g. EC 3.4.21.4 (trypsin): class.subclass.sub-subclass.serial number.

| Class | Name | Reaction | Examples |
|---|---|---|---|
| EC 1 | **Oxidoreductases** | Oxidation-reduction (H/electron transfer) | Dehydrogenases (lactate, succinate), oxidases (cytochrome oxidase), catalase, peroxidase |
| EC 2 | **Transferases** | Group transfer (S–G + S' → S + S'–G) | Kinases (hexokinase — phosphate), transaminases (ALT/SGPT, AST/SGOT) |
| EC 3 | **Hydrolases** | Hydrolysis | Digestive enzymes — amylase, pepsin, trypsin, lipase, phosphatase, urease |
| EC 4 | **Lyases** | Break bonds without hydrolysis/oxidation, forming double bonds or adding groups | Aldolase, decarboxylase, carbonic anhydrase, fumarase |
| EC 5 | **Isomerases** | Interconversion of isomers | Phosphohexose isomerase, triose phosphate isomerase, mutases, epimerases, racemases |
| EC 6 | **Ligases / synthetases** | Join two molecules with ATP hydrolysis | DNA ligase, pyruvate carboxylase, aminoacyl-tRNA synthetase |
| EC 7 | **Translocases** — added in **2018** | Move ions/molecules across membranes (coupled to ATP hydrolysis) | Na⁺/K⁺-ATPase, ATP synthase (some sources) |

> **Memory trick:** "**OTHLIL**" — "**O**ur **T**eacher **H**as **L**ong **I**ron **L**egs" (+ T — translocases). NCERT still has 6 classes; the latest IUBMB list has 7.

## 11. Cofactors

- **Apoenzyme** = protein part only (inactive); **holoenzyme** = apoenzyme + cofactor (active).

| Cofactor | Feature | Examples |
|---|---|---|
| **Prosthetic group** | Organic, bound **tightly (often covalently)** to the enzyme | **Haem** — peroxidase and catalase (H₂O₂ → H₂O + O₂); FAD — succinate dehydrogenase; biotin — carboxylases |
| **Coenzyme** | Organic, **transient/loose** binding, acts as a "co-substrate" in the reaction | NAD⁺, NADP⁺ (niacin), FMN, CoA, TPP, PLP, THF — mostly vitamin derivatives ([Chapter 07 vitamin table](/interview/up-pgt/jeev-vigyan/jantu-2/hormone-pheromone-vitamin)) |
| **Metal ions** — activators | Inorganic | **Zn²⁺** — carbonic anhydrase, carboxypeptidase, alcohol dehydrogenase; **Mg²⁺** — kinases (ATP-Mg complex), RuBisCO; **Mo** — nitrogenase, xanthine oxidase; **Cu** — cytochrome oxidase, tyrosinase; **Fe** — cytochromes, catalase; **Mn²⁺** — arginase; **Se** — glutathione peroxidase; **Ni** — urease; **Cl⁻** — salivary amylase |

## 12. Mechanism of action

- **Lock and key model** — **Emil Fischer, 1894**: the shape of the active site is complementary to the substrate and rigid.
- **Induced fit model** — **Daniel Koshland, 1958**: when the substrate binds, the active site changes shape to fit tightly — more widely accepted (example: hexokinase).
- Stabilisation of the **transition state** — Linus Pauling's idea; transition-state analogues are powerful inhibitors.
- Steps: E + S ⇌ ES (enzyme–substrate complex) → EP → E + P.
- Mechanisms at the active site: acid–base catalysis, covalent catalysis (serine proteases — Ser-His-Asp "catalytic triad"), metal-ion catalysis, proximity and orientation.

## 13. Enzyme kinetics — Michaelis–Menten

**Michaelis–Menten equation (Michaelis and Menten, 1913):**

<div class="formula">

v = Vmax × [S] / (Km + [S])

When [S] = Km, v = Vmax / 2

</div>

- **Km (Michaelis constant)** = the substrate concentration at which the velocity is **half the maximum**; unit — concentration (mol/L).
- Km is an **inverse measure of the enzyme's affinity** for its substrate — **low Km = high affinity**. Example: hexokinase (Km for glucose ≈ 0.1 mM, high affinity) vs **glucokinase** (liver, Km ≈ 10 mM, low affinity — active only at high glucose after a meal).
- Km does not depend on enzyme concentration; it depends on temperature, pH and the substrate. Vmax is proportional to enzyme concentration.
- At low [S] the velocity is ≈ first-order (proportional to substrate); at high [S] it is zero-order (saturation — all active sites occupied). The graph is **hyperbolic**.
- **Lineweaver–Burk (double reciprocal) plot (Lineweaver–Burk, 1934):** 1/v vs 1/[S] — a straight line; **y-intercept = 1/Vmax**, **x-intercept = −1/Km**, **slope = Km/Vmax**.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="30" y1="170" x2="190" y2="170"/>
  <line x1="40" y1="20" x2="40" y2="180"/>
  <path d="M40 170 Q70 70 120 55 T190 42"/>
  <line x1="40" y1="40" x2="190" y2="40" stroke-dasharray="3 3"/>
  <line x1="40" y1="105" x2="75" y2="105" stroke-dasharray="2 2"/>
  <line x1="75" y1="105" x2="75" y2="170" stroke-dasharray="2 2"/>
  <text x="140" y="35" fill="currentColor" stroke="none">Vmax</text>
  <text x="2" y="108" fill="currentColor" stroke="none">Vmax/2</text>
  <text x="68" y="188" fill="currentColor" stroke="none">Km</text>
  <text x="150" y="188" fill="currentColor" stroke="none">[S]</text>
  <line x1="220" y1="140" x2="410" y2="140"/>
  <line x1="290" y1="20" x2="290" y2="180"/>
  <line x1="245" y1="140" x2="400" y2="40"/>
  <text x="225" y="158" fill="currentColor" stroke="none">−1/Km</text>
  <text x="295" y="118" fill="currentColor" stroke="none">1/Vmax</text>
  <text x="370" y="158" fill="currentColor" stroke="none">1/[S]</text>
  <text x="295" y="30" fill="currentColor" stroke="none">1/v</text>
</svg>

## 14. Factors affecting enzyme activity

- **Temperature:** the rate rises up to the optimum temperature (human enzymes ≈ 37 °C) (Q₁₀ ≈ 2), then falls sharply due to protein **denaturation**; low temperature causes temporary inactivation (not denaturation). Exception — **Taq polymerase** of *Thermus aquaticus* (optimum ≈ 72 °C; PCR).
- **pH:** each enzyme has an optimum pH — **pepsin ≈ 1.5–2**, salivary amylase ≈ 6.8, **trypsin ≈ 7.5–8.5**, alkaline phosphatase ≈ 9–10, acid phosphatase ≈ 5, arginase ≈ 9.7.
- **Substrate concentration:** rate rises until saturation (Michaelis–Menten).
- **Enzyme concentration:** rate is proportional if substrate is in excess.
- **Activators and inhibitors.**

## 15. Enzyme inhibition

| Type | Where the inhibitor binds | Km | Vmax | Reversible? | Examples |
|---|---|---|---|---|---|
| **Competitive** | **Active site** (substrate-like) | **Increases** (apparent) | **Unchanged** | Yes — by more substrate | **Malonate → succinate dehydrogenase** (analogue of succinate); sulphonamides → PABA (folic acid synthesis); methotrexate → dihydrofolate reductase; statins → HMG-CoA reductase; giving ethanol in methanol poisoning (alcohol dehydrogenase) |
| **Non-competitive** | A **site other than** the active site — binds both E and ES | **Unchanged** | **Decreases** | Not by raising substrate | Heavy metals (Hg²⁺, Pb²⁺, Ag⁺ — –SH groups), cyanide (cytochrome oxidase — some books call it irreversible) |
| **Uncompetitive** | Only the **ES complex** | **Decreases** | **Decreases** | — | Lithium → inositol monophosphatase; parallel lines on Lineweaver–Burk |
| **Irreversible** | Permanent inactivation by covalent bonding | — | Decreases | No | **Aspirin** → cyclooxygenase (COX, acetylation); organophosphates/DIFP and sarin → acetylcholinesterase; penicillin → transpeptidase (suicide inhibitor) |

**Identification on Lineweaver–Burk:** competitive — lines meet **on the y-axis** (same 1/Vmax); non-competitive — lines meet **on the x-axis** (same −1/Km); uncompetitive — **parallel** lines.

> **Exam angle:** "Competitive — Km ↑, Vmax same; non-competitive — Vmax ↓, Km same" — this pair is asked most often in matching and statement questions. Malonate–succinate dehydrogenase is the standard NCERT example.

## 16. Enzyme regulation

- **Allosteric regulation:** a regulatory molecule (effector) binds an **allosteric site** different from the active site and changes the enzyme's shape — activator (+) or inhibitor (−). The velocity–[S] curve is **sigmoid (S-shaped)** — cooperativity; does not follow Michaelis–Menten. Models — MWC (Monod–Wyman–Changeux, 1965, concerted) and KNF (Koshland, sequential). Examples: **phosphofructokinase-1 (PFK-1)** — inhibited by ATP and citrate, activated by AMP and fructose-2,6-bisphosphate (main control point of glycolysis); **aspartate transcarbamoylase (ATCase)** — inhibited by CTP, activated by ATP.
- **Feedback inhibition / end-product inhibition:** the end product of a pathway allosterically inhibits the first (committed) enzyme — in *E. coli*, **isoleucine** → threonine deaminase (Umbarger, 1956); CTP → ATCase.
- **Covalent modification:** phosphorylation/dephosphorylation — glycogen phosphorylase (phosphorylated form is active; Krebs and Fischer, Nobel 1992).
- **Zymogen / proenzyme:** inactive precursor, activated by partial proteolysis — pepsinogen → pepsin (by HCl, then autocatalysis), **trypsinogen → trypsin (by enterokinase/enteropeptidase)**, chymotrypsinogen → chymotrypsin (by trypsin), prothrombin → thrombin. Advantage — prevents self-digestion of the secretory cell.
- **Isozymes / isoenzymes:** forms that catalyse the same reaction but differ in structure, Km and electrophoretic mobility — **lactate dehydrogenase (LDH)** has **5 isozymes** (tetramers of H and M subunits: LDH-1 = H₄ heart, LDH-5 = M₄ liver/skeletal muscle); creatine kinase — CK-MB (heart), CK-MM (muscle), CK-BB (brain). Markert and Møller (1959) — coined the term.
- **Multi-enzyme complexes:** pyruvate dehydrogenase complex (3 enzymes, 5 coenzymes — TPP, lipoic acid, CoA, FAD, NAD⁺), fatty acid synthase.
- **Abzyme** — catalytic antibody (raised against transition-state analogues).

## Traps and exceptions

- Not all enzymes are proteins — ribozymes are RNA; not all proteins are enzymes.
- Enzymes do not change ΔG or the equilibrium constant; they only lower the activation energy.
- Low Km = **higher** affinity (not the reverse).
- In competitive inhibition Vmax does **not** decrease; in non-competitive inhibition Km does **not** change.
- Allosteric enzymes give a sigmoid curve, not the hyperbolic curve of Michaelis–Menten.
- Low temperature inactivates enzymes but does not denature them; high temperature denatures them.
- Only IgG crosses the placenta; IgM is the largest and first in the primary response; IgA is in colostrum.
- MHC-I is on all nucleated cells (not on RBCs); MHC-II only on APCs.
- HIV destroys CD4⁺ T helper cells, not B cells directly.
- Type IV hypersensitivity is T cell-mediated — not antibody-mediated.
- Interferon does not kill the virus directly; it induces an antiviral state in neighbouring cells.
- Antivenom is passive immunity; toxoid (TT) is active immunity.
- Translocases (EC 7) were added in 2018 — older books and NCERT give 6 classes.

## Quick revision

- Innate: non-specific, immediate, no memory; adaptive: specific, slow, memory.
- Lysozyme (tears, saliva) — Fleming; phagocytosis — Metchnikoff.
- NK cells kill MHC-I-lacking cells with perforin.
- The three complement pathways meet at C3; MAC = C5b–C9.
- Primary lymphoid organs: bone marrow, thymus (bursa in birds).
- Antibody = H₂L₂; Fab antigen-binding, Fc effector.
- Serum order: IgG > IgA > IgM > IgD > IgE.
- IgG crosses placenta; IgM pentamer, first; IgA colostrum; IgE allergy.
- Clonal selection — Burnet (1957).
- MHC-I → CD8; MHC-II → CD4; HLA on chromosome 6.
- Secondary response: faster, larger, IgG.
- Jenner (1796) smallpox; Pasteur rabies (1885).
- Hepatitis B — first recombinant vaccine (yeast).
- Hypersensitivity: I IgE, II cytotoxic, III immune complex, IV T cell (Mantoux).
- SCID (ADA deficiency) — first gene therapy 1990.
- HIV — CD4⁺ T cells; ELISA diagnosis.
- Monoclonal antibodies — Köhler and Milstein (1975), hybridoma, HAT medium.
- Enzymes are proteins — Sumner (urease, 1926); ribozymes — Cech and Altman.
- EC classes: oxidoreductases, transferases, hydrolases, lyases, isomerases, ligases, translocases.
- Apoenzyme + cofactor = holoenzyme.
- Lock and key — Fischer (1894); induced fit — Koshland (1958).
- Km = [S] at Vmax/2; low Km = high affinity.
- Lineweaver–Burk: y-intercept 1/Vmax, x-intercept −1/Km.
- Competitive: Km↑ Vmax constant (malonate); non-competitive: Vmax↓ Km constant.
- LDH has 5 isozymes; pepsin pH ≈ 2, trypsin ≈ 8.

## Practice questions (with answers)

1. The only antibody that crosses the placenta? — **IgG** (passive immunity of the foetus).
2. The first antibody produced in the primary response? — **IgM** (pentamer).
3. The main antibody in colostrum? — **IgA**.
4. The antibody associated with allergy? — **IgE** (histamine from mast cells).
5. Who proposed the clonal selection theory? — **Macfarlane Burnet**.
6. On which cells is MHC class II found? — **Antigen-presenting cells** (dendritic cells, macrophages, B cells).
7. On which MHC does a CD8⁺ T cell recognise antigen? — **MHC class I**.
8. The Mantoux test is which type of hypersensitivity? — **Type IV (delayed)**.
9. Serum sickness is which type of hypersensitivity? — **Type III (immune complex)**.
10. Which disease results from ADA deficiency? — **SCID** (first gene therapy, 1990).
11. Which two cells are fused in a hybridoma? — **B lymphocyte + myeloma cell**.
12. What type of immunity does tetanus toxoid give? — **Artificial active**.
13. Who proved that enzymes are proteins? — **James Sumner** (urease crystals).
14. DNA ligase belongs to which EC class? — **EC 6 — ligases**.
15. The metal cofactor of carbonic anhydrase? — **Zn²⁺**.
16. Whose is the induced fit model? — **Daniel Koshland**.
17. Meaning of Km? — **The [S] at which velocity is half of Vmax** (an inverse measure of affinity).
18. Inhibition of succinate dehydrogenase by malonate is of which type? — **Competitive** (Km↑, Vmax unchanged).
19. The velocity–[S] curve of an allosteric enzyme? — **Sigmoid** (cooperativity).
20. The enzyme that activates trypsinogen? — **Enterokinase (enteropeptidase)**.
