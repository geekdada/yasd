/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import bytes from 'bytes'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import tw from 'twin.macro'
import React from 'react'

import { RequestItem } from '../../../types'
import MethodBadge from './MethodBadge'

const ListItem: React.FC<{ req: RequestItem }> = ({ req }) => {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <div tw="text-sm truncate">{req.URL}</div>
      <div
        css={[
          tw`flex items-center leading-none truncate`,
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
          <span>{req.policyName}</span>
        </div>
        <div tw="text-xs ml-1">
          <span> - </span>
          <span>{bytes(req.inBytes + req.outBytes)}</span>
        </div>
        <div tw="text-xs ml-1">
          <span> - </span>
          <span>{t(`requests.${req.status.toLowerCase()}`)}</span>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ListItem
