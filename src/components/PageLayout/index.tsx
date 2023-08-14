import React from 'react'

import { cn } from '@/utils/shadcn'

const PageLayout: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex-1 flex min-h-full justify-center overflow-x-clip',
        className,
      )}
      {...props}
    >
      <div className="relative max-w-4xl w-full bg-background">
        <div className="border-l border-r border-gray-200 dark:border-gray-800">
          {children}
        </div>
      </div>
    </div>
  )
}

export default PageLayout
