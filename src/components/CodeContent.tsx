import React from 'react'
import { css } from '@emotion/react'

import { cn } from '@/utils/shadcn'

type CodeContentProps = {
  content?: string
} & React.HTMLAttributes<HTMLPreElement>

const CodeContent = ({ className, content, ...props }: CodeContentProps) => {
  return (
    <pre
      className={cn(
        'w-full font-mono text-muted-foreground bg-muted text-xs leading-tight p-3 whitespace-pre-wrap break-words',
        className,
      )}
      css={css`
        min-height: 7rem;
      `}
      {...props}
    >
      {content}
    </pre>
  )
}

export default CodeContent
