import React, { memo, type ReactNode } from 'react'
import { css } from '@emotion/react'
import tw from 'twin.macro'
import { useMediaQuery } from 'usehooks-ts'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

const CustomDrawerContent = tw(DrawerContent)`px-6`
const CustomDrawerHeader = tw(DrawerHeader)`px-0`
const CustomDrawerFooter = memo(function CustomDrawerFooter({
  children,
}: {
  children: ReactNode
}) {
  return (
    <DrawerFooter
      className="px-0"
      css={css`
        padding-bottom: max(env(safe-area-inset-bottom), 1rem);
      `}
    >
      {children}
    </DrawerFooter>
  )
})

export const useResponsiveDialog = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop
    ? ({
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
      } as const)
    : ({
        Dialog: Drawer,
        DialogClose: DrawerClose,
        DialogContent: CustomDrawerContent,
        DialogDescription: DrawerDescription,
        DialogFooter: CustomDrawerFooter,
        DialogHeader: CustomDrawerHeader,
        DialogTitle: DrawerTitle,
        DialogTrigger: DrawerTrigger,
      } as const)
}
