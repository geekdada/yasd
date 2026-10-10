import { GeoIPResult } from '@/types'

const IPV4_PATTERN =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/
const REGIONAL_INDICATOR_A = 0x1f1e6
const LETTER_A = 'A'.charCodeAt(0)

const isIPv6 = (value: string): boolean => {
  if (!value.includes(':')) {
    return false
  }
  try {
    // The URL parser validates IPv6 literals inside brackets.
    new URL(`http://[${value}]`)
    return true
  } catch {
    return false
  }
}

export const isIPAddress = (value: string): boolean =>
  IPV4_PATTERN.test(value) || isIPv6(value)

export const getCountryFlag = (code: string): string => {
  if (!/^[a-z]{2}$/i.test(code)) {
    return ''
  }
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split('')
      .map((letter) => REGIONAL_INDICATOR_A + letter.charCodeAt(0) - LETTER_A),
  )
}

export const getCountryName = (code: string, language: string): string => {
  try {
    return (
      new Intl.DisplayNames([language], { type: 'region' }).of(code) ?? code
    )
  } catch {
    return code
  }
}

export const formatGeoIP = (result: GeoIPResult, language: string): string => {
  const country = result.country
    ? `${getCountryFlag(result.country)} ${getCountryName(result.country, language)}`.trim()
    : null

  return [country, result.asn && `AS${result.asn}`, result.organization]
    .filter(Boolean)
    .join(' · ')
}
