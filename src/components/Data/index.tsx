import React from 'react'
import styled from '@emotion/styled'
import tw from 'twin.macro'

import { cn } from '@/utils/shadcn'

export const DataGroup: React.FC<{
  title?: string
  children: React.ReactNode
  className?: string
}> = (props) => {
  return (
    <div className={cn(props.className)}>
      {props.title && (
        <div className="text-gray-600 text-sm leading-normal px-3 mb-1 truncate lg:text-base lg:leading-relaxed">
          {props.title}
        </div>
      )}
      <div className="divide-y divide-gray-200 bg-gray-100 rounded-lg mb-4 overflow-hidden">
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
  ${tw`flex items-center justify-between px-3 leading-normal text-xs text-gray-800 lg:text-sm lg:leading-relaxed`}

  & > div:last-of-type {
    ${tw`text-gray-600`}
  }
`
