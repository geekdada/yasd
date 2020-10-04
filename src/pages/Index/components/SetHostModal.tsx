/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Laptop } from '@sumup/icons'
import { find } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import tw from 'twin.macro'
import store from 'store2'
import { useHistory } from 'react-router-dom'
import {
  useModal,
  ModalWrapper,
  ModalHeader,
  IconButton,
  Badge,
  Button,
} from '@sumup/circuit-ui'
import ProfileCell from '../../../components/ProfileCell'
import { useProfile } from '../../../models/profile'

import { Profile } from '../../../types'
import { ExistingProfiles, LastUsedProfile } from '../../../utils/constant'

const SetHostModal: React.FC = () => {
  const [existingProfiles, setExistingProfiles] = useState<Array<Profile>>([])
  const { setModal } = useModal()
  const currentProfile = useProfile()
  const history = useHistory()

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

  const showModal = () => {
    setModal({
      // eslint-disable-next-line react/display-name
      children: ({ onClose }) => {
        return (
          <ModalWrapper>
            <ModalHeader title="History" onClose={onClose} />
            <div tw="bg-gray-100 divide-y divide-gray-200 rounded overflow-hidden">
              {existingProfiles.map((profile) => {
                return (
                  <div
                    key={profile.id}
                    tw="flex flex-row items-center hover:bg-gray-200">
                    {profile.id === currentProfile?.id && (
                      <Badge variant="success" tw="ml-3 text-xs md:text-sm">
                        当前
                      </Badge>
                    )}
                    <div tw="flex-1">
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

            <div tw="mt-4">
              <Button
                size="kilo"
                variant="primary"
                onClick={() => history.replace('/')}>
                Add new Host
              </Button>
            </div>
          </ModalWrapper>
        )
      },
      onClose() {
        // noop
      },
    })
  }

  return (
    <IconButton label={'change host'} tw="w-10 h-10 p-1" onClick={showModal}>
      <Laptop />
    </IconButton>
  )
}

export default SetHostModal
