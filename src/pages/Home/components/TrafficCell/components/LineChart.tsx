import React, { useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import { css } from '@emotion/react'
import {
  Chart,
  TimeSeriesScale,
  Tooltip,
  Legend,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js'
import set from 'lodash-es/set'

import { useTrafficHistory } from '@/store'
import { DataPoint } from '@/types'

import { chartStyles, commonChartOptions } from '../chart-config'
import { CHART_SIZE } from '../constants'

Chart.register(
  TimeSeriesScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
)

const LineChart: React.FC = () => {
  const trafficHistory = useTrafficHistory()
  const chartRef = useRef<Chart<'line'> | null>(null)
  const chartData = useRef<{
    up: DataPoint[]
    down: DataPoint[]
  }>({
    up: [],
    down: [],
  })

  useEffect(() => {
    chartData.current.up = []
    chartData.current.down = []
  }, [])

  useEffect(() => {
    set(
      chartRef,
      'current.config.options.scales.x.min',
      trafficHistory.up[CHART_SIZE].x,
    )

    if (chartData.current.up.length === 0) {
      chartData.current.up = [...trafficHistory.up]
      chartData.current.down = [...trafficHistory.down]
    } else {
      chartData.current.up.unshift(trafficHistory.up[0])
      chartData.current.down.unshift(trafficHistory.down[0])
    }
  }, [trafficHistory])

  return (
    <div
      css={css`
        height: 200px;
      `}
    >
      <Line
        ref={chartRef}
        data={{
          datasets: [
            {
              ...chartStyles.up,
              label: 'Upload',
              data: chartData.current.up,
            },
            {
              ...chartStyles.down,
              label: 'Download',
              data: chartData.current.down,
            },
          ],
        }}
        options={commonChartOptions}
        updateMode="default"
      />
    </div>
  )
}

export default LineChart
