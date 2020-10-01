/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import { Card, Heading, Spinner } from '@sumup/circuit-ui'
import { Zap } from '@sumup/icons'
import css from '@emotion/css/macro'
import tw from 'twin.macro'
import React, { useCallback, useEffect, useState } from 'react'
import useIsInViewport from 'use-is-in-viewport'

import { Policy, PolicyTestResult } from '../../../types'
import fetcher from '../../../utils/fetcher'

interface PolicyGroupProps {
  policyGroupName: string
  policyGroup: Policy[]
}

const LoadingOverlay = styled.div`
  ${tw`absolute top-0 right-0 bottom-0 left-0 bg-gray-800 bg-opacity-25 flex items-center justify-center`}
`

const LatencyResult = styled.div`
  ${tw`text-white`}
`

const latencyResultStyle = (latency: number) => {
  if (latency < 0) {
    return tw`bg-red-500`
  } else if (latency < 200) {
    return tw`bg-green-500`
  } else {
    return tw`bg-orange-500`
  }
}

const PolicyGroup: React.FC<PolicyGroupProps> = ({
  policyGroupName,
  policyGroup,
}) => {
  const [isInViewport, targetRef] = useIsInViewport({ threshold: 50 })
  const [selection, setSelection] = useState<string>()
  const [latencies, setLatencies] = useState<{
    [name: string]: number
  }>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const selectPolicy = (name: string) => {
    setIsLoading(true)
    fetcher({
      url: '/policy_groups/select',
      method: 'POST',
      data: {
        group_name: policyGroupName,
        policy: name,
      },
    })
      .then(() => {
        return refreshSelection()
      })
      .then((policy) => {
        setSelection(policy)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const testPolicy = (policyGroupName: string) => {
    setIsLoading(true)
    fetcher<PolicyTestResult>({
      url: '/policy_groups/test',
      method: 'POST',
      data: {
        group_name: policyGroupName,
      },
    })
      .then((res) => {
        const latencies: {
          [name: string]: number
        } = {}

        Object.keys(res).forEach((key) => {
          const result = res[key]

          latencies[key] = result.receive ?? -1
        })

        setLatencies(latencies)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const refreshSelection = useCallback(() => {
    return fetcher<{ policy: string }>({
      url: '/policy_groups/select?group_name=' + policyGroupName,
    }).then((res) => res.policy)
  }, [policyGroupName])

  useEffect(() => {
    let isMounted = true

    if (isInViewport && !selection) {
      refreshSelection().then((policy) => {
        if (isMounted) {
          setSelection(policy)
        }
      })
    }

    return () => {
      isMounted = false
    }
  }, [refreshSelection, isInViewport, selection])

  return (
    <Card shadow="single" ref={targetRef} tw="relative overflow-hidden">
      {isLoading && (
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      )}

      <Heading size="kilo" tw="flex flex-row justify-between">
        <div>{policyGroupName}</div>
        <Zap
          tw="text-gray-700 cursor-pointer"
          onClick={() => testPolicy(policyGroupName)}
        />
      </Heading>

      <div tw="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {policyGroup.map((policy) => {
          return (
            <div
              css={[
                tw`bg-gray-200 rounded-md px-4 py-3 cursor-pointer`,
                selection === policy.name ? tw`bg-blue-600 text-white` : '',
              ]}
              key={policy.name}
              onClick={() => selectPolicy(policy.name)}>
              <div tw="text-base leading-snug">{policy.name}</div>
              <div
                css={[
                  tw`flex flex-row justify-between mt-2 text-xs text-gray-700`,
                  selection === policy.name ? tw`text-white` : '',
                ]}>
                <div tw="text-center bg-gray-400 text-gray-700 px-1 rounded">
                  {policy.typeDescription.toUpperCase()}
                </div>
                {latencies[policy.name] >= 0 && (
                  <LatencyResult
                    css={[
                      tw`rounded px-1`,
                      latencyResultStyle(latencies[policy.name]),
                    ]}>
                    {latencies[policy.name] + 'ms'}
                  </LatencyResult>
                )}
                {latencies[policy.name] === -1 && (
                  <LatencyResult
                    css={[
                      tw`rounded px-1`,
                      latencyResultStyle(latencies[policy.name]),
                    ]}>
                    Failed
                  </LatencyResult>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default PolicyGroup
