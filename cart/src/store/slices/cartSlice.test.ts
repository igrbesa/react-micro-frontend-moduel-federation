import { describe, expect, it } from 'vitest'
import { addItemFromProducts, cartSlice, type CartState } from './cartSlice'

describe('cartSlice', () => {
  it('adds a new cart line when product is not present', () => {
    const state: CartState = { currency: 'USD', lines: [] }

    const next = cartSlice.reducer(
      state,
      addItemFromProducts({ id: '1', name: 'Notebook', price: 12.99 }),
    )

    expect(next.lines).toEqual([
      { id: '1', name: 'Notebook', qty: 1, lineTotal: 12.99 },
    ])
  })

  it('increments qty and lineTotal when product already exists', () => {
    const state: CartState = {
      currency: 'USD',
      lines: [{ id: '1', name: 'Notebook', qty: 1, lineTotal: 12.99 }],
    }

    const next = cartSlice.reducer(
      state,
      addItemFromProducts({ id: '1', name: 'Notebook', price: 12.99 }),
    )

    expect(next.lines).toEqual([
      { id: '1', name: 'Notebook', qty: 2, lineTotal: 25.98 },
    ])
  })
})
