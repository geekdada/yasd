/** @jsx jsx */
import { jsx } from '@emotion/core'
import { noop } from 'lodash-es'
import { KeyboardEvent, MouseEvent } from 'react'
import css from '@emotion/css/macro'
import { useTranslation } from 'react-i18next'
import tw from 'twin.macro'
import {
  ButtonGroup,
  Button,
  ModalFooter,
  ModalHeader,
  ModalWrapper,
} from '@sumup/circuit-ui'

interface Action {
  id: number | string
  title: string
  onClick: () => void
}

interface ActionsModalProps {
  title: string
  onClose: (event?: MouseEvent | KeyboardEvent) => void
  actions: ReadonlyArray<Action>
}

const ActionsModal = ({
  title,
  onClose,
  actions,
}: ActionsModalProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <ModalWrapper>
      <ModalHeader title={title} onClose={onClose} />

      <div tw="space-y-5 pb-5">
        {actions.map((action) => (
          <Button
            stretch
            key={action.id}
            onClick={action.onClick}
            variant="primary">
            {t(action.title)}
          </Button>
        ))}
      </div>
    </ModalWrapper>
  )
}

export default ActionsModal
