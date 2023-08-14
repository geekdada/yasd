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
        'flex-1 flex justify-center overflow-x-clip overflow-y-scroll',
        className,
      )}
      {...props}
    >
      <div className="flex-1 max-w-4xl w-full">
        <div className="relative min-h-full border-l bg-background border-r border-gray-200 dark:border-gray-800">
          {children}
        </div>
      </div>
    </div>
  )
}

export default PageLayout
