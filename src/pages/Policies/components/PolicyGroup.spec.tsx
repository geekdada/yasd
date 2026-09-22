import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { SWRConfig } from 'swr'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import fetcher from '@/utils/fetcher'

import PolicyGroup from './PolicyGroup'

vi.mock('@/utils/fetcher', () => ({ default: vi.fn() }))
vi.mock('@/store', () => ({ useProfile: () => ({ id: 'test' }) }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('use-is-in-viewport', () => ({ default: () => [true, undefined] }))
vi.mock('../usePolicyPerformance', () => ({
  mutatePolicyPerformanceResults: vi.fn(),
}))

describe('policy selection endpoints', () => {
  beforeEach(() => {
    vi.mocked(fetcher).mockReset()
    vi.mocked(fetcher).mockResolvedValue({ policy: 'Proxy A' })
  })
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it.each([true, false])(
    'routes selection correctly when isGlobal=%s',
    async (isGlobal) => {
      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <PolicyGroup
            isGlobal={isGlobal}
            policyGroupName="Group & A"
            columnCount={2}
            policyGroup={[
              { name: 'Proxy A', typeDescription: 'HTTPS' },
              { name: 'Proxy B', typeDescription: 'HTTPS' },
            ]}
          />
        </SWRConfig>,
      )
      await waitFor(() =>
        expect(fetcher).toHaveBeenCalledWith({
          url: isGlobal
            ? '/outbound/global'
            : '/policy_groups/select?group_name=Group%20%26%20A',
        }),
      )
      fireEvent.click(screen.getByText('Proxy B'))
      await waitFor(() =>
        expect(fetcher).toHaveBeenCalledWith({
          url: isGlobal ? '/outbound/global' : '/policy_groups/select',
          method: 'POST',
          data: isGlobal
            ? { policy: 'Proxy B' }
            : { group_name: 'Group & A', policy: 'Proxy B' },
        }),
      )
      expect(screen.queryByTitle('policies.test_policy') !== null).toBe(
        !isGlobal,
      )
      await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(3))
    },
  )

  it.each([false, true])(
    'refreshes external selection changes after initial failure=%s',
    async (initialFailure) => {
      vi.useFakeTimers()
      let policy = 'DIRECT'
      vi.mocked(fetcher).mockImplementation(async () => ({ policy }))
      if (initialFailure)
        vi.mocked(fetcher).mockRejectedValueOnce(new Error('Temporary failure'))
      render(
        <SWRConfig
          value={{
            provider: () => new Map(),
            dedupingInterval: 0,
            errorRetryInterval: 100,
            focusThrottleInterval: 0,
          }}
        >
          <PolicyGroup
            isGlobal
            policyGroupName="Global"
            columnCount={2}
            policyGroup={[
              { name: 'DIRECT', typeDescription: 'Direct' },
              { name: 'REJECT', typeDescription: 'Reject' },
            ]}
          />
        </SWRConfig>,
      )
      const selected = (name: string) =>
        screen
          .getByText(name, { selector: '.font-bold' })
          .parentElement?.parentElement?.classList.contains('bg-blue-500')
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000)
      })
      expect(selected('DIRECT')).toBe(true)
      policy = 'REJECT'
      await act(async () => {
        await vi.advanceTimersByTimeAsync(5000)
      })
      expect(selected('REJECT')).toBe(true)
      expect(selected('DIRECT')).toBe(false)
      policy = 'DIRECT'
      await act(async () => {
        window.dispatchEvent(new Event('focus'))
        await vi.advanceTimersByTimeAsync(1)
      })
      expect(selected('DIRECT')).toBe(true)
    },
  )
})
