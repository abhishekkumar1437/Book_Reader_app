---
title: Cell Cycle, Mitosis, Meiosis and Chromosomes
part: Cell Biology
summary: Phases of the cell cycle, checkpoints, cyclin-CDK, p53-Rb, stages of mitosis, meiosis (the five sub-stages of prophase I, synaptonemal complex, chiasmata), chromosome structure — nucleosome, hetero- and euchromatin, types of centromere, polytene and lampbrush chromosomes, karyotype — and the arithmetic of chromosome number and DNA content during division.
---

This chapter covers Unit 8's "mitosis, meiosis, cell cycle" and "chromosome structure and behaviour" together. NCERT 11 ("Cell Cycle and Cell Division") is the base; the B.Sc./M.Sc. layer adds checkpoints, cyclin-CDK, the synaptonemal complex, polytene-lampbrush chromosomes and the nucleosome. In UP PGT the most likely questions are on the **sequence** of stages, "which event in which sub-stage" (match) and **DNA content/chromosome number**.

> **In simple words:** A cell first grows and doubles its DNA (interphase), then divides. In **mitosis** one cell gives two identical cells — the chromosome number stays the same (growth, repair). In **meiosis** one cell divides twice to give four cells with half the chromosomes (gametes), and in between, the paired chromosomes exchange segments (crossing over) — this is what produces variation.

## 1. Cell cycle

**Howard & Pelc (1953)**, using radioactive phosphorus in *Vicia faba*, divided the cell cycle into G₁, S, G₂ and M.

| Phase | Events | DNA content (starting from 2C) |
|---|---|---|
| **G₁ (Gap 1)** | Cell growth, RNA and protein synthesis, growth of organelles; the most variable period | 2C |
| **G₀ (Quiescent stage)** | Out of the cycle, metabolically active but not dividing — **nerve, heart muscle** cells | 2C |
| **S (Synthesis)** | **DNA replication**, histone synthesis; **centriole duplication** in animal cells | 2C → **4C** (chromosome number does **not** change) |
| **G₂ (Gap 2)** | Tubulin and proteins for division; division of mitochondria and chloroplasts | 4C |
| **M (Mitosis)** | Nuclear division (karyokinesis) + cytoplasmic division (cytokinesis) | 4C → 2C per daughter |

- The cycle of a human cell (in culture) is ≈ **24 hours**, of which M is ≈ **1 hour** — i.e. **more than 95% of the cycle is spent in interphase** (NCERT). **Yeast ≈ 90 minutes**.
- Calling **interphase** a "resting phase" is wrong — it is the most metabolically active stage.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <circle cx="130" cy="100" r="75"/>
  <line x1="130" y1="100" x2="130" y2="25"/>
  <line x1="130" y1="100" x2="196" y2="135"/>
  <line x1="130" y1="100" x2="65" y2="138"/>
  <line x1="130" y1="100" x2="105" y2="29"/>
  <text x="150" y="80" fill="currentColor" stroke="none">G₁</text>
  <text x="122" y="160" fill="currentColor" stroke="none">S</text>
  <text x="75" y="95" fill="currentColor" stroke="none">G₂</text>
  <text x="104" y="52" fill="currentColor" stroke="none">M</text>
  <path d="M 205 100 A 75 75 0 0 1 200 128" />
  <path d="M 200 128 l -2 -9 M 200 128 l 7 -6"/>
  <text x="230" y="40" fill="currentColor" stroke="none">Checkpoints:</text>
  <text x="230" y="62" fill="currentColor" stroke="none">1. G₁/S (restriction pt; yeast START)</text>
  <text x="230" y="84" fill="currentColor" stroke="none">2. G₂/M (DNA replication done?)</text>
  <text x="230" y="106" fill="currentColor" stroke="none">3. Spindle (metaphase→anaphase)</text>
  <text x="230" y="140" fill="currentColor" stroke="none">Exit from G₁ → G₀</text>
  <text x="230" y="162" fill="currentColor" stroke="none">Interphase = G₁ + S + G₂</text>
</svg>

### 1.1 Control of the cell cycle — cyclins, CDKs and checkpoints

- **Cyclins** — proteins whose levels rise and fall during the cycle (discovered by **Tim Hunt** in sea urchin eggs).
- **CDKs (Cyclin-dependent kinases)** — active only when bound to a cyclin; phosphorylate target proteins.
- **MPF (Maturation/M-phase Promoting Factor)** = **cyclin B + CDK1 (cdc2)** — entry from G₂ → M; identified in frog oocytes (Masui and Markert, 1971).
- Nobel 2001: **Leland Hartwell** (*cdc* genes, yeast, the "checkpoint" concept), **Paul Nurse** (cdc2/CDK1), **Tim Hunt** (cyclins).
- **APC/C (Anaphase-Promoting Complex)** — ubiquitin-tags cyclin B and securin → **separase** becomes active → **cohesin** is cleaved → sister chromatids separate → anaphase.

| Checkpoint | What it checks | Key molecules |
|---|---|---|
| **G₁/S (restriction point R)** | Cell size, nutrition, growth factors, DNA damage | Cyclin D-CDK4/6, cyclin E-CDK2; phosphorylation of **Rb** → **E2F** released; **p53 → p21** (CDK inhibitor) |
| **G₂/M** | Is DNA replication complete and damage-free? | Cyclin B-CDK1 (MPF), Wee1, Cdc25 |
| **Spindle assembly (M checkpoint)** | Are all kinetochores attached to the spindle? | Mad2, BubR1 → inhibition of APC/C |

- **p53** — "**Guardian of the genome**", on chromosome 17p; on DNA damage it halts the cycle or triggers **apoptosis**; the most frequently mutated gene in human cancers.
- **Rb (retinoblastoma protein)** — tumour suppressor; unphosphorylated Rb binds E2F and blocks the S phase. Knudson's "**two-hit hypothesis**", 1971.
- **Proto-oncogene → oncogene** (e.g. *ras*, *myc*) — the "accelerator" gets stuck; tumour suppressor genes — the "brakes" fail.

## 2. Mitosis

Term by **Walther Flemming (1882)** — in salamander cells. Mitosis is an **equational division** — 2n → 2n. It occurs in somatic cells; it can also occur in haploid organisms/stages (e.g. plant gametophytes, male honeybee).

| Stage | Main events |
|---|---|
| **Prophase** | Chromatin condensation → chromosomes with two sister chromatids become visible; centrioles move towards opposite poles, **spindle** forms; by the end **nucleolus and nuclear envelope disappear**; Golgi and ER not visible |
| (Prometaphase) | After the nuclear envelope breaks down, spindle fibres attach to the **kinetochores** |
| **Metaphase** | Chromosomes on the **metaphase plate (equatorial plane)**; the two kinetochores of each attached to opposite poles; **best time to study chromosome morphology** (karyotype made at this stage) |
| **Anaphase** | Centromeres split, **sister chromatids separate** and move to opposite poles (centromere leading, arms trailing — V, J, I shapes); **anaphase A** — kinetochore fibres shorten, **anaphase B** — poles move apart |
| **Telophase** | Chromosomes decondense at the poles, **nuclear envelope, nucleolus, Golgi, ER re-form**; the reverse of prophase |
| **Cytokinesis** | Animals — **cleavage furrow**, actin-myosin contractile ring; plants — **cell plate** (middle lamella) from Golgi vesicles on the **phragmoplast**, from the centre outwards |

> **Memory trick:** "**P-M-A-T**" — **P**ack (condensation), **M**iddle (at the middle), **A**part (separation), **T**wo nuclei.

- If cytokinesis does not follow nuclear division, the result is a **multinucleate condition (syncytium)** — e.g. the **liquid endosperm of coconut**.
- **Endomitosis** — chromosomes duplicate inside the nuclear envelope, the cell does not divide → polyploidy; **endoreduplication** → polytene chromosomes.
- **Amitosis** — Remak (1841): the nucleus simply elongates and divides, no spindle — e.g. the **macronucleus** of *Paramecium*, cartilage cells.
- **Closed mitosis** — the nuclear envelope does not break down (yeast, many protists; in **dinoflagellates** the spindle is outside the nucleus).
- **Colchicine** (*Colchicum autumnale*) blocks tubulin polymerisation and arrests division at **metaphase** — used for making karyotypes and inducing polyploidy.
- Main sites of mitosis: in plants the **meristem** — the onion **root tip** is the best laboratory material; in animals bone marrow, basal layer of the skin, intestinal epithelium.

**Significance:** genetically identical daughter cells, growth, repair, cell replacement, restoring the **nucleo-cytoplasmic ratio**, asexual reproduction/vegetative propagation.

## 3. Meiosis

- **Édouard van Beneden (1883)** described it in *Ascaris*; **Weismann (1887)** explained its necessity; the term "meiosis" — **Farmer and Moore (1905)**.
- **Meiosis I = reductional division** — homologous chromosomes separate (2n → n); **meiosis II = equational division** — sister chromatids separate (like mitosis).
- During **interkinesis** between meiosis I and II **there is no DNA replication**.
- Sites: in animals the **gonads** — gametic meiosis; in flowering plants anthers and ovules — sporic meiosis; in algae/fungi (e.g. *Chlamydomonas*, *Spirogyra*) in the zygote (zygotic meiosis).

### 3.1 Prophase I — five sub-stages (the longest and most asked)

| Sub-stage | Meaning | Main event |
|---|---|---|
| **Leptotene** | Thin thread | Chromosomes long and thin, **chromomeres** visible; in animals the ends attach to the nuclear envelope — the "**bouquet**" stage |
| **Zygotene** | Paired thread | Pairing of homologous chromosomes = **synapsis**; the **synaptonemal complex** forms (Moses, 1956); the paired set = **bivalent** or **tetrad** |
| **Pachytene** | Thick thread | All four chromatids distinct; **crossing over** — at **recombination nodules**, enzyme **recombinase**; the longest sub-stage (usually) |
| **Diplotene** | Double thread | Synaptonemal complex dissolves, homologues begin to separate, remaining joined only at crossover sites — **chiasmata** become visible; in vertebrate **oocytes** this stage can last months to years = **dictyotene**; **lampbrush chromosomes** in amphibian oocytes |
| **Diakinesis** | Movement across | Chiasmata move towards the ends = **terminalisation**; chromosomes maximally condensed; nucleolus and nuclear envelope disappear; spindle forms — transition to metaphase |

> **Memory trick:** "**Le-Zy-Pa-Di-Dia**" → "**L**ittle **Z**ebras **P**lay **D**uring **D**ay" — leptotene, zygotene, pachytene, diplotene, diakinesis. And the events: **Z = Zip (synapsis), P = Pass (crossing over), D = Display (chiasmata), D = Disappear (terminalisation)**.

> **Common mistake:** Crossing over happens in **pachytene**, but chiasmata are seen in **diplotene**. The chiasma is the **cytological result** of crossing over, not its cause.

### 3.2 Remaining stages of meiosis

| Stage | Meiosis I | Meiosis II |
|---|---|---|
| Metaphase | **Bivalents** at the equator — in two rows (homologous pairs); both sister kinetochores attached to the same pole | Single chromosomes in one row |
| Anaphase | **Homologous chromosomes separate**, sister chromatids remain joined at the centromere (centromeric cohesin protected by **shugoshin**) | **Centromeres split**, sister chromatids separate |
| Telophase | Two nuclei, each with n chromosomes (each with two chromatids) — **dyad** | Four haploid nuclei — **tetrad** |

### 3.3 Mitosis vs meiosis

| Point | Mitosis | Meiosis |
|---|---|---|
| Cells | Somatic | Germ cells (meiocytes) |
| Divisions | One | Two (I and II) |
| Daughter cells | 2, diploid, identical | 4, haploid, different |
| Synapsis and crossing over | No | Yes (prophase I) |
| Prophase | Short, simple | Long, 5 sub-stages |
| Metaphase plate | Single chromosomes | Bivalents (in MI) |
| Separating in anaphase | Sister chromatids | MI — homologues; MII — sister chromatids |
| Significance | Growth, repair, genetic stability | Keeps chromosome number constant, **variation** (independent assortment + crossing over) |

**Significance of meiosis:** chromosome number constant generation after generation; cytological basis of Mendel's **segregation** (homologues separate in anaphase I) and **independent assortment** (random orientation of bivalents at metaphase I — **2ⁿ** combinations from n pairs; in humans 2²³ ≈ 8.4 million); variation for evolution.

### 3.4 Arithmetic of DNA content and chromosome number (with solutions)

Suppose a diploid organism has 2n = 8 and DNA = 2C in G₁.

| Stage | Chromosome number | Chromatid number | DNA content |
|---|---|---|---|
| G₁ | 8 | 8 | 2C |
| G₂ / prophase / metaphase (mitosis) | 8 | 16 | 4C |
| Anaphase (mitosis) — whole cell | **16** | 16 | 4C |
| Mitotic daughter cell | 8 | 8 | 2C |
| Prophase I / metaphase I | 8 (4 bivalents) | 16 | 4C |
| Each cell after telophase I | 4 | 8 | 2C |
| Anaphase II — each cell | 8 (temporary) | 8 | 2C |
| Gamete | 4 | 4 | **1C** |

**Solved question 1:** A cell has 20 pg DNA in G₁ and 2n = 14. DNA and chromosomes at metaphase I? — After S, DNA = **40 pg**, chromosomes = **14** (7 bivalents), chromatids = 28. In the gamete DNA = **10 pg**, chromosomes = **7**.
**Solved question 2:** In an organism with 2n = 24, how many cells after meiosis I and how many chromosomes in each? — **2 cells**, each with **12** (two-chromatid) chromosomes.
**Solved question 3:** How many sperms will 100 primary spermatocytes give? — 100 × 4 = **400**; 100 primary oocytes — **100 ova** (+ polar bodies). Primary spermatocytes needed to make 100 sperms = 100/4 = **25**; secondary = **50**.

## 4. Chromosome structure

- The term "**chromosome**" — **Waldeyer (1888)**; first seen by **Hofmeister (1848)** in pollen mother cells of *Tradescantia*; described by **Strasburger (1875)**.
- Metaphase chromosome = two **sister chromatids** + **primary constriction (centromere)**; on either side of the centromere are disc-shaped **kinetochores** (site of spindle fibre attachment).
- **Secondary constriction** — on some chromosomes; **NOR** (nucleolar organiser); the small part beyond it = **satellite**, such chromosomes = **SAT chromosomes**.
- **Telomere** — ends of the chromosome (named by **Muller**); repeat **TTAGGG** in humans; protect chromosomes from sticking together and from degradation; **telomerase** (ribonucleoprotein, reverse transcriptase) — Nobel 2009 (Blackburn, Greider, Szostak).

### 4.1 Types based on the position of the centromere

| Type | Centromere | Arms | Anaphase shape |
|---|---|---|---|
| **Metacentric** | In the middle | Equal | **V** |
| **Sub-metacentric** | Slightly away from the middle | Unequal | **L / J** |
| **Acrocentric** | Near one end | One very short | **J / rod** |
| **Telocentric** | Right at the end | One arm | **I (rod)** — **not in humans** |

By number of centromeres: monocentric, dicentric, acentric (lost during division), **diffuse/holocentric** — *Ascaris*, *Luzula*, some insects.

### 4.2 Chromatin — euchromatin and heterochromatin (Heitz, 1928)

| Feature | Euchromatin | Heterochromatin |
|---|---|---|
| Condensation | Loose, decondensed in interphase | Dense, stains darkly |
| Transcription | **Active** | **Inactive** (usually) |
| Replication | Early in S phase | Late |
| Location | Centre of the nucleus | Periphery, centromeres, telomeres |
| Molecular marks | Histone **acetylation** | DNA **methylation**, H3K9 methylation, HP1 protein |

- **Constitutive heterochromatin** — always condensed in all cells; **satellite DNA** (highly repetitive sequences) near centromeres, a large part of the Y chromosome.
- **Facultative heterochromatin** — condensed only sometimes; example — the inactive X of female mammals = **Barr body** (Barr and Bertram, 1949; Lyon hypothesis 1961). Number of Barr bodies = **number of X − 1**.

### 4.3 Nucleosome model — DNA packaging

- **Roger Kornberg (1974)** — nucleosome model; named by **Oudet et al. (1975)**; **Olins and Olins (1974)** saw "**beads-on-a-string**" in the EM.
- **Histone octamer** = (H2A, H2B, H3, H4) × 2; the **H3–H4 tetramer** in the centre, two **H2A–H2B dimers** at the sides.
- **≈ 146–147 bp of DNA wrapped ≈ 1.65 (1¾) times**, left-handed, around the octamer = **core particle**; with **linker DNA** + **H1** ≈ **200 bp** = one nucleosome.
- Histones are **basic** (positively charged due to lysine, arginine) — bind the negatively charged DNA phosphates. Most conserved histone — **H4** (and H3); least — **H1**.
- Levels of packaging: naked DNA (2 nm) → nucleosome "beads" (**10–11 nm** fibre) → with H1 the **30 nm** fibre (**solenoid**, ≈ 6 nucleosomes/turn) → loops (300 nm) → condensed coil (700 nm) → metaphase chromosome (1400 nm). **Non-histone chromosomal (NHC) proteins** — higher-order packaging, scaffold (**topoisomerase II, condensin**).
- Human diploid DNA ≈ **6.6 × 10⁹ bp**, length ≈ **2.2 m** (NCERT: length = bp × 0.34 × 10⁻⁹ m); *E. coli* ≈ **4.6 × 10⁶ bp**, ≈ 1.36 mm.

> **PYQ (UP PGT 2026):** Which statement correctly describes nucleosome structure? (A) Nucleosomes are made only of linker DNA (B) DNA is coiled around RNA polymerase complexes (C) DNA is wrapped around a core of eight histone proteins (D) Histones are arranged with DNA as a single linear protein. — Reasoned answer (official key not available): **(C)** — the histone octamer (two molecules each of H2A, H2B, H3, H4).

**Solved question 4:** A mammalian cell has a total of 6.6 × 10⁹ bp and one nucleosome has 200 bp. Number of nucleosomes? — 6.6 × 10⁹ / 200 = **3.3 × 10⁷** (an NCERT question).

### 4.4 Special (giant) chromosomes

| Feature | **Polytene chromosome** | **Lampbrush chromosome** |
|---|---|---|
| Discovery | **Balbiani (1881)**, salivary gland of *Chironomus* larva | Seen by **Flemming (1882)**; named by **Rückert (1892)** |
| Location | Larvae of dipteran insects — **salivary glands** of ***Drosophila***, Malpighian tubules | **Oocytes** of vertebrates (especially **amphibians — salamander**, birds); nucleus of *Acetabularia*; Y of *Drosophila* spermatocytes |
| Stage | Interphase (non-dividing cell) | **Diplotene** of meiotic prophase I |
| Formation | **Endoreduplication** — DNA replication without division; up to ≈ 1000 (2¹⁰) strands in *Drosophila*; **somatic pairing** — homologues stuck together | **Lateral loops** projecting from the axis in a bivalent (transcriptionally active) |
| Special structures | Dark **bands** and light interbands; **chromocentre**; **puffs**, and large puffs = **Balbiani rings** — active transcription (induced by the hormone ecdysone) | Loops like a "brush for cleaning lamps"; **mRNA and yolk synthesis** — the oocyte's store |
| Size | ≈ 100 times longer than normal in *Drosophila* | Up to 800–1000 µm in salamander |

> **Exam angle:** Polytene chromosome = "**salivary gland + endoreduplication + puffs (Balbiani rings)**"; lampbrush = "**oocyte + diplotene + loops**". Puffing is direct evidence of "**differential gene activity**".

**B-chromosomes (accessory/supernumerary)** — in maize etc.; extra, mostly heterochromatic, without essential genes.

### 4.5 Karyotype and idiogram

- **Karyotype** — the set of somatic chromosomes of a species with their number, size and shape (usually a metaphase photograph arranged in pairs). **Idiogram** — its diagrammatic representation.
- Correct determination of human 2n = 46 — **Joe Hin Tjio and Albert Levan (1956)** (earlier believed to be 48).
- Method: lymphocyte culture → division induced with **phytohaemagglutinin (PHA)** → **colchicine** (arrests metaphase) → **hypotonic KCl** (swells the cells) → fixation → **G-banding (Giemsa banding)**.
- Banding: **G-bands** (Giemsa, AT-rich dark), **Q-bands** (quinacrine, fluorescence — the first method, Caspersson 1968–70), **R-bands** (reverse), **C-bands** (centromeric heterochromatin); **FISH** — fluorescent probes.
- Human chromosomes in the **Denver classification (1960)** are in **seven groups A–G**; acrocentric — group **D (13–15)** and **G (21, 22, Y)**.

| Organism | 2n |
|---|---|
| *Ascaris megalocephala univalens* | **2** (among the lowest) |
| *Drosophila melanogaster* | 8 |
| Pea | 14 |
| Maize | 20 |
| Frog (*Rana*) | 26 |
| Cat | 38 |
| Mouse (*Mus*) | 40 |
| Human | 46 |
| Chimpanzee, gorilla, potato | 48 |
| Dog, chicken | 78 |
| *Ophioglossum reticulatum* (fern) | ≈ **1260** (highest known) |

<div class="formula">

**At a glance — main events of division and their timing**

- Centriole duplication → **S** · DNA replication → **S** · Tubulin synthesis → **G₂**
- Breakdown of nuclear envelope → **end of prophase/prometaphase** · Kinetochore-spindle attachment → **prometaphase**
- Sister chromatids separate → **mitotic anaphase, anaphase II** · Homologues separate → **anaphase I**
- Synapsis → **zygotene** · Crossing over → **pachytene** · Chiasmata → **diplotene** · Terminalisation → **diakinesis**
- First arrest of human oocyte → **diplotene (dictyotene)** · Second arrest → **metaphase II** (until fertilisation)
- Reduction → **meiosis I** · DNA replication before meiosis II → **none**

</div>

## Traps and exceptions

- In S phase the **DNA doubles**, **not the chromosome number** — the chromosome number appears doubled only in mitotic anaphase (temporarily).
- Meiosis II is **like mitosis**, but no DNA replication precedes it and the daughter cells are genetically different (sister chromatids are not identical because of crossing over).
- **Reduction** happens in meiosis I, not in meiosis II.
- There is no crossing over in *Drosophila* **males** (and no synaptonemal complex forms either); none in the **female** silkworm (*Bombyx*).
- A polytene chromosome is **not** polyploid — the chromosome number does not increase; the strands within one chromosome increase (polyteny).
- **Kinetochore** and **centromere** are not the same — the centromere is a DNA region, the kinetochore is the protein complex built on it.
- Meiosis in oogenesis is interrupted: the human primary oocyte stays arrested in **diplotene (dictyotene)** from birth till puberty; the secondary oocyte is ovulated arrested at **metaphase II**, and meiosis II is completed only after **fertilisation**.
- G₀ cells are not "dead" — liver cells can re-enter the cycle from G₀ on a suitable signal.

## Quick revision

1. Phases of the cell cycle — Howard and Pelc (1953).
2. Human cell cycle ≈ 24 hours; M ≈ 1 hour; yeast ≈ 90 minutes.
3. S phase — DNA 2C → 4C; centriole duplication.
4. MPF = cyclin B + CDK1.
5. Nobel 2001 — Hartwell, Hunt, Nurse.
6. p53 — guardian of the genome; Rb — blocks E2F.
7. The term mitosis — Flemming (1882); meiosis — Farmer and Moore (1905).
8. Metaphase — best for chromosome study.
9. Anaphase — splitting of the centromere (mitosis and MII).
10. Colchicine — arrest at metaphase, induction of polyploidy.
11. Synapsis — zygotene; synaptonemal complex.
12. Crossing over — pachytene; recombinase.
13. Chiasmata — diplotene; terminalisation — diakinesis.
14. Anaphase I — homologous chromosomes separate.
15. Nucleosome — Kornberg (1974); octamer + 146 bp; one nucleosome ≈ 200 bp.
16. 10 nm beads → 30 nm solenoid (H1).
17. The term heterochromatin — Heitz (1928); Barr body — facultative heterochromatin.
18. Polytene — Balbiani (1881), *Drosophila* salivary gland, Balbiani rings.
19. Lampbrush — amphibian oocyte, diplotene.
20. Human 2n = 46 — Tjio and Levan (1956).
21. Telocentric chromosomes are not found in humans.
22. Telomere — TTAGGG; telomerase Nobel 2009.

## Practice questions (with answers)

1. In which phase of the cell cycle does DNA replication occur? — **S phase** (DNA 2C to 4C).
2. In which phase do nerve cells remain permanently? — **G₀** (out of division).
3. What is called the "Guardian of the genome"? — **p53** (halts the cycle/apoptosis on DNA damage).
4. Cleavage of which protein separates sister chromatids? — **Cohesin** (by separase).
5. Best stage for studying chromosome morphology? — **Metaphase** (maximum condensation).
6. When does the synaptonemal complex form? — **Zygotene** (synapsis).
7. In which sub-stage are recombination nodules seen? — **Pachytene** (crossing over).
8. In which sub-stage does terminalisation occur? — **Diakinesis**.
9. At which stage are lampbrush chromosomes found? — **Diplotene** (amphibian oocyte).
10. In which stage does the human oocyte remain arrested from birth till puberty? — **Diplotene/dictyotene** (prophase I).
11. Chromosomes in the gamete of an organism with 2n = 20? — **10**.
12. If G₁ has 2C DNA, what is in a metaphase II cell? — **2C** (4C halved after MI).
13. How many histone molecules in the nucleosome core? — **8** (H2A, H2B, H3, H4 × 2).
14. Which histone is involved in forming the 30 nm fibre? — **H1** (linker histone).
15. What do "puffs" in polytene chromosomes indicate? — **Active transcription** (differential gene activity).
16. Which chromosome shows a J shape in anaphase? — **Sub-metacentric/acrocentric** (unequal arms).
17. The liquid endosperm of coconut is an example of what? — **Nuclear division without cytokinesis** (free-nuclear).
18. Total chromosomes in mitotic anaphase of a 2n = 46 cell? — **92** (sister chromatids, once separated, are called chromosomes).

**For more depth (in English):** [Cell cycle, mitosis and meiosis](/interview/bpsc-tre/class-11-12-zoology/cell-genetics/cell-cycle-mitosis-and-meiosis) · [Chromosomes, linkage, sex determination](/interview/bpsc-tre/class-11-12-zoology/cell-genetics/chromosomes-linkage-sex-determination-and-disorders). Next chapter: [DNA and RNA, replication and repair](/interview/up-pgt/jeev-vigyan/jantu-3/dna-rna-pratikritiyan-aur-marammat).
