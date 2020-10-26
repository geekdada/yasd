/** @jsx jsx */
import { jsx } from '@emotion/core'
import css from '@emotion/css/macro'
import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import tw from 'twin.macro'
import {
  LoadingButton,
  Modal,
  ModalHeader,
  ModalWrapper,
} from '@sumup/circuit-ui'
import { toast } from 'react-toastify'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

import PageTitle from '../../../components/PageTitle'
import { EvaluateResult } from '../../../types'
import fetcher from '../../../utils/fetcher'

const Page: React.FC = () => {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>()
  const timeout = 5

  const evaluate = () => {
    if (isLoading) return

    if (!code) {
      toast.error('没有输入脚本内容')
      return
    }

    setIsLoading(true)

    fetcher<EvaluateResult>({
      url: '/scripting/evaluate',
      method: 'POST',
      data: {
        script_text: code,
        mock_type: 'cron',
        timeout,
      },
      timeout: timeout * 1000 + 500,
    })
      .then((res) => {
        console.log(res)

        if (res.exception) {
          toast.error(res.exception)
        } else {
          setResult(res.output)
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsLoading(false)
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
        <PageTitle title="调试脚本" />

        <div tw="h-full flex flex-col overflow-hidden">
          <div tw="h-full overflow-auto">
            <CodeMirror
              css={[
                tw`h-full text-sm`,
                css`
                  & > .CodeMirror {
                    height: 100%;
                    font-family: Menlo, Monaco, Consolas, 'Liberation Mono',
                      'Courier New', monospace;
                  }
                `,
              ]}
              value={code}
              options={{
                mode: 'javascript',
                theme: 'material',
                lineNumbers: true,
                tabSize: 2,
                indentWithTabs: false,
                lineWrapping: true,
              }}
              onBeforeChange={(editor, data, value) => {
                setCode(value)
              }}
            />
          </div>
          <div tw="border-t border-solid border-gray-200 py-2 px-3">
            <LoadingButton
              onClick={evaluate}
              variant="primary"
              isLoading={isLoading}
              loadingLabel={'运行中'}>
              运行
            </LoadingButton>
          </div>
        </div>

        <Modal
          isOpen={!!result}
          onClose={() => {
            setResult('')
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
                  {result}
                </pre>
              </div>
            </ModalWrapper>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default Page
