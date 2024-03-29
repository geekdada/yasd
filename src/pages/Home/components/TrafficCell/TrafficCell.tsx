import React, { lazy, Suspense, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'
import bytes from 'bytes'
import tw from 'twin.macro'

import { useInterfaces } from '@/store'
import { ConnectorTraffic } from '@/types'

const LineChart = lazy(() => import('./components/LineChart'))
const Cell = tw.div`px-4 py-3`
const Title = tw.div`text-xs text-muted-foreground leading-relaxed`
const Data = tw.div`text-base md:text-lg text-gray-700 dark:text-white/90 font-bold leading-normal tabular-nums`

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

const TrafficCell: React.FC = () => {
  const { t } = useTranslation()
  const interfaces = useInterfaces()

  const activeInterface = useMemo(() => {
    const aggregation: ConnectorTraffic = {
      outCurrentSpeed: 0,
      in: 0,
      inCurrentSpeed: 0,
      outMaxSpeed: 0,
      out: 0,
      inMaxSpeed: 0,
    }

    for (const name in interfaces) {
      const conn = interfaces[name]
      aggregation.in += conn.in
      aggregation.out += conn.out
      aggregation.outCurrentSpeed += conn.outCurrentSpeed
      aggregation.inCurrentSpeed += conn.inCurrentSpeed
    }

    return aggregation
  }, [interfaces])

  const betterSpeedString = (speed: number, isCircular: boolean = true) => {
    const readableString = bytes(speed, {
      unitSeparator: '---',
    })
    const [value, unit] = readableString.split('---')

    return (
      <>
        {value}
        <span className="text-sm">{' ' + unit + (isCircular ? '/s' : '')}</span>
      </>
    )
  }

  return (
    <div>
      <div className="mb-3 w-full overflow-hidden">
        <Suspense fallback={<LineChartLoader />}>
          <LineChart />
        </Suspense>
      </div>

      {activeInterface ? (
        <div className="grid grid-cols-3 gap-3 divide-x dark:divide-black/20 border-solid border-t border-b dark:border-gray-900 bg-muted">
          <Cell
            css={css`
              padding-right: 0;
            `}
          >
            <Title>{t('traffic_cell.upload')}</Title>
            <Data className="truncate">
              {betterSpeedString(activeInterface.outCurrentSpeed)}
            </Data>
          </Cell>
          <Cell
            css={css`
              padding-right: 0;
            `}
          >
            <Title>{t('traffic_cell.download')}</Title>
            <Data className="truncate">
              {betterSpeedString(activeInterface.inCurrentSpeed)}
            </Data>
          </Cell>
          <Cell
            css={css`
              padding-right: 0;
            `}
          >
            <Title>{t('traffic_cell.total')}</Title>
            <Data className="truncate">
              {betterSpeedString(
                activeInterface.in + activeInterface.out,
                false,
              )}
            </Data>
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

export default TrafficCell
