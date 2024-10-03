import { createContext } from 'react'

export type Context = {
  top: number
  left: number
  right: number
  bottom: number
}

const context = createContext<Context | null>(null)

export default context
