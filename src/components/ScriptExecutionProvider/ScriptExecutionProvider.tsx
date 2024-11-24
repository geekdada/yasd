import React, { createContext, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import store from 'store2'
import { z } from 'zod'

import CodeContent from '@/components/CodeContent'
import { useResponsiveDialog } from '@/components/ResponsiveDialog'
import { Button } from '@/components/ui/button'
import { useConfirm } from '@/components/UIProvider'
import { EvaluateResult } from '@/types'
import { LastUsedScriptArgument } from '@/utils/constant'
import fetcher from '@/utils/fetcher'

import type { ExecutionOptions, ScriptExecutionContextType } from './types'

export const ScriptExecutionContext = createContext<ScriptExecutionContextType>(
  {},
)

export const ScriptExecutionProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { t } = useTranslation()

  const [execution, setExecution] =
    useState<ScriptExecutionContextType['execution']>()
  const confirm = useConfirm()

  const {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription,
  } = useResponsiveDialog()

  const getLastUsedScriptArgument = useCallback(() => {
    return store.get(LastUsedScriptArgument)
  }, [])

  const setLastUsedScriptArgument = useCallback((argument: string) => {
    store.set(LastUsedScriptArgument, argument)
  }, [])

  const clearLastUsedScriptArgument = useCallback(() => {
    store.remove(LastUsedScriptArgument)
  }, [])

  const evaluateCronScript = useCallback(async (scriptName: string) => {
    const res = await fetcher<EvaluateResult>({
      url: '/scripting/cron/evaluate',
      method: 'POST',
      data: {
        script_name: scriptName,
      },
      timeout: 60000,
    }).catch((error: Error) => error)

    if (res instanceof Error) {
      const result = {
        isLoading: false,
        result: null,
        error: res,
        done: true,
      }

      setExecution(result)
      return result
    }

    if (res.exception) {
      const result = {
        isLoading: false,
        result: null,
        error: new Error(res.exception),
        done: true,
      }
      setExecution(result)
      return result
    }

    const result = {
      isLoading: false,
      result: res.output,
      error: null,
      done: true,
    }

    setExecution(result)
    return result
  }, [])

  const execute = useCallback(
    async (code: string, options: ExecutionOptions = {}) => {
      const { timeout = 5 } = options
      const confirmation = await confirm({
        type: 'form',
        title: t('scripting.script_argument'),
        description: t('scripting.define_script_argument'),
        confirmText: t('scripting.run_script_button_title'),
        cancelText: t('common.go_back'),
        form: {
          argument: z.string().optional(),
          saveForLater: z.boolean().optional(),
        },
        formLabels: {
          argument: t('scripting.argument'),
          saveForLater: t('scripting.save_for_later'),
        },
        formDefaultValues: {
          argument: getLastUsedScriptArgument() || '',
          saveForLater: getLastUsedScriptArgument() ? true : false,
        },
        formDescriptions: {
          saveForLater: t('scripting.save_for_later_description'),
        },
      })

      if (!confirmation) {
        return undefined
      }

      setExecution({ isLoading: true, result: null, error: null, done: false })

      if (confirmation.saveForLater && confirmation.argument) {
        setLastUsedScriptArgument(confirmation.argument)
      } else {
        clearLastUsedScriptArgument()
      }

      const res = await fetcher<EvaluateResult>({
        url: '/scripting/evaluate',
        method: 'POST',
        data: {
          script_text: code,
          mock_type: 'cron',
          argument: confirmation.argument,
        },
        timeout: timeout * 1000 + 500,
      }).catch((error: Error) => error)

      if (res instanceof Error) {
        const result = {
          isLoading: false,
          result: null,
          error: res,
          done: true,
        }

        setExecution(result)
        return result
      }

      if (res.exception) {
        const result = {
          isLoading: false,
          result: null,
          error: new Error(res.exception),
          done: true,
        }
        setExecution(result)
        return result
      }

      const result = {
        isLoading: false,
        result: res.output,
        error: null,
        done: true,
      }

      setExecution(result)
      return result
    },
    [
      clearLastUsedScriptArgument,
      confirm,
      getLastUsedScriptArgument,
      setLastUsedScriptArgument,
      t,
    ],
  )

  const clearExecution = useCallback(() => {
    setExecution(undefined)
  }, [])

  useEffect(() => {
    if (execution?.error) {
      toast.error(execution.error.message)
    }
  }, [execution?.error])

  return (
    <ScriptExecutionContext.Provider
      value={{ execution, evaluateCronScript, execute, clearExecution }}
    >
      {children}

      <Dialog
        open={execution?.done && !execution?.error}
        onOpenChange={(open) => {
          if (!open) {
            clearExecution()
          }
        }}
      >
        <DialogContent className="flex flex-col max-h-[90%]">
          <DialogHeader>
            <DialogTitle>{t('scripting.result')}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            {t('scripting.result')}
          </DialogDescription>
          <div className="w-full overflow-x-hidden overflow-y-scroll">
            <CodeContent
              content={
                execution?.result || t('scripting.success_without_result_text')
              }
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button autoFocus variant="default">
                {t('common.close')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScriptExecutionContext.Provider>
  )
}

export const withScriptExecutionProvider = (Component: React.ComponentType) => {
  const WrappedComponent = (props: any) => (
    <ScriptExecutionProvider>
      <Component {...props} />
    </ScriptExecutionProvider>
  )

  WrappedComponent.displayName = `withScriptExecutionProvider(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}

export default withScriptExecutionProvider
