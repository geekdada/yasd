import { useEffect, useMemo } from 'react'
import useSWR from 'swr'

import { useProfile } from '@/models'
import { RecentRequests } from '@/types'
import fetcher from '@/utils/fetcher'

import { useRequestListReducer, RequestListActions } from './reducer'

type Props = {
  isAutoRefreshEnabled?: boolean
  sourceIp?: string | null
  onlyActive?: boolean
}

const useRequestsList = ({
  isAutoRefreshEnabled,
  sourceIp,
  onlyActive,
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

    if (sourceIp) {
      if (onlyActive) {
        return requestList.filter(
          (item) => item.sourceAddress === sourceIp && !item.completed,
        )
      } else {
        return requestList.filter((item) => item.sourceAddress === sourceIp)
      }
    } else {
      if (onlyActive) {
        return requestList.filter((item) => !item.completed)
      } else {
        return requestList
      }
    }
  }, [onlyActive, requestList, sourceIp])

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
