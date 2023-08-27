import React, { createContext, useCallback } from 'react'

import Confirmations from './components/Confirmations'

import type { ConfirmProperties } from './types'

interface UIState {
  confirmations: ConfirmProperties[]
}

interface UIContext extends UIState {
  confirm: (properties: ConfirmProperties) => Promise<boolean>
  cleanConfirmation: (index: number) => Promise<void>
}

const UIContext = createContext<UIContext | undefined>(undefined)

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [uiState, setUIState] = React.useState<UIState>({
    confirmations: [],
  })

  const confirm = useCallback(async (properties: ConfirmProperties) => {
    return new Promise<boolean>((resolve) => {
      setUIState((prevState) => {
        return {
          ...prevState,
          confirmations: [
            ...prevState.confirmations,
            {
              ...properties,
              open: true,
              onConfirm: () => {
                if (properties.onConfirm) {
                  properties.onConfirm()
                  resolve(true)
                } else {
                  resolve(true)
                }
              },
              onCancel: () => {
                if (properties.onCancel) {
                  properties.onCancel()
                  resolve(false)
                } else {
                  resolve(false)
                }
              },
            },
          ],
        }
      })
    })
  }, [])

  const cleanConfirmation = useCallback(async (index: number) => {
    setUIState((prevState) => {
      const confirmations = [...prevState.confirmations]
      confirmations[index].open = false

      return {
        ...prevState,
        confirmations,
      }
    })

    await new Promise((resolve) => setTimeout(resolve, 200))

    setUIState((prevState) => {
      const confirmations = [...prevState.confirmations]
      confirmations.splice(index, 1)

      return {
        ...prevState,
        confirmations,
      }
    })
  }, [])

  return (
    <UIContext.Provider
      value={{
        ...uiState,
        confirm,
        cleanConfirmation,
      }}
    >
      <Confirmations />

      {children}
    </UIContext.Provider>
  )
}

export const useConfirm = () => {
  const context = React.useContext(UIContext)

  if (context === undefined) {
    throw new Error('useConfirm must be used within a UIProvider')
  }

  return context.confirm
}

export const useConfirmations = () => {
  const context = React.useContext(UIContext)

  if (context === undefined) {
    throw new Error('useConfirmations must be used within a UIProvider')
  }

  return {
    confirmations: context.confirmations,
    cleanConfirmation: context.cleanConfirmation,
  }
}
