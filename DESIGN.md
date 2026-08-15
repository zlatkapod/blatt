---
name: Blatt
description: A printed instruction placard for the home, and the workbench that makes it.
colors:
  accent: "#e4002b"
  ink: "#0a0a0a"
  paper: "#ffffff"
  muted: "#6b6b6b"
  rule: "#c9c9c9"
  rule-faint: "#e6e6e6"
  backdrop: "#ededed"
typography:
  display:
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif'
    fontSize: "40px"
    fontWeight: 700
    lineHeight: "44px"
    letterSpacing: "-0.03em"
  headline:
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif'
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "36px"
    letterSpacing: "-0.02em"
  title:
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif'
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "28px"
    letterSpacing: "normal"
  body:
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "normal"
  label:
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "0.08em"
  sheet-title:
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif'
    fontSize: "28pt"
    fontWeight: 700
    lineHeight: "30pt"
    letterSpacing: "-0.02em"
  sheet-step-number:
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif'
    fontSize: "20pt"
    fontWeight: 700
    lineHeight: "20pt"
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  sheet-step:
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif'
    fontSize: "10pt"
    fontWeight: 400
    lineHeight: "14pt"
    letterSpacing: "normal"
  sheet-body:
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif'
    fontSize: "9.5pt"
    fontWeight: 400
    lineHeight: "13pt"
    letterSpacing: "normal"
  sheet-label:
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif'
    fontSize: "7.5pt"
    fontWeight: 700
    lineHeight: "10pt"
    letterSpacing: "0.08em"
rounded:
  none: "0"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "24px"
  s-6: "32px"
  s-7: "48px"
  s-8: "64px"
  gutter: "16px"
components:
  button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "7px 14px"
  button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "7px 14px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    padding: "7px 14px"
  button-danger-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    padding: "7px 8px"
  button-quiet-hover:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
  filter:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "5px 10px"
  filter-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "5px 0"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  dropzone:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
---

# Design System: Blatt

## Overview

**Creative North Star: "The Workshop Placard"**

The enamelled instruction plate bolted beside a machine. It is authoritative without
raising its voice, survives being wiped down, and is read at a glance by whoever is on
shift rather than by the person who wrote it. Nothing on a placard is there to be
admired; every mark is there because leaving it off would cost someone a mistake. The
sheet is the product, the screen is where the placard gets made, and the two are held
deliberately apart.

The system is International Typographic Style applied literally rather than gestured at:
one installed grotesque, a fixed scale on an 8px baseline, hairline rules instead of
boxes, whitespace doing the grouping, and exactly one accent. There are no shadows, no
rounded corners, no gradients, and no webfont. Type is flush left and ragged right,
never justified. The restraint is not minimalism as a taste — it is what survives a
greyscale laser printer, a laminating pouch, and a reader at arm's length in bad light.

Its confirmed anti-references are the consumer recipe app (rounded cards, soft shadows,
chatty warmth), the corporate SOP (a Word template wearing a revision table), and the
SaaS dashboard (grey chrome, tasteful blue, 6px radii on everything). Photography is
explicitly *not* rejected: the photos are load-bearing evidence, and the grid is built
to hold them.

**Key Characteristics:**

- One grotesque, no webfont — it must print with no network.
- Hairline rules and whitespace instead of boxes, cards-with-shadows, or fills.
- Exactly one accent, `#e4002b`, spent only where a reader must not miss something.
- Zero radius, zero shadow, zero gradient — declared, not defaulted.
- Print units (pt, mm) on the sheet, so the screen preview is true rather than approximate.
- A hard boundary between the printed sheet and the application around it.

## Colors

Black, white, four greys, and one red — a palette with no room for a decorative decision,
which is the point.

### Primary

- **Poster Red** (`#e4002b`): the system's only chromatic voice, named for its lineage
  rather than its job. On paper it carries step numerals and rules the caution band top
  and bottom. In the application it additionally marks focus rings, destructive actions,
  error banners, active drop targets, and every hover that means "this will do
  something." It is never a background for reading text, never a decorative fill, and
  never used to make a screen look livelier.

### Neutral

- **Press Black** (`#0a0a0a`): all primary text, structural rules, filled buttons, and
  the top bar's bottom edge. Deliberately 4% short of pure black — softer on a lit screen
  and closer to how black ink actually sits on paper.
- **Sheet White** (`#ffffff`): the sheet itself, the top bar, and card faces. It reads as
  paper because it is the same white the printer will leave unmarked.
- **Annotation Grey** (`#6b6b6b`): secondary text — field labels, metadata, supply kinds,
  tips, footers, counts. Everything that answers a question the reader did not ask.
- **Hairline Grey** (`#c9c9c9`): the working rule weight. Input underlines, card borders,
  image frames, placeholder text, and the sheet's step dividers.
- **Ghost Rule** (`#e6e6e6`): the quietest divider, for repeating rows in the editor where
  a full hairline would stripe the page.
- **Bench Grey** (`#ededed`): the application background — the workbench surface the white
  sheet lies on. It exists so paper reads as paper, and it never appears in print.

### Named Rules

**The Do-Not-Miss Rule.** Poster Red marks anything the reader must not overlook:
sequence, danger, error, and where the keyboard currently is. If an element would still
be understood in grey, it stays grey. This is a semantic test, not an inventory — it
scales to components that do not exist yet, and it is why focus rings and caution rules
are the same red without contradiction.

**The Greyscale Rule.** Every layout must be fully legible printed in black and white.
Colour reinforces meaning; it never carries meaning alone. Any element that depends on
red to be understood fails, and the step numerals pass only because their size and
position already encode sequence.

**The Bench Rule.** `#ededed` exists to make white read as paper. It never appears inside
a sheet, and no sheet element may use it as a fill.

## Typography

**Display Font:** Helvetica Neue (with Helvetica, Arial, Liberation Sans, sans-serif)
**Body Font:** the same — one family throughout
**Label/Mono Font:** none; labels are the body face at 12px, uppercase, tracked 0.08em

**Character:** A single neutral grotesque doing every job, distinguished only by size,
weight, case, and tracking. Its personality comes from discipline rather than from the
face — the same instinct that puts a numeral, not an illustration, at the head of a step.
It is chosen for availability as much as for lineage: it is already installed on every
machine this will run on, so an exported sheet prints identically with no network.

### Hierarchy

- **Display** (700, 40px/44px, `-0.03em`): the Library title. One per screen, and only
  where a page needs a name.
- **Headline** (700, 28px/36px, `-0.02em`): the tutorial title field in the editor — the
  one input that looks like the thing it will become.
- **Title** (700, 20px/28px): the `Blatt` wordmark and empty-state headings.
- **Body** (400, 16px/24px): all editable text and prose. Form column capped at 620px;
  empty-state prose at 46ch.
- **Label** (400, 12px/16px, `0.08em`, uppercase): field labels, buttons, filters, meta
  rows, counts, status. The system's connective tissue and its most-used role.

The sheet runs a second, independent scale in print units: **Sheet Title** (700,
28pt/30pt), **Step Number** (700, 20pt, tabular numerals), **Step Text** (400, 10pt/14pt),
**Sheet Body** (400, 9.5pt/13pt), **Sheet Label** (700, 7.5pt/10pt, `0.08em`, uppercase).
The A5 card variant is the same scale stepped down — 19pt title, 15pt numerals, 9pt step
text — never a CSS scale transform.

### Named Rules

**The One Grotesque Rule.** One family, no webfont, no second face — not for code, not
for numerals, not for a display moment. A font that must be fetched is a font that can
fail to arrive at the printer.

**The Ragged Right Rule.** Flush left, ragged right, never justified. The sheet sets
`hyphens: none` — a hyphenated instruction is a misread instruction.

**The Uppercase Is A Label Rule.** Uppercase plus `0.08em` tracking is reserved for
labels, buttons, and metadata. It never sets a sentence, a step, or a caution body.

## Layout

**Screen.** A single centred column, `max-width: 1180px`, with `24px` side padding and a
sticky top bar. The Library is an auto-fill grid of `minmax(240px, 1fr)` cards with a
`16px` gutter and `24px` row gap. The Editor is a two-column grid — a form column capped
at `620px` beside a sticky true-size sheet preview — collapsing below `1100px`, where the
preview is dropped entirely rather than shrunk into uselessness. Repeating rows (supplies,
steps) share one grid: a `28px` numeral column, a fluid body, and a controls column.

**Spacing.** An 8px baseline with no improvisation: 4, 8, 12, 16, 24, 32, 48, 64. Section
headings take `48px` above and `12px` below. The only values outside the scale are
component-intrinsic and deliberate — `7px 14px` button padding, `5px 10px` filter padding,
`26×22px` icon buttons.

**Sheet.** A4 at `210×297mm` with `16mm 18mm 14mm` margins; the A5 card at `148×210mm`
with `10mm 12mm`. Materials are a 4-column grid (3 on the card); steps are a 3-column grid
of `12mm` numeral, fluid text, and a `40mm` image column (`9mm`/`34mm` on the card).
Screen preview shows the sheet at true size and scales it for the editor thumbnail with a
`transform`, so no measurement is ever restated in a second unit.

### Named Rules

**The Sheet Decides The Grid Rule.** The grid is decided by the sheet, not row by row. If
any step carries a photo, every step reserves the image column so the text keeps one
measure down the page; if none do, every step runs full width. A material with no photo
still draws its empty hairline frame. Mixed measures are what make a page look accidental.

**The True Measure Rule.** The sheet is authored in `pt` and `mm` end to end. Scaling for
preview is a `transform` on a wrapper, never a second set of numbers. If you find yourself
converting a sheet measurement to px, you are building a second source of truth.

## Elevation & Depth

There is no elevation. No `box-shadow` appears anywhere in the system, and none should.
Depth is carried entirely by hairline rules, whitespace, and the single tonal step between
Bench Grey and Sheet White — the sheet is not floating above the workbench, it is lying
on it.

Weight hierarchy is expressed in rule strength instead of shadow: `1px solid` Press Black
closes a major section on screen; `1px solid` Hairline Grey borders a card or underlines a
field; `1px solid` Ghost Rule separates repeating rows. On paper the same idea in print
units: `0.75pt` for structural rules (masthead, section heads, caution band, footer) and
`0.5pt` for step dividers and image frames.

### Named Rules

**The Flat Rule.** No shadows, no glows, no blurs, no gradient fills. Two gradients exist
in the codebase and both are geometry, not decoration: the select control's caret is drawn
from two 5px linear-gradient triangles. That is the only sanctioned use — drawing a shape
without shipping an icon.

## Shapes

`border-radius: 0` everywhere, declared explicitly on buttons, inputs, cards, chips, and
icon buttons rather than left to a browser default. Corners are hard because the printed
artefact has hard corners and the workbench should not pretend otherwise.

Borders are the form language. A control is a rule under text (fields), a rule around a
region (cards, image frames), or a filled rectangle (primary and selected states). The one
dashed border in the system is the image dropzone, which becomes solid on hover — the
dashed edge means "nothing here yet," and it resolving to solid is the whole feedback.

Two silhouettes recur and are worth protecting: the **4:3 landscape frame** used for every
photograph, chosen because photographs are landscape and an A4-portrait box would crop a
phone photo to a meaningless slice of its middle; and the **7×7px red square** after the
wordmark, the system's only mark.

### Named Rules

**The Zero Radius Rule.** No rounded corners, anywhere, at any size. A radius appearing in
a diff is a regression, not a refinement.

**The Empty Frame Rule.** A missing image draws its frame anyway. An empty hairline
rectangle costs almost no ink and keeps a row of labels on one baseline; a collapsed frame
shunts its label up the page and makes the grid look broken.

## Components

**Character: printer's furniture.** Quiet, structural, entirely subordinate to the
content. The workbench is the thing that holds the type in place, not the thing you look
at. Every control is built from a rule, a fill, or nothing at all.

Motion is uniformly `90ms linear`, applied only to `background`, `color`, and
`border-color`. Nothing moves position, scales, or eases. A control changes state in the
time it takes to notice, and never draws attention to the change itself.

### Buttons

- **Shape:** hard corners (`border-radius: 0`), `1px solid` Press Black border, `7px 14px`
  padding, label typography — 12px uppercase tracked `0.08em`, never wrapping.
- **Default:** transparent on the workbench with Press Black text; inverts to a Press
  Black fill with Sheet White text on hover.
- **Primary:** Press Black fill with Sheet White text at rest; the fill and border both
  become Poster Red on hover. The one place red is used as a background, and only
  transiently.
- **Danger:** Poster Red border and text on transparent; fills Poster Red with Sheet White
  text on hover.
- **Quiet:** transparent border, Annotation Grey text, tighter `7px 8px` padding; the text
  goes Poster Red on hover with no fill. Used for card row actions where three bordered
  buttons would out-shout the card.
- **Disabled:** `opacity: 0.35`, `not-allowed` cursor, and hover suppressed entirely.
- **Icon:** `26×22px`, borderless, Annotation Grey, Poster Red on hover, `0.25` opacity when
  disabled. Used only for row reordering and removal.

### Chips

- **Style:** `5px 10px`, `1px solid` Hairline Grey, transparent fill, Annotation Grey
  uppercase label. Border and text go Press Black on hover.
- **State:** selection is a Press Black fill with Sheet White text, driven by
  `aria-pressed="true"` rather than a class — the accessible state and the visual state
  are the same fact. Used for library frequency filters and the A4/A5 switch.

### Cards / Containers

- **Corner style:** square.
- **Background:** Sheet White on Bench Grey.
- **Shadow strategy:** none; see Elevation & Depth.
- **Border:** `1px solid` Hairline Grey, going Press Black on hover — the entire hover
  affordance.
- **Internal padding:** `12px` body, `8px` action row.
- **Thumbnail:** 4:3, `object-fit: cover`, separated from the body by a Ghost Rule; an
  empty thumbnail shows `No photo` in Hairline Grey uppercase rather than an icon.

### Inputs / Fields

- **Style:** no box. A field is a `1px solid` Hairline Grey bottom rule with `5px 0`
  padding and a transparent background, under a 12px uppercase Annotation Grey label.
- **Focus:** the underline becomes Poster Red over 90ms; the browser outline is suppressed
  on inputs only because the underline replaces it. Everything else in the system uses the
  global `2px solid` Poster Red focus ring at `2px` offset.
- **Placeholder:** Hairline Grey — visibly lighter than Annotation Grey, so an empty field
  never reads as filled.
- **Textarea:** auto-growing, `resize: none`, `overflow: hidden`, minimum one line.
- **Select:** native control stripped to the same underline, with a caret drawn from two
  5px gradient triangles.

### Navigation

The top bar is the only navigation: sticky, Sheet White, closed by a `1px solid` Press
Black bottom rule that reads as the first rule of the page. The `Blatt` wordmark sits at
20px/700 tracked `-0.03em`, followed by a `7×7px` Poster Red square and an optional
uppercase Annotation Grey subtitle that names the current context (`Cleaning tutorials`,
`Print · A4`). Actions are right-aligned, wrap on narrow screens, and run right-to-left in
importance with the primary action outermost. The whole bar is `display: none` in print.

### The Sheet (signature)

The printed artefact, and the only component that is also the product. Masthead — title,
`0.75pt` rule, uppercase meta row whose first item is bold and whose separators are
middots with equal air on both sides. Then the caution band: ruled Poster Red above and
below, its label and em-dash bullets in Poster Red, placed before the materials because
it changes what the reader is about to do. Then Materials as a 4-up grid of framed 4:3
photographs with kind, name, and note. Then Method as zero-padded Poster Red numerals
(`01`, `02`) in a `12mm` column, step text at 10pt/14pt, an optional tip set behind a
`0.75pt` left rule, and photographs in a reserved `40mm` column. A `0.75pt`-ruled footer
carries the title and update date once, at the end of the document.

**The footer stays in the flow.** It was previously `position: fixed` so it would repeat
on every printed page, and because a fixed box reserves no space in the flow it painted
over whatever the page break left beneath it — on a 20-step tutorial it cut a step's tip
in half and that line reached neither printed page. A repeating footer needs `@page`
margin boxes, which no browser implements; until they do, the footer prints once.

`break-inside: avoid` is set on cautions, each material, and each step: a step split
across a page break is a step someone will perform half of.

### Named Rules

**The Paper/Workbench Rule.** The sheet is a printed object that happens to be previewed
on a screen; the application is furniture standing around it. They share a vocabulary but
never a stylesheet. `sheet.css` defines its own `--sheet-*` values, imports nothing from
the application, and must stay independently inlinable into an exported file.
*Audit test:* open an exported `.blatt.html` with the application deleted. If it does not
render identically, the boundary has been breached.

**The Printer's Furniture Rule.** No control may be more visually assertive than the
content it operates on. If a button competes with a step numeral for the eye, the button
is wrong.

## Do's and Don'ts

### Do:

- **Do** spend Poster Red only where a reader must not miss something — sequence, danger,
  error, focus. If the element still reads correctly in grey, leave it grey.
- **Do** keep every layout legible in greyscale, and verify by printing black-and-white
  rather than by imagining it.
- **Do** reserve a column for the whole sheet when any single row needs it, and draw empty
  frames rather than collapsing them.
- **Do** author sheet measurements in `pt` and `mm`, and scale for preview with a
  `transform` on a wrapper.
- **Do** use hairline rules and whitespace for hierarchy: `1px`/`0.75pt` Press Black to
  close a section, `1px`/`0.5pt` Hairline Grey for structure, Ghost Rule for repetition.
- **Do** express selection with `aria-pressed` and style from the attribute, so the
  accessible state and the visual state cannot drift.
- **Do** keep transitions at `90ms linear` on colour properties only.
- **Do** set `break-inside: avoid` on anything a reader performs as a unit.

### Don't:

- **Don't** add a border radius. Anywhere. At any size.
- **Don't** add a `box-shadow`, glow, blur, or decorative gradient. Depth is rules and
  whitespace.
- **Don't** introduce a second typeface, or any webfont — an exported sheet must print
  identically with no network.
- **Don't** justify text or enable hyphenation. Flush left, ragged right.
- **Don't** use Poster Red as a background for text the reader has to read, or as a fill
  that makes a screen look livelier.
- **Don't** let `sheet.css` reference an application token, or `app.css` restyle a `.sheet`
  element. The export has to stand alone.
- **Don't** put Bench Grey (`#ededed`) inside a sheet; it is workbench, not paper.
- **Don't** crop photographs to portrait frames. 4:3 landscape, `object-fit: cover`.
- **Don't** add an icon set. The system has one mark — the `7×7px` red square — and draws
  the rest with rules and type.
- **Don't** animate position, scale, or opacity for effect. State changes are colour
  changes.
