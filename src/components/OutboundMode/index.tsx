import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DataGroup, DataRow, DataRowMain } from '@/components/Data'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOutbound } from '@/data/outbound'
import fetcher from '@/utils/fetcher'

export default function OutboundMode() {
  const { t } = useTranslation()
  const { data, mutate } = useOutbound()
  const [pending, setPending] = useState(false)

  const changeMode = async (mode: string) => {
    if (pending || mode === data?.mode) return
    setPending(true)
    try {
      await fetcher({ url: '/outbound', method: 'POST', data: { mode } })
      await mutate()
    } catch (error) {
      console.error(error)
    } finally {
      setPending(false)
    }
  }

  return (
    <DataGroup>
      <DataRow>
        <DataRowMain>
          <div className="font-bold">{t('outbound.title')}</div>
          <Select
            value={data?.mode ?? ''}
            disabled={!data || pending}
            onValueChange={(mode) => void changeMode(mode)}
          >
            <SelectTrigger aria-label={t('outbound.title')} aria-busy={pending}>
              <SelectValue placeholder={t('common.is_loading')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {(['rule', 'proxy', 'direct'] as const).map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {t(`outbound.${mode}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </DataRowMain>
      </DataRow>
    </DataGroup>
  )
}
