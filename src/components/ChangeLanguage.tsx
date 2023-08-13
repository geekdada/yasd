import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import store from 'store2'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LastUsedLanguage } from '@/utils/constant'

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

  const onChange = useCallback(
    (newVal: string) => {
      setIsLoading(true)
      store.set(LastUsedLanguage, newVal)
      i18n.changeLanguage(newVal).finally(() => setIsLoading(false))
    },
    [i18n],
  )

  return (
    <Select
      value={i18n.language}
      onValueChange={(newVal) => {
        onChange(newVal)
      }}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default ChangeLanguage
