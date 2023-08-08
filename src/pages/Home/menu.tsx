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
    link: '/traffic',
  },
  {
    titleKey: 'scripting',
    component: (
      <CapabilityTile
        api="/features/scripting"
        titleKey="scripting"
        link="/scripting"
      />
    ),
  },
  {
    titleKey: 'modules',
    link: '/modules',
  },
  {
    titleKey: 'device_management',
    link: '/devices',
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
    link: '/dns',
  },
  {
    titleKey: 'profile',
    link: '/profiles/current',
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
      <CapabilityTile api="/features/capture" titleKey="http_capture" />
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
