import React, { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'
import useSWR from 'swr'

import CodeMirrorLoading from '@/components/CodeMirrorLoading'
import FixedFullscreenContainer from '@/components/FixedFullscreenContainer'
import PageTitle from '@/components/PageTitle'
import fetcher from '@/utils/fetcher'

const CodeMirror = lazy(async () => {
  const mod = await import('react-codemirror2').then((mod) => mod.Controlled)

  await Promise.all([
    // @ts-ignore
    import('codemirror/lib/codemirror.css'),
    // @ts-ignore
    import('codemirror/theme/material.css'),
    // @ts-ignore
    import('codemirror/mode/properties/properties'),
  ])

  return { default: mod }
})

const Page: React.FC = () => {
  const { t } = useTranslation()
  const { data: profile } = useSWR<{ profile: string }>(
    '/profiles/current?sensitive=1',
    fetcher,
  )

  return (
    <FixedFullscreenContainer offsetBottom={false}>
      <PageTitle title={t('home.profile')} />

      <div className="h-full flex flex-col overflow-hidden">
        <div className="h-full overflow-auto">
          <Suspense fallback={<CodeMirrorLoading />}>
            <CodeMirror
              className="h-full text-xs"
              css={[
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
          </Suspense>
        </div>
      </div>
    </FixedFullscreenContainer>
  )
}

export default Page
