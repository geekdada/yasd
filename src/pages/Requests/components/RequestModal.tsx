/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import bytes from 'bytes'
import dayjs from 'dayjs'
import { basename } from 'path'
import { mutate } from 'swr'
import tw from 'twin.macro'
import { ModalHeader, ModalWrapper } from '@sumup/circuit-ui'
import { Search } from '@sumup/icons'
import React, { KeyboardEvent, MouseEvent } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { toast } from 'react-toastify'
import 'react-tabs/style/react-tabs.css'

import { DataGroup, DataRowMain } from '../../../components/Data'
import { RequestItem } from '../../../types'
import fetcher from '../../../utils/fetcher'
import MethodBadge from './MethodBadge'

const TabsWrapper = styled.div`
  .react-tabs__tab {
    ${tw`text-sm font-medium border-none transition-colors duration-200 ease-in-out`}
  }
  .react-tabs__tab--selected {
    ${tw`text-blue-500 bg-blue-100 border-none`}
  }
  .react-tabs__tab-list {
    ${tw`border-b-2 border-blue-100 mb-4`}
  }
  .react-tabs__tab-panel {
    height: 25rem;
    overflow: auto;
  }
`

interface RequestModalProps {
  req: RequestItem
  onClose: (event: MouseEvent | KeyboardEvent) => void
}

const RequestModal: React.FC<RequestModalProps> = ({ req, onClose }) => {
  const killRequest = (id: number) => {
    fetcher({
      url: '/requests/kill',
      method: 'POST',
      data: {
        id,
      },
    })
      .then(() => {
        toast.success('操作成功')
        return mutate('/requests/recent')
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <ModalWrapper>
      <ModalHeader title={`Detail (#${req.id})`} onClose={onClose} />

      <div tw="mb-3 flex items-center">
        <div
          css={css`
            padding-bottom: 0.25rem;
          `}>
          <MethodBadge
            method={req.method}
            failed={req.failed}
            status={req.status}
          />
        </div>
        <div tw="truncate text-base font-medium flex-1 ml-1">{req.URL}</div>
      </div>

      <TabsWrapper>
        <Tabs>
          <TabList>
            <Tab>General</Tab>
            <Tab>Request</Tab>
            <Tab>计时</Tab>
          </TabList>

          <TabPanel>
            <DataGroup>
              <DataRowMain tw="text-sm">
                <div>日期</div>
                <div>{dayjs.unix(req.startDate).format('L LTS')}</div>
              </DataRowMain>
              <DataRowMain tw="text-sm">
                <div>状态</div>
                <div>{req.status}</div>
              </DataRowMain>
              {req.completed === 1 && (
                <DataRowMain tw="text-sm">
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
                <DataRowMain tw="text-sm">
                  <div>进程</div>
                  <div>
                    {trimPath(req.processPath)}({req.pid})
                  </div>
                </DataRowMain>
              )}
            </DataGroup>

            <DataGroup>
              <DataRowMain tw="text-sm">
                <div>策略</div>
                <div>{req.policyName}</div>
              </DataRowMain>
              <DataRowMain tw="text-sm">
                <div>规则</div>
                <div>{req.rule}</div>
              </DataRowMain>
            </DataGroup>

            {!!req.localAddress && !!req.remoteAddress && (
              <DataGroup title="IP 地址">
                <DataRowMain tw="text-sm">
                  <div>本地 IP 地址</div>
                  <div>{req.localAddress}</div>
                </DataRowMain>
                <DataRowMain tw="text-sm">
                  <div>远端 IP 地址</div>
                  <div>
                    <a
                      href={`https://ip.sb/ip/${req.remoteAddress}`}
                      target="_blank"
                      rel="noreferrer noopener">
                      <Search
                        tw="inline mr-1 w-3 h-3"
                        css={css`
                          margin-bottom: 2px;
                        `}
                      />
                      {req.remoteAddress}
                    </a>
                  </div>
                </DataRowMain>
              </DataGroup>
            )}

            <DataGroup title="流量">
              <DataRowMain tw="text-sm">
                <div>下载</div>
                <div>{bytes(req.inBytes)}</div>
              </DataRowMain>
              <DataRowMain tw="text-sm">
                <div>上传</div>
                <div>{bytes(req.outBytes)}</div>
              </DataRowMain>
            </DataGroup>

            <DataGroup title="备注">
              <pre
                tw="font-mono text-xs text-gray-600 leading-tight p-3 whitespace-pre-wrap break-words"
                css={css`
                  min-height: 7rem;
                `}>
                {req.notes && req.notes.join('\n')}
              </pre>
            </DataGroup>

            {req.completed === 0 && (
              <DataGroup title="Action">
                <div
                  tw="text-red-500 p-3 cursor-pointer hover:bg-gray-200"
                  onClick={() => killRequest(req.id)}>
                  Kill Connection...
                </div>
              </DataGroup>
            )}
          </TabPanel>

          <TabPanel>
            <DataGroup title="Request Header">
              <pre
                tw="font-mono text-xs text-gray-600 leading-tight p-3 whitespace-pre-wrap break-words"
                css={css`
                  min-height: 7rem;
                `}>
                {req.requestHeader || ''}
              </pre>
            </DataGroup>
          </TabPanel>
          <TabPanel>
            <DataGroup>
              {req.timingRecords &&
                req.timingRecords.map((item, index) => (
                  <DataRowMain key={index}>
                    <div>{item.name}</div>
                    <div>{item.durationInMillisecond}ms</div>
                  </DataRowMain>
                ))}
            </DataGroup>
          </TabPanel>
        </Tabs>
      </TabsWrapper>
    </ModalWrapper>
  )
}

export default RequestModal

const trimPath = (str: string): string => basename(str)
