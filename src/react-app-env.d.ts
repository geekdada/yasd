/// <reference types="react-scripts" />

import 'twin.macro'
import { css as cssImport } from '@emotion/react'
import { CSSInterpolation } from '@emotion/serialize'
import styledImport from '@emotion/styled'

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof styledImport
  const css: typeof cssImport
}

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface DOMAttributes<T> {
    tw?: string
    css?: CSSInterpolation
  }
}
