/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, {
  ChangeEvent,
  FormEventHandler,
  useCallback,
  useEffect,
} from 'react'
import { Heading, Input, LoadingButton, Checkbox } from '@sumup/circuit-ui'
import { CircleWarning } from '@sumup/icons'
import css from '@emotion/css/macro'
import tw from 'twin.macro'
import store from 'store2'
import { v4 as uuid } from 'uuid'
import { find } from 'lodash-es'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ChangeLanguage from '../../components/ChangeLanguage'

import ProfileCell from '../../components/ProfileCell'
import Ad from '../../components/Ad'
import useSetState from '../../hooks/use-set-state'
import { useProfileDispatch } from '../../models/profile'
import { Profile } from '../../types'
import { ExistingProfiles, LastUsedProfile } from '../../utils/constant'
import Header from './components/Header'
import { useAuthData } from './hooks'
import { tryHost } from './utils'

const Page: React.FC = () => {
  const history = useHistory()
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
  const { t } = useTranslation()

  const addProfile = useCallback(
    (config: Omit<Profile, 'id'>): Profile => {
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
    },
    [existingProfiles, keepCredential, setExistingProfiles],
  )

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
          history.replace('/home')
        }
      })
    },
    [getExistingProfiles, history, keepCredential],
  )

  const deleteProfile = useCallback(
    (id: string) => {
      const profiles = existingProfiles.filter((item) => item.id !== id)

      setExistingProfiles(profiles)
      store.set(ExistingProfiles, profiles)
    },
    [setExistingProfiles, existingProfiles],
  )

  const resetFields = useCallback(() => {
    setData((prev) => ({
      ...prev,
      name: '',
      host: '',
      port: '',
      key: '',
      useTls: protocol === 'https:',
    }))
  }, [protocol, setData])

  const onSubmit: FormEventHandler = useCallback(
    (e) => {
      e.preventDefault()

      if (!data.name || !data.host || !data.port || !data.key) {
        return
      }

      setIsLoading(true)

      tryHost(data.useTls ? 'https:' : 'http:', data.host, data.port, data.key)
        .then((res) => {
          setHasError(false)

          const newProfile = addProfile({
            name: data.name,
            host: data.host,
            port: Number(data.port),
            key: data.key,
            platform: res.platform,
            platformVersion: res.platformVersion,
            platformBuild: res.platformBuild,
            tls: data.useTls,
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
    },
    [
      addProfile,
      data.host,
      data.key,
      data.name,
      data.port,
      data.useTls,
      resetFields,
      selectProfile,
      setHasError,
      setIsLoading,
    ],
  )

  const updateData = useCallback(
    (key: string, value: string) => {
      setData((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
    [setData],
  )

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
      <Header />

      <div tw="max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        <Heading size={'tera'}>{t('landing.add_new_host')}</Heading>

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
            Surge Mac v4.0.6 (1280) 开始已支持开启 HTTPS API，故不再支持使用
            yasd-helper。
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <Input
            type="text"
            required
            invalid={!!hasError}
            label={t('landing.name')}
            placeholder="Mac"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateData('name', e.target.value)
            }
          />
          <Input
            type="text"
            required
            invalid={!!hasError}
            label={t('landing.host')}
            placeholder="127.0.0.1"
            validationHint={t('landing.host_tips')}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateData('host', e.target.value)
            }
          />
          <Input
            type="number"
            required
            invalid={!!hasError}
            label={t('landing.port')}
            placeholder="6171"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateData('port', e.target.value)
            }
          />
          <Input
            type="text"
            required
            invalid={!!hasError}
            label={t('landing.key')}
            placeholder="examplekey"
            onChange={({ target }) =>
              setData((prev) => ({
                ...prev,
                key: (target as HTMLInputElement).value,
              }))
            }
          />

          <div>
            <Checkbox
              disabled={protocol === 'https:'}
              checked={data.useTls}
              onChange={() =>
                setData((prev) => ({
                  ...prev,
                  useTls: !prev.useTls,
                }))
              }>
              <span dangerouslySetInnerHTML={{ __html: t('landing.https') }} />
            </Checkbox>
            <Checkbox
              checked={keepCredential}
              onChange={() => setKeepCredential((prev) => !prev)}>
              {t('landing.remember_me')}
            </Checkbox>
          </div>

          <div tw="mt-6">
            <LoadingButton
              type="submit"
              variant="primary"
              stretch
              isLoading={isLoading}
              loadingLabel={t('landing.is_loading')}>
              {t('landing.confirm')}
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
          <Heading size={'mega'}>{t('landing.history')}</Heading>

          <div tw="bg-gray-100 divide-y divide-gray-200 rounded overflow-hidden">
            {existingProfiles.map((profile) => {
              return (
                <div key={profile.id} tw="hover:bg-gray-200">
                  <ProfileCell
                    profile={profile}
                    variant="left"
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

      <div tw="max-w-xs sm:max-w-sm md:max-w-md mx-auto mt-10">
        <Ad />
      </div>

      <div>
        <ChangeLanguage />
      </div>
    </div>
  )
}

export default Page
