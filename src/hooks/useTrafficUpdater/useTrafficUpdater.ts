import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import useSWR from 'swr'

import { useAppDispatch, useProfile } from '@/store'
import { trafficActions } from '@/store/slices/traffic'
import { ConnectorTraffic, Traffic } from '@/types'
import fetcher from '@/utils/fetcher'

import { REFRESH_RATE } from './constants'

const useTrafficUpdater = () => {
  const dispatch = useAppDispatch()
  const profile = useProfile()
  const location = useLocation()

  const isInForeground =
    location.pathname === '/traffic' || location.pathname === '/home'
  const { data: traffic } = useSWR(
    profile !== undefined ? '/traffic' : null,
    (url) =>
      fetcher<Traffic & { nowTime: number }>({ url }).then((res) => {
        res.nowTime = Date.now()
        return res
      }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: true,
      refreshInterval: isInForeground ? REFRESH_RATE : 0,
      dedupingInterval: isInForeground ? REFRESH_RATE : 0,
    },
  )

  useEffect(() => {
    if (!traffic) return undefined

    const now = Date.now()

    dispatch(trafficActions.updateConnector(traffic.connector))

    dispatch(trafficActions.updateInterface(traffic.interface))

    dispatch(
      trafficActions.updateStartTime(
        dayjs.unix(traffic.startTime).toDate().getTime(),
      ),
    )

    const aggregation: ConnectorTraffic = {
      outCurrentSpeed: 0,
      in: 0,
      inCurrentSpeed: 0,
      outMaxSpeed: 0,
      out: 0,
      inMaxSpeed: 0,
    }

    for (const name in traffic.interface) {
      const conn = traffic.interface[name]
      aggregation.in += conn.in
      aggregation.out += conn.out
      aggregation.outCurrentSpeed += conn.outCurrentSpeed
      aggregation.inCurrentSpeed += conn.inCurrentSpeed
    }

    dispatch(
      trafficActions.updateHistory({
        up: {
          x: now,
          y: aggregation.outCurrentSpeed,
        },
        down: {
          x: now,
          y: aggregation.inCurrentSpeed,
        },
      }),
    )
  }, [dispatch, traffic])

  return undefined
}

export default useTrafficUpdater
