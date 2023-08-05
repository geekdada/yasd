import React from 'react'
import { useTranslation } from 'react-i18next'

const CodeMirrorLoading = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <div className="h-full flex items-center justify-center text-sm text-gray-500">
      {t('common.is_loading')}...
    </div>
  )
}

export default CodeMirrorLoading
