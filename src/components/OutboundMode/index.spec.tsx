import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { SWRConfig } from 'swr'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import fetcher from '@/utils/fetcher'

import OutboundMode from './index'

vi.mock('@/utils/fetcher', () => ({ default: vi.fn() }))
vi.mock('@/store', () => ({ useProfile: () => ({ id: 'test' }) }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('outbound mode control', () => {
  beforeEach(() => {
    vi.mocked(fetcher).mockReset()
    Element.prototype.scrollIntoView = vi.fn()
  })
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it.each(['direct', 'proxy', 'rule'])(
    'changes to %s and reads the confirmed mode',
    async (mode) => {
      let current = mode === 'rule' ? 'direct' : 'rule'
      vi.mocked(fetcher).mockImplementation(async (request) => {
        if (request.method === 'POST') current = request.data.mode
        return { mode: current }
      })
      render(
        <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
          <OutboundMode />
        </SWRConfig>,
      )
      const control = screen.getByRole('combobox')
      await waitFor(() =>
        expect(control.textContent).toBe(`outbound.${current}`),
      )
      fireEvent.keyDown(control, { key: 'ArrowDown' })
      fireEvent.click(
        await screen.findByRole('option', { name: `outbound.${mode}` }),
      )
      await waitFor(() => expect(control.textContent).toBe(`outbound.${mode}`))
      expect(fetcher).toHaveBeenCalledWith({
        url: '/outbound',
        method: 'POST',
        data: { mode },
      })
      expect(fetcher).toHaveBeenLastCalledWith({ url: '/outbound' })
    },
  )

  it('loads the ip check page only after expanding it', async () => {
    vi.mocked(fetcher).mockResolvedValue({ mode: 'rule' })
    const { container } = render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <OutboundMode />
      </SWRConfig>,
    )
    expect(container.querySelector('iframe')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'outbound.ip_check' }))
    const frame = await screen.findByTitle('outbound.ip_check')
    expect(frame.getAttribute('src')).toBe('https://ip.skk.moe/simple')
  })

  it('remounts the ip check page when refreshed', async () => {
    vi.mocked(fetcher).mockResolvedValue({ mode: 'rule' })
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <OutboundMode />
      </SWRConfig>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'outbound.ip_check' }))
    const frame = await screen.findByTitle('outbound.ip_check')
    fireEvent.click(screen.getByRole('button', { name: 'common.refresh' }))
    expect(screen.getByTitle('outbound.ip_check')).not.toBe(frame)
  })

  it('retains the confirmed mode after a failed change and enables retry', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(fetcher).mockImplementation(async (request) => {
      if (request.method === 'POST') throw new Error('Failed')
      return { mode: 'rule' }
    })
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <OutboundMode />
      </SWRConfig>,
    )
    const control = screen.getByRole('combobox')
    await waitFor(() => expect(control.textContent).toBe('outbound.rule'))
    fireEvent.keyDown(control, { key: 'ArrowDown' })
    fireEvent.click(
      await screen.findByRole('option', { name: 'outbound.proxy' }),
    )
    await waitFor(() =>
      expect(fetcher).toHaveBeenCalledWith({
        url: '/outbound',
        method: 'POST',
        data: { mode: 'proxy' },
      }),
    )
    await waitFor(() => expect(control.hasAttribute('disabled')).toBe(false))
    expect(control.textContent).toBe('outbound.rule')
  })
})
