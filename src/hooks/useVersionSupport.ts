import gte from 'semver/functions/gte'

import { usePlatform, usePlatformVersion } from '@/models'

interface VersionSupportProps {
  macos?: string | boolean
  ios?: string | boolean
  tvos?: string | boolean
}

export const useVersionSupport = ({
  macos,
  ios,
  tvos,
}: VersionSupportProps): boolean => {
  const platform = usePlatform()
  const platformVersion = usePlatformVersion()

  if (!platform || !platformVersion) {
    return false
  }

  if (
    macos &&
    platform === 'macos' &&
    gte(platformVersion, parseVersion(macos))
  ) {
    return true
  }

  if (ios && platform === 'ios' && gte(platformVersion, parseVersion(ios))) {
    return true
  }

  if (tvos && platform === 'tvos' && gte(platformVersion, parseVersion(tvos))) {
    return true
  }

  return false
}

function parseVersion(version: string | boolean): string {
  if (typeof version === 'string') {
    return version
  }
  return '0.0.0'
}
