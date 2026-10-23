---
title: Gene Regulation, Mutation and Cancer Genetics
part: Molecular Biology
summary: The lac operon (inducible, negative and positive control) and trp operon (repressible, attenuation), eukaryotic gene regulation, mutation types from point mutations to frameshifts, physical and chemical mutagens with their action, DNA repair, transposons, the genetics of cancer — proto-oncogenes, oncogenes, tumour suppressors (Rb, p53), carcinogens and treatment — and DNA fingerprinting with VNTRs.
---

This chapter closes the molecular part of the book: how a gene is switched on and off, how it changes (mutation), what happens when growth-control genes go wrong (cancer), and how the variable repeats in our DNA identify a person (DNA fingerprinting). TRE 2.0 asked the lac operon enzyme, when gene mutation occurs, why cancer cells are killed by radiation and what DNA fingerprinting examines; TRE 1.0 asked the DNA print of a child.

> **In simple words:** A bacterium makes lactose-digesting enzymes only when lactose is present — a repressor protein sits on the DNA "switch" (operator) and blocks the genes until lactose removes it. A **mutation** is a permanent change in DNA — a single letter changed, added or deleted, or a big chromosome change; radiation and chemicals increase mutations. Cancer starts when mutations hit the genes that control cell division: "accelerator" genes get stuck on (oncogenes) and "brake" genes stop working (tumour suppressors). **DNA fingerprinting** compares repeated DNA regions that differ in length from person to person; a child shares about half of its bands with each parent.

## 1. Why genes are regulated

- Not every gene is needed all the time. **Housekeeping (constitutive) genes** are always on (e.g. genes for glycolysis enzymes, ribosomal proteins). **Regulated (inducible or repressible) genes** are switched on or off as needed.
- In a multicellular organism every cell has the same genes, but each cell type expresses a different set — **differential gene expression** makes a neuron different from a liver cell.
- Levels of regulation in eukaryotes (NCERT): (1) **transcriptional** (formation of the primary transcript), (2) **processing** (splicing), (3) **transport** of mRNA from nucleus to cytoplasm, (4) **translational**. Also mRNA stability and protein modification.
- In prokaryotes control is mainly at the **initiation of transcription** — the rate at which RNA polymerase binds the promoter, helped by **activators** and blocked by **repressors**.

## 2. The operon concept and the lac operon

**Operon** — a group of **structural genes** controlled together by one **promoter** and one **operator**, plus a **regulator gene**, giving a **polycistronic mRNA**. Proposed by **François Jacob and Jacques Monod (1961)** from work on *E. coli*; Nobel Prize **1965** (with André Lwoff).

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="10" y1="60" x2="410" y2="60" stroke-width="2"/>
  <rect x="20" y="48" width="40" height="24"/>
  <rect x="80" y="48" width="30" height="24"/>
  <rect x="110" y="48" width="30" height="24"/>
  <rect x="150" y="48" width="90" height="24"/>
  <rect x="240" y="48" width="70" height="24"/>
  <rect x="310" y="48" width="60" height="24"/>
  <text x="36" y="65" fill="currentColor" stroke="none">i</text>
  <text x="89" y="65" fill="currentColor" stroke="none">p</text>
  <text x="120" y="65" fill="currentColor" stroke="none">o</text>
  <text x="191" y="65" fill="currentColor" stroke="none">z</text>
  <text x="271" y="65" fill="currentColor" stroke="none">y</text>
  <text x="336" y="65" fill="currentColor" stroke="none">a</text>
  <text x="14" y="40" fill="currentColor" stroke="none" font-size="10">regulator</text>
  <text x="76" y="40" fill="currentColor" stroke="none" font-size="10">promoter</text>
  <text x="114" y="28" fill="currentColor" stroke="none" font-size="10">operator</text>
  <text x="150" y="40" fill="currentColor" stroke="none" font-size="10">β-galactosidase</text>
  <text x="248" y="40" fill="currentColor" stroke="none" font-size="10">permease</text>
  <text x="308" y="40" fill="currentColor" stroke="none" font-size="10">transacetylase</text>
  <path d="M40 72 v30" stroke-width="1"/>
  <text x="10" y="118" fill="currentColor" stroke="none" font-size="11">repressor protein</text>
  <rect x="112" y="80" width="26" height="18" rx="6"/>
  <text x="104" y="114" fill="currentColor" stroke="none" font-size="10">binds o</text>
  <text x="160" y="100" fill="currentColor" stroke="none" font-size="11">No lactose: repressor on o → OFF</text>
  <text x="160" y="120" fill="currentColor" stroke="none" font-size="11">Lactose binds repressor → it leaves</text>
  <text x="160" y="136" fill="currentColor" stroke="none" font-size="11">→ z, y, a transcribed (ON)</text>
  <text x="10" y="170" fill="currentColor" stroke="none" font-size="11">High glucose → low cAMP → CAP off → weak transcription</text>
  <text x="10" y="188" fill="currentColor" stroke="none" font-size="11">Low glucose + lactose → cAMP–CAP at p → strong</text>
</svg>

<div class="formula">

**Parts of the lac operon (NCERT):**

| Part | Product / role |
|---|---|
| **i gene** (regulator; "i" from inhibitor) | Codes the **repressor protein**; has its own promoter; expressed **constitutively** (all the time) |
| **Promoter (p)** | Binding site of **RNA polymerase** (and CAP site next to it) |
| **Operator (o)** | Binding site of the **repressor**; overlaps the promoter region |
| **z gene** | **β-galactosidase** — **hydrolyses lactose (a disaccharide) into glucose and galactose** |
| **y gene** | **Permease** — increases the permeability of the cell to **β-galactosides** (lets lactose in) |
| **a gene** | **Transacetylase** (thiogalactoside transacetylase) |

</div>

**How it works:**
- **No lactose:** the repressor binds the **operator** and blocks RNA polymerase → **no transcription** (genes off). This is **negative regulation**.
- **Lactose present:** lactose (actually its isomer **allolactose**, made by the few β-galactosidase molecules present) acts as the **inducer** — it binds the repressor, changes its shape (**allosteric** change), and the repressor **falls off** the operator → RNA polymerase transcribes **z, y, a** as **one polycistronic mRNA**.
- When lactose is used up, the free repressor binds the operator again. So the lac operon is an **inducible operon** (typical of **catabolic** pathways).
- **IPTG** (isopropyl thiogalactoside) is a **gratuitous inducer** — induces the operon but is not broken down; used in labs (blue–white screening with X-gal).
- **Positive control (catabolite repression):** when **glucose is low**, **cAMP rises** and binds **CAP (catabolite activator protein, also called CRP)**; cAMP–CAP binds near the promoter and **increases** transcription. When glucose is high, cAMP is low → little transcription even with lactose. So *E. coli* uses glucose first, then lactose — **diauxic growth** (Monod, 1941).

**Regulatory mutants (B.Sc.):**

| Mutant | Effect |
|---|---|
| **i⁻** (no functional repressor) | **Constitutive** — enzymes made even without lactose; recessive (i⁺ on a plasmid restores control — repressor is diffusible, acts **in trans**) |
| **o^c** (operator constitutive) | Repressor cannot bind → constitutive; **cis-dominant** (affects only genes on the same DNA) |
| **i^s** (super-repressor) | Repressor cannot bind inducer → **never induced** |

> **PYQ:** TRE 2.0 (2023) Q138 asked: "During regulation of gene expression (lac operon), which one of the following enzymes brings about hydrolysis of lactose to glucose and galactose? (A) Transacetylase (B) Permease (C) β-galactosidase." **Official answer: (C).**

> **Memory trick:** "**Z**ap lactose, **Y** let it in, **A** add acetyl" — z = β-galactosidase, y = permease, a = transacetylase.

## 3. The trp operon — a repressible operon

- Controls the five genes for **tryptophan synthesis** (*trpE, trpD, trpC, trpB, trpA*) in *E. coli* (Charles Yanofsky studied it).
- The regulator gene *trpR* makes an **inactive aporepressor**. **Tryptophan** (the end product) acts as **co-repressor**: it binds the aporepressor, making it active; the active repressor binds the operator → genes **off**.
- **Low tryptophan:** repressor inactive → genes **on** (the cell makes tryptophan).
- **Repressible operon** — typical of **anabolic** (biosynthetic) pathways; the product shuts down its own synthesis.
- **Attenuation** — a second control in the **leader sequence (trpL)**: when tryptophan is plentiful, ribosomes move quickly over two Trp codons in the leader, and the mRNA forms a **terminator hairpin** that stops transcription early. Possible only because transcription and translation are **coupled** in bacteria.

| Point | lac operon | trp operon |
|---|---|---|
| Pathway | Catabolic (breaks lactose) | Anabolic (makes tryptophan) |
| Type | **Inducible** | **Repressible** |
| Repressor made as | **Active** | **Inactive** (aporepressor) |
| Small molecule | **Inducer** (allolactose) inactivates repressor | **Co-repressor** (tryptophan) activates repressor |
| Default state without the molecule | Off | On |
| Extra control | CAP–cAMP (positive) | Attenuation |

## 4. Gene regulation in eukaryotes (outline)

- **Chromatin level:** tightly packed **heterochromatin** is silent; **histone acetylation** loosens chromatin (activates), **DNA methylation** at CpG sites silences genes (**epigenetics**; X inactivation and **genomic imprinting** use these marks).
- **Transcription level:** many **transcription factors**; **enhancers** (can act thousands of base pairs away, either orientation) and **silencers**; **Britten–Davidson model (1969)** of gene batteries (sensor, integrator, producer genes).
- **Processing level:** **alternative splicing**.
- **Post-transcriptional:** **RNA interference (RNAi)** — small RNAs (siRNA, miRNA) silence matching mRNA (**Fire and Mello, 1998**; Nobel 2006). Used to make **pest-resistant tobacco** against the nematode *Meloidogyne incognita* (NCERT biotech).
- **Developmental control:** **homeotic (Hox) genes** decide body segments (Ed Lewis, Nüsslein-Volhard and Wieschaus — Nobel 1995); mutations give legs in place of antennae (*Antennapedia*) in *Drosophila*.
- **Hormone action:** steroid hormone–receptor complexes act as transcription factors.

## 5. Mutation

**Mutation** — a sudden, heritable change in the genetic material (DNA sequence or chromosome structure/number). Term coined by **Hugo de Vries (1901)**, who proposed the **mutation theory** of evolution from work on the evening primrose ***Oenothera lamarckiana*** (many of his "mutants" were in fact chromosomal changes). **Morgan (1910)** found the first *Drosophila* mutant (white eye).

### Types of mutation

| Basis | Types |
|---|---|
| Origin | **Spontaneous** (natural; about 10⁻⁵–10⁻⁶ per gene per generation) and **induced** (by mutagens) |
| Cell type | **Somatic** (not inherited; may cause cancer) and **germinal** (in gametes — inherited) |
| Extent | **Gene / point mutation** (one or a few bases) and **chromosomal mutation** (structure or number — see [chapter 7](/interview/bpsc-tre/class-11-12-zoology/cell-genetics/chromosomes-linkage-sex-determination-and-disorders)) |
| Direction | **Forward** (wild → mutant) and **reverse / back mutation** (mutant → wild) |
| Effect | Lethal, sub-lethal, **conditional** (e.g. temperature-sensitive), neutral, beneficial |
| Expression | Dominant, recessive |

### Point mutations

<div class="formula">

| Type | Change | Effect on protein | Example |
|---|---|---|---|
| **Substitution — transition** | **Purine ↔ purine** (A ↔ G) or **pyrimidine ↔ pyrimidine** (C ↔ T) | Depends on codon | Most common substitution |
| **Substitution — transversion** | **Purine ↔ pyrimidine** (A or G ↔ C or T) | Depends on codon | Sickle-cell (A → T on DNA) |
| **Silent (same-sense)** | New codon codes the **same amino acid** (usually 3rd base, degeneracy) | None | GAA → GAG (both Glu) |
| **Missense** | Codon now codes a **different amino acid** | Altered protein | **Sickle-cell anaemia**: GAG → GUG, Glu → Val at β6 |
| **Nonsense** | Codon becomes a **stop codon** | **Truncated** protein | UAC (Tyr) → UAA (stop) |
| **Frameshift** | **Insertion or deletion** of one or two bases (not a multiple of 3) | **Reading frame shifts**; all downstream codons change; usually non-functional protein | Caused by acridines; some thalassaemias, Tay–Sachs |
| In-frame insertion/deletion | Three bases added/removed | One amino acid added/lost | **Cystic fibrosis ΔF508** (loss of phenylalanine 508) |

</div>

> **In simple words:** In the sentence "THE CAT SAW THE RAT", changing one letter ("THE BAT SAW THE RAT") changes one word — a **missense** mutation. Removing one letter ("THE ATS AWT HER AT") scrambles everything after it — a **frameshift**.

### When do gene mutations arise?

Most spontaneous gene mutations arise as **errors during DNA replication** — wrong base pairing (for example by **tautomeric shifts** of bases, as Watson and Crick suggested), **slippage** at repeats, and errors not corrected by proofreading. Other spontaneous causes: **depurination** (loss of A or G), **deamination** (C → U; 5-methylcytosine → T), oxidative damage, and **transposon** jumping.

> **PYQ:** TRE 2.0 (2023) Q141 asked: "Gene mutation occurs at the time of — (A) DNA repair (B) DNA replication (C) RNA transcription." **Official answer: (B) DNA replication.** Errors in transcription affect only one RNA copy and are not inherited; repair usually removes changes (though faulty repair can also leave one).

### Mutagens

**Mutagen** — an agent that increases the mutation rate. **H. J. Muller (1927)** first induced mutations with **X-rays** in *Drosophila* (Nobel 1946); **L. J. Stadler (1928)** did the same in barley and maize; **Charlotte Auerbach (1946)** showed **mustard gas** is a chemical mutagen.

<div class="formula">

| Mutagen | Type | How it acts |
|---|---|---|
| **X-rays, γ-rays**, cosmic rays, α and β particles | **Ionising radiation** (physical) | Produce ions and free radicals → **single- and double-strand breaks**, chromosome aberrations |
| **UV light** (about 260 nm — maximum absorption by DNA) | **Non-ionising** (physical) | Joins adjacent pyrimidines into **thymine (pyrimidine) dimers** → distorts helix, blocks replication; causes skin cancer |
| Heat | Physical | Depurination |
| **5-Bromouracil (5-BU)** | **Base analogue** (chemical) | Thymine analogue that sometimes pairs with G → **A–T to G–C transitions** |
| **2-Aminopurine** | Base analogue | Adenine analogue; pairs with C → transitions |
| **Nitrous acid (HNO₂)** | **Deaminating agent** | **Cytosine → uracil**, adenine → hypoxanthine (pairs with C) → transitions |
| Hydroxylamine | Chemical | Modifies cytosine → C–G to T–A transitions |
| **EMS (ethyl methanesulphonate)**, **mustard gas**, nitrosoguanidine, nitrogen mustard | **Alkylating agents** | Add ethyl/methyl groups to bases (especially guanine) → mispairing, depurination |
| **Acridine orange, proflavine, ethidium bromide** | **Intercalating agents** | Slide between stacked base pairs → **insertions/deletions → frameshift** |
| Aflatoxin, benzo(a)pyrene (tobacco smoke) | Chemical | Bulky adducts on DNA |

</div>

- **Ames test** (Bruce **Ames**, 1970s) — screens chemicals for mutagenicity using ***Salmonella typhimurium*** *his⁻* strains; a mutagen raises the number of revertant (*his⁺*) colonies. Most carcinogens are mutagens.
- Mutation in plant breeding — **mutation breeding**: e.g. **mung bean** resistant to yellow mosaic virus and powdery mildew was made by mutation (NCERT); "**Sharbati Sonora**" wheat (from Sonora 64 by γ-rays) and "**Pusa Lerma**".

### DNA repair (B.Sc. outline)

| Repair | What it fixes | Disease when defective |
|---|---|---|
| **Photoreactivation** (photolyase, light-dependent) | Thymine dimers (bacteria, plants; not placental mammals) | — |
| **Nucleotide excision repair** (UvrABC in *E. coli*) | Bulky lesions, thymine dimers | **Xeroderma pigmentosum** — extreme sun sensitivity, skin cancer |
| **Base excision repair** | Single damaged bases (uracil, deaminated bases) | — |
| **Mismatch repair** | Replication errors that escaped proofreading | **Hereditary non-polyposis colon cancer (HNPCC, Lynch syndrome)** |
| **Homologous recombination / NHEJ** | Double-strand breaks | **BRCA1/BRCA2** breast and ovarian cancer; ataxia telangiectasia |

Nobel Prize 2015 (Lindahl, Modrich, Sancar) for DNA repair mechanisms.

### Transposons — "jumping genes"

- Discovered by **Barbara McClintock** in **maize** (Ac–Ds elements, 1940s–1951) — explained spotted/variegated kernels; Nobel Prize **1983**.
- **DNA transposons** ("cut and paste", e.g. bacterial IS elements, Tn elements carrying antibiotic resistance) and **retrotransposons** ("copy and paste" through RNA and reverse transcriptase — **LINEs**, **SINEs** like ***Alu*** repeats, about 10% of human DNA).
- Transposons cause insertion mutations and genome rearrangements; they make up nearly half of the human genome.

### Sources of genetic variation — how they differ

| Source | What changes | Creates new alleles? | When |
|---|---|---|---|
| **Mutation** | DNA sequence itself | **Yes — the only source of new alleles** | Mostly during replication; any time with mutagens |
| **Crossing-over (recombination)** | Combination of alleles on a chromosome | No | Pachytene of meiosis I |
| **Independent assortment** | Combination of whole chromosomes in gametes | No | Metaphase/anaphase I |
| **Random fertilisation** | Combination of two gametes | No | Fertilisation |
| **Transposition** | Position of mobile elements | Can disrupt genes | Any time |

## 6. Cancer genetics

**Cancer** — a disease in which cells **divide uncontrollably** (uncontrolled **mitosis**), **lose contact inhibition** (normal cells stop dividing on touching neighbours), **invade** surrounding tissues and **spread** (**metastasis**) through blood and lymph.

| Point | **Benign tumour** | **Malignant tumour** |
|---|---|---|
| Growth | Slow, stays at the original site | Fast, invasive |
| Capsule | Usually enclosed | Not enclosed |
| Spread | No metastasis | **Metastasis** — most feared property |
| Danger | Little (unless pressing on vital organs) | Life-threatening |

**Types by tissue:** **carcinoma** (epithelial — most common; skin, lung, breast, colon), **sarcoma** (connective tissue, bone, muscle), **leukaemia** (blood-forming cells; "blood cancer"), **lymphoma** (lymphoid tissue), **glioma** (glial cells), melanoma (pigment cells).

### Carcinogens (cancer-causing agents)

| Kind | Examples |
|---|---|
| **Physical** | **Ionising radiation** (X-rays, γ-rays), **UV rays** (skin cancer) |
| **Chemical** | **Tobacco smoke** (benzo(a)pyrene, nitrosamines — lung, mouth cancer), **aflatoxin** (liver), **asbestos** (mesothelioma, lung), **benzene** (leukaemia), vinyl chloride (liver), arsenic (skin) |
| **Biological — oncogenic viruses** | **HPV** (cervical cancer — vaccine available), **hepatitis B and C** (liver cancer), **Epstein–Barr virus** (Burkitt's lymphoma, nasopharyngeal carcinoma), **HTLV-1** (adult T-cell leukaemia), HHV-8 (Kaposi's sarcoma in AIDS), **Rous sarcoma virus** (chicken — Peyton Rous 1911, Nobel 1966) |
| Bacterial | ***Helicobacter pylori*** — stomach cancer |

### Genes involved

<div class="formula">

| Gene class | Normal role | In cancer | Inheritance at cell level | Examples |
|---|---|---|---|---|
| **Proto-oncogenes** (cellular oncogenes, c-onc) | Promote normal cell growth and division ("**accelerator**") | Become **oncogenes** by point mutation, gene amplification, chromosomal translocation or viral insertion → **always on** | **Dominant** — one mutated copy is enough (gain of function) | ***ras*** (point mutation; first human oncogene, bladder cancer, 1982), ***myc*** (translocation t(8;14) in Burkitt's lymphoma), ***erbB2/HER2*** (amplified in breast cancer), ***bcr–abl*** (Philadelphia chromosome, CML), *src* |
| **Tumour-suppressor genes** (anti-oncogenes) | Stop division, repair DNA, trigger apoptosis ("**brake**") | **Both copies lost** → brake fails | **Recessive** at the cell level (loss of function) | ***Rb*** (chromosome 13; **retinoblastoma**), ***p53*** (*TP53*, chromosome 17; "**guardian of the genome**"; mutated in about half of all cancers; Li–Fraumeni syndrome), ***BRCA1*** (chr 17), ***BRCA2*** (chr 13) — breast and ovarian, ***APC*** (colon), *WT1* (Wilms' tumour) |
| DNA repair genes | Fix DNA damage | Mutations accumulate | — | *MLH1, MSH2* (HNPCC), *XP* genes |

</div>

- **Viral oncogenes (v-onc)** — e.g. ***v-src*** of Rous sarcoma virus. **J. Michael Bishop and Harold Varmus (1976)** showed that v-src came from a normal cellular gene (c-src) — proto-oncogenes exist in all normal cells; Nobel **1989**. NCERT: "cellular oncogenes (c-onc) or proto-oncogenes have been identified in normal cells which, when activated under certain conditions, could lead to oncogenic transformation."
- **Knudson's two-hit hypothesis (1971)** from retinoblastoma: inherited cases already carry one mutant *Rb* allele, so one more "hit" in a retinal cell causes cancer (often both eyes, early); sporadic cases need two hits in the same cell (usually one eye, later).
- Cancer is **multi-step** — several mutations accumulate (e.g. colon cancer: APC → ras → p53); this is why risk increases with age.
- Hallmarks: self-sufficiency in growth signals, insensitivity to anti-growth signals, **evading apoptosis**, **limitless replication (telomerase reactivated)**, **angiogenesis** (new blood vessels), **invasion and metastasis**.

### Detection and treatment (NCERT)

- **Detection:** **biopsy** and **histopathology**, blood and bone-marrow tests (leukaemia), **radiography (X-ray), CT (computed tomography), MRI (magnetic resonance imaging)**, PET; **monoclonal antibodies** against cancer-specific antigens; molecular tests for genes (e.g. BRCA) to identify people at risk.
- **Treatment:** **surgery**, **radiotherapy**, **chemotherapy** (drugs; side effects — hair loss, anaemia), and **immunotherapy** — tumour cells evade the immune system, so patients are given **biological response modifiers** such as **α-interferon**, which activate the immune system.
- **Why radiation and chemotherapy work:** they damage DNA and the spindle; **cancer cells divide rapidly**, so they are more sensitive than most normal cells. Normal fast-dividing cells (hair follicles, bone marrow, gut lining) are also harmed — hence the side effects.

> **PYQ:** TRE 2.0 (2023) Q132 asked: "Cancer cells can easily be damaged by radiation than normal cells, because they are — (A) starved on mutation (B) undergoing rapid division (C) different in structure." **Official answer: (B).**

> **PYQ:** TRE 2.0 (2023) Q118 asked: "Cancer is caused by — (A) rupturing of cells (B) uncontrolled meiosis (C) uncontrolled mitosis." **Official answer: (C).** Cancer and public health are covered further in [Drugs, Cancer and Public Health](/interview/bpsc-tre/class-11-12-zoology/reproduction-health/drugs-cancer-and-public-health).

## 7. DNA fingerprinting

**DNA fingerprinting (DNA profiling)** compares the **repetitive DNA** of individuals. About 99.9% of DNA is the same in all humans; the differences that are useful lie in **repeated sequences** whose number of copies varies from person to person.

- Developed by **Sir Alec Jeffreys (1984)** at the **University of Leicester**, UK. First used in an immigration dispute (1985) and in the Colin Pitchfork murder case (1986–88), which also cleared an innocent suspect.
- **Satellite DNA** — when DNA is spun in a density gradient, the bulk DNA forms a major peak and repetitive DNA forms small **satellite peaks**. Satellite DNA is classified (by base composition, length of segment and number of repeat units) into **micro-satellites** (repeat units of 1–6 bp — **STRs, short tandem repeats**) and **mini-satellites** (repeat units of about 10–100 bp). These sequences normally **do not code** for proteins but show high **polymorphism**.
- **VNTR (variable number of tandem repeats)** — a mini-satellite whose **copy number varies** between individuals; the size of a VNTR ranges from about **0.1 to 20 kb** (NCERT). Jeffreys used a VNTR as the **probe**.
- **Polymorphism** — variation at the genetic level, arising through mutations (mostly in non-coding DNA, where they are not removed by selection). An inheritable variant present at high frequency in a population is called a polymorphism.

<div class="formula">

**Steps of DNA fingerprinting (NCERT, Southern-blot method):**
1. **Isolation of DNA** (from blood, hair root, semen, saliva, skin cells).
2. **Digestion** of DNA by **restriction endonucleases**.
3. **Separation** of DNA fragments by **agarose gel electrophoresis** (by size).
4. **Transfer (blotting)** of the separated fragments onto synthetic membranes such as **nitrocellulose or nylon** — **Southern blotting** (Edwin Southern, 1975).
5. **Hybridisation** using a labelled (radioactive) **VNTR probe**.
6. **Detection** of the hybridised fragments by **autoradiography** — a pattern of dark **bands** on X-ray film.

Today **PCR** amplifies **STR** loci from tiny samples (DNA from even a single cell can be analysed), and fluorescent capillary electrophoresis reads them.

</div>

**Inheritance of bands:** each person inherits **one copy of each chromosome from each parent**, so roughly **half the bands** in a child's DNA fingerprint come from the **mother** and **half from the father**. Every band in the child must be present in one of the two parents — the basis of **paternity testing**. Only **identical twins** have identical fingerprints.

> **PYQ:** TRE 1.0 (2023) Q64 asked: "The DNA fingerprinting pattern of a child is — (A) exactly similar to that of both of the parents (B) 100% similar to the mother's DNA print (C) 50% bands similar to father and the rest similar to mother." **BPSC key (2nd provisional): (C).**

> **PYQ:** TRE 2.0 (2023) Q142 asked: "What are the differences in the specific regions of DNA sequence called during DNA fingerprinting? (A) Non-repetitive DNA (B) Repetitive DNA (C) Satellite DNA." **Official answer: (B) repetitive DNA.** Satellite DNA is itself a kind of repetitive DNA, so (D) could be argued, but the official answer is (B) — NCERT says DNA fingerprinting "involves identifying differences in some specific regions in DNA sequence called as **repetitive DNA**".

> **PYQ:** TRE 1.0 (2023) Q114 asked: "**Autoantibody** DNA fingerprinting was developed by — (A) Alec Jeffreys (B) A. K. Francoeur (C) R. Erickson." **BPSC key (2nd provisional): (B).** Read the stem: it says *autoantibody* fingerprinting — a different identification method based on each person's unique pattern of **autoantibodies**, described by **Francoeur** in the late 1980s. Ordinary **DNA fingerprinting** was developed by **Alec Jeffreys**. If an exam asks plainly "who developed DNA fingerprinting", answer Jeffreys.

**Applications:** **forensic science** (identifying criminals from blood, semen, hair at crime scenes), **paternity and maternity disputes**, identifying victims of disasters, **immigration** cases, studying **population and evolutionary** relationships (biodiversity, wildlife forensics, pedigree of animals), diagnosis of some genetic disorders.

**In India:** **Dr Lalji Singh** (**Centre for Cellular and Molecular Biology, CCMB, Hyderabad**) developed India's indigenous DNA fingerprinting probe (from the Bkm sequence) in the late 1980s and is called the **father of DNA fingerprinting in India**; the **Centre for DNA Fingerprinting and Diagnostics (CDFD), Hyderabad** carries out forensic DNA work.

Recombinant-DNA tools used here (restriction enzymes, electrophoresis, PCR, probes) are covered in [Biotechnology Principles and Tools](/interview/bpsc-tre/class-11-12-zoology/ecology-applied/biotechnology-principles-and-tools).

## Traps and exceptions

- **z = β-galactosidase, y = permease, a = transacetylase.** The **i gene** (repressor) is **not** part of the polycistronic mRNA and has its own promoter.
- **Inducer of the lac operon is lactose (allolactose)**; IPTG is a gratuitous inducer.
- The lac repressor binds the **operator**, not the promoter; RNA polymerase binds the **promoter**.
- **lac = inducible (catabolic); trp = repressible (anabolic)**; tryptophan is a **co-repressor**.
- **Glucose high → cAMP low** → lac operon weakly expressed even with lactose.
- **Transition = purine ↔ purine or pyrimidine ↔ pyrimidine**; **transversion = purine ↔ pyrimidine**.
- **Frameshift** results from insertion/deletion of bases **not** in multiples of three; **acridines** cause it.
- **UV makes thymine dimers**; X-rays/γ-rays **break** DNA.
- **5-Bromouracil** is a base analogue of **thymine**; **nitrous acid** deaminates.
- Most gene mutations arise during **DNA replication**.
- **Oncogenes act dominantly** (one copy); **tumour-suppressor genes act recessively** (both copies lost).
- **p53** is a **tumour suppressor**, not an oncogene; **ras** is a proto-oncogene.
- Cancer is **uncontrolled mitosis**, not meiosis; radiation hits **rapidly dividing** cells.
- DNA fingerprinting uses **non-coding repetitive DNA (VNTR/STR)**, not genes for proteins.
- A child shares **about 50%** of bands with each parent; only identical twins match completely.
- DNA fingerprinting — **Alec Jeffreys**; "autoantibody fingerprinting" — **Francoeur** (BPSC key).

## Quick revision

1. Operon concept — Jacob and Monod (1961), E. coli; Nobel 1965.
2. lac operon: i (repressor), p, o, z (β-galactosidase), y (permease), a (transacetylase).
3. β-galactosidase hydrolyses lactose → glucose + galactose.
4. Inducer — allolactose (lactose); IPTG gratuitous inducer.
5. Negative control by repressor; positive control by cAMP–CAP.
6. trp operon — repressible; tryptophan co-repressor; attenuation in leader.
7. Eukaryotic control: transcription, processing, transport, translation; enhancers; RNAi.
8. de Vries (1901) — term mutation, Oenothera lamarckiana.
9. Muller (1927) — X-ray mutagenesis in Drosophila; Auerbach (1946) — mustard gas.
10. Transition vs transversion; silent, missense, nonsense, frameshift.
11. Sickle-cell — missense (Glu → Val); CF ΔF508 — in-frame deletion.
12. Gene mutations arise mainly during DNA replication.
13. UV → thymine dimers; X-rays → breaks; 5-BU → transitions; acridines → frameshifts.
14. Ames test — Salmonella his⁻ revertants.
15. Xeroderma pigmentosum — defective nucleotide excision repair.
16. McClintock — transposons in maize; Nobel 1983.
17. Cancer — uncontrolled mitosis, loss of contact inhibition, metastasis.
18. Oncogenic viruses — HPV (cervix), HBV (liver), EBV (Burkitt's lymphoma).
19. Proto-oncogenes (ras, myc) → oncogenes; tumour suppressors Rb and p53.
20. Bishop and Varmus — cellular origin of oncogenes (Nobel 1989).
21. Radiation kills cancer cells because they divide rapidly.
22. α-interferon — biological response modifier in immunotherapy.
23. DNA fingerprinting — Alec Jeffreys (1984); VNTR probe; Southern blot.
24. Steps: isolate → restriction digest → electrophoresis → blot → hybridise → autoradiograph.
25. Child's bands: ~50% from mother, ~50% from father; Lalji Singh — India.

## Practice with answers

1. Which gene of the lac operon codes the repressor? — **i gene** (regulator gene).
2. What is the role of permease? — **Increases the cell's permeability to β-galactosides (lets lactose in)**.
3. What happens to the lac operon when lactose is absent? — **Repressor binds the operator; the genes are switched off**.
4. Name a gratuitous inducer of the lac operon. — **IPTG**.
5. What is the effect of high glucose on the lac operon? — **cAMP falls, CAP is inactive, transcription stays low (catabolite repression)**.
6. Is the trp operon inducible or repressible? — **Repressible**.
7. What is the co-repressor of the trp operon? — **Tryptophan**.
8. Who coined the term mutation? — **Hugo de Vries** (1901).
9. Replacement of a purine by a pyrimidine is called? — **Transversion**.
10. Which mutation creates a premature stop codon? — **Nonsense mutation**.
11. Which mutagen causes thymine dimers? — **UV radiation**.
12. Which chemicals cause frameshift mutations? — **Intercalating agents such as acridine orange and proflavine**.
13. Which disease results from defective repair of UV damage? — **Xeroderma pigmentosum**.
14. Who discovered jumping genes? — **Barbara McClintock** (maize).
15. What is metastasis? — **Spread of cancer cells from the original site to distant parts through blood or lymph**.
16. Which virus causes cervical cancer? — **Human papillomavirus (HPV)**.
17. Is p53 an oncogene or a tumour suppressor? — **Tumour suppressor** ("guardian of the genome").
18. Which chromosome abnormality is linked with chronic myeloid leukaemia? — **Philadelphia chromosome, t(9;22)**.
19. Which DNA sequences are used as probes in DNA fingerprinting? — **VNTRs (mini-satellite repetitive DNA)**.
20. Who is the father of DNA fingerprinting in India? — **Dr Lalji Singh** (CCMB, Hyderabad).
