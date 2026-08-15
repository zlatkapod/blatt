import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import sheetCss from './sheet.css?inline'
import { Sheet, type SheetVariant } from './Sheet'
import { SOURCE_ID } from './importer'
import { DocumentSchema, type Doc } from '../domain/schema'
import { slugify } from '../lib/id'

/**
 * Writing a Blatt file out — the requirement the whole architecture hangs off.
 *
 * One file is both the printable artefact and the editable source. Open it in
 * any browser and it renders; hit print and you get the sheet; drag it back in
 * and you get the editor. The archive outlives the tool that made it, which is
 * the only durability guarantee actually worth having.
 *
 * This module is dynamically imported, because react-dom/server is a third of
 * the bundle and does nothing until you click Export.
 */

export const FILE_SUFFIX = '.blatt.html'

/** Styling for the standalone file only — never injected into the app. */
const STANDALONE_CSS = `
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0;
    padding: 24px 16px;
    background: #ededed;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  @media print {
    body { margin: 0; padding: 0; background: #fff; }
  }
`

/**
 * Canonicalise before serialising. Running the doc through the schema forces
 * key order to match the schema declaration, so export → import → export is
 * byte-identical from the very first export rather than the second.
 */
export function canonicalise(doc: Doc): Doc {
  return DocumentSchema.parse(doc)
}

export function exportHtml(doc: Doc, variant: SheetVariant = 'sheet'): string {
  const canonical = canonicalise(doc)
  const markup = renderToStaticMarkup(createElement(Sheet, { doc: canonical, variant }))
  // Escaping "<" keeps the payload valid JSON while making it impossible for
  // a title containing "</script>" to break out of the block.
  const json = JSON.stringify(canonical, null, 2).replace(/</g, '\\u003c')
  const title = canonical.tutorial.title.trim() || 'Untitled tutorial'

  return `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="Blatt">
<title>${escapeHtml(title)}</title>
<!--
  This file is both the printed tutorial and its own source.
  Print it, or drag it back into Blatt to edit. The JSON below is the source.
-->
<style>${STANDALONE_CSS}${sheetCss}</style>
<script type="application/json" id="${SOURCE_ID}">
${json}
</script>
${markup}
`
}

export function exportFilename(doc: Doc, variant: SheetVariant = 'sheet'): string {
  const base = slugify(doc.tutorial.title)
  return variant === 'card' ? `${base}.card${FILE_SUFFIX}` : `${base}${FILE_SUFFIX}`
}

export function downloadFile(filename: string, contents: string, mime = 'text/html'): void {
  const blob = new Blob([contents], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  // Revoke on the next frame — Safari needs the URL to survive the click.
  requestAnimationFrame(() => URL.revokeObjectURL(url))
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
