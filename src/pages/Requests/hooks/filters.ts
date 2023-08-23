import { RequestItem } from '@/types'

import { SorterRules } from '../components/SorterPopover'

export const activeFilter = (
  enabled: boolean | undefined,
  item: RequestItem,
): boolean => {
  if (enabled) {
    return !item.completed
  }
  return true
}

export const sourceIpFilter = (
  ip: string | null | undefined,
  item: RequestItem,
): boolean => {
  if (ip) {
    return item.sourceAddress === ip
  }
  return true
}

export const urlFilter = (
  url: string | undefined,
  item: RequestItem,
): boolean => {
  if (url) {
    return item.URL.includes(url)
  }
  return true
}

export const sorter = (
  sortRule: SorterRules,
  a: RequestItem,
  b: RequestItem,
): number => {
  if (sortRule.sortBy === null) {
    return 0
  }

  if (sortRule.sortBy === 'time') {
    // Return comparing a.startDate and b.startDate
    return sortRule.sortDirection === 'asc'
      ? a.startDate - b.startDate
      : b.startDate - a.startDate
  }

  if (sortRule.sortBy === 'size') {
    // Return comparing a.inBytes + a.outBytes and b.inBytes + b.outBytes
    return sortRule.sortDirection === 'asc'
      ? a.inBytes + a.outBytes - b.inBytes - b.outBytes
      : b.inBytes + b.outBytes - a.inBytes - a.outBytes
  }

  return 0
}
