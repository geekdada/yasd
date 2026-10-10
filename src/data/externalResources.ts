import useSWR, { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'

import { useVersionSupport } from '@/hooks/useVersionSupport'
import { useProfile } from '@/store'
import { ExternalResources, ExternalResourcesUpdateResult } from '@/types'
import fetcher from '@/utils/fetcher'

const LIST_URL = '/external_resources'
const UPDATE_URL = '/external_resources/update'
// Surge replies after every download finishes, which can exceed the default timeout.
const UPDATE_TIMEOUT = 60_000

export const ALL_EXTERNAL_RESOURCES = 'all'

export const useExternalResourcesSupport = (): boolean =>
  useVersionSupport({ ios: '5.23.0', macos: '6.10.0' })

const useExternalResourcesKey = (url: string) => {
  const profile = useProfile()
  const isSupported = useExternalResourcesSupport()
  return isSupported && profile ? ([url, profile.id] as const) : null
}

export const useExternalResources = () =>
  useSWR(useExternalResourcesKey(LIST_URL), ([url]) =>
    fetcher<ExternalResources>({ url }),
  )

// Pass a resource key, or ALL_EXTERNAL_RESOURCES to update every remote resource.
export const useUpdateExternalResources = () => {
  const { mutate } = useSWRConfig()
  const listKey = useExternalResourcesKey(LIST_URL)

  return useSWRMutation(
    useExternalResourcesKey(UPDATE_URL),
    ([url], { arg: key }: { arg: string }) =>
      fetcher<ExternalResourcesUpdateResult>({
        url,
        method: 'POST',
        data: { key },
        timeout: UPDATE_TIMEOUT,
      }),
    { onSuccess: () => mutate(listKey) },
  )
}
