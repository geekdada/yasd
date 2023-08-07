import React, {
  useContext,
  createContext,
  Dispatch,
  ReactNode,
  Reducer,
  useReducer,
} from 'react'
import dayjs from 'dayjs'

import { DataPoint, Traffic } from '@/types'

interface ITrafficContext extends Traffic {
  history: {
    down: DataPoint[]
    up: DataPoint[]
  }
}

export enum TrafficActions {
  UpdateInterface = 'updateInterface',
  UpdateConnector = 'updateConnector',
  UpdateHistory = 'updateHistory',
}

export const HISTORY_SIZE = 60

type ReducerAction =
  | {
      type: TrafficActions.UpdateInterface
      payload: Traffic['interface']
    }
  | {
      type: TrafficActions.UpdateConnector
      payload: Traffic['connector']
    }
  | {
      type: TrafficActions.UpdateHistory
      payload: {
        down?: DataPoint
        up?: DataPoint
      }
    }

const trafficReducer: Reducer<ITrafficContext, ReducerAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'updateInterface':
      return {
        ...state,
        interface: action.payload,
      }
    case 'updateConnector':
      return {
        ...state,
        connector: action.payload,
      }
    case 'updateHistory': {
      const history = {
        down: [...state.history.down],
        up: [...state.history.up],
      }

      if (action.payload.down) {
        history.down.unshift(action.payload.down)
      }
      if (action.payload.up) {
        history.up.unshift(action.payload.up)
      }

      if (history.down.length > HISTORY_SIZE) {
        history.down.pop()
      }
      if (history.up.length > HISTORY_SIZE) {
        history.up.pop()
      }

      return {
        ...state,
        history,
      }
    }
    default:
      throw new Error(`Unknown action type: ${action}`)
  }
}

const TrafficContext = createContext<ITrafficContext | undefined>(undefined)

const TrafficDispatchContext = createContext<Dispatch<ReducerAction>>(
  () => undefined,
)

export const TrafficProvider: React.FC<{
  children: ReactNode | ReactNode[]
}> = (props) => {
  const [state, dispatch] = useReducer(trafficReducer, {
    startTime: Date.now(),
    interface: {},
    connector: {},
    history: {
      down: getInitialData(),
      up: getInitialData(),
    },
  })

  return (
    <TrafficContext.Provider value={state}>
      <TrafficDispatchContext.Provider value={dispatch}>
        {props.children}
      </TrafficDispatchContext.Provider>
    </TrafficContext.Provider>
  )
}

export const useTrafficDispatch = (): Dispatch<ReducerAction> =>
  useContext(TrafficDispatchContext)

export const useInterfaces = (): Traffic['interface'] => {
  const context = useContext(TrafficContext) as ITrafficContext
  return context.interface
}

export const useConnectors = (): Traffic['connector'] => {
  const context = useContext(TrafficContext) as ITrafficContext
  return context.connector
}

export const useTrafficHistory = (): {
  down: DataPoint[]
  up: DataPoint[]
} => {
  const context = useContext(TrafficContext) as ITrafficContext
  return context.history
}

function getInitialData(): DataPoint[] {
  const result = []

  for (let i = 1; i < HISTORY_SIZE + 1; i++) {
    const time = dayjs()
      .subtract(i * 1000, 'millisecond')
      .toDate()
      .getTime()

    result.push({ x: time, y: 0 })
  }

  return result
}
