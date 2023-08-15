import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useSWR, { mutate } from 'swr'

import { Switch } from '@/components/ui/switch'
import { useProfile } from '@/store'
import { Capability } from '@/types'
import fetcher from '@/utils/fetcher'

import MenuTile from './MenuTile'

interface CapabilityTileProps {
  api: string
  titleKey: string
  descriptionKey?: string
  link?: string
}

const CapabilityTile: React.FC<CapabilityTileProps> = ({
  api,
  titleKey,
  descriptionKey,
  link,
}) => {
  const { t } = useTranslation()
  const profile = useProfile()
  const { data: capability, isLoading } = useSWR<Capability>(
    profile !== undefined ? api : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )
  const navigate = useNavigate()

  const toggle = useCallback(
    (newVal: boolean) => {
      fetcher({
        method: 'POST',
        url: api,
        data: {
          enabled: newVal,
        },
      })
        .then(() => {
          return mutate(api)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    [api],
  )

  return (
    <MenuTile
      onClick={link ? () => navigate(link) : undefined}
      title={t(`home.${titleKey}`)}
      description={descriptionKey ? t(`home.${descriptionKey}`) : undefined}
      switchElement={
        <Switch
          className="dark:border-white/20"
          disabled={isLoading}
          checked={capability?.enabled}
          onCheckedChange={(newVal) => toggle(newVal)}
        />
      }
    />
  )
}

export default CapabilityTile
