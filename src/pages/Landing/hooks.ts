import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { getSurgeHost } from '@/pages/Landing/utils'
import { isRunInSurge } from '@/utils'

const useSchemas = () => {
  const { t } = useTranslation()
  const RegularLoginFormSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, {
          message: t('devices.err_required'),
        }),
        host: z.string().min(1, {
          message: t('devices.err_required'),
        }),
        port: z.number().min(1).max(65535),
        key: z.string().min(1, {
          message: t('devices.err_required'),
        }),
        useTls: z.boolean(),
        keepCredential: z.boolean(),
      }),
    [t],
  )

  return {
    RegularLoginFormSchema,
  }
}

export const useAuthData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [tlsInstruction, setTlsInstruction] = useState<{
    origin?: string
    accessKey?: string
    open: boolean
  }>({
    open: false,
  })

  return {
    isLoading,
    setIsLoading,
    tlsInstruction,
    setTlsInstruction,
  }
}

export const useLoginForm = () => {
  const { RegularLoginFormSchema } = useSchemas()
  const surgeHost = getSurgeHost()
  const defaultValues = isRunInSurge()
    ? ({
        name: 'Surge',
        host: surgeHost.hostname,
        port: Number(surgeHost.port),
        key: '',
        keepCredential: true,
        useTls: surgeHost.protocol === 'https:',
      } as const)
    : ({
        name: '',
        host: '',
        port: 6171,
        key: '',
        keepCredential: true,
        useTls: window.location.protocol === 'https:',
      } as const)
  const regularForm = useForm<z.infer<typeof RegularLoginFormSchema>>({
    resolver: zodResolver(RegularLoginFormSchema),
    defaultValues,
  })

  return { form: regularForm, Schema: RegularLoginFormSchema }
}
