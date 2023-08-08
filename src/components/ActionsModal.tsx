import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
      </DialogContent>

      <div className="space-y-5 pb-5">
        {actions.map((action) => (
          <Button stretch key={action.id} onClick={action.onClick}>
            {t(action.title)}
          </Button>
        ))}
      </div>
    </Dialog>
  )
}

export default ActionsModal
