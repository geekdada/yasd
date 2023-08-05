import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import { Headline, Input, Button, Checkbox } from '@sumup/circuit-ui'
import { find } from 'lodash-es'
import store from 'store2'
import { v4 as uuid } from 'uuid'

import Ad from '@/components/Ad'
import ChangeLanguage from '@/components/ChangeLanguage'
import ProfileCell from '@/components/ProfileCell'
import { useSetState } from '@/hooks'
import { useProfileDispatch } from '@/models/profile'
import { Profile } from '@/types'
import { ExistingProfiles, LastUsedProfile } from '@/utils/constant'
import { getValidationHint } from '@/utils/validation'

import Header from './components/Header'
import { useAuthData } from './hooks'
import { RegularFormFields } from './types'
import { tryHost } from './utils'

const Page: React.FC = () => {
  const navigate = useNavigate()
  const protocol = window.location.protocol
  const { isLoading, setIsLoading } = useAuthData()
  const [existingProfiles, setExistingProfiles, getExistingProfiles] =
    useSetState<Array<Profile>>([])
  const profileDispatch = useProfileDispatch()
  const { t } = useTranslation()
  const {
    getValues,
    register,
    handleSubmit,
    control,
    clearErrors,
    setError,
    reset,
    formState: { errors },
  } = useForm<RegularFormFields>({
    defaultValues: {
      keepCredential: false,
      useTls: window.location.protocol === 'https:',
    },
  })

  const addProfile = (config: Omit<Profile, 'id'>): Profile => {
    const profile: Profile = {
      ...config,
      id: uuid(),
    }
    const newProfiles = [profile, ...existingProfiles]
    setExistingProfiles(newProfiles)

    if (getValues('keepCredential')) {
      store.set(ExistingProfiles, newProfiles)
      store.set(LastUsedProfile, profile.id)
    }

    return profile
  }

  const selectProfile = (id: string) => {
    getExistingProfiles().then((profiles) => {
      const profile = find(profiles, { id })

      if (profile) {
        if (getValues('keepCredential')) {
          store.set(LastUsedProfile, profile.id)
        }

        profileDispatch({
          type: 'update',
          payload: profile,
        })
        navigate('/home', { replace: true })
      }
    })
  }

  const deleteProfile = (id: string) => {
    const profiles = existingProfiles.filter((item) => item.id !== id)

    setExistingProfiles(profiles)
    store.set(ExistingProfiles, profiles)
  }

  const onSubmit = (data: RegularFormFields) => {
    if (!data.name || !data.host || !data.port || !data.key) {
      return
    }

    setIsLoading(true)

    tryHost(data.useTls ? 'https:' : 'http:', data.host, data.port, data.key)
      .then((res) => {
        clearErrors()

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

        reset()
        setIsLoading(false)
        selectProfile(newProfile.id)
      })
      .catch((err) => {
        setError('key', {
          type: 'invalid',
          message: err.message,
        })
        setError('host', {
          type: 'invalid',
        })
        setError('port', {
          type: 'invalid',
        })
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
      `}
    >
      <Header />

      <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        <Headline as="h2" size="two">
          {t('landing.add_new_host')}
        </Headline>

        <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 text-sm px-4 py-3 mb-4 shadow-md">
          <p className="leading-normal mb-2">
            该功能仅 Surge iOS 4.4.0 和 Surge Mac 4.0.0 以上版本支持。
          </p>
          <p className="leading-normal mb-4">
            <a
              href="https://manual.nssurge.com/others/http-api.html#configuration"
              target="_blank"
              rel="noreferrer"
              className="border-b border-solid border-teal-500"
            >
              🔗 开启方式
            </a>
          </p>
          <p className="leading-normal mb-2">
            Surge Mac v4.0.6 (1280) 开始已支持开启 HTTPS API，故不再支持使用
            yasd-helper。
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            invalid={!!errors?.name}
            validationHint={getValidationHint(
              {
                required: t('devices.err_required'),
              },
              errors?.name,
            )}
            label={t('landing.name')}
            placeholder="Mac"
            {...register('name', { required: true })}
          />
          <Input
            type="text"
            invalid={!!errors?.host}
            label={t('landing.host')}
            placeholder="127.0.0.1"
            validationHint={t('landing.host_tips')}
            {...register('host', { required: true })}
          />
          <Input
            type="number"
            invalid={!!errors?.port}
            label={t('landing.port')}
            placeholder="6171"
            validationHint={getValidationHint(
              {
                required: t('devices.err_required'),
              },
              errors?.port,
            )}
            {...register('port', { required: true })}
          />
          <Input
            type="password"
            invalid={!!errors?.key}
            validationHint={getValidationHint(
              {
                required: t('devices.err_required'),
              },
              errors?.key,
            )}
            label={t('landing.key')}
            placeholder="examplekey"
            {...register('key', { required: true })}
          />

          <div>
            <Controller
              name="useTls"
              control={control}
              render={({ field }) => (
                <Checkbox
                  disabled={protocol === 'https:'}
                  checked={field.value}
                  onChange={field.onChange}
                >
                  {t('landing.https')}
                </Checkbox>
              )}
            />
            <Controller
              name="keepCredential"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} onChange={field.onChange}>
                  {t('landing.remember_me')}
                </Checkbox>
              )}
            />
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              variant="primary"
              stretch
              isLoading={isLoading}
              loadingLabel={t('landing.is_loading')}
            >
              {t('landing.confirm')}
            </Button>
          </div>
        </form>
      </div>

      {existingProfiles.length > 0 && (
        <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto mt-10">
          <Headline as="h3" size="four">
            {t('landing.history')}
          </Headline>

          <div className="bg-gray-100 divide-y divide-gray-200 rounded overflow-hidden">
            {existingProfiles.map((profile) => {
              return (
                <div key={profile.id} className="hover:bg-gray-200">
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

      <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto mt-10">
        <Ad />
      </div>

      <div className="mt-10">
        <ChangeLanguage />
      </div>
    </div>
  )
}

export default Page
