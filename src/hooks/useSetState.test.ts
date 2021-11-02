import { renderHook, act } from '@testing-library/react-hooks'

import { useSetState } from './useSetState'

describe('useSetState', () => {
  type State = { a: string; b: string }
  test('setState with object argument', async () => {
    const { result } = renderHook(() =>
      useSetState<State>({ a: 'old', b: 'old' }),
    )

    act(() => {
      const [state, setState] = result.current

      setState({ ...state, b: 'new' })

      setState((state: State) => {
        expect(state).toMatchObject({ a: 'old', b: 'new' })

        return state
      })
    })

    const [state, setState, getState] = result.current
    expect(state).toMatchObject({ a: 'old', b: 'new' })
  })

  test('setState with functon as argument', async () => {
    const { result } = renderHook(() =>
      useSetState<State>({ a: 'old', b: 'old' }),
    )

    await act(async () => {
      const [state, setState] = result.current

      setState((state: State) => ({ ...state, b: 'new' }))
    })

    const [state, setState, getState] = result.current
    expect(state).toMatchObject({ a: 'old', b: 'new' })
  })

  test('setState then getState', async () => {
    const { result } = renderHook(() =>
      useSetState<State>({ a: 'old', b: 'old' }),
    )

    await act(async () => {
      const [state, setState, getState] = result.current

      setState((state: any) => ({ ...state, b: 'new' }))
      const nextState = await getState()

      expect(nextState).toMatchObject({ a: 'old', b: 'new' })
    })

    const [state, setState, getState] = result.current
    expect(state).toMatchObject({ a: 'old', b: 'new' })

    await act(async () => {
      expect(await getState()).toMatchObject({ a: 'old', b: 'new' })
    })
  })
})
