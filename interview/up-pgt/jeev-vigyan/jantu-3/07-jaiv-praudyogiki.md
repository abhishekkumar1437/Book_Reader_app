---
title: Biotechnology — Principles, Tools, Techniques and Applications
part: Biotechnology
summary: Definition and scope of biotechnology, restriction enzymes, ligase, vectors (pBR322, pUC, cosmid, BAC, YAC, Ti plasmid), introducing DNA into the host, PCR, gel electrophoresis, blotting, sequencing, DNA fingerprinting, CRISPR-Cas9, bioreactors, applications in agriculture and medicine (Bt crops, RNAi, insulin, gene therapy), transgenic animals, tissue culture and somatic hybridisation, GMOs, gene banks, ethical issues, biopiracy and India's regulation (GEAC).
---

This chapter takes Unit 10 "Biotechnology" — **concept and scope, tools and techniques, rDNA technology and applications, tissue culture, somatic hybridisation, GMOs, gene banks and ethical concerns** — from both NCERT Class 12 chapters up to B.Sc./M.Sc. level (CRISPR, NGS, BAC/YAC, types of blotting, India's regulatory framework). The 2026 paper had two questions — on a **transgenic cow used for biopharming** and on **rDNA and industrial microbes** — both in the "integrated explanation" style.

> **In simple words:** In biotechnology, living organisms or their parts are used to make things useful to humans. The core of modern biotechnology is: "cut" a useful gene out of an organism (restriction enzyme), "paste" it into a "vehicle" (plasmid) (ligase), and put it into a bacterium, plant or animal to make it produce that protein — for example, human insulin from bacteria.

## 1. Concept, definition and scope

- The word "**Biotechnology**" — Hungarian engineer **Karl Ereky (1919)**.
- Definition by the **European Federation of Biotechnology (EFB)** (NCERT): "**The integration of natural science and organisms, cells, parts thereof, and molecular analogues for products and services**."
- **Two core principles (NCERT):** (1) **Genetic engineering** — altering the chemistry of genetic material (DNA/RNA) and introducing it into a host, thereby changing the phenotype; (2) **Bioprocess engineering** — growing large quantities of microbes/cells under **aseptic** conditions to make products (antibiotics, vaccines, enzymes).
- **Colour code (popular):** red — medical; green — agriculture; white — industry; blue — marine/aquatic; brown — dry land; gold — bioinformatics.
- **Traditional vs modern:** curd, cheese, wine, vinegar, bread (fermentation) — traditional; rDNA, hybridoma, gene therapy — modern.

### Key events in history

| Year | Event |
|---|---|
| 1970 | **Hamilton Smith** — first specific restriction enzyme **Hind II** (*Haemophilus influenzae*) — NCERT |
| 1972 | **Paul Berg** — first recombinant DNA (SV40 + λ) — Nobel Chemistry 1980 |
| 1972–73 | **Stanley Cohen and Herbert Boyer** — linked an **antibiotic-resistance gene** to a native plasmid of ***Salmonella typhimurium*** to make the first recombinant plasmid, which replicated in *E. coli* (NCERT) |
| 1975 | **Köhler and Milstein** — **hybridoma** → monoclonal antibodies (Nobel 1984); **Edwin Southern** — Southern blotting |
| 1977 | **Sanger** (dideoxy) and **Maxam-Gilbert** (chemical) sequencing |
| 1978 | Nobel — **Arber, Smith, Nathans** (restriction enzymes) |
| 1982–83 | **Humulin** — rDNA human insulin, **Eli Lilly** (Genentech technology) — first rDNA drug approved in 1982 |
| 1983–85 | **Kary Mullis** — **PCR** (Nobel 1993) |
| 1984–85 | **Alec Jeffreys** — **DNA fingerprinting** |
| 1990 | First clinical **gene therapy** — 4-year-old girl, **ADA deficiency** (NCERT) |
| 1994 | **Flavr Savr tomato** — first commercial GM food (USA) |
| 1996 | **Dolly** the sheep — somatic cell nuclear transfer (SCNT), **Ian Wilmut**, Roslin Institute, Scotland |
| 1997 | **Rosie** — first transgenic cow, milk containing human **α-lactalbumin** (2.4 g/L) — NCERT |
| 2002 | **Bt cotton** — the first (and so far the only, a non-food) GM crop approved for commercial cultivation in India |
| 2012 | **Doudna and Charpentier** — CRISPR-Cas9 as a genome-editing tool (Nobel Chemistry **2020**) |

## 2. Tools of recombinant DNA technology

### 2.1 Restriction enzymes — "molecular scissors"

- Bacteria make them to **cut viral (phage) DNA** — "restriction"; they protect their own DNA by methylation through **methylase** (**restriction-modification system**).
- **Nucleases** — **exonucleases** (remove nucleotides from the ends), **endonucleases** (cut at specific positions within). Restriction enzymes are endonucleases.
- **Palindromic recognition sequence** — reads the same on both strands when read 5′→3′, e.g. EcoRI:
  5′-G↓AATTC-3′
  3′-CTTAA↑G-5′
- **Sticky/cohesive ends** — single-stranded overhangs; H-bond with complementary ends → easy to join with **ligase**. EcoRI → 5′ **AATT** overhang. **Blunt ends** — **SmaI (CCC↓GGG)**, **HaeIII (GG↓CC)**, **AluI (AG↓CT)**, **EcoRV (GAT↓ATC)**.
- More than ≈ 900 restriction enzymes, from **over 230 bacterial strains** (NCERT).

**Nomenclature (example EcoRI):**

| Letter | Meaning |
|---|---|
| **E** | Genus — ***Escherichia*** (capital letter) |
| **co** | Species — ***coli*** |
| **R** | Strain — **RY13** |
| **I** | Order of discovery from that strain — **first** (Roman numeral) |

Others: **BamHI** (*Bacillus amyloliquefaciens* H; G↓GATCC), **HindIII** (*Haemophilus influenzae* Rd; A↓AGCTT), **PstI** (*Providencia stuartii*; CTGCA↓G — 3′ overhang), **SalI**, **NotI** (8 bp — "rare cutter").

| Type | Features |
|---|---|
| **Type I** | Random cut far (≈ 1000 bp) from the recognition site; needs ATP and SAM; multi-subunit, with methylase |
| **Type II** | Fixed cut **at or within the recognition site**; needs only **Mg²⁺**; **this is the type used in genetic engineering** |
| **Type III** | Cuts ≈ 25–27 bp away from the recognition site; needs ATP |

**Solved question 1:** On average, how often will an enzyme with a 6-bp recognition sequence cut random DNA? — Once every 4⁶ = **4096 bp**; a 4-bp cutter, 4⁴ = **256 bp**; an 8-bp cutter, 4⁸ = **65,536 bp**.

### 2.2 Other enzymes

| Enzyme | Function |
|---|---|
| **DNA ligase** (T4) | Phosphodiester bond — "molecular glue" |
| **Alkaline phosphatase** | Removes the vector's 5′ phosphates to prevent **self-ligation (recircularisation)** |
| **Reverse transcriptase** | **cDNA** from mRNA — intron-free gene (needed for expression in bacteria) |
| **Terminal transferase** | Homopolymer tails on blunt ends |
| **Taq polymerase** | PCR |
| **Lysozyme / cellulase / chitinase** | Break bacterial / plant / fungal cell walls to release DNA; **RNase, protease** — purification; finally DNA is "**spooled**" out with **chilled ethanol** (thread-like precipitate) |

### 2.3 Cloning vectors

**Essential features (NCERT):** (1) **Origin of replication (ori)** — also controls the copy number; (2) **Selectable marker** — usually antibiotic resistance (ampicillin, tetracycline, kanamycin, chloramphenicol); (3) **Cloning site** — **a single** recognition site for each restriction enzyme (**MCS — multiple cloning site / polylinker**); (4) small size.

**pBR322** — the first artificial plasmid vector (**Bolivar and Rodriguez**, 1977; name: p = plasmid, B-R = Bolivar-Rodriguez, 322 = serial number); ≈ **4361 bp**; **ori, rop** (copy-number control protein), **ampᴿ, tetᴿ**.
- ***Bam*HI, *Sal*I** — in the **tetᴿ** gene; ***Pst*I, *Pvu*I** — in the **ampᴿ** gene; ***Eco*RI, *Hind*III, *Cla*I, *Pvu*II** etc. are other sites.
- **Insertional inactivation:** insert foreign DNA at the BamHI site (in tetᴿ) → recombinant cells **grow on ampicillin but not on tetracycline**; non-recombinants grow on both → identified by **replica plating**.

**Blue-white screening** — pUC vectors; MCS within **lacZα** (fragment of β-galactosidase); chromogenic substrate **X-gal** + inducer IPTG: non-recombinant → enzyme active → **blue** colony; recombinant → lacZα inactivated → **white (colourless)** colony. (Done on a single plate — simpler than replica plating.)

| Vector | Foreign DNA capacity (approx.) | Note |
|---|---|---|
| Plasmid (pBR322, pUC) | 0.1–10 kb | Simplest |
| **λ (lambda) phage** vector | ≈ 5–25 kb | Replacement vector; packaging |
| **Cosmid** | ≈ 35–45 kb | Plasmid + **cos sites** of λ |
| **BAC (bacterial artificial chromosome)** | ≈ 100–300 kb | Based on F plasmid; **main vector of the HGP** (stable) |
| **YAC (yeast artificial chromosome)** | ≈ 100 kb – over 1 Mb (up to 2–3 Mb) | Centromere, telomeres, ARS; unstable |
| **Ti plasmid** — ***Agrobacterium tumefaciens*** | — | **T-DNA** causes **crown gall** in dicot plants; **disarmed** and used as a vector — "**natural genetic engineer of plants**"; **Ri** plasmid (*A. rhizogenes*) — "hairy root" |
| **Retrovirus, adenovirus, AAV** | — | Animal cells / gene therapy (with pathogenicity removed) |
| **Shuttle vector** | — | Replicates in two hosts (bacterium + yeast) |

### 2.4 Introducing DNA into the host (transformation methods)

- **Chemical competence** — **divalent cation CaCl₂** (pores in the cell wall) → incubation on ice → **heat shock (42°C)** → back on ice (NCERT).
- **Electroporation** — temporary pores made by an electric pulse.
- **Microinjection** — directly into the **nucleus** of an animal cell (transgenic animals).
- **Biolistics / gene gun** — microparticles of **gold or tungsten** coated with DNA (plant cells) — **Sanford**.
- ***Agrobacterium*-mediated**; **disarmed pathogen vectors** (viruses); liposomes (**lipofection**); PEG.

## 3. Major techniques

### 3.1 Polymerase chain reaction (PCR)

- **Kary Mullis (1983/85)**; *in vitro* DNA amplification.
- Components: template DNA, **two primers** (≈ 18–25 nt, complementary to the two ends of the target region), **dNTPs**, **thermostable DNA polymerase**, Mg²⁺, buffer.
- **Taq polymerase** — from the hot-spring bacterium ***Thermus aquaticus*** (Yellowstone; discovered by **Thomas Brock**); no proofreading — so for high fidelity **Pfu** (*Pyrococcus furiosus*) or **Vent** (*Thermococcus litoralis*) is used.

| Step | Temperature | Action |
|---|---|---|
| **Denaturation** | **≈ 94–95°C** | The two strands separate |
| **Annealing** | **≈ 50–65°C** (≈ 5°C below primer Tm) | Primers bind to complementary sequences |
| **Extension** | **72°C** | Taq polymerase synthesises from the 3′ end of the primer |

- Copies after n cycles = **2ⁿ** (ideal case); **30 cycles → 2³⁰ ≈ 10⁹** (≈ 1 billion) copies.
- **Solved question 2:** Starting with 10 copies, 20 cycles → 10 × 2²⁰ = 10 × 1,048,576 ≈ **1.05 × 10⁷** copies.
- Types: **RT-PCR** (RNA → cDNA → amplification; SARS-CoV-2 testing), **qPCR / real-time PCR** (quantification by fluorescence), nested, multiplex.
- Uses: **early diagnosis** of infection (HIV — before symptoms appear), cancer mutations, DNA fingerprinting, foetal sex, ancient DNA, gene cloning.

### 3.2 Gel electrophoresis

- DNA is **negatively charged** (phosphate) → moves towards the **anode (+)** in an electric field.
- Medium — **agarose** (a polymer obtained from marine **red algae** — *Gelidium*, *Gracilaria*; NCERT: "sea weeds"); for proteins and small DNA, **polyacrylamide (PAGE)**; proteins — **SDS-PAGE**.
- **Sieving effect** — **smaller fragments move faster and farther**; compared with a size marker (DNA ladder).
- Staining — **ethidium bromide** (intercalator) → **orange** bands **under UV**; cutting out the band and extracting the DNA = **elution**.
- Large DNA (> 50 kb) — **pulsed-field gel electrophoresis (PFGE)**.

### 3.3 Blotting techniques

| Technique | Molecule | Probe / detection | Invented by |
|---|---|---|---|
| **Southern** | **DNA** | Labelled DNA probe (hybridisation) | **Edwin Southern (1975)** |
| **Northern** | **RNA** | DNA/RNA probe | Alwine et al. (1977) |
| **Western** | **Protein** | **Antibody** | Towbin et al. (1979); HIV confirmatory test |
| **South-Western** | DNA-binding protein | DNA probe | — |

(Only "Southern" is named after a person; Northern and Western are "direction"-based names derived from it.) Steps: electrophoresis → transfer to a **nitrocellulose/nylon membrane** → **hybridisation** with labelled probe → **autoradiography**.
- **ELISA** (enzyme-linked immunosorbent assay) — antigen-antibody reaction; initial HIV screening; **Engvall and Perlmann (1971)**.
- **Microarray / DNA chip** — expression of thousands of genes at once.

### 3.4 DNA sequencing

- **Frederick Sanger — dideoxy chain-termination method (1977)**: **ddNTP** lacks 3′-OH → the next nucleotide cannot be added → fragments of different lengths; four reactions (ddA, ddT, ddG, ddC) → sequence read from the gel. Modern — fluorescent ddNTPs, capillary electrophoresis, automated sequencers. Sanger — **Nobel Chemistry twice (1958 — amino acid sequence of insulin; 1980 — DNA sequencing)**.
- **Maxam-Gilbert (1977)** — chemical cleavage method.
- **Next-generation sequencing (NGS)** — Illumina (sequencing by synthesis), pyrosequencing; third generation — **PacBio, Nanopore** (long reads).
- First completely sequenced genome: **φX174** (Sanger, 1977, ≈ 5386 nt); first bacterium — ***Haemophilus influenzae*** (1995); first eukaryote — **yeast** (1996); first multicellular animal — ***C. elegans*** (1998); first plant — ***Arabidopsis thaliana*** (2000); rice 2002–05 (India also a participant).

### 3.5 DNA fingerprinting (DNA profiling)

- **Alec Jeffreys (1984–85)**, Leicester, UK; basis — **VNTR (variable number tandem repeats)** / **minisatellites** — individual-specific **polymorphism**; today **STR (short tandem repeats / microsatellites)** + PCR.
- **Satellite DNA** — small peaks separate from the main band in density-gradient centrifugation (highly repetitive, non-coding).
- Steps (NCERT): DNA isolation → digestion with restriction enzymes → electrophoresis → **Southern blotting** → hybridisation with labelled VNTR probe → autoradiography.
- Uses: **forensic**, paternity disputes, population and evolution studies, identifying bodies.
- India: **Dr Lalji Singh** (CCMB, Hyderabad) — "**Father of DNA fingerprinting in India**"; **CDFD (Centre for DNA Fingerprinting and Diagnostics), Hyderabad**. First use in India — a paternity case of 1988–89 (Kerala).

### 3.6 Genome editing — CRISPR-Cas9

- **CRISPR** = Clustered Regularly Interspaced Short Palindromic Repeats — the **adaptive immune system** of bacteria and archaea ("memory" fragments of past phage infections — spacers).
- **Cas9** — endonuclease of ***Streptococcus pyogenes***; **guide RNA (sgRNA)** (≈ 20 nt complementary sequence) leads Cas9 to the target DNA; a **PAM sequence (NGG)** immediately after the target is required; Cas9 makes a **double-strand break** → the cell repairs it by **NHEJ** (gene inactivation/knockout) or **HDR** (precise correction from a template).
- **Jennifer Doudna and Emmanuelle Charpentier** — Nobel Chemistry **2020**.
- Earlier tools — **ZFN** (zinc-finger nuclease), **TALEN**; newer — **base editing, prime editing**.
- Applications: first CRISPR therapy for sickle-cell disease and β-thalassaemia (**Casgevy**, approved in the UK and USA in 2023); crop improvement; in India, **SDN-1 and SDN-2 genome-edited plants exempted from GM rules (2022)**, and **in 2025 ICAR released two genome-edited rice varieties ("DRR Dhan 100 Kamala" and "Pusa DST Rice 1")**. Ethical controversy — **He Jiankui (2018)**, China — CRISPR-edited babies.

### 3.7 Bioreactors and downstream processing

- **Bioreactor** — 100–1000 litres (or more) — optimum temperature, pH, O₂, substrate, salts, vitamins; **stirred-tank** — cylindrical/curved base, stirrer, **foam control**, temperature-pH control, sampling ports; **sparged** tank (air bubbles).
- **Downstream processing** — **separation and purification** → adding preservatives → **quality control** and clinical trials (for drugs).

## 4. Applications

### 4.1 Agriculture

**Bt crops:**
- ***Bacillus thuringiensis*** (soil bacterium) makes **Cry proteins** (crystal proteins) — an **inactive protoxin**; it dissolves in the insect's **alkaline gut (pH)** to become the **active toxin** → pores in the membranes of midgut epithelial cells → cells swell and burst → insect dies. The bacterium itself is safe (protoxin form).
- Genes ***cry***: **cryIAc and cryIIAb** — **cotton bollworms** (Lepidoptera); **cryIAb** — **corn borer** (NCERT). cryI — Lepidoptera, cryII — Lepidoptera and Diptera, cryIII — Coleoptera (beetles).
- India: **Bt cotton 2002** (Monsanto-Mahyco; Bollgard I — cry1Ac; Bollgard II, 2006 — cry1Ac + cry2Ab); problem of resistance in the pink bollworm. **Bt brinjal** — after GEAC's recommendation (2009), an **indefinite moratorium in 2010**; commercial in **Bangladesh** since 2013–14.
- **GM mustard DMH-11** (Dhara Mustard Hybrid, **Delhi University, Deepak Pental**; male sterility and fertility restoration through the *barnase–barstar* system) — **GEAC allowed environmental release in October 2022**; the case is in the **Supreme Court** (split verdict in 2024).

**Pest resistance through RNAi (NCERT):** the nematode ***Meloidogyne incognita*** infects tobacco roots → plants made, using an *Agrobacterium* vector, to produce **dsRNA** of nematode-specific genes → silencing of the parasite's mRNA → the parasite cannot survive.

**Other GM plants:** **Golden rice** — β-carotene (vitamin A precursor; daffodil *psy* and bacterial *crtI* genes; Potrykus and Beyer, 2000) — approved in the Philippines in 2021; **Flavr Savr tomato** (**antisense** RNA of polygalacturonase → delayed ripening); herbicide-tolerant (glyphosate — "Roundup Ready" soybean); drought- and salt-tolerant; **phytoremediation**.
- **Benefits of GM crops (NCERT):** tolerance to abiotic stresses (cold, drought, salt, heat); reduced dependence on chemical pesticides; reduced post-harvest losses; efficient mineral use; enhanced nutritional value.

### 4.2 Medicine

**Genetically engineered insulin (NCERT):**
- Insulin — **two chains, A (21 amino acids) and B (30 amino acids)**, linked by **disulphide bonds**; the body makes **pro-insulin** (with an extra **C-peptide**), which is removed during maturation.
- **Eli Lilly (1983)** — prepared DNA sequences for the A and B chains and introduced them **separately** into plasmids of ***E. coli*** → the two chains were made separately → extracted and **joined by disulphide bonds** to form "**Humulin**".
- Earlier, insulin came from the pancreas of cattle and pigs — allergy in some patients.

**Other rDNA products:** human growth hormone (somatotropin), **interferon**, **hepatitis-B vaccine** (HBsAg in yeast — the first rDNA vaccine), **erythropoietin**, tissue plasminogen activator (tPA), factor VIII, **α-1-antitrypsin**.

**Gene therapy:**
- **1990** — a **4-year-old girl**, **ADA (adenosine deaminase) deficiency** — immunodeficiency (SCID); the patient's **lymphocytes** were taken out and cultured → functional ADA cDNA introduced with a **retroviral vector** → returned to the body; since lymphocytes are mortal, it has to be **repeated periodically**; **permanent cure** — ADA gene introduced into **bone-marrow cells** at an early embryonic stage (NCERT).
- Other treatments for ADA deficiency — bone-marrow transplant, **enzyme replacement therapy**.
- **Somatic vs germline** gene therapy — germline is banned in most countries.

**Molecular diagnosis:** PCR, **ELISA**, **autoradiography with a radioactive probe** — the clone carrying the mutated gene does **not** appear on the photographic film (because the probe is not complementary) — NCERT.

### 4.3 Transgenic animals

- Over ≈ **95% of transgenic animals are mice** (NCERT); others — rabbits, pigs, sheep, cows, fish.
- **Uses (NCERT):** (1) study of normal physiology and development (insulin-like growth factor); (2) study of diseases — **models** of cancer, cystic fibrosis, rheumatoid arthritis, Alzheimer's; (3) **biological products** — α-1-antitrypsin (emphysema), proteins for PKU and cystic fibrosis; **Rosie** the cow (1997) — human α-lactalbumin; (4) **vaccine safety testing** — polio vaccine tested on transgenic mice instead of monkeys; (5) **chemical safety/toxicity testing**.
- **Biopharming / molecular farming** — therapeutic proteins in the **milk** (mammary gland as "bioreactor"), eggs or blood of transgenic animals: **ATryn** (human antithrombin, transgenic **goat** — the first such drug, approved in the EU in 2006 and the USA in 2009), **Ruconest** (C1-inhibitor, transgenic rabbit), transgenic sheep **Tracy** (α-1-antitrypsin, PPL, 1990s), transgenic sheep **Polly** (clone carrying the human factor IX gene, 1997). The annual output of a transgenic herd is very large — books often say that **a few transgenic animals (cows/goats) could meet the entire annual world demand for a rare protein (such as factor IX)**.
- India: **NDRI Karnal** — cloned buffalo "**Samrupa**" (2009, lived a few days), "**Garima**" (2010); first cloned **Pashmina goat "Noori"** (SKUAST Kashmir, 2012).

> **PYQ (UP PGT 2026):** What level of therapeutic protein production can a transgenic cow used in biopharming potentially achieve? (A) Absence of any functional or therapeutically useful protein (B) Only enough to treat a single patient (C) A limited quantity with limited clinical use (D) The annual global requirement of a protein such as factor IX for haemophilia therapy. — Reasoned answer (official key not available): **(D)** — the mammary gland can produce gram-level amounts of protein per litre of milk, and a cow gives thousands of litres of milk a year; textbooks give exactly this example.

> **PYQ (UP PGT 2026):** A recombinant construct carrying the human insulin gene is expressed in bacteria, while other microbes are used in fermentation for antibiotics and organic acids. Which explanation links genetic engineering to microbial applications? (A) Bacteria cannot express eukaryotic genes and industrial use depends only on unmodified natural strains (B) Gene introduction occurs by random mutation and industrial microbes function independently of regulated metabolic pathways (C) Plasmids play only a structural role and industrial use is unrelated to gene regulation or metabolism (D) Recombinant DNA enables targeted gene expression in the host, while microbial metabolism is optimised to produce useful compounds. — Reasoned answer (official key not available): **(D)**. The other options are wrong because of absolute words such as "cannot", "only", "independently", "unrelated" (bacteria can make eukaryotic proteins from cDNA — insulin).

## 5. Tissue culture and somatic hybridisation

- **Gottlieb Haberlandt (1902)** — **father** of plant tissue culture (concept; experiments failed); **totipotency** — the ability of a single somatic cell to give rise to a whole plant (term — **Morgan, 1901**); **F. C. Steward (1958)** — whole plant from secondary phloem cells of carrot.
- **MS medium** — **Murashige and Skoog (1962)** — inorganic salts, vitamins, sucrose (carbon source), amino acids, growth regulators (auxin, cytokinin), agar for solidifying; aseptic conditions.
- **Explant** → **callus** (undifferentiated cell mass) → **organogenesis**. **Auxin : cytokinin** — **more auxin → roots**, **more cytokinin → shoots**, equal → callus (**Skoog and Miller, 1957**).
- **Somatic embryogenesis** → **synthetic (artificial) seeds** — somatic embryos encapsulated in **sodium alginate**.
- **Micropropagation** — thousands of genetically identical plants in a short time = **somaclones**; commercial — tomato, banana, apple, orchids. (Genetic variation arising during culture = **somaclonal variation**.)
- **Virus-free plants** — **meristem (shoot-tip) culture** — the apical meristem is usually virus-free (**Morel and Martin, 1952** — dahlia); banana, sugarcane, potato.
- **Anther / pollen culture** → **haploid plants** — **S. Guha and S. C. Maheshwari (1964, Delhi University), *Datura innoxia*** — doubled with colchicine to obtain **homozygous pure lines** quickly.
- **Embryo rescue** — embryos of distant hybrids that would otherwise die due to endosperm failure.
- **Somatic hybridisation:** walls of cells of two species removed with **cellulase + pectinase** → **naked protoplasts** → fusion (**PEG** — polyethylene glycol, or **electrofusion**) → **somatic hybrid** → plant raised by culture. Example — **Pomato** = **potato + tomato** (**Melchers, 1978**) — unfortunately it does not have the desired traits of both together (NCERT). Only the cytoplasms mixed, nucleus of one parent = **cybrid** — transfer of CMS.
- **Animal cell culture** — Ross Harrison (1907, frog nerve tissue); **HeLa** cells (1951, Henrietta Lacks — the first immortal human cell line); vaccine production, stem cells, **hybridoma → monoclonal antibodies**.
- **Cloning** — **Dolly (1996)**: nucleus of a **mammary-gland (udder)** cell of a **Finn Dorset** sheep + enucleated egg of a **Scottish Blackface** sheep → embryo placed in a third (surrogate) sheep; one success in 277 attempts; died in 2003 of lung disease.

## 6. GMOs, gene banks, ethical issues and India's regulation

### 6.1 GMOs — benefits and concerns

- **Concerns:** allergies, transfer of antibiotic-resistance marker genes, "super weeds" through **gene flow**, effects on non-target organisms (butterflies, bees), resistance in pests, loss of biodiversity, seed monopoly of a few companies ("**terminator technology**" — GURT), farmer debt.
- **Biosafety** — **Cartagena Protocol on Biosafety** (under the CBD; adopted 2000, in force **2003**) — transboundary movement of living modified organisms (LMOs); India is a party. **Nagoya Protocol** (2010, in force 2014) — access to genetic resources and **benefit-sharing (ABS)**.

### 6.2 India's regulatory framework

| Body | Ministry / basis | Function |
|---|---|---|
| **Rules 1989** | "Rules for the Manufacture, Use, Import, Export and Storage of Hazardous Microorganisms/GMOs and Cells" under the **Environment (Protection) Act, 1986** | Legal basis of GM regulation |
| **GEAC** (Genetic Engineering **Appraisal** Committee; "**Approval**" until 2010) | **Ministry of Environment, Forest and Climate Change (MoEFCC)** | Apex appraisal of **large-scale use, environmental release and field trials** of GMOs; import-export of GM products (NCERT: "makes decisions regarding the validity of GM research and the safety of introducing GM organisms for public services") |
| **RCGM — Review Committee on Genetic Manipulation** | **Department of Biotechnology (DBT)** | Oversees research and limited field trials |
| **IBSC — Institutional Biosafety Committee** | Each institution | At institution level |
| RDAC, SBCC, DLC | — | Advisory, state and district level |
| **FSSAI** | Health Ministry | GM food (draft GM food regulations in 2024–25) |

### 6.3 Bio-patents and biopiracy

- **Biopiracy** — commercial use by multinational companies of a country's bio-resources or **traditional knowledge** without permission/benefit-sharing.
- **Basmati** — patent granted to the American company **RiceTec** in **1997** (Indian basmati × semi-dwarf varieties); claims narrowed after India objected. **27 basmati varieties** recorded in India (NCERT); ≈ 2 lakh rice varieties.
- **Turmeric** (wound healing, US patent 1995 — **CSIR** challenged it and got it revoked in 1997), **neem** (fungicide, European patent — revoked in 2000/2005).
- India: **Traditional Knowledge Digital Library (TKDL, 2001)** — CSIR; **Indian Patent Bill (Second Amendment)** (NCERT); **Biological Diversity Act, 2002** (National Biodiversity Authority, Chennai); **Protection of Plant Varieties and Farmers' Rights Act, 2001**.

### 6.4 Gene banks — ex situ conservation

- **Seed banks** — dry seeds stored long-term at **−18 to −20°C**; **cryopreservation** — gametes, embryos, pollen, tissues in **liquid nitrogen (−196°C)**; **field gene banks**, *in vitro* gene banks.
- **National gene bank — NBPGR (National Bureau of Plant Genetic Resources), New Delhi** — among the largest seed gene banks in the world (≈ 4.5 lakh+ accessions).
- **Svalbard Global Seed Vault** — Norway, Arctic, **2008** — the "**Doomsday vault**".
- Other ICAR bureaus: **NBAGR, Karnal** (animal genetic resources); **NBFGR, Lucknow** (fish genetic resources — **Uttar Pradesh**); **NBAIM, Mau Nath Bhanjan (UP)** (agriculturally important microorganisms); NBAIR, Bengaluru (insects).
- **Other major institutes in Uttar Pradesh (Lucknow):** **CDRI** (Central Drug Research Institute), **NBRI** (National Botanical Research Institute), **CIMAP** (Central Institute of Medicinal and Aromatic Plants), **IITR** (Indian Institute of Toxicology Research), **Birbal Sahni Institute of Palaeosciences (BSIP)**; **IISR Lucknow** (sugarcane), **IIVR Varanasi** (vegetables).
- **CCMB "LaCONES", Hyderabad** — "**frozen zoo**" of endangered animals.

### 6.5 Ethical issues

- Interfering with the genetic "integrity" of organisms; animal welfare (suffering in transgenic animals); human cloning and **germline editing** (designer babies); **privacy** of genetic information, discrimination in insurance and employment; patents and biopiracy; impact on farmers of developing countries; environmental risks.

## Traps and exceptions

- The first restriction enzyme (according to NCERT) is **Hind II** — not EcoRI.
- In EcoRI, "R" = **strain RY13**; "I" = the **first enzyme discovered** (from that strain).
- DNA moves towards the **anode (+)**; smaller fragments go **farther**.
- Insertion at the BamHI site of pBR322 → **tetracycline-sensitive**, ampicillin-resistant.
- In blue-white screening, **white = recombinant**.
- Bt toxin is activated in the **alkaline** gut (not acidic); in the bacterium it exists as an **inactive protoxin**.
- In insulin, the A and B chains were made **separately** (not as pro-insulin).
- Southern — DNA; Northern — RNA; Western — protein ("**SNOW DROP**" — Southern-DNA, Northern-RNA, O, Western-Protein).
- GEAC is under **MoEFCC**, not DBT; RCGM is under DBT.
- Pomato is a **somatic hybrid**, not a sexual hybrid; Dolly is a **nuclear-transfer clone**, not transgenic.
- The Ti plasmid belongs to *A. tumefaciens*; in nature it mostly infects **dicots**.

## Quick revision

1. Word Biotechnology — Karl Ereky (1919).
2. First rDNA — Cohen and Boyer (*S. typhimurium* plasmid); Berg (1972).
3. First restriction enzyme — Hind II (Smith, 1970).
4. EcoRI — G↓AATTC, sticky ends; SmaI — blunt.
5. Type II restriction enzymes — cut at the recognition site.
6. pBR322 — ampᴿ, tetᴿ, ori, rop; BamHI in tetᴿ.
7. Blue-white — lacZα, X-gal; white = recombinant.
8. YAC is the largest vector; BAC — HGP.
9. CaCl₂ + heat shock 42°C — bacterial competence.
10. Gene gun — gold/tungsten particles.
11. PCR — Mullis; 94 → 55 → 72°C; Taq — *Thermus aquaticus*.
12. 30 cycles ≈ 10⁹ copies.
13. Agarose — seaweed; EtBr — orange under UV.
14. Southern blot — Edwin Southern (1975).
15. Sanger — ddNTP; two Nobels (1958, 1980).
16. DNA fingerprinting — Jeffreys; VNTR; India — Lalji Singh.
17. CRISPR-Cas9 — Doudna and Charpentier, Nobel 2020; PAM — NGG.
18. Bt — cryIAc, cryIIAb (cotton), cryIAb (maize).
19. Bt cotton in India — 2002; Bt brinjal moratorium — 2010; GM mustard DMH-11 — GEAC 2022.
20. RNAi — *Meloidogyne incognita*, tobacco.
21. Insulin — A (21) and B (30) chains; Eli Lilly 1983.
22. First gene therapy — 1990, ADA deficiency.
23. Rosie the cow — 1997, α-lactalbumin; Dolly — 1996.
24. Father of tissue culture — Haberlandt; MS medium (1962).
25. Pomato — potato + tomato (somatic hybrid).
26. GEAC — MoEFCC; Rules 1989 (under EPA 1986).
27. Cartagena Protocol — biosafety, 2000/2003.
28. NBPGR Delhi; NBFGR Lucknow; Svalbard 2008.

## Practice questions (with answers)

1. What does "co" mean in EcoRI? — **Species *coli***.
2. An enzyme that makes blunt ends? — **SmaI** (CCC↓GGG).
3. After insertion into ampᴿ of pBR322, how are recombinants identified? — **They grow on tetracycline but not on ampicillin**.
4. Colour of recombinant colonies in blue-white screening? — **White** (lacZα inactivated).
5. Vector that carries the largest DNA fragment? — **YAC**.
6. Step of PCR in which primers bind? — **Annealing**.
7. How many copies from one DNA molecule in 5 cycles? — **32** (2⁵).
8. Which DNA fragment stays closest to the well on a gel? — **The largest**.
9. Blotting for detecting RNA? — **Northern**.
10. Basis of DNA fingerprinting? — **VNTR polymorphism**.
11. At what pH is Bt toxin activated? — **Alkaline (insect midgut)**.
12. RNAi protected tobacco from what? — **The nematode *Meloidogyne incognita***.
13. The first gene therapy was for which disease? — **ADA deficiency (SCID)**, 1990.
14. Most common transgenic animals? — **Mice (> 95%)**.
15. Who permits environmental release of GMOs in India? — **GEAC (MoEFCC)**.
16. Who first produced haploid plants by anther culture? — **Guha and Maheshwari (1964), *Datura innoxia***.
17. Chemical used in protoplast fusion? — **PEG (polyethylene glycol)**.
18. Which company got the basmati patent? — **RiceTec (USA), 1997**.
19. In CRISPR-Cas9, Cas9 comes from which bacterium? — ***Streptococcus pyogenes***.
20. Fish genetic resources bureau located in Uttar Pradesh? — **NBFGR, Lucknow**.

**For more depth:** [Biotechnology — principles and tools](/interview/bpsc-tre/class-11-12-zoology/ecology-applied/biotechnology-principles-and-tools) · [Biotechnology — applications and ethics](/interview/bpsc-tre/class-11-12-zoology/ecology-applied/biotechnology-applications-and-ethics). Next chapter: [Organic evolution](/interview/up-pgt/jeev-vigyan/jantu-3/jaiv-vikas).
