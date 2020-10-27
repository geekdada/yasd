/** @jsx jsx */
import { jsx } from '@emotion/core'
import css from '@emotion/css/macro'
import React, { MouseEvent, useMemo, useState } from 'react'
import styled from '@emotion/styled/macro'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import tw from 'twin.macro'
import useSWR from 'swr'
import { uniqBy } from 'lodash-es'
import {
  Button,
  LoadingButton,
  Modal,
  ModalHeader,
  ModalWrapper,
} from '@sumup/circuit-ui'

import PageTitle from '../../components/PageTitle'
import { EvaluateResult, Scriptings } from '../../types'
import fetcher from '../../utils/fetcher'

const Page: React.FC = () => {
  const history = useHistory()
  const { data: scripting, error: scriptingError } = useSWR<Scriptings>(
    '/scripting',
    fetcher,
  )
  const [evaluateResult, setEvaluateResult] = useState<string>()
  const [isLoading, setIsLoading] = useState<number>()

  const filteredList = useMemo(() => {
    if (!scripting) return []

    return uniqBy(scripting.scripts, (item) => `${item.name}-${item.type}`)
  }, [scripting])

  const openUrl = (path: string) => {
    window.open(path)
  }

  const evaluate = (scriptName: string, index: number) => {
    if (typeof isLoading === 'number') return

    setIsLoading(index)

    fetcher<EvaluateResult>({
      url: '/scripting/cron/evaluate',
      method: 'POST',
      data: {
        script_name: scriptName,
      },
      timeout: 60000,
    })
      .then((res) => {
        if (res.exception) {
          toast.error(res.exception)
        } else {
          setEvaluateResult(res.output)
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsLoading(undefined)
      })
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
                filteredList.map((script, index) => {
                  return (
                    <div
                      key={`${script.name}-${script.type}`}
                      tw="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100"
                      onClick={() => openUrl(script.path)}>
                      <div tw="flex-1">
                        <div tw="truncate leading-normal text-gray-700">
                          {script.name}
                        </div>
                        <div tw="text-sm text-gray-500">{script.type}</div>
                      </div>
                      <div tw="ml-2 flex items-center">
                        {script.type === 'cron' && (
                          <LoadingButton
                            onClick={(e: MouseEvent) => {
                              e.stopPropagation()
                              evaluate(script.name, index)
                            }}
                            size="kilo"
                            isLoading={isLoading === index}
                            loadingLabel={'运行中'}
                            tw="px-3 py-3 text-sm leading-tight">
                            运行
                          </LoadingButton>
                        )}
                      </div>
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

      <Modal
        isOpen={!!evaluateResult}
        onClose={() => {
          setEvaluateResult(undefined)
        }}>
        {({ onClose }) => (
          <ModalWrapper>
            <ModalHeader title="结果" onClose={onClose} />
            <div>
              <pre
                tw="font-mono text-xs text-gray-600 bg-gray-200 leading-tight p-3 whitespace-pre-wrap break-words"
                css={css`
                  min-height: 7rem;
                `}>
                {evaluateResult}
              </pre>
            </div>
          </ModalWrapper>
        )}
      </Modal>
    </div>
  )
}

export default Page
