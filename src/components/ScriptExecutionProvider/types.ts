export type ExecutionOptions = {
  timeout?: number
}

export type ExecutionResult = {
  isLoading: boolean
  done: boolean
  result: string | null
  error: Error | null
}

export type ScriptExecutionContextType = {
  execution?: ExecutionResult
  evaluateCronScript?: (
    scriptName: string,
  ) => Promise<ExecutionResult | undefined>
  execute?: (
    code: string,
    options?: ExecutionOptions,
  ) => Promise<ExecutionResult | undefined>
  clearExecution?: () => void
}
