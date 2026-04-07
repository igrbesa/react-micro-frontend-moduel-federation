import { createSlice } from '@reduxjs/toolkit'

export type ShellState = {
  title: string
}

const initialState: ShellState = {
  title: 'Microfrontend shell',
}

export const shellSlice = createSlice({
  name: 'shell',
  initialState,
  reducers: {},
})
