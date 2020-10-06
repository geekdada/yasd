/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import { Toggle } from '@sumup/circuit-ui'
import { useHistory } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import tw from 'twin.macro'
import React, { MouseEventHandler, useCallback } from 'react'

import { Capability } from '../../../types'
import fetcher from '../../../utils/fetcher'
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
  const { data: capability } = useSWR<Capability>(api, fetcher)
  const history = useHistory()

  const toggle = useCallback(() => {
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
  }, [api, capability])

  return (
    <MenuTile onClick={link ? () => history.push(link) : undefined}>
      <MenuTileTitle title={title} />

      <MenuTileContent css={[tw`flex justify-end`]}>
        <Toggle
          noMargin
          label=""
          labelChecked=""
          labelUnchecked=""
          checked={capability?.enabled}
          onChange={toggle}
        />
      </MenuTileContent>
    </MenuTile>
  )
}

export default CapabilityTile
