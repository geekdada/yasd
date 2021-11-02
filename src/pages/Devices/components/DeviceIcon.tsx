/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Image } from '@sumup/circuit-ui'
import React from 'react'
import css from '@emotion/css/macro'
import tw from 'twin.macro'

import { useSurgeHost } from '../../../models/profile'

interface DeviceIconProps {
  icon?: string
}

const DeviceIcon = ({ icon }: DeviceIconProps): JSX.Element => {
  const surgeHost = useSurgeHost()

  return (
    <div
      css={css`
        width: 45px;
        height: 45px;
        margin-right: 0.7rem;
      `}
    >
      <Image
        src={`${surgeHost}/resources/devices-icon?id=${icon || 'default'}`}
        alt=""
      />
    </div>
  )
}

export default DeviceIcon
