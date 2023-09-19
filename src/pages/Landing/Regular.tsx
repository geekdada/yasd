import React, { useCallback, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import { AxiosError } from 'axios'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import ChangeLanguage from '@/components/ChangeLanguage'
import DarkModeToggle from '@/components/DarkModeToggle'
import ProfileCell from '@/components/ProfileCell'
import RunInSurge from '@/components/RunInSurge'
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
import { TypographyH2, TypographyH4 } from '@/components/ui/typography'
import VersionTag from '@/components/VersionTag'
import InstallCertificateModal from '@/pages/Landing/components/InstallCertificateModal'
import { useProfile, useAppDispatch, useHistory } from '@/store'
import { historyActions } from '@/store/slices/history'
import { profileActions } from '@/store/slices/profile'
import { Profile } from '@/types'
import { isRunInSurge } from '@/utils'
import { rememberLastUsed } from '@/utils/store'

import Header from './components/Header'
import HeaderInfo from './components/HeaderInfo'
import { useAuthData, useLoginForm } from './hooks'
import { getSurgeHost, tryHost } from './utils'

const Page: React.FC = () => {
  const protocol = window.location.protocol

  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isLoading, setIsLoading, tlsInstruction, setTlsInstruction } =
    useAuthData()

  const dispatch = useAppDispatch()
  const history = useHistory()
  const profile = useProfile()

  const { form, Schema } = useLoginForm()
  const { getValues, handleSubmit, clearErrors, setError, reset } = form

  const addHistory = useCallback(
    (profile: Profile): void => {
      dispatch(
        historyActions.addHistory({
          profile,
          remember: getValues('keepCredential'),
        }),
      )
    },
    [dispatch, getValues],
  )

  const selectHistory = useCallback(
    (profile: Profile): void => {
      if (getValues('keepCredential')) {
        rememberLastUsed(profile.id)
      }

      dispatch(profileActions.update(profile))

      if (!isRunInSurge()) {
        navigate('/home', { replace: true })
      }
    },
    [dispatch, getValues, navigate],
  )

  const deleteHistory = useCallback(
    (id: string) => {
      dispatch(
        historyActions.deleteHistory({
          id,
        }),
      )
    },
    [dispatch],
  )

  const onSubmit = useCallback(
    async (data: z.infer<typeof Schema>) => {
      setIsLoading(true)

      const surgeHost = getSurgeHost()
      const protocol = data.useTls ? 'https:' : 'http:'
      let newProfile

      try {
        const res = await tryHost(protocol, data.host, data.port, data.key)

        clearErrors()

        newProfile = isRunInSurge()
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
          ...newProfile,
        })
        selectHistory({
          id,
          ...newProfile,
        })
        reset()
      } catch (err) {
        setError('key', {
          type: 'invalid',
          message: '',
        })
        setError('host', {
          type: 'invalid',
          message: '',
        })
        setError('port', {
          type: 'invalid',
          message: '',
        })

        console.error(err)

        if (err instanceof AxiosError) {
          toast.error(err.message)

          if (
            !err.response &&
            !err.message.includes('timeout') &&
            err.config?.url &&
            err.config?.url?.includes('https')
          ) {
            const origin = new URL(err.config.url).origin

            setTlsInstruction((prevState) => ({
              ...prevState,
              origin,
              accessKey: data.key,
              open: true,
            }))
          }
        } else if (err instanceof Error) {
          toast.error(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [
      addHistory,
      clearErrors,
      reset,
      selectHistory,
      setError,
      setIsLoading,
      setTlsInstruction,
    ],
  )

  useEffect(() => {
    if (isRunInSurge()) {
      if (profile) {
        navigate('/home', { replace: true })
      }
    }
  }, [navigate, profile])

  return (
    <div
      className="space-y-6 md:space-y-10"
      css={css`
        padding-bottom: calc(env(safe-area-inset-bottom) + 1.25rem);
      `}
    >
      <Header />

      <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto space-y-6 md:space-y-10">
        <TypographyH2>
          {isRunInSurge() ? t('landing.login') : t('landing.add_new_host')}
        </TypographyH2>

        <RunInSurge not>
          <HeaderInfo />
        </RunInSurge>

        <Form {...form}>
          <form
            className="space-y-3 sm:space-y-4 md:space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <RunInSurge not>
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
            </RunInSurge>

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
              <RunInSurge not>
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
              </RunInSurge>

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

      <RunInSurge not>
        {history && history.length > 0 && (
          <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto space-y-2 md:space-y-4">
            <TypographyH4 className="px-3 md:px-5">
              {t('landing.history')}
            </TypographyH4>

            <div className="bg-muted divide-y divide-gray-200 rounded-xl overflow-hidden">
              {history.map((profile) => {
                return (
                  <div
                    key={profile.id}
                    className="hover:bg-gray-100 dark:hover:bg-black/20 md:px-2"
                  >
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
      </RunInSurge>

      <div className="space-y-3 flex justify-center flex-col items-center">
        <div className="flex justify-center items-center space-x-3">
          <ChangeLanguage />
          <DarkModeToggle />
        </div>
        <VersionTag />
      </div>

      <InstallCertificateModal
        accessKey={tlsInstruction.accessKey}
        origin={tlsInstruction.origin}
        open={tlsInstruction.open}
        onOpenChange={(open) => {
          if (!open) {
            setTlsInstruction((prev) => ({
              ...prev,
              accessKey: undefined,
              origin: undefined,
              open,
            }))
          }
        }}
      />
    </div>
  )
}

export default Page
