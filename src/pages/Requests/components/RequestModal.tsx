/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import bytes from 'bytes'
import dayjs from 'dayjs'
import { basename } from 'path'
import { useTranslation } from 'react-i18next'
import { mutate } from 'swr'
import tw from 'twin.macro'
import { ModalHeader, ModalWrapper } from '@sumup/circuit-ui'
import { Search } from '@sumup/icons'
import React, { KeyboardEvent, MouseEvent, useCallback } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { toast } from 'react-toastify'
import 'react-tabs/style/react-tabs.css'

import { DataGroup, DataRowMain } from '../../../components/Data'
import { RequestItem } from '../../../types'
import { isFalsy, isTruthy } from '../../../utils'
import fetcher from '../../../utils/fetcher'
import MethodBadge from './MethodBadge'

const TabsWrapper = styled.div`
  .react-tabs__tab {
    ${tw`text-sm font-medium border-none transition-colors duration-200 ease-in-out active:shadow-none active:border-none focus:shadow-none focus:border-none`}
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
  onClose: (event?: MouseEvent | KeyboardEvent) => void
}

const RequestModal: React.FC<RequestModalProps> = ({ req, onClose }) => {
  const { t } = useTranslation()

  const killRequest = useCallback(
    (id: number) => {
      fetcher({
        url: '/requests/kill',
        method: 'POST',
        data: {
          id,
        },
      })
        .then(() => {
          toast.success(t('common.success_interaction'))

          return Promise.all([
            mutate('/requests/recent'),
            mutate('/requests/active'),
          ])
        })
        .catch((err) => {
          toast.error(t('common.failed_interaction'))
          console.error(err)
        })
    },
    [t],
  )

  return (
    <ModalWrapper>
      <ModalHeader title={`Detail (#${req.id})`} onClose={onClose} />

      <div css={[tw`mb-3 flex items-center leading-normal`]}>
        <MethodBadge
          css={css`
            margin-top: 4px;
          `}
          method={req.method}
          failed={req.failed}
          status={req.status}
        />
        <div tw="truncate text-base font-medium flex-1 ml-1">{req.URL}</div>
      </div>

      <TabsWrapper>
        <Tabs>
          <TabList>
            <Tab>{t('requests.general_tab')}</Tab>
            <Tab>{t('requests.request_tab')}</Tab>
            <Tab>{t('requests.timing_tab')}</Tab>
          </TabList>

          <TabPanel>
            <DataGroup>
              <DataRowMain tw="text-sm">
                <div>{t('requests.date')}</div>
                <div>{dayjs.unix(req.startDate).format('L LTS')}</div>
              </DataRowMain>
              <DataRowMain tw="text-sm">
                <div>{t('requests.status')}</div>
                <div>{req.status}</div>
              </DataRowMain>

              {isTruthy(req.completed) && (
                <DataRowMain tw="text-sm">
                  <div>{t('requests.duration')}</div>
                  <div>
                    {dayjs
                      .unix(req.completedDate)
                      .diff(dayjs.unix(req.startDate))}
                    ms
                  </div>
                </DataRowMain>
              )}

              {req.pid !== 0 && req.processPath && (
                <DataRowMain tw="text-sm">
                  <div>{t('requests.process')}</div>
                  <div>
                    {trimPath(req.processPath)}({req.pid})
                  </div>
                </DataRowMain>
              )}
            </DataGroup>

            <DataGroup>
              <DataRowMain tw="text-sm">
                <div>{t('requests.policy_name')}</div>
                <div>{req.policyName}</div>
              </DataRowMain>
              <DataRowMain tw="text-sm">
                <div>{t('requests.rule_name')}</div>
                <div>{req.rule}</div>
              </DataRowMain>
            </DataGroup>

            {!!req.localAddress && !!req.remoteAddress && (
              <DataGroup title={t('requests.ip_addr')}>
                <DataRowMain tw="text-sm">
                  <div>{t('requests.local_ip')}</div>
                  <div>{req.localAddress}</div>
                </DataRowMain>
                <DataRowMain tw="text-sm">
                  <div>{t('requests.remote_ip')}</div>
                  <div>
                    <a
                      href={`https://ip.sb/ip/${req.remoteAddress}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
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

            <DataGroup title={t('requests.traffic')}>
              <DataRowMain tw="text-sm">
                <div>{t('requests.download')}</div>
                <div>{bytes(req.inBytes)}</div>
              </DataRowMain>
              <DataRowMain tw="text-sm">
                <div>{t('requests.upload')}</div>
                <div>{bytes(req.outBytes)}</div>
              </DataRowMain>
            </DataGroup>

            <DataGroup title={t('requests.remark')}>
              <pre
                tw="font-mono text-xs text-gray-600 leading-tight p-3 whitespace-pre-wrap break-words"
                css={css`
                  min-height: 7rem;
                `}
              >
                {req.notes && req.notes.join('\n')}
              </pre>
            </DataGroup>

            {isFalsy(req.completed) && req.method !== 'UDP' && (
              <DataGroup title="Action">
                <div
                  tw="text-red-500 p-3 cursor-pointer hover:bg-gray-200"
                  onClick={() => killRequest(req.id)}
                >
                  {t('requests.kill_connection_button_title')}...
                </div>
              </DataGroup>
            )}
          </TabPanel>

          <TabPanel>
            <DataGroup title={t('requests.request_header_title')}>
              <pre
                tw="font-mono text-xs text-gray-600 leading-tight p-3 whitespace-pre-wrap break-words"
                css={css`
                  min-height: 7rem;
                `}
              >
                {req.requestHeader || ''}
              </pre>
            </DataGroup>
          </TabPanel>
          <TabPanel>
            <DataGroup>
              {req.timingRecords &&
                req.timingRecords.map((item, index) => (
                  <DataRowMain key={index} tw="text-sm">
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
