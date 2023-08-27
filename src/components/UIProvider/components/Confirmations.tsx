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

const Confirmations = () => {
  const { confirmations, cleanConfirmation } = useConfirmations()
  const { t } = useTranslation()

  const handleAction = useCallback(
    (index: number) => {
      const confirmation = confirmations[index]

      if (confirmation.onConfirm) {
        confirmation.onConfirm()
      }

      cleanConfirmation(index)
    },
    [cleanConfirmation, confirmations],
  )

  const handleCancel = useCallback(
    (index: number) => {
      const confirmation = confirmations[index]

      if (confirmation.onCancel) {
        confirmation.onCancel()
      }

      cleanConfirmation(index)
    },
    [cleanConfirmation, confirmations],
  )

  return (
    <>
      {confirmations.map((confirmation, index) => (
        <AlertDialog key={confirmation.title} open={confirmation.open}>
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
              <AlertDialogCancel onClick={() => handleCancel(index)}>
                {confirmation.cancelText ?? t('common.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => handleAction(index)}>
                {confirmation.confirmText ?? t('common.confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </>
  )
}

export default Confirmations
