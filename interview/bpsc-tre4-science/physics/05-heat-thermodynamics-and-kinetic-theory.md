---
title: Heat, Thermodynamics and Kinetic Theory
part: Heat and Thermodynamics
summary: Temperature, expansion, calorimetry and the three modes of heat transfer, then black-body radiation, the laws of thermodynamics, engines and the kinetic theory of gases up to mean free path — class 9 to B.Sc. level.
---

This chapter starts with class 9–11 heat (temperature scales, expansion, specific heat, latent heat, conduction–convection–radiation) and climbs to the B.Sc. points TRE has already asked: black-body radiation, cyclic processes, Carnot efficiency, degrees of freedom and **mean free path**.
TRE asks it as one-line facts ("convection happens in…", "internal energy in a cyclic process…") and short ratio-type numericals.

> **In simple words:** Heat is energy that flows because of a temperature difference. Temperature tells how fast the molecules move on average. Thermodynamics is the bookkeeping of heat, work and internal energy; kinetic theory explains all of it with moving molecules.

For a lighter GS-level revision see [Heat, light and sound (BPSC CCE shelf)](/interview/bpsc-2027/science/heat-light-and-sound).

## 1. Temperature and its scales

- **Temperature** = degree of hotness; it decides the direction of heat flow (hot → cold).
- **Heat** = energy in transit, SI unit **joule (J)**; old unit calorie (1 cal = 4.186 J ≈ 4.2 J).
- **Zeroth law of thermodynamics:** if A and B are each in thermal equilibrium with C, then A and B are in equilibrium with each other. This law makes thermometers possible.

<div class="formula">

| Conversion | Formula |
|---|---|
| Celsius ↔ Fahrenheit | F = (9/5)C + 32 |
| Celsius ↔ Kelvin | K = C + 273.15 (≈ 273) |
| General | (C − 0)/100 = (F − 32)/180 = (K − 273)/100 |

</div>

| Fixed point | °C | °F | K |
|---|---|---|---|
| Absolute zero | −273.15 | −459.67 | 0 |
| Ice point | 0 | 32 | 273.15 |
| Triple point of water | 0.01 | 32.02 | 273.16 |
| Human body (normal) | 37 | 98.6 | 310 |
| Steam point (1 atm) | 100 | 212 | 373.15 |

**Worked numerical 1.** Normal body temperature is 98.6 °F. In °C?
C = (F − 32) × 5/9 = (98.6 − 32) × 5/9 = 66.6 × 5/9 = **37 °C**.

**Worked numerical 2.** At what temperature do °C and °F read the same?
Put F = C = x: x = 9x/5 + 32 → −4x/5 = 32 → **x = −40** (−40 °C = −40 °F).

> **Remember:** Kelvin has no degree sign (300 K, not 300 °K). A **change** of 1 °C = a change of 1 K = a change of 1.8 °F.

| Thermometer | Principle / range |
|---|---|
| Mercury (liquid-in-glass) | Expansion of liquid; −39 °C to ~357 °C (mercury freezes at −38.8 °C) |
| Alcohol | Used for very cold places (freezes at −114 °C) |
| Clinical | 35–42 °C, has a kink (constriction) so reading stays |
| Constant-volume gas | Most accurate; used as standard |
| Platinum resistance | Change of resistance with temperature |
| Thermocouple | Seebeck effect (emf at junction of two metals) |
| Pyrometer | Radiation; very high temperatures (sun, furnace) |

## 2. Thermal expansion

When heated, most substances expand because molecules vibrate with larger amplitude.

<div class="formula">

| Type | Formula | Coefficient |
|---|---|---|
| Linear | ΔL = L α ΔT | α (per °C or K⁻¹) |
| Area (superficial) | ΔA = A β ΔT | β = 2α |
| Volume (cubical) | ΔV = V γ ΔT | γ = 3α |
| Ratio | α : β : γ = 1 : 2 : 3 | |

</div>

**Worked numerical 3.** A 10 m steel rail (α = 1.2 × 10⁻⁵ /°C) is heated by 40 °C. Expansion?
ΔL = 10 × 1.2 × 10⁻⁵ × 40 = 4.8 × 10⁻³ m = **4.8 mm**. That is why gaps are left between rails.

Everyday uses: gaps in rails and bridges, sagging of telephone wires in summer, bimetallic strip in thermostats/electric iron (brass expands more than iron, so the strip bends towards iron), hot-fitting of iron rims on cart wheels.

**Anomalous expansion of water:** from 0 °C to 4 °C water **contracts** on heating; above 4 °C it expands. So water has **maximum density at 4 °C**. Lakes freeze from the top; the water at the bottom stays at 4 °C and fish survive.

> **Common mistake:** Ice is lighter than water because water **expands** on freezing (about 9 %), not because ice is "hollow". Water pipes burst in winter for the same reason.

## 3. Specific heat, calorimetry and latent heat

- **Heat capacity** = heat needed to raise temperature of the whole body by 1 K (J/K).
- **Specific heat capacity (c)** = heat to raise 1 kg by 1 K (J kg⁻¹ K⁻¹).
- **Principle of calorimetry:** heat lost by the hot body = heat gained by the cold body (no losses).

<div class="formula">

| Quantity | Formula |
|---|---|
| Heat for temperature change | Q = m c ΔT |
| Heat for change of state | Q = m L |
| Water | c = 4200 J kg⁻¹ K⁻¹ (1 cal g⁻¹ °C⁻¹) |
| Ice melting (fusion) | L_f = 3.36 × 10⁵ J/kg (80 cal/g) |
| Water → steam (vaporisation) | L_v = 2.26 × 10⁶ J/kg (540 cal/g) |

</div>

| Substance | c (J kg⁻¹ K⁻¹) approx |
|---|---|
| Water | 4186 (highest among common liquids) |
| Ice | 2100 |
| Aluminium | 900 |
| Iron | 450 |
| Copper | 385 |
| Mercury | 140 |
| Lead | 128 |

**Worked numerical 4.** Heat needed to warm 2 kg water from 20 °C to 70 °C?
Q = m c ΔT = 2 × 4200 × 50 = **4.2 × 10⁵ J (420 kJ)**.

**Worked numerical 5.** 100 g water at 80 °C is mixed with 100 g water at 20 °C. Final temperature?
Equal masses of the same liquid → simple average = (80 + 20)/2 = **50 °C**.

**Worked numerical 6.** Heat to melt 10 g ice at 0 °C into water at 0 °C?
Q = m L = 10 g × 336 J/g = **3360 J**. The temperature does not change during melting.

> **In simple words:** During melting or boiling all heat goes into breaking the bonds between molecules, so the thermometer stops rising. This hidden heat is "latent" (hidden) heat.

Facts that TRE likes:
- Burns from steam at 100 °C are worse than from water at 100 °C, because steam gives extra 2.26 × 10⁶ J/kg latent heat.
- Water's high specific heat → used in car radiators and hot-water bags; coastal climate is moderate (sea breeze by day, land breeze by night).
- **Boiling point falls with lower pressure** (hills, cooking is slow; pressure cooker raises pressure, so boiling point rises to ~120 °C).
- **Melting point of ice falls with pressure** (regelation; skating).
- **Evaporation** happens at all temperatures, from the surface, and **causes cooling** (earthen pot/surahi, sweating). Faster with higher temperature, larger surface, wind and low humidity.
- Adding salt/impurity **raises boiling point** and **lowers freezing point**.

## 4. Three modes of heat transfer

| Mode | Needs medium? | How | Where |
|---|---|---|---|
| Conduction | Yes | Molecule-to-molecule vibration (and free electrons in metals), no bulk movement | Mainly solids |
| Convection | Yes | Bulk movement of heated fluid (hot part rises, cold part sinks) | **Liquids and gases (fluids)** |
| Radiation | **No** | Electromagnetic waves (infrared mostly), speed of light | Through vacuum too (sun to earth) |

> **PYQ:** TRE 2.0 (2023) asked: "Transfer of heat by convection can take place in — (A) solids and liquids (B) solids and vacuum (C) gases and liquids." **Official answer: (C)**. Convection needs particles that can move as a bulk, so it is impossible in solids and in vacuum.

### Conduction and thermal conductivity

<div class="formula">

| Fourier's law | Q/t = K A (T₁ − T₂)/L |
|---|---|
| K | thermal conductivity, unit W m⁻¹ K⁻¹ |
| Thermal resistance | R = L/(K A) |

</div>

| Material | K (W m⁻¹ K⁻¹) approx |
|---|---|
| Silver | 429 (best metal conductor) |
| Copper | 385–400 |
| Aluminium | 237 |
| Iron | 80 |
| Lead | 35 |
| Mercury | 8.3 |
| Glass | ~1 |
| Water | 0.6 |
| Wood | 0.1–0.2 |
| Air | 0.026 (very poor, so woollen clothes and double windows trap air) |

> **PYQ:** TRE 2.0 (2023) asked: "The poorest conductor of heat among the following is — (A) copper (B) lead (C) mercury." **Official answer: (B) lead.** Note: standard data tables give mercury (≈ 8 W m⁻¹ K⁻¹) a lower conductivity than lead (≈ 35 W m⁻¹ K⁻¹), so on data alone mercury is poorer; the commission kept lead in the final key (probably thinking only of solid metals). In the exam, remember the official choice, but know the real values.

Everyday conduction facts: cooking pots have copper bottoms and wooden/plastic handles; a metal chair feels colder than a wooden one at the same temperature (metal conducts heat away from the hand faster); ice is wrapped in sawdust or jute; igloos keep Eskimos warm (snow traps air).

### Convection examples

Sea and land breeze, monsoon winds, trade winds, chimneys, heating water in a kettle, AC fitted near the ceiling and heater near the floor, ventilators near the roof.

### Radiation

- All bodies above 0 K radiate. Radiation travels at 3 × 10⁸ m/s and needs no medium.
- **Good absorbers are good emitters** (Kirchhoff's law of radiation). Black, rough surfaces absorb and emit well; white, shiny surfaces reflect.
- Light-coloured clothes in summer, dark in winter. Thermos flask: vacuum (stops conduction & convection) + silvered walls (stop radiation).
- **Greenhouse effect:** glass lets short-wave visible light in but blocks long-wave infrared going out.

## 5. Black-body radiation (B.Sc. favourite)

A **perfect black body** absorbs all radiation falling on it (absorptivity = 1) and is also the best emitter. A small hole in a hollow cavity with blackened inner walls is the practical model (Ferry's black body).

<div class="formula">

| Law | Statement |
|---|---|
| Kirchhoff | e_λ / a_λ = E_λ (same for all bodies at a given T) — good absorber = good emitter |
| Stefan–Boltzmann | E = σ T⁴ (perfect black body); for real body E = e σ T⁴ |
| σ | 5.67 × 10⁻⁸ W m⁻² K⁻⁴ |
| Net loss | P = e σ A (T⁴ − T₀⁴) |
| Wien's displacement | λ_max × T = b, b = 2.898 × 10⁻³ m K |
| Planck | E = hν, h = 6.63 × 10⁻³⁴ J s (energy in packets, quanta) |
| Newton's law of cooling | rate of cooling ∝ (T − T_surroundings), for small differences |

</div>

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="50" y1="170" x2="405" y2="170"/>
  <line x1="50" y1="170" x2="50" y2="15"/>
  <path d="M 55 170 C 90 165 105 40 130 40 C 165 40 220 140 400 158"/>
  <path d="M 60 170 C 120 168 160 110 190 110 C 230 110 290 150 400 163" stroke-dasharray="5 3"/>
  <line x1="130" y1="40" x2="130" y2="170" stroke-dasharray="2 3" stroke-width="1"/>
  <line x1="190" y1="110" x2="190" y2="170" stroke-dasharray="2 3" stroke-width="1"/>
  <text x="120" y="186" fill="currentColor" stroke="none">λm₂</text>
  <text x="180" y="186" fill="currentColor" stroke="none">λm₁</text>
  <text x="140" y="38" fill="currentColor" stroke="none">T₂ (hotter)</text>
  <text x="200" y="105" fill="currentColor" stroke="none">T₁ (cooler)</text>
  <text x="330" y="186" fill="currentColor" stroke="none">wavelength λ →</text>
  <text x="8" y="25" fill="currentColor" stroke="none">E_λ</text>
  <text x="250" y="60" fill="currentColor" stroke="none">T₂ &gt; T₁: peak moves to</text>
  <text x="250" y="75" fill="currentColor" stroke="none">shorter λ, area (∝ T⁴) grows</text>
</svg>

Characteristics of the black-body (Planck) curves:
1. Emissive power varies **continuously** with wavelength — a continuous spectrum.
2. Each curve has one peak at λ_max. **As T rises, the peak shifts to shorter wavelength** (Wien). Iron glows red → orange → yellow → white as it heats up.
3. At any given wavelength, a hotter body emits more (the hotter curve lies entirely above).
4. Total area under curve ∝ T⁴ (Stefan).
5. Classical Rayleigh–Jeans theory failed at short wavelengths ("ultraviolet catastrophe"); Planck (1900) solved it with quanta E = hν — the birth of quantum theory.

> **PYQ:** TRE 1.0 (2023) asked which is **not** a characteristic of Planck's black-body radiation distribution: (A) "As temperature increases, the peak of the curve shifts towards higher wavelength" (B) emissive power varies continuously with wavelength (C) at a given wavelength, emissive power increases with temperature. **Worked answer: (A)** — the peak moves to **shorter** wavelength (Wien's law). (No official key for TRE 1.0 is in our files.)

**Worked numerical 7.** The sun's spectrum peaks near 500 nm. Surface temperature?
T = b/λ_max = 2.898 × 10⁻³ / 5 × 10⁻⁷ = **≈ 5800 K**.

**Worked numerical 8.** At what wavelength does the human body (310 K) radiate most?
λ_max = 2.898 × 10⁻³ / 310 = 9.35 × 10⁻⁶ m ≈ **9.3 µm (infrared)** — the basis of thermal cameras.

**Worked numerical 9.** The absolute temperature of a black body is doubled. Power radiated becomes?
E ∝ T⁴ → 2⁴ = **16 times**.

**Worked numerical 10 (Newton's law of cooling).** A body cools from 80 °C to 60 °C in 5 min in a room at 20 °C. Time to cool from 60 °C to 40 °C?
Use average temperatures: (80 − 60)/5 = k(70 − 20) → 4 = 50k → k = 0.08 per min.
(60 − 40)/t = 0.08 × (50 − 20) = 2.4 → t = 20/2.4 = **8.3 min** (cooling slows as the body nears room temperature).

Solar constant (radiation received at top of atmosphere) ≈ **1.36 kW m⁻²**.

## 6. Thermodynamics: system, state and laws

- **System** = the part we study (gas in a cylinder); everything else = surroundings.
- **State variables:** p, V, T, U (internal energy), S (entropy). Values depend only on the state, not on the path.
- **Path quantities:** heat Q and work W depend on the path.
- **Intensive property** = does not depend on amount: temperature, pressure, density, refractive index, specific heat, boiling point, viscosity.
- **Extensive property** = depends on amount: mass, volume, internal energy, heat capacity, entropy, enthalpy.

> **PYQ:** TRE 2.0 (2023) asked: "Which of the following is an intensive property? (A) Refractive index (B) Volume (C) Mass." **Official answer: (A)**. Refractive index of a glass piece does not change if you break it in half.

<div class="formula">

| Law | Statement / equation |
|---|---|
| Zeroth | Thermal equilibrium is transitive → temperature |
| First | ΔQ = ΔU + ΔW (heat given = rise in internal energy + work done by system) — conservation of energy |
| Second (Kelvin–Planck) | No engine can convert all heat into work in a cycle (100 % efficiency impossible) |
| Second (Clausius) | Heat cannot flow by itself from cold to hot (refrigerator needs work) |
| Third | Entropy of a perfect crystal → 0 as T → 0 K; absolute zero cannot be reached in finite steps |

</div>

Sign convention used here (NCERT physics): Q positive when heat is given **to** the system; W positive when work is done **by** the system. (Chemistry books often write ΔU = q + w with w = work done **on** the system — same physics, different sign; see [Chemistry: thermodynamics](/interview/bpsc-tre4-science/chemistry/thermodynamics-equilibrium-acids-and-bases).)

**Worked numerical 11.** A gas absorbs 500 J of heat and does 200 J of work. Change in internal energy?
ΔU = Q − W = 500 − 200 = **300 J** (increase).

**Internal energy of an ideal gas depends only on temperature.** In any **cyclic process** the system returns to its initial state, so **ΔU = 0** and the net heat absorbed = net work done.

> **PYQ:** TRE 2.0 (2023) asked: "Internal energy of a gas in a cyclic process — (A) increases (B) decreases (C) remains unchanged." **Official answer: (C)**.

## 7. Thermodynamic processes and p–V diagrams

Work done by a gas = ∫ p dV = **area under the p–V curve**. For a cycle, net work = area enclosed (clockwise → engine, net work done by gas).

<div class="formula">

| Process | Constant | Key relation | Work done by gas | Heat |
|---|---|---|---|---|
| Isothermal | T | pV = constant; ΔU = 0 | W = nRT ln(V₂/V₁) | Q = W |
| Adiabatic | Q = 0 | pV^γ = const, TV^(γ−1) = const | W = (p₁V₁ − p₂V₂)/(γ − 1) | 0, so W = −ΔU |
| Isochoric | V | p/T = const | W = 0 | Q = ΔU = nC_vΔT |
| Isobaric | p | V/T = const | W = pΔV | Q = nC_pΔT |
| Cyclic | — | ΔU = 0 | W = area enclosed | Q = W |
| Free expansion | — | Q = 0, W = 0 | 0 | ΔU = 0 (ideal gas T same) |

</div>

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="50" y1="175" x2="400" y2="175"/>
  <line x1="50" y1="175" x2="50" y2="15"/>
  <path d="M 90 40 Q 150 140 380 150"/>
  <path d="M 90 40 Q 130 150 380 165" stroke-dasharray="5 3"/>
  <circle cx="90" cy="40" r="3"/>
  <text x="96" y="36" fill="currentColor" stroke="none">A (p₁, V₁)</text>
  <text x="290" y="138" fill="currentColor" stroke="none">isothermal (pV = const)</text>
  <text x="210" y="178" fill="currentColor" stroke="none">adiabatic (steeper, pV^γ = const)</text>
  <text x="370" y="192" fill="currentColor" stroke="none">V →</text>
  <text x="25" y="25" fill="currentColor" stroke="none">p</text>
  <text x="160" y="80" fill="currentColor" stroke="none">slope: adiabatic = γ × isothermal</text>
</svg>

**Worked numerical 12.** One mole of ideal gas at 300 K expands isothermally to double its volume. Work done?
W = nRT ln 2 = 1 × 8.314 × 300 × 0.693 = **≈ 1.73 kJ** (all of it taken as heat from surroundings).

Examples: sudden bursting of a tyre (air cools) and sound propagation are adiabatic; melting and boiling at fixed pressure are isothermal; heating gas in a closed rigid can is isochoric.

## 8. Heat engines, refrigerators and the Carnot cycle

A **heat engine** takes heat Q₁ from a hot source at T₁, does work W, and rejects Q₂ to a sink at T₂.

<div class="formula">

| Quantity | Formula |
|---|---|
| Efficiency of any engine | η = W/Q₁ = 1 − Q₂/Q₁ |
| Carnot (ideal reversible) | η = 1 − T₂/T₁ (temperatures in kelvin) |
| Refrigerator COP | β = Q₂/W = T₂/(T₁ − T₂) |
| Heat pump COP | Q₁/W = T₁/(T₁ − T₂) |
| Otto (petrol) cycle | η = 1 − 1/r^(γ−1), r = compression ratio |

</div>

**Carnot cycle** = isothermal expansion → adiabatic expansion → isothermal compression → adiabatic compression. **Carnot's theorem:** no engine working between the same two temperatures can be more efficient than a reversible Carnot engine; its efficiency is independent of the working substance.

**Worked numerical 13.** A Carnot engine works between 500 K and 300 K. Efficiency?
η = 1 − 300/500 = 0.4 = **40 %**.

**Worked numerical 14.** A refrigerator keeps its inside at 0 °C (273 K) in a room at 27 °C (300 K). Ideal COP?
β = 273/(300 − 273) = 273/27 ≈ **10.1**.

**Worked numerical 15.** Otto engine, compression ratio 8, γ = 1.4. Efficiency?
8^0.4 ≈ 2.30 → η = 1 − 1/2.30 = **≈ 56.5 %** (real engines give far less, ~25–30 %).

| Engine | Cycle | Ignition | Fuel–air mixing | Compression ratio |
|---|---|---|---|---|
| Petrol engine | Otto | **Spark plug** | **Carburettor** (older) / fuel injection | ~6–10 |
| Diesel engine | Diesel | Compression heats air (no spark plug) | Fuel injector | ~14–24 (higher) |
| Steam engine | Rankine | External combustion | Boiler | — |

> **PYQ:** TRE 2.0 (2023) asked: "In which of the following types of heat engine is a carburettor used? (A) Petrol engine (B) Diesel engine (C) Steam engine." **Official answer: (A)**. The carburettor mixes petrol vapour with air before the spark ignites it; a diesel engine injects fuel directly into hot compressed air.

Refrigerator facts: the working substance (refrigerant, e.g. R-134a, earlier CFC freon, ammonia in big plants) evaporates inside the cooling coil (absorbs latent heat) and condenses in the coil behind the fridge (gives out heat). Keeping a fridge door open **warms** the room (it rejects Q₁ = Q₂ + W).

## 9. Entropy

**Entropy (S)** measures disorder / unavailable energy. ΔS = Q_rev/T (unit J/K).
- Entropy of an isolated system never decreases (ΔS ≥ 0); it stays constant only in reversible processes.
- Solid → liquid → gas: entropy increases. Reversible adiabatic process = **isentropic** (ΔS = 0).

**Worked numerical 16.** Entropy change when 1 kg ice melts at 0 °C (L = 3.36 × 10⁵ J/kg)?
ΔS = mL/T = 3.36 × 10⁵ / 273 ≈ **1231 J/K**.

## 10. Kinetic theory of gases

Assumptions: a gas has a huge number of tiny molecules (point masses) in random motion; collisions are perfectly elastic; no forces between molecules except during collision; time of collision negligible.

<div class="formula">

| Result | Formula |
|---|---|
| Ideal gas equation | pV = nRT = N k_B T |
| Pressure | p = (1/3) ρ v_rms² = (1/3)(N/V) m v_rms² |
| Mean KE per molecule | (3/2) k_B T (depends only on T) |
| rms speed | v_rms = √(3RT/M) = √(3k_BT/m) |
| Average speed | v_avg = √(8RT/πM) |
| Most probable speed | v_mp = √(2RT/M) |
| Order | v_mp < v_avg < v_rms (ratio ≈ 1 : 1.13 : 1.22) |
| Constants | R = 8.314 J mol⁻¹ K⁻¹, k_B = 1.38 × 10⁻²³ J/K, N_A = 6.022 × 10²³ |
| Graham's law | rate of diffusion ∝ 1/√M |

</div>

**Worked numerical 17.** rms speed of O₂ (M = 0.032 kg/mol) at 300 K?
v = √(3 × 8.314 × 300 / 0.032) = √233 800 ≈ **484 m/s**. (N₂ ≈ 517 m/s, H₂ ≈ 1934 m/s.)

**Worked numerical 18.** Temperature of a gas rises from 27 °C to 927 °C. rms speed becomes?
300 K → 1200 K, v ∝ √T → √4 = **2 times**.

> **Remember:** At the same temperature, **all** gases have the same average KE per molecule; lighter molecules move faster. That is why hydrogen and helium escape from the earth's atmosphere (escape speed 11.2 km/s is reached by the fast tail of the speed distribution).

### Degrees of freedom and specific heats

**Law of equipartition:** each degree of freedom (independent way to store energy) gets ½ k_B T per molecule.

| Gas type | Degrees of freedom f | C_v | C_p | γ = C_p/C_v |
|---|---|---|---|---|
| Monatomic (He, Ar) | 3 (translation) | 3R/2 | 5R/2 | 5/3 ≈ 1.67 |
| Diatomic (O₂, N₂) at room T | 5 (3 trans + 2 rot) | 5R/2 | 7R/2 | 7/5 = 1.40 |
| Diatomic with vibration (high T) | 7 | 7R/2 | 9R/2 | 9/7 ≈ 1.29 |
| Non-linear polyatomic (rigid) | 6 | 3R | 4R | 4/3 ≈ 1.33 |

- **Mayer's relation:** C_p − C_v = R. C_p > C_v because at constant pressure part of the heat does work in expansion.
- Internal energy of n moles: U = n (f/2) R T.
- γ = 1 + 2/f.

### Mean free path (B.Sc.)

The **mean free path (λ)** is the average distance a molecule travels between two successive collisions.

<div class="formula">

| Mean free path | λ = 1/(√2 π d² n) = k_B T/(√2 π d² p) |
|---|---|
| d | molecular diameter |
| n | number density = N/V |
| So | λ ∝ 1/n ∝ V/N; λ ∝ T/p; λ ∝ 1/d² |

</div>

**Worked numerical 19.** d = 3 × 10⁻¹⁰ m, n = 2.7 × 10²⁵ m⁻³ (air at STP). λ?
√2 π d² n = 1.414 × 3.1416 × 9 × 10⁻²⁰ × 2.7 × 10²⁵ ≈ 1.08 × 10⁷ m⁻¹ → λ ≈ **9.3 × 10⁻⁸ m (≈ 0.1 µm)**, hundreds of times the molecule size.

> **PYQ:** TRE 1.0 (2023) asked: two boxes A and B contain an equal number of molecules of the same gas; volumes V_A, V_B and mean free paths λ_A, λ_B. Options: (A) λ_A = λ_B (B) λ_A/V_A = λ_B/V_B (C) λ_A/V_A^(1/3) = λ_B/V_B^(1/3). **Worked answer: (B)** — same N and same d, so λ ∝ 1/n = V/N ∝ V.

Other transport ideas: viscosity, thermal conduction and diffusion in gases are all explained by molecules carrying momentum, energy or mass over about one mean free path. Brownian motion (random zig-zag of pollen in water, Robert Brown 1827; explained by Einstein 1905) is direct evidence of molecular motion.

### Real gases

Van der Waals equation: (p + a n²/V²)(V − nb) = nRT; a = attraction correction, b = volume correction. Real gases behave ideally at **high temperature and low pressure**. Critical temperature: above it a gas cannot be liquefied by pressure alone (CO₂: 31.1 °C).

## Traps and exceptions

- **Convection never in solids or vacuum**; radiation needs no medium; conduction is mainly solids.
- **Wien:** hotter → peak at **shorter** wavelength (not longer). Blue stars are hotter than red stars.
- Stefan uses **absolute** temperature: 27 °C → 327 °C is 300 K → 600 K, so power × 16, not × (327/27)⁴.
- Carnot efficiency in **kelvin**: 127 °C and 27 °C → 1 − 300/400 = 25 %, not 1 − 27/127.
- Internal energy of an ideal gas depends on **T only**; in an isothermal process ΔU = 0 even though heat flows.
- Adiabatic ≠ isothermal: adiabatic means no heat exchange, temperature **changes**.
- Cyclic process: ΔU = 0 but Q and W are **not** zero.
- Water is densest at **4 °C**, not 0 °C.
- At same T, average KE is the same for all gases, but **speed** is not.
- Petrol engine: **spark plug + carburettor**; diesel: compression ignition, no carburettor, higher compression ratio.
- Heat capacity is extensive, specific heat is intensive.
- Official TRE 2.0 key: "poorest conductor among copper, lead, mercury" = **lead**, although data tables put mercury lower — know both.
- Opening a fridge door does **not** cool a closed room; it warms it.

## Quick revision

1. K = °C + 273.15; F = 9C/5 + 32; −40 °C = −40 °F.
2. γ = 3α, β = 2α.
3. Water: maximum density at 4 °C; c = 4200 J kg⁻¹ K⁻¹.
4. Latent heat: ice 336 J/g (80 cal/g), steam 2260 J/g (540 cal/g).
5. Convection only in fluids (liquids and gases).
6. Radiation needs no medium; good absorbers are good emitters (Kirchhoff).
7. Stefan: E = σT⁴, σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴.
8. Wien: λ_max T = 2.898 × 10⁻³ m K; hotter → shorter peak.
9. Planck (1900): E = hν solved the ultraviolet catastrophe.
10. First law: Q = ΔU + W (energy conservation).
11. Cyclic process: ΔU = 0.
12. Isothermal pV = const; adiabatic pV^γ = const (steeper curve).
13. Carnot η = 1 − T₂/T₁; refrigerator COP = T₂/(T₁ − T₂).
14. Petrol engine — spark plug, carburettor, Otto cycle; diesel — compression ignition.
15. ΔS = Q/T; entropy of isolated system never decreases.
16. KE per molecule = (3/2)kT; v_rms = √(3RT/M) ∝ √T.
17. v_mp < v_avg < v_rms.
18. γ: monatomic 1.67, diatomic 1.4, polyatomic 1.33; C_p − C_v = R.
19. Mean free path λ = 1/(√2 π d² n); for fixed N, λ ∝ V.
20. Refractive index, temperature, density are intensive; mass, volume, energy are extensive.
21. Silver is the best metallic conductor of heat; air is a very poor conductor.
22. Solar constant ≈ 1.36 kW m⁻².

## Practice with answers

1. In which mode is heat transferred from the sun to the earth? — **Radiation** (no medium in space).
2. Normal body temperature in kelvin? — **310 K** (37 + 273).
3. At what temperature is water densest? — **4 °C** (anomalous expansion).
4. If α of a metal is 2 × 10⁻⁵ /K, its γ? — **6 × 10⁻⁵ /K** (γ = 3α).
5. Why does steam burn more than boiling water? — **Extra latent heat of vaporisation** (2.26 × 10⁶ J/kg).
6. Which law says good absorbers are good emitters? — **Kirchhoff's law of radiation**.
7. Temperature of a black body doubles; radiated power? — **16 times** (E ∝ T⁴).
8. As a body is heated, its λ_max? — **Decreases** (Wien's displacement law).
9. Change in internal energy in a complete cycle? — **Zero** (state function).
10. 400 J heat is given and the gas does 150 J work; ΔU? — **250 J** (first law).
11. Carnot engine between 127 °C and 27 °C; efficiency? — **25 %** (1 − 300/400).
12. Which engine has no spark plug? — **Diesel engine** (compression ignition).
13. Process with no heat exchange? — **Adiabatic** (Q = 0).
14. γ for a monatomic gas? — **5/3** (f = 3).
15. rms speed when absolute temperature becomes 4 times? — **Doubles** (v ∝ √T).
16. Mean free path when the number density is doubled at the same T? — **Halves** (λ ∝ 1/n).
17. Is specific heat intensive or extensive? — **Intensive** (independent of amount).
18. Why does a thermos have a vacuum and silvered walls? — **Vacuum stops conduction/convection; silvering stops radiation**.
19. Who explained Brownian motion theoretically? — **Albert Einstein (1905)**.
20. C_p − C_v for one mole of ideal gas? — **R = 8.314 J mol⁻¹ K⁻¹** (Mayer's relation).

Next: [Oscillations, waves and sound](/interview/bpsc-tre4-science/physics/oscillations-waves-and-sound). Revision bank: [Physics question bank](/interview/bpsc-tre4-science/physics/physics-question-bank-and-revision).
