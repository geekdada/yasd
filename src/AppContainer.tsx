import React, { ReactNode, Suspense } from 'react'
import {
  BrowserRouter,
  BrowserRouterProps,
  HashRouter,
  HashRouterProps,
} from 'react-router-dom'
import createCache from '@emotion/cache'
import { CacheProvider, ThemeProvider } from '@emotion/react'
import { BaseStyles } from '@sumup/circuit-ui'
import { light } from '@sumup/design-tokens'

import { ProfileProvider } from './models/profile'

const ReactRouter: React.FC<BrowserRouterProps | HashRouterProps> = (args) => {
  return process.env.REACT_APP_HASH_ROUTER ? (
    <HashRouter {...(args as HashRouterProps)}>{args.children}</HashRouter>
  ) : (
    <BrowserRouter {...(args as BrowserRouterProps)}>
      {args.children}
    </BrowserRouter>
  )
}
const styleCache = createCache({
  key: 'yasd',
})

const AppContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<div />}>
      <CacheProvider value={styleCache}>
        <ReactRouter>
          <ProfileProvider>
            <ThemeProvider theme={light}>
              <BaseStyles />
              {children}
            </ThemeProvider>
          </ProfileProvider>
        </ReactRouter>
      </CacheProvider>
    </Suspense>
  )
}

export default AppContainer
