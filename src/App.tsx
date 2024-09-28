import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { SWRConfig } from 'swr'

import NetworkErrorModal from '@/components/NetworkErrorModal'
import NewVersionAlert from '@/components/NewVersionAlert'
import PageLayout from '@/components/PageLayout'
import RunInSurge from '@/components/RunInSurge'
import useTrafficUpdater from '@/hooks/useTrafficUpdater'
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
      <Toaster position="top-right" reverseOrder={false} />

      <NetworkErrorModal
        reloadButton
        isOpen={isNetworkModalOpen}
        onClose={onCloseApplication}
      />

      <RunInSurge not>
        <NewVersionAlert />
      </RunInSurge>

      <PageLayout>
        <Outlet />
      </PageLayout>
    </SWRConfig>
  )
}

export default App
