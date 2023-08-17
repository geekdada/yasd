import React from 'react'
import { css } from '@emotion/react'
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/shadcn'

const variants = cva('flex w-full flex-col', {
  variants: {
    interactive: {
      true: 'cursor-pointer hover:bg-muted',
      false: '',
    },
  },
  defaultVariants: {
    interactive: true,
  },
})

type ListCellProps = {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof variants>

const ListCell: React.FC<ListCellProps> = ({
  children,
  className,
  interactive,
  ...props
}) => {
  return (
    <div
      className={cn(variants({ interactive, className }))}
      css={css`
        padding-left: calc(env(safe-area-inset-left) + 0.75rem);
        padding-right: calc(env(safe-area-inset-right) + 0.75rem);
      `}
      {...props}
    >
      {children}
    </div>
  )
}

type ListFullHeightCellProps = {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

const ListFullHeightCell = ({
  children,
  className,
  ...props
}: ListFullHeightCellProps) => {
  return (
    <div
      className={cn(
        'fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center text-lg font-semibold text-gray-500',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { ListCell, ListFullHeightCell }
