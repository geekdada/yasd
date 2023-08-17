import React from 'react'

import { cn } from '@/utils/shadcn'

const BottomPanel = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('flex items-center border-t py-2 px-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default BottomPanel
