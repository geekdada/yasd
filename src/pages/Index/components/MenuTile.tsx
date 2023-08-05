import React, { MouseEventHandler } from 'react'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Card, Headline } from '@sumup/circuit-ui'
import tw from 'twin.macro'

import { cn } from '../../../utils/shadcn'

interface MenuTileProps {
  children: React.ReactNode
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
      ]}
    >
      <Card
        className={cn(
          'p-4 border-none shadow-sm bg-gray-100 transition-colors duration-150 ease-in-out',
          props.onClick && 'hover:bg-gray-200 active:bg-gray-200',
        )}
        css={[
          css`
            user-select: none;
            min-height: 8rem;
          `,
        ]}
      >
        {props.children}
      </Card>
    </div>
  )
}

export const MenuTileContent = styled.div``

export const MenuTileTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Headline size="four" as="h4" className="text-gray-800">
      {title}
    </Headline>
  )
}

export default MenuTile
