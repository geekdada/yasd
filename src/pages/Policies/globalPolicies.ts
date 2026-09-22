import { Policies, Policy } from '@/types'

export function getGlobalPolicies(policies: Policies): Policy[] {
  const options = new Map<string, Policy>()
  for (const name of policies['policy-groups']) {
    if (!options.has(name))
      options.set(name, { name, typeDescription: 'Group', isGroup: true })
  }
  options.set('DIRECT', { name: 'DIRECT', typeDescription: 'Direct' })
  options.set('REJECT', { name: 'REJECT', typeDescription: 'Reject' })
  return [...options.values()]
}
