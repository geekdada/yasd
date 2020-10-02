/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import { Heading } from '@sumup/circuit-ui'
import tw from 'twin.macro'
import React, { createRef, RefObject, useRef } from 'react'
import { ScrollTo } from 'react-scroll-to'
import useSWR from 'swr'

import { Policies, PolicyGroups } from '../../types'
import fetcher from '../../utils/fetcher'
import PolicyGroup from './components/PolicyGroup'

const PolicyNameItem = styled.div`
  ${tw`flex-shrink-0 bg-gray-200 rounded-md px-3 py-2 mr-3 overflow-hidden cursor-pointer hover:bg-gray-300`}
`

const Page: React.FC = () => {
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
    <div tw="relative pb-5">
      <div
        tw="sticky top-0 left-0 right-0 shadow bg-white z-10 pt-5 mb-4"
        ref={headerRef}>
        <Heading size={'tera'} noMargin tw="mb-2 px-4">
          Policies
        </Heading>

        <div tw=" flex justify-start flex-no-wrap overflow-auto pt-3 pb-5 px-4">
          <ScrollTo>
            {({ scroll }) => (
              <React.Fragment>
                {policies &&
                  policies['policy-groups'].map((policy, index) => (
                    <PolicyNameItem
                      key={policy}
                      onClick={() =>
                        scroll({ y: getRefTop(refs[index]), smooth: true })
                      }>
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
          ${tw`px-4`}
        `}>
        {policies &&
          policyGroups &&
          policies['policy-groups'].map((policy, index) => {
            return (
              <div tw="mb-4" key={policy} ref={refs[index]}>
                <PolicyGroup
                  policyGroupName={policy}
                  policyGroup={policyGroups[policy]}
                />
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Page
