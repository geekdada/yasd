import { createContext } from 'react'
import { Location } from 'react-router-dom'

import type { Route } from './types'

export type RouterContext = {
  routes: Route[]
  currentLocation: Location | null
} | null

export const RouterContext = createContext<RouterContext>(null)
