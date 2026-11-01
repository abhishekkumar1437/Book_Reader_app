---
title: Mendel's Laws, Types of Dominance and Gene Interaction
part: Genetics
summary: Mendel's life and experiments, actual data for the seven traits, monohybrid-dihybrid-trihybrid crosses, test and back crosses, laws of probability, chi-square test, incomplete dominance, co-dominance, multiple alleles (ABO), lethal genes, pleiotropy, all gene-interaction ratios (9:7, 9:3:4, 12:3:1, 15:1, 13:3, 9:6:1) with their test crosses, polygenic inheritance and the chromosomal theory of inheritance — every ratio worked out.
---

This chapter takes the first part of Unit 9 "Advanced Genetics" — **Mendel's laws, co-dominance, incomplete dominance, gene interaction, chromosomal theory and polygenic inheritance** — from NCERT 12 ("Principles of Inheritance and Variation") up to B.Sc. level. The 2026 paper had no ratio calculation, but it did have an **interpretation of a chi-square result**; in the new pattern (90 questions) 1–2 ratio/probability questions are natural to expect, so every ratio is worked out here.

> **In simple words:** Every trait is decided by two "forms" of a gene (alleles) — one from the mother, one from the father. When gametes form, these two separate (segregation). Genes for different traits usually get distributed independently of each other (independent assortment). Sometimes the two forms together give an in-between form (incomplete dominance), sometimes both show (co-dominance), and sometimes one gene masks the effect of another gene (epistasis) — this changes ratios like 9:3:3:1.

## 1. Gregor Johann Mendel — "Father of Genetics"

| Fact | Details |
|---|---|
| Born | **20 July 1822** (baptised 22 July), Heinzendorf, Silesia (now Czech Republic) |
| Workplace | Augustinian monastery, **Brünn (now Brno)** |
| Experiments | **1856–1863**, garden pea ***Pisum sativum*** |
| Presentation / publication | Brünn Natural History Society in **1865**; published **1866** — "*Experiments on Plant Hybridization*" |
| Died | **6 January 1884** — work ignored during his lifetime |
| Rediscovery | **1900** — **Hugo de Vries** (Holland), **Carl Correns** (Germany), **Erich von Tschermak** (Austria) |
| Later failed experiment | *Hieracium* (hawkweed) — results did not match because of apomixis |

**Terminology:** "Genetics" — **William Bateson (1905)**; "Gene" — **Wilhelm Johannsen (1909)** (also genotype, phenotype); "allelomorph" — Bateson. Mendel used the word "**factor**".

**Why pea was chosen:** self-pollination gives **true-breeding lines**; artificial cross-pollination possible (**emasculation**); clear **contrasting traits**; short life cycle, many seeds. Mendel's success — one or two traits at a time, counting large numbers, **statistics**, confirmation by test and back crosses; and luck — the traits he chose showed no strong linkage.

### Seven contrasting traits and Mendel's F₂ data

| Trait | Dominant | Recessive | F₂ numbers | Ratio |
|---|---|---|---|---|
| Seed shape | Round | Wrinkled | 5474 : 1850 | 2.96 : 1 |
| Seed colour (cotyledon) | Yellow | Green | 6022 : 2001 | 3.01 : 1 |
| Flower colour | Violet | White | 705 : 224 | 3.15 : 1 |
| Pod shape | Inflated | Constricted | 882 : 299 | 2.95 : 1 |
| Pod colour | Green | Yellow | 428 : 152 | 2.82 : 1 |
| Flower position | Axial | Terminal | 651 : 207 | 3.14 : 1 |
| Stem height | Tall | Dwarf | 787 : 277 | 2.84 : 1 |

> **Memory trick:** Among recessive traits, only **in pod colour is "yellow" recessive**, whereas **in seed colour yellow is dominant** — this is the most common trap. In flower position, **axial is dominant**.

## 2. Mendel's laws

1. **Law of dominance** — in a heterozygote one factor (dominant) does not let the other (recessive) express. (It is not universal — incomplete/co-dominance are exceptions; so many books call it a "principle", not a "law".)
2. **Law of segregation — "law of purity of gametes"** — alleles do not blend with each other; they separate during gamete formation, each gamete getting only one. A **universal** law. Cellular basis — separation of homologous chromosomes in **anaphase I**.
3. **Law of independent assortment** — the pairs of two or more traits are distributed independently of each other. Basis — random orientation of bivalents in **metaphase I**. **Exception — linked genes** (next chapter).

### 2.1 Monohybrid cross

Tall (TT) × dwarf (tt) → F₁ all **Tt** (tall) → F₁ selfed (Tt × Tt):

| | **T** | **t** |
|---|---|---|
| **T** | TT (tall) | Tt (tall) |
| **t** | Tt (tall) | tt (dwarf) |

- **Phenotypic ratio 3 : 1**; **genotypic ratio 1 TT : 2 Tt : 1 tt**.
- Among F₂ tall plants, **1/3 homozygous (TT), 2/3 heterozygous (Tt)** — Mendel found exactly this in F₃.
- **Test cross** — unknown dominant × **homozygous recessive**: Tt × tt → **1 tall : 1 dwarf**; TT × tt → all tall.
- **Back cross** — F₁ × either parent; the test cross is a special type of it (with the recessive parent).
- **Reciprocal cross** — with male and female roles reversed; same result → gene is **autosomal and nuclear**; different result → sex-linked or cytoplasmic inheritance.

### 2.2 Dihybrid cross

Round-yellow (RRYY) × wrinkled-green (rryy) → F₁ **RrYy** (round-yellow) → F₁ gametes: **RY, Ry, rY, ry** (1/4 each) → 16 combinations in F₂:

| Phenotype | Genotype (number/16) | Total |
|---|---|---|
| Round-yellow | RRYY 1, RRYy 2, RrYY 2, **RrYy 4** | **9** |
| Round-green | RRyy 1, Rryy 2 | **3** |
| Wrinkled-yellow | rrYY 1, rrYy 2 | **3** |
| Wrinkled-green | rryy 1 | **1** |

- Phenotypic ratio **9 : 3 : 3 : 1**; number of genotypes **9**; genotypic ratio **1:2:1:2:4:2:1:2:1**.
- Mendel's actual data (556 seeds): round-yellow **315**, round-green **108**, wrinkled-yellow **101**, wrinkled-green **32**.
- Dihybrid test cross RrYy × rryy → **1 : 1 : 1 : 1**.
- Each trait separately is still 3 : 1 — round : wrinkled = (315 + 108) : (101 + 32) = 423 : 133 ≈ 3.18 : 1.

### 2.3 General formulae (n = number of heterozygous gene pairs, complete dominance)

| Quantity | Formula | n = 1 | n = 2 | n = 3 |
|---|---|---|---|---|
| Gamete types of F₁ | 2ⁿ | 2 | 4 | 8 |
| F₂ combinations (Punnett square boxes) | 4ⁿ | 4 | 16 | 64 |
| Phenotypes | 2ⁿ | 2 | 4 | 8 |
| Genotypes | 3ⁿ | 3 | 9 | 27 |
| Homozygous genotypes | 2ⁿ | 2 | 4 | 8 |
| Phenotypic ratio | (3 : 1)ⁿ | 3:1 | 9:3:3:1 | 27:9:9:9:3:3:3:1 |

## 3. Probability — the quick way to solve genetics problems

- **Product rule** — independent events together: P(A and B) = P(A) × P(B).
- **Sum rule** — mutually exclusive events: P(A or B) = P(A) + P(B).
- **Binomial** — r of one type among n offspring: ⁿCᵣ pʳ qⁿ⁻ʳ.

**Solved problems:**
1. Probability of **aabbcc** from AaBbCc × AaBbCc? — 1/4 × 1/4 × 1/4 = **1/64**.
2. **AABbcc** from AaBbCc × AaBbCc? — 1/4 × 1/2 × 1/4 = **1/32**.
3. **AaBbCc** from AaBbCc × aaBbCC? — Aa: 1/2; Bb: 1/2; Cc (Cc × CC): 1/2 → **1/8**.
4. Offspring showing **all four dominant traits** from AaBbCcDd × AaBbCcDd? — (3/4)⁴ = **81/256**.
5. Completely **heterozygous (AaBbCcDd)** from the same cross? — (1/2)⁴ = **1/16**.
6. Phenotype with **dominant A and recessive b** from AaBb × AaBb? — 3/4 × 1/4 = **3/16**.
7. In a family of three children, **2 boys and 1 girl**? — ³C₂ (1/2)² (1/2) = 3 × 1/8 = **3/8**; all three boys = **1/8**.
8. Two heterozygous carrier (Aa × Aa) parents — the first child is already affected (aa); probability that the second is affected? — still **1/4** (events are independent). Probability that a normal-looking child is a carrier = **2/3**.
9. **ABc** gamete from AaBbCc? — 1/2 × 1/2 × 1/2 = **1/8**.

## 4. Chi-square test (χ²) — observed versus expected

**χ² = Σ (O − E)² / E**; degrees of freedom **df = number of classes − 1**. **Null hypothesis (H₀)**: "The difference between observed and expected ratios is due only to chance (sampling error)."

| df | Critical value at 0.05 level |
|---|---|
| 1 | **3.84** |
| 2 | **5.99** |
| 3 | **7.82** |
| 4 | 9.49 |

**Solved example 1 (monohybrid, Mendel's stem):** total 787 + 277 = 1064; expected (3 : 1) = 798 : 266.
- Tall: (787 − 798)² / 798 = 121 / 798 = **0.152**
- Dwarf: (277 − 266)² / 266 = 121 / 266 = **0.455**
- χ² = **0.607**; df = 1; 0.607 < 3.84 → **H₀ not rejected** — the data fit 3 : 1, the deviation is due to chance.

**Solved example 2 (dihybrid, Mendel's 556 seeds):** expected 9:3:3:1 → 312.75, 104.25, 104.25, 34.75.

| Class | O | E | (O − E)² / E |
|---|---|---|---|
| Round-yellow | 315 | 312.75 | 5.0625 / 312.75 = 0.016 |
| Round-green | 108 | 104.25 | 14.0625 / 104.25 = 0.135 |
| Wrinkled-yellow | 101 | 104.25 | 10.5625 / 104.25 = 0.101 |
| Wrinkled-green | 32 | 34.75 | 7.5625 / 34.75 = 0.218 |
| **Total** | 556 | 556 | **χ² = 0.470** |

df = 3; 0.470 < 7.82 → independent assortment (9:3:3:1) accepted.

**Solved example 3 (rejection):** in a test cross 1 : 1 expected, observed 70 : 30 (total 100, E = 50 : 50) → χ² = (20² / 50) + (20² / 50) = 8 + 8 = **16** > 3.84 → **H₀ rejected** — the difference is significant; possible causes are linkage, lethal effect or selective survival.

> **PYQ (UP PGT 2026):** In a genetic experiment, the observed phenotypic numbers deviate from the expected Mendelian ratio. The chi-square value comes out lower than the critical value at the given significance level. The correct interpretation? (A) Null hypothesis rejected, deviations are significant, not due to chance (B) Null hypothesis not rejected, observed data match the expected ratio without any variation (C) Chi-square result shows insufficient sample size, no conclusion possible (D) Null hypothesis not rejected, deviations are due to random sampling within probability limits. — Reasoned answer (official key not available): **(D)**. The "without any variation" in (B) is wrong — there is variation, but due to chance. Details: [Chapter 9 — Biostatistics](/interview/up-pgt/jeev-vigyan/jantu-3/jaiv-sankhyiki-vish-vigyan-vyavhar-aur-vanya-jeev).

## 5. Deviations from dominance (after Mendel)

### 5.1 Incomplete dominance

- **Carl Correns** — ***Mirabilis jalapa*** (four o'clock plant); NCERT example — **snapdragon (*Antirrhinum majus*)**.
- Red (RR) × white (rr) → F₁ **pink (Rr)** → F₂ **1 red : 2 pink : 1 white** — **phenotypic = genotypic ratio = 1 : 2 : 1**.
- Reason: one R allele makes half the pigment (dosage effect). Others: **Andalusian fowl** (black × splashed white → blue); familial hypercholesterolaemia.
- This is not **blending inheritance** — the parental forms reappear in F₂.

### 5.2 Co-dominance

- In the heterozygote **both** alleles are fully expressed (not blended).
- Examples: **AB of the ABO blood group (Iᴬ Iᴮ)**; **MN blood group** (Lᴹ Lᴺ → MN); Shorthorn **roan cattle** (red × white → red and white hairs intermixed); **sickle-cell trait** (both HbA and HbS at the molecular level); molecular markers (RFLP, SSR).
- F₂ ratio **1 : 2 : 1** (like incomplete dominance) — the difference lies in the nature of the phenotype (intermediate versus both).

> **Common mistake:** "Pink flower = co-dominance" is wrong; pink (intermediate) = **incomplete dominance**. "Both red and white patches/hairs" = co-dominance.

### 5.3 Multiple alleles

- **Three or more** alleles of one gene in a population; but **at most two in one diploid individual**.
- n alleles → possible genotypes = **n(n + 1)/2**; in ABO n = 3 → **6 genotypes**, 4 phenotypes.
- **ABO**: discovered by **Karl Landsteiner (1900)** (Nobel 1930; AB — Decastello and Sturli, 1902); three-allele inheritance — **Bernstein (1924–25)**; gene **I** — on **chromosome 9**; Iᴬ and Iᴮ are co-dominant, both dominant over i.

| Blood group | Genotype | Antigen on RBC | Antibody in plasma |
|---|---|---|---|
| A | IᴬIᴬ, Iᴬi | A | anti-B |
| B | IᴮIᴮ, Iᴮi | B | anti-A |
| AB | IᴬIᴮ | A and B | None (**universal recipient**) |
| O | ii | None (H antigen) | anti-A and anti-B (**universal donor**) |

- **Bombay phenotype (hh)** — **Bhende et al. (1952), Mumbai** — H antigen (precursor of A/B) is not made, so the person appears "O" despite having Iᴬ/Iᴮ — a human example of **recessive epistasis**.
- Other multiple alleles: **rabbit coat colour** — C (full colour/agouti) > cᶜʰ (chinchilla) > cʰ (Himalayan — temperature-sensitive enzyme) > c (albino) → 4 alleles, **10 genotypes**; ***Drosophila* eye colour** (white series); in plants **self-incompatibility (S alleles, *Nicotiana*)**; human **HLA**.

**Solved problem 10:** Blood groups among the children of Iᴬi × Iᴮi? — IᴬIᴮ (AB), Iᴬi (A), Iᴮi (B), ii (O) — **all four, 1/4 each**. AB × O → only **A and B** (1 : 1). Mother O, child AB → in a doubtful paternity case: the child must get i from the mother, so an AB child is not possible at all from an O mother — this logic is used in disputed paternity cases (exclusion, not confirmation).

### 5.4 Lethal genes

- **Lucien Cuénot (1905)** — **yellow mice**: Aʸ is **dominant** for coat colour but a **recessive lethal** for survival; AʸAʸ dies as an embryo. Yellow × yellow (Aʸa × Aʸa) → 1 AʸAʸ (dead) : 2 Aʸa (yellow) : 1 aa (non-yellow) → **2 : 1**.
- Others: **creeper fowl** (2 : 1), **Manx cat** (tailless), human **brachydactyly** (homozygous lethal), **Huntington's** (delayed lethal, dominant), **albino** in plants (without chlorophyll — recessive lethal; instead of 3 : 1 only green plants survive).
- Dihybrid of two lethal genes: Aa Bb (both homozygous dominant lethal) — surviving ratio **4 : 2 : 2 : 1** (total 9/16 survive).

### 5.5 Pleiotropy and other terms

- **Pleiotropy** — one gene, many phenotypic effects: **phenylketonuria (PKU)** — mental retardation, light hair and skin; **sickle-cell** — anaemia, spleen damage, pain, malaria resistance; *Drosophila* white gene; the seed-shape gene in pea (also the size of starch grains — NCERT).
- **Penetrance** — what % of those carrying the genotype show the trait (e.g. **polydactyly** has incomplete penetrance). **Expressivity** — variation in the intensity with which it shows.
- **Phenocopy** — an environment-made imitation that looks like a genetic trait (limb defects from thalidomide).

## 6. Gene interaction — modification of dihybrid ratios

**Epistasis** — one gene (epistatic) masks the expression of another, non-allelic gene (hypostatic) (term — Bateson, 1907). **Dominance** is between alleles of the same gene, **epistasis** between different genes.

**All ratios, taking the basic 9 : 3 : 3 : 1 as A_B_ (9), A_bb (3), aaB_ (3), aabb (1):**

| Ratio | Type | Logic (which classes merge) | Example | Test cross (AaBb × aabb) |
|---|---|---|---|---|
| **9 : 3 : 3 : 1** (new traits) | **Complementary-novel / supplementary interaction** | All four classes different, two new phenotypes | **Comb of fowl** (Bateson and Punnett, 1905): R_P_ **walnut**, R_pp **rose**, rrP_ **pea**, rrpp **single** | 1 : 1 : 1 : 1 |
| **9 : 7** | **Complementary genes** — duplicate recessive epistasis | A_B_ (9) one trait; A_bb + aaB_ + aabb = 3 + 3 + 1 = 7 | **Sweet pea (*Lathyrus odoratus*) flower colour** (Bateson and Punnett): F₁ of two white varieties is purple — both C and P are needed for colour | **1 : 3** |
| **9 : 3 : 4** | **Recessive epistasis** — "supplementary genes" | aa epistatic over B: aaB_ + aabb = 3 + 1 = 4 | **Mouse coat colour**: C_A_ agouti (9), C_aa black (3), cc__ **albino (4)**; Labrador dogs (B/E), onion bulb colour | **1 : 1 : 2** |
| **12 : 3 : 1** | **Dominant epistasis** | A epistatic over B: A_B_ + A_bb = 9 + 3 = 12 | **Summer squash (*Cucurbita pepo*) fruit colour**: W_ __ **white (12)**, wwY_ **yellow (3)**, wwyy **green (1)**; dog coat colour, oat hull colour | **2 : 1 : 1** |
| **15 : 1** | **Duplicate genes** — duplicate dominant epistasis | Any one dominant is enough: 9 + 3 + 3 = 15 | ***Capsella bursa-pastoris*** (shepherd's purse) **capsule shape** — triangular (15) : ovoid (1) (**Shull, 1914**); wheat grain colour (two genes, in qualitative form) | **3 : 1** |
| **13 : 3** | **Inhibitory genes — dominant and recessive epistasis** | I (inhibitor) suppresses colour gene C; only C_ii coloured (3); rest 9 + 3 + 1 = 13 white | **Fowl plumage**: **White Leghorn (CCII) × White Wyandotte (ccii)** → F₁ white → F₂ 13 white : 3 coloured; malvidin pigment in *Primula* | **3 : 1** |
| **9 : 6 : 1** | **Duplicate genes with cumulative effect (polymeric)** | A_B_ (9) one; A_bb + aaB_ = 6 intermediate; aabb (1) | **Summer squash fruit shape**: **disc (9)**, **spherical (6)**, **long (1)**; pig coat colour (red, sandy, white) | **1 : 2 : 1** |

**Verifying the test-cross ratios** — AaBb × aabb gives four classes 1 AaBb : 1 Aabb : 1 aaBb : 1 aabb (i.e. A_B_, A_bb, aaB_, aabb).
- 9:7 → A_B_ (1) : rest (3) = **1 : 3** — correct
- 9:3:4 → A_B_ (1) : A_bb (1) : [aaB_ + aabb] (2) — here a is taken as epistatic = **1 : 1 : 2** — correct
- 12:3:1 → [A_B_ + A_bb] (2) : aaB_ (1) : aabb (1) = **2 : 1 : 1** — correct
- 15:1 → [three classes] (3) : aabb (1) = **3 : 1** — correct
- 13:3 → (C = colour, I = inhibitor) CcIi white, Ccii **coloured**, ccIi white, ccii white → **3 white : 1 coloured** — correct
- 9:6:1 → A_B_ (1) : [A_bb + aaB_] (2) : aabb (1) = **1 : 2 : 1** — correct

> **Memory trick:** "**Nine-seven complementary, nine-three-four recessive, twelve dominant, fifteen duplicate, thirteen inhibitory, nine-six-one cumulative**". The numbers must always add up to **16** — 9+7, 9+3+4, 12+3+1, 15+1, 13+3, 9+6+1.

### Solved gene-interaction problems

**Problem 11:** F₁ of two white-flowered sweet peas (CCpp × ccPP) is purple. If F₂ has 160 plants, how many purple? — 9/16 × 160 = **90** purple, **70** white.
**Problem 12:** Black mice (CCaa) × albino (ccAA) → F₁ CcAa (agouti). Albinos among 64 F₂ mice? — 4/16 × 64 = **16**; agouti 36, black 12.
**Problem 13:** Summer squash — white (WWYY) × green (wwyy) → F₁ white. Yellow among 320 F₂ plants? — 3/16 × 320 = **60** (white 240, green 20).
**Problem 14:** F₂ gave triangular : ovoid capsules 301 : 19. Which ratio? — of 320, 15/16 = 300, 1/16 = 20 → **15 : 1 (duplicate genes)**. χ² = (1²/300) + (1²/20) = 0.0033 + 0.05 = **0.053** < 3.84 — correct
**Problem 15:** F₂ has 90 disc : 60 spherical : 10 long fruits. Ratio? — total 160; 160/16 = 10 → **9 : 6 : 1** (cumulative duplicate genes).
**Problem 16:** F₂ has 208 white : 48 coloured fowls. — total 256; 256/16 = 16 → 208/16 = 13, 48/16 = 3 → **13 : 3 (inhibitory gene)**.
**Problem 17 (reverse logic):** A dihybrid test cross gives 1 : 3 — F₂ ratio? — **9 : 7** (complementary genes).

## 7. Polygenic (quantitative) inheritance — "Multiple gene inheritance"

- **Quantitative traits** — height, skin colour, IQ, milk yield, grain yield — **continuous variation**, **normal (bell-shaped) distribution**; many genes, each with a small **additive/cumulative** effect + environment.
- **Nilsson-Ehle (1909)** — **wheat grain colour**: two genes R₁, R₂ — dark red (R₁R₁R₂R₂) × white (r₁r₁r₂r₂) → F₁ medium red → F₂ **1 : 4 : 6 : 4 : 1** (4, 3, 2, 1, 0 dominant alleles).
- **East (1916)** — corolla length in tobacco; **Davenport (1913)** — human skin colour (3 genes A, B, C in NCERT). Three genes → F₂ **1 : 6 : 15 : 20 : 15 : 6 : 1** (total 64; 7 phenotypes).
- **Formula (n gene pairs):** phenotypic classes = **2n + 1**; frequency of each extreme (parent-like) class = **(1/4)ⁿ**; the distribution follows the binomial coefficients of (a + b)²ⁿ (Pascal's triangle).
- **Solved problem 18:** In F₂, 1/256 of plants are like the tallest parent. Gene pairs? — (1/4)ⁿ = 1/256 = (1/4)⁴ → **n = 4**; phenotypic classes = 2 × 4 + 1 = **9**.
- **Solved problem 19:** 3 genes, each dominant allele adds 5 cm; aabbcc = 60 cm. Height of AaBbCc? — 3 dominant × 5 = 15 → **75 cm**; AABBCC = 60 + 30 = **90 cm**.
- **Polygeny versus pleiotropy:** polygenic — many genes → one trait; pleiotropy — one gene → many traits.
- **Heritability (h²)** — the proportion of genetic variance in phenotypic variance: h² = Vg / Vp.

## 8. Chromosomal theory of inheritance

- **Walter Sutton (1902–03)** — from meiosis in the grasshopper (*Brachystola magna*); **Theodor Boveri (1902)** — in sea urchin embryos a full chromosome set is needed for normal development. This is called the **Sutton-Boveri hypothesis**.
- **Parallels (Mendelian factor ↔ chromosome):** both occur in pairs; both separate during gamete formation; a gamete gets one of each pair; pairs are restored at fertilisation; different pairs assort independently.
- **Experimental proof — Thomas Hunt Morgan (1910)**, **white eye** of ***Drosophila melanogaster*** — X-linked inheritance; Nobel 1933. Morgan's students — **Sturtevant** (first gene map, 1913), **Bridges** (non-disjunction — the final proof of the chromosomal theory, 1916), **Muller** (X-ray mutation).
- **Why *Drosophila*:** short life cycle (≈ **12–14 days**, ≈ 10 days at 25°C), simple artificial medium, hundreds of offspring from one mating, males and females easily told apart, many genetic variations, only **4 pairs** of chromosomes, giant polytene chromosomes.

## 9. Cytoplasmic inheritance and maternal effect (in brief)

- **Correns (1908/09)** — **leaf variegation** in *Mirabilis jalapa* — plastids come maternally; the offspring's trait depends **only on the female parent**.
- **Sonneborn** — **kappa particles** in *Paramecium* ("killer" strain).
- Mitochondrial inheritance — human **LHON**; in plants **cytoplasmic male sterility (CMS)** — used in hybrid seed production.
- **Maternal effect** — shell coiling of the **snail *Limnaea peregra*** (dextral D dominant) — the offspring's phenotype is decided by the **mother's genotype** (explained by Sturtevant 1923, experiments of Boycott and Diver). This is a nuclear gene, but it shows with a delay of one generation.

## Traps and exceptions

- The law of segregation is **universal**; dominance and independent assortment have exceptions.
- **Yellow is dominant in seed colour, green is dominant in pod colour** — do not mix them up.
- Both incomplete dominance and co-dominance give F₂ = 1 : 2 : 1 — so you cannot tell them apart from the ratio alone; look at the nature of the phenotype.
- In ABO, Iᴬ and Iᴮ are **co-dominant**, but both are **completely dominant** over i — both relationships in a single gene.
- 2 : 1 ratio = sign of a **lethal gene**; 1 : 2 : 1 = incomplete/co-dominance; 9 : 7 = complementary.
- In complementary genes (9:7) **both** dominants are needed; in duplicate genes (15:1) **any one** is enough.
- In 13 : 3 the inhibitor gene I has **no phenotype of its own** — it only suppresses.
- In polygenic traits F₁ is **intermediate**, but this is not incomplete dominance — it is the additive effect of many genes.
- A test cross is always with the **homozygous recessive**; F₁ × dominant parent is a back cross, but not a test cross.
- Low chi-square value = data agree with expectation; saying "H₀ is proved" is also wrong — only "no basis to reject it".

## Quick revision

1. Mendel — experiments 1856–63, published 1866, rediscovered 1900 (de Vries, Correns, Tschermak).
2. Gene — Johannsen (1909); Genetics — Bateson (1905).
3. Monohybrid F₂ — 3 : 1 (phenotype), 1 : 2 : 1 (genotype).
4. Dihybrid F₂ — 9 : 3 : 3 : 1; 9 genotypes; 16 combinations.
5. Trihybrid — 8 gametes, 64 combinations, 27 genotypes, 8 phenotypes.
6. Test cross — 1 : 1 (monohybrid), 1 : 1 : 1 : 1 (dihybrid).
7. χ² = Σ(O − E)²/E; 3.84 at df 1.
8. Incomplete dominance — *Mirabilis*, snapdragon; 1 : 2 : 1.
9. Co-dominance — AB blood group, MN, roan cattle.
10. ABO — Landsteiner (1900); 3 alleles, 6 genotypes, 4 phenotypes; chromosome 9.
11. Bombay phenotype — hh.
12. Lethal gene — yellow mice (Cuénot), 2 : 1.
13. 9 : 7 complementary — sweet pea.
14. 9 : 3 : 4 recessive epistasis — mouse coat colour.
15. 12 : 3 : 1 dominant epistasis — summer squash fruit colour.
16. 15 : 1 duplicate — *Capsella* capsule.
17. 13 : 3 inhibitory — White Leghorn × White Wyandotte.
18. 9 : 6 : 1 cumulative — summer squash fruit shape.
19. 9 : 3 : 3 : 1 novel traits — fowl comb.
20. Wheat grain colour — Nilsson-Ehle, 1 : 4 : 6 : 4 : 1.
21. Polygenic — 2n + 1 phenotypes; extreme = (1/4)ⁿ.
22. Chromosomal theory — Sutton and Boveri (1902); proof — Morgan (1910).
23. Maternal effect — *Limnaea* coiling.

## Practice questions (with answers)

1. Which of Mendel's laws is universal? — **Law of segregation** (purity of gametes).
2. Proportion of dwarf plants from Tt × tt? — **50%** (test cross 1 : 1).
3. Probability of aabb from AaBb × AaBb? — **1/16**.
4. How many types of gametes will AaBbCc form? — **8** (2³).
5. A 1 : 2 : 1 phenotypic ratio in F₂ indicates what? — **Incomplete dominance or co-dominance**.
6. Example of multiple alleles? — **ABO blood group** (Iᴬ, Iᴮ, i).
7. How many genotypes from 4 alleles? — **10** (4 × 5 / 2).
8. Why yellow × yellow mice give 2 : 1? — **AʸAʸ is homozygous lethal**.
9. Interaction whose test cross gives 1 : 1 : 2? — **Recessive epistasis (9 : 3 : 4)**.
10. Test-cross ratio of 12 : 3 : 1? — **2 : 1 : 1**.
11. 15 : 1 ratio in which plant? — ***Capsella bursa-pastoris*** (capsule shape).
12. F₂ of White Leghorn × White Wyandotte? — **13 white : 3 coloured** (inhibitory gene).
13. Genotype of the walnut comb of fowl? — **R_P_**.
14. Phenotypic classes in F₂ for a two-gene polygenic trait? — **5** (1 : 4 : 6 : 4 : 1).
15. Probability that all three children are girls? — **1/8**.
16. χ² = 2.1, df = 1 — conclusion? — **H₀ acceptable** (2.1 < 3.84; deviation due to chance).
17. Plasma antibody of a person with AB blood group? — **None** (universal recipient).
18. With which trait did Morgan prove the chromosomal theory? — **White eye of *Drosophila*** (X-linked).
19. One gene affecting many traits? — **Pleiotropy** — e.g. PKU.

**For more depth (English):** [Mendelian genetics and its extensions](/interview/bpsc-tre/class-11-12-zoology/cell-genetics/mendelian-genetics-and-its-extensions). Next chapter: [Linkage, sex determination and mutation](/interview/up-pgt/jeev-vigyan/jantu-3/sahlagnata-ling-nirdharan-aur-utparivartan).
