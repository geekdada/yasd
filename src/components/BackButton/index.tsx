import React from 'react'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import { IconButton } from '@sumup/circuit-ui'
import { ChevronLeft } from '@sumup/icons'

const BackButton: React.FC = () => {
  const navigate = useNavigate()

  return (
    <IconButton
      onClick={() => navigate(-1)}
      label="back"
      className="w-8 h-8 mr-3 self-center"
      css={css`
        padding: 0.3rem;
      `}
    >
      <ChevronLeft />
    </IconButton>
  )
}

export default BackButton
