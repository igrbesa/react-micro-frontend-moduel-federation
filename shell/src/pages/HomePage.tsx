import { Link } from 'react-router-dom'

const apps = [
  {
    to: '/products',
    title: 'Products',
    description: 'Catalog micro-app (remote) with sample items from Redux.',
  },
  {
    to: '/cart',
    title: 'Cart',
    description: 'Cart micro-app (remote) with sample line items from Redux.',
  },
]

export function HomePage() {
  return (
    <section className="home">
      <h2>Apps</h2>
      <p className="home__lead">
        Both micro-apps are listed here on the home route. Use the top bar
        switcher or open one below.
      </p>
      <ul className="home__grid">
        {apps.map((app) => (
          <li key={app.to} className="home__card">
            <h3>{app.title}</h3>
            <p>{app.description}</p>
            <Link to={app.to} className="home__cta">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
