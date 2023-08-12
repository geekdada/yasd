import React from 'react'

import { useVersionSupport } from '@/hooks'
import { isRunInSurge as _isRunInSurge } from '@/utils'

interface VersionSupportProps {
  macos?: string | boolean
  ios?: string | boolean
  tvos?: string | boolean
  isRunInSurge?: boolean
  children: React.ReactNode
}

const VersionSupport: React.FC<VersionSupportProps> = ({
  macos,
  ios,
  tvos,
  isRunInSurge,
  children,
}) => {
  const isSupported = useVersionSupport({ macos, ios, tvos })
  const surgeCheck =
    typeof isRunInSurge === 'boolean' ? isRunInSurge === _isRunInSurge() : true

  if (isSupported && surgeCheck) {
    return <>{children}</>
  }

  return null
}

export default VersionSupport
