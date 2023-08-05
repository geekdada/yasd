import React from 'react'
import { Controlled } from 'react-codemirror2'
import { css } from '@emotion/react'

// @ts-ignore
import('codemirror/lib/codemirror.css')
// @ts-ignore
import('codemirror/theme/material.css')
// @ts-ignore
import('codemirror/mode/javascript/javascript.js')

import { cn } from '@/utils/shadcn'

type CodeMirrorProps = {
  className?: string
} & React.ComponentProps<typeof Controlled>

const CodeMirror = ({ className, options, ...props }: CodeMirrorProps) => {
  return (
    <Controlled
      className={cn('h-full text-xs', className)}
      css={css`
        & > .CodeMirror {
          height: 100%;
          font-family: Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
            monospace;
        }
      `}
      options={{
        ...options,
        mode: 'javascript',
        theme: 'material',
        lineNumbers: true,
        tabSize: 2,
        indentWithTabs: false,
        lineWrapping: true,
      }}
      {...props}
    />
  )
}

export default CodeMirror
