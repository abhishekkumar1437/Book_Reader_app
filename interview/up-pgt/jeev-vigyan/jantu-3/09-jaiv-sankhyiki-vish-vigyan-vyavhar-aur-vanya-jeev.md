---
title: Biostatistics, Toxicology, Animal Behaviour and Wildlife Conservation
part: Applied Zoology
summary: The "unannounced" topics that appeared in the 2026 paper — biostatistics (mean, median, mode, variance, standard deviation, standard error, coefficient of variation, normal-binomial-Poisson distributions, chi-square and t-test, correlation-regression — with worked solutions), toxicology (LD50, dose-response, bioaccumulation and biomagnification, pesticide classes, heavy-metal diseases, antidotes), animal behaviour (innate and learned, taxes and kineses, imprinting, conditioning, insight, honeybee dance, pheromones, migration and navigation, social behaviour) and wildlife conservation (Wildlife Protection Act 1972 and 2022 amendment, IUCN categories, CITES, Tiger and Elephant projects, protected areas and Ramsar sites of Uttar Pradesh).
---

The official syllabus does not name these four topics, but **12 questions came from them in the actual paper of 9 May 2026** — biostatistics 4, toxicology 2, behaviour 3, wildlife 3 (that is, about one-fifth of the Zoology section). The old 2010 paper also had numerical statistics questions. So this chapter covers them fully at the B.Sc. "Applied Zoology" level; every number is given with a worked solution.

> **In simple words:** **Statistics** tells us where the "middle" of the data lies (mean) and how spread out it is (standard deviation), and whether a difference between two groups is real or due to chance (t-test, chi-square). **Toxicology** tells us what dose becomes a poison and how a poison builds up along the food chain. **Behaviour** tells us what animals know from birth and what they learn. **Wildlife conservation** tells us how laws, lists and protected areas save animals.

---

## Part A — Biostatistics

### A1. Basic terms

- **Population** — all the units of study; **Sample** — a part of it. Measures of a population = **parameters (μ, σ)**; measures of a sample = **statistics (x̄, s)**.
- **Variable** — **qualitative** (colour, sex) / **quantitative** — **discrete** (number of eggs) and **continuous** (height, weight).
- Presentation of data — **histogram**, **frequency polygon**, **ogive (cumulative frequency)**, bar diagram, pie chart.

### A2. Measures of central tendency

| Measure | Definition | Feature |
|---|---|---|
| **Arithmetic mean (x̄)** | Σx / n | Based on all values; **affected by extreme values** |
| **Median** | Middle value of ordered data; if n is even, the average of the two middle values | Not affected by extreme values; good for skewed data |
| **Mode** | The most frequently occurring value | There can be more than one (bimodal) |
| Geometric mean | n-th root of the product of n values | Growth rate |
| Harmonic mean | n / Σ(1/x) | Rates, speed |

- **Empirical relation (moderately skewed distribution):** **Mode = 3 Median − 2 Mean**.
- **Combined mean:** x̄ = (n₁x̄₁ + n₂x̄₂)/(n₁ + n₂). Example — 20 students with mean 50, 30 students with mean 60 → (1000 + 1800)/50 = **56**.

### A3. Measures of dispersion / variability

- **Range** = maximum − minimum.
- **Mean deviation** = Σ|x − x̄| / n.
- **Variance** — population: σ² = Σ(x − μ)² / N; sample: **s² = Σ(x − x̄)² / (n − 1)** (n − 1 = degrees of freedom — **Bessel's correction**).
- **Standard deviation (SD)** = √variance — term coined by **Karl Pearson (1893)**; in the original unit.
- **Standard error of mean (SE)** = **s / √n** — the variability of the sample mean; decreases as n increases.
- **Coefficient of variation (CV)** = **(s / x̄) × 100** — unit-free; used to compare the **relative variability** of groups with different units/means.

**Worked example 1:** Lengths of 6 frogs (cm): 5, 7, 8, 8, 9, 11.

| x | x − x̄ | (x − x̄)² |
|---|---|---|
| 5 | −3 | 9 |
| 7 | −1 | 1 |
| 8 | 0 | 0 |
| 8 | 0 | 0 |
| 9 | 1 | 1 |
| 11 | 3 | 9 |
| **Σ = 48** | **0** | **20** |

- Mean = 48/6 = **8 cm**; median = (8 + 8)/2 = **8**; mode = **8**; range = 11 − 5 = **6**
- Mean deviation = (3 + 1 + 0 + 0 + 1 + 3)/6 = 8/6 = **1.33**
- Sample variance s² = 20/5 = **4**; **SD = 2 cm** (by the population formula σ² = 20/6 = 3.33, σ = 1.83)
- SE = 2/√6 = 2/2.449 = **0.816**
- CV = (2/8) × 100 = **25%**

> **PYQ (UP PGT 2026):** Measures of dispersion are used for what? (A) Finding the average (B) Measuring central tendency (C) Measuring the variability or spread of data (D) Finding the total value. — Reasoned answer (official key not available): **(C)**.

### A4. Probability distributions

| Distribution | Type | Key points |
|---|---|---|
| **Binomial** — James (Jacob) Bernoulli | Discrete | n **independent** trials, each with **two outcomes** (success p, failure q = 1 − p); P(r) = ⁿCᵣ pʳ qⁿ⁻ʳ; **mean = np, variance = npq**; examples — boys and girls in a family, monohybrid progeny |
| **Poisson** — S. D. Poisson (1837) | Discrete | **Rare events** (p very small, n large), independent in a fixed interval; P(r) = e⁻ᵐ mʳ / r!; **mean = variance = m**; examples — mutations, bacterial colonies per square, radioactive decay |
| **Normal / Gaussian** — De Moivre, Gauss | Continuous | **Bell-shaped, symmetrical on both sides of the mean**; **mean = median = mode**; total area 1; polygenic traits (height, weight) |

**Areas under the normal curve:** **68.27%** within μ ± 1σ; **95.45%** within μ ± 2σ; **99.73%** within μ ± 3σ; **exactly 95% within μ ± 1.96σ**, 99% within μ ± 2.58σ. Standard normal variable **Z = (x − μ)/σ**.
- **Skewness** — positive (right tail longer; mean > median > mode), negative (the reverse). **Kurtosis** — peakedness of the curve (lepto-, meso-, platy-kurtic).

**Worked example 2 (binomial):** In a family with 4 children, exactly 2 girls? — ⁴C₂ (½)² (½)² = 6/16 = **3/8**. At least one boy? — 1 − (½)⁴ = **15/16**. Mean number of girls = np = 4 × ½ = **2**, variance = npq = **1**.
**Worked example 3 (normal):** In a species, mean beak length is 20 mm, SD 2 mm. What % lie between 16–24 mm? — This is μ ± 2σ → **≈ 95.4%**. More than 22 mm? — above μ + 1σ → (100 − 68.27)/2 ≈ **15.9%**.

> **PYQ (UP PGT 2026):** Statements on common probability distributions: (I) The normal distribution is symmetrical about the mean, and mean, median and mode coincide at the centre. (II) The binomial distribution models the probability of a fixed number of independent trials, each trial with two possible outcomes. (III) The Poisson distribution is suitable for rare events occurring independently in a fixed interval, especially when the mean rate is low. Correct combination? (A) II and III only (B) I and II only (C) I, II and III (D) I and III only — Reasoned answer (official key not available): **(C)** — all three statements are standard definitions.

### A5. Hypothesis testing — the basic logic

- **Null hypothesis (H₀)** — "no difference / difference due to chance"; **alternative (H₁)** — a real difference.
- **Level of significance (α)** — usually **0.05 (5%)** or 0.01; **P-value** — the probability of getting a result this extreme or more, if H₀ is true.
- **Decision rule:** calculated value **> critical (table) value** (or P < α) → **H₀ rejected** — the difference is **significant**; calculated **< critical** → **H₀ not rejected** — the difference is due to chance (sampling error).
- **Type I error (α)** — rejecting a true H₀ (false positive); **Type II error (β)** — accepting a false H₀; **power** = 1 − β.

### A6. Chi-square test (χ²) — Karl Pearson (1900)

- **χ² = Σ (O − E)² / E**; **df = classes − 1** (in a contingency table (rows − 1)(columns − 1)); χ² is always positive; uses — **goodness of fit** (Mendelian ratios), **test of independence** (contingency table). If E < 5 in any class, use **Yates' correction**.
- Critical values (α = 0.05): df 1 = **3.84**, df 2 = **5.99**, df 3 = **7.82**, df 4 = 9.49.

**Worked example 4:** 160 progeny in a dihybrid F₂: 95 : 28 : 30 : 7. Expected (9:3:3:1) = 90 : 30 : 30 : 10.
- (95 − 90)²/90 = 25/90 = **0.278**; (28 − 30)²/30 = 4/30 = **0.133**; (30 − 30)²/30 = **0**; (7 − 10)²/10 = 9/10 = **0.900**
- χ² = **1.311**; df = 3; 1.311 < 7.82 → **H₀ not rejected** — the data fit 9:3:3:1. (More examples — [Chapter 5](/interview/up-pgt/jeev-vigyan/jantu-3/mendel-aur-jeen-antarkriya).)

**Worked example 5 (2 × 2 contingency table):** Among 100 insects — treated 50 (30 dead, 20 alive), untreated 50 (20 dead, 30 alive). Total dead 50, alive 50 → E in each cell = (50 × 50)/100 = 25.
χ² = [(30 − 25)² + (20 − 25)² + (20 − 25)² + (30 − 25)²]/25 = (25 × 4)/25 = **4.0**; df = (2 − 1)(2 − 1) = 1; 4.0 > 3.84 → **significant** — the treatment has an effect (with Yates' correction χ² = 4 × (4.5²)/25 = 3.24 < 3.84 — borderline; in exams the uncorrected value is usually taken).

> **PYQ (UP PGT 2026):** (Chi-square value less than the critical value) — the question and options are given in [Chapter 5](/interview/up-pgt/jeev-vigyan/jantu-3/mendel-aur-jeen-antarkriya). Reasoned answer (official key not available): **(D)** — "the null hypothesis is not rejected; the deviation is within probability limits, due to random sampling".

### A7. Student's t-test

- **W. S. Gosset (1908)**, Guinness brewery, pen name "**Student**"; **small samples (n < 30)**, population σ unknown, data roughly normal.
- Types: **one-sample** (t = (x̄ − μ)/(s/√n), df = n − 1); **two independent samples (equal variance)** — t = (x̄₁ − x̄₂) / [sₚ √(1/n₁ + 1/n₂)], df = n₁ + n₂ − 2, pooled variance sₚ² = [Σ(x₁ − x̄₁)² + Σ(x₂ − x̄₂)²]/(n₁ + n₂ − 2); **paired** — before-and-after on the same individuals.
- For large samples (n > 30) the **Z-test**; for three or more groups **ANOVA (F-test — Fisher)**.

**Worked example 6:** Weight gain (g) of 5 rats each on two diets — diet A: 10, 12, 14, 16, 18; diet B: 6, 8, 10, 12, 14.
- x̄_A = 70/5 = **14**; Σ(x − x̄)² = 16 + 4 + 0 + 4 + 16 = **40**
- x̄_B = 50/5 = **10**; Σ(x − x̄)² = **40**
- sₚ² = (40 + 40)/(5 + 5 − 2) = 80/8 = **10**; SE (of difference) = √[10 × (1/5 + 1/5)] = √4 = **2**
- t = (14 − 10)/2 = **2.0**; df = **8**; critical t (α = 0.05, two-tailed, df 8) = **2.306**
- 2.0 < 2.306 → **H₀ not rejected** — the 4 g difference cannot be considered significant in this small sample.

> **PYQ (UP PGT 2026):** Two independent samples with equal variance were compared by a t-test. The calculated t-value is greater than the critical value at the given significance level. Correct interpretation? (A) Population means are equal but variances differ (B) The null hypothesis of equal means is rejected, and the observed difference is unlikely to be due to chance alone (C) Sample means are equal; the difference is due to random internal variation (D) A high t-value confirms a normal distribution regardless of sample size. — Reasoned answer (official key not available): **(B)**.

### A8. Correlation and regression

- **Correlation coefficient (r) — Karl Pearson** (product-moment): r = Σ(dx·dy) / √(Σdx² · Σdy²); range **−1 to +1**; +1 perfect positive, −1 perfect negative, 0 no linear relation. **Correlation ≠ causation**. **Spearman's rank correlation** — from ranks. Probable error PE = 0.6745 (1 − r²)/√n (asked in the 2010 paper).
- **Regression — Francis Galton** (father-son heights, "regression towards the mean"); regression line **y = a + bx**, b = Σ(dx·dy)/Σdx²; **coefficient of determination r²** — how much of the variation in y is explained by x.

**Worked example 7:** x: 1, 2, 3, 4, 5; y: 2, 4, 5, 4, 5. x̄ = 3, ȳ = 4.
dx: −2, −1, 0, 1, 2; dy: −2, 0, 1, 0, 1 → Σdx·dy = 4 + 0 + 0 + 0 + 2 = **6**; Σdx² = **10**; Σdy² = **6**.
r = 6/√(10 × 6) = 6/7.746 = **0.775** (strong positive); b = 6/10 = **0.6**; a = 4 − 0.6 × 3 = **2.2** → **y = 2.2 + 0.6x**; r² = 0.60 (60% of the variation explained by x).

---

## Part B — Toxicology

### B1. Basic concepts

- **Paracelsus (16th century)** — "father of toxicology": "**The dose makes the poison**".
- **Dose–response curve** — usually **sigmoid (S-shaped)** on a logarithmic dose scale; **threshold**, **NOAEL** (no observed adverse effect level — the highest level showing no adverse effect), LOAEL.
- **LD₅₀ (median lethal dose)** — the dose (mg/kg body weight) that **kills 50%** of the test animals — **J. W. Trevan (1927)**; **the lower the LD₅₀, the more potent the poison**. **LC₅₀** — concentration in air/water (96-hour LC₅₀ for fish). **ED₅₀** — dose effective in 50%.
- **Therapeutic index** = LD₅₀ (or TD₅₀) / ED₅₀ — the higher it is, the safer the drug.
- **Acute** — single/short exposure; **chronic** — low doses over a long time. **Synergism** — 2 + 2 = 6 (e.g. insecticide + piperonyl butoxide); **antagonism**; **potentiation**.
- **Selective toxicity** — the poison acts on a biochemical pathway/receptor that is **present in the target organism but not in the host** (or less sensitive in it) — e.g. penicillin (bacterial cell wall — humans have no cell wall), the herbicide glyphosate (EPSPS — the shikimate pathway is absent in animals), diflubenzuron (chitin synthesis — insects), Bt toxin (receptors of the alkaline insect gut).
- **Detoxification** — in the liver, **Phase I** (cytochrome P450 — oxidation) and **Phase II** (conjugation — glucuronide, glutathione).

**Pesticide toxicity labels in India (Insecticides Act 1968 / Rules 1971)** — triangular colour code:

| Colour | Class | Oral LD₅₀ (mg/kg, rat) |
|---|---|---|
| **Red** | Extremely toxic | 1–50 |
| **Yellow** | Highly toxic | 51–500 |
| **Blue** | Moderately toxic | 501–5000 |
| **Green** | Slightly toxic | > 5000 |

### B2. Classes of insecticides

| Class | Examples | Mode of action | Mammalian toxicity / persistence |
|---|---|---|---|
| **Organochlorines (chlorinated hydrocarbons)** | **DDT** (synthesised 1874 by Zeidler; insecticidal property found by **Paul Müller**, Nobel 1948), BHC/lindane, aldrin, dieldrin, chlordane, **endosulfan** (banned in India by the Supreme Court in **2011**) | Keep Na⁺ channels open (DDT), block GABA receptors | Acute toxicity **low-moderate**; but **highly persistent**, fat-soluble → **bioaccumulation and biomagnification** |
| **Organophosphates** | Malathion, parathion, **chlorpyrifos**, monocrotophos, dichlorvos; military — sarin | **Irreversible inhibition of acetylcholinesterase (AChE)** → ACh accumulates → nerve over-excitation | **More toxic to mammals**, but **less persistent** (rapid hydrolysis) |
| **Carbamates** | **Carbaryl (Sevin)**, aldicarb, propoxur, carbofuran | **Reversible** inhibition of AChE | Moderate-high toxicity, less persistent; the **Bhopal** plant made Sevin |
| **Synthetic pyrethroids** | Cypermethrin, deltamethrin, permethrin | Na⁺ channels | **Low** in mammals, but highly toxic to fish |
| **Neonicotinoids** | Imidacloprid | Nicotinic ACh receptors | Linked to honeybee decline (banned in the EU) |
| **Botanicals** | **Neem (azadirachtin)**, **pyrethrum** (*Chrysanthemum cinerariifolium*), **nicotine** (tobacco), **rotenone** (*Derris*) | — | Biodegradable |
| **Semiochemicals** | **Pheromone traps**, insect growth regulators (IGR) | Interfere with behaviour/development | Very low toxicity |

> **PYQ (UP PGT 2026):** Which group of insecticides is more toxic to mammals but less persistent than chlorinated hydrocarbons? (A) Organophosphates (B) Carbamates (C) Botanicals (D) Semiochemicals. — Reasoned answer (official key not available): **(A)** — organophosphates are irreversible AChE inhibitors, so their acute toxicity is high; but they break down quickly in the environment. (Carbamates are also less persistent, but are generally considered less toxic than organophosphates.)

### B3. Bioaccumulation and biomagnification

- **Bioaccumulation** — build-up of a poison **in the body of one organism** over time, because the rate of intake > rate of excretion.
- **Biomagnification** — increase in concentration **at each trophic level of a food chain** (because the poison is neither metabolised nor excreted — fat-soluble, persistent).
- **NCERT example (DDT):** water **0.003 ppb** → zooplankton 0.04 ppm → small fish 0.5 ppm → large fish 2 ppm → **fish-eating birds 25 ppm**. In birds **calcium metabolism is disturbed** → **eggshell thinning** → premature breaking → population decline (peregrine falcon, bald eagle). **Rachel Carson — *Silent Spring* (1962)**.
- **Collapse of vultures in India** — the veterinary drug **diclofenac** (kidney failure; 95%+ decline in the 1990s; veterinary use **banned in 2006**; alternative meloxicam).

### B4. Heavy metals and pollution-related diseases

| Disease/event | Poison | Place / note |
|---|---|---|
| **Minamata disease** | **Mercury (methylmercury)** | Minamata Bay, **Japan (identified 1956)**; Chisso company waste → fish → humans; nerve damage. **Minamata Convention (2013, in force 2017)** |
| **Itai-itai ("ouch-ouch") disease** | **Cadmium** | **Jinzu River, Toyama, Japan**; bone softening, kidney damage, severe pain |
| **Blackfoot disease / arsenicosis** | **Arsenic** | Taiwan; in the groundwater of the **Gangetic plain** (West Bengal, Bihar, **Uttar Pradesh — Ballia, Ghazipur etc.**); skin lesions, cancer |
| **Fluorosis** | **Fluoride** (> 1.5 mg/L) | Dental and skeletal fluorosis; Unnao, Agra, Mathura and other districts of UP; Rajasthan |
| **Plumbism / lead poisoning** | **Lead** | Anaemia (ALA-dehydratase inhibition), mental retardation in children; leaded petrol was phased out in India by 2000 |
| **Blue baby syndrome (methaemoglobinaemia)** | **Nitrate** (> 45 mg/L) | Hb → methaemoglobin in infants |
| **Bhopal gas tragedy** | **Methyl isocyanate (MIC)** | **2–3 December 1984**, Union Carbide (carbaryl plant) |
| **Endosulfan tragedy** | Endosulfan | Kasaragod (Kerala) — aerial spraying |

- **International conventions:** **Stockholm (2001, in force 2004)** — **Persistent Organic Pollutants (POPs)**, initially the "**Dirty Dozen**" (including DDT; exemption for DDT for disease-vector control); **Rotterdam (1998)** — **Prior Informed Consent (PIC)** in trade of hazardous chemicals; **Basel (1989)** — transboundary movement of hazardous waste.
- In India, **IITR (Indian Institute of Toxicology Research), Lucknow** — the leading CSIR institute.

### B5. Antidotes — the basics

**Mechanisms:** (1) **chemical neutralisation/chelation**, (2) **receptor antagonism**, (3) enzyme reactivation, (4) **enhancing detoxification pathways**, (5) reducing absorption (activated charcoal), (6) competitive inhibition.

| Poison | Antidote | Action |
|---|---|---|
| **Organophosphates** | **Atropine** + **pralidoxime (2-PAM)** | Atropine — muscarinic receptor antagonist; 2-PAM — reactivates AChE (must be given early, before "ageing") |
| Carbamates | Atropine | (oxime usually not needed) |
| **Cyanide** | Amyl nitrite/sodium nitrite + **sodium thiosulphate**; hydroxocobalamin | Binding cyanide to methaemoglobin; converting it to thiocyanate (rhodanese) |
| **Arsenic, mercury, lead** | **BAL (dimercaprol)**; lead — **calcium disodium EDTA**, succimer (DMSA) | Chelation |
| Copper (Wilson's disease) | **Penicillamine** | Chelation |
| Iron | **Deferoxamine** | Chelation |
| **Methanol**, ethylene glycol | **Ethanol** or **fomepizole** | Competitive inhibition of alcohol dehydrogenase |
| Paracetamol | **N-acetylcysteine** | Replenishes glutathione |
| Opioids (morphine) | **Naloxone** | Opioid receptor antagonist |
| Warfarin | **Vitamin K** | — |
| Heparin | **Protamine sulphate** | Neutralisation |
| Carbon monoxide | **100% O₂** / hyperbaric O₂ | — |
| **Snakebite** | **Polyvalent anti-snake venom (ASV)** — India's "**Big Four**": cobra (*Naja naja*), krait (*Bungarus caeruleus*), Russell's viper (*Daboia russelii*), saw-scaled viper (*Echis carinatus*) | Antibodies raised in horses (passive immunity) |

> **PYQ (UP PGT 2026):** Statements on selective toxicity, antidote mechanisms and environmental management: (I) Selective toxicity occurs when a poison acts on biochemical pathways/receptors that are present in the pest but absent or less sensitive in the host. (II) Antidotes can reduce toxic effects by chemical neutralisation, receptor antagonism or enhancing detoxification pathways. (III) Environmental management strategies aim to reduce exposure and risk through use control, better disposal and safer alternatives. Correct combination? (A) I and II only (B) II and III only (C) I and III only (D) I, II and III — Reasoned answer (official key not available): **(D)**.

---

## Part C — Animal behaviour / Ethology

- Founders of **ethology** — **Konrad Lorenz** (imprinting), **Niko Tinbergen** (stickleback, "four questions"), **Karl von Frisch** (honeybee dance) — **Nobel Prize in Medicine 1973**.
- **Tinbergen's four questions:** causation (mechanism), development (ontogeny), function (survival value), evolution (phylogeny); **proximate cause** versus **ultimate cause**.

### C1. Innate behaviour

**Innate behaviour** — **genetically programmed**, unlearned, **the same (stereotyped)** in all members of a species, complete the very first time.

| Type | Definition | Example |
|---|---|---|
| **Kinesis** | The **rate** of movement changes with the **intensity** of the stimulus, but the **direction is not oriented**; **orthokinesis** (speed), **klinokinesis** (rate of turning) | **Woodlice (*Porcellio*)** move fast in dry places and slowly in damp places → collect in moisture |
| **Taxis** | **Directed** movement **towards (+) or away from (−)** the stimulus | **Phototaxis** (moth +, cockroach/earthworm −), **chemotaxis** (sperm, bacteria), **geotaxis**, **rheotaxis** (fish against the current), **thigmotaxis**, thermotaxis (lice, mosquitoes) |
| **Reflex** | Rapid, involuntary, local response to a stimulus — **reflex arc** | Knee-jerk, blinking, salivation |
| **Instinct** | Complex, chain-like innate behaviour | Nest building, web spinning (spider), migration, courtship |
| **Fixed action pattern (FAP)** | Started by a specific **sign stimulus / releaser**, then runs to completion | The **male stickleback** fish attacks any model with a **red belly** (Tinbergen); the **greylag goose** rolls an egg back into the nest (completes the action even if the egg is removed); a herring gull chick pecks at the **red spot** on the parent's beak |

> **PYQ (UP PGT 2026):** Which statement describes a feature of innate behaviour? (A) Behaviour acquired by trial-and-error learning (B) Behaviour that is genetically programmed and expressed uniformly across individuals (C) Behaviour that varies randomly among individuals without a pattern (D) Behaviour that changes constantly with experience and environment. — Reasoned answer (official key not available): **(B)**.

### C2. Learned behaviour

| Type | Description | Key experiments |
|---|---|---|
| **Habituation** | Decrease in response to a repeated harmless stimulus — **the simplest learning** | Sea hare *Aplysia* (Eric Kandel, Nobel 2000), birds stop fearing a scarecrow |
| **Imprinting** | Lasting attachment to a moving object during a **critical/sensitive period**; irreversible | **Konrad Lorenz** — **greylag goose** goslings followed the object seen in the first ≈ 13–16 hours (up to ≈ 36 hours) after hatching (Lorenz himself); first observed by **Douglas Spalding (1873)** in domestic chicks; **sexual imprinting**, **olfactory imprinting** of salmon (smell of the home river) |
| **Classical conditioning** | Neutral stimulus (bell) + unconditioned stimulus (food) → bell alone = **conditioned stimulus** → saliva (**conditioned response**) | **Ivan Pavlov** — dogs (Pavlov's Nobel 1904 was for **digestive physiology**); **extinction**, spontaneous recovery |
| **Operant / instrumental conditioning** | The consequence of a behaviour (**reward/punishment**) decides its frequency — **reinforcement** | **B. F. Skinner** — **Skinner box** (rat presses a lever → food); **Thorndike** — puzzle box (cat), **trial-and-error learning**, "**law of effect**" |
| **Insight learning** | **Sudden** solution by combining past experiences ("aha!") — the highest form of learning | **Wolfgang Köhler** — the chimpanzee "**Sultan**" joined sticks / stacked boxes to get a hanging banana (Tenerife island, 1913–20; published 1917, English 1925) |
| **Latent learning** | Learning without reward, shown later | **Tolman** — rats in a maze |
| **Imitation / observational learning** | By watching others | Japanese macaque "**Imo**" washing sweet potatoes; blue tits opening milk bottles |

### C3. Communication

| Channel | Examples |
|---|---|
| **Visual** | Courtship display (peacock), firefly light signals (bioluminescence), warning colours (aposematism) |
| **Auditory** | Bird songs, frog croaking, whale songs, bat **echolocation**, elephant **infrasound** |
| **Chemical — pheromones** | Term — **Karlson and Lüscher (1959)**; first identified — **bombykol** (sex attractant of the silk moth *Bombyx mori*), **Adolf Butenandt (1959)**; **releaser** pheromones — immediate behaviour (sex attractants, **ant trail marking**, alarm); **primer** pheromones — long-term physiological change (the honeybee queen's "**queen substance**" **9-ODA** — suppresses the workers' ovaries, prevents a new queen being raised); in mice the **Bruce effect** (abortion caused by the smell of an unfamiliar male), the **Whitten effect** (male odour synchronises the oestrous cycles of females); **pheromone traps** — pest control |
| **Tactile** | **Mutual grooming** in primates, honeybee dance (in the dark hive) |
| **Electrical** | Electric fishes |

**Honeybee dance — Karl von Frisch:**
- **Round dance** — food **near** (less than ≈ 50–100 m) — only "food is close by", no direction.
- **Waggle dance** — food **far** (> ≈ 100 m) — figure-of-"8"; the **angle of the waggle run from the vertical = the angle between the sun's direction and the food's direction** (running upward = towards the sun); **duration of the waggle run / rate of waggling = distance** (greater distance → longer waggle run, slower dance); odour tells the type of food. (For intermediate distance, the "**sickle dance**".)

### C4. Migration and navigation

- **Migration** — regular, seasonal, **two-way** journey (for breeding/food/climate).
- **Birds:** **Arctic tern** — the longest (Arctic ↔ Antarctic, ≈ 70,000 km a year); **Amur falcon** (Nagaland — from East Asia to Africa); **Siberian crane** (Bharatpur — no longer arrives); **bar-headed goose** (over the Himalaya at more than ≈ 7000 m). Winter migrants to India — **Central Asian Flyway (CAF)**.
- **Fishes:** **Anadromous** — from sea to river to spawn: **salmon**, **hilsa**; **Catadromous** — from river to sea to spawn: **eel (*Anguilla*) → Sargasso Sea**.
- Others: **monarch butterfly** (North America ↔ Mexico, multi-generation), **grey whale**, wildebeest (Serengeti), lobster.
- **Navigation cues:** **sun compass** (**Kramer** — starling, **biological clock** for time compensation), **star compass** (**Emlen** — indigo bunting, rotation around the Pole Star in a planetarium), **geomagnetic field** (**magnetite** particles, **cryptochrome** protein in the eye — homing pigeon, sea turtles), **landmarks**, **smell** (salmon returning to the home river; pigeons), infrasound, polarised light.
- **Physiology of migration (birds):** change in **photoperiod** → **hypothalamus / pineal (melatonin)** → hormones (**prolactin, corticosterone, thyroid, sex hormones**) → **hyperphagia** and **fat deposition** (body weight may rise by 50–100%; fat — the most energy per gram, ≈ 9 kcal, and less water) → **pre-migratory restlessness (Zugunruhe)**, hypertrophy of flight muscles and metabolic adjustment → **start of oriented flight** using environmental cues → **mobilisation of stored lipids** in flight → **site fidelity / homing** at the destination.

> **PYQ (UP PGT 2026):** In long-distance migration, birds undergo coordinated physiological and behavioural changes. The most appropriate sequence for the preparation and execution of migratory flight: (I) Mobilisation of stored lipids for prolonged energy demand (II) Accumulation of fat reserves by hyperphagia (III) Initiation of oriented flight using environmental cues (IV) Adjustment of metabolic rate and muscle efficiency for long flight. Options: (A) II → IV → I → III (B) II → I → IV → III (C) IV → II → I → III (D) I → II → IV → III — Reasoned answer (official key not available): **(A)** — first fat deposition (II), then metabolic-muscle adjustment (IV); the setter has treated lipid mobilisation (I) as the last step of pre-flight preparation and put oriented flight (III) at the end. Strictly physiologically, I occurs more during flight, but among the given options only (A) starts with II → IV — this is the logical elimination.

> **PYQ (UP PGT 2026):** A migratory bird uses photoperiod cues for seasonal movement, performs visual and auditory courtship displays, and returns to specific breeding sites. Which explanation links communication, sexual behaviour, migration and instinct? (A) Instincts are unchangeable, migration is not under hormonal control, courtship displays do not affect reproduction (B) Migration is entirely learned, courtship displays have no adaptive value, instinct does not affect site fidelity (C) Sexual behaviour is independent of environmental cues, migration depends only on resources, communication is entirely chemical (D) Photoperiod triggers endocrine control of migration, courtship signals help in mate choice, and instinct guides navigation and homing. — Reasoned answer (official key not available): **(D)**.

### C5. Social behaviour

- **Eusocial insects** — **honeybee** (queen, workers, drones), **termites** (king, queen, soldiers, workers — workers of both sexes), **ants**, wasps; features — **division of labour (castes)**, cooperative brood care, overlapping generations.
- **Altruism** — benefiting another at one's own cost; **Kin selection** — **W. D. Hamilton (1964)** — **Hamilton's rule: rB > C** (r = coefficient of relatedness, B = benefit, C = cost); because of **haplodiploidy**, in honeybees **r between sisters = 3/4** (with own offspring 1/2) — so sterile workers rear their sisters (the queen's offspring). **Inclusive fitness**. **Reciprocal altruism** — Trivers (blood sharing in vampire bats).
- **Dominance hierarchy** — the "**pecking order**" in hens — **Schjelderup-Ebbe (1922)**; primate troops (alpha male).
- **Territoriality** — defence of an area — song, scent marking (urine spraying by tigers); spreads the population in line with resources by reducing **intraspecific competition**.
- **Courtship** — species recognition (reproductive isolation), signal of mate quality (**sexual selection**); **parental care** — in amphibians (Darwin's frog *Rhinoderma* — the male's **vocal sac**, midwife toad *Alytes* — male carries eggs on its legs, Surinam toad *Pipa* — skin of the female's back) — an adaptation to **reduce predation risk**.
- **Biological rhythms** — **daily/circadian** (≈ 24 hours; in mammals the **suprachiasmatic nucleus (SCN)** is the master clock; Nobel 2017 — Hall, Rosbash, Young — *Drosophila* period gene), tidal, lunar, **annual (circannual)** — hibernation, aestivation, migration.

---

## Part D — Wildlife conservation

### D1. Wildlife (Protection) Act, 1972

- Passed by Parliament, **9 September 1972**; under Article 252 on a State List subject (except Jammu & Kashmir — now everywhere). **42nd Constitutional Amendment (1976)** — "forests" and "protection of wild animals and birds" moved to the **Concurrent List**; **Article 48A** (duty of the State), **51A(g)** (fundamental duty of citizens).
- Provisions: **national parks, wildlife sanctuaries**, **conservation reserves** and **community reserves** (from the 2002 amendment); **National Board for Wildlife** (chairperson — Prime Minister); **NTCA** (2006 amendment); **Wildlife Crime Control Bureau (WCCB)** (2006/07); ban on hunting and trade.
- In a national park **all human activity (including grazing) is prohibited**; in a sanctuary some regulated activities are allowed.

**Schedules — original (1972) versus 2022 amendment:**

| Original Act (6 schedules) | **Wildlife (Protection) Amendment Act, 2022** (in force 1 April 2023) — **4 schedules** |
|---|---|
| Schedule I and II (Part II) — full protection, highest penalties | **Schedule I** — animals with the **highest protection** (tiger, lion, elephant, rhino, Gangetic dolphin, Great Indian Bustard etc.) |
| Schedules III and IV — lower penalties | **Schedule II** — animals with **lesser protection** |
| Schedule V — **vermin** (crow, fruit bat, rats) — may be hunted | **Removed** — now the Central Government can, by notification, declare a species vermin for a limited area/period (Section 62) |
| Schedule VI — specified plants (cultivation and trade regulated) | **Schedule III** — **protected plants** |
| — | **Schedule IV** — **specimens listed in the CITES Appendices** (new provision to implement CITES; Management and Scientific Authorities) |

- Other points of the 2022 amendment: higher penalties (maximum fine for general violations raised from ₹25,000 to ₹1 lakh; for specially protected animals the minimum raised from ₹10,000 to ₹25,000), control of **invasive alien species**, transfer of captive elephants for religious/other purposes, management of conservation reserves.

### D2. IUCN Red List categories

- **IUCN** (International Union for Conservation of Nature) — founded **1948**, headquarters **Gland, Switzerland**; **Red Data Book / Red List** — started **1964**.
| Category | Abbreviation | Meaning |
|---|---|---|
| Extinct | **EX** | The last individual has died (dodo, thylacine; India — **cheetah** (declared 1952), pink-headed duck) |
| Extinct in the Wild | **EW** | Only in captivity/cultivation |
| **Critically Endangered** | **CR** | Extremely high risk (e.g. adults < 50, or ≥ 80–90% decline in 10 years/3 generations) — **Great Indian Bustard, gharial, pygmy hog, forest owlet, white-backed vulture, red-headed vulture** |
| **Endangered** | **EN** | Very high risk (adults < 250) — **tiger, Asian elephant, Gangetic dolphin, red panda, Nilgiri tahr, lion-tailed macaque**; **Asiatic lion** (moved from CR to EN in 2008) |
| **Vulnerable** | **VU** | High risk (adults < 1000) — **one-horned rhinoceros**, snow leopard, **barasingha**, sarus crane, sloth bear, gaur |
| Near Threatened | NT | May become threatened in the near future |
| Least Concern | LC | Widespread, abundant |
| Data Deficient | DD | — |
| Not Evaluated | NE | — |

- **Threatened** = **CR + EN + VU**.

### D3. CITES

- **Convention on International Trade in Endangered Species of Wild Fauna and Flora** — signed **3 March 1973, Washington DC** (hence **3 March = World Wildlife Day**); in force **1 July 1975**; India became a party in **1976**; secretariat in **Geneva** (administered by UNEP); **legally binding**, but does not replace national laws.
- **Appendix I** — species threatened with extinction — **commercial trade prohibited** (tiger, rhino, elephant (most populations)); **Appendix II** — trade **regulated (permits)** so that it does not become a threat; **Appendix III** — at the request of any one country (seeking cooperation of other countries).
- Other conventions: **CBD (Convention on Biological Diversity, Rio 1992, in force 1993)**; **CMS / Bonn Convention (1979)** — migratory species (India 1983; **COP-13 Gandhinagar, 2020**); **Ramsar (1971)**; **World Heritage Convention (1972)**.

### D4. Major conservation projects and institutions of India

| Project/institution | Year / facts |
|---|---|
| **Project Tiger** | **1 April 1973**, initially **9 tiger reserves** (first — **Jim Corbett**, Uttarakhand); **NTCA** — 2005/06 (WPA 2006 amendment); **58 tiger reserves** (as of March 2025; 58th — Madhav, MP); **All India Tiger Estimation 2022** — minimum **3,167** (estimated ≈ 3,682) — ≈ 75% of the world's wild tigers; highest — **Madhya Pradesh** (785). "M-STrIPES" app; **tiger estimation every 4 years**; Global Tiger Day **29 July** |
| **Project Elephant** | **1992**; ≈ 33 elephant reserves; elephant — **National Heritage Animal (2010)**; corridors |
| **Crocodile Project** | **1975** — gharial rehabilitation; **Kukrail Gharial Rehabilitation Centre, Lucknow (1978)** |
| **Project Snow Leopard** | 2009 |
| **Project Cheetah** | **17 September 2022** — 8 cheetahs from Namibia, then 12 from South Africa to **Kuno National Park (MP)**; second site **Gandhi Sagar (MP)** |
| **Gangetic dolphin** | **National Aquatic Animal (2009)**; Project Dolphin (announced 2020); Vikramshila Gangetic Dolphin Sanctuary (Bihar); Dolphin Day 5 October |
| Institutions | **ZSI** (Kolkata, 1916), **BSI** (1890), **BNHS** (Mumbai, 1883), **WII** (Dehradun, 1982), **WWF** (1961, Gland; India 1969), **Wildlife Trust of India**, **TRAFFIC** (wildlife trade monitoring), **SACON** (Coimbatore) |

- **Corridors and landscape-level conservation:** **Terai Arc Landscape (TAL)** — 11–13 protected areas along the India-Nepal border from the Yamuna to Valmiki — **Dudhwa, Pilibhit, Katarniaghat** (UP) — linked with Shuklaphanta, Bardia and Chitwan in Nepal; **Kailash Sacred Landscape** (India-Nepal-China). Governments provide the legal framework and protected areas; NGOs (WWF, WTI) help with research, funding and community participation.
- **Human-wildlife conflict** — habitat fragmentation, prey depletion, livestock loss → retaliatory killing; **Uttar Pradesh declared human-wildlife conflict a "state disaster" (2023)** — compensation provisions.

> **PYQ (UP PGT 2026):** A large carnivore in India is declining despite legal protection — along with habitat fragmentation, prey depletion and rising human-wildlife conflict. Explanation for the limited conservation success? (A) Fragmentation stops gene flow, while prey depletion and conflict raise mortality, weakening conservation outcomes (B) Conflict mainly affects herbivores, with negligible effect on high-trophic carnivores (C) Fewer prey reduce competition, stabilising the population without habitat connectivity (D) Legal protection ensures recovery; the decline is a natural cycle. — Reasoned answer (official key not available): **(A)**.

> **PYQ (UP PGT 2026):** A transboundary landscape programme links habitat corridors, anti-poaching efforts and community-based conservation across several countries for wide-ranging species. Correct explanation of the role of conservation organisations? (A) Government agencies provide the legal framework and protected areas, while NGOs help with research, funding and community participation (B) Outcomes depend mainly on international conventions; national agencies and local stakeholders have a limited role (C) International NGOs enforce wildlife laws directly; governments focus only on awareness (D) Local communities make policy; global bodies monitor and enforce independently, beyond national laws. — Reasoned answer (official key not available): **(A)** — example: the Terai Arc Landscape.

### D5. Protected areas of India — exam facts

- **Biodiversity hotspots (4 in India):** Himalaya, Indo-Burma, **Western Ghats and Sri Lanka**, Sundaland (Nicobar).
- **Biosphere reserves:** 18; first — **Nilgiri (1986)** (Western Ghats; Tamil Nadu-Kerala-Karnataka); largest — Kachchh; most are in the UNESCO **MAB (Man and the Biosphere, 1971)** network. Zones — **core** (human activity prohibited), **buffer**, **transition**.
- **Keoladeo National Park** (Bharatpur, Rajasthan) — an important **wetland** for migratory waterbirds; Ramsar (1981) and World Heritage; former wintering ground of the Siberian crane.
- **Gir** (Gujarat) — the only natural home of the **Asiatic lion**, **dry deciduous forest**; 2025 estimation — **891 lions**.
- **Sundarbans** (West Bengal) — **mangroves**, tidal influence, tiger reserve, biosphere reserve, World Heritage, India's largest Ramsar site.
- **Kaziranga** (Assam) — one-horned rhinoceros (≈ 2/3 of the world's).

> **PYQ (UP PGT 2026):** Match List-I with List-II — List-I: (a) Nilgiri Biosphere Reserve (b) Keoladeo National Park (c) Gir Wildlife Sanctuary (d) Sundarbans Biosphere Reserve; List-II: (I) Habitat of the Asiatic lion with dry deciduous forest (II) Mangrove ecosystem with tidal influence and home of estuarine fauna (III) India's first biosphere reserve, representing Western Ghats biodiversity (IV) Important wetland for migratory waterbirds. Options: (A) a-IV, b-III, c-I, d-II (B) a-III, b-IV, c-I, d-II (C) a-III, b-I, c-IV, d-II (D) a-II, b-IV, c-I, d-III — Reasoned answer (official key not available): **(B)**.

### D6. Protected areas of Uttar Pradesh

| Protected area | District | Key facts |
|---|---|---|
| **Dudhwa National Park** | **Lakhimpur Kheri** | **The only national park of UP** (1977; sanctuary 1965); **Dudhwa Tiger Reserve (1987/88)** — Dudhwa NP + **Kishanpur Sanctuary** + later **Katarniaghat**; **barasingha (swamp deer)** — **state animal** of UP; **one-horned rhino rehabilitation (1984** — from Assam and Nepal); Bengal florican, hispid hare; **Billy Arjan Singh** (Tiger Haven); adjoins Shuklaphanta in Nepal; Tharu tribe |
| **Katarniaghat Wildlife Sanctuary** | **Bahraich** | 1975/76; **Geruwa (a branch of the Ghaghra)/Girwa river** — **gharial, Gangetic dolphin**, mugger; connectivity with Bardia in Nepal; part of Dudhwa Tiger Reserve |
| **Pilibhit Tiger Reserve** | **Pilibhit**, Shahjahanpur | Notified in **2014**; Sharda river, Terai; **TX2 Award (2020)** — the world's first site to **double its tiger numbers**, between 2014 and 2018 |
| **Amangarh Tiger Reserve** | **Bijnor** | 2012; **the UP buffer of Jim Corbett Tiger Reserve (Uttarakhand)** |
| **Ranipur Tiger Reserve** | **Chitrakoot** (Bundelkhand) | Notified in **2022** — **the country's 53rd** and **UP's fourth** tiger reserve; tropical dry deciduous forest; Valmiki-Markandeya area |
| **National Chambal Sanctuary** | **Agra, Etawah** (UP) + MP + Rajasthan | **1979**, **tri-state**; **gharial** (the world's largest wild population), **red-crowned roof turtle**, **Gangetic dolphin**, **Indian skimmer**; Chambal — a relatively clean river |
| Others | — | **Hastinapur Sanctuary** (Meerut; barasingha, Ganga), **Sohagi Barwa** (Maharajganj), **Kaimur Sanctuary** (Sonbhadra-Mirzapur), **Chandraprabha Sanctuary** (Chandauli — failed attempt to settle Asiatic lions in 1957), **Okhla Bird Sanctuary** (Gautam Buddh Nagar), **Etawah Lion Safari**, **Kukrail forest (Lucknow)** |

- **State symbols of UP:** animal — **barasingha**; bird — **sarus crane** (the world's tallest flying bird; UP has India's largest population); tree — **Ashoka**; flower — **palash (tesu)**.
- Tigers in UP (estimation 2022) — **205**.

### D7. Ramsar sites of Uttar Pradesh

**Ramsar Convention** — **2 February 1971, Ramsar (Iran)** (2 February = **World Wetlands Day**); India became a party in **1982**; first Indian sites — **Chilika** (Odisha) and **Keoladeo** (1981); **Montreux Record** — threatened Ramsar sites (India — Keoladeo, Loktak).

| Ramsar site (UP) | District | Year declared |
|---|---|---|
| **Upper Ganga River (Brijghat to Narora)** | Bulandshahr, Amroha etc. | **2005** — UP's first |
| **Nawabganj Bird Sanctuary** (Shaheed Chandra Shekhar Azad Pakshi Vihar) | Unnao | 2019 |
| **Parvati Arga Bird Sanctuary** | Gonda | 2019 |
| **Saman Bird Sanctuary** | Mainpuri | 2019 |
| **Samaspur Bird Sanctuary** | Raebareli | 2019 |
| **Sandi Bird Sanctuary** | Hardoi | 2019 |
| **Sarsai Nawar Jheel** | Etawah (sarus crane) | 2019 |
| **Sur Sarovar (Keetham Lake)** | Agra | 2020 |
| **Bakhira Wildlife Sanctuary** | Sant Kabir Nagar | 2021 |
| **Haiderpur Wetland** | Muzaffarnagar-Bijnor (inside Hastinapur Sanctuary) | 2021 |
| **Patna Bird Sanctuary** | Etah | 2026 (January; India's 97th/98th) |
| **Shekha Jheel Bird Sanctuary** | Aligarh | 2026 (22 April; India's 99th) |
| **Surha Tal (Jayprakash Narayan Bird Sanctuary)** | Ballia | 2026 (5 June; India's 100th) |
| **Sauj Lake** | Mainpuri | 2026 (15 October) |

A total of **14 Ramsar sites (as of October 2026)** — there were 10 till 2025, 4 were added in 2026; **103** in the country in all (October 2026). The number keeps growing — check the latest before the exam.

## Traps and exceptions

- **Standard deviation** is a measure of dispersion, not of central tendency; the **mean** is affected by extreme values, the **median** is not.
- **SE = SD/√n** — as n increases SE decreases, SD does not (SD is a property of the data).
- **In the Poisson distribution mean = variance**; in the binomial, variance (npq) < mean (np).
- Calculated value of χ² or t **greater than critical** → H₀ rejected (difference significant); **less** → H₀ not rejected — saying "H₀ proved" is wrong.
- The t-test is for **small samples**; a high t-value does **not prove** normality.
- **Lower LD₅₀ = more toxic**.
- **Organophosphates** — more toxic, less persistent; **organochlorines (DDT)** — less acutely toxic, more persistent, biomagnified.
- **Bioaccumulation = within one organism**; **biomagnification = along trophic levels**.
- **Minamata = mercury**; **itai-itai = cadmium**; **blackfoot = arsenic**.
- **Kinesis is non-directional**, **taxis is directional**.
- Imprinting only in the **critical period**; Pavlov — classical; Skinner — operant; Köhler — insight.
- The round dance gives **no information on direction**; the waggle dance gives both direction (angle from the sun) and distance.
- Salmon are **anadromous**, eels are **catadromous**.
- After the 2022 amendment **4 schedules**; the vermin schedule was removed.
- **CITES Appendix I** = commercial trade prohibited (not a total ban — scientific/non-commercial permits are possible).
- UP has **only one national park — Dudhwa**; Chambal is a **sanctuary**, not a park.
- Amangarh is not an independent tiger reserve; it is **Corbett's buffer**.

## Quick revision

1. SD = √[Σ(x − x̄)²/(n − 1)]; SE = SD/√n; CV = SD/x̄ × 100.
2. Mode = 3 Median − 2 Mean.
3. Normal: ±1σ 68.27%, ±2σ 95.45%, ±3σ 99.73%; mean = median = mode.
4. Binomial — mean np, variance npq; Poisson — mean = variance.
5. χ² — Karl Pearson (1900); 3.84 at df 1.
6. t-test — Gosset ("Student", 1908); small samples.
7. r — −1 to +1; regression — Galton.
8. "The dose makes the poison" — Paracelsus; LD₅₀ — Trevan (1927).
9. Indian pesticide labels — red (most toxic) → yellow → blue → green.
10. Organophosphates — AChE inhibitors; antidote atropine + pralidoxime.
11. DDT — from 0.003 ppb in water to 25 ppm in birds; eggshell thinning.
12. Minamata — mercury; itai-itai — cadmium.
13. Stockholm — POPs (2001); Rotterdam — PIC (1998); Basel — waste (1989).
14. Ethology Nobel 1973 — Lorenz, Tinbergen, von Frisch.
15. Imprinting — Lorenz, greylag goose.
16. Classical conditioning — Pavlov; operant — Skinner; insight — Köhler (Sultan).
17. First pheromone — bombykol (Butenandt, 1959); queen substance — 9-ODA.
18. Waggle dance — angle from the vertical = angle of the food from the sun.
19. Hamilton's rule — rB > C; honeybee sisters r = 3/4.
20. WPA — 9 September 1972; 2022 amendment — 4 schedules.
21. IUCN — 1948, Gland; threatened = CR + EN + VU.
22. CITES — 3 March 1973; in force 1975; India 1976.
23. Project Tiger — 1 April 1973; Project Elephant — 1992; cheetah — 2022 Kuno.
24. Dudhwa — UP's only NP; barasingha; rhino rehabilitation 1984.
25. Pilibhit — TX2 (2020); Ranipur (Chitrakoot) — 2022, 53rd tiger reserve.
26. Chambal Sanctuary — 1979, tri-state, gharial.
27. 14 Ramsar sites in UP (October 2026; 4 new in 2026 — Patna Bird Sanctuary, Shekha, Surha Tal, Sauj); first — Upper Ganga (2005).

## Practice questions (with answers)

1. Mean and median of 4, 8, 6, 2? — **Mean 5, median 5** (ordered 2, 4, 6, 8 → (4 + 6)/2).
2. If SD = 3, n = 9, then SE? — **1** (3/√9).
3. Mean 50, SD 5 — CV? — **10%**.
4. In which distribution is mean = variance? — **Poisson**.
5. Mean and variance of heads when 10 coins are tossed? — **Mean 5, variance 2.5** (np, npq).
6. χ² = 4.5 at df = 2 — conclusion? — **H₀ not rejected** (4.5 < 5.99).
7. Who gave the t-test? — **W. S. Gosset ("Student")**.
8. Meaning of r = −1? — **Perfect negative linear correlation**.
9. Indian label colour of an insecticide with LD₅₀ 20 mg/kg? — **Red** (extremely toxic).
10. AChE reactivator in organophosphate poisoning? — **Pralidoxime (2-PAM)**.
11. Chelator for lead poisoning? — **Calcium disodium EDTA** (or BAL).
12. Itai-itai is caused by which metal? — **Cadmium**.
13. Woodlice collecting in damp places? — **Kinesis** — non-directional, change in rate.
14. Stickleback attacking a red belly? — **Fixed action pattern** (sign stimulus).
15. A rat learning to press a lever to get food? — **Operant conditioning (Skinner)**.
16. Where do eels go to spawn? — **Sargasso Sea** (catadromous).
17. After the 2022 amendment, which schedule holds CITES specimens? — **Schedule IV**.
18. Gir is an example of which forest type? — **Dry deciduous** (Asiatic lion).
19. Which UP tiger reserve won the TX2 award? — **Pilibhit**.
20. UP's first Ramsar site? — **Upper Ganga River (Brijghat–Narora), 2005**.

**For more depth:** [Biodiversity, conservation and wildlife](/interview/bpsc-tre/class-11-12-zoology/ecology-applied/biodiversity-conservation-and-wildlife-of-bihar) · [Environmental issues and pollution](/interview/bpsc-tre/class-11-12-zoology/ecology-applied/environmental-issues-and-pollution). Next chapter: [Question bank](/interview/up-pgt/jeev-vigyan/jantu-3/prashn-bank).

