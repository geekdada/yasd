/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Heading } from '@sumup/circuit-ui'
import { Spinner } from '@sumup/icons'
import React, { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import tw from 'twin.macro'
import BackButton from '../BackButton'

interface PageTitleProps {
  title: string
  hasAutoRefresh?: boolean
  defaultAutoRefreshState?: boolean
  onAuthRefreshStateChange?: (newState: boolean) => void
  sticky?: boolean
}

const PageTitle: React.FC<PageTitleProps> = (props) => {
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(
    () => props.defaultAutoRefreshState ?? false,
  )
  const isSticky = useMemo(
    () => (typeof props.sticky === 'undefined' ? true : props.sticky),
    [props.sticky],
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
      css={[
        isSticky ? tw`sticky top-0` : '',
        tw`flex items-center justify-between shadow bg-white z-10 px-3 py-3`,
        css``,
      ]}>
      <div
        tw="flex items-center"
        css={css`
          padding-left: env(safe-area-inset-left);
        `}>
        <BackButton />
        <div>{props.title}</div>
      </div>

      {props.hasAutoRefresh && (
        <div
          onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          css={[
            tw`bg-blue-500 text-white cursor-pointer w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ease-in-out`,
            isAutoRefresh && tw`bg-red-400`,
            css`
              margin-right: env(safe-area-inset-right);
            `,
          ]}>
          <Spinner css={[tw`w-6 h-6`, isAutoRefresh && tw`animate-spin`]} />
        </div>
      )}
    </Heading>
  )
}

export default PageTitle
