/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import dayjs from 'dayjs'
import tw from 'twin.macro'
import React from 'react'

import { RequestItem } from '../../../types'
import MethodBadge from './MethodBadge'

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
        <MethodBadge
          method={req.method}
          failed={req.failed}
          status={req.status}
        />
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
