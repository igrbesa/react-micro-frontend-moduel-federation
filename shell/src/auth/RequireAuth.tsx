import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../hooks'

type RequireAuthProps = {
  children: ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const user = useAppSelector((s) => s.auth.user)
  const location = useLocation()

  if (!user) {
    return (
      <Navigate to="/login" replace state={{ from: location }} />
    )
  }

  return children
}
