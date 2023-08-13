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
import { SWRConfig } from 'swr'
import tw from 'twin.macro'

import FullLoading from '@/components/FullLoading'
import NetworkErrorModal from '@/components/NetworkErrorModal'
import NewVersionAlert from '@/components/NewVersionAlert'
import PageLayout from '@/components/PageLayout'
import RunInSurge from '@/components/RunInSurge'
import useTrafficUpdater from '@/hooks/useTrafficUpdater'
import HomePage from '@/pages/Home'
import { LandingPage } from '@/pages/Landing'
import {
  usePlatformVersion,
  useAppDispatch,
  useHistory,
  useProfile,
} from '@/store'
import { historyActions } from '@/store/slices/history'
import { profileActions } from '@/store/slices/profile'
import { isRunInSurge } from '@/utils'
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
  const { t } = useTranslation()
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const platformVersion = usePlatformVersion()
  const profile = useProfile()
  const history = useHistory()

  const isCurrentVersionFetched = useRef(true)

  useTrafficUpdater()

  const onCloseApplication = useCallback(() => {
    if (isRunInSurge()) {
      dispatch(historyActions.deleteAllHistory())
    }

    window.location.replace('/')
  }, [dispatch])

  useEffect(() => {
    if (history && !profile && location.pathname !== '/') {
      navigate('/', { replace: true })
    }
  }, [history, location, navigate, profile])

  useEffect(() => {
    // Log page view
  }, [location.pathname])

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
          dispatch(
            profileActions.updatePlatformVersion({
              platformVersion: currentPlatformVersion,
            }),
          )
        }

        isCurrentVersionFetched.current = false
      })
      .catch((err) => {
        console.error(err)
        toast.error(t('common.surge_too_old'))
      })
  }, [dispatch, location, platformVersion, profile?.platform, t])

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
      <RunInSurge not>
        <NewVersionAlert />
      </RunInSurge>

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
