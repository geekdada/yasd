import bytes from 'bytes'
import { ChartOptions } from 'chart.js'

export const commonChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  responsiveAnimationDuration: 0,
  animation: {
    duration: 500,
  },
  title: {
    display: false,
  },
  legend: {
    display: true,
    position: 'bottom',
    labels: {
      fontColor: '#ccc',
      boxWidth: 20,
    },
  },
  tooltips: {
    enabled: false,
  },
  hover: {
    mode: 'nearest',
    intersect: true,
    animationDuration: 0,
  },
  scales: {
    xAxes: [
      {
        display: false,
        type: 'time',
        distribution: 'series',
        gridLines: {
          display: false,
          drawTicks: false,
        },
        ticks: {
          autoSkip: false,
        },
      },
    ],
    yAxes: [
      {
        display: true,
        gridLines: {
          display: true,
          color: '#c2c2c2',
          borderDash: [3, 6],
          drawBorder: false,
          drawTicks: false,
        },
        ticks: {
          callback(value: number): string {
            return bytes(value, { decimalPlaces: 0 }) + '/s '
          },
          beginAtZero: true,
          maxTicksLimit: 4,
          autoSkip: false,
        },
      },
    ],
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
