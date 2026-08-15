import { writeFileSync } from 'node:fs'
import { sampleDoc } from '../src/domain/sample'
import { exportHtml } from '../src/print/exporter'

/**
 * Writes the sample tutorial out as a real .blatt.html file.
 *
 *   npm run sample -- ./somewhere.html
 *
 * Useful for eyeballing the standalone output, and for checking that an
 * exported file still opens and prints on its own years from now.
 */

const out = process.argv[2] ?? './sample.blatt.html'
const doc = sampleDoc('sample', '2026-08-15T00:00:00.000Z')
const html = exportHtml(doc)

writeFileSync(out, html)
console.log(`wrote ${out} — ${(html.length / 1024).toFixed(1)} KB`)
