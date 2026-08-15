import {
  assetSrc,
  frequencyLabel,
  SUPPLY_LABEL,
  type Doc,
  type Asset,
} from '../domain/schema'

/**
 * The one and only renderer for a tutorial sheet.
 *
 * The print view mounts it; the exporter runs the same component through
 * renderToStaticMarkup. One component, two destinations — so what you print
 * and what you export can never drift apart.
 *
 * Keep this pure: no hooks, no effects, no browser APIs.
 */

export type SheetVariant = 'sheet' | 'card'

export function Sheet({ doc, variant = 'sheet' }: { doc: Doc; variant?: SheetVariant }) {
  const { tutorial, assets } = doc
  const asset = (id?: string): Asset | undefined => (id ? assets[id] : undefined)

  // Blank rows are for the editor, not for paper.
  const supplies = tutorial.supplies.filter((s) => s.name.trim() || s.assetId)
  const steps = tutorial.steps.filter((s) => s.text.trim() || s.assetIds.length)
  const cautions = tutorial.cautions.filter((c) => c.trim())

  /**
   * The grid is decided by the sheet, not row by row. If any step carries a
   * photo, every step reserves the image column so the text keeps one measure
   * down the page; if none do, the text runs full width. Same rule for
   * materials. Mixed measures are what makes a page look accidental.
   */
  const stepsHaveImages = steps.some((s) => s.assetIds.some((id) => assets[id]))
  const suppliesHaveImages = supplies.some((s) => s.assetId && assets[s.assetId])

  const meta = [
    frequencyLabel(tutorial.frequency),
    tutorial.area?.trim(),
    tutorial.durationMin ? `${tutorial.durationMin} min` : undefined,
    tutorial.frequency.note?.trim(),
  ].filter(Boolean) as string[]

  return (
    <article className={variant === 'card' ? 'sheet sheet--card' : 'sheet'}>
      <header>
        <h1 className="sheet__title">{tutorial.title.trim() || 'Untitled tutorial'}</h1>
        <hr className="sheet__rule" />
        <p className="sheet__meta">
          {meta.map((item, i) => (
            <span key={i}>{i === 0 ? <strong>{item}</strong> : item}</span>
          ))}
        </p>
      </header>

      {cautions.length > 0 && (
        <section className="sheet__cautions">
          <p className="sheet__cautions-label">Cautions</p>
          <ul>
            {cautions.map((caution, i) => (
              <li key={i}>{caution}</li>
            ))}
          </ul>
        </section>
      )}

      {supplies.length > 0 && (
        <section className="sheet__section">
          <h2 className="sheet__section-head">
            <span>Materials</span>
            <span>{supplies.length}</span>
          </h2>
          <ul className="sheet__supplies">
            {supplies.map((supply) => {
              const image = asset(supply.assetId)
              return (
                <li className="sheet__supply" key={supply.id}>
                  {suppliesHaveImages && (
                    <figure>
                      {image && <img src={assetSrc(image)} alt={image.alt || supply.name} />}
                    </figure>
                  )}
                  <p className="sheet__supply-kind">{SUPPLY_LABEL[supply.kind]}</p>
                  <p className="sheet__supply-name">{supply.name}</p>
                  {supply.note?.trim() && <p className="sheet__supply-note">{supply.note}</p>}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {steps.length > 0 && (
        <section className="sheet__section">
          <h2 className="sheet__section-head">
            <span>Method</span>
            <span>
              {steps.length} step{steps.length === 1 ? '' : 's'}
            </span>
          </h2>
          <ol className="sheet__steps">
            {steps.map((step, i) => {
              const images = step.assetIds.map(asset).filter(Boolean) as Asset[]
              return (
                <li
                  className={stepsHaveImages ? 'sheet__step' : 'sheet__step sheet__step--wide'}
                  key={step.id}
                >
                  <p className="sheet__step-number">{String(i + 1).padStart(2, '0')}</p>
                  <div>
                    <p className="sheet__step-text">{step.text}</p>
                    {step.tip?.trim() && <p className="sheet__step-tip">{step.tip}</p>}
                  </div>
                  {stepsHaveImages && (
                    <div className="sheet__step-figures">
                      {images.map((image) => (
                        <img key={image.id} src={assetSrc(image)} alt={image.alt || ''} />
                      ))}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </section>
      )}

      <footer className="sheet__footer">
        <span>{tutorial.title.trim() || 'Untitled tutorial'}</span>
        <span>Updated {tutorial.updatedAt.slice(0, 10)}</span>
      </footer>
    </article>
  )
}
