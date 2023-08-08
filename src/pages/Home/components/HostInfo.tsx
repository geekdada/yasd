import React from 'react'

import ProfileCell from '@/components/ProfileCell'
import { useProfile } from '@/models/profile'

const HostInfo = (): JSX.Element => {
  const profile = useProfile()

  return (
    <div className="bg-muted text-foreground rounded-lg">
      {profile && <ProfileCell variant="left" profile={profile} />}
    </div>
  )
}

export default HostInfo
