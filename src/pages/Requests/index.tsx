/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import { ModalConsumer, ModalProvider } from '@sumup/circuit-ui'
import { ModalProps } from '@sumup/circuit-ui/dist/cjs/components/Modal/Modal'
import { ListRowRenderer } from 'react-virtualized/dist/es/List'
import tw from 'twin.macro'
import React, { useState, useCallback } from 'react'
import useSWR from 'swr'
import { List, AutoSizer } from 'react-virtualized'
import PageTitle from '../../components/PageTitle'

import { RecentRequests, RequestItem } from '../../types'
import fetcher from '../../utils/fetcher'
import ListItem from './components/ListItem'
import RequestModal from './components/RequestModal'

const Page: React.FC = () => {
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true)
  const { data: requests, error: requestsError } = useSWR<RecentRequests>(
    '/requests/recent',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: isAutoRefresh ? 5000 : 0,
    },
  )

  const openRequestDetail = useCallback(
    (setModal: (modal: ModalProps) => void, req: RequestItem) => {
      console.log(req)
      setModal({
        children({ onClose }) {
          return <RequestModal req={req} onClose={onClose} />
        },
        onClose() {
          // noop
        },
      })
    },
    [],
  )

  const getRowRenderer: (
    setModal: (modal: ModalProps) => void,
  ) => ListRowRenderer = useCallback(
    (setModal) => {
      return ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
      }) => {
        if (requests) {
          const req = requests.requests[index]
          return (
            <div
              key={`${req.id}`}
              style={style}
              onClick={() => openRequestDetail(setModal, req)}
              tw="flex flex-col justify-center py-2 px-3 cursor-pointer hover:bg-gray-100">
              <ListItem req={req} />
            </div>
          )
        } else {
          return null
        }
      }
    },
    [requests, openRequestDetail],
  )

  // useEffect(() => {
  //   if (requests) {
  //     RequestModal.preload()
  //   }
  // }, [requests])

  return (
    <div
      css={css`
        height: 100vh;
        width: 100vw;
      `}>
      <ModalProvider>
        <ModalConsumer>
          {({ setModal }) => {
            return (
              <div tw="w-full h-full flex flex-col">
                <PageTitle
                  title="Requests"
                  hasAutoRefresh={true}
                  defaultAutoRefreshState={true}
                  onAuthRefreshStateChange={(newState) =>
                    setIsAutoRefresh(newState)
                  }
                />

                <div tw="flex-1">
                  <AutoSizer>
                    {({ width, height }) => {
                      if (requests) {
                        return (
                          <List
                            width={width}
                            height={height}
                            rowCount={requests.requests.length}
                            rowHeight={85}
                            rowRenderer={getRowRenderer(setModal)}
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
                      }
                    }}
                  </AutoSizer>
                </div>
              </div>
            )
          }}
        </ModalConsumer>
      </ModalProvider>
    </div>
  )
}

export default Page
