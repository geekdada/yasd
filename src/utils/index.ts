import { unregisterAsync } from '../serviceWorkerRegistration'

export const isFalsy = (obj: string | boolean | 1 | 0) =>
  obj === 0 || obj === false || (typeof obj === 'string' && obj.length === 0)

export const isTruthy = (obj: string | boolean | 1 | 0) =>
  obj === 1 || obj === true || (typeof obj === 'string' && obj.length > 0)

export const isRunInSurge = (): boolean =>
  'REACT_APP_RUN_IN_SURGE' in process.env

export const forceRefresh = async (): Promise<void> => {
  if (process.env.REACT_APP_USE_SW) {
    await unregisterAsync()
  }

  window.location.reload()
}
