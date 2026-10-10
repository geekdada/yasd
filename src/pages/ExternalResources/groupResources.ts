import { ExternalResource } from '@/types'

export interface ResourceGroup {
  // Null means the resources come from the main profile.
  module: string | null
  resources: Array<ExternalResource>
}

// The main profile comes first. Modules keep the order Surge returns them in.
export const groupByModule = (
  resources: ReadonlyArray<ExternalResource>,
): Array<ResourceGroup> => {
  const groups = new Map<string | null, Array<ExternalResource>>([[null, []]])

  for (const resource of resources) {
    const group = groups.get(resource.fromModule) ?? []
    group.push(resource)
    groups.set(resource.fromModule, group)
  }

  return Array.from(groups, ([module, items]) => ({
    module,
    resources: items,
  })).filter((group) => group.resources.length > 0)
}

export const getResourceName = (path: string): string => {
  const pathname = path.split(/[?#]/)[0]
  const name = pathname.split('/').filter(Boolean).pop()

  if (!name) {
    return path
  }

  try {
    return decodeURIComponent(name)
  } catch {
    return name
  }
}
