import React from 'react'
import { useTranslation } from 'react-i18next'

import { useResponsiveDialog } from '@/components/ResponsiveDialog'
import { Button } from '@/components/ui/button'
import type { Dialog } from '@/components/ui/dialog'

export type Action = {
  id: number | string
  title: string
  onClick: () => void
}

type ActionsModalProps = {
  title: string
  actions: ReadonlyArray<Action>
} & Omit<React.ComponentPropsWithoutRef<typeof Dialog>, 'children'>

const ActionsModal = ({
  title,
  actions,
  ...props
}: ActionsModalProps): JSX.Element => {
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

  return (
    <Dialog {...props}>
      <DialogContent className="select-none">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {actions.map((action) => (
            <Button stretch key={action.id} onClick={action.onClick}>
              {t(action.title)}
            </Button>
          ))}
        </div>

        <DialogFooter className="flex md:hidden">
          <DialogClose asChild>
            <Button variant="outline">{t('common.close')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ActionsModal
