import React, { useCallback, useState } from 'react'
import { useForm, useFormState } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { to } from 'await-to-js'
import { mutate } from 'swr'

import { useResponsiveDialog } from '@/components/ResponsiveDialog'
import { Button } from '@/components/ui/button'
import type { Dialog } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { DHCPDevice } from '@/types'
import fetcher from '@/utils/fetcher'

import { useDeviceSettingsSchema } from './schemas'

type DeviceSettingsModalProps = {
  title: string
  dhcpDevice: DHCPDevice
} & Omit<React.ComponentPropsWithoutRef<typeof Dialog>, 'children'>

type FormData = {
  name: string
  address: string
  shouldHandledBySurge: boolean
}

const DeviceSettingsModal = ({
  title,
  dhcpDevice,
  ...props
}: DeviceSettingsModalProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription,
  } = useResponsiveDialog()

  const DeviceSettingsSchema = useDeviceSettingsSchema()

  const form = useForm<FormData>({
    resolver: zodResolver(DeviceSettingsSchema),
    defaultValues: {
      name: dhcpDevice.displayName || '',
      address: dhcpDevice.assignedIP || dhcpDevice.currentIP,
      shouldHandledBySurge: Boolean(dhcpDevice.shouldHandledBySurge),
    },
  })
  const { handleSubmit, control } = form
  const { dirtyFields } = useFormState({
    control,
  })

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = useCallback(
    (data: FormData) => {
      if (!Object.keys(dirtyFields).length) {
        toast(t('devices.err_nothing_changed'))
        return
      }

      ;(async () => {
        setIsLoading(true)

        const payload: Record<string, unknown> = {}

        for (const i in dirtyFields) {
          const key = i as keyof FormData
          const isDirty = dirtyFields[key]

          if (isDirty) {
            payload[key] = data[key]
          }
        }

        const [err] = await to(
          fetcher<{
            error?: string
          }>({
            method: 'POST',
            url: '/devices',
            data: { ...payload, physicalAddress: dhcpDevice.physicalAddress },
          }).then((res) => {
            if (res.error) {
              throw new Error(res.error)
            }
          }),
        )

        setIsLoading(false)

        if (err) {
          console.error(err)
          toast.error(t('common.failed_interaction') + `: ${err.message}`)
          return
        }

        mutate('/devices')
        toast.success(t('common.success_interaction'))
        if (props.onOpenChange) {
          props.onOpenChange(false)
        }
      })()
    },
    [dhcpDevice.physicalAddress, dirtyFields, props, t],
  )

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${t('devices.modify')} ${title}`}</DialogTitle>
          <DialogDescription className="sr-only">
            {`${t('devices.modify')} ${title}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('devices.name')}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      autoComplete="off"
                      autoFocus
                      data-1p-ignore
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('devices.address')}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      autoCorrect="off"
                      autoComplete="off"
                      autoCapitalize="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shouldHandledBySurge"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 py-2">
                  <FormLabel>{t('devices.handled_by_surge')}</FormLabel>
                  <FormControl>
                    <Switch
                      disabled={isLoading}
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                disabled={!Object.keys(dirtyFields).length}
                isLoading={isLoading}
                type="submit"
                loadingLabel={t('common.is_loading')}
              >
                {t('common.save')}
              </Button>
              <DialogClose asChild className="md:hidden">
                <Button variant="outline">{t('common.cancel')}</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default DeviceSettingsModal
