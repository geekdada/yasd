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
const ModulesPage = loadable(() => import('./pages/Modules'), {
  fallback: <FullLoading />,
})
const ScriptingPage = loadable(() => import('./pages/Scripting'), {
  fallback: <FullLoading />,
})

if (
  process.env.REACT_APP_HOST &&
  process.env.REACT_APP_PORT &&
  process.env.REACT_APP_KEY
) {
  setServer(
    process.env.REACT_APP_HOST,
    Number(process.env.REACT_APP_PORT),
    process.env.REACT_APP_KEY,
  )
}

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
        <Route exact path="/modules">
          <ModulesPage />
        </Route>
        <Route exact path="/scripting">
          <ScriptingPage />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </PageLayout>
  </ThemeProvider>
)

export default App
