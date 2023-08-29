import React, { useCallback } from 'react'
import { ChevronRight } from '@sumup/icons'

import { cn } from '@/utils/shadcn'

type DataRowMainProps = {
  onClick?: () => void
  hideArrow?: boolean
  destructive?: boolean
  disabled?: boolean
  responsiveFont?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const DataRowMain = ({
  children,
  className,
  onClick,
  hideArrow,
  destructive,
  disabled,
  responsiveFont,
  ...props
}: DataRowMainProps) => {
  const handleClick = useCallback(() => {
    if (disabled) return
    onClick?.()
  }, [disabled, onClick])
  const isClickable = typeof onClick === 'function'

  const clickableChildren = (
    <>
      <div className="truncate flex-1">{children}</div>
      {!hideArrow && <ChevronRight className="w-5 h-5 -mr-1" />}
    </>
  )

  responsiveFont = responsiveFont ?? true

  return (
    <div
      className={cn(
        'flex items-center justify-between px-3 py-3 md:px-5 md:py-4 leading-normal text-sm',
        isClickable &&
          'gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-black/20',
        destructive && 'text-destructive dark:text-red-500',
        disabled && 'cursor-not-allowed text-gray-400 dark:text-gray-600',
        responsiveFont && 'lg:text-base',
        className,
      )}
      onClick={() => handleClick()}
      {...props}
    >
      {isClickable ? clickableChildren : children}
    </div>
  )
}
