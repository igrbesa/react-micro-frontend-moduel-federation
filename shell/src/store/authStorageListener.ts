import { createListenerMiddleware } from '@reduxjs/toolkit'
import { clearFakePkceTokenSet, persistFakePkceTokenSet } from '../auth/fakePkceTokenStorage'
import { signIn, signOut, userFromSignInPayload } from './slices/authSlice'

export const authStorageListener = createListenerMiddleware()

authStorageListener.startListening({
  actionCreator: signIn,
  effect: (action) => {
    persistFakePkceTokenSet({ user: userFromSignInPayload(action.payload) })
  },
})

authStorageListener.startListening({
  actionCreator: signOut,
  effect: () => {
    clearFakePkceTokenSet()
  },
})
