import { configureStore } from '@reduxjs/toolkit'

import { historySlice } from './slices/history'
import { profileSlice } from './slices/profile'
import { trafficSlice } from './slices/traffic'

export const store = configureStore({
  reducer: {
    history: historySlice.reducer,
    profile: profileSlice.reducer,
    traffic: trafficSlice.reducer,
  },
})
