import { createSlice } from '@reduxjs/toolkit'

export type Product = { id: string; name: string; price: number }

export type ProductsState = {
  items: Product[]
}

const initialState: ProductsState = {
  items: [
    { id: '1', name: 'Notebook', price: 12.99 },
    { id: '2', name: 'Pen set', price: 8.5 },
    { id: '3', name: 'Desk lamp', price: 39.0 },
    { id: '4', name: 'Wireless mouse', price: 24.5 },
    { id: '5', name: 'Laptop stand', price: 31.25 },
    { id: '6', name: 'USB-C hub', price: 27.4 },
  ],
}

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
})

export const selectProducts = (state: { products: ProductsState }) =>
  state.products.items
