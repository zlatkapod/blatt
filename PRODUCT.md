# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary reader: another member of the household** — partner, family, or flatmate.
They know the home but not this particular procedure, and they are reading it while
doing the job. There is nobody to ask: if the sheet does not answer the question, the
question goes unanswered or the task goes wrong.

**Author/maintainer:** also a household member. They write tutorials in the app, print
them, and revise them occasionally. Authoring is an infrequent, seated, unhurried
activity. Reading is frequent, standing, and hands-busy. These are two different
situations for the same person, and they do not trade off in the same direction.

Not confirmed as audiences: paid cleaners or outside helpers, and readers in a language
other than the author's. English is the only established language and no i18n
requirement exists today.

## Product Purpose

Turn one household cleaning procedure into one printed sheet that somebody other than
its author can follow correctly, unaided.

Success is a task done right by a person who did not write the tutorial, without a
phone, without a search, and without a conversation. The app is where the knowledge is
written down; the printed sheet is where the product actually does its work.

## Positioning

A Blatt export is a single HTML file that is simultaneously the printed artefact and its
own editable source. Double-click it and it renders and prints with no app and no
network; drag it back into Blatt and it re-opens at full fidelity. The usual answer to
"let me edit this later" is a PDF plus a JSON, one of which is lost by March.

There is no PDF library: the browser's print engine is the renderer, which yields better
typography and one less dependency.

`src/print/Sheet.tsx` is the only renderer — the print view mounts it and the exporter
runs the same component through `renderToStaticMarkup`, so what you print and what you
export cannot drift apart.

## Operating Context

- **The printed sheet is A4, laminated, and lives at the point of work.** Confirmed
  primary format. A5 card output exists in the app but is not the established use.
- **It is read mid-task**: wet or gloved hands, arm's length or further, variable
  light, and possibly a wiped-down or splashed surface.
- **Printing is via the browser** — Cmd-P for paper, or "Save as PDF". No export path
  produces a PDF directly.
- **The library lives in IndexedDB, scoped per origin and per device.** No sync. Each
  browser holds a separate library; clearing site data clears it. Changing hostname
  yields a fresh, empty database.
- **Deployment is a static, assets-only Cloudflare Worker** with no server code. Hash
  routes (`#/`, `#/sample`, `#/t/:id`, `#/t/:id/print`) mean the built app also runs
  from `file://`. Private access, when wanted, is Cloudflare Access in front of it.

## Capabilities and Constraints

**Data model** — `src/domain/schema.ts` is the source of truth (zod; types inferred from
it). A tutorial carries title, optional area, optional duration, frequency
(daily/weekly/monthly/quarterly/yearly/seasonal, with an optional every-N and note),
cautions, supplies (chemical/tool/consumable, each with an optional photo and note), and
steps (text, photos, optional tip). `schemaVersion` is 1; an unknown version is rejected
with a clear message rather than silently mangled.

**Images** — every image is decoded with EXIF orientation applied, downscaled to a
1400px long edge, and re-encoded to WebP q0.82. Assets are stored once in a keyed map
and referenced by id; `pruneAssets` runs before every save. A finished tutorial with a
dozen photos lands around 2–3 MB.

**Import** — accepts `.html` and `.json`. An id clash prompts replace-or-add-as-copy.

### Binding constraints

- **Local-first, permanently.** No backend, no accounts, no sync — ever. Origin-scoped
  storage, per-device libraries, and loss on clearing site data are accepted
  consequences, not defects awaiting a fix. Do not propose features that require a
  server.
- **Greyscale-print survival.** Every layout must remain fully legible printed in black
  and white. Colour may reinforce meaning; it may never be the only thing carrying it.

### Explicitly not binding

Both were inferred from the README and **declined** as permanent commitments, so future
work may propose changes to either rather than treating them as fixed:

- **The one-file export-as-archive property.** It is the current architecture and the
  current answer to durability, not a frozen guarantee.
- **The International Typographic Style visual world** (Helvetica, hairline rules, one
  red `#e4002b`, no shadows or rounded corners). It is the incumbent design, open to
  revision. Any replacement goes through a deliberate redesign, never incidental edits.

### Known limitations

- No printed page numbers: CSS `@page` margin boxes with counters are unimplemented in
  every browser, and a pagination polyfill is not worth it at a two-page maximum.
- No cross-device story other than exporting files into a synced folder.

## Brand Commitments

The name is **Blatt**. No identity, typographic, or palette commitment was confirmed as
binding — see "Explicitly not binding" above. The existing UI and documentation voice is
plain, direct, and free of marketing register; treat it as the incumbent voice rather
than a locked one.

## Evidence on Hand

- `README.md` and `DEPLOY.md` — substantive, accurate product and deployment docs.
- `src/domain/sample.ts`, reachable at `#/sample` and emittable via `npm run sample` —
  a worked sample tutorial.
- `src/print/roundtrip.test.ts` — export/import fidelity coverage.

Absent, and not to be fabricated: real household photography, a corpus of real
tutorials, any usage data, any users beyond the household, testimonials, or press.

## Product Principles

1. **The reader is not the author.** Anything that only makes sense to the person who
   wrote it is a defect, not a shorthand.
2. **The sheet must work with no device, no network, and nobody to ask.** Every
   affordance that exists only inside the app is unavailable at the moment of use.
3. **Local-first is the architecture, not a phase.** Anything requiring a server is out
   of scope, and the resulting limits are stated plainly rather than papered over.
4. **Meaning survives greyscale.** Colour reinforces; it never carries alone.
5. **The point of work sets the constraints.** Laminated A4, wet hands, arm's length,
   bad light — the reading situation outranks the authoring situation whenever the two
   disagree.

## Accessibility & Inclusion

Confirmed, situational requirements: legibility at arm's length in poor light, and full
legibility in greyscale print. No formal standard (WCAG level, screen-reader target) has
been established for the app UI — undecided rather than dismissed.
