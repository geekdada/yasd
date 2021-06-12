/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useModal } from '@sumup/circuit-ui'
import { noop } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import css from '@emotion/css/macro'
import { useTranslation } from 'react-i18next'
import tw from 'twin.macro'
import bytes from 'bytes'
import dayjs from 'dayjs'
import { ChevronRight } from '@sumup/icons'

import { DataRow, DataRowMain, DataRowSub } from '../../../components/Data'
import VersionSupport from '../../../components/VersionSupport'
import { useSurgeHost } from '../../../models/profile'
import { DeviceInfo } from '../../../types'
import DeviceIcon from './DeviceIcon'
import DeviceSettingsModal from './DeviceSettingsModal'

const DeviceItem = ({ device }: { device: DeviceInfo }): JSX.Element => {
  const { t } = useTranslation()
  const { setModal } = useModal()
  const surgeHost = useSurgeHost()
  const isClickable = !!device.dhcpDevice

  const onClick = useCallback(() => {
    setModal({
      children({ onClose }) {
        return onClose && device.dhcpDevice ? (
          <DeviceSettingsModal
            title={device.dhcpDevice.displayName || device.name}
            dhcpDevice={device.dhcpDevice}
            onClose={onClose}
          />
        ) : (
          <React.Fragment />
        )
      },
    })
  }, [device, setModal])

  return (
    <DataRow
      css={[isClickable && tw`hover:bg-gray-100 cursor-pointer`]}
      onClick={isClickable ? onClick : noop}>
      <DataRowMain>
        <div tw="flex items-center w-full overflow-hidden">
          {device?.dhcpDevice?.icon && surgeHost ? (
            <VersionSupport macos="4.1.1" ios="4.11.0">
              <div tw="flex-1">
                <DeviceIcon icon={device.dhcpDevice.icon} />
              </div>
            </VersionSupport>
          ) : (
            <React.Fragment />
          )}
          <div tw="w-full overflow-hidden">
            <div tw="truncate pr-5">{device.name}</div>
            <div tw="text-sm text-gray-600">{device.displayIPAddress}</div>
          </div>
        </div>
        <div tw="flex items-center flex-1">
          <div tw="font-bold">{bytes(device.currentSpeed) + '/s'}</div>
          {isClickable && (
            <div tw="ml-3">
              <ChevronRight />
            </div>
          )}
        </div>
      </DataRowMain>
      <div tw="pb-3">
        <DataRowSub>
          <div>{t('devices.mac_address')}</div>
          <div>{device.physicalAddress}</div>
        </DataRowSub>
        <DataRowSub>
          <div>{t('devices.vendor')}</div>
          <div>{device.vendor}</div>
        </DataRowSub>

        {device.dhcpDevice ? (
          <React.Fragment>
            <DataRowSub>
              <div>{t('devices.dhcp_last_seen')}</div>
              <div>{dayjs(device.dhcpDevice.dhcpLastSeen).format('L LTS')}</div>
            </DataRowSub>
            <DataRowSub>
              <div>{t('devices.dhcp_hostname')}</div>
              <div>{device.dhcpDevice.dhcpHostname || 'N/A'}</div>
            </DataRowSub>
            <DataRowSub>
              <div>{t('devices.mode')}</div>
              <div>
                {device.dhcpDevice.handledBySurge
                  ? t('devices.handled_by_surge')
                  : t('devices.not_handled_by_surge')}
              </div>
            </DataRowSub>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <DataRowSub>
              <div>{t('devices.mode')}</div>
              <div>{t('devices.gateway_mode')}</div>
            </DataRowSub>
          </React.Fragment>
        )}

        {(device.hasTCPConnection || device.hasProxyConnection) && (
          <React.Fragment>
            <DataRowSub>
              <div>{t('devices.active_connections')}</div>
              <div>{device.activeConnections}</div>
            </DataRowSub>
            <DataRowSub>
              <div>{t('devices.total_connections')}</div>
              <div>{device.totalConnections}</div>
            </DataRowSub>
            <DataRowSub>
              <div>{t('devices.total_bytes')}</div>
              <div>{bytes(device.totalBytes)}</div>
            </DataRowSub>
            <DataRowSub>
              <div>{t('devices.top_host')}</div>
              <div>{device.topHostBySingleConnectionTraffic || 'N/A'}</div>
            </DataRowSub>
          </React.Fragment>
        )}
      </div>
    </DataRow>
  )
}

export default DeviceItem
