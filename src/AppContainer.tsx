import React, { ReactNode, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Provider as ReduxProvider } from 'react-redux'
import {
  BrowserRouter,
  BrowserRouterProps,
  HashRouter,
  HashRouterProps,
} from 'react-router-dom'

import Bootstrap from '@/bootstrap'
import { ThemeProvider } from '@/components/ThemeProvider'
import { store } from '@/store'

const ReactRouter: React.FC<BrowserRouterProps | HashRouterProps> = (args) => {
  return process.env.REACT_APP_HASH_ROUTER === 'true' ? (
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
      <ReduxProvider store={store}>
        <HelmetProvider>
          <ReactRouter>
            <ThemeProvider>
              <Bootstrap>{children}</Bootstrap>
            </ThemeProvider>
          </ReactRouter>
        </HelmetProvider>
      </ReduxProvider>
    </Suspense>
  )
}

export default AppContainer
