import { useEffect, useMemo } from 'react'
import useSWR from 'swr'

import { useProfile } from '@/store'
import { RecentRequests } from '@/types'
import fetcher from '@/utils/fetcher'

import { FilterSchema } from '../components/FilterPopover'

import { useRequestListReducer, RequestListActions } from './reducer'

type Props = {
  isAutoRefreshEnabled?: boolean
  sourceIp?: string | null
  onlyActive?: boolean
  filter: FilterSchema
}

const useRequestsList = ({
  isAutoRefreshEnabled,
  sourceIp,
  onlyActive,
  filter,
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
          ? 2000
          : 4000
        : 0,
    },
  )

  const [{ requestList }, dispatch] = useRequestListReducer()
  const filteredRequestList = useMemo(() => {
    if (!requestList) {
      return undefined
    }

    return requestList
      .filter((item) => {
        if (onlyActive) {
          return !item.completed
        }
        return true
      })
      .filter((item) => {
        if (sourceIp) {
          return item.sourceAddress === sourceIp
        }
        return true
      })
      .filter((item) => {
        if (filter.urlFilter) {
          return item.URL.includes(filter.urlFilter)
        }
        return true
      })
  }, [filter.urlFilter, onlyActive, requestList, sourceIp])

  useEffect(() => {
    if (!recentRequests) {
      return
    }

    dispatch({
      type: RequestListActions.LOAD_REQUESTS,
      payload: recentRequests.requests,
    })
  }, [recentRequests, dispatch])

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
