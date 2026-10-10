import { useEffect, useMemo } from 'react'
import useSWR from 'swr'

import { SorterRules } from '@/pages/Requests/components/SorterPopover'
import {
  activeFilter,
  sorter,
  sourceIpFilter,
  urlFilter,
} from '@/pages/Requests/hooks/filters'
import { useProfile } from '@/store'
import { RecentRequests } from '@/types'
import fetcher from '@/utils/fetcher'

import { FilterSchema } from '../components/FilterPopover'

import { useRequestListReducer, RequestListActions } from './reducer'

const MACOS_REFRESH_INTERVAL = 5000
// iOS and tvOS devices have less headroom, so they poll less often.
const MOBILE_REFRESH_INTERVAL = 10_000

type Props = {
  isAutoRefreshEnabled?: boolean
  sourceIp?: string | null
  onlyActive?: boolean
  filter: FilterSchema
  sortRule: SorterRules
}

const useRequestsList = ({
  isAutoRefreshEnabled,
  sourceIp,
  onlyActive,
  filter,
  sortRule,
}: Props) => {
  const profile = useProfile()

  const { data: recentRequests } = useSWR<RecentRequests>(
    () =>
      profile !== undefined
        ? `/requests/${onlyActive ? 'active' : 'recent'}`
        : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 1000,
      refreshInterval: isAutoRefreshEnabled
        ? profile?.platform === 'macos'
          ? MACOS_REFRESH_INTERVAL
          : MOBILE_REFRESH_INTERVAL
        : 0,
    },
  )

  const [{ requestList }, dispatch] = useRequestListReducer()

  const filteredRequestList = useMemo(() => {
    if (!requestList) {
      return undefined
    }

    return requestList
      .filter(
        (item) =>
          activeFilter(onlyActive, item) &&
          sourceIpFilter(sourceIp, item) &&
          urlFilter(filter.urlFilter, item),
      )
      .sort((a, b) => sorter(sortRule, a, b))
  }, [filter.urlFilter, onlyActive, requestList, sortRule, sourceIp])

  useEffect(() => {
    if (!recentRequests) {
      return
    }

    dispatch({
      type: RequestListActions.LOAD_REQUESTS,
      payload: recentRequests.requests,
    })
  }, [recentRequests, dispatch])

  return {
    requestList: filteredRequestList,
  }
}

export default useRequestsList
