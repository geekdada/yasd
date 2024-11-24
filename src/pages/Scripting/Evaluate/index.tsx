import React, { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LifeBuoy } from 'lucide-react'

import CodeMirrorLoading from '@/components/CodeMirrorLoading'
import FixedFullscreenContainer from '@/components/FixedFullscreenContainer'
import PageTitle from '@/components/PageTitle'
import {
  withScriptExecutionProvider,
  useExecuteScript,
} from '@/components/ScriptExecutionProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const CodeMirror = lazy(() => import('@/components/CodeMirror'))

export const Component: React.FC = withScriptExecutionProvider(
  function EvaluatePage() {
    const { t } = useTranslation()

    const [code, setCode] = useState<string>(() =>
      t('scripting.editor_placeholder'),
    )

    const { execute, execution } = useExecuteScript()
    const [timeout, setTimeoutValue] = useState<number>(5)

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
              onClick={() => execute(code, { timeout })}
              isLoading={execution?.isLoading}
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
      </FixedFullscreenContainer>
    )
  },
)

export { ErrorBoundary } from '@/components/ErrorBoundary'
