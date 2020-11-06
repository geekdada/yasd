/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import bytes from 'bytes'
import dayjs from 'dayjs'
import tw from 'twin.macro'
import React from 'react'

import { RequestItem } from '../../../types'
import MethodBadge from './MethodBadge'

const ListItem: React.FC<{ req: RequestItem }> = ({ req }) => {
  return (
    <React.Fragment>
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
          <span> - </span>
          <span>{dayjs.unix(req.startDate).format('HH:mm:ss')}</span>
        </div>
        <div tw="text-xs ml-1">
          <span> - </span>
          <span>{bytes(req.inBytes + req.outBytes)}</span>
        </div>
        <div tw="text-xs ml-1">
          <span> - </span>
          <span>{req.status}</span>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ListItem
