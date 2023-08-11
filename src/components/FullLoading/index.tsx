import React from 'react'
import { ReloadIcon } from '@radix-ui/react-icons'
import tw from 'twin.macro'

const FullLoadingWrapper = tw.div`fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center`

const FullLoading: React.FC = () => {
  return (
    <FullLoadingWrapper>
      <ReloadIcon className="w-6 h-6 animate-spin" />
    </FullLoadingWrapper>
  )
}

export default FullLoading
