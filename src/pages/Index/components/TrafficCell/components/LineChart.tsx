import React, { useEffect, useRef, useState } from 'react'
import { Chart } from 'chart.js/auto'
import dayjs from 'dayjs'
// import get from 'lodash-es/get'
// import set from 'lodash-es/set'

import { chartStyles, commonChartOptions } from '../chart-config'
import { REFRESH_RATE, CHART_SIZE } from '../constants'
import { ChartPoint } from '../types'

interface LineChartProps {
  id: string
  newDatasets: Array<{ data: ChartPoint[]; label: string }>
}

const LineChart: React.FC<LineChartProps> = (props) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const [chart, setChart] = useState<Chart | null>(null)

  useEffect(() => {
    let chartInstance: Chart | null = null

    if (chartRef.current) {
      chartInstance = new Chart(chartRef.current, {
        type: 'line',
        options: commonChartOptions,
        data: {
          datasets: [
            {
              ...chartStyles.up,
              label: 'Upload',
              data: getInitialData(),
            },
            {
              ...chartStyles.down,
              label: 'Download',
              data: getInitialData(),
            },
          ],
        },
      }) as Chart

      setChart(chartInstance)
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy()
      }
      setChart(null)
    }
  }, [])

  useEffect(() => {
    if (!chart) {
      return
    }

    props.newDatasets.forEach((newDataset, idx) => {
      if (chart.data.datasets) {
        const dataset = chart.data.datasets[idx].data as ChartPoint[]

        newDataset.data.forEach((newCp) => {
          if (dataset.findIndex((cp) => cp.x === newCp.x) < 0) {
            dataset.unshift(newCp)
          }
          if (dataset.length > CHART_SIZE) {
            dataset.splice(CHART_SIZE, 1)
          }
        })
      }
    })

    try {
      chart.update()
    } catch (err) {
      console.error(err)
    }
  }, [chart, props.newDatasets])

  return <canvas ref={chartRef} id={props.id} height={200} />
}

function getInitialData(): ChartPoint[] {
  const result = []

  for (let i = 0; i < CHART_SIZE; i++) {
    const time = dayjs()
      .subtract(i * REFRESH_RATE, 'millisecond')
      .toDate()

    result.push({ x: time, y: 0 })
  }

  return result
}

export default LineChart
