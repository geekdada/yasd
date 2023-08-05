import React, { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { css } from '@emotion/react'
import { Button, Input } from '@sumup/circuit-ui'
import tw from 'twin.macro'

import CodeMirrorLoading from '@/components/CodeMirrorLoading'
import FixedFullscreenContainer from '@/components/FixedFullscreenContainer'
import PageTitle from '@/components/PageTitle'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EvaluateResult } from '@/types'
import fetcher from '@/utils/fetcher'

const CodeMirror = lazy(() => import('@/components/CodeMirror'))

const Page: React.FC = () => {
  const { t } = useTranslation()
  const [code, setCode] = useState<string>(() =>
    t('scripting.editor_placeholder'),
  )
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>()
  const [timeout, setTimeoutValue] = useState<number>(5)

  const evaluate = () => {
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
  }

  return (
    <FixedFullscreenContainer>
      <PageTitle title={t('scripting.debug_script_button_title')} />

      <div className="h-full flex flex-col overflow-hidden">
        <div className="h-full overflow-auto">
          <Suspense fallback={<CodeMirrorLoading />}>
            <CodeMirror
              value={code}
              onBeforeChange={(editor, data, value) => {
                setCode(value)
              }}
            />
          </Suspense>
        </div>
        <div
          css={[
            tw`flex items-center border-t border-solid border-gray-200 py-3 px-3`,
          ]}
        >
          <Button
            onClick={evaluate}
            variant="primary"
            size="kilo"
            isLoading={isLoading}
            loadingLabel={t('scripting.running')}
          >
            {t('scripting.run_script_button_title')}
          </Button>

          <div
            css={[
              tw`ml-4`,
              css`
                padding-bottom: 1px;

                & input {
                  border-radius: 4px;
                  ${tw`px-2 py-1 text-sm leading-none`}
                }
              `,
            ]}
          >
            <Input
              type="number"
              required
              label={t('scripting.timeout')}
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
              {result}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </FixedFullscreenContainer>
  )
}

export default Page
