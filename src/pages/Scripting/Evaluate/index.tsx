import React, { lazy, Suspense, useCallback, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { LifeBuoy } from 'lucide-react'

import CodeContent from '@/components/CodeContent'
import CodeMirrorLoading from '@/components/CodeMirrorLoading'
import FixedFullscreenContainer from '@/components/FixedFullscreenContainer'
import PageTitle from '@/components/PageTitle'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EvaluateResult } from '@/types'
import fetcher from '@/utils/fetcher'

const CodeMirror = lazy(() => import('@/components/CodeMirror'))

export const Component: React.FC = () => {
  const { t } = useTranslation()
  const [code, setCode] = useState<string>(() =>
    t('scripting.editor_placeholder'),
  )
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>()
  const [timeout, setTimeoutValue] = useState<number>(5)

  const evaluate = useCallback(() => {
    if (isLoading) return

    if (!code) {
      toast.error(t('scripting.empty_code_error'))
      return
    }

    setIsLoading(true)

    fetcher<EvaluateResult>({
      url: '/scripting/evaluate',
      method: 'POST',
      data: {
        script_text: code,
        mock_type: 'cron',
        timeout,
      },
      timeout: timeout * 1000 + 500,
    })
      .then((res) => {
        if (res.exception) {
          toast.error(res.exception)
        } else {
          setResult(res.output)
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [code, isLoading, t, timeout])

  return (
    <FixedFullscreenContainer>
      <PageTitle title={t('scripting.debug_script_button_title')} />

      <div className="h-full flex flex-col overflow-hidden">
        <div className="h-full overflow-auto">
          <Suspense fallback={<CodeMirrorLoading />}>
            <CodeMirror
              isJavaScript
              value={code}
              onChange={(value) => {
                setCode(value)
              }}
            />
          </Suspense>
        </div>

        <div className="flex items-center border-t border-solid py-3 px-3">
          <Button
            onClick={evaluate}
            isLoading={isLoading}
            loadingLabel={t('scripting.running')}
          >
            {t('scripting.run_script_button_title')}
          </Button>

          <a
            href="https://manual.nssurge.com/scripting/common.html"
            target="_blank"
            rel="noreferrer"
          >
            <Button className="ml-4" size="icon" variant="outline">
              <LifeBuoy />
            </Button>
          </a>

          <div className="ml-6">
            <Label htmlFor="timeout-input">{t('scripting.timeout')}</Label>
            <Input
              id="timeout-input"
              type="number"
              required
              value={timeout}
              onChange={({ target }) =>
                setTimeoutValue(Number((target as HTMLInputElement).value))
              }
            />
          </div>
        </div>
      </div>

      <Dialog
        open={!!result}
        onOpenChange={(open) => {
          if (!open) {
            setResult('')
          }
        }}
      >
        <DialogContent className="flex flex-col max-h-[90%]">
          <DialogHeader>
            <DialogTitle>{t('scripting.result')}</DialogTitle>
          </DialogHeader>
          <div className="w-full overflow-x-hidden overflow-y-scroll">
            <CodeContent content={result} />
          </div>
          <DialogFooter>
            <Button onClick={() => setResult('')}>{t('common.close')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FixedFullscreenContainer>
  )
}

Component.displayName = 'EvaluatePage'

export { ErrorBoundary } from '@/components/ErrorBoundary'
