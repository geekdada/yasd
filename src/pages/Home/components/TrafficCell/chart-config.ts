import bytes from 'bytes'
import { ChartOptions } from 'chart.js'

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
    duration: 500,
    easing: 'easeInOutQuad',
  },
  transitions: {
    show: {
      animation: {
        duration: 0,
      },
    },
  },
  scales: {
    x: {
      type: 'timeseries',
      display: false,
      reverse: true,
      ticks: {
        autoSkip: false,
      },
    },
    y: {
      display: true,
      beginAtZero: true,
      grid: {
        display: true,
        color: '#c2c2c2',
        drawTicks: false,
      },
      border: {
        dash: [3, 6],
        display: false,
      },
      ticks: {
        callback(value): string {
          return bytes(value as number, { decimalPlaces: 0 }) + '/s '
        },
        maxTicksLimit: 4,
      },
    },
  },
}

export const chartStyles = {
  up: {
    borderColor: '#27c8ae',
    borderWidth: 2,
    lineTension: 0.3,
    pointRadius: 0,
    backgroundColor: 'rgba(123, 166, 220, .2)',
  },
  down: {
    borderColor: '#f3a956',
    borderWidth: 2,
    lineTension: 0.3,
    pointRadius: 0,
    backgroundColor: 'rgba(243, 169, 86, .2)',
  },
}
