import React from 'react'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import useSWR from 'swr'

import { StatusChip } from '@/components/StatusChip'
import { TypographyH4 } from '@/components/ui/typography'
import { useProfile } from '@/store'
import { EventList } from '@/types'
import fetcher from '@/utils/fetcher'

dayjs.extend(localizedFormat)

const Events: React.FC = () => {
  const { t } = useTranslation()
  const profile = useProfile()
  const { data: events } = useSWR<EventList>(
    profile !== undefined ? '/events' : null,
    fetcher,
  )

  return (
    <div className="space-y-2">
      <TypographyH4 className="px-3 md:px-5">{t('home.events')}</TypographyH4>

      <div className="px-3 md:px-5 bg-muted rounded-xl border">
        <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-black/20">
          {events &&
            events.events.slice(0, 8).map((item) => {
              return (
                <div key={item.identifier} className="py-2 md:py-3 lg:py-4">
                  <div
                    className="text-sm leading-normal text-gray-600 dark:text-white/90"
                    css={css`
                      word-break: break-word;
                      overflow-wrap: break-word;
                    `}
                  >
                    {item.content}
                  </div>
                  <div className="text-xs text-gray-500  dark:text-white/70 mt-1 flex items-center gap-1">
                    <span>
                      {item.type === 2 && (
                        <StatusChip size="sm" variant="error" />
                      )}
                      {item.type === 1 && (
                        <StatusChip size="sm" variant="warn" />
                      )}
                      {item.type === 0 && (
                        <StatusChip size="sm" variant="info" />
                      )}
                    </span>
                    <span>{dayjs(item.date).format('L LTS')}</span>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default Events
