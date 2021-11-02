import axios, { AxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'

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
    tls?: boolean
  },
): void {
  const useTls = options?.tls === true

  client.defaults.headers['x-key'] = key
  client.defaults.timeout = 5000

  client.defaults.baseURL = `${useTls ? 'https:' : 'http:'}//${host}:${port}/v1`
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

export default fetcher
export { client as httpClient }
