import { useRef, useState, type ClipboardEvent, type DragEvent } from 'react'
import { assetSrc, type Asset } from '../domain/schema'
import { ACCEPTED_TYPES, assetBytes, filesToAssets, formatBytes } from '../lib/images'

/**
 * Drop, paste, or pick. Every route lands in the same downscale pipeline,
 * so nothing raw from a phone camera ever reaches the database.
 */
export function ImageField({
  assets,
  multiple = false,
  label,
  onAdd,
  onRemove,
  onAlt,
}: {
  assets: Asset[]
  multiple?: boolean
  label: string
  onAdd: (assets: Asset[]) => void
  onRemove: (id: string) => void
  onAlt?: (id: string, alt: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const [busy, setBusy] = useState(false)

  const atCapacity = !multiple && assets.length > 0

  async function ingest(files: FileList | File[] | null) {
    if (!files) return
    const list = [...files]
    if (!list.length) return
    setBusy(true)
    try {
      const processed = await filesToAssets(multiple ? list : list.slice(0, 1))
      if (processed.length) onAdd(multiple ? processed : processed.slice(0, 1))
    } finally {
      setBusy(false)
      setOver(false)
    }
  }

  function onDrop(event: DragEvent) {
    event.preventDefault()
    void ingest(event.dataTransfer?.files ?? null)
  }

  function onPaste(event: ClipboardEvent) {
    const files = [...(event.clipboardData?.files ?? [])]
    if (files.length) {
      event.preventDefault()
      void ingest(files)
    }
  }

  return (
    <div className="imagefield">
      {assets.length > 0 && (
        <ul className="thumbs">
          {assets.map((asset) => (
            <li className="thumb" key={asset.id}>
              <img src={assetSrc(asset)} alt={asset.alt || ''} />
              <button
                type="button"
                className="thumb__remove"
                onClick={() => onRemove(asset.id)}
                aria-label={`Remove image ${asset.alt || ''}`}
                title="Remove image"
              >
                ×
              </button>
              {onAlt ? (
                <input
                  className="thumb__meta input"
                  value={asset.alt ?? ''}
                  placeholder="caption"
                  aria-label="Image caption"
                  onChange={(e) => onAlt(asset.id, e.target.value)}
                />
              ) : (
                <span className="thumb__meta">
                  {asset.w}×{asset.h} · {formatBytes(assetBytes(asset))}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {!atCapacity && (
        <button
          type="button"
          className={`dropzone${over ? ' dropzone--over' : ''}${busy ? ' dropzone--busy' : ''}`}
          onClick={() => inputRef.current?.click()}
          onPaste={onPaste}
          onDragOver={(e) => {
            e.preventDefault()
            setOver(true)
          }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
        >
          {busy ? 'Processing…' : label}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple={multiple}
        hidden
        onChange={(e) => {
          void ingest(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}
