import { configureStore } from '@reduxjs/toolkit'
import { rehydrateAuthStateFromStorage } from '../auth/fakePkceTokenStorage'
import { authStorageListener } from './authStorageListener'
import { authSlice } from './slices/authSlice'
import { shellSlice } from './slices/shellSlice'

const rehydratedAuth = rehydrateAuthStateFromStorage()

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    shell: shellSlice.reducer,
  },
  preloadedState:
    rehydratedAuth == null
      ? undefined
      : {
          auth: rehydratedAuth,
        },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(authStorageListener.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
