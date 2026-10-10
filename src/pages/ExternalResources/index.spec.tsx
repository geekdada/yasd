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

import { useVersionSupport } from '@/hooks/useVersionSupport'
import { ExternalResources } from '@/types'
import fetcher from '@/utils/fetcher'

import { Component } from './index'

vi.mock('@/utils/fetcher', () => ({ default: vi.fn() }))
vi.mock('@/store', () => ({ useProfile: () => ({ id: 'test' }) }))
vi.mock('@/hooks/useVersionSupport', () => ({ useVersionSupport: vi.fn() }))
vi.mock('@/components/BackButton', () => ({ default: () => null }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: object) =>
      options ? `${key} ${JSON.stringify(options)}` : key,
  }),
}))

const remote = {
  path: 'https://example.com/ruleset.list',
  type: 'ruleset',
  key: 'remote-key',
  local: false,
  ready: true,
  updatedAt: 1759800000,
  updating: false,
  fromModule: null,
} as const

const resources: ExternalResources = {
  defines: [
    remote,
    {
      path: 'local.js',
      type: 'script',
      key: 'local-key',
      local: true,
      ready: false,
      updating: false,
      fromModule: 'My Module',
    },
  ],
}

const renderPage = () =>
  render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <Component />
    </SWRConfig>,
  )

const mockUpdateResponse = (result: Record<string, string>) =>
  vi
    .mocked(fetcher)
    .mockImplementation(async (request) =>
      request.method === 'POST' ? result : resources,
    )

describe('external resources page', () => {
  beforeEach(() => {
    vi.mocked(fetcher).mockReset()
    vi.mocked(useVersionSupport).mockReturnValue(true)
  })
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('groups resources by source and offers updates for remote ones only', async () => {
    mockUpdateResponse({})
    renderPage()

    expect(await screen.findByText('ruleset.list')).toBeTruthy()
    expect(screen.getByTitle(remote.path)).toBeTruthy()
    expect(screen.getByText('external_resources.main_profile')).toBeTruthy()
    expect(screen.getByText('My Module')).toBeTruthy()
    expect(
      screen.getAllByRole('button', { name: 'external_resources.update' }),
    ).toHaveLength(1)
  })

  it('shows only resources that are not ready', async () => {
    mockUpdateResponse({})
    renderPage()
    await screen.findByText('ruleset.list')

    fireEvent.mouseDown(
      screen.getByRole('tab', {
        name: 'external_resources.filter_not_ready',
      }),
    )

    expect(screen.queryByText('ruleset.list')).toBeNull()
    expect(screen.getByTitle('local.js')).toBeTruthy()
    expect(screen.queryByText('external_resources.main_profile')).toBeNull()
  })

  it('updates a single resource', async () => {
    mockUpdateResponse({ [remote.key]: 'success' })
    renderPage()

    fireEvent.click(
      await screen.findByRole('button', { name: 'external_resources.update' }),
    )

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('common.success_interaction'),
    )
    expect(fetcher).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/external_resources/update',
        data: { key: remote.key },
      }),
    )
  })

  it('shows the error message when a single update fails', async () => {
    mockUpdateResponse({ [remote.key]: 'timeout' })
    renderPage()

    fireEvent.click(
      await screen.findByRole('button', { name: 'external_resources.update' }),
    )

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'external_resources.update_failed {"message":"timeout"}',
      ),
    )
  })

  it('updates all resources and reports failures', async () => {
    mockUpdateResponse({ a: 'success', b: 'timeout' })
    renderPage()

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'external_resources.update_all',
      }),
    )

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'external_resources.update_all_failed {"count":1}',
      ),
    )
    expect(fetcher).toHaveBeenCalledWith(
      expect.objectContaining({ data: { key: 'all' } }),
    )
  })

  it('explains when Surge is too old', async () => {
    vi.mocked(useVersionSupport).mockReturnValue(false)
    renderPage()

    expect(
      await screen.findByText('external_resources.unsupported'),
    ).toBeTruthy()
    expect(fetcher).not.toHaveBeenCalled()
  })
})
