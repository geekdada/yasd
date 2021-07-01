/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import { Card, Heading } from '@sumup/circuit-ui'
import tw from 'twin.macro'
import React, { MouseEventHandler } from 'react'

interface MenuTileProps {
  onClick?: MouseEventHandler
  link?: string
}

const MenuTile: React.FC<MenuTileProps> = (props) => {
  const handleClick: MouseEventHandler = (e) => {
    if (props.onClick) {
      props.onClick(e)
    }
  }

  return (
    <div
      onClick={handleClick}
      css={[
        props.onClick &&
          tw`cursor-pointer transform transition-transform duration-100 active:scale-95`,
      ]}>
      <Card
        css={[
          css`
            user-select: none;
            min-height: 8rem;
          `,
          tw`p-4 border-none shadow-sm bg-gray-100 transition-colors duration-150 ease-in-out`,
          props.onClick && tw`hover:bg-gray-200 active:bg-gray-200`,
        ]}>
        {props.children}
      </Card>
    </div>
  )
}

export const MenuTileContent = styled.div``

export const MenuTileTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Heading size={'mega'} noMargin tw="text-gray-800">
      {title}
    </Heading>
  )
}

export default MenuTile
