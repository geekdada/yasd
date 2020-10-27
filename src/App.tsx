/** @jsx jsx */
import { jsx } from '@emotion/core'
import { find } from 'lodash-es'
import React, { useRef, useState } from 'react'
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
import { ToastContainer as OriginalToastContainer } from 'react-toastify'
import { SWRConfig } from 'swr'
import 'react-toastify/dist/ReactToastify.css'

import FullLoading from './components/FullLoading'
import NewVersionAlert from './components/NewVersionAlert'
import { ProfileProvider } from './models/profile'
import NetworkErrorModal from './components/NetworkErrorModal'
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
const EvaluatePage = loadable(() => import('./pages/Scripting/Evaluate'), {
  fallback: <FullLoading />,
})
const ToastContainer = styled(OriginalToastContainer)`
  ${tw`p-2 md:p-0`}

  .Toastify__toast {
    ${tw`flex items-center px-3 py-3 bg-blue-100 rounded shadow-none`}
  }
  .Toastify__close-button,
  .Toastify__toast-body {
    ${tw`text-blue-700`}
  }
  .Toastify__toast-body {
    ${tw`text-base`}
  }
  .Toastify__close-button {
    ${tw`block ml-3 self-center`}
  }
  .Toastify__progress-bar {
    ${tw`bg-blue-200`}
  }
  .Toastify__toast--error {
    ${tw`bg-red-100`}

    .Toastify__close-button, .Toastify__toast-body {
      ${tw`text-red-700`}
    }
    .Toastify__progress-bar {
      ${tw`bg-red-200`}
    }
  }
  .Toastify__toast--warning {
    ${tw`bg-orange-100 border-l-4 border-orange-500`}

    .Toastify__close-button, .Toastify__toast-body {
      ${tw`text-orange-700`}
    }
    .Toastify__progress-bar {
      ${tw`bg-orange-200`}
    }
  }
  .Toastify__toast--success {
    ${tw`bg-green-100`}

    .Toastify__close-button, .Toastify__toast-body {
      ${tw`text-green-700`}
    }
    .Toastify__progress-bar {
      ${tw`bg-green-200`}
    }
  }
`

const App: React.FC = () => {
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)
  const location = useLocation()
  const history = useHistory()
  const currentProfile = useRef<Profile>()

  if (
    'REACT_APP_DEBUG_GA' in process.env ||
    (process.env.NODE_ENV === 'production' && process.env.REACT_APP_ENABLE_GA)
  ) {
    ReactGA.initialize('UA-146417304-2', {
      debug: 'REACT_APP_DEBUG_GA' in process.env,
    })
    ReactGA.set({
      appVersion: process.env.REACT_APP_VERSION,
    })
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
    <SWRConfig
      value={{
        onError: (error) => {
          if (location.pathname !== '/') {
            if (!error.response && error.request) {
              // 无法连接服务器
              setIsNetworkModalOpen(true)
            }
          }
        },
        refreshWhenOffline: true,
      }}>
      <ThemeProvider theme={light}>
        <ProfileProvider profile={currentProfile.current}>
          <ToastContainer />
          <NetworkErrorModal
            isOpen={isNetworkModalOpen}
            onClose={() => {
              window.location.replace('/')
            }}
          />
          <NewVersionAlert />

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
              <Route exact path="/scripting/evaluate">
                <EvaluatePage />
              </Route>
              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
          </PageLayout>
        </ProfileProvider>
      </ThemeProvider>
    </SWRConfig>
  )
}

export default App
