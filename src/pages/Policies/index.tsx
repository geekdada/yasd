/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import { Heading } from '@sumup/circuit-ui'
import { useTranslation } from 'react-i18next'
import tw from 'twin.macro'
import React, { createRef, RefObject, useRef } from 'react'
import { ScrollTo } from 'react-scroll-to'
import useSWR from 'swr'

import BackButton from '../../components/BackButton'
import PageContainer from '../../components/PageContainer'
import { Policies, PolicyGroups } from '../../types'
import fetcher from '../../utils/fetcher'
import PolicyGroup from './components/PolicyGroup'
import { usePolicyPerformance } from './usePolicyPerformance'

const PolicyNameItem = styled.div`
  ${tw`flex-shrink-0 bg-gray-200 rounded-md px-3 py-2 mr-3 overflow-hidden cursor-pointer hover:bg-gray-300 transition-colors ease-in-out duration-200`}
`

const Page: React.FC = () => {
  const { t } = useTranslation()
  const { data: policies, error: policiesError } = useSWR<Policies>(
    '/policies',
    fetcher,
  )
  const { data: policyGroups, error: policyGroupsError } = useSWR<PolicyGroups>(
    '/policy_groups',
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
        tw="sticky top-0 left-0 right-0 shadow bg-white z-10 pt-5 mb-4"
        ref={headerRef}
      >
        <div
          css={css`
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
          `}
        >
          <Heading size={'tera'} noMargin tw="mb-2 px-4">
            <div tw="flex items-center">
              <BackButton />
              <div>{t('home.policies')}</div>
            </div>
          </Heading>
        </div>

        <div
          tw="flex justify-start flex-no-wrap overflow-auto pt-3 pb-5"
          css={css`
            padding-left: calc(env(safe-area-inset-left) + 1rem);
            padding-right: calc(env(safe-area-inset-right) + 1rem);
          `}
        >
          <ScrollTo>
            {({ scroll }) => (
              <React.Fragment>
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
              </React.Fragment>
            )}
          </ScrollTo>
        </div>
      </div>

      <div
        css={css`
          padding-left: calc(env(safe-area-inset-left) + 1rem);
          padding-right: calc(env(safe-area-inset-right) + 1rem);
        `}
      >
        {policies &&
          policyGroups &&
          policies['policy-groups'].map((policy, index) => {
            return (
              <div tw="mb-4" key={policy} ref={refs[index]}>
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
