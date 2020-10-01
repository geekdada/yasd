export interface Policies {
  'policy-groups': string[]
  proxies: string[]
}

export interface PolicyGroups {
  [name: string]: Policy[]
}

export interface Policy {
  name: string
  typeDescription: string
}

export interface PolicyTestResult {
  [key: string]: ProxyTestResult
}

export interface ProxyTestResult {
  tcp?: number
  rtt?: number
  receive?: number
  available?: number
  tfo?: boolean
}

export interface RecentRequests {
  requests: Array<RequestItem>
}

export interface RequestItem {
  id: number
  remoteAddress: string
  inMaxSpeed: number
  notes: string[]
  inCurrentSpeed: number
  failed: number
  status: 'Active' | 'Complete'
  outCurrentSpeed: number
  completed: number
  sourcePort: number
  completedDate: number
  outBytes: number
  sourceAddress: string
  localAddress: string
  requestHeader: string
  policyName: string
  inBytes: number
  method: string
  pid: number
  replica: number
  rule: string
  startDate: number
  setupCompletedDate: number
  outMaxSpeed: number
  processPath: string
  URL: string
  timingRecords: Array<{ durationInMillisecond: number; name: string }>
}
