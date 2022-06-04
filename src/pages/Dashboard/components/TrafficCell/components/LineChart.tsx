/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import Chart, { ChartPoint } from 'chart.js'
import dayjs from 'dayjs'
import tw from 'twin.macro'
import set from 'lodash-es/set'
import get from 'lodash-es/get'
import React, { useEffect, useRef, useState } from 'react'

import { chartStyles, commonChartOptions } from '../chart-config'
import { REFRESH_RATE } from '../index'

const CHART_SIZE = 30

interface LineChartProps {
  id?: string
  newDatasets: Array<{ data: ChartPoint[]; label: string }>
}

const LineChart: React.FC<LineChartProps> = (props) => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [chart, setChart] = useState<Chart>()

  useEffect(() => {
    if (!chartRef.current) return

    const c = new Chart(chartRef.current, {
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
    })

    setChart(c)

    return () => {
      if (c) {
        c.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (chart) {
      props.newDatasets.forEach((newDataset, idx) => {
        if (chart.data.datasets) {
          const dataset = chart.data.datasets[idx].data as ChartPoint[]

          newDataset.data.forEach((newCp) => {
            if (dataset.findIndex((cp) => cp.x === newCp.x) < 0) {
              dataset.push(newCp)
            }
          })

          if (dataset.length >= CHART_SIZE) {
            set(
              chart,
              'config.options.scales.xAxes[0].ticks.min',
              get(
                chart,
                `data.datasets[${idx}].data[${dataset.length - CHART_SIZE}].x`,
              ),
            )
          }

          if (dataset.length >= CHART_SIZE * 2) {
            dataset.splice(0, 20)
          }
        }
      })

      chart.update()
    }
  }, [chart, props.newDatasets])

  return <canvas ref={chartRef} id={props.id} height={200} />
}

function getInitialData(): ChartPoint[] {
  const result = []

  for (let i = 0; i < CHART_SIZE; i++) {
    const time = dayjs()
      .subtract((CHART_SIZE - i) * REFRESH_RATE, 'millisecond')
      .toDate()

    result.push({ x: time, y: 0 })
  }

  return result
}

export default LineChart
