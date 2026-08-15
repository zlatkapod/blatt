import { DocumentSchema, type Doc } from '../domain/schema'

/**
 * Reading a Blatt file back in.
 *
 * Deliberately separate from the exporter: importing needs nothing but a
 * DOMParser, while exporting drags in react-dom/server. The library screen
 * imports files on load, so keeping these apart is what lets the renderer
 * stay out of the initial bundle.
 */

export const SOURCE_ID = 'blatt-source'

export class ImportError extends Error {}

/** Accepts an exported .blatt.html file, or a bare .json document. */
export function parseDocument(text: string): Doc {
  const json = text.trimStart().startsWith('{') ? text : extractEmbeddedJson(text)

  let raw: unknown
  try {
    raw = JSON.parse(json)
  } catch {
    throw new ImportError('The file contains a Blatt source block, but it is not valid JSON.')
  }

  const parsed = DocumentSchema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    const where = first?.path.join('.') || 'document'
    throw new ImportError(`This file does not match the Blatt format (${where}: ${first?.message}).`)
  }
  return parsed.data
}

function extractEmbeddedJson(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const node = doc.getElementById(SOURCE_ID)
  if (!node?.textContent) {
    throw new ImportError(
      'No Blatt source found in this file. Import a .blatt.html file exported by Blatt.',
    )
  }
  return node.textContent
}
