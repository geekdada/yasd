/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import tw from 'twin.macro'
import React, { useState } from 'react'
import useSWR from 'swr'

import { DataGroup, DataRow, DataRowMain } from '../../components/Data'
import PageTitle from '../../components/PageTitle'
import { ConnectorTraffic, Traffic } from '../../types'
import fetcher from '../../utils/fetcher'
import TrafficDataRow from './components/TrafficDataRow'

dayjs.extend(relativeTime)

const TrafficWrapper = styled.div`
  ${tw`px-4`}
`

const Page: React.FC = () => {
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
    <div tw={'relative pb-5'}>
      <PageTitle
        title="Requests"
        hasAutoRefresh={true}
        defaultAutoRefreshState={false}
        onAuthRefreshStateChange={(newState) => setIsAutoRefresh(newState)}
      />

      {traffic && (
        <TrafficWrapper>
          <DataGroup>
            <DataRow>
              <DataRowMain>
                <div>开启时间</div>
                <div>{dayjs.unix(traffic.startTime).format()}</div>
              </DataRowMain>
            </DataRow>
            <DataRow>
              <DataRowMain>
                <div>启动时长</div>
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
    </div>
  )
}

export default Page
