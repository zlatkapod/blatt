import { useState } from 'react'
import { TopBar } from '../components/TopBar'
import { AutoTextarea } from '../components/AutoTextarea'
import { ImageField } from '../components/ImageField'
import { Sheet } from '../print/Sheet'
import { useDoc, type SaveState } from '../storage/useDoc'
import { newStep, newSupply } from '../domain/factory'
import { move, removeAt, replaceAt } from '../lib/array'
import { href, navigate } from '../lib/router'
import {
  FREQUENCY_KINDS,
  FREQUENCY_LABEL,
  SUPPLY_KINDS,
  SUPPLY_LABEL,
  type Asset,
  type Doc,
  type FrequencyKind,
  type SupplyKind,
} from '../domain/schema'

export function Editor({ id }: { id: string }) {
  const { doc, load, save, update } = useDoc(id)
  const [exporting, setExporting] = useState(false)

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

  if (load === 'missing' || !doc) {
    return (
      <>
        <TopBar />
        <div className="library">
          <div className="empty">
            <h2>No such tutorial</h2>
            <p>
              It may live in a different browser or on a different domain — IndexedDB is scoped to
              the origin. If you exported it, import the file.
            </p>
            <a className="btn" href={href.library()}>
              Back to library
            </a>
          </div>
        </div>
      </>
    )
  }

  const { tutorial } = doc
  const byId = (assets: Asset[]) => Object.fromEntries(assets.map((a) => [a.id, a]))
  const resolve = (ids: string[]) => ids.map((i) => doc.assets[i]).filter(Boolean) as Asset[]

  const patchTutorial = (patch: Partial<Doc['tutorial']>) =>
    update((d) => ({ ...d, tutorial: { ...d.tutorial, ...patch } }))

  // Loaded on demand: the exporter drags in react-dom/server, which is a
  // third of the bundle and useless until you actually click Export.
  async function handleExport() {
    setExporting(true)
    try {
      const { downloadFile, exportFilename, exportHtml } = await import('../print/exporter')
      downloadFile(exportFilename(doc!), exportHtml(doc!))
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <TopBar subtitle="Editing">
        <SaveIndicator state={save} />
        <button type="button" className="btn" onClick={() => void handleExport()} disabled={exporting}>
          Export
        </button>
        <a className="btn btn--primary" href={href.print(tutorial.id)}>
          Print
        </a>
      </TopBar>

      <div className="editor">
        <div className="editor__form">
          <label className="field">
            <span className="visually-hidden">Title</span>
            <input
              className="input input--title"
              value={tutorial.title}
              placeholder="Tutorial title"
              onChange={(e) => patchTutorial({ title: e.target.value })}
            />
          </label>

          <div className="field-grid">
            <label className="field">
              <span className="field__label">Frequency</span>
              <select
                className="select"
                value={tutorial.frequency.kind}
                onChange={(e) =>
                  patchTutorial({
                    frequency: { ...tutorial.frequency, kind: e.target.value as FrequencyKind },
                  })
                }
              >
                {FREQUENCY_KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {FREQUENCY_LABEL[kind]}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field__label">Every</span>
              <input
                className="input"
                type="number"
                min={1}
                value={tutorial.frequency.everyN ?? ''}
                placeholder="1"
                onChange={(e) =>
                  patchTutorial({
                    frequency: {
                      ...tutorial.frequency,
                      everyN: e.target.value ? Number(e.target.value) : undefined,
                    },
                  })
                }
              />
            </label>

            <label className="field">
              <span className="field__label">Area</span>
              <input
                className="input"
                value={tutorial.area ?? ''}
                placeholder="Bathroom"
                onChange={(e) => patchTutorial({ area: e.target.value || undefined })}
              />
            </label>

            <label className="field">
              <span className="field__label">Minutes</span>
              <input
                className="input"
                type="number"
                min={1}
                value={tutorial.durationMin ?? ''}
                placeholder="25"
                onChange={(e) =>
                  patchTutorial({
                    durationMin: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </label>
          </div>

          <label className="field">
            <span className="field__label">Frequency note</span>
            <input
              className="input"
              value={tutorial.frequency.note ?? ''}
              placeholder="After the filter change"
              onChange={(e) =>
                patchTutorial({
                  frequency: { ...tutorial.frequency, note: e.target.value || undefined },
                })
              }
            />
          </label>

          {/* ---- Cautions ---- */}
          <div className="section-head">
            <h2>Cautions</h2>
            <span className="section-head__count">{tutorial.cautions.length}</span>
          </div>
          <div className="rows">
            {tutorial.cautions.map((caution, i) => (
              <div className="row" key={i}>
                <span className="row__index">!</span>
                <div className="row__body">
                  {/* A textarea, not an input: safety warnings are the one
                      field you must never silently truncate out of view. */}
                  <AutoTextarea
                    value={caution}
                    placeholder="Never mix with bleach"
                    aria-label={`Caution ${i + 1}`}
                    onChange={(e) =>
                      patchTutorial({ cautions: replaceAt(tutorial.cautions, i, e.target.value) })
                    }
                  />
                </div>
                <div className="row__controls">
                  <button
                    type="button"
                    className="iconbtn"
                    title="Remove"
                    aria-label={`Remove caution ${i + 1}`}
                    onClick={() => patchTutorial({ cautions: removeAt(tutorial.cautions, i) })}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn--quiet row-add"
            onClick={() => patchTutorial({ cautions: [...tutorial.cautions, ''] })}
          >
            + Caution
          </button>

          {/* ---- Materials ---- */}
          <div className="section-head">
            <h2>Materials</h2>
            <span className="section-head__count">{tutorial.supplies.length}</span>
          </div>
          <div className="rows">
            {tutorial.supplies.map((supply, i) => (
              <div className="row" key={supply.id}>
                <span className="row__index">{String(i + 1).padStart(2, '0')}</span>
                <div className="row__body">
                  <input
                    className="input"
                    value={supply.name}
                    placeholder="Descaler, grout brush, microfibre cloth…"
                    aria-label={`Material ${i + 1} name`}
                    onChange={(e) =>
                      patchTutorial({
                        supplies: replaceAt(tutorial.supplies, i, {
                          ...supply,
                          name: e.target.value,
                        }),
                      })
                    }
                  />
                  <div className="field-grid" style={{ marginTop: 'var(--s-2)' }}>
                    <label className="field">
                      <span className="field__label">Kind</span>
                      <select
                        className="select"
                        value={supply.kind}
                        onChange={(e) =>
                          patchTutorial({
                            supplies: replaceAt(tutorial.supplies, i, {
                              ...supply,
                              kind: e.target.value as SupplyKind,
                            }),
                          })
                        }
                      >
                        {SUPPLY_KINDS.map((kind) => (
                          <option key={kind} value={kind}>
                            {SUPPLY_LABEL[kind]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="field">
                      <span className="field__label">Note</span>
                      <input
                        className="input"
                        value={supply.note ?? ''}
                        placeholder="Dilute 1:10"
                        onChange={(e) =>
                          patchTutorial({
                            supplies: replaceAt(tutorial.supplies, i, {
                              ...supply,
                              note: e.target.value || undefined,
                            }),
                          })
                        }
                      />
                    </label>
                  </div>
                  <ImageField
                    label="+ Photo"
                    assets={resolve(supply.assetId ? [supply.assetId] : [])}
                    onAdd={(added) =>
                      update((d) => ({
                        ...d,
                        assets: { ...d.assets, ...byId(added) },
                        tutorial: {
                          ...d.tutorial,
                          supplies: replaceAt(d.tutorial.supplies, i, {
                            ...supply,
                            assetId: added[0]?.id,
                          }),
                        },
                      }))
                    }
                    onRemove={() =>
                      patchTutorial({
                        supplies: replaceAt(tutorial.supplies, i, {
                          ...supply,
                          assetId: undefined,
                        }),
                      })
                    }
                  />
                </div>
                <RowControls
                  index={i}
                  count={tutorial.supplies.length}
                  label="material"
                  onMove={(delta) =>
                    patchTutorial({ supplies: move(tutorial.supplies, i, delta) })
                  }
                  onRemove={() => patchTutorial({ supplies: removeAt(tutorial.supplies, i) })}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn--quiet row-add"
            onClick={() => patchTutorial({ supplies: [...tutorial.supplies, newSupply()] })}
          >
            + Material
          </button>

          {/* ---- Method ---- */}
          <div className="section-head">
            <h2>Method</h2>
            <span className="section-head__count">{tutorial.steps.length} steps</span>
          </div>
          <div className="rows">
            {tutorial.steps.map((step, i) => (
              <div className="row" key={step.id}>
                <span className="row__index">{String(i + 1).padStart(2, '0')}</span>
                <div className="row__body">
                  <AutoTextarea
                    value={step.text}
                    placeholder="Spray the descaler across the tiles and leave it for five minutes."
                    aria-label={`Step ${i + 1}`}
                    onChange={(e) =>
                      patchTutorial({
                        steps: replaceAt(tutorial.steps, i, { ...step, text: e.target.value }),
                      })
                    }
                  />
                  <label className="field" style={{ marginTop: 'var(--s-2)' }}>
                    <span className="field__label">Tip</span>
                    <input
                      className="input"
                      value={step.tip ?? ''}
                      placeholder="Optional"
                      onChange={(e) =>
                        patchTutorial({
                          steps: replaceAt(tutorial.steps, i, {
                            ...step,
                            tip: e.target.value || undefined,
                          }),
                        })
                      }
                    />
                  </label>
                  <ImageField
                    multiple
                    label="+ Photos"
                    assets={resolve(step.assetIds)}
                    onAdd={(added) =>
                      update((d) => ({
                        ...d,
                        assets: { ...d.assets, ...byId(added) },
                        tutorial: {
                          ...d.tutorial,
                          steps: replaceAt(d.tutorial.steps, i, {
                            ...step,
                            assetIds: [...step.assetIds, ...added.map((a) => a.id)],
                          }),
                        },
                      }))
                    }
                    onRemove={(assetId) =>
                      patchTutorial({
                        steps: replaceAt(tutorial.steps, i, {
                          ...step,
                          assetIds: step.assetIds.filter((x) => x !== assetId),
                        }),
                      })
                    }
                    onAlt={(assetId, alt) =>
                      update((d) => ({
                        ...d,
                        assets: { ...d.assets, [assetId]: { ...d.assets[assetId], alt } },
                      }))
                    }
                  />
                </div>
                <RowControls
                  index={i}
                  count={tutorial.steps.length}
                  label="step"
                  onMove={(delta) => patchTutorial({ steps: move(tutorial.steps, i, delta) })}
                  onRemove={() => patchTutorial({ steps: removeAt(tutorial.steps, i) })}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn--quiet row-add"
            onClick={() => patchTutorial({ steps: [...tutorial.steps, newStep()] })}
          >
            + Step
          </button>
        </div>

        <aside className="editor__preview">
          <div className="editor__preview-label">
            <span>Preview · A4</span>
            <button
              type="button"
              className="btn btn--quiet"
              onClick={() => navigate(href.print(tutorial.id))}
            >
              Full size
            </button>
          </div>
          <div className="sheet-scaler">
            <Sheet doc={doc} />
          </div>
        </aside>
      </div>
    </>
  )
}

function RowControls({
  index,
  count,
  label,
  onMove,
  onRemove,
}: {
  index: number
  count: number
  label: string
  onMove: (delta: number) => void
  onRemove: () => void
}) {
  return (
    <div className="row__controls">
      <button
        type="button"
        className="iconbtn"
        disabled={index === 0}
        title="Move up"
        aria-label={`Move ${label} ${index + 1} up`}
        onClick={() => onMove(-1)}
      >
        ↑
      </button>
      <button
        type="button"
        className="iconbtn"
        disabled={index === count - 1}
        title="Move down"
        aria-label={`Move ${label} ${index + 1} down`}
        onClick={() => onMove(1)}
      >
        ↓
      </button>
      <button
        type="button"
        className="iconbtn"
        title="Remove"
        aria-label={`Remove ${label} ${index + 1}`}
        onClick={onRemove}
      >
        ×
      </button>
    </div>
  )
}

const SAVE_LABEL: Record<SaveState, string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'Saved',
  error: 'Save failed',
}

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === 'idle') return null
  return (
    <span className={state === 'error' ? 'status status--error' : 'status'}>
      {SAVE_LABEL[state]}
    </span>
  )
}
