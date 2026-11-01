---
title: Neural Coordination and Sense Organs
part: Coordination and Control
summary: Neurons and glia, resting potential, phases of the action potential, all-or-none law, refractory period, saltatory conduction, synapse and neurotransmitters, reflex arc, parts of the brain, autonomic system, CSF; eye (layers, rods and cones, rhodopsin, phototransduction, defects), ear (cochlea, organ of Corti, balance), taste and smell — NCERT 11 to B.Sc./M.Sc. level.
---

This chapter takes NCERT Class 11 "Neural Control and Coordination" as the base and adds B.Sc./M.Sc. level points — ion channels, the idea of the Goldman equation, saltatory conduction, types of neurotransmitters, phototransduction, the place theory of the cochlea. UP PGT 2026 had a direct question on the "all-or-none" nature; there was also a question on the baroreceptor reflex (autonomic control).

> **In simple words:** Neurons are the body's "wires". At rest the inside of a neuron is negative compared with the outside (≈ −70 mV). On stimulation Na⁺ enters and the inside becomes positive for a moment — this is the action potential or nerve impulse, which runs along the wire. At a synapse, chemicals (neurotransmitters) carry the message to the next neuron. Sense organs such as the eye and ear convert light and sound into these same electrical signals.

For more depth: [Nervous System and Sense Organs](/interview/bpsc-tre/class-11-12-zoology/physiology/nervous-system-and-sense-organs).

## 1. Nervous tissue — neurons and glia

**Parts of a neuron:** cell body (cyton / soma — Nissl granules = RER), dendrites (carry impulses towards the cell body), axon (carries impulses away from the cell body; its origin = the **axon hillock**, where the action potential begins — the "trigger zone"), synaptic knob.

| Neuron classification | Type | Examples |
|---|---|---|
| By number of poles | Unipolar | Embryonic stage, invertebrates |
| | Pseudounipolar | Sensory neurons of the dorsal root ganglion |
| | Bipolar | Retina, olfactory epithelium, cochlear ganglion |
| | Multipolar | Cerebral cortex, motor neurons |
| By function | Sensory (afferent), motor (efferent), interneuron | |

**Myelin sheath:** in the peripheral nervous system (PNS) by **Schwann cells** — one cell for one internode; in the central nervous system (CNS) by **oligodendrocytes** — one cell for many axons. The gaps between two sheaths = **nodes of Ranvier**.

| Glia (neuroglia) | Location | Function |
|---|---|---|
| Astrocyte | CNS | Helps form the blood–brain barrier, removes K⁺ and neurotransmitter (glutamate); most numerous |
| Oligodendrocyte | CNS | Myelin |
| Microglia | CNS | Phagocytic (mesoderm/monocyte origin) |
| Ependymal cells | Lining of the ventricles and central canal | Help form CSF (choroid plexus) |
| Schwann cells | PNS | Myelin, help in regeneration |
| Satellite cells | PNS ganglia | Support |

> **Remember:** All glia except microglia come from ectoderm; microglia come from mesoderm. Multiple sclerosis = myelin damage in the CNS (autoimmune); Guillain–Barré syndrome = in the PNS.

## 2. Resting Membrane Potential

- Value ≈ **−70 mV** (neuron; inside negative); skeletal muscle ≈ −90 mV.
- Causes: (i) the membrane is ≈ 50–100 times more permeable to K⁺ than to Na⁺ (K⁺ leak channels), so K⁺ leaks out; (ii) negatively charged proteins/organic phosphates inside that cannot leave; (iii) the **Na⁺/K⁺-ATPase pump** — per ATP **3 Na⁺ out, 2 K⁺ in** (electrogenic, contributes ≈ −4 mV).
- Ion concentrations: Na⁺ outside ≈145, inside ≈15 mM; K⁺ inside ≈140, outside ≈4–5 mM.
- **Nernst potential:** K⁺ ≈ −90 mV, Na⁺ ≈ +60 mV. The resting potential is close to that of K⁺ because K⁺ permeability dominates at rest (the idea of the Goldman–Hodgkin–Katz equation).
- Discovery of the Na⁺/K⁺ pump: **Jens Skou** — Nobel 1997.

## 3. Action Potential

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="40" y1="20" x2="40" y2="185"/>
  <line x1="40" y1="140" x2="410" y2="140" stroke-dasharray="3 3"/>
  <line x1="40" y1="120" x2="410" y2="120" stroke-dasharray="1 4"/>
  <path d="M40 140 L120 140 L135 120 L160 30 L185 120 L200 160 L250 150 L300 140 L400 140"/>
  <text x="2" y="34" fill="currentColor" stroke="none">+30</text>
  <text x="2" y="144" fill="currentColor" stroke="none">−70</text>
  <text x="2" y="124" fill="currentColor" stroke="none">−55</text>
  <text x="300" y="115" fill="currentColor" stroke="none">Threshold</text>
  <text x="45" y="70" fill="currentColor" stroke="none">Depolarisation</text>
  <text x="45" y="85" fill="currentColor" stroke="none">(Na⁺ in)</text>
  <text x="185" y="60" fill="currentColor" stroke="none">Repolarisation (K⁺ out)</text>
  <text x="200" y="180" fill="currentColor" stroke="none">Hyperpolarisation</text>
  <text x="300" y="160" fill="currentColor" stroke="none">Resting</text>
</svg>

| Phase | Ionic event | Potential |
|---|---|---|
| Resting | K⁺ leak; voltage-gated channels closed | −70 mV |
| Threshold | Some Na⁺ channels open | ≈ −55 mV |
| Depolarisation | **Voltage-gated Na⁺ channels** open rapidly, Na⁺ enters (positive feedback — Hodgkin cycle) | Up to +30 to +40 mV (overshoot) |
| Repolarisation | Na⁺ channels inactivated (inactivation gate); **voltage-gated K⁺ channels** (slow) open, K⁺ leaves | Back to negative |
| Hyperpolarisation (undershoot) | K⁺ channels close late | ≈ −80 to −90 mV |
| Back to rest | Na⁺/K⁺ pump and leak channels maintain the concentrations | −70 mV |

- Duration of the action potential (nerve) ≈ 1–2 ms.
- Hodgkin & Huxley — worked on the squid giant axon (diameter ≈ 0.5–1 mm); **Nobel 1963** (with Eccles, for the synapse).
- **Tetrodotoxin (TTX — puffer fish)** blocks voltage-gated Na⁺ channels; **tetraethylammonium (TEA)** blocks K⁺ channels. Local anaesthetics (lidocaine) also block Na⁺ channels.

### All-or-None Law

A stimulus below threshold → no action potential (only a local graded potential); once threshold is crossed → an action potential of **full amplitude** — increasing the stimulus strength does not increase the amplitude. Stimulus strength is encoded by the **frequency of impulses** and the number of fibres activated.

> **PYQ (UP PGT 2026):** Which statement best explains the "all-or-none" nature of the action potential?
> (A) Action potentials vary according to the stimulus strength
> (B) Sodium channels open only partially during stimulation
> (C) Once threshold is reached, full depolarisation always occurs
> (D) Potassium channels control the amplitude of the signal
> Reasoned answer (official key not available): **(C)** — at threshold, the positive feedback of Na⁺ channels causes full depolarisation; the amplitude does not depend on the stimulus.

### Refractory Period

| Type | Cause | Result |
|---|---|---|
| Absolute | Na⁺ channels inactivated (inactivation gate closed) | No new action potential however strong the stimulus |
| Relative | Some Na⁺ channels recovered, K⁺ channels still open (hyperpolarisation) | New potential only with a stimulus stronger than threshold |

Because of the refractory period the impulse travels **in one direction** and its maximum frequency is limited.

### Graded potential vs action potential

| Graded | Action potential |
|---|---|
| Amplitude proportional to the stimulus | All-or-none |
| Fades with distance | Spreads without decrement |
| Summation possible | No summation; refractory period |
| Dendrites, cell body, receptors | Axon |
| Examples: EPSP, IPSP, receptor potential, end-plate potential | |

## 4. Conduction of the impulse

- **Non-myelinated fibres:** continuous conduction; slow (0.5–2 m/s).
- **Myelinated fibres:** **saltatory conduction** — the impulse jumps from one node of Ranvier to the next (Na⁺ channels concentrated at the nodes); fast (up to 120 m/s) and energy-saving.
- Velocity increases with: larger diameter, myelin, higher temperature.
- Invertebrates such as squid use a **giant diameter** to increase velocity; vertebrates use **myelin**.

| Fibre (Erlanger–Gasser classification) | Velocity | Examples |
|---|---|---|
| Aα | 70–120 m/s | Motor, muscle spindle |
| Aδ | 5–30 m/s | Sharp pain, temperature |
| B | 3–15 m/s | Preganglionic autonomic |
| C (non-myelinated) | 0.5–2 m/s | Dull pain, postganglionic autonomic |

## 5. Synapse

The term was coined by **Sherrington (1897)**.

| Feature | Electrical synapse | Chemical synapse |
|---|---|---|
| Structure | Gap junction (connexons), gap ≈ 2–3 nm | Synaptic cleft ≈ 20–40 nm |
| Transmission | Ions pass directly | Neurotransmitter |
| Delay | Almost none | ≈ 0.5 ms (synaptic delay) |
| Direction | Usually bidirectional | Unidirectional |
| Examples | Cardiac muscle, smooth muscle, crayfish escape system, retina | Most CNS synapses, NMJ |

**Steps of chemical transmission:** action potential at the synaptic knob → **voltage-gated Ca²⁺ channels** open → Ca²⁺ enters → synaptic vesicles (SNARE proteins) fuse with the membrane → exocytosis of the neurotransmitter → binding to postsynaptic receptors → EPSP (excitatory; Na⁺ in) or IPSP (inhibitory; Cl⁻ in or K⁺ out) → breakdown or reuptake of the transmitter.

**Neurotransmitters:**

| Transmitter | Nature | Main sites / notes |
|---|---|---|
| Acetylcholine (ACh) | First discovered — **Otto Loewi (1921)**, "Vagusstoff"; Nobel 1936 (with Dale) | NMJ, autonomic ganglia, parasympathetic postganglionic; broken down by acetylcholinesterase |
| Norepinephrine (noradrenaline) | Catecholamine | Most sympathetic postganglionic fibres |
| Dopamine | Catecholamine | Deficiency → **Parkinson's disease** (substantia nigra); excess → linked to schizophrenia |
| Serotonin (5-HT) | Indolamine (from tryptophan) | Mood, sleep; deficiency → depression |
| Glutamate | Amino acid | **Main excitatory** transmitter of the CNS (NMDA, AMPA receptors) |
| GABA (γ-aminobutyric acid) | Amino acid | **Main inhibitory** transmitter of the brain (Cl⁻ channels) |
| Glycine | Amino acid | Main inhibitory transmitter of the spinal cord (blocked by strychnine) |
| Endorphins, enkephalins | Neuropeptides | Natural painkillers (opioids) |
| Substance P | Neuropeptide | Pain transmission |
| Nitric oxide (NO) | Gas | Retrograde messenger, vasodilation |

> **Exam angle:** Poisons and drugs — curare (ACh receptor blocker), α-bungarotoxin (krait snake venom; binds irreversibly to ACh receptors), botulinum toxin (blocks ACh release — cleaves SNAREs), tetanus toxin (blocks release of the inhibitory transmitters glycine/GABA → spastic paralysis), organophosphate insecticides and nerve gas (sarin) — acetylcholinesterase inhibitors, black widow venom (massive ACh release).

## 6. Reflex Action

**Reflex arc:** receptor → sensory (afferent) neuron (via the dorsal root) → spinal cord (integration centre) → motor (efferent) neuron (via the ventral root) → effector (muscle/gland).

- **Bell–Magendie law:** the dorsal root is sensory, the ventral root is motor.
- **Monosynaptic:** knee-jerk (patellar) reflex — only a sensory and a motor neuron; receptor = muscle spindle.
- **Polysynaptic:** withdrawal reflex — pulling the hand away from a hot object, with interneurons.
- **Conditioned reflex:** Pavlov — learned (behaviour in Chapter 07).

## 7. Central nervous system — the brain

**Coverings — meninges:** from outside in — **dura mater**, **arachnoid mater**, **pia mater**. CSF lies in the **subarachnoid space** between the arachnoid and pia mater.

**Cerebrospinal fluid (CSF):** secreted by the **choroid plexus** of the ventricles; total ≈ 150 mL, ≈ 500 mL formed per day; absorbed into the venous sinuses by the arachnoid villi (granulations); functions — shock absorber, buoyancy, nutrition. Blockage causes **hydrocephalus**. Ventricular pathway: lateral ventricles (1, 2) → foramen of Monro → third ventricle → **aqueduct of Sylvius** → fourth ventricle → foramina of Luschka and Magendie → subarachnoid space.

| Part | Subdivision | Main functions |
|---|---|---|
| **Forebrain (prosencephalon)** | Cerebrum | Intelligence, memory, voluntary action; the two hemispheres are joined by the **corpus callosum** |
| | — Frontal lobe | Motor cortex (precentral gyrus), personality, **Broca's area** (speech production; usually left) |
| | — Parietal lobe | Sensory cortex (postcentral gyrus) |
| | — Temporal lobe | Hearing, **Wernicke's area** (language comprehension), hippocampus (memory) |
| | — Occipital lobe | Vision |
| | Thalamus | Relay centre for sensory signals (except smell) |
| | Hypothalamus | Temperature regulation, hunger and thirst, satiety, sleep–wake, endocrine control (releasing hormones), circadian rhythm (**suprachiasmatic nucleus**) |
| | Limbic system | Emotions, motivation — amygdala (fear), hippocampus |
| **Midbrain (mesencephalon)** | Corpora quadrigemina (4 bodies — upper 2 for visual reflexes, lower 2 for auditory reflexes), cerebral peduncles, substantia nigra | Visual and auditory reflexes |
| **Hindbrain (rhombencephalon)** | Cerebellum | Balance, posture, coordination of movements (precision of voluntary movements); "arbor vitae" |
| | Pons | **Pneumotaxic centre** of respiration; connects parts of the brain |
| | Medulla oblongata | Respiratory rhythm centre, cardiac and vasomotor centres, swallowing, coughing, sneezing, vomiting |

**Brain stem** = midbrain + pons + medulla.

> **Remember:** Humans have **12 pairs of cranial nerves** and **31 pairs of spinal nerves** (cervical 8, thoracic 12, lumbar 5, sacral 5, coccygeal 1). The frog has 10 pairs of cranial and 10 pairs of spinal nerves. Longest cranial nerve — **vagus (X)**; largest — **trigeminal (V)**; smallest — **trochlear (IV)**. In adults the spinal cord reaches the first/second lumbar vertebra; beyond it is the "cauda equina".

**Cranial nerves (in order):** I olfactory (S), II optic (S), III oculomotor (M), IV trochlear (M), V trigeminal (mixed), VI abducens (M), VII facial (mixed), VIII auditory/vestibulocochlear (S), IX glossopharyngeal (mixed), X vagus (mixed), XI accessory (M), XII hypoglossal (M).

> **Memory trick:** For the type — "**S**ome **S**ay **M**arry **M**oney, **B**ut **M**y **B**rother **S**ays **B**ig **B**rains **M**atter **M**ore" (S = sensory, M = motor, B = both).

**Brain waves (EEG — Hans Berger, 1929):** alpha (8–13 Hz, relaxed, eyes closed), beta (>13 Hz, active thinking), theta (4–7 Hz), delta (<4 Hz, deep sleep).

## 8. Autonomic Nervous System

| Feature | Sympathetic | Parasympathetic |
|---|---|---|
| Origin | Thoracolumbar (T1–L2) | Craniosacral (cranial nerves III, VII, IX, X and S2–S4) |
| Position of ganglia | Near the spinal cord (paravertebral chain) | Near/inside the target organ |
| Preganglionic fibre | Short; ACh | Long; ACh |
| Postganglionic fibre | Long; **noradrenaline** (exception: sweat glands — ACh) | Short; ACh |
| State | "Fight or flight" | "Rest and digest" |
| Heart | Rate and force increase | Rate decreases (vagus) |
| Pupil | Dilates (mydriasis) | Constricts (miosis) |
| Bronchioles | Dilate | Constrict |
| Digestion / saliva | Decreases / thick | Increases / more watery |
| Urinary bladder | Relaxed (urine retained) | Contracted |
| Liver | Glycogen breakdown | Glycogen formation |

Adrenal medulla = a modified sympathetic ganglion (preganglionic fibres reach it directly).

> **PYQ (UP PGT 2026):** On a sudden rise in arterial pressure, heart rate is adjusted reflexly without conscious control. Which explanation links heart structure to the neural regulation of the heartbeat?
> (A) Carotid and aortic baroreceptors increase vagal activity, reducing SA node firing and heart rate
> (B) Baroreceptors activate sympathetic outflow, causing tachycardia
> (C) The SA node slows due to reduced venous return without autonomic control
> (D) Raised pressure directly stimulates ventricular muscle and increases the rate without neural input
> Reasoned answer (official key not available): **(A)** — baroreceptor reflex (cardio-inhibitory centre of the medulla → vagus → SA node). More detail: [Heart and Circulation](/interview/up-pgt/jeev-vigyan/jantu-2/hriday-aur-parisancharan).

## 9. Eye — vision

**Three layers:**

| Layer | Parts | Function |
|---|---|---|
| Outer — fibrous | **Sclera** (posterior 5/6), **cornea** (anterior, transparent, avascular — less rejection in transplants) | Protection, refraction (most refraction occurs at the cornea) |
| Middle — vascular (uvea) | **Choroid**, **ciliary body** — ciliary muscle (accommodation) and secretion of aqueous humour, **iris** — size of the pupil | Nutrition, accommodation, control of light |
| Inner — nervous | **Retina** | Light reception |

- **Lens:** transparent, biconvex, crystallin proteins; attached to the ciliary body by the suspensory ligaments (zonule).
- **Aqueous humour:** between the cornea and lens; drains through the **canal of Schlemm**; blockage → rise in intraocular pressure → **glaucoma**.
- **Vitreous humour:** behind the lens, jelly-like.
- The centre of the **macula lutea (yellow spot)** is the **fovea centralis** — only cones, sharpest vision. **Blind spot (optic disc)** — exit of the optic nerve, no photoreceptors.

**Cell layers of the retina (in the direction of light):** ganglion cells (their axons form the optic nerve) → bipolar cells → photoreceptors (rods and cones) → pigment epithelium. Horizontal and amacrine cells lie in between. That is, the vertebrate retina is "inverted".

| Feature | Rods | Cones |
|---|---|---|
| Number (human) | ≈ 120 million | ≈ 6 million |
| Pigment | **Rhodopsin (visual purple)** = opsin (scotopsin) + 11-cis retinal | **Iodopsin**/photopsin — red, green, blue (3 types) |
| Vision | Dim light (scotopic), black and white | Bright light (photopic), colour, sharpness |
| Location | More at the periphery of the retina; absent in the fovea | Maximum in the fovea |
| Sensitivity | Very high | Low |
| Deficiency causes | Night blindness (vitamin A) | Colour blindness (X-linked) |

**Phototransduction — steps:**

1. Light → **11-cis retinal → all-trans retinal** in rhodopsin (the only light-dependent step); metarhodopsin-II becomes active.
2. Active rhodopsin → activates the G-protein **transducin**.
3. Transducin → activates **cGMP phosphodiesterase (PDE)** → cGMP falls.
4. cGMP-gated Na⁺ channels close → the rod becomes **hyperpolarised** (in the dark, because of the "dark current", the rod stays depolarised, ≈ −40 mV, and releases glutamate).
5. Glutamate release falls → the signal passes through bipolar and ganglion cells to the brain (occipital lobe).
6. Retinal separates from opsin (bleaching) and is converted back to 11-cis (in the pigment epithelium; from vitamin A = retinol).

> **Exam angle:** When light falls, photoreceptors are **hyperpolarised**, not depolarised — this is a trap in statement-based questions. George Wald — chemistry of visual pigments, Nobel 1967 (with Granit and Hartline). In dark adaptation, regeneration of rhodopsin takes 20–30 minutes.

**Accommodation:** for a near object the ciliary muscle **contracts** → suspensory ligaments slacken → the lens becomes more convex (focal length decreases). Near point ≈ 25 cm.

| Eye defect | Cause | Correction |
|---|---|---|
| Myopia (short-sightedness) | Eyeball elongated or lens too convex; image forms in front of the retina | Concave lens |
| Hypermetropia (long-sightedness) | Eyeball short; image forms behind the retina | Convex lens |
| Presbyopia | Lens elasticity decreases with age | Convex / bifocal |
| Astigmatism | Uneven curvature of the cornea | Cylindrical lens |
| Cataract | Lens becomes opaque | Lens implant (IOL) |
| Glaucoma | Rise in intraocular pressure | Drugs/surgery |

## 10. Ear — hearing and balance

| Part | Structures |
|---|---|
| External ear | Pinna, external auditory canal (cerumen/wax glands), tympanic membrane |
| Middle ear | Three ossicles — **malleus (hammer) → incus (anvil) → stapes (stirrup)**; the stapes is attached to the oval window; **Eustachian tube** (from the pharynx; equalises pressure); pressure amplification ≈ 20 times (tympanic membrane area ≈17 times that of the oval window + lever action) |
| Internal ear (labyrinth) | Membranous labyrinth (endolymph — rich in K⁺) inside the bony labyrinth (filled with perilymph); **cochlea** (hearing) and **vestibular apparatus** (balance) |

**Cochlea:** a spiral of ≈ 2¾ turns; three chambers — **scala vestibuli** (upper, perilymph; from the oval window), **scala media / cochlear duct** (middle, endolymph), **scala tympani** (lower, perilymph; ends at the round window). The upper and lower chambers join at the apex through the **helicotrema**. **Reissner's membrane** lies between the scala vestibuli and media; the **basilar membrane** between the media and tympani.

**Organ of Corti:** the hearing receptor on the basilar membrane — **hair cells** (inner, 1 row ≈ 3,500 — the main sensory cells; outer, 3 rows ≈ 12,000 — amplifiers, prestin protein), with the **tectorial membrane** above. Sound → basilar membrane vibrates → stereocilia bend against the tectorial membrane → K⁺ channels open (K⁺ from endolymph) → hair cell depolarises → auditory nerve → auditory cortex of the temporal lobe.

- **Place theory:** high frequency → near the base (narrow, stiff basilar membrane); low frequency → near the apex (wide, flexible). **Georg von Békésy** — Nobel 1961.
- Human hearing range: **20 Hz – 20,000 Hz**. Bats and dolphins — ultrasonic echolocation; elephants — infrasonic.

**Vestibular apparatus (balance):**

| Structure | Receptor | Sensation |
|---|---|---|
| Three semicircular canals — mutually perpendicular | **Crista ampullaris** (cupula) in the ampulla | Rotational/angular acceleration (turning of the head) — **dynamic balance** |
| Utricle and saccule | **Macula** — otoliths (calcium carbonate particles, otoconia) | Gravity, linear acceleration, head position — **static balance** |

> **Common mistake:** The cochlea takes no part in balance; the semicircular canals do not hear sound. Fishes have the lateral line system for sensing water vibrations; it too has neuromast hair cells.

## 11. Taste, smell and skin sensation

- **Taste (gustation):** taste buds lie in the papillae of the tongue — fungiform, circumvallate (vallate, most taste buds), foliate; filiform papillae have no taste buds. Five basic tastes — sweet, sour, salty, bitter, **umami** (glutamate; Kikunae Ikeda, 1908). Sweet, bitter, umami — G-protein-coupled receptors (T1R, T2R; gustducin); salty (Na⁺ ENaC) and sour (H⁺) — ion channels. The "tongue map" is considered a myth — all regions detect all tastes.
- **Smell (olfaction):** bipolar olfactory neurons in the olfactory epithelium (roof of the nasal cavity) — the only neurons regularly renewed in adults (in ≈ 1–2 months); ≈ 400 functional olfactory receptor genes (G-protein G_olf → cAMP) — **Richard Axel & Linda Buck**, Nobel 2004. Signals go directly to the olfactory bulb → olfactory cortex, **not through the thalamus**. **Jacobson's organ** for pheromone sensing — Chapter 07.
- **Skin receptors:** Meissner's corpuscles (light touch), Pacinian corpuscles (pressure and vibration; onion-like layers), Ruffini endings (stretch/warmth), Krause end bulbs (cold), Merkel discs (sustained touch), free nerve endings (pain — nociceptors). TRPV1 (capsaicin, heat) and PIEZO (touch) — **Julius & Patapoutian**, Nobel 2021.
- **Proprioceptors:** muscle spindle (length), Golgi tendon organ (tension).

**Classification of receptors:** mechanoreceptor, chemoreceptor, photoreceptor, thermoreceptor, nociceptor (pain), electroreceptor (ampullae of Lorenzini of sharks), magnetoreceptor (migratory birds).

## Traps and exceptions

- At resting potential the inside is **negative**; the Na⁺/K⁺ pump moves 3 Na⁺ out : 2 K⁺ in — an option with the reverse ratio is wrong.
- The height of the action potential does not depend on stimulus strength; strength is encoded by frequency.
- The absolute refractory period is due to Na⁺ channel **inactivation**, not to K⁺.
- In saltatory conduction the impulse is "generated" at the nodes, not under the myelin.
- The sympathetic postganglionic transmitter is usually noradrenaline, but ACh at sweat glands.
- In light the rod hyperpolarises and glutamate release **decreases**.
- No photoreceptors at the blind spot; no rods at the fovea.
- For near vision the ciliary muscle **contracts**, the suspensory ligaments **slacken**, and the lens becomes **thicker**.
- Smell is the only sense that does not go directly to the thalamus.
- The frog has 10 pairs of cranial nerves; mammals, birds and reptiles have 12.
- The vagus (X) is the largest part of the parasympathetic system and lowers heart rate.
- "Thicker fibre = faster" is true, but a thin myelinated fibre can be faster than even a thick non-myelinated fibre.

## Quick revision

- Resting potential ≈ −70 mV; mainly due to K⁺ leak.
- Na⁺/K⁺-ATPase: 3 Na⁺ out, 2 K⁺ in, 1 ATP; Jens Skou (Nobel 1997).
- Threshold ≈ −55 mV; peak ≈ +30 mV.
- Depolarisation = Na⁺ entry; repolarisation = K⁺ exit.
- Hodgkin–Huxley: squid giant axon, Nobel 1963.
- TTX blocks Na⁺ channels, TEA blocks K⁺ channels.
- Saltatory conduction — nodes of Ranvier; up to 120 m/s.
- Myelin in the CNS by oligodendrocytes, in the PNS by Schwann cells.
- Term synapse — Sherrington; first transmitter ACh — Otto Loewi (1921).
- Main excitatory glutamate; main inhibitory GABA (brain), glycine (spinal cord).
- Parkinson's — dopamine deficiency (substantia nigra).
- Knee-jerk = monosynaptic reflex.
- Dorsal root sensory, ventral root motor (Bell–Magendie).
- CSF — choroid plexus; the aqueduct of Sylvius joins the third and fourth ventricles.
- Hypothalamus: temperature, hunger, thirst, circadian (SCN).
- Medulla: respiratory, cardiac, vasomotor centres; pons: pneumotaxic.
- Cerebellum: balance and coordination.
- 12 pairs of cranial, 31 pairs of spinal nerves.
- Rods — rhodopsin, dim light; cones — colour, fovea.
- 11-cis → all-trans retinal; transducin → PDE → cGMP falls → hyperpolarisation.
- Myopia → concave lens; hypermetropia → convex lens.
- Organ of Corti — on the basilar membrane; Békésy (Nobel 1961).
- Semicircular canals — dynamic; utricle–saccule — static balance.
- Hearing range 20–20,000 Hz.
- Olfactory receptors — Axel and Buck (Nobel 2004).

## Practice questions (with answers)

1. The resting potential is mainly determined by the permeability to which ion? — **K⁺** (leak channels).
2. How many ions does the Na⁺/K⁺ pump move per ATP? — **3 Na⁺ out, 2 K⁺ in**.
3. Where does the action potential begin? — **Axon hillock** (dense Na⁺ channels).
4. Cause of the absolute refractory period? — **Inactivation of Na⁺ channels**.
5. What does TTX act on? — **Voltage-gated Na⁺ channels** (blocks them).
6. In which fibres does saltatory conduction occur? — **Myelinated** (node to node).
7. Which ion enters for the release of synaptic vesicles? — **Ca²⁺**.
8. Main inhibitory transmitter of the spinal cord? — **Glycine** (blocked by strychnine).
9. Who did the "Vagusstoff" experiment? — **Otto Loewi** (ACh, 1921).
10. Deficiency of which transmitter in Parkinson's disease? — **Dopamine**.
11. Where is the pneumotaxic centre of respiration? — **Pons**.
12. Channel joining the third and fourth ventricles? — **Aqueduct of Sylvius** (cerebral aqueduct).
13. Main centre of the circadian rhythm? — **Suprachiasmatic nucleus** (hypothalamus).
14. Longest cranial nerve? — **Vagus (X)**.
15. Postganglionic transmitter of the sympathetic system (usually)? — **Noradrenaline** (sweat glands are the exception).
16. Pigment for dim-light vision? — **Rhodopsin** (rods).
17. Electrical state of a rod cell when light falls on it? — **Hyperpolarised** (cGMP-gated Na⁺ channels close).
18. Glaucoma is related to what? — **Blocked drainage of aqueous humour, raised intraocular pressure** (canal of Schlemm).
19. On which membrane does the organ of Corti lie? — **Basilar membrane**.
20. Receptors for static balance? — **Macula of the utricle and saccule** (otoliths).
