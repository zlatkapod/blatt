import { SCHEMA_VERSION, type Asset, type Doc } from './schema'

/**
 * A worked example, offered from the empty state.
 *
 * It exists so the first thing you see is a good tutorial rather than a blank
 * form — the structure teaches itself faster than help text does. The images
 * are line drawings rather than photographs, which keeps the sample small and
 * makes it obvious they are placeholders for your own.
 */

const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120">` +
  `<rect width="160" height="120" fill="#f2f2f2"/>` +
  `<g fill="none" stroke="#0a0a0a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${body}</g>` +
  `</svg>`

function drawing(id: string, alt: string, body: string): Asset {
  return {
    id,
    mime: 'image/svg+xml',
    w: 160,
    h: 120,
    alt,
    // ASCII-only source, so btoa is safe.
    data: btoa(svg(body)),
  }
}

const SPRAY = '<path d="M74 44h22v54H74z"/><path d="M78 44V30h14v14"/><path d="M92 34h16l-6-8"/>'
const BRUSH = '<path d="M44 52h72v22H44z"/><path d="M50 74v18M62 74v18M74 74v18M86 74v18M98 74v18M110 74v18"/>'
const TILES = '<path d="M36 34h88v52H36z"/><path d="M36 60h88M65 34v52M95 34v52"/>'
const CLOTH = '<path d="M46 40h68v46H46z"/><path d="M46 52c12 8 24-8 34 0s22 8 34 0"/>'

export function sampleDoc(id: string, timestamp: string): Doc {
  return {
    assets: {
      'sample-spray': drawing('sample-spray', 'Spray bottle of descaler', SPRAY),
      'sample-brush': drawing('sample-brush', 'Stiff grout brush', BRUSH),
      'sample-tiles': drawing('sample-tiles', 'Tiled wall', TILES),
      'sample-cloth': drawing('sample-cloth', 'Microfibre cloth', CLOTH),
    },
    tutorial: {
      schemaVersion: SCHEMA_VERSION,
      id,
      title: 'Bathroom — Descale & Deep Clean',
      area: 'Bathroom',
      durationMin: 35,
      frequency: { kind: 'weekly', everyN: 2, note: 'Or whenever the glass goes cloudy' },
      cautions: [
        'Never mix descaler with bleach or any chlorine product — it releases chlorine gas.',
        'Open the window and run the extractor fan for the whole job.',
        'Descaler etches natural stone. Test a hidden corner before you commit.',
      ],
      supplies: [
        {
          id: 'sample-s1',
          name: 'Limescale remover',
          kind: 'chemical',
          note: 'Dilute 1:10 in the trigger bottle',
          assetId: 'sample-spray',
        },
        {
          id: 'sample-s2',
          name: 'Grout brush',
          kind: 'tool',
          note: 'Stiff nylon, not wire',
          assetId: 'sample-brush',
        },
        {
          id: 'sample-s3',
          name: 'Microfibre cloths',
          kind: 'consumable',
          note: 'Two: one wet, one dry',
          assetId: 'sample-cloth',
        },
        { id: 'sample-s4', name: 'Squeegee', kind: 'tool', note: 'For the glass and tiles' },
      ],
      steps: [
        {
          id: 'sample-st1',
          text: 'Clear every surface. Shampoo bottles, razors, the rubber duck — all of it out of the room, not just pushed to one side.',
          assetIds: [],
          tip: 'A clear room is the difference between 35 minutes and an hour.',
        },
        {
          id: 'sample-st2',
          text: 'Spray the diluted descaler across the tiles, the glass, and the taps. Leave it to work for five minutes without touching anything.',
          assetIds: ['sample-tiles'],
          tip: 'Work top to bottom so the drips land on tile you have not cleaned yet.',
        },
        {
          id: 'sample-st3',
          text: 'Scrub the grout lines with the brush, working in short strokes along each line rather than in circles.',
          assetIds: ['sample-brush'],
        },
        {
          id: 'sample-st4',
          text: 'Rinse everything with warm water from the showerhead, starting at the top of the wall.',
          assetIds: [],
        },
        {
          id: 'sample-st5',
          text: 'Squeegee the glass and tiles dry, then buff the taps with the dry cloth until they stop looking wet.',
          assetIds: ['sample-cloth'],
          tip: 'Buffing dry is what makes the difference between clean and clean-looking.',
        },
        {
          id: 'sample-st6',
          text: 'Leave the window open and the fan running for twenty minutes. Put everything back only once the room is dry.',
          assetIds: [],
        },
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  }
}
