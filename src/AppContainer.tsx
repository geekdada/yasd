import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/core'
import { ModalProvider } from '@sumup/circuit-ui'
import { light } from '@sumup/design-tokens'
import { ThemeProvider } from 'emotion-theming'
import React, { Suspense } from 'react'
import {
  BrowserRouter,
  BrowserRouterProps,
  HashRouter,
  HashRouterProps,
} from 'react-router-dom'

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

const AppContainer: React.FC = ({ children }) => {
  return (
    <Suspense fallback={<div />}>
      <CacheProvider value={styleCache}>
        <ReactRouter>
          <ProfileProvider>
            <ThemeProvider theme={light}>
              <ModalProvider>{children}</ModalProvider>
            </ThemeProvider>
          </ProfileProvider>
        </ReactRouter>
      </CacheProvider>
    </Suspense>
  )
}

export default AppContainer
