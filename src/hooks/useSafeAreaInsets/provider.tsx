import React, { useEffect, useState } from 'react'

import context, { type Context } from './context'

type SafeAreaInsetsProviderProps = {
  children: React.ReactNode
}

export const SafeAreaInsetsProvider = ({
  children,
}: SafeAreaInsetsProviderProps) => {
  const [state, setState] = useState<Context | null>(null)

  useEffect(() => {
    const tempDiv = document.createElement('div')

    tempDiv.style.paddingTop = 'env(safe-area-inset-top, 0px)'
    tempDiv.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)'
    tempDiv.style.paddingLeft = 'env(safe-area-inset-left, 0px)'
    tempDiv.style.paddingRight = 'env(safe-area-inset-right, 0px)'
    tempDiv.style.position = 'absolute'
    tempDiv.style.visibility = 'hidden'

    document.body.appendChild(tempDiv)

    const safeAreaInsetTop = window.getComputedStyle(tempDiv).paddingTop
    const safeAreaInsetBottom = window.getComputedStyle(tempDiv).paddingBottom
    const safeAreaInsetLeft = window.getComputedStyle(tempDiv).paddingLeft
    const safeAreaInsetRight = window.getComputedStyle(tempDiv).paddingRight

    document.body.removeChild(tempDiv)

    setState({
      top: parseInt(safeAreaInsetTop.replace('px', ''), 10),
      bottom: parseInt(safeAreaInsetBottom.replace('px', ''), 10),
      left: parseInt(safeAreaInsetLeft.replace('px', ''), 10),
      right: parseInt(safeAreaInsetRight.replace('px', ''), 10),
    })
  }, [])

  return <context.Provider value={state}>{children}</context.Provider>
}
