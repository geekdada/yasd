import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import dayjs from 'dayjs'

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

  useEffect(() => {
    if (profile === undefined) return

    const fetchTraffic = () => {
      fetcher<Traffic & { nowTime: number }>({ url: '/traffic' }).then(
        (res) => {
          res.nowTime = Date.now()
          dispatch(trafficActions.updateConnector(res.connector))
          dispatch(trafficActions.updateInterface(res.interface))
          dispatch(
            trafficActions.updateStartTime(
              dayjs.unix(res.startTime).toDate().getTime(),
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

          for (const name in res.interface) {
            const conn = res.interface[name]
            aggregation.in += conn.in
            aggregation.out += conn.out
            aggregation.outCurrentSpeed += conn.outCurrentSpeed
            aggregation.inCurrentSpeed += conn.inCurrentSpeed
          }

          const now = Date.now()
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
        },
      )
    }

    const intervalId = setInterval(() => {
      if (isInForeground) {
        fetchTraffic()
      }
    }, REFRESH_RATE)

    return () => clearInterval(intervalId)
  }, [dispatch, profile, isInForeground])

  return undefined
}

export default useTrafficUpdater
