import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

export const useDeviceSettingsSchema = () => {
  const { t } = useTranslation()

  const DeviceSettingsSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().optional(),
        address: z
          .string()
          .trim()
          .ip({
            version: 'v4',
            message: t('devices.err_not_ip'),
          }),
        shouldHandledBySurge: z.boolean(),
      }),
    [t],
  )

  return DeviceSettingsSchema
}
