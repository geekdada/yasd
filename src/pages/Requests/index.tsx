import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { List, AutoSizer } from 'react-virtualized'
import { css } from '@emotion/react'
import { ActivityIcon, HistoryIcon } from 'lucide-react'
import { ListRowRenderer } from 'react-virtualized/dist/es/List'
import tw from 'twin.macro'

import FixedFullscreenContainer from '@/components/FixedFullscreenContainer'
import ListCell from '@/components/ListCell'
import PageTitle from '@/components/PageTitle'
import { ButtonGroup } from '@/components/ui/button-group'
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
        <ListCell
          style={style}
          key={req.id}
          className="flex flex-col justify-center py-2"
          onClick={() => setSelectedRequest(req)}
        >
          <ListItem req={req} />
        </ListCell>
      )
    },
    [requestList],
  )

  const toggles = (
    [
      {
        title: t('requests.recent'),
        value: 'recent',
        icon: HistoryIcon,
      },
      {
        title: t('requests.active'),
        value: 'active',
        icon: ActivityIcon,
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
                        ${tw`divide-y divide-gray-200 dark:divide-white/10`}
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

      <ButtonGroup className="border-t py-2 px-2">{toggles}</ButtonGroup>

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
