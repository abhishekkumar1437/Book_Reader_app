---
title: Nervous System and Sense Organs
part: Movement and Coordination
summary: Neuron types and glia, the resting potential, the action potential with its ionic basis and graph, saltatory conduction, synapses and neurotransmitters, the human brain part by part, spinal cord and reflex arc, autonomic nervous system, the eye (rods, cones, pigments, mechanism of vision, defects), the ear (hearing and balance), and other sense organs.
---

This chapter covers NCERT class 11 "Neural Control and Coordination" and climbs to B.Sc./Guyton points: ionic basis of the resting and action potentials, refractory periods, conduction speeds, neurotransmitter chemistry, the Bell–Magendie law, the phototransduction cascade and cochlear mechanics. TRE 2.0 asked acetylcholine at the synapse (Q96), saltatory conduction (Q97) and colour vision (Q105).

> **In simple words:** A nerve cell (neuron) is like an electric cable with a battery. At rest its inside is negative (about −70 mV). When stimulated, sodium ions rush in and the inside briefly becomes positive — this "spike" (action potential) runs along the fibre. At the end, the neuron releases a chemical (neurotransmitter) that crosses a tiny gap (synapse) to the next cell. The brain and spinal cord process signals; eyes and ears convert light and sound into such spikes.

Basic version: [Human Physiology — Control, Movement and Reproduction (Class 9–10)](/interview/bpsc-tre/class-9-10-science/biology/human-physiology-control-movement-and-reproduction).

## 1. Neural system — organisation

- Lower invertebrates: simple **nerve net** (*Hydra*); insects: brain + ganglia + ventral nerve cord; vertebrates: well-developed brain and dorsal hollow nerve cord.
- Human neural system:
  - **Central nervous system (CNS)** — brain + spinal cord; site of information processing and control.
  - **Peripheral nervous system (PNS)** — all nerves linked to the CNS: **afferent** fibres (tissues/organs → CNS) and **efferent** fibres (CNS → tissues).
  - PNS efferent part = **somatic** (CNS → skeletal muscles; voluntary) + **autonomic** (CNS → involuntary organs and smooth muscle) → **sympathetic** and **parasympathetic**.
  - **Visceral nervous system** — part of the PNS with the whole complex of nerves, fibres, ganglia and plexuses linking the CNS to the viscera.

## 2. The neuron

A neuron has a **cell body (cyton/soma)** with cytoplasm containing **Nissl's granules** (clusters of ribosomes/RER), **dendrites** (short fibres carrying impulses **towards** the cell body; also contain Nissl's granules) and an **axon** (long fibre carrying impulses **away** from the cell body, ending in branches with knob-like **synaptic knobs** full of **synaptic vesicles** containing neurotransmitters). The axon arises from the **axon hillock** (where action potentials begin).

| Type by processes | Structure | Location |
|---|---|---|
| **Multipolar** | One axon, two or more dendrites | **Cerebral cortex**, motor neurons |
| **Bipolar** | One axon, one dendrite | **Retina** of eye, olfactory epithelium |
| **Unipolar / pseudounipolar** | Cell body with one process (axon only) | Usually in the **embryonic stage**; dorsal root ganglion sensory neurons are pseudounipolar |

### Myelinated and non-myelinated fibres

- **Myelinated** — axon enveloped by **Schwann cells** (in PNS; **oligodendrocytes** in the CNS) forming a **myelin sheath**. Gaps between adjacent sheaths are **nodes of Ranvier**. Found in **spinal and cranial nerves**.
- **Non-myelinated** — axon enclosed by a Schwann cell that does not form a myelin sheath around it; common in the **autonomic** and somatic neural systems.
- **Neurilemma (neurolemma)** — outermost Schwann-cell covering of peripheral nerve fibres; helps regeneration (absent in CNS fibres, which do not regenerate well).

### Neuroglia (glial cells) — B.Sc.

Supporting cells, more numerous than neurons: **astrocytes** (blood–brain barrier, support), **oligodendrocytes** (CNS myelin), **microglia** (macrophages of CNS), **ependymal cells** (line ventricles, make CSF), **Schwann cells** (PNS myelin).

## 3. Resting membrane potential

<div class="formula">

At rest, the axonal membrane is **polarised**: inside **negative**, outside positive. **Resting potential ≈ −70 mV** (Guyton: −90 mV in large myelinated fibres; −70 mV is the textbook value).

Inside the axon: **high K⁺**, negatively charged proteins, low Na⁺. Outside: **high Na⁺**, high Cl⁻, low K⁺.

Why: (1) membrane at rest is **more permeable to K⁺** (leak channels) than to Na⁺ — K⁺ leaks out leaving negative charge inside; (2) **Na⁺/K⁺ pump** (Na⁺-K⁺ ATPase) actively transports **3 Na⁺ out for 2 K⁺ in**, using 1 ATP; (3) large anions (proteins) cannot leave.

</div>

## 4. The action potential (nerve impulse)

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="45" y1="20" x2="45" y2="185"/>
  <line x1="45" y1="185" x2="400" y2="185"/>
  <line x1="45" y1="77" x2="400" y2="77" stroke-dasharray="2 4" stroke-width="0.8"/>
  <line x1="45" y1="134" x2="400" y2="134" stroke-dasharray="4 3" stroke-width="0.8"/>
  <polyline points="50,150 110,150 120,134 135,40 150,77 165,150 180,166 215,150 390,150" stroke-width="2"/>
  <text x="5" y="44" fill="currentColor" stroke="none" font-size="10">+35</text>
  <text x="15" y="81" fill="currentColor" stroke="none" font-size="10">0</text>
  <text x="5" y="138" fill="currentColor" stroke="none" font-size="10">−55</text>
  <text x="5" y="154" fill="currentColor" stroke="none" font-size="10">−70</text>
  <text x="290" y="130" fill="currentColor" stroke="none" font-size="10">threshold</text>
  <text x="240" y="165" fill="currentColor" stroke="none" font-size="10">resting potential</text>
  <text x="145" y="38" fill="currentColor" stroke="none">peak (Na⁺ in)</text>
  <text x="62" y="100" fill="currentColor" stroke="none" font-size="10">depolarisation</text>
  <text x="160" y="110" fill="currentColor" stroke="none" font-size="10">repolarisation (K⁺ out)</text>
  <text x="185" y="180" fill="currentColor" stroke="none" font-size="10">hyperpolarisation</text>
  <text x="330" y="198" fill="currentColor" stroke="none" font-size="10">time (~2 ms)</text>
  <text x="50" y="15" fill="currentColor" stroke="none" font-size="10">membrane potential (mV)</text>
</svg>

| Phase | What happens |
|---|---|
| **Stimulus → threshold** | A stimulus makes the inside less negative; if it reaches the **threshold (~−55 mV)**, voltage-gated Na⁺ channels open |
| **Depolarisation** | Membrane becomes **freely permeable to Na⁺** → rapid **Na⁺ influx** → polarity reverses: inside becomes **positive (~+30 to +40 mV)**. This is the **action potential** at that site |
| **Repolarisation** | Na⁺ channels close (inactivate), **voltage-gated K⁺ channels open** → **K⁺ efflux** → inside negative again |
| **Hyperpolarisation (undershoot)** | K⁺ channels close slowly → potential dips below rest (~−80 to −90 mV) |
| **Restoration** | Na⁺/K⁺ pump and leak channels restore ion distribution |

- **All-or-none law**: below threshold → no impulse; at or above threshold → full-size action potential. Stronger stimuli give **more frequent** impulses, not bigger ones.
- **Absolute refractory period** — no second impulse possible however strong (Na⁺ channels inactivated); **relative refractory period** — only a stronger-than-normal stimulus works. Refractory periods make the impulse travel **one way**.
- The impulse travels as a wave: local currents depolarise the next patch of membrane.
- Ionic basis was worked out by **Hodgkin and Huxley** using the **squid giant axon** (Nobel 1963).

### Saltatory conduction

- In **myelinated** fibres, the myelin insulates the axon; ion exchange happens only at the **nodes of Ranvier**. So the impulse "**jumps**" from node to node — **saltatory conduction** (Latin *saltare*, to jump).
- Faster and energy-saving: myelinated fibres conduct up to **~120 m/s**; non-myelinated fibres ~**0.5–2 m/s**.
- Speed also increases with **axon diameter** (squid giant axon ~0.5–1 mm wide is fast without myelin).
- Demyelinating disease: **multiple sclerosis** (CNS).

> **PYQ:** TRE 2.0 (2023) Q97 asked: "Jumping movement of nerve conduction is — (A) active phase (B) saltatory conduction (C) neurotransmission." **Official answer: (B) saltatory conduction.**

## 5. The synapse

A **synapse** = junction between the **pre-synaptic** neuron's membrane and the **post-synaptic** neuron's (or muscle/gland's) membrane, which may be separated by a gap called the **synaptic cleft**.

| | **Electrical synapse** | **Chemical synapse** |
|---|---|---|
| Gap | Membranes very close; **gap junctions** | **Synaptic cleft** (~20 nm) |
| Transmission | Current flows directly | Via **neurotransmitters** |
| Speed | **Faster** | Slower (synaptic delay ~0.5 ms) |
| Direction | Often both ways | **One way** |
| Frequency | **Rare** in our system | Common |

**Steps at a chemical synapse:**

1. Impulse reaches the **axon terminal**.
2. Voltage-gated **Ca²⁺ channels** open; Ca²⁺ enters.
3. Synaptic vesicles move to the membrane, fuse with it and release **neurotransmitter** into the cleft (**exocytosis**).
4. Neurotransmitter binds **specific receptors** on the post-synaptic membrane → ion channels open.
5. The new potential may be **excitatory** (EPSP — depolarising; Na⁺ in) or **inhibitory** (IPSP — hyperpolarising; Cl⁻ in or K⁺ out).
6. The transmitter is removed: **acetylcholine** is broken down by **acetylcholinesterase**; others are taken back (reuptake).

> **PYQ:** TRE 2.0 (2023) Q96 asked: "Which of the following is released at the synaptic junction during neural transmission? — (A) Adrenaline (B) Acetylcholine (C) Testosterone." **Official answer: (B) acetylcholine.** Note: **noradrenaline** (not adrenaline) is the sympathetic post-ganglionic transmitter; adrenaline is mainly a hormone of the adrenal medulla.

### Neurotransmitters

| Neurotransmitter | Chemical nature | Role / note |
|---|---|---|
| **Acetylcholine (ACh)** | Choline ester | **Neuromuscular junction**, all autonomic ganglia, parasympathetic endings; first neurotransmitter found — **Otto Loewi (1921)**, "vagusstoff" (Nobel 1936 with Dale) |
| **Noradrenaline (norepinephrine)** | Catecholamine (amine) | **Sympathetic** post-ganglionic endings; alertness |
| **Dopamine** | Catecholamine | Movement, reward; **loss in Parkinson's disease** |
| **Serotonin (5-HT)** | Indolamine (from tryptophan) | Mood, sleep; low in depression |
| **GABA** | Amino acid | **Main inhibitory** transmitter of the brain |
| **Glycine** | Amino acid | Inhibitory in **spinal cord** (strychnine blocks it) |
| **Glutamate** | Amino acid | **Main excitatory** transmitter of the brain |
| **Endorphins, enkephalins** | Peptides | Natural pain-killers (bind opioid receptors) |

## 6. Central nervous system — the brain

- Protected by the **skull (cranium)** and three **meninges**: outer **dura mater**, middle thin **arachnoid**, inner **pia mater** (in contact with brain tissue). **Cerebrospinal fluid (CSF)** in the subarachnoid space and ventricles cushions the brain.
- Adult brain weight ~**1.3–1.4 kg**; it uses ~20% of the body's O₂.

<div class="formula">

| Division | Part | Functions |
|---|---|---|
| **Forebrain** | **Cerebrum** — two hemispheres joined by the **corpus callosum** (a tract of nerve fibres); outer **cerebral cortex = grey matter** (convoluted), inner **white matter** | Thinking, memory, intelligence, voluntary movement; motor areas, sensory areas, large **association areas** (intersensory associations, memory, communication); lobes — frontal (motor, Broca's speech area), parietal (somatic sense), temporal (hearing, Wernicke's area), occipital (**vision**) |
| Forebrain | **Thalamus** | Major coordinating/relay centre for **sensory and motor signalling**; cerebrum wraps around it |
| Forebrain | **Hypothalamus** | Controls **body temperature**, urge to **eat and drink**; contains **neurosecretory cells** making hypothalamic hormones; controls the pituitary |
| Forebrain | **Limbic system** (amygdala, hippocampus, inner cerebral parts) | **Emotions** (excitement, pleasure, rage, fear), sexual behaviour, motivation, **memory** (hippocampus) |
| **Midbrain** | Between thalamus/hypothalamus and pons; canal = **cerebral aqueduct**; dorsal **corpora quadrigemina** (four round swellings) | Visual and auditory reflexes (superior colliculi = vision, inferior = hearing) |
| **Hindbrain** | **Pons** | Fibre tracts linking parts of brain; **pneumotaxic centre** (breathing) |
| Hindbrain | **Cerebellum** ("little brain"; very convoluted surface; white matter in a tree-like pattern = **arbor vitae**) | **Balance, posture, coordination** of muscular movements; more neurons than the rest of the brain |
| Hindbrain | **Medulla oblongata** (continues as the spinal cord) | Centres for **respiration, cardiovascular reflexes, gastric secretion**; vomiting, coughing, sneezing, swallowing |

**Brain stem** = midbrain + pons + medulla oblongata — connects brain and spinal cord.

</div>

- Ventricles: two lateral (in cerebrum), third (diencephalon), fourth (hindbrain), connected by the cerebral aqueduct; CSF made by **choroid plexuses**.
- **Cranial nerves**: **12 pairs** in humans (and reptiles, birds, mammals); **10 pairs** in fishes and amphibians. Vagus (X) — the longest and widest-ranging.
- **EEG** (electroencephalogram) records brain waves — Hans Berger (1929).

## 7. Spinal cord and reflex action

- Spinal cord runs in the **neural canal** of the vertebral column from the medulla to about the **1st–2nd lumbar vertebra**; ends as **cauda equina**.
- In the spinal cord, **grey matter is inside (butterfly/H-shaped)** and **white matter outside** — the reverse of the cerebrum.
- **31 pairs of spinal nerves**: cervical 8, thoracic 12, lumbar 5, sacral 5, coccygeal 1. All are **mixed** nerves.
- **Bell–Magendie law**: the **dorsal root** carries **sensory** (afferent) fibres (with the **dorsal root ganglion**); the **ventral root** carries **motor** (efferent) fibres.

### Reflex arc

A **reflex action** is an automatic, involuntary, quick response to a peripheral nervous stimulation, without conscious effort, involving part of the CNS (usually the spinal cord).

**Receptor** (sense organ) → **afferent (sensory) neuron** (via dorsal root) → **interneuron** / synapse in the **grey matter of spinal cord** → **efferent (motor) neuron** (via ventral root) → **effector** (muscle or gland).

- **Knee-jerk reflex** — tapping the patellar tendon stretches the quadriceps; it is a **monosynaptic** reflex (sensory neuron synapses directly with the motor neuron).
- Withdrawal from a hot object — **polysynaptic** (with interneurons).
- **Unconditioned reflexes** (inborn — blinking, sneezing, knee jerk) vs **conditioned reflexes** (learned — salivation at a bell; **Ivan Pavlov**, dogs).
- Term "reflex action" — Marshall Hall (1833).

## 8. Autonomic nervous system (ANS)

| Feature | **Sympathetic** | **Parasympathetic** |
|---|---|---|
| Origin | **Thoraco-lumbar** spinal cord | **Cranio-sacral** (cranial nerves III, VII, IX, **X**; sacral nerves) |
| Ganglia | Near the spinal cord (chain) | Near or in the target organ |
| Post-ganglionic transmitter | **Noradrenaline** (adrenergic) | **Acetylcholine** (cholinergic) |
| Overall role | "**Fight or flight**" — emergency | "**Rest and digest**" |
| Heart rate | ↑ | ↓ |
| Pupil | **Dilates** | Constricts |
| Bronchi | Dilate | Constrict |
| Digestion, salivation | ↓ | ↑ |
| Urinary bladder | Relaxes (holds urine) | Contracts (micturition) |
| Blood glucose | ↑ (glycogenolysis) | — |

Pre-ganglionic fibres of **both** divisions release **acetylcholine**. The **adrenal medulla** acts like a modified sympathetic ganglion (releases adrenaline into blood).

## 9. The eye

### Structure

- **Wall of three layers**:
  1. **Sclera** — outer, dense connective tissue; the transparent front part is the **cornea** (no blood vessels — hence easy transplants).
  2. **Choroid** — middle, many blood vessels, bluish; thin over the posterior two-thirds, thick in front forming the **ciliary body**, which continues as the pigmented, opaque **iris** (visible coloured part).
  3. **Retina** — inner, three layers of neural cells — from inside to outside: **ganglion cells, bipolar cells and photoreceptor cells** (rods and cones). Light must pass through ganglion and bipolar cells to reach photoreceptors.
- **Pupil** — aperture in the iris; diameter regulated by iris muscles (sphincter — parasympathetic constriction; dilator — sympathetic).
- **Lens** — transparent, crystalline, biconvex; held by **suspensory ligaments** attached to the ciliary body; shape changed by **ciliary muscles** = **accommodation**.
- **Aqueous humour** — thin watery fluid in the **aqueous chamber** between cornea and lens; **vitreous humour** — transparent gel in the **vitreous chamber** between lens and retina.

### Rods and cones

<div class="formula">

| Feature | **Rods** | **Cones** |
|---|---|---|
| Number | ~**120 million** | ~**6–7 million** |
| Light | **Dim light (scotopic) vision**, twilight | **Daylight (photopic) vision** and **colour vision** |
| Pigment | **Rhodopsin (visual purple)** = opsin + **retinal** (vitamin A aldehyde) | **Iodopsin / photopsins** — three types sensitive to **red, green and blue** light |
| Location | Periphery of the retina | Concentrated in the **fovea** |
| Acuity | Low | High |

</div>

- Sensations of different colours are produced by various combinations of the three cone types and their pigments; equal stimulation of all three gives **white**.
- **Fovea (fovea centralis)** — thinned-out portion of the retina at the centre of the **macula lutea (yellow spot)**, lateral to the blind spot; **only cones**; point of **greatest visual acuity (resolution)**.
- **Blind spot (optic disc)** — where the optic nerve leaves the eye and retinal blood vessels enter; **no photoreceptors**.
- Nocturnal animals (owl) have mainly rods; birds of prey have very many cones in a deep fovea.

> **PYQ:** TRE 2.0 (2023) Q105 asked: "Colour differentiation is done by — (A) rods (B) cones (C) bipolar nerve." **Official answer: (B) cones.**

### Mechanism of vision (phototransduction)

1. Light enters through the cornea and lens and focuses an image on the retina.
2. Light dissociates retinal from opsin: **11-cis-retinal → all-trans-retinal** (photoisomerisation) → **change in opsin's structure**.
3. This changes membrane permeability (in vertebrate photoreceptors, cGMP-gated Na⁺ channels **close** → the cell hyperpolarises — B.Sc.) → potential differences in photoreceptor cells.
4. Signal → bipolar cells → **ganglion cells** → action potentials in the **optic nerve** → **visual cortex** in the **occipital lobe**, where the image is analysed and recognised.
5. In darkness, rhodopsin is re-formed (needs vitamin A) — **dark adaptation** takes several minutes; deficiency → **night blindness**.

### Eye defects

| Defect | Cause | Correction |
|---|---|---|
| **Myopia** (short-sight) | Eyeball too long / lens too curved; image **in front** of retina | **Concave** lens |
| **Hypermetropia** (long-sight) | Eyeball too short; image **behind** retina | **Convex** lens |
| **Presbyopia** | Ageing — lens loses elasticity, weak ciliary muscles | Convex / bifocal lens |
| **Astigmatism** | Irregular curvature of cornea | **Cylindrical** lens |
| **Cataract** | Lens becomes **opaque** | Surgery (artificial lens) |
| **Glaucoma** | Raised pressure of aqueous humour | Drugs, surgery |
| **Colour blindness** | Defective cones (red–green); **X-linked recessive** | Not curable; Ishihara chart test |
| **Night blindness** | Vitamin A deficiency (rhodopsin) | Vitamin A |

## 10. The ear — hearing and balance

### Structure

| Part | Components |
|---|---|
| **Outer ear** | **Pinna** (collects vibrations; elastic cartilage), **external auditory meatus** (canal with wax-secreting ceruminous glands), **tympanic membrane (ear drum)** — connective tissue covered with skin outside and mucus membrane inside |
| **Middle ear** | Three ossicles in a chain — **malleus** (attached to tympanic membrane), **incus**, **stapes** (attached to the **oval window** of the cochlea); they increase the efficiency of sound transmission (~20× amplification). **Eustachian tube** connects the middle ear cavity with the **pharynx** and equalises pressure on both sides of the ear drum |
| **Inner ear (labyrinth)** | Bony labyrinth (filled with **perilymph**) containing the membranous labyrinth (filled with **endolymph**). Parts: **cochlea** (coiled — hearing) and **vestibular apparatus** (balance) |

### Cochlea and organ of Corti

- The membranes of the cochlea — **Reissner's membrane** and **basilar membrane** — divide the surrounding perilymph-filled bony labyrinth into an upper **scala vestibuli** (ends at the **oval window**) and a lower **scala tympani** (ends at the **round window**, which opens to the middle ear). The middle **scala media** contains endolymph.
- The **organ of Corti** sits on the **basilar membrane**; it carries **hair cells** that act as auditory receptors. Hair cells are in rows on the internal side; the basal end is in close contact with afferent nerve fibres. From the apical part of each hair cell project **stereocilia**. Above the rows of hair cells is a thin elastic **tectorial membrane**.

**Mechanism of hearing:** sound waves → external ear → **ear drum vibrates** → ear ossicles → **oval window** → waves in the **perilymph** of the cochlea → ripples in the **basilar membrane** → hair cells bend against the **tectorial membrane** → nerve impulses in afferent neurons → **auditory nerve** (VIII) → **auditory cortex** (temporal lobe). High frequencies are detected near the base of the cochlea, low frequencies near the apex (**place theory**, von Békésy, Nobel 1961).

- Human hearing range: ~**20 Hz – 20,000 Hz**.

### Vestibular apparatus — balance

- Above the cochlea; made of **three semicircular canals** (at right angles to each other) and the **otolith organ** (**saccule and utricle**).
- The base of each canal is swollen as the **ampulla**, which carries a projecting ridge called the **crista ampullaris** with hair cells — detects **rotational (angular) movement** of the head.
- Saccule and utricle carry a projecting ridge called the **macula** with hair cells and **otoliths (otoconia — CaCO₃ crystals)** — detects **linear acceleration and gravity**.
- Crista and macula are the specific receptors of the vestibular apparatus, responsible for **maintenance of balance and posture**.

## 11. Other sense organs

| Sense | Receptor |
|---|---|
| **Smell** (olfaction) | **Olfactory epithelium** in the nasal roof (bipolar neurons); signals to the **olfactory bulbs** (extensions of the limbic system) |
| **Taste** (gustation) | **Taste buds** on the tongue papillae; five basic tastes — sweet, sour, salty, bitter, **umami** |
| **Touch** (light) | **Meissner's corpuscles** (dermal papillae of hairless skin) |
| **Pressure, vibration** | **Pacinian corpuscles** (deep dermis; onion-like layers) |
| Warmth / heat | Ruffini endings |
| Cold | Krause end bulbs |
| **Pain** | **Free nerve endings** (nociceptors) |
| Muscle stretch | Muscle spindles (proprioceptors) |

Receptors classified by stimulus: photoreceptors, mechanoreceptors (ear, touch), chemoreceptors (taste, smell, carotid body), thermoreceptors, nociceptors.

## Traps and exceptions

- **Dendrites carry impulses towards** the cell body; axons **away**.
- **Resting potential: inside negative** due to K⁺ leak and the 3 Na⁺/2 K⁺ pump; **depolarisation is Na⁺ in**, repolarisation **K⁺ out**.
- **All-or-none**: stronger stimulus = more impulses per second, not bigger impulses.
- **Saltatory conduction** happens only in **myelinated** fibres, at **nodes of Ranvier**.
- **Schwann cells** myelinate the PNS; **oligodendrocytes** myelinate the CNS.
- **Electrical synapses are faster** but rare; chemical synapses are one-way.
- **Acetylcholinesterase** breaks down ACh; nerve gases and organophosphate pesticides block it.
- **Sympathetic post-ganglionic transmitter is noradrenaline**, except to sweat glands (ACh).
- **Grey matter outside in the brain, inside in the spinal cord.**
- **Corpus callosum** joins the two cerebral hemispheres; **corpora quadrigemina** are in the midbrain.
- **Cerebellum = balance**; **medulla = breathing and heartbeat**; **hypothalamus = temperature, hunger, thirst**.
- **Dorsal root = sensory; ventral root = motor** (Bell–Magendie).
- **Rods = dim light (rhodopsin, vitamin A); cones = colour (three pigments)**.
- **Fovea has only cones**; **blind spot has no photoreceptors**.
- In the retina, light passes **ganglion → bipolar → photoreceptor** (photoreceptors are outermost).
- **Eustachian tube** links the middle ear to the **pharynx**, not to the inner ear.
- **Cochlea = hearing; semicircular canals, utricle, saccule = balance**.
- **Stapes** — smallest bone; it touches the **oval window**.

## Quick revision

1. CNS = brain + spinal cord; PNS = somatic + autonomic.
2. Nissl's granules — in cell body and dendrites, absent in the axon.
3. Multipolar — cerebral cortex; bipolar — retina; unipolar — embryo.
4. Myelin by **Schwann cells** (PNS), **oligodendrocytes** (CNS); gaps = **nodes of Ranvier**.
5. Resting potential ≈ **−70 mV**; Na⁺/K⁺ pump **3 Na⁺ out, 2 K⁺ in**.
6. Depolarisation — **Na⁺ influx**; repolarisation — **K⁺ efflux**.
7. Threshold ~**−55 mV**; peak ~**+30 to +40 mV**.
8. Saltatory conduction — **jumping** from node to node; up to ~120 m/s.
9. First neurotransmitter — **acetylcholine** (Otto Loewi, 1921).
10. Main inhibitory transmitter — **GABA**; main excitatory — **glutamate**.
11. Dopamine loss — **Parkinson's disease**.
12. Meninges — dura, arachnoid, pia.
13. Corpus callosum — joins cerebral hemispheres.
14. Hypothalamus — temperature, hunger, thirst, neurohormones.
15. Corpora quadrigemina — midbrain; visual and auditory reflexes.
16. Cerebellum — balance; medulla — respiration, heart, gastric secretion.
17. Cranial nerves **12 pairs**; spinal nerves **31 pairs**.
18. Knee jerk — **monosynaptic** reflex.
19. Sympathetic — thoraco-lumbar, noradrenaline; parasympathetic — cranio-sacral, ACh.
20. Rods — **rhodopsin**, dim light; cones — **colour** (red, green, blue).
21. Fovea — only cones; blind spot — no receptors.
22. Ear ossicles — malleus, incus, stapes; Eustachian tube → pharynx.
23. Organ of Corti on the **basilar membrane**; tectorial membrane above.
24. Crista ampullaris (rotation) and macula (linear/gravity) — balance.

## Practice with answers

1. Which part of the neuron contains Nissl's granules? — **Cell body (and dendrites)**.
2. What type of neurons occur in the retina? — **Bipolar neurons**.
3. Which ions rush in during depolarisation? — **Na⁺**.
4. How many Na⁺ and K⁺ does the pump move per ATP? — **3 Na⁺ out, 2 K⁺ in**.
5. Why can an impulse not travel backwards? — **Refractory period** of the membrane just behind it.
6. Where does ion exchange occur in a myelinated fibre? — **Nodes of Ranvier**.
7. Which enzyme destroys acetylcholine in the cleft? — **Acetylcholinesterase**.
8. Which ion entry triggers neurotransmitter release? — **Ca²⁺**.
9. Which part of the brain is the relay centre for sensory signals? — **Thalamus**.
10. Which part of the brain coordinates balance and posture? — **Cerebellum**.
11. Where are the centres for breathing and heartbeat? — **Medulla oblongata**.
12. Which root of a spinal nerve carries sensory fibres? — **Dorsal root**.
13. Which division of the ANS dilates the pupil? — **Sympathetic**.
14. Name the visual pigment of rods. — **Rhodopsin** (visual purple).
15. Which vitamin is needed to form rhodopsin? — **Vitamin A** (retinal).
16. Which part of the retina gives the sharpest vision? — **Fovea centralis**.
17. Which lens corrects myopia? — **Concave lens**.
18. Which canal connects the middle ear to the pharynx? — **Eustachian tube**.
19. On which membrane does the organ of Corti rest? — **Basilar membrane**.
20. Which receptor detects rotational movement of the head? — **Crista ampullaris** (in the ampullae of semicircular canals).
