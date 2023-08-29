import { RootState } from '@/store'

export const selectProfile = (state: RootState) => state.profile.profile

export const selectPLatform = (state: RootState) =>
  state.profile.profile?.platform

export const selectPlatformVersion = (state: RootState) =>
  state.profile.profile?.platformVersion

export const selectPlatformBuild = (state: RootState) =>
  state.profile.profile?.platformBuild
