import React from 'react'
import { css } from '@emotion/react'

export const BottomSafeArea = () => {
  return (
    <div
      className="flex flex-1 sm:hidden"
      css={css`
        height: 0;
        padding-bottom: env(safe-area-inset-bottom, 0px);
      `}
    ></div>
  )
}
