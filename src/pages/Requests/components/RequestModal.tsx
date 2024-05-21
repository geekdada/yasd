import React, { useCallback, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Search } from '@sumup/icons'
import bytes from 'bytes'
import dayjs from 'dayjs'
import { basename } from 'path-browserify'
import { mutate } from 'swr'
import tw from 'twin.macro'

import CodeContent from '@/components/CodeContent'
import { DataGroup, DataRowMain } from '@/components/Data'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent as TabsContentOriginal,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { RequestItem } from '@/types'
import { isFalsy, isTruthy, onlyIP } from '@/utils'
import fetcher from '@/utils/fetcher'

import MethodBadge from './MethodBadge'

const TabsContent = styled(TabsContentOriginal)`
  ${tw`overflow-auto  h-[25rem] xl:h-[40rem]`}
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

  const pureIP = useMemo(
    () => req?.remoteAddress && onlyIP(req.remoteAddress),
    [req?.remoteAddress],
  )

  const content = req ? (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center justify-center gap-2">
          <MethodBadge
            method={req.method}
            failed={req.failed}
            status={req.status || ''}
          />
          <span>{`Detail (#${req.id})`}</span>
        </DialogTitle>
      </DialogHeader>

      <div className="leading-normal w-full overflow-hidden">
        <span className="break-words">{req.URL}</span>
      </div>

      <div>
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3 mb-5">
            <TabsTrigger value="general">
              {t('requests.general_tab')}
            </TabsTrigger>
            <TabsTrigger value="request">
              {t('requests.request_tab')}
            </TabsTrigger>
            <TabsTrigger value="timing">{t('requests.timing_tab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-4">
              <DataGroup responsiveTitle={false}>
                <DataRowMain responsiveFont={false}>
                  <div>{t('requests.date')}</div>
                  <div>{dayjs.unix(req.startDate).format('LLL')}</div>
                </DataRowMain>
                <DataRowMain responsiveFont={false}>
                  <div>{t('requests.status')}</div>
                  <div>{req.status}</div>
                </DataRowMain>

                {isTruthy(req.completed) && (
                  <DataRowMain responsiveFont={false}>
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
                  <DataRowMain responsiveFont={false}>
                    <div>{t('requests.process')}</div>
                    <div>
                      {trimPath(req.processPath)}({req.pid})
                    </div>
                  </DataRowMain>
                )}
              </DataGroup>

              <DataGroup responsiveTitle={false}>
                <DataRowMain responsiveFont={false}>
                  <div>{t('requests.policy_name')}</div>
                  <div>{req.policyName}</div>
                </DataRowMain>
                <DataRowMain responsiveFont={false}>
                  <div>{t('requests.rule_name')}</div>
                  <div>{req.rule}</div>
                </DataRowMain>
              </DataGroup>

              {!!req.localAddress && !!req.remoteAddress && (
                <DataGroup
                  responsiveTitle={false}
                  title={t('requests.ip_addr')}
                >
                  <DataRowMain responsiveFont={false}>
                    <div>{t('requests.local_ip')}</div>
                    <div>{req.localAddress}</div>
                  </DataRowMain>
                  <DataRowMain responsiveFont={false}>
                    <div>{t('requests.remote_ip')}</div>
                    <div>
                      <a
                        href={`https://ip.sb/ip/${pureIP}`}
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

              <DataGroup responsiveTitle={false} title={t('requests.traffic')}>
                <DataRowMain responsiveFont={false}>
                  <div>{t('requests.download')}</div>
                  <div>{bytes(req.inBytes)}</div>
                </DataRowMain>
                <DataRowMain responsiveFont={false}>
                  <div>{t('requests.upload')}</div>
                  <div>{bytes(req.outBytes)}</div>
                </DataRowMain>
              </DataGroup>

              <DataGroup responsiveTitle={false} title={t('requests.remark')}>
                <CodeContent content={req.notes && req.notes.join('\n')} />
              </DataGroup>

              {isFalsy(req.completed) && req.method !== 'UDP' && (
                <DataGroup responsiveTitle={false} title="Action">
                  <DataRowMain
                    onClick={() => killRequest(req.id)}
                    destructive
                    hideArrow
                  >
                    {t('requests.kill_connection_button_title')}...
                  </DataRowMain>
                </DataGroup>
              )}
            </div>
          </TabsContent>

          <TabsContent value="request">
            <DataGroup
              responsiveTitle={false}
              title={t('requests.request_header_title')}
            >
              <CodeContent content={req.requestHeader || ''} />
            </DataGroup>
          </TabsContent>

          <TabsContent value="timing">
            <DataGroup responsiveTitle={false}>
              {req.timingRecords &&
                req.timingRecords.map((item, index) => (
                  <DataRowMain key={index} responsiveFont={false}>
                    <div>{item.name}</div>
                    <div>{item.durationInMillisecond}ms</div>
                  </DataRowMain>
                ))}
            </DataGroup>
          </TabsContent>
        </Tabs>
      </div>
    </>
  ) : null

  return (
    <Dialog {...props}>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  )
}

export default RequestModal

const trimPath = (str: string): string => basename(str)
