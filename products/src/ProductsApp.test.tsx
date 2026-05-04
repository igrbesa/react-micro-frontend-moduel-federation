import { act } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { bus } from '../../shared/bus'
import { CART_PRODUCT_PREVIEW_EVENT } from '../../shared/cartEvents'
import ProductsApp from './ProductsApp'

describe('ProductsApp', () => {
  it('opens cart preview panel on cart:product-preview with no productId', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProductsApp />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument()

    act(() => {
      bus.emit(CART_PRODUCT_PREVIEW_EVENT, {})
    })

    expect(screen.getByText(/Select an item in your cart/)).toBeInTheDocument()
  })

  it('shows detail after cart:product-preview with productId', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProductsApp />
      </MemoryRouter>,
    )

    act(() => {
      bus.emit(CART_PRODUCT_PREVIEW_EVENT, { productId: '1' })
    })

    expect(screen.getByRole('heading', { name: 'Notebook' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close preview' })).toBeInTheDocument()
  })

  it('renders catalog when no cart preview event was received', () => {
    render(
      <MemoryRouter initialEntries={['/products']}>
        <ProductsApp />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument()
    expect(screen.getByText('Notebook')).toBeInTheDocument()
  })
})
