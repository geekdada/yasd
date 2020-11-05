/** @jsx jsx */
import { jsx } from '@emotion/core'
import css from '@emotion/css/macro'
import loadable from '@loadable/component'
import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { IControlledCodeMirror } from 'react-codemirror2'
import tw from 'twin.macro'
import {
  Input,
  LoadingButton,
  Modal,
  ModalHeader,
  ModalWrapper,
} from '@sumup/circuit-ui'
import { toast } from 'react-toastify'

import PageTitle from '../../../components/PageTitle'
import { EvaluateResult } from '../../../types'
import fetcher from '../../../utils/fetcher'

const CodeMirror = loadable<IControlledCodeMirror>(
  async () => {
    const mod = await import('react-codemirror2').then((mod) => mod.Controlled)

    await Promise.all([
      // @ts-ignore
      import('codemirror/lib/codemirror.css'),
      // @ts-ignore
      import('codemirror/theme/material.css'),
      // @ts-ignore
      import('codemirror/mode/javascript/javascript'),
    ])

    return mod
  },
  {
    fallback: (
      <div tw="h-full flex items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    ),
  },
)

const Page: React.FC = () => {
  const [code, setCode] = useState<string>('// Only supports Cron script\n')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>()
  const [timeout, setTimeoutValue] = useState<number>(5)

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
    <div tw="fixed top-0 right-0 bottom-0 left-0 h-full overflow-hidden">
      <div tw="w-full h-full flex flex-col">
        <PageTitle title="调试脚本" />

        <div tw="h-full flex flex-col overflow-hidden">
          <div tw="h-full overflow-auto">
            <CodeMirror
              css={[
                tw`h-full text-xs`,
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
          <div
            css={[
              tw`flex items-center border-t border-solid border-gray-200 py-3 px-3`,
              css`
                margin-bottom: env(safe-area-inset-bottom);
              `,
            ]}>
            <LoadingButton
              onClick={evaluate}
              variant="primary"
              size="kilo"
              isLoading={isLoading}
              loadingLabel={'运行中'}>
              运行
            </LoadingButton>

            <div
              css={[
                tw`ml-4`,
                css`
                  padding-bottom: 1px;

                  & input {
                    border-radius: 4px;
                    ${tw`px-2 py-1 text-sm leading-none`}
                  }
                `,
              ]}>
              <Input
                type="number"
                required
                noMargin
                label="Timeout"
                value={timeout}
                onChange={({ target }) =>
                  setTimeoutValue(Number((target as HTMLInputElement).value))
                }
              />
            </div>
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
