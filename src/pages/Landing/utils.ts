import axios from 'axios'

export const tryHost = async (
  protocol: string,
  hostname: string,
  port: string | number,
  key: string,
): Promise<{
  name?: string
  platform: 'macos' | 'ios'
  platformVersion: string
  platformBuild: string
}> => {
  const basicInfoReq = axios.request({
    url: `${protocol}//${hostname}:${port}/v1/outbound`,
    method: 'GET',
    timeout: 3000,
    headers: {
      'x-key': key,
    },
    responseType: 'json',
  })
  const environmentReq = axios
    .request<{ deviceName: string }>({
      url: `${protocol}//${hostname}:${port}/v1/environment`,
      method: 'GET',
      timeout: 3000,
      headers: {
        'x-key': key,
      },
      responseType: 'json',
    })
    .then((res) => res.data)
    .catch(() => undefined)
  const [basicInfo, environment] = await Promise.all([
    basicInfoReq,
    environmentReq,
  ])

  return {
    name: environment ? environment.deviceName : undefined,
    platform: (basicInfo.headers['x-system'] || '').toLowerCase(),
    platformVersion: basicInfo.headers['x-surge-version'] || '',
    platformBuild: basicInfo.headers['x-surge-build'] || '',
  }
}

export const getSurgeHost = (): {
  protocol: string
  hostname: string
  port: string
} => {
  if (process.env.NODE_ENV === 'production') {
    const protocol = window.location.protocol
    const port = window.location.port
      ? window.location.port
      : protocol === 'https:'
        ? '443'
        : '80'

    return {
      protocol,
      hostname: window.location.hostname,
      port,
    }
  }

  return {
    protocol: process.env.REACT_APP_PROTOCOL as string,
    hostname: process.env.REACT_APP_HOST as string,
    port: process.env.REACT_APP_PORT as string,
  }
}
