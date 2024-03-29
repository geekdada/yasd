import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import store from 'store2'

import { useAppDispatch, useHistory } from '@/store'
import { historyActions } from '@/store/slices/history'
import { isRunInSurge } from '@/utils'
import { LastUsedLanguage } from '@/utils/constant'

export const Bootstrap: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const history = useHistory()
  const location = useLocation()

  const [isTranslationLoaded, setIsTranslationLoaded] = useState(false)

  useEffect(() => {
    const loadLastUsedProfile = location.pathname !== '/' || isRunInSurge()

    dispatch(
      historyActions.loadHistoryFromLocalStorage({
        loadLastUsedProfile,
      }),
    )
  }, [dispatch, location.pathname])

  useEffect(() => {
    const language: string | null = store.get(LastUsedLanguage)

    if (language && language !== i18n.language) {
      i18n.changeLanguage(language).then(() => {
        setIsTranslationLoaded(true)
      })
    } else {
      setIsTranslationLoaded(true)
    }
  }, [i18n])

  if (history === undefined || !isTranslationLoaded) {
    return null
  }

  return <>{children}</>
}
