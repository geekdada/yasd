import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { List, AutoSizer, ListRowRenderer } from 'react-virtualized'
import { css } from '@emotion/react'
import { SearchIcon } from 'lucide-react'
import useSWR, { mutate } from 'swr'
import tw from 'twin.macro'

import FixedFullscreenContainer from '@/components/FixedFullscreenContainer'
import HorizontalSafeArea from '@/components/HorizontalSafeArea'
import { ListCell } from '@/components/ListCell'
import PageTitle from '@/components/PageTitle'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Toggle } from '@/components/ui/toggle'
import { DnsResult } from '@/types'
import fetcher from '@/utils/fetcher'
import withProfile from '@/utils/with-profile'

const Page: React.FC = () => {
  const { t } = useTranslation()
  const [group, setGroup] = useState<'dynamic' | 'static'>('dynamic')

  const { data: dnsResult } = useSWR<DnsResult>('/dns', fetcher, {
    revalidateOnFocus: false,
  })
  const list = useMemo(() => {
    if (group === 'dynamic') {
      return dnsResult?.dnsCache ?? []
    }
    return dnsResult?.local ?? []
  }, [dnsResult, group])

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

  const openIpDetail = (ip: string) => {
    window.open(`https://ip.sb/ip/${ip}`, '_blank', 'noopener noreferrer')
  }

  const rowRenderer: ListRowRenderer = useCallback(
    ({
      index, // Index of row within collection
      style, // Style object to be applied to row (to position it)
    }) => {
      if (group === 'dynamic') {
        const record = (list as DnsResult['dnsCache'])[index]

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
                title={t('dns.view_dns')}
                onClick={() => openIpDetail(record.domain)}
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
    [group, list, t],
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
    <FixedFullscreenContainer>
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
                  & > div {
                    ${tw`divide-y`}
                  }
                `}
              />
            )
          }}
        </AutoSizer>
      </div>

      <HorizontalSafeArea className="flex divide-x border-t py-2 px-2">
        <ButtonGroup className="px-3">{toggles}</ButtonGroup>

        <div className="flex items-center px-3">
          <Button variant="outline" onClick={() => flushDns()}>
            {t('dns.flush_dns')}
          </Button>
        </div>
      </HorizontalSafeArea>
    </FixedFullscreenContainer>
  )
}

export default withProfile(Page)
