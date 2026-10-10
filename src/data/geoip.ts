import useSWR from 'swr'

import { useVersionSupport } from '@/hooks/useVersionSupport'
import { useProfile } from '@/store'
import { GeoIPResult } from '@/types'
import fetcher from '@/utils/fetcher'

export const GEOIP_MIN_VERSION = {
  ios: '5.23.0',
  macos: '6.10.0',
}

export const useGeoIPSupport = (): boolean =>
  useVersionSupport(GEOIP_MIN_VERSION)

// Pass an empty or undefined address to skip the lookup.
export const useGeoIP = (ip: string | undefined) => {
  const profile = useProfile()
  const isSupported = useGeoIPSupport()
  const address = ip?.trim()

  return useSWR(
    isSupported && profile && address
      ? (['/geoip', address, profile.id] as const)
      : null,
    ([url, address]) => fetcher<GeoIPResult>({ url, params: { ip: address } }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      // Surge answers an invalid address with 400, which a retry cannot fix.
      shouldRetryOnError: false,
    },
  )
}
