/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { useCallback } from 'react'
import { Button, Heading, Toggle } from '@sumup/circuit-ui'
import css from '@emotion/css/macro'
import { useTranslation } from 'react-i18next'
import tw from 'twin.macro'
import { delay } from 'bluebird'
import { useHistory } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import store from 'store2'

import ChangeLanguage from '../../components/ChangeLanguage'
import { DataGroup, DataRow, DataRowMain } from '../../components/Data'
import Ad from '../../components/Ad'
import VersionSupport from '../../components/VersionSupport'
import {
  usePlatform,
  usePlatformBuild,
  usePlatformVersion,
  useProfile,
} from '../../models/profile'
import { Capability } from '../../types'
import { isRunInSurge } from '../../utils'
import { ExistingProfiles, LastUsedProfile } from '../../utils/constant'
import fetcher from '../../utils/fetcher'
import HostInfo from './components/HostInfo'
import TrafficCell from './components/TrafficCell'
import Events from './components/Events'
import MenuTile, { MenuTileTitle } from './components/MenuTile'
import SetHostModal from './components/SetHostModal'
import menu from './menu'

const Page: React.FC = () => {
  const history = useHistory()
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
      history.push(link)
    }
  }

  return (
    <React.Fragment>
      <div
        css={css`
          padding-bottom: calc(env(safe-area-inset-bottom) + 1.25rem);
        `}
      >
        <Heading
          size={'tera'}
          noMargin
          tw="sticky top-0 flex shadow bg-white z-10 px-3 py-3 mb-4"
        >
          {profile && (
            <div tw="w-full flex justify-between items-center">
              <div
                tw="w-2/3"
                onDoubleClick={() => window.location.reload(true)}
              >
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
        </Heading>

        <div
          css={css`
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
          `}
        >
          <div tw="mb-4">
            <TrafficCell />
          </div>

          <VersionSupport macos="0.0.0">
            <DataGroup tw="mx-4">
              <DataRow>
                <DataRowMain>
                  <div tw="font-medium">{t('home.system_proxy')}</div>
                  <div>
                    <Toggle
                      noMargin
                      label=""
                      labelChecked=""
                      labelUnchecked=""
                      checked={systemProxy?.enabled}
                      onChange={() => toggleSystemProxy()}
                    />
                  </div>
                </DataRowMain>
              </DataRow>
              <DataRow>
                <DataRowMain>
                  <div tw="font-medium">{t('home.enhanced_mode')}</div>
                  <div>
                    <Toggle
                      noMargin
                      label=""
                      labelChecked=""
                      labelUnchecked=""
                      checked={enhancedMode?.enabled}
                      onChange={() => toggleEnhancedMode()}
                    />
                  </div>
                </DataRowMain>
              </DataRow>
            </DataGroup>
          </VersionSupport>

          <div tw="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
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
                        <div tw="text-base text-gray-500">{item.subTitle}</div>
                      )}
                    </MenuTile>
                  )}
                </div>
              )
            })}
          </div>

          <div tw="mt-4 px-4">
            <Events />
          </div>

          <div tw="mt-4 px-4">
            <Ad />
          </div>

          <div tw="mt-4 px-4">
            <ChangeLanguage />
          </div>

          <div tw="text-center mt-4 text-sm">
            {Boolean(platform && platformBuild && platformVersion) && (
              <code tw="px-4 py-2 rounded bg-gray-100 text-gray-500">
                v{process.env.REACT_APP_VERSION} - {platform} v{platformVersion}
                ({platformBuild})
              </code>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Page
