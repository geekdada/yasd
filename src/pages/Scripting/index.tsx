import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { css } from '@emotion/react'
import { Button } from '@sumup/circuit-ui'
import { uniqBy } from 'lodash-es'
import useSWR from 'swr'
import tw from 'twin.macro'

import FixedFullscreenContainer from '@/components/FixedFullscreenContainer'
import PageTitle from '@/components/PageTitle'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EvaluateResult, Scriptings } from '@/types'
import fetcher from '@/utils/fetcher'

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
        <div className="divide-y divide-gray-200">
          {scripting &&
            filteredList.map((script, index) => {
              return (
                <div
                  key={`${script.name}-${script.type}`}
                  css={[
                    tw`flex items-center justify-between py-3 cursor-pointer hover:bg-gray-100`,
                    css`
                      padding-left: calc(env(safe-area-inset-left) + 0.75rem);
                      padding-right: calc(env(safe-area-inset-right) + 0.75rem);
                    `,
                  ]}
                  title={t('scripting.open_script')}
                  onClick={() => openUrl(script.path)}
                >
                  <div className="flex-1">
                    <div className="truncate leading-normal text-gray-700">
                      {script.name}
                    </div>
                    <div className="text-sm text-gray-500">{script.type}</div>
                  </div>
                  <div className="ml-2 flex items-center">
                    {script.type === 'cron' && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          evaluate(script.name, index)
                        }}
                        size="kilo"
                        isLoading={isLoading === index}
                        loadingLabel={t('scripting.running')}
                        className="px-3 py-3 text-sm leading-tight"
                      >
                        {t('scripting.run_script_button_title')}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      <div className="border-t border-solid border-gray-200 py-2">
        <Button
          variant="tertiary"
          size="kilo"
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

export default Page
