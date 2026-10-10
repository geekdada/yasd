import React, { useState } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'

import { DataGroup } from '@/components/Data'
import FilterTabs from '@/components/FilterTabs'
import { ListFullHeightCell } from '@/components/ListCell'
import PageTitle from '@/components/PageTitle'
import { Button } from '@/components/ui/button'
import {
  ALL_EXTERNAL_RESOURCES,
  useExternalResources,
  useExternalResourcesSupport,
  useUpdateExternalResources,
} from '@/data/externalResources'
import withProfile from '@/utils/with-profile'

import ResourceCell from './components/ResourceCell'
import { groupByModule } from './groupResources'
import { getFailedUpdates } from './updateResult'

type Filter = 'all' | 'not_ready'

const ComponentBase: React.FC = () => {
  const { t } = useTranslation()
  const isSupported = useExternalResourcesSupport()
  const { data, isLoading } = useExternalResources()
  const { trigger, isMutating } = useUpdateExternalResources()
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const resources = data?.defines ?? []
  const visibleResources =
    filter === 'all' ? resources : resources.filter((item) => !item.ready)
  const hasRemoteResources = resources.some((resource) => !resource.local)

  const update = async (key: string) => {
    setPendingKey(key)
    try {
      const failures = getFailedUpdates(await trigger(key))

      if (failures.length === 0) {
        toast.success(t('common.success_interaction'))
      } else if (key === ALL_EXTERNAL_RESOURCES) {
        toast.error(
          t('external_resources.update_all_failed', { count: failures.length }),
        )
      } else {
        toast.error(
          t('external_resources.update_failed', {
            message: failures[0].message,
          }),
        )
      }
    } catch (error) {
      // The fetcher has already shown a toast for request errors.
      console.error(error)
    } finally {
      setPendingKey(null)
    }
  }

  const renderPlaceholder = () => {
    if (!isSupported) {
      return t('external_resources.unsupported')
    }
    if (isLoading) {
      return t('common.is_loading') + '...'
    }
    if (resources.length === 0) {
      return t('external_resources.empty_list')
    }
    return null
  }
  const placeholder = renderPlaceholder()

  if (placeholder) {
    return (
      <>
        <PageTitle title={t('home.external_resources')} />
        <ListFullHeightCell>{placeholder}</ListFullHeightCell>
      </>
    )
  }

  return (
    <>
      <PageTitle title={t('home.external_resources')} />

      <div className="space-y-4 p-4 pb-0 md:space-y-5 md:p-5 md:pb-0">
        <FilterTabs
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: t('external_resources.filter_all') },
            {
              value: 'not_ready',
              label: t('external_resources.filter_not_ready'),
            },
          ]}
        />

        {visibleResources.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            {t('external_resources.all_ready')}
          </div>
        ) : (
          groupByModule(visibleResources).map((group) => (
            <DataGroup
              key={group.module ?? ''}
              title={group.module ?? t('external_resources.main_profile')}
            >
              {group.resources.map((resource) => (
                <ResourceCell
                  key={resource.key}
                  resource={resource}
                  isPending={pendingKey === resource.key}
                  disabled={isMutating}
                  onUpdate={update}
                />
              ))}
            </DataGroup>
          ))
        )}
      </div>

      {hasRemoteResources && (
        // The negative margin cancels PageContainer's bottom padding.
        // The bar then rests at the same spot when scrolled to the end.
        <div
          className="pointer-events-none sticky bottom-0 z-10 -mb-5 flex justify-center pt-6"
          css={css`
            padding-bottom: calc(env(safe-area-inset-bottom) + 1.5rem);
          `}
        >
          <Button
            size="lg"
            variant="outline"
            className="pointer-events-auto min-w-40 rounded-full shadow-lg"
            isLoading={pendingKey === ALL_EXTERNAL_RESOURCES}
            loadingLabel={t('external_resources.updating')}
            disabled={isMutating}
            onClick={() => update(ALL_EXTERNAL_RESOURCES)}
          >
            {t('external_resources.update_all')}
          </Button>
        </div>
      )}
    </>
  )
}

export const Component = withProfile(ComponentBase)

Component.displayName = 'ExternalResourcesPage'

export { ErrorBoundary } from '@/components/ErrorBoundary'
