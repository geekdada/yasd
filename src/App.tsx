/** @jsx jsx */
import { jsx } from '@emotion/core'
import { find } from 'lodash-es'
import React, { useRef } from 'react'
import { ThemeProvider } from 'emotion-theming'
import { light } from '@sumup/design-tokens'
import { Switch, Route, Redirect } from 'react-router-dom'
import loadable from '@loadable/component'
import tw from 'twin.macro'
import css from '@emotion/css/macro'
import styled from '@emotion/styled/macro'
import store from 'store2'
import { useLocation, useHistory } from 'react-router-dom'
import ReactGA from 'react-ga'
import { ToastContainer } from 'react-toastify'

import FullLoading from './components/FullLoading'
import ScrollToTop from './components/ScrollToTop'
import { ProfileProvider } from './models/profile'
import LandingPage from './pages/Landing'
import IndexPage from './pages/Index'
import PageLayout from './components/PageLayout'
import { Profile } from './types'
import { ExistingProfiles, LastUsedProfile } from './utils/constant'
import { setServer } from './utils/fetcher'

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

const App: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const currentProfile = useRef<Profile>()

  if (
    process.env.NODE_ENV === 'production' &&
    process.env.REACT_APP_ENABLE_GA
  ) {
    ReactGA.initialize('UA-146417304-2')
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  if (location.pathname !== '/') {
    const existingProfiles = store.get(ExistingProfiles)
    const lastId = store.get(LastUsedProfile)
    const result = find<Profile>(existingProfiles, { id: lastId })

    if (result) {
      currentProfile.current = result
      setServer(result.host, result.port, result.key)
    } else {
      history.replace('/')
    }
  }

  return (
    <ThemeProvider theme={light}>
      <ScrollToTop />
      <ToastContainer />

      <ProfileProvider profile={currentProfile.current}>
        <PageLayout>
          <Switch>
            <Route exact path="/">
              <LandingPage />
            </Route>
            <Route exact path="/home">
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
      </ProfileProvider>
    </ThemeProvider>
  )
}

export default App
