import React, { ReactNode, Suspense } from 'react'
import {
  BrowserRouter,
  BrowserRouterProps,
  HashRouter,
  HashRouterProps,
} from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { light } from '@sumup/design-tokens'

import { ProfileProvider, TrafficProvider } from './models'

const ReactRouter: React.FC<BrowserRouterProps | HashRouterProps> = (args) => {
  return process.env.REACT_APP_HASH_ROUTER ? (
    <HashRouter {...(args as HashRouterProps)}>{args.children}</HashRouter>
  ) : (
    <BrowserRouter {...(args as BrowserRouterProps)}>
      {args.children}
    </BrowserRouter>
  )
}

const AppContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<div />}>
      <ReactRouter>
        <ProfileProvider>
          <TrafficProvider>
            <ThemeProvider theme={light}>{children}</ThemeProvider>
          </TrafficProvider>
        </ProfileProvider>
      </ReactRouter>
    </Suspense>
  )
}

export default AppContainer
