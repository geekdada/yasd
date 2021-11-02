/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Heading } from '@sumup/circuit-ui'
import React from 'react'
import tw from 'twin.macro'

export default function Header(): JSX.Element {
  return (
    <Heading
      size={'tera'}
      noMargin
      tw="sticky top-0 flex shadow bg-white z-10 px-3 py-3 mb-4"
    >
      Surge Web Dashboard
      <small tw="text-xs font-normal font-mono text-gray-600 ml-3">
        {`v${process.env.REACT_APP_VERSION}`}
      </small>
    </Heading>
  )
}
