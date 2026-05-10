import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { bus } from '../../shared/bus'
import { CART_PRODUCT_PREVIEW_EVENT } from '../../shared/cartEvents'
import ProductsApp from './ProductsApp'

describe('ProductsApp', () => {
  it('shows empty embedded preview Shell mode with no selected product id', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProductsApp embeddedInShellCart embeddedPreviewContext={null} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Product preview' })).toBeInTheDocument()
    expect(screen.getByText(/Select an item in your cart/)).toBeInTheDocument()
  })

  it('shows detail in embedded Shell mode when preview product id is set', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProductsApp embeddedInShellCart embeddedPreviewContext={{ productId: '1' }} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Notebook' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close preview' })).toBeInTheDocument()
  })

  it('emits openPreviewPane false when Close preview in embedded Shell mode', async () => {
    const user = userEvent.setup()
    const emitSpy = vi.spyOn(bus, 'emit')

    render(
      <MemoryRouter initialEntries={['/']}>
        <ProductsApp embeddedInShellCart embeddedPreviewContext={{ productId: '1' }} />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Close preview' }))

    expect(emitSpy).toHaveBeenCalledWith(CART_PRODUCT_PREVIEW_EVENT, {
      openPreviewPane: false,
    })

    emitSpy.mockRestore()
  })

  it('renders catalog when not embedded', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProductsApp />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument()
    expect(screen.getByText('Notebook')).toBeInTheDocument()
  })
})
