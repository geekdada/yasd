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
import { useTranslation } from 'react-i18next'
import tw from 'twin.macro'
import store from 'store2'
import satisfies from 'semver/functions/satisfies'

import { LastUsedVersion } from '../utils/constant'

const currentVersion = process.env.REACT_APP_VERSION as string

const NewVersionAlert: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [versionUrl, setVersionUrl] = useState<string>()
  const { t } = useTranslation()

  useEffect(() => {
    const lastUsedVersion = store.get(LastUsedVersion)

    if (lastUsedVersion && !satisfies(currentVersion, `~${lastUsedVersion}`)) {
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
      }}
    >
      {({ onClose }) => (
        <ModalWrapper>
          <ModalHeader title={t('new_version_alert.title')} onClose={onClose} />
          <div tw="mb-3">{t('new_version_alert.message')}</div>
          <ModalFooter align="right">
            <ButtonGroup>
              <a href={versionUrl} target="_blank" rel="noreferrer">
                <Button variant="primary" onClick={onClose}>
                  {t('common.see')}
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
