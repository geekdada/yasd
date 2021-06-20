import { useState } from 'react'

interface AuthData {
  name: string
  host: string
  port: string
  key: string
  useTls: boolean
}

export function useAuthData() {
  const protocol = window.location.protocol
  const data = useState<AuthData>(() => ({
    name: '',
    host: '',
    port: '',
    key: '',
    useTls: protocol === 'https:',
  }))
  const [hasError, setHasError] = useState<boolean | string>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [keepCredential, setKeepCredential] = useState(false)

  return {
    data: data[0],
    setData: data[1],
    hasError,
    setHasError,
    isLoading,
    setIsLoading,
    keepCredential,
    setKeepCredential,
  }
}
