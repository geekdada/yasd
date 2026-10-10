import React, { useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import bytes from 'bytes'
import dayjs from 'dayjs'
import { basename } from 'path-browserify'
import { mutate } from 'swr'
import { useMediaQuery } from 'usehooks-ts'

import CodeContent from '@/components/CodeContent'
import { DataGroup, DataRowMain } from '@/components/Data'
import GeoIPSummary from '@/components/GeoIPSummary'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer'
import {
  Tabs,
  TabsContent as TabsContentOriginal,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { BottomSafeArea } from '@/components/VerticalSafeArea'
import { useGeoIPSupport } from '@/data/geoip'
import { RequestItem } from '@/types'
import { isFalsy, isTruthy, onlyIP } from '@/utils'
import fetcher from '@/utils/fetcher'
import { isIPAddress } from '@/utils/geoip'

const TabsContent = TabsContentOriginal

type RequestModalProps = {
  req: RequestItem | null
} & Omit<React.ComponentPropsWithoutRef<typeof Dialog>, 'children'>

const RequestModal: React.FC<RequestModalProps> = ({ req, ...props }) => {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery('(min-width: 768px)')

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

  const isGeoIPSupported = useGeoIPSupport()
  const pureIP = useMemo(
    () => req?.remoteAddress && onlyIP(req.remoteAddress),
    [req?.remoteAddress],
  )

  const content = req ? (
    <>
      <div
        className="flex-1 overflow-hidden flex"
        css={css`
          & > div {
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
        `}
      >
        <Tabs defaultValue="general" className="w-full h-full">
          <TabsList className="grid w-full grid-cols-3 mb-5">
            <TabsTrigger value="general">
              {t('requests.general_tab')}
            </TabsTrigger>
            <TabsTrigger value="request">
              {t('requests.request_tab')}
            </TabsTrigger>
            <TabsTrigger value="timing">{t('requests.timing_tab')}</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-scroll">
            <TabsContent value="general">
              <div className="space-y-4">
                <DataGroup responsiveTitle={false}>
                  <DataRowMain responsiveFont={false}>
                    <div className="break-keep whitespace-nowrap">URL</div>
                    <div className="break-all text-right">{req.URL}</div>
                  </DataRowMain>
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
                      <div className="break-keep whitespace-nowrap">
                        {t('requests.local_ip')}
                      </div>
                      <div className="break-all text-right">
                        {req.localAddress}
                      </div>
                    </DataRowMain>
                    <DataRowMain responsiveFont={false}>
                      <div className="break-keep whitespace-nowrap">
                        {t('requests.remote_ip')}
                      </div>
                      <div className="break-all text-right">
                        {req.remoteAddress}
                      </div>
                    </DataRowMain>
                    {isGeoIPSupported && pureIP && isIPAddress(pureIP) && (
                      <DataRowMain responsiveFont={false}>
                        <div className="break-keep whitespace-nowrap">
                          {t('requests.ip_info')}
                        </div>
                        <div className="break-all text-right">
                          <GeoIPSummary address={pureIP} />
                        </div>
                      </DataRowMain>
                    )}
                  </DataGroup>
                )}

                <DataGroup
                  responsiveTitle={false}
                  title={t('requests.traffic')}
                >
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
          </div>
        </Tabs>
      </div>
    </>
  ) : null

  return isDesktop ? (
    <Dialog {...props}>
      <DialogContent className="h-[90%] sm:max-w-3xl flex flex-col pt-10">
        <VisuallyHidden.Root>
          <DialogTitle>Request {req?.URL}</DialogTitle>
        </VisuallyHidden.Root>
        <div className="pt-4 h-full flex flex-col">{content}</div>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer {...props}>
      <DrawerContent className="flex flex-col px-4 gap-4 h-[90%]">
        <VisuallyHidden.Root>
          <DrawerTitle>Request {req?.URL}</DrawerTitle>
        </VisuallyHidden.Root>
        {content}
        <BottomSafeArea />
      </DrawerContent>
    </Drawer>
  )
}

export default RequestModal

const trimPath = (str: string): string => basename(str)
