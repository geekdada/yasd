import gte from 'semver/functions/gte'

import { usePlatform, usePlatformVersion } from '@/store'
import { Profile } from '@/types'

export interface VersionSupportProps {
  macos?: string | boolean
  ios?: string | boolean
  tvos?: string | boolean
}

export const isVersionSupported = (
  platform: Profile['platform'] | void,
  platformVersion: Profile['platformVersion'] | void,
  requirements: VersionSupportProps,
): boolean => {
  if (!platform || !platformVersion) {
    return false
  }

  const minimumVersion = requirements[platform]

  return Boolean(
    minimumVersion && gte(platformVersion, parseVersion(minimumVersion)),
  )
}

export const useVersionSupport = (requirements: VersionSupportProps): boolean =>
  isVersionSupported(usePlatform(), usePlatformVersion(), requirements)

function parseVersion(version: string | boolean): string {
  if (typeof version === 'string') {
    return version
  }
  return '0.0.0'
}
