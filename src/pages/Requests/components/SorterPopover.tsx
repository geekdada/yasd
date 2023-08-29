import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SortAscIcon, SortDescIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/utils/shadcn'

export type SorterRules = {
  sortBy: 'size' | 'time' | null
  sortDirection: 'asc' | 'desc'
}

type SorterPopoverProps = {
  className?: string
  sorter: SorterRules
  onSorterRulesChange: (props: SorterRules) => void
}

const SorterPopover = ({
  className,
  sorter,
  onSorterRulesChange,
}: SorterPopoverProps) => {
  const { t } = useTranslation()

  const [isOpen, setIsOpen] = useState(false)

  const hasSorter = Boolean(sorter.sortBy)

  const icon = hasSorter ? (
    sorter.sortDirection === 'asc' ? (
      <SortAscIcon className="h-4 w-4" />
    ) : (
      <SortDescIcon className="h-4 w-4" />
    )
  ) : (
    <SortAscIcon className="h-4 w-4" />
  )

  const onHide = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <Popover open={isOpen}>
      <PopoverTrigger
        asChild
        onClick={() => {
          setIsOpen((val) => !val)
        }}
      >
        <Button
          className={cn(
            'space-x-2',
            hasSorter && 'bg-green-200 text-green-800 hover:bg-green-100',
            className,
          )}
          size="sm"
          variant="secondary"
        >
          {icon}
          <span className="max-sm:hidden">{t('Sort')}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        onFocusOutside={onHide}
        onInteractOutside={onHide}
        onEscapeKeyDown={onHide}
        className="w-80"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{t('Sort rules')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('Sort requests by time or size.')}
            </p>
          </div>

          <div className="flex justify-center divide-x">
            <div className="pr-3 flex gap-1 items-center">
              <Toggle
                pressed={sorter.sortDirection === 'asc'}
                onPressedChange={(pressed) => {
                  onSorterRulesChange({
                    ...sorter,
                    sortDirection: pressed ? 'asc' : 'desc',
                  })
                }}
              >
                <SortAscIcon className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={sorter.sortDirection === 'desc'}
                onPressedChange={(pressed) => {
                  onSorterRulesChange({
                    ...sorter,
                    sortDirection: pressed ? 'desc' : 'asc',
                  })
                }}
              >
                <SortDescIcon className="h-4 w-4" />
              </Toggle>
            </div>
            <div className="pl-3 flex gap-1 items-center">
              <Toggle
                pressed={sorter.sortBy === 'time'}
                onPressedChange={(pressed) => {
                  onSorterRulesChange({
                    ...sorter,
                    sortBy: pressed ? 'time' : null,
                  })
                }}
              >
                {t('By time')}
              </Toggle>
              <Toggle
                pressed={sorter.sortBy === 'size'}
                onPressedChange={(pressed) => {
                  onSorterRulesChange({
                    ...sorter,
                    sortBy: pressed ? 'size' : null,
                  })
                }}
              >
                {t('By size')}
              </Toggle>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setIsOpen(false)
                onSorterRulesChange({
                  sortBy: null,
                  sortDirection: 'asc',
                })
              }}
            >
              {t('Clear')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SorterPopover
