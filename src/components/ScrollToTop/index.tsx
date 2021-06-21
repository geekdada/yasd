import { useModal } from '@sumup/circuit-ui'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation()
  const { isModalOpen, removeModal } = useModal()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(
    () => {
      if (isModalOpen) {
        removeModal()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname],
  )

  return <></>
}

export default ScrollToTop
