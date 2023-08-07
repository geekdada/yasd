import { useEffect } from 'react'
import useSWR from 'swr'

import { TrafficActions, useProfile, useTrafficDispatch } from '@/models'
import { ConnectorTraffic, Traffic } from '@/types'
import fetcher from '@/utils/fetcher'

import { REFRESH_RATE } from './constants'

const useTrafficUpdater = () => {
  const profile = useProfile()
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
      refreshInterval: REFRESH_RATE,
      dedupingInterval: REFRESH_RATE,
    },
  )
  const dispatchTrafficAction = useTrafficDispatch()

  useEffect(() => {
    if (!traffic) return undefined

    const now = Date.now()

    dispatchTrafficAction({
      type: TrafficActions.UpdateConnector,
      payload: traffic.connector,
    })

    dispatchTrafficAction({
      type: TrafficActions.UpdateInterface,
      payload: traffic.interface,
    })

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

    dispatchTrafficAction({
      type: TrafficActions.UpdateHistory,
      payload: {
        up: {
          x: now,
          y: aggregation.outCurrentSpeed,
        },
        down: {
          x: now,
          y: aggregation.inCurrentSpeed,
        },
      },
    })
  }, [dispatchTrafficAction, traffic])

  return undefined
}

export default useTrafficUpdater
