---
title: Exam Scheme and Marking
part: Know the exam
summary: The 400 = 360 + 40 scheme, 30 General Knowledge + 90 Biology, +3/−1 marking, scoring examples, the expected-value maths of guessing, a time plan of about 1 minute per question, and what changed from the old 125-question pattern.
---

This chapter has the complete **arithmetic of marks** for the exam — how many questions, how many marks, how negative marking works, and **when guessing pays and when it does not**. With +3/−1 marking, knowing this maths is as important as Biology, because a wrong strategy throws away 20–30 marks for nothing.

> **In simple words:** 120 questions, 2 hours, +3 for each right answer, −1 for each wrong one, 0 for leaving it. A blind guess gives 0 on average (no gain, no loss), but **if you can eliminate two options, guessing pays** (+1 per question on average).

## 1. The scheme at a glance

<div class="formula">

| Part | Questions | Marks | Note |
|---|---|---|---|
| General Knowledge | 30 | 90 | Syllabus shared by TGT and PGT |
| Biology (subject code 06) | 90 | 270 | Section A Botany + Section B Zoology |
| **Written total** | **120** | **360** | 2 hours, 4 options, OMR |
| Interview | — | 40 | After the written exam |
| **Selection total** | — | **400** | |

**Marking:** right = **+3**; wrong = **−1**; more than one circle = **−1** (treated as wrong); left blank = **0**.

</div>

<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" font-size="12">
  <text x="10" y="22" fill="currentColor" stroke="none">Split of 400 marks</text>
  <rect x="10" y="40" width="270" height="40"/>
  <rect x="280" y="40" width="90" height="40"/>
  <rect x="370" y="40" width="40" height="40"/>
  <text x="80" y="65" fill="currentColor" stroke="none">Biology 270</text>
  <text x="290" y="65" fill="currentColor" stroke="none">GK 90</text>
  <text x="374" y="65" fill="currentColor" stroke="none">40</text>
  <line x1="10" y1="95" x2="370" y2="95"/>
  <text x="140" y="112" fill="currentColor" stroke="none">Written 360 (120 Q × 3)</text>
  <text x="330" y="130" fill="currentColor" stroke="none">Interview 40</text>
  <text x="10" y="160" fill="currentColor" stroke="none">Biology = 75% of written, 67.5% of total selection</text>
  <text x="10" y="182" fill="currentColor" stroke="none">One right-to-wrong change = 4-mark swing (+3 to −1)</text>
</svg>

> **Exam angle:** Biology's 270 marks are **67.5%** of the total 400. General Knowledge's 90 marks are not small either — even 20 right and 4 wrong out of 30 give 56 marks, equal to about 19 correct Biology questions.

## 2. The scoring formula

<div class="formula">

**Marks = 3 × (right) − 1 × (wrong)**

If questions attempted = H and right = S, then wrong = H − S
→ **Marks = 3S − (H − S) = 4S − H**

</div>

> **Memory trick:** "Four times right, minus attempted" — 4S − H. Example: 80 attempted, 64 right → 256 − 80 = 176.

### Worked examples

| Candidate | Attempted (H) | Right (S) | Wrong | Marks = 4S − H | Accuracy (S/H) |
|---|---|---|---|---|---|
| A | 120 | 75 | 45 | 300 − 120 = **180** | 62.5% |
| B | 100 | 75 | 25 | 300 − 100 = **200** | 75% |
| C | 90 | 75 | 15 | 300 − 90 = **210** | 83% |
| D | 105 | 85 | 20 | 340 − 105 = **235** | 81% |
| E | 85 | 60 | 25 | 240 − 85 = **155** | 71% |

> **In simple words:** "A" and "C" both have 75 right, but "A" filled 30 extra questions without any basis and **lost 30 marks** (180 vs 210). When the number of right answers is the same, **fewer wrong = more marks**.

### The 25% line — "break-even" accuracy

In any group of questions where your accuracy is **above 25%**, attempting is profitable on average; at 25% it gives 0; below that it is a loss. Reason: at accuracy p, expected marks = 3p − (1 − p) = 4p − 1 → zero at p = 0.25.

| Your accuracy (p) | Expected marks per question = 4p − 1 |
|---|---|
| 25% (blind guess) | 0 |
| 33% (one option eliminated) | +0.33 |
| 50% (two options eliminated) | +1 |
| 75% | +2 |
| 90% | +2.6 |
| 100% | +3 |

## 3. The maths of guessing (Expected Value)

<div class="formula">

| Situation | Options left | Chance of right | Expected marks |
|---|---|---|---|
| Blind guess | 4 | 1/4 | (1/4)(3) − (3/4)(1) = **0** |
| One option surely wrong | 3 | 1/3 | (1/3)(3) − (2/3)(1) = **+0.33** |
| Two options surely wrong | 2 | 1/2 | (1/2)(3) − (1/2)(1) = **+1** |
| Three options surely wrong | 1 | 1 | **+3** |

(Simple form: with n options left, EV = (3 − (n − 1))/n → 0/4 at n = 4, 1/3 at n = 3, 2/2 at n = 2.)

</div>

### Rules that follow

1. **Two options eliminated → answer.** Average gain +1; 10 such questions ≈ +10 marks.
2. **One option eliminated → answer, if the elimination is truly certain.** The gain is small (+0.33); if the "eliminated" option is itself doubtful, leave it.
3. **Know nothing → leave it.** The average is 0, but the variance of your score rises and filling the OMR costs time.
4. **Beware of "half-remembered":** in questions where you are drawn towards a trap option (e.g. Scytonema "true branching" vs "false branching"), your real accuracy can be even below 25% — because the examiner built that option to catch exactly that mistake. Check in your mocks what your accuracy was on "guessed" questions.

> **Remember:** In most long-option questions of the 2026 paper, **two options become clearly wrong because of absolute words like "only / always / without any / independent of"**. So even hard-looking questions often fall in the "eliminate two, take +1" category.

### Example — deciding on one question

> **PYQ (UP PGT 2026):** Q15 — A crop grown at optimum temperature, light and water grows poorly despite adequate macronutrients, until a particular micronutrient is added. Explanation in terms of limiting factors?
> (A) Limiting factors operate only under extreme stress… (B) Growth depends on total nutrient availability; the effect of micronutrient deficiency is negligible… (C) Liebig's law: the factor least available relative to demand limits growth… (D) Shelford's law: growth is maximum only when all factors are at their highest levels together…
>
> Decision sequence: (A) has "only" → eliminate; (B) contradicts the facts of the question ("negligible effect", whereas growth returned as soon as the micronutrient was added) → eliminate. Now two are left — answering pays. Shelford's law of tolerance speaks of "both minimum and maximum limits", not "everything at the highest" → (D) is also wrong.
> **Reasoned answer (official key not available): (C)**

## 4. Time plan — about 1 minute per question

120 questions / 120 minutes = **1 minute per question** — but not all questions are equal. In the 2026 paper about half the questions were one-liners (20–40 seconds), the rest had long options (1.5–2 minutes).

| Stage | Time | What to do |
|---|---|---|
| 0–3 min | 3 | Question-booklet seal, series, roll number, OMR details |
| 3–23 min | 20 | **General Knowledge (30 questions)** — what you know, at once; mark the rest |
| 23–83 min | 60 | **Biology round 1** — one-liners and sure questions; put "?" on long questions and move on |
| 83–108 min | 25 | **Round 2** — the "?" questions; answer if two options go, otherwise leave |
| 108–117 min | 9 | OMR check (verify serial number every 10 questions) |
| 117–120 min | 3 | Buffer — no new guesses |

> **Exam angle:** Fill the OMR circles **after finishing each page**, not all together at the end. Filling 30 circles in the last 5 minutes is the most common disaster.

### Time budget by question type

| Type | Estimated number (of 90) | Target time |
|---|---|---|
| One-line fact | ~43 | 30–40 seconds |
| Long options / scenario | ~24 | 1.5 minutes |
| Statement combination | ~9 | 1.5–2 minutes |
| List matching | ~6 | 1–1.5 minutes |
| Assertion–Reason | ~5 | 1 minute |
| Sequence arrangement | ~3 | 1 minute |

(Estimates obtained by multiplying the 2026 proportions by 90/125; details in [Chapter 4](/interview/up-pgt/jeev-vigyan/pariksha-margdarshika/pichhla-prashnapatra-2026-vishleshan).)

## 5. What changed from the old pattern

| Point | Old (UPSESSB, up to Advt. 02/2022) | New (UPESSC, Advt. 06/2026) |
|---|---|---|
| Subject questions | 125 | **90** |
| General Knowledge | No | **30 questions** |
| Total questions | 125 | **120** |
| Duration | 2 hours (reported) | **2 hours** |
| Negative marking | Not in old advertisements (reported — verify with the official notification) | **−1 per wrong** (+3 right) |
| Basis of selection | Written + interview (old weights different) | **360 + 40 = 400** |
| Question style (2026 paper) | Long options, statements, A–R, matching, sequence | Likely to continue in the same style |

### What this change means

1. **Time per question rose slightly:** from 125 questions/120 minutes (≈58 seconds) to 120/120 (60 seconds) — almost the same, but GK questions are short, so Biology gets a little more time.
2. **Negative marking** means the habit of "fill everything" is now fatal — drop the strategy of the old 2010/2013 papers.
3. **The full syllabus even in 90 questions** — fewer questions per unit, so leaving out any unit entirely is a risk.
4. **General Knowledge** for the first time — 30 questions, about 25% weight. Focus on Uttar Pradesh specials and current affairs — [General Knowledge book](/interview/up-pgt/samanya-gyan/pattern-aur-ranniti).

## 6. Make your own "net score" plan

Fill in the figures from your last mock:

| Section | Attempted | Right | Wrong | 4S − H | Accuracy | Next step |
|---|---|---|---|---|---|---|
| General Knowledge (30) | | | | | | Accuracy < 70% → guess less |
| Botany (≈45) | | | | | | |
| Zoology (≈45) | | | | | | |

> **Remember:** If your overall accuracy in a section is below 70%, the problem is "guessing", not knowledge — first look at the [error log](/interview/up-pgt/jeev-vigyan/pariksha-margdarshika/pustaken-notes-aur-punravritti) of wrong questions.

## Traps and exceptions

- "More than one circle" is also **−1**, not 0 — a circle cannot be changed, so mark the question booklet first, then the OMR.
- The marking scheme is not visible on the cover page of the 2026 (May) paper (the scan had no cover) — so do not compare that paper's "cut-off" directly with the new +3/−1 pattern.
- A blind guess is not a "loss" but a **zero average** — yet many blind guesses make your score uncertain; a topper's strategy is a stable score.
- 1 minute per question is an **average**, not a target — give the time saved on short questions to long ones.

## Quick revision

1. Written 120 questions = 30 GK + 90 Biology; 360 marks.
2. Interview 40; total 400.
3. +3 right, −1 wrong or multiple circles, 0 left.
4. Marks = 4S − H.
5. Break-even accuracy = 25%.
6. Blind guess EV = 0.
7. One option eliminated EV = +0.33.
8. Two options eliminated EV = +1.
9. Turning one right into wrong = 4-mark swing.
10. Average time = 1 minute/question; ~20 minutes for GK.
11. Fill the OMR page by page.
12. Old pattern had 125 subject questions, no GK.
13. Biology = 67.5% of the total 400.
14. GK: 20 right, 4 wrong out of 30 = 56 marks.
15. New style — long options, statement combinations, A–R, matching, sequence.

## Practice questions (with answers)

1. 100 attempted, 78 right — marks? — **212** (4 × 78 − 100).
2. 120 attempted, 80 right — marks? — **200** (320 − 120).
3. 90 attempted, 72 right vs 110 attempted, 76 right — who is ahead? — **The first: 198 vs 194**.
4. Expected marks of a question with three options left? — **+0.33**.
5. Expected gain on 12 questions with two options left? — **+12**.
6. Expected marks of a blind guess? — **0**.
7. Above what accuracy is attempting profitable? — Above **25%** (4p − 1 > 0).
8. All 30 GK questions right — marks? — **90**.
9. Maximum marks of the whole written paper? — **360**.
10. Two circles filled — marks? — **−1**.
11. Expected marks per question at 70% accuracy? — **+1.8** (4 × 0.7 − 1).
12. Which pattern had 125 questions? — **The old UPSESSB pattern** (Advt. 02/2022, exam May 2026).
13. Biology marks in the written exam? — **270** (90 × 3).
14. What does solving 60 one-line questions in 60 minutes imply? — Time will run short for long questions; keep a target of **30–40 seconds** for one-liners.
15. How many marks are lost by changing one right answer to a wrong one? — **4** (+3 to −1).
