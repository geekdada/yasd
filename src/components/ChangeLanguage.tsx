/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Select } from '@sumup/circuit-ui'
import { ChangeEventHandler, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'twin.macro'
import css from '@emotion/css/macro'

const ChangeLanguage = (): JSX.Element => {
  const { t, i18n } = useTranslation()
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
      i18n.changeLanguage(e.target.value).finally(() => setIsLoading(false))
    },
    [i18n],
  )

  return (
    <div tw="flex justify-center w-full">
      <Select
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
