import React from 'react'
import { css } from '@emotion/react'

import { cn } from '@/utils/shadcn'

const tones = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
}

type LabelBadgeProps = {
  tone?: keyof typeof tones
} & React.HTMLAttributes<HTMLDivElement>

const LabelBadge: React.FC<LabelBadgeProps> = ({
  tone = 'blue',
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded px-1 text-white inline-block',
        tones[tone],
        className,
      )}
      css={css`
        height: 1rem;
        line-height: 1rem;
        font-size: 0.5rem;
      `}
      {...props}
    >
      {typeof children === 'string' ? children.toUpperCase() : children}
    </div>
  )
}

export default LabelBadge
