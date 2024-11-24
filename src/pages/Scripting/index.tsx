import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { uniqBy } from 'lodash-es'
import { Link2Icon } from 'lucide-react'
import useSWR from 'swr'

import HorizontalSafeArea from '@/components/HorizontalSafeArea'
import { ListCell } from '@/components/ListCell'
import PageTitle from '@/components/PageTitle'
import {
  useExecuteScript,
  withScriptExecutionProvider,
} from '@/components/ScriptExecutionProvider'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Scriptings } from '@/types'
import fetcher from '@/utils/fetcher'
import withProfile from '@/utils/with-profile'

const ComponentBase: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: scripting } = useSWR<Scriptings>('/scripting', fetcher)
  const [isLoading, setIsLoading] = useState<number>()

  const { evaluateCronScript } = useExecuteScript()

  const filteredList = useMemo(() => {
    if (!scripting) return []

    return uniqBy(scripting.scripts, (item) => `${item.name}-${item.type}`)
  }, [scripting])

  const openUrl = (path: string) => {
    window.open(path, '_blank', 'noopener noreferrer')
  }

  const evaluate = async (scriptName: string, index: number) => {
    if (typeof isLoading === 'number') return

    setIsLoading(index)

    await evaluateCronScript(scriptName)

    setIsLoading(undefined)
  }

  return (
    <>
      <PageTitle title={t('home.scripting')} />

      <div className="flex-1 overflow-auto">
        <div className="divide-y">
          {scripting &&
            filteredList.map((script, index) => {
              return (
                <ListCell
                  interactive={false}
                  key={`${script.name}-${script.type}`}
                  className="flex flex-row overflow-hidden items-center justify-between py-3 gap-2"
                >
                  <div className="flex-1 overflow-hidden">
                    <div className=" truncate leading-normal">
                      {script.name}
                    </div>
                    <div className="text-sm text-gray-500">{script.type}</div>
                  </div>
                  <ButtonGroup className="items-center">
                    {script.type === 'cron' && (
                      <Button
                        onClick={() => {
                          evaluate(script.name, index)
                        }}
                        isLoading={isLoading === index}
                        loadingLabel={t('scripting.running')}
                        variant="outline"
                      >
                        {t('scripting.run_script_button_title')}
                      </Button>
                    )}
                    {script.path.startsWith('http') && (
                      <Button
                        title={t('scripting.open_script')}
                        onClick={() => openUrl(script.path)}
                        size="icon"
                        variant="outline"
                      >
                        <Link2Icon />
                      </Button>
                    )}
                  </ButtonGroup>
                </ListCell>
              )
            })}
        </div>
      </div>

      <HorizontalSafeArea className="border-t border-solid border-gray-200 dark:border-white/20 py-3 px-4">
        <Button
          variant="secondary"
          onClick={() => navigate('/scripting/evaluate')}
        >
          {t('scripting.debug_script_button_title')}
        </Button>
      </HorizontalSafeArea>
    </>
  )
}

export const Component = withProfile(withScriptExecutionProvider(ComponentBase))

Component.displayName = 'ScriptingPage'

export { ErrorBoundary } from '@/components/ErrorBoundary'
