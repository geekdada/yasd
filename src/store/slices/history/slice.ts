import { createSlice } from '@reduxjs/toolkit'
import store from 'store2'

import {
  addHistory,
  loadHistoryFromLocalStorage,
} from '@/store/slices/history/thunks'
import { Profile } from '@/types'
import { ExistingProfiles, LastUsedProfile } from '@/utils/constant'

import type { PayloadAction } from '@reduxjs/toolkit'

export interface HistoryState {
  history: Profile[] | undefined
}

const initialState: HistoryState = {
  history: undefined,
}

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    deleteHistory: (
      state,
      action: PayloadAction<{
        id: string
      }>,
    ) => {
      if (!state.history) return

      const { id } = action.payload
      const history = state.history.filter((profile) => profile.id !== id)

      store.set(ExistingProfiles, history)

      state.history = history
    },
    deleteAllHistory: (state) => {
      store.remove(LastUsedProfile)
      store.remove(ExistingProfiles)

      state.history = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadHistoryFromLocalStorage.fulfilled, (state, action) => {
      state.history = action.payload
    })

    builder.addCase(addHistory.fulfilled, (state, action) => {
      if (!state.history) {
        state.history = [action.payload]
      } else {
        state.history = [...state.history, action.payload]
      }
    })
  },
})
const historyActions = {
  ...historySlice.actions,
  addHistory,
  loadHistoryFromLocalStorage,
} as const

export { historySlice, historyActions }
