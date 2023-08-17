import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import { delay } from 'bluebird'
import store from 'store2'
import useSWR, { mutate } from 'swr'

import ChangeLanguage from '@/components/ChangeLanguage'
import DarkModeToggle from '@/components/DarkModeToggle'
import { DataGroup, DataRow, DataRowMain } from '@/components/Data'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import VersionSupport from '@/components/VersionSupport'
import VersionTag from '@/components/VersionTag'
import { usePlatform, usePlatformVersion, useProfile } from '@/store'
import { Capability } from '@/types'
import { forceRefresh, isRunInSurge } from '@/utils'
import { ExistingProfiles, LastUsedProfile } from '@/utils/constant'
import fetcher from '@/utils/fetcher'

import Events from './components/Events'
import HostInfo from './components/HostInfo'
import MenuTile from './components/MenuTile'
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

  const toggleSystemProxy = useCallback(async () => {
    try {
      fetcher({
        method: 'POST',
        url: '/features/system_proxy',
        data: {
          enabled: !systemProxy?.enabled,
        },
      })

      await delay(100)

      await mutate('/features/system_proxy')
    } catch (err) {
      console.error(err)
    }
  }, [systemProxy])

  const toggleEnhancedMode = useCallback(async () => {
    try {
      await fetcher({
        method: 'POST',
        url: '/features/enhanced_mode',
        data: {
          enabled: !enhancedMode?.enabled,
        },
      })

      await delay(100)

      await mutate('/features/enhanced_mode')
    } catch (err) {
      console.error(err)
    }
  }, [enhancedMode])

  const logoutSurge = () => {
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
      <div className="sticky top-0 flex shadow bg-white dark:bg-neutral-900 z-10 px-3 py-3">
        {profile && (
          <div className="w-full flex justify-between items-center">
            <div className="w-2/3" onDoubleClick={() => forceRefresh()}>
              <HostInfo />
            </div>

            {isRunInSurge() ? (
              <div>
                <Button variant="secondary" onClick={() => logoutSurge()}>
                  {t('home.logout')}
                </Button>
              </div>
            ) : (
              <SetHostModal />
            )}
          </div>
        )}
      </div>

      <div
        className="space-y-4 lg:space-y-6"
        css={css`
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        `}
      >
        <div className="pt-4 lg:pt-6">
          <TrafficCell />
        </div>

        <div className="px-4 lg:px-6 space-y-4 lg:space-y-6">
          <VersionSupport macos>
            <DataGroup>
              <DataRow>
                <DataRowMain>
                  <div className="font-bold">{t('home.system_proxy')}</div>
                  <Switch
                    checked={systemProxy?.enabled}
                    onCheckedChange={() => toggleSystemProxy()}
                  />
                </DataRowMain>
              </DataRow>

              <DataRow>
                <DataRowMain>
                  <div className="font-bold">{t('home.enhanced_mode')}</div>
                  <Switch
                    checked={enhancedMode?.enabled}
                    onCheckedChange={() => toggleEnhancedMode()}
                  />
                </DataRowMain>
              </DataRow>
            </DataGroup>
          </VersionSupport>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {menu.map((item) => {
              if (
                typeof item.isEnabled === 'function' &&
                !item.isEnabled(platform, platformVersion)
              ) {
                return null
              }

              return (
                <div key={item.titleKey}>
                  {item.component ? (
                    item.component
                  ) : (
                    <MenuTile
                      title={t(`home.${item.titleKey}`)}
                      description={
                        item.descriptionKey
                          ? t(`home.${item.descriptionKey}`)
                          : undefined
                      }
                      onClick={() => openLink(item.link)}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 px-4 lg:px-6 space-y-4 lg:space-y-6">
        <div>
          <Events />
        </div>

        <div className="flex justify-center items-center space-x-3">
          <ChangeLanguage />
          <DarkModeToggle />
        </div>

        <div className="flex justify-center">
          <VersionTag />
        </div>
      </div>
    </div>
  )
}

export default Page
