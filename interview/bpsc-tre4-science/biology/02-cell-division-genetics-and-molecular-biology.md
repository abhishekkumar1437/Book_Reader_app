---
title: Cell Division, Genetics and Molecular Biology
part: Cell and Molecules
summary: Cell cycle, mitosis and meiosis; Mendel's laws and every deviation (incomplete dominance, codominance, linkage, sex determination); chromosomal and Mendelian disorders; DNA, RNA, replication, transcription, translation, the genetic code and the lac operon.
---

This chapter joins NCERT class 10 "Heredity", class 11 "Cell Cycle and Cell Division" and class 12 "Principles of Inheritance and Variation" and "Molecular Basis of Inheritance", with the B.Sc. genetics points TRE likes (polysome, operon, Okazaki fragments, codon facts).
TRE asks: "diploid number in humans", "which is a hereditary disease", "Mendel's principle is based on", "functional unit of protein synthesis", "stages of meiosis", and number-type facts (3:1, 9:3:3:1, 64 codons).

> **In simple words:** A cell copies itself by mitosis (two identical daughters) and makes sex cells by meiosis (chromosome number halved). Mendel showed that characters pass to children as separate "factors" (genes) that come in pairs. Genes are pieces of DNA; DNA is copied (replication), read into RNA (transcription), and RNA is read into protein (translation).

## 1. Chromosomes — the basics

- **Chromosome** (term by Waldeyer, 1888) = DNA + histone proteins, visible during division. Each has a **centromere** (primary constriction) holding two sister **chromatids**; ends are **telomeres**.
- Position of centromere: **metacentric** (middle, V-shape at anaphase), **sub-metacentric** (slightly off, L-shape), **acrocentric** (near end, J-shape), **telocentric** (at end, I/rod-shape; absent in humans).
- **Diploid (2n)**: two sets (body cells). **Haploid (n)**: one set (gametes).
- **Karyotype**: picture of all chromosomes of a cell arranged in pairs.

| Organism | Diploid number (2n) |
|---|---|
| **Human** | **46** (22 pairs autosomes + 1 pair sex chromosomes) |
| Chimpanzee, gorilla | 48 |
| Drosophila (fruit fly) | 8 |
| Pea (*Pisum sativum*) | 14 |
| Onion | 16 |
| Rice | 24 |
| Maize | 20 |
| Bread wheat (hexaploid) | 42 |
| Potato | 48 |
| Dog | 78 |
| *Ophioglossum* (adder's tongue fern) | about 1260 — highest known |
| *Ascaris megalocephala univalens* | 2 — lowest |

> **PYQ:** TRE 2.0 (2023) asked: "Diploid chromosome number in humans is (A) 46 (B) 44 (C) 48 …". Official answer: **(A) 46**. (44 = autosomes only; 48 = chimpanzee.)

> **PYQ:** TRE 3.0 (2024) had a question on chromosomes (per PW analysis). Revise the numbers above and centromere types.

## 2. Cell cycle

Interphase (about 95% of the cycle; the cell is very active, not "resting") + M phase (division).

| Phase | What happens |
|---|---|
| **G₁** (gap 1) | Growth, normal metabolism, preparation for DNA copying |
| **S** (synthesis) | **DNA replication**: DNA amount doubles (2C → 4C); chromosome **number stays 2n**; centriole duplicates (animal) |
| **G₂** (gap 2) | Proteins for mitosis made; organelles increase |
| **M** (mitosis) | Karyokinesis (nucleus) + cytokinesis (cytoplasm) |
| **G₀** (quiescent) | Cells that exit the cycle and stop dividing, e.g. heart muscle cells, mature neurons |

A typical human cell in culture divides about once in **24 hours**; yeast in about 90 minutes.

## 3. Mitosis (equational division)

Occurs in somatic (body) cells; in plants at **meristems** (root tip, shoot tip — onion root tip is the classic lab material). Daughter cells are identical to the parent (2n → 2n).

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <circle cx="55" cy="90" r="42"/>
  <circle cx="55" cy="90" r="24" stroke-dasharray="4 3"/>
  <path d="M42 80 l10 10 M52 80 l-10 10 M58 92 l10 10 M68 92 l-10 10 M48 98 l8 8 M56 98 l-8 8"/>
  <text x="22" y="150" fill="currentColor" stroke="none">Prophase</text>
  <circle cx="160" cy="90" r="42"/>
  <line x1="160" y1="60" x2="160" y2="120" stroke-dasharray="2 3" stroke-width="0.8"/>
  <path d="M154 70 l12 10 M166 70 l-12 10 M154 85 l12 10 M166 85 l-12 10 M154 100 l12 10 M166 100 l-12 10"/>
  <path d="M122 90 L154 75 M122 90 L154 90 M122 90 L154 105 M198 90 L166 75 M198 90 L166 90 M198 90 L166 105" stroke-width="0.6"/>
  <text x="128" y="150" fill="currentColor" stroke="none">Metaphase</text>
  <circle cx="265" cy="90" r="42"/>
  <path d="M245 70 l-8 6 l8 6 M245 86 l-8 6 l8 6 M245 102 l-8 6 l8 6"/>
  <path d="M285 70 l8 6 l-8 6 M285 86 l8 6 l-8 6 M285 102 l8 6 l-8 6"/>
  <path d="M227 92 L237 76 M227 92 L237 92 M227 92 L237 108 M303 92 L293 76 M303 92 L293 92 M303 92 L293 108" stroke-width="0.6"/>
  <text x="233" y="150" fill="currentColor" stroke="none">Anaphase</text>
  <path d="M370 48 C 330 48, 328 132, 370 132 C 412 132, 410 48, 370 48 Z"/>
  <line x1="370" y1="48" x2="370" y2="62"/>
  <line x1="370" y1="118" x2="370" y2="132"/>
  <circle cx="352" cy="90" r="11" stroke-dasharray="3 2"/>
  <circle cx="388" cy="90" r="11" stroke-dasharray="3 2"/>
  <text x="337" y="150" fill="currentColor" stroke="none">Telophase</text>
  <text x="20" y="185" fill="currentColor" stroke="none" font-size="11">Chromosomes condense → line up at equator → chromatids pulled to poles → two nuclei form</text>
</svg>

| Stage | Key events | One-line exam tag |
|---|---|---|
| **Prophase** | Chromatin condenses into chromosomes; nucleolus and nuclear envelope begin to disappear; spindle starts forming | Longest stage of mitosis |
| **Metaphase** | Chromosomes line up at the **equator (metaphase plate)**; spindle fibres attach at **kinetochores** | **Best stage to count and study chromosome shape (karyotype)** |
| **Anaphase** | Centromeres split; **sister chromatids separate** and move to opposite poles | Shortest stage |
| **Telophase** | Chromosomes reach poles and uncoil; nuclear envelope and nucleolus reappear | Reverse of prophase |
| **Cytokinesis** | Animal: cleavage furrow from outside inward. Plant: **cell plate** from centre outward (forms middle lamella) | Plant cell has a wall, so it cannot furrow |

- **Colchicine** (from *Colchicum autumnale*) stops spindle formation and arrests cells at metaphase → used to make **polyploids**.
- When karyokinesis is not followed by cytokinesis → multinucleate cell (**syncytium**), e.g. liquid endosperm of coconut.
- Significance: growth, repair, replacement of cells (skin, gut lining), asexual reproduction; keeps chromosome number constant.

> **Memory trick:** "**P**lease **M**ake **A** **T**ea" — Prophase, Metaphase, Anaphase, Telophase.

## 4. Meiosis (reduction division)

Term by Farmer and Moore (1905). Occurs in **reproductive cells** (meiocytes) — in anther and ovule of plants, testis and ovary of animals. One diploid cell → **four haploid cells** (2n → n), all genetically different. Two divisions: **meiosis I** (reductional — homologous chromosomes separate) and **meiosis II** (equational — like mitosis, sister chromatids separate). DNA replicates only once, before meiosis I.

### Prophase I — five sub-stages (most asked)

| Sub-stage | Key event | Memory |
|---|---|---|
| **Leptotene** | Chromosomes become visible as thin threads | "Lepto = thin" |
| **Zygotene** | **Synapsis** — homologous chromosomes pair; **synaptonemal complex** forms; pair = **bivalent** (tetrad) | "Zygo = yoked" |
| **Pachytene** | **Crossing over** between non-sister chromatids; enzyme **recombinase**; recombination nodules appear | "Pachy = thick" |
| **Diplotene** | Synaptonemal complex dissolves; X-shaped **chiasmata** become visible | Can last months/years in oocytes |
| **Diakinesis** | **Terminalisation** of chiasmata; nucleolus and nuclear envelope disappear; spindle forms | Transition to metaphase I |

> **Memory trick:** "**L**azy **Z**ebras **P**lay **D**ice **D**aily" — Leptotene, Zygotene, Pachytene, Diplotene, Diakinesis.

Then: Metaphase I (bivalents line up at equator), **Anaphase I (homologous chromosomes separate; sister chromatids stay joined at centromere)**, Telophase I → **interkinesis** (short; **no DNA replication**) → Meiosis II (like mitosis).

### Mitosis vs meiosis

| Point | Mitosis | Meiosis |
|---|---|---|
| Cells | Somatic | Reproductive (germ) |
| Divisions | One | Two |
| Daughter cells | 2, diploid, identical | 4, haploid, different |
| Synapsis / crossing over | No | Yes (prophase I) |
| Anaphase separates | Sister chromatids | Homologues (I), chromatids (II) |
| Purpose | Growth, repair | Gametes, variation, constant number across generations |

## 5. Mendel and the laws of inheritance

- **Gregor Johann Mendel** (1822–1884), Austrian monk, worked on garden pea (*Pisum sativum*) for 7 years (1856–1863), published 1865 (printed 1866) in *Experiments on Plant Hybridisation*. Ignored until **1900**, when it was rediscovered independently by **Hugo de Vries, Carl Correns and Erich von Tschermak**. **Father of genetics.**
- Term "gene" — Johannsen (1909); "genetics" — William Bateson (1905).
- Why pea worked: short life cycle, many seeds, clear contrasting characters, natural **self-pollination** (bisexual flowers) and easy artificial cross-pollination.
- He studied **7 pairs of contrasting characters**:

| Character | Dominant | Recessive |
|---|---|---|
| Stem height | Tall | Dwarf |
| Flower colour | Violet | White |
| Flower position | Axial | Terminal |
| Pod shape | Inflated (full) | Constricted |
| Pod colour | Green | Yellow |
| Seed shape | Round | Wrinkled |
| Seed colour | Yellow | Green |

(Note the reversal: pod colour green is dominant, but seed colour **yellow** is dominant.)

- **Mendel's principle of inheritance is based on sexual reproduction** — crossing of gametes from two parents.

> **PYQ:** TRE 1.0 (2023) asked: "Mendel's principle of inheritance is based on (A) vegetative reproduction (B) asexual reproduction (C) sexual reproduction …". Answer: **(C) sexual reproduction**.

### Key terms

| Term | Meaning |
|---|---|
| Allele | Alternative forms of a gene (T and t) |
| Homozygous | Same alleles (TT or tt) — pure line |
| Heterozygous | Different alleles (Tt) — hybrid |
| Genotype | Genetic make-up (TT, Tt, tt) |
| Phenotype | Visible character (tall, dwarf) |
| Dominant | Expressed in heterozygote |
| Recessive | Hidden in heterozygote, shows only in homozygote |
| F₁, F₂ | First and second filial generations |

### Monohybrid cross

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <text x="10" y="30" fill="currentColor" stroke="none">P: TT (tall) × tt (dwarf)</text>
  <text x="10" y="55" fill="currentColor" stroke="none">F₁: all Tt (tall)</text>
  <text x="10" y="80" fill="currentColor" stroke="none">Self F₁: Tt × Tt</text>
  <text x="10" y="120" fill="currentColor" stroke="none">F₂ phenotype</text>
  <text x="10" y="138" fill="currentColor" stroke="none">3 tall : 1 dwarf</text>
  <text x="10" y="165" fill="currentColor" stroke="none">F₂ genotype</text>
  <text x="10" y="183" fill="currentColor" stroke="none">1 TT : 2 Tt : 1 tt</text>
  <rect x="240" y="40" width="160" height="140"/>
  <line x1="320" y1="40" x2="320" y2="180"/>
  <line x1="240" y1="110" x2="400" y2="110"/>
  <text x="275" y="32" fill="currentColor" stroke="none">T</text>
  <text x="356" y="32" fill="currentColor" stroke="none">t</text>
  <text x="222" y="80" fill="currentColor" stroke="none">T</text>
  <text x="224" y="150" fill="currentColor" stroke="none">t</text>
  <text x="268" y="80" fill="currentColor" stroke="none">TT</text>
  <text x="350" y="80" fill="currentColor" stroke="none">Tt</text>
  <text x="268" y="150" fill="currentColor" stroke="none">Tt</text>
  <text x="350" y="150" fill="currentColor" stroke="none">tt</text>
  <text x="246" y="196" fill="currentColor" stroke="none" font-size="10">Punnett square (R. C. Punnett)</text>
</svg>

### Mendel's laws

1. **Law of dominance** — in a heterozygote, one allele (dominant) masks the other (recessive). Explains why F₁ is all tall.
2. **Law of segregation** (purity of gametes) — the two alleles separate during gamete formation; each gamete gets only one. **Universal law** — no exception. Explains reappearance of dwarf in F₂.
3. **Law of independent assortment** — from a **dihybrid cross**: alleles of different genes assort independently. True only for genes on **different chromosomes** (or far apart); linkage is the exception.

### Ratios to memorise

<div class="formula">

| Cross | Phenotypic ratio | Genotypic ratio |
|---|---|---|
| Monohybrid F₂ (Tt × Tt) | **3 : 1** | **1 : 2 : 1** |
| Dihybrid F₂ (RrYy × RrYy) | **9 : 3 : 3 : 1** | 1:2:1:2:4:2:1:2:1 (9 genotypes) |
| Monohybrid test cross (Tt × tt) | **1 : 1** | 1 : 1 |
| Dihybrid test cross (RrYy × rryy) | **1 : 1 : 1 : 1** | 1 : 1 : 1 : 1 |
| Incomplete dominance F₂ | **1 : 2 : 1** | 1 : 2 : 1 (same) |
| Back cross with dominant parent (Tt × TT) | all dominant | 1 TT : 1 Tt |

</div>

**Test cross**: crossing an organism of dominant phenotype with the **homozygous recessive** to find out whether it is TT or Tt.

**Worked example 1.** In peas, round (R) is dominant to wrinkled (r). A round plant crossed with a wrinkled plant gives 52 round and 48 wrinkled. Genotype of the round parent?
Ratio ≈ 1 : 1 → this is a test-cross result → the round parent was **Rr (heterozygous)**.

**Worked example 2.** In a dihybrid F₂ of 1600 plants, how many will be double recessive?
Double recessive = 1/16 of the total → 1600 ÷ 16 = **100 plants**.

**Worked example 3.** How many kinds of gametes does AaBbCc form (independent assortment)?
2ⁿ with n = 3 heterozygous pairs → 2³ = **8 kinds**. (Number of F₂ phenotypes = 2ⁿ = 8; genotypes = 3ⁿ = 27.)

## 6. Deviations from Mendel (post-Mendelian genetics)

| Phenomenon | What happens | Classic example | F₂ ratio |
|---|---|---|---|
| **Incomplete dominance** | Heterozygote is intermediate | Flower colour in **snapdragon (*Antirrhinum majus*)**; also *Mirabilis jalapa* (four o'clock): red × white → pink | **1 : 2 : 1** |
| **Codominance** | Both alleles fully expressed | **ABO blood group**: Iᴬ and Iᴮ together give AB; also roan coat in cattle | 1 : 2 : 1 |
| **Multiple alleles** | More than two alleles of a gene in a population (an individual still carries two) | ABO gene has 3 alleles (Iᴬ, Iᴮ, i) → 6 genotypes, 4 phenotypes | — |
| **Pleiotropy** | One gene affects many traits | **Phenylketonuria**; sickle-cell anaemia; starch grain size and seed shape in pea | — |
| **Polygenic inheritance** | Many genes add up to one trait; continuous variation | **Human skin colour**, height, wheat kernel colour | Bell curve |
| **Epistasis** | One gene masks another non-allelic gene | Coat colour in dogs; fruit colour in summer squash (12:3:1) | 12:3:1, 9:7, 9:3:4 |
| **Linkage** | Genes on the same chromosome inherited together | **T. H. Morgan** with *Drosophila* (white eye, yellow body) — term linkage by Morgan | Parental types > 50% |
| **Lethal genes** | Homozygous dominant dies | Yellow coat in mice | 2 : 1 |

- **Recombination frequency** (%) = (recombinants ÷ total) × 100. Alfred Sturtevant used it to make the first **genetic map** (1 map unit = 1% recombination = 1 centimorgan).
- **Sutton and Boveri (1902)** — chromosomal theory of inheritance (genes lie on chromosomes); Morgan proved it experimentally.
- Morgan got the Nobel Prize (1933); *Drosophila* is ideal: short life cycle (~2 weeks), many offspring, easy to grow, visible mutations, 2n = 8.

**Worked example 4 (blood groups).** Mother group A (genotype Iᴬi), father group B (Iᴮi). Possible blood groups of children?
Gametes: mother Iᴬ or i; father Iᴮ or i → IᴬIᴮ (AB), Iᴬi (A), Iᴮi (B), ii (O) → **all four groups possible, 1 : 1 : 1 : 1**.

## 7. Sex determination

| System | Female | Male | Example |
|---|---|---|---|
| **XX–XY** | XX (homogametic) | XY (heterogametic) | **Humans**, Drosophila |
| **XX–XO** | XX | XO (one less chromosome) | **Grasshopper**, many insects |
| **ZW–ZZ** | **ZW (female is heterogametic)** | ZZ | **Birds**, some reptiles, butterflies |
| Haplodiploidy | Diploid (fertilised egg) | **Haploid (unfertilised egg, by parthenogenesis)** | **Honeybee**, ants, wasps |
| Temperature-dependent | — | — | Turtles, crocodiles |

- In humans, sex of the child is decided by the **father's sperm** (X or Y). Chance of a boy in each birth = 50%.
- Henking (1891) saw the "X body" in insects.

## 8. Genetic disorders

### Mendelian (single-gene) disorders

| Disorder | Inheritance | Key fact |
|---|---|---|
| **Haemophilia** (bleeder's disease) | **X-linked recessive** | Blood does not clot; Queen Victoria's family; mostly males affected, females carriers |
| **Colour blindness** (red–green) | **X-linked recessive** | About 8% of males, 0.4% of females |
| **Sickle-cell anaemia** | **Autosomal recessive** | **Glutamic acid → valine at the 6th position of β-globin**; GAG → GUG; RBCs become sickle-shaped at low O₂; carriers resist malaria |
| **Phenylketonuria (PKU)** | **Autosomal recessive** | Lack of phenylalanine hydroxylase → phenylalanine and phenylpyruvic acid build up → mental retardation |
| Thalassaemia | Autosomal recessive | Reduced synthesis of α or β globin chain (quantitative defect; sickle cell is qualitative) |
| Cystic fibrosis | Autosomal recessive | — |
| Huntington's disease | Autosomal dominant | — |
| Myotonic dystrophy | Autosomal dominant | — |

> **PYQ:** TRE 2.0 (2023) asked: "Which one of the following is a hereditary disease? (A) Cataract (B) Leprosy (C) Phenylketonuria …". Official answer: **(C) Phenylketonuria**. Leprosy is bacterial (*Mycobacterium leprae*); cataract is usually age-related.

### Chromosomal disorders (aneuploidy — gain or loss of a chromosome, from non-disjunction)

| Syndrome | Karyotype | Total number | Features |
|---|---|---|---|
| **Down syndrome** | **Trisomy 21** | **47** | Short, round face, furrowed tongue, partly open mouth, palm crease, mental retardation; first described by Langdon Down (1866); risk rises with mother's age |
| **Klinefelter syndrome** | **47, XXY** | 47 | Male, tall, sterile, gynaecomastia (breast development) |
| **Turner syndrome** | **45, XO** | 45 | Female, sterile (rudimentary ovaries), short, webbed neck, no secondary sex characters |
| Patau syndrome | Trisomy 13 | 47 | Severe defects |
| Edwards syndrome | Trisomy 18 | 47 | Severe defects |

- **Polyploidy** (whole extra sets, e.g. 3n, 4n) is common in plants (bread wheat 6n) but lethal in humans.
- **Monosomy** = 2n − 1 (Turner); **trisomy** = 2n + 1 (Down, Klinefelter); **nullisomy** = 2n − 2.

## 9. DNA — the genetic material

### Proof that DNA is the genetic material

| Experiment | Scientist(s) | Year | Finding |
|---|---|---|---|
| Transforming principle | **Frederick Griffith** | 1928 | Heat-killed S (virulent) + live R strain of *Streptococcus pneumoniae* killed mice — something transformed R into S |
| Biochemical nature of the transforming principle | **Avery, MacLeod and McCarty** | 1944 | It is **DNA** (DNase destroyed it; protease and RNase did not) |
| Unequivocal proof | **Hershey and Chase** | 1952 | T2 bacteriophage: **³²P (DNA)** entered bacteria, **³⁵S (protein)** stayed outside |
| DNA isolated ("nuclein") | Friedrich Miescher | 1869 | First isolated from pus cells |
| X-ray pictures of DNA | Rosalind Franklin and Maurice Wilkins | 1951–52 | Helical pattern |
| Double helix model | **James Watson and Francis Crick** | **1953** | Nobel 1962 (with Wilkins) |
| Base-pairing rule | **Erwin Chargaff** | 1950 | A = T, G = C; (A+G) = (T+C) |
| Semi-conservative replication | **Meselson and Stahl** | 1958 | ¹⁵N/¹⁴N in *E. coli*, CsCl density gradient |

- In some viruses (TMV, HIV, influenza, polio, QB phage) the genetic material is **RNA**.
- RNA was probably the first genetic material (**RNA world**); DNA is more stable (double-stranded, no 2′-OH, has thymine instead of uracil).

### Watson–Crick B-DNA model

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <path d="M20 100 C 53 47, 87 47, 120 100 S 187 153, 220 100 S 287 47, 320 100" stroke-width="2.5"/>
  <path d="M20 100 C 53 153, 87 153, 120 100 S 187 47, 220 100 S 287 153, 320 100" stroke-width="2.5"/>
  <g stroke-width="1">
    <line x1="45" y1="72" x2="45" y2="128"/>
    <line x1="70" y1="61" x2="70" y2="139"/>
    <line x1="95" y1="72" x2="95" y2="128"/>
    <line x1="145" y1="72" x2="145" y2="128"/>
    <line x1="170" y1="61" x2="170" y2="139"/>
    <line x1="195" y1="72" x2="195" y2="128"/>
    <line x1="245" y1="72" x2="245" y2="128"/>
    <line x1="270" y1="61" x2="270" y2="139"/>
    <line x1="295" y1="72" x2="295" y2="128"/>
  </g>
  <text x="73" y="96" fill="currentColor" stroke="none" font-size="9">A=T</text>
  <text x="173" y="96" fill="currentColor" stroke="none" font-size="9">G≡C</text>
  <text x="273" y="96" fill="currentColor" stroke="none" font-size="9">T=A</text>
  <line x1="345" y1="60" x2="345" y2="140" stroke-width="1"/>
  <line x1="340" y1="60" x2="350" y2="60" stroke-width="1"/>
  <line x1="340" y1="140" x2="350" y2="140" stroke-width="1"/>
  <text x="354" y="96" fill="currentColor" stroke="none">2 nm</text>
  <text x="354" y="112" fill="currentColor" stroke="none" font-size="10">diameter</text>
  <line x1="20" y1="170" x2="220" y2="170" stroke-width="1"/>
  <line x1="20" y1="165" x2="20" y2="175" stroke-width="1"/>
  <line x1="220" y1="165" x2="220" y2="175" stroke-width="1"/>
  <text x="40" y="190" fill="currentColor" stroke="none">one turn = 3.4 nm = 10 base pairs</text>
  <text x="20" y="22" fill="currentColor" stroke="none" font-size="11">Two antiparallel strands (5′→3′ and 3′→5′), sugar-phosphate backbone outside, bases inside</text>
</svg>

- **Double helix**, right-handed, two **antiparallel** polynucleotide strands (one 5′→3′, the other 3′→5′).
- Backbone = sugar + phosphate; bases inside, paired by **hydrogen bonds**: **A = T (2 H-bonds)**, **G ≡ C (3 H-bonds)**. So DNA rich in G–C is more stable (higher melting temperature).
- Purine always pairs with pyrimidine → uniform width **2 nm (20 Å)**.
- **Pitch 3.4 nm** per turn, **10 bp per turn**, distance between adjacent base pairs **0.34 nm**.
- Length of DNA = number of bp × 0.34 nm. Human diploid cell has about **6.6 × 10⁹ bp** → about **2.2 m** of DNA.
- Other forms: A-DNA (right-handed, 11 bp/turn), **Z-DNA (left-handed, 12 bp/turn, zig-zag)**.

**Worked example 5.** A DNA molecule has 20% adenine. Find % of G, C and T.
A = T = 20% → A + T = 40% → G + C = 60% → **G = C = 30%, T = 20%**.

**Worked example 6.** Length of *E. coli* DNA with 4.6 × 10⁶ bp?
4.6 × 10⁶ × 0.34 × 10⁻⁹ m = 1.564 × 10⁻³ m ≈ **1.56 mm** (about 1.36 mm is also quoted for 4 × 10⁶ bp).

**Packaging in eukaryotes:** DNA (negative) wraps around a **histone octamer** (positive; histones rich in **lysine and arginine** — basic amino acids) → **nucleosome** (about 200 bp; "beads on a string"); H1 histone links them. Repeating nucleosomes → chromatin fibre → chromosome. Prokaryotes have non-histone basic proteins (**polyamines**) holding the DNA in the nucleoid.

### DNA vs RNA

| Point | DNA | RNA |
|---|---|---|
| Sugar | Deoxyribose | Ribose (has 2′-OH, more reactive) |
| Bases | A, G, C, **T** | A, G, C, **U** |
| Strands | Usually double | Usually single |
| Location | Nucleus (+ mitochondria, chloroplast) | Nucleus and cytoplasm |
| Function | Stores genetic information | Protein synthesis (also genetic material in some viruses; catalyst as ribozyme) |

**Three main RNAs:**
- **mRNA** (messenger) — carries the code; about 5% of cell RNA.
- **tRNA** (transfer, also called soluble RNA / **adaptor molecule**) — brings amino acids; **clover-leaf** shape in 2-D, **inverted L** in 3-D; has the **anticodon loop** and the amino-acid acceptor end (**CCA** at 3′ end). Smallest RNA, about 75–80 nucleotides.
- **rRNA** (ribosomal) — most abundant RNA (about 80%); structural and catalytic (23S rRNA in bacteria is the peptidyl transferase ribozyme).

## 10. Replication

- **Semi-conservative**: each new DNA has one old and one new strand (Meselson–Stahl, 1958). First proposed by Watson and Crick.
- Occurs in **S phase**. Starts at the **origin of replication (ori)**; opens as a **replication fork**.
- Enzymes in order: **helicase** (unwinds, breaks H-bonds) → single-strand binding proteins → **topoisomerase / DNA gyrase** (relieves supercoiling) → **primase** (makes short **RNA primer**) → **DNA polymerase** (adds nucleotides; main enzyme in *E. coli* = **DNA polymerase III**) → DNA polymerase I (removes primer, fills gap) → **DNA ligase** (joins pieces; "molecular glue").
- DNA polymerase works only **5′ → 3′** and needs a primer. So:
  - **Leading strand** — made continuously.
  - **Lagging strand** — made discontinuously as short **Okazaki fragments** (Reiji Okazaki, 1968), later joined by ligase.
- Energy source and substrate: **deoxyribonucleoside triphosphates (dNTPs)** — they serve both purposes.
- Speed in *E. coli*: about 2000 bp per second; whole genome (4.6 × 10⁶ bp) in about 18 minutes (some sources say 38 minutes).

## 11. Central dogma, transcription and translation

**Central dogma** (Francis Crick, 1958): DNA → (transcription) → RNA → (translation) → Protein. Replication: DNA → DNA.
**Reverse transcription** (RNA → DNA) by **reverse transcriptase** — Temin and Baltimore (1970), found in **retroviruses** like HIV. It is the exception to the dogma.

### Transcription (DNA → RNA)

- Only one strand is used as template: the **template (antisense) strand**, read 3′→5′. The other strand, the **coding (sense) strand**, has the same sequence as the RNA (with T in place of U) and is the one written by convention.
- **Transcription unit**: **promoter** (upstream, binding site of RNA polymerase; TATA box in eukaryotes) → structural gene → **terminator**.
- Bacteria: one **RNA polymerase**; the **sigma (σ) factor** helps initiation, the **rho (ρ) factor** helps termination.
- Eukaryotes: three RNA polymerases in the nucleus:

| Enzyme | Makes |
|---|---|
| RNA polymerase I | rRNAs — 28S, 18S, 5.8S |
| **RNA polymerase II** | **hnRNA** (precursor of mRNA) |
| RNA polymerase III | tRNA, **5S rRNA**, snRNA |

- Eukaryotic genes are **split genes**: coding **exons** interrupted by non-coding **introns** (Sharp and Roberts, 1977). hnRNA is processed:
  - **Splicing** — introns removed, exons joined (by spliceosome).
  - **Capping** — methyl guanosine triphosphate added at the **5′ end**.
  - **Tailing** — **poly-A tail** (200–300 adenylates) at the **3′ end**.
- In bacteria, transcription and translation can happen together (no nucleus) and mRNA needs no processing.

### The genetic code

| Property | Meaning |
|---|---|
| **Triplet** | Three bases = one codon (proposed by George Gamow; 4³ = **64 codons**) |
| Sense codons | **61** code for amino acids |
| **Stop (nonsense) codons** | **3: UAA (ochre), UAG (amber), UGA (opal)** |
| **Start codon** | **AUG** — codes for **methionine** (formyl-methionine in bacteria); rarely GUG |
| **Degenerate** | Some amino acids have more than one codon (leucine, serine, arginine have 6 each) |
| Unambiguous and specific | One codon → only one amino acid |
| Nearly universal | Same in almost all organisms (exceptions: mitochondria, some protozoa — e.g. UGA codes tryptophan in mitochondria) |
| Commaless, non-overlapping | Read continuously, three at a time |
| Wobble | Third base of codon is less specific (Crick's wobble hypothesis) |

- Amino acids with **only one codon**: **methionine (AUG) and tryptophan (UGG)**.
- First codon deciphered: **UUU = phenylalanine** — **Nirenberg and Matthaei (1961)** with poly-U. **Har Gobind Khorana** synthesised RNA with repeating sequences. **Nobel 1968**: Holley (tRNA structure), Khorana, Nirenberg.

**Worked example 7.** A coding strand reads 5′-ATG GCA TTT TAA-3′. Write the mRNA and protein.
mRNA = same as coding strand with U: 5′-AUG GCA UUU UAA-3′ → **Met – Ala – Phe – stop** (3 amino acids).

**Worked example 8.** How many amino acids does an mRNA of 300 nucleotides (including start and one stop codon) code?
300 ÷ 3 = 100 codons; minus 1 stop codon → **99 amino acids**.

### Translation (RNA → protein)

1. **Charging of tRNA (aminoacylation)**: amino acid + ATP + tRNA, enzyme **aminoacyl-tRNA synthetase** (one for each amino acid).
2. **Initiation**: small ribosomal subunit binds mRNA at AUG; initiator tRNA (Met) pairs; large subunit joins. Ribosome has sites: **A (aminoacyl)**, **P (peptidyl)**, E (exit).
3. **Elongation**: peptide bond formed by **peptidyl transferase** (a **ribozyme**, 23S rRNA in bacteria); ribosome moves one codon (translocation) 5′→3′ along mRNA.
4. **Termination**: stop codon reached; **release factor** frees the polypeptide.

- mRNA has **untranslated regions (UTRs)** before the start codon and after the stop codon — needed for efficient translation.
- **Polysome (polyribosome)**: many ribosomes translating one mRNA at the same time (like beads on a thread) — makes many copies of the protein quickly. It is the **functional unit of protein synthesis**.

## 12. Gene regulation — the lac operon

- **François Jacob and Jacques Monod (1961)**, in *E. coli*. Nobel 1965. Operon = a group of genes controlled together.
- **lac operon** (lactose operon) parts:

| Part | Role |
|---|---|
| **i** (regulator gene) | Makes the **repressor protein** (constitutive; has its own promoter; not strictly part of the operon) |
| **p** (promoter) | RNA polymerase binds |
| **o** (operator) | Repressor binds here and blocks transcription |
| **z** | **β-galactosidase** — splits lactose into glucose + galactose |
| **y** | **Permease** — lets lactose into the cell |
| **a** | **Transacetylase** |

- **No lactose**: repressor sits on the operator → genes OFF.
- **Lactose present**: lactose (actually its isomer **allolactose**) acts as **inducer**, binds the repressor and inactivates it → RNA polymerase transcribes z, y, a → genes ON.
- So the lac operon is an **inducible operon** under **negative control** (it also has positive control by CAP–cAMP when glucose is low). The **trp operon** is a **repressible** operon — tryptophan (the end product) switches it off.
- Glucose present + lactose present → bacteria prefer glucose; operon stays low (catabolite repression).

## 13. Human Genome Project and DNA fingerprinting (short)

- **HGP**: 1990–2003, coordinated by US DOE and NIH. Human genome ≈ **3164.7 million bp** (about 3 × 10⁹). Number of genes ≈ **20,000–25,000** (NCERT says about 30,000; later estimates are lower). Less than 2% of the genome codes for proteins. **Chromosome 1** has the most genes (2968); **Y** the fewest (231). About 1.4 million **SNPs** (single nucleotide polymorphisms).
- Methods: **ESTs** (expressed sequence tags) and **sequence annotation**; BAC and YAC vectors; automated sequencers (Sanger method).
- **DNA fingerprinting**: **Alec Jeffreys** (1985); uses **VNTRs** (variable number tandem repeats, minisatellites) found in **satellite DNA**; steps — isolation, restriction digestion, gel electrophoresis, **Southern blotting**, hybridisation with VNTR probe, autoradiography. In India, **Lalji Singh** at CCMB Hyderabad ("father of Indian DNA fingerprinting").
- **Junk DNA / repetitive DNA** exists in large amounts.

## Traps and exceptions

- **Chromosome number does not double in S phase** — only DNA content doubles (2C → 4C).
- **Best stage to count chromosomes = metaphase**; crossing over = **pachytene**; synapsis = zygotene; chiasmata seen in diplotene; terminalisation = diakinesis.
- Anaphase I separates **homologues**; anaphase II and mitotic anaphase separate **sister chromatids**.
- **No DNA replication in interkinesis.**
- **Law of segregation has no exception**; independent assortment fails with linkage. Mendel did not know about chromosomes or genes.
- Incomplete dominance F₂ is **1:2:1 for both phenotype and genotype** — snapdragon, not pea.
- **ABO is codominance and multiple alleles** at once; O is recessive (ii).
- **Birds: female is ZW** (heterogametic) — opposite of humans.
- **Honeybee drones are haploid** (from unfertilised eggs).
- **Haemophilia and colour blindness are X-linked**; sickle cell, PKU and thalassaemia are **autosomal**.
- **Down = trisomy 21 (47)**; **Turner = 45, XO** (female); **Klinefelter = 47, XXY** (male).
- **A=T has 2 hydrogen bonds; G≡C has 3.**
- **mRNA sequence = coding strand** (T → U), not the template strand.
- **AUG is the start codon and also codes methionine**; stop codons code nothing. Total 64, sense 61.
- **Okazaki fragments are on the lagging strand.**
- Lac operon inducer is **lactose/allolactose**; the repressor is made by gene **i**, not z.
- **Polysome ≠ peroxisome ≠ lysosome.**

## Quick revision

1. Human 2n = 46; chimpanzee 48; Drosophila 8; pea 14; onion 16.
2. S phase = DNA replication; G₀ = non-dividing (heart muscle, neurons).
3. Metaphase — chromosomes on equator — best for karyotype.
4. Colchicine stops spindle formation → polyploidy.
5. Plant cytokinesis by cell plate; animal by furrow.
6. Prophase I: leptotene, zygotene (synapsis), pachytene (crossing over, recombinase), diplotene (chiasmata), diakinesis.
7. Mendel: pea, 7 characters, rediscovered 1900 by de Vries, Correns, Tschermak.
8. Monohybrid 3:1 and 1:2:1; dihybrid 9:3:3:1; test cross 1:1 and 1:1:1:1.
9. Incomplete dominance: snapdragon / Mirabilis — 1:2:1.
10. Codominance and multiple alleles: ABO blood group.
11. Linkage: T. H. Morgan, Drosophila; first genetic map: Sturtevant.
12. ZW female in birds; XO male in grasshopper; haploid male honeybee.
13. Sickle cell: Glu → Val at 6th position of β-globin.
14. PKU — autosomal recessive, hereditary disease.
15. Griffith 1928 transformation; Avery 1944 DNA; Hershey–Chase 1952 ³²P/³⁵S.
16. Watson–Crick 1953; 2 nm wide; 3.4 nm pitch; 10 bp per turn; 0.34 nm per bp.
17. Meselson–Stahl 1958 — semi-conservative replication with ¹⁵N.
18. Okazaki fragments on lagging strand; joined by DNA ligase.
19. Reverse transcriptase — Temin and Baltimore — retroviruses.
20. 64 codons, 61 sense, 3 stop (UAA, UAG, UGA), AUG start = methionine.
21. UUU = phenylalanine (Nirenberg and Matthaei, 1961).
22. tRNA = adaptor; clover leaf; anticodon; CCA end.
23. Polysome = functional unit of protein synthesis.
24. Lac operon: Jacob and Monod; z, y, a genes; inducible; repressor from i gene.
25. DNA fingerprinting: Alec Jeffreys; VNTR; India — Lalji Singh, CCMB.

## Practice with answers

1. During which phase does DNA content double? — **S phase** (chromosome number stays 2n).
2. Crossing over takes place in? — **Pachytene** of prophase I.
3. Which drug arrests cells at metaphase? — **Colchicine** (blocks spindle).
4. Number of cells and ploidy after meiosis of one 2n cell? — **Four haploid cells**.
5. F₂ phenotypic ratio of a dihybrid cross? — **9 : 3 : 3 : 1**.
6. Cross of Tt with tt is called? — **Test cross** (ratio 1 : 1).
7. Pink flowers in F₁ of red × white snapdragon show? — **Incomplete dominance**.
8. Child with group O born to A and B parents — genotypes of parents? — **Iᴬi and Iᴮi** (both heterozygous).
9. Who discovered linkage? — **T. H. Morgan** (Drosophila).
10. Sex chromosomes of a hen? — **ZW** (female heterogametic).
11. Karyotype of Turner syndrome? — **45, XO**.
12. Amino-acid change in sickle-cell anaemia? — **Glutamic acid → valine at position 6 of β-chain**.
13. How many hydrogen bonds join G and C? — **Three**.
14. If a DNA has 35% cytosine, what is % adenine? — **15%** (G = C = 35%, A + T = 30%).
15. Which isotope labelled the DNA in Hershey–Chase? — **³²P** (protein had ³⁵S).
16. Enzyme that joins Okazaki fragments? — **DNA ligase**.
17. Which RNA polymerase makes hnRNA? — **RNA polymerase II**.
18. Two amino acids with only one codon each? — **Methionine (AUG) and tryptophan (UGG)**.
19. Enzyme forming peptide bonds? — **Peptidyl transferase** (a ribozyme).
20. Inducer of the lac operon? — **Lactose (allolactose)**.

See also: [Cell structure and biomolecules](/interview/bpsc-tre4-science/biology/cell-structure-and-biomolecules) · [Evolution and origin of life](/interview/bpsc-tre4-science/biology/evolution-and-origin-of-life) · [Biotechnology and applied biology](/interview/bpsc-tre4-science/biology/biotechnology-and-applied-biology)
