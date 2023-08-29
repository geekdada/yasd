import { RootState } from '@/store'

export const selectInterfaces = (state: RootState) => state.traffic.interface

export const selectConnectors = (state: RootState) => state.traffic.connector

export const selectHistory = (state: RootState) => state.traffic.history

export const selectStartTime = (state: RootState) => state.traffic.startTime
