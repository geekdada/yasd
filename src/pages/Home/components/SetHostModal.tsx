import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { find } from 'lodash-es'
import { Laptop } from 'lucide-react'
import store from 'store2'

import ProfileCell from '@/components/ProfileCell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useProfile } from '@/models/profile'
import { Profile } from '@/types'
import { ExistingProfiles, LastUsedProfile } from '@/utils/constant'

const SetHostModal: React.FC = () => {
  const { t } = useTranslation()
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

  useEffect(() => {
    const storedExistingProfiles = store.get(ExistingProfiles)

    if (storedExistingProfiles) {
      setExistingProfiles(storedExistingProfiles)
    }
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Laptop />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('landing.history')}</DialogTitle>
        </DialogHeader>

        <div className="bg-gray-100 divide-y divide-gray-200 rounded overflow-hidden">
          {existingProfiles.map((profile) => {
            return (
              <div
                key={profile.id}
                className="flex flex-row items-center hover:bg-gray-200"
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

        <div className="mt-4">
          <Button onClick={() => navigate('/', { replace: true })}>
            {t('landing.add_new_host')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SetHostModal
