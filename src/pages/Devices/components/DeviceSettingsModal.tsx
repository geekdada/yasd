/** @jsx jsx */
import { jsx } from '@emotion/core'
import css from '@emotion/css/macro'
import React, { MouseEvent, KeyboardEvent, useState } from 'react'
import {
  ButtonGroup,
  Input,
  LoadingButton,
  ModalFooter,
  ModalHeader,
  ModalWrapper,
  Toggle,
} from '@sumup/circuit-ui'
import { useTranslation } from 'react-i18next'
import tw from 'twin.macro'
import { useForm, Controller, useFormState } from 'react-hook-form'
import isIP from 'is-ip'
import to from 'await-to-js'
import { toast } from 'react-toastify'
import { mutate } from 'swr'

import { DHCPDevice } from '../../../types'
import fetcher from '../../../utils/fetcher'
import { getValidationHint } from '../../../utils/validation'

interface DeviceSettingsModalProps {
  title: string
  dhcpDevice: DHCPDevice
  onClose: (event?: MouseEvent | KeyboardEvent) => void
}

interface FormData {
  name: string
  address: string
  shouldHandledBySurge: boolean
}

const DeviceSettingsModal = ({
  title,
  dhcpDevice,
  onClose,
}: DeviceSettingsModalProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: dhcpDevice.displayName,
      address: dhcpDevice.assignedIP || dhcpDevice.currentIP,
      shouldHandledBySurge: Boolean(dhcpDevice.shouldHandledBySurge),
    },
  })
  const { dirtyFields } = useFormState({
    control,
  })
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const onSubmit = (data: FormData) => {
    if (!Object.keys(dirtyFields).length) {
      toast.warn(t('devices.err_nothing_changed'))
      return
    }

    ;(async () => {
      setIsLoading(true)

      const payload: Partial<FormData> & {
        physicalAddress: string
      } = {
        physicalAddress: dhcpDevice.physicalAddress,
      }

      for (const i in dirtyFields) {
        const key = i as keyof FormData
        const isDirty = dirtyFields[key]

        if (isDirty) {
          // @ts-ignore
          payload[key] = data[key]
        }
      }

      const [err, result] = await to(
        fetcher<{
          error?: string
        }>({
          method: 'POST',
          url: '/devices',
          data: payload,
          timeout: 20000,
        }).then((res) => {
          if (res.error) {
            throw new Error(res.error)
          }
        }),
      )

      setIsLoading(false)

      if (err) {
        reset()
        console.error(err)
        toast.error(t('common.failed_interaction') + `: ${err.message}`)
        return
      }

      mutate('/devices')
      toast.success(t('common.success_interaction'))
      onClose()
    })()
  }

  return (
    <ModalWrapper>
      <ModalHeader
        title={`${t('devices.modify')} ${title}`}
        onClose={onClose}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div tw="pb-5">
          <Input
            invalid={!!errors?.name}
            disabled={isLoading}
            validationHint={getValidationHint(
              {
                required: t('devices.err_required'),
              },
              errors?.name,
            )}
            label={t('devices.name')}
            as="input"
            defaultValue={dhcpDevice.displayName}
            {...register('name', { required: true })}
          />
          <Input
            invalid={!!errors?.address}
            disabled={isLoading}
            validationHint={getValidationHint(
              {
                required: t('devices.err_required'),
                isIP: t('devices.err_not_ip'),
              },
              errors?.address,
            )}
            label={t('devices.address')}
            as="input"
            defaultValue={dhcpDevice.assignedIP || dhcpDevice.currentIP}
            {...register('address', {
              required: true,
              validate: {
                isIP: (val) => isIP(val),
              },
            })}
          />
          <Controller
            name="shouldHandledBySurge"
            control={control}
            render={({ field }) => (
              <Toggle
                disabled={isLoading}
                noMargin
                label={t('devices.handled_by_surge')}
                labelChecked="on"
                labelUnchecked="off"
                checked={field.value}
                onChange={() => field.onChange(!field.value)}
              />
            )}
          />
        </div>

        <ModalFooter align="right">
          <ButtonGroup>
            <LoadingButton
              isLoading={isLoading}
              variant="primary"
              as="submit"
              loadingLabel={t('common.is_loading')}>
              {t('common.save')}
            </LoadingButton>
          </ButtonGroup>
        </ModalFooter>
      </form>
    </ModalWrapper>
  )
}

export default DeviceSettingsModal
