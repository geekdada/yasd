/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { useCallback, useMemo } from 'react'
import { Heading } from '@sumup/circuit-ui'
import styled from '@emotion/styled/macro'
import tw from 'twin.macro'
import useSWR, { mutate } from 'swr'
import { uniqBy } from 'lodash-es'

import { Scriptings } from '../../types'
import fetcher from '../../utils/fetcher'

const Page: React.FC = () => {
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
    <div tw="relative pb-5">
      <Heading
        size={'tera'}
        noMargin
        tw="sticky top-0 flex shadow bg-white z-10 px-3 py-3">
        Scripting
      </Heading>

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
  )
}

export default Page
