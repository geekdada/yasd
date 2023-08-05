import React from 'react'
import { Headline } from '@sumup/circuit-ui'

export default function Header(): JSX.Element {
  return (
    <Headline
      as="h2"
      size="two"
      className="sticky top-0 flex shadow bg-white z-10 px-3 py-3 mb-4"
    >
      Surge Web Dashboard
      <small className="text-xs font-normal font-mono text-gray-600 ml-3">
        {`v${process.env.REACT_APP_VERSION}`}
      </small>
    </Headline>
  )
}
