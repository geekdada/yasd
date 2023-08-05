import React from 'react'
import { css } from '@emotion/react'
import tw from 'twin.macro'

import ProfileCell from '../../../components/ProfileCell'
import { useProfile } from '../../../models/profile'

const HostInfo = (): JSX.Element => {
  const profile = useProfile()

  return (
    <div className="bg-gray-100 rounded-lg">
      {profile && <ProfileCell variant="left" profile={profile} />}
    </div>
  )
}

export default HostInfo
