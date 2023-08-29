import React from 'react'
import { css } from '@emotion/react'

import { cn } from '@/utils/shadcn'

type HorizontalSafeAreaProps = React.HTMLAttributes<HTMLDivElement>

const HorizontalSafeArea: React.FC<HorizontalSafeAreaProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      css={css`
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
      `}
    >
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </div>
  )
}

export default HorizontalSafeArea
