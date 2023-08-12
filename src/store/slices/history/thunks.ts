import { createAsyncThunk } from '@reduxjs/toolkit'
import { find } from 'lodash-es'
import store from 'store2'

import type { RootState } from '@/store'
import { profileActions } from '@/store/slices/profile'
import type { Profile } from '@/types'
import { ExistingProfiles, LastUsedProfile } from '@/utils/constant'

export const loadHistoryFromLocalStorage = createAsyncThunk<
  Profile[],
  undefined,
  {
    state: RootState
  }
>('history/loadHistoryFromLocalStorage', async (_, thunkAPI) => {
  const storedExistingProfiles: Profile[] | null = store.get(ExistingProfiles)
  const lastUsedProfileId = store.get(LastUsedProfile)
  const lastUsedProfile = find<Profile>(storedExistingProfiles, {
    id: lastUsedProfileId,
  })

  if (lastUsedProfile) {
    thunkAPI.dispatch(profileActions.update(lastUsedProfile))
  }

  return storedExistingProfiles || []
})

export const addHistory = createAsyncThunk<
  Profile,
  {
    profile: Profile
    remember?: boolean
  },
  {
    state: RootState
  }
>('history/addHistory', async ({ profile, remember }, thunkAPI) => {
  const state = thunkAPI.getState().history
  const history = state.history ? [...state.history, profile] : [profile]

  if (remember) {
    store.set(ExistingProfiles, history)
    store.set(LastUsedProfile, profile.id)
  }

  return profile
})
