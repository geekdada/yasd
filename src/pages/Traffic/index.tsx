import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import useSWR from 'swr'
import tw from 'twin.macro'

import { DataGroup, DataRow, DataRowMain } from '../../components/Data'
import PageContainer from '../../components/PageContainer'
import PageTitle from '../../components/PageTitle'
import { ConnectorTraffic, Traffic } from '../../types'
import fetcher from '../../utils/fetcher'

import TrafficDataRow from './components/TrafficDataRow'

dayjs.extend(relativeTime)

const TrafficWrapper = styled.div`
  ${tw`px-4 pt-4`}
`

const Page: React.FC = () => {
  const { t } = useTranslation()
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(false)
  const { data: traffic, error: trafficError } = useSWR<Traffic>(
    '/traffic',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: isAutoRefresh ? 2000 : 0,
    },
  )

  const getSortedTraffic = (
    connector: Traffic['connector'],
  ): Array<ConnectorTraffic & { name: string }> => {
    const result: Array<ConnectorTraffic & { name: string }> = []

    if (!traffic) {
      return result
    }

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
    <PageContainer>
      <PageTitle
        title={t('home.traffic')}
        hasAutoRefresh={true}
        defaultAutoRefreshState={false}
        onAuthRefreshStateChange={(newState) => setIsAutoRefresh(newState)}
      />

      {traffic && (
        <TrafficWrapper>
          <DataGroup>
            <DataRow>
              <DataRowMain>
                <div>{t('traffic.start_time')}</div>
                <div>{dayjs.unix(traffic.startTime).format()}</div>
              </DataRowMain>
            </DataRow>
            <DataRow>
              <DataRowMain>
                <div>{t('traffic.uptime')}</div>
                <div>{dayjs.unix(traffic.startTime).toNow(true)}</div>
              </DataRowMain>
            </DataRow>
          </DataGroup>

          <DataGroup>
            {Object.keys(traffic.interface).map((name) => {
              const data = traffic.interface[name]
              return <TrafficDataRow key={name} name={name} data={data} />
            })}
          </DataGroup>

          <DataGroup>
            {getSortedTraffic(traffic.connector).map((data) => {
              const name = data.name
              return <TrafficDataRow key={name} name={name} data={data} />
            })}
          </DataGroup>
        </TrafficWrapper>
      )}
    </PageContainer>
  )
}

export default Page
