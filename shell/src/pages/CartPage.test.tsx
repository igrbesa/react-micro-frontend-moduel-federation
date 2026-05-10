import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { bus } from '../../../shared/bus'
import { CART_PRODUCT_PREVIEW_EVENT } from '../../../shared/cartEvents'
import { CartPage } from './CartPage'
import {
  clampFlexRowSplitLeftPct,
  MAX_FLEX_ROW_SPLIT_LEFT_PCT,
  MIN_FLEX_ROW_SPLIT_LEFT_PCT,
} from '../split/useFlexRowSplit'

afterEach(() => {
  vi.restoreAllMocks()
})

function mockSplitRect(width: number, left = 0) {
  const split = screen.getByTestId('shell-cart-split')
  const height = 600
  const top = 0
  vi.spyOn(split, 'getBoundingClientRect').mockReturnValue({
    width,
    height,
    left,
    top,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => {},
  } as DOMRect)
}

describe('clampFlexRowSplitLeftPct', () => {
  it('clamps to min/max bounds', () => {
    expect(clampFlexRowSplitLeftPct(10)).toBe(MIN_FLEX_ROW_SPLIT_LEFT_PCT)
    expect(clampFlexRowSplitLeftPct(90)).toBe(MAX_FLEX_ROW_SPLIT_LEFT_PCT)
    expect(clampFlexRowSplitLeftPct(55)).toBe(55)
  })
})

describe('CartPage splitter', () => {
  it('does not render splitter until preview pane opens', async () => {
    render(<CartPage />)

    expect(screen.queryByTestId('shell-cart-splitter')).not.toBeInTheDocument()

    await waitFor(() => expect(screen.getByTestId('cart-remote-stub')).toBeInTheDocument())

    act(() => {
      bus.emit(CART_PRODUCT_PREVIEW_EVENT, {
        openPreviewPane: true,
        previewRemote: 'products',
        previewContext: { productId: '1' },
      })
    })

    await waitFor(() => expect(screen.getByTestId('shell-cart-splitter')).toBeInTheDocument())
    await waitFor(() => expect(screen.getByTestId('products-remote-stub')).toBeInTheDocument())
  })

  it('updates split ratio on drag and clamps to bounds', async () => {
    render(<CartPage />)

    await waitFor(() => expect(screen.getByTestId('cart-remote-stub')).toBeInTheDocument())

    act(() => {
      bus.emit(CART_PRODUCT_PREVIEW_EVENT, {
        openPreviewPane: true,
        previewRemote: 'products',
        previewContext: { productId: '1' },
      })
    })

    await waitFor(() => expect(screen.getByTestId('shell-cart-splitter')).toBeInTheDocument())

    const split = screen.getByTestId('shell-cart-split')
    const splitter = screen.getByTestId('shell-cart-splitter')
    mockSplitRect(1000, 0)

    fireEvent.pointerDown(splitter, { pointerId: 1, clientX: 500, button: 0, buttons: 1 })
    fireEvent.pointerMove(splitter, { pointerId: 1, clientX: 50, buttons: 1 })
    fireEvent.pointerUp(splitter, { pointerId: 1, clientX: 50 })

    await waitFor(() => {
      expect(split).toHaveStyle({ '--shell-cart-left-pct': `${MIN_FLEX_ROW_SPLIT_LEFT_PCT}` })
    })

    fireEvent.pointerDown(splitter, { pointerId: 1, clientX: 400, button: 0, buttons: 1 })
    fireEvent.pointerMove(splitter, { pointerId: 1, clientX: 950, buttons: 1 })
    fireEvent.pointerUp(splitter, { pointerId: 1, clientX: 950 })

    await waitFor(() => {
      expect(split).toHaveStyle({ '--shell-cart-left-pct': `${MAX_FLEX_ROW_SPLIT_LEFT_PCT}` })
    })
  })
})
