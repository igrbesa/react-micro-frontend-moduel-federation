export const CART_ADD_EVENT = 'cart:add' as const

export const CART_PRODUCT_PREVIEW_EVENT = 'cart:product-preview' as const

export type CartAddPayload = {
  id: string
  name: string
  price: number
}

/** Payload the products MFE uses when rendered in the cart preview pane */
export interface ProductsCartPreviewContext {
  productId: string
}

/** Payload for optional third‑party federated previews; extend when wiring a remote */
export interface ThirdPartyCartPreviewContext {
  correlationId?: string
}

/**
 * Register preview remotes and their typed context here. The union `CartProductPreviewPayload`
 * is derived from this map so shell stays generic and each remote owns its payload shape.
 */
export interface CartPreviewContexts {
  products: ProductsCartPreviewContext
  thirdParty: ThirdPartyCartPreviewContext
}

export type CartPreviewRemote = keyof CartPreviewContexts

/** Collapses the shell cart preview splitter */
export interface CartPreviewClosePayload {
  openPreviewPane: false
}

/** Opens the splitter and mounts `previewRemote` with that remote's `previewContext` */
export type CartPreviewOpenPayload = {
  [K in CartPreviewRemote]: {
    openPreviewPane: true
    previewRemote: K
    previewContext: CartPreviewContexts[K]
  }
}[CartPreviewRemote]

export type CartProductPreviewPayload = CartPreviewClosePayload | CartPreviewOpenPayload

export type AppEventMap = {
  [CART_ADD_EVENT]: CartAddPayload
  [CART_PRODUCT_PREVIEW_EVENT]: CartProductPreviewPayload
}
