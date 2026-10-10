import { describe, expect, it } from 'vite-plus/test'

import { getCountryFlag, getCountryName, isIPAddress } from './geoip'

describe('isIPAddress', () => {
  it.each([
    '1.1.1.1',
    '0.0.0.0',
    '255.255.255.255',
    '2606:4700::1111',
    '::1',
    '::ffff:1.2.3.4',
  ])('accepts %s', (value) => {
    expect(isIPAddress(value)).toBe(true)
  })

  it.each([
    'example.com',
    '256.1.1.1',
    '1.1.1',
    '01.1.1.1',
    '2606:4700:::1111',
    'fe80::1%en0',
    '',
  ])('rejects %j', (value) => {
    expect(isIPAddress(value)).toBe(false)
  })
})

describe('getCountryFlag', () => {
  it('turns a country code into a flag', () => {
    expect(getCountryFlag('AU')).toBe('🇦🇺')
    expect(getCountryFlag('us')).toBe('🇺🇸')
  })

  it.each(['', 'USA', '1A'])('returns nothing for %j', (code) => {
    expect(getCountryFlag(code)).toBe('')
  })
})

describe('getCountryName', () => {
  it('localizes the country name', () => {
    expect(getCountryName('AU', 'en')).toBe('Australia')
    expect(getCountryName('AU', 'zh')).toBe('澳大利亚')
  })

  it('falls back to the code for an invalid language', () => {
    expect(getCountryName('AU', '!!')).toBe('AU')
  })
})
