/** @jsx jsx */
import { jsx } from '@emotion/core'
import { IconButton } from '@sumup/circuit-ui'
import { ChevronLeft } from '@sumup/icons'
import React from 'react'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import tw from 'twin.macro'
import { useHistory } from 'react-router-dom'

const BackButton: React.FC = () => {
  const history = useHistory()

  return (
    <IconButton
      onClick={() => history.goBack()}
      label="back"
      tw="w-8 h-8 mr-3 self-center"
      css={css`
        padding: 0.3rem;
      `}>
      <ChevronLeft />
    </IconButton>
  )
}

export default BackButton
