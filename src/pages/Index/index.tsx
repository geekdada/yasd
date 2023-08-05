import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import { Button, Headline, Toggle } from '@sumup/circuit-ui'
import { delay } from 'bluebird'
import store from 'store2'
import useSWR, { mutate } from 'swr'

import Ad from '@/components/Ad'
import ChangeLanguage from '@/components/ChangeLanguage'
import { DataGroup, DataRow, DataRowMain } from '@/components/Data'
import VersionSupport from '@/components/VersionSupport'
import {
  usePlatform,
  usePlatformBuild,
  usePlatformVersion,
  useProfile,
} from '@/models/profile'
import { Capability } from '@/types'
import { forceRefresh, isRunInSurge } from '@/utils'
import { ExistingProfiles, LastUsedProfile } from '@/utils/constant'
import fetcher from '@/utils/fetcher'

import Events from './components/Events'
import HostInfo from './components/HostInfo'
import MenuTile, { MenuTileTitle } from './components/MenuTile'
import SetHostModal from './components/SetHostModal'
import TrafficCell from './components/TrafficCell'
import menu from './menu'

const Page: React.FC = () => {
  const navigate = useNavigate()
  const profile = useProfile()
  const { data: systemProxy } = useSWR<Capability>(
    profile?.platform === 'macos' ? '/features/system_proxy' : null,
    fetcher,
  )
  const { data: enhancedMode } = useSWR<Capability>(
    profile?.platform === 'macos' ? '/features/enhanced_mode' : null,
    fetcher,
  )
  const { t } = useTranslation()
  const platform = usePlatform()
  const platformVersion = usePlatformVersion()
  const platformBuild = usePlatformBuild()

  const toggleSystemProxy = useCallback(() => {
    fetcher({
      method: 'POST',
      url: '/features/system_proxy',
      data: {
        enabled: !systemProxy?.enabled,
      },
    })
      .then(() => {
        return delay(100).then(() => mutate('/features/system_proxy'))
      })
      .catch((err) => {
        console.error(err)
      })
  }, [systemProxy])

  const toggleEnhancedMode = useCallback(() => {
    fetcher({
      method: 'POST',
      url: '/features/enhanced_mode',
      data: {
        enabled: !enhancedMode?.enabled,
      },
    })
      .then(() => {
        return delay(100).then(() => mutate('/features/enhanced_mode'))
      })
      .catch((err) => {
        console.error(err)
      })
  }, [enhancedMode])

  const logout = () => {
    store.remove(LastUsedProfile)
    store.remove(ExistingProfiles)
    window.location.reload()
  }

  const openLink = (link?: string) => {
    if (!link) return

    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener noreferrer')
    } else {
      navigate(link)
    }
  }

  return (
    <div
      css={css`
        padding-bottom: calc(env(safe-area-inset-bottom) + 1.25rem);
      `}
    >
      <Headline
        size="two"
        as="h2"
        className="sticky top-0 flex shadow bg-white z-10 px-3 py-3 mb-4"
      >
        {profile && (
          <div className="w-full flex justify-between items-center">
            <div className="w-2/3" onDoubleClick={forceRefresh}>
              <HostInfo />
            </div>

            {isRunInSurge() ? (
              <div>
                <Button size="kilo" onClick={logout}>
                  {t('home.logout')}
                </Button>
              </div>
            ) : (
              <SetHostModal />
            )}
          </div>
        )}
      </Headline>

      <div
        css={css`
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        `}
      >
        <div className="mb-4">
          <TrafficCell />
        </div>

        <VersionSupport macos="0.0.0">
          <DataGroup className="mx-4">
            <DataRow>
              <DataRowMain>
                <div className="font-medium">{t('home.system_proxy')}</div>
                <div>
                  <Toggle
                    label="toggle"
                    checkedLabel="checked"
                    uncheckedLabel="unchecked"
                    checked={systemProxy?.enabled}
                    onChange={() => toggleSystemProxy()}
                  />
                </div>
              </DataRowMain>
            </DataRow>
            <DataRow>
              <DataRowMain>
                <div className="font-medium">{t('home.enhanced_mode')}</div>
                <div>
                  <Toggle
                    label="toggle"
                    checkedLabel="checked"
                    uncheckedLabel="unchecked"
                    checked={enhancedMode?.enabled}
                    onChange={() => toggleEnhancedMode()}
                  />
                </div>
              </DataRowMain>
            </DataRow>
          </DataGroup>
        </VersionSupport>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {menu.map((item) => {
            if (
              typeof item.isEnabled === 'function' &&
              !item.isEnabled(platform, platformVersion)
            ) {
              return null
            }

            return (
              <div key={item.title}>
                {item.component ? (
                  item.component
                ) : (
                  <MenuTile onClick={() => openLink(item.link)}>
                    <MenuTileTitle title={t(`home.${item.title}`)} />

                    {item.subTitle && (
                      <div className="text-base text-gray-500">
                        {item.subTitle}
                      </div>
                    )}
                  </MenuTile>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-4 px-4">
          <Events />
        </div>

        <div className="mt-4 px-4">
          <Ad />
        </div>

        <div className="mt-4 px-4">
          <ChangeLanguage />
        </div>

        <div className="text-center mt-4 text-sm">
          {Boolean(platform && platformBuild && platformVersion) && (
            <code className="px-4 py-2 rounded bg-gray-100 text-gray-500">
              v{process.env.REACT_APP_VERSION} - {platform} v{platformVersion}(
              {platformBuild})
            </code>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page
