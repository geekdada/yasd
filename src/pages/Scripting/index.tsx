import React, { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import { uniqBy } from 'lodash-es'
import { Link2Icon } from 'lucide-react'
import useSWR from 'swr'

import FixedFullscreenContainer from '@/components/FixedFullscreenContainer'
import ListCell from '@/components/ListCell'
import PageTitle from '@/components/PageTitle'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EvaluateResult, Scriptings } from '@/types'
import fetcher from '@/utils/fetcher'
import withProfile from '@/utils/with-profile'

const Page: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: scripting } = useSWR<Scriptings>('/scripting', fetcher)
  const [evaluateResult, setEvaluateResult] = useState<string>()
  const [isLoading, setIsLoading] = useState<number>()

  const filteredList = useMemo(() => {
    if (!scripting) return []

    return uniqBy(scripting.scripts, (item) => `${item.name}-${item.type}`)
  }, [scripting])

  const openUrl = (path: string) => {
    window.open(path, '_blank', 'noopener noreferrer')
  }

  const evaluate = (scriptName: string, index: number) => {
    if (typeof isLoading === 'number') return

    setIsLoading(index)

    fetcher<EvaluateResult>({
      url: '/scripting/cron/evaluate',
      method: 'POST',
      data: {
        script_name: scriptName,
      },
      timeout: 60000,
    })
      .then((res) => {
        if (res.exception) {
          toast.error(res.exception)
        } else {
          setEvaluateResult(res.output)
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsLoading(undefined)
      })
  }

  return (
    <FixedFullscreenContainer>
      <PageTitle title={t('home.scripting')} />

      <div className="flex-1 overflow-auto">
        <div className="divide-y">
          {scripting &&
            filteredList.map((script, index) => {
              return (
                <ListCell
                  interactive={false}
                  key={`${script.name}-${script.type}`}
                  className="flex flex-row items-center justify-between py-3"
                >
                  <div className="flex-1">
                    <div className="truncate leading-normal font-mono">
                      {script.name}
                    </div>
                    <div className="text-sm text-gray-500">{script.type}</div>
                  </div>
                  <div className="ml-2 flex items-center">
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
                  </div>
                </ListCell>
              )
            })}
        </div>
      </div>

      <div className="border-t border-solid border-gray-200 dark:border-white/20 py-3 px-4">
        <Button
          variant="secondary"
          onClick={() => navigate('/scripting/evaluate')}
        >
          {t('scripting.debug_script_button_title')}
        </Button>
      </div>

      <Dialog
        open={!!evaluateResult}
        onOpenChange={(open) => {
          if (!open) {
            setEvaluateResult(undefined)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('scripting.result')}</DialogTitle>
          </DialogHeader>
          <div>
            <pre
              className="font-mono text-xs text-gray-600 bg-gray-200 leading-tight p-3 whitespace-pre-wrap break-words"
              css={css`
                min-height: 7rem;
              `}
            >
              {evaluateResult}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </FixedFullscreenContainer>
  )
}

export default withProfile(Page)
