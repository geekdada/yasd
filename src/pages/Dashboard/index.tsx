/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { useState } from 'react'
import css from '@emotion/css/macro'
import tw from 'twin.macro'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import PageContainer from '../../components/PageContainer'
import PageTitle from '../../components/PageTitle'
import { DevicesResult } from '../../types'
import fetcher from '../../utils/fetcher'
import DeviceItem from './components/DeviceItem'
import TrafficCell from './components/TrafficCell'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(false)
  const { data: devices, error: devicesError } = useSWR<DevicesResult>(
    '/devices',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: isAutoRefresh ? 2000 : 0,
    },
  )

  return (
    <PageContainer>
      <PageTitle
        title={t('home.dashboard')}
        hasAutoRefresh={true}
        defaultAutoRefreshState={false}
        onAuthRefreshStateChange={(newState) => setIsAutoRefresh(newState)}
      />

      <div tw="mb-4">
        <TrafficCell />
      </div>

      <div tw="divide-y divide-gray-200">
        {devices?.devices &&
          devices.devices
            .filter((device) => {
              return device?.hasTCPConnection
            })
            .sort((d1, d2) => {
              return d2.currentSpeed - d1.currentSpeed
            })
            .map((device) => (
              <div key={device.identifier}>
                <DeviceItem device={device} />
              </div>
            ))}
      </div>
    </PageContainer>
  )
}

export default Page
