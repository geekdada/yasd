import React from 'react'

import { useVersionSupport } from '@/hooks/useVersionSupport'

interface VersionSupportProps {
  macos?: string | boolean
  ios?: string | boolean
  tvos?: string | boolean
  children: React.ReactNode
}

const VersionSupport: React.FC<VersionSupportProps> = ({
  macos,
  ios,
  tvos,
  children,
}) => {
  const isSupported = useVersionSupport({ macos, ios, tvos })

  if (isSupported) {
    return <>{children}</>
  }

  return null
}

export default VersionSupport
