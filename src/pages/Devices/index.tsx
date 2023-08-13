import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import ListCell from '@/components/ListCell'
import PageContainer from '@/components/PageContainer'
import PageTitle from '@/components/PageTitle'
import { DevicesResult } from '@/types'
import fetcher from '@/utils/fetcher'
import withProfile from '@/utils/with-profile'

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

      <div className="divide-y">
        {devices?.devices &&
          devices.devices.map((device) => (
            <ListCell key={device.identifier}>
              <DeviceItem device={device} />
            </ListCell>
          ))}
      </div>
    </PageContainer>
  )
}

export default withProfile(Page)
