/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import { Card, Heading } from '@sumup/circuit-ui'
import tw, { TwStyle } from 'twin.macro'
import React, { MouseEventHandler } from 'react'

interface MenuTileProps {
  style?: TwStyle
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
    <div onClick={handleClick} css={[props.onClick && tw`cursor-pointer`]}>
      <Card
        shadow="single"
        css={[
          css`
            min-height: 8rem;
          `,
          tw`p-4`,
          props.style || tw`bg-gray-100`,
        ]}>
        {props.children}
      </Card>
    </div>
  )
}

export const MenuTileContent = styled.div``

export const MenuTileTitle: React.FC<{ style?: TwStyle; title: string }> = ({
  style,
  title,
}) => {
  return (
    <Heading size={'mega'} noMargin css={style || tw`text-gray-800`}>
      {title}
    </Heading>
  )
}

export default MenuTile
