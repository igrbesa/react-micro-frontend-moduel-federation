import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ShellLayout } from './layout/ShellLayout'
import { HomePage } from './pages/HomePage'

const ProductsRemote = lazy(async () => import('products/ProductsApp'))
const CartRemote = lazy(async () => import('cart/CartApp'))

function RemoteFallback() {
  return <p className="remote-fallback">Loading remote…</p>
}

function App() {
  return (
    <Routes>
      <Route element={<ShellLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="products/*"
          element={
            <Suspense fallback={<RemoteFallback />}>
              <ProductsRemote />
            </Suspense>
          }
        />
        <Route
          path="cart"
          element={
            <Suspense fallback={<RemoteFallback />}>
              <CartRemote />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
