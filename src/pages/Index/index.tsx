/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react'
import { Card, Heading } from '@sumup/circuit-ui'
import styled from '@emotion/styled/macro'
import tw from 'twin.macro'
import { useHistory } from 'react-router-dom'

import menu from './menu'

const MenuWrapper = styled.div``

const MenuItemWrapper = styled.div``

const MenuItem = styled(Card)`
  min-height: 8rem;
  ${tw`cursor-pointer`}
`

const Page: React.FC = () => {
  const history = useHistory()

  return (
    <div tw="py-5">
      <MenuWrapper tw="flex justify-center">
        {menu.map((item) => {
          return (
            <MenuItemWrapper key={item.title} tw="w-1/2 px-4 mb-5">
              <MenuItem
                shadow="single"
                css={item.tintColor}
                onClick={() => history.push(item.link)}>
                <Heading size={'mega'} css={item.textColor}>
                  {item.title}
                </Heading>
              </MenuItem>
            </MenuItemWrapper>
          )
        })}
      </MenuWrapper>
    </div>
  )
}

export default Page
