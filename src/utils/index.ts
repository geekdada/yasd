import { unregisterAsync } from '@/serviceWorkerRegistration'

export const isFalsy = (obj: string | boolean | 1 | 0) =>
  obj === 0 || obj === false || (typeof obj === 'string' && obj.length === 0)

export const isTruthy = (obj: string | boolean | 1 | 0) =>
  obj === 1 || obj === true || (typeof obj === 'string' && obj.length > 0)

export const isRunInSurge = (): boolean =>
  process.env.REACT_APP_RUN_IN_SURGE === 'true'

export const forceRefresh = async (): Promise<void> => {
  if (process.env.REACT_APP_USE_SW === 'true') {
    await unregisterAsync()
  }

  window.location.reload()
}

/**
 *  The following IP formats can be handled:
 *  1.1.1.1(Proxy),
 *  1.1.1.1 (Proxy),
 *  2001:0db8:85a3:0000:0000:8a2e:0370:7334(Proxy),
 *  2001:0db8:85a3:0000:0000:8a2e:0370:7334 (Proxy),
 */
export const onlyIP = (ip: string) => {
  const ipAddressRegex =
    /(?:\d{1,3}\.){3}\d{1,3}|(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}/g
  const matchArray = ip.match(ipAddressRegex)
  return matchArray?.length ? matchArray[0] : ip
}
