import React, { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { uniqBy } from 'lodash-es'
import { Link2Icon } from 'lucide-react'
import useSWR from 'swr'

import CodeContent from '@/components/CodeContent'
import HorizontalSafeArea from '@/components/HorizontalSafeArea'
import { ListCell } from '@/components/ListCell'
import PageTitle from '@/components/PageTitle'
import { useResponsiveDialog } from '@/components/ResponsiveDialog'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { EvaluateResult, Scriptings } from '@/types'
import fetcher from '@/utils/fetcher'
import withProfile from '@/utils/with-profile'

const ComponentBase: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
  } = useResponsiveDialog()

  const { data: scripting } = useSWR<Scriptings>('/scripting', fetcher)
  const [evaluateResult, setEvaluateResult] = useState<string | undefined>()
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

      <Dialog
        open={!!evaluateResult}
        onOpenChange={(open) => {
          if (!open) {
            setEvaluateResult(undefined)
          }
        }}
      >
        <DialogContent className="flex flex-col max-h-[90%]">
          <DialogHeader>
            <DialogTitle>{t('scripting.result')}</DialogTitle>
          </DialogHeader>
          <div className="w-full overflow-x-hidden overflow-y-scroll">
            <CodeContent content={evaluateResult} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="default">{t('common.close')}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const Component = withProfile(ComponentBase)

Component.displayName = 'ScriptingPage'

export { ErrorBoundary } from '@/components/ErrorBoundary'
