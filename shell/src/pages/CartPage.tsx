import { lazy, Suspense, useEffect } from 'react'
import { bus } from '../../../shared/bus'
import { CART_PRODUCT_PREVIEW_EVENT } from '../../../shared/cartEvents'

const CartRemote = lazy(async () => import('cart/CartApp'))
const ProductsRemote = lazy(async () => import('products/ProductsApp'))

function RemoteFallback() {
  return <p className="remote-fallback">Loading remote…</p>
}

export function CartPage() {
  useEffect(() => {
    bus.emit(CART_PRODUCT_PREVIEW_EVENT, {})
  }, [])

  return (
    <div className="shell-cart-split">
      <section className="shell-cart-split__pane shell-cart-split__pane--cart" aria-label="Shopping cart">
        <Suspense fallback={<RemoteFallback />}>
          <CartRemote />
        </Suspense>
      </section>
      <section
        className="shell-cart-split__pane shell-cart-split__pane--products"
        aria-label="Product preview"
      >
        <Suspense fallback={<RemoteFallback />}>
          <ProductsRemote />
        </Suspense>
      </section>
    </div>
  )
}
