/** @jsx jsx */
import { jsx } from '@emotion/core'
import css from '@emotion/css/macro'
import React from 'react'
import tw from 'twin.macro'

const MethodBadge: React.FC<{
  failed: number
  method: string
  status: string
}> = ({ failed, method, status }) => {
  return (
    <div
      css={[
        tw`rounded px-1 text-white inline-block`,
        css`
          height: 1rem;
          line-height: 1rem;
          font-size: 0.5rem;
        `,
        failed === 1
          ? tw`bg-red-500`
          : status === 'Active'
          ? tw`bg-green-500`
          : tw`bg-blue-500`,
      ]}>
      {method}
    </div>
  )
}

export default MethodBadge
