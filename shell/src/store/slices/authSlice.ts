import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AuthUser = {
  email: string
  displayName: string
}

export type AuthState = {
  user: AuthUser | null
}

const initialState: AuthState = {
  user: null,
}

export function userFromSignInPayload(payload: {
  email: string
  displayName?: string
}): AuthUser {
  const raw = payload.email.trim()
  const email = raw.length > 0 ? raw : 'user@local'
  return {
    email,
    displayName:
      payload.displayName?.trim() || email.split('@')[0] || 'User',
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (
      state,
      action: PayloadAction<{ email: string; displayName?: string }>,
    ) => {
      state.user = userFromSignInPayload(action.payload)
    },
    signOut: (state) => {
      state.user = null
    },
  },
})

export const { signIn, signOut } = authSlice.actions
