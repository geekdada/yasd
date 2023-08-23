import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { FilterIcon } from 'lucide-react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/utils/shadcn'

const FilterSchema = z.object({
  urlFilter: z.string().optional(),
})

export type FilterSchema = z.infer<typeof FilterSchema>

type FilterPopoverProps = {
  className?: string
  onFilterRulesChange: (props: FilterSchema) => void
  filter: FilterSchema
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  className,
  filter: { urlFilter },
  onFilterRulesChange,
}) => {
  const { t } = useTranslation()

  const [isOpen, setIsOpen] = useState(false)

  const hasFilter = Boolean(urlFilter)

  const form = useForm<z.infer<typeof FilterSchema>>({
    resolver: zodResolver(FilterSchema),
    defaultValues: {
      urlFilter: urlFilter || '',
    },
  })

  const onSubmit = useCallback(
    (data: z.infer<typeof FilterSchema>) => {
      setIsOpen(false)
      onFilterRulesChange(data)
    },
    [onFilterRulesChange],
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
            hasFilter && 'bg-green-200 text-green-800 hover:bg-green-100',
            className,
          )}
          size="sm"
          variant="secondary"
        >
          <FilterIcon className="h-4 w-4" />
          <span className="max-sm:hidden">{t('Filter')}</span>
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
            <h4 className="font-medium leading-none">{t('Filter rules')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('Filter requests by partial URL.')}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="urlFilter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoCorrect="off"
                        autoComplete="off"
                        autoCapitalize="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <ButtonGroup align="right">
                <Button
                  size="sm"
                  type="reset"
                  autoFocus={false}
                  variant="secondary"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.reset()
                    onSubmit({ urlFilter: '' })
                  }}
                >
                  {t('Clear')}
                </Button>
                <Button size="sm" type="submit">
                  {t('Submit')}
                </Button>
              </ButtonGroup>
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FilterPopover
