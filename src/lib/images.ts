import { newId } from './id'
import type { Asset } from '../domain/schema'

/**
 * The whole tool lives or dies here. A raw phone photo is ~4MB, and base64
 * adds another 33% on top when it lands in the export file. Downscale and
 * re-encode before anything else touches it.
 */

const MAX_EDGE = 1400
const QUALITY = 0.82

export const ACCEPTED_TYPES = 'image/png,image/jpeg,image/webp,image/gif,image/avif,image/heic'

export async function fileToAsset(file: File, alt?: string): Promise<Asset> {
  // imageOrientation: 'from-image' applies the EXIF rotation, which is why
  // your bathroom photos won't come out sideways.
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()

  let mime = 'image/webp'
  let dataUrl = canvas.toDataURL(mime, QUALITY)
  if (!dataUrl.startsWith('data:image/webp')) {
    mime = 'image/jpeg'
    dataUrl = canvas.toDataURL(mime, QUALITY)
  }

  return {
    id: newId(),
    mime,
    w,
    h,
    alt: alt || stripExtension(file.name),
    data: dataUrl.slice(dataUrl.indexOf(',') + 1),
  }
}

export async function filesToAssets(files: Iterable<File>): Promise<Asset[]> {
  const images = [...files].filter((f) => f.type.startsWith('image/'))
  const results = await Promise.allSettled(images.map((f) => fileToAsset(f)))
  return results.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []))
}

/** Rough on-disk size of the base64 payload, for the size readout in the UI. */
export function assetBytes(asset: Asset): number {
  return Math.floor((asset.data.length * 3) / 4)
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function stripExtension(name: string): string {
  return name.replace(/\.[^./\\]+$/, '')
}
