import * as React from 'react'

import { cn } from '@/utils/shadcn'

type ButtonGroupProps = {
  // TODO: add props
} & React.HTMLAttributes<HTMLDivElement>

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('flex', className)} {...props}>
      {children}
    </div>
  ),
)

ButtonGroup.displayName = 'ButtonGroup'

export { ButtonGroup }
