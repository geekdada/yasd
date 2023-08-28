import React, { lazy, Suspense, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import BottomPanel from '@/components/BottomPanel'
import CodeMirrorLoading from '@/components/CodeMirrorLoading'
import FixedFullscreenContainer from '@/components/FixedFullscreenContainer'
import PageTitle from '@/components/PageTitle'
import { Toggle } from '@/components/ui/toggle'
import { useCurrentProfile } from '@/data'
import withProfile from '@/utils/with-profile'

const CodeMirror = lazy(() => import('@/components/CodeMirror'))

const Page: React.FC = () => {
  const { t } = useTranslation()
  const [version, setVersion] = React.useState<'original' | 'processed'>(
    'processed',
  )
  const { data: profile, isLoading } = useCurrentProfile()
  const profileString = useMemo(() => {
    if (!profile) {
      return undefined
    }

    return version === 'processed' ? profile.profile : profile.originalProfile
  }, [profile, version])

  return (
    <FixedFullscreenContainer offsetBottom={false}>
      <PageTitle title={`${t('home.profile')} - ${profile?.name}`} />

      <div className="h-full flex flex-col overflow-hidden">
        <div className="h-full overflow-auto">
          <Suspense fallback={<CodeMirrorLoading />}>
            <CodeMirror
              readOnly
              value={isLoading ? `${t('common.is_loading')}...` : profileString}
            />
          </Suspense>
        </div>

        <BottomPanel>
          <div className="space-x-3">
            <Toggle
              size="sm"
              pressed={version === 'processed'}
              onPressedChange={(pressed) => {
                if (pressed) {
                  setVersion('processed')
                }
              }}
            >
              {t('profiles.version_processed')}
            </Toggle>

            <Toggle
              size="sm"
              pressed={version === 'original'}
              onPressedChange={(pressed) => {
                if (pressed) {
                  setVersion('original')
                }
              }}
            >
              {t('profiles.version_original')}
            </Toggle>
          </div>
        </BottomPanel>
      </div>
    </FixedFullscreenContainer>
  )
}

export default withProfile(Page)
