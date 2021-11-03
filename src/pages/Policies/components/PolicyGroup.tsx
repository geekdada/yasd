/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import { Card, Heading, Spinner, IconButton } from '@sumup/circuit-ui'
import { Zap } from '@sumup/icons'
import css from '@emotion/css/macro'
import { useTranslation } from 'react-i18next'
import tw from 'twin.macro'
import React, { useCallback, useEffect, useState } from 'react'
import useIsInViewport from 'use-is-in-viewport'

import {
  Policy,
  SelectPolicyTestResult,
  UrlTestPolicyTestResult,
  PolicyBenchmarkResults,
} from '../../../types'
import fetcher from '../../../utils/fetcher'
import { mutatePolicyPerformanceResults } from '../usePolicyPerformance'

interface PolicyGroupProps {
  policyGroupName: string
  policyGroup: Policy[]
  policyPerformanceResults?: PolicyBenchmarkResults
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
  policyPerformanceResults,
}) => {
  const { t } = useTranslation()
  const [isInViewport, targetRef] = useIsInViewport({ threshold: 10 })
  const [selection, setSelection] = useState<string>()
  const [latencies, setLatencies] = useState<{
    [name: string]: number
  }>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isTesting, setIsTesting] = useState<boolean>(false)

  const selectPolicy = (name: string) => {
    if (isLoading) return

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
    if (isTesting) return

    setIsTesting(true)

    fetcher<SelectPolicyTestResult | UrlTestPolicyTestResult>({
      url: '/policy_groups/test',
      method: 'POST',
      timeout: 30000,
      data: {
        group_name: policyGroupName,
      },
    })
      .then((res) => {
        const latencies: {
          [name: string]: number
        } = {}

        if (policyPerformanceResults) {
          return Promise.all([
            refreshSelection().then((policy) => {
              setSelection(policy)
            }),
            mutatePolicyPerformanceResults(),
          ])
        }

        if (res.winner) {
          const testResult = (res as UrlTestPolicyTestResult).results[0].data

          Object.keys(testResult).forEach((key) => {
            const result = testResult[key]

            latencies[key] = result.receive
              ? Number(result.receive.toFixed(0))
              : -1
          })

          setSelection((res as UrlTestPolicyTestResult).winner)
        } else {
          const testResult = res as SelectPolicyTestResult
          Object.keys(testResult).forEach((key) => {
            const result = testResult[key]

            latencies[key] = result.receive
              ? Number(result.receive.toFixed(0))
              : -1
          })
        }

        setLatencies(latencies)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsTesting(false)
      })
  }

  const refreshSelection = useCallback(() => {
    return fetcher<{ policy: string }>({
      url: '/policy_groups/select?group_name=' + policyGroupName,
    }).then((res) => res.policy)
  }, [policyGroupName])

  useEffect(() => {
    if (!policyPerformanceResults) {
      return
    }

    const latencies: {
      [name: string]: number
    } = {}

    policyGroup.forEach((policy) => {
      Object.keys(policyPerformanceResults).forEach((key) => {
        if (policy.lineHash === key) {
          latencies[policy.name] =
            policyPerformanceResults[key].lastTestScoreInMS === 0
              ? -1
              : Number(
                  policyPerformanceResults[key].lastTestScoreInMS.toFixed(0),
                )
        }
      })
    })

    setLatencies(latencies)
  }, [policyGroup, policyPerformanceResults])

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
    <div ref={targetRef}>
      <Card tw="relative overflow-hidden px-3 md:px-4">
        {isLoading && (
          <LoadingOverlay>
            <Spinner />
          </LoadingOverlay>
        )}

        <Heading
          size="kilo"
          tw="flex flex-row justify-between items-center mb-3 md:mb-4"
        >
          <div>{policyGroupName}</div>
          <IconButton
            size="kilo"
            label={t('policies.test_policy')}
            onClick={() => testPolicy(policyGroupName)}
          >
            {isTesting ? (
              <Spinner tw="text-gray-700 w-5 h-5" />
            ) : (
              <Zap tw="text-gray-700 w-5 h-5" />
            )}
          </IconButton>
        </Heading>

        <div tw="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {policyGroup.map((policy) => {
            return (
              <div
                css={[
                  tw`bg-gray-200 rounded-md px-3 py-3 md:px-4 md:py-3 cursor-pointer hover:bg-gray-300 transition-colors ease-in-out duration-200`,
                  selection === policy.name
                    ? tw`bg-blue-600 text-white hover:bg-blue-600`
                    : '',
                ]}
                key={policy.name}
                onClick={() => selectPolicy(policy.name)}
              >
                <div tw="text-sm md:text-base leading-snug">{policy.name}</div>
                <div
                  css={[
                    tw`flex flex-row justify-between mt-2 text-xs text-gray-700`,
                    selection === policy.name ? tw`text-white` : '',
                  ]}
                >
                  <div tw="text-center bg-gray-400 text-gray-700 px-1 rounded">
                    {policy.typeDescription.toUpperCase()}
                  </div>
                  {latencies[policy.name] >= 0 && (
                    <LatencyResult
                      css={[
                        tw`rounded px-1`,
                        latencyResultStyle(latencies[policy.name]),
                      ]}
                    >
                      {latencies[policy.name] + 'ms'}
                    </LatencyResult>
                  )}
                  {latencies[policy.name] === -1 && (
                    <LatencyResult
                      css={[
                        tw`rounded px-1`,
                        latencyResultStyle(latencies[policy.name]),
                      ]}
                    >
                      Failed
                    </LatencyResult>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default PolicyGroup
