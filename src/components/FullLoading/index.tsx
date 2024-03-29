import React from 'react'
import tw from 'twin.macro'

const FullLoadingWrapper = tw.div`fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center`

const FullLoading: React.FC = () => {
  return <FullLoadingWrapper></FullLoadingWrapper>
}

export default FullLoading
