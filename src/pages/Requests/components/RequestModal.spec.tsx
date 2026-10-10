import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { useGeoIP, useGeoIPSupport } from '@/data/geoip'
import { RequestItem } from '@/types'

import RequestModal from './RequestModal'

vi.mock('@/data/geoip', () => ({
  useGeoIP: vi.fn(),
  useGeoIPSupport: vi.fn(),
}))
vi.mock('usehooks-ts', () => ({ useMediaQuery: () => true }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}))

const request = {
  id: 1,
  URL: 'api.example.com:443',
  method: 'HTTPS',
  status: 'Completed',
  startDate: 1759800000,
  completedDate: 1759800001,
  localAddress: '192.168.1.2',
  remoteAddress: '1.1.1.1 (Proxy)',
  policyName: 'DIRECT',
  rule: 'FINAL',
  inBytes: 1024,
  outBytes: 512,
  completed: 1,
  failed: 0,
} as unknown as RequestItem

describe('request modal remote address', () => {
  beforeEach(() => {
    vi.mocked(useGeoIP).mockReturnValue({
      data: {
        address: '1.1.1.1',
        country: 'AU',
        asn: 13335,
        organization: 'Cloudflare, Inc.',
        'geoip-db-date': 1759800000,
        'asn-db-date': 1759800000,
      },
    } as never)
  })
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('shows the remote address without a lookup link', () => {
    vi.mocked(useGeoIPSupport).mockReturnValue(true)

    render(<RequestModal open req={request} />)

    expect(screen.getByText('1.1.1.1 (Proxy)')).toBeTruthy()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('looks up the bare remote IP when GeoIP is supported', () => {
    vi.mocked(useGeoIPSupport).mockReturnValue(true)

    render(<RequestModal open req={request} />)

    expect(screen.getByText('requests.ip_info')).toBeTruthy()
    expect(
      screen.getByText('🇦🇺 Australia · AS13335 · Cloudflare, Inc.'),
    ).toBeTruthy()
    expect(useGeoIP).toHaveBeenCalledWith('1.1.1.1')
  })

  it('hides the IP information row on unsupported versions', () => {
    vi.mocked(useGeoIPSupport).mockReturnValue(false)

    render(<RequestModal open req={request} />)

    expect(screen.queryByText('requests.ip_info')).toBeNull()
    expect(useGeoIP).not.toHaveBeenCalled()
  })
})
