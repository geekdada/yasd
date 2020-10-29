/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, {
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Heading, Input, LoadingButton, Checkbox } from '@sumup/circuit-ui'
import { CircleWarning } from '@sumup/icons'
import css from '@emotion/css/macro'
import tw from 'twin.macro'
import store from 'store2'
import { v4 as uuid } from 'uuid'
import { find } from 'lodash-es'
import { useHistory } from 'react-router-dom'

import ProfileCell from '../../components/ProfileCell'
import useSetState from '../../hooks/use-set-state'
import { Profile } from '../../types'
import { ExistingProfiles, LastUsedProfile } from '../../utils/constant'
import { bareFetcher } from '../../utils/fetcher'

const Page: React.FC = () => {
  const history = useHistory()
  const protocol = window.location.protocol
  const [name, setName] = useState<string | undefined>()
  const [host, setHost] = useState<string | undefined>()
  const [helperHost, setHelperHost] = useState<string | undefined>()
  const [port, setPort] = useState<string | undefined>()
  const [helperPort, setHelperPort] = useState<string | undefined>()
  const [key, setKey] = useState<string | undefined>()
  const [useHelper, setUseHelper] = useState<boolean>(
    () => protocol === 'https:',
  )
  const [
    existingProfiles,
    setExistingProfiles,
    getExistingProfiles,
  ] = useSetState<Array<Profile>>([])
  const [hasError, setHasError] = useState<boolean | string>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const addProfile = (config: Omit<Profile, 'id'>): Profile => {
    const profile: Profile = {
      ...config,
      id: uuid(),
    }
    const newProfiles = [profile, ...existingProfiles]
    setExistingProfiles(newProfiles)
    store.set(ExistingProfiles, newProfiles)
    store.set(LastUsedProfile, profile.id)

    return profile
  }

  const selectProfile = useCallback(
    (id: string) => {
      getExistingProfiles().then((profiles) => {
        const profile = find(profiles, { id })

        if (profile) {
          store.set(LastUsedProfile, profile.id)
          history.replace('/home')
        }
      })
    },
    [getExistingProfiles, history],
  )

  const deleteProfile = useCallback(
    (id: string) => {
      const profiles = existingProfiles.filter((item) => item.id !== id)

      setExistingProfiles(profiles)
      store.set(ExistingProfiles, profiles)
    },
    [setExistingProfiles, existingProfiles],
  )

  const resetFields = () => {
    setName('')
    setHost('')
    setPort('')
    setKey('')
    setHelperHost('')
    setHelperPort('')
  }

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    if (!name || !host || !port || !key) {
      return
    }

    setIsLoading(true)

    const options =
      useHelper && helperHost && helperPort
        ? {
            helperHost,
            helperPort: Number(helperPort),
          }
        : undefined

    bareFetcher(
      {
        url: `http://${host}:${port}/v1/outbound`,
        method: 'GET',
        timeout: 3000,
        headers: {
          'x-key': key,
        },
      },
      options,
    )
      .then((res) => {
        setHasError(false)

        const newProfile = addProfile({
          name,
          host,
          port: Number(port),
          key,
          platform: res.headers['x-system']?.includes('macOS')
            ? 'macos'
            : 'ios',
          platformVersion: res.headers['x-surge-version'] || '',
          platformBuild: res.headers['x-surge-build'] || '',
          helperHost: helperHost,
          helperPort: Number(helperPort),
        })

        resetFields()
        setIsLoading(false)
        selectProfile(newProfile.id)
      })
      .catch((err) => {
        setHasError(err.message)
        console.error(err)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    const storedExistingProfiles = store.get(ExistingProfiles)

    if (storedExistingProfiles) {
      setExistingProfiles(storedExistingProfiles)
    }
  }, [setExistingProfiles])

  return (
    <div
      css={css`
        padding-bottom: calc(env(safe-area-inset-bottom) + 1.25rem);
      `}>
      <Heading
        size={'tera'}
        noMargin
        tw="sticky top-0 flex shadow bg-white z-10 px-3 py-3 mb-4">
        YASD
        <small tw="text-xs font-normal font-mono text-gray-600 ml-3">
          {`v${process.env.REACT_APP_VERSION}`}
        </small>
      </Heading>

      <div tw="max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        <Heading size={'tera'}>Add New Host</Heading>

        <div tw="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 text-sm px-4 py-3 mb-4 shadow-md">
          <p tw="leading-normal mb-2">
            该功能仅 Surge iOS 4.4.0 和 Surge Mac 4.0.0 以上版本支持。
          </p>
          <p tw="leading-normal mb-4">
            <a
              href="https://manual.nssurge.com/others/http-api.html#configuration"
              target="_blank"
              rel="noreferrer"
              tw="border-b border-solid border-teal-500">
              🔗 开启方式
            </a>
          </p>
          <p tw="leading-normal mb-2">
            您已可通过 yasd-helper 实现 HTTPS 访问 Surge API。
          </p>
          <p tw="leading-normal">
            <a
              href="https://github.com/geekdada/yasd-helper"
              target="_blank"
              rel="noreferrer"
              tw="border-b border-solid border-teal-500">
              🔗 查看
            </a>
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <Input
            type="text"
            required
            invalid={!!hasError}
            label="Name"
            placeholder="Mac"
            value={name}
            onChange={({ target }) =>
              setName((target as HTMLInputElement).value)
            }
          />
          <Input
            type="text"
            required
            invalid={!!hasError}
            label="Host"
            placeholder="127.0.0.1"
            validationHint="局域网内可用类似 iphone.local 的地址"
            value={host}
            onChange={({ target }) =>
              setHost((target as HTMLInputElement).value)
            }
          />
          <Input
            type="number"
            required
            invalid={!!hasError}
            label="Port"
            placeholder="6171"
            value={port}
            onChange={({ target }) =>
              setPort((target as HTMLInputElement).value)
            }
          />
          <Input
            type="text"
            required
            invalid={!!hasError}
            label="Key"
            placeholder="examplekey"
            value={key}
            onChange={({ target }) =>
              setKey((target as HTMLInputElement).value)
            }
          />
          <div>
            <div>
              <Checkbox
                disabled={protocol === 'https:'}
                checked={useHelper}
                onChange={() => setUseHelper((prev) => !prev)}>
                使用 yasd-helper 中转
              </Checkbox>
            </div>

            {useHelper && (
              <React.Fragment>
                <Input
                  type="text"
                  required={protocol === 'https:'}
                  invalid={!!hasError}
                  label="Helper Host"
                  placeholder="192.168.1.2.nip.io"
                  value={helperHost}
                  onChange={({ target }) =>
                    setHelperHost((target as HTMLInputElement).value)
                  }
                />
                <Input
                  type="number"
                  required={protocol === 'https:'}
                  invalid={!!hasError}
                  label="Helper Port"
                  placeholder="8443"
                  value={helperPort}
                  onChange={({ target }) =>
                    setHelperPort((target as HTMLInputElement).value)
                  }
                />
              </React.Fragment>
            )}
          </div>
          <div tw="mt-6">
            <LoadingButton
              type="submit"
              variant="primary"
              stretch
              isLoading={isLoading}
              loadingLabel={'Loading'}>
              Done
            </LoadingButton>
          </div>

          {typeof hasError === 'string' && (
            <div tw="text-red-400 mt-4 flex items-center">
              <CircleWarning tw="mr-2" />
              {hasError}
            </div>
          )}
        </form>
      </div>

      {existingProfiles.length > 0 && (
        <div tw="max-w-xs sm:max-w-sm md:max-w-md mx-auto mt-10">
          <Heading size={'mega'}>History</Heading>

          <div tw="bg-gray-100 divide-y divide-gray-200 rounded overflow-hidden">
            {existingProfiles.map((profile) => {
              return (
                <div key={profile.id} tw="hover:bg-gray-200">
                  <ProfileCell
                    profile={profile}
                    checkConnectivity
                    showDelete
                    onClick={() => selectProfile(profile.id)}
                    onDelete={() => deleteProfile(profile.id)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Page
