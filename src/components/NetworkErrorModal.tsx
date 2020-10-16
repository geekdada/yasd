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
import tw from 'twin.macro'

interface NetworkErrorModalProps {
  onClose: (event: MouseEvent | KeyboardEvent) => void
  isOpen: boolean
}

const NetworkErrorModal: React.FC<NetworkErrorModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {({ onClose }) => (
        <ModalWrapper>
          <ModalHeader title="网络错误" />
          <div tw="mb-3">YASD 无法连接 Surge 或连接失败，请退出后重试</div>
          <ModalFooter align="right">
            <ButtonGroup>
              <Button onClick={onClose} variant="primary">
                退出
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalWrapper>
      )}
    </Modal>
  )
}

export default NetworkErrorModal
