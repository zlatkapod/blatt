import { useEffect, useMemo, useRef, useState } from 'react'
import { TopBar } from '../components/TopBar'
import { deleteDoc, listDocs, putDoc } from '../storage/db'
import { duplicateDoc, newDoc } from '../domain/factory'
import { href, navigate } from '../lib/router'
import { ImportError, parseDocument } from '../print/importer'
import {
  assetSrc,
  frequencyLabel,
  FREQUENCY_KINDS,
  FREQUENCY_LABEL,
  type Doc,
  type FrequencyKind,
} from '../domain/schema'

export function Library() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [filter, setFilter] = useState<FrequencyKind | 'all'>('all')
  const [error, setError] = useState<string | null>(null)
  const importRef = useRef<HTMLInputElement>(null)

  async function refresh() {
    setDocs(await listDocs())
  }

  useEffect(() => {
    void refresh()
  }, [])

  const present = useMemo(() => {
    const kinds = new Set(docs.map((d) => d.tutorial.frequency.kind))
    return FREQUENCY_KINDS.filter((k) => kinds.has(k))
  }, [docs])

  const visible = filter === 'all' ? docs : docs.filter((d) => d.tutorial.frequency.kind === filter)

  async function createNew() {
    const doc = newDoc()
    await putDoc(doc)
    navigate(href.editor(doc.tutorial.id))
  }

  async function handleImport(files: FileList | null) {
    if (!files?.length) return
    setError(null)
    let imported = 0
    for (const file of files) {
      try {
        const parsed = parseDocument(await file.text())
        const clash = docs.some((d) => d.tutorial.id === parsed.tutorial.id)
        const replace =
          !clash ||
          window.confirm(
            `"${parsed.tutorial.title || 'Untitled'}" already exists.\n\n` +
              'OK replaces it with the imported version. Cancel adds it as a separate copy.',
          )
        await putDoc(replace ? parsed : duplicateDoc(parsed, ' (imported)'))
        imported += 1
      } catch (err) {
        setError(
          err instanceof ImportError
            ? `${file.name}: ${err.message}`
            : `${file.name}: could not be read.`,
        )
      }
    }
    if (imported) await refresh()
  }

  async function handleDuplicate(doc: Doc) {
    await putDoc(duplicateDoc(doc))
    await refresh()
  }

  async function handleDelete(doc: Doc) {
    const name = doc.tutorial.title || 'this untitled tutorial'
    if (!window.confirm(`Delete "${name}"? Exported files are unaffected.`)) return
    await deleteDoc(doc.tutorial.id)
    await refresh()
  }

  return (
    <>
      <TopBar subtitle="Cleaning tutorials">
        <button type="button" className="btn" onClick={() => importRef.current?.click()}>
          Import
        </button>
        <button type="button" className="btn btn--primary" onClick={() => void createNew()}>
          New tutorial
        </button>
        <input
          ref={importRef}
          type="file"
          accept=".html,.json,text/html,application/json"
          multiple
          hidden
          onChange={(e) => {
            void handleImport(e.target.files)
            e.target.value = ''
          }}
        />
      </TopBar>

      {error && <p className="banner">{error}</p>}

      <div className="library">
        <div className="library__head">
          <h1 className="library__title">Library</h1>
          <span className="status">
            {docs.length} tutorial{docs.length === 1 ? '' : 's'}
          </span>
        </div>

        {present.length > 1 && (
          <div className="filters">
            <button
              type="button"
              className="filter"
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {present.map((kind) => (
              <button
                type="button"
                className="filter"
                key={kind}
                aria-pressed={filter === kind}
                onClick={() => setFilter(kind)}
              >
                {FREQUENCY_LABEL[kind]}
              </button>
            ))}
          </div>
        )}

        {docs.length === 0 ? (
          <div className="empty">
            <h2>Nothing here yet</h2>
            <p>
              Make a tutorial, print it, and stick it where the work happens. Every tutorial exports
              as a single file that prints on its own and imports straight back here for edits.
            </p>
            <div className="topbar__actions" style={{ justifyContent: 'flex-start' }}>
              <button type="button" className="btn btn--primary" onClick={() => void createNew()}>
                New tutorial
              </button>
              <a className="btn" href={href.sample()}>
                See a sample
              </a>
            </div>
          </div>
        ) : (
          <ul className="library__grid">
            {visible.map((doc) => (
              <li key={doc.tutorial.id}>
                <Card
                  doc={doc}
                  onDuplicate={() => void handleDuplicate(doc)}
                  onDelete={() => void handleDelete(doc)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

function Card({
  doc,
  onDuplicate,
  onDelete,
}: {
  doc: Doc
  onDuplicate: () => void
  onDelete: () => void
}) {
  const { tutorial } = doc
  const firstAssetId =
    tutorial.steps.find((s) => s.assetIds.length)?.assetIds[0] ??
    tutorial.supplies.find((s) => s.assetId)?.assetId
  const thumb = firstAssetId ? doc.assets[firstAssetId] : undefined

  const meta = [
    frequencyLabel(tutorial.frequency),
    tutorial.area,
    `${tutorial.steps.filter((s) => s.text.trim()).length} steps`,
  ].filter(Boolean)

  return (
    <div className="card">
      <a className="card__thumb" href={href.editor(tutorial.id)}>
        {thumb ? (
          <img src={assetSrc(thumb)} alt="" />
        ) : (
          <span className="card__thumb-empty">No photo</span>
        )}
      </a>
      <a className="card__body" href={href.editor(tutorial.id)} style={{ textDecoration: 'none' }}>
        <span className="card__title">{tutorial.title || 'Untitled tutorial'}</span>
        <span className="card__meta">{meta.join(' · ')}</span>
      </a>
      <div className="card__actions">
        <a className="btn btn--quiet" href={href.print(tutorial.id)}>
          Print
        </a>
        <button type="button" className="btn btn--quiet" onClick={onDuplicate}>
          Duplicate
        </button>
        <button type="button" className="btn btn--quiet" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}
