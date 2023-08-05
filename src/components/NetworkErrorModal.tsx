import React, { KeyboardEvent, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@sumup/circuit-ui'

import { ButtonGroup } from '@/components/ui/button-group'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface NetworkErrorModalProps {
  onClose: (event?: MouseEvent | KeyboardEvent) => void
  isOpen: boolean
  reloadButton?: boolean
}

const NetworkErrorModal: React.FC<NetworkErrorModalProps> = ({
  isOpen,
  onClose,
  reloadButton,
}) => {
  const { t } = useTranslation()

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('common.network_error_title')}</DialogTitle>
        </DialogHeader>

        <div className="mb-3">{t('common.network_error_message')}</div>
        <DialogFooter>
          <ButtonGroup>
            {reloadButton ? (
              <Button
                onClick={() => {
                  window.location.reload()
                }}
              >
                {t('common.reload_window_retry')}
              </Button>
            ) : (
              <React.Fragment></React.Fragment>
            )}
            <Button onClick={onClose} variant="primary">
              {t('common.exit')}
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NetworkErrorModal
