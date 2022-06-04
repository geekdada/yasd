/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react'
import gte from 'semver/functions/gte'

import { Profile } from '../../types'
import { isRunInSurge } from '../../utils'
import CapabilityTile from './components/CapabilityTile'

export interface MenuItem {
  title: string
  subTitle?: string
  link?: string
  component?: JSX.Element
  isEnabled?: (
    platform: Profile['platform'] | void,
    platformVersion: Profile['platformVersion'] | void,
  ) => boolean
}

const menu: Array<MenuItem> = [
  {
    title: 'dashboard',
    link: '/dashboard',
  },
  {
    title: 'policies',
    link: '/policies',
  },
  {
    title: 'requests',
    link: '/requests',
  },
  {
    title: 'traffic',
    link: '/traffic',
  },
  {
    title: 'scripting',
    component: (
      <CapabilityTile
        api="/features/scripting"
        title="scripting"
        link="/scripting"
      />
    ),
  },
  {
    title: 'modules',
    link: '/modules',
  },
  {
    title: 'device_management',
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
    title: 'dns',
    link: '/dns',
  },
  {
    title: 'profile',
    link: '/profiles/current',
  },
  {
    title: 'mitm',
    component: <CapabilityTile api="/features/mitm" title="mitm" />,
  },
  {
    title: 'http_capture',
    component: <CapabilityTile api="/features/capture" title="http_capture" />,
  },
  {
    title: 'rewrite',
    component: <CapabilityTile api="/features/rewrite" title="rewrite" />,
  },
]

export default menu
