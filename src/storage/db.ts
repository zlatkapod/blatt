import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import { DocumentSchema, type Doc } from '../domain/schema'

/**
 * IndexedDB, not localStorage — two phone photos blow past the ~5MB quota.
 *
 * NOTE: IndexedDB is scoped to the *origin*. Moving the app from
 * blatt.workers.dev to a custom domain gives you a fresh, empty database.
 * The exported .blatt.html files are the durable store; this is a cache
 * with opinions. See README.
 */

interface BlattDB extends DBSchema {
  docs: {
    key: string
    value: Doc
    indexes: { 'by-updated': string }
  }
}

const DB_NAME = 'blatt'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<BlattDB>> | null = null

function db(): Promise<IDBPDatabase<BlattDB>> {
  if (!dbPromise) {
    dbPromise = openDB<BlattDB>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        const store = database.createObjectStore('docs', { keyPath: 'tutorial.id' })
        store.createIndex('by-updated', 'tutorial.updatedAt')
      },
    })
  }
  return dbPromise
}

export async function listDocs(): Promise<Doc[]> {
  const all = await (await db()).getAll('docs')
  return all
    .filter((doc) => DocumentSchema.safeParse(doc).success)
    .sort((a, b) => b.tutorial.updatedAt.localeCompare(a.tutorial.updatedAt))
}

export async function getDoc(id: string): Promise<Doc | undefined> {
  const raw = await (await db()).get('docs', id)
  if (!raw) return undefined
  const parsed = DocumentSchema.safeParse(raw)
  return parsed.success ? parsed.data : undefined
}

export async function putDoc(doc: Doc): Promise<void> {
  await (await db()).put('docs', doc)
}

export async function deleteDoc(id: string): Promise<void> {
  await (await db()).delete('docs', id)
}
