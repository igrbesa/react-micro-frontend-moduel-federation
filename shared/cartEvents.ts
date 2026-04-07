export const CART_ADD_EVENT = 'cart:add' as const

export type CartAddPayload = {
  id: string
  name: string
  price: number
}

export type AppEventMap = {
  [CART_ADD_EVENT]: CartAddPayload
}
