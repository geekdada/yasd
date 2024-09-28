import type { RouteObject } from 'react-router'

export type RoutesConfig = {
  routes: Route[]
}

export type Route = RouteObject & {
  title?: () => string
  routeOptions?: {
    fullscreen?: boolean
    bottomSafeArea?: boolean
  }
}
