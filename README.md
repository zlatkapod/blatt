# Blatt

Printable cleaning tutorials for a home. One tutorial, one sheet, one file.

Write a tutorial — name, frequency, materials with photos, steps with photos — and
print it on A4 or on an A5 card for laminating. Every tutorial exports as a single
HTML file that is **both** the printed artefact and its own editable source.

---

## The one-file idea

Most tools solve "let me edit this again later" with two files: a PDF to print and a
JSON to re-import. You then lose one of them by March.

A Blatt export is one file that does both:

```html
<!doctype html>
<title>Bathroom — Descale &amp; Deep Clean</title>
<style>/* the print stylesheet, inlined */</style>
<script type="application/json" id="blatt-source">
  { "schemaVersion": 1, "tutorial": { … }, "assets": { … } }
</script>
<article class="sheet">…the rendered sheet…</article>
```

- **Double-click it** — it renders in any browser, with no app and no network.
- **Cmd-P** — a clean A4 sheet, or a PDF via "Save as PDF".
- **Drag it back into Blatt** — full-fidelity edit, same tutorial.

The archive outlives the tool that made it, which is the only durability guarantee
actually worth having. There is no PDF library: the browser's print engine gives
better typography than jsPDF and one less dependency to maintain.

`src/print/Sheet.tsx` is the only renderer. The print view mounts it; the exporter
runs the same component through `renderToStaticMarkup`. What you print and what you
export cannot drift apart.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # round-trip and schema tests
npm run build      # typecheck + production build
npm run sample     # write sample.blatt.html to look at
```

Open `#/sample` for a worked example you can copy into your library.

---

## Deploying to Cloudflare

**Full step-by-step guide: [DEPLOY.md](./DEPLOY.md)** — Workers and Pages routes,
custom domains, private access, CI, and troubleshooting.

The short version. It is a static, backend-free app, so this is an assets-only
Worker — `wrangler.jsonc` has no `main` and there is no server code to run.

```bash
npx wrangler login
npm run deploy        # build + wrangler deploy  →  blatt.<subdomain>.workers.dev
npm run cf:preview    # build + serve locally through workerd
```

Routing needs no configuration: Blatt uses hash routes (`#/t/:id`), so every request
the edge sees is for `/`. `not_found_handling: "single-page-application"` is there
only to catch mistyped paths.

`public/_headers` caches fingerprinted `/assets/*` forever and keeps `index.html`
uncached, so a deploy actually reaches you.

To keep it private, put **Cloudflare Access** in front of the Worker — the free Zero
Trust tier covers a household several times over. Note that the app is local-first
either way: a stranger who loads the URL gets their own empty database, not yours.

---

## ⚠️ IndexedDB is scoped to the origin

Your tutorials live in the browser's IndexedDB, which is keyed by **origin**. That has
consequences worth knowing before you put real work in:

- Moving from `blatt.<subdomain>.workers.dev` to a custom domain gives you a **fresh,
  empty database**. Pick the final hostname before you write twenty tutorials.
- Each device and each browser has its own separate library. There is no sync.
- Clearing site data clears your tutorials.

**The exported `.blatt.html` files are the durable store; the database is a cache with
opinions.** Export what you care about into a synced folder (iCloud, Dropbox, a git
repo) and you have both a backup and your cross-device story. Adding real sync would
mean auth, a server, and conflict resolution — which is a security gate on a picnic
blanket.

---

## Design

International Typographic Style, applied literally rather than gestured at.

- **Typeface** — Helvetica Neue → Helvetica → Arial. No webfont: it is the typeface of
  the movement, it is already installed, and it prints without a network request.
- **Scale** — a fixed set of sizes on an 8px baseline (`src/styles/tokens.css`). Print
  sizes are in `pt` and `mm` throughout `src/print/sheet.css`, so the on-screen preview
  is true to the printed sheet rather than an approximation of it.
- **Colour** — black, white, grey, and exactly one red (`#e4002b`), which carries step
  numerals and cautions and nothing else. Every layout survives greyscale printing.
- **Form** — hairline rules instead of boxes. No shadows, no rounded corners, no
  gradients. Whitespace does the grouping. Flush left, ragged right, never justified.

One rule worth naming: **the grid is decided by the sheet, not row by row.** If any
step carries a photo, every step reserves the image column so the text keeps one
measure down the page. If a material has no photo, its frame is still drawn, so a
missing image cannot shunt its label out of alignment. Mixed measures are what make a
page look accidental.

### Known print limitation

The footer repeats on every page via `position: fixed`, but there is **no page number** —
CSS `@page` margin boxes with counters are unimplemented in every browser. Adding them
would mean a pagination polyfill, which is not worth it for a two-page maximum.

---

## Layout

```
src/
  domain/     schema (zod, source of truth), factories, the sample tutorial
  storage/    IndexedDB access + the autosaving useDoc hook
  print/      Sheet.tsx (the only renderer), sheet.css, exporter, importer
  views/      Library, Editor, PrintView, Sample
  components/ TopBar, ImageField, AutoTextarea
  styles/     tokens, base reset, application chrome
  lib/        router, ids, image pipeline, array helpers
```

`exporter.ts` and `importer.ts` are deliberately separate modules. Importing needs
nothing but a `DOMParser`; exporting drags in `react-dom/server`. Keeping them apart is
what lets the renderer load on demand instead of sitting in the initial bundle
(88 KB gzip initial, 59 KB exporter chunk loaded when you first click Export).

### The image pipeline

`src/lib/images.ts` is where the tool lives or dies. A raw phone photo is ~4 MB, and
base64 adds another third when it lands in the export file. Every image — dropped,
pasted, or picked — is decoded with `imageOrientation: 'from-image'` (so EXIF rotation
is applied and your bathroom photos are not sideways), downscaled to a 1400px long
edge, and re-encoded to WebP at q0.82. A finished tutorial with a dozen photos lands
around 2–3 MB.

---

## Data model

`src/domain/schema.ts` is the source of truth: types are inferred from the zod schema,
and every imported file is validated against it. `schemaVersion` exists from day one so
future-you can migrate rather than guess — an unknown version is rejected with a clear
message instead of being silently mangled.

Assets live in a keyed map referenced by id, so a photo used in two steps is stored
once. `pruneAssets` runs before every save, so deleting an image reclaims the bytes
instead of quietly hoarding them into your export.
