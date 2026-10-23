---
title: Molecular Biology — DNA to Protein
part: Molecular Biology
summary: The search for the genetic material (Miescher, Griffith, Avery–MacLeod–McCarty, Hershey–Chase, TMV), properties of genetic material, central dogma, semi-conservative replication (Meselson–Stahl) with every enzyme of the replication fork, transcription in prokaryotes and eukaryotes with RNA processing, the genetic code and its features, the mechanism of translation, and the Human Genome Project.
---

Molecular biology gives TRE a steady stream of one-liners: "the enzyme that separates the two strands", "the enzyme affecting replication", "the amino acid coded by the start codon", "a codon contains how many nucleotides". NCERT class 12 "Molecular Basis of Inheritance" is the base; the B.Sc. layer adds the full set of replication enzymes, prokaryote–eukaryote differences, the exceptions to the universal code and the energy cost of translation.

> **In simple words:** DNA holds the instructions. Before a cell divides, DNA is copied — each old strand acts as a template for a new one, so each daughter molecule keeps one old strand (semi-conservative). To use a gene, the cell copies it into messenger RNA (transcription). Ribosomes read the mRNA three letters (one codon) at a time and join the matching amino acids into a protein (translation). AUG starts the message; UAA, UAG and UGA stop it.

## 1. The search for the genetic material

<div class="formula">

| Year | Scientists | Experiment | Conclusion |
|---|---|---|---|
| 1869 | **Friedrich Miescher** | Isolated an acidic phosphorus-rich substance from nuclei of **pus cells** (WBCs) | Called it **"nuclein"** (later nucleic acid; term by Altmann, 1889) |
| 1928 | **Frederick Griffith** | ***Streptococcus pneumoniae*** (pneumococcus) in **mice** — S (smooth, capsulated, virulent) and R (rough, no capsule, harmless) strains | **"Transforming principle"** from heat-killed S changed live R into S — **transformation** |
| 1944 | **Oswald Avery, Colin MacLeod, Maclyn McCarty** | Purified the transforming principle; **proteases and RNase did not stop transformation, DNase did** | The transforming principle is **DNA** |
| 1952 | **Alfred Hershey and Martha Chase** | **T2 bacteriophage** on *E. coli*: one batch labelled with **³²P (DNA)**, another with **³⁵S (protein)**; infection → **blending** → **centrifugation** | ³²P entered bacteria (found in the pellet); ³⁵S stayed outside in the supernatant → **DNA is the genetic material** (unequivocal proof) |
| 1956–57 | **Fraenkel-Conrat and Singer**; Gierer and Schramm | **TMV** reconstitution — RNA of one strain + protein coat of another | Progeny had the type of the **RNA** donor → **RNA is the genetic material in some viruses** |

</div>

**Griffith's four steps (NCERT):**
1. Live **S** strain → mouse **dies**.
2. Live **R** strain → mouse **lives**.
3. **Heat-killed S** → mouse **lives**.
4. **Heat-killed S + live R** → mouse **dies**, and **living S bacteria** are recovered from it.

> **Memory trick:** Hershey–Chase: "**P**hosphorus goes **P**ast the wall (into the cell), **S**ulphur **S**tays outside" — DNA has P but no S; protein has S (in cysteine, methionine) but no P.

### What makes a good genetic material (NCERT)

1. It should be able to **replicate**.
2. It should be **chemically and structurally stable**.
3. It should allow **slow changes (mutation)** needed for evolution.
4. It should be able to **express itself** as Mendelian characters.

**DNA versus RNA as genetic material:**
- **RNA** has a reactive **2′-OH** on ribose → less stable, easily degraded; it is also **catalytic** (ribozymes) and mutates faster → good for viruses with short life cycles.
- **DNA** has **thymine** instead of uracil (adds stability — cytosine deamination to uracil can be recognised and repaired) and is **double-stranded** (complementary strand helps repair) → **better for storing** genetic information.
- **RNA was the first genetic material** (**RNA world** hypothesis); DNA evolved from RNA with chemical changes that made it more stable. RNA is better for **transmitting/expressing** information (protein synthesis needs RNA).

### Central dogma

**Francis Crick (1958):** **DNA → (replication) DNA → (transcription) RNA → (translation) protein.** Information flows from nucleic acid to protein, never back from protein.

- **Reverse transcription (RNA → DNA)** — **Howard Temin and David Baltimore (1970)** discovered **reverse transcriptase** in retroviruses (Nobel 1975 with Dulbecco) — "**central dogma reverse**" or **teminism**. Examples: HIV, Rous sarcoma virus.
- **RNA replication (RNA → RNA)** — by RNA-dependent RNA polymerase in RNA viruses (influenza, polio).

## 2. DNA replication

### Semi-conservative replication

Watson and Crick (1953) proposed that each strand serves as a template, so each new DNA has **one parental and one new strand** — **semi-conservative**. Alternatives were **conservative** (parent molecule intact; one totally new molecule) and **dispersive** (old and new pieces scattered on both strands).

<div class="formula">

**Meselson and Stahl (1958):**
- Grew ***E. coli*** for many generations in a medium with **¹⁵NH₄Cl** (heavy nitrogen) as the only N source → all DNA became **heavy (¹⁵N/¹⁵N)**.
- Transferred to **¹⁴NH₄Cl** (light) and took samples every **20 minutes** (one generation).
- Separated DNA by **caesium chloride (CsCl) density-gradient centrifugation**.

| Generation in ¹⁴N | Time | DNA bands |
|---|---|---|
| 0 | 0 min | All **heavy** (¹⁵N–¹⁵N) |
| 1 | 20 min | All **hybrid / intermediate** (¹⁵N–¹⁴N) |
| 2 | 40 min | **1 hybrid : 1 light** (50% each) |
| 3 | 60 min | 1 hybrid : 3 light (25% hybrid) |
| n | — | Hybrid fraction = **2 / 2ⁿ = 1/2ⁿ⁻¹** (only 2 hybrid molecules ever exist per original molecule) |

The single intermediate band in generation 1 **ruled out conservative** replication; the separate hybrid and light bands in generation 2 **ruled out dispersive** replication.

</div>

- **J. Herbert Taylor (1958)** showed semi-conservative replication of chromosomes in ***Vicia faba*** (broad bean) root tips using **radioactive (tritiated) thymidine**.

**Worked problem.** A single ¹⁵N DNA molecule replicates **4 times** in ¹⁴N medium. Total molecules = 2⁴ = 16. Hybrid molecules = **2**; light molecules = **14**; heavy = **0**. Hybrid fraction = 2/16 = **12.5%**.

### The replication fork and its enzymes

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="20" y1="95" x2="150" y2="95" stroke-width="2"/>
  <line x1="20" y1="105" x2="150" y2="105" stroke-width="2"/>
  <path d="M150 95 L330 30" stroke-width="2"/>
  <path d="M150 105 L330 170" stroke-width="2"/>
  <path d="M160 108 L320 165" stroke-dasharray="0" stroke-width="1"/>
  <path d="M172 106 L160 108 L168 117" stroke-width="1"/>
  <path d="M175 85 L215 71" stroke-width="1"/>
  <path d="M225 67 L265 53" stroke-width="1"/>
  <path d="M275 49 L315 35" stroke-width="1"/>
  <path d="M204 70 L215 71 L207 79 M254 52 L265 53 L257 61 M304 34 L315 35 L307 43" stroke-width="1"/>
  <circle cx="152" cy="100" r="7"/>
  <text x="20" y="85" fill="currentColor" stroke="none" font-size="11">parent DNA</text>
  <text x="120" y="130" fill="currentColor" stroke="none" font-size="10">helicase</text>
  <text x="330" y="28" fill="currentColor" stroke="none" font-size="11">5′</text>
  <text x="330" y="178" fill="currentColor" stroke="none" font-size="11">3′</text>
  <text x="200" y="152" fill="currentColor" stroke="none" font-size="11">leading strand (continuous)</text>
  <text x="196" y="36" fill="currentColor" stroke="none" font-size="11">lagging strand</text>
  <text x="196" y="50" fill="currentColor" stroke="none" font-size="10">Okazaki fragments</text>
  <text x="20" y="160" fill="currentColor" stroke="none" font-size="10">Fork moves ←</text>
  <text x="20" y="190" fill="currentColor" stroke="none" font-size="11">New strands always grow 5′ → 3′; ligase joins fragments</text>
</svg>

<div class="formula">

| Enzyme / protein | Job |
|---|---|
| **Initiator proteins** (DnaA in *E. coli*) | Recognise the **origin of replication (ori)** and open it |
| **Helicase** (DnaB in *E. coli*) | **Unwinds the double helix — separates the two strands** by breaking hydrogen bonds; uses ATP |
| **Single-strand binding (SSB) proteins** | Keep separated strands apart, prevent re-pairing |
| **Topoisomerase / DNA gyrase** | **Relieves supercoiling (tension)** ahead of the fork by cutting and rejoining DNA. **Gyrase** = bacterial type II topoisomerase (cuts both strands; blocked by **nalidixic acid / ciprofloxacin**). Type I cuts one strand |
| **Primase** (DnaG) | Makes a short **RNA primer** (about 10 nucleotides) — DNA polymerase cannot start a new chain, it can only extend a 3′-OH |
| **DNA polymerase III** | **Main replicating enzyme in *E. coli*** — adds deoxynucleotides at the 3′ end (**5′→3′ synthesis**); also 3′→5′ proofreading exonuclease |
| **DNA polymerase I** (discovered by **Arthur Kornberg, 1956**; Nobel 1959) | **Removes RNA primers** (5′→3′ exonuclease) and **fills the gaps** with DNA; also repair |
| DNA polymerase II | DNA repair |
| **DNA ligase** | **Joins Okazaki fragments** — seals the nick by a phosphodiester bond ("molecular glue"; uses NAD⁺ in *E. coli*, ATP in eukaryotes) |
| **Telomerase** (eukaryotes) | A reverse transcriptase carrying its own RNA template; extends telomeres (**Blackburn, Greider, Szostak — Nobel 2009**) |

</div>

> **PYQ:** TRE 1.0 (2023) Q56 asked: "Which of the following enzymes separates the two strands of DNA during replication? (A) DNA polymerase (B) Helicase (C) Gyrase." **BPSC key (2nd provisional): (B) helicase.** Gyrase removes the twists (supercoils) caused by unwinding; it does not separate the strands.

> **PYQ:** TRE 1.0 (2023) Q46 asked: "The process of DNA replication is affected by an enzyme known as — (A) ligase (B) polymerase I (C) ribonuclease." **BPSC key (2nd provisional): (B) polymerase I.** Strictly, **DNA ligase** also takes part in replication (joining Okazaki fragments), and in eukaryotes RNase H helps remove primers, so "(D) More than one" can be argued. The key treats "the replication enzyme" as **DNA polymerase**. Note the key, and remember that the main replicative enzyme of *E. coli* is DNA polymerase **III**.

### Key features of replication

- **Origin (ori):** *E. coli* has **one** origin (oriC) and the whole chromosome is one **replicon**; eukaryotes have **many** origins (thousands of replicons) because their DNA is long.
- Replication is usually **bidirectional** from the origin — two forks move in opposite directions (**θ (theta) replication** in circular *E. coli* DNA, Cairns 1963). Some plasmids and phages use **rolling-circle** replication.
- **DNA polymerase works only 5′→3'**. So on the template running **3′→5′** the new strand is made **continuously** — the **leading strand**; on the other template (5′→3′) it is made **discontinuously** in short pieces — the **lagging strand** made of **Okazaki fragments** (Reiji **Okazaki, 1968**; about 1000–2000 nucleotides in bacteria, 100–200 in eukaryotes), later joined by **ligase**.
- **Speed:** *E. coli* (4.6 × 10⁶ bp) replicates in about **18–40 minutes**; NCERT gives an average polymerisation rate of about **2000 bp per second**. Eukaryotic forks are slower (about 50 nucleotides per second).
- **Fidelity:** about one error in 10⁹–10¹⁰ bases, thanks to base pairing, **proofreading** (3′→5′ exonuclease) and mismatch repair.
- In eukaryotes replication occurs in the **S phase** of the cell cycle. **If replication occurs but cell division does not, polyploidy results** (NCERT).
- Eukaryotic DNA polymerases: **α** (with primase — starts), **δ** (lagging strand), **ε** (leading strand), **β** (repair), **γ** (mitochondrial DNA).
- **Deoxyribonucleoside triphosphates (dNTPs)** are both substrates and energy source (two phosphates released as pyrophosphate).

## 3. Transcription — DNA → RNA

**Transcription** = copying genetic information from **one strand** of DNA into RNA. Only a segment (a gene) is copied, and only one strand is used — if both strands were copied, the two RNAs would pair and nothing would be translated, and the same segment would code for two different proteins.

### The transcription unit (NCERT)

- **Promoter** — DNA sequence where **RNA polymerase binds**; located **upstream** (towards the 5′ end of the coding strand). Bacteria: **Pribnow box (TATAAT) at −10** and **TTGACA at −35**. Eukaryotes: **TATA box (Goldberg–Hogness box) at about −25 to −30**, CAAT box, GC box; plus distant **enhancers**.
- **Structural gene** — the part copied.
- **Terminator** — at the **downstream** (3′) end; defines the end of transcription.

**Two strands:**
- **Template (antisense) strand** — polarity **3′→5′**; actually read by RNA polymerase.
- **Coding (sense) strand** — polarity **5′→3′**; **same sequence as the RNA** (with T in place of U); by convention all reference points and gene sequences are written using the coding strand.

**Worked example.** Template strand 3′-**TAC AAA GGC ATT**-5′ →
- mRNA 5′-**AUG UUU CCG UAA**-3′ (complementary to template, U for T),
- coding strand 5′-ATG TTT CCG TAA-3′ (same as mRNA with T),
- protein: **Met – Phe – Pro – (stop)**.

### Transcription in bacteria

- **One DNA-dependent RNA polymerase** makes all types of RNA (mRNA, tRNA, rRNA).
- Core enzyme (α₂ββ′ω) + **sigma (σ) factor** = holoenzyme. **σ factor recognises the promoter and starts (initiation)**; **rho (ρ) factor** helps **terminate** in ρ-dependent termination (ρ-independent terminators form a GC-rich hairpin followed by U's).
- RNA chain grows **5′→3′**; no primer needed.
- Bacterial mRNA needs **no processing** and is often **polycistronic**; since there is no nuclear envelope, **transcription and translation are coupled** — ribosomes start translating mRNA before transcription ends.

### Transcription in eukaryotes

<div class="formula">

| RNA polymerase | Location | Transcribes |
|---|---|---|
| **RNA polymerase I** | Nucleolus | **rRNAs — 28S, 18S and 5.8S** |
| **RNA polymerase II** | Nucleoplasm | **hnRNA** (precursor of mRNA); most snRNAs, miRNA |
| **RNA polymerase III** | Nucleoplasm | **tRNA, 5S rRNA**, U6 snRNA (some snRNAs) |

</div>

**Processing of hnRNA (heterogeneous nuclear RNA) → mRNA:**
1. **Capping** — an unusual nucleotide, **7-methylguanosine (methyl guanosine triphosphate)**, is added to the **5′ end** (protects mRNA, helps ribosome binding).
2. **Tailing (polyadenylation)** — **200–300 adenylate residues** added at the **3′ end** without a template (by poly-A polymerase).
3. **Splicing** — **introns (intervening sequences) are removed** and **exons (expressed sequences) are joined**, by the **spliceosome** (snRNAs + proteins, snRNPs). Genes with introns are **split genes** — discovered by **Phillip Sharp and Richard Roberts (1977)**, Nobel 1993.
- Fully processed mRNA is transported out of the nucleus to the cytoplasm for translation.
- **Alternative splicing** lets one gene make several proteins (part of why humans have only ~20,000 genes).
- **Introns are a sign of antiquity** (NCERT) — split-gene arrangement represents an ancient feature; **RNA editing** and splicing reflect the RNA world.

| Point | Prokaryotes | Eukaryotes |
|---|---|---|
| RNA polymerases | One | Three (I, II, III) |
| Introns | Usually absent | Present (split genes) |
| Processing | None | Capping, tailing, splicing |
| mRNA | Polycistronic | Monocistronic |
| Coupling | Transcription and translation together | Separate (nucleus, then cytoplasm) |
| Promoter elements | −10 (TATAAT), −35 | TATA box (−25), CAAT, enhancers |

## 4. The genetic code

**Genetic code** — the relationship between the sequence of nucleotides on mRNA and the sequence of amino acids in a protein.

**History:**
- **George Gamow** (a physicist) argued that since there are 4 bases and 20 amino acids, the code must be a **triplet** (4² = 16 is too few; **4³ = 64**).
- **Crick, Brenner and colleagues (1961)** — frameshift experiments with **acridine**-induced mutants of T4 phage proved the code is triplet and read from a fixed point.
- **Marshall Nirenberg and Heinrich Matthaei (1961)** — **cell-free protein synthesis**: synthetic **poly-U** RNA gave **polyphenylalanine** → **UUU = phenylalanine** (first codon cracked).
- **Har Gobind Khorana** — **chemical synthesis** of RNA with defined repeating sequences (copolymers) to work out many codons.
- **Severo Ochoa** — enzyme **polynucleotide phosphorylase** used to make RNA without a template.
- Nobel Prize **1968**: **Holley** (tRNA structure), **Khorana** and **Nirenberg**.

<div class="formula">

**Salient features (NCERT):**
1. **Triplet** — a codon has **3 nucleotides**; **64 codons**: **61 code for amino acids**, **3 are stop codons** (**UAA — ochre, UAG — amber, UGA — opal**) that code for no amino acid.
2. **Unambiguous and specific** — one codon codes for **only one** amino acid.
3. **Degenerate** — most amino acids have **more than one codon** (Leu, Ser, Arg have 6 each). Only **Met (AUG)** and **Trp (UGG)** have a single codon.
4. **Comma-less** — read contiguously, no punctuation between codons.
5. **Non-overlapping** — each base belongs to only one codon (some viruses have overlapping genes).
6. **Nearly universal** — UUU means phenylalanine from bacteria to humans. Exceptions: **mitochondria** (UGA = Trp; AUA = Met; AGA/AGG = stop in vertebrate mitochondria) and some protozoa (ciliates read UAA/UAG as glutamine); *Mycoplasma* reads UGA as Trp.
7. **AUG has dual functions** — codes for **methionine** and acts as the **initiator (start) codon**. In bacteria the initiator tRNA carries **N-formylmethionine (fMet)**; in eukaryotes methionine. (GUG occasionally acts as a start codon in bacteria, still read as fMet.)
8. **Polarity** — read **5′→3′**.

</div>

> **PYQ:** TRE 1.0 (2023) Q51 asked: "The amino acid coded by the start codon for protein synthesis is — (A) methionine (B) tryptophan (C) arginine." **BPSC key (2nd provisional): (A) methionine.**

> **PYQ:** TRE 2.0 (2023) Q139 asked: "A codon contains how many nucleotide(s)? (A) 1 (B) 2 (C) 3." **Official answer: (C) 3.**

> **Memory trick:** Stop codons — "**U A**re **A**way, **U A**re **G**one, **U G**o **A**way" = UAA, UAG, UGA.

**Wobble hypothesis (Crick, 1966):** the **third base** of the codon (5′ base of anticodon) pairs loosely, so one tRNA can read several codons differing only in the third position (e.g. **inosine** in the anticodon pairs with U, C or A). This explains degeneracy and why fewer than 61 tRNAs are needed (about 32 minimum).

**Frameshift illustration (NCERT):** "RAM HAS RED CAP" — inserting one letter (RAM HAS **B**RE DCA P) or deleting one shifts the **reading frame** and garbles everything after it; inserting or deleting **three** letters adds or removes one "word" without changing the rest — proof that the code is triplet and read from a fixed start.

### tRNA — the adaptor

- **Adapter hypothesis** — Crick: a molecule must read the code and carry the amino acid.
- tRNA (**soluble RNA, sRNA**) has a **clover-leaf** 2-D structure (Holley, 1965, yeast alanine tRNA) and an **inverted-L** 3-D shape. Parts: **anticodon loop** (pairs with codon), **amino-acid acceptor end** (3′-**CCA**, amino acid attached to the terminal A), **DHU (D) loop** (binds aminoacyl-tRNA synthetase), **TΨC loop** (binds ribosome), variable loop.
- **Specific tRNA for each amino acid**; a special **initiator tRNA**; **no tRNAs for stop codons**.

## 5. Translation — RNA → protein

<div class="formula">

**Step 1 — Activation / charging (aminoacylation) of tRNA:** amino acid + ATP → aminoacyl-AMP (activated amino acid) → transferred to its tRNA by the specific **aminoacyl-tRNA synthetase** (20 kinds). Two high-energy bonds of ATP are used. "**Charged tRNA**" = aminoacyl-tRNA.

**Step 2 — Initiation:** the **small ribosomal subunit** binds mRNA at the start (in bacteria the **Shine–Dalgarno sequence** AGGAGG pairs with **16S rRNA**; in eukaryotes the small subunit binds the 5′ cap and scans to the first AUG); **initiator tRNA (fMet-tRNA in bacteria)** pairs with **AUG** in the **P site**; the **large subunit** joins. Initiation factors (IF1–3) and **GTP** are needed.

**Step 3 — Elongation:** a charged tRNA whose anticodon matches the next codon enters the **A (aminoacyl) site** (EF-Tu + GTP); **peptidyl transferase** (the **23S rRNA ribozyme** of the large subunit) forms a **peptide bond** between the amino acids at the P and A sites; the ribosome **translocates** one codon towards the 3′ end (EF-G + GTP); the empty tRNA moves to the **E (exit) site** and leaves.

**Step 4 — Termination:** when a **stop codon** reaches the A site, a **release factor** (RF1/RF2/RF3 in bacteria, eRF1 in eukaryotes) binds, the polypeptide is released and the ribosome dissociates.

</div>

- The polypeptide grows from the **N-terminus to the C-terminus**; mRNA is read **5′→3′**.
- **Untranslated regions (UTRs)** are present on mRNA **before the start codon (5′ UTR)** and **after the stop codon (3′ UTR)**; they are needed for efficient translation.
- **Energy:** about **4 high-energy phosphate bonds per peptide bond** (2 from ATP in charging + 1 GTP for entry + 1 GTP for translocation).
- **Polysome** — many ribosomes translating one mRNA at once.
- **The ribosome is a ribozyme** — in bacteria, **23S rRNA** catalyses peptide-bond formation (NCERT).
- **Post-translational modification** — removal of initial Met, signal peptides, glycosylation (ER, Golgi), phosphorylation, disulphide bonds, cutting of pro-proteins (proinsulin → insulin; C-peptide removed).

### Comparison of replication, transcription and translation

| Point | Replication | Transcription | Translation |
|---|---|---|---|
| Template | Both DNA strands | One DNA strand | mRNA |
| Product | DNA | RNA | Protein |
| Main enzyme | DNA polymerase | RNA polymerase | Peptidyl transferase (ribosome) |
| Primer | Needed (RNA) | Not needed | — (initiator tRNA) |
| Monomers | dNTPs | NTPs (ATP, GTP, CTP, UTP) | Amino acids (charged tRNAs) |
| Site (eukaryote) | Nucleus (S phase) | Nucleus | Cytoplasm (ribosomes) |
| Direction of synthesis | 5′→3′ | 5′→3′ | N→C |

## 6. Human Genome Project (HGP)

- Launched **1990**, completed **2003** (draft 2001); coordinated by the US Department of Energy and NIH; partners included the UK (Sanger Centre), Japan, France, Germany, China. Called a **mega project**; associated with the new field of **bioinformatics**. Cost estimate about US $9 per base pair originally (about $3 billion).
- **Methods (NCERT):** (1) **Expressed Sequence Tags (ESTs)** — identifying all genes expressed as RNA; (2) **sequence annotation** — sequencing the whole genome, coding and non-coding, then assigning functions. DNA was cut into fragments, cloned in **BAC (bacterial artificial chromosomes)** and **YAC (yeast artificial chromosomes)** vectors, and sequenced with automated sequencers based on **Frederick Sanger's** method.

<div class="formula">

**Salient features of the human genome (NCERT):**
- About **3164.7 million (≈ 3 × 10⁹) base pairs**.
- Average gene ≈ **3000 bases**; the largest known gene is **dystrophin** at **2.4 million bases**.
- Total genes about **30,000** (NCERT estimate; current estimate about 20,000–21,000 protein-coding genes).
- **99.9%** of nucleotide bases are the **same in all people**.
- Functions are unknown for **over 50%** of discovered genes.
- **Less than 2%** of the genome codes for proteins.
- **Repeated sequences** make up a very large portion; they have no direct coding function but tell us about chromosome structure, dynamics and evolution.
- **Chromosome 1 has the most genes (2968)**; **Y has the fewest (231)**.
- About **1.4 million single-nucleotide polymorphisms (SNPs)** identified.

</div>

Other genomes: *E. coli* 4.6 × 10⁶ bp; bacteriophage **λ** 48,502 bp; **φX174** 5386 nucleotides (single-stranded DNA); first free-living organism sequenced — *Haemophilus influenzae* (1995); first eukaryote — yeast (1996); first animal — *C. elegans* (1998); rice genome (2005).

## Traps and exceptions

- **Griffith** showed transformation but **did not** identify DNA; **Avery–MacLeod–McCarty** did; **Hershey–Chase** gave the clinching proof with phage.
- In Hershey–Chase, **³²P** labels **DNA** and **³⁵S** labels **protein**.
- **TMV and many viruses use RNA** as genetic material (Fraenkel-Conrat).
- Meselson–Stahl used **¹⁵N** (not radioactive — a heavy isotope) and **CsCl** gradient; generation 1 = all hybrid.
- **Helicase separates strands; gyrase removes supercoils; primase makes RNA primer; Pol III replicates (E. coli); Pol I removes primer and fills gaps; ligase joins fragments.**
- **Kornberg discovered Pol I**, which is **not** the main replicative enzyme.
- **DNA polymerase cannot start a chain** — it needs a primer; RNA polymerase can.
- Leading strand is continuous; **lagging strand forms Okazaki fragments**.
- The **template strand is 3′→5′**; the **coding strand** has the same sequence as mRNA.
- **σ factor = initiation**; **ρ factor = termination** in bacteria.
- **RNA polymerase I → rRNA (28S, 18S, 5.8S); II → hnRNA/mRNA; III → tRNA and 5S rRNA.** 5S rRNA is not made by Pol I.
- **Capping at 5′, tailing at 3′.**
- **61 sense codons, 3 stop codons**; AUG is both start and Met. **UGG (Trp) and AUG (Met)** are the only single-codon amino acids.
- The code is **not perfectly universal** — mitochondria read **UGA as Trp**.
- Bacterial initiator amino acid is **N-formylmethionine**.
- Translation proceeds **N→C** on the protein and **5′→3′** on the mRNA.
- **Peptidyl transferase is RNA (23S rRNA)**, not protein.

## Quick revision

1. Miescher (1869) — nuclein from pus cells.
2. Griffith (1928) — transformation in Streptococcus pneumoniae and mice.
3. Avery, MacLeod, McCarty (1944) — transforming principle is DNA.
4. Hershey and Chase (1952) — T2 phage, ³²P and ³⁵S; DNA is genetic material.
5. Fraenkel-Conrat (1956–57) — RNA is genetic material in TMV.
6. Central dogma — Crick 1958; reverse transcriptase — Temin and Baltimore 1970.
7. Meselson and Stahl (1958) — ¹⁵N, CsCl, E. coli; semi-conservative replication.
8. Taylor (1958) — Vicia faba, ³H-thymidine.
9. Helicase unwinds; SSB holds; gyrase relieves supercoils; primase primes.
10. E. coli: Pol III main replicase; Pol I (Kornberg) removes primers; ligase seals.
11. Okazaki fragments on the lagging strand (Okazaki 1968).
12. E. coli replication rate ~2000 bp/s (NCERT).
13. Template strand 3′→5′; coding strand 5′→3′, same as mRNA.
14. Pribnow box TATAAT (−10); TATA box (−25) in eukaryotes.
15. σ factor — initiation; ρ factor — termination.
16. RNA Pol I — 28S, 18S, 5.8S rRNA; Pol II — hnRNA; Pol III — tRNA, 5S rRNA.
17. Capping (7-methylguanosine, 5′), tailing (200–300 A, 3′), splicing (spliceosome).
18. Split genes — Sharp and Roberts 1977.
19. Gamow — triplet idea; Nirenberg — UUU = Phe; Khorana — synthetic RNAs; Nobel 1968 with Holley.
20. 64 codons: 61 sense, 3 stop (UAA, UAG, UGA); AUG = Met + start.
21. Code: triplet, unambiguous, degenerate, comma-less, non-overlapping, nearly universal.
22. Wobble hypothesis — Crick 1966.
23. Translation: charging → initiation → elongation → termination; 23S rRNA is peptidyl transferase.
24. HGP 1990–2003; ~3.16 × 10⁹ bp; dystrophin largest gene; chromosome 1 most genes, Y fewest.

## Practice with answers

1. Who coined the term "nuclein"? — **Friedrich Miescher** (1869).
2. Which strain of pneumococcus is virulent? — **S strain** (smooth, with capsule).
3. Which enzyme stopped transformation in Avery's experiment? — **DNase**.
4. In Hershey–Chase, where was ³⁵S found after centrifugation? — **In the supernatant** (outside the bacteria).
5. What would Meselson–Stahl have seen in generation 1 if replication were conservative? — **Two bands — one heavy and one light** (no hybrid).
6. After 3 generations in ¹⁴N, what fraction of DNA molecules are hybrid? — **1/4 (25%)**.
7. Which enzyme makes the RNA primer? — **Primase**.
8. Which enzyme relieves supercoiling ahead of the fork? — **Topoisomerase (DNA gyrase in bacteria)**.
9. Which enzyme joins Okazaki fragments? — **DNA ligase**.
10. What does telomerase carry inside it? — **Its own RNA template** (it is a reverse transcriptase).
11. Which subunit of bacterial RNA polymerase recognises the promoter? — **Sigma (σ) factor**.
12. Which RNA polymerase makes tRNA? — **RNA polymerase III**.
13. What is added to the 5′ end of hnRNA? — **7-methylguanosine cap**.
14. What are introns? — **Non-coding intervening sequences removed by splicing**.
15. How many codons code for amino acids? — **61**.
16. Which amino acids have only one codon? — **Methionine (AUG) and tryptophan (UGG)**.
17. Who first deciphered a codon (UUU)? — **Nirenberg and Matthaei** (1961).
18. What does UGA code for in human mitochondria? — **Tryptophan** (it is a stop codon in the standard code).
19. Which rRNA acts as peptidyl transferase in bacteria? — **23S rRNA**.
20. Write the mRNA for template 3′-TACGGA-5′. — **5′-AUGCCU-3′** (Met–Pro).
