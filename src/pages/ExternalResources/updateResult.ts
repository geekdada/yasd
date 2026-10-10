import { ExternalResourcesUpdateResult } from '@/types'

const SUCCESS = 'success'

export interface FailedUpdate {
  key: string
  message: string
}

export const getFailedUpdates = (
  result: ExternalResourcesUpdateResult,
): Array<FailedUpdate> =>
  Object.entries(result)
    .filter(([, status]) => status !== SUCCESS)
    .map(([key, message]) => ({ key, message }))
