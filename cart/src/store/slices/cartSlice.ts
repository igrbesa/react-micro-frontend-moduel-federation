import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartAddPayload } from '../../../../shared/cartEvents'
import { getStoredCartLines } from '../../../../shared/cartStorage'

export type CartLine = { id: string; name: string; qty: number; lineTotal: number }

export type CartState = {
  lines: CartLine[]
  currency: string
}

const initialState: CartState = {
  currency: 'USD',
  lines: getStoredCartLines(),
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrateFromStorage(state, action: PayloadAction<CartLine[]>) {
      state.lines = action.payload
    },

    addItemFromProducts(state, action: PayloadAction<CartAddPayload>) {
      const product = action.payload
      const existingLine = state.lines.find((line) => line.id === product.id)

      if (existingLine) {
        existingLine.qty += 1
        existingLine.lineTotal += product.price
        return
      }

      state.lines.push({
        id: product.id,
        name: product.name,
        qty: 1,
        lineTotal: product.price,
      })
    },
  },
})

export const { hydrateFromStorage, addItemFromProducts } = cartSlice.actions

export const selectCartLines = (state: { cart: CartState }) => state.cart.lines
export const selectCartCurrency = (state: { cart: CartState }) => state.cart.currency

export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.lines.reduce((sum, line) => sum + line.lineTotal, 0)
