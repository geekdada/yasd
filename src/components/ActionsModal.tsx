import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'usehooks-ts'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { BottomSafeArea } from '@/components/VerticalSafeArea'

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
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {actions.map((action) => (
              <Button stretch key={action.id} onClick={action.onClick}>
                {t(action.title)}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      <DrawerContent className="select-none">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          {actions.map((action) => (
            <Button stretch key={action.id} onClick={action.onClick}>
              {t(action.title)}
            </Button>
          ))}
          <DrawerClose>
            <Button className="w-full" variant="outline">
              {t('common.close')}
            </Button>
          </DrawerClose>
        </DrawerFooter>
        <BottomSafeArea />
      </DrawerContent>
    </Drawer>
  )
}

export default ActionsModal
