/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import dayjs from 'dayjs'
import tw from 'twin.macro'
import React from 'react'
import { RequestItem } from '../../../types'

const ListItem: React.FC<{ req: RequestItem }> = ({ req }) => {
  return (
    <div>
      <div tw="text-xs truncate text-gray-700">{req.URL}</div>
      <div tw="text-sm truncate">
        {req.policyName}({req.rule})
      </div>
      <div
        css={[
          tw`flex items-center leading-none`,
          css`
            height: 1.5rem;
          `,
        ]}>
        <div
          css={[
            tw`rounded px-1 text-white`,
            css`
              height: 1rem;
              line-height: 1rem;
              font-size: 0.5rem;
            `,
            req.status === 'Active' ? tw`bg-green-500` : tw`bg-blue-500`,
          ]}>
          {req.method}
        </div>
        <div tw="text-xs ml-1">#{req.id}</div>
        <div tw="text-xs ml-1">
          {dayjs.unix(req.startDate).format('HH:mm:ss')}
        </div>
        <div tw="text-xs ml-1">{req.status}</div>
      </div>
    </div>
  )
}

export default ListItem
