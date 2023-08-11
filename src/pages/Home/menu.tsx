import React from 'react'
import gte from 'semver/functions/gte'

import { Profile } from '@/types'
import { isRunInSurge } from '@/utils'

import CapabilityTile from './components/CapabilityTile'

export interface MenuItem {
  titleKey: string
  descriptionKey?: string
  link?: string
  component?: JSX.Element
  isEnabled?: (
    platform: Profile['platform'] | void,
    platformVersion: Profile['platformVersion'] | void,
  ) => boolean
}

const menu: Array<MenuItem> = [
  {
    titleKey: 'policies',
    link: '/policies',
  },
  {
    titleKey: 'requests',
    link: '/requests',
  },
  {
    titleKey: 'traffic',
    descriptionKey: 'descriptions.traffic',
    link: '/traffic',
  },
  {
    titleKey: 'scripting',
    component: (
      <CapabilityTile
        api="/features/scripting"
        titleKey="scripting"
        link="/scripting"
        descriptionKey="descriptions.scripting"
      />
    ),
  },
  {
    titleKey: 'modules',
    link: '/modules',
    descriptionKey: 'descriptions.modules',
  },
  {
    titleKey: 'device_management',
    link: '/devices',
    descriptionKey: 'descriptions.device_management',
    isEnabled: (platform, platformVersion) => {
      return Boolean(
        platform === 'macos' &&
          platformVersion &&
          gte(platformVersion, '4.0.6'),
      )
    },
  },
  {
    titleKey: 'dns',
    descriptionKey: 'descriptions.dns',
    link: '/dns',
  },
  {
    titleKey: 'profile',
    link: '/profiles/current',
    descriptionKey: 'descriptions.profile',
  },
  {
    titleKey: 'mitm',
    component: (
      <CapabilityTile
        api="/features/mitm"
        titleKey="mitm"
        descriptionKey="descriptions.mitm"
      />
    ),
  },
  {
    titleKey: 'http_capture',
    component: (
      <CapabilityTile
        api="/features/capture"
        titleKey="http_capture"
        descriptionKey="descriptions.http_capture"
      />
    ),
  },
  {
    titleKey: 'rewrite',
    component: (
      <CapabilityTile
        api="/features/rewrite"
        titleKey="rewrite"
        descriptionKey="descriptions.rewrite"
      />
    ),
  },
]

if (!isRunInSurge()) {
  menu.push({
    titleKey: 'github',
    descriptionKey: 'descriptions.github',
    link: 'https://github.com/geekdada/yasd',
  })
}

export default menu
