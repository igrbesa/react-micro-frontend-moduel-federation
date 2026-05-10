import {
  lazy,
  Suspense,
  useEffect,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from 'react'
import { bus } from '../../../shared/bus'
import {
  CART_PRODUCT_PREVIEW_EVENT,
  type CartPreviewOpenPayload,
  type CartProductPreviewPayload,
  type ThirdPartyCartPreviewContext,
} from '../../../shared/cartEvents'
import type { ProductsAppRemoteProps } from 'products/ProductsApp'

const CartRemote = lazy(async () => import('cart/CartApp'))

const ProductsRemote: LazyExoticComponent<ComponentType<ProductsAppRemoteProps>> = lazy(
  async () => import('products/ProductsApp'),
)

function RemoteFallback() {
  return <p className="remote-fallback">Loading remote…</p>
}

function ThirdPartyCartPreviewPlaceholder({
  previewContext,
}: {
  previewContext: ThirdPartyCartPreviewContext
}) {
  return (
    <div className="shell-cart-split__thirdparty-placeholder" aria-label="Third-party preview">
      <h2 className="shell-cart-split__thirdparty-title">Partner content</h2>
      <p className="shell-cart-split__thirdparty-copy">
        Placeholder for federated preview from another app (for example bundles, warranty,
        recommendations).
      </p>
      {previewContext.correlationId ? (
        <p className="shell-cart-split__thirdparty-meta">Ref: {previewContext.correlationId}</p>
      ) : null}
    </div>
  )
}

type CartPreviewShellState =
  | { phase: 'closed' }
  | { phase: 'open'; openPayload: CartPreviewOpenPayload }

function applyCartPreview(
  prev: CartPreviewShellState,
  event: CartProductPreviewPayload,
): CartPreviewShellState {
  if (event.openPreviewPane === false) return { phase: 'closed' }
  if (event.openPreviewPane === true) return { phase: 'open', openPayload: event }
  return prev
}

export function CartPage() {
  const [preview, setPreview] = useState<CartPreviewShellState>({ phase: 'closed' })

  useEffect(() => {
    return bus.on(CART_PRODUCT_PREVIEW_EVENT, (p) => {
      setPreview((prev) => applyCartPreview(prev, p))
    })
  }, [])

  const splitClasses =
    'shell-cart-split' +
    (preview.phase === 'open' ? ' shell-cart-split--double' : ' shell-cart-split--single')

  return (
    <div className={splitClasses}>
      <section className="shell-cart-split__pane shell-cart-split__pane--cart" aria-label="Shopping cart">
        <Suspense fallback={<RemoteFallback />}>
          <CartRemote />
        </Suspense>
      </section>

      {preview.phase === 'open' && preview.openPayload.previewRemote === 'products' ? (
        <section
          className="shell-cart-split__pane shell-cart-split__pane--products"
          aria-label="Product preview"
        >
          <Suspense fallback={<RemoteFallback />}>
            <ProductsRemote
              embeddedInShellCart
              embeddedPreviewContext={preview.openPayload.previewContext}
            />
          </Suspense>
        </section>
      ) : null}

      {preview.phase === 'open' && preview.openPayload.previewRemote === 'thirdParty' ? (
        <section
          className="shell-cart-split__pane shell-cart-split__pane--thirdparty"
          aria-label="Third-party preview panel"
        >
          <ThirdPartyCartPreviewPlaceholder
            previewContext={preview.openPayload.previewContext}
          />
        </section>
      ) : null}
    </div>
  )
}
