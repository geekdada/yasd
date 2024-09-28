import React, { ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Provider as ReduxProvider } from 'react-redux'

import Bootstrap from '@/bootstrap'
import { ThemeProvider } from '@/components/ThemeProvider'
import { UIProvider } from '@/components/UIProvider'
import { store } from '@/store'

const AppContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <HelmetProvider>
        <ThemeProvider>
          <UIProvider>
            <Bootstrap>{children}</Bootstrap>
          </UIProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ReduxProvider>
  )
}

export default AppContainer
