/** Move an item by one position. Out-of-range moves return the original array. */
export function move<T>(items: T[], index: number, delta: number): T[] {
  const target = index + delta
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) return items
  const next = [...items]
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  return next
}

export function replaceAt<T>(items: T[], index: number, item: T): T[] {
  const next = [...items]
  next[index] = item
  return next
}

export function removeAt<T>(items: T[], index: number): T[] {
  return items.filter((_, i) => i !== index)
}
