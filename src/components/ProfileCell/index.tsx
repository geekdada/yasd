/** @jsx jsx */
import { jsx } from '@emotion/core'
import axios from 'axios'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import tw from 'twin.macro'
import { Bin, PaperPlane } from '@sumup/icons'
import { IconButton } from '@sumup/circuit-ui'

import { Profile } from '../../types'

interface ProfileCellProps {
  profile: Profile
  checkConnectivity?: boolean
  onClick?: MouseEventHandler
  showDelete?: boolean
  onDelete?: MouseEventHandler
  variant?: 'spread' | 'left'
}

const ProfileCell: React.FC<ProfileCellProps> = ({
  profile,
  checkConnectivity,
  onClick,
  showDelete,
  onDelete,
  variant = 'spread',
}) => {
  const [available, setAvailable] = useState<boolean | undefined>(undefined)
  const variantStyle =
    variant === 'spread'
      ? tw`flex-row justify-between items-center`
      : tw`flex-col justify-start items-start`

  const clickHandler: MouseEventHandler = (e) => {
    e.stopPropagation()
    e.preventDefault()

    if (available && onClick) {
      onClick(e)
    }
  }

  const deleteHandler: MouseEventHandler = (e) => {
    e.stopPropagation()
    e.preventDefault()

    if (onDelete) {
      onDelete(e)
    }
  }

  const getCursorStyle = () => {
    if (onClick) {
      if (available) {
        return tw`cursor-pointer`
      }
      return tw`cursor-not-allowed`
    }
    return null
  }

  useEffect(() => {
    let isMounted = true

    if (checkConnectivity) {
      axios
        .request({
          url: `${profile.tls ? 'https' : 'http'}://${profile.host}:${
            profile.port
          }/v1/outbound`,
          method: 'GET',
          headers: {
            'x-key': profile.key,
          },
          timeout: 3000,
        })
        .then(() => {
          if (isMounted) setAvailable(true)
        })
        .catch(() => {
          if (isMounted) setAvailable(false)
        })
    }

    return () => {
      isMounted = false
    }
  }, [profile, checkConnectivity])

  return (
    <div
      key={profile.id}
      css={[getCursorStyle(), tw`flex p-3 justify-between`]}
      onClick={clickHandler}>
      <div css={[tw`flex w-full`, variantStyle]}>
        <div tw="truncate text-sm md:text-base leading-tight">
          {profile.name}
        </div>
        <div css={[tw`flex items-center`, variant === 'left' && tw`mt-2`]}>
          {checkConnectivity && (
            <div tw="relative flex h-3 w-3 mr-3">
              {available && (
                <span tw="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              )}
              <span
                css={[
                  tw`relative inline-flex rounded-full h-3 w-3`,
                  available === undefined && tw`bg-gray-500`,
                  available === true && tw`bg-green-500`,
                  available === false && tw`bg-red-500`,
                ]}
              />
            </div>
          )}
          <div tw="flex items-center font-mono text-gray-600 text-xs md:text-sm truncate leading-none">
            <span>
              {profile.host}:{profile.port}
            </span>
          </div>
        </div>
      </div>
      {showDelete && (
        <div tw="flex items-center ml-2">
          <IconButton
            onClick={deleteHandler}
            label={'delete profile'}
            css={[
              tw`flex items-center justify-center w-8 h-8 rounded-full text-gray-600`,
              css`
                padding: 0;

                svg {
                  ${tw`transition-colors duration-200 ease-in-out w-4 h-4`}
                }
                &:hover svg {
                  ${tw`text-gray-700`}
                }
              `,
            ]}>
            <Bin />
          </IconButton>
        </div>
      )}
    </div>
  )
}

export default ProfileCell
