import React, { createRef, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'
import useSWR from 'swr'
import { useMediaQuery } from 'usehooks-ts'

import BackButton from '@/components/BackButton'
import { TypographyH3 } from '@/components/ui/typography'
import { BottomSafeArea } from '@/components/VerticalSafeArea'
import { useProfile } from '@/store'
import { Policies, PolicyGroups } from '@/types'
import fetcher from '@/utils/fetcher'

import PolicyGroup from './components/PolicyGroup'
import { PolicyNameItem } from './components/PolicyNameItem'
import { usePolicyPerformance } from './usePolicyPerformance'

export const Component: React.FC = () => {
  const { t } = useTranslation()
  const profile = useProfile()
  const { data: policies } = useSWR<Policies>(
    profile !== undefined ? '/policies' : undefined,
    fetcher,
  )
  const { data: policyGroups } = useSWR<PolicyGroups>(
    profile !== undefined ? '/policy_groups' : undefined,
    fetcher,
  )
  const policyGroupNames = (policies && policies['policy-groups']) || []
  const refs = useMemo(
    () => policyGroupNames.map(() => createRef<HTMLDivElement>()),
    [policyGroupNames],
  )
  const headerRef = useRef<HTMLDivElement>(null)
  const { data: policyPerformanceResults } = usePolicyPerformance()
  const isMediumViewport = useMediaQuery('(min-width: 768px)')
  const isLargeViewport = useMediaQuery('(min-width: 1024px)')
  const policyColumnCount = isLargeViewport ? 4 : isMediumViewport ? 3 : 2

  const scrollToRef = (index: number) => {
    const target = refs[index].current
    const header = headerRef.current
    if (!target || !header) return

    let scrollParent: Element | null = target.parentElement
    while (scrollParent) {
      const { overflowY } = getComputedStyle(scrollParent)
      if (overflowY === 'auto' || overflowY === 'scroll') break
      scrollParent = scrollParent.parentElement
    }

    const container = scrollParent ?? document.documentElement
    const offset = target.offsetTop - header.clientHeight - 30
    container.scrollTo({ top: offset, behavior: 'smooth' })
  }

  return (
    <>
      <div
        className="sticky top-0 left-0 right-0 bg-white/90 dark:bg-muted/90 backdrop-blur-md z-10 pt-3 sm:pt-5 mb-5 border-b border-black/5 dark:border-white/10"
        ref={headerRef}
      >
        <div
          css={css`
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
          `}
        >
          <TypographyH3 className="px-4 my-0 py-0 border-none">
            <div className="flex items-center">
              <BackButton title={t('home.policies')} />
            </div>
          </TypographyH3>
        </div>

        <div
          className="flex flex-wrap gap-2 pb-3 mt-4 sm:pb-4 sm:gap-2.5 max-h-32 sm:max-h-none overflow-y-auto"
          css={css`
            padding-left: calc(env(safe-area-inset-left) + 1rem);
            padding-right: calc(env(safe-area-inset-right) + 1rem);
          `}
        >
          {policies &&
            policies['policy-groups'].map((policy, index) => (
              <PolicyNameItem key={policy} onClick={() => scrollToRef(index)}>
                {policy}
              </PolicyNameItem>
            ))}
        </div>
      </div>

      <div
        className="space-y-4"
        css={css`
          padding-left: calc(env(safe-area-inset-left) + 1rem);
          padding-right: calc(env(safe-area-inset-right) + 1rem);
        `}
      >
        {policies &&
          policyGroups &&
          policies['policy-groups'].map((policy, index) => {
            return (
              <div key={policy} ref={refs[index]}>
                <PolicyGroup
                  policyGroupName={policy}
                  policyGroup={policyGroups[policy]}
                  policyPerformanceResults={policyPerformanceResults}
                  columnCount={policyColumnCount}
                />
              </div>
            )
          })}
      </div>

      <BottomSafeArea />
    </>
  )
}

Component.displayName = 'PoliciesPage'

export { ErrorBoundary } from '@/components/ErrorBoundary'
