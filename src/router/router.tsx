import React, { useRef } from 'react'
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider as RouterProviderBase,
} from 'react-router-dom'

import App from '@/App'
import AppContainer from '@/AppContainer'
import ErrorBoundary from '@/components/ErrorBoundary'

import { RouterContext } from './context'

import type { Route } from './types'

const createRouter = (routes: Route[]) => {
  return process.env.REACT_APP_HASH_ROUTER === 'true'
    ? createHashRouter(routes)
    : createBrowserRouter(routes)
}

export type RouterProviderProps = {
  value: {
    routes: Route[]
  }
}

export const RouterProvider = ({ value }: RouterProviderProps) => {
  const routerRef = useRef(
    createRouter([
      {
        path: '/',
        element: (
          <AppContainer>
            <App />
          </AppContainer>
        ),
        children: value.routes,
        errorElement: <ErrorBoundary />,
      },
    ]),
  )

  return (
    <RouterContext.Provider
      value={{
        ...value,
        currentLocation: null,
      }}
    >
      <RouterProviderBase router={routerRef.current} />
    </RouterContext.Provider>
  )
}
