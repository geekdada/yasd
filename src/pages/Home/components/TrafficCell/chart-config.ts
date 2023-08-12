import bytes from 'bytes'
import { ChartOptions } from 'chart.js'

import { REFRESH_RATE } from '@/hooks/useTrafficUpdater'

import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm'

export const commonChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: '#ccc',
        boxWidth: 20,
      },
    },
    tooltip: {
      enabled: false,
    },
  },
  hover: {
    mode: 'nearest',
    intersect: true,
  },
  animation: {
    duration: 400,
  },
  scales: {
    x: {
      type: 'timeseries',
      display: false,
      reverse: false,
      ticks: {
        autoSkip: false,
      },
    },
    y: {
      display: true,
      beginAtZero: true,
      grid: {
        display: true,
        color: 'hsl(0, 0%, 84%)',
        drawTicks: false,
      },
      position: 'right',
      border: {
        dash: [3, 6],
        display: false,
      },
      ticks: {
        callback(value): string {
          return (
            bytes(value as number, { decimalPlaces: 0, unitSeparator: ' ' }) +
            '/s '
          )
        },
        maxTicksLimit: 4,
      },
    },
  },
}

export const chartStyles = {
  up: {
    borderColor: '#8250ff',
    borderWidth: 2,
    lineTension: 0.3,
    pointRadius: 0,
    backgroundColor: 'hsl(280, 75%, 98%)',
  },
  down: {
    borderColor: '#06b5f4',
    borderWidth: 2,
    lineTension: 0.3,
    pointRadius: 0,
    backgroundColor: 'hsl(210, 100%, 98%)',
  },
}
