import React from 'react'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import useSWR from 'swr'
import tw from 'twin.macro'

import { useProfile } from '../../../models/profile'
import { EventList } from '../../../types'
import fetcher from '../../../utils/fetcher'

dayjs.extend(localizedFormat)

const Events: React.FC = () => {
  const { t } = useTranslation()
  const profile = useProfile()
  const { data: events } = useSWR<EventList>(
    profile !== undefined ? '/events' : null,
    fetcher,
  )

  return (
    <div className="p-3 bg-gray-100 rounded">
      <div className="text-base font-medium text-gray-700">
        {t('home.events')}
      </div>
      <div className="divide-y divide-gray-200 mt-1">
        {events &&
          events.events.slice(0, 8).map((item) => {
            return (
              <div key={item.identifier} className="py-1">
                <div
                  className="text-sm leading-normal text-gray-600"
                  css={css`
                    word-break: break-word;
                    overflow-wrap: break-word;
                  `}
                >
                  {item.content}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.type === 2 && (
                    <span
                      css={[
                        tw`bg-red-400 text-white rounded mr-1`,
                        css`
                          font-size: 0.6rem;
                          padding: 0.1rem 0.5rem;
                        `,
                      ]}
                    >
                      ERROR
                    </span>
                  )}
                  <span>{dayjs(item.date).format('L LTS')}</span>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Events
