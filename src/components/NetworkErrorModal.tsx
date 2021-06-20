/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { KeyboardEvent, MouseEvent } from 'react'
import {
  Button,
  ButtonGroup,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalWrapper,
} from '@sumup/circuit-ui'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import { useTranslation } from 'react-i18next'
import tw from 'twin.macro'

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
    <Modal isOpen={isOpen} onClose={onClose}>
      {({ onClose }) => (
        <ModalWrapper>
          <ModalHeader title={t('common.network_error_title')} />
          <div tw="mb-3">{t('common.network_error_message')}</div>
          <ModalFooter align="right">
            <ButtonGroup>
              {reloadButton ? (
                <Button
                  onClick={() => {
                    window.location.reload()
                  }}>
                  {t('common.reload_window_retry')}
                </Button>
              ) : (
                <React.Fragment></React.Fragment>
              )}
              <Button onClick={onClose} variant="primary">
                {t('common.exit')}
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalWrapper>
      )}
    </Modal>
  )
}

export default NetworkErrorModal
