import { useMemo, useState } from 'react'
import { TopBar } from '../components/TopBar'
import { Sheet, type SheetVariant } from '../print/Sheet'
import { sampleDoc } from '../domain/sample'
import { duplicateDoc, nowIso } from '../domain/factory'
import { putDoc } from '../storage/db'
import { href, navigate } from '../lib/router'
import { newId } from '../lib/id'

/**
 * A rendered example at #/sample. Nothing is written to the database until
 * you ask for it, so this doubles as a demo link for the deployed app.
 */
export function Sample() {
  const doc = useMemo(() => sampleDoc('sample', nowIso()), [])
  const [variant, setVariant] = useState<SheetVariant>('sheet')

  async function adopt() {
    const copy = duplicateDoc(doc, '')
    copy.tutorial.id = newId()
    await putDoc(copy)
    navigate(href.editor(copy.tutorial.id))
  }

  return (
    <>
      <TopBar subtitle="Sample">
        <a className="btn" href={href.library()}>
          Library
        </a>
        <button type="button" className="btn" onClick={() => window.print()}>
          Print
        </button>
        <button type="button" className="btn btn--primary" onClick={() => void adopt()}>
          Copy to my library
        </button>
      </TopBar>

      <div className="printview">
        <div className="printview__bar">
          <button
            type="button"
            className="filter"
            aria-pressed={variant === 'sheet'}
            onClick={() => setVariant('sheet')}
          >
            A4 sheet
          </button>
          <button
            type="button"
            className="filter"
            aria-pressed={variant === 'card'}
            onClick={() => setVariant('card')}
          >
            A5 card
          </button>
        </div>

        <Sheet doc={doc} variant={variant} />

        <p className="hint">
          This is what a finished tutorial looks like. Copy it to your library to edit it, or start
          an empty one.
        </p>
      </div>
    </>
  )
}
