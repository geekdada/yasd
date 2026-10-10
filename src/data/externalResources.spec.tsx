import { act, renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { SWRConfig } from 'swr'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { useVersionSupport } from '@/hooks/useVersionSupport'
import { useProfile } from '@/store'
import { ExternalResources } from '@/types'
import fetcher from '@/utils/fetcher'

import {
  ALL_EXTERNAL_RESOURCES,
  useExternalResources,
  useExternalResourcesSupport,
  useUpdateExternalResources,
} from './externalResources'

vi.mock('@/utils/fetcher', () => ({ default: vi.fn() }))
vi.mock('@/store', () => ({ useProfile: vi.fn() }))
vi.mock('@/hooks/useVersionSupport', () => ({ useVersionSupport: vi.fn() }))

const resources: ExternalResources = {
  defines: [
    {
      path: 'https://example.com/ruleset.list',
      type: 'ruleset',
      key: '5d41402abc4b2a76b9719d911017c592',
      local: false,
      ready: true,
      updatedAt: 1759800000,
      updating: false,
      fromModule: null,
    },
  ],
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
)

const useListAndUpdate = () => ({
  list: useExternalResources(),
  update: useUpdateExternalResources(),
})

describe('external resources', () => {
  beforeEach(() => {
    vi.mocked(fetcher).mockReset()
    vi.mocked(useProfile).mockReturnValue({ id: 'test' } as never)
    vi.mocked(useVersionSupport).mockReturnValue(true)
  })

  it('requires iOS 5.23.0 or Mac 6.10.0', () => {
    renderHook(() => useExternalResourcesSupport())

    expect(useVersionSupport).toHaveBeenCalledWith({
      ios: '5.23.0',
      macos: '6.10.0',
    })
  })

  it('lists external resources', async () => {
    vi.mocked(fetcher).mockResolvedValue(resources)

    const { result } = renderHook(() => useExternalResources(), { wrapper })

    await waitFor(() => expect(result.current.data).toEqual(resources))
    expect(fetcher).toHaveBeenCalledWith({ url: '/external_resources' })
  })

  it('polls until no resource is updating', async () => {
    const updating = {
      defines: [{ ...resources.defines[0], updating: true }],
    }
    vi.mocked(fetcher)
      .mockResolvedValueOnce(updating)
      .mockResolvedValue(resources)

    const { result } = renderHook(() => useExternalResources(), { wrapper })

    await waitFor(() => expect(result.current.data).toEqual(resources), {
      timeout: 3000,
    })
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('skips the request on unsupported versions', async () => {
    vi.mocked(useVersionSupport).mockReturnValue(false)

    const { result } = renderHook(() => useExternalResources(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toBeUndefined()
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('skips the request without a selected profile', async () => {
    vi.mocked(useProfile).mockReturnValue(undefined)

    const { result } = renderHook(() => useExternalResources(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('updates a resource and reloads the list', async () => {
    vi.mocked(fetcher).mockImplementation(async (request) =>
      request.method === 'POST' ? { [request.data.key]: 'success' } : resources,
    )
    const { result } = renderHook(() => useListAndUpdate(), { wrapper })
    await waitFor(() => expect(result.current.list.data).toEqual(resources))
    vi.mocked(fetcher).mockClear()

    let response: unknown
    await act(async () => {
      response = await result.current.update.trigger(ALL_EXTERNAL_RESOURCES)
    })

    expect(response).toEqual({ all: 'success' })
    expect(fetcher).toHaveBeenCalledWith({
      url: '/external_resources/update',
      method: 'POST',
      data: { key: 'all' },
      timeout: 60_000,
    })
    await waitFor(() =>
      expect(fetcher).toHaveBeenLastCalledWith({ url: '/external_resources' }),
    )
  })

  it('rejects updates on unsupported versions', async () => {
    vi.mocked(useVersionSupport).mockReturnValue(false)
    const { result } = renderHook(() => useUpdateExternalResources(), {
      wrapper,
    })

    await expect(result.current.trigger('some-key')).rejects.toThrow()
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('keeps the list unchanged when the update fails', async () => {
    vi.mocked(fetcher).mockImplementation(async (request) => {
      if (request.method === 'POST') throw new Error('Bad Request')
      return resources
    })
    const { result } = renderHook(() => useListAndUpdate(), { wrapper })
    await waitFor(() => expect(result.current.list.data).toEqual(resources))
    vi.mocked(fetcher).mockClear()

    await act(async () => {
      await expect(
        result.current.update.trigger('missing-key'),
      ).rejects.toThrow('Bad Request')
    })

    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(result.current.list.data).toEqual(resources)
  })
})
