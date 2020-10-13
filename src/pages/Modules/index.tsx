/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react'
import { RadioButton } from '@sumup/circuit-ui'
import styled from '@emotion/styled/macro'
import tw from 'twin.macro'
import useSWR, { mutate } from 'swr'
import PageTitle from '../../components/PageTitle'

import { Modules } from '../../types'
import fetcher from '../../utils/fetcher'

const Page: React.FC = () => {
  const { data: modules, error: modulesError } = useSWR<Modules>(
    '/modules',
    fetcher,
  )

  const isChecked = (name: string): boolean => {
    return modules?.enabled.includes(name) === true
  }

  const toggle = (name: string, newVal: boolean) => {
    fetcher({
      url: '/modules',
      method: 'POST',
      data: {
        [name]: newVal,
      },
    })
      .then(() => {
        return mutate('/modules')
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <div tw="relative pb-5">
      <PageTitle title="Modules" />

      <div tw="divide-y divide-gray-200">
        {modules &&
          modules.available.map((mod) => {
            return (
              <div key={mod} tw="flex items-center justify-between p-3">
                <div tw="truncate leading-normal text-gray-700">{mod}</div>
                <div>
                  <RadioButton
                    checked={isChecked(mod)}
                    onChange={() => toggle(mod, !isChecked(mod))}
                  />
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Page
