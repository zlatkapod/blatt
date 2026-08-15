import { describe, expect, it } from 'vitest'
import { canonicalise, exportFilename, exportHtml } from './exporter'
import { ImportError, parseDocument } from './importer'
import { duplicateDoc, newDoc, pruneAssets } from '../domain/factory'
import { DocumentSchema, type Doc } from '../domain/schema'

/** A document exercising every field, including two steps sharing one asset. */
function fixture(): Doc {
  const doc = newDoc()
  return {
    assets: {
      a1: { id: 'a1', mime: 'image/webp', w: 800, h: 600, alt: 'Grout brush', data: 'AAAA' },
      a2: { id: 'a2', mime: 'image/jpeg', w: 640, h: 480, alt: 'Tiles', data: 'BBBB' },
      orphan: { id: 'orphan', mime: 'image/webp', w: 10, h: 10, data: 'CCCC' },
    },
    tutorial: {
      ...doc.tutorial,
      id: 'tut-1',
      title: 'Koupelna — Deep Clean <b>&</b> Descale',
      area: 'Bathroom',
      durationMin: 25,
      frequency: { kind: 'weekly', everyN: 2, note: 'After the filter change' },
      cautions: ['Never mix with bleach', 'Ventilate the room'],
      supplies: [
        { id: 's1', name: 'Descaler', kind: 'chemical', note: 'Dilute 1:10', assetId: 'a1' },
        { id: 's2', name: 'Grout brush', kind: 'tool' },
      ],
      steps: [
        { id: 'st1', text: 'Spray the tiles.', assetIds: ['a2'], tip: 'Work top to bottom' },
        { id: 'st2', text: 'Scrub the grout.', assetIds: ['a1', 'a2'] },
      ],
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-08-15T09:30:00.000Z',
    },
  }
}

describe('round trip', () => {
  it('survives export → import unchanged', () => {
    const original = canonicalise(fixture())
    const reimported = parseDocument(exportHtml(original))
    expect(reimported).toEqual(original)
  })

  it('is byte-identical on re-export, from the very first export', () => {
    const once = exportHtml(fixture())
    const twice = exportHtml(parseDocument(once))
    expect(twice).toBe(once)

    // And stays stable on a third pass.
    expect(exportHtml(parseDocument(twice))).toBe(twice)
  })

  it('keeps the card variant importable too', () => {
    const original = canonicalise(fixture())
    expect(parseDocument(exportHtml(original, 'card'))).toEqual(original)
  })

  it('preserves titles containing HTML metacharacters', () => {
    const doc = parseDocument(exportHtml(fixture()))
    expect(doc.tutorial.title).toBe('Koupelna — Deep Clean <b>&</b> Descale')
  })

  it('does not let the embedded JSON break out of the script tag', () => {
    const doc = fixture()
    doc.tutorial.title = 'Escape </script><script>alert(1)</script> attempt'
    const html = exportHtml(doc)
    // The raw closing tag must never appear inside the JSON block.
    const jsonBlock = html.slice(html.indexOf('id="blatt-source"'), html.indexOf('</script>'))
    expect(jsonBlock).not.toContain('</script')
    expect(parseDocument(html).tutorial.title).toBe(doc.tutorial.title)
  })

  it('accepts a bare JSON document as well as an exported sheet', () => {
    const original = canonicalise(fixture())
    expect(parseDocument(JSON.stringify(original))).toEqual(original)
  })
})

describe('import errors', () => {
  it('rejects an unrelated HTML file with a useful message', () => {
    expect(() => parseDocument('<!doctype html><h1>shopping list</h1>')).toThrow(ImportError)
  })

  it('rejects a document that does not match the schema', () => {
    const broken = JSON.stringify({ tutorial: { title: 'x' }, assets: {} })
    expect(() => parseDocument(broken)).toThrow(ImportError)
  })

  it('rejects a future schema version rather than silently mangling it', () => {
    const future = canonicalise(fixture()) as unknown as { tutorial: { schemaVersion: number } }
    future.tutorial.schemaVersion = 99
    expect(() => parseDocument(JSON.stringify(future))).toThrow(ImportError)
  })
})

describe('export shape', () => {
  it('renders the sheet markup into the file', () => {
    const html = exportHtml(fixture())
    expect(html).toContain('class="sheet"')
    expect(html).toContain('Grout brush')
    expect(html).toContain('Never mix with bleach')
    expect(html).toContain('@page')
  })

  it('names the file from the title, transliterating diacritics', () => {
    expect(exportFilename(fixture())).toBe('koupelna-deep-clean-b-b-descale.blatt.html')
    expect(exportFilename(fixture(), 'card')).toContain('.card.blatt.html')
  })
})

describe('document housekeeping', () => {
  it('prunes assets nothing references', () => {
    const pruned = pruneAssets(fixture())
    expect(Object.keys(pruned.assets).sort()).toEqual(['a1', 'a2'])
  })

  it('gives a duplicate fresh ids while keeping image links intact', () => {
    const original = fixture()
    const copy = duplicateDoc(original)

    expect(copy.tutorial.id).not.toBe(original.tutorial.id)
    expect(copy.tutorial.title).toBe(`${original.tutorial.title} (copy)`)
    expect(Object.keys(copy.assets)).not.toContain('a1')

    // Every referenced asset id must still resolve inside the copy.
    const referenced = [
      ...copy.tutorial.steps.flatMap((s) => s.assetIds),
      ...copy.tutorial.supplies.flatMap((s) => (s.assetId ? [s.assetId] : [])),
    ]
    expect(referenced.length).toBe(4)
    for (const id of referenced) expect(copy.assets[id]).toBeDefined()

    // The shared asset stays shared rather than being duplicated.
    expect(copy.tutorial.steps[1].assetIds[0]).toBe(copy.tutorial.supplies[0].assetId)
    expect(DocumentSchema.safeParse(copy).success).toBe(true)
  })
})
