import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import store from 'store2'

import { useAppDispatch, useHistory } from '@/store'
import { historyActions } from '@/store/slices/history'
import { LastUsedLanguage } from '@/utils/constant'

export const Bootstrap: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const history = useHistory()

  const [isTranslationLoaded, setIsTranslationLoaded] = useState(false)

  useEffect(() => {
    dispatch(historyActions.loadHistoryFromLocalStorage())
  }, [dispatch])

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

  if (!history || !isTranslationLoaded) {
    return null
  }

  return <>{children}</>
}
