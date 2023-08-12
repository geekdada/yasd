import React from 'react'

import { useProfile } from '@/store'

const withProfile = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P> =>
  function WithProfile(props) {
    const profile = useProfile()

    if (!profile) {
      return null
    }

    return <Component {...(props as P)} profile={profile} />
  }

export default withProfile
