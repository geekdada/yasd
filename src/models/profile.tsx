import React, {
  useContext,
  createContext,
  Dispatch,
  ReactNode,
  Reducer,
  useReducer,
} from 'react'

import { Profile } from '@/types'
import { setServer } from '@/utils/fetcher'
import { updateStoredProfile } from '@/utils/store'

interface IProfileContext {
  profile?: Profile
}

export enum ProfileActions {
  Update = 'update',
  Clear = 'clear',
  UpdatePlatformVersion = 'updatePlatformVersion',
}

type ReducerAction =
  | {
      type: ProfileActions.Update
      payload: Profile
    }
  | {
      type: ProfileActions.Clear
    }
  | {
      type: ProfileActions.UpdatePlatformVersion
      payload: {
        platformVersion: Profile['platformVersion']
      }
    }

const profileReducer: Reducer<IProfileContext, ReducerAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case ProfileActions.Update:
      setServer(action.payload.host, action.payload.port, action.payload.key, {
        tls: action.payload.tls,
      })

      return {
        profile: {
          ...state.profile,
          ...action.payload,
        },
      }
    case ProfileActions.Clear:
      return {
        profile: undefined,
      }
    case ProfileActions.UpdatePlatformVersion: {
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

      return {
        profile: updated,
      }
    }
    default:
      throw new Error(`Unknown action type: ${action}`)
  }
}

const ProfileContext = createContext<IProfileContext>({
  profile: undefined,
})

const ProfileDispatchContext = createContext<Dispatch<ReducerAction>>(
  () => undefined,
)

export const ProfileProvider: React.FC<{
  children: ReactNode | ReactNode[]
}> = (props) => {
  const [state, dispatch] = useReducer(profileReducer, {
    profile: undefined,
  })

  return (
    <ProfileContext.Provider value={state}>
      <ProfileDispatchContext.Provider value={dispatch}>
        {props.children}
      </ProfileDispatchContext.Provider>
    </ProfileContext.Provider>
  )
}

export const useProfile = (): Profile | undefined => {
  const context = useContext(ProfileContext)

  return context.profile
}

export const usePlatform = (): Profile['platform'] | undefined => {
  const context = useContext(ProfileContext)

  return context.profile?.platform
}
export const usePlatformVersion = ():
  | Profile['platformVersion']
  | undefined => {
  const context = useContext(ProfileContext)

  return context.profile?.platformVersion
}
export const usePlatformBuild = (): Profile['platformBuild'] | undefined => {
  const context = useContext(ProfileContext)

  return context.profile?.platformBuild
}

export const useSurgeHost = (): string | null => {
  const context = useContext(ProfileContext)

  if (!context.profile) return null

  const { tls, host, port } = context.profile

  return `${tls ? 'https:' : 'http:'}//${host}:${port}`
}

export const useProfileDispatch = (): Dispatch<ReducerAction> =>
  useContext(ProfileDispatchContext)
