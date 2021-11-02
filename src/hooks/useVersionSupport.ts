import gte from 'semver/functions/gte'

import { usePlatform, usePlatformVersion } from '../models/profile'

interface VersionSupportProps {
  macos?: string
  ios?: string
}

export const useVersionSupport = ({
  macos,
  ios,
}: VersionSupportProps): boolean => {
  const platform = usePlatform()
  const platformVersion = usePlatformVersion()

  if (!platform || !platformVersion) {
    return false
  }

  if (macos && platform === 'macos' && gte(platformVersion, macos)) {
    return true
  }

  if (ios && platform === 'ios' && gte(platformVersion, ios)) {
    return true
  }

  return false
}
