import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import { ChevronRight } from '@sumup/icons'
import bytes from 'bytes'
import dayjs from 'dayjs'

import ActionsModal, { Action } from '@/components/ActionsModal'
import { DataRow, DataRowMain, DataRowSub } from '@/components/Data'
import VersionSupport from '@/components/VersionSupport'
import { useSurgeHost } from '@/models/profile'
import { DeviceInfo } from '@/types'

import DeviceIcon from './DeviceIcon'
import DeviceSettingsModal from './DeviceSettingsModal'

const DeviceItem = ({ device }: { device: DeviceInfo }): JSX.Element => {
  const { t } = useTranslation()
  const surgeHost = useSurgeHost()
  const navigate = useNavigate()
  const [isDeviceSettingsModalOpen, setDeviceSettingsModalOpen] =
    useState(false)
  const [actions, setActions] = useState<Action[] | null>(null)

  const onClick = useCallback(() => {
    const actions = [
      {
        id: 'view_requests',
        title: 'devices.view_requests',
        onClick: () => {
          navigate(`/requests?source=${device.displayIPAddress}`)
        },
      },
    ]

    if (device.dhcpDevice) {
      actions.push({
        id: 'device_settings',
        title: 'devices.device_settings',
        onClick: () => {
          setDeviceSettingsModalOpen(true)
        },
      })
    }

    setActions(actions)
  }, [device.dhcpDevice, device.displayIPAddress, navigate])

  const gateway = useMemo<boolean>(() => {
    const { hasTCPConnection } = device
    return hasTCPConnection || Boolean(device?.dhcpDevice?.shouldHandledBySurge)
  }, [device])

  const mode = useMemo<string>(() => {
    let result = t('devices.not_handled_by_surge')
    const { hasProxyConnection } = device

    if (gateway && hasProxyConnection) {
      result = t('devices.proxy_and_gateway_mode')
    } else if (hasProxyConnection) {
      result = t('devices.proxy_mode')
    } else if (gateway) {
      result = t('devices.gateway_mode')
    }

    return result
  }, [t, device, gateway])

  const waitingToReconnect = useMemo<boolean>(() => {
    return Boolean(device?.dhcpDevice?.waitingToReconnect)
  }, [device.dhcpDevice])

  return (
    <>
      <DataRow className="hover:bg-gray-100 cursor-pointer" onClick={onClick}>
        <DataRowMain>
          <div className="flex items-center w-full overflow-hidden">
            {surgeHost ? (
              <VersionSupport macos="4.1.1" ios="4.11.0">
                <div className="flex-1">
                  <DeviceIcon icon={device.dhcpDevice?.icon} />
                </div>
              </VersionSupport>
            ) : (
              <React.Fragment />
            )}
            <div className="w-full overflow-hidden">
              <div className="truncate pr-5">{device.name}</div>
              <div className="text-sm text-gray-600">
                {device.displayIPAddress}
              </div>
            </div>
          </div>
          <div className="flex items-center flex-1 font-bold">
            {waitingToReconnect ? (
              <div
                css={css`
                  white-space: nowrap;
                `}
              >
                {t('devices.waiting')}
              </div>
            ) : (
              (gateway || device.hasProxyConnection) && (
                <div>{bytes(device.currentSpeed) + '/s'}</div>
              )
            )}

            <div className="ml-3">
              <ChevronRight />
            </div>
          </div>
        </DataRowMain>
        <div className="pb-3">
          <DataRowSub>
            <div>{t('devices.mac_address')}</div>
            <div>{device.physicalAddress || 'N/A'}</div>
          </DataRowSub>
          <DataRowSub>
            <div>{t('devices.vendor')}</div>
            <div>{device.vendor || 'N/A'}</div>
          </DataRowSub>

          {device.dhcpDevice ? (
            <React.Fragment>
              <DataRowSub>
                <div>{t('devices.dhcp_last_seen')}</div>
                <div>
                  {dayjs(device.dhcpDevice.dhcpLastSeen).format('L LTS')}
                </div>
              </DataRowSub>
              <DataRowSub>
                <div>{t('devices.dhcp_hostname')}</div>
                <div>{device.dhcpDevice.dhcpHostname || 'N/A'}</div>
              </DataRowSub>
            </React.Fragment>
          ) : null}

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

          <DataRowSub>
            <div>{t('devices.mode')}</div>
            <div>{mode}</div>
          </DataRowSub>
        </div>
      </DataRow>

      {device.dhcpDevice ? (
        <DeviceSettingsModal
          title={device.dhcpDevice.displayName || device.name}
          dhcpDevice={device.dhcpDevice}
          open={isDeviceSettingsModalOpen}
          onClose={() => setDeviceSettingsModalOpen(false)}
        />
      ) : null}

      {actions ? (
        <ActionsModal
          defaultOpen
          title={device?.dhcpDevice?.displayName || device.name}
          actions={actions}
        />
      ) : null}
    </>
  )
}

export default DeviceItem
