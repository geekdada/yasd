import axios from 'axios'

export async function tryHost(
  protocol: string,
  hostname: string,
  port: string | number,
  key: string,
): Promise<{
  name?: string
  platform: 'macos' | 'ios'
  platformVersion: string
  platformBuild: string
}> {
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
    platform: basicInfo.headers['x-system']?.includes('macOS')
      ? 'macos'
      : 'ios',
    platformVersion: basicInfo.headers['x-surge-version'] || '',
    platformBuild: basicInfo.headers['x-surge-build'] || '',
  }
}
