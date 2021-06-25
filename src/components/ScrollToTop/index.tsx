import { useModal } from '@sumup/circuit-ui'
import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

function useScrollMemory(): void {
  const history = useHistory<{ scroll: number } | undefined>()

  useEffect(() => {
    const { push, replace } = history

    // Override the history PUSH method to automatically set scroll state.
    history.push = (path: string) => {
      push(path, { scroll: window.scrollY })
    }
    // Override the history REPLACE method to automatically set scroll state.
    history.replace = (path: string) => {
      replace(path, { scroll: window.scrollY })
    }

    // Listen for location changes and set the scroll position accordingly.
    // @ts-ignore
    const unregister = history.listen((location, action) => {
      window.scrollTo(0, action !== 'POP' ? 0 : location.state?.scroll ?? 0)
    })

    // Unregister listener when component unmounts.
    return () => {
      unregister()
    }
  }, [history])
}

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation()
  const { isModalOpen, removeModal } = useModal()
  useScrollMemory()

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
