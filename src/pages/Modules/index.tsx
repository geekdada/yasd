/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { useCallback, useState } from 'react'
import { RadioButton } from '@sumup/circuit-ui'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import tw from 'twin.macro'
import useSWR, { mutate } from 'swr'
import { toast } from 'react-toastify'

import PageContainer from '../../components/PageContainer'
import PageTitle from '../../components/PageTitle'
import { Modules } from '../../types'
import fetcher from '../../utils/fetcher'

const Page: React.FC = () => {
  const { t } = useTranslation()
  const { data: modules, error: modulesError } = useSWR<Modules>(
    '/modules',
    fetcher,
  )
  const [isLoading, setIsLoading] = useState(false)

  const isChecked = (name: string): boolean => {
    return modules?.enabled.includes(name) === true
  }

  const toggle = useCallback(
    (name: string, newVal: boolean) => {
      setIsLoading(true)

      fetcher({
        url: '/modules',
        method: 'POST',
        data: {
          [name]: newVal,
        },
      })
        .then(() => {
          toast.success(t('common.success_interaction'))
          return mutate('/modules')
        })
        .catch((err) => {
          toast.success(t('common.failed_interaction'))
          console.error(err)
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [setIsLoading, t],
  )

  return (
    <PageContainer>
      <PageTitle title={t('home.modules')} />

      <div tw="divide-y divide-gray-200">
        {modules &&
          modules.available.map((mod) => {
            return (
              <div key={mod} tw="flex items-center justify-between p-3">
                <div tw="truncate leading-normal text-gray-700">{mod}</div>
                <div tw="flex items-center">
                  <RadioButton
                    disabled={isLoading}
                    checked={isChecked(mod)}
                    onChange={() => toggle(mod, !isChecked(mod))}
                  />
                </div>
              </div>
            )
          })}
      </div>
    </PageContainer>
  )
}

export default Page
