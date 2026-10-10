import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { toast } from 'sonner'
import { SWRConfig } from 'swr'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import fetcher from '@/utils/fetcher'

import { Component } from './index'

vi.mock('@/utils/fetcher', () => ({ default: vi.fn() }))
vi.mock('@/store', () => ({ useProfile: () => ({ id: 'test' }) }))
vi.mock('@/components/BackButton', () => ({ default: () => null }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const renderPage = () =>
  render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <Component />
    </SWRConfig>,
  )

describe('modules page', () => {
  beforeEach(() => {
    vi.mocked(fetcher).mockReset()
    vi.mocked(fetcher).mockImplementation(async (request) =>
      request.method === 'POST'
        ? {}
        : { available: ['Alpha', 'Beta'], enabled: ['Beta'] },
    )
  })
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('lists modules with their state', async () => {
    renderPage()

    expect(await screen.findByRole('switch', { name: 'Alpha' })).toHaveProperty(
      'ariaChecked',
      'false',
    )
    expect(screen.getByRole('switch', { name: 'Beta' })).toHaveProperty(
      'ariaChecked',
      'true',
    )
  })

  it('shows only enabled modules', async () => {
    renderPage()
    await screen.findByText('Alpha')

    fireEvent.mouseDown(
      screen.getByRole('tab', { name: 'modules.filter_enabled' }),
    )

    expect(screen.queryByText('Alpha')).toBeNull()
    expect(screen.getByText('Beta')).toBeTruthy()
  })

  it('toggles a module', async () => {
    renderPage()

    fireEvent.click(await screen.findByRole('switch', { name: 'Alpha' }))

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('common.success_interaction'),
    )
    expect(fetcher).toHaveBeenCalledWith({
      url: '/modules',
      method: 'POST',
      data: { Alpha: true },
    })
  })

  it('reports a failed toggle as an error', async () => {
    vi.mocked(fetcher).mockImplementation(async (request) => {
      if (request.method === 'POST') throw new Error('Bad Request')
      return { available: ['Alpha'], enabled: [] }
    })
    renderPage()

    fireEvent.click(await screen.findByRole('switch', { name: 'Alpha' }))

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('common.failed_interaction'),
    )
    expect(toast.success).not.toHaveBeenCalled()
  })
})
