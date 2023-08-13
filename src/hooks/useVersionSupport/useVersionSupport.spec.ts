import { jest } from '@jest/globals'
import { renderHook } from '@testing-library/react-hooks'

jest.unstable_mockModule('@/store', () => ({
  usePlatform: jest.fn(),
  usePlatformVersion: jest.fn(),
}))

const { usePlatform, usePlatformVersion } = await import('@/store')
const { useVersionSupport } = await import('./useVersionSupport')

describe('useVersionSupport', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe.each`
    platform   | platformVersion | macos        | ios          | tvos         | expected
    ${'macos'} | ${'10.15.0'}    | ${'10.14.0'} | ${undefined} | ${undefined} | ${true}
    ${'macos'} | ${'10.15.0'}    | ${'10.16.0'} | ${undefined} | ${undefined} | ${false}
    ${'ios'}   | ${'10.15.0'}    | ${'10.14.0'} | ${undefined} | ${undefined} | ${false}
    ${'ios'}   | ${'10.15.0'}    | ${undefined} | ${true}      | ${undefined} | ${true}
    ${'ios'}   | ${'10.15.0'}    | ${true}      | ${true}      | ${true}      | ${true}
  `(
    'when platform is $platform and platformVersion is $platformVersion and macos is $macos and ios is $ios and tvos is $tvos',
    ({ platform, platformVersion, macos, ios, tvos, expected }: any) => {
      beforeEach(() => {
        ;(usePlatform as jest.Mock).mockReturnValue(platform)
        ;(usePlatformVersion as jest.Mock).mockReturnValue(platformVersion)
      })

      it('should work', () => {
        const { result } = renderHook(() =>
          useVersionSupport({ macos, ios, tvos }),
        )

        expect(result.current).toBe(expected)
      })
    },
  )
})
