---
title: Biotechnology and Applied Biology
part: Biotechnology and Applications
summary: Tools of recombinant DNA technology (restriction enzymes, vectors, ligase, gel electrophoresis), PCR, transformation methods, bioreactors, GM crops like Bt cotton, RNAi, human insulin, gene therapy, plant tissue culture, somaclones and somaclonal variation, micropropagation, microbes in human welfare, animal husbandry, plant breeding, biosafety, biopiracy, ethics and eugenics.
---

This chapter covers biotechnology and its uses from NCERT class 12 (Biotechnology: Principles and Processes; Biotechnology and its Applications; Microbes in Human Welfare; Strategies for Enhancement in Food Production) to B.Sc. points like somaclonal variation, blue–white selection and PCR temperatures. TRE 1.0 asked "What is a somaclone?" and "Eugenics is the study of …"; TRE 2.0 asked chemistry-of-insulin type questions linked to rDNA products.

> **In simple words:** Biotechnology uses living cells or their parts to make useful products. In genetic engineering we cut a useful gene out of one organism with "molecular scissors" (restriction enzymes), paste it into a carrier DNA (vector) with "molecular glue" (ligase), put it into a host cell like *E. coli*, and let the host make the product — human insulin, for example. PCR makes millions of copies of a gene in a test tube. Tissue culture grows whole plants from tiny pieces. These tools give GM crops, medicines, vaccines and diagnostic tests — and raise questions of safety and ethics.

## 1. What is biotechnology?

- **European Federation of Biotechnology (EFB)** definition: "the integration of natural science and organisms, cells, parts thereof, and molecular analogues for products and services."
- Two core techniques: **genetic engineering** (changing the genetic material) and **bioprocess engineering** (keeping sterile conditions to grow large amounts of microbes or cells).
- **First recombinant DNA**: **Stanley Cohen and Herbert Boyer (1972)** — they linked an **antibiotic-resistance gene** to a native **plasmid** of *Salmonella typhimurium* and put it into *E. coli*.
- Three basic steps: (1) identify DNA with the desired gene; (2) introduce it into a host; (3) maintain the DNA in the host and transfer it to progeny.

## 2. Tools of recombinant DNA technology

### Restriction enzymes — "molecular scissors"

- **Restriction endonucleases** cut DNA at specific recognition sequences. First discovered ones (1963) restricted the growth of bacteriophage in *E. coli*; the first specific one isolated was ***Hind* II** (about 1968–70). Nobel Prize **1978** (Arber, Nathans, Smith).
- **Naming — *Eco*RI**: ***E*** = genus *Escherichia*, ***co*** = species *coli*, **R** = strain RY13, **I** = first enzyme found in that strain.
- They recognise **palindromic** sequences (read the same 5′→3′ on both strands). *Eco*RI site:

<div class="formula">

| Strand | Sequence |
|---|---|
| 5′ → 3′ | G ↓ A A T T C |
| 3′ → 5′ | C T T A A ↑ G |

</div>

- *Eco*RI cuts between G and A, leaving single-stranded overhangs called **sticky ends**, which pair easily with other sticky ends cut by the same enzyme. Some enzymes give **blunt ends** (e.g. *Sma*I).
- **Exonucleases** remove nucleotides from the ends; **endonucleases** cut inside the DNA.
- More than **900 restriction enzymes** from 230+ bacterial strains are known (NCERT).

### DNA ligase — "molecular glue"

Joins DNA fragments by forming **phosphodiester bonds**.

### Vectors — "vehicles"

| Vector | Feature |
|---|---|
| **Plasmids** | Small, circular, extra-chromosomal, self-replicating DNA of bacteria |
| **pBR322** | First artificial *E. coli* plasmid vector; has **ori**, **amp^R** and **tet^R** genes; sites for *Bam*HI (in tet^R), *Pst*I and *Pvu*I (in amp^R), *Eco*RI, *Hind*III, *Sal*I, *Cla*I |
| **Bacteriophages** (e.g. λ phage) | Carry larger DNA pieces |
| **Cosmids, BAC, YAC** | Large inserts; **YAC** (yeast artificial chromosome) and **BAC** used in the Human Genome Project |
| **Ti plasmid** of ***Agrobacterium tumefaciens*** | Natural "genetic engineer" of dicot plants (causes crown gall); disarmed Ti plasmid used to deliver genes into plants |
| **Retroviruses** (disarmed) | Deliver genes into animal cells (gene therapy) |

**Features of a good cloning vector:**
1. **Origin of replication (ori)** — controls copy number.
2. **Selectable marker** — e.g. antibiotic resistance (ampicillin, tetracycline, kanamycin) to pick out **transformants**.
3. **Cloning sites** — preferably a single recognition site for the chosen enzyme.
4. Small size.

**Insertional inactivation** — inserting the foreign gene inside a marker gene inactivates it:
- In pBR322, a gene inserted at the *Bam*HI site inactivates **tet^R** → recombinants grow on ampicillin but **not** on tetracycline.
- **Blue–white selection**: the gene is inserted into ***lacZ*** (codes **β-galactosidase**). With chromogenic substrate (X-gal), non-recombinant colonies are **blue**; **recombinant colonies are white** (enzyme inactivated).

### Competent host and gene transfer

| Method | How |
|---|---|
| **Chemical (CaCl₂)** | Divalent Ca²⁺ makes bacteria competent; then **heat shock** (ice → **42 °C** → ice) |
| **Microinjection** | rDNA injected directly into the **nucleus of an animal cell** |
| **Biolistics (gene gun)** | Cells bombarded with **gold or tungsten** microparticles coated with DNA — used for **plants** |
| **Electroporation** | Short electric pulses make temporary pores in the membrane |
| **Disarmed pathogen vectors** | *Agrobacterium* (plants), retroviruses (animals) |

### Gel electrophoresis — separating DNA

- DNA is **negatively charged** (phosphate groups), so it moves towards the **anode (+)**.
- Matrix: **agarose** (a polysaccharide from **seaweeds**). Smaller fragments move **faster and farther** (sieving effect).
- Stained with **ethidium bromide**; bands look **bright orange under UV light**. Bands are cut out and purified = **elution**.

### Isolation of DNA

Cell wall broken by enzymes — **lysozyme** (bacteria), **cellulase** (plants), **chitinase** (fungi); RNA removed by **ribonuclease**, proteins by **protease**; DNA precipitated by adding **chilled ethanol** — visible as fine threads.

## 3. PCR — polymerase chain reaction

Invented by **Kary Mullis (1983)**; Nobel Prize in Chemistry **1993**. Makes millions or billions of copies of a chosen DNA segment **in vitro** (in a tube).

<svg viewBox="0 0 420 210" width="420" height="210" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <defs><marker id="ah13" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="currentColor" stroke="none"/></marker></defs>
  <rect x="150" y="10" width="120" height="50" rx="8"/>
  <text x="210" y="31" text-anchor="middle" fill="currentColor" stroke="none">1. Denaturation</text>
  <text x="210" y="48" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">~94–95 °C: strands separate</text>
  <rect x="275" y="130" width="135" height="50" rx="8"/>
  <text x="342" y="151" text-anchor="middle" fill="currentColor" stroke="none">2. Annealing</text>
  <text x="342" y="168" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">~50–60 °C: primers bind</text>
  <rect x="10" y="130" width="135" height="50" rx="8"/>
  <text x="77" y="151" text-anchor="middle" fill="currentColor" stroke="none">3. Extension</text>
  <text x="77" y="168" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">72 °C: Taq polymerase</text>
  <line x1="270" y1="50" x2="320" y2="126" marker-end="url(#ah13)"/>
  <line x1="273" y1="160" x2="149" y2="160" marker-end="url(#ah13)"/>
  <line x1="95" y1="126" x2="150" y2="50" marker-end="url(#ah13)"/>
  <text x="210" y="110" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">one cycle ≈ doubles DNA</text>
  <text x="210" y="125" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">n cycles → 2ⁿ copies</text>
  <text x="210" y="202" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">needs: template DNA, 2 primers, dNTPs, Taq polymerase, Mg²⁺ buffer</text>
</svg>

| Step | Temperature (typical) | What happens |
|---|---|---|
| **Denaturation** | **~94–95 °C** | Double-stranded DNA separates into two strands |
| **Annealing** | **~50–60 °C** (depends on primer) | Two short synthetic **primers** (oligonucleotides) bind to complementary ends of the target |
| **Extension** | **72 °C** | **Taq DNA polymerase** adds nucleotides (dNTPs) from the primers |

- **Taq polymerase** comes from the thermophilic bacterium ***Thermus aquaticus*** (hot springs) — it **stays active at high temperature**, so it is not destroyed during denaturation.
- **RT-PCR**: RNA is first copied into **cDNA** by **reverse transcriptase** — used for **COVID-19** testing (SARS-CoV-2 is an RNA virus). **Real-time (quantitative) PCR** measures DNA as it is made.
- Uses: diagnosis of infections (HIV, TB) at very early stages when the number of pathogens is low, **DNA fingerprinting** in forensics, detecting mutations and cancer genes, paternity tests.

**Worked example:** Starting with **1** DNA molecule, copies after **10** cycles = 2¹⁰ = **1,024**.

**Worked example:** Starting with **5** DNA molecules, copies after **20** cycles = 5 × 2²⁰ = 5 × 1,048,576 = **5,242,880** (about 5.2 million).

**Worked example:** 30 cycles from one molecule = 2³⁰ ≈ **1.07 × 10⁹** (about a billion copies).

## 4. Bioreactors and downstream processing

- **Bioreactors** (100–1,000 litres or more) grow cells in large volumes under optimum temperature, pH, O₂, nutrients. Most common: **stirred-tank bioreactor** (cylindrical with a curved base for mixing; has agitator, oxygen delivery (**sparger**), foam control, temperature and pH control, sampling ports).
- **Sparged stirred-tank** — sterile air bubbles increase O₂ transfer.
- **Downstream processing**: separation and purification of the product, formulation with preservatives, **clinical trials** (for drugs) and strict quality control.

## 5. Applications in agriculture

### GM (genetically modified) crops — advantages

More tolerance to abiotic stress (cold, drought, salt, heat); less dependence on chemical pesticides (**pest-resistant crops**); reduced post-harvest losses; better mineral use (prevents early soil exhaustion); enhanced nutritional value (**Golden rice** — rich in **β-carotene (provitamin A)**).

### Bt cotton

- **Bt** = ***Bacillus thuringiensis***, a soil bacterium that makes **Cry proteins** (crystal proteins) toxic to some insects.
- The toxin exists as an **inactive protoxin**. In the **alkaline gut (high pH)** of the insect larva it becomes **active**, binds to the midgut epithelium, makes **pores**, cells swell and burst → insect dies. The bacterium itself is not harmed (toxin stored inactive).
- Genes: ***cryIAc*** and ***cryIIAb*** control **cotton bollworms**; ***cryIAb*** controls **corn borer**. The gene is named *cry*.
- Other target insects: lepidopterans (tobacco budworm, armyworm), coleopterans (beetles), dipterans (flies, mosquitoes).
- **India**: Bt cotton approved for commercial cultivation in **2002** — still the **only GM crop widely grown commercially in India**. **Bt brinjal** — moratorium since **2010** (grown in Bangladesh). **GM mustard (DMH-11)** got environmental-release approval from **GEAC** in **October 2022**, but the matter is before the Supreme Court (check the latest status).

### RNA interference (RNAi) — nematode-resistant tobacco

- The nematode ***Meloidogyne incognita*** (root-knot nematode) infects tobacco **roots** and reduces yield.
- Using ***Agrobacterium* vectors**, nematode-specific genes were introduced into tobacco so that the plant makes both sense and anti-sense RNA → **double-stranded RNA (dsRNA)** → **silences the specific mRNA** of the nematode → the parasite **cannot survive** in the transgenic host.
- RNAi is a natural defence in eukaryotes (against viruses and transposons).

### Other GM / biotech crops

**Flavr Savr tomato** (1994, USA) — first GM food sold; slower ripening by blocking polygalacturonase. **Golden rice** — β-carotene. GM soybean, maize, canola (herbicide tolerance). **Biofortification** — breeding crops richer in vitamins/minerals/protein (IARI has released vitamin A-rich carrots, spinach, pumpkin; iron-rich spinach and bathua; protein-rich beans).

## 6. Applications in medicine

### Human insulin by rDNA

- Earlier insulin came from **slaughtered cattle and pigs** — caused allergy in some patients.
- Insulin has **two chains, A and B**, linked by **disulphide bridges**. In humans it is made as **pro-insulin** with an extra **C-peptide** that is removed.
- In **1983**, **Eli Lilly** (USA) prepared two DNA sequences for chains A and B, put them into **plasmids of *E. coli***, produced the chains **separately**, then **combined** them by disulphide bonds to form **human insulin (Humulin)**.

### Gene therapy

Correcting a gene defect by inserting a normal gene. **First clinical gene therapy (1990)** — a **4-year-old girl** with **ADA (adenosine deaminase) deficiency** (immune disorder). Lymphocytes from her blood were grown in culture, a functional ADA cDNA was introduced with a **retroviral vector**, and the cells were returned to her body. Permanent cure needs the gene inserted into **early embryonic stage / bone-marrow stem cells**.

### Molecular diagnosis

**PCR**, **ELISA** (antigen–antibody reaction), **recombinant DNA probes** with radioactive labels + autoradiography (a mutated gene does not appear on the film because the probe does not pair with it).

### Transgenic animals

- More than **95%** of transgenic animals are **mice**.
- Uses: study of disease, biological products (**α-1-antitrypsin** for **emphysema**), vaccine safety (polio vaccine tested on transgenic mice), chemical safety testing.
- **Rosie** (**1997**) — first transgenic **cow**; milk with human **α-lactalbumin** (2.4 g per litre) — more balanced for babies.
- **Dolly the sheep** (1996, **Ian Wilmut**, Roslin Institute) — first mammal **cloned** from an adult somatic cell (**somatic cell nuclear transfer**). Dolly was **cloned, not transgenic**.

## 7. Plant tissue culture

- **Totipotency** — ability of a single plant cell to grow into a whole plant. **Gottlieb Haberlandt** (1902) — father of plant tissue culture.
- **Explant** — any part of a plant (stem, leaf, root tip, anther) taken to grow in culture.
- Medium: **MS medium** (**Murashige and Skoog, 1962**) — sugar (carbon source), inorganic salts, vitamins, amino acids, **growth regulators** (auxins, cytokinins). Strict **aseptic** conditions.
- **Callus** — undifferentiated mass of cells.
- Hormone balance (**Skoog and Miller, 1957**): high **auxin : cytokinin** → **roots**; high **cytokinin : auxin** → **shoots**; balanced → callus.

| Technique | What it gives |
|---|---|
| **Micropropagation** | Thousands of plants in a short time from small explants; plants are **genetically identical** to the parent = **somaclones**. Used for tomato, banana, apple, orchids, sugarcane, teak, eucalyptus |
| **Meristem culture** | **Virus-free plants** — the **apical and axillary meristems** are free of virus even when the plant is infected; banana, sugarcane, potato |
| **Somatic hybridisation** | **Protoplasts** (cells without walls; walls digested by cellulase and pectinase) of two plants fused → **somatic hybrid** — e.g. **pomato** (potato + tomato), which unfortunately lacked desired combined characters |
| **Anther / pollen culture** | **Haploid** plants (first by **Guha and Maheshwari, 1964**, *Datura*); doubling gives homozygous lines quickly |
| **Embryo rescue** | Rescues hybrid embryos that would abort |
| **Somaclonal variation** | Genetic or epigenetic variation that appears in plants regenerated from tissue culture (term **Larkin and Scowcroft, 1981**); a **source of new variety** (e.g. disease-resistant lines) but **undesirable** when true-to-type copies are wanted |

> **PYQ:** TRE 1.0 (2023) asked: "What is Somaclone? — (A) Plant which is chemically identical to the source plant (B) Plant which is morphologically similar to the original plant (C) Plant which is automatically identical to the original plant." NCERT: plants produced by tissue culture are "**genetically identical** to the original plant from which they were grown" and are called **somaclones**. Option (C) as printed ("automatically identical") seems to be a misprint of "**genetically** identical", which would be the textbook answer. No official key is in our files — read the actual options carefully; somaclones are also morphologically similar, so "(D) More than one" could be argued.

## 8. Microbes in human welfare

| Use | Microbe | Product / role |
|---|---|---|
| **Curd** | ***Lactobacillus*** (LAB) | Milk → curd; raises **vitamin B₁₂**; checks harmful microbes in stomach |
| Dosa, idli batter | Bacteria | Fermentation (CO₂ puffs the dough) |
| Bread | ***Saccharomyces cerevisiae*** (baker's yeast) | CO₂ makes dough rise |
| **Swiss cheese** | ***Propionibacterium sharmanii*** | Large holes due to CO₂ |
| **Roquefort cheese** | ***Penicillium roqueforti*** | Ripening flavour |
| **Alcoholic drinks** | ***Saccharomyces cerevisiae*** (brewer's yeast) | Wine, beer (no distillation); whisky, brandy, rum (with distillation) |
| **Citric acid** | ***Aspergillus niger*** | Organic acid |
| **Acetic acid** | ***Acetobacter aceti*** | Vinegar |
| **Butyric acid** | ***Clostridium butylicum*** | — |
| **Lactic acid** | ***Lactobacillus*** | — |
| **Streptokinase** | ***Streptococcus*** (modified by genetic engineering) | "**Clot buster**" for heart attack patients |
| **Cyclosporin A** | ***Trichoderma polysporum*** | **Immunosuppressant** in organ transplant |
| **Statins** | Yeast ***Monascus purpureus*** | **Lower blood cholesterol** (competitive inhibitor of HMG-CoA reductase) |
| **Penicillin** | ***Penicillium notatum*** | First antibiotic (Fleming 1928) |
| Lipases, proteases, pectinases | Various | Detergents (oily stains); clearing fruit juices |
| **Biogas** | **Methanogens** — ***Methanobacterium*** (in cattle rumen and sludge digesters) | **Methane** + CO₂ + H₂S; gobar gas plant technology by **IARI and KVIC** |
| **Biofertilisers** | ***Rhizobium*** (legume nodules), ***Azotobacter***, ***Azospirillum*** (free-living), **cyanobacteria** (***Anabaena***, ***Nostoc***, *Oscillatoria*) in paddy fields, **mycorrhiza** (*Glomus* — phosphorus uptake) | Nitrogen fixation, phosphorus |
| **Biocontrol** | **Ladybird** (aphids), **dragonflies** (mosquitoes), ***Bt*** (caterpillars), ***Trichoderma*** (fungal root pathogens), **baculoviruses** (genus *Nucleopolyhedrovirus*) | Pest control without chemicals; IPM |
| **Single-cell protein (SCP)** | ***Spirulina*** (cyanobacterium), ***Methylophilus methylotrophus*** | Protein-rich food; 250 g of *Methylophilus* can make ~25 tonnes of protein a day (NCERT) |

## 9. Animal husbandry and plant breeding

**Animal husbandry**
- **Inbreeding** (same breed, closely related) — increases homozygosity, exposes harmful recessive genes; continued inbreeding → **inbreeding depression**.
- **Out-crossing** (same breed, no common ancestor for 4–6 generations), **cross-breeding** (different breeds) — e.g. **Hisardale sheep** (Punjab) from **Bikaneri ewes × Marino rams**; **interspecific hybridisation** — **mule** (female horse × male donkey).
- **MOET** (Multiple Ovulation Embryo Transfer) — FSH-induced superovulation, 6–8 eggs per cycle, embryos transferred to surrogate mothers; used for cattle, sheep, rabbits, buffaloes, mares.
- **Apiculture** — *Apis indica* (Indian bee); honey, beeswax; bees are important pollinators (sunflower, Brassica, apple, pear).
- **Sericulture** — *Bombyx mori* (mulberry silk); **tasar silk** from ***Antheraea mylitta*** — **Bhagalpur** is famous for tasar ("Bhagalpuri silk").
- **Lac culture** — lac insect ***Kerria (Laccifer) lacca***.
- **Fisheries** — **Blue Revolution**; Indian major carps **catla, rohu, mrigal**; Bihar is a leading producer of **makhana** and inland fish.
- **Operation Flood** (1970, **Verghese Kurien**, NDDB) — **White Revolution**.

**Plant breeding**
- Steps: collection of variability (germplasm) → evaluation and selection of parents → cross-hybridisation → selection and testing of superior recombinants → testing, release and commercialisation.
- **Green Revolution** (1960s): **Norman Borlaug** (Nobel Peace 1970) — semi-dwarf wheat from Mexico; in India **M.S. Swaminathan** — wheat varieties **Sonalika** and **Kalyan Sona**; semi-dwarf rice from **IR-8** (IRRI, Philippines) and **Taichung Native-1** (Taiwan) → **Jaya** and **Ratna**.
- Disease-resistant varieties: wheat **Himgiri** (leaf and stripe rust, hill bunt); *Brassica* **Pusa Swarnim** (white rust); cowpea **Pusa Komal** (bacterial blight).

## 10. Biosafety, biopiracy, ethics and eugenics

- **GEAC** (Genetic Engineering Appraisal Committee, under MoEFCC) — decides on the validity of GM research and safety of GM organisms for public services in India.
- **Biopiracy** — use of bio-resources or traditional knowledge by multinational companies without proper permission or compensation.
  - **Basmati**: in **1997** an American company (RiceTec) got a US patent on "basmati" rice lines (derived from Indian farmers' varieties); India has about **27 documented varieties of basmati** (NCERT). Basmati is grown in the Indo-Gangetic plain — **Punjab, Haryana, western UP, Uttarakhand, Himachal, J&K, Delhi** (GI tag areas).
  - Turmeric and neem patents were also challenged and revoked.
- **Indian Patents Bill** amendments address patent terms, emergency provisions and research initiatives.
- **Ethics**: genetic modification may have unpredictable effects when GM organisms enter ecosystems; animal welfare in transgenic research; human genetic data privacy; access and benefit sharing (Nagoya Protocol).

> **PYQ:** TRE 1.0 (2023) asked: "One of the major Basmati rice-producing States in our country is — (A) Kerala (B) Andhra Pradesh (C) Uttar Pradesh." **(C) Uttar Pradesh** (western UP is in the basmati GI zone). Kerala and Andhra grow non-basmati rice. (No official key in our files.)

### Eugenics

- **Eugenics** (Greek *eu* = good, *genos* = birth) — the study of methods to **improve the genetic quality of the human race** by controlling reproduction; term coined by **Francis Galton (1883)**.
  - **Positive eugenics** — encouraging people with "desirable" traits to reproduce.
  - **Negative eugenics** — discouraging or preventing reproduction of people with "undesirable" traits (sterilisation laws, Nazi racial policies) — now **discredited** and unethical.
- **Euphenics** — treating genetic disorders after birth (insulin for diabetes, diet for PKU).
- **Euthenics** — improving human beings by improving the **environment** (nutrition, education, health care).
- Modern ethical debate: **gene editing** of human embryos (**CRISPR–Cas9**, Doudna and Charpentier, Nobel Chemistry 2020; the 2018 case of gene-edited babies in China was condemned).

> **PYQ:** TRE 1.0 (2023) asked: "Eugenics is the study of — (A) different races (B) people of European origin (C) altering human beings by changing the genetic components." Of these, **(C)** is closest to the definition (improving humans genetically). (No official key in our files.)

## 11. Important milestones

| Year | Event |
|---|---|
| 1953 | DNA double helix — Watson and Crick |
| 1962 | MS medium — Murashige and Skoog |
| 1970 | First restriction enzyme characterised (*Hind*II) |
| 1972 | First rDNA — Cohen and Boyer |
| 1978 | First test-tube baby (Louise Brown) |
| 1983 | PCR — Kary Mullis; rDNA human insulin (Eli Lilly) |
| 1984 | DNA fingerprinting — Alec Jeffreys |
| 1990 | First gene therapy (ADA deficiency); Human Genome Project began (completed 2003) |
| 1994 | Flavr Savr tomato |
| 1996 | Dolly the sheep |
| 1997 | Rosie the transgenic cow; basmati patent controversy |
| 2002 | Bt cotton approved in India |
| 2012 | CRISPR–Cas9 as a gene-editing tool |

## Traps and exceptions

- **Restriction enzymes cut**; **ligase joins** — not the other way round.
- ***Eco*RI**: R = **strain**, I = order of discovery (not "restriction" and "one").
- **DNA moves to the anode** (positive) in electrophoresis; **smaller fragments move farther**.
- **Ethidium bromide** glows **orange under UV**, not under normal light.
- **Recombinant colonies are white** in blue–white selection.
- In pBR322, insertion at ***Bam*HI** inactivates **tetracycline** resistance; at ***Pvu*I/*Pst*I**, ampicillin resistance.
- **Taq polymerase** — from ***Thermus aquaticus***, heat-stable; extension at **72 °C**, not 94 °C.
- Bt toxin is activated in the **alkaline** insect gut, not acidic.
- ***cryIAc* and *cryIIAb*** — cotton bollworm; ***cryIAb*** — corn borer.
- **Dolly was cloned, not transgenic**; **Rosie was transgenic**.
- Eli Lilly made insulin chains A and B **separately** in *E. coli*.
- **High auxin → roots; high cytokinin → shoots.**
- **Meristem** culture gives **virus-free** plants (not "disease-resistant" in general).
- **Somaclones** are genetically identical; **somaclonal variation** is the unexpected variation among them.
- **Pomato** is a somatic hybrid, not a GM crop.
- **Swiss cheese** holes — *Propionibacterium*; **Roquefort** — *Penicillium*.
- **Statins** from *Monascus*; **cyclosporin A** from *Trichoderma*; **streptokinase** from *Streptococcus*.
- **Eugenics** — genetic improvement (Galton); **euthenics** — environment; **euphenics** — treatment.

## Quick revision

1. First rDNA — **Cohen and Boyer, 1972**.
2. Molecular scissors — **restriction enzymes**; molecular glue — **DNA ligase**.
3. *Eco*RI cuts **G↓AATTC**; makes sticky ends.
4. Agarose comes from **seaweed**; DNA stained with **ethidium bromide**.
5. Natural genetic engineer of plants — ***Agrobacterium tumefaciens*** (Ti plasmid).
6. Gene gun uses **gold/tungsten** particles.
7. PCR — **Kary Mullis (1983)**; Taq from ***Thermus aquaticus***.
8. PCR steps — denaturation **94 °C**, annealing **50–60 °C**, extension **72 °C**.
9. n PCR cycles → **2ⁿ** copies.
10. Bt toxin genes — ***cry***; protoxin activated in **alkaline gut**.
11. Bt cotton approved in India — **2002**.
12. RNAi tobacco resists ***Meloidogyne incognita***.
13. Human insulin by rDNA — **Eli Lilly, 1983**.
14. First gene therapy — **1990**, **ADA deficiency**.
15. First transgenic cow — **Rosie (1997)**.
16. Father of plant tissue culture — **Haberlandt**.
17. MS medium — **Murashige and Skoog (1962)**.
18. Somaclones — genetically identical plants from tissue culture.
19. Virus-free plants — **meristem culture**.
20. Pomato — **somatic hybridisation** (protoplast fusion).
21. GEAC — approves GM organisms in India.
22. Eugenics — **Francis Galton (1883)**.

## Practice with answers

1. Who made the first recombinant DNA? — **Stanley Cohen and Herbert Boyer** (1972).
2. What does "R" in *Eco*RI stand for? — **Strain RY13** of *E. coli*.
3. What kind of sequences do restriction enzymes recognise? — **Palindromic** sequences.
4. Which enzyme joins DNA fragments? — **DNA ligase**.
5. Why do recombinant colonies appear white on X-gal? — **Insert inactivates the *lacZ* gene (β-galactosidase)**.
6. Towards which electrode does DNA move in gel electrophoresis? — **Anode (positive)**.
7. Which method uses heat shock at 42 °C? — **CaCl₂ transformation of bacteria**.
8. Which vector is used to transfer genes into dicot plants? — **Ti plasmid of *Agrobacterium tumefaciens***.
9. What is the role of primers in PCR? — **Short DNA pieces that give Taq polymerase a starting point** at the target ends.
10. How many DNA copies after 25 PCR cycles from one molecule? — **2²⁵ ≈ 3.36 × 10⁷** (33,554,432).
11. Why is Taq polymerase used? — **It is heat-stable** (from *Thermus aquaticus*).
12. Which pest does *cryIAc* protect cotton from? — **Cotton bollworm**.
13. How does RNAi protect tobacco from nematodes? — **dsRNA silences the nematode's specific mRNA**.
14. In which host did Eli Lilly make insulin chains? — ***E. coli*** (A and B chains separately).
15. What was the first disease treated by gene therapy? — **ADA deficiency** (1990).
16. Which part of a plant is used for virus-free plants? — **Apical/axillary meristem**.
17. What is somaclonal variation? — **Genetic variation among plants regenerated from tissue culture**.
18. Which hormone ratio makes callus form shoots? — **High cytokinin : auxin**.
19. Which microbe gives Swiss cheese its holes? — ***Propionibacterium sharmanii***.
20. Who coined the term eugenics? — **Francis Galton** (1883).
