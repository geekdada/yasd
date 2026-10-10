import React, { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { List, AutoSizer, ListRowRenderer } from 'react-virtualized'
import { css } from '@emotion/react'
import { SearchIcon } from 'lucide-react'
import useSWR, { mutate } from 'swr'

import BottomPanel from '@/components/BottomPanel'
import { ListCell } from '@/components/ListCell'
import PageTitle from '@/components/PageTitle'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import DnsSearchPopover from './components/DnsSearchPopover'
import IpInfoDialog from './components/IpInfoDialog'
import { DnsResult } from '@/types'
import fetcher from '@/utils/fetcher'
import withProfile from '@/utils/with-profile'

type DnsCacheRecord = DnsResult['dnsCache'][number]

const ComponentBase: React.FC = () => {
  const { t } = useTranslation()
  const [group, setGroup] = useState<'dynamic' | 'static'>('dynamic')
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  // The record outlives the open state so the dialog keeps its content while closing.
  const [ipInfoRecord, setIpInfoRecord] = useState<DnsCacheRecord | null>(null)
  const [isIpInfoOpen, setIsIpInfoOpen] = useState(false)

  const { data: dnsResult } = useSWR<DnsResult>('/dns', fetcher, {
    revalidateOnFocus: false,
  })
  const list = useMemo(() => {
    const items =
      group === 'dynamic'
        ? (dnsResult?.dnsCache ?? [])
        : (dnsResult?.local ?? [])
    if (!deferredSearch) return items
    const keyword = deferredSearch.toLowerCase()
    return items.filter((record) =>
      record.domain?.toLowerCase().includes(keyword),
    )
  }, [dnsResult, group, deferredSearch])

  const flushDns = () => {
    fetcher({
      url: '/dns/flush',
      method: 'POST',
    })
      .then(() => {
        toast.success(t('common.success_interaction'))
        return mutate('/dns')
      })
      .catch((err) => {
        toast.error(t('common.failed_interaction'))
        console.error(err)
      })
  }

  const openIpInfo = useCallback((record: DnsCacheRecord) => {
    setIpInfoRecord(record)
    setIsIpInfoOpen(true)
  }, [])

  const rowRenderer: ListRowRenderer = useCallback(
    ({
      index, // Index of row within collection
      style, // Style object to be applied to row (to position it)
    }) => {
      if (group === 'dynamic') {
        const record = (list as ReadonlyArray<DnsCacheRecord>)[index]

        return (
          <ListCell
            interactive={false}
            key={`dynamic-${record.domain}`}
            style={style}
            className="flex flex-row gap-5 py-1"
          >
            <div className="flex flex-1 flex-col justify-center overflow-hidden">
              <div className="text-sm truncate">{record.domain}</div>
              <div className="text-xs text-gray-700 dark:text-white/70 leading-tight">
                DNS: {record.server}
              </div>
              <div className="text-xs text-gray-700 dark:text-white/70 leading-tight truncate">
                {t('dns.result')}: {record.data.join(', ')}
              </div>
              <div className="text-xs text-gray-700 dark:text-white/70 leading-tight truncate">
                {t('dns.path')}: {record.path}
              </div>
            </div>
            <div className="flex items-center">
              <Button
                title={t('dns.view_ip_info')}
                aria-label={t('dns.view_ip_info')}
                onClick={() => openIpInfo(record)}
                size="icon"
                variant="outline"
              >
                <SearchIcon />
              </Button>
            </div>
          </ListCell>
        )
      } else {
        const record = (list as DnsResult['local'])[index]

        return (
          <ListCell
            interactive={false}
            key={`static-${record.domain}-${record.data}`}
            style={style}
            className="flex flex-row gap-5 py-1"
          >
            <div className="flex flex-1 flex-col justify-center overflow-hidden">
              <div className="text-sm truncate">{record.domain}</div>
              {!!record.server && (
                <div className="text-xs text-gray-700 dark:text-white/70 leading-tight">
                  DNS: {record.server}
                </div>
              )}
              <div className="text-xs text-gray-700 dark:text-white/70 leading-tight">
                {t('dns.result')}: {record.data ?? 'N/A'}
              </div>
              <div className="text-xs text-gray-700 dark:text-white/70 leading-tight">
                {t('dns.source')}: {record.source ?? 'N/A'}
              </div>
              {!!record.comment && (
                <div className="text-xs text-gray-700 dark:text-white/70 leading-tight">
                  {t('dns.comment')}: {record.comment}
                </div>
              )}
            </div>
          </ListCell>
        )
      }
    },
    [group, list, openIpInfo, t],
  )

  const toggles = (
    [
      {
        title: t('dns.dynamic'),
        value: 'dynamic',
      },
      {
        title: t('dns.static'),
        value: 'static',
      },
    ] as const
  ).map((toggle) => (
    <Toggle
      key={toggle.value}
      pressed={group === toggle.value}
      onPressedChange={(pressed) => {
        if (pressed) {
          setGroup(toggle.value)
        }
      }}
    >
      {toggle.title}
    </Toggle>
  ))

  return (
    <>
      <PageTitle title="DNS" />

      <div className="flex-1">
        <AutoSizer>
          {({ width, height }) => {
            return (
              <List
                width={width}
                height={height}
                rowCount={list.length}
                rowHeight={85}
                rowRenderer={rowRenderer}
                style={{
                  outline: 'none',
                }}
                css={css`
                  & > div > :not([hidden]) ~ :not([hidden]) {
                    border-top-width: 1px;
                  }
                `}
              />
            )
          }}
        </AutoSizer>
      </div>

      <BottomPanel className="divide-x select-none">
        <div className="space-x-3 pr-3">{toggles}</div>
        <div className="flex items-center px-3">
          <DnsSearchPopover search={search} onSearchChange={setSearch} />
        </div>
        <div className="flex items-center pl-3">
          <Button variant="outline" size="sm" onClick={() => flushDns()}>
            {t('dns.flush_dns')}
          </Button>
        </div>
      </BottomPanel>

      <IpInfoDialog
        open={isIpInfoOpen}
        onOpenChange={setIsIpInfoOpen}
        domain={ipInfoRecord?.domain ?? ''}
        addresses={ipInfoRecord?.data ?? []}
      />
    </>
  )
}

export const Component = withProfile(ComponentBase)

Component.displayName = 'DnsPage'

export { ErrorBoundary } from '@/components/ErrorBoundary'
