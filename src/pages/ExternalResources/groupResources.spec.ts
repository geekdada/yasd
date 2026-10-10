import { describe, expect, it } from 'vite-plus/test'

import { ExternalResource } from '@/types'

import { getResourceName, groupByModule } from './groupResources'

const resource = (
  key: string,
  fromModule: string | null,
): ExternalResource => ({
  path: `https://example.com/${key}.list`,
  type: 'ruleset',
  key,
  local: false,
  ready: true,
  updating: false,
  fromModule,
})

describe('groupByModule', () => {
  it('puts the main profile first and keeps module order', () => {
    const groups = groupByModule([
      resource('a', 'Module B'),
      resource('b', null),
      resource('c', 'Module A'),
      resource('d', 'Module B'),
    ])

    expect(
      groups.map((group) => [
        group.module,
        group.resources.map((item) => item.key),
      ]),
    ).toEqual([
      [null, ['b']],
      ['Module B', ['a', 'd']],
      ['Module A', ['c']],
    ])
  })

  it('omits the main profile when it has no resources', () => {
    expect(groupByModule([resource('a', 'Module')])).toHaveLength(1)
  })
})

describe('getResourceName', () => {
  it.each`
    path                                        | expected
    ${'https://example.com/rules/Google.list'}  | ${'Google.list'}
    ${'https://example.com/a/b.list?token=1#x'} | ${'b.list'}
    ${'https://example.com/a/b/'}               | ${'b'}
    ${'https://example.com/%E8%A7%84%E5%88%99'} | ${'规则'}
    ${'https://example.com/%E0%A4%A'}           | ${'%E0%A4%A'}
    ${'local.js'}                               | ${'local.js'}
  `('returns $expected for $path', ({ path, expected }) => {
    expect(getResourceName(path)).toBe(expected)
  })
})
