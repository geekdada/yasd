import React, { createContext, useState } from 'react'

import { Profile } from '../types'

type ProfileContextType = {
  profile?: Profile
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const ProfileProvider: React.FC<{
  profile?: Profile
}> = (props) => {
  const [profile, setProfile] = useState<Profile>()

  if (profile !== props.profile) {
    setProfile(props.profile)
  }

  return (
    <ProfileContext.Provider value={{ profile }}>
      {props.children}
    </ProfileContext.Provider>
  )
}

export const useProfile = (): Profile | undefined => {
  const context = React.useContext(ProfileContext)

  return context?.profile
}
