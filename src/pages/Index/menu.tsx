/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react'
import tw, { TwStyle } from 'twin.macro'

import CapabilityTile from './components/CapabilityTile'

export interface MenuItem {
  title: string
  link?: string
  tintColor?: TwStyle
  textColor?: TwStyle
  component?: JSX.Element
}

const menu: Array<MenuItem> = [
  {
    title: 'Policies',
    link: '/policies',
  },
  {
    title: 'Requests',
    link: '/requests',
  },
  {
    title: 'Traffic',
    link: '/traffic',
  },
  {
    title: '脚本',
    component: (
      <CapabilityTile
        api="/features/scripting"
        title="脚本"
        link="/scripting"
      />
    ),
  },
  {
    title: 'Modules',
    link: '/modules',
  },
  {
    title: 'MitM',
    component: <CapabilityTile api="/features/mitm" title="MitM" />,
  },
  {
    title: '抓取流量',
    component: <CapabilityTile api="/features/capture" title="抓取流量" />,
  },
  {
    title: 'Rewrite',
    component: <CapabilityTile api="/features/rewrite" title="Rewrite" />,
  },
]

export default menu
