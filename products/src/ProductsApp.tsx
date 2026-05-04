import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { bus } from '../../shared/bus'
import { CART_ADD_EVENT, CART_PRODUCT_PREVIEW_EVENT } from '../../shared/cartEvents'
import { addItemToStoredCart } from '../../shared/cartStorage'
import { useAppSelector } from './hooks'
import { selectProducts } from './store/slices/productsSlice'
import type { Product } from './store/slices/productsSlice'
import { store } from './store'
import './products.css'

function addProductToCart(product: Product) {
  const payload = {
    id: product.id,
    name: product.name,
    price: product.price,
  }

  addItemToStoredCart(payload)
  bus.emit(CART_ADD_EVENT, payload)
}

function ProductDetailView({
  product,
  variant,
  onClose,
}: {
  product: Product
  variant: 'page' | 'embed'
  onClose?: () => void
}) {
  return (
    <div
      className={
        'mfe-products mfe-products--detail' +
        (variant === 'embed' ? ' mfe-products--detail-embed' : '')
      }
    >
      {variant === 'page' ? (
        <Link to=".." relative="path" className="mfe-products__back-link">
          Back to products
        </Link>
      ) : (
        <button type="button" className="mfe-products__embed-dismiss" onClick={onClose}>
          Close preview
        </button>
      )}
      <h2>{product.name}</h2>
      <p className="mfe-products__description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas luctus, risus a pulvinar
        cursus, nibh nunc cursus turpis, eu tincidunt magna nisl vel elit.
      </p>
      <img
        className="mfe-products__image"
        src={`https://picsum.photos/seed/${product.id}/600/360`}
        alt={product.name}
      />
      <div className="mfe-products__detail-footer">
        <span className="mfe-products__price">${product.price.toFixed(2)}</span>
        <button
          type="button"
          className="mfe-products__add-btn"
          onClick={() => addProductToCart(product)}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  )
}

function ProductsList() {
  const items = useAppSelector(selectProducts)

  return (
    <div className="mfe-products">
      <h2>Products</h2>
      <p className="mfe-products__lead">
        Remote micro-app: catalog from Redux state.
      </p>
      <ul className="mfe-products__list">
        {items.map((p) => (
          <li key={p.id} className="mfe-products__item">
            <span className="mfe-products__name">{p.name}</span>
            <div className="mfe-products__actions">
              <span className="mfe-products__price">${p.price.toFixed(2)}</span>
              <Link to={p.id} className="mfe-products__detail-btn">
                View detail
              </Link>
              <button
                type="button"
                className="mfe-products__add-btn"
                onClick={() => addProductToCart(p)}
              >
                ADD
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProductDetails() {
  const items = useAppSelector(selectProducts)
  const { productId } = useParams<{ productId: string }>()
  const product = items.find((item) => item.id === productId)

  if (!product) {
    return <Navigate to=".." relative="path" replace />
  }

  return <ProductDetailView product={product} variant="page" />
}

function ProductsCartPreview({
  previewProductId,
  onDismissDetail,
}: {
  previewProductId: string | null
  onDismissDetail: () => void
}) {
  const items = useAppSelector(selectProducts)
  const product = previewProductId ? items.find((p) => p.id === previewProductId) : undefined

  return (
    <div className="mfe-products mfe-products--cart-preview">
      <h2 className="mfe-products__preview-heading">Product preview</h2>
      {!previewProductId && (
        <p className="mfe-products__preview-empty">
          Select an item in your cart to see details here.
        </p>
      )}
      {previewProductId && !product && (
        <p className="mfe-products__preview-empty">Product not found.</p>
      )}
      {product && (
        <ProductDetailView
          product={product}
          variant="embed"
          onClose={onDismissDetail}
        />
      )}
    </div>
  )
}

function ProductsRouterShell() {
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false)
  const [previewProductId, setPreviewProductId] = useState<string | null>(null)

  useEffect(() => {
    return bus.on(CART_PRODUCT_PREVIEW_EVENT, (payload) => {
      setCartPreviewOpen(true)
      setPreviewProductId(payload.productId ?? null)
    })
  }, [])

  if (cartPreviewOpen) {
    return (
      <ProductsCartPreview
        previewProductId={previewProductId}
        onDismissDetail={() => setPreviewProductId(null)}
      />
    )
  }

  return <ProductsContent />
}

function ProductsContent() {
  return (
    <Routes>
      <Route index element={<ProductsList />} />
      <Route path=":productId" element={<ProductDetails />} />
    </Routes>
  )
}

export default function ProductsApp() {
  return (
    <Provider store={store}>
      <ProductsRouterShell />
    </Provider>
  )
}
