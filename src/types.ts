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
  failed: 1 | 0 | boolean
  status:
    | 'Active'
    | 'Completed'
    | 'Rule Evaluating'
    | 'DNS Lookup'
    | 'Establishing Connection'
  outCurrentSpeed: number
  completed: 1 | 0 | boolean
  modified: 1 | 0 | boolean
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
  replica: 1 | 0 | boolean
  rule: string
  startDate: number
  setupCompletedDate: number
  outMaxSpeed: number
  processPath?: string
  URL: string
  timingRecords?: Array<{ durationInMillisecond: number; name: string }>
  lastUpdated?: Date
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
  platformBuild: string
  tls?: boolean
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

export interface DeviceInfo {
  activeConnections: number
  currentSpeed: number
  displayIPAddress: string
  hasProxyConnection: boolean
  hasTCPConnection: boolean
  identifier: string
  name: string
  physicalAddress?: string
  sourceIP: string
  topHostBySingleConnectionTraffic: string
  totalBytes: number
  totalConnections: number
  vendor: string
  dhcpDevice?: DHCPDevice
}

export interface DHCPDevice {
  assignedIP?: string
  currentIP?: string
  dhcpHostname: string
  dhcpLastSeen?: string
  handledBySurge: 0 | 1
  displayName?: string
  icon?: string
  physicalAddress: string
  shouldHandledBySurge: 0 | 1
  waitingToReconnect: 0 | 1
}

export interface DevicesResult {
  devices: ReadonlyArray<DeviceInfo>
}
