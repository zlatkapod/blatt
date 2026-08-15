import { useCallback, useEffect, useRef, useState } from 'react'
import { getDoc, putDoc } from './db'
import { nowIso, pruneAssets } from '../domain/factory'
import type { Doc } from '../domain/schema'

export type LoadState = 'loading' | 'ready' | 'missing'
export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

const SAVE_DEBOUNCE_MS = 500

/**
 * Loads a document and autosaves it. There is no save button, because save
 * buttons are a promise the software rarely keeps.
 */
export function useDoc(id: string) {
  const [doc, setDoc] = useState<Doc | null>(null)
  const [load, setLoad] = useState<LoadState>('loading')
  const [save, setSave] = useState<SaveState>('idle')
  const dirty = useRef(false)

  useEffect(() => {
    let cancelled = false
    dirty.current = false
    setLoad('loading')
    getDoc(id).then((found) => {
      if (cancelled) return
      setDoc(found ?? null)
      setLoad(found ? 'ready' : 'missing')
    })
    return () => {
      cancelled = true
    }
  }, [id])

  /** Every edit stamps updatedAt, so the preview footer never lies. */
  const update = useCallback((mutate: (draft: Doc) => Doc) => {
    setDoc((current) => {
      if (!current) return current
      const next = mutate(current)
      dirty.current = true
      return { ...next, tutorial: { ...next.tutorial, updatedAt: nowIso() } }
    })
  }, [])

  useEffect(() => {
    if (!doc || !dirty.current) return
    setSave('saving')
    const timer = setTimeout(() => {
      putDoc(pruneAssets(doc))
        .then(() => setSave('saved'))
        .catch(() => setSave('error'))
    }, SAVE_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [doc])

  return { doc, load, save, update }
}
