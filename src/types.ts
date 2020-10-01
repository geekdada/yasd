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
