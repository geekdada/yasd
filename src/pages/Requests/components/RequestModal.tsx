/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import bytes from 'bytes'
import dayjs from 'dayjs'
import { basename } from 'path'
import tw from 'twin.macro'
import { ModalHeader, ModalWrapper } from '@sumup/circuit-ui'
import React, { KeyboardEvent, MouseEvent } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

import { DataGroup, DataRow, DataRowMain } from '../../../components/Data'
import { RequestItem } from '../../../types'

const TabsWrapper = styled.div`
  .react-tabs__tab {
    ${tw`text-sm font-medium border-none`}
  }
  .react-tabs__tab--selected {
    ${tw`text-blue-500 bg-blue-100 border-none`}
  }
  .react-tabs__tab-list {
    ${tw`border-b-2 border-blue-100 mb-4`}
  }
  .react-tabs__tab-panel {
    height: 30rem;
    overflow: auto;
  }
`

interface RequestModalProps {
  req: RequestItem
  onClose: (event: MouseEvent | KeyboardEvent) => void
}

const RequestModal: React.FC<RequestModalProps> = ({ req, onClose }) => {
  return (
    <ModalWrapper>
      <ModalHeader title={`Detail (#${req.id})`} onClose={onClose} />

      <div tw="truncate text-base font-medium mb-3">{req.URL}</div>

      <TabsWrapper>
        <Tabs>
          <TabList>
            <Tab>General</Tab>
            <Tab>Request</Tab>
            <Tab>计时</Tab>
          </TabList>

          <TabPanel>
            <DataGroup>
              <DataRow tw="text-sm">
                <DataRowMain>
                  <div>日期</div>
                  <div>{dayjs.unix(req.startDate).format('L LTS')}</div>
                </DataRowMain>
                <DataRowMain>
                  <div>状态</div>
                  <div>{req.status}</div>
                </DataRowMain>
                {req.completed === 1 && (
                  <DataRowMain>
                    <div>时长</div>
                    <div>
                      {dayjs
                        .unix(req.completedDate - req.startDate)
                        .get('millisecond')}
                      ms
                    </div>
                  </DataRowMain>
                )}
                {req.pid !== 0 && req.processPath && (
                  <DataRowMain>
                    <div>进程</div>
                    <div>
                      {trimPath(req.processPath)}({req.pid})
                    </div>
                  </DataRowMain>
                )}
              </DataRow>
            </DataGroup>

            <DataGroup>
              <DataRow tw="text-sm">
                <DataRowMain>
                  <div>策略</div>
                  <div>{req.policyName}</div>
                </DataRowMain>
                <DataRowMain>
                  <div>规则</div>
                  <div>{req.rule}</div>
                </DataRowMain>
              </DataRow>
            </DataGroup>

            <DataGroup title="IP 地址">
              <DataRow tw="text-sm">
                <DataRowMain>
                  <div>本地 IP 地址</div>
                  <div>{req.localAddress}</div>
                </DataRowMain>
                <DataRowMain>
                  <div>远端 IP 地址</div>
                  <div>{req.remoteAddress}</div>
                </DataRowMain>
              </DataRow>
            </DataGroup>

            <DataGroup title="流量">
              <DataRow tw="text-sm">
                <DataRowMain>
                  <div>下载</div>
                  <div>{bytes(req.inBytes)}</div>
                </DataRowMain>
                <DataRowMain>
                  <div>上传</div>
                  <div>{bytes(req.outBytes)}</div>
                </DataRowMain>
              </DataRow>
            </DataGroup>

            <DataGroup title="备注">
              <pre
                tw="font-mono text-xs text-gray-600 leading-tight p-3 whitespace-pre-wrap break-words"
                css={css`
                  min-height: 10rem;
                `}>
                {req.notes && req.notes.join('\n')}
              </pre>
            </DataGroup>
          </TabPanel>

          <TabPanel>
            <DataGroup title="Request Header">
              <pre
                tw="font-mono text-xs text-gray-600 leading-tight p-3 whitespace-pre-wrap break-words"
                css={css`
                  min-height: 10rem;
                `}>
                {req.requestHeader || ''}
              </pre>
            </DataGroup>
          </TabPanel>
          <TabPanel>
            <DataGroup>
              <DataRow tw="text-sm">
                {req.timingRecords &&
                  req.timingRecords.map((item, index) => (
                    <DataRowMain key={index}>
                      <div>{item.name}</div>
                      <div>{item.durationInMillisecond}ms</div>
                    </DataRowMain>
                  ))}
              </DataRow>
            </DataGroup>
          </TabPanel>
        </Tabs>
      </TabsWrapper>
    </ModalWrapper>
  )
}

export default RequestModal

const trimPath = (str: string): string => basename(str)
