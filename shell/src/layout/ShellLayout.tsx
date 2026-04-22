import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { signOut } from '../store/slices/authSlice'

export function ShellLayout() {
  const title = useAppSelector((s) => s.shell.title)
  const user = useAppSelector((s) => s.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  function handleSignOut() {
    dispatch(signOut())
    navigate('/', { replace: true })
  }

  return (
    <div className="layout-shell">
      <header className="top-bar">
        <NavLink to="/" className="top-bar__brand" end>
          {title}
        </NavLink>
        <div className="top-bar__right">
          <nav className="app-switcher" aria-label="App switcher">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                'app-switcher__link' +
                (isActive ? ' app-switcher__link--active' : '')
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                'app-switcher__link' +
                (isActive ? ' app-switcher__link--active' : '')
              }
            >
              Cart
            </NavLink>
          </nav>
          <div className="top-bar__auth">
            {user ? (
              <>
                <span className="top-bar__user" title={user.email}>
                  {user.displayName}
                </span>
                <button
                  type="button"
                  className="top-bar__sign-out"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </>
            ) : (
              <NavLink to="/login" className="top-bar__sign-in">
                Sign in
              </NavLink>
            )}
          </div>
        </div>
      </header>
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  )
}
