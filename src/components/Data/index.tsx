/** @jsx jsx */
import { jsx } from '@emotion/core'
import css from '@emotion/css/macro'
import styled from '@emotion/styled/macro'
import tw from 'twin.macro'
import React from 'react'

export const DataGroup: React.FC<{ title?: string }> = (props) => {
  return (
    <div>
      {props.title && (
        <div tw="text-gray-600 text-sm leading-normal px-3 mb-1 truncate">
          {props.title}
        </div>
      )}
      <div tw="divide-y divide-gray-200 bg-gray-100 rounded-lg mb-4 overflow-hidden">
        {props.children}
      </div>
    </div>
  )
}

export const DataRow = styled.div``

export const DataRowMain = styled.div`
  ${tw`flex items-center justify-between px-3 py-3 leading-normal text-gray-800`}

  & > div:last-of-type {
    ${tw`text-gray-600`}
  }
`

export const DataRowSub = styled.div`
  ${tw`flex items-center justify-between px-3 leading-normal text-xs text-gray-800`}

  & > div:last-of-type {
    ${tw`text-gray-600`}
  }
`
