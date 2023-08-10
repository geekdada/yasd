import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { List, AutoSizer } from 'react-virtualized'
import { css } from '@emotion/react'
import { ActivityIcon, HistoryIcon } from 'lucide-react'
import { ListRowRenderer } from 'react-virtualized/dist/es/List'
import tw from 'twin.macro'

import FixedFullscreenContainer from '@/components/FixedFullscreenContainer'
import PageTitle from '@/components/PageTitle'
import { Toggle } from '@/components/ui/toggle'
import useRequestsList from '@/pages/Requests/hooks/useRequestsList'
import { RequestItem } from '@/types'

import ListItem from './components/ListItem'
import RequestModal from './components/RequestModal'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Page: React.FC = () => {
  const { t } = useTranslation()

  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(false)
  const [group, setGroup] = useState<'recent' | 'active'>('recent')

  const query = useQuery()
  const sourceIp = useMemo<string | null>(() => query.get('source'), [query])

  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(
    null,
  )

  const { requestList } = useRequestsList({
    isAutoRefreshEnabled: isAutoRefresh,
    sourceIp,
    onlyActive: group === 'active',
  })

  const rowRenderer: ListRowRenderer = useCallback(
    ({
      index, // Index of row within collection
      style, // Style object to be applied to row (to position it)
    }) => {
      if (!requestList) {
        return null
      }

      const req = requestList[index]

      return (
        <div
          key={req.id}
          style={style}
          onClick={() => setSelectedRequest(req)}
          className="flex flex-col justify-center py-2 cursor-pointer hover:bg-gray-100"
          css={css`
            padding-left: calc(env(safe-area-inset-left) + 0.75rem);
            padding-right: calc(env(safe-area-inset-right) + 0.75rem);
          `}
        >
          <ListItem req={req} />
        </div>
      )
    },
    [requestList],
  )

  const toggles = [
    {
      title: t('requests.recent'),
      value: 'recent',
      icon: HistoryIcon,
    } as const,
    {
      title: t('requests.active'),
      value: 'active',
      icon: ActivityIcon,
    } as const,
  ].map((toggle) => (
    <Toggle
      key={toggle.value}
      pressed={group === toggle.value}
      onPressedChange={(pressed) => {
        if (pressed) {
          setGroup(toggle.value)
        }
      }}
    >
      <toggle.icon className="mr-2 h-4 w-4" />
      {toggle.title}
    </Toggle>
  ))

  return (
    <FixedFullscreenContainer>
      <PageTitle
        title={t('home.requests')}
        hasAutoRefresh={true}
        defaultAutoRefreshState={true}
        onAutoRefreshStateChange={(newState) => setIsAutoRefresh(newState)}
      />

      <div className="flex-1">
        {requestList ? (
          requestList.length ? (
            <AutoSizer>
              {({ width, height }) => {
                return (
                  <List
                    width={width}
                    height={height}
                    rowCount={requestList.length}
                    rowHeight={64}
                    rowRenderer={rowRenderer}
                    css={css`
                      outline: none;

                      & > div {
                        ${tw`divide-y divide-gray-200`}
                      }
                    `}
                  />
                )
              }}
            </AutoSizer>
          ) : (
            <div className="h-full flex items-center justify-center text-base text-gray-500">
              {t('common.no_data')}
            </div>
          )
        ) : (
          <div className="h-full flex items-center justify-center text-base text-gray-500">
            {t('common.is_loading')}...
          </div>
        )}
      </div>

      <div className="flex space-x-3 border-t py-2 px-2">{toggles}</div>

      <RequestModal
        req={selectedRequest}
        open={Boolean(selectedRequest)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRequest(null)
          }
        }}
      />
    </FixedFullscreenContainer>
  )
}

export default Page
