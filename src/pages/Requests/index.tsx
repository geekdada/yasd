/** @jsx jsx */
import { jsx } from '@emotion/core'
import css from '@emotion/css/macro'
import { ModalConsumer, useModal } from '@sumup/circuit-ui'
import SelectorGroup from '@sumup/circuit-ui/dist/es/components/SelectorGroup'
import { useTranslation } from 'react-i18next'
import { ListRowRenderer } from 'react-virtualized/dist/es/List'
import tw from 'twin.macro'
import omit from 'lodash-es/omit'
import React, {
  useState,
  useCallback,
  useEffect,
  ChangeEvent,
  useMemo,
} from 'react'
import useSWR from 'swr'
import { List, AutoSizer } from 'react-virtualized'
import { useLocation } from 'react-router-dom'

import FixedFullscreenContainer from '../../components/FixedFullscreenContainer'
import PageTitle from '../../components/PageTitle'
import { useProfile } from '../../models/profile'
import { RecentRequests, RequestItem } from '../../types'
import fetcher from '../../utils/fetcher'
import ListItem from './components/ListItem'
import RequestModal from './components/RequestModal'

const LIST_ITEMS_MAX = 150

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Page: React.FC = () => {
  const { setModal } = useModal()
  const { t } = useTranslation()
  const profile = useProfile()
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true)
  const [group, setGroup] = useState<'recent' | 'active'>('recent')
  const { data: requests, error: requestsError } = useSWR<RecentRequests>(
    () => '/requests/' + group,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 1000,
      refreshInterval: isAutoRefresh
        ? profile?.platform === 'macos'
          ? 1000
          : 4000
        : 0,
    },
  )
  const [requestList, setRequestList] = useState<Array<RequestItem>>([])
  const [activeRequestList, setActiveRequestList] = useState<
    Array<RequestItem>
  >([])
  const currentList = useMemo(
    () => (group === 'recent' ? requestList : activeRequestList),
    [group, requestList, activeRequestList],
  )
  const query = useQuery()
  const sourceIp = useMemo<string | null>(() => query.get('source'), [query])

  useEffect(
    () => {
      if (!requests?.requests) return

      const pendingList = requests.requests
      const now = new Date()
      let newList = [...currentList]

      while (pendingList.length) {
        const request = pendingList.pop() as RequestItem
        const existingIndex = newList.findIndex(
          (item) => item.id === request.id,
        )

        if (existingIndex >= 0) {
          Object.assign(newList[existingIndex], {
            ...omit(request, ['id']),
            lastUpdated: now,
          })
        } else {
          if (newList.length && request.id > newList[0].id) {
            newList.unshift({
              ...request,
              lastUpdated: now,
            })
          } else {
            newList.push({
              ...request,
              lastUpdated: now,
            })
          }
        }
      }

      if (group === 'recent') {
        newList = newList
          .filter((request) => {
            if (sourceIp) {
              return sourceIp === request.localAddress
            }
            return true
          })
          .slice(0, LIST_ITEMS_MAX)
      } else {
        newList = newList
          .filter((request) => {
            if (sourceIp) {
              return (
                request.lastUpdated === now && sourceIp === request.localAddress
              )
            }
            return request.lastUpdated === now
          })
          .sort((a, b) => b.id - a.id)
      }

      if (group === 'recent') {
        setRequestList(newList)
        setActiveRequestList([])
      } else {
        setRequestList([])
        setActiveRequestList(newList)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [requests, group, sourceIp],
  )

  const openRequestDetail = useCallback(
    (req: RequestItem) => {
      setModal({
        children({ onClose }) {
          return onClose ? (
            <RequestModal req={req} onClose={onClose} />
          ) : (
            <React.Fragment />
          )
        },
        onClose() {
          // noop
        },
      })
    },
    [setModal],
  )

  const rowRenderer: ListRowRenderer = useCallback(
    ({
      key, // Unique key within array of rows
      index, // Index of row within collection
      isScrolling, // The List is currently being scrolled
      isVisible, // This row is visible within the List (eg it is not an overscanned row)
      style, // Style object to be applied to row (to position it)
    }) => {
      const req = currentList[index]

      return (
        <div
          key={key}
          style={style}
          onClick={() => openRequestDetail(req)}
          tw="flex flex-col justify-center py-2 cursor-pointer hover:bg-gray-100"
          css={css`
            padding-left: calc(env(safe-area-inset-left) + 0.75rem);
            padding-right: calc(env(safe-area-inset-right) + 0.75rem);
          `}>
          <ListItem req={req} />
        </div>
      )
    },
    [currentList, openRequestDetail],
  )

  return (
    <FixedFullscreenContainer>
      <React.Fragment>
        <PageTitle
          title={t('home.requests')}
          hasAutoRefresh={true}
          defaultAutoRefreshState={true}
          onAuthRefreshStateChange={(newState) => setIsAutoRefresh(newState)}
        />

        <div tw="flex-1">
          {currentList.length ? (
            <AutoSizer>
              {({ width, height }) => {
                return (
                  <List
                    width={width}
                    height={height}
                    rowCount={currentList.length}
                    rowHeight={64}
                    rowRenderer={rowRenderer}
                    style={{
                      outline: 'none',
                    }}
                    css={css`
                      & > div {
                        ${tw`divide-y divide-gray-200`}
                      }
                    `}
                  />
                )
              }}
            </AutoSizer>
          ) : (
            <div tw="h-full flex items-center justify-center text-sm text-gray-500">
              {t('common.is_loading')}...
            </div>
          )}
        </div>

        <div
          css={[
            tw`flex divide-x divide-gray-200 border-t border-solid border-gray-200 py-2 px-2`,
            css`
              & > div {
                ${tw`mx-2`}
              }
              & > div:first-of-type {
                margin-left: 0;
              }
            `,
          ]}>
          <SelectorGroup
            css={[
              tw`flex justify-center items-center`,
              css`
                & label {
                  ${tw`py-2 px-4 ml-2 my-1 text-sm`}
                }
                & label:first-of-type {
                  margin-left: 0;
                }
              `,
            ]}
            label="choose the dns result group"
            name="selector-group"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setGroup(event.target.value as 'recent' | 'active')
            }}
            options={[
              {
                children: t('requests.recent'),
                value: 'recent',
              },
              {
                children: t('requests.active'),
                value: 'active',
              },
            ]}
            value={group}
          />
        </div>
      </React.Fragment>
    </FixedFullscreenContainer>
  )
}

export default Page
