import { Provider } from 'react-redux'
import { bus } from '../../shared/bus'
import { CART_ADD_EVENT } from '../../shared/cartEvents'
import { addItemToStoredCart } from '../../shared/cartStorage'
import { useAppSelector } from './hooks'
import { selectProducts } from './store/slices/productsSlice'
import { store } from './store'
import './products.css'

function ProductsContent() {
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
              <button
                type="button"
                className="mfe-products__add-btn"
                onClick={() => {
                  const payload = {
                    id: p.id,
                    name: p.name,
                    price: p.price,
                  }
                  addItemToStoredCart(payload)
                  bus.emit(CART_ADD_EVENT, payload)
                }}
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

export default function ProductsApp() {
  return (
    <Provider store={store}>
      <ProductsContent />
    </Provider>
  )
}
