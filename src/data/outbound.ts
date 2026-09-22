import useSWR from 'swr'

import { useProfile } from '@/store'
import fetcher from '@/utils/fetcher'

export type OutboundMode = 'direct' | 'proxy' | 'rule'

export const useOutbound = () => {
  const profile = useProfile()
  return useSWR(
    profile ? ['/outbound', profile.id] : null,
    ([url]) => fetcher<{ mode: OutboundMode }>({ url }),
    { refreshInterval: 5000 },
  )
}
