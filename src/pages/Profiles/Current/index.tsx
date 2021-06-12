/** @jsx jsx */
import { jsx } from '@emotion/core'
import loadable from '@loadable/component'
import React from 'react'
import css from '@emotion/css/macro'
import { IControlledCodeMirror } from 'react-codemirror2'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import tw from 'twin.macro'

import CodeMirrorLoading from '../../../components/CodeMirrorLoading'
import FixedFullscreenContainer from '../../../components/FixedFullscreenContainer'
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
    fallback: <CodeMirrorLoading />,
  },
)

const Page: React.FC = () => {
  const { t } = useTranslation()
  const { data: profile, error: profileError } = useSWR<{ profile: string }>(
    '/profiles/current?sensitive=1',
    fetcher,
  )

  return (
    <FixedFullscreenContainer offsetBottom={false}>
      <PageTitle title={t('home.profile')} />

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
            value={profile?.profile ?? `${t('common.is_loading')}...`}
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
    </FixedFullscreenContainer>
  )
}

export default Page
