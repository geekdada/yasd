import { useContext, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { RouterContext } from './context'

export const useRoutesConfig = () => {
  const context = useContext(RouterContext)

  if (!context?.routes) {
    throw new Error('useRoutes must be used within a RouterProvider')
  }

  return context.routes
}

export const useRouteOptions = () => {
  const location = useLocation()
  const routes = useRoutesConfig()

  const currentRoute = useMemo(() => {
    return routes.find((route) => location.pathname === route.path)
  }, [location.pathname, routes])

  return currentRoute?.routeOptions
}
