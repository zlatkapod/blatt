import { z } from 'zod'

/**
 * The schema is the source of truth: types are inferred from it, and every
 * imported file is validated against it. `schemaVersion` exists from day one
 * so future-you can migrate instead of guess.
 */

export const SCHEMA_VERSION = 1 as const

export const FREQUENCY_KINDS = [
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'yearly',
  'seasonal',
] as const

export const SUPPLY_KINDS = ['chemical', 'tool', 'consumable'] as const

export const AssetSchema = z.object({
  id: z.string().min(1),
  mime: z.string().min(1),
  w: z.number().int().positive(),
  h: z.number().int().positive(),
  alt: z.string().optional(),
  /** Bare base64 payload — no data: prefix. Rebuild it with assetSrc(). */
  data: z.string().min(1),
})

export const SupplySchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  kind: z.enum(SUPPLY_KINDS),
  note: z.string().optional(),
  assetId: z.string().optional(),
})

export const StepSchema = z.object({
  id: z.string().min(1),
  text: z.string(),
  assetIds: z.array(z.string()),
  tip: z.string().optional(),
})

export const FrequencySchema = z.object({
  kind: z.enum(FREQUENCY_KINDS),
  everyN: z.number().int().positive().optional(),
  note: z.string().optional(),
})

export const TutorialSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  id: z.string().min(1),
  title: z.string(),
  area: z.string().optional(),
  durationMin: z.number().int().positive().optional(),
  frequency: FrequencySchema,
  cautions: z.array(z.string()),
  supplies: z.array(SupplySchema),
  steps: z.array(StepSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})

/** A tutorial plus its image assets. One document = one printed sheet = one file. */
export const DocumentSchema = z.object({
  tutorial: TutorialSchema,
  assets: z.record(z.string(), AssetSchema),
})

export type Asset = z.infer<typeof AssetSchema>
export type Supply = z.infer<typeof SupplySchema>
export type Step = z.infer<typeof StepSchema>
export type Frequency = z.infer<typeof FrequencySchema>
export type Tutorial = z.infer<typeof TutorialSchema>
export type Doc = z.infer<typeof DocumentSchema>
export type FrequencyKind = (typeof FREQUENCY_KINDS)[number]
export type SupplyKind = (typeof SUPPLY_KINDS)[number]

export function assetSrc(asset: Asset): string {
  return `data:${asset.mime};base64,${asset.data}`
}

export const FREQUENCY_LABEL: Record<FrequencyKind, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
  seasonal: 'Seasonal',
}

export const SUPPLY_LABEL: Record<SupplyKind, string> = {
  chemical: 'Chemical',
  tool: 'Tool',
  consumable: 'Consumable',
}

/** "Every 2 weeks", "Weekly", "Monthly — after the filter change" */
export function frequencyLabel(f: Frequency): string {
  const base = FREQUENCY_LABEL[f.kind]
  if (f.everyN && f.everyN > 1) {
    const unit = { daily: 'days', weekly: 'weeks', monthly: 'months', quarterly: 'quarters', yearly: 'years', seasonal: 'seasons' }[f.kind]
    return `Every ${f.everyN} ${unit}`
  }
  return base
}
