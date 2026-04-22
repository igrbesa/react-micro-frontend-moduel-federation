import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../hooks'
import { signIn } from '../store/slices/authSlice'

type LoginLocationState = {
  from?: { pathname: string }
}

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const from = (location.state as LoginLocationState | null)?.from?.pathname

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    dispatch(signIn({ email }))
    navigate(from ?? '/', { replace: true })
  }

  return (
    <section className="login">
      <h2 className="login__title">Sign in</h2>
      <p className="login__lead">
        This is a demo login. Any email and password are accepted.
      </p>
      <form className="login__form" onSubmit={handleSubmit}>
        <label className="login__field">
          <span className="login__label">Email</span>
          <input
            className="login__input"
            type="email"
            name="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label className="login__field">
          <span className="login__label">Password</span>
          <input
            className="login__input"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>
        <div className="login__actions">
          <button type="submit" className="login__submit">
            Sign in
          </button>
          <Link to="/" className="login__cancel">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  )
}
