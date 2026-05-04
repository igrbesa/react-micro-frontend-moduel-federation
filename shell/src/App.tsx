import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './auth/RequireAuth'
import { ShellLayout } from './layout/ShellLayout'
import { CartPage } from './pages/CartPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'

const ProductsRemote = lazy(async () => import('products/ProductsApp'))

function RemoteFallback() {
  return <p className="remote-fallback">Loading remote…</p>
}

function App() {
  return (
    <Routes>
      <Route element={<ShellLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route
          path="products/*"
          element={
            <RequireAuth>
              <Suspense fallback={<RemoteFallback />}>
                <ProductsRemote />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="cart"
          element={
            <RequireAuth>
              <CartPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
