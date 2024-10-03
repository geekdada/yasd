import React from 'react'

import context from './context'

export const useSafeAreaInsets = () => {
  const safeAreaInsets = React.useContext(context)

  if (safeAreaInsets === null) {
    throw new Error(
      'useSafeAreaInsets must be used within a SafeAreaInsetsProvider',
    )
  }

  return safeAreaInsets
}
