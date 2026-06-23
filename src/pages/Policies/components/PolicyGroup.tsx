import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2Icon, ZapIcon } from 'lucide-react'
import { AutoSizer, List, ListRowRenderer } from 'react-virtualized'
import useIsInViewport from 'use-is-in-viewport'

import { StatusChip } from '@/components/StatusChip'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
  columnCount: number
  policyGroupName: string
  policyGroup: Policy[]
  policyPerformanceResults?: PolicyBenchmarkResults
}

type LocalLatency = {
  latency: number
  error?: string | null
}

const VIRTUALIZED_POLICY_THRESHOLD = 80
const POLICY_CARD_GAP = 16
const POLICY_CARD_ROW_HEIGHT = 128

const latencyResultStyle = (latency: number) => {
  if (latency < 0) {
    return 'error'
  } else if (latency < 200) {
    return 'info'
  } else {
    return 'warn'
  }
}

interface PolicyCardProps {
  isSelected: boolean
  latency?: LocalLatency
  policy: Policy
  onSelect: (name: string) => void
}

const PolicyCard = React.memo<PolicyCardProps>(
  ({ isSelected, latency, policy, onSelect }) => {
    const typeDescription = policy.typeDescription.toUpperCase()

    return (
      <div
        className={cn(
          'flex h-full flex-col bg-muted rounded-xl border px-3 py-3 md:px-4 md:py-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-black/90 transition-colors ease-in-out duration-200 justify-between gap-2 md:gap-3 ring-1 ring-black/[0.03] dark:ring-white/[0.04]',
          isSelected &&
            'bg-blue-500 text-white hover:bg-blue-500 dark:hover:bg-blue-500',
        )}
        data-policy-line-hash={policy.lineHash}
        onClick={() => onSelect(policy.name)}
      >
        <div className="min-h-0">
          <div className="text-xs mb-1 truncate">{typeDescription}</div>

          <div className="text-xs sm:text-sm font-bold leading-snug whitespace-break-spaces break-all line-clamp-3">
            {policy.name}
          </div>
        </div>

        <div className="flex min-h-6">
          {latency && latency.latency > 0 && (
            <StatusChip
              className="truncate"
              size="sm"
              variant={latencyResultStyle(latency.latency)}
              text={latency.latency + 'ms'}
            />
          )}
          {!typeDescription.includes('REJECT') && latency?.latency === -1 && (
            <StatusChip
              className="truncate"
              size="sm"
              variant="error"
              text={latency.error || 'Error'}
            />
          )}
        </div>
      </div>
    )
  },
)

PolicyCard.displayName = 'PolicyCard'

const PolicyGroup: React.FC<PolicyGroupProps> = ({
  columnCount,
  policyGroupName,
  policyGroup,
  policyPerformanceResults,
}) => {
  const { t } = useTranslation()
  const [isInViewport, targetRef] = useIsInViewport({ threshold: 10 })
  const [selection, setSelection] = useState<string>()
  const [localLatencies, setLocalLatencies] = useState<{
    [name: string]: LocalLatency
  }>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isTesting, setIsTesting] = useState<boolean>(false)

  const refreshSelection = useCallback(() => {
    return fetcher<{ policy: string }>({
      url: '/policy_groups/select?group_name=' + policyGroupName,
    }).then((res) => res.policy)
  }, [policyGroupName])

  const performanceLatencies = useMemo(() => {
    if (!policyPerformanceResults) {
      return {}
    }

    const latencies: {
      [name: string]: LocalLatency
    } = {}

    policyGroup.forEach((policy) => {
      if (!policy.lineHash) return

      const result = policyPerformanceResults[policy.lineHash]
      if (!result) return

      latencies[policy.name] = {
        latency:
          result.lastTestScoreInMS === 0 && result.lastTestErrorMessage !== null
            ? -1
            : Number(result.lastTestScoreInMS.toFixed(0)),
        error: result.lastTestErrorMessage,
      }
    })

    return latencies
  }, [policyGroup, policyPerformanceResults])

  const latencies = policyPerformanceResults
    ? performanceLatencies
    : localLatencies

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
            [name: string]: LocalLatency
          } = {}

          if (policyPerformanceResults) {
            return Promise.all([
              refreshSelection().then((policy) => {
                setSelection(policy)
              }),
              mutatePolicyPerformanceResults(),
            ])
          }

          if ('winner' in res) {
            const testResult = (res as UrlTestPolicyTestResult).results[0].data

            Object.keys(testResult).forEach((key) => {
              const result = testResult[key]

              if (!latencies[key]) {
                latencies[key] = {
                  latency: 0,
                }
              }

              latencies[key].latency = result.receive
                ? Number(result.receive.toFixed(0))
                : -1
            })

            setSelection((res as UrlTestPolicyTestResult).winner)
          } else {
            const testResult = res as SelectPolicyTestResult

            Object.keys(testResult).forEach((key) => {
              const result = testResult[key]

              if (!latencies[key]) {
                latencies[key] = {
                  latency: 0,
                }
              }

              latencies[key].latency = result.receive
                ? Number(result.receive.toFixed(0))
                : -1
            })
          }

          setLocalLatencies(latencies)
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

  const renderPolicyCard = useCallback(
    (policy: Policy) => (
      <PolicyCard
        key={policy.name}
        policy={policy}
        isSelected={selection === policy.name}
        latency={latencies[policy.name]}
        onSelect={selectPolicy}
      />
    ),
    [latencies, selectPolicy, selection],
  )

  const renderVirtualizedPolicyList = useCallback(
    (width: number, height: number) => {
      const columnWidth =
        (width - POLICY_CARD_GAP * (columnCount - 1)) / columnCount
      const rowCount = Math.ceil(policyGroup.length / columnCount)

      const rowRenderer: ListRowRenderer = ({ index, key, style }) => {
        const startIndex = index * columnCount
        const rowPolicies = policyGroup.slice(
          startIndex,
          startIndex + columnCount,
        )

        return (
          <div
            key={key}
            style={{
              ...style,
              display: 'flex',
              gap: POLICY_CARD_GAP,
              paddingBottom: POLICY_CARD_GAP,
            }}
          >
            {rowPolicies.map((policy) => (
              <div
                key={policy.name}
                style={{ width: columnWidth, height: POLICY_CARD_ROW_HEIGHT }}
              >
                {renderPolicyCard(policy)}
              </div>
            ))}
          </div>
        )
      }

      return (
        <List
          width={width}
          height={height}
          rowCount={rowCount}
          rowHeight={POLICY_CARD_ROW_HEIGHT + POLICY_CARD_GAP}
          rowRenderer={rowRenderer}
          overscanRowCount={3}
          style={{ outline: 'none' }}
        />
      )
    },
    [columnCount, policyGroup, renderPolicyCard],
  )

  useEffect(() => {
    let isMounted = true

    if (isInViewport && !selection) {
      void refreshSelection().then((policy) => {
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
    <div className="px-3 sm:px-4 grid gap-4 select-none">
      <CardHeader className="p-0">
        <div className="flex flex-row justify-between items-center">
          <div className="scroll-m-20 text-md sm:text-xl font-bold">
            {policyGroupName}
          </div>
          <Button
            size="icon"
            variant="outline"
            title={t('policies.test_policy')}
            onClick={() => testPolicy(policyGroupName)}
          >
            {isTesting ? <Loader2Icon className="animate-spin" /> : <ZapIcon />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {policyGroup.length > VIRTUALIZED_POLICY_THRESHOLD ? (
          <div className="h-[55vh] min-h-80 max-h-[640px]">
            <AutoSizer>
              {({ width, height }) =>
                renderVirtualizedPolicyList(width, height)
              }
            </AutoSizer>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {policyGroup.map(renderPolicyCard)}
          </div>
        )}
      </CardContent>
    </div>
  )

  return (
    <div ref={targetRef}>
      <Card className="relative overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-200/90">
            <Loader2Icon className="text-neutral-600 h-8 w-8 animate-spin" />
          </div>
        ) : null}

        {cardInner}
      </Card>
    </div>
  )
}

export default PolicyGroup
