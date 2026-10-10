import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { SWRConfig } from 'swr'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { useVersionSupport } from '@/hooks/useVersionSupport'
import { useProfile } from '@/store'
import { GeoIPResult } from '@/types'
import fetcher from '@/utils/fetcher'

import { useGeoIP, useGeoIPSupport } from './geoip'

vi.mock('@/utils/fetcher', () => ({ default: vi.fn() }))
vi.mock('@/store', () => ({ useProfile: vi.fn() }))
vi.mock('@/hooks/useVersionSupport', () => ({ useVersionSupport: vi.fn() }))

const result: GeoIPResult = {
  address: '1.1.1.1',
  country: 'AU',
  asn: 13335,
  organization: 'Cloudflare, Inc.',
  'geoip-db-date': 1759800000,
  'asn-db-date': 1759800000,
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
)

describe('geoip', () => {
  beforeEach(() => {
    vi.mocked(fetcher).mockReset()
    vi.mocked(useProfile).mockReturnValue({ id: 'test' } as never)
    vi.mocked(useVersionSupport).mockReturnValue(true)
  })

  it('requires iOS 5.23.0 or Mac 6.10.0', () => {
    renderHook(() => useGeoIPSupport())

    expect(useVersionSupport).toHaveBeenCalledWith({
      ios: '5.23.0',
      macos: '6.10.0',
    })
  })

  it('looks up a trimmed address', async () => {
    vi.mocked(fetcher).mockResolvedValue(result)

    const { result: hook } = renderHook(() => useGeoIP(' 1.1.1.1 '), {
      wrapper,
    })

    await waitFor(() => expect(hook.current.data).toEqual(result))
    expect(fetcher).toHaveBeenCalledWith({
      url: '/geoip',
      params: { ip: '1.1.1.1' },
    })
  })

  it('looks up again when the address changes', async () => {
    vi.mocked(fetcher).mockImplementation(async (request) => ({
      ...result,
      address: request.params.ip,
    }))
    const { result: hook, rerender } = renderHook(({ ip }) => useGeoIP(ip), {
      wrapper,
      initialProps: { ip: '1.1.1.1' },
    })
    await waitFor(() => expect(hook.current.data?.address).toBe('1.1.1.1'))

    rerender({ ip: '2606:4700::1111' })

    await waitFor(() =>
      expect(hook.current.data?.address).toBe('2606:4700::1111'),
    )
  })

  it.each([undefined, '', '   '])('skips the lookup for %j', async (ip) => {
    const { result: hook } = renderHook(() => useGeoIP(ip), { wrapper })

    await waitFor(() => expect(hook.current.isLoading).toBe(false))
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('skips the lookup on unsupported versions', async () => {
    vi.mocked(useVersionSupport).mockReturnValue(false)

    const { result: hook } = renderHook(() => useGeoIP('1.1.1.1'), {
      wrapper,
    })

    await waitFor(() => expect(hook.current.isLoading).toBe(false))
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('skips the lookup without a selected profile', async () => {
    vi.mocked(useProfile).mockReturnValue(undefined)

    const { result: hook } = renderHook(() => useGeoIP('1.1.1.1'), {
      wrapper,
    })

    await waitFor(() => expect(hook.current.isLoading).toBe(false))
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('does not retry an invalid address', async () => {
    vi.mocked(fetcher).mockRejectedValue(new Error('Bad Request'))

    const { result: hook } = renderHook(() => useGeoIP('not-an-ip'), {
      wrapper,
    })

    await waitFor(() => expect(hook.current.error).toBeTruthy())
    expect(fetcher).toHaveBeenCalledTimes(1)
  })
})
