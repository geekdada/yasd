import * as React from 'react'
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/shadcn'

const variants = cva('flex items-center space-x-3', {
  variants: {
    align: {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    },
  },
  defaultVariants: {
    align: 'left',
  },
})

type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof variants>

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, className, align, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        variants({
          className,
          align,
        }),
      )}
      {...props}
    >
      {children}
    </div>
  ),
)

ButtonGroup.displayName = 'ButtonGroup'

export { ButtonGroup }
