/** @jsx jsx */
import { jsx } from '@emotion/core'
import css from '@emotion/css/macro'
import tw from 'twin.macro'
import React from 'react'

const PageContainer: React.FC = ({ children }) => {
  return <div tw="relative pb-5">{children}</div>
}

export default PageContainer
