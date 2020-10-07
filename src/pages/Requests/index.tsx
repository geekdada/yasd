/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import { Heading } from '@sumup/circuit-ui'
import { Spinner } from '@sumup/icons'
import { ListRowRenderer } from 'react-virtualized/dist/es/List'
import tw from 'twin.macro'
import React, { useState } from 'react'
import useSWR from 'swr'
import { List, AutoSizer } from 'react-virtualized'
import dayjs from 'dayjs'

import { RecentRequests } from '../../types'
import fetcher from '../../utils/fetcher'

const RequestsWrapper = styled.div``

const Page: React.FC = () => {
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(false)
  const { data: requests, error: requestsError } = useSWR<RecentRequests>(
    '/requests/recent',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: isAutoRefresh ? 5000 : 0,
    },
  )

  const rowRenderer: ListRowRenderer = ({
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
          tw="flex flex-col justify-center py-2 px-3">
          <div tw="text-xs truncate">{req.URL}</div>
          <div tw="text-sm truncate">
            {req.policyName}({req.rule})
          </div>
          <div
            css={[
              tw`flex items-center leading-none`,
              css`
                height: 1.5rem;
              `,
            ]}>
            <div
              css={[
                tw`rounded px-1 text-white`,
                css`
                  height: 1rem;
                  line-height: 1rem;
                  font-size: 0.5rem;
                `,
                req.status === 'Active' ? tw`bg-green-500` : tw`bg-blue-500`,
              ]}>
              {req.method}
            </div>
            <div tw="text-xs ml-1">#{req.id}</div>
            <div tw="text-xs ml-1">
              {dayjs.unix(req.startDate).format('HH:mm:ss')}
            </div>
            <div tw="text-xs ml-1">{req.status}</div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <div tw="fixed top-0 right-0 bottom-0 left-0 flex flex-col">
      <Heading
        size={'tera'}
        noMargin
        tw="flex items-center justify-between shadow bg-white z-10 px-3 py-3">
        <div>Requests</div>

        <div
          onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          css={[
            tw`bg-blue-500 text-white cursor-pointer w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ease-in-out `,
            isAutoRefresh && tw`bg-red-400`,
          ]}>
          <Spinner css={[tw`w-6 h-6`, isAutoRefresh && tw`animate-spin`]} />
        </div>
      </Heading>

      <RequestsWrapper tw="flex-1">
        <AutoSizer>
          {({ width, height }) => {
            if (requests) {
              return (
                <List
                  width={width}
                  height={height}
                  rowCount={requests.requests.length}
                  rowHeight={85}
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
            }
          }}
        </AutoSizer>
      </RequestsWrapper>
    </div>
  )
}

export default Page
