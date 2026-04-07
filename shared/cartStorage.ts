import type { CartAddPayload } from './cartEvents'

export type StoredCartLine = {
  id: string
  name: string
  qty: number
  lineTotal: number
}

const STORAGE_KEY = 'mfe:cart:lines'

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export function getStoredCartLines(): StoredCartLine[] {
  if (!hasWindow()) return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (line): line is StoredCartLine =>
        Boolean(
          line &&
            typeof line.id === 'string' &&
            typeof line.name === 'string' &&
            typeof line.qty === 'number' &&
            typeof line.lineTotal === 'number',
        ),
    )
  } catch {
    return []
  }
}

function setStoredCartLines(lines: StoredCartLine[]) {
  if (!hasWindow()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
}

export function addItemToStoredCart(product: CartAddPayload) {
  const lines = getStoredCartLines()
  const existingLine = lines.find((line) => line.id === product.id)

  if (existingLine) {
    existingLine.qty += 1
    existingLine.lineTotal += product.price
    setStoredCartLines(lines)
    return
  }

  lines.push({
    id: product.id,
    name: product.name,
    qty: 1,
    lineTotal: product.price,
  })
  setStoredCartLines(lines)
}
