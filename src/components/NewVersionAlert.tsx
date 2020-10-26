/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { useEffect, useState } from 'react'
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
import store from 'store2'

import { LastUsedVersion } from '../utils/constant'

const currentVersion = process.env.REACT_APP_VERSION

const NewVersionAlert: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [versionUrl, setVersionUrl] = useState<string>()

  useEffect(() => {
    const lastUsedVersion = store.get(LastUsedVersion)

    if (lastUsedVersion && lastUsedVersion !== currentVersion) {
      setVersionUrl(
        `https://github.com/geekdada/yasd/releases/tag/v${currentVersion}`,
      )
      setIsOpen(true)
    }

    store.set(LastUsedVersion, currentVersion)
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false)
      }}>
      {({ onClose }) => (
        <ModalWrapper>
          <ModalHeader title="发现新版本" onClose={onClose} />
          <div tw="mb-3">快看看更新了什么</div>
          <ModalFooter align="right">
            <ButtonGroup>
              <a href={versionUrl} target="_blank" rel="noreferrer">
                <Button variant="primary" onClick={onClose}>
                  查看
                </Button>
              </a>
            </ButtonGroup>
          </ModalFooter>
        </ModalWrapper>
      )}
    </Modal>
  )
}

export default NewVersionAlert
