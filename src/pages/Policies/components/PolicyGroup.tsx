import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2Icon, ZapIcon } from 'lucide-react'
import tw from 'twin.macro'
import useIsInViewport from 'use-is-in-viewport'

import { StatusChip } from '@/components/StatusChip'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TypographyH3 } from '@/components/ui/typography'
import {
  Policy,
  SelectPolicyTestResult,
  UrlTestPolicyTestResult,
  PolicyBenchmarkResults,
} from '@/types'
import fetcher from '@/utils/fetcher'
import { cn } from '@/utils/shadcn'

import { mutatePolicyPerformanceResults } from '../usePolicyPerformance'

interface PolicyGroupProps {
  policyGroupName: string
  policyGroup: Policy[]
  policyPerformanceResults?: PolicyBenchmarkResults
}

const LoadingOverlay = tw.div`
  absolute top-0 right-0 bottom-0 left-0 bg-gray-800 bg-opacity-25 flex items-center justify-center
`

const latencyResultStyle = (latency: number) => {
  if (latency < 0) {
    return 'error'
  } else if (latency < 200) {
    return 'info'
  } else {
    return 'warn'
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

  const selectPolicy = useCallback(
    (name: string) => {
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
    },
    [isLoading, policyGroupName, refreshSelection],
  )

  const testPolicy = useCallback(
    (policyGroupName: string) => {
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
    },
    [isTesting, policyPerformanceResults, refreshSelection],
  )

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

  const cardInner = (
    <>
      <CardHeader className="flex flex-row justify-between items-center">
        <TypographyH3>{policyGroupName}</TypographyH3>
        <Button
          size="icon"
          variant="outline"
          title={t('policies.test_policy')}
          onClick={() => testPolicy(policyGroupName)}
        >
          {isTesting ? <Loader2Icon className="animate-spin" /> : <ZapIcon />}
        </Button>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {policyGroup.map((policy) => {
            const typeDescription = policy.typeDescription.toUpperCase()

            return (
              <div
                className={cn(
                  'bg-muted rounded-xl border shadow px-3 py-3 md:px-4 md:py-3 cursor-pointer hover:bg-neutral-100 transition-colors ease-in-out duration-200',
                  selection === policy.name &&
                    'bg-blue-500 text-white hover:bg-blue-500',
                )}
                key={policy.name}
                onClick={() => selectPolicy(policy.name)}
              >
                <div className="text-xs mb-1">{typeDescription}</div>

                <div className="text-sm font-bold md:text-base leading-snug">
                  {policy.name}
                </div>

                <div className="flex mt-2">
                  {latencies[policy.name] >= 0 && (
                    <StatusChip
                      size="sm"
                      variant={latencyResultStyle(latencies[policy.name])}
                      text={latencies[policy.name] + 'ms'}
                    />
                  )}
                  {!typeDescription.includes('REJECT') &&
                    latencies[policy.name] === -1 && (
                      <StatusChip size="sm" variant="error" text="Failed" />
                    )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </>
  )

  return (
    <div ref={targetRef}>
      <Card className="relative overflow-hidden">
        {isLoading ? (
          <LoadingOverlay>
            <Loader2Icon className="h-4 w-4 animate-spin" />
          </LoadingOverlay>
        ) : (
          cardInner
        )}
      </Card>
    </div>
  )
}

export default PolicyGroup
