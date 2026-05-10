import userEvent from '@testing-library/user-event'
import { act } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { bus } from '../../shared/bus'
import { CART_ADD_EVENT, CART_PRODUCT_PREVIEW_EVENT } from '../../shared/cartEvents'
import CartApp from './CartApp'

describe('CartApp', () => {
  it('hydrates cart lines from localStorage on mount', () => {
    localStorage.setItem(
      'mfe:cart:lines',
      JSON.stringify([
        {
          id: '2',
          name: 'Pen set',
          qty: 2,
          lineTotal: 17,
        },
      ]),
    )

    render(<CartApp />)

    expect(screen.getByText('Pen set')).toBeInTheDocument()
    expect(screen.getByText(/×2/)).toBeInTheDocument()
    expect(screen.getByText('USD 17.00')).toBeInTheDocument()
  })

  it('updates cart lines when receiving cart:add events', () => {
    render(<CartApp />)

    expect(screen.queryByText('Notebook')).not.toBeInTheDocument()

    act(() => {
      bus.emit(CART_ADD_EVENT, { id: '1', name: 'Notebook', price: 12.99 })
    })

    expect(screen.getByText('Notebook')).toBeInTheDocument()
    expect(screen.getByText(/×1/)).toBeInTheDocument()
    expect(screen.getByText('USD 12.99')).toBeInTheDocument()
  })

  it('emits cart:product-preview when a cart line is clicked', async () => {
    const user = userEvent.setup()
    localStorage.setItem(
      'mfe:cart:lines',
      JSON.stringify([
        {
          id: '2',
          name: 'Pen set',
          qty: 2,
          lineTotal: 17,
        },
      ]),
    )

    const emitSpy = vi.spyOn(bus, 'emit')

    render(<CartApp />)

    await user.click(screen.getByRole('button', { name: /Pen set/i }))

    expect(emitSpy).toHaveBeenCalledWith(CART_PRODUCT_PREVIEW_EVENT, {
      openPreviewPane: true,
      previewRemote: 'products',
      previewContext: { productId: '2' },
    })

    emitSpy.mockRestore()
  })
})
