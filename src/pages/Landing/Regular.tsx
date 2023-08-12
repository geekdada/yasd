import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import { find } from 'lodash-es'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

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
import { TypographyH2, TypographyH3 } from '@/components/ui/typography'
import VersionSupport from '@/components/VersionSupport'
import {
  HistoryActions,
  TrafficActions,
  useHistory,
  useHistoryDispatch,
  useProfile,
  useTrafficDispatch,
} from '@/models'
import { ProfileActions, useProfileDispatch } from '@/models/profile'
import { Profile } from '@/types'
import { isRunInSurge } from '@/utils'

import Header from './components/Header'
import { useAuthData, useLoginForm } from './hooks'
import { getSurgeHost, tryHost } from './utils'

const Page: React.FC = () => {
  const protocol = window.location.protocol

  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isLoading, setIsLoading } = useAuthData()

  const history = useHistory()
  const historyDispatch = useHistoryDispatch()
  const profile = useProfile()
  const profileDispatch = useProfileDispatch()
  const trafficDispatch = useTrafficDispatch()

  const { form, Schema } = useLoginForm()
  const { getValues, handleSubmit, clearErrors, setError, reset } = form

  const addHistory = useCallback(
    (profile: Profile): void => {
      historyDispatch({
        type: HistoryActions.ADD_HISTORY,
        payload: {
          profile,
          remember: getValues('keepCredential'),
        },
      })
    },
    [historyDispatch, getValues],
  )

  const selectHistory = useCallback(
    (profile: Profile): void => {
      if (getValues('keepCredential')) {
        historyDispatch({
          type: HistoryActions.REMEMBER_LAST_USED,
          payload: {
            id: profile.id,
          },
        })
      }

      profileDispatch({
        type: ProfileActions.Update,
        payload: profile,
      })

      if (!isRunInSurge()) {
        navigate('/home', { replace: true })
      }
    },
    [getValues, historyDispatch, navigate, profileDispatch],
  )

  const deleteHistory = useCallback(
    (id: string) => {
      historyDispatch({
        type: HistoryActions.DELETE_HISTORY,
        payload: {
          id,
        },
      })
    },
    [historyDispatch],
  )

  const onSubmit = useCallback(
    (data: z.infer<typeof Schema>) => {
      setIsLoading(true)

      const surgeHost = getSurgeHost()
      const protocol = data.useTls ? 'https:' : 'http:'

      tryHost(protocol, data.host, data.port, data.key)
        .then((res) => {
          clearErrors()

          const profile = isRunInSurge()
            ? ({
                name: res.name || 'Surge',
                host: surgeHost.hostname,
                port: Number(surgeHost.port),
                key: data.key,
                platform: res.platform,
                platformVersion: res.platformVersion,
                platformBuild: res.platformBuild,
                tls: data.useTls,
              } as const)
            : ({
                name: data.name,
                host: data.host,
                port: data.port,
                key: data.key,
                platform: res.platform,
                platformVersion: res.platformVersion,
                platformBuild: res.platformBuild,
                tls: data.useTls,
              } as const)
          const id = uuid()

          addHistory({
            id,
            ...profile,
          })
          selectHistory({
            id,
            ...profile,
          })
          reset()
        })
        .catch((err) => {
          setError('key', {
            type: 'invalid',
            message: err.message,
          })
          setError('host', {
            type: 'invalid',
            message: err.message,
          })
          setError('port', {
            type: 'invalid',
            message: err.message,
          })
          console.error(err)
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [addHistory, clearErrors, reset, selectHistory, setError, setIsLoading],
  )

  useEffect(() => {
    if (isRunInSurge()) {
      if (profile) {
        navigate('/home', { replace: true })
      }
    } else {
      profileDispatch({
        type: ProfileActions.Clear,
      })
      trafficDispatch({
        type: TrafficActions.Clear,
      })
    }
  }, [navigate, profile, profileDispatch, trafficDispatch])

  return (
    <div
      className="space-y-6 md:space-y-10"
      css={css`
        padding-bottom: calc(env(safe-area-inset-bottom) + 1.25rem);
      `}
    >
      <Header />

      <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto space-y-6 md:space-y-10">
        <TypographyH2>{t('landing.add_new_host')}</TypographyH2>

        <VersionSupport isRunInSurge={false} tvos macos ios>
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
        </VersionSupport>

        <Form {...form}>
          <form
            className="space-y-3 sm:space-y-4 md:space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <VersionSupport isRunInSurge={false} tvos macos ios>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('landing.name')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="My Mac"
                        autoComplete="off"
                      />
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
                        {...field}
                        placeholder="127.0.0.1"
                        autoCorrect="off"
                        autoCapitalize="off"
                        autoComplete="off"
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
            </VersionSupport>

            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('landing.key')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2 space-y-2">
              <VersionSupport isRunInSurge={false} tvos macos ios>
                <FormField
                  control={form.control}
                  name="useTls"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
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
              </VersionSupport>

              <FormField
                control={form.control}
                name="keepCredential"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
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

            <div className="pt-2">
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

      <VersionSupport isRunInSurge={false} tvos macos ios>
        {history && history.length > 0 && (
          <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto space-y-4">
            <TypographyH3>{t('landing.history')}</TypographyH3>

            <div className="bg-muted divide-y divide-gray-200 rounded-xl overflow-hidden">
              {history.map((profile) => {
                return (
                  <div key={profile.id} className="hover:bg-gray-100 md:px-3">
                    <ProfileCell
                      profile={profile}
                      variant="left"
                      checkConnectivity
                      showDelete
                      onClick={() => selectHistory(profile)}
                      onDelete={() => deleteHistory(profile.id)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </VersionSupport>

      <div>
        <ChangeLanguage />
      </div>
    </div>
  )
}

export default Page
