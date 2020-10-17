/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import loadable from '@loadable/component'
import bytes from 'bytes'
import { ChartPoint } from 'chart.js'
import dayjs from 'dayjs'
import useSWR from 'swr'
import tw from 'twin.macro'
import React, { useEffect, useMemo, useState } from 'react'

import { ConnectorTraffic, Traffic } from '../../../../types'
import fetcher from '../../../../utils/fetcher'

const LineChart = loadable(() => import('./components/LineChart'), {
  fallback: (
    <div
      tw="flex items-center justify-center text-sm text-gray-500"
      css={css`
        height: 200px;
      `}>
      Loading...
    </div>
  ),
})

const Cell = styled.div`
  ${tw`px-4 py-3`}
`

const Title = styled.div`
  ${tw`text-xs md:text-sm text-gray-500 leading-relaxed font-medium`}
`

const Data = styled.div`
  ${tw`text-base md:text-lg text-gray-700 leading-normal`}
`

export const REFRESH_RATE = 1000

const Index: React.FC = () => {
  const { data: traffic, error: trafficError } = useSWR<Traffic>(
    '/traffic',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: REFRESH_RATE,
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
        label: 'Up',
        data: trafficDatasets.up,
      },
      {
        label: 'Down',
        data: trafficDatasets.down,
      },
    ]
  }, [trafficDatasets])

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
      aggregation.outCurrentSpeed += conn.outCurrentSpeed
      aggregation.inCurrentSpeed += conn.inCurrentSpeed
    }

    setTrafficDatasets(() => {
      const time = dayjs().toDate()
      const newUps = [{ x: time, y: aggregation.outCurrentSpeed }]
      const newDowns = [{ x: time, y: aggregation.inCurrentSpeed }]

      return {
        up: newUps,
        down: newDowns,
      }
    })
  }, [traffic])

  return (
    <div>
      <div tw="mb-3 w-full overflow-hidden">
        <LineChart id="traffic-chart" newDatasets={newDatasets} />
      </div>
      <div tw="grid grid-cols-3 gap-4 divide-x divide-gray-200 border-solid border border-gray-200 bg-gray-100">
        {activeInterface && (
          <React.Fragment>
            <Cell>
              <Title>Upload</Title>
              <Data>{bytes(activeInterface.outCurrentSpeed)}/s</Data>
            </Cell>
            <Cell>
              <Title>Download</Title>
              <Data>{bytes(activeInterface.inCurrentSpeed)}/s</Data>
            </Cell>
            <Cell>
              <Title>Total</Title>
              <Data>{bytes(activeInterface.in + activeInterface.out)}</Data>
            </Cell>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default Index
