import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Profile } from '@/types'
import { setServer } from '@/utils/fetcher'
import { updateStoredProfile } from '@/utils/store'

export interface ProfileState {
  profile: Profile | undefined
}

const initialState: ProfileState = {
  profile: undefined,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<Profile>) => {
      setServer(action.payload.host, action.payload.port, action.payload.key, {
        tls: action.payload.tls,
      })

      state.profile = action.payload
    },
    clear: (state) => {
      state.profile = undefined
    },
    updatePlatformVersion: (
      state,
      action: PayloadAction<{
        platformVersion: Profile['platformVersion']
      }>,
    ) => {
      if (!state.profile) {
        throw new Error(
          'updatePlatformVersion cannot be dispatched if the profile is absent.',
        )
      }

      const profile = state.profile
      const updated = {
        ...profile,
        platformVersion: action.payload.platformVersion,
      }

      updateStoredProfile(updated.id, updated)
      state.profile = updated
    },
  },
})

const profileActions = profileSlice.actions

export { profileSlice, profileActions }
