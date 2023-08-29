import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { List, AutoSizer } from 'react-virtualized'
import { css } from '@emotion/react'
import { ActivityIcon, HistoryIcon } from 'lucide-react'
import { ListRowRenderer } from 'react-virtualized/dist/es/List'
import tw from 'twin.macro'

import BottomPanel from '@/components/BottomPanel'
import FixedFullscreenContainer from '@/components/FixedFullscreenContainer'
import { ListCell } from '@/components/ListCell'
import PageTitle from '@/components/PageTitle'
import { Toggle } from '@/components/ui/toggle'
import FilterPopover, {
  FilterSchema,
} from '@/pages/Requests/components/FilterPopover'
import SorterPopover, {
  SorterRules,
} from '@/pages/Requests/components/SorterPopover'
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

  const [filter, setFilter] = useState<FilterSchema>({
    urlFilter: '',
  })
  const [sorter, setSorter] = useState<SorterRules>({
    sortBy: null,
    sortDirection: 'asc',
  })

  const query = useQuery()
  const sourceIp = useMemo<string | null>(() => query.get('source'), [query])

  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(
    null,
  )

  const { requestList } = useRequestsList({
    isAutoRefreshEnabled: isAutoRefresh,
    sourceIp,
    onlyActive: group === 'active',
    filter,
    sortRule: sorter,
  })

  const rowRenderer: ListRowRenderer = useCallback(
    ({
      key, // Unique key within array of rows
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
          key={key}
          className="flex flex-col justify-center py-2"
          onClick={() => setSelectedRequest(req)}
        >
          <ListItem req={req} />
        </ListCell>
      )
    },
    [requestList],
  )

  const onFilterRulesChange = useCallback((filter: FilterSchema) => {
    setFilter(filter)
  }, [])

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
      size="sm"
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
    <FixedFullscreenContainer offsetBottom={false}>
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

      <BottomPanel className="divide-x select-none">
        <div className="space-x-3 mr-3">{toggles}</div>
        <div className="space-x-3">
          <FilterPopover
            className="ml-3"
            filter={filter}
            onFilterRulesChange={onFilterRulesChange}
          />
          <SorterPopover
            sorter={sorter}
            onSorterRulesChange={(sorter) => {
              setSorter(sorter)
            }}
            className="ml-3"
          />
        </div>
      </BottomPanel>

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
