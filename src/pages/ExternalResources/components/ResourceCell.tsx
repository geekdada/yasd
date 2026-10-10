import React from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { RefreshCw } from 'lucide-react'

import LabelBadge from '@/components/LabelBadge'
import { Button } from '@/components/ui/button'
import { ExternalResource } from '@/types'

import { getResourceName } from '../groupResources'

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

// Keeps the end of long URLs visible because it usually names the file.
const PATH_TAIL_LENGTH = 28

interface ResourceCellProps {
  resource: ExternalResource
  isPending: boolean
  disabled: boolean
  onUpdate: (key: string) => void
}

const ResourceCell: React.FC<ResourceCellProps> = ({
  resource,
  isPending,
  disabled,
  onUpdate,
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 @md:px-5">
      <div className="min-w-0 flex-1 leading-normal">
        <div
          className="flex text-xs text-muted-foreground"
          title={resource.path}
        >
          <span className="truncate">
            {resource.path.slice(0, -PATH_TAIL_LENGTH)}
          </span>
          <span className="shrink-0 whitespace-pre">
            {resource.path.slice(-PATH_TAIL_LENGTH)}
          </span>
        </div>
        <div className="truncate text-sm">{getResourceName(resource.path)}</div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          <LabelBadge tone={resource.error ? 'red' : 'blue'}>
            {resource.type}
          </LabelBadge>
          <UpdateStatus resource={resource} />
          {!resource.ready && (
            <span className="text-destructive">
              {t('external_resources.not_ready')}
            </span>
          )}
        </div>
        {resource.error && (
          <div className="mt-0.5 text-xs break-all text-destructive">
            {resource.error}
          </div>
        )}
      </div>

      {!resource.local && (
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={t('external_resources.update')}
          title={t('external_resources.update')}
          isLoading={isPending || resource.updating}
          disabled={disabled}
          onClick={() => onUpdate(resource.key)}
        >
          <RefreshCw />
        </Button>
      )}
    </div>
  )
}

const UpdateStatus: React.FC<{ resource: ExternalResource }> = ({
  resource,
}) => {
  const { t } = useTranslation()

  if (resource.local) {
    return <span>{t('external_resources.local')}</span>
  }
  if (!resource.updatedAt) {
    return <span>{t('external_resources.never_updated')}</span>
  }

  const updatedAt = dayjs.unix(resource.updatedAt)

  return (
    <span title={updatedAt.format('L LTS')}>
      {t('external_resources.updated_at', { time: updatedAt.fromNow() })}
    </span>
  )
}

export default ResourceCell
