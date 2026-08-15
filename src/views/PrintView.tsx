import { useState } from 'react'
import { TopBar } from '../components/TopBar'
import { Sheet, type SheetVariant } from '../print/Sheet'
import { useDoc } from '../storage/useDoc'
import { href } from '../lib/router'

export function PrintView({ id }: { id: string }) {
  const { doc, load } = useDoc(id)
  const [variant, setVariant] = useState<SheetVariant>('sheet')

  if (load === 'loading') {
    return (
      <>
        <TopBar />
        <div className="library">
          <p className="status">Loading…</p>
        </div>
      </>
    )
  }

  if (!doc) {
    return (
      <>
        <TopBar />
        <div className="library">
          <div className="empty">
            <h2>No such tutorial</h2>
            <a className="btn" href={href.library()}>
              Back to library
            </a>
          </div>
        </div>
      </>
    )
  }

  // Loaded on demand — see the note in Editor.tsx.
  async function handleExport() {
    const { downloadFile, exportFilename, exportHtml } = await import('../print/exporter')
    downloadFile(exportFilename(doc!, variant), exportHtml(doc!, variant))
  }

  return (
    <>
      <TopBar subtitle={variant === 'card' ? 'Print · A5 card' : 'Print · A4'}>
        <a className="btn" href={href.editor(id)}>
          Edit
        </a>
        <button type="button" className="btn" onClick={() => void handleExport()}>
          Export
        </button>
        <button type="button" className="btn btn--primary" onClick={() => window.print()}>
          Print
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
          {variant === 'card'
            ? 'A5 — sized for lamination. Set your print dialog to A5, or two-up on A4.'
            : 'A4 — set margins to “default” and turn off headers and footers in the print dialog.'}
        </p>
      </div>
    </>
  )
}
