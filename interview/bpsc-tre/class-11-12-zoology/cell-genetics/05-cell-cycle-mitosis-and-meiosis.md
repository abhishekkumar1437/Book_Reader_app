---
title: Cell Cycle, Mitosis and Meiosis
part: Cell Division
summary: Phases of the cell cycle with timing and DNA content, G0, checkpoints with cyclins and CDKs, every stage of mitosis and cytokinesis, the five sub-stages of prophase I (synapsis in zygotene, crossing-over in pachytene, chiasmata in diplotene), meiosis II, comparison tables, chromosome and DNA counting problems, and gamete counts.
---

Cell division gives TRE some of its easiest marks — if you know the stage names exactly. TRE 1.0 asked what happens in G1, when synapsis occurs and where crossing-over happens; TRE 2.0 repeated crossing-over in pachytene and asked why cancer is "uncontrolled mitosis". NCERT class 11 "Cell Cycle and Cell Division" is the base; the B.Sc. layer adds checkpoints, cyclin–CDK control, the synaptonemal complex and number problems.

> **In simple words:** A cell grows, copies its DNA, checks for mistakes, and then splits. **Mitosis** makes two identical cells with the same number of chromosomes — for growth and repair. **Meiosis** happens only in cells that make gametes (sperm and eggs); it has two divisions and gives four cells with **half** the chromosomes, each slightly different because chromosomes swap pieces (crossing-over) and sort randomly.

See also the class 9–10 summary in [Cell Division, Genetics and Molecular Biology](/interview/bpsc-tre/class-9-10-science/biology/cell-division-genetics-and-molecular-biology).

## 1. The cell cycle — phases and timing

The cell cycle was divided into phases by **Howard and Pelc (1953)** using radioactive phosphorus labelling of bean root-tip cells.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <circle cx="110" cy="100" r="80"/>
  <circle cx="110" cy="100" r="45"/>
  <line x1="110" y1="20" x2="110" y2="55"/>
  <line x1="179" y1="140" x2="149" y2="122"/>
  <line x1="41" y1="140" x2="71" y2="122"/>
  <line x1="148" y1="31" x2="128" y2="60"/>
  <text x="150" y="88" fill="currentColor" stroke="none">G1</text>
  <text x="98" y="165" fill="currentColor" stroke="none">S</text>
  <text x="50" y="96" fill="currentColor" stroke="none">G2</text>
  <text x="112" y="44" fill="currentColor" stroke="none" font-size="10">M</text>
  <text x="80" y="104" fill="currentColor" stroke="none" font-size="10">Interphase</text>
  <path d="M190 100 a80 80 0 0 0 -10 -40" stroke-width="2"/>
  <path d="M180 60 l-2 9 l9 -3" stroke-width="1.5"/>
  <text x="215" y="30" fill="currentColor" stroke="none" font-size="10">G1 — growth, RNA + protein synthesis</text>
  <text x="215" y="55" fill="currentColor" stroke="none" font-size="10">G1/S checkpoint (restriction point)</text>
  <text x="215" y="80" fill="currentColor" stroke="none" font-size="10">S — DNA replication, 2C → 4C</text>
  <text x="215" y="105" fill="currentColor" stroke="none" font-size="10">G2 — tubulin, prepares for M</text>
  <text x="215" y="130" fill="currentColor" stroke="none" font-size="10">G2/M checkpoint</text>
  <text x="215" y="155" fill="currentColor" stroke="none" font-size="10">M — mitosis + cytokinesis</text>
  <text x="215" y="180" fill="currentColor" stroke="none" font-size="10">G0 — exit from cycle (neurons)</text>
</svg>

<div class="formula">

| Phase | What happens | DNA content | Chromosome number |
|---|---|---|---|
| **G1 (Gap 1, post-mitotic gap)** | Cell is **metabolically active and grows**; **RNA and protein synthesis**; organelles increase; decides whether to divide. **No DNA replication.** | **2C** | 2n |
| **S (synthesis)** | **DNA replication**; **histone** synthesis; **centriole duplication** (in the cytoplasm) | **2C → 4C** | **Stays 2n** (each chromosome now has 2 sister chromatids) |
| **G2 (Gap 2, pre-mitotic gap)** | **Proteins for mitosis** made (e.g. **tubulin** for spindle); growth continues; DNA checked for errors | 4C | 2n |
| **M (mitotic phase)** | Karyokinesis (nuclear division) + cytokinesis (cytoplasm division) | 4C → 2C in each daughter | 2n in each daughter |
| **G0 (quiescent stage)** | Cells leave G1 and stop dividing but stay metabolically active; may re-enter if stimulated | 2C | 2n |

</div>

- **Interphase = G1 + S + G2** — the "resting phase" is a misleading name; it is the most active phase metabolically and takes **more than 95%** of the cycle.
- A typical human cell in culture divides about **once in 24 hours** (roughly G1 ~11 h, S ~8 h, G2 ~4 h, **M ~1 h**). **Yeast** completes a cycle in about **90 minutes**. Early embryos divide very fast with almost no G1 and G2.
- **G0 cells:** **neurons**, **cardiac muscle cells** (mostly), mature RBCs (cannot divide at all). Liver cells stay in G0 but re-enter the cycle after injury (regeneration). Lymphocytes re-enter on antigen stimulation.
- In **animal cells** mitosis occurs only in diploid somatic cells; in **plants** both haploid and diploid cells can divide by mitosis (e.g. the haploid gametophyte).

> **PYQ:** TRE 1.0 (2023) Q85 asked: "Which activity takes place during post-mitotic gap phase (G1)? (A) RNA and protein synthesis (B) DNA synthesis (C) Continuation of RNA and protein synthesis." **BPSC key (2nd provisional): (A).** DNA synthesis is the S phase. "Continuation of RNA and protein synthesis" describes **G2** (the pre-mitotic gap), which continues what G1 started.

> **Memory trick:** **G1 = Grow 1st**, **S = Synthesis of DNA**, **G2 = Get ready for mitosis**, **M = Mitosis**, **G0 = Gone out**.

## 2. Control of the cell cycle — checkpoints

| Checkpoint | When | What it checks |
|---|---|---|
| **G1/S checkpoint** (**restriction point R** in mammals; **START** in yeast) | Late G1 | Cell size, nutrients, growth factors, **DNA damage**; once passed, the cell is committed to divide |
| **G2/M checkpoint** | End of G2 | Whether **DNA replication is complete** and undamaged |
| **Spindle assembly (metaphase–anaphase) checkpoint** | Metaphase | Whether **every kinetochore is attached** to spindle fibres; prevents aneuploidy |

**Molecular control (B.Sc.):**
- **Cyclins** (proteins whose amount rises and falls in each cycle — Tim **Hunt**, sea-urchin eggs) bind and activate **cyclin-dependent kinases (CDKs)** (Paul **Nurse**, fission yeast cdc2; Leland **Hartwell**, budding yeast cdc genes). Nobel Prize **2001** to Hartwell, Hunt and Nurse.
- **MPF (maturation/M-phase promoting factor)** = **cyclin B + CDK1 (cdc2)** — drives the cell into mitosis; discovered in frog oocytes (Masui and Markert, 1971).
- G1 cyclin D–CDK4/6 → phosphorylates **Rb protein** → Rb releases **E2F** → S-phase genes switched on.
- **p53** ("guardian of the genome") stops the cycle at G1 if DNA is damaged (through p21, a CDK inhibitor) and triggers **apoptosis** if damage cannot be repaired.
- **Anaphase-promoting complex (APC/C)** destroys **securin** → **separase** cuts **cohesin** → sister chromatids separate.

Loss of these controls → uncontrolled mitosis → **cancer** (see [Gene Regulation, Mutation and Cancer Genetics](/interview/bpsc-tre/class-11-12-zoology/cell-genetics/gene-regulation-mutation-and-cancer-genetics)).

> **PYQ:** TRE 2.0 (2023) Q118 asked: "Cancer is caused by — (A) rupturing of cells (B) uncontrolled meiosis (C) uncontrolled mitosis." **Official answer: (C).** Cancer arises in **somatic** cells, which divide by mitosis; meiosis occurs only in germ cells.

## 3. Mitosis (equational division)

The term **mitosis** was coined by **Walther Flemming (1882)**, who studied it in salamander cells. Number of chromosomes stays the same in the daughter cells (**equational division**). In animals it occurs in somatic cells; it is easiest to study in **onion root tip** (meristem) cells.

### Stages of karyokinesis (NCERT)

<div class="formula">

| Stage | Key events |
|---|---|
| **Prophase** (longest stage of mitosis) | Chromatin **condenses** into visible chromosomes, each with **two sister chromatids** joined at the centromere; **centrosomes** (duplicated in S phase) move to opposite poles and radiate **asters**; spindle starts forming. **By the end: Golgi, ER, nucleolus and nuclear envelope disappear.** |
| **Prometaphase** (B.Sc. term) | Nuclear envelope fragments; **kinetochores** (protein discs on centromeres) attach to spindle microtubules |
| **Metaphase** | Complete breakdown of nuclear envelope; chromosomes are **most condensed** and line up at the equator — the **metaphase plate**; each chromosome's two kinetochores are attached to fibres from opposite poles. **Best stage to study chromosome morphology and count chromosomes** (karyotyping). |
| **Anaphase** (shortest stage) | **Centromeres split**; sister chromatids separate and become **daughter chromosomes**; they move to opposite poles, **centromere first**, arms trailing — shapes **V (metacentric), J/L (submetacentric), I/rod (acrocentric, telocentric)** |
| **Telophase** | Chromosomes reach poles and **decondense** into chromatin; **nuclear envelope, nucleolus, Golgi and ER re-form** — two daughter nuclei |

</div>

> **Memory trick:** "**P**lease **M**eet **A**unty **T**ara" — Prophase, Metaphase, Anaphase, Telophase. "**P**rophase **P**acks, **M**etaphase **M**iddle, **A**naphase **A**part, **T**elophase **T**wo nuclei."

**Spindle fibres (microtubules):**
- **Kinetochore (chromosomal) fibres** — attach to kinetochores; shorten to pull chromatids.
- **Polar (interpolar, continuous) fibres** — from pole to pole, overlap at the middle; lengthen and push poles apart.
- **Astral fibres** — radiate from centrosomes into the cytoplasm (only in animals — **astral** spindle). Higher plants form an **anastral** spindle without centrioles.

### Cytokinesis

- **Animal cells — furrowing (cleavage):** a **contractile ring of actin and myosin** under the membrane forms a furrow that deepens from the **periphery to the centre** (centripetal).
- **Plant cells — cell plate:** Golgi vesicles collect at the equator on the **phragmoplast** and fuse to form the **cell plate**, which grows from the **centre to the periphery** (centrifugal); it becomes the **middle lamella** (calcium pectate).
- If karyokinesis is **not** followed by cytokinesis → **multinucleate** (syncytial) cell — e.g. **liquid endosperm of coconut** (free nuclear division), early *Drosophila* embryo.

### Variants

| Term | Meaning | Example |
|---|---|---|
| **Closed mitosis** | Nuclear envelope **does not** break; spindle forms inside the nucleus | Yeasts, many fungi and protists |
| **Open mitosis** | Envelope breaks down | Animals, plants |
| **Endomitosis** | Chromosomes replicate but nucleus does not divide → **polyploid** cell | Liver cells, tapetum |
| **Endoreduplication** (endoreplication) | Repeated DNA replication without separating chromatids → **polytene chromosomes** | **Salivary glands of *Drosophila* and *Chironomus* larvae** |
| **Amitosis** (direct division; Remak) | Nucleus simply constricts into two, **no spindle, no chromosome condensation** | Macronucleus of ciliates (*Paramecium*), some degenerating or specialised tissues |

**Colchicine** (an alkaloid from *Colchicum autumnale*) prevents spindle microtubule formation, **arresting cells at metaphase**; used to make chromosome preparations and to induce **polyploidy** in plant breeding. **Karyotype preparation:** blood lymphocytes are stimulated with phytohaemagglutinin, arrested with colchicine, swollen with hypotonic KCl, fixed, spread, and stained with **Giemsa (G-banding)**.

**Significance of mitosis:** growth of multicellular organisms; **repair and regeneration** (e.g. skin, gut lining, liver); **asexual reproduction** (unicellular eukaryotes, vegetative propagation); keeps the chromosome number **constant**; restores the **nucleo-cytoplasmic ratio**; meristems keep plants growing throughout life.

## 4. Meiosis (reduction division)

Meiosis was first described by **Edouard Van Beneden (1883)** in the roundworm ***Ascaris*** (Oscar Hertwig had seen it in sea-urchin eggs, 1876); the word "meiosis" was coined by **Farmer and Moore (1905)**. **Weismann (1887)** predicted that a reduction division must exist to keep chromosome number constant.

It happens in **diploid germ (meiocyte) cells** — primary spermatocytes and oocytes in animals; spore mother cells in plants. **One DNA replication (in the preceding S phase) is followed by two nuclear divisions**, giving **four haploid cells**.

### Meiosis I — prophase I has five sub-stages

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <path d="M30 60 q8 -20 16 0 q8 20 16 0" stroke-width="1.2"/>
  <path d="M30 80 q8 20 16 0 q8 -20 16 0" stroke-width="1.2"/>
  <text x="20" y="120" fill="currentColor" stroke="none" font-size="11">Leptotene</text>
  <text x="20" y="135" fill="currentColor" stroke="none" font-size="10">threads</text>
  <line x1="110" y1="55" x2="160" y2="55" stroke-width="2"/>
  <line x1="110" y1="61" x2="160" y2="61" stroke-width="2"/>
  <text x="105" y="120" fill="currentColor" stroke="none" font-size="11">Zygotene</text>
  <text x="105" y="135" fill="currentColor" stroke="none" font-size="10">SYNAPSIS</text>
  <line x1="190" y1="50" x2="240" y2="50"/><line x1="190" y1="55" x2="240" y2="55"/>
  <line x1="190" y1="62" x2="240" y2="62"/><line x1="190" y1="67" x2="240" y2="67"/>
  <text x="185" y="120" fill="currentColor" stroke="none" font-size="11">Pachytene</text>
  <text x="185" y="135" fill="currentColor" stroke="none" font-size="10">CROSSING-OVER</text>
  <path d="M270 45 L300 60 L330 45 M270 50 L300 62 L330 50 M270 75 L300 60 L330 75 M270 70 L300 58 L330 70" stroke-width="1.2"/>
  <text x="270" y="120" fill="currentColor" stroke="none" font-size="11">Diplotene</text>
  <text x="270" y="135" fill="currentColor" stroke="none" font-size="10">CHIASMATA seen</text>
  <path d="M350 48 L380 48 M350 53 L380 53 M350 68 L380 68 M350 73 L380 73" stroke-width="2.5"/>
  <circle cx="380" cy="60" r="3" fill="currentColor"/>
  <text x="345" y="120" fill="currentColor" stroke="none" font-size="11">Diakinesis</text>
  <text x="345" y="135" fill="currentColor" stroke="none" font-size="9">terminalisation</text>
  <text x="20" y="170" fill="currentColor" stroke="none">"Lazy Zebras Pass Dinner Daily" — L, Z, P, Dip, Dia</text>
</svg>

<div class="formula">

| Sub-stage | Meaning of name | Key events |
|---|---|---|
| **Leptotene (leptonema)** | "Thin thread" | Chromosomes become visible as **long thin threads**; chromomeres seen like beads; ends often gather near one side of the nucleus (**bouquet stage** in animals) |
| **Zygotene (zygonema)** | "Paired thread" | **Synapsis** — homologous chromosomes start **pairing**, accompanied by formation of the **synaptonemal complex** (a protein ladder; Montrose **Moses, 1956**). Each pair is a **bivalent** (= **tetrad** of four chromatids) |
| **Pachytene (pachynema)** | "Thick thread" | Bivalents look like tetrads; **recombination nodules** appear; **crossing-over** — exchange of segments between **non-sister chromatids of homologous chromosomes**, catalysed by **recombinase**; longest sub-stage |
| **Diplotene (diplonema)** | "Double thread" | **Synaptonemal complex dissolves**; homologues tend to separate **except at the sites of crossing-over** — these X-shaped points are **chiasmata** (singular chiasma). In oocytes of some vertebrates diplotene can last **months or years** (**dictyotene** arrest in humans); **lampbrush chromosomes** form here in amphibian oocytes |
| **Diakinesis** | "Moving apart" | **Terminalisation of chiasmata** (they slide to the ends); chromosomes fully condensed; spindle assembles; **nucleolus disappears and nuclear envelope breaks down** — transition to metaphase I |

</div>

> **PYQ:** TRE 1.0 (2023) Q86 asked: "Synapsis takes place during — (A) leptotene (B) zygotene (C) pachytene." **BPSC key (2nd provisional): (B) zygotene.**

> **PYQ:** TRE 1.0 (2023) Q53 asked: "Crossing-over occurs between — (A) non-sister chromatids of homologous chromosomes at pachytene stage (B) non-sister chromatids of non-homologous chromosomes at pachytene stage (C) non-sister chromatids of homologous chromosomes at zygotene stage." **BPSC key (2nd provisional): (A).** Both parts must be right: **homologous** chromosomes, **non-sister** chromatids, **pachytene**.

> **PYQ:** TRE 2.0 (2023) Q133 asked: "Crossing-over occurs during — (A) leptotene (B) pachytene (C) diplotene." **Official answer: (B) pachytene.** Chiasmata (the visible result of crossing-over) are seen in **diplotene** — a favourite trap.

### Rest of meiosis I and meiosis II

| Stage | Events |
|---|---|
| **Metaphase I** | **Bivalents** line up on the equator (paired homologues side by side); the two kinetochores of one homologue face the **same** pole |
| **Anaphase I** | **Homologous chromosomes separate**; **sister chromatids stay together** at their centromeres. This is the actual **reduction** (2n → n). Random orientation of each bivalent → **independent assortment** |
| **Telophase I** | Nuclear envelope and nucleolus reappear (in many cells); cytokinesis → **dyad** of cells |
| **Interkinesis** | Short stage; **no DNA replication** |
| **Prophase II** | Simpler than prophase I; nuclear membrane disappears; chromosomes compact |
| **Metaphase II** | Chromosomes at equator; kinetochores of sister chromatids attach to opposite poles |
| **Anaphase II** | **Centromeres split**, sister chromatids move apart (like mitosis) |
| **Telophase II** | Four nuclei form → cytokinesis → **tetrad of four haploid cells** |

Meiosis I is **reductional**; meiosis II is **equational** (like mitosis).

**Significance of meiosis (NCERT):** conserves the **specific chromosome number** of each species across generations in sexually reproducing organisms (even though it halves the number in gametes); increases **genetic variability** from one generation to the next — essential for evolution. Sources of variation: **crossing-over** (pachytene) and **independent assortment** of homologues (anaphase I); plus random fertilisation.

## 5. Mitosis versus meiosis

<div class="formula">

| Point | Mitosis | Meiosis |
|---|---|---|
| Occurs in | Somatic cells (and haploid plant cells) | Germ cells (meiocytes) |
| Number of divisions | One | Two (meiosis I and II) |
| Daughter cells | **2, diploid**, identical to parent | **4, haploid**, genetically different |
| Prophase | Short, simple | **Prophase I long**, five sub-stages |
| Synapsis and bivalents | Absent | Present (zygotene) |
| Crossing-over | Absent (rare somatic crossing-over) | Present (pachytene) |
| Chiasmata | Absent | Present (diplotene) |
| Metaphase plate holds | Individual chromosomes | **Bivalents (metaphase I)** |
| Anaphase separates | Sister chromatids | **Homologues (anaphase I)**; sister chromatids (anaphase II) |
| Centromere splits | In anaphase | Only in **anaphase II** |
| Role | Growth, repair, asexual reproduction | Gamete/spore formation, variation |

</div>

## 6. Counting chromosomes, chromatids and DNA — worked problems

Take a cell with **2n = 46** (human) and **2C** DNA in G1.

| Stage | Chromosomes per cell | Chromatids per cell | DNA content |
|---|---|---|---|
| G1 | 46 | 46 (one per chromosome) | 2C |
| G2 / prophase / metaphase (mitosis) | 46 | **92** | 4C |
| Anaphase (mitosis), whole cell | **92** (chromatids now counted as chromosomes) | 92 | 4C |
| Each daughter after mitosis | 46 | 46 | 2C |
| Pachytene (meiosis I) | 46 = **23 bivalents** | 92 (**23 tetrads**) | 4C |
| After meiosis I (each cell) | **23** | 46 | **2C** |
| After meiosis II (each gamete) | 23 | 23 | **1C** |

**Problem 1.** A cell has 8 chromosomes in G1 (2n = 8). How many chromatids at metaphase of mitosis? — **16**. How many bivalents at pachytene? — **4**. How many chromosomes in each cell after meiosis I? — **4** (each with two chromatids).

**Problem 2.** How many **mitotic divisions** are needed to make **128 cells** from one cell? — Each division adds one cell, so **127 divisions**, done in **7 generations** (2⁷ = 128).

**Problem 3.** How many **meiotic divisions** are needed to produce **100 sperms**? — One primary spermatocyte gives 4 sperms → **25 meioses**. For **100 eggs** → **100 meioses** (one primary oocyte gives only one ovum).

**Problem 4.** How many different kinds of gametes can a human produce by independent assortment alone? — **2ⁿ = 2²³ = 8,388,608** (about 8.4 million); crossing-over increases this enormously.

**Problem 5.** If the DNA of a G1 nucleus of a cell is 6 pg, what is it in (a) G2, (b) a secondary spermatocyte, (c) a spermatid? — (a) **12 pg**, (b) **6 pg**, (c) **3 pg**.

### Gametogenesis counts (link to reproduction)

<div class="formula">

**Spermatogenesis:** spermatogonium (2n) —mitosis→ **primary spermatocyte** (2n) —meiosis I→ **2 secondary spermatocytes** (n) —meiosis II→ **4 spermatids** (n) —spermiogenesis (no division)→ **4 sperms**.

**Oogenesis:** oogonium (2n) —mitosis→ **primary oocyte** (2n; arrested in prophase I/diplotene from foetal life) —meiosis I (unequal)→ **1 secondary oocyte + 1 first polar body** —meiosis II (completed only after sperm entry)→ **1 ovum + 1 second polar body**.

- 1 primary spermatocyte → **4 sperms**; 1 secondary spermatocyte → **2 sperms**.
- 1 primary oocyte → **1 ovum** (+ 2 or 3 polar bodies); 1 secondary oocyte → **1 ovum**.

</div>

> **PYQ:** TRE 1.0 (2023) Q52 asked: "In humans, the numbers of ova and sperms that would be produced from 100 secondary oocytes and 100 secondary spermatocytes during gametogenesis are — (A) 50 ova and 100 sperms (B) 100 ova and 100 sperms (C) 100 ova and 200 sperms." **BPSC key (2nd provisional): (C).** 100 secondary oocytes × 1 = 100 ova; 100 secondary spermatocytes × 2 = 200 sperms.

> **PYQ:** TRE 1.0 (2023) Q99 asked: "During spermatogenesis the type B spermatogonia divides by — (A) amitosis (B) mitosis (C) meiosis." **BPSC key (2nd provisional): (B) mitosis.** Type A spermatogonia renew the stem-cell pool; type B spermatogonia divide by mitosis to form primary spermatocytes, which then enter meiosis. Full details: [Human Reproductive System and Gametogenesis](/interview/bpsc-tre/class-11-12-zoology/reproduction-health/human-reproductive-system-and-gametogenesis).

## 7. Where meiosis fits in different life cycles

| Life cycle | When meiosis happens | Main (dominant) stage | Examples |
|---|---|---|---|
| **Gametic meiosis** (diplontic) | **During gamete formation** | Diploid (2n) body; only gametes are haploid | **Animals, humans**, *Fucus* |
| **Zygotic meiosis** (haplontic) | **Right after fertilisation** — the zygote divides by meiosis | Haploid (n) body; only zygote is diploid | *Chlamydomonas*, *Spirogyra*, many fungi |
| **Sporic meiosis** (haplo-diplontic) | **During spore formation** | Alternation of a haploid gametophyte and a diploid sporophyte | Bryophytes, pteridophytes, seed plants |

### Plant cell versus animal cell division

| Point | Animal cell | Higher plant cell |
|---|---|---|
| Centrioles | Present — **astral** spindle | Absent — **anastral** spindle |
| Cytokinesis | **Furrowing** (centripetal, actin–myosin ring) | **Cell plate** (centrifugal, Golgi vesicles, phragmoplast) |
| Where mitosis happens | Most tissues (somatic cells; stem cells) | Mainly in **meristems** (root and shoot tips, cambium) |
| Study material in the lab | Bone marrow, testis (meiosis), cultured lymphocytes | **Onion root tip** (mitosis), **anthers of onion/maize buds** (meiosis) |
| Stain | Giemsa (karyotype) | **Acetocarmine** or **Feulgen** |

### Comparing the two divisions of meiosis

| Point | Meiosis I | Meiosis II |
|---|---|---|
| Nature | **Reductional** (2n → n) | **Equational** (n → n) |
| Pairing, crossing-over | Yes | No |
| What separates at anaphase | Homologous chromosomes | Sister chromatids |
| Centromere splits? | No | Yes |
| DNA content after division (per cell) | 4C → 2C | 2C → 1C |
| Preceded by DNA replication? | Yes (S phase) | **No** (interkinesis has no S phase) |

> **Exam angle:** TRE has asked three meiosis-stage questions across two papers (Q53, Q86 of TRE 1.0; Q133 of TRE 2.0) plus a gamete-count question. Expect one or two again: a stage name (synapsis, crossing-over, chiasmata, terminalisation), a count (sperms or ova from a given cell type), or a phase activity (G1/S/G2). Learn the five sub-stages in order and the event that defines each one.

## 8. Apoptosis and cell death (short)

- **Apoptosis** — programmed, orderly cell death: cell shrinks, chromatin condenses, DNA is cut into ~180–200 bp pieces ("DNA ladder"), the cell breaks into **apoptotic bodies** that are eaten by phagocytes — **no inflammation**. Carried out by **caspases**; mitochondria release cytochrome c. Examples: loss of **webbing between fingers** in the embryo, removal of self-reactive lymphocytes in the thymus. Term by Kerr, Wyllie and Currie (1972); *C. elegans* genes — Brenner, Horvitz, Sulston (Nobel 2002).
- **Necrosis** — accidental death from injury; cell swells and bursts; causes inflammation.

## Traps and exceptions

- **G1 = RNA and protein synthesis; S = DNA synthesis; G2 = continued protein synthesis (tubulin).** Interphase is not "resting".
- **Chromosome number does not double in S phase** — only DNA content (2C → 4C) and chromatid number double.
- **Centrioles duplicate in S phase** (cytoplasm), not in prophase.
- **Metaphase** is best for counting chromosomes; **anaphase** is the shortest stage; **prophase** is the longest stage of mitosis; **pachytene** is the longest sub-stage of prophase I (and prophase I is the longest phase of meiosis).
- **Synapsis — zygotene; crossing-over — pachytene; chiasmata visible — diplotene; terminalisation — diakinesis.** Examiners swap these.
- Crossing-over is between **non-sister chromatids of homologous** chromosomes — not between sister chromatids, not between non-homologous chromosomes (that would be a translocation).
- **Anaphase I separates homologues; anaphase II separates sister chromatids.** Centromeres split only in anaphase II (and in mitotic anaphase).
- **No DNA replication in interkinesis.**
- Cell plate grows **centre → periphery**; animal furrow grows **periphery → centre**.
- Amitosis has **no spindle**. Closed mitosis keeps the nuclear envelope.
- 100 **primary** spermatocytes → 400 sperms; 100 **secondary** spermatocytes → 200 sperms; 100 **spermatids** → 100 sperms. Read the stem carefully.
- **Neurons are in G0**, not "dead" or in G2.

## Quick revision

1. Howard and Pelc (1953) — phases of the cell cycle.
2. Human cell cycle ≈ 24 h; M phase ≈ 1 h; yeast ≈ 90 min.
3. G1 — growth, RNA and protein synthesis; S — DNA replication (2C → 4C); G2 — tubulin synthesis.
4. G0 — quiescent cells (neurons, heart muscle).
5. Checkpoints: G1/S (restriction point), G2/M, spindle assembly.
6. Cyclins + CDKs control the cycle (Hartwell, Hunt, Nurse — Nobel 2001); MPF = cyclin B + CDK1.
7. p53 halts damaged cells at G1; Rb holds E2F.
8. Flemming (1882) — coined mitosis.
9. Prophase: condensation; envelope, nucleolus, Golgi, ER vanish.
10. Metaphase — chromosomes at equator; best for counting; colchicine arrests here.
11. Anaphase — centromeres split; V-shape = metacentric.
12. Telophase — nuclei re-form.
13. Animal cytokinesis — furrow (actin–myosin ring); plant — cell plate (phragmoplast).
14. Coconut liquid endosperm — karyokinesis without cytokinesis.
15. Van Beneden (1883, Ascaris) — meiosis; Farmer and Moore (1905) — named it.
16. Leptotene — threads; zygotene — synapsis, synaptonemal complex; pachytene — crossing-over (recombinase).
17. Diplotene — chiasmata; diakinesis — terminalisation.
18. Anaphase I — reduction (homologues separate); meiosis II is equational.
19. No DNA replication in interkinesis.
20. 2²³ ≈ 8.4 million gamete combinations by independent assortment.
21. 1 primary spermatocyte → 4 sperms; 1 primary oocyte → 1 ovum.
22. 100 secondary oocytes + 100 secondary spermatocytes → 100 ova + 200 sperms.
23. Polytene chromosomes arise by endoreduplication.
24. Apoptosis — caspases, no inflammation; necrosis — inflammation.

## Practice with answers

1. In which phase does DNA replicate? — **S phase**.
2. In which phase is tubulin mainly synthesised? — **G2 phase**.
3. What is G0? — **A quiescent stage where cells exit the cycle but remain metabolically active**.
4. Which complex drives a cell into mitosis? — **MPF (cyclin B + CDK1)**.
5. Which stage is best for studying chromosome morphology? — **Metaphase**.
6. In which stage do sister chromatids separate in mitosis? — **Anaphase**.
7. In which direction does the plant cell plate grow? — **Centrifugally — centre to periphery**.
8. Which drug arrests mitosis at metaphase? — **Colchicine**.
9. What is a bivalent? — **A pair of synapsed homologous chromosomes (four chromatids — a tetrad)**.
10. Synaptonemal complex forms in which sub-stage? — **Zygotene**.
11. Which enzyme brings about crossing-over? — **Recombinase**.
12. When do chiasmata first become visible? — **Diplotene**.
13. What is terminalisation? — **Movement of chiasmata to the ends of chromosomes in diakinesis**.
14. Which division of meiosis actually reduces chromosome number? — **Meiosis I** (anaphase I).
15. How many chromatids are present at metaphase of mitosis in a cell with 2n = 20? — **40**.
16. How many meiotic divisions are needed to form 200 sperms? — **50**.
17. How many ova come from 50 primary oocytes? — **50**.
18. Name a stage of prolonged arrest in human oocytes. — **Diplotene (dictyotene) of prophase I**.
19. In which cells does endoreduplication give polytene chromosomes? — **Salivary gland cells of dipteran larvae (Drosophila, Chironomus)**.
20. Who first described meiosis? — **Edouard Van Beneden** (1883, Ascaris).
