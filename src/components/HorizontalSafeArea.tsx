import React from 'react'
import { css } from '@emotion/react'

import { cn } from '@/utils/shadcn'

const HorizontalSafeArea: React.FC<{
  className?: string
  children: React.ReactNode | React.ReactNode[]
}> = (props) => {
  return (
    <div
      css={css`
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
      `}
    >
      <div className={cn(props.className)}>{props.children}</div>
    </div>
  )
}

export default HorizontalSafeArea
