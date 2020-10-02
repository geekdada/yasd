import styled from '@emotion/styled/macro'
import tw from 'twin.macro'

export const DataGroup = styled.div`
  ${tw`divide-y divide-gray-200 bg-gray-100 rounded-lg mb-4`}
`

export const DataRow = styled.div``

export const DataRowMain = styled.div`
  ${tw`flex items-center justify-between px-3 py-3 leading-normal text-gray-800`}

  & > div:last-of-type {
    ${tw`text-gray-600`}
  }
`

export const DataRowSub = styled.div`
  ${tw`flex items-center justify-between px-3 leading-normal text-xs text-gray-800`}

  & > div:last-of-type {
    ${tw`text-gray-600`}
  }
`
