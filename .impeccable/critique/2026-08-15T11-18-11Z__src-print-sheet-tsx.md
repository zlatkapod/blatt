---
target: src/print/Sheet.tsx
total_score: 22
max_score: 36
na_heuristics: 3
p0_count: 1
p1_count: 4
timestamp: 2026-08-15T11-18-11Z
slug: src-print-sheet-tsx
---
⚠️ DEGRADED: single-context (both sub-agents idled and terminated without returning findings; two follow-up requests went unanswered and `ListAgents` then reported none reachable. Assessments A and B were run inline, sequentially — design judgment formed and recorded before the detector was run.)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No way to keep your place in a 6–20 step method; an interruption loses your position entirely |
| 2 | Match System / Real World | 3 | Domestic language throughout, but `CHEMICAL / TOOL / CONSUMABLE` is taxonomy the reader never asked for |
| 3 | User Control and Freedom | n/a | A printed sheet offers no interaction to escape from; scoring it would be inventing a number |
| 4 | Consistency and Standards | 3 | The frequency note is prose set in the uppercase label style; the tip's indent is dead (see P2) |
| 5 | Error Prevention | 2 | Cautions are correctly placed first, but lose all visual priority in greyscale — a binding constraint |
| 6 | Recognition Rather Than Recall | 3 | Chemical warning sits ~120mm above the step where you actually open the bottle |
| 7 | Flexibility and Efficiency | 2 | A5 card mode silently overflows to 1.63 pages |
| 8 | Aesthetic and Minimalist Design | 3 | Genuinely beautiful; ~50mm of dead vertical space is waste, not restraint |
| 9 | Error Recovery | 1 | No field and no provision for "if this goes wrong" — the schema has nowhere to put it |
| 10 | Help and Documentation | 3 | Tips carry real contextual help; no glossary for terms like "etches natural stone" |
| **Total** | | **22/36** | **Acceptable (61%)** |

Nine heuristics scored; #3 is `n/a`, so the applicable maximum is 36, not 40.

## Design Specificity Verdict

**LLM assessment: strongly authored — this could not be lifted into another product unchanged.** The zero-padded red numerals in a 12mm column, the caution band ruled top and bottom in the same red, the 4-up materials grid with hairline frames drawn even when empty, and the print-unit type scale together make a document that is recognisably *this* product. Almost nothing here is category-default: the nearest neighbours (recipe apps, SOP templates) look nothing like it. The system has a point of view and holds it.

Where it slips is not styling but **spatial discipline**. The horizontal grid is rigorously governed — measured, all six steps reserve the image column and the text holds one 56.8ch measure down the page. The vertical grid is governed by nothing at all: step rows are 38px, 53px or 115px purely according to whether a photo happens to exist. The sheet is half a designed system and half an accident of content.

**Deterministic scan**: `detect.mjs` over `src/print src/views src/components` returned **2 findings, exit code 2**, both the same rule:
- `overused-font` — `src/print/exporter.ts:30`
- `overused-font` — `src/print/sheet.css:22`

**Both are false positives.** The rule targets Inter/Roboto/Geist-class webfonts that AI-generated UIs converge on. Here the face is Helvetica, selected because an exported sheet must print identically with no network request, and codified in DESIGN.md as The One Grotesque Rule. The detector is pattern-matching a string, not the decision. No true positives were found — the deterministic scan is effectively clean, and everything below came from measurement and inspection instead.

**Visual overlays**: not produced. DOM mutation was verified as available (I successfully injected a `<style>` element), but the browser runs headless in this environment, so a "[Human] tab" overlay would be visible to nobody. The deterministic scan was run via CLI instead, and measurements were taken directly. No overlay exists; I am not claiming one.

**Not verified**: print-media emulation. After `agent-browser set media print`, `matchMedia('print').matches` remained `false` and `.sheet__footer` kept `position: static`, so the media type never flipped. **The fixed-footer behaviour on a multi-page print is therefore unverified** — including whether the repeating footer overlaps step content on page 2. That needs a real Cmd-P on a long tutorial.

## Overall Impression

This is the best-executed thing in the repo, and it is being held back by one unexamined assumption: that a document read at arm's length should be typeset like a document read at desk distance.

Measured, the instruction text — the single most important content on the sheet, the thing someone reads with wet hands from half a metre away — is **10pt, a 2.53mm cap height**. Meanwhile the sheet throws away roughly **50mm of vertical space** on empty gaps beside photographs. The page is simultaneously cramped in the dimension that matters and wasteful in the one that doesn't. The single biggest opportunity is to reclaim that space and spend it on type size.

## What's Working

**Cautions come before materials and method, and are ruled in red top and bottom with `break-inside: avoid`.** Most procedure documents bury warnings in a preamble nobody reads or footnote them where they're too late. Putting "never mix descaler with bleach" above the shopping list is a genuine safety decision, not a layout one.

**The Sheet Decides The Grid Rule is real, and it measures.** All six steps report the reserved image column even though only three carry photos, so the text holds a single 56.8ch measure down the entire page — comfortably inside the healthy 45–90ch band. Most design systems claim this kind of discipline; this one demonstrably has it.

**The empty hairline frame works.** The photo-less material (Squeegee) still draws its 4:3 frame, and the row of four labels stays on one baseline. Confirmed visually. It is a small, unglamorous decision that keeps the page from looking accidental — exactly the sort of thing that separates a designed artefact from a styled one.

## Priority Issues

### [P1] Greyscale destroys the caution band's priority

**What**: Rendered in greyscale, the red rules bounding the cautions become mid-grey rules, and the red `CAUTIONS` label becomes a grey uppercase label — typographically identical to `MATERIALS` and `METHOD`. Side by side with the colour render, the highest-stakes block on the sheet drops from "unmissable" to "third section down".

**Why it matters**: Greyscale legibility is a *binding* product constraint, and the household laser printer is the likeliest output. The content survives — the word "Cautions" is still there — but the *urgency* is carried by red alone, and urgency is the entire function of that block. This is the one place on the sheet where a missed signal means chlorine gas.

**Fix**: Give cautions a non-colour signal that survives desaturation. Cheapest effective change: take the bounding rules to 1.5pt against the 0.75pt used everywhere else, and set the label as reversed type in a solid black chip. Verify by actually printing black-and-white, not by imagining it.

**Suggested command**: `/impeccable polish`

### [P1] The A5 card overflows its own page by 132mm

**What**: Measured, the A5 card renders **342.1mm of content into a 210mm page box — 1.63 pages**. The same six-step tutorial that fits one A4 page becomes two A5 cards, and nothing anywhere says so. The print view's hint text calls it "sized for lamination".

**Why it matters**: A laminated card that is silently two cards is a broken promise, and the reader discovers it at the printer. The 4-material grid also breaks 3+1 on A5, stranding the photo-less item alone on a second row where its empty frame eats a large fraction of a small page.

**Fix**: Card mode currently only shrinks type. Make it a genuinely different composition — drop supply photographs, inline the material names as a single run, tighten step padding — or detect the overflow in the print view and say "this tutorial needs 2 cards" before printing. Given that PRODUCT.md confirms laminated **A4** as the primary format, the honest third option is to question whether A5 mode earns its complexity at all.

**Suggested command**: `/impeccable adapt`

### [P1] Photo rows dictate vertical rhythm, wasting ~50mm while the instructions stay at 10pt

**What**: Measured step-row heights on the sample: 53, 115, 115, 38, 115, 38 px. Rows with a photograph are a fixed ~30mm regardless of how much text they contain; rows without are ~10mm. Step 03 carries two lines of text in a 30mm row, leaving roughly 20mm blank. Across the three photo steps that is ~50mm of empty paper — about 17% of the printable page.

**Why it matters**: Two costs, both paid by the reader at the sink. The eye loses the thread of the sequence because the gaps between steps are wildly uneven. And the space is unavailable for what would actually help — larger instruction type. At a 2.53mm cap height read from half a metre in bathroom light, 10pt is adequate at best.

**Fix**: Stop letting the image column set row height. Cap figure height to the text block's height, or float the figures so short steps close up. Then spend the reclaimed space: 10pt → 11.5–12pt on `.sheet__step-text` would still fit the same sample on one page, with a cap height near 3mm.

**Suggested command**: `/impeccable layout`

### [P2] The tip's 4mm indent is dead code — a CSS specificity collision

**What**: `sheet.css:239` sets `.sheet__step-tip { padding-left: 4mm }`, but computed style measures **`padding-left: 0px`**. The reset at `sheet.css:37-47` — `.sheet p, .sheet h1, … { padding: 0 }` — has specificity (0,1,1) and beats `.sheet__step-tip` at (0,1,0), regardless of source order. The 0.75pt left rule therefore sits hard against its own text with no breathing room.

**Why it matters**: The rule reads as a printing artefact rather than a deliberate mark, and tips are visually inconsistent with the caution list, whose 5mm indent *does* apply (measured 18.9px) because `.sheet__cautions li` matches the reset's specificity and wins on order. It is a small defect that quietly undermines the sheet's most-praised quality: that every rule looks intentional.

**Fix**: Raise specificity to `.sheet .sheet__step-tip`, or switch the indent to `margin-left` which the reset does not touch. Then check the same collision class elsewhere — any single-class rule on a `p`, `h1`, `h2`, `ul`, `ol`, `li` or `figure` inside `.sheet` that sets padding is currently inert.

**Suggested command**: `/impeccable polish`

### [P2] The meta row leaves an orphan separator, and sets prose as a label

**What**: Two defects in one line. The separator is `::after { content: "·" }` on every non-last span, so when the row wraps — measured, it wraps to 2 lines on A5 — a middot is stranded at the end of the first line with nothing after it. Separately, the frequency *note* ("or whenever the glass goes cloudy") is a sentence, but it renders in the same 7.5pt uppercase `0.08em`-tracked style as the metadata beside it.

**Why it matters**: The orphan dot is exactly the kind of small wrongness that reads as carelessness on an otherwise exacting page. The uppercase prose is worse in principle: DESIGN.md's own Uppercase Is A Label Rule reserves that treatment for labels and metadata, and uppercase tracked text is measurably slower to read — which is a poor trade for the one field that explains *when* to actually do this job.

**Fix**: Replace the `::after` separators with a flex `gap` and separator spans that can be suppressed at line ends. Move the frequency note out of the meta row onto its own line in sentence case at the body size.

**Suggested command**: `/impeccable typeset`

## Persona Red Flags

**Petra, the housemate at the sink** *(project-specific persona, derived from PRODUCT.md: a household member who did not write the tutorial, reading laminated A4 at arm's length with wet hands)*: She loses her place after step 03 — nothing marks progress on a laminated sheet, and the ragged 38/115/38px rhythm gives her eye no ladder to climb back onto. She reads the chlorine-gas caution at the very top, then meets the descaler bottle at step 02, roughly 120mm further down the page, with no reminder at the moment of risk. If she printed it on the household mono laser, the caution band she is relying on looks like a section heading.

**Jordan (first-timer)**: Hits `CHEMICAL`, `TOOL`, `CONSUMABLE` at a 1.64mm cap height in grey — a taxonomy that serves the data model, not the reader. "Dilute 1:10 in the trigger bottle" assumes they know what a trigger bottle is. When the descaler dries on the tile because they took a phone call, the sheet offers no recovery path at all — heuristic 9 scored 1 for exactly this.

**Sam (accessibility-dependent)**: The greyscale collapse is meaning conveyed by colour alone, at the highest-stakes point on the page. Annotation Grey measures **5.33:1** on white — it passes WCAG AA numerically, but it is applied at 6.5pt, 7pt, 7.5pt and 8pt, and WCAG is a screen standard at screen distance; on paper at arm's length that combination is a real reading problem, not a technical pass. Credit where due: the step numerals use red *and* 7.06mm size, so sequence survives desaturation on size alone — that is the right kind of redundancy, and it shows the pattern was available.

**Riley (stress tester)**: A 20-step tutorial measures 487.8mm — **1.64 A4 pages** — printed with no page numbers, so a dropped sheet cannot be reassembled. A 100-character title wraps to 4 lines and 42.3mm but does **not** collide with the rule below it (the 80% max-width holds), so that edge degrades gracefully. The A5 overflow is the silent failure: nothing warns, it just comes out as two cards.

## Minor Observations

- The supply-kind taxonomy (`CHEMICAL`/`TOOL`/`CONSUMABLE`) is the smallest type on the sheet at 2.29mm, spending the least legible slot on the least useful information.
- Missing page numbers are documented and accepted at a two-page maximum, but measurement shows a 20-step tutorial already crosses that boundary. The stated ceiling and the real content don't quite agree.
- `UPDATED 2026-08-15` in the footer is unambiguous and well-placed — ISO dates are the right call for a document that may outlive the app.
- The `6 STEPS` and materials `4` counts in the section heads are quietly excellent: they let a reader confirm at a glance that they have the whole sheet.
- Blank rows are filtered before rendering (`Sheet.tsx:26-28`), so editor scaffolding never reaches paper. Correct instinct, cleanly implemented.

## Questions to Consider

- If the sheet is laminated, it is a dry-wipe surface. What if each step carried a tick box, so a reader interrupted mid-job could mark where they were — and wipe it clean for next time?
- Should a caution bind to the step where it applies, rather than only living at the top? "Never mix with bleach" belongs beside step 02, where the bottle is actually opened.
- If laminated A4 is the confirmed primary format, what is A5 card mode actually for — and is it worth the second composition it isn't currently paying for?
- What would this sheet look like if it were designed for 1.5m rather than 0.5m — pinned inside a cupboard door and read while standing back? Does the current type scale have any headroom at all?

---

# Addendum — late Assessment A findings, independently verified

Assessment A returned after this report was delivered. It had driven the real
`exportHtml` path through Chrome `printToPDF` and produced edge-case PDFs — the print
verification the main report listed as unavailable. The findings below were verified
directly against its artefacts and against project source; unverified claims from that
report are not carried here.

## [P0] The fixed print footer destroys content at every page break

**Verified by direct inspection of `edge-20steps.pdf`.** On page 1, step 07's tip
("A clear room is the difference between 35 minutes and an hour") is sliced horizontally
through the glyphs by the footer's white band. Page 2 opens at step 08 — the line does
not repeat. **The text exists in the file and is absent from the printed artefact.**

Mechanism: `sheet.css:290-297` sets `position: fixed; bottom: 0; background: #fff` under
`@media print`. A fixed element sits outside the flow, so the page box reserves no space
for it; `.sheet__steps { padding-bottom: 10mm }` pads only the end of the list, not each
page. `break-inside: avoid` on `.sheet__step` cannot help — the step is not split, it is
overpainted.

This supersedes the main report's note that multi-page footer behaviour was unverified.
It is not a layout blemish; it is silent data loss in the product's primary artefact,
and neither author nor reader can detect it — the screen preview uses
`min-height: 297mm` and so never shows a page break at all.

**Fix**: the reserved band must belong to `@page`, not be painted over the flow. Enlarge
`@page`'s bottom margin by the footer height and place the fixed footer inside that
margin. If that proves unreliable across engines, drop `position: fixed`, render the
footer once at the end of the document, and move repeating identity into a fixed header
strip, which the existing 16mm top margin already reserves.

## [P1] Caution body type is smaller than step text

**Verified against measurements already in this report.** `.sheet__cautions li` computes
to 12px (9pt); `.sheet__step-text` computes to 13.33px (10pt). The chlorine-gas warning
is set one point *smaller* than "Clear every surface".

This sharpens the greyscale finding above rather than replacing it: the caution band's
prominence rests entirely on `--sheet-accent` plus two 0.75pt rules, and both signals
weaken on a mono printer. Raising caution body to 11pt/15pt — above step text, because
consequence outranks sequence — addresses the ranking; the reversed-out label chip and
heavier bounding rules address the greyscale collapse. Both are needed.

## [P2] A5 orphans its section heading

`edge-card.pdf` breaks with `METHOD / 6 STEPS` alone at the foot of page 1 and every step
on page 2. `.sheet__section-head` has no `break-after: avoid`. One line, no downside, and
it fixes orphaned headings on A4 as well.

## [P2] Accessibility defects in the exported standalone file

Verified in source:

- **Cautions are not a heading.** `Sheet.tsx:60` renders the label as
  `<p class="sheet__cautions-label">`, while Materials and Method use `<h2>`. The heading
  outline is H1 → Materials → Method, so heading navigation skips the safety block
  entirely.
- **Step images fall back to empty alt.** `Sheet.tsx:119` uses `alt={image.alt || ''}`,
  making an untitled step photo decorative, while `Sheet.tsx:82` falls back to
  `supply.name` for materials. The step photo is the one carrying procedure.
- **The exported file has no `<html>` element**, and therefore no `lang`.
  `exporter.ts:54-58` emits `<!doctype html>` directly into `<meta>` tags.

## [P3] Smaller confirmed items

- `.sheet__step` has no `:last-child { border-bottom: 0 }`, so the final 0.5pt step
  divider sits ~6mm above the footer's 0.75pt rule — two parallel rules.
- `Sheet.tsx:53` always bolds meta item 0, which is `frequencyLabel`. At the point of
  work, `BATHROOM · 35 MIN` is the more useful emphasis than `EVERY 2 WEEKS`.
- `.sheet__step-figures` declares no `grid-template-columns`, so multiple photos stack in
  one column; a 3-photo step renders ~100mm tall with a large void beside it.

## Scoring impact

The main report's 22/36 did not account for the P0. Heuristic 5 (Error Prevention) and
heuristic 1 (Visibility of System Status) are both overstated by roughly one point given
confirmed content loss and a preview that structurally cannot reveal it. Treat the
headline score as approximately 20/36 rather than 22/36. The frontmatter counts have been
corrected to `p0_count: 1`, `p1_count: 4`.
