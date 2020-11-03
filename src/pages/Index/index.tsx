/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { useCallback } from 'react'
import { Heading, ModalProvider, Toggle } from '@sumup/circuit-ui'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import tw from 'twin.macro'
import { delay } from 'bluebird'
import { useHistory } from 'react-router-dom'
import useSWR, { mutate } from 'swr'

import { DataGroup, DataRow, DataRowMain } from '../../components/Data'
import ProfileCell from '../../components/ProfileCell'
import Ad from '../../components/Ad'
import { useProfile } from '../../models/profile'
import { Capability } from '../../types'
import fetcher from '../../utils/fetcher'
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

  const openLink = (link?: string) => {
    if (!link) return

    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener noreferrer')
    } else {
      history.push(link)
    }
  }

  return (
    <ModalProvider>
      <div
        css={css`
          padding-bottom: calc(env(safe-area-inset-bottom) + 1.25rem);
        `}>
        <Heading
          size={'tera'}
          noMargin
          tw="sticky top-0 flex shadow bg-white z-10 px-3 py-3 mb-4">
          {profile && (
            <div tw="w-full flex justify-between items-center">
              <div
                css={[tw`w-2/3 bg-gray-100 rounded-lg`]}
                onDoubleClick={() => window.location.reload(true)}>
                <ProfileCell variant="left" profile={profile} />
              </div>
              <SetHostModal />
            </div>
          )}
        </Heading>

        <div
          css={css`
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
          `}>
          <div tw="mb-4">
            <TrafficCell />
          </div>

          {profile?.platform === 'macos' && (
            <DataGroup tw="mx-4">
              <DataRow>
                <DataRowMain>
                  <div tw="font-medium">System Proxy</div>
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
                  <div tw="font-medium">Enhanced Mode</div>
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
          )}

          <div tw="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
            {menu.map((item) => {
              return (
                <div key={item.title}>
                  {item.component ? (
                    item.component
                  ) : (
                    <MenuTile
                      style={item.tintColor}
                      onClick={() => openLink(item.link)}>
                      <MenuTileTitle title={item.title} />

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
        </div>
      </div>
    </ModalProvider>
  )
}

export default Page
