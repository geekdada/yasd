/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { useCallback } from 'react'
import { Card, Heading, Toggle } from '@sumup/circuit-ui'
import styled from '@emotion/styled/macro'
import tw from 'twin.macro'
import { useHistory } from 'react-router-dom'
import useSWR, { mutate } from 'swr'

import { DataGroup, DataRow, DataRowMain } from '../../components/Data'
import { Capability } from '../../types'
import fetcher from '../../utils/fetcher'
import Events from './components/Events'
import MenuTile, { MenuTileTitle } from './components/MenuTile'
import TrafficCell from './components/TrafficCell'
import menu from './menu'

const MenuWrapper = styled.div``

const MenuItemWrapper = styled.div``

const Page: React.FC = () => {
  const history = useHistory()
  const { data: systemProxy } = useSWR<Capability>(
    '/features/system_proxy',
    fetcher,
  )
  const { data: enhancedMode } = useSWR<Capability>(
    '/features/enhanced_mode',
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
        return mutate('/features/system_proxy')
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
        return mutate('/features/enhanced_mode')
      })
      .catch((err) => {
        console.error(err)
      })
  }, [enhancedMode])

  return (
    <div tw="pb-5">
      <Heading
        size={'tera'}
        noMargin
        tw="sticky top-0 flex shadow bg-white z-10 px-3 py-3 mb-4">
        YASD
      </Heading>

      <div tw="mb-4">
        <TrafficCell />
      </div>

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

      <MenuWrapper tw="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {menu.map((item) => {
          return (
            <MenuItemWrapper key={item.title}>
              {item.component ? (
                item.component
              ) : (
                <MenuTile
                  style={item.tintColor}
                  onClick={() => item.link && history.push(item.link)}>
                  <MenuTileTitle title={item.title} />
                </MenuTile>
              )}
            </MenuItemWrapper>
          )
        })}
      </MenuWrapper>

      <div tw="mt-4">
        <Events />
      </div>
    </div>
  )
}

export default Page
