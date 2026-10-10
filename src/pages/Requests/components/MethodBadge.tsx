import React from 'react'

import LabelBadge from '@/components/LabelBadge'
import { isTruthy } from '@/utils'

type MethodBadgeProps = {
  failed: 1 | 0 | boolean
  method: string
  status: string
} & React.HTMLAttributes<HTMLDivElement>

const MethodBadge: React.FC<MethodBadgeProps> = ({
  failed,
  method,
  status,
  ...args
}) => {
  return (
    <LabelBadge
      tone={isTruthy(failed) ? 'red' : status === 'Active' ? 'green' : 'blue'}
      {...args}
    >
      {method}
    </LabelBadge>
  )
}

export default MethodBadge
