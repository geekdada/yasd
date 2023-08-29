import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

import type { ConnectorTraffic, DataPoint, Traffic } from '@/types'

import type { PayloadAction } from '@reduxjs/toolkit'

const HISTORY_SIZE = 60

export interface TrafficState {
  startTime?: number
  interface: {
    [name: string]: ConnectorTraffic
  }
  connector: {
    [name: string]: ConnectorTraffic
  }
  history: {
    down: DataPoint[]
    up: DataPoint[]
  }
}

const initialState: TrafficState = getInitialState()

const trafficSlice = createSlice({
  name: 'traffic',
  initialState,
  reducers: {
    updateStartTime(state, action: PayloadAction<number>) {
      state.startTime = action.payload
    },
    updateInterface(state, action: PayloadAction<Traffic['interface']>) {
      state.interface = action.payload
    },
    updateConnector(state, action: PayloadAction<Traffic['connector']>) {
      state.connector = action.payload
    },
    updateHistory(
      state,
      action: PayloadAction<{
        down?: DataPoint
        up?: DataPoint
      }>,
    ) {
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

      state.history = history
    },
    clear(state) {
      Object.assign(state, getInitialState())
    },
  },
})

function getInitialState(): TrafficState {
  return {
    startTime: undefined,
    interface: {},
    connector: {},
    history: {
      down: getInitialTrafficHistory(),
      up: getInitialTrafficHistory(),
    },
  }
}

function getInitialTrafficHistory(): DataPoint[] {
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

const trafficActions = trafficSlice.actions

export { trafficSlice, trafficActions }
