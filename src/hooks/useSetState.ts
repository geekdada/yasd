import { useState } from 'react'

export const useSetState = <State = any>(
  initialState: State | (() => State),
) => {
  const [state, setState] = useState<State>(initialState)

  const getState = async (): Promise<State> => {
    let state: unknown

    await setState((currentState: State) => {
      state = currentState

      return currentState
    })

    return state as State
  }

  return [state, setState, getState] as [
    State,
    typeof setState,
    typeof getState,
  ]
}
