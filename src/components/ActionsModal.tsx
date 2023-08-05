import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Headline } from '@sumup/circuit-ui'

interface Action {
  id: number | string
  title: string
  onClick: () => void
}

interface ActionsModalProps {
  title: string
  actions: ReadonlyArray<Action>
}

const ActionsModal = ({ title, actions }: ActionsModalProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <div>
      <Headline as="h2" size="two">
        {title}
      </Headline>

      <div className="space-y-5 pb-5">
        {actions.map((action) => (
          <Button
            stretch
            key={action.id}
            onClick={action.onClick}
            variant="primary"
          >
            {t(action.title)}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default ActionsModal
