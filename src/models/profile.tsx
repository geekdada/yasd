import React, { createContext, useState } from 'react'

import { Profile } from '../types'
import { setServer } from '../utils/fetcher'

interface IProfileContext {
  profile?: Profile
  setProfile: (profile: Profile) => void
}

const context: IProfileContext = {
  setProfile(profile) {
    setServer(profile.host, profile.port, profile.key, { tls: profile.tls })
    this.profile = profile
  },
}

export const ProfileContext = createContext<IProfileContext>(context)

export const useProfile = (): Profile | undefined => {
  const context = React.useContext(ProfileContext)

  return context?.profile
}

export const useSetProfile = (): IProfileContext['setProfile'] => {
  return context.setProfile.bind(context)
}
