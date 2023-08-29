import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/shadcn'

const chipVariants = cva('inline-block font-medium ring-1 ring-inset', {
  variants: {
    variant: {
      info: 'text-green-700 bg-green-50 ring-green-600/20',
      error: 'text-red-700 bg-red-50 ring-red-600/10',
      warn: 'text-yellow-600 bg-yellow-50 ring-yellow-500/10',
    },
    size: {
      default: 'text-sm rounded-md py-1 px-2',
      sm: 'text-xs rounded-md py-0.5 px-2',
      lg: 'text-base rounded-lg py-2 px-3',
    },
  },
  defaultVariants: {
    variant: 'info',
    size: 'default',
  },
})

export interface StatusChipProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  text?: string
}

const StatusChip = React.forwardRef<HTMLDivElement, StatusChipProps>(
  ({ className, text, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(chipVariants({ variant, size, className }))}
        {...props}
      >
        {text || variant}
      </div>
    )
  },
)

StatusChip.displayName = 'StatusChip'

export { StatusChip }
