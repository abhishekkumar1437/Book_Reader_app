---
title: DNA-RNA Structure, Genetic Material, Replication and Repair
part: Molecular Biology
summary: Structure of nucleotides, Chargaff's rules, the Watson-Crick model, A-B-Z DNA, types of RNA, experiments proving DNA is the genetic material (Griffith, Avery, Hershey-Chase), bacterial genetics (transformation, conjugation, transduction), semi-conservative replication (Meselson-Stahl) and its enzymes, eukaryotic replication and telomerase, and DNA damage and repair mechanisms.
---

This chapter takes "DNA and RNA structure, DNA as genetic material, replication and repair" of Unit 8 from NCERT 12 ("Molecular Basis of Inheritance") up to M.Sc. level (replication enzymes, eukaryotic polymerases, repair pathways). The 2026 paper had an integrated question on **transformation-conjugation (F factor, episome)**; the **sequence of experiments, isotopes used and conclusions** are the most likely targets.

> **In simple words:** DNA is a twisted ladder of two strands — the sides are sugar-phosphate, the rungs are base pairs (A–T, G–C). One strand is the "template" for the other, so before cell division the ladder opens down the middle and a new strand is built on each old strand — every new DNA has one old and one new strand (semi-conservative). Errors and damage keep occurring, and special enzymes fix them.

## 1. Nucleic acids — chemical composition

- **Friedrich Miescher (1869)** — acidic substance "**nuclein**" from the nuclei of pus cells (leucocytes); the name "nucleic acid" was given by **Altmann (1889)**.
- **Nucleotide** = nitrogenous base + pentose sugar + phosphate; **nucleoside** = base + sugar (no phosphate).
- Bases: **purines** (two rings) — **adenine (A), guanine (G)**; **pyrimidines** (one ring) — **cytosine (C), thymine (T)** (DNA only), **uracil (U)** (RNA only). Thymine = 5-methyl uracil.
- **N-glycosidic bond** — from C1′ of the sugar to the base (N9 of purines, N1 of pyrimidines); **phosphodiester bond** — from the 3′-OH of one nucleotide to the 5′-phosphate of the next; chain direction **5′ → 3′**.
- DNA has **2′-deoxyribose** (no –OH at 2′), RNA has **ribose** (2′-OH — this is why RNA is unstable in alkaline medium and self-cleaves; DNA is more stable).

| Name | Type |
|---|---|
| Adenosine, guanosine, cytidine, uridine | Ribonucleoside |
| Deoxythymidine | Deoxyribonucleoside |
| AMP, dGMP, ATP | Nucleotide |

### Chargaff's rules (Erwin Chargaff, 1950)
1. In double-stranded DNA **A = T** and **G = C**.
2. **Purines = pyrimidines** (A + G = T + C), so (A + G)/(T + C) = **1**.
3. The ratio (A + T)/(G + C) is **species-specific** (need not be 1).
4. These rules do **not** apply to single-stranded DNA (φX174) and RNA.

**Solved example 1:** A double-stranded DNA has 20% adenine. Cytosine? — A = T = 20%, so A + T = 40%, G + C = 60%, **C = 30%**.
**Solved example 2:** One strand of DNA has A = 20%, T = 30%, G = 15%, C = 35%. In the complementary strand? — **A = 30%, T = 20%, G = 35%, C = 15%**; in the whole duplex A = T = (20 + 30)/2 = **25%**, G = C = **25%**.
**Solved example 3:** A DNA segment has 1000 bp and 300 adenines. Total hydrogen bonds? — total bases 2000; A = T = 300 → A–T pairs = 300; G–C pairs = 1000 − 300 = 700; H-bonds = 300 × 2 + 700 × 3 = 600 + 2100 = **2700**. Its length = 1000 × 0.34 nm = **340 nm**.

## 2. Watson-Crick double helix model (1953)

- **James Watson and Francis Crick** — *Nature*, 25 April 1953; based on the **X-ray diffraction** of **Rosalind Franklin** and **Maurice Wilkins** (Franklin's "Photo 51") + Chargaff's rules. Nobel 1962 — Watson, Crick, Wilkins (Franklin died in 1958).
- Two polynucleotide chains, **antiparallel** — one 5′→3′, the other 3′→5′; **right-handed** coiling.
- **A=T has 2 hydrogen bonds, G≡C has 3** — so GC-rich DNA has a higher **melting temperature (Tm)**.
- Stability — besides H-bonds, **base stacking** (base pairs stacked one above the other) is the main reason.
- A purine always lies opposite a pyrimidine — hence a uniform diameter of **2 nm (20 Å)**.
- **Pitch 3.4 nm**, **10 bp** per turn, distance between two successive pairs **0.34 nm** (≈ 10.5 bp/turn in solution); **major groove** and **minor groove** — proteins bind more in the major groove.

| Feature | A-DNA | **B-DNA** | Z-DNA |
|---|---|---|---|
| Coiling | Right-handed | Right-handed | **Left-handed** |
| bp/turn | ≈ 11 | **≈ 10 (10.5)** | ≈ 12 |
| Rise per bp along axis | ≈ 0.26 nm | 0.34 nm | ≈ 0.37 nm |
| Diameter | ≈ 2.3 nm (wide) | 2.0 nm | ≈ 1.8 nm (thin) |
| Condition | Dehydrated; DNA-RNA hybrids and dsRNA take this form | Normal cellular form | Alternating GC sequences, high salt; **Alexander Rich (1979)**; phosphate backbone **zig-zag** |

- Other forms: C, D, E-DNA; **triple-stranded H-DNA**; **G-quadruplex** (telomeres).
- **Denaturation** — strands separate on heating; increase in absorbance at 260 nm = **hyperchromicity**; re-joining on cooling = **annealing (renaturation)** — the basis of PCR and hybridisation.
- **C₀t curve (Britten and Kohne, 1968)** — discovery of **repetitive DNA** from the rate of renaturation.

## 3. RNA — structure and types

| RNA | % of cellular RNA | Structure/function |
|---|---|---|
| **rRNA** | **≈ 80%** (highest) | Part of the ribosome; 23S/28S rRNA — peptidyl transferase (ribozyme) |
| **tRNA** | ≈ 15% | Smallest (≈ 73–93 nucleotides, 4S); two-dimensional **clover-leaf** model — **Robert Holley (1965)**, yeast alanine tRNA; three-dimensional **"L"-shape** (Kim, 1973); **CCA** at the 3′ end (the amino acid attaches here); **anticodon loop**, DHU loop, TΨC loop; rare bases (pseudouridine, inosine) |
| **mRNA** | ≈ 5% (least, most unstable) | Carries the codons; eukaryotes — 5′ cap, poly-A tail |
| snRNA, snoRNA | Small | Splicing (spliceosome), rRNA modification |
| miRNA, siRNA | Small | Gene silencing (RNAi) |

- tRNA is also called **soluble RNA (sRNA)** or the **adapter molecule** — Crick's hypothesis.
- **Ribozyme** — RNA that acts as an enzyme; **Thomas Cech** (*Tetrahymena* rRNA self-splicing) and **Sidney Altman** (RNase P) — Nobel Chemistry 1989. This is the basis of the "**RNA world**" hypothesis: RNA was the first genetic material — both catalyst and information carrier; DNA evolved later for greater stability.

## 4. DNA is the genetic material — experiments

### 4.1 Griffith's transformation experiment (Frederick Griffith, 1928)

Bacterium ***Streptococcus pneumoniae* (pneumococcus)**, experimental animal — mice.

| Injection | Result |
|---|---|
| **S-strain** (smooth colonies, polysaccharide capsule, virulent) | Mouse **died** |
| **R-strain** (rough, no capsule, non-virulent) | Mouse lived |
| Heat-killed S | Mouse lived |
| Heat-killed S + live R | Mouse **died**; **live S** bacteria recovered from its blood |

Conclusion: some "**transforming principle**" passed from dead S into live R and converted it into S. Griffith could **not** tell the **nature** of that substance.

### 4.2 Avery, MacLeod and McCarty (1944)

They purified protein, RNA and DNA from heat-killed S. **Protease** and **RNase** did not stop transformation; **DNase** stopped it → **the transforming principle is DNA**. (But not all scientists agreed at that time.)

### 4.3 Hershey-Chase experiment (Alfred Hershey & Martha Chase, 1952) — the "blender experiment"

- **Bacteriophage T2** + ***E. coli***.
- One batch — grown in **³²P** medium (phosphorus is in DNA, not in protein); the other — in **³⁵S** medium (sulphur is in cysteine-methionine of protein, not in DNA).
- Infection → agitation in a **blender** (phage coats removed) → **centrifugation** — heavy bacteria settle in the pellet, light phage coats stay above in the supernatant.
- Result: **³²P inside the bacteria (in the pellet)**, **³⁵S outside (in the supernatant)** → the phage **DNA** enters the bacterium and makes new phages. Hershey — Nobel 1969 (with Delbrück, Luria).

> **Common mistake:** ³⁵S labels protein and ³²P labels DNA — not the other way round. "Radioactivity inside the bacteria" = ³²P.

### 4.4 RNA is also genetic material (in some viruses)

- **Fraenkel-Conrat and Singer (1956/57)** — **tobacco mosaic virus (TMV)**: RNA of one strain + protein coat of another → progeny virus resembles the **strain that supplied the RNA**. **Gierer and Schramm (1956)** — purified TMV RNA is infectious.
- Viruses with RNA genomes: TMV, influenza, polio, HIV (retrovirus), SARS-CoV-2, QB phage.

**Properties of genetic material (NCERT):** (1) it should be able to replicate; (2) it should be chemically and structurally **stable**; (3) it should allow slow changes (mutation) — needed for evolution; (4) it should be able to express itself as "Mendelian characters". **DNA is better for storing information** (no 2′-OH, stable because of T); **RNA is better for expression/catalysis** and mutates faster (so RNA viruses evolve faster).

## 5. Bacterial genetics — three routes of DNA transfer

| Process | Discovery | What happens |
|---|---|---|
| **Transformation** | Griffith (1928) | Uptake of **free/naked DNA** from the environment; competent cells; in biotechnology CaCl₂ + heat shock |
| **Conjugation** | **Lederberg and Tatum (1946)**, *E. coli* | **Direct contact** — DNA transfer from **F⁺ (donor) → F⁻ (recipient)** through the **sex pilus (F pilus)**; Davis's **U-tube experiment (1950)** — no recombination when separated by a filter, i.e. contact is required |
| **Transduction** | **Zinder and Lederberg (1952)**, *Salmonella*, P22 phage | Bacterial DNA carried by a **bacteriophage**; generalised (any gene) and specialised (λ phage — gal, bio genes) |

- **F factor (Fertility factor)** — a plasmid of ≈ 100 kb; carries the *tra* genes (pilus formation). In the free state → **F⁺**; integrated into the bacterial chromosome → **Hfr (High frequency of recombination)** cell; in Hfr × F⁻ the chromosomal genes pass **in sequence** — by "**interrupted mating**" **Jacob and Wollman (1950s)** made the *E. coli* gene map in minutes (whole chromosome ≈ 100 minutes). If the F factor excises incorrectly and carries nearby genes → **F′ (F-prime)** → **sexduction**.
- **Episome** — term of **Jacob and Wollman (1958)**: a genetic element that can exist **both in the free state and integrated into the host chromosome** — e.g. **F factor, λ phage (prophage)**. Not all plasmids are episomes.
- **Plasmid** — term by **Lederberg (1952)**; extrachromosomal, circular, double-stranded, **self-replicating** (own ori); types — F, **R (resistance) plasmid**, Col (colicin), Ti (*Agrobacterium*).
- Lederberg, Tatum, Beadle — Nobel 1958.

> **PYQ (UP PGT 2026):** One bacterium acquires a new metabolic trait after contact with extracellular DNA, while another transfers genes by direct contact involving the F factor. Which explanation links these mechanisms to the role of plasmids and episomes? (A) Transformation involves uptake of free DNA, while conjugation requires the F plasmid, which can exist in the free state or as an episome (B) Conjugation involves only chromosomal genes, while transformation occurs by direct cell fusion (C) Episomes are only viral DNA and plasmids cannot replicate independently (D) Transformation is virus-mediated, while conjugation occurs by random DNA uptake without plasmids. — Reasoned answer (official key not available): **(A)**. (D) confuses transformation with transduction; in (B) and (C) "only" is wrong.

## 6. DNA replication

### 6.1 Three models and the Meselson-Stahl experiment (1958)

| Model | Result |
|---|---|
| **Conservative** | One daughter DNA entirely old, the other entirely new |
| **Semi-conservative** — proposed by Watson-Crick | Each daughter DNA has one old + one new strand |
| **Dispersive** | Each strand a mixture of old and new pieces |

**Matthew Meselson and Franklin Stahl (1958):** *E. coli* was grown for many generations in **¹⁵NH₄Cl** (heavy nitrogen) → all DNA heavy (¹⁵N/¹⁵N). It was then transferred to **¹⁴N** medium; DNA was extracted every 20 minutes (one generation) and separated by **caesium chloride (CsCl) density gradient centrifugation**.

| Generation (in ¹⁴N) | Bands | If conservative |
|---|---|---|
| 0 | 100% heavy (¹⁵N/¹⁵N) | — |
| 1 (20 min) | **100% hybrid (¹⁵N/¹⁴N)** — intermediate density | 50% heavy + 50% light (not found → conservative rejected) |
| 2 (40 min) | **50% hybrid + 50% light** | — (if dispersive, a single band getting progressively lighter → rejected) |
| 3 | 25% hybrid + 75% light | — |
| n | hybrid = 2/2ⁿ, light = 1 − 2/2ⁿ | — |

**Solved example 4:** A bacterium with ¹⁵N-DNA was grown in ¹⁴N for 4 generations. Total 2⁴ = 16 DNA molecules; hybrid (¹⁵N/¹⁴N) = **2** (the two original strands always remain in only 2 molecules); light = **14**; fraction hybrid = 2/16 = **12.5%**.
- **Taylor, Woods and Hughes (1957)** — semi-conservative replication at the chromosome level in ***Vicia faba*** root tips with **³H-thymidine** (autoradiography).

### 6.2 Replication enzymes and proteins (*E. coli*)

| Molecule | Function |
|---|---|
| **DnaA** | Binds at **oriC** (≈ 245 bp, AT-rich) and begins opening the DNA |
| **Helicase (DnaB)** | Breaks H-bonds using ATP and separates the strands — **replication fork**; DnaC loads it |
| **SSB proteins** | Prevent single strands from re-joining |
| **Topoisomerase / DNA gyrase (topo II)** | Relieves the strain of **supercoiling** formed ahead of the fork; gyrase introduces negative supercoils (blocked by quinolones/ciprofloxacin) |
| **Primase (DnaG)** | Short **RNA primer** (≈ 10–12 nt) — because DNA polymerase cannot start a chain from scratch; it needs a **3′-OH** |
| **DNA polymerase III** | **Main replicating enzyme** — 5′→3′ polymerisation, 3′→5′ proofreading; high processivity from the β-clamp |
| **DNA polymerase I** | First polymerase discovered, by **Kornberg (1956)** (Nobel 1959); removes the RNA primer with its **5′→3′ exonuclease** and fills the gap with DNA; repair; **Klenow fragment** |
| **DNA ligase** | **Phosphodiester bond** between Okazaki fragments (seals nicks) — "molecular glue" |
| **Tus–Ter** | Termination of replication (ter sites in *E. coli*) |

- DNA polymerase makes the new strand only in the **5′ → 3′ direction** (adds new nucleotides to the 3′-OH of the growing strand); so the template is read 3′→5′.
- **Leading strand** — made **continuously** in the direction of the fork (one primer).
- **Lagging strand** — made **discontinuously** in the opposite direction in short pieces — **Okazaki fragments (Reiji Okazaki, 1968)**; 1000–2000 nt in prokaryotes, 100–200 nt in eukaryotes; each fragment needs a new primer.
- Energy source — the **deoxynucleoside triphosphates (dNTPs)** themselves: release and breakdown of pyrophosphate (PPi) — dNTPs are **both substrate and energy source**.
- The 4.6 × 10⁶ bp genome of *E. coli* is replicated in **≈ 18 minutes**; according to NCERT the average polymerisation rate is ≈ **2000 bp/second** (≈ 1000 nt/s per fork). Error rate ≈ 10⁻⁹–10⁻¹⁰ (after proofreading + mismatch repair).
- Replication is **bidirectional** — from oriC in both directions; in circular DNA the EM picture is a **θ (theta) form** (**Cairns, 1963**). **Rolling circle** — φX174, transfer of the F factor in conjugation, late phase of λ phage. **D-loop** — mitochondria.
- Unit: the DNA replicated from one ori = **replicon**; one in prokaryotes, thousands in eukaryotes (≈ 30,000–50,000 active ori in humans).

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="20" y1="95" x2="170" y2="95"/>
  <line x1="20" y1="105" x2="170" y2="105"/>
  <text x="20" y="85" fill="currentColor" stroke="none">Parental duplex</text>
  <path d="M 170 95 L 380 30"/>
  <path d="M 170 105 L 380 170"/>
  <text x="172" y="125" fill="currentColor" stroke="none">Helicase</text>
  <circle cx="172" cy="100" r="6"/>
  <path d="M 380 42 L 200 98" stroke-width="2.5"/>
  <path d="M 200 98 l 10 -7 M 200 98 l 12 1"/>
  <text x="250" y="60" fill="currentColor" stroke="none">Leading (continuous)</text>
  <path d="M 230 128 L 280 143" stroke-width="2.5"/>
  <path d="M 290 146 L 340 161" stroke-width="2.5"/>
  <path d="M 350 164 L 380 173" stroke-width="2.5"/>
  <path d="M 280 143 l -10 1 M 280 143 l -6 -7"/>
  <path d="M 340 161 l -10 1 M 340 161 l -6 -7"/>
  <text x="210" y="185" fill="currentColor" stroke="none">Lagging — Okazaki fragments</text>
  <text x="300" y="115" fill="currentColor" stroke="none">Fork direction ←</text>
</svg>

### 6.3 Eukaryotic replication — differences

| Point | Prokaryote | Eukaryote |
|---|---|---|
| ori | One (oriC) | Many; **ARS** (autonomously replicating sequence) in yeast |
| Initiation | DnaA | **ORC** (origin recognition complex) + Cdc6, Cdt1, **MCM helicase** — "licensing" in G₁, only once per cycle |
| Main polymerase | Pol III | **Pol α** (with primase — makes the primer), **Pol δ** (lagging), **Pol ε** (leading); **Pol γ** — mitochondria |
| Clamp | β-clamp | **PCNA** |
| Primer removal | Pol I | **RNase H + FEN1** |
| Speed | ≈ 1000 nt/s | ≈ 50–100 nt/s (slower because of nucleosomes) |
| End problem | No (circular) | **Telomeres** — the end shortens when the last primer of the lagging strand is removed; **telomerase** (adds TTAGGG from its own RNA template; a reverse transcriptase) — active in germ, stem and **cancer cells**; low in somatic cells → **Hayflick limit** (≈ 50 divisions) |

## 7. DNA damage and repair

**Sources of damage:** spontaneous — **deamination** (C → U), **depurination** (loss of a purine), replication errors, **tautomeric shifts**; induced — **UV** (**thymine dimers** between adjacent pyrimidines), ionising radiation (double-strand breaks), chemicals (alkylation, intercalation), oxidative damage (8-oxoguanine).

| Repair mechanism | What it fixes | Key enzymes / notes |
|---|---|---|
| **Direct reversal — Photoreactivation** | Thymine dimers | **Photolyase** (visible/blue light energy); **absent in placental mammals**; Kelner (1949) |
| Direct reversal — alkyl removal | O⁶-methylguanine | **MGMT (methyltransferase)** — "suicide enzyme" (used only once) |
| **Base excision repair (BER)** | Small base defects (U, oxidised, alkylated bases) | **DNA glycosylase** → AP site → **AP endonuclease** → polymerase → ligase (**Tomas Lindahl**) |
| **Nucleotide excision repair (NER)** | Large, helix-distorting lesions — **thymine dimers**, bulky adducts | In *E. coli* **UvrA, UvrB, UvrC** (remove a 12–13 nt piece), UvrD helicase; in humans XP proteins (≈ 24–32 nt) (**Aziz Sancar**); defect → **xeroderma pigmentosum (XP)** — hypersensitivity to sunlight, skin cancer |
| **Mismatch repair (MMR)** | Wrong pairs after replication, small loops | **MutS** (recognition), **MutL**, **MutH** (nicks the new strand); the new strand is recognised because it has not yet been methylated at **GATC by Dam methylase** — **hemimethylated DNA** (**Paul Modrich**); human defect → **Lynch syndrome (HNPCC)** — colon cancer |
| **Double-strand break — homologous recombination (HR)** | DSB, using the sister chromatid as template (in S/G₂) — error-free | **RecA** (bacteria), **Rad51, BRCA1/BRCA2** (humans; defect → breast-ovarian cancer) |
| **Non-homologous end joining (NHEJ)** | Joins DSB ends directly (in G₁) — error-prone | Ku70/80, DNA-PKcs, ligase IV; **V(D)J recombination** in immunity also uses it |
| **SOS response** | "Last resort" in extensive damage | **RecA–LexA** system; error-prone polymerases (Pol IV, Pol V — **translesion synthesis**) → mutations increase; **Evelyn Witkin, Miroslav Radman** |

- Nobel Chemistry 2015 — **Tomas Lindahl (BER), Paul Modrich (MMR), Aziz Sancar (NER, photolyase)**.
- **Proofreading** — 3′→5′ exonuclease activity of the polymerase, **during** replication; MMR acts **after** replication.
- Other repair-defect diseases: **ataxia telangiectasia** (ATM), **Bloom syndrome**, **Fanconi anaemia**, Cockayne syndrome.

> **Exam angle:** "Thymine dimer → which repair?" — both **photoreactivation (photolyase)** and **NER**; but in humans only **NER** (no photolyase). XP = NER defect; HNPCC = MMR defect; BRCA = HR defect.

<div class="formula">

**Timeline of experiments (for sequence questions)**

Miescher — nuclein (1869) → Griffith — transformation (1928) → Avery, MacLeod, McCarty — DNA is the transforming principle (1944) → Lederberg and Tatum — conjugation (1946) → Chargaff's rules (1950) → Zinder and Lederberg — transduction (1952) → Hershey-Chase — T2 phage (1952) → Watson-Crick — double helix (1953) → Kornberg — DNA Pol I (1956) → Taylor — *Vicia faba* (1957) → Meselson-Stahl (1958) → Okazaki fragments (1968) → Temin-Baltimore — reverse transcriptase (1970) → Z-DNA (1979).

**Numbers to remember:** 0.34 nm/bp · 3.4 nm/turn · 10 bp/turn · 2 nm diameter · A=T two, G≡C three H-bonds · *E. coli* 4.6 × 10⁶ bp · human diploid 6.6 × 10⁹ bp (≈ 2.2 m) · RNA primer ≈ 10–12 nt · Okazaki fragments 1000–2000 nt (prokaryotes), 100–200 nt (eukaryotes).

</div>

## Traps and exceptions

- Chargaff's rules do not apply to **single-stranded DNA (φX174)** — there A ≠ T.
- "RNA has no thymine" — generally true, but the **TΨC loop of tRNA has ribothymidine**.
- Griffith did **not** identify DNA — he only showed transformation; identification was by Avery et al. (1944).
- Hershey-Chase used **T2** phage (not T4) — a common trap in exam options.
- Meselson-Stahl used a **CsCl** density gradient (not sucrose); only one hybrid band in the first generation.
- DNA polymerase does **not synthesise in the 3′ → 5′ direction** — its 3′→5′ activity is only **exonuclease (proofreading)**.
- The main replicating enzyme is **Pol III**, **not Pol I** (Pol I was discovered first).
- The RNA primer is made by **primase** (a type of RNA polymerase), not by DNA polymerase.
- Episome ≠ plasmid: an episome can also be **integrated into the chromosome**; the F factor is both.
- In transduction the phage carries **bacterial DNA**; no virus is involved in transformation.
- Z-DNA is left-handed; A and B are both right-handed.

## Quick revision

1. Nuclein — Miescher (1869).
2. Chargaff — A = T, G = C; purines = pyrimidines.
3. Watson-Crick (1953); X-ray — Franklin, Wilkins; Nobel 1962.
4. B-DNA — right-handed, 10 bp/turn, 3.4 nm pitch, 2 nm diameter.
5. Z-DNA — left-handed, 12 bp/turn, Alexander Rich.
6. A=T two, G≡C three H-bonds.
7. tRNA clover-leaf — Holley (1965); 3D — L-shape; 3′ CCA.
8. rRNA most abundant (≈ 80%); mRNA least.
9. Griffith (1928) — transformation, pneumococcus, mice.
10. Avery, MacLeod, McCarty (1944) — DNase stopped transformation.
11. Hershey-Chase (1952) — T2, ³²P inside, ³⁵S outside.
12. TMV RNA — Fraenkel-Conrat.
13. Conjugation — Lederberg and Tatum (1946); transduction — Zinder and Lederberg (1952).
14. Episome — Jacob and Wollman; F factor and λ phage.
15. Semi-conservative — Meselson and Stahl (1958), ¹⁵N, CsCl.
16. Okazaki fragments — lagging strand (1968).
17. Main polymerase — Pol III; Pol I — Kornberg, primer removal.
18. Gyrase — topoisomerase II.
19. Eukaryotes — Pol α (primer), δ (lagging), ε (leading), γ (mitochondria).
20. Telomerase — reverse transcriptase; Nobel 2009.
21. Photolyase — thymine dimers; absent in placental mammals.
22. XP — NER defect; HNPCC — MMR defect.
23. Nobel 2015 — Lindahl, Modrich, Sancar.

## Practice questions (with answers)

1. If DNA has 30% G, how much T? — **20%** (G = C = 30, A + T = 40).
2. Which isotope was found in the pellet in the Hershey-Chase experiment? — **³²P** (DNA went inside the bacteria).
3. In Griffith's experiment which combination kills the mouse? — **Heat-killed S + live R**.
4. In Avery's experiment which enzyme stopped transformation? — **DNase**.
5. Bands after the second generation in Meselson-Stahl? — **50% hybrid + 50% light**.
6. Light DNA after growing ¹⁵N-DNA for 3 generations in ¹⁴N? — **75%** (6 of 8).
7. What joins Okazaki fragments? — **DNA ligase**.
8. Why does DNA polymerase need a primer? — **It can add nucleotides only to an existing 3′-OH**.
9. What relieves supercoiling strain in *E. coli*? — **DNA gyrase (topo II)**.
10. Polymerase that makes the leading strand in eukaryotes? — **Pol ε**.
11. One reason cancer cells are immortal? — **Activation of telomerase**.
12. What damage does UV cause? — **Thymine (pyrimidine) dimers**.
13. How is the new strand recognised in mismatch repair? — **By the absence of methylation at GATC** (hemimethylated DNA).
14. Xeroderma pigmentosum is a defect of which repair? — **Nucleotide excision repair (NER)**.
15. What is an Hfr cell? — **One in which the F factor is integrated into the bacterial chromosome** (high frequency of recombination).
16. Gene transfer by a bacteriophage? — **Transduction**.
17. Length of 500 bp DNA? — **170 nm** (500 × 0.34).
18. Basis of the RNA world hypothesis? — **Ribozymes** (RNA as catalyst + information carrier).

**For more depth (English):** [Molecular biology — DNA to protein](/interview/bpsc-tre/class-11-12-zoology/cell-genetics/molecular-biology-dna-to-protein). Next chapter: [Genetic code and gene expression](/interview/up-pgt/jeev-vigyan/jantu-3/anuvanshik-koot-aur-jeen-abhivyakti).
