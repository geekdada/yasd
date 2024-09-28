import React from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import tw from 'twin.macro'

import { DataGroup, DataRow, DataRowMain } from '@/components/Data'
import HorizontalSafeArea from '@/components/HorizontalSafeArea'
import PageTitle from '@/components/PageTitle'
import { useConnectors, useInterfaces, useStartTime } from '@/store'
import { ConnectorTraffic, Traffic } from '@/types'

import TrafficDataRow from './components/TrafficDataRow'

dayjs.extend(relativeTime)

const TrafficWrapper = tw.div`p-4 md:p-5 space-y-4 md:space-y-5`

export const Component: React.FC = () => {
  const { t } = useTranslation()
  const connectors = useConnectors()
  const interfaces = useInterfaces()
  const startTime = useStartTime()

  const getSortedTraffic = (
    connector: Traffic['connector'],
  ): Array<ConnectorTraffic & { name: string }> => {
    const result: Array<ConnectorTraffic & { name: string }> = []

    Object.keys(connector).forEach((name) => {
      result.push({
        name,
        ...connector[name],
      })
    })

    return result.sort((a, b) => {
      return b.in + b.out - (a.in + a.out)
    })
  }

  return (
    <>
      <PageTitle title={t('home.traffic')} />

      <HorizontalSafeArea>
        {startTime && (
          <TrafficWrapper>
            <DataGroup>
              <DataRow>
                <DataRowMain>
                  <div>{t('traffic.start_time')}</div>
                  <div>{dayjs(startTime).format('LLL')}</div>
                </DataRowMain>
              </DataRow>
              <DataRow>
                <DataRowMain>
                  <div>{t('traffic.uptime')}</div>
                  <div className="capitalize">
                    {dayjs(startTime).toNow(true)}
                  </div>
                </DataRowMain>
              </DataRow>
            </DataGroup>

            <DataGroup>
              {Object.keys(interfaces).map((name) => {
                const data = interfaces[name]
                return <TrafficDataRow key={name} name={name} data={data} />
              })}
            </DataGroup>

            <DataGroup>
              {getSortedTraffic(connectors).map((data) => {
                const name = data.name
                return <TrafficDataRow key={name} name={name} data={data} />
              })}
            </DataGroup>
          </TrafficWrapper>
        )}
      </HorizontalSafeArea>
    </>
  )
}

Component.displayName = 'TrafficPage'

export { ErrorBoundary } from '@/components/ErrorBoundary'
