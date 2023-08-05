import React, { ChangeEventHandler, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Toggle } from '@sumup/circuit-ui'
import useSWR, { mutate } from 'swr'

import { useProfile } from '@/models/profile'
import { Capability } from '@/types'
import fetcher from '@/utils/fetcher'

import MenuTile, { MenuTileContent, MenuTileTitle } from './MenuTile'

interface CapabilityTileProps {
  api: string
  title: string
  link?: string
}

const CapabilityTile: React.FC<CapabilityTileProps> = ({
  api,
  title,
  link,
}) => {
  const { t } = useTranslation()
  const profile = useProfile()
  const { data: capability } = useSWR<Capability>(
    profile !== undefined ? api : null,
    fetcher,
  )
  const navigate = useNavigate()

  const toggle: ChangeEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()

      fetcher({
        method: 'POST',
        url: api,
        data: {
          enabled: !capability?.enabled,
        },
      })
        .then(() => {
          return mutate(api)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    [api, capability],
  )

  return (
    <MenuTile onClick={link ? () => navigate(link) : undefined}>
      <MenuTileTitle title={t(`home.${title}`)} />

      <MenuTileContent className="flex justify-end">
        <Toggle
          label=""
          checkedLabel={t('common.on')}
          uncheckedLabel={t('common.off')}
          checked={capability?.enabled}
          onChange={toggle}
        />
      </MenuTileContent>
    </MenuTile>
  )
}

export default CapabilityTile
