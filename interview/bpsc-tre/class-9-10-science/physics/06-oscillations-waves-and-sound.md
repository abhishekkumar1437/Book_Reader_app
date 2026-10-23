---
title: Oscillations, Waves and Sound
part: Waves
summary: Simple harmonic motion, pendulums and springs, resonance, the wave equation, speed of sound and its temperature dependence, Doppler effect, beats, standing waves, decibels, and group versus phase velocity.
---

This chapter covers class 9 sound, class 11 oscillations and waves, and the B.Sc. idea of **group and phase velocity**.
TRE asks one-liners ("sound travels fastest in…", "unit of sound level…") and short numericals such as speed of sound at a new temperature or frequency from a wave equation.

> **In simple words:** An oscillation is a to-and-fro motion that repeats. A wave is a disturbance that carries energy from place to place without carrying the medium along. Sound is a mechanical, longitudinal wave — it needs a medium and cannot travel in vacuum.

GS-level revision: [Heat, light and sound (BPSC CCE shelf)](/interview/bpsc-2027/science/heat-light-and-sound).

## 1. Periodic motion and SHM

- **Periodic motion:** repeats after a fixed time, the **time period T** (s). **Frequency** f = 1/T (Hz). **Angular frequency** ω = 2πf (rad/s).
- **Oscillatory motion:** periodic motion about a mean (equilibrium) position.
- **Simple harmonic motion (SHM):** restoring force (and acceleration) is proportional to displacement and directed towards the mean position: **F = −kx**, a = −ω²x.

<div class="formula">

| Quantity | Formula |
|---|---|
| Displacement | x = A sin(ωt + φ) |
| Velocity | v = ω√(A² − x²); maximum v = Aω at mean position |
| Acceleration | a = −ω²x; maximum a = Aω² at extreme position |
| Time period | T = 2π/ω = 2π √(displacement/acceleration) |
| Spring–mass | T = 2π√(m/k) |
| Simple pendulum | T = 2π√(L/g) (small angles) |
| Total energy | E = ½ k A² = ½ m ω² A² (constant) |
| KE at x | ½ k (A² − x²); PE at x = ½ k x² |

</div>

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="40" y1="100" x2="400" y2="100"/>
  <line x1="50" y1="20" x2="50" y2="180"/>
  <path d="M 50 100 Q 90 20 130 100 Q 170 180 210 100 Q 250 20 290 100 Q 330 180 370 100"/>
  <line x1="90" y1="60" x2="90" y2="100" stroke-dasharray="3 3" stroke-width="1"/>
  <text x="95" y="80" fill="currentColor" stroke="none">A</text>
  <line x1="50" y1="190" x2="210" y2="190" stroke-width="1"/>
  <text x="120" y="186" fill="currentColor" stroke="none">T</text>
  <text x="380" y="96" fill="currentColor" stroke="none">t</text>
  <text x="56" y="20" fill="currentColor" stroke="none">x</text>
  <text x="225" y="40" fill="currentColor" stroke="none">x = A sin ωt</text>
  <text x="225" y="160" fill="currentColor" stroke="none">v max at x = 0; a max at x = ±A</text>
</svg>

**Worked numerical 1.** Time period of a simple pendulum of length 1 m (g = 9.8 m/s²)?
T = 2π√(1/9.8) = 6.283 × 0.319 = **≈ 2.0 s**. A pendulum with T = 2 s is a **seconds pendulum** (L ≈ 0.99 m).

**Worked numerical 2.** A 0.5 kg mass hangs on a spring of k = 50 N/m. Time period?
T = 2π√(0.5/50) = 2π × 0.1 = **0.628 s**.

**Worked numerical 3.** SHM with A = 0.1 m, ω = 10 rad/s. Maximum speed and acceleration?
v_max = Aω = **1 m/s**; a_max = Aω² = **10 m/s²**.

Pendulum facts that are asked:
- T does **not** depend on the mass of the bob or (for small swings) the amplitude — Galileo's observation of the swinging lamp.
- T ∝ √L: length ×4 → T ×2.
- T ∝ 1/√g: on the moon (g/6) the pendulum clock goes **slow** (T × √6 ≈ 2.45). In a freely falling lift g_eff = 0 → T infinite (no oscillation). In a lift accelerating up, g_eff = g + a → T decreases.
- Pendulum clocks go slow in summer (length increases) and fast in winter.
- A girl on a swing who stands up raises her centre of mass → effective length decreases → T decreases.
- Spring cut into two halves: each half has k doubled.

## 2. Damped, forced oscillations and resonance

| Type | Meaning | Example |
|---|---|---|
| Free | Oscillates at its own natural frequency, no external force | Plucked string, struck tuning fork |
| Damped | Amplitude decreases with time due to friction/air resistance; energy lost | Pendulum in air, shock absorbers |
| Forced | Oscillates at the frequency of an external periodic force | Sound board of a guitar |
| Resonance | Driving frequency = natural frequency → amplitude maximum | Tuning a radio, Tacoma Narrows Bridge collapse (1940), soldiers break step on a bridge, glass shattered by a singer |

**Sharpness of resonance** is given by the quality factor Q: low damping → tall, sharp peak; high damping → flat, broad peak. (The same idea for LCR circuits is in [Magnetism, EMI and AC](/interview/bpsc-tre/class-9-10-science/physics/magnetism-emi-and-ac).)

## 3. Waves: types and terms

| Classification | Types |
|---|---|
| By medium | **Mechanical** (need medium: sound, water, seismic) · **Electromagnetic** (no medium: light, radio, X-rays) · **Matter waves** (electrons, de Broglie) |
| By vibration direction | **Transverse** — particles move ⟂ to wave direction (string waves, light, S-waves); crests and troughs · **Longitudinal** — particles move ∥ to wave direction (sound in air, P-waves); compressions and rarefactions |
| By travel | **Progressive** (travelling) · **Stationary** (standing) |

- Transverse mechanical waves need rigidity → travel only in **solids** (and on liquid surfaces). Longitudinal waves travel in solids, liquids and gases. That is why seismic **S-waves do not pass through the earth's liquid outer core** while P-waves do.
- **Wavelength λ:** distance between two consecutive crests (or compressions). **Amplitude:** maximum displacement.
- Only **transverse** waves can be **polarised**; sound in air cannot.

<div class="formula">

| Quantity | Formula |
|---|---|
| Wave speed | v = f λ = λ/T |
| Progressive wave | y = A sin(ωt − kx) (moving towards +x) |
| Wave number | k = 2π/λ; speed v = ω/k |
| Phase difference | Δφ = (2π/λ) × path difference |
| Speed on a string | v = √(T/μ), T = tension, μ = mass per unit length |
| Speed in a solid rod | v = √(Y/ρ) |
| Speed in a fluid | v = √(B/ρ), B = bulk modulus |

</div>

**Worked numerical 4.** A 512 Hz tuning fork sounds in air (v = 340 m/s). Wavelength?
λ = v/f = 340/512 = **0.664 m**.

**Worked numerical 5.** A string has tension 100 N and μ = 0.01 kg/m. Wave speed?
v = √(100/0.01) = √10 000 = **100 m/s**.

**Worked numerical 6 (reading a wave equation).** y = 0.5 sin [(2π/3.2)(64t − x)] (SI units). Find f, λ, v.
Compare with y = A sin(ωt − kx): ω = 2π × 64/3.2 = 2π × 20 → **f = 20 Hz**; k = 2π/3.2 → **λ = 3.2 m**; v = fλ = 20 × 3.2 = **64 m/s** (also the number multiplying t inside the bracket).

> **PYQ:** TRE 1.0 (2023) asked: "From the wave equation y = 0.5 sin 2π(64t − x)/3.2, the frequency of the wave is — (A) 5 Hz (B) 15 Hz (C) 20 Hz." The printed formula is garbled in our text copy, but read as above it gives **f = 64/3.2 = 20 Hz. Worked answer: (C)**. (No official key for TRE 1.0 in our files.)

## 4. Speed of sound

| Medium | Speed (approx.) |
|---|---|
| Air at 0 °C | 331–332 m/s |
| Air at 20–25 °C | 343–346 m/s |
| Hydrogen (0 °C) | ~1280 m/s |
| Water | ~1480–1500 m/s |
| Sea water | ~1530 m/s |
| Iron / steel | ~5000–5960 m/s |
| Aluminium | ~6400 m/s |
| Vacuum | **zero — sound cannot travel** |

Order: **solids > liquids > gases** (because elasticity rises much faster than density).

> **PYQ:** TRE 2.0 (2023) asked: "Sound waves travel fastest in — (A) solids (B) liquids (C) vacuum." **Official answer: (A) solids.** (Option "vacuum" is a trap: sound does not travel in vacuum at all.)

### Newton's formula and Laplace's correction

Newton assumed sound in air is **isothermal**: v = √(p/ρ) = √(1.013 × 10⁵ / 1.293) ≈ **280 m/s** — about 15 % too low.
Laplace (1816) said compressions and rarefactions are so fast that there is no time for heat exchange → **adiabatic**: v = √(γp/ρ) = √(1.4 × 78 345) ≈ **331 m/s**, which matches experiment.

### Factors affecting speed of sound in a gas

<div class="formula">

| Factor | Effect |
|---|---|
| Temperature | v ∝ √T (T in kelvin); about +0.61 m/s per °C near room temperature |
| Pressure (T constant) | **No effect** (p/ρ stays constant) |
| Humidity | Moist air is lighter → sound is **faster** in humid air |
| Molar mass | v ∝ 1/√M (faster in hydrogen than in oxygen, 4 times) |
| Wind | Adds/subtracts vectorially |
| Frequency, amplitude | No effect (no dispersion of sound in air) |

</div>

**Worked numerical 7.** Speed of sound in air is 332 m/s at 0 °C. Speed at 35 °C?
v₂ = v₁ √(T₂/T₁) = 332 × √(308/273) = 332 × √1.128 = 332 × 1.062 = **≈ 353 m/s**.
(Quick check with +0.61 m/s per °C: 332 + 35 × 0.61 ≈ 353.)

> **PYQ:** TRE 2.0 (2023) asked exactly this: "If the speed of sound in air at 0 °C is 332 m/s, then at 35 °C the speed of sound in air will be — (A) 325 (B) 353 (C) 367 m/s." **Official answer: (B) 353 m/s.**

**Worked numerical 8.** At what temperature will the speed of sound in air be double its value at 0 °C?
v ∝ √T → T must become 4 × 273 = 1092 K = **819 °C**.

## 5. Characteristics of sound

| Characteristic | Depends on | Note |
|---|---|---|
| **Loudness** | Amplitude (intensity ∝ A²) | Measured in decibel (dB) |
| **Pitch** | **Frequency** | Women/children have higher pitch; a mosquito's buzz is high-pitched, a lion's roar is loud but low-pitched |
| **Quality / timbre** | Waveform (number and strength of overtones) | Lets us tell a sitar from a flute at the same pitch and loudness |

### Decibel scale

<div class="formula">

| Sound level | β = 10 log₁₀(I/I₀) dB |
|---|---|
| Threshold of hearing | I₀ = 10⁻¹² W m⁻² (0 dB) |
| ×10 intensity | +10 dB; ×100 → +20 dB; ×2 → +3 dB |

</div>

| Sound | Level (approx.) |
|---|---|
| Rustling leaves / whisper | 10–30 dB |
| Normal conversation | ~60 dB |
| Busy traffic | 70–90 dB |
| Damage risk (long exposure) | above ~85 dB |
| Jet take-off / threshold of pain | 120–140 dB |

**Worked numerical 9.** Intensity 10⁻⁶ W m⁻². Sound level?
β = 10 log(10⁻⁶/10⁻¹²) = 10 × 6 = **60 dB**.

> **PYQ:** TRE 2.0 (2023) asked: "The unit of sound is — (A) hertz (B) decibel (C) wave number." **Official answer: (B) decibel** (unit of sound level/intensity level). Hertz is the unit of frequency; trap for the unwary.

The bel is named after Alexander Graham Bell; 1 B = 10 dB. Another subjective unit of loudness is the **phon**.

### Audible range

| Range | Frequency | Examples |
|---|---|---|
| Infrasound | < 20 Hz | Earthquakes, whales, elephants, pendulum; some animals sense quakes early |
| Audible (human) | **20 Hz – 20 kHz** | Range shrinks with age (upper limit falls) |
| Ultrasound | > 20 kHz | Bats, dolphins, dogs hear up to ~45 kHz; SONAR, ultrasonography, cleaning, detecting flaws in metal, kidney-stone breaking (lithotripsy) |
| Hypersound | > 1 GHz | — |

## 6. Reflection of sound: echo, SONAR, reverberation

- **Echo** heard if the reflected sound reaches at least **0.1 s** after the original (persistence of hearing). Minimum distance = v × 0.1/2 ≈ 344 × 0.05 = **≈ 17.2 m**.
- **Reverberation:** repeated reflections causing persistence of sound in big halls; reduced by curtains, carpets, fibre-board (sound absorbers).
- Megaphones, stethoscope, curved ceilings of auditoriums, sound boards — all use reflection of sound.
- **SONAR** (Sound Navigation And Ranging) uses ultrasound to find sea depth and submarines: distance = v t/2.

**Worked numerical 10.** A ship sends ultrasound and receives the echo after 2 s. Speed in sea water 1500 m/s. Depth?
d = v t/2 = 1500 × 2/2 = **1500 m**.

## 7. Superposition: beats and standing waves

### Beats

When two sounds of slightly different frequencies f₁ and f₂ superpose, loudness rises and falls periodically. **Beat frequency = |f₁ − f₂|**. The human ear can follow up to about 10 beats/s.

**Worked numerical 11.** Tuning forks of 256 Hz and 260 Hz are sounded together. Beats per second? — **4**.
Use: tuning musical instruments; if loading a fork with wax (which lowers its frequency) increases the beats, the fork was already the lower one.

### Standing (stationary) waves

Two identical waves moving in opposite directions superpose → **nodes** (zero displacement) and **antinodes** (maximum). No net energy transport.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="60" y1="60" x2="60" y2="140" stroke-width="3"/>
  <line x1="360" y1="60" x2="360" y2="140" stroke-width="3"/>
  <line x1="60" y1="100" x2="360" y2="100" stroke-dasharray="2 3" stroke-width="1"/>
  <path d="M 60 100 Q 110 40 160 100 Q 210 160 260 100 Q 310 40 360 100"/>
  <path d="M 60 100 Q 110 160 160 100 Q 210 40 260 100 Q 310 160 360 100" stroke-dasharray="5 3"/>
  <text x="55" y="160" fill="currentColor" stroke="none">N</text>
  <text x="155" y="125" fill="currentColor" stroke="none">N</text>
  <text x="255" y="125" fill="currentColor" stroke="none">N</text>
  <text x="355" y="160" fill="currentColor" stroke="none">N</text>
  <text x="105" y="62" fill="currentColor" stroke="none">A</text>
  <text x="205" y="62" fill="currentColor" stroke="none">A</text>
  <text x="305" y="62" fill="currentColor" stroke="none">A</text>
  <line x1="60" y1="180" x2="160" y2="180" stroke-width="1"/>
  <text x="95" y="195" fill="currentColor" stroke="none">λ/2</text>
  <text x="180" y="190" fill="currentColor" stroke="none">string fixed at both ends: 3rd harmonic</text>
</svg>

- Distance node to node (or antinode to antinode) = **λ/2**; node to nearest antinode = **λ/4**.

<div class="formula">

| System | Allowed frequencies | Harmonics present |
|---|---|---|
| String fixed at both ends | f_n = n v/(2L) = (n/2L)√(T/μ) | All (1, 2, 3 …) |
| Open organ pipe (both ends open) | f_n = n v/(2L) | All (1, 2, 3 …) |
| Closed organ pipe (one end closed) | f_n = (2n − 1) v/(4L) | **Odd only** (1, 3, 5 …) |
| Laws of string (Mersenne) | f ∝ 1/L, f ∝ √T, f ∝ 1/√μ | |

</div>

**Worked numerical 12.** A pipe 0.85 m long, v = 340 m/s. Fundamental frequency if (a) closed at one end, (b) open at both ends?
(a) f = v/4L = 340/3.4 = **100 Hz**; (b) f = v/2L = 340/1.7 = **200 Hz** — an open pipe of the same length has double the fundamental and richer (all) harmonics, so it sounds sweeter.

Resonance-column experiment: the first resonance length L₁ ≈ λ/4, second L₂ ≈ 3λ/4, so λ = 2(L₂ − L₁).

Why the pitch rises as a bottle fills with water: the air column (closed pipe) gets shorter, so f = v/4L increases.

## 8. Doppler effect

Apparent change in frequency when the source and/or observer move relative to the medium (Christian Doppler, 1842).

<div class="formula">

| General formula (sound) | f′ = f (v ± v_o)/(v ∓ v_s) |
|---|---|
| Rule | Upper signs when source and observer move **towards** each other (f′ rises); lower signs when moving apart |
| Light (v ≪ c) | Δλ/λ = v/c; receding galaxies → **red shift** (Hubble); approaching → blue shift |

</div>

**Worked numerical 13.** A train whistle of 500 Hz approaches a stationary observer at 34 m/s (v = 340 m/s). Frequency heard?
f′ = 500 × 340/(340 − 34) = 500 × 340/306 = **≈ 556 Hz**. After it passes, the pitch drops.

Uses: police radar speed guns, Doppler weather radar, echocardiography/blood-flow measurement, satellite tracking, red shift of galaxies (expanding universe).

**Sonic boom & Mach number:** when a source moves faster than sound (Mach number = v_source/v_sound > 1), a conical shock wave forms; the loud bang heard is the sonic boom.

## 9. Group velocity and phase velocity (B.Sc.)

A pure sine wave of a single frequency moves with the **phase velocity** v_p = ω/k = fλ. A real signal (a pulse or a "wave packet") is a group of many frequencies; its envelope (which carries energy and information) moves with the **group velocity** v_g.

<div class="formula">

| Quantity | Formula |
|---|---|
| Phase velocity | v_p = ω/k |
| Group velocity | v_g = dω/dk = v_p − λ (dv_p/dλ) |
| Non-dispersive medium (v_p independent of λ) | v_g = v_p (sound in air, light in vacuum) |
| Normal dispersion (glass) | v_g < v_p |
| de Broglie matter wave | v_g = particle velocity v; v_p = c²/v > c; so **v_p × v_g = c²** |
| EM wave in a hollow waveguide | v_p × v_g = c² (v_p > c, v_g < c) |

</div>

**Worked numerical 14.** A wave (matter wave / waveguide) has group velocity 2 × 10⁸ m/s. Phase velocity?
v_p = c²/v_g = (3 × 10⁸)² / (2 × 10⁸) = 9 × 10¹⁶ / 2 × 10⁸ = **4.5 × 10⁸ m/s**.

> **PYQ:** TRE 1.0 (2023) asked: "If a wave is having group velocity of 2 × 10⁸ m/s, then what is the phase velocity? (A) 4.5 × 10⁸ m/s (B) 5.5 × 10⁸ m/s (C) 9 × 10⁸ m/s." **Worked answer: (A)**, using v_p v_g = c². (Phase velocity above c is allowed — it carries no information; relativity limits only group/signal velocity.)

Light-wave applications of group velocity also appear in [Wave optics](/interview/bpsc-tre/class-9-10-science/physics/wave-optics).

## 10. Musical sound, noise and the ear

- **Musical sound:** regular, periodic, pleasant. **Noise:** irregular, non-periodic.
- **Fundamental** = lowest frequency; **overtones** = higher frequencies present; **harmonics** = overtones that are integer multiples of the fundamental.
- **Octave:** frequency ratio 2 : 1.
- Human ear: outer ear (pinna, canal) → eardrum (tympanum) → three ossicles (malleus, incus, stapes — **stapes is the smallest bone of the body**) → cochlea (hearing) and semicircular canals (balance).
- Sound is produced by vibration: vocal cords (larynx), tabla membrane, sitar string, flute air column.

## Traps and exceptions

- Sound **cannot** travel in vacuum; light can. Astronauts talk by radio.
- Fastest in **solids**, slowest in gases; "vacuum" as an option is wrong.
- Changing **pressure** at constant temperature does **not** change the speed of sound in a gas; temperature and humidity do.
- Use **kelvin** in v ∝ √T. 0 °C → 35 °C is 273 K → 308 K.
- Pitch depends on frequency, loudness on amplitude, quality on waveform — do not mix them up.
- Decibel is a **logarithmic** unit: doubling intensity adds only 3 dB; 10 × adds 10 dB.
- Closed pipe gives **odd** harmonics only; open pipe gives all.
- Pendulum time period is **independent of mass**; spring–mass period depends on mass but **not** on g.
- The period of a spring–mass system is the same on the moon; a pendulum's is longer there.
- Node-to-node distance is λ/2, not λ.
- Phase velocity may exceed c; group velocity (signal) cannot.
- Transverse waves are possible in solids and on liquid surfaces, **not** inside liquids or gases.

## Quick revision

1. SHM: F = −kx; a = −ω²x.
2. T(pendulum) = 2π√(L/g); T(spring) = 2π√(m/k).
3. Seconds pendulum: T = 2 s, L ≈ 1 m (0.993 m).
4. v_max = Aω at mean position; a_max = Aω² at extremes.
5. Resonance: driving frequency = natural frequency.
6. Sound is mechanical and longitudinal (in air).
7. v = fλ; y = A sin(ωt − kx), v = ω/k.
8. Speed order: solids > liquids > gases; vacuum: zero.
9. Laplace's correction: sound in air is adiabatic, v = √(γp/ρ).
10. v ∝ √T; 332 m/s at 0 °C → 353 m/s at 35 °C.
11. Pressure has no effect; humidity increases speed.
12. Decibel is the unit of sound level; 0 dB at 10⁻¹² W m⁻².
13. Audible range 20 Hz – 20 kHz; below infrasonic, above ultrasonic.
14. Echo needs ≥ 0.1 s delay → minimum distance ≈ 17 m.
15. Beat frequency = |f₁ − f₂|.
16. Node–node = λ/2; node–antinode = λ/4.
17. Closed pipe: odd harmonics, f = v/4L; open pipe: all, f = v/2L.
18. Doppler: approaching → higher frequency; red shift → receding.
19. v_g = dω/dk; for de Broglie waves/waveguides v_p v_g = c².
20. Stapes is the smallest bone; cochlea is the hearing organ.

## Practice with answers

1. Unit of frequency? — **Hertz (Hz)** (cycles per second).
2. Length of a pendulum is made 4 times; time period? — **Doubles** (T ∝ √L).
3. Does a pendulum clock gain or lose time on a mountain top? — **Loses (goes slow)** (g is lower, T larger).
4. In which medium is sound slowest: steel, water or air? — **Air**.
5. What did Laplace correct in Newton's formula? — **Isothermal → adiabatic** (used γp instead of p).
6. Speed of sound at 0 °C is 330 m/s; at 273 °C? — **≈ 467 m/s** (330 × √2).
7. Frequency for wavelength 1.7 m in air (v = 340 m/s)? — **200 Hz**.
8. Which property of sound decides pitch? — **Frequency**.
9. A sound is 100 times more intense than another; difference in level? — **20 dB**.
10. Frequency range used by bats? — **Ultrasonic (above 20 kHz)**.
11. Minimum distance for an echo at 340 m/s? — **17 m** (340 × 0.1/2).
12. Two forks of 384 Hz and 380 Hz give how many beats/s? — **4**.
13. Which pipe gives only odd harmonics? — **Closed at one end**.
14. Distance between adjacent node and antinode? — **λ/4**.
15. Change in frequency heard as an ambulance approaches? — **Rises** (Doppler effect).
16. Can sound waves be polarised? — **No** (longitudinal).
17. y = 0.2 sin(100πt − 2πx): wave speed? — **50 m/s** (ω/k = 100π/2π).
18. Relation between v_g and v_p for a non-dispersive medium? — **Equal**.
19. Group velocity of an electron's matter wave equals? — **The electron's own velocity**.
20. Which waves cannot pass through the earth's liquid outer core? — **S-waves (transverse)**.

Previous: [Heat, thermodynamics and kinetic theory](/interview/bpsc-tre/class-9-10-science/physics/heat-thermodynamics-and-kinetic-theory) · Next: [Ray optics and optical instruments](/interview/bpsc-tre/class-9-10-science/physics/ray-optics-and-optical-instruments).
