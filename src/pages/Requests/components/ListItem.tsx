import React from 'react'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'
import bytes from 'bytes'
import dayjs from 'dayjs'

import { RequestItem } from '@/types'

import MethodBadge from './MethodBadge'

const ListItem: React.FC<{ req: RequestItem }> = ({ req }) => {
  const { t } = useTranslation()

  const formatStatusKey = (str: string): string =>
    str.toLowerCase().replace(/\s/g, '_')

  return (
    <>
      <div className="text-sm truncate">{req.URL}</div>
      <div
        className="flex items-center leading-none truncate"
        css={css`
          height: 1.5rem;
        `}
      >
        <MethodBadge
          method={req.method}
          failed={req.failed}
          status={req.status || ''}
        />
        <div className="text-xs ml-1">#{req.id}</div>
        <div className="text-xs ml-1">
          <span> - </span>
          <span>{dayjs.unix(req.startDate).format('HH:mm:ss')}</span>
        </div>
        {req.policyName ? (
          <div className="text-xs ml-1">
            <span> - </span>
            <span>{req.policyName}</span>
          </div>
        ) : null}
        <div className="text-xs ml-1">
          <span> - </span>
          <span>{bytes(req.inBytes + req.outBytes)}</span>
        </div>
        {req.status ? (
          <div className="text-xs ml-1">
            <span> - </span>
            <span>{t(`requests.${formatStatusKey(req.status)}`)}</span>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default ListItem
