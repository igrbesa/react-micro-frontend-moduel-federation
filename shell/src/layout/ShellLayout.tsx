import { NavLink, Outlet } from 'react-router-dom'
import { useAppSelector } from '../hooks'

export function ShellLayout() {
  const title = useAppSelector((s) => s.shell.title)

  return (
    <div className="layout-shell">
      <header className="top-bar">
        <NavLink to="/" className="top-bar__brand" end>
          {title}
        </NavLink>
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
      </header>
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  )
}
