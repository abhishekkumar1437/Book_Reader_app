---
title: Biotechnology — Principles and Tools
part: Biotechnology
summary: Principles of genetic engineering, the first recombinant DNA (Cohen and Boyer), restriction endonucleases as molecular scissors with EcoRI and palindromes, DNA ligase, cloning vectors (pBR322, Ti plasmid, phages, BAC, YAC) and selectable markers, competent hosts and gene transfer methods, agarose gel electrophoresis, PCR and its variants with worked numbers, probes and blotting, bioreactors and downstream processing.
---

This chapter covers NCERT class 12 "Biotechnology: Principles and Processes" and adds B.Sc. molecular-biology details: enzyme naming, vector maps, blue–white screening, PCR maths, qPCR and RT-PCR, Southern blotting and cDNA libraries. TRE 2.0 asked four straight one-liners (gene taxi, biological scissors, PCR, probe) and TRE 1.0 asked about cutting enzymes, quantitative PCR and the main use of rDNA technology.

> **In simple words:** Genetic engineering means cutting a useful gene out of one organism and putting it into another so that the second organism makes the product of that gene — for example, a bacterium making human insulin. For this we need "scissors" (restriction enzymes) to cut DNA, "glue" (ligase) to join it, a "vehicle" (plasmid or virus vector — the "gene taxi") to carry it into a host cell, a host (usually the bacterium *E. coli*), a way to check sizes (gel electrophoresis), a photocopier for DNA (PCR), and big tanks (bioreactors) to grow the cells and collect the product.

## 1. What is biotechnology?

- **Biotechnology** = use of living organisms, cells or enzymes to make products and processes useful to humans. The **European Federation of Biotechnology (EFB)** definition: "the integration of natural science and organisms, cells, parts thereof, and molecular analogues for products and services."
- The word was coined by the Hungarian engineer **Karl Ereky (1919)**.
- **Traditional biotechnology**: curd, bread, wine, beer, vinegar, cheese (fermentation). **Modern biotechnology**: genetic engineering plus bioprocess engineering.
- **Two core techniques** of modern biotechnology (NCERT):
  1. **Genetic engineering** — techniques to alter the chemistry of genetic material (DNA and RNA), introduce it into host organisms and thus change the phenotype.
  2. **Bioprocess engineering** — maintenance of a sterile (contamination-free) environment in chemical engineering processes to enable growth of only the desired microbe/eukaryotic cell in large quantities for making antibiotics, vaccines, enzymes etc.

### Why not just introduce a gene directly?

A piece of foreign DNA put into an organism usually cannot multiply in the progeny cells. It must be **joined to a DNA sequence that has an origin of replication (ori)** — a site where replication starts. Then it can replicate along with the host chromosome or plasmid. Making many identical copies of a template DNA this way is **cloning**.

### The first recombinant DNA

- **Stanley Cohen and Herbert Boyer** made the first recombinant DNA in **1972** (NCERT), published in **1973**. They cut a piece of DNA carrying an **antibiotic-resistance gene** from a plasmid of ***Salmonella typhimurium*** and linked it to a plasmid of *E. coli*. When introduced into *E. coli*, the gene was copied — the **first recombinant DNA molecule and first gene cloning**.
- **Paul Berg (1972)** had earlier joined DNA of SV40 virus and λ phage — first recombinant DNA in vitro; Nobel Prize in Chemistry **1980**. He is often called the **father of genetic engineering**.

## 2. Basic steps of recombinant DNA technology

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <rect x="5" y="20" width="90" height="38" rx="4"/>
  <text x="50" y="36" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">1. Isolate DNA</text>
  <text x="50" y="50" text-anchor="middle" fill="currentColor" stroke="none" font-size="9">(lysozyme, cellulase)</text>
  <rect x="110" y="20" width="95" height="38" rx="4"/>
  <text x="157" y="36" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">2. Cut gene and</text>
  <text x="157" y="50" text-anchor="middle" fill="currentColor" stroke="none" font-size="9">vector (same RE)</text>
  <rect x="220" y="20" width="90" height="38" rx="4"/>
  <text x="265" y="36" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">3. Amplify gene</text>
  <text x="265" y="50" text-anchor="middle" fill="currentColor" stroke="none" font-size="9">(PCR)</text>
  <rect x="325" y="20" width="90" height="38" rx="4"/>
  <text x="370" y="36" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">4. Ligate gene +</text>
  <text x="370" y="50" text-anchor="middle" fill="currentColor" stroke="none" font-size="9">vector → rDNA</text>
  <rect x="325" y="110" width="90" height="38" rx="4"/>
  <text x="370" y="126" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">5. Transfer into</text>
  <text x="370" y="140" text-anchor="middle" fill="currentColor" stroke="none" font-size="9">competent host</text>
  <rect x="200" y="110" width="105" height="38" rx="4"/>
  <text x="252" y="126" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">6. Select recombinants</text>
  <text x="252" y="140" text-anchor="middle" fill="currentColor" stroke="none" font-size="9">(markers, blue–white)</text>
  <rect x="90" y="110" width="95" height="38" rx="4"/>
  <text x="137" y="126" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">7. Grow in</text>
  <text x="137" y="140" text-anchor="middle" fill="currentColor" stroke="none" font-size="9">bioreactor</text>
  <rect x="5" y="110" width="70" height="38" rx="4"/>
  <text x="40" y="126" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">8. Down-</text>
  <text x="40" y="140" text-anchor="middle" fill="currentColor" stroke="none" font-size="9">stream</text>
  <line x1="95" y1="39" x2="110" y2="39"/>
  <line x1="205" y1="39" x2="220" y2="39"/>
  <line x1="310" y1="39" x2="325" y2="39"/>
  <line x1="370" y1="58" x2="370" y2="110"/>
  <line x1="325" y1="129" x2="305" y2="129"/>
  <line x1="200" y1="129" x2="185" y2="129"/>
  <line x1="90" y1="129" x2="75" y2="129"/>
  <text x="210" y="182" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">Product (e.g. human insulin) purified, tested and formulated</text>
</svg>

## 3. Tools of rDNA technology

### 3.1 Restriction enzymes — the "molecular (biological) scissors"

- Discovered when two enzymes that **restricted the growth of bacteriophage in *E. coli*** were isolated in **1963**: one added **methyl groups** to DNA (methylase, protects the bacterium's own DNA), the other **cut DNA** (restriction endonuclease).
- The first restriction endonuclease characterised: ***Hind* II** (from *Haemophilus influenzae*, by **Hamilton Smith, 1970**) — it always cut DNA at a particular point by recognising a specific sequence of **six base pairs** (the **recognition sequence**).
- **Nobel Prize (Physiology or Medicine) 1978**: **Werner Arber, Hamilton Smith and Daniel Nathans** for restriction enzymes.
- More than **900 restriction enzymes** have been isolated from over **230 strains** of bacteria (NCERT).
- They belong to the larger class of **nucleases**: **exonucleases** remove nucleotides from the **ends** of DNA; **endonucleases** cut at **specific positions within** the DNA.

**Naming (EcoRI):**

| Letter | Stands for |
|---|---|
| **E** | Genus — ***Escherichia*** (capital) |
| **co** | Species — ***coli*** |
| **R** | Strain — **RY 13** |
| **I** | Roman numeral — **order of discovery** from that strain (first) |

**Palindromes.** Restriction endonucleases recognise **palindromic nucleotide sequences** — the sequence reads the same on the two strands when read in the same direction (5′ → 3′):

<div class="formula">

5′ — G A A T T C — 3′

3′ — C T T A A G — 5′

**EcoRI** cuts **between G and A** on both strands → staggered cut → single-stranded overhangs (5′-AATT) called **sticky ends**.

</div>

- **Sticky (cohesive) ends** form hydrogen bonds with complementary sticky ends cut by the **same enzyme** — this is what makes rDNA possible.
- Some enzymes (e.g. ***Sma* I**, *Hae* III, *Eco*RV) cut straight across both strands at the same point → **blunt ends**.
- Common examples: **EcoRI** (G^AATTC), **BamHI** (G^GATCC, from *Bacillus amyloliquefaciens*), **HindIII** (A^AGCTT), **PstI**, **SalI**, **PvuI**, **ClaI**, **NotI** (8-bp "rare cutter").

**Worked example (frequency).** A 4-bp recognition site occurs on average once every 4⁴ = **256 bp**; a 6-bp site once every 4⁶ = **4,096 bp**; an 8-bp site once every 4⁸ = **65,536 bp**. That is why 6-bp cutters give convenient fragment sizes for cloning.

> **PYQ:** TRE 2.0 (2023) Q144 asked: "Which enzyme acts as 'biological scissor' in genetic engineering? — (A) Ligase (B) Polymerase (C) Restriction endonuclease." **Official answer: (C) Restriction endonuclease.**

> **PYQ:** TRE 1.0 (2023) Q60 asked: "Which of the following enzymes is used to cut DNA molecules in rDNA technology? — (A) Ligase (B) Ribonuclease (C) Restriction enzymes." **BPSC key (2nd provisional): (C) Restriction enzymes.** Ribonuclease cuts RNA, not DNA; ligase joins DNA.

### 3.2 DNA ligase — the "molecular glue"

- Joins the **sugar–phosphate backbones** of two DNA fragments by forming **phosphodiester bonds** (uses ATP or NAD⁺).
- **T4 DNA ligase** (from phage T4) is the most used; it can join even blunt ends.
- In normal cells ligase joins **Okazaki fragments** during DNA replication.

### 3.3 Other enzymes used

| Enzyme | Job |
|---|---|
| **Alkaline phosphatase** | Removes 5′ phosphate so the cut vector cannot re-close on itself |
| **Reverse transcriptase** | RNA → **complementary DNA (cDNA)**; discovered by **Temin and Baltimore (1970)**; used to make eukaryotic genes without introns |
| **Taq DNA polymerase** | Heat-stable polymerase for PCR (from ***Thermus aquaticus***, a hot-spring bacterium) |
| **Terminal transferase** | Adds tails of nucleotides to DNA ends |
| **Lysozyme** (bacteria), **cellulase** (plants), **chitinase** (fungi) | Break cell walls to release DNA |
| **Ribonuclease** and **protease** | Remove RNA and proteins during DNA isolation |

### 3.4 Cloning vectors — the "gene taxi"

A **vector** is a DNA molecule that carries a foreign DNA fragment into the host cell and replicates there. **Plasmids** (extra-chromosomal, circular, self-replicating DNA of bacteria) and **bacteriophages** are natural vectors. Because a vector "ferries" the gene into the host, the plasmid is popularly called the **"gene taxi"** or vehicle DNA.

**Features required in a cloning vector (NCERT):**

| Feature | Why |
|---|---|
| **Origin of replication (ori)** | Starts replication; also controls the **copy number** of linked DNA — to get many copies, use a vector whose ori supports high copy number |
| **Selectable marker** | Helps identify and eliminate **non-transformants** and select **transformants** — usually genes for resistance to antibiotics like **ampicillin, chloramphenicol, tetracycline or kanamycin** (normal *E. coli* has no resistance) |
| **Cloning sites (recognition sites)** | Preferably **single** recognition sites for commonly used restriction enzymes; more than one site would cut the vector into pieces |
| **Small size** | Easy to handle and introduce |

**pBR322** — the first widely used artificial plasmid vector of *E. coli*:
- Name: **p** = plasmid; **B** and **R** = **Bolivar and Rodriguez** (who built it, 1977); **322** = the number given to distinguish it.
- Size about **4,361 bp**.
- Carries **ori**, **rop** gene (codes for proteins involved in plasmid replication), and two antibiotic-resistance genes: **ampᴿ** (ampicillin) and **tetᴿ** (tetracycline).
- Restriction sites: **BamHI** and **SalI** in **tetᴿ**; **PstI** and **PvuI** in **ampᴿ**; **HindIII, EcoRI, ClaI** and PvuII outside or near them.

**Insertional inactivation (selection of recombinants):**
- If a foreign gene is ligated at the **BamHI** site of **tetᴿ**, the tetracycline resistance is lost. Recombinants grow on **ampicillin** medium but **not on tetracycline**; non-recombinants grow on both. (Replica plating separates them — tedious, so a better method was developed.)
- **Blue–white screening**: the foreign DNA is inserted into the gene for **β-galactosidase (lacZ)**. In presence of a **chromogenic substrate (X-gal)**: **non-recombinant colonies are blue** (enzyme active); **recombinant colonies are colourless/white** (lacZ inactivated). This is the "insertional inactivation of β-galactosidase."

| Vector | Host | Insert size (approx.) | Use |
|---|---|---|---|
| **Plasmid** (pBR322, pUC18/19) | *E. coli* | Up to ~10 kb | Routine cloning; **pUC** carries lacZ for blue–white screening |
| **Bacteriophage λ (lambda)** | *E. coli* | ~20–25 kb | Genomic libraries |
| **Cosmid** (plasmid + λ *cos* sites) | *E. coli* | ~35–45 kb | Large inserts |
| **BAC** (bacterial artificial chromosome, F-plasmid based) | *E. coli* | ~100–300 kb | **Human Genome Project** |
| **YAC** (yeast artificial chromosome) | Yeast | Up to ~1,000 kb (1 Mb) or more | Very large inserts; Human Genome Project |
| **Ti plasmid** of ***Agrobacterium tumefaciens*** | **Dicot plants** | — | Natural "genetic engineer" of plants: it delivers a piece of DNA (**T-DNA**) that transforms normal plant cells into a **tumour (crown gall)** and directs them to make chemicals the pathogen needs. Scientists **disarm** it (remove tumour genes) and use it to deliver useful genes |
| **Ri plasmid** of *Agrobacterium rhizogenes* | Plants | — | Hairy-root disease; used similarly |
| **Retroviruses** (disarmed) | **Animal cells** | — | Retroviruses naturally turn normal cells cancerous; disarmed versions carry desirable genes (used in ADA gene therapy) |
| SV40, adenovirus, baculovirus | Animal/insect cells | — | Expression vectors |

> **PYQ:** TRE 2.0 (2023) Q143 asked: "During 'gene cloning', which is called 'gene taxi'? — (A) Vaccine (B) Plasmid (C) Bacteria." **Official answer: (B) Plasmid.** Bacteria are the **host**, not the taxi.

### 3.5 Competent host and methods of gene transfer

DNA is a **hydrophilic** molecule and cannot pass through cell membranes. Bacterial cells must be made **competent** (able to take up DNA).

| Method | How | Used for |
|---|---|---|
| **Divalent cations (CaCl₂) + heat shock** | Cells treated with **calcium chloride**; incubated with rDNA **on ice**, then briefly at **42 °C**, then back on ice | **Bacteria** (*E. coli*) |
| **Microinjection** | rDNA injected **directly into the nucleus** of an animal cell with a micro-needle | **Animal cells**, eggs (transgenic animals) |
| **Biolistics (gene gun)** | Cells bombarded with high-velocity micro-particles of **gold or tungsten** coated with DNA | **Plants** (especially monocots like rice, maize) |
| **Disarmed pathogen vectors** | *Agrobacterium*, retroviruses infect cells and deliver the gene | Plants, animals |
| **Electroporation** | Brief electric pulse creates temporary pores in membranes | Bacteria, plant protoplasts, animal cells |
| **Liposome-mediated (lipofection)** | DNA enclosed in lipid vesicles | Animal cells |

- **Transformation** = uptake of naked DNA by a cell (first shown by **Griffith, 1928**, with *Streptococcus pneumoniae*). **Transduction** = DNA transfer by a phage. **Transfection** = introducing foreign DNA into eukaryotic cells.

## 4. Isolation and separation of DNA

### Isolation of genetic material

1. Break the cell wall/membrane with enzymes — **lysozyme** (bacteria), **cellulase** (plant cells), **chitinase** (fungi).
2. Remove RNA with **ribonuclease** and proteins with **protease**; other molecules removed by appropriate treatments.
3. Add **chilled ethanol** → purified DNA **precipitates** as a collection of **fine threads** in suspension ("spooling").

### Agarose gel electrophoresis

- Separates DNA fragments by **size**. **Agarose** is a natural polymer extracted from **seaweeds** (red algae).
- DNA is **negatively charged** (phosphate groups), so it moves towards the **anode (positive electrode)** under an electric field.
- The gel acts as a **sieve**: **smaller fragments move farther**. Size is judged against a DNA ladder (marker of known sizes).
- DNA is **stained with ethidium bromide** and seen under **UV light** as **bright orange bands**.
- The required band is cut out of the gel and the DNA extracted — **elution**. Purified fragments are used to construct rDNA.
- **Polyacrylamide gel (PAGE)** separates smaller DNA fragments and **proteins** (SDS-PAGE).

## 5. Polymerase chain reaction (PCR)

- Invented by **Kary Mullis (1983–85)**, Cetus Corporation; **Nobel Prize in Chemistry 1993**.
- PCR **amplifies** (makes millions of copies of) a specific DNA segment **in vitro** — a "DNA photocopier".
- **Ingredients**: template DNA, **two primers** (small chemically synthesised oligonucleotides, ~18–25 nucleotides, complementary to the ends of the target), **thermostable DNA polymerase** (***Taq* polymerase** from *Thermus aquaticus*), the four **deoxynucleotides (dNTPs)**, buffer with **Mg²⁺**. Done in a **thermal cycler**.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <text x="210" y="16" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">One PCR cycle (repeated 25–35 times)</text>
  <line x1="20" y1="45" x2="120" y2="45"/>
  <line x1="20" y1="55" x2="120" y2="55"/>
  <text x="70" y="80" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">Double-stranded DNA</text>
  <line x1="125" y1="50" x2="150" y2="50"/>
  <polygon points="150,46 158,50 150,54" fill="currentColor"/>
  <line x1="165" y1="35" x2="255" y2="35"/>
  <line x1="165" y1="70" x2="255" y2="70"/>
  <text x="210" y="95" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">1. Denaturation ~94–96 °C</text>
  <text x="210" y="108" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">strands separate</text>
  <line x1="260" y1="50" x2="285" y2="50"/>
  <polygon points="285,46 293,50 285,54" fill="currentColor"/>
  <line x1="300" y1="35" x2="400" y2="35"/>
  <line x1="300" y1="70" x2="400" y2="70"/>
  <line x1="300" y1="41" x2="322" y2="41" stroke-width="3"/>
  <line x1="378" y1="64" x2="400" y2="64" stroke-width="3"/>
  <text x="350" y="95" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">2. Annealing ~50–65 °C</text>
  <text x="350" y="108" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">primers bind (thick bars)</text>
  <line x1="300" y1="140" x2="400" y2="140"/>
  <line x1="300" y1="148" x2="400" y2="148" stroke-dasharray="6 3"/>
  <line x1="300" y1="170" x2="400" y2="170"/>
  <line x1="300" y1="178" x2="400" y2="178" stroke-dasharray="6 3"/>
  <text x="200" y="152" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">3. Extension ~72 °C: Taq polymerase</text>
  <text x="200" y="166" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">adds dNTPs → 2 copies (dashed = new)</text>
  <line x1="350" y1="115" x2="350" y2="132"/>
  <polygon points="346,132 350,140 354,132" fill="currentColor"/>
</svg>

| Step | Temperature | What happens |
|---|---|---|
| **1. Denaturation** | **~94–96 °C** | Hydrogen bonds break; the two DNA strands separate |
| **2. Annealing** | **~50–65 °C** (depends on primer; NCERT gives ~40–60 °C) | Primers bind to complementary sequences flanking the target |
| **3. Extension** | **~72 °C** | *Taq* polymerase extends primers using dNTPs, making new strands |

<div class="formula">

**Copies after n cycles = 2ⁿ** (from one double-stranded molecule, ideal efficiency)

10 cycles → 2¹⁰ = **1,024** · 20 cycles → about **1 million** (1,048,576) · 30 cycles → about **1 billion** (1,073,741,824)

NCERT: "the DNA segment can be amplified to approximately **one billion times**, i.e. 10⁹ copies"

</div>

**Worked example.** Starting with 5 molecules, after 12 cycles: 5 × 2¹² = 5 × 4,096 = **20,480 copies**.

**Worked example.** How many cycles to turn 1 molecule into at least 1,000 copies? 2¹⁰ = 1,024, so **10 cycles**.

**Why *Taq*?** It **remains active at the high temperature** of denaturation (it comes from a hot-spring bacterium), so fresh enzyme need not be added after every cycle.

### Variants of PCR

| Type | Purpose |
|---|---|
| **RT-PCR** (reverse-transcription PCR) | Starts from **RNA**: reverse transcriptase makes cDNA, which is then amplified — detects RNA viruses (HIV, SARS-CoV-2) and gene expression |
| **qPCR (real-time / quantitative PCR)** | Measures the amount of DNA **as it is amplified**, cycle by cycle, using fluorescent dyes or probes — **quantification** |
| **qRT-PCR** (quantitative reverse-transcription PCR) | RT-PCR + real-time **quantification** — measures how much RNA (gene expression, viral load) was present; the **COVID-19 test** |
| **Long PCR** | Amplifies long fragments (> 5 kb) using enzyme mixtures with proofreading |
| **Nested PCR, multiplex PCR, hot-start PCR** | Specificity, several targets at once, fewer non-specific products |

> **PYQ:** TRE 1.0 (2023) Q110 asked: "Which of the following types of PCR is used for quantification of amplified DNA? — (A) RT-PCR (B) qRT-PCR (C) Long PCR." **BPSC key (2nd provisional): (B) qRT-PCR.** The "q" stands for **quantitative**; plain RT-PCR only converts RNA into DNA and amplifies it.

> **PYQ:** TRE 2.0 (2023) Q145 asked: "Polymerase chain reaction is concerned with — (A) DNA amplification (B) DNA repairing (C) DNA replication." **Official answer: (A) DNA amplification.** PCR copies DNA by the same chemistry as replication, but the purpose and name in biotechnology is **amplification**; the key does not accept "more than one".

**Uses of PCR:** gene cloning; **early diagnosis** of pathogens (HIV in suspected AIDS patients, mutations in cancer, genetic disorders) when the number of pathogens is still very low and symptoms are absent; **DNA fingerprinting** from tiny forensic samples; prenatal diagnosis; detecting GM material.

## 6. Probes, hybridisation and blotting

- A **probe** is a **single-stranded DNA or RNA segment tagged with a radioactive molecule** (³²P) or a fluorescent dye that **hybridises (base-pairs) with its complementary DNA** in a sample. It is used to find a gene or a mutated gene in a clone or tissue.
- The bound probe is detected by **autoradiography** (X-ray film exposure) — a clone with a mutated gene will not appear on the film because the probe does not have complementarity with it (NCERT).

> **PYQ:** TRE 2.0 (2023) Q146 asked: "DNA or RNA segment tagged with radioactive molecule is called — (A) vector (B) probe (C) clone." **Official answer: (B) probe.**

| Blotting technique | Molecule detected | Probe | Named after / by |
|---|---|---|---|
| **Southern blot** | **DNA** | Labelled DNA/RNA | **Edwin Southern (1975)** |
| **Northern blot** | **RNA** | Labelled DNA/RNA | Named as a pun on "Southern" (Alwine, 1977) |
| **Western blot** | **Protein** | **Antibody** | Towbin (1979); confirmatory test for HIV in the past |
| Eastern blot | Post-translational modifications | Antibody/lectin | — |

> **Memory trick:** "**SNOW DROP**" — write the words one above the other and pair the letters: **S**–**D** (Southern–DNA), **N**–**R** (Northern–RNA), O–O (skip), **W**–**P** (Western–Protein).

## 7. Libraries, sequencing and other tools (B.Sc.)

- **Genomic library** — collection of clones containing the **entire genome** of an organism (includes introns and non-coding DNA).
- **cDNA library** — clones of **cDNA made from mRNA** by reverse transcriptase; contains only **expressed genes, without introns** — useful to make eukaryotic proteins in bacteria (which cannot remove introns).
- **DNA sequencing**: **Sanger's dideoxy (chain-termination) method (1977)** — Frederick Sanger (Nobel 1958 for insulin structure, 1980 for DNA sequencing); Maxam–Gilbert chemical method (1977); now **next-generation sequencing** (Illumina etc.).
- **Human Genome Project** (1990–2003): about **3 × 10⁹ bp**; about 20,000–25,000 genes; BAC and YAC vectors; sequencing method by **Sanger**.
- **Gene editing — CRISPR–Cas9**: **Jennifer Doudna and Emmanuelle Charpentier** (2012); **Nobel Prize in Chemistry 2020**. A guide RNA leads the Cas9 nuclease to a chosen DNA sequence where it cuts; the cell repairs the cut, allowing genes to be knocked out or edited.
- **Monoclonal antibodies** — **hybridoma technique** of **Köhler and Milstein (1975)**; Nobel 1984.

## 8. Obtaining the foreign gene product — bioreactors

- Once the gene is in the host and the host expresses it, the protein is called a **recombinant protein**.
- Cells are grown in a **continuous culture system**: used medium is drained from one side while fresh medium is added from the other, keeping cells in their **logarithmic/exponential phase** for maximum product.
- **Bioreactors**: vessels in which raw materials are biologically converted into specific products. Small-scale cultures cannot give large amounts, so bioreactors of **100–1,000 litres** are used.
- **Stirred-tank bioreactor** — usually cylindrical or with a curved base for mixing; has an **agitator system** (stirrer), an **oxygen delivery system** (sparger), a **foam control system**, a **temperature control** system, a **pH control** system and **sampling ports**. **Sparged stirred-tank bioreactor** — sterile air bubbles sparged through the medium to increase oxygen transfer.
- **Downstream processing**: after biosynthesis, the product is **separated and purified**, then formulated with suitable **preservatives**; strict **quality control** testing and **clinical trials** (for drugs) are required. Downstream processing and quality control vary from product to product.

## Traps and exceptions

- **Restriction endonuclease** = scissors; **ligase** = glue; **plasmid** = gene taxi (vector); **bacterium** = host. TRE 2.0 keys: Q144 (C), Q143 (B).
- **EcoRI**: E = genus, co = species, R = strain RY13, I = first discovered — **not** "R = restriction".
- EcoRI cuts **between G and A** in **GAATTC** → sticky ends; **SmaI** gives **blunt** ends.
- Restriction enzymes recognise **palindromes** — the same sequence 5′ → 3′ on both strands (not the same sequence read backwards on one strand).
- **Exonuclease** cuts from the ends; **endonuclease** cuts inside.
- First rDNA — **Cohen and Boyer (1972)**, *Salmonella typhimurium* plasmid gene into *E. coli*; Paul Berg did in-vitro recombination of SV40 and λ (1972).
- pBR322: **BamHI and SalI inside tetᴿ**; **PstI and PvuI inside ampᴿ**. Insert at BamHI → **tetracycline-sensitive**, ampicillin-resistant recombinants.
- **Blue–white**: **blue = non-recombinant**, **white = recombinant**.
- **Ti plasmid** — *Agrobacterium tumefaciens* (crown gall of **dicots**); disarmed before use.
- **CaCl₂ + heat shock (42 °C)** for bacteria; **microinjection** for animal cells; **gene gun** for plants.
- DNA moves to the **anode (+)**; **smaller** fragments travel **farther**; **ethidium bromide + UV = orange** bands; **agarose from seaweed**.
- PCR **steps and temperatures**: denaturation ~94 °C → annealing ~55 °C → extension ~72 °C. Copies = **2ⁿ**.
- **Taq** polymerase is from ***Thermus aquaticus*** (a bacterium), not from a fungus or virus.
- PCR = **amplification** (TRE 2.0 key A); **qRT-PCR** = quantification (TRE 1.0 key B).
- **Probe** = labelled single-stranded nucleic acid (TRE 2.0 key B); a **clone** is a copy, a **vector** is a carrier.
- **Southern–DNA, Northern–RNA, Western–protein.**

## Quick revision

1. Biotechnology — Karl Ereky (1919); EFB definition.
2. Two core techniques — genetic engineering and bioprocess engineering.
3. First rDNA — **Cohen and Boyer, 1972** (published 1973).
4. Restriction enzymes found in 1963; first characterised — **Hind II** (Smith, 1970).
5. Nobel 1978 — Arber, Smith, Nathans.
6. 900+ restriction enzymes from 230+ bacterial strains.
7. **EcoRI — GAATTC**, cuts G^AATTC, sticky ends.
8. **Ligase** forms phosphodiester bonds; T4 ligase.
9. Vector features — ori, selectable marker, single cloning sites, small size.
10. **pBR322** — Bolivar and Rodriguez; ampᴿ, tetᴿ, ori, rop; ~4.36 kb.
11. Insertional inactivation; blue–white screening with **X-gal**.
12. **Ti plasmid — *Agrobacterium tumefaciens***; disarmed retroviruses for animals.
13. BAC and YAC — large inserts (Human Genome Project).
14. Competent cells — **CaCl₂, ice, 42 °C heat shock**.
15. Gene gun — gold/tungsten particles; microinjection — animal nucleus.
16. DNA precipitated by **chilled ethanol**.
17. Agarose (seaweed); DNA → anode; ethidium bromide → orange under UV; elution.
18. **PCR — Kary Mullis (1983)**; Nobel 1993.
19. PCR steps — denaturation, annealing, extension; *Taq* polymerase.
20. Copies = 2ⁿ; 30 cycles ≈ 10⁹.
21. **qRT-PCR** — quantification; RT-PCR — starts from RNA.
22. **Probe** — radioactively/fluorescently labelled ss DNA/RNA; autoradiography.
23. Southern (DNA), Northern (RNA), Western (protein).
24. Bioreactors 100–1,000 L; stirred-tank and sparged stirred-tank.
25. Downstream processing — separation, purification, formulation, quality control.

## Practice with answers

1. Which enzyme is called "molecular scissors"? — **Restriction endonuclease**.
2. Which enzyme joins DNA fragments? — **DNA ligase** (phosphodiester bonds).
3. What does "R" in EcoRI stand for? — **Strain RY13** of *E. coli*.
4. Write the recognition sequence of EcoRI. — **5′-GAATTC-3′** (palindrome).
5. What are sticky ends? — **Single-stranded overhangs left by staggered cuts that pair with complementary ends**.
6. Which plasmid is called the "gene taxi"? — **Plasmid vector** (TRE 2.0 official answer).
7. In pBR322, which antibiotic resistance is lost if a gene is inserted at the BamHI site? — **Tetracycline resistance**.
8. In blue–white screening, which colonies carry the recombinant plasmid? — **White (colourless) colonies**.
9. Which natural genetic engineer of plants is used as a vector? — ***Agrobacterium tumefaciens*** (Ti plasmid).
10. How are bacterial cells made competent? — **Treatment with CaCl₂ followed by heat shock at 42 °C**.
11. Towards which electrode does DNA move in a gel? — **Anode (positive)** — it is negatively charged.
12. Which dye is used to see DNA bands? — **Ethidium bromide** (orange under UV).
13. Who invented PCR? — **Kary Mullis**.
14. Starting from one DNA molecule, how many copies after 25 PCR cycles? — **2²⁵ ≈ 3.36 × 10⁷ (about 33.5 million)**.
15. Why is *Taq* polymerase used in PCR? — **It is heat-stable and survives denaturation temperatures**.
16. Which PCR measures the amount of target as it amplifies? — **Real-time/quantitative PCR (qPCR; qRT-PCR for RNA)**.
17. What is a probe? — **A labelled single-stranded DNA/RNA that hybridises with its complementary sequence**.
18. Which blotting technique detects proteins? — **Western blot**.
19. A cDNA library lacks what that a genomic library has? — **Introns (and non-expressed DNA)**.
20. What is the typical volume of large-scale bioreactors? — **100–1,000 litres**.

For a class 9–10 overview see [Biotechnology and Applied Biology](/interview/bpsc-tre/class-9-10-science/biology/biotechnology-and-applied-biology); for DNA structure and replication see [Molecular Biology — DNA to Protein](/interview/bpsc-tre/class-11-12-zoology/cell-genetics/molecular-biology-dna-to-protein). Next: [Biotechnology Applications and Ethics](/interview/bpsc-tre/class-11-12-zoology/ecology-applied/biotechnology-applications-and-ethics).
