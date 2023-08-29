import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
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
    async (newVal: string) => {
      setIsLoading(true)
      store.set(LastUsedLanguage, newVal)

      try {
        await i18n.changeLanguage(newVal)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    },
    [i18n],
  )

  useEffect(() => {
    switch (i18n.language) {
      case 'zh':
        setZH().catch(console.error)
        break
      case 'en':
        setEN().catch(console.error)
        break
    }
  }, [i18n.language])

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

async function setZH() {
  const mod = await import('dayjs/locale/zh')
  dayjs.locale(mod.default)
}

async function setEN() {
  const mod = await import('dayjs/locale/en')
  dayjs.locale(mod.default)
}

export default ChangeLanguage
