import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Headline } from '@sumup/circuit-ui'
import { find } from 'lodash-es'
import store from 'store2'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import Ad from '@/components/Ad'
import ChangeLanguage from '@/components/ChangeLanguage'
import ProfileCell from '@/components/ProfileCell'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSetState } from '@/hooks'
import { TrafficActions, useTrafficDispatch } from '@/models'
import { ProfileActions, useProfileDispatch } from '@/models/profile'
import { Profile } from '@/types'
import { ExistingProfiles, LastUsedProfile } from '@/utils/constant'

import Header from './components/Header'
import { useAuthData } from './hooks'
import { useSchemas } from './schemas'
import { tryHost } from './utils'

const Page: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const protocol = window.location.protocol
  const { isLoading, setIsLoading } = useAuthData()
  const { RegularLoginFormSchema } = useSchemas()

  const [existingProfiles, setExistingProfiles, getExistingProfiles] =
    useSetState<Array<Profile>>([])

  const profileDispatch = useProfileDispatch()
  const trafficDispatch = useTrafficDispatch()

  const form = useForm<z.infer<typeof RegularLoginFormSchema>>({
    resolver: zodResolver(RegularLoginFormSchema),
    defaultValues: {
      keepCredential: false,
      useTls: window.location.protocol === 'https:',
    },
  })
  const { getValues, handleSubmit, clearErrors, setError, reset } = form

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

  const selectProfile = useCallback(
    (id: string) => {
      getExistingProfiles().then((profiles) => {
        const profile = find(profiles, { id })

        if (profile) {
          if (getValues('keepCredential')) {
            store.set(LastUsedProfile, profile.id)
          }

          profileDispatch({
            type: ProfileActions.Update,
            payload: profile,
          })
          navigate('/home', { replace: true })
        }
      })
    },
    [getExistingProfiles, getValues, navigate, profileDispatch],
  )

  const deleteProfile = useCallback(
    (id: string) => {
      const profiles = existingProfiles.filter((item) => item.id !== id)

      setExistingProfiles(profiles)
      store.set(ExistingProfiles, profiles)
    },
    [existingProfiles, setExistingProfiles],
  )

  const onSubmit = (data: z.infer<typeof RegularLoginFormSchema>) => {
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

    profileDispatch({
      type: ProfileActions.Clear,
    })
    trafficDispatch({
      type: TrafficActions.Clear,
    })
  }, [profileDispatch, setExistingProfiles, trafficDispatch])

  return (
    <div
      className="space-y-6 md:space-y-10"
      css={css`
        padding-bottom: calc(env(safe-area-inset-bottom) + 1.25rem);
      `}
    >
      <Header />

      <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto space-y-6 md:space-y-10">
        <Headline as="h2" size="two">
          {t('landing.add_new_host')}
        </Headline>

        <div className="bg-blue-100 border border-blue-500 rounded text-blue-700 text-sm px-4 py-3 mb-4 space-y-4">
          <p className="leading-normal">
            该功能仅 Surge iOS 4.4.0 和 Surge Mac 4.0.0 以上版本支持。
          </p>
          <p className="leading-normal">
            <a
              href="https://manual.nssurge.com/others/http-api.html#configuration"
              target="_blank"
              rel="noreferrer"
              className="border-b border-solid border-blue-500"
            >
              🔗 开启方式
            </a>
          </p>
        </div>

        <Form {...form}>
          <form
            className="space-y-2 sm:space-y-4 md:space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('landing.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="My Mac" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('landing.host')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="127.0.0.1"
                      autoCorrect="off"
                      autoCapitalize="off"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t('landing.host_tips')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('landing.port')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="6171"
                      type="number"
                      autoCorrect="off"
                      autoComplete="off"
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('landing.key')}</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="useTls"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        disabled={protocol === 'https:'}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>{t('landing.https')}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keepCredential"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>{t('landing.remember_me')}</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-5">
              <Button
                className="w-full"
                type="submit"
                isLoading={isLoading}
                loadingLabel={t('landing.is_loading')}
              >
                {t('landing.confirm')}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {existingProfiles.length > 0 && (
        <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto space-y-4 md:space-y-6">
          <Headline as="h3" size="four">
            {t('landing.history')}
          </Headline>

          <div className="bg-muted divide-y divide-gray-200 rounded overflow-hidden">
            {existingProfiles.map((profile) => {
              return (
                <div key={profile.id} className="hover:bg-gray-200 md:px-3">
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

      <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        <Ad />
      </div>

      <div>
        <ChangeLanguage />
      </div>
    </div>
  )
}

export default Page
