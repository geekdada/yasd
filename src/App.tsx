/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import { light } from '@sumup/design-tokens'
import { Switch, Route, Redirect } from 'react-router-dom'
import loadable from '@loadable/component'
import { Spinner } from '@sumup/circuit-ui'
import tw from 'twin.macro'
import css from '@emotion/css/macro'
import styled from '@emotion/styled/macro'

import FullLoading from './components/FullLoading'
import IndexPage from './pages/Index'
import { setServer } from './utils/fetcher'
import PageLayout from './components/PageLayout'

const PoliciesPage = loadable(() => import('./pages/Policies'), {
  fallback: <FullLoading />,
})
const RequestsPage = loadable(() => import('./pages/Requests'), {
  fallback: <FullLoading />,
})
const TrafficPage = loadable(() => import('./pages/Traffic'), {
  fallback: <FullLoading />,
})

setServer('0.0.0.0', 6171, 'teehee_network')

const App: React.FC = () => (
  <ThemeProvider theme={light}>
    <PageLayout>
      <Switch>
        <Route exact path="/">
          <IndexPage />
        </Route>
        <Route exact path="/policies">
          <PoliciesPage />
        </Route>
        <Route exact path="/requests">
          <RequestsPage />
        </Route>
        <Route exact path="/traffic">
          <TrafficPage />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </PageLayout>
  </ThemeProvider>
)

export default App