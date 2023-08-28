import useSWR from 'swr'

import { useVersionSupport } from '@/hooks/useVersionSupport'
import fetcher from '@/utils/fetcher'

export const useCurrentProfile = () =>
  useSWR<{
    name: string
    profile: string
    originalProfile: string
  }>('/profiles/current?sensitive=1', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

export const useAvailableProfiles = () => {
  const isProfileManagementSupport = useVersionSupport({
    macos: '4.0.6',
  })
  return useSWR<{
    profiles: string[]
  }>(isProfileManagementSupport ? '/profiles' : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
}

export const useProfileValidation = (name: string | undefined) => {
  const isProfileManagementSupport = useVersionSupport({
    macos: '4.0.6',
  })
  const resultFetcher = (props: [string, string]) =>
    fetcher<{ error: string | null }>({
      url: props[0],
      method: 'POST',
      data: {
        name: props[1],
      },
    })

  return useSWR(
    isProfileManagementSupport && name ? ['/profiles/check', name] : null,
    resultFetcher,
  )
}
