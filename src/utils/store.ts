import { findIndex } from 'lodash-es'
import store from 'store2'

import { Profile } from '@/types'

import { ExistingProfiles } from './constant'

export const updateStoredProfile = (
  profileId: Profile['id'],
  newProfile: Profile,
): void => {
  const storedExistingProfiles: Profile[] = store.get(ExistingProfiles)

  if (storedExistingProfiles) {
    const result = findIndex(storedExistingProfiles, { id: profileId })

    if (result !== -1) {
      storedExistingProfiles.splice(result, 1, newProfile)
      store.set(ExistingProfiles, storedExistingProfiles)
    }
  }
}
