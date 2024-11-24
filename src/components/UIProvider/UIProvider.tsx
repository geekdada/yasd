import React, { createContext, useCallback } from 'react'
import { z, ZodObject } from 'zod'

import Confirmations from './components/Confirmations'

import type {
  ConfirmProperties,
  FormConfirmProperties,
  SimpleConfirmProperties,
} from './types'

interface UIState {
  confirmations: ConfirmProperties[]
}

type ConfirmResult<T> = T extends FormConfirmProperties
  ? z.infer<ZodObject<T['form']>> | false
  : T extends SimpleConfirmProperties
    ? boolean
    : never

interface UIContext extends UIState {
  confirm: <P extends ConfirmProperties, T = ConfirmResult<P>>(
    properties: P,
  ) => Promise<T>
  cleanConfirmation: (index: number) => Promise<void>
}

const UIContext = createContext<UIContext | undefined>(undefined)

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [uiState, setUIState] = React.useState<UIState>({
    confirmations: [],
  })

  const confirm = useCallback<UIContext['confirm']>(async (properties) => {
    const isFormConfirm = 'form' in properties

    return new Promise<any>((resolve) => {
      const newConirmation = isFormConfirm
        ? ({
            ...properties,
            open: true,
            onConfirm: (result) => {
              resolve(result)
            },
            onCancel: () => {
              resolve(false)
            },
          } as FormConfirmProperties)
        : ({
            ...properties,
            open: true,
            onConfirm: () => {
              resolve(true)
            },
            onCancel: () => {
              resolve(false)
            },
          } as SimpleConfirmProperties)

      setUIState((prevState) => {
        return {
          ...prevState,
          confirmations: [...prevState.confirmations, newConirmation],
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
