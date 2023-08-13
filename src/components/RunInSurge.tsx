import React from 'react'

import { isRunInSurge } from '@/utils'

const RunInSurge: React.FC<{
  children: React.ReactNode
  not?: boolean
}> = ({ not, children }) => {
  const runInSurge = isRunInSurge()

  return not ? !runInSurge && <>{children}</> : runInSurge && <>{children}</>
}

export default RunInSurge
