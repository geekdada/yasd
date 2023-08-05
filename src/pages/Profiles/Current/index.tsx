import React, { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import CodeMirrorLoading from '@/components/CodeMirrorLoading'
import FixedFullscreenContainer from '@/components/FixedFullscreenContainer'
import PageTitle from '@/components/PageTitle'
import fetcher from '@/utils/fetcher'

const CodeMirror = lazy(() => import('@/components/CodeMirror'))

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
              value={profile?.profile ?? `${t('common.is_loading')}...`}
              options={{
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
