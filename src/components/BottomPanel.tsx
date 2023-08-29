import React from 'react'
import { css } from '@emotion/react'

import { cn } from '@/utils/shadcn'

const BottomPanel = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      css={css`
        padding-bottom: env(safe-area-inset-bottom);
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
      `}
    >
      <div
        className={cn('flex items-center border-t px-2 py-2', className)}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

export default BottomPanel
