import { RootState } from '@/store'

export const selectHistory = (state: RootState) => state.history.history
