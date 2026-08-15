import { newId } from '../lib/id'
import { SCHEMA_VERSION, type Doc, type Step, type Supply, type Tutorial } from './schema'

export function nowIso(): string {
  return new Date().toISOString()
}

export function newStep(text = ''): Step {
  return { id: newId(), text, assetIds: [] }
}

export function newSupply(name = ''): Supply {
  return { id: newId(), name, kind: 'tool' }
}

export function newTutorial(): Tutorial {
  const ts = nowIso()
  return {
    schemaVersion: SCHEMA_VERSION,
    id: newId(),
    title: '',
    frequency: { kind: 'weekly' },
    cautions: [],
    supplies: [newSupply()],
    steps: [newStep()],
    createdAt: ts,
    updatedAt: ts,
  }
}

export function newDoc(): Doc {
  return { tutorial: newTutorial(), assets: {} }
}

/** Fresh ids throughout, so a duplicate never collides with its original. */
export function duplicateDoc(doc: Doc, titleSuffix = ' (copy)'): Doc {
  const ts = nowIso()
  const assetIdMap = new Map<string, string>()
  const assets: Doc['assets'] = {}
  for (const [oldId, asset] of Object.entries(doc.assets)) {
    const id = newId()
    assetIdMap.set(oldId, id)
    assets[id] = { ...asset, id }
  }
  const remap = (id: string) => assetIdMap.get(id) ?? id
  return {
    assets,
    tutorial: {
      ...doc.tutorial,
      id: newId(),
      title: doc.tutorial.title + titleSuffix,
      createdAt: ts,
      updatedAt: ts,
      supplies: doc.tutorial.supplies.map((s) => ({
        ...s,
        id: newId(),
        assetId: s.assetId ? remap(s.assetId) : undefined,
      })),
      steps: doc.tutorial.steps.map((s) => ({
        ...s,
        id: newId(),
        assetIds: s.assetIds.map(remap),
      })),
    },
  }
}

/**
 * Drops assets no longer referenced by any supply or step. Runs before save,
 * so deleting an image actually reclaims the bytes instead of quietly hoarding
 * them into your export file.
 */
export function pruneAssets(doc: Doc): Doc {
  const used = new Set<string>()
  for (const supply of doc.tutorial.supplies) {
    if (supply.assetId) used.add(supply.assetId)
  }
  for (const step of doc.tutorial.steps) {
    for (const id of step.assetIds) used.add(id)
  }
  const assets: Doc['assets'] = {}
  for (const [id, asset] of Object.entries(doc.assets)) {
    if (used.has(id)) assets[id] = asset
  }
  return { ...doc, assets }
}
