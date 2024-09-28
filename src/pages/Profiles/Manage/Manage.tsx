import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Loader2Icon } from 'lucide-react'

import CodeContent from '@/components/CodeContent'
import { DataGroup, DataRowMain } from '@/components/Data'
import HorizontalSafeArea from '@/components/HorizontalSafeArea'
import PageTitle from '@/components/PageTitle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useConfirm } from '@/components/UIProvider'
import {
  useAvailableProfiles,
  useCurrentProfile,
  useProfileValidation,
} from '@/data'
import { useVersionSupport } from '@/hooks/useVersionSupport'
import fetcher from '@/utils/fetcher'

export const Component = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: 'profiles',
  })
  const navigate = useNavigate()
  const confirm = useConfirm()

  const [selectedProfile, setSelectedProfile] = useState<string | undefined>(
    undefined,
  )

  const isProfileReloadSupport = useVersionSupport({
    ios: true,
    macos: true,
  })
  const isProfileManagementSupport = useVersionSupport({
    macos: '4.0.6',
  })
  const { data: profiles } = useAvailableProfiles()
  const { data: currentProfile, mutate: mutateCurrentProfile } =
    useCurrentProfile()
  const {
    data: currentProfileValidation,
    isLoading: isLoadingCurrentProfileValidation,
    isValidating: isValidatingCurrentProfileValidation,
  } = useProfileValidation(currentProfile?.name)
  const {
    data: selectedProfileValidation,
    isLoading: isLoadingSelectedProfileValidation,
    isValidating: isValidatingSelectedProfileValidation,
  } = useProfileValidation(
    selectedProfile !== currentProfile?.name ? selectedProfile : undefined,
  )
  const isCurrentProfileInvalid =
    typeof currentProfileValidation?.error === 'string'
  const isSelectProfileInvalid =
    typeof selectedProfileValidation?.error === 'string'

  const onReloadProfile = useCallback(async () => {
    const result = await confirm({
      title: t('confirm_reload_profile.title'),
      description: t('confirm_reload_profile.description'),
    })

    try {
      if (result) {
        await fetcher({
          method: 'POST',
          url: '/profiles/reload',
        })
        await mutateCurrentProfile()

        toast.success(t('reload_profile_success'))
      }
    } catch (err) {
      console.error(err)
      toast.error(t('reload_profile_failed'))
    }
  }, [confirm, mutateCurrentProfile, t])

  const onSelectProfile = useCallback(
    async (newProfile: string) => {
      const result = await confirm({
        title: t('confirm_select_profile.title'),
        description: t('confirm_select_profile.description'),
      })

      try {
        if (result) {
          await fetcher({
            method: 'POST',
            url: '/profiles/switch',
            data: {
              name: newProfile,
            },
          })

          await mutateCurrentProfile()

          toast.success(t('select_profile_success'))
        }
      } catch (err) {
        console.error(err)
        toast.error(t('select_profile_failed'))
      }
    },
    [confirm, mutateCurrentProfile, t],
  )

  useEffect(() => {
    if (currentProfile) {
      setSelectedProfile(currentProfile.name)
    }
  }, [currentProfile])

  return (
    <>
      <PageTitle title={t('title')} />

      <HorizontalSafeArea>
        <div className="p-4 md:p-5 space-y-4 md:space-y-5">
          <DataGroup title={t('current')}>
            <DataRowMain onClick={() => navigate('/profiles/current')}>
              {t('view_current')}
            </DataRowMain>
            <DataRowMain
              className="flex"
              disabled={
                !isProfileReloadSupport ||
                isCurrentProfileInvalid ||
                isLoadingCurrentProfileValidation ||
                isValidatingCurrentProfileValidation
              }
              onClick={() => {
                onReloadProfile()
              }}
              hideArrow
              destructive
            >
              <div className="flex items-center gap-2">
                {t('reload_current')}

                {isLoadingCurrentProfileValidation ||
                isValidatingCurrentProfileValidation ? (
                  <Loader2Icon className="stroke-black/40 animate-spin w-4 h-4" />
                ) : null}
              </div>
            </DataRowMain>
          </DataGroup>

          {isCurrentProfileInvalid && (
            <div>
              <div className="text-destructive font-bold text-sm leading-normal px-3 md:px-5 mb-1">
                Error
              </div>
              <CodeContent
                className="rounded-lg"
                content={currentProfileValidation.error as string}
              />
            </div>
          )}

          {isProfileManagementSupport && (
            <>
              <DataGroup title={t('change_profile')}>
                <DataRowMain className="gap-3 min-h-[68px]">
                  <div className="truncate flex-1">{t('select_profile')}</div>

                  {profiles && currentProfile ? (
                    <Select
                      defaultValue={currentProfile.name}
                      onValueChange={(val) => {
                        setSelectedProfile(val)
                      }}
                    >
                      <SelectTrigger className="w-[140px] md:w-[180px] dark:border-black/90">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.profiles.map((profile) => (
                          <SelectItem key={profile} value={profile}>
                            {profile}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="h-full flex items-center">
                      <Loader2Icon className="stroke-black/40 animate-spin" />
                    </div>
                  )}
                </DataRowMain>
                <DataRowMain
                  onClick={() => {
                    if (selectedProfile) {
                      onSelectProfile(selectedProfile)
                    }
                  }}
                  destructive
                  hideArrow
                  disabled={
                    selectedProfile === currentProfile?.name ||
                    isSelectProfileInvalid ||
                    isLoadingSelectedProfileValidation ||
                    isValidatingSelectedProfileValidation
                  }
                >
                  <div className="flex items-center gap-2">
                    {t('select')}

                    {isLoadingSelectedProfileValidation ||
                    isValidatingSelectedProfileValidation ? (
                      <Loader2Icon className="stroke-black/40 animate-spin w-4 h-4" />
                    ) : null}
                  </div>
                </DataRowMain>
              </DataGroup>

              {isSelectProfileInvalid && (
                <div>
                  <div className="text-destructive font-bold text-sm leading-normal px-3 md:px-5 mb-1">
                    Error
                  </div>
                  <CodeContent
                    className="rounded-lg"
                    content={selectedProfileValidation.error as string}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </HorizontalSafeArea>
    </>
  )
}

Component.displayName = 'ManageProfilesPage'

export { ErrorBoundary } from '@/components/ErrorBoundary'
