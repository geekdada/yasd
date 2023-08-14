import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Trash2 } from 'lucide-react'
import tw from 'twin.macro'

import { Button } from '@/components/ui/button'
import { Profile } from '@/types'
import { cn } from '@/utils/shadcn'

interface ProfileCellProps {
  profile: Profile
  checkConnectivity?: boolean
  onClick?: () => void
  onDelete?: () => void
  showDelete?: boolean
  variant?: 'spread' | 'left'
  className?: string
}

const ProfileCell: React.FC<ProfileCellProps> = ({
  profile,
  checkConnectivity,
  onClick,
  showDelete,
  onDelete,
  variant = 'spread',
  className,
}) => {
  const [available, setAvailable] = useState<boolean | undefined>(undefined)
  const variantStyle =
    variant === 'spread'
      ? 'flex-row justify-between items-center'
      : 'flex-col justify-start items-start'

  const clickHandler = () => {
    if (available && onClick) {
      onClick()
    }
  }

  const deleteHandler = () => {
    if (onDelete) {
      onDelete()
    }
  }

  const getCursorStyle = () => {
    if (onClick) {
      if (available) {
        return 'cursor-pointer'
      }
      return 'cursor-not-allowed'
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
      className={cn('flex p-3 justify-between ', getCursorStyle(), className)}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        clickHandler()
      }}
    >
      <div className={cn('flex w-full', variantStyle)}>
        <div className="truncate text-sm md:text-base leading-tight font-bold">
          {profile.name}
        </div>

        <div className={cn('flex items-center', variant === 'left' && 'mt-2')}>
          {checkConnectivity && (
            <div className="relative flex h-3 w-3 mr-3">
              {available && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
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
          <div className="flex items-center font-mono text-muted-foreground text-xs md:text-sm truncate leading-none">
            <span>
              {profile.host}:{profile.port}
            </span>
          </div>
        </div>
      </div>
      {showDelete && (
        <div className="flex items-center ml-2">
          <Button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              deleteHandler()
            }}
            title={'delete profile'}
            size="icon"
            variant="outline"
          >
            <Trash2 />
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProfileCell
