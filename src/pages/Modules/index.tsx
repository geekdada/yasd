import React, { useCallback, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import useSWR, { mutate } from 'swr'

import { ListCell, ListFullHeightCell } from '@/components/ListCell'
import PageTitle from '@/components/PageTitle'
import { Switch } from '@/components/ui/switch'
import { Modules } from '@/types'
import fetcher from '@/utils/fetcher'
import withProfile from '@/utils/with-profile'

const ComponentBase: React.FC = () => {
  const { t } = useTranslation()
  const { data: modules } = useSWR<Modules>('/modules', fetcher)
  const [isLoading, setIsLoading] = useState(false)

  const isChecked = (name: string): boolean => {
    return modules?.enabled.includes(name) === true
  }

  const toggle = useCallback(
    (name: string, newVal: boolean) => {
      setIsLoading(true)

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
          toast.success(t('common.failed_interaction'))
          console.error(err)
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [setIsLoading, t],
  )

  return (
    <>
      <PageTitle title={t('home.modules')} />

      <div className="divide-y">
        {modules &&
          modules.available.map((mod) => {
            return (
              <ListCell
                key={mod}
                className="flex flex-row items-center justify-between p-3"
              >
                <div className="truncate leading-normal">{mod}</div>
                <div className="flex items-center">
                  <Switch
                    disabled={isLoading}
                    checked={isChecked(mod)}
                    onCheckedChange={(checked) => toggle(mod, checked)}
                  />
                </div>
              </ListCell>
            )
          })}

        {modules && modules.available.length === 0 && (
          <ListFullHeightCell>{t('modules.empty_list')}</ListFullHeightCell>
        )}
      </div>
    </>
  )
}

export const Component = withProfile(ComponentBase)

Component.displayName = 'ModulesPage'

export { ErrorBoundary } from '@/components/ErrorBoundary'
