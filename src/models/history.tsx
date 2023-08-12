import React, {
  useContext,
  createContext,
  Dispatch,
  ReactNode,
  Reducer,
  useReducer,
} from 'react'
import { find } from 'lodash-es'
import store from 'store2'

import { Profile } from '@/types'
import { ExistingProfiles, LastUsedProfile } from '@/utils/constant'

export enum HistoryActions {
  LOAD_HISTORY = 'LOAD_HISTORY',
  DELETE_HISTORY = 'DELETE_HISTORY',
  DELETE_ALL_HISTORY = 'DELETE_ALL_HISTORY',
  ADD_HISTORY = 'ADD_HISTORY',
  REMEMBER_LAST_USED = 'REMEMBER_LAST_USED',
}

interface IHistoryContext {
  history: Profile[] | undefined
}

type HistoryReducerAction =
  | {
      type: HistoryActions.LOAD_HISTORY
    }
  | {
      type: HistoryActions.DELETE_HISTORY
      payload: {
        id: string
      }
    }
  | {
      type: HistoryActions.DELETE_ALL_HISTORY
    }
  | {
      type: HistoryActions.ADD_HISTORY
      payload: {
        profile: Profile
        remember?: boolean
      }
    }
  | {
      type: HistoryActions.REMEMBER_LAST_USED
      payload: {
        id: string
      }
    }

export const historyReducer: Reducer<IHistoryContext, HistoryReducerAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case HistoryActions.LOAD_HISTORY: {
      const storedExistingProfiles: Profile[] | null =
        store.get(ExistingProfiles)
      const lastId = store.get(LastUsedProfile)
      const result = find<Profile>(storedExistingProfiles, { id: lastId })

      if (result) {
        // TODO: Choose the last used profile
      }

      return {
        ...state,
        history: storedExistingProfiles || [],
      }
    }

    case HistoryActions.DELETE_HISTORY: {
      if (!state.history) {
        return state
      }

      const { id } = action.payload
      const history = state.history.filter((profile) => profile.id !== id)

      store.set(ExistingProfiles, history)

      return {
        ...state,
        history,
      }
    }

    case HistoryActions.DELETE_ALL_HISTORY: {
      store.remove(LastUsedProfile)
      store.remove(ExistingProfiles)

      return {
        ...state,
        history: [],
      }
    }

    case HistoryActions.ADD_HISTORY: {
      const {
        payload: { profile, remember },
      } = action
      const history = state.history ? [...state.history, profile] : [profile]

      if (remember) {
        store.set(ExistingProfiles, history)
        store.set(LastUsedProfile, profile.id)
      }

      return {
        ...state,
        history,
      }
    }

    case HistoryActions.REMEMBER_LAST_USED: {
      const { id } = action.payload

      store.set(LastUsedProfile, id)

      return {
        ...state,
      }
    }

    default:
      throw new Error(`Unknown action type: ${action}`)
  }
}

const HistoryContext = createContext<IHistoryContext>({
  history: undefined,
})

const HistoryDispatchContext = createContext<Dispatch<HistoryReducerAction>>(
  () => undefined,
)

export const HistoryProvider: React.FC<{
  children: ReactNode | ReactNode[]
}> = (props) => {
  const [state, dispatch] = useReducer(historyReducer, {
    history: undefined,
  })

  return (
    <HistoryContext.Provider value={state}>
      <HistoryDispatchContext.Provider value={dispatch}>
        {props.children}
      </HistoryDispatchContext.Provider>
    </HistoryContext.Provider>
  )
}

export const useHistory = () => {
  const context = useContext(HistoryContext)

  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider')
  }

  return context.history
}

export const useHistoryDispatch = () => {
  const context = useContext(HistoryDispatchContext)

  if (context === undefined) {
    throw new Error('useHistoryDispatch must be used within a HistoryProvider')
  }

  return context
}
