import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { useGeoIP, useGeoIPSupport } from '@/data/geoip'

import IpInfoDialog from './IpInfoDialog'

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

const lookups: Record<string, ReturnType<typeof useGeoIP>> = {
  '1.1.1.1': {
    data: {
      address: '1.1.1.1',
      country: 'AU',
      asn: 13335,
      organization: 'Cloudflare, Inc.',
      'geoip-db-date': 1759800000,
      'asn-db-date': 1759800000,
    },
  },
  '192.168.1.1': {
    data: {
      address: '192.168.1.1',
      country: null,
      asn: null,
      organization: null,
      'geoip-db-date': 1759800000,
      'asn-db-date': 1759800000,
    },
  },
  '2606:4700::1111': { error: new Error('Bad Request') },
  '8.8.8.8': { isLoading: true },
} as never

const renderDialog = (addresses: Array<string>) =>
  render(<IpInfoDialog open domain="example.com" addresses={addresses} />)

describe('IP information dialog', () => {
  beforeEach(() => {
    vi.mocked(useGeoIPSupport).mockReturnValue(true)
    vi.mocked(useGeoIP).mockImplementation(
      (ip) => lookups[ip as string] ?? ({} as never),
    )
  })
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('shows the lookup result of each address', () => {
    renderDialog(['1.1.1.1', '192.168.1.1', '2606:4700::1111', '8.8.8.8'])

    expect(screen.getByText('example.com')).toBeTruthy()
    expect(
      screen.getByText('🇦🇺 Australia · AS13335 · Cloudflare, Inc.'),
    ).toBeTruthy()
    expect(screen.getByText('geoip.no_result')).toBeTruthy()
    expect(screen.getByText('geoip.lookup_failed')).toBeTruthy()
    expect(screen.getByText('common.is_loading...')).toBeTruthy()
  })

  it('skips entries that are not IP addresses', () => {
    renderDialog(['alias.example.com', '1.1.1.1'])

    expect(screen.queryByText('alias.example.com')).toBeNull()
    expect(useGeoIP).not.toHaveBeenCalledWith('alias.example.com')
  })

  it('explains when the record has no IP address', () => {
    renderDialog(['alias.example.com'])

    expect(screen.getByText('dns.ip_info.no_address')).toBeTruthy()
  })

  it('asks to upgrade Surge on unsupported versions', () => {
    vi.mocked(useGeoIPSupport).mockReturnValue(false)

    renderDialog(['1.1.1.1'])

    expect(screen.getByText('dns.ip_info.unsupported')).toBeTruthy()
    expect(screen.queryByText('1.1.1.1')).toBeNull()
    expect(useGeoIP).not.toHaveBeenCalled()
  })
})
