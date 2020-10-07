import axios, { AxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'

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

export function setServer(host: string, port: number, key: string): void {
  const { protocol } = window.location
  client.defaults.baseURL = `${protocol}//${host}:${port}/v1`
  client.defaults.headers['X-Key'] = key
  client.defaults.timeout = 5000
}

const fetcher = <T>(requestConfig: AxiosRequestConfig) => {
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

        window.location.replace('/')
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message)
        toast.error('发生错误: ' + error.message)
      }

      throw error
    })
}

export default fetcher
