/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react'

import { useVersionSupport } from '../hooks'

interface VersionSupportProps {
  macos?: string
  ios?: string
}

const VersionSupport: React.FC<VersionSupportProps> = ({
  macos,
  ios,
  children,
}) => {
  const isSupported = useVersionSupport({ macos, ios })

  if (isSupported) {
    return <React.Fragment>{children}</React.Fragment>
  }

  return null
}

export default VersionSupport
