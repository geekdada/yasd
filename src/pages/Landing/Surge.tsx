/** @jsx jsx */
import { jsx } from '@emotion/core'
import axios from 'axios'
import React, { FormEventHandler, useCallback, useEffect } from 'react'
import { Heading, Input, LoadingButton, Checkbox } from '@sumup/circuit-ui'
import { CircleWarning } from '@sumup/icons'
import css from '@emotion/css/macro'
import tw from 'twin.macro'
import store from 'store2'
import { v4 as uuid } from 'uuid'
import { find } from 'lodash-es'
import { useHistory } from 'react-router-dom'

import useSetState from '../../hooks/use-set-state'
import { useProfile, useProfileDispatch } from '../../models/profile'
import { Profile } from '../../types'
import { ExistingProfiles, LastUsedProfile } from '../../utils/constant'
import { useAuthData } from './hooks'

const Page: React.FC = () => {
  const protocol = window.location.protocol
  const {
    data,
    setData,
    hasError,
    setHasError,
    isLoading,
    setIsLoading,
    keepCredential,
    setKeepCredential,
  } = useAuthData()
  const [existingProfiles, setExistingProfiles, getExistingProfiles] =
    useSetState<Array<Profile>>([])
  const profileDispatch = useProfileDispatch()
  const profile = useProfile()
  const history = useHistory()

  const addProfile = (config: Omit<Profile, 'id'>): Profile => {
    const profile: Profile = {
      ...config,
      id: uuid(),
    }
    const newProfiles = [profile, ...existingProfiles]
    setExistingProfiles(newProfiles)

    if (keepCredential) {
      store.set(ExistingProfiles, newProfiles)
      store.set(LastUsedProfile, profile.id)
    }

    return profile
  }

  const selectProfile = useCallback(
    (id: string) => {
      getExistingProfiles().then((profiles) => {
        const profile = find(profiles, { id })

        if (profile) {
          if (keepCredential) {
            store.set(LastUsedProfile, profile.id)
          }

          profileDispatch({
            type: 'update',
            payload: profile,
          })
        }
      })
    },
    [getExistingProfiles, history, keepCredential],
  )

  const resetFields = () => {
    setData((prev) => ({
      ...prev,
      key: '',
    }))
  }

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    if (!data.key) {
      return
    }

    const { hostname, port } = window.location
    setIsLoading(true)

    axios
      .request({
        url: `${protocol}//${hostname}:${port}/v1/outbound`,
        method: 'GET',
        timeout: 3000,
        headers: {
          'x-key': data.key,
        },
      })
      .then((res) => {
        setHasError(false)

        const newProfile = addProfile({
          name: 'Surge for Mac',
          host: hostname,
          port: Number(port),
          key: data.key,
          platform: res.headers['x-system']?.includes('macOS')
            ? 'macos'
            : 'ios',
          platformVersion: res.headers['x-surge-version'] || '',
          platformBuild: res.headers['x-surge-build'] || '',
          tls: protocol === 'https:',
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
    const lastId = store.get(LastUsedProfile)

    if (storedExistingProfiles) {
      const result = find<Profile>(storedExistingProfiles, { id: lastId })

      setExistingProfiles(storedExistingProfiles)

      if (result) {
        profileDispatch({
          type: 'update',
          payload: result,
        })
      }
    }
  }, [setExistingProfiles])

  useEffect(() => {
    if (profile) {
      history.replace('/home')
    }
  }, [profile, history])

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
        <Heading size={'tera'}>添加 Surge</Heading>

        <form onSubmit={onSubmit}>
          <Input
            type="text"
            required
            invalid={!!hasError}
            label="密钥"
            placeholder="examplekey"
            value={data.key}
            onChange={({ target }) =>
              setData((prev) => ({
                ...prev,
                key: (target as HTMLInputElement).value,
              }))
            }
          />

          <div>
            <Checkbox
              checked={keepCredential}
              onChange={() => setKeepCredential((prev) => !prev)}>
              保存到浏览器
            </Checkbox>
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
    </div>
  )
}

export default Page
