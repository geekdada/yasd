import React from 'react'
import { css } from '@emotion/react'

import { cn } from '@/utils/shadcn'

const FixedFullscreenContainer: React.FC<{
  offsetBottom?: boolean
  children: React.ReactNode | React.ReactNode[]
}> = (props) => {
  let offsetBottom = true

  if (typeof props.offsetBottom === 'boolean') {
    offsetBottom = props.offsetBottom
  }

  return (
    <div
      className={cn('absolute top-0 bottom-0 h-full overflow-hidden')}
      css={[
        offsetBottom &&
          css`
            padding-bottom: env(safe-area-inset-bottom);
          `,
        css`
          left: 1px;
          right: 1px;
        `,
      ]}
    >
      <div className="w-full h-full flex flex-col">{props.children}</div>
    </div>
  )
}

export default FixedFullscreenContainer
