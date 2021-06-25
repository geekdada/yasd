/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react'
import tw from 'twin.macro'
import css from '@emotion/css/macro'

import ProfileCell from '../../../components/ProfileCell'
import { useProfile } from '../../../models/profile'

const HostInfo = (): JSX.Element => {
  const profile = useProfile()

  return (
    <div tw="bg-gray-100 rounded-lg">
      {profile && <ProfileCell variant="left" profile={profile} />}
    </div>
  )
}

export default HostInfo
