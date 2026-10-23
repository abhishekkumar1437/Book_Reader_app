---
title: Kinematics and Laws of Motion
part: Mechanics
summary: Motion in a line and a plane, graphs, equations of motion, free fall, projectiles and circular motion, then Newton's laws, momentum, impulse, rocket propulsion with the variable-mass (rocket) equation, friction, lifts, banking and pseudo forces.
---

This chapter takes you from NCERT class 9 "Motion" and "Force and Laws of Motion" through class 11 kinematics to the B.Sc. rocket equation.
TRE 3.0 asked class 9 graph basics (axes of a distance–time graph, uniform speed); TRE 1.0 asked a B.Sc. rocket-fuel-rate numerical — so you need both ends.

> **In simple words:** Kinematics describes motion (how far, how fast, how quickly speed changes) without asking why. Newton's laws explain *why* — a force changes momentum. Almost every numerical here uses just four ideas: v = u + at, slope of a graph, area under a graph, and F = ma (or F = dp/dt).

## 1. Describing motion

- **Rest and motion are relative**: a passenger is at rest relative to the train but moving relative to the platform.
- **Distance** = total path length (scalar, never negative, never decreases).
- **Displacement** = shortest straight-line distance from start to end, with direction (vector; can be zero or negative).
- Distance ≥ |displacement|. For a full circle: distance = 2πr, displacement = 0.
- **Speed** = distance/time (scalar); **velocity** = displacement/time (vector).
- **Average speed** = total distance ÷ total time (not the average of speeds!).
- **Uniform motion** = equal distances in equal intervals of time, however small. Uniform circular motion has constant speed but changing velocity — it is **accelerated** motion.
- **Acceleration** = rate of change of velocity, a = (v − u)/t, unit m/s². Negative acceleration opposite to velocity = **retardation/deceleration**.

**Example 1 (average speed trap).** A bus goes from Patna to Gaya (100 km) at 50 km/h and returns at 25 km/h.
Time = 100/50 + 100/25 = 2 + 4 = 6 h; total distance = 200 km → average speed = 200/6 = **33.3 km/h** (not 37.5).
Shortcut for equal distances: v_avg = 2v₁v₂/(v₁ + v₂) = 2 × 50 × 25/75 = 33.3 km/h. Average velocity for the round trip = **0** (displacement zero).

**Example 2.** A car goes from 36 km/h to 72 km/h in 5 s. 36 km/h = 10 m/s, 72 km/h = 20 m/s (multiply km/h by 5/18).
a = (20 − 10)/5 = **2 m/s²**; distance = average velocity × t = 15 × 5 = **75 m**.

## 2. Graphs of motion

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <line x1="30" y1="170" x2="190" y2="170"/>
  <line x1="30" y1="170" x2="30" y2="20"/>
  <text x="150" y="188" fill="currentColor" stroke="none">time t →</text>
  <text x="2" y="30" fill="currentColor" stroke="none">x</text>
  <line x1="30" y1="130" x2="180" y2="130" stroke-dasharray="4 3"/>
  <text x="120" y="125" fill="currentColor" stroke="none">rest</text>
  <line x1="30" y1="170" x2="160" y2="60"/>
  <text x="140" y="78" fill="currentColor" stroke="none">uniform v</text>
  <path d="M 30 170 Q 100 165 130 30"/>
  <text x="62" y="40" fill="currentColor" stroke="none">accelerating</text>
  <text x="45" y="16" fill="currentColor" stroke="none">Position–time</text>
  <line x1="240" y1="170" x2="400" y2="170"/>
  <line x1="240" y1="170" x2="240" y2="20"/>
  <text x="360" y="188" fill="currentColor" stroke="none">t →</text>
  <text x="222" y="30" fill="currentColor" stroke="none">v</text>
  <line x1="240" y1="120" x2="380" y2="50"/>
  <line x1="380" y1="50" x2="380" y2="170" stroke-dasharray="4 3"/>
  <line x1="260" y1="170" x2="260" y2="110" stroke-dasharray="2 3"/>
  <line x1="290" y1="170" x2="290" y2="95" stroke-dasharray="2 3"/>
  <line x1="320" y1="170" x2="320" y2="80" stroke-dasharray="2 3"/>
  <line x1="350" y1="170" x2="350" y2="65" stroke-dasharray="2 3"/>
  <text x="244" y="114" fill="currentColor" stroke="none">u</text>
  <text x="384" y="48" fill="currentColor" stroke="none">v</text>
  <text x="280" y="155" fill="currentColor" stroke="none">area = s</text>
  <text x="300" y="70" fill="currentColor" stroke="none">slope = a</text>
  <text x="260" y="16" fill="currentColor" stroke="none">Velocity–time</text>
</svg>

| Graph | Slope gives | Area under it gives |
|---|---|---|
| Distance/position–time | speed/velocity | — (no meaning) |
| Velocity–time | acceleration | displacement (distance if no reversal) |
| Acceleration–time | jerk | change in velocity |
| Force–time | — | impulse (change in momentum) |
| Force–displacement | — | work done |

- A straight-line x–t graph → **uniform velocity**; a line parallel to the time axis → **rest**; a curve bending upward → **acceleration**.
- A v–t line parallel to the time axis → **uniform velocity (a = 0)**; a straight sloping line → **uniform acceleration**.
- An x–t graph can never be vertical (that would mean infinite speed) and a body cannot be at two positions at the same time.
- Convention: **time on the x-axis (horizontal), distance/position on the y-axis (vertical)** because time is the independent variable.

> **PYQ:** TRE 3.0 (2024, class 9–10 Science) asked about the **axes of a distance–time graph**, the **position–time graph** and **uniform speed** (per the PW paper analysis). Answer pattern: time on the x-axis, distance on the y-axis; slope = speed; uniform speed gives a straight line.

## 3. Equations of motion (constant acceleration)

<div class="formula">

| Equation | Missing quantity |
|---|---|
| v = u + at | s |
| s = ut + ½at² | v |
| v² = u² + 2as | t |
| s = ½(u + v)t | a |
| sₙ (distance in nth second) = u + a(2n − 1)/2 | — |

</div>

These are valid **only for constant acceleration**. NCERT derives them from the v–t graph (slope and area).

**Example 3.** A train starting from rest gets a = 0.5 m/s² for 1 minute. v = 0 + 0.5 × 60 = **30 m/s**; s = ½ × 0.5 × 60² = **900 m**.

**Example 4 (stopping distance).** A car at 20 m/s brakes with 5 m/s². s = u²/(2a) = 400/10 = **40 m**. If the speed is doubled, stopping distance becomes **4 times** (s ∝ u²).

## 4. Free fall and vertical motion

- All bodies fall with the same acceleration **g ≈ 9.8 m/s²** in vacuum, whatever their mass (Galileo; the feather-and-coin experiment).
- Air resistance makes light bodies fall slower; a parachutist reaches a constant **terminal velocity**.

<div class="formula">

| Case (take g = 10 m/s² unless told) | Result |
|---|---|
| Dropped from height h | t = √(2h/g), v = √(2gh) |
| Thrown up with speed u | max height H = u²/(2g), time to top = u/g, total time = 2u/g |
| Distances in successive seconds from rest | 1 : 3 : 5 : 7 … (Galileo's law of odd numbers) |
| Distance in first n seconds | ∝ n² (1 : 4 : 9 …) |

</div>

**Example 5.** A stone is dropped from an 80 m tower. t = √(2 × 80/10) = √16 = **4 s**; v = gt = **40 m/s**.

**Example 6.** A ball is thrown up at 20 m/s. H = 400/20 = **20 m**; it returns after 2u/g = **4 s** with the same speed 20 m/s.

> **Common mistake:** At the highest point velocity is zero but **acceleration is still g downward**. A body thrown up and a body dropped side-by-side both have acceleration g.

## 5. Relative velocity

- v_AB (velocity of A relative to B) = v_A − v_B.
- Same direction: relative speed = difference; opposite directions: relative speed = sum.

**Example 7.** Two trains, 54 km/h and 36 km/h, approach each other: relative speed = 90 km/h = **25 m/s**. If their total length is 250 m they cross in 250/25 = **10 s**.

**Example 8 (rain–umbrella).** Rain falls vertically at 30 m/s; a cyclist moves at 10 m/s. Rain relative to cyclist makes angle tan⁻¹(10/30) with the vertical → tilt the umbrella **forward** by tan⁻¹(1/3) ≈ 18.4°.

## 6. Projectile motion

A projectile moves under gravity alone: **horizontal velocity stays constant** (no horizontal force), vertical motion is free fall. The path is a **parabola** (Galileo).

<div class="formula">

| Quantity (launch speed u at angle θ to horizontal) | Formula |
|---|---|
| Time of flight | T = 2u sin θ / g |
| Maximum height | H = u² sin²θ / (2g) |
| Horizontal range | R = u² sin 2θ / g |
| Maximum range (θ = 45°) | R_max = u²/g, and then H = R_max/4 |
| Equal ranges | for θ and (90° − θ) (complementary angles) |
| Horizontal launch from height h | t = √(2h/g), range = u√(2h/g) |

</div>

- At the highest point: vertical velocity = 0, speed = u cos θ, acceleration = g (downward).
- Kinetic energy is minimum (not zero) at the top for an oblique projectile.

**Example 9.** u = 20 m/s at 30°, g = 10. T = 2 × 20 × 0.5/10 = **2 s**; H = 400 × 0.25/20 = **5 m**; R = 400 × sin 60°/10 = 40 × 0.866 = **34.6 m**.

**Example 10.** A bullet fired horizontally and a bullet dropped from the same height at the same time **hit the ground together** — horizontal motion does not affect vertical fall.

## 7. Uniform circular motion

- Angular displacement θ (radian), angular velocity ω = θ/t (rad/s), v = rω, ω = 2π/T = 2πf.
- Even at constant speed the direction changes, so there is a **centripetal acceleration** a = v²/r = ω²r, directed towards the centre.
- **Centripetal force** F = mv²/r is not a new kind of force: tension (stone on a string), gravity (Moon around Earth), friction (car on a curve), electric force (electron around nucleus).

**Example 11.** A car takes a turn of radius 50 m at 10 m/s. a = 100/50 = **2 m/s²**. Required friction for a 1000 kg car = 2000 N.

**Example 12.** The second hand of a clock (length 2 cm): ω = 2π/60 = **0.105 rad/s**.

## 8. Newton's laws of motion

### First law — law of inertia

A body stays at rest or in uniform straight-line motion unless an external unbalanced force acts. (Galileo first stated the idea of inertia; Newton made it a law.)

- **Inertia** = tendency to resist change in the state of rest or motion. **Mass is the measure of inertia.**
- Inertia of rest: passengers fall backward when a bus starts suddenly; dust leaves a carpet when beaten; coin falls into the glass when the card is flicked.
- Inertia of motion: passengers fall forward when brakes are applied; athletes run before a long jump.
- Inertia of direction: mud flies off a rotating wheel along the tangent; sparks from a grinding wheel fly tangentially.

### Second law — F = dp/dt

Rate of change of momentum = applied force, in the direction of the force. For constant mass, **F = ma**. Momentum p = mv (vector, kg m/s).

### Third law — action and reaction

To every action there is an equal and opposite reaction. **They act on different bodies**, so they never cancel each other. Examples: walking (we push the ground back), swimming, recoil of a gun, rocket and jet propulsion, a boat moving back when you jump off.

<div class="formula">

| Quantity | Formula | Unit |
|---|---|---|
| Momentum | p = mv | kg m/s |
| Force | F = dp/dt = ma | N |
| Impulse | J = F Δt = Δp | N s |
| Weight | W = mg | N |
| Recoil velocity | V = −mv/M | m/s |

</div>

**Example 13 (recoil).** A 5 kg gun fires a 50 g bullet at 400 m/s. Momentum conservation: 5V = 0.05 × 400 → V = **4 m/s backward**.

**Example 14 (impulse).** A 150 g cricket ball at 20 m/s is hit straight back at 20 m/s. Δp = 0.15 × (20 + 20) = **6 N s**. If contact lasts 0.01 s, average force = 6/0.01 = **600 N**.

> **Exam angle:** Impulse explains why a fielder **pulls the hands back** while catching, why vehicles have **crumple zones** and air bags, why we land on sand in the long jump — increasing Δt decreases force for the same Δp.

## 9. Conservation of linear momentum

If no external force acts on a system, its **total momentum stays constant**. It follows from Newton's second and third laws (internal forces cancel in pairs).

**Example 15.** A 2 kg ball at 3 m/s sticks to a 1 kg ball at rest. Common velocity = (2 × 3)/(2 + 1) = **2 m/s**. KE before = 9 J, after = ½ × 3 × 4 = 6 J → 3 J lost (perfectly inelastic). Collisions are treated fully in [Work, Energy, Power and Rotation](/interview/bpsc-tre4-science/physics/work-energy-power-and-rotation).

## 10. Rocket propulsion — variable mass (B.Sc.)

A rocket pushes hot gas backward at a high speed u (relative to the rocket); the gas pushes the rocket forward. It works in vacuum — it does **not** need air to push against. Principle: **conservation of momentum / Newton's third law**.

<div class="formula">

| Quantity | Formula |
|---|---|
| Thrust | F = u (dm/dt) (u = exhaust speed relative to rocket, dm/dt = fuel burn rate) |
| Condition to just lift off | u (dm/dt) = M g → dm/dt = Mg/u |
| Initial acceleration | a = [u (dm/dt) − Mg] / M |
| Velocity in free space (Tsiolkovsky) | v = v₀ + u ln(m₀/m) |
| With gravity (vertical, constant burn) | v = u ln(m₀/m) − g t |

</div>

Here m₀ = initial mass (body + fuel), m = mass at that moment. ln means natural log (ln 10 = 2.303).

**Example 16 (TRE 1.0 type).** A rocket of 50 kg carries 450 kg of fuel; exhaust speed = 5 km/s. Minimum burn rate to just lift off?
Total mass M = 50 + 450 = 500 kg. Weight = 500 × 9.8 = 4900 N. dm/dt = Mg/u = 4900/5000 = **0.98 kg/s**.

> **PYQ:** TRE 1.0 (2023) asked exactly this: rocket 50 kg + 450 kg fuel, maximum exhaust velocity 5 km/s, minimum rate of fuel consumption to just lift it off — options 0.98, 0.098, 9.8 kg/s. **Worked answer: 0.98 kg/s** (no official key in our files). Trap: using only 50 kg or only 450 kg.

**Example 17.** Same rocket burning 2 kg/s at lift-off: thrust = 5000 × 2 = 10 000 N; net = 10 000 − 4900 = 5100 N; a = 5100/500 = **10.2 m/s²** upward.

**Example 18 (rocket equation).** Ignoring gravity, if all 450 kg of fuel burns, m₀/m = 500/50 = 10 → v = 5 km/s × ln 10 = 5 × 2.303 = **11.5 km/s**. This is why multistage rockets drop empty stages: a large m₀/m ratio is needed.

## 11. Friction

Friction is the force that opposes relative motion (or attempted motion) between surfaces in contact. It comes from interlocking of surface irregularities and molecular adhesion.

| Type | Meaning | Value |
|---|---|---|
| Static friction | before motion starts; self-adjusting | 0 up to f_s,max = µ_s N (limiting friction) |
| Kinetic (sliding) friction | while sliding | f_k = µ_k N, slightly less than limiting |
| Rolling friction | wheel rolling | much smaller than sliding |

- Order: **limiting static > kinetic > rolling**. That is why ball bearings and wheels reduce friction.
- µ is dimensionless; it depends on the nature of surfaces, **not** on the area of contact (for ordinary loads). µ can exceed 1 (e.g. rubber on dry concrete).
- **Angle of friction** λ: tan λ = µ_s. **Angle of repose** (largest slope on which a block stays at rest) = angle of friction.
- Friction is necessary: walking, writing, brakes, nails, knots. Reduce it with lubricants, polishing, streamlining, ball bearings, air cushion.

**Example 19.** A 10 kg block rests on a floor, µ_s = 0.4, g = 10. Limiting friction = 0.4 × 100 = **40 N**. If you push with 25 N it does not move and friction is **25 N** (self-adjusting), not 40 N.

**Example 20.** A block just begins to slide when the incline is at 30°. µ_s = tan 30° = **0.577**.

## 12. Lifts, banking and connected bodies

<div class="formula">

| Situation | Apparent weight R |
|---|---|
| Lift at rest or moving with constant velocity | R = mg |
| Accelerating upward (a) | R = m(g + a) |
| Accelerating downward (a) | R = m(g − a) |
| Free fall (a = g, cable broken) | R = 0 (weightlessness) |

</div>

**Example 21.** A 60 kg person in a lift, g = 10. Lift accelerates up at 2 m/s² → R = 60 × 12 = **720 N**; accelerates down at 2 m/s² → 60 × 8 = **480 N**; free fall → **0**.

- **Banking of roads**: outer edge raised so that a component of the normal force gives the centripetal force. Ideal banking angle (no friction): **tan θ = v²/(rg)**. Safe speed with friction: v_max = √[rg (µ + tan θ)/(1 − µ tan θ)].
- A cyclist **leans inward** on a turn by the same angle tan θ = v²/(rg).
- Maximum speed on a flat curve (friction only): v_max = √(µ r g).

**Example 22.** v = 20 m/s, r = 100 m, g = 10: tan θ = 400/1000 = **0.4** (θ ≈ 21.8°).

**Example 23 (Atwood machine).** Masses 3 kg and 2 kg over a light pulley, g = 10.
a = (m₁ − m₂)g/(m₁ + m₂) = 1 × 10/5 = **2 m/s²**; tension T = 2m₁m₂g/(m₁ + m₂) = 2 × 3 × 2 × 10/5 = **24 N**.

## 13. Frames of reference and pseudo forces (B.Sc.)

- An **inertial frame** is one in which Newton's first law holds (not accelerating). The Earth is approximately inertial (small rotation effects).
- A **non-inertial frame** accelerates. To use Newton's laws in it, we add a **pseudo (fictitious) force −m a₀**, where a₀ is the frame's acceleration.
- **Centrifugal force** (mω²r outward) is a pseudo force seen in a rotating frame. **Coriolis force** (−2m ω × v) acts on bodies moving in a rotating frame; it deflects winds to the **right in the northern hemisphere** (cyclones anticlockwise in NH).
- **Galilean transformation** (between frames moving with constant relative velocity V): x′ = x − Vt, t′ = t, u′ = u − V, a′ = a. Acceleration is the same in all inertial frames, so Newton's laws keep the same form (Galilean invariance). At speeds near c it fails and Lorentz transformation of special relativity is used.

### Everyday examples — which law?

| Situation | Law / idea |
|---|---|
| Passengers jerk back when a bus starts | first law (inertia of rest) |
| Fielder pulls hands back while catching | second law (impulse: longer Δt, smaller F) |
| Karate player breaks a brick with a fast blow | second law (large Δp in short Δt) |
| Walking, swimming, rowing a boat | third law |
| Rocket and jet engines | third law + momentum conservation |
| A horse pulling a cart moves forward | third law; net external force from the ground decides motion |
| Hammer head tightened by striking the handle on the ground | inertia of motion |
| Mud flies off a spinning wheel tangentially | inertia of direction |

For GS-level revision see [Motion, Force, Work and Energy (BPSC CCE)](/interview/bpsc-2027/science/motion-force-work-and-energy).

## Traps and exceptions

- **Average speed ≠ average of speeds** (use total distance ÷ total time; equal distances → 2v₁v₂/(v₁ + v₂)).
- **Uniform circular motion is accelerated** even though speed is constant.
- At the top of a vertical throw, v = 0 but **a = g**.
- **Action and reaction act on different bodies**; they never balance each other.
- A rocket works in **vacuum**; it does not push on air.
- Rocket lift-off uses the **total** mass (body + fuel) — the TRE 1.0 trap.
- **Mass** measures inertia, not weight or volume.
- Static friction is **self-adjusting**: it equals the applied force until the limit.
- Friction does **not** depend on the area of contact (ordinary conditions); µ can be greater than 1.
- Rolling friction < kinetic < limiting static.
- In a freely falling lift apparent weight is **zero**, but true weight (mg) is not zero.
- Range is the same for θ and 90° − θ; maximum at 45° (without air resistance).
- Centrifugal force is a **pseudo** force; the real force in circular motion is **centripetal**.
- Displacement can be zero while distance is not; the magnitude of displacement can never exceed distance.

## Quick revision

1. Speed is scalar; velocity is vector.
2. Slope of x–t graph = velocity; slope of v–t graph = acceleration.
3. Area under v–t graph = displacement.
4. Distance–time graph: time on x-axis, distance on y-axis.
5. v = u + at; s = ut + ½at²; v² = u² + 2as.
6. Free fall from rest: distances in successive seconds 1 : 3 : 5.
7. Max height = u²/2g; time of flight (vertical throw) = 2u/g.
8. Projectile range R = u² sin 2θ/g, maximum at 45°.
9. Centripetal acceleration = v²/r = ω²r.
10. Mass is the measure of inertia (Newton's first law).
11. F = dp/dt; impulse = FΔt = Δp.
12. Action–reaction act on different bodies.
13. Rocket thrust = u (dm/dt); lift-off when u (dm/dt) = Mg.
14. Tsiolkovsky equation: v = u ln(m₀/m).
15. Gun recoil: MV = mv.
16. Limiting friction > kinetic > rolling.
17. Angle of repose = angle of friction; tan λ = µ.
18. Banking: tan θ = v²/rg.
19. Lift going up with acceleration a: R = m(g + a); free fall: R = 0.
20. Coriolis force deflects winds to the right in the northern hemisphere.

## Practice with answers

1. Convert 72 km/h to m/s. — **20 m/s** (multiply by 5/18).
2. What does the slope of a velocity–time graph give? — **Acceleration**.
3. A body covers a circle of radius r once. Displacement? — **Zero** (back to start).
4. A stone dropped from rest falls for 3 s (g = 10). Distance? — **45 m** (½ × 10 × 9).
5. Which quantity is conserved when no external force acts? — **Linear momentum**.
6. Passengers lean forward when a bus stops. Which property? — **Inertia of motion**.
7. Unit of impulse? — **N s** (same as kg m/s).
8. Projection angle for maximum range? — **45°**.
9. A ball is thrown up at 30 m/s (g = 10). Time to reach the top? — **3 s** (u/g).
10. Rocket thrust formula? — **F = u dm/dt** (exhaust speed × fuel burn rate).
11. 100 kg rocket (with fuel), exhaust speed 1000 m/s, g = 10: burn rate to just lift off? — **1 kg/s** (Mg/u).
12. Apparent weight in a freely falling lift? — **Zero**.
13. Does friction depend on the area of contact? — **No** (only on the nature of surfaces and normal force).
14. Why are roads banked on curves? — **So the normal force supplies centripetal force** (less reliance on friction).
15. Name the pseudo force in a rotating frame pointing away from the centre. — **Centrifugal force**.
16. Which law explains the recoil of a gun? — **Third law** (and conservation of momentum).
17. Average speed for equal distances at 40 and 60 km/h? — **48 km/h** (2 × 40 × 60/100).
18. A 2 kg body has momentum 10 kg m/s. Kinetic energy? — **25 J** (p²/2m).
19. Stopping distance if speed is tripled? — **9 times** (s ∝ u²).
20. Which transformation keeps acceleration the same in all inertial frames at low speeds? — **Galilean transformation**.
