import { describe, expect, it } from 'vite-plus/test'
import { getGlobalPolicies } from './globalPolicies'

describe('global policy options', () => {
  it('includes only groups, DIRECT and REJECT, excluding individual proxies', () => {
    expect(
      getGlobalPolicies({
        'policy-groups': ['Group A', 'Group B', 'Group A'],
        proxies: ['Proxy A', 'Standalone', 'REJECT-TINYGIF'],
      }),
    ).toEqual([
      { name: 'Group A', typeDescription: 'Group', isGroup: true },
      { name: 'Group B', typeDescription: 'Group', isGroup: true },
      { name: 'DIRECT', typeDescription: 'Direct' },
      { name: 'REJECT', typeDescription: 'Reject' },
    ])
  })
  it('always includes DIRECT and REJECT even without groups', () => {
    expect(
      getGlobalPolicies({ 'policy-groups': [], proxies: ['Proxy'] }),
    ).toEqual([
      { name: 'DIRECT', typeDescription: 'Direct' },
      { name: 'REJECT', typeDescription: 'Reject' },
    ])
  })
})
