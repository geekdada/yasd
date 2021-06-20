/** @jsx jsx */
import { jsx } from '@emotion/core'
import { find } from 'lodash-es'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ThemeProvider } from 'emotion-theming'
import { light } from '@sumup/design-tokens'
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from 'react-router-dom'
import loadable from '@loadable/component'
import tw from 'twin.macro'
import styled from '@emotion/styled/macro'
import store from 'store2'
import ReactGA from 'react-ga'
import { ToastContainer as OriginalToastContainer } from 'react-toastify'
import { SWRConfig } from 'swr'
import 'react-toastify/dist/ReactToastify.css'

import FullLoading from './components/FullLoading'
import NewVersionAlert from './components/NewVersionAlert'
import ScrollToTop from './components/ScrollToTop'
import NetworkErrorModal from './components/NetworkErrorModal'
import { useProfile, useProfileDispatch } from './models/profile'
import {
  RegularLanding as LandingPage,
  SurgeLanding as SurgeLandingPage,
} from './pages/Landing'
import IndexPage from './pages/Index'
import PageLayout from './components/PageLayout'
import { Profile } from './types'
import { isRunInSurge } from './utils'
import { ExistingProfiles, LastUsedProfile } from './utils/constant'

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
const DnsPage = loadable(() => import('./pages/Dns'), {
  fallback: <FullLoading />,
})
const DevicesPage = loadable(() => import('./pages/Devices'), {
  fallback: <FullLoading />,
})
const ProfilePage = loadable(() => import('./pages/Profiles/Current'), {
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

if (
  !!process.env.REACT_APP_DEBUG_GA ||
  (process.env.NODE_ENV === 'production' && process.env.REACT_APP_ENABLE_GA)
) {
  ReactGA.initialize('UA-146417304-2', {
    debug: !!process.env.REACT_APP_DEBUG_GA,
  })
}

const App: React.FC = () => {
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)
  const location = useLocation()
  const history = useHistory()
  const profileDispatch = useProfileDispatch()
  const profile = useProfile()
  const [hasInit, setHasInit] = useState(false)

  const onCloseApplication = useCallback(() => {
    if (isRunInSurge()) {
      store.remove(LastUsedProfile)
      store.remove(ExistingProfiles)
    }

    window.location.replace('/')
  }, [])

  useEffect(
    () => {
      const existingProfiles = store.get(ExistingProfiles)
      const lastId = store.get(LastUsedProfile)
      const result = find<Profile>(existingProfiles, { id: lastId })

      if (result) {
        profileDispatch({
          type: 'update',
          payload: result,
        })
      }

      setHasInit(true)
    },
    // eslint-disable-next-line
    [],
  )

  useEffect(() => {
    if (hasInit && !profile && location.pathname !== '/') {
      history.replace('/')
    }
  }, [hasInit, history, location.pathname, profile])

  useEffect(() => {
    ReactGA.pageview(location.pathname)
  }, [location.pathname])

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
      <ScrollToTop />
      <ToastContainer />
      <NetworkErrorModal
        reloadButton={isRunInSurge()}
        isOpen={isNetworkModalOpen}
        onClose={onCloseApplication}
      />
      <NewVersionAlert />

      <PageLayout>
        <Switch>
          <Route exact path="/">
            {isRunInSurge() ? <SurgeLandingPage /> : <LandingPage />}
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
          <Route exact path="/dns">
            <DnsPage />
          </Route>
          <Route exact path="/devices">
            <DevicesPage />
          </Route>
          <Route exact path="/profiles/current">
            <ProfilePage />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </PageLayout>
    </SWRConfig>
  )
}

export default App
