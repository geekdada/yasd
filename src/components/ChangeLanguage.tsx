/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Select } from '@sumup/circuit-ui'
import { ChangeEventHandler, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import store from 'store2'
import tw from 'twin.macro'
import css from '@emotion/css/macro'

import { LastUsedLanguage } from '../utils/constant'

const ChangeLanguage = (): JSX.Element => {
  const { i18n } = useTranslation()
  const options = [
    {
      value: 'en',
      label: 'English',
    },
    {
      value: 'zh',
      label: '中文',
    },
  ]
  const [isLoading, setIsLoading] = useState(false)

  const onChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      setIsLoading(true)
      store.set(LastUsedLanguage, e.target.value)
      i18n.changeLanguage(e.target.value).finally(() => setIsLoading(false))
    },
    [i18n],
  )

  return (
    <div tw="flex justify-center w-full">
      <Select
        label="change language"
        hideLabel
        noMargin
        value={i18n.language}
        options={options}
        onChange={onChange}
        disabled={isLoading}
      />
    </div>
  )
}

export default ChangeLanguage
