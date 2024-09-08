import React from 'react'
import { css } from '@emotion/react'
import tw from 'twin.macro'

import { isTruthy } from '@/utils'
import { cn } from '@/utils/shadcn'

type MethodBadgeProps = {
  failed: 1 | 0 | boolean
  method: string
  status: string
} & React.HTMLAttributes<HTMLDivElement>

const MethodBadge: React.FC<MethodBadgeProps> = ({
  failed,
  method,
  status,
  className,
  css: cssProp,
  ...args
}) => {
  return (
    <div
      className={cn('rounded px-1 text-white inline-block', className)}
      css={[
        css`
          height: 1rem;
          line-height: 1rem;
          font-size: 0.5rem;
        `,
        isTruthy(failed)
          ? tw`bg-red-500`
          : status === 'Active'
            ? tw`bg-green-500`
            : tw`bg-blue-500`,
        cssProp,
      ]}
      {...args}
    >
      {method.toUpperCase()}
    </div>
  )
}

export default MethodBadge
