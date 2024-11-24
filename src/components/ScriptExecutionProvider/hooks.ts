import { useContext } from 'react'

import { ScriptExecutionContext } from './ScriptExecutionProvider'

export const useExecuteScript = () => {
  const context = useContext(ScriptExecutionContext)

  if (
    !context.execute ||
    !context.evaluateCronScript ||
    !context.clearExecution
  ) {
    throw new Error(
      'useExecuteScript must be used within a ScriptExecutionProvider',
    )
  }

  return {
    execute: context.execute,
    evaluateCronScript: context.evaluateCronScript,
    execution: context.execution,
    clearExecution: context.clearExecution,
  }
}
