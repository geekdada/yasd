/** @jsx jsx */
import { jsx } from '@emotion/core'
import css from '@emotion/css/macro'
import React from 'react'
import tw from 'twin.macro'

import { isTruthy } from '../../../utils'

const MethodBadge: React.FC<{
  failed: 1 | 0 | boolean
  method: string
  status: string
}> = ({ failed, method, status, ...args }) => {
  return (
    <div
      {...args}
      css={[
        tw`rounded px-1 text-white inline-block`,
        css`
          height: 1rem;
          line-height: 1rem;
          font-size: 0.5rem;
        `,
        isTruthy(failed)
          ? tw`bg-red-500`
          : status === 'Active'
          ? tw`bg-green-500`
          : tw`bg-blue-500`,
      ]}>
      {method.toUpperCase()}
    </div>
  )
}

export default MethodBadge
