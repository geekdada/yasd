import React from 'react'

import { TypographyH3 } from '@/components/ui/typography'

export default function Header(): JSX.Element {
  return (
    <TypographyH3 className="sticky top-0 flex text-xl shadow bg-white dark:bg-muted z-10 px-3 py-2 mb-4">
      Surge Web Dashboard
    </TypographyH3>
  )
}
