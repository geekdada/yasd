import React from 'react'
import styled from '@emotion/styled'

import { cn } from '@/utils/shadcn'

export { DataRowMain } from './DataRowMain'

export const DataGroup: React.FC<{
  title?: string
  children: React.ReactNode
  className?: string
  responsiveTitle?: boolean
}> = (props) => {
  const responsiveTitle = props.responsiveTitle ?? true

  return (
    <div className={cn(props.className)}>
      {props.title && (
        <div
          className={cn(
            'text-gray-600 dark:text-white/90 text-sm leading-normal border-x border-transparent px-3 @md:px-5 mb-1 truncate',
            responsiveTitle && 'lg:mb-2 lg:text-base lg:leading-relaxed',
          )}
        >
          {props.title}
        </div>
      )}

      <div className="divide-y divide-gray-200 dark:divide-black/20 border bg-muted rounded-xl overflow-hidden">
        {props.children}
      </div>
    </div>
  )
}

export const DataRow = styled.div``

export const DataRowSub: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-3 @md:px-5 leading-normal text-xs lg:text-sm lg:leading-relaxed',
        className,
      )}
      {...props}
    />
  )
}
