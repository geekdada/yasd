import React from 'react'

import { useVersionSupport } from '../hooks'

interface VersionSupportProps {
  macos?: string
  ios?: string
  children: React.ReactNode
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
