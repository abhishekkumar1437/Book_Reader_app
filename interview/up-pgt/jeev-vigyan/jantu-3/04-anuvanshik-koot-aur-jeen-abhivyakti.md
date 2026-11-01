---
title: Genetic Code, Central Dogma and Gene Expression
part: Molecular Biology
summary: Central dogma and reverse transcription, discovery and features of the genetic code, wobble hypothesis, prokaryotic and eukaryotic transcription, RNA processing (cap, poly-A, splicing), stages and energy of translation, concept of the gene, lac and trp operons, eukaryotic gene regulation, epigenetics, RNAi and the Human Genome Project.
---

This chapter takes "genetic code, central dogma, protein synthesis, gene expression" of Unit 8 from NCERT 12 up to M.Sc. level (σ factor, promoter sequences, RNA polymerases I-II-III, attenuation, epigenetics). The 2026 paper asked a statement-combination question on **epigenetic changes** in differentiation; lac operon **mutants (i⁻, oᶜ)** and **exceptions** of the code are likely M.Sc.-level targets.

> **In simple words:** The language of DNA (four letters A, T, G, C) is first copied into the similar language of RNA (**transcription**), then the three-letter "words" (codons) are read to build a chain of amino acids — a protein (**translation**). Every cell has all the genes, but not every gene is "on" all the time — the cell switches genes on and off as needed (**gene regulation**).

## 1. Central dogma

- **Francis Crick (1958)**: DNA → (transcription) → RNA → (translation) → protein; DNA → DNA (replication). Information does not flow back from protein to nucleic acid.
- **Reverse transcription** — RNA → DNA; **Howard Temin and David Baltimore (1970)**, enzyme **reverse transcriptase** (RNA-dependent DNA polymerase); retroviruses (HIV, Rous sarcoma virus) — Nobel 1975 (with Dulbecco). This was called the "**reverse of the central dogma / Teminism**".
- RNA → RNA replication — in RNA viruses (**RNA replicase**).
- **Prion** — misfolding of a protein spreading to other proteins (Stanley Prusiner, Nobel 1997) — transmission of shape, not information; a "quasi-exception" to the central dogma.

## 2. Genetic code

| Year | Scientist | Contribution |
|---|---|---|
| 1954 | **George Gamow** (physicist) | 4 bases, 20 amino acids → 4¹ = 4, 4² = 16 (too few), **4³ = 64** → suggested a **triplet code** |
| 1961 | **Crick, Brenner et al.** | Frameshift (proflavin) mutations in T4 phage — code is **triplet, non-overlapping, commaless** |
| 1961 | **Marshall Nirenberg and Heinrich Matthaei** | In a cell-free system **poly-U → polyphenylalanine** → **UUU = phenylalanine** (first codon) |
| 1955 | **Severo Ochoa** | **Polynucleotide phosphorylase** (RNA polymer without a template) — Nobel 1959 |
| 1960s | **Har Gobind Khorana** | **Repeating copolymers** of defined sequence — e.g. UCUCUC… → Ser-Leu-Ser-Leu |
| 1964 | **Nirenberg and Leder** | **Triplet binding assay** — tRNA-ribosome-triplet |
| 1968 | Nobel — **Khorana, Nirenberg, Holley** | Deciphering the code and tRNA sequence |

- **Khorana** — of Indian origin (born Raipur, Punjab, now Pakistan, 1922); in 1972 synthesised the first **artificial gene** (yeast alanine tRNA gene).

### 2.1 Features of the code

| Feature | Meaning |
|---|---|
| **Triplet** | Three bases = one codon; 64 codons in all |
| **61 sense + 3 stop** | **UAA (ochre), UAG (amber), UGA (opal)** — "nonsense" codons; normally no tRNA for these, **release factors** recognise them |
| **Start codon** | **AUG** — methionine (**N-formyl methionine, fMet** in prokaryotes); sometimes **GUG** (valine) also starts (then still fMet) |
| **Degenerate** | Many codons for one amino acid — Leu, Ser, Arg have **6 each**; only **Met (AUG) and Trp (UGG)** have **one each** |
| **Unambiguous and specific** | One codon → only one amino acid |
| **Non-overlapping and commaless** | Read continuously, no pauses in between; (genes overlap in some viruses — φX174) |
| **Nearly universal** | Same from bacteria to humans; **exceptions** below |
| **Polarity** | mRNA is read 5′ → 3′ |

**Exceptions to universality:**
- **Human/mammalian mitochondria:** **UGA = tryptophan** (not stop), **AUA = methionine** (not isoleucine), **AGA, AGG = stop** (not arginine).
- ***Mycoplasma***: UGA = tryptophan.
- **Ciliate protozoa** (*Tetrahymena*, *Paramecium*): UAA and UAG = glutamine.
- **21st and 22nd amino acids:** **selenocysteine** (by UGA, in a special context — SECIS element) and **pyrrolysine** (by UAG, some archaea).

### 2.2 Wobble hypothesis (Crick, 1966)

- The **first two bases** of the codon form strict (Watson-Crick) pairs with the anticodon, but pairing between the **third base (3′ of the codon)** and the **first base (5′) of the anticodon** is "loose".
- **G** at the 5′ of the anticodon → U or C at the 3′ of the codon; **U** → A or G; **I (inosine)** → **U, C or A**.
- Result: 61 tRNAs are not needed for 61 codons — a minimum of **≈ 32** tRNAs is enough (actual number depends on the species). This is why code degeneracy is mainly at the **third position**.

### 2.3 Reading frame — solved example

mRNA: 5′-AUG UUU GGC UAA-3′ → Met–Phe–Gly–(stop). If one base is **inserted** after the first U (5′-AUG U**A**U UGG CUA A…) → Met–Tyr–Trp–Leu… — the whole frame has changed = **frameshift**. If three bases are added/deleted the frame is restored (one amino acid more/less) — the Crick-Brenner proof.

## 3. Transcription

### 3.1 Transcription unit

- **Promoter** (5′ upstream, RNA polymerase binding site) — **structural gene** — **terminator** (3′ downstream).
- Of the two DNA strands, the **template strand (antisense, 3′→5′)** is read; the other is the **coding strand (sense, 5′→3′)** — its sequence is the same as the RNA (U in place of T); by convention the sequence of the coding strand is written.
- RNA polymerase does **not** need a primer; it also synthesises 5′ → 3′; very little proofreading.
- **Cistron** — the DNA segment coding for one polypeptide. In prokaryotes mRNA is usually **polycistronic**, in eukaryotes **monocistronic**.

### 3.2 Prokaryotic transcription

- **A single RNA polymerase** makes all RNAs. **Core enzyme = α₂ββ′ω**; with the **σ (sigma) factor** attached = **holoenzyme** (σ⁷⁰ — normal genes; σ³² — heat shock).
- Promoter: **−10 region = Pribnow box (TATAAT)**, **−35 region (TTGACA)**; +1 = transcription start site.
- Stages: **initiation** (σ recognises the promoter; closed → open complex; σ leaves after ≈ 10 nt) → **elongation** → **termination**.
- Termination: **ρ (rho)-independent** — GC-rich **hairpin loop** followed by a **U-stretch**; **ρ-dependent** — **rho factor** (ATP-dependent helicase) moves along the RNA and detaches the polymerase.
- In prokaryotes transcription and translation are **coupled** — ribosomes attach while the mRNA is still being made.
- Inhibitors: **rifampicin** (β subunit — bacterial polymerase), **actinomycin D** (intercalates into DNA — in both).

### 3.3 Eukaryotic transcription

| RNA polymerase | Location | Makes | α-amanitin sensitivity |
|---|---|---|---|
| **RNA Pol I** | Nucleolus | **28S, 18S, 5.8S rRNA** (45S precursor) | Insensitive |
| **RNA Pol II** | Nucleoplasm | **hnRNA (mRNA precursor)**, most snRNAs, miRNA | **Highly sensitive** |
| **RNA Pol III** | Nucleoplasm | **tRNA, 5S rRNA**, U6 snRNA, 7SL RNA | Moderate |

(α-amanitin — toxin of the death-cap mushroom *Amanita phalloides*.)

- Pol II promoter: **TATA box (Hogness box, ≈ −25 to −30)**, CAAT box (≈ −75), GC box; **general transcription factors (TFIID — with TBP, TFIIB, TFIIH etc.)** required; distant **enhancers** and **silencers**.

### 3.4 RNA processing (eukaryotes only) — hnRNA → mature mRNA

1. **5′ capping** — **7-methylguanosine (m⁷G)** by an unusual **5′–5′ triphosphate bond**; ribosome binding and protection from degradation.
2. **3′ poly-A tail** — 200–250 A by **poly-A polymerase** (template-independent); signal **AAUAAA**; stability and export. (Histone mRNAs have no poly-A.)
3. **Splicing** — removal of **introns**, joining of **exons**; **spliceosome** (snRNPs — U1, U2, U4, U5, U6); introns usually **begin with GU and end with AG (GU–AG rule)**; a **lariat** forms at the branch-point A.
- **Split genes** — **Phillip Sharp and Richard Roberts (1977)**, adenovirus; Nobel 1993. The terms "intron"-"exon" — **Walter Gilbert (1978)**.
- **Alternative splicing** — many proteins from one gene (in ≈ 95% of multi-exon genes in humans) — hence hundreds of thousands of proteins from ≈ 20,000 genes.
- **RNA editing** — example: **ApoB** — ApoB-100 in the liver; in the intestine C→U editing creates a stop codon, giving ApoB-48.
- **Self-splicing introns** (group I — *Tetrahymena*, group II) — ribozymes.

## 4. Translation

### 4.1 Preparation — activation of amino acids (charging of tRNA)
**Aminoacyl-tRNA synthetase** (one for each amino acid, 20 in all): amino acid + ATP → aminoacyl-AMP + PPi; then it attaches to the A of the 3′ **CCA** of tRNA to give **aminoacyl-tRNA**. This is called the "**second genetic code**" — the joining of the right amino acid to the right tRNA depends on the specificity of this enzyme.

### 4.2 Ribosome sites
**A (aminoacyl)**, **P (peptidyl)**, **E (exit)**. mRNA on the small subunit; peptidyl transferase is the rRNA of the large subunit.

### 4.3 Stages (prokaryotes)

| Stage | Events | Factors |
|---|---|---|
| **Initiation** | 30S + mRNA — **Shine-Dalgarno sequence** (AGGAGG, ≈ 8 nt upstream of AUG) pairs with the 3′ end of 16S rRNA; **fMet-tRNAᶠᴹᵉᵗ** goes directly to the **P site**; then 50S joins to form 70S | IF1, IF2 (GTP), IF3 |
| **Elongation** | (1) charged tRNA enters the **A site** (EF-Tu·GTP); (2) **peptide bond** — chain on the P site transferred to the amino acid on the A site (peptidyl transferase — **23S rRNA**); (3) **translocation** — ribosome moves one codon towards 3′ (EF-G·GTP); empty tRNA leaves from the E site | EF-Tu, EF-Ts, EF-G |
| **Termination** | Stop codon at the A site → **release factors** — **RF1 (UAA, UAG), RF2 (UAA, UGA)**, RF3 (GTP) → polypeptide released, ribosome separates | RF1, RF2, RF3, RRF |

- In eukaryotes: the 40S subunit binds at the **5′ cap** and **scans** to find the first AUG (**Kozak sequence** — gccRccAUGG); initiator tRNA carries **Met** (not formylated); many eIFs; a single release factor **eRF1** recognises all three stop codons.
- **Polysome** — many ribosomes on one mRNA at the same time.
- **Energy cost:** **4 high-energy phosphate bonds** per peptide bond — 2 (ATP → AMP, charging) + 1 GTP (EF-Tu) + 1 GTP (EF-G/translocation).
- The polypeptide is built from the **N-terminus to the C-terminus** (mRNA is read 5′→3′).
- **UTRs (untranslated regions)** — at the 5′ and 3′ of mRNA; for translation efficiency.
- After translation: **chaperones** (folding), removal of signal peptide, phosphorylation, glycosylation (post-translational modification).

**Antibiotics and translation:** **streptomycin** (30S — blocks initiation, misreading), **tetracycline** (30S — blocks tRNA binding at the A site), **chloramphenicol** (50S — peptidyl transferase), **erythromycin** (50S — translocation), **puromycin** (tRNA analogue — premature chain release; in both), **cycloheximide** (80S only), **diphtheria toxin** (ADP-ribosylation of eEF2).

**Solved example 1:** Minimum number of nucleotides in the coding part of mRNA for a protein of 150 amino acids? — 150 × 3 = 450 + stop codon 3 = **453** (the start AUG is itself the codon for the first amino acid, Met). Energy: peptide bonds = 149; charging 150 amino acids × 2 = 300, elongation 149 × 2 GTP = 298 → total **598** high-energy bonds (+ 1 GTP for initiation and 1 GTP for termination ≈ 600). By the simple rule "4 per peptide bond", 149 × 4 = 596 — choose the nearest value among the options.

## 5. Concept of the gene

- **One gene–one enzyme** — **George Beadle and Edward Tatum (1941)**, nutritional mutants (auxotrophs) of ***Neurospora crassa***; background — **Archibald Garrod (1902/1909)** — "**inborn errors of metabolism**" (alkaptonuria).
- Revision: **one gene–one polypeptide** (α and β of haemoglobin are separate genes) → **one gene–one RNA/product** (tRNA, rRNA genes do not make proteins).
- **Seymour Benzer (1955–57)**, **rII locus** of T4 phage: **cistron** (unit of function — *cis-trans* test), **muton** (smallest unit of mutation — one nucleotide), **recon** (unit of recombination).
- **Overlapping genes, genes within genes, jumping genes (transposons — McClintock)**, **pseudogenes** (inactive copies).

## 6. Regulation of gene expression — prokaryotes (operon)

**Operon** — a unit of structural genes transcribed together under the control of one promoter-operator. **François Jacob and Jacques Monod (1961)**, *E. coli* — Nobel 1965 (with André Lwoff).

### 6.1 lac operon — inducible, negative control

| Component | Function |
|---|---|
| **i (regulator gene, lacI)** | Makes the **repressor** protein — expressed **always (constitutively)**, has its own promoter |
| **p (promoter)** | RNA polymerase binding |
| **o (operator)** | Repressor binding site |
| **z (lacZ)** | **β-galactosidase** — lactose → glucose + galactose (and lactose → allolactose) |
| **y (lacY)** | **Permease** — entry of lactose into the cell |
| **a (lacA)** | **Transacetylase** |

- **Lactose absent:** repressor bound to the operator → RNA polymerase blocked → **operon off**.
- **Lactose present:** the actual **inducer = allolactose** (NCERT says "lactose is the inducer") binds the repressor → changes its shape (**allosteric**) → it leaves the operator → transcription **on**. In the laboratory **IPTG** (a non-metabolisable synthetic inducer).
- **Positive control — catabolite repression:** glucose low → **cAMP high** → **CAP (CRP)-cAMP** complex binds near the promoter and **increases** transcription. Glucose high → cAMP low → lac operon nearly off even if lactose is present → **diauxie (diphasic growth)** — Monod's observation.
- A little "leaky" expression keeps some permease present beforehand, so that lactose can enter.

| Glucose | Lactose | lac transcription |
|---|---|---|
| + | − | Off (repressor bound) |
| + | + | Very low (no CAP-cAMP) |
| − | − | Off (repressor bound) |
| − | + | **Maximum** (repressor removed + CAP-cAMP) |

**Mutants (M.Sc. level):** **i⁻** (repressor inactive) → **constitutive** expression; **iˢ** (super-repressor, cannot bind inducer) → never induced; **oᶜ** (operator constitutive — repressor cannot bind) → constitutive, and effective only on the same chromosome (*cis*). In partial diploids (F′ lac) **i⁺ is dominant and *trans*-acting** (diffusible protein), whereas **oᶜ is *cis*-acting** (DNA site).

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="10" y1="60" x2="410" y2="60"/>
  <rect x="20" y="45" width="40" height="30"/><text x="36" y="65" fill="currentColor" stroke="none">i</text>
  <rect x="90" y="45" width="30" height="30"/><text x="101" y="65" fill="currentColor" stroke="none">p</text>
  <rect x="120" y="45" width="30" height="30"/><text x="131" y="65" fill="currentColor" stroke="none">o</text>
  <rect x="150" y="45" width="90" height="30"/><text x="190" y="65" fill="currentColor" stroke="none">z</text>
  <rect x="240" y="45" width="70" height="30"/><text x="270" y="65" fill="currentColor" stroke="none">y</text>
  <rect x="310" y="45" width="50" height="30"/><text x="331" y="65" fill="currentColor" stroke="none">a</text>
  <path d="M 40 75 L 40 120"/><path d="M 40 120 l -4 -8 M 40 120 l 4 -8"/>
  <circle cx="40" cy="135" r="12"/><text x="10" y="165" fill="currentColor" stroke="none">Repressor</text>
  <path d="M 55 128 Q 100 110 130 80" stroke-dasharray="4 3"/>
  <text x="70" y="105" fill="currentColor" stroke="none">binds o</text>
  <text x="150" y="105" fill="currentColor" stroke="none">Allolactose + repressor → inactive</text>
  <text x="150" y="125" fill="currentColor" stroke="none">→ polycistronic mRNA (z y a)</text>
  <text x="150" y="145" fill="currentColor" stroke="none">β-galactosidase, permease, transacetylase</text>
  <text x="20" y="30" fill="currentColor" stroke="none">lac operon (inducible, negative + positive by CAP)</text>
</svg>

### 6.2 trp operon — repressible

- Structural genes **trpE, D, C, B, A** — enzymes of tryptophan synthesis (from chorismate).
- Regulator gene **trpR** makes an **inactive repressor (aporepressor)**; **tryptophan = co-repressor** binds it to form the active repressor → binds the operator → operon **off**.
- Tryptophan low → repressor inactive → operon **on** (logic of an anabolic/biosynthetic pathway).
- **Attenuation — Charles Yanofsky:** leader region (**trpL**, a 14-amino-acid leader peptide with **two consecutive Trp codons**) — if Trp is high the ribosome moves ahead quickly, the **3-4 terminator hairpin** forms → transcription stops early; if Trp is low the ribosome stalls at the Trp codons, the **2-3 anti-terminator** forms → transcription continues. This depends on **coupled transcription-translation** in prokaryotes.

| Point | lac | trp |
|---|---|---|
| Type | Inducible | Repressible |
| Pathway | Catabolic | Anabolic |
| Repressor on its own | **Active** (binds the operator) | **Inactive** (aporepressor) |
| Small molecule | Inducer (allolactose) — inactivates the repressor | Co-repressor (Trp) — activates the repressor |
| Extra control | CAP-cAMP (positive) | Attenuation |

**Others:** **ara operon** (AraC — both positive and negative), **his operon** (attenuation).

## 7. Eukaryotic gene regulation (basics)

Levels of regulation: (1) **chromatin/epigenetic**, (2) **transcription** (most important), (3) **RNA processing** (alternative splicing), (4) mRNA transport and stability, (5) **translation**, (6) post-translational (protein modification, degradation).

- **Britten-Davidson model (1969)** — sensor genes, integrator genes, activator RNA, receptor genes, producer genes — the first model of coordinated regulation of eukaryotic genes.
- **Transcription factors** — DNA-binding motifs: **helix-turn-helix**, **zinc finger**, **leucine zipper**, helix-loop-helix; **homeobox (Hox) genes** — body-segment identity (*Drosophila*: Lewis, Nüsslein-Volhard, Wieschaus — Nobel 1995).
- **Enhancers** — act from thousands of bp away, in any orientation; contact the promoter by DNA looping.
- **Hormonal regulation** — steroid hormone–receptor complex binds the **hormone response element (HRE)** and switches genes on.

### 7.1 Epigenetics

**Heritable (stable through cell division)** changes in gene expression without changing the DNA sequence; term by **C. H. Waddington (1942)**.
- **DNA methylation** — on cytosine of CpG (5-methylcytosine), by **DNMT** enzymes → usually gene **silencing**.
- **Histone modification** — **acetylation** (HAT) → chromatin loosens → **active**; deacetylation (HDAC) → silent; methylation (H3K4me3 active, H3K9me3/H3K27me3 silent) — the "**histone code**".
- **Genomic imprinting** — some genes are expressed only from the father's or only from the mother's copy; defects → **Prader-Willi** (deletion of paternal 15q11–13) and **Angelman** (maternal) syndromes.
- **X-inactivation** — by *XIST* RNA (Barr body).
- **Cell differentiation** — all somatic cells have the same genome (**genomic equivalence** — Gurdon's frog nuclear transplantation 1962; Yamanaka's **iPSC** 2006 — Nobel 2012), yet cells differ → **differential gene expression**, cytoplasmic determinants, positional signals (morphogens); the differentiated state is maintained by epigenetic marks, but **reprogramming** is possible.

> **PYQ (UP PGT 2026):** Consider the statements about cellular differentiation: (I) In multicellular organisms the main basis of differentiation is differential gene expression, not gene loss. (II) In early development cytoplasmic determinants and positional signals decide cell fate. (III) After differentiating, all cells irreversibly lose the ability to change their fate under any circumstances. (IV) Epigenetic changes such as DNA methylation and histone modification help maintain the differentiated state. Correct combination? (A) I and III only (B) I, II and IV only (C) II, III and IV only (D) I, II, III and IV — Reasoned answer (official key not available): **(B)**. The "all… under any circumstances" of statement III is wrong — Gurdon's nuclear transplantation, iPSC, regeneration and dedifferentiation are counter-examples.

### 7.2 RNA interference (RNAi) and small RNAs

- **Andrew Fire and Craig Mello (1998)**, ***Caenorhabditis elegans*** — gene silencing by dsRNA; Nobel 2006.
- dsRNA → **Dicer** → 21–23 nt **siRNA** → **RISC** (Argonaute protein) → cleavage of the complementary mRNA. **miRNA** — from the organism's own genome, usually blocks translation through imperfect complementarity (lin-4, Ambros 1993).
- Use: nematode-resistant tobacco (*Meloidogyne incognita*) — Chapter 7.

## 8. Human Genome Project (HGP) — key facts

| Fact | Value |
|---|---|
| Duration | **1990 – 2003** (13 years); US DOE + NIH, along with the Wellcome Trust (UK), Japan, France, Germany, China etc. |
| Methods | **ESTs** (expressed sequence tags) and **sequence annotation**; BAC/YAC vectors; **shotgun** sequencing |
| Total size | **3164.7 million bp** (≈ 3 × 10⁹) |
| Number of genes | ≈ **30,000** (NCERT) — now ≈ **19,000–20,000** protein-coding |
| Average gene | 3000 bases; largest — **dystrophin** (2.4 million bp) |
| Coding part | **< 2%** |
| Most genes | **Chromosome 1** (2968); fewest — **Y** (231) |
| SNPs | ≈ 1.4 million sites (single-base differences) |
| 99.9% | Base sequence identical in all humans |
| Complete gap-free sequence | **T2T (Telomere-to-Telomere) Consortium, 2022** |

## Traps and exceptions

- AUG is the start codon and also the codon for **internal methionine**.
- "The genetic code is completely universal" — wrong; there are exceptions in mitochondria and some organisms.
- Degeneracy ≠ ambiguity: many codons for one amino acid (degeneracy) is fine; many meanings for one codon (ambiguity) does not occur.
- In the lac operon the repressor is made by the **i gene**, which is separate from the structural genes of the operon and always expressed from its own promoter.
- NCERT calls lactose the "inducer"; the actual inducer is **allolactose** — if both appear in the options, look at the wording of the question.
- In the trp operon tryptophan is the **co-repressor**, not an inducer.
- Splicing does **not occur in prokaryotes** (self-splicing introns in some archaea/phages are exceptions).
- rRNA (peptidyl transferase) is an enzyme — "all enzymes are proteins" is wrong.
- Prokaryotes have one RNA polymerase; eukaryotes have three (plants also have Pol IV, V).
- RNA polymerase needs no primer in transcription; DNA polymerase needs one in replication.

## Quick revision

1. Central dogma — Crick (1958); reverse transcriptase — Temin and Baltimore (1970).
2. Triplet code suggested — Gamow; first codon UUU = Phe — Nirenberg and Matthaei (1961).
3. Nobel 1968 — Khorana, Nirenberg, Holley.
4. 64 codons; 61 sense; 3 stop — UAA, UAG, UGA.
5. Start — AUG (Met/fMet); Met and Trp have one codon each.
6. Mitochondria — UGA = Trp.
7. Wobble — Crick (1966); third position; inosine.
8. Pribnow box — −10, TATAAT; −35 — TTGACA.
9. σ factor — initiation; ρ factor — termination.
10. Pol I — rRNA (28S, 18S, 5.8S); Pol II — mRNA; Pol III — tRNA, 5S rRNA.
11. TATA (Hogness) box — eukaryotes; α-amanitin blocks Pol II.
12. Cap — 7-methylguanosine; poly-A — 200–250.
13. Split genes — Sharp and Roberts (1977).
14. Shine-Dalgarno — pairs with 16S rRNA.
15. Peptidyl transferase — 23S rRNA.
16. 4 high-energy bonds per peptide bond.
17. One gene–one enzyme — Beadle and Tatum, *Neurospora*.
18. Cistron, muton, recon — Benzer.
19. Operon — Jacob and Monod (1961).
20. lac — z, y, a; inducer allolactose; CAP-cAMP positive.
21. trp — repressible; Trp co-repressor; attenuation — Yanofsky.
22. RNAi — Fire and Mello, *C. elegans*, Nobel 2006.
23. HGP — 1990–2003; 3164.7 Mbp; chromosome 1 most genes, Y fewest.

## Practice questions (with answers)

1. Amino acids with only one codon? — **Methionine (AUG) and tryptophan (UGG)**.
2. Which is the amber codon? — **UAG**.
3. Which polypeptide was made from poly-U? — **Polyphenylalanine**.
4. Wobble at which position? — **Third (3′) base of the codon / first (5′) of the anticodon**.
5. How many amino acids from mRNA 5′-AUG GCA UAA-3′? — **2** (Met-Ala; UAA is stop).
6. What makes 5.8S rRNA? — **RNA Pol I** (from the 45S precursor).
7. Transcription of tRNA genes? — **RNA Pol III**.
8. Signal for rho-independent termination? — **GC-rich hairpin + U-stretch**.
9. At which site does the prokaryotic initiator tRNA sit? — **P site**.
10. What is called the second genetic code? — **The specificity of aminoacyl-tRNA synthetase**.
11. Gene for permease in the lac operon? — **lacY**.
12. lac operon when both glucose and lactose are present? — **Nearly off** (cAMP low, CAP not active).
13. Effect of an i⁻ mutant? — **Constitutive expression** (repressor inactive).
14. Co-repressor in the trp operon? — **Tryptophan**.
15. Why is attenuation possible only in prokaryotes? — **Coupling of transcription and translation**.
16. Effect of histone acetylation? — **Chromatin loosens, gene active**.
17. Basis of Prader-Willi syndrome? — **Genomic imprinting** (deletion of paternal 15q11–13).
18. What fraction of the human genome is protein-coding? — **Less than 2%**.

**For more depth (English):** [Molecular biology — DNA to protein](/interview/bpsc-tre/class-11-12-zoology/cell-genetics/molecular-biology-dna-to-protein) · [Gene regulation, mutation and cancer genetics](/interview/bpsc-tre/class-11-12-zoology/cell-genetics/gene-regulation-mutation-and-cancer-genetics). Next chapter: [Mendel and gene interaction](/interview/up-pgt/jeev-vigyan/jantu-3/mendel-aur-jeen-antarkriya).
