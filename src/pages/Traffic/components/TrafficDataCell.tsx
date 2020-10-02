/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import bytes from 'bytes'
import tw from 'twin.macro'
import React, { useState } from 'react'
import { ChevronRight } from '@sumup/icons'
import { Collapse } from 'react-collapse'

import { DataRow, DataRowMain, DataRowSub } from '../../../components/Data'
import { ConnectorTraffic } from '../../../types'

interface TrafficDataCellProps {
  name: string
  data: ConnectorTraffic
}

const TrafficDataCell: React.FC<TrafficDataCellProps> = ({ name, data }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false)

  return (
    <DataRow
      css={css`
        ${tw`cursor-pointer`}
        .ReactCollapse--collapse {
          ${tw`transition-all duration-200 ease-in-out`}
        }
      `}
      key={name}
      onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
      <DataRowMain>
        <div>{name}</div>
        <div tw="flex items-center">
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
        </div>
      </Collapse>
    </DataRow>
  )
}

export default TrafficDataCell
