import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { useConfirmations } from '../UIProvider'

import { ConfirmationForm } from './ConfirmationForm'

import type { SimpleConfirmProperties } from '../types'

const Confirmation = ({
  confirmation,
  index,
}: {
  confirmation: SimpleConfirmProperties
  index: number
}) => {
  const { t } = useTranslation()
  const { cleanConfirmation } = useConfirmations()

  const handleAction = useCallback(
    (confirmation: SimpleConfirmProperties, index: number) => {
      if (confirmation.onConfirm) {
        confirmation.onConfirm()
      }

      cleanConfirmation(index)
    },
    [cleanConfirmation],
  )

  const handleCancel = useCallback(
    (confirmation: SimpleConfirmProperties, index: number) => {
      if (confirmation.onCancel) {
        confirmation.onCancel()
      }

      cleanConfirmation(index)
    },
    [cleanConfirmation],
  )

  return (
    <AlertDialog open={confirmation.open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmation.title}</AlertDialogTitle>

          {confirmation.description ? (
            <AlertDialogDescription>
              {confirmation.description}
            </AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleCancel(confirmation, index)}>
            {confirmation.cancelText ?? t('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleAction(confirmation, index)}>
            {confirmation.confirmText ?? t('common.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const Confirmations = () => {
  const { confirmations } = useConfirmations()

  return (
    <>
      {confirmations.map((confirmation, index) =>
        'form' in confirmation ? (
          <ConfirmationForm
            confirmation={confirmation}
            index={index}
            key={confirmation.title}
          />
        ) : (
          <Confirmation
            confirmation={confirmation}
            index={index}
            key={confirmation.title}
          />
        ),
      )}
    </>
  )
}

export default Confirmations
