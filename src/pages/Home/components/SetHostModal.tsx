import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { find } from 'lodash-es'
import { Laptop } from 'lucide-react'
import store from 'store2'

import ProfileCell from '@/components/ProfileCell'
import { useResponsiveDialog } from '@/components/ResponsiveDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useProfile } from '@/store'
import { profileActions } from '@/store/slices/profile'
import { trafficActions } from '@/store/slices/traffic'
import { Profile } from '@/types'
import { ExistingProfiles, LastUsedProfile } from '@/utils/constant'

const SetHostModal: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogClose,
    DialogDescription,
  } = useResponsiveDialog()

  const [existingProfiles, setExistingProfiles] = useState<Array<Profile>>([])
  const currentProfile = useProfile()
  const navigate = useNavigate()

  const selectProfile = useCallback(
    (id: string) => {
      const profile = find(existingProfiles, { id })

      if (profile) {
        store.set(LastUsedProfile, profile.id)
        window.location.reload()
      }
    },
    [existingProfiles],
  )

  const onAddNewProfile = useCallback(() => {
    dispatch(profileActions.clear())
    dispatch(trafficActions.clear())
    navigate('/', { replace: true })
  }, [dispatch, navigate])

  useEffect(() => {
    const storedExistingProfiles = store.get(ExistingProfiles)

    if (storedExistingProfiles) {
      setExistingProfiles(storedExistingProfiles)
    }
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="dark:bg-muted">
          <Laptop />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('landing.history')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('landing.history')}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-100 dark:bg-muted border divide-y divide-gray-200 dark:divide-black/20 rounded-xl overflow-hidden my-3">
          {existingProfiles.map((profile) => {
            return (
              <div
                key={profile.id}
                className="flex flex-row items-center hover:bg-gray-100 dark:hover:bg-black/20"
              >
                {profile.id === currentProfile?.id && (
                  <Badge className="ml-3 text-xs md:text-sm">
                    {t('landing.current')}
                  </Badge>
                )}
                <div className="flex-1">
                  <ProfileCell
                    profile={profile}
                    checkConnectivity
                    onClick={() => selectProfile(profile.id)}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <Button onClick={() => onAddNewProfile()}>
            {t('landing.add_new_host')}
          </Button>
          <DialogClose asChild className="md:hidden">
            <Button autoFocus variant="outline">
              {t('common.close')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SetHostModal
