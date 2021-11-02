/** @jsx jsx */
import { jsx } from '@emotion/core'
import css from '@emotion/css/macro'
import tw from 'twin.macro'
import React from 'react'

const FixedFullscreenContainer: React.FC<{
  offsetBottom?: boolean
}> = (props) => {
  let offsetBottom = true

  if (typeof props.offsetBottom === 'boolean') {
    offsetBottom = props.offsetBottom
  }

  return (
    <div
      css={[
        tw`fixed top-0 right-0 bottom-0 left-0 h-full overflow-hidden`,
        offsetBottom
          ? css`
              padding-bottom: env(safe-area-inset-bottom);
            `
          : '',
      ]}
    >
      <div tw="w-full h-full flex flex-col">{props.children}</div>
    </div>
  )
}

export default FixedFullscreenContainer
