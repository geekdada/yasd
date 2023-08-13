import React from 'react'

import { TypographyH2 } from '@/components/ui/typography'

export default function Header(): JSX.Element {
  return (
    <TypographyH2 className="sticky top-0 flex shadow bg-white dark:bg-muted z-10 px-3 py-3 mb-4">
      Surge Web Dashboard
      <small className="text-xs font-normal font-mono text-gray-600 dark:text-white/80 ml-3">
        {`v${process.env.REACT_APP_VERSION}`}
      </small>
    </TypographyH2>
  )
}
