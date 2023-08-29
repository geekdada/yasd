import React from 'react'

import { usePlatform, usePlatformBuild, usePlatformVersion } from '@/store'

const VersionTag = () => {
  const platform = usePlatform()
  const platformVersion = usePlatformVersion()
  const platformBuild = usePlatformBuild()

  const isPlatformInfoShown = Boolean(
    platform && platformBuild && platformVersion,
  )

  const content = isPlatformInfoShown
    ? `v${process.env.REACT_APP_VERSION}` +
      '\n' +
      `${platform} v${platformVersion} (${platformBuild})`
    : `v${process.env.REACT_APP_VERSION}`

  return (
    <span className="inline-block text-xs text-center">
      <pre className="px-4 py-2 rounded bg-muted text-gray-500">{content}</pre>
    </span>
  )
}

export default VersionTag
