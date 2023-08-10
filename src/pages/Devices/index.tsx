import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import PageContainer from '@/components/PageContainer'
import PageTitle from '@/components/PageTitle'
import { DevicesResult } from '@/types'
import fetcher from '@/utils/fetcher'

import DeviceItem from './components/DeviceItem'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(false)
  const { data: devices } = useSWR<DevicesResult>('/devices', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: isAutoRefresh ? 2000 : 0,
  })

  return (
    <PageContainer>
      <PageTitle
        title={t('home.device_management')}
        hasAutoRefresh={true}
        defaultAutoRefreshState={false}
        onAutoRefreshStateChange={(newState) => setIsAutoRefresh(newState)}
      />

      <div className="divide-y divide-gray-200">
        {devices?.devices &&
          devices.devices.map((device) => (
            <div key={device.identifier}>
              <DeviceItem device={device} />
            </div>
          ))}
      </div>
    </PageContainer>
  )
}

export default Page
