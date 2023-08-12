import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { toast, ToastContainer as OriginalToastContainer } from 'react-toastify'
import styled from '@emotion/styled'
import { init } from 'i18next'
import { find } from 'lodash-es'
import store from 'store2'
import { SWRConfig } from 'swr'
import tw from 'twin.macro'

import FullLoading from '@/components/FullLoading'
import NetworkErrorModal from '@/components/NetworkErrorModal'
import NewVersionAlert from '@/components/NewVersionAlert'
import PageLayout from '@/components/PageLayout'
import useTrafficUpdater from '@/hooks/useTrafficUpdater'
import {
  HistoryActions,
  ProfileActions,
  useHistory,
  useHistoryDispatch,
  usePlatformVersion,
  useProfile,
  useProfileDispatch,
} from '@/models'
import HomePage from '@/pages/Home'
import { LandingPage } from '@/pages/Landing'
import { Profile } from '@/types'
import { isRunInSurge } from '@/utils'
import { LastUsedLanguage, LastUsedProfile } from '@/utils/constant'
import { httpClient } from '@/utils/fetcher'

import 'react-toastify/dist/ReactToastify.css'

const PoliciesPage = lazy(() => import('@/pages/Policies'))
const RequestsPage = lazy(() => import('@/pages/Requests'))
const TrafficPage = lazy(() => import('@/pages/Traffic'))
const ModulesPage = lazy(() => import('@/pages/Modules'))
const ScriptingPage = lazy(() => import('@/pages/Scripting'))
const EvaluatePage = lazy(() => import('@/pages/Scripting/Evaluate'))
const DnsPage = lazy(() => import('@/pages/Dns'))
const DevicesPage = lazy(() => import('@/pages/Devices'))
const ProfilePage = lazy(() => import('@/pages/Profiles/Current'))
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
  // Enable Sashimi Analytics
  // Use process.env.REACT_APP_DEBUG_GA to enable debug mode
}

const App: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const historyDispatch = useHistoryDispatch()
  const profileDispatch = useProfileDispatch()
  const platformVersion = usePlatformVersion()
  const profile = useProfile()
  const history = useHistory()

  const [hasInit, setHasInit] = useState(false)
  const isCurrentVersionFetched = useRef(true)

  useTrafficUpdater()

  const onCloseApplication = useCallback(() => {
    if (isRunInSurge()) {
      historyDispatch({
        type: HistoryActions.DELETE_ALL_HISTORY,
      })
    }

    window.location.replace('/')
  }, [historyDispatch])

  useEffect(() => {
    historyDispatch({
      type: HistoryActions.LOAD_HISTORY,
    })
  }, [historyDispatch])

  useEffect(() => {
    if (history && !profile && location.pathname !== '/') {
      navigate('/', { replace: true })
    }
  }, [hasInit, history, location, navigate, profile])

  useEffect(() => {
    // Log page view
  }, [location.pathname])

  useEffect(() => {
    const language: string | null = store.get(LastUsedLanguage)

    if (language && language !== i18n.language) {
      i18n.changeLanguage(language)
    }
  }, [i18n])

  useEffect(() => {
    if (
      !profile?.platform ||
      !isCurrentVersionFetched.current ||
      location.pathname === '/'
    ) {
      return
    }

    httpClient
      .request({
        url: '/environment',
        method: 'GET',
      })
      .then((res) => {
        const currentPlatformVersion = res.headers['x-surge-version']

        if (currentPlatformVersion !== platformVersion) {
          profileDispatch({
            type: ProfileActions.UpdatePlatformVersion,
            payload: {
              platformVersion: currentPlatformVersion,
            },
          })
        }

        isCurrentVersionFetched.current = false
      })
      .catch((err) => {
        console.error(err)
        toast.error(t('common.surge_too_old'))
      })
  }, [location, platformVersion, profile?.platform, profileDispatch, t])

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
      }}
    >
      <ToastContainer />
      <NetworkErrorModal
        reloadButton={isRunInSurge()}
        isOpen={isNetworkModalOpen}
        onClose={onCloseApplication}
      />
      <NewVersionAlert />

      <PageLayout>
        <Suspense fallback={<FullLoading />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/traffic" element={<TrafficPage />} />
            <Route path="/modules" element={<ModulesPage />} />
            <Route path="/scripting" element={<ScriptingPage />} />
            <Route path="/scripting/evaluate" element={<EvaluatePage />} />
            <Route path="/dns" element={<DnsPage />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/profiles/current" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </PageLayout>
    </SWRConfig>
  )
}

export default App
