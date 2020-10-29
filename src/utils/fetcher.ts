import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import set from 'lodash-es/set'

const client = axios.create({
  baseURL: '/v1',
  transformRequest: [
    (data, headers) => {
      if (!headers['x-surge-host']) {
        delete headers['Content-Type']
      } else {
        headers['Content-Type'] = 'application/json;charset=UTF-8'
      }

      if (data) {
        return JSON.stringify(data)
      }
    },
  ],
})

export function setServer(
  host: string,
  port: number,
  key: string,
  options?: {
    helperHost: string
    helperPort: number
  },
): void {
  const { protocol } = window.location
  client.defaults.headers['X-Key'] = key
  client.defaults.timeout = 5000

  if (options) {
    client.defaults.baseURL = `https://${options.helperHost}:${options.helperPort}/v1`
    client.defaults.headers['x-surge-host'] = host
    client.defaults.headers['x-surge-port'] = port
  } else {
    client.defaults.baseURL = `${protocol}//${host}:${port}/v1`
  }
}

const fetcher = <T>(requestConfig: AxiosRequestConfig): Promise<T> => {
  return client
    .request<T>(requestConfig)
    .then((res) => res.data)
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response.data)
        console.error(error.response.status)
        toast.error('请求错误: ' + error.message + `(${error.response.status})`)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request)
        toast.error('无法连接服务器: ' + error.message, {
          toastId: error.message,
        })
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message)
        toast.error('发生错误: ' + error.message)
      }

      throw error
    })
}

export const bareFetcher = <T>(
  requestConfig: AxiosRequestConfig & { url: string },
  options?: {
    helperHost: string
    helperPort: number
  },
): Promise<AxiosResponse<T>> => {
  if (options) {
    const url = new URL(requestConfig.url)
    set(requestConfig, 'headers["x-surge-host"]', url.hostname)
    set(requestConfig, 'headers["x-surge-port"]', url.port)

    url.hostname = options.helperHost
    url.port = `${options.helperPort}`
    url.protocol = 'https:'

    requestConfig.url = url.toString()
  }

  return axios.request<T>(requestConfig)
}

export default fetcher
