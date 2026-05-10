import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { bus } from '../../shared/bus'
import { CART_ADD_EVENT, CART_PRODUCT_PREVIEW_EVENT } from '../../shared/cartEvents'
import { getStoredCartLines } from '../../shared/cartStorage'
import { useAppDispatch, useAppSelector } from './hooks'
import { addItemFromProducts, hydrateFromStorage } from './store/slices/cartSlice'
import {
  selectCartCurrency,
  selectCartLines,
  selectCartTotal,
} from './store/slices/cartSlice'
import { store } from './store'
import './cart.css'

function CartContent() {
  const dispatch = useAppDispatch()
  const lines = useAppSelector(selectCartLines)
  const total = useAppSelector(selectCartTotal)
  const currency = useAppSelector(selectCartCurrency)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(hydrateFromStorage(getStoredCartLines()))

    const off = bus.on(CART_ADD_EVENT, (item) => {
      dispatch(addItemFromProducts(item))
    })

    return off
  }, [dispatch])

  return (
    <div className="mfe-cart">
      <h2>Cart</h2>
      <p className="mfe-cart__lead">
        Remote micro-app: sample line items from Redux state.
      </p>
      <ul className="mfe-cart__list">
        {lines.map((line) => {
          const isSelected = selectedProductId === line.id
          return (
            <li key={line.id}>
              <button
                type="button"
                className={
                  'mfe-cart__line' +
                  (isSelected ? ' mfe-cart__line--selected' : '')
                }
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedProductId(line.id)
                  bus.emit(CART_PRODUCT_PREVIEW_EVENT, {
                    openPreviewPane: true,
                    previewRemote: 'products',
                    previewContext: { productId: line.id },
                  })
                }}
              >
                <span className="mfe-cart__name">{line.name}</span>
                <span className="mfe-cart__meta">
                  ×{line.qty} · {currency}{' '}
                  {line.lineTotal.toFixed(2)}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="mfe-cart__total">
        <span>Estimated total</span>
        <strong>
          {currency} {total.toFixed(2)}
        </strong>
      </div>
    </div>
  )
}

export default function CartApp() {
  return (
    <Provider store={store}>
      <CartContent />
    </Provider>
  )
}
