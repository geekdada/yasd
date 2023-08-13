import React, { createRef, RefObject, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollTo } from 'react-scroll-to'
import { css } from '@emotion/react'
import useSWR from 'swr'

import BackButton from '@/components/BackButton'
import PageContainer from '@/components/PageContainer'
import { TypographyH2 } from '@/components/ui/typography'
import { useProfile } from '@/store'
import { Policies, PolicyGroups } from '@/types'
import fetcher from '@/utils/fetcher'

import PolicyGroup from './components/PolicyGroup'
import { PolicyNameItem } from './components/PolicyNameItem'
import { usePolicyPerformance } from './usePolicyPerformance'

const Page: React.FC = () => {
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
  const refs = policyGroupNames.map(() => {
    return createRef<HTMLDivElement>()
  })
  const headerRef = useRef<HTMLDivElement>(null)
  const { data: policyPerformanceResults } = usePolicyPerformance()

  const getRefTop = (ref: RefObject<HTMLDivElement>): number => {
    const ele = ref.current
    const headerEle = headerRef.current

    if (ele && headerEle) {
      return ele.offsetTop - headerEle.clientHeight - 30
    } else {
      return 0
    }
  }

  return (
    <PageContainer>
      <div
        className="sticky top-0 left-0 right-0 shadow bg-white dark:bg-muted z-10 pt-5 mb-5"
        ref={headerRef}
      >
        <div
          css={css`
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
          `}
        >
          <TypographyH2 className="px-4 my-0 py-0 border-none">
            <div className="flex items-center">
              <BackButton title={t('home.policies')} />
            </div>
          </TypographyH2>
        </div>

        <div
          className="flex justify-start overflow-x-scroll py-4 space-x-3"
          css={css`
            padding-left: calc(env(safe-area-inset-left) + 1rem);
            padding-right: calc(env(safe-area-inset-right) + 1rem);
          `}
        >
          <ScrollTo>
            {({ scroll }) => (
              <>
                {policies &&
                  policies['policy-groups'].map((policy, index) => (
                    <PolicyNameItem
                      key={policy}
                      onClick={() =>
                        scroll({ y: getRefTop(refs[index]), smooth: true })
                      }
                    >
                      {policy}
                    </PolicyNameItem>
                  ))}
              </>
            )}
          </ScrollTo>
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
                />
              </div>
            )
          })}
      </div>
    </PageContainer>
  )
}

export default Page
