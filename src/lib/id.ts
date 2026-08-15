/** Stable, dependency-free ids. crypto.randomUUID is available everywhere we run. */
export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  // Fallback for non-secure contexts (plain http on a LAN address).
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function slugify(value: string): string {
  const slug = value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics — Koupelna → koupelna
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'untitled'
}
