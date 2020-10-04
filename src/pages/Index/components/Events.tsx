/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import useSWR from 'swr'
import tw from 'twin.macro'
import React from 'react'

import { EventList } from '../../../types'
import fetcher from '../../../utils/fetcher'

dayjs.extend(localizedFormat)

const Events: React.FC = () => {
  const { data: events } = useSWR<EventList>('/events', fetcher)

  return (
    <div tw="mx-4 p-3 bg-gray-100 rounded">
      <div tw="text-base font-medium text-gray-700">Events</div>
      <div tw="divide-y divide-gray-200 mt-1">
        {events &&
          events.events.slice(0, 5).map((item) => {
            return (
              <div key={item.identifier} tw="py-1">
                <div tw="text-sm leading-tight text-gray-600">
                  {item.content}
                </div>
                <div tw="text-xs text-gray-500 mt-1">
                  {dayjs(item.date).format('L LTS')}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Events
