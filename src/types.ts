export interface Policies {
  'policy-groups': Array<string>
  proxies: Array<string>
}

export interface PolicyGroups {
  [name: string]: Array<Policy>
}

export interface Policy {
  name: string
  typeDescription: string
}

export interface SelectPolicyTestResult {
  [key: string]: ProxyTestResult
}

export interface UrlTestPolicyTestResult {
  time: number
  winner: string
  results: Array<{
    time: number
    data: {
      [key: string]: ProxyTestResult
    }
  }>
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
  notes?: Array<string>
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
  requestHeader?: string
  policyName: string
  inBytes: number
  method: string
  pid: number
  replica: number
  rule: string
  startDate: number
  setupCompletedDate: number
  outMaxSpeed: number
  processPath?: string
  URL: string
  timingRecords?: Array<{ durationInMillisecond: number; name: string }>
}

export interface Traffic {
  startTime: number
  interface: {
    [name: string]: ConnectorTraffic
  }
  connector: {
    [name: string]: ConnectorTraffic
  }
}

export interface ConnectorTraffic {
  outCurrentSpeed: number
  in: number
  inCurrentSpeed: number
  outMaxSpeed: number
  out: number
  inMaxSpeed: number
  statistics?: Array<ConnectorStat>
}

export interface ConnectorStat {
  rttcur: number
  rttvar: number
  srtt: number
  txpackets: number
  txretransmitpackets: number
}

export interface Capability {
  enabled: boolean
}

export interface Modules {
  enabled: Array<string>
  available: Array<string>
}

export interface Scriptings {
  scripts: Array<{
    name: string
    type: string
    path: string
  }>
}

export interface EventList {
  events: Array<{
    identifier: string
    date: string
    type: number
    allowDismiss: number
    content: string
  }>
}

export interface Profile {
  id: string
  host: string
  port: number
  key: string
  name: string
  platform: 'macos' | 'ios'
  platformVersion: string
  platformBuild: number
  helperHost?: string
  helperPort?: number
}

export interface EvaluateResult {
  result: any
  output: string
  exception?: string
}

export interface DnsResult {
  local: ReadonlyArray<{
    data: string
    comment: string | null
    domain: string | null
    source: string | null
    server: string | null
  }>
  dnsCache: ReadonlyArray<{
    timeCost: number
    path: string
    data: ReadonlyArray<string>
    domain: string
    server: string
    expiresTime: number
  }>
}
