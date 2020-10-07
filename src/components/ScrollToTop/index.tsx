import React from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return <></>
}

export default ScrollToTop
