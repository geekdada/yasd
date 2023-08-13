import React from 'react'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { MoveRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { TypographyH4 } from '@/components/ui/typography'

interface MenuTileProps {
  title: string
  description?: string
  onClick?: () => void
  link?: string
  switchElement?: React.ReactNode
}

const MenuTile: React.FC<MenuTileProps> = (props) => {
  const handleClick = () => {
    if (props.onClick) {
      props.onClick()
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="border-b border-gray-900/5 bg-gray-50 dark:bg-muted space-y-4 justify-center"
        css={css`
          height: 3.8rem;
        `}
      >
        <div className="flex items-center gap-8 justify-between">
          <CardTitle>{props.title}</CardTitle>
          {props.switchElement}
        </div>
      </CardHeader>

      <CardContent
        className="p-5 flex items-center justify-between gap-4"
        css={css`
          height: 5rem;
        `}
      >
        {props.description ? (
          <CardDescription>{props.description}</CardDescription>
        ) : (
          <div></div>
        )}

        {props.onClick ? (
          <div className="flex justify-end">
            <Button size="icon" variant="outline" onClick={() => handleClick()}>
              <MoveRightIcon />
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export const MenuTileContent = styled.div``

export const MenuTileTitle: React.FC<{ title: string }> = ({ title }) => {
  return <TypographyH4 className="text-gray-800">{title}</TypographyH4>
}

export default MenuTile
