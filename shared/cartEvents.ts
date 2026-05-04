export const CART_ADD_EVENT = 'cart:add' as const

export const CART_PRODUCT_PREVIEW_EVENT = 'cart:product-preview' as const

export type CartAddPayload = {
  id: string
  name: string
  price: number
}

/** Cart-side preview: omit `productId` to open the panel with no selection; set `productId` to show that product. */
export type CartProductPreviewPayload = {
  productId?: string
}

export type AppEventMap = {
  [CART_ADD_EVENT]: CartAddPayload
  [CART_PRODUCT_PREVIEW_EVENT]: CartProductPreviewPayload
}
