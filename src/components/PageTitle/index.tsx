import React, { useEffect, useMemo, useState } from 'react'
import { css } from '@emotion/react'

import { TypographyH3 } from '@/components/ui/typography'
import { cn } from '@/utils/shadcn'

import BackButton from '../BackButton'

interface PageTitleProps {
  title: string
  hasAutoRefresh?: boolean
  defaultAutoRefreshState?: boolean
  onAutoRefreshStateChange?: (newState: boolean) => void
  sticky?: boolean
}

const PageTitle: React.FC<PageTitleProps> = (props) => {
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(
    () => props.defaultAutoRefreshState ?? false,
  )
  const isSticky = useMemo(
    () => (typeof props.sticky === 'undefined' ? true : props.sticky),
    [props.sticky],
  )

  useEffect(() => {
    if (props.hasAutoRefresh && props.onAutoRefreshStateChange) {
      props.onAutoRefreshStateChange(isAutoRefresh)
    }
  }, [isAutoRefresh, props])

  return (
    <TypographyH3
      className={cn(
        isSticky ? 'sticky top-0' : '',
        'flex items-center justify-between shadow bg-white dark:bg-muted z-10 px-3 py-2 md:py-3 md:px-5',
      )}
    >
      <div
        className="flex items-center"
        css={css`
          padding-left: env(safe-area-inset-left);
        `}
      >
        <BackButton title={props.title} />
      </div>

      {props.hasAutoRefresh && (
        <div
          onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          className={cn(
            'relative bg-green-100 cursor-pointer w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ease-in-out',
            isAutoRefresh && 'bg-red-100',
          )}
          css={[
            css`
              margin-right: env(safe-area-inset-right);
            `,
          ]}
        >
          <span
            className={cn(
              'absolute bg-green-600 w-4 h-4 rounded-full transition-colors',
              isAutoRefresh && 'animate-ping bg-red-600',
            )}
          />
          <span
            className={cn(
              'bg-green-600 w-4 h-4 rounded-full transition-colors',
              isAutoRefresh && 'bg-red-600',
            )}
          />
        </div>
      )}
    </TypographyH3>
  )
}

export default PageTitle
