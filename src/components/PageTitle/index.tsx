/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Heading } from '@sumup/circuit-ui'
import { Spinner } from '@sumup/icons'
import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import tw from 'twin.macro'
import BackButton from '../BackButton'

interface PageTitleProps {
  title: string
  hasAutoRefresh?: boolean
  defaultAutoRefreshState?: boolean
  onAuthRefreshStateChange?: (newState: boolean) => void
}

const PageTitle: React.FC<PageTitleProps> = (props) => {
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(
    () => props.defaultAutoRefreshState ?? false,
  )

  useEffect(() => {
    if (props.hasAutoRefresh && props.onAuthRefreshStateChange) {
      props.onAuthRefreshStateChange(isAutoRefresh)
    }
  }, [
    isAutoRefresh,
    props,
    props.hasAutoRefresh,
    props.onAuthRefreshStateChange,
  ])

  return (
    <Heading
      size={'tera'}
      noMargin
      tw="sticky top-0 flex items-center justify-between shadow bg-white z-10 px-3 py-3">
      <div tw="flex items-center">
        <BackButton />
        <div>{props.title}</div>
      </div>

      {props.hasAutoRefresh && (
        <div
          onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          css={[
            tw`bg-blue-500 text-white cursor-pointer w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ease-in-out`,
            isAutoRefresh && tw`bg-red-400`,
          ]}>
          <Spinner css={[tw`w-6 h-6`, isAutoRefresh && tw`animate-spin`]} />
        </div>
      )}
    </Heading>
  )
}

export default PageTitle
