import { configureStore } from '@reduxjs/toolkit'
import { shellSlice } from './slices/shellSlice'

export const store = configureStore({
  reducer: {
    shell: shellSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
