import React, { createContext, Dispatch, Reducer, useReducer } from 'react'

import { Profile } from '../types'
import { setServer } from '../utils/fetcher'

interface IProfileContext {
  profile?: Profile
}

type ReducerAction =
  | {
      type: 'update'
      payload: Profile
    }
  | {
      type: 'clear'
    }

const profileReducer: Reducer<IProfileContext, ReducerAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'update':
      setServer(action.payload.host, action.payload.port, action.payload.key, {
        tls: action.payload.tls,
      })
      return {
        profile: action.payload,
      }
    case 'clear':
      return {
        profile: undefined,
      }
    default:
      throw new Error()
  }
}

const ProfileContext = createContext<IProfileContext>({
  profile: undefined,
})

const ProfileDispatchContext = createContext<
  Dispatch<ReducerAction> | undefined
>(undefined)

export const ProfileProvider: React.FC = (props) => {
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
  const context = React.useContext(ProfileContext)

  return context.profile
}

export const usePlatform = (): Profile['platform'] | undefined => {
  const context = React.useContext(ProfileContext)

  return context.profile?.platform
}
export const usePlatformVersion = ():
  | Profile['platformVersion']
  | undefined => {
  const context = React.useContext(ProfileContext)

  return context.profile?.platformVersion
}

export const useSurgeHost = (): string | null => {
  const context = React.useContext(ProfileContext)

  if (!context.profile) return null

  const { tls, host, port } = context.profile

  return `${tls ? 'https:' : 'http:'}//${host}:${port}`
}

export const useProfileDispatch = (): Dispatch<ReducerAction> => {
  const context = React.useContext(ProfileDispatchContext)

  if (!context) {
    throw new Error()
  }

  return context
}
