import React from 'react'
import { css } from '@emotion/react'

import { useSurgeHost } from '@/store'

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
      <img
        loading="lazy"
        src={`${surgeHost}/resources/devices-icon?id=${icon || 'default'}`}
        alt=""
      />
    </div>
  )
}

export default DeviceIcon
