/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react'
import gte from 'semver/functions/gte'

import { usePlatform, usePlatformVersion } from '../models/profile'

interface VersionSupportProps {
  macos?: string
  ios?: string
}

const VersionSupport: React.FC<VersionSupportProps> = ({
  macos,
  ios,
  children,
}) => {
  const platform = usePlatform()
  const platformVersion = usePlatformVersion()

  if (!platform || !platformVersion) return null

  if (macos && platform === 'macos' && gte(platformVersion, macos)) {
    return <React.Fragment>{children}</React.Fragment>
  }

  if (ios && platform === 'ios' && gte(platformVersion, ios)) {
    return <React.Fragment>{children}</React.Fragment>
  }

  return null
}

export default VersionSupport
