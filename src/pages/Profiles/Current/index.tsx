/** @jsx jsx */
import { jsx } from '@emotion/core'
import loadable from '@loadable/component'
import { Button } from '@sumup/circuit-ui'
import React, {
  ChangeEvent,
  MouseEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react'
import css from '@emotion/css/macro'
import { IControlledCodeMirror } from 'react-codemirror2'
import useSWR from 'swr'
import tw from 'twin.macro'

import PageTitle from '../../../components/PageTitle'
import fetcher from '../../../utils/fetcher'

const CodeMirror = loadable<IControlledCodeMirror>(
  async () => {
    const mod = await import('react-codemirror2').then((mod) => mod.Controlled)

    await Promise.all([
      // @ts-ignore
      import('codemirror/lib/codemirror.css'),
      // @ts-ignore
      import('codemirror/theme/material.css'),
      // @ts-ignore
      import('codemirror/mode/properties/properties'),
    ])

    return mod
  },
  {
    fallback: (
      <div tw="h-full flex items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    ),
  },
)

const Page: React.FC = () => {
  const { data: profile, error: profileError } = useSWR<{ profile: string }>(
    '/profiles/current?sensitive=1',
    fetcher,
  )

  return (
    <div tw="fixed top-0 right-0 bottom-0 left-0 h-full">
      <div tw="w-full h-full flex flex-col">
        <PageTitle title="Profile" />

        <div tw="h-full flex flex-col overflow-hidden">
          <div tw="h-full overflow-auto">
            <CodeMirror
              css={[
                tw`h-full text-xs`,
                css`
                  & > .CodeMirror {
                    padding-bottom: env(safe-area-inset-bottom);
                    height: 100%;
                    font-family: Menlo, Monaco, Consolas, 'Liberation Mono',
                      'Courier New', monospace;
                  }
                `,
              ]}
              value={profile?.profile ?? 'Loading...'}
              options={{
                mode: 'properties',
                theme: 'material',
                lineNumbers: true,
                tabSize: 2,
                indentWithTabs: false,
                lineWrapping: true,
                readOnly: 'nocursor',
              }}
              onBeforeChange={() => {
                // noop
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
