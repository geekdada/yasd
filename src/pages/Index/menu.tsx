/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react'
import tw, { TwStyle } from 'twin.macro'

import { isRunInSurge } from '../../utils'
import CapabilityTile from './components/CapabilityTile'

export interface MenuItem {
  title: string
  subTitle?: string
  link?: string
  tintColor?: TwStyle
  textColor?: TwStyle
  component?: JSX.Element
}

const menu: Array<MenuItem> = [
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

if (!isRunInSurge()) {
  menu.push({
    title: 'github',
    subTitle: '🌟',
    link: 'https://github.com/geekdada/yasd',
  })
}

export default menu
