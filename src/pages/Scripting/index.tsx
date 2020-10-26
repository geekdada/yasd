/** @jsx jsx */
import { jsx } from '@emotion/core'
import css from '@emotion/css/macro'
import React, { useMemo } from 'react'
import styled from '@emotion/styled/macro'
import { useHistory } from 'react-router-dom'
import tw from 'twin.macro'
import useSWR from 'swr'
import { uniqBy } from 'lodash-es'
import { Button } from '@sumup/circuit-ui'

import PageTitle from '../../components/PageTitle'
import { Scriptings } from '../../types'
import fetcher from '../../utils/fetcher'

const Page: React.FC = () => {
  const history = useHistory()
  const { data: scripting, error: scriptingError } = useSWR<Scriptings>(
    '/scripting',
    fetcher,
  )

  const filteredList = useMemo(() => {
    if (!scripting) return []

    return uniqBy(scripting.scripts, (item) => `${item.name}-${item.type}`)
  }, [scripting])

  const openUrl = (path: string) => {
    window.open(path)
  }

  return (
    <div
      tw="relative"
      css={css`
        height: 100vh;
        width: 100vw;
      `}>
      <div tw="w-full h-full flex flex-col">
        <PageTitle title="脚本" />

        <div tw="h-full flex flex-col">
          <div tw="flex-1 overflow-auto">
            <div tw="divide-y divide-gray-200">
              {scripting &&
                filteredList.map((script) => {
                  return (
                    <div
                      key={`${script.name}-${script.type}`}
                      tw="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100"
                      onClick={() => openUrl(script.path)}>
                      <div tw="flex-1 truncate leading-normal text-gray-700">
                        {script.name}
                      </div>
                      <div tw="text-sm ml-2 text-gray-500">{script.type}</div>
                    </div>
                  )
                })}
            </div>
          </div>
          <div tw="border-t border-solid border-gray-200 py-2">
            <Button
              variant="tertiary"
              onClick={() => history.push('/scripting/evaluate')}>
              调试脚本
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
