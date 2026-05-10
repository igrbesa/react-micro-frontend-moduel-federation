declare module 'products/ProductsApp' {
  import type { ComponentType } from 'react'

  /** Mirrors `ProductsCartPreviewContext` in shared/cartEvents */
  export type ProductsCartPreviewRemoteContext = {
    productId: string
  }

  export type ProductsAppRemoteProps = {
    embeddedInShellCart?: boolean
    embeddedPreviewContext?: ProductsCartPreviewRemoteContext | null
  }

  const Component: ComponentType<ProductsAppRemoteProps>
  export default Component
}

declare module 'cart/CartApp' {
  import type { ComponentType } from 'react'
  const Component: ComponentType
  export default Component
}
