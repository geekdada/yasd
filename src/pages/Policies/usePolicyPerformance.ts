import useSWR, { mutate } from 'swr'

import { useVersionSupport } from '../../hooks'
import { PolicyBenchmarkResults } from '../../types'
import fetcher from '../../utils/fetcher'

export const mutatePolicyPerformanceResults = () =>
  mutate('/policies/benchmark_results')

export const usePolicyPerformance = () => {
  const isSupported = useVersionSupport({
    ios: '4.9.5',
    macos: '4.2.4',
  })
  const { data, error } = useSWR<PolicyBenchmarkResults>(
    isSupported ? '/policies/benchmark_results' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    },
  )

  return {
    data,
    error,
    mutate: mutatePolicyPerformanceResults,
  }
}
