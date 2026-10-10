import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import useSWR, { mutate } from 'swr'

import { DataGroup } from '@/components/Data'
import FilterTabs from '@/components/FilterTabs'
import { ListFullHeightCell } from '@/components/ListCell'
import PageTitle from '@/components/PageTitle'
import { Switch } from '@/components/ui/switch'
import { Modules } from '@/types'
import fetcher from '@/utils/fetcher'
import withProfile from '@/utils/with-profile'

type Filter = 'all' | 'enabled'

const ComponentBase: React.FC = () => {
  const { t } = useTranslation()
  const { data: modules, isLoading } = useSWR<Modules>('/modules', fetcher)
  const [isModuleLoading, setIsModuleLoading] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const hasModules = !!modules?.available.length

  const isChecked = (name: string): boolean => {
    return modules?.enabled.includes(name) === true
  }

  const visibleModules =
    filter === 'all'
      ? (modules?.available ?? [])
      : (modules?.available.filter(isChecked) ?? [])

  const toggle = useCallback(
    (name: string, newVal: boolean) => {
      setIsModuleLoading(true)

      fetcher({
        url: '/modules',
        method: 'POST',
        data: {
          [name]: newVal,
        },
      })
        .then(() => {
          toast.success(t('common.success_interaction'))
          return mutate('/modules')
        })
        .catch((err) => {
          toast.error(t('common.failed_interaction'))
          console.error(err)
        })
        .finally(() => {
          setIsModuleLoading(false)
        })
    },
    [setIsModuleLoading, t],
  )

  if (isLoading || !hasModules) {
    return (
      <>
        <PageTitle title={t('home.modules')} />
        <ListFullHeightCell>
          {isLoading ? t('common.is_loading') + '...' : t('modules.empty_list')}
        </ListFullHeightCell>
      </>
    )
  }

  return (
    <>
      <PageTitle title={t('home.modules')} />

      <div className="space-y-4 p-4 pb-0 md:space-y-5 md:p-5 md:pb-0">
        <FilterTabs
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: t('modules.filter_all') },
            { value: 'enabled', label: t('modules.filter_enabled') },
          ]}
        />

        {visibleModules.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            {t('modules.none_enabled')}
          </div>
        ) : (
          <DataGroup>
            {visibleModules.map((mod) => (
              <label
                key={mod}
                className="flex cursor-pointer items-center justify-between gap-3 px-3 py-3 @md:px-5"
              >
                <div className="truncate text-sm leading-normal">{mod}</div>
                <Switch
                  disabled={isModuleLoading}
                  checked={isChecked(mod)}
                  onCheckedChange={(checked) => toggle(mod, checked)}
                />
              </label>
            ))}
          </DataGroup>
        )}
      </div>
    </>
  )
}

export const Component = withProfile(ComponentBase)

Component.displayName = 'ModulesPage'

export { ErrorBoundary } from '@/components/ErrorBoundary'
