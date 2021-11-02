/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import bytes from 'bytes'
import tw from 'twin.macro'
import React, { useMemo, useState } from 'react'
import { ChevronRight } from '@sumup/icons'
import { Collapse } from 'react-collapse'

import { DataRow, DataRowMain, DataRowSub } from '../../../components/Data'
import { ConnectorTraffic } from '../../../types'

interface TrafficDataRowProps {
  name: string
  data: ConnectorTraffic
}

const TrafficDataRow: React.FC<TrafficDataRowProps> = ({ name, data }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false)
  const tcpStat = useMemo(() => {
    if (!data.statistics || !data.statistics.length) return

    let total = 0

    data.statistics.forEach((stat) => {
      total += stat.srtt
    })

    return Math.round(total / data.statistics.length)
  }, [data.statistics])

  return (
    <DataRow
      css={css`
        ${tw`cursor-pointer`}
        .ReactCollapse--collapse {
          ${tw`transition-all duration-200 ease-in-out`}
        }
      `}
      key={name}
      onClick={() => setIsDetailsOpen(!isDetailsOpen)}
    >
      <DataRowMain>
        <div tw="truncate flex-1 text-sm lg:text-base">{name}</div>
        <div tw="flex items-center ml-3 text-sm lg:text-base">
          <div>总计 {bytes(data.in + data.out)}</div>
          <ChevronRight
            css={[
              tw`ml-2 w-5 h-5 transition-transform duration-200 ease-in-out`,
              isDetailsOpen && tw`transform rotate-90`,
            ]}
          />
        </div>
      </DataRowMain>
      <Collapse isOpened={isDetailsOpen}>
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
              上传: {bytes(data.outMaxSpeed)}/s 下载: {bytes(data.inMaxSpeed)}/s
            </div>
          </DataRowSub>
          {!!tcpStat && (
            <DataRowSub>
              <div>TCP 统计</div>
              <div>Avg. RTT {tcpStat}ms</div>
            </DataRowSub>
          )}
        </div>
      </Collapse>
    </DataRow>
  )
}

export default TrafficDataRow
