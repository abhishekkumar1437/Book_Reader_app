---
title: Syllogism, Statements and Conclusions
part: Reasoning
summary: Solving syllogisms with Venn diagrams and a small rule table (All, Some, No, Some-not), the "either–or" and "possibility" cases, and the logic of statements with conclusions, assumptions, courses of action, arguments and cause–effect — 20 solved examples and practice.
---

A **syllogism** gives two or three statements (called **premises**) and asks which conclusions must be true. You must treat the statements as true even when they sound silly ("All cats are dogs"). The second half of this chapter covers **statement-based reasoning**: a short real-life statement followed by conclusions, assumptions or actions. BPSC asks syllogisms fairly often and statement questions now and then. Both reward a calm, rule-based method more than cleverness.

> **In simple words:** In a syllogism, a conclusion follows only if it is true in **every** possible drawing of the circles. If you can draw even one picture where it is false, it does not follow.

## Part A — Syllogism

### The four statement types

<div class="formula">

| Type | Statement | Picture | What else is surely true |
|---|---|---|---|
| A (universal positive) | All A are B | A circle inside B circle | Some A are B; Some B are A |
| E (universal negative) | No A is B | A and B circles apart | No B is A; Some A are not B; Some B are not A |
| I (particular positive) | Some A are B | A and B circles overlap | Some B are A |
| O (particular negative) | Some A are not B | part of A lies outside B | nothing more (cannot be reversed) |

</div>

"Some" means **at least one, possibly all**. So "Some A are B" does not rule out "All A are B".

<figure>
<svg viewBox="0 0 440 150" width="440" height="150" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<circle cx="60" cy="70" r="48" /><circle cx="60" cy="80" r="22" stroke="var(--accent)" />
<text x="60" y="84" text-anchor="middle" fill="var(--accent)" stroke="none">A</text><text x="60" y="38" text-anchor="middle" fill="currentColor" stroke="none">B</text>
<text x="60" y="140" text-anchor="middle" fill="currentColor" stroke="none">All A are B</text>
<circle cx="150" cy="70" r="28" stroke="var(--accent)" /><circle cx="215" cy="70" r="28" />
<text x="150" y="74" text-anchor="middle" fill="var(--accent)" stroke="none">A</text><text x="215" y="74" text-anchor="middle" fill="currentColor" stroke="none">B</text>
<text x="182" y="140" text-anchor="middle" fill="currentColor" stroke="none">No A is B</text>
<circle cx="295" cy="70" r="32" stroke="var(--accent)" /><circle cx="335" cy="70" r="32" />
<text x="282" y="74" text-anchor="middle" fill="var(--accent)" stroke="none">A</text><text x="350" y="74" text-anchor="middle" fill="currentColor" stroke="none">B</text>
<text x="315" y="140" text-anchor="middle" fill="currentColor" stroke="none">Some A are B</text>
<text x="408" y="60" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">Some A</text>
<text x="408" y="74" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">not B =</text>
<text x="408" y="88" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">part of A</text>
<text x="408" y="102" text-anchor="middle" fill="currentColor" stroke="none" font-size="11">outside B</text>
</svg>
<figcaption>The basic pictures. For "Some A are B" the overlap is sure; the rest of each circle may or may not exist.</figcaption>
</figure>

### Rule table for two premises

When the middle term (the word that appears in both premises) links them, use this table. "A → B → C" means the first premise is about A and B, the second about B and C.

<div class="formula">

| First premise (A–B) | Second premise (B–C) | Sure conclusion |
|---|---|---|
| All A are B | All B are C | All A are C (and Some C are A) |
| All A are B | No B is C | No A is C (and No C is A) |
| Some A are B | All B are C | Some A are C (and Some C are A) |
| Some A are B | No B is C | Some A are not C |
| No A is B | All B are C | Some C are not A |
| No A is B | Some B are C | Some C are not A |
| All A are B | Some B are C | no sure conclusion between A and C |
| Some A are B | Some B are C | no sure conclusion between A and C |
| No A is B | No B is C | no sure conclusion between A and C |

</div>

> **Memory trick:** "**Some + Some = nothing. All + Some = nothing. No + No = nothing.**" For the rest, a negative premise gives a negative conclusion, and a "Some" premise gives a "Some" conclusion.

### The two special cases

**1. Either–or (complementary pair).** If neither conclusion follows by itself, but the two conclusions are about the **same two terms** and **between them cover every possibility**, then "either I or II follows". The pairs are:

- "Some A are C" and "No A is C";
- "All A are C" and "Some A are not C".

(Exactly one of each pair must be true in any world.)

**2. Possibility.** A conclusion that says "**can be**", "**is a possibility**" or "**may be**" follows if you can draw **at least one** picture where it is true — as long as it does not break a premise.

### The method

1. Draw the first premise. Add the second premise in the **least overlapping** way you are allowed.
2. Check each conclusion. If it is false in your least-overlap picture, it does **not** follow.
3. If it is true, ask "can I draw it differently so it becomes false?" If not, it follows.
4. For possibility conclusions, try to draw a picture where it is true.
5. Finally check for an either–or pair.

## Solved examples — syllogism

**Example 1.** Statements: All dogs are animals. All animals are living beings.
Conclusions: I. All dogs are living beings. II. Some living beings are dogs.

- All + All → All dogs are living beings ✓.
- Reverse of "All dogs are living beings" → Some living beings are dogs ✓.
- **Both I and II follow.**

**Example 2.** Statements: Some pens are books. All books are tables.
Conclusions: I. Some pens are tables. II. All tables are pens.

- Some + All → Some pens are tables ✓.
- "All tables are pens" — the tables circle can be much bigger than pens. ✗
- **Only I follows.**

**Example 3.** Statements: All cats are dogs. No dog is a rat.
Conclusions: I. No cat is a rat. II. Some rats are cats.

- All + No → No cat is a rat ✓.
- II contradicts I ✗.
- **Only I follows.**

**Example 4.** Statements: Some A are B. Some B are C.
Conclusions: I. Some A are C. II. No A is C.

<figure>
<svg viewBox="0 0 420 130" width="420" height="130" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
<circle cx="50" cy="60" r="30" /><circle cx="95" cy="60" r="30" /><circle cx="140" cy="60" r="30" />
<text x="38" y="64" text-anchor="middle" fill="currentColor" stroke="none">A</text><text x="95" y="64" text-anchor="middle" fill="currentColor" stroke="none">B</text><text x="152" y="64" text-anchor="middle" fill="currentColor" stroke="none">C</text>
<text x="95" y="115" text-anchor="middle" fill="currentColor" stroke="none">Case 1: A and C do not meet</text>
<circle cx="280" cy="60" r="30" /><circle cx="320" cy="60" r="30" />
<circle cx="300" cy="35" r="30" stroke="var(--accent)" />
<text x="268" y="72" text-anchor="middle" fill="currentColor" stroke="none">A</text><text x="334" y="72" text-anchor="middle" fill="currentColor" stroke="none">B</text><text x="300" y="22" text-anchor="middle" fill="var(--accent)" stroke="none">C</text>
<text x="300" y="115" text-anchor="middle" fill="currentColor" stroke="none">Case 2: A and C meet</text>
</svg>
<figcaption>Both pictures obey "Some A are B" and "Some B are C". In one A and C meet, in the other they do not — so neither conclusion is sure.</figcaption>
</figure>

- Some + Some → no sure conclusion. I does not follow by itself; II does not follow by itself.
- But I and II are about the same terms (A, C) and form the pair "Some A are C / No A is C". One of them must be true.
- **Either I or II follows.**

**Example 5.** Statements: No fruit is a vegetable. All vegetables are green.
Conclusions: I. Some green things are not fruits. II. No fruit is green.

- No + All → Some C are not A → Some green things are not fruits ✓ (the green things that are vegetables are not fruits).
- II: a fruit can be green outside the vegetable circle. Not sure ✗.
- **Only I follows.**

**Example 6.** Statements: All students are boys. Some boys are players.
Conclusions: I. Some students are players. II. Some players are boys.

- All + Some → no sure link between students and players. I ✗ (draw players overlapping boys only outside the students circle).
- II is just the reverse of "Some boys are players" ✓.
- **Only II follows.**

**Example 7.** Statements: Some rings are bangles. No bangle is a chain.
Conclusions: I. Some rings are not chains. II. All chains being rings is a possibility.

- Some + No → Some rings are not chains ✓ (the rings that are bangles cannot be chains).
- II: draw the chain circle inside the part of the rings circle that is outside bangles. No premise is broken → possible ✓.
- **Both follow.**

**Example 8.** Statements: All pencils are erasers. All erasers are sharpeners. Some sharpeners are bags.
Conclusions: I. Some pencils are bags. II. All pencils are sharpeners.

- All + All → All pencils are sharpeners ✓.
- Bags overlap sharpeners, but maybe away from pencils. I ✗.
- **Only II follows.**

**Example 9.** Statements: Some teachers are doctors. All doctors are engineers.
Conclusions: I. Some engineers are teachers. II. Some teachers are not engineers.

- Some + All → Some teachers are engineers → reversed: Some engineers are teachers ✓.
- II: all teachers could be engineers. Not sure ✗. (I and II are not a complementary pair — I is already true.)
- **Only I follows.**

**Example 10.** Statements: No man is a bird. Some birds are parrots.
Conclusions: I. Some parrots are not men. II. All parrots are men.

- No + Some (No A is B, Some B are C) → Some C are not A → Some parrots are not men ✓.
- II contradicts I ✗.
- **Only I follows.**

**Example 11.** Statements: All roses are flowers. Some flowers are red.
Conclusions: I. Some roses are red. II. No rose is red.

- All + Some → no sure conclusion. I ✗, II ✗ separately.
- I and II form the pair "Some roses are red / No rose is red" → **Either I or II follows.**

> **Prelims angle:** BPSC syllogisms are usually two-statement, two-conclusion questions with the options "Only I", "Only II", "Either I or II", "Neither I nor II", "Both I and II". Learn the rule table and the either–or pairs, and these become 20-second questions.

## Part B — Statement-based reasoning

These questions give a short statement from daily life or public policy. You must judge only from the statement and common sense, **not from outside knowledge or your own opinion**.

<div class="formula">

| Type | What you look for | Follows if … |
|---|---|---|
| Conclusion | Something that must be true because of the statement | it is directly supported; no extra facts needed |
| Assumption | Something the speaker takes for granted without saying it | the statement would make no sense without it |
| Course of action | A practical step to solve or reduce the problem | it is practical, legal and addresses the problem |
| Argument (strong / weak) | A reason for or against a proposal | it is important, directly related and not just an opinion |
| Cause and effect | Which of two events caused the other | one event clearly leads to the other |

</div>

> **Remember:** Extreme words — "always", "never", "only", "all", "must", "completely" — usually make a conclusion or action wrong. Mild, practical answers usually follow.

## Solved examples — statements

**Example 12. (Conclusion)** Statement: All the trains from Patna to Delhi were late today due to dense fog.
Conclusions: I. Dense fog can affect train movement. II. Trains from Patna are never on time.

- I is directly supported by the statement ✓.
- II talks about "never" — the statement is only about today ✗.
- **Only I follows.**

**Example 13. (Conclusion)** Statement: Only graduates can apply for the CCE. Ravi has applied for the CCE.
Conclusions: I. Ravi is a graduate. II. Ravi will be selected.

- If only graduates can apply, and Ravi applied (within the rules), Ravi is a graduate ✓.
- Applying does not mean selection ✗.
- **Only I follows.**

**Example 14. (Assumption)** Statement: Rakesh tells Mohan, "Please call me tomorrow at 10 a.m."
Assumptions: I. Mohan has a way to make the call. II. Rakesh will be available at 10 a.m.

- Rakesh would not ask Mohan to call unless he took it for granted that Mohan can call ✓.
- He would not fix 10 a.m. unless he expected to be available then ✓.
- **Both I and II are implicit.**

**Example 15. (Assumption)** Statement: The government has started free coaching for poor students preparing for competitive examinations in every district headquarters.
Assumptions: I. Many poor students want coaching but cannot pay for it. II. Coaching guarantees selection.

- The scheme makes sense only if there are poor students who need it ✓.
- A "guarantee" is not needed for the scheme to make sense ✗.
- **Only I is implicit.**

**Example 16. (Course of action)** Statement: Many students failed in the class 10 mathematics examination in a school this year.
Courses of action: I. The school should arrange extra classes in mathematics. II. All mathematics teachers of the school should be dismissed at once.

- I is practical and addresses the problem ✓.
- II is extreme; failure may have many causes ✗.
- **Only I follows.**

**Example 17. (Course of action)** Statement: Many roads in a city become waterlogged after heavy rain.
Courses of action: I. The city's drains should be cleaned before the monsoon. II. People should stay indoors for the whole monsoon season.

- I is practical and reduces the problem ✓.
- II is not practical ✗.
- **Only I follows.**

**Example 18. (Argument)** Should mobile phones be banned inside school classrooms?
Arguments: I. Yes, phones distract students during lessons. II. No, everyone owns a phone these days.

- I is directly related to the classroom and is an important reason ✓ (strong).
- II does not explain why phones are needed in class ✗ (weak).
- **Only argument I is strong.**

**Example 19. (Cause and effect)** (A) The Kosi river overflowed its banks after heavy rain in its catchment area. (B) Several villages in north Bihar were flooded.

- The overflow of the river leads to flooding of villages.
- **A is the cause and B is its effect.**

> **Bihar connection:** Statement questions often use Bihar-flavoured situations — floods in north Bihar, migration for work, prohibition, school enrolment, road building. Your general knowledge helps you understand the statement, but judge only from what is written.

**Example 20. (Conclusion with "some")** Statement: Some of the newly built rural roads in the district were damaged in the first monsoon.
Conclusions: I. All the new rural roads were of poor quality. II. At least one new rural road was damaged.

- I generalises from "some" to "all" ✗.
- II restates "some" (at least one) ✓.
- **Only II follows.**

## Common traps

1. **Using real-world knowledge in syllogisms.** "All cats are dogs" must be accepted as true.
2. **Reversing "All" wrongly.** "All A are B" does **not** give "All B are A" — only "Some B are A".
3. **Reversing "Some … not".** "Some A are not B" cannot be reversed.
4. **Missing either–or.** Check it only when neither conclusion follows by itself, and only for a complementary pair on the same terms.
5. **Possibility conclusions** follow even when not definite — just do not break a premise.
6. **Extreme words** in statement questions usually mean "does not follow".
7. **Your opinion is not an argument.** A strong argument must be important and directly linked to the question.

## Quick revision

- All A are B → Some B are A. No A is B → No B is A. Some A are B → Some B are A. Some A are not B → no reversal.
- All + All = All. All + No = No. Some + All = Some. Some + No = Some-not. No + All = Some-not (reversed). No + Some = Some-not (reversed).
- All + Some, Some + Some, No + No → no sure conclusion.
- Either–or pairs: Some/No and All/Some-not on the same two terms.
- Possibility follows if one valid picture makes it true.
- Statement questions: conclusion = directly supported; assumption = taken for granted; action = practical; argument = important and related.

## Key terms

| Term | Simple meaning |
|---|---|
| Syllogism | A puzzle of two or more statements and the conclusions that must follow |
| Premise | A given statement that you must accept as true |
| Conclusion | A statement that must be true if the premises are true |
| Middle term | The word common to both premises, which links them |
| Complementary pair | Two statements of which exactly one must be true |
| Possibility | Something that can be true without breaking any premise |
| Assumption | Something taken for granted but not stated |
| Course of action | A practical step to deal with a problem |
| Strong argument | An important reason directly linked to the question |

## Practice

### Problems

1. Statements: All books are pages. All pages are papers. Conclusions: I. All books are papers. II. All papers are books.
2. Statements: Some cars are trucks. No truck is a bus. Conclusions: I. Some cars are not buses. II. No car is a bus.
3. Statements: All kings are queens. Some queens are princes. Conclusions: I. Some kings are princes. II. No king is a prince.
4. Statements: No pen is a pencil. No pencil is a sharpener. Conclusions: I. No pen is a sharpener. II. Some pens are sharpeners.
5. Statements: Some boys are singers. All singers are dancers. Conclusions: I. Some dancers are boys. II. All boys are dancers.
6. Statements: All mangoes are fruits. No fruit is a stone. Conclusions: I. No mango is a stone. II. Some stones being mangoes is a possibility.
7. Statement: The prices of vegetables rose sharply after floods damaged crops in several districts. Conclusions: I. Floods can affect vegetable supply. II. Vegetable prices will never come down.
8. Statement: "Wear a helmet; it can save your life," says a road-safety poster. Assumptions: I. Helmets reduce head injuries in accidents. II. Nobody wears helmets now.

### Answers

1. All + All → I ✓. "All papers are books" reverses "All" ✗. **Only I.**
2. Some + No → Some cars are not buses ✓. II is not sure (some cars outside trucks may be buses) ✗. **Only I.**
3. All + Some → nothing sure. I and II are a complementary pair on kings–princes → **Either I or II.**
4. No + No → nothing sure. Pair "No pen is a sharpener / Some pens are sharpeners" → **Either I or II.**
5. Some + All → Some boys are dancers → reversed, Some dancers are boys ✓. II not sure ✗. **Only I.**
6. All + No → No mango is a stone ✓. II contradicts I, so it is not possible ✗. **Only I.**
7. I is directly supported ✓. II uses "never" ✗. **Only I.**
8. The poster makes sense only if helmets reduce injury ✓. It does not need "nobody wears helmets" ✗. **Only I is implicit.**

**Next:** [Analogy, Classification and Venn Diagrams](/interview/bpsc-2027/mental-ability/analogy-classification-and-venn-diagrams)
