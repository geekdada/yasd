import axios, { AxiosRequestConfig } from 'axios'

const client = axios.create({
  baseURL: '/v1',
  transformRequest: [
    (data, headers) => {
      delete headers['Content-Type']
      if (data) {
        return JSON.stringify(data)
      }
    },
  ],
})

const fetcher = <T>(requestConfig: AxiosRequestConfig) =>
  client.request<T>(requestConfig).then((res) => res.data)

export function setServer(host: string, port: number, key: string): void {
  const { protocol } = window.location
  client.defaults.baseURL = `${protocol}//${host}:${port}/v1`
  client.defaults.headers['X-Key'] = key
}

export default fetcher
