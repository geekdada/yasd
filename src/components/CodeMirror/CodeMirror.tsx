import React, { useMemo } from 'react'
import { javascript } from '@codemirror/lang-javascript'
import { EditorView } from '@codemirror/view'
import { css } from '@emotion/react'
import { material } from '@uiw/codemirror-theme-material'
import {
  default as ReactCodeMirror,
  ReactCodeMirrorProps,
} from '@uiw/react-codemirror'

import { cn } from '@/utils/shadcn'

type CodeMirrorProps = {
  className?: string
  isJavaScript?: boolean
} & ReactCodeMirrorProps

const CodeMirror = ({ className, isJavaScript, ...props }: CodeMirrorProps) => {
  const extensions = useMemo(() => {
    const exts = [EditorView.lineWrapping]

    if (isJavaScript) {
      exts.push(javascript())
    }

    return exts
  }, [isJavaScript])

  return (
    <ReactCodeMirror
      className={cn('relative h-full text-sm', className)}
      css={css`
        & * {
          font-family: Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
            monospace !important;
        }
      `}
      height="100%"
      theme={material}
      extensions={extensions}
      {...props}
    />
  )
}

export default CodeMirror
