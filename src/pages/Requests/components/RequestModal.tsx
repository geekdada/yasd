import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { toast } from 'react-toastify'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Search } from '@sumup/icons'
import bytes from 'bytes'
import dayjs from 'dayjs'
import { basename } from 'path-browserify'
import { mutate } from 'swr'
import tw from 'twin.macro'

import 'react-tabs/style/react-tabs.css'

import { DataGroup, DataRowMain } from '@/components/Data'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RequestItem } from '@/types'
import { isFalsy, isTruthy } from '@/utils'
import fetcher from '@/utils/fetcher'

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

type RequestModalProps = {
  req: RequestItem | null
} & Omit<React.ComponentPropsWithoutRef<typeof Dialog>, 'children'>

const RequestModal: React.FC<RequestModalProps> = ({ req, ...props }) => {
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

  if (!req) return null

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Detail (#${req.id})`}</DialogTitle>
        </DialogHeader>

        <div css={[tw`mb-3 flex items-center leading-normal`]}>
          <MethodBadge
            css={css`
              margin-top: 4px;
            `}
            method={req.method}
            failed={req.failed}
            status={req.status}
          />
          <div className="truncate text-base font-medium flex-1 ml-1">
            {req.URL}
          </div>
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
                <DataRowMain className="text-sm">
                  <div>{t('requests.date')}</div>
                  <div>{dayjs.unix(req.startDate).format('L LTS')}</div>
                </DataRowMain>
                <DataRowMain className="text-sm">
                  <div>{t('requests.status')}</div>
                  <div>{req.status}</div>
                </DataRowMain>

                {isTruthy(req.completed) && (
                  <DataRowMain className="text-sm">
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
                  <DataRowMain className="text-sm">
                    <div>{t('requests.process')}</div>
                    <div>
                      {trimPath(req.processPath)}({req.pid})
                    </div>
                  </DataRowMain>
                )}
              </DataGroup>

              <DataGroup>
                <DataRowMain className="text-sm">
                  <div>{t('requests.policy_name')}</div>
                  <div>{req.policyName}</div>
                </DataRowMain>
                <DataRowMain className="text-sm">
                  <div>{t('requests.rule_name')}</div>
                  <div>{req.rule}</div>
                </DataRowMain>
              </DataGroup>

              {!!req.localAddress && !!req.remoteAddress && (
                <DataGroup title={t('requests.ip_addr')}>
                  <DataRowMain className="text-sm">
                    <div>{t('requests.local_ip')}</div>
                    <div>{req.localAddress}</div>
                  </DataRowMain>
                  <DataRowMain className="text-sm">
                    <div>{t('requests.remote_ip')}</div>
                    <div>
                      <a
                        href={`https://ip.sb/ip/${req.remoteAddress}`}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <Search
                          className="inline mr-1 w-3 h-3"
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
                <DataRowMain className="text-sm">
                  <div>{t('requests.download')}</div>
                  <div>{bytes(req.inBytes)}</div>
                </DataRowMain>
                <DataRowMain className="text-sm">
                  <div>{t('requests.upload')}</div>
                  <div>{bytes(req.outBytes)}</div>
                </DataRowMain>
              </DataGroup>

              <DataGroup title={t('requests.remark')}>
                <pre
                  className="font-mono text-xs text-gray-600 leading-tight p-3 whitespace-pre-wrap break-words"
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
                    className="text-red-500 p-3 cursor-pointer hover:bg-gray-200"
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
                  className="font-mono text-xs text-gray-600 leading-tight p-3 whitespace-pre-wrap break-words"
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
                    <DataRowMain key={index} className="text-sm">
                      <div>{item.name}</div>
                      <div>{item.durationInMillisecond}ms</div>
                    </DataRowMain>
                  ))}
              </DataGroup>
            </TabPanel>
          </Tabs>
        </TabsWrapper>
      </DialogContent>
    </Dialog>
  )
}

export default RequestModal

const trimPath = (str: string): string => basename(str)
