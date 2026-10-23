---
title: Work, Energy, Power and Rotation
part: Mechanics
summary: Work and the work–energy theorem, kinetic and potential energy, power, energy conversions, collisions with the coefficient of restitution, centre of mass and the lab vs CM frame (B.Sc.), torque, moment of inertia, angular momentum, rolling and simple machines.
---

This chapter goes from NCERT class 9 "Work and Energy" through class 11 collisions and rotation to the B.Sc. "laboratory vs centre-of-mass frame" result that TRE 1.0 asked.
Expect definitions (TRE 3.0 asked the definition of work), quick numericals (KE, power, collisions) and one-line rotation facts (moment of inertia, order of rolling).

> **In simple words:** Work is done when a force moves something along its direction. Energy is the capacity to do work; it changes form but the total stays the same. Rotation copies every straight-line idea: force → torque, mass → moment of inertia, momentum → angular momentum.

## 1. Work

**Work** done by a constant force = force × displacement in the direction of the force:

<div class="formula">

| Quantity | Formula | Unit |
|---|---|---|
| Work (constant force) | W = F s cos θ = **F·s** | joule (J) = N m |
| Work (variable force) | W = ∫F dx = area under F–x graph | J |
| 1 joule | 1 N force moves its point of application 1 m along the force | — |
| CGS unit | erg | 1 J = 10⁷ erg |

</div>

- Work is a **scalar** (dot product of two vectors).
- **Positive work** (θ < 90°): force helps motion — a falling body (gravity), pulling a cart.
- **Negative work** (θ > 90°): force opposes motion — friction on a sliding block, gravity on a body thrown up, brakes.
- **Zero work**: (a) no displacement — pushing a wall, a man standing with a load on his head; (b) force ⟂ displacement — coolie walking horizontally with a load (against gravity), centripetal force in uniform circular motion, Earth's gravity on a satellite in a circular orbit, magnetic force on a moving charge.

> **PYQ:** TRE 3.0 (2024) asked the **definition of work** (per PW analysis). Answer: work = force × displacement in the direction of force; SI unit joule; it is zero when there is no displacement or when force is perpendicular to displacement.

**Example 1.** A 10 N force at 60° to the ground pulls a box 5 m. W = 10 × 5 × cos 60° = **25 J**.

**Example 2 (variable force).** A force rises linearly from 0 to 20 N over 4 m. Work = area of triangle = ½ × 4 × 20 = **40 J**.

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="50" y1="165" x2="380" y2="165"/>
  <line x1="50" y1="165" x2="50" y2="20"/>
  <text x="360" y="185" fill="currentColor" stroke="none">x (m)</text>
  <text x="10" y="30" fill="currentColor" stroke="none">F (N)</text>
  <polygon points="50,165 290,45 290,165" stroke-dasharray="4 3"/>
  <line x1="50" y1="165" x2="290" y2="45" stroke-width="2"/>
  <text x="180" y="140" fill="currentColor" stroke="none">area = work done</text>
  <text x="285" y="182" fill="currentColor" stroke="none">4</text>
  <text x="30" y="50" fill="currentColor" stroke="none">20</text>
  <line x1="46" y1="45" x2="290" y2="45" stroke-dasharray="2 4"/>
  <text x="300" y="110" fill="currentColor" stroke="none">W = ½ × 4 × 20 = 40 J</text>
</svg>

## 2. Energy: kinetic and potential

- **Kinetic energy (KE)** = energy due to motion: K = ½mv² = p²/(2m).
- **Potential energy (PE)** = energy due to position or configuration: gravitational U = mgh (near Earth), elastic (spring) U = ½kx².
- **Work–energy theorem**: work done by the net force = change in kinetic energy, W_net = K_f − K_i.
- KE is never negative; PE can be negative (it depends on the chosen zero; gravitational PE far away is taken as zero, so U = −GMm/r).

<div class="formula">

| Relation | Formula |
|---|---|
| KE and momentum | K = p²/2m, p = √(2mK) |
| Same momentum | K ∝ 1/m (lighter body has more KE) |
| Same KE | p ∝ √m (heavier body has more momentum) |
| Gravitational PE | U = mgh |
| Spring PE | U = ½kx² |

</div>

**Example 3.** Speed doubled → KE becomes **4 times**. Momentum increased by 50% → K ∝ p² → 1.5² = 2.25 → KE increases by **125%**.

**Example 4.** KE increases by 300% (becomes 4K) → p ∝ √K → p doubles → momentum increases by **100%**.

**Example 5.** A spring (k = 200 N/m) compressed by 10 cm stores ½ × 200 × 0.1² = **1 J**.

**Example 6.** A 2 kg book lifted 5 m (g = 10) gains PE = 2 × 10 × 5 = **100 J**.

## 3. Conservative forces and conservation of energy

- A **conservative force** does work that depends only on initial and final positions, not on the path; work around a closed path = 0. Examples: gravity, spring force, electrostatic force.
- A **non-conservative force**: work depends on the path; mechanical energy is lost as heat. Examples: friction, air drag, viscous force.
- **Law of conservation of energy**: energy can neither be created nor destroyed, only changed from one form to another. Under conservative forces alone, **mechanical energy (K + U) stays constant**.

**Example 7 (pendulum / free fall).** A bob released from 0.2 m above its lowest point: v = √(2gh) = √(2 × 10 × 0.2) = **2 m/s** at the bottom. At the extreme positions energy is all PE; at the mean position it is all KE.

**Example 8.** A 1 kg ball dropped from 20 m: at the ground KE = mgh = **200 J** and v = √(2 × 10 × 20) = **20 m/s**. Halfway down: PE = KE = 100 J.

### Energy conversions (devices)

| Device / process | Energy change |
|---|---|
| Electric generator (dynamo) | mechanical → electrical |
| Electric motor | electrical → mechanical |
| Cell / battery (discharging) | chemical → electrical |
| Solar (photovoltaic) cell | light → electrical |
| Microphone | sound → electrical |
| Loudspeaker | electrical → sound |
| Electric bulb | electrical → light (+ heat) |
| Thermocouple | heat → electrical |
| Photosynthesis | light → chemical |
| Steam engine / IC engine | heat (chemical) → mechanical |
| Nuclear reactor | nuclear → heat → electrical |

## 4. Power and efficiency

<div class="formula">

| Quantity | Formula | Unit |
|---|---|---|
| Power | P = W/t = F·v | watt (W) = J/s |
| Horsepower | 1 hp = 746 W | — |
| Commercial energy unit | 1 kWh = 3.6 × 10⁶ J | "unit" |
| Efficiency | η = useful output / input × 100% | — |

</div>

**Example 9.** A 50 kg student runs up a 10 m high staircase in 10 s (g = 10). P = mgh/t = 50 × 10 × 10/10 = **500 W** ≈ 0.67 hp.

**Example 10.** A pump lifts 1000 kg of water to 20 m in 50 s. P = 1000 × 10 × 20/50 = **4000 W = 4 kW**. If its efficiency is 80%, input power = 4000/0.8 = **5 kW**.

**Example 11.** A 100 W bulb runs 10 h a day for 30 days. Energy = 0.1 kW × 300 h = **30 kWh (30 units)**.

## 5. Collisions

In every collision (with no external force) **linear momentum is conserved**. Kinetic energy may or may not be conserved.

| Type | Momentum | Kinetic energy | e |
|---|---|---|---|
| Perfectly elastic | conserved | conserved | 1 |
| Inelastic | conserved | partly lost (heat, sound, deformation) | 0 < e < 1 |
| Perfectly inelastic (bodies stick) | conserved | maximum loss | 0 |

**Coefficient of restitution** e = (velocity of separation)/(velocity of approach) = (v₂ − v₁)/(u₁ − u₂). For a ball dropped from height h that bounces to h′: e = √(h′/h).

<div class="formula">

| 1-D elastic collision, m₂ at rest | Result |
|---|---|
| Velocity of m₁ after | v₁ = (m₁ − m₂)u₁/(m₁ + m₂) |
| Velocity of m₂ after | v₂ = 2m₁u₁/(m₁ + m₂) |
| Equal masses | they **exchange velocities** (m₁ stops) |
| Heavy hits light (m₁ ≫ m₂) | light one moves off at ≈ 2u₁ |
| Light hits heavy wall | bounces back with same speed |
| Perfectly inelastic | v = (m₁u₁ + m₂u₂)/(m₁ + m₂) |

</div>

**Example 12.** m₁ = 2 kg at 3 m/s hits m₂ = 1 kg at rest, elastically.
v₁ = (2 − 1) × 3/3 = **1 m/s**; v₂ = 2 × 2 × 3/3 = **4 m/s**. Check: momentum 6 = 2 × 1 + 1 × 4 ✓; KE 9 J = 1 + 8 ✓.

**Example 13.** A ball dropped from 10 m rises to 6.4 m. e = √(6.4/10) = √0.64 = **0.8**.

> **Remember:** In a nuclear reactor, neutrons are slowed down best by nuclei of **similar mass** (hydrogen in water, deuterium in heavy water, carbon in graphite) — in an elastic head-on collision with an equal mass the neutron gives up all its energy.

## 6. Centre of mass and the lab vs CM frame (B.Sc.)

- **Centre of mass (CM)**: the point where the whole mass of a system may be considered concentrated for translational motion. For two particles: x_cm = (m₁x₁ + m₂x₂)/(m₁ + m₂).
- Velocity of CM: V_cm = (m₁u₁ + m₂u₂)/(m₁ + m₂). With no external force, **V_cm stays constant** — collisions and explosions do not change it.
- CM of a uniform rod is at its middle; of a triangle at the centroid; of a solid hemisphere at 3R/8 from the flat face; of a solid cone at h/4 from the base. CM can lie outside the body (ring, boomerang).
- **Laboratory (L) frame**: target m₂ at rest, projectile m₁ moves with u.
- **Centre-of-mass (C) frame**: the frame moving with V_cm; total momentum in it is zero, the two particles approach each other and recede with equal and opposite momenta.
- **Reduced mass** µ = m₁m₂/(m₁ + m₂).

<div class="formula">

| Result (target at rest in lab) | Formula |
|---|---|
| Velocity of CM | V_cm = m₁u/(m₁ + m₂) |
| Total KE in lab frame | T_L = ½ m₁u² |
| Total KE in CM frame | T_C = ½ µ u² = ½ m₁u² × m₂/(m₁ + m₂) |
| Ratio | **T_L : T_C = (m₁ + m₂) : m₂** |
| KE of CM motion | T_L − T_C = ½(m₁ + m₂)V_cm² (cannot be lost) |
| Angles | tan θ_L = sin θ_C/(cos θ_C + m₁/m₂) |
| Equal masses, elastic | θ_L = θ_C/2; the two particles separate at **90°** in the lab |

</div>

**Example 14.** m₁ = 1 kg at 6 m/s hits m₂ = 2 kg at rest.
V_cm = 6/3 = 2 m/s. T_L = ½ × 1 × 36 = 18 J. µ = 2/3 kg → T_C = ½ × (2/3) × 36 = 12 J.
Ratio 18 : 12 = **3 : 2 = (1 + 2) : 2** ✓. KE of CM motion = ½ × 3 × 2² = 6 J = 18 − 12 ✓. The most KE that any collision can convert to heat is T_C = **12 J**.

> **PYQ:** TRE 1.0 (2023) asked: "What is the ratio of total kinetic energies in laboratory system (T_L) and centre of mass system (T_C) in the scattering with projectile of mass m₁ and target of mass m₂? (A) m₁ : m₂ (B) (m₁ + m₂) : m₂ (C) (m₁ + m₂) : m₁". **Worked answer: (B) (m₁ + m₂) : m₂** (no official key in our files).

> **Exam angle:** Only the KE available in the CM frame can be used to create new particles — that is why particle physicists build **colliders** (two beams head-on, lab frame = CM frame) instead of hitting a fixed target.

## 7. Torque and equilibrium

- **Torque (moment of force)** τ = r × F, magnitude τ = rF sin θ = F × perpendicular distance. Unit N m (not joule). It is a vector along the axis.
- **Couple**: two equal, opposite, non-collinear forces; produces rotation only (steering wheel, opening a tap). Torque of a couple = F × arm.
- **Equilibrium**: (i) net force = 0 (translational) and (ii) net torque = 0 (rotational).
- **Principle of moments** (lever): load × load arm = effort × effort arm.

**Example 15.** A 20 N force acts perpendicular to a spanner at 0.5 m → τ = **10 N m**. At 30° to the spanner τ = 20 × 0.5 × 0.5 = 5 N m.

### Levers (class 9–10 classic)

| Class | What is in the middle | Examples | Mechanical advantage |
|---|---|---|---|
| First | fulcrum | see-saw, scissors, pliers, beam balance, crowbar | > 1, = 1 or < 1 |
| Second | load | nutcracker, wheelbarrow, bottle opener, lemon squeezer | always > 1 |
| Third | effort | forceps/tongs, fishing rod, human forearm, broom | always < 1 (gain in speed) |

Mechanical advantage MA = load/effort; velocity ratio VR = distance moved by effort/distance moved by load; efficiency = MA/VR.

## 8. Moment of inertia

**Moment of inertia (I)** is rotational inertia: I = Σ m r². It depends on mass **and how the mass is distributed about the axis**. Unit kg m². **Radius of gyration** k: I = Mk².

| Body (axis) | Moment of inertia |
|---|---|
| Ring / thin hollow cylinder (central axis) | MR² |
| Disc / solid cylinder (central axis) | ½MR² |
| Solid sphere (diameter) | (2/5)MR² |
| Hollow (thin) sphere (diameter) | (2/3)MR² |
| Thin rod (through centre, ⟂) | ML²/12 |
| Thin rod (through one end, ⟂) | ML²/3 |
| Ring (about a diameter) | ½MR² |
| Disc (about a diameter) | ¼MR² |
| Rectangular plate (through centre, ⟂ to plate) | M(a² + b²)/12 |

- **Parallel axis theorem**: I = I_cm + Md² (d = distance between parallel axes).
- **Perpendicular axis theorem** (plane laminas only): I_z = I_x + I_y.

**Example 16.** Rod about one end from parallel axis: ML²/12 + M(L/2)² = ML²/12 + ML²/4 = **ML²/3** ✓.

> **Exam angle:** For the same mass and radius, **ring > disc**, and **hollow sphere > solid sphere**, because more mass is far from the axis. A flywheel has most of its mass on the rim for large I.

## 9. Angular momentum and its conservation

<div class="formula">

| Linear | Rotational |
|---|---|
| displacement s | angle θ |
| velocity v | angular velocity ω (v = rω) |
| mass m | moment of inertia I |
| force F | torque τ = Iα |
| momentum p = mv | angular momentum L = Iω = r × p = mvr |
| KE = ½mv² | KE = ½Iω² = L²/2I |
| work F s | work τ θ |
| power F v | power τ ω |

</div>

- τ = dL/dt. If **no external torque acts, L = Iω stays constant** (law of conservation of angular momentum).
- Examples: a ballet dancer or ice skater **pulls the arms in → I decreases → spins faster**; a diver tucks to somersault faster; a cat lands on its feet; Kepler's second law (equal areas in equal times) for planets.

**Example 17.** A skater with I = 4 kg m² spins at 2 rad/s, then pulls the arms in so I = 2 kg m². ω = 4 × 2/2 = **4 rad/s**. KE rises from ½ × 4 × 4 = 8 J to ½ × 2 × 16 = **16 J** — the extra energy comes from the work done by her muscles (L is conserved, KE is not).

**Example 18.** If the Earth suddenly shrank to half its radius (mass same), I becomes ¼, ω becomes 4 times → length of day = 24/4 = **6 hours**.

> **PYQ:** TRE 2.0 (2023) asked: "Kepler's second law is based on (A) Newton's first law (B) Newton's second law (C) conservation of angular momentum". **Official answer: (C).** Gravity is a central force → no torque about the Sun → L constant → areal velocity dA/dt = L/(2m) constant. More in [Gravitation and Properties of Matter](/interview/bpsc-tre/class-9-10-science/physics/gravitation-and-properties-of-matter).

## 10. Rolling motion

A body rolling without slipping has v = Rω, and its KE = translational + rotational:

<div class="formula">

| Rolling result | Formula |
|---|---|
| Total KE | K = ½mv² (1 + k²/R²) |
| Acceleration down an incline | a = g sin θ / (1 + k²/R²) |
| Speed at the bottom (height h) | v = √[2gh / (1 + k²/R²)] |
| Fraction of KE that is rotational | (k²/R²)/(1 + k²/R²) |

</div>

| Body | k²/R² | a on incline | Rotational share of KE |
|---|---|---|---|
| Solid sphere | 2/5 | (5/7) g sin θ | 2/7 |
| Disc / solid cylinder | 1/2 | (2/3) g sin θ | 1/3 |
| Hollow sphere | 2/3 | (3/5) g sin θ | 2/5 |
| Ring / hollow cylinder | 1 | (1/2) g sin θ | 1/2 |

**Order of reaching the bottom** (released together from the same height): **solid sphere → disc/solid cylinder → hollow sphere → ring**. A block sliding without friction would beat all of them (a = g sin θ).

**Example 19.** A disc rolls down a 3 m high incline from rest (g = 10). v = √(2 × 10 × 3/1.5) = √40 ≈ **6.3 m/s** (a sliding frictionless block would reach √60 ≈ 7.7 m/s).

### Rotational analogues at a glance

| Example | What is conserved / why |
|---|---|
| Planet faster at perihelion | angular momentum (central force) |
| Helicopter has a tail rotor | to cancel the reaction torque on the body (L conservation) |
| Spinning top / gyroscope stays upright | large L resists change in direction |
| Door handle far from hinges | larger arm → more torque for the same force |
| Ice skater, diver, ballet dancer | I decreases → ω increases |
| Long pole used by a tightrope walker | large I makes toppling slow and easy to correct |

For the GS-level version see [Motion, Force, Work and Energy (BPSC CCE)](/interview/bpsc-2027/science/motion-force-work-and-energy).

## Traps and exceptions

- **No work** is done by a man holding a heavy suitcase still, by a coolie walking on level ground (against gravity), or by centripetal/magnetic force.
- Work by friction is usually **negative**; work by gravity on a rising body is **negative**.
- **Torque** is in N m, never "joule", although it has the dimensions of work.
- **Momentum is conserved in all collisions**; KE only in elastic ones.
- In a perfectly inelastic collision bodies stick, but KE is **not** necessarily all lost — the KE of CM motion survives.
- **T_L/T_C = (m₁ + m₂)/m₂**, not m₁/m₂ (TRE 1.0 trap).
- Equal masses in a 1-D elastic collision **exchange** velocities.
- A spinning skater's **angular momentum** is conserved, but her **kinetic energy increases**.
- Kepler's second law ↔ **angular momentum conservation**, not Newton's first or second law directly.
- MOI depends on the **axis**; the same body has different I about different axes.
- Perpendicular axis theorem works only for **flat (plane) bodies**.
- In a rolling race the **solid sphere** wins and the **ring** comes last — mass and radius do not matter, only k²/R².
- Third-class levers (forceps, forearm) have MA **< 1**; they are used for convenience/speed.
- PE can be negative; KE never.

## Quick revision

1. W = F s cos θ; unit joule; scalar.
2. Work–energy theorem: W_net = ΔK.
3. K = p²/2m; doubling speed → 4 × KE.
4. Gravitational PE = mgh; spring PE = ½kx².
5. Friction and air drag are non-conservative forces.
6. Power = W/t = F v; 1 hp = 746 W; 1 kWh = 3.6 MJ.
7. Elastic collision: KE conserved, e = 1; perfectly inelastic: e = 0.
8. e = √(h′/h) for a bouncing ball.
9. Equal masses (elastic, head-on) exchange velocities.
10. Reduced mass µ = m₁m₂/(m₁ + m₂).
11. T_L : T_C = (m₁ + m₂) : m₂.
12. V_cm stays constant without external force.
13. Torque = r × F; unit N m.
14. I: ring MR², disc ½MR², solid sphere 2/5 MR², hollow sphere 2/3 MR².
15. Rod: ML²/12 (centre), ML²/3 (end).
16. L = Iω; constant when net external torque is zero.
17. Kepler's 2nd law = conservation of angular momentum.
18. Rolling KE = ½mv²(1 + k²/R²).
19. Rolling race: solid sphere > disc > hollow sphere > ring.
20. Nutcracker = second-class lever; forceps = third-class lever.

## Practice with answers

1. Work done by the centripetal force in uniform circular motion? — **Zero** (force ⟂ displacement).
2. SI unit of power? — **Watt** (J/s).
3. A body's KE becomes 9 times. Its momentum becomes? — **3 times** (p ∝ √K).
4. Which is conserved in an inelastic collision? — **Linear momentum** (KE is not).
5. A 1 kg body falls 5 m (g = 10). KE at the ground? — **50 J**.
6. Coefficient of restitution for a perfectly elastic collision? — **1**.
7. What happens when equal masses collide elastically head-on, one at rest? — **They exchange velocities**.
8. Reduced mass of two equal masses m? — **m/2**.
9. In the CM frame, what is the total momentum? — **Zero**.
10. Lab KE 30 J, m₁ = m₂. KE in the CM frame? — **15 J** (T_C = T_L × m₂/(m₁ + m₂)).
11. MOI of a disc about its central axis? — **½MR²**.
12. Why does a diver tuck in during a somersault? — **To reduce I and spin faster** (L constant).
13. Which reaches the bottom of an incline first: ring or solid sphere? — **Solid sphere** (smaller k²/R²).
14. Fraction of KE that is rotational for a rolling ring? — **½**.
15. Class of lever for a wheelbarrow? — **Second class** (load between fulcrum and effort).
16. 50 kg man climbs 6 m in 12 s (g = 10). Power? — **250 W**.
17. Is torque a scalar or vector? — **Vector** (along the axis of rotation).
18. Energy change in a dynamo? — **Mechanical → electrical**.
19. Unit of moment of inertia? — **kg m²**.
20. Parallel axis theorem? — **I = I_cm + Md²**.
