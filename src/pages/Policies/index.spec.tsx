import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import { Component } from './index'

const state = vi.hoisted(() => ({ mode: 'rule' }))
vi.mock('@/data/outbound', () => ({
  useOutbound: () => ({ data: { mode: state.mode } }),
}))
vi.mock('@/store', () => ({ useProfile: () => ({ id: 'test' }) }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('usehooks-ts', () => ({ useMediaQuery: () => false }))
vi.mock('@/components/BackButton', () => ({ default: () => null }))
vi.mock('@/components/VerticalSafeArea', () => ({ BottomSafeArea: () => null }))
vi.mock('./usePolicyPerformance', () => ({ usePolicyPerformance: () => ({}) }))
vi.mock('swr', () => ({
  default: (key: string) => ({
    data:
      key === '/policies'
        ? { 'policy-groups': ['First', 'Second'], proxies: [] }
        : { First: [], Second: [] },
  }),
}))
vi.mock('./components/PolicyGroup', () => ({
  default: ({ policyGroupName }: { policyGroupName: string }) => (
    <div data-testid="group">{policyGroupName}</div>
  ),
}))

describe('global group visibility and order', () => {
  afterEach(cleanup)

  it.each(['rule', 'direct', 'proxy'])(
    'shows Global first only in proxy mode (%s)',
    (mode) => {
      state.mode = mode
      render(<Component />)
      expect(
        screen.getAllByTestId('group').map((element) => element.textContent),
      ).toEqual(
        mode === 'proxy'
          ? ['policies.global', 'First', 'Second']
          : ['First', 'Second'],
      )
    },
  )

  it('removes Global when the mode changes back to rule', () => {
    state.mode = 'proxy'
    const { rerender } = render(<Component />)
    state.mode = 'rule'
    rerender(<Component />)
    expect(screen.queryByText('policies.global')).toBeNull()
  })
})
