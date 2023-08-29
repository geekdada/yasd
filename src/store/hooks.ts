import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import { selectHistory } from '@/store/slices/history'
import {
  selectPLatform,
  selectPlatformBuild,
  selectPlatformVersion,
  selectProfile,
} from '@/store/slices/profile'
import {
  selectConnectors,
  selectInterfaces,
  selectStartTime,
  selectHistory as selectTrafficHistory,
} from '@/store/slices/traffic'

import type { RootState, AppDispatch } from './types'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

/**
 * History slice hooks
 */
export const useHistory = () => useAppSelector(selectHistory)

/**
 * Profile slice hooks
 */
export const useProfile = () => useAppSelector(selectProfile)
export const usePlatform = () => useAppSelector(selectPLatform)
export const usePlatformVersion = () => useAppSelector(selectPlatformVersion)
export const usePlatformBuild = () => useAppSelector(selectPlatformBuild)
export const useSurgeHost = () => {
  const profile = useProfile()

  if (!profile) return null

  const { tls, host, port } = profile

  return `${tls ? 'https:' : 'http:'}//${host}:${port}`
}

/**
 * Traffic slice hooks
 */
export const useInterfaces = () => useAppSelector(selectInterfaces)
export const useConnectors = () => useAppSelector(selectConnectors)
export const useTrafficHistory = () => useAppSelector(selectTrafficHistory)
export const useStartTime = () => useAppSelector(selectStartTime)
