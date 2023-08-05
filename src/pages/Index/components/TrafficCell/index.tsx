import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import loadable from '@loadable/component'
import bytes from 'bytes'
import { ChartPoint } from 'chart.js'
import useSWR from 'swr'
import tw from 'twin.macro'

import { useProfile } from '@/models/profile'
import { ConnectorTraffic, Traffic } from '@/types'
import fetcher from '@/utils/fetcher'

const LineChart = lazy(() => import('./components/LineChart'))
const Cell = tw.div`px-4 py-3`
const Title = tw.div`text-xs md:text-sm text-gray-500 leading-relaxed font-medium`
const Data = tw.div`text-base md:text-lg text-gray-700 leading-normal`
const LineChartLoader = () => (
  <div
    className="flex items-center justify-center text-sm text-gray-500"
    css={css`
      height: 200px;
    `}
  >
    Loading...
  </div>
)

export const REFRESH_RATE = 1000

const Index: React.FC = () => {
  const { t } = useTranslation()
  const profile = useProfile()
  const { data: traffic, error: trafficError } = useSWR(
    profile !== undefined ? '/traffic' : null,
    (url) =>
      fetcher<Traffic & { nowTime: number }>(url).then((res) => {
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
  const [trafficDatasets, setTrafficDatasets] = useState<{
    up: Array<ChartPoint>
    down: Array<ChartPoint>
  }>({
    up: [],
    down: [],
  })

  const newDatasets = useMemo(() => {
    return [
      {
        label: 'Upload',
        data: trafficDatasets.up,
      },
      {
        label: 'Download',
        data: trafficDatasets.down,
      },
    ]
  }, [trafficDatasets.down, trafficDatasets.up])

  const activeInterface = useMemo(() => {
    if (!traffic) return undefined

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

    return aggregation
  }, [traffic])

  // Build datasets for chart
  useEffect(() => {
    if (!activeInterface) return undefined

    setTrafficDatasets(() => {
      const time = new Date()
      const newUps = [{ x: time, y: activeInterface.outCurrentSpeed }]
      const newDowns = [{ x: time, y: activeInterface.inCurrentSpeed }]

      return {
        up: newUps,
        down: newDowns,
      }
    })
  }, [activeInterface])

  return (
    <div>
      <div className="mb-3 w-full overflow-hidden">
        <Suspense fallback={<LineChartLoader />}>
          <LineChart id="traffic-chart" newDatasets={newDatasets} />
        </Suspense>
      </div>

      {activeInterface ? (
        <div className="grid grid-cols-3 gap-4 divide-x divide-gray-200 border-solid border border-gray-200 bg-gray-100">
          <Cell>
            <Title>{t('traffic_cell.upload')}</Title>
            <Data>{bytes(activeInterface.outCurrentSpeed)}/s</Data>
          </Cell>
          <Cell>
            <Title>{t('traffic_cell.download')}</Title>
            <Data>{bytes(activeInterface.inCurrentSpeed)}/s</Data>
          </Cell>
          <Cell>
            <Title>{t('traffic_cell.total')}</Title>
            <Data>{bytes(activeInterface.in + activeInterface.out)}</Data>
          </Cell>
        </div>
      ) : (
        <div
          className="border border-gray-200 bg-gray-100 text-gray-700"
          css={css`
            height: 67px;
            line-height: 67px;
            text-align: center;
          `}
        >
          {t('common.is_loading')}...
        </div>
      )}
    </div>
  )
}

export default Index
