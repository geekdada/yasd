import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

export const useSchemas = () => {
  const { t } = useTranslation()

  const SurgeLoginFormSchema = useMemo(
    () =>
      z.object({
        key: z.string({
          required_error: t('devices.err_required'),
        }),
        keepCredential: z.boolean(),
      }),
    [t],
  )

  const RegularLoginFormSchema = useMemo(
    () =>
      z.object({
        name: z.string({
          required_error: t('devices.err_required'),
        }),
        host: z.string({
          required_error: t('devices.err_required'),
        }),
        port: z
          .number({
            required_error: t('devices.err_required'),
          })
          .min(1)
          .max(65535),
        key: z.string({
          required_error: t('devices.err_required'),
        }),
        useTls: z.boolean(),
        keepCredential: z.boolean(),
      }),
    [t],
  )

  return {
    SurgeLoginFormSchema,
    RegularLoginFormSchema,
  }
}
