import { useEffect, useState } from 'react'

/**
 * A hash router in thirty lines. Three views do not justify a dependency,
 * and hash routing means the built app also runs from file:// if you ever
 * want it on a USB stick next to the mop.
 *
 *   #/            library
 *   #/t/:id       editor
 *   #/t/:id/print print view
 */
export type Route =
  | { name: 'library' }
  | { name: 'sample' }
  | { name: 'editor'; id: string }
  | { name: 'print'; id: string }

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/^\/+/, '')
  const parts = path.split('/').filter(Boolean)
  if (parts[0] === 'sample') return { name: 'sample' }
  if (parts[0] === 't' && parts[1]) {
    return parts[2] === 'print'
      ? { name: 'print', id: decodeURIComponent(parts[1]) }
      : { name: 'editor', id: decodeURIComponent(parts[1]) }
  }
  return { name: 'library' }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export const href = {
  library: () => '#/',
  sample: () => '#/sample',
  editor: (id: string) => `#/t/${encodeURIComponent(id)}`,
  print: (id: string) => `#/t/${encodeURIComponent(id)}/print`,
}

export function navigate(to: string): void {
  window.location.hash = to.replace(/^#/, '')
}
