/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import { Heading } from '@sumup/circuit-ui'
import { Spinner } from '@sumup/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import tw from 'twin.macro'
import React, { useState } from 'react'
import useSWR from 'swr'
import bytes from 'bytes'

import { ConnectorTraffic, Traffic } from '../../types'
import fetcher from '../../utils/fetcher'

dayjs.extend(relativeTime)

const TrafficWrapper = styled.div`
  ${tw`px-4`}
`

const DataGroup = styled.div`
  ${tw`divide-y divide-gray-200 bg-gray-100 rounded-lg mb-4`}
`

const DataRow = styled.div``

const DataRowMain = styled.div`
  ${tw`flex items-center justify-between px-3 py-3 leading-normal text-gray-800`}

  & > div:last-of-type {
    ${tw`text-gray-600`}
  }
`

const DataRowSub = styled.div`
  ${tw`flex items-center justify-between px-3 leading-normal text-xs text-gray-800`}

  & > div:last-of-type {
    ${tw`text-gray-600`}
  }
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
      <Heading
        size={'tera'}
        noMargin
        tw="sticky top-0 flex items-center justify-between shadow bg-white z-10 px-3 py-3 mb-4">
        <div>Traffic</div>

        <div
          onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          css={[
            tw`bg-blue-500 text-white cursor-pointer w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ease-in-out `,
            isAutoRefresh && tw`bg-red-400`,
          ]}>
          <Spinner css={[tw`w-6 h-6`, isAutoRefresh && tw`animate-spin`]} />
        </div>
      </Heading>

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
              return (
                <DataRow key={name}>
                  <DataRowMain>
                    <div>{name}</div>
                    <div>总计 {bytes(data.in + data.out)}</div>
                  </DataRowMain>
                  <div tw="pb-3">
                    <DataRowSub>
                      <div>流量</div>
                      <div>
                        上传: {bytes(data.out)} 下载: {bytes(data.in)}
                      </div>
                    </DataRowSub>
                    <DataRowSub>
                      <div>当前速度</div>
                      <div>
                        上传: {bytes(data.outCurrentSpeed)}/s 下载:{' '}
                        {bytes(data.inCurrentSpeed)}/s
                      </div>
                    </DataRowSub>
                    <DataRowSub>
                      <div>最高速度</div>
                      <div>
                        上传: {bytes(data.outMaxSpeed)}/s 下载:{' '}
                        {bytes(data.inMaxSpeed)}/s
                      </div>
                    </DataRowSub>
                  </div>
                </DataRow>
              )
            })}
          </DataGroup>

          <DataGroup>
            {getSortedTraffic(traffic.connector).map((data) => {
              const name = data.name
              return (
                <DataRow key={name}>
                  <DataRowMain>
                    <div>{name}</div>
                    <div>总计 {bytes(data.in + data.out)}</div>
                  </DataRowMain>
                  <div tw="pb-3">
                    <DataRowSub>
                      <div>流量</div>
                      <div>
                        上传: {bytes(data.out)} 下载: {bytes(data.in)}
                      </div>
                    </DataRowSub>
                    <DataRowSub>
                      <div>当前速度</div>
                      <div>
                        上传: {bytes(data.outCurrentSpeed)}/s 下载:{' '}
                        {bytes(data.inCurrentSpeed)}/s
                      </div>
                    </DataRowSub>
                    <DataRowSub>
                      <div>最高速度</div>
                      <div>
                        上传: {bytes(data.outMaxSpeed)}/s 下载:{' '}
                        {bytes(data.inMaxSpeed)}/s
                      </div>
                    </DataRowSub>
                  </div>
                </DataRow>
              )
            })}
          </DataGroup>
        </TrafficWrapper>
      )}
    </div>
  )
}

export default Page
